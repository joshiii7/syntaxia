---
title: "Java Strings: Methods, Comparison, and Formatting"
description: "Work with text in Java: length, substring, indexOf, and other String methods, why you compare strings with equals and not ==, and how to format output."
---

# Working with Strings

*A string is a row of beads on a thread. Each bead is one character, and each one has a numbered spot.*

You've been using `String` since your very first program. You've printed strings, joined them with `+`, and read them from the keyboard with `Scanner`. But you haven't really *worked* with them yet: counting their letters, pulling out pieces, searching inside them, or checking whether two of them match.

That last one hides the most important rule in this lesson, so stay with it until the end.

## Beads on a thread

Picture a bracelet made of letter beads that spells `JAVA`. The beads sit in a fixed order, and you could number them. Programmers number them starting from **zero**:

```text
 J   A   V   A
 0   1   2   3
```

The number of a bead is its **index**. The first character is at index 0, the second at index 1, and the last one is at index `length - 1`. Counting from zero feels odd at first. You'll get used to it, because arrays and lists work the same way.

## Strings are objects

In [Primitive Data Types](/lessons/java/data-types), you learned that `String` is a class, not a primitive. That's why it has **methods**: built-in actions you call with a dot after the variable name.

```java
String name = "Maria Santos";
System.out.println(name.length());   // 12
```

`name.length()` asks the string, "How many characters do you have?" The space counts as a character too. The parentheses at the end are required; they're how you call a method.

## Methods you'll use constantly

Here are the String methods you'll reach for most, using `String school = "Rizal High School";`:

| Method | What it does | Example | Result |
|---|---|---|---|
| `length()` | number of characters | `school.length()` | `17` |
| `charAt(i)` | character at index `i` | `school.charAt(0)` | `'R'` |
| `toUpperCase()` | all capitals | `school.toUpperCase()` | `"RIZAL HIGH SCHOOL"` |
| `toLowerCase()` | all lowercase | `school.toLowerCase()` | `"rizal high school"` |
| `indexOf(text)` | where `text` first appears | `school.indexOf("High")` | `6` |
| `contains(text)` | is `text` inside? | `school.contains("School")` | `true` |
| `startsWith(text)` | does it begin with `text`? | `school.startsWith("Riz")` | `true` |
| `replace(a, b)` | swap every `a` for `b` | `school.replace("High", "Senior High")` | `"Rizal Senior High School"` |
| `trim()` | remove spaces at both ends | `"  hi  ".trim()` | `"hi"` |
| `isEmpty()` | zero characters? | `"".isEmpty()` | `true` |
| `split(text)` | cut into pieces at each `text` | `school.split(" ")` | `"Rizal"`, `"High"`, `"School"` (a list of Strings) |

If `indexOf` can't find the text, it gives back `-1`. That's how you know something isn't there.

## Cutting out pieces: `substring`

`substring` copies part of a string. Give it a start index, and optionally an end index:

```java
String name = "Maria Santos";
System.out.println(name.substring(6));      // Santos
System.out.println(name.substring(0, 5));   // Maria
```

The start index is **included**, but the end index is **not**. `substring(0, 5)` gives you the characters at indexes 0, 1, 2, 3, and 4. A nice side effect: the end minus the start is the length of the piece you get. `5 - 0` is 5 characters.

Combine it with `indexOf` to split a full name without knowing how long it is:

```java
String fullName = "Maria Santos";
int space = fullName.indexOf(" ");
String first = fullName.substring(0, space);    // Maria
String last = fullName.substring(space + 1);    // Santos
```

Ask for an index that doesn't exist, and Java stops with a `StringIndexOutOfBoundsException`. For a 5-character string, the last valid index is 4, not 5.

## Splitting text into pieces: `split`

When text holds several values with the same separator between them, like `"88,94,72"`, `split` cuts it at every separator and gives you all the pieces at once:

```java
String scores = "88,94,72";
String[] parts = scores.split(",");

System.out.println(parts.length);   // 3
System.out.println(parts[0]);       // 88
System.out.println(parts[2]);       // 72
```

The separators themselves are thrown away. The result is a `String[]`, a numbered list of Strings called an **array**. For now, you only need two things from it: `parts.length` is how many pieces there are, and `parts[0]` is the first piece, counting from 0 just like the characters in a string. [Arrays](/lessons/java/arrays) covers them properly.

Each piece is still text. To do math with `"88"`, convert it with `Integer.parseInt(parts[0])`, from [Type Casting and Conversion](/lessons/java/type-casting).

You'll use `split` a lot: for lists typed on one line, for data saved in files, and for anything else that arrives as one long piece of text.

## Strings never change

Here's a surprise:

```java
String name = "maria";
name.toUpperCase();
System.out.println(name);   // maria
```

Why is it still lowercase? Because **strings in Java can never be changed**. They're **immutable**. `toUpperCase()` doesn't change the original; it builds a brand new string and gives it back. The code above made `"MARIA"` and then threw it away.

To keep the result, store it:

```java
String name = "maria";
name = name.toUpperCase();
System.out.println(name);   // MARIA
```

Every String method works this way: `trim`, `replace`, `substring`, all of them. If a method seems to do nothing, check whether you forgot to save what it gave back.

## Comparing strings: use `equals`, never `==`

This is the rule that matters most. To check whether two strings hold the same text, use **`.equals()`**:

```java
String answer = "yes";
System.out.println(answer.equals("yes"));   // true
```

Why not `==`? Because `==` asks a different question. For objects like strings, `==` checks whether two variables point to **the very same object** in memory, not whether they contain the same letters.

Imagine two students who each bought the same textbook. The books have identical words inside, so they're *equal*. But they're two separate books, not the *same* book. `.equals()` compares the words. `==` asks whether it's literally the same physical book.

