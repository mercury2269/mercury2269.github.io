---
layout: post
title: "Amazon SQS Message Processor"
meta-description: "Writing windows service to process messages from the Amazon SQS."
meta-keywords: "win32 service, windows service, amazon sqs, aws sqs, message queue, guaranteed delivery, asynchronous http calls"
categories: 
  - message-queue
tags:
  - windows-service
  - message-queue
  - amazon-sqs
---


There are mission critical pieces in any business application that might call external services via some sort of an external API over the local network or Internet. The problem with delivering messages over the network is that networks sometime have a tendency to drop messages and cause timeouts. There is a [great paper][1] on Kyle Kingsbury's blog where him and [Peter Bailis][2] provide a list of evidence that failures can happen in many levels of the network or operation system. And it's not only network that can fail, the receiving 3rd party applications might also be down, under load and slow to respond.

> Processes, servers, NICs, switches, local and wide area networks can all fail, and the resulting economic consequences are real. ... The consequences of these outages range from increased latency and temporary unavailability to inconsistency, corruption, and data loss.

Therefore, if we want to have a reliable communication with external services we need to implement some kind of a retry mechanism that can redeliver messages and recover from faults.

##Solving Guaranteed Delivery
Message Queue is one of the solutions that can address this problem and guarantee delivery. Rather than calling an external API within the application process, like a web request, you place a message into the reliable and durable message queue that guarantees that your message will be delivered to the consumer at least once. Since putting a message on the queue is usually a fast operation, it also speeds up your application performance. Most message queues guarantee delivery by providing some sort of a mechanism of acknowledging if message has been received by the consumer. And if consumer doesn't respond after a period of time the message gets returned into the queue so it can get processed again. This basically guarantees that a message will get delivered or retried for a certain pre-configured number of times. 

There are numerous [alternative][3] Message Queue solutions with each addressing certain problems in it's own way. Since the main specification for calling critical services is guaranteed delivery and we are not building something like a high throughput trading application, the Amazon SQS provides the best alternative to the self-hosted MQs. One of the benefits is that you don't have to administer message queue servers and spend a lot of time figuring out how to setup redundant clusters for reliability and worry about network partitions. Of course you loose on speed of placing a message into the queue. But a 20ms average put call to SQS is also good enough for this problem.

Until you figure out if you actually need something faster and spend all the time to learn and setting up the MQ cluster, I think Amazon SQS provides the best bang for your time. It's easy to understand, has a great SDK and it's ready to go. It's also not very expensive. A million calls costs $1. Yes you do have to poll the queue, but you can also use the [long polling][4] and that will reduce the number of calls of one consumer to 1 call every 20 seconds (if no activity), which is about 120k calls per month, or about 12 cents.

Putting a message into the queue is [trivial][5] and doesn't need more explanation. What is not trivial is creating a reliable application with workers to process the messages. We also want the ability to start multiple workers so they can process messages from the queue in parallel rather than one at a time. Since many workers can be started on one node and run in parallel we need our service efficiently use the CPU resources meaning not blocking threads while waiting for I/O.

I wasn't able to find an open source application that can always listen to the queue and process messages as they come in. So I needed to write my own. A good candidate for this task is a Win32 Service, since it provides a platform for always running service that can also self restart itself on fault and boot up with windows automatically. 

##Creating Message Processor Win32 Service
The windows service must always be running, meaning that each worker will have a main while loop that will continue indefinitely. Also you need to start multiple workers so you have to use some sort of multi threaded solution. 
My initial version was to new up multiple Threads that invoke an asynchronous method. Like this: 

    protected override void OnStart(string[] args)
    {
         for (int i = 0; i < _workers; i++)
       {
          new Thread(RunWorker).Start();
       }
    }

    public async void RunWorker()
    {
      while(true)
      {
        // .. get message from amazon sqs sync.. about 20ms
        var message = sqsClient.ReceiveMessage();
    
        try
        {
           await PerformWebRequestAsync(message);
           await InsertIntoDbAsync(message);
        }
        catch(SomeExeception)
        {
           // ... log
           //continue to retry
           continue;
        }
        sqsClient.DeleteMessage();
      }
    }

