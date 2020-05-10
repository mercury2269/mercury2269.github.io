---
layout: post
category: blog
published: true
title: Design Systems Not Rules to Follow
tags:
  - thoughts
  - ideas
meta description: >-
  Rather than creating more rules that people don't like to follow, we should create systems that make process hard to ignore.  
---

In the last few years, as my team grew in size, one of the problems that kept coming up during retrospective meetings was the poor turn around with code reviews. With a smaller team there was no need for an additional process to find code review volunteers; since every engineer had to pitch in and review code daily. But with a larger team, not having a clear process or rules to follow was starting to affect the team's performance. The issues were identified as follows:

1.  It was difficult to find a code review volunteer.
2.  After a volunteer was found, sometimes you would still need to follow up if the review was not getting attention.
3.  Some people would volunteer less than others.
4.  When comments or replies were posted on code reviews, they were not immediately visible because email notifications from GitHub often had to wait until you checked your email. And to get the review process moving along, sometimes you had to message the reviewer directly.
    

## Initial attempts at creating additional process

After multiple discussions with the team, everyone agreed to introduce a simple rule: at the start of a day, each developer will spend 15 minutes on code reviews. This, in theory, would provide more than enough engineers to complete all outstanding reviews and keep review turnaround under 24 hours. A few months later, the results of the experiment were mixed. There was still a lot of delay with getting code reviewed. Sometimes changes requested during code reviews had to be reviewed again, and if your reviewers were already done for the day, it would have to wait another day. Due to the slow feedback cycle, reviews still could take days to get completed. Finally, some engineers were not contributing every day due to being busy with other work.

After another brainstorming session, the team identified that one of the issues with poor turnaround was that outstanding code reviews were not easily visible. Because we work with many GitHub repositories, it is not practical to go into each one to see what code reviews (pull requests) are outstanding. The proposed solution was to use a “pin” feature in Slack, our instant messenger program, which will add a code review link to the team channel’s dashboard. When engineers finished reviewing, they would add a 👍 emoji to the pinned code review, flagging it as done. When two thumbs up appeared on a pinned request, the requestor would merge a code review and unpin the item. This was not a complicated process to follow, but there was still confusion and after another few months, outstanding reviews started to linger on the team’s channel board.

## From volunteering to assignment

In an attempt to uncover the underlying problem, one of the engineers extracted data on the number of reviews per person and noticed that reviews were not evenly distributed. Some people did a lot more than others. Asking for volunteers was not working very well and also created a fairness problem.

At this point, it was obvious that we needed to even out the distribution and prioritize assigning engineers with the least number of reviews. We also thought about automating this process. It was not difficult to write a script that would pull review statistics and assign people with the least amount of reviews. However, to save time we looked online to see if someone had already solved this problem, and we found a [Pull Reminders commercial application](https://pullreminders.com/) that did exactly what we needed, plus other useful features.

Initially, when we decided to give Pull Reminders a try, we weren’t confident that it would solve the problem. However, after everyone was onboard, we were surprised to learn that the issue with code reviews did not come up again during retrospective meetings. We changed our process from volunteering to assignment, based on the leader-board from the Pull Reminders app. When you need a review, rather than asking or posting in the channel, you will assign two people with the least number of reviews from the leader-board. Pull reminders will take care of notifying and reminding people about outstanding code reviews. The app also improved our communication because it sent personal slack messages when a comment or reply was posted in your code review. This tremendously improved response and turnaround times.

## Summary

It’s been a year since we’ve started using Pull Reminders, and I haven’t noticed any confusion or disconnect about code review responsibilities. The majority of reviews are done within a day or two. And we can finally call the problem that caused a lot of discussions and inefficiencies resolved. Most importantly, the new system removed additional rules that everyone had to remember to follow. Now, the system enforces and notifies engineers when they need to review code, and it’s hard to ignore.

Coming up with new rules for everyone to follow is easy but sometimes ineffective. A much better approach is to create a system that makes new rules hard to ignore.