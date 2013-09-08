---
title: "Prevent back button to serve cached content with ASP.NET"
meta-description: "How to tell browsers not to cache pages when clicking back button."
meta-keywords: ""
publish-date: "2012-04-02"
tags: ["asp.net","browser-cache"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/resolving-browser-back-button-with-caching-pages"
---
Browsers cache pages by default in order to quickly serve the content when back button is clicked. There are times however when you don't want that functionality. For example if your user logs out you don't want them to be able to press back button and navigate back to member page again. Or other scenarios where javascript updates shopping cart on the page, but when you hit back button on the page browser serves up content from cache which doesn't have the new item count in the cart.

Originally I've stumbled upon method below, but soon to discovered that it only works for some browsers including Internet Explorer.

       Page.Response.Cache.SetCacheability(HttpCacheability.ServerAndNoCache);

Which results in the following header attribute, which is enough for IE but not enough for other browsers like Firefox and Chrome.

       Cache-Control:no-cache

After doing more research on the browser cache headers I found [this comprehensive guide][1] that explains that no-cache does not necessarily tells the browser not to cache results:

> The “no-cache” directive, according to
> the RFC, tells the browser that it
> should revalidate with the server
> before serving the page from the
> cache. ...  In practice, IE and
> Firefox have started treating the
> no-cache directive as if it instructs
> the browser not to even cache the
> page. We started observing this
> behavior about a year ago. We suspect
> that this change was prompted by the
> widespread (and incorrect) use of this
> directive to prevent caching.directive to prevent caching.

We have used that header incorrectly just like the article said. And that's why we are seeing the random results for different browsers because originally the "no-cache" header is not the correct one to instruct browser not to cache the content. I'm guilty of this myself since when I first encountered this problem I quickly found the solution online and was happy to move on with my life, without trying to fully understand the intent of the Cache Control headers. 

After reading through and understanding what each header suppose to do it was clear that the correct header to instruct browsers not to cache pages is the **Cache Control: No-store**. In addition it's a good practice to include Cache Control: No-cache just to be on the safe side. And for sensitive content I think it's also good to tell proxies not to cache the http result for example account areas. And to do that we need to set **Cache-Control: private**. 

In ASP.NET we have the following method

    Response.Cache.SetNoStore();

Which sets headers to **Cache-Control:private, no-store**. That takes care almost everything and the only thing left to do is to append the recommended no-cache to be on the safe side

    Response.Cache.AppendCacheExtension("no-cache");

And now we have the desired headers: **Cache-Control:private, no-store, no-cache**

Please let me know if you find any situations where above code doesn't work. I'd like nail this problem once and for all.

Cheers

**Update 04-12-2012**

I've read another [good resource][2] on caching and think that adding expires header would also be beneficial for some other edge cases. So it wouldn't hurt to add to this to your code as well:

    Response.Expires = 0;

That brings us up to the three call that we need to make to make sure the page is not being cached:

    Response.Cache.SetNoStore();
    Response.Cache.AppendCacheExtension("no-cache");
    Response.Expires = 0;


  [1]: http://palpapers.plynt.com/issues/2008Jul/cache-control-attributes/
  [2]: http://www.mnot.net/cache_docs/