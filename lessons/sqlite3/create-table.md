---
title: "SQL CREATE TABLE: Design Your Own Tables in SQLite"
description: "Create your own SQL tables with CREATE TABLE: name columns, choose types, number rows automatically, set defaults, and change or remove tables later."
---

# Creating Tables

*Before a school office can file a single student record, someone has to design the form: which boxes it has, and what goes in each one.*

Every table so far was built for you, by the library script in [Your First Queries](/lessons/sqlite3/first-queries). Now you'll build your own. Designing a table means deciding what information it holds, what each column is called, and what kind of data each column accepts.

## Designing the form

Before a school can collect information about its students, someone designs the enrollment form. It has a box for the name, a box for the grade level, a box for the date of birth. Each box is labeled, and each expects a certain kind of answer: the date box expects a date, not a poem.

Once the form is printed, every student fills in the same boxes, which is what makes the records easy to sort and search later.

`CREATE TABLE` is designing that form. The columns are the boxes.

## Your first table

```sql
CREATE TABLE students (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	grade INTEGER,
	birthday TEXT
);
```

That creates an empty table called `students` with four columns. Piece by piece:

- `CREATE TABLE students` names the new table. Table names are usually plural and lowercase, with underscores between words: `students`, `club_members`.
- Inside the parentheses, each line describes one column: its **name**, then its **type**, then any **rules**. Columns are separated by commas, with no comma after the last one.
- `id INTEGER PRIMARY KEY` makes `id` the table's primary key: the unique number for each row, from [Databases, Tables, and SQL](/lessons/sqlite3/databases-and-sql).
- `NOT NULL` is a rule: every row *must* have a name. You'll see more rules like it in [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints).

You can check what you built with the shell's `.schema` command:

```sql
CREATE TABLE students (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	grade INTEGER,
	birthday TEXT
);
-- Then check it:
.schema students
```

```text
CREATE TABLE students (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	grade INTEGER,
	birthday TEXT
);
```

## Column types in SQLite

SQLite has just a few basic types:

| Type | Holds | Examples |
|---|---|---|
| `INTEGER` | whole numbers | `11`, `2026`, `-3` |
| `REAL` | decimal numbers | `3.5`, `92.75` |
| `TEXT` | text | `'Maria'`, `'2026-09-29'` |
| `BLOB` | raw data, stored exactly as given | images, files |

Notice there's no separate date type. SQLite stores dates as **text** in the form `'YYYY-MM-DD'`, which sorts and compares correctly, as you saw in [Filtering Rows with WHERE](/lessons/sqlite3/where). [Dates and Times in SQLite](/lessons/sqlite3/dates-and-times) shows how to do date math with them.

Other databases have many more types, like `VARCHAR(100)` for text of up to 100 characters, or `DATE`. SQLite understands those names too, and quietly maps them onto its own types, so SQL written for other databases usually works here. SQLite is also unusually relaxed about what you put in a column, which is the subject of [Type Affinity and STRICT Tables](/lessons/sqlite3/type-affinity).

## Automatic numbering

When a column is declared exactly as `INTEGER PRIMARY KEY`, SQLite fills it in for you. Leave it out when adding a row, and SQLite picks the next number:

```sql
CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, grade INTEGER);
INSERT INTO students (name, grade) VALUES ('Maria', 11);
INSERT INTO students (name, grade) VALUES ('Ben', 10);
SELECT * FROM students;
```

```text
+----+-------+-------+
| id | name  | grade |
+----+-------+-------+
|  1 | Maria |    11 |
|  2 | Ben   |    10 |
+----+-------+-------+
```

Other databases do the same job with different words: MySQL uses `AUTO_INCREMENT`, and Oracle uses identity columns or sequences. The MySQL and Oracle tracks each have a lesson on it.

## Default values

A `DEFAULT` gives a column a value to use when a new row doesn't provide one:

```sql
CREATE TABLE tasks (
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL,
	done INTEGER NOT NULL DEFAULT 0,
	created TEXT DEFAULT CURRENT_DATE
);
INSERT INTO tasks (title) VALUES ('Return library book');
SELECT id, title, done FROM tasks;
```

```text
+----+---------------------+------+
| id |        title        | done |
+----+---------------------+------+
|  1 | Return library book |    0 |
+----+---------------------+------+
```

