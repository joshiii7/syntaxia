---
title: "Python Dictionaries: Look Up Values by Key"
description: "Store data as key-value pairs in Python dictionaries: look values up, add and change them, handle missing keys with get(), and loop through keys, values, and items."
---

# Dictionaries

*A real dictionary doesn't make you read every page. You look up a word, and its meaning is right there.*

[Lists](/lessons/python/lists) find things by position: item 0, item 1, item 2. That's perfect when order is what matters. But a lot of information isn't about order at all. What's Maria's score? What's the price of adobo? What's the capital of Japan? You don't want "item 7"; you want to look it up by **name**.

For that, Python has the **dictionary**, often called a **dict**.

## Looking up a word

In a printed dictionary, every entry has two parts: the **word** you look up, and its **meaning**. You never read the book from the start to find "umbrella." You jump straight to it, because every word is unique and the book is organized for looking things up.

A Python dictionary works the same way. It stores pairs:

- a **key**, like the word you look up;
- a **value**, like its meaning.

Give it a key, and it hands back the value, instantly, however big the dictionary is.

## Making a dictionary

Write the pairs between curly braces, with a colon between each key and its value, and commas between pairs:

```python
prices = {"adobo": 65, "rice": 15, "juice": 20}
student = {"name": "Maria", "grade": 11, "honor_roll": True}

print(prices)
print(len(student))
```

```text
{'adobo': 65, 'rice': 15, 'juice': 20}
3
```

`len` counts the pairs. Keys are usually strings, and values can be anything: numbers, strings, booleans, even lists.

## Looking things up

Put a key in square brackets to get its value:

```python
prices = {"adobo": 65, "rice": 15, "juice": 20}
print(prices["adobo"])
print(prices["rice"] * 2)
```

```text
65
30
```

Ask for a key that isn't there, and Python stops with a `KeyError`:

```python
prices = {"adobo": 65, "rice": 15, "juice": 20}
print(prices["pizza"])  # error: KeyError: 'pizza'
```

When a key might be missing, use the **`get`** method instead. It gives back `None` if the key isn't there, or a default value you choose:

```python
prices = {"adobo": 65, "rice": 15, "juice": 20}
print(prices.get("pizza"))
print(prices.get("pizza", 0))
print(prices.get("juice", 0))
```

```text
None
0
20
```

You can also check first with `in`, which looks at the **keys**:

```python
prices = {"adobo": 65, "rice": 15}
if "pizza" in prices:
    print("We sell pizza!")
else:
    print("No pizza here.")
```

```text
No pizza here.
```

## Adding, changing, and removing

Assigning to a key adds it if it's new, or replaces its value if it already exists:

```python
prices = {"adobo": 65, "rice": 15}
prices["juice"] = 20
prices["adobo"] = 70
print(prices)
```

```text
{'adobo': 70, 'rice': 15, 'juice': 20}
```

Each key can appear only once, so there's never any confusion about which value you get.

To remove a pair, use `del`, or `pop`, which also gives you the removed value:

```python
prices = {"adobo": 70, "rice": 15, "juice": 20}
del prices["rice"]
old = prices.pop("juice")
print(prices, "and juice cost", old)
```

```text
{'adobo': 70} and juice cost 20
```

Dictionaries keep their pairs in the order you added them, so printing one always shows them in that order.

## Looping through a dictionary

A `for` loop over a dictionary gives you its **keys**. More often, you'll want the keys and values together, which is what `.items()` is for. Each item is a `(key, value)` tuple, which you can unpack like in [Tuples](/lessons/python/tuples):

```python
prices = {"adobo": 65, "rice": 15, "juice": 20}

for item in prices:
    print("Item:", item)

for item, price in prices.items():
    print(f"{item}: {price} pesos")

print(list(prices.values()))
print(sum(prices.values()))
```

```text
Item: adobo
Item: rice
Item: juice
adobo: 65 pesos
rice: 15 pesos
juice: 20 pesos
[65, 15, 20]
100
```

- `.keys()` gives the keys.
- `.values()` gives the values.
- `.items()` gives both, as pairs.

## Counting things

One of the most useful dictionary patterns is counting: how many times does each word appear, how many votes did each candidate get? Start with an empty dictionary, and add one to each key's count as you go. `get` with a default of 0 handles keys you haven't seen yet:

