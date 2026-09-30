---
title: "SQL Built-in Functions: Text, Numbers, and Rounding"
description: "Use SQL's built-in functions to change text with UPPER, SUBSTR, and REPLACE, join text with ||, round numbers, and avoid SQLite's whole-number division trap."
---

# Built-in Functions

*A kitchen comes with tools already in the drawer: a peeler, a grater, a measuring cup. You don't make your own before you start cooking.*

You've already used a few functions without much fuss: `COALESCE` in [Working with NULL](/lessons/sqlite3/null), and `sqlite_version()` in [Setting Up](/lessons/sqlite3/setting-up). SQL comes with many more, ready to use inside any query: tools for changing text, rounding numbers, and much more.

## Tools in the drawer

In a kitchen drawer, each tool does one job. A peeler takes the skin off. A grater turns a block of cheese into shreds. You hand the tool an ingredient, and it hands you back something changed.

A SQL function works the same way: you give it a value in parentheses, and it gives you back a result. `UPPER('rizal')` gives back `'RIZAL'`. Functions don't change what's stored in the table; like everything else in a `SELECT`, they only change the answer.

## Text functions

Here are the text functions you'll use most, in SQLite:

| Function | What it does | Example | Result |
|---|---|---|---|
| `UPPER(text)` | all capitals | `UPPER('Cosmos')` | `COSMOS` |
| `LOWER(text)` | all lowercase | `LOWER('Cosmos')` | `cosmos` |
| `LENGTH(text)` | number of characters | `LENGTH('Cosmos')` | `6` |
| `SUBSTR(text, start, count)` | part of the text | `SUBSTR('Cosmos', 1, 3)` | `Cos` |
| `TRIM(text)` | remove spaces at both ends | `TRIM('  hi  ')` | `hi` |
| `REPLACE(text, a, b)` | swap every `a` for `b` | `REPLACE('A-B', '-', '+')` | `A+B` |
| `INSTR(text, find)` | position of `find` | `INSTR('Cosmos', 's')` | `3` |

Unlike Python and JavaScript, SQL counts characters from **1**, not 0: `SUBSTR('Cosmos', 1, 3)` starts at the first character. And `INSTR` gives `0` when it can't find anything.

Used on real columns, they work row by row:

```sql
SELECT
	UPPER(title) AS shouting,
	LENGTH(title) AS characters,
	SUBSTR(author, 1, 1) AS initial
FROM books
WHERE genre = 'Science';
```

```text
+-------------------------+------------+---------+
|        shouting         | characters | initial |
+-------------------------+------------+---------+
| A BRIEF HISTORY OF TIME |         23 | S       |
| COSMOS                  |          6 | C       |
+-------------------------+------------+---------+
```

## Joining text: `||`

To join pieces of text together, SQLite uses `||` (two vertical bars). It's the standard SQL way, and Oracle uses it too:

```sql
SELECT title || ' by ' || author AS label FROM books WHERE genre = 'Novel';
```

```text
+-----------------------------------------------+
|                     label                     |
+-----------------------------------------------+
| Noli Me Tangere by Jose Rizal                 |
| El Filibusterismo by Jose Rizal               |
| The Little Prince by Antoine de Saint-Exupery |
+-----------------------------------------------+
```

MySQL is the odd one out: by default, `||` means "or" there, and you use `CONCAT(title, ' by ', author)` instead. The [MySQL track](/lessons/mysql/coming-from-sqlite) shows what goes wrong otherwise.

## Number functions

| Function | What it does | Example | Result |
|---|---|---|---|
| `ROUND(n, places)` | round to some decimal places | `ROUND(3.14159, 2)` | `3.14` |
| `ABS(n)` | remove a minus sign | `ABS(-7)` | `7` |
| `MAX(a, b, ...)` | the biggest of several values | `MAX(3, 9, 4)` | `9` |
| `MIN(a, b, ...)` | the smallest of several values | `MIN(3, 9, 4)` | `3` |

