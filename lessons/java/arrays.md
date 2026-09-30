---
title: "Java Arrays: Store and Loop Through Lists of Values"
description: "Store many values in one Java array, read and change items by index, loop through them with for and for-each, and avoid ArrayIndexOutOfBoundsException."
---

# Arrays

*An egg carton has a fixed number of numbered slots, and every slot holds the same kind of thing.*

Imagine keeping track of quiz scores for a class of 30 students. With what you know so far, you'd need 30 variables: `score1`, `score2`, `score3`, all the way to `score30`. Adding them up would mean typing all 30 names. And if a new student joined, you'd have to change your code.

An **array** solves this. It stores many values of the same type under one name, and lets you reach each one by its position number.

## An egg carton

An egg carton has a fixed number of slots, say 12. Each slot holds one egg, and only eggs. You can point to any slot by its position: "the third one from the left." You can swap one egg for another. But you can't add a 13th slot to the carton. If you need more room, you need a bigger carton.

A Java array is exactly that:

- It holds a **fixed number** of values, set when you create it.
- Every value has the **same type**.
- Each slot has a number, its **index**, starting from **0**.

## Creating an array

If you already know the values, list them in curly braces:

```java
int[] scores = {88, 94, 72, 65, 91};
String[] names = {"Maria", "Ben", "Carlo"};
```

The square brackets after the type, `int[]`, mean "an array of `int` values." Read `int[] scores` as "scores is an array of ints."

If you know how many slots you need but not the values yet, use `new` with the size:

```java
double[] temperatures = new double[7];   // 7 slots, one per day
```

The array starts with every slot filled with a default value: `0` for numbers, `0.0` for decimals, `false` for booleans, and `null` (meaning "nothing yet") for Strings and other objects. You fill it in later.

## Reading and changing items

Use the array's name with an index in square brackets:

```java
int[] scores = {88, 94, 72, 65, 91};

System.out.println(scores[0]);   // 88, the first item
System.out.println(scores[2]);   // 72, the third item

scores[3] = 70;                  // change the fourth item from 65 to 70
System.out.println(scores[3]);   // 70
```

Just like the characters in a String from [Working with Strings](/lessons/java/strings), the first item is at index 0. So in an array of 5 items, the indexes go from 0 to 4.

```text
index:   0    1    2    3    4
value:  88   94   72   70   91
```

## The array's length

Every array knows how many slots it has. Ask it with `.length`:

```java
int[] scores = {88, 94, 72, 65, 91};
System.out.println(scores.length);   // 5
```

Notice: **no parentheses**. For a String, it's `name.length()`, a method. For an array, it's `scores.length`, a property. Mixing them up is a very common compile error, and now you'll recognize it.

The last item is always at `scores.length - 1`.

## Going out of bounds

What happens if you ask for a slot that doesn't exist?

```java
int[] scores = {88, 94, 72, 65, 91};
System.out.println(scores[5]);
```

```text
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5
```

The program crashes. The compiler can't catch this one, because the index is often a variable whose value is only known while the program runs. The message is clear, though: you asked for index 5, and the array only has indexes 0 to 4.

This is the off-by-one bug from [Loops](/lessons/java/loops) in its most famous form. Nearly every Java programmer has seen this exception more times than they can count.

## Looping through an array

Arrays and `for` loops are made for each other. The loop counter becomes the index:

```java
int[] scores = {88, 94, 72, 65, 91};

for (int i = 0; i < scores.length; i++) {
	System.out.println("Student " + (i + 1) + ": " + scores[i]);
}
```

Look at the condition: `i < scores.length`, with `<`. That runs `i` from 0 to 4, exactly the valid indexes. Writing `<=` would try index 5 and crash.

Using `scores.length` instead of the number 5 also means the loop still works if you add more scores to the array later.

## The for-each loop

When you just want to visit every item in order, and you don't need the index, Java has a shorter loop called **for-each**:

```java
int[] scores = {88, 94, 72, 65, 91};
int total = 0;

for (int score : scores) {
	total += score;
}

System.out.println("Total: " + total);   // 410
```

Read the colon as "in": "for each `int score` in `scores`." On each iteration, `score` holds the next item. There's no index to manage, so there's no way to go out of bounds.

For-each has limits, though. You can't use it to change the items in the array (changing `score` only changes the loop's copy), and you don't know which position you're at. When you need either of those, use a regular `for` loop.

## Common array jobs

Most array code does one of a few jobs. Here they are, so you'll recognize them:

**Sum and average:**

```java
int[] scores = {88, 94, 72, 65, 91};
int total = 0;
for (int score : scores) {
	total += score;
}
double average = (double) total / scores.length;
System.out.println(average);   // 82.0
```

**Find the highest value:** start with the first item, and replace it whenever you find something bigger.

```java
int[] scores = {88, 94, 72, 65, 91};
int highest = scores[0];
for (int score : scores) {
	if (score > highest) {
		highest = score;
	}
}
System.out.println(highest);   // 94
```

**Search for a value:** loop until you find it, using `break` from [break and continue](/lessons/java/break-and-continue).

```java
String[] names = {"Maria", "Ben", "Carlo"};
int foundAt = -1;
for (int i = 0; i < names.length; i++) {
	if (names[i].equals("Ben")) {
		foundAt = i;
		break;
	}
}
System.out.println(foundAt);   // 1
```

