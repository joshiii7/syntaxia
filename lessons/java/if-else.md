---
title: "Java if, else if, and else Statements for Beginners"
description: "Make your Java programs choose what to do with if, else if, and else, combine conditions with && and ||, and avoid the most common beginner mistakes."
---

# Making Decisions: if and else

*A fork in the road: one sign, one question, and you only walk down one path.*

Every program you've written so far runs straight from top to bottom, every line, every time. That's fine for printing an ID card. But a grading program needs to say "passed" to some students and "try again" to others. A login screen needs to let the right password in and keep the wrong ones out.

To do that, your program has to make **decisions**. In Java, decisions start with `if`.

## A fork in the road

Imagine walking and reaching a fork with a sign: "If it's raining, take the covered path. Otherwise, take the park path." You check the weather, pick one path, and never walk both.

An `if` statement is that sign. It asks a yes-or-no question, and the answer decides which code runs. The question is always a **boolean** expression, the kind you built in [Operators and Expressions](/lessons/java/operators), like `score >= 75` or `isEnrolled && hasPaid`.

## `if`: do this only when...

```java
int score = 82;

if (score >= 75) {
	System.out.println("You passed!");
}

System.out.println("Thanks for taking the quiz.");
```

The parts:

- `if` starts the decision.
- The **condition** goes inside parentheses: `(score >= 75)`.
- The code inside the curly braces runs **only** when the condition is `true`.
- The code after the closing brace runs no matter what.

With a score of 82, both lines print. Change the score to 60, and only the "Thanks" line prints.

## `else`: otherwise...

Add `else` to say what should happen when the condition is `false`:

```java
int score = 60;

if (score >= 75) {
	System.out.println("You passed!");
} else {
	System.out.println("Not this time. Keep practicing!");
}
```

Exactly one of the two blocks runs. Never both, never neither. That's the fork in the road.

## `else if`: more than two paths

Real decisions often have more than two outcomes. Letter grades are a classic example. Chain the choices together with `else if`:

```java
int score = 84;

if (score >= 90) {
	System.out.println("Grade: A");
} else if (score >= 80) {
	System.out.println("Grade: B");
} else if (score >= 70) {
	System.out.println("Grade: C");
} else {
	System.out.println("Grade: F");
}
```

Java checks each condition **from top to bottom** and runs the **first** block whose condition is true. Then it skips the rest of the chain completely.

That's why the order matters. A score of 84 is also `>= 70`, but Java never gets that far: `score >= 80` matched first. Look what happens if you put the checks in the wrong order:

```java
int score = 95;

if (score >= 70) {
	System.out.println("Grade: C");
} else if (score >= 90) {
	System.out.println("Grade: A");
}
// prints Grade: C, even for a 95!
```

When you're checking ranges like this, start with the strictest condition and work down.

The final `else` is optional. It catches everything that didn't match, which makes it a good safety net.

## Combining conditions

You can use the logical operators `&&` (and), `||` (or), and `!` (not) inside any condition:

```java
int score = 93;
int absences = 1;

if (score >= 90 && absences <= 3) {
	System.out.println("Honor roll!");
}

if (absences > 10 || score < 50) {
	System.out.println("Please see your adviser.");
}
```

For ranges, a common beginner slip is to write it the way you would in math:

```java
int age = 15;
if (13 <= age <= 19) {
	System.out.println("Teenager");
}
// error: bad operand types for binary operator '<='
```

Java can't read `13 <= age <= 19` in one go. It works out `13 <= age` first, which gives `true`, and then tries `true <= 19`, which makes no sense. Split it into two comparisons joined with `&&`:

```java
if (age >= 13 && age <= 19) {
	System.out.println("Teenager");
}
```

## Decisions inside decisions

You can put an `if` inside another `if`. This is called **nesting**:

```java
boolean submitted = true;
int score = 68;

if (submitted) {
	if (score >= 75) {
		System.out.println("Passed");
	} else {
		System.out.println("Submitted, but needs a retake");
	}
} else {
	System.out.println("Missing");
}
```

Notice `if (submitted)` instead of `if (submitted == true)`. A boolean variable is already true or false, so it can be the whole condition. And its opposite is `if (!submitted)`.

Nesting is useful, but more than two or three levels gets hard to follow. Often `&&` or an `else if` chain does the same job more clearly.

## Comparing text in a condition

Remember the big rule from [Working with Strings](/lessons/java/strings): compare strings with `.equals()`, never `==`.

