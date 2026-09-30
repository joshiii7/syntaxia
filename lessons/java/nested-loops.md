---
title: "Java Nested Loops: Loops Inside Loops for Beginners"
description: "Put one Java loop inside another to work with rows and columns, print patterns and tables, and understand how many times the inner loop really runs."
---

# Nested Loops

*A clock has two hands. The minute hand goes all the way around once for every single step of the hour hand.*

In [Loops: for, while, and do-while](/lessons/java/loops), each loop repeated one thing. But a lot of real problems come in two directions at once: rows and columns of seats, days and hours in a schedule, the times tables from 1 to 10.

For those, you put one loop inside another. That's a **nested loop**.

## The clock

Watch a clock between 1:00 and 3:00. The hour hand moves from 1 to 2 to 3: that's the **outer** loop. But for each single step of the hour hand, the minute hand goes all the way around, from 0 to 59: that's the **inner** loop.

The key idea is right there: **for every one step of the outer loop, the inner loop runs completely, from start to finish.**

## Your first nested loop

```java
for (int row = 1; row <= 3; row++) {
	for (int col = 1; col <= 4; col++) {
		System.out.print("(" + row + "," + col + ") ");
	}
	System.out.println();
}
```

This prints:

```text
(1,1) (1,2) (1,3) (1,4) 
(2,1) (2,2) (2,3) (2,4) 
(3,1) (3,2) (3,3) (3,4) 
```

Trace it slowly:

1. The outer loop starts with `row = 1`.
2. The inner loop runs from `col = 1` to `col = 4`, printing four pairs on the same line (using `print`, not `println`).
3. The inner loop ends. The empty `System.out.println()` moves down to a new line.
4. The outer loop moves on to `row = 2`, and the inner loop starts over from `col = 1`.

That `println()` placement matters. It sits inside the outer loop but **after** the inner loop, so it runs once per row. Moving it inside the inner loop would put every pair on its own line; moving it after the outer loop would put everything on one long line.

## Counting the work

How many times does the inner `print` run? The outer loop runs 3 times, and each time, the inner loop runs 4 times. So it's **3 × 4 = 12** times.

That multiplication is worth remembering, because nested loops can get expensive fast. Two loops of 1,000 each means a million runs of the inner block. That's still quick for a computer, but three loops of 1,000 would be a billion, and you'd feel it.

## Printing a times table

Here's the classic use: a multiplication table. The outer loop picks the row number, the inner loop picks the column number, and each cell is the two multiplied together:

```java
for (int row = 1; row <= 5; row++) {
	for (int col = 1; col <= 5; col++) {
		System.out.printf("%4d", row * col);
	}
	System.out.println();
}
```

