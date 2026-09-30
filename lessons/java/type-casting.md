---
title: "Java Type Casting: Widening, Narrowing, and Conversion"
description: "Convert between Java types safely: automatic widening, explicit narrowing casts, what gets lost when you cast, and how to turn text into numbers."
---

# Type Casting and Conversion

*Pouring from a small cup into a big jug is easy. Pouring the other way, you'd better be ready to spill.*

In [Operators and Expressions](/lessons/java/operators), you hit a wall: two `int` variables divided by each other always give a whole number, even when you wanted 88.33. You worked around it by typing `3.0` instead of `3`. But what if both numbers are variables? You need a way to say "treat this `int` as a `double`, just for now."

That's **type casting**: changing a value from one type to another. Some conversions Java does for you. Others you have to ask for, and those come with a warning label.

## Pouring between containers

Remember the kitchen shelf from [Primitive Data Types](/lessons/java/data-types): shot glass, mug, jug, bucket. Pouring a mug of water into a bucket is always safe. The bucket is bigger, so nothing spills.

Pouring a bucket into a mug is different. If the bucket only has a little water in it, fine. If it's full, most of it ends up on the floor. You'd only do it on purpose, knowing what you might lose.

Java's type conversions work exactly like this:

- **Widening** means moving a value into a bigger type. It's (almost always) safe, so Java does it automatically.
- **Narrowing** means moving a value into a smaller type. Something might spill, so Java makes you ask for it explicitly.

## Widening: automatic and (almost always) safe

The number types line up from smallest to largest like this:

```text
byte → short → int → long → float → double
```

Moving to the right happens on its own:

```java
int score = 88;
double scoreAsDecimal = score;   // automatic, becomes 88.0
long bigScore = score;           // automatic, still 88
```

Java also widens automatically inside expressions. When an `int` and a `double` meet in the same calculation, the `int` is widened to a `double` first. That's why `total / 3.0` worked in the last lesson: `total` was quietly widened, and Java did decimal division.

There's one small catch. `float` and `double` can hold far *bigger* numbers than `int` and `long`, but they only keep a limited number of digits (about 7 for `float`, and about 16 for `double`). So a very large whole number can lose its last few digits when it's widened to a decimal type:

```java
int big = 123456789;
float asFloat = big;             // automatic, no error
System.out.println((long) asFloat);   // 123456792, not 123456789
```

Java doesn't warn you, because the value is still *roughly* right. For everyday numbers like scores, ages, and prices, this never comes up. Just don't widen a big ID number or bank balance into a `float` and expect every digit to survive.

## Narrowing: you have to ask

Going to the left needs a **cast**. You write the type you want in parentheses, right in front of the value:

```java
double average = 88.75;
int rounded = (int) average;
System.out.println(rounded);   // 88
```

Without the cast, Java refuses, because it can see you might lose something:

```java
double average = 88.75;
int rounded = average;
// error: incompatible types: possible lossy conversion from double to int
```

"Lossy" is the warning label. By writing `(int)`, you're signing it: "Yes, I know. Do it anyway."

## What gets lost

Casting a decimal to a whole number **chops** off everything after the decimal point. It does not round:

```java
System.out.println((int) 9.99);    // 9
System.out.println((int) -9.99);   // -9
```

If you actually want rounding, use `Math.round`. It rounds to the nearest whole number and gives back a `long`, so cast that to `int` if you need one:

```java
double average = 88.75;
int rounded = (int) Math.round(average);
System.out.println(rounded);   // 89
```

Narrowing a number that's too big for the new type is worse. The value doesn't just lose its decimals, it wraps around into something unrelated, like the overflow you saw with `int`:

```java
long huge = 3_000_000_000L;
int squeezed = (int) huge;
System.out.println(squeezed);   // -1294967296
```

That's the bucket spilling everywhere. Only narrow a value when you know it fits.

## Fixing integer division with a cast

Now for the problem this lesson started with. Cast one side of the division to `double`:

```java
int total = 265;
int quizzes = 3;
double average = (double) total / quizzes;
System.out.println(average);   // 88.33333333333333
```

The cast turns `total` into `265.0` first. Now one side is a `double`, so `quizzes` is widened too, and Java does decimal division.

Watch where the parentheses go, though. This version is a common mistake:

```java
double wrong = (double) (total / quizzes);
System.out.println(wrong);   // 88.0
```

Here, `total / quizzes` runs first, as integer division, giving `88`. Only then is `88` cast to `88.0`. The decimal part was already gone. Cast the value, not the answer.

