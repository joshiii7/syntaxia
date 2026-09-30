---
title: "Python Type Conversion: int(), float(), str(), and bool()"
description: "Convert between Python types with int(), float(), str(), and bool(): turn text into numbers, numbers into text, and understand what gets lost along the way."
---

# Type Conversion

*A currency exchange booth turns pesos into dollars. You get the same value, just in a form the next shop will accept.*

In [Numbers, Strings, and Booleans](/lessons/python/data-types), Python refused to run `"Age: " + 17`. It won't join text and a number, because it can't be sure what you mean. And in the next lesson, you'll read what a user types, which always arrives as text, even when they type a number.

Both problems have the same fix: **converting** a value from one type to another, on purpose.

## A currency exchange

When you travel, a shop in another country won't take your pesos. So you go to an exchange booth, hand over pesos, and get dollars back. The value is (roughly) the same; it's just in a form the shop accepts.

Sometimes the exchange isn't perfect. Coins often can't be exchanged, so the booth rounds your money down. And if you hand over something that isn't money at all, like a bus ticket, the booth refuses.

Python's conversion functions are exchange booths:

| Function | Converts to | Example | Result |
|---|---|---|---|
| `int(x)` | a whole number | `int("42")` | `42` |
| `float(x)` | a decimal | `float("3.5")` | `3.5` |
| `str(x)` | text | `str(17)` | `"17"` |
| `bool(x)` | `True` or `False` | `bool(0)` | `False` |

Each one is named after the type it produces, and each gives back a **new** value. The original stays exactly as it was.

## Numbers to text: `str()`

To join a number to text with `+`, turn the number into text first:

```python
age = 17
print("Age: " + str(age))
```

```text
Age: 17
```

`str(age)` gives back the string `"17"`, and two strings join happily. (Separating with commas in `print`, or using an f-string, often reads more nicely. You'll see f-strings in [Formatting Output with f-strings](/lessons/python/f-strings).)

## Text to numbers: `int()` and `float()`

Going the other way is how you'll turn typed input into numbers you can do math with:

```python
typed_age = "17"
typed_height = "1.62"

age = int(typed_age)
height = float(typed_height)

print(age + 1)
print(height * 100)
```

```text
18
162.0
```

Without the conversion, `typed_age + 1` would be an error, and `typed_age * 2` would give `"1717"`, the string repeated twice.

`int()` and `float()` ignore spaces at the start and end, so `int(" 42 ")` is `42`. But the text has to look like a number of the right kind. If it doesn't, the booth refuses:

```python
int("seventeen")  # error: ValueError: invalid literal for int() with base 10: 'seventeen'
```

```python
int("3.5")  # error: ValueError: invalid literal for int() with base 10: '3.5'
```

The second one surprises people. `"3.5"` is a perfectly good number, but it isn't a *whole* number, so `int()` won't take it. Use `float("3.5")` instead. (A `ValueError` means "right kind of value, but this particular one doesn't work." In [Exceptions](/lessons/python/exceptions), you'll learn to catch it and ask the user again instead of crashing.)

## Decimals to whole numbers: what gets lost

`int()` also converts a float to a whole number. But like the exchange booth with your coins, it doesn't round. It just **chops** off everything after the decimal point:

```python
print(int(9.99))
print(int(-9.99))
```

```text
9
-9
```

If you want the nearest whole number, use `round()` instead:

```python
print(round(9.99))
print(round(2.4))
```

```text
10
2
```

`round()` can also keep some decimal places. `round(3.14159, 2)` gives `3.14`.

One oddity to know about: when a number is exactly halfway, `round()` goes to the nearest *even* number. So `round(2.5)` is `2`, but `round(3.5)` is `4`. This is called "banker's rounding," and it avoids always rounding halves up, which would slowly push totals too high. For everyday display, you'll rarely notice.

## Anything to `True` or `False`: `bool()`

`bool()` turns any value into `True` or `False`. The rule is short: **empty or zero values become `False`, and everything else becomes `True`**.

```python
print(bool(0), bool(0.0), bool(""), bool(None))
print(bool(5), bool(-1), bool("hi"), bool("False"))
```

```text
False False False False
True True True True
```

Look at that last one: `bool("False")` is `True`. The string isn't empty, so it counts as true. Python doesn't read the word inside it.

Values that act like `False` are called **falsy**, and the rest are **truthy**. This matters in [Making Decisions](/lessons/python/if-elif-else), where you can write `if name:` to mean "if the name isn't empty."

## Checking before converting

Sometimes you want to know whether text *can* become a number before you try. Strings have a method called `isdigit()` that answers `True` when every character is a digit:

```python
print("2026".isdigit())
print("20x6".isdigit())
print("".isdigit())
```

```text
True
False
False
```

It doesn't handle minus signs or decimal points, though: `"-5".isdigit()` is `False`. For anything beyond simple whole numbers, the `try`/`except` approach you'll learn in [Exceptions](/lessons/python/exceptions) is the reliable way.

## Try it

A class of 7 students collected 250 bottles for recycling, and the goal arrived as text. This program converts in every direction. Predict each line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="360px"
	:model-value="'bottles = 250\nstudents = 7\n\nshare = bottles / students\nprint(&quot;Exact share:&quot;, share)\nprint(&quot;Chopped:&quot;, int(share))\nprint(&quot;Rounded:&quot;, round(share))\nprint(&quot;Two decimals:&quot;, round(share, 2))\n\ntyped_goal = &quot;300&quot;\ngoal = int(typed_goal)\nprint(&quot;Still needed: &quot; + str(goal - bottles))\n\nprint(&quot;Goal as text times 2:&quot;, typed_goal * 2)\nprint(&quot;Goal as number times 2:&quot;, goal * 2)\nprint(&quot;Any bottles left to find?&quot;, bool(goal - bottles))\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Exact share: 35.714285714285715
Chopped: 35
Rounded: 36
Two decimals: 35.71
Still needed: 50
Goal as text times 2: 300300
Goal as number times 2: 600
Any bottles left to find? True
```

`int(share)` chops 35.71 down to 35, while `round` goes up to 36. The text `"300"` times 2 repeats the text, but the number 300 times 2 is 600. And `goal - bottles` is 50, which isn't zero, so `bool` gives `True`.
:::

## Try it yourself

1. Change `typed_goal` to `"three hundred"`. What would happen when the program runs, and which line would fail? Change it back.
2. Predict `bool(" ")`, a string containing just one space. Then check it in the interactive shell. Why is it that value?
3. Write a line that converts the text `"19.5"` into a number, adds `0.5`, and prints the result as a whole number: `20`.

## Check your understanding

<Quiz
	question="What does int(7.9) give you?"
	:options="['8', '7.9', '7', 'An error']"
	:answer-index="2"
	explanation="int() chops off the decimal part without rounding. Use round(7.9) to get 8."
/>

<Quiz
	question="What happens with int(&quot;3.5&quot;)?"
	:options="['A ValueError, because the text is not a whole number', 'It gives 3', 'It gives 4', 'It gives 3.5']"
	:answer-index="0"
	explanation="int() only accepts text that looks like a whole number. Use float(&quot;3.5&quot;) for decimals."
/>

<Quiz
	question="What is bool(&quot;False&quot;)?"
	:options="['False', 'An error', 'None', 'True']"
	:answer-index="3"
	explanation="Any non-empty string is truthy. bool() doesn't read the word inside the string; only the empty string &quot;&quot; is False."
/>

## Up next

So far, every value in your programs was typed straight into the code. In [Reading User Input with input()](/lessons/python/user-input), your programs start asking the user for values instead, and `int()` and `float()` will come in handy right away.
