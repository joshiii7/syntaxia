---
title: "Java Method Overloading: Same Name, Different Parameters"
description: "Give several Java methods the same name with different parameter lists, see how Java picks the right one, and learn when overloading makes code clearer."
---

# Method Overloading

*"Open" means something different for a door, a jar, and a book, but you never get confused, because you can see what you're holding.*

You've been using overloaded methods without knowing it. `System.out.println` happily prints a `String`, an `int`, a `double`, a `boolean`, or a `char`. Is that one method that accepts anything? No. It's several methods, all named `println`, each written for a different type.

Giving several methods the same name is called **overloading**. It lets you use one clear name for one idea, even when the inputs vary.

## One word, many meanings

In everyday language, we reuse words all the time. You "open" a door by turning a handle, "open" a jar by twisting the lid, and "open" a book by lifting the cover. Three different actions, one word. Nobody gets mixed up, because the thing in your hands tells you which kind of opening you mean.

Java does the same. When several methods share a name, Java looks at the **arguments** you pass, and picks the method whose parameters match.

## Overloading a method

Here's an `add` method, written three ways:

```java
static int add(int a, int b) {
	return a + b;
}

static int add(int a, int b, int c) {
	return a + b + c;
}

static double add(double a, double b) {
	return a + b;
}
```

```java
System.out.println(add(2, 3));         // 5, uses add(int, int)
System.out.println(add(2, 3, 4));      // 9, uses add(int, int, int)
System.out.println(add(2.5, 1.25));    // 3.75, uses add(double, double)
```

All three are named `add`, and they live happily in the same class. Java tells them apart by their **parameter lists**, which can differ in:

- the **number** of parameters (two versus three), or
- the **types** of the parameters (`int` versus `double`), or
- the **order** of different types (`(String, int)` versus `(int, String)`).

The method's name plus its parameter types is called its **signature**. Every method in a class needs a different signature.

## What doesn't count

Two things are **not** enough to tell methods apart.

**Different parameter names.** Names are just labels inside the method. From the caller's side, these two look identical:

```java
static int area(int width, int height) {
	return width * height;
}

static int area(int w, int h) {
	return w * h;
}
// error: method area(int,int) is already defined in class Main
```

**A different return type.** This one surprises people:

```java
static int half(int n) {
	return n / 2;
}

static double half(int n) {
	return n / 2.0;
}
// error: method half(int) is already defined in class Main
```

Why? Because a caller can write `half(9);` without storing the result anywhere. Java would have no way to know which `half` you meant. The choice has to be made from the arguments alone.

## How Java picks

When you call an overloaded method, Java looks for the best match:

1. First, it looks for an **exact** match for the argument types.
2. If there isn't one, it tries **widening** the arguments, the automatic conversions from [Type Casting and Conversion](/lessons/java/type-casting), like `int` to `double`.

```java
static void show(double value) {
	System.out.println("double: " + value);
}
```

```java
show(7);   // double: 7.0
```

There's no `show(int)`, so Java widens the `7` to `7.0` and uses `show(double)`. Add a `show(int)` method, and the same call would pick that one instead, because an exact match always wins.

Java will never narrow automatically, though. If the only method is `show(int)`, calling `show(7.5)` is an error.

## Default values with overloading

Some languages let you write `greet(name, greeting = "Hello")` so the caller can skip an argument. Java doesn't have that. Overloading fills the gap: write a short version that calls the full version with a sensible default:

```java
static void greet(String name, String greeting) {
	System.out.println(greeting + ", " + name + "!");
}

static void greet(String name) {
	greet(name, "Hello");
}
```

```java
greet("Maria");              // Hello, Maria!
greet("Ben", "Good morning"); // Good morning, Ben!
```

Notice that the short version doesn't copy the printing code. It just calls the full version. That keeps the real work in one place, so a fix only needs to happen once.

You'll use this exact pattern again in [Constructors](/lessons/java/constructors), where overloading is especially common.

## When to overload, and when not to

