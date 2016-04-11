---
layout: post
title: "Cross Domain Communication And Data Storage With localStorage And postMessage"
meta-description: "Learn how you can create cross domain data storage and read from multiple domains. "
tags: ["cross-domain","html5","authentication"]
categories: ["dom"]
migrated: "true"
permalink: "/dom/html5-localstorage-3rd-party-storage-iframe/"
---
### Summary

You have probably seen stackoverflow's 3rd party authentication in action: when you visit one of their sister sites that you have never visited before it automatically knows who you are. That's possible with using 3rd party domain to store global encrypted session information and cross domain communication mechanism. For storage we can use either cookies and html5 localStorage and for communication we will look at using postMessage. 

Without getting into the security aspect of the global authentication, I want to show the cross domain communication mechanism that makes this possible. We will use **unsecure** personalization data, like user's first name for demonstration purposes. 

#### Browser support for localStorage
![localStorage browser support][2]

Most modern browsers support localStorage except IE6 and IE7, pretty much exact same storage with postMessage

#### Browser support for postMessage:
![postMessagebrowsersuport][3]

#### Browser Usage
That brings us to the question, how many users are still using IE6 and IE7 and after we look at the figures decide if we can leave with those numbers or go a painful route. 

As of February 2012 IE6 and IE7 are used by [3.6%][4] of all users, and that number decreasing pretty fast, it dropped 15% from previous months which was at 4.2%.  
So if you have a mission critical operation where you must support 100% of browsers then you have to go longer route and figure out your way through a tretcherous road of 3rd party cookies and additional cross domain communication scripts that support older browsers. [This][5] blog post has a nice write up about that.  

It will probably take you 3 time as long to make it work for those 3.6% of users. So if you can I would save yourself a major headache and write clean code for modern browsers. 

When I first started I was actually going to use cookies for storage, but later on I've discovered that IE blocks 3rd party content and you have go your way out to a [pretty complex workaround][6]. And there is also a reliability issue I sometimes experienced. 

### Storing data with 3rd party domain

We'll take a look at authentication example. Once you login to bob.com, it stores a some piece of information on frank.com storage. So when you visit another site bobsister.com, it can also read information from frank.com as long as frank has bobsister.com in the list of valid sites. This is of course is not designed to be secure, but it is also possible by encrypting messages stored in localStorage. Making it secure is a topic for another blog post.

![storage write example][7]


Upon authentication we add an iframe that will write Name to 3rd party page, this can be done server side as well as with javascript

        var src = 'https://www.frank.com/auth/global/write.aspx?name=Alice';
        $("body").append("<iframe id='global-auth-frame' style='display:none' src='" + src + "'></iframe>");

or

        public HtmlGenericControl CreateGlobalIdentityTag(string name)
        {
            var frame = new HtmlGenericControl("iframe");
            frame.Attributes.Add("src", "https://www.frank.com/auth/global/write.aspx?name=" + name);
            frame.Attributes.Add("height","1");
            frame.Attributes.Add("width", "1");
            frame.Attributes.Add("frameborder","0");
            frame.Attributes.Add("scrolling","no");
            return frame;
        }

Write page

    <%@ Page Language="C#" AutoEventWireup="false" CodeBehind="Write.aspx.cs" Inherits="Sample.Write" EnableViewState="false" %>
    
    <html>
    <head><title></title></head>
    <body>
         <asp:PlaceHolder runat="server" ID="plhWriteGlobalSession" Visible="False">
                <script type="text/javascript">
                    function hasLocalStorage() {
                        try {
                            return 'localStorage' in window && window['localStorage'] !== null;
                        } catch (e) {
                            return false;
                        }
                    }
    
                    function save(keyPrefix, value) {
                        if (!hasLocalStorage()) { return; }
    
                        // clear old keys with this prefix, if any
                        for (var i = 0; i < localStorage.length; i++) {
                            if ((localStorage.key(i) || '').indexOf(keyPrefix) > -1) {
                                localStorage.removeItem(localStorage.key(i));
                            }
                        }
    
                        // save under this version
                        localStorage[keyPrefix] = value;
                    };
    
                    save('<%= StorageName %>' + '-name', '<%=Name %>');
            </script>
        </asp:PlaceHolder>
    </body>
    </html>

And a code behind that check's if request came from trusted domain

    public partial class Write : System.Web.UI.Page
    {
        public string StorageName { get; set; }
        public string Name { get; set; }

        protected override void OnLoad(System.EventArgs e)
        {
            //Check if iframe UrlReferrer is valid
            if (Request.UrlReferrer != null && AuthorizedDomain(Request.UrlReferrer.Authority))
            {
                plhWriteGlobalSession.Visible = true;
            }
            else
            {
                return;
            }

            Name = Request.QueryString["name"];
            if (string.IsNullOrEmpty(Name))
                return;

            StorageName = "GlobalName";
            plhWriteGlobalSession.Visible = true;

            base.OnLoad(e);
        }

        private static bool AuthorizedDomain(string uri)
        {
            string[] authorizedDomains = new []
                                             {
                                                 "bob.com",
                                                 "bobsister.com"
                                             };
            return authorizedDomains.Contains(uri);
        }
    }

### Reading data from 3rd party domain

To read data from 3rd party we create an iframe similar to the write example.

