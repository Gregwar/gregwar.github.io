---
layout: default
title:  "Computing torques to compensate gravity in humanoid robot"
permalink: /humanoid-gravity-torques
date:   2021-12-06 16:00:00 +0200
tags: robotics humanoid torques gravity
---

<figure class="float-right">
    <img src="/assets/humanoid-g.png" width="150" />
</figure>

As opposed to robotics arms, humanoid robots are mobile and therefore contact points with the
environments should be accounted for when computing their dynamics.

Here, we derive a way to compute the required torque on an humanoid robot standing on either one
or two legs to sustain the gravity.


<!--more-->

# Introduction

The general equation of motion is:

$$
M(q) \dot v + g(q) + h(q, v) = \tau \space \space (1)
$$

Where:

* $$q$$ is the configuration of the robot joints,
* $$v$$ is the speeds of the robot joints (and $$\dot v$$) acceleration of robot joints,
* $$M(q)$$ is the mass matrix,
* $$h(q, v)$$ are Coriolis and centripetal effects,
* $$g(q)$$ is the generalized gravity,
* $$\tau$$ are the degrees of freedom torque.

If we want no acceleration $$\dot v = 0$$, and we ignore other non linear effects ($$h$$):

$$\tau = g(q)$$

Thus, for any "static" robot like a robotic arm anchored on the ground, we can simply stop here.
The generalized gravity is indeed directly the torques we need to compensate gravity.

# Floating base

Now, what if we have a mobile robot, like an humanoid? The thing is that we need to represent the fact
that the robot is moving in the world. This is typically achieved by adding a *floating base*.

The *floating base* is a set of 6 extra degrees of freedom added at the beginning of the kinematics
chain representing the position of the robot in the world.

<center>
    <img src="/assets/imgs/floating-base.png" width="300" />
</center>

As an illustration, imagine an humanoid robot attached to an invisible robotic arm itself anchored to
the ground. (This is just a mental visualization; the floating base is of course not constrained to
the singluarities and the workspace of a robotic arm).

The equation $$(1)$$ now becomes:

$$
M(q) \dot v + g(q) + h(q, v) =
\begin{bmatrix}
0_6 \\
\tau
\end{bmatrix}
$$

Where $$0_6$$ is the dimension-$$6$$ vector of null torques in the floating base. Subject to gravity, the only way
to balance this equation is to include some acceleration on the floating base: the robot is "falling" and there is no
way to prevent that because our current model doesn't includes contact forces.

# Contact forces

Contact forces act on the robot through the transpose of the Jacobian of contact frame. For more information
see [Modern Robotics, chapter 5.2](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf).

Those additional terms can be added to equation $$(1)$$, which is now:

$$
M(q) \dot v + g(q) + h(q, v) =
\begin{bmatrix}
0_6 \\
\tau
\end{bmatrix}
+
\underbrace{
\sum_i
J_i^T f_i
}_{contact forces}

\space \space (2)
$$

Again, supposing we want no acceleration and neglecting other non linear effects than gravity, our equation
becomes:

$$
g(q)
=
\begin{bmatrix}
0_6 \\
\tau
\end{bmatrix}
+
\sum_i
J_i^T f_i
\space \space (3)
$$

# One support leg

With one support leg, equation $$(3)$$ now is:

$$
g(q)
=
\begin{bmatrix}
0_6 \\
\tau
\end{bmatrix}
+
J_l^T f_l
$$

Where $$J_l$$ is the Jacobian of the left foot and $$f_l$$ the force applied on the left foot.

We can split this equation in two parts:

$$
\begin{cases}
g_u(q) = (J_l^T)_u f_l
\\
g_a(q) = \tau + (J_l^T)_a f_l
\end{cases}
$$

Here, the underscript $$u$$ and $$a$$ denotes respectively the unactuated and actuated parts of the gravity
and Jacobian.

Since $$(J_l^T)_u$$ is the Jacobian of an universal floating base, it can always be inverted, and:

$$
f_l = (J_l^T)_u^{-1} g_u(q)
$$

Is the only solution of contact forces to balance the equation. We can then substitute them back in the
actuated part of equation and get:

$$
\tau = g_a(q) - (J_l^T)_a f_l
$$

Which are the torques needed on the robot joints.

# Two support legs

We now assume two support legs, and then have:

