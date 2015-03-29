---
layout: post
title: "Creating Service Broker Status Dashboard With Knockoutjs"
meta-description: "Step by step guide on creating a service broker health status dashboard using knockoutjs and webmethods"
tags: ["service-broker","knockoutjs"]
categories: ["sql-server-service-broker"]
migrated: "true"
permalink: "/sql-server-service-broker/queue-health-status-dashboard/"
---
###What am I trying to solve.. 

*If you are not familiar with Service Broker you can still use this as an example for Knockoutjs and ASP.NET Webmethods.*

The biggest pain point with Service Broker (SB) is how long it takes to understand what exactly is happening when you a have a problem. In order to find a problem sometimes you need to execute good amount of queries, read through the results analyze them and eventually find out what the issue is. It becomes a lot more complicated when you have event notifications and queue monitors on your queues. And if you don't always work with SB you will eventually forget how things work.

In this post we will have some fun building a color coded status page which will show status of our queues, events, messages and queue monitors. It should be as easy as glancing at the screen and if anything is red that means there is a problem. As a bonus you can also add internal activation on your own. 

### Create a health status query

    SELECT * FROM 
    (
    SELECT Q.Name
       ,CASE
            WHEN EN.name LIKE '%QueueActivation'
                THEN 'Activation'
            WHEN EN.name LIKE '%QueueDisabledEmail'
                THEN 'DisabledEmail'
            WHEN EN.name LIKE '%QueueDisabled'
                THEN 'Resolve'
        END AS EventLetter
       ,QM.state
       ,Q.is_enqueue_enabled AS [Enabled]
       ,po.rows AS MessageCount
       ,Q.is_activation_enabled as InternalActivationEnabled
       ,Q.activation_procedure	as InternalActivationProcedureName   
    FROM sys.service_queues AS Q
       JOIN sys.objects AS o ON o.parent_object_id = Q.object_id
       JOIN sys.partitions AS po ON po.object_id = o.object_id
       JOIN sys.objects AS qo ON o.parent_object_id = qo.object_id
       LEFT JOIN sys.event_notifications AS EN ON Q.object_id = EN.parent_id
       LEFT JOIN sys.dm_broker_queue_monitors AS QM ON Q.object_id = QM.queue_id
    WHERE Q.is_ms_shipped = 0
       AND po.index_id = 1) DataTable PIVOT 
       ( COUNT(EventLetter) FOR EventLetter IN ( [Activation], [Resolve], [DisabledEmail] ) 
    ) AS pvt 

To summarize we get all queues in the current database with their message count from partitions view. Btw this query has very low cpu cost on sql and executes in less than 10ms.  We also left join event notifications and queue monitors since those are really important when you have external activation. I also pivot the event notifications and give them all similar name since they all represent same function but with different queue name. The result data looks like this: 


<table><tbody><tr><th>Name</th><th>State</th><th>Enabled</th><th>MessageCount</th><th>InternalActivation</th><th>Activation</th><th>Resolve</th><th>DisabledEmail</th></tr><tr><td>SampleInitiatorQueue</td><td>INACTIVE</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr><tr><td>SampleTargetQueue</td><td>INACTIVE</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td></tr><tr><td>SecondInitiatorQueue</td><td>INACTIVE</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr><tr><td>SecondTargetQueue</td><td>INACTIVE</td><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>1</td></tr></tbody></table>

This gives us some information, but you still need to know if there is something wrong, that's where we put knockoutjs to work and color code our results.

### Create View Model

    var SM = SM || {};
    SM.QueueHealthModel = function () {
        var self = this;
        //Data
        self.loadedHealthData = ko.observable();
        self.ajaxErrors = ko.observable();
        //Behaviours
        self.loadHealthData = function () {
            SM.data.getQueueHealthData(self.loadedHealthData);
        };
    
        self.loadHealthData(); //execute on load
    };

And required data function

    SM.data = {
        getQueueHealthData: function (callback) {
            $.ajax({
                type: 'POST',
                url: 'Default.aspx/GetAllQueueHealthStatus',
                data: '{}',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    var data = { healthStatus: msg.d };
                    callback(data);
                }
            });
        }
    };

###Webmethod
Use your favorite data access tool and return an array of data transfer objects
 

       [WebMethod]
        public static QueueHealthStatus[] GetAllQueueHealthStatus()
        {
            return MyRepository.GetAllQueueHealthStatus();
        }

