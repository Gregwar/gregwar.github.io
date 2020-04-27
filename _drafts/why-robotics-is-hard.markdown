---
layout: default
title:  "Why robotics is hard"
permalink: /why-robotics-is-hard
tags: robotics
---

The victory of [Deep Blue](https://en.wikipedia.org/wiki/Deep_Blue_versus_Garry_Kasparov) over Kasparov in 1997 is a
typical milestone mentioned by artificial intelligence researchers. Playing chess as a symbol of intelligence was
an early idea even mentioned by Alan Turing back in 1950, in the famous
[imitation game](https://www.csee.umbc.edu/courses/471/papers/turing.pdf) article.

This "chess game" challenge is even today used as a landmark to compare and explain difficulties in creating AIs or
robotics projects. It is also worthy highlighting than in 1997 the [RoboCup](https://www.robocup.org) project started:

<!--more-->

<blockquote class="blockquote text-center">
  <p class="mb-0 quote">
    When established in 1997, the original mission was to field a team of robots capable of winning against the human soccer World Cup champions by 2050.
  </p>
  <footer class="blockquote-footer">
  RoboCup official website (robocup.org)
  </footer>
</blockquote>

I am member of one of the teams competing in RoboCup since 2013. You can have an insight on the current state with this
short video:

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/tF0cr0PYjsk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

So, how fielding a team of humanoid robots playing soccer against humans is still hard while we can defeat the chess
grandmaster?

# High dimensions

Recent breakthrough in artificial intelligence is deep reinforcement learning, which most impressive applications
can be credited to [DeepMind](https://www.deepmind.com/) (Google), including:

* [AlphaGo](https://deepmind.com/research/case-studies/alphago-the-story-so-far), playing the Go (board game)
* [Playing Atari Game](https://arxiv.org/pdf/1312.5602.pdf) ([video](https://www.youtube.com/watch?v=V1eYniJ0Rnk))
* [AlphaStar](https://deepmind.com/blog/article/AlphaStar-Grandmaster-level-in-StarCraft-II-using-multi-agent-reinforcement-learning), playing the Blizzard's RTS video
game StarCraft II

The difference in difficulty was depicted by Deepmind on the following slide during the Blizzcon 2019:

![DeepMind slide](/assets/robotics/deepmind-difficulties.jpg){:class="center-image"}

## Action space is continuous

In chess game, action space is discrete. You can enumerate all the possible moves in a given state. Having discrete
actions is convenient from computational point of view, because it allows sweeping, you can at some point consider
all of them separately. This is typically what is done in Deep Blue
([min/max exploration](https://en.wikipedia.org/wiki/Minimax)).

Even the Atari Games AI builds a model that given a state (e.g: the screen of the game) and an action (e.g:
pressing the button "up") gives you a score of the future rewards (e.g: the score). Once you have
this model, you can take the action that maximize this score for the current state, by evaluating the model for
each possible action.

Other AI architectures (like [DDPG](https://arxiv.org/pdf/1509.02971.pdf)) can deal with continuous action space
and also builds a model of a function deciding what action to
take depending on the current state (so-called "actor").

In robotics, actions are mostly continuous, because actually physical, like how much volt should we inject in a given
motor? Moreover, in the low level layers, those decisions are made at high frequency (typically hundred of times per
seconds).

That is why we need to do *dimensions reduction*:

* Can we make decisions less often?
* Can we use only a subset of the robot possibilities?
* Can we split up our problem in different parts, that separately have lower dimensions?


# Uncertain information

## Information is partial

<figure class="float-right">
  <img src="/assets/imgs/fog-of-war.png" width="256" />
  <figcaption class="text-center">
    Fog of war: example<br/>
    of partial information
  </figcaption>
</figure>

The information available for a robot at a given point is only a partial view of its environment. This is because
the environment itself is the physical world which is very complex and not all of it can be captured.

Moreover, taking information is itself part of the decision process, think about where you decide to look at when
discovering a new building and try to navigate.

## Noise

Sensors also can be said to be noisy. However, noise is just a natural way to represent the fact that information is
partial, using a probability distribution for the state of the robot.

We can consider another example, suppose your robot is kicking a ball on a grass field, the ball is rolling and will
reach a given location. If you repeat this experiment several time, the ball will reach different location. This is
because the initial conditions changes, and the kicking motion itself might not be exactly the same. Of course you can
improve your motion and perception, but it is unlikely your robot will capture exactly all the blades of grass, its own
initial pose or the ball inertia.

Thus, you use a probabilistic model like this one:

<figure class="text-center">
    <img src="/assets/robotics/balloons.png" />
    <figcaption>
        Shooting a ball can be modeled by a probability distribution
    </figcaption>
</figure>

It however means that you will have to take in account that for each kick, the ball will not reach exactly a given
position, but will instead follow a given distribution.

# Deal with physics, mechanics & embedded

Unlike StarCraft II or AlphaGo, robotics involves real-life hardware (mechanics, electronics) that should be designed
and scaled for the task.

## Joint design

Creating good joints is still nowadays a big issue, and potential breakthrough in the future might be total game changers
in robotics design.

Low-cost robots involve serial gears that can easily break and introduce backlash. Industrial robots relies on harmonic
drive reduction, that is very efficient but also really rigid. This rigidity is an issue when it comes to passive or
semi-passive robots, which is natural idea when thinking of bio-inspired designs. Think about your legs when walking,
most of the motion is actually totally mechanical (your floating leg is only actuated a little).

Rigid robots are less likely to adapt their environment and to cooperate with humans. With this goal in mind
(we talk about *soft robotics*), there is different leads:

* Using [series elastic actuators](https://www.intechopen.com/books/recent-advances-in-robotic-systems/series-elastic-actuator-design-analysis-and-comparison), where a spring is on the way between motor and load
* Creating different reduction technologies like Cycloidal
* Using motors with more torque with smaller reduction ratios

CYBO project in following video is a good example of such investigation:

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/_QDkel1Tuok" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

## Physics is a model of the world, robotics uses models of physics

We should not forget that physics itself is an experimental science, and even the best equations we use are just models
of what we see. However, those equations are computationally expansives and in real-life application only simpler models
can be used.

# Integrating everything together

## Robotics is multi-fields

A robot involve several skills, like mechanical design & manufacturing, electronics, embedded, kinematics... If you want
to build something real, you need to be at least a little good in every one of those layers.

This can be noticed in any league of the RoboCup, getting real robots working and ready on time for a given challenge
is really demanding. It is common in a laboratory to have people working in standalone on their own research field, but
impossible in a robotics team making real robots, this requires both infrastructure and a group of people collaborating
with common goals.

Not to mention that with the Dunning-Kruger effect, if you are a little good in a lot of topics, you are also in a lot
of valley of despairs (i.e: by understanding better each sub-fields you also understand how much they can be improved).

<figure class="text-center">
    <img src="/assets/imgs/dunning-kruger.png" />
    <figcaption>
    Source:
    <a href="https://commons.wikimedia.org/wiki/File:Dunning%E2%80%93Kruger_Effect_01.svg">wikimedia</a>
    </figcaption>
</figure>

Moreover, integrating different parts of a robotics project is a real work that should not be taken lightly.

## The what-to-improve dilemma

Especially in research, projects involves field-specialists. However, don't forget the
[law of instrument](https://en.wikipedia.org/wiki/Law_of_the_instrument):

<blockquote class="blockquote text-center">
  <p class="mb-0 quote">
    If all you have is a hammer, everything looks like a nail
  </p>
  <footer class="blockquote-footer">
    Abraham Maslow
  </footer>
</blockquote>

It is then likely that computer scientists will try to fix the problems out with machine learning, while control theory
specialists will ask for a higher sampling rate and mechanical engineer will use lighter screws.

That is why to get something working you need to have a critical view on each point, but also being able to take action
in both high-level software and low-level embedded systems whenever necessary.

## Testing is hard

When you commit code into some repository, you can expect it to be tested by your continuous integration server or
at least some code that your colleagues will be able to run later. This is harder to setup in robotics, since your
final functional tests themselves include a lot of hardware that communicate together.

However, separate components are still unit-testable. You quickly realize that a lot of your development effort is about
handling some possible fake environments that allow you to test some piece of code without experimenting live on the
robots themselves.

<figure class="text-center">
    <img src="/assets/robotics/sim.jpg" />
    <figcaption>
        Our simulation environments for humanoid robot playing soccer
    </figcaption>
</figure>

Moreover, being able to log and replay one component is also an important feature to have. This is one of the good value
of the [ROS project](https://www.ros.org/).

# Conclusion

In my team, we try to master all the aspects of designing robots almost from scratch that eventually performs
complex tasks, and this comes with a lot of difficulties. But getting the final functionning result is a quite satisfying
feeling that makes those efforts worth it!
