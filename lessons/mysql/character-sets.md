---
title: "MySQL Character Sets and Collations: utf8mb4 Explained"
description: "Store any text safely in MySQL: what character sets and collations are, why utf8mb4 is the right choice, how collations decide sorting and case sensitivity, and how to fix garbled text."
---

# Character Sets and utf8mb4

*A phrasebook only works if both people use the same one. If you write in one alphabet and someone reads in another, you get nonsense. A character set is the agreed alphabet between you and the database.*

Computers store text as numbers, and a **character set** is the table that says which number means which character. If the database, your program, and your connection don't all agree on it, `José` turns into `JosÃ©`, and a smiley turns into `????`. This lesson makes sure that never happens to you.

## Character sets and collations

MySQL has two related settings for text:

- A **character set** decides which characters can be stored, and how many bytes each one takes. `utf8mb4` can store **every** character in Unicode: every alphabet, accents, symbols, and emoji.
- A **collation** decides how text is **compared and sorted**: whether `a` equals `A`, whether `e` equals `é`, and where each letter goes in order.

Every collation belongs to one character set, and the collation's name says so: `utf8mb4_0900_ai_ci` is for `utf8mb4`.

You can see what your server uses by default:

```sql
SELECT @@character_set_server AS charset, @@collation_server AS collation;
```

```text
+---------+--------------------+
| charset | collation          |
+---------+--------------------+
| utf8mb4 | utf8mb4_0900_ai_ci |
+---------+--------------------+
```

## Always use utf8mb4

Since MySQL 8, the default is `utf8mb4`, and that's what you should use for everything. There's a trap in the old days. MySQL once had a character set called `utf8`, which was misleadingly named: it stores only characters that fit in **3 bytes**, which leaves out emoji and many other characters. It's now called `utf8mb3` (and `utf8` is just an alias for it, deprecated). The **real** UTF-8 is `utf8mb4`: "mb4" means "up to 4 bytes per character."

You can see the difference directly:

```sql
CREATE TABLE old_style (note VARCHAR(20)) CHARACTER SET utf8mb3;
CREATE TABLE modern (note VARCHAR(20)) CHARACTER SET utf8mb4;

INSERT INTO modern VALUES ('Café 😀');
INSERT INTO old_style VALUES ('Café 😀');
SELECT note FROM modern;
```

```text
ERROR 1366 (HY000) at line 5: Incorrect string value: '\xF0\x9F\x98\x80' for column 'note' at row 1
+------------+
| note       |
+------------+
| Café 😀      |
+------------+
```

The `utf8mb3` table refuses the emoji, while the `utf8mb4` table keeps it. Any old databases you meet may still be `utf8mb3`, which is a good reason to check before adding data.

## Where character sets are set

A character set can be set at four levels, each one inheriting from the level above unless you say otherwise:

1. The **server** default.
2. The **database**: `CREATE DATABASE shop CHARACTER SET utf8mb4;`
3. The **table**: `CREATE TABLE ... CHARACTER SET utf8mb4`.
4. A single **column**: `name VARCHAR(50) CHARACTER SET utf8mb4`.

In practice, set it once when you create the database, and forget about it. Check what a table actually uses with `SHOW CREATE TABLE`:

```sql
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE TABLE shop.products (name VARCHAR(50));
SHOW CREATE TABLE shop.products;
```

```text
+----------+--------------------------------------------------------------------------------------------------------------------------------+
| Table    | Create Table                                                                                                                   |
+----------+--------------------------------------------------------------------------------------------------------------------------------+
| products | CREATE TABLE `products` (
  `name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci |
+----------+--------------------------------------------------------------------------------------------------------------------------------+
```

## Collations: how text compares

The letters at the end of a collation's name tell you how it behaves:

| Part | Meaning |
|---|---|
| `ai` | accent-**in**sensitive: `e` and `é` count as equal |
| `as` | accent-sensitive |
| `ci` | **c**ase-**i**nsensitive: `a` and `A` count as equal |
| `cs` | case-sensitive |
| `bin` | compare the raw bytes: exact, and no equalities at all |

The default, `utf8mb4_0900_ai_ci`, is both accent- and case-insensitive. That's why searches feel friendly, and also why some things surprise people:

```sql
SELECT
    'jose' = 'JOSE' AS same_case,
    'jose' = 'josé' AS same_accent,
    'jose' = 'jose ' AS trailing_space,
    'jose' COLLATE utf8mb4_0900_as_cs = 'JOSE' AS exact_match;