###Html 
Finally we'll add our html markup with knockout bindings

    <!-- Errors -->
    <div data-bind="visible: ajaxErrors">
    <h2 style="margin: 10px 0;">Ajax communication error please check app layer</h2>
    <p style="color: red" data-bind="text: ajaxErrors"></p>
    </div>
    
    <!-- Health Status -->
    <table class="queue-status newspaper-a" data-bind="with: loadedHealthData">
        <thead><tr><th>Queue</th><th>State</th><th>Enabled</th><th>Message Count</th><th>Internal Activation</th><th>Activation</th><th>Resolve</th><th>Disabled Email</th></tr></thead>
        <tbody data-bind="foreach: healthStatus">
            <tr>
                <td data-bind="text: QueueName, click: $root.goToImportLog" class="pointer"></td>
                <td data-bind="text: State, style: { backgroundColor: SM.format.stateColor(State, QueueName) }"></td>
                <td data-bind="text: Enabled, style: { backgroundColor: SM.format.queueEnabledColor(Enabled) }"></td>
                <td data-bind="text: MessageCount, style: { backgroundColor: SM.format.messageCountColor(MessageCount), fontWeight: MessageCount > 0 ? 'bold' : 'normal' }"></td>
                <td data-bind="text: InternalActivationEnabled, style: { backgroundColor: DOM.format.internalActivationColor(QueueName,InternalActivationEnabled) }, attr: { title: InternalActivationProcedureName }"></td>
                <td data-bind="text: ActivationEventEnabled, style: { backgroundColor: SM.format.activationColor(QueueName, ActivationEventEnabled) }"></td>
                <td data-bind="text: ResolveEventEnabled, style: { backgroundColor: SM.format.resolveColor(QueueName, ResolveEventEnabled) }"></td>
                <td data-bind="text: EmailOnDisabledEventEnabled, style: { backgroundColor: SM.format.disableEmailColor(QueueName, EmailOnDisabledEventEnabled) }"></td>
            </tr>
        </tbody>
    </table>

###Color utility functions

To break down formatting: 

 - If the queue manager is INACTIVE, it's a normal state. NOTIFIED is yellow because it could be stuck in the notified state when activation is not working properly.
 - If queue is disabled that automatic red.
 - If message count is greater than 10, we set color to yellow.
 - For each activation we have individual functions that look at queue name and the state of the activation and figure out if the state is correct. For example disabled email activation is valid on all queues, where activation notification is only valid on target queues. 
  
Format color functions used in knockoutjs bindings. We use immediate function to return an object with functions so the variables used inside don't pollute global namespace and accessible to the internal functions.

    SM.format = (function () {
        var green = '#9AFF9A',
        red = '#FF6347',
        yellow = 'yellow';
        return {
            stateColor: function (state, QueueName) {
                if (QueueName === 'ExternalActivationQueue') {
                    return 'white';
                }
                if (state === null) {
                    return red;
                }
                if (state === 'NOTIFIED') {
                    return yellow;
                }
                if (state === 'INACTIVE') {
                    return green;
                }
            },
            queueEnabledColor: function (value) {
                if (value) {
                    return green;
                }
                return red;
            },
            messageCountColor: function (numberOfMessages) {
                if (numberOfMessages > 10) {
                    return yellow;
                }
                return green;
            },
            activationColor: function (QueueName, exists) {
                if (QueueName.toLowerCase().indexOf("target") !== -1) {
                    if (exists) {
                        return green;
                    }
                    return red;
                }
                if (!exists) {
                    return green;
                }
            },
            internalActivationColor : function (queueName, exists) {
                if (queueName.toLowerCase().indexOf("initiator") !== -1 {
                    if (exists) {
                        return green;
                    }
                    return red;
                }
                if (!exists) {
                    return green;
                }
            },
            resolveColor: function (QueueName, exists) {
                if (QueueName.toLowerCase().indexOf("target") !== -1) {
                    if (exists) {
                        return green;
                    }
                    return red;
                }
                if (!exists) {
                    return green;
                }
            },
            disableEmailColor: function (QueueName, exists) {
                if (exists) {
                    return green;
                }
                return red;
            }
        };
    } ());

###Error handling and loading indicator
There is an awesome jquery ajax global event handler that will catch all ajax exceptions, it's especially useful when you have many queries running on the page and you don't want to add error handling logic to each one.

    $('body').ajaxError(function (event, request) {
        model.ajaxErrors(request.response);
    });

There is also one for loading we can use like this. 

    $(".loadingIndicator").ajaxStart(function () {
        $(this).fadeIn('fast');
    }).ajaxComplete(function () {
        $(this).fadeOut('fast');
    });

That's it. Now when something is wrong with your service broker, it's very easy to just glance at the screen to understand if something is wrong. You can get more creative and add timeout polling so you can watch how service broker works in real time. And you can also add tool tips on how to resolve issues and maybe even buttons that will fix issues directly from dashboard. Sky is the limit, and this is a good start in the right direction in my opinion.