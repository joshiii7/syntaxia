---
title: "Python Functions: Write Reusable Blocks of Code with def"
description: "Organize Python programs into functions: define them with def, call them, give back results with return, and learn the difference between printing and returning."
---

# Writing Functions

*A recipe card has a name at the top and steps underneath. Once it's written, "make pancakes" is all anyone needs to say.*

Your programs are getting longer, and some chunks keep showing up again and again: printing a divider, working out an average, turning a score into a letter grade. When you copy the same lines to three places and then find a mistake in them, you have to fix it three times, and it's easy to miss one.

**Functions** fix this. A function is a named block of code that you write once and run whenever you want, just by using its name.

## Recipe cards

Picture a family recipe box. Each card has a name, like "Grandma's Pancakes," and the steps underneath. When someone says "let's make Grandma's Pancakes," nobody needs to recite the steps. The name is enough, because the steps are written down once, on the card.

A function is a recipe card for your program:

- **Defining** a function writes the card: its name and its steps.
- **Calling** a function says its name, and Python follows the steps.

You've been calling functions since your first program. `print()`, `len()`, `input()`, and `int()` are all functions someone else wrote. Now you'll write your own.

## Your first function

```python
def print_divider():
    print("====================")

print_divider()
print("Report Card")
print_divider()
```

```text
====================
Report Card
====================
```

The definition, piece by piece:

- `def` (short for "define") says "here comes a new function."
- `print_divider` is its name, in snake_case like variables. Functions **do** things, so name them with a verb: `print_divider`, `calculate_average`, `get_letter_grade`.
- The **parentheses** `()` are required, even when empty.
- A colon and an indented block, like `if` and `for`. The indented lines are the function's steps, called its **body**.

Defining a function doesn't run it. It just writes the recipe card. The body runs each time the function is **called**, by writing its name followed by parentheses: `print_divider()`.

Now, if you want a longer divider, you change one line, and every divider in the program updates.

## What happens during a call

When Python reaches a function call, it pauses where it is, jumps into the function, runs its body from top to bottom, and then comes back to exactly where it left off:

```python
def say_hello():
    print("2. Inside say_hello")

print("1. Before the call")
say_hello()
print("3. Back after the call")
```

```text
1. Before the call
2. Inside say_hello
3. Back after the call
```

It's like putting a bookmark in a novel to go look something up in a dictionary. You come back to the bookmark afterward.

## Define before you call

Python runs your file from top to bottom, so a function has to be defined *before* the line that calls it runs:

```python
greet()  # error: NameError: name 'greet' is not defined

def greet():
    print("Hello!")
```

When Python reaches `greet()`, it hasn't seen the `def` yet. The usual layout is to put all your function definitions at the top of the file, and the code that uses them at the bottom.

## Giving a function information

A function that always does the same thing is useful, but one you can customize is much more useful. Put a **parameter** inside the parentheses, and the caller can hand the function a value:

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Maria")
greet("Ben")
```

```text
Hello, Maria!
Hello, Ben!
```

`name` works like a variable that gets its value from whoever calls the function. [Parameters and Return Values](/lessons/python/parameters) goes much deeper, including functions with several parameters.

## Getting a result back: `return`

Some functions should work something out and hand the answer back, the way `len("hello")` hands back `5`. For that, use **`return`**:

```python
def average(a, b, c):
    return (a + b + c) / 3

result = average(88, 94, 83)
print(result)
print(f"{average(90, 80, 70):.1f}")
```

```text
88.33333333333333
80.0
```

`return` does two things: it hands a value back to the caller, and it ends the function immediately. The call `average(88, 94, 83)` is then replaced by the answer, so you can store it, print it, or use it in a bigger expression.

## `print` is not `return`

This is the difference beginners most often mix up. Compare these two functions:

```python
def show_double(n):
    print(n * 2)

def double(n):
    return n * 2

