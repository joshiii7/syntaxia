---
title: "Python input(): Read What the User Types"
description: "Make your Python programs interactive with input(): ask a question, read the answer as text, convert it to a number, and handle answers you didn't expect."
---

# Reading User Input with input()

*Until now, your programs talked and never listened. Time to hand the user a microphone.*

Every program so far has printed the same thing every time it ran, because every value was typed right into the code. Real programs ask questions. A quiz asks for your answer. A calculator asks for numbers. A game asks for your name.

In Python, asking a question and waiting for the answer takes one function: **`input()`**.

## A waiter taking your order

Think of a waiter at a restaurant. They come to your table, ask a question, and then wait, notepad ready, until you answer. They don't walk away halfway through your sentence, and they don't guess.

`input()` is your program's waiter. When Python reaches it, the program pauses and waits until the user types something and presses **Enter**. Then `input()` hands back exactly what they typed.

## Asking a question

```python
name = input("What's your name? ")
print("Nice to meet you,", name)
```

When you run it, the question appears, and the program waits. If the user types `Maria` and presses Enter, the terminal looks like this:

```text
What's your name? Maria
Nice to meet you, Maria
```

- The text inside `input(...)` is the **prompt**: the question shown to the user. It's optional, but always include one, so the user knows what you're waiting for.
- Notice the space at the end of `"What's your name? "`. Without it, the user's answer would be squashed right up against the question mark.
- `input()` gives back what the user typed, *without* the Enter key, and you store it in a variable like any other value.

## Input is always text

Here's the one rule to remember about `input()`: **it always gives back a string**, even when the user types digits.

```python
age = input("How old are you? ")
print(age + 1)  # error: TypeError: can only concatenate str (not "int") to str
```

The user typed `17`, but `age` holds the text `"17"`, not the number 17. And as you saw in [Numbers, Strings, and Booleans](/lessons/python/data-types), Python won't add a number to text.

The fix is the conversion you learned in [Type Conversion](/lessons/python/type-conversion). Wrap `input()` in `int()` or `float()`:

```python
age = int(input("How old are you? "))
print("Next year you'll be", age + 1)
```

```text
How old are you? 17
Next year you'll be 18
```

Read the first line from the inside out: `input()` asks and gets the text `"17"`, then `int()` turns it into the number `17`, then it's stored in `age`.

Use `int()` for whole numbers, like ages and counts, and `float()` for anything that might have a decimal point, like prices, heights, and test scores.

## When the user types something unexpected

What if someone types `seventeen` when you asked for their age?

```text
How old are you? seventeen
Traceback (most recent call last):
  ...
ValueError: invalid literal for int() with base 10: 'seventeen'
```

`int()` can't turn that into a number, so the program crashes with a `ValueError`. Users type unexpected things all the time. For now, write clear prompts that say what kind of answer you want, like `"How old are you? (a number) "`. In [Exceptions](/lessons/python/exceptions), you'll learn to catch this problem and politely ask again instead of crashing.

## Cleaning up the answer

People often type extra spaces by accident, or use capital letters when you didn't expect them. Two string methods tidy that up:

- `.strip()` removes spaces from both ends.
- `.lower()` turns every letter into lowercase.

```python
answer = input("Do you want to continue? (yes/no) ").strip().lower()
print("You said:", answer)
```

```text
Do you want to continue? (yes/no)   YES
You said: yes
```

The user typed `YES` with spaces in front of it, but after `.strip().lower()`, the program only has to check for `"yes"`. You'll meet many more string methods in [Working with Strings](/lessons/python/strings).

## No leftover-Enter trap

If you've taken the [Java track](/lessons/java/user-input), you might remember the classic trap there: reading a number, then a line of text, and getting an empty string because the Enter key was left behind. Python doesn't have that problem. Every `input()` reads one whole line, including the Enter, and gives back everything before it. You can mix numbers and text freely.

## Try it

This program asks three questions and prints a summary. Suppose the user types `Maria`, then `11`, then `92.5`. Predict exactly what the terminal will show, including the lines the user typed.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="320px"
	:model-value="'name = input(&quot;What\'s your name? &quot;).strip()\ngrade = int(input(&quot;What grade are you in? &quot;))\nscore = float(input(&quot;What was your last test score? &quot;))\n\nprint()\nprint(&quot;Hi,&quot;, name + &quot;!&quot;)\nprint(&quot;Next year you\'ll be in grade&quot;, grade + 1, end=&quot;.\\n&quot;)\nprint(&quot;You need&quot;, 100 - score, &quot;more points for a perfect score.&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon, and reading typed answers needs a real terminal anyway. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save this as `main.py`, run it with `python main.py` (or `python3 main.py` on macOS and Linux), and type your answers when it asks.
:::

::: details Check your prediction
```text
What's your name? Maria
What grade are you in? 11
What was your last test score? 92.5

Hi, Maria!
Next year you'll be in grade 12.
You need 7.5 more points for a perfect score.
```

The words after each question mark are what the user typed. The empty `print()` prints a blank line before the summary. `name + "!"` joins the exclamation mark straight onto the name with no space, and `end=".\n"` puts a period at the end of the grade line instead of starting a new line right away.
:::

## Try it yourself

1. Run the program on your computer and answer with your own details.
2. Add a fourth question, "What's your favorite subject?", and print it as part of the summary.
3. Run it again and type `eleven` for the grade. Which line fails, and what's the name of the error?

## Check your understanding

<Quiz
	question="The user types 25 when input() asks for their age. What type of value does input() give back?"
	:options="['int', 'float', 'str', 'It depends on what they type']"
	:answer-index="2"
	explanation="input() always gives back a string. Convert it with int() or float() before doing math."
/>

<Quiz
	question="Which line reads a decimal number, like a price, from the user?"
	:options="['price = input(float(&quot;Price? &quot;))', 'price = float(input(&quot;Price? &quot;))', 'price = input(&quot;Price? &quot;).float()', 'price = int(input(&quot;Price? &quot;))']"
	:answer-index="1"
	explanation="input() asks and gives back text, then float() converts it. int() would fail on text like 4.99."
/>

<Quiz
	question="Why put .strip().lower() after input() when asking a yes-or-no question?"
	:options="['To remove extra spaces and capitals, so &quot;  YES&quot; still counts as &quot;yes&quot;', 'To convert the answer into a number', 'To make input() wait longer', 'It is required for input() to work']"
	:answer-index="0"
	explanation="strip() removes spaces at both ends, and lower() makes every letter lowercase, so the program only has to check one spelling."
/>

## Up next

Your programs can now take in text from a user. What can you do with it? Plenty: measure it, search it, cut it up, and change it. That's [Working with Strings](/lessons/python/strings).