```java
String answer = "Manila";

if (answer.equalsIgnoreCase("manila")) {
	System.out.println("Correct!");
} else {
	System.out.println("The answer was Manila.");
}
```

## Mistakes to watch for

**Always use braces.** Java lets you skip the braces when a block has only one line:

```java
if (score >= 75)
	System.out.println("You passed!");
	System.out.println("Great job!");   // runs every time!
```

The indentation makes it *look* like both lines belong to the `if`, but without braces, only the first one does. The second line runs for everyone, even failing students. Always writing the braces makes this bug impossible.

**No semicolon after the condition.**

```java
if (score >= 75); {
	System.out.println("You passed!");   // runs every time!
}
```

That semicolon ends the `if` right there, with an empty action. The block below it is no longer connected to the `if`, so it always runs. Java doesn't complain, which makes this one hard to spot.

**`=` instead of `==`.** Writing `if (score = 100)` is an error in Java, which is a good thing: the compiler catches it for you. Use `==` to compare numbers.

## Try it

This program turns a score into a letter grade, checks for the honor roll, and handles a missing submission. Predict what it prints.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="460px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString name = &quot;Maria&quot;;\n\t\tboolean submitted = true;\n\t\tint score = 87;\n\t\tint absences = 4;\n\n\t\tif (!submitted) {\n\t\t\tSystem.out.println(name + &quot;: missing&quot;);\n\t\t} else {\n\t\t\tString grade;\n\t\t\tif (score &gt;= 90) {\n\t\t\t\tgrade = &quot;A&quot;;\n\t\t\t} else if (score &gt;= 80) {\n\t\t\t\tgrade = &quot;B&quot;;\n\t\t\t} else if (score &gt;= 70) {\n\t\t\t\tgrade = &quot;C&quot;;\n\t\t\t} else {\n\t\t\t\tgrade = &quot;F&quot;;\n\t\t\t}\n\t\t\tSystem.out.println(name + &quot;: &quot; + score + &quot; (&quot; + grade + &quot;)&quot;);\n\n\t\t\tif (score &gt;= 85 &amp;&amp; absences &lt;= 3) {\n\t\t\t\tSystem.out.println(&quot;Honor roll!&quot;);\n\t\t\t} else if (score &gt;= 85) {\n\t\t\t\tSystem.out.println(&quot;Great score, but too many absences for the honor roll.&quot;);\n\t\t\t}\n\t\t}\n\n\t\tSystem.out.println(&quot;Report complete.&quot;);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Maria: 87 (B)
Great score, but too many absences for the honor roll.
Report complete.
```

87 isn't `>= 90`, but it is `>= 80`, so the chain stops at `B`. The honor roll check needs both conditions, and 4 absences fails the second one, so the `else if` runs instead.
:::

## Try it yourself

1. Change `absences` to 2, then `score` to 92. Predict the output each time before checking.
2. Set `submitted` to `false`. Which lines print now?
3. Add a grade `D` for scores from 60 to 69. Where in the chain does it have to go?

## Check your understanding

<Quiz
	question="With score = 85, what does this print? if (score &gt;= 70) { C } else if (score &gt;= 80) { B }"
	:options="['B', 'C', 'Both C and B', 'Nothing']"
	:answer-index="1"
	explanation="Java runs the first block whose condition is true and skips the rest. 85 is at least 70, so it prints C and never checks the second condition. Put stricter checks first."
/>

<Quiz
	question="How do you check that age is between 13 and 19, inclusive?"
	:options="['if (13 &lt;= age &lt;= 19)', 'if (age &gt;= 13 || age &lt;= 19)', 'if (age between 13 and 19)', 'if (age &gt;= 13 &amp;&amp; age &lt;= 19)']"
	:answer-index="3"
	explanation="Java needs two separate comparisons joined with &amp;&amp;. With ||, every age would pass, because every number is either at least 13 or at most 19."
/>

<Quiz
	question="Why is if (score &gt;= 75); { ... } a bug?"
	:options="['Semicolons are not allowed in Java', 'The condition is always false', 'The semicolon ends the if, so the block below always runs', 'It is not a bug']"
	:answer-index="2"
	explanation="The semicolon gives the if an empty action. The block after it is no longer part of the if, so it runs every time."
/>

## Up next

Long `else if` chains that check one variable against a list of exact values can get repetitive. Java has a tidier tool for that job: [The switch Statement](/lessons/java/switch).
