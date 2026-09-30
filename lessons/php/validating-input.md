---
title: "PHP Form Validation and Escaping: filter_var and htmlspecialchars"
description: "Never trust user input: validate PHP form data with trim, filter_var, and your own rules, collect friendly error messages, keep what was typed, and escape output with htmlspecialchars."
---

# Validating and Escaping User Input

*A bank teller checks a deposit slip before accepting it: is the amount a real number, is the account filled in, is it signed? Only then does the money go in. Your PHP code needs to be that teller.*

In [Handling Forms](/lessons/php/forms), you received whatever the visitor sent. But visitors make mistakes: they leave boxes empty, type letters where numbers belong, or add spaces by accident. And a few will send harmful data on purpose.

Two habits protect you, and you need **both**:

1. **Validate input**: check the data when it arrives, and reject what doesn't fit.
2. **Escape output**: make any text safe at the moment you put it into a page.

## Why the browser's checks aren't enough

HTML has built-in checks, like `required`, `type="email"`, and `min="1"`. Keep them: they give instant feedback. But they run in the visitor's browser, which the visitor controls. Anyone can switch them off in the browser's developer tools, or send data to your page without using your form at all. The server must check everything again.

## Checking text

Start by trimming, then check what's left:

```php
<?php
function validateName(string $name): ?string {
    $name = trim($name);
    if ($name === "") {
        return "Please enter your name.";
    }
    if (mb_strlen($name) > 50) {
        return "Your name must be 50 characters or fewer.";
    }
    return null;
}

var_dump(validateName("   "));
var_dump(validateName("Maria"));
```

```text
string(23) "Please enter your name."
NULL
```

This function returns an error message when something is wrong, and `null` when all is well. That pattern makes it easy to collect errors, as you'll see below.

Why `$name === ""` and not `if (!$name)`? Because of the falsy `"0"` from [Type Juggling](/lessons/php/type-juggling): someone called "0" (or answering "0") would be treated as empty.

## Checking numbers and emails: filter_var

PHP's `filter_var` function checks a string against a rule, and gives back the **converted** value if it passes, or `false` if it doesn't:

```php
<?php
var_dump(filter_var("15", FILTER_VALIDATE_INT));
var_dump(filter_var("15.5", FILTER_VALIDATE_INT));
var_dump(filter_var("abc", FILTER_VALIDATE_INT));
var_dump(filter_var("0", FILTER_VALIDATE_INT));
```

```text
int(15)
bool(false)
bool(false)
int(0)
```

Notice that the valid `"15"` comes back as the int `15`, ready to use. And since `0` is a valid answer too, always check the result with `=== false`, never with `!`.

You can add a range:

```php
<?php
$options = ["options" => ["min_range" => 1, "max_range" => 10]];
var_dump(filter_var("4", FILTER_VALIDATE_INT, $options));
var_dump(filter_var("25", FILTER_VALIDATE_INT, $options));
```

```text
int(4)
bool(false)
```

Other useful filters include `FILTER_VALIDATE_FLOAT`, `FILTER_VALIDATE_EMAIL`, and `FILTER_VALIDATE_URL`:

```php
<?php
var_dump(filter_var("maria@example.com", FILTER_VALIDATE_EMAIL));
var_dump(filter_var("maria@", FILTER_VALIDATE_EMAIL));
```

```text
string(17) "maria@example.com"
bool(false)
```

An email check only proves the address *looks* right. It can't tell whether it really exists; only sending a message to it can.

## Allowed choices

For dropdowns and radio buttons, check that the value is one of the options you offered. Anyone could send `size=gigantic`:

```php
<?php
$allowedSizes = ["small", "medium", "large"];
$size = "gigantic";

if (!in_array($size, $allowedSizes, true)) {
    echo "Please choose a size from the list.\n";
}
```

```text
Please choose a size from the list.
```

## Collecting all the errors

It's frustrating to fix one mistake, submit again, and only then hear about the next one. Check every field, collect the messages in an array keyed by field name, and show them all at once:

```php
<?php
$input = ["name" => "", "tickets" => "12"];
$errors = [];

if (trim($input["name"]) === "") {
    $errors["name"] = "Please enter your name.";
}
$tickets = filter_var($input["tickets"], FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 6]]);
if ($tickets === false) {
    $errors["tickets"] = "You can book 1 to 6 tickets.";
}

if ($errors === []) {
    echo "Booked!\n";
} else {
    foreach ($errors as $field => $message) {
        echo "$field: $message\n";
    }
}
```

```text
name: Please enter your name.
tickets: You can book 1 to 6 tickets.
```

On a web page, you'd show each message next to its field, and keep what the visitor already typed in the boxes, so they only need to fix the mistakes. For example: `<input name="name" value="<?= htmlspecialchars($input["name"]) ?>">`.

## Escaping output: htmlspecialchars

Now the second habit. Imagine a guestbook that shows every visitor's message. Someone posts this as their "message":

```html
<script>alert("Your site is hacked")</script>
```

If you echo it straight into the page, every future visitor's browser runs that script. A real attacker wouldn't show an alert; they'd steal logins. This attack is called **cross-site scripting**, or **XSS**, and it's one of the most common security holes on the web.

