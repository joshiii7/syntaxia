---
title: "Java Final Project: Build a Student Grade Manager"
description: "Put the whole Java track to work by building a console app that stores students, records their grades, and calculates averages, guided step by step."
---

# Final Project: Student Grade Manager

*Every lesson gave you one tool. This project hands you the whole toolbox and a real job to do.*

Before the project, one more look back.

At the start of this track, your first program was a single line inside a lot of setup you didn't understand yet: `System.out.println("Hello, world!");`. You didn't know what `public`, `static`, `void`, or `String[] args` meant. You just copied them and hoped.

Look at what you know now. You can store values in variables with the right types, and you know why `7 / 2` is `3`. You can read what a user types, and you know why `nextInt` and `nextLine` don't get along. You can make decisions, repeat work, and stop a loop exactly when you mean to. You can split a program into methods that each do one job. You can keep lists of data in arrays and ArrayLists. You can design your own classes, protect their data, build families of them, and treat different objects the same way through a shared type. You can read a stack trace like a map, handle problems without crashing, and save data so it's still there tomorrow.

And `public static void main(String[] args)` isn't a spell anymore. You can explain every word of it.

There were surely moments when nothing worked: a `cannot find symbol` that made no sense, a loop that ran forever, a `NullPointerException` out of nowhere. You read the clues, found the cause, and fixed it. That's the real skill, and you have it now.

I'm genuinely proud of you. Let's build something.

## The project

You'll build a **Student Grade Manager**: a program that runs in the terminal and lets a teacher keep track of a class. It shows a menu, and the user picks what to do:

1. **Add a student** by name.
2. **Record a score** for a student.
3. **Show a report**: every student's number of scores, average, and letter grade, plus the class average and the top student.
4. **Save** the gradebook to a file.
5. **Save and quit.**

When the program starts again later, it **loads** the saved gradebook, so nothing is lost.

It's the kind of small, useful tool that real programmers build all the time. And it uses something from nearly every chapter of this track.

## Getting set up

This is a project for your own computer, since Syntaxia can't run Java in the browser yet.

1. Make a new folder called `grade-manager`, and open it in your code editor.
2. Create a file called `Main.java` in it.
3. Copy the starter code below into `Main.java`, and run it with `java Main.java`, or your editor's Run button.

The starter code already runs. It shows the menu, lets you pick an option, and quits when you choose 5. Every other option just prints a `TODO` message for now. Your job is to replace those with the real thing.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="720px"
	:model-value="'import java.util.ArrayList;\nimport java.util.List;\nimport java.util.Scanner;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tScanner input = new Scanner(System.in);\n\t\tGradebook gradebook = new Gradebook();\n\t\t// TODO (requirement 5): load saved grades here.\n\n\t\tboolean running = true;\n\t\twhile (running) {\n\t\t\tprintMenu();\n\t\t\tString choice = input.nextLine().trim();\n\t\t\tswitch (choice) {\n\t\t\t\tcase &quot;1&quot; -&gt; System.out.println(&quot;TODO: add a student&quot;);\n\t\t\t\tcase &quot;2&quot; -&gt; System.out.println(&quot;TODO: record a score&quot;);\n\t\t\t\tcase &quot;3&quot; -&gt; System.out.println(&quot;TODO: show the report&quot;);\n\t\t\t\tcase &quot;4&quot; -&gt; System.out.println(&quot;TODO: save&quot;);\n\t\t\t\tcase &quot;5&quot; -&gt; running = false;\n\t\t\t\tdefault -&gt; System.out.println(&quot;Please choose a number from 1 to 5.&quot;);\n\t\t\t}\n\t\t}\n\n\t\tSystem.out.println(&quot;Goodbye!&quot;);\n\t\tinput.close();\n\t}\n\n\tstatic void printMenu() {\n\t\tSystem.out.println();\n\t\tSystem.out.println(&quot;=== Student Grade Manager ===&quot;);\n\t\tSystem.out.println(&quot;1. Add a student&quot;);\n\t\tSystem.out.println(&quot;2. Record a score&quot;);\n\t\tSystem.out.println(&quot;3. Show the report&quot;);\n\t\tSystem.out.println(&quot;4. Save&quot;);\n\t\tSystem.out.println(&quot;5. Save and quit&quot;);\n\t\tSystem.out.print(&quot;Choose: &quot;);\n\t}\n}\n\nclass Student {\n\t// TODO (requirement 1): private fields for the name and a list of scores,\n\t// a constructor, getters, addScore, getAverage, and getLetterGrade.\n}\n\nclass Gradebook {\n\tprivate final List&lt;Student&gt; students = new ArrayList&lt;&gt;();\n\n\t// TODO (requirement 2): addStudent, findStudent, size,\n\t// getClassAverage, getTopStudent, and printReport.\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. You can read and edit the starter code here, but build and run the project on your own computer. If you haven't set Java up yet, [Setting Up](/lessons/java/setting-up) walks you through it.
