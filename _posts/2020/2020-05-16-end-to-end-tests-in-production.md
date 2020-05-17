---
layout: post
category: blog
published: true
title: Automated End-to-End Tests In Production
tags:
  - thoughts
  - ideas
meta description: >-
  Describes an idea about extending automated end-to-end tests to production environment to ensure all dependencies are configured correctly.
---

One of the challenges for large multi-tenant systems that rely on many external services to complete a single request is ensuring that each dependency is configured correctly in production environments. In addition, if a system is geographically distributed, each instance may depend on different versions of external services.

Even with the best intentions, humans who have to configure and maintain these types of complex systems are known to be unreliable.

> ... [one study](http://roc.cs.berkeley.edu/papers/usits03.pdf) of large internet services found that configuration errors by operators were the leading cause of outages, where hardware faults (servers or network) play a role in only 10-25% of outages. Designing Data-Intensive Applications, Martin Kleppmann

Due to many possible test scenarios, manual regression testing after each release is not practical, especially if your team is following a [continuous delivery](https://en.wikipedia.org/wiki/Continuous_delivery) approach.

Monitoring of critical paths provides good feedback about already configured tenants and is an important tool when making production releases. However, some geographical regions may be outside of their peak hours and monitoring alone may not provide fast enough feedback about deployments to production. Also, when new tenants are brought online you still have to validate configuration and dependencies in production.

Traditionally automatic end-to-end tests were reserved only for pre-production environments; however, if your production environments rely on a multitude of external services to complete a single request, extending end-to-end tests to production can help to ensure that all tenant dependencies are configured properly. The goal of these production tests is not to run a full regression suite, but to only test critical paths.

Depending on how your end customers interact with your system, automatic end-to-end tests can run against a public facing web user interface (UI) using something like the Selenium Webdriver, or directly against public API endpoints.

Triggered from a Continuous Integration (CI) system, after deployments to production environments, a test suite will provide an immediate detection and warning of any underlying issues. By having clear results of what is failing, production end-to-end tests will also save time for engineers who might otherwise receive bug reports from different channels and will have to sift through the logs to figure out what went wrong. Finally, because all possible critical paths are tested in production after deploys, tests will provide additional confidence about deploys that may not be present by monitoring alone.

In addition to running end-to-end tests by CI, these tests can be triggered manually or automatically after configuration changes to production. Ability to run critical path tests in production on demand will also reduce manual QA overhead needed to verify that that everything is working as expected after a configuration change.

Unfortunately, running tests in production will create test data in production databases. I personally don’t like to delete data from production databases, even if it’s test data, because your database is a system of record, and it’s important for it to stay intact for troubleshooting. Therefore, you would need to keep track of test users/transactions and filter out test transactions from consumers of your data.

Finally, test results will be fed into a monitoring system and displayed on the team’s dashboard. Alerts are also configured on this data.

## Putting it all together

When dealing with a lot of external dependencies and configuration permutations in a system, we need to think outside of the box and engineer solutions that can help us to deal with additional complexity. While it’s important to ship software bug free, there are use cases when it’s much more efficient to verify that software is bug free right after it’s deployed to production.
