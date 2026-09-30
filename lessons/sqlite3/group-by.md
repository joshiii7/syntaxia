---
title: "SQL GROUP BY and HAVING: Summarize Data by Group"
description: "Get one summary row per group with SQL's GROUP BY: count books per genre or loans per member, group by several columns, and filter groups with HAVING."
---

# Grouping with GROUP BY and HAVING

*Sorting laundry into piles, then counting each pile: five shirts, three pairs of socks, two towels.*

In [Aggregates](/lessons/sqlite3/aggregates), `COUNT`, `SUM`, and the rest squashed a whole table into one row. That answers "how many books are there?" But the question you usually want answered is a bit finer: how many books are there **in each genre**? How many loans has **each member** made?

That's **`GROUP BY`**: it splits the rows into groups, then runs the aggregate once for every group.

## Laundry piles

Picture a pile of clean laundry. Before you can say "I have five shirts," you sort everything into piles: shirts here, socks there, towels over there. Then you count each pile separately.

`GROUP BY` does both steps. It sorts rows into piles that share the same value, and then the aggregate summarizes each pile, giving one result row per pile.

## Your first `GROUP BY`

```sql
SELECT genre, COUNT(*) AS books
FROM books
GROUP BY genre;
```

```text
+---------+-------+
|  genre  | books |
+---------+-------+
| Mystery |     1 |
| Novel   |     3 |
| Science |     2 |
+---------+-------+
```

Step by step:

1. `GROUP BY genre` sorts the six books into three piles: Mystery, Novel, and Science.
2. `COUNT(*)` counts the rows in each pile.
3. You get one row per pile, showing the genre and its count.

Any aggregate works per group:

```sql
SELECT
	genre,
	COUNT(*) AS books,
	SUM(copies_owned) AS copies,
	MIN(published_year) AS oldest
FROM books
GROUP BY genre;
```

```text
+---------+-------+--------+--------+
|  genre  | books | copies | oldest |
+---------+-------+--------+--------+
| Mystery |     1 |      3 |   2002 |
| Novel   |     3 |     12 |   1887 |
| Science |     2 |      4 |   1980 |
+---------+-------+--------+--------+
```

## The golden rule

In a grouped query, every column you `SELECT` must be one of two things:

- a column you **grouped by**, like `genre`, which has the same value for every row in the pile; or
- an **aggregate**, like `COUNT(*)`, which boils the pile down to one value.

Anything else is ambiguous. In `SELECT genre, title FROM books GROUP BY genre`, the Novel pile holds three books. Which title should appear on its one row? MySQL and Oracle reject the query outright. SQLite quietly picks a title from somewhere in the pile, which is almost never what you meant. Follow the rule, and your query means the same thing in every database.

## Loans per member

Grouping really shines on tables that record events, like loans. Here's how many loans each member has made, most first:

```sql
SELECT member_id, COUNT(*) AS loans
FROM loans
GROUP BY member_id
ORDER BY loans DESC, member_id;
```

```text
+-----------+-------+
| member_id | loans |
+-----------+-------+
|         1 |     2 |
|         2 |     2 |
|         3 |     2 |
|         4 |     1 |
+-----------+-------+
```

Right now, you see member numbers rather than names. In [Combining Tables with JOIN](/lessons/sqlite3/joins), you'll put the names right next to the counts.

## Grouping by several columns

Give `GROUP BY` more than one column, and it makes a pile for every *combination* of values. How many loans has each member made, split by whether they've been returned?

```sql
SELECT
	member_id,
	returned_date IS NOT NULL AS returned,
	COUNT(*) AS loans
FROM loans
GROUP BY member_id, returned
ORDER BY member_id, returned;
```

```text
+-----------+----------+-------+
| member_id | returned | loans |
+-----------+----------+-------+
|         1 |        0 |     1 |
|         1 |        1 |     1 |
|         2 |        0 |     2 |
|         3 |        0 |     1 |
|         3 |        1 |     1 |
|         4 |        1 |     1 |
+-----------+----------+-------+
```

(`returned_date IS NOT NULL` gives `1` for returned loans and `0` for loans still out, and you can group by it like any other column.) Member 1 has one returned loan and one still out, so they get two rows.

## Filtering groups: `HAVING`

What if you only want the genres with more than one book? You can't use `WHERE COUNT(*) > 1`, because `WHERE` filters **rows**, before any grouping happens, and at that point there are no counts yet.

For filtering **groups**, after they're counted, SQL has **`HAVING`**:

```sql
SELECT genre, COUNT(*) AS books
FROM books
GROUP BY genre
HAVING COUNT(*) > 1;
```

```text
+---------+-------+
|  genre  | books |
+---------+-------+
| Novel   |     3 |
| Science |     2 |
+---------+-------+
```

The difference in one sentence: **`WHERE` filters rows before grouping; `HAVING` filters groups after.** You can use both in one query:

```sql
SELECT member_id, COUNT(*) AS open_loans
FROM loans
WHERE returned_date IS NULL
GROUP BY member_id
HAVING COUNT(*) >= 2;
```

```text
+-----------+------------+
| member_id | open_loans |
+-----------+------------+
|         2 |          2 |
+-----------+------------+
```

`WHERE` first keeps only the loans still out. Then `GROUP BY` counts them per member, and `HAVING` keeps only the members with two or more open loans.

## The full order of a query

You now know every part of a basic `SELECT`. They always appear in this order:

```text
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...
```

And the database works through them roughly in this order: take the rows **from** the table, filter them with **where**, sort them into **groups**, filter the groups with **having**, work out the **select** list, then **order** and **limit** the result. That's why an alias made in `SELECT` works in `ORDER BY`, which comes later, but not in `WHERE`, which runs earlier.

## Try it

This creates a table of cafeteria orders and runs four grouped queries. Predict each result, row by row.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, group.sql"
	min-height="460px"
	:model-value="'CREATE TABLE orders (student TEXT, item TEXT, price INTEGER, day TEXT);\n\nINSERT INTO orders VALUES\n\t(\'Maria\', \'adobo\', 65, \'Mon\'),\n\t(\'Ben\', \'juice\', 20, \'Mon\'),\n\t(\'Maria\', \'rice\', 15, \'Mon\'),\n\t(\'Carlo\', \'adobo\', 65, \'Tue\'),\n\t(\'Ben\', \'adobo\', 65, \'Tue\'),\n\t(\'Maria\', \'juice\', 20, \'Tue\'),\n\t(\'Ben\', \'juice\', 20, \'Wed\');\n\n-- Query 1: spending per student\nSELECT student, COUNT(*) AS orders, SUM(price) AS spent\nFROM orders GROUP BY student ORDER BY spent DESC;\n\n-- Query 2: popular items\nSELECT item, COUNT(*) AS times FROM orders GROUP BY item HAVING COUNT(*) &gt;= 3;\n\n-- Query 3: sales per day, but only counting drinks\nSELECT day, SUM(price) AS drink_sales FROM orders WHERE item = \'juice\' GROUP BY day;\n\n-- Query 4: who ordered the same item more than once?\nSELECT student, item, COUNT(*) AS times FROM orders GROUP BY student, item HAVING COUNT(*) &gt; 1;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+---------+--------+-------+
| student | orders | spent |
+---------+--------+-------+
| Ben     |      3 |   105 |
| Maria   |      3 |   100 |
| Carlo   |      1 |    65 |
+---------+--------+-------+
+-------+-------+
| item  | times |
+-------+-------+
| adobo |     3 |
| juice |     3 |
+-------+-------+
+-----+-------------+
| day | drink_sales |
+-----+-------------+
| Mon |          20 |
| Tue |          20 |
| Wed |          20 |
+-----+-------------+
+---------+-------+-------+
| student | item  | times |
+---------+-------+-------+
| Ben     | juice |     2 |
+---------+-------+-------+
```

In Query 3, `WHERE` removes every non-juice order before grouping, so Tuesday's juice sale is the only one counted that day. Query 4 groups by student *and* item together, so only Ben's two juices make a pile bigger than one.
:::

## Try it yourself

1. In your library database, count the members in each grade, sorted by grade.
2. For each book, count how many times it's been borrowed, using `book_id`. Which book has been borrowed most?
3. Find the genres whose total `copies_on_loan` is at least 3.

## Check your understanding

<Quiz
	question="What does SELECT genre, COUNT(*) FROM books GROUP BY genre; give back?"
	:options="['One row for the whole table', 'One row per genre, with how many books are in it', 'One row per book', 'An error']"
	:answer-index="1"
	explanation="GROUP BY makes one pile per genre, and COUNT(*) counts each pile."
/>

<Quiz
	question="You want only the groups with more than 5 rows. Which clause do you use?"
	:options="['WHERE COUNT(*) &gt; 5', 'ORDER BY COUNT(*) &gt; 5', 'LIMIT 5', 'HAVING COUNT(*) &gt; 5']"
	:answer-index="3"
	explanation="WHERE filters rows before grouping, when there are no counts yet. HAVING filters groups after they're counted."
/>

<Quiz
	question="In a grouped query, which columns can you safely SELECT?"
	:options="['Any column at all', 'Only aggregates', 'Only the columns you grouped by, and aggregates', 'Only the first column']"
	:answer-index="2"
	explanation="Every other column could have several different values in one group, so the database can't know which to show."
/>

## Up next

Member numbers and book numbers are fine for a computer, but people want names and titles. The information is all there, just spread across three tables. Next, you'll bring them together in [Combining Tables with JOIN](/lessons/sqlite3/joins).
