---
title: "Python Nested Data: Lists of Dictionaries and More"
description: "Model real-world data in Python by nesting collections: lists of dictionaries, dictionaries of lists, and dictionaries inside dictionaries, and loop through them safely."
---

# Nested Data Structures

*A filing cabinet has drawers. Each drawer has folders. Each folder has pages. To find one fact, you go drawer, folder, page.*

Real information rarely fits in one flat list. A class has students. Each student has a name, a grade level, and several quiz scores. Each quiz belongs to a subject. You've learned four kinds of collections: [lists](/lessons/python/lists), [tuples](/lessons/python/tuples), [dictionaries](/lessons/python/dictionaries), and [sets](/lessons/python/sets). The real power comes from putting them **inside each other**.

## A filing cabinet

Think of a school office's filing cabinet. The cabinet has a drawer for each grade level. Inside each drawer is a folder for each student. Inside each folder are pages: a report card, an ID photo, a list of clubs.

To find Maria's second quiz score, you'd open the grade 11 drawer, pull out Maria's folder, find the scores page, and read the second line. Nested data works exactly like that: you go one level at a time, from the outside in.

## A list of dictionaries

The most common shape of all: a **list** of records, where each record is a **dictionary**. Each dictionary describes one thing, and the list holds them all in order.

```python
students = [
    {"name": "Maria", "grade": 11, "scores": [88, 94, 83]},
    {"name": "Ben", "grade": 10, "scores": [72, 80]},
    {"name": "Carlo", "grade": 11, "scores": [95, 90, 98]},
]

print(len(students))
print(students[0]["name"])
print(students[2]["scores"][1])
```

```text
3
Maria
90
```

Long nested structures are easier to read spread over several lines, one record per line, like above. Python doesn't mind the line breaks inside brackets, and the comma after the last item is allowed, which makes adding another line easy.

Read `students[2]["scores"][1]` from left to right, one step at a time, like opening the filing cabinet:

1. `students[2]` is the third dictionary: Carlo's record.
2. `["scores"]` is the value for the `"scores"` key in it: the list `[95, 90, 98]`.
3. `[1]` is the second item in that list: `90`.

## Looping through records

A `for` loop hands you one dictionary at a time, and you use its keys inside the loop:

```python
students = [
    {"name": "Maria", "grade": 11, "scores": [88, 94, 83]},
    {"name": "Ben", "grade": 10, "scores": [72, 80]},
    {"name": "Carlo", "grade": 11, "scores": [95, 90, 98]},
]

for student in students:
    average = sum(student["scores"]) / len(student["scores"])
    print(f"{student['name']} (grade {student['grade']}): {average:.1f}")
```

```text
Maria (grade 11): 88.3
Ben (grade 10): 76.0
Carlo (grade 11): 94.3
```

Notice `student['name']` uses single quotes inside the f-string, because the f-string itself uses double quotes.

This shape, a list of dictionaries, is also exactly what data looks like when it comes from files and websites. You'll see it again in [Working with JSON](/lessons/python/json).

## A dictionary of lists

Sometimes it's more natural to group things under a key. Each club has a list of members:

```python
clubs = {
    "chess": ["Ana", "Ben"],
    "robotics": ["Carlo", "Dina", "Eli"],
}

clubs["chess"].append("Fe")
clubs["drama"] = []

for club, members in clubs.items():
    print(f"{club}: {len(members)} members")
```

```text
chess: 3 members
robotics: 3 members
drama: 0 members
```

`clubs["chess"]` is a list, so you can call list methods like `append` right on it.

## A dictionary of dictionaries

When each item has a unique name, you can look records up directly by that name, instead of searching a list:

```python
inventory = {
    "notebook": {"price": 45, "stock": 120},
    "pencil": {"price": 10, "stock": 0},
}

print(inventory["notebook"]["price"])
inventory["pencil"]["stock"] += 50
print(inventory["pencil"])
```

```text
45
{'price': 10, 'stock': 50}
```

## Choosing a shape

There's no single right answer, but here's a rule of thumb:

- **List of dictionaries:** a collection of similar records, where order matters or you go through them all. *Every student in the class.*
- **Dictionary of dictionaries:** records you look up by a unique name or ID. *The product called "notebook."*
- **Dictionary of lists:** groups of items under a label. *The members of each club.*

## Missing keys, deep down

The deeper the nesting, the more places something can be missing. If one record doesn't have a key, `record["key"]` crashes with a `KeyError`. `get` from [Dictionaries](/lessons/python/dictionaries) helps here too:

```python
students = [
    {"name": "Maria", "email": "maria@example.com"},
    {"name": "Ben"},
]

for student in students:
    email = student.get("email", "(no email)")
    print(student["name"], "->", email)
```

