---
title: "Python Classes and Objects for Beginners"
description: "Start object-oriented programming in Python: define a class as a blueprint, set up new objects with __init__, and give each object its own attributes and methods."
---

# Classes and Objects

*An architect draws one blueprint. A builder uses it to build a whole street of houses, each with its own family and its own paint color.*

In [Nested Data Structures](/lessons/python/nested-data), each student was a dictionary: `{"name": "Maria", "grade": 11, "scores": [88, 94, 83]}`. That works, but it has weak spots. Nothing stops one student from being written with `"Name"` instead of `"name"`, or from missing `"scores"` entirely. And the code that works with students (calculating an average, printing a report) lives somewhere else, separate from the data it works on.

**Classes** fix both. A class describes, once, what every student has and what every student can do. Then you create as many students as you like from that description. This way of building programs out of objects is called **object-oriented programming**, or **OOP**.

## Blueprints and houses

An architect draws one blueprint for a house. It says every house will have a front door, some bedrooms, and a paint color. But you can't live in a blueprint. It's only a plan.

A builder uses that one blueprint to build ten houses on a street. Each house is real and separate: one is blue with three bedrooms, the next is yellow with two. Repainting one house doesn't change the others, and none of it changes the blueprint.

- The **class** is the blueprint.
- An **object** is one house built from it. Objects are also called **instances** of the class.

You've been using objects all along, in fact. Every string is an object of the class `str`, and every list is an object of the class `list`. That's why they have methods, like `"hi".upper()` and `scores.append(5)`. Now you'll design classes of your own.

## Your first class

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade


maria = Student("Maria", 11)
ben = Student("Ben", 10)

print(maria.name, maria.grade)
print(ben.name, ben.grade)
```

```text
Maria 11
Ben 10
```

Piece by piece:

- `class Student:` starts the blueprint. Class names use **PascalCase**, a capital letter for each word, like `Student` or `BankAccount`. That's how you can tell a class from a function at a glance.
- `__init__` (two underscores on each side) is a special method that **sets up each new object**. Python calls it automatically whenever you create one. Its name is short for "initialize."
- `self` is the new object being set up. `self.name = name` means "this object's `name` is the `name` that was passed in."
- `Student("Maria", 11)` creates a new object. It looks like calling a function, and in a way it is: it builds an object and hands it back. The arguments go to `__init__`, after `self`, which Python fills in by itself.

## Attributes: each object's own data

`self.name` and `self.grade` are **attributes**: variables that belong to one particular object. Reach them with a dot: `maria.name`.

Each object has its own set:

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade


maria = Student("Maria", 11)
ben = Student("Ben", 10)

ben.grade = 11
print(maria.grade, ben.grade)
```

```text
11 11
```

Changing Ben's grade did nothing to Maria's. Two separate houses from the same blueprint.

## Methods: what an object can do

Attributes are what an object **has**. **Methods** are what it can **do**. A method is a function defined inside the class, and it always takes `self` as its first parameter, so it can reach the object's own attributes:

```python
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    def average(self):
        return sum(self.scores) / len(self.scores)

    def introduce(self):
        print(f"Hi, I'm {self.name}, and my average is {self.average():.1f}.")


maria = Student("Maria", [88, 94, 83])
ben = Student("Ben", [72, 80, 91])

maria.introduce()
ben.introduce()
print(ben.average() > maria.average())
```

```text
Hi, I'm Maria, and my average is 88.3.
Hi, I'm Ben, and my average is 81.0.
False
```

When you call `maria.introduce()`, Python passes `maria` in as `self`, so `self.name` is Maria's name and `self.average()` is Maria's average. Call it on `ben`, and `self` is Ben. One method, and it always works on the object it was called on.

That's the big idea of OOP. You don't write `introduce(maria)`, passing data to a separate function. You ask the object to do something with its own data: `maria.introduce()`. The data and the behavior travel together. [Methods and self](/lessons/python/methods-and-self) looks at `self` more closely.

## Objects in a list

