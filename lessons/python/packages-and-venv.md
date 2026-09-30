---
title: "Python pip and Virtual Environments (venv) for Beginners"
description: "Install extra Python packages with pip, keep each project's packages separate with a virtual environment, and record them in requirements.txt so others can run your code."
---

# Packages, pip, and Virtual Environments

*A school library has thousands of books on its own shelves. For anything else, the librarian can order it in, but each class keeps its borrowed books on its own cart.*

Python's standard library, the toolbox from [Modules and import](/lessons/python/modules), is big. But the world of Python is much bigger. Hundreds of thousands of extra **packages**, written by other programmers and shared for free, do everything from drawing charts to building websites to training AI models.

This lesson shows how to install those packages with **pip**, and how to keep each project's packages tidy and separate with a **virtual environment**. Everything here happens in a terminal on your own computer, not in a browser.

## Ordering books in

A school library has plenty of books on its own shelves: that's the standard library, already installed with Python. When a class needs something the library doesn't have, the librarian orders it in from a huge central catalog.

- The central catalog is **PyPI**, the Python Package Index, at pypi.org. It lists hundreds of thousands of packages.
- The librarian who orders them is **pip**, Python's package installer. It comes with Python.
- And each class keeping its own borrowed books on its own cart, so one class's books never get mixed up with another's, is a **virtual environment**.

## Installing a package with pip

Say you want to fetch web pages from Python. A hugely popular package for that is called `requests`. To install it, run this in a terminal (not in Python itself):

```text
python -m pip install requests
```

(On macOS and Linux, type `python3` instead of `python`, as in [Setting Up](/lessons/python/setting-up).) `python -m pip` means "run the pip that belongs to this Python," which avoids confusion when a computer has more than one Python installed.

pip downloads the package, and any other packages it depends on, and prints something like `Successfully installed requests-...` at the end. Then you can import it like any module:

```python
import requests
```

A few other pip commands you'll use:

| Command | What it does |
|---|---|
| `python -m pip install requests` | install a package |
| `python -m pip install --upgrade requests` | update it to the newest version |
| `python -m pip uninstall requests` | remove it |
| `python -m pip list` | list everything installed |

Only install packages you trust, from their official names. Anyone can publish to PyPI, and a package can run code on your computer when it's installed. A misspelled name might install something you didn't mean to.

## The problem virtual environments solve

Without a virtual environment, pip installs packages into your one main Python, shared by every project on your computer. That causes trouble sooner than you'd expect:

- Project A needs version 1 of a package, and project B needs version 2. You can only have one installed at a time.
- After a year, your main Python is full of packages, and you can't remember which project needed which.
- When you share a project, nobody knows which packages to install to run it.

A **virtual environment** fixes all three. It's a folder inside your project containing its own private copy of Python's package shelf. Packages installed while it's active go into that folder, and only that project sees them. Delete the folder, and they're gone, without touching anything else.

## Creating a virtual environment

In a terminal, go to your project's folder, and run:

```text
python -m venv .venv
```

That creates a folder called `.venv`: `venv` is the built-in module that makes virtual environments, and `.venv` is the name of the folder, the one most Python projects use.

## Activating it

Before installing packages, **activate** the environment, so that `python` and `pip` in this terminal mean the environment's copies. The command depends on your system:

```text
Windows:          .venv\Scripts\activate
macOS and Linux:  source .venv/bin/activate
```

Once it's active, the prompt usually shows `(.venv)` at the start of the line. Now `python -m pip install requests` installs into `.venv` only, and `python main.py` runs your program with the environment's packages. When you're done, type `deactivate`.

On Windows, PowerShell sometimes refuses to run the activate script with a message about scripts being disabled. The simplest way around it is to skip activation, and call the environment's Python directly: `.venv\Scripts\python -m pip install requests`, then `.venv\Scripts\python main.py`.

Your code editor can do all of this for you. In VS Code with the Python extension, choose **Python: Select Interpreter** from the command palette and pick the one inside `.venv`. Its terminal and Run button will use the environment automatically.

