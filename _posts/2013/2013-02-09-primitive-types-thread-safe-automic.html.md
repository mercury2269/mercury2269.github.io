---
layout: post
title: "Ensuring Variables Are Atomic or Thread Safe"
meta-description: ""
tags: ["thread-safety"]
categories: ["asp.net"]
migrated: "true"
permalink: "/asp-net/primitive-types-thread-safe-automic/"
---

When multiple threads are writing to the static field you need to make sure that the writing operation is atomic or only one thread can write at a time. One of the ways to ensure you static fields are thread safe is to use **Interlocked** class part from the System.Threading namespace.

Here is an example of a static cache that does clean up every 1000 saves.

```csharp
public class QueryCache
{
    //static field that we need to make sure is thread safe
    private static int cacheCount;
    private const int MAX_ITEMS = 1000;
    static readonly System.Collections.Concurrent.ConcurrentDictionary<string, object> _cache = new System.Collections.Concurrent.ConcurrentDictionary<string, object>();
    public static void SaveToCache(string key, object value)
    {
        if(Interlocked.Increment(ref cacheCount) == MAX_ITEMS)
        {
            CleanUpCache();
        }
        _cache[key] = value;
    }
}
```

Since multiple threads can be writing to the cache at the same time, we have to make sure we don't have a collision when incrementing a cacheCount file.
[Interlocked][1] class has some other useful methods like `Interlock.Exchange` to set the variable to a specific value atomically.

[1]: http://msdn.microsoft.com/en-us/library/system.threading.interlocked.aspx
