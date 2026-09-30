---
title: "Java Data Types: int, double, boolean, char, and More"
description: "Learn Java's primitive data types, how much each one can hold, when to use int or double, and how char and boolean work, with clear, simple examples."
---

# Primitive Data Types

*Every box comes in a size. Pick one too small, and things spill over in strange ways.*

In [Variables and Constants](/lessons/java/variables), you met five types: `int`, `double`, `boolean`, `char`, and `String`. That's enough for most everyday programs. But you've probably wondered: how big can an `int` get? Why is there a separate type for decimals? And why does `String` get a capital letter when the others don't?

This lesson answers all three. You'll meet Java's full set of **primitive types**, the small, built-in types that everything else is made from.

## Cups, mugs, and buckets

Imagine a kitchen shelf with a shot glass, a coffee mug, a jug, and a bucket. They all hold water, but not the same amount. You wouldn't use a bucket to serve an espresso, and you can't fit a liter of soup into a shot glass.

Java's number types work the same way. Each one reserves a fixed amount of memory, measured in **bits**, and that size decides how big a number it can hold. Bigger containers hold bigger numbers but take more room.

## The eight primitive types

Java has exactly eight primitive types. You'll use four of them almost all the time, and the rest only now and then.

| Type | Holds | Size | Range (roughly) |
|---|---|---|---|
| `byte` | whole numbers | 8 bits | -128 to 127 |
| `short` | whole numbers | 16 bits | -32,768 to 32,767 |
| `int` | whole numbers | 32 bits | about -2.1 billion to 2.1 billion |
| `long` | whole numbers | 64 bits | about -9.2 quintillion to 9.2 quintillion |
| `float` | decimals | 32 bits | about 7 significant digits |
| `double` | decimals | 64 bits | about 15 to 16 significant digits |
| `char` | one character | 16 bits | letters, digits, symbols |
| `boolean` | `true` or `false` | | just the two values |

The four you'll reach for first are **`int`**, **`double`**, **`boolean`**, and **`char`**. Treat the others as specialist tools: you'll recognize them when you see them, and you'll know when you need one.

## Whole numbers: `int` and `long`

Use `int` for counting things: students in a class, points on a quiz, the number of times a loop runs. Its limit, a little over 2.1 billion, is plenty for almost everything.

When a number could get bigger than that, like the world's population or the number of milliseconds since 1970, use `long`. A long number written directly in your code needs an `L` at the end:

```java
int studentsInSchool = 1250;
long worldPopulation = 8_100_000_000L;
```

Two things to notice. The `L` tells Java "treat this as a `long`." Without it, Java assumes a plain whole number is an `int`, sees that 8.1 billion doesn't fit, and refuses:

```java
long worldPopulation = 8100000000;
// error: integer number too large
```

And the underscores in `8_100_000_000L` are just for your eyes. Java ignores them, the way you'd use commas when writing a big number on paper.

`byte` and `short` exist for saving memory when you store millions of small numbers, or for working with raw file data. In everyday code, just use `int`.

## When a box overflows

What happens if you push an `int` past its limit? You might expect an error. You don't get one. Instead, the number **wraps around**, like a car's odometer rolling from 999999 back to 000000:

```java
int biggest = Integer.MAX_VALUE;
System.out.println(biggest);       // 2147483647
System.out.println(biggest + 1);   // -2147483648
```

Add one to the biggest `int`, and you land on the most negative one. Java doesn't warn you, so this is a sneaky kind of bug called **overflow**. The fix is to choose a bigger box, `long`, whenever a value might grow past about two billion.

`Integer.MAX_VALUE` and `Integer.MIN_VALUE` are built-in constants holding the `int` limits. `Long.MAX_VALUE` does the same for `long`.

## Decimals: `double` and `float`

Use `double` for anything with a decimal point: prices, averages, measurements, percentages.

```java
double average = 88.75;
double pi = 3.14159;
```

`float` is the smaller decimal type. It's less precise and needs an `f` at the end (`float price = 4.99f;`). You'll rarely need it, so stick with `double`.

Decimals come with one quirk that surprises everyone. Computers store them in binary, and some simple decimals, like 0.1, can't be stored exactly in binary, the same way 1/3 can't be written exactly as a decimal (0.3333...). So:

```java
System.out.println(0.1 + 0.2);   // 0.30000000000000004
```

That's not a Java bug. JavaScript, Python, and nearly every other language print the same thing. For grades and measurements, the tiny error doesn't matter. For money in real banking software, programmers use a special class called `BigDecimal` instead. You'll see how to round decimals for display in [Working with Strings](/lessons/java/strings).

## Characters: `char`

A `char` holds exactly one character, written in single quotes:

```java
char grade = 'A';
char initial = 'M';
char symbol = '#';
```

Under the hood, every `char` is stored as a number. `'A'` is 65, `'B'` is 66, and so on. That's why you can do something that looks strange at first:

```java
char letter = 'A';
letter++;
System.out.println(letter);   // B
```

`letter++` adds one to the value stored in `letter`, and the character after `A` is `B`. The `++` operator is covered properly in [Operators and Expressions](/lessons/java/operators).

A `char` holds one character, never zero and never two. `''` and `'AB'` are both errors.

## True or false: `boolean`

