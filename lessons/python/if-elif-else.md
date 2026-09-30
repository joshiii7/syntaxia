---
title: "Python if, elif, and else: Making Decisions in Code"
description: "Make your Python programs choose what to do with if, elif, and else, use indentation to group code, combine conditions, and avoid the classic beginner mistakes."
---

# Making Decisions: if, elif, and else

*A fork in the road: one sign, one question, and you only walk down one path.*

Every program you've written so far runs straight from top to bottom, every line, every time. That's fine for printing an ID card. But a grading program needs to say "passed" to some students and "try again" to others. A login screen needs to let the right password in and keep the wrong ones out.

To do that, your program has to make **decisions**. In Python, decisions start with `if`.

## A fork in the road

Imagine walking and reaching a fork with a sign: "If it's raining, take the covered path. Otherwise, take the park path." You check the weather, pick one path, and never walk both.

An `if` statement is that sign. It asks a yes-or-no question, and the answer decides which code runs. The question is a **condition**: any expression that's true or false, like the comparisons from [Operators and Expressions](/lessons/python/operators).

## `if`: do this only when...

```python
score = 82

if score >= 75:
    print("You passed!")
    print("Well done.")

print("Thanks for taking the quiz.")
```

```text
You passed!
Well done.
Thanks for taking the quiz.
```

The parts:

- `if` starts the decision, followed by the condition, `score >= 75`.
- A **colon** `:` ends the line. It means "here comes the code that belongs to this."
- The lines that belong to the `if` are **indented** underneath it. They only run when the condition is `True`.
- The first line that isn't indented, `print("Thanks...")`, is back outside the `if`, and runs no matter what.

Change the score to 60, and only the "Thanks" line prints.

## Indentation is the grammar

In most languages, curly braces show which lines belong together, and indentation is just for looks. In Python, **the indentation is the grammar**. The indented lines under an `if` are its **block**, and the block ends as soon as a line goes back to the left.

The standard is **four spaces** per level. Your code editor inserts them automatically when you press Tab after a line ending in a colon. Whatever you use, be consistent: every line in a block must be indented by exactly the same amount.

Forget to indent, and Python stops you:

```python
score = 82
if score >= 75:
print("You passed!")  # error: IndentationError: expected an indented block after 'if' statement on line 2
```

## `else`: otherwise...

Add `else` to say what should happen when the condition is `False`:

```python
score = 60

if score >= 75:
    print("You passed!")
else:
    print("Not this time. Keep practicing!")
```

```text
Not this time. Keep practicing!
```

`else` has no condition of its own, and it needs a colon too. Exactly one of the two blocks runs: never both, never neither. That's the fork in the road.

## `elif`: more than two paths

Real decisions often have more than two outcomes. Letter grades are a classic example. Chain the choices together with `elif`, short for "else if":

```python
score = 84

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
```

```text
Grade: B
```

Python checks each condition **from top to bottom**, runs the block of the **first** one that's true, and skips everything else in the chain.

That's why the order matters. A score of 84 is also `>= 70`, but Python never gets that far: `score >= 80` matched first. Look what happens if you put the checks in the wrong order:

```python
score = 95

if score >= 70:
    print("Grade: C")
elif score >= 90:
    print("Grade: A")
```

```text
Grade: C
```

A 95 gets a C! When you're checking ranges like this, start with the strictest condition and work down. The final `else` is optional, but it's a good safety net for everything that didn't match.

## Combining conditions

Use `and`, `or`, and `not` from [Operators and Expressions](/lessons/python/operators) inside any condition, and chained comparisons for ranges:

```python
score = 93
absences = 1
age = 15

if score >= 90 and absences <= 3:
    print("Honor roll!")

if 13 <= age <= 19:
    print("Teenager")
```

```text
Honor roll!
Teenager
```

## Truthy and falsy conditions

In [Type Conversion](/lessons/python/type-conversion), you saw that empty and zero values count as `False`, and everything else counts as `True`. That means a condition doesn't have to be a comparison. Any value works:

```python
name = ""

if name:
    print("Hello,", name)
else:
    print("You didn't type a name.")
```

