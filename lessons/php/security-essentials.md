---
title: "PHP Security Basics: XSS, SQL Injection, CSRF, and Passwords"
description: "Protect PHP websites from the most common attacks: escape output against XSS, use prepared statements against SQL injection, add CSRF tokens to forms, and store passwords with password_hash."
---

# Security Essentials: XSS, SQL Injection, and CSRF

*A house has a lock on the front door, a latch on the windows, and a peephole. No single one keeps everyone out, but together they make break-ins hard. Website security works the same way: several simple habits, used every time.*

A website is open to the whole world, and some visitors aren't friendly. The good news: most attacks on PHP sites exploit a handful of well-known mistakes, and each has a well-known fix. You've met two already. This lesson gathers them into one checklist, and adds two more.

## 1. Escape output: stopping XSS

**The attack**: someone submits text containing HTML or JavaScript, like `<script>...</script>`, and your page shows it to other visitors, whose browsers run it. That's **cross-site scripting** (XSS), from [Validating and Escaping User Input](/lessons/php/validating-input).

**The fix**: escape every outside value with `htmlspecialchars` at the moment you put it into HTML.

```php
<?php
function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, "UTF-8");
}

$comment = '<img src=x onerror="alert(1)">Nice post!';
echo "<p>" . e($comment) . "</p>\n";
```

```text
<p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;Nice post!</p>
```

"Outside values" means form data, but also anything from the database, files, cookies, or the address bar, since visitors may have put it there earlier.

## 2. Use placeholders: stopping SQL injection

**The attack**: someone types SQL into a form, and your code pastes it into a query, changing what the query does. That's **SQL injection**, from [Databases with PDO](/lessons/php/databases-with-pdo).

**The fix**: every outside value goes through a placeholder in a prepared statement. Never build SQL by joining strings with user input.

```php
<?php
$db = new PDO("sqlite::memory:");
$db->exec("CREATE TABLE users (name TEXT)");
$db->exec("INSERT INTO users VALUES ('Maria'), ('Ben')");

$typed = "x' OR '1'='1";
$stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE name = ?");
$stmt->execute([$typed]);
echo "Users found: " . $stmt->fetchColumn() . "\n";
```

```text
Users found: 0
```

## 3. Hash passwords: never store them

**The risk**: if your database is ever stolen, and passwords are stored as plain text, every account is exposed, and since people reuse passwords, their email and bank accounts too.

**The fix**: never store the password itself. Store a **hash**: a scrambled fingerprint that can check a password, but can't be turned back into it. PHP makes this easy with two functions:

```php
<?php
$hash = password_hash("sunflower42", PASSWORD_DEFAULT);
echo "Stored: " . substr($hash, 0, 7) . "... (" . strlen($hash) . " characters)\n";

var_dump(password_verify("sunflower42", $hash));
var_dump(password_verify("Sunflower42", $hash));
```

```text
Stored: $2y$12$... (60 characters)
bool(true)
bool(false)
```

- `password_hash` makes the hash. At sign-up, save **this** in the database.
- `password_verify` checks a typed password against a stored hash. At login, use this.
- `PASSWORD_DEFAULT` uses PHP's current recommended method (bcrypt, which is what the `$2y$` at the start means). Its hashes can be up to 255 characters in the future, so give the database column room.
- Each hash includes a random **salt**, so hashing the same password twice gives two different hashes. That's why you can't check a password by hashing it again and comparing with `===`; always use `password_verify`.

Never write your own password scrambling, and never use fast hash functions like `md5` or `sha1` for passwords. They're far too quick to guess.

A login check then looks like this:

```php
<?php
function login(PDO $db, string $email, string $password): bool
{
    $stmt = $db->prepare("SELECT id, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user === false || !password_verify($password, $user["password_hash"])) {
        return false;
    }
    session_regenerate_id(true);
    $_SESSION["user_id"] = $user["id"];
    return true;
}
```

When the login fails, tell the visitor "Wrong email or password," not which one was wrong. Otherwise, attackers can use your login page to find out which emails have accounts.

## 4. CSRF tokens: stopping forged forms

**The attack**: Maria is logged in to your shop. She visits another, malicious site, which contains a hidden form that submits to **your** site, say, "change email to attacker@example.com", and sends it automatically. Her browser attaches her session cookie, so your site thinks Maria sent it. That's **cross-site request forgery**, or **CSRF**.

**The fix**: every form that changes something includes a secret, random **token** that only your site knows, stored in the session. The other site can't read it, so its forged form can't include it.

```php
<?php
session_start();

// Once per session: make a random token.
if (!isset($_SESSION["csrf_token"])) {
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $sent = $_POST["csrf_token"] ?? "";
    if (!hash_equals($_SESSION["csrf_token"], $sent)) {
        http_response_code(403);
        exit("This form has expired. Please go back and try again.");
    }
    // ... safe to handle the form ...
}
?>
<form method="post">
    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION["csrf_token"]) ?>">
    <label for="email">New email</label>
    <input type="email" id="email" name="email">
    <button>Save</button>
</form>
```

- `random_bytes(32)` makes 32 truly random bytes, and `bin2hex` turns them into 64 letters and digits.
- The token goes in a **hidden** field, so it's sent with the form.
- `hash_equals` compares the two strings safely. (A plain `===` can, in theory, leak how many characters matched, through tiny timing differences.)
- `http_response_code(403)` sends the "Forbidden" status, and `exit` stops the script with a message.

