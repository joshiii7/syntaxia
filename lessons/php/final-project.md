---
title: "PHP Final Project: Build an Event Sign-Up Sheet Web App"
description: "Put the whole PHP track to work by building a secure event sign-up web app with a form, validation, a SQLite database through PDO, sessions, CSRF protection, and a live attendee list."
---

# Final Project: Event Sign-Up Sheet

*Every lesson gave you one tool. This project hands you the whole toolbox and a real job to do.*

Before the project, one more look back.

At the start of this track, your first script was two lines: `<?php` and an `echo`. You weren't sure why the semicolon mattered, or why `'$name'` printed a dollar sign.

Look at what you know now. You know how a request travels from a browser to PHP and back, and why a variable forgets its value between visits. You can store values, juggle types without getting juggled, make decisions, and repeat work. You can write functions with typed parameters, split code across files, and keep lists and records in arrays. You can read forms, check every value, escape everything you show, and remember visitors with sessions. You can model real things with classes, save data to files, JSON, and a database, and handle problems with exceptions instead of crashing.

There were surely moments when nothing worked: a parse error pointing at the wrong line, an "Undefined variable" for a variable you were *sure* existed, a "headers already sent" that made no sense. You read the clues, found the cause, and fixed it. That's the real skill, and you have it now.

I'm genuinely proud of you. Let's build something.

## The project

You'll build an **Event Sign-Up Sheet**: a small web app where people sign up for the **Coding Club Hackathon**. It's one page that:

1. Shows the event name and how many of its **5 spots** are left.
2. Has a **sign-up form** for a name, an email, a shirt size, and an optional note.
3. **Checks** every answer, and shows friendly messages next to the fields that need fixing, keeping what the visitor already typed.
4. **Saves** each sign-up in a SQLite database, so it's still there tomorrow.
5. Shows a **"You're signed up!" message** after a successful sign-up.
6. **Lists everyone** who's coming.
7. **Closes the form** when the event is full.

And it's **secure**: no XSS, no SQL injection, no forged forms.

It's the kind of small app that clubs, classes, and teams really use. And it uses something from nearly every chapter of this track.

## Getting set up

This is a project for your own computer.

1. Make a folder called `event-signup`, with three folders inside it: `public`, `src`, and `data`.
2. Create `public/index.php`, and copy the starter code below into it.
3. In the `event-signup` folder, start the built-in server with the `public` folder as the website's root:

```text
php -S localhost:8000 -t public
```

4. Open `http://localhost:8000` in your browser.

The `-t public` part means only the files in `public` can be reached from the browser. Your classes in `src` and your database in `data` stay private, as you learned in [Reading and Writing Files](/lessons/php/files). Real PHP projects are laid out the same way:

```text
event-signup/
├── data/
│   └── signups.db          (created by your code)
├── public/
│   └── index.php           (the only page visitors can reach)
└── src/
    ├── bootstrap.php       (settings, session, and helper functions)
    └── SignupRepository.php
```

