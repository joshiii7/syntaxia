---
title: "Python Modules and import: Use the Standard Library"
description: "Use Python's built-in modules like math and random with import, choose between import and from ... import, and split your own code into several files."
---

# Modules and import

*You don't build every tool in your house yourself. Some you buy, some you borrow from a neighbor, and you keep them in labeled drawers.*

You now know how to write your own functions. But you don't have to write *everything* yourself. Python comes with hundreds of ready-made tools for common jobs: square roots, random numbers, dates and times, reading files, and much more. They're organized into **modules**, and you bring one into your program with **`import`**.

## A toolbox with labeled drawers

Imagine a big workshop toolbox with labeled drawers: one says **Measuring**, another **Cutting**, another **Fastening**. When you need a tape measure, you don't dump out the whole box; you open the Measuring drawer.

Python's collection of built-in modules is called the **standard library**, and it's that toolbox. Each module is a drawer, full of related functions and values: `math` for math, `random` for random choices, `datetime` for dates. Python programmers like to say the language comes "with batteries included," because so much is already in the box.

## `import`: opening a drawer

To use a module, import it at the top of your file, then use its tools with a dot, `module.tool`:

```python
import math

print(math.sqrt(144))
print(math.pi)
print(math.ceil(4.2))
print(math.floor(4.8))
```

```text
12.0
3.141592653589793
5
4
```

- `math.sqrt` is the square root function.
- `math.pi` isn't a function; it's a value stored in the module.
- `math.ceil` rounds **up** to the next whole number, and `math.floor` rounds **down**.

The `math.` in front says exactly which drawer each tool came from. Anyone reading your code can tell `sqrt` belongs to `math`, not to something you wrote.

Put your `import` lines at the very top of the file. That way, anyone reading it can see right away which tools the program depends on.

## Random choices: `random`

The `random` module picks things by chance, which is perfect for games and simulations:

```python
import random

roll = random.randint(1, 6)
print("You rolled a", roll)

snack = random.choice(["apple", "banana", "mango"])
print("Today's snack:", snack)
```

`random.randint(1, 6)` gives a random whole number from 1 to 6, **including** both ends. (That's different from `range`, which stops before the end.) `random.choice` picks one item from a list. Because the results are random, this code prints something different each time you run it, which is why there's no output shown here to predict.

## `from ... import`: taking out just one tool

If you only need one or two tools, you can take them out of the drawer by name. Then you use them without the module name in front:

```python
from math import sqrt, pi

print(sqrt(81))
print(round(pi, 2))
```

```text
9.0
3.14
```

Shorter to type, but you lose the label: a reader has to scroll up to find out where `sqrt` came from. A good rule of thumb is to use `import math` by default, and `from math import sqrt` only when you use a tool many times and its name is obvious.

Avoid `from math import *`, which dumps every tool in the drawer into your program at once. It works, but it can quietly replace names you already had, and nobody can tell where anything came from.

## Nicknames: `as`

Some module names are long. You can give a module a shorter nickname with `as`:

```python
import datetime as dt

new_year = dt.date(2027, 1, 1)
print(new_year)
print(new_year.year)
```

```text
2027-01-01
2027
```

Some nicknames are so common that everyone uses them. When you move on to data science, you'll see `import numpy as np` and `import pandas as pd` in almost every program.

## Your own modules

Any `.py` file is a module, including your own. As programs grow, you can move related functions into a separate file and import them. Say you save these functions in a file called `grades.py`:

```python
# grades.py
PASSING_SCORE = 75

def average(scores):
    return sum(scores) / len(scores)

def letter_grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    return "F"
```

Then, in `main.py` **in the same folder**, you can import it just like `math`:

```python
# main.py
import grades

avg = grades.average([88, 94, 83])
print(f"Average: {avg:.1f}")
print("Grade:", grades.letter_grade(avg))
print("Passing score:", grades.PASSING_SCORE)
```

Running `python main.py` prints:

```text
Average: 88.3
Grade: B
Passing score: 75
```

The module's name is the file name without `.py`. (`sum` adds up all the numbers in a list; you'll use it a lot in [Lists](/lessons/python/lists).)

