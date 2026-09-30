---
title: "SQL JOIN: Combine Rows from Several Tables"
description: "Combine data from several tables with SQL joins: match rows with INNER JOIN and ON, use table aliases, join three tables, and keep unmatched rows with LEFT JOIN."
---

# Combining Tables with JOIN

*A loan slip says "book 1, member 2." To know it means Noli Me Tangere lent to Ben, you look up two other drawers and put the answers side by side.*

In [Databases, Tables, and SQL](/lessons/sqlite3/databases-and-sql), you saw why the `loans` table stores numbers like `book_id = 1` and `member_id = 2` instead of copying out titles and names: each fact lives in exactly one place. That keeps the data correct, but it makes the `loans` table hard for people to read.

A **join** brings the information back together. It combines rows from two or more tables into one result, matching them up by their keys.

## Matching up the cards

Imagine a loan card that says "book 1, member 2." To make sense of it, you walk to the books drawer and find card 1: *Noli Me Tangere*. Then you walk to the members drawer and find card 2: *Ben Cruz*. You lay the three cards side by side, and now you can read the whole story.

A join does exactly that, for every loan at once.

## Your first join

```sql
SELECT loans.id, books.title, loans.due_date
FROM loans
JOIN books ON loans.book_id = books.id;
```

```text
+----+-----------------------------+------------+
| id |            title            |  due_date  |
+----+-----------------------------+------------+
|  1 | Noli Me Tangere             | 2026-09-15 |
|  2 | Noli Me Tangere             | 2026-09-26 |
|  3 | The Little Prince           | 2026-09-29 |
|  4 | A Brief History of Time     | 2026-09-03 |
|  5 | A Brief History of Time     | 2026-09-24 |
|  6 | Smaller and Smaller Circles | 2026-10-04 |
|  7 | El Filibusterismo           | 2026-09-15 |
+----+-----------------------------+------------+
```

Reading it piece by piece:

- `FROM loans JOIN books` says "combine the loans table with the books table."
- `ON loans.book_id = books.id` is the **join condition**: it says how the rows match up. A loan row goes with the book row whose `id` equals the loan's `book_id`.
- Because both tables have a column called `id`, each column is written with its table's name in front, `loans.id` and `books.id`, so there's no confusion about which one you mean.

For each loan, the database finds the matching book and puts them together into one wider row. Then `SELECT` picks which columns to show.

## Table aliases

Writing out `loans.` and `books.` everywhere gets long. You can give each table a short nickname, called an **alias**, right after its name in `FROM` and `JOIN`:

```sql
SELECT l.id, b.title, l.due_date
FROM loans l
JOIN books b ON l.book_id = b.id
WHERE l.returned_date IS NULL;
```

```text
+----+-----------------------------+------------+
| id |            title            |  due_date  |
+----+-----------------------------+------------+
|  2 | Noli Me Tangere             | 2026-09-26 |
|  3 | The Little Prince           | 2026-09-29 |
|  5 | A Brief History of Time     | 2026-09-24 |
|  6 | Smaller and Smaller Circles | 2026-10-04 |
+----+-----------------------------+------------+
```

`loans l` means "call the loans table `l` in this query." Short aliases like this are extremely common in real SQL. This query also shows that everything you already know still works with joins: here, `WHERE` keeps only the loans still out.

If you leave off the table name on a column that exists in both tables, SQLite can't tell which one you mean:

```sql
SELECT id FROM loans l JOIN books b ON l.book_id = b.id;  -- error: ambiguous column name: id
```

## Joining three tables

To put the book title **and** the member's name next to each loan, join both tables. Each `JOIN` adds one more drawer:

```sql
SELECT m.name, b.title, l.due_date
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN members m ON l.member_id = m.id
WHERE l.returned_date IS NULL
ORDER BY l.due_date;
```

