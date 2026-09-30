---
title: "Java Exceptions: try, catch, finally, and throw"
description: "Handle problems in Java programs with exceptions: catch them with try and catch, clean up with finally, and throw your own when something goes wrong."
---

# Exceptions: try, catch, and throw

*A trapeze artist still falls sometimes. The net underneath doesn't stop the fall. It stops the fall from being the end of the show.*

Throughout this track, you've seen programs crash with messages like `NumberFormatException` and `ArrayIndexOutOfBoundsException`. In [Debugging Java Programs](/lessons/java/debugging), you learned to read them. But some of these problems aren't bugs in your code at all:

- A user types `seventeen` when you asked for their age.
- A file your program needs has been moved or deleted.
- The internet connection drops halfway through a download.

You can't prevent these. What you *can* do is plan for them, so your program responds sensibly, with a clear message or a second chance, instead of crashing. Java's tool for that is the **exception**.

## A safety net

A trapeze artist practices for years, but still, occasionally, misses a catch. That's why there's a net. The net doesn't prevent the fall. It **catches** it, so the artist can climb back up and carry on.

When something goes wrong in Java, the code at that point **throws** an exception: an object describing the problem. The exception falls down through the methods that called it. If a safety net, a **`catch`** block, is waiting somewhere along the way, it catches the exception and the program carries on. If there's no net at all, the exception falls all the way out of `main`, and the program crashes with a stack trace.

## `try` and `catch`

Wrap the risky code in a **`try`** block, and put the safety net in a **`catch`** block right after it:

```java
String typed = "seventeen";

try {
	int age = Integer.parseInt(typed);
	System.out.println("Next year you'll be " + (age + 1));
} catch (NumberFormatException e) {
	System.out.println("\"" + typed + "\" isn't a number. Please use digits, like 17.");
}

System.out.println("The program keeps running.");
```

```text
"seventeen" isn't a number. Please use digits, like 17.
The program keeps running.
```

Here's what happens:

1. Java runs the `try` block, line by line.
2. `parseInt` fails and throws a `NumberFormatException`.
3. Java **immediately** stops running the `try` block. The line that would print "Next year..." is skipped.
4. Java jumps to the matching `catch` block and runs it.
5. After the `catch`, the program carries on normally.

If nothing goes wrong in the `try` block, the `catch` block is skipped entirely.

The `catch` line names the **type** of exception it handles, `NumberFormatException`, and gives it a variable name, `e` by convention. That variable holds the exception object, so you can ask it for details, like `e.getMessage()`.

## Asking again until the input is valid

Combine `try`/`catch` with a loop, and you can keep asking until the user gets it right. This fixes the `InputMismatchException` problem from [Reading User Input with Scanner](/lessons/java/user-input):

```java
Scanner input = new Scanner(System.in);
int age = 0;
boolean valid = false;

while (!valid) {
	System.out.print("How old are you? ");
	try {
		age = Integer.parseInt(input.nextLine());
		valid = true;
	} catch (NumberFormatException e) {
		System.out.println("Please type a whole number, like 17.");
	}
}

System.out.println("Thanks! You're " + age + ".");
```

`valid = true` only runs if `parseInt` succeeds, so the loop only ends on good input.

## Several catch blocks

Different problems might need different responses. You can have several `catch` blocks, one per exception type, and Java uses the first one that matches:

```java
int[] scores = {88, 94, 72};
String typedIndex = "5";

try {
	int index = Integer.parseInt(typedIndex);
	System.out.println("Score: " + scores[index]);
} catch (NumberFormatException e) {
	System.out.println("That's not a number.");
} catch (ArrayIndexOutOfBoundsException e) {
	System.out.println("There's no score number " + typedIndex + ".");
}
```

```text
There's no score number 5.
```

If two exception types need the same response, list them in one catch with a `|` between them: `catch (NumberFormatException | ArrayIndexOutOfBoundsException e)`.

## The exception family tree

Exceptions are objects, and like the classes in [Inheritance](/lessons/java/inheritance), they form a family tree. Near the top is `Exception`, and more specific types extend it. A `catch` block catches its type **and all of its children**.

That means `catch (Exception e)` catches almost everything. It's tempting to use it everywhere, but it's usually a mistake. It lumps every problem together, including bugs you'd rather see and fix, and your message can't be specific. Catch the specific exceptions you expect, and let real bugs crash loudly so you notice them.

And never write an empty catch block:

```java
try {
	int age = Integer.parseInt(typed);
} catch (NumberFormatException e) {
	// nothing here
}
```

This hides the problem completely. The program carries on as if everything were fine, with wrong data, and you get no clue why. If you really can't do anything useful, at least print a message.

## `finally`: always clean up

Sometimes there's work that must happen whether the `try` block succeeded or failed, like closing a file or printing "done." Put it in a **`finally`** block:

```java
try {
	System.out.println("Opening the gradebook...");
	int result = 10 / 0;
} catch (ArithmeticException e) {
	System.out.println("Math problem: " + e.getMessage());
} finally {
	System.out.println("Closing the gradebook.");
}
```

```text
Opening the gradebook...
Math problem: / by zero
Closing the gradebook.
```

The `finally` block runs in every case: after a normal `try`, after a `catch`, and even if the `try` block runs a `return`. For files, Java has an even neater way to guarantee cleanup, called try-with-resources, which you'll use in [Reading and Writing Files](/lessons/java/file-io).

## Throwing your own exceptions

So far, Java's own code has done the throwing. Your code can throw exceptions too, with the **`throw`** keyword. This is the "refuse bad data loudly" idea promised back in [Constructors](/lessons/java/constructors):

