---
title: "SQL Constraints: Primary Keys, Foreign Keys, NOT NULL, and CHECK"
description: "Make your database reject bad data with SQL constraints: primary keys, NOT NULL, UNIQUE, CHECK, and foreign keys, plus SQLite's foreign key setting."
---

# Primary Keys, Foreign Keys, and Constraints

*A good form doesn't wait for someone to notice a mistake later. It won't let you hand it in until the required boxes are filled in correctly.*

Right now, the library database accepts almost anything. You could add a member with no name, a book with `-5` copies, or a loan for book number 99, which doesn't exist. Nothing would complain, and the mistake would sit there until something went wrong much later.

**Constraints** are rules you attach to a table, which the database enforces on every single change. Break one, and the change is refused, on the spot, with an error.

## A form that checks itself

Picture an online enrollment form. You can't submit it until the name box is filled in. The age box only accepts numbers. The email box warns you if that email is already registered. The form checks the rules itself, so bad information never gets into the school's records in the first place.

Constraints make your tables work like that form. The difference from checking in your program's code is that the database enforces them **no matter what program makes the change**, whether it's your app, a script, or someone typing in the shell.

## `NOT NULL`: this box is required

`NOT NULL` means a column must always have a value:

```sql
CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL, grade INTEGER);
INSERT INTO students (grade) VALUES (11);  -- error: NOT NULL constraint failed: students.name
```

The error names the rule that was broken, and the insert doesn't happen. Use `NOT NULL` on every column that must always be filled in, which is usually most of them.

## `UNIQUE`: no two rows the same

`UNIQUE` means no two rows can share a value in that column. It's perfect for things like email addresses and student ID numbers:

```sql
CREATE TABLE accounts (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE);
INSERT INTO accounts (email) VALUES ('maria@example.com');
INSERT INTO accounts (email) VALUES ('maria@example.com');  -- error: UNIQUE constraint failed: accounts.email
```

## `CHECK`: any rule you like

`CHECK` takes a condition, like a `WHERE` condition, that every row must pass:

```sql
CREATE TABLE students (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	grade INTEGER CHECK (grade BETWEEN 1 AND 12)
);
INSERT INTO students (name, grade) VALUES ('Maria', 15);  -- error: CHECK constraint failed: grade BETWEEN 1 AND 12
```

`CHECK` is great for ranges, like grades and scores, and for making sure numbers aren't negative: `copies_owned INTEGER CHECK (copies_owned >= 0)`.

## Primary keys, again

You've used `PRIMARY KEY` since the first table. It's a constraint too: it combines `UNIQUE` with the job of identifying each row. Every table should have one, and it's almost always an automatically numbered `id`:

```sql
INSERT INTO books (id, title) VALUES (1, 'Duplicate');  -- error: UNIQUE constraint failed: books.id
```

Book 1 already exists, so the database refuses a second one.

A primary key can also be made of **two columns together**, which is handy for link tables like the student-and-club memberships in [Combining Tables with JOIN](/lessons/sqlite3/joins). There, each *pair* must be unique, so a student can't join the same club twice:

```sql
CREATE TABLE memberships (
	student_id INTEGER,
	club_id INTEGER,
	PRIMARY KEY (student_id, club_id)
);
INSERT INTO memberships VALUES (1, 1), (1, 2);
INSERT INTO memberships VALUES (1, 1);  -- error: UNIQUE constraint failed: memberships.student_id, memberships.club_id
```

## Foreign keys: pointing to rows that exist

A **foreign key** is a column that points to another table's primary key, like `loans.book_id` pointing to `books.id`. You met the idea in [Databases, Tables, and SQL](/lessons/sqlite3/databases-and-sql). As a constraint, it makes sure the pointing is always valid: every `book_id` in `loans` must match a real book.

Declare it with `REFERENCES`:

```sql
CREATE TABLE reviews (
	id INTEGER PRIMARY KEY,
	book_id INTEGER NOT NULL REFERENCES books(id),
	stars INTEGER CHECK (stars BETWEEN 1 AND 5)
);
```

## SQLite's big foreign key surprise

Here's something every SQLite user needs to know. For historical reasons, **SQLite doesn't enforce foreign keys unless you switch them on**, every time you open the database:

```sql
PRAGMA foreign_keys = ON;
```

Without that line, the `REFERENCES` rule is written down but ignored:

```sql
CREATE TABLE reviews (id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES books(id), stars INTEGER);
INSERT INTO reviews (book_id, stars) VALUES (99, 5);
SELECT * FROM reviews;
```

```text
+----+---------+-------+
| id | book_id | stars |
+----+---------+-------+
|  1 |      99 |     5 |
+----+---------+-------+
```

