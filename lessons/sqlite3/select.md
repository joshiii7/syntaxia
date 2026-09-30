---
title: "SQL SELECT: Read Data from a Database Table"
description: "Read data with SQL's SELECT statement: choose columns, calculate new ones, rename them with AS, and remove duplicates with DISTINCT, using a library database."
---

# SELECT: Reading Data

*A librarian doesn't hand you the whole library. You ask for exactly what you want, and that's what comes back.*

A database is only useful if you can get information back out of it. Which books do we own? Who wrote them? How many copies are on the shelf right now? Every one of those questions is answered with the most-used statement in all of SQL: **`SELECT`**.

This lesson is the start of the **SQL Foundations** chapter. Almost everything in it works the same way in every major database, including the [MySQL](/lessons/mysql/coming-from-sqlite) and [Oracle Database](/lessons/oracle-database/coming-from-sqlite) tracks, which link back here. The few places where databases differ are pointed out as they come up.

## Asking the librarian

Imagine a library's catalog as one enormous spreadsheet: a row for every book, and columns for the title, the author, the year it was published, and so on. You walk up to the librarian's desk and say:

"Could I see the title and author of every book, please?"

The librarian doesn't carry the whole catalog over. They write down just those two columns for you. The catalog itself isn't changed or moved; you get a copy of the part you asked for.

A `SELECT` statement is that request, written in a way the database understands.

## The library table

Every example in this lesson uses the same table, called `books`:

```text
+----+-----------------------------+--------------------------+---------+----------------+--------------+----------------+
| id |            title            |          author          |  genre  | published_year | copies_owned | copies_on_loan |
+----+-----------------------------+--------------------------+---------+----------------+--------------+----------------+
|  1 | Noli Me Tangere             | Jose Rizal               | Novel   |           1887 |            4 |              3 |
|  2 | El Filibusterismo           | Jose Rizal               | Novel   |           1891 |            3 |              1 |
|  3 | The Little Prince           | Antoine de Saint-Exupery | Novel   |           1943 |            5 |              2 |
|  4 | A Brief History of Time     | Stephen Hawking          | Science |           1988 |            2 |              2 |
|  5 | Cosmos                      | Carl Sagan               | Science |           1980 |            2 |              0 |
|  6 | Smaller and Smaller Circles | F. H. Batacan            | Mystery |           2002 |            3 |              1 |
+----+-----------------------------+--------------------------+---------+----------------+--------------+----------------+
```

Each **row** is one book. Each **column** is one piece of information about every book. You'll learn how to create a table like this in [Creating Tables](/lessons/sqlite3/create-table). For now, it's already there, waiting to be asked.

## Choosing columns

Here's the librarian request from earlier, in SQL:

```sql
SELECT title, author FROM books;
```

```text
+-----------------------------+--------------------------+
|            title            |          author          |
+-----------------------------+--------------------------+
| Noli Me Tangere             | Jose Rizal               |
| El Filibusterismo           | Jose Rizal               |
| The Little Prince           | Antoine de Saint-Exupery |
| A Brief History of Time     | Stephen Hawking          |
| Cosmos                      | Carl Sagan               |
| Smaller and Smaller Circles | F. H. Batacan            |
+-----------------------------+--------------------------+
```

Read it almost like English: "select the title and author from books."

- `SELECT` starts the request.
- `title, author` lists the columns you want, separated by commas, in the order you want them.
- `FROM books` says which table to look in.
- The semicolon `;` ends the statement.

What comes back is called a **result set**. It looks like a table, but it's a temporary answer, not a new table saved in the database. Run the query again tomorrow, and you'll get whatever the table holds tomorrow.

The column order is up to you. `SELECT author, title FROM books;` gives the same information with the author first.

## Every column: `*`

To see every column, use an asterisk instead of a list of names:

```sql
SELECT * FROM books;
```

The asterisk means "all columns, in the order the table defines them." That's the full table shown above.

`SELECT *` is great for a quick look at a table you haven't seen before. In real programs, though, list the columns you actually need. It makes the query say what it's for, it sends less data, and it doesn't quietly change what your program receives if someone adds a column to the table later.

## Calculating new columns

