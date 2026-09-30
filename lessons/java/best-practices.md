---
title: "Java Best Practices and Common Beginner Mistakes"
description: "Write Java that is easy to read and hard to break: naming conventions, formatting, small focused methods, and the mistakes almost every beginner makes."
---

# Best Practices and Common Mistakes

*Anyone can cook a meal once. A good cook leaves a kitchen the next cook can walk into and use.*

You've learned a lot of Java: types and operators, decisions and loops, methods, arrays and lists, classes, inheritance, interfaces, exceptions, and files. You can build real programs now.

This lesson is about building them *well*. Code is read far more often than it's written: by teachers, by teammates, and most of all by you, three weeks from now, when you've forgotten how it works. Working code is the minimum. Code that's easy to read, easy to change, and hard to break is the goal.

None of this is new syntax. It's habits, collected from the whole track in one place, plus a list of the mistakes that trip up almost every Java beginner.

## A shared kitchen

Picture a restaurant kitchen shared by several cooks across different shifts. A good cook labels every container, puts the knives back where they belong, and cleans as they go. The next cook walks in and gets straight to work.

A messy cook might make an equally good meal. But they leave unlabeled containers, and a knife in the flour. The next cook spends half their shift figuring out what's what, and one of them eventually uses salt instead of sugar.

Your code is that kitchen. These practices are how you keep it usable.

## Name things by what they are

Java has naming conventions that nearly every Java programmer follows. Following them makes your code instantly familiar to anyone who reads it:

| Kind | Style | Examples |
|---|---|---|
| classes and interfaces | PascalCase | `Student`, `BankAccount`, `Payable` |
| methods | camelCase, usually a verb | `calculateAverage`, `printReport`, `isPassing` |
| variables and parameters | camelCase, a noun | `studentName`, `quizScore`, `totalPoints` |
| constants (`static final`) | UPPER_SNAKE_CASE | `MAX_SCORE`, `PASSING_AVERAGE` |

Beyond the style, choose names that say what's inside:

- `averageScore` beats `avg`, and `avg` beats `x`.
- Booleans read like yes-or-no questions: `isEnrolled`, `hasPaid`, `canVote`.
- Loop counters can be short (`i`, `row`, `col`) because their scope is tiny. Anything that lives longer deserves a real name.

If you find yourself writing a comment to explain what a variable holds, rename the variable instead.

## Format consistently

Java doesn't care about indentation, but people do. Consistent formatting makes the structure of your code visible at a glance:

- Indent every block one level deeper than the line that opened it.
- **Always use braces** for `if`, `else`, `for`, and `while`, even for one line. You saw why in [Making Decisions](/lessons/java/if-else): without them, a second line that *looks* like it's inside the block isn't.
- One statement per line.
- A blank line between methods, and between groups of related lines inside a method.

Your editor can format a whole file for you. In VS Code, it's **Format Document**; in IntelliJ IDEA, **Reformat Code**. Use it often.

## Replace magic numbers with constants

A **magic number** is a number in your code with no explanation:

```java
if (average >= 75) {
	System.out.println("Passed");
}
double discounted = price * 0.8;
```

What's 75? What's 0.8? The reader has to guess. And if the passing grade changes, you have to find every 75 in the program, and hope none of them meant something else.

Give each one a name, as a `static final` constant:

```java
static final double PASSING_AVERAGE = 75.0;
static final double STUDENT_DISCOUNT = 0.20;
```

```java
if (average >= PASSING_AVERAGE) {
	System.out.println("Passed");
}
double discounted = price * (1 - STUDENT_DISCOUNT);
```

Now the code explains itself, and changing the rule is a one-line edit.

## Keep methods small and focused

A method should do **one** job, and its name should say what that job is. When a method grows past a screenful, or you need the word "and" to describe it, split it up.

Compare a `main` that does everything in 80 lines with this:

```java
public static void main(String[] args) {
	List<Student> students = loadStudents();
	printReport(students);
	saveReport(students);
}
```

You can understand the whole program in three lines, and dig into whichever method you care about. That's what the [Methods](/lessons/java/methods) chapter was building toward.

## Don't repeat yourself

When you copy and paste a block of code, you're making a promise to fix every bug in it twice. Or five times. And you'll forget one.

