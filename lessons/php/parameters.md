---
title: "PHP Function Parameters: Defaults, Named Arguments, and Types"
description: "Make PHP functions safer and easier to call: default values, named arguments, parameter and return types, nullable types, void, and strict_types."
---

# Parameters, Types, and Return Values

*A mail slot shaped for letters won't take a parcel. That's not rudeness; it stops the wrong thing going in. Types give your functions a slot of the right shape.*

In [Writing Functions](/lessons/php/functions), your functions accepted anything. Call `addTax("banana")` and PHP would happily try. This lesson makes functions easier to call correctly, and harder to call wrongly.

## Default values

A parameter can have a **default value**, used when the caller leaves that argument out:

```php
<?php
function greet($name, $greeting = "Hello") {
    return "$greeting, $name!";
}

echo greet("Maria"), "\n";
echo greet("Maria", "Good morning"), "\n";
```

```text
Hello, Maria!
Good morning, Maria!
```

Parameters with defaults are **optional**. Put them after the required ones. Leaving out a required argument stops the script:

```php
<?php
function greet($name, $greeting = "Hello") {
    return "$greeting, $name!";
}

echo greet();
// error: Too few arguments to function greet(), 0 passed
```

## Named arguments

Normally, arguments are matched by position. With **named arguments**, you write the parameter's name, a colon, then the value. That lets you skip optional parameters, and makes a call easier to read:

```php
<?php
function makeTicket($event, $seats = 1, $isVip = false, $note = "") {
    $vip = $isVip ? "VIP " : "";
    return "$vip$event x$seats $note";
}

echo makeTicket("Concert", 2, false, "near the stage"), "\n";
echo makeTicket("Concert", note: "near the stage"), "\n";
echo makeTicket(isVip: true, event: "Concert"), "\n";
```

```text
Concert x2 near the stage
Concert x1 near the stage
VIP Concert x1
```

Compare the first two calls. In the first, what does `false` mean? You'd have to check the definition. The second says exactly what it's setting, and skips the rest. Named arguments can even come in any order.

PHP's own functions accept named arguments too, like `str_pad("7", 3, "0", pad_type: STR_PAD_LEFT)`.

## Parameter types

You can write a type before each parameter, so the function only accepts that kind of value:

```php
<?php
declare(strict_types=1);

function area(int $width, int $height) {
    return $width * $height;
}

echo area(3, 4), "\n";
echo area("3", 4), "\n";
// error: area(): Argument #1 ($width) must be of type int, string given
```

The first call works. The second stops with a clear error: it names the function, the argument, and what went wrong. That's much better than a wrong answer showing up somewhere far away later.

The types you'll use most: `int`, `float`, `string`, `bool`, and `array`.

## declare(strict_types=1)

That first line, `declare(strict_types=1);`, matters. Without it, PHP uses type juggling (from [Type Juggling and Strict Comparisons](/lessons/php/type-juggling)) and converts values when it can: `area("3", 4)` would quietly turn `"3"` into `3` and return 12. With strict types on, PHP refuses any value of the wrong type.

- It must be the **very first statement** in the file, right after `<?php`.
- It applies to the file it's in, for the function calls made in that file.
- There's one small exception: an `int` is accepted where a `float` is expected, since every whole number is a valid decimal.

Strict types catch mistakes early, so most modern PHP code turns them on. From here on, this track does too.

## Return types

After the parentheses, a colon and a type say what the function **returns**:

```php
<?php
declare(strict_types=1);

function average(int $a, int $b): float {
    return ($a + $b) / 2;
}

function sayHi(string $name): void {
    echo "Hi, $name!\n";
}

echo average(7, 8), "\n";
sayHi("Ben");
```

```text
7.5
Hi, Ben!
```

- `: float` promises the function returns a float. If it tried to return something else, PHP would stop with an error.
- `: void` means "returns nothing." It's for functions that just *do* something, like printing.

What about `average(8, 8)`? `(8 + 8) / 2` is the int `8`. Does that break the `float` promise? No: that's the int-to-float exception again, so PHP converts it, and `var_dump(average(8, 8))` shows `float(8)`.

