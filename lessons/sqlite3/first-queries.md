---
title: "Your First SQLite Queries: Build a Database and Explore It"
description: "Create the library database used in this track, explore it with sqlite3 dot-commands like .tables and .schema, and run your first SQL queries."
---

# Your First Queries

*A new library building is empty shelves until the books arrive. Today, you stock the shelves, and then you ask your first question.*

In [Setting Up](/lessons/sqlite3/setting-up), you installed the `sqlite3` shell and opened a database file. Now you'll fill that database with real data, the same small library you'll use for the rest of this track, look around inside it, and ask it your first questions.

## Stocking the shelves

A library building on opening day is just empty shelves. Before anyone can borrow anything, the books have to be unpacked, shelved, and recorded. Only then can the librarian answer questions like "Do you have anything by Carl Sagan?"

A new database file is the same. First you create its **tables** and fill them with **rows**. Then you can query it.

## The library database

Here's the script that builds the library. It creates three tables, `books`, `members`, and `loans`, and fills each one with a few rows. Don't worry about understanding every line yet; creating tables is covered properly in [Creating Tables](/lessons/sqlite3/create-table), and adding rows in [INSERT, UPDATE, and DELETE](/lessons/sqlite3/insert-update-delete).

::: details The library script (click to show, then copy it all)
```sql
CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, genre TEXT, published_year INTEGER, copies_owned INTEGER, copies_on_loan INTEGER);
INSERT INTO books VALUES
	(1, 'Noli Me Tangere', 'Jose Rizal', 'Novel', 1887, 4, 3),
	(2, 'El Filibusterismo', 'Jose Rizal', 'Novel', 1891, 3, 1),
	(3, 'The Little Prince', 'Antoine de Saint-Exupery', 'Novel', 1943, 5, 2),
	(4, 'A Brief History of Time', 'Stephen Hawking', 'Science', 1988, 2, 2),
	(5, 'Cosmos', 'Carl Sagan', 'Science', 1980, 2, 0),
	(6, 'Smaller and Smaller Circles', 'F. H. Batacan', 'Mystery', 2002, 3, 1);
CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER, joined TEXT);
INSERT INTO members VALUES
	(1, 'Maria Santos', 11, '2025-06-10'),
	(2, 'Ben Cruz', 10, '2025-06-12'),
	(3, 'Carlo Reyes', 11, '2025-07-01'),
	(4, 'Dina Lim', 9, '2026-01-15'),
	(5, 'Eli Tan', 12, '2026-02-20');
CREATE TABLE loans (id INTEGER PRIMARY KEY, book_id INTEGER, member_id INTEGER, loan_date TEXT, due_date TEXT, returned_date TEXT);
INSERT INTO loans VALUES
	(1, 1, 1, '2026-09-01', '2026-09-15', '2026-09-10'),
	(2, 1, 2, '2026-09-12', '2026-09-26', NULL),
	(3, 3, 1, '2026-09-15', '2026-09-29', NULL),
	(4, 4, 3, '2026-08-20', '2026-09-03', '2026-09-05'),
	(5, 4, 3, '2026-09-10', '2026-09-24', NULL),
	(6, 6, 2, '2026-09-20', '2026-10-04', NULL),
	(7, 2, 4, '2026-09-01', '2026-09-15', '2026-09-14');
```
:::

To load it:

1. Copy the whole script and save it in your `sql-practice` folder as a file called `library.sql`.
2. Open a terminal in that folder and start the shell with your database: `sqlite3 library.db`
3. At the `sqlite>` prompt, type:

```text
.read library.sql
```

`.read` runs every statement in a file, one after another, as if you'd typed them all. When it finishes, your database is stocked. Because it's saved in `library.db`, you only have to do this once. (If you ever want to start over, quit, delete `library.db`, and run `.read library.sql` again.)

## Looking around: dot-commands

Before asking questions, it helps to see what's there. The shell has **dot-commands** for that. Remember, these aren't SQL: they start with a dot, need no semicolon, and only work in the `sqlite3` shell.

**`.tables`** lists every table:

```text
sqlite> .tables
books     loans     members
```

**`.schema`** shows how a table was created: its columns and their types.

```text
sqlite> .schema members
CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER, joined TEXT);
```

**`.mode table`** makes results look like neat tables with column headings, which is how every result on Syntaxia is shown. Run it once each time you open the shell:

```text
sqlite> .mode table
```

Without it, the shell shows results as bare values separated by `|`, which is compact but harder to read.

## Your first query

Now ask the library something. The simplest question is "show me everything in a table":

```sql
SELECT * FROM members;
```

```text
+----+--------------+-------+------------+
| id |     name     | grade |   joined   |
+----+--------------+-------+------------+
|  1 | Maria Santos |    11 | 2025-06-10 |
|  2 | Ben Cruz     |    10 | 2025-06-12 |
|  3 | Carlo Reyes  |    11 | 2025-07-01 |
|  4 | Dina Lim     |     9 | 2026-01-15 |
|  5 | Eli Tan      |    12 | 2026-02-20 |
+----+--------------+-------+------------+
```

