---
title: "Java Inheritance: extends, super, and Method Overriding"
description: "Build new Java classes on top of existing ones with extends, reuse code with super, and change inherited behavior by overriding methods."
---

# Inheritance

*A family recipe gets passed down. You keep what works, add your own twist, and maybe swap one ingredient you never liked.*

A school system needs a `Student` class and a `Teacher` class. Both have a name. Both have an ID number. Both need a way to introduce themselves. But a student also has a grade level, and a teacher has a subject.

You could write both classes from scratch and copy the shared parts into each. But then, when you add an email address, you'd add it twice. When you fix a bug in the ID check, you'd fix it twice, and probably forget once.

**Inheritance** lets you write the shared parts once, in a general class, and build more specific classes on top of it.

## A family recipe

Your grandmother has a famous adobo recipe. Your mother learned it, kept almost all of it, and added her own twist: a bit of coconut milk. You learned your mother's version, and you add chili.

Nobody rewrote the recipe from scratch. Each generation **inherited** everything from the one before, **added** something new, and sometimes **replaced** a step with their own version.

Java classes can work the same way:

- A **parent class** (also called a **superclass**) holds what's shared. Here, `Person`.
- A **child class** (also called a **subclass**) inherits everything from its parent, and adds or changes what it needs. Here, `Student` and `Teacher`.

## `extends`

```java
class Person {
	String name;

	void introduce() {
		System.out.println("Hi, I'm " + name + ".");
	}
}

class Student extends Person {
	int gradeLevel;
}
```

`class Student extends Person` means "a Student is a Person, plus more." Every `Student` object automatically has a `name` field and an `introduce()` method, even though the `Student` class never mentions them:

```java
Student maria = new Student();
maria.name = "Maria";          // inherited from Person
maria.gradeLevel = 11;         // Student's own field
maria.introduce();             // inherited: Hi, I'm Maria.
```

A good test for whether inheritance fits is the phrase **"is a."** A student *is a* person. A teacher *is a* person. A car *is a* vehicle. If the sentence sounds wrong, like "a classroom is a person," inheritance is the wrong tool.

A Java class can extend only **one** parent. But a parent can have as many children as you like, and a child can have children of its own.

## Constructors and `super`

Let's add proper constructors and [encapsulation](/lessons/java/encapsulation). The parent sets up the parts it owns:

```java
class Person {
	private String name;

	Person(String name) {
		this.name = name;
	}

	String getName() {
		return name;
	}
}
```

Now, how does a `Student` set its name? The `name` field is `private` to `Person`, so `Student` can't touch it directly. And that's good: `Person` is in charge of its own data.

Instead, the child's constructor calls the parent's constructor using **`super(...)`**:

```java
class Student extends Person {
	private int gradeLevel;

	Student(String name, int gradeLevel) {
		super(name);                   // let Person set up the name
		this.gradeLevel = gradeLevel;  // then set up Student's own part
	}
}
```

`super(name)` means "run my parent's constructor with this argument." It must be the **first** line of the child's constructor, because the parent's part of the object has to be built before the child adds anything on top. It's like pouring a house's foundation before building the second floor.

If you leave `super(...)` out, Java tries to call the parent's no-argument constructor for you. If the parent doesn't have one, you get a compile error:

```java
class Person {
	private String name;

	Person(String name) {
		this.name = name;
	}
}

class Teacher extends Person {
	Teacher(String name) {
		System.out.println("Creating a teacher");
	}
}
// error: constructor Person in class Person cannot be applied to given types;
```

## Overriding methods

A child can replace a method it inherited, by writing a method with **exactly the same name and parameters**. This is called **overriding**:

```java
class Person {
	private String name;

	Person(String name) {
		this.name = name;
	}

	String getName() {
		return name;
	}

	void introduce() {
		System.out.println("Hi, I'm " + name + ".");
	}
}

class Teacher extends Person {
	private String subject;

	Teacher(String name, String subject) {
		super(name);
		this.subject = subject;
	}

	@Override
	void introduce() {
		System.out.println("Good morning, I'm " + getName() + ". I teach " + subject + ".");
	}
}
```

