---
layout: post
title: "ASP.NET: Passing Optional Parameters to WebMethod"
meta-description: ""
tags: ["asp.net", "webmethod"]
categories: ["asp.net"]
migrated: "true"
permalink: "/asp-net/webmethod-optional-arguments-with-json/"
---

WebMethods are still very convenient when you are working with WebForms and need a quick way to return json to your client javascript application.

There is one caveat with webmethod arguments they cannot be nullable and you cannot make them optional. For example, method below would still expect limit argument and if you don't pass anything it will return an error.

```javascript
$.ajax({
    type: 'POST',
    url: 'Default.aspx/TestNullableArgument',
    **data: '{}',**
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
        callback(msg.d);
    }
});
```

```csharp
[WebMethod]
public static bool TestNullableArgument(int? limit)
{
    return true;
}

```

Will result in:

> Invalid web service call, missing
> value for parameter

One way we can fix is to add send a null parameter like this:

```csharp
$.ajax({
    type: 'POST',
    url: 'Default.aspx/TestNullableArgument',
    **data: '{"limit":null}',**
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
        callback(msg.d);
    }
});
```

However it still does not make `int? limit` argument optional and webmethod would always expect to have that parameter. A nice pattern if you need optional WebMethod arguements is to send argument data as serialized json object string and then de-serialize it in your webmethod.

For example we have a grid that needs to be searched, sorted and paged. However you don't always want to send all those parameters as null. A lot of times you want it paged but not sorted or filtered and you don't want to duplicate the code and overload all possible webmethod arguments. So by sending json string we create a dynamic parameters object which can have optional properties.

First we define our query object:

```csharp
public class GridQuery
{
    public int? Limit { get; set; }
    public int? Offset { get; set; }
    public string FilterType { get; set; }
    public string FilterTypeValue { get; set; }
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }
}
```

Modify our WebMethod to accept string gridQuery argument:

```csharp
[WebMethod]
public static Result GetGridData(string gridQuery)
{
    var query = JsonConvert.DeserializeObject<GridQuery>(gridQuery);
    ...
}
```

Now in our client javascript we can create a query object without having to specify all other options. And then send it as a serilized json parameter

```javascript
var params = { limit: 10, offset: 20 }

$.ajax({
    type: 'POST',
    url: 'Default.aspx/GetGridData',
    **data: "{'gridQuery':'" + JSON.stringify(params) + "'}",**
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (msg) {
        console.log(msg.d);
    }
});
```

Now when our object gets deserialized we have optional arguments. Simple and effective.
