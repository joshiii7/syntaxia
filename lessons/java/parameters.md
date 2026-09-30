---
title: "Java Method Parameters and Return Values Explained"
description: "Pass information into Java methods with parameters, send results back with return, and learn how Java copies values when you call a method."
---

# Parameters and Return Values

*A photocopier takes in a sheet of paper and hands back copies. What you feed it, and what comes out, is everything you need to know to use it.*

In [Writing Methods](/lessons/java/methods), you wrote methods that took a value in and methods that handed a value back. This lesson slows down and looks at both ends closely: how to pass several values, what exactly the method receives, and how to design a method whose inputs and outputs make sense.

## A machine with a slot and a tray

Think of a method as a machine on a counter. There's a **slot** on one side where you feed things in, and a **tray** on the other side where the result comes out.

- The **parameters** are the slot. They say what the machine needs, and what type each thing must be.
- The **return value** is the tray. It says what the machine gives back.

You don't need to know how the machine works inside. As long as you know what goes in the slot and what comes out of the tray, you can use it.

## Parameters and arguments

Two words that sound alike, and mean slightly different things:

```java
static int add(int a, int b) {   // a and b are parameters
	return a + b;
}

int sum = add(5, 3);             // 5 and 3 are arguments
```

- **Parameters** are the variables listed in the method's declaration: `int a, int b`. Each one has a type and a name.
- **Arguments** are the actual values you pass in when you call the method: `5` and `3`.

When the method is called, each argument is copied into its matching parameter, in order. `a` gets 5, and `b` gets 3.

People mix these two words up all the time, and nobody will be confused if you do. But knowing the difference helps you read error messages, which use them precisely.

## Several parameters

Separate parameters with commas. Each one needs its own type, even if they're all the same type:

```java
static void printScore(String name, int score, int maxScore) {
	System.out.println(name + ": " + score + " / " + maxScore);
}
```

```java
printScore("Maria", 47, 50);   // Maria: 47 / 50
```

Arguments are matched to parameters **by position**, not by name. `"Maria"` goes into `name` because it's first. Mix up the order, and Java either complains about the types or, worse, quietly uses the wrong values:

```java
printScore("Maria", 50, 47);   // Maria: 50 / 47 (oops)
```

Both numbers are `int`, so Java can't tell they're backwards. With parameters of the same type, double-check the order.

And the number of arguments must match exactly:

```java
printScore("Maria", 47);
// error: method printScore in class Main cannot be applied to given types;
```

## Java passes a copy

Here's something that surprises people. What does this print?

```java
public class Main {
	public static void main(String[] args) {
		int score = 70;
		addBonus(score);
		System.out.println(score);
	}

	static void addBonus(int points) {
		points = points + 10;
	}
}
```

```text
70
```

Not 80. Here's why: when you call `addBonus(score)`, Java doesn't hand over the `score` variable itself. It **copies** the value 70 into the parameter `points`. The method changes its own copy, and the copy disappears when the method ends. The original `score` in `main` is never touched.

This is called **pass by value**, and Java always works this way. It's like giving someone a photocopy of your homework. They can scribble all over the copy, and your original stays clean.

If you want the change to stick, have the method **return** the new value, and store it:

```java
static int addBonus(int points) {
	return points + 10;
}
```

```java
int score = 70;
score = addBonus(score);
System.out.println(score);   // 80
```

(You'll see in [Arrays](/lessons/java/arrays) that passing an array or other *object* works a little differently: the copy is a copy of directions to the object, so a method can change the object those directions lead to. For numbers, booleans, and chars, what you've learned here is the whole story.)

## More about `return`

A method with a return type **must** return a value of that type, on every possible path through the method. The compiler checks this:

```java
static String passOrFail(int score) {
	if (score >= 75) {
		return "Pass";
	}
}
// error: missing return statement
```

What if the score is below 75? The method would reach the end without returning anything, so Java refuses. Add a `return` for the other case.

Because `return` ends the method immediately, you can use it to leave early. This is called an **early return**, and it often makes code simpler than a deep `if-else`:

```java
static String letterGrade(int score) {
	if (score < 0 || score > 100) {
		return "Invalid";
	}
	if (score >= 90) {
		return "A";
	}
	if (score >= 80) {
		return "B";
	}
	return "C or below";
}
```

A `void` method can use `return;` on its own, with no value, to stop early:

```java
static void printIfPassing(String name, int score) {
	if (score < 75) {
		return;
	}
	System.out.println(name + " passed!");
}
```

## Using return values

A method call that returns a value can go anywhere that value could go. You can store it, print it, compare it, or even pass it straight into another method:

```java
double avg = average(88, 94, 83);
System.out.println(average(88, 94, 83));
if (average(88, 94, 83) >= 75) { ... }
System.out.println(letterGrade((int) average(88, 94, 83)));
```

