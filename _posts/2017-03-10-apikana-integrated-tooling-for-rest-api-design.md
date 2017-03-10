---
layout: post
title: "Apikana - Integrated tooling for REST API Design"
author: Laurent Bovet
category: api
tags: [ rest, api, swagger, json ]
---
{% include JB/setup %}

We just open-sourced [Apikana](https://github.com/swisspush/apikana)!

<iframe width="560" height="315" src="https://www.youtube.com/embed/QQKoO_F_JpY" frameborder="0" allowfullscreen></iframe>

[Apikana](https://github.com/swisspush/apikana) combines the following tools to facilitate the authoring of contract-first REST APIs:

* [Swagger](http://swagger.io/swagger-ui/)
* [typescript-json-schema](https://github.com/YousefED/typescript-json-schema)
* [Docson](https://github.com/lbovet/docson)

It basically generates formal schemas and documentation from a mixed swagger/typescript definition that is easy to author and maintain.

It supports also java:

* Use the provided parent-pom and maven-plugin (see [apikana-java](https://github.com/nidi3/apikana-java)).
* Generate java types (thanks to [jsonschema2pojo](http://www.jsonschema2pojo.org/)).

See it in action in [apikana-sample](https://github.com/lbovet/apikana-sample).
