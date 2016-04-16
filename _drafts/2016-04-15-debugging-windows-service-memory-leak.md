---
layout: post
category: blog
meta description: null
tags: 
  - "windows-service"
published: false
title: Debugging Windows Service Memory Leak
---

I recently spent about a week chasing multiple memory leaks in the Windows Service application and learned a few important things while doing it. I'll list the important lessons in this post. 

The application is a windows service that runs on multiple machines with its primary function of reading messages off multiple Amazon SQS queues and processing it. Each up runs multiple types of workers with, each autoscaled to process a certain maximum number of messages in parallel. All jobs are executed using Task Parallel Library and is using async/await for IO calls.

## Lesson first: Before of DbContext

In the long running service if DbContext is not properly disposed it will keep track of all the entities that were saved or updated. The recommended way to create one DbContext per unit of work and dispose of it after we are done. Similar to keeping one DbContext per http request in web application, you want to have one DbContext per message that needs to be processed.   
