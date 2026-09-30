---
title: "MySQL Upserts: INSERT IGNORE, ON DUPLICATE KEY UPDATE, and REPLACE"
description: "Insert a row or update it if it already exists: learn INSERT IGNORE, ON DUPLICATE KEY UPDATE with a row alias, why REPLACE is risky, and how to read ROW_COUNT()."
---

# Upserts with ON DUPLICATE KEY UPDATE

*A guest sign-in sheet has a line for each visitor. If a name is already there, you don't add a second line. You update the time. MySQL can do that in one statement.*

A very common job in real applications is "save this row: add it if it's new, or update it if it's already there." Think of a shopping cart where adding a product twice should raise the quantity, or a page-view counter, or a settings table. Doing it in two steps ("check, then insert or update") is slow, and unsafe when two visitors do it at the same moment. This kind of combined insert-or-update is called an **upsert**, and MySQL has a neat way to do it.

This lesson uses a small `stock` table, with a `UNIQUE` key on `sku` (the product code), so the same product can't appear twice. Unique keys were covered in [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment).

```sql
SELECT * FROM stock;
```

```text
+----+--------+----------+----------+
| id | sku    | name     | quantity |
+----+--------+----------+----------+
|  1 | PEN-01 | Blue pen |       40 |
|  2 | NB-02  | Notebook |       15 |
+----+--------+----------+----------+
```

## The problem

A shipment of 20 blue pens arrives. If `PEN-01` is already in the table, a plain `INSERT` fails:

```sql
INSERT INTO stock (sku, name, quantity) VALUES ('PEN-01', 'Blue pen', 20);
```

```text
ERROR 1062 (23000) at line 1: Duplicate entry 'PEN-01' for key 'stock.sku'
```

## Option 1: INSERT IGNORE

`INSERT IGNORE` skips any row that would break a unique key, and carries on quietly:

```sql
INSERT IGNORE INTO stock (sku, name, quantity)
VALUES ('PEN-01', 'Blue pen', 20), ('RUL-03', 'Ruler', 30);
SELECT sku, quantity FROM stock ORDER BY sku;
```

```text
+--------+----------+
| sku    | quantity |
+--------+----------+
| NB-02  |       15 |
| PEN-01 |       40 |
| RUL-03 |       30 |
+--------+----------+
```

The pens weren't changed, and the new ruler was added. That's useful for "add it if it's missing," but be careful: `IGNORE` turns **other** errors into warnings, too, such as data that's too long. It can hide real mistakes, so use it only when skipping duplicates is exactly what you want.

## Option 2: ON DUPLICATE KEY UPDATE

This is the real upsert. Add `ON DUPLICATE KEY UPDATE` to an `INSERT`. If the new row would break a unique or primary key, MySQL **updates** the existing row instead:

```sql
INSERT INTO stock (sku, name, quantity)
VALUES ('PEN-01', 'Blue pen', 20)
ON DUPLICATE KEY UPDATE quantity = quantity + 20;
SELECT sku, quantity FROM stock ORDER BY sku;
```

```text
+--------+----------+
| sku    | quantity |
+--------+----------+
| NB-02  |       15 |
| PEN-01 |       60 |
+--------+----------+
```

The blue pens went from 40 to 60. If `PEN-01` hadn't existed, the same statement would have added it with quantity 20, so **one** statement handles both cases.

## Using the new values: the row alias

Repeating `20` twice is awkward, and would be a mistake waiting to happen. Give the incoming row a **name** with `AS`, and refer to its values as `alias.column`:

```sql
INSERT INTO stock (sku, name, quantity)
VALUES ('PEN-01', 'Blue pen', 20), ('NB-02', 'Notebook', 5), ('STP-04', 'Stapler', 8)
AS incoming
ON DUPLICATE KEY UPDATE quantity = stock.quantity + incoming.quantity;
SELECT sku, name, quantity FROM stock ORDER BY sku;
```

```text
+--------+----------+----------+
| sku    | name     | quantity |
+--------+----------+----------+
| NB-02  | Notebook |       20 |
| PEN-01 | Blue pen |       60 |
| STP-04 | Stapler  |        8 |
+--------+----------+----------+
```

- `AS incoming` names the row of new values (you can use any name).
- `stock.quantity` is the value already in the table, and `incoming.quantity` is the new one.
- The two existing products got their quantities raised, and the new stapler was inserted.

You'll also find older code that writes `VALUES(quantity)` instead of `incoming.quantity`. That form still works, but MySQL has deprecated it, and prints a warning, so use the alias in new code.

You can update several columns at once, separating them with commas. And the update only runs on a duplicate, so it never touches your other columns unless you list them.

## How many rows were affected?

After an upsert, `ROW_COUNT()` tells you what happened, and it follows a rule you might not expect:

- `1`: a new row was **inserted**.
- `2`: an existing row was **updated**.
- `0`: an existing row was found, but **nothing needed to change**.

```sql
INSERT INTO stock (sku, name, quantity) VALUES ('NB-02', 'Notebook', 0)
ON DUPLICATE KEY UPDATE quantity = quantity + 0;
SELECT ROW_COUNT() AS same_value;

INSERT INTO stock (sku, name, quantity) VALUES ('NB-02', 'Notebook', 0)
ON DUPLICATE KEY UPDATE quantity = quantity + 5;
SELECT ROW_COUNT() AS updated;

INSERT INTO stock (sku, name, quantity) VALUES ('NEW-99', 'Marker', 3)
ON DUPLICATE KEY UPDATE quantity = quantity + 3;
SELECT ROW_COUNT() AS inserted;
```