And our read page will look like this. 

    <%@ Page Language="C#" AutoEventWireup="false" CodeBehind="Read.aspx.cs" Inherits="Sample.Read" EnableViewState="false" %>
    
    <html>
    <head>
    <title></title>
    </head>
    <body>
        <script type="text/javascript">
            function hasLocalStorage() {
                try {
                    return 'localStorage' in window && window['localStorage'] !== null;
                } catch (e) {
                    return false;
                }
            }
    
            function load(keyPrefix) {
                if (!hasLocalStorage()) { return null; }
                return localStorage[keyPrefix];
            }
    
            function serialize(obj) {
                var str = [];
                for (var p in obj)
                    str.push(p + "=" + obj[p]);
                return str.join("&");
            }        
    
        </script>
    
        <%-- Not authorized domain is making request--%>
        <asp:Panel runat="server" ID="pnlNotAuthorized" Visible="false">
            <script type='text/javascript'>
                if(top.postMessage != 'undefined' && top.postMessage != null){
                    top.postMessage('Not one of the authorized domains', "<%= Referrer %>");
                }
            </script>
        </asp:Panel>
    
        <%-- Authorized --%>
        <asp:Panel runat="server" ID="pnlAuthorized" Visible="false">
            <script type='text/javascript'>
                if (!hasLocalStorage()) {
                    if (top.postMessage != 'undefined' && top.postMessage != null) {
                        top.postMessage('No Local Storage', "<%= Referrer %>");
                    }
                }
    
                var storageKey = '<%= StorageKey%>';
                var data = { Referrer:  '<%= String.Format("{0}://{1}",Referrer.Scheme, Referrer.Authority) %>', Name : load(storageKey + '-name')};
                if (top.postMessage != 'undefined' && top.postMessage != null && data.Name != 'undefined' && data.Name != null) {
                    top.postMessage(serialize(data), data.Referrer);
                }
            </script>
        </asp:Panel>
    
    
    </body>
    </html>

If the domain making the 3rd party request is not authorized we display a not authorized panel which post "Not authorized message". Since postMessage is designed to use a string message, I've added a simple serialization method which formats object as a query string. I decided not to use outside libraries to serialize data to keep the number of requests to one and make this as fast as possible. 

And the code behind:

    public partial class Read : System.Web.UI.Page
    {
        public string Name { get; set; }
        public Uri Referrer { get; set; }

        protected override void OnLoad(EventArgs e)
        {
            if(Request.UrlReferrer == null) return;

            Referrer = Request.UrlReferrer;

            if (AuthorizedDomain(Referrer.Authority))
            {
                pnlAuthorized.Visible = true;
            }
            else
            {
                pnlNotAuthorized.Visible = true;
            }


            base.OnLoad(e);
        }

        ...

    }

The final piece is to subscribe our client side page page to receive Alice's name once the 3rd party global data is read cross domain. Once we receive that data we can display it to the user, and/or save it in the cookie so it server side will have it available on the next request.

    function deSerialize(text) {
        var result = { };
        var pairs = text.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var keyValuePair = pairs[i].split("=");
            result[keyValuePair[0]] = keyValuePair[1];
        }
        return result;
    }
    
    $(window).bind("message", function (event) {
        var e = event.originalEvent;
        if (e.origin !== "https://www.frank.com") {
            log("not authorized domain");
            return;
        }
    
        var data = deSerialize(e.data);
        if (data.Name && data.Name != "") {
            //Display name on the page, etc..

            log("Name is found " + data.Name);
        }
        else {
            log("No Global Session Found");
            setGlobalSessionCookie(false);
        }
    });

    function log(text) {
        if (window.console) {
            console.log("INFO: " + text);
        }
    };

I also learned the localStorage is based on the domain, so if you are going to be reading from secure pages make sure that you store and read from https domain because localStorage is different for secure and unsecure domains. 


### And there you have it.
Now you know how cross domain storage/communication is achieved with modern browsers. Let me know if you have any questions, and of course feedback is always greatly appreciated!

Cheers

  [1]: http://www.websequencediagrams.com/?lz=dGl0bGUgM3JkIHBhcnR5IFdyaXRlCgpBbGljZSdzIEJyb3dzZXIgLT5ib2IuY29tOiBMb2dpbgpub3RlIHJpZ2h0IG9mIAAUCQAfByBsb2dzIABABSBhbmQgY3JlYXRlcyBhbiBpZnJhbWUgXG53aGljaCBjYWxscyBhAHcLZG9tYWluIHdpdGhcbgCBAAh1bnNlY3VyZSBpbmZvcm1hdGlvbgoKAIENBy0-AIEgDzogUmVzcG9uc2UAQgUAbAhzcmM6IGdsb2JhbC5jb20AgVIUIGZyYW5rAIFjBgArCwANCS93cml0ZT9uYW1lPQCCHwUKAIF7DwA1C0ZyYW5rIHN0b3Jlc1xuaXQgaW4gbG9jYWxTdG9yYWdlCgoKAIJuEFJlYWQ&s=rose
  [2]: /uploads/12-03/localStorage-browser-support.png
  [3]: /uploads/12-03/postMessage-browser-support.png
  [4]: http://www.w3schools.com/browsers/browsers_explorer.asp
  [5]: http://www.onlineaspect.com/2010/01/15/backwards-compatible-postmessage/
  [6]: http://stackoverflow.com/questions/389456/cookie-blocked-not-saved-in-iframe-in-internet-explorer#answer-389458
  [7]: /uploads/12-03/write.png