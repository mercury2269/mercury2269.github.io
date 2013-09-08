---
title: "Single Page Applications - Exciting Next Step In Evolution"
meta-description: ""
meta-keywords: ""
publish-date: "2013-03-26"
tags: []
categories: ["spa"]
migrated: "true"
permalink: "/spa/introduction"
---
##SPAs bring new fresh user experience
The web is constantly evolving. About 7 years ago we didn’t know what jQuery was and AJAX was mostly associated with the cleaning product. Now it’s 2013 and it is no longer enough to sprinkle simple AJAX calls to get some dynamic data without refreshing the page. Modern applications run completely in the browser and provide a very fast and intuitive user interface.  In addition, it creates a new user experience that makes it feel fresh and vibrant, while going back to standard web sites with postbacks feel clumsy and slow. No wonder new startups are embracing this concept. It gives you an edge and can make or break a company when dealing with competition.

We also see a rise of backend technologies that focus on returning JSON and embracing RESTful web services. One of the example is recent addition of the ASP.NET Web API framework from Microsoft. And of course a numerous amount of javascript frameworks for building SPAs. [Here is a list with comparison of many of them.][1] 

##New concept, need same good programming principles

Since we are moving away from simple javascript and stepping into the realm of building complex applications in the browser we must apply time tested design principles for building maintainable, testable and readable software. We want our applications to be easy to change and understand. And the user interface get changed more frequently than anything else. Therefore it’s extremely important to have good design, follow patterns and separate your concerns.

> Any fool can write code that a
> computer can understand. Good
> programmers write code that humans can
> understand.
-  Martin Fowler

Javascript libraries for building SPAs give you a nice starting point, but what I have discovered is that it leaves a lot of open questions and ability to shoot yourself in the foot when you don’t understand the concepts. There are however frameworks like EmberJs that will force you into doing things the predefined way, which would probably be a great starting point for beginners. But again it won’t give you as much flexibility of building a framework that works for you.

##Foundation Ingridients

So where do we start, how do we begin this journey of re-inventing ourselves. Well what do you do when you start learning a new language? I usually pick up a good book on that language and learn the basics.

###Javascript language
Since Javascript is the language of SPAs you as developer cannot longer get aways with simple functions or jQuery selectors. Just like any language other language you need to give it full credit and pick up a book and learn how to compose your objects, modules, how inheritance works and so on. Luckily there are excellent books out there. One of them that I thought was straight to the point and a must read is:

<a href="http://www.amazon.com/gp/product/0596806752/ref=as_li_ss_il?ie=UTF8&camp=1789&creative=390957&creativeASIN=0596806752&linkCode=as2&tag=sermassblo-20"><img border="0" src="http://ws.assoc-amazon.com/widgets/q?_encoding=UTF8&ASIN=0596806752&Format=_SL110_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=sermassblo-20" ></a><img src="http://www.assoc-amazon.com/e/ir?t=sermassblo-20&l=as2&o=1&a=0596806752" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />


###Learning the patterns
After learning the language, if you are not familiar with MV* patterns used most SPAs you will need to learn and understand them in order to know where things go. It helps that patterns have already been discussed thoroughly for other UI frameworks that are similar to SPAs like WPF and Silverlight. So there are plenty of resources and solutions that already have been hashed out. [Rob Eisenberg][2] has compiled [a great list][3] of resource on learning the presentation patterns. 



###Unit tests
Once you know how to separate your concerns and not to mix DOM access code with application logic with you will be able to greatly improve your code quality and maintainability by writing unit tests. You can start by going through a list of articles on testing here http://superherojs.com/

##Paying your dues and evolving

Once you pay your dues and learning Javascript language along with patterns and principle and unit testing you will have a good foundation to make a maintainable application that will be easy to change, understand and will stand the test of time.

Finally on a more general note we as developers must learn to evolve. What’s awesome is that all the good programming principles that you’ve learned over the years can be applied at everything. It comes down to learning new patterns and language. And patterns knowledge would last a lot longer than frameworks or even languages. I’m excited to step on this road of learning and discovering. Are you with me?


  [1]: http://blog.stevensanderson.com/2012/08/01/rich-javascript-applications-the-seven-frameworks-throne-of-js-2012/.
  [2]: http://devlicio.us/blogs/rob_eisenberg/
  [3]: http://devlicio.us/blogs/rob_eisenberg/archive/2010/05/01/mvvm-study-interlude.aspx