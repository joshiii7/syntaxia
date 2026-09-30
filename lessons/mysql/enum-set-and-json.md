---
title: "MySQL ENUM, SET, and JSON Columns: When and How to Use Them"
description: "Use MySQL's ENUM for one-of-a-few values, SET for several, and JSON for flexible documents: reading with -> and ->>, changing with JSON_SET, and knowing when a normal table is better."
---

# ENUM, SET, and JSON Columns

*A vending machine's buttons offer a fixed list of choices: you can't press "purple." A drawer at home holds whatever you toss in. MySQL has a column type for each idea.*

Most columns hold plain numbers, text, or dates. MySQL also has three special types for data that doesn't fit those neatly: `ENUM` and `SET` for a fixed list of allowed values, and `JSON` for flexible, nested data.

## ENUM: exactly one of a few

An **ENUM** column can hold only one value from a list you choose when creating the table:

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(40) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending'
);
INSERT INTO orders (customer, status) VALUES ('Maria', 'paid'), ('Ben', DEFAULT);
INSERT INTO orders (customer, status) VALUES ('Carlo', 'delivered');
SELECT * FROM orders;
```

```text
ERROR 1265 (01000) at line 7: Data truncated for column 'status' at row 1
+----+----------+---------+
| id | customer | status  |
+----+----------+---------+
|  1 | Maria    | paid    |
|  2 | Ben      | pending |
+----+----------+---------+
```

Anything not on the list is refused in strict mode, which stops typos like `'shiped'` from ever entering the table. Text compared to an enum ignores capitals, like other MySQL text.

Under the hood, MySQL stores an enum as a small **number** for its position in the list (`pending` is 1, `paid` is 2, and so on). That has two consequences:

- It's compact and fast.
- **Sorting** follows the list's order, not the alphabet:

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(40) NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending'
);
INSERT INTO orders (customer, status) VALUES
    ('Maria', 'shipped'), ('Ben', 'pending'), ('Carlo', 'cancelled'), ('Dina', 'paid');
SELECT customer, status, status + 0 AS position FROM orders ORDER BY status;
```

```text
+----------+-----------+----------+
| customer | status    | position |
+----------+-----------+----------+
| Ben      | pending   |        1 |
| Dina     | paid      |        2 |
| Maria    | shipped   |        3 |
| Carlo    | cancelled |        4 |
+----------+-----------+----------+
```

The catch: **changing the list later** means altering the table, and inserting a value in the middle can reshuffle the numbers. If the list of options is likely to change (or people should be able to add options), a small separate table with a foreign key is a better design. Use `ENUM` for lists that are truly fixed, like `'S', 'M', 'L'` sizes or a status with a few stages.

## SET: several of a few

A **SET** column holds **zero or more** values from a list, stored together. It suits things like a person's chosen days or features:

```sql
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    practice_days SET('mon', 'tue', 'wed', 'thu', 'fri') NOT NULL DEFAULT ''
);
INSERT INTO members (name, practice_days) VALUES
    ('Maria', 'mon,wed,fri'), ('Ben', 'tue'), ('Carlo', '');
SELECT name, practice_days, FIND_IN_SET('wed', practice_days) > 0 AS wednesdays
FROM members;
```

```text
+-------+---------------+------------+
| name  | practice_days | wednesdays |
+-------+---------------+------------+
| Maria | mon,wed,fri   |          1 |
| Ben   | tue           |          0 |
| Carlo |               |          0 |
+-------+---------------+------------+
```

You write several values as one comma-separated string, with no spaces. `FIND_IN_SET(value, set)` gives the position of a value in the set, or `0` if it isn't there, so `> 0` means "included."

Be careful: a `SET` breaks the rule that each cell holds one piece of information (see [Database Design](/lessons/sqlite3/database-design)). It's hard to search, count, or join on. When the values matter to your application, a separate table with one row per choice (a "junction" table) is usually the better design. `SET` is fine for simple flags that you'll read back whole.

## JSON: flexible documents

A **JSON** column stores a JSON document, like you saw in [Working with JSON](/lessons/php/json), and MySQL checks that it's valid:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    details JSON
);
INSERT INTO products (name, details) VALUES
    ('Backpack', '{"color": "blue", "weight_g": 650, "tags": ["school", "travel"]}'),
    ('Notebook', '{"color": "red", "pages": 120, "tags": ["school"]}');
