---
title: "Python Methods and self: How Objects Use Their Own Data"
description: "Understand self in Python methods: what it is, why Python passes it for you, the mistakes that come from forgetting it, and class attributes shared by every object."
---

# Methods and self

*A school has one set of rules for every locker, "open with your own key," but each student's key only opens their own locker.*

In [Classes and Objects](/lessons/python/classes-and-objects), `self` appeared everywhere: as the first parameter of every method, and in front of every attribute. It can feel like typing a strange word for no reason. This lesson shows exactly what `self` is, why Python asks you to write it, and the two mistakes that come from forgetting it.

## The locker rules

Every student in a school follows the same locker rules: "Open your locker with your key. Put your books inside. Close it." The rules are written once, for everyone.

But when Maria follows them, she opens *her* locker, with *her* key. When Ben follows them, he opens *his*. The rules say "your," and "your" means whoever is following them right now.

In a class, the methods are the rules, written once. **`self`** is the word "your": it means whichever object the method is working on right now.

## What Python does behind the scenes

When you write this:

```python
class Student:
    def __init__(self, name):
        self.name = name

    def greet(self, greeting):
        print(f"{greeting}, I'm {self.name}.")


maria = Student("Maria")
maria.greet("Hello")
```

```text
Hello, I'm Maria.
```

Python quietly turns `maria.greet("Hello")` into this:

```python
Student.greet(maria, "Hello")
```

```text
Hello, I'm Maria.
```

The object before the dot, `maria`, is passed in as the **first** argument, and it lands in the first parameter: `self`. Then `"Hello"` lands in `greeting`. That's all `self` is: an ordinary parameter that holds the object the method was called on.

`self` isn't a keyword. You could technically call it anything, but every Python programmer uses `self`, so always use it too.

## Mistake 1: forgetting `self` in the definition

If a method is defined without `self`, Python still passes the object in, and there's nowhere to put it:

```python
class Student:
    def greet():
        print("Hello!")


maria = Student()
maria.greet()  # error: TypeError: Student.greet() takes 0 positional arguments but 1 was given
```

"But I didn't give it any arguments!" Python did: the object, `maria`. Whenever you see "takes 0 positional arguments but 1 was given" on a method, check for a missing `self`.

## Mistake 2: forgetting `self.` in front of an attribute

Inside a method, attributes must always be reached through `self`. A plain name means a local variable:

```python
class Student:
    def __init__(self, name):
        self.name = name

    def greet(self):
        print(f"Hi, I'm {name}.")


Student("Maria").greet()  # error: NameError: name 'name' is not defined
```

`name` was a parameter of `__init__`, and it vanished when `__init__` finished, just like any local variable from [Variable Scope](/lessons/python/scope). What survived is the *attribute*, `self.name`. Writing `self.` is how a method reaches into this object's own locker.

The same goes for calling one method from another: write `self.average()`, not just `average()`.

## Methods that change the object

A method can change the object's attributes, and the change lasts after the method ends, because it's stored on the object itself:

```python
class Counter:
    def __init__(self):
        self.count = 0

    def click(self):
        self.count += 1

    def reset(self):
        self.count = 0


door = Counter()
door.click()
door.click()
door.click()
print("Visitors:", door.count)
door.reset()
print("After reset:", door.count)
```

```text
Visitors: 3
After reset: 0
```

This is the clean alternative to the `global` variables from [Variable Scope](/lessons/python/scope). The count lives inside its own object, and only the methods that belong with it change it.

## Class attributes: shared by everyone

Every attribute so far has been set on `self`, so each object has its own. You can also create a variable directly inside the class, outside any method. That's a **class attribute**, and there's only one, shared by every object, like the school bell every classroom hears:

```python
class Student:
    school = "Rizal High School"
    count = 0

    def __init__(self, name):
        self.name = name
        Student.count += 1


maria = Student("Maria")
ben = Student("Ben")

print(maria.school)
print(ben.school)
print("Students created:", Student.count)
```

```text
Rizal High School
Rizal High School
Students created: 2
```