One mistake to watch for: calling a method that returns a value and then ignoring it. `average(88, 94, 83);` on a line by itself compiles fine, but the answer is thrown away, exactly like `name.toUpperCase();` in [Working with Strings](/lessons/java/strings).

## Designing good methods

A well-designed method is easy to use correctly. A few habits help:

- **Take in what you need, nothing more.** A method that calculates an average needs the scores, not the student's name.
- **Return results instead of printing them,** when the caller might want to do something else with the answer. A method that *returns* an average can be printed, stored, or compared. A method that only *prints* it can't be used any other way.
- **Keep the parameter list short.** Three or four parameters is plenty. If you need seven, it's a sign that some of them belong together in an object, which you'll learn to build in [Classes and Objects](/lessons/java/classes-and-objects).
- **Give parameters clear names.** `calculateTotal(double price, int quantity)` explains itself. `calculateTotal(double p, int q)` doesn't.

## Try it

This program runs a small cafeteria checkout. Watch which methods return values, which ones just print, and what happens to `budget` when it's passed to a method. Predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="520px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tdouble budget = 200.0;\n\n\t\tdouble lunch = lineTotal(65.0, 2);\n\t\tdouble drinks = lineTotal(20.0, 3);\n\t\tdouble total = lunch + drinks;\n\n\t\tprintLine(&quot;Adobo x2&quot;, lunch);\n\t\tprintLine(&quot;Juice x3&quot;, drinks);\n\t\tprintLine(&quot;Total&quot;, total);\n\n\t\tspend(budget, total);\n\t\tSystem.out.println(&quot;Budget after spend(): &quot; + budget);\n\n\t\tbudget = remaining(budget, total);\n\t\tSystem.out.println(&quot;Budget after remaining(): &quot; + budget);\n\n\t\tSystem.out.println(canAfford(budget, 65.0) ? &quot;You can buy one more adobo.&quot; : &quot;No more adobo today.&quot;);\n\t}\n\n\tstatic double lineTotal(double price, int quantity) {\n\t\treturn price * quantity;\n\t}\n\n\tstatic void printLine(String label, double amount) {\n\t\tSystem.out.printf(&quot;%-10s %7.2f%n&quot;, label, amount);\n\t}\n\n\tstatic void spend(double money, double cost) {\n\t\tmoney = money - cost;\n\t}\n\n\tstatic double remaining(double money, double cost) {\n\t\treturn money - cost;\n\t}\n\n\tstatic boolean canAfford(double money, double price) {\n\t\treturn money &gt;= price;\n\t}\n}\n'"
/>

`%-10s` pads the label to 10 characters, lined up on the left, and `%7.2f` prints the amount 7 characters wide with 2 decimal places. The line with `?` and `:` is the ternary operator from [Operators and Expressions](/lessons/java/operators): it picks one of the two messages.

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Adobo x2    130.00
Juice x3     60.00
Total       190.00
Budget after spend(): 200.0
Budget after remaining(): 10.0
No more adobo today.
```

`spend` only changed its own copy of the budget, so `budget` in `main` was still 200.0 afterward. `remaining` returned the new value, and `main` stored it, so that change stuck.
:::

## Try it yourself

1. Add a third item, rice at 15 pesos, quantity 2, and include it in the total. Does the last line change?
2. Delete the `spend` method and the lines that call and print it. Why was it useless?
3. Write a method `static double applyDiscount(double amount, double percent)` that returns the amount after a discount. Use it to take 10 percent off the total before it's subtracted from the budget.

## Check your understanding

<Quiz
	question="In static int add(int a, int b), and the call add(5, 3), which are the arguments?"
	:options="['a and b', 'int and int', 'add', '5 and 3']"
	:answer-index="3"
	explanation="Parameters are the variables in the declaration (a and b). Arguments are the actual values passed in the call (5 and 3)."
/>

<Quiz
	question="int x = 10; then a method call doubleIt(x); where doubleIt sets its parameter to itself times 2. What is x afterward?"
	:options="['20', '0', '10', 'An error']"
	:answer-index="2"
	explanation="Java passes a copy of the value. The method doubled its own copy, and the original x is unchanged. To keep the result, return it and store it: x = doubleIt(x);"
/>

<Quiz
	question="Why does this fail to compile? static String check(int n) { if (n &gt; 0) { return &quot;positive&quot;; } }"
	:options="['When n is not above 0, the method reaches the end without returning a String', 'Strings cannot be returned', 'The if needs an else if', 'n must be a double']"
	:answer-index="0"
	explanation="A method with a return type must return a value on every path. Add a return for the case where the condition is false."
/>

## Up next

What if you want `add` to work with two numbers, and also with three? Or with decimals as well as whole numbers? Java lets several methods share one name, as long as their parameters differ. That's [Method Overloading](/lessons/java/overloading).