```text
+------------+
| same_value |
+------------+
|          0 |
+------------+
+---------+
| updated |
+---------+
|       2 |
+---------+
+----------+
| inserted |
+----------+
|        1 |
+----------+
```

With several rows in one statement, the counts add up: an insert counts 1 and an update counts 2.

## Which key is a duplicate?

`ON DUPLICATE KEY` reacts to **any** unique key, and if a row matches on more than one, only one row is updated. Keep it simple: give tables one obvious unique key, like `sku`, for the upsert to work on. And in PHP, use it with prepared statements, exactly as in [Databases with PDO](/lessons/php/databases-with-pdo).

One more trap: an `AUTO_INCREMENT` column gets used up even when the upsert ends up updating. A busy table that upserts a lot will show gaps in its IDs, which is normal.

## REPLACE: the risky cousin

`REPLACE INTO` looks like an upsert, and is easy to confuse with one, but it works very differently. When a row already exists, `REPLACE` **deletes** it and inserts a brand-new one:

```sql
REPLACE INTO stock (sku, name, quantity) VALUES ('PEN-01', 'Blue ballpen', 25);
SELECT id, sku, name, quantity FROM stock ORDER BY sku;
```

```text
+----+--------+--------------+----------+
| id | sku    | name         | quantity |
+----+--------+--------------+----------+
|  2 | NB-02  | Notebook     |       15 |
|  3 | PEN-01 | Blue ballpen |       25 |
+----+--------+--------------+----------+
```

Compare the `id` of `PEN-01` with what it was before (it was 1). It's a **new row** with a new ID. Anything that pointed at the old row through a foreign key is now broken, or deleted, and any columns you didn't list go back to their defaults. Prefer `ON DUPLICATE KEY UPDATE`, which changes only what you say, and keeps the row's identity.

## Try it

A page-view counter keeps one row per page. Every visit runs the same statement. Predict the counts, and what `ROW_COUNT()` says each time.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, page_views.sql"
	min-height="380px"
	:model-value="'CREATE TABLE page_views (\n    page VARCHAR(40) PRIMARY KEY,\n    views INT NOT NULL,\n    last_visit DATE NOT NULL\n);\n\nINSERT INTO page_views (page, views, last_visit)\nVALUES (\'/home\', 1, \'2026-10-01\')\nON DUPLICATE KEY UPDATE views = views + 1, last_visit = \'2026-10-01\';\nSELECT ROW_COUNT() AS after_first;\n\nINSERT INTO page_views (page, views, last_visit)\nVALUES (\'/home\', 1, \'2026-10-02\')\nON DUPLICATE KEY UPDATE views = views + 1, last_visit = \'2026-10-02\';\nSELECT ROW_COUNT() AS after_second;\n\nINSERT INTO page_views (page, views, last_visit)\nVALUES (\'/about\', 1, \'2026-10-02\'), (\'/home\', 1, \'2026-10-02\')\nAS visit\nON DUPLICATE KEY UPDATE views = page_views.views + visit.views, last_visit = visit.last_visit;\nSELECT ROW_COUNT() AS after_third;\n\nSELECT * FROM page_views ORDER BY page;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
+-------------+
| after_first |
+-------------+
|           1 |
+-------------+
+--------------+
| after_second |
+--------------+
|            2 |
+--------------+
+-------------+
| after_third |
+-------------+
|           3 |
+-------------+
+--------+-------+------------+
| page   | views | last_visit |
+--------+-------+------------+
| /about |     1 | 2026-10-02 |
| /home  |     3 | 2026-10-02 |
+--------+-------+------------+
```

The first statement inserts `/home` (count 1). The second finds it, and updates it (count 2, views 2). The third statement inserts `/about`, which counts 1, and updates `/home` again, which counts 2, so the total is 3. `/home` ends with 3 views, since each visit added 1, and `/about` has 1.
:::

## Try it yourself

1. Change the third statement to use `visit.views * 10`. What do the two views become?
2. Change the update part of the first statement to set only `last_visit = '2026-10-01'` (leave `views` alone), and run it twice in a row. What does `ROW_COUNT()` say the second time, and why?
3. Change the script to use `REPLACE INTO` for `/home`. What happens to its view count?

## Check your understanding

<Quiz
	question="What does ON DUPLICATE KEY UPDATE do when the new row would break a unique key?"
	:options="['It deletes the existing row and inserts a new one', 'It always stops with an error', 'It silently skips the row', 'It updates the existing row instead of failing']"
	:answer-index="3"
	explanation="The statement inserts the row if it is new, and updates the existing one if it is a duplicate, in a single step."
/>

<Quiz
	question="After an upsert, ROW_COUNT() returns 2. What happened?"
	:options="['One existing row was updated', 'One row was inserted', 'Two rows were inserted', 'Nothing changed']"
	:answer-index="0"
	explanation="For ON DUPLICATE KEY UPDATE, 1 means inserted, 2 means an existing row was updated, and 0 means it was found but not changed."
/>

<Quiz
	question="Why is REPLACE INTO riskier than ON DUPLICATE KEY UPDATE?"
	:options="['It is slower to type', 'It only works with numbers', 'It deletes the old row and inserts a new one, so IDs change, defaults come back, and foreign keys may break', 'It cannot be used with UNIQUE keys']"
	:answer-index="2"
	explanation="REPLACE is a delete followed by an insert. The old row's identity, and anything not listed in the statement, is lost."
/>

## Up next

Some columns only ever hold one of a few values, or a whole document of data. MySQL has special column types for those, in [ENUM, SET, and JSON Columns](/lessons/mysql/enum-set-and-json).
