---
layout: post
title: "Javascript patterns"
meta-description: "Javascript patterns"
tags: ["javascript"]
categories: ["guides"]
migrated: "true"
permalink: "/guides/javascript-patterns/"
---

### Immediate Function

Execute function as soon as it's defined, variables declared inside have local function scope. Can return values or other functions.

```javascript
var sayHello = (function () {
  var sometext = "Hello world";
  return function () {
    return sometext;
  };
})();
```

### Privacy, Module Pattern

Private variables can be hidden within the scope of a function, in the case below foo is a private variable.

```javascript
var foo = (function () {
  //private
  var bar = "Hello I'm private";

  //public accessor
  return {
    getBar: function () {
      return bar;
    },
  };
})();
```

Since private variables will be recreated every time you can save memory by putting private variables into prototypes.

```javascript
function Fast() {}

Fast.prototype = (function () {
  //private
  var fastFoo = "Hello I'm fast private Foo";
  //public prototype
  return {
    getFastFoo: function () {
      return fastFoo;
    },
  };
})();
```