The `samesite` cookie setting from [Sessions and Cookies](/lessons/php/sessions-and-cookies) blocks many CSRF attacks too, but tokens are the dependable fix. Frameworks like Laravel add them to every form automatically.

## The rest of the checklist

- **Validate all input** on the server, as in [Validating and Escaping User Input](/lessons/php/validating-input).
- **Use HTTPS** on your live site, so passwords and session cookies are encrypted in transit, and set cookies to `secure`.
- **Hide error details** from visitors on a live site, and log them instead, as in [Errors and Exceptions](/lessons/php/exceptions).
- **Keep secrets out of your code**: database passwords go in a settings file outside the public folder and outside Git.
- **Keep PHP and your Composer packages up to date**. Security fixes arrive in new versions. Composer can check your packages: `composer audit`.
- **Be careful with uploads**: never trust a file's name or type, and never save uploads where the web server would run them as PHP.

## Try it

A sign-up and login flow with the essentials in place. Predict every line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="500px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nfunction e(string $text): string\n{\n    return htmlspecialchars($text, ENT_QUOTES, &quot;UTF-8&quot;);\n}\n\n$db = new PDO(&quot;sqlite::memory:&quot;);\n$db-&gt;exec(&quot;CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password_hash TEXT)&quot;);\n\nfunction signUp(PDO $db, string $name, string $email, string $password): void\n{\n    $stmt = $db-&gt;prepare(&quot;INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)&quot;);\n    $stmt-&gt;execute([$name, $email, password_hash($password, PASSWORD_DEFAULT)]);\n}\n\nfunction checkLogin(PDO $db, string $email, string $password): ?string\n{\n    $stmt = $db-&gt;prepare(&quot;SELECT name, password_hash FROM users WHERE email = ?&quot;);\n    $stmt-&gt;execute([$email]);\n    $user = $stmt-&gt;fetch(PDO::FETCH_ASSOC);\n    if ($user === false || !password_verify($password, $user[&quot;password_hash&quot;])) {\n        return null;\n    }\n    return $user[&quot;name&quot;];\n}\n\nsignUp($db, &quot;&lt;b&gt;Joy&lt;/b&gt;&quot;, &quot;joy@example.com&quot;, &quot;mango-season-2026&quot;);\n\n$attempts = [\n    [&quot;joy@example.com&quot;, &quot;mango-season-2026&quot;],\n    [&quot;joy@example.com&quot;, &quot;Mango-season-2026&quot;],\n    [&quot;x\' OR \'1\'=\'1&quot;, &quot;anything&quot;],\n];\nforeach ($attempts as [$email, $password]) {\n    $name = checkLogin($db, $email, $password);\n    echo $name === null ? &quot;Wrong email or password.\\n&quot; : &quot;Welcome, &quot; . e($name) . &quot;!\\n&quot;;\n}\n\n$stored = $db-&gt;query(&quot;SELECT password_hash FROM users&quot;)-&gt;fetchColumn();\nvar_dump(str_contains($stored, &quot;mango&quot;));\nvar_dump(hash_equals(&quot;abc123&quot;, &quot;abc123&quot;));\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Welcome, &lt;b&gt;Joy&lt;/b&gt;!
Wrong email or password.
Wrong email or password.
bool(false)
bool(true)
```

The first login matches the hash. The second has a capital M, and passwords are case-sensitive. The injection attempt goes through a placeholder, so it's just an email address nobody has. The name is escaped on output, so the `<b>` tags show as text. And the stored value is a hash: the password itself appears nowhere in the database.
:::

## Try it yourself

1. Add a second user, and check that each can only log in with their own password.
2. Try signing up `joy@example.com` a second time. What happens, and how would you show a friendly message instead?
3. Print `password_hash("test", PASSWORD_DEFAULT)` twice. Are the two hashes the same? Does `password_verify` accept both?

## Check your understanding

<Quiz
	question="How should a website store users' passwords?"
	:options="['As plain text, so they can be emailed back', 'Encrypted with md5', 'As a hash from password_hash, checked with password_verify', 'In a cookie']"
	:answer-index="2"
	explanation="password_hash makes a salted, slow hash that can check a password but can't be turned back into it."
/>

<Quiz
	question="What does a CSRF token protect against?"
	:options="['Slow page loads', 'Another site submitting a form to your site using a logged-in visitor\'s session', 'SQL injection', 'Visitors forgetting their passwords']"
	:answer-index="1"
	explanation="Only your pages know the token, so a forged form from another site can't include it, and your site rejects it."
/>

<Quiz
	question="Which habit stops XSS?"
	:options="['Prepared statements', 'Hashing passwords', 'Using POST instead of GET', 'Escaping outside values with htmlspecialchars when outputting HTML']"
	:answer-index="3"
	explanation="Escaping turns HTML's special characters into harmless codes, so browsers show visitor text instead of running it."
/>

## Up next

Your code can be secure and still hard to work with. The last lesson before the final project collects the habits that make PHP code clean, readable, and easy to change: [Best Practices and Common Mistakes](/lessons/php/best-practices).
