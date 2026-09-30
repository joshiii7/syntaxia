---
title: "How Python Runs: the Interpreter, Scripts, and the Shell"
description: "Learn what happens when you run Python code: how the interpreter works, the difference between running a script and using the interactive shell, and when errors appear."
---

# How Python Runs: Scripts and the Interactive Shell

*Some translators turn a whole book into another language before anyone reads it. Others stand beside a speaker and translate one sentence at a time. Python works like the second one.*

In [Your First Python Program](/lessons/python/first-program), you wrote code, ran it, and saw the output. It felt like one step, and with Python, it nearly is. This lesson looks at what's happening underneath, and shows you a second way to run Python that's perfect for quick experiments.

## The interpreter

The program you installed in [Setting Up](/lessons/python/setting-up) is called the **Python interpreter**. Its job is to read your code and carry it out.

Picture a live interpreter at a conference. A speaker says a sentence, and the interpreter immediately says it in another language. Then the next sentence, and the next. Nobody waits for the whole speech to be translated first.

Python's interpreter works in a similar way. When you run a program, it:

1. **Reads** your whole file and checks that it's written correctly: every quote closed, every parenthesis matched, every indent sensible. If something is badly written, it stops right there with a `SyntaxError`, before running anything.
2. **Runs** your code from top to bottom, one statement at a time.

There's no separate "compile first" step for you to do, the way there is with `javac` in the [Java track](/lessons/java/how-java-runs). (Behind the scenes, Python does quietly translate your code into a simpler form called **bytecode** before running it, which is why you'll sometimes see a folder called `__pycache__` appear next to your files. You can ignore it; Python manages it for you.)

## Two kinds of errors, two different moments

Because of those two steps, mistakes show up at two different times:

- **Syntax errors** are found in step 1, while Python reads the file. Nothing runs at all, not even the lines before the mistake.
- **Runtime errors** happen in step 2, when Python reaches a line that can't be carried out. Every line *before* it has already run, and its output is already on the screen. Then the program stops.

Here's a runtime error in action:

```python
print("Starting...")
print(10 / 0)  # error: ZeroDivisionError: division by zero
print("This line never runs.")
```

The first line prints normally. The second line fails, because nothing can be divided by zero, and the program stops there. The third line never gets a chance.

When a program stops with a runtime error, Python prints a **traceback**: a report showing where it was and what went wrong. You'll see a full one in the Try it section below, and learn to read them properly in [Debugging Python Programs](/lessons/python/debugging).

## Way 1: running a script

Everything you've done so far has been a **script**: a file ending in `.py`, run from a terminal:

```text
python main.py
```

(On macOS and Linux, type `python3 main.py`.) Python runs the whole file, top to bottom, then exits. When you press **Run** in your code editor, it's doing exactly this for you.

Scripts are how you'll write almost every real program: the code lives in a file, so you can save it, change it, and run it again tomorrow.

## Way 2: the interactive shell

Now try typing just `python` (or `python3`) in a terminal, with no file name:

```text
python
```

You'll see a welcome message and a new prompt:

```text
>>>
```

This is the **interactive shell**, sometimes called the **REPL**: it **R**eads what you type, **E**valuates it, **P**rints the result, and **L**oops back for more. Type a line of Python, press Enter, and it runs immediately:

```text
>>> 2 + 3
5
>>> "hello".upper()
'HELLO'
>>> print("Hi!")
Hi!
```

Notice something handy: in the shell, you don't need `print` to see a value. Type an expression like `2 + 3`, and the shell shows you the answer. (Strings are shown with quotes around them, like `'HELLO'`, so you can tell them apart from numbers.) In a script, only `print` shows anything.

The shell is a scratchpad. Use it to try out a line you're not sure about, check what a function does, or use Python as a very clever calculator. It's one of the best learning tools Python has.

When you're done, type `exit()` and press Enter to get back to the normal terminal.

## Which one should you use?

Both, for different jobs:

| | Script (`python main.py`) | Shell (`>>>`) |
|---|---|---|
| Good for | real programs you'll keep | quick experiments |
| Saved? | yes, in a `.py` file | no, it's gone when you exit |
| Shows values | only with `print` | automatically |

A common habit: write your program in a script, and keep a shell open on the side to test small pieces before adding them.

## Try it

This script is valid Python, so Python reads it without complaint. But something goes wrong when it runs. Predict the output line by line, and decide where the program stops.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="260px"
	:model-value="'print(&quot;Splitting 12 cookies among friends...&quot;)\n\ncookies = 12\nfriends = 0\n\nprint(&quot;Each friend gets:&quot;)\nprint(cookies / friends)\n\nprint(&quot;Enjoy your cookies!&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Splitting 12 cookies among friends...
Each friend gets:
Traceback (most recent call last):
  File "C:\Users\maria\python-practice\main.py", line 7, in <module>
    print(cookies / friends)
          ~~~~~~~~^~~~~~~~~
ZeroDivisionError: division by zero
```

The first two `print` lines run normally. Line 7 divides by zero, so Python stops with a `ZeroDivisionError` and prints a traceback. It names the file (with the full path to wherever *your* `main.py` is saved) and the line number, shows the line itself, and underlines the part that failed. The last line, `Enjoy your cookies!`, never runs.
:::

## Try it yourself

1. Change `friends = 0` to `friends = 3` and predict the output. How many cookies does each friend get?
2. Open the interactive shell and type `12 / 5`, then `12 // 5`, then `12 % 5`. Write down each answer. You'll find out what they mean in [Operators and Expressions](/lessons/python/operators).
3. Remove the closing parenthesis from the first `print` line and run the script. This time, is *anything* printed before the error? Why is that different from the division error?

## Check your understanding

<Quiz
	question="A script has a SyntaxError on line 10. What happens to lines 1 to 9?"
	:options="['They run, then the program stops at line 10', 'Nothing runs, because Python checks the whole file before running it', 'Python skips line 10 and runs everything else', 'Python fixes line 10 automatically']"
	:answer-index="1"
	explanation="Python reads and checks the whole file first. A syntax error stops everything before a single line runs."
/>

<Quiz
	question="In the interactive shell, you type 2 + 3 and press Enter. What happens?"
	:options="['Nothing, you need print', 'An error', 'The shell shows 5', 'The shell saves it to a file']"
	:answer-index="2"
	explanation="The shell evaluates what you type and shows the result automatically. In a script, you would need print."
/>

<Quiz
	question="A script prints two lines, then line 3 divides by zero. What does the user see?"
	:options="['Only the error', 'Nothing at all', 'All the lines, and the error at the end', 'The first two lines, then a traceback for line 3']"
	:answer-index="3"
	explanation="Runtime errors happen when the line runs. Everything before it has already printed, then the program stops with a traceback."
/>

## Up next

That's the Getting Started chapter done. Your programs can print, and you know how they run. Now it's time to give them a memory, in [Variables and Naming](/lessons/python/variables).
