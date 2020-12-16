---
layout: default
title:  "Speed-up platformio mbed build and dfu-util"
permalink: /speedup-pio-mbed-build-and-dfu-util
date:   2020-12-16 18:00:00 +0200
tags: embedded  dirty-hacks
---

Programming micro controllers involves using a lot of tools (cross compilation toolchains, firmware uploading
softwares, libraries...). [PlatformIO](http://www.platformio.org/) really lightens the process of installing and
configuring all of them, and also manage the build of your embedded project.

I've been experiencing it using STM32 controllers with the arm mbed framework and DFU USB bootloader, which is
natively supported by [most of them](https://www.st.com/resource/en/application_note/cd00167594-stm32-microcontroller-system-memory-boot-mode-stmicroelectronics.pdf), and it is actually a good
developing environment.

<!--more-->

However, both building the code and loading it on the board are painfully slow. Updating the build (`pio run`)
on my computer takes a baseline of 15s, that I have to wait even if I just change a few minor things,
and loading a 50K firmware on the board with default `dfu-util` takes 25s.

Here, I give you some (dirty) hacks/workaround to get those two operations done in a much acceptable time.

# Speed-up the build time (`pio run` w/ mbed)

PlatformIO relies on `scons.py` build system, which takes a lot of time scanning all the dependencies for
updates, even in mbed itself which is actually never rebuilt since you basically only work on your own
application.

## Step 1: Open `Taskmaster.py`

You will find your `scons` installation, which is for me:
`~/.platformio/packages/tool-scons/scons-local-4.0.1/SCons/Taskmaster.py`

Around line 840, you will find something like this:

```python
# Around line 840
children_not_visited = [] 
children_pending = set()
children_not_ready = [] 
children_failed = False

for child in chain(executor.get_all_prerequisites(), children):

    childstate = child.get_state()
```

## Step 2: Apply changes

At the beginning of the file, add:

```python
import os
```

And change the code by adding the following lines:

```python
# Around line 840
children_not_visited = [] 
children_pending = set()
children_not_ready = [] 
children_failed = False

for child in chain(executor.get_all_prerequisites(), children):
    # Add those lines below:
    if os.getenv('SKIP_MBED') is not None:
        # Dirty hack to skip mbed object checking
        if 'FrameworkMbed' in str(child):
            child.set_state(NODE_EXECUTED)

    childstate = child.get_state()
```

What we basically do here is ignoring the files that contains `FrameworkMbed` in their (output) path in the
node process of `scons` itself, without removing them from the linking process.

## Step 3: When you build, decide if you want to skip mbed

When issuing a `pio` command, you can now set the `SKIP_MBED` environment
variable to activate the hack.

### On Linux / bash

You can simply prefix your commands with:

```
SKIP_MBED=1 pio run
```

### On Windows / PowerShell

You can set the `SKIP_MBED` with:

```
$env:SKIP_MBED = 1
```

And then run your `pio run`. You can then disable the skip by unsetting the environment varaible:

```
Remove-Item env:SKIP_MBED
```

## Result

For me, this lowers the build time from 15s to 2s, and stills checks and compiles all the files in my
`src/` application directory.

# Speed-up dfu-util

The problem with `dfu-util` appeared to be some really conservative sleeps, while it is possible to
wait much less time and simply insist on the device to [get its status until it replies](https://github.com/Gregwar/dfu-util/commit/4953f7d4efae738cf00de66caac35357703beb50). I warn you that I didn't investigate a lot the topic and there might
be some side effects / downside of this practice, but so far I didn't notice any.

## Linux

### Step 1: install dependencies

We will need them to rebuild `dfu-util`:

```
sudo apt-get install autogen make libusb-dev gcc git
```

### Step 2: clone my fork of dfu-util

You can simply clone the following git repository:

```
git clone https://github.com/Gregwar/dfu-util.git
```

### Step 3: build

By running the following commands:

```
./autogen.sh
./configure
make
```

### Step 4: override PlatformIO's dfu-util

Again, there might be cleaner ways to do that, but you can simply copy the `dfu-util` you just built
over PlatformIO's one:

```
cp src/dfu-util ~/.platformio/packages/tool-dfuutil/bin/dfu-util
```

If you want to revert this, you can simply remove the `tool-dfuutil` repository entirely, and it will be
re-created on the next `pio run` anyway.

## Windows

I went through the process of building an `.exe` for Windows, so I will save you some time and provide it
to you directly, and the Windows version of this hack will be pretty straightforward:

Download [dfu-util.exe](/assets/dfu-util.exe) and place it next to your `platformio.ini`.

That's all, `pio` will actually use it right away since the `.exe` file will be in the same folder where you
issue the `pio run -t upload` command (for instance).

## Results

For me, this lowers the flashing time from 25s to 3s.

# Final words

Those hacks are still some dirty workarounds allowing a huge gain of time, especially in the prototyping
phase.
I hope those timings will be brushed up in official versions of those tools, since I enjoy working with
them.