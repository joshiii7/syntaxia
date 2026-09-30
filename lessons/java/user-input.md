---
title: "Java User Input with Scanner: Read Text and Numbers"
description: "Read what the user types with Java's Scanner class: text, whole numbers, and decimals, plus the classic nextInt and nextLine mix-up and how to fix it."
---

# Reading User Input with Scanner

*Until now, your programs talked and never listened. Time to hand the user a microphone.*

Every program so far has printed the same thing every time it ran, because every value was typed right into the code. Real programs ask questions. A quiz asks for your answer. A calculator asks for numbers. A game asks for your name.

In Java, the most common tool for reading what someone types into the terminal is the **`Scanner`**.

## A waiter taking your order

Think of a waiter at a restaurant. They come to your table, ask a question, and then wait, notepad ready, until you answer. They don't walk off halfway through your sentence, and they don't guess.

A `Scanner` is your program's waiter. When you ask it to read something, your program pauses and waits until the user types an answer and presses **Enter**. Then the Scanner hands that answer back to your code.

## Setting up a Scanner

Using a Scanner takes three steps:

```java
import java.util.Scanner;

public class Main {
	public static void main(String[] args) {
		Scanner input = new Scanner(System.in);

		System.out.print("What's your name? ");
		String name = input.nextLine();

		System.out.println("Nice to meet you, " + name + "!");
		input.close();
	}
}
```

1. **`import java.util.Scanner;`** goes at the very top of the file, above the class. `Scanner` lives in a part of Java called `java.util`, and the import tells the compiler where to find it. Forget it, and you'll see `error: cannot find symbol` pointing at `Scanner`.
2. **`new Scanner(System.in)`** creates the Scanner. `System.in` is the keyboard, the partner of `System.out` that you've been printing to. The `new` keyword creates an object; you'll learn all about it in [Classes and Objects](/lessons/java/classes-and-objects).
3. **`input.nextLine()`** reads everything the user types up to the moment they press Enter, and gives it back as a `String`.

Notice the prompt uses `print`, not `println`. That keeps the cursor on the same line as the question, which looks much nicer:

```text
What's your name? Maria
Nice to meet you, Maria!
```

When you're done reading input, call `input.close()`. Create only one Scanner for the keyboard in your program, and use it for every question.

## Reading numbers

`nextLine()` always gives you text. For numbers, Scanner has methods that read and convert in one step:

| Method | Reads | Gives back |
|---|---|---|
| `nextLine()` | the whole line | `String` |
| `next()` | one word (up to a space) | `String` |
| `nextInt()` | a whole number | `int` |
| `nextDouble()` | a decimal number | `double` |
| `nextBoolean()` | `true` or `false` | `boolean` |

```java
Scanner input = new Scanner(System.in);

System.out.print("How old are you? ");
int age = input.nextInt();

System.out.println("Next year you'll be " + (age + 1));
```

Because `age` is a real `int`, `age + 1` does math. If you'd read it with `nextLine()`, it would be the text `"17"`, and `"17" + 1` would give you `171`.

## When the user types something unexpected

What if someone types `seventeen` when your program calls `nextInt()`? The Scanner can't turn that into a number, so the program crashes with an `InputMismatchException`:

```text
How old are you? seventeen
Exception in thread "main" java.util.InputMismatchException
```

Users type unexpected things all the time. For now, write clear prompts that say what kind of answer you want, like `Enter your age (a number):`. In [Exceptions](/lessons/java/exceptions), you'll learn to catch this problem and ask again instead of crashing.

## The `nextInt` and `nextLine` trap

This one catches nearly everyone. Look at this program:

```java
Scanner input = new Scanner(System.in);

System.out.print("How old are you? ");
int age = input.nextInt();

System.out.print("What's your name? ");
String name = input.nextLine();

System.out.println(name + " is " + age);
```

You'd expect to be asked both questions. Instead, this happens:

```text
How old are you? 17
What's your name?  is 17
```

The program never waited for the name. Why?

When you type `17` and press Enter, you're really sending two things: the characters `17` and an invisible **newline** character from the Enter key. `nextInt()` takes the `17` and leaves the newline sitting there. Then `nextLine()` comes along, sees the newline, and thinks, "That's the end of a line. Done!" It hands back an empty string without waiting.