INSERT INTO products (name, details) VALUES ('Broken', '{color: blue}');
SELECT id, name, details FROM products;
```

```text
ERROR 3140 (22032) at line 9: Invalid JSON text: "Missing a name for object member." at position 1 in value for column 'products.details'.
+----+----------+------------------------------------------------------------------+
| id | name     | details                                                          |
+----+----------+------------------------------------------------------------------+
|  1 | Backpack | {"tags": ["school", "travel"], "color": "blue", "weight_g": 650} |
|  2 | Notebook | {"tags": ["school"], "color": "red", "pages": 120}               |
+----+----------+------------------------------------------------------------------+
```

The invalid one was refused. This is handy for data whose shape **varies**: a backpack has a weight, a notebook has pages, and you don't want a column for every possible attribute.

## Reading JSON

Use the **`->`** operator to pull a value out by its path, starting with `$` for the whole document. It returns JSON, so text keeps its quotes. **`->>`** does the same, but gives back plain text with the quotes removed:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    details JSON
);
INSERT INTO products (name, details) VALUES
    ('Backpack', '{"color": "blue", "weight_g": 650, "tags": ["school", "travel"]}'),
    ('Notebook', '{"color": "red", "pages": 120, "tags": ["school"]}');

SELECT
    name,
    details -> '$.color' AS color_json,
    details ->> '$.color' AS color_text,
    details ->> '$.tags[0]' AS first_tag,
    details ->> '$.pages' AS pages
FROM products;
```

```text
+----------+------------+------------+-----------+-------+
| name     | color_json | color_text | first_tag | pages |
+----------+------------+------------+-----------+-------+
| Backpack | "blue"     | blue       | school    | NULL  |
| Notebook | "red"      | red        | school    | 120   |
+----------+------------+------------+-----------+-------+
```

- `$.color` means "the `color` key of the document." `$.tags[0]` is the first item of the `tags` list (positions start at 0).
- A path that isn't there gives `NULL`, not an error.

Use it in `WHERE`, too:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    details JSON
);
INSERT INTO products (name, details) VALUES
    ('Backpack', '{"color": "blue", "weight_g": 650, "tags": ["school", "travel"]}'),
    ('Notebook', '{"color": "red", "pages": 120, "tags": ["school"]}'),
    ('Umbrella', '{"color": "blue", "tags": ["travel"]}');

SELECT name FROM products WHERE details ->> '$.color' = 'blue';
SELECT name FROM products WHERE JSON_CONTAINS(details -> '$.tags', '"travel"');
```

```text
+----------+
| name     |
+----------+
| Backpack |
| Umbrella |
+----------+
+----------+
| name     |
+----------+
| Backpack |
| Umbrella |
+----------+
```

`JSON_CONTAINS` checks whether a list holds a value (note the value is itself JSON, so text needs its own quotes inside the single quotes).

## Changing JSON

`JSON_SET` changes or adds a value inside a document, and `JSON_REMOVE` deletes one. Other keys stay as they were:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    details JSON
);
INSERT INTO products (name, details) VALUES
    ('Backpack', '{"color": "blue", "weight_g": 650, "tags": ["school", "travel"]}');

UPDATE products
SET details = JSON_SET(details, '$.color', 'green', '$.waterproof', TRUE)
WHERE name = 'Backpack';
UPDATE products SET details = JSON_REMOVE(details, '$.weight_g') WHERE name = 'Backpack';

SELECT details FROM products;
```

```text
+----------------------------------------------------------------------+
| details                                                              |
+----------------------------------------------------------------------+
| {"tags": ["school", "travel"], "color": "green", "waterproof": true} |
+----------------------------------------------------------------------+
```

MySQL prints and stores JSON in its own tidy form: keys are sorted (by length and then alphabetically), so the order may differ from how you typed it.

`JSON_OBJECT` and `JSON_ARRAYAGG` **build** JSON from ordinary rows, which is a quick way to prepare data for an API:

```sql
CREATE TABLE tags (product VARCHAR(20), tag VARCHAR(20));
INSERT INTO tags VALUES ('Backpack', 'school'), ('Backpack', 'travel'), ('Notebook', 'school');

SELECT product, JSON_ARRAYAGG(tag) AS tags FROM tags GROUP BY product ORDER BY product;
SELECT JSON_OBJECT('name', 'Notebook', 'pages', 120) AS doc;
```

