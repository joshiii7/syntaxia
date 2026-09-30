---
title: "Python Tuples: Fixed Collections and Unpacking"
description: "Use Python tuples for collections that shouldn't change: create them, read them like lists, unpack them into variables, and know when to pick a tuple over a list."
---

# Tuples

*A shopping list gets edited all day. A birth certificate is printed once, and nobody crosses things off it.*

[Lists](/lessons/python/lists) are wonderful because they can change: you add, remove, and sort items whenever you like. But some collections *shouldn't* change. The coordinates of a place on a map. The red, green, and blue values of a color. A date made of a year, a month, and a day. If one of those changed by accident, the whole thing would be wrong.

For fixed collections like these, Python has the **tuple**.

## A printed certificate

Compare a shopping list with a printed birth certificate. Both hold several pieces of information in order. But the shopping list is meant to be edited, while the certificate is meant to be read. If the date on a certificate needs fixing, you don't scribble on it; you get a new certificate.

A tuple is the certificate: an ordered collection, like a list, that can never be changed once it's made. The fancy word for that is **immutable**, the same as strings.

## Making a tuple

Write the items between parentheses, separated by commas:

```python
point = (3, 4)
color = (255, 128, 0)
birthday = (2009, 6, 15)

print(point)
print(len(color))
```

```text
(3, 4)
3
```

It's actually the **commas** that make a tuple, not the parentheses. The parentheses just make it easier to see. That leads to one odd case: a tuple with only one item needs a trailing comma, or Python thinks the parentheses are just grouping a single value:

```python
not_a_tuple = (5)
one_item = (5,)
print(type(not_a_tuple))
print(type(one_item))
```

```text
<class 'int'>
<class 'tuple'>
```

## Reading a tuple

Everything that *reads* a list works on a tuple too: indexes, negative indexes, slices, `len`, `in`, and `for` loops:

```python
days = ("Mon", "Tue", "Wed", "Thu", "Fri")
print(days[0], days[-1])
print(days[1:3])
print("Sat" in days)
for day in days[:2]:
    print("School day:", day)
```

```text
Mon Fri
('Tue', 'Wed')
False
School day: Mon
School day: Tue
```

## ...but never changing it

What a tuple doesn't have is any way to change it. There's no `append`, no `remove`, no `sort`, and no assigning to an index:

```python
point = (3, 4)
point[0] = 10  # error: TypeError: 'tuple' object does not support item assignment
```

That's not a limitation to work around; it's the whole point. When you pass a tuple to a function, or store it somewhere, you know for certain it will come back exactly the same.

If you do need a changed version, build a new tuple, or convert to a list, change that, and convert back:

```python
point = (3, 4)
moved = (point[0] + 1, point[1])
print(moved)

as_list = list(point)
as_list.append(0)
print(tuple(as_list))
```

```text
(4, 4)
(3, 4, 0)
```

## Unpacking

Tuples really shine with **unpacking**: splitting a tuple into separate variables in one line, one variable per item:

```python
birthday = (2009, 6, 15)
year, month, day = birthday
print(f"Born on day {day} of month {month}, {year}")
```

```text
Born on day 15 of month 6, 2009
```

You've been doing this already, without the name. `x, y = 3, 4` from [Variables and Naming](/lessons/python/variables) creates the tuple `(3, 4)` and unpacks it at once. And in [Parameters and Return Values](/lessons/python/parameters), a function that returned `each, left` was really returning a tuple:

```python
def share(cookies, friends):
    return cookies // friends, cookies % friends

result = share(20, 6)
print(result)
print(type(result))

each, left = share(20, 6)
print(each, left)
```

```text
(3, 2)
<class 'tuple'>
3 2
```

The number of variables must match the number of items, or Python tells you:

```python
year, month = (2009, 6, 15)  # error: ValueError: too many values to unpack (expected 2)
```

## Unpacking in loops

Unpacking works in a `for` loop too, which makes lists of tuples very pleasant to work with. Each tuple below is one student's name and score:

```python
results = [("Maria", 91), ("Ben", 78), ("Carlo", 95)]

for name, score in results:
    print(f"{name}: {score}")
```

```text
Maria: 91
Ben: 78
Carlo: 95
```

This is how `enumerate` from [Lists](/lessons/python/lists) works: it hands out `(position, item)` tuples, and `for position, name in ...` unpacks them.

Keeping each student's name and score together in one tuple is safer than two separate lists kept in step by index. Remove a tuple, and the name and score leave together.

## List or tuple?

- Use a **list** for a collection of similar things that may grow, shrink, or change: students in a class, items in a cart, scores so far.
- Use a **tuple** for a small, fixed group of values that belong together as one thing: a point, a color, a date, a name and a score.

A handy test: if you'd describe it as "a list of..." it's a list. If you'd describe it as "a ... made of three parts," it's a tuple.

## Try it

This program describes a school trip using tuples: a start point, stops along the way, and a meeting time. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="400px"
	:model-value="'start = (0, 0)\nstops = [(&quot;Museum&quot;, 3, 4), (&quot;Park&quot;, 6, 8), (&quot;Library&quot;, 6, 2)]\nmeet_time = (14, 30)\n\nhour, minute = meet_time\nprint(f&quot;Meet at {hour}:{minute:02d}&quot;)\n\nfor name, x, y in stops:\n    distance = ((x - start[0]) ** 2 + (y - start[1]) ** 2) ** 0.5\n    print(f&quot;{name} is {distance:.1f} km from school&quot;)\n\nlast_name, last_x, last_y = stops[-1]\nprint(&quot;Last stop:&quot;, last_name)\nprint(&quot;Stops with x = 6:&quot;, [stop[0] for stop in stops if stop[1] == 6])\nprint(&quot;Single item:&quot;, type((&quot;Museum&quot;,)), type((&quot;Museum&quot;)))\n'"
/>

`** 0.5` means "to the power of one half," which is a square root. And `:02d` pads the minute with a zero, so 30 stays `30` but 5 would become `05`.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Meet at 14:30
Museum is 5.0 km from school
Park is 10.0 km from school
Library is 6.3 km from school
Last stop: Library
Stops with x = 6: ['Park', 'Library']
Single item: <class 'tuple'> <class 'str'>
```

Each stop is a tuple of three things, unpacked into `name, x, y` in the loop. The distances come from the Pythagorean theorem: the Museum at (3, 4) is exactly 5 km away. The line with square brackets is a list comprehension, which you'll meet in two lessons' time. And only the version with a trailing comma is a tuple.
:::

## Try it yourself

1. Add a fourth stop, `("Zoo", 0, 5)`. How far is it from school?
2. Try to change `meet_time[0]` to `15`. What error do you get? Then make a new tuple for 3:30 PM instead.
3. Write a function `midpoint(a, b)` that takes two point tuples and returns the point halfway between them, as a tuple.

## Check your understanding

<Quiz
	question="What is the main difference between a tuple and a list?"
	:options="['A tuple can only hold numbers', 'A tuple cannot be changed after it is made', 'Tuples have no order', 'Lists cannot be looped over']"
	:answer-index="1"
	explanation="Tuples are immutable, like strings. You can read them like lists, but not add, remove, or replace items."
/>

<Quiz
	question="Which of these is a tuple with one item?"
	:options="['(5)', '[5]', '(5,)', '{5}']"
	:answer-index="2"
	explanation="It's the comma that makes a tuple. (5) is just the number 5 in parentheses."
/>

<Quiz
	question="point = (3, 4). How do you put 3 in x and 4 in y in one line?"
	:options="['x, y = point', 'x = y = point', '(x + y) = point', 'point = x, y']"
	:answer-index="0"
	explanation="Unpacking assigns each item to one variable, in order. The number of variables must match the number of items."
/>

## Up next

Lists and tuples find things by position: item 0, item 1, item 2. But often you want to look something up by *name*: a student's score, a word's meaning, a product's price. For that, Python has [Dictionaries](/lessons/python/dictionaries).
