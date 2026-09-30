---
title: "Python while Loops: Repeat Code Until a Condition Changes"
description: "Repeat code in Python with while loops: count, keep running totals, ask until the answer is valid, and avoid infinite loops and off-by-one mistakes."
---

# while Loops

*Laps around a running track: before every lap, the coach asks one question. "Done yet?" As long as the answer is no, you keep running.*

Say you want to print the numbers 1 to 5. You could write five `print` lines. Now say you want 1 to 1,000. Or you want to keep asking a user for a password until they get it right, and you have no idea how many tries that will take.

Copying lines doesn't work anymore. You need a way to say "do this again, and again, until...". That's a **loop**. Python has two kinds, and this lesson covers the first: the `while` loop.

## Laps around a track

Picture a coach timing you around a track. Before each lap, the coach checks one thing: "Have you done 5 yet?" If not, you run another lap, and the lap counter goes up by one. When the answer is yes, you stop.

Every `while` loop has those same three ingredients:

1. **A starting point**, like the lap counter at zero.
2. **A condition** that's checked before every lap. While it's `True`, the loop keeps going.
3. **A step** that moves things forward, so the condition eventually becomes `False`.

Forget the third one, and you'll be running laps forever. Programmers call that an **infinite loop**.

## Your first `while` loop

```python
lap = 1

while lap <= 5:
    print("Lap", lap)
    lap += 1

print("Done!")
```

```text
Lap 1
Lap 2
Lap 3
Lap 4
Lap 5
Done!
```

The shape is just like an `if` from [Making Decisions](/lessons/python/if-elif-else): a condition, a colon, and an indented block. The difference is what happens at the end of the block. An `if` runs its block once and moves on. A `while` jumps **back up** and checks the condition again.

Step by step:

1. `lap` starts at 1.
2. Python checks `lap <= 5`. It's true, so the block runs: it prints `Lap 1`, and `lap` becomes 2.
3. Back to the top. `2 <= 5` is true, so it prints `Lap 2`...
4. Eventually `lap` is 6. `6 <= 5` is false, so the loop ends and `Done!` prints.

Each pass through the block is called an **iteration**. This loop has five.

If the condition is false from the very start, the block never runs at all. `while 10 <= 5:` would skip straight past.

## Counting down, or by twos

The step doesn't have to be `+= 1`:

```python
count = 3
while count > 0:
    print(count, "...")
    count -= 1
print("Liftoff!")
```

```text
3 ...
2 ...
1 ...
Liftoff!
```

```python
n = 2
while n <= 10:
    print(n, end=" ")
    n += 2
```

```text
2 4 6 8 10
```

## Running totals

A very common loop job is adding things up. Create a variable *before* the loop to hold the total, and add to it on every iteration:

```python
total = 0
number = 1

while number <= 100:
    total += number
    number += 1

print("1 + 2 + ... + 100 =", total)
```

```text
1 + 2 + ... + 100 = 5050
```

The total has to be created before the loop starts. Create it inside the loop, and it would be reset to 0 on every lap.

## Repeating until something happens

Counting is the simplest use, but `while` really shines when you *don't* know how many times to repeat. You loop until something happens. How many years does it take for savings to reach a goal?

```python
savings = 1000
years = 0

while savings < 2000:
    savings = savings * 1.1
    years += 1

print(f"It took {years} years to reach {savings:.2f}")
```

```text
It took 8 years to reach 2143.59
```

Nobody told the loop to run 8 times. It kept going until the condition became false.

The same idea keeps asking the user until they give a valid answer:

```python
age = int(input("Enter your age (1 to 120): "))

while age < 1 or age > 120:
    print("That doesn't look right. Try again.")
    age = int(input("Enter your age (1 to 120): "))

print("Thanks! You're", age)
```

```text
Enter your age (1 to 120): 200
That doesn't look right. Try again.
Enter your age (1 to 120): 17
Thanks! You're 17
```

It asks once before the loop, and again at the end of each lap, until the answer is in range.

## Two classic bugs

**The infinite loop.** Forget the step, and the condition never changes:

```python
lap = 1
while lap <= 5:
    print("Lap", lap)
    # forgot lap += 1
```

This prints `Lap 1` forever. If it happens to you, don't panic: press **Ctrl + C** in the terminal to stop the program. Then check that something inside the loop moves it toward the end.

**Off by one.** The loop runs one time too many or one time too few. It's the most common loop bug of all:

```python
n = 0
while n <= 5:
    print(n, end=" ")
    n += 1
```

```text
0 1 2 3 4 5
```

Six numbers, not five! When a loop runs the wrong number of times, check two things: where the counter **starts** (0 or 1?), and whether the condition uses **`<` or `<=`**. A useful habit is to trace a tiny case, like 3 iterations, by hand.

## Try it

This program runs a countdown, adds up a class's savings week by week until they reach their goal, and reverses a word, one character at a time. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="420px"
	:model-value="'count = 3\nwhile count &gt;= 1:\n    print(f&quot;{count}...&quot;)\n    count -= 1\nprint(&quot;Go!&quot;)\n\nsavings = 0\nweeks = 0\nwhile savings &lt; 500:\n    savings += 150\n    weeks += 1\nprint(f&quot;Reached {savings} pesos after {weeks} weeks&quot;)\n\nword = &quot;LOOP&quot;\nbackwards = &quot;&quot;\nindex = len(word) - 1\nwhile index &gt;= 0:\n    backwards += word[index]\n    index -= 1\nprint(word, &quot;backwards is&quot;, backwards)\n\ntries = 0\nwhile tries &gt; 5:\n    print(&quot;This never prints&quot;)\nprint(&quot;Tries:&quot;, tries)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
3...
2...
1...
Go!
Reached 600 pesos after 4 weeks
LOOP backwards is POOL
Tries: 0
```

The savings loop only checks the goal *before* each week, so the savings overshoot 500 and stop at 600. The word loop walks the index from 3 down to 0, adding one character at a time. And the last loop's condition is false from the start, so its block never runs at all.
:::

## Try it yourself

1. Change the savings loop to save 120 pesos a week. How many weeks does it take now, and how much is saved?
2. Write a `while` loop that prints the 7 times table, from `7 x 1 = 7` to `7 x 10 = 70`.
3. Write a loop that keeps asking "What is 6 x 7? " until the user types `42`, then prints `Correct!`.

## Check your understanding

<Quiz
	question="When is a while loop's condition checked?"
	:options="['Only once, at the start', 'Before every iteration', 'After the loop ends', 'Only when the block has an if']"
	:answer-index="1"
	explanation="A while loop checks its condition before each pass. If it's true, the block runs and Python jumps back to check again."
/>

<Quiz
	question="A while loop prints the same line forever. What is the most likely cause?"
	:options="['The loop has too many lines', 'while loops can only run 100 times', 'Nothing inside the loop changes the condition, so it never becomes false', 'The print is wrong']"
	:answer-index="2"
	explanation="Every loop needs a step that moves it toward its end. If nothing changes the variable in the condition, it never stops. Press Ctrl + C to stop it."
/>

<Quiz
	question="n = 1, then while n &lt; 4: print(n); n += 1. What is printed?"
	:options="['1 2 3', '1 2 3 4', '0 1 2 3', '1']"
	:answer-index="0"
	explanation="n takes the values 1, 2, and 3. When n becomes 4, the condition n &lt; 4 is false, so the loop stops."
/>

## Up next

`while` loops are perfect when you don't know how many times to repeat. But when you *do* know, or when you want to go through every item in a collection, Python has a neater tool: [for Loops and range()](/lessons/python/for-loops).
