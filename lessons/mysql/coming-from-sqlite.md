---
title: "From SQLite to MySQL: Servers, Clients, and Key Differences"
description: "Already know SQL from SQLite? Learn how MySQL's server and client model works, and the differences that trip people up: types, quotes, ||, and case."
---

# Coming from SQLite: Servers and Clients

*SQLite is a notebook in your bag. MySQL is the school library: one building, many visitors, and a librarian at the desk.*

This track assumes you already know the SQL basics. They're taught once, in the SQLite3 track's **SQL Foundations** chapter, starting with [SELECT: Reading Data](/lessons/sqlite3/select). If you haven't worked through that chapter yet, start there. Almost everything you learn in it works in MySQL exactly as written.

This lesson is the bridge. It covers the one big idea that makes MySQL feel different from SQLite, the **server**, and then the handful of SQL differences that catch people moving from one to the other.

## A notebook and a library

A notebook in your bag is wonderfully simple. It's always with you, you open it and write, and nobody else is involved. But only one person uses it at a time, and if you want to share it, you have to hand over the whole notebook.

A school library works differently. The books live in one building. A librarian at the desk looks after them. Hundreds of students can ask for books at the same time, and the librarian decides who's allowed into which sections. You never walk into the stacks yourself; you ask at the desk, and the librarian brings back what you asked for.

- **SQLite** is the notebook. The whole database is a single file, and your program opens that file directly.
- **MySQL** is the library. The data lives inside a **server**, a program that runs all the time in the background. Your program, or you at a terminal, is a **client** that sends requests to the server and gets results back.

That's why you'll install MySQL as a service, connect to it with a username and password, and why many people and programs can use the same database at once.

## The server and its clients

Here's what the library looks like in MySQL's terms:

