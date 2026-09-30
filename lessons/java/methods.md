---
title: "Java Methods: Write Reusable Blocks of Code"
description: "Organize Java programs into methods: declare them, call them, return results, and finally understand what public static void main has been saying all along."
---

# Writing Methods

*A recipe card has a name at the top and steps underneath. Once it's written, "make pancakes" is all anyone needs to say.*

Your programs are getting longer. Everything lives inside `main`, and some chunks show up again and again: printing a divider line, working out an average, formatting a score. When you copy the same lines to three places and then find a mistake in them, you have to fix it three times, and it's easy to miss one.

**Methods** fix this. A method is a named block of code that you write once and run whenever you want, just by using its name.

## Recipe cards

Picture a family recipe box. Each card has a name, like "Grandma's Pancakes," and the steps underneath. When someone says "let's make Grandma's Pancakes," nobody needs to recite the steps. The name is enough, because the steps are written down once, on the card.

A method is a recipe card for your program:

- **Declaring** a method writes the card: its name and its steps.
- **Calling** a method says its name, and Java follows the steps.

You've actually been calling methods since your first program. `System.out.println(...)` is a method someone else wrote. `name.length()` and `Integer.parseInt(...)` are methods too. Now you'll write your own.

## Your first method

```java
public class Main {
	public static void main(String[] args) {
		printDivider();
		System.out.println("Report Card");
		printDivider();
	}

	static void printDivider() {
		System.out.println("====================");
	}
}
```

This prints:

```text
====================
Report Card
====================
```

The method `printDivider` is declared **inside the class but outside `main`**. Methods sit side by side in a class, like cards side by side in the box. You can't write one method inside another.

Here's the declaration, piece by piece:

- `static` means the method belongs to the class itself, so `main` can call it directly. Every method in this chapter is `static`. You'll find out what the alternative is in [static and this](/lessons/java/static-and-this).
- `void` means the method doesn't give back a result. It just does something.
- `printDivider` is the name, followed by parentheses.
- The steps go inside the curly braces.

And the call is just the name, the parentheses, and a semicolon: `printDivider();`.

Now, if you want a longer divider, you change one line and every divider in the program updates.

## What happens during a call

When Java reaches a method call, it pauses where it is, jumps to the method, runs its steps from top to bottom, and then comes back to exactly where it left off:

```java
public class Main {
	public static void main(String[] args) {
		System.out.println("1. Start of main");
		sayHello();
		System.out.println("3. Back in main");
	}

	static void sayHello() {
		System.out.println("2. Inside sayHello");
	}
}
```

```text
1. Start of main
2. Inside sayHello
3. Back in main
```

It's like putting a bookmark in a novel to go look something up in a dictionary. You come back to the bookmark afterward.

## Giving a method information

A method that always does the same thing is useful, but a method you can customize is much more useful. Put a **parameter** inside the parentheses, and the caller can hand the method a value:

```java
static void greet(String name) {
	System.out.println("Hello, " + name + "!");
}
```

```java
greet("Maria");   // Hello, Maria!
greet("Ben");     // Hello, Ben!
```

`name` is like a variable that gets its value from whoever calls the method. [Parameters and Return Values](/lessons/java/parameters) goes much deeper into this, including methods with several parameters.

## Getting a result back

Some methods should work something out and hand the answer back, the way `name.length()` hands back a number. For that, replace `void` with the type of the answer, and use `return`:

```java
static double average(int a, int b, int c) {
	return (a + b + c) / 3.0;
}
```

```java
double result = average(88, 94, 83);
System.out.println(result);   // 88.33333333333333
```

`return` does two things: it hands the value back to the caller, and it ends the method immediately. The call `average(88, 94, 83)` is then replaced by the answer, so you can store it, print it, or use it in a bigger expression.

The type before the name, called the **return type**, is a promise. `double average(...)` promises to give back a `double`. If the method might finish without returning one, the compiler complains:

```java
static double average(int a, int b, int c) {
	double result = (a + b + c) / 3.0;
}
// error: missing return statement
```

## Naming methods

Methods **do** things, so name them with verbs, in camelCase, like variables: `printDivider`, `calculateAverage`, `isPassing`, `getLetterGrade`.

A method that answers a yes-or-no question and returns a `boolean` reads nicely with `is`, `has`, or `can`:

```java
static boolean isPassing(int score) {
	return score >= 75;
}
```

Then `if (isPassing(score))` reads almost like an English sentence.

## `public static void main`, decoded

Now you can finally read the line you've been copying since [Your First Java Program](/lessons/java/first-program):

```java
public static void main(String[] args) {
```

