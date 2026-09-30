---
title: "Python Special Methods: __str__, __repr__, __eq__, and More"
description: "Teach your Python classes to print nicely with __str__ and __repr__, compare with __eq__ and __lt__, work with len(), and write less code with dataclasses."
---

# Special Methods: __str__ and Friends

*A new phone learns your face, your fingerprint, and your voice. After that, it responds to you the way you expect, without you pressing any buttons.*

At the end of [Classes and Objects](/lessons/python/classes-and-objects), printing an object gave something like `<__main__.Student object at 0x0000021F3A8B5E50>`. And if you've tried comparing two objects with `==`, you may have noticed that two students with the same name and scores aren't "equal."

That's because Python doesn't know what your class *means*. Special methods are how you tell it: how your objects should print, compare, and behave with built-in functions like `len()`, so they work as smoothly as Python's own types.

## Teaching your phone

A brand-new phone doesn't know who you are. Once you teach it your fingerprint, though, it responds to a simple touch. You didn't change how you use the phone; you taught it what "you" means.

Special methods work the same way. `print(student)`, `a == b`, and `len(team)` are the everyday gestures. Your class teaches Python how to respond to each one, by defining a method with a special name.

## Dunder names

Special methods have names that start and end with two underscores, like `__init__`, which you've been writing since [Classes and Objects](/lessons/python/classes-and-objects). Python programmers call them **dunder** methods, short for "double underscore": `__init__` is read "dunder init."

You never call these methods by name yourself. Python calls them for you, at the right moment: `__init__` when an object is created, `__str__` when it's printed, and so on.

## `__str__`: how it prints

Define `__str__` to return the text you want `print` (and `str()`, and f-strings) to show:

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def __str__(self):
        return f"{self.name} (grade {self.grade})"


maria = Student("Maria", 11)
print(maria)
print(f"Top student: {maria}")
```

```text
Maria (grade 11)
Top student: Maria (grade 11)
```

`__str__` must **return** a string, not print it. Python takes the string it gives back and does the printing.

## `__repr__`: how it looks to programmers

There's a second way to turn an object into text, meant for programmers rather than users. Here's where you'll notice it:

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def __str__(self):
        return f"{self.name} (grade {self.grade})"


team = [Student("Maria", 11), Student("Ben", 10)]
print(team[0])
print(team)
```

The first `print` shows `Maria (grade 11)`, as expected. But the second shows something like `[<__main__.Student object at 0x000001A2B3C4D5E0>, <__main__.Student object at 0x000001A2B3C4D6F0>]`, with addresses that change every run.

Printing one student uses `__str__`. But printing a **list** shows each item using a different method, `__repr__`, and since this class doesn't have one, you get the memory addresses again.

`__repr__` should return a precise, unambiguous description, ideally one that looks like the code to create the object:

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def __str__(self):
        return f"{self.name} (grade {self.grade})"

    def __repr__(self):
        return f"Student({self.name!r}, {self.grade})"


team = [Student("Maria", 11), Student("Ben", 10)]
print(team)
print(team[0])
```

```text
[Student('Maria', 11), Student('Ben', 10)]
Maria (grade 11)
```

`!r` inside the f-string uses the value's own `repr`, which puts quotes around strings. You've seen this difference before: in the interactive shell from [How Python Runs](/lessons/python/how-python-runs), typing a string shows it with quotes. That's `repr`. `print` shows it without them. That's `str`.

A good rule: always write `__repr__`, since it helps you debug, and add `__str__` when users need a friendlier version. If a class has only `__repr__`, Python uses it for printing too.

## `__eq__`: when are two objects equal?

By default, `==` between two objects only says `True` if they're the very same object, not two objects with the same data:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


print(Point(3, 4) == Point(3, 4))
```

```text
False
```

Define `__eq__` to say what "equal" means for your class. It receives the other object and returns `True` or `False`:

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return self.x == other.x and self.y == other.y


print(Point(3, 4) == Point(3, 4))
print(Point(3, 4) == Point(4, 3))
```

```text
True
False
```

Now `==`, `!=`, and `in` on a list of points all work the way you'd expect.

## `__lt__`: sorting your objects

`sorted()` and `max()` need to know which of two objects comes first. Define `__lt__` (short for "less than"), which answers "is `self` less than `other`?":

```python
class Student:
    def __init__(self, name, average):
        self.name = name
        self.average = average

    def __lt__(self, other):
        return self.average < other.average

    def __repr__(self):
        return f"{self.name}: {self.average}"


