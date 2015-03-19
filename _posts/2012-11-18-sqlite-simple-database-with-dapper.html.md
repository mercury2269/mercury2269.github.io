---
layout: post
title: "SQLite + Dapper = Simple Data Access Layer"
meta-description: ""
tags: ["dapper","sqlite","asp.net"]
categories: ["asp.net"]
migrated: "true"
permalink: "/asp-net/sqlite-simple-database-with-dapper/"
---
##Summary
SQLite is one of the little databases that you can use in your project when you don't want to have a full blown database and want something simple, quick and awesome. It's very easy to distribute or share with your team since it's just a single file and can be checked into source control. Could be used as a development database, one off database for your desktop applications or just about anything else. It's definitely nice to keep in your development tool belt. 

##Installation
There is none, just add reference to SQLite C# drivers and it will create a database for your on first run. Simplest way is to go to Nuget package manager console and run: 

    Install-Package System.Data.SQLite

This will install both versions for x86 and x64 so you can build it for any CPU. There are also specific versions as well in case if you don't want extra files `Install-Package System.Data.SQLite.x86 or System.Data.SQLite.x64`.

##Model
In our sample we'll save and retrieve customers from the database so we'll create a folder "Model" and add a Customer class which will represent our data model. 

    namespace SQLiteDemo.Model
    {
        public class Customer
        {
            public int Id { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public DateTime DateOfBirth { get; set; }
        }
    }

##Simple Data Layer
For this demo I'll use a console application and for simplicity sake I'll create a folder "Data" for data access layer. In you production application you will most likely want to put your data access layer into a separate project. 

We'll also use a repository pattern for our Data Access Layer(DAL) since it's the most commonly used and easily to understand. 

We'll add an interface `ICustomerRepository` which will have two methods to save and retrive customers and create a base class `SqLiteBaseRepository` which will handle common logic between our repositories like creating database connections.

    public interface ICustomerRepository
    {
        Customer GetCustomer(long id);
        void SaveCustomer(Customer customer);
    }

    public class SqLiteBaseRepository
    {
        public static string DbFile
        {
            get { return Environment.CurrentDirectory + "\\SimpleDb.sqlite"; }
        }
    
        public static SQLiteConnection SimpleDbConnection()
        {
            return new SQLiteConnection("Data Source=" + DbFile);
        }
    }

##Using Dapper as our simple Object-relational mapping (ORM)
Dapper is easy to use, fast and fits well for our simple data access layer. It has a simple API on top of already familiar SQL statements.

In your package manager console

    Install-Package Dapper

In Customer Repository implementation (SqlLiteCustomerRepository) "SaveCustomer" method will first check if database file already exists and execute a create table script which if nothing is found, it will output a file to the environment runtime directory where your executable is located. 

    public void SaveCustomer(Customer customer)
    {
        if (!File.Exists(DbFile))
        {
            CreateDatabase();
        }
    
        using (var cnn = SimpleDbConnection())
        {
            cnn.Open();
            customer.Id = cnn.Query<long>(
                @"INSERT INTO Customer 
                ( FirstName, LastName, DateOfBirth ) VALUES 
                ( @FirstName, @LastName, @DateOfBirth );
                select last_insert_rowid()", customer).First();
        }
    }
    
    private static void CreateDatabase()
    {
        using (var cnn = SimpleDbConnection())
        {
            cnn.Open();
            cnn.Execute(
                @"create table Customer
                  (
                     ID                                  integer identity primary key AUTOINCREMENT,
                     FirstName                           varchar(100) not null,
                     LastName                            varchar(100) not null,
                     DateOfBirth                         datetime not null
                  )");
        }
    }

Above Dapper maps our object to table field names in the query and also returns a long datatype with a newly inserted scoped identity. With SqLite scope identity has a different method last_insert_rowid() and we use that to get inserted customer id and assign it to our customer. 

To retrieve customer we first check if database file exists first and then let dapper handle the rest. 

    public Customer GetCustomer(long id)
    {
        if (!File.Exists(DbFile)) return null;
    
        using (var cnn = SimpleDbConnection())
        {
            cnn.Open();
            Customer result = cnn.Query<Customer>(
                @"SELECT Id, FirstName, LastName, DateOfBirth
                FROM Customer
                WHERE Id = @id", new { id }).FirstOrDefault();
            return result;
        }
    }

And there you have it, an easy way to have a single file database with a simple ORM in your repository layer. 

###Source code
Here is the link to the source code if you would like to run the solution and try it for yourself. [Source Code][1]


  [1]: https://github.com/mercury2269/SQLiteDemo