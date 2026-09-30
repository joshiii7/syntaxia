---
title: "SQL ORDER BY and LIMIT: Sort and Limit Query Results"
description: "Sort SQL results with ORDER BY, ascending or descending, by several columns at once, and return just the top rows with LIMIT and OFFSET."
---

# Sorting and Limiting Results

*A leaderboard doesn't list players in the order they signed up. It sorts them by score, and often only shows the top ten.*

At the end of [SELECT: Reading Data](/lessons/sqlite3/select), there was a warning: SQL makes **no promise** about the order of rows unless you ask for one. Results have come out in `id` order so far, but that's a coincidence of how a small table happens to be stored.

This lesson shows how to ask for a specific order with **`ORDER BY`**, and how to get just the first few rows with **`LIMIT`**.

## A leaderboard

A game's leaderboard takes every player's score, sorts them from highest to lowest, and shows the top ten. Tomorrow, the scores change, and the leaderboard is sorted fresh. Nobody rearranges the players' records themselves; the sorting only happens when the board is displayed.

`ORDER BY` works the same way. It sorts the result of a query, each time you run it, without changing how the data is stored.

## `ORDER BY`

Put `ORDER BY` and a column name at the end of a query:

```sql
SELECT title, published_year FROM books ORDER BY published_year;
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| Noli Me Tangere             |           1887 |
| El Filibusterismo           |           1891 |
| The Little Prince           |           1943 |
| Cosmos                      |           1980 |
| A Brief History of Time     |           1988 |
| Smaller and Smaller Circles |           2002 |
+-----------------------------+----------------+
```

By default, the order is **ascending**: smallest to largest for numbers, earliest to latest for dates, and A to Z for text. You can write `ASC` to say so explicitly.

For the other direction, add **`DESC`** (descending):

```sql
SELECT title, published_year FROM books ORDER BY published_year DESC;
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| Smaller and Smaller Circles |           2002 |
| A Brief History of Time     |           1988 |
| Cosmos                      |           1980 |
| The Little Prince           |           1943 |
| El Filibusterismo           |           1891 |
| Noli Me Tangere             |           1887 |
+-----------------------------+----------------+
```

## Where it goes

The clauses of a `SELECT` always come in the same order:

```text
SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...
```

So filtering happens first, then sorting:

```sql
SELECT title, published_year
FROM books
WHERE genre = 'Novel'
ORDER BY published_year DESC;
```

```text
+-------------------+----------------+
|       title       | published_year |
+-------------------+----------------+
| The Little Prince |           1943 |
| El Filibusterismo |           1891 |
| Noli Me Tangere   |           1887 |
+-------------------+----------------+
```

## Sorting by several columns

Give `ORDER BY` a list, and it sorts by the first column, then uses the second to break ties, and so on. Here, books are grouped by genre alphabetically, and within each genre, the newest comes first:

```sql
SELECT genre, title, published_year
FROM books
ORDER BY genre, published_year DESC;
```

```text
+---------+-----------------------------+----------------+
|  genre  |            title            | published_year |
+---------+-----------------------------+----------------+
| Mystery | Smaller and Smaller Circles |           2002 |
| Novel   | The Little Prince           |           1943 |
| Novel   | El Filibusterismo           |           1891 |
| Novel   | Noli Me Tangere             |           1887 |
| Science | A Brief History of Time     |           1988 |
| Science | Cosmos                      |           1980 |
+---------+-----------------------------+----------------+
```

Each column gets its own direction: `genre` is ascending (the default), and `published_year` is `DESC`.

## Sorting by a calculation

You can sort by any expression, including a column you calculated and named with `AS`:

```sql
SELECT title, copies_owned - copies_on_loan AS on_shelf
FROM books
ORDER BY on_shelf DESC, title;
```

```text
+-----------------------------+----------+
|            title            | on_shelf |
+-----------------------------+----------+
| The Little Prince           |        3 |
| Cosmos                      |        2 |
| El Filibusterismo           |        2 |
| Smaller and Smaller Circles |        2 |
| Noli Me Tangere             |        1 |
| A Brief History of Time     |        0 |
+-----------------------------+----------+
```

The three books with 2 copies on the shelf are tied, so the second sort column, `title`, puts them in alphabetical order.

## Just the first few: `LIMIT`

Often you only want the top of the list: the three newest books, the five most recent loans. `LIMIT` stops after that many rows:

```sql
SELECT title, published_year
FROM books
ORDER BY published_year DESC
LIMIT 3;
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| Smaller and Smaller Circles |           2002 |
| A Brief History of Time     |           1988 |
| Cosmos                      |           1980 |
+-----------------------------+----------------+
```

`LIMIT` almost always goes with `ORDER BY`. Without it, "the first three rows" means "any three rows the database felt like," which can change from run to run.

## Skipping rows: `OFFSET`

`OFFSET` skips some rows before `LIMIT` starts counting. It's how websites show results page by page: page 1 is `LIMIT 10 OFFSET 0`, page 2 is `LIMIT 10 OFFSET 10`, and so on.

```sql
SELECT title FROM books ORDER BY title LIMIT 2 OFFSET 2;
```

