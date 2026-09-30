---
title: "PHP Type Juggling: == vs ===, Truthy and Falsy Values, and Casting"
description: "Understand how PHP converts types automatically: numeric strings, loose vs strict comparison, which values count as false, and how to convert types yourself with casts."
---

# Type Juggling and Strict Comparisons

*A helpful friend who "fixes" your spelling without asking is lovely most of the time, and baffling some of the time. PHP converting types for you is the same.*

In [Data Types](/lessons/php/data-types), you saw that every value has a type. But PHP doesn't make you keep them apart. Mix a string and a number, and PHP quietly converts one of them to make the operation work. That's called **type juggling**.

It's convenient: form data always arrives as strings, and PHP lets you do math with them anyway. But it has sharp edges. This lesson shows where they are, and how to avoid them.

## Numbers inside strings

When you use a string in math, PHP tries to read it as a number:

```php
<?php
var_dump("5" + 3);
var_dump("1.5" + 1);
```

```text
int(8)
float(2.5)
```

A string that's entirely a number, like `"5"` or `"1.5"`, is called a **numeric string**, and PHP converts it without complaint.

A string that only *starts* with a number gets converted too, but with a warning, since it's probably a mistake:

```php
<?php
var_dump("5 apples" + 3);
// error: Warning: A non-numeric value encountered
```

The result is still `int(8)`. PHP used the `5` and ignored the rest.

And a string with no number at the start stops the script with an error:

```php
<?php
var_dump("apples" + 3);
// error: Uncaught TypeError: Unsupported operand types: string + int
```

Older PHP (before version 8) turned `"apples"` into `0` silently. You'll still find old tutorials that say so.

## Loose comparison `==`

The loose `==` converts types before comparing. That's where most of the surprises live:

```php
<?php
var_dump(5 == "5");
var_dump("1" == "01");
var_dump("10" == "1e1");
var_dump(null == false);
var_dump("0" == false);
var_dump("abc" == 0);
```

```text
bool(true)
bool(true)
bool(true)
bool(true)
bool(true)
bool(false)
```

- `"1" == "01"`: both are numeric strings, so PHP compares them **as numbers**, and 1 equals 1.
- `"10" == "1e1"`: `1e1` is scientific notation for 1 × 10¹, which is 10.
- `null == false` and `"0" == false`: both sides count as false (more on that below).
- `"abc" == 0`: false in PHP 8. (In older PHP, this was true, which caused real security bugs.)

Imagine comparing two product codes, `"1e1"` and `"10"`, with `==`. PHP says they're the same product! That's why the advice from [Operators and Expressions](/lessons/php/operators) stands: use `===`, which never converts.

```php
<?php
var_dump("1" === "01");
var_dump("10" === "1e1");
var_dump(null === false);
```

```text
bool(false)
bool(false)
bool(false)
```

## Truthy and falsy

