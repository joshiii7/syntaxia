---
title: "Python Data Types: int, float, str, bool, and None"
description: "Learn Python's basic data types: whole numbers, decimals, text, True and False, and None, how to check a value's type, and the decimal quirk every language shares."
---

# Numbers, Strings, and Booleans

*A kitchen has jars, bottles, and boxes. What you can do with something depends on what's inside.*

In [Variables and Naming](/lessons/python/variables), you stuck name tags on all kinds of values: `88`, `36.6`, `"Ben"`, `True`. Python didn't ask what kind each one was, but it always knows. And the kind of value decides what you can do with it: you can multiply two numbers, but not two names.

The kind of a value is called its **type**. This lesson covers the five types you'll use constantly.

## Jars, bottles, and boxes

In a kitchen, flour goes in a jar, milk goes in a bottle, and eggs go in a carton. You pour milk, but you scoop flour, and you count eggs. Try to pour an egg carton, and things go badly.

Python's values work the same way. A whole number can be counted and multiplied. Text can be joined and searched. A true-or-false value can be used to make decisions. Each type comes with its own set of things you can do with it.

## The five everyday types

| Type | What it holds | Examples |
|---|---|---|
| `int` | whole numbers | `17`, `-3`, `2026` |
| `float` | numbers with a decimal point | `36.6`, `0.5`, `-2.0` |
| `str` | text (a **string** of characters) | `"Maria"`, `'hello'`, `""` |
| `bool` | `True` or `False` | `True`, `False` |
| `NoneType` | "nothing here" | `None` |

You can ask Python for any value's type with the `type` function:

```python
print(type(17))
print(type(36.6))
print(type("Maria"))
print(type(True))
print(type(None))
```

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
```

The word `class` is Python's word for a type. You'll learn to make your own in [Classes and Objects](/lessons/python/classes-and-objects).

## Whole numbers: `int`

Use `int` for anything you count: students, points, lives, years.

Python whole numbers have a nice property: **they can be as big as you like**. Many languages put a limit on whole numbers, and going past it gives nonsense. Python just keeps going:

```python
print(2 ** 100)
```

```text
1267650600228229401496703205376
```

(`**` means "to the power of." More on operators in [Operators and Expressions](/lessons/python/operators).)

To make big numbers readable in your code, you can put underscores between the digits. Python ignores them:

```python
population = 8_100_000_000
print(population)
```

```text
8100000000
```

## Decimals: `float`

Any number written with a decimal point is a `float`, short for **floating-point number**. Use it for measurements, prices, averages, and percentages:

```python
height = 1.62
average = 88.75
print(height, average)
```

```text
1.62 88.75
```

`2.0` is a float, even though it's a whole amount, because of the decimal point. `2` is an int.

Floats come with one quirk that surprises everyone. Computers store decimals in binary, and some simple decimals, like `0.1`, can't be stored exactly, the same way `1/3` can't be written exactly as a decimal (0.3333...). So:

```python
print(0.1 + 0.2)
```

```text
0.30000000000000004
```

That's not a Python bug. JavaScript, Java, and nearly every other language print the same thing. For grades and measurements, the tiny error doesn't matter; you'll learn to round numbers for display in [Formatting Output with f-strings](/lessons/python/f-strings). Real banking software uses a special type called `Decimal` for money instead.

## Text: `str`

A `str` holds text, written between quotes. You've been using them since your first program. A string can be a single character, a whole paragraph, or even empty:

```python
name = "Maria"
initial = "M"
empty = ""
print(len(name), len(initial), len(empty))
```

```text
5 1 0
```

`len` gives back the **length** of a string: how many characters it has. Unlike some languages, Python doesn't have a separate type for a single character. `"M"` is just a string of length 1.

Some values look like numbers but are really text. A phone number like `"09171234567"` or a ZIP code like `"02134"` should be a string: you'll never add two phone numbers together, and storing one as an int would lose the leading zero.

And note the difference the quotes make:

```python
print(5 + 5)
print("5" + "5")
```

```text
10
55
```

Two ints add up. Two strings join together. [Working with Strings](/lessons/python/strings) is all about what else strings can do.

## True or false: `bool`

A `bool` (short for **Boolean**, after the mathematician George Boole) holds one of exactly two values: `True` or `False`. They're written with a capital first letter and no quotes:

```python
is_enrolled = True
has_paid = False
print(is_enrolled, has_paid)
```

```text
True False
```

You'll rarely type `True` or `False` directly. Much more often, they come from questions your code asks, like "is the score at least 75?":

```python
score = 82
print(score >= 75)
```

```text
True
```

Booleans are what your program will use to make decisions in [Making Decisions: if, elif, and else](/lessons/python/if-elif-else).

## Nothing at all: `None`

Sometimes a variable needs to exist, but there's no value for it yet. A student who hasn't taken the test doesn't have a score of `0`; they have *no score*. Python's value for "nothing here" is **`None`**:

```python
test_score = None
print(test_score)
```

```text
None
```

`None` is different from `0`, from `""`, and from `False`. It means the value is missing, not that it's zero or empty. You'll see `None` a lot once you start writing functions in [Writing Functions](/lessons/python/functions).

## Mixing types

Python is happy to mix ints and floats in math. The answer is a float, so nothing is lost:

```python
print(3 + 0.5)
print(type(3 + 0.5))
```

```text
3.5
<class 'float'>
```

But it won't guess what you mean when you mix numbers and text:

```python
print("Age: " + 17)  # error: TypeError: can only concatenate str (not "int") to str
```

Should that be the text `"Age: 17"`, or should Python try to turn `"Age: "` into a number? Rather than guess, Python stops and asks you to decide. You'll learn how to convert between types in [Type Conversion](/lessons/python/type-conversion).

## Try it

This program asks Python for the type of several values, including some that might trick you. Predict each line before you check.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="300px"
	:model-value="'print(type(42))\nprint(type(42.0))\nprint(type(&quot;42&quot;))\nprint(type(10 / 2))\nprint(type(True))\nprint(type(&quot;True&quot;))\nprint(type(None))\nprint(len(&quot;Hello, world!&quot;))\nprint(3 * &quot;ha&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'float'>
<class 'bool'>
<class 'str'>
<class 'NoneType'>
13
hahaha
```

Quotes always make a string, even around digits or the word `True`. Dividing with `/` always gives a float in Python, even when it comes out even: `10 / 2` is `5.0`. `len` counts every character, including the comma, the space, and the `!`. And multiplying a string by a number repeats it.
:::

## Try it yourself

1. Create a variable holding your height in meters and another holding your age, and print the type of each.
2. Store a phone number in a variable, first as a number like `9171234567` and then as the text `"09171234567"`. Print both. Which one kept the leading zero?
3. Predict the result of `print("7" * 3)` and `print(7 * 3)`, then check them in the interactive shell.

## Check your understanding

<Quiz
	question="What type is the value 2.0?"
	:options="['int', 'str', 'float', 'bool']"
	:answer-index="2"
	explanation="Any number written with a decimal point is a float, even when the part after the point is zero."
/>

<Quiz
	question="A student hasn't taken a test yet. Which value best represents their score?"
	:options="['None', '0', '&quot;&quot;', 'False']"
	:answer-index="0"
	explanation="None means the value is missing. A score of 0 would claim they took the test and got nothing right."
/>

<Quiz
	question="What does print(&quot;5&quot; + &quot;5&quot;) print?"
	:options="['10', 'An error', '5 5', '55']"
	:answer-index="3"
	explanation="Both values are strings, so + joins them. Without the quotes, it would add the numbers and print 10."
/>

## Up next

You know the kinds of values Python works with. Now let's do things with them: math, comparisons, and combining true-or-false answers, in [Operators and Expressions](/lessons/python/operators).
