---
layout: post
title: "Building persistent identity and secure authentication module in ASP.NET"
meta-description: "Simple module to allow users to stay logged for long periods of time as well as having a separate secure session."
tags: ["asp.net","authentication","httpmodule","iidentity"]
categories: ["asp-net"]
migrated: "true"

---
I think it's awesome when sites allow you to stay logged in for long periods of time. As well as asking to re-login when I try to go to some pages where higher level security is needed like account or credit cart pages. It makes me feel warm and secure inside. 

Currently one of such examples is Amazon. Once you I log in and lets say come back in few days it will still say a cheerful "Hello Sergey, we have recommendations for you!", but if I try to go to account page it will ask me to relogin. 

In this post I'd like to show how simple and straight forward it is to create "dual" sessions in ASP.NET. One long term not critical session which is always there and doesn't require SSL, and another which is secure. And if you haven't logged in for short amount of time will ask you to re-login.

First we have to look at how ASP.NET handles authentication. If you don't have forms authentication enabled you turn it on like this in web.config

    <authentication mode="Forms" />

By default asp.net binds a series of modules in the machine.config that fires depending on your configuration settings. So when the above statement is included it will first run a System.Web.Security.FormsAuthenticationModule on every request which will look if the authentication cookie is there. If cookie is not there default module creates an empty HttpContext.User. And if cookie exists it will decrypt value from the cookie and setup HttpContext.User with that information.

So that's all nice and standard but how do we have two sessions and create a custom identity that will tell us non secure user information like name as well as keep track if user has a secure session.

Asp.net provides the following authentication extensibility points in order of execution:

 1. HttpModules can subscribe to AuthenticateRequest event of the context
 2. In Global.asax Application_AuthenticateRequest method will get executed once the user identity has been validated.

FormsAuthenticationModule will set a default identity if HttpContext.User in not set in one of those modules.

Let's begin, first lets create a custom static helper class which will abstract SignIn functionality and creating of two sessions. We'll call it CustomAuthentication. 


    public class CustomAuthentication
    {
        public static void SetAuthCookies(string userName, string fullName)
        {
            var context = HttpContext.Current;

            FormsAuthenticationTicket identityTicket = new FormsAuthenticationTicket(1, userName, DateTime.Now, DateTime.Now.AddDays(60), true, fullName);
            string encryptedIdentityTicket = FormsAuthentication.Encrypt(identityTicket);
            var identityCookie = new HttpCookie("ASPXIDENT", encryptedIdentityTicket);
            identityCookie.Expires = DateTime.Now.AddDays(60);
            HttpContext.Current.Response.Cookies.Add(identityCookie);

            FormsAuthentication.SetAuthCookie(userName,false);
        }
    }

In this method we first create an "identity" cookie which is our long lived cookie, and not designed to be SSL secure but is still encrypted. It has additional data like full name of the person. And we also call regular FormsAuthentication.SetAuthCookie to create an authentication cookie which we set as secure in our web.config and will have 30 minutes expiration.

    <authentication mode="Forms">
      <forms loginUrl="~/Account/Login.aspx" timeout="30" requireSSL="true" />
    </authentication>

Ok so now on our login page if we call this method we'll have 2 cookies created a default authentication and identity cookie.

    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            RegisterHyperLink.NavigateUrl = "Register.aspx?ReturnUrl=" + HttpUtility.UrlEncode(Request.QueryString["ReturnUrl"]);
        }

        public void OnLoginClick(object sender, EventArgs e)
        {
            if(true) // this is where you would check if user is valid
            {
                CustomAuthentication.SetAuthCookies("mercury2269", "Sergey Maskalik");
                Response.Redirect("/");
            }
        }

So now when we login we have two cookies one for identity and one for authentication. If you are going to be running a sample project, make sure you set up IIS Express to use ssl, which is pretty easy by clicking on the project name and pressing F4 to project properties and enabling SSL. The login page would not work otherwise.

When we login, we'll now see two cookies:

![Authentication Cookies][1]


