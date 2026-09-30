---
title: "How Java Runs: javac, Bytecode, and the JVM Explained"
description: "Learn what happens when you run a Java program: how javac compiles your code into bytecode, and how the Java Virtual Machine runs it on any computer."
---

# How Java Runs: the Compiler and the JVM

*Your code takes two trips before anything prints: one through a translator, and one through a player.*

In [Your First Java Program](/lessons/java/first-program), you wrote a program, ran it, and saw its output. It felt like one step. Behind the scenes, it was two. Understanding those two steps explains a lot: why Java catches some mistakes before your program starts, why other mistakes only show up while it's running, and how one program can run on so many different computers.

## Two steps: compile, then run

Imagine you've written a recipe in English, and you want cooks all over the world to use it. You could hire a separate translator for every country. Or you could translate it once into a set of simple, universal picture instructions, and give every kitchen a helper who knows how to follow those pictures using the local equipment.

Java takes the second approach:

1. **Compile.** A tool called the **compiler**, `javac`, reads your code, checks it for mistakes, and translates it into **bytecode**: the universal picture instructions.
2. **Run.** The **Java Virtual Machine** (**JVM**), the helper in every kitchen, reads the bytecode and carries it out on that particular computer.

That's how "write once, run anywhere" from [What Is Java?](/lessons/java/introduction) actually works. The bytecode is the same everywhere. Only the JVM is different on each kind of computer, and someone else has already written that part for you.

## Step 1: `javac` turns your code into bytecode

Open a terminal in the folder with your `Main.java` file and type:

```text
javac Main.java
```

If your code has no mistakes, nothing seems to happen. No message at all. That silence is good news. Look in the folder, though, and there's a new file: **`Main.class`**.

That `.class` file holds your program's bytecode. You can't read it the way you read `Main.java`, because it's written for the JVM, not for people. You don't need to open it. Just know it's the translated version of your program.

If your code *does* have a mistake, `javac` refuses to create the `.class` file and prints an error instead, with a line number. Those are the errors you met in [Your First Java Program](/lessons/java/first-program), like `';' expected`.

## Step 2: `java` runs the bytecode

Now type:

```text
java Main
```

This starts a JVM, which loads `Main.class`, finds the `main` method, and runs it. Your output appears.

Notice there's no `.class` at the end. You're telling Java the name of the *class* to run, not the name of a file. This is a very common slip:

```text
java Main.class
Error: Could not find or load main class Main.class
```

Leave off the extension: `java Main`.

## The shortcut: `java Main.java`

For a program that fits in a single file, like every program in this chapter, there's a shortcut you already used in [Setting Up](/lessons/java/setting-up):

```text
java Main.java
```

This compiles and runs in one go. The compiled bytecode is kept in memory instead of being saved as a `.class` file. It's perfect for small programs and practice. Later in the track, when your programs grow to several files, you'll go back to `javac` and `java`, or let your editor handle it.

Speaking of which: when you press **Run** in your code editor, it's doing these same two steps for you, just quickly and quietly. There's no magic, only `javac` and `java` behind a button.

## Two kinds of errors

Because Java works in two steps, mistakes show up at two different times.

**Compile-time errors** are caught by `javac`, before your program runs at all. Typos, missing semicolons, a `String` where an `int` should go. Your program never starts, and you get a message pointing at the line. These are the friendly errors: they stop you early.

**Runtime errors** happen while your program is running. The code was valid Java, so it compiled, but something went wrong when a line actually ran. Dividing a number by zero is a classic example. The program crashes at that line with a message called an **exception**, and nothing after that line runs. You'll learn how to handle them in [Exceptions](/lessons/java/exceptions).

Back to the recipe: a compile-time error is a spelling mistake that the translator catches. A runtime error is an instruction that makes perfect sense on paper, like "divide the batter into zero bowls," but falls apart when the cook actually tries it.

## The JVM keeps working while your program runs

Two more things the JVM does for you, just so you know they exist:

- **It speeds your program up as it runs.** The JVM notices which parts of your program run over and over, and translates those parts into the computer's own native instructions so they run faster. This is called **just-in-time compilation**, or **JIT**.
- **It cleans up after you.** When your program stops using a piece of memory, the JVM's **garbage collector** frees it automatically. In some older languages, programmers had to do that by hand, and forgetting was a common source of bugs.

You don't have to do anything to get either of these. They're part of why Java programs are fast and reliable.

## Try it

This program is valid Java, so it compiles without a single error. But something goes wrong when it runs. Predict the output line by line, and decide where the program stops.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="300px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(&quot;Splitting 12 cookies among friends...&quot;);\n\n\t\tint cookies = 12;\n\t\tint friends = 0;\n\n\t\tSystem.out.println(&quot;Each friend gets:&quot;);\n\t\tSystem.out.println(cookies / friends);\n\n\t\tSystem.out.println(&quot;Enjoy your cookies!&quot;);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, run it with `java Main.java`, or compile it with `javac Main.java` and then run `java Main`.
:::

::: details Check your prediction
```text
Splitting 12 cookies among friends...
Each friend gets:
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at Main.main(Main.java:9)
```

The first two lines print normally. Line 9 divides by zero, so the program crashes there with an `ArithmeticException`. The last line, `Enjoy your cookies!`, never runs, because nothing after a crash runs.
:::

## Try it yourself

1. In a folder with this program saved as `Main.java`, run `javac Main.java`. Look for the new `Main.class` file. Then run `java Main`. Compare what you see with the prediction above.
2. Change `int friends = 0;` to `int friends = 3;` and run it again. What does each friend get now, and does the last line print?
3. Remove the semicolon after `int cookies = 12` and run `javac Main.java`. This time you get a compile-time error instead. Is a `Main.class` file created? What's different about when this error appears?

## Check your understanding

<Quiz
	question="What does javac do?"
	:options="['It runs your program', 'It checks your code and translates it into bytecode', 'It installs Java', 'It deletes .class files']"
	:answer-index="1"
	explanation="javac is the compiler. It checks your Java code for mistakes and, if there are none, translates it into bytecode in a .class file."
/>

<Quiz
	question="Your program compiles fine but crashes halfway through when you run it. What kind of error is that?"
	:options="['A compile-time error', 'A comment error', 'A runtime error', 'That can never happen in Java']"
	:answer-index="2"
	explanation="The code was valid Java, so it compiled. It only went wrong while running, which makes it a runtime error. Java reports it as an exception."
/>

<Quiz
	question="After compiling, which command runs the program in Main.class?"
	:options="['java Main', 'java Main.class', 'javac Main', 'run Main.java']"
	:answer-index="0"
	explanation="You give java the name of the class to run, without the .class extension."
/>

## Up next

That's the Getting Started chapter done. You know what Java is, you've set it up, and you know what happens when a program runs. Now it's time to give your programs a memory, in [Variables and Constants](/lessons/java/variables).
