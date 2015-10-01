---
layout: post
meta description: null
tags: null
published: false
title: Log4js Http Request Parsing with Logstash
---

Log4js comes with a [connectlogger](https://github.com/nomiddlename/log4js-node/wiki/Connect-Logger) that can capture express/connect http requests and output them to our logs. And to make sense of logs I prefer to use ELK Stack with Logstash parsing the incoming logs, Elastic Search indexing, and Kibana for displaying and making sense of the data. 

In the http request logs I find it useful to include response times, therefore I prefer to customize the default output format of the logs to include this data. 

Here is the default format with response times appended to the end. 

	var httpLogFormat = ':remote-addr - - [:date] ":method :url ' +
    					'HTTP/:http-version" :status :res[content-length] ' +
                        '":referrer" ":user-agent" :response-time';
	app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto', format: httpLogFormat }));

Example output: `10.201.44.200 - - [Tue, 29 Sep 2015 04:52:53 GMT] "GET / HTTP/1.1" 302 66 "" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36" 2`

###Logstash parsing
I place patterns into the `/etc/logstash/patterns` folder.
Express Pattern
    EXPRESSHTTP %{IP:clientip} - - \[%{DATA:timestamp}\] \"%{WORD:verb} %{URIPATHPARAM:request} HTTP/%{NUMBER:httpversion}\" %{NUMBER:response} (?:%{NUMBER:bytes}|undefined) \"%{URI:referrer}?\" \"%{DATA:agent}\" %{NUMBER:response_time}