$$
g(q)
=
\begin{bmatrix}
0_6 \\
\tau
\end{bmatrix}
+
J_l^T f_l
+
J_r^T f_r
$$

With $$J_l$$ and $$J_r$$ being respectively the Jacobian of the left and right foot, and $$f_l$$ and
$$f_r$$ respectively the contact forces on left and right foot.

We can do the same split as previously, but separating also equations for left and right legs:

$$
\begin{cases}
g_u(q) = (J_l^T)_u f_l + (J_r^T)_u f_r \space \space (4)
\\
g_l(q) = \tau_l + (J_l^T)_l f_l + \underbrace{(J_r^T)_l}_0 f_r  \space \space (5)
\\
g_r(q) = \tau_l + \underbrace{(J_l^T)_r}_0 f_l + (J_r^T)_r f_r  \space \space (6)
\end{cases}
$$

Because of the kinematics structure of the robot, we know that $$(J_r^T)_l$$ and $$(J_l^T)_r$$ are null
(because left and right legs are different branches in the kinematics tree).

Here, we can't solve the contact forces using the first equation, because the system is under-constrained.
Indeed, forces are 12 degrees of freedom while we only have 6 equations.

## Minimizing contact forces

We could solve equation $$(4)$$ with:

$$
\begin{bmatrix}
f_l \\ f_r
\end{bmatrix}
= 
\begin{bmatrix}
(J_l^T)_u &
(J_r^T)_u
\end{bmatrix}^{\dagger}
g_u(q)
$$

Where $$\dagger$$ denotes the [Moore-Penrose pseudo-inverse](https://en.wikipedia.org/wiki/Moore%E2%80%93Penrose_inverse).
(*Note: With Numpy, you can use [np.linalg.pinv](https://numpy.org/doc/stable/reference/generated/numpy.linalg.pinv.html),
and with Eigen you can use [computeOrthogonalDecomposition().solve()](https://eigen.tuxfamily.org/dox/classEigen_1_1CompleteOrthogonalDecomposition.html#title32).*)

That would give us the solution that minimizes contact forces (more precisely $$|| f ||^2$$). But if you want to
control an humanoid robot, it is more likely that what you want to minimize is the torques used in motors instead.

## Minimizing torques

We can turn equation $$(4)$$ into a relation between $$f_l$$ and $$f_r$$:

$$
f_l =
\underbrace{
- (J_l^T)_u^{-1} 
(J_r^T)_u 
}_A
f_r

+

\underbrace{
(J_l^T)_u^{-1} 
g_u(q)
}_B
$$


Substituing it in $$(5)$$, we get:

$$
(J_l^T)_l f_l
=
g_l(q) - \tau_l

\\

(J_l^T)_l (A f_r + B)
=
g_l(q) - \tau_l

\\

f_r 
=
\underbrace{
- 
((J_l^T)_l A)^{-1}
}_C
\tau_l 
+
\underbrace{
((J_l^T)_l A)^{-1}
(
g_l(q) - (J_l^T)_l B
) 
}_D 

\space \space (7)
$$

And, from $$(6)$$:

$$

f_r
=
\underbrace{
-
(J_r^T)_r^{-1}
}_E
\tau_l
+
\underbrace{
(J_r^T)_r^{-1}
g_r(q)
}_F

\space \space (8)
$$

Thus, combining $$(7)$$ and $$(8)$$, we can get a relation between $$\tau_l$$ and $$\tau_r$$:

$$
C \tau_l + D = E \tau_r + F 
$$

Which is another under-constrained system expressed in terms of torques. We can now find the solution
minimizing torques:

$$
\begin{bmatrix}
\tau_l \\
\tau_r
\end{bmatrix}
=
\begin{bmatrix}
C & -E
\end{bmatrix}^{\dagger}
(F-D)
$$

# More generally

You can solve those problems more generally and systematically by formulating all this
in a constrained optimization problem.

This is what is achieved in solvers like [TSID (Task-Space Inverse Dynamics)](https://github.com/stack-of-tasks/tsid).
In such setup, you minimize a score function subject to equation $$(2)$$, using some solver like [Quadratic
Programming](https://en.wikipedia.org/wiki/Quadratic_programming).

There are many advantages of doing so; since you can also add some inequality constraints, limiting the torque
and forces to feasible ranges.
