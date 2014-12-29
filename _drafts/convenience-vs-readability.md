---
layout: post
title: "Convenience vs Readability"
meta-description: ""
meta-keywords: ""
categories: 
  - fundamentals
tags:
  - firsttag
---

Function example

	private void LoadCurrencyItems()
	{
		var url = ConfigurationManager.AppSettings["CurrencyFeedUrl"];
		var account = ConfigurationManager.AppSettings["CurrencyAccountName"];
		var web = new WebClient();
		var urlToCall = string.Format("{0}?{1}", url, account);
		var response = web.DownloadString(urlToCall);

		// Create a directory for rate files in case we need to re-parse them later
		if (!Directory.Exists(_ratesBackupFolder))
		{
			Directory.CreateDirectory(_ratesBackupFolder);
		}

		// Save response to file
		File.WriteAllText(Path.Combine(_ratesBackupFolder, string.Format("{0}_{1}_{2}.xml", account.ToLowerInvariant(), _baseCurrencySymbol.ToLowerInvariant(), DateTime.Now.ToString("yyyy-MM-dd-HH-mm-ss-fff"))), response);
		
		var baseCurrencyName = ConfigurationManager.AppSettings["BaseCurrencyName"];
		
		Logger.InfoFormat("Attempting to load daily exchange rates for currency: {0}. Calling URL {1}", _baseCurrencySymbol,
						  urlToCall);
		var xmlDoc = XDocument.Load(new StringReader(response));

		var statusXmlElement = xmlDoc.Descendants("header")
									 .SingleOrDefault(a => a.Descendants("hname").First().Value == "Status");
		...
	}



Refactored example:

	private void ProcessDailyCurrencyFeed()
	{
		var config = ReadConfiguration();
		var feed = DownloadCurrencyFeed(config);
		BackupReport(report, config);
		var report = ParseCurrencyFeed(feed);

		InsertReportIntoDatabase(report);
		...
	}	


