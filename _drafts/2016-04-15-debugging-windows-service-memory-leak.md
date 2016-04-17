---
layout: post
category: blog
meta description: null
tags: 
  - "windows-service"
published: false
title: Debugging Windows Service Memory Leak
---

I went from windows service consuming 2GB of RAM and almost 100% CPU to 70MB with below 10% CPU. I didn't think it would be that simple to diagnose the memory leak, but it took a week and multiple itteration. I'll tell you the main tricks here so you don't waiste a week on it like I did. 

Little bit about the app. It is a windows service that reads messages off Amazon SQS queues and processes it. All messages are processed using Task Parallel Library and is using async/await for IO calls. At any given time there could be hundreds of async threadpool threads running with bursts to thousands.

## Review the code for obvious problems
In my case there weren't any obvious problems, but it would have saved a lot of time if I was able to idenfiy the issue fast.   

## Analyze memory dump from a production instance
In order to create a mini dump of memory from a running process you need to install windbg. You can download it from [debugging tools for windows](http://go.microsoft.com/fwlink/p?LinkID=271979). Next, you will need to open a task manager and check if the windows service is running under 32 bit process. If it is you need to run x86 version and if it's not you will need to use x64 version. Both versions are installed.

In the running WinDBG you want to click file -> attach to process and select the running process. This will pause the process, pausing all threads, and will break into it. At this point your windows service would not be doing any work until you resume it, so you have been warned. 

## Lesson first: Before of DbContext

In the long running service if DbContext is not properly disposed it will keep track of all the entities that were saved or updated. The recommended way to create one DbContext per unit of work and dispose of it after we are done. Similar to keeping one DbContext per http request in web application, you want to have one DbContext per message that needs to be processed.
