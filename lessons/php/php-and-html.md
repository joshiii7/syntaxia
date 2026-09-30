---
title: "Mixing PHP and HTML: Tags, echo, and Templates"
description: "Drop PHP into an HTML page with <?php ?> tags, print values with echo and <?= ?>, build lists with loops, and escape text safely with htmlspecialchars."
---

# Mixing PHP and HTML

*A form letter is mostly fixed text with a few blanks. PHP fills in the blanks before anyone reads it.*

In [Your First PHP Script](/lessons/php/first-script), you ran a file that was pure PHP. But PHP was created for the web, and its most famous trick is something no other language on Syntaxia can do this easily: you can drop it straight into the middle of an HTML page.

If you took the [HTML track](/lessons/html/introduction), every page you built there was **static**: it showed the same thing to everyone, every time. By the end of this lesson, you'll be able to build pages that change: a greeting with the visitor's name, today's date, or a list that grows as data is added.

## A form letter

Imagine a school sending the same letter to 300 families. Nobody writes 300 letters. They write one template:

> Dear ______, your child ______ is enrolled in grade ______.

Then they fill in the blanks for each family and print the result. The families only ever see the finished letter, never the blanks.

A PHP page works exactly the same way:

- The **HTML** is the fixed text of the letter.
- The **PHP** fills in the blanks.
- The **server** runs the PHP and sends only the finished HTML to the browser.

That last point matters. Visitors never see your PHP code. If they choose **View Page Source** in their browser, all they find is plain HTML, with the blanks already filled in. You'll see exactly how that happens in [How PHP Runs](/lessons/php/how-php-runs).

## Switching into PHP and back

A PHP file can contain ordinary HTML. Anything between `<?php` and `?>` is PHP. Everything outside those tags is sent to the browser exactly as written:

```php
<h1>Welcome to the library</h1>
<p>Today is <?php echo date("l"); ?>.</p>
<p>Enjoy your visit!</p>
```

When this page runs on a Monday, the browser receives:

```html
<h1>Welcome to the library</h1>
<p>Today is Monday.</p>
<p>Enjoy your visit!</p>
```

`echo` prints whatever comes after it, and `date("l")` gives back the full name of today's day. (The `l` is a lowercase L, one of many letter codes `date` understands.) The result lands exactly where the PHP tag was, in the middle of the paragraph.

The file needs to end in `.php`, not `.html`, so the server knows it has blanks to fill in.

## The short echo tag: `<?= ?>`

Printing a single value inside HTML happens so often that PHP has a shortcut. `<?= $value ?>` means exactly the same as `<?php echo $value; ?>`:

```php
<?php $student = "Maria"; ?>
<p>Hello, <?php echo $student; ?>!</p>
<p>Hello, <?= $student ?>!</p>
```

```text
<p>Hello, Maria!</p>
<p>Hello, Maria!</p>
```

Both lines produce the same HTML. Most PHP templates use `<?= ?>` for printing values, because it's shorter and easier to read in the middle of a tag.

## Set up at the top, print below

A tidy PHP page keeps most of its logic in one block at the top, then uses small `<?= ?>` tags in the HTML below. It's the form letter again: gather the information first, then fill in the blanks.

```php
<?php
$school = "Rizal High School";
$studentCount = 1250;
$year = date("Y");
?>
<footer>
	<p><?= $school ?> has <?= $studentCount ?> students.</p>
	<p>&copy; <?= $year ?> <?= $school ?></p>
</footer>
```

When you read a page like this, the top tells you *what* information the page uses, and the HTML shows *where* it goes. Keep it that way. A page with PHP logic scattered across every line gets very hard to follow.

## Repeating HTML with a loop

Here's where PHP really starts to earn its keep. Say you have a list of classes, and you want an `<li>` for each one. Instead of typing every `<li>` by hand, loop through the list and let PHP write them:

```php
<?php $classes = ["Math", "Science", "History"]; ?>
<ul>
<?php foreach ($classes as $class): ?>
	<li><?= $class ?></li>
<?php endforeach; ?>
</ul>
```

```text
<ul>
	<li>Math</li>
	<li>Science</li>
	<li>History</li>
</ul>
```

`$classes` is an **array**, a list of values, and [Indexed Arrays](/lessons/php/arrays) covers arrays properly. For now, read the loop as "for each item in `$classes`, call it `$class`, and write out the HTML inside."

Notice the loop is written with a colon and `endforeach;` instead of curly braces. That's PHP's **alternative syntax**, and it exists for exactly this job. In a page full of HTML, a lonely `}` is hard to match with the line that opened it, but `endforeach;` says what it's closing. The same style works for `if`, which uses `if (...):`, `else:`, and `endif;`:

```php
<?php $isOpen = true; ?>
<?php if ($isOpen): ?>
	<p>The library is open.</p>
<?php else: ?>
	<p>Sorry, we're closed.</p>
<?php endif; ?>
```

```text
	<p>The library is open.</p>
```

Only the branch whose condition is true is sent to the browser. The other one simply doesn't exist in the finished page.

## Escaping text: `htmlspecialchars`

There's one habit you need from day one. Suppose a student's name comes from a form that anyone can type into, and someone types this as their name:

```text
<b>Ben</b>
```

If you print it with `<?= $name ?>`, the browser receives real HTML tags and makes the name bold. That's harmless here, but the same trick with a `<script>` tag could run someone else's JavaScript on your page. This kind of attack is called **cross-site scripting**, or **XSS**, and it's one of the most common security holes on the web.

