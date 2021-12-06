---
layout: default
title:  "Rotation interpolation and fitting"
permalink: /rotation-interpolation-and-fitting
date:   2021-12-02 18:00:00 +0200
tags: robotics
---

<figure class="float-right">
    <img src="/assets/3d_trajectory.png" width="300" />
</figure>

3D orientations are something complicated to deal with, because they have multiple
representations (rotation matrices, Euler angles, angle-axis, quaternions), which
are all presenting some kind of trade-off with the others.

<!--more-->

Suppose that you logged 3D rotations (they can come for instance from a ground truth
like motion capture or vive trackers), and you want to match a smooth model on them
and be able to interpolate: how can you do? This is the issue we will discuss here.

# Interpolating between two 3D rotations

Suppose we have one starting rotation matrix $$R_1$$ and one destination rotation
matrix $$R_2$$. Interpolating means that we want to find $$R(t)$$ such that:

$$
R(0) = R_1 \\
R(1) = R_2
$$

And any intermediate value gives a *smooth* transition from $$R_1$$ to $$R_2$$. 

One way to interpret this smoothness is that we can have a constant rotation speed
bringing us from $$R_1$$ to $$R_2$$.

Using twists algebra, we can compute find the twist $$w$$ that would bring us
from $$R_1$$ to $$R_2$$:

$$
e^{[w]} R_1 = R_2 \\
[w] = log(R_2 R_1^{-1})
$$

Where:

$$
[w] = 
\begin{bmatrix}
0 & -w_z & w_y \\
w_z & 0 & -w_x \\
-w_y & w_x & 0
\end{bmatrix}
$$

Is the 3x3 skew-symmetric representation of the angular velocity $$w$$, and log
refers to the matrix logarithm. If you are not familiar with this, have a look to
[Modern Robotics](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf), Chapter 3.

Here, $$w$$ is then a constant *twist* that we can follow to bring $$R_1$$ to 
$$R_2$$. To interpolate, we can then integrate this twist:

$$
R(t) = e^{[w] t} R_1
$$

This concept is similar to [Slerp](https://en.wikipedia.org/wiki/Slerp) interpolation
using *twist* algebra.

Using [pinocchio](https://github.com/stack-of-tasks/pinocchio), this can be
implemented this way:

```python
import pinocchio as pin

def rotation_interpolation(R1, R2):
    w = pin.log3(R2 @ R1.T)
    return lambda t: pin.exp3(w * t) @ R1
```

# Fitting a set of 3D rotations

## Least-square fitting

When we have a set of scalar values $$(t_1, x_1, t_2, x_2, ..., t_n, x_n)$$, we can
fit them using any linear model, like for instance a cubic spline, using least
square formulation:

$$
\underbrace{
\begin{bmatrix}
1 & t_1 & t_1^2 & t_1^3 \\
1 & t_2 & t_2^2 & t_2^3 \\
... \\
1 & t_n & t_n^2 & t_n^3 \\
\end{bmatrix}
}_{A}

\underbrace{
\begin{bmatrix}
a \\ b \\ c \\ d
\end{bmatrix}
}_x
=
\underbrace{
\begin{bmatrix}
x_1 \\
x_2 \\
... \\
x_n
\end{bmatrix}
}_b
$$

Where $$x$$ can be found by pseudo-inverting $$A$$, that gives :

$$
x = A^{\dagger} b
$$

This method can be used to find the best model to fit a set of values you logged.
It also works well with 3D points.

This can be implemented using Numpy's `pinv`:

```python
def fit(t_train, x_train):
     A = np.vstack([np.array(t_train)**k for k in range(4)]).T
     params = np.linalg.pinv(A) @ x_train
     return {
         'x': lambda t: params @ [1, t, t**2, t**3],
         'dx': lambda t: params @ [0, 1, 2*t, 3*t**2],
     } 
```

You can give it a try:

```python
t_train = [0, 1, 2, 3, 4, 5]
x_train = [0, 0.3, 1., 1.3, 4, 9]
f = fit(t_train, x_train)
t_pred = np.linspace(0, 5, 100)
x_pred = [f['x'](t) for t in t_pred]
import matplotlib.pyplot as plt
plt.plot(t_pred, x_pred)
plt.scatter(t_train, x_train)
plt.grid()
plt.show()
```

<center>
<figure>
    <img src="/assets/fitting.png" style="max-width:400px" />
</figure>
</center>

## Dealing with 3D orientations

Now, what happens if we have sampled rotation matrices $$(t_1, R_1, t_2, R_2, ..., t_n, R_n)$$?

One idea would be finding the twist fitting the trajectory the best for unit time. The equation of our
interpolation would be:

$$
R(t) = e^{[w] t} e^{[w_s]}
$$

Where $$w_s$$ would be the initial twist and $$w$$ the twist that we follow during the trajectory.
We here have 6 parameters and would like to find the best match for them to our rotations.

We can't use least-squares here because the problem is of course non-linear (because of the
matrix exponential function). However, we can start with an initial guess, that would be:

$$
w_s = log_3(R_1) \\
w = log_3(R_n R_1^T)
$$

Here, $$log_3$$ doesn't denote the matrix but the twist.

For each sample, we can measure the error with:

$$
\epsilon_k = log_3(R(t_k) R_k^T) = log_3(e^{[w] t_k} e^{[w_s]} R_k^T)
$$

The score we want to minimize is then:

$$
s = \sum_k \epsilon_k^T \epsilon_k
$$

Thus, we can compute gradient using:

$$
\frac{\partial s}{\partial w_s}
= 
\sum_k
2 (\frac{\partial \epsilon_k}{\partial w_s})^T \epsilon_k
\\
\frac{\partial s}{\partial w}
= 
\sum_k
2 (\frac{\partial \epsilon_k}{\partial w})^T \epsilon_k
$$

## Computing Jacobians

We can compute the jacobian:

$$
\frac{\partial log(R e^{[w]})}{\partial w} 
\\
= \frac{\partial log}{\partial w}
(R e^{[w]})
\frac{\partial R e^{[w]}}{\partial w}
\\
= J_{log_3}
(R e^{[w]})
J_{exp_3}(w)
$$

Where $$J_{log_3}$$ and $$J_{exp_3}$$ are:
* [pinocchio::Jlog3](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/namespacepinocchio.html#a756cdb33ab783f34248c45d08aef00f4)
* [pinocchio::Jexp3](https://gepettoweb.laas.fr/doc/stack-of-tasks/pinocchio/master/doxygen-html/namespacepinocchio.html#a08fbc06d6caeae9c60a0412c82b87590)

If we want to compute the Jacobian of:

$$
\frac{\partial log(R_1 e^{[w]} R_2)}{\partial w}
$$

We can rewrite it:

$$
\frac{\partial log(R_1 R_2 e^{[R_2^T w]})}{\partial w}
$$

Since

$$
e^{[w]} = e^{[R_2 R_2^T w]} = R_2 e^{[R_2^T w]} R_2^T
$$


Refer to [Modern Robotics, Chapter 3.2.2](http://hades.mech.northwestern.edu/images/7/7f/MR.pdf) for details about this.

Which is then, using the chain rule:

$$
J_{log_3}(R_1 e^{[w]} R_2)
J_{exp_3}(R_2^T w) R_2^T
$$

We can then implement this as a non-linear minimizing problem with known gradient
$$\frac{\partial s}{\partial w_s}$$.

## Implementation

TODO
