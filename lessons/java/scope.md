---
title: "Java Variable Scope: Where Your Variables Can Be Used"
description: "Understand scope in Java: why a variable declared inside a block or method can't be used outside it, and how to avoid confusing name clashes."
---

# Variable Scope

*A note taped inside a classroom can be read by anyone in that room. Walk into the hallway, and it's out of sight.*

Sooner or later, every Java learner writes something like this:

```java
for (int i = 0; i < 3; i++) {
	int square = i * i;
}
System.out.println(square);
// error: cannot find symbol
```

`square` was declared just two lines earlier. Why can't Java find it? Because every variable has a **scope**: the part of the program where it exists and can be used. Outside that area, as far as Java is concerned, the variable was never there.

## Rooms in a school

Think of a school building. A notice pinned in the main lobby can be seen by everyone who walks in, from any room. A note taped to the whiteboard in Room 12 can only be read by people in Room 12. And a sticky note on one desk in Room 12 is only visible at that desk.

People inside a room can still see the lobby notice on their way in. But nobody in the lobby can read the sticky note on a desk in Room 12.

In Java, the "rooms" are **blocks**: the areas between a pair of curly braces `{ }`. The rule is:

**A variable exists from the line where it's declared to the closing brace of the block it was declared in.**

Code inside a block can see variables from the blocks around it. Code outside a block can't see into it.

## Block scope

```java
public class Main {
	public static void main(String[] args) {
		int score = 88;                  // visible in all of main

		if (score >= 75) {
			String message = "Passed";   // visible only inside this if
			System.out.println(message + " with " + score);
		}

		// System.out.println(message);  would be an error: message is gone
		System.out.println(score);       // fine
	}
}
```

`score` was declared in `main`'s block, so it's visible everywhere in `main`, including inside the `if`. `message` was declared inside the `if` block, so it disappears at that block's closing brace.

The fix for the loop at the top of this lesson is to declare the variable **before** the block, in the scope where you need it:

```java
int square = 0;
for (int i = 0; i < 3; i++) {
	square = i * i;
}
System.out.println(square);   // 4
```

## Loop variables

A variable declared in a `for` loop's parentheses belongs to the loop. It only exists while the loop runs:

```java
for (int i = 0; i < 3; i++) {
	System.out.println(i);
}
System.out.println(i);
// error: cannot find symbol
```

That's actually convenient: it means the next loop can use `i` again, fresh, without a clash.

Variables declared *inside* a loop's body are even more short-lived. They're created fresh on every iteration. That's why a running total must live outside the loop, as you saw in [Loops: for, while, and do-while](/lessons/java/loops):

```java
for (int i = 1; i <= 3; i++) {
	int total = 0;      // reset to 0 on every lap
	total += i;
	System.out.println(total);
}
// prints 1, 2, 3, not a running total
```

## Method scope

Each method is its own separate building. Variables declared in one method, including its parameters, are **local** to that method. Another method can't see them at all:

```java
public class Main {
	public static void main(String[] args) {
		int bonus = 5;
		addBonus();
	}

	static void addBonus() {
		System.out.println(bonus);
		// error: cannot find symbol
	}
}
```

`bonus` lives in `main`. `addBonus` has no idea it exists. If a method needs a value, pass it in as a parameter, which you learned in [Parameters and Return Values](/lessons/java/parameters). That keeps each method honest about what it depends on.

Because each method has its own space, two methods can use the same variable name without any conflict. A `total` in `main` and a `total` in `average` are completely separate variables that happen to share a name, like two different students named Maria in two different classrooms.

## No shadowing inside a method

Inside one method, Java doesn't let an inner block reuse a name that's already in scope:

```java
int count = 10;
if (count > 5) {
	int count = 3;
}
// error: variable count is already defined in method main(String[])
```

Some languages allow this, and it causes endless confusion about which `count` you mean. Java simply forbids it. Once you declare a name in a method, it's taken until its block ends.

## Class-level variables

What if several methods really do need to share one variable? You can declare a variable at the **class level**, outside every method. Like the notice in the school lobby, it's visible to every method in the class:

```java
public class Main {
	static int visitorCount = 0;

	public static void main(String[] args) {
		welcome("Maria");
		welcome("Ben");
		System.out.println("Visitors: " + visitorCount);   // 2
	}

	static void welcome(String name) {
		visitorCount++;
		System.out.println("Welcome, " + name + "!");
	}
}
```

