---
title: "Java File I/O: Read and Write Text Files"
description: "Save and load data in Java by writing text files and reading them back line by line, and handle missing files and other errors safely and clearly."
---

# Reading and Writing Files

*A whiteboard is wiped clean at the end of every class. A notebook is still there tomorrow.*

Every program you've written so far has had the memory of a whiteboard. Variables, arrays, ArrayLists, objects: they all live in the computer's memory while the program runs, and the moment it ends, everything is wiped. Run it again, and it starts from nothing.

Real programs remember. A gradebook keeps last week's grades. A game keeps your high score. To do that, a program has to save its data somewhere that lasts: a **file**.

Working with files is called **file I/O**, short for **input/output**: reading data in from a file, and writing data out to one.

## Whiteboards and notebooks

During class, a teacher writes on the whiteboard. It's fast and easy to change, but it gets wiped at the end of the day. Anything worth keeping gets copied into a notebook, which is slower to write in, but still there next week.

Memory is the whiteboard. A file is the notebook. Your program works in memory, and **saves** to a file when something needs to last, then **loads** it back the next time it runs.

This lesson sticks to **text files**: plain files, like `.txt` or `.csv`, that you could also open in any text editor. That makes them easy to check while you're learning.

## Paths and the `Files` class

Modern Java handles files with two tools from the `java.nio.file` package:

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;
```

- A **`Path`** is the location of a file, like `grades.txt` or `data/grades.txt`. Create one with `Path.of("grades.txt")`.
- **`Files`** is a class full of static methods (like the `Math` methods from [static and this](/lessons/java/static-and-this)) that do the actual reading and writing.

A plain file name like `grades.txt` is a **relative path**: it's found in the folder your program was started from. If you run your program from a terminal in your `java-practice` folder, that's where the file will appear. If you use your editor's Run button, it's usually the project's main folder.

## Writing a file

The simplest way to save text is `Files.writeString`:

```java
Path file = Path.of("note.txt");
Files.writeString(file, "Remember to study for the quiz!\n");
```

That creates `note.txt` if it doesn't exist, and **replaces everything in it** if it does. Be careful with that: writing to an existing file wipes out what was there.

To save a whole list of lines at once, `Files.write` takes a list and puts each item on its own line:

```java
ArrayList<String> lines = new ArrayList<>();
lines.add("Maria,91");
lines.add("Ben,84");
lines.add("Carlo,95");

