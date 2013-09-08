---
layout: post
title: "Sprinkle some design into ASP.NET User Controls"
meta-description: "Simple techniques to make ASP.NET User Controls independent unit of work."
tags: ["asp.net","patterns","user-control"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/user-controls-design-patterns/"
---
We don't always get to work on the cool stuff like ASP.NET MVC. So for those unfortunate ones we'll explore some things that can make ASP.NET User Controls follow some patterns and in the end make Web Forms world a better place :)

In ASP.NET, User Controls if designed properly, can play a role of reusable UI components and decrease number of code and markup. It should also make your web project easier to maintain by centralizing code in one location. 

##Parent Page Contract

I think the most important and challenging task that developer faces when building a user control is to make it independent from the page. For simple controls that  don't require any input or don't communicate with the page that job is extremely easy. 

**Traditional way:**

On the other hand, most of the controls that we build will require some kind of input from the page. The easiest way is to make a public property on the control and have page set it like so:


    public partial class SimpleControl : UserControl
    {
        public int MaximumResults { get; set; }
        protected void Page_Load(object sender, EventArgs e)
        {
            for (int i = 0; i < MaximumResults; i++)
            {
                litResults.Text += i.ToString();
            }
        }
    }

And set it on the page:

    public partial class Default : Page
    {
        protected override void OnLoad(EventArgs e)
        {
            ctlSimpleControl.MaximumResults = 5;
            base.OnLoad(e);
        }
    }

There is one problem with this, the control requires you to supply that maximum results number and if some other developer than you tries to use this control he will have to read through the code, which won't be as simple as above and figure out what properties it needs to set. We can improve the situation a little by throwing an exception during OnLoad

    protected void Page_Load(object sender, EventArgs e)
    {
        if(MaximumResults == 0)
            throw new ConfigurationErrorsException("Missing maximum results");

**Programming to an interface:**

Another was it to create a "contract" between page and user control, so if anyone wants to use the user control they must implement an interface on the page.

    public interface ISimpleControl
    {
        int MaximumResults { get; set; }
        int Heigh { get; set; }
        int Width { get; set; }
    }

And our user control will communicate with the parent page through that interface, and throw exception if interface is not implemented. 

    public partial class BetterControl : System.Web.UI.UserControl
    {
        public IBetterControl PageContract { get; set; }
        protected override void OnLoad(EventArgs eventArgs)
        {
            PageContract = Page as IBetterControl;
            if (PageContract == null)
            {
                throw new Exception("Parent page does not implement IBetterControl interface");
            }
    
            for (int i = 0; i < PageContract.MaximumResults; i++)
            {
                litResults.Text += i.ToString();
            }
            base.OnLoad(e);
        }
    }

Now if another developer slaps your control on the page without implementing an interface he will get an exception which will let him know what he needs to implement in order for this control to properly work. Like so:

    public partial class BetterPage : Page, IBetterControl 
    {
        public int MaximumResults { get; set; }
        public int Heigh { get; set; }
        public int Width { get; set; }

        protected override void OnLoad(EventArgs e)
        {
            MaximumResults = 4;
            base.OnLoad(e);
        }
    }

This way if user intentionally leaves a 0 for MaximumResults property, User Control will work as intended. 

##Exposing events in your user control. 

Let's say your user control is doing account authentication, it's always nice if it provides an event to which a parent page can subscribe and act. For example when user successfully authenticates page would execute a method which will redirect to some other page. That way your User Control stays independent from implementation and does only one thing that it meant to do.

        public event EventHandler SuccessfulLogin;
        protected void OnLoginButtonClick(object sender, EventArgs e)
        {
            if(txtUsername.Text == "user" && txtPassword.Text == "password")
            {
                FormsAuthentication.SetAuthCookie("user",true);
                if (SuccessfulLogin != null)
                    SuccessfulLogin(this, EventArgs.Empty);
            }
        }

Subscribing:

    <uc:LoginControl runat="server" OnSuccessfulLogin="OnSuccessfulLogin"></uc:LoginControl>

And implementing on page

    public partial class Login : System.Web.UI.Page
    {
        protected void OnSuccessfulLogin(object sender, EventArgs e)
        {
            Response.Redirect(FormsAuthentication.DefaultUrl);
        }
    }

You can also create a method in the interface similar to the first part with properties. And that's fine if you must force a page to execute some method. If the event is optional then I think eventhandlers are the way to go. 

##Other thoughts:

###Keep it simple
On a general note, it's better to keep user controls simple. If your complexity grows and you get lost in settings that your control requires, it's probably a good time to rethink your design and split some of the code into a page or another user control. 

###Put code behind into separate libraries
If you are going to be sharing code between projects. It's a good idea to put code behind into a separate code project, that way if any of the logic changes it will impact all projects.

###Create an internal NuGet package
This is definitely a nice way to publish your user control markup and make it updatable with one simple command.

[NuGet Creating Packages][1]

###Embed your javascript as webresource
If you have a javascript on your user control with some logic, it would not be a bad idea to move that javascript into a code library and make it a webresource. That way javascript code is also centralized and easier to maintain. 

[Walkthrough: Embedding a JavaScript File as a Resource in an Assembly][2]

###Minimize your control's viewstate.
There is an awesome article that can help you do that here: 

[TRULY UNDERSTANDING VIEWSTATE][3]



Let me know what you think, or if you have some other ideas please share!

[![kick it on DotNetKicks.com][5]][4]

  [1]: http://docs.nuget.org/docs/creating-packages/creating-and-publishing-a-package
  [2]: http://msdn.microsoft.com/en-us/library/bb398930.aspx
  [3]: http://weblogs.asp.net/infinitiesloop/archive/2006/08/03/Truly-Understanding-Viewstate.aspx
  [4]: http://www.dotnetkicks.com/kick/?url=http%3a%2f%2fblog.maskalik.com%2f
  [5]: http://www.dotnetkicks.com/Services/Images/KickItImageGenerator.ashx?url=http%3a%2f%2fblog.maskalik.com%2f