## `char` and `int`

You saw in Primitive Data Types that every character is stored as a number. Casting lets you see those numbers, and go the other way:

```java
char letter = 'A';
int code = letter;              // widening: 65
char next = (char) (code + 1);  // narrowing: 'B'

System.out.println(code);   // 65
System.out.println(next);   // B
```

`char` to `int` is automatic. `int` to `char` needs a cast, because not every `int` is a valid character.

## Text to numbers, and back

Casting only works between number types (plus `char`). You can't cast a `String` into a number:

```java
String typed = "42";
int number = (int) typed;
// error: incompatible types: String cannot be converted to int
```

Text needs a **conversion** method instead. Each number type has one:

```java
int age = Integer.parseInt("17");
double price = Double.parseDouble("4.99");
boolean agreed = Boolean.parseBoolean("true");
```

You'll use these a lot, because text is how data usually arrives: from a user typing, from a file, or from a website. If the text isn't a valid number, like `"seventeen"`, `parseInt` stops the program with a `NumberFormatException`. You'll learn to handle that gracefully in [Exceptions](/lessons/java/exceptions).

Going the other way, from a number to text, is even easier. `String.valueOf` does it, and so does joining with `+`:

```java
int score = 95;
String asText = String.valueOf(score);   // "95"
String label = "Score: " + score;        // "Score: 95"
```

## Try it

A class of 7 students collected 250 bottles for recycling. This program shares them out using widening, narrowing, rounding, and a parse. Predict each line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="400px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tint bottles = 250;\n\t\tint students = 7;\n\n\t\tdouble wrong = bottles / students;\n\t\tdouble right = (double) bottles / students;\n\t\tSystem.out.println(&quot;Wrong share: &quot; + wrong);\n\t\tSystem.out.println(&quot;Right share: &quot; + right);\n\n\t\tint chopped = (int) right;\n\t\tint rounded = (int) Math.round(right);\n\t\tSystem.out.println(&quot;Chopped: &quot; + chopped);\n\t\tSystem.out.println(&quot;Rounded: &quot; + rounded);\n\n\t\tchar firstLetter = \'R\';\n\t\tint code = firstLetter;\n\t\tSystem.out.println(&quot;Code for R: &quot; + code);\n\t\tSystem.out.println(&quot;Letter after R: &quot; + (char) (code + 1));\n\n\t\tString typedGoal = &quot;300&quot;;\n\t\tint goal = Integer.parseInt(typedGoal);\n\t\tSystem.out.println(&quot;Bottles still needed: &quot; + (goal - bottles));\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Wrong share: 35.0
Right share: 35.714285714285715
Chopped: 35
Rounded: 36
Code for R: 82
Letter after R: S
Bottles still needed: 50
```

Casting 35.71 to `int` chops it to 35, while `Math.round` rounds it up to 36. And because `goal` was parsed into a real `int`, subtracting works as math instead of joining text.
:::

## Try it yourself

1. Change `(double) bottles / students` to `(double) (bottles / students)`. What does the "Right share" line print now, and why?
2. Change `typedGoal` to `"three hundred"`. What would happen when the program runs? Change it back.
3. Add a line that prints `(int) 'a'` and another that prints `(char) 98`. Before running, guess what each prints.

## Check your understanding

<Quiz
	question="Which conversion does Java do automatically?"
	:options="['double to int', 'long to int', 'String to int', 'int to double']"
	:answer-index="3"
	explanation="int to double is widening: the new type is bigger, so nothing can be lost. The others need a cast or, for String, a method like Integer.parseInt."
/>

<Quiz
	question="What does (int) 7.9 give you?"
	:options="['7', '8', '7.9', 'An error']"
	:answer-index="0"
	explanation="Casting to int chops off the decimal part without rounding. Use Math.round if you want 8."
/>

<Quiz
	question="How do you turn the String &quot;42&quot; into an int?"
	:options="['(int) &quot;42&quot;', 'int(&quot;42&quot;)', 'Integer.parseInt(&quot;42&quot;)', 'String.toInt(&quot;42&quot;)']"
	:answer-index="2"
	explanation="Casting only works between number types. Text needs a conversion method, and Integer.parseInt is the one for int."
/>

## Up next

So far, every value in your programs was typed straight into the code. In [Reading User Input with Scanner](/lessons/java/user-input), your programs start asking the user for values instead, and `parseInt`'s cousins will come in handy.
