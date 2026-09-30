---
title: "Python for Loops and range(): Repeat a Set Number of Times"
description: "Loop through strings and number ranges with Python's for loop, use range() with a start, stop, and step, and choose between for and while loops."
---

# for Loops and range()

*A teacher handing back tests walks down the row, desk by desk. Nobody has to count laps. When the last desk is done, so is the job.*

In [while Loops](/lessons/python/while-loops), every loop needed three pieces you had to manage yourself: a counter, a condition, and a step. Forget the step, and the loop never ends. Start the counter in the wrong place, and it runs once too often.

For the most common kind of repetition, "do this for each thing" or "do this 10 times," Python has a loop that handles all of that for you: the **`for` loop**.

## Desk by desk

A teacher handing back tests doesn't think "set counter to 1, check whether the counter is past the last desk, add one to the counter." They just walk down the row and hand a test to each student, one after another, until there are no more desks.

A `for` loop works the same way. You give it a collection of things, and it hands you each one in turn, until they run out.

## Looping through a string

A string is a collection of characters, so a `for` loop can visit each one:

```python
for letter in "CAT":
    print(letter)
```

```text
C
A
T
```

Read it almost like English: "for each letter in CAT, print the letter."

- `for` starts the loop.
- `letter` is the **loop variable**. On each iteration, it holds the next item: first `"C"`, then `"A"`, then `"T"`.
- `in "CAT"` names the collection to loop through.
- A colon and an indented block, just like `if` and `while`.

There's no counter and no condition to get wrong. The loop ends by itself when the string runs out of characters. Choose a loop variable name that says what each item is: `letter`, `student`, `score`.

## Counting with `range()`

To repeat something a set number of times, use `range()`. It produces a sequence of numbers for the loop to walk through:

```python
for i in range(5):
    print("Iteration", i)
```

```text
Iteration 0
Iteration 1
Iteration 2
Iteration 3
Iteration 4
```

`range(5)` gives the numbers **0, 1, 2, 3, 4**: five numbers, starting at 0 and stopping *before* 5. That "stop before" rule is the same one slicing uses in [Working with Strings](/lessons/python/strings), and it means `range(n)` always runs exactly `n` times.

A plain counter is traditionally called `i`. When you don't need the number at all, just the repetition, name it `_`, which tells readers "I'm not using this":

```python
for _ in range(3):
    print("Hip hip hooray!")
```

```text
Hip hip hooray!
Hip hip hooray!
Hip hip hooray!
```

## Choosing where to start and stop

Give `range()` two numbers, and the first is where to **start**:

```python
for lap in range(1, 6):
    print("Lap", lap)
```

```text
Lap 1
Lap 2
Lap 3
Lap 4
Lap 5
```

`range(1, 6)` starts at 1 and stops before 6. That's the same loop as the `while` version in [while Loops](/lessons/python/while-loops), in two lines instead of four, with no way to forget the step.

A third number sets the **step**: how much to count by. A negative step counts down:

```python
for n in range(2, 11, 2):
    print(n, end=" ")
print()

for n in range(3, 0, -1):
    print(n, end=" ")
print("Liftoff!")
```

```text
2 4 6 8 10
3 2 1 Liftoff!
```

Notice `range(2, 11, 2)` needs to stop at 11 to include 10, and `range(3, 0, -1)` stops *before* 0, which is exactly right for a countdown.

| You write | Numbers produced |
|---|---|
| `range(4)` | 0, 1, 2, 3 |
| `range(1, 4)` | 1, 2, 3 |
| `range(0, 10, 3)` | 0, 3, 6, 9 |
| `range(5, 0, -1)` | 5, 4, 3, 2, 1 |

## Running totals

Adding things up works just like with `while`: create the total before the loop, add to it inside:

```python
total = 0
for number in range(1, 101):
    total += number
print("1 + 2 + ... + 100 =", total)
```

```text
1 + 2 + ... + 100 = 5050
```

And the same pattern counts things. How many vowels are in a sentence?

```python
sentence = "Python is fun to learn"
vowels = 0
for letter in sentence.lower():
    if letter in "aeiou":
        vowels += 1
print("Vowels:", vowels)
```

