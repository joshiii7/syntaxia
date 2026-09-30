---
title: "PHP Best Practices: Clean Code and Common Beginner Mistakes"
description: "Write PHP that's easy to read and change: PSR-12 style, strict types, clear names, constants, small functions, early returns, useful tools, and the mistakes almost every beginner makes."
---

# Best Practices and Common Mistakes

*A shared kitchen stays usable when everyone follows a few rules: label the jars, put knives back where they belong, clean as you go. Nobody enjoys the rules, but everyone enjoys the kitchen.*

Code is read far more often than it's written: by teammates, by your future self in six months, by anyone who has to fix a bug at midnight. PHP will happily run messy code, so keeping it readable is up to you. This lesson collects the habits that matter most, then the mistakes that trip up almost everyone.

## A shared kitchen

The habits below aren't about being fussy. Each one makes a specific kind of bug less likely, or makes code quicker to understand. You've seen most of them already in this track; here they are in one place.

## Follow PSR-12

PHP's community has a shared style guide, called **PSR-12** (a "PHP Standards Recommendation"). Most projects follow it, so following it too makes your code look familiar to every PHP developer. The main points:

- 4 spaces for indentation, never tabs.
- Opening braces of classes and methods on their own line; opening braces of `if`, `for`, and friends on the same line.
- One space after keywords like `if` and `foreach`, and around operators: `if ($total > 100) {`.
- Class names in `PascalCase`, methods and variables in `camelCase`, and constants in `UPPER_CASE`.
- Leave out the closing `?>` in files that contain only PHP.

You don't have to remember all of it. A tool called **PHP CS Fixer** (or **PHP_CodeSniffer**), installed with Composer, can check and fix the formatting for you.

## Turn on strict types

Start every PHP file with `declare(strict_types=1);`, and give parameters, return values, and properties types. As in [Parameters, Types, and Return Values](/lessons/php/parameters), this turns silent type juggling into clear errors that point at the real problem.

## Name things by what they are

```php
// Hard to follow
$d = 7;
$x = $p * $d;

// Clear
$daysRented = 7;
$totalCost = $dailyRate * $daysRented;
```

- Variables are nouns: `$student`, `$totalCost`, `$isLoggedIn` (booleans read well as `is`, `has`, or `can`).
- Functions and methods are verbs: `calculateTotal()`, `sendReceipt()`, `isValidEmail()`.
- Arrays have plural names: `$students`, one item at a time is `$student`.

## Replace magic numbers with constants

A number like `75` or `0.12` in the middle of code is a **magic number**: its meaning is a mystery, and if it appears in several places, changing it means finding every one. Give it a name:

```php
<?php
declare(strict_types=1);

const PASSING_SCORE = 75;
const VAT_RATE = 0.12;

$score = 80;
$price = 500;
echo $score >= PASSING_SCORE ? "Passed\n" : "Retake\n";
echo "With VAT: " . $price * (1 + VAT_RATE) . "\n";
```

```text
Passed
With VAT: 560
```

## Keep functions small and focused

A function should do one job, and its name should say what that job is. If you find yourself writing "and" in a function's name, like `validateAndSaveAndEmail`, split it up. Small functions are easier to test, reuse, and fix.

## Return early

Deeply nested `if`s are hard to follow. Check for problems first, and leave the function right away when one is found. The main work then sits at the end, un-nested:

```php
<?php
declare(strict_types=1);

function shippingFee(float $weightKg, string $zone): float
{
    if ($weightKg <= 0) {
        throw new InvalidArgumentException("Weight must be positive.");
    }
    if ($zone === "local") {
        return 50;
    }

    return 120 + $weightKg * 15;
}

echo shippingFee(2, "local"), "\n";
echo shippingFee(2, "province"), "\n";
```

```text
50
150
```

## Don't repeat yourself

