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

###Logstash Log4js appender
Using [log4js-logstash](https://github.com/gembly/log4js-logstash) appender, I specify the following in the log4js config. 

	{
	  "appenders": [
		{
		  "type": "log4js-logstash",
		  "host": "10.0.0.10",
		  "port": 5959,
		  "fields": {
			"app": "my-app",
			"env": "dev"
		  }
		}
	  ],
	  "replaceConsole": true
	}

Fields are nice to have if you want to tag your logs with application name or environment, so you can tell where the logs are coming from. 

###Logstash parsing
I place patterns into the `/etc/logstash/patterns` folder.  
Express Pattern
    EXPRESSHTTP %{IP:clientip} - - \[%{DATA:timestamp}\] \"%{WORD:verb} %{URIPATHPARAM:request} HTTP/%{NUMBER:httpversion}\" %{NUMBER:response} (?:%{NUMBER:bytes}|undefined) \"%{URI:referrer}?\" \"%{DATA:agent}\" %{NUMBER:response_time}

###Logstash input and filter

	input {
	  tcp {
		codec => "json"
		port => 5959
		type => "my-app"
	  }
	}
	filter {
	  if [type] == "my-app" {
		mutate {
		  rename => { "[@fields][app]" => "app" }
		  rename => { "[@fields][category]" => "category" }
		  rename => { "[@fields][env]" => "env" }
		  rename => { "[@fields][level]" => "priority" }
		  rename => { "category" => "logger_name" }
		  rename => { "@message" => "message" }
		}
	  }
	  if [type] == "my-app" and [logger_name] == "http" {
		grok {
		  patterns_dir => "/etc/logstash/patterns"
		  match => { "message" => "%{EXPRESSHTTP}" }
		  add_field => ["received_at", "%{@timestamp}"]
		  remove_field => ["message"]
		}
		date {
		  match => ["timestamp", "EEE, dd MMM YYYY HH:mm:ss zzz"]
		  remove_field => "timestamp"
		}
	  }
	}
In the above config, I perform a number of renames on the nested fields so it can have short and clear names.  And in the final if clause, I checks if the logger_name is marked with "http" and then perform a grok parsing of the logs. It's also good to add received time and then parse the actual log time as in the date pattern. 

