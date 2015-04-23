---
layout: post
title: Setup Mesos on a single node
author: Gianluca Lupo
category: clustering
tags: [mesos]
---
{% include JB/setup %}

####Overview
The purpose of this article is to show how to effectively setup a cluster of machines in order to use Docker on them and to be able to optimize as much as possible the reource usage of the machines.

The aim is to create a proposal for building a clustered environment for a Continous Integration solution which allows to have isolated and reliable builds and avoid technology dependencies and overlappings.

####Technology Overview

**Mesos** is an Apache project which has the aim to abstract the _datacenters_ resources in a single pool of 
resources.


1. A **framework** is an application which is written directly against the Mesos REST APIs



