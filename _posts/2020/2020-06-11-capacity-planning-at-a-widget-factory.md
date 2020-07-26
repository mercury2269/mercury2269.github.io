---
layout: post
category: blog
published: true
title: "Capacity Planning at a Widget Factory"
tags:
  - load-testing
meta description: >-
  Load testing for capacity planning and performance. 
---

Imagine you are an engineer working at a widget factory, and because the business is continuously growing, you estimate that you will soon need to support five times the current production capacity.

Because it’s a modern factory, the performance of every stage of the widget assembly is measured and then displayed on electronic dashboards. Based on the metrics, you can tell that the assembly line is at half capacity at the current rate of production. Therefore, to get to the target capacity without any optimizations is not possible, and you are not confident that it can even be accomplished.

The simple approach to increase the capacity is to add additional resources to each assembly stage based solely on the current production capacity and utilization. In other words, if one of the assembly stages is running at 50% capacity and produces 100 widgets, you figure out that you will need at least 50% * 5 = 250% more resources to produce 500 widgets. If one of those assembly stages is a physical resource like a paint station, getting to 250% would mean that you would need to buy and add two additional stations to support the 250% capacity increase.

This approach, however, has some flaws. It makes an assumption that your assembly line is already optimized to support the projected capacity. But in reality, there are many areas that could be improved to produce a higher throughput without additional resources. Increasing every resource across the board is inefficient, requires a lot more maintenance, and is expensive. It’s also wasteful if the expected capacity does not materialize.

Another alternative to increase capacity would be to try to dial up your current production assembly line to see how much it can handle. But this is dangerous because if one of the stages does go out of order, it can create downtime for the entire assembly, and your factory must be producing at all times.

Looking at the dashboards, you see that there are slow areas that can be optimized. But you are still not sure if the optimizations are going to make the entire assembly run quicker. In other words, are you actually discovering the bottlenecks or just optimizing blindly?

Luckily, your company has a new branch opening up soon that has the same assembly line installed, a perfect place for you to run some experiments.

So you set up your factory to mimic the production workload and systematically work to figure out what needs to be done to improve the throughput. By gradually increasing workload, you start noticing which stages are starting to break down and create bottlenecks. To resolve a bottleneck, you get to exercise your engineering skills and come up with a solution to make the steps faster. Sometimes, figuring out how to make a portion of an assembly line run faster is not an easy task, and you need to dive deep into understanding how a particular machine works and obtain valuable knowledge in the process. It’s fun and challenging at the same time.

In the process of pushing your assembly line to the limit, you get to learn about the physical limitations of each stage. Perhaps there are some stages that cannot be more optimized and you may have to redesign or upgrade a section of the assembly line. In order to squeeze every last bit of performance, you had to experiment with many different settings, test many different scenarios, and try out different configurations. As a result, you are now more intimately familiar with the system as a whole; there is no more guesswork needed and you are much better positioned to do the following:

-   Create a realistic capacity plan.
-   Identify major performance bottlenecks in your system.
-   Improve the ability to increase or decrease capacity.
-   Improve reliability during increased load.
-   Improve the performance of the assembly line.
    
There could also be some other interesting findings. Perhaps, in the past, you thought that some areas of the assembly would start breaking down earlier than expected and had more resources allocated, but these theories were not realized. As a result, you can save the company money by getting rid of the excess capacity that would never get utilized under the current setup.

Finally, the most exciting outcome of performing these experiments is making your assembly line run faster and much more efficiently. Your customers are much happier that they can get widgets faster, and your business is more cost-effective as a result.

This was my attempt to use an analogy describing a load testing project that I was recently involved in. I understand that sometimes you may not be in a position to re-create a production-like environment, but if you are lucky enough to have an application that runs in the cloud and infrastructure specified as code, standing up a production mirror and investing a bit of time on load testing can have some profound results. As a result of load testing, at my work, we were able to increase the performance and capacity of our system by 10x using the same hardware. This will translate into a more reliable system that can handle bursts of traffic and be less expensive in general.

Special mention goes to the awesome load testing tool, [Locust.io](https://locust.io/). It was very easy to use, and it took only a couple of days to write test scripts to mimic critical path interaction with our services.