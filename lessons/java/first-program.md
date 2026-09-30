---
title: "Your First Java Program: Hello, World! Explained"
description: "Write, compile, and run your first Java program, and learn what public class, main, and System.out.println mean, line by line, in plain language."
---

# Your First Java Program

*Five lines of setup and one line that does the work. By the end of this lesson, you'll know what every one of them means.*

In [Setting Up](/lessons/java/setting-up), you installed the JDK and a code editor, and you may have already run a small program. Now let's slow down and write one from scratch, so nothing in it feels like a magic spell.

Here's the most famous first program in any language:

```java
public class Main {
	public static void main(String[] args) {
		System.out.println("Hello, world!");
	}
}
```

It prints `Hello, world!` and stops. That's a lot of lines for one message, and you might be wondering why. Let's take it apart.

## Boxes inside boxes

Think of how a letter gets delivered. The letter goes inside an envelope, and the envelope goes inside a mailbag. You can't just toss the letter into the mail truck on its own.

A Java program is packed the same way:

- The **class** is the mailbag. Every piece of Java code lives inside a class.
- The **main method** is the envelope inside it. It holds the steps your program runs.
- The **statement** `System.out.println("Hello, world!");` is the letter itself: the part that actually does something.

Each layer opens with `{` and closes with `}`. Those curly braces always come in pairs, like the two halves of a sandwich. Indenting each layer by one tab makes it easy to see which braces belong together.

## `public class Main`

```java
public class Main {
```

This line starts a **class** named `Main`. You'll learn what classes can really do in [Classes and Objects](/lessons/java/classes-and-objects). For now, treat it as the container every program needs.

There's one rule here that catches everyone at least once: **a public class must be saved in a file with the exact same name.** A class called `Main` goes in a file called `Main.java`, with the same capital M. Save it as `main.java` or `MyProgram.java`, and the compiler stops you:

```text
error: class Main is public, should be declared in a file named Main.java
```

The fix is to rename the file (or the class) so the two match exactly.

## `public static void main(String[] args)`

```java
	public static void main(String[] args) {
```

This is the **main method**, the front door of your program. When you run a Java program, Java looks for a method with exactly this shape and starts running at the first line inside it.

It looks like a mouthful, so here's a quick tour. You'll understand each word properly later in the track:

- `public` means code outside this class can use it. Java itself needs to reach it to start your program.
- `static` means it belongs to the class itself. You'll meet it again in [static and this](/lessons/java/static-and-this).
- `void` means it doesn't send back a result when it finishes.
- `main` is its name. It has to be exactly `main`, all lowercase.
- `String[] args` is a list of extra words you can pass in when you start the program. You won't need it for a while.

For now, copy this line exactly. Every program in this track has it, and after typing it a few times, it'll come out of your fingers automatically.

## `System.out.println`

```java
		System.out.println("Hello, world!");
```

This is the line that does the work. Read it from left to right:

- `System` is a built-in part of Java that connects your program to the computer it's running on.
- `out` is the **standard output**: the terminal, or your editor's output panel.
- `println` means "print a line": print this, then move to the next line.
- `"Hello, world!"` is the text to print. Text in double quotes is called a **String**.
- The semicolon `;` ends the statement, like a period ends a sentence.

There's a close relative, `print`, which prints without moving to a new line afterward:

```java
System.out.print("Name: ");
System.out.println("Maria");
// Name: Maria
```

Both lines end up on the same line of output, because `print` didn't move down.

## Special characters in text

What if you want to print a double quote? Java would think your text had ended. Put a backslash in front of it instead:

```java
System.out.println("She said \"hi\" to me.");
// She said "hi" to me.
```

The backslash tells Java "the next character is part of the text, not the end of it." That pairing is called an **escape sequence**. Another useful one is `\n`, which starts a new line in the middle of your text.

## Comments

Sometimes you want to leave a note in your code for people, not for the computer:

```java
// This is a one-line comment.

/*
	This comment can
	span several lines.
*/
```

Java ignores comments completely. Use them to explain *why* your code does something, not to repeat what it obviously does.

## The four mistakes everyone makes

Java is strict about details, and every beginner hits these. Here's what each one looks like and how to fix it.

**A missing semicolon.**

```java
System.out.println("Hello, world!")
// error: ';' expected
```

Add the semicolon at the end of the statement.

**The file name doesn't match the class name.** You saw this one earlier. Rename the file so it matches the class exactly, capital letters included.

**A lowercase `system`.**

```java
system.out.println("Hello, world!");
// error: package system does not exist
```

Java is case-sensitive. `System` needs a capital S, and `println` needs to be all lowercase.

**A missing closing brace.**

```java
public class Main {
	public static void main(String[] args) {
		System.out.println("Hello, world!");
	}
// error: reached end of file while parsing
```

Every `{` needs a matching `}`. Good indentation makes the missing one easy to spot: here, the class's brace was never closed.

When you get an error, look at the line number the compiler gives you, and check the line just above it too. A missing semicolon or brace often gets reported on the line after the real mistake.

## Try it

This program prints a small student ID card. Predict exactly what it prints, including where each line breaks, before you check.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="280px"
	:model-value="'// My first real Java program: a tiny school ID card.\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(&quot;=== STUDENT ID ===&quot;);\n\t\tSystem.out.print(&quot;Name: &quot;);\n\t\tSystem.out.println(&quot;Maria Santos&quot;);\n\t\tSystem.out.println(&quot;Grade: 11&quot;);\n\t\tSystem.out.println(&quot;Motto: \\&quot;Measure twice, cut once.\\&quot;&quot;);\n\t\tSystem.out.println(&quot;==================&quot;);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
=== STUDENT ID ===
Name: Maria Santos
Grade: 11
Motto: "Measure twice, cut once."
==================
```

`System.out.print("Name: ")` doesn't move to a new line, so `Maria Santos` lands right next to it.
:::

## Try it yourself

1. Change the name and grade to your own, and add a line that prints your favorite subject.
2. Change the `println` on the `Grade` line to `print`. What would happen to the next line of output? Change it back when you're done.
3. Delete the semicolon at the end of any line and try to run the program on your computer. Read the error message: which line number does it point to? Then put the semicolon back.

## Check your understanding

<Quiz
	question="Your class is called Main. What must the file be named?"
	:options="['Main.java', 'main.java', 'Main.class', 'Any name ending in .java']"
	:answer-index="0"
	explanation="A public class must be in a file with exactly the same name, capital letters included, plus .java."
/>

<Quiz
	question="What is the difference between System.out.print and System.out.println?"
	:options="['There is no difference', 'print only works with numbers', 'println moves to a new line after printing, and print does not', 'println prints twice']"
	:answer-index="2"
	explanation="println means print a line: it prints, then moves down. print stays on the same line, so the next output continues right after it."
/>

<Quiz
	question="The compiler says: ';' expected. What is the most likely fix?"
	:options="['Rename the file', 'Add more comments', 'Change println to print', 'Add a semicolon at the end of the statement']"
	:answer-index="3"
	explanation="Every statement in Java ends with a semicolon. Check the line the error points to and the line just above it."
/>

## Up next

You've written and run a Java program. But what actually happened between typing the code and seeing the output? In [How Java Runs](/lessons/java/how-java-runs), you'll follow your program through the compiler and the JVM, step by step.
