How to estimate software

One of the first questions non technical entrepreneurs with an idea want to know is:  How much would it cost me to build an application and how soon can you build it? And for someone, who is not familiar with software development, it could be very difficult and even frustrating to get a realistic estimate with a timeframe. You would be surprised to find out that a lot of the developers or managers don’t understand how to estimate software either. I’ve been personally a part of large scale development efforts with ballpark estimates coming from management where projects never met the deadlines, and were delivered way over budget.  Hopefully after reading this post you will have a better understanding of what it takes to get a good estimate.

Software Estimation Story
Building software is much like building a house. Imagine you want to build a house and have a friend who is an architect so you ask him if it’s possible to build a three bedroom house for around $100,000. He thinks about it and says yes, but depends on the type of a house and what’s going to be in it. In your friend’s mind he imagines a simple house with no thrills that he could design and build for that amount. But you might have some other ideas. You want to have a nice swimming pool, a playground, a three car garage, bamboo floors, granite everywhere, sauna, gold plated mirrors, high ceilings, and etc. You also might want a house on a hill with a view. At this point the house might cost 10 times the original amount.

There are also many times during the project when you forgot or thought of some other important feature like an entertainment room that’s absolutely necessary to have. But your friend has already started working on the house and built the frame. And you might have to redo the entire design and knock down walls to accommodate it which will make the project off budget, and add a lot of additional time. Which brings us to another important point, it’s much cheaper and faster to make changes early in the planning stage rather when construction is already on the way. 

It’s not always necessary to know everything up front but it is important to anticipate large features so that your friend can design a plan that accommodate changes later.

Steve McConnel in his book “Rapid Development” has a great summary of the software estimation story that all customers and managers must understand:

“The basic software-estimation story is that software development is a process of gradual refinement. You begin with a fuzzy picture of what you want to build and then spend the rest of the project trying to bring that picture into clearer focus. Because the picture of the software you are trying to build is fuzzy, the estimate of the time and effort needed to build it is fuzzy, too. The estimate can come into focus only along with the software itself, which means that software-project estimation is also a process of gradual refinement.”

In other words, it’s impossible for a programmer to estimate the project until he has a detailed understanding of what customer wants. Until a specific feature is understood in detail the rough estimate could be a factor of 16 difference for that feature. 

Another difficult part is that unless you’ve previously built the same house you probably won’t have all the details, hence you have a fuzzy picture. Software development is a process of discovery and gradual refinement. Developers work with customers to unearth intricate business rules, features and capabilities. One way you can bring a picture into the focus is by going through the process of defining a product, thinking through the requirements, and creating a design. Let’s go through what we need to have to better understand of what we are trying to build.

Defining a product
Detailed understanding means that a developer can take the product definition and create a model of it in code. Most likely developer is not a domain expert of the business and he needs a lot of help from the customer to understand it. Imagine you get a job at an unfamiliar organization where you had to learn how the business works before you can be productive. You will need a lot of time to get up to speed and so will a developer to build your product. It’s also much cheaper to be make mistakes and have invalid assumptions at this stage because no code is written and it doesn’t cost anything to correct it. 

A good place to start for the product owner to definate a clear problem/solution statement along with user stories, tasks, and use cases (http://www.boost.co.nz/blog/2012/01/use-cases-or-user-stories/). User stories is a simple description of a feature told in the following way:

As a <type of user>, I want <some goal> so that <some reason>.

For example, it may look like this: As incentive compensation specialist I would like to be able to set up compensation wrappers so that I can create goals for payees. Does this story make a lot of sense to you? If you are not working in the incentive compensation I don’t think it would. Stories like these are an invitation for conversations between developer and business expert. During the conversation the developer will identify terms used, a vocabulary for that business domain, also know ubiquitous language in Domain Driven Design. It will also lead for better understanding of a product, elements, subsystems and entities. 

At this stage any additional information that a business expert can present would be helpful. Examples are screenshots of similar application, high level flowcharts, wireframes, onboarding manuals, and etc. A developer can write a documentation summary about the problem/solution domain identifying all the entities, business vocabularies along with definitions, subsystems, interactions and actors.

Requirements Specification
After defining the product and learning about the business we can see a better picture but it’s still not perfect, at this moment there could be a factor of 8 difference between the high and low estimate. Next step is to zoom in even closer and define a list of requirements. The amount of features a software can have has a tremendous impact on the design, time, and cost of the application. Even if you practice agile methodologies you still need to gather a minimal set of requirements so you can at least plan for future. Just like in the definition stage, It’s much easier and cheaper to make changes during requirements rather than realizing you’ve missed an important feature down the line and it take months to redesign the application. (knock down walls). 

Inputs from business side should be a list of important features that this project must have. While developer’s job is to understand how these features fit together and to create a plan that will accommodate future expansions.

Product Design
We are getting much closer to a better estimate at this point the difference might be of a factor of 3 between high and low estimates. Over my career I’ve learned that nothing brings a software into a picture like creating a high level and detailed design. This is the stage where a developer takes everything learned about the product and start modeling the domain. During this stage she will make a lot of mistakes and flush out incorrect assumptions. Again much cheaper to make mistakes here than when during coding. Starting with a high level design of the major subsystems and defining a clear communication between them, then modeling your domain and define major objects and abstractions. (For more detailed analysis on how to model a domain see Eric Evan’s book Domain Driven Design).


What if I don’t know what I want 
I think the best way to approach this problem is to hire a User Experience (UX) designer who take vague ideas and and create throw away sketches of the product. Each sketch then can be reviewed, refined or redrawn. This process will flush out the requirements that will crystalize in initial prototype that can be tested on users before you start the expensive software development. A good UX designer in this situation will save you a lot money because she will bring in the requirements and prototype into focus for the fraction of the cost of building software. By sketching, creating multiple prototypes, and then testing it on users you know exactly what works and there is no chance of building something that your customers can’t use. 

I see a tremendous amount of benefit of getting a UX designer early in any software project. There is a lot of power in sketching, defining, and user testing multiple prototypes without actually building anything. It’s costly to experiment by building software and I don’t think anyone can get the user experience right after the first time. 

Getting an estimate

After the picture is more clear a developer will create a list of low level details with a range estimate for how many man-hours it would take to complete each task. You must get estimates on low levels of details, this way you get a more accurate estimate and you can gauge how the project is progressing. It’s also very important not to overlook other important tasks that are not coding but have a significant impact on schedule and budget like QA, documentation, deployments, setting up dev /production servers/databases, configuration, integration, holidays, training, sick days. In addition there should be allowance with working with new languages, working with unfamiliar technologies and frameworks. There is always a learning curve in doing something new and should be accounted for. 

Make estimation part of your plan
Estimate should be part of your plan and you need to spend a significant amount of time on it and not to rush it.

Word on Agile Software Development
I am a big believer in iterative development, rapid delivery, minimal planning and many other principles Agile Manifesto stands for. Unfortunately, I’ve noticed some developers use Agile as an excuse to have no planning, design or requirements analysis at all, which results in the costliest approach of them all: code-like-hell. It’s common, and you want to be wary of ballpark estimates with use of an Agile as an excuse to not do to any planning or design. 