(`MAX` and `MIN` with a *single* column name do something different: they find the biggest or smallest value in the whole column. That's an **aggregate**, and it's the subject of the next lesson.)

## The division trap

Here's a surprise that catches almost everyone who uses SQLite:

```sql
SELECT 7 / 2 AS whole, 7 / 2.0 AS exact, 10 / 4 AS also_whole;
```

```text
+-------+-------+------------+
| whole | exact | also_whole |
+-------+-------+------------+
|     3 |   3.5 |          2 |
+-------+-------+------------+
```

When **both** numbers are whole numbers, SQLite does whole-number division and throws away the fraction. `7 / 2` is `3`, not `3.5`. That's why `SELECT 10 / 4;` answered `2` back in [Setting Up](/lessons/sqlite3/setting-up).

It matters most when you divide one column by another. What share of each book's copies is on loan?

```sql
SELECT title, copies_on_loan / copies_owned AS share_out FROM books;
```

```text
+-----------------------------+-----------+
|            title            | share_out |
+-----------------------------+-----------+
| Noli Me Tangere             |         0 |
| El Filibusterismo           |         0 |
| The Little Prince           |         0 |
| A Brief History of Time     |         1 |
| Cosmos                      |         0 |
| Smaller and Smaller Circles |         0 |
+-----------------------------+-----------+
```

Every share came out as 0 or 1, because both columns hold whole numbers. The fix is to make one side a decimal before dividing. Multiplying by `1.0` is the quick way; `CAST(... AS REAL)` is the more explicit one:

```sql
SELECT
	title,
	ROUND(copies_on_loan * 1.0 / copies_owned, 2) AS share_out
FROM books;
```

```text
+-----------------------------+-----------+
|            title            | share_out |
+-----------------------------+-----------+
| Noli Me Tangere             |      0.75 |
| El Filibusterismo           |      0.33 |
| The Little Prince           |       0.4 |
| A Brief History of Time     |       1.0 |
| Cosmos                      |       0.0 |
| Smaller and Smaller Circles |      0.33 |
+-----------------------------+-----------+
```

MySQL and Oracle don't have this trap: in both, `7 / 2` is `3.5`. It's one of the few places where SQLite's answer differs from theirs, so it's worth remembering.

## Functions inside `WHERE` and `ORDER BY`

A function can go anywhere a value can: in `WHERE`, in `ORDER BY`, even inside another function. Here's every book with a title longer than 15 characters, shortest first:

```sql
SELECT title, LENGTH(title) AS characters
FROM books
WHERE LENGTH(title) > 15
ORDER BY characters;
```

```text
+-----------------------------+------------+
|            title            | characters |
+-----------------------------+------------+
| El Filibusterismo           |         17 |
| The Little Prince           |         17 |
| A Brief History of Time     |         23 |
| Smaller and Smaller Circles |         27 |
+-----------------------------+------------+
```

A case-insensitive search is a common use: lowercase the column and the search text, so capitals don't matter:

```sql
SELECT title FROM books WHERE LOWER(author) = 'jose rizal';
```

```text
+-------------------+
|       title       |
+-------------------+
| Noli Me Tangere   |
| El Filibusterismo |
+-------------------+
```

## Choosing a value: `CASE`

Sometimes you want different results for different rows, like a label for each book depending on its age. SQL's `CASE` expression works like an `if`/`elif`/`else` chain inside a query:

```sql
SELECT
	title,
	CASE
		WHEN published_year < 1900 THEN 'Classic'
		WHEN published_year < 1990 THEN 'Modern'
		ELSE 'Recent'
	END AS era
FROM books;
```

```text
+-----------------------------+---------+
|            title            |   era   |
+-----------------------------+---------+
| Noli Me Tangere             | Classic |
| El Filibusterismo           | Classic |
| The Little Prince           | Modern  |
| A Brief History of Time     | Modern  |
| Cosmos                      | Modern  |
| Smaller and Smaller Circles | Recent  |
+-----------------------------+---------+
```

