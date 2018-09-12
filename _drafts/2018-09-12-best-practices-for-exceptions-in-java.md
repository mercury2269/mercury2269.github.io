---
layout: post
category: blog
published: false
title: Best Practices for Exceptions in Java
meta description: ''
tags: ''
---
> When used to best advantage, exceptions can improve a program's readability, reliability, and maintainability. When used improperly, they can have the opposite effect. - Joshua Block

Most of this wisdom comes from Joshua Bloch's [Effective Java](https://amzn.to/2xamghn) book, see the book for the complete discussion on the exceptions. 

## Use exceptions only for exceptions conditions

```
// Horrible abuse of exceptions. Don't ever do this!
try {
  int i = 0;
  while(true)
    range[i++].climb();
} catch (ArrayIndexOutOfBoundsException e) {
	...
}
```

Better idiom for looping through array for (Mountain m : range) m.climb();

- Because exceptions are designed for exceptional circumstances, there is little incentive for JVM implementors to make them fast as explicit tests.
- Placing code inside a try-catch block inhibits certain optimizations that modern JVM implementation might otherwise perform.
- Exception based idiom is much slower than state checking.

**A well-designed API must not force its clients to use exceptions for ordinary control flow**

## Throw exceptions appropriate to the abstraction

Problems when a method throwing an exception that has not apparent connection to the task it performs, usually propagates by lower level abstraction.

- Pollutes API of the higher level with implementation details
- If implementation of the higher layer changes, the exceptions that it throws will change too, potentially breaking clients.

Higher layers should catch lower-level exceptions and, in their place, throw exceptions that can be explained in terms of the higher-level abstraction. This idiom is know as exception translation.

```
// Exception translation
try {
   httpClient.execute(...)
} catch (IOException e) {
   throws PspApiException(...);
}
```

```
// Exception chaining (special form of translation)
try {
   httpClient.execute(...)
} catch (IOException cause) {
   throws PspApiException(cause);
}

class PspApiException extends Exception {
   PspApiException(Throwable cause) {
      super(cause);
   }
}
```

**While exception translation is superior to mindless propagation of exceptions from lower layers, it should not be overused.
**

- Use validate params
- Deal with exceptions on lower level

## Use checked exceptions for recoverable conditions and runtime exceptions for programming errors.

The cardinal rule in deciding whether to use a check or an unchecked exception is this: **use checked exceptions for conditions from which the caller can reasonably be expected to recover.**

**Use runtime exceptions to indicate programming errors.** Great majority is precondition violation, a failure of the client to adhere to the contract established by the API specification.

Because checked exceptions generally indicate recoverable conditions, it's especially important for such exceptions to provide methods that furnish information that could help the caller to recover. For example, redemption of the card has failed because there is no money left, that information could be relayed back to player.

[More on where to use checked vs unchecked.](https://stackoverflow.com/questions/27578/when-to-choose-checked-and-unchecked-exceptions/19061110#19061110)

## Avoid unnecessary use of checked exceptions
Overuse of checked exceptions can make an API far less pleasant to use. Forces caller to handle the exception.

Burden is justified if the exceptional condition cannot be prevented by the proper use of the API and the programmer using the API can take some useful action once confronted with the exception. Unless both of these conditions hold, an unchecked exception is more appropriate.

## Favor the use of standard exceptions
`IllegalArgumentException` (Non-null parameter value is inappropriate) `IllegalStateException` (Object state is inappropriate for method invocation) `NullPointerException` (Parameter value is null where prohibited) `IndexOutOfBoundsException`, `ConcurrentModificationException`, `UnsupportedOperationException`

## Document all exceptions thrown by each method

To use a method properly you need to know about exceptions that it throws, therefore, it is critically important that you take the time to carefully document all of the exceptions thrown by each method.

**Always declare checked exceptions individually, and document precisely the conditions under which each one is thrown using the Javadoc @throws tag**

Unchecked exceptions represent programming errors so it is wise to document them so programmers get familiar with all the errors so they can avoid it.

**If an exception is thrown by many methods in a class for the same reason, it is acceptable to document the exception in the class's documentation comment.**

## Include failure-capture information in detail messages
**To capture the failure, the detail message of an exception should contain values of all parameter and fields that "contributed" to the exception.
**
```
public IndexOutOfBoundsException(int lowerBound, int upperBound, int index) {
  // Generate a detailed message that captures the failure
  super("Lower bound: " + lowerBound + ", Upper bound: " + upperBound + ", Index: " + index);

  // Save failure information for programmatic access
  this.lowerBound = lowerBound;
  this.upperBound = upperBound;
  this.index = index;
}
```

## Don't ignore Exceptions
**An empty catch block defeats the purpose of exception.**

## Exceptions code smells
```
try {
   // 100 lines of code
  ...
} catch (Exception e) {
  //Something failed.. not sure what or where, is it important or is it a bug, who knows ¯\_(ツ)_/¯
}
```
Ideally try catch around the line where exception is expected or a few lines to make the code more readable.

## Catch all unhandled exceptions in the global error handler and log
Unhandled exceptions indicate programming errors, most likely the API was not used correctly and that's a bug that could be fixed






