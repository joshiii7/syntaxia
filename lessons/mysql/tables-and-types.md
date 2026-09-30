---
title: "MySQL Data Types: INT, DECIMAL, VARCHAR, DATE, and More"
description: "Create MySQL databases and tables, choose the right data type for each column (integers, DECIMAL, VARCHAR, dates), see how strict mode rejects bad data, and avoid reserved-word traps."
---

# Databases, Tables, and MySQL Data Types

*Moving boxes come in sizes: a small one for books, a big one for pillows. Pick a box that's too small, and things get crushed. In MySQL, every column is a box with a size and a shape.*

In SQLite, you could declare a column as almost anything, and it would quietly accept whatever you gave it. MySQL is much stricter. Each column has an exact **data type**, and MySQL refuses values that don't fit. This lesson shows you the types you'll use most, and what happens when data doesn't fit.

## Creating and dropping databases

As you saw in [Coming from SQLite](/lessons/mysql/coming-from-sqlite), one MySQL server holds many databases:

```sql
CREATE DATABASE school_shop;
SHOW DATABASES LIKE 'school%';
DROP DATABASE school_shop;
```

```text
+--------------------+
| Database (school%) |
+--------------------+
| school_shop        |
+--------------------+
```

- `CREATE DATABASE` makes a new, empty database. Use `IF NOT EXISTS` after `DATABASE` if you want to avoid an error when it's already there.
- `DROP DATABASE` deletes a database and everything in it, with **no undo**. Be careful, especially on a real server.
- Use `USE name;` to choose the database you're working in.

All the examples in this track run inside a database called `lesson`, which is already selected, so you'll see tables created without a `USE`.

## Whole numbers

MySQL has five sizes of integer. Pick the smallest that safely holds your data:

| Type | Bytes | Range (signed) |
|---|---|---|
| `TINYINT` | 1 | -128 to 127 |
| `SMALLINT` | 2 | -32,768 to 32,767 |
| `MEDIUMINT` | 3 | about ±8.4 million |
| `INT` | 4 | about ±2.1 billion |
| `BIGINT` | 8 | about ±9.2 quintillion |

Add `UNSIGNED` to give up negative numbers and double the top end: a `TINYINT UNSIGNED` holds 0 to 255, which is perfect for an age or a small count. Use `INT` for ordinary IDs and counts, and `BIGINT` when a number could go past two billion.

## Decimals and money

For fractions, MySQL has two very different families:

- `FLOAT` and `DOUBLE` store **approximate** numbers, fast and compact. Fine for measurements like a temperature or a distance.
- `DECIMAL(total_digits, digits_after_point)` stores **exact** numbers. `DECIMAL(8, 2)` holds up to 6 digits before the point and 2 after: up to 999999.99.

For money, always use `DECIMAL`. Here's why:

```sql
CREATE TABLE totals (x FLOAT, y DECIMAL(10, 2));
INSERT INTO totals VALUES (0.1, 0.1), (0.2, 0.2);
SELECT SUM(x) AS float_total, SUM(y) AS decimal_total FROM totals;
```

```text
+---------------------+---------------+
| float_total         | decimal_total |
+---------------------+---------------+
| 0.30000000447034836 |          0.30 |
+---------------------+---------------+
```

The float total has a tiny error, since binary can't store 0.1 exactly. (You saw the same thing in PHP and Python.) A shop that adds up thousands of prices would slowly drift off. `DECIMAL` gives exactly `0.30`.

## Text

| Type | Holds | Notes |
|---|---|---|
| `CHAR(n)` | exactly `n` characters | Padded with spaces. Good for fixed codes, like a 2-letter country code. |
| `VARCHAR(n)` | up to `n` characters | The everyday choice for names, emails, and titles. |
| `TEXT` | up to 64 KB | For longer text, like a description or a comment. Also `MEDIUMTEXT` and `LONGTEXT`. |

A `VARCHAR` limit counts **characters**, not bytes, so `VARCHAR(50)` can hold 50 characters of any language. Choose a limit that's generous but sensible: `VARCHAR(100)` for a name is fine, and there's little benefit to `VARCHAR(255)` for everything.

## Dates and times

| Type | Holds | Example |
|---|---|---|
| `DATE` | a date | `2026-10-15` |
| `TIME` | a time of day, or a duration | `14:30:00` |
| `DATETIME` | a date and time | `2026-10-15 14:30:00` |
| `TIMESTAMP` | a date and time, stored as seconds since 1970 | `2026-10-15 14:30:00` |
| `YEAR` | a year | `2026` |

`DATETIME` and `TIMESTAMP` look alike, but differ in two ways. A `TIMESTAMP` converts to and from the server's time zone, and it only works up to **January 19, 2038**. A `DATETIME` doesn't convert anything, and goes all the way to the year 9999. Use `DATETIME` for a date you're storing on purpose, such as a birthday or a due date. `TIMESTAMP` suits automatic records of when something changed. You'll see both again in [MySQL Functions](/lessons/mysql/mysql-functions).