It's like the waiter taking your order but leaving the crumpled edge of the notepad page on the table. The next waiter sees it and assumes you've already ordered.

**The fix:** after reading a number, call `nextLine()` once on its own to clear away the leftover newline:

```java
System.out.print("How old are you? ");
int age = input.nextInt();
input.nextLine();   // clear the leftover Enter

System.out.print("What's your name? ");
String name = input.nextLine();
```

Another fix that many programmers prefer: read **everything** with `nextLine()`, and convert numbers yourself with `Integer.parseInt`, which you learned in [Type Casting and Conversion](/lessons/java/type-casting):

```java
System.out.print("How old are you? ");
int age = Integer.parseInt(input.nextLine());
```

Every read consumes the whole line, Enter included, so nothing is ever left behind. That's the style the Try it program below uses.

## Try it

This program asks three questions and prints a summary. It reads every answer with `nextLine()` and converts the numbers itself, so there's no leftover-newline trap.

Suppose the user types `Maria`, then `11`, then `92.5`. Predict exactly what the terminal will show, including the lines the user typed.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="400px"
	:model-value="'import java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner input = new Scanner(System.in);\n\n\t\tSystem.out.print(&quot;What\'s your name? &quot;);\n\t\tString name = input.nextLine();\n\n\t\tSystem.out.print(&quot;What grade are you in? &quot;);\n\t\tint grade = Integer.parseInt(input.nextLine());\n\n\t\tSystem.out.print(&quot;What was your last test score? &quot;);\n\t\tdouble score = Double.parseDouble(input.nextLine());\n\n\t\tSystem.out.println();\n\t\tSystem.out.println(&quot;Hi, &quot; + name + &quot;!&quot;);\n\t\tSystem.out.println(&quot;Next year you\'ll be in grade &quot; + (grade + 1) + &quot;.&quot;);\n\t\tSystem.out.println(&quot;You need &quot; + (100 - score) + &quot; more points for a perfect score.&quot;);\n\n\t\tinput.close();\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon, and reading keyboard input will need a real terminal anyway. On your own computer, save this program as `Main.java`, run it with `java Main.java`, and type your answers when it asks.
:::

::: details Check your prediction
```text
What's your name? Maria
What grade are you in? 11
What was your last test score? 92.5

Hi, Maria!
Next year you'll be in grade 12.
You need 7.5 more points for a perfect score.
```

The words after each question mark are what the user typed. The empty `println()` prints a blank line before the summary.
:::

## Try it yourself

1. Run the program on your computer and answer with your own details.
2. Add a fourth question: "What's your favorite subject?" Print it as part of the summary.
3. Rewrite the grade question to use `input.nextInt()` instead. Run it and watch what happens to the next question. Then fix it with an extra `input.nextLine()`.

## Check your understanding

<Quiz
	question="What must go at the top of your file before you can use Scanner?"
	:options="['include Scanner;', 'using Scanner;', 'Nothing, Scanner is always available', 'import java.util.Scanner;']"
	:answer-index="3"
	explanation="Scanner lives in the java.util package, so you import it at the top of the file, above the class."
/>

<Quiz
	question="What type does input.nextLine() give back?"
	:options="['int', 'String', 'char', 'It depends on what the user types']"
	:answer-index="1"
	explanation="nextLine always gives back a String, even if the user typed digits. Use nextInt, nextDouble, or a parse method to get a number."
/>

<Quiz
	question="After calling nextInt(), your next nextLine() returns an empty string without waiting. Why?"
	:options="['nextLine is broken in newer versions of Java', 'The user typed too fast', 'nextInt left the newline from the Enter key behind, and nextLine read it', 'You need two Scanner objects']"
	:answer-index="2"
	explanation="nextInt reads only the number. The newline from Enter stays behind, and nextLine reads it as an empty line. Call nextLine once to clear it, or read everything with nextLine."
/>

## Up next

Your programs can now take in text from a user. What can you do with it? Plenty: measure it, search it, cut it up, and compare it. That's [Working with Strings](/lessons/java/strings).