```text
You didn't type a name.
```

`if name:` reads as "if there's a name." It's a common, clean way to check whether a string (or a list, later) is empty. Similarly, for a variable that might be `None`, write `if value is None:`. Use `is` for `None`, and `==` for everything else.

## Decisions inside decisions

You can put an `if` inside another `if`. The inner one is simply indented one level further:

```python
submitted = True
score = 68

if submitted:
    if score >= 75:
        print("Passed")
    else:
        print("Submitted, but needs a retake")
else:
    print("Missing")
```

```text
Submitted, but needs a retake
```

Notice `if submitted:` instead of `if submitted == True:`. A boolean is already true or false, so it can be the whole condition, and its opposite is `if not submitted:`.

Nesting is useful, but more than two or three levels gets hard to follow. Often `and` or an `elif` chain does the same job more clearly.

## Compact choices: the conditional expression

When all you need is to pick one of two *values*, Python has a one-line form:

```python
score = 82
result = "Pass" if score >= 75 else "Fail"
print(result)
```

```text
Pass
```

Read it as English: "result is Pass if the score is at least 75, else Fail." Keep it for simple choices of a value; when you need to run different *actions*, use a full `if` statement.

## Try it

This program turns a score into a letter grade, checks the honor roll, and handles a missing submission and a blank name. Predict what it prints.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="440px"
	:model-value="'name = &quot;Maria&quot;\nsubmitted = True\nscore = 87\nabsences = 4\nnickname = &quot;&quot;\n\nif not submitted:\n    print(name + &quot;: missing&quot;)\nelse:\n    if score &gt;= 90:\n        grade = &quot;A&quot;\n    elif score &gt;= 80:\n        grade = &quot;B&quot;\n    elif score &gt;= 70:\n        grade = &quot;C&quot;\n    else:\n        grade = &quot;F&quot;\n    print(f&quot;{name}: {score} ({grade})&quot;)\n\n    if score &gt;= 85 and absences &lt;= 3:\n        print(&quot;Honor roll!&quot;)\n    elif score &gt;= 85:\n        print(&quot;Great score, but too many absences for the honor roll.&quot;)\n\nprint(&quot;Nickname:&quot;, nickname if nickname else &quot;(none)&quot;)\nprint(&quot;Report complete.&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria: 87 (B)
Great score, but too many absences for the honor roll.
Nickname: (none)
Report complete.
```

87 isn't `>= 90`, but it is `>= 80`, so the chain stops at `B`. The honor roll check needs both conditions, and 4 absences fails the second, so the `elif` runs instead. `nickname` is an empty string, which is falsy, so the conditional expression picks `"(none)"`.
:::

## Try it yourself

1. Change `absences` to 2, then `score` to 92. Predict the output each time before checking.
2. Set `submitted` to `False`. Which lines print now?
3. Add a grade `D` for scores from 60 to 69. Where in the chain does it have to go?

## Check your understanding

<Quiz
	question="What ends the line that starts an if statement in Python?"
	:options="['A semicolon', 'A curly brace', 'A colon', 'Nothing']"
	:answer-index="2"
	explanation="if, elif, and else lines all end with a colon, and the lines that belong to them are indented underneath."
/>

<Quiz
	question="With score = 85, what does this print? if score &gt;= 70: print(&quot;C&quot;) elif score &gt;= 80: print(&quot;B&quot;)"
	:options="['C', 'B', 'Both C and B', 'Nothing']"
	:answer-index="0"
	explanation="Python runs the first block whose condition is true and skips the rest. 85 is at least 70, so it prints C. Put stricter checks first."
/>

<Quiz
	question="name = &quot;&quot;. What does if name: do?"
	:options="['Runs its block, because name exists', 'Causes an error', 'Checks whether name equals the word name', 'Skips its block, because an empty string is falsy']"
	:answer-index="3"
	explanation="Empty strings, 0, and None are falsy. if name: is a clean way to check that a string isn't empty."
/>

## Up next

So far, every line in your programs runs at most once. What if you want to keep asking a question until the answer is right, or count down from 10? That's [while Loops](/lessons/python/while-loops).
