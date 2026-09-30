---
title: "Python Operators: Math, Comparison, and Logic Explained"
description: "Do math, compare values, and combine conditions in Python with arithmetic, comparison, and logical operators, including // and %, and chained comparisons."
---

# Operators and Expressions

*Values on their own just sit there. Operators are the verbs that make them do something.*

You can store numbers, text, and true-or-false values. Now it's time to work with them: add up scores, check whether someone passed, decide whether a student makes the honor roll. The symbols that do this work are called **operators**, and a piece of code that produces a value, like `score + 5`, is called an **expression**.

## The calculator on your desk

Most of Python's math operators are the ones on a calculator, plus a few extras a calculator doesn't have. Python is often used as a calculator, in fact: open the interactive shell from [How Python Runs](/lessons/python/how-python-runs), type `12 * 7`, and press Enter.

## Arithmetic operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` | add | `7 + 2` | `9` |
| `-` | subtract | `7 - 2` | `5` |
| `*` | multiply | `7 * 2` | `14` |
| `/` | divide | `7 / 2` | `3.5` |
| `//` | divide, whole part only | `7 // 2` | `3` |
| `%` | remainder | `7 % 2` | `1` |
| `**` | power | `7 ** 2` | `49` |

The first four work just like math class. The last three deserve a closer look.

## Two kinds of division

In Python, `/` always gives the exact answer, as a float, even when the numbers divide evenly:

```python
print(7 / 2)
print(10 / 2)
```

```text
3.5
5.0
```

Sometimes you want only the whole part. How many full boxes of 6 eggs can you fill with 20 eggs? That's **floor division**, `//`:

```python
print(20 // 6)
```

```text
3
```

And how many eggs are left over? That's the **remainder**, `%`:

```python
print(20 % 6)
```

```text
2
```

`//` and `%` are a pair: 20 eggs make 3 full boxes with 2 left over. They're more useful than they look:

- **Even or odd?** A number is even when `number % 2` is `0`.
- **Converting units.** 135 minutes is `135 // 60` hours (2) and `135 % 60` minutes (15).
- **Taking turns.** With 4 players, turn number `n` belongs to player `n % 4`.

If you've taken the [Java track](/lessons/java/operators), notice the difference: in Java, `7 / 2` is `3`, because dividing two whole numbers drops the fraction. Python's `/` never does that. Use `//` when you want it.

## Powers: `**`

`**` raises a number to a power. `2 ** 3` means 2 × 2 × 2:

```python
print(2 ** 3)
print(10 ** 6)
```

```text
8
1000000
```

## Order of operations

Python follows the order you learned in math class. `**` comes first, then `*`, `/`, `//`, and `%`, then `+` and `-`. Operators at the same level work left to right:

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```text
14
20
```

When in doubt, add parentheses. They cost nothing and make your meaning obvious.

## Shortcuts: compound assignment

Updating a variable using its own value is so common that Python has shorthand for it. You met two of these in [Variables and Naming](/lessons/python/variables):

| Shorthand | Means |
|---|---|
| `score += 5` | `score = score + 5` |
| `score -= 5` | `score = score - 5` |
| `score *= 2` | `score = score * 2` |
| `score /= 2` | `score = score / 2` |
| `score //= 2` | `score = score // 2` |
| `score %= 2` | `score = score % 2` |

Python doesn't have `++` or `--`. Where other languages write `count++`, Python writes `count += 1`.

## Comparison operators

Comparison operators ask a question about two values and answer with a `bool`: `True` or `False`.

| Operator | Asks | Example | Result |
|---|---|---|---|
| `==` | equal to? | `5 == 5` | `True` |
| `!=` | not equal to? | `5 != 3` | `True` |
| `>` | greater than? | `5 > 3` | `True` |
| `<` | less than? | `5 < 3` | `False` |
| `>=` | greater than or equal? | `5 >= 5` | `True` |
| `<=` | less than or equal? | `4 <= 3` | `False` |

You can store the answer in a variable:

```python
score = 82
passed = score >= 75
print(passed)
```

```text
True
```

Watch the difference between `=` and `==`. One equals sign **stores** a value. Two equals signs **compare** values. Python catches the most common mix-up for you:

```python
score = 82
if score = 100:  # error: SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?
    print("Perfect!")
```