The new task got `done = 0` without being told. And `created` got today's date automatically, from SQLite's built-in `CURRENT_DATE`. (It isn't shown above because it would be different on the day you read this.)

SQLite doesn't have a separate true-or-false type, so the usual habit is an `INTEGER` column holding `1` for true and `0` for false, like `done` here.

## "Only if it isn't there yet": `IF NOT EXISTS`

Running `CREATE TABLE` for a table that already exists is an error:

```sql
CREATE TABLE books (id INTEGER PRIMARY KEY);  -- error: table books already exists
```

When a setup script might run more than once, add `IF NOT EXISTS`, and SQLite quietly skips tables that are already there:

```sql
CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY);
SELECT COUNT(*) AS books_still_there FROM books;
```

```text
+-------------------+
| books_still_there |
+-------------------+
|                 6 |
+-------------------+
```

The existing `books` table, with its six rows, wasn't touched.

## Changing a table: `ALTER TABLE`

Tables often need a new column after they're built. `ALTER TABLE ... ADD COLUMN` adds one to every existing row:

```sql
ALTER TABLE members ADD COLUMN email TEXT;
SELECT name, email FROM members WHERE id <= 2;
```

```text
+--------------+-------+
|     name     | email |
+--------------+-------+
| Maria Santos |       |
| Ben Cruz     |       |
+--------------+-------+
```

Existing rows get `NULL` in the new column, or the column's `DEFAULT`, if it has one. You can also rename things:

```sql
ALTER TABLE members RENAME COLUMN grade TO grade_level;
ALTER TABLE members RENAME TO club_members;
```

SQLite's `ALTER TABLE` is more limited than other databases'. It can add, rename, and remove columns, but not, for example, change a column's type. For bigger changes, the usual approach is to create a new table the way you want it, copy the data across, and swap them.

## Removing a table: `DROP TABLE`

```sql
DROP TABLE IF EXISTS tasks;
```

`DROP TABLE` deletes a table, **and every row in it**, permanently. There's no undo and no "are you sure?" question. Double-check the name before you press Enter, and keep a backup of any database you care about. (A SQLite backup is easy: it's a copy of the file.)

## Try it

This builds a table for a class's field-trip sign-ups, adds a few students (some without every detail), and shows the result. Predict what the final `SELECT` shows, including the defaults and the automatic numbers.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, create.sql"
	min-height="380px"
	:model-value="'CREATE TABLE signups (\n\tid INTEGER PRIMARY KEY,\n\tstudent TEXT NOT NULL,\n\tgrade INTEGER,\n\tpaid INTEGER NOT NULL DEFAULT 0,\n\tlunch TEXT DEFAULT \'packed\'\n);\n\nINSERT INTO signups (student, grade) VALUES (\'Maria\', 11);\nINSERT INTO signups (student, grade, paid) VALUES (\'Ben\', 10, 1);\nINSERT INTO signups (student, paid, lunch) VALUES (\'Carlo\', 1, \'buy\');\n\nALTER TABLE signups ADD COLUMN permission_slip INTEGER DEFAULT 0;\n\nSELECT * FROM signups;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+----+---------+-------+------+--------+-----------------+
| id | student | grade | paid | lunch  | permission_slip |
+----+---------+-------+------+--------+-----------------+
|  1 | Maria   |    11 |    0 | packed |               0 |
|  2 | Ben     |    10 |    1 | packed |               0 |
|  3 | Carlo   |       |    1 | buy    |               0 |
+----+---------+-------+------+--------+-----------------+
```

The `id`s were filled in automatically. Every column left out got its `DEFAULT`, or `NULL` if it had none, like Carlo's `grade`. And the column added later with `ALTER TABLE` gave every existing row its default of `0`.
:::

## Try it yourself

1. Create a table called `events` with an automatic `id`, a `name` that's required, a `date`, and a `capacity` that defaults to 30.
2. Try inserting an event without a name. What does SQLite say?
3. Add a `location` column to your `events` table, then look at the result with `.schema events`.

## Check your understanding

<Quiz
	question="Which line correctly creates a column that SQLite numbers automatically?"
	:options="['id NUMBER AUTO', 'id TEXT PRIMARY KEY', 'id INTEGER PRIMARY KEY', 'id AUTO_NUMBER']"
	:answer-index="2"
	explanation="In SQLite, a column declared as INTEGER PRIMARY KEY is filled in automatically when you leave it out."
/>

<Quiz
	question="What happens to existing rows when you run ALTER TABLE members ADD COLUMN email TEXT;?"
	:options="['They are deleted', 'The command fails', 'They get an empty string', 'They get NULL in the new column']"
	:answer-index="3"
	explanation="Existing rows get NULL in a new column, or its DEFAULT value if one was given."
/>

<Quiz
	question="How does SQLite store dates?"
	:options="['In a special DATE type', 'Usually as text in the form YYYY-MM-DD, which sorts correctly', 'As a number of seconds only', 'It cannot store dates']"
	:answer-index="1"
	explanation="SQLite has no DATE type. Text like 2026-09-29 compares and sorts in date order, and SQLite's date functions work with it."
/>

## Up next

Your tables are built. Next, you'll learn the three statements that fill them and keep them up to date: adding rows, changing them, and removing them, in [INSERT, UPDATE, and DELETE](/lessons/sqlite3/insert-update-delete).
