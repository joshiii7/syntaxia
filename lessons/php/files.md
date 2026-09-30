---
title: "PHP File Handling: Reading and Writing Files and CSV"
description: "Save and load data with PHP files: file_put_contents and file_get_contents, appending lines, reading a file line by line, checking files exist, and reading and writing CSV."
---

# Reading and Writing Files

*A diary remembers what happened yesterday, even though you slept in between. Files are your program's diary.*

In [How PHP Runs](/lessons/php/how-php-runs), you learned that PHP forgets everything after each request. Sessions remember one visitor for a while. But to remember things for **everyone**, and for good, like every message in a guestbook, you need to save them somewhere lasting. The simplest place is a file.

## Writing and reading a whole file

Two functions do most of the work:

```php
<?php
file_put_contents("note.txt", "Buy rice and eggs.\n");

$text = file_get_contents("note.txt");
echo "The note says: $text";
```

```text
The note says: Buy rice and eggs.
```

- `file_put_contents(file, text)` writes the text to the file. It creates the file if it's missing, and **replaces** everything in it if it exists.
- `file_get_contents(file)` reads the whole file and returns it as a string.

A path like `"note.txt"` is looked up from where PHP is running. As in [Splitting Code with include and require](/lessons/php/include-and-require), `__DIR__ . "/note.txt"` is safer in real projects, because it always means "next to this PHP file."

## Adding to the end

To add to a file instead of replacing it, pass the `FILE_APPEND` flag:

```php
<?php
file_put_contents("log.txt", "Started\n");
file_put_contents("log.txt", "Saved order 1\n", FILE_APPEND);
file_put_contents("log.txt", "Saved order 2\n", FILE_APPEND);

echo file_get_contents("log.txt");
```

```text
Started
Saved order 1
Saved order 2
```

On a busy website, two visitors might write at the same moment, and their lines could get mixed up. Adding `LOCK_EX` makes each write wait its turn: `FILE_APPEND | LOCK_EX`.

## Reading line by line

`file()` reads a file into an **array**, one item per line. Add two flags to drop the line endings and skip empty lines:

```php
<?php
file_put_contents("shopping.txt", "rice\neggs\n\nmangoes\n");

$items = file("shopping.txt", FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
echo count($items) . " items\n";
foreach ($items as $i => $item) {
    echo ($i + 1) . ". $item\n";
}
```

```text
3 items
1. rice
2. eggs
3. mangoes
```

For very large files, reading everything at once uses a lot of memory. Then you'd open the file and read one line at a time:

```php
<?php
file_put_contents("big.txt", "line one\nline two\n");

$handle = fopen("big.txt", "r");
while (($line = fgets($handle)) !== false) {
    echo "Read: " . trim($line) . "\n";
}
fclose($handle);
```

```text
Read: line one
Read: line two
```

- `fopen(file, "r")` opens a file and gives you a **handle**, a connection to it. `"r"` means read; `"w"` means write (replacing), and `"a"` means append.
- `fgets` reads the next line, and returns `false` at the end of the file.
- `fclose` closes the file when you're done.

## When the file isn't there

Reading a file that doesn't exist gives a warning, and returns `false`:

```php
<?php
$text = file_get_contents("missing.txt");
// error: Warning: file_get_contents(missing.txt): Failed to open stream: No such file or directory
```

Check first with `file_exists()`:

```php
<?php
$file = "settings.txt";
if (file_exists($file)) {
    echo file_get_contents($file);
} else {
    echo "No settings saved yet.\n";
}
```

```text
No settings saved yet.
```

Other useful checks and actions: `is_file()`, `is_dir()`, `filesize()`, `unlink()` to delete a file, and `mkdir()` to make a folder.

## CSV: spreadsheet-friendly data

A **CSV** file (comma-separated values) stores a table as text: one row per line, with commas between the values. Spreadsheet programs like Excel and Google Sheets open it directly. PHP reads and writes it with `fputcsv` and `fgetcsv`:

```php
<?php
$students = [
    ["name", "grade", "note"],
    ["Maria", 92, "Top of class"],
    ["Ben", 85, "Great, improving"],
];

$handle = fopen("grades.csv", "w");
foreach ($students as $row) {
    fputcsv($handle, $row, escape: "");
}
fclose($handle);

echo file_get_contents("grades.csv");
```

```text
name,grade,note
Maria,92,"Top of class"
Ben,85,"Great, improving"
```

`fputcsv` adds quotes where needed, so the comma inside `"Great, improving"` doesn't split it into two columns. Reading it back:

```php
<?php
$handle = fopen("grades.csv", "r");
$header = fgetcsv($handle, escape: "");
while (($row = fgetcsv($handle, escape: "")) !== false) {
    echo "$row[0] got $row[1]\n";
}
fclose($handle);
```