```text
Maria -> maria@example.com
Ben -> (no email)
```

## Copies of nested data

One warning. `.copy()`, from [Lists](/lessons/python/lists), copies only the **outer** layer. The inner lists and dictionaries are still shared:

```python
original = [{"name": "Maria", "scores": [88]}]
copy = original.copy()
copy[0]["scores"].append(100)
print(original)
```

```text
[{'name': 'Maria', 'scores': [88, 100]}]
```

The copy is a new list, but it holds the same dictionary, so changing Maria's scores through `copy` changed them in `original` too. When you need a fully separate copy of nested data, use `copy.deepcopy` from the `copy` module:

```python
import copy

original = [{"name": "Maria", "scores": [88]}]
separate = copy.deepcopy(original)
separate[0]["scores"].append(100)
print(original)
```

```text
[{'name': 'Maria', 'scores': [88]}]
```

## Try it

This program keeps a small gradebook as a list of dictionaries. It adds a score, adds a student, finds the top student, and groups students by grade level. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="460px"
	:model-value="'students = [\n    {&quot;name&quot;: &quot;Maria&quot;, &quot;grade&quot;: 11, &quot;scores&quot;: [88, 94, 83]},\n    {&quot;name&quot;: &quot;Ben&quot;, &quot;grade&quot;: 10, &quot;scores&quot;: [72, 80]},\n    {&quot;name&quot;: &quot;Carlo&quot;, &quot;grade&quot;: 11, &quot;scores&quot;: [95, 90, 98]},\n]\n\nstudents[1][&quot;scores&quot;].append(91)\nstudents.append({&quot;name&quot;: &quot;Dina&quot;, &quot;grade&quot;: 10, &quot;scores&quot;: [85]})\n\n\ndef average(student):\n    return sum(student[&quot;scores&quot;]) / len(student[&quot;scores&quot;])\n\n\nfor student in students:\n    print(f&quot;{student[\'name\']:&lt;6} {average(student):5.1f}&quot;)\n\ntop = max(students, key=average)\nprint(&quot;Top student:&quot;, top[&quot;name&quot;])\n\nby_grade = {}\nfor student in students:\n    by_grade.setdefault(student[&quot;grade&quot;], []).append(student[&quot;name&quot;])\nprint(by_grade)\nprint(&quot;Total quizzes taken:&quot;, sum(len(s[&quot;scores&quot;]) for s in students))\n'"
/>

`setdefault(key, [])` gives back the list for that key, first creating an empty one if the key is new. It's a handy shortcut for building a dictionary of lists.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria   88.3
Ben     81.0
Carlo   94.3
Dina    85.0
Top student: Carlo
{11: ['Maria', 'Carlo'], 10: ['Ben', 'Dina']}
Total quizzes taken: 10
```

Ben's new 91 raises his average to 81.0. `max(students, key=average)` compares the students by calling `average` on each one. The grade groups appear in the order each grade was first seen: 11 (from Maria), then 10 (from Ben).
:::

## Try it yourself

1. Add a `"clubs"` list to Maria's dictionary, and print her clubs.
2. Print only the students in grade 11 whose average is at least 90.
3. Rebuild the gradebook as a dictionary of dictionaries, keyed by name, and print Carlo's scores with a single lookup.

## Check your understanding

<Quiz
	question="data = [{&quot;a&quot;: [1, 2, 3]}]. What is data[0][&quot;a&quot;][2]?"
	:options="['1', '2', '3', 'An error']"
	:answer-index="2"
	explanation="data[0] is the dictionary, [&quot;a&quot;] is the list [1, 2, 3] inside it, and [2] is its third item, 3."
/>

<Quiz
	question="You need to look up products by their unique product code. Which shape fits best?"
	:options="['A list of numbers', 'A dictionary of dictionaries, keyed by product code', 'A set of names', 'A tuple of lists']"
	:answer-index="1"
	explanation="Looking something up by a unique key is exactly what a dictionary is for, and each value can be a dictionary of that product's details."
/>

<Quiz
	question="new = old.copy(), where old is a list of dictionaries. You change a dictionary inside new. What happens to old?"
	:options="['It changes too, because .copy() only copies the outer list', 'Nothing, the copy is fully separate', 'An error', 'old becomes empty']"
	:answer-index="0"
	explanation="The copied list still holds the same inner dictionaries. Use copy.deepcopy for a fully separate copy."
/>

## Up next

That completes the Data Structures chapter. Dictionaries have been doing a great job of describing students, but a student can also *do* things: take a quiz, get an average, print a report card. Next, you'll bundle data and actions together, in [Classes and Objects](/lessons/python/classes-and-objects).
