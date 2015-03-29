---
layout: post
title: "How to Estimate Software"
meta-description: ""
meta-keywords: "Software estimation, custom software estimation, application development quote, app cost, software build cost"
categories: 
  - development practice
tags:
  - estimation
---

One of the first questions non-technical entrepreneurs who have an idea ask me is,   "How much would it cost me to build an application and how soon can you build it?" And for someone, who is not familiar with software development, it could be very difficult and even frustrating to get a realistic estimate with a timeframe. You might be surprised to learn that **a lot of  developers and  managers don't understand how to estimate software** either!  I've personally been a part of large scale development efforts, with ballpark estimates, coming from management, where projects never met the deadlines  and were delivered way over budget.  Hopefully after reading this post you will have a better understanding of what it takes to get a good estimate.

###Software Estimation Story
Building software is much like building a house. Imagine you want to build a house and have a friend who is an architect, so you ask him if it's possible to build a three bedroom house for around $100,000. He thinks about it and says yes, but it depends on the type of  house and what's going to be in it. In your friend's mind he imagines a simple house, with no thrills, that he could design and build for that amount. But you might have some other ideas. You want to have a nice swimming pool, a playground, a three car garage, bamboo floors, granite everywhere, a sauna, gold plated mirrors, high ceilings, and etc. You also might want a house on a hill with a view. At this point the house might cost ten  times the original amount.

There may also be many times during the project when you forgot to mention or thought of some other important feature, like an entertainment room, that you feel you must have! But your friend has already started working on the house and built the frame. And you might have to redo the entire design and knock down walls to accommodate, it which will make the project off budget, and add a lot of additional time. 

It's not always necessary to know everything up front, but it is important to anticipate large features so that your friend can design a plan that will accommodate changes later.

Steve McConnel, in his great book "[Rapid Development](http://www.amazon.com/gp/product/1556159005/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=1556159005&linkCode=as2&tag=sermassblo-20&linkId=W44AZRHKZEOBSTMU)", gives a great summary of the software estimation story that all customers and managers must understand:

> The basic software-estimation story is that software development is a process of gradual refinement. You begin with a fuzzy picture of what you want to build and then spend the rest of the project trying to bring that picture into clearer focus. Because the picture of the software you are trying to build is fuzzy, the estimate of the time and effort needed to build it is fuzzy, too. The estimate can come into focus only along with the software itself, which means that software-project estimation is also a process of gradual refinement.

In other words, **it's impossible for a programmer to estimate the project until he has a detailed understanding of what the customer wants**. Until a specific feature is understood in detail, the rough estimate could be a factor of sixteen  differences for that feature. 

Another difficult part is that unless you've previously built the same house, you probably won't have all the details, hence you have a fuzzy picture. Software development is a process of discovery and gradual refinement. Developers work with customers to unearth intricate business rules, features, and capabilities. One way you can bring a picture into the focus is by going through the process of defining a product, thinking through the requirements, and creating a design. Let's go through what we need to have to better understand what we are trying to build.

###Defining a product
Detailed understanding means that a developer can take the product definition and create a model of it in code. Most likely a developer is not a domain expert of the business and he needs a lot of help from the customer to understand it. Imagine that you get a job at an unfamiliar organization, where you had to learn how the business works before you can be productive. You will need a lot of time to get up to speed, and so will a developer in order to build your product. It's also much cheaper to be make mistakes and have invalid assumptions at this stage, because no code is written and it doesn't cost anything to correct it. 