The fix is `htmlspecialchars`. It turns the characters that HTML treats as special, like `<`, `>`, `&`, and quotes, into safe codes that display as plain text:

```php
<?php $name = "<b>Ben</b>"; ?>
<p><?= htmlspecialchars($name) ?></p>
```

```text
<p>&lt;b&gt;Ben&lt;/b&gt;</p>
```

The browser shows the text `<b>Ben</b>`, angle brackets and all, instead of making anything bold.

The rule of thumb: **any text that came from a user, a form, a file, or a database gets `htmlspecialchars` before it goes into HTML.** You'll build on this in [Validating and Escaping User Input](/lessons/php/validating-input) and [Security Essentials](/lessons/php/security-essentials).

## Files that are only PHP

When a file contains nothing but PHP, like a file of helper functions, leave out the closing `?>` at the end:

```php
<?php
$greeting = "Hello";
echo $greeting;
```

```text
Hello
```

It isn't an error to include it, but a stray space or blank line after a closing `?>` gets sent to the browser as output, and that can cause confusing bugs later. Leaving it off makes that impossible. Most PHP projects follow this rule.

## Try it

This page shows a small class roster. Some of it is fixed HTML, and some is filled in by PHP. Predict the exact HTML the server would send to the browser, line by line, before you check. (Hint: one of the student names contains a character that `htmlspecialchars` will change.)

<CodeEditor
	language="plaintext"
	label="PHP practice editor, roster.php"
	min-height="460px"
	:model-value="'&lt;?php\n$section = &quot;11-B&quot;;\n$adviser = &quot;Ms. Reyes&quot;;\n$students = [&quot;Maria&quot;, &quot;Ben&quot;, &quot;Carlo &amp; Dina&quot;];\n$isFull = count($students) &gt;= 30;\n?&gt;\n&lt;h1&gt;Section &lt;?= $section ?&gt;&lt;/h1&gt;\n&lt;p&gt;Adviser: &lt;?= htmlspecialchars($adviser) ?&gt;&lt;/p&gt;\n&lt;ul&gt;\n&lt;?php foreach ($students as $student): ?&gt;\n\t&lt;li&gt;&lt;?= htmlspecialchars($student) ?&gt;&lt;/li&gt;\n&lt;?php endforeach; ?&gt;\n&lt;/ul&gt;\n&lt;?php if ($isFull): ?&gt;\n&lt;p&gt;This section is full.&lt;/p&gt;\n&lt;?php else: ?&gt;\n&lt;p&gt;Seats left: &lt;?= 30 - count($students) ?&gt;&lt;/p&gt;\n&lt;?php endif; ?&gt;\n'"
/>

`count($students)` gives back how many items are in the list.

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save this as `roster.php` and run `php roster.php` in a terminal to see the HTML it produces.
:::

::: details Check your prediction
```text
<h1>Section 11-B</h1>
<p>Adviser: Ms. Reyes</p>
<ul>
	<li>Maria</li>
	<li>Ben</li>
	<li>Carlo &amp; Dina</li>
</ul>
<p>Seats left: 27</p>
```

The `&` in "Carlo & Dina" became `&amp;`, which the browser displays as a plain `&`. There are only 3 students, so `$isFull` is `false`, and only the "Seats left" paragraph is sent. None of the PHP itself appears in the output.
:::

## Try it yourself

1. Add a fourth student to the list. Which parts of the output change, and did you have to touch any of the HTML?
2. Change the limit from 30 to 3 in both places it appears. What gets sent to the browser now? Then think about why it's better to store the limit in one variable, like `$maxStudents`, instead of writing `30` twice.
3. Add a student named `<i>Eli</i>`. Predict what the `<li>` looks like in the output with `htmlspecialchars`, and what the browser would show if you removed it.

## Check your understanding

<Quiz
	question="What does a visitor see if they choose View Page Source on a PHP page?"
	:options="['Your PHP code, exactly as you wrote it', 'Only the finished HTML, with the PHP already run and replaced by its output', 'Nothing, PHP pages cannot be viewed', 'The HTML and the PHP side by side']"
	:answer-index="1"
	explanation="The server runs the PHP and sends only the result. The browser never receives your PHP code."
/>

<Quiz
	question="Which line prints the value of $name inside HTML?"
	:options="['&lt;?php $name ?&gt;', '&lt;? $name ?&gt;', '&lt;?= $name ?&gt;', '{{ $name }}']"
	:answer-index="2"
	explanation="&lt;?= $name ?&gt; is short for &lt;?php echo $name; ?&gt;. Without echo, the first option does nothing visible."
/>

<Quiz
	question="A visitor's comment will be shown on your page. What should you do before printing it into the HTML?"
	:options="['Pass it through htmlspecialchars', 'Nothing, text is always safe', 'Wrap it in a PHP tag', 'Print it with echo instead of &lt;?= ?&gt;']"
	:answer-index="0"
	explanation="htmlspecialchars turns characters like &lt; and &gt; into safe codes, so a comment containing HTML or a script tag is shown as plain text instead of running."
/>

## Up next

You've seen that the server runs PHP and sends back HTML. But what actually happens between someone clicking a link and your page appearing on their screen? That's [How PHP Runs: Requests and Responses](/lessons/php/how-php-runs).
