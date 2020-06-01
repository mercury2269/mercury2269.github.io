---
layout: post
category: blog
published: true
title: "AWS RDS: You may not need Provisioned IOPS"
tags:
  - aws
  - rds
meta description: >-
  Choosing between GP2 and Provisioned IOPS for RDS database storage. 
---

When choosing a Solid State Drive (SSD) type for your low latency, transactional Amazon Relational Database Service (RDS), Amazon Elastic Block Store (EBS) provides two options: General Storage (GP2) and Provisioned IOPS (IO1). The IO1 type is a much more expensive option, and you want to make sure that your database workload justifies that additional cost. We’ll look at reasons why you may need IO1 vs GP2.

## Performance and performance consistency

[EBS documentation](https://aws.amazon.com/ebs/volume-types/) describes IO1 as “Highest-performance SSD volume for mission-critical low-latency or high-throughput workloads” and with use cases of “Critical business applications that require sustained IOPS performance, or more than 16,000 IOPS or 250 MiB/s of throughput per volume.” IOPS are defined as a unit of measure representing input/output operations per second with operations measured in Kilobytes (KiB) maxim of 256KiB for SSD volumes.

Mark Olsol, Senior Software Engineer on the EBS team, mentioned in one of the Amazon [re:Invent talks](https://www.youtube.com/watch?v=2wKgha8CZ_w) that between both volume types “... the performance is very similar, it’s the performance consistency that’s different between the two. In benchmark you won’t notice, but you’ll notice it over time.”

Below 16,000 IOPS or 250MiB/s of data throughput both volume types can be configured to have the same amounts of IOPS and, as Mark said, have very similar performance. With the GP2 volume type, IOPS are provisioned by volume size, 3 IOPS per GB of storage with a minimum of 100 IOPS. Provisioning IOPS for the IO1 volume type is not dependent on the disk size as long as it's [below 50 IOPS per 1 GB](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html#EBSVolumeTypes_piops) rate.

The difference in performance consistency that Olson has mentioned, and the actual consistency numbers are specified in the documentation: “GP2 is designed to deliver the provisioned performance 99% of the time” while IO1 “...designed to deliver the provisioned performance 99.9% of the time”. Therefore, below maximum throughput,  if your system can tolerate 99% storage performance consistency and does not need 99.9%, GP2 volume type is a much more cost effective option.

## Throughput

Throughput measures how much time it takes for a disk to read or write data. The throughput depends on how many IOPS are configured and how much data is read/written per I/O operation (capped at 256KiB). Maximum throughput for GP2 depends on the instance size and I/O size, with the maximum throughput of 250MiB/s achieved at 1000 IOPS x 256KiB at 334 GiB disk size.

If the database workload is data intensive and requires more than 250MiB/s throughput, GP2 will not be the right volume type. Transactional systems don’t usually read/write large amounts of data at once, but still it is possible to hit the 250MiB/s cap with a workload of more than 16KiB I/O size and 16,000 IOPS (5,334 GB disk size). Of course your workload may be different, and you always need to check the average I/O size for your database.

## Cost comparison

Given the same number of provisioned IOPS for both drives and throughput of less than 250MiB/s, the performance consistency with IO1 types does not come cheap. And because the performance is very similar, you can save a lot of money if your application doesn’t need 99.9% performance consistency. Here is a table comparing [monthly cost](https://aws.amazon.com/ebs/pricing/) of GP2 baseline IOPS with the exact same size and provisioned IOPS of the IO1 type.

![](https://github.com/mercury2269/mercury2269.github.io/raw/master/uploads/2020/20200531-iops-to-gp2-price-comparison.jpg)
## Choosing a correct instance type

Another important factor that could limit the performance of your database is an underlying virtual Amazon Elastic Compute Cloud (EC2) instance type. EBS bandwidth varies between different EC2 instance types, and it’s possible that the EC2 bandwidth is less than the maximum amount of throughput supported by your EBS volume. I’ve personally run into this issue when my application’s database instance type was configured at `m4.xlarge` with dedicated EBS performance of 750 Mbps which translated to about 93.76 MiB/s, which was less than 250MiB/s expected throughput of the storage. EC2 instance type specifications are listed [here](https://aws.amazon.com/ec2/instance-types/).

## Summary

Taking time to understand your database workload and differences between the two storage types, GP2 and IO1, can potentially reduce costs and improve the performance of your application.