```text
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

`printf("%4d", ...)`, from [Working with Strings](/lessons/java/strings), prints each number padded to 4 characters wide, which lines the columns up neatly.

## Patterns: when the inner loop depends on the outer one

The inner loop doesn't have to run the same number of times on every row. Its condition can use the outer loop's variable:

```java
for (int row = 1; row <= 4; row++) {
	for (int star = 1; star <= row; star++) {
		System.out.print("*");
	}
	System.out.println();
}
```

```text
*
**
***
****
```

On row 1, the inner loop runs once. On row 2, twice. On row 4, four times. The shape grows because `star <= row` lets it.

Patterns like this are a favorite teacher's exercise for a reason: to get them right, you have to understand exactly how the two loops interact.

## Naming your loop variables

With two loops, `i` and `j` are traditional names, and you'll see them in plenty of code. But when the loops mean something, like rows and columns, or days and hours, use those names instead. `row` and `col` make it obvious which loop is which. Mixing up `i` and `j` in a nested loop is a very common, very confusing bug.

And each loop needs its **own** variable. If the inner loop reused the outer loop's variable, it would change the outer loop's counter, and the whole thing would go haywire. Java actually stops you from declaring the same name twice here:

```java
for (int i = 0; i < 3; i++) {
	for (int i = 0; i < 3; i++) {
		System.out.println(i);
	}
}
// error: variable i is already defined in method main(String[])
```

## `break` inside a nested loop

As you saw in [break and continue](/lessons/java/break-and-continue), a `break` only exits the loop it's directly inside. In a nested loop, a `break` in the inner loop ends that row early, and the outer loop moves on to the next row:

```java
for (int row = 1; row <= 3; row++) {
	for (int col = 1; col <= 5; col++) {
		if (col > row) {
			break;
		}
		System.out.print(col + " ");
	}
	System.out.println();
}
```

```text
1 
1 2 
1 2 3 
```

## Try it

A small school theater has 4 rows of seats, labeled A to D, with 6 seats in each row. Some seats are taken. This program prints a seating map and counts the free seats. Predict the map before you check.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="440px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString rowLetters = &quot;ABCD&quot;;\n\t\tint seatsPerRow = 6;\n\t\tint free = 0;\n\n\t\tfor (int row = 0; row &lt; rowLetters.length(); row++) {\n\t\t\tchar letter = rowLetters.charAt(row);\n\t\t\tSystem.out.print(letter + &quot; | &quot;);\n\n\t\t\tfor (int seat = 1; seat &lt;= seatsPerRow; seat++) {\n\t\t\t\tboolean taken = (row + seat) % 3 == 0;\n\t\t\t\tif (taken) {\n\t\t\t\t\tSystem.out.print(&quot;X &quot;);\n\t\t\t\t} else {\n\t\t\t\t\tSystem.out.print(seat + &quot; &quot;);\n\t\t\t\t\tfree++;\n\t\t\t\t}\n\t\t\t}\n\t\t\tSystem.out.println();\n\t\t}\n\n\t\tint total = rowLetters.length() * seatsPerRow;\n\t\tSystem.out.println(&quot;Free seats: &quot; + free + &quot; of &quot; + total);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
A | 1 2 X 4 5 X 
B | 1 X 3 4 X 6 
C | X 2 3 X 5 6 
D | 1 2 X 4 5 X 
Free seats: 16 of 24
```

A seat is marked taken when `row + seat` is a multiple of 3. Row A is `row` 0, so seats 3 and 6 are taken. Row B is `row` 1, so seats 2 and 5 are taken, and so on. The inner loop runs 6 times for each of the 4 rows: 24 seats in total, and 8 of them are taken.
:::

## Try it yourself

1. Add a fifth row, `E`, to the theater. What do you need to change? (Only one thing!)
2. Change the star pattern from earlier in the lesson so it's upside down: four stars on the first line, one on the last.
3. Write a nested loop that prints a 10 by 10 times table, using `printf("%4d", ...)` to keep the columns lined up.

## Check your understanding

<Quiz
	question="The outer loop runs 5 times and the inner loop runs 3 times per outer iteration. How many times does the inner block run in total?"
	:options="['8', '15', '5', '3']"
	:answer-index="1"
	explanation="For every one of the 5 outer iterations, the inner loop runs all 3 times, so it is 5 times 3, which is 15."
/>

<Quiz
	question="In a grid-printing nested loop, where does the System.out.println() that ends each row belong?"
	:options="['Inside the inner loop', 'After both loops', 'Inside the outer loop, after the inner loop', 'Before both loops']"
	:answer-index="2"
	explanation="It has to run once per row, after that row's items are printed. That is inside the outer loop but after the inner loop."
/>

<Quiz
	question="What shape does this print? for (row 1 to 3) { for (star 1 to row) print *; println }"
	:options="['A triangle: 1, then 2, then 3 stars', 'A square of stars', 'One line of 3 stars', 'Nothing']"
	:answer-index="0"
	explanation="The inner loop runs up to row, so it prints 1 star on row 1, 2 stars on row 2, and 3 stars on row 3."
/>

## Up next

That's the Control Flow chapter done. Your programs can decide, repeat, and repeat inside repeats. As they grow, keeping everything in `main` gets messy. Next, you'll learn to split your code into named, reusable pieces in [Writing Methods](/lessons/java/methods).
