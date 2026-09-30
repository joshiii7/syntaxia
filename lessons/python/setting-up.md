---
title: "How to Install Python: Setup for Windows, macOS, and Linux"
description: "Install Python 3 on Windows, macOS, or Linux, check that it works from a terminal, and set up a code editor so you're ready to write your first program."
---

# Setting Up Python on Your Computer

*Before you can bake, you need an oven. This lesson installs yours.*

In [What Is Python?](/lessons/python/intro-to-python), you saw a few small Python programs. To run programs like that yourself, your computer needs Python installed: the program that reads your code and carries it out. In this lesson, you'll install it, check that it works, and set up a code editor to write in.

Take it slowly and follow the steps for your own computer. If something doesn't work, the troubleshooting section near the end covers the usual problems.

## Which version?

Always install the newest **Python 3**. At the time of writing, that's **Python 3.14**, and 3.15 is due in October 2026. Any recent version works for this whole track, so if a newer one is available when you read this, pick that.

## Installing on Windows

On Windows, Python.org now recommends a small tool called the **Python install manager**. It installs Python for you, keeps it up to date, and lets you add other versions later.

1. Go to **python.org/downloads** and download the Python install manager for Windows. (It's also in the **Microsoft Store**, under the name Python install manager. Both versions are the same.)
2. Run it and follow the steps.
3. Open a new terminal: search the Start menu for **Terminal**.
4. Type this command and press Enter:

```text
py install default
```

That downloads and installs the newest version of Python. When it finishes, the `python` command is ready to use.

You may still find the older Python installer (a file ending in `.exe`) on the website. It works, but it's being phased out: Python 3.16 won't have one.

## Installing on macOS

1. Go to **python.org/downloads** and download the latest Python 3 installer for macOS (a file ending in `.pkg`).
2. Open it and follow the steps.

On macOS, the command is **`python3`**, not `python`. Wherever this track says `python`, type `python3` instead.

## Installing on Linux

Most Linux systems already have Python 3. Open a terminal and check:

```text
python3 --version
```

If it prints a version number, you're set. If not, install it with your system's package manager. On Ubuntu and Debian, that's `sudo apt install python3`. Like macOS, Linux uses **`python3`** as the command.

## Checking that it worked

Open a **new** terminal window (an old one may not know Python was just installed) and type:

```text
python --version
```

On macOS or Linux, type `python3 --version` instead. You should see something like this, though your numbers may differ:

```text
Python 3.14.7
```

If you see a version number, the hardest part is done. Seriously, well done.

If you've never used a terminal before, [Using the Integrated Terminal](/lessons/ide/using-the-terminal) in the IDE track is a gentle introduction.

## Choosing a code editor

You *could* write Python in a plain text editor, but a code editor makes life much easier. It colors your code, points out mistakes as you type, and runs your program with one click. The [IDE track](/lessons/ide/introduction) explains [how to choose one](/lessons/ide/choosing-the-right-ide). For Python, two free options are popular:

- **Visual Studio Code** with Microsoft's **Python** extension. It's light, it works for other languages too, and you might already have it from the IDE track. Open the **Extensions** view, search for **Python**, and install the one published by Microsoft.
- **PyCharm**, an editor built specifically for Python. It's heavier, but it does a lot for you.

Either one is a great choice. Pick one and stick with it for now.

## When something goes wrong

**"'python' is not recognized" or "command not found"**

The terminal can't find Python. The most common reason is that the terminal was already open when you installed it. Close every terminal window, open a new one, and try again. On macOS and Linux, make sure you're typing `python3`.

**The version number is old, like 2.7 or 3.6**

You have an older Python installed as well, and it's being found first. That's common on older Macs and school computers. On macOS and Linux, use `python3`. On Windows, `py list` shows every version the install manager knows about.

**Your school computer won't let you install anything**

That's normal on shared computers. You can still read every lesson here, and you can finish the setup at home later.

## Try it

This small program checks your setup by printing which Python version is running and which operating system it's on. Predict what it prints, then check your guess.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="200px"
	:model-value="'import platform\n\nprint(&quot;Python is working!&quot;)\nprint(&quot;Python version:&quot;, platform.python_version())\nprint(&quot;Operating system:&quot;, platform.system())\n'"
/>

The first line, `import platform`, loads a built-in toolbox of functions for asking about the computer. You'll learn about `import` in [Modules and import](/lessons/python/modules).

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. Once your setup works, save this program as `main.py`, open a terminal in the same folder, and run `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
The first line is always the same. The other two depend on your computer, so yours will look a little different:

```text
Python is working!
Python version: 3.14.7
Operating system: Windows
```

On a Mac, the last line says `Darwin`, the name of the system underneath macOS. On Linux, it says `Linux`.
:::

## Try it yourself

1. Run `python --version` (or `python3 --version`) in a new terminal, and write down the version number.
2. Make a new folder called `python-practice` somewhere easy to find. Open it in your code editor, and create a file inside it named `main.py`.
3. Copy the program above into `main.py`, save it, and run it from a terminal in that folder. Does the version it prints match the one from step 1?

## Check your understanding

<Quiz
	question="On macOS, which command runs Python 3?"
	:options="['python3', 'py3', 'run python', 'python.exe']"
	:answer-index="0"
	explanation="On macOS and Linux, the Python 3 command is python3. On Windows, it's python."
/>

<Quiz
	question="You just installed Python, but the terminal says python is not recognized. What should you try first?"
	:options="['Reinstall your operating system', 'Uninstall Python', 'Close the terminal, open a new one, and try again', 'Rename your files']"
	:answer-index="2"
	explanation="A terminal that was open before the install doesn't know about Python yet. A fresh terminal usually fixes it."
/>

<Quiz
	question="What does py install default do on Windows?"
	:options="['Deletes old Python versions', 'Installs the newest version of Python using the Python install manager', 'Runs a program called default', 'Checks your internet connection']"
	:answer-index="1"
	explanation="The Python install manager's install command downloads and sets up a Python version. default means the newest recommended one."
/>

## Up next

Your oven is hot. Time to bake something: in [Your First Python Program](/lessons/python/first-program), you'll write a program from scratch and find out what every line means.
