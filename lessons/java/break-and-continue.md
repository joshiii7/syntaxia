---
title: "Java break and continue: Controlling Your Loops"
description: "Stop a Java loop early with break, skip ahead to the next repetition with continue, and learn how to use both without making your loops hard to follow."
---

# break and continue

*Looking for your keys in a row of drawers: once you find them, you stop opening drawers. And you skip the drawer you know is empty.*

The loops in [Loops: for, while, and do-while](/lessons/java/loops) run until their condition becomes false. Most of the time, that's exactly right. But sometimes you know partway through that you're done, or that one particular iteration should be skipped.

Java gives you two small keywords for those moments. **`break`** leaves the loop completely. **`continue`** skips the rest of the current iteration and moves on to the next one.

## The drawers

Imagine a dresser with ten drawers, and your keys are in one of them. You start at the top and open each drawer in turn.

- When you find the keys in drawer 4, you **stop**. There's no point opening drawers 5 through 10. That's `break`.
- You know drawer 2 is full of old socks and never has keys. You **skip** it and go straight to drawer 3. That's `continue`.

## `break`: stop the loop now

When Java reaches `break` inside a loop, it jumps out of the loop immediately and carries on with the code after it:

```java
String password = "sunflower7garden";

for (int i = 0; i < password.length(); i++) {
	char c = password.charAt(i);
	if (Character.isDigit(c)) {
		System.out.println("First digit is " + c + ", at index " + i);
		break;
	}
}

System.out.println("Search finished.");
```

`Character.isDigit(c)` is a built-in check that answers `true` when `c` is one of the characters `0` to `9`. Once the first digit is found, `break` ends the loop. Without it, the loop would keep checking every remaining character for nothing.

This is the most common use of `break`: **searching**. Look at items one at a time, and stop as soon as you find a match.

## `continue`: skip to the next iteration

When Java reaches `continue`, it skips everything left in the loop's block for this iteration and goes straight to the next one. In a `for` loop, the step (like `i++`) still runs.

```java
for (int i = 1; i <= 10; i++) {
	if (i % 3 == 0) {
		continue;
	}
	System.out.print(i + " ");
}
// 1 2 4 5 7 8 10
```

Every multiple of 3 hits `continue`, so its `print` line never runs. The loop itself keeps going.

`continue` is handy for **filtering**: skipping items that don't matter, so the rest of the block only deals with the ones that do.

## `break` with `while (true)`

Sometimes you don't know the stopping point until you're in the middle of an iteration. A common pattern is a loop that would run forever on its own, with a `break` inside as the only way out:

```java
Scanner input = new Scanner(System.in);

while (true) {
	System.out.print("Type a word (or quit): ");
	String word = input.nextLine();

	if (word.equals("quit")) {
		break;
	}

	System.out.println(word + " has " + word.length() + " letters.");
}

System.out.println("Bye!");
```

`while (true)` looks alarming, but the `break` makes it safe. The loop asks, checks for `quit`, and only then does its real work. It's a clean way to write "keep going until the user says stop."

## Only the nearest loop

`break` and `continue` only affect the **innermost** loop they're inside. If you have a loop inside another loop (you'll do lots of that in [Nested Loops](/lessons/java/nested-loops)), a `break` in the inner loop ends only the inner loop. The outer one keeps going.

There's also a special use of `break` you've already seen: inside the older colon form of a `switch`, from [The switch Statement](/lessons/java/switch). There, it exits the switch, not a loop.

## Use them sparingly

`break` and `continue` are useful, but a loop with lots of them gets hard to follow. Each one is a hidden exit or a hidden skip, and the reader has to hunt for them all to understand when the loop really stops.

Before reaching for them, check whether the loop's own condition could do the job:

```java
// With break
int i = 0;
while (true) {
	if (i >= 5) {
		break;
	}
	System.out.println(i);
	i++;
}

// Clearer: the condition says when to stop
int j = 0;
while (j < 5) {
	System.out.println(j);
	j++;
}
```

A good rule of thumb: one `break` or `continue` in a loop is usually fine, especially for searching or filtering. If you need three, consider rethinking the loop.

## Try it

This program checks a batch of quiz scores. It skips scores that were entered incorrectly (below 0 or above 100), counts the passing ones, and stops completely if it hits the special value `-1`, which marks the end of the list. Predict what it prints.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="460px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString scores = &quot;88,150,72,95,-5,64,-1,100&quot;;\n\t\tString[] parts = scores.split(&quot;,&quot;);\n\n\t\tint counted = 0;\n\t\tint passed = 0;\n\n\t\tfor (int i = 0; i &lt; parts.length; i++) {\n\t\t\tint score = Integer.parseInt(parts[i]);\n\n\t\t\tif (score == -1) {\n\t\t\t\tSystem.out.println(&quot;End marker found. Stopping.&quot;);\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t\tif (score &lt; 0 || score &gt; 100) {\n\t\t\t\tSystem.out.println(&quot;Skipping invalid score: &quot; + score);\n\t\t\t\tcontinue;\n\t\t\t}\n\n\t\t\tcounted++;\n\t\t\tif (score &gt;= 75) {\n\t\t\t\tpassed++;\n\t\t\t}\n\t\t}\n\n\t\tSystem.out.println(&quot;Valid scores counted: &quot; + counted);\n\t\tSystem.out.println(&quot;Passed: &quot; + passed);\n\t}\n}\n'"
/>

`scores.split(",")`, from [Working with Strings](/lessons/java/strings), cuts the text at every comma into an array of pieces. `parts[i]` gets the piece at index `i`, and `parts.length` is how many pieces there are.

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Skipping invalid score: 150
Skipping invalid score: -5
End marker found. Stopping.
Valid scores counted: 4
Passed: 2
```

`150` and `-5` are skipped with `continue`, so they're never counted. `-1` triggers `break`, so `100` at the very end is never even looked at. That leaves 88, 72, 95, and 64: four valid scores, two of them passing.
:::

## Try it yourself

1. Move the `-1` to the very end of the `scores` text. How do the counts change?
2. Remove the `continue` line (keep the message). What goes wrong with the counts, and why?
3. Change the program so it also stops at the first perfect score of `100`, printing `Perfect score found!` before it stops.

## Check your understanding

<Quiz
	question="What does break do inside a loop?"
	:options="['Ends the loop immediately and continues after it', 'Skips to the next iteration', 'Restarts the loop from the beginning', 'Stops the whole program']"
	:answer-index="0"
	explanation="break jumps out of the loop right away. The program carries on with whatever comes after the loop."
/>

<Quiz
	question="What does this print? for (int i = 1; i &lt;= 5; i++) { if (i == 3) continue; System.out.print(i); }"
	:options="['12', '12345', '1245', '345']"
	:answer-index="2"
	explanation="When i is 3, continue skips the print for that iteration only. The loop keeps going with 4 and 5."
/>

<Quiz
	question="A break is inside an inner loop, which is inside an outer loop. What does it end?"
	:options="['Both loops', 'Only the outer loop', 'The whole program', 'Only the inner loop']"
	:answer-index="3"
	explanation="break only affects the nearest loop it is inside. The outer loop carries on with its next iteration."
/>

## Up next

You just saw that a loop can sit inside another loop. That idea unlocks tables, grids, and patterns. Let's explore it properly in [Nested Loops](/lessons/java/nested-loops).
