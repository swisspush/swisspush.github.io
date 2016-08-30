---
layout: post
title: Spring Data Rest and JavaScript Client
author: Laurent Bovet
category: web
tags: [ api, rest, json, angular, jquery, node ]
---
{% include JB/setup %}

[Spring Data Rest](http://projects.spring.io/spring-data-rest/) is becoming our choice for data-oriented applications. It makes us avoid a lot of server-side code. That's great.

But, in the browser, without a library with a similar abstraction level, we are still
writing a lot of boilerplate code to manipulate the REST resources and synchronize them with the client-side model.

So, came the idea of [Hybind](http://lbovet.github.io/hybind/) quite naturally. Why not have a thin layer of dynamic code enriching our model objects to bind them easily to REST resources?

<script async src="https://jsfiddle.net/lbovet/5eoaem4j/embed/js,html,result/dark/"></script>

Indeed, the library is small but leads to clean code.

Look at the [BugTik](https://github.com/lbovet/bugtik) sample AngularJS app. It demonstrate a minimal ticket app with [172 lines of Java](https://github.com/lbovet/bugtik/tree/master/src/main/java/li/chee/bugtik) and [74 lines of JavaScript](https://github.com/lbovet/bugtik/blob/master/src/main/resources/static/app.js).

I bet there will be more and more of such libraries, since HATEOAS is here to stay and will probably increase in complexity.

I just hope it will not be the XML/WSDL of the future, that humans will still be able to read and write resources without a bloated IDE or a code generator/huge interoperability stack...
