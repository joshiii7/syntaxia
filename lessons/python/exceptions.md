---
title: "Python Exceptions: try, except, else, finally, and raise"
description: "Handle problems in Python without crashing: catch errors with try and except, retry bad input, clean up with finally, and raise your own exceptions."
---

# Exceptions: try, except, and raise

*A trapeze artist still slips sometimes. The net underneath doesn't stop the fall. It stops the fall from being the end of the show.*

Throughout this track, programs have crashed with messages like `ValueError` and `ZeroDivisionError`. In [Debugging Python Programs](/lessons/python/debugging), you learned to read them. But some of these problems aren't bugs in your code at all:

- A user types `seventeen` when you asked for their age.
- A file your program needs has been moved or deleted.
- The internet connection drops halfway through a download.

You can't prevent these. What you *can* do is plan for them, so your program responds sensibly, with a clear message or a second chance, instead of crashing. In Python, these problems are called **exceptions**, and you handle them with `try` and `except`.

## A safety net

A trapeze artist practices for years, but still, occasionally, misses a catch. That's why there's a net. The net doesn't stop the fall. It **catches** it, so the artist can climb back up and carry on.

When something goes wrong in Python, the line that failed **raises** an exception: an object describing the problem. If there's a safety net, an `except` block, waiting to catch it, the program carries on. If there's no net, the exception falls all the way out of your program, and it crashes with a traceback.

## `try` and `except`

Put the risky code in a `try` block, and the safety net in an `except` block right after it:

```python
typed = "seventeen"

try:
    age = int(typed)
    print("Next year you'll be", age + 1)
except ValueError:
    print(f"'{typed}' isn't a number. Please use digits, like 17.")

print("The program keeps running.")
```

```text
'seventeen' isn't a number. Please use digits, like 17.
The program keeps running.
```

Here's what happens:

1. Python runs the `try` block, line by line.
2. `int(typed)` fails and raises a `ValueError`.
3. Python **immediately** stops running the `try` block. The line that would print "Next year..." is skipped.
4. Python jumps to the matching `except` block and runs it.
5. After the `except`, the program carries on normally.

If nothing goes wrong in the `try` block, the `except` block is skipped entirely.

## Asking again until the answer is valid

Put `try` and `except` inside a `while True` loop from [break and continue](/lessons/python/break-and-continue), and you can keep asking until the user gets it right. This is the fix promised back in [Reading User Input](/lessons/python/user-input):

```python
while True:
    try:
        age = int(input("How old are you? "))
        break
    except ValueError:
        print("Please type a whole number, like 17.")

print("Thanks! You're", age)
```

```text
How old are you? seventeen
Please type a whole number, like 17.
How old are you? 17
Thanks! You're 17
```

`break` only runs if `int()` succeeded, so the loop only ends with a good answer.

## Several kinds of problems

Different problems might need different responses. You can have several `except` blocks, and Python uses the first one that matches:

```python
scores = [88, 94, 72]
typed_index = "5"

try:
    index = int(typed_index)
    print("Score:", scores[index])
except ValueError:
    print("That's not a number.")
except IndexError:
    print(f"There's no score number {typed_index}.")
```

```text
There's no score number 5.
```

If two kinds need the same response, catch them together, in parentheses: `except (ValueError, IndexError):`.

## Getting the details: `as`

Add `as` and a name to get the exception object itself. Printing it shows Python's own message:

```python
try:
    result = 10 / 0
except ZeroDivisionError as error:
    print("Something went wrong:", error)
```

```text
Something went wrong: division by zero
```

## Don't catch everything

It's tempting to write a net that catches every possible problem:

```python
try:
    age = int(input("Age: "))
except:
    print("Something went wrong.")
```

Don't. A bare `except:` catches *everything*, including bugs you'd want to know about, like a misspelled variable name, and even your attempts to stop the program with Ctrl + C. Your program keeps going with bad data, and you get no clue why.

Catch the **specific** exceptions you expect and have a plan for. Let real bugs crash loudly, so you notice and fix them. And never write an `except` block that just does nothing: if you can't handle the problem usefully, at least print a message.

## `else` and `finally`

A `try` statement has two more optional parts:

- **`else`** runs only if the `try` block finished *without* an exception. It's a good place for code that should only run when everything worked.
- **`finally`** runs **no matter what**: after success, after an exception, even if there's a `return`. It's the place for cleanup that must always happen.

```python
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Can't divide by zero.")
    else:
        print("Result:", result)
    finally:
        print("Done dividing.")

divide(10, 4)
divide(10, 0)
```

```text
Result: 2.5
Done dividing.
Can't divide by zero.
Done dividing.
```