```text
Maria got 92
Ben got 85
```

The first `fgetcsv` call reads the header row into `$header`, so the loop starts with the real data.

What's the `escape: ""`? The CSV functions have an old, non-standard way of treating backslashes, and PHP 8.4 and later print a "Deprecated" notice unless you choose. An empty string turns that old behavior off, which is what you want. Always include it.

Every value `fgetcsv` reads is a **string**, even `"92"`, just like form data.

## Files and web security

Files on a web server need care:

- **Keep data files out of the public folder.** If `grades.csv` sits next to your pages, anyone can download it at `yoursite.com/grades.csv`. Put data one folder up, or in a folder the web server doesn't serve.
- **Never build a file path from user input directly.** A visitor asking for `?file=../../passwords.txt` could read files you never meant to share. If a visitor chooses a file, check their choice against a list of allowed names.
- **Escape file contents** with `htmlspecialchars` when you show them in a page, since they may contain whatever someone typed.

For anything beyond simple logs and small lists, a database is the better choice. It handles many visitors at once, and searches quickly. That's coming up in [Databases with PDO](/lessons/php/databases-with-pdo).

## Try it

A guestbook saves messages to a CSV file, then shows them. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\n$file = &quot;guestbook.csv&quot;;\nfile_put_contents($file, &quot;&quot;);\n\nfunction addEntry(string $file, string $name, string $message): void\n{\n    $handle = fopen($file, &quot;a&quot;);\n    fputcsv($handle, [$name, $message, date(&quot;Y&quot;)], escape: &quot;&quot;);\n    fclose($handle);\n}\n\naddEntry($file, &quot;Maria&quot;, &quot;Lovely site!&quot;);\naddEntry($file, &quot;Ben&quot;, &quot;Hello, from Cebu&quot;);\naddEntry($file, &quot;Joy&quot;, &quot;See you soon&quot;);\n\n$lines = file($file, FILE_IGNORE_NEW_LINES);\necho &quot;Entries: &quot; . count($lines) . &quot;\\n&quot;;\necho &quot;Second line in the file: &quot; . $lines[1] . &quot;\\n&quot;;\n\n$handle = fopen($file, &quot;r&quot;);\nwhile (($row = fgetcsv($handle, escape: &quot;&quot;)) !== false) {\n    [$name, $message] = $row;\n    echo &quot;- $name wrote: $message\\n&quot;;\n}\nfclose($handle);\necho file_exists(&quot;missing.csv&quot;) ? &quot;found\\n&quot; : &quot;no missing.csv\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Entries: 3
Second line in the file: Ben,"Hello, from Cebu",2026
- Maria wrote: Lovely site!
- Ben wrote: Hello, from Cebu
- Joy wrote: See you soon
no missing.csv
```

The first `file_put_contents` empties the file, so every run starts fresh. `"a"` opens it for appending, one row per entry, with today's year added. Ben's message has a comma, so `fputcsv` wraps it in quotes in the file, and `fgetcsv` removes them again when reading. `[$name, $message] = $row;` unpacks the first two values of each row. (Your year may differ.)
:::

## Try it yourself

1. Remove the `file_put_contents($file, "");` line and run the script three times. How many entries are there now?
2. Add a function `countEntries(string $file): int` that returns how many entries the guestbook has, and returns 0 if the file doesn't exist.
3. Write a script that reads `grades.csv` from this lesson and prints the class average.

## Check your understanding

<Quiz
	question="What does file_put_contents(&quot;a.txt&quot;, &quot;hi&quot;) do if a.txt already has text in it?"
	:options="['Adds hi to the end', 'Replaces everything in the file with hi', 'Gives an error', 'Does nothing']"
	:answer-index="1"
	explanation="Without FILE_APPEND, file_put_contents replaces the file's contents. Add FILE_APPEND to add to the end."
/>

<Quiz
	question="Why shouldn't a data file sit in your website's public folder?"
	:options="['PHP cannot read it there', 'It makes the site slower', 'Files there are deleted every day', 'Anyone could download it by typing its address']"
	:answer-index="3"
	explanation="The web server sends any file in the public folder to whoever asks for it. Keep data files outside it."
/>

<Quiz
	question="What does fgets return when there are no more lines?"
	:options="['false', 'An empty string', 'null', '0']"
	:answer-index="0"
	explanation="fgets returns false at the end of the file, which is why loops check !== false."
/>

## Up next

CSV is great for tables, but what about nested data, like a list of orders where each order has its own list of items? For that, there's the format every web API speaks: [Working with JSON](/lessons/php/json).
