---
title: "Java static and this Keywords Explained for Beginners"
description: "Understand the Java static keyword for fields and methods that belong to a whole class, and the this keyword for referring to the current object."
---

# static and this

*Every student has their own locker. But there's only one bell for the whole school.*

Two small words have followed you through this whole track. You've typed `static` since the very first `public static void main`, and in the Methods chapter every method was `static`. Then, in [Classes and Objects](/lessons/java/classes-and-objects), the methods suddenly weren't. And in [Constructors](/lessons/java/constructors), you started writing `this.name = name`.

This lesson explains both words properly. They're really two sides of one question: does this belong to **one object**, or to **the whole class**?

## Lockers and the school bell

Every student in a school has their own locker. Maria's locker holds Maria's things. Changing what's in Ben's locker does nothing to Maria's. Each locker belongs to one student.

But the school bell isn't like that. There's exactly one bell, for everyone. When it rings, it rings for the whole school. Nobody has "their own" bell.

- Things that belong to **each object**, like lockers, are **instance** members. That's the default.
- Things that belong to **the class as a whole**, like the bell, are **`static`** members.

## Instance fields vs. static fields

Every field you've written in a class so far has been an instance field. Each object gets its own copy:

```java
class Student {
	String name;   // each student has their own name
}
```

Add `static`, and there's only **one copy**, shared by the whole class, no matter how many objects exist:

```java
class Student {
	static int totalStudents = 0;   // one counter for the whole class
	String name;

	Student(String name) {
		this.name = name;
		totalStudents++;
	}
}
```

Every time a student is created, the constructor adds one to the shared counter:

```java
new Student("Maria");
new Student("Ben");
new Student("Carlo");
System.out.println(Student.totalStudents);   // 3
```

Notice how it's used: `Student.totalStudents`, with the **class name**, not an object's name. That's the natural way to reach a static member, because it belongs to the class. (Java will also let you write `maria.totalStudents`, but it's misleading, since it makes a shared value look personal. Always use the class name.)

## Static constants

The most common static fields you'll write are constants. A value that's the same for every object, and never changes, should be `static final`:

```java
class Student {
	static final int MAX_SUBJECTS = 8;
	static final double PASSING_AVERAGE = 75.0;
}
```

There's no reason for every student to carry their own copy of the passing average. One shared, unchangeable copy is exactly right. You've already used constants like this from Java itself: `Integer.MAX_VALUE` and `Math.PI` are static constants.

## Static methods

A **static method** belongs to the class, too. It runs without any particular object, so you call it with the class name:

```java
double root = Math.sqrt(16);           // 4.0
int age = Integer.parseInt("17");       // 17
String text = String.valueOf(95);      // "95"
```

`Math`, `Integer`, and `String` all have static methods. You never write `new Math()`. There's nothing about "a particular Math" that `sqrt` would need.

That's also why every method in the [Methods](/lessons/java/methods) chapter was `static`. There were no objects yet. `main` is static for the same reason: when your program starts, no objects exist, so Java needs a method it can call on the class itself.

## What a static method can't do

Because a static method doesn't run on any particular object, it has no object's fields to look at:

```java
class Student {
	String name;

	static void printName() {
		System.out.println(name);
	}
}
// error: non-static variable name cannot be referenced from a static context
```

Whose name? There might be a hundred students, or none at all. The school bell can't tell you what's in "the" locker, because there's no single locker it belongs to.

You'll see this exact error message a lot when you start mixing static and instance code, especially in `main`. It usually means one of two things:

- The method should really be an **instance** method (remove `static`), and be called on an object.
- Or you forgot to **create an object** first, and call the method on that object.

The reverse is always fine: an instance method can use static fields and call static methods, the same way every student can hear the bell.

## `this`: the current object

Now for the other word. Inside an instance method or constructor, **`this`** means "the object this code is running on right now." When you call `maria.introduce()`, `this` inside `introduce` is Maria. When you call `ben.introduce()`, `this` is Ben.

You've seen its most common use already, telling a field apart from a parameter with the same name:

```java
Student(String name) {
	this.name = name;   // this object's name gets the parameter name
}
```

Without `this`, `name = name` would just copy the parameter into itself, a bug you met in the Constructors lesson.

## Other uses of `this`

**Calling another constructor.** In Constructors, you wrote `this(name, 7)` to hand the work to another constructor of the same class. That's `this` with parentheses, and it has to be the first line.

**Passing the current object somewhere.** Sometimes an object needs to hand itself to another method or object:

```java
class Student {
	String name;

	Student(String name) {
		this.name = name;
	}

	void enrollIn(Classroom room) {
		room.add(this);   // "add me to this classroom"
	}
}
```

**Returning the current object.** A method can `return this;` so that calls can be chained, a style you'll see in `StringBuilder`: `builder.append("a").append("b")`.

Since `this` means "the current object," it only exists inside instance code. In a static method, there's no current object, so there's no `this`:

```java
static void reset() {
	this.name = "";
}
// error: non-static variable this cannot be referenced from a static context
```

## Choosing: static or not?

Ask one question: **does this depend on a particular object's data?**

