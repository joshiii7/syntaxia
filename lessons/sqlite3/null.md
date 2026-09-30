---
title: "SQL NULL: Missing Values, IS NULL, and COALESCE"
description: "Understand NULL in SQL: why it isn't zero or empty, why = NULL never matches, how to find it with IS NULL, and how to replace it with COALESCE."
---

# Working with NULL

*A form with a blank box doesn't mean "zero" or "no." It means nobody filled it in.*

Look at the `loans` table in your library database, and you'll notice some rows have nothing in the `returned_date` column. Those books haven't come back yet, so there's no return date to record. That empty spot has a name in SQL: **`NULL`**.

`NULL` seems simple, but it follows rules of its own, and it's behind some of the most common mistakes in SQL. This lesson shows how it works, and how to handle it.

## A blank box on a form

Imagine a school form asking for a student's middle name, their phone number, and how many siblings they have. A student leaves the siblings box blank. Does that mean they have zero siblings? Maybe. Or maybe they just didn't answer. You can't tell. The only honest reading is: **unknown**.

That's what `NULL` means in a database: **no value is known here**. It's not zero. It's not an empty piece of text. It's not "no." It's the absence of any value at all.

## Seeing NULL

Here are the loans. In the shell's table mode, `NULL` shows up as an empty cell:

```sql
SELECT id, book_id, due_date, returned_date FROM loans;
```

```text
+----+---------+------------+---------------+
| id | book_id |  due_date  | returned_date |
+----+---------+------------+---------------+
|  1 |       1 | 2026-09-15 | 2026-09-10    |
|  2 |       1 | 2026-09-26 |               |
|  3 |       3 | 2026-09-29 |               |
|  4 |       4 | 2026-09-03 | 2026-09-05    |
|  5 |       4 | 2026-09-24 |               |
|  6 |       6 | 2026-10-04 |               |
|  7 |       2 | 2026-09-15 | 2026-09-14    |
+----+---------+------------+---------------+
```

Four loans have a `returned_date` of `NULL`: those books are still out.

## The trap: `= NULL` never matches

Here's the natural way to ask for unreturned loans. It doesn't work:

```sql
SELECT id FROM loans WHERE returned_date = NULL;
```

That query returns no rows at all, not even an error. Why?

Think back to the blank form. Is "unknown" equal to "unknown"? You can't say; two blank sibling boxes don't mean two students have the same number of siblings. So SQL's answer to *any* comparison with `NULL` is neither true nor false. It's a third value: **unknown**. And `WHERE` only keeps rows where the condition is **true**.

So `returned_date = NULL` is unknown for every row, and every row is left out. The same goes for `<>`, `<`, and every other comparison.

## `IS NULL` and `IS NOT NULL`

To check for `NULL`, SQL has special operators:

```sql
SELECT id, due_date FROM loans WHERE returned_date IS NULL;
```

```text
+----+------------+
| id |  due_date  |
+----+------------+
|  2 | 2026-09-26 |
|  3 | 2026-09-29 |
|  5 | 2026-09-24 |
|  6 | 2026-10-04 |
+----+------------+
```

```sql
SELECT id, returned_date FROM loans WHERE returned_date IS NOT NULL;
```

```text
+----+---------------+
| id | returned_date |
+----+---------------+
|  1 | 2026-09-10    |
|  4 | 2026-09-05    |
|  7 | 2026-09-14    |
+----+---------------+
```

The rule to remember: **never compare with `= NULL`. Always use `IS NULL` or `IS NOT NULL`.**

## NULL spreads through calculations

Any calculation involving `NULL` gives `NULL`. If one number is unknown, the answer is unknown too:

```sql
SELECT 5 + NULL AS a, NULL * 0 AS b, 'Hello ' || NULL AS c;
```

```text
+---+---+---+
| a | b | c |
+---+---+---+
|   |   |   |
+---+---+---+
```

