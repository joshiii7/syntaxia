---
title: "Python Inheritance: Build Classes on Top of Other Classes"
description: "Reuse code with Python inheritance: create child classes, extend a parent's __init__ with super(), override methods, and check an object's type with isinstance()."
---

# Inheritance

*A family recipe gets passed down. You keep what works, add your own twist, and maybe swap one ingredient you never liked.*

A school program needs a `Student` class and a `Teacher` class. Both have a name. Both need a way to introduce themselves. But a student also has a grade level, and a teacher has a subject.

You could write both classes from scratch, copying the shared parts into each. But then, when you add an email address, you add it twice. When you fix a bug in the shared part, you fix it twice, and eventually you forget one.

**Inheritance** lets you write the shared parts once, in a general class, and build more specific classes on top of it.

## A family recipe

Your grandmother has a famous adobo recipe. Your mother learned it, kept almost all of it, and added her own twist: a splash of coconut milk. You learned your mother's version, and you add chili.

Nobody rewrote the recipe from scratch. Each generation **inherited** everything from the one before, **added** something new, and sometimes **replaced** a step with their own version.

Python classes work the same way:

- A **parent class** (also called a **base class** or **superclass**) holds what's shared: here, `Person`.
- A **child class** (or **subclass**) inherits everything from its parent, and adds or changes what it needs: here, `Student` and `Teacher`.

## Making a child class

Put the parent's name in parentheses after the child's name:

```python
class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print(f"Hi, I'm {self.name}.")


class Student(Person):
    pass


maria = Student("Maria")
maria.introduce()
```

```text
Hi, I'm Maria.
```

`class Student(Person):` means "a Student is a Person, plus more." `pass` means "nothing to add yet," since Python needs at least one line in the block. Even with nothing added, `Student` inherited `__init__` and `introduce` from `Person`, so every student can already introduce themselves.

A good test for whether inheritance fits is the phrase **"is a."** A student *is a* person. A teacher *is a* person. A classroom is *not* a person, so it shouldn't inherit from `Person`.

## Adding to `__init__` with `super()`

A student needs a grade level too. The child can have its own `__init__`, but it should still let the parent set up the parts the parent owns. That's what **`super()`** is for: it reaches the parent class.

```python
class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print(f"Hi, I'm {self.name}.")


class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade


maria = Student("Maria", 11)
print(maria.name, maria.grade)
```

```text
Maria 11
```

`super().__init__(name)` runs `Person`'s `__init__`, which sets `self.name`. Then `Student` adds its own part, `self.grade`. It's like pouring a house's foundation before building the second floor: the parent's part first, then the child's.

Forget the `super().__init__` call, and the parent's setup never runs. The student would have a `grade` but no `name`, and the first method that uses `self.name` would crash.

## Overriding methods

A child can replace a method it inherited, by defining a method with the **same name**. This is called **overriding**:

```python
class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print(f"Hi, I'm {self.name}.")


class Teacher(Person):
    def __init__(self, name, subject):
        super().__init__(name)
        self.subject = subject

    def introduce(self):
        print(f"Good morning, I'm {self.name}. I teach {self.subject}.")


Person("Mang Tony").introduce()
Teacher("Ms. Reyes", "Biology").introduce()
```

```text
Hi, I'm Mang Tony.
Good morning, I'm Ms. Reyes. I teach Biology.
```

Call `introduce()` on a teacher, and Python uses the teacher's version. Call it on a plain `Person`, and it uses the original. Python always looks in the object's own class first, and only goes up to the parent if the method isn't there.

## Building on the parent's version

Sometimes you don't want to replace the parent's method completely, just add to it. Call the parent's version with `super()`, then do your own part:

```python
class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print(f"Hi, I'm {self.name}.")


class Student(Person):
    def __init__(self, name, grade):
        super().__init__(name)
        self.grade = grade

    def introduce(self):
        super().introduce()
        print(f"I'm in grade {self.grade}.")


Student("Maria", 11).introduce()
```

```text
Hi, I'm Maria.
I'm in grade 11.
```

That's the family recipe again: keep grandma's steps, then add your own.

## Checking an object's type: `isinstance`

`isinstance(obj, SomeClass)` answers `True` if the object was made from that class *or any of its children*:

```python
class Person:
    pass

class Student(Person):
    pass

maria = Student()
print(isinstance(maria, Student))
print(isinstance(maria, Person))
print(isinstance(maria, str))
```

```text
True
True
False
```

A student *is a* person, so `isinstance(maria, Person)` is `True`. Every class you write also quietly inherits from a built-in class called `object`, which is where default behavior, like the unhelpful way objects print, comes from.

## Treating different objects the same way

Here's where inheritance really pays off. Different kinds of people can live in one list, and one loop can ask each of them to introduce themselves. Each object runs its own version of the method:

```python
class Person:
    def __init__(self, name):
        self.name = name

    def introduce(self):
        print(f"Hi, I'm {self.name}.")


class Teacher(Person):
    def introduce(self):
        print(f"Good morning, I'm {self.name}, your teacher.")


people = [Person("Mang Tony"), Teacher("Ms. Reyes"), Person("Ana")]
for person in people:
    person.introduce()
```

```text
Hi, I'm Mang Tony.
Good morning, I'm Ms. Reyes, your teacher.
Hi, I'm Ana.
```

The loop doesn't check what kind of person each one is. It just says "introduce yourself," and each object answers in its own way. This idea has a name, **polymorphism**, from Greek words meaning "many shapes." If the school hires a librarian next year, you write a `Librarian` class, and this loop works without changing a single line.

## Don't overdo it

Inheritance is powerful, but deep family trees get confusing fast. If you need to open five parent classes to understand what one method does, the design has gone too far. Keep hierarchies shallow, one or two levels, and only use inheritance when the "is a" test really passes.

## Try it

This program builds a small school with a `Person` parent and `Student` and `Teacher` children. Each child sets up its own attributes with `super()`, and each introduces itself differently. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="520px"
	:model-value="'class Person:\n    def __init__(self, name):\n        self.name = name\n\n    def introduce(self):\n        print(f&quot;Hi, I\'m {self.name}.&quot;)\n\n\nclass Student(Person):\n    def __init__(self, name, grade):\n        super().__init__(name)\n        self.grade = grade\n\n    def introduce(self):\n        super().introduce()\n        print(f&quot;  I\'m in grade {self.grade}.&quot;)\n\n\nclass Teacher(Person):\n    def __init__(self, name, subject):\n        super().__init__(name)\n        self.subject = subject\n\n    def introduce(self):\n        print(f&quot;Good morning, class. I\'m {self.name}, and I teach {self.subject}.&quot;)\n\n\npeople = [\n    Person(&quot;Mang Tony&quot;),\n    Student(&quot;Maria&quot;, 11),\n    Teacher(&quot;Ms. Reyes&quot;, &quot;Biology&quot;),\n]\n\nfor person in people:\n    person.introduce()\n\nstudents = [p for p in people if isinstance(p, Student)]\nprint(&quot;Students:&quot;, [s.name for s in students])\nprint(&quot;Everyone is a Person?&quot;, all(isinstance(p, Person) for p in people))\n'"
/>

`all(...)` gives `True` only if every value inside it is true.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Hi, I'm Mang Tony.
Hi, I'm Maria.
  I'm in grade 11.
Good morning, class. I'm Ms. Reyes, and I teach Biology.
Students: ['Maria']
Everyone is a Person? True
```

The guard is a plain `Person`, so he uses the original `introduce`. Maria's version calls `super().introduce()` first, then adds a line. Ms. Reyes's version replaces the original completely. And every object in the list passes `isinstance(p, Person)`, because students and teachers are people.
:::

## Try it yourself

1. Add a `Principal` class that inherits from `Teacher`. Its `__init__` takes only a name, and passes `"School leadership"` as the subject. Add one to the list. Which `introduce` runs?
2. In `Student.__init__`, delete the `super().__init__(name)` line and run the program. What error do you get, and on which line?
3. Add an `email` attribute to `Person`, set through its `__init__`. How many classes do you have to change? Why?

## Check your understanding

<Quiz
	question="What does class Student(Person): mean?"
	:options="['Student and Person are the same class', 'Person inherits from Student', 'Student inherits the attributes and methods of Person, and can add its own', 'Student can only use its own methods']"
	:answer-index="2"
	explanation="The parent goes in the parentheses. The child gets everything the parent has, plus whatever it adds or overrides."
/>

<Quiz
	question="What does super().__init__(name) do inside a child's __init__?"
	:options="['Runs the parent class\'s __init__, so the parent can set up its part of the object', 'Creates a second object', 'Deletes the parent class', 'Calls the child\'s own __init__ again']"
	:answer-index="0"
	explanation="super() reaches the parent class. Calling its __init__ lets the parent set up the attributes it owns, like self.name."
/>

<Quiz
	question="A Teacher class defines its own introduce method, and so does its parent, Person. Which one runs for a Teacher object?"
	:options="['Person\'s version', 'Both, parent first', 'Neither, it is an error', 'Teacher\'s version, because Python looks in the object\'s own class first']"
	:answer-index="3"
	explanation="This is overriding. Python checks the object's own class first, and only goes up to the parent if the method isn't there."
/>

## Up next

Your objects can inherit, override, and introduce themselves. But printing one still gives you a strange memory address, and `==` can't tell that two students are the same. In [Special Methods: __str__ and Friends](/lessons/python/special-methods), you'll teach your classes to print, compare, and act like Python's own types.