A class-level variable like this is called a **field**. The `static` means it belongs to the class itself, like the `static` methods you've been writing. You'll learn much more about fields in [Classes and Objects](/lessons/java/classes-and-objects) and [static and this](/lessons/java/static-and-this).

Use class-level variables sparingly. When any method can change a variable, a bug in any method can break it, and tracking down which one did it gets hard. Passing values in as parameters and returning results is usually cleaner. Constants are the big exception: `static final int MAX_SCORE = 100;` at the class level is common and perfectly safe, because nothing can change it.

## Keep scope small

A good habit: **declare each variable in the smallest scope that works, as close as possible to where it's first used.**

- It's easier to read, because the variable is right there when you need it.
- It's safer, because fewer lines of code can accidentally change it.
- It frees up names for reuse elsewhere.

If a variable is only needed inside a loop, declare it inside the loop. If it's only needed in one method, keep it local to that method.

## Try it

This program counts how many students passed. It uses a class-level constant, local variables in two methods, a variable inside a loop, and a parameter with the same name as a variable in `main`. Predict the output, paying attention to which variable each line is really using.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="500px"
	:model-value="'public class Main {\n\tstatic final int PASSING = 75;\n\n\tpublic static void main(String[] args) {\n\t\tint count = 0;\n\t\tString scores = &quot;82,64,91,75&quot;;\n\t\tString[] parts = scores.split(&quot;,&quot;);\n\n\t\tfor (int i = 0; i &lt; parts.length; i++) {\n\t\t\tint score = Integer.parseInt(parts[i]);\n\t\t\tif (isPassing(score)) {\n\t\t\t\tcount++;\n\t\t\t}\n\t\t}\n\n\t\tSystem.out.println(&quot;Passed: &quot; + count);\n\t\tprintSummary(count);\n\t\tSystem.out.println(&quot;Back in main, count is still &quot; + count);\n\t}\n\n\tstatic boolean isPassing(int score) {\n\t\treturn score &gt;= PASSING;\n\t}\n\n\tstatic void printSummary(int count) {\n\t\tcount = count * 100;\n\t\tSystem.out.println(&quot;Inside printSummary, count is &quot; + count);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Passed: 3
Inside printSummary, count is 300
Back in main, count is still 3
```

The `count` parameter in `printSummary` is a separate variable that just shares a name. Multiplying it by 100 has no effect on the `count` in `main`. `PASSING` is visible in `isPassing` because it's declared at the class level.
:::

## Try it yourself

1. After the `for` loop in `main`, try printing `score`. What does the compiler say? Explain why in your own words.
2. Move `int count = 0;` so it's the first line *inside* the `for` loop. The program no longer compiles. Which lines does the compiler complain about, and why? And even if those lines were deleted, why would the count be useless?
3. Change `PASSING` to 80. Which lines of output change?

## Check your understanding

<Quiz
	question="A variable is declared inside an if block. Where can it be used?"
	:options="['Anywhere in the program', 'Anywhere in the same method', 'Only on the line where it was declared', 'Only from its declaration to the end of that if block']"
	:answer-index="3"
	explanation="A variable lives from where it is declared to the closing brace of its block. After the if block ends, the variable is gone."
/>

<Quiz
	question="main has a variable called total, and a method called average also declares a variable called total. What happens?"
	:options="['They are two separate variables that happen to share a name', 'A compile error, names must be unique in a program', 'average changes the total in main', 'Java merges them into one variable']"
	:answer-index="0"
	explanation="Each method has its own scope. Local variables in different methods never clash, even when their names match."
/>

<Quiz
	question="Why must a running total be declared before a loop, not inside it?"
	:options="['Variables cannot be declared inside loops', 'It makes the loop run faster', 'A variable declared inside the loop body is created fresh, reset, on every iteration and disappears after the loop', 'Java requires all variables at the top of main']"
	:answer-index="2"
	explanation="The loop body is its own block. Anything declared there starts over on each iteration and cannot be used after the loop ends."
/>

## Up next

That wraps up the Methods chapter. So far, every variable has held just one value. Next, you'll store a whole list of values under a single name in [Arrays](/lessons/java/arrays).
