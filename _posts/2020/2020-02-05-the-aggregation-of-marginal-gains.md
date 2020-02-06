---
layout: post
category: blog
published: true
title: The Aggregation of Marginal Gains
tags:
  - software-engineering
meta description: >-
  The Aggregation of Marginal Gains
---
In his book, [Atomic Habits](https://amzn.to/2UnRpLy), author James Clear tells a story about a struggling British cycling team that for over a hundred years won only one gold Olympic medal and did not win a single Tour de France, cycling’s biggest race . After the team hired a new performance director, he brought with him a new philosophy, referred to as “the aggregation of marginal gains,” which focused on tiny improvements in every thing that you do. Together with his team, the new director introduced over a hundred small improvements, including redesigning a bicycle seat, testing different fabrics for air dynamics, and rubbing alcohol on the tires to make them grip better. He even brought in a surgeon to teach riders how to wash their hands better so they would not get sick.

All these minor improvements had an incredible impact. Within five years after the new performance director took over, the team won 60% of the gold medals for the cycling events at the 2008 Olympic Games in Beijing.

If we apply the same philosophy to the software engineering teams, what type of tiny improvements could have a big impact in the long run? Here are a few that I think can be a good start.

## Incremental Refactoring

By creating a good habit of leaving the code base better than it was before, chances are that our projects would be easier to maintain in the long run. Besides making the code more expressive, easier to read and modify, engineers can also add missing unit tests, cleaning up legacy comments, or format code. I think the trick is to have a balance and sprinkle improvements a little bit over time. Nobody wants to review a huge refactoring for correctness when it’s unrelated to the task assigned. As a bonus if you could separate refactoring in a separate pull request, your reviewers will thank you. Finally, if you are looking to learn more about refactoring, I highly recommend the book, [Refactoring: Improving the Design of Existing Code](https://amzn.to/2UmVpvK).

## Small Bug Fixes Without Tickets

Not every bug fix needs to go through a process of writing up a ticket, getting it estimated, prioritized and planned. If the bug fix is small enough and the engineer has the context around it, it is worth fixing it along with the primary task. The cost of the bug fix at that moment will be significantly lower and will not require a context switch for another engineer or yourself a few months later. Finally, customers will appreciate quick fixes if it affects them.

## Document Root Cause Analysis for Major Incidents

Every failure is a great opportunity to learn from mistakes. Before we can do that, we must first gather all available information about the incident, ask five whys, and create an action plan on how it can be prevented in the future. It’s also valuable to share this information with the stakeholders and team, because they might have a different perspective and offer valuable insights that might not be obvious to the author. In addition to improving processes, documenting incidents is also valuable for tracking purposes; it helps to determine if the team is improving over the long term.

## Reviewing Logs After Deployments

Reviewing error logs after each deployment can help identify issues caused by newly released code and get them resolved right away. It’s much cheaper to fix bugs when the context is fresh in the author's mind. And it could help to save a lot of time and frustration for customers, support and the engineering team. Some bugs could require a data back-fill or other escalation, and if left unchecked, can create a lot of unnecessary work.

## Quick Responses to Questions and Requests

> When researchers compiled a huge database of the digital habits of [teams at Microsoft](https://medium.com/@duncanjwatts/the-organizational-spectroscope-7f9f239a897c), they found that the clearest warning sign of an ineffective manager was being slow to answer emails. Responding in a timely manner shows that you are conscientious — organized, dependable and hardworking. And that matters. In a [comprehensive analysis](http://psycnet.apa.org/record/2000-16508-004?casa_token=gqkQhZM9qwIAAAAA:QEr6Zmq76aqx63hGeqSf3FNhv02-J5XhnIKNTAouwMA-Cdl_X4_cDQhuSFaGv7EdRKcSbikV4qdxFcOquu4Xxw) of people in hundreds of occupations, conscientiousness was the single best personality predictor of job performance.
> \- Adam Grant [No, You Can’t Ignore Email. It’s Rude.](https://www.nytimes.com/2019/02/15/opinion/sunday/email-etiquette.html) 

According to Adam Grant, an organizational psychologist, quick responses are the best predictor of job performance. Because our customers and peers are our top priority, it makes sense to try to get a little bit quicker at responding to emails or messages. I can vouch for this myself. I certainly appreciate when someone on my team reviews my code review request right away; it prevents me from switching off to a different task and allows me to get more stuff done.

## README Files

Putting together a README file for projects will save time when someone else, or yourself in the future, has to get started on the project. You can find suggestions on how to make good README files [here](https://www.makeareadme.com/#suggestions-for-a-good-readme). Small investments into better documentation will pay off in the future.

## Do Not Stop Here

This was not meant to be an exhaustive list, just a starting sample of things that may or may not work for your projects. Most important are not the improvements by themselves, but the willingness to adopt a philosophy of continuous aggregation of improvements that will make a difference in the long run.