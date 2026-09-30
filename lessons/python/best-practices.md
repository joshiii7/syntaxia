---
title: "Python Best Practices and Common Beginner Mistakes"
description: "Write Python that's easy to read and hard to break: PEP 8 naming and style, small focused functions, Pythonic habits, and the mistakes almost every beginner makes."
---

# Best Practices and Common Mistakes

*Anyone can cook a meal once. A good cook leaves a kitchen the next cook can walk into and use.*

You've learned a lot of Python: values and operators, decisions and loops, functions and modules, lists, tuples, dictionaries, and sets, classes and objects, exceptions, files, and JSON. You can build real programs now.

This lesson is about building them *well*. Code is read far more often than it's written: by teachers, by teammates, and most of all by you, a few weeks from now, when you've forgotten how it works. Working code is the minimum. Code that's easy to read, easy to change, and hard to break is the goal.

None of this is new syntax. It's habits, collected from the whole track in one place, plus a checklist of the mistakes that trip up almost every Python beginner.

## A shared kitchen

Picture a restaurant kitchen shared by several cooks across different shifts. A good cook labels every container, puts the knives back where they belong, and cleans as they go. The next cook walks in and gets straight to work.

A messy cook might make an equally good meal. But they leave unlabeled containers and a knife in the flour, and the next cook spends half their shift working out what's what. Your code is that kitchen.

## PEP 8: Python's style guide

Python has an official style guide, called **PEP 8**, that almost every Python programmer follows. Following it makes your code instantly familiar to anyone who reads it. The most important parts:

| Kind | Style | Examples |
|---|---|---|
| variables and functions | snake_case | `quiz_score`, `calculate_average` |
| constants | UPPER_SNAKE_CASE | `MAX_SCORE`, `PASSING_SCORE` |
| classes | PascalCase | `Student`, `BankAccount` |
| modules (files) | short, lowercase | `grades.py`, `helpers.py` |

And for layout:

- Indent with **4 spaces** per level.
- Keep lines reasonably short. PEP 8 suggests 79 characters, and many teams allow a bit more.
- Put a space around operators and after commas: `total = a + b`, not `total=a+b`.
- Leave **two blank lines** between top-level functions and classes, and one between methods.
- Put all `import` lines at the top of the file.

You don't have to memorize any of this. Tools called **formatters**, like **Black** or **Ruff**, rewrite your file into this style automatically, and code editors can run them every time you save.

## Name things by what they are

Beyond the style rules, choose names that explain themselves:

- `average_score` beats `avg`, and `avg` beats `x`.
- Functions do things, so name them with verbs: `load_grades`, `print_report`.
- True-or-false values read like questions: `is_enrolled`, `has_paid`.
- Short names like `i` or `x` are fine for tiny loops, where their meaning is obvious.

And never reuse the names of Python's built-in functions for your own variables. This is a surprisingly common bug:

```python
list = [3, 1, 2]
numbers = list((5, 4))  # error: TypeError: 'list' object is not callable
```

After `list = [3, 1, 2]`, the name `list` means your list, not Python's `list()` function, so calling it fails. The same goes for `str`, `sum`, `max`, `input`, and `id`. Choose `scores`, `total`, or `names` instead.

## Replace magic numbers with constants

A **magic number** is a number in your code with no explanation:

```python
score = 82
if score >= 75:
    print("Passed")
```

```text
Passed
```

What's 75? The reader has to guess. And if the passing mark changes, you have to find every 75 in the program, and hope none of them meant something else. Give it a name instead, as a constant near the top of the file:

```python
PASSING_SCORE = 75

score = 82
if score >= PASSING_SCORE:
    print("Passed")
```

```text
Passed
```

## Keep functions small and focused

A function should do **one** job, and its name should say what that job is. When a function grows past a screenful, or you need the word "and" to describe it, split it up. A program's main part can then read almost like a summary:

```python
def main():
    students = load_students("students.json")
    print_report(students)
    save_report(students, "report.txt")
```

You can understand the whole program in three lines, and dig into whichever function you care about.

And don't repeat yourself. If the same lines appear in several places, move them into a function. If several classes share the same code, consider a parent class from [Inheritance](/lessons/python/inheritance). The habit is known as **DRY**: Don't Repeat Yourself.

## Write Pythonic code

Experienced Python programmers talk about code being **Pythonic**: using the language's own tools the way they were designed. You've learned most of them already:

| Instead of | Write |
|---|---|
| `for i in range(len(names)):` then `names[i]` | `for name in names:` |
| a counter you add to by hand, next to a loop | `for i, name in enumerate(names):` |
| looping over two lists by index | `for name, score in zip(names, scores):` |
| `if len(names) == 0:` | `if not names:` |
| `if value == None:` | `if value is None:` |
| `"Total: " + str(total)` | `f"Total: {total}"` |
| an empty list, a loop, and `append` | a list comprehension, when it's simple |
| `file = open(...)` and remembering `close()` | `with open(...) as file:` |

## Comment the why, not the what

Good names explain *what* code does. Comments are for what the code can't say: *why* it does it that way.

```python
# Bad: repeats the code
count += 1  # add one to count

# Good: explains a decision
# Scores above 100 come from extra-credit work, so allow up to 110.
MAX_SCORE = 110
```

Use docstrings from [Writing Functions](/lessons/python/functions) to describe what each function is for. And don't leave old code commented out "just in case": that's what version control is for.

## Handle errors honestly

From [Exceptions](/lessons/python/exceptions):

- Catch **specific** exceptions you have a plan for. Never use a bare `except:`.
- Never leave an `except` block that silently does nothing.
- **Raise** a `ValueError` when a function gets data it can't work with, instead of quietly "fixing" it.

## The mistakes almost everyone makes