You'll see `finally`-style cleanup again in [Reading and Writing Files](/lessons/python/file-io), where Python's `with` statement does it for you.

## Raising your own exceptions

So far, Python's own code has done the raising. Your code can raise exceptions too, with **`raise`**. This is the right response when a function is given data it can't work with:

```python
def set_grade(level):
    if not 1 <= level <= 12:
        raise ValueError(f"Grade level must be 1 to 12, got {level}")
    return level

print(set_grade(11))
print(set_grade(15))  # error: ValueError: Grade level must be 1 to 12, got 15
```

`raise ValueError("...")` creates an exception with your message and throws it. The function stops right there, and whoever called it can catch it with `except ValueError`, or let the program crash with a clear message.

Raising is better than quietly "fixing" bad data, like silently changing 15 to 12. It makes mistakes visible right where they happen, instead of letting a wrong value cause a confusing problem much later.

`ValueError` fits most "this value doesn't make sense" situations, and `TypeError` fits "this is the wrong kind of value." For bigger programs, you can even make your own exception types, with a class that inherits from `Exception`, using the inheritance you learned in [Inheritance](/lessons/python/inheritance):

```python
class OutOfStockError(Exception):
    pass

try:
    raise OutOfStockError("No more adobo today.")
except OutOfStockError as error:
    print("Sorry:", error)
```

```text
Sorry: No more adobo today.
```

## Try it

This program loads a list of scores typed as text, where some entries are broken. It skips bad entries, raises its own exception for scores outside 0 to 100, and reports on every entry with `finally`. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="460px"
	:model-value="'def parse_score(text):\n    score = int(text)\n    if not 0 &lt;= score &lt;= 100:\n        raise ValueError(f&quot;score {score} is outside 0 to 100&quot;)\n    return score\n\n\nentries = [&quot;88&quot;, &quot;ninety&quot;, &quot;105&quot;, &quot;72&quot;, &quot;&quot;]\nvalid = []\n\nfor entry in entries:\n    try:\n        score = parse_score(entry)\n    except ValueError as error:\n        print(f&quot;Skipped {entry!r}: {error}&quot;)\n    else:\n        valid.append(score)\n        print(&quot;OK:&quot;, score)\n    finally:\n        print(f&quot;  (checked {entry!r})&quot;)\n\nif valid:\n    print(f&quot;Average of {len(valid)} valid scores: {sum(valid) / len(valid)}&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
OK: 88
  (checked '88')
Skipped 'ninety': invalid literal for int() with base 10: 'ninety'
  (checked 'ninety')
Skipped '105': score 105 is outside 0 to 100
  (checked '105')
OK: 72
  (checked '72')
Skipped '': invalid literal for int() with base 10: ''
  (checked '')
Average of 2 valid scores: 80.0
```

`"ninety"` and the empty string fail inside `int()`, which raises a `ValueError` with Python's own message. `"105"` converts fine, but `parse_score` raises its own `ValueError` with a custom message. One `except` catches both kinds, since they're the same type. `else` only runs for the good entries, and `finally` runs for all five.
:::

## Try it yourself

1. Add `"-3"` and `"100"` to the entries. Predict what each one prints.
2. Change `parse_score` so an empty string raises `ValueError("empty entry")` before calling `int()`. How does the output change?
3. Write a function `safe_divide(a, b)` that returns `a / b`, or `None` if `b` is zero, using `try` and `except`.

## Check your understanding

<Quiz
	question="What happens to the rest of a try block after one of its lines raises an exception?"
	:options="['It keeps running normally', 'Python runs it twice', 'It is skipped, and Python jumps to the matching except block', 'The program always stops']"
	:answer-index="2"
	explanation="As soon as an exception is raised, the try block stops. Python looks for a matching except, runs it, and carries on after the whole statement."
/>

<Quiz
	question="When does a finally block run?"
	:options="['Only when an exception happens', 'Every time, whether or not an exception happened', 'Only when no exception happens', 'Only at the end of the program']"
	:answer-index="1"
	explanation="finally always runs, which makes it the right place for cleanup. else is the part that runs only on success."
/>

<Quiz
	question="Why is a bare except: (with no exception type) a bad idea?"
	:options="['It catches everything, including real bugs, so problems get hidden', 'It is a syntax error', 'It makes programs slower', 'It only catches ValueError']"
	:answer-index="0"
	explanation="Catch the specific exceptions you expect. Let unexpected ones crash loudly, so you can find and fix them."
/>

## Up next

Every program so far forgets everything the moment it ends. In [Reading and Writing Files](/lessons/python/file-io), your programs will save data to files and load it back next time, handling missing files with the `try` and `except` you just learned.
