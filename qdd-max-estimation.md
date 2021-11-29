---
layout: default
title:  "Qdd max estimation"
permalink: /qdd-max-estimation
date:   2021-11-29 18:00:00 +0200
tags: robotics
---

Suppose we apply constant torque on the robot at a given time:

$$
\dot v = M^{-1}(q) (\tau + J_c^T f  -h(q, v)) \space \space \space (1)
$$

Thus:

$$v(t) = v_0 + \dot v t = v_0 + M^{-1}(q) (\tau + J_c^T f - h(q, v)) t$$

If the goal is to stop the robot after $$t_f$$ seconds, we can then solve
$$v(t_f) = 0$$ for $$\tau$$:

$$ \tau = h(q, v) -J_c^T f -M(q)v_0 \frac{1}{t_f} \space \space \space (2)$$

This equation gives us the *constant* torque that would be needed to take the robot
to a stop after a duration of $$t_f$$.

Knowing bounds for torque $$\tau_L < \tau < \tau_U$$, we can then compute:

$$
\min t_f \\
s.t \\
h(q, v) -J_c^T f -M(q)v_0 \frac{1}{t_f} < \tau_U \\
\tau_L < h(q, v) -J_c^T f -M(q)v_0 \frac{1}{t_f} \\
$$

And then get $$\tau$$ from $$(2)$$, we can then plug it back in equation $$(1)$$, which will
give us the acceleration of every joint during this global-emergency-stop.

Those accelerations could then be used as maximum acceleration capabilities for the
joints, since we know that it would be possible for the whole robot to come to a stop
by using them.
