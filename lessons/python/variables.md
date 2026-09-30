---
title: "Python Variables: Create, Name, and Change Values"
description: "Store values in Python variables: create them with =, give them clear snake_case names, change them later, and see why Python doesn't ask for a type up front."
---

# Variables and Naming

*A variable is a name tag. You can stick it on anything, and move it to something else later.*

So far, your programs have printed text that was typed straight into the code. Real programs need to remember things while they run: a player's name, a score that goes up, whether a door is locked. When the score changes, everything that uses it should see the new number.

That's what variables are for, and Python makes them about as simple as they can be.

## Name tags

Picture a table covered in things: a mug, a notebook, a phone. You stick a paper name tag on the mug that says `coffee`. Now, instead of saying "the white mug near the edge of the table," you can just say `coffee`.

A Python variable is that name tag:

```python
quiz_score = 88
```

- `quiz_score` is the **name**: the writing on the tag.
- `=` sticks the tag onto a value. Read it as "gets" or "is set to," not "equals."
- `88` is the **value** the tag is stuck to.

That's the whole thing. Creating a variable and giving it a value happen in one step, the first time you write the line. This is called **assignment**.

## Using a variable

Once a name exists, you can use it anywhere you'd use the value itself:

```python
quiz_score = 88
bonus = 5

print(quiz_score)
print(quiz_score + bonus)
```

```text
88
93
```

Python looks up what each name is attached to and uses that value. `quiz_score + bonus` becomes `88 + 5`.

To print text and a variable together, separate them with commas. `print` puts a space between each item for you:

```python
name = "Maria"
age = 17
print(name, "is", age, "years old")
```

```text
Maria is 17 years old
```

There's a neater way to mix text and variables, called an **f-string**. It gets its own lesson, [Formatting Output with f-strings](/lessons/python/f-strings), so for now, commas will do.

## Changing a variable

A variable is called a variable because its value can vary. Assign to the same name again, and the tag moves to the new value:

```python
lives = 3
lives = 2
lives = lives - 1
print(lives)
```

```text
1
```

The last assignment looks odd if you read `=` as "equals." Read it as "gets" instead: "lives gets lives minus 1." Python works out the right side first, using the current value, then moves the tag to the answer.

Updating a variable by a little is so common that Python has a shortcut. `lives -= 1` means exactly `lives = lives - 1`, and `score += 10` means `score = score + 10`.

## No type needed

If you've taken the [Java track](/lessons/java/variables), you might be waiting for the part where you say what *type* the variable is. In Python, you don't. The value already knows what it is:

```python
level = 5            # a whole number
temperature = 36.6   # a decimal
player = "Ben"       # text
is_ready = True      # True or False
```

You can even move a name tag from one kind of value to a completely different kind:

```python
answer = 42
answer = "forty-two"
print(answer)
```

```text
forty-two
```

That flexibility is handy, but it's also a way to confuse yourself. If a variable holds a number in one place and text in another, the rest of your code has to guess which it's getting. A good habit: keep each variable holding one kind of thing. [Numbers, Strings, and Booleans](/lessons/python/data-types) covers the kinds of values in detail.

## You have to create it before you use it

Using a name before you've assigned anything to it doesn't work:

```python
print(age)  # error: NameError: name 'age' is not defined
age = 17
```

Python runs your code from top to bottom. When it reaches `print(age)`, the tag doesn't exist yet. Swap the two lines, and it works.

The same error appears when you misspell a name, which is far more common. Recent versions of Python even try to guess what you meant:

```python
score = 88
print(scroe)  # error: NameError: name 'scroe' is not defined. Did you mean: 'score'?
```

When you see `NameError`, check two things: is the name spelled exactly the same everywhere, and was it assigned *above* this line?

## Naming rules

Python has a few hard rules for variable names:

- Use letters, digits, and underscores, but don't start with a digit. `score2` works; `2score` doesn't.
- No spaces or hyphens. `quiz-score` would be read as "quiz minus score."
- Names can't be Python's own keywords, like `if`, `for`, `class`, `True`, or `def`.
- Names are case-sensitive: `score` and `Score` are two different variables.

Break one, and Python stops before running anything:

```python
2score = 10  # error: SyntaxError: invalid decimal literal
```

```python
class = "11-B"  # error: SyntaxError: invalid syntax
```