- `main` is a **method**, and Java calls it for you when your program starts.
- `void`: it doesn't return anything.
- `String[] args`: it takes one parameter, called `args`. `String[]` is an array of Strings, the same kind of list `split` gives you in [Working with Strings](/lessons/java/strings). It holds any extra words typed after the program's name when it starts: run `java Main.java hello world`, and `args[0]` is `"hello"` and `args[1]` is `"world"`. Most programs, including every one in this track, simply ignore it.
- `static`: it belongs to the class, so Java can call it without setting anything up first.
- `public`: code outside this class, including Java itself, is allowed to call it.

It's not a magic spell anymore. It's just a method with a very specific name that Java knows to look for.

## Why bother?

Splitting a program into methods has real payoffs:

- **Less repetition.** Write it once, call it everywhere. Fix a bug in one place.
- **Readable code.** `printReportCard(student)` tells you what's happening without making you read 20 lines.
- **Easier testing.** You can check that `average` works on its own before you use it everywhere.

A good method does **one** job, and its name says what that job is. If you struggle to name a method without using "and," it's probably doing two jobs and wants to be split.

## Try it

This program prints a report card using four small methods. Follow each call to its method and back, and predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="520px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tprintHeader(&quot;Maria Santos&quot;);\n\n\t\tdouble avg = average(88, 94, 83);\n\t\tSystem.out.println(&quot;Average: &quot; + avg);\n\t\tSystem.out.println(&quot;Letter grade: &quot; + letterGrade(avg));\n\n\t\tif (isPassing(avg)) {\n\t\t\tSystem.out.println(&quot;Status: Passed&quot;);\n\t\t} else {\n\t\t\tSystem.out.println(&quot;Status: Needs a retake&quot;);\n\t\t}\n\n\t\tprintDivider();\n\t}\n\n\tstatic void printDivider() {\n\t\tSystem.out.println(&quot;------------------------&quot;);\n\t}\n\n\tstatic void printHeader(String studentName) {\n\t\tprintDivider();\n\t\tSystem.out.println(&quot;Report card: &quot; + studentName);\n\t\tprintDivider();\n\t}\n\n\tstatic double average(int a, int b, int c) {\n\t\treturn (a + b + c) / 3.0;\n\t}\n\n\tstatic String letterGrade(double score) {\n\t\tif (score &gt;= 90) {\n\t\t\treturn &quot;A&quot;;\n\t\t} else if (score &gt;= 80) {\n\t\t\treturn &quot;B&quot;;\n\t\t} else if (score &gt;= 70) {\n\t\t\treturn &quot;C&quot;;\n\t\t}\n\t\treturn &quot;F&quot;;\n\t}\n\n\tstatic boolean isPassing(double score) {\n\t\treturn score &gt;= 75;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
------------------------
Report card: Maria Santos
------------------------
Average: 88.33333333333333
Letter grade: B
Status: Passed
------------------------
```

`printHeader` calls `printDivider` itself, twice. Methods can call other methods. `letterGrade` returns as soon as one condition matches, so `return "F"` at the bottom only runs when none of them did.
:::

## Try it yourself

1. Change the divider to use `=` signs instead of `-`. How many lines of code did you need to change to update all four dividers?
2. Write a method `static void printStars(int count)` that prints `count` stars on one line, using a loop. Call it from `main` with 5 and then 10.
3. Write a method `static boolean isHonorRoll(double average)` that returns `true` for averages of 90 or above, and use it in `main` to print an extra line for honor roll students.

## Check your understanding

<Quiz
	question="What does void mean in static void printDivider()?"
	:options="['The method does not give back a value', 'The method is empty', 'The method cannot be called', 'The method returns zero']"
	:answer-index="0"
	explanation="void means the method does its job without handing a result back. Methods that give back a value name its type instead, like int or double."
/>

<Quiz
	question="Where do you declare a new method?"
	:options="['Inside main', 'In a separate file only', 'Inside the class, but outside any other method', 'After the closing brace of the class']"
	:answer-index="2"
	explanation="Methods sit side by side inside a class. You cannot declare one method inside another."
/>

<Quiz
	question="What two things does return do?"
	:options="['Prints a value and ends the program', 'Hands a value back to the caller and ends the method', 'Restarts the method and saves a value', 'Creates a variable and prints it']"
	:answer-index="1"
	explanation="return sends the value back to wherever the method was called, and the method stops right there."
/>

## Up next

You've seen parameters and return values in action. Next, you'll look at them closely: several parameters at once, what happens to a variable you pass in, and how to design a method's inputs and outputs well, in [Parameters and Return Values](/lessons/java/parameters).
