---
layout: post
title: Real-time Docker Stat Graphs in the Terminal  
author: Laurent Bovet
category: docker
tags: [ docker, stats, graphs, terminal, npm ]
---
{% include JB/setup %}

![turtle-race](https://cloud.githubusercontent.com/assets/692124/12593996/2566ab4e-c474-11e5-8d24-bf0b5da0108f.gif)

There are plenty of Node modules related to Docker. One is [docker-stats](https://www.npmjs.com/package/docker-stats) which provides a continuous stream of container statistics.

Combining it with [turtle-race](https://www.npmjs.com/package/turtle-race) is an easy way to quickly monitor such statistics as graphs in the terminal.

For example, the following script would monitor the cpu usage of all containers currently running.

{%highlight javascript %}
var stats = require('docker-stats');
var through = require('through2');
var turtle = (require('turtle-race'))();
stats({statsinterval: 1}).pipe(through.obj(function(container, enc, cb) {
  turtle.metric(container.name, "cpu")
    .push(container.stats.cpu_stats.cpu_usage.cpu_percent);
  return cb();
}));
{%endhighlight%}

Of course, this can be combined with many other ways to collect metrics, e.g. to output the graphs shown above.
