---
title: "PHP Sessions and Cookies: Remembering Visitors Between Pages"
description: "Make PHP remember visitors: store data in $_SESSION with session_start, build a login and logout, save preferences in cookies with setcookie, and keep both secure."
---

# Sessions and Cookies

*At a coat check, you hand over your coat and get a numbered ticket. The coat stays behind the counter; you only carry the ticket. Show it later, and you get your own coat back.*

In [How PHP Runs](/lessons/php/how-php-runs), you saw that PHP forgets everything after each request. So how does a shop remember your cart as you move from page to page? How do you stay logged in? The answer is a partnership between two things: **cookies**, kept by the browser, and **sessions**, kept by the server.

Run the examples in this lesson with the built-in server (`php -S localhost:8000`), since they only work with a real browser.

## Cookies: small notes the browser keeps

A **cookie** is a small piece of text that a website asks the browser to store. After that, the browser sends it back with every request to the same site, automatically.

```php
<?php
if (isset($_GET["theme"])) {
    $theme = $_GET["theme"] === "dark" ? "dark" : "light";
    setcookie("theme", $theme, [
        "expires" => time() + 60 * 60 * 24 * 30,
        "path" => "/",
        "httponly" => true,
        "samesite" => "Lax",
    ]);
} else {
    $theme = $_COOKIE["theme"] ?? "light";
}
?>
<p>Theme: <?= htmlspecialchars($theme) ?></p>
```

Open `theme.php?theme=dark` once. From then on, even at plain `theme.php`, and even after closing the browser, the page says:

```text
<p>Theme: dark</p>
```

- `setcookie(name, value, options)` asks the browser to store a cookie. Like `header()` in [Handling Forms](/lessons/php/forms), it must run **before any output**, because cookies travel in the response headers.
- `expires` is when the browser should delete it, as a timestamp. `time()` is "now" in seconds, so this is 30 days from now. Without `expires`, the cookie is deleted when the browser closes.
- `$_COOKIE` holds the cookies the browser sent **with this request**. A cookie you set now appears there from the **next** request on. That's why the code uses `$theme` directly on the request that sets it.

The most important thing to know about cookies: **the visitor can see and change them.** They live in the browser, and anyone can edit them in the developer tools. A cookie saying `isAdmin=yes` would make anyone an admin. Cookies are fine for harmless preferences, like a theme or a language, but never for anything you need to trust.

## Sessions: the coat check

For anything that matters, like who's logged in or what's in a cart, use a **session**. The data stays on the **server**, and the browser only carries a ticket: a long random ID, stored in a cookie called `PHPSESSID`.

```php
<?php
session_start();

$_SESSION["visits"] = ($_SESSION["visits"] ?? 0) + 1;
?>
<p>You've opened this page <?= $_SESSION["visits"] ?> time(s) in this session.</p>
```

Refresh it three times, and the count goes up:

```text
<p>You've opened this page 1 time(s) in this session.</p>
<p>You've opened this page 2 time(s) in this session.</p>
<p>You've opened this page 3 time(s) in this session.</p>
```

Open the same page in a private window, which has no ticket yet, and it starts again at 1: a new visitor, a new session.

- `session_start()` must come at the top of every page that uses the session, before any output. It either finds the visitor's existing session from their ticket, or starts a new one.
- `$_SESSION` is an array that PHP saves on the server at the end of each request, and loads again the next time that visitor shows up with their ticket.
- You use `$_SESSION` like any associative array: add keys, read them with `??`, and `unset` them.

Compare this with the counter in [How PHP Runs](/lessons/php/how-php-runs), which was stuck at 1. The session is the "somewhere that lasts."

## Logging in and out

Here's the heart of every login system, with the password check left out for now (you'll do that properly in [Security Essentials](/lessons/php/security-essentials)):

```php
<?php
session_start();

if (($_GET["action"] ?? "") === "login") {
    session_regenerate_id(true);
    $_SESSION["user"] = "Maria";
} elseif (($_GET["action"] ?? "") === "logout") {
    $_SESSION = [];
    session_destroy();
}

$user = $_SESSION["user"] ?? null;
?>
<?php if ($user !== null): ?>
<p>Welcome back, <?= htmlspecialchars($user) ?>!</p>
<?php else: ?>
<p>You are not logged in.</p>
<?php endif; ?>
```

Visiting it plainly, then with `?action=login`, then plainly again, then with `?action=logout`, gives:

```text
<p>You are not logged in.</p>
<p>Welcome back, Maria!</p>
<p>Welcome back, Maria!</p>
<p>You are not logged in.</p>
```