If the same lines appear in several places, move them into a method and call it. If several classes share the same fields and methods, consider a parent class ([Inheritance](/lessons/java/inheritance)) or an interface ([Interfaces](/lessons/java/interfaces)). This habit is so common it has a name: **DRY**, for "Don't Repeat Yourself."

## Keep data protected and scope small

- Make fields **`private`**, and change them only through methods that check the rules ([Encapsulation](/lessons/java/encapsulation)).
- Declare variables in the **smallest scope** that works, close to where they're used ([Variable Scope](/lessons/java/scope)).
- Use `final` for anything that shouldn't change after it's set.

Every one of these shrinks the number of places a bug could come from.

## Comment the why, not the what

Good names explain *what* code does. Comments are for what the code can't say: *why* it does it that way.

```java
// Bad: repeats the code
count++;   // add one to count

// Good: explains a decision
// Scores above 100 come from extra-credit work, so they're allowed here.
if (score > 110) {
	throw new IllegalArgumentException("Score too high: " + score);
}
```

And never leave old code commented out "just in case." It confuses readers, and if you ever need it back, that's what version control is for.

## Handle errors honestly

From [Exceptions](/lessons/java/exceptions):

- Catch **specific** exceptions you have a plan for, not `Exception` everywhere.
- **Never** leave a `catch` block empty.
- **Throw** an exception when a method is given data it can't work with, instead of quietly "fixing" it.
- Close files and other resources with **try-with-resources**.

## The mistakes almost everyone makes

Here's a checklist of the classic Java beginner bugs, all of which you met in this track. When something's wrong and you can't see why, run down this list.

1. **Comparing Strings with `==`.** Use `.equals()`. `==` checks whether two variables point to the same object, not whether the text matches. ([Working with Strings](/lessons/java/strings))
2. **Integer division.** `7 / 2` is `3`. Make one side a `double` first: `(double) total / count`. ([Operators and Expressions](/lessons/java/operators))
3. **Off-by-one loops.** Indexes run from `0` to `length - 1`, so loop with `i < array.length`, not `<=`. ([Arrays](/lessons/java/arrays))
4. **`nextInt` followed by `nextLine`.** The leftover Enter makes `nextLine` return an empty string. Read every line with `nextLine` and parse it. ([Reading User Input](/lessons/java/user-input))
5. **Forgetting to store a result.** `name.toUpperCase();` on its own does nothing, because Strings never change. Write `name = name.toUpperCase();`. ([Working with Strings](/lessons/java/strings))
6. **A `null` field.** An object field that was never set is `null`, and using it throws `NullPointerException`. Set every field in the constructor. ([Constructors](/lessons/java/constructors))
7. **Missing `break` in an old-style `switch`.** Execution falls through into the next case. Prefer the arrow form, which never falls through. ([The switch Statement](/lessons/java/switch))
8. **A semicolon after `if (...)` or `for (...)`.** It ends the statement early, and the block below always runs, or runs once. ([Making Decisions](/lessons/java/if-else))
9. **`name = name` in a constructor.** Without `this.`, the field is never set. ([Constructors](/lessons/java/constructors))
10. **Comparing decimals with `==`.** `0.1 + 0.2 == 0.3` is `false`, because of the tiny rounding errors from [Primitive Data Types](/lessons/java/data-types). Check whether the difference is tiny instead: `Math.abs(a - b) < 0.0001`.
11. **Misspelling an overridden method.** Without `@Override`, `tostring()` quietly becomes a new method, and printing still shows `Student@5ca881b5`. Always write `@Override`. ([Inheritance](/lessons/java/inheritance))
12. **Changing a list inside a for-each loop over it.** That throws `ConcurrentModificationException`. Use `removeIf`, or a regular `for` loop. ([ArrayList](/lessons/java/arraylist))

## Try it

