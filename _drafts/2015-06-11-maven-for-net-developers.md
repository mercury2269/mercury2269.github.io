---
layout: post
category: blog
published: false
title: Maven for .NET Developers
meta description: null
---


I'll be working on a large project written in Java, and since I'm only slightly familiar with this language and its ecosystem, I started learning more about the tools and frameworks. I'm going to be documenting what I'm learning so I can understand it better, retain the information, and hopefully save someone, including me, some time in the future. 

The first thing I figured would be a good thing to tackle is the build system. The goal is to understand how does the project structure compares to .NET projects and how the dependencies are managed. There is a lot of good [documentation](http://maven.apache.org/what-is-maven.html) already about Maven so I'm not going to into details about it's features. 

## Project Management
Maven is basically a project management tool. It is similar to .csproj files with exception of using all files in the directory rather than listing them out. And it also serves a role of dependencies management. You can think of it as a MsBuild and Nuget combined. It uses pom.xml files, containing Project Object Model, as a central location for project configuration.