A `SELECT` can do more than copy columns. It can calculate new ones, row by row. How many copies of each book are on the shelf right now?

```sql
SELECT title, copies_owned - copies_on_loan FROM books;
```

```text
+-----------------------------+-------------------------------+
|            title            | copies_owned - copies_on_loan |
+-----------------------------+-------------------------------+
| Noli Me Tangere             |                             1 |
| El Filibusterismo           |                             2 |
| The Little Prince           |                             3 |
| A Brief History of Time     |                             0 |
| Cosmos                      |                             2 |
| Smaller and Smaller Circles |                             2 |
+-----------------------------+-------------------------------+
```

For each row, the database subtracts that book's loans from that book's copies. The table itself doesn't change. The calculation only exists in the answer.

You can use `+`, `-`, `*`, and `/`, and mix columns with plain numbers, like `copies_owned * 2`. (One quirk to know about: in SQLite, dividing one whole number by another gives a whole number, so `7 / 2` is `3`. MySQL and Oracle give `3.5`. You'll see how to handle that in [Built-in Functions](/lessons/sqlite3/functions).)

## Renaming columns: `AS`

That calculated column has a clumsy heading. Give it a better one with **`AS`**:

```sql
SELECT title, copies_owned - copies_on_loan AS copies_available FROM books;
```

```text
+-----------------------------+------------------+
|            title            | copies_available |
+-----------------------------+------------------+
| Noli Me Tangere             |                1 |
| El Filibusterismo           |                2 |
| The Little Prince           |                3 |
| A Brief History of Time     |                0 |
| Cosmos                      |                2 |
| Smaller and Smaller Circles |                2 |
+-----------------------------+------------------+
```

The new name is called an **alias**. It only renames the column in this answer; the table is untouched. Aliases work on plain columns too: `SELECT published_year AS year FROM books;`.

Stick to letters, digits, and underscores in aliases, like `copies_available`. Names with spaces need special quoting, and the quoting rules differ between databases.

## Removing duplicates: `DISTINCT`

Which genres does the library have?

```sql
SELECT genre FROM books;
```

```text
+---------+
|  genre  |
+---------+
| Novel   |
| Novel   |
| Novel   |
| Science |
| Science |
| Mystery |
+---------+
```

That's one row per book, so every genre repeats. Add **`DISTINCT`** right after `SELECT`, and each different value appears only once:

```sql
SELECT DISTINCT genre FROM books;
```

```text
+---------+
|  genre  |
+---------+
| Novel   |
| Science |
| Mystery |
+---------+
```

With more than one column, `DISTINCT` removes rows where *every* selected column matches. `SELECT DISTINCT author, genre FROM books;` would list Jose Rizal only once, because both of his books are novels.

## How SQL is written

A few conventions you'll see in every SQL lesson and in real projects:

- **Keywords in capitals.** `SELECT`, `FROM`, and `DISTINCT` are written in capitals, and table and column names in lowercase. SQL itself doesn't care (`select title from books;` works too), but the capitals make the structure easy to see.
- **One clause per line for longer queries.** SQL ignores line breaks, so this is the same query as before, just easier to read:

```sql
SELECT
	title,
	copies_owned - copies_on_loan AS copies_available
FROM books;
```

- **Text in single quotes.** Write text values like `'Novel'`, with single quotes. You'll need that in the very next lesson. Double quotes mean something different in most databases, so don't use them for text.
- **Comments start with two dashes.** Everything after `--` on a line is ignored:

```sql
-- Which books are out right now?
SELECT title, copies_on_loan FROM books;  -- on loan, not on the shelf
```

## One thing `SELECT` doesn't promise: order

Look back at the results so far. They came out in `id` order, but that's a coincidence of how this small table was stored. SQL makes **no promise** about row order unless you ask for one, and on a bigger or busier table, the order can change from one run to the next. If the order matters, say so with `ORDER BY`, which is exactly what [Sorting and Limiting Results](/lessons/sqlite3/order-by-and-limit) covers.

## Try it

The editor below creates the `books` table and fills it with the same six books, then runs three queries. Predict the result of each query before you check. The first two statements set things up and don't show any results.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, library.sql"
	min-height="420px"
	:model-value="'CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, genre TEXT, published_year INTEGER, copies_owned INTEGER, copies_on_loan INTEGER);\n\nINSERT INTO books VALUES\n\t(1, \'Noli Me Tangere\', \'Jose Rizal\', \'Novel\', 1887, 4, 3),\n\t(2, \'El Filibusterismo\', \'Jose Rizal\', \'Novel\', 1891, 3, 1),\n\t(3, \'The Little Prince\', \'Antoine de Saint-Exupery\', \'Novel\', 1943, 5, 2),\n\t(4, \'A Brief History of Time\', \'Stephen Hawking\', \'Science\', 1988, 2, 2),\n\t(5, \'Cosmos\', \'Carl Sagan\', \'Science\', 1980, 2, 0),\n\t(6, \'Smaller and Smaller Circles\', \'F. H. Batacan\', \'Mystery\', 2002, 3, 1);\n\n-- Query 1\nSELECT DISTINCT author FROM books;\n\n-- Query 2\nSELECT title, 2026 - published_year AS years_old FROM books;\n\n-- Query 3\nSELECT title, copies_on_loan * 5 AS late_fee_if_all_late FROM books;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. If you have SQLite installed (see [Setting Up](/lessons/sqlite3/setting-up)), paste them into the `sqlite3` shell after typing `.mode table` to see the results laid out like the answers below.
:::

::: details Check your prediction
```text
+--------------------------+
|          author          |
+--------------------------+
| Jose Rizal               |
| Antoine de Saint-Exupery |
| Stephen Hawking          |
| Carl Sagan               |
| F. H. Batacan            |
+--------------------------+
+-----------------------------+-----------+
|            title            | years_old |
+-----------------------------+-----------+
| Noli Me Tangere             |       139 |
| El Filibusterismo           |       135 |
| The Little Prince           |        83 |
| A Brief History of Time     |        38 |
| Cosmos                      |        46 |
| Smaller and Smaller Circles |        24 |
+-----------------------------+-----------+
+-----------------------------+----------------------+
|            title            | late_fee_if_all_late |
+-----------------------------+----------------------+
| Noli Me Tangere             |                   15 |
| El Filibusterismo           |                    5 |
| The Little Prince           |                   10 |
| A Brief History of Time     |                   10 |
| Cosmos                      |                    0 |
| Smaller and Smaller Circles |                    5 |
+-----------------------------+----------------------+
```

Query 1 lists Jose Rizal once, even though he wrote two of the books. Query 2 works out each book's age from 2026, row by row. Query 3 multiplies each book's loans by a 5-peso fee, so Cosmos, with nothing on loan, gets 0.
:::

## Try it yourself

1. Write a query that shows each book's title and genre, with the genre first.
2. Write a query that shows the title and the total number of copies the library would own if it bought two more of every book. Name the new column `copies_after_order`.
3. Run `SELECT DISTINCT genre, author FROM books;` in your head. How many rows come back, and why is it more than the three genres?

## Check your understanding

<Quiz
	question="Which query shows just the title and author of every book?"
	:options="['SELECT title, author FROM books;', 'SELECT books FROM title, author;', 'GET title, author FROM books;', 'SELECT * FROM books WHERE title, author;']"
	:answer-index="0"
	explanation="The columns you want come right after SELECT, separated by commas, and the table comes after FROM."
/>

<Quiz
	question="What does AS do in SELECT copies_owned - copies_on_loan AS copies_available FROM books;?"
	:options="['It saves a new column into the books table', 'It filters out books with no copies', 'It gives the calculated column a new name in the result', 'It sorts the results']"
	:answer-index="2"
	explanation="AS creates an alias: a name for the column in this result only. The books table itself is not changed."
/>

<Quiz
	question="A table has 6 rows, and 3 of them have the genre Novel. How many rows does SELECT DISTINCT genre FROM books; return if the others are Science, Science, and Mystery?"
	:options="['6', '3', '1', '2']"
	:answer-index="1"
	explanation="DISTINCT keeps one row for each different value: Novel, Science, and Mystery."
/>

## Up next

So far, every query has returned every row. Usually you only want some of them: the novels, the books with copies on the shelf, the books published after 1950. That's [Filtering Rows with WHERE](/lessons/sqlite3/where).
