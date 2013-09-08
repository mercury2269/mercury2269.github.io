---
title: "Cross Domain Javascript Heartbeat"
meta-description: ""
meta-keywords: ""
publish-date: "2012-11-12"
tags: ["heartbeat","javascript"]
categories: ["javascript"]
migrated: "true"
permalink: "/javascript/cross-domain-keep-me-alive"
---
If you are working with a heartbeat or keep alive from client side that goes between protocols (http to https) you will soon discover that it's not as straightforward as simply sending an ajax request due to cross domain browser policy restrictions. So if your https version of the site has a secure cookie when you send an ajax request from unsecure page your request won't have any cookies in the header since browser blocks this communications.

One solution that I though was quickest and most effective was to replace Ajax call with creating of a hidden iframe that requests a page which then refreshes your secure session. Since we don't need any data and this is a fire and forget situation we don't really care about any communication from secure iframe to the unsecure page.

Below is the sample javascript that checks if the user has been active on the page (tracking hovering over links and textboxes and then creating a invisible iframe and attaching it to the body of the DOM.

    var SM = SM || {};
    SM.keepAlive = function () {
        var aliveUrl = 'https://blog.maskalik.com/keep-me-alive.aspx',
            interval = 60 * 1000 * 10,
            that = {},
            alive = false,
            timer = {};
    
        that.isActive = function () {
            alive = true;
        };
    
        that.removeTrackingIframeIfPresent = function () {
            var frame = document.getElementById('keep-alive-iframe');
            if (frame) {
                document.body.removeChild(frame);
            }
        };
        that.sendKeepAlive = function () {
            if (alive) {
                that.removeTrackingIframeIfPresent();
                var frame = document.createElement('iframe');
                frame.setAttribute('src', aliveUrl);
                frame.setAttribute('id', 'keep-alive-iframe');
                frame.setAttribute('style', 'display:none');
                document.body.appendChild(frame);
    
                alive = false;
            }
        };
    
        that.start = function () {
            var allTextareas = $('textarea');
            allTextareas.live('keyup', that.isActive);
    
            var allLinks = $('a');
            allLinks.live('click mouseover', that.isActive);
    
            timer = setInterval(that.sendKeepAlive, interval);
        };
    
        return that;
    };

And you start it on your page load or when you need it.

    var alive = SM.keepAlive();
    alive.start();

Also don't forget that your requests can also be cached by the browser so you keep alive could just be served from browser cache without extending your session. To fix that we can set HttpResponse to send no cache headers.

    Response.Cache.SetNoStore();
    Response.Cache.AppendCacheExtension("no-cache");

And there you have it a simple solution to a somewhat common problem.
