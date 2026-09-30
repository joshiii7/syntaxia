---
title: "Java Operators: Arithmetic, Comparison, and Logical"
description: "Do math, compare values, and combine conditions in Java with arithmetic, comparison, and logical operators, and learn the integer division trap."
---

# Operators and Expressions

*Values on their own just sit there. Operators are the verbs that make them do something.*

You can store numbers, text, and true-or-false answers in variables. Now it's time to work with them: add up scores, check whether someone passed, decide whether a student gets on the honor roll. The symbols that do this work are called **operators**, and a piece of code that produces a value, like `score + 5`, is called an **expression**.

## The calculator on your desk

Most of Java's math operators are the ones on a calculator. You type a number, press an operator key, type another number, and get an answer. Java does the same, with one important difference you'll meet in a moment: it cares whether you typed whole numbers or decimals.

## Arithmetic operators

| Operator | Meaning | Example | Result |
|---|---|---|---|
| `+` | add | `7 + 2` | `9` |
| `-` | subtract | `7 - 2` | `5` |
| `*` | multiply | `7 * 2` | `14` |
| `/` | divide | `7 / 2` | `3` (not 3.5!) |
| `%` | remainder | `7 % 2` | `1` |

Most of these behave exactly like math class. Two need a closer look.

## The integer division trap

This is the single most common math surprise in Java:

```java
int pizzas = 7;
int friends = 2;
System.out.println(pizzas / friends);   // 3
```

Seven divided by two is 3.5, so why does Java print 3?

When **both** sides of `/` are whole numbers, Java does **integer division**: it divides and throws away everything after the decimal point. It doesn't round. It just chops. `9 / 10` is `0`, and `19 / 10` is `1`.

This bites hardest when you calculate an average:

```java
int total = 265;
int quizzes = 3;
double average = total / quizzes;
System.out.println(average);   // 88.0, not 88.333...
```

Storing the answer in a `double` doesn't help, because the division already happened with whole numbers. The decimal part was gone before the answer reached the box.

The fix is to make at least one side a decimal *before* dividing:

```java
double average = total / 3.0;
System.out.println(average);   // 88.33333333333333
```

When one side is a `double`, Java does decimal division. You'll learn a cleaner way to convert a variable, `(double) total`, in [Type Casting and Conversion](/lessons/java/type-casting).

## The remainder operator: `%`

`%` gives you what's left over after dividing. It's called the **remainder** or **modulo** operator.

```java
System.out.println(17 % 5);   // 2, because 17 = 5 * 3 + 2
System.out.println(10 % 2);   // 0
System.out.println(11 % 2);   // 1
```

It's more useful than it looks:

- **Even or odd?** A number is even when `number % 2` is `0`.
- **Splitting things up.** 17 students in teams of 5 leaves `17 % 5`, which is 2 students without a full team.
- **Converting units.** 135 minutes is `135 / 60` hours (2) and `135 % 60` minutes (15).

## Order of operations

Java follows the same order you learned in math class. Multiplication, division, and remainder happen before addition and subtraction. Operators at the same level run left to right.

```java
int result = 2 + 3 * 4;     // 14, not 20
int other = (2 + 3) * 4;    // 20
```

When in doubt, add parentheses. They cost nothing and make your intent obvious to the next person reading the code, including future you.

## Shortcuts: compound assignment

You'll often update a variable using its own value. Java has shorthand for that:

| Shorthand | Means |
|---|---|
| `score += 5;` | `score = score + 5;` |
| `score -= 5;` | `score = score - 5;` |
| `score *= 2;` | `score = score * 2;` |
| `score /= 2;` | `score = score / 2;` |
| `score %= 2;` | `score = score % 2;` |

And for adding or subtracting exactly one, which happens constantly in loops, there's `++` and `--`:

```java
int count = 0;
count++;   // count is now 1
count++;   // 2
count--;   // 1
```

You might see `++count` in other people's code too. On a line by itself, it does the same thing as `count++`. The difference only shows when you use it inside a bigger expression, and the clearest code avoids doing that. Keep `++` and `--` on lines of their own.

## Comparison operators

Comparison operators ask a question about two values and answer with a `boolean`: `true` or `false`.

| Operator | Asks | Example | Result |
|---|---|---|---|
| `==` | equal to? | `5 == 5` | `true` |
| `!=` | not equal to? | `5 != 3` | `true` |
| `>` | greater than? | `5 > 3` | `true` |
| `<` | less than? | `5 < 3` | `false` |
| `>=` | greater than or equal? | `5 >= 5` | `true` |
| `<=` | less than or equal? | `4 <= 3` | `false` |

You can store the answer in a boolean variable:

```java
int score = 82;
boolean passed = score >= 75;
System.out.println(passed);   // true
```

Watch out for the difference between `=` and `==`. One equals sign **stores** a value. Two equals signs **compare** values. Mixing them up is a classic mistake, and Java usually catches it for you:

```java
int score = 82;
boolean perfect = score = 100;
// error: incompatible types: int cannot be converted to boolean
```

One more warning for later: `==` works for comparing numbers, characters, and booleans. It does **not** reliably compare text. For `String` values, you'll use `.equals()` instead, and [Working with Strings](/lessons/java/strings) explains why.

