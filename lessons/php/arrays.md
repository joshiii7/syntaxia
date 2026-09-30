---
title: "PHP Indexed Arrays: Creating, Reading, and Changing Lists"
description: "Store lists of values in PHP arrays: create them, read items by index, add and remove items, count them, loop over them, and turn text into arrays with explode and implode."
---

# Indexed Arrays

*A pill organizer has a numbered compartment for each day. One box, many values, and you find each one by its number.*

A variable holds one value. But a class has many students, a cart has many items, a playlist has many songs. Making `$student1`, `$student2`, `$student3`, and so on would be hopeless. An **array** holds a whole list of values in a single variable.

## Numbered compartments

```php
<?php
$fruits = ["mango", "banana", "papaya"];

echo $fruits[0], "\n";
echo $fruits[2], "\n";
```

```text
mango
papaya
```

- Square brackets `[ ]` with values separated by commas make an array.
- Each value sits at a numbered position, called its **index** (or **key**).
- Indexes start at **0**, not 1. The first item is `$fruits[0]`, the third is `$fruits[2]`.

This kind of array, numbered from 0, is called an **indexed array**. (The next lesson, [Associative Arrays](/lessons/php/associative-arrays), covers arrays with names instead of numbers.)

Reading an index that doesn't exist gives a warning:

```php
<?php
$fruits = ["mango", "banana", "papaya"];
echo $fruits[3];
// error: Warning: Undefined array key 3
```

There are 3 items, so the last index is 2. Off-by-one mistakes like this are very common. The last index is always the count minus one.

## Looking inside: print_r and var_dump

`echo` can't print a whole array. It prints the word `Array` with a warning. To see what's inside, use `print_r` for a quick look, or `var_dump` for the full details:

```php
<?php
$scores = [88, 92, 75];
print_r($scores);
var_dump($scores);
```

```text
Array
(
    [0] => 88
    [1] => 92
    [2] => 75
)
array(3) {
  [0]=>
  int(88)
  [1]=>
  int(92)
  [2]=>
  int(75)
}
```

## Counting, changing, adding, removing

```php
<?php
$playlist = ["Intro", "Sunrise", "Rain"];
echo count($playlist), " songs\n";

$playlist[1] = "Sunset";
$playlist[] = "Encore";
array_unshift($playlist, "Warm-up");
print_r($playlist);
```

```text
3 songs
Array
(
    [0] => Warm-up
    [1] => Intro
    [2] => Sunset
    [3] => Rain
    [4] => Encore
)
```

- `count($array)` gives the number of items.
- `$playlist[1] = "Sunset";` replaces the item at index 1.
- `$playlist[] = "Encore";` with **empty** brackets adds to the end. This is the most common way to add an item.
- `array_unshift` adds to the **start**, and renumbers everything after it.

To take items off:

```php
<?php
$queue = ["Ana", "Ben", "Carlo", "Dina"];

$last = array_pop($queue);
$first = array_shift($queue);
echo "Removed $first and $last\n";
print_r($queue);
```

```text
Removed Ana and Dina
Array
(
    [0] => Ben
    [1] => Carlo
)
```

`array_pop` removes and returns the **last** item, and `array_shift` the **first**. Both give you the removed value, so you can use it.

## Looping over an array

You met `foreach` in [Loops](/lessons/php/loops). It's the natural way to go through an array:

```php
<?php
$prices = [45, 120, 30];
$total = 0;

foreach ($prices as $i => $price) {
    echo "Item " . ($i + 1) . ": $price\n";
    $total += $price;
}
echo "Total: $total\n";
```

```text
Item 1: 45
Item 2: 120
Item 3: 30
Total: 195
```

Adding 1 to the index gives the friendly numbering people expect, starting at 1.

## Checking for a value

```php
<?php
$allergies = ["peanuts", "shrimp"];

var_dump(in_array("shrimp", $allergies));
var_dump(in_array("milk", $allergies));
var_dump(array_search("shrimp", $allergies));
```