This program works. It compiles, runs, and prints the right answer. But it breaks almost every habit in this lesson. Read it, predict what it prints, and while you're at it, count how many problems you can spot.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="520px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tString[] a = {&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo&quot;, &quot;Dina&quot;};\n\t\tint[] b = {91, 68, 95, 74};\n\t\tint c = 0;\n\t\tfor (int i = 0; i &lt; 4; i++) {\n\t\t\tif (b[i] &gt;= 75) c++;\n\t\t\tif (b[i] &gt;= 75) System.out.println(a[i] + &quot; passed with &quot; + b[i]);\n\t\t\tif (b[i] &lt; 75) System.out.println(a[i] + &quot; needs a retake (&quot; + b[i] + &quot;)&quot;);\n\t\t}\n\t\tint t = 0;\n\t\tfor (int i = 0; i &lt; 4; i++) {\n\t\t\tt = t + b[i];\n\t\t}\n\t\tSystem.out.println(&quot;Passed: &quot; + c + &quot;/&quot; + 4);\n\t\tSystem.out.println(&quot;Avg: &quot; + (double) t / 4);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Maria passed with 91
Ben needs a retake (68)
Carlo passed with 95
Dina needs a retake (74)
Passed: 2/4
Avg: 82.0
```

Some of the problems: names like `a`, `b`, `c`, and `t` say nothing. The magic numbers `75` and `4` are repeated, and the `4` breaks the moment a student is added. The same condition is checked three times. Two `if` statements skip their braces. Names and scores live in two separate arrays that only line up by luck. And everything is crammed into `main`.

Here's one way to clean it up. It prints exactly the same thing:

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
	static final int PASSING_SCORE = 75;

	public static void main(String[] args) {
		List<Student> students = new ArrayList<>();
		students.add(new Student("Maria", 91));
		students.add(new Student("Ben", 68));
		students.add(new Student("Carlo", 95));
		students.add(new Student("Dina", 74));

		int passedCount = 0;
		for (Student student : students) {
			printResult(student);
			if (student.isPassing()) {
				passedCount++;
			}
		}

		System.out.println("Passed: " + passedCount + "/" + students.size());
		System.out.println("Avg: " + averageScore(students));
	}

	static void printResult(Student student) {
		if (student.isPassing()) {
			System.out.println(student.getName() + " passed with " + student.getScore());
		} else {
			System.out.println(student.getName() + " needs a retake (" + student.getScore() + ")");
		}
	}

	static double averageScore(List<Student> students) {
		int total = 0;
		for (Student student : students) {
			total += student.getScore();
		}
		return (double) total / students.size();
	}
}

class Student {
	private final String name;
	private final int score;

	Student(String name, int score) {
		this.name = name;
		this.score = score;
	}

	String getName() {
		return name;
	}

	int getScore() {
		return score;
	}

	boolean isPassing() {
		return score >= Main.PASSING_SCORE;
	}
}
```

It's longer. That's fine. Every piece now has a name that says what it does, adding a fifth student is a single line, and changing the passing score is a single edit.
:::

## Try it yourself

1. In the messy version, add a fifth student, `Eli`, with a score of 88. How many places did you have to change? Now do the same in the clean version.
2. In the clean version, change the passing score to 70. Which students' results change?
3. Pick a program you wrote earlier in this track. Find one magic number, one unclear name, and one repeated block, and fix all three.

## Check your understanding

<Quiz
	question="Which name follows Java conventions for a constant?"
	:options="['maxScore', 'MaxScore', 'max-score', 'MAX_SCORE']"
	:answer-index="3"
	explanation="Constants declared static final use UPPER_SNAKE_CASE. Variables and methods use camelCase, and classes use PascalCase."
/>

<Quiz
	question="What is the main problem with the line if (average &gt;= 75)?"
	:options="['It does not compile', 'Averages cannot be compared', '75 is a magic number with no explanation, and it may be repeated elsewhere', '&gt;= should be &gt;']"
	:answer-index="2"
	explanation="A named constant like PASSING_AVERAGE explains the rule and lets you change it in one place."
/>

<Quiz
	question="Which comment is the most useful?"
	:options="['// Extra-credit scores can go above 100, so allow up to 110', '// add one to count', '// loop through the list', '// this is a variable']"
	:answer-index="0"
	explanation="Good comments explain why the code does something the reader could not guess. The others just repeat what the code already says."
/>

## Up next

That's everything. You have the whole toolkit, and the habits to use it well. Time to put it all together in one real program: [Final Project: Student Grade Manager](/lessons/java/final-project).
