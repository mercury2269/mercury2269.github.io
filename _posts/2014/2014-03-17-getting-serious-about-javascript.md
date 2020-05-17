---
layout: post
title: "Getting Serious About JavaScript"
meta-description: "Why you should learn JavaScript today"
meta-keywords: "JavaScript learning, JavaScript resources, JavaScript books, JavaScript Open Source Libraries to read"
categories: 
  - javascript
tags:
  - javascript
  - learning
  - book-recommendations
---
### Why Should I Care About JavaScript?
If you want to build next generation platforms or web applications you have to get serious about JavaScript. Rich user interfaces, or Single Page Applications, provide a much better user experience and give products an edge over competition. Many new applications like DropBox, Trello, Windows Azure and many others are a great example of amazing user experience. In addition, JavaScript is already very widely used on the server side as well. It's incredably fast, asynchronous out of the box, and is a perfect backend for your single page applications. Finally, it has a huge ecosystem with almost as [many NPM][1] packages than the largest platform, and catching up really fast. As we've seen before where community goes that's where the next most widely used platform will be. 

And it's not only startups that choose Node.js, recently a company like PayPal [announced][2] that they chose Node.js to be an application platform of choice. And some great benefits they reported so far:

> Built almost twice as fast with fewer people <br />
Written in 33% fewer lines of code <br />
Constructed with 40% fewer files

From my personal experience I can also say that development JavaScript is real fun, it's very fast and I enjoy learning functional nature of it. [Paul Graham][3] chose Lisp because it allowed them at ViaWeb to ship code faster than competition. I feel like JavaScript has that advantage now as well. It's also functionals and it has a large number of open source project that you can pick and choose, so you don't have to reinvent the wheel. So why wouldn't you use it if you had to choose a platform? 

### It's time to get serious about learning JavaScript

Writing large application will require developers to actually pick up few books and finally learn the language. You can no longer get away with hacking together bunch of spaghetti code with global variables. Good news is that now there are a lot more good resources than there was few years ago. Couple great books that I had a pleasure of reding provide invaluable deep knowledge of the language. Another super resource for learning JavaScript is to read existing open source libraries. You can extract a large amount of knowledge for free if you are willing to roll up your sleeves and get uncomfortable. Finally, like any serious developers we want to write our components with help of unit tests. I've also found that testability of Javascript is extremely important, browser debugging is somewhat not efficient and you have to jump through different places due to Javascrit's asynchronous [event loop][4] nature. It's easier to test components individually then debug entire application.

So here are the books that I've really enjoyed and will get you up to speed if you are a seasoned pro in other languages like C# or Java. 
### Great Books
<a href="https://www.amazon.com/gp/product/0596806752/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=sermassblo-20&linkId=de59d671ccfa44ccf72017e21956d512&language=en_US" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0596806752&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=sermassblo-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=sermassblo-20&language=en_US&l=li2&o=1&a=0596806752" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />**JavaScript Patters**: I found this very helpful with breaking down different patterns of object creations, function types, and overall best practices. It packs a lot great stuff in about 200 pages and will give you a quick intro without going too deep into language itself. After I read this book, I was finally able to understand different object creation patterns and why you would use one over another. If you don't want to get too deep into language but want to actually write clean code and to be able to read existing librarires I think you can get away with this book. Because this book was written in 2010, most of the examples covered are following EcmaScript 3 standard, so it's great if you want to support old browsers. 

<a href="https://www.amazon.com/gp/product/1937785270/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=sermassblo-20&linkId=c38990424f8403c56f82020ea69d8ee3&language=en_US" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1937785270&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=sermassblo-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=sermassblo-20&language=en_US&l=li2&o=1&a=1937785270" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> **Async JavaScript** This is an awesome book to pick up next. It explains very well asynchronous functions, async error handling and event loop. This knowledge is a must for any serious JavaScript programmer. Every page of this book 80 page book is densely packed with information and you want to read it slow and enjoy every bit of it. It also dives into of how to make your callbacks cleaner with promises and deferreds. Finally it takes a look at existing async libraries that can make your life a lot more easier when dealing with multiple asynchronous functions. The biggest "aha" moment when I read this book was an understanding of how event loop queue works and why some libraries execute functions with setTimeout. 

<a href="https://www.amazon.com/gp/product/0321812182/ref=as_li_ss_il?ie=UTF8&linkCode=li2&tag=sermassblo-20&linkId=5c1ee3ce257de5b24e886ac07c335110&language=en_US" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0321812182&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=sermassblo-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=sermassblo-20&language=en_US&l=li2&o=1&a=0321812182" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" /> **Effective JavaScript** From the legendary Effective series, this book is lives up to it's standard. It goes deep into the language in a series of 68 topics. It's very good at breaking down and explaining topics and contains a wealth of knowledge. It actually explains intricate details about JavaScript semicolon insertion, implicit coercions, and a lot of other goodness like implicit binding of "this".  A lot of subjects are already covered in other books, but this book actually explains them in more detail and why things the way they are. It's not overly complex but it is very dense with information and joy to read. This is a must read for any serious developer who wants a deeper understanding of the JavaScript language. 

### Great JavaScript Libraries To Read
[Ghost][5] is a new, simple bloging platform that's build on top of Node.js with Express on backend and Backbone on the client. If you are looking to build a full stack applications with JavaScript this project will get you going. I found it a great way to get up to speed on how configuration, modules, and data access setup. Among other things you can learn about authentication, middleware, and see extensive use of deferreds.

[Backbone][6] What I like about backbone is that it has extensive suite of Unit Tests, the library itself is about 1700 lines of code, and it has very good comments. It's pretty incredible that such small library is the most widely used SPA library out there. I start with reading unit tests to understand the specifications. After I have general knowledge I would dive in to pieces that I find most interesting. 

[Express][7] Whether you are looking to build a Restful API or a traditional web application, express is great a minimalist framework on top of Node.js for that. It's pretty simple and genius and also has a pretty small code base. 

What others JavaScript libraries or books did you enjoy? Send me a line [@mercury2269][8]. 



  [1]: http://modulecounts.com/
  [2]: https://medium.com/paypal-engineering/node-js-at-paypal-4e2d1d08ce4f
  [3]: http://paulgraham.com/avg.html
  [4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/EventLoop
  [5]: https://github.com/tryghost/Ghost
  [6]: https://github.com/jashkenas/backbone
  [7]: https://github.com/visionmedia/express
  [8]: https://twitter.com/mercury2269
