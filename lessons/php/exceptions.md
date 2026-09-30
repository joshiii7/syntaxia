---
title: "PHP Exceptions: try, catch, finally, and throw Explained"
description: "Handle problems in PHP with exceptions: throw them when something is wrong, catch them with try and catch, clean up with finally, write your own exception classes, and show errors safely."
---

# Errors and Exceptions

*A fire alarm doesn't put out the fire. It makes sure the right people hear about it, right away, so someone who knows what to do can deal with it.*

Things go wrong in every program: a file is missing, someone types a negative age, a database stops answering. So far, when PHP hit a serious problem, the script simply stopped with a "Fatal error." This lesson shows how to **handle** problems: notice them, respond sensibly, and keep going when you can.

## Three kinds of trouble

You've already met all three:

- **Parse errors**: PHP can't even read the file, like a missing semicolon. Nothing runs. You fix these while writing code.
- **Warnings**: PHP noticed something odd, like an undefined variable, printed a message, and carried on.
- **Exceptions and errors that are thrown**: PHP (or your code) raises the alarm, and the script stops unless something **catches** it. The `TypeError` from [Parameters, Types, and Return Values](/lessons/php/parameters) and the `UnhandledMatchError` from [switch and match](/lessons/php/switch-and-match) were both this kind.

This lesson is about the third kind.

## Catching: try and catch

Put code that might fail inside `try`. If something inside it throws, PHP jumps straight to the matching `catch` block, instead of stopping the script:

```php
<?php
declare(strict_types=1);

try {
    echo "Before\n";
    echo intdiv(10, 0), "\n";
    echo "This line is skipped\n";
} catch (DivisionByZeroError $e) {
    echo "Problem: " . $e->getMessage() . "\n";
}
echo "The script carries on.\n";
```

```text
Before
Problem: Division by zero
The script carries on.
```

- When `intdiv(10, 0)` throws, the rest of the `try` block is skipped.
- `catch (DivisionByZeroError $e)` says which kind of problem this block handles. The problem itself, an **exception object**, lands in `$e`.
- `$e->getMessage()` gives the description.

If nothing is thrown, the `catch` block is skipped entirely.

## Throwing your own

Your own code can raise the alarm with `throw`. That's the right move when a function is given something it can't work with:

```php
<?php
declare(strict_types=1);

function setAge(int $age): int
{
    if ($age < 0 || $age > 130) {
        throw new InvalidArgumentException("Age must be between 0 and 130, got $age.");
    }
    return $age;
}

try {
    echo setAge(16), "\n";
    echo setAge(-3), "\n";
} catch (InvalidArgumentException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
```

```text
16
Error: Age must be between 0 and 130, got -3.
```

`throw new InvalidArgumentException(...)` creates an exception object with a message, and throws it. The function stops right there, like with `return`, and PHP looks for a `catch` that handles it.

Why throw instead of just returning an error message, like `validateName` did in [Validating and Escaping User Input](/lessons/php/validating-input)? It depends on how surprising the problem is:

- An expected problem, like a visitor typing a wrong value into a form, is part of normal life. Return an error message and show it to them.
- A problem that means something is really wrong, like a function being called with impossible data, a missing file, or a database that's down, should be thrown. It can't be ignored by accident: if nobody catches it, the script stops.

## Which exception to throw?

PHP has built-in exception classes for common situations. A few you'll use:

| Class | Use it when |
|---|---|
| `InvalidArgumentException` | a function was given a value it can't accept |
| `RuntimeException` | something went wrong while running, like a file that won't open |
| `LogicException` | the code itself is being used wrongly |

They all extend the base `Exception` class. PHP's own internal problems, like `TypeError` and `DivisionByZeroError`, extend a separate class called `Error`. Both `Exception` and `Error` implement the `Throwable` interface.

## Your own exception classes

For problems specific to your program, make your own exception class by extending one of the built-in ones. It can be empty; the new name is what matters:

```php
<?php
declare(strict_types=1);

class OutOfStockException extends RuntimeException
{
}

function buy(string $item, int $stock): string
{
    if ($stock === 0) {
        throw new OutOfStockException("$item is sold out.");
    }
    return "You bought $item.";
}

foreach (["turon" => 4, "puto" => 0] as $item => $stock) {
    try {
        echo buy($item, $stock), "\n";
    } catch (OutOfStockException $e) {
        echo "Sorry: " . $e->getMessage() . "\n";
    }
}
```

```text
You bought turon.
Sorry: puto is sold out.
```

A `catch` for `OutOfStockException` handles only that problem. Anything else still goes up to the next `catch`, or stops the script, which is exactly what you want for problems you didn't plan for.

## Several catch blocks, and finally

A `try` can have several `catch` blocks, checked in order, and an optional `finally` block that **always** runs, whether something was thrown or not:

