---
layout: post
title: Gateleen - A RESTful Middleware
author: Laurent Bovet
category: api
tags: [ api, rest, json, microservice, integration, middleware ]
---
{% include JB/setup %}

![gateleen]({{ site.url }}/assets/images/gateleen/gateleen-medium.png)

We just open-sourced [Gateleen](https://github.com/swisspush/gateleen) !

This library is the base of our communications servers in projects where we need performance, scalability and tolerance to stale connections.

Get started with the presentation we did at [Voxxed Days Zürich](https://voxxeddays.com/zurich/).

<iframe width="560" height="315" src="https://www.youtube.com/embed/Hn4u_nk7he8" frameborder="0" allowfullscreen></iframe>

Try it:

- Install and start [Redis](http://redis.io) on its default port.
- Clone or download the [repo](https://github.com/swisspush/gateleen) and build with Maven (Java 8).
- Start the playground server with `java -jar gateleen-playground/target/playground.jar` and enjoy on [http://localhost:7012/playground](http://localhost:7012/playground).

We are still in the progress of migrating the documentation. 

We also plan to provide a more convenient support to build your communication server by assembling the different parts in an easy and pluggable way. So stay tuned!