MySQL always writes dates as **year-month-day**, like `2026-10-15`, in quotes.

## Booleans

MySQL has `BOOLEAN`, but it's only a nickname for `TINYINT(1)`. `TRUE` is stored as `1` and `FALSE` as `0`, and any other number is accepted, too. The `DESCRIBE` command shows it as `tinyint(1)`.

## Putting it together

Here's a `products` table for a small store that uses a type on purpose for each column:

```sql
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category CHAR(3) NOT NULL,
    price DECIMAL(8, 2) NOT NULL,
    stock SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    added_on DATE NOT NULL
);
DESCRIBE products;
```

```text
+-----------+-------------------+------+-----+---------+-------+
| Field     | Type              | Null | Key | Default | Extra |
+-----------+-------------------+------+-----+---------+-------+
| id        | int               | NO   | PRI | NULL    |       |
| name      | varchar(100)      | NO   |     | NULL    |       |
| category  | char(3)           | NO   |     | NULL    |       |
| price     | decimal(8,2)      | NO   |     | NULL    |       |
| stock     | smallint unsigned | NO   |     | 0       |       |
| is_active | tinyint(1)        | NO   |     | 1       |       |
| added_on  | date              | NO   |     | NULL    |       |
+-----------+-------------------+------+-----+---------+-------+
```

## Strict mode: MySQL says no

By default, MySQL runs in **strict mode**. When you try to store a value that doesn't fit its column, it refuses with an error, instead of quietly changing your data. Each example below runs against the `products` table above.

A negative number in an `UNSIGNED` column:

```sql
INSERT INTO products (id, name, category, price, stock, added_on)
VALUES (1, 'Notebook', 'STA', 45.00, -5, '2026-09-01');
```

```text
ERROR 1264 (22003) at line 1: Out of range value for column 'stock' at row 1
```

A price too big for `DECIMAL(8, 2)`:

```sql
INSERT INTO products (id, name, category, price, added_on)
VALUES (2, 'Gold pen', 'STA', 9999999.99, '2026-09-01');
```

```text
ERROR 1264 (22003) at line 1: Out of range value for column 'price' at row 1
```

A category longer than 3 characters:

```sql
INSERT INTO products (id, name, category, price, added_on)
VALUES (3, 'Eraser', 'STATIONERY', 8.00, '2026-09-01');
```

```text
ERROR 1406 (22001) at line 1: Data too long for column 'category' at row 1
```

A date that doesn't exist:

```sql
INSERT INTO products (id, name, category, price, added_on)
VALUES (4, 'Ruler', 'STA', 15.00, '2026-02-30');
```

```text
ERROR 1292 (22007) at line 1: Incorrect date value: '2026-02-30' for column 'added_on' at row 1
```

A missing value for a `NOT NULL` column that has no default:

```sql
INSERT INTO products (id, name, category, added_on)
VALUES (5, 'Stapler', 'STA', '2026-09-01');
```

```text
ERROR 1364 (HY000) at line 1: Field 'price' doesn't have a default value
```

Each error names the problem, the column, and the row. That's exactly what you want: the bad data never gets in, so you never have to track down where it came from. And notice `TIMESTAMP` is picky, too:

```sql
CREATE TABLE audit (happened_at TIMESTAMP NULL);
INSERT INTO audit VALUES ('2040-01-01 00:00:00');
```

```text
ERROR 1292 (22007) at line 2: Incorrect datetime value: '2040-01-01 00:00:00' for column 'happened_at' at row 1
```

That's the year-2038 limit at work.

One more thing: a value with too many decimals isn't refused. It's **rounded**:

```sql
INSERT INTO products (id, name, category, price, added_on)
VALUES (6, 'Pencil', 'STA', 12.345, '2026-09-01');
SELECT name, price FROM products;
```

```text
+--------+-------+
| name   | price |
+--------+-------+
| Pencil | 12.35 |
+--------+-------+
```

## Names and reserved words

MySQL has a list of **reserved words** that have a special meaning in SQL, and can't be used as names for tables or columns without special care. `SELECT`, `ORDER`, `KEY`, and `INDEX` are obvious ones. Here's a surprise. In MySQL 9, **`LIBRARY` is reserved** too:

```sql
CREATE DATABASE library;
```

```text
ERROR 1064 (42000) at line 1: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'library' at line 1
```

The error message isn't very helpful: it just points at the spot where MySQL got confused. There are two ways out. Choose a different name, like `school_library`, which is usually best, or wrap the name in **backticks**, the `` ` `` character, usually found above the Tab key:

```sql
CREATE DATABASE `library`;
SHOW DATABASES LIKE 'library';
```

```text
+--------------------+
| Database (library) |
+--------------------+
| library            |
+--------------------+
```

