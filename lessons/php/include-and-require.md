---
title: "PHP include and require: Splitting Code Across Files"
description: "Split PHP code into several files with include, require, include_once, and require_once, build paths safely with __DIR__, and reuse a header and footer on every page."
---

# Splitting Code with include and require

*A cookbook doesn't print the recipe for pie crust inside every pie recipe. It says "see page 12." include and require are PHP's "see page 12."*

As your programs grow, one file gets long and hard to find your way around. And on a website, many pages share the same pieces: the same header, the same footer, the same helper functions. Copying those into every page means fixing every copy whenever something changes.

PHP lets you put shared code in its own file, and pull it in wherever you need it.

## Pulling in a file

Say your project has two files. A file of helpers:

```php
<?php
// includes/helpers.php
declare(strict_types=1);

const SHOP_NAME = "Ate Lorna's Snacks";

function formatPesos(float $amount): string {
    return "PHP " . number_format($amount, 2);
}
```

A header, which prints the shop's name:

```php
<?php
// includes/header.php
echo "=== " . SHOP_NAME . " ===\n";
```

And the main file, which uses both:

```php
<?php
// index.php
declare(strict_types=1);

require __DIR__ . "/includes/helpers.php";

include __DIR__ . "/includes/header.php";
echo "Turon: " . formatPesos(25) . "\n";
echo "Banana cue: " . formatPesos(20) . "\n";
```

Running `php index.php` prints:

```text
=== Ate Lorna's Snacks ===
Turon: PHP 25.00
Banana cue: PHP 20.00
```

When PHP reaches a `require` or `include` line, it runs the other file right there, as if its code were pasted in at that spot. Functions and constants defined in it are then available to the rest of `index.php`, and anything it echoes appears in the output at that point.

The folder structure looks like this:

```text
php-practice/
├── index.php
└── includes/
    ├── header.php
    └── helpers.php
```

Putting shared files in a folder like `includes/` keeps them apart from the pages people actually visit.

## Building the path with `__DIR__`

`__DIR__` is a special constant that holds the folder of the **current file**. `__DIR__ . "/includes/helpers.php"` builds the full path from there.

Why not just write `"includes/helpers.php"`? A path like that is looked up from wherever PHP happens to be running, which isn't always the folder your file is in, especially once files include other files from different folders. Starting from `__DIR__` always points to the right place. Make it a habit.

## include vs require

Both pull in a file. The difference is what happens when the file **isn't there**:

- `include` gives a **warning** and carries on without it.
- `require` stops the script with a **fatal error**.

```php
<?php
include "includes/footer.php";
echo "Still running after include.\n";
require "includes/footer.php";
echo "This line never runs.\n";
```

With no `footer.php` in the folder, that prints (with your own folder in place of this one):

```text
Warning: include(includes/footer.php): Failed to open stream: No such file or directory in C:\Users\maria\php-practice\index.php on line 2

Warning: include(): Failed opening 'includes/footer.php' for inclusion (include_path='.;C:\php\pear') in C:\Users\maria\php-practice\index.php on line 2
Still running after include.

Warning: require(includes/footer.php): Failed to open stream: No such file or directory in C:\Users\maria\php-practice\index.php on line 4

Fatal error: Uncaught Error: Failed opening required 'includes/footer.php' (include_path='.;C:\php\pear') in C:\Users\maria\php-practice\index.php:4
Stack trace:
#0 {main}
  thrown in C:\Users\maria\php-practice\index.php on line 4
```

(The `include_path` part lists the folders PHP searches, and differs from computer to computer.)

Which to use? Ask: "can the page work without this file?"

- Your functions, settings, or database connection: no. Use `require`, because running on without them would only cause confusing errors further down.
- An optional extra, like a seasonal banner: maybe. `include` lets the page carry on.

In practice, most code uses `require`.

## Only once: require_once

Including the same file twice runs it twice. For a file that defines functions, that's an error, since a function can't be defined twice:

```php
<?php
require __DIR__ . "/includes/helpers.php";
require __DIR__ . "/includes/helpers.php";
// error: Cannot redeclare function formatPesos()
```

In a big project, it's easy for two files to both need the same helpers. `require_once` (and `include_once`) solve it: PHP remembers which files it has already loaded, and skips any repeats:

```php
<?php
require_once __DIR__ . "/includes/helpers.php";
require_once __DIR__ . "/includes/helpers.php";
echo formatPesos(1500), "\n";
```