:::

Work through the requirements in order, and run your program after each one. Small steps, tested often, are how every real program gets built.

## Requirements

Each requirement says what to build, **why** it matters, and which lessons to review.

### 1. A `Student` class that protects its data

Fill in the `Student` class:

- **Private fields** for the student's name and an `ArrayList<Integer>` of scores. Create the list right where the field is declared, so it's never `null`.
- A **constructor** that takes the name. If the name is empty or blank, **throw** an `IllegalArgumentException` with a clear message.
- A **getter** for the name, and one for the number of scores.
- `addScore(int score)`: throw an `IllegalArgumentException` if the score is below 0 or above 100. Use named constants for 0 and 100, not magic numbers.
- `getAverage()`: the average of the scores, as a `double`. Watch out for integer division, and for a student with no scores yet.
- `getLetterGrade()`: `"A"` for 90 and up, `"B"` for 80 and up, `"C"` for 75 and up, and `"F"` below that. Return `"-"` for a student with no scores.

**Why:** A `Student` that checks its own rules can never hold a bad score, no matter which part of the program adds it. Review: [Classes and Objects](/lessons/java/classes-and-objects), [Constructors](/lessons/java/constructors), [Encapsulation](/lessons/java/encapsulation), and [Exceptions](/lessons/java/exceptions).

### 2. A `Gradebook` class that manages the class list

Fill in the `Gradebook` class, which keeps its students in the private list the starter code gives you:

- `addStudent(Student student)`: throw an `IllegalArgumentException` if a student with the same name is already there.
- `findStudent(String name)`: return the matching student, or `null` if there isn't one. Matching should ignore capital letters, so `maria santos` finds `Maria Santos`.
- `size()`: how many students there are.
- `getClassAverage()`: the average of the students' averages, counting only students who have at least one score.
- `getTopStudent()`: the student with the highest average, or `null` if nobody has a score yet.
- `printReport()`: the report described in requirement 4.

**Why:** Keeping the list private inside `Gradebook` means `main` can't accidentally add a duplicate or skip a rule. Everything goes through methods you control. Review: [ArrayList](/lessons/java/arraylist), [Parameters and Return Values](/lessons/java/parameters), and [Working with Strings](/lessons/java/strings).

### 3. A menu that never crashes

Replace the `TODO` lines in `main` so options 1 and 2 really work:

- **Add a student:** ask for a name, create the `Student`, and add it to the gradebook. If the constructor or `addStudent` throws, catch it and show its message.
- **Record a score:** ask for a name and look the student up. If there's no such student, say so. Otherwise, ask for a score, and handle both kinds of bad input: text that isn't a number, and a number outside 0 to 100.

Read every answer with `nextLine()`, and convert numbers with `Integer.parseInt`. Put each option's work in its own `static` method, so the `switch` stays short.

**Why:** Users type unexpected things. A program that answers "Please type a whole number" instead of crashing is one people can trust. Review: [Reading User Input with Scanner](/lessons/java/user-input), [The switch Statement](/lessons/java/switch), [Loops](/lessons/java/loops), and [Writing Methods](/lessons/java/methods).

### 4. A clear, lined-up report

Option 3 prints a table like the one in the sample run below: a header row, then one row per student with their name, number of scores, average (1 decimal place), and letter grade. After the table, print the class average and the top student.

- Override `toString()` in `Student` so that printing a student gives you their row of the table. Use `@Override`.
- Use `String.format` or `printf` with widths, like `%-14s` and `%8.1f`, so the columns line up.
- If there are no students yet, print a friendly message instead of an empty table.

**Why:** A report is only useful if people can read it at a glance. Review: [Working with Strings](/lessons/java/strings), [Inheritance](/lessons/java/inheritance), and [2D Arrays](/lessons/java/2d-arrays) (for the `printf` table habit).

### 5. Save and load with a file

Make the gradebook last between runs:

- **Save** (options 4 and 5): write every student to `grades.csv`, one line each, as the name followed by their scores, separated by commas: `Maria Santos,92,88`.
- **Load** (when the program starts): if `grades.csv` exists, read it line by line and rebuild each student. If it doesn't exist, print "No saved grades yet. Starting fresh."
- A broken line in the file, like `Carlo,abc`, must not stop the others from loading. Skip it with a message.
- Handle `IOException` wherever you touch the file.