A review of book 99, which doesn't exist, went in without a word. Now switch the setting on and try again:

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE reviews (id INTEGER PRIMARY KEY, book_id INTEGER NOT NULL REFERENCES books(id), stars INTEGER);
INSERT INTO reviews (book_id, stars) VALUES (99, 5);  -- error: FOREIGN KEY constraint failed
```

That's the behavior you want. MySQL and Oracle always enforce foreign keys, so this is purely an SQLite habit: **put `PRAGMA foreign_keys = ON;` at the start of every session and every program that uses the database.** [SQLite Settings with PRAGMA](/lessons/sqlite3/pragma) covers this setting and others like it.

## What happens when the row being pointed to is deleted?

With foreign keys on, SQLite also stops you from deleting a book that loans still point to, since that would leave those loans pointing at nothing:

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE shelves (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE shelf_books (shelf_id INTEGER REFERENCES shelves(id), title TEXT);
INSERT INTO shelves VALUES (1, 'Science');
INSERT INTO shelf_books VALUES (1, 'Cosmos');
DELETE FROM shelves WHERE id = 1;  -- error: FOREIGN KEY constraint failed
```

You can choose a different behavior with `ON DELETE`. For example, `REFERENCES shelves(id) ON DELETE CASCADE` means "if the shelf is deleted, delete its books too." Use `CASCADE` carefully: one delete can quietly remove a lot of rows.

## Try it

This builds a small, well-guarded table of quiz scores, then tries five inserts. Some break a rule. Predict which ones succeed, and what the final `SELECT` shows. (Each failed insert prints an error and is skipped; the rest carry on.)

<CodeEditor
	language="plaintext"
	label="SQL practice editor, constraints.sql"
	min-height="420px"
	:model-value="'PRAGMA foreign_keys = ON;\n\nCREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE);\nCREATE TABLE scores (\n\tstudent_id INTEGER NOT NULL REFERENCES students(id),\n\tquiz INTEGER NOT NULL,\n\tscore INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),\n\tPRIMARY KEY (student_id, quiz)\n);\n\nINSERT INTO students (name) VALUES (\'Maria\'), (\'Ben\');\n\nINSERT INTO scores VALUES (1, 1, 92);\nINSERT INTO scores VALUES (1, 1, 95);\nINSERT INTO scores VALUES (2, 1, 105);\nINSERT INTO scores VALUES (3, 1, 80);\nINSERT INTO scores VALUES (2, 1, 78);\n\nSELECT * FROM scores;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
Error near line 14: UNIQUE constraint failed: scores.student_id, scores.quiz
Error near line 15: CHECK constraint failed: score BETWEEN 0 AND 100
Error near line 16: FOREIGN KEY constraint failed
+------------+------+-------+
| student_id | quiz | score |
+------------+------+-------+
|          1 |    1 |    92 |
|          2 |    1 |    78 |
+------------+------+-------+
```

The second insert repeats Maria's quiz 1, breaking the two-column primary key. The third has a score of 105, breaking the `CHECK`. The fourth is for student 3, who doesn't exist, breaking the foreign key. Only the first and last inserts made it in.
:::

## Try it yourself

1. Remove `PRAGMA foreign_keys = ON;` from the Try it and run it again. Which extra row gets in now?
2. Create a `books` table where the title is required, and `copies_owned` must be 0 or more and defaults to 1.
3. Add a `UNIQUE` email column to a new `members` table, and test that it rejects a duplicate.

## Check your understanding

<Quiz
	question="What happens when an INSERT breaks a constraint?"
	:options="['The row is added anyway, with a warning', 'The broken column is set to NULL', 'The database refuses the change and reports an error', 'The whole table is deleted']"
	:answer-index="2"
	explanation="Constraints are enforced on every change. A row that breaks one is rejected, so bad data never gets in."
/>

<Quiz
	question="In SQLite, what must you do for foreign key constraints to be enforced?"
	:options="['Nothing, they always work', 'Run PRAGMA foreign_keys = ON; in each session', 'Use UNIQUE instead', 'Restart SQLite']"
	:answer-index="1"
	explanation="SQLite ignores foreign keys unless PRAGMA foreign_keys = ON; is run on the connection. MySQL and Oracle always enforce them."
/>

<Quiz
	question="Which constraint makes sure no two accounts share an email?"
	:options="['NOT NULL', 'CHECK', 'DEFAULT', 'UNIQUE']"
	:answer-index="3"
	explanation="UNIQUE rejects any row whose value in that column is already in the table."
/>

## Up next

You can build tables and guard them with rules. But which tables should a database have in the first place, and which columns go where? That's the art of [Designing a Database: Normalization](/lessons/sqlite3/database-design).