`-1` is a common way to say "not found," since it can never be a real index.

## Printing a whole array

If you try to print an array directly, you get something odd:

```java
int[] scores = {88, 94, 72};
System.out.println(scores);   // something like [I@1b6d3586
```

That's Java's internal label for the array, not its contents. To see the values, use `Arrays.toString`, from `java.util`:

```java
import java.util.Arrays;
```

```java
System.out.println(Arrays.toString(scores));   // [88, 94, 72]
```

The same `Arrays` class can also sort an array for you: `Arrays.sort(scores);` puts the values in order from smallest to largest.

## Arrays are passed as directions

In [Parameters and Return Values](/lessons/java/parameters), you learned that Java passes a copy of each argument, so a method can't change your `int` variable. Arrays are different, in an important way.

An array variable doesn't hold the values directly. It holds **directions** to where the array lives in memory. When you pass an array to a method, Java copies those directions. Both copies lead to the same array, so the method **can** change its items:

```java
public class Main {
	public static void main(String[] args) {
		int[] scores = {70, 80, 90};
		addBonus(scores);
		System.out.println(scores[0]);   // 75
	}

	static void addBonus(int[] list) {
		for (int i = 0; i < list.length; i++) {
			list[i] += 5;
		}
	}
}
```

It's like giving a friend a copy of your home address. It's a copy of the address, but it leads to the same house, and if they repaint the front door, your door gets repainted.

The same thing happens with `=`: `int[] backup = scores;` doesn't copy the array. It copies the directions, so `backup` and `scores` are two names for the same array. To make a real copy, use `Arrays.copyOf(scores, scores.length)`.

## Try it

This program analyzes a week of quiz scores: total, average, highest, how many passed, and a bonus that changes the array. Predict every line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="560px"
	:model-value="'import java.util.Arrays;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tString[] names = {&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;, &quot;Dina&quot;, &quot;Eli&quot;};\n\t\tint[] scores = {88, 94, 72, 65, 91};\n\n\t\tint total = 0;\n\t\tint highest = scores[0];\n\t\tint highestIndex = 0;\n\t\tint passed = 0;\n\n\t\tfor (int i = 0; i &lt; scores.length; i++) {\n\t\t\ttotal += scores[i];\n\t\t\tif (scores[i] &gt; highest) {\n\t\t\t\thighest = scores[i];\n\t\t\t\thighestIndex = i;\n\t\t\t}\n\t\t\tif (scores[i] &gt;= 75) {\n\t\t\t\tpassed++;\n\t\t\t}\n\t\t}\n\n\t\tSystem.out.println(&quot;Scores: &quot; + Arrays.toString(scores));\n\t\tSystem.out.println(&quot;Average: &quot; + (double) total / scores.length);\n\t\tSystem.out.println(&quot;Top student: &quot; + names[highestIndex] + &quot; with &quot; + highest);\n\t\tSystem.out.println(&quot;Passed: &quot; + passed + &quot; of &quot; + scores.length);\n\n\t\taddBonus(scores, 5);\n\t\tSystem.out.println(&quot;After bonus: &quot; + Arrays.toString(scores));\n\t}\n\n\tstatic void addBonus(int[] list, int points) {\n\t\tfor (int i = 0; i &lt; list.length; i++) {\n\t\t\tlist[i] = Math.min(100, list[i] + points);\n\t\t}\n\t}\n}\n'"
/>

`Math.min(100, ...)` gives back the smaller of its two numbers, so no score can go above 100.

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Scores: [88, 94, 72, 65, 91]
Average: 82.0
Top student: Ben with 94
Passed: 3 of 5
After bonus: [93, 99, 77, 70, 96]
```

The two arrays line up by index: `names[1]` is Ben, and `scores[1]` is his 94. And because the method received directions to the same array, the bonus it added is still there back in `main`.
:::

## Try it yourself

1. Add a sixth student and score to both arrays. Did you need to change any of the loops? Why not?
2. Add code that finds the **lowest** score and who got it.
3. Change the loop condition to `i <= scores.length` and predict what happens when the program runs. Then change it back.

## Check your understanding

<Quiz
	question="int[] scores = {88, 94, 72, 65}; What is scores[1]?"
	:options="['88', '72', 'An error', '94']"
	:answer-index="3"
	explanation="Array indexes start at 0, so scores[0] is 88 and scores[1] is 94."
/>

<Quiz
	question="How do you get the number of items in an array called scores?"
	:options="['scores.length()', 'scores.length', 'scores.size()', 'length(scores)']"
	:answer-index="1"
	explanation="For arrays, length is a property with no parentheses. Strings use length() with parentheses, and ArrayList uses size()."
/>

<Quiz
	question="An array has 5 items. Which loop condition visits every item without crashing?"
	:options="['i &lt;= scores.length', 'i &lt; scores.length - 1', 'i &lt; scores.length', 'i &lt;= 5']"
	:answer-index="2"
	explanation="The valid indexes are 0 to 4. i &lt; scores.length stops at 4. Using &lt;= would try index 5 and throw ArrayIndexOutOfBoundsException."
/>

## Up next

An array is a single row of slots. But a seating chart, a game board, or a gradebook with several quizzes per student has rows *and* columns. For those, you'll need [2D Arrays](/lessons/java/2d-arrays).