A comma inside a name would break this format, so also reject names containing a comma in the `Student` constructor.

**Why:** Programs that forget everything aren't much use. Saving as plain text also means you can open `grades.csv` in your editor and see exactly what your program wrote. Review: [Reading and Writing Files](/lessons/java/file-io) and [Exceptions](/lessons/java/exceptions).

### 6. Clean, readable code

- Every field is `private`, and uses `final` where it never changes.
- No magic numbers: the score limits and the passing grades have names.
- Methods are small and named with verbs. `main` reads like a summary of the program.
- No empty `catch` blocks, and no `catch (Exception e)`.
- Strings are compared with `equals` or `equalsIgnoreCase`, never `==`.

**Why:** You'll come back to this code. So might a teammate, a teacher, or a future employer. Review: [Best Practices and Common Mistakes](/lessons/java/best-practices).

## Sample run

Your wording doesn't have to match exactly, but your program should handle every situation shown here. The words after `Choose:`, `Student name:`, and `Score (0 to 100):` are what the user typed. The menu prints before every choice; after the first time, it's left out here to save space.

```text
No saved grades yet. Starting fresh.

=== Student Grade Manager ===
1. Add a student
2. Record a score
3. Show the report
4. Save
5. Save and quit
Choose: 1
Student name: Maria Santos
Added Maria Santos.

Choose: 1
Student name: Ben Cruz
Added Ben Cruz.

Choose: 2
Student name: Maria Santos
Score (0 to 100): 92
Recorded 92 for Maria Santos.

Choose: 2
Student name: maria santos
Score (0 to 100): 88
Recorded 88 for Maria Santos.

Choose: 2
Student name: Ben Cruz
Score (0 to 100): 105
Couldn't record score: scores must be from 0 to 100, got 105

Choose: 2
Student name: Ben Cruz
Score (0 to 100): seventy
Please type a whole number, like 85.

Choose: 2
Student name: Ben Cruz
Score (0 to 100): 79
Recorded 79 for Ben Cruz.

Choose: 2
Student name: Carlo
There's no student with that name.

Choose: 3
Name           Scores  Average  Grade
Maria Santos        2     90.0      A
Ben Cruz            1     79.0      C
Class average: 84.5
Top student: Maria Santos (90.0)

Choose: 7
Please choose a number from 1 to 5.

Choose: 5
Saved 2 students to grades.csv.
Goodbye!
```

After that run, `grades.csv` contains:

```text
Maria Santos,92,88
Ben Cruz,79
```

And the next time the program starts, its first line is `Loaded 2 students from grades.csv.`

## Testing your program

There's no automatic checker for this project, so you're the tester. Try each of these, and make sure nothing crashes:

- Show the report before adding anyone.
- Add a student with an empty name, then with a name that's only spaces.
- Add the same student twice, once as `Maria Santos` and once as `maria santos`.
- Record a score for someone who doesn't exist.
- Type `abc`, `-5`, `101`, and `100` as scores.
- Type `9` and `hello` at the menu.
- Quit, run the program again, and check that everyone came back.
- Open `grades.csv`, add a line that says `Carlo,abc`, and start the program again.

## Stretch goals (optional, for the ambitious)

- Add a menu option that removes a student, with a "Are you sure? (y/n)" question first.
- Show each student's lowest and highest score in the report.
- Sort the report by average, highest first. (Look up `students.sort` and `Comparator.comparingDouble`.)
- Split the program into four files, `Main.java`, `Student.java`, `Gradebook.java`, and a `GradeFile.java` class that holds all the file code, then compile them together with `javac *.java`.
- Let the teacher record scores for several subjects, using an interface or a small `Subject` class.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own code. Every "no" is just a pointer to your next improvement.

1. Can I explain what every class and method does from its name alone?
2. Is there any way, from `main`, to give a student a score of 150, or an empty name? (The right answer is no.)
3. Does every error message tell the user what went wrong **and** what to do instead?
4. Did I try every case in "Testing your program," and did the program survive all of them?
5. If I delete `grades.csv`, does the program still start cleanly?
6. Are there any magic numbers, empty `catch` blocks, or Strings compared with `==` left in my code?
7. If I wanted to add a new menu option, would I know exactly where it goes, without touching the rest?
8. When I use my program, does it feel like a real tool someone could use?

If you answered yes to all eight, you've built a real, complete Java application. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good programmers become great ones.

## Stuck? A reference solution