All three are `NULL`, shown as empty cells. Even `NULL * 0` isn't 0, because the database doesn't pretend to know what the unknown value was. (`||` joins text in SQLite, like `+` does in Python. You'll meet it in [Built-in Functions](/lessons/sqlite3/functions).)

## Filling in a default: `COALESCE`

Often you want to show something friendlier than an empty cell. **`COALESCE`** takes a list of values and gives back the **first one that isn't `NULL`**:

```sql
SELECT id, COALESCE(returned_date, 'still out') AS returned
FROM loans;
```

```text
+----+------------+
| id |  returned  |
+----+------------+
|  1 | 2026-09-10 |
|  2 | still out  |
|  3 | still out  |
|  4 | 2026-09-05 |
|  5 | still out  |
|  6 | still out  |
|  7 | 2026-09-14 |
+----+------------+
```

Where there's a return date, you see it. Where it's `NULL`, you see `'still out'` instead. The table isn't changed; only the result is.

`COALESCE` is standard SQL and works in every major database. You'll also see database-specific versions: SQLite and MySQL have `IFNULL(value, default)`, and Oracle has `NVL(value, default)`, covered in the [Oracle track](/lessons/oracle-database/dual-and-functions). They do the same job with two values.

## NULL is not zero, and not empty text

These three values are all different, and databases treat them differently:

```sql
SELECT
	NULL IS NULL AS null_is_null,
	0 IS NULL AS zero_is_null,
	'' IS NULL AS empty_is_null;
```

```text
+--------------+--------------+---------------+
| null_is_null | zero_is_null | empty_is_null |
+--------------+--------------+---------------+
|            1 |            0 |             0 |
+--------------+--------------+---------------+
```

(In SQLite, true and false are shown as `1` and `0`.) Only real `NULL` is `NULL`. The number 0 is a known value: zero. The empty text `''` is a known value too: text with nothing in it.

Oracle is the famous exception: it treats an empty string as `NULL`. The [Oracle track](/lessons/oracle-database/coming-from-sqlite) explains the consequences.

## Where NULLs end up

Two more places `NULL` behaves in its own way, both covered in later lessons:

- **Sorting.** In SQLite, `NULL` values come first when you sort in ascending order, as mentioned in [Sorting and Limiting Results](/lessons/sqlite3/order-by-and-limit).
- **Counting and totals.** Functions like `COUNT(column)`, `SUM`, and `AVG` skip `NULL` values entirely, which you'll see in [Aggregates](/lessons/sqlite3/aggregates).

## When to allow NULL at all

`NULL` is useful when a value genuinely might not exist yet, like a return date for a book that's still out. But it's also a common source of bugs. When you design tables, you can forbid `NULL` in columns that must always have a value, like a book's title. That's the `NOT NULL` rule, coming up in [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints).

## Try it

This creates a small table of quiz results, where some students haven't taken the quiz yet. Predict each query's result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, null.sql"
	min-height="420px"
	:model-value="'CREATE TABLE results (student TEXT, score INTEGER, retake_score INTEGER);\n\nINSERT INTO results VALUES\n\t(\'Maria\', 91, NULL),\n\t(\'Ben\', 68, 80),\n\t(\'Carlo\', NULL, NULL),\n\t(\'Dina\', 0, NULL);\n\n-- Query 1\nSELECT student FROM results WHERE score = NULL;\n\n-- Query 2\nSELECT student FROM results WHERE score IS NULL;\n\n-- Query 3\nSELECT student, COALESCE(retake_score, score, \'absent\') AS final_score FROM results;\n\n-- Query 4\nSELECT student, score + 5 AS with_bonus FROM results WHERE score IS NOT NULL;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+---------+
| student |
+---------+
| Carlo   |
+---------+
+---------+-------------+
| student | final_score |
+---------+-------------+
| Maria   |          91 |
| Ben     |          80 |
| Carlo   | absent      |
| Dina    |           0 |
+---------+-------------+
+---------+------------+
| student | with_bonus |
+---------+------------+
| Maria   |         96 |
| Ben     |         73 |
| Dina    |          5 |
+---------+------------+
```

Query 1 returns nothing at all, which is why the shell shows no table: comparing with `= NULL` is never true. Query 2 finds Carlo. Dina scored 0, which is a real score, so she's not `NULL`. In Query 3, `COALESCE` takes the retake score if there is one, then the first score, then `'absent'`. And Query 4 adds 5 to every known score.
:::

## Try it yourself

1. In your library database, find the titles of books with a `NULL` genre. (There aren't any yet. Why does the query still work, and what does it return?)
2. Show every loan with its due date and its return date, showing `'not returned'` for the ones still out.
3. Predict `SELECT NULL = NULL;` and `SELECT NULL IS NULL;`, then run them. Why are they different?

## Check your understanding

<Quiz
	question="Which condition finds loans that have no returned date?"
	:options="['WHERE returned_date = NULL', 'WHERE returned_date = 0', 'WHERE returned_date = \'\'', 'WHERE returned_date IS NULL']"
	:answer-index="3"
	explanation="Any comparison with NULL, including = NULL, is unknown rather than true, so it never matches. Use IS NULL."
/>

<Quiz
	question="What is 10 + NULL?"
	:options="['NULL', '10', '0', 'An error']"
	:answer-index="0"
	explanation="If one part of a calculation is unknown, the result is unknown too."
/>

<Quiz
	question="What does COALESCE(nickname, first_name, &#39;Guest&#39;) give back?"
	:options="['All three values joined together', 'NULL if any of them is NULL', 'The first of those values that isn\'t NULL', 'Always Guest']"
	:answer-index="2"
	explanation="COALESCE checks its values from left to right and gives back the first one that isn't NULL."
/>

## Up next

You've used a couple of built-in functions now, like `COALESCE` and `sqlite_version()`. SQL has many more, for text, numbers, and rounding, and they're the subject of [Built-in Functions](/lessons/sqlite3/functions).
