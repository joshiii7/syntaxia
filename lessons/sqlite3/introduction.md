---
title: "What Is SQLite? An Introduction to SQLite for Beginners"
description: "Find out what SQLite is, why it's the most widely used database in the world, where it runs, and why it's the perfect way to learn SQL from scratch."
---

# What SQLite Is and Why It's Used

*Some databases are huge buildings with staff and security. SQLite is a notebook that fits in your pocket, and it goes everywhere with you.*

Welcome to the SQLite3 track. Up to now on Syntaxia, the data in your programs has lived in variables and lists, and vanished when the program ended, or sat in files you had to take apart line by line. Real apps keep their data in a **database**: a program built specifically for storing information safely, and finding it again fast.

This track teaches you to work with databases using **SQL**, the language almost every database speaks, starting with the friendliest database there is: **SQLite**.

## A notebook in your pocket

Picture two ways to keep records. One is a big city records office, with a building, staff at the desk, and a process for everything. The other is a sturdy notebook in your pocket. The records office is great for a whole city. For almost everything else, the notebook is simpler: no appointment, no staff, you just open it and write.

Most famous databases, like MySQL and Oracle, are the records office. They run as **servers**: programs that stay running in the background, which other programs connect to over a network.

SQLite is the notebook. There's no server at all. A whole SQLite database, with all its tables and data, is **one single file** on your computer. A program that wants to use it just opens the file, the way it would open any other file. That's why SQLite is called **serverless**.

## Where you'll find SQLite

SQLite is quite possibly the most widely used database in the world, even though most people have never heard of it, because it hides inside other software:

- **Your phone.** Android and iPhone apps use SQLite to store contacts, messages, and settings on the device.
- **Your web browser.** Browsers keep your history and bookmarks in SQLite databases.
- **Desktop apps.** Plenty of programs, from photo managers to music players, use SQLite files to remember your library.
- **Small websites and tools.** For a site without huge traffic, a single SQLite file is often all the database it needs.
- **Python.** Python comes with SQLite built in, through its `sqlite3` module, so any Python program can use a database with no setup at all. You'll try it in [Using SQLite from Python](/lessons/sqlite3/sqlite-in-python).

## SQLite, SQLite3, and SQL

Three names, three different things:

- **SQL** (often said "sequel," or spelled out, "S-Q-L") is the **language** you use to talk to a database: to create tables, add data, and ask questions. It stands for Structured Query Language.
- **SQLite** is a particular **database** that understands SQL.
- **SQLite3** means version 3 of SQLite, which is the version everyone has used for about twenty years. The command-line program you'll install is called `sqlite3`, and so is Python's module.

The good news: most of the SQL you learn here works in every major database. The [MySQL](/lessons/mysql/coming-from-sqlite) and [Oracle Database](/lessons/oracle-database/coming-from-sqlite) tracks on Syntaxia start from this track's SQL Foundations chapter, and only teach what's different.

## Why learn SQL with SQLite?

- **Nothing to set up.** No server to install, start, or log in to. One small program, and a database is just a file.
- **Real SQL.** The SQL you write here is the same language professionals use every day.
- **It's everywhere.** Knowing SQLite is directly useful for phone apps, Python scripts, and small websites.
- **It's easy to share.** Want to send someone your whole database? Send them the file.

The trade-off: SQLite isn't built for thousands of people writing to the same database at once, the way a busy online store needs. For that, a server database like MySQL fits better. For learning, and for a huge number of real projects, SQLite is exactly right.

## What SQL looks like

Here's a taste. This asks a library database for the titles of every book by one author:

```sql
SELECT title FROM books WHERE author = 'Jose Rizal';
```

Even without knowing SQL, you can probably guess what it does. SQL was designed to read a lot like English. You'll write your first query in [Your First Queries](/lessons/sqlite3/first-queries).

## Try it

The editor below creates a tiny table of three books, adds them, and asks for all of them back. You don't need to understand every line yet. Read it, and predict what the result will show.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, library.sql"
	min-height="220px"
	:model-value="'CREATE TABLE books (title TEXT, author TEXT, published_year INTEGER);\n\nINSERT INTO books VALUES\n\t(\'Noli Me Tangere\', \'Jose Rizal\', 1887),\n\t(\'El Filibusterismo\', \'Jose Rizal\', 1891),\n\t(\'Cosmos\', \'Carl Sagan\', 1980);\n\nSELECT * FROM books;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. In [Setting Up](/lessons/sqlite3/setting-up), you'll install SQLite on your own computer, so you can run queries like this yourself.
:::

::: details Check your prediction
```text
+-------------------+------------+----------------+
|       title       |   author   | published_year |
+-------------------+------------+----------------+
| Noli Me Tangere   | Jose Rizal |           1887 |
| El Filibusterismo | Jose Rizal |           1891 |
| Cosmos            | Carl Sagan |           1980 |
+-------------------+------------+----------------+
```

`SELECT *` means "every column," so the result shows all three books with all three columns, laid out as a table.
:::

## Try it yourself

1. What would you change in the `SELECT` line to show only the titles? Write down your guess.
2. Add a fourth book to the `INSERT` list, copying the shape of the other lines exactly, including the commas between them.
3. Think of an app you use every day. What tables of data do you think it keeps? Write down one table and three of its columns.

## Check your understanding

<Quiz
	question="What makes SQLite different from databases like MySQL?"
	:options="['It does not use SQL', 'It only works on phones', 'It is serverless: the whole database is one file that programs open directly', 'It cannot store text']"
	:answer-index="2"
	explanation="MySQL and Oracle run as servers that programs connect to. SQLite has no server; a database is a single file."
/>

<Quiz
	question="What is SQL?"
	:options="['The language used to create, change, and ask questions of a database', 'A kind of database file', 'A company that makes databases', 'A Python module']"
	:answer-index="0"
	explanation="SQL is the language. SQLite, MySQL, and Oracle are databases that understand it."
/>

<Quiz
	question="Which of these is a good fit for SQLite?"
	:options="['A huge online store with thousands of people buying at once', 'A bank handling millions of transactions a second', 'None, SQLite is only for learning', 'A phone app that stores its own settings and saved items']"
	:answer-index="3"
	explanation="SQLite shines when one program owns the data, like an app on a phone. Very busy, many-writer systems fit a server database better."
/>

## Up next

Before writing SQL, it helps to know what a database actually is, and how tables, rows, and columns fit together. That's [Databases, Tables, and SQL](/lessons/sqlite3/databases-and-sql).
