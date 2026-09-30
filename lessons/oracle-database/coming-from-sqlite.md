---
title: "From SQLite to Oracle Database: What's Different"
description: "Already know SQL from SQLite? Learn what changes in Oracle Database: schemas, VARCHAR2 and NUMBER, FETCH FIRST instead of LIMIT, and empty strings as NULL."
---

# Coming from SQLite: What's Different in Oracle

*SQLite is a notebook in your bag. Oracle is a city hall records office: official forms, careful procedures, and nothing is final until it's stamped.*

This track assumes you already know the SQL basics. They're taught once, in the SQLite3 track's **SQL Foundations** chapter, starting with [SELECT: Reading Data](/lessons/sqlite3/select). If you haven't worked through that chapter yet, start there. Most of it works in Oracle exactly as written.

This lesson is the bridge. It covers how Oracle is organized, the differences in everyday SQL that catch people moving over from SQLite, and a first look at **PL/SQL**, the programming language built into Oracle, which gets a whole chapter later in this track.

## A notebook and a records office

A notebook is simple: you open it, write, and close it. Nobody checks your handwriting, and nothing needs approval.

A city hall records office handles millions of records for thousands of people. Every record goes on an official form with fixed boxes. Different staff are allowed to see different drawers. And a change isn't official the moment someone writes it down; it becomes official when it's stamped and filed. Until then, it can be torn up and started over.

Oracle Database is built for that kind of work: banks, airlines, hospitals, and governments, where many people use the same data at once and mistakes are expensive. That's why it's stricter than SQLite in several ways, and why it has a few habits of its own.

## How Oracle is organized

Like [MySQL](/lessons/mysql/coming-from-sqlite), Oracle runs as a **server**, and you connect to it as a **client** with a username and password. But the way it groups tables is different from both SQLite and MySQL:

- In SQLite, one file is one database.
- In MySQL, one server holds many databases, and you pick one with `USE`.
- In Oracle, each **user** owns a **schema**: their own set of tables and other objects. When you log in as a user, the tables you create go into that user's schema.

So in Oracle, "my tables" really does mean the tables belonging to your user. Another user's table is written with their name in front, like `library.books`, and you can only use it if you've been given permission. [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users) goes deeper. For the exercises in this track, you'll work in your own schema.

## What stays the same

Most of what you learned in SQL Foundations carries straight over:

- `SELECT`, `WHERE`, and `ORDER BY`
- `NULL` and `IS NULL`
- aggregates like `COUNT`, `SUM`, and `AVG`, with `GROUP BY` and `HAVING`
- joins and subqueries
- `INSERT`, `UPDATE`, and `DELETE`
- joining text with `||`, which works in Oracle exactly like in SQLite

## Six differences that trip people up

**1. There's no `LIMIT`.** To get only the first few rows, Oracle uses the standard SQL `FETCH FIRST` clause instead, after `ORDER BY`:

```sql
SELECT title, published_year
FROM books
ORDER BY published_year
FETCH FIRST 2 ROWS ONLY;
```

Older Oracle code often uses a different trick with a special value called `ROWNUM`. You'll meet both in [Top-N Queries: ROWNUM and FETCH FIRST](/lessons/oracle-database/top-n-queries).

**2. An empty string is `NULL`.** This one is unique to Oracle, and it surprises everyone. In SQLite, `''` (text with nothing in it) and `NULL` (no value at all) are two different things. In Oracle, they're the same: store `''` in a column, and Oracle stores `NULL`. That means `WHERE genre = ''` never matches anything, because nothing is ever equal to `NULL`. To find empty values, use `WHERE genre IS NULL`. [Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings) covers the consequences.

**3. Different data types.** Oracle has its own names for the common types, and it expects you to use them:

| For | SQLite | Oracle |
|---|---|---|
| Text | `TEXT` | `VARCHAR2(n)`, with a maximum length |
| Numbers, whole or decimal | `INTEGER`, `REAL` | `NUMBER`, or `NUMBER(p, s)` for a fixed size |
| Dates | stored as text or numbers | `DATE`, which always includes a time of day |

And like MySQL, Oracle enforces types: putting `'abc'` into a `NUMBER` column is an error, not a quiet surprise. [Oracle Data Types](/lessons/oracle-database/data-types) explains each one.

**4. Names are stored in capitals.** Write `CREATE TABLE books (title VARCHAR2(200))`, and Oracle records the table as `BOOKS` and the column as `TITLE`. You can still type them in any case, because Oracle converts unquoted names to capitals before looking them up. The trap is double quotes: `"title"` in quotes means *exactly* lowercase `title`, which is a different name from `TITLE`. The easy rule: never put table or column names in double quotes.

**5. Dividing whole numbers gives a decimal.** In SQLite, `7 / 2` is `3`. In Oracle, it's `3.5`.

**6. Nothing is final until you `COMMIT`.** This is the records office's stamp. In Oracle's own tools, like SQL*Plus, SQLcl, and SQL Developer, your `INSERT`, `UPDATE`, and `DELETE` changes are only visible to you until you run `COMMIT`. If you close the tool without committing, the changes can be thrown away. `ROLLBACK` tears them up on purpose. Build the habit early: change, check, then `COMMIT`. [Transactions](/lessons/oracle-database/transactions) covers it properly.

## New releases, older habits

Oracle's newest release, **Oracle AI Database 26ai**, adds several conveniences that older versions don't have:

- A `SELECT` doesn't need a table at all: `SELECT 7 / 2;` just works. Older versions require a `FROM` clause, so they use a special one-row table called `DUAL`: `SELECT 7 / 2 FROM DUAL;`. You'll see `FROM DUAL` all over existing Oracle code.
- There's a real `BOOLEAN` column type for true and false. Older versions usually store `1` and `0` in a `NUMBER` column instead.
- A single `INSERT` can add several rows with one `VALUES` list, like in SQLite. Older versions need one `INSERT` per row.

Many companies and schools still run older releases, such as 19c. This track teaches the newest release, and points out the older way wherever you're likely to run into it.

## A first look at PL/SQL

SQL asks the database questions. **PL/SQL** lets you write whole programs that run *inside* the database, with variables, `IF` statements, and loops, all mixed with SQL:

```sql
BEGIN
	DBMS_OUTPUT.PUT_LINE('Hello from inside Oracle!');
END;
/
```

This is a PL/SQL **block**. `BEGIN` and `END;` wrap the code, `DBMS_OUTPUT.PUT_LINE` prints a line (think of it as Oracle's `print`), and the `/` on its own line tells tools like SQL*Plus to run the block. SQLite has nothing like this: in SQLite, that kind of logic has to live in the program that uses the database. You'll write real PL/SQL starting with [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks).

## Try it

These statements run against the same `books` table from the SQLite track: six books, all with a genre filled in. First, a seventh book is added with an empty genre. Then four queries. For each query, predict the answer in SQLite and in Oracle before you check.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, compare.sql"
	min-height="340px"
	:model-value="'INSERT INTO books (id, title, author, genre, published_year, copies_owned, copies_on_loan)\nVALUES (7, \'The Secret Book\', \'Anonymous\', \'\', 2020, 1, 0);\n\n-- Query 1\nSELECT COUNT(*) FROM books WHERE genre IS NULL;\n\n-- Query 2\nSELECT COUNT(*) FROM books WHERE genre = \'\';\n\n-- Query 3\nSELECT COUNT(*) FROM books WHERE author = \'jose rizal\';\n\n-- Query 4\nSELECT title FROM books ORDER BY published_year FETCH FIRST 2 ROWS ONLY;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Oracle offers free ways to run it, including a browser-based playground called FreeSQL, and [Getting an Oracle Database](/lessons/oracle-database/setting-up) walks through your options.
:::

::: details Check your prediction
| Query | SQLite | Oracle |
|---|---|---|
| 1: `genre IS NULL` | `0` | `1` |
| 2: `genre = ''` | `1` | `0` |
| 3: `author = 'jose rizal'` | `0` | `0` |
| 4: `FETCH FIRST 2 ROWS ONLY` | a syntax error | `Noli Me Tangere`, `El Filibusterismo` |

Queries 1 and 2 are the empty-string rule. SQLite stored the empty text as-is, so it counts as `= ''` but not as `NULL`. Oracle stored `NULL` instead, which is why `IS NULL` finds it and `= ''` finds nothing. Query 3 is a trick: both databases compare text with capitals exactly, so neither finds `jose rizal` (MySQL would have found both books). Query 4: SQLite doesn't understand `FETCH FIRST` and uses `LIMIT 2` instead, while Oracle returns the two oldest books.
:::

## Try it yourself

1. Rewrite Query 4 so it works in SQLite.
2. A form lets people leave the "middle name" field blank, and the program saves `''` for anyone who does. How would you count the people with no middle name in Oracle? Would the same query work in SQLite?
3. You connect to an Oracle database, run an `UPDATE`, see the change in your results, then close your tool without typing anything else. Explain why a colleague might never see your change.

## Check your understanding

<Quiz
	question="How do you get only the first 5 rows of a sorted result in Oracle?"
	:options="['LIMIT 5', 'FETCH FIRST 5 ROWS ONLY', 'TOP 5', 'ROWS 5']"
	:answer-index="1"
	explanation="Oracle uses the standard FETCH FIRST clause after ORDER BY. It does not support LIMIT."
/>

<Quiz
	question="In Oracle, you insert a row with the empty string '' in a text column. What is stored?"
	:options="['An empty string, just like SQLite', 'NULL', 'A single space', 'Nothing, because the insert fails']"
	:answer-index="1"
	explanation="Oracle treats an empty string as NULL. Use IS NULL, not = '', to find those rows."
/>

<Quiz
	question="You ran an UPDATE in SQL Developer and haven't typed anything else. What makes the change permanent?"
	:options="['Nothing, it is already permanent', 'Closing SQL Developer', 'Running SELECT to check it', 'Running COMMIT']"
	:answer-index="3"
	explanation="In Oracle's tools, changes are part of a transaction until you COMMIT. Until then, only your session sees them, and they can be rolled back."
/>

## Up next

Time to get an Oracle database of your own to practice on, in [Getting an Oracle Database](/lessons/oracle-database/setting-up).
