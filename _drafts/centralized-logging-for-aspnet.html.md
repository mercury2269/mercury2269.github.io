---
layout: post
title: "Centralized Logging for ASP.NET"
meta-description: ""
meta-keywords: "Log4net, IIS Logs, centralized logging, log consolidation"
categories: 
  - logging
tags:
  - logging
---

Logs are developer's best friends. They make troubleshooting, monitoring and investigation of applications running in production possible. Logs help you to keep track not only of exceptions but also issues in the business logic, and allow you to trace back an issue to a particular user. I feel like if an application doesn't have logging it basically like an airplane without gauges, you never know what's going on with it, you assume it's flying while it could be on the course to the ground. 

You might be already on top of it and got your application logs written to the file system with Log4Net, unhandled exceptions in Elmah, and IIS logs on disk. But how do you approach about finding an issue. A lot of times you need to look at the HTTP requests generated in IIS logs so you can trace back the steps the user took. You start off with LogParser and write a query to parse your log files. Depending on the size of your logs it could take a while to get the information you need and if you have more than one node this get's multiplied. It's there but it's painful to consume even with great tools like LogParser. Next you find to find an exception for that user, oh wait your unhandled exceptions don't have information like order number or user id so it's and on top Elmah doesn't have a search capability in it's UI, it's just a list of logs. I'm going to cut to the chase and say that if you have an enterprise system with multiple nodes, the troubleshooting and log parsing is not managable, painful, and takes a lot of time. Don't know about you, but I'd rather spend time doing some interesting projects than parsing logs.

Many people solved this problem, and there are commercial products that can receive your logs, index and then display them to you. The problem with that is that you are sending your precious data to someone else, and who knows what type of security they have. One of the awesome alternatives, that I found works really well for distributed application, is an open source stack that will aggregate, store, index and have a nice UI for you to graph and slice and dice your data. Elastich Search, Logstash, Kibana or ELK for short is an awesome. I've been using for over a year and makes your life as a developer a whole lot easier and frees up a lot of your time.

## Breaking down the ELK stack

Logstash is receiver of your logs, it has many adapters to receive logs from many locations, then you can filter, tag, parse (grok in logstash terms) and the send to a storage mechanism like elastich search. Logstash makes your text data meaningful and queryable. You setup regular epxression patterns for plain text like IIS logs or you can opt in and send your logs as JSON which makes it very flexible to modify log schema. 

Lostash sends meaninful data to many outputs. ElasticSearch is a good choice for storage since it's fast, scalable and provides rich search query capabilities. Advantage of using ElaticSearch is that there is also a nice UI for it, Kibana, that will show you graphs and logs for your filters. 

Kibana is basically an HTML site with Javascript and can run on any web server that can serve static pages. It saves it's dashboards directly into the ElasticSearch. This is also a small disadvantage since it doesn't provide any authentication. But you can work around it and setup a reverse proxy with Nginx and ask users for a passwrod. 








