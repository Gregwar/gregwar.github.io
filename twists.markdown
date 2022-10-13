---
layout: default
title:  "Twists cookbook"
permalink: /twists
date:   2022-03-05 16:00:00 +0200
tags: twists algebra
---

Twists are extensively used in mechanics, since they can represent the motion
of a rigid body. They are also used by Jacobians to relate the the rate of change of robot's
joint with the associated twist, and thus give a linear approximation of the robot behavior
in a given configuration.

Here, I try to keep some useful recipes for derivations involving twists.

<!--more-->

# Twists and Jacobians

The twist of an object is a 6-Dimensional vector capturing the speed of a 3D rigid body:

$$
\nu = [\omega_x, \omega_y, \omega_z, v_x, v_y, v_z]
$$

Here, $$\omega_x$$ is the speed of rotation around axis $$x$$, and $$v_x$$ the speed along axis
s. Twists can also be packaged into a matrix using the brackets $$[ \nu ]$$, which is:

$$
[ \nu ] =
\begin{bmatrix}
0 & -\omega_3 & \omega_2 & v_x \\
\omega_3 & 0 & -\omega_1 & v_y \\
-\omega_2 & \omega_1 & 0 & v_z \\
0 & 0 & 0 & 0
\end{bmatrix}
$$

If $$T$$ is the 4x4 transformation matrix of a frame, and $$\dot T$$ its rate of change
(with respect to the time or to a degree of freedom of the robot), then the spatial
twist is given by:

$$
[ \nu_s ] = \dot T T^{-1}
$$

If we were to integrate the motion, the spatial twist could be used with pre-multiplication:

$$
T(t) = e^{[ \nu_s ] t} T(0)
$$

Similarly, the body twist is defined by:

$$
[ \nu_b ] = T^{-1} \dot T
$$

That could be integrated by post-multiplication:

$$
T(t) = T(0) e^{[ \nu_b ] t}
$$

The adjoint representation noted $$Ad_T$$ is the operation that changes the frame of a twist.
This can be performed by multiplying by a 6x6 matrix that we denote $$[Ad_T]$$.
Typically, we can convert spatial twist to body twist and vice-versa:

$$
\begin{split}
\nu_s = [Ad_{T_{sb}}] \nu_b \\
\nu_b = [Ad_{T_{bs}}] \nu_s \\
\end{split}
$$

<!-- TODO: Mention pinocchio's toActionMatrix() -->

The Jacobian is the linear mapping that relate the speed of degrees of freedom $$v$$ to the
twist. Similarly, we can refer to the space Jacobian $$J_s$$ or the body jacobian $$J_b$$.
You can then use the following equalities:

$$
\begin{split}
\nu_s = J_s (\theta) v \\
\nu_b = J_b (\theta) v
\end{split}
$$

Here, $$v$$ denotes the speed of the degrees of freedom. They are not denoted $$\dot \theta$$ because they don't
necessary live in the same representation.

