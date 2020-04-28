---
layout: default
title:  "Capture The Flag in class"
permalink: /capture-the-flag-in-class
date:   2018-01-15 18:00:00 +0200
tags: ctf teaching
---

![Flag](/assets/imgs/flag.png){:class="float-right"}

Some topics are hard to teach, security is typically one of them. I used to give some lectures about web security,
and then do some supervised class work, but it was not very efficient.

<!--more-->

On the other hand, we (computer science department) organized some national competition, that lasts for 24 hours in
a row, three times 8 hours for three challenges: programming, web and security. In the latter, I set up a capture the
flag style competition, and since then we are also using it in pedagogical activities.

# What is a Capture The Flag (CTF) ?

If you know about security, you also already know what a Capture The Flag type challenge is. You basically have a pool
of challenges, which can be mostly done independently. At the end of each challenge, a flag should be found, it can
be a password, the result of some algorithm or something you can decipher. That is why it is particularly adapted to
security, but it can be extended to other challenges.

I usually pair my students (teams of 2), and they share the same account (thus, it is a good strategy to dispatch
challenges). Those challenges are designed to make you learn something when you solve them, cleaning/fixing some
code, getting access to some remote website (knowing the source or not), reading some network trace etc.

Around 20 challenges are good for a 4 hours session, you can see an example of dashboard (challenges list) below.

![Dashboard](/assets/imgs/flagrant-challenges.png){:class="center-image"}

Those hours are very studious, entertained by a real-time competition that is available on the leaderboard, projected
on the screen. Each time a good flag is entered, a music jingle is played and the team name and challenge displayed
on that same screen.

<center>
<blockquote class="twitter-tweet"><p lang="fr" dir="ltr">C&#39;est parti pour un capture the flag <a href="https://twitter.com/hashtag/php?src=hash&amp;ref_src=twsrc%5Etfw">#php</a> <a href="https://twitter.com/hashtag/dawin?src=hash&amp;ref_src=twsrc%5Etfw">#dawin</a> cc <a href="https://twitter.com/njournet?ref_src=twsrc%5Etfw">@njournet</a> <a href="https://t.co/xjjFChJu5X">pic.twitter.com/xjjFChJu5X</a></p>&mdash; iutInfoBdx (@iutInfoBdx) <a href="https://twitter.com/iutInfoBdx/status/923798091375022080?ref_src=twsrc%5Etfw">October 27, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
</center>

## About the score

This is how your score is computed:

* For each passed challenge:
    * `50 points`
    * `+50 points` if you are the first team to pass a challenge (breakthrough bonus)
    * `+25 * N points`, where `N` is the number of teams that didn't passed the given challenge

This way, your score can decrease through time, since a challenge can worth less later because it was beaten by
other teams.

The interest of this is to avoid making any assumption on challenges difficulties, since the reward will adjust
automatically.

# Feedback about activity

Students are autonomous, we mostly give them some indications on the fly to be sure challenges are at least done by
one team. The involvement is surprisingly good during competition time, with a huge focus.

Another interesting time is the debriefing, where we give all the solutions of each challenge they had to face. Since
they invested a lot of time trying to figure out how to do, they usually pay high attention to this.

# My philosophical trade-offs about teaching

## Validation versus help

![Validation](/assets/imgs/validation.png){:class="float-right"}

As teacher we have at least two roles, the first one is to help ("you can use this method to solve such problem"),
and the other one is to validate ("what you did is good/wrong").

When students are working on computers, most of the validation works is actually deferred to the machine, which is
a great luck for our image to the student. Instead of being the vilain that tells you that what you did is good or
bad, you are the nice guy coming and giving advises to help you solving your issues. And there is no doubt about it,
before you came, the program was dying in a terrible error, and after you leave, everything is working fine!

This doesn't mean that problems are always solved the proper way. But if there is a better way, like avoiding
copy and paste of code snippets in favor of factoring it, there should also exists some exercises that will make it
more obvious.

So here is one of the dream of computer scientists, automate the "validation" part of their job to only have to focus
on explaining how to solve the faced problems.

## Competition versus evaluation

![Validation](/assets/imgs/podium.png){:class="float-right"}

Competition is not a valid way to evaluate your class. The threshold mark where you estimate your students are
skilled enough to pass your class can be reached by all of them, or none of them, it's not a relative measure.

However, competition is a very efficient way to create motivation. This is what happens in serious games for instance.
So, here is a trade-off, we can't have a class in competition mode only, but we should keep this as a tool to make
some lectures more efficients.

## Try hard versus global sweeping

![Validation](/assets/imgs/strong.png){:class="float-right"}

When you try hard on a specific topic, you understand better the pitfalls, the intuitions of a specific problem.
Struggling yourself on something is part of learning. Thus, when you find the solution, or even when it is given to you,
it really makes senses to you and you will don't forget that.

However, the above mentioned process of struggling for learning is a really long process and it is not practicable
for everything. If you want to have a big picture, an overview of some topic, you can't stop and try hard on every
aspect of it.

## Teaching versus entertaining

![Validation](/assets/imgs/popcorn.png){:class="float-right"}

Another possible discussion is about how much entertaining should a class be? One point of view would be that making
things entertaining if related to some kind of decline in people ability to focus on something, and is just
accelerating this phenomenon, or at least assuming it.

However, it is also possible to assume that the future will offer more flexibility, and will not be centered on
the concept of work. Just like [David Graeber](https://en.wikipedia.org/wiki/Bullshit_Jobs) suggests, the current
society is maybe already structured around make-believe jobs that are not useful. Think also of the
[post-scarcity economical models](https://en.wikipedia.org/wiki/Post-scarcity_economy) (you know, universal basic income).

If having a job becomes optional, doesn't it mean a different way of teaching?

# Flagrant.io

I developed a platform that you can try: [flagrant.io (french)](https://flagrant.io/), that allows people to create
their own capture the flag challenges.