Every student can *read* `school`, and there's only one copy of it. To *change* a class attribute, go through the class name, like `Student.count += 1`. Writing `self.count += 1` would quietly create a separate count on that one object instead of updating the shared one.

Class attributes are best for constants that belong to the class, like `PASSING_SCORE = 75`, and for counters like this one. Anything that differs from object to object belongs on `self`.

## Try it

This program runs a small classroom library. Each `Book` tracks whether it's checked out, and a class attribute counts every checkout across all books. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="480px"
	:model-value="'class Book:\n    total_checkouts = 0\n    LOAN_DAYS = 7\n\n    def __init__(self, title):\n        self.title = title\n        self.borrower = None\n\n    def check_out(self, person):\n        if self.borrower is not None:\n            print(f&quot;Sorry {person}, \'{self.title}\' is with {self.borrower}.&quot;)\n            return\n        self.borrower = person\n        Book.total_checkouts += 1\n        print(f&quot;{person} borrowed \'{self.title}\' for {self.LOAN_DAYS} days.&quot;)\n\n    def give_back(self):\n        print(f&quot;{self.borrower} returned \'{self.title}\'.&quot;)\n        self.borrower = None\n\n\nnoli = Book(&quot;Noli Me Tangere&quot;)\ncosmos = Book(&quot;Cosmos&quot;)\n\nnoli.check_out(&quot;Maria&quot;)\nnoli.check_out(&quot;Ben&quot;)\ncosmos.check_out(&quot;Ben&quot;)\nnoli.give_back()\nBook.check_out(noli, &quot;Ben&quot;)\n\nprint(&quot;Total checkouts:&quot;, Book.total_checkouts)\nprint(&quot;Noli is with:&quot;, noli.borrower)\nprint(&quot;Cosmos is with:&quot;, cosmos.borrower)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Maria borrowed 'Noli Me Tangere' for 7 days.
Sorry Ben, 'Noli Me Tangere' is with Maria.
Ben borrowed 'Cosmos' for 7 days.
Maria returned 'Noli Me Tangere'.
Ben borrowed 'Noli Me Tangere' for 7 days.
Total checkouts: 3
Noli is with: Ben
Cosmos is with: Ben
```

Ben's first try failed because Maria still had the book. `Book.check_out(noli, "Ben")` is exactly what `noli.check_out("Ben")` does behind the scenes, with `noli` passed in as `self`. The failed attempt returned early, before adding to the count, so there were three real checkouts. `self.LOAN_DAYS` finds the class attribute, since the object has no attribute of its own with that name.
:::

## Try it yourself

1. Add a method `is_available(self)` that returns `True` when the book isn't checked out, and use it in `check_out`.
2. Remove `self` from the parameters of `give_back`, and predict the error before running it.
3. Add a class attribute `all_titles = []`, and append each new book's title to it in `__init__`. Print it at the end. Why do all books share one list?

## Check your understanding

<Quiz
	question="maria.greet(&quot;Hi&quot;) is a method call. What does Python actually pass to greet?"
	:options="['Only &quot;Hi&quot;', 'Nothing', 'The Student class and &quot;Hi&quot;', 'maria as self, then &quot;Hi&quot;']"
	:answer-index="3"
	explanation="The object before the dot is passed in as the first argument, self. That's why every method needs self as its first parameter."
/>

<Quiz
	question="A method call fails with takes 0 positional arguments but 1 was given. What's the most likely cause?"
	:options="['The method was defined without self', 'The class has no __init__', 'The object was never created', 'The method name is misspelled']"
	:answer-index="0"
	explanation="Python always passes the object in. A method with no parameters has nowhere to put it."
/>

<Quiz
	question="What is special about a class attribute like school = &quot;Rizal High School&quot;, set inside the class but outside any method?"
	:options="['Each object gets its own copy', 'It can only be read inside __init__', 'There is one copy, shared by every object of the class', 'It cannot be read at all']"
	:answer-index="2"
	explanation="Class attributes belong to the class itself. Attributes set on self belong to each object separately."
/>

## Up next

A school has students, but it also has teachers, and both are people with a name. Writing the shared parts twice would be a waste. In [Inheritance](/lessons/python/inheritance), you'll build one class on top of another.
