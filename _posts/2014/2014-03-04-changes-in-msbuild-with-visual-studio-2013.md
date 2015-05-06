---
layout: post
title: "Changes In MSBuild with Visual Studio 2013"
meta-description: "Latest changes to the way MSBuild ships with Visual Studio might break your deployment packages"
meta-keywords: "MSBuild error with Visual Studio 2013, MSBuild new location"
categories: 
  - msbuild
tags:
  - visual-studio-2013
  - msbuild
---


After I uninstalled Visual Studio 2012, the deployment package creation script that builds and publishes a project using MSBuild started throwing a lovely exception: 

> .csproj(795,3): error MSB4019: The imported project "C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v11.0\We bApplications\Microsoft.WebApplication.targets" was not found. Confirm that the path in the <Import> declaration is correct, and that the file exists on disk.

From the error, I can tell that MSBuild is using the wrong Visual Studio version. My first thought was to to tell MSBuild to use v12 to build target by adding a VisualStudioVersion environment variable /p:VisualStudioVersion=12.0 but that resulted in a new error that was a little more confusing:

> C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v12.0\Web\Transform\Microsoft.Web.Publishing.AspNetCompileMerge.targets(132,5): error : Can't find the valid AspnetMergePath

I guess something has changed, and indeed, after searching I found that that yes MSBuild [now ships as a part of Visual Stuido][1].

So rather than having MSBuild shipped as a component of a .NET framework, it is now a stand alone package that comes with Visual Studio and each version corresponds to the Visual Studio version with it's own toolsets. So the new MSBuild will be under: 

> On 32-bit machines they can be found in: C:\Program
> Files\MSBuild\12.0\bin
> 
> On 64-bit machines the 32-bit tools will be under: C:\Program Files
> (x86)\MSBuild\12.0\bin

So if you are building you project using C:\Windows\Microsoft.NET\Framework\v4.0.30319\msbuild.exe, without Visual Studio 2012 installed, it will no longer work, and you will need to switch your build tool to use a new msbuild 12.0 in C:\Program Files (x86)\MSBuild\12.0\Bin\MSBuild.exe.

That's it, hopefully this post will save someone some time.


  [1]: http://blogs.msdn.com/b/visualstudio/archive/2013/07/24/msbuild-is-now-part-of-visual-studio.aspx
