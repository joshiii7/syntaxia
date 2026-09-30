---
title: "SQL INSERT, UPDATE, and DELETE: Change Data Safely"
description: "Add rows with INSERT, change them with UPDATE, and remove them with DELETE, always with a WHERE clause, plus SQLite's RETURNING and ON CONFLICT upserts."
---

# INSERT, UPDATE, and DELETE

*A librarian's day isn't only answering questions. New books arrive, borrowed books come back, and damaged ones are thrown away. Every change goes in the records.*

Everything in SQL Foundations was about **reading** data. But a database that never changes isn't much use. New members join, books get borrowed and returned, details get corrected. This lesson covers the three statements that change what's stored:

- **`INSERT`** adds new rows.
- **`UPDATE`** changes existing rows.
- **`DELETE`** removes rows.

Unlike `SELECT`, these statements change the actual data, permanently. So this lesson also covers the habits that keep those changes safe.

## Adding rows: `INSERT`

You've seen `INSERT` in every setup script so far. Here's the careful way to write it, naming the columns you're filling:

```sql
INSERT INTO members (name, grade, joined)
VALUES ('Fe Garcia', 10, '2026-09-29');

SELECT * FROM members WHERE name = 'Fe Garcia';
```

```text
+----+-----------+-------+------------+
| id |   name    | grade |   joined   |
+----+-----------+-------+------------+
|  6 | Fe Garcia |    10 | 2026-09-29 |
+----+-----------+-------+------------+
```

- `INSERT INTO members` names the table.
- The first parentheses list the columns you're providing, in any order you like.
- `VALUES (...)` gives the values, in the **same order** as the columns.
- Columns you leave out get their default, or `NULL`. Here, `id` was numbered automatically, as you saw in [Creating Tables](/lessons/sqlite3/create-table).

You *can* leave out the column list, and give a value for every column in the table's order. The library script does that. But naming the columns is safer: if someone adds a column to the table later, an `INSERT` without a list breaks, while one with a list keeps working.

Several rows can go in one statement, separated by commas:

```sql
INSERT INTO members (name, grade, joined) VALUES
	('Gio Ramos', 9, '2026-09-29'),
	('Hana Lee', 12, '2026-09-29');

SELECT COUNT(*) AS members FROM members;
```

```text
+---------+
| members |
+---------+
|       7 |
+---------+
```

## Changing rows: `UPDATE`

`UPDATE` changes values in rows that already exist. Ben just returned *Noli Me Tangere* (loan 2), so the loan needs a return date:

```sql
UPDATE loans
SET returned_date = '2026-09-29'
WHERE id = 2;

SELECT id, due_date, returned_date FROM loans WHERE id = 2;
```

```text
+----+------------+---------------+
| id |  due_date  | returned_date |
+----+------------+---------------+
|  2 | 2026-09-26 | 2026-09-29    |
+----+------------+---------------+
```

- `UPDATE loans` names the table.
- `SET` says which columns get which new values. Separate several with commas: `SET grade = 11, joined = '2026-01-01'`.
- **`WHERE` says which rows to change.** Only rows matching the condition are updated.

The new value can be a calculation using the old one. The library bought one more copy of every science book:

```sql
UPDATE books
SET copies_owned = copies_owned + 1
WHERE genre = 'Science';

SELECT title, copies_owned FROM books WHERE genre = 'Science';
```

```text
+-------------------------+--------------+
|          title          | copies_owned |
+-------------------------+--------------+
| A Brief History of Time |            3 |
| Cosmos                  |            3 |
+-------------------------+--------------+
```

## The most dangerous missing line

Here's the mistake that has cost real companies real data. What does this do?

```sql
UPDATE members SET grade = 12;
SELECT name, grade FROM members;
```

```text
+--------------+-------+
|     name     | grade |
+--------------+-------+
| Maria Santos |    12 |
| Ben Cruz     |    12 |
| Carlo Reyes  |    12 |
| Dina Lim     |    12 |
| Eli Tan      |    12 |
+--------------+-------+
```

With no `WHERE`, `UPDATE` changes **every row in the table**. Every member is now in grade 12, and the old grades are gone. SQLite doesn't ask "are you sure?"; it just does it.

The same goes for `DELETE`: without a `WHERE`, it deletes everything.

A habit that prevents this: **write the `SELECT` first.** Before an `UPDATE` or `DELETE`, run a `SELECT` with the same `WHERE`, and check it finds exactly the rows you mean to change. Then turn it into the `UPDATE` or `DELETE`. It takes ten seconds, and it will save you one day.

## Removing rows: `DELETE`

`DELETE FROM` removes the rows that match its `WHERE`:

```sql
DELETE FROM loans WHERE returned_date IS NOT NULL;
SELECT id, book_id, returned_date FROM loans;
```

```text
+----+---------+---------------+
| id | book_id | returned_date |
+----+---------+---------------+
|  2 |       1 |               |
|  3 |       3 |               |
|  5 |       4 |               |
|  6 |       6 |               |
+----+---------+---------------+
```

