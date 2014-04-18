---
layout: post
title: "A Successful SQL Database Migration Model"
meta-description: "How a simple database migration model can streamline deployments and eliminate frustrations regarding SQL changes."
meta-keywords: "sql database migration, dbup, production database migration"
categories: 
  - sql
tags:
  - database-migration
---


<img src="/uploads/2014/04/database-migration.png" style="float:right; margin-right:30px; width:229px !important;" />

Here is a simple database migration model that I recently adopted at work. It worked out really well. With little effort, we are now able to create new or upgrade existing database to any specific commit in the source control. And now since production SQL changes are migrated with an automatic batch process, it has streamlined our deploys as well.

##Start with a Baseline Script
Baseline script is necessary for creating database from scratch. It's used for setting new environments or even daily development work where you want to make sure to start with a clean slate.

If you already have an existing database you will need to start by creating a baseline script. The best time to do that is after a fresh deploy to production. That way you know your development version of database should be the same as production, and you now have a clear starting point or baseline. Here are the steps I took.


- [Script entire database](http://blog.sqlauthority.com/2011/05/07/sql-server-2008-2008-r2-create-script-to-copy-database-schema-and-all-the-objects-data-schema-stored-procedure-functions-triggers-tables-views-constraints-and-all-other-database-objects/) schema with objects
- Clean up schema if necessary. (I had to remove replication directives, and creation of  production users since those are production only settings.)
- Add any necessary seed data for testing purposes. When you rebuild a database it will most likely be used for development or QA, therefore most likely you will need some starting data.



##Add Migration scripts
Migration scripts get applied in order in which they are created and only migrate database up. This model does not involve downgrading, simply because we haven't found a need for it (production database is never downgraded, and local/test version can always be recreated from scratch).

When a developer is working on a feature or a bug that needs database changes, he creates a new migration file with a next sequential number in the file name. For example: if the last migration file is Script-0048.sql next a new migration script will be Script-0049.sql. 
> They have to be sequential because that's how we can make sure that migrations are applied in order they were created, and can guarantee consistency between environments. 

##Version Control your SQL scripts

Next important piece is to version control your scripts. It plays the following roles:


- Source control becomes a mediator, so multiple developers cannot check-in script with the same name. In addition, if there is a conflict with names developers are forced to get latest and change their script name.
- Each branch has it's own list of migration scripts, and **there is no doubt of what your database should look like to match the code base in any branch or individual commit**. It simply must have all migration scripts applied to the baseline.
- It keeps track of changes and we want to make sure there are no changes once a migration script is in source control. (more on that in the Rules section)

##Keeping track of migrations

How do we know what migrations scripts were applied to the database? Simple, we create a table that keeps track of executed script.  That way it's easy to compare what's already executed and what scripts need to be applied to get to a specific point in time. A simple table like this will do. 

![](/uploads/2014/04/AppliedScriptsTable.png)

Finally, your migration application takes care of figuring out which scripts are missing, executing missing scripts, and recording applied scripts in the log table.

## Two Easy Rules for Stress Free Migrations


- **Once a SQL migration script is committed and pushed to the source control it must never change.** We do that to eliminate potential inconsistencies between environments, because once a script is out in the wild you can assume it was already applied somewhere and if script changes that environment will never get updated. 
- **Automate database migrations completely**. There is absolutely no reason why you need to manually run the update scripts, it's frustrating, error prone, and it's waste of time. You can quickly write a batch process that will execute each script and add a record into the journal table, or you can use existing open source projects like [DbUp](http://dbup.github.io/) for that. We've opted in for DbUp since it already does exactly that and has other nice features like wrapping all migration scripts in a transaction. 

##Rebuild or Migrate Your Database With One Click

We've created two Powershell scripts that will either create or upgrade local database with all migration scripts in the current source control tree. Rebuild will execute baseline script + migrations. Upgrade will only apply missing migrations and it's the same script that's used in production. There is no more need to use shared database, developer can migrate or re-create his version of the database in few seconds. I've also had an idea to include a module that will check on application start if the database is out of date and apply needed scripts, I wouldn't run it in production but it's perfect for development.

After setting up automatic migrations it was very easy to setup test environments for functional end to end testing with Selenium. Continuous integration server will pull latest from the code base, run database upgrade script, build and publish site, and execute functional tests. 

##Conclusion: A lot of impact for a little effort

I've been part of many overnight deployments that gone wrong due to some missing stored procedure, and felt the agony of chasing down errors at 2AM in the morning. It really doesn't take long to apply this model, even less so if you choose to use existing open source libraries like [DbUp](http://dbup.github.io/). While there is nothing radical about this practice, I know a lot of companies are still manually deploying their SQL scripts. It's a small change with big impact that will streamline your development and make production database migration smooth with guaranteed correctness. It worked out great for my company. How do you manage your database migrations?

