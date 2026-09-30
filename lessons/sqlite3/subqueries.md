---
title: "SQL Subqueries and WITH: Queries Inside Queries"
description: "Answer multi-step questions in SQL by putting one query inside another: compare against a single value, match a list with IN, use EXISTS, and name steps with WITH."
---

# Subqueries

*To find out which students scored above the class average, you first have to work out the average. Two questions, one after the other.*

Some questions can't be answered in one step. "Which books are newer than the average book?" needs the average first. "Which members have borrowed a science book?" needs the list of science books first. You could run two queries and copy the answer from one into the other, but SQL lets you do it in one go, by putting a query **inside** another query.

A query inside another query is called a **subquery**.

## A question inside a question

Imagine asking a librarian, "Can you show me every book that's newer than the average book in the library?" The librarian can't answer straight away. First they work out the average publication year, jot it on a sticky note, and *then* go through the shelves comparing each book to the note.

A subquery is the sticky note: a small question answered first, whose answer the main question then uses.

## A subquery that gives one value

Here's the librarian's question. The subquery goes in parentheses, right where the value would go:

```sql
SELECT title, published_year
FROM books
WHERE published_year > (SELECT AVG(published_year) FROM books);
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| A Brief History of Time     |           1988 |
| Cosmos                      |           1980 |
| Smaller and Smaller Circles |           2002 |
+-----------------------------+----------------+
```

The database runs the inner query first, `SELECT AVG(published_year) FROM books`, which gives 1948.5. Then it runs the outer query as if you'd written `WHERE published_year > 1948.5`.

The point is that you never have to know, or type, the average yourself. Add a new book tomorrow, and the same query uses the new average.

A subquery used this way must give back exactly **one value**: one row, one column. That's why it's usually an aggregate like `AVG`, `MAX`, or `COUNT`.

Subqueries can also go in the `SELECT` list, to show a single value beside every row:

```sql
SELECT
	title,
	copies_owned,
	ROUND(copies_owned - (SELECT AVG(copies_owned) FROM books), 2) AS above_average
FROM books
ORDER BY above_average DESC;
```

```text
+-----------------------------+--------------+---------------+
|            title            | copies_owned | above_average |
+-----------------------------+--------------+---------------+
| The Little Prince           |            5 |          1.83 |
| Noli Me Tangere             |            4 |          0.83 |
| El Filibusterismo           |            3 |         -0.17 |
| Smaller and Smaller Circles |            3 |         -0.17 |
| A Brief History of Time     |            2 |         -1.17 |
| Cosmos                      |            2 |         -1.17 |
+-----------------------------+--------------+---------------+
```

## A subquery that gives a list: `IN`

A subquery can also give back a list of values, one column but several rows. Pair it with `IN` from [Filtering Rows with WHERE](/lessons/sqlite3/where). Which members have borrowed a science book?

```sql
SELECT name
FROM members
WHERE id IN (
	SELECT l.member_id
	FROM loans l
	JOIN books b ON l.book_id = b.id
	WHERE b.genre = 'Science'
);
```

```text
+-------------+
|    name     |
+-------------+
| Carlo Reyes |
+-------------+
```

The inner query finds the member numbers of everyone who borrowed a science book. The outer query shows the names of members whose `id` is in that list. Many questions like this can be written either as a subquery or as a join; use whichever reads more clearly to you.

`NOT IN` finds the opposite: members who have **never** borrowed anything.

```sql
SELECT name
FROM members
WHERE id NOT IN (SELECT member_id FROM loans);
```

```text
+---------+
|  name   |
+---------+
| Eli Tan |
+---------+
```

One warning about `NOT IN`: if the list from the subquery contains even one `NULL`, `NOT IN` matches **nothing at all**, because of the "unknown" rule from [Working with NULL](/lessons/sqlite3/null). If the column could contain `NULL`, add `WHERE member_id IS NOT NULL` inside the subquery, or use `NOT EXISTS`, below.

## `EXISTS`: is there at least one?

`EXISTS` asks a yes-or-no question: does the subquery return **any** rows at all? It's often used with a subquery that refers to the outer query's current row. Which books have at least one copy out right now?

```sql
SELECT title
FROM books b
WHERE EXISTS (
	SELECT 1
	FROM loans l
	WHERE l.book_id = b.id AND l.returned_date IS NULL
);
```

```text
+-----------------------------+
|            title            |
+-----------------------------+
| Noli Me Tangere             |
| The Little Prince           |
| A Brief History of Time     |
| Smaller and Smaller Circles |
+-----------------------------+
```

