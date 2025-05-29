---
layout: default
title:  "Relative Jacobians"
permalink: /jacobians
date:   2024-06-05 18:00:00 +0200
tags:
 - kinematics
---

# Relative Jacobians

This post is a comprehensive explanation of how to derive relative Jacobians by using underlying libraries like
[Pinocchio](https://github.com/stack-of-tasks/pinocchio).

## Rotation matrices

First of all, you should be familiar with rotation matrices. We'll call $${}^a R_b$$ the rotation matrix transforming
points from frame $$b$$ to frame $$a$$.

Remember that the inverse of $${}^a R_b^{-1}$$, which is $${}^b R_a$$ is the same as the transpose $${}^a R_b^T$$.

*See section 3.2.1 of [Modern Robotics](https://hades.mech.northwestern.edu/index.php/Modern_Robotics).*

## Angular velocities

Let's denote $${}^a \omega_b$$ the angular velocity of the object $$b$$ with respect to $$a$$ expressed in the
frame $$a$$. An important identity is:

$$
{}^a \dot R_b = [{}^a \omega_b]_{\times} {}^a R_b
$$

Where the $$[]_{\times}$$ operator is a $$3\times3$$ skew-symmetric matrix.
Multiplying on the left by this matrix is equivalent to the cross product, hence the $$\times$$ notation.
The angular velocity can then be derived from the differentiation:

$$
{}^a \dot R_b {}^b R_a = [{}^a \omega_b]_{\times} \space \space \space (1)
$$

*See section 3.2.2 of [Modern Robotics](https://hades.mech.northwestern.edu/index.php/Modern_Robotics).*

### Changing basis for angular velocity

An useful property is the following:

$$
R [ \omega ]_{\times} R^T = [R \omega]_{\times} \space \space \space (2)
$$

If you think of it as $${}^c R_a [ {}^a \omega _b]_{\times} {}^a R_c$$, you can imagine it as three operations
(from the right to the left): taking a point from frame $$c$$ to $$a$$, applying the angular velocity in frame $$a$$,
and then taking it back to $$c$$. Which is equivalent of applying it an angular velocity
$${}^c R_a {}^a \omega_b = {}^c \omega_b$$ in frame $$c$$.

*See section 3.2.3 of [Modern Robotics](https://hades.mech.northwestern.edu/index.php/Modern_Robotics).*

### Inverse of rotation

By using the following property:

$$R R^T = I$$

And differentiating it with respect to time, we have:

$$ \dot R R^T + R \dot R^T = 0$$

And thus:

$$\dot R^T = - R^T \dot R R^T$$

Then:

$$
    {}^b \dot R_a = [{}^b \omega_a]_{\times} {}^b R_a = - {}^b R_a [ {}^a \omega_b]_{\times}
$$

By multiplying on the right by $${}^a R_b$$, and applying the identity mentioned in previous section:

$$
    [{}^b \omega_a]_{\times} = - [ {}^b R_a {}^a \omega_b]_{\times}
$$

The brackets can be dropped, yielding:

$$
    {}^b \omega_a = - {}^b R_a {}^a \omega_b \space \space \space (3)
$$

## Jacobians

Jacobian matrix maps the joint-space velocity to some task-space velocity.
This task-space velocity can be angular or linear, depending on the context.
We will write $$\dot q$$ the joint-space velocity for convenience, even if it is often denoted otherwise, because
the joint-space velocity (in the tangent space) sometime doesn't have the same dimension as the robot configuration.

Let's use the notation $$J^\omega$$ for angular velocity Jacobian and $$J^p$$ for linear velocity jacobian.

When using rigid body library (like [Pinocchio](https://github.com/stack-of-tasks/pinocchio)), we can compute
the *space Jacobian*, expressed in a global inertial world frame $$w$$:

$${}^w \omega_a = {}^w J_a^{\omega} \dot q$$

$${}^w v_a = {}^w J_a^{v} \dot q$$

Where $${}^w v_a$$ stands for the linear velocity of $$a$$ in the world $$w$$.
The two Jacobians mentioned above are the oned obtained with the `LOCAL_WORLD_ALIGNED` mode in Pinocchio.
The angular velocity is equivalent to the one obtained in `WORLD` Jacobian.
However, the linear velocity you would obtain in the `WORLD` Jacobian would be the linear velocity of a point
attached to the given object, but that would be at the origin of the world frame.

### Relative orientation

Now, suppose we have two frames attached to our robot, $$a$$ and $$b$$, and we want to derive the relative Jacobian
(i.e. the angular and linear velocity of $$b$$ expressed in $$a$$).
Moreover, we'd like to compute it from previosuly mentioned Jacobians that we can compute using our underlying
library.
We would like to have:

$$
    {}^a \omega_b = {}^a J^\omega_b \dot q
$$

We can note that:

$$
    [{}^a \omega_b]_{\times} = {}^a \dot R_b {}^b R_a
$$

And, since:

$$
    {}^a R_b = {}^a R_w {}^w R_b
$$

We then have:

$$
    [{}^a \omega_b]_{\times} 
    = {}^a \dot R_b {}^b R_a
    = {}^a \dot R_w {}^w R_b {}^b R_a + {}^a R_w {}^w \dot R_b {}^b R_a
$$

We can then apply identity $$(1)$$:

$$
    [{}^a \omega_b]_{\times}
    =
    [ {}^a \omega_w]_{\times} {}^a R_w {}^w R_b {}^b R_a + {}^a R_w [ {}^w \omega_b]_{\times} {}^w R_b {}^b R_a 
$$

And simplifying:

$$
    [{}^a \omega_b]_{\times}
    =
    [ {}^a \omega_w]_{\times}+ {}^a R_w [ {}^w \omega_b]_{\times} {}^w R_a
$$

We can now apply identity $$(3)$$ on the first term, and identity $$(2)$$ on the second term:

$$
    [{}^a \omega_b]_{\times}
    =
    [ - {}^a R_w {}^w \omega_a]_{\times} + [ {}^a R_w {}^w \omega_b]_{\times} 
$$

We can rewrite this to:

$$
    {}^a \omega_b
    =
    {}^a R_w ( {}^w \omega_b - {}^w \omega_a )
$$

We can then use the angular velocity Jacobians $${}^w J_a^{\omega}$$ and $${}^w J_b^{\omega}$$ to compute this
relative Jacobian, since we have:

$$
    {}^a \omega_b
    =
    \underbrace{ {}^a R_w ( {}^w J_b^{\omega} - {}^w J_a^{\omega}) }_{ {}^a J^\omega_b } \dot q
$$

### Relative positions

Let's write $${}^w \vec {ab}$$ the coordinates of vector $$\vec{ab}$$ in frame $$w$$.
We now want to find the following Jacobian:

$$
    {}^a \dot{\vec {ab} } = {}^a J^v_b \dot q
$$

We can write:

$$
    {}^a \vec {ab} = {}^a R_w {}^w \vec {ab}
$$

Evaluating the derivative with respect to time, we obtain:

$$
    {}^a \dot{\vec {ab} }
    =
    {}^a \dot R_w {}^w \vec {ab}
    +
    {}^a R_w {}^w \dot{\vec {ab}}
    \space \space \space (4)
$$

Intuitively, the first term comes from the apparent motion of $$b$$ because of the rotation of frame $$a$$.
The second term comes from the relative motion of $$a$$ and $$b$$.

#### Let's first deal with the first term $${}^a \dot R_w {}^w \vec {ab}$$ of equation $$(4)$$:

$$
    {}^a \dot R_w {}^w \vec {ab}
    =
    [ {}^a \omega_w]_{\times} {}^a R_w {}^w \vec {ab}    
$$

Because $$[]_{\times}$$ represents the cross product, which is anti-symmetric, we can write:


$$
    {}^a \dot R_w {}^w \vec {ab}
    =
    -
    [ {}^a R_w {}^w \vec {ab} ]_{\times}
    {}^a \omega_w
$$

And applying identity $$(3)$$:

$$
    {}^a \dot R_w {}^w \vec {ab}
    =
    [ {}^a \vec {ab} ]_{\times}
    {}^a R_w
    {}^w \omega_a
$$

We can now express this first term with respect to $$\dot q$$:

$$
    {}^a \dot R_w {}^w \vec {ab}
    =
    [ {}^a \vec {ab} ]_{\times}
    {}^a R_w
    {}^w J_a^{\omega} \dot q
$$

#### Now with the second term of equation $$(4)$$:

$$
    {}^a R_w {}^w \dot{\vec {ab}}
    =
    {}^a R_w [ {}^w \dot{\vec {wb}} - {}^w \dot{\vec {wa}} ]_{\times}
$$

We can express this second term with respect to $$\dot q$$:

$$
    {}^a R_w {}^w \dot{\vec {ab}}
    =
    {}^a R_w [ {}^w J_b^v - {}^w J_a^v ]_{\times} \dot q
$$

#### Putting it all together:

$$
    {}^a \dot{\vec {ab} }
    =
    \underbrace{
    (
    [ {}^a \vec {ab} ]_{\times}
    {}^a R_w
    {}^w J_a^{\omega}
    +
    {}^a R_w [ {}^w J_b^v - {}^w J_a^v ]_{\times}
    )
    }_{ {}^a J^v_b}
    \dot q
$$