```text
+--------------+-----------------------------+------------+
|     name     |            title            |  due_date  |
+--------------+-----------------------------+------------+
| Carlo Reyes  | A Brief History of Time     | 2026-09-24 |
| Ben Cruz     | Noli Me Tangere             | 2026-09-26 |
| Maria Santos | The Little Prince           | 2026-09-29 |
| Ben Cruz     | Smaller and Smaller Circles | 2026-10-04 |
+--------------+-----------------------------+------------+
```

Now the loans table reads like a sentence: who has which book, and when it's due. This query is exactly what a real library system would run to show its "books currently out" screen.

## Joins with `GROUP BY`

Remember the loans-per-member count from [Grouping with GROUP BY and HAVING](/lessons/sqlite3/group-by), which only showed member numbers? Add a join, and the names appear:

```sql
SELECT m.name, COUNT(*) AS loans
FROM loans l
JOIN members m ON l.member_id = m.id
GROUP BY m.id, m.name
ORDER BY loans DESC, m.name;
```

```text
+--------------+-------+
|     name     | loans |
+--------------+-------+
| Ben Cruz     |     2 |
| Carlo Reyes  |     2 |
| Maria Santos |     2 |
| Dina Lim     |     1 |
+--------------+-------+
```

The join happens first, then the grouping. Grouping by `m.id` as well as `m.name` makes sure two members who happen to share a name would still be counted separately.

## Who's missing? `LEFT JOIN`

Look closely at that last result. There are five members, but only four appear. Eli Tan has never borrowed a book, so there's no loan row to match with him, and a normal join leaves him out.

A normal `JOIN` (also called an **inner join**, and you can write it as `INNER JOIN`) only keeps rows that have a match on **both** sides. When you want to keep every row from the first table, even the ones with no match, use a **`LEFT JOIN`**:

```sql
SELECT m.name, COUNT(l.id) AS loans
FROM members m
LEFT JOIN loans l ON l.member_id = m.id
GROUP BY m.id, m.name
ORDER BY loans DESC, m.name;
```

```text
+--------------+-------+
|     name     | loans |
+--------------+-------+
| Ben Cruz     |     2 |
| Carlo Reyes  |     2 |
| Maria Santos |     2 |
| Dina Lim     |     1 |
| Eli Tan      |     0 |
+--------------+-------+
```

Two changes made this work:

- `members` is now the first table, the **left** one, since it's the one we want every row of. `LEFT JOIN loans` keeps every member, matched to their loans if they have any.
- For a member with no loans, the loan columns are filled with `NULL`. `COUNT(l.id)` skips `NULL`s (as you saw in [Aggregates](/lessons/sqlite3/aggregates)), so Eli gets `0`. `COUNT(*)` would have counted his one row and given him `1`.

## Finding what has no match

`LEFT JOIN` plus `IS NULL` is a handy way to find things that have **no** match at all. Which books have never been borrowed?

```sql
SELECT b.title
FROM books b
LEFT JOIN loans l ON l.book_id = b.id
WHERE l.id IS NULL;
```

```text
+--------+
| title  |
+--------+
| Cosmos |
+--------+
```

Every book is kept by the `LEFT JOIN`, and books with no loans get `NULL` in every loan column. Then `WHERE l.id IS NULL` keeps only those.

## Other kinds of joins

You'll meet a few other join types in other people's SQL:

- **`RIGHT JOIN`** is a `LEFT JOIN` with the tables the other way around. Most people just swap the tables and use `LEFT JOIN`, which reads more naturally.
- **`FULL OUTER JOIN`** keeps unmatched rows from **both** sides.
- **`CROSS JOIN`** pairs every row of one table with every row of the other, with no condition. Six books crossed with five members makes 30 rows. It's occasionally useful, but a join where you forget the `ON` condition can do this by accident, and on big tables, the result gets enormous.

SQLite has supported `RIGHT` and `FULL OUTER JOIN` since version 3.39, from 2022, so any recent version has them. `INNER JOIN` and `LEFT JOIN` cover the vast majority of real queries.

## Try it

