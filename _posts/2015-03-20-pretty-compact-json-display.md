---
layout: post
title: Pretty Compact JSON Display
author: Laurent Bovet
description: Javascript-based pretty rendering of JSON in a compact horizontal fashion
category: web
tags: [ json, api]
---
{% include JB/setup %}

Nowadays, we have wide screens but JSON pretty renderers out there are often very _vertical_, because they reflect a structure that is usually composed of many small properties.
This leads to lot of blank zones in the screen and intensive mouse-wheel activity.

I have been searching for an alternative way to render JSON documents, in a more horizontal and compact way. Here is the first result of my playing around.

[![prettyson example]({{site.url}}/assets/images/prettyson/prettyson.png) Full Example](http://lbovet.github.io/prettyson/)

The structure is still visible using colored areas, although one may say it is not as clear as vertical layouts when deeply nested documents are wrapped on several lines. This is
the price to pay for compactness.

We are going to use this mostly in technical consoles where we need to display JSON documents in a log fashion. Indeed, we are more and more exchanging JSON resources, especially in
micro-service architectures. The horizontal layout is adequate to browse dumps of JSON data exchanged between services.

As this rendering approach is currently unique, this sample is likely to become an open-source Javascript library. It would be a new member of the family, along with [typson](https://github.com/lbovet/typson) and [docson](https://github.com/lbovet/docson).
I am interested in other approaches around JSON rendering, so feedback and comments are warmly welcomed.

[GitHub Project](https://github.com/lbovet/prettyson)
