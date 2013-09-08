---
layout: post
title: "IE9 Redirect Caching Feature Might Cause Frustration"
meta-description: ""
tags: ["ie9","redirect","asp.net","browser-cache"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/ie9-redirect-caching-nightmare/"
---
If you have been doing web development for some time I'm sure you have come across internet explorer caching feature. A less known redirect caching feature that was released in IE9 has just caused me a day of frustration and hopefully it will save you a day of nightmare. 

From msdn article on [caching improvements][1] in IE9 

> Internet Explorer 9 now supports
> caching of HTTP redirect responses, as
> described by RFC 2616. Responses with
> Permanent Redirect status (301) are
> cacheable unless there are headers
> which forbid it (e.g. Cache-Control:
> no-cache) and those with Temporary
> Redirect status (302 or 307) are
> cacheable if there are headers which
> permit it (e.g. Cache-Control:
> max-age=120).

In that article it even warns developers that your "misconfigured" application might not work.

> While this significantly improves
> performance, web applications that are
> misconfigured might not work as
> expected

So unless you are up to date on all msdn internet explorer blog posts you wouldn't know that IE9 will cache your redirects unless you tell it not to. The problem with redirect caching is that if your server has some significant logic, like setting cookies on redirect it will no longer work in IE9, because the request will never be sent to the server.

What's worse is that when you are trying to troubleshoot it present itself as bizarre behavior. You see redirect happening in the "Net" tab of developer tools but it never hits your server. Doesn't hit any HttpModules or any part of asp.net request handling pipeline. And to add to insult Firefox works with no issues :) At one point you begin to imagine that maybe IE has some kind of a secret agreement with asp.net, but that's just your brain looking for ridiculous ways to justify the problem.

So the rule of thumb: **If you have a redirect that sets important cookies you will need to make sure that you tell IE not to cache the redirect.** You can read more about [caching headers][2] or to fix this problem simply add following lines to your redirect code.

    Response.Cache.SetNoStore();
    Response.Cache.AppendCacheExtension("no-cache");

  [1]: http://blogs.msdn.com/b/ie/archive/2010/07/14/caching-improvements-in-internet-explorer-9.aspx
  [2]: http://blog.maskalik.com/asp-net/resolving-browser-back-button-with-caching-pages