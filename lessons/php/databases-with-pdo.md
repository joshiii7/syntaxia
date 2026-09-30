---
title: "PHP PDO Tutorial: Using a Database with Prepared Statements"
description: "Connect PHP to a database with PDO: open a SQLite database, create tables, insert and read rows with prepared statements, use transactions, and switch to MySQL later."
---

# Databases with PDO

*A librarian doesn't let you wander the stacks and grab books yourself. You fill in a request slip, and the librarian fetches exactly what's written on it, the right way, every time. PDO is your librarian.*

Files are fine for small lists. But a real website has many visitors reading and writing at once, and needs to search thousands of records quickly. That's what databases are built for.

This lesson connects PHP to **SQLite**, the database from the [SQLite3 track](/lessons/sqlite3/introduction). If you haven't done that track, you'll still follow along, but its [SELECT](/lessons/sqlite3/select) and [INSERT, UPDATE, and DELETE](/lessons/sqlite3/insert-update-delete) lessons explain the SQL used here.

## What is PDO?

**PDO** (PHP Data Objects) is PHP's built-in way to talk to databases. The same PDO code works with SQLite, MySQL, PostgreSQL, and others; mostly, only the connection line changes. It needs the `pdo_sqlite` extension you switched on in [Setting Up](/lessons/php/setting-up).

## Connecting

```php
<?php
declare(strict_types=1);

$db = new PDO("sqlite:" . __DIR__ . "/shop.db");
echo "Connected!\n";
```

```text
Connected!
```

- `new PDO(...)` makes a connection object. The text inside, called the **DSN** (data source name), says which kind of database, and where. For SQLite, it's `sqlite:` followed by the file path. If the file doesn't exist yet, SQLite creates it.
- As with any data file, keep the database outside your public web folder, as you learned in [Reading and Writing Files](/lessons/php/files).

For quick experiments, `new PDO("sqlite::memory:")` makes a database that lives only in memory and disappears when the script ends. The examples in this lesson use that, so each run starts clean.

In PHP 8, PDO **throws exceptions** when a query fails, so SQL mistakes aren't silently ignored. You can catch them as `PDOException`, like in [Errors and Exceptions](/lessons/php/exceptions).

## Creating a table and adding rows

`exec` runs SQL that doesn't return rows, like `CREATE TABLE`:

```php
<?php
declare(strict_types=1);

$db = new PDO("sqlite::memory:");
$db->exec("CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL
)");

$insert = $db->prepare("INSERT INTO products (name, price) VALUES (:name, :price)");
$insert->execute(["name" => "Notebook", "price" => 45]);
$insert->execute(["name" => "Pen", "price" => 12]);
$insert->execute(["name" => "Backpack", "price" => 899]);

echo "Last new id: " . $db->lastInsertId() . "\n";
```

```text
Last new id: 3
```

This is the most important pattern in the lesson: the **prepared statement**.

1. `prepare` sends the SQL with **placeholders**, like `:name` and `:price`, where the values will go.
2. `execute` sends the actual values separately, as an array.

The database never mixes the values into the SQL text. It treats them purely as data, no matter what they contain. And you can reuse a prepared statement, as here, for several rows.

`lastInsertId()` gives the `id` the database chose for the newest row.

## Why placeholders matter: SQL injection

You might be tempted to build the SQL yourself, pasting a visitor's input right into it:

```php
$name = $_GET["name"];
$db->query("SELECT * FROM users WHERE name = '$name'");
```

**Never do this.** Picture a visitor typing this as their "name":

```text
' OR '1'='1
```

The SQL becomes `SELECT * FROM users WHERE name = '' OR '1'='1'`, and since `'1'='1'` is always true, it returns **every** user. Cleverer inputs can delete tables or read passwords. This attack is called **SQL injection**, and it's one of the most damaging security holes on the web.

With placeholders, that input is just an odd name that matches nobody. The rule: **every value that comes from outside goes through a placeholder.** You'll see this again in [Security Essentials](/lessons/php/security-essentials).

## Reading rows

```php
<?php
declare(strict_types=1);

$db = new PDO("sqlite::memory:");
$db->exec("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)");
$db->exec("INSERT INTO products (name, price) VALUES ('Notebook', 45), ('Pen', 12), ('Backpack', 899)");

$stmt = $db->prepare("SELECT name, price FROM products WHERE price < :max ORDER BY price");
$stmt->execute(["max" => 100]);
$cheap = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($cheap as $row) {
    echo $row["name"] . ": " . $row["price"] . "\n";
}
print_r($cheap[0]);
```

