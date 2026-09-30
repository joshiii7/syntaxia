---
title: "Python Function Parameters and Return Values Explained"
description: "Pass information into Python functions with parameters, send results back with return, return several values at once, and see what happens to what you pass in."
---

# Parameters and Return Values

*A photocopier has a slot for paper going in and a tray for copies coming out. Know what goes in and what comes out, and you can use it without opening it up.*

In [Writing Functions](/lessons/python/functions), you wrote functions that took a value in and functions that handed a value back. This lesson looks closely at both ends: how to pass several values, what the function actually receives, and how to design a function whose inputs and outputs make sense.

## A machine with a slot and a tray

Think of a function as a machine on a counter. There's a **slot** where you feed things in, and a **tray** where the result comes out.

- The **parameters** are the slot. They say what the machine needs.
- The **return value** is the tray. It says what the machine gives back.

You don't need to know how the machine works inside. As long as you know what goes in and what comes out, you can use it.

## Parameters and arguments

Two words that sound alike and mean slightly different things:

```python
def add(a, b):      # a and b are parameters
    return a + b

total = add(5, 3)   # 5 and 3 are arguments
print(total)
```

```text
8
```

- **Parameters** are the names listed in the function's definition: `a` and `b`.
- **Arguments** are the actual values you pass in when you call it: `5` and `3`.

When the function is called, each argument is matched to its parameter, in order: `a` gets 5, and `b` gets 3. People mix these two words up all the time, and nobody will be confused if you do. But error messages use them precisely, so it helps to know the difference.

## Several parameters

Separate parameters with commas:

```python
def print_score(name, score, max_score):
    print(f"{name}: {score} / {max_score}")

print_score("Maria", 47, 50)
```

```text
Maria: 47 / 50
```

Arguments are matched to parameters **by position**. `"Maria"` goes into `name` because it's first. Mix up the order, and Python quietly uses the wrong values, since it has no way to know:

```python
print_score("Maria", 50, 47)
```

```text
Maria: 50 / 47
```

The number of arguments has to match, too. Leave one out, and Python tells you exactly which:

```python
print_score("Maria", 47)  # error: TypeError: print_score() missing 1 required positional argument: 'max_score'
```

In [Default and Keyword Arguments](/lessons/python/default-and-keyword-arguments), you'll see how to name arguments so their order doesn't matter, and how to make some of them optional.

## Returning several values

Sometimes a function naturally has more than one answer. Dividing up cookies gives you both how many each friend gets *and* how many are left over. Python lets you return several values, separated by commas, and unpack them into several variables in one line:

```python
def share(cookies, friends):
    each = cookies // friends
    left = cookies % friends
    return each, left

per_friend, leftover = share(20, 6)
print(f"{per_friend} each, {leftover} left over")
```

```text
3 each, 2 left over
```