Overload when the methods do **the same job** with different inputs. `add` for two numbers and `add` for three numbers are the same idea, so sharing a name makes sense.

Don't overload when the jobs are different. Two methods named `process`, where one saves a file and the other prints a report, are just confusing. Give them names that say what they do: `saveReport` and `printReport`.

And be careful with overloads that differ only in similar number types, like `(int, double)` and `(double, int)`. A call like `mix(1, 2)` fits both after widening, so Java can't decide, and reports the call as **ambiguous**. If you find yourself there, pick clearer names.

## Try it

This program prints receipt lines with an overloaded `printLine` method: one version for just a label, one for a label and an amount, and one for a label, a price, and a quantity. Predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="500px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tprintLine(&quot;SCHOOL CAFETERIA&quot;);\n\t\tprintLine(&quot;Adobo&quot;, 65.0, 2);\n\t\tprintLine(&quot;Juice&quot;, 20.0, 3);\n\t\tprintLine(&quot;Rice&quot;, 15);\n\t\tprintLine(&quot;Total&quot;, total(130.0, 60.0, 15.0));\n\t\tprintLine(&quot;Thank you!&quot;);\n\t}\n\n\tstatic void printLine(String label) {\n\t\tSystem.out.println(&quot;== &quot; + label + &quot; ==&quot;);\n\t}\n\n\tstatic void printLine(String label, double amount) {\n\t\tSystem.out.printf(&quot;%-8s %8.2f%n&quot;, label, amount);\n\t}\n\n\tstatic void printLine(String label, double price, int quantity) {\n\t\tprintLine(label + &quot; x&quot; + quantity, price * quantity);\n\t}\n\n\tstatic double total(double a, double b) {\n\t\treturn a + b;\n\t}\n\n\tstatic double total(double a, double b, double c) {\n\t\treturn a + b + c;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
== SCHOOL CAFETERIA ==
Adobo x2   130.00
Juice x3    60.00
Rice        15.00
Total      205.00
== Thank you! ==
```

`printLine("Rice", 15)` has no exact `(String, int)` match, so Java widens `15` to `15.0` and uses the `(String, double)` version. The three-argument version doesn't print anything itself: it builds a label and passes the work to the two-argument version.
:::

## Try it yourself

1. Add a fourth version, `printLine(String label, double price, int quantity, double discount)`, that prints the line total after taking `discount` pesos off.
2. Try adding `static int total(double a, double b)` next to the existing `total(double, double)`. What does the compiler say, and why?
3. Look up the list of `println` versions in your editor: type `System.out.println(` and look at the suggestions that appear. How many overloads does it have?

## Check your understanding

<Quiz
	question="Which pair of methods can live in the same class?"
	:options="['int area(int w, int h) and int area(int a, int b)', 'int half(int n) and double half(int n)', 'void show(int x) and void show(int y)', 'void greet(String name) and void greet(String name, String greeting)']"
	:answer-index="3"
	explanation="Overloads must differ in their parameter types, number, or order. Different parameter names or return types are not enough."
/>

<Quiz
	question="There is only show(double value). What happens with show(7)?"
	:options="['A compile error', 'Java widens 7 to 7.0 and calls show(double)', 'Java narrows 7 and loses data', 'The call is ignored']"
	:answer-index="1"
	explanation="With no exact match, Java tries the automatic widening conversions. int to double is one of them."
/>

<Quiz
	question="Why can two methods not differ only by their return type?"
	:options="['Return types are not allowed on overloaded methods', 'Java picks the method from the arguments alone, and a call does not have to use the result', 'Because of a limit on how many methods a class can have', 'They can, it is allowed']"
	:answer-index="1"
	explanation="A call like half(9); on its own gives Java no clue which return type you want, so the arguments have to decide."
/>

## Up next

You've seen variables declared in `main`, inside methods, inside loops, and as parameters. Where can each one be used, and where does it disappear? That's [Variable Scope](/lessons/java/scope).
