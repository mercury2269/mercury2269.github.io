---
layout: post
title: "Neat Features In MiniProfiler Library"
meta-description: ""
tags: []
categories: ["miniprofiler"]
migrated: "true"
permalink: "/miniprofiler/neat-things/"
---
I've been reviewing [MiniProfiler][1] library source code and here are things that I though were unusual and neat. The reason why it caught my attention is because it's not something that I use every day so I wanted to list it here. Also, I know that developers who I work with at my job don't use these features also so they could probably find it interesting. 

##Grouping related files in visual studio. 
I've noticed that classes that inherit from an interface are grouped together in the Visual Studio like this: 

![](/uploads/2013/05/visualstudio-grouped-objects.png)

That is pretty neat, that way you don't have to hunt around for all implementations of the interface and it's all in one place.

By default Visual Studio groups related .aspx files like .cs and .designer.cs. If you look at the .csproj file files that are nested under the main file have a `DependenUpon` element under the the parent compile element.

    <Compile Include="SiteMap.aspx.designer.cs">
      <DependentUpon>SiteMap.aspx</DependentUpon>
    </Compile>


By default Visual Studio does not have an option to group arbitrary files but it could easily be done by editing a csproj file. So it's like a trick to work around default functionality. If you don't want to manually update that file there is a small little plugin [NestIn](http://visualstudiogallery.msdn.microsoft.com/9d6ef0ce-2bef-4a82-9a84-7718caa5bb45) that will do that for you. 

##Nested Settings Class

MiniProfiler has a nested static class so you can access settings by going to `MiniProfiler.Settings.SomeSetting`. I like that composition for settings and it's pretty easy to do. All you have to do is to set your classes partial and then create a static Settings subclass underneath the partial class like this:

    partial class MiniProfiler
    {
        /// <summary>
        /// Various configuration properties.
        /// </summary>
        public static class Settings
        {

You can also group your settings class with your main class and that's what is done in MiniProfiler.

##Default Values 
MiniProfiler.Settings uses DefaultValue Attributes on properties. It's important to note that this attribute does not initialize the property and that needs to be done separately. 

    [DefaultValue(20)]
    public static int MaxUnviewedProfiles { get; set; }

Initialization happens using reflection in the static constructor of the Settings class.
    
    static Settings()
    {
	    var props = from p in typeof(Settings).GetProperties(BindingFlags.Public | BindingFlags.Static)
	    let t = typeof(DefaultValueAttribute)
	    where p.IsDefined(t, inherit: false)
	    let a = p.GetCustomAttributes(t, inherit: false).Single() as DefaultValueAttribute
	    select new { PropertyInfo = p, DefaultValue = a };
	    
	    foreach (var pair in props)
	    {
	    	pair.PropertyInfo.SetValue(null, Convert.ChangeType(pair.DefaultValue.Value, pair.PropertyInfo.PropertyType), null);
    	}
		...

I think that's a nice way to initialize the properties. It keeps declaration and initialization together and easier to see. I wouldn't do something like that if you had a small settings class and would just initialize in the constructor. But on the large classes it makes sense. 

##Hooking up Routes

There is a single handler file that has a static method to initialize itself as a route. And it gets called when MiniProfiler sets up ProfilerProvider. What I found cool about this file is that it handles its own registration into routes. 

    public static void RegisterRoutes()
    {
	    var routes = RouteTable.Routes;
	    var handler = new MiniProfilerHandler();
	    var prefix = MiniProfiler.Settings.RouteBasePath.Replace("~/", string.Empty).EnsureTrailingSlash();
	    
	    using (routes.GetWriteLock())
	    {
	    	var route = new Route(prefix + "{filename}", handler)
		    {
		    // we have to specify these, so no MVC route helpers will match, e.g. @Html.ActionLink("Home", "Index", "Home")
		    Defaults = new RouteValueDictionary(new { controller = "MiniProfilerHandler", action = "ProcessRequest" }),
		    Constraints = new RouteValueDictionary(new { controller = "MiniProfilerHandler", action = "ProcessRequest" })
		    };
		    
		    // put our routes at the beginning, like a boss
		    routes.Insert(0, route);
	    }
    }


Keep in mind , in order for static files like .js and .css to get routed to the managed module you will need to turn on 

    <system.webServer>
    	<modules runAllManagedModulesForAllRequests="true" />
    </system.webServer>

or if you don't want to turn it on globally you can do it based on the specific url like this:

    <system.webServer>
      ...
      <handlers>
    	<add name="MiniProfiler" path="mini-profiler-resources/*" verb="*" type="System.Web.Routing.UrlRoutingModule" resourceType="Unspecified" preCondition="integratedMode" />
      </handlers>
    </system.webServer>

You can basically accomplish the same thing if you create an ashx handler and configure it in the handlers section. By setting up routes you can at least cover clients that have runAllManagedModulesForAllRequest set to true, so they would have one less thing to worry about. But it would also cause some frustration for people who don't.

That's it for now, I'll list more as I'm working through it. 

  [1]: http://www.miniprofiler.com