Python even suggests the fix. (`:=` is a more advanced operator you won't need in this track.)

Comparisons work on text too. `==` checks whether two strings are exactly the same, capital letters included:

```python
print("Manila" == "Manila")
print("Manila" == "manila")
```

```text
True
False
```

## Chained comparisons

Here's something Python does that most languages don't. To check whether a number is in a range, you can write it just like in math:

```python
age = 15
print(13 <= age <= 19)
```

```text
True
```

Python reads `13 <= age <= 19` as "13 is at most age, **and** age is at most 19." In Java or JavaScript, the same line either fails or gives a wrong answer. In Python, it's the clearest way to write a range check.

## Logical operators

Sometimes one question isn't enough. "Is the score at least 90 **and** is attendance good?" Python's logical operators are plain English words:

| Operator | True when |
|---|---|
| `and` | both sides are true |
| `or` | at least one side is true |
| `not` | flips `True` to `False`, and `False` to `True` |

```python
score = 93
absences = 2

honor_roll = score >= 90 and absences <= 3
needs_help = score < 75 or absences > 10
is_failing = not score >= 75

print(honor_roll, needs_help, is_failing)
```

```text
True False False
```

A handy way to remember them: `and` is strict (everything must be true), `or` is generous (anything true will do), and `not` is contrary (it says the opposite).

Python is also a bit lazy with `and` and `or`, in a helpful way. If the left side of `and` is `False`, the whole thing must be false, so Python never even looks at the right side. Likewise, if the left side of `or` is `True`, Python stops there. This is called **short-circuiting**, and it will save you from a crash in the Try it section below.

## Try it

A student has three quiz scores. This program works out the total, the average, whether the total is even, and whether the student makes the honor roll. Predict every line before you check.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="400px"
	:model-value="'quiz1 = 88\nquiz2 = 94\nquiz3 = 83\nabsences = 2\n\ntotal = quiz1 + quiz2 + quiz3\nprint(&quot;Total:&quot;, total)\nprint(&quot;Average:&quot;, total / 3)\nprint(&quot;Whole-number average:&quot;, total // 3)\nprint(&quot;Points above 250:&quot;, total - 250)\nprint(&quot;Is the total even?&quot;, total % 2 == 0)\n\naverage = total / 3\nprint(&quot;Honor roll?&quot;, average &gt;= 88 and absences &lt;= 3)\nprint(&quot;In the B range?&quot;, 80 &lt;= average &lt; 90)\n\nteams = 0\ncan_split = teams != 0 and total / teams &gt; 10\nprint(&quot;Can split points into teams?&quot;, can_split)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Total: 265
Average: 88.33333333333333
Whole-number average: 88
Points above 250: 15
Is the total even? False
Honor roll? True
In the B range? True
Can split points into teams? False
```

`total / 3` gives the exact average as a float, while `total // 3` keeps only the whole part. On the last line, `teams != 0` is `False`, so `and` stops right there and never tries `total / teams`. Without short-circuiting, dividing by zero would crash the program.
:::

## Try it yourself

1. Change `quiz3` so the honor roll line prints `False`. What's the highest score that does it?
2. Add a line that turns 135 minutes into hours and minutes using `//` and `%`, and prints `2 hours and 15 minutes`.
3. Swap the two sides of the `and` on the `can_split` line, so it reads `total / teams > 10 and teams != 0`. What would happen now, and why?

## Check your understanding

<Quiz
	question="What does print(7 // 2) print?"
	:options="['3.5', '3', '4', '1']"
	:answer-index="1"
	explanation="// is floor division: it keeps only the whole part of the answer. Use / for the exact answer, 3.5."
/>

<Quiz
	question="What is 20 % 6?"
	:options="['3', '3.33', '14', '2']"
	:answer-index="3"
	explanation="6 goes into 20 three times, with 2 left over. % gives you that leftover part."
/>

<Quiz
	question="Which line checks that age is between 13 and 19, inclusive, in Python?"
	:options="['13 &lt;= age &lt;= 19', '13 &lt; age &lt; 19', 'age between 13 and 19', '13 &lt;= age or age &lt;= 19']"
	:answer-index="0"
	explanation="Python supports chained comparisons, so 13 &lt;= age &lt;= 19 means both conditions must be true. Using or would let every age through."
/>

## Up next

You saw that Python refuses to add a number to a string. So how do you turn the number `17` into the text `"17"`, or the text a user typed into a number you can do math with? That's [Type Conversion](/lessons/python/type-conversion).
