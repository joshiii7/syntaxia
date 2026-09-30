---
title: "Java Loops: for, while, and do-while Explained"
description: "Repeat code in Java with for, while, and do-while loops, learn when each one fits best, and avoid infinite loops and off-by-one errors along the way."
---

# Loops: for, while, and do-while

*Laps around a running track: you know when you start, you know what counts as one lap, and you know when to stop.*

Say you want to print the numbers 1 to 5. You could write five `println` lines. Now say you want 1 to 1,000. Or you want to keep asking a user for a password until they get it right, and you have no idea how many tries that will take.

Copying lines doesn't work anymore. You need a way to say "do this again, and again, until...". That's a **loop**, and Java has three kinds.

## Laps around a track

Picture a coach timing you around a running track. Before you start, the coach sets the lap counter to zero. Before each lap, the coach checks: "Have you done 5 yet?" If not, you run another lap, and the counter goes up by one. When the answer is yes, you stop.

Every loop has those same three ingredients:

1. **A starting point**, like the lap counter at zero.
2. **A condition** that's checked before every lap. While it's `true`, the loop keeps going.
3. **A step** that moves things forward, so the condition eventually becomes `false`.

Forget the third one, and you'll be running laps forever. Programmers call that an **infinite loop**.

## The `while` loop

The simplest loop is `while`. It repeats its block as long as a condition is true:

```java
int lap = 1;

while (lap <= 5) {
	System.out.println("Lap " + lap);
	lap++;
}

System.out.println("Done!");
```

Step by step:

1. `lap` starts at 1.
2. Java checks `lap <= 5`. It's true, so the block runs: it prints `Lap 1`, and `lap` becomes 2.
3. Back to the top. `2 <= 5` is true, so it prints `Lap 2`...
4. Eventually `lap` is 6. `6 <= 5` is false, so the loop ends and `Done!` prints.

Each pass through the block is called an **iteration**. This loop has five.

## The `for` loop

Counting loops like that are so common that Java has a special shape for them. A `for` loop puts all three ingredients on one line:

```java
for (int lap = 1; lap <= 5; lap++) {
	System.out.println("Lap " + lap);
}
```

Inside the parentheses, separated by semicolons:

- `int lap = 1` is the **start**. It runs once, before anything else.
- `lap <= 5` is the **condition**, checked before every iteration.
- `lap++` is the **step**, run after every iteration.

This does exactly the same thing as the `while` loop above, but everything that controls the loop is in one place, where you can see it at a glance.

Programmers usually name a plain counter `i` (for "index"), and usually start counting at 0:

```java
for (int i = 0; i < 5; i++) {
	System.out.println("Iteration " + i);
}
// prints Iteration 0 through Iteration 4
```

`i = 0; i < 5` runs exactly five times, with `i` taking the values 0, 1, 2, 3, and 4. You'll see this pattern everywhere, because it lines up perfectly with how strings and arrays are numbered from zero.

The step doesn't have to be `++`. Count by twos, or count down:

```java
for (int i = 2; i <= 10; i += 2) {
	System.out.print(i + " ");
}
// 2 4 6 8 10

for (int i = 3; i >= 1; i--) {
	System.out.println(i + "...");
}
System.out.println("Liftoff!");
```

## Looping through a string

Combine a `for` loop with `length()` and `charAt()` from [Working with Strings](/lessons/java/strings), and you can visit every character:

```java
String word = "JAVA";

for (int i = 0; i < word.length(); i++) {
	System.out.println(i + ": " + word.charAt(i));
}
```

Notice the condition is `i < word.length()`, with `<`, not `<=`. The last index is `length() - 1`.

## Running totals

A very common loop job is adding things up. Create a variable *before* the loop to hold the total, and add to it on every iteration:

```java
int total = 0;

for (int i = 1; i <= 100; i++) {
	total += i;
}

System.out.println("1 + 2 + ... + 100 = " + total);   // 5050
```

The total has to be declared outside the loop. Declare it inside, and it would be reset to 0 on every lap. You'll see exactly why in [Variable Scope](/lessons/java/scope).

## The `do-while` loop

A `while` loop checks its condition *before* each lap, so if the condition starts out false, the block never runs at all. Sometimes you want the block to run at least once, no matter what. That's what `do-while` is for:

```java
int number = 10;

do {
	System.out.println("Number is " + number);
	number++;
} while (number < 5);
```

Even though `10 < 5` is false from the start, this prints `Number is 10` once, because the check happens at the end. Note the semicolon after the `while (...)` at the bottom. It's required here, unlike in the other loops.

`do-while` is perfect for menus and input checks, where you have to ask at least once before you can know whether to ask again. This one uses a `Scanner` from [Reading User Input with Scanner](/lessons/java/user-input), so remember the `import java.util.Scanner;` line at the top of the file:

