---
title: "Java Classes and Objects for Beginners"
description: "Start object-oriented programming in Java: define a class as a blueprint, create objects with new, and give each object fields and methods of its own."
---

# Classes and Objects

*An architect draws one blueprint. A builder uses it to build a whole street of houses, each with its own family and its own paint color.*

At the end of the last chapter, you saw a problem. A student's name lived in one array, their scores in another, and the only thing tying them together was a matching index. Sort one list and forget the other, and every student gets someone else's grades.

What you really want is a single thing called "a student," which carries its own name and its own scores wherever it goes. Java lets you invent that thing. You describe it once, in a **class**, and then create as many **objects** from it as you like.

This idea, building programs out of objects that bundle data and behavior together, is called **object-oriented programming**, or **OOP**. It's the heart of Java, and this whole chapter is about it.

## Blueprints and houses

An architect draws a blueprint for a house. The blueprint says every house will have a front door, a number of bedrooms, and a paint color. But you can't live in a blueprint. It's just a plan.

A builder takes that one blueprint and builds ten houses on a street. Each house is real and separate. One is painted blue with three bedrooms; the one next door is yellow with two. Repainting one house doesn't change the others, and none of it changes the blueprint.

- The **class** is the blueprint. It describes what every object of that kind will have and be able to do.
- An **object** is one house built from it. Each object has its own values.

## Your first class

Here's a class describing a student:

```java
class Student {
	String name;
	int gradeLevel;
	double average;
}
```

That's the whole blueprint, for now. It says every `Student` has three pieces of data: a name, a grade level, and an average. Variables declared inside a class like this, outside any method, are called **fields**. (You might also hear them called attributes or instance variables.)

Notice the class name, `Student`, starts with a capital letter. All class names do: `String`, `Scanner`, `ArrayList`, and now `Student`. It's the same convention you saw in [Primitive Data Types](/lessons/java/data-types): capitalized types are classes.

## Creating objects with `new`

A class is a new type you've invented, so you can declare variables of that type, just like `String` or `int`. To actually build an object, use `new`:

```java
Student maria = new Student();
maria.name = "Maria Santos";
maria.gradeLevel = 11;
maria.average = 91.5;

Student ben = new Student();
ben.name = "Ben Cruz";
ben.gradeLevel = 10;
ben.average = 84.0;

System.out.println(maria.name + " is in grade " + maria.gradeLevel);
System.out.println(ben.name + " is in grade " + ben.gradeLevel);
```

`new Student()` builds one brand-new student object in memory, following the blueprint. The variable `maria` then holds directions to that object, like the array directions you saw in [Arrays](/lessons/java/arrays).

Use a **dot** to reach an object's fields: `maria.name` means "the `name` field of the object `maria` points to." Each object has its own copy of every field, so changing `ben.average` does nothing to `maria.average`. Two separate houses.

You've done this before without knowing it. `new Scanner(System.in)` and `new ArrayList<>()` create objects from classes someone else wrote.

## Where to put the class

For now, write your class in the same file as `Main`, below it, without `public` in front:

```java
public class Main {
	public static void main(String[] args) {
		Student maria = new Student();
		maria.name = "Maria";
		System.out.println(maria.name);
	}
}

class Student {
	String name;
	int gradeLevel;
}
```

A Java file can hold only one `public` class, and it must match the file name, so `Main` gets `public` and `Student` doesn't. In bigger projects, each class goes in its own file, like `Student.java`, and gets `public` too. That's how professional Java code is organized, and your editor makes it easy. For learning, one file keeps everything in view.

## Default field values

What if you create an object and never set a field?

```java
Student newKid = new Student();
System.out.println(newKid.name);         // null
System.out.println(newKid.gradeLevel);   // 0
```

Unlike the local variables inside `main`, fields get automatic starting values, the defaults you first saw in [Primitive Data Types](/lessons/java/data-types): `0` for numbers, `false` for booleans, and **`null`** for objects like `String`.

`null` means "no object here yet." It's an empty signpost that points nowhere. Trying to use it, like `newKid.name.length()`, crashes with a `NullPointerException`, one of the most common errors in all of Java. The next lesson, [Constructors](/lessons/java/constructors), shows how to make sure every object starts with real values, so this can't happen.

## Methods: what an object can do

Fields are what an object **has**. Methods are what it can **do**. Put a method inside the class, and every object gets it:

```java
class Student {
	String name;
	double average;

	void introduce() {
		System.out.println("Hi, I'm " + name + ".");
	}

	boolean isOnHonorRoll() {
		return average >= 90;
	}
}
```

Notice two things.

First, these methods **don't** say `static`. Every method you wrote in the Methods chapter was `static`, belonging to the class as a whole. These belong to **each object**. They're called **instance methods**, because they work on one instance (one object) at a time. You'll see exactly how the two kinds differ in [static and this](/lessons/java/static-and-this).

Second, inside the method, `name` and `average` refer to the fields **of whichever object the method was called on**. Call it on Maria, and it uses Maria's name:

