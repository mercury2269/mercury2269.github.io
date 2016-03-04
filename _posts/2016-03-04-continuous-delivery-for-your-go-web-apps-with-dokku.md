---
layout: post
category: blog
meta description: null
tags: 
  - "continuous-delivery"
published: false
title: Continuous Delivery for Your Go Web Apps with Dokku
---

## Delivering a Minimal Viable Product

I'm a big fan of continous delivery. It is especially important when you develop your MVP and want to get new features in front of your early adaptors as fast as possible. It also allows you to deploy your code in increments, identify problems sooner and deploy bug fixes in minutes. 

So when I started a new side probject, one of the first tasks on my trello board was to setup a continuous delivery pipeline. Here are some of my requirements:
- Cost, as little as possible, since this is an MVP and it won't be getting a lot of traffic for a while and I don't need a highly scalable, expensive hosting. 
- I want to run my code inside of Docker containers, consistent light weight environments. 
- I want to deploy using a CLI, with one command.
- Zero downtime, this is a luxury feature and probably not necessary for MVP but I think it is still benefitial if someone is using your app to not have a bad experience when you constantly deploying your app.
- I also want an easy access to my logs and don't want to setup additional logging infrastructure.
- Fast enough to provide a good uxer experience.

Here are some things that I do not think is necessary and just add extra complexity for an MVP
- Data replication. I'm not worried too much about loosing test data. I think eventually when I have beta users I will setup some sort of daily backups. 
- Scalability. I don't need to scale at this moment. Go lang offers great performance and I won't have to worry about hitting the limits for a long time.
- High availability. Hosting on one node is perfectly fine, if it dies it doesn't cause any production issues because it is a beta product, and the likelyhood is very little of it. 