Call `introduce()` on a `Teacher`, and Java runs the teacher's version. Call it on a plain `Person`, and it runs the original.

That `@Override` line above the method is an **annotation**: a note to the compiler that says "I mean to override a parent method here." It's optional, but always use it. If you misspell the method name, like `introdcue`, or get the parameters wrong, the compiler will tell you there's nothing to override. Without it, you'd silently create a brand-new method, and the parent's version would keep running instead, leaving you wondering why your change did nothing.

Don't confuse **overriding** with **overloading** from [Method Overloading](/lessons/java/overloading):

- **Overloading**: same name, *different* parameters, usually in the same class.
- **Overriding**: same name, *same* parameters, in a child class, replacing the parent's version.

## Building on the parent's version with `super.`

Sometimes you don't want to replace the parent's method completely, just add to it. Call the parent's version with **`super.methodName()`**, then do your extra part:

```java
class Student extends Person {
	private int gradeLevel;

	Student(String name, int gradeLevel) {
		super(name);
		this.gradeLevel = gradeLevel;
	}

	@Override
	void introduce() {
		super.introduce();   // Hi, I'm Maria.
		System.out.println("I'm in grade " + gradeLevel + ".");
	}
}
```

That's the family recipe again: keep grandma's steps, then add your own.

## `protected`

`private` fields are hidden even from child classes. That's why `Teacher` above had to use `getName()` instead of `name`. There's a middle-ground access modifier, **`protected`**, which lets child classes use a field or method directly, while still hiding it from unrelated classes (well, mostly: code in the same package can see it too).

In practice, many Java programmers keep fields `private` and give children access through methods, exactly like `getName()`. It keeps the parent in control of its own data. That's the style this track uses.

## Every class has a parent: `Object`

If a class doesn't say `extends`, Java quietly makes it extend a built-in class called **`Object`**. So every class in Java, including yours, is a child (or grandchild, or great-grandchild) of `Object`, and inherits a few methods from it.

The one you'll override most is **`toString()`**. It decides what an object looks like when you print it. Remember the strange `Student@5ca881b5` from [Classes and Objects](/lessons/java/classes-and-objects)? That's `Object`'s default `toString()`. Override it, and printing your object shows something useful:

```java
class Book {
	private String title;
	private String author;

	Book(String title, String author) {
		this.title = title;
		this.author = author;
	}

	@Override
	public String toString() {
		return title + " by " + author;
	}
}
```

```java
Book book = new Book("Noli Me Tangere", "Jose Rizal");
System.out.println(book);   // Noli Me Tangere by Jose Rizal
```

`toString` has to be `public` here, because it's `public` in `Object`, and an override can't be more private than the method it replaces.

## Don't overdo it

Inheritance is powerful, but deep family trees get confusing fast. If you need to open five parent classes to understand what one method does, the design has gone too far. Keep hierarchies shallow, one or two levels, and only use inheritance when the "is a" test really passes. Other tools, like the [interfaces](/lessons/java/interfaces) coming up soon, often fit better.

## Try it

