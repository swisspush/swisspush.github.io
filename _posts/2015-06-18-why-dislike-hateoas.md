---
layout: post
title: "Why dislike HATEOAS?"
author: Laurent Bovet
description: ""
category: api
tags: [ rest, json, api, opinion ]
---
{% include JB/setup %}

# Intro

It is not about hate.

In simple words, [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) proposes to link resources using full URIs in the body payload.

```
GET http://localhost:8080/customer/1
```
{% highlight json %}
{
  "name": "Alice",
  "links": [ {
    "rel": "self",
    "href": "http://localhost:8080/customer/1"
  }, {
    "rel": "adress",
    "href": "http://localhost:8080/address/12325"
  } ]
}
{% endhighlight %}

Roy Fielding [stressed out almost 7 years ago](http://roy.gbiv.com/untangled/2008/rest-apis-must-be-hypertext-driven) that an API is not a REST API if it is not HATEOAS. Although it is a question of definition (is my API RESTful or not?), I think that we can have good APIs that are not HATEOAS. Probably, it is even better.

# Why disagree?

The dogma says that a client should not have prior knowledge about the structure and typing of resources and that such knowledge introduces unwanted coupling.

Well, I think that client and server are coupled, intrisically. APIs are consumed by code and this code makes expectations about the structure and behaviour of the API.

I admit that this coupling must not exist for human-browsed hypertext, which is what Roy Fielding based his thesis on. The browsing experience in the hypertext gives an unstructured taste of discovery. But software needs some kind of determinism in what is provided by and accepted by other software it integrates with.

Also URIs introduce another unwanted coupling, it binds JSON documents with the way we access resources. And these JSON documents cannot live on their own, no more.

# Contracts in Software Integration

Can we do without them? CORBA IDL and WSDL provide fully defined contracts that software can formally use to generate the stub-skeleton-proxy-adapter-whatever-is-needed code. This generation step is required with these technologies in order to be efficient while implementing the integration.

Today, REST-like APIs allow us to skip the code generation step. Code can directly access a resource and extract the needed information from it.

{% highlight java %}
String johnLastName = restClient.get("/persons/john").getString("lastName");
{% endhighlight %}

Some projects may have verbose APIs with big and nested documents. We can fear that accessing the data in this way have drawbacks. It is error-prone and tedious to write.

Should code or contract generation enter again here?

Yes. [Swagger](http://swagger.io/) realizes this and quite successfully, [JSON Schema](http://json-schema.org) brings a spec, our own [typson](https://github.com/lbovet/typson) helps writing JSON schemas using a statically typed language, [jsonschema2pojo](http://www.jsonschema2pojo.org/) generates annotated java classes from JSON schema, ...

There is a need for formal contracts, clearly. Too bad that the strict definition of REST does not comply with the formal contract approach. We will still refer to such APIs as REST APIs, nevertheless.

So, if you adopt formal contracts for any reason (documentation, validation, code generation, ...) you are in the _typed world_. Thus, you are outside of HATEOAS sphere of influence, you _don't need_ HATEOAS, in this case.

We need formal contracts for our enterprise APIs. We need them starting form the inception to the documentation, for reviews, design discussion, compatibility management, data quality. Return on experience confirmed that it was a good choice, thus we keep this direction for published APIs as well.

# Accidental Complexity

We keep hearing [KISS](https://en.wikipedia.org/wiki/KISS_principle). We agree with that principle. So, why making things more complex by default? Should we not introduce complexity only when the domain requires it due to its own complexity?

HATEOAS requires more boilerplate. Server implementation must know how to build these URIs. This has to be addressed in the different deployment environments, continuous integration, local developer laptop, ...

There is something suspect in having absolute physical references in the documents we exchange. We struggled for years to avoid absolute file paths in code, build systems, configurations. Now, we have them in our data. Weird.

One major benefit in resource-oriented API is that we can implement a read-only API just with a filesystem tree served by an HTTP server. We do use this regularly for read-only master data. Data is prepared as JSON documents and exposed in a usable form to REST clients.

This data has to be agnostic from where it is served from. It should not be coupled to the way it is accessed. This is related to layering. There is an access layer (HTTP, URIs) and a data layer (JSON). Mixing them introduces an additional challenge that is actually accidental complexity.

# SELECT WHERE ... JOIN ...

APIs are opinionated. They provide a way to access information that is driven by the type and expected usage of this information. We usually don't design APIs in a completely generic form. Otherwise, we would simply use [CouchDB](http://couchdb.apache.org/) or [MongoDB](http://docs.mongodb.org/ecosystem/tools/http-interfaces/) REST APIs.

Also, as client, we expect that we do not need to make the dreadful [N+1 requests](http://www.infoq.com/articles/N-Plus-1) or, worse, perform client-side JOINs. A convenient API will denormalize data for the benefit of clients. This is an added value of the API compared to a generic query language.

We see today an emerging _economy of APIs_. We have to consider the design of APIs like the design of a website. They must be appealing, nice and developer-friendly. Companies gain market share when more developers integrates their data.

So, we must take care of our API consumers. Aggregation and denormalization are a _service_ given to the consumer. If it is done well, there is much less need for references across resources. This can be reduced to a minimum and thus decrease the need for HATEOAS.

# Conclusion

There is a lack of community traction for HATEOAS, probably due to the reasons listed hereinabove. HATEOAS is an elegant principle from the point of view of conceptual organization of distributed information. For APIs, it unfortunately conflicts with driving principles in software development. The latter are stronger, for most of us.
