---
layout: default
title:  "Plankton: a (pedagogical) 42-lines framework"
permalink: /plankton-a-42-lines-framework
date:   2013-12-12 18:00:00 +0200
tags: php tip
---

In my opinion, one of the biggest feature of PHP is that it can both be used as a template system and a programming language. However, this may be a pedagogical issue because developers may be confused and mix paradigms.

<!--more-->

# What's the problem?

Let's take a simple example:

{% highlight php %}
<?php
$pdo = include('connect.php');
?>
Films are:
<ul>
    <?php foreach ($pdo->query('SELECT * FROM films') as $film) { ?>
        <li><?php echo $film['name']; ?></li>
    <?php } ?>
</ul>
{% endhighlight %}

This is a really classical example, we've all seen this kind of code. So what's the problem with that? Here is a list:

* Conceptually: the rendering and the logic are **mixed together** in the very same file
* A consequence is that if we would like to have the same logic (getting all the films) with **another render** (think of a JSON API) we should either change the code or duplicate the logic
* Another consequence is that **if an error occurs** during the rendering of the page, it will be brutally interrupted in the middle of nowhere
* Moreover, if we suddenly decide in the page that the client should not be on this page and want to **redirect** it, we can't change the response headers since we already begun the rendering
* It is impossible to **reuse the same rendering** with another source as list of movies
* If you want to **reuse the request** (OK, getting all the films is easy, but think of more complicated thing), you won't be able to do it
* You can't **(unit) test** your logic without getting your page rendered
* ...

Doing like this, your code will be organized by pages instead of splitting the responsibilities. In each page, you'll have a little slice of each responsibilities mixed up. Thus, a lot of nightmare could happen.

# Standard tools & libraries

On the other hand, there is many framework and libraries out there, and a lot of impressing PHP tools to create your web application faster and with a lot of cool features. [Symfony2](http://www.symfony.com), [Silex](http://silex.sensiolabs.org/), [Twig](http://twig.sensiolabs.org/) and [Doctrine2](http://www.doctrine-project.org/) are the best examples. The problem with those tools is that:

* You can't read all the source-code of Silex or Symfony, you'll have to accept that some things are complicated, read the API and follow the guidelines someone told you
* Symfony2 and Silex are seriously hitting performances, Silex is 20M and rendering an "hello world" page involve *a lot* code. Thus, "from-scratch" designs could be paradoxically better for some applications
* In some situation, essentially pedagogical, you are not allowed to use these tools. I don't really agree with these methods but the idea that a student should understand *every* line of code he write is not 	completely absurd
* If you're learning PHP, you have to face directly a big gap between all you've seen and the "clean world" of tools and framework, maybe you want to get an idea of the intermediary steps that lead the community to do it this way with an example of minimalist project respecting some interesting principles without all the overhead of famous tools and libraries

# Plankton

This is why we wrote [Plankton](https://github.com/Gregwar/Plankton), a pico framework with only a few line of codes that demonstrates how a *really* little application could be wrote and respect some principles.

There is no documentation, this is one of the points, this is so small that you can easily read all the source code (the core is 42 lines, and all the repository is less than 100 examples included) but it introduces lightweightly to some concepts like templating, controllers and routing. Moreover, it suggests an organization of files.

If we re-write the example above in Plantkon, we will have the controller handling the request for the route `/films`:

{% highlight php %}
<?php  // controllers/films.php
return array(
    '/films' => function($app) {
        return array('films', 'films' =>
            $app['pdo']->query('SELECT * FROM films'));
    }
);
{% endhighlight %}

And the view, decoupled which just render it:

{% highlight php %}
<!-- views/films.php -->
Films:
<ul>
    <?php foreach ($films as $film) { ?>
        <li><?php echo $film['name']; ?></li>
    <?php } ?>
</ul>
{% endhighlight %}

Don't hesitate to have a look at [Plankton on GitHub](https://github.com/Gregwar/Plankton)
