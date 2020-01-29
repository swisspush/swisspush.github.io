---
layout: post
title: Painless YAML Templating
author: Laurent Bovet
category: tools
tags: [ yaml, templating, yaql, devops, kubernetes, python ]
---
{% include JB/setup %}

## ❤️ YAML ?

YAML is ubiquitous. Wether you love it or hate it, you have no choice but using it. It established itself as _the_ configuration format for all things cloud/devops/serverless (choose your buzzword).

The main characteristic of YAML is the role played by semantic indentation. It makes lazy humans save typing braces to delimit block they would indent anyway.

<table>
<tr><th>YAML</th><th>JSON</th></tr>
<tr>
<td>

{% highlight yaml %}

hello:
  foo: bar            


{% endhighlight %}
</td>
<td>

{% highlight json %}
{
  "hello": {
    "foo": "bar"       
  }
}
{% endhighlight %}
</td>
</tr>
</table>
    
> Humans like YAML because it focuses on the content

## Complexity Increase

Automation is at the heart of everything in raise of Infrastructure-as-Code, Cloud, DevOps, GitOps, etc. 
Containerization also contributes to the exponentially growing number of configuration combinations.

Inevitably, a need for structure and factorization arised.

## Text Templating to the Rescue

That's why most of the tools ingesting YAML configuration support some kind of templating.

The first generation approach relies on existing text templating libraries ([Jinja](http://jinja.palletsprojects.com/), [Go templates](https://golang.org/pkg/text/template/), [Helm](https://helm.sh/docs/chart_template_guide/), ...).
It is a clever but lazy move because it does not work well when indentation comes into play.

> Whoever struggled with `toYaml` in Helm charts is a victim of YAML text templating.

From a user experience point of view, the opening and closing symbols that YAML avoided come back in the templating language. 


{% highlight yaml %}
{% raw %}
  {{ if eq .Values.favorite.drink "coffee" }}
  mug: true
  {{ end }}
{% endraw %}
{% endhighlight %}

## Alternative: a Dedicated Language

To avoid the drawbacks of text templating, one can adopt a configuration language providing the programmatic features needed to tackle the complexity and generate the YAML. This is typically the approach taken by [Jsonnet](https://jsonnet.org/). It is a powerful language that natively understands the data structure.

```jsonnet
  Martini: {
    ingredients: [
      {
        kind: $['Tom Collins'].ingredients[0].kind,
        qty: 2,
      },
      { kind: 'Dry White Vermouth', qty: 1 },
    ]
  }
```

It can output in many formats, including YAML. 

So, everyone should adopt this no? Why is it not the case?

> Try to switch to a new language, you will just add a new one to your already bloated Babel tower.

It is difficult to adopt Jsonnet because it cannot be introduced progressively. You have to make a dramatic switch in order to get the benefits. Few organizations are capable of driving such changes in a top-down way.

As all the examples and litterature about YAML-based tools are written in YAML, using Jsonnet imposes to systematically translate them.

And note that these unwanted opening and closing braces are back again...

## Enters Structural YAML Templating

So, the truth is in a middle way.

Could we write plain YAML and add programmatic features to it in some undisturbing way?

[YTT](https://get-ytt.io/) does this with a language written in YAML comments.

```yaml
  #@ for/end echo in data.values.echos:
  - name: #@ name(echo)
    image: hashicorp/http-echo
    args:
    - #@ "-listen=:" + str(echo.port)
    - #@ "-text=" + echo.text
```

The structure of YAML is preserved and understood by the tool.
Is this the ultimate definitive way to solve the problem? 

> As a developer, don't you a feel slight discomfort when you write code inside comments?

As YTT is designed as replacement of text templating for configuration files, it provides a set of operations optimized for the task. Some features like overlays are powerful, some others like a single source for template values are limitating.

## Leveraging YAML Tags

Thinking about this, I reminded [some work I did with YAML about ten years ago](https://github.com/wfrog/wfrog/tree/master/wfcommon/config). It is a dependency injection system for Python _à la_ Spring Framework. It uses the YAML tag system to create a configuration corresponding to Spring's Application Context. This YAML, thanks to the tag system and anchors is directly deserialized as wired singletons forming the application structure.

> YAML's strength is in the tags

With YAML tags in and mind inspiration from YTT and Jsonnet, came the design of [Yglu](https://yglu.io).

<table>
<tr><th>Input</th><th>Output</th></tr>
<tr>
<td>
{% highlight yaml %}
greeting: !- Hello
greeter: !()
  length: !? len($)
  message: !? $_.greeting + ', ' + $  
names: !-
  - world
  - foo
  - bar
messages:
  - !for $_.names: !()
     - !? ($_.greeter)($)          
{% endhighlight %}
</td>
<td>

{% highlight yaml %}
messages:
- length: 5
  message: Hello, world        
- length: 3
  message: Hello, foo
- length: 3
  message: Hello, bar




{% endhighlight %}
</td>
</tr>
</table>

_Find more examples in the [online playground](https://yglu.io) and the [test samples](https://github.com/lbovet/yglu/tree/master/tests/samples)._

With the tag system and a powerful expression language ([YAQL](http://yaql.readthedocs.io/), in this case), YAML structural templating features can be truly idiomatic.

## Wrap-Up

Leveraging YAML tags for creating a balanced DSL with a functional expression language brings YAML templating to a next level. 

It allows for introducing YAML factorization progressively, integrate with existing YAML tooling and provide an idiomatic user experience.

It is probably the correct base for the tools to come. Maybe with other expression languages, but certainly with YAML tags.

<p style="text-align:center"><code>Yglu ᕄ <b>!?</b></code></p>