For each book, the inner query looks for an open loan of *that* book (notice `l.book_id = b.id`, which uses the outer table's alias). If it finds one, `EXISTS` is true and the book is kept. `SELECT 1` is a common way to write it, since `EXISTS` only cares whether rows came back, not what's in them.

`NOT EXISTS` is the safe version of `NOT IN`: it isn't thrown off by `NULL`s.

## A subquery as a table

A subquery can even stand in for a whole table in `FROM`. This is useful for working out something in one step, then querying the result. On average, how many loans has each borrower made?

```sql
SELECT AVG(loan_count) AS average_loans
FROM (
	SELECT member_id, COUNT(*) AS loan_count
	FROM loans
	GROUP BY member_id
) AS per_member;
```

```text
+---------------+
| average_loans |
+---------------+
|          1.75 |
+---------------+
```

The inner query makes a little temporary table with one row per member, and the outer query averages it. The temporary table needs a name, here `per_member`, even if you never use it.

## Naming the steps: `WITH`

Subqueries inside subqueries get hard to read quickly. SQL has a cleaner way to write the same thing: **`WITH`** lets you give each step a name at the top of the query, then use it like a table. These named steps are called **common table expressions**, or **CTEs**:

```sql
WITH per_member AS (
	SELECT member_id, COUNT(*) AS loan_count
	FROM loans
	GROUP BY member_id
)
SELECT m.name, p.loan_count
FROM per_member p
JOIN members m ON p.member_id = m.id
WHERE p.loan_count = (SELECT MAX(loan_count) FROM per_member)
ORDER BY m.name;
```

```text
+--------------+------------+
|     name     | loan_count |
+--------------+------------+
| Ben Cruz     |          2 |
| Carlo Reyes  |          2 |
| Maria Santos |          2 |
+--------------+------------+
```

The query now reads top to bottom, like a recipe: first work out each member's loan count, then find the members whose count is the highest. `WITH` works in SQLite, MySQL (since version 8), and Oracle, and it's the style most people prefer once a query has more than one step.

## Try it

The editor creates a small table of quiz scores, and runs three queries that each need an answer to another question first. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, subqueries.sql"
	min-height="460px"
	:model-value="'CREATE TABLE scores (student TEXT, subject TEXT, score INTEGER);\n\nINSERT INTO scores VALUES\n\t(\'Ana\', \'Math\', 92), (\'Ana\', \'Science\', 85),\n\t(\'Ben\', \'Math\', 70), (\'Ben\', \'Science\', 88),\n\t(\'Carlo\', \'Math\', 95), (\'Carlo\', \'Science\', 91),\n\t(\'Dina\', \'Math\', 64);\n\n-- Query 1: scores above the overall average\nSELECT student, subject, score FROM scores\nWHERE score &gt; (SELECT AVG(score) FROM scores)\nORDER BY score DESC;\n\n-- Query 2: students who missed the Science quiz\nSELECT DISTINCT student FROM scores\nWHERE student NOT IN (SELECT student FROM scores WHERE subject = \'Science\');\n\n-- Query 3: each student\'s best score, but only students whose best is at least 90\nWITH best AS (\n\tSELECT student, MAX(score) AS top_score FROM scores GROUP BY student\n)\nSELECT student, top_score FROM best WHERE top_score &gt;= 90 ORDER BY student;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+---------+---------+-------+
| student | subject | score |
+---------+---------+-------+
| Carlo   | Math    |    95 |
| Ana     | Math    |    92 |
| Carlo   | Science |    91 |
| Ben     | Science |    88 |
| Ana     | Science |    85 |
+---------+---------+-------+
+---------+
| student |
+---------+
| Dina    |
+---------+
+---------+-----------+
| student | top_score |
+---------+-----------+
| Ana     |        92 |
| Carlo   |        95 |
+---------+-----------+
```

The average of all seven scores is about 83.6, so Query 1 keeps the five scores above it. In Query 2, the inner query lists everyone who took Science, and `NOT IN` keeps the students who aren't on that list: only Dina. Query 3 works out each student's best score first, then keeps the ones of 90 or more.
:::

## Try it yourself

1. In your library database, find the books with more copies owned than the average.
2. Find the names of members who have a loan that's still out, using `EXISTS`.
3. Rewrite Query 3 from the Try it without `WITH`, using `GROUP BY` and `HAVING` instead. Which version do you find clearer?

## Check your understanding

<Quiz
	question="In WHERE year &gt; (SELECT AVG(year) FROM books), which query runs first?"
	:options="['The outer query', 'The inner query, whose single answer is then used by the outer one', 'Both at the same time', 'Neither, it is an error']"
	:answer-index="1"
	explanation="The subquery in parentheses is worked out first, and its value is used in the outer query's condition."
/>

<Quiz
	question="What must a subquery used like = (SELECT ...) give back?"
	:options="['A whole table', 'At least two rows', 'Nothing', 'Exactly one value: one row and one column']"
	:answer-index="3"
	explanation="Comparing with = needs a single value. For a list of values, use IN instead."
/>

<Quiz
	question="What does WITH do?"
	:options="['Names a step of the query, which can then be used like a table', 'Joins two tables', 'Filters groups', 'Creates a permanent table']"
	:answer-index="0"
	explanation="WITH creates a named, temporary result (a common table expression) that exists only while the query runs."
/>

## Up next

That completes SQL Foundations. You can ask a database almost any question now. But every table so far was made for you. Next, you'll build your own, choosing columns and types, in [Creating Tables](/lessons/sqlite3/create-table).