When something's wrong and you can't see why, run down this list. Every one of these came up somewhere in this track.

1. **Forgetting the colon** after `if`, `for`, `while`, `def`, or `class`. ([Making Decisions](/lessons/python/if-elif-else))
2. **Mixed-up indentation**, where a line meant to be inside a block isn't, or the other way around. ([Making Decisions](/lessons/python/if-elif-else))
3. **Using `=` instead of `==`** in a condition. ([Operators and Expressions](/lessons/python/operators))
4. **Forgetting that `input()` gives a string**, then doing math with it. ([Reading User Input](/lessons/python/user-input))
5. **Expecting a string method to change the string.** `name.upper()` on its own does nothing; write `name = name.upper()`. ([Working with Strings](/lessons/python/strings))
6. **Assigning the result of a list method**, like `names = names.append("Eli")`, which replaces your list with `None`. ([Lists](/lessons/python/lists))
7. **Thinking `b = a` copies a list.** It's a second name for the same list; use `a.copy()`. ([Lists](/lessons/python/lists))
8. **Off-by-one ranges**, forgetting that `range(1, 10)` stops at 9. ([for Loops and range()](/lessons/python/for-loops))
9. **Forgetting the `f`** before an f-string, so the braces print as-is. ([Formatting Output with f-strings](/lessons/python/f-strings))
10. **A list as a default value**, like `def add(item, items=[])`, shared between calls. ([Default and Keyword Arguments](/lessons/python/default-and-keyword-arguments))
11. **Forgetting `self`**, either as a method's first parameter or in front of an attribute. ([Methods and self](/lessons/python/methods-and-self))
12. **Comparing floats with `==`.** `0.1 + 0.2 == 0.3` is `False`; use `math.isclose(a, b)` or `round`. ([Numbers, Strings, and Booleans](/lessons/python/data-types))
13. **Naming your own file after a module**, like `random.py`, so your import finds your file instead of Python's. ([Modules and import](/lessons/python/modules))

## Try it

This program works. It runs and prints the right answer. But it breaks almost every habit in this lesson. Read it, predict what it prints, and count how many problems you can spot along the way.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="440px"
	:model-value="'a = [&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;, &quot;Dina&quot;]\nb = [91, 68, 95, 74]\nc = 0\nfor i in range(len(a)):\n    if b[i] &gt;= 75: c = c + 1\n    if b[i] &gt;= 75: print(a[i] + &quot; passed with &quot; + str(b[i]))\n    if b[i] &lt; 75: print(a[i] + &quot; needs a retake (&quot; + str(b[i]) + &quot;)&quot;)\nt = 0\nfor i in range(len(b)):\n    t = t + b[i]\nprint(&quot;Passed: &quot; + str(c) + &quot;/&quot; + str(4))\nprint(&quot;Avg: &quot; + str(t / 4))\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria passed with 91
Ben needs a retake (68)
Carlo passed with 95
Dina needs a retake (74)
Passed: 2/4
Avg: 82.0
```

Some of the problems:

- names like `a`, `b`, `c`, and `t` say nothing;
- the magic numbers `75` and `4` are repeated, and the `4` breaks the moment a student is added;
- the same condition is checked three times, and two `if` blocks are crammed onto one line each;
- names and scores live in two lists that only line up by luck, and `range(len(...))` is used instead of `zip`;
- `+` and `str()` are used where an f-string would be clearer, and `sum` is rewritten by hand.

Here's one way to clean it up. It prints exactly the same thing:

```python
PASSING_SCORE = 75

students = [("Maria", 91), ("Ben", 68), ("Carlo", 95), ("Dina", 74)]


def print_result(name, score):
    if score >= PASSING_SCORE:
        print(f"{name} passed with {score}")
    else:
        print(f"{name} needs a retake ({score})")


for name, score in students:
    print_result(name, score)

scores = [score for _, score in students]
passed = sum(1 for score in scores if score >= PASSING_SCORE)
print(f"Passed: {passed}/{len(students)}")
print(f"Avg: {sum(scores) / len(scores)}")
```

It's a little longer, and that's fine. Every piece now has a name that says what it does, each name stays next to its score, adding a fifth student is one line, and changing the passing mark is a single edit.
:::

## Try it yourself

1. In the messy version, add a fifth student, `Eli`, with a score of 88. How many places did you have to change? Now do the same in the clean version.
2. In the clean version, change the passing score to 70. Which students' results change?
3. Pick a program you wrote earlier in this track. Find one magic number, one unclear name, and one place you could use a more Pythonic tool from the table above, and fix all three.

## Check your understanding

<Quiz
	question="Following PEP 8, how should a variable holding a student's first name be written?"
	:options="['firstName', 'FirstName', 'first_name', 'FIRST_NAME']"
	:answer-index="2"
	explanation="Python variables and functions use snake_case. PascalCase is for classes, and UPPER_SNAKE_CASE is for constants."
/>

<Quiz
	question="What's wrong with naming a variable list, as in list = [1, 2, 3]?"
	:options="['Nothing, it is a good name', 'It hides the built-in list() function for the rest of the program', 'Variables cannot hold lists', 'It makes the list read-only']"
	:answer-index="1"
	explanation="The name list now means your list, so calling list() later fails with TypeError: 'list' object is not callable. Use a descriptive name like scores."
/>

<Quiz
	question="Which is the Pythonic way to loop over names and their positions?"
	:options="['for name, i in names:', 'for i in range(len(names)): name = names[i]', 'while i &lt; len(names):', 'for i, name in enumerate(names):']"
	:answer-index="3"
	explanation="enumerate gives you each position and item together, with no index bookkeeping."
/>

## Up next

That's everything. You have the whole toolkit, and the habits to use it well. Time to put it all together in one real program: [Final Project: Personal Budget Tracker](/lessons/python/final-project).
