---
title: "PHP if, elseif, and else: Making Decisions in Your Code"
description: "Make PHP choose what to do with if, elseif, and else: conditions, combining them with && and ||, nesting, and the alternative syntax for HTML templates."
---

# Making Decisions: if, elseif, and else

*At a fork in a trail, a signpost says "Summit: left. Lake: right." You read it, and take one path. An if statement is a signpost for your code.*

So far, every script has run every line, top to bottom. Real programs need to choose: show "Welcome back" to someone logged in and "Please log in" to everyone else, or charge a student price to students only. That's what `if` is for.

## The signpost

```php
<?php
$temperature = 34;

if ($temperature > 30) {
    echo "It's hot. Bring water!\n";
}
echo "Have a nice walk.\n";
```

```text
It's hot. Bring water!
Have a nice walk.
```

- The **condition** goes in parentheses after `if`. It's any expression that gives true or false (or a value PHP converts, using the truthy and falsy rules from [Type Juggling](/lessons/php/type-juggling)).
- The code in **curly braces** `{ }` runs only when the condition is true. That's called a **block**.
- After the block, the script carries on as usual, either way.

Indent the code inside a block by 4 spaces. PHP doesn't need it, but it shows at a glance which lines belong to the `if`.

## else: the other path

`else` gives a block to run when the condition is false:

```php
<?php
$age = 15;

if ($age >= 18) {
    echo "You can vote.\n";
} else {
    echo "You can vote in " . (18 - $age) . " years.\n";
}
```

```text
You can vote in 3 years.
```

Exactly one of the two blocks runs, never both, never neither.

## elseif: more than two paths

For several possibilities, chain conditions with `elseif`. PHP checks them from the top and runs the **first** block whose condition is true, then skips the rest:

```php
<?php
$score = 84;

if ($score >= 90) {
    $grade = "A";
} elseif ($score >= 80) {
    $grade = "B";
} elseif ($score >= 70) {
    $grade = "C";
} else {
    $grade = "Needs improvement";
}
echo "Grade: $grade\n";
```

```text
Grade: B
```

84 is also `>= 70`, but PHP never checks that line, since it already found a match. That's why the order matters: put the strictest condition first. If `>= 70` came first, a score of 95 would get a C.

(`else if`, with a space, works too. Most PHP code uses `elseif`.)

## Combining conditions

Use `&&` (and), `||` (or), and `!` (not) from [Operators and Expressions](/lessons/php/operators) to check several things at once:

```php
<?php
$age = 16;
$hasPermission = true;
$isMember = false;

if ($age >= 18 || $hasPermission) {
    echo "You can join the trip.\n";
}
if (!$isMember) {
    echo "Sign up to get a member discount.\n";
}
```

```text
You can join the trip.
Sign up to get a member discount.
```

## Blocks inside blocks

An `if` can go inside another one. That's called **nesting**:

```php
<?php
$isLoggedIn = true;
$isAdmin = false;

if ($isLoggedIn) {
    echo "Welcome back!\n";
    if ($isAdmin) {
        echo "Admin tools are ready.\n";
    }
} else {
    echo "Please log in.\n";
}
```

```text
Welcome back!
```

Nesting more than two or three levels deep gets hard to read. Often, `&&` can flatten it: `if ($isLoggedIn && $isAdmin)`.

## A classic mistake: `=` instead of `===`

```php
<?php
$role = "student";

if ($role = "teacher") {
    echo "Hello, teacher!\n";
}
echo "Role is now: $role\n";
```

```text
Hello, teacher!
Role is now: teacher
```

With a single `=`, the condition doesn't compare anything. It **stores** `"teacher"` in `$role`, and the stored value, a non-empty string, is truthy. So the block always runs, and the variable is changed too. PHP doesn't warn you, so it's worth double-checking every condition for this.

## if in HTML pages

When PHP builds HTML, as in [Mixing PHP and HTML](/lessons/php/php-and-html), curly braces scattered between HTML tags are hard to follow. PHP has an **alternative syntax** for this: a colon `:` instead of `{`, and `endif;` instead of `}`:

```php
<?php $cartCount = 0; ?>
<?php if ($cartCount > 0): ?>
<p>You have <?= $cartCount ?> items in your cart.</p>
<?php else: ?>
<p>Your cart is empty.</p>
<?php endif; ?>
```

```text
<p>Your cart is empty.</p>
```

It works exactly the same; it's just easier to read inside a page. Use braces in pure PHP, and this style in HTML templates.

## Try it

A movie website decides what to show a visitor. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="380px"
	:model-value="'&lt;?php\n$age = 14;\n$withAdult = true;\n$rating = &quot;PG-13&quot;;\n$tickets = 3;\n\nif ($rating === &quot;G&quot;) {\n    echo &quot;Everyone can watch.\\n&quot;;\n} elseif ($rating === &quot;PG-13&quot; &amp;&amp; ($age &gt;= 13 || $withAdult)) {\n    echo &quot;Enjoy the movie!\\n&quot;;\n} else {\n    echo &quot;Sorry, pick another movie.\\n&quot;;\n}\n\nif ($tickets &gt; 4) {\n    echo &quot;Group discount applied.\\n&quot;;\n} elseif ($tickets &gt; 1) {\n    echo &quot;Buying for friends? Nice.\\n&quot;;\n}\n\nif ($age &lt; 12) {\n    echo &quot;Kids\' combo available.\\n&quot;;\n}\necho &quot;Seats: $tickets\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Enjoy the movie!
Buying for friends? Nice.
Seats: 3
```

The rating is PG-13 and the age is over 13, so the second branch runs. For the tickets, 3 isn't more than 4, but it is more than 1. The kids' combo line is skipped, because this `if` has no `else`, and 14 isn't under 12.
:::

## Try it yourself

1. Change `$age` to 10 and `$withAdult` to `false`. Which lines print now?
2. Add an `else` to the tickets `if` that prints `Enjoy the show on your own.`, and test it with 1 ticket.
3. Write an `if` that prints `Weekend!` when a variable `$day` is `"Saturday"` or `"Sunday"`.

## Check your understanding

<Quiz
	question="With $score = 95, which block runs? if ($score >= 70) { A } elseif ($score >= 90) { B }"
	:options="['B', 'A', 'Both A and B', 'Neither']"
	:answer-index="1"
	explanation="PHP runs the first block whose condition is true, and 95 >= 70 is checked first. Put the strictest condition first."
/>

<Quiz
	question="What's wrong with if ($role = &quot;admin&quot;)?"
	:options="['Nothing, it compares the role', 'It is a syntax error', 'It only works for numbers', 'A single = stores &quot;admin&quot; in $role, so the condition is always true']"
	:answer-index="3"
	explanation="= assigns. The condition becomes the stored value, a non-empty string, which is truthy. Use === to compare."
/>

<Quiz
	question="In the alternative syntax for templates, what ends an if?"
	:options="['}', 'end;', 'endif;', 'fi']"
	:answer-index="2"
	explanation="The template-friendly style uses a colon after the condition and endif; at the end."
/>

## Up next

A long chain of `elseif`s that all check the same variable can get repetitive. PHP has two tidier tools for that, in [switch and match](/lessons/php/switch-and-match).