## Nullable and union types

Sometimes a value might be missing. Put a `?` before a type to also allow `null`:

```php
<?php
declare(strict_types=1);

function welcome(?string $nickname): string {
    return "Welcome, " . ($nickname ?? "friend") . "!";
}

echo welcome("Mimi"), "\n";
echo welcome(null), "\n";
```

```text
Welcome, Mimi!
Welcome, friend!
```

And when a parameter can be one of several types, list them with `|`, called a **union type**: `int|float $amount` accepts either kind of number.

## Try it

A delivery app works out a fee. Predict each line, and which call stops the script.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="420px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nfunction deliveryFee(float $distanceKm, bool $isRush = false, ?string $promo = null): float {\n    $fee = 40 + $distanceKm * 10;\n    if ($isRush) {\n        $fee *= 1.5;\n    }\n    if ($promo === &quot;FREESHIP&quot;) {\n        $fee = 0;\n    }\n    return $fee;\n}\n\nfunction showFee(string $label, float $fee): void {\n    echo str_pad($label, 12) . number_format($fee, 2) . &quot;\\n&quot;;\n}\n\nshowFee(&quot;Standard&quot;, deliveryFee(3));\nshowFee(&quot;Rush&quot;, deliveryFee(3, true));\nshowFee(&quot;Promo&quot;, deliveryFee(8.5, promo: &quot;FREESHIP&quot;));\nshowFee(&quot;Far rush&quot;, deliveryFee(isRush: true, distanceKm: 12));\nshowFee(&quot;Typo&quot;, deliveryFee(&quot;5&quot;));\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Standard    70.00
Rush        105.00
Promo       0.00
Far rush    240.00

Fatal error: Uncaught TypeError: deliveryFee(): Argument #1 ($distanceKm) must be of type float, string given, called in C:\Users\maria\php-practice\index.php on line 23 and defined in C:\Users\maria\php-practice\index.php:4
Stack trace:
#0 C:\Users\maria\php-practice\index.php(23): deliveryFee('5')
#1 {main}
  thrown in C:\Users\maria\php-practice\index.php on line 4
```

The int `3` is accepted as a float. Rush multiplies 70 by 1.5 to get 105. The promo sets the fee to 0 (an int, which is fine for a float return). The named arguments come in a different order, which is allowed. The last call passes the string `"5"`, and with strict types on, that stops the script with a `TypeError`. (Your file path will differ.)
:::

## Try it yourself

1. Remove the `declare(strict_types=1);` line and run it again. What happens to the "Typo" line now?
2. Add a parameter `int $items = 1` to `deliveryFee`, and charge 5 extra per item after the first.
3. Write a function `fullName(string $first, string $last, ?string $middle = null): string` that includes the middle name only when it's given.

## Check your understanding

<Quiz
	question="With strict_types on, what happens when you pass &quot;10&quot; to an int parameter?"
	:options="['It becomes 10', 'It becomes 0', 'PHP stops with a TypeError', 'It is ignored']"
	:answer-index="2"
	explanation="Strict types refuse values of the wrong type. Without strict_types, PHP would convert &quot;10&quot; to 10."
/>

<Quiz
	question="What does the return type : void mean?"
	:options="['The function returns nothing', 'The function returns null or a string', 'The function can return anything', 'The function has no parameters']"
	:answer-index="0"
	explanation="void promises the function doesn't return a value. It's for functions that just do something."
/>

<Quiz
	question="Which call uses a named argument to skip the optional $seats in makeTicket($event, $seats = 1, $isVip = false)?"
	:options="['makeTicket(&quot;Show&quot;, isVip: true)', 'makeTicket(&quot;Show&quot;, , true)', 'makeTicket(&quot;Show&quot;, true)', 'makeTicket(isVip = true, &quot;Show&quot;)']"
	:answer-index="0"
	explanation="isVip: true sets that parameter by name, and $seats keeps its default. Passing true by position would put it in $seats."
/>

## Up next

Why can't a function see a variable you made outside it? That's about **scope**, the rules for where each variable can be seen, in [Variable Scope](/lessons/php/scope).
