---
layout: post
title: "Setting up MiniProfiler with WCF"
meta-description: ""
tags: ["asp.net-wcf", "miniprofiler"]
categories: []
migrated: "true"
permalink: "/setting-up-miniprofiler-to-work-with-wcf/"
---

First of all MiniProfiler is awesome! And lucky for me some smart people made it work with WCF. Since there is no official guide on setting up the project I had to get the examples and work from there. Here is what I had to do in order to get it working.

There is no Nuget package for MiniProfiler.WCF library so you have to download [source code][1] from GitHub and compile it under Release configuration. Then take MiniProfiler.dll and MiniProfiler.WCF dlls and place them in your common folder where you keep your external libraries.

### Service setup

Next, in your WCF Service project register wcfMiniProfilerBehavior extensions under extensions element (you can find out the version number with right click and going to properties on the MiniProfiler.Wcf.dll file. )

```xml
    ...
        <extensions>
          <behaviorExtensions>
            <add name="wcfMiniProfilerBehavior" type="StackExchange.Profiling.Wcf.WcfMiniProfilerBehavior, Miniprofiler.Wcf, Version=2.0.4.0, Culture=neutral" />
          </behaviorExtensions>
        </extensions>
     </system.serviceModel>
```

And in your WCF Service project you need to add the following endPointBehavior under behaviors element.

```xml
    <behaviors>
    ...
          <endpointBehaviors>
            <behavior>
              <wcfMiniProfilerBehavior />
            </behavior>
          </endpointBehaviors>
    </behaviors>
```

Oh yea and don't forget to reference a MiniProfiler.Wcf in your Service Project.
You will need to register MiniProfiler assembly in other projects where the actual profiling is going to take place, for example your data layer would have a reference to that file and wrap a connection with a dbprofiled connection, for more setup details see the [official site][2].

### Client Setup

If you are using proxies for your client setup you would register the following configuration in your client's web.config.

```xml
      <system.serviceModel>
        <extensions>
          <behaviorExtensions>
            <add name="wcfMiniProfilerBehavior" type="StackExchange.Profiling.Wcf.WcfMiniProfilerBehavior, Miniprofiler.Wcf, Version=2.0.4.0, Culture=neutral" />
          </behaviorExtensions>
```

And behaviors

```xml
    <behaviors>
      <endpointBehaviors>
        <behavior>
          <webHttp/>
          <wcfMiniProfilerBehavior />
        </behavior>
      </endpointBehaviors>
    </behaviors>
```

Just like in the Sample Project.

If you are using ChannelFactory without generating proxies you would need to add a behavior in the following way, for example:

```csharp
ChannelFactory = new ChannelFactory<T>(Binding, Endpoint);
ChannelFactory.Endpoint.Behaviors.Add(new WcfMiniProfilerBehavior());
Channel = ChannelFactory.CreateChannel();
```

That's almost it, just add the standard initialization to Application_BeginRequest and etc. mine looks like this

```csharp
protected void Application_BeginRequest(Object sender, EventArgs e)
{
    if (Request.IsLocal)
    {
        MiniProfiler.Start();
    }
}

protected void Application_EndRequest(Object sender, EventArgs e)
{
    MiniProfiler.Stop();
}

private void InitProfilerSettings()
{
    // some things should never be seen
    var ignored = MiniProfiler.Settings.IgnoredPaths.ToList();
    ignored.Add("WebResource.axd");
    ignored.Add("/Styles/");
    MiniProfiler.Settings.IgnoredPaths = ignored.ToArray();

    MiniProfiler.Settings.SqlFormatter = new StackExchange.Profiling.SqlFormatters.SqlServerFormatter();
}
```

Also, need to add handler activation into web.config under system.webserver

```xml
    <system.webServer>
    ...
    <handlers>
    <add name="MiniProfiler" path="mini-profiler-resources/*" verb="*"
    type="System.Web.Routing.UrlRoutingModule" resourceType="Unspecified" preCondition="integratedMode" />
    </handlers>
```

Finally, adding Mini Profile rendering scripts in your master page.

```razor
    <%= StackExchange.Profiling.MiniProfiler.RenderIncludes() %>
```

[1]: https://github.com/SamSaffron/MiniProfiler
[2]: http://miniprofiler.com/