For the product owner at this stage, a  good place to start  is to define a clear problem/solution statement, along with user stories, tasks, and [use cases](http://www.boost.co.nz/blog/2012/01/use-cases-or-user-stories/). User stories is a simple description of a feature told in the following way: 

    As a <type of user>, I want <some goal> so that <some reason>.

For example, it may look like this: As an incentive compensation specialist I would be able to set up compensation wrappers so that I can create goals for payees. Does this story make a lot of sense to you? If you are not working in the incentive compensation business, I don't think it will. Stories like these are an invitation for conversations between developer and business experts. During the conversation the developer will identify terms used, a vocabulary for that business domain, and know [ubiquitous language](http://martinfowler.com/bliki/UbiquitousLanguage.html) in [Domain Driven Design](http://en.wikipedia.org/wiki/Domain-driven_design). It will also lead to a  better understanding of a product, elements, subsystems and entities. 

At this stage any additional information that a business expert can present would be helpful. Examples are screenshots of similar application, high level flowcharts, wireframes, onboarding manuals,  etc. A developer can write a documentation summary about the problem/solution domain identifying all the entities, business vocabularies, definitions, subsystems, interactions and actors.

###Requirements Specification
After defining the product and learning about the business, we can see a better picture, but it's still not perfect;  at this moment there could be a factor of eight  differences between the high and low estimate. The  next step is to zoom in even closer and define a list of requirements. The amount of features  software can have has a tremendous impact on the design, time, and cost of the application. Even if you practice agile methodologies, you still need to gather a minimal set of requirements so you can  plan for the future. Just like in the definition stage,  it's much easier, and cheaper, to make changes during requirements rather than realizing you've missed an important feature down the line, and have it take months to redesign the application. (Knock down walls). 

Input at this stage from the business side should be a list of important features that this project must have. While a developer's job is to understand how these features fit together and to create a plan that will accommodate future expansions.

###Product Design
We are getting much closer to a better estimate at this point; the difference might be a factor of three  between high and low estimates. Over my career I've learned that nothing brings software into a picture like creating a high level and detailed design. This is the stage where a developer takes everything learned about the product, and starts modeling the domain. During this stage she will make a lot of mistakes and flush out incorrect assumptions. Again, much cheaper to make mistakes here than during coding. Starting with a high level design of the major subsystems and defining a clear communication between them, then modeling your domain and define major objects and abstractions. (For a more detailed analysis on how to model a domain, see Eric Evan's book, "[Domain Driven Design](http://www.amazon.com/gp/product/0321125215/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0321125215&linkCode=as2&tag=sermassblo-20&linkId=QVOCKKAXHGSP2WOC)").


###What if I don't know what I want? 
I think the best way to approach this problem is to hire a User Experience (UX) designer who can take vague ideas and  create throw away sketches of the product. Each sketch  can then be reviewed, refined, or redrawn. This process will flush out the requirements that will crystalize in an initial prototype, and can be tested on users before you start the expensive software development. A good UX designer in this situation will save you a lot of money because she will bring the requirements and prototype into focus, for the fraction of the cost of building software!  By sketching, creating multiple prototypes, and then testing it on users, you know exactly what works and there is no chance of building something that your customers can't use. 

I see a tremendous amount of benefit of hiring a UX designer early in any software project. There is a lot of power in sketching, defining, and user testing multiple prototypes without actually building anything. It's costly to experiment by building software and I don't think anyone can get the user experience right the first time. 

###Getting an estimate

After the picture is more clear, a developer will create a list of low level details with a range estimate for how many man-hours it would take to complete each task. You must get estimates on low levels of details, this way you get a more accurate estimate and you can gauge how the project is progressing. A good developer will also provide additional information about the costs that are associated with each task and other alternatives that could be more cost effective. Like a good contractor who would present and educate you about different counter tops, their benefits, and costs, you want your developer to do the same for you when providing a list of estimates.

It's also very important not to overlook other important tasks that are not coding, but have a significant impact on schedule and budget, like QA, documentation, deployments, setting up dev/production servers/databases, configuration, integration, holidays, training, and sick days. In addition there should be allowance with working with new languages, working with unfamiliar technologies, and frameworks. There is always a learning curve when  doing something new and this should be accounted for. 

Make estimation part of your plan
Estimation  should be part of your plan and you need to spend a significant amount of time on it; don't rush it.

###Word on Agile Software Development
I am a big believer in iterative development, rapid delivery, minimal planning, and many other principles Agile Manifesto stands for. Unfortunately, I've noticed some developers use Agile as an excuse to have no planning, design, or requirements analysis at all, which results in the costliest approach of them all: code-like-hell. It's common, and **you want to be wary of ballpark estimates with use of an Agile as an excuse to not do to any planning or design**.