The starter code already runs. It shows the page and the form, but submitting it only prints `TODO: handle the form.` Your job is to replace every `TODO` with the real thing.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, public/index.php"
	min-height="560px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nconst EVENT_NAME = &quot;Coding Club Hackathon&quot;;\nconst CAPACITY = 5;\nconst SHIRT_SIZES = [&quot;S&quot;, &quot;M&quot;, &quot;L&quot;, &quot;XL&quot;];\n\n// TODO (requirement 1): connect to ../data/signups.db with PDO,\n// and move the database code into a SignupRepository class in src/.\n// TODO (requirement 4): start the session.\n\nif ($_SERVER[&quot;REQUEST_METHOD&quot;] === &quot;POST&quot;) {\n    // TODO (requirement 4): check the CSRF token.\n    // TODO (requirements 2 and 3): validate the form, and save the sign-up.\n    // TODO (requirement 5): redirect, with a message for the next page.\n    echo &quot;TODO: handle the form.&quot;;\n    exit;\n}\n?&gt;\n&lt;!DOCTYPE html&gt;\n&lt;html lang=&quot;en&quot;&gt;\n&lt;head&gt;\n    &lt;meta charset=&quot;UTF-8&quot;&gt;\n    &lt;meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot;&gt;\n    &lt;title&gt;Sign up: &lt;?= htmlspecialchars(EVENT_NAME) ?&gt;&lt;/title&gt;\n&lt;/head&gt;\n&lt;body&gt;\n&lt;main&gt;\n    &lt;h1&gt;&lt;?= htmlspecialchars(EVENT_NAME) ?&gt;&lt;/h1&gt;\n\n    &lt;form method=&quot;post&quot; novalidate&gt;\n        &lt;label for=&quot;name&quot;&gt;Name&lt;/label&gt;\n        &lt;input type=&quot;text&quot; id=&quot;name&quot; name=&quot;name&quot; required&gt;\n\n        &lt;label for=&quot;email&quot;&gt;Email&lt;/label&gt;\n        &lt;input type=&quot;email&quot; id=&quot;email&quot; name=&quot;email&quot; required&gt;\n\n        &lt;label for=&quot;shirt_size&quot;&gt;Shirt size&lt;/label&gt;\n        &lt;select id=&quot;shirt_size&quot; name=&quot;shirt_size&quot; required&gt;\n            &lt;option value=&quot;&quot;&gt;Choose a size&lt;/option&gt;\n            &lt;?php foreach (SHIRT_SIZES as $size): ?&gt;\n            &lt;option value=&quot;&lt;?= $size ?&gt;&quot;&gt;&lt;?= $size ?&gt;&lt;/option&gt;\n            &lt;?php endforeach; ?&gt;\n        &lt;/select&gt;\n\n        &lt;label for=&quot;note&quot;&gt;Anything we should know? (optional)&lt;/label&gt;\n        &lt;textarea id=&quot;note&quot; name=&quot;note&quot;&gt;&lt;/textarea&gt;\n\n        &lt;button&gt;Sign me up&lt;/button&gt;\n    &lt;/form&gt;\n\n    &lt;h2&gt;Who\'s coming&lt;/h2&gt;\n    &lt;p&gt;TODO (requirement 6): list everyone who has signed up.&lt;/p&gt;\n&lt;/main&gt;\n&lt;/body&gt;\n&lt;/html&gt;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. You can read and edit the starter code here, but build and run the project on your own computer, with the built-in server. If you haven't set PHP up yet, [Setting Up](/lessons/php/setting-up) walks you through it.
:::

Work through the requirements in order, and reload the page after each one. Small steps, tested often, are how every real program gets built.

## Requirements

Each requirement says what to build, **why** it matters, and which lessons to review.

### 1. A database, behind a repository class

- Connect to `data/signups.db` with PDO, and set the default fetch mode to `PDO::FETCH_ASSOC`.
- Write a class `SignupRepository` in `src/SignupRepository.php`. Its constructor takes the `PDO` object, and creates the `signups` table if it doesn't exist yet (`CREATE TABLE IF NOT EXISTS`), with `id`, `name`, `email`, `shirt_size`, `note`, and `created_at` columns. Make `email` `UNIQUE`.
- Give it four methods: `all(): array` (every sign-up, in the order they arrived), `count(): int`, `emailExists(string $email): bool`, and `add(...)`.
- Every query that includes a value uses a **prepared statement** with placeholders.

**Why:** Keeping all the SQL in one class means the page itself never has to think about SQL, and if you ever switch to MySQL, there's one file to check. Review: [Databases with PDO](/lessons/php/databases-with-pdo), [Classes and Objects](/lessons/php/classes-and-objects), and [Constructors and Visibility](/lessons/php/constructors-and-visibility).

### 2. Validation you can trust

Write a function `validateSignup(array $input, SignupRepository $signups): array` that returns the cleaned values **and** an array of error messages keyed by field name:

- **Name**: trimmed; required; at most 60 characters (use `mb_strlen`).
- **Email**: trimmed and lowercased; must pass `FILTER_VALIDATE_EMAIL`; must not already be signed up. (Lowercasing first means `Maria@Example.com` counts as the same person as `maria@example.com`.)
- **Shirt size**: must be one of `SHIRT_SIZES`, checked with `in_array(..., true)`. Visitors can change the dropdown's values in their browser's developer tools, so never trust them.
- **Note**: optional, trimmed, at most 200 characters.

**Why:** Browser checks are easy to get around, so the server checks everything. Returning errors, instead of stopping at the first one, lets visitors fix every problem in one go. Review: [Validating and Escaping User Input](/lessons/php/validating-input), [Working with Strings](/lessons/php/strings), and [Parameters, Types, and Return Values](/lessons/php/parameters).

### 3. A form that remembers