```php
<?php
declare(strict_types=1);

function process(string $input): int
{
    if ($input === "") {
        throw new InvalidArgumentException("Nothing was typed.");
    }
    if (!is_numeric($input)) {
        throw new RuntimeException("'$input' is not a number.");
    }
    return (int) $input * 2;
}

foreach (["21", "", "abc"] as $input) {
    try {
        echo "Result: " . process($input) . "\n";
    } catch (InvalidArgumentException $e) {
        echo "Input problem: " . $e->getMessage() . "\n";
    } catch (Exception $e) {
        echo "Other problem: " . $e->getMessage() . "\n";
    } finally {
        echo "Checked '$input'.\n";
    }
}
```

```text
Result: 42
Checked '21'.
Input problem: Nothing was typed.
Checked ''.
Other problem: 'abc' is not a number.
Checked 'abc'.
```

`catch (Exception $e)` catches **any** `Exception`, including `RuntimeException`, because it's a child class. Put specific catches first and general ones last. `finally` is for cleanup that must happen no matter what, like closing a file.

## Don't swallow errors

This is tempting, and it's a trap:

```php
try {
    saveOrder($order);
} catch (Exception $e) {
    // ignore
}
```

If saving fails, nobody finds out: not the customer, not you. Only catch an exception when you can do something useful: show a friendly message, try another way, or at least record what happened.

## Errors on a real website

While learning, you want to see every error, which is what the development `php.ini` from [Setting Up](/lessons/php/setting-up) does. On a live website, it's the opposite:

- **Never show error details to visitors.** They can reveal file paths, database names, and code, which help attackers. A live server's `php.ini` should have `display_errors = Off`.
- **Log them instead**, with `log_errors = On`, so you can read them later. You can also write your own entries with `error_log("Payment failed for order 42");`.
- Show visitors a friendly, general message, like "Something went wrong. Please try again."

## Try it

A ticket booth processes several requests. Predict every line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="480px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nclass SoldOutException extends RuntimeException\n{\n}\n\nfunction book(string $show, int $seats, int $available): string\n{\n    if ($seats &lt; 1) {\n        throw new InvalidArgumentException(&quot;Book at least 1 seat.&quot;);\n    }\n    if ($seats &gt; $available) {\n        throw new SoldOutException(&quot;Only $available seat(s) left for $show.&quot;);\n    }\n    return &quot;Booked $seats for $show.&quot;;\n}\n\n$requests = [\n    [&quot;Hamlet&quot;, 2, 10],\n    [&quot;Hamlet&quot;, 0, 10],\n    [&quot;Rent&quot;, 5, 3],\n    [&quot;Cats&quot;, 1, 1],\n];\n\n$booked = 0;\nforeach ($requests as [$show, $seats, $available]) {\n    try {\n        echo book($show, $seats, $available), &quot;\\n&quot;;\n        $booked++;\n    } catch (SoldOutException $e) {\n        echo &quot;Sold out: &quot; . $e-&gt;getMessage() . &quot;\\n&quot;;\n    } catch (Exception $e) {\n        echo &quot;Invalid: &quot; . $e-&gt;getMessage() . &quot;\\n&quot;;\n    } finally {\n        echo &quot;--\\n&quot;;\n    }\n}\necho &quot;Successful bookings: $booked\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Booked 2 for Hamlet.
--
Invalid: Book at least 1 seat.
--
Sold out: Only 3 seat(s) left for Rent.
--
Booked 1 for Cats.
--
Successful bookings: 2
```

`foreach ($requests as [$show, $seats, $available])` unpacks each small array into three variables. When `book` throws, the `$booked++` line is skipped. The `SoldOutException` is caught by its own block; the `InvalidArgumentException` falls through to the general `Exception` block. And `finally` prints its line every time.
:::

## Try it yourself

1. Swap the order of the two `catch` blocks. What changes in the output, and why?
2. Add a request for `["Hamlet", 3, -1]`, and make `book` throw a `LogicException` when `$available` is negative.
3. Remove both `catch` blocks, keeping `finally`. What happens on the second request?

## Check your understanding

<Quiz
	question="What happens to the rest of a try block after an exception is thrown inside it?"
	:options="['It is skipped, and PHP jumps to a matching catch', 'It still runs', 'It runs after the catch block', 'PHP asks the user what to do']"
	:answer-index="0"
	explanation="Once something throws, the rest of the try block is skipped, and the first matching catch block runs."
/>

<Quiz
	question="When does a finally block run?"
	:options="['Only when nothing is thrown', 'Only when something is thrown', 'Never, it is optional', 'Always, whether something was thrown or not']"
	:answer-index="3"
	explanation="finally always runs, which makes it the place for cleanup."
/>

<Quiz
	question="On a live website, what should happen to PHP error details?"
	:options="['Show them to visitors, so they can report bugs', 'Log them, and show visitors only a friendly general message', 'Ignore them', 'Email them to every visitor']"
	:answer-index="1"
	explanation="Error details can help attackers. Turn display_errors off on live sites, log errors, and show a general message."
/>

## Up next

So far, all your data vanished when the script ended. Next, you'll save it for later, in [Reading and Writing Files](/lessons/php/files).