```

```text
+-----------+-------------+----------------+-------------+
| same_case | same_accent | trailing_space | exact_match |
+-----------+-------------+----------------+-------------+
|         1 |           1 |              0 |           0 |
+-----------+-------------+----------------+-------------+
```

The last column asks for a stricter comparison for just that expression, using `COLLATE`. The third column is `0`: in the default collation, a trailing space counts as a real character, so `'jose'` and `'jose '` are different. (Older collations ignored trailing spaces, so this catches people who upgrade.)

Collations also decide the **sort order**, which matters for languages with special letters. Compare the default sort with an exact byte order:

```sql
CREATE TABLE names (name VARCHAR(20));
INSERT INTO names VALUES ('Zoe'), ('álvaro'), ('Ana'), ('beth'), ('Émile');
SELECT name FROM names ORDER BY name;
SELECT name FROM names ORDER BY name COLLATE utf8mb4_bin;
```

```text
+---------+
| name    |
+---------+
| álvaro  |
| Ana     |
| beth    |
| Émile   |
| Zoe     |
+---------+
+---------+
| name    |
+---------+
| Ana     |
| Zoe     |
| beth    |
| Émile   |
| álvaro  |
+---------+
```

The default puts `álvaro` next to `Ana`, where a reader expects it. The `bin` order sorts by code number, so the plain capitals come first, then the plain lowercase letters, and the accented ones come last, even `Émile`.

A **unique** column uses its collation, too: with a case-insensitive collation, `maria@example.com` and `Maria@Example.com` count as duplicates, as you saw in [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment). If you need a column to be case-sensitive, like a token or a code, give **that column** a case-sensitive collation, such as `utf8mb4_0900_as_cs` or `utf8mb4_bin`.

## Character sets, bytes, and length

A `VARCHAR(50)` holds 50 **characters**, but characters take different numbers of bytes in `utf8mb4`: 1 for plain English letters, 2 for many accented ones, 3 for many Asian characters, and 4 for emoji. That's why `CHAR_LENGTH` and `LENGTH` differ:

```sql
SELECT
    CHAR_LENGTH('José') AS characters,
    LENGTH('José') AS bytes,
    CHAR_LENGTH('日本語') AS jp_characters,
    LENGTH('日本語') AS jp_bytes,
    LENGTH('😀') AS emoji_bytes;
```

```text
+------------+-------+---------------+----------+-------------+
| characters | bytes | jp_characters | jp_bytes | emoji_bytes |
+------------+-------+---------------+----------+-------------+
|          4 |     5 |             3 |        9 |           4 |
+------------+-------+---------------+----------+-------------+
```

## The connection has a character set too

There's one more place that matters, and the one that causes most of the "garbled text" problems: the **connection** between your program and the server. The client tells the server what character set it's sending, and asks for results in a character set of its own.

```sql
SHOW VARIABLES WHERE Variable_name IN
    ('character_set_client', 'character_set_connection', 'character_set_results');
```

```text
+--------------------------+---------+
| Variable_name            | Value   |
+--------------------------+---------+
| character_set_client     | utf8mb4 |
| character_set_connection | utf8mb4 |
| character_set_results    | utf8mb4 |
+--------------------------+---------+
```

If your database is `utf8mb4` but the connection is something else, like `latin1`, the text gets converted on the way in and out, and characters can be lost or turned into mojibake (`JosÃ©`). The fixes:

- In the `mysql` client, start it with `mysql --default-character-set=utf8mb4`. (On Windows, the terminal itself may also need to use UTF-8 for accented characters to show up correctly.)
- In PHP's PDO, add `charset=utf8mb4` to the connection string: `mysql:host=localhost;dbname=shop;charset=utf8mb4`, as you saw in [Databases with PDO](/lessons/php/databases-with-pdo).
- In web pages, send UTF-8 too, with `<meta charset="UTF-8">`, so the browser reads it correctly.

A good rule: **UTF-8 everywhere**: the database, the connection, the files you write, and the pages you send.

## Converting an old table

If you inherit a `latin1` or `utf8mb3` table, convert it, ideally after taking a backup (see [Backups with mysqldump](/lessons/mysql/backups)):

```sql
ALTER TABLE notes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