In an `if` or with `!`, `&&`, and `||`, PHP converts values to booleans. These values count as **false** (they're called **falsy**):

| Value | Why |
|---|---|
| `false` | it's false |
| `0` and `0.0` | zero |
| `""` | an empty string |
| `"0"` | a string containing just zero |
| `null` | no value |
| `[]` | an empty array |

**Everything else** counts as true (**truthy**), including some surprises:

```php
<?php
var_dump((bool) "0");
var_dump((bool) "0.0");
var_dump((bool) " ");
var_dump((bool) "false");
```

```text
bool(false)
bool(true)
bool(true)
bool(true)
```

`"0"` is falsy, but `"0.0"`, a single space, and even the word `"false"` are all truthy, because they're non-empty strings that aren't exactly `"0"`.

This matters with forms. If someone types `0` into a "how many tickets?" box, the value arrives as the string `"0"`, which is falsy. A check like `if ($tickets)` would treat it as if nothing were typed. You'll see safer checks in [Validating and Escaping User Input](/lessons/php/validating-input).

## Converting on purpose: casting

Instead of letting PHP guess, you can convert a value yourself with a **cast**: the type name in parentheses, before the value:

```php
<?php
var_dump((int) "42");
var_dump((int) "12abc");
var_dump((int) "abc");
var_dump((int) 9.99);
var_dump((float) "3.5");
var_dump((string) 7);
var_dump((bool) 0);
```

```text
int(42)
int(12)
int(0)
int(9)
float(3.5)
string(1) "7"
bool(false)
```

Notice `(int) 9.99` gives `9`. Casting to int **cuts off** the decimals; it doesn't round. For rounding, use `round()`.

Also notice that a cast never complains: `(int) "abc"` quietly gives `0`. That's handy, but it means casting alone can't tell you whether the input was a real number. To check first, use `is_numeric()`:

```php
<?php
var_dump(is_numeric("42"));
var_dump(is_numeric("4.2"));
var_dump(is_numeric("42 cats"));
```

```text
bool(true)
bool(true)
bool(false)
```

## The rules of thumb

1. Compare with `===` and `!==`.
2. When a value comes from outside, like a form, check it (`is_numeric`) and then convert it (a cast) yourself, rather than letting PHP juggle.
3. Remember that `"0"` is falsy.
4. When you're unsure what a variable holds, `var_dump` it.

## Try it

A quiz app checks some answers that arrived as strings. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="340px"
	:model-value="'&lt;?php\n$typedAnswer = &quot;07&quot;;\n$correctAnswer = 7;\n$tickets = &quot;0&quot;;\n$code = &quot;1e3&quot;;\n\nvar_dump($typedAnswer == $correctAnswer);\nvar_dump($typedAnswer === $correctAnswer);\nvar_dump((int) $typedAnswer === $correctAnswer);\n\necho $tickets ? &quot;Has tickets\\n&quot; : &quot;No tickets\\n&quot;;\nvar_dump($code == &quot;1000&quot;);\nvar_dump($code === &quot;1000&quot;);\nvar_dump((int) &quot;3.99 pesos&quot;);\nvar_dump(is_numeric($code));\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
bool(true)
bool(false)
bool(true)
No tickets
bool(true)
bool(false)
int(3)
bool(true)
```

`"07" == 7` converts the string to a number, so it's true, but `===` sees a string and an int. Casting first, then comparing with `===`, is the clean way. `"0"` is falsy. `"1e3"` is a numeric string meaning 1000, so `==` compares them as numbers. And `(int) "3.99 pesos"` reads the leading number and cuts off the decimals.
:::

## Try it yourself

1. Change `$tickets` to `"0.0"`. What does the tickets line print now, and why?
2. What does `var_dump("abc" == "ABC");` print? Try it and explain.
3. Write a line that turns `"19.75"` into a float and adds `0.25` to it, with no warnings.

## Check your understanding

<Quiz
	question="Which of these values is falsy?"
	:options="['&quot;0&quot;', '&quot; &quot; (a space)', '&quot;false&quot;', '&quot;0.0&quot;']"
	:answer-index="0"
	explanation="The string &quot;0&quot; is falsy. A space, &quot;false&quot;, and &quot;0.0&quot; are non-empty strings that aren't exactly &quot;0&quot;, so they're truthy."
/>

<Quiz
	question="What does (int) 7.8 give?"
	:options="['7', '8', '7.8', 'An error']"
	:answer-index="0"
	explanation="Casting a float to int cuts off the decimals without rounding. Use round() to round."
/>

<Quiz
	question="Why is &quot;10&quot; == &quot;1e1&quot; true?"
	:options="['Strings are always equal with ==', 'PHP compares only the first character', 'Both are numeric strings, so PHP compares them as numbers, and 1e1 is 10', 'It is a bug in PHP 8']"
	:answer-index="2"
	explanation="When both sides are numeric strings, == compares their numeric values. === would compare the text exactly and say false."
/>

## Up next

You know how PHP decides what's true and false. Now put that to work, and let your code choose what to do, in [Making Decisions: if, elseif, and else](/lessons/php/if-else).