A `boolean` holds one of exactly two values: `true` or `false`. No quotes, all lowercase.

```java
boolean isEnrolled = true;
boolean hasPaidFees = false;
```

Booleans are the answers to yes-or-no questions, and they're what your program will use to make decisions in [Making Decisions: if and else](/lessons/java/if-else). Unlike some languages, Java won't treat `1` as true or `0` as false. A boolean is a boolean, and nothing else.

## Default values

In Variables and Constants, you saw that a variable inside `main` must be given a value before you use it. That rule stays. But later, when you build your own classes in [Classes and Objects](/lessons/java/classes-and-objects), you'll see that some variables get automatic starting values. Here's what they'll be, so it doesn't surprise you then:

- whole numbers and decimals start at `0` (or `0.0`)
- `boolean` starts at `false`
- `char` starts at an invisible "empty" character

## So what about `String`?

Notice that `String` isn't on the list of eight. That capital S is the clue. `String` is a **class**, a more complex type built out of simpler pieces (a string is really a sequence of `char` values, plus lots of useful tools for working with them).

Java has two families of types:

- **Primitive types**, the eight lowercase ones in this lesson. Each variable holds its value directly in the box.
- **Reference types**, like `String`, which start with a capital letter. The box holds directions to where the real object lives.

You don't need to worry about that difference yet. It starts to matter in [Working with Strings](/lessons/java/strings) and later when you create your own objects. For now, remember the rule of thumb: **lowercase types are primitives, capitalized types are classes.**

## Picking the right type

When you're not sure, ask yourself what the value *is*:

- Something you count? `int`. Could it pass two billion? `long`.
- Something with a decimal point? `double`.
- A yes-or-no answer? `boolean`.
- A single letter or symbol? `char`.
- A word, sentence, or anything longer than one character? `String`.

Some values look like numbers but aren't really numbers. A phone number like `09171234567` or a ZIP code like `02134` should be a `String`. You'll never add two phone numbers together, and storing one as an `int` would lose the leading zero.

## Try it

This program shows the limits of a few types, one overflow, and the decimal quirk. Read it and predict each line before you check.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="360px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tint studentsInSchool = 1250;\n\t\tlong worldPopulation = 8_100_000_000L;\n\t\tdouble average = 88.75;\n\t\tchar grade = \'A\';\n\t\tboolean isEnrolled = true;\n\n\t\tSystem.out.println(&quot;Students: &quot; + studentsInSchool);\n\t\tSystem.out.println(&quot;People on Earth: &quot; + worldPopulation);\n\t\tSystem.out.println(&quot;Average: &quot; + average);\n\t\tSystem.out.println(&quot;Grade: &quot; + grade);\n\t\tSystem.out.println(&quot;Enrolled? &quot; + isEnrolled);\n\n\t\tint biggest = Integer.MAX_VALUE;\n\t\tSystem.out.println(&quot;Biggest int: &quot; + biggest);\n\t\tSystem.out.println(&quot;One more: &quot; + (biggest + 1));\n\n\t\tgrade++;\n\t\tSystem.out.println(&quot;Next grade letter: &quot; + grade);\n\t\tSystem.out.println(&quot;0.1 + 0.2 = &quot; + (0.1 + 0.2));\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Students: 1250
People on Earth: 8100000000
Average: 88.75
Grade: A
Enrolled? true
Biggest int: 2147483647
One more: -2147483648
Next grade letter: B
0.1 + 0.2 = 0.30000000000000004
```

Adding one to the biggest `int` wraps around to the most negative one. `grade++` moves `A` to the next character, `B`. And `0.1 + 0.2` shows the tiny error every language has with some decimals.
:::

## Try it yourself

1. Change `long worldPopulation` to `int worldPopulation`. What error would the compiler give you? (Hint: the `L` is part of the problem too.) Change it back afterward.
2. Add a `double` variable called `height` holding your height in meters, and print it with a label.
3. Add `System.out.println(Long.MAX_VALUE);` at the end. How many digits does the biggest `long` have? Compare it with `Integer.MAX_VALUE`.

## Check your understanding

<Quiz
	question="Which type is the best fit for the number of students in a school?"
	:options="['double', 'boolean', 'char', 'int']"
	:answer-index="3"
	explanation="You count students in whole numbers, and a school will never have more than about two billion of them, so int fits perfectly."
/>

<Quiz
	question="What happens when you add 1 to Integer.MAX_VALUE?"
	:options="['The program crashes with an error', 'Java turns it into a long automatically', 'It wraps around to the most negative int', 'Nothing, the value stays the same']"
	:answer-index="2"
	explanation="This is called overflow. Java does not warn you; the value wraps around like an odometer. Use long when a number might grow that big."
/>

<Quiz
	question="Why should a phone number like 09171234567 be stored as a String?"
	:options="['You never do math with it, and a number would lose the leading zero', 'Strings are faster than numbers', 'Java does not allow numbers that long', 'Phone numbers contain letters']"
	:answer-index="0"
	explanation="A phone number is a label made of digits, not a quantity. Storing it as a number would drop the leading 0, and you would never add or multiply phone numbers anyway."
/>

## Up next

You know what kinds of values Java can hold. Now let's do something with them: math, comparisons, and combining true-or-false answers, in [Operators and Expressions](/lessons/java/operators).
