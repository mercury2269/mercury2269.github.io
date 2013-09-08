---
title: "Service Broker: Setup Email Notifications On Disabled Queues"
meta-description: ""
meta-keywords: ""
publish-date: "2012-07-21"
tags: ["service-broker","sql-server"]
categories: ["sql-server-service-broker"]
migrated: "true"
permalink: "/sql-server-service-broker/setup-disabled-queues-email-notification"
---
It took me some time to figure our this part even though it should be trivial. So hopefully this guide will help someone in the future. I think the hardest part was to understand the security context under which internal stored procedures run when activated by service broker.

First thing you need to do is to create a DisabledQueueNotificationQueue. I know I know, it's a little redundant name but what it means is that you have a queue that receives notifications when other queues get disabled, therefore redundant name.


    CREATE QUEUE dbo.DisabledQueueNotificationQueue

Create service endpoint with PostEventNotification message type

    CREATE SERVICE DisabledQueueNotificationService
    ON QUEUE DisabledQueueNotificationQueue
    (
    	[http://schemas.microsoft.com/SQL/Notifications/PostEventNotification]
    )
    GO

Next is we need to setup a notification procedure which will execute msdb.dbo.sp_send_mail

    CREATE PROCEDURE [dbo].[spServiceBroker_SendDisabledQueueEmailNotification]
    WITH EXECUTE AS OWNER
    AS
    	DECLARE @ch UNIQUEIDENTIFIER
    	DECLARE @messagetypename NVARCHAR(256)
    	DECLARE	@messagebody XML
    	DECLARE @queueName varchar(100)
    	DECLARE @emailTo VARCHAR(500)
    	
    	
    	SET @emailTo = 'someaddress@yahoo.com'
    
    	WHILE (1=1)
    	BEGIN
    		BEGIN TRY
    			BEGIN TRANSACTION
    
    			WAITFOR (
    				RECEIVE TOP(1)
    					@ch = conversation_handle,
    					@messagetypename = message_type_name,
    					@messagebody = CAST(message_body AS XML)
    				FROM DisabledQueueNotificationQueue
    			), TIMEOUT 60000
    
    			IF (@@ROWCOUNT = 0)
    			BEGIN
    				ROLLBACK TRANSACTION
    				BREAK
    			END
    
    			IF (@messagetypename = 'http://schemas.microsoft.com/SQL/Notifications/EventNotification')
    			BEGIN
    				SET @queueName = 'Disabled queue: ' + @messagebody.value('/EVENT_INSTANCE[1]/ObjectName[1]', 'VARCHAR(100)');
    				
    				EXEC msdb.dbo.sp_send_dbmail 
    					@profile_name = 'DBA_Notifications',
    					@recipients = @emailTo,
    					@body = @queueName,
    					@subject = @queueName;
    				
    			END
    			
    			IF (@messagetypename = 'http://schemas.microsoft.com/SQL/ServiceBroker/Error')
                BEGIN
    				  DECLARE @errorcode INT
    				  DECLARE @errormessage NVARCHAR(3000)
                      -- Extract the error information from the sent message
                      SET @errorcode = (SELECT @messagebody.value(
                            N'declare namespace brokerns="http://schemas.microsoft.com/SQL/ServiceBroker/Error"; 
                            (/brokerns:Error/brokerns:Code)[1]', 'int'));
                      SET @errormessage = (SELECT @messagebody.value(
                            'declare namespace brokerns="http://schemas.microsoft.com/SQL/ServiceBroker/Error";
                            (/brokerns:Error/brokerns:Description)[1]', 'nvarchar(3000)'));
    
                      -- Log the error
    
                      -- End the conversation on the initiator's side
                      END CONVERSATION @ch;
                END
    
    
    			IF (@messagetypename = 'http://schemas.microsoft.com/SQL/ServiceBroker/EndDialog')
    			BEGIN
    				-- End the conversation
    				END CONVERSATION @ch;
    			END
    
    			COMMIT TRANSACTION
    		END TRY
    		BEGIN CATCH
    			ROLLBACK TRANSACTION
    			DECLARE @ErrorNum INT
    			DECLARE @ErrorMsg NVARCHAR(3000)
    			SELECT @ErrorNum = ERROR_NUMBER(), @ErrorMsg = ERROR_MESSAGE()
    			-- log the error
    			BREAK
    		END CATCH
    	END

The important piece is that this procedure will execute as owner which will be a dbo schema when service broker activates the internal procedure.

Next we add the queue internal activation

    ALTER QUEUE DisabledQueueNotificationQueue
    WITH ACTIVATION 
    (
    	PROCEDURE_NAME = dbo.spServiceBroker_SendDisabledQueueEmailNotification,
    	STATUS = ON,
    	MAX_QUEUE_READERS = 1,
    	EXECUTE AS OWNER
    )

Finally we create an event notification to send messages when queue gets disabled into the DisabledQueueNotifiactionQueue

    CREATE EVENT NOTIFICATION DisabledTargetQueueNotification
        ON QUEUE dbo.TargetQueue
        FOR BROKER_QUEUE_DISABLED
        TO SERVICE 'DisabledQueueNotificationService', 'current database';

If we try to simulate a poison message and rollback receive 5 times the procedure won't execute and will log an error: 

> The EXECUTE permission was denied on
> the object 'sp_send_dbmail', database
> 'msdb', schema 'dbo'.

This is expected since the activated stored procedure is calling an msdb database and has no permissions since it is in the public context. Since I trust other database on my sql server I thought that enabling trustworthy would fix this problem: `ALTER DATABASE [msdb] SET TRUSTWORTHY ON`. But apparently the setup of my sql server would still not allow a public process to access system database. So the only one thing that was left to do is to create a certificate and sign the procedure so it would be trusted.

    CREATE CERTIFICATE spServiceBroker_SendDisabledQueueEmailNotificationCertificate
    	ENCRYPTION BY PASSWORD = 'SommePass91'
    	WITH SUBJECT = 'spServiceBroker_SendDisabledQueueEmailNotification signing certificate'
    GO
    
    ADD SIGNATURE TO OBJECT::[spServiceBroker_SendDisabledQueueEmailNotification]
    	BY CERTIFICATE [spServiceBroker_SendDisabledQueueEmailNotificationCertificate]
    	WITH PASSWORD = 'SommePass91'
    GO
    
    
    --------------------------------------------------------------------------------
    -- We leave the private key so we can resign the procedure later if it changes.
    -- If we remove the certificate the whole thing will need to be recreated
    --------------------------------------------------------------------------------
    --ALTER CERTIFICATE spServiceBroker_SendDisabledQueueEmailNotificationCertificate
    --	REMOVE PRIVATE KEY
    --GO
    
    BACKUP CERTIFICATE [spServiceBroker_SendDisabledQueueEmailNotificationCertificate]
    	TO FILE = 'c:\spServiceBroker_SendDisabledQueueEmailNotificationCertificate.cert'
    GO
    
    USE msdb
    GO
    
    CREATE CERTIFICATE [spServiceBroker_SendDisabledQueueEmailNotificationCertificate]
    	FROM FILE = 'c:\spServiceBroker_SendDisabledQueueEmailNotificationCertificate.cert'
    GO
    
    
    CREATE USER [spServiceBroker_SendDisabledQueueEmailNotificationUser]
      FROM CERTIFICATE [spServiceBroker_SendDisabledQueueEmailNotificationCertificate]
    GO
    
    GRANT AUTHENTICATE TO [spServiceBroker_SendDisabledQueueEmailNotificationUser]
    
    GRANT EXECUTE ON [sp_send_dbmail] TO [spServiceBroker_SendDisabledQueueEmailNotificationUser];

Now that the procedure has access to the `sp_send_dbmail` we have no issues and if you simulate poison message, you should receive an email notification with the name of the queue.