Backticks work for any name, including ones with spaces, but you'd have to type them every time. The list of reserved words changes between versions, so a name that works today can break after an upgrade. You can look up the current list in the `INFORMATION_SCHEMA.KEYWORDS` table:

```sql
SELECT WORD, RESERVED FROM INFORMATION_SCHEMA.KEYWORDS
WHERE WORD IN ('LIBRARY', 'ORDER', 'RANK', 'STATUS', 'NAME')
ORDER BY WORD;
```

```text
+---------+----------+
| WORD    | RESERVED |
+---------+----------+
| LIBRARY |        1 |
| NAME    |        0 |
| ORDER   |        1 |
| RANK    |        1 |
| STATUS  |        0 |
+---------+----------+
```

`RESERVED` is `1` for the words you must avoid or quote. (`RANK` became reserved in MySQL 8.0, when window functions arrived.) Good habits: use `snake_case` names with more than one word when in doubt, like `loan_status` instead of `status`, and never name anything after an SQL keyword.

## Try it

This table records books borrowed from a school library. Some of these rows are fine, and some MySQL will refuse. For each `INSERT`, predict whether it works, and if not, what MySQL complains about.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, loans.sql"
	min-height="420px"
	:model-value="'CREATE TABLE loans (\n    id INT PRIMARY KEY,\n    student VARCHAR(20) NOT NULL,\n    copies TINYINT UNSIGNED NOT NULL,\n    fine DECIMAL(5, 2) NOT NULL DEFAULT 0,\n    due_date DATE NOT NULL\n);\n\nINSERT INTO loans (id, student, copies, due_date)\nVALUES (1, \'Maria Santos\', 2, \'2026-10-01\');\n\nINSERT INTO loans (id, student, copies, fine, due_date)\nVALUES (2, \'Ben Cruz\', 300, 0, \'2026-10-01\');\n\nINSERT INTO loans (id, student, copies, due_date)\nVALUES (3, \'Carlo Emmanuel Reyes Villanueva\', 1, \'2026-10-01\');\n\nINSERT INTO loans (id, student, copies, fine, due_date)\nVALUES (4, \'Dina Lim\', 1, 1234.50, \'2026-10-01\');\n\nINSERT INTO loans (id, student, copies, fine, due_date)\nVALUES (5, \'Eli Tan\', 1, 12.999, \'2026-10-01\');\n\nSELECT id, student, fine FROM loans;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
ERROR 1264 (22003) at line 12: Out of range value for column 'copies' at row 1
ERROR 1406 (22001) at line 15: Data too long for column 'student' at row 1
ERROR 1264 (22003) at line 18: Out of range value for column 'fine' at row 1
+----+--------------+-------+
| id | student      | fine  |
+----+--------------+-------+
|  1 | Maria Santos |  0.00 |
|  5 | Eli Tan      | 13.00 |
+----+--------------+-------+
```

Row 1 works, and `fine` uses its default of 0. Row 2 fails because 300 doesn't fit in a `TINYINT UNSIGNED` (the maximum is 255). Row 3 fails because the name is longer than 20 characters. Row 4 fails because 1234.50 needs 4 digits before the point, and `DECIMAL(5, 2)` allows only 3. Row 5 is accepted, but the fine is rounded to 13.00. Since the client keeps going after an error, the rows that worked are in the table.
:::

## Try it yourself

1. Change the `copies` column to `SMALLINT UNSIGNED`. Does row 2 work now?
2. Add a `returned_on DATE` column that allows `NULL`, and insert a loan with no return date. What does `SELECT` show for it?
3. Try to create a table with a column called `order`, then again with the name in backticks. Which works, and why?

## Check your understanding

<Quiz
	question="Which type should you use to store prices in a shop's database?"
	:options="['DECIMAL(8, 2)', 'FLOAT', 'TEXT', 'TIMESTAMP']"
	:answer-index="0"
	explanation="DECIMAL stores exact numbers, so totals never drift by fractions of a cent. FLOAT is approximate."
/>

<Quiz
	question="A TINYINT UNSIGNED column gets the value 300. In strict mode, what happens?"
	:options="['It is stored as 255', 'It is stored as 300', 'MySQL refuses with an out-of-range error', 'It is stored as NULL']"
	:answer-index="2"
	explanation="Strict mode rejects values that don't fit, instead of changing them. TINYINT UNSIGNED holds 0 to 255."
/>

<Quiz
	question="Why does CREATE DATABASE library fail in MySQL 9?"
	:options="['Database names must be uppercase', 'library is a reserved word, so it needs backticks or a different name', 'Names cannot be longer than 5 letters', 'A database called library already exists']"
	:answer-index="1"
	explanation="MySQL 9 reserved the word LIBRARY. Pick another name, like school_library, or quote it with backticks."
/>

## Up next

Your tables have IDs, but who chooses them? You've been typing them by hand. Let MySQL number the rows for you, in [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment).
