---
title: "Debugging Python: Read Tracebacks and Fix Bugs Calmly"
description: "Read Python tracebacks from the bottom up, recognize the most common error types, track down logic bugs with print and f-strings, and use a debugger step by step."
---

# Debugging Python Programs

*A good detective doesn't guess. They collect clues, form a theory, and test it.*

Here's something experienced programmers know and beginners often don't: **everyone writes bugs.** Every day. The difference between a beginner and a professional isn't that the professional's code works the first time. It's that the professional has a calm, reliable way of finding out *why* it doesn't.

That skill is called **debugging**, and it may be the most useful thing in this track. You've already met plenty of error messages. This lesson turns them from scary walls of text into clues.

## Thinking like a detective

A detective arriving at a scene doesn't point at the first person they see. They look at the evidence, form a theory about what happened, and then test it. If the evidence doesn't fit, they drop the theory and form a new one.

Debugging is the same loop:

1. **Observe.** What exactly happened? What did you expect to happen instead?
2. **Read the clues.** Error messages, line numbers, and the program's actual output.
3. **Form a theory.** "I think `total` is being reset inside the loop."
4. **Test it.** Print the value, or step through the code, and see if you're right.
5. **Fix, then check again.** Make one change, and run the program again.

The biggest mistake is skipping straight to step 5: changing things at random until the error goes away. Sometimes it works, but you learn nothing, and you often create a new bug along the way.

## Three kinds of bugs

- **Syntax errors.** Python can't even read the file, so nothing runs. You met these in [How Python Runs](/lessons/python/how-python-runs). They point straight at the problem line.
- **Runtime errors.** The program starts, then crashes partway through with a **traceback**.
- **Logic errors.** The program runs to the end without complaint, but the answer is wrong. There's no message at all, so you have to notice these yourself. They're the hardest.

## Reading a traceback

When a program crashes, Python prints a **traceback**. Here's a real one, from a program with a bug buried two functions deep:

```python
def average(scores):
    return sum(scores) / len(scores)


def report(name, scores):
    print(f"{name}: {average(scores):.1f}")


report("Maria", [88, 94, 83])
report("Ben", [])
```

```text
Maria: 88.3
Traceback (most recent call last):
  File "C:\Users\maria\python-practice\main.py", line 10, in <module>
    report("Ben", [])
    ~~~~~~^^^^^^^^^^^
  File "C:\Users\maria\python-practice\main.py", line 6, in report
    print(f"{name}: {average(scores):.1f}")
                     ~~~~~~~^^^^^^^^
  File "C:\Users\maria\python-practice\main.py", line 2, in average
    return sum(scores) / len(scores)
           ~~~~~~~~~~~~^~~~~~~~~~~~~
ZeroDivisionError: division by zero
```

It looks like a lot, but it has a simple shape. **Read it from the bottom up:**

1. **The last line** says what went wrong: the kind of error (`ZeroDivisionError`) and a short description (`division by zero`).
2. **The block just above it** is where it happened: line 2, inside the `average` function, on the line shown, with the failing part underlined.
3. **Each block above that** is one step further back in the chain of calls: `average` was called by `report` on line 6, which was called from the main program on line 10.

So the story, told bottom to top: dividing by zero failed in `average`, because `report` passed along Ben's empty list of scores, because line 10 asked for a report on Ben. The crash happened in `average`, but the real cause is back at line 10: Ben has no scores yet. Often the bug isn't in the line that crashed, but in the value that was handed to it.

## Common errors, and what they usually mean

| Error | Usual cause |
|---|---|
| `SyntaxError` | a typo in the code's grammar: a missing `:`, `)`, or quote |
| `IndentationError` | lines in a block don't line up, or a block is missing |
| `NameError` | a misspelled name, or using a variable before it's created |
| `TypeError` | the wrong type for an operation, like `"5" + 3`, or the wrong number of arguments |
| `ValueError` | the right type but an unusable value, like `int("seven")` |
| `IndexError` | a list or string index past the end |
| `KeyError` | a dictionary key that isn't there |
| `AttributeError` | a method or attribute the object doesn't have, like `scores.push(91)` on a list (lists use `append`) |
| `ZeroDivisionError` | dividing by zero, often an empty list's `len()` |

Recent Python versions add helpful hints to many of these, like `Did you mean: 'score'?`, so always read the whole last line.

## Finding logic bugs with `print`

When there's no error message, you have to create your own clues. The oldest and simplest tool is a temporary `print` that shows what the program is really doing. The `=` trick from [Formatting Output with f-strings](/lessons/python/f-strings) is perfect for this:

```python
total = 0
for number in range(1, 6):
    total = number
    print(f"DEBUG {number=} {total=}")
print("Total:", total)
```

```text
DEBUG number=1 total=1
DEBUG number=2 total=2
DEBUG number=3 total=3
DEBUG number=4 total=4
DEBUG number=5 total=5
Total: 5
```

The expected answer was 15, and the debug lines show exactly why it isn't: `total` is being *replaced* on every lap instead of *added to*. The fix is `total += number`.

