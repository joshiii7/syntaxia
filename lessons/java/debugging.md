---
title: "Debugging Java Programs: Read Errors and Fix Bugs"
description: "Read Java compiler errors and stack traces with confidence, track down logic bugs with print statements and a debugger, and fix problems step by step."
---

# Debugging Java Programs

*A good detective doesn't guess. They collect clues, form a theory, and test it.*

Here's something experienced programmers know and beginners often don't: **everyone writes bugs.** Every day. The difference between a beginner and a professional isn't that the professional's code works the first time. It's that the professional has a calm, reliable way of finding out *why* it doesn't.

That skill is called **debugging**, and it's the most useful thing in this chapter. You've already met plenty of error messages in this track. This lesson turns them from scary walls of text into clues.

## Thinking like a detective

A detective arriving at a scene doesn't point at the first person they see. They look at the evidence, form a theory about what happened, and then test that theory. If the evidence doesn't fit, they drop the theory and form a new one.

Debugging is the same loop:

1. **Observe.** What exactly happened? What did you expect to happen instead?
2. **Read the clues.** Error messages, line numbers, and the program's actual output.
3. **Form a theory.** "I think `total` is being reset inside the loop."
4. **Test it.** Print the value, or step through the code, and see if you're right.
5. **Fix, then check again.** Make one change, and run the program again to confirm it worked.

The biggest mistake is skipping to step 5: changing things at random until the error goes away. That sometimes works, but you learn nothing, and you often create a new bug in the process.

## Three kinds of bugs

Bugs come in three flavors, and each one gives you different clues.

- **Compile-time errors.** The compiler refuses to build your program. You met these in [How Java Runs](/lessons/java/how-java-runs). The good news: they come with a line number.
- **Runtime errors (exceptions).** The program compiles, starts, then crashes partway through. Java prints a **stack trace** showing where.
- **Logic errors.** The program runs to the end without complaint, but the answer is wrong. No message at all. These are the hardest, because you have to notice them yourself.

## Reading compiler errors

A compiler error has three important parts:

```text
Main.java:7: error: cannot find symbol
		int total = scroe + 5;
		            ^
  symbol:   variable scroe
  location: class Main
```

- **`Main.java:7`**: the file and the **line number**. Go there first.
- **`cannot find symbol`**: what's wrong, in short.
- The **caret `^`** points at the exact spot on the line. Here, `scroe`, a typo for `score`.

Some messages you'll see again and again, and what they usually mean:

| Message | Usual cause |
|---|---|
| `';' expected` | a missing semicolon, often at the end of the line *above* |
| `cannot find symbol` | a typo in a name, a variable used outside its [scope](/lessons/java/scope), or a missing `import` |
| `incompatible types` | a value of the wrong type, like a `String` where an `int` goes |
| `missing return statement` | a method with a return type that doesn't return on every path |
| `reached end of file while parsing` | a missing closing brace `}` |
| `variable might not have been initialized` | using a variable before giving it a value |
| `non-static ... from a static context` | calling an instance method from `main` without an object |

Two habits help a lot. **Fix the first error first**, because one mistake, like a missing brace, can cause a whole cascade of confusing errors after it. And **recompile after every fix**. Often, fixing the first error makes half the others disappear.

## Reading a stack trace

When a program crashes, Java prints a **stack trace**. It looks alarming, but it's a precise map to the problem:

```text
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "this.name" is null
	at Student.countLetters(Main.java:21)
	at Student.printReport(Main.java:16)
	at Main.main(Main.java:5)
```

Read it from the top:

- **The first line** says what went wrong: the type of exception (`NullPointerException`) and, in modern Java, a very helpful explanation: `"this.name" is null`. Some student's `name` field was never set.
- **The lines starting with `at`** show the chain of method calls that led to the crash, the most recent first. The crash happened on **line 21**, in the `Student` class's `countLetters` method, which was called from `printReport` on line 16, which was called from `main` on line 5.

Start at the top `at` line that's in **your** code, and go to that line number. If that line looks fine, the problem is usually a bad value passed in from further down the list.

The exceptions you'll meet most often:

| Exception | Usual cause |
|---|---|
| `NullPointerException` | using an object variable that's `null`, like a field that was never set |
| `ArrayIndexOutOfBoundsException` | an index below 0, or equal to or above the array's length |
| `IndexOutOfBoundsException` | the same thing, for an `ArrayList` |
| `ArithmeticException: / by zero` | dividing a whole number by zero |
| `NumberFormatException` | `Integer.parseInt` on text that isn't a number |
| `InputMismatchException` | a `Scanner` expecting a number and getting text |

## Finding logic bugs with print statements

When there's no error message, you have to create your own clues. The oldest and simplest tool is a temporary `println` that shows what the program is really doing:

```java
int total = 0;
for (int i = 1; i <= 5; i++) {
	total = i;
	System.out.println("DEBUG i=" + i + " total=" + total);
}
System.out.println("Total: " + total);
```

```text
DEBUG i=1 total=1
DEBUG i=2 total=2
DEBUG i=3 total=3
DEBUG i=4 total=4
DEBUG i=5 total=5
Total: 5
```

The expected answer was 15, and the debug lines show exactly why it isn't: `total` is being *replaced* on every lap instead of *added to*. The fix is `total += i;`.

A few tips for print debugging:

- **Label everything.** `DEBUG i=3 total=3` is useful. A bare `3` in a sea of output isn't.
- **Print at the boundaries.** Before and after a loop, at the start of a method (with its parameters), and right before the line that misbehaves.
- **Delete them when you're done.** Leftover debug lines confuse users and clutter your code. Starting each one with `DEBUG` makes them easy to find and remove.

