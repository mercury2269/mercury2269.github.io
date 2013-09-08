---
layout: post
title: "Changing the Location of Your ITunes Library Via C#"
meta-description: ""
tags: ["itunes"]
categories: ["itunes"]
migrated: "true"
permalink: "/itunes/change-location-of-itunes-library/"
---
iTunes is my least favorite software when it comes to managing music library. However sometimes you have no choice and have to deal with it. Couple times in the past I had to completely recreate my iTunes library from scratch since I could not move it to the newly installed system. Recently when I've build a new PC I was a bit smarter and did the research and mapped my library to the exact same folder and everything worked and everything transferred perfect. 

This time however I've decided to move out my music library from home server to the media server and was stuck since all my music library tracks were mapped to the UNC \\hpserver and new location of my music would be something like M:\Music. Unfortunately you can't do that with iTunes and you are stuck with going one by one and relocation your track. 

Luckily few days ago I've stumbled across Scott Hanselman's [post][1] on how to remove dead tracks from iTunes. After looking at the code it was pretty easy to add functionality to relocate tracks automatically and I've modified the sample project he provided to do just that. Thanks to him for bringing iTunes api to light!

![Itunes relocate tracks][2]

**Now I still have my library with play counts and all the data just like it was before but under a new location!**

Here is the link to the [modified source code][3] if you ever want to move your itunes library to a new location. 


  [1]: http://www.hanselman.com/blog/RemovingDeadTracksDuplicatesThatDontExistFromITunesUsingC.aspx
  [2]: http://blog.maskalik.com/get/2012/11/Screenshot.png
  [3]: https://github.com/mercury2269/ITunesManager