```text
PHP 1,500.00
```

A good rule: use `require_once` for files that **define** things (functions, constants, classes), and plain `include` or `require` for files that **output** something you might want more than once, like a table row template.

## A file can return a value

An included file can also `return` a value, like a function. That's a neat way to keep settings in their own file:

```php
<?php
// config.php
return "2026-10-15";
```

```php
<?php
// index.php
$eventDate = require __DIR__ . "/config.php";
echo "Event date: $eventDate\n";
```

```text
Event date: 2026-10-15
```

Once you know arrays, a config file usually returns a whole set of settings at once.

## Shared pages on a website

This is how many PHP websites share their layout. Every page starts with the same header and ends with the same footer:

```php
<?php require __DIR__ . "/includes/header.php"; ?>
<h1>About us</h1>
<p>We've been making turon since 1998.</p>
<?php require __DIR__ . "/includes/footer.php"; ?>
```

Change the navigation menu in `header.php` once, and it changes on every page.

## Try it

This project has an `includes/prices.php` file:

```php
<?php
// includes/prices.php
declare(strict_types=1);

const DELIVERY_FEE = 50;

function lineTotal(int $qty, float $price): float {
    return $qty * $price;
}

echo "(prices.php loaded)\n";
```

And an `includes/footer.php` file, which prints `Thank you for ordering!`. There's **no** `banner.php`. Predict what `index.php` prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="320px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nrequire_once __DIR__ . &quot;/includes/prices.php&quot;;\nrequire_once __DIR__ . &quot;/includes/prices.php&quot;;\n\n$total = lineTotal(3, 25) + lineTotal(2, 40) + DELIVERY_FEE;\necho &quot;Total: $total\\n&quot;;\n\ninclude __DIR__ . &quot;/includes/banner.php&quot;;\ninclude __DIR__ . &quot;/includes/footer.php&quot;;\ninclude __DIR__ . &quot;/includes/footer.php&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon, but this example needs several files, so it's best tried on your own computer (see [Setting Up](/lessons/php/setting-up)). Make an `includes` folder, save the two files in it, save this as `index.php`, and run `php index.php`.
:::

::: details Check your prediction
```text
(prices.php loaded)
Total: 205

Warning: include(C:\Users\maria\php-practice/includes/banner.php): Failed to open stream: No such file or directory in C:\Users\maria\php-practice\index.php on line 10

Warning: include(): Failed opening 'C:\Users\maria\php-practice/includes/banner.php' for inclusion (include_path='.;C:\php\pear') in C:\Users\maria\php-practice\index.php on line 10
Thank you for ordering!
Thank you for ordering!
```

`require_once` loads `prices.php` only once, so its message appears once. The total is 75 + 80 + 50. The missing banner only causes warnings, because it's an `include`, and the script carries on. Plain `include` runs `footer.php` twice, so the thanks appears twice. (On Windows, the path mixes `\` and `/`; that's normal, and it still works.)
:::

## Try it yourself

1. Change the two `require_once` lines to plain `require`. What happens, and why?
2. Change the banner line to `require`. Which lines still print?
3. Create the missing `includes/banner.php` so it prints `** Free delivery on Fridays! **`, and run it again.

## Check your understanding

<Quiz
	question="What happens when a file loaded with include doesn't exist?"
	:options="['PHP creates the file', 'The script stops with a fatal error', 'PHP shows a warning and carries on', 'Nothing at all']"
	:answer-index="2"
	explanation="include warns and carries on. require stops the script with a fatal error."
/>

<Quiz
	question="Why use require_once for a file of functions?"
	:options="['So the file is only loaded once, since defining a function twice is an error', 'It runs faster than include', 'It hides the file from visitors', 'It is required for strict types']"
	:answer-index="0"
	explanation="Loading a file of functions twice would try to define each function again, which stops the script. require_once skips repeats."
/>

<Quiz
	question="What does __DIR__ hold?"
	:options="['The website\'s address', 'The folder PHP was installed in', 'The name of the current function', 'The folder of the current file']"
	:answer-index="3"
	explanation="__DIR__ is the folder of the file it's written in, so __DIR__ . &quot;/includes/x.php&quot; always finds the right file."
/>

## Up next

You've seen `[...]` lists in loops. Now it's time to meet arrays properly: PHP's way of keeping many values together, in [Indexed Arrays](/lessons/php/arrays).