```java
Scanner input = new Scanner(System.in);
int age;

do {
	System.out.print("Enter your age (1 to 120): ");
	age = Integer.parseInt(input.nextLine());
} while (age < 1 || age > 120);
```

This keeps asking until the answer is in range.

## Which loop should you use?

- **`for`** when you know how many times to repeat: 5 laps, 100 numbers, every character in a string.
- **`while`** when you repeat until something happens, and you don't know how many times that will take.
- **`do-while`** when the block must run at least once, like showing a menu or asking a question.

Any of them *can* do any job. Picking the one that matches the situation makes your code easier to read.

## Two classic bugs

**The infinite loop.** Forget the step, and the condition never changes:

```java
int lap = 1;
while (lap <= 5) {
	System.out.println("Lap " + lap);
	// forgot lap++
}
```

This prints `Lap 1` forever. If it happens to you, don't panic. Press **Ctrl + C** in the terminal, or the stop button in your editor, to end the program. Then check that something inside the loop moves it toward its end.

**Off by one.** The loop runs one time too many or one time too few. It's the most common loop bug of all:

```java
for (int i = 0; i <= 5; i++) {
	System.out.print(i + " ");
}
// 0 1 2 3 4 5 (six numbers, not five!)
```

When a loop runs the wrong number of times, check two things: where the counter **starts** (0 or 1?) and whether the condition uses **`<` or `<=`**. A useful habit: pick a tiny case, like 3 iterations, and trace it by hand.

## Try it

This program uses all three loops: a countdown with `for`, a savings goal with `while`, and a menu that runs once with `do-while`. Predict every line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="500px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tfor (int i = 3; i &gt;= 1; i--) {\n\t\t\tSystem.out.println(i + &quot;...&quot;);\n\t\t}\n\t\tSystem.out.println(&quot;Go!&quot;);\n\n\t\tint total = 0;\n\t\tfor (int i = 1; i &lt;= 5; i++) {\n\t\t\ttotal += i;\n\t\t}\n\t\tSystem.out.println(&quot;Sum of 1 to 5: &quot; + total);\n\n\t\tint savings = 0;\n\t\tint weeks = 0;\n\t\twhile (savings &lt; 500) {\n\t\t\tsavings += 150;\n\t\t\tweeks++;\n\t\t}\n\t\tSystem.out.println(&quot;Reached &quot; + savings + &quot; pesos after &quot; + weeks + &quot; weeks&quot;);\n\n\t\tString word = &quot;LOOP&quot;;\n\t\tString backwards = &quot;&quot;;\n\t\tfor (int i = word.length() - 1; i &gt;= 0; i--) {\n\t\t\tbackwards += word.charAt(i);\n\t\t}\n\t\tSystem.out.println(word + &quot; backwards is &quot; + backwards);\n\n\t\tint choice = 0;\n\t\tdo {\n\t\t\tSystem.out.println(&quot;Menu shown (choice is &quot; + choice + &quot;)&quot;);\n\t\t} while (choice != 0);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
3...
2...
1...
Go!
Sum of 1 to 5: 15
Reached 600 pesos after 4 weeks
LOOP backwards is POOL
Menu shown (choice is 0)
```

The `while` loop only checks the goal *before* each week, so the savings overshoot 500 and stop at 600. The `do-while` shows the menu once even though `choice != 0` is false from the start.
:::

## Try it yourself

1. Change the countdown so it starts at 10 and only prints even numbers: `10... 8... 6...` and so on.
2. Change the savings loop to save 120 pesos a week. How many weeks does it take now, and how much is saved?
3. Write a `for` loop that prints the 7 times table, from `7 x 1 = 7` to `7 x 10 = 70`.

## Check your understanding

<Quiz
	question="How many times does for (int i = 0; i &lt; 5; i++) run its block?"
	:options="['4', '5', '6', 'Forever']"
	:answer-index="1"
	explanation="i takes the values 0, 1, 2, 3, and 4. When i reaches 5, the condition i &lt; 5 is false, so the loop stops after five iterations."
/>

<Quiz
	question="What is special about a do-while loop?"
	:options="['It never runs', 'It always runs its block at least once', 'It can only count down', 'It does not need a condition']"
	:answer-index="1"
	explanation="do-while checks its condition at the end, after the block has run, so the block always runs at least once."
/>

<Quiz
	question="A while loop prints the same line forever. What is the most likely cause?"
	:options="['The loop has too many lines', 'while loops can only run 100 times', 'The println is wrong', 'Nothing inside the loop changes the condition, so it never becomes false']"
	:answer-index="3"
	explanation="Every loop needs a step that moves it toward its end. If nothing changes the variable in the condition, the loop never stops."
/>

## Up next

Sometimes you want to leave a loop early, like when you've found what you were looking for, or skip one iteration without stopping the whole loop. Java has two small keywords for that: [break and continue](/lessons/java/break-and-continue).
