---
title: "Java Variables and Constants: Declare, Assign, and final"
description: "Store values in Java variables: declare them with a type, give them names that make sense, change them later, and lock values in place with final."
---

# Variables and Constants

*A variable is a labeled box with a fixed shape. It only holds the kind of thing it was built for.*

So far, your programs have printed text that was typed straight into the code. That's fine for "Hello, world!", but real programs need to remember things while they run: a student's name, a quiz score, whether someone is logged in. Change the score, and everything that uses it should update too.

That's what variables are for. And Java has one rule about them that most beginner languages skip: every variable has a **type**, decided the moment you create it.

## Labeled boxes with a shape

Picture a storage room full of boxes. Each box has a label on the front, so you can find it again. But these boxes are also different shapes. A box shaped for eggs only holds eggs. A box shaped for books only holds books. You can swap the eggs for other eggs, but you can't stuff a book into the egg box.

A Java variable works the same way:

```java
int quizScore = 88;
```

- `int` is the **type**: the shape of the box. `int` means "a whole number."
- `quizScore` is the **name**: the label on the front.
- `=` puts a value into the box. Read it as "gets," not "equals."
- `88` is the **value** going in.
- The semicolon ends the statement, just like every other line of Java.

Creating a variable is called **declaring** it. Giving it its first value is called **initializing** it. The line above does both at once, which is the most common way you'll write it.

If you've taken the [JavaScript track](/lessons/javascript/variables), notice the difference: a JavaScript variable can hold any kind of value, and it can switch from a number to text halfway through. A Java variable picks its type once, and that type never changes.

## Why Java wants to know the type

Try to put the wrong thing in a box, and Java refuses before your program even starts:

```java
int quizScore = "high";
// error: incompatible types: String cannot be converted to int
```

That message comes from the **compiler**, the tool that checks and translates your code before it runs. You'll see how that works in [How Java Runs](/lessons/java/how-java-runs). The important part for now: Java catches this mistake while you're still writing, not later when a user is clicking around your app. It feels strict at first. After a while, it feels like a friend who proofreads everything.

## Types you'll use right away

There are more types than these, and [Data Types](/lessons/java/data-types) covers them properly. These five will get you through the next few lessons:

| Type | Holds | Example |
|---|---|---|
| `int` | whole numbers | `int age = 17;` |
| `double` | numbers with decimals | `double average = 91.5;` |
| `boolean` | `true` or `false` | `boolean isEnrolled = true;` |
| `char` | a single character, in single quotes | `char section = 'B';` |
| `String` | text, in double quotes | `String name = "Maria";` |

Two details trip people up here. `String` starts with a capital S, while the others are all lowercase. And quotes matter: `'B'` with single quotes is a `char`, while `"B"` with double quotes is a `String`. They aren't the same thing, and Java won't mix them up for you.

## Declaring now, assigning later

You can create a variable without giving it a value yet:

```java
int age;
age = 17;
```

The first line makes the box. The second line puts something in it. Notice the type only appears once, when the box is created.

What you can't do is use the box before anything is in it:

```java
int age;
System.out.println(age);
// error: variable age might not have been initialized
```

Some languages quietly fill an empty variable with a default value. Java doesn't, for variables inside a method like `main`. It stops you instead, because printing a value you never set is almost always a bug.

## Changing a variable

A variable is called a variable because its value can vary:

```java
int quizScore = 88;
quizScore = 95;
quizScore = quizScore + 5;   // now 100
```

The last line looks strange if you read `=` as "equals." Read it as "gets" instead: "quizScore gets quizScore plus 5." Java works out the right side first, using the old value, then stores the answer back in the same box.

Only write the type the first time. Writing it again tries to build a second box with the same label:

```java
int quizScore = 88;
int quizScore = 95;
// error: variable quizScore is already defined in method main(String[])
```

## Constants: `final`

Some values should never change while the program runs: the number of points on a test, a tax rate, the number of days in a week. Mark them with `final`:

```java
final int MAX_POINTS = 100;

MAX_POINTS = 120;
// error: cannot assign a value to final variable MAX_POINTS
```

A `final` variable is a box with the lid glued shut. Java refuses to let anything change it, which protects you from changing it by accident three hundred lines later.

Constants are written in `UPPER_SNAKE_CASE`: all capitals, with underscores between words. That way, anyone reading your code can tell at a glance which values are fixed.

## Naming your variables

Java has a few hard rules for names:

- Use letters, digits, `_`, and `$`, but don't start with a digit. `score2` works; `2score` doesn't.
- No spaces or hyphens. `quiz-score` would be read as "quiz minus score."
- Names can't be Java keywords, like `int`, `class`, `public`, or `final`.
- Names are case-sensitive: `score` and `Score` are two different variables.

