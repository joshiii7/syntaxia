---
title: "Python Sets: Unique Items, Fast Lookups, and Set Math"
description: "Use Python sets to remove duplicates, check membership quickly, and compare groups with union, intersection, and difference, plus why sets have no order."
---

# Sets

*A sticker album has one spot for each sticker. Get a duplicate, and there's nowhere to put it. You either have that sticker or you don't.*

A [dictionary](/lessons/python/dictionaries) makes sure each key appears only once. Sometimes that's exactly what you need, without any values attached: which students signed up, which words appear in a story, which countries you've visited. You don't care how many times each one shows up, or in what order. You only care whether it's there.

For that, Python has the **set**.

## A sticker album

A sticker album has exactly one place for each sticker. When you get a new one, you stick it in. When you get one you already have, it doesn't go in twice; it's just a duplicate. At any moment, the question the album answers is simple: *do I have this sticker, yes or no?*

A Python set works the same way:

- Every item in a set is **unique**. Adding something that's already there does nothing.
- A set has **no order**. There's no first item, and no index.
- Its best trick is answering "is this in here?" very quickly.

## Making a set

Write the items between curly braces, like a dictionary without the colons:

```python
signups = {"Maria", "Ben", "Carlo"}
numbers = {3, 1, 2, 3, 1}
print(len(signups))
print(numbers)
```

```text
3
{1, 2, 3}
```

The duplicates in `numbers` simply vanished: a set only keeps one of each.

An empty set has to be written `set()`. Empty curly braces, `{}`, make an empty *dictionary*, since dictionaries came first:

```python
empty = set()
not_a_set = {}
print(type(empty), type(not_a_set))
```

```text
<class 'set'> <class 'dict'>
```

## No order, so no indexes

Because a set has no order, you can't ask for "item 0":

```python
signups = {"Maria", "Ben", "Carlo"}
print(signups[0])  # error: TypeError: 'set' object is not subscriptable
```

There's a subtler consequence, too. When you print a set of strings, the order can be **different every time you run your program**. Python chooses the order internally, and for strings, that choice changes from run to run on purpose, for security reasons. That's why the examples in this lesson wrap sets of strings in `sorted()` before printing them: `sorted()` gives back a list in alphabetical order, so the output is always the same.

## Adding and removing

```python
signups = {"Maria", "Ben"}
signups.add("Carlo")
signups.add("Maria")
print(sorted(signups))

signups.remove("Ben")
signups.discard("Eli")
print(sorted(signups))
```

```text
['Ben', 'Carlo', 'Maria']
['Carlo', 'Maria']
```

- `add` puts an item in. Adding `"Maria"` a second time changed nothing.
- `remove` takes an item out, and raises a `KeyError` if it isn't there.
- `discard` also takes an item out, but quietly does nothing if it isn't there. Use it when you're not sure.

## Is it in there? Fast.

Checking membership with `in` works for lists too, but for sets, it's dramatically faster. A list has to be searched from the start, item by item. A set jumps straight to the answer, the way a dictionary finds a key. For a few dozen items, you won't notice. For a million, a set answers instantly while a list takes a noticeable moment, every single time.

```python
banned_words = {"spam", "scam", "free money"}
message = "Click here for free money"

for word in banned_words:
    if word in message.lower():
        print("Blocked:", word)
```

```text
Blocked: free money
```

## Removing duplicates from a list

The most common everyday use of a set is removing duplicates. Turn a list into a set and back:

```python
visits = ["Manila", "Cebu", "Manila", "Davao", "Cebu", "Manila"]
unique_places = sorted(set(visits))
print(unique_places)
print(len(unique_places), "different places")
```

```text
['Cebu', 'Davao', 'Manila']
3 different places
```

`set(visits)` keeps one of each, and `sorted()` turns the result back into a list in a predictable order.

## Comparing groups: set math

Sets can be combined, like the Venn diagrams from math class. Say two clubs have these members:

```python
chess = {"Ana", "Ben", "Carlo", "Dina"}
robotics = {"Carlo", "Dina", "Eli"}

print(sorted(chess | robotics))
print(sorted(chess & robotics))
print(sorted(chess - robotics))
print(sorted(chess ^ robotics))
```

