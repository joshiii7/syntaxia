---
title: "PHP Data Types: Strings, Integers, Floats, Booleans, and Null"
description: "Meet PHP's basic data types, see how to check a value's type with var_dump and get_debug_type, and learn the surprises of floats, booleans, and null."
---

# Data Types

*A toolbox has separate trays for screws, nails, and bolts. They're all small metal things, but you'd never use one where you need another.*

Every value in PHP has a **type**: text, a whole number, a decimal, true or false, and so on. The type decides what you can do with the value. You can multiply two numbers, but multiplying two names makes no sense.

In PHP, you don't write the type when you create a variable. PHP looks at the value and works it out.

## The toolbox

Here are the types you'll use most, with PHP's name for each:

| Type | PHP name | Examples |
|---|---|---|
| Text | `string` | `"Hello"`, `'Maria'`, `""` |
| Whole number | `int` | `42`, `-7`, `0` |
| Decimal number | `float` | `3.14`, `-0.5`, `2.0` |
| True or false | `bool` | `true`, `false` |
| No value at all | `null` | `null` |
| A list of values | `array` | `[1, 2, 3]` |

Arrays get their own lessons, starting with [Indexed Arrays](/lessons/php/arrays). This lesson covers the first five.

## Checking a type

`echo` shows a value, but not its type. For that, PHP has two handy tools:

- `get_debug_type($value)` gives the type's name as a string.
- `var_dump($value)` prints the type **and** the value. It's the best tool for looking inside a variable while you're debugging.

```php
<?php
var_dump("Maria");
var_dump(17);
var_dump(1.75);
var_dump(true);
var_dump(null);
echo get_debug_type(17), "\n";
```

```text
string(5) "Maria"
int(17)
float(1.75)
bool(true)
NULL
int
```

For a string, `var_dump` also shows its length: `"Maria"` has 5 characters.

## Strings

A string is text, in single or double quotes, as you saw in [Your First PHP Script](/lessons/php/first-script). A string can hold digits too, but `"42"` in quotes is text, not a number. You'll learn much more in [Working with Strings](/lessons/php/strings).

## Integers and floats

PHP has two kinds of numbers:

- An **int** (integer) is a whole number, with no decimal point: `10`, `-3`.
- A **float** (floating-point number) has a decimal point: `10.5`, `-3.0`.

Dividing with `/` gives a float whenever the answer isn't whole. For whole-number division, use `intdiv()`, and for the remainder, `%`:

```php
<?php
var_dump(10 / 2);
var_dump(10 / 4);
var_dump(intdiv(10, 4));
var_dump(10 % 4);
```

```text
int(5)
float(2.5)
int(2)
int(2)
```

You can write long numbers with underscores to make them readable. PHP ignores them: `1_000_000` is one million.

**A float surprise.** Computers store decimals in binary, so some simple-looking decimals can't be stored exactly. It's the same in almost every programming language:

```php
<?php
var_dump(0.1 + 0.2);
var_dump(0.1 + 0.2 == 0.3);
```

```text
float(0.30000000000000004)
bool(false)
```

The tiny error is harmless for most things, but it matters for money. That's why shops and banks usually count in whole cents (an int), not in pesos with decimals.

## Booleans

A **bool** is either `true` or `false`, nothing else. You'll get them from comparisons, like `$age >= 18`, and use them to make decisions in [Making Decisions](/lessons/php/if-else).

Watch out when you `echo` a boolean. `true` prints as `1`, and `false` prints as **nothing at all**:

```php
<?php
$isOpen = true;
$isFull = false;
echo "Open: $isOpen\n";
echo "Full: $isFull\n";
var_dump($isFull);
```

```text
Open: 1
Full:
bool(false)
```

That's a good reason to use `var_dump` whenever you're not sure what a variable holds.

## Null

`null` means "no value". A variable holds `null` when you set it that way on purpose, for example because something hasn't happened yet:

```php
<?php
$winner = null;
var_dump($winner);
var_dump(is_null($winner));
```

```text
NULL
bool(true)
```

You can check for each type with a matching function: `is_string()`, `is_int()`, `is_float()`, `is_bool()`, and `is_null()`. Each one returns `true` or `false`.

## A variable's type can change

Since the type comes from the value, putting a new kind of value in a variable changes its type:

```php
<?php
$answer = 42;
echo get_debug_type($answer), "\n";
$answer = "forty-two";
echo get_debug_type($answer), "\n";
```

```text
int
string
```

That's allowed, but it's usually confusing. Keep each variable to one type. Later, in [Parameters, Types, and Return Values](/lessons/php/parameters), you'll see how to make PHP check types for you.

## Try it

A student's record, in several types. Predict every line, including the types and the lengths.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="320px"
	:model-value="'&lt;?php\n$name = &quot;Ana&quot;;\n$age = 16;\n$height = 1.6;\n$isEnrolled = true;\n$club = null;\n\nvar_dump($name);\nvar_dump($age + 1);\nvar_dump($height * 100);\necho &quot;Enrolled: $isEnrolled\\n&quot;;\nvar_dump($club);\necho get_debug_type(7 / 2), &quot;\\n&quot;;\necho get_debug_type(&quot;16&quot;), &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
string(3) "Ana"
int(17)
float(160)
Enrolled: 1
NULL
float
string
```

`$height * 100` is `float(160)`: a float that happens to be whole is still a float. `7 / 2` isn't whole, so it's a float too, and `"16"` in quotes is a string, even though it looks like a number.
:::

## Try it yourself

1. Change `$isEnrolled` to `false`. What does the Enrolled line print now?
2. Use `var_dump` on `8 / 2` and on `9 / 2`. Why are the types different?
3. Set `$club = "Robotics";` and `var_dump` it again. What's its length?

## Check your understanding

<Quiz
	question="What type is the value 3.0?"
	:options="['int', 'string', 'bool', 'float']"
	:answer-index="3"
	explanation="Any number written with a decimal point is a float, even when the part after the point is zero."
/>

<Quiz
	question="What does echo false; print?"
	:options="['false', 'Nothing at all', '0', 'An error']"
	:answer-index="1"
	explanation="true prints as 1, and false prints as an empty string. Use var_dump to see a boolean clearly."
/>

<Quiz
	question="Why do shops often store prices as whole cents?"
	:options="['Integers use more memory', 'Floats cannot store some decimals exactly, like 0.1', 'PHP has no decimal numbers', 'Cents are required by law']"
	:answer-index="1"
	explanation="Floats are stored in binary, so 0.1 + 0.2 isn't exactly 0.3. Whole numbers of cents avoid those tiny errors."
/>

## Up next

You know the types. Now let's calculate and compare with them, in [Operators and Expressions](/lessons/php/operators).
