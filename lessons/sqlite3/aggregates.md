---
title: "SQL Aggregate Functions: COUNT, SUM, AVG, MIN, and MAX"
description: "Summarize whole tables with SQL aggregate functions: count rows with COUNT, add up with SUM, average with AVG, find extremes with MIN and MAX, and see how they treat NULL."
---

# Counting and Summarizing: Aggregates

*A teacher doesn't read out every student's score to describe how the class did. They say "24 students, average 82, highest 98."*

Every query so far has given back rows: one row of results for each book, member, or loan that matched. But plenty of questions are about the whole collection at once. How many books does the library own? What's the average publication year? Which loan is due soonest?

For those, SQL has **aggregate functions**. They take many rows and squash them down into a single answer.

## A class summary

After a test, a teacher could read out all 24 scores one by one. Or they could summarize: "24 students took it, the average was 82, the lowest was 55, and the highest was 98." Four numbers, and everyone understands how the class did.

Each of those is an aggregate. It looks at every row, and gives back one value.

## The five aggregates

| Function | Gives back |
|---|---|
| `COUNT(*)` | how many rows there are |
| `SUM(column)` | all the values added up |
| `AVG(column)` | the average value |
| `MIN(column)` | the smallest value |
| `MAX(column)` | the largest value |

```sql
SELECT
	COUNT(*) AS books,
	SUM(copies_owned) AS total_copies,
	AVG(copies_owned) AS average_copies,
	MIN(published_year) AS oldest,
	MAX(published_year) AS newest
FROM books;
```

```text
+-------+--------------+--------------------+--------+--------+
| books | total_copies |   average_copies   | oldest | newest |
+-------+--------------+--------------------+--------+--------+
|     6 |           19 | 3.1666666666666665 |   1887 |   2002 |
+-------+--------------+--------------------+--------+--------+
```

Six rows went in, and one row came out. That's what aggregates do.

`MIN` and `MAX` work on text and dates too: on text, they give the first and last in alphabetical order, and on `'YYYY-MM-DD'` dates, the earliest and latest.

## Aggregates with `WHERE`

`WHERE` filters the rows **first**, and the aggregate only sees what's left. How many science books are there, and how many copies of them in total?

```sql
SELECT COUNT(*) AS science_books, SUM(copies_owned) AS copies
FROM books
WHERE genre = 'Science';
```

```text
+---------------+--------+
| science_books | copies |
+---------------+--------+
|             2 |      4 |
+---------------+--------+
```

And how many loans are still out? Combine it with `IS NULL` from [Working with NULL](/lessons/sqlite3/null):

```sql
SELECT COUNT(*) AS still_out FROM loans WHERE returned_date IS NULL;
```

```text
+-----------+
| still_out |
+-----------+
|         4 |
+-----------+
```

## `COUNT(*)` versus `COUNT(column)`

There are two ways to count, and the difference matters:

- `COUNT(*)` counts **rows**, no matter what's in them.
- `COUNT(column)` counts only the rows where that column **isn't `NULL`**.

```sql
SELECT
	COUNT(*) AS all_loans,
	COUNT(returned_date) AS returned_loans
FROM loans;
```

```text
+-----------+----------------+
| all_loans | returned_loans |
+-----------+----------------+
|         7 |              3 |
+-----------+----------------+
```

There are 7 loans, but only 3 have a return date. `COUNT(returned_date)` skipped the 4 `NULL`s.

## Aggregates skip NULL

That's true of every aggregate, not just `COUNT`: `SUM`, `AVG`, `MIN`, and `MAX` all ignore `NULL` values completely. Usually that's what you want. But watch out with `AVG`: a missing value isn't counted as zero, it's left out of the average altogether.

```sql
SELECT AVG(score) AS average FROM (
	SELECT 90 AS score UNION ALL SELECT 70 UNION ALL SELECT NULL
);
```

```text
+---------+
| average |
+---------+
|    80.0 |
+---------+
```

The average is 80, the average of 90 and 70, not 53.3, which is what you'd get if the unknown score counted as 0. (The part in parentheses is a quick way to make three rows without creating a table. You'll see why it works in [Subqueries](/lessons/sqlite3/subqueries).)

## Counting different values: `COUNT(DISTINCT ...)`

`DISTINCT` from [SELECT: Reading Data](/lessons/sqlite3/select) works inside `COUNT`, too. How many different authors are in the library, and how many different members have ever borrowed a book?

```sql
SELECT COUNT(DISTINCT author) AS authors FROM books;
```

```text
+---------+
| authors |
+---------+
|       5 |
+---------+
```

```sql
SELECT COUNT(*) AS loans, COUNT(DISTINCT member_id) AS borrowers FROM loans;
```

```text
+-------+-----------+
| loans | borrowers |
+-------+-----------+
|     7 |         4 |
+-------+-----------+
```

Seven loans, but only four different people borrowed them.

## Tidying up the answer

Aggregates are ordinary values, so the functions from [Built-in Functions](/lessons/sqlite3/functions) work on them. `AVG` often gives a long decimal, and `ROUND` tidies it:

```sql
SELECT ROUND(AVG(published_year), 1) AS average_year FROM books;
```

```text
+--------------+
| average_year |
+--------------+
|       1948.5 |
+--------------+
```

## What you can't mix

Here's a common mistake. Which book is the oldest? This looks reasonable:

```sql
SELECT title, MIN(published_year) FROM books;
```

In most databases, it's an error: `MIN` squashes every row into one, so which title should appear beside it? SQLite is unusually forgiving and gives back the title from the row where the minimum was found, which happens to be what you wanted here. But MySQL (in its normal strict setting) and Oracle refuse this query, and even in SQLite it's easy to get wrong with other aggregates. The reliable way to find "the row with the smallest value" is to sort and take one:

```sql
SELECT title, published_year FROM books ORDER BY published_year LIMIT 1;
```

```text
+-----------------+----------------+
|      title      | published_year |
+-----------------+----------------+
| Noli Me Tangere |           1887 |
+-----------------+----------------+
```

The rule: in a query with aggregates, every other column has to be something the database can work out one value for. The next lesson shows the main way to do that properly.

## Try it

This creates a table of cafeteria orders, one row per order, and runs four summaries. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, aggregates.sql"
	min-height="420px"
	:model-value="'CREATE TABLE orders (student TEXT, item TEXT, price INTEGER, tip INTEGER);\n\nINSERT INTO orders VALUES\n\t(\'Maria\', \'adobo\', 65, 5),\n\t(\'Ben\', \'juice\', 20, NULL),\n\t(\'Maria\', \'rice\', 15, NULL),\n\t(\'Carlo\', \'adobo\', 65, 10),\n\t(\'Ben\', \'adobo\', 65, 0);\n\n-- Query 1\nSELECT COUNT(*) AS orders, SUM(price) AS sales, MAX(price) AS priciest FROM orders;\n\n-- Query 2\nSELECT COUNT(tip) AS tipped_orders, SUM(tip) AS tips, AVG(tip) AS average_tip FROM orders;\n\n-- Query 3\nSELECT COUNT(DISTINCT student) AS customers, COUNT(DISTINCT item) AS items FROM orders;\n\n-- Query 4\nSELECT ROUND(AVG(price), 2) AS average_adobo FROM orders WHERE item = \'adobo\';\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+--------+-------+----------+
| orders | sales | priciest |
+--------+-------+----------+
|      5 |   230 |       65 |
+--------+-------+----------+
+---------------+------+-------------+
| tipped_orders | tips | average_tip |
+---------------+------+-------------+
|             3 |   15 |         5.0 |
+---------------+------+-------------+
+-----------+-------+
| customers | items |
+-----------+-------+
|         3 |     3 |
+-----------+-------+
+---------------+
| average_adobo |
+---------------+
|          65.0 |
+---------------+
```

In Query 2, two tips are `NULL`, so `COUNT(tip)` is 3, and the average is 15 divided by those 3 orders, not by all 5. Ben's tip of `0` is a real value, so it counts. Query 3 finds 3 different students and 3 different items. Query 4 averages only the three adobo orders, which all cost 65.
:::

## Try it yourself

1. In your library database, count how many members are in grade 11.
2. Find the total number of copies on loan across the whole library, and the average number of copies owned, rounded to 1 decimal place.
3. Find the earliest and latest due dates of loans that haven't been returned.

## Check your understanding

<Quiz
	question="A table has 10 rows, and 3 of them have NULL in the email column. What is COUNT(email)?"
	:options="['7', '10', '3', '0']"
	:answer-index="0"
	explanation="COUNT(column) only counts rows where that column isn't NULL. COUNT(*) would give 10."
/>

<Quiz
	question="Scores are 80, 100, and NULL. What does AVG(score) give?"
	:options="['90', '60', 'NULL', '0']"
	:answer-index="0"
	explanation="Aggregates skip NULL entirely, so the average is of 80 and 100 only."
/>

<Quiz
	question="What does WHERE do in a query with aggregates, like SELECT COUNT(*) FROM books WHERE genre = &#39;Novel&#39;?"
	:options="['It is ignored when there is an aggregate', 'It filters the answer after counting', 'It filters the rows first, and the aggregate only sees the rows that are left', 'It causes an error']"
	:answer-index="2"
	explanation="WHERE runs before the aggregate, so this counts only the novels."
/>

## Up next

One number for the whole table is useful. But often you want one number **per group**: the number of books in each genre, or the number of loans for each member. That's [Grouping with GROUP BY and HAVING](/lessons/sqlite3/group-by).