- When there are errors, show the form again, with each message right below its field, and with every field still holding what the visitor typed, including the chosen shirt size (the `selected` attribute).
- Give each error message `role="alert"`, so screen readers announce it.
- When there are no errors, save the sign-up with the repository.

**Why:** Nobody wants to retype a whole form because one field was wrong. Review: [Handling Forms: GET and POST](/lessons/php/forms), [Making Decisions](/lessons/php/if-else) (the template syntax), and [Loops](/lessons/php/loops).

### 4. Security, everywhere

- **Escape** every value you put into the page with an `e()` helper built on `htmlspecialchars`, including names from the database.
- Add a **CSRF token**: make it once per session with `random_bytes`, put it in a hidden field, and check it with `hash_equals` on every POST. If it's missing or wrong, send status `403` and stop.
- Use **prepared statements** for every query with a value (requirement 1).

**Why:** A sign-up sheet is public. Somebody **will** try typing `<script>` as their name. Review: [Security Essentials](/lessons/php/security-essentials) and [Sessions and Cookies](/lessons/php/sessions-and-cookies).

### 5. Post/Redirect/Get, with a message

- After a successful sign-up, store a message like `You're signed up, Maria Santos! See you there.` in `$_SESSION["flash"]`, then **redirect** to `/` with `header("Location: /")` and `exit`.
- On the next page load, show the message once, then remove it from the session. (A message that shows once, then disappears, is often called a **flash message**.)

**Why:** Without the redirect, refreshing the page after signing up would ask to resubmit the form, and try to sign the same person up twice. Review: [Handling Forms](/lessons/php/forms) and [Sessions and Cookies](/lessons/php/sessions-and-cookies).

### 6. The attendee list and the capacity

- Show `X of 5 spots left.`, using a `CAPACITY` constant.
- List everyone who's signed up, in order, with their shirt size, as an `<ol>`. When nobody has signed up yet, show `Nobody yet. Be the first!` instead of an empty list.
- When the event is full, hide the form and show `Sorry, this event is full.`
- The server must also **refuse** a sign-up when the event is full, even if the form was submitted anyway, for example by someone who opened the page while there was still one spot left. Show a message explaining what happened.

**Why:** The page can only show what was true when it was loaded; the server is the one that actually decides. Review: [Indexed Arrays](/lessons/php/arrays) and [Associative Arrays](/lessons/php/associative-arrays).

### 7. Clean, organized code

- `declare(strict_types=1);` at the top of every file, and types on every parameter, return value, and property.
- The settings (`EVENT_NAME`, `CAPACITY`, `SHIRT_SIZES`, the maximum lengths) are constants in `src/bootstrap.php`, which also starts the session and holds the helper functions. `public/index.php` loads it with `require`.
- All the PHP logic happens at the top of `index.php`; the HTML below it only displays results.
- PSR-12 style, clear names, no magic numbers, and no empty `catch` blocks.

**Why:** You'll come back to this code. So might a teammate, a teacher, or a future employer. Review: [Splitting Code with include and require](/lessons/php/include-and-require) and [Best Practices and Common Mistakes](/lessons/php/best-practices).

## Sample run

Your wording and layout don't have to match exactly, but your app should handle every situation here. This shows what's inside `<main>` on the page, as HTML, with the form fields left out to save space.

**First visit**, before anyone has signed up:

```text
<h1>Coding Club Hackathon</h1>
<p>5 of 5 spots left.</p>
<h2>Who's coming (0)</h2>
<p>Nobody yet. Be the first!</p>
```

**Maria signs up** with a valid name, email, and size M. After the redirect:

```text
<h1>Coding Club Hackathon</h1>
<p role="status">You&#039;re signed up, Maria Santos! See you there.</p>
<p>4 of 5 spots left.</p>
<h2>Who's coming (1)</h2>
<ol>
    <li>Maria Santos (M)</li>
</ol>
```

(`&#039;` is the escaped apostrophe; the browser shows it as `You're`.) Reloading the page shows the same list, but the message is gone.