This uses the same trick as `x, y = 3, 4` from [Variables and Naming](/lessons/python/variables). (Behind the scenes, the function returns a **tuple**, which you'll meet in [Tuples](/lessons/python/tuples).)

## What happens to what you pass in?

Here's something that surprises people. What does this print?

```python
def add_bonus(points):
    points = points + 10
    print("Inside the function:", points)

score = 70
add_bonus(score)
print("Outside the function:", score)
```

```text
Inside the function: 80
Outside the function: 70
```

When you call `add_bonus(score)`, the parameter `points` becomes a *second* name tag stuck on the same value, 70. Then `points = points + 10` moves the `points` tag to a brand-new value, 80. The `score` tag outside never moves, so it still says 70.

If you want the change to stick, **return** the new value, and store it:

```python
def add_bonus(points):
    return points + 10

score = 70
score = add_bonus(score)
print(score)
```

```text
80
```

That's the clean, predictable way: data goes in through parameters, and results come out through `return`.

(Later, in [Lists](/lessons/python/lists), you'll see one important twist. A list can be changed *in place*, without moving any name tag, so a function that adds an item to a list you passed in really does change your list. For numbers, strings, and booleans, which can never be changed in place, what you've learned here is the whole story.)

## Leaving early with `return`

Because `return` ends the function immediately, you can use it to leave early. This is called an **early return**, and it often makes code simpler than a deep `if`/`else`:

```python
def letter_grade(score):
    if score < 0 or score > 100:
        return "Invalid"
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    return "C or below"

print(letter_grade(105))
print(letter_grade(84))
```

```text
Invalid
B
```

The invalid case is handled first and gets out of the way, so the rest of the function only deals with good scores.

## Type hints

You'll often see Python functions written like this:

```python
def average(a: float, b: float) -> float:
    return (a + b) / 2

print(average(3, 4))
```

```text
3.5
```

The `: float` after each parameter and the `-> float` after the parentheses are **type hints**. They say what types the function expects and gives back. Python itself doesn't enforce them, but code editors use them to warn you about mistakes, and they make a function's slot and tray easy to see at a glance. You don't need them yet, but now you'll recognize them.

## Designing good functions

- **Take in what you need, nothing more.** A function that calculates an average needs the scores, not the student's name.
- **Return results instead of printing them,** when the caller might want to do something else with the answer.
- **Keep the parameter list short.** Three or four is plenty. If you need seven, some of them probably belong together, maybe in a dictionary or an object.
- **Name parameters clearly.** `line_total(price, quantity)` explains itself. `line_total(p, q)` doesn't.

## Try it

This program runs a small cafeteria checkout. Watch which functions return values, which only print, and what happens to `budget` when it's passed into a function. Predict the output.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="500px"
	:model-value="'def line_total(price, quantity):\n    return price * quantity\n\n\ndef print_line(label, amount):\n    print(f&quot;{label:&lt;10}{amount:&gt;8.2f}&quot;)\n\n\ndef spend(money, cost):\n    money = money - cost\n\n\ndef remaining(money, cost):\n    return money - cost\n\n\ndef split_bill(total, people):\n    each = total // people\n    extra = total % people\n    return each, extra\n\n\nbudget = 200\nlunch = line_total(65, 2)\ndrinks = line_total(20, 3)\ntotal = lunch + drinks\n\nprint_line(&quot;Adobo x2&quot;, lunch)\nprint_line(&quot;Juice x3&quot;, drinks)\nprint_line(&quot;Total&quot;, total)\n\nspend(budget, total)\nprint(&quot;Budget after spend():&quot;, budget)\n\nbudget = remaining(budget, total)\nprint(&quot;Budget after remaining():&quot;, budget)\n\neach, extra = split_bill(total, 4)\nprint(f&quot;Split 4 ways: {each} each, plus {extra} extra&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Adobo x2    130.00
Juice x3     60.00
Total       190.00
Budget after spend(): 200
Budget after remaining(): 10
Split 4 ways: 47 each, plus 2 extra
```

`spend` only moved its own `money` name tag, so `budget` outside was still 200. `remaining` returned the new value, and the program stored it, so that change stuck. `split_bill` returned two values, unpacked into `each` and `extra`.
:::

## Try it yourself

1. Add a third item, rice at 15 pesos with quantity 2, and include it in the total.
2. Delete the `spend` function and the lines that use it. Why was it useless?
3. Write a function `apply_discount(amount, percent)` that returns the amount after a discount, and use it to take 10 percent off the total before subtracting it from the budget.

## Check your understanding

<Quiz
	question="In def add(a, b): and the call add(5, 3), which are the arguments?"
	:options="['5 and 3', 'a and b', 'add', 'def']"
	:answer-index="0"
	explanation="Parameters are the names in the definition (a and b). Arguments are the actual values passed in the call (5 and 3)."
/>

<Quiz
	question="x = 10, then a call double_it(x), where double_it sets its parameter to itself times 2 and returns nothing. What is x afterward?"
	:options="['20', 'None', '10', 'An error']"
	:answer-index="2"
	explanation="The parameter was a second name for 10. Reassigning it inside the function only moved the function's own name. To keep the result, return it and store it: x = double_it(x)."
/>

<Quiz
	question="A function ends with return total, count. How do you store both results?"
	:options="['total_count = f()', 'total = f() and count = f()', 'f(total, count)', 'total, count = f()']"
	:answer-index="3"
	explanation="Returning several values separated by commas lets you unpack them into several variables in one assignment."
/>

## Up next

Sometimes you want a parameter to be optional, like a greeting that says "Hello" unless you ask for something else. Or you want to name arguments so their order stops mattering. That's [Default and Keyword Arguments](/lessons/python/default-and-keyword-arguments).
