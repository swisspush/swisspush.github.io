---
layout: post
title: Painless YAML Templating
author: Laurent Bovet
category: tools
tags: [ yaml, templating, yaql, devops, kubernetes, python ]
---
{% include JB/setup %}

## ❤️ YAML ?

YAML is ubiquitous. Wether you love it or hate it, you have no choice but using it since it established itself as _the_ configuration format for all things cloud/devops/serverless (choose your buzzword).

The main characteristic of YAML is the role played by semantic indentation. It makes lazy humans save typing braces around blocks that they would have indented anyway.

## The Dreaded `toYaml`

Automation and DRY pressure pushed the industry to propose ways to factorize and process YAML files.

The first generation approach uses existing text templating tools (Jinja, Go templates, ...).

It works OK up to an extend where the indentation 