If you've copied and pasted the same few lines twice, turn them into a function, or a loop. When a bug turns up, you'll fix it in one place instead of hunting for every copy. The same goes for page layouts: shared headers and footers belong in their own files, as in [Splitting Code with include and require](/lessons/php/include-and-require).

## Separate logic from HTML

Pages are easiest to work with when the PHP that does the work (reading input, validating, talking to the database) sits at the **top** of the file, or in its own functions and classes, and the HTML at the **bottom** only displays the results, using the template syntax: `<?= e($name) ?>`, `foreach (...):`, and `endforeach;`. Mixing database queries into the middle of HTML makes both hard to read. Frameworks like Laravel enforce this split with separate "view" files.

## Comment the why, not the what

```php
// Bad: repeats what the code already says
$total = $total * 0.9; // multiply total by 0.9

// Good: explains something the code can't
$total = $total * 0.9; // Loyalty discount, agreed with the owner in March 2026
```

Clear names remove the need for most comments. Save comments for reasons, warnings, and anything surprising.

## Handle errors honestly

- Throw an exception when a function gets data it can't work with; don't quietly return a made-up value.
- Never leave an empty `catch` block. Handle the problem, or let it go up.
- Show visitors friendly messages, and log the details for yourself.

## Useful tools

- **`var_dump`** is your first debugging tool: when something's wrong, look at what your variables actually hold.
- **Xdebug** is a PHP extension that lets you pause a script and step through it line by line in VS Code or PhpStorm.
- **PHPStan** reads your code without running it and finds bugs, like calling a method that doesn't exist or passing the wrong type.
- **PHPUnit** runs automated tests, small scripts that check your functions give the right answers.

All of them install with Composer.

## The mistakes almost everyone makes

When something's wrong and you can't see why, run down this list. Every one of these came up somewhere in this track.

1. **A missing semicolon**, with the error pointing at the line *after* it. ([Your First PHP Script](/lessons/php/first-script))
2. **Variables in single quotes**, like `'Hello $name'`, which don't interpolate. ([Your First PHP Script](/lessons/php/first-script))
3. **Using `+` to join strings.** PHP uses the dot: `$first . " " . $last`. ([Variables and Constants](/lessons/php/variables))
4. **Using `=` instead of `===`** in a condition, which stores a value and is usually truthy. ([Making Decisions](/lessons/php/if-else))
5. **Using `==` instead of `===`**, and getting caught by type juggling, like `"1e1" == "10"`. ([Type Juggling and Strict Comparisons](/lessons/php/type-juggling))
6. **Forgetting that `"0"` is falsy**, so `if ($quantity)` rejects a real answer of 0. ([Type Juggling and Strict Comparisons](/lessons/php/type-juggling))
7. **Checking `strpos` with `!`** instead of `=== false`, when the match is at position 0. ([Working with Strings](/lessons/php/strings))
8. **Forgetting `break`** in a `switch`, and falling through into the next case. ([switch and match](/lessons/php/switch-and-match))
9. **Expecting a function to see an outside variable**, without passing it in. ([Variable Scope](/lessons/php/scope))
10. **Echoing instead of returning** from a function, so the caller gets `null`. ([Writing Functions](/lessons/php/functions))
11. **Storing the result of `sort`**, which is `true`, instead of using the sorted array. ([Array Functions](/lessons/php/array-functions))
12. **Output before `header()`, `setcookie()`, or `session_start()`**, even a single space before `<?php`, which gives "Cannot modify header information - headers already sent". ([Handling Forms](/lessons/php/forms))
13. **Echoing user input without `htmlspecialchars`**, which opens the door to XSS. ([Validating and Escaping User Input](/lessons/php/validating-input))
14. **Putting variables straight into SQL**, instead of using placeholders. ([Databases with PDO](/lessons/php/databases-with-pdo))

## Try it