```text
Vowels: 6
```

That's a loop with an `if` inside, and it's one of the most common shapes in all of programming: go through everything, and do something with the items that match.

## Using the position too

Sometimes you want each character *and* its position. `range(len(word))` gives you every valid index, which you can use to look characters up:

```python
word = "JAVA"
for i in range(len(word)):
    print(i, word[i])
```

```text
0 J
1 A
2 V
3 A
```

You'll learn a neater way to get both, called `enumerate`, in [Lists](/lessons/python/lists).

## `for` or `while`?

Both loops can do the same jobs, but each one fits some jobs better:

- Use **`for`** when you're going through a collection, or repeating a known number of times: every character, every student, 10 rounds.
- Use **`while`** when you're repeating *until something happens*, and you don't know when that will be: until the savings reach a goal, until the user types a valid answer.

When in doubt, reach for `for`. It can't loop forever by accident, and it can't be off by one because of a forgotten step.

## Don't change what you're counting

One warning. Inside a `for` loop over `range()`, changing the loop variable does *not* change how many times the loop runs:

```python
for i in range(3):
    print(i)
    i = 100
```

```text
0
1
2
```

On each iteration, `for` hands `i` the next number from the range, overwriting whatever you did. The loop always walks the sequence it was given. If you need to jump around, that's a job for `while`, or for `break` and `continue`, coming up next.

## Try it

This program prints a times table row, counts the letters in a word, adds up the even numbers from 1 to 20, and builds a staircase of stars. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'for n in range(1, 6):\n    print(f&quot;7 x {n} = {7 * n}&quot;)\n\nword = &quot;banana&quot;\na_count = 0\nfor letter in word:\n    if letter == &quot;a&quot;:\n        a_count += 1\nprint(f&quot;\'{word}\' has {a_count} a\'s&quot;)\n\neven_total = 0\nfor n in range(2, 21, 2):\n    even_total += n\nprint(&quot;Sum of even numbers up to 20:&quot;, even_total)\n\nfor step in range(1, 4):\n    print(&quot;*&quot; * step)\n\nfor i in range(3, 0, -1):\n    print(i, end=&quot; &quot;)\nprint(&quot;Go!&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
'banana' has 3 a's
Sum of even numbers up to 20: 110
*
**
***
3 2 1 Go!
```

`range(1, 6)` gives 1 to 5, so the times table stops at `7 x 5`. `range(2, 21, 2)` needs the stop value 21 to include 20. And `"*" * step` repeats the star once, then twice, then three times.
:::

## Try it yourself

1. Change the times table to show `7 x 1` through `7 x 10`.
2. Write a `for` loop that prints every other letter of `"Syntaxia"`: `S n a i`. (Hint: `range` with a step of 2, and indexes.)
3. Count how many digits are in the string `"Room 204, Floor 3"`, using a loop and the string method `isdigit()`.

## Check your understanding

<Quiz
	question="What numbers does range(4) produce?"
	:options="['1, 2, 3, 4', '0, 1, 2, 3', '0, 1, 2, 3, 4', '4']"
	:answer-index="1"
	explanation="range(n) starts at 0 and stops before n, so it produces n numbers: 0, 1, 2, 3."
/>

<Quiz
	question="Which range counts down 5, 4, 3, 2, 1?"
	:options="['range(5, 1)', 'range(5, 0)', 'range(1, 5, -1)', 'range(5, 0, -1)']"
	:answer-index="3"
	explanation="A negative step counts down, and the stop value is never included, so stopping at 0 gives you 1 as the last number."
/>

<Quiz
	question="You want to keep asking for a password until it's correct. Which loop fits best?"
	:options="['A while loop, because you don\'t know how many tries it will take', 'A for loop over range(10)', 'A for loop over the password', 'No loop is needed']"
	:answer-index="0"
	explanation="while loops are for repeating until something happens. for loops are for going through a collection or a known number of repetitions."
/>

## Up next

Sometimes you want to leave a loop early, like when you've found what you're looking for, or skip one item without stopping the whole loop. Python has two small keywords for that: [break and continue](/lessons/python/break-and-continue).
