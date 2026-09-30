---
title: "Java 2D Arrays: Rows, Columns, and Nested Loops"
description: "Use two-dimensional arrays in Java to store grids and tables, reach any item by its row and column, and loop through every cell with nested loops."
---

# 2D Arrays

*A theater ticket doesn't just say "seat 7." It says "row C, seat 7," because a theater has two directions.*

The [Arrays](/lessons/java/arrays) you've built so far are a single line of slots, like one row of eggs. That works for a list of scores. But plenty of data comes in a grid:

- a gradebook, with one row per student and one column per quiz
- a seating chart, with rows and seats
- a tic-tac-toe or chess board
- a weekly timetable, with days and class periods

For grids, Java has **two-dimensional arrays**, usually called **2D arrays**.

## Rows and seats

In a theater, every seat has two numbers: which row it's in, and which seat it is in that row. "Row 2, seat 5" pinpoints exactly one chair. You always give the row first, then the seat.

A 2D array works the same way. Every item has two indexes: the **row** first, then the **column**. And like every array in Java, both start counting from 0.

## Creating a 2D array

With values you already know, nest one set of curly braces inside another. Each inner set is one row:

```java
int[][] grades = {
	{88, 92, 79},   // row 0: Maria's three quizzes
	{75, 68, 81},   // row 1: Ben's
	{95, 90, 98}    // row 2: Carlo's
};
```

The type `int[][]`, with two pairs of brackets, means "an array of arrays of ints." That's exactly what it is: an outer array whose items are rows, and each row is an ordinary array.

Laid out as a table, it looks like this:

```text
            col 0   col 1   col 2
row 0:        88      92      79
row 1:        75      68      81
row 2:        95      90      98
```

When you know the size but not the values yet, use `new` with the number of rows and the number of columns:

```java
int[][] seats = new int[4][6];   // 4 rows, 6 columns, all starting at 0
```

## Reading and changing a cell

Give the row index, then the column index, each in its own brackets:

```java
int[][] grades = {
	{88, 92, 79},
	{75, 68, 81},
	{95, 90, 98}
};

System.out.println(grades[1][2]);   // 81: row 1 (Ben), column 2 (quiz 3)

grades[1][1] = 72;                  // Ben's quiz 2 regraded
System.out.println(grades[1][1]);   // 72
```

A good way to remember the order: **row, then column**, the same order you read a page. First you find the line, then you move across it.

## How big is it?

Because a 2D array is an array of rows:

- `grades.length` is the number of **rows** (3).
- `grades[0].length` is the number of **columns** in row 0 (3).

```java
int[][] seats = new int[4][6];
System.out.println(seats.length);      // 4 rows
System.out.println(seats[0].length);   // 6 columns
```

## Looping through every cell

Here's where [Nested Loops](/lessons/java/nested-loops) pay off. The outer loop walks through the rows, and the inner loop walks across the columns of the current row:

```java
int[][] grades = {
	{88, 92, 79},
	{75, 68, 81},
	{95, 90, 98}
};

for (int row = 0; row < grades.length; row++) {
	for (int col = 0; col < grades[row].length; col++) {
		System.out.print(grades[row][col] + " ");
	}
	System.out.println();
}
```

```text
88 92 79 
75 68 81 
95 90 98 
```

Notice the inner loop's condition: `col < grades[row].length`. It asks the current row how long it is. That's the safest habit, and the next section shows why.

The for-each loop works too, and reads nicely when you don't need the indexes. Each `row` is an ordinary `int[]`:

```java
int total = 0;
for (int[] row : grades) {
	for (int grade : row) {
		total += grade;
	}
}
System.out.println(total);   // 766
```

## Row totals and column totals

Two very common jobs have slightly different shapes.

**One row at a time**, like each student's average, uses the loops in their usual order. Reset the total at the start of each row:

```java
for (int row = 0; row < grades.length; row++) {
	int sum = 0;
	for (int col = 0; col < grades[row].length; col++) {
		sum += grades[row][col];
	}
	System.out.println("Row " + row + " total: " + sum);
}
```

**One column at a time**, like the class average on each quiz, flips the loops: the outer loop picks a column, and the inner loop goes down through the rows:

```java
for (int col = 0; col < grades[0].length; col++) {
	int sum = 0;
	for (int row = 0; row < grades.length; row++) {
		sum += grades[row][col];
	}
	System.out.println("Quiz " + (col + 1) + " total: " + sum);
}
```

