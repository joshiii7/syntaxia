---
title: "Python File I/O: Read and Write Text Files with open()"
description: "Save and load data in Python: write and read text files with open() and with, add to files, go through them line by line, and handle missing files safely."
---

# Reading and Writing Files

*A whiteboard is wiped clean at the end of every class. A notebook is still there tomorrow.*

Every program you've written so far has had the memory of a whiteboard. Variables, lists, dictionaries, objects: they all live in the computer's memory while the program runs, and the moment it ends, everything is wiped. Run it again, and it starts from nothing.

Real programs remember. A to-do app keeps yesterday's tasks. A game keeps your high score. To do that, a program has to save its data somewhere that lasts: a **file**.

Working with files is called **file I/O**, short for **input/output**: reading data *in* from a file, and writing data *out* to one.

## Whiteboards and notebooks

During class, a teacher writes on the whiteboard. It's fast and easy to change, but it's wiped at the end of the day. Anything worth keeping gets copied into a notebook, which is still there next week.

Memory is the whiteboard. A file is the notebook. Your program works in memory, **saves** to a file when something needs to last, and **loads** it back the next time it runs.

This lesson sticks to **text files**: plain files, like `.txt` or `.csv`, that you can also open in any text editor, which makes them easy to check while you're learning.

## Writing a file

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("Remember to study for the quiz!\n")
    file.write("Bring a calculator.\n")

print("Saved.")
```

```text
Saved.
```

Run that, and a file called `note.txt` appears in the folder where your program ran, with two lines in it. Piece by piece:

- `open(...)` opens a file and gives back a **file object** to work with.
- `"note.txt"` is the file's name. A plain name like this means "in the current folder," which is usually the folder you ran the program from.
- `"w"` is the **mode**: **w**rite. It creates the file if it doesn't exist, and **erases everything in it** if it does. Be careful with that.
- `encoding="utf-8"` says how to store the characters. Always include it for text, so letters like `ñ` and `é` are saved correctly on every computer.
- `with ... as file:` gives the file object the name `file`, for the indented block.
- `file.write(...)` writes text. Unlike `print`, it doesn't add a new line for you, so each line ends with `\n`.

## Why `with`?

An open file is like a borrowed library book: other programs may be waiting for it, and some of what you wrote might not be saved until it's handed back. You must always **close** a file when you're done.

The `with` statement does that for you. When the indented block ends, the file is closed automatically, even if an exception happened partway through, like the `finally` from [Exceptions](/lessons/python/exceptions). Always open files with `with`, and you'll never forget.

## Reading a file

To read, open with mode `"r"` (**r**ead). The simplest way to get the contents is `read()`, which gives back the whole file as one string:

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("Remember to study for the quiz!\nBring a calculator.\n")

with open("note.txt", "r", encoding="utf-8") as file:
    contents = file.read()

print(contents)
print(len(contents), "characters")
```

```text
Remember to study for the quiz!
Bring a calculator.

52 characters
```