## Sharing your project: `requirements.txt`

A virtual environment is a folder of installed files that are specific to your computer, so you don't share it or commit it to Git (add `.venv/` to your `.gitignore`). Instead, you share a *list* of what to install, in a file called `requirements.txt`.

Create it from what's installed in the active environment:

```text
python -m pip freeze > requirements.txt
```

That writes one line per package, with its exact version, like `requests==2.32.3`. Anyone who downloads your project creates their own `.venv`, activates it, and installs everything in one go:

```text
python -m pip install -r requirements.txt
```

## The whole routine

Here's the full routine for starting a new project, all in the project's folder:

```text
python -m venv .venv
.venv\Scripts\activate            (or: source .venv/bin/activate)
python -m pip install requests
python -m pip freeze > requirements.txt
python main.py
```

It feels like a lot the first time. After a few projects, it takes about ten seconds.

## Try it

This program checks its own setup: whether it's running inside a virtual environment, and whether the `requests` package is installed. Predict what it prints on a fresh Python install, run from a normal terminal with no virtual environment active and nothing extra installed.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="340px"
	:model-value="'import sys\nimport importlib.util\n\nin_venv = sys.prefix != sys.base_prefix\nprint(&quot;Inside a virtual environment?&quot;, in_venv)\n\nfor package in [&quot;json&quot;, &quot;math&quot;, &quot;requests&quot;]:\n    found = importlib.util.find_spec(package) is not None\n    status = &quot;available&quot; if found else &quot;not installed&quot;\n    print(f&quot;{package}: {status}&quot;)\n\nif importlib.util.find_spec(&quot;requests&quot;) is None:\n    print(&quot;Tip: python -m pip install requests&quot;)\n'"
/>

`sys.prefix` is where the running Python keeps its packages, and `sys.base_prefix` is where the main Python lives. Inside a virtual environment, they're different. `importlib.util.find_spec` looks for a module without importing it, and gives back `None` if it can't find one.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon, and this lesson is about your own computer's setup anyway. Save this as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux), then try it again inside a virtual environment.
:::

::: details Check your prediction
```text
Inside a virtual environment? False
json: available
math: available
requests: not installed
Tip: python -m pip install requests
```

`json` and `math` are in the standard library, so they're always available. `requests` is an extra package from PyPI, so a fresh Python doesn't have it. Now create and activate a virtual environment, install `requests` in it, and run the program again: the first line and the `requests` line both change.
:::

## Try it yourself

1. Make a new folder, create a virtual environment in it, and activate it. Check that the prompt changes.
2. Install `requests` inside it, then run the program above again. What changed?
3. Create a `requirements.txt` with `pip freeze`, open it in your editor, and look at what's inside. How many packages are listed, even though you only installed one?

## Check your understanding

<Quiz
	question="What is pip?"
	:options="['A Python keyword', 'A standard library module for math', 'Python\'s tool for installing extra packages from PyPI', 'A type of virtual environment']"
	:answer-index="2"
	explanation="pip downloads and installs packages from PyPI, the Python Package Index. Run it as python -m pip."
/>

<Quiz
	question="Why use a virtual environment for each project?"
	:options="['So each project has its own separate packages and versions, without affecting any other project', 'It makes Python run faster', 'Packages cannot be installed without one', 'To hide code from other people']"
	:answer-index="0"
	explanation="A virtual environment keeps a project's packages in its own folder, so projects can need different versions without clashing."
/>

<Quiz
	question="How do you share which packages your project needs?"
	:options="['Send the .venv folder', 'Copy your whole Python installation', 'Tell people to install everything on PyPI', 'Share a requirements.txt made with pip freeze']"
	:answer-index="3"
	explanation="requirements.txt lists each package and version. Others install them with pip install -r requirements.txt into their own environment."
/>

## Up next

You've now seen almost everything this track covers. Before the final project, one last lesson collects the habits that make Python code easy to read and hard to break: [Best Practices and Common Mistakes](/lessons/python/best-practices).
