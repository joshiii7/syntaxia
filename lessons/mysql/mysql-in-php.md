---
title: "Using MySQL from PHP with PDO: Connect, Query, and Handle Errors"
description: "Connect PHP to MySQL with PDO: enable pdo_mysql, write the DSN, set safe options, use a least-privilege account, run prepared statements, handle DECIMAL values, catch duplicate-key errors, and use transactions."
---

# Using MySQL from PHP with PDO

*You've learned how a library works from the inside. Now you're building the website that visitors use to borrow books, and it has to talk to the librarian politely and safely.*

In the PHP track's [Databases with PDO](/lessons/php/databases-with-pdo) lesson, you used PDO with SQLite. The great thing about PDO is that almost everything you learned there works with MySQL too: `prepare`, `execute`, `fetchAll`, transactions. Mostly, **only the connection changes**. This lesson shows that connection, and the handful of details that are different with a real MySQL server.

## Turning on the MySQL driver

PDO needs a driver for each kind of database. For MySQL, that's `pdo_mysql`:

- **Windows:** in your `php.ini` (from [Setting Up PHP](/lessons/php/setting-up)), remove the `;` at the start of the line `extension=pdo_mysql`.
- **macOS with Homebrew:** it's already included.
- **Ubuntu and Debian:** `sudo apt install php-mysql`.

Check with `php -m`, and look for `pdo_mysql` in the list.

## A safe account for the app

You'll connect as a special account for the website, **not** as root, following the least-privilege advice from [Users and Privileges](/lessons/mysql/users-and-privileges). Here's the setup used in this lesson, run once as root in the `mysql` client:

```text
CREATE DATABASE shop CHARACTER SET utf8mb4;
CREATE USER 'shop_app'@'localhost' IDENTIFIED BY 'S3cure-pass!';
GRANT SELECT, INSERT, UPDATE, DELETE ON shop.* TO 'shop_app'@'localhost';
```

The account can read and change rows in `shop`, and nothing else: it can't create or drop tables. (Use a different account, run by you, for changes to the table structure.)

## Connecting

```php
<?php
declare(strict_types=1);

$dsn = "mysql:host=localhost;dbname=shop;charset=utf8mb4";
$db = new PDO($dsn, "shop_app", "S3cure-pass!", [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

echo "Connected to MySQL " . $db->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n";
```

```text
Connected to MySQL 9.7.2
```

Compare this with SQLite's `new PDO("sqlite:...")`. There's more to say now, because MySQL is a server:

- **The DSN** (data source name) is a string of `key=value` pairs separated by semicolons: `host` (where the server is), `dbname` (the database to use), and `charset`. You can add `port=3307` if the server isn't on the default port.
- **`charset=utf8mb4`** makes the connection use real UTF-8, so accents and emoji arrive intact, as explained in [Character Sets and utf8mb4](/lessons/mysql/character-sets). Never leave it out.
- The **username and password** are the next two arguments.
- **The options array** sets three good habits:
  - `ERRMODE_EXCEPTION` makes failed queries throw a `PDOException`, so problems can't slip by unnoticed.
  - `FETCH_ASSOC` makes rows come back as associative arrays, so you don't have to say so on every fetch.
  - `EMULATE_PREPARES => false` makes MySQL itself prepare your statements (real prepared statements), and return numbers as real numbers.

One detail: on macOS and Linux, `host=localhost` connects through a local **socket file** instead of the network. If that fails, or when connecting to another computer, use `host=127.0.0.1`, or its address.

## Keep the password out of your code

Don't write real passwords in files that go into Git, or that live in the public folder. Put the connection settings in a separate file **outside** the public folder, like `config.php` in the parent folder, and have it `return` an array:

```php
<?php
// config.php (outside the public folder, and listed in .gitignore)
return [
    "host" => "localhost",
    "name" => "shop",
    "user" => "shop_app",
    "password" => "S3cure-pass!",
];
```

