---
title: "Python Nested Loops: Loops Inside Loops Explained"
description: "Put one Python loop inside another to work with rows and columns, print tables and patterns, and understand how many times the inner loop really runs."
---

# Nested Loops

*A clock has two hands. The minute hand goes all the way around once for every single step of the hour hand.*

In [for Loops and range()](/lessons/python/for-loops), each loop repeated one thing. But plenty of problems come in two directions at once: rows and columns of seats, days and class periods in a timetable, the times tables from 1 to 10.

For those, you put one loop inside another. That's a **nested loop**.

## The clock

Watch a clock between 1:00 and 3:00. The hour hand moves from 1 to 2: that's the **outer** loop. But for each single step of the hour hand, the minute hand goes all the way around, from 0 to 59: that's the **inner** loop.

That's the key idea: **for every one step of the outer loop, the inner loop runs completely, from start to finish.**

## Your first nested loop

```python
for row in range(1, 4):
    for col in range(1, 5):
        print(f"({row},{col})", end=" ")
    print()
```

```text
(1,1) (1,2) (1,3) (1,4)
(2,1) (2,2) (2,3) (2,4)
(3,1) (3,2) (3,3) (3,4)
```

The inner loop is indented under the outer one, and its own block is indented one level further. Trace it slowly:

1. The outer loop starts with `row = 1`.
2. The inner loop runs `col` from 1 to 4, printing four pairs on the same line, thanks to `end=" "`.
3. The inner loop ends. The empty `print()` moves down to a new line.
4. The outer loop moves on to `row = 2`, and the inner loop starts over from `col = 1`.

The indentation of that `print()` matters a lot. It's inside the outer loop but **after** the inner loop, so it runs once per row. Indent it one more level, and it would run after every single pair. Remove its indentation entirely, and it would run just once, after everything.

## Counting the work

How many times does the inner `print` run? The outer loop runs 3 times, and each time, the inner loop runs 4 times. So it's **3 × 4 = 12** times.

That multiplication is worth remembering, because nested loops can get expensive fast. Two loops of 1,000 each means a million runs of the inner block. That's still quick for a computer, but three loops of 1,000 would be a billion, and you'd feel it.

## A multiplication table

Here's the classic use. The outer loop picks the row number, the inner loop picks the column number, and each cell is the two multiplied together:

```python
for row in range(1, 6):
    for col in range(1, 6):
        print(f"{row * col:4}", end="")
    print()
```

```text
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

`{row * col:4}` pads each number to 4 characters wide, a width code from [Formatting Output with f-strings](/lessons/python/f-strings), which lines the columns up.

## When the inner loop depends on the outer one

The inner loop doesn't have to run the same number of times for every row. Its range can use the outer loop's variable:

```python
for row in range(1, 5):
    for star in range(row):
        print("*", end="")
    print()
```

```text
*
**
***
****
```

On row 1, the inner loop runs once. On row 2, twice. The shape grows because `range(row)` gets longer each time. (For this particular pattern, `print("*" * row)` would do the job in one line. But the nested version shows the idea, and it works for patterns that string repetition can't make.)

## Loops over text, nested

Nested loops work with any collections, not just ranges. Here, the outer loop goes through words and the inner loop through each word's letters:

```python
for word in ["cat", "dog"]:
    for letter in word:
        print(letter.upper(), end=" ")
    print("<-", word)
```

```text
C A T <- cat
D O G <- dog
```

`["cat", "dog"]` is a **list**, which you'll meet properly in [Lists](/lessons/python/lists).

## Naming your loop variables

With two loops, `i` and `j` are traditional names, and you'll see them in plenty of code. But when the loops mean something, like rows and columns or days and periods, use those names instead. `row` and `col` make it obvious which loop is which, and mixing up `i` and `j` is a classic, confusing bug.

Each loop also needs its **own** variable. If the inner loop reused the outer loop's name, it would overwrite the outer value on every pass.

## Breaking out of the inner loop

As you saw in [break and continue](/lessons/python/break-and-continue), `break` only leaves the loop it's directly inside. In a nested loop, a `break` in the inner loop ends that row early, and the outer loop carries on with the next row:

```python
for row in range(1, 4):
    for col in range(1, 6):
        if col > row:
            break
        print(col, end=" ")
    print()
```

```text
1
1 2
1 2 3
```

## Try it

A school theater has 4 rows of seats, labeled A to D, with 6 seats in each row. Some seats are taken. This program prints a seating map and counts the free seats. Predict the map before you check.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'row_letters = &quot;ABCD&quot;\nseats_per_row = 6\nfree = 0\n\nfor row in range(len(row_letters)):\n    print(row_letters[row], &quot;|&quot;, end=&quot; &quot;)\n    for seat in range(1, seats_per_row + 1):\n        taken = (row + seat) % 3 == 0\n        if taken:\n            print(&quot;X&quot;, end=&quot; &quot;)\n        else:\n            print(seat, end=&quot; &quot;)\n            free += 1\n    print()\n\ntotal = len(row_letters) * seats_per_row\nprint(f&quot;Free seats: {free} of {total}&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
A | 1 2 X 4 5 X 
B | 1 X 3 4 X 6 
C | X 2 3 X 5 6 
D | 1 2 X 4 5 X 
Free seats: 16 of 24
```

A seat is marked taken when `row + seat` is a multiple of 3. Row A is `row` 0, so seats 3 and 6 are taken. Row B is `row` 1, so seats 2 and 5 are taken, and so on. The inner loop runs 6 times for each of the 4 rows: 24 seats in total, 8 of them taken.
:::

## Try it yourself

1. Add a fifth row, `E`, to the theater. What do you need to change? (Only one thing!)
2. Change the star pattern from earlier so it's upside down: four stars on the first line, one on the last.
3. Write a nested loop that prints a 10 by 10 times table, using a width of 4 to keep the columns lined up.

## Check your understanding

<Quiz
	question="The outer loop runs 5 times and the inner loop runs 3 times per outer iteration. How many times does the inner block run in total?"
	:options="['8', '5', '15', '3']"
	:answer-index="2"
	explanation="For each of the 5 outer iterations, the inner loop runs all 3 times, so it's 5 times 3, which is 15."
/>

<Quiz
	question="In a grid-printing nested loop, where does the print() that ends each row go?"
	:options="['Inside the outer loop, after the inner loop, at the outer loop\'s indentation', 'Inside the inner loop', 'After both loops', 'Before both loops']"
	:answer-index="0"
	explanation="It has to run once per row, after that row's items are printed. In Python, that's decided by its indentation: inside the outer loop, lined up with the inner for."
/>

<Quiz
	question="A break is inside an inner loop, which is inside an outer loop. What does it end?"
	:options="['Both loops', 'Only the outer loop', 'The whole program', 'Only the inner loop']"
	:answer-index="3"
	explanation="break only affects the nearest loop it's inside. The outer loop carries on with its next iteration."
/>

## Up next

That's the Control Flow chapter done. Your programs can decide, repeat, and repeat inside repeats. As they grow, keeping everything in one long list of steps gets messy. Next, you'll learn to package code into named, reusable pieces in [Writing Functions](/lessons/python/functions).