## Logical operators

Sometimes one question isn't enough. "Is the score at least 90 **and** is attendance good?" Logical operators combine booleans:

| Operator | Name | True when |
|---|---|---|
| `&&` | AND | both sides are true |
| `\|\|` | OR | at least one side is true |
| `!` | NOT | flips true to false, and false to true |

```java
int score = 93;
int absences = 2;

boolean honorRoll = score >= 90 && absences <= 3;   // true
boolean needsHelp = score < 75 || absences > 10;    // false
boolean isFailing = !(score >= 75);                 // false
```

A handy way to remember them: `&&` is strict (everything must be true), `||` is generous (anything true will do), and `!` is contrary (it says the opposite).

Java is also a bit lazy with `&&` and `||`, in a helpful way. If the left side of `&&` is `false`, the whole thing must be false, so Java doesn't even look at the right side. Likewise, if the left side of `||` is `true`, Java stops there. This is called **short-circuiting**, and it will save you from a crash in the Try it section below.

## Picking one of two values: `? :`

Often you need one value when something is true and a different value when it's false: "Pass" or "Fail", "1 student" or "2 students". The **ternary operator** does that in a single expression:

```java
int score = 82;
String result = score >= 75 ? "Pass" : "Fail";
System.out.println(result);   // Pass
```

Read it as a question: "Is `score >= 75`? If yes, use `"Pass"`. Otherwise, use `"Fail"`." The three parts are:

- a **condition** before the `?`, which must be a `boolean`;
- the value to use when it's **true**, between `?` and `:`;
- the value to use when it's **false**, after the `:`.

Both values must fit the same type. Here, both are Strings, so the result can go into a `String` variable. It works inside other expressions too, as long as you wrap it in parentheses:

```java
int count = 1;
System.out.println(count + (count == 1 ? " student" : " students"));   // 1 student
```

The ternary operator is for choosing a *value*. When you need to choose between *actions*, like running several lines or printing different reports, use the `if` and `else` statements in [Making Decisions: if and else](/lessons/java/if-else). And keep ternaries simple: one inside another quickly becomes hard to read.

## Try it

A student has three quiz scores. This program works out the total, the average (both the wrong way and the right way), and whether the student makes the honor roll. Predict every line before you check.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="400px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tint quiz1 = 88;\n\t\tint quiz2 = 94;\n\t\tint quiz3 = 83;\n\t\tint absences = 2;\n\n\t\tint total = quiz1 + quiz2 + quiz3;\n\t\tSystem.out.println(&quot;Total: &quot; + total);\n\n\t\tdouble wrongAverage = total / 3;\n\t\tdouble average = total / 3.0;\n\t\tSystem.out.println(&quot;Wrong average: &quot; + wrongAverage);\n\t\tSystem.out.println(&quot;Right average: &quot; + average);\n\n\t\tSystem.out.println(&quot;Points above 250: &quot; + (total - 250));\n\t\tSystem.out.println(&quot;Is the total even? &quot; + (total % 2 == 0));\n\n\t\tboolean honorRoll = average &gt;= 88 &amp;&amp; absences &lt;= 3;\n\t\tSystem.out.println(&quot;Honor roll? &quot; + honorRoll);\n\n\t\tint teams = 0;\n\t\tboolean canSplit = teams != 0 &amp;&amp; total / teams &gt; 10;\n\t\tSystem.out.println(&quot;Can split points into teams? &quot; + canSplit);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Total: 265
Wrong average: 88.0
Right average: 88.33333333333333
Points above 250: 15
Is the total even? false
Honor roll? true
Can split points into teams? false
```

`total / 3` is integer division, so the decimal part is lost before it reaches the `double`. On the last line, `teams != 0` is `false`, so `&&` stops right there and never tries `total / teams`. Without short-circuiting, that division by zero would crash the program.
:::

## Try it yourself

1. Change `quiz3` so the honor roll line prints `false`. What's the highest score that does it?
2. Add a line that works out how many hours and minutes are in 135 minutes, using `/` and `%`, and prints `2 hours and 15 minutes`.
3. Swap the two sides of the `&&` on the `canSplit` line so it reads `total / teams > 10 && teams != 0`. What would happen now, and why?

## Check your understanding

<Quiz
	question="What does System.out.println(7 / 2); print?"
	:options="['3.5', '4', '1', '3']"
	:answer-index="3"
	explanation="Both sides are whole numbers, so Java does integer division and chops off the decimal part. Use 7 / 2.0 to get 3.5."
/>

<Quiz
	question="What is 17 % 5?"
	:options="['3', '2', '3.4', '12']"
	:answer-index="1"
	explanation="17 divided by 5 is 3 with 2 left over. The % operator gives you that leftover part, the remainder."
/>

<Quiz
	question="When is a &amp;&amp; b true?"
	:options="['When a is true, no matter what b is', 'Only when both a and b are true', 'When at least one of them is true', 'When both are false']"
	:answer-index="1"
	explanation="&amp;&amp; means AND: both sides must be true. || is the one that is happy with just one true side."
/>

## Up next

You saw that `total / 3.0` fixes integer division, but what if both values are `int` variables? You'll need to change a value's type on purpose. That's [Type Casting and Conversion](/lessons/java/type-casting).