```java
Student maria = new Student();
maria.name = "Maria";
maria.average = 91.5;

Student ben = new Student();
ben.name = "Ben";
ben.average = 84.0;

maria.introduce();                          // Hi, I'm Maria.
ben.introduce();                            // Hi, I'm Ben.
System.out.println(maria.isOnHonorRoll());  // true
System.out.println(ben.isOnHonorRoll());    // false
```

This is the big idea of OOP. You don't write `introduce(maria)`, passing the data to a function. You ask the object to do something with its own data: `maria.introduce()`. The data and the behavior travel together.

It's the same pattern you already use with strings: `name.length()` asks that particular String how long *it* is.

## Objects in a list

Objects become really powerful when you put them in a list. Remember the problem from the start of this lesson? Here's the fix: one list, where each item carries its own data.

```java
ArrayList<Student> students = new ArrayList<>();
```

Now there's nothing to keep in step. Remove a student, and their name and average leave together. Sort the list, and nobody's grades get mixed up.

## Printing an object

What happens if you print an object directly?

```java
System.out.println(maria);   // something like Student@5ca881b5
```

You get the class name and a code, not anything useful. That's the same thing you saw when printing an array. In [Inheritance](/lessons/java/inheritance), you'll learn to change this so printing a student shows their name. For now, print the fields you want.

## Try it

This program defines a `Student` class with fields and two methods, creates three students, stores them in an ArrayList, and prints a small report. Predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="620px"
	:model-value="'import java.util.ArrayList;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tStudent maria = new Student();\n\t\tmaria.name = &quot;Maria&quot;;\n\t\tmaria.average = 91.5;\n\n\t\tStudent ben = new Student();\n\t\tben.name = &quot;Ben&quot;;\n\t\tben.average = 84.0;\n\n\t\tStudent carlo = new Student();\n\t\tcarlo.name = &quot;Carlo&quot;;\n\t\tcarlo.average = 95.25;\n\n\t\tArrayList&lt;Student&gt; students = new ArrayList&lt;&gt;();\n\t\tstudents.add(maria);\n\t\tstudents.add(ben);\n\t\tstudents.add(carlo);\n\n\t\tfor (Student s : students) {\n\t\t\ts.introduce();\n\t\t}\n\n\t\tben.average = 90.0;\n\t\tSystem.out.println(&quot;Ben\'s average was updated.&quot;);\n\n\t\tint honorCount = 0;\n\t\tfor (Student s : students) {\n\t\t\tif (s.isOnHonorRoll()) {\n\t\t\t\thonorCount++;\n\t\t\t\tSystem.out.println(&quot;Honor roll: &quot; + s.name);\n\t\t\t}\n\t\t}\n\t\tSystem.out.println(honorCount + &quot; of &quot; + students.size() + &quot; students made the honor roll.&quot;);\n\t}\n}\n\nclass Student {\n\tString name;\n\tdouble average;\n\n\tvoid introduce() {\n\t\tSystem.out.println(&quot;Hi, I\'m &quot; + name + &quot;, and my average is &quot; + average + &quot;.&quot;);\n\t}\n\n\tboolean isOnHonorRoll() {\n\t\treturn average &gt;= 90;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Hi, I'm Maria, and my average is 91.5.
Hi, I'm Ben, and my average is 84.0.
Hi, I'm Carlo, and my average is 95.25.
Ben's average was updated.
Honor roll: Maria
Honor roll: Ben
Honor roll: Carlo
3 of 3 students made the honor roll.
```

The list holds directions to the same objects that `maria`, `ben`, and `carlo` point to. So when `ben.average` changes to 90.0, the Ben inside the list changes too, and he makes the honor roll.
:::

## Try it yourself

1. Add a `gradeLevel` field to `Student`, set it for each student, and include it in `introduce`.
2. Add a method `String letterGrade()` to `Student` that returns `"A"`, `"B"`, `"C"`, or `"F"` based on the student's own average. Print it for each student in the first loop.
3. Create a fourth student but don't set any fields. Call `introduce()` on them. What prints, and why?

## Check your understanding

<Quiz
	question="What is the difference between a class and an object?"
	:options="['A class is a blueprint; an object is one thing built from it, with its own values', 'They are the same thing', 'An object is a blueprint; a class is built from it', 'A class can only hold numbers']"
	:answer-index="0"
	explanation="The class describes what every object of that kind will have and do. Each object created with new is a separate thing with its own field values."
/>

<Quiz
	question="maria and ben are two Student objects. What happens to maria.average when you change ben.average?"
	:options="['It changes too', 'It is reset to 0', 'The program crashes', 'Nothing, each object has its own copy of every field']"
	:answer-index="3"
	explanation="Every object gets its own set of fields. Changing one student never affects another."
/>

<Quiz
	question="A String field was never set. What is its value?"
	:options="['An empty string', 'null, meaning no object', '0', 'It is a compile error to read it']"
	:answer-index="1"
	explanation="Fields get default values. Object fields like String start as null, which means they point to no object at all yet."
/>

## Up next

Setting every field by hand, one line at a time, is slow, and it's easy to forget one and end up with a `null`. In [Constructors](/lessons/java/constructors), you'll give your class a proper setup routine, so every object is ready to use the moment it's created.