(The blank line in the output is because the file's last line ends with `\n`, and `print` adds one more.) `"r"` is the default mode, so `open("note.txt", encoding="utf-8")` means the same thing.

## Reading line by line

Most of the time, you'll want one line at a time. A `for` loop over a file object gives you each line in turn:

```python
with open("note.txt", "w", encoding="utf-8") as file:
    file.write("Remember to study for the quiz!\nBring a calculator.\n")

with open("note.txt", encoding="utf-8") as file:
    for number, line in enumerate(file, start=1):
        print(number, line.strip())
```

```text
1 Remember to study for the quiz!
2 Bring a calculator.
```

Each line comes with its `\n` still on the end, so `.strip()`, from [Working with Strings](/lessons/python/strings), removes it. Forget the `strip()`, and you'll get an extra blank line after each one.

Looping like this reads one line at a time, so it works even for huge files that wouldn't fit in memory all at once.

## Adding to a file

Mode `"w"` erases the file first. To **a**dd to the end instead, use mode `"a"` (append). It also creates the file if it's missing:

```python
with open("log.txt", "w", encoding="utf-8") as file:
    file.write("Program started\n")

with open("log.txt", "a", encoding="utf-8") as file:
    file.write("Quiz saved\n")

with open("log.txt", encoding="utf-8") as file:
    print(file.read().strip())
```

```text
Program started
Quiz saved
```

| Mode | Meaning | If the file exists | If it doesn't |
|---|---|---|---|
| `"r"` | read | reads it | `FileNotFoundError` |
| `"w"` | write | **erases** it, then writes | creates it |
| `"a"` | append | adds to the end | creates it |

## Saving data, not just text

A file only holds text. To save your program's data, turn it into lines of text, and to load it, take each line apart again. A simple, common format is values separated by commas, called **CSV** (comma-separated values):

```python
scores = {"Maria": 91, "Ben": 84, "Carlo": 95}

with open("scores.csv", "w", encoding="utf-8") as file:
    for name, score in scores.items():
        file.write(f"{name},{score}\n")

loaded = {}
with open("scores.csv", encoding="utf-8") as file:
    for line in file:
        name, score = line.strip().split(",")
        loaded[name] = int(score)

print(loaded)
```

```text
{'Maria': 91, 'Ben': 84, 'Carlo': 95}
```

Loading reverses saving: `strip()` removes the new line, `split(",")` cuts the line apart, and `int()` turns the score back into a number, since everything in a text file is a string. (For more complicated data, like the nested structures from [Nested Data Structures](/lessons/python/nested-data), there's a much easier format coming in the next lesson: [Working with JSON](/lessons/python/json).)

## Missing files

The first time a program runs, its save file usually doesn't exist yet. Opening a missing file for reading raises a `FileNotFoundError`:

```python
open("missing.txt", encoding="utf-8")  # error: FileNotFoundError: [Errno 2] No such file or directory: 'missing.txt'
```

Catch it, and start fresh instead of crashing:

```python
try:
    with open("high_score.txt", encoding="utf-8") as file:
        high_score = int(file.read())
except FileNotFoundError:
    high_score = 0

print("High score:", high_score)
```

```text
High score: 0
```

Files that people edit by hand can contain mistakes too, like a blank line, or letters where a number should be. Catch `ValueError` around the conversion, and skip bad lines with a warning, as in the Try it below.

## Try it

This program saves a small gradebook to a CSV file, appends a late entry, then loads the file back, skipping a broken line, and prints a summary. It finishes by trying to read a file that doesn't exist. Predict the output.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="520px"
	:model-value="'rows = [&quot;Maria,91&quot;, &quot;Ben,eighty&quot;, &quot;Carlo,95&quot;]\n\nwith open(&quot;grades.csv&quot;, &quot;w&quot;, encoding=&quot;utf-8&quot;) as file:\n    for row in rows:\n        file.write(row + &quot;\\n&quot;)\n\nwith open(&quot;grades.csv&quot;, &quot;a&quot;, encoding=&quot;utf-8&quot;) as file:\n    file.write(&quot;Dina,78\\n&quot;)\n\nprint(f&quot;Saved {len(rows) + 1} rows to grades.csv&quot;)\n\ntotal = 0\ncount = 0\nwith open(&quot;grades.csv&quot;, encoding=&quot;utf-8&quot;) as file:\n    for line in file:\n        name, text = line.strip().split(&quot;,&quot;)\n        try:\n            score = int(text)\n        except ValueError:\n            print(f&quot;  Skipping bad line: {line.strip()}&quot;)\n            continue\n        total += score\n        count += 1\n        print(f&quot;  {name}: {score}&quot;)\n\nprint(f&quot;Class average: {total / count:.1f}&quot;)\n\ntry:\n    with open(&quot;missing.csv&quot;, encoding=&quot;utf-8&quot;) as file:\n        print(file.read())\nexcept FileNotFoundError:\n    print(&quot;Couldn\'t find missing.csv, starting fresh.&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux). Then look in the same folder: a new `grades.csv` file will be there. Open it in your editor to see exactly what was saved.
:::

::: details Check your prediction
```text
Saved 4 rows to grades.csv
  Maria: 91
  Skipping bad line: Ben,eighty
  Carlo: 95
  Dina: 78
Class average: 88.0
Couldn't find missing.csv, starting fresh.
```

Mode `"w"` created the file with three lines, and mode `"a"` added Dina to the end. Ben's line has `eighty` instead of a number, so `int()` raises a `ValueError`, and `continue` skips just that line. The missing file raises `FileNotFoundError`, which the last `except` catches.
:::

## Try it yourself

1. Run the program twice. Does `grades.csv` end up with Dina listed twice? Why or why not? (Hint: what does mode `"w"` do to an existing file?)
2. Open `grades.csv` in your editor, fix Ben's line to `Ben,80`, and write a second small program that only reads the file and prints the average.
3. Add a blank line to the middle of `grades.csv` by hand, then run your reading program. Which error do you get, and how would you skip blank lines? (Hint: `if not line.strip(): continue`.)

## Check your understanding

<Quiz
	question="What does opening a file with mode &quot;w&quot; do if the file already exists?"
	:options="['Adds to the end', 'Raises an error', 'Erases everything in it, then writes', 'Asks the user first']"
	:answer-index="2"
	explanation="&quot;w&quot; starts the file over. Use &quot;a&quot; to add to the end instead."
/>

<Quiz
	question="Why open files with the with statement?"
	:options="['The file is closed automatically when the block ends, even if an error happens', 'It makes reading faster', 'It is the only way to write files', 'It prevents FileNotFoundError']"
	:answer-index="0"
	explanation="with guarantees the file is closed, so everything is saved and nothing is left open."
/>

<Quiz
	question="You loop through a file with for line in file:. Why call line.strip()?"
	:options="['To make the text lowercase', 'To read the next line', 'To close the file', 'To remove the new-line character at the end of each line']"
	:answer-index="3"
	explanation="Every line read from a file keeps its \n. strip() removes it, along with any spaces at the ends."
/>

## Up next

Saving data as lines of commas works for simple tables, but it gets awkward for anything nested, like a list of students where each has a list of scores. There's a standard format built for exactly that, used by nearly every website and app: [Working with JSON](/lessons/python/json).