`CASE` checks each `WHEN` from top to bottom and uses the first one that's true, just like the `elif` chains in the [Python track](/lessons/python/if-elif-else). `ELSE` catches everything else, and `END` closes it.

## Try it

This creates a small table of students and scores, and runs four queries using functions. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, functions.sql"
	min-height="460px"
	:model-value="'CREATE TABLE scores (first_name TEXT, last_name TEXT, points INTEGER, max_points INTEGER);\n\nINSERT INTO scores VALUES\n\t(\'maria\', \'santos\', 47, 50),\n\t(\'ben\', \'cruz\', 33, 50),\n\t(\'carlo\', \'reyes\', 50, 50);\n\n-- Query 1\nSELECT UPPER(SUBSTR(first_name, 1, 1)) || SUBSTR(first_name, 2) || \' \' || UPPER(last_name) AS name\nFROM scores;\n\n-- Query 2\nSELECT first_name, points / max_points AS wrong, ROUND(points * 100.0 / max_points, 1) AS percent\nFROM scores;\n\n-- Query 3\nSELECT first_name,\n\tCASE WHEN points = max_points THEN \'Perfect!\' WHEN points &gt;= 40 THEN \'Great\' ELSE \'Keep going\' END AS comment\nFROM scores;\n\n-- Query 4\nSELECT first_name, LENGTH(first_name || last_name) AS letters FROM scores ORDER BY letters DESC;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+--------------+
|     name     |
+--------------+
| Maria SANTOS |
| Ben CRUZ     |
| Carlo REYES  |
+--------------+
+------------+-------+---------+
| first_name | wrong | percent |
+------------+-------+---------+
| maria      |     0 |    94.0 |
| ben        |     0 |    66.0 |
| carlo      |     1 |   100.0 |
+------------+-------+---------+
+------------+------------+
| first_name |  comment   |
+------------+------------+
| maria      | Great      |
| ben        | Keep going |
| carlo      | Perfect!   |
+------------+------------+
+------------+---------+
| first_name | letters |
+------------+---------+
| maria      |      11 |
| carlo      |      10 |
| ben        |       7 |
+------------+---------+
```

Query 1 capitalizes each first letter by combining `UPPER`, `SUBSTR`, and `||`. In Query 2, the `wrong` column shows the division trap: only Carlo's perfect score divides to 1, and everyone else gets 0. Multiplying by `100.0` first makes it decimal division. Query 3's `CASE` stops at the first match, so Carlo is `Perfect!`, not `Great`.
:::

## Try it yourself

1. Show each book's title with the author's name in capitals, joined as `TITLE (AUTHOR)`.
2. Show each book's title and the percentage of its copies that are on the shelf, rounded to a whole number.
3. Label each book `'Long title'` or `'Short title'` depending on whether its title is longer than 12 characters.

## Check your understanding

<Quiz
	question="In SQLite, what is 9 / 2?"
	:options="['4.5', '5', 'An error', '4']"
	:answer-index="3"
	explanation="Two whole numbers give whole-number division in SQLite, so the fraction is thrown away. Write 9 / 2.0 or 9 * 1.0 / 2 for 4.5."
/>

<Quiz
	question="How do you join a first name and a last name with a space between them in SQLite?"
	:options="['first_name + \' \' + last_name', 'first_name || \' \' || last_name', 'JOIN(first_name, last_name)', 'first_name &amp; last_name']"
	:answer-index="1"
	explanation="|| joins text in SQLite and Oracle. MySQL uses CONCAT instead."
/>

<Quiz
	question="What does SUBSTR(&#39;Library&#39;, 1, 3) give back?"
	:options="['ibr', 'Libr', 'Lib', 'bra']"
	:answer-index="2"
	explanation="SQL counts characters from 1, so it starts at the first character and takes three."
/>

## Up next

Every function in this lesson works on one row at a time. But some questions are about **all** the rows at once: how many books are there, what's the average number of copies, which book is the oldest? Those need [Aggregates](/lessons/sqlite3/aggregates).
