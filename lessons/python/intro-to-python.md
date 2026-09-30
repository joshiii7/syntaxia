---
title: "What Is Python? An Introduction to Python for Beginners"
description: "Find out what Python is, where it came from, and where it's used today, from websites to AI to science labs, and why it's such a friendly first language."
---

# What Python Is and Why It's Used

*Some languages read like instructions for a machine. Python reads almost like instructions for a person.*

Welcome to the Python track. If you've worked through [HTML](/lessons/html/introduction), [CSS](/lessons/css/intro-to-css), or [JavaScript](/lessons/javascript/intro-to-javascript) on this site, you've been building things that live inside a web browser. Python lives mostly outside the browser. It's a **general-purpose** language: people use it to build websites, analyze data, train artificial intelligence, automate boring tasks, control robots, and much more.

If this is your very first programming language, that's perfect. Python is famous for being one of the easiest languages to start with, and this track starts from zero.

## A recipe written in plain words

Imagine two recipes for the same cake. One is written in dense professional shorthand: "Crm btr & sgr, add 3 egg, fold 250g flr." The other says: "Beat the butter and sugar together. Add three eggs. Gently fold in the flour."

Both work. But the second one, you can read out loud and understand the first time.

Python was designed to be the second recipe. Here's a tiny Python program:

```python
temperature = 31

if temperature > 30:
    print("It's hot today. Bring water!")
else:
    print("Nice weather for a walk.")
```

```text
It's hot today. Bring water!
```

Even if you've never programmed before, you can probably guess what it does. There are no semicolons, and no curly braces. The indented lines belong to the line above them, just like the steps under a heading in a recipe.

## Where Python came from

Python was created by a Dutch programmer named **Guido van Rossum**, who started it as a hobby project over a Christmas holiday in 1989. The first version was released in **1991**.

The name has nothing to do with snakes. Van Rossum was a fan of a British comedy show called *Monty Python's Flying Circus*, and he wanted a name that was short, unique, and a little bit fun. (The snake logo came later.)

Today, Python is developed by a large open-source community, led by the Python Software Foundation. It's free to download and use, for anything.

## Python 3, not Python 2

You may see old tutorials that use **Python 2**. It was retired in 2020 and no longer gets updates or security fixes. Everything on Syntaxia uses **Python 3**, the version everyone uses today. If you find old code with `print "hello"` (no parentheses), that's Python 2, and it won't run in Python 3.

A new version of Python 3 comes out every year, numbered 3.12, 3.13, 3.14, and so on. The changes between them are small. Anything from the last few years will work for this whole track.

## Where you'll find Python today

Python is one of the most widely used programming languages in the world. Some places it runs:

- **Artificial intelligence and data science.** Most machine learning and data analysis is done in Python, using libraries like NumPy, pandas, and PyTorch.
- **Websites and web apps.** The server side of many websites is written in Python with frameworks like [Django](/lessons/django/introduction) and Flask.
- **Science and research.** Astronomers, biologists, and economists use Python to crunch numbers and draw charts.
- **Automation.** Renaming a thousand files, filling in spreadsheets, or checking a website every morning: Python is the go-to tool for "make the computer do this boring job for me."
- **Education and hobby projects.** Python is taught in many schools and universities, and it runs on the Raspberry Pi, a tiny, cheap computer used for robotics and electronics projects.

## Why learn Python first?

- **It's easy to read.** The code looks close to plain English, so you spend your energy on ideas, not punctuation.
- **It's quick to try things.** You can type one line and see the result immediately, with no setup around it. You'll see how in [How Python Runs](/lessons/python/how-python-runs).
- **It's forgiving in the right ways.** You don't have to declare types or write long setup code before your program does anything.
- **It's genuinely useful.** The same language you learn here is used by professional developers, scientists, and AI researchers every day.

The trade-off: Python is slower than languages like Java or C for heavy number-crunching work, and it catches some mistakes only when a line actually runs, instead of before the program starts. For learning, and for the vast majority of real-world jobs, neither of those matters much.

If you've taken the [Java track](/lessons/java/introduction), you'll notice the difference right away. The Java "Hello, world!" program needed a class and a `main` method. In Python, it's one line.

## Try it

Here's a complete Python program. You don't need to understand every word yet. Read it, and predict what it prints before you open the answer.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="220px"
	:model-value="'print(&quot;Hello from Python!&quot;)\nprint(&quot;This program has three lines.&quot;)\nprint(&quot;Each one prints one line of text.&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. In the next lesson, [Setting Up](/lessons/python/setting-up), you'll install Python on your own computer so you can run programs like this one yourself.
:::

::: details Check your prediction
```text
Hello from Python!
This program has three lines.
Each one prints one line of text.
```
:::

## Try it yourself

1. Change `"Hello from Python!"` to a greeting with your own name in it. What would the program print now?
2. Add a fourth line that prints the name of your school. Copy the shape of the lines above it exactly, including the parentheses and the quotes.
3. Look back at the weather program near the top of this lesson. What do you think it would print if `temperature` were `25`? Write down your guess.

## Check your understanding

<Quiz
	question="Where does the name Python come from?"
	:options="['A type of snake', 'A British comedy show', 'The initials of its creator', 'A Greek word for code']"
	:answer-index="1"
	explanation="Guido van Rossum named it after Monty Python's Flying Circus. The snake logo came later."
/>

<Quiz
	question="Which version of Python should you use for this track?"
	:options="['Python 1', 'Python 2', 'Python 3', 'Any version, they are all the same']"
	:answer-index="2"
	explanation="Python 2 was retired in 2020. Everything on Syntaxia uses Python 3, which is what everyone uses today."
/>

<Quiz
	question="In the weather program, how does Python know which lines belong to the if?"
	:options="['They are wrapped in curly braces', 'They end with semicolons', 'They are in capital letters', 'They are indented under it']"
	:answer-index="3"
	explanation="Python uses indentation to group lines. The indented lines under if belong to it, and the ones under else belong to else."
/>

## Up next

You know what Python is. Now let's get it onto your computer, in [Setting Up](/lessons/python/setting-up).
