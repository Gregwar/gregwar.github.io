---
layout: default
title:  "Formidable: PHP forms made simple"
permalink: /formidable-php-forms-made-simple
date:   2013-11-04 18:00:00 +0200
tags: php forms
---

Forms are doubtless one of the most important part of writing a web application, because it deals with how the user interact with it.

Handling a form "manually" with pure-PHP is boring and repetitive, that's why it's really important to have a good form library to rely on (more than a templating engine IMO).

With most of the form libraries out there, the problem is that you have to learn the API to build fields. Hence, when you will render it, if you want to do something custom, it may be complex.

## So, what's new?

The approach of [Formidable](https://github.com/Gregwar/Formidable) is different. Instead of using a PHP API to build your form, you can write it directly in HTML, like this:

{% highlight html %}
<!-- form.html -->
<form method="post">
    Your name:
    <input type="text" name="name" /><br />
    <input type="submit" />
</form>
{% endhighlight %}

And give it to Formidable:

{% highlight php %}
<?php
$form = new Gregwar\Formidable\Form('form.html');
echo $form;
{% endhighlight %}

This way, the form will be parsed and an internal representation is constructed. You can interract with your form using PHP. Formidable is able to recognize all the input types, radios, selects, textarea etc.

The output form will look like this:

{% highlight html %}
<form method="post">
    Your name:
    <input type="text" name="name" /><br />
    <input type="submit" />
    <input type="hidden" name="posted_token" value="30d29663567d633233a256ed245426a24e1d355b" />
</form>
{% endhighlight %}

Note that a security token is automatically injected in the form.

## Enjoy the magic!

Now, you can manipulate your form using PHP, for instance, you can set field value:

{% highlight php %}
<?php
// Set the value of the field 'name' to 'Bob'
$form->setValue('name', 'Bob');
{% endhighlight %}

And, of course, you can handle the form when its posted:

{% highlight php %}
<?php
$form->handle(function() use ($form) {
    echo 'Hello '.htmlspecialchars($form->getValue('name'));
}, function($errors) {
    echo 'There was errors:<br/>';
    foreach ($errors as $error) {
        echo '* '.$error.'<br/>';
    }
});
{% endhighlight %}

The `handle()` method will call its clalback if the form was posted and is valid. This way, if the field `name` has a `maxlength` constraint, Formidable will check that the length of the posted value is smaller than `maxlength`. If there is errors, Formidable will re-populate the form with posted data automatically to avoid re-typing everything.

Moreover, it provides extra attributes that doesn't exists in HTML:

{% highlight html %}
<input type="text" name="name" minlength="5" />
{% endhighlight %}

The `minlength` attribute doesn't exist in HTML, and thus won't be displayed in the form. However, Formidable will use this information for checking data.

You can also add your own constraint:

{% highlight php %}
<?php
$form->addConstraint('name', function($value) {
    if ($value[0] == 'P') {
        return 'Your name should not begin with a P!';
    }
});
{% endhighlight %}

## Play with inputs

Formidable recognizes all inputs, for instance:

{% highlight php %}
<?php
$form = new Gregwar\Formidable\Form('<form method="post">
    <select name="colour">
        <option value="blue">Blue</option>
        <option selected value="red">Red</option>
        <option value="green">Green</option>
    </select>
    </form>');

echo $form->getValue('colour') . "\n";
// red
{% endhighlight %}

As you can see, the select is parsed and available with `setValue` and `getValue` exactly the same way as other inputs.

## Sourcing

Imagine you want to populate your form choices with data from your database, or anything else, you can then use sourcing:

{% highlight php %}
<?php
$form = new Gregwar\Formidable\Form('<form method="post">
        Your favourite TV show:
        <select name="series">
            <options source="series" />
        </select>
        <input type="submit" />
        </form>');

$form->source('series', array(
    'House MD', 'Dexter', 'South Park'
));

echo $form;
{% endhighlight %}

"Huh, but, Formidable constructor takes a file or a form string, I don't get it": actually, both works, Formidable will guess wheter its first constructor argument is the form data or a filename. If  there is a line break `\n`, it will consider the input as a form, else as a filename.

The example above will populate the select `series` with an array from the outside of the form. Note that the resulting option values will be `0`, `1` and `2` here.

## Want a CAPTCHA?

No problem! Simply add an input of type captcha to your form:

{% highlight html %}
<input type="captcha" name="captcha" />
{% endhighlight %}

This will be rendered as an image and a field, and Formidable will check that the user correctly types the code for you. This uses the [Gregwar/Captcha](https://github.com/Gregwar/Captcha) component.

## CSRF Protect

If sessions are active, Formidable will inject a CSRF token automatically. You don't have to bother about this.

If sessions are not active, Formidable will inject a token that will be the same for every user but which depends on the form name, it will be used to know if the form was posted and to distinguish which form was posted if there is several forms on the same page.

## Caching 

For performances reasons, Formidable is able to cache the parsed forms. This is based on [Gregwar/Cache](https://github.com/Gregwar/Cache) component.
  
  
## Links

* [Formidable on GitHub](https://github.com/Gregwar/Formidable)
* [Formidable documentation](https://github.com/Gregwar/Formidable#formidable)
* Formidable is of course available on composer, see [gregwar/formidable](https://packagist.org/packages/gregwar/formidable) package
