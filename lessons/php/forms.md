---
title: "PHP Forms: Handling GET and POST Requests"
description: "Receive form data in PHP with $_GET and $_POST: connect an HTML form to a PHP page, choose between GET and POST, read text fields, dropdowns, and checkboxes, and show a result."
---

# Handling Forms: GET and POST

*A paper order slip has boxes to fill in: name, size, extras. You hand it over the counter, and the kitchen reads each box. An HTML form is the slip, and PHP is the kitchen reading it.*

In the [HTML track](/lessons/html/forms-part-1), you built forms, but when someone pressed the button, nothing happened with their answers. Something on a server has to receive them. That's one of PHP's main jobs.

For this lesson, run the examples as web pages with the built-in server from [Setting Up](/lessons/php/setting-up): save them in a folder, run `php -S localhost:8000` there, and open each page in your browser.

## A form that talks to PHP

Save this as `search.php`:

```php
<?php
$query = $_GET["q"] ?? "";
?>
<form action="search.php" method="get">
    <label for="q">Search recipes</label>
    <input type="text" id="q" name="q">
    <button>Search</button>
</form>
<?php if ($query !== ""): ?>
<p>You searched for: <?= htmlspecialchars($query) ?></p>
<?php endif; ?>
```

Open `http://localhost:8000/search.php`, type `chicken adobo`, and press Search. The address changes to `search.php?q=chicken+adobo`, and the page now ends with:

```text
<p>You searched for: chicken adobo</p>
```

Here's what happened, step by step:

1. `action="search.php"` says **where** to send the form: back to this same page.
2. `method="get"` says **how**: by adding the answers to the address.
3. `name="q"` on the input sets the **label** for this answer. The `name` attribute is what PHP sees; without it, the field isn't sent at all.
4. The browser requests `search.php?q=chicken+adobo`, and PHP puts `q` into the `$_GET` array: `$_GET["q"]` is `"chicken adobo"`.
5. On the first visit, before any search, there's no `q`. That's why the code uses `?? ""`: no warning, just an empty string.

`htmlspecialchars` makes the typed text safe to put in the page. It's essential whenever you show something a visitor typed, and it's the main topic of [Validating and Escaping User Input](/lessons/php/validating-input). For now, always wrap user input in it before echoing.

## GET or POST?

A form can send its data two ways:

| | GET | POST |
|---|---|---|
| Where the data goes | In the address, after `?` | Inside the request, hidden from the address |
| Arrives in | `$_GET` | `$_POST` |
| Can be bookmarked or shared | Yes | No |
| Use it for | Searching, filtering, anything that just **looks** | Signing up, ordering, anything that **changes** something |

The rule of thumb: if pressing the button twice would be a problem (two orders, two sign-ups), use POST. Also, never send passwords with GET, since they'd end up in the address bar and in browser history.

## A POST form, with more kinds of fields

Save this as `order.php`:

```php
<?php
declare(strict_types=1);

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["name"] ?? "");
    $size = $_POST["size"] ?? "medium";
    $extras = $_POST["extras"] ?? [];

    $message = "Thanks, " . htmlspecialchars($name) . "! One $size pizza";
    if (count($extras) > 0) {
        $message .= " with " . htmlspecialchars(implode(" and ", $extras));
    }
    $message .= ".";
}
?>
<form method="post">
    <label for="name">Your name</label>
    <input type="text" id="name" name="name">

    <label for="size">Size</label>
    <select id="size" name="size">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
    </select>

    <fieldset>
        <legend>Extras</legend>
        <label><input type="checkbox" name="extras[]" value="cheese"> Extra cheese</label>
        <label><input type="checkbox" name="extras[]" value="mushrooms"> Mushrooms</label>
    </fieldset>

    <button>Order</button>
</form>
<?php if ($message !== ""): ?>
<p><?= $message ?></p>
<?php endif; ?>
```

Ordering a large pizza as Maria, with both extras ticked, ends the page with:

```text
<p>Thanks, Maria! One large pizza with cheese and mushrooms.</p>
```

The new pieces:

- **One page, two jobs.** The same file shows the form *and* handles it. `$_SERVER["REQUEST_METHOD"]` tells you which: `"GET"` when someone first opens the page, `"POST"` when they submit the form. Leaving out `action` sends the form back to the same page.
- **A dropdown** (`<select>`) sends the `value` of the chosen option.
- **Checkboxes** are only sent when ticked. Unticked ones don't appear in `$_POST` at all.
- **`name="extras[]"`**, with square brackets, tells PHP to collect every ticked box into an array. Without the brackets, you'd only get the last ticked one. And when none are ticked, there's no `extras` at all, which is why the code uses `?? []`.