```text
+-------------------+
|       title       |
+-------------------+
| El Filibusterismo |
| Noli Me Tangere   |
+-------------------+
```

In alphabetical order, the first two titles are skipped, and the next two are shown.

## Two things that differ between databases

**Limiting rows.** `LIMIT` works in SQLite and MySQL, but not in Oracle, which uses the standard `FETCH FIRST 3 ROWS ONLY` instead. The [Oracle track](/lessons/oracle-database/coming-from-sqlite) covers it.

**Where empty values go.** When a column has missing values, called `NULL` (the subject of the next lesson), SQLite and MySQL put them *first* in ascending order, while Oracle puts them *last*. If it matters, SQLite and Oracle let you say so explicitly, with `NULLS FIRST` or `NULLS LAST` after the column: `ORDER BY returned_date NULLS LAST`. MySQL doesn't support those words, so there you'd sort on `returned_date IS NULL` first. When a database's default matters to your results, check it.

## Try it

The editor builds the `books` table, then runs three sorted queries. Predict each result, row by row.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, order.sql"
	min-height="440px"
	:model-value="'CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, genre TEXT, published_year INTEGER, copies_owned INTEGER, copies_on_loan INTEGER);\n\nINSERT INTO books VALUES\n\t(1, \'Noli Me Tangere\', \'Jose Rizal\', \'Novel\', 1887, 4, 3),\n\t(2, \'El Filibusterismo\', \'Jose Rizal\', \'Novel\', 1891, 3, 1),\n\t(3, \'The Little Prince\', \'Antoine de Saint-Exupery\', \'Novel\', 1943, 5, 2),\n\t(4, \'A Brief History of Time\', \'Stephen Hawking\', \'Science\', 1988, 2, 2),\n\t(5, \'Cosmos\', \'Carl Sagan\', \'Science\', 1980, 2, 0),\n\t(6, \'Smaller and Smaller Circles\', \'F. H. Batacan\', \'Mystery\', 2002, 3, 1);\n\n-- Query 1: the two oldest books\nSELECT title, published_year FROM books ORDER BY published_year LIMIT 2;\n\n-- Query 2: the two newest books that have a copy on the shelf\nSELECT title, published_year\nFROM books\nWHERE copies_owned - copies_on_loan &gt; 0\nORDER BY published_year DESC\nLIMIT 2;\n\n-- Query 3: authors, Z to A\nSELECT DISTINCT author FROM books ORDER BY author DESC;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+-------------------+----------------+
|       title       | published_year |
+-------------------+----------------+
| Noli Me Tangere   |           1887 |
| El Filibusterismo |           1891 |
+-------------------+----------------+
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| Smaller and Smaller Circles |           2002 |
| Cosmos                      |           1980 |
+-----------------------------+----------------+
+--------------------------+
|          author          |
+--------------------------+
| Stephen Hawking          |
| Jose Rizal               |
| F. H. Batacan            |
| Carl Sagan               |
| Antoine de Saint-Exupery |
+--------------------------+
```

In Query 2, the order of the clauses matters: `WHERE` first removes *A Brief History of Time* (no copies on the shelf), then `ORDER BY` sorts what's left, and `LIMIT` keeps the top two. Without the filter, the 1988 book would have been second. In Query 3, `DISTINCT` removes Jose Rizal's duplicate, and the names are sorted from Z to A.
:::

## Try it yourself

1. Write a query for the three books with the most copies owned, most first.
2. Show every book's title and genre, sorted by genre from Z to A, and alphabetically by title within each genre.
3. In your library database, list the loans ordered by due date, earliest first, and show only the second page of results, two per page.

## Check your understanding

<Quiz
	question="What does ORDER BY published_year DESC do?"
	:options="['Sorts from the smallest year to the largest', 'Removes duplicate years', 'Keeps only the latest year', 'Sorts from the largest year to the smallest']"
	:answer-index="3"
	explanation="DESC means descending: largest first. The default, ASC, is smallest first."
/>

<Quiz
	question="Why should LIMIT almost always come with ORDER BY?"
	:options="['LIMIT does not work without ORDER BY', 'Without ORDER BY, the database can return any rows, so which ones you get isn\'t predictable', 'ORDER BY makes LIMIT faster', 'It is required by SQLite']"
	:answer-index="1"
	explanation="SQL makes no promise about row order. ORDER BY decides which rows count as the first ones."
/>

<Quiz
	question="In which order must these clauses appear?"
	:options="['SELECT, WHERE, FROM, ORDER BY, LIMIT', 'SELECT, FROM, WHERE, ORDER BY, LIMIT', 'SELECT, FROM, ORDER BY, WHERE, LIMIT', 'SELECT, FROM, LIMIT, WHERE, ORDER BY']"
	:answer-index="1"
	explanation="SELECT and FROM come first, then WHERE filters, ORDER BY sorts, and LIMIT keeps the first rows."
/>

## Up next

You've seen empty spots in the `loans` table, where a book hasn't been returned yet. Those empty spots are called `NULL`, and they follow rules of their own that trip up almost everyone. That's [Working with NULL](/lessons/sqlite3/null).