Two lines deserve a closer look:

- `session_regenerate_id(true)` gives the visitor a **new ticket number** at the moment they log in. That protects against an attack called **session fixation**, where someone tricks a victim into using a ticket number the attacker already knows. Always regenerate the ID when someone logs in.
- To log out, empty `$_SESSION` and call `session_destroy()`, which throws away the stored data on the server.

(A real login would use a POST form, not `?action=login` in the address. The links just keep this example short.)

## Sessions or cookies?

| | Cookie | Session |
|---|---|---|
| Stored | In the browser | On the server |
| Visitor can read and change it | Yes | No, only the ticket |
| Lasts | Until it expires, even after closing the browser | Until logout, or until the visitor is gone a while |
| Good for | Preferences: theme, language, "remember me" choices | Logins, carts, anything you need to trust |

## Keeping them safe

- Only store trusted things, like "who is logged in", in the session, never in cookies.
- Regenerate the session ID on login.
- Set `httponly` on cookies, so JavaScript on the page can't read them. That limits the damage if an XSS attack slips through.
- On a real website with HTTPS, set `secure` to `true`, so cookies are only sent over encrypted connections.
- `samesite` set to `"Lax"` stops most other sites from sending your cookies along with their requests.

## Try it

A shop keeps a cart in `$_SESSION`. Here, the first line **pretends** the visitor already has two things in their cart from earlier pages, so you can run it in the terminal. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\n// Pretend earlier requests already put this in the session:\n$_SESSION = [&quot;cart&quot; =&gt; [&quot;pencil&quot; =&gt; 3, &quot;notebook&quot; =&gt; 1]];\n\n$prices = [&quot;pencil&quot; =&gt; 12, &quot;notebook&quot; =&gt; 45, &quot;eraser&quot; =&gt; 8];\n\nfunction addToCart(string $item, int $qty): void {\n    $_SESSION[&quot;cart&quot;][$item] = ($_SESSION[&quot;cart&quot;][$item] ?? 0) + $qty;\n}\n\naddToCart(&quot;eraser&quot;, 2);\naddToCart(&quot;pencil&quot;, 2);\nunset($_SESSION[&quot;cart&quot;][&quot;notebook&quot;]);\n\n$total = 0;\nforeach ($_SESSION[&quot;cart&quot;] as $item =&gt; $qty) {\n    $cost = $qty * $prices[$item];\n    echo &quot;$item x$qty = $cost\\n&quot;;\n    $total += $cost;\n}\necho &quot;Items in cart: &quot; . array_sum($_SESSION[&quot;cart&quot;]) . &quot;\\n&quot;;\necho &quot;Total: $total\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
pencil x5 = 60
eraser x2 = 16
Items in cart: 7
Total: 76
```

`$_SESSION` is a **superglobal**, like `$_GET` and `$_POST`: it's visible inside functions without `global`, which is why `addToCart` can change it. Pencils go from 3 to 5, the erasers are new, and the notebook is removed. On a real site, with `session_start()` at the top, this cart would still be there on the next page.
:::

## Try it yourself

1. Add a function `removeFromCart(string $item): void`, and use it instead of the `unset` line.
2. Build `counter.php` from this lesson and run it with the built-in server. Add a link that resets the count, using `unset($_SESSION["visits"])`.
3. Change the theme example so it also accepts `?theme=sepia`. What happens if someone visits `?theme=<b>hi</b>`, and why is that safe?

## Check your understanding

<Quiz
	question="Where is session data stored?"
	:options="['In the visitor\'s browser', 'In the page\'s HTML', 'In the URL', 'On the server; the browser only keeps an ID']"
	:answer-index="3"
	explanation="Session data stays on the server. The browser only holds the session ID, in a cookie, like a coat check ticket."
/>

<Quiz
	question="Why is a cookie like isAdmin=yes a bad idea?"
	:options="['Cookies cannot hold words', 'Visitors can change their own cookies', 'Cookies expire too quickly', 'PHP cannot read cookies']"
	:answer-index="1"
	explanation="Cookies live in the browser, and visitors can edit them. Anything you need to trust belongs in the session."
/>

<Quiz
	question="When should you call session_regenerate_id(true)?"
	:options="['On every page', 'When a user logs in', 'Only on logout', 'Never, it is outdated']"
	:answer-index="1"
	explanation="A new session ID on login protects against session fixation, where an attacker knows the old ID."
/>

## Up next

You've been using associative arrays to hold records, like a student with a name and a grade. PHP has a more powerful way to model things like that, bundling data and the functions that work on it: [Classes and Objects](/lessons/php/classes-and-objects).