All three returned loans are gone; the four still-open ones remain. As with `UPDATE`, **`DELETE FROM loans;` with no `WHERE` would empty the whole table.**

(Deleting old records is often a bad idea in real systems, by the way. The history of who borrowed what can be valuable. Many apps mark rows as removed, with a column like `is_active`, instead of deleting them.)

## Seeing what changed: `RETURNING`

SQLite (since version 3.35, in 2021) can show you the rows a change affected, straight away, with `RETURNING`:

```sql
UPDATE books
SET copies_on_loan = copies_on_loan - 1
WHERE id = 1
RETURNING title, copies_on_loan;
```

```text
+-----------------+----------------+
|      title      | copies_on_loan |
+-----------------+----------------+
| Noli Me Tangere |              2 |
+-----------------+----------------+
```

It works with `INSERT` and `DELETE` too. `INSERT ... RETURNING id` is a common way to find out the number a new row was given.

## Insert or update: `ON CONFLICT`

Sometimes you want "add this row, but if it's already there, update it instead." That's called an **upsert**. Say each member has one saved setting, and you want to set Maria's theme to dark whether or not she has a row yet:

```sql
CREATE TABLE settings (member_id INTEGER PRIMARY KEY, theme TEXT);
INSERT INTO settings VALUES (1, 'light');

INSERT INTO settings (member_id, theme) VALUES (1, 'dark')
ON CONFLICT (member_id) DO UPDATE SET theme = excluded.theme;

SELECT * FROM settings;
```

```text
+-----------+-------+
| member_id | theme |
+-----------+-------+
|         1 | dark  |
+-----------+-------+
```

The insert would have clashed with the existing row for member 1, so `ON CONFLICT` turned it into an update. `excluded.theme` means "the value you were trying to insert."

This is one of the places where every database does it differently: MySQL writes `ON DUPLICATE KEY UPDATE`, and Oracle uses a `MERGE` statement. Each of those tracks has a lesson on it.

## Try it

This builds a small class list, then runs a series of changes. Follow each one carefully, and predict what the final `SELECT` shows.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, changes.sql"
	min-height="460px"
	:model-value="'CREATE TABLE roster (id INTEGER PRIMARY KEY, name TEXT NOT NULL, grade INTEGER, paid INTEGER DEFAULT 0);\n\nINSERT INTO roster (name, grade) VALUES (\'Maria\', 11), (\'Ben\', 10), (\'Carlo\', 11), (\'Dina\', 9);\n\nUPDATE roster SET paid = 1 WHERE name IN (\'Maria\', \'Dina\');\nUPDATE roster SET grade = grade + 1 WHERE grade = 11;\nDELETE FROM roster WHERE name = \'Ben\';\nINSERT INTO roster (name, grade, paid) VALUES (\'Eli\', 10, 1);\nUPDATE roster SET paid = 0 WHERE paid = 1 AND grade = 12;\n\nSELECT * FROM roster;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+----+-------+-------+------+
| id | name  | grade | paid |
+----+-------+-------+------+
|  1 | Maria |    12 |    0 |
|  3 | Carlo |    12 |    0 |
|  4 | Dina  |     9 |    1 |
|  5 | Eli   |    10 |    1 |
+----+-------+-------+------+
```

Maria and Carlo moved from grade 11 to 12. Ben was deleted. Eli was added with the next number, 5 (SQLite doesn't reuse Ben's 2). And the last `UPDATE` reset `paid` for paid students in grade 12, which caught only Maria, since Carlo hadn't paid.
:::

## Try it yourself

1. In your library database, add a new book of your choice, then find it with a `SELECT`.
2. Mark loan 3 as returned today. Write the `SELECT` with the same `WHERE` first, to check.
3. Delete the member you added in the first example of this lesson, and check that only that row is gone.

## Check your understanding

<Quiz
	question="What does UPDATE books SET copies_owned = 5; do?"
	:options="['Changes copies_owned for the first book only', 'Causes an error without WHERE', 'Changes copies_owned to 5 for every book in the table', 'Adds a new book']"
	:answer-index="2"
	explanation="Without a WHERE clause, UPDATE changes every row. Always include a WHERE, and test it with a SELECT first."
/>

<Quiz
	question="Why name the columns in INSERT INTO members (name, grade) VALUES (...)?"
	:options="['The INSERT keeps working even if columns are added to the table later, and the values clearly match their columns', 'It is required by SQL', 'It makes the insert faster', 'It stops duplicates']"
	:answer-index="0"
	explanation="Naming the columns means the values don't depend on the table's exact column order, so the statement survives changes to the table."
/>

<Quiz
	question="What is a safe habit before running an UPDATE or DELETE?"
	:options="['Run a SELECT with the same WHERE first, and check it finds exactly the rows you mean', 'Delete the whole table and rebuild it', 'Turn off the computer', 'Never use WHERE']"
	:answer-index="0"
	explanation="If the SELECT finds the right rows, the UPDATE or DELETE with the same WHERE will change exactly those rows."
/>

## Up next

So far, nothing stops someone from adding a loan for a book that doesn't exist, or a member with no name. Next, you'll add rules to your tables that the database enforces for you, in [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints).