The editor creates small `students`, `clubs`, and `memberships` tables, then runs three joins. Predict each result, row by row.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, joins.sql"
	min-height="480px"
	:model-value="'CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT);\nCREATE TABLE clubs (id INTEGER PRIMARY KEY, club TEXT);\nCREATE TABLE memberships (student_id INTEGER, club_id INTEGER);\n\nINSERT INTO students VALUES (1, \'Ana\'), (2, \'Ben\'), (3, \'Carlo\'), (4, \'Dina\');\nINSERT INTO clubs VALUES (1, \'Chess\'), (2, \'Robotics\'), (3, \'Drama\');\nINSERT INTO memberships VALUES (1, 1), (1, 2), (2, 1), (3, 2);\n\n-- Query 1: who is in which club?\nSELECT s.name, c.club\nFROM memberships m\nJOIN students s ON m.student_id = s.id\nJOIN clubs c ON m.club_id = c.id\nORDER BY s.name, c.club;\n\n-- Query 2: every student, with how many clubs they\'re in\nSELECT s.name, COUNT(m.club_id) AS clubs\nFROM students s\nLEFT JOIN memberships m ON m.student_id = s.id\nGROUP BY s.id, s.name;\n\n-- Query 3: clubs with no members\nSELECT c.club\nFROM clubs c\nLEFT JOIN memberships m ON m.club_id = c.id\nWHERE m.student_id IS NULL;\n'"
/>

The `memberships` table connects the other two: each row says "this student is in this club." A table like that, which links two others, is how databases store **many-to-many** relationships, where a student can join many clubs and a club can have many students.

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+-------+----------+
| name  |   club   |
+-------+----------+
| Ana   | Chess    |
| Ana   | Robotics |
| Ben   | Chess    |
| Carlo | Robotics |
+-------+----------+
+-------+-------+
| name  | clubs |
+-------+-------+
| Ana   |     2 |
| Ben   |     1 |
| Carlo |     1 |
| Dina  |     0 |
+-------+-------+
+-------+
| club  |
+-------+
| Drama |
+-------+
```

Query 1 uses the link table twice over: once to find each membership's student, once for its club. Ana appears twice, since she's in two clubs, and Dina not at all. Query 2's `LEFT JOIN` keeps Dina, with 0 clubs. And Query 3 finds Drama, the only club with no matching membership.
:::

## Try it yourself

1. In your library database, show every loan with the member's name and the book's title, including returned ones, sorted by loan date.
2. Show each book's title with how many times it has been borrowed, including books that have never been borrowed.
3. Find the names of members who have never borrowed a book.

## Check your understanding

<Quiz
	question="What does the ON part of a join do?"
	:options="['Says how rows from the two tables match up', 'Filters the final results', 'Names the tables', 'Sorts the result']"
	:answer-index="0"
	explanation="ON gives the join condition, like loans.book_id = books.id, so each loan is paired with its own book."
/>

<Quiz
	question="A member has no loans. What happens to them in members JOIN loans?"
	:options="['They appear with NULL loan columns', 'They appear twice', 'The query fails', 'They are left out, because an inner join only keeps rows with a match']"
	:answer-index="3"
	explanation="An inner join needs a match on both sides. Use LEFT JOIN to keep every member."
/>

<Quiz
	question="With members LEFT JOIN loans and GROUP BY member, why use COUNT(l.id) instead of COUNT(*)?"
	:options="['COUNT(*) does not work with joins', 'COUNT(l.id) skips the NULL loan columns, so a member with no loans gets 0 instead of 1', 'COUNT(l.id) is faster', 'There is no difference']"
	:answer-index="1"
	explanation="A member with no loans still has one row, full of NULLs. COUNT(*) counts that row; COUNT(l.id) doesn't."
/>

## Up next

Some questions need an answer to another question first: which books are newer than the average book? Which members borrowed the most popular book? For those, you can put one query inside another, in [Subqueries](/lessons/sqlite3/subqueries).