```text
Pen: 12
Notebook: 45
Array
(
    [name] => Pen
    [price] => 12
)
```

- `fetchAll` returns every matching row, as an array of rows.
- `PDO::FETCH_ASSOC` makes each row an associative array keyed by column name, exactly like the arrays of records from [Associative Arrays](/lessons/php/associative-arrays).

For a single row, use `fetch`, which returns the row, or `false` if there isn't one:

```php
<?php
declare(strict_types=1);

$db = new PDO("sqlite::memory:");
$db->exec("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)");
$db->exec("INSERT INTO products (name, price) VALUES ('Notebook', 45)");

$stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
$stmt->execute([1]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);
echo $product ? $product["name"] . "\n" : "Not found\n";

$stmt->execute([99]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);
echo $product ? $product["name"] . "\n" : "Not found\n";
```

```text
Notebook
Not found
```

This example uses `?` placeholders, which are filled in order from a plain list. Both styles are fine; named ones are easier to read when there are several values.

To avoid writing `PDO::FETCH_ASSOC` every time, you can set it once when connecting:

```php
$db = new PDO("sqlite:" . __DIR__ . "/shop.db", options: [
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
```

## Updating and deleting

`UPDATE` and `DELETE` use prepared statements too. `rowCount()` tells you how many rows were changed:

```php
<?php
declare(strict_types=1);

$db = new PDO("sqlite::memory:");
$db->exec("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)");
$db->exec("INSERT INTO products (name, price) VALUES ('Notebook', 45), ('Pen', 12), ('Eraser', 8)");

$stmt = $db->prepare("UPDATE products SET price = price + :increase WHERE price < :limit");
$stmt->execute(["increase" => 5, "limit" => 20]);
echo "Updated: " . $stmt->rowCount() . "\n";

$stmt = $db->prepare("DELETE FROM products WHERE name = :name");
$stmt->execute(["name" => "Eraser"]);
echo "Deleted: " . $stmt->rowCount() . "\n";
```

```text
Updated: 2
Deleted: 1
```

## Transactions: all or nothing

Some changes belong together. When a customer orders a backpack, you add the order **and** reduce the stock. If the second step fails, the first shouldn't stay done. A **transaction** (see the SQLite track's [Transactions](/lessons/sqlite3/transactions) lesson) groups them:

```php
<?php
declare(strict_types=1);

$db = new PDO("sqlite::memory:");
$db->exec("CREATE TABLE stock (item TEXT PRIMARY KEY, qty INTEGER NOT NULL CHECK (qty >= 0))");
$db->exec("CREATE TABLE orders (id INTEGER PRIMARY KEY, item TEXT, qty INTEGER)");
$db->exec("INSERT INTO stock VALUES ('backpack', 1)");

function placeOrder(PDO $db, string $item, int $qty): string
{
    try {
        $db->beginTransaction();
        $db->prepare("INSERT INTO orders (item, qty) VALUES (?, ?)")->execute([$item, $qty]);
        $db->prepare("UPDATE stock SET qty = qty - ? WHERE item = ?")->execute([$qty, $item]);
        $db->commit();
        return "Order placed.";
    } catch (PDOException $e) {
        $db->rollBack();
        return "Order cancelled: not enough stock.";
    }
}

echo placeOrder($db, "backpack", 1), "\n";
echo placeOrder($db, "backpack", 1), "\n";
echo "Orders saved: " . $db->query("SELECT COUNT(*) FROM orders")->fetchColumn() . "\n";
```

```text
Order placed.
Order cancelled: not enough stock.
Orders saved: 1
```

The second order's `UPDATE` would make the stock `-1`, which breaks the `CHECK` rule, so PDO throws. `rollBack()` then undoes the whole transaction, including the order that was already inserted. `commit()` makes the changes permanent only when every step worked.

(`query` runs SQL directly, with no placeholders. It's fine here, because the SQL contains no outside values. `fetchColumn` returns the first column of the first row.)

## Other databases

To use MySQL instead, only the connection changes:

```php
$db = new PDO("mysql:host=localhost;dbname=shop;charset=utf8mb4", "username", "password");
```

The prepared statements, `fetch`, and transactions all work the same. The [MySQL track](/lessons/mysql/coming-from-sqlite) covers the differences in the SQL itself. And never write a real password into code you share; keep it in a separate settings file outside your project's Git history.

## Try it

A small library app uses PDO. Predict every line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="500px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\n$db = new PDO(&quot;sqlite::memory:&quot;, options: [\n    PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC,\n]);\n$db-&gt;exec(&quot;CREATE TABLE books (\n    id INTEGER PRIMARY KEY,\n    title TEXT NOT NULL,\n    author TEXT NOT NULL,\n    year INTEGER\n)&quot;);\n\n$add = $db-&gt;prepare(&quot;INSERT INTO books (title, author, year) VALUES (:title, :author, :year)&quot;);\n$books = [\n    [&quot;Noli Me Tangere&quot;, &quot;Jose Rizal&quot;, 1887],\n    [&quot;El Filibusterismo&quot;, &quot;Jose Rizal&quot;, 1891],\n    [&quot;Dekada \'70&quot;, &quot;Lualhati Bautista&quot;, 1983],\n];\nforeach ($books as [$title, $author, $year]) {\n    $add-&gt;execute([&quot;title&quot; =&gt; $title, &quot;author&quot; =&gt; $author, &quot;year&quot; =&gt; $year]);\n}\n\n$byAuthor = $db-&gt;prepare(&quot;SELECT title, year FROM books WHERE author = :author ORDER BY year DESC&quot;);\n$byAuthor-&gt;execute([&quot;author&quot; =&gt; &quot;Jose Rizal&quot;]);\nforeach ($byAuthor-&gt;fetchAll() as $book) {\n    echo &quot;{$book[&quot;title&quot;]} ({$book[&quot;year&quot;]})\\n&quot;;\n}\n\n$search = &quot;\' OR \'1\'=\'1&quot;;\n$find = $db-&gt;prepare(&quot;SELECT COUNT(*) FROM books WHERE title = ?&quot;);\n$find-&gt;execute([$search]);\necho &quot;Matches for the tricky search: &quot; . $find-&gt;fetchColumn() . &quot;\\n&quot;;\n\n$update = $db-&gt;prepare(&quot;UPDATE books SET year = :year WHERE title = :title&quot;);\n$update-&gt;execute([&quot;year&quot; =&gt; 1983, &quot;title&quot; =&gt; &quot;Dekada \'70&quot;]);\necho &quot;Rows updated: &quot; . $update-&gt;rowCount() . &quot;\\n&quot;;\n\ntry {\n    $db-&gt;exec(&quot;INSERT INTO books (title) VALUES (\'Untitled\')&quot;);\n} catch (PDOException $e) {\n    echo &quot;Refused: &quot; . $e-&gt;getMessage() . &quot;\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
El Filibusterismo (1891)
Noli Me Tangere (1887)
Matches for the tricky search: 0
Rows updated: 1
Refused: SQLSTATE[23000]: Integrity constraint violation: 19 NOT NULL constraint failed: books.author
```

Rizal's books come out newest first. The "tricky search" goes through a placeholder, so it's treated as a strange title that matches nothing: count 0. The apostrophe in "Dekada '70" is fine too, for the same reason. The update matches one row (setting the same year still counts as updated in SQLite). And leaving out `author`, a `NOT NULL` column, makes PDO throw with SQLite's own error message.
:::

## Try it yourself

1. Add a fourth book, and print the total number of books with `SELECT COUNT(*)` and `fetchColumn`.
2. Write a prepared `DELETE` that removes books older than a given year, and print how many were deleted.
3. Change `"sqlite::memory:"` to `"sqlite:" . __DIR__ . "/library.db"`, run the script twice, and count the books. What happened, and how could you stop it?

## Check your understanding

<Quiz
	question="Why use prepared statements with placeholders?"
	:options="['They make queries shorter', 'They are required for SELECT', 'Values are sent separately from the SQL, which prevents SQL injection', 'They only work with SQLite']"
	:answer-index="2"
	explanation="Placeholders keep data apart from the SQL, so input like ' OR '1'='1 is just a value, never part of the query."
/>

<Quiz
	question="What does fetch() return when no row matches?"
	:options="['false', 'An empty array', 'null', 'An exception']"
	:answer-index="0"
	explanation="fetch returns the next row, or false when there are none left, so check its result before using it."
/>

<Quiz
	question="In a transaction, what does rollBack() do?"
	:options="['Undoes every change made since beginTransaction()', 'Saves the changes', 'Deletes the database', 'Runs the transaction again']"
	:answer-index="0"
	explanation="rollBack cancels the whole transaction, so either all of its changes happen or none of them do."
/>

## Up next

You've met XSS and SQL injection along the way. The next lesson pulls PHP's security essentials together, including safe password storage and protecting forms from being submitted by other sites, in [Security Essentials](/lessons/php/security-essentials).
