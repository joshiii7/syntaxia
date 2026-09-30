---
title: "Python JSON: Save and Load Data with the json Module"
description: "Turn Python lists and dictionaries into JSON text and back with json.dumps and json.loads, save data to files with json.dump and json.load, and avoid the key surprises."
---

# Working with JSON

*Moving house, you pack each room into labeled boxes. At the new place, you unpack, and every room comes back just as it was.*

In [Reading and Writing Files](/lessons/python/file-io), you saved scores as lines of text, like `Maria,91`, and took each line apart again to load it. That works for a simple table. But what about a list of students, where each has a name, a grade level, and a *list* of scores? Inventing your own format for that, and writing the code to take it apart, gets complicated fast.

There's a standard format built for exactly this, and nearly every website, app, and programming language understands it: **JSON**.

## Packing boxes

When you move house, you don't carry the furniture across town piece by piece in your arms. You pack everything into boxes, labeled so you know what's inside. At the new place, you unpack, and each room goes back together the way it was.

JSON does that for data. It **packs** Python lists and dictionaries into plain text, so they can be saved in a file or sent across the internet. Later, it **unpacks** that text back into lists and dictionaries, just as they were. The packing step is called **serializing**, and unpacking is called **parsing**.

## What JSON looks like

**JSON** stands for **JavaScript Object Notation**. It started in JavaScript (if you've taken the [JavaScript track](/lessons/javascript/json), you've seen it already), but every language uses it now. It looks almost exactly like Python's own lists and dictionaries:

```text
{
  "name": "Maria",
  "grade": 11,
  "scores": [88, 94, 83],
  "honor_roll": true,
  "adviser": null
}
```

The differences from Python are small, but they matter:

| Python | JSON |
|---|---|
| `dict` | object, `{ }` |
| `list` (and `tuple`) | array, `[ ]` |
| `str` | string, always in **double** quotes |
| `int`, `float` | number |
| `True`, `False` | `true`, `false` (lowercase) |
| `None` | `null` |

You'll almost never write JSON by hand, though. Python's built-in `json` module translates for you.

## Python to JSON text: `json.dumps`

`json.dumps` (read it as "dump string") packs a Python value into a JSON string:

```python
import json

student = {"name": "Maria", "scores": [88, 94], "honor_roll": True, "adviser": None}
text = json.dumps(student)

print(text)
print(type(text))
```

```text
{"name": "Maria", "scores": [88, 94], "honor_roll": true, "adviser": null}
<class 'str'>
```

`True` became `true`, and `None` became `null`: `json` did the translating. For something easier to read, add `indent`:

```python
import json

student = {"name": "Maria", "scores": [88, 94]}
print(json.dumps(student, indent=2))
```

```text
{
  "name": "Maria",
  "scores": [
    88,
    94
  ]
}
```

## JSON text to Python: `json.loads`

`json.loads` ("load string") does the reverse. It unpacks JSON text into Python values:

```python
import json

text = '{"name": "Ben", "scores": [72, 80], "active": false}'
student = json.loads(text)

print(student["name"])
print(sum(student["scores"]))
print(student["active"], type(student["active"]))
```

```text
Ben
152
False <class 'bool'>
```

What comes back is an ordinary dictionary, with ordinary lists, strings, and booleans inside. Everything you learned in [Dictionaries](/lessons/python/dictionaries) and [Nested Data Structures](/lessons/python/nested-data) works on it right away.

## Saving to a file: `json.dump` and `json.load`

To work with files, drop the `s`. `json.dump` writes straight into an open file, and `json.load` reads straight from one. Together with `with` from [Reading and Writing Files](/lessons/python/file-io), saving and loading a whole nested structure takes just a few lines:

```python
import json

students = [
    {"name": "Maria", "scores": [88, 94, 83]},
    {"name": "Ben", "scores": [72, 80]},
]

with open("students.json", "w", encoding="utf-8") as file:
    json.dump(students, file, indent=2)

with open("students.json", encoding="utf-8") as file:
    loaded = json.load(file)

print(loaded == students)
print(loaded[1]["scores"])
```

```text
True
[72, 80]
```

No splitting, no converting numbers by hand: the list of dictionaries went into the file and came back exactly the same. Open `students.json` in your editor, and you'll see neatly indented JSON.

A way to remember which is which: the functions **with** an `s` work with **s**trings; the ones without work with files.

## Three surprises

JSON can't hold everything Python can, so a few things change on the round trip.

**Tuples come back as lists.** JSON has no tuples, only arrays:

```python
import json

point = {"location": (3, 4)}
print(json.loads(json.dumps(point)))
```

```text
{'location': [3, 4]}
```

**Dictionary keys become strings.** In JSON, every key must be a string, so number keys are turned into text, and they stay text when you load them:

