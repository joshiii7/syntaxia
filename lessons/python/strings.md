---
title: "Python Strings: Indexing, Slicing, and String Methods"
description: "Work with text in Python: read characters by index, cut out pieces with slicing, and use string methods like upper, strip, replace, find, split, and join."
---

# Working with Strings

*A string is a row of beads on a thread. Each bead is one character, and each has a numbered spot.*

You've been using strings since your very first program: printing them, joining them with `+`, and reading them from the user with `input()`. Now it's time to really work with them: count their characters, pull out pieces, search inside them, and clean them up.

Text is everywhere in real programs (names, messages, file contents, web pages), so this is one of the most useful lessons in the track.

## Beads on a thread

Picture a bracelet of letter beads that spells `PYTHON`. The beads sit in a fixed order, and you can number them. Python numbers them starting from **zero**:

```text
 P   Y   T   H   O   N
 0   1   2   3   4   5
-6  -5  -4  -3  -2  -1
```

The number of a bead is its **index**. The first character is at index 0, and the last is at index `len(word) - 1`. Counting from zero feels odd at first, but lists work exactly the same way, so it's worth getting used to now.

Look at the bottom row. Python also lets you count **backwards** from the end with negative numbers: `-1` is the last character, `-2` the one before it, and so on.

## Reading one character

Put an index in square brackets after a string to get that character:

```python
word = "PYTHON"
print(word[0])
print(word[3])
print(word[-1])
```

```text
P
H
N
```

`word[-1]` is the easiest way to get the last character, however long the string is.

Ask for an index that doesn't exist, and Python stops you:

```python
word = "PYTHON"
print(word[6])  # error: IndexError: string index out of range
```

A 6-character string has indexes 0 to 5. There's no bead number 6.

## Cutting out pieces: slicing

To get several characters at once, give a start and an end, separated by a colon. This is called **slicing**:

```python
name = "Maria Santos"
print(name[0:5])
print(name[6:12])
```

```text
Maria
Santos
```

The start is **included**, but the end is **not**. `name[0:5]` gives you the characters at indexes 0, 1, 2, 3, and 4. A nice side effect: end minus start is the length of the piece. `5 - 0` is 5 characters.

You can leave out either end. A missing start means "from the beginning," and a missing end means "to the end":

```python
name = "Maria Santos"
print(name[:5])
print(name[6:])
print(name[-6:])
```

```text
Maria
Santos
Santos
```

And unlike indexing, slicing never crashes. Ask for more than exists, and you just get what's there: `"Hi"[0:100]` is `"Hi"`.

## Strings never change

Here's a surprise:

```python
name = "maria"
name.upper()
print(name)
```

```text
maria
```

Why is it still lowercase? Because **strings in Python can never be changed**. They're **immutable**. `upper()` doesn't change the original; it builds a brand new string and gives it back. The code above made `"MARIA"` and then threw it away.

To keep the result, store it:

```python
name = "maria"
name = name.upper()
print(name)
```

```text
MARIA
```

Every string method works this way. If a method seems to do nothing, check whether you forgot to save what it gave back.

Immutability also means you can't replace a single character:

```python
name = "maria"
name[0] = "M"  # error: TypeError: 'str' object does not support item assignment
```

Build a new string instead: `name = "M" + name[1:]`.

## String methods you'll use constantly

A **method** is a function that belongs to a value, called with a dot after it. Here are the string methods you'll reach for most, using `school = "  Rizal High School  "` (with spaces at both ends):

| Method | What it does | Example | Result |
|---|---|---|---|
| `strip()` | remove spaces at both ends | `school.strip()` | `"Rizal High School"` |
| `upper()` | all capitals | `"hi".upper()` | `"HI"` |
| `lower()` | all lowercase | `"Hi".lower()` | `"hi"` |
| `title()` | capitalize each word | `"maria santos".title()` | `"Maria Santos"` |
| `replace(a, b)` | swap every `a` for `b` | `"a-b-c".replace("-", "+")` | `"a+b+c"` |
| `find(text)` | where `text` first appears | `"banana".find("n")` | `2` |
| `count(text)` | how many times `text` appears | `"banana".count("a")` | `3` |
| `startswith(text)` | does it begin with `text`? | `"Python".startswith("Py")` | `True` |
| `endswith(text)` | does it end with `text`? | `"notes.txt".endswith(".txt")` | `True` |
| `isdigit()` | are all characters digits? | `"2026".isdigit()` | `True` |

If `find` can't find the text, it gives back `-1`. That's how you know something isn't there.

## Is it in there? `in`

The simplest way to check whether one piece of text appears inside another is the `in` operator:

```python
sentence = "The quick brown fox"
print("fox" in sentence)
print("Fox" in sentence)
print("cat" not in sentence)
```

```text
True
False
True
```