So, if we leave it right now we'll have a generic identity which will expire in 30 minutes. But We want to override it with our own new born identity, so we'll create a custom identity and HttpModule to get this done.

    public class CustomIdentity : GenericIdentity
    {
        private string _fullName;

        public CustomIdentity(string userName, string fullName) : base (userName)
        {
            _fullName = fullName;
        }

        public bool HasIdentity
        {
            get { return !string.IsNullOrWhiteSpace(_fullName); }
        }

        public string FullName
        {
            get { return _fullName; }
        }

        public static CustomIdentity EmptyIdentity
        {
            get { return new CustomIdentity("", ""); }
        }
    }

We'll reuse default established identity since that work is already done for us, and basically add two more properties which will say if current user has identity and if it has full name. And since identity cannot be null we'll create a static helper property to return an empty identity.

        public void OnAuthenticateRequest(object sender, EventArgs e)
        {
            string identityCookieName = "ASPXIDENT";
            HttpApplication app = (HttpApplication)sender;

            // Get the authentication cookie
            HttpCookie identityCookie = app.Context.Request.Cookies[identityCookieName];

            // If the cookie can't be found don't issue custom authentication
            if (identityCookie == null)
                return;

            // decrypt identity ticket
            FormsAuthenticationTicket identityTicket = (FormsAuthenticationTicket)null;
            try
            {
                identityTicket = FormsAuthentication.Decrypt(identityCookie.Value);
            }
            catch
            {
                app.Context.Request.Cookies.Remove(identityCookieName);
                return;
            }

            string name = "";
            HttpCookie authCookie = app.Context.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                try
                {
                    FormsAuthenticationTicket authTicket = FormsAuthentication.Decrypt(authCookie.Value);
                    if (authTicket.Name != identityTicket.Name) return;
                    name = authTicket.Name;
                }
                catch
                {
                    app.Context.Request.Cookies.Remove(FormsAuthentication.FormsCookieName);
                    return;
                }
            }

            var customIdentity = new CustomIdentity(name, identityTicket.UserData);
            var userPrincipal = new GenericPrincipal(customIdentity, new string[0]);
            app.Context.User = userPrincipal;
        }

Ok so now when user is logged in we will have a custom identity set, which can be access on pages like so: 

    (CustomIdentity)HttpContext.Current.User.Identity

We'll create a helper method to abstract this for us and make it nice and tidy.

    public class IdentityHelper
    {
        public static CustomIdentity CurrentUser
        {
            get
            {
                if (HttpContext.Current.User.Identity is CustomIdentity)
                    return (CustomIdentity)HttpContext.Current.User.Identity;

                return CustomIdentity.EmptyIdentity;
            }
        }
    }

Now we'll add module to web.config

      <system.webServer>
       <modules runAllManagedModulesForAllRequests="true">
         <add name="CustomAuthentication" type="CustomAuthenticationSample.Application.CustomAuthenticationModule, CustomAuthenticationSample"/>
       </modules>

And that's it! We can now access our new custom identity by simply calling our IdentityHelper class and make decisions based on it. 

            if(IdentityHelper.CurrentUser.HasIdentity)
            {
                lblIdentityInfo.Text = "Whoo hoo User has identity, full name is: " + IdentityHelper.CurrentUser.FullName;
            }

            if(IdentityHelper.CurrentUser.IsAuthenticated)
            {
                lblIdentityInfo.Text += "<br />User has secure authentication session";
            }

Now when we login on secure page we'll have
![secure pages][6]

And if secure session is expired or not over https
![unsecure pages][3]

So now we have a long lived session that will persist for 60 days and a secure session which will expire in 30 minutes.
 
**I'd like to hear your opinion and please post comments if you have any questions!**


[Project code sample][4]


[![kick it on DotNetKicks.com][2]][5]


  [1]: http://blog.maskalik.com/get/12-02/custom_authenticaion_cookies.png
  [2]: http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2fblog.maskalik.com%2fasp-net%2fcustom-authentication-module
  [3]: http://blog.maskalik.com/get/12-02/http_identity.png
  [4]: http://blog.maskalik.com/get/12-02/CustomAuthenticationSample.zip
  [5]: http://www.dotnetkicks.com/kick/?url=http%3a%2f%2fblog.maskalik.com%2fasp-net%2fcustom-authentication-module
  [6]: http://blog.maskalik.com/get/12-02/https_identity.png
