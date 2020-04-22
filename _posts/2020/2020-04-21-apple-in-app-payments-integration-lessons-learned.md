---
layout: post
category: blog
published: true
title: Apple In-App Payments Integration Lessons Learned
tags:
  - in-app-purchase
  - ios
  - storekit
  - objective-c
meta description: >-
  Describes a few not documented scenarios that have surfaced for me in the past in production environment.  
---

After having integrated in-app payments using Apple platform and processing tens of thousands of purchase receipts through the back-end, I’ve learned a few valuable lessons about issues that can only surface in production. Some of these gotchas are either not documented, hard to find in documentation or just strange behavior that only presents itself in a live environment. This is a guide that I wish I had while I was integrating; it would have saved me a few gray hairs.

## Empty in_app transactions array in successful purchase receipts

There is a small percentage of successful purchase receipts, when verified via back-end by calling Apple’s API, that do not contain any in-app transactions. In the response received from the API, in_app array field is empty (`in_app:[]`). The latest advice I found on this issue was from Apple’s technical support engineer in this [forum post](https://forums.developer.apple.com/thread/72893). He clarified that **when the receipt does not contain any transactions, it’s not a valid receipt and you should never call `finishTransaction`** for these types of receipts. There is also another, older solution to this problem that I think is no longer valid and that is asking users to refresh a purchase receipt. As another highly rated support user in that forum post pointed out, the purchase receipt is refreshed before `updatedTransactions` callback, therefore the receipt should contain updated information and refreshing it is unnecessary.

## Strange transaction id formats in purchase receipts

Normally transaction ids are 15 digits like:

`400000123456789`

But there are times when our server receives a receipt with the transaction in the following, uuid format:

`FAB60FFD-906D-48CB-8FED-092C4B2707D6`

These strange receipt formats when verified with Apple’s back-end also come back with an empty `in_app[]` array. There is no definite answer on [stackoverflow.com](http://stackoverflow.com) or Apple’s developer forums, but it looks like it could be a hack. The best course of action is to not call `finishTransaction` on a receipt that doesn’t have transactions and is not valid.

## Nil SKPayment.applicationUsername for some transactions in production environment

Calling a method on a `nil` reference guarantees to crash your app and will make your coworkers give you that look that you don’t know what you are doing.

The `applicationUsername` property of the `SKPayment` object is one of the fields that may have a value while you are developing and even pass QA. However, for a small percentage of users it will be null in production. And if you didn’t pay careful attention to documentation you are guaranteed to create a really bad experience for a small percentage of your users. In documentation, the description of this property contains an **important** section that calls out:

> The [applicationUsername](https://developer.apple.com/documentation/storekit/skmutablepayment/1506088-applicationusername?language=objc) property is not guaranteed to persist between when you add the payment transaction to the queue and when the queue updates the transaction. Do not attempt to use this property for purposes other than providing fraud detection.

What this also is trying to tell you is that sometimes this property will be nil, and if you call a method on a nil property you will crash your user’s device. If you are not careful, after a user makes a payment, his app will crash and will continue crashing on every restart because your application will try to reprocess the payment transaction on every startup. This behavior is impossible to catch testing.

## Being careful with nil fields on callbacks

### For purchase callbacks:

The following fields are only available when `transactionState` is `SKPaymentTransactionState.purchase` or `SKPaymentTransactionState.restored`.

-   SKPaymentTransaction.transactionDate
-   SKPaymentTransaction.transactionIdentifier

### For product callbacks:

If Apple rejects your app and in-app purchase products during the approval process, product data for rejected items retrieved via `SKProductsRequest` will contain some invalid information. Unfortunately, I wasn’t able to pinpoint the problem because it was happening only in production, and we didn’t have debug symbols uploaded at that time. So to be on the safe side, I opted in for checking every [SkProduct](https://developer.apple.com/documentation/storekit/skproduct) attribute for null before reading a value or calling method on the attribute. This is more of a brute force solution, but at least your `SKProducts` callback won’t crash your app after Apple rejects in-app products.

## Keep a strong reference to SKProductsRequest

Be sure not to miss the “Note” section of the [SKProductRequest description](https://developer.apple.com/documentation/storekit/skproductsrequest?language=objc) about keeping a strong reference to the `SKProductRequest` object.

If your app can receive multiple requests to retrieve products, I would add `SKProductRequest` references to a `NSMutableSet` data structure and remove them after `requestDidFinish` callback fires.

Here is an example for initiating get products info request.
```
- (void)getProducts:(NSSet*)productIDs {  
  NSLog(@"Requesting %lu products", (unsigned long)[productIDs count]);  
  
  SKProductsRequest* productsRequest = [[SKProductsRequest alloc] initWithProductIdentifiers:productIDs];  
  productsRequest.delegate = self;  
  
  @synchronized(_productsRequests) {  
    [_productsRequests addObject: productsRequest];  
  }  
  [productsRequest start];  
}
```
Example interface:
```
@interface IapAppleDelegate : NSObject<SKProductsRequestDelegate>  
{  
  NSMutableSet *_productsRequests;  
}
```
Removing references after request has be completed. 
```
- (void)requestDidFinish:(SKRequest *)request  
{  
  @synchronized(_productsRequests) {  
    [_productsRequests removeObject:request];  
  }  
}
```

## Summary

In-app purchase integration with Apple may not seem super complex but the devil lies in the details, and you want to be very thorough with documentation. It will pay dividends to read about every property that you will be using data from and following advice from the “Notes” and “Important” sections of documentation. Don’t rely on examples found on the web or in GitHub alone, as they might be incomplete and could get you in trouble.

Other things like empty `in_app` array or strange transaction id formats don’t get mentioned in the documentation and are left for developers to discover when the app goes live. Hopefully this post has been helpful in providing you information on how to deal with undocumented scenarios.