Files.write(Path.of("grades.txt"), lines);
```

To **add** to the end of a file instead of replacing it, pass one more argument, `StandardOpenOption.APPEND` (from `java.nio.file` too). `CREATE` makes the file first if it doesn't exist yet:

```java
Files.writeString(Path.of("log.txt"), "Program started\n", StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

## Reading a file

`Files.readAllLines` reads a whole text file and gives you an ArrayList-style list with one String per line:

```java
List<String> lines = Files.readAllLines(Path.of("grades.txt"));

for (String line : lines) {
	System.out.println(line);
}
```

`List` here is the interface you met in [Interfaces](/lessons/java/interfaces). It works just like the `ArrayList` you already know: `size()`, `get(i)`, and for-each loops. Import it from `java.util`.

For a short file, `Files.readString(path)` gives you the whole thing as one String instead.

## Turning lines back into data

A file only holds text. To get your data back, you have to take each line apart, the reverse of how you saved it. The format above, with values separated by commas, is called **CSV** (comma-separated values), and it's the simplest common way to save rows of data:

```java
for (String line : lines) {
	String[] parts = line.split(",");
	String name = parts[0];
	int score = Integer.parseInt(parts[1]);
	System.out.println(name + " scored " + score);
}
```

`split(",")` cuts the line at each comma, giving you an array of the pieces. Then `Integer.parseInt` turns the score text back into an `int`, just like reading user input.

Files can contain mistakes, especially ones people edit by hand. A line might be blank, or have letters where a number should be. That's exactly what [Exceptions](/lessons/java/exceptions) are for: wrap the parsing in `try`/`catch` and skip bad lines with a warning, instead of crashing on them.

## Files can fail: `IOException`

Lots of things can go wrong with files, and none of them are bugs in your code: the file doesn't exist, it's open in another program, the disk is full, you don't have permission. So every `Files` method can throw an **`IOException`**.

`IOException` is a **checked** exception, as you saw at the end of the last lesson. The compiler won't let you ignore it:

```java
List<String> lines = Files.readAllLines(Path.of("grades.txt"));
// error: unreported exception IOException; must be caught or declared to be thrown
```

You have two choices.

**Catch it,** and respond sensibly:

```java
try {
	List<String> lines = Files.readAllLines(Path.of("grades.txt"));
	System.out.println("Loaded " + lines.size() + " students.");
} catch (IOException e) {
	System.out.println("Couldn't read grades.txt: " + e.getMessage());
}
```

**Or declare it** with `throws`, and let the caller deal with it:

```java
static List<String> loadGrades() throws IOException {
	return Files.readAllLines(Path.of("grades.txt"));
}
```

A good pattern is to declare `throws IOException` on small helper methods, and catch it in one place, higher up, where you can tell the user what happened.

You can also check first, with `Files.exists(path)`. That's handy for friendly messages like "No saved data yet, starting fresh." But keep the `try`/`catch` anyway: a file can exist and still fail to open.

## Reading line by line, and closing files

`readAllLines` loads the entire file into memory at once. That's perfect for the small files in this track. For very large files, like a log with millions of lines, you'd read one line at a time instead, with a `BufferedReader`:

```java
try (BufferedReader reader = Files.newBufferedReader(Path.of("grades.txt"))) {
	String line;
	while ((line = reader.readLine()) != null) {
		System.out.println(line);
	}
} catch (IOException e) {
	System.out.println("Couldn't read the file: " + e.getMessage());
}
```

Two new things here:

- `reader.readLine()` gives back the next line, or `null` when there are no lines left. The `while` condition reads a line and checks it in one step.
- The parentheses after `try` are **try-with-resources**. Anything opened there is **closed automatically** when the block ends, whether it finished normally or threw an exception. An open file is like a borrowed library book: other programs may be waiting for it, so you must always give it back. Try-with-resources makes sure you do, without writing a `finally` block yourself.

`Files.writeString`, `Files.write`, and `Files.readAllLines` open and close the file for you, which is one more reason they're a good place to start.

## Try it

This program saves a small gradebook to a CSV file, adds a late entry, then loads the file back, skipping a broken line, and prints a summary. It finishes by trying to read a file that doesn't exist. Predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="760px"
	:model-value="'import java.io.IOException;\nimport java.nio.file.Files;\nimport java.nio.file.Path;\nimport java.nio.file.StandardOpenOption;\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tPath file = Path.of(&quot;grades.csv&quot;);\n\n\t\ttry {\n\t\t\tList&lt;String&gt; rows = new ArrayList&lt;&gt;();\n\t\t\trows.add(&quot;Maria,91&quot;);\n\t\t\trows.add(&quot;Ben,eighty&quot;);\n\t\t\trows.add(&quot;Carlo,95&quot;);\n\t\t\tFiles.write(file, rows);\n\t\t\tFiles.writeString(file, &quot;Dina,78\\n&quot;, StandardOpenOption.APPEND);\n\t\t\tSystem.out.println(&quot;Saved &quot; + (rows.size() + 1) + &quot; rows to &quot; + file);\n\n\t\t\tList&lt;String&gt; lines = Files.readAllLines(file);\n\t\t\tint total = 0;\n\t\t\tint count = 0;\n\t\t\tfor (String line : lines) {\n\t\t\t\tString[] parts = line.split(&quot;,&quot;);\n\t\t\t\ttry {\n\t\t\t\t\tint score = Integer.parseInt(parts[1]);\n\t\t\t\t\ttotal += score;\n\t\t\t\t\tcount++;\n\t\t\t\t\tSystem.out.println(&quot;  &quot; + parts[0] + &quot;: &quot; + score);\n\t\t\t\t} catch (NumberFormatException e) {\n\t\t\t\t\tSystem.out.println(&quot;  Skipping bad line: &quot; + line);\n\t\t\t\t}\n\t\t\t}\n\t\t\tSystem.out.println(&quot;Class average: &quot; + (double) total / count);\n\t\t} catch (IOException e) {\n\t\t\tSystem.out.println(&quot;File problem: &quot; + e.getMessage());\n\t\t}\n\n\t\ttry {\n\t\t\tFiles.readAllLines(Path.of(&quot;missing.csv&quot;));\n\t\t} catch (IOException e) {\n\t\t\tSystem.out.println(&quot;Couldn\'t load missing.csv (&quot; + e.getClass().getSimpleName() + &quot;)&quot;);\n\t\t}\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`. Then look in the same folder: a new `grades.csv` file will be there. Open it in your editor to see exactly what was saved.
:::

::: details Check your prediction
```text
Saved 4 rows to grades.csv
  Maria: 91
  Skipping bad line: Ben,eighty
  Carlo: 95
  Dina: 78
Class average: 88.0
Couldn't load missing.csv (NoSuchFileException)
```

`Files.write` created the file with three lines, and the `APPEND` write added Dina to the end instead of replacing everything. Ben's line has `eighty` instead of a number, so the inner `catch` skips just that line and the loop carries on. The missing file throws a `NoSuchFileException`, which is a kind of `IOException`, so the second `catch` handles it.
:::

## Try it yourself

1. Run the program twice on your computer. Does `grades.csv` end up with Dina listed twice? Why or why not? (Hint: what does `Files.write` do to an existing file?)
2. Open `grades.csv` in your editor, fix Ben's line to `Ben,80`, and write a second, small program that only reads the file and prints the average.
3. Add a blank line to the middle of `grades.csv` by hand, then run your reading program. Which exception happens, and how would you skip blank lines? (Hint: `line.isBlank()`.)

## Check your understanding

<Quiz
	question="What does Files.writeString(path, text) do if the file already exists?"
	:options="['Replaces everything in the file with the new text', 'Adds the text to the end', 'Throws an exception', 'Asks the user first']"
	:answer-index="0"
	explanation="By default, writing replaces the file's contents. Pass StandardOpenOption.APPEND to add to the end instead."
/>

<Quiz
	question="Why does the compiler insist you handle IOException?"
	:options="['Because file code is always buggy', 'It is not required, it is optional', 'It is a checked exception for problems outside your control, like a missing file', 'Because files can only be read once']"
	:answer-index="2"
	explanation="Checked exceptions describe problems a program should always plan for. You must either catch IOException or declare it with throws."
/>

<Quiz
	question="What is the main benefit of try-with-resources, like try (BufferedReader reader = ...) { }?"
	:options="['It makes reading faster', 'The reader is closed automatically, even if an exception happens', 'It removes the need to catch IOException', 'It reads the whole file at once']"
	:answer-index="1"
	explanation="Anything opened in the try parentheses is closed automatically when the block ends, whether it finished normally or not."
/>

## Up next

That's the Errors and Files chapter done. You can find bugs, handle problems gracefully, and make your programs remember. Before the final project, one last lesson collects the habits that make Java code easy to read and hard to break: [Best Practices and Common Mistakes](/lessons/java/best-practices).