Try to finish on your own first. Struggling with a problem, and then solving it, is exactly how the skill sticks. But if you're truly stuck on one part, or you've finished and want to compare, here's one complete solution. It's not the only right answer; if yours works and reads clearly, it's just as good.

::: details Show the reference solution
```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Main {
	static final Path SAVE_FILE = Path.of("grades.csv");

	public static void main(String[] args) {
		Scanner input = new Scanner(System.in);
		Gradebook gradebook = new Gradebook();
		loadGradebook(gradebook);

		boolean running = true;
		while (running) {
			printMenu();
			String choice = input.nextLine().trim();
			switch (choice) {
				case "1" -> addStudent(input, gradebook);
				case "2" -> recordScore(input, gradebook);
				case "3" -> gradebook.printReport();
				case "4" -> saveGradebook(gradebook);
				case "5" -> {
					saveGradebook(gradebook);
					running = false;
				}
				default -> System.out.println("Please choose a number from 1 to 5.");
			}
		}

		System.out.println("Goodbye!");
		input.close();
	}

	static void printMenu() {
		System.out.println();
		System.out.println("=== Student Grade Manager ===");
		System.out.println("1. Add a student");
		System.out.println("2. Record a score");
		System.out.println("3. Show the report");
		System.out.println("4. Save");
		System.out.println("5. Save and quit");
		System.out.print("Choose: ");
	}

	static void addStudent(Scanner input, Gradebook gradebook) {
		System.out.print("Student name: ");
		String name = input.nextLine().trim();
		try {
			gradebook.addStudent(new Student(name));
			System.out.println("Added " + name + ".");
		} catch (IllegalArgumentException e) {
			System.out.println("Couldn't add student: " + e.getMessage());
		}
	}

	static void recordScore(Scanner input, Gradebook gradebook) {
		System.out.print("Student name: ");
		Student student = gradebook.findStudent(input.nextLine().trim());
		if (student == null) {
			System.out.println("There's no student with that name.");
			return;
		}

		System.out.print("Score (0 to 100): ");
		try {
			int score = Integer.parseInt(input.nextLine().trim());
			student.addScore(score);
			System.out.println("Recorded " + score + " for " + student.getName() + ".");
		} catch (NumberFormatException e) {
			System.out.println("Please type a whole number, like 85.");
		} catch (IllegalArgumentException e) {
			System.out.println("Couldn't record score: " + e.getMessage());
		}
	}

	static void loadGradebook(Gradebook gradebook) {
		if (!Files.exists(SAVE_FILE)) {
			System.out.println("No saved grades yet. Starting fresh.");
			return;
		}

		try {
			for (String line : Files.readAllLines(SAVE_FILE)) {
				loadLine(gradebook, line);
			}
			System.out.println("Loaded " + gradebook.size() + " students from " + SAVE_FILE + ".");
		} catch (IOException e) {
			System.out.println("Couldn't read " + SAVE_FILE + ": " + e.getMessage());
		}
	}

	static void loadLine(Gradebook gradebook, String line) {
		if (line.isBlank()) {
			return;
		}

		String[] parts = line.split(",");
		try {
			Student student = new Student(parts[0].trim());
			for (int i = 1; i < parts.length; i++) {
				student.addScore(Integer.parseInt(parts[i].trim()));
			}
			gradebook.addStudent(student);
		} catch (IllegalArgumentException e) {
			// NumberFormatException is a child of IllegalArgumentException, so this catches both.
			System.out.println("Skipping bad line \"" + line + "\": " + e.getMessage());
		}
	}

	static void saveGradebook(Gradebook gradebook) {
		try {
			Files.write(SAVE_FILE, gradebook.toCsvLines());
			System.out.println("Saved " + gradebook.size() + " students to " + SAVE_FILE + ".");
		} catch (IOException e) {
			System.out.println("Couldn't save: " + e.getMessage());
		}
	}
}

class Student {
	static final int MIN_SCORE = 0;
	static final int MAX_SCORE = 100;

	private final String name;
	private final List<Integer> scores = new ArrayList<>();

	Student(String name) {
		if (name == null || name.isBlank()) {
			throw new IllegalArgumentException("the name can't be empty");
		}
		if (name.contains(",")) {
			throw new IllegalArgumentException("the name can't contain a comma");
		}
		this.name = name;
	}

	String getName() {
		return name;
	}

	int getScoreCount() {
		return scores.size();
	}

	void addScore(int score) {
		if (score < MIN_SCORE || score > MAX_SCORE) {
			throw new IllegalArgumentException("scores must be from " + MIN_SCORE + " to " + MAX_SCORE + ", got " + score);
		}
		scores.add(score);
	}

	double getAverage() {
		if (scores.isEmpty()) {
			return 0;
		}
		int total = 0;
		for (int score : scores) {
			total += score;
		}
		return (double) total / scores.size();
	}

	String getLetterGrade() {
		if (scores.isEmpty()) {
			return "-";
		}
		double average = getAverage();
		if (average >= 90) {
			return "A";
		} else if (average >= 80) {
			return "B";
		} else if (average >= 75) {
			return "C";
		}
		return "F";
	}

	String toCsvLine() {
		StringBuilder line = new StringBuilder(name);
		for (int score : scores) {
			line.append(",").append(score);
		}
		return line.toString();
	}

	@Override
	public String toString() {
		return String.format("%-14s %6d %8.1f %6s", name, getScoreCount(), getAverage(), getLetterGrade());
	}
}

class Gradebook {
	private final List<Student> students = new ArrayList<>();

	void addStudent(Student student) {
		if (findStudent(student.getName()) != null) {
			throw new IllegalArgumentException(student.getName() + " is already in the gradebook");
		}
		students.add(student);
	}

	Student findStudent(String name) {
		for (Student student : students) {
			if (student.getName().equalsIgnoreCase(name)) {
				return student;
			}
		}
		return null;
	}

	int size() {
		return students.size();
	}

	double getClassAverage() {
		double total = 0;
		int counted = 0;
		for (Student student : students) {
			if (student.getScoreCount() > 0) {
				total += student.getAverage();
				counted++;
			}
		}
		return counted == 0 ? 0 : total / counted;
	}

	Student getTopStudent() {
		Student top = null;
		for (Student student : students) {
			if (student.getScoreCount() > 0 && (top == null || student.getAverage() > top.getAverage())) {
				top = student;
			}
		}
		return top;
	}

	List<String> toCsvLines() {
		List<String> lines = new ArrayList<>();
		for (Student student : students) {
			lines.add(student.toCsvLine());
		}
		return lines;
	}

	void printReport() {
		if (students.isEmpty()) {
			System.out.println("No students yet. Add one with option 1.");
			return;
		}

		System.out.printf("%-14s %6s %8s %6s%n", "Name", "Scores", "Average", "Grade");
		for (Student student : students) {
			System.out.println(student);
		}

		System.out.printf("Class average: %.1f%n", getClassAverage());
		Student top = getTopStudent();
		if (top != null) {
			System.out.printf("Top student: %s (%.1f)%n", top.getName(), top.getAverage());
		}
	}
}
```
:::

