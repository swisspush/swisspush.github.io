---
layout: post
title: Hierarchical RESTful Storage
author: Laurent Bovet
description: "Generic storage to implement CRUD hierarchical REST APIs: verx-rest-storage"
category: api
tags: [ rest, api, storage, json, vertx, docker ]
---
{% include JB/setup %}

![rest-edit browser](https://github.com/lbovet/rest-edit/raw/master/doc/rest-edit2.png?raw=true)

## Introduction

There is something I like in REST APIs: the URIs. Although, [HATEOAS](/api/2015/06/18/why-dislike-hateoas) tend to make them invisible, or not important, I find their structuring power very interesting.

For decades and decades, we structure information in a hierarchical way. This is probably the most natural structure in our computer-biased brains. Filesystems show the same tree structure since... the year they were born.

Today, we are in the REST API era. The current movement tries to capture the best of the browser-navigated web and apply it to the software integration world. Structured URIs are certainly one of the good parts to take over.

We discuss here reasons to use hierarchical structure in REST APis and tools that are good for that.

## Flat vs. Hierarchical

### Flat

We can design "flat" APIs, i.e. where URIs do not go deeper that one level:

`GET /blogs/swisspush/articles`
{%highlight json %}
{
  "articles": [
    "4972057",
    "6274382"
   ]
}
{%endhighlight%}

`GET /articles/4972057`
{%highlight json %}
{
   "subject": "Hierarchical RESTful Storage",
   "author": "Laurent Bovet"
}
{%endhighlight%}

This has two consequences:

* Article ids must be unique across all blogs.
* An article can belong to more than one blog.

### Hierarchical

In this case, it would be more natural to model the blog-article relationship in a hierarchical way:

`GET /blogs/swisspush/articles`
{%highlight json %}
{
  "articles": [
    "1",
    "2"
   ]
}
{%endhighlight%}

`GET /blogs/swisspush/articles/1`
{%highlight json %}
{
   "subject": "Hierarchical RESTful Storage",
   "author": "Laurent Bovet"
}
{%endhighlight%}

In UML, we would name that an aggregation. The aggregation semantics are naturally true. For instance, we expect that:

`DELETE /blogs/swisspush`

will also delete all its blog articles and let no orphan.

## Generic API

In the example example above, we see that the tree structure is very similar to one of a filesystem, which is a generic storage solution.

So, we can design a generic REST service that implements CRUD operations (GET, PUT, DELETE) with which we can realize our blog API.

Let's create a new blog with two articles:

`PUT /blogs/wleaks/articles/1`
{%highlight json %}
{
   "subject": "US tap EU lines",
   "author": "Julienne Essenge"
}
{%endhighlight%}

`PUT /blogs/wleaks/articles/2`
{%highlight json %}
{
   "subject": "EU to tap US lines",
   "author": "Anonymous"
}
{%endhighlight%}

Note: Intermediate "folders" are automatically created.

`GET /blogs/wleaks/articles`
{%highlight json %}
{
  "articles": [
    "1",
    "2"
   ]
}
{%endhighlight%}

## Software

### REST Storage

Given that a lot of our APIs just gives access to data and can be modelled in hierarchies like the one above, we wrote a generic storage software: [vertx-rest-storage](https://github.com/lbovet/vertx-rest-storage).

It is realized as a [Vert.x](http://vertx.io) module, so it can be easily integrated in a non-blocking Vert.x application but also in any Java application, thank Vert.x embeddable platform.

As it is backed by [Redis](http://redis.io), it is very performant. Alternatively, it can be backed by a filesystem.

### Developer Tools

This REST storage has proven very useful in many cases. Not only as a generic backend for storing data and give direct REST access to them but also to mock APIs that are not yet implemented.

As we use it everyday in all our development phases, it gained developer convenience with [rest-edit](https://github.com/lbovet/rest-edit), an HTML/JS UI for manipulating resources in the storage.

Based on [Ace](http://ace.c9.io/), it makes developer life very easy when authoring JSON (and others) directly in the browser.

![rest-edit browser](https://github.com/lbovet/rest-edit/raw/master/doc/rest-edit1.png?raw=true)

### Give it a Try

You can clone and build from GitHub or simply try this [Docker Image](https://quay.io/repository/lbovet/rest-storage-bundle) bundling the storage and developer tools.

`docker run quay.io/lbovet/rest-storage-bundle`

Open [http://localhost:8989/tools/browser.html](http://localhost:8989/tools/browser.html)

This image is meant as a demo only. It stores resources in the container filesystem.

### Resource Expiration

In many use cases, we use REST storage as an intermediate between backends generating data and clients consuming this data. Very often, the data has a limited validity and does not make sense after some time.

So, REST storage supports a header defining the time-to-live of resources. (Note: available only in the Redis version).

```
PUT /notifications/alert1
X-Expire-After: 600
```
{%highlight json %}
{
   "message": "Please call me asap"
}
{%endhighlight%}

This resource will automatically disappear from the collection after 10 minutes.

## Conclusion

Hierarchical models satisfy us in 80% of cases. We increased dramatically development efficiency in all this cases.

From prototyping to integration tests, it brings its value all along the development chain. Non-developers got trained to REST thank the convenience tools.
