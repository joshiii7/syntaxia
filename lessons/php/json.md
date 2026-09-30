---
title: "PHP JSON: json_encode and json_decode Explained"
description: "Turn PHP arrays into JSON with json_encode and back with json_decode: pretty printing, associative arrays vs objects, catching bad JSON with JSON_THROW_ON_ERROR, and sending JSON from a page."
---

# Working with JSON

*Travelers from different countries often switch to one shared language to talk. JSON is that shared language for programs.*

A PHP program, a JavaScript app in the browser, a phone app, a weather service: they're written in different languages, but they all need to swap data. The format almost all of them use is **JSON** (JavaScript Object Notation, pronounced like the name "Jason").

You met JSON's shape in the [JavaScript track](/lessons/javascript/intro-to-javascript), and in the `composer.json` file from [Namespaces and Composer](/lessons/php/namespaces-and-composer). It looks like this:

```json
{
    "name": "Maria",
    "age": 16,
    "clubs": ["chess", "choir"],
    "isEnrolled": true
}
```

- `{ }` holds named values, like a PHP associative array.
- `[ ]` holds a list, like a PHP indexed array.
- Text is always in **double** quotes. Numbers, `true`, `false`, and `null` aren't quoted.

## PHP to JSON: json_encode

`json_encode` turns a PHP value into a JSON string:

```php
<?php
$student = [
    "name" => "Maria",
    "age" => 16,
    "clubs" => ["chess", "choir"],
    "isEnrolled" => true,
];

echo json_encode($student), "\n";
```

```text
{"name":"Maria","age":16,"clubs":["chess","choir"],"isEnrolled":true}
```

An associative array became a JSON object `{ }`, and the indexed array became a JSON list `[ ]`.

That's compact, which is good for sending, but hard to read. A few **flags** change the output:

```php
<?php
$place = ["city" => "Parañaque", "site" => "https://example.com/map"];

echo json_encode($place), "\n";
echo json_encode($place, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
echo json_encode($place, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
```

```text
{"city":"Para\u00f1aque","site":"https:\/\/example.com\/map"}
{"city":"Parañaque","site":"https://example.com/map"}
{
    "city": "Parañaque",
    "site": "https://example.com/map"
}
```

- By default, letters like `ñ` become codes such as `\u00f1`, and `/` becomes `\/`. Both are valid JSON, but hard to read. `JSON_UNESCAPED_UNICODE` and `JSON_UNESCAPED_SLASHES` keep them as they are.
- `JSON_PRETTY_PRINT` adds line breaks and indentation, which is great for files people might open.

## JSON to PHP: json_decode

`json_decode` goes the other way. Pass `true` as the second argument to get associative arrays, which is what you'll almost always want:

```php
<?php
$json = '{"title": "Noli Me Tangere", "year": 1887, "tags": ["classic", "novel"]}';

$book = json_decode($json, true);
echo $book["title"] . " (" . $book["year"] . ")\n";
echo "First tag: " . $book["tags"][0] . "\n";
var_dump($book["year"]);
```

```text
Noli Me Tangere (1887)
First tag: classic
int(1887)
```

Unlike form data, JSON keeps its types: the year comes back as an int.

Without `true`, you get **objects** instead, read with `->`: `$book->title`. That works too, but arrays are easier to loop over and check with `??`, so this track uses `true`.

## When the JSON is broken

JSON is strict. A single quote, a trailing comma, or a missing bracket makes it invalid. By default, `json_decode` then just returns `null`, which is easy to miss. The flag `JSON_THROW_ON_ERROR` makes it throw an exception instead, which you can catch, as in [Errors and Exceptions](/lessons/php/exceptions):

```php
<?php
$broken = "{'name': 'Maria'}";

var_dump(json_decode($broken, true));

try {
    json_decode($broken, true, flags: JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo "Bad JSON: " . $e->getMessage() . "\n";
}
```

```text
NULL
Bad JSON: Syntax error
```

The problem here is the single quotes: JSON requires double quotes. Use `JSON_THROW_ON_ERROR` whenever the JSON comes from outside your program.

## Saving data as JSON

Combined with [Reading and Writing Files](/lessons/php/files), JSON makes a simple way to save nested data and load it back exactly:

```php
<?php
$settings = [
    "theme" => "dark",
    "fontSize" => 18,
    "favorites" => ["php", "sql"],
];

file_put_contents("settings.json", json_encode($settings, JSON_PRETTY_PRINT));

$loaded = json_decode(file_get_contents("settings.json"), true, flags: JSON_THROW_ON_ERROR);
echo "Theme: " . $loaded["theme"] . ", favorites: " . implode(" and ", $loaded["favorites"]) . "\n";
var_dump($loaded === $settings);
```

