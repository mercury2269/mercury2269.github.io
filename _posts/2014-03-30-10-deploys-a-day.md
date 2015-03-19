---
layout: post
title: "10 Deploys A Day"
meta-description: "Rapid software delivery brings quality, rapid feedback, and competitive edge."
meta-keywords: "Continous delivery, Continuous deployments, the phoenix project, gene kim, high performance organizations"
categories: 
  - continuous-delivery
---

This post was inspired by [Gene Kim][1]'s talk on continuous delivery and his eye opening book [The Phoenix Project][2]. 

What is a continuous delivery? It's a methodology that allows you to get new features and capabilities to market quickly and reliably. It's a practice that shortens work in progress and allows for rapid feedback on your new features or improvements. It's automation of many parts including testing, creation of environments, and one button push deployments. It's a magical unicorn that allows companies to deploy 10 times a day without much effort or risk of breaking stuff!

The reason why his story strikes a chord with me is because I strongly believe that automation can streamline the software development, make employees happy, and help organizations to become high performers. And automation is a big part of continuous delivery methodology. Throughout my career, I've participated in many painful deployments that lasted more than a day and usually were throughout the weekend. And I believe nobody should be a part of that because there is a better way that's within reach of many companies. As a result, developers can focus on doing stuff that matters, companies can deliver new features much more rapidly, and stake holders can see their ideas spring to life very quickly.

## Average Horse
First, let's dive deeper into the normal software delivery practice of an average company. 

 - Product managers will come up with arbitrary due dates without doing technical capacity planning, making promises that we cannot keep. And in result, when a due date comes, product is rushed with many shortcuts taken, which results in lower quality and more fragile applications, which means more technical debt and *unplanned* worked later.
 - Security is not even in the picture because new features are not getting to market quickly enough. 
 - Technical debt continues to get stock piled and is rarely paid off. Like financial interest, it grows over time until most of the time is spent on just paying off the interest in the form of unplanned work. 
 - Deployments are not automated and it takes long time to manually deploy. Therefore deployments are a lot less frequent, that means a huge number of features are being deployed at once. That means finished work does not make it into production for months, sometimes years (scary), and that means no rapid feedback on performance, adoption, or business value. Comparing that to the manufacturing plant, where at the bottleneck station you have a stock pile of work, and you have to stop everything just to catch up. At that point you cannot give any feedback because other stations already finished their work, and it's very costly to change already made stuff (unplanned work) and the solution is lower quality product (technical debt).
 - Due to lack of automated testing, companies have to deploy even more infrequent since it takes an army of QA engineers to regression test the entire application, and it becomes even longer as more features are deployed. 
 - Failed features don't get pruned, but rather just left to rot and accumulate more security, technical, and maintance debt. 

> Unplanned work is not free, it's actually really expensive. Another
> side affect is when you spend all your time firefighting, no time or
> energy left for planning. When all you do is react, there's not enough
> time to do the hard mental work of figuring out whether you can accept
> new work. Which means more shortcuts, more multitasking. - The Phoenix Project

##How Unicorns Work

The main idea behind continuous delivery is to reduce work in progress (WIP) that would allow for quicker feedback of what goes into production. For example, if you work on a 9 month long project it will take you longer than 9 months to see your code in production, and if something has a problem it will be very expensive to go back and change some design decisions. Therefore, there is a good possibility that a fix will just be a hack rather than a proper solution, meaning more technical debt accumulating, more problems later. And not to forget that after 9 months of projects it will take the whole weekend and huge amount of agony to release it. 

Gene's term for WIP in IT terms is a "Lead Time" which measures how long it takes to go from code committed to code successfully running in production. And until code is in production is has absolutely no value because it's just sitting there. Focusing on fast flow will improve quality, customer satisfaction, return on investment, and employee happiness. 

But you think it must be crazy to release so much a day, isn't it dangerous to make all those changes? It's actually a lot less risky to deploy small changes incrementally because you get rapid feedback. And even if there is a problem it's much easier to fix small problem sooner rather than later where you are forced to take shortcuts.

To get there, you have to "improve at bottlenecks", and any improvements that are not done at the bottlenecks are a waist of time. If your deployment process is a bottleneck, you have to automate it, until it becomes one button push deployment. There is absolutely no good reason why a developer cannot push a button which will create a QA environment that exactly matches production with code deployed, and if it passes automated functional tests it can be put into production with another push of the button. If the regression testing is a bottleneck then you need to pay off that debt by writing automated functional tests or end to end system tests.

> "Automated tests transform fear into boredom." --Eran Messeri, Google

To become high performer, you will also need to add monitoring hooks to your applications, so that any developer can add his or her metrics at will. So when you release often, you can get rapid feedback on the performance, adoption, and value. That way you can make an inform decisions and rollback if necessary. It should be extremely easy for developer to add any kind of monitoring metrics to code and data must be accessible from production. 

Gene proposed to spend 20% of the time to work on non-functional improvements, or non feature work, and I think if any organization adopted that they would be on their way of becoming a high performing unicorn. I honestly don't think it's much to invest comparing to opportunity cost of features not making out for long periods of time and where only 10% of features are successful. How can you test something when you can only release couple times a year?

Finally, you should be deploying to production with your features turned off that way your releases are not at the same time as deployments and turning features on and off is a simple button click. 

> It's not art, it's production.
> If you can't out-experiment and beat your competitors in time to
> market and agility, you are sunk! Features are always a gamble. If you
> are lucky, ten percent will get the desired benefits. So the faster
> you get those features to market and test them, the better you will
> be. - The Phoenix Project

And if you think 10 deploys a day is crazy take for example Amazon with a mean time between deployments of 11.6 seconds (insane). And it's not just them, companies like Intuit, Target, Google, Etsy, Flikr, Kansas State University and many others have embraced continuous delivery. 

##It Does Not Have To Be Radical. Small Steps Are Just Fine.
In a perfect world, a company with problems would stop everything to fix the production line and pay off the technical debt. And some companies like EBay had to do that to escape the vicious cycle. I don't think it has to be so drastic for an average company. I believe if you accept the culture of continuous improvement, and first focus on all the bottlenecks, you can soon get there. For example, you can make small changes that will bring a lot of improvement. For example, if you deployment is a manual process focus on automatically creating packages and create a script that will automatically deploy. If it requires database changes, add scripts to the package and your deployment script will deploy database changes automatically. There is no reason why a DBA has to compile and execute scripts by hand when it can be automated. If your need many QA engineers to regression test the site, why not spend some of their time to write automated tests, I'm sure they would be happier to find new bugs rather then doing senseless testing of the same stuff. 

##Final Thoughts
Gene urges us to create a culture of genuine learning and experimentation and that's how best companies get even better. In additional here a great quote if you think it's not relevant to you

> Most of the money spent are on IT Projects these days and even if
> companies say it's not their core competency it's not true. Everyone
> must learn or you risk irrelevance in 10 years. - Gene Kim


Good luck and see you in the world of unicorns! :)


  [1]: http://www.realgenekim.me/
  [2]: http://www.amazon.com/gp/product/0988262592/ref=as_li_ss_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=0988262592&linkCode=as2&tag=sermassblo-20