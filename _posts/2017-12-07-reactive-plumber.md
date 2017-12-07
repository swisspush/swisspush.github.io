---
layout: post
title: "Reactive Plumber -  A Groovy DSL for declarative Reactor streaming graphs"
author: Laurent Bovet
category: reactive
tags: [ reactor, rxjava, groovy, graph ]
---
{% include JB/setup %}

You want to use [Reactor](https://projectreactor.io/) (or [RxJava](https://github.com/ReactiveX/RxJava)) within a modular, readable and safe abstraction.

[Reactive Plumber](https://github.com/lbovet/reactive-plumber) let you write your reactive stream plumbing in a Groovy DSL and also visualize it graphically.

It is intended to be used in Java or Groovy applications.

<table><tr><td>
<img align="right" src="https://cloud.githubusercontent.com/assets/692124/23836787/2761ce26-077e-11e7-97f0-ffda49431851.png">
</td><td>
<pre>
def data = pipe {
    from input map wrap
}

def printer = {
    from it doOnNext print
}

def renderer = pipe {
    parallel from(data) \
    map renderThread
}

def count = pipe {
    from data count()
}

def size = pipe {
    from data \
    zipWith value(count), attach \
    map renderSize \
    compose printer
}

def thread = pipe {
    from renderer compose printer
}

drain size, thread
</pre>

</td></tr></table>

Built using these outstanding projects:
 - [Groovy](http://groovy-lang.org)
 - [RxJava](https://github.com/ReactiveX/RxJava)
 - [Project Reactor](https://projectreactor.io)
 - [graphviz-java](https://github.com/nidi3/graphviz-java)
