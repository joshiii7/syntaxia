---
title: "PHP switch and match: Choosing Between Many Options"
description: "Replace long elseif chains with switch and match in PHP: how cases and break work, fall-through, and why PHP 8's match expression is stricter and shorter."
---

# switch and match

*A vending machine doesn't ask "Is it A1? No? Is it A2? No? Is it A3?" You press a code, and it goes straight to the right slot.*

In [Making Decisions](/lessons/php/if-else), you chained `elseif`s. When every condition checks the **same** variable against different values, PHP offers two tidier tools: the classic `switch` statement, and the newer `match` expression (added in PHP 8).

## The long way

Here's an `elseif` chain that turns a day number into a name:

```php
<?php
$day = 3;

if ($day === 1) {
    $name = "Monday";
} elseif ($day === 2) {
    $name = "Tuesday";
} elseif ($day === 3) {
    $name = "Wednesday";
} else {
    $name = "Some other day";
}
echo $name, "\n";
```

```text
Wednesday
```

It works, but `$day ===` is repeated on every line. Both `switch` and `match` say "look at `$day`" just once.

## switch

```php
<?php
$day = 3;

switch ($day) {
    case 1:
        $name = "Monday";
        break;
    case 2:
        $name = "Tuesday";
        break;
    case 3:
        $name = "Wednesday";
        break;
    default:
        $name = "Some other day";
}
echo $name, "\n";
```

```text
Wednesday
```

- `switch ($day)` names the value to check.
- Each `case 1:` is a possible value, followed by the code to run.
- `break` means "done, leave the switch."
- `default:` runs when no case matched, like a final `else`.

## Forgetting break

`break` isn't decoration. Without it, PHP keeps going into the **next** case's code, even though that case doesn't match. That's called **fall-through**:

```php
<?php
$medal = "silver";

switch ($medal) {
    case "gold":
        echo "First place!\n";
    case "silver":
        echo "Second place!\n";
    case "bronze":
        echo "Third place!\n";
}
```

```text
Second place!
Third place!
```

The silver winner is also told they came third. Forgetting `break` is the most common `switch` bug.

Fall-through does have one good use: letting several values share the same code, by stacking cases with nothing between them:

```php
<?php
$day = "Sunday";

switch ($day) {
    case "Saturday":
    case "Sunday":
        echo "Weekend!\n";
        break;
    default:
        echo "School day.\n";
}
```

```text
Weekend!
```

One more catch: `switch` compares with loose `==`, so the type juggling surprises from [Type Juggling and Strict Comparisons](/lessons/php/type-juggling) apply. A `case "1":` would match the number `1`, too.

## match: shorter and stricter

PHP 8 added `match`. It does the same job, with less typing and fewer traps:

```php
<?php
$day = 3;

$name = match ($day) {
    1 => "Monday",
    2 => "Tuesday",
    3 => "Wednesday",
    default => "Some other day",
};
echo $name, "\n";
```

```text
Wednesday
```

How `match` differs from `switch`:

- **It gives back a value**, so you can store it straight into a variable, like `$name = match (...)`. (That's what makes it an *expression*, not a statement. Notice the `;` after the closing brace.)
- **No `break` needed**, and no fall-through. Each arm is `value => result`, and only one arm ever runs.
- **It compares strictly**, with `===`. The number `1` doesn't match the string `"1"`.
- **Several values** share an arm with commas: `"Saturday", "Sunday" => "Weekend!"`.

## When nothing matches

If no arm matches and there's no `default`, `match` stops with an error instead of quietly doing nothing:

```php
<?php
$size = "XL";

$price = match ($size) {
    "S" => 150,
    "M" => 180,
    "L" => 200,
};
// error: Uncaught UnhandledMatchError: Unhandled match case 'XL'
```

That's a feature: a value you forgot about gets noticed right away, instead of causing a hidden bug later. Add a `default` arm when there really is a sensible fallback.

## match with conditions

To choose based on ranges, like grades, use `match (true)`. Each arm is then a condition, and the first one that's `true` wins:

```php
<?php
$score = 84;

$grade = match (true) {
    $score >= 90 => "A",
    $score >= 80 => "B",
    $score >= 70 => "C",
    default => "Needs improvement",
};
echo "Grade: $grade\n";
```

```text
Grade: B
```

## Which one to use?

- Choosing a **value** based on another value: use `match`. That's most cases.
- Running **several lines of code** for each case: `switch`, or `if`/`elseif`.
- Checking **different variables** or complicated conditions: `if`/`elseif`.

## Try it

A café's order system works out a drink size, a price, and a message. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="400px"
	:model-value="'&lt;?php\n$sizeCode = &quot;M&quot;;\n$drink = &quot;iced tea&quot;;\n$quantity = 2;\n\n$size = match ($sizeCode) {\n    &quot;S&quot; =&gt; &quot;small&quot;,\n    &quot;M&quot; =&gt; &quot;medium&quot;,\n    &quot;L&quot;, &quot;XL&quot; =&gt; &quot;large&quot;,\n};\n\n$pricePerCup = match (true) {\n    $size === &quot;large&quot; =&gt; 90,\n    $drink === &quot;iced tea&quot; =&gt; 65,\n    default =&gt; 55,\n};\n\necho &quot;$quantity $size $drink: &quot; . $quantity * $pricePerCup . &quot; pesos\\n&quot;;\n\nswitch ($quantity) {\n    case 1:\n        echo &quot;Enjoy your drink!\\n&quot;;\n        break;\n    case 2:\n        echo &quot;One for a friend?\\n&quot;;\n    case 3:\n        echo &quot;Sharing is caring.\\n&quot;;\n        break;\n    default:\n        echo &quot;Party time!\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
2 medium iced tea: 130 pesos
One for a friend?
Sharing is caring.
```

`"M"` gives `"medium"`. In the price `match (true)`, the size isn't large, but the drink is iced tea, so it's 65, and 2 cups make 130. The `switch` has a missing `break` in `case 2`, so it falls through and prints the `case 3` line too.
:::

## Try it yourself

1. Change `$sizeCode` to `"XL"`. What's the price now?
2. Change `$sizeCode` to `"XXL"`. What happens, and how would you fix it?
3. Rewrite the `switch` as a `match` that picks the message, and echo the result. What happened to the fall-through?

## Check your understanding

<Quiz
	question="What happens in a switch when a case has no break?"
	:options="['The code keeps running into the next case', 'PHP shows an error', 'The switch starts again from the top', 'Nothing, break is optional']"
	:answer-index="0"
	explanation="Without break, PHP falls through into the next case's code, even though that case doesn't match."
/>

<Quiz
	question="What does match do if no arm matches and there's no default?"
	:options="['Returns null', 'Returns false', 'Uses the first arm', 'Throws an UnhandledMatchError']"
	:answer-index="3"
	explanation="match stops with an UnhandledMatchError, so a forgotten value gets noticed right away."
/>

<Quiz
	question="How does match compare values?"
	:options="['Loosely, like ==', 'Strictly, like ===', 'Only by type', 'Alphabetically']"
	:answer-index="1"
	explanation="match uses strict comparison, so 1 and &quot;1&quot; don't match. switch uses loose ==."
/>

## Up next

Your code can choose. Next, it'll repeat: counting, going through lists, and running until a job is done, in [Loops: for, while, and foreach](/lessons/php/loops).
