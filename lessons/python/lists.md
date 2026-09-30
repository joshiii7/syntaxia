---
title: "Python Lists: Store, Change, and Loop Through Items"
description: "Store many values in one Python list: read items by index, add and remove them, sort them, loop with for and enumerate, and avoid the list-copying surprise."
---

# Lists

*A shopping list: items in order, and you can add to it, cross things off, or rearrange it whenever you like.*

Imagine keeping track of quiz scores for a class of 30 students. With what you know so far, you'd need 30 variables: `score1`, `score2`, all the way to `score30`. Adding them up would mean typing all 30 names, and if a new student joined, you'd have to change your code.

A **list** solves this. It stores many values, in order, under a single name. It's Python's most-used way to keep a collection of things.

## A shopping list

Think of a shopping list on your phone. It keeps items in the order you added them. You can add something at the end, squeeze something in at the top, cross an item off, or sort the whole thing. It's always exactly as long as it needs to be.

A Python list works the same way, and like the characters in a string from [Working with Strings](/lessons/python/strings), every item has a numbered position, its **index**, starting from 0.

## Making a list

Write the items between square brackets, separated by commas:

```python
scores = [88, 94, 72, 65, 91]
names = ["Maria", "Ben", "Carlo"]
empty = []

print(scores)
print(len(names))
```

```text
[88, 94, 72, 65, 91]
3
```

`len` works on lists just like on strings: it gives the number of items. A list can hold any type of value, and even a mix, but a list where every item is the same kind of thing is much easier to work with.

## Reading items

Indexing and slicing work exactly the way they do for strings:

```python
scores = [88, 94, 72, 65, 91]

print(scores[0])
print(scores[-1])
print(scores[1:3])
```

```text
88
91
[94, 72]
```

`scores[0]` is the first item, `scores[-1]` the last, and a slice gives back a new, shorter list. Ask for an index that doesn't exist, and Python stops you:

```python
scores = [88, 94, 72]
print(scores[3])  # error: IndexError: list index out of range
```

## Lists can change

Here's the big difference from strings. Strings can never be changed, but lists can. You can replace an item by assigning to its index:

```python
scores = [88, 94, 72]
scores[2] = 75
print(scores)
```

```text
[88, 94, 75]
```

And lists have methods for adding and removing items. Unlike string methods, these change the list **in place**:

| Method | What it does |
|---|---|
| `append(x)` | add `x` to the end |
| `insert(i, x)` | put `x` at index `i`, shifting the rest along |
| `remove(x)` | remove the first item equal to `x` |
| `pop()` | remove the last item, and give it back |
| `pop(i)` | remove the item at index `i`, and give it back |
| `sort()` | put the items in order |
| `reverse()` | flip the order |

```python
names = ["Maria", "Ben"]
names.append("Carlo")
names.insert(0, "Ana")
print(names)

names.remove("Ben")
last = names.pop()
print(names, "and", last, "was popped")
```

```text
['Ana', 'Maria', 'Ben', 'Carlo']
['Ana', 'Maria'] and Carlo was popped
```

Because these methods change the list itself, they give back `None`, not a new list. So `names = names.append("Eli")` is a classic bug: it replaces your whole list with `None`. Just write `names.append("Eli")`.

## Is it in there?

The `in` operator checks whether a list contains an item:

```python
names = ["Ana", "Maria", "Ben"]
print("Ben" in names)
print("Eli" not in names)
```

```text
True
True
```

And `index` tells you where it is: `names.index("Maria")` is `1`.

## Looping through a list

Lists and `for` loops were made for each other:

```python
scores = [88, 94, 72, 65, 91]
for score in scores:
    print("Score:", score)
```

```text
Score: 88
Score: 94
Score: 72
Score: 65
Score: 91
```

When you want each item **and** its position, use **`enumerate`**. It hands you both on every iteration:

```python
names = ["Maria", "Ben", "Carlo"]
for position, name in enumerate(names, start=1):
    print(f"{position}. {name}")
```

```text
1. Maria
2. Ben
3. Carlo
```

`start=1` makes the numbering begin at 1 instead of 0, which is what people usually want to *see*. That's the neater way to get positions promised in [for Loops and range()](/lessons/python/for-loops).

## Built-in helpers: `sum`, `min`, `max`, `sorted`

Python has built-in functions that do the most common list jobs in one step:

```python
scores = [88, 94, 72, 65, 91]
print(sum(scores))
print(min(scores), max(scores))
print(sum(scores) / len(scores))
print(sorted(scores))
print(sorted(scores, reverse=True))
print(scores)
```

```text
410
65 94
82.0
[65, 72, 88, 91, 94]
[94, 91, 88, 72, 65]
[88, 94, 72, 65, 91]
```

