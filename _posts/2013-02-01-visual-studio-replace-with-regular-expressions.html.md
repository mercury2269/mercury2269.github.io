---
layout: post
title: "Replace With Regular Expressions in Visual Studio"
meta-description: ""
tags: ["regex"]
categories: ["asp.net"]
migrated: "true"
permalink: "/asp-net/visual-studio-replace-with-regular-expressions/"
---
Regular expressions are very handy especially when you are refactoring and there is a lot of manual changes. Visual Studio Replace with regex came in really handy when porting our code base at work to use [MiniProfiler][1]. Since MiniProfiler returns a DbConnection rather than SqlConnection, there are few small shorthands that no longer worked with DbConnection. 

The following example will work with SqlCommand but would not work with the DbCommand because DbCommand.Parameters doesn't expose a Value property which is a short hand notation that returns the last SqlParameter Value.

    using(var cn = SqlTools.GetSqlConnection("Default"))
    {
        var cmd = cn.CreateCommand();
        cmd.Parameters.Add(new SqlParameter("@Password", SqlDbType.NVarChar, 128)).Value = password;


So I needed to modify this code in about 650 places to use object initializer like this: 

    cmd.Parameters.Add(new SqlParameter("@UserName", SqlDbType.NVarChar, 256) { Value = username });

With a little bit of research I wrote a regular expression for Visial Studio Replace to fix this issue. Which looks like this:

Find what: `new SqlParameter\({[^)]*}\)\)\.{[A-Za-z]+} = {[^\}]+};`

Repleace with what: `new SqlParameter(\1) { \2 = \3 });`

And vua-lah!, it is all fixed.

One important feature to notice is that you use curly braces to mark the values that you are extracting from the string, this is different from other flavors where you use parenthesis. 

**Update 04-23-2013**

Visual Studio 2012 is using a different syntax to capture strings. The above expression would have to be slightly modified, as follows:

Find what: `new SqlParameter\(([^)]*)\)\)\.([A-Za-z]+) = ([^\}]+);`

Repleace with what: `new SqlParameter($1) { $2 = $3 });`

  [1]: http://miniprofiler.com/