Some tips for print debugging:

- **Label everything.** `number=3 total=3` is useful. A bare `3` in a wall of output isn't.
- **Print at the edges.** Before and after a loop, at the start of a function (with its arguments), and right before the line that misbehaves.
- **Delete them when you're done.** Starting each with `DEBUG` makes them easy to find.

## Using a debugger

Print statements work everywhere, but your code editor has a more powerful tool built in: a **debugger**. It pauses your program on any line and lets you look around.

The basic moves are the same in VS Code, PyCharm, and most other editors:

1. **Set a breakpoint.** Click in the margin to the left of a line number. A red dot appears. The program will pause just before running that line.
2. **Start in debug mode.** Use the Debug button, often a bug icon next to Run.
3. **Inspect.** While paused, a panel shows every variable and its current value.
4. **Step.** **Step Over** runs the current line and pauses on the next. **Step Into** follows a function call into the function. **Continue** runs until the next breakpoint.

You can also pause from inside your code by adding a line with `breakpoint()`. When Python reaches it, it stops and opens a simple text debugger in the terminal. Type `p total` to print a variable, `n` to run the next line, and `c` to continue. The IDE track covers visual debuggers in [Debugging Basics in an IDE](/lessons/ide/debugging-basics).

## When you're really stuck

- **Explain it out loud.** Walk through the code, line by line, explaining what each line does, to a friend or a rubber duck on your desk. **Rubber duck debugging** works surprisingly often: saying "and then this adds one to... oh" is how many bugs get found.
- **Shrink the problem.** Copy the broken part into a tiny new file, or try it in the interactive shell. The less code there is, the fewer places a bug can hide.
- **Check your assumptions.** The bug is often in the part you were *sure* was fine. Print it anyway.
- **Take a break.** A short walk really does help.
- **Search the exact error message**, minus your own variable names. Someone has almost certainly seen it before.

## Try it

This program is supposed to print each student's average and the class's best average. It runs without crashing, but the output is wrong. There are **two logic bugs**. Predict what it actually prints, and see if you can spot both bugs before you open the answer.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="440px"
	:model-value="'names = [&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;]\nscores = [\n    [90, 85, 95],\n    [70, 80, 75],\n    [88, 92, 96],\n]\n\nbest = 0\nbest_name = &quot;&quot;\n\nfor i in range(len(names)):\n    total = 0\n    for s in range(len(scores[i]) - 1):\n        total += scores[i][s]\n    average = total / len(scores[i])\n    print(f&quot;{names[i]}: {average:.1f}&quot;)\n\n    if average &gt; best:\n        best = average\n        best_name = names[i]\n\nprint(f&quot;Best: {best_name} with {best:.1f}&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria: 58.3
Ben: 50.0
Carlo: 60.0
Best: Carlo with 60.0
```

Maria's real average is 90.0, so something's off. The two bugs:

1. **Off by one:** `range(len(scores[i]) - 1)` skips each student's last score. It should be `range(len(scores[i]))`, or better, `total = sum(scores[i])`.
2. **Dividing by the wrong count:** because of bug 1, only two scores are added, but the total is still divided by three.

Bug 1 causes bug 2, and fixing it fixes both. Adding `print(f"DEBUG {s=} {total=}")` inside the inner loop would show it right away: `s` only ever reaches 1. With the fix, the program prints Maria 90.0, Ben 75.0, Carlo 92.0, and Carlo as the best.
:::

## Try it yourself

1. Fix the bug, then run the program on your computer to confirm the corrected output.
2. Set a breakpoint on the `total += scores[i][s]` line and run in debug mode. Step through the first student and watch `s` and `total` change.
3. Add a fourth student with an empty list of scores, `[]`. Which error do you get, on which line, and how would you change the program to handle it?

## Check your understanding

<Quiz
	question="Where should you start reading a Python traceback?"
	:options="['At the bottom, where the error type and message are', 'At the top line', 'In the middle', 'Anywhere, they are all the same']"
	:answer-index="0"
	explanation="The last line names the error. The block just above it shows where it happened, and each block above that is one step further back in the chain of calls."
/>

<Quiz
	question="int(&quot;seven&quot;) crashes. Which error is it?"
	:options="['TypeError', 'NameError', 'ValueError', 'SyntaxError']"
	:answer-index="2"
	explanation="int accepts strings, so the type is right, but this particular value can't be converted. That's a ValueError."
/>

<Quiz
	question="Your program runs to the end with no errors, but prints the wrong total. What kind of bug is it?"
	:options="['A syntax error', 'A runtime error', 'A bug in Python itself', 'A logic error']"
	:answer-index="3"
	explanation="The code is valid and doesn't crash, but it does the wrong thing. Logic errors give no message; find them with print debugging or a debugger."
/>

## Up next

Some problems aren't bugs at all. A user types letters where you asked for a number, or a file your program needs has been deleted. Your code can't prevent those, but it can handle them gracefully instead of crashing. That's [Exceptions: try, except, and raise](/lessons/python/exceptions).