## Naming habits

Beyond the rules, Python programmers follow a style guide called **PEP 8**. For variables, it says:

- Use **snake_case**: all lowercase, with underscores between words. `quiz_score`, `first_name`, `is_logged_in`.
- Say what's inside. `average_score` beats `avg`, and `avg` beats `x`.
- Name True-or-False values like yes-or-no questions: `is_ready`, `has_paid`, `can_vote`.

If you know JavaScript or Java, notice the difference: those languages use camelCase (`quizScore`). Python uses snake_case. Neither is more correct, but mixing them in one program makes it harder to read.

## Constants

Some values should never change while a program runs: the number of lives at the start of a game, a tax rate, the maximum score. Python doesn't have a way to lock a variable. Instead, programmers write the name in **ALL_CAPS** as a signal to everyone reading:

```python
MAX_SCORE = 100
PASSING_SCORE = 75
```

Python will still let you change `MAX_SCORE` later. The capital letters are a promise between programmers, not a rule Python enforces. Keep the promise, and put constants near the top of your file so they're easy to find and change.

## Two handy tricks

You can assign several variables in one line, matching names to values in order:

```python
x, y = 3, 4
print(x, y)
```

```text
3 4
```

And the same trick swaps two values without needing a third variable:

```python
first, second = "Maria", "Ben"
first, second = second, first
print(first, second)
```

```text
Ben Maria
```

Python works out everything on the right side first, then assigns it all at once. In most other languages, a swap takes three lines.

## Try it

This program keeps track of a player during a short game. Read it line by line, keep track of what each name is attached to, and predict exactly what it prints before you open the answer.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'STARTING_LIVES = 3\nPOINTS_PER_COIN = 10\n\nplayer_name = &quot;Maria&quot;\nlives = STARTING_LIVES\nscore = 0\n\nprint(player_name, &quot;starts with&quot;, lives, &quot;lives&quot;)\n\nscore += 5 * POINTS_PER_COIN\nprint(&quot;Collected 5 coins. Score:&quot;, score)\n\nlives -= 1\nprint(&quot;Ouch! Lives left:&quot;, lives)\n\nscore = score + 25\nprint(&quot;Found a gem. Score:&quot;, score)\n\nplayer_name = &quot;Maria the Brave&quot;\nlives, score = lives + 1, score * 2\nprint(player_name, &quot;has&quot;, lives, &quot;lives and&quot;, score, &quot;points&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria starts with 3 lives
Collected 5 coins. Score: 50
Ouch! Lives left: 2
Found a gem. Score: 75
Maria the Brave has 3 lives and 150 points
```

On the last assignment, both right-hand values are worked out first, using the old `lives` (2) and the old `score` (75), and only then do the two names move to `3` and `150`.
:::

## Try it yourself

1. Add a variable for the player's level, starting at `1`, and print it with a label. Then add a line that raises it by one using `+=`.
2. Change `print("Ouch! Lives left:", lives)` so it misspells `lives` as `live`. What error would you get, and what would Python suggest? Change it back.
3. Add a variable called `high_score` that starts at `120`. At the end, print whether the player beat it, using `print("New high score?", score > high_score)`.

## Check your understanding

<Quiz
	question="Which line correctly creates a Python variable holding the number 17?"
	:options="['int age = 17', 'age = 17', 'age == 17', 'let age = 17']"
	:answer-index="1"
	explanation="Python needs just a name, =, and a value. There's no type in front, == compares instead of assigning, and let is JavaScript."
/>

<Quiz
	question="What does this print? points = 10, then points = points + 5, then print(points)"
	:options="['10', 'points + 5', '5', '15']"
	:answer-index="3"
	explanation="Python works out the right side first using the current value (10 + 5), then moves the name to the answer, 15."
/>

<Quiz
	question="Which name follows Python's naming style for a variable?"
	:options="['first_name', 'firstName', 'FirstName', 'first-name']"
	:answer-index="0"
	explanation="Python uses snake_case for variables: lowercase words joined with underscores. first-name isn't even a valid name, since the hyphen reads as a minus sign."
/>

## Up next

Your name tags can hold whole numbers, decimals, text, and True or False. What exactly are those kinds of values, and what can you do with each one? That's [Numbers, Strings, and Booleans](/lessons/python/data-types).