This script works. It runs and prints the right answer. But it breaks almost every habit in this lesson. Read it, predict what it prints, and count how many problems you can spot along the way.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="380px"
	:model-value="'&lt;?php\n$a = [&quot;Maria&quot; =&gt; 91, &quot;Ben&quot; =&gt; 68, &quot;Carlo&quot; =&gt; 95, &quot;Dina&quot; =&gt; 74];\n$c = 0; $t = 0;\nforeach ($a as $n =&gt; $s) {\nif ($s &gt;= 75) { $c = $c + 1; }\nif ($s &gt;= 75) echo $n . &quot; passed with &quot; . $s . &quot;\\n&quot;;\nif ($s &lt; 75) echo $n . \' needs a retake (\' . $s . &quot;)\\n&quot;;\n$t = $t + $s;\n}\necho &quot;Passed: &quot; . $c . &quot;/&quot; . 4 . &quot;\\n&quot;;\necho &quot;Avg: &quot; . $t / 4 . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Maria passed with 91
Ben needs a retake (68)
Carlo passed with 95
Dina needs a retake (74)
Passed: 2/4
Avg: 82
```

Some of the problems:

- no `declare(strict_types=1);`, and no indentation inside the loop;
- names like `$a`, `$c`, `$t`, `$n`, and `$s` say nothing;
- the magic numbers `75` and `4` are repeated, and the `4` breaks the moment a student is added;
- the same condition is checked three times, with a mix of braces and no braces;
- a mix of single and double quotes for no reason, and the counting and averaging is rewritten by hand, where `count`, `array_filter`, and `array_sum` already exist.

Here's one way to clean it up. It prints exactly the same thing:

```php
<?php
declare(strict_types=1);

const PASSING_SCORE = 75;

$scores = ["Maria" => 91, "Ben" => 68, "Carlo" => 95, "Dina" => 74];

function resultLine(string $name, int $score): string
{
    if ($score >= PASSING_SCORE) {
        return "$name passed with $score";
    }
    return "$name needs a retake ($score)";
}

foreach ($scores as $name => $score) {
    echo resultLine($name, $score) . "\n";
}

$passed = array_filter($scores, fn(int $score) => $score >= PASSING_SCORE);
echo "Passed: " . count($passed) . "/" . count($scores) . "\n";
echo "Avg: " . array_sum($scores) / count($scores) . "\n";
```

It's a little longer, and that's fine. Every piece now has a name that says what it does, adding a fifth student is one entry in the array, and changing the passing mark is a single edit.
:::

## Try it yourself

1. In the messy version, add a fifth student, `Eli`, with a score of 88. How many places did you have to change? Now do the same in the clean version.
2. In the clean version, change the passing score to 70. Whose results change?
3. Pick a script you wrote earlier in this track. Find one magic number, one unclear name, and one place where a built-in array function could replace a hand-written loop, and fix all three.

## Check your understanding

<Quiz
	question="What's a magic number?"
	:options="['A number that changes every time the script runs', 'A number stored in a constant', 'An unexplained number in the code, like 75, whose meaning isn\'t clear', 'A very large number']"
	:answer-index="2"
	explanation="Magic numbers hide their meaning and have to be changed everywhere they appear. A named constant fixes both problems."
/>

<Quiz
	question="What does &quot;return early&quot; mean?"
	:options="['Check for problems first and leave the function right away, keeping the main work un-nested', 'Put return as the first line of every function', 'Stop the script as soon as possible', 'Return before any variables are made']"
	:answer-index="0"
	explanation="Handling the special cases first, with an early return or throw, avoids deeply nested if blocks."
/>

<Quiz
	question="A page shows &quot;Cannot modify header information - headers already sent&quot;. What's the likely cause?"
	:options="['A missing semicolon', 'A wrong database password', 'The session has expired', 'Something was output, even a space, before header(), setcookie(), or session_start()']"
	:answer-index="3"
	explanation="Headers must be sent before the page itself, so any output before those functions, even a blank line before &lt;?php, causes this warning."
/>

## Up next

You've learned everything you need to build a complete PHP web app. Time to prove it, in the [Final Project: Event Sign-Up Sheet](/lessons/php/final-project).