`SELECT` asks a question, `*` means "every column," and `FROM members` says which table. You'll take this apart properly in the next lesson, [SELECT: Reading Data](/lessons/sqlite3/select).

## A few rules of SQL

Three things to know before you write more:

- **End every statement with a semicolon.** It tells SQLite "I'm done, run this." Without it, the shell shows `...>` and waits for more.
- **Keywords don't care about capitals.** `select * from members;` works exactly like `SELECT * FROM members;`. By convention, keywords are written in capitals so they stand out.
- **Text goes in single quotes**, like `'Maria Santos'`. Numbers don't need quotes.

You can spread one statement over several lines, which helps with longer ones. And two dashes start a comment, which SQLite ignores:

```sql
-- Who joined the library this year?
SELECT name, joined
FROM members
WHERE joined >= '2026-01-01';
```

```text
+----------+------------+
|   name   |   joined   |
+----------+------------+
| Dina Lim | 2026-01-15 |
| Eli Tan  | 2026-02-20 |
+----------+------------+
```

(`WHERE` filters the rows, and gets its own lesson soon: [Filtering Rows with WHERE](/lessons/sqlite3/where).)

## It remembers

Here's the real difference from the variables and lists you might know from Python or JavaScript. Type `.quit`, then open the database again with `sqlite3 library.db`. Run `SELECT * FROM members;` again, and everything is still there. The data lives in the `library.db` file, not in the shell's memory.

## Try it

This creates a small table of loans and runs three different queries. The editor starts with the table so it can run on its own. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, first.sql"
	min-height="360px"
	:model-value="'CREATE TABLE loans (id INTEGER PRIMARY KEY, book TEXT, member TEXT, due_date TEXT, returned TEXT);\n\nINSERT INTO loans VALUES\n\t(1, \'Noli Me Tangere\', \'Maria Santos\', \'2026-09-15\', \'yes\'),\n\t(2, \'Noli Me Tangere\', \'Ben Cruz\', \'2026-09-26\', \'no\'),\n\t(3, \'The Little Prince\', \'Maria Santos\', \'2026-09-29\', \'no\');\n\n-- Query 1\nSELECT * FROM loans;\n\n-- Query 2\nSELECT member, book FROM loans;\n\n-- Query 3\nSELECT book FROM loans WHERE returned = \'no\';\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+----+-------------------+--------------+------------+----------+
| id |       book        |    member    |  due_date  | returned |
+----+-------------------+--------------+------------+----------+
|  1 | Noli Me Tangere   | Maria Santos | 2026-09-15 | yes      |
|  2 | Noli Me Tangere   | Ben Cruz     | 2026-09-26 | no       |
|  3 | The Little Prince | Maria Santos | 2026-09-29 | no       |
+----+-------------------+--------------+------------+----------+
+--------------+-------------------+
|    member    |       book        |
+--------------+-------------------+
| Maria Santos | Noli Me Tangere   |
| Ben Cruz     | Noli Me Tangere   |
| Maria Santos | The Little Prince |
+--------------+-------------------+
+-------------------+
|       book        |
+-------------------+
| Noli Me Tangere   |
| The Little Prince |
+-------------------+
```

Query 1 shows every column. Query 2 shows only two columns, in the order you asked for them, member first. Query 3 keeps only the loans that haven't been returned, and shows just the book.
:::

## Try it yourself

1. Load the library script into your own `library.db`, then run `.tables` and `.schema books`. How many columns does `books` have?
2. Run `SELECT * FROM loans;` in your library database. Which loans have no returned date yet? What does the shell show in that spot?
3. Write a query that shows just the `title` and `author` of every book.

## Check your understanding

<Quiz
	question="What does the dot-command .tables do?"
	:options="['Creates a new table', 'Lists every table in the database', 'Deletes every table', 'Shows every row']"
	:answer-index="1"
	explanation="Dot-commands control the sqlite3 shell. .tables lists the tables, and .schema shows how a table was built."
/>

<Quiz
	question="Which statement shows every column of every row in the members table?"
	:options="['SHOW members;', 'SELECT members;', 'SELECT * FROM members;', 'GET * members;']"
	:answer-index="2"
	explanation="SELECT asks a question, * means every column, and FROM names the table."
/>

<Quiz
	question="You close the shell and reopen library.db. What happened to your tables?"
	:options="['They are still there, saved in the database file', 'They are gone, because the shell only keeps data in memory', 'Only the table names are left', 'They were moved to a backup file']"
	:answer-index="0"
	explanation="A SQLite database is a file on disk, so everything you create in it stays until you delete it."
/>

## Up next

You've stocked the shelves and asked your first question. Next, you'll learn everything `SELECT` can do: choosing columns, calculating new ones, and removing duplicates, in [SELECT: Reading Data](/lessons/sqlite3/select).
