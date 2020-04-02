---
layout: post
category: blog
published: true
title: Refunding Google Play In-App Purchases via API with Java
tags:
  - in-app-purchase
  - android
  - java
meta description: >-
  Describes how to refund Android in-app purchases in back-end with Java.
---

This article describes how to use Google Play Developer API with the Google API Client library with Java to refund Google Play In-App Purchases. Hopefully this information and the example script provided will save someone a bit of time.

Unlike Apple App Store, the Google Play platform offers an ability to refund in-app purchase orders, which can be accomplished using one of the following:

-   Manually via the [Google Play Console](https://developer.android.com/distribute/console/) on the web.
-   Programmatically via a REST API
    

If you need to refund more than a handful of orders, the REST API is a life saver. Google also provides a [library](https://github.com/googleapis/google-api-java-client-services/tree/master/clients/google-api-services-androidpublisher/v3) that makes it very easy to get started. The only downside is there aren’t many examples and the documentation just points to the Javadoc references. Having gone through that exercise, here is my own example on how to refund orders using v3 of the client library.

## Prerequisite
You will need a Google Service account that has permissions to manage orders.

> 1.  Go to the [API Access](https://play.google.com/apps/publish/#ApiAccessPlace) page on the Google Play Console.
> 2.  Under **Service Accounts**, click **Create Service Account**.
> 3.  Follow the instructions on the page to create your service account.
> 4.  Once you’ve created the service account on the Google Developers Console, click **Done**. The [API Access](https://play.google.com/apps/publish/#ApiAccessPlace) page automatically refreshes, and your service account will be listed.
> 5.  Click **Grant Access** to provide the service account the rights to manage orders.

If you get lost you can also try [this guide](https://developers.google.com/android-publisher/getting_started#setting_up_api_access_clients) from Google's docs. 

## Installation

Add the Google API Client library to your project using your favorite build tool.

### Maven
Add the following lines to your `pom.xml` file:
```
<project>
  <dependencies>
    <dependency>
      <groupId>com.google.apis</groupId>
      <artifactId>google-api-services-androidpublisher</artifactId>
      <version>v3-rev20200223-1.30.9</version>
    </dependency>
  </dependencies>
</project>
```

### Gradle
```
repositories {
  mavenCentral()
}
dependencies {
  compile 'com.google.apis:google-api-services-androidpublisher:v3-rev20200223-1.30.9'
}
```
## Example Script

{% gist ecc31a7d8a479f0c5c82d5a4a917006d %}

In the above script

-   Refund API returns 204 HTTP Status Code (No content) if a refund was successful.
-   Additional logging is enabled by calling enableLogging() . This provides debug logging of NetHttpTransport request/response.
  
Hopefully this example script will save someone a bit of time.
