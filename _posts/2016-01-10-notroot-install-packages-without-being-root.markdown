---
layout: default
title:  "Notroot: install packages without being root"
permalink: /notroot-install-packages-without-being-root
date:   2016-01-10 18:00:00 +0200
tags: bash system
---

Sometime, you connect to a server and a library is not installed, or maybe you are a student in an university
and you need to install some application that would take a snap using `apt`, but there is one problem... you
are not root!

<!--more-->

Here I introduce a (hacky) solution that you can try out to install packages in your user area, with the comfort
of apt command.

# Quick tutorial

First clone the [notroot repository](https://github.com/gregwar/notroot):

{% highlight bash %}
git clone https://github.com/Gregwar/notroot.git
{% endhighlight %}

Now add this line in your `.bashrc` file:

{% highlight bash %}
source "$HOME/notroot/bashrc"
{% endhighlight %}

And reload bash.

You can now give a try to `notroot install [your package]`, for example:

{% highlight bash %}
# Installing a package, here some json libraries (example)
notroot install libjsoncpp-dev libjsoncpp0
{% endhighlight %}

Everything will be installed under your `notroot/` directory, and the `bashrc` script you sourced above do additions
to some environment variables (like `$PATH`, `$LIBRARY_PATH`...) in order to make it work.

# Links

* [Notroot repository on GitHub](https://github.com/gregwar/notroot)