```python
votes = ["Ana", "Ben", "Ana", "Carlo", "Ana", "Ben"]
counts = {}

for name in votes:
    counts[name] = counts.get(name, 0) + 1

print(counts)
```

```text
{'Ana': 3, 'Ben': 2, 'Carlo': 1}
```

Read the middle line as: "this name's count becomes its current count (or 0, if it's new) plus one."

## What can be a key?

Keys must be values that can never change: strings, numbers, and tuples all work. Lists can't be keys, because a list could change after being stored, and the dictionary would lose track of it:

```python
seats = {("A", 1): "Maria", ("A", 2): "Ben"}
print(seats[("A", 2)])
```

```text
Ben
```

```python
seats = {["A", 1]: "Maria"}  # error: TypeError: cannot use 'list' as a dict key (unhashable type: 'list')
```

Values have no such rule. Any value at all can go on the right of the colon.

## Try it

This program runs a cafeteria order. It looks up prices, handles an item that isn't on the menu, counts how many of each item were ordered, and totals the bill. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="460px"
	:model-value="'menu = {&quot;adobo&quot;: 65, &quot;rice&quot;: 15, &quot;juice&quot;: 20, &quot;halo-halo&quot;: 45}\norder = [&quot;rice&quot;, &quot;adobo&quot;, &quot;juice&quot;, &quot;rice&quot;, &quot;pizza&quot;, &quot;adobo&quot;, &quot;rice&quot;]\n\ncounts = {}\nfor item in order:\n    if item not in menu:\n        print(f&quot;Sorry, no {item} today.&quot;)\n        continue\n    counts[item] = counts.get(item, 0) + 1\n\nprint(&quot;Order:&quot;, counts)\n\ntotal = 0\nfor item, quantity in counts.items():\n    line = menu[item] * quantity\n    total += line\n    print(f&quot;{quantity} x {item:&lt;8} {line:&gt;5}&quot;)\n\nprint(f&quot;Total: {total} pesos&quot;)\nprint(&quot;Most ordered:&quot;, max(counts, key=counts.get))\nmenu[&quot;pizza&quot;] = 80\nprint(&quot;Menu now has&quot;, len(menu), &quot;items&quot;)\n'"
/>

`max(counts, key=counts.get)` finds the key with the biggest value: "compare the keys using each one's count."

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Sorry, no pizza today.
Order: {'rice': 3, 'adobo': 2, 'juice': 1}
3 x rice        45
2 x adobo      130
1 x juice       20
Total: 195 pesos
Most ordered: rice
Menu now has 5 items
```

`counts` lists items in the order each was first ordered: rice, then adobo, then juice. Pizza was skipped with `continue` because it wasn't on the menu, until the last lines added it.
:::

## Try it yourself

1. Add `"halo-halo"` twice to the order. How do the counts and the total change?
2. Change the program so an item that isn't on the menu costs 0 instead of being skipped, using `menu.get(item, 0)`.
3. Write a program that counts how many times each letter appears in the word `"mississippi"`, and prints the counts.

## Check your understanding

<Quiz
	question="prices = {&quot;rice&quot;: 15}. What does prices.get(&quot;tea&quot;, 0) give back?"
	:options="['An error', 'None', '0', '15']"
	:answer-index="2"
	explanation="get gives back the default you supply when the key is missing. Without a default, it gives None. Square brackets would raise a KeyError."
/>

<Quiz
	question="What happens with prices[&quot;rice&quot;] = 20 when &quot;rice&quot; is already a key?"
	:options="['The old value is replaced with 20', 'A second rice key is added', 'An error', 'Nothing changes']"
	:answer-index="0"
	explanation="Each key appears only once. Assigning to an existing key replaces its value."
/>

<Quiz
	question="Which gives you both the key and the value on each pass of a loop?"
	:options="['for key in d:', 'for key, value in d.keys():', 'for value in d.values():', 'for key, value in d.items():']"
	:answer-index="3"
	explanation="items() gives (key, value) pairs, which the for loop unpacks into two variables."
/>

## Up next

Dictionaries make sure each key appears only once. Sometimes that's all you need: a collection where every item is unique, and you don't care about order or values. That's a [Set](/lessons/python/sets).