- It uses an object's own fields, like a student's name or scores? Make it an **instance** method.
- It's a general tool that works only from its parameters, like converting a score to a letter grade, or it's shared by everyone, like a counter or a constant? Make it **static**.

A common beginner habit is to make everything `static`, because `main` is static and it makes the errors go away. That works for small programs, but it throws away everything objects are good for. If a method needs an object's data, give it an object.

## Try it

This program tracks students with a shared static counter and a static constant, uses a static helper method, and shows `this` in several roles. Predict every line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="700px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(&quot;Students so far: &quot; + Student.getCount());\n\n\t\tStudent maria = new Student(&quot;Maria&quot;, 92.0);\n\t\tStudent ben = new Student(&quot;Ben&quot;, 71.5);\n\t\tStudent carlo = new Student(&quot;Carlo&quot;);\n\n\t\tSystem.out.println(&quot;Students so far: &quot; + Student.getCount());\n\n\t\tmaria.printReport();\n\t\tben.printReport();\n\t\tcarlo.printReport();\n\n\t\tSystem.out.println(&quot;A score of 80 earns: &quot; + Student.letterFor(80));\n\t\tSystem.out.println(&quot;Is Maria doing better than Ben? &quot; + maria.isAheadOf(ben));\n\t}\n}\n\nclass Student {\n\tstatic final double PASSING = 75.0;\n\tprivate static int count = 0;\n\n\tprivate String name;\n\tprivate double average;\n\n\tStudent(String name, double average) {\n\t\tthis.name = name;\n\t\tthis.average = average;\n\t\tcount++;\n\t}\n\n\tStudent(String name) {\n\t\tthis(name, 0.0);\n\t}\n\n\tstatic int getCount() {\n\t\treturn count;\n\t}\n\n\tstatic String letterFor(double score) {\n\t\tif (score &gt;= 90) return &quot;A&quot;;\n\t\tif (score &gt;= 80) return &quot;B&quot;;\n\t\tif (score &gt;= PASSING) return &quot;C&quot;;\n\t\treturn &quot;F&quot;;\n\t}\n\n\tboolean isAheadOf(Student other) {\n\t\treturn this.average &gt; other.average;\n\t}\n\n\tvoid printReport() {\n\t\tString status = average &gt;= PASSING ? &quot;passing&quot; : &quot;not passing yet&quot;;\n\t\tSystem.out.println(name + &quot;: &quot; + average + &quot; (&quot; + letterFor(average) + &quot;), &quot; + status + &quot; (class size: &quot; + count + &quot;)&quot;);\n\t}\n}\n'"
/>

A small style note: `if (score >= 90) return "A";` leaves out the braces. That's the one place many Java programmers do it: a very short `if` whose only job is to return. Anywhere else, keep the braces, as [Making Decisions](/lessons/java/if-else) explained.

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Students so far: 0
Students so far: 3
Maria: 92.0 (A), passing (class size: 3)
Ben: 71.5 (F), not passing yet (class size: 3)
Carlo: 0.0 (F), not passing yet (class size: 3)
A score of 80 earns: B
Is Maria doing better than Ben? true
```

There's only one `count`, so every report sees the same total, 3. `Student("Carlo")` passes its work to the other constructor with `this(name, 0.0)`, which is the one that increases the count, so Carlo is counted once, not twice. `isAheadOf` compares `this` object's average (Maria's) with the other one's (Ben's). And `letterFor` is static, so it can be called with just the class name, but instance methods like `printReport` can call it too.
:::

## Try it yourself

1. In `main`, before any students are created, try calling `printReport()` on its own, as `Student.printReport();`. Read the compiler's message and explain it in your own words.
2. Remove `static` from `count` (keep `private int count = 0;`). Predict what `Student.getCount()` does now, then check what the compiler says.
3. Add a static method `static Student topOf(Student a, Student b)` that returns whichever student has the higher average, and print the name of the top student among Maria and Ben.

## Check your understanding

<Quiz
	question="A class has a static field called count. How many copies of count exist when there are 50 objects?"
	:options="['50, one per object', 'One, shared by the whole class', 'None until a static method runs', 'Two']"
	:answer-index="1"
	explanation="A static field belongs to the class itself, so there is exactly one copy, no matter how many objects there are."
/>

<Quiz
	question="Why can a static method not use an instance field like name directly?"
	:options="['Static methods cannot use any variables', 'It does not run on any particular object, so there is no one name to use', 'Instance fields are always private', 'It can, there is no problem']"
	:answer-index="1"
	explanation="A static method belongs to the class. With no current object, Java cannot know whose name you mean."
/>

<Quiz
	question="Inside maria.introduce(), what does this refer to?"
	:options="['The Student class', 'The main method', 'The last object created', 'The maria object']"
	:answer-index="3"
	explanation="this is the object the method was called on. Calling introduce on maria makes this refer to maria."
/>

## Up next

That completes the Object-Oriented Programming chapter. You can now design classes, protect their data, build families of them, and swap them freely through shared types. But real programs also go wrong: bugs, crashes, and files that aren't where you expected. The next chapter starts with the most useful skill of all: [Debugging Java Programs](/lessons/java/debugging).
