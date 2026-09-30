---
title: "PHP Loops: for, while, do-while, and foreach"
description: "Repeat code in PHP with for, while, do-while, and foreach loops, stop early with break, skip ahead with continue, and avoid infinite loops."
---

# Loops: for, while, and foreach

*A washing machine doesn't need you to press "rinse" 3 times. You set it once, and it repeats until it's done. Loops are your code's repeat button.*

Suppose you want to print the numbers 1 to 100. Writing 100 `echo` lines would be silly. A **loop** runs the same block of code again and again, as many times as you need. PHP has four kinds, and each fits a different situation.

## while: repeat as long as

A `while` loop checks a condition, runs its block if it's true, then checks again, and again, until the condition is false:

```php
<?php
$countdown = 3;

while ($countdown > 0) {
    echo "$countdown...\n";
    $countdown--;
}
echo "Liftoff!\n";
```

```text
3...
2...
1...
Liftoff!
```

Each time through the block is called an **iteration**. Here, `$countdown--` makes the number smaller every time, so eventually `$countdown > 0` becomes false, and the loop ends.

Use `while` when you don't know in advance how many times you'll repeat, like "keep saving until you have enough."

## Infinite loops

If the condition never becomes false, the loop never ends:

```php
$countdown = 3;
while ($countdown > 0) {
    echo "$countdown...\n";
    // Oops: forgot $countdown--
}
```

This prints `3...` forever. In the terminal, press **Ctrl + C** to stop it. On a web server, PHP stops a script after a time limit (30 seconds by default), with a "Maximum execution time exceeded" error. Whenever you write a `while`, check that something inside it moves toward the end.

## for: counting

When you know how many times to repeat, a `for` loop puts all the counting in one line:

```php
<?php
for ($i = 1; $i <= 5; $i++) {
    echo "Lap $i\n";
}
```

```text
Lap 1
Lap 2
Lap 3
Lap 4
Lap 5
```

The three parts between the parentheses, separated by semicolons:

1. **Start**: `$i = 1` runs once, before the loop.
2. **Condition**: `$i <= 5` is checked before each iteration. When it's false, the loop ends.
3. **Step**: `$i++` runs after each iteration.

`$i` is the traditional name for a loop counter (short for "index"). You can count by other steps, too, like `$i += 2` for odd numbers, or down, with `$i--`.

## do-while: at least once

A `do-while` loop checks its condition **after** the block, so the block always runs at least once:

```php
<?php
$attempts = 10;

do {
    echo "Attempt $attempts\n";
    $attempts++;
} while ($attempts < 3);
```

```text
Attempt 10
```

The condition was false from the start, but the block ran once anyway. It's the least common loop, useful for things like "show a menu, then ask again if needed."

## foreach: every item in a list

Most loops in real PHP code go through a list. A list of values in square brackets is an **array**, which you'll learn properly in [Indexed Arrays](/lessons/php/arrays). `foreach` visits each item in turn:

```php
<?php
$fruits = ["mango", "banana", "papaya"];

foreach ($fruits as $fruit) {
    echo "I like $fruit.\n";
}
```

```text
I like mango.
I like banana.
I like papaya.
```

Read it as "for each item in `$fruits`, call it `$fruit`, and run the block." No counter, no condition, no way to go past the end. You can also get each item's position:

```php
<?php
$fruits = ["mango", "banana", "papaya"];

foreach ($fruits as $index => $fruit) {
    echo "$index: $fruit\n";
}
```

```text
0: mango
1: banana
2: papaya
```

Positions start at 0, just like string positions in [Working with Strings](/lessons/php/strings).

## break and continue

Two keywords change a loop's flow:

- `break` stops the loop completely.
- `continue` skips the rest of this iteration and moves on to the next.

```php
<?php
$prices = [120, 0, 85, 999, 40];

foreach ($prices as $price) {
    if ($price === 0) {
        continue;
    }
    if ($price > 500) {
        echo "Too expensive, stopping.\n";
        break;
    }
    echo "Price: $price\n";
}
```

