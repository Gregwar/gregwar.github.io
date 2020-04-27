---
layout: default
title:  "Plater fills your 3D printer buildplate"
permalink: /plater-fills-your-3d-printer-buildplate
date:   2013-12-12 18:00:00 +0200
tags: maker 3d-printing
---

![Plater](/assets/imgs/plater.jpg){:class="float-right m-2"}

3D printing is getting more and more popular and accessible those days. There is now a lot of printers on the market, great object communities and CAD softwares. Note that printing is still a long process involving human interventions. 

<!--more-->

Objects are sometime multi-parts, which means that you have to print a bunch of 3D models and then assemble your thing. Moreover, they can be parametric, which mean that any user is able to change some values and then re-generate the model. For instance, the [Metamaquina](http://metamaquina.com.br/) is a 3D printer that can be customized.

Sometime, these complex objects comes in **plated** edition, parts are then puzzled together and placed on the buildplate for you.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/WTK5fVQNPsI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

## Plater

We wrote Plater in order to automate the process of plates generating for multi-parts printing. It takes a bunch of STL files with quantities and orientation, and some settings such as the plate dimension and parts spacing and tries to generate at least plates as possible containing all the given parts.

It uses a configuration file, named ``plater.conf`` that contains the list of parts, with quantities. This file can be released with your design in order to help people do their own plates quickly.

It can be used with command-line tools, but also with a graphical user interface.

For instance, we used it to print all the 22 parts of a 4-legged robots on one plate.

* [Download Plater](https://github.com/Rhoban/Plater/releases)
* [Plater on GitHub](https://github.com/Rhoban/Plater)
* [Plater on Hackaday](http://hackaday.com/2014/06/04/plater-makes-it-easy-to-fill-your-bed-plate/)