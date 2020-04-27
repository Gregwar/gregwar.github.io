---
layout: default
title:  "fatcat: repair your fat filesystems"
permalink: /fatcat-repair-your-fat-filesystems
date:   2013-11-03 18:00:00 +0200
tags: fat filesystem forensic fatcat
---

![Fatcat](/assets/imgs/fatcat.jpg){:class="float-right m-2"}

Recently I faced a problem that we've all met: a broken external hard drive. I think everybody already lost data this way, and we don't always know what to do in this case. This is why I decided to explore the way of data recovery and try to figure out what it is possible to do to retreive as many things as possible.

<!--more-->

The hard drive I had to repair was using a FAT32 filesystem, this is still one of the most used filesystem provided with flash drives and external hard drives. This lead me to write fatcat, a tool I made to explore, repair and forensic FAT filesystems, which I'll introduce here.

I'm trying here to suggest guidelines for repairing a broken FAT filesystem.
# Save everything !

You can follow this tutorial by using the  [repair.img](https://github.com/Gregwar/fatcat/blob/master/docs/images/repair.img.gz?raw=true) demo image.
If you do this, just download the image and step to the next part.

If you do have a broken hard drive, you will have to save everything before hoping a FAT repair. You can either copy your data to another drive or to a file. Assuming your damaged hard drive is `/dev/sdb`, you can use `ddrescue` to do this:

{% highlight bash %}
# Backup all your /dev/sdb drive to a file named save.img
$ ddrescue /dev/sdb save.img rescued.log
{% endhighlight %}

<pre>
Toto
</pre>

This will save your whole disk to the `save.img` file. If there is broken sectors on `/dev/sdb`, this may take a while, be patient.

Note that you will need enough free space to store `save.img` that the whole size of the disk under `/dev/sdb`.

# Explore

You can now explore your disk, have a look to it using mount for instance:

{% highlight bash %}
# Mount the saved image under the x/ directory
$ mkdir x
$ mount save.img x$ cd x/
$ ls -lAh
$ ...
{% endhighlight %}

Doing this, you can explore your disk image like a regular directory on your system. Have a look at the files and the directories, try to find out what's OK and what's not.

You can also check that fatcat works and recognize the image by using `-i`:

{% highlight bash %}
# Get information about the disk using  fatcat
$ fatcat save.img -i
{% endhighlight %}

This will give you information about the drive. At the end of the output, you'll see the list of used and free clusters, this can inform you about the size of data that seems to be allocated.

# Fix the FAT

Now, we'll try to fix the file allocation table (alias FAT). Before we do this, we'll backup it to a file:

{% highlight bash %}
# Backup the file allocation table
$ fatcat save.img -b save.fat
{% endhighlight %}

If something goes wrong, you'll be able to restore the FAT by doing:

{% highlight bash %}
# Restoring the backuped FAT
$ fatcat save.img -p save.fat
{% endhighlight %}

A first thing you can do is compare the file allocation tables. Those two FATs are supposed to be identical and are wrote twice on the disk for security reason. To compare it, use -2:

{% highlight bash %}
# Comparing the FATs
$ fatcat save.img -2
{% endhighlight %}

If you're using the demo repair.img, you will see that cluster 32 differs (0x20).

If there is differences in the FATs, you can try merging them with -m:

{% highlight bash %}
# Merging the FATs
$ fatcat save.img -m
{% endhighlight %}

This will read the FATs cluster per cluster and choose the only value that is allocated when the entries differs, and one of them is "unallocated". This will fix the fat1_broken directory of the `repair.img` image.

However, sometimes, problems can break the two FATs simultaneously. In this case, some files and directories are still referenced on the drive, but are marker as unallocated in the FAT. fatcat is able to read them and can try to fix these cases, with `-f`:

{% highlight bash %}
# Try to fix the FAT when directories are marked as unallocated but readable
$ fatcat save.img -f
{% endhighlight %}

This will fix the unallocated directory of the repair.img image.

# Find the orphans

Now we've fixed the FAT, there may still have data on the disk that are still here but unreachable: this is called orphaned data. On the example `repair.img` image, there was an orphaned directory in the root directory, but I smashed its entry with zeroes (`0x00`). This directory is still allocated, somewhere on the disk, but is no longer reachable, and its name does not exist anymore.

To find this kind of files and directory, fatcat will compare what's reachable from the root directory (`/`) and what's allocated on the disk, and will try to find directories that are allocated but not reachable. This is done using `-o`:

{% highlight bash %}
# Try to find the orphans (lost & found)
$ fatcat save.img -o
{% endhighlight %}

This may take some minutes to complete on big drives, be patient.

On the `repair.img`, this is what you should see:

{% highlight bash %}
# Running orphans search on the example image
$ fatcat repair.img -o
(...)
There is 1 orphaned elements:
* Directory clusters 33 to 33: 2 elements, 30B

Estimation of orphan files total sizes: 30 (30B)   

Listing of found elements with known entry:
In directory with cluster 33:
f 27/10/2013 16:32:54  orphan_file.txt                c=51 s=30 (30B)
{% endhighlight %}

This means that there is one directory found that is orphaned. You can list its entry by using -L, which lists a directory using its cluster number:

{% highlight bash %}
# Listing entries of directory cluster 33
$ fatcat repair.img -L 33
Listing cluster 33
Directory cluster: 33
d 27/10/2013 16:32:26  ./                             c=33
d 27/10/2013 16:32:26  ../                            c=0
f 27/10/2013 16:32:54  orphan_file.txt                c=51 s=30 (30B)
{% endhighlight %}

As you can see, here is an orphan file in it, named `orphan_file.txt`. You can read this file using `-R` and `-s`, to read a file using its cluster number and its size:

{% highlight bash %}
# Reading 30 bytes of the file in cluster 51
$ fatcat repair.img -R 51 -s 30
This file is a poor orphaned!
{% endhighlight %}

You can also extract the whole directory using `-x` and `-c`:

{% highlight bash %}
# Extracting orphaned directory 33 to output/
$ mkdir output/
$ fatcat repair.img -x output/ -c 33
{% endhighlight %}

That's all! On a big broken drive, you may have a lot of orphaned files and directories, and having a look at them could take a while. Try to spot big directories and big files. Good luck!
Links & references

# Links
## Here!

* [fatcat on Github](https://github.com/Gregwar/fatcat/)
* [fatcat tutorials & examples](https://github.com/Gregwar/fatcat/blob/master/docs/index.md)
* [fatcat on Debian](https://packages.debian.org/source/sid/fatcat)