```text
+----------+----------------------+
| product  | tags                 |
+----------+----------------------+
| Backpack | ["school", "travel"] |
| Notebook | ["school"]           |
+----------+----------------------+
+------------------------------------+
| doc                                |
+------------------------------------+
| {"name": "Notebook", "pages": 120} |
+------------------------------------+
```

## JSON: when, and when not

JSON columns are great for **data whose shape varies**, settings stored per user, or a copy of something received from another service. They're a poor choice for data you'll **filter, sort, join, or count** all the time, or that has the same shape in every row. Ordinary columns are faster to search, and get proper types, constraints, and foreign keys. A good habit: model the important, regular facts as real columns, and keep the leftover, irregular bits in one JSON column.

## Try it

A sports club stores each player's details three different ways. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, players.sql"
	min-height="460px"
	:model-value="'CREATE TABLE players (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(30) NOT NULL,\n    level ENUM(\'beginner\', \'intermediate\', \'advanced\') NOT NULL DEFAULT \'beginner\',\n    days SET(\'sat\', \'sun\') NOT NULL DEFAULT \'\',\n    profile JSON\n);\n\nINSERT INTO players (name, level, days, profile) VALUES\n    (\'Ana\', \'advanced\', \'sat,sun\', \'{&quot;position&quot;: &quot;setter&quot;, &quot;jersey&quot;: 7}\'),\n    (\'Ben\', DEFAULT, \'sun\', \'{&quot;position&quot;: &quot;libero&quot;}\'),\n    (\'Carlo\', \'intermediate\', \'\', \'{&quot;position&quot;: &quot;spiker&quot;, &quot;jersey&quot;: 12}\');\nINSERT INTO players (name, level) VALUES (\'Dina\', \'expert\');\n\nSELECT name, level FROM players ORDER BY level DESC, name;\nSELECT name FROM players WHERE FIND_IN_SET(\'sat\', days) &gt; 0;\nSELECT name, COALESCE(profile -&gt;&gt; \'$.jersey\', \'none\') AS jersey FROM players;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
ERROR 1265 (01000) at line 13: Data truncated for column 'level' at row 1
+-------+--------------+
| name  | level        |
+-------+--------------+
| Ana   | advanced     |
| Carlo | intermediate |
| Ben   | beginner     |
+-------+--------------+
+------+
| name |
+------+
| Ana  |
+------+
+-------+--------+
| name  | jersey |
+-------+--------+
| Ana   | 7      |
| Ben   | none   |
| Carlo | 12     |
+-------+--------+
```

`'expert'` isn't on the level list, so Dina isn't added. Sorting by `level DESC` follows the list's order (advanced first), not the alphabet. Only Ana plays on Saturdays. Ben's profile has no `jersey`, so `->>` gives `NULL`, and `COALESCE` turns it into `none`.
:::

## Try it yourself

1. Add `'pro'` to the `level` list by using `ALTER TABLE players MODIFY level ENUM(...)`, keeping the old values, and then insert Dina again.
2. Use `JSON_SET` to give Ben a jersey number of 3, and check the result.
3. Write a query listing every player whose `position` is `setter`. Which operator do you use to read it?

## Check your understanding

<Quiz
	question="How does ORDER BY sort an ENUM column?"
	:options="['Alphabetically', 'Randomly', 'By the length of each value', 'By the position of each value in the list you declared']"
	:answer-index="3"
	explanation="Enums are stored as numbers for their positions in the list, and sorting uses those numbers."
/>

<Quiz
	question="What's the difference between -> and ->> on a JSON column?"
	:options="['They are identical', '->> gives plain text without quotes, while -> gives JSON', '-> only works on numbers', '->> changes the JSON']"
	:answer-index="1"
	explanation="-> returns a JSON value, so text keeps its double quotes. ->> unquotes it to plain text."
/>

<Quiz
	question="When is a separate table a better choice than a SET or JSON column?"
	:options="['When you have fewer than three rows', 'Never, SET and JSON are always better', 'When you often need to search, count, or join on those values', 'Only for numbers']"
	:answer-index="2"
	explanation="Regular columns and tables are faster to search and let the database enforce types and foreign keys."
/>

## Up next

You've been writing the same queries again and again. MySQL lets you save them, and even run code automatically, in [Views, Stored Procedures, and Triggers](/lessons/mysql/views-procedures-and-triggers).
