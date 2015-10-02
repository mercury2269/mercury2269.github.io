---
layout: post
meta description: null
tags: 
  - logstash
published: true
title: Expressjs Http Request Parsing with Log4js and Logstash
---


I found it straight forward to configure expressjs to send http requests to logs and to setup log parsing. If you use log4js, there is a [connectlogger](https://github.com/nomiddlename/log4js-node/wiki/Connect-Logger) that can capture expressjs/connect http requests. Finally, to make sense of logs I prefer to use ELK Stack with Logstash parsing the incoming logs, Elastic Search indexing, and Kibana for functional dashboards.

I always like to include the response times of http requests. It helps with troubleshooting performance issues down the line. Below is the slightly modified default format with response time appended to the end. 

	var httpLogFormat = ':remote-addr - - [:date] ":method :url ' +
    					'HTTP/:http-version" :status :res[content-length] ' +
                        '":referrer" ":user-agent" :response-time';
	app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto', format: httpLogFormat }));

Example log output:

	10.201.44.200 - - [Tue, 29 Sep 2015 04:52:53 GMT] "GET / HTTP/1.1" 302 66 "" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36" 2

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
In order to parse our custom log we need create a logstash pattern, and place it into the `/etc/logstash/patterns` folder.  

Here is the pattern for parsing the log format above

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
In the above config, I perform a number of renames on the nested fields so it can have short and clear names.  And in the final if clause, I checks if the logger_name is marked with "http" and then perform a grok parsing of the logs. It's also good to add received time and then parse the actual log time as in the above date filter.