Notice the last line. `sorted(scores)` gives back a **new**, sorted list and leaves the original alone, while `scores.sort()` sorts the original list itself. Use `sorted()` when you want to keep the original order too.

## Building a list in a loop

A very common pattern: start with an empty list, and `append` to it inside a loop:

```python
scores = [88, 94, 72, 65, 91]
passing = []
for score in scores:
    if score >= 75:
        passing.append(score)
print(passing)
```

```text
[88, 94, 91]
```

You'll learn a one-line way to write this, called a comprehension, in [List and Dictionary Comprehensions](/lessons/python/comprehensions).

## The copying surprise

What does this print?

```python
original = [1, 2, 3]
copy = original
copy.append(4)
print(original)
```

```text
[1, 2, 3, 4]
```

Remember the name tags from [Variables and Naming](/lessons/python/variables)? `copy = original` doesn't copy the list. It sticks a **second name tag** on the *same* list. There's only one list, so changing it through either name changes it for both.

To make a real, separate copy, use `.copy()` (or a full slice, `original[:]`):

```python
original = [1, 2, 3]
copy = original.copy()
copy.append(4)
print(original)
print(copy)
```

```text
[1, 2, 3]
[1, 2, 3, 4]
```

The same thing happens when you pass a list to a function, as promised in [Parameters and Return Values](/lessons/python/parameters). The parameter is another name tag on your list, so a function that changes the list in place changes yours:

```python
def add_bonus(scores):
    for i in range(len(scores)):
        scores[i] += 5

class_scores = [70, 80, 90]
add_bonus(class_scores)
print(class_scores)
```

```text
[75, 85, 95]
```

That's sometimes exactly what you want. When it isn't, have the function build and return a new list instead.

## Try it

This program manages a small class list and its scores: students enroll, one transfers out, and the program prints a ranked report. Track the lists after each line and predict the output.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="460px"
	:model-value="'roster = [&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;, &quot;Dina&quot;]\nscores = [91, 78, 95, 84]\n\nroster.append(&quot;Eli&quot;)\nscores.append(88)\nprint(f&quot;{len(roster)} students: {roster}&quot;)\n\nindex = roster.index(&quot;Ben&quot;)\nroster.pop(index)\nscores.pop(index)\nprint(&quot;After Ben transferred:&quot;, roster)\n\nprint(f&quot;Class average: {sum(scores) / len(scores):.1f}&quot;)\nprint(&quot;Highest:&quot;, max(scores), &quot;by&quot;, roster[scores.index(max(scores))])\n\nranked = sorted(scores, reverse=True)\nfor place, score in enumerate(ranked[:3], start=1):\n    name = roster[scores.index(score)]\n    print(f&quot;{place}. {name} ({score})&quot;)\n\nbackup = roster\nbackup.append(&quot;Fe&quot;)\nprint(&quot;Roster now has&quot;, len(roster), &quot;names&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
5 students: ['Maria', 'Ben', 'Carlo', 'Dina', 'Eli']
After Ben transferred: ['Maria', 'Carlo', 'Dina', 'Eli']
Class average: 89.5
Highest: 95 by Carlo
1. Carlo (95)
2. Maria (91)
3. Eli (88)
Roster now has 5 names
```

Ben was removed from both lists at the same index, so every name still lines up with its score. `sorted(..., reverse=True)` makes a ranked copy without disturbing the original order. And `backup = roster` didn't copy anything: adding Fe through `backup` added her to `roster` too.
:::

## Try it yourself

1. Add a student named `Gio` with a score of 99. Which lines of the report change?
2. Change `backup = roster` to make a real copy. How many names does the roster have now?
3. Write a loop that prints only the students who scored below the class average.

## Check your understanding

<Quiz
	question="scores = [88, 94, 72]. What is scores[-1]?"
	:options="['88', '94', 'An error', '72']"
	:answer-index="3"
	explanation="Negative indexes count from the end, so -1 is the last item."
/>

<Quiz
	question="What is the difference between scores.sort() and sorted(scores)?"
	:options="['There is no difference', 'sort() changes the list itself; sorted() gives back a new sorted list and leaves the original alone', 'sorted() only works on numbers', 'sort() gives back a new list']"
	:answer-index="1"
	explanation="List methods like sort() change the list in place and return None. sorted() is a function that makes a new list."
/>

<Quiz
	question="a = [1, 2], then b = a, then b.append(3). What is a?"
	:options="['[1, 2, 3]', '[1, 2]', '[3]', 'An error']"
	:answer-index="0"
	explanation="b = a puts a second name on the same list. Use b = a.copy() for a separate list."
/>

## Up next

Lists can change, and that's usually what you want. But some collections should never change, like the coordinates of a point or the days of the week. For those, Python has a list's fixed cousin: [Tuples](/lessons/python/tuples).