Sometimes `==` seems to work, which is what makes it dangerous:

```java
String a = "hello";
String b = "hello";
System.out.println(a == b);   // true (by luck)

Scanner input = new Scanner(System.in);
String typed = input.nextLine();   // the user types: hello
System.out.println(typed == "hello");        // false!
System.out.println(typed.equals("hello"));   // true
```

Java saves memory by reusing identical text that's typed directly into your code, so `a` and `b` happen to point to the same object. Text that arrives while the program runs, from a user or a file, is a new object, and `==` says `false` even though the letters match. The program looks right in testing and then fails for real users. Use `.equals()` every time.

When capital letters shouldn't matter, use `equalsIgnoreCase`:

```java
String typed = "YES";
System.out.println(typed.equalsIgnoreCase("yes"));   // true
```

## Formatting output with `String.format`

Joining with `+` gets messy when you need tidy numbers. What if an average is `88.33333333333333` and you want `88.33`? Use `String.format`, which fills placeholders in a template:

```java
String name = "Maria";
double average = 88.333333;
int rank = 3;

String line = String.format("%s has an average of %.2f and is ranked #%d", name, average, rank);
System.out.println(line);
// Maria has an average of 88.33 and is ranked #3
```

Each `%` placeholder is filled by the next value, in order:

- `%s` for a string (or anything, really)
- `%d` for a whole number
- `%.2f` for a decimal, rounded to 2 places (`%.1f` for 1 place, and so on)
- `%n` for a new line

`System.out.printf` does the same thing and prints the result straight away. It doesn't add a new line on its own, so end the template with `%n`:

```java
System.out.printf("Average: %.1f%n", 88.333333);   // Average: 88.3
```

## Building a string piece by piece

Since strings can't change, adding to one in a loop creates a new string every time. For a handful of joins, that's fine. For hundreds, Java has `StringBuilder`, a string you *can* change:

```java
StringBuilder stars = new StringBuilder();
stars.append("*");
stars.append("*");
stars.append("*");
System.out.println(stars.toString());   // ***
```

You don't need it yet. It comes up again in [static and this](/lessons/java/static-and-this), where chained calls like `builder.append("a").append("b")` finally make sense, and the [final project](/lessons/java/final-project)'s reference solution uses it to build a line of text.

## Try it

This program tidies up a messy name, pulls it apart, checks an answer, and prints a formatted report card line. Predict each line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="440px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString rawName = &quot;   maria santos  &quot;;\n\t\tString name = rawName.trim();\n\t\tSystem.out.println(&quot;Trimmed: [&quot; + name + &quot;]&quot;);\n\t\tSystem.out.println(&quot;Length: &quot; + name.length());\n\n\t\tint space = name.indexOf(&quot; &quot;);\n\t\tString first = name.substring(0, space);\n\t\tString last = name.substring(space + 1);\n\t\tSystem.out.println(&quot;First: &quot; + first);\n\t\tSystem.out.println(&quot;Last: &quot; + last.toUpperCase());\n\t\tSystem.out.println(&quot;Initials: &quot; + first.charAt(0) + last.charAt(0));\n\n\t\tname.toUpperCase();\n\t\tSystem.out.println(&quot;After toUpperCase: &quot; + name);\n\n\t\tString typedAnswer = new String(&quot;Paris&quot;);\n\t\tSystem.out.println(&quot;Using ==: &quot; + (typedAnswer == &quot;Paris&quot;));\n\t\tSystem.out.println(&quot;Using equals: &quot; + typedAnswer.equals(&quot;Paris&quot;));\n\n\t\tdouble average = 91.666666;\n\t\tSystem.out.println(String.format(&quot;%s: %.1f (rank #%d)&quot;, first, average, 2));\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Trimmed: [maria santos]
Length: 12
First: maria
Last: SANTOS
Initials: ms
After toUpperCase: maria santos
Using ==: false
Using equals: true
maria: 91.7 (rank #2)
```

`name.toUpperCase()` on its own line built a new string and threw it away, so `name` is unchanged. `new String("Paris")` forces a separate object, just like text typed by a user, so `==` says `false` while `equals` says `true`.
:::

## Try it yourself

1. Capitalize the first name properly, so it prints `Maria` instead of `maria`. (Hint: `substring(0, 1).toUpperCase()` plus `substring(1)`.)
2. Add a line that prints whether `name` contains the word `"santos"`, and another that checks `"Santos"`. Why are the answers different?
3. Change the format so the average prints with two decimal places, like `91.67`.

## Check your understanding

<Quiz
	question="What does &quot;Java&quot;.charAt(1) give back?"
	:options="['a', 'J', 'v', 'An error']"
	:answer-index="0"
	explanation="Indexes start at 0, so J is at index 0 and the a is at index 1."
/>

<Quiz
	question="What is the right way to check whether the String answer holds the text yes?"
	:options="['answer.equals(&quot;yes&quot;)', 'answer == &quot;yes&quot;', 'answer = &quot;yes&quot;', 'answer.is(&quot;yes&quot;)']"
	:answer-index="0"
	explanation="equals compares the characters. == only checks whether both sides are the very same object, which can be false even when the text matches."
/>

<Quiz
	question="What does &quot;Maria Santos&quot;.substring(0, 5) give back?"
	:options="['Maria ', 'Mari', 'Maria', 'aria ']"
	:answer-index="2"
	explanation="The start index is included and the end index is not, so you get the characters at indexes 0 through 4: Maria."
/>

## Up next

That completes the Values and Operators chapter. Your programs can store values, calculate, and read input. Next, they'll start making choices, in [Making Decisions: if and else](/lessons/java/if-else).
