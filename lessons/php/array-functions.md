---
title: "PHP Array Functions: sort, usort, array_filter, array_map, and More"
description: "Let PHP do the looping: sort arrays with sort, asort, ksort, and usort, total them with array_sum, and transform them with array_filter, array_map, and arrow functions."
---

# Array Functions: sort, filter, and map

*A post office sorting machine takes a pile of letters and, in one go, puts them in order, throws out the ones with no address, or stamps every single one. You don't handle each letter yourself.*

In the last two lessons, you wrote `foreach` loops to total, search, and filter arrays. That works, but the same jobs come up again and again, so PHP has built-in functions for them. They're shorter, and they say what they do.

## Quick numbers

```php
<?php
$scores = [78, 92, 85, 64, 92];

echo "Count: " . count($scores) . "\n";
echo "Total: " . array_sum($scores) . "\n";
echo "Highest: " . max($scores) . "\n";
echo "Lowest: " . min($scores) . "\n";
echo "Average: " . array_sum($scores) / count($scores) . "\n";
```

```text
Count: 5
Total: 411
Highest: 92
Lowest: 64
Average: 82.2
```

`range(1, 5)` makes `[1, 2, 3, 4, 5]`, and `array_unique` removes repeated values.

## Sorting

`sort` puts an array in order, smallest first (or A to Z). `rsort` does the reverse:

```php
<?php
$names = ["Carlo", "ana", "Ben"];
sort($names);
print_r($names);

$scores = [78, 92, 85];
rsort($scores);
echo implode(", ", $scores), "\n";
```

```text
Array
(
    [0] => Ben
    [1] => Carlo
    [2] => ana
)
92, 85, 78
```

Two things to notice:

- The sort functions **change the array itself**. They don't return a new, sorted copy. (They return `true`, so `$sorted = sort($names);` is a common mistake that stores `true`.)
- `"ana"` came last: sorting compares character codes, and all capital letters come before all lowercase ones. For a case-insensitive sort, use `sort($names, SORT_FLAG_CASE | SORT_STRING)`, or better, store names consistently.

## Sorting associative arrays

`sort` throws away the keys and renumbers from 0. For associative arrays, use:

- `asort` / `arsort`: sort by **value**, keeping each key with its value.
- `ksort` / `krsort`: sort by **key**.

```php
<?php
$votes = ["Adobo" => 12, "Sinigang" => 19, "Kare-kare" => 7];

arsort($votes);
print_r($votes);

ksort($votes);
echo implode(", ", array_keys($votes)), "\n";
```

```text
Array
(
    [Sinigang] => 19
    [Adobo] => 12
    [Kare-kare] => 7
)
Adobo, Kare-kare, Sinigang
```

## Your own order: usort

What about sorting a list of records, like students by grade? `usort` lets you decide the order. You give it a small function that compares two items, returning a negative number if the first should come first, a positive number if the second should, or 0 if it doesn't matter. The spaceship operator `<=>`, from [Operators and Expressions](/lessons/php/operators), gives exactly that:

```php
<?php
$students = [
    ["name" => "Maria", "grade" => 88],
    ["name" => "Ben", "grade" => 95],
    ["name" => "Carlo", "grade" => 79],
];

usort($students, fn($a, $b) => $b["grade"] <=> $a["grade"]);

foreach ($students as $s) {
    echo "{$s["name"]}: {$s["grade"]}\n";
}
```

```text
Ben: 95
Maria: 88
Carlo: 79
```

`fn($a, $b) => ...` is an **arrow function**: a small function with no name, written right where it's needed. It takes the parameters in parentheses, and returns whatever comes after the `=>`. Here, `$b <=> $a` (b first) sorts from highest to lowest. Swap them to `$a["grade"] <=> $b["grade"]` for lowest first.

## Keep some: array_filter

`array_filter` keeps only the items for which your function returns `true`:

```php
<?php
$prices = [45, 120, 30, 250, 80];
$cheap = array_filter($prices, fn($p) => $p < 100);
print_r($cheap);
```

```text
Array
(
    [0] => 45
    [2] => 30
    [4] => 80
)
```

Notice that the kept items keep their **original keys**: 0, 2, and 4. That's fine for `foreach`, but if you need them numbered 0, 1, 2 again, wrap the result in `array_values()`.

## Change every one: array_map

`array_map` runs your function on every item, and gives back a new array of the results:

```php
<?php
$prices = [100, 250, 80];
$withTax = array_map(fn($p) => $p * 1.12, $prices);
$labels = array_map(fn($p) => "PHP " . number_format($p, 2), $withTax);
echo implode(" | ", $labels), "\n";
```

```text
PHP 112.00 | PHP 280.00 | PHP 89.60
```

Careful: the order of the arguments differs. `array_map` takes the function **first**, and `array_filter` takes the array first. Everyone mixes these up; check the order when you get a strange error.