Those Jacobians are typically computed using the model of the robot and tools like
[Pinocchio](https://github.com/stack-of-tasks/pinocchio)'s 
[computeFrameJacobian()](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/namespacepinocchio.html#a7b1189aea93a252f4c06d9a7e3c9f5e7), using the robot's URDF.
Such a tool will provide you API to compute such Jacobian with respect to the world frame. For instance,
you can compute the space or body Jacobian of $$T_{wb}$$ where $$\{w\}$$ is the world frame
and $$\{b\}$$ is the body.

If you want to dig in the origin of the algebra, you might want to read
[Modern Robotics](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf), where Jacobians are
derived using exponential notation for coordinates.

# Twist of composition

What is the spatial twist of $$T_1 T_2$$?

$$
\begin{split}
\dot {(T_1 T_2)} ({T_1 T_2})^{-1}
& = \dot T_1 T_2 T_2^{-1} T_1^{-1} + T_1 \dot T_2 T_2^{-1} T_1^{-1} \\
& = [ \nu_{s_1} ] + T_1 [ \nu_{s_2} ] T_1^{-1} \\
& = [ \nu_{s_1} ] + [ Ad_{T_1}(\nu_{s_2}) ]
\end{split}
$$

Thus, the spatial twist of $$T_1 T_2$$ is the sum of the spatial twist of $$T_1$$
and the adjoint representation of the spatial twist of $$T_2$$ expressed in $$T_1$$.

# Twist of inverse

What is the twist of $$T^{-1}$$ ? Remember that in an articulated robot:

$$
T = e^{[S_1] \theta_1}  ... e^{[S_1] \theta_n} M
$$

Where $$[S_i]$$ are the spatial screw axises of joints. thus:

$$
T^{-1} = M^{-1} e^{-[S_n] \theta_n} ... e^{-[S_1] \theta_1}
$$

And:

$$
\begin{split}
\dot {(T^{-1})} & = M^{-1} e^{-[S_n] \theta_n} ... e^{-[S_1] \theta_1} [S_1] (-\dot \theta_1) \\
              & + M^{-1} e^{-[S_n] \theta_n} ... e^{-[S_2] \theta_2} [S_2] (-\dot \theta_2) e^{-[S_1] \dot \theta_1} \\
              & + ... 

\end{split}
$$

Plugging all together:

$$
\begin{split}
\dot {(T^{-1})} T
= &
\sum_i
M^{-1}
e^{-[S_n] \theta_n}
...
e^{-[S_i] \theta_i}
[S_i] (-\dot \theta_i)
e^{[S_i] \theta_i}
...
e^{-[S_n] \theta_n}
M
\\
= &
\sum_i
e^{-[B_n] \theta_n}
...
e^{-[B_i] \theta_i}
[B_i] (-\dot \theta_i)
e^{[B_i] \theta_i}
...
e^{-[B_n] \theta_n}
\\
= &
- \sum_i
[Ad_{
e^{-[B_n] \theta_n}
...
e^{-[B_i] \theta_i}
}]
[B_i] (\dot \theta_i)
\\
= &
- [ \nu_b ]
\\
= &
- [Ad_{T^{-1}}(\nu_s) ]
\end{split}
$$

Where $$[B_i]$$ is the body screw axis for joint $$i$$. The above derivation is actually
very similar to the one from te body Jacobian (see [Chapter 5.1.2 in Modern Robotics](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf)).

# Relative twist

Now, how one could compute the spatial twist of $$T_{ab}$$?

We can combine the two previous properties by computing the spatial twist of
$$T_{sa}^{-1} T_{sb}$$.

Thus, the spatial twist is:

$$
\begin{split}
[ \nu_s ] 
= &
- [Ad_{T_{sa}^{-1}}( \nu_{s_a} ) ]
+
[Ad_{T_{sa}^{-1}}( \nu_{s_b} ) ]
\\
= &
[Ad_{T_{sa}^{-1}}( \nu_{s_b} - \nu_{s_a} ) ]
\end{split}
$$

The spatial twist $$\nu_s$$ of $$T_{ab}$$ can then be computed as the spatial twist
$$\nu_{s_a}$$ of $$T_{sa}$$ and the spatial twist $$\nu_{s_b}$$ of $$T_{sb}$$. Note that
$$\nu_s$$ is seen from the body $$a$$, if you want to see it from the world, you will
have to multiply by $$[Ad_{T_{sa}}]$$, and this will simply become $$\nu_{s_b} - \nu_{s_a}$$.

<!-- TODO: Mention the calculation using floating base -->

# Twist of a function

What is the spatial twist of $$f(T)$$ for an arbitrary differentiable function $$f$$ (which input is a transformation
matrix and output another transformation matrix)?

We can derive:

$$
\begin{split}
\dot{(f(T))} f(T)^{-1}
& =
(
\sum_{i}
\sum_{j}
[
\frac{d f(T)}{d T_{i,j}}
\dot T_{i,j}
]
)
f(T)^{-1} \\
& =
(
\sum_{i=1}
\sum_{j=1}
[
\frac{d f(T)}{d T_{i,j}}
([\nu_s] T)_{i,j}
]
)
f(T)^{-1}

\end{split}
\space \space \space \space (1)
$$

Thus, if you have the function $$f$$, and you are able to differentiate it with respect to every coefficient in the
original matrix, you can then transform a twist of $$T$$ into a twist of $$f(T)$$ using this equation (which is
basically the chain rule).

# About Jacobians

Remember that the columns of an effector Jacobian matrix are actually twists. Those, all the algebra detailled
here is also useable to deal with Jacobian.

In particular, the relative twists implies that the difference between the spatial Jacobian of two bodies will
produce the Jacobian of a twist happenning between those two bodies; this is the so-called *relative Jacobian*.

# Summary

If we denote $$t$$ a "twist" operator $$[t(T)] = \dot T T^{-1} = [\nu_{s_T}]$$, we can then derive the following rules:

## We can use a software to compute the world spatial Jacobian

$$
    t(T_{sb}(\theta)) = J_s(\theta) v
$$

## We can use decomposition

$$
    t(T_1 T_2) = t(T_1) + [Ad_{T_1}] t(T_2)
$$

## We can use inverse

$$
    t(T^{-1}) = - [Ad_{T^{-1}}] t(T)
$$

## We can apply a function

$$
    [t(f(T))] = 
    (\sum_{i}
    \sum_{j}
    [
    \frac{\partial f(T)}{\partial T_{i,j}}
    (t(T) T)_{i, j}
    ]
    )
    f(T)^{-1}
$$


By chaining all those operations, one can start with an equation involving frames, and derive the resulting
twist (or Jacobian).
