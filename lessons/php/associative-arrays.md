---
title: "PHP Associative Arrays: Keys, Values, and Nested Arrays"
description: "Label your data with PHP associative arrays: string keys, adding and removing entries, checking keys with isset and ??, looping over keys and values, and arrays of records."
---

# Associative Arrays

*A school locker room doesn't number the lockers 0, 1, 2. Each one has a name tag: "Maria", "Ben", "Carlo". You find a locker by its name.*

In [Indexed Arrays](/lessons/php/arrays), every value had a number. That's perfect for a list of similar things. But a student's record has different kinds of information: a name, an age, a section. Numbers like `$student[0]` and `$student[2]` would be confusing. What's at index 2 again?

An **associative array** uses **names** as its keys instead.

## Name tags instead of numbers

```php
<?php
$student = [
    "name" => "Maria Santos",
    "age" => 16,
    "section" => "Rizal",
];

echo $student["name"], "\n";
echo $student["name"] . " is in section " . $student["section"] . ".\n";
```

```text
Maria Santos
Maria Santos is in section Rizal.
```

- Each entry is `key => value`. The `=>` arrow links a key to its value.
- The keys are usually strings, in quotes.
- You read a value with its key in square brackets: `$student["name"]`.
- The comma after the last entry is optional, but it's good style: adding a line later won't need you to fix the line above.

Each key can appear only once. Keys are like labels on lockers: two lockers can't have the same name tag.

## Inside double quotes

Putting an array value in a double-quoted string needs curly braces around it:

```php
<?php
$student = ["name" => "Maria", "age" => 16];
echo "{$student["name"]} is {$student["age"]}.\n";
```

```text
Maria is 16.
```

Or use the dot, which many people find clearer for array values.

## Adding, changing, and removing

```php
<?php
$prices = ["turon" => 25, "banana cue" => 20];

$prices["turon"] = 30;
$prices["kwek-kwek"] = 15;
unset($prices["banana cue"]);

print_r($prices);
```

```text
Array
(
    [turon] => 30
    [kwek-kwek] => 15
)
```

- Assigning to an existing key **changes** its value.
- Assigning to a new key **adds** an entry.
- `unset(...)` **removes** an entry.

## Is the key there?

Reading a key that doesn't exist gives a warning:

```php
<?php
$student = ["name" => "Maria", "age" => 16];
echo $student["email"];
// error: Warning: Undefined array key "email"
```

There are three good ways to check first:

```php
<?php
$student = ["name" => "Maria", "age" => 16, "club" => null];

var_dump(isset($student["name"]));
var_dump(isset($student["club"]));
var_dump(array_key_exists("club", $student));
echo $student["email"] ?? "no email", "\n";
```

```text
bool(true)
bool(false)
bool(true)
no email
```

- `isset` is true if the key exists **and** its value isn't `null`.
- `array_key_exists` is true if the key exists at all, even if its value is `null`.
- `??` (from [Operators and Expressions](/lessons/php/operators)) gives a default when the key is missing, without a warning. It's the one you'll use most.

## Looping over keys and values

`foreach` with `$key => $value` gives you both:

```php
<?php
$stock = ["pencils" => 40, "erasers" => 12, "rulers" => 0];

foreach ($stock as $item => $count) {
    echo "$item: $count\n";
}
```

```text
pencils: 40
erasers: 12
rulers: 0
```

Items come out in the order they were added. You can also get just the keys with `array_keys()`, or just the values with `array_values()`.

## Arrays inside arrays

The real power comes from putting arrays inside arrays. A list of students, where each student is an associative array, is how PHP programs usually hold table-like data, such as rows from a database:

```php
<?php
$students = [
    ["name" => "Maria", "grade" => 92],
    ["name" => "Ben", "grade" => 85],
    ["name" => "Carlo", "grade" => 78],
];

echo $students[1]["name"], "\n";

foreach ($students as $student) {
    echo $student["name"] . ": " . $student["grade"] . "\n";
}
```

```text
Ben
Maria: 92
Ben: 85
Carlo: 78
```

`$students[1]` is Ben's whole record, and `$students[1]["name"]` reaches inside it. Read it from left to right: "the second student, then their name."

## Try it

A shop totals up an order. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="440px"
	:model-value="'&lt;?php\n$menu = [\n    &quot;adobo&quot; =&gt; 120,\n    &quot;sinigang&quot; =&gt; 150,\n    &quot;rice&quot; =&gt; 20,\n];\n\n$order = [\n    [&quot;item&quot; =&gt; &quot;adobo&quot;, &quot;qty&quot; =&gt; 2],\n    [&quot;item&quot; =&gt; &quot;rice&quot;, &quot;qty&quot; =&gt; 3],\n    [&quot;item&quot; =&gt; &quot;halo-halo&quot;, &quot;qty&quot; =&gt; 1],\n];\n\n$menu[&quot;rice&quot;] = 25;\n$total = 0;\n\nforeach ($order as $line) {\n    $item = $line[&quot;item&quot;];\n    if (!isset($menu[$item])) {\n        echo &quot;Sorry, no $item today.\\n&quot;;\n        continue;\n    }\n    $cost = $menu[$item] * $line[&quot;qty&quot;];\n    echo &quot;{$line[&quot;qty&quot;]} x $item = $cost\\n&quot;;\n    $total += $cost;\n}\necho &quot;Total: $total\\n&quot;;\necho &quot;Dishes on the menu: &quot; . implode(&quot;, &quot;, array_keys($menu)) . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
2 x adobo = 240
3 x rice = 75
Sorry, no halo-halo today.
Total: 315
Dishes on the menu: adobo, sinigang, rice
```

Rice went up to 25 before the loop, so 3 rice cost 75. Halo-halo isn't a key in `$menu`, so `isset` is false, and `continue` skips it. `array_keys` lists the dish names in the order they were added.
:::

## Try it yourself

1. Add `"halo-halo" => 90` to the menu. What's the new total?
2. Add a `"note"` key to one order line, and print it with `??` so lines without a note print `(no note)`.
3. Make an associative array of 3 friends and their birthdays, and loop over it to print `Name: birthday` for each.

## Check your understanding

<Quiz
	question="How do you read the age from $person = [&quot;name&quot; =&gt; &quot;Ana&quot;, &quot;age&quot; =&gt; 15]?"
	:options="['$person[&quot;age&quot;]', '$person[1]', '$person-&gt;age', '$person.age']"
	:answer-index="0"
	explanation="An associative array is read with its key in square brackets: $person[&quot;age&quot;]."
/>

<Quiz
	question="Which gives a default value, with no warning, when a key is missing?"
	:options="['$data[&quot;key&quot;] || &quot;default&quot;', 'unset($data[&quot;key&quot;])', '$data[&quot;key&quot;] ?? &quot;default&quot;', 'count($data)']"
	:answer-index="2"
	explanation="?? checks whether the key exists and isn't null, and gives the right side if not."
/>

<Quiz
	question="In $students[2][&quot;name&quot;], what does the [2] pick?"
	:options="['The second student', 'The third letter of the name', 'The key called 2 inside the name', 'The third student\'s whole record']"
	:answer-index="3"
	explanation="Indexes start at 0, so [2] is the third student's array. [&quot;name&quot;] then reads a value from that record."
/>

## Up next

You've been looping by hand to find, total, and filter. PHP has built-in functions that do most of that for you, in one line. Meet them in [Array Functions: sort, filter, and map](/lessons/php/array-functions).