Like `==`, `in` cares about capital letters. To ignore them, lowercase both sides first: `"fox" in sentence.lower()`.

## Splitting and joining

Two methods turn strings into lists of pieces and back again. `split()` cuts a string apart:

```python
sentence = "the quick brown fox"
words = sentence.split()
print(words)
print(len(words))
```

```text
['the', 'quick', 'brown', 'fox']
4
```

With no argument, `split()` cuts at spaces. Give it something else to cut there instead: `"88,94,72".split(",")` gives `['88', '94', '72']`. The result is a **list**, written with square brackets. You'll learn all about lists in [Lists](/lessons/python/lists).

`join()` does the reverse. It glues a list of strings together, with the string you call it on placed between each piece:

```python
words = ["2026", "09", "29"]
print("-".join(words))
print(" / ".join(words))
```

```text
2026-09-29
2026 / 09 / 29
```

## Joining, repeating, and comparing

You already know `+` joins strings and `*` repeats them. Together with the methods above, that covers a lot:

```python
first = "maria"
last = "santos"
full = first.title() + " " + last.title()
print(full)
print("=" * len(full))
```

```text
Maria Santos
============
```

Comparing with `==` checks for exactly the same characters. To compare without caring about capitals, lowercase both sides:

```python
answer = "MANILA"
print(answer == "Manila")
print(answer.lower() == "manila")
```

```text
False
True
```

## Strings over several lines

For text that spans several lines, use **triple quotes**. Line breaks inside them are kept:

```python
message = """Dear Maria,
Your library book is due tomorrow.
Thank you!"""
print(message)
```

```text
Dear Maria,
Your library book is due tomorrow.
Thank you!
```

## Try it

This program tidies up a messy name, takes it apart, and checks a password rule. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="400px"
	:model-value="'raw_name = &quot;   maria SANTOS  &quot;\nname = raw_name.strip().title()\nprint(&quot;Cleaned: [&quot; + name + &quot;]&quot;)\nprint(&quot;Length:&quot;, len(name))\n\nspace = name.find(&quot; &quot;)\nfirst = name[:space]\nlast = name[space + 1:]\nprint(&quot;First:&quot;, first)\nprint(&quot;Last:&quot;, last.upper())\nprint(&quot;Initials:&quot;, first[0] + last[0])\n\nname.lower()\nprint(&quot;After lower():&quot;, name)\n\npassword = &quot;sunflower7&quot;\nprint(&quot;Has a digit?&quot;, &quot;7&quot; in password)\nprint(&quot;Long enough?&quot;, len(password) &gt;= 8)\nprint(&quot;Hidden:&quot;, password[0] + &quot;*&quot; * (len(password) - 2) + password[-1])\nprint(&quot;Words:&quot;, &quot;-&quot;.join(&quot;red green blue&quot;.split()))\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Cleaned: [Maria Santos]
Length: 12
First: Maria
Last: SANTOS
Initials: MS
After lower(): Maria Santos
Has a digit? True
Long enough? True
Hidden: s********7
Words: red-green-blue
```

`.strip().title()` removes the outer spaces and fixes the capitals in one line. `name.lower()` on its own line built a lowercase copy and threw it away, so `name` is unchanged. The hidden password keeps the first and last characters and replaces the 8 in between with stars.
:::

## Try it yourself

1. Print the name backwards. (Hint: a slice can take a third number, the **step**. `name[::-1]` steps backwards through the whole string.)
2. Add a check that prints whether `password` has any capital letters, by comparing it with `password.lower()`.
3. Given `sentence = "I love Python and Python loves me"`, print how many times `"Python"` appears, and then the sentence with every `"Python"` replaced by `"coding"`.

## Check your understanding

<Quiz
	question="What is &quot;Python&quot;[1]?"
	:options="['P', 'y', 't', 'An error']"
	:answer-index="1"
	explanation="Indexes start at 0, so P is at index 0 and y is at index 1."
/>

<Quiz
	question="What does &quot;Maria Santos&quot;[0:5] give back?"
	:options="['Maria ', 'Mari', 'aria ', 'Maria']"
	:answer-index="3"
	explanation="The start index is included and the end index is not, so you get the characters at indexes 0 through 4."
/>

<Quiz
	question="name = &quot;ben&quot;, then name.upper() on its own line. What is name now?"
	:options="['&quot;ben&quot;, because strings never change and the result was not saved', '&quot;BEN&quot;', '&quot;Ben&quot;', 'None']"
	:answer-index="0"
	explanation="upper() gives back a new string. To keep it, write name = name.upper()."
/>

## Up next

Joining strings with `+` and `str()` works, but it gets messy fast, especially with numbers and decimals. Python has a much cleaner way to build text from values: [Formatting Output with f-strings](/lessons/python/f-strings).