- The **MySQL server** runs on a computer, often a different one from yours. It stores the data, runs every query, and checks who's allowed to do what.
- A **client** is anything that connects to the server: the `mysql` command-line tool, a visual tool like MySQL Workbench, or a program you write in [PHP](/lessons/mysql/mysql-in-php) or another language.
- To connect, a client needs four things: the server's **host** (its address, `localhost` if it's on your own computer), the **port** (MySQL's default is `3306`), a **username**, and a **password**.

From a terminal, connecting looks like this:

```text
mysql -u root -p
```

`-u root` gives the username, and `-p` tells the client to ask for your password. Once you're in, the prompt changes to `mysql>`, and you type SQL just like in the `sqlite3` shell. [Connecting with the mysql Client and Workbench](/lessons/mysql/connecting) walks through this step by step once MySQL is installed.

## One server, many databases

In SQLite, one file is one database. A MySQL server holds **many** databases at once, side by side, like different sections of the library. You create one, then tell the server which one you want to work in:

```sql
CREATE DATABASE school_library;
USE school_library;
```

After `USE school_library;`, every table name you write means a table in the `school_library` database. And because the server has many users, it also keeps track of **permissions**: who may read, change, or delete what, down to single tables. SQLite has nothing like that, since anyone who can open the file can do anything with it. You'll set permissions up in [Users and Privileges](/lessons/mysql/users-and-privileges).

The `sqlite3` shell's dot-commands don't exist here, either. MySQL uses SQL-style commands instead:

| To do this | sqlite3 shell | MySQL |
|---|---|---|
| List the tables | `.tables` | `SHOW TABLES;` |
| See a table's columns | `.schema books` | `DESCRIBE books;` |
| List the databases | (one file is one database) | `SHOW DATABASES;` |
| Quit | `.quit` | `EXIT` |

## What stays the same

The good news first. Everything in the SQL Foundations chapter works in MySQL unchanged:

- `SELECT`, `WHERE`, `ORDER BY`, and `LIMIT`
- `NULL` and `IS NULL`
- aggregates like `COUNT`, `SUM`, and `AVG`, with `GROUP BY` and `HAVING`
- joins and subqueries
- `INSERT`, `UPDATE`, and `DELETE`

If a query from the SQLite track uses only those, you can paste it into MySQL and it will run.

## Five differences that trip people up

These are the differences you'll hit first, and each one has caught out plenty of experienced developers.

**1. Types are enforced.** SQLite is famously relaxed about types: it will happily store the text `'abc'` in a column declared as a whole number. MySQL, in its normal strict mode, refuses with an error. That's good news: bad data gets stopped at the door instead of discovered months later. It also means you choose column types more carefully, which is what [Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types) covers.

**2. `||` does not join text.** In SQLite, `'Noli' || ' Me Tangere'` joins two pieces of text. In MySQL, by default, `||` means *logical OR*, the same as `OR`. Neither piece of text is a true or false value, so the result is `0`, with a warning. Use the `CONCAT` function instead:

```sql
SELECT CONCAT(title, ' by ', author) AS label FROM books;
```

**3. Quotes mean different things.** Single quotes are for text in both databases, so keep doing that. But in MySQL, double quotes are *also* treated as text, not as names. If a table or column name needs quoting (because it contains a space, or clashes with a keyword), MySQL uses **backticks**: `` `published year` ``. The simplest fix is to choose names that never need quoting.

**4. Text comparisons ignore capital letters.** In SQLite, `WHERE author = 'jose rizal'` finds nothing if the table says `Jose Rizal`. In MySQL, with the default settings, it finds the row, because text is compared without caring about capitals. That's often convenient, but it surprises people who expect an exact match. [Character Sets and utf8mb4](/lessons/mysql/character-sets) explains the setting behind it, called a **collation**.

**5. Dividing whole numbers gives a decimal.** In SQLite, `7 / 2` is `3`, because dividing two whole numbers throws away the fraction. In MySQL, it's `3.5000`: MySQL does decimal division and shows four decimal places by default.

## Auto-numbered keys

One more difference shows up in almost every table you'll create. In SQLite, a column declared as `INTEGER PRIMARY KEY` numbers itself automatically. MySQL asks you to say so explicitly with `AUTO_INCREMENT`:

```sql
CREATE TABLE books (
	id INT AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(200) NOT NULL,
	author VARCHAR(100) NOT NULL
);
```

`VARCHAR(200)` means "text, up to 200 characters." You'll see why MySQL wants those limits in [Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types), and all about automatic numbering in [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment).

## Try it

Here are four queries, all run against the same `books` table from the SQLite track: six books, including two novels by Jose Rizal. Each one gives a *different* answer in SQLite and MySQL. For each query, predict both answers before you check.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, compare.sql"
	min-height="300px"
	:model-value="'-- Query 1\nSELECT 7 / 2;\n\n-- Query 2\nSELECT \'Noli\' || \' Me Tangere\';\n\n-- Query 3\nSELECT COUNT(*) FROM books WHERE author = \'jose rizal\';\n\n-- Query 4\nSELECT &quot;title&quot; FROM books WHERE id = 1;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once you've installed it (see [Installing MySQL Server](/lessons/mysql/setting-up)), you can run all four queries in the `mysql` client and check each answer yourself.
:::

::: details Check your prediction
| Query | SQLite | MySQL |
|---|---|---|
| 1: `7 / 2` | `3` | `3.5000` |
| 2: `'Noli' \|\| ' Me Tangere'` | `Noli Me Tangere` | `0`, with a warning |
| 3: `author = 'jose rizal'` | `0` | `2` |
| 4: `"title"` | `Noli Me Tangere` | `title` |

Query 1: SQLite drops the fraction when dividing whole numbers, and MySQL keeps it. Query 2: in MySQL, `||` means OR, so use `CONCAT` to join text. Query 3: MySQL's default comparison ignores capitals, so both Rizal novels match. Query 4 is the sneakiest. SQLite reads `"title"` as the column name. MySQL reads it as the text `title`, so you get that word back instead of the book's title.
:::

## Try it yourself

1. Rewrite Query 2 so it works in MySQL and gives `Noli Me Tangere`.
2. Rewrite Query 4 so MySQL returns the actual title. There are two ways: one with no quotes at all, and one with backticks.
3. Write down, in your own words, one advantage of SQLite's "notebook" approach and one advantage of MySQL's "library" approach. When would you pick each?

## Check your understanding

<Quiz
	question="What is the biggest difference between how SQLite and MySQL store a database?"
	:options="['MySQL cannot store text', 'SQLite is a single file your program opens directly, while MySQL runs as a server that clients connect to', 'SQLite needs a username and password', 'There is no difference']"
	:answer-index="1"
	explanation="SQLite is serverless: the database is one file. MySQL is a server program that many clients can connect to at once, each with its own username and permissions."
/>

<Quiz
	question="How do you join the text in the title and author columns in MySQL?"
	:options="['title || author', 'CONCAT(title, author)', 'title + author', 'title &amp; author']"
	:answer-index="1"
	explanation="In MySQL, || means logical OR by default, so it does not join text. CONCAT joins any number of values."
/>

<Quiz
	question="A MySQL table has the author Jose Rizal. With default settings, does WHERE author = 'JOSE RIZAL' match it?"
	:options="['No, the capitals must match exactly', 'Only if you use double quotes', 'It causes an error', 'Yes, because MySQL compares text without caring about capitals by default']"
	:answer-index="3"
	explanation="MySQL's default collation compares text case-insensitively, unlike SQLite, where the capitals must match."
/>

## Up next

You know how MySQL is different. Now let's get a server running on your computer, in [Installing MySQL Server](/lessons/mysql/setting-up).