**Someone submits a blank name, the email `ben@`, and a shirt size of `XXL`** (changed in the browser's developer tools):

```text
<p role="alert">Please enter your name.</p>
<p role="alert">Please enter a valid email address, like maria@example.com.</p>
<p role="alert">Please choose a shirt size from the list.</p>
```

Each message appears below its own field, and nothing is saved.

**Someone signs up again as ` MARIA@Example.com `**, with spaces and capitals:

```text
<p role="alert">That email is already signed up.</p>
```

**Someone signs up with the name `<script>alert(1)</script>`.** It's saved exactly as typed, but it's escaped on the way out, so it appears as harmless text and never runs:

```text
<li>&lt;script&gt;alert(1)&lt;/script&gt; (L)</li>
```

**A form is sent without the CSRF token** (as a forged form from another site would be): status `403`, and just this:

```text
This form has expired. Please go back, reload the page, and try again.
```

**The fifth person signs up**, and the event is full:

```text
<p role="status">You&#039;re signed up, Paolo Lim! See you there.</p>
<p>0 of 5 spots left.</p>
<p>Sorry, this event is full.</p>
<h2>Who's coming (5)</h2>
```

**A form submitted from a page opened before the event filled up**:

```text
<p role="alert">Sorry, the event filled up while you were signing up.</p>
<p>0 of 5 spots left.</p>
<p>Sorry, this event is full.</p>
```

## Testing your app

There's no automatic checker for this project, so you're the tester. Try each of these, and make sure nothing breaks:

- Load the page before anyone has signed up.
- Submit the form completely empty.
- Type a name of 61 characters, and a note of 201.
- Try the emails `maria@`, `maria@example`, and a real-looking one that's already signed up, in capitals.
- In your browser's developer tools (right-click the dropdown, then **Inspect**), change a size option's value to `XXL`, choose it, and submit.
- Sign up with the name `<b>Bold</b>` and check that the tags appear as text.
- Delete the hidden `csrf_token` field in the developer tools, then submit. You should get the 403 message.
- Sign up successfully, then press refresh. Nothing should be resubmitted.
- Fill all 5 spots, and check that the form disappears.
- Open the page in two tabs while one spot is left. Sign up in the first tab, then in the second. The second must be refused.
- Stop the server, start it again, and check the list is still there.
- Try to open `http://localhost:8000/data/signups.db` and `http://localhost:8000/src/bootstrap.php`. Neither file should download or show its code. (The built-in server shows your sign-up page instead, since those files aren't in `public`.)

To start over with an empty list at any time, stop the server and delete `data/signups.db`.

## Stretch goals (optional, for the ambitious)

- Add a simple **admin page**, `public/admin.php`, protected by a password stored as a `password_hash`, that lists everyone's email and notes, with a button to remove a sign-up.
- Add a **waiting list**: when the event is full, let people join the list instead, and move the first person up when someone is removed.
- Show **how many of each shirt size** are needed, with `GROUP BY` in SQL, or `array_count_values` in PHP.
- Add a `public/api.php` that sends the attendee list as **JSON**, using [Working with JSON](/lessons/php/json).
- Use **Composer's autoloader** with a `composer.json` and PSR-4, as in [Namespaces and Composer](/lessons/php/namespaces-and-composer), instead of `require_once` for your classes.
- Support **several events**, each with its own capacity, with an `events` table and a foreign key.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own code. Every "no" is just a pointer to your next improvement.

1. Did I try every case in "Testing your app," and did the app survive all of them?
2. Is every value that goes into the page escaped, including names that come from the database?
3. Does every query that includes a value use a placeholder?
4. Does every error message tell the visitor what went wrong **and** what to do instead?
5. If I change the capacity or add a shirt size, is it a one-line change?
6. Is all the SQL inside `SignupRepository`, and all the logic above the HTML in `index.php`?
7. If I came back to this in six months, could I add a new field to the form without being afraid of breaking the others?
8. Would I be happy to share the link to this sign-up sheet with my own club or class?

If you answered yes to all eight, you've built a real, complete, secure PHP web application. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good programmers become great ones.

## Stuck? A reference solution

Try to finish on your own first. Struggling with a problem, and then solving it, is exactly how the skill sticks. But if you're truly stuck on one part, or you've finished and want to compare, here's one complete solution. It's not the only right answer; if yours works and reads clearly, it's just as good.

::: details Show the reference solution
`src/SignupRepository.php`:

```php
<?php
declare(strict_types=1);

final class SignupRepository
{
    public function __construct(private PDO $db)
    {
        $this->db->exec("CREATE TABLE IF NOT EXISTS signups (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            shirt_size TEXT NOT NULL,
            note TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )");
    }

    public function all(): array
    {
        return $this->db->query("SELECT name, shirt_size FROM signups ORDER BY id")->fetchAll();
    }

    public function count(): int
    {
        return (int) $this->db->query("SELECT COUNT(*) FROM signups")->fetchColumn();
    }

    public function emailExists(string $email): bool
    {
        $stmt = $this->db->prepare("SELECT 1 FROM signups WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetchColumn() !== false;
    }

    public function add(string $name, string $email, string $shirtSize, string $note): void
    {
        $stmt = $this->db->prepare(
            "INSERT INTO signups (name, email, shirt_size, note) VALUES (:name, :email, :size, :note)"
        );
        $stmt->execute(["name" => $name, "email" => $email, "size" => $shirtSize, "note" => $note]);
    }
}
```

`src/bootstrap.php`:

```php
<?php
declare(strict_types=1);

require_once __DIR__ . "/SignupRepository.php";

const EVENT_NAME = "Coding Club Hackathon";
const CAPACITY = 5;
const SHIRT_SIZES = ["S", "M", "L", "XL"];
const MAX_NAME_LENGTH = 60;
const MAX_NOTE_LENGTH = 200;

session_start();

function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, "UTF-8");
}

function csrfToken(): string
{
    if (!isset($_SESSION["csrf_token"])) {
        $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
    }
    return $_SESSION["csrf_token"];
}

function isValidCsrfToken(string $sent): bool
{
    return isset($_SESSION["csrf_token"]) && hash_equals($_SESSION["csrf_token"], $sent);
}

function takeFlash(): ?string
{
    $message = $_SESSION["flash"] ?? null;
    unset($_SESSION["flash"]);
    return $message;
}

/**
 * Checks the submitted form. Returns the cleaned values and a list of errors, keyed by field.
 */
function validateSignup(array $input, SignupRepository $signups): array
{
    $values = [
        "name" => trim((string) ($input["name"] ?? "")),
        "email" => strtolower(trim((string) ($input["email"] ?? ""))),
        "shirt_size" => (string) ($input["shirt_size"] ?? ""),
        "note" => trim((string) ($input["note"] ?? "")),
    ];
    $errors = [];

    if ($values["name"] === "") {
        $errors["name"] = "Please enter your name.";
    } elseif (mb_strlen($values["name"]) > MAX_NAME_LENGTH) {
        $errors["name"] = "Your name must be " . MAX_NAME_LENGTH . " characters or fewer.";
    }

    if (filter_var($values["email"], FILTER_VALIDATE_EMAIL) === false) {
        $errors["email"] = "Please enter a valid email address, like maria@example.com.";
    } elseif ($signups->emailExists($values["email"])) {
        $errors["email"] = "That email is already signed up.";
    }

    if (!in_array($values["shirt_size"], SHIRT_SIZES, true)) {
        $errors["shirt_size"] = "Please choose a shirt size from the list.";
    }

    if (mb_strlen($values["note"]) > MAX_NOTE_LENGTH) {
        $errors["note"] = "Please keep the note to " . MAX_NOTE_LENGTH . " characters or fewer.";
    }

    return [$values, $errors];
}
```

`public/index.php`:

```php
<?php
declare(strict_types=1);

require __DIR__ . "/../src/bootstrap.php";

$db = new PDO("sqlite:" . __DIR__ . "/../data/signups.db", options: [
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$signups = new SignupRepository($db);

$values = ["name" => "", "email" => "", "shirt_size" => "", "note" => ""];
$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isValidCsrfToken((string) ($_POST["csrf_token"] ?? ""))) {
        http_response_code(403);
        exit("This form has expired. Please go back, reload the page, and try again.");
    }

    [$values, $errors] = validateSignup($_POST, $signups);

    if ($signups->count() >= CAPACITY) {
        $errors["form"] = "Sorry, the event filled up while you were signing up.";
    }

    if ($errors === []) {
        $signups->add($values["name"], $values["email"], $values["shirt_size"], $values["note"]);
        $_SESSION["flash"] = "You're signed up, " . $values["name"] . "! See you there.";
        header("Location: /");
        exit;
    }
}

$attendees = $signups->all();
$spotsLeft = CAPACITY - count($attendees);
$flash = takeFlash();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sign up: <?= e(EVENT_NAME) ?></title>
</head>
<body>
<main>
    <h1><?= e(EVENT_NAME) ?></h1>

    <?php if ($flash !== null): ?>
    <p role="status"><?= e($flash) ?></p>
    <?php endif; ?>

    <?php if (isset($errors["form"])): ?>
    <p role="alert"><?= e($errors["form"]) ?></p>
    <?php endif; ?>

    <p><?= $spotsLeft ?> of <?= CAPACITY ?> spots left.</p>

    <?php if ($spotsLeft > 0): ?>
    <form method="post" novalidate>
        <input type="hidden" name="csrf_token" value="<?= e(csrfToken()) ?>">

        <label for="name">Name</label>
        <input type="text" id="name" name="name" value="<?= e($values["name"]) ?>" required>
        <?php if (isset($errors["name"])): ?>
        <p role="alert"><?= e($errors["name"]) ?></p>
        <?php endif; ?>

        <label for="email">Email</label>
        <input type="email" id="email" name="email" value="<?= e($values["email"]) ?>" required>
        <?php if (isset($errors["email"])): ?>
        <p role="alert"><?= e($errors["email"]) ?></p>
        <?php endif; ?>

        <label for="shirt_size">Shirt size</label>
        <select id="shirt_size" name="shirt_size" required>
            <option value="">Choose a size</option>
            <?php foreach (SHIRT_SIZES as $size): ?>
            <option value="<?= e($size) ?>"<?= $values["shirt_size"] === $size ? " selected" : "" ?>><?= e($size) ?></option>
            <?php endforeach; ?>
        </select>
        <?php if (isset($errors["shirt_size"])): ?>
        <p role="alert"><?= e($errors["shirt_size"]) ?></p>
        <?php endif; ?>

        <label for="note">Anything we should know? (optional)</label>
        <textarea id="note" name="note"><?= e($values["note"]) ?></textarea>
        <?php if (isset($errors["note"])): ?>
        <p role="alert"><?= e($errors["note"]) ?></p>
        <?php endif; ?>

        <button>Sign me up</button>
    </form>
    <?php else: ?>
    <p>Sorry, this event is full.</p>
    <?php endif; ?>

    <h2>Who's coming (<?= count($attendees) ?>)</h2>
    <?php if ($attendees === []): ?>
    <p>Nobody yet. Be the first!</p>
    <?php else: ?>
    <ol>
        <?php foreach ($attendees as $attendee): ?>
        <li><?= e($attendee["name"]) ?> (<?= e($attendee["shirt_size"]) ?>)</li>
        <?php endforeach; ?>
    </ol>
    <?php endif; ?>
</main>
</body>
</html>
```
:::

## Check your understanding

<Quiz
	question="Why does the app run with php -S localhost:8000 -t public?"
	:options="['It makes the server faster', 'Only files in public can be reached from the browser, so the database and classes stay private', 'The -t flag turns on strict types', 'PHP requires a folder called public']"
	:answer-index="1"
	explanation="-t sets the website's root folder. Everything outside it, like data/signups.db and src/, can't be downloaded by visitors."
/>

<Quiz
	question="Why does the app redirect after a successful sign-up?"
	:options="['To clear the database', 'So refreshing the page doesn\'t resubmit the form and sign the same person up twice', 'Browsers require it after every POST', 'To log the visitor out']"
	:answer-index="1"
	explanation="Post/Redirect/Get turns the POST into a fresh GET page, so a refresh just reloads the list."
/>

<Quiz
	question="The form is hidden when the event is full. Why must the server still check the capacity on every POST?"
	:options="['Hidden forms submit themselves', 'SQLite cannot count rows', 'It doesn\'t need to; hiding the form is enough', 'A page opened earlier, or a hand-made request, can still submit the form, so only the server can enforce the limit']"
	:answer-index="3"
	explanation="What the page showed may be out of date, and requests can be sent without the page at all. The server makes the final decision."
/>

## Where you go from here

You've finished the PHP track. Take a moment with that. You started with a line of `echo`, and you've just built a secure web application with a database, validation, sessions, and protection against the most common attacks on the web.

PHP opens a lot of doors from here. **Laravel** is the most popular PHP framework, and it gives you routing, templates, a database toolkit, logins, and much more, all built on the ideas you know now; the [Laravel track](/lessons/laravel/introduction) picks up where this one ends. **WordPress**, which runs a huge share of the web, is PHP too, and the [WordPress track](/lessons/wordpress/introduction) shows how to build themes and plugins for it. And when your apps need a bigger database, the [MySQL track](/lessons/mysql/coming-from-sqlite) builds on the SQL you already have.

Whichever way you go, the ideas you've learned here, requests and responses, validating and escaping, prepared statements, and the patience to read an error message calmly, travel with you into every framework and language you learn next. Well done.
