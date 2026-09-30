---
title: "PHP Variables and Constants: A Beginner's Guide"
description: "Learn how PHP variables work: the $ sign, naming rules, changing values, building text with the dot operator, and fixed values with const and define."
---

# Variables and Constants

*A variable is a labeled jar. You can put something in, look at it, or swap it for something else. The label stays the same.*

You've already met variables in the first few lessons, like `$name = "Maria";`. Now let's look at them properly: how to name them, change them, and combine them, plus their fixed cousins, **constants**.

## Labeled jars

Imagine a kitchen shelf of jars. Each has a label, like "sugar" or "rice", and something inside. You can check what's in a jar by its label, or empty it and fill it with something new. The label doesn't change; the contents can.

A PHP variable is one of those jars:

```php
<?php
$snack = "apples";
echo "Today's snack: $snack\n";

$snack = "bananas";
echo "Tomorrow's snack: $snack\n";
```

```text
Today's snack: apples
Tomorrow's snack: bananas
```

- `$snack` is the label. Every PHP variable name starts with a **dollar sign** `$`.
- `=` puts a value into the jar. It's called **assignment**. Read it as "becomes", not "equals": `$snack` *becomes* `"apples"`.
- Assigning again replaces the old value. The apples are gone.

You don't have to announce a variable before using it, or say what kind of value it holds. The first assignment creates it.

## Naming rules

After the `$`, a variable name:

- starts with a **letter** or an **underscore** `_`, never a digit;
- continues with letters, digits, and underscores, with no spaces or dashes;
- is **case-sensitive**: `$score` and `$Score` are different variables.

| Name | OK? |
|---|---|
| `$age` | Yes |
| `$first_name` | Yes |
| `$firstName` | Yes |
| `$player2` | Yes |
| `$2player` | No: starts with a digit |
| `$first-name` | No: a dash isn't allowed |

Choose names that say what's inside, like `$total_price`, not `$tp` or `$x`. Two styles are common: `$first_name` (called **snake_case**) and `$firstName` (called **camelCase**). Many PHP projects use camelCase for variables, which is the style this track uses from here on. The important thing is to pick one and stay consistent.

## Changing a value using itself

A new value can be worked out from the old one:

```php
<?php
$points = 10;
$points = $points + 5;
echo $points, "\n";

$points += 5;
echo $points, "\n";

$points++;
echo $points, "\n";
```

```text
15
20
21
```

- `$points = $points + 5` reads the old value (10), adds 5, and stores the result (15).
- `$points += 5` is a shortcut for the same thing. There's also `-=`, `*=`, and `/=`.
- `$points++` adds exactly 1. `$points--` subtracts 1.

## Joining text with the dot

