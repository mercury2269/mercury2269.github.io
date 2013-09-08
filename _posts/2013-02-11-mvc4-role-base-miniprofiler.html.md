---
layout: post
title: "Displaying MiniProfiler For Logged In Developers with MVC4"
meta-description: ""
tags: ["asp.net-mvc-4","miniprofiler"]
categories: ["asp-net"]
migrated: "true"
permalink: "/asp-net/mvc4-role-base-miniprofiler/"
---
ASP.NET MVC 4 introduced an important change in membership providers. Moving away from core membership to a more flexible and simpler [SimpleMembershipProvider][1]. 
Default "Internet Application" template initializes SimpleMembership by including an action filer InitializeSimpleMembership which gets gets added to the Account controller. So whenever you try to access account controller a filer would check if the SimpleMembershipInitializer was initialized and do the necessary work if needed.

In one of the applications I'm working on at the moment I wanted to only show MiniProfiler for logged in developers, so that required some changes to the default project structure. Since we want to have [MiniProfiler][2] visible on the entire site we need to make sure that membership provider gets initialized for all controllers. One way is to add InitializeSimpleMembershipAttribute to the global filters, however that would require you to hit the page twice since the action attribute fires after the Application_PostAuthorizeRequest (where we will be checking Roles) and the provider would not be initialized on the first request. 

I've opted out to move the initialization logic from Action attribute to the Application_Start() of the Global.asax file. Since that only fires once per application I thought it would be a better place for it. So it looks like this:

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            ...
           InitMembership();
        }
        private void InitMembership()
        {
            Database.SetInitializer<UsersContext>(null);

            try
            {
                using (var context = new UsersContext())
                {
                    if (!context.Database.Exists())
                    {
                        // Create the SimpleMembership database without Entity Framework migration schema
                        ((IObjectContextAdapter)context).ObjectContext.CreateDatabase();
                    }
                }

                WebSecurity.InitializeDatabaseConnection("DefaultConnection", "UserProfile", "UserId", "UserName", autoCreateTables: true);

                if (!Roles.RoleExists("Developer"))
                {
                    Roles.CreateRole("Developer");
                }
                if (!WebSecurity.UserExists("sergey"))
                {
                    WebSecurity.CreateUserAndAccount("sergey", "password");
                }
                if (!Roles.GetRolesForUser("sergey").Contains("Developer"))
                {
                    Roles.AddUserToRole("sergey", "Developer");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("The ASP.NET Simple Membership database could not be initialized. For more information, please see http://go.microsoft.com/fwlink/?LinkId=256588", ex);
            }
        }

I left the default database creating with entity framework for now, I will most likely remove it later. The important part is that we create a new role "Developer" and assign it to our default user. Also, we can completely remove InitializeSimpleMembershipAttribute from the solution and remove it from AccountController.

In our MiniProfiler we will check if user has that role and if he or she doesn't we will discard the results.

        protected void Application_BeginRequest()
        {
            MiniProfiler.Start();
        }

        protected void Application_PostAuthorizeRequest(object sender, EventArgs e)
        {
            if (!Request.IsAuthenticated || !Roles.GetRolesForUser(User.Identity.Name).Contains("Developer"))
            {
                MiniProfiler.Stop(discardResults: true);
            }
        }

        protected void Application_EndRequest()
        {
            MiniProfiler.Stop(); //stop as early as you can, even earlier with MvcMiniProfiler.MiniProfiler.Stop(discardResults: true);
        }

Unfortunately this will run MiniProfiler for all requests, one trick that was recommended on [stackoverflow][3] is to create a watermark cookie if use is in role so the profiler would only start if that cookie is present. 

Enjoy!


  [1]: http://weblogs.asp.net/jgalloway/archive/2012/08/29/simplemembership-membership-providers-universal-providers-and-the-new-asp-net-4-5-web-forms-and-asp-net-mvc-4-templates.aspx
  [2]: http://miniprofiler.com/
  [3]: http://stackoverflow.com/questions/6349280/how-to-properly-authenticate-mvc-mini-profiler-with-aspnetsqlmembershipprovider