```python
import json

rooms = {101: "Math", 102: "Science"}
loaded = json.loads(json.dumps(rooms))
print(loaded)
print(101 in loaded, "101" in loaded)
```

```text
{'101': 'Math', '102': 'Science'}
False True
```

**Some types can't be saved at all.** Sets, and objects made from your own classes, aren't part of JSON:

```python
import json

json.dumps({"tags": {"new", "sale"}})  # error: TypeError: Object of type set is not JSON serializable
```

Convert them first: a set to a list with `list(tags)`, and your own objects to dictionaries of their attributes.

## Broken JSON

If the text isn't valid JSON, `json.loads` raises a `json.JSONDecodeError`. A common cause is text written in Python style, with single quotes or `True`:

```python
import json

try:
    json.loads("{'name': 'Maria'}")
except json.JSONDecodeError as error:
    print("Not valid JSON:", error)
```

```text
Not valid JSON: Expecting property name enclosed in double quotes: line 1 column 2 (char 1)
```

When you load JSON from a file someone might edit, or from the internet, catch `json.JSONDecodeError` with the `try` and `except` from [Exceptions](/lessons/python/exceptions).

## Try it

This program saves a gradebook to a JSON file, loads it back, adds a score, saves again, and shows the round-trip surprises. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="460px"
	:model-value="'import json\n\ngradebook = {\n    &quot;section&quot;: &quot;11-B&quot;,\n    &quot;students&quot;: [\n        {&quot;name&quot;: &quot;Maria&quot;, &quot;scores&quot;: [88, 94], &quot;clubs&quot;: (&quot;chess&quot;,)},\n        {&quot;name&quot;: &quot;Ben&quot;, &quot;scores&quot;: [72], &quot;clubs&quot;: ()},\n    ],\n    &quot;rooms&quot;: {1: &quot;Math&quot;, 2: &quot;Science&quot;},\n}\n\nwith open(&quot;gradebook.json&quot;, &quot;w&quot;, encoding=&quot;utf-8&quot;) as file:\n    json.dump(gradebook, file, indent=2)\n\nwith open(&quot;gradebook.json&quot;, encoding=&quot;utf-8&quot;) as file:\n    loaded = json.load(file)\n\nloaded[&quot;students&quot;][1][&quot;scores&quot;].append(85)\n\nfor student in loaded[&quot;students&quot;]:\n    average = sum(student[&quot;scores&quot;]) / len(student[&quot;scores&quot;])\n    print(f&quot;{student[\'name\']}: {average:.1f}, clubs {student[\'clubs\']}&quot;)\n\nprint(&quot;Room keys:&quot;, list(loaded[&quot;rooms&quot;]))\nprint(&quot;Same as the original?&quot;, loaded == gradebook)\nprint(json.dumps(loaded[&quot;students&quot;][0]))\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria: 91.0, clubs ['chess']
Ben: 78.5, clubs []
Room keys: ['1', '2']
Same as the original? False
{"name": "Maria", "scores": [88, 94], "clubs": ["chess"]}
```

The clubs went in as tuples and came back as lists. The room numbers went in as numbers and came back as strings. Those two changes, plus Ben's new score, are why the loaded data no longer equals the original.
:::

## Try it yourself

1. Open `gradebook.json` in your editor after running the program. Find where `("chess",)` was saved, and what it looks like now.
2. After adding Ben's score, save `loaded` back to the file, then load it again in a second program and print Ben's scores.
3. Write a function `save_settings(settings)` that saves a dictionary to `settings.json`, and a function `load_settings()` that returns the dictionary, or an empty one if the file doesn't exist yet.

## Check your understanding

<Quiz
	question="Which function turns a Python dictionary into a JSON string?"
	:options="['json.loads', 'json.dumps', 'json.load', 'json.parse']"
	:answer-index="1"
	explanation="dumps packs Python into a JSON string. loads unpacks a JSON string. The versions without an s work with files."
/>

<Quiz
	question="How is Python's None written in JSON?"
	:options="['null', 'None', 'nil', '&quot;None&quot;']"
	:answer-index="0"
	explanation="JSON uses null for no value, and lowercase true and false for booleans. The json module translates for you."
/>

<Quiz
	question="You save {1: &quot;Math&quot;} as JSON and load it back. What do you get?"
	:options="['{1: &quot;Math&quot;}', 'An error', '[1, &quot;Math&quot;]', '{&quot;1&quot;: &quot;Math&quot;}']"
	:answer-index="3"
	explanation="JSON keys must be strings, so the number key is saved as the text &quot;1&quot;, and it stays a string when loaded."
/>

## Up next

That completes the Errors and Files chapter. You've used a lot of Python's built-in toolbox. Next, you'll reach beyond it, installing extra packages that thousands of other people have written, in [Packages, pip, and Virtual Environments](/lessons/python/packages-and-venv).