Then `$config = require __DIR__ . "/../config.php";` builds the DSN from it. This is the same idea as the private `data` folder in the [PHP final project](/lessons/php/final-project).

## Queries: the same, with a few MySQL details

Everything from the PDO lesson works here. Inserting with a prepared statement, and reading the new ID with `lastInsertId()`, which uses `AUTO_INCREMENT` from [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment):

```php
$add = $db->prepare("INSERT INTO products (name, sku, price, stock) VALUES (:name, :sku, :price, :stock)");
$add->execute(["name" => "Café mug", "sku" => "MUG-01", "price" => "150.00", "stock" => 12]);
$add->execute(["name" => "Notebook", "sku" => "NB-02", "price" => "45.50", "stock" => 40]);
echo "Newest id: " . $db->lastInsertId() . "\n";

$products = $db->query("SELECT id, name, price, stock FROM products ORDER BY id")->fetchAll();
var_dump($products[0]);
```

```text
Newest id: 2
array(4) {
  ["id"]=>
  int(1)
  ["name"]=>
  string(9) "Café mug"
  ["price"]=>
  string(6) "150.00"
  ["stock"]=>
  int(12)
}
```

Look closely at the types: `id` and `stock` come back as **ints**, but `price` comes back as a **string**, `"150.00"`. That's deliberate. MySQL's `DECIMAL` is exact, and PHP's float isn't, so PDO hands the value over as text, to keep it exact. When you only display prices, that's perfect. If you need to calculate with them, convert carefully, and use whole cents if you can, as discussed in [Data Types](/lessons/php/data-types).

## Placeholders for lists

A `WHERE id IN (...)` with a list from the visitor needs one placeholder per value. Build them, and never paste the values in:

```php
$ids = [1, 2, 99];
$marks = implode(", ", array_fill(0, count($ids), "?"));
$stmt = $db->prepare("SELECT name FROM products WHERE id IN ($marks) ORDER BY id");
$stmt->execute($ids);
echo implode(", ", array_column($stmt->fetchAll(), "name")), "\n";
```

```text
Café mug, Notebook
```

Only the `?` markers are placed into the SQL text. The visitor's values still travel separately, so it stays safe from SQL injection, as in [Security Essentials](/lessons/php/security-essentials).

## Changing data, and counting the changes

`rowCount()` tells you how many rows an `UPDATE` or `DELETE` **changed**. In MySQL, an `UPDATE` that sets a value to what it already was counts as **0**:

```php
$up = $db->prepare("UPDATE products SET stock = :stock WHERE sku = :sku");

$up->execute(["stock" => 30, "sku" => "NB-02"]);
echo "Changed: " . $up->rowCount() . "\n";

$up->execute(["stock" => 30, "sku" => "NB-02"]);
echo "Changed the second time: " . $up->rowCount() . "\n";

$up->execute(["stock" => 5, "sku" => "NOPE"]);
echo "Changed for a missing product: " . $up->rowCount() . "\n";
```

```text
Changed: 1
Changed the second time: 0
Changed for a missing product: 0
```

So `0` can mean "no such row" **or** "nothing needed to change." If you need to tell them apart, first `SELECT` the row.

## Handling errors: friendly messages for known problems

A visitor signs up with a product code that already exists. The database's `UNIQUE` key rejects it, and PDO throws an exception. The exception's `errorInfo[1]` is **MySQL's own error number**, so you can recognize the problems you expect (1062 is "duplicate entry"), and give a friendly message, as in [Errors and Exceptions](/lessons/php/exceptions):

```php
function addProduct(PDO $db, string $name, string $sku, string $price): string
{
    try {
        $stmt = $db->prepare("INSERT INTO products (name, sku, price) VALUES (?, ?, ?)");
        $stmt->execute([$name, $sku, $price]);
        return "Added $name.";
    } catch (PDOException $e) {
        if ($e->errorInfo[1] === 1062) {
            return "The code $sku is already in use.";
        }
        throw $e;
    }
}

echo addProduct($db, "Pen", "PEN-03", "12.00"), "\n";
echo addProduct($db, "Another pen", "PEN-03", "13.00"), "\n";
```

