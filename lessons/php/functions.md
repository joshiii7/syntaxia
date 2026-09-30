---
title: "PHP Functions: How to Write and Call Your Own"
description: "Write your own PHP functions: defining and calling them, passing values in, returning results, and why return is different from echo."
---

# Writing Functions

*A recipe card says "Pancakes: mix, pour, flip." Once it's written, you just say "make pancakes," and you never have to explain the steps again.*

You've used plenty of PHP's built-in functions: `strlen`, `strtoupper`, `number_format`. Now you'll write your own. A **function** is a named block of code you write once and run whenever you need it, just by calling its name.

## A recipe card

```php
<?php
function greet() {
    echo "Hello! Welcome to the shop.\n";
}

greet();
greet();
```

```text
Hello! Welcome to the shop.
Hello! Welcome to the shop.
```

- `function greet()` **defines** the function: the keyword `function`, a name, and parentheses.
- The block in curly braces is the **body**: the steps on the recipe card.
- Defining a function doesn't run it. `greet();` **calls** it, and each call runs the body once.

Function names follow the same rules as variable names, but without the `$`. The usual PHP style is camelCase, starting with a verb that says what the function does: `greet`, `calculateTotal`, `sendEmail`.

## Giving it something to work with

A recipe for pancakes is fine, but a recipe that says "make pancakes for **this many** people" is more useful. Values you hand to a function are called **parameters**:

```php
<?php
function greet($name) {
    echo "Hello, $name! Welcome to the shop.\n";
}

greet("Maria");
greet("Ben");
```

```text
Hello, Maria! Welcome to the shop.
Hello, Ben! Welcome to the shop.
```

`$name` is the parameter: a variable that gets its value from the call. When you call `greet("Maria")`, `"Maria"` is the **argument**, the actual value passed in. Several parameters are separated by commas:

```php
<?php
function describePet($name, $animal) {
    echo "$name is a $animal.\n";
}

describePet("Bantay", "dog");
describePet("Mingming", "cat");
```

```text
Bantay is a dog.
Mingming is a cat.
```

The arguments are matched to the parameters in order: the first to `$name`, the second to `$animal`.

## Giving back a result: return

The functions so far print something. But most useful functions **work something out and hand it back**, like `strlen` gives you back a number. That's what `return` does:

```php
<?php
function addTax($price) {
    return $price * 1.12;
}

$total = addTax(100);
echo "Total: $total\n";
echo "Two items: " . (addTax(100) + addTax(50)) . "\n";
```

```text
Total: 112
Two items: 168
```

The call `addTax(100)` is replaced by the value it returns, `112`, so you can store it, echo it, or use it in a calculation, like any other value.

`return` also **ends the function** immediately. Any lines after it in the same run are skipped:

```php
<?php
function checkAge($age) {
    if ($age < 0) {
        return "That's not a real age.";
    }
    return $age >= 18 ? "adult" : "minor";
}

echo checkAge(-4), "\n";
echo checkAge(20), "\n";
```

```text
That's not a real age.
adult
```

## return vs echo

This is the most common beginner mix-up with functions. They look like they do the same thing, but they don't:

- `echo` **prints** a value out, and that's it. The rest of your code can't use it.
- `return` **hands the value back** to the code that called the function, which decides what to do with it.

```php
<?php
function doubleEcho($n) {
    echo $n * 2;
}
function doubleReturn($n) {
    return $n * 2;
}

$a = doubleEcho(5);
echo "\n";
$b = doubleReturn(5);
var_dump($a, $b);
```

```text
10
NULL
int(10)
```

`doubleEcho` printed `10`, but it returned nothing, so `$a` is `NULL`. `doubleReturn` printed nothing, but `$b` holds `10`, ready to use. As a rule, have functions **return** values, and do the echoing outside. That makes them reusable in many more places: in a web page, in the terminal, in another calculation.

## Why write functions?

- **No repetition.** Write the steps once, use them everywhere. Fix a bug once, and it's fixed everywhere.
- **Names explain.** `calculateShipping($weight)` tells a reader what's happening, without making them read the details.
- **Smaller pieces.** A long script split into well-named functions is far easier to read and test.

A function can be called before it's defined in the file, since PHP reads the whole file before running it. Still, it's tidiest to define functions near the top, or, as you'll see in [Splitting Code with include and require](/lessons/php/include-and-require), in a separate file.

## Try it

A school canteen uses a few small functions. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="420px"
	:model-value="'&lt;?php\nfunction formatPesos($amount) {\n    return &quot;PHP &quot; . number_format($amount, 2);\n}\n\nfunction mealPrice($meal) {\n    return match ($meal) {\n        &quot;rice meal&quot; =&gt; 65,\n        &quot;pasta&quot; =&gt; 55,\n        default =&gt; 40,\n    };\n}\n\nfunction applyDiscount($price, $isStudent) {\n    if ($isStudent) {\n        return $price * 0.8;\n    }\n    return $price;\n}\n\nfunction printReceipt($meal, $isStudent) {\n    $price = applyDiscount(mealPrice($meal), $isStudent);\n    echo &quot;$meal: &quot; . formatPesos($price) . &quot;\\n&quot;;\n}\n\nprintReceipt(&quot;rice meal&quot;, true);\nprintReceipt(&quot;pasta&quot;, false);\nprintReceipt(&quot;sandwich&quot;, true);\necho formatPesos(mealPrice(&quot;pasta&quot;) * 3), &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
rice meal: PHP 52.00
pasta: PHP 55.00
sandwich: PHP 32.00
PHP 165.00
```

Each call is worked out from the inside: `mealPrice` gives the base price, `applyDiscount` takes 20% off for students, and `formatPesos` formats it. A sandwich isn't on the list, so it's 40, and 80% of that is 32.
:::

## Try it yourself

1. Add a `"soup"` meal for 35 pesos, and print a receipt for it.
2. Write a function `isEven($n)` that returns `true` or `false`. Test it with `var_dump(isEven(4));`.
3. Change `formatPesos` to use `echo` instead of `return`. What goes wrong in `printReceipt`, and why?

## Check your understanding

<Quiz
	question="What's the difference between a parameter and an argument?"
	:options="['They mean exactly the same', 'Arguments are only for built-in functions', 'A parameter is the variable in the definition; an argument is the value passed in the call', 'A parameter is always a string']"
	:answer-index="2"
	explanation="In function greet($name), $name is the parameter. In greet(&quot;Maria&quot;), &quot;Maria&quot; is the argument."
/>

<Quiz
	question="What happens to the lines after a return that runs?"
	:options="['They run afterward', 'They run before the return', 'PHP shows a warning', 'They are skipped; return ends the function']"
	:answer-index="3"
	explanation="return hands back its value and ends the function right away."
/>

<Quiz
	question="A function echoes its result instead of returning it. What does $x = thatFunction(); store?"
	:options="['The result', 'null', 'The string that was echoed', 'true']"
	:answer-index="1"
	explanation="Without return, a function gives back null. The echoed text goes to the output, not into $x."
/>

## Up next

Your functions accept any value for any parameter. Next, you'll make them safer and more flexible, with default values, named arguments, and types, in [Parameters, Types, and Return Values](/lessons/php/parameters).