```text
Price: 120
Price: 85
Too expensive, stopping.
```

The `0` is skipped by `continue`, and `break` stops the loop at `999`, so `40` is never reached.

## Loops inside loops

A loop can contain another loop. The inner loop runs completely for **each** iteration of the outer one:

```php
<?php
for ($row = 1; $row <= 3; $row++) {
    for ($col = 1; $col <= 4; $col++) {
        echo $row * $col, "\t";
    }
    echo "\n";
}
```

```text
1	2	3	4
2	4	6	8
3	6	9	12
```

That's a small multiplication table: 3 rows × 4 columns = 12 iterations of the inner block. `\t` is a tab, which lines up the columns.

## Loops in HTML pages

Like `if`, loops have an alternative syntax for templates, ending with `endforeach;`, `endfor;`, or `endwhile;`:

```php
<?php $tasks = ["Buy milk", "Walk the dog"]; ?>
<ul>
<?php foreach ($tasks as $task): ?>
    <li><?= $task ?></li>
<?php endforeach; ?>
</ul>
```

```text
<ul>
    <li>Buy milk</li>
    <li>Walk the dog</li>
</ul>
```

## Try it

A class is collecting money for a field trip. Predict every line the script prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="420px"
	:model-value="'&lt;?php\n$payments = [150, 200, 0, 150, 300];\n$goal = 600;\n$total = 0;\n\nforeach ($payments as $i =&gt; $amount) {\n    if ($amount === 0) {\n        echo &quot;Student $i hasn\'t paid yet.\\n&quot;;\n        continue;\n    }\n    $total += $amount;\n    echo &quot;Student $i paid $amount. Total: $total\\n&quot;;\n    if ($total &gt;= $goal) {\n        echo &quot;Goal reached!\\n&quot;;\n        break;\n    }\n}\n\n$weeks = 0;\n$saved = $total;\nwhile ($saved &lt; 1000) {\n    $saved += 100;\n    $weeks++;\n}\necho &quot;$weeks more weeks to reach 1000.\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Student 0 paid 150. Total: 150
Student 1 paid 200. Total: 350
Student 2 hasn't paid yet.
Student 3 paid 150. Total: 500
Student 4 paid 300. Total: 800
Goal reached!
2 more weeks to reach 1000.
```

Student 2 is skipped with `continue`. The total reaches 800 at student 4, which passes the goal, so `break` stops the loop. Then the `while` adds 100 at a time from 800: two weeks gets to 1000.
:::

## Try it yourself

1. Change the goal to 1000. Does the loop ever reach `break` now? What's the final total?
2. Write a `for` loop that prints the even numbers from 2 to 20.
3. Write a `foreach` loop that prints each name in `["Ana", "Ben", "Carlo"]` in capital letters, using `strtoupper`.

## Check your understanding

<Quiz
	question="How many times does for ($i = 0; $i < 5; $i++) run its block?"
	:options="['4', '5', '6', 'Forever']"
	:answer-index="1"
	explanation="$i takes the values 0, 1, 2, 3, and 4, which is 5 iterations. At 5, the condition $i < 5 is false."
/>

<Quiz
	question="What does continue do inside a loop?"
	:options="['Stops the loop completely', 'Restarts the loop from the beginning', 'Pauses the script', 'Skips the rest of this iteration and moves to the next one']"
	:answer-index="3"
	explanation="continue skips ahead to the next iteration. break is the one that stops the loop."
/>

<Quiz
	question="Which loop always runs its block at least once?"
	:options="['do-while', 'for', 'while', 'foreach']"
	:answer-index="0"
	explanation="do-while checks its condition after the block, so the block runs once even if the condition is false from the start."
/>

## Up next

You've been using PHP's built-in functions, like `strlen` and `str_repeat`. Next, you'll write your own, in [Writing Functions](/lessons/php/functions).