answer1 = show_double(5)
answer2 = double(5)
print("answer1 is", answer1)
print("answer2 is", answer2)
```

```text
10
answer1 is None
answer2 is 10
```

`show_double` *shows* 10 on the screen, but hands nothing back. A function without a `return` gives back `None`, the "nothing here" value from [Numbers, Strings, and Booleans](/lessons/python/data-types). So `answer1` is `None`. `double` doesn't print anything; it hands the 10 back, where the rest of your program can use it.

A good rule of thumb: **return results, and let the caller decide whether to print them.** A function that returns an average can be printed, stored, compared, or passed into another function. A function that only prints it can't be used any other way.

## Describing a function: docstrings

A string on the first line of a function's body is its **docstring**: a short description of what it does. Python keeps it, and code editors show it when you hover over the function's name:

```python
def letter_grade(score):
    """Turn a score from 0 to 100 into a letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    return "F"

print(letter_grade(84))
```

```text
B
```

Notice there's no `else` before the last `return`. If any condition had matched, its `return` would already have ended the function, so reaching the last line means none of them did.

## Why bother?

Splitting a program into functions pays off quickly:

- **Less repetition.** Write it once, call it everywhere, fix bugs in one place.
- **Readable code.** `print_report_card(student)` tells you what's happening without making you read 20 lines.
- **Easier testing.** You can check that `average` works on its own, in the interactive shell, before using it everywhere.

A good function does **one** job, and its name says what that job is. If you struggle to name a function without using "and," it's probably doing two jobs and wants to be split in two.

## Try it

This program prints a report card using four small functions. Follow each call into its function and back out, and predict the output.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="500px"
	:model-value="'def print_divider():\n    print(&quot;-&quot; * 24)\n\n\ndef print_header(student_name):\n    print_divider()\n    print(f&quot;Report card: {student_name}&quot;)\n    print_divider()\n\n\ndef average(a, b, c):\n    return (a + b + c) / 3\n\n\ndef letter_grade(score):\n    &quot;&quot;&quot;Turn a score from 0 to 100 into a letter grade.&quot;&quot;&quot;\n    if score &gt;= 90:\n        return &quot;A&quot;\n    elif score &gt;= 80:\n        return &quot;B&quot;\n    elif score &gt;= 70:\n        return &quot;C&quot;\n    return &quot;F&quot;\n\n\nprint_header(&quot;Maria Santos&quot;)\navg = average(88, 94, 83)\nprint(f&quot;Average: {avg:.1f}&quot;)\nprint(&quot;Letter grade:&quot;, letter_grade(avg))\nprint(&quot;Passed?&quot;, avg &gt;= 75)\nprint_divider()\n'"
/>

Two blank lines between function definitions is the standard Python style: it makes each recipe card easy to spot.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
------------------------
Report card: Maria Santos
------------------------
Average: 88.3
Letter grade: B
Passed? True
------------------------
```

`print_header` calls `print_divider` itself, twice: functions can call other functions. `letter_grade` returns as soon as one condition matches, so `return "F"` only runs when none of them did. None of the functions run until the calls at the bottom.
:::

## Try it yourself

1. Change the divider to use `=` signs. How many lines did you need to change to update all four dividers?
2. Write a function `print_stars(count)` that prints `count` stars on one line. Call it with 5, then with 10.
3. Write a function `is_honor_roll(average)` that returns `True` for averages of 90 or above, and use it to print an extra line for honor roll students.

## Check your understanding

<Quiz
	question="What keyword starts a function definition in Python?"
	:options="['function', 'def', 'func', 'define']"
	:answer-index="1"
	explanation="def, short for define, starts every Python function, followed by its name, parentheses, and a colon."
/>

<Quiz
	question="A function has no return statement. What does calling it give back?"
	:options="['0', 'An empty string', 'An error', 'None']"
	:answer-index="3"
	explanation="Every Python function gives back something. Without a return, it's None."
/>

<Quiz
	question="What two things does return do?"
	:options="['Hands a value back to the caller and ends the function', 'Prints a value and ends the program', 'Restarts the function and saves a value', 'Creates a variable and prints it']"
	:answer-index="0"
	explanation="return sends the value back to wherever the function was called, and the function stops right there."
/>

## Up next

You've seen functions that take in values and hand results back. Next, you'll look at both ends closely: several parameters at once, what happens to a value you pass in, and how to design a function's inputs and outputs well, in [Parameters and Return Values](/lessons/python/parameters).