```text
['Ana', 'Ben', 'Carlo', 'Dina', 'Eli']
['Carlo', 'Dina']
['Ana', 'Ben']
['Ana', 'Ben', 'Eli']
```

| Operator | Name | Means |
|---|---|---|
| `a \| b` | union | in either club (or both) |
| `a & b` | intersection | in both clubs |
| `a - b` | difference | in the first club, but not the second |
| `a ^ b` | symmetric difference | in exactly one club, not both |

Each operation gives back a new set and leaves the originals alone. There are method versions too, like `chess.union(robotics)`, if you find names easier to read than symbols.

## Lists, tuples, dictionaries, or sets?

You now know Python's four main collections. Here's how to choose:

| Use a... | When you need... |
|---|---|
| **list** | items in order, that may change, where duplicates are fine |
| **tuple** | a small fixed group of values that belong together |
| **dictionary** | to look values up by a key |
| **set** | unique items, fast "is it in here?" checks, or group comparisons |

## Try it

A teacher is comparing who submitted two assignments. This program finds who did both, who did only one, and who's missing everything. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'roster = {&quot;Ana&quot;, &quot;Ben&quot;, &quot;Carlo&quot;, &quot;Dina&quot;, &quot;Eli&quot;, &quot;Fe&quot;}\nessay = [&quot;Ana&quot;, &quot;Carlo&quot;, &quot;Dina&quot;, &quot;Ana&quot;, &quot;Eli&quot;]\nquiz = [&quot;Ben&quot;, &quot;Carlo&quot;, &quot;Eli&quot;, &quot;Carlo&quot;]\n\nessay_set = set(essay)\nquiz_set = set(quiz)\n\nprint(&quot;Essay submissions (with repeats):&quot;, len(essay))\nprint(&quot;Different students who sent the essay:&quot;, len(essay_set))\n\nprint(&quot;Did both:&quot;, sorted(essay_set &amp; quiz_set))\nprint(&quot;Essay only:&quot;, sorted(essay_set - quiz_set))\nprint(&quot;Did at least one:&quot;, len(essay_set | quiz_set))\nprint(&quot;Missing both:&quot;, sorted(roster - essay_set - quiz_set))\nprint(&quot;Is Fe in the quiz set?&quot;, &quot;Fe&quot; in quiz_set)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Essay submissions (with repeats): 5
Different students who sent the essay: 4
Did both: ['Carlo', 'Eli']
Essay only: ['Ana', 'Dina']
Did at least one: 5
Missing both: ['Fe']
Is Fe in the quiz set? False
```

Ana submitted her essay twice, but the set only counts her once. Carlo and Eli are in both sets. Subtracting both sets from the roster leaves only the students who appear in neither.
:::

## Try it yourself

1. Find the students who did the quiz but not the essay.
2. Remove the `sorted()` from one of the lines and run the program a few times. Does the order change between runs?
3. Given the sentence `"the cat saw the other cat"`, print how many *different* words it contains, using `split()` and a set.

## Check your understanding

<Quiz
	question="What does set([1, 2, 2, 3, 3, 3]) contain?"
	:options="['1, 2, 2, 3, 3, 3', '1, 2, 3', 'Only 3', 'An error']"
	:answer-index="1"
	explanation="A set keeps only one of each item, so the duplicates disappear."
/>

<Quiz
	question="How do you make an empty set?"
	:options="['{}', '[]', 'set()', '()']"
	:answer-index="2"
	explanation="{} makes an empty dictionary. Use set() for an empty set."
/>

<Quiz
	question="a = {1, 2, 3} and b = {2, 3, 4}. What is a &amp; b?"
	:options="['{2, 3}', '{1, 2, 3, 4}', '{1}', '{1, 4}']"
	:answer-index="0"
	explanation="&amp; is intersection: the items that are in both sets."
/>

## Up next

Many of the loops in the last few lessons followed the same pattern: start with an empty list, loop, and append. Python has a compact way to write exactly that in one line: [List and Dictionary Comprehensions](/lessons/python/comprehensions).