And it was working fine, however there is a problem with this code. The initial threads that were created would exit once the first execution of the method would hit first await. So there was really no point of creating those threads. In addition, I wasn't passing a cancellation token to threads so I could not signal it to shut down whenever I wanted to gracefully exit the service. Thanks to [Andrew Nosenko][6] who pointed out [a better and cleaner way][7] of accomplishing the same goal using tasks.

Rather than starting threads manually you start each task and add it to the List<Task> collection. This way the threadpool is efficiently managing your threadpool threads and schedules it according to the system resources. 

    List<Task> _workers = new List<Task>();
    CancellationTokenSource _cts = new CancellationTokenSource();
    
    protected override void OnStart(string[] args)
    {
      for (int i = 0; i < _workers; i++)
      {
        _workers.Add(RunWorkerAsync(_cts.Token)); 
      }
    }

And inside of the RunWorkerAsync's while loop you call `token.ThrowIfCancellationRequested();`  that will throw OperationCancelException and exit the thread when the cancel is requested. 

With windows service when you start a service the main Win32 Service thread gives you some time to start your processes and it must return quickly, meaning not to get blocked. So your OnStop method is where you have to call your `Task.WaitAll(_workers)` which blocks the current thread until all workers have completed their tasks. So once the OnStop method begins you signal the cancellation token to cancel the tasks, and then you call Task.WaitAll and wait until all tasks run to completion. If all tasks have been completed prior to calling WaitAll it would just continue so there is no risk that it could finish faster. The OnStop method looks like this:

    _cts.Cancel();
    try
    {
        Task.WaitAll(_workers.ToArray()); 
    }
    catch (AggregateException ex) 
    {
        ex.Handle(inner => inner is OperationCanceledException);
    }

It uses an AggregateException.Handle method which will throw any unhandled exceptions after it finished running. And since we are only expecting OpearationCanceledException it will just return. 

##Polishing it up

One problem with windows service application is that it's hard debug, you cannot just attach the debugger to the running win32 service. To work around this problem we will use a [topshelf project][8]. Topshelf allows you to run your windows service just like you would run a console application with the ability to debug and step through the code. It also make it easier to configure, install and uninstall the service. 

Here is a quick sample code that will make a message processor console application into a Win32 service.

    public class MessageProcessor
    {
        List<Task> _workers;
        CancellationTokenSource _cts;
        public MessageProcessor()
        {
            _workers = new List<Task>();
            _cts = new CancellationTokenSource();
        }
        public void Start() {  //.. same as above }
        public void Stop() { //.. same as above }
    }
    
    public class Program
    {
        public static void Main()
        {
            HostFactory.Run(x =>                                 
            {
                x.Service<MessageProcessor>(s =>                        
                {
                   s.ConstructUsing(name=> new MessageProcessor());     
                   s.WhenStarted(tc => tc.Start());              
                   s.WhenStopped(tc => tc.Stop());               
                });
                x.RunAsLocalSystem();                            
    
                x.SetDescription("Amazon SQS Message Processor");        
                x.SetDisplayName("AmazonSQSMessageProcessor");                       
                x.SetServiceName("AmazonSQSMessageProcessor");                       
            });                                                  
        }
    }

Once you build an executable, you can run `MessageProcessor.exe install` from command line and the service will get installed, additional -help will show you all the commands that you can do. 

##Summary

Incorporating queues in your application architecture can help with guaranteed delivery of the business critical messages. It can also speed up your application process since it will offload the work to the external process. On the downside, your application becomes dependent on another application running in a separate process and it's more code to maintain and deploy. To ensure you message processor doesn't become a single point of failure, you will also need to have at least 2 nodes running this windows service for redundancy. However, if your business requires guaranteed delivery for the mission critical API calls, the overhead of maintaining message queue solution is worth it's weight. 


  [1]: http://aphyr.com/posts/288-the-network-is-reliable
  [2]: https://twitter.com/pbailis/
  [3]: http://queues.io/
  [4]: http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html
  [5]: http://docs.aws.amazon.com/AWSSdkDocsNET/latest/DeveloperGuide/send-sqs-message.html
  [6]: http://nozillium.com/
  [7]: http://stackoverflow.com/questions/25001764/always-running-threads-on-windows-service#answer-25009215
  [8]: http://topshelf-project.com/