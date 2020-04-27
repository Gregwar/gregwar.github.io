---
layout: default
title:  "Fun with fat"
permalink: /fun-with-fat
date:   2013-11-03 18:00:00 +0200
tags: fat filesystem forensic fatcat
---

During the creation of the [fatcat](https://github.com/Gregwar/fatcat/) tool, I've experienced some fun filesystem hacks. That's why I wrote this [tutorial](https://github.com/Gregwar/fatcat/blob/master/docs/fun-with-fat.md) explaining some of them, and I released some [disk images](https://github.com/Gregwar/fatcat/tree/master/docs/images) related.

Here, I will explain some of these images.

<!--more-->

# The directories loop

In [directory-loop.img](https://github.com/Gregwar/fatcat/blob/master/docs/images/directory-loop.img.gz?raw=true), you have an infinite loop of directories.

This is because the `A` directory which is in `/A/B/C` references the same cluster as the `/A` directory. You can try it out, it works on both Windows & Linux:

{% highlight bash %}
# The directory loop is mounted under x/, auto-completion will continue forever!
$ ls x/A/B/C/A/B/C/A/B/C/A/B/C/A/B/C/A/B/C/A/(...)
{% endhighlight %}

# The empty-but-not-empty disk

[full-fat.img](https://github.com/Gregwar/fatcat/blob/master/docs/images/full-fat.img.gz?raw=true) contains a full file allocation table, while the root directory counts no entry. 

If you mount this, or write it on an USB key, the disk will appear as 100% full even if there is absolutely no file on it!

# Two files, one cluster

[two-file-same-cluster.img](https://github.com/Gregwar/fatcat/blob/master/docs/images/two-file-same-cluster.img.gz?raw=true) image contains two files that references the same cluster.

This mean that if you change one, it will change the other (note that the size will not be updated for the other entry).

# 	The infinite file

[infinite-file.img](https://github.com/Gregwar/fatcat/blob/master/docs/images/infinite-file.img.gz?raw=true) contains a file that appear to be 4G (the maximum with FAT32) which you can read, but it's actually the same data that are looping.

This doesn't seems to work on Windows however.

# The fake 1T image

This image is one of the most interesting, 	the [fake-big-disk-1T.img](https://github.com/Gregwar/fatcat/blob/master/docs/images/fake-big-disk-1T.img.gz?raw=true) contains an image of 128M with tweaked FAT32 headers.

If you write it on an USB key and insert it, this disk will appear as a 1T drive, and everything will work normally until you write more data on it that its actual size.

{% highlight bash %}
# The image was wrote to a 4G USB key (/dev/sdb)
# and mounted in /media/MEGA
$ df -h
(...)
/dev/sdb           1.1T    352K  1.1T   1% /media/MEGA
{% endhighlight %}

# Links

* [fatcat on Github](https://github.com/Gregwar/fatcat/)
* [fatcat tutorials & examples](https://github.com/Gregwar/fatcat/blob/master/docs/index.md)
* [fatcat on Debian](https://packages.debian.org/source/sid/fatcat)