## One column: array_column

For a list of records, `array_column` pulls out one field from each:

```php
<?php
$students = [
    ["name" => "Maria", "grade" => 88],
    ["name" => "Ben", "grade" => 95],
];
echo implode(", ", array_column($students, "name")), "\n";
echo "Class average: " . array_sum(array_column($students, "grade")) / count($students) . "\n";
```

```text
Maria, Ben
Class average: 91.5
```

## Chaining them together

These functions combine well. Here's "the names of everyone who passed, in alphabetical order", with no loop:

```php
<?php
$students = [
    ["name" => "Maria", "grade" => 88],
    ["name" => "Ben", "grade" => 71],
    ["name" => "Carlo", "grade" => 79],
    ["name" => "Ana", "grade" => 93],
];

$passed = array_filter($students, fn($s) => $s["grade"] >= 75);
$names = array_column($passed, "name");
sort($names);
echo implode(", ", $names), "\n";
```

```text
Ana, Carlo, Maria
```

When a chain gets hard to read, break it into steps with well-named variables, as here. A plain `foreach` is never wrong, either. Use whichever makes your code clearest.

## Try it

A running club looks at race times, in minutes. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="420px"
	:model-value="'&lt;?php\n$runners = [\n    [&quot;name&quot; =&gt; &quot;Lia&quot;, &quot;time&quot; =&gt; 31],\n    [&quot;name&quot; =&gt; &quot;Marco&quot;, &quot;time&quot; =&gt; 27],\n    [&quot;name&quot; =&gt; &quot;Joy&quot;, &quot;time&quot; =&gt; 35],\n    [&quot;name&quot; =&gt; &quot;Paolo&quot;, &quot;time&quot; =&gt; 29],\n];\n\n$times = array_column($runners, &quot;time&quot;);\necho &quot;Fastest: &quot; . min($times) . &quot; min\\n&quot;;\necho &quot;Average: &quot; . array_sum($times) / count($times) . &quot; min\\n&quot;;\n\nusort($runners, fn($a, $b) =&gt; $a[&quot;time&quot;] &lt;=&gt; $b[&quot;time&quot;]);\necho &quot;Podium: &quot; . implode(&quot;, &quot;, array_column(array_slice($runners, 0, 3), &quot;name&quot;)) . &quot;\\n&quot;;\n\n$under30 = array_filter($runners, fn($r) =&gt; $r[&quot;time&quot;] &lt; 30);\necho &quot;Under 30 min: &quot; . count($under30) . &quot;\\n&quot;;\n\n$badges = array_map(fn($r) =&gt; strtoupper($r[&quot;name&quot;]) . &quot; (&quot; . $r[&quot;time&quot;] . &quot;)&quot;, $runners);\necho implode(&quot; &gt; &quot;, $badges) . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Fastest: 27 min
Average: 30.5 min
Podium: Marco, Paolo, Lia
Under 30 min: 2
MARCO (27) > PAOLO (29) > LIA (31) > JOY (35)
```

`usort` with `$a <=> $b` puts the smallest time first. `array_slice($runners, 0, 3)` takes the first 3 records, and `array_column` pulls their names. Two runners finished under 30, and `array_map` runs on the already-sorted list, so the badges come out in finishing order.
:::

## Try it yourself

1. Add a runner, `["name" => "Bea", "time" => 26]`. Who's on the podium now?
2. Use `array_filter` to find runners slower than the average.
3. Use `array_map` to make a list of just the first letter of each name, and print it with `implode`.

## Check your understanding

<Quiz
	question="What does $result = sort($names); store in $result?"
	:options="['The sorted array', 'true', 'The first name', 'null']"
	:answer-index="1"
	explanation="sort changes the array itself and returns true. Sort first, then use $names."
/>

<Quiz
	question="Which function keeps only the items that pass a test?"
	:options="['array_map', 'array_column', 'array_filter', 'usort']"
	:answer-index="2"
	explanation="array_filter keeps items for which your function returns true. array_map transforms every item."
/>

<Quiz
	question="Which usort comparison sorts records from highest score to lowest?"
	:options="['fn($a, $b) =&gt; $b[&quot;score&quot;] &lt;=&gt; $a[&quot;score&quot;]', 'fn($a, $b) =&gt; $a[&quot;score&quot;] &lt;=&gt; $b[&quot;score&quot;]', 'fn($a, $b) =&gt; $a[&quot;score&quot;] &gt; $b[&quot;score&quot;]', 'fn($a) =&gt; $a[&quot;score&quot;]']"
	:answer-index="0"
	explanation="Comparing $b to $a reverses the normal order, so the highest comes first."
/>

## Up next

So far, your scripts have run in the terminal. Time to take PHP back to the web, and let visitors send you data, in [Handling Forms: GET and POST](/lessons/php/forms).
