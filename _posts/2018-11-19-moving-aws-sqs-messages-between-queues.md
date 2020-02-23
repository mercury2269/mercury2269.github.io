---
layout: post
category: blog
published: true
title: Best way to move AWS SQS messages between queues
tags:
  - amazon-sqs
meta description: >-
  SQSMover is a handy small utilty app that allows you to move messages between
  queues.
---
I've recently updated a tiny utility script ([sqsmover](https://github.com/mercury2269/sqsmover)) that I wrote when I was learning Go Lang that moves AWS SQS messages between queues. After three years, it is still a userful tool when I need to move messages between queues. I feel like it could be useful to others who use SQS and deadletter queues because at one point something is going to fail and your messages will end up in the deadletter. 

In order to polish it, I've included the following features:

### Help menu 
![sqs mover help menu](https://github.com/mercury2269/mercury2269.github.io/raw/master/uploads/2018/sqsmover_help.png "SQS Mover help menu")

### Region flag
Original version had region hardcoded in the code and needed a code change if you used a different region, oops. I've modified to allow region to be overwritten as a command line flag and default to `us-west-2`.

### FIFO queues support
When sending messages to FIFO queues MessageGroupId is a required field, and because it is not part of the message you have to explicitly copy it from the original message to the destination. Finally every message in the FIFO queue has a deduplication id. It's either explicitly set by the caller or automatically hashed based on the message content. Because I want to support all FIFO queues, deduplication id is also copied when moving messages.

###  Installation
Updated installation options with homebrew tap install `brew install mercury2269/homebrew-tap/sqsmover` for macOS, shell script for macOS, Linux, or OpenBSD. And compiled binary for Windows. No longer in order to install the app you have to have Go Lang installed locally and issue a `go get ...` command. This was pretty easy to do with awesome [goreleaser](https://github.com/goreleaser/goreleaser) project and companion [godownloader](https://github.com/goreleaser/godownloader). GoReleaser automatically creates binary releases and publishes it to github while GoDownloader will create a bash script for one line installation. 

### Intuitive error messaging
It sucked when your script fails and you don't know what went wrong, so I've included a lot more user friendly error messages that should help users with figuring out what needs to be done. 

![error](https://github.com/mercury2269/mercury2269.github.io/raw/master/uploads/2018/sqsmover_error.png "SQS Mover errors")

### Progress indicator
For the first version app I used to just output every message moved to the screen. This is not very useful if you have thousands of messages. A better user experience is to include a progress indicator. 

![progress indicator](https://github.com/mercury2269/mercury2269.github.io/raw/master/uploads/2018/sqsmover_progress.gif "SQS Mover progress indicator")

## Future work
At the moment the utility is using a batch download and upload which moves about 10 messages at a time. It's pretty fast if you need to move few thousand of messages but if you have a million stuck in the deadletter queue I could imagine it could take a while. To speed up, I'm thinking to introduce multiple receiver and consumer threads and allow users to specify how many threads to use.

That's it let me know if you come accross any issues using github, thanks!