## Check your understanding

<Quiz
	question="Why does the Student class throw an IllegalArgumentException for a score of 150, instead of just ignoring it?"
	:options="['Exceptions make programs faster', 'Java requires it for every setter', 'Ignoring it would not compile', 'So the mistake is noticed right where it happens, and the caller can decide how to tell the user']"
	:answer-index="3"
	explanation="Throwing makes the problem visible immediately. The menu code catches it and shows a message, and a bad score can never sneak into the data."
/>

<Quiz
	question="Why does the program read every answer with nextLine() and convert numbers with Integer.parseInt?"
	:options="['nextInt does not exist', 'It avoids the leftover newline problem that happens when nextInt is followed by nextLine', 'parseInt is faster than nextInt', 'Scanner cannot read numbers']"
	:answer-index="1"
	explanation="nextInt leaves the Enter key behind, which confuses the next nextLine. Reading whole lines and parsing them keeps every read consistent."
/>

<Quiz
	question="Loading grades.csv, one line reads Carlo,abc. What should a well-built loader do?"
	:options="['Crash with a NumberFormatException', 'Skip that line with a message and keep loading the rest', 'Delete the whole file', 'Load Carlo with a score of 0']"
	:answer-index="1"
	explanation="One bad line should not cost the teacher every other student. Catch the problem for that line, report it, and carry on."
/>

## Where you go from here

You've finished the Java track. Take a moment with that. You started with a program that printed one line, and you've just built an application with its own classes, rules, error handling, and saved data.

Java opens a lot of doors from here. Many developers go on to **Spring Boot**, the most popular way to build the server side of websites and apps in Java. **Android** development uses the same object-oriented ideas, often in Kotlin, a language that runs on the same JVM and works side by side with Java. And topics like **data structures and algorithms**, which power everything from search engines to maps, are taught in Java at many schools and universities.

Whichever way you go, the ideas you've learned here, types, methods, objects, exceptions, and the patience to read an error message calmly, travel with you into every language you learn next. Well done.
