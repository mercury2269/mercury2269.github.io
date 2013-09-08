---
title: "TDD - Understanding Is A Key To Success"
meta-description: ""
meta-keywords: ""
publish-date: "2013-07-12"
tags: []
categories: ["tdd"]
migrated: "true"
permalink: "/tdd/understanding-is-key-to-success"
---
I've been practicing Test Driven Development (TDD) for a while and recently I learned that my tests were not really helping but actually becoming a huge burden. So for the past couple months I've been on a journey to truly master the TDD and I'm at the point now where I think I have a much better understanding of it. Through my struggles and discoveries with doing TDD comes out this blog post. 

##Why Do We Need TDD

TDD helps you to design your software components interactively. How does it help you? You write specifications or behaviors of your component and then your write a solution for that behavior and then you refactor to make the code clean. It's extremely valuable in terms of providing safety net so you can have confidence while refactoring, and keep code clean and maintainable while not breaking desired specifications.

##It's Important to Understand What TDD Doesn't Do

It doesn't help you to find bugs, or regression test the whole system. It also doesn't help you to test interaction between components or if your application is configured properly. There are other means to do that like automated integration tests with projects like Selenium.

##Common Mistakes or When Safety Net Becomes Maintenance Hell

I believe almost all developers who start with TDD without guidance of an experienced TDD practitioner are destined to repeat common mistakes and fail. I've done this myself, even though I've read few TDD books and I thought I had it.  Over the last 3 years I've been working on and off on a big and complex calculation functionality piece and used TDD to create a regression safety net. I wrote a huge amount of tests but when the time came to change functionality it didn't go as smooth as planned. Any changes in the systems behavior would break a huge amount of tests and I could see that my tests were making things a lot more difficult instead of helping. So I went on to really understand TDD and truly learn it. I learned that writing a safety net that would actually help is not easy, requires a true understanding of the TDD, use of the design patterns to remove duplicatio,n and keeping unit tests DAMP (Descriptive and Meaninful Phrases). 

##Trully Understanding TDD

The most important thing: Through each unit test you are specifying one behavior of the component and NOT testing methods of your class. With TDD your unit tests or your specifications become the documentation of how your components are expected to work. BDD tries to address this issue by changing the terminology, so you think in terms of behaviors rather than tests. But to me it's all the same TDD just with different set of mind. When you truly understand TDD you would do BDD naturally. (I'm not an expert, these are just my understanding from what I learned and research)

Your components **must be tested outside-in**. Starting with the public API of your service for example. We'll address some of the setup design patterns to make this possible because you will need to have a descent amount of setup code in order to test the whole component. And since this setup code needs to be in every test and it has to be easy to read and understand. 

##Keys to Success

- Easy to read tests, your tests must be DAMP, they should be easy to read and understand. Extra special care need to be taken when writing test names because you want your test to fail in the future and you want a person who will read your test to understand exactly what happened without looking at internals. BDD addresses it with specifying Given When Then. With frameworks like xUnit I like to follow Subject\_Scenario\_Result in my method names. 

- Tests must specify one thing, and one thing ONLY. Your unit tests verifies the behavior of only one specification. If you throw in assertions about unrelated behaviors you will soon discover that when a certain thing changes many of your tests will fail and you won't be able to tell what went wrong, therefore defeating the purpose of unit tests. 

- Outside in, you don't want to test each individual method of your classes, but rather component's public API, for example if you have a service that returns available shipping options and you a public interface for that method is CalculateShippingOptions you want to specify functionality through that method.

- Tests are really specifications or behaviors of your code. Think of it as documentation for your components. 

- Mock all external components which functionality you are not trying to test. 

- Treat your unit tests code as your production code, refactoring and keeping it clean is mandatory.

- Don't over-specify your system. Only leave specs that are absolutely necessary in order for your component to work properly. 100% test coverage is meaningless it creates unnecessary work and maintenance burden and it's not pragmatic.

##Design Patterns to Help

Writing tests outside-in will require a lot of setup for each test and we want that setup code to be reused. BDD frameworks address it by reusing scenario sentences. And for TDD we have design patterns that help immensely.

