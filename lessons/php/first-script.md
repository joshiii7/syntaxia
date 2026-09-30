---
title: "Your First PHP Script: echo, Strings, and Comments Explained"
description: "Write and run your first PHP script: the <?php tag, echo, single and double quotes, new lines, comments, and the first error messages every beginner meets."
---

# Your First PHP Script

*Every PHP file starts by raising a hand: "PHP code starts here." Everything after that is instructions.*

In [Setting Up](/lessons/php/setting-up), you installed PHP and ran a small script. Now let's slow down, write one from scratch, and understand every character in it.

Here's the most famous first program in any language, written in PHP:

```php
<?php
echo "Hello, world!\n";
```

```text
Hello, world!
```

Two lines. Let's take them apart.

## Raising your hand: `<?php`

Picture a classroom where the teacher is reading a story aloud. Whenever a student raises their hand, the teacher stops and listens to them instead. When the student lowers their hand, the story carries on.

A PHP file works like that. PHP reads the file from top to bottom, and everything is ordinary text to be sent out as it is, **until** it reaches `<?php`. That's the raised hand: "PHP instructions start here."

- `<?php` starts PHP mode. It must be written exactly like that, with no space between `<?` and `php`.
- `?>` ends PHP mode, and goes back to sending text as it is.

That switching back and forth is the heart of [Mixing PHP and HTML](/lessons/php/php-and-html), coming up next. In a file that's **only** PHP, like the ones in this lesson, you leave out the closing `?>` altogether. It's the recommended style, since it avoids accidentally sending stray blank lines after it.

## `echo`: send out some text

```php
echo "Hello, world!\n";
```

- `echo` sends text out: to the terminal when you run `php index.php`, or into the page when a browser visits.
- `"Hello, world!\n"` is the text to send, called a **string**.
- The **semicolon** `;` ends the statement, like a period ends a sentence. Every PHP statement needs one.

You can echo several things at once, separated by commas, and they're sent one after another with nothing in between:

```php
<?php
echo "Hello", ", ", "world", "!\n";
```

```text
Hello, world!
```

## New lines: `\n`

`echo` doesn't start a new line on its own. Two `echo`s send their text right next to each other:

```php
<?php
echo "First";
echo "Second";
```

```text
FirstSecond
```

To start a new line in the terminal, put `\n` inside the string where you want the line to break. That backslash pair is called an **escape sequence**: the backslash means "the next character is special." Some useful ones:

| Write | To get |
|---|---|
| `\n` | a new line |
| `\t` | a tab |
| `\"` | a double quote inside a double-quoted string |
| `\\` | a backslash itself |

When PHP builds a web page instead of printing in the terminal, `\n` only breaks the line in the HTML source. The browser treats it like a space, so for a visible line break on the page, you'd use HTML, like `<br>` or a new `<p>`.

## Single and double quotes

PHP accepts strings in single or double quotes, but they **don't** behave the same:

```php
<?php
$name = "Maria";
echo "Hello, $name!\n";
echo 'Hello, $name!\n';
```

```text
Hello, Maria!
Hello, $name!\n
```

- In **double quotes**, PHP looks inside the string: variables like `$name` are replaced by their values, and escape sequences like `\n` become new lines. This is called **interpolation**.
- In **single quotes**, what you see is what you get: `$name` and `\n` are just ordinary characters.

