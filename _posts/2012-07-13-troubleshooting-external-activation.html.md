---
title: "SQL Server Service Broker troubleshooting external activation"
meta-description: ""
meta-keywords: ""
publish-date: "2012-07-13"
tags: ["service-broker","external-activation"]
categories: ["sql-server-service-broker"]
migrated: "true"
permalink: "/sql-server-service-broker/troubleshooting-external-activation"
---
Since I've been working with Service Broker I realized how tricky it is to administer and hard to see overall picture. I still come across behaviors I don't understand, and now sure how exactly to reproduce them, they just happen randomly. However I did make a lot of progress on troubleshooting and can get most things back up and running again. 

##Dialogs

It's important to know that dialogs are **two way** conversations.  Before you send a message to the target you open a dialog conversation. And it will stay open until your target picks it up, calls end conversation and then your initiator side will end conversation as well. Only after your conversation will be closed. And **closed conversation is a successful conversation**. You have to monitor your conversations to make sure they all get closed properly during development and troubleshooting.

    --all going conversations
    select * from sys.conversation_endpoints

Clean up conversations, DON'T USE THIS IN PRODUCTION AS conversations will get deleted.

**Update 7/18/2012** 
Please note when you remove all conversations it will also disable all EventNotification and so your event notifictions will need to be dropped and created again.

    -- clean up all conversations, DEVELOPMENT ONLY 
    declare @conversation uniqueidentifier
    while exists (select 1 from sys.conversation_endpoints with (nolock))
    begin
    set @conversation = (select top 1 conversation_handle from sys.conversation_endpoints with (nolock) )
    end conversation @conversation with cleanup
    end

If you are building some kinda of a tool that will show the status of your messages you will probably want to save conversation handles and map it to the id of your message that way you can trace back to what's going on with your message.

##Event notifications
Event notifications add extra learning of how notifications work, and know how to fix them. 

First thing you define your event notification

    CREATE EVENT NOTIFICATION EventNotificationTargetQueue
        ON QUEUE dbo.TargetQueue
        FOR QUEUE_ACTIVATION
        TO SERVICE 'ExternalActivatorService', 'E56C42F3-9885-0000-8983-7CA3B5C32362';

and you should see it in 

    --see event notifications
    SELECT * FROM sys.event_notifications

I found that if you clean up your conversations sometimes event notifications will disappear, so it's a good idea to keep an eye on the sys.event_notifications if you activation is not being triggered.

Now we get to the fun part. After we have turned on activation on a queue and send a message, the queue will go into a NOTIFIED state. When queue goes into a notified state the external activation queue will receive a message saying that the queue has been activated. The question is, does the external activation queue receives an activation message for each message that goes into a queue, the answer is no. Only when a queue is not in NOTIFIED state then when you put a message into a queue it will trigger an activation queue message and put queue into NOTIFIED. 

    --see queue monitors 
    select * from sys.dm_broker_queue_monitors m with (nolock)
    join sys.service_queues q with (nolock) on m.queue_id = q.object_id

And there are times when queue can get stuck in NOTIFIED state and you have no message in the queue. If that happens you will have to run this command

    RECEIVE TOP(0) * FROM TargetQueue;

If the messages were cleared improperly this will fix the queue and set it back to INACTIVE state.

##Event notification troubleshooting

It's important to understand that every time you create an event notification that creates a queue monitor for your queue, you can view queue monitors:

    select * from sys.dm_broker_queue_monitors m with (nolock)
    join sys.service_queues q with (nolock) on m.queue_id = q.object_id

So even if you can see your event notifications in `SELECT * FROM sys.event_notifications` it does not mean that your queue will activate an event. It must have both queue monitor and state of the queue monitor is not in NOTIFIED state.

In addition, conversations on event notifications are not meant to be closed by calling "end dialog". They need to stay open or in "CONVERSING" to properly dispatch notifications. The conversation on event notification will only get ended when you drop your event notification.
If your queue in `sys.dm_broker_queue_monitors` is in the INACTIVE state and you see your event is in the sys.event_notifications, and your you still don't receive activation messages, what happened is your conversation on the event notification got ended.  To fix you can drop and create notification and it will work again. 

That's it for now, good luck troubleshooting external activation!