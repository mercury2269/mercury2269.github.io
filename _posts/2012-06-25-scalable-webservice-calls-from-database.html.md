---
layout: post
title: "Service Broker: Scalable Web Service Calls From SQL Database"
meta-description: ""
tags: ["asynchronous","trigger","sql-server","web-services","service-broker"]
categories: ["sql-server-service-broker"]
migrated: "true"
permalink: "/sql-server-service-broker/scalable-webservice-calls-from-database/"
---
##What can Service Broker do for you.
You might not have heard of the Service Broker before, I know I haven't up until a month ago and after learning what it can do, I think all .NET developers should at least be familiar with it. It comes free with SQL Server and no additional installation is required. Some of the highlights for me are asynchronous triggers, reliability, offloading of long running batch jobs or activating external applications that might call for example Web Services. And some other great but rarely used features like Sql Server notifying the application layer when the data has changed which can be combined with a caching layer to make a very efficient and fast application. In fact list goes on.

### Asynchronous triggers
First of all triggers in the SQL database are synchronous and they do an implicit lock on the database tables when an operation on the table is happening. I'm not a big fan of triggers myself, but there are time when you have no choice but use them. For example if you have no control when table gets update from application layer and you need to have some sort of processing when record is modified, deleted or added. So Service Broker solves this problem by creating a message queue for items that need to be processed instead of processing them right away. That in result creates asynchronous triggers because messages are sent to be processed when resources are available. 

### Reliable messaging

Another great benefit of Service Broker is that it provides a reliable mechanism of a messaging queue. Message only gets de-queued when a processing application processes a message and commits a transaction and message can be taken off the queue. If your SQL Server shuts down all your messages stay in the queue as it works just like any other sql table. If processing fails, the message never leaves the queue and will get retried shortly.

### External activation
External activation might sound alien right now, but it's not hard to understand. Basically when message arrives at the service broker queue you will need to provide an activation (or what is going to process that message). There are two types of activation internal or external. Internal activation is a stored procedure or a stored procedure calling a SQLCLR, it's basically everything that happens inside of SQL server instance. External activation is when SQL notifies an external process (completely outside of sql) that some change is waiting to be processed. What external activation allows is to offload tasks that don't belong inside of SQL server like calling Web Services or some kind of long running batch processes that communicate with other systems. In addition external activation does not require deployment of .NET assemblies inside of SQL Server and does not require SQLCLR.

### Other
There are a lot of other features like a reliable replication between SQL Servers, scalable distributed messaging queues and many others. Many of which will most likely be handles by a SQL DBA. What got me started on Service Broker is figuring out how to asynchornously call Web Services from a database trigger and I think it does an awesome job of doing that. Also while reading the [Pro Service Broker book][1] I found out that it can do manage code notifications that can for example invalidate cache in your application layer.

##No more theory, let's implement asynchornous triggers calling web services!

Service Broker is a part of the Microsoft SQL Server and doesn't need to be installed separately, just enabled. like this: 

    SELECT name, is_broker_enabled FROM sys.databases 
    ALTER DATABASE [<dbname>] SET ENABLE_BROKER WITH ROLLBACK IMMEDIATE;

After we need to setup SQL Service Broker with needed objects.

