---
layout: post
title: "2 Legged OAuth with RestSharp"
meta-description: ""
tags: ["restsharp", "oauth", "asp.net"]
categories: ["asp.net"]
migrated: "true"
permalink: "/asp-net/restsharp-2-legged-oath/"
---

[Restsharp][1] is a nice little library that abstracts calling webservices in .NET. It also provides ability to add authenticators to web requests which add required oauth signatures and tokens. At first I didn't see the 2 Legged Oauth authenticator, but after almost going through the pain of making my own I've discovered that it does support 2 legged oauth. Here is how to create an authenticated 2 legged Oauth request.

```csharp
    var client = new RestClient(FactualApiUrl);
    client.Authenticator = OAuth1Authenticator.ForProtectedResource(oAuthKey, oAuthSecret, string.Empty, string.Empty);
    client.Execute(request);
```

Hopefully it will save you some time next time.

P.S. The latest .NET 4 version 103.1 in NuGet for some reason is missing the authenticators, so you can get a previous version or get latest from GitHub and compile and you shold have no problems.

[1]: https://github.com/restsharp/