## Everything arrives as a string

Whatever the visitor types, even in `<input type="number">`, reaches PHP as a **string** (or an array of strings, for `[]` names). The browser's checks, like `required` or `min`, are easy to get around, too: anyone can send any data to your page.

So never trust form data. Check it, and convert it yourself, as you learned in [Type Juggling and Strict Comparisons](/lessons/php/type-juggling). The next lesson is all about that.

## After a POST: redirect

If someone submits a POST form, then refreshes the page, the browser asks "Resubmit the form?", and saying yes sends the order again. The standard fix is to **redirect** after handling a POST, sending the browser to a new page with a GET request:

```php
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // ... save the order ...
    header("Location: thank-you.php");
    exit;
}
```

`header("Location: ...")` tells the browser to go to another page, and `exit` stops the script right there. `header` must run before any output (even a blank line before `<?php`), because headers are sent before the page itself. This pattern is called **Post/Redirect/Get**.

## Try it

This script handles a club sign-up form. Its first lines **pretend** a form was just sent, so you can run it in the terminal; on a real website, the browser would fill `$_SERVER` and `$_POST`. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="440px"
	:model-value="'&lt;?php\n// Pretend a form was just submitted:\n$_SERVER[&quot;REQUEST_METHOD&quot;] = &quot;POST&quot;;\n$_POST = [\n    &quot;name&quot; =&gt; &quot;  Joy Reyes &quot;,\n    &quot;grade&quot; =&gt; &quot;10&quot;,\n    &quot;clubs&quot; =&gt; [&quot;chess&quot;, &quot;choir&quot;],\n];\n\nif ($_SERVER[&quot;REQUEST_METHOD&quot;] === &quot;POST&quot;) {\n    $name = trim($_POST[&quot;name&quot;] ?? &quot;&quot;);\n    $grade = $_POST[&quot;grade&quot;] ?? &quot;&quot;;\n    $clubs = $_POST[&quot;clubs&quot;] ?? [];\n    $newsletter = isset($_POST[&quot;newsletter&quot;]);\n\n    echo &quot;Name: [$name]\\n&quot;;\n    var_dump($grade);\n    echo &quot;Clubs: &quot; . implode(&quot;, &quot;, $clubs) . &quot; (&quot; . count($clubs) . &quot;)\\n&quot;;\n    echo &quot;Newsletter: &quot; . ($newsletter ? &quot;yes&quot; : &quot;no&quot;) . &quot;\\n&quot;;\n    echo &quot;Email: &quot; . ($_POST[&quot;email&quot;] ?? &quot;not given&quot;) . &quot;\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Name: [Joy Reyes]
string(2) "10"
Clubs: chess, choir (2)
Newsletter: no
Email: not given
```

`trim` removes the extra spaces. The grade is the string `"10"`, not a number, because form data always arrives as strings. The clubs came from a `clubs[]` field, so they're an array. The newsletter checkbox wasn't ticked, so it isn't in `$_POST` at all, and `isset` is false. The missing email falls back to `"not given"` through `??`.
:::

## Try it yourself

1. Add `"newsletter" => "yes"` to the pretend `$_POST`. What changes?
2. Remove `"clubs"` from `$_POST`. What does the Clubs line print, and why is there no warning?
3. Build `search.php` from this lesson, run it with the built-in server, and search for something. Then change `method="get"` to `method="post"` and `$_GET` to `$_POST`. What's different about the address bar?

## Check your understanding

<Quiz
	question="An input has name=&quot;city&quot; in a form with method=&quot;post&quot;. Where does PHP put its value?"
	:options="['$_POST[&quot;city&quot;]', '$_GET[&quot;city&quot;]', '$city', '$_SERVER[&quot;city&quot;]']"
	:answer-index="0"
	explanation="A POST form's fields arrive in $_POST, keyed by each field's name attribute."
/>

<Quiz
	question="Which should use POST instead of GET?"
	:options="['A search box', 'A filter for showing only red shoes', 'A sign-up form that creates an account', 'Choosing a page number']"
	:answer-index="2"
	explanation="POST is for requests that change something, like creating an account. GET is for looking things up, and can be bookmarked."
/>

<Quiz
	question="What arrives in $_POST for a checkbox the visitor didn't tick?"
	:options="['false', 'Nothing: unticked checkboxes are not sent', 'An empty string', '&quot;off&quot;']"
	:answer-index="1"
	explanation="Browsers only send ticked checkboxes, so check for them with isset() or ??."
/>

## Up next

Right now, anyone could type anything into your forms, including an empty name, a grade of "banana", or even a sneaky piece of HTML. Learn to check and clean every input in [Validating and Escaping User Input](/lessons/php/validating-input).