Message types, these define types of messages being sent and received, we'll use well formed xml, and for type you want a unique name a url is used by convention:

    CREATE MESSAGE TYPE [http://blog.maskalik.com/RequestMessage]
	VALIDATION = WELL_FORMED_XML
	
    CREATE MESSAGE TYPE [http://blog.maskalik.com/ResponseMessage]
    	VALIDATION = WELL_FORMED_XML

Contract defines how messages are being sent:

    CREATE CONTRACT [http://blog.maskalik.com/ImportContract]
    (
    	[http://www.lampsplus.com/DOMOrderImportRequestMessage] SENT BY INITIATOR,
    	[http://www.lampsplus.com/DOMOrderImportResponseMessage] SENT BY TARGET
    )

Now we will need two queues to hold our target messages (messages which will be processed by an activation program) and response messages for initiator which we will get as a response from activation program and processed by initiator).

    CREATE QUEUE InitiatorQueue
    WITH STATUS = ON
    
    CREATE QUEUE TargetQueue

Here I need to point out that in order for service broker to be reliable it uses a concept of dialogs basically once conversation dialog is open **both sides will need to close conversations on their ends**. It also happens that messages only get's de-queued when the conversation end is received from another party. It will make more sense later.

Next, we will need to create a services, which is basically a service that routes messages, you will need to specify a contract defined earlier, like this:

    CREATE SERVICE InitiatorService
    ON QUEUE InitiatorQueue 
    (
    	[http://blog.maskalik.com/Contract]
    )
    
    CREATE SERVICE TargetService
    ON QUEUE TargetQueue
    (
    	[http://blog.maskalik.com/Contract]
    )

Since we will be using external application activation we need to disable internal activation on the target queue. To enable external activation Service Broker send a message to the external activation queue when a message arrives at the target queue. This allows for centralizing all external queue notification. And as my co-worker [Vincent][2] pointed out this external queue can be used across databases, so there will be one central external notification queue for for all databases.

Let's create that notification queue

    CREATE QUEUE ExternalActivatorQueue

Then we will also need a service for that queue, as you see it uses a generic contract provided by microsoft for event notifications:

    CREATE SERVICE ExternalActivatorService
    ON QUEUE ExternalActivatorQueue
    (
    	[http://schemas.microsoft.com/SQL/Notifications/PostEventNotification]
    )

Finally we subscribe to the internal QUEUE_ACTIVATION event on our "TargetQueue", so that we will receive notification in our ExternalActivationQueue when the TargetQueue gets messages. 

    CREATE EVENT NOTIFICATION EventNotificationTargetQueue
    	ON QUEUE TargetQueue
    	FOR QUEUE_ACTIVATION
    	TO SERVICE 'ExternalActivatorService', 'current database';

Here comes the time to create our SQL trigger which instead of doing a synchronous operation will quickly send a message to the queue for later instead of processing it. This is the concept of asynchronous triggers at work, we are firing and forgetting instead of waiting for response right away. The most important part is the **SEND ON CONVERSATION @ch
MESSAGE TYPE [http://blog.maskalik.com/RequestMessage] (@messageBody);** this is where we send the message to the queue.
Creating a sample order table and a trigger which will send a message when a new order is inserted:

    CREATE TABLE [Order]
    (
    	ID UNIQUEIDENTIFIER NOT NULL,
    	Amount MONEY NOT NULL
    )
    
    -- Trigger will add a message into a ImportQueue
    CREATE TRIGGER OnOrderInserted ON [Order] FOR INSERT
    AS
    BEGIN 
    	BEGIN TRANSACTION;
    		DECLARE @ch UNIQUEIDENTIFIER
    		DECLARE @messageBody NVARCHAR(MAX);
    
    		BEGIN DIALOG CONVERSATION @ch
    			FROM SERVICE [InitiatorService]
    			TO SERVICE 'TargetService'
    			ON CONTRACT [http://blog.maskalik.com/Contract]
    			WITH ENCRYPTION = OFF;
    		
    		-- Construct the request message
    		SET @messageBody = (SELECT ID, Amount FROM [Order] FOR XML AUTO, ELEMENTS);
    
    		-- Send the message to the TargetService
    		;SEND ON CONVERSATION @ch
    		MESSAGE TYPE [http://blog.maskalik.com/RequestMessage] (@messageBody);
    	COMMIT;
    END	
    GO

So now when we add an order the trigger will send a message which will see it in our TargetQueue and ExternalActivationQueue. Target queue will wait for someone to process and ExternalActivationQueue will wait until external activation program will read that message.

![Results from queues][3]

What do I mean by external activation program... Well that's the program that listens to the Activation Queue and basically reads messages and starts predefined application for that queue. And when application starts it knows that it has to read it's designated queue and process messages in it. Luckily Microsoft already create that [external activation service application][4] and it is available [here][5], scroll down and you will see Microsoft® SQL Server® Service Broker External Activator for SQL Server® 2008 R2.

After you install the service, you will need to read documentation and edit the config file. It's pretty trivial to do, you will need to specify your database name where activation queue is, your targetqueue name and which executable file to run when a message comes to the targetqueue. If you are having problems take a look at the error log, that helped me to get it up and running. Once you have configuration done, start the service and it will run if there are no configuration issues. Also keep in mind that service is only designed to work in integrated security mode.

But before you start the service we need to create an app that will process our messages and notify the queue that we have successfully processes so it can end the conversation and de-queue the message. I will spare showing a complete source code, you can see it in the attached sample. But highlights are:

It's a console application that has a `while (true)` loop it uses ADO.NET to send Service Broker Command to RECEIVE message on the specified queue. That takes a message, but still keeps it on the queue until commit is called

    ...
    broker.tran = broker.cnn.BeginTransaction();
    broker.Receive("TargetQueue", out msgType, out msg, out serviceInstance, out dialogHandle);
    
    if (msg == null)
    {
        broker.tran.Commit();
        break;
    }
    
    switch (msgType)
    {
        case "http://blog.maskalik.com/RequestMessage":
        {
            //right here we call a web service or whatever processing you do
            //also use T-SQL to parse @msg from the queue to get data
            broker.Send(dialogHandle, "<Response><OrderId>1</OrderId><Status>Processed</Status></Response>");
        }
        case "http://schemas.microsoft.com/SQL/ServiceBroker/EndDialog":
        {
             broker.EndDialog(dialogHandle);
             break;
        }
    }

    broker.tran.Commit();
    ...

Basically the transaction only gets committed when we process message and that takes a message of the queue hence the reliability of the message processing, remember it is important to end conversations on both ends.

When reply is sent from an external .NET application we need to process it inside the SQL Server. For this we will use an internally activated service which will call a stored procedure which will simply take that message, parse xml and insert it into a table. 

    CREATE PROCEDURE ProcessResponseMessages
    AS
    BEGIN
    	DECLARE @ch UNIQUEIDENTIFIER;
    	DECLARE @messagetypename NVARCHAR(256);
    	DECLARE	@messagebody XML;
    	DECLARE @responsemessage XML;
    
    	WHILE (1=1)
    	BEGIN
    		BEGIN TRANSACTION
    
    		WAITFOR (
    			RECEIVE TOP(1)
    				@ch = conversation_handle,
    				@messagetypename = message_type_name,
    				@messagebody = CAST(message_body AS XML)
    			FROM
    				InitiatorQueue
    		), TIMEOUT 1000
    
    		IF (@@ROWCOUNT = 0)
    		BEGIN
    			ROLLBACK TRANSACTION
    			BREAK
    		END
    
    		IF (@messagetypename = 'http://blog.maskalik.com/ResponseMessage')
    		BEGIN
    			INSERT INTO ProcessedOrders (ID, SentTime) VALUES 
    			(
    				@messagebody.value('/Response/OrderId[1]', 'INT'),
    				GETDATE()
    			)
    		END
    
    		IF (@messagetypename = 'http://schemas.microsoft.com/SQL/ServiceBroker/EndDialog')
    		BEGIN
    			-- End the conversation
    			END CONVERSATION @ch;
    		END
    
    		COMMIT TRANSACTION
    	END
    END
    GO

Finally we alter our InitiatorQueue to turn on internal activation with provided stored procedure.

    ALTER QUEUE InitiatorQueue
    WITH ACTIVATION 
    (
    	PROCEDURE_NAME = ProcessResponseMessages,
    	STATUS = ON,
    	MAX_QUEUE_READERS = 1,
    	EXECUTE AS OWNER
    )

##Final words

It seems like a lot of configuration and setup, and it is. However what you do get is offloading of processing of your message outside of SQL Server which can call something like Web Services. You will also get reliability and scalability that service broker offers. And you don't have to deploy assemblies into SQL and there is many other things you can do like paralel processeing, conversetion group locking and a ton of other things that you will need to read for yourself in [Pro SQL Service Broker 2008 book][1]. Good luck! 

  [1]: http://www.amazon.com/gp/product/1590599993/ref=as_li_ss_tl?ie=UTF8&tag=sermassblo-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=1590599993
  [2]: http://fordevsbydevs.blogspot.com
  [3]: /uploads/12-06/QueuesAfterInsert.png
  [4]: http://blogs.msdn.com/b/sql_service_broker/archive/2008/11/21/announcing-service-broker-external-activator.aspx
  [5]: http://www.microsoft.com/en-us/download/details.aspx?id=16978