This rewrites every text column, converting the existing data properly. Note that it's **not** the same as `ALTER TABLE ... CHARACTER SET utf8mb4`, which changes only the table's default for new columns, and leaves the existing data as it was.

## Try it

A school stores student names in two tables, one old and one modern. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, names.sql"
	min-height="420px"
	:model-value="'CREATE TABLE students_old (name VARCHAR(30) UNIQUE) CHARACTER SET utf8mb3;\nCREATE TABLE students (name VARCHAR(30) UNIQUE) CHARACTER SET utf8mb4;\n\nINSERT INTO students (name) VALUES (\'Zoë\'), (\'José\'), (\'Ana\');\nINSERT INTO students (name) VALUES (\'jose\');\nINSERT INTO students_old (name) VALUES (\'José\');\nINSERT INTO students_old (name) VALUES (\'Mia 😀\');\n\nSELECT name, CHAR_LENGTH(name) AS chars, LENGTH(name) AS bytes FROM students ORDER BY name;\nSELECT COUNT(*) AS matches FROM students WHERE name = \'JOSÉ\';\nSELECT COUNT(*) AS exact FROM students WHERE name COLLATE utf8mb4_bin = \'José\';\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
ERROR 1062 (23000) at line 5: Duplicate entry 'jose' for key 'students.name'
ERROR 1366 (HY000) at line 7: Incorrect string value: '\xF0\x9F\x98\x80' for column 'name' at row 1
+-------+-------+-------+
| name  | chars | bytes |
+-------+-------+-------+
| Ana   |     3 |     3 |
| José  |     4 |     5 |
| Zoë   |     3 |     4 |
+-------+-------+-------+
+---------+
| matches |
+---------+
|       1 |
+---------+
+-------+
| exact |
+-------+
|     1 |
+-------+
```

`'jose'` is refused as a duplicate of `'José'`: in the default collation, `José` and `jose` are equal, and the column is `UNIQUE`. So only three names are stored. The emoji can't go into the `utf8mb3` table. `LENGTH` shows extra bytes for the accented letters. Searching for `'JOSÉ'` still finds `José`, since capitals don't matter. The `bin` comparison is exact, so it matches only the row that is exactly `José`.
:::

## Try it yourself

1. Add `'Mia 😀'` to the `students` table. Does it work? What does `LENGTH` say for it?
2. Change `students.name` to use the collation `utf8mb4_0900_as_cs`, and insert `'jose'` again. What happens now?
3. Run `SHOW CHARACTER SET LIKE 'utf8%';` and find `utf8mb4`. What is its `Maxlen`?

## Check your understanding

<Quiz
	question="Which character set should you use for new MySQL databases?"
	:options="['latin1', 'utf8mb4', 'utf8, since it is short for UTF-8', 'utf8mb3']"
	:answer-index="1"
	explanation="utf8mb4 is real UTF-8, and stores every Unicode character including emoji. utf8 is an old alias for utf8mb3, which can't."
/>

<Quiz
	question="In the collation utf8mb4_0900_ai_ci, what do ai and ci mean?"
	:options="['Accent-included and case-included', 'Alphabetical index and character index', 'Automatic increment and case index', 'Accent-insensitive and case-insensitive']"
	:answer-index="3"
	explanation="ai means accents are ignored in comparisons, and ci means capitals are ignored, so 'jose', 'José' and 'JOSE' all compare equal."
/>

<Quiz
	question="A database is utf8mb4, but stored text like José comes back as JosÃ©. What is the likely cause?"
	:options="['The connection character set does not match', 'The table has too many rows', 'The column is too short', 'The server is out of memory']"
	:answer-index="0"
	explanation="If the connection uses a different character set than the data, text gets converted wrongly on the way. Set the connection to utf8mb4."
/>

## Up next

Your data is stored safely. Now let's make sure it can be **found** quickly, by looking at how MySQL runs a query, in [Query Performance with EXPLAIN](/lessons/mysql/explain).
