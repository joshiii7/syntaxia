---
title: "Your First Python Program: print() and Hello, World! Explained"
description: "Write and run your first Python program, learn how print() and strings work, add comments, and recognize the first error messages every beginner meets."
---

# Your First Python Program

*One line, and it works. That's the whole setup.*

In [Setting Up](/lessons/python/setting-up), you installed Python and a code editor. Now let's write a program from scratch and understand every character in it.

Here's the most famous first program in any language, written in Python:

```python
print("Hello, world!")
```

```text
Hello, world!
```

That's it. No setup lines, no wrapper around it. If you took the [Java track](/lessons/java/first-program), you'll remember that Java needed a class and a `main` method just to print one line. Python lets you get straight to the point.

## Asking Python to say something

Think of `print` as a messenger standing by the door. You hand the messenger a note, and they read it out loud, then step back and wait for the next note.

```python
print("Hello, world!")
```

- `print` is the messenger's name. It's a **function**: a named action Python already knows how to do.
- The **parentheses** `( )` are how you hand something to a function. Whatever goes inside is what you're giving it.
- `"Hello, world!"` is the note. Text in quotes is called a **string**.

Every call to `print` prints its text, then moves down to a new line. So a program with three `print` lines prints three lines, in order, from top to bottom:

```python
print("Line one")
print("Line two")
print("Line three")
```

```text
Line one
Line two
Line three
```

## Single or double quotes

Python accepts strings in either kind of quotes, as long as the start and end match:

```python
print("Hello")
print('Hello')
```

```text
Hello
Hello
```

Both do exactly the same thing. That choice comes in handy when your text contains a quote mark itself:

```python
print("It's a sunny day.")
print('She said "hi" to me.')
```

```text
It's a sunny day.
She said "hi" to me.
```

The apostrophe in `It's` is fine inside double quotes, and the double quotes around `"hi"` are fine inside single quotes. Pick one style for most of your code (this track uses double quotes), and switch only when the text needs it.

## Special characters: the backslash

What if a string needs both kinds of quotes, or a line break in the middle? Put a **backslash** `\` in front of a special character:

```python
print("She said \"hi\" and left.")
print("First line\nSecond line")
```

```text
She said "hi" and left.
First line
Second line
```

`\"` means "a real quote mark, not the end of the string." `\n` means "start a new line here." These pairs are called **escape sequences**.

## Printing several things at once

You can hand `print` several things, separated by commas. It prints them all on one line with a space between each:

```python
print("Maria", "is", 17)
```

```text
Maria is 17
```

Notice that `17` has no quotes. It's a number, not text, and `print` handles both. You'll learn all about numbers in [Numbers, Strings, and Booleans](/lessons/python/data-types).

`print` also has two optional settings. `sep` changes what goes *between* the items, and `end` changes what goes at the *end* instead of a new line:

```python
print("2026", "09", "29", sep="-")
print("Loading", end="...")
print("done!")
```

```text
2026-09-29
Loading...done!
```

Because the second `print` ended with `...` instead of a new line, the third one continued on the same line.

## Comments

A `#` starts a **comment**. Python ignores everything from the `#` to the end of the line:

```python
# This program greets the class.
print("Good morning, class!")  # printed first
```

```text
Good morning, class!
```

Use comments to explain *why* your code does something, not to repeat what it obviously does. `# greet the class` above a greeting doesn't help anyone. `# the principal asked for a morning greeting on every report` might.

## The mistakes everyone makes

Python is friendly, but it's also exact. Here are the errors almost every beginner hits in their first week, and what they mean.

**A missing closing quote.**

```python
print("Hello, world!)  # error: SyntaxError: unterminated string literal
```

Python reached the end of the line while still inside a string. Add the missing `"`.

**A missing closing parenthesis.**

```python
print("Hello, world!"  # error: SyntaxError: '(' was never closed
```

Every `(` needs a matching `)`.

**A capital P.**

```python
Print("Hello, world!")  # error: NameError: name 'Print' is not defined
```

Python is case-sensitive. `print` is a function; `Print` is just a name nobody created. Python even suggests the fix: `Did you mean: 'print'?`

**A space at the start of the line.**

```python
 print("Hello, world!")  # error: IndentationError: unexpected indent
```

In Python, spaces at the start of a line mean something: they show which lines belong together. You'll use that on purpose in [Making Decisions](/lessons/python/if-elif-else). A line that's indented for no reason is an error.

When you see an error, read it from the **bottom**. The last line says what kind of problem it is, and the lines just above it show the line number and a little `^` or `~` pointing at the exact spot.

## Try it

This program prints a small student ID card. Predict exactly what it prints, including where each line breaks, before you check.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="280px"
	:model-value="'# A tiny school ID card.\nprint(&quot;=== STUDENT ID ===&quot;)\nprint(&quot;Name:&quot;, &quot;Maria Santos&quot;)\nprint(&quot;Grade:&quot;, 11, sep=&quot; &quot;)\nprint(&quot;Motto: \\&quot;Measure twice, cut once.\\&quot;&quot;)\nprint(&quot;Clubs:&quot;, end=&quot; &quot;)\nprint(&quot;Chess&quot;, &quot;Robotics&quot;, sep=&quot; &amp; &quot;)\nprint(&quot;==================&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
=== STUDENT ID ===
Name: Maria Santos
Grade: 11
Motto: "Measure twice, cut once."
Clubs: Chess & Robotics
==================
```

`sep=" "` on the Grade line changes nothing, because a space is already the default. The Clubs line ends with a space instead of a new line, so the next `print` continues right after it, joining its two items with `" & "`.
:::

## Try it yourself

1. Change the name and grade to your own, and add a line that prints your favorite subject.
2. Print today's date with the parts separated by slashes, like `29/09/2026`, using a single `print` call with three items and `sep`.
3. Delete the closing quote on any line and run the program on your computer. Read the error from the bottom up: which line does it point to? Then put the quote back.

## Check your understanding

<Quiz
	question="What does print(&quot;A&quot;, &quot;B&quot;, &quot;C&quot;) print?"
	:options="['ABC', 'A B C', 'A, B, C', 'An error']"
	:answer-index="1"
	explanation="print puts one space between each item by default. Use sep to change it, like sep=&quot;&quot; for no space."
/>

<Quiz
	question="Which line prints the text It's done. correctly?"
	:options="['print(\'It\'s done.\')', 'print(It\'s done.)', 'print(&quot;It\'s done.&quot;)', 'Print(&quot;It\'s done.&quot;)']"
	:answer-index="2"
	explanation="Double quotes around the string let the apostrophe inside it be an ordinary character. The first option ends the string at the apostrophe, and Print with a capital P doesn't exist."
/>

<Quiz
	question="Python shows an error. Where should you start reading it?"
	:options="['The last line, which names the kind of problem', 'The first line only', 'Nowhere, just try again', 'The middle']"
	:answer-index="0"
	explanation="The bottom line says what went wrong, like SyntaxError or NameError. The lines above it show where."
/>

## Up next

You've run a Python program. But what actually happens between typing the code and seeing the output, and what's that `>>>` prompt people talk about? That's [How Python Runs](/lessons/python/how-python-runs).