## Rows can have different lengths

Since each row is its own array, rows don't have to be the same length. This is called a **jagged array**:

```java
int[][] clubScores = {
	{10, 8},
	{9, 7, 10, 6},
	{8}
};
```

Maybe one club met twice, another four times, and another once. Loops that use `grades[row].length` handle this perfectly, which is why that's the habit to build. A loop that assumed every row had `grades[0].length` columns would crash on row 2 here, or skip items in row 1.

## Printing a 2D array quickly

`Arrays.toString` shows the directions to each row, not the values. For 2D arrays, use `Arrays.deepToString`:

```java
int[][] small = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(small));   // [[1, 2], [3, 4]]
```

It's handy for a quick look while debugging. For anything a user will see, loop and format the output yourself.

## Try it

This program stores a small class's quiz grades in a 2D array, prints a formatted gradebook with each student's average, and finds the class average for each quiz. Predict the table.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="560px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString[] students = {&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;};\n\t\tint[][] grades = {\n\t\t\t{88, 92, 79},\n\t\t\t{75, 68, 81},\n\t\t\t{95, 90, 98}\n\t\t};\n\n\t\tSystem.out.printf(&quot;%-8s %5s %5s %5s %8s%n&quot;, &quot;Name&quot;, &quot;Q1&quot;, &quot;Q2&quot;, &quot;Q3&quot;, &quot;Average&quot;);\n\n\t\tfor (int row = 0; row &lt; grades.length; row++) {\n\t\t\tSystem.out.printf(&quot;%-8s&quot;, students[row]);\n\t\t\tint sum = 0;\n\t\t\tfor (int col = 0; col &lt; grades[row].length; col++) {\n\t\t\t\tSystem.out.printf(&quot; %5d&quot;, grades[row][col]);\n\t\t\t\tsum += grades[row][col];\n\t\t\t}\n\t\t\tdouble average = (double) sum / grades[row].length;\n\t\t\tSystem.out.printf(&quot; %8.1f%n&quot;, average);\n\t\t}\n\n\t\tSystem.out.print(&quot;Quiz avg&quot;);\n\t\tfor (int col = 0; col &lt; grades[0].length; col++) {\n\t\t\tint sum = 0;\n\t\t\tfor (int row = 0; row &lt; grades.length; row++) {\n\t\t\t\tsum += grades[row][col];\n\t\t\t}\n\t\t\tSystem.out.printf(&quot; %5.1f&quot;, (double) sum / grades.length);\n\t\t}\n\t\tSystem.out.println();\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Name        Q1    Q2    Q3  Average
Maria       88    92    79     86.3
Ben         75    68    81     74.7
Carlo       95    90    98     94.3
Quiz avg  86.0  83.3  86.0
```

Each student's row is added across, then divided by the number of quizzes. The last line flips the loops to add down each column instead, then divides by the number of students.
:::

## Try it yourself

1. Add a fourth student, `Dina`, with grades 82, 85, and 88. What do you need to change? (Two places.)
2. Add a fourth quiz column for every student. Does the table still line up? What else needs updating?
3. Find the single highest grade in the whole array, and print which student got it and on which quiz.

## Check your understanding

<Quiz
	question="int[][] g = {{1, 2, 3}, {4, 5, 6}}; What is g[1][0]?"
	:options="['4', '2', '1', '5']"
	:answer-index="0"
	explanation="The first index picks the row and the second picks the column. Row 1 is {4, 5, 6}, and column 0 of that row is 4."
/>

<Quiz
	question="For int[][] seats = new int[4][6];, what is seats.length?"
	:options="['4', '6', '24', '10']"
	:answer-index="0"
	explanation="A 2D array is an array of rows, so its length is the number of rows: 4. seats[0].length gives the number of columns, 6."
/>

<Quiz
	question="Why is col &lt; grades[row].length a safer inner-loop condition than col &lt; grades[0].length?"
	:options="['It runs faster', 'It skips the first row', 'It works even when rows have different lengths', 'There is no difference in any case']"
	:answer-index="2"
	explanation="Each row is its own array and can have its own length. Asking the current row for its length handles jagged arrays correctly."
/>

## Up next

Arrays have one big limitation: their size is fixed forever. When a new student joins, the carton is full. Next, you'll meet a list that grows and shrinks as you need it: [ArrayList](/lessons/java/arraylist).