```text
bool(true)
bool(false)
int(1)
```

`in_array` answers "is it in there?", and `array_search` gives the index where it was found (or `false`). To stay clear of type juggling, add `true` as a third argument to both, like `in_array("5", $numbers, true)`, which makes them compare with `===`.

## From text to array, and back

Two functions connect strings and arrays, and you'll use them constantly:

- `explode(separator, text)` splits a string into an array.
- `implode(separator, array)` joins an array into a string.

```php
<?php
$typed = "red,green,blue";
$colors = explode(",", $typed);
echo count($colors), " colors\n";
echo $colors[1], "\n";

echo implode(" / ", $colors), "\n";
```

```text
3 colors
green
red / green / blue
```

Think of explode as cutting a string wherever the separator appears, and implode as gluing the pieces together with a new separator.

## Try it

A class tracks who has turned in their project. Predict every line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="400px"
	:model-value="'&lt;?php\n$students = [&quot;Ana&quot;, &quot;Ben&quot;, &quot;Carlo&quot;];\n$students[] = &quot;Dina&quot;;\n$students[] = &quot;Eli&quot;;\n\n$turnedIn = explode(&quot;,&quot;, &quot;Ben,Eli,Ana&quot;);\n\necho &quot;Class size: &quot; . count($students) . &quot;\\n&quot;;\necho &quot;Third student: &quot; . $students[2] . &quot;\\n&quot;;\n\n$missing = [];\nforeach ($students as $student) {\n    if (!in_array($student, $turnedIn)) {\n        $missing[] = $student;\n    }\n}\n\necho &quot;Still missing: &quot; . implode(&quot; and &quot;, $missing) . &quot;\\n&quot;;\n$latest = array_pop($turnedIn);\necho &quot;Most recent: $latest\\n&quot;;\necho &quot;Earlier ones: &quot; . count($turnedIn) . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Class size: 5
Third student: Carlo
Still missing: Carlo and Dina
Most recent: Ana
Earlier ones: 2
```

After two additions, there are 5 students, and index 2 is the third one, Carlo. The loop builds a new `$missing` array from everyone not in `$turnedIn`. `array_pop` removes the last item, `"Ana"` (the last one in the typed text), leaving 2.
:::

## Try it yourself

1. Add `"Fe"` to the class list. Who's missing now?
2. Print the class list sorted alphabetically. Try `sort($students);` before printing it with `implode`.
3. Split the sentence `"PHP is fun to learn"` into words with `explode(" ", ...)`, and print how many words it has.

## Check your understanding

<Quiz
	question="In $days = [&quot;Mon&quot;, &quot;Tue&quot;, &quot;Wed&quot;], what is $days[1]?"
	:options="['&quot;Mon&quot;', '&quot;Tue&quot;', '&quot;Wed&quot;', 'A warning']"
	:answer-index="1"
	explanation="Indexes start at 0, so $days[0] is Mon and $days[1] is Tue."
/>

<Quiz
	question="What does $list[] = &quot;new&quot;; do?"
	:options="['Empties the array', 'Adds &quot;new&quot; to the end of the array', 'Replaces the first item', 'Causes an error']"
	:answer-index="1"
	explanation="Empty square brackets on the left of = add a new item at the end."
/>

<Quiz
	question="What does implode(&quot;-&quot;, [&quot;a&quot;, &quot;b&quot;, &quot;c&quot;]) give?"
	:options="['[&quot;a-b-c&quot;]', '&quot;abc&quot;', '&quot;-a-b-c-&quot;', '&quot;a-b-c&quot;']"
	:answer-index="3"
	explanation="implode joins the items into one string, with the separator only between them."
/>

## Up next

Numbered positions are fine for a list, but what about a student's record, with a name, an age, and a grade? For that, you want labels instead of numbers, in [Associative Arrays](/lessons/php/associative-arrays).