To join pieces of text, PHP uses a **dot** `.`, called the **concatenation** operator. (In JavaScript and Python, that's `+`. In PHP, `+` is only for numbers.)

```php
<?php
$first = "Maria";
$last = "Santos";
$full = $first . " " . $last;
echo $full . "\n";

$greeting = "Hello";
$greeting .= ", " . $first . "!";
echo $greeting . "\n";
```

```text
Maria Santos
Hello, Maria!
```

`.=` adds text to the end of what's already in a variable, just like `+=` does for numbers.

You now have two ways to put a variable in text: the dot, or double quotes with interpolation. These print the same thing:

```php
<?php
$city = "Cebu";
echo "I live in " . $city . ".\n";
echo "I live in $city.\n";
```

```text
I live in Cebu.
I live in Cebu.
```

When a variable name is right next to other letters, wrap it in curly braces so PHP knows where the name ends:

```php
<?php
$fruit = "mango";
echo "Two {$fruit}s, please.\n";
```

```text
Two mangos, please.
```

Without the braces, PHP would look for a variable called `$fruits`, which doesn't exist.

## Undefined variables

Using a variable before you've put anything in it gives a warning:

```php
<?php
echo "Score: " . $score;
// error: Warning: Undefined variable $score
```

PHP carries on and treats the missing value as empty, so the line prints just `Score: `. But a warning like this almost always means a typo or a missing step. Fix it, don't ignore it.

## Constants: values that never change

Some values should never change while the script runs: the number of days in a week, a website's name, a tax rate. For those, use a **constant**:

```php
<?php
const DAYS_IN_WEEK = 7;
const SITE_NAME = "Syntaxia Snacks";

echo SITE_NAME . "\n";
echo "Weeks in 28 days: " . 28 / DAYS_IN_WEEK . "\n";
```

```text
Syntaxia Snacks
Weeks in 28 days: 4
```

- A constant has **no** `$` sign.
- By convention, constant names are in **UPPER_CASE**, so they stand out.
- Once set, a constant can't be changed. Trying to set it again is an error.

```php
<?php
const TAX_RATE = 0.12;
const TAX_RATE = 0.20;
// error: Constant TAX_RATE already defined
```

In PHP 8.5, that's a warning (the message adds "this will be an error in PHP 9"), and the constant keeps its first value, 0.12. Either way, constants protect important values from being changed by accident.

There's an older way to make a constant, the `define()` function: `define("TAX_RATE", 0.12);`. You'll see it in older code. It works almost the same, but `const` is clearer and is the usual choice.

PHP also has constants built in. You met `PHP_VERSION` in [Setting Up](/lessons/php/setting-up). Another is `PHP_EOL`, which means "end of line", a new line.

## Try it

A snack stall is counting its sales. Predict each line the script prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="340px"
	:model-value="'&lt;?php\nconst STALL_NAME = &quot;Ate Lorna\'s Snacks&quot;;\nconst PRICE = 25;\n\n$sold = 12;\n$sold += 8;\n$sold--;\n\n$report = STALL_NAME . &quot; sold $sold turon today.&quot;;\n$report .= &quot; That\'s &quot; . $sold * PRICE . &quot; pesos.&quot;;\necho $report . &quot;\\n&quot;;\n\n$item = &quot;turon&quot;;\necho &quot;Tomorrow: 30 {$item}s.\\n&quot;;\necho \'Price each: $PRICE\' . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Ate Lorna's Snacks sold 19 turon today. That's 475 pesos.
Tomorrow: 30 turons.
Price each: $PRICE
```

`$sold` goes 12, then 20, then 19. Multiplying by `PRICE` gives 475. The last line is a trap twice over: single quotes don't interpolate, and a constant has no `$` anyway, so `$PRICE` is just text.
:::

## Try it yourself

1. Change the price to 30 and the number sold at the start to 15. What's the new total?
2. Fix the last line so it prints `Price each: 25`, using the dot operator.
3. Try to change `PRICE` with a second `const PRICE = 30;` line. What does PHP say?

## Check your understanding

<Quiz
	question="Which variable name is NOT allowed in PHP?"
	:options="['$total_price', '$totalPrice', '$_count', '$3rdPlace']"
	:answer-index="3"
	explanation="After the $, a variable name can't start with a digit. $thirdPlace would work."
/>

<Quiz
	question="What does this print? $a = &quot;5&quot;; $b = &quot;3&quot;; echo $a . $b;"
	:options="['8', '5 3', '53', 'An error']"
	:answer-index="2"
	explanation="The dot joins text, so &quot;5&quot; and &quot;3&quot; become &quot;53&quot;. To add them as numbers, you'd use +."
/>

<Quiz
	question="How is a constant different from a variable?"
	:options="['It has no $ sign and cannot be changed once set', 'It is faster', 'It can only hold numbers', 'It must be written in lowercase']"
	:answer-index="0"
	explanation="Constants are written without $, usually in UPPER_CASE, and keep their value for the whole script."
/>

## Up next

Variables can hold text, whole numbers, decimals, and more. Each kind behaves differently, and PHP keeps track of which is which. Meet them all in [Data Types](/lessons/php/data-types).
