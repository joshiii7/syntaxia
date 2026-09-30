---
title: "Python break and continue: Control Your Loops"
description: "Stop a Python loop early with break, skip to the next item with continue, use while True safely, and learn the loop else clause that runs when nothing was found."
---

# break and continue

*Looking for your keys in a row of drawers: once you find them, you stop opening drawers. And you skip the drawer you know only has socks.*

The loops in [while Loops](/lessons/python/while-loops) and [for Loops and range()](/lessons/python/for-loops) run until their condition is false or their collection runs out. Most of the time, that's exactly right. But sometimes you know partway through that you're done, or that one particular item should be skipped.

Python gives you two small keywords for those moments. **`break`** leaves the loop completely. **`continue`** skips the rest of the current iteration and moves on to the next one.

## The drawers

Imagine a dresser with ten drawers, and your keys are in one of them. You open each drawer in turn, starting at the top.

- When you find the keys in drawer 4, you **stop**. There's no point opening drawers 5 through 10. That's `break`.
- You know drawer 2 is full of old socks and never has keys. You **skip** it and go straight to drawer 3. That's `continue`.

## `break`: stop the loop now

When Python reaches `break` inside a loop, it jumps out of the loop immediately and carries on with the code after it:

```python
password = "sunflower7garden"

for position in range(len(password)):
    character = password[position]
    if character.isdigit():
        print(f"First digit is {character}, at index {position}")
        break

print("Search finished.")
```

```text
First digit is 7, at index 9
Search finished.
```

Once the first digit is found, `break` ends the loop. Without it, the loop would keep checking every remaining character for nothing.

This is the most common use of `break`: **searching**. Look at items one at a time, and stop as soon as you find a match.

## `continue`: skip to the next item

When Python reaches `continue`, it skips everything left in the loop's block for this iteration, and goes straight to the next one:

```python
for n in range(1, 11):
    if n % 3 == 0:
        continue
    print(n, end=" ")
```

```text
1 2 4 5 7 8 10
```

Every multiple of 3 hits `continue`, so its `print` never runs. The loop itself keeps going.

`continue` is handy for **filtering**: skipping items that don't matter, so the rest of the block only deals with the ones that do.

## `while True`: loops that stop from the inside

Sometimes the natural place to decide "stop now" is in the middle of an iteration, not at the top. A common pattern is a loop that would run forever on its own, with a `break` inside as the way out:

```python
while True:
    word = input("Type a word (or quit): ")
    if word == "quit":
        break
    print(word, "has", len(word), "letters.")

print("Bye!")
```

```text
Type a word (or quit): python
python has 6 letters.
Type a word (or quit): hi
hi has 2 letters.
Type a word (or quit): quit
Bye!
```

`while True` looks alarming, since `True` is never false. But the `break` makes it safe: the loop asks, checks for `quit`, and only then does its real work. It's the clearest way to write "keep going until the user says stop," and it's also the cleanest way to ask again until an answer is valid:

```python
while True:
    age = int(input("Enter your age (1 to 120): "))
    if 1 <= age <= 120:
        break
    print("That doesn't look right. Try again.")

print("Thanks! You're", age)
```

```text
Enter your age (1 to 120): 200
That doesn't look right. Try again.
Enter your age (1 to 120): 17
Thanks! You're 17
```

Compare it with the version in [while Loops](/lessons/python/while-loops): the `input` line only has to be written once.

## A loop's `else`: "not found"

Here's a Python feature most languages don't have. A `for` or `while` loop can have an `else` block, which runs only if the loop finished **without** hitting `break`:

```python
students = "Ana Ben Carlo Dina"

for name in students.split():
    if name == "Eli":
        print("Found Eli!")
        break
else:
    print("Eli isn't in this class.")
```

```text
Eli isn't in this class.
```

Read the `else` as "if we never broke out." It's made for searches: `break` handles "found it," and `else` handles "looked everywhere, found nothing." Notice the `else` lines up with the `for`, not with the `if`.

It's a little unusual, and many programmers use a variable like `found = False` instead. But you'll see it in real code, so it's worth recognizing.

## Only the nearest loop

`break` and `continue` only affect the **innermost** loop they're inside. With one loop inside another (you'll do plenty of that in [Nested Loops](/lessons/python/nested-loops)), a `break` in the inner loop ends only the inner loop. The outer one keeps going.

## Use them sparingly

`break` and `continue` are useful, but a loop full of them gets hard to follow. Each one is a hidden exit or a hidden skip, and the reader has to hunt for them all to understand when the loop really stops.

Before reaching for them, check whether the loop's own condition could do the job. One `break` or `continue` in a loop is usually fine, especially for searching or filtering. If you need four, it's time to rethink the loop.

## Try it

This program checks a batch of quiz scores. It skips scores that were entered wrongly (below 0 or above 100), counts the passing ones, and stops completely when it reaches `-1`, which marks the end of the batch. Predict what it prints.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="440px"
	:model-value="'scores = &quot;88,150,72,95,-5,64,-1,100&quot;\n\ncounted = 0\npassed = 0\n\nfor text in scores.split(&quot;,&quot;):\n    score = int(text)\n\n    if score == -1:\n        print(&quot;End marker found. Stopping.&quot;)\n        break\n\n    if score &lt; 0 or score &gt; 100:\n        print(&quot;Skipping invalid score:&quot;, score)\n        continue\n\n    counted += 1\n    if score &gt;= 75:\n        passed += 1\nelse:\n    print(&quot;No end marker found.&quot;)\n\nprint(f&quot;Valid scores counted: {counted}&quot;)\nprint(f&quot;Passed: {passed}&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Skipping invalid score: 150
Skipping invalid score: -5
End marker found. Stopping.
Valid scores counted: 4
Passed: 2
```

`150` and `-5` are skipped with `continue`, so they're never counted. `-1` triggers `break`, so `100` at the very end is never even looked at, and the loop's `else` doesn't run. That leaves 88, 72, 95, and 64: four valid scores, two of them passing.
:::

## Try it yourself

1. Remove the `-1` from the `scores` text. How do the counts change, and which extra line prints?
2. Remove the `continue` line (keep the message). What goes wrong with the counts, and why?
3. Change the program so it also stops at the first perfect score of `100`, printing `Perfect score found!` before it stops.

## Check your understanding

<Quiz
	question="What does break do inside a loop?"
	:options="['Skips to the next iteration', 'Restarts the loop from the beginning', 'Ends the loop immediately, and the program carries on after it', 'Stops the whole program']"
	:answer-index="2"
	explanation="break jumps out of the loop right away. The program continues with whatever comes after the loop."
/>

<Quiz
	question="What does this print? for n in range(1, 6): if n == 3: continue; print(n, end=&quot;&quot;)"
	:options="['12', '12345', '345', '1245']"
	:answer-index="3"
	explanation="When n is 3, continue skips the print for that iteration only. The loop keeps going with 4 and 5."
/>

<Quiz
	question="When does the else block of a for loop run?"
	:options="['When the loop finished without hitting break', 'Every time the loop runs', 'Only when the loop hits break', 'When the loop never started']"
	:answer-index="0"
	explanation="A loop's else runs only if the loop ended normally. It's a clean way to say not found after a search that uses break."
/>

## Up next

You just saw that one loop can sit inside another. That idea unlocks tables, grids, and patterns. Let's explore it properly in [Nested Loops](/lessons/python/nested-loops).
