---
layout: post
title: "Implementing 2 Legged OAuth with ASP.NET and Google Gdata Library"
meta-description: "A quick class based on Google.Data.Client to sign 2 legged oauth requests."
tags: ["asp.net","oauth","factual"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/2-legged-oath/"
---
Unfortunately Factual api's doesn't have a .net client library. But it's not a big deal, to get started all we need is to create a signed 2 legged oauth web request and hack query string together.

On the quest for simplest way to create a 2 legged oauth requests I stumbled upon
Google.Data.Client library which already takes care of hashing and creating signatures for your request. All we have to do is to extend the OAuthAuthenticator class and make one override.

First you need to install Google's library by going to your NuGet console and 

      Install-Package Google.GData.Client

Then create a new class that inherits from Google.GData.Client.OAuthAuthenticator:

    using System.Net;
    using Google.GData.Client;

    public class OAuth2LeggedAuthenticator : OAuthAuthenticator
    {
        public OAuth2LeggedAuthenticator(string applicationName, string consumerKey, string consumerSecret) : base(applicationName, consumerKey, consumerSecret)
        {
        }

        public override void ApplyAuthenticationToRequest(HttpWebRequest request)
        {
            base.ApplyAuthenticationToRequest(request);
            string header = OAuthUtil.GenerateHeader(request.RequestUri, ConsumerKey, ConsumerSecret, null, null, request.Method);
            request.Headers.Add(header);
        }
    }

And here is sample of the Factual service that uses that new class to make requests

    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net;
    using System.Linq;
    using Newtonsoft.Json.Linq;
    using RestaurantRep.Data.Model;
    
    namespace RestaurantRep.Data.Services
    {
        public class FactualService
        {
            private const string OAuthKey = "youroauthkey";
            private const string OAuthSecret = "yoursecretkey";
            private const string factualApiUrl = "http://api.v3.factual.com";
    
            private readonly OAuth2LeggedAuthenticator _factualAuthenticator; 
    
            public FactualService()
            {
                _factualAuthenticator = new OAuth2LeggedAuthenticator("RestaurantRep", OAuthKey, OAuthSecret);
            }
    
            //sample query limit=50&filters={\"name\":\"Bar Hayama\"}"
            public HttpWebRequest CreateFactualRestaurantRequest(string query)
            {
                var requestUrl = new Uri(string.Format("{0}/t/restaurants-us/read{1}", factualApiUrl, query));
                return _factualAuthenticator.CreateHttpWebRequest("GET", requestUrl);
            } 
    ...

And here is the ASP.NET Async Controller which queries Factual Api

    using System.IO;
    using System.Net;
    using System.Web;
    using System.Web.Mvc;
    using RestaurantRep.Data.Services;
    
    
    namespace RestaurantRep.Web.Controllers
    {
        public class FactualController : AsyncController
        {
            private readonly FactualService _service;
            public FactualController()
            {
                _service = new FactualService();
            }
    
            public void RestaurantsAsync()
            {
                AsyncManager.OutstandingOperations.Increment();
    
                var request = _service.CreateFactualRestaurantRequest(HttpUtility.UrlDecode(Request.Url.Query));
                request.BeginGetResponse(asyncResult =>
                {
                    using (WebResponse response = request.EndGetResponse(asyncResult))
                    {
                        using (var reader = new StreamReader(response.GetResponseStream()))
                        {
                            var jsonResult = reader.ReadToEnd();
                            AsyncManager.Parameters["restaurants"] = jsonResult;
                            AsyncManager.OutstandingOperations.Decrement();
                        }
                    }
                }, null);
                
            }
    
            public ContentResult RestaurantsCompleted(string restaurants)
            {
                return new ContentResult { Content = restaurants, ContentType = "application/json" };
            }
        }

As always, please let me know if you have questions.