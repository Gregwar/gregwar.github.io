---
layout: default
title:  "unserialize(serialize($x))"
permalink: /unserialize-serialize
date:   2013-12-05 18:00:00 +0200
tags: php tip
---

I faced a situation: I had an objects scene, containing a lot of objects referencing each other, and wanted to be able to take a snapshot of this scene and tweak it with the ability of "resetting" everything to a previous state.

<!--more-->

Cloning was the first think I thought of. If we have a look at the following example::

{% highlight php %}
<?php
class A
{
    public $b;
    public function __construct()
    {
        $this->b = new B;
    }
}

class B
{ }

$x = new A;
$y = clone $x;

if (spl_object_hash($x->b) == spl_object_hash($y->b)) {
    echo "The Bs are equals!\n";
}
{% endhighlight %}

We can note that the two Bs are equals. This makes sense since PHP can't guess what you wan't to do, and just copy by default the fields from the original class to the cloned one.

## Now, suppose that you want an entire clone (no cross-references)

One solution would be writing a `__clone()` method to explicitely clone the instance, the problem is that this can quickly become huge if there is many objects and references.

That's why I eventually noticed that the PHP [serialize()](http://php.net/serialize) method was clever enough to figure out when references are in the objects it's cloning (even self-references), and that's why this strange-but-powerful idea:

{% highlight php %}
$y = unserialize(serialize($x));
{% endhighlight %}

Doing this, you will clone `$x` in `$y`, but also clone all the references it contains. You can be sure that `$y` won't reference a previously existing object.