###Builder Pattern
 First  pattern is the [Builder Pattern ](http://en.wikipedia.org/wiki/Builder_pattern). When you are creating a scenario for your test, rather then setting up objects manually you should have a class that does that for you. For example you would usually build you objects manually like this:

	var shippingOption = new ShippingOption(); 
	shippingOption.ServiceLevel = 888;
	shippingOption.Name = "Ground Shipping"
	... etc
	var shippingOptions = new List<ShippingOption>();
	shippingOptions.Add(shippingOption);

That setup code can be huge, you can replace it with ShippingOptionsBuilder


	public class ShippingOptionsBuilder 
	{
		private List<ShippingOption> _options;

		public ShippingOptionsBuilder() 
		{
			_options = new List<ShippingOptions>();
		}

		public ShippingOptionsBuilder AddGround()
		{
			var shippingOption = new ShippingOption(); 
			shippingOption.ServiceLevel = 888;
			shippingOption.Name = "Ground Shipping"
			...etc
			_options.Add(shippingOption);
			return this;
		}
		public List<ShippingOptions> Build()
		{
			return _options;
		}
	}

So now to build your setup code you simply do this:

	var options = new ShippingOptionsBuilder().AddGround().Build();

And if you later on add other options like next day air you would simply add another method and call it like this:

	var options = new ShippingOptionsBuilder().AddGround().AddNextDayAir().Build();

It's very simple but powerful, if your ShippingOption object changes your setup code would only change in one place rather than in many unit tests. And it also help with readability I can quickly read that line and see exactly what we have in our setup. 

###Suite Fixture Setup

A component might have multiple dependencies and we need a way to abstract the creation of the component so it can be easily changed later without us needing to modify a lot of tests. This is where suite fixture comes in to play.

Let's say we have a ShippingCalculator that will be tested but it takes a couple of dependencies. We'll create a fixture so it can be reused across tests. 

    public class ShippingCalculatorFixture
    {
        public IShippingRepository ShippingRepository { get; set; }
        public IZipRepository ZipRepository { get; set; }

        public ShippingCalculatorFixture()
        {
            ShippingRepository = new Mock<IShippingRepository>().Object;
            ZipRepository = new Mock<ZipRepository>().Object;
        }

        internal ShippingCalculator CreateSut()
        {
            return new ShippingCalculator(ShippingRepository, ZipRepository);;
        }

So now in your setup you can create an instance of the fixture that will hold reference to your dependencies and also create a system under test component.

    [SetUp]
    public Init() 
    {
    	Fixture = new ShippingCalculatorFixture();
    	ShippingCalculator = Fixture.CreateSut();
    }

	[Test]
	public ExampleOfTheFixtureSetup() 
	{	
		..your arrange
		//Act
		ShippingCalculator.Calculate();
		... your assert
	}

For example we need in our test to mock out repository. It's easy to access it through the fixture object that holds a reference to it.

	[Test]
	public ExampleOfTheFixtureSetupWithDependency() 
	{	
		..your arrange
		Mock.Get(Fixture.ShippingRepository).Setup(p => SomeMethod()).Returns(true);

		//Act
		ShippingCalculator.Calculate();
		... your assert
	}

You can also create an extension method 

    internal static class MockExtensions
    {
         internal static Mock<T> GetMock<T>(this T obj) where T : class
         {
             return Mock<T>.Get(obj);
         }
    }

So it can be simplified like this

	[Test]
	public ExampleOfTheFixtureSetupWithDependency() 
	{	
		..your arrange
		Fixture.ShippingRepository.GetMock.Setup(p => SomeMethod()).Returns(true);

		//Act
		ShippingCalculator.Calculate();
		... your assert
	}

Some really good resources that helped me tremendously with my learning were:

[http://blog.stevensanderson.com/2009/08/24/writing-great-unit-tests-best-and-worst-practises/](http://blog.stevensanderson.com/2009/08/24/writing-great-unit-tests-best-and-worst-practises/)

[http://blog.stevensanderson.com/2009/11/04/selective-unit-testing-costs-and-benefits/](http://blog.stevensanderson.com/2009/11/04/selective-unit-testing-costs-and-benefits/)

[http://blog.ploeh.dk/2009/01/28/Zero-FrictionTDD/](http://blog.ploeh.dk/2009/01/28/Zero-FrictionTDD/)

Great pluralsight course that goes deeper into patterns:
[http://pluralsight.com/training/courses/TableOfContents?courseName=advanced-unit-testing](http://pluralsight.com/training/courses/TableOfContents?courseName=advanced-unit-testing)

Good luck with your mastering Test Driven Development! Please let me know if I miss something or you might think I'm completely wrong. 