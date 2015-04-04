---
layout: post
title: "Factual Driver .NET Client Library Documentation"
meta-description: ""
tags: ["asp.net","factual","factual-driver"]
categories: ["factual-asp-net-driver"]
migrated: "true"
permalink: "/factual-asp-net-driver/documentation/"
---
###Update 08/07/2012 
For latest documentation please see [factual-csharp-project][1] on github.

###Introduction
FactualDriver is a .NET client library for consuming Factual API. It abstracts creation of queries, oAuth header signing and synchronous web request/response process. It's easy to use and you can get a response from factual in 2 lines of code. It also exposes a generic access to signed HttpWebRequest if you need more granular control or if you decide that you need to call Factual in asynchronous matter. 

###Getting started
From you nuget package manager console install FactualDriver package

    PM> Install-Package FactualDriver

Next, you create an instance of the factual driver with your consumer key and consumer secret key that you received from Factual. And the simplest way to get data is to use a RawQuery function which will take table name as the first parameter and your raw url query and return you a json result string.

    Factual client = new Factual("YourConstumerKey","YourConsumerSecret");
    string jsonResponse = client.RawQuery(""t/global", "filters={\"name\":\"Star\"}");

As an option you can use included JSON.NET parser to convert response into a C# dynamic object.

    dynamic json = JsonConvert.DeserializeObject(jsonResponse);
    string status = (string)json.status;

###Filters

Building query string by hand is error prone, hard to maintain and just not pretty. As you might have noticed, Factual API uses json serialized object in the query string for filters, and uses a simple key value pair for other parameters like limit, or include_count. You can see a full list of parameters [here][2].

Rather than hacking string together, driver provides an object oriented way of creating parameters. IFilter classes provide a structure for parameters and are flexible enough to work with future api changes. Let's take a look at first filter..

####RowFilter
Constructor Signature:

    RowFilter(string fieldName, string comparisonOperator, object compareToValue)

You create a row filter by providing a field name, operator and an object value. The reason compareToValue is an object is because you should be able to provide a simple type like integer as well as an array that will get serialized into json. For a list of field and operators see factual [documentation][3].  

Here is how we create a row filter that instructs api to return all record where locality is not Los Angeles and Northridge and execute a query.

    var filter = new RowFilter("locality", "$nin", new [] { "Los Angeles", "Northridge"});
    string result = Factual.Query("t/global", filter);

The query will get serialized into `{"locality":{"$nin":["Los Angeles","Santa Monica"]}}`, and you have compiler checking,intellisense, and no hacking together curly braces. 

If you filter is a simple equal you can use a shorthand constructor: 

    public RowFilter(string fieldName, object compareToValue). 

Which will result in something like this {"region":"CA"}, which is acceptable shorthand according to factual documentation.

Let's see another example where use string rather than array to filter data.

    var filter = new RowFilter("name", "$search", "Charles"); 
Outputs:`{"name":{"$search":"Charles"}}`

####GeoFilter
Geofilter is very similar in terms of usage to RowFilter, except you provide different parameters of latitude and longitude along with radius distance in meters.

Signature:

    GeoFilter(decimal latitude, decimal longitude, int distance)

Usage:

    var geoFilter = new GeoFilter(34.06018m, -118.41835m, 5000);
    string result = Factual.Query("t/restaurants-us", geoFilter);

You also have an option to override shape of the filter, the default shape is $circle by setting GetFilter's Shape property. As well as override distance units by setting DistanceUnits property. However according to the [documentation][4] there are no other shapes available as of yet, so this might be useful in the future.

####SearchFilter

Search filter only takes one parameter which is the search string. Here is an example:

    var filter = new SearchFilter("Vegan,Los Angeles");
    string result = Factual.Query("t/restaurants-us", filter);

####Filter - Other parameters - Combining FIlters
There are other parameters like limit and offset and sort etc. Those are sent to factual as basic key value pair and not a serialized json object. There is also a wrapper for those properties, Filter. Here is an example of setting a limit on the query and combining it with RowFilter.

    var limitFilter= new Filter("limit", "20");
    var rowFilter = new RowFilter("name", "$bw", "Star");
    string result = Factual.Query("t/restaurants-us", rowFilter, limitFilter);


####ConditionalRowFilter
There is also a conditional operators that allows you to set AND or OR operator and group your row filters together.

    var filter = new ConditionalRowFilter("$and", new[]
                 {
                   new RowFilter("name", "$search", "McDonald's"),
                   new RowFilter("category", "$bw", "Food & Beverage")
                 });

First parameter takes a string operator value $and or $or and second takes a collection of RowFilter types. Result will get serialized into an api query like this: 

    "filters={\"$and\":[{\"name\":{\"$search\":\"McDonald's\"}},{\"category\":{\"$bw\":\"Food & Beverage\"}}]}"

#HttpWebRequest
Factual.Query or Factual.RawQuery will create a synchronous web request and will also synchronously get a response back from factual, read it as a string and return to the caller. If you have a high traffic environment that's probably not what you going to want because the number of process threads is limited and when you call outside service synchronously it uses it up a thread, and if you have more users than your threads then your application will come to a screeching halt. So if you are planning on experiencing a very high traffic, you want to call factual api asynchronously. And you can do that by getting an HttpWebRequest object directly from Factual.CreateWebRequest(string query) and then executing the request asynchronously. 

CreateWebRequest accepts a raw url query but you are also not on your own here. You can create your filters and then call JsonUtil.ToQueryString and it will serialize a collection of filters into correct json query string. 

That's it for now, please let me know if you have any questions or if something I missed. 


  [1]: https://github.com/Factual/factual-csharp-driver
  [2]: http://developer.factual.com/display/docs/Core+API+-+Read#CoreAPI-Read-OptionalParameters
  [3]: http://developer.factual.com/display/docs/Core+API+-+Row+Filters
  [4]: http://developer.factual.com/display/docs/Core+API+-+Geo+Filters