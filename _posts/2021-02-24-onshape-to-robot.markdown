---
layout: default
title:  "Onshape to robot tutorial"
permalink: /onshape-to-robot-tutorial
date:   2021-02-24 18:00:00 +0200
tags: robotics urdf sdf onshape cad
---


<figure class="float-right">
    <img src="/assets/onshape-to-robot.png" width="400" />
</figure>

Designing robot involve using CAD software, which is used to create parts and assemblies.
Another task when you want to simulate your robot, or manipulate its kinematics chain from software, is to
use description format like URDF or SDF files.

<!--more-->

Those files are for instance used to load a robot in [pyBullet](https://pybullet.org/wordpress/) or
[Gazebo](http://gazebosim.org/) simulator. They can also be loaded in libraries like [RBDL](https://github.com/rbdl/rbdl)
or [Pinocchio](https://github.com/stack-of-tasks/pinocchio).

However, almost all the information you want are already in the CAD software you use in first place. That is why
this process can be heavily automated.

Onshape, a fully-online CAD designing tools, offers a convenients API, that allowed us to build such a software:
[onshape-to-robot](https://onshape-to-robot.readthedocs.io/).

## Video tutorial

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/C8oK4uUmbRw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

## Links

* [Onshape to robot documentation](https://onshape-to-robot.readthedocs.io/en/latest/)
* [GitHub repository](github.com/rhoban/onshape-to-robot)
* [Robot examples](github.com/rhoban/onshape-to-robot-examples)