This program builds a small school: a `Person` parent class, and `Student` and `Teacher` children that each override `introduce()` differently and also override `toString()`. Predict each line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="720px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tPerson guard = new Person(&quot;Mang Tony&quot;);\n\t\tStudent maria = new Student(&quot;Maria&quot;, 11);\n\t\tTeacher reyes = new Teacher(&quot;Ms. Reyes&quot;, &quot;Biology&quot;);\n\n\t\tguard.introduce();\n\t\tmaria.introduce();\n\t\treyes.introduce();\n\n\t\tSystem.out.println(maria);\n\t\tSystem.out.println(reyes);\n\t\tSystem.out.println(maria.getName() + &quot; and &quot; + reyes.getName() + &quot; are both people.&quot;);\n\t}\n}\n\nclass Person {\n\tprivate String name;\n\n\tPerson(String name) {\n\t\tthis.name = name;\n\t}\n\n\tString getName() {\n\t\treturn name;\n\t}\n\n\tvoid introduce() {\n\t\tSystem.out.println(&quot;Hi, I\'m &quot; + name + &quot;.&quot;);\n\t}\n}\n\nclass Student extends Person {\n\tprivate int gradeLevel;\n\n\tStudent(String name, int gradeLevel) {\n\t\tsuper(name);\n\t\tthis.gradeLevel = gradeLevel;\n\t}\n\n\t@Override\n\tvoid introduce() {\n\t\tsuper.introduce();\n\t\tSystem.out.println(&quot;  I\'m in grade &quot; + gradeLevel + &quot;.&quot;);\n\t}\n\n\t@Override\n\tpublic String toString() {\n\t\treturn &quot;Student: &quot; + getName() + &quot;, grade &quot; + gradeLevel;\n\t}\n}\n\nclass Teacher extends Person {\n\tprivate String subject;\n\n\tTeacher(String name, String subject) {\n\t\tsuper(name);\n\t\tthis.subject = subject;\n\t}\n\n\t@Override\n\tvoid introduce() {\n\t\tSystem.out.println(&quot;Good morning, class. I\'m &quot; + getName() + &quot;, and I teach &quot; + subject + &quot;.&quot;);\n\t}\n\n\t@Override\n\tpublic String toString() {\n\t\treturn &quot;Teacher: &quot; + getName() + &quot; (&quot; + subject + &quot;)&quot;;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Hi, I'm Mang Tony.
Hi, I'm Maria.
  I'm in grade 11.
Good morning, class. I'm Ms. Reyes, and I teach Biology.
Student: Maria, grade 11
Teacher: Ms. Reyes (Biology)
Maria and Ms. Reyes are both people.
```

The guard is a plain `Person`, so he uses the original `introduce()`. Maria's version calls `super.introduce()` first, then adds a line. Ms. Reyes's version replaces the original completely. `getName()` works on both children, because they inherited it from `Person`.
:::

## Try it yourself

1. Add a `Principal` class that extends `Teacher`. Its constructor takes only a name, and passes `"School leadership"` as the subject. Create one and call `introduce()`. Which version runs?
2. In `Teacher`, misspell the method as `introdcue`, keeping `@Override`. Read the compiler error. Then remove `@Override` too, and predict what `reyes.introduce()` prints now.
3. Add an `email` field to `Person`, set through its constructor. How many classes do you have to change, and why?

## Check your understanding

<Quiz
	question="What does class Student extends Person mean?"
	:options="['Student and Person are the same class', 'Person inherits everything from Student', 'Student inherits the fields and methods of Person and can add its own', 'Student can only use the methods it writes itself']"
	:answer-index="2"
	explanation="extends makes Student a child of Person. Every Student has everything a Person has, plus whatever Student adds."
/>

<Quiz
	question="Where must super(name) go in a child class constructor?"
	:options="['On the first line', 'Anywhere in the constructor', 'On the last line', 'Outside the constructor']"
	:answer-index="0"
	explanation="The parent part of the object has to be built before the child adds to it, so super(...) must be the very first statement."
/>

<Quiz
	question="Why should you put @Override above an overriding method?"
	:options="['The compiler then checks that you really are overriding a parent method, catching typos', 'The method will not run without it', 'It makes the method public', 'It makes the method run faster']"
	:answer-index="0"
	explanation="If the name or parameters do not match any parent method, @Override turns a silent bug into a clear compile error."
/>

## Up next

Here's something you haven't tried yet: storing Maria and Ms. Reyes in the same list, as `Person` objects, and calling `introduce()` on each. Which version runs? The answer is one of the most useful ideas in Java: [Polymorphism](/lessons/java/polymorphism).