```text
Added Pen.
The code PEN-03 is already in use.
```

Any **other** error is re-thrown with `throw $e`, since you didn't plan for it, and hiding it would leave a bug you'd never find. And on a live site, never show a visitor the raw exception message: it can contain table names and other details. Log it, and show something friendly.

## Transactions and locking from PHP

Use PDO's transaction methods, together with `SELECT ... FOR UPDATE` from [InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions), for jobs like selling the last item in stock:

```php
function buy(PDO $db, string $sku, int $quantity): string
{
    $db->beginTransaction();
    try {
        $stmt = $db->prepare("SELECT stock FROM products WHERE sku = ? FOR UPDATE");
        $stmt->execute([$sku]);
        $stock = $stmt->fetchColumn();

        if ($stock === false || $stock < $quantity) {
            $db->rollBack();
            return "Not enough stock for $sku.";
        }

        $db->prepare("UPDATE products SET stock = stock - ? WHERE sku = ?")->execute([$quantity, $sku]);
        $db->commit();
        return "Sold $quantity of $sku.";
    } catch (Throwable $e) {
        $db->rollBack();
        throw $e;
    }
}

echo buy($db, "MUG-01", 5), "\n";
echo buy($db, "MUG-01", 10), "\n";
echo buy($db, "GHOST", 1), "\n";
```

```text
Sold 5 of MUG-01.
Not enough stock for MUG-01.
Not enough stock for GHOST.
```

The row is locked from the moment it's read until the commit, so two customers can't both buy the last mug. If MySQL reports a deadlock (error 1213), the right response is to **retry** the whole function.

## Persistent connections and pooling

A new connection costs a little time on every page load. PHP can keep connections open between requests with `PDO::ATTR_PERSISTENT => true`, but it has some pitfalls (leftover transactions, settings that stick), and most beginners are better off without it. Real busy sites use a **connection pool** outside PHP. It's good to know they exist, and not a thing to worry about yet.

## Try it

A small stock system uses everything in this lesson. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="520px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\n$db = new PDO(&quot;mysql:host=localhost;dbname=shop;charset=utf8mb4&quot;, &quot;shop_app&quot;, &quot;S3cure-pass!&quot;, [\n    PDO::ATTR_ERRMODE =&gt; PDO::ERRMODE_EXCEPTION,\n    PDO::ATTR_DEFAULT_FETCH_MODE =&gt; PDO::FETCH_ASSOC,\n    PDO::ATTR_EMULATE_PREPARES =&gt; false,\n]);\n\n$add = $db-&gt;prepare(&quot;INSERT INTO products (name, sku, price, stock) VALUES (?, ?, ?, ?)&quot;);\nforeach ([[&quot;Ballpen&quot;, &quot;PEN-01&quot;, &quot;12.50&quot;, 100], [&quot;Stapler&quot;, &quot;STP-01&quot;, &quot;89.00&quot;, 6], [&quot;Ballpen (blue)&quot;, &quot;PEN-01&quot;, &quot;12.50&quot;, 10]] as $row) {\n    try {\n        $add-&gt;execute($row);\n        echo &quot;Added {$row[0]}\\n&quot;;\n    } catch (PDOException $e) {\n        echo &quot;Skipped {$row[0]}: error {$e-&gt;errorInfo[1]}\\n&quot;;\n    }\n}\n\n$stmt = $db-&gt;prepare(&quot;UPDATE products SET stock = stock - ? WHERE sku = ? AND stock &gt;= ?&quot;);\nforeach ([[&quot;STP-01&quot;, 4], [&quot;STP-01&quot;, 4], [&quot;PEN-01&quot;, 25]] as [$sku, $qty]) {\n    $stmt-&gt;execute([$qty, $sku, $qty]);\n    echo &quot;$sku x$qty: &quot; . ($stmt-&gt;rowCount() === 1 ? &quot;sold&quot; : &quot;refused&quot;) . &quot;\\n&quot;;\n}\n\nforeach ($db-&gt;query(&quot;SELECT name, price, stock FROM products ORDER BY id&quot;) as $p) {\n    echo str_pad($p[&quot;name&quot;], 10) . &quot; &quot; . str_pad($p[&quot;price&quot;], 6, &quot; &quot;, STR_PAD_LEFT) . &quot; &quot; . $p[&quot;stock&quot;] . &quot; left\\n&quot;;\n}\n\ntry {\n    $db-&gt;exec(&quot;DROP TABLE products&quot;);\n} catch (PDOException $e) {\n    echo &quot;Blocked: error {$e-&gt;errorInfo[1]}\\n&quot;;\n}\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon, and this example also needs a MySQL server. If you have both (see [Installing MySQL Server](/lessons/mysql/setting-up) and [Setting Up PHP](/lessons/php/setting-up)), create the `shop` database, the `shop_app` account, and the `products` table from the top of this lesson, save this as `index.php`, and run it with `php index.php`.
:::