(`$name = "Maria";` stores a value in a **variable**. Every PHP variable name starts with `$`. You'll learn all about them in [Variables and Constants](/lessons/php/variables).)

Use double quotes when you want a variable or `\n` inside, and single quotes for plain, fixed text. A handy side effect: an apostrophe is fine inside double quotes, and a double quote is fine inside single quotes:

```php
<?php
echo "It's a sunny day.\n";
echo 'She said "hi" to me.';
```

```text
It's a sunny day.
She said "hi" to me.
```

## Comments

PHP ignores comments completely. There are three ways to write them:

```php
<?php
// A one-line comment.
# Another way to write a one-line comment.

/*
	A comment that
	spans several lines.
*/
echo "Only this line does anything.\n";
```

```text
Only this line does anything.
```

`//` is the most common for short notes. Use comments to explain *why* your code does something, not to repeat what it obviously does.

## Capital letters

PHP is a little unusual here. Its keywords, like `echo`, don't care about capital letters, so `Echo` and `ECHO` both work. But **variable names do**: `$name` and `$Name` are two different variables. Always write keywords in lowercase, and keep your variable names exactly consistent.

```php
<?php
$name = "Maria";
echo $Name;
```

```text
Warning: Undefined variable $Name in C:\Users\maria\php-practice\index.php on line 3
```

PHP printed a **warning** instead of the name, because `$Name` with a capital N was never created. The file name in the message will be wherever your own file is saved.

## The mistakes everyone makes

Here are the errors almost every beginner hits in their first week.

**A missing semicolon.**

```php
<?php
echo "Hello, world!"
echo "Bye";
// error: Parse error: syntax error, unexpected token "echo", expecting "," or ";"
```

PHP expected a `;` (or a comma) to end the first statement, and found the next `echo` instead. Notice that the error points to line 3, the line *after* the missing semicolon, because that's where PHP realized something was wrong. When an error doesn't make sense on its line, check the line above.

**A missing closing quote.**

```php
<?php
echo "Hello, world!;
// error: Parse error: syntax error, unexpected end of file
```

PHP kept reading the string to the end of the file, looking for the closing `"`. The rest of the message is confusing, but "unexpected end of file" is the clue: something was opened and never closed.

**A space inside the tag.** `<? php` with a space isn't a PHP tag, so PHP doesn't recognize the code at all, and sends it out as plain text instead of running it.

A **parse error** means PHP couldn't even read your file, so *nothing* in it runs. A **warning**, like the undefined variable above, means PHP carried on, but something probably isn't right. Take both seriously.

## Try it

This script prints a small student ID card. Predict exactly what it prints, including where each line breaks.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="280px"
	:model-value="'&lt;?php\n// A tiny school ID card.\n$name = &quot;Maria Santos&quot;;\n$grade = 11;\n\necho &quot;=== STUDENT ID ===\\n&quot;;\necho &quot;Name: $name\\n&quot;;\necho \'Grade: $grade\', &quot;\\n&quot;;\necho &quot;Grade: &quot;, $grade, &quot;\\n&quot;;\necho &quot;Motto: \\&quot;Measure twice, cut once.\\&quot;\\n&quot;;\necho &quot;Clubs: &quot;;\necho &quot;Chess &amp; Robotics\\n&quot;;\necho &quot;==================\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
=== STUDENT ID ===
Name: Maria Santos
Grade: $grade
Grade: 11
Motto: "Measure twice, cut once."
Clubs: Chess & Robotics
==================
```

The single-quoted `'Grade: $grade'` doesn't replace the variable, so it's printed literally. The next line gets it right by passing `$grade` as a separate item. And `Clubs: ` has no `\n`, so the next `echo` continues on the same line.
:::

## Try it yourself

1. Change the name and grade to your own, and add a line that prints your favorite subject.
2. Remove the semicolon from any line and run the script. Which line does the error point to?
3. Rewrite the single-quoted Grade line so it prints the actual grade, using double quotes.

## Check your understanding

<Quiz
	question="What does echo &#39;Hi $name&#39;; print, if $name is Ben?"
	:options="['Hi $name', 'Hi Ben', 'An error', 'Hi']"
	:answer-index="0"
	explanation="Single-quoted strings don't replace variables. Use double quotes, &quot;Hi $name&quot;, to get Hi Ben."
/>

<Quiz
	question="How do you end a statement in PHP?"
	:options="['With a new line', 'With a period', 'With a semicolon', 'With a colon']"
	:answer-index="2"
	explanation="Every PHP statement ends with a semicolon. A missing one is the most common parse error."
/>

<Quiz
	question="Why leave out the closing ?&gt; in a file that is only PHP?"
	:options="['It makes PHP faster', 'Closing tags are not allowed in PHP 8', 'It is required for echo to work', 'To avoid accidentally sending stray blank lines or spaces after it']"
	:answer-index="3"
	explanation="Anything after ?&gt;, even a blank line, is sent out as text. Leaving it off makes that impossible."
/>

## Up next

You can switch into PHP and send out text. Next comes PHP's most famous trick: putting it right in the middle of an HTML page, in [Mixing PHP and HTML](/lessons/php/php-and-html).
