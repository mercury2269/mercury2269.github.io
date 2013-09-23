---
layout: post
title: "Going Database Free Feels Great"
meta-description: "There is a new trend in CMS platforms that generate static sites that are hosted without a database. It is simple and exciting and can make your site extremely fast"
meta-keywords: ""
categories:
  - jekyll
tags:
  - jekyll
---
##New Fresh Look At Old And Boring
I get excited when playing with frameworks that are different and challenge a widely accepted view on the subject at hand. One of those commonly accepted notion is that in order to build a Content Management System (CMS) you need a Web Server and a Database. A guy who challenged that notion is Tom Preston-Werner who in his original article ["Blogging Like a Haker"](http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html) was set out to fix his frustrations with existing systems. He wrote: 

> I was tired of complicated blogging engines like WordPress and  Mephisto. I wanted to write great posts, not style a zillion template pages, moderate comments all day long, and constantly lag behind the latest software release. 

He broke down the problem and realized the core of platform is your content, your layout and templating engine that will allow you to format and display your content. A simple genius solution that he came up with is a static site generator that would take your posts in form of a [markdown](http://daringfireball.net/projects/markdown/) files and run them through a generator that converts your layout and templates into a fully generated static site. 

##Jekyll a Perfect Fit


###Markdown Format
I already love markdown format I think it fits perfectly with the web. It allows you to craft simple web pages without HTML getting in your way and it's unified. Now there are numerous editors that support markdown so you get the choose the one you like rather than get stuck with what your CMS or blogging platform has to offer. Second your blog posts are physical text files that you can save in source control, back them up on Dropbox or anything else. And if you ever decided to switch platforms you can easily take and import those files to the new and shiny thing. 

###Simple HTML Layouts

You create your own simple HTML files and drop Liquid template variables to display the content. Super simple and powerful.

Here is an example of post page with template tags. 

    <div class='home entry'>
    	<h1>{{ page.title }}</h1>
		<span class="date">{{ page.date | date_to_long_string }}</span>
    	{{ content }}
		...
	</div>

All those page tags are also custom and you can define your own, it's basically as flexible as you can imagine. Here is an example 

    ---
    layout: post
    title: "Going Database Free Feels Great"
	tags: ['jekyll','cms']
	---

Date comes from the file name, Jekyll uses filename convention to pull the post date. So your post has to start with the date like `2013-09-21-myblogpost.html.md`

You can also generate sitemap and feed files. And define your own url structure, and much more.

###Super cheap
Did I mention that it's super cheap to host a static static, because you don't need that fancy web server and database. All you need is an Amazon S3 account and it will cost you pennies every month to run your site. You can just as easy host your site on Github for free. 

###Unlimited traffic

How many times have you seen articles on hacker news that when you click give you a nice 500 page error. That's because their Wordpress on the shared hosting cannot handle all the traffic and just bogs down. Well with static sites hosted in the cloud you get unlimited traffic potential out of the box. It will serve almost any amount of traffic you can throw at it. 

###Secure as it can get, don't need to maintain. 
The beauty of the static site is that it's simple and doesn't have any programming logic. You don't need to do any patches or security updates it's all just static html file goodness. Feels like we are back in 1996 and it's awesome!

###Static Site + CDN = FAST!
Now to my favorite part. Being a performance freak I have to admit that I decided to try it out because I knew that putting a CDN in from of the static site can make it really fast. I've tried Amazon Cloud Front at first but their speed was not very impressive I was getting about 600-700ms response times, which is slower than DiscountASP provider I was using before. I found [MaxCDN](http://www.maxcdn.com/) and they were just what I was looking for. I can see responses in the 50ms or less and [www.webpagetest.org](http://webpagetest.org) reports 93/100 point results.