```java
class Student {
	private String name;
	private int gradeLevel;

	Student(String name, int gradeLevel) {
		if (gradeLevel < 1 || gradeLevel > 12) {
			throw new IllegalArgumentException("Grade level must be 1 to 12, got " + gradeLevel);
		}
		this.name = name;
		this.gradeLevel = gradeLevel;
	}
}
```

`throw new IllegalArgumentException("...")` creates an exception object with a message, and throws it. The constructor stops right there, and no invalid student is ever created. Whoever called `new Student(...)` can catch it, or let it crash the program with a clear message.

Two built-in exceptions cover most of your own needs:

- **`IllegalArgumentException`**: a method was given a bad argument.
- **`IllegalStateException`**: the object isn't in the right state for that action, like withdrawing from a closed account.

Throwing is better than quietly "fixing" bad data, because it makes mistakes visible right where they happen, instead of letting a wrong value cause a confusing problem much later.

## Checked and unchecked exceptions

Java has two kinds of exceptions, and the difference affects what the compiler makes you do.

**Unchecked exceptions** are usually caused by bugs or bad values: `NumberFormatException`, `NullPointerException`, `ArrayIndexOutOfBoundsException`, `IllegalArgumentException`. The compiler doesn't force you to handle them. You catch them when you have a sensible plan for them.

**Checked exceptions** are problems outside your program's control, which a well-written program should always plan for. The most common is `IOException`, for things like a missing file. For these, the compiler **insists**: either catch the exception, or declare that your method might throw it, using `throws`:

```java
static String readFirstLine(String fileName) throws IOException {
	...
}
```

`throws IOException` passes the responsibility up to whoever calls the method. You'll see checked exceptions for real in the next lesson, where files make them unavoidable.

## Try it

This program loads a list of scores typed as text, where some entries are broken. It uses `try` and `catch` to skip bad entries, throws its own exception for scores outside 0 to 100, and uses `finally` to report on every entry. Predict every line.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="640px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString[] entries = {&quot;88&quot;, &quot;ninety&quot;, &quot;105&quot;, &quot;72&quot;, &quot;&quot;};\n\t\tint total = 0;\n\t\tint count = 0;\n\n\t\tfor (String entry : entries) {\n\t\t\ttry {\n\t\t\t\tint score = parseScore(entry);\n\t\t\t\ttotal += score;\n\t\t\t\tcount++;\n\t\t\t\tSystem.out.println(&quot;OK: &quot; + score);\n\t\t\t} catch (NumberFormatException e) {\n\t\t\t\tSystem.out.println(&quot;Not a number: \\&quot;&quot; + entry + &quot;\\&quot;&quot;);\n\t\t\t} catch (IllegalArgumentException e) {\n\t\t\t\tSystem.out.println(&quot;Rejected: &quot; + e.getMessage());\n\t\t\t} finally {\n\t\t\t\tSystem.out.println(&quot;  (checked \\&quot;&quot; + entry + &quot;\\&quot;)&quot;);\n\t\t\t}\n\t\t}\n\n\t\tif (count &gt; 0) {\n\t\t\tSystem.out.println(&quot;Average of &quot; + count + &quot; valid scores: &quot; + (double) total / count);\n\t\t}\n\t}\n\n\tstatic int parseScore(String text) {\n\t\tint score = Integer.parseInt(text);\n\t\tif (score &lt; 0 || score &gt; 100) {\n\t\t\tthrow new IllegalArgumentException(&quot;score &quot; + score + &quot; is outside 0 to 100&quot;);\n\t\t}\n\t\treturn score;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
OK: 88
  (checked "88")
Not a number: "ninety"
  (checked "ninety")
Rejected: score 105 is outside 0 to 100
  (checked "105")
OK: 72
  (checked "72")
Not a number: ""
  (checked "")
Average of 2 valid scores: 80.0
```

`"ninety"` and the empty string both fail inside `parseInt`, which throws `NumberFormatException`. `"105"` parses fine, but `parseScore` throws its own `IllegalArgumentException`. The `finally` block runs for all five entries, whether they passed or not.

One subtle detail: `NumberFormatException` is actually a child of `IllegalArgumentException`. That's why its `catch` block has to come first. If the order were swapped, the general one would catch everything, and the compiler would stop you with an error saying the second catch could never be reached.
:::

## Try it yourself

1. Add `"-3"` and `"100"` to the entries. Predict what each one prints.
2. Swap the order of the two `catch` blocks and read the compiler's error message.
3. Change `parseScore` so an empty string throws an `IllegalArgumentException` with the message `"empty entry"` before trying to parse it. How does the output change?

## Check your understanding

<Quiz
	question="What happens to the rest of a try block after one of its lines throws an exception?"
	:options="['It keeps running normally', 'It is skipped, and Java jumps to the matching catch block', 'Java runs it twice', 'The whole program always stops']"
	:answer-index="1"
	explanation="As soon as an exception is thrown, the try block stops. Java looks for a matching catch, runs it, and then carries on after the whole try-catch."
/>

<Quiz
	question="When does a finally block run?"
	:options="['Only when an exception happens', 'Only when no exception happens', 'Every time, whether or not an exception happened', 'Only at the end of the program']"
	:answer-index="2"
	explanation="finally always runs, which makes it the right place for cleanup like closing files."
/>

<Quiz
	question="Why is an empty catch block a bad idea?"
	:options="['It hides the problem, so the program carries on with wrong data and no clue why', 'It does not compile', 'It makes the program slower', 'Catch blocks must always rethrow']"
	:answer-index="0"
	explanation="Swallowing an exception silently turns a clear error into a mystery. Handle it, report it, or let it crash."
/>

## Up next

Every program so far forgets everything the moment it ends. In [Reading and Writing Files](/lessons/java/file-io), your programs will save data to files and load it back next time, and you'll put checked exceptions and `finally`-style cleanup to real use.
