---
title: "PHP Variable Scope: Local, Global, and Static Variables"
description: "Learn why PHP functions can't see outside variables, how to pass values in and out instead, and what the global and static keywords do."
---

# Variable Scope

*Each classroom has its own whiteboard. What's written in Room 5 can't be read from Room 6, and wiping one board doesn't touch the other.*

Here's a puzzle that catches almost every PHP beginner:

```php
<?php
$shopName = "Ate Lorna's";

function welcome() {
    echo "Welcome to $shopName!\n";
}

welcome();
// error: Warning: Undefined variable $shopName
```

`$shopName` clearly exists. So why can't the function see it? The answer is **scope**: the part of your code where a variable can be seen.

## Separate whiteboards

In PHP, every function has its own whiteboard:

- Variables created **inside** a function are **local** to it. They exist only while the function runs, and nothing outside can see them.
- Variables created **outside** any function are in the **global** scope. In PHP, functions can't see them, either.

This is stricter than JavaScript or Python, where a function can read variables from around it. In PHP, a function starts with a blank whiteboard, except for its parameters.

It works the other way too:

```php
<?php
function makeTotal() {
    $total = 250;
}

makeTotal();
echo $total;
// error: Warning: Undefined variable $total
```

`$total` was written on the function's board, which was wiped when the function finished.

## Why this is a good thing

At first, this feels like an obstacle. But imagine a big program with hundreds of functions. If every function could read and change every variable, a function called `calculateTax` could quietly change your `$total` from somewhere far away, and you'd never find the bug.

With separate scopes, a function can only use what's handed to it, and can only affect the outside by returning something. You can understand each function on its own.

It also means two functions can use the same variable names without clashing:

```php
<?php
function first() {
    $count = 1;
    echo "first: $count\n";
}
function second() {
    $count = 99;
    echo "second: $count\n";
}

$count = 5;
first();
second();
echo "outside: $count\n";
```

```text
first: 1
second: 99
outside: 5
```

Three different `$count` variables, on three different whiteboards.

## The right way: in through parameters, out through return

To get a value into a function, pass it as an argument. To get a result out, return it. That's the fix for both puzzles:

```php
<?php
$shopName = "Ate Lorna's";

function welcome(string $shop): string {
    return "Welcome to $shop!";
}

echo welcome($shopName), "\n";
```

```text
Welcome to Ate Lorna's!
```

Everything the function needs is listed in its parameters, so anyone reading it can see exactly what it depends on.

## The global keyword

PHP does have a way for a function to reach a global variable: the `global` keyword.

```php
<?php
$visitors = 0;

function addVisitor() {
    global $visitors;
    $visitors++;
}

addVisitor();
addVisitor();
echo "Visitors: $visitors\n";
```

```text
Visitors: 2
```

It works, and you'll see it in older code, especially WordPress. But it brings back exactly the problem scope protects you from: any function could be changing `$visitors`, and you can't tell by reading the calls. Prefer parameters and return values. A clean version of the same thing:

```php
<?php
function addVisitor(int $visitors): int {
    return $visitors + 1;
}

$visitors = 0;
$visitors = addVisitor($visitors);
$visitors = addVisitor($visitors);
echo "Visitors: $visitors\n";
```

```text
Visitors: 2
```

## Constants are everywhere

Constants, from [Variables and Constants](/lessons/php/variables), are the exception: they can be seen from anywhere, including inside functions. Since they can't change, that's safe:

```php
<?php
const TAX_RATE = 0.12;

function withTax(float $price): float {
    return $price * (1 + TAX_RATE);
}

echo withTax(100), "\n";
```

```text
112
```

## static: a variable that remembers

Normally, a function's local variables start fresh on every call. A `static` variable is different: it keeps its value between calls (within the same request):

```php
<?php
function nextTicketNumber(): int {
    static $number = 0;
    $number++;
    return $number;
}

echo nextTicketNumber(), "\n";
echo nextTicketNumber(), "\n";
echo nextTicketNumber(), "\n";
```

```text
1
2
3
```

`static $number = 0;` sets the starting value only the first time. On later calls, `$number` still has the value from last time. Remember from [How PHP Runs](/lessons/php/how-php-runs), though: every request starts fresh, so the numbering restarts at 1 on the next page load.

## Try it

A game keeps score, with a mix of scopes. Predict each line, and whether any of them causes a warning.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="420px"
	:model-value="'&lt;?php\nconst MAX_LIVES = 3;\n$score = 10;\n$player = &quot;Mimi&quot;;\n\nfunction addPoints(int $score, int $points): int {\n    $score += $points;\n    return $score;\n}\n\nfunction roundNumber(): int {\n    static $round = 0;\n    $round++;\n    return $round;\n}\n\nfunction status(): string {\n    return &quot;Lives: &quot; . MAX_LIVES . &quot;, player: &quot; . ($player ?? &quot;unknown&quot;);\n}\n\naddPoints($score, 5);\necho &quot;After ignoring the result: $score\\n&quot;;\n$score = addPoints($score, 5);\necho &quot;After storing the result: $score\\n&quot;;\n\necho &quot;Round &quot; . roundNumber() . &quot;\\n&quot;;\necho &quot;Round &quot; . roundNumber() . &quot;\\n&quot;;\necho status() . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
After ignoring the result: 10
After storing the result: 15
Round 1
Round 2
Lives: 3, player: unknown
```

The first `addPoints` changes only its own `$score` parameter, and the result is thrown away, so the global `$score` stays 10. Storing the returned value fixes that. The static `$round` remembers between calls. Inside `status`, the constant is visible, but `$player` isn't, and `??` quietly gives `"unknown"` instead of a warning.
:::

## Try it yourself

1. Change `status` so it takes the player's name as a parameter, and pass `$player` in.
2. Remove the word `static` from `roundNumber`. What do the two Round lines print now, and why?
3. Write a function `countCalls()` that returns how many times it's been called, using `static`.

## Check your understanding

<Quiz
	question="Can a PHP function read a variable created outside it, without any special keyword?"
	:options="['Yes, always', 'Only if it is a string', 'No, it has its own separate scope', 'Only after the function is called twice']"
	:answer-index="2"
	explanation="A PHP function only sees its own local variables and parameters. Pass outside values in as arguments."
/>

<Quiz
	question="What does a static variable inside a function do?"
	:options="['Can never be changed', 'Keeps its value between calls to the function', 'Can be seen from outside the function', 'Is shared with every other function']"
	:answer-index="1"
	explanation="A static local variable is set up once and remembers its value from one call to the next."
/>

<Quiz
	question="Why is passing values as parameters usually better than using global?"
	:options="['Parameters are faster to type', 'global does not work in PHP 8', 'Parameters can only be strings', 'You can see exactly what a function depends on, and it cannot secretly change outside variables']"
	:answer-index="3"
	explanation="With parameters and return values, a function's inputs and outputs are visible in every call, which keeps bugs easy to find."
/>

## Up next

Your programs are growing. Soon, one file won't be enough. Learn to split your code across several files and pull them together, in [Splitting Code with include and require](/lessons/php/include-and-require).