Objects are ordinary values, so you can put them in lists, pass them to functions, and return them. A list of `Student` objects replaces the list of dictionaries from [Nested Data Structures](/lessons/python/nested-data):

```python
class Student:
    def __init__(self, name, scores):
        self.name = name
        self.scores = scores

    def average(self):
        return sum(self.scores) / len(self.scores)


students = [
    Student("Maria", [88, 94, 83]),
    Student("Ben", [72, 80, 91]),
    Student("Carlo", [95, 90, 98]),
]

best = max(students, key=lambda s: s.average())
print("Top student:", best.name)
```

```text
Top student: Carlo
```

`lambda s: s.average()` is a tiny, nameless function, written inline: "given a student `s`, give back their average." `max` uses it to compare the students. You'll see `lambda` now and then as a shortcut for small functions like this.

Compared with dictionaries, objects are harder to get wrong. A typo like `maria.nmae` is an error you'll hear about immediately, and every student is guaranteed to have what `__init__` gives them.

## Printing an object

What happens if you print an object directly?

```python
class Student:
    def __init__(self, name):
        self.name = name

print(Student("Maria"))
```

You get something like `<__main__.Student object at 0x0000021F3A8B5E50>`: the class name and a memory address, which changes every run. Not very useful. In [Special Methods](/lessons/python/special-methods), you'll teach your classes to print themselves nicely. Until then, print the attributes you want.

## Try it

This program defines a `BankAccount` class for a school savings club, with attributes set up in `__init__` and methods that use them. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="460px"
	:model-value="'class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount &gt; self.balance:\n            print(f&quot;{self.owner}: not enough money for {amount}.&quot;)\n            return\n        self.balance -= amount\n\n    def report(self):\n        print(f&quot;{self.owner} has {self.balance} pesos.&quot;)\n\n\nmaria = BankAccount(&quot;Maria&quot;, 100)\nben = BankAccount(&quot;Ben&quot;)\n\nmaria.deposit(50)\nben.deposit(30)\nben.withdraw(80)\nmaria.withdraw(120)\n\nmaria.report()\nben.report()\n\naccounts = [maria, ben]\nprint(&quot;Club total:&quot;, sum(account.balance for account in accounts))\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Ben: not enough money for 80.
Maria has 30 pesos.
Ben has 30 pesos.
Club total: 60
```

Ben started with the default balance of 0, deposited 30, and couldn't withdraw 80, so his balance stayed at 30. Maria had 150 after her deposit, so her 120 withdrawal worked. Each account kept its own balance the whole time.
:::

## Try it yourself

1. Create a third account for yourself with 200 pesos, and add it to `accounts`.
2. Add a method `transfer(self, other, amount)` that moves money from this account to another account.
3. Change `deposit` so it refuses amounts of 0 or less, printing a message instead.

## Check your understanding

<Quiz
	question="What is the difference between a class and an object?"
	:options="['They are the same thing', 'An object is the blueprint, and a class is built from it', 'A class is a blueprint; an object is one thing built from it, with its own data', 'A class can only hold numbers']"
	:answer-index="2"
	explanation="The class describes what every object will have and do. Each object created from it is separate, with its own attribute values."
/>

<Quiz
	question="When does Python call __init__?"
	:options="['Automatically, every time a new object is created', 'Only when you call it by name', 'When the program ends', 'When you print an object']"
	:answer-index="0"
	explanation="Writing Student(&quot;Maria&quot;, 11) creates an object and calls __init__ to set it up, passing the new object as self."
/>

<Quiz
	question="Inside a method, what does self refer to?"
	:options="['The class itself', 'The first argument you passed', 'The main program', 'The object the method was called on']"
	:answer-index="3"
	explanation="Calling maria.introduce() passes maria in as self, so self.name is Maria's name."
/>

## Up next

`self` is showing up everywhere: in `__init__`, in every method, in front of every attribute. Next, you'll see exactly how it works, and why Python makes you write it, in [Methods and self](/lessons/python/methods-and-self).