And a few habits that every Java programmer follows:

- Use **camelCase** for variables: start lowercase, and capitalize each new word. `studentName`, `quizScore`, `isOnHonorRoll`.
- Say what's inside. `quizScore` beats `qs`, and `qs` beats `x`. You'll read your code far more often than you type it.
- Name booleans like yes-or-no questions: `isEnrolled`, `hasPaid`, `canVote`.

## Printing variables

Put a variable inside `System.out.println` to print its value, and use `+` to join it to text:

```java
String studentName = "Maria";
int quizScore = 88;

System.out.println(studentName + " scored " + quizScore);
// Maria scored 88
```

Watch the spaces. `+` joins things exactly as they are, so the spaces inside `" scored "` are what keep the words apart.

Now a small puzzle. What does this print?

```java
System.out.println("Total: " + 2 + 3);
```

You might expect `Total: 5`. It actually prints `Total: 23`. Java reads left to right: `"Total: " + 2` makes the text `"Total: 2"`, and adding `3` to text just sticks the 3 on the end. To do the math first, wrap it in parentheses:

```java
System.out.println("Total: " + (2 + 3));
// Total: 5
```

## `var`: letting Java work out the type

Since Java 10, you can let Java figure out a variable's type from its starting value:

```java
var quizScore = 88;   // Java decides this is an int
```

The type is still fixed. `quizScore` is an `int` forever, exactly as if you'd written `int` yourself. `var` only works when you give the variable a value on the same line, and only inside methods.

You'll see `var` in newer code. In this track, we write the type out in full, because seeing `int` or `String` on every line helps you learn what each variable holds.

## Try it

This program uses everything from this lesson. Read through it, then predict exactly what it prints, line by line, before you open the answer.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="360px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tfinal int MAX_POINTS = 100;\n\n\t\tString studentName = &quot;Maria&quot;;\n\t\tchar section = \'B\';\n\t\tint quizScore = 88;\n\t\tdouble average = 91.5;\n\t\tboolean isOnHonorRoll = true;\n\n\t\tSystem.out.println(&quot;Student: &quot; + studentName + &quot; (Section &quot; + section + &quot;)&quot;);\n\t\tSystem.out.println(&quot;Quiz score: &quot; + quizScore + &quot; out of &quot; + MAX_POINTS);\n\n\t\tquizScore = quizScore + 7;\n\t\tSystem.out.println(&quot;After the bonus: &quot; + quizScore);\n\n\t\tSystem.out.println(&quot;Average: &quot; + average);\n\t\tSystem.out.println(&quot;On the honor roll? &quot; + isOnHonorRoll);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you've installed Java on your computer (see [Setting Up](/lessons/java/setting-up)), save it as `Main.java` and run it there.
:::

::: details Check your prediction
```text
Student: Maria (Section B)
Quiz score: 88 out of 100
After the bonus: 95
Average: 91.5
On the honor roll? true
```
:::

## Try it yourself

1. Add two variables of your own: a `String` for your name and an `int` for your age. Then add a line that prints a sentence using both, like `Maria is 17 years old.` Check that your spaces land in the right places.
2. After the line that declares `MAX_POINTS`, add `MAX_POINTS = 120;`. What error would the compiler give you, and why? Then take the line out again.
3. At the end of `main`, add `System.out.println("Points left: " + MAX_POINTS - quizScore);`. It won't compile. Explain why, then fix it with parentheses so it prints `Points left: 5`.

## Check your understanding

<Quiz
	question="Which line correctly declares a whole-number variable in Java?"
	:options="['int age = 17;', 'age int = 17;', 'int age == 17;', 'Int age = 17;']"
	:answer-index="0"
	explanation="The type comes first, then the name, then = and the value. Java types like int are lowercase, and == compares values instead of assigning one."
/>

<Quiz
	question="What happens with this code? final int LIMIT = 10; LIMIT = 20;"
	:options="['LIMIT becomes 20', 'The program compiles, then crashes when it runs', 'The compiler refuses to compile it', 'Java skips the second line and LIMIT stays 10']"
	:answer-index="2"
	explanation="A final variable can only be given a value once. Java catches the second assignment when it compiles your code, before anything runs."
/>

<Quiz
	question="What does System.out.println(&quot;Total: &quot; + 2 + 3); print?"
	:options="['Total: 5', 'Total: 23', 'Total: 2 + 3', 'An error']"
	:answer-index="1"
	explanation="Java works left to right. Adding 2 to text makes new text, so the 3 is stuck on the end too. Write (2 + 3) to do the math first."
/>

## Up next

Your boxes can hold whole numbers, decimals, true-or-false values, characters, and text. But how big a number can an `int` hold, and when should you reach for `double` instead? That's [Data Types](/lessons/java/data-types).