students = [Student("Maria", 88.3), Student("Ben", 81.0), Student("Carlo", 94.3)]
print(sorted(students))
print(max(students))
```

```text
[Ben: 81.0, Maria: 88.3, Carlo: 94.3]
Carlo: 94.3
```

## `__len__`: working with `len()`

If your object holds a collection of things, `__len__` lets `len()` count them:

```python
class Team:
    def __init__(self, name):
        self.name = name
        self.members = []

    def add(self, person):
        self.members.append(person)

    def __len__(self):
        return len(self.members)


chess = Team("Chess Club")
chess.add("Ana")
chess.add("Ben")
print(len(chess))
```

```text
2
```

There are dozens more special methods, for everything from `+` (`__add__`) to looping with `for` (`__iter__`), but these are the ones you'll write most.

## A shortcut: dataclasses

For classes that mostly just hold data, writing `__init__`, `__repr__`, and `__eq__` by hand gets repetitive. Python's `dataclasses` module can write them for you:

```python
from dataclasses import dataclass


@dataclass
class Point:
    x: int
    y: int


a = Point(3, 4)
print(a)
print(a == Point(3, 4))
```

```text
Point(x=3, y=4)
True
```

`@dataclass` above the class is a **decorator**: it takes the class and adds methods to it. You list the attributes with type hints (from [Parameters and Return Values](/lessons/python/parameters)), and it writes `__init__`, `__repr__`, and `__eq__` automatically. Real projects use dataclasses constantly, so it's good to recognize them.

## Try it

This program models a small class of students, and uses special methods to print them, compare them, sort them, and count them. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="520px"
	:model-value="'class Student:\n    def __init__(self, name, scores):\n        self.name = name\n        self.scores = scores\n\n    def average(self):\n        return sum(self.scores) / len(self.scores)\n\n    def __str__(self):\n        return f&quot;{self.name} ({self.average():.1f})&quot;\n\n    def __repr__(self):\n        return f&quot;Student({self.name!r})&quot;\n\n    def __eq__(self, other):\n        return self.name == other.name\n\n    def __lt__(self, other):\n        return self.average() &lt; other.average()\n\n\nclass Section:\n    def __init__(self, name, students):\n        self.name = name\n        self.students = students\n\n    def __len__(self):\n        return len(self.students)\n\n    def __str__(self):\n        return f&quot;Section {self.name}, {len(self)} students&quot;\n\n\nsection = Section(&quot;11-B&quot;, [\n    Student(&quot;Maria&quot;, [88, 94, 83]),\n    Student(&quot;Ben&quot;, [72, 80, 91]),\n    Student(&quot;Carlo&quot;, [95, 90, 98]),\n])\n\nprint(section)\nprint(section.students)\nprint(&quot;Top:&quot;, max(section.students))\nfor student in sorted(section.students, reverse=True):\n    print(&quot; &quot;, student)\nprint(Student(&quot;Ben&quot;, []) in section.students)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Section 11-B, 3 students
[Student('Maria'), Student('Ben'), Student('Carlo')]
Top: Carlo (94.3)
  Carlo (94.3)
  Maria (88.3)
  Ben (81.0)
True
```

Printing the section uses its `__str__`, which calls `len(self)`, which runs `__len__`. Printing the list shows each student's `__repr__`. `max` and `sorted` use `__lt__` to compare averages. And the last line is `True`: `__eq__` only compares names, so a brand-new Ben with no scores counts as "in" the list.
:::

## Try it yourself

1. Remove the `__repr__` method and run the program. What does the second line print now?
2. Change `__eq__` so two students are equal only if their names *and* scores match. What does the last line print now?
3. Add an `__add__(self, other)` method to `Section` that returns a new section containing both sections' students, so `section_a + section_b` works.

## Check your understanding

<Quiz
	question="Which special method decides what print(obj) shows?"
	:options="['__init__', '__eq__', '__str__', '__len__']"
	:answer-index="2"
	explanation="print calls str() on the object, which uses __str__. If there's no __str__, Python falls back to __repr__."
/>

<Quiz
	question="You print a list of your objects and see long memory addresses, even though your class has __str__. Why?"
	:options="['Printing a list uses each item\'s __repr__, not __str__', 'Lists cannot hold objects', '__str__ must print instead of return', 'You need to call __str__ yourself']"
	:answer-index="0"
	explanation="Containers like lists show their items with repr. Define __repr__ as well, and the list will print nicely."
/>

<Quiz
	question="Without __eq__, what does Point(1, 2) == Point(1, 2) give?"
	:options="['True', 'An error', 'None', 'False, because they are two different objects']"
	:answer-index="3"
	explanation="By default, == on objects only checks whether they're the very same object. Define __eq__ to compare their data instead."
/>

## Up next

That completes the Objects and Classes chapter. Your programs can now model real things. They can also go wrong in real ways, so the next chapter starts with the most useful skill of all: [Debugging Python Programs](/lessons/python/debugging).
