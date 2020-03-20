---
layout: post
category: blog
published: true
title: Cross-Platform In-App Purchases in iOS
tags:
  - in-app-purchase
  - ios
  - cross-platform
meta description: >-
  Provides missing documentation about how to implement cross platform In-App Purchase types. 
---
Implementing cross-platform purchases in iOS is not very well documented and can cause some anxiety before submitting your app for Apple’s approval. In this post I’m hoping to provide some basic guidance and explanation about which type of in-app products are best suited for that task.

The use case I’m describing is when a user's purchased inventory is tied to an organizational (non-apple) user account and is tracked by an external service. For example, when a user buys a song from your mobile app on iOS or Android device, and then logs in to a web version of your app, the song should be instantly available to play in his/her collection. It also works the other way around, where you can buy something on the web, and it should be available on a mobile device. The purchased inventory and the list of available products is independent of the mobile platform. The bottom line: , it will be the responsibility of your inventory service to make sure that items which were already purchased can only be purchased once and not be displayed to the users.

One of the in-app purchase types that is not compatible with cross-platform payments is the App Store’s non-consumable type. Apple developer documentation defines it as:

> Non-consumables are purchased once and do not expire, such as additional filters in a photo app.

This type also comes with a an important requirement:

> If your app sells non-consumable, auto-renewable subscription or
> non-renewing subscription products, you must provide users with the
> ability to restore them.”

If you want to sell a cross-platform product that can only be purchased once, after reading the Apple definition, you may think that non-consumable type is the answer, but the additional requirement may confuse you.

There is also one place ([App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/#business)) where documentation mentions multi platform services, but it doesn’t say anything about non-consumable types.

> 3.1.3(b) Multiplatform Services: Apps that operate across multiple platforms may allow users to access content, subscriptions, or
> features they have acquired in your app on other platforms or your web
> site, including consumable items in multiplatform games, provided
> those items are also available as in-app purchases within the app.

One of the features of App Store’s StoreKit is the ability to manage inventory of purchased items, meaning it will be responsible for filtering out items that were already purchased. This is handy if a user has lost or bought a new iOS device because it offers the ability to restore purchased items. However, when you let Apple manage your inventory, the purchased inventory will be tied to a user’s iTunes account and not your cross-platform user account. It’s also problematic if a user purchases an item outside of Apple’s platform; Apple would not be able to restore it.

When the inventory is managed by an external service there is no need for the second purchase management system (apple). The inventory travels with your organizational user account, available after login, and does not need to be restored to the device. Therefore, even though Apple does not mention it, non-consumable types are not compatible with the multiplatform purchase inventory.

This is why **you can only use a consumable purchase type when you have an external purchased inventory**. As soon as a user makes a purchase you top up his/her organizational account with content and consume the item. This inventory service is also used to filter out items that were already purchased because Apple is not a system of record anymore.

Making all your in-app products consumables, even for items that can only be consumed once, might make you nervous, especially if you haven’t gone through the apple approval process before. But logically there is no other way. So hopefully this post save you some anxiety.