::: details Check your prediction
```text
Added Ballpen
Added Stapler
Skipped Ballpen (blue): error 1062
STP-01 x4: sold
STP-01 x4: refused
PEN-01 x25: sold
Ballpen     12.50 75 left
Stapler     89.00 2 left
Blocked: error 1142
```

The third row has the same `PEN-01` code as the first, so the `UNIQUE` key refuses it: error 1062. In the update, the condition `stock >= ?` inside the `WHERE` makes the database itself refuse to go below zero: the stapler has 6, so the first sale of 4 works, and the second, needing 4 of the remaining 2, matches no row (`rowCount()` is 0). The pens sell fine. `shop_app` can't drop tables, since it was never granted that, so `DROP TABLE` is denied with error 1142.
:::

## Try it yourself

1. Add a second `execute` for `PEN-01` that raises the stock by 10, using `INSERT ... ON DUPLICATE KEY UPDATE` from [Upserts](/lessons/mysql/upserts) instead of separate statements.
2. Change the DSN to leave out `charset=utf8mb4`, add a product called `Café mug`, and read it back. Does it look right?
3. Put the connection settings in a `config.php` file outside your project's public folder, and load them with `require`.

## Check your understanding

<Quiz
	question="Why does a DECIMAL price come back from PDO as a string like &quot;150.00&quot;?"
	:options="['PDO cannot read numbers', 'The column type was wrong', 'It keeps the exact value, since a PHP float could introduce tiny errors', 'It is a bug']"
	:answer-index="2"
	explanation="DECIMAL is exact, and PHP floats are not, so PDO returns the text to avoid any rounding."
/>

<Quiz
	question="A PDOException is caught. Which value tells you MySQL's own error number?"
	:options="['$e->getMessage()', '$e->errorInfo[1]', '$e->getLine()', '$e->getFile()']"
	:answer-index="1"
	explanation="errorInfo[1] holds MySQL's error number, such as 1062 for a duplicate key, so you can react to the errors you expect."
/>

<Quiz
	question="Why should the PHP app connect with a dedicated account instead of root?"
	:options="['Root cannot use prepared statements', 'A dedicated account is faster', 'PDO refuses to connect as root', 'If the site is ever attacked, the damage is limited to what that account may do']"
	:answer-index="3"
	explanation="Least privilege: the app gets only the permissions it needs, so a break-in can't drop tables or read other databases."
/>

## Up next

You now have all the pieces. One lesson of habits to keep them working well, and then a big project to prove it: [Best Practices and Common Mistakes](/lessons/mysql/best-practices).
