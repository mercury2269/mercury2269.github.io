---
layout: post
title: "<httpCookies domain=\"\" /> in Web.Config Is Not a Silver Bullet."
meta-description: ""
tags: ["asp.net","httpcookie","webconfig"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/httcookies-domain-web-config/"
---
If you are using `<httpCookies domain=".maskalik.com" />` element in your web.config you might think that all your cookies be default will have ".maskalik.com" domain set. I thought the same until I had to debug a weird problem where cookies were not being removed properly. 

Let's see if you can spot the problem, I certainly couldn't at first. We are checking if cookie is already set and removing it if it is.

    if (Request.Cookies["Color"] != null)
    {
        HttpCookie colorCookie = Request.Cookies["Color"];
        colorCookie.Expires = DateTime.Now.AddDays(-1);
        Response.Cookies.Set(colorCookie);
    }

By looking at the network tab in the internet explorer tools I can see that cookie that is being sent from the browser has a .maskalik.com domain. And server responds with expired cookie that has www.maskalik.com so the original cookie that browser sent does not match what the server sent therefore does not get removed. But how is that possible, all of our cookies should have domain specified by default. Apparently that's not the case. If you look at the implementation of the System.Web.HttpCookie you can see that default values are only set when you create a cookie by using a constructor:

    public HttpCookie(string name)
    {
      this._name = name;
      **this.SetDefaultsFromConfig();**
      this._changed = true;
    }
    
    public HttpCookie(string name, string value)
    {
      this._name = name;
      this._stringValue = value;
      **this.SetDefaultsFromConfig();**
      this._changed = true;
    }

So when we read values from the Request.Cookies collection those values don't have a domain set and we are expiring cookie with the different domain which doesn't remove the original cookie.

So our fix would be pretty simple, instead of getting an existing cookie we create a new cookie with the same name that way the default domain is going to get properly set by HttpCookie constructor. 

    if (Request.Cookies["Color"] != null)
    {
        HttpCookie colorCookie = new HttpCookie("Color");
        colorCookie.Expires = DateTime.Now.AddDays(-1);
        Response.Cookies.Set(colorCookie);
    }

Lesson learned, hopefully it will help someone. 