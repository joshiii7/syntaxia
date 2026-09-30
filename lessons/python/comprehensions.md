---
title: "Python List and Dictionary Comprehensions Explained"
description: "Build lists, dictionaries, and sets in one readable line with Python comprehensions, filter items with if, and learn when a regular loop is the clearer choice."
---

# List and Dictionary Comprehensions

*"For every student in the class, write down their name in capitals." One sentence, and everyone knows exactly what list you'll end up with.*

In [Lists](/lessons/python/lists), you built new lists with a pattern that you'll use constantly: start with an empty list, loop, and `append`.

```python
scores = [88, 94, 72, 65, 91]
curved = []
for score in scores:
    curved.append(score + 5)
print(curved)
```

```text
[93, 99, 77, 70, 96]
```

That's four lines for one idea: "each score, plus 5." Python has a shorter way to say exactly that, called a **comprehension**:

```python
scores = [88, 94, 72, 65, 91]
curved = [score + 5 for score in scores]
print(curved)
```

```text
[93, 99, 77, 70, 96]
```

Same result, one line, and once you're used to it, it reads almost like the sentence you'd say out loud.

## Saying what you want, not how to build it

Imagine asking a classmate for help. You could say: "Take a blank sheet. Look at the first name on the list. Write it in capitals. Look at the next name. Write it in capitals. Keep going until you run out." Or you could just say: "Write down every name on the list, in capitals."

The loop version is the first set of instructions: it describes each step of building the list. A comprehension is the second: it describes the list you want, and Python works out the steps.

## Reading a list comprehension

A list comprehension has three parts, inside square brackets:

```text
[ expression   for item in collection ]
  what to keep   where it comes from
```

Read it as: "the **expression**, for each **item** in the **collection**." Some examples:

```python
names = ["maria", "ben", "carlo"]
print([name.title() for name in names])
print([len(name) for name in names])
print([n * n for n in range(1, 6)])
```

```text
['Maria', 'Ben', 'Carlo']
[5, 3, 5]
[1, 4, 9, 16, 25]
```

A good way to read one you haven't seen before: start in the middle, at the `for`, to see what's being looped over. Then read the beginning, to see what happens to each item.

## Filtering with `if`

Add an `if` at the end, and only the items that pass the test are kept:

```python
scores = [88, 94, 72, 65, 91]
passing = [score for score in scores if score >= 75]
print(passing)
```

```text
[88, 94, 91]
```

That's the four-line "build a list of passing scores" loop from [Lists](/lessons/python/lists), in one line. You can transform and filter at the same time, too:

```python
words = ["apple", "Banana", "cherry", "Avocado"]
a_words = [word.lower() for word in words if word.lower().startswith("a")]
print(a_words)
```

```text
['apple', 'avocado']
```

## Choosing between two values

The `if` at the end *filters*: it decides which items to keep. To keep every item but change what's written depending on a condition, put a conditional expression, from [Making Decisions](/lessons/python/if-elif-else), at the *start*:

```python
scores = [88, 94, 72, 65, 91]
results = ["pass" if score >= 75 else "fail" for score in scores]
print(results)
```

```text
['pass', 'pass', 'fail', 'fail', 'pass']
```

Notice the difference: filtering gave a shorter list, but this gives one result for every score.

## Dictionary comprehensions

The same idea builds dictionaries. Use curly braces, and write a `key: value` pair at the start:

```python
names = ["Maria", "Ben", "Carlo"]
name_lengths = {name: len(name) for name in names}
print(name_lengths)

prices = {"adobo": 65, "rice": 15, "juice": 20}
on_sale = {item: price * 0.9 for item, price in prices.items() if price > 18}
print(on_sale)
```

```text
{'Maria': 5, 'Ben': 3, 'Carlo': 5}
{'adobo': 58.5, 'juice': 18.0}
```

The second one reads: "each item and its price times 0.9, for each item and price in the menu, if the price is over 18."

## Set comprehensions

Curly braces with a single value, not a pair, make a **set**, from [Sets](/lessons/python/sets), so duplicates disappear automatically:

```python
words = ["cat", "dog", "car", "door", "cow"]
first_letters = {word[0] for word in words}
print(sorted(first_letters))
```

```text
['c', 'd']
```

## When not to use one

Comprehensions are great for simple transformations and filters. They're *not* a replacement for every loop. Use a regular `for` loop when:

- you need to **do** something for each item, like printing or saving, rather than build a collection;
- the logic needs several steps, or an `elif`;
- the comprehension no longer fits comfortably on one line.

If you have to read a comprehension three times to understand it, write the loop. Clear beats clever, every time.

## Try it

This program processes a class's quiz results with comprehensions: curving scores, filtering, labeling, and building a dictionary. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'names = [&quot;maria&quot;, &quot;ben&quot;, &quot;carlo&quot;, &quot;dina&quot;, &quot;eli&quot;]\nscores = [88, 72, 95, 67, 81]\n\nprint([name.title() for name in names])\nprint([score + 5 for score in scores if score &lt; 75])\nprint([&quot;A&quot; if s &gt;= 90 else &quot;B&quot; if s &gt;= 80 else &quot;C or below&quot; for s in scores])\n\nreport = {name.title(): score for name, score in zip(names, scores)}\nprint(report)\n\nhonor = [name for name, score in report.items() if score &gt;= 85]\nprint(&quot;Honor roll:&quot;, honor)\nprint(&quot;Initials:&quot;, &quot;&quot;.join(name[0].upper() for name in names))\nprint(&quot;Squares of odd numbers:&quot;, [n ** 2 for n in range(1, 10) if n % 2 == 1])\n'"
/>

`zip(names, scores)` pairs up the two lists item by item: `("maria", 88)`, `("ben", 72)`, and so on. It's the tidy way to loop through two lists that line up.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
['Maria', 'Ben', 'Carlo', 'Dina', 'Eli']
[77, 72]
['B', 'C or below', 'A', 'C or below', 'B']
{'Maria': 88, 'Ben': 72, 'Carlo': 95, 'Dina': 67, 'Eli': 81}
Honor roll: ['Maria', 'Carlo']
Initials: MBCDE
Squares of odd numbers: [1, 9, 25, 49, 81]
```

The second line only curves the scores below 75, so it's shorter than the original list. The third line uses two conditional expressions in a row, which works but is right at the edge of readable. The initials line has no square brackets inside `join`: a comprehension written straight inside a function call works too, and makes the items one at a time.
:::

## Try it yourself

1. Write a comprehension that gives the names with more than 3 letters.
2. Rewrite the grade-labeling line (the third `print`) as a regular `for` loop with `if`, `elif`, and `else`. Which version do you find easier to read?
3. Build a dictionary that maps each number from 1 to 5 to its cube, like `{1: 1, 2: 8, ...}`.

## Check your understanding

<Quiz
	question="What does [n * 2 for n in range(4)] give?"
	:options="['[2, 4, 6, 8]', '[0, 1, 2, 3]', '[0, 2, 4, 6]', '8']"
	:answer-index="2"
	explanation="range(4) gives 0, 1, 2, 3, and each is doubled."
/>

<Quiz
	question="What does the if in [s for s in scores if s &gt;= 75] do?"
	:options="['Keeps only the scores that pass the test', 'Changes each score to True or False', 'Stops the loop at the first failing score', 'Nothing, it is ignored']"
	:answer-index="0"
	explanation="An if at the end of a comprehension filters: only items that make the condition true are kept."
/>

<Quiz
	question="When is a regular for loop better than a comprehension?"
	:options="['Never, comprehensions are always better', 'When the list has more than 10 items', 'Only for dictionaries', 'When the logic has several steps, or you are doing something with each item rather than building a collection']"
	:answer-index="3"
	explanation="Comprehensions are for building collections with simple logic. Complex steps, or actions like printing, are clearer as a loop."
/>

## Up next

Real data rarely fits in one flat list. A class has students, each student has several scores, and each score belongs to a subject. Next, you'll put lists inside dictionaries, and dictionaries inside lists, in [Nested Data Structures](/lessons/python/nested-data).