## Using a debugger

Print statements work everywhere, but your editor has a more powerful tool built in: a **debugger**. It lets you pause your program on any line and look around.

The basic moves are the same in VS Code, IntelliJ IDEA, and most other editors:

1. **Set a breakpoint.** Click in the margin to the left of a line number. A red dot appears. The program will pause just before running that line.
2. **Start in debug mode.** Use **Debug** instead of **Run** (often a bug icon next to the Run button).
3. **Inspect.** While paused, a panel shows every variable in scope and its current value. No print statements needed.
4. **Step.** **Step Over** runs the current line and pauses on the next one. **Step Into** follows a method call into the method. **Continue** runs until the next breakpoint.

Stepping through a loop one line at a time, watching a variable change, is one of the fastest ways to understand what your code is really doing. The IDE track covers this in more detail in [Debugging Basics in an IDE](/lessons/ide/debugging-basics).

## When you're really stuck

- **Explain it out loud.** Walk through the code line by line, explaining what each line does, to a friend, or even to a rubber duck on your desk. Programmers call this **rubber duck debugging**, and it works surprisingly often: saying "and then this adds one to... oh" is how many bugs get found.
- **Shrink the problem.** Comment out half the code, or copy the broken part into a tiny new program. The less code there is, the fewer places the bug can hide.
- **Check your assumptions.** The bug is often in the part you were *sure* was fine. Print it anyway.
- **Take a break.** A short walk really does help. Fresh eyes spot things tired ones miss.
- **Search the exact error message.** Someone has almost certainly seen it before. Paste it into a search engine, minus your own variable names.

## Try it

This program is supposed to print each student's average and the class's best average. It compiles and runs without crashing, but the output is wrong. There are **two logic bugs**. Read the code, predict what it actually prints, and see if you can spot both bugs before you open the answer.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="560px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString[] names = {&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;};\n\t\tint[][] scores = {\n\t\t\t{90, 85, 95},\n\t\t\t{70, 80, 75},\n\t\t\t{88, 92, 96}\n\t\t};\n\n\t\tdouble best = 0;\n\t\tString bestName = &quot;&quot;;\n\n\t\tfor (int s = 0; s &lt; names.length; s++) {\n\t\t\tint total = 0;\n\t\t\tfor (int q = 0; q &lt; scores[s].length - 1; q++) {\n\t\t\t\ttotal += scores[s][q];\n\t\t\t}\n\t\t\tdouble average = total / scores[s].length;\n\n\t\t\tSystem.out.println(names[s] + &quot;: &quot; + average);\n\n\t\t\tif (average &gt; best) {\n\t\t\t\tbest = average;\n\t\t\t\tbestName = names[s];\n\t\t\t}\n\t\t}\n\n\t\tSystem.out.println(&quot;Best: &quot; + bestName + &quot; with &quot; + best);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Maria: 58.0
Ben: 50.0
Carlo: 60.0
Best: Carlo with 60.0
```

Maria's real average is 90.0, so something's off. Here are the two bugs:

1. **Off by one:** `q < scores[s].length - 1` skips each student's last quiz. It should be `q < scores[s].length`.
2. **Integer division:** `total / scores[s].length` divides two `int` values, so the decimal part is chopped off. It should be `(double) total / scores[s].length`, as in [Type Casting and Conversion](/lessons/java/type-casting).

Adding a debug line like `System.out.println("DEBUG q=" + q + " total=" + total);` inside the inner loop would reveal the first bug immediately: each student only ever shows `q=0` and `q=1`. With both fixes, the program prints Maria 90.0, Ben 75.0, Carlo 92.0, and Carlo as the best.
:::

## Try it yourself

1. Fix both bugs, then run the program on your computer to confirm the corrected output.
2. Set a breakpoint on the `total += scores[s][q];` line and run in debug mode. Step through the first student and watch `q` and `total` change in the variables panel.
3. Change `String bestName = "";` to `String bestName = null;` and add a line at the end that prints `bestName.length()`. When does it crash, and when doesn't it? What if every average were 0?

## Check your understanding

<Quiz
	question="A compiler error says Main.java:14: error: ';' expected. Where should you look first?"
	:options="['Line 14, and the line just above it', 'Line 1 of the file', 'The last line of the file', 'Nowhere, recompile until it goes away']"
	:answer-index="0"
	explanation="The number after the file name is the line. A missing semicolon is often reported on the line after the real mistake, so check the line above too."
/>

<Quiz
	question="In a stack trace, which at line shows where the crash actually happened?"
	:options="['The last one', 'The one that mentions main', 'The first one', 'Stack traces do not show that']"
	:answer-index="2"
	explanation="The top at line is the most recent call, where the exception was thrown. The lines below show how the program got there."
/>

<Quiz
	question="Your program runs to the end with no errors, but prints the wrong total. What kind of bug is this?"
	:options="['A compile-time error', 'A runtime exception', 'A bug in Java itself', 'A logic error']"
	:answer-index="3"
	explanation="The code is valid and does not crash, but it does the wrong thing. Logic errors give no message, so you find them with print statements or a debugger."
/>

## Up next

Some problems aren't bugs at all. A user types letters where you asked for a number, or a file your program needs has been deleted. Your code can't prevent those, but it can handle them gracefully instead of crashing. That's [Exceptions: try, catch, and throw](/lessons/java/exceptions).
