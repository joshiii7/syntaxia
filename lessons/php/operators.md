---
title: "PHP Operators: Arithmetic, Comparison, Logical, and More"
description: "Calculate and compare in PHP: arithmetic and precedence, comparison operators, the spaceship operator, &&, ||, and !, the ternary operator, and the null coalescing operator ??."
---

# Operators and Expressions

*A calculator has buttons for adding, dividing, and comparing. Operators are PHP's buttons.*

An **operator** is a symbol that does something with values, like `+` or `>`. An **expression** is any piece of code that produces a value: `5`, `$price`, and `$price * 2` are all expressions. Operators combine small expressions into bigger ones.

## Arithmetic

| Operator | Does | Example | Result |
|---|---|---|---|
| `+` | add | `7 + 2` | `9` |
| `-` | subtract | `7 - 2` | `5` |
| `*` | multiply | `7 * 2` | `14` |
| `/` | divide | `7 / 2` | `3.5` |
| `%` | remainder | `7 % 2` | `1` |
| `**` | power | `7 ** 2` | `49` |

The remainder `%` is more useful than it looks. `$n % 2` is `0` for even numbers and `1` for odd ones.

## Which goes first?

Just like in math class, multiplication and division happen before addition and subtraction. Use parentheses to change the order, or just to make it clearer:

```php
<?php
echo 2 + 3 * 4, "\n";
echo (2 + 3) * 4, "\n";
echo 2 ** 3 ** 2, "\n";
```

```text
14
20
512
```

The last one is a curiosity: `**` works from right to left, so it's `2 ** 9`, not `8 ** 2`. When in doubt, add parentheses.

## Comparing values

Comparison operators give a boolean, `true` or `false`:

| Operator | Means |
|---|---|
| `===` | equal, and the same type |
| `!==` | not equal, or not the same type |
| `==` | equal after converting types |
| `!=` | not equal after converting types |
| `<`, `>` | less than, greater than |
| `<=`, `>=` | less than or equal, greater than or equal |

Notice there are two kinds of "equal". `===` (three equal signs) is **strict**: the values must match *and* be the same type. `==` (two) is **loose**: PHP converts the values to a common type first.

```php
<?php
var_dump(5 === 5);
var_dump(5 === "5");
var_dump(5 == "5");
```

```text
bool(true)
bool(false)
bool(true)
```

The number 5 and the string `"5"` aren't the same type, so `===` says `false`, but `==` converts and says `true`. Loose comparison has some real surprises, which you'll see in [Type Juggling and Strict Comparisons](/lessons/php/type-juggling). Until then, a simple rule: **use `===` and `!==`**.

And don't mix up `=` and `===`. One equal sign *stores* a value; three *compare* two values.

## The spaceship operator

`<=>` compares two values and gives `-1` if the left is smaller, `0` if they're equal, and `1` if the left is bigger. It's called the **spaceship** operator, because `<=>` looks a bit like one. You'll use it for sorting in [Array Functions](/lessons/php/array-functions).

```php
<?php
echo 3 <=> 8, "\n";
echo 8 <=> 8, "\n";
echo 9 <=> 8, "\n";
```

```text
-1
0
1
```

## Logical operators: and, or, not

To combine true/false values:

| Operator | Name | True when |
|---|---|---|
| `&&` | and | both sides are true |
| `\|\|` | or | at least one side is true |
| `!` | not | the value is false (it flips it) |

```php
<?php
$age = 15;
$hasTicket = true;

var_dump($age >= 13 && $hasTicket);
var_dump($age >= 18 || $hasTicket);
var_dump(!$hasTicket);
```

```text
bool(true)
bool(true)
bool(false)
```

PHP also has the words `and` and `or`, but they behave differently from `&&` and `||` in some situations, which leads to confusing bugs. Stick with `&&` and `||`.

## The ternary operator

The **ternary** operator picks one of two values based on a condition. It reads: *condition* `?` *value if true* `:` *value if false*.

```php
<?php
$score = 72;
$result = $score >= 75 ? "passed" : "try again";
echo "You $result.\n";
```

```text
You try again.
```

It's perfect for small either/or choices. For anything more complicated, use `if`, from [Making Decisions](/lessons/php/if-else).

## The null coalescing operator `??`

Often you want "this value, or a default if it's missing." `??` does exactly that. It gives the left side if that exists and isn't `null`; otherwise, the right side:

```php
<?php
$nickname = null;
echo $nickname ?? "Guest", "\n";

$nickname = "Mimi";
echo $nickname ?? "Guest", "\n";

echo $undefinedThing ?? "No warning here", "\n";
```

```text
Guest
Mimi
No warning here
```

The last line shows `??`'s superpower: it doesn't warn when the variable doesn't exist at all. That makes it ideal for form data, which may or may not have been sent, as you'll see in [Handling Forms](/lessons/php/forms).

## Try it

A cinema works out ticket prices. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="340px"
	:model-value="'&lt;?php\n$age = 12;\n$isStudent = true;\n$basePrice = 250;\n$promoCode = null;\n\n$discount = ($age &lt; 13 || $isStudent) ? 50 : 0;\n$price = $basePrice - $discount;\necho &quot;Price: $price\\n&quot;;\n\necho &quot;Code used: &quot; . ($promoCode ?? &quot;none&quot;) . &quot;\\n&quot;;\necho &quot;Even-numbered seat? &quot; . (17 % 2 === 0 ? &quot;yes&quot; : &quot;no&quot;) . &quot;\\n&quot;;\nvar_dump($price === &quot;200&quot;);\nvar_dump($price &gt; 150 &amp;&amp; !$isStudent);\necho $price &lt;=&gt; 200, &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Price: 200
Code used: none
Even-numbered seat? no
bool(false)
bool(false)
0
```

`$age < 13` is true, so the discount is 50 and the price is 200. `$price === "200"` is false because one side is an int and the other a string. `!$isStudent` is false, so the `&&` is false, and `200 <=> 200` is `0`.
:::

## Try it yourself

1. Change `$age` to 20 and `$isStudent` to `false`. What's the price now?
2. Give `$promoCode` a value, like `"SUMMER"`. What does the Code used line print?
3. Change `===` to `==` in the `var_dump($price === "200")` line. What changes, and why?

## Check your understanding

<Quiz
	question="What does 10 - 2 * 3 give?"
	:options="['24', '14', '6', '4']"
	:answer-index="3"
	explanation="Multiplication comes first: 2 * 3 is 6, then 10 - 6 is 4."
/>

<Quiz
	question="What does 7 === &quot;7&quot; give?"
	:options="['false', 'true', 'An error', '7']"
	:answer-index="0"
	explanation="=== needs the same value AND the same type. An int and a string are different types, so it's false."
/>

<Quiz
	question="What does $name ?? &quot;Guest&quot; give when $name is null?"
	:options="['null', 'A warning', '&quot;Guest&quot;', 'An empty string']"
	:answer-index="2"
	explanation="?? gives the left side unless it's missing or null, in which case it gives the right side."
/>

## Up next

You've combined strings with the dot. PHP has dozens of functions for working with text, too. Explore them in [Working with Strings](/lessons/php/strings).