The fix is `htmlspecialchars`. It turns the characters that have a special meaning in HTML into harmless codes, so the browser **shows** them instead of running them:

```php
<?php
$message = '<script>alert("Your site is hacked")</script> & bye';
echo htmlspecialchars($message), "\n";
```

```text
&lt;script&gt;alert(&quot;Your site is hacked&quot;)&lt;/script&gt; &amp; bye
```

The browser displays that as the original text, `<script>...` and all, but never runs it. `<` became `&lt;`, `>` became `&gt;`, `"` became `&quot;`, and `&` became `&amp;`. (Single quotes become `&#039;`.)

The rule: **escape everything that came from outside, every time you put it in HTML.** Not just form data, but anything from a database, a file, or a cookie that a visitor could have influenced. Escape at the moment of output, not when saving, so the stored data stays exactly as it was typed.

Since you'll type it a lot, many projects make a short helper:

```php
<?php
function e(string $text): string {
    return htmlspecialchars($text, ENT_QUOTES, "UTF-8");
}

echo e("Tom & Jerry's <b>show</b>"), "\n";
```

```text
Tom &amp; Jerry&#039;s &lt;b&gt;show&lt;/b&gt;
```

`ENT_QUOTES` and `"UTF-8"` are already the defaults in modern PHP, but writing them out makes the helper safe on any setup.

Validating and escaping do different jobs. A perfectly valid name, like `O'Brien <3`, still needs escaping when you show it.

## Try it

A sign-up page validates three fields. Predict what it prints for this input.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nfunction e(string $text): string {\n    return htmlspecialchars($text, ENT_QUOTES, &quot;UTF-8&quot;);\n}\n\n$input = [\n    &quot;name&quot; =&gt; &quot;  &lt;b&gt;Leo&lt;/b&gt; &quot;,\n    &quot;age&quot; =&gt; &quot;0&quot;,\n    &quot;email&quot; =&gt; &quot;leo@example&quot;,\n];\n\n$errors = [];\n$name = trim($input[&quot;name&quot;] ?? &quot;&quot;);\nif ($name === &quot;&quot;) {\n    $errors[] = &quot;Name is required.&quot;;\n}\n$age = filter_var($input[&quot;age&quot;] ?? &quot;&quot;, FILTER_VALIDATE_INT, [&quot;options&quot; =&gt; [&quot;min_range&quot; =&gt; 1, &quot;max_range&quot; =&gt; 120]]);\nif ($age === false) {\n    $errors[] = &quot;Age must be a whole number from 1 to 120.&quot;;\n}\nif (filter_var($input[&quot;email&quot;] ?? &quot;&quot;, FILTER_VALIDATE_EMAIL) === false) {\n    $errors[] = &quot;That email doesn\'t look right.&quot;;\n}\n\necho &quot;&lt;p&gt;Hello, &quot; . e($name) . &quot;&lt;/p&gt;\\n&quot;;\necho count($errors) . &quot; problem(s):\\n&quot;;\nforeach ($errors as $error) {\n    echo &quot;- $error\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
<p>Hello, &lt;b&gt;Leo&lt;/b&gt;</p>
2 problem(s):
- Age must be a whole number from 1 to 120.
- That email doesn't look right.
```

The name isn't empty after trimming, so it passes validation, but it still gets escaped on output, so the `<b>` tags are shown as text instead of making bold. `"0"` is a valid integer, but it's below the minimum of 1. And `leo@example` has no dot in the domain part, which PHP's email filter rejects.
:::

## Try it yourself

1. Fix the input so there are no problems. What's the smallest change to each field?
2. Add a `"password"` field, and an error if it's shorter than 8 characters.
3. Remove the `e()` around `$name`, and think about what a browser would do with that line. Then put it back.

## Check your understanding

<Quiz
	question="Why must PHP check form data even when the HTML form uses required and type=&quot;email&quot;?"
	:options="['PHP cannot read HTML attributes', 'Browser checks are slow', 'HTML checks only work on phones', 'Visitors can switch off browser checks or send data without the form']"
	:answer-index="3"
	explanation="Browser checks help honest visitors, but anyone can bypass them. The server must validate everything itself."
/>

<Quiz
	question="What does filter_var(&quot;42&quot;, FILTER_VALIDATE_INT) return?"
	:options="['The string &quot;42&quot;', 'true', 'The int 42', 'false']"
	:answer-index="2"
	explanation="A valid value comes back converted to the right type. An invalid one returns false, so compare with === false."
/>

<Quiz
	question="When should you use htmlspecialchars?"
	:options="['Whenever you put outside data into HTML, at the moment of output', 'Only on passwords', 'Only before saving to a database', 'Only on numbers']"
	:answer-index="0"
	explanation="Escaping at output time stops XSS: text from visitors is shown, never run as HTML or JavaScript."
/>

## Up next

Each request starts fresh, so how does a site remember that you're logged in, or what's in your cart? Find out in [Sessions and Cookies](/lessons/php/sessions-and-cookies).