```text
Theme: dark, favorites: php and sql
bool(true)
```

What went in came back out, identical, types and all.

## Sending JSON from a page

Many PHP pages don't send HTML at all. Instead, they send JSON for a JavaScript app or a phone app to use. That's called an **API**. The page tells the browser what's coming with a header, then echoes the JSON:

```php
<?php
header("Content-Type: application/json");

$menu = [
    ["dish" => "Adobo", "price" => 120],
    ["dish" => "Sinigang", "price" => 150],
];
echo json_encode($menu);
```

Opened through the built-in server, the page is just this:

```text
[{"dish":"Adobo","price":120},{"dish":"Sinigang","price":150}]
```

A JavaScript `fetch("menu.php")` in the browser could then read that and build a menu on the page.

## Try it

A to-do app stores its list as JSON. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\n$json = \'{\n    &quot;owner&quot;: &quot;Joy&quot;,\n    &quot;tasks&quot;: [\n        {&quot;title&quot;: &quot;Study PHP&quot;, &quot;done&quot;: true},\n        {&quot;title&quot;: &quot;Buy mangoes&quot;, &quot;done&quot;: false},\n        {&quot;title&quot;: &quot;Call Lola&quot;, &quot;done&quot;: false}\n    ]\n}\';\n\n$list = json_decode($json, true, flags: JSON_THROW_ON_ERROR);\n\n$list[&quot;tasks&quot;][] = [&quot;title&quot; =&gt; &quot;Water plants&quot;, &quot;done&quot; =&gt; false];\n$list[&quot;tasks&quot;][1][&quot;done&quot;] = true;\n\n$remaining = array_filter($list[&quot;tasks&quot;], fn($t) =&gt; !$t[&quot;done&quot;]);\necho $list[&quot;owner&quot;] . &quot; has &quot; . count($remaining) . &quot; task(s) left:\\n&quot;;\nforeach ($remaining as $task) {\n    echo &quot;- &quot; . $task[&quot;title&quot;] . &quot;\\n&quot;;\n}\n\n$summary = [&quot;owner&quot; =&gt; $list[&quot;owner&quot;], &quot;left&quot; =&gt; array_column($remaining, &quot;title&quot;)];\necho json_encode($summary), &quot;\\n&quot;;\n\ntry {\n    json_decode(\'{&quot;owner&quot;: &quot;Joy&quot;,}\', true, flags: JSON_THROW_ON_ERROR);\n} catch (JsonException $e) {\n    echo &quot;Could not read: &quot; . $e-&gt;getMessage() . &quot;\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Joy has 2 task(s) left:
- Call Lola
- Water plants
{"owner":"Joy","left":["Call Lola","Water plants"]}
Could not read: Syntax error
```

The JSON becomes nested arrays. A new task is added at the end, and "Buy mangoes" is marked done, which leaves two tasks. `array_column` makes a plain list of their titles, which `json_encode` turns into a JSON list. The last JSON has a trailing comma after `"Joy"`, which JSON doesn't allow.
:::

## Try it yourself

1. Print the summary with `JSON_PRETTY_PRINT`. How does it look now?
2. Add a `"due"` date to one task in the JSON, and print it with `??` for tasks that have one.
3. Save `$list` to `todo.json` with `file_put_contents`, then open the file in your editor and look at it.

## Check your understanding

<Quiz
	question="What does json_decode($json, true) return for a JSON object?"
	:options="['An object', 'A string', 'An associative array', 'A JSON file']"
	:answer-index="2"
	explanation="With true as the second argument, JSON objects become associative arrays. Without it, you get objects."
/>

<Quiz
	question="Why is {'name': 'Ana'} not valid JSON?"
	:options="['JSON cannot contain names', 'Objects need square brackets', 'It is too short', 'JSON needs double quotes, not single quotes']"
	:answer-index="3"
	explanation="JSON strings and keys must use double quotes: {&quot;name&quot;: &quot;Ana&quot;}."
/>

<Quiz
	question="What does JSON_THROW_ON_ERROR change?"
	:options="['It makes the JSON shorter', 'It makes invalid JSON throw a JsonException instead of quietly returning null', 'It pretty-prints the output', 'It removes the quotes']"
	:answer-index="1"
	explanation="Without the flag, bad JSON just gives null. With it, you get an exception you can catch and handle."
/>

## Up next

Files and JSON work for small amounts of data. For real applications, with many visitors reading and writing at once, you want a database. Connect PHP to one in [Databases with PDO](/lessons/php/databases-with-pdo).
