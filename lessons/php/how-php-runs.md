---
title: "How PHP Runs: Requests, Responses, and the Server"
description: "Follow a web request from the browser to PHP and back: what the server does, why PHP starts fresh on every request, and how the terminal and the web run the same script."
---

# How PHP Runs: Requests and Responses

*Every order at a café is a fresh start. The barista makes your drink, hands it over, and forgets you. PHP works the same way.*

In [Mixing PHP and HTML](/lessons/php/php-and-html), you saw PHP fill values into a page. But when exactly does that code run, and what happens to it afterward? Knowing this answers a lot of beginner puzzles, like "why did my variable forget its value?"

## The café counter

Picture a busy café:

1. A customer walks up and **orders**: "A large hot chocolate, please."
2. The barista **makes** that one drink, following the recipe.
3. The barista **hands it over**, and the customer leaves.
4. The barista moves on to the next customer, with a clean counter, remembering nothing about the last one.

The web works like that:

1. The browser sends a **request**: "Please send me `/menu.php`."
2. The web server hands the request to PHP, which **runs** `menu.php` from top to bottom.
3. Everything the script sends out (with `echo`, or plain HTML outside the PHP tags) becomes the **response**, which goes back to the browser.
4. PHP **forgets everything**. All the script's variables are thrown away.

That cycle, one **request** in and one **response** out, happens for every page, every click, and every form someone submits.

## What's in a request

A request is a small message with a few important parts:

- A **method**: usually `GET` ("send me this page") or `POST` ("here's some data I'm sending you," like a submitted form).
- A **path**: which page, like `/menu.php`.
- Sometimes a **query string**: extra details after a `?` in the address, like `/menu.php?size=large`.

PHP puts these details in special variables for you. `$_SERVER` holds information about the request, and `$_GET` holds the query string's values:

```php
<?php
// Visiting /menu.php?size=large in a browser:
echo $_SERVER["REQUEST_METHOD"]; // GET
echo $_GET["size"];             // large
```

You'll use these properly in [Handling Forms: GET and POST](/lessons/php/forms).

## What's in a response

The response is mostly the text your script produces: an HTML page. Along with it go a few **headers**, small labels about the response, like what kind of content it is. The most important is the **status code**, a number that says how it went:

| Code | Means |
|---|---|
| `200` | OK, here's your page |
| `404` | Not found: there's no page at that address |
| `500` | Server error: something went wrong running the code |

If your PHP script stops with a fatal error, the visitor may just see a blank page, or a `500` error, while the details are in the error message or the server's log. That's why the development settings you chose in [Setting Up](/lessons/php/setting-up) show every error: you want to see them while you're learning.

## Fresh start, every time

Because PHP forgets everything after each request, a variable can't remember anything from one visit to the next. Consider this visit counter:

```php
<?php
$visits = 0;
$visits = $visits + 1;
echo "You have visited this page $visits time(s).\n";
```

```text
You have visited this page 1 time(s).
```

Refresh the page 10 times, and it says `1` every time. Each request starts the script from the top, so `$visits` starts at `0` again.

This isn't a flaw. It keeps each visitor's page separate, and it lets a server handle thousands of requests without them getting mixed up. When you *do* need to remember something, you store it somewhere that lasts:

- In a **session** or a **cookie**, to remember one visitor between pages, like "Maria is logged in." See [Sessions and Cookies](/lessons/php/sessions-and-cookies).
- In a **file** or a **database**, to remember things for everyone, like every sign-up. See [Reading and Writing Files](/lessons/php/files) and [Databases with PDO](/lessons/php/databases-with-pdo).

## Two ways to run the same script

In this track, you run most scripts in the terminal with `php index.php`. On a website, a web server runs them for each request. It's the same PHP language, but a few things differ:

| | Terminal (`php index.php`) | Web (`php -S`, or a real server) |
|---|---|---|
| Who asks | You, typing a command | A browser, sending a request |
| Where output goes | Your terminal window | The browser, as the page |
| Request details (`$_GET`, forms) | Empty: there's no request | Filled from the request |
| Line breaks (`\n`) | Start a new line | Only break the HTML source |

PHP can even tell you which way it's running. `php_sapi_name()` returns `"cli"` in the terminal (command-line interface). With the built-in server, it returns `"cli-server"`.

## Try it

This script describes how it's being run. Predict what it prints when you run it in the terminal with `php index.php`.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="260px"
	:model-value="'&lt;?php\n$counter = 0;\n$counter++;\n$counter++;\n\necho &quot;Running as: &quot; . php_sapi_name() . &quot;\\n&quot;;\necho &quot;Counter: $counter\\n&quot;;\necho &quot;Query values received: &quot; . count($_GET) . &quot;\\n&quot;;\n\nif (php_sapi_name() === &quot;cli&quot;) {\n    echo &quot;No browser here, so there\'s no request.\\n&quot;;\n} else {\n    echo &quot;A browser asked for this page.\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Running as: cli
Counter: 2
Query values received: 0
No browser here, so there's no request.
```

`$counter++` adds 1, so it ends at `2`, and it'll be `2` on every run, never `4` or `6`, because each run starts fresh. In the terminal, there's no request, so `$_GET` is empty. Run it through the built-in server instead, and the first line says `cli-server`, and the last line changes too.
:::

## Try it yourself

1. Save the Try it script, start the built-in server with `php -S localhost:8000`, and open `http://localhost:8000/?a=1&b=2`. What does the query values line say now?
2. Refresh the page a few times. Does the counter ever go above 2? Why not?
3. Open `http://localhost:8000/nothing-here.php`, a page that doesn't exist. What does the browser show, and which status code do you think that is?

## Check your understanding

<Quiz
	question="What happens to a PHP script's variables after it sends its response?"
	:options="['They are thrown away; the next request starts fresh', 'They are saved for the next visitor', 'They are sent to the browser', 'They are saved in a file automatically']"
	:answer-index="0"
	explanation="Each request runs the script from the top with nothing remembered. To keep data, use a session, cookie, file, or database."
/>

<Quiz
	question="What does the status code 404 mean?"
	:options="['The page loaded fine', 'The server crashed', 'There is no page at that address', 'The form was submitted']"
	:answer-index="2"
	explanation="404 means Not Found. 200 means OK, and 500 means something went wrong on the server."
/>

<Quiz
	question="In the address /menu.php?size=large, where does PHP put size?"
	:options="['In $size automatically', 'In $_GET[&quot;size&quot;]', 'In $_SERVER[&quot;size&quot;]', 'Nowhere, PHP ignores it']"
	:answer-index="1"
	explanation="Query string values after the ? are placed in $_GET, so $_GET[&quot;size&quot;] is &quot;large&quot;."
/>

## Up next

You know how PHP runs. Now let's look closely at the values it works with, starting with [Variables and Constants](/lessons/php/variables).
