---
title: "PHP Strings: Length, Case, Search, Replace, and Formatting"
description: "Work with text in PHP: strlen and mb_strlen, changing case, trimming spaces, searching with str_contains, cutting with substr, replacing, and formatting with sprintf and number_format."
---

# Working with Strings

*A label maker lets you type text, fix a typo, make it all capitals, or trim it to fit. PHP's string functions are a label maker with a hundred buttons.*

Websites are mostly text: names, messages, prices, addresses. PHP has a large set of built-in **functions** for working with it. A function is a named tool you call with parentheses, handing it values to work on, like `strlen("Maria")`. You'll write your own in [Writing Functions](/lessons/php/functions); this lesson is about using PHP's.

One thing to know first: string functions don't change the original string. They give back a **new** one, which you can echo or store.

## Length

`strlen()` counts the **bytes** in a string. For plain English letters, that's the same as the number of characters. But letters like `ñ` or `é`, and emoji, take more than one byte each, so for those, use `mb_strlen()`, which counts real characters (the `mb` stands for **multibyte**):

```php
<?php
echo strlen("Maria"), "\n";
echo strlen("Niño"), "\n";
echo mb_strlen("Niño"), "\n";
```

```text
5
5
4
```

When your text might include names from any language, reach for the `mb_` version. Many string functions have one, like `mb_strtoupper()` and `mb_substr()`.

## Changing case

```php
<?php
$title = "the little prince";
echo strtoupper($title), "\n";
echo ucfirst($title), "\n";
echo ucwords($title), "\n";
echo strtolower("SHOUTING"), "\n";
```

```text
THE LITTLE PRINCE
The little prince
The Little Prince
shouting
```

`ucfirst` capitalizes the first letter, and `ucwords` the first letter of every word.

## Trimming spaces

People often type extra spaces by accident, especially in forms. `trim()` removes spaces (and tabs and new lines) from both ends. `ltrim()` does only the left, and `rtrim()` only the right:

```php
<?php
$typed = "   maria@example.com  ";
echo "[" . $typed . "]\n";
echo "[" . trim($typed) . "]\n";
```

```text
[   maria@example.com  ]
[maria@example.com]
```

The square brackets are only there so you can see where the spaces are. Trimming user input is a habit worth building now.

## Searching

```php
<?php
$email = "maria@example.com";
var_dump(str_contains($email, "@"));
var_dump(str_starts_with($email, "maria"));
var_dump(str_ends_with($email, ".org"));
var_dump(strpos($email, "@"));
```

```text
bool(true)
bool(true)
bool(false)
int(5)
```

- `str_contains`, `str_starts_with`, and `str_ends_with` answer yes-or-no questions. They're case-sensitive: `"Maria"` doesn't start with `"maria"`.
- `strpos` gives the **position** where something first appears. Positions start counting at **0**, so the `@` in `maria@...` is at position 5.

`strpos` gives `false` when it finds nothing. Since `0` is a real position (the very start), always check its result with `===`, not `==`, as you learned in [Operators and Expressions](/lessons/php/operators).

## Cutting out a piece

`substr($text, $start, $length)` gives part of a string. Leave out the length to go to the end, and use a negative start to count from the end:

```php
<?php
$code = "PH-2026-0042";
echo substr($code, 0, 2), "\n";
echo substr($code, 3, 4), "\n";
echo substr($code, -4), "\n";
```

```text
PH
2026
0042
```

## Replacing and repeating

```php
<?php
echo str_replace("cats", "dogs", "I love cats. cats are great."), "\n";
echo str_repeat("=", 20), "\n";
echo str_pad("7", 3, "0", STR_PAD_LEFT), "\n";
```

```text
I love dogs. dogs are great.
====================
007
```

- `str_replace(find, replace, text)` replaces **every** match.
- `str_repeat` repeats a string, handy for simple lines in the terminal.
- `str_pad` pads a string to a length. Here, it adds zeros on the left until it's 3 characters long.

## Formatting numbers and text

`number_format()` makes numbers readable, with a thousands separator and a fixed number of decimals:

```php
<?php
echo number_format(1234567.891), "\n";
echo number_format(1234567.891, 2), "\n";
echo number_format(0.5, 2), "\n";
```

```text
1,234,568
1,234,567.89
0.50
```

For more control, `sprintf()` fills values into a pattern. Each `%` marks a spot: `%s` for a string, `%d` for a whole number, and `%.2f` for a decimal with 2 digits after the point. `printf()` does the same, but prints the result straight away:

```php
<?php
$item = "Notebook";
$qty = 3;
$price = 45.5;
$line = sprintf("%s x%d = %.2f", $item, $qty, $qty * $price);
echo $line, "\n";
printf("%-10s|%5d|\n", "Pens", 12);
```

```text
Notebook x3 = 136.50
Pens      |   12|
```

In the last line, `%-10s` means "a string, 10 characters wide, lined up on the left," and `%5d` means "a number, 5 characters wide," lined up on the right. That's perfect for tidy columns.

## Long text: heredoc

For text that spans several lines, PHP has **heredoc** syntax. Start with `<<<` and a name you choose, write the text, and end with the same name on its own line. It works like a double-quoted string, so variables are filled in:

```php
<?php
$name = "Maria";
$message = <<<TEXT
Dear $name,
Thank you for signing up.
See you on Saturday!
TEXT;
echo $message, "\n";
```

```text
Dear Maria,
Thank you for signing up.
See you on Saturday!
```

## Try it

A shop tidies up a product name and prints a price label. Predict each line exactly, including spaces.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="340px"
	:model-value="'&lt;?php\n$raw = &quot;  rice cooker &quot;;\n$name = ucwords(trim($raw));\n$price = 1899.5;\n$sku = &quot;HOME-RC-0107&quot;;\n\necho &quot;[$name]\\n&quot;;\necho strlen($name), &quot;\\n&quot;;\necho substr($sku, 0, 4), &quot;\\n&quot;;\nvar_dump(str_contains($sku, &quot;rc&quot;));\necho &quot;Price: PHP &quot; . number_format($price, 2) . &quot;\\n&quot;;\nprintf(&quot;%s (%d left)\\n&quot;, strtoupper($name), 7);\necho str_repeat(&quot;-&quot;, strlen($name)), &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
[Rice Cooker]
11
HOME
bool(false)
Price: PHP 1,899.50
RICE COOKER (7 left)
-----------
```

`trim` runs first, removing the outer spaces, then `ucwords` capitalizes each word. "Rice Cooker" is 11 characters, including the space in the middle. `str_contains` is case-sensitive, and the SKU has `RC`, not `rc`, so it's false.
:::

## Try it yourself

1. Change the price to `25000`. What does `number_format($price, 2)` print?
2. Use `str_pad` to print the number 42 as `00042`.
3. Use `mb_strtoupper` on `"señor"`, and compare it with `strtoupper("señor")`. Which one gets the `ñ` right?

## Check your understanding

<Quiz
	question="What does strpos(&quot;hello&quot;, &quot;h&quot;) return?"
	:options="['1', 'true', 'false', '0']"
	:answer-index="3"
	explanation="Positions start at 0, and h is the first character. That's why you compare strpos results with === false, since 0 is a real answer."
/>

<Quiz
	question="Which function removes spaces from both ends of a string?"
	:options="['substr', 'trim', 'str_replace', 'strlen']"
	:answer-index="1"
	explanation="trim removes spaces, tabs, and new lines from both ends. ltrim and rtrim handle just one side."
/>

<Quiz
	question="Why use mb_strlen instead of strlen for a name like José?"
	:options="['mb_strlen is faster', 'strlen only works on numbers', 'strlen counts bytes, and é takes more than one byte', 'mb_strlen ignores spaces']"
	:answer-index="2"
	explanation="strlen counts bytes. Letters like é take 2 bytes, so strlen(&quot;José&quot;) is 5, but mb_strlen gives the real count, 4."
/>

## Up next

You saw that `5 == "5"` is true. PHP converts types behind the scenes more often than you might think, and sometimes the results are surprising. Find out when, and how to stay in control, in [Type Juggling and Strict Comparisons](/lessons/php/type-juggling).
