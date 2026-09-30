---
title: "Java switch Statement: Cases, break, and Arrow Syntax"
description: "Match one value against many options with Java's switch statement, learn what break does and what happens without it, and meet the newer arrow form."
---

# The switch Statement

*A vending machine doesn't ask a series of questions. You press B4, and it goes straight to slot B4.*

In [Making Decisions: if and else](/lessons/java/if-else), you built `else if` chains that checked ranges, like `score >= 90`. Chains work for everything, but sometimes they get repetitive. Look at this:

```java
int day = 3;

if (day == 1) {
	System.out.println("Monday");
} else if (day == 2) {
	System.out.println("Tuesday");
} else if (day == 3) {
	System.out.println("Wednesday");
} else {
	System.out.println("Some other day");
}
```

Every line checks the same variable against a different exact value. When your decision looks like that, a **`switch`** says the same thing more cleanly.

## A vending machine

At a vending machine, you don't answer "Is it A1? No. Is it A2? No. Is it A3?" You type a code, and the machine jumps straight to the matching slot. If the code doesn't match any slot, it shows an error message instead.

A `switch` works the same way. It takes one value, jumps to the `case` that matches it, and runs that code. If nothing matches, it runs the `default` code.

## The arrow form

Modern Java (version 14 and newer) has a clean arrow form of `switch`. Here's the day-of-the-week example again:

```java
int day = 3;

switch (day) {
	case 1 -> System.out.println("Monday");
	case 2 -> System.out.println("Tuesday");
	case 3 -> System.out.println("Wednesday");
	case 4 -> System.out.println("Thursday");
	case 5 -> System.out.println("Friday");
	default -> System.out.println("Weekend");
}
```

- `switch (day)` names the value to match.
- Each `case` gives one possible value, then `->`, then what to do.
- `default` handles everything that didn't match. It works like the final `else`.

Only the matching case runs. With `day` set to 3, this prints `Wednesday` and nothing else.

## Several values, one case

Separate values with commas when they should all do the same thing:

```java
int day = 6;

switch (day) {
	case 1, 2, 3, 4, 5 -> System.out.println("School day");
	case 6, 7 -> System.out.println("Weekend");
	default -> System.out.println("That's not a day of the week");
}
```

## More than one line per case

If a case needs several statements, wrap them in curly braces:

```java
char grade = 'B';

switch (grade) {
	case 'A' -> {
		System.out.println("Excellent!");
		System.out.println("You made the honor roll.");
	}
	case 'B', 'C' -> System.out.println("Good work.");
	default -> System.out.println("Let's review together.");
}
```

## What you can switch on

A `switch` can match:

- whole numbers: `int`, `short`, `byte` (and `char`, which is a number underneath)
- `String` values
- **enums**, a special type for a fixed set of choices that you'll meet in later Java study

It **can't** match `double`, `float`, `long`, or `boolean` values. It also can't check ranges like `score >= 90`. Each case is an exact value. For ranges, stick with `if` and `else if`.

Switching on text is handy for menus and commands:

```java
String command = "save";

switch (command) {
	case "save" -> System.out.println("Saving your work...");
	case "open" -> System.out.println("Opening a file...");
	case "quit" -> System.out.println("Goodbye!");
	default -> System.out.println("Unknown command: " + command);
}
```

A `switch` on a `String` compares with `equals` for you, so the `==` problem from [Working with Strings](/lessons/java/strings) doesn't apply here. It is case-sensitive, though: `"Save"` would not match `"save"`.

## A switch that gives back a value

Often you use a switch just to pick a value. The arrow form can hand that value straight back, which makes it a **switch expression**:

```java
int month = 2;

int days = switch (month) {
	case 2 -> 28;
	case 4, 6, 9, 11 -> 30;
	default -> 31;
};

System.out.println("Days in month " + month + ": " + days);   // 28
```

Notice the semicolon after the closing brace: the whole switch is now one big value being stored in `days`, so the statement needs to end.

A switch expression must cover every possible value, so it almost always needs a `default`. Leave it out, and the compiler stops you, because it can't be sure `days` will get a value.

## The older form, and the `break` trap

You'll see a different style of `switch` in older code, textbooks, and exam questions. It uses colons and `break`:

```java
int day = 3;

switch (day) {
	case 1:
		System.out.println("Monday");
		break;
	case 2:
		System.out.println("Tuesday");
		break;
	case 3:
		System.out.println("Wednesday");
		break;
	default:
		System.out.println("Some other day");
}
```

`break` means "jump out of the switch now." And here's the trap: if you forget it, Java doesn't stop at the end of the matching case. It **falls through** and keeps running the next cases' code too, without checking their values:

```java
int day = 2;

switch (day) {
	case 1:
		System.out.println("Monday");
	case 2:
		System.out.println("Tuesday");
	case 3:
		System.out.println("Wednesday");
	default:
		System.out.println("Some other day");
}
```

This prints:

```text
Tuesday
Wednesday
Some other day
```

It's like a vending machine that drops your snack, and then every snack below it. Fall-through is almost never what you want, and forgetting a `break` is one of the most common switch bugs.

The arrow form never falls through. That's the main reason to prefer it in new code. Learn to *read* the colon form, because you'll meet it, but *write* the arrow form.

## Try it

This program runs a tiny cafeteria menu. It uses a switch expression to look up a price and a switch statement to print a message. Predict what it prints.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="440px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString item = &quot;adobo&quot;;\n\t\tint quantity = 2;\n\n\t\tdouble price = switch (item) {\n\t\t\tcase &quot;rice&quot; -&gt; 15.00;\n\t\t\tcase &quot;adobo&quot;, &quot;sinigang&quot; -&gt; 65.00;\n\t\t\tcase &quot;juice&quot; -&gt; 20.00;\n\t\t\tdefault -&gt; 0.0;\n\t\t};\n\n\t\tif (price == 0.0) {\n\t\t\tSystem.out.println(&quot;Sorry, we don\'t sell &quot; + item + &quot;.&quot;);\n\t\t} else {\n\t\t\tSystem.out.println(quantity + &quot; x &quot; + item + &quot; = &quot; + (price * quantity) + &quot; pesos&quot;);\n\t\t}\n\n\t\tint dayOfWeek = 5;\n\t\tswitch (dayOfWeek) {\n\t\t\tcase 1, 2, 3, 4 -&gt; System.out.println(&quot;Regular menu today.&quot;);\n\t\t\tcase 5 -&gt; {\n\t\t\t\tSystem.out.println(&quot;It\'s Friday!&quot;);\n\t\t\t\tSystem.out.println(&quot;Free dessert with every meal.&quot;);\n\t\t\t}\n\t\t\tdefault -&gt; System.out.println(&quot;The cafeteria is closed.&quot;);\n\t\t}\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
2 x adobo = 130.0 pesos
It's Friday!
Free dessert with every meal.
```

`"adobo"` shares a case with `"sinigang"`, so the price is 65.0, and `65.0 * 2` is 130.0. Day 5 matches its own case, which has two lines inside braces.
:::

## Try it yourself

1. Change `item` to `"pizza"`. What prints now, and which part of the code handles it?
2. Add `"halo-halo"` to the menu for 45 pesos.
3. Change `dayOfWeek` to 6 and to 1, and predict the output each time. Then add a case so Saturday (6) prints `Half-day menu.`

## Check your understanding

<Quiz
	question="In the older colon form of switch, what happens if you forget break at the end of a case?"
	:options="['Java falls through and runs the following cases too', 'The compiler reports an error', 'Only the default case runs', 'Nothing, break is optional and changes nothing']"
	:answer-index="0"
	explanation="Without break, Java keeps running the code of the next cases without checking their values. The arrow form never falls through, which is why it is safer."
/>

<Quiz
	question="Which of these can a switch not check?"
	:options="['case 5', 'case &quot;quit&quot;', 'case \'A\'', 'score &gt;= 90']"
	:answer-index="3"
	explanation="Each case matches one exact value. Ranges like score &gt;= 90 need an if and else if chain."
/>

<Quiz
	question="Why does a switch expression like int days = switch (month) { ... }; usually need a default?"
	:options="['Because Java requires every switch to have one', 'Because it must produce a value for every possible input', 'Because default makes it run faster', 'It never needs one']"
	:answer-index="1"
	explanation="The variable must get a value no matter what month holds. default covers every value the cases do not list."
/>

## Up next

So far, every line in your program runs at most once. What if you want to print a line 100 times, or keep asking a question until the answer is right? That's the job of [Loops: for, while, and do-while](/lessons/java/loops).