Splitting code into modules keeps each file focused on one job, and lets several programs share the same functions. It's how every large Python project is organized.

One warning: don't name your own file after a module you want to use. A file called `random.py` in your folder gets imported *instead of* Python's `random` module, and your program suddenly can't find `randint`.

## `if __name__ == "__main__":`

You'll see this line at the bottom of lots of Python files, so here's what it means:

```python
def main():
    print("Running the program!")

if __name__ == "__main__":
    main()
```

```text
Running the program!
```

Every module has a built-in variable called `__name__`. When you run a file directly, like `python grades.py`, its `__name__` is `"__main__"`. When the file is *imported* by another file, its `__name__` is its module name, like `"grades"`.

So that `if` means: "only run this when the file is being run directly, not when it's imported." It lets a file work both as a program you can run and as a module other files can import, without running its program part by surprise.

## Try it

This program uses three modules from the standard library to help plan a school garden. Predict every line. (Hint: none of these tools are random.)

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="360px"
	:model-value="'import math\nfrom datetime import date\nimport string as text_tools\n\nbed_area = 18.5\nseeds_per_square_meter = 12\npacket_size = 50\n\nseeds_needed = bed_area * seeds_per_square_meter\npackets = math.ceil(seeds_needed / packet_size)\nprint(f&quot;Seeds needed: {seeds_needed:.0f}&quot;)\nprint(f&quot;Packets to buy: {packets}&quot;)\n\nside = math.sqrt(bed_area)\nprint(f&quot;A square bed would be {side:.2f} meters on each side&quot;)\n\nplanting_day = date(2026, 10, 5)\nprint(&quot;Planting day:&quot;, planting_day)\nprint(&quot;Month number:&quot;, planting_day.month)\n\nprint(&quot;First five letters:&quot;, text_tools.ascii_uppercase[:5])\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Seeds needed: 222
Packets to buy: 5
A square bed would be 4.30 meters on each side
Planting day: 2026-10-05
Month number: 10
First five letters: ABCDE
```

222 seeds need 4.44 packets, and you can't buy part of a packet, so `math.ceil` rounds up to 5. `date(2026, 10, 5)` prints in year-month-day order. And `string.ascii_uppercase` is a ready-made string of the whole alphabet in capitals, sliced to its first five letters.
:::

## Try it yourself

1. Use `random.randint` to simulate rolling two dice, and print both rolls and their total. Run it a few times.
2. Use `math.floor` and `math.ceil` on `-2.5`. Predict both answers first. Do they match what you expected?
3. Create a file called `helpers.py` with a function `shout(text)` that returns the text in capitals with `!` on the end. Import it into `main.py` and use it.

## Check your understanding

<Quiz
	question="After import math, how do you call the square root function?"
	:options="['sqrt(16)', 'math.sqrt(16)', 'import.sqrt(16)', 'math(sqrt, 16)']"
	:answer-index="1"
	explanation="With import math, you use the module name, a dot, and the tool: math.sqrt(16). Only from math import sqrt lets you write sqrt(16) on its own."
/>

<Quiz
	question="What range of numbers can random.randint(1, 6) give?"
	:options="['0 to 5', '1 to 5', '1 to 6, including both', '0 to 6']"
	:answer-index="2"
	explanation="randint includes both ends, unlike range, which stops before the end."
/>

<Quiz
	question="What does if __name__ == &quot;__main__&quot;: do?"
	:options="['Runs the code below it only when the file is run directly, not when it is imported', 'Makes the file run faster', 'Imports the main module', 'Checks whether the file has a function called main']"
	:answer-index="0"
	explanation="__name__ is &quot;__main__&quot; only for the file you ran directly. When the file is imported, its __name__ is the module name."
/>

## Up next

That completes the Functions and Modules chapter. So far, most of your variables have held one value each. Next, you'll store whole collections under one name, starting with Python's most-used data structure: [Lists](/lessons/python/lists).
