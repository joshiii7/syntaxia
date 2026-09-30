---
title: "SQL and SQLite Best Practices and Common Mistakes"
description: "Write SQL that's clear, correct, and safe: naming and formatting habits, protecting your data with constraints and transactions, and the SQL mistakes almost everyone makes."
---

# Best Practices and Common Mistakes

*A tidy library isn't just nice to look at. When every book is labeled and shelved in its place, anyone can find anything, and nothing goes missing.*

You've learned a lot of SQL: reading data with `SELECT`, filtering, sorting, summarizing, and joining; creating tables and changing data; designing a database, guarding it with constraints, and keeping it fast and correct. You've also learned SQLite's own quirks, and how to use it from Python.

This lesson collects the habits that turn working SQL into **good** SQL, plus a checklist of the mistakes that trip up almost everyone. None of it is new syntax. It's the difference between a database that stays trustworthy for years and one that slowly fills up with surprises.

## A tidy library

In a well-run library, every book has a label, every shelf has a sign, and books go back exactly where they belong. When someone new starts working there, they can find anything on their first day. Nothing is lost, and nothing is shelved twice.

A database is the same. Clear names, a sensible design, and firm rules mean the next person, often you, six months from now, can understand it at a glance and trust what it says.

## Naming

Pick one naming style and stick to it everywhere. The most common, and the one this track uses:

| Thing | Style | Examples |
|---|---|---|
| tables | lowercase, plural, snake_case | `members`, `club_memberships` |
| columns | lowercase, snake_case | `due_date`, `copies_owned` |
| primary keys | `id` | `members.id` |
| foreign keys | the other table, singular, plus `_id` | `loans.member_id`, `loans.book_id` |
| indexes | `idx_` plus table and column | `idx_loans_member_id` |

Avoid names that are SQL keywords, like `order`, `group`, or `date`, and avoid spaces in names. Both need special quoting, and the quoting rules differ between databases. `orders`, `grouping`, and `due_date` work everywhere.

## Formatting SQL

SQL doesn't care about capitals or line breaks, but people do. For anything longer than one line:

- write **keywords in capitals** and names in lowercase;
- put **each clause on its own line**: `SELECT`, `FROM`, `JOIN`, `WHERE`, `GROUP BY`, `ORDER BY`;
- indent the list of columns and the join conditions.

```sql
SELECT
	m.name,
	COUNT(l.id) AS open_loans
FROM members m
LEFT JOIN loans l
	ON l.member_id = m.id
	AND l.returned_date IS NULL
GROUP BY m.id, m.name
ORDER BY open_loans DESC, m.name;
```

```text
+--------------+------------+
|     name     | open_loans |
+--------------+------------+
| Ben Cruz     |          2 |
| Carlo Reyes  |          1 |
| Maria Santos |          1 |
| Dina Lim     |          0 |
| Eli Tan      |          0 |
+--------------+------------+
```

Compare that with the same query on one line: `select m.name,count(l.id) as open_loans from members m left join loans l on l.member_id=m.id and l.returned_date is null group by m.id,m.name order by open_loans desc,m.name;`. It works, but you have to read it three times.

## Reading data

- **Name your columns** instead of using `SELECT *` in anything but a quick look. The query says what it's for, and it won't change behavior when a column is added.
- **Always `ORDER BY` when order matters**, and always with `LIMIT`. SQL never promises an order otherwise.
- **Use `IS NULL`, never `= NULL`.** And remember that `COUNT(column)`, `SUM`, and `AVG` skip `NULL`s.
- **Give calculated columns names** with `AS`.

## Changing data

- **Write the `SELECT` first.** Before any `UPDATE` or `DELETE`, run a `SELECT` with the same `WHERE`, and check it finds exactly the rows you mean.
- **Never run `UPDATE` or `DELETE` without a `WHERE`** unless you really mean every row.
- **Name the columns in every `INSERT`.**
- **Group related changes in a transaction**, so they succeed or fail together.

## Protecting your data

Let the database enforce your rules, so no program, script, or tired person can break them:

- a **primary key** on every table;
- **`NOT NULL`** on every column that must have a value;
- **`UNIQUE`** where duplicates make no sense, like emails;
- **`CHECK`** for ranges, like scores and quantities;
- **foreign keys** for every relationship, and in SQLite, **`PRAGMA foreign_keys = ON;`** on every connection;
- **`STRICT` tables** for new SQLite databases, so types are enforced.

And keep **backups**. An SQLite backup is a copy of the database file, made while nothing is writing to it. The shell's `.backup backup.db` command makes a safe copy even while the database is in use.

## Security

From [Using SQLite from Python](/lessons/sqlite3/sqlite-in-python), the most important rule of all: **never build SQL by joining strings with values from users.** Always use placeholders, like `?` in Python's `sqlite3`. SQL injection is one of the most common ways real websites are broken into, and placeholders prevent it completely.

## The mistakes almost everyone makes

When a query gives a strange answer, run down this list. Each one came up somewhere in this track.

1. **`= NULL` instead of `IS NULL`.** It never matches anything. ([Working with NULL](/lessons/sqlite3/null))
2. **`UPDATE` or `DELETE` without `WHERE`**, changing every row. ([INSERT, UPDATE, and DELETE](/lessons/sqlite3/insert-update-delete))
3. **Mixing `AND` and `OR` without parentheses.** `AND` goes first. ([Filtering Rows with WHERE](/lessons/sqlite3/where))
4. **`LIMIT` without `ORDER BY`**, so "the top 3" is really "any 3." ([Sorting and Limiting Results](/lessons/sqlite3/order-by-and-limit))
5. **Whole-number division** in SQLite: `7 / 2` is `3`. Multiply by `1.0` first. ([Built-in Functions](/lessons/sqlite3/functions))
6. **Selecting a column that isn't grouped or aggregated** in a `GROUP BY` query. ([Grouping with GROUP BY and HAVING](/lessons/sqlite3/group-by))
7. **`WHERE COUNT(*) > 1` instead of `HAVING`.** `WHERE` runs before the counting. ([Grouping with GROUP BY and HAVING](/lessons/sqlite3/group-by))
8. **An inner join that silently drops rows**, like members with no loans. Use `LEFT JOIN`, and `COUNT(column)`, not `COUNT(*)`. ([Combining Tables with JOIN](/lessons/sqlite3/joins))
9. **Forgetting `PRAGMA foreign_keys = ON;`** in SQLite, so foreign keys are never checked. ([SQLite Settings with PRAGMA](/lessons/sqlite3/pragma))
10. **`NOT IN` with a `NULL` in the list**, which matches nothing. ([Subqueries](/lessons/sqlite3/subqueries))
11. **Double quotes for text.** Use single quotes: `'Novel'`. Double quotes mean names in standard SQL. ([SELECT: Reading Data](/lessons/sqlite3/select))
12. **Dates not in `YYYY-MM-DD` form**, so they don't sort or compare correctly. ([Dates and Times in SQLite](/lessons/sqlite3/dates-and-times))
13. **Forgetting to `commit()`** in a program, so nothing is saved. ([Using SQLite from Python](/lessons/sqlite3/sqlite-in-python))

## Try it

This report is meant to show every member with the number of books they have **out right now**, members with none included, most first. It runs without errors, but it has **two bugs**. Predict what it actually shows, then find both bugs.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, report.sql"
	min-height="420px"
	:model-value="'CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT);\nCREATE TABLE loans (id INTEGER PRIMARY KEY, member_id INTEGER, returned_date TEXT);\n\nINSERT INTO members VALUES (1, \'Maria\'), (2, \'Ben\'), (3, \'Carlo\'), (4, \'Eli\');\nINSERT INTO loans VALUES\n\t(1, 1, \'2026-09-10\'),\n\t(2, 1, NULL),\n\t(3, 2, NULL),\n\t(4, 2, NULL),\n\t(5, 3, \'2026-09-05\');\n\nSELECT m.name, COUNT(*) AS books_out\nFROM members m\nJOIN loans l ON l.member_id = m.id\nWHERE l.returned_date = NULL OR l.returned_date IS NOT NULL\nGROUP BY m.id, m.name\nORDER BY books_out DESC, m.name;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+-------+-----------+
| name  | books_out |
+-------+-----------+
| Carlo |         1 |
| Maria |         1 |
+-------+-----------+
```

The report is backwards. It counts only the books that have been **returned**, so Ben, who has two books out right now, vanishes completely, and so does Eli. The two bugs:

1. **The `WHERE` keeps the wrong loans.** `returned_date = NULL` never matches anything, so the only loans that get through are the ones where `IS NOT NULL` is true: the returned ones. The intent was `l.returned_date IS NULL`.
2. **The inner `JOIN` drops members with no loans**, like Eli. It needs a `LEFT JOIN`, with the "still out" condition moved into the `ON` (in the `WHERE`, it would throw Eli out again), and `COUNT(l.id)` instead of `COUNT(*)`.

Here's the fixed query, and its result:

```sql
SELECT m.name, COUNT(l.id) AS books_out
FROM members m
LEFT JOIN loans l
	ON l.member_id = m.id
	AND l.returned_date IS NULL
GROUP BY m.id, m.name
ORDER BY books_out DESC, m.name;
```

It's the same shape as the formatted example earlier in this lesson. On the Try it's tables, it gives Ben 2, Maria 1, and Carlo and Eli 0.
:::

## Try it yourself

1. Run the fixed query from the answer on your library database. Who has the most books out?
2. Look back at a table you created in this track. Does it follow the naming habits above? Does every column that must have a value have `NOT NULL`?
3. Write the `SELECT` you'd run before deleting every loan returned before `'2026-09-06'`. How many rows does it find?

## Check your understanding

<Quiz
	question="What should you run before an UPDATE or DELETE?"
	:options="['DROP TABLE', 'PRAGMA integrity_check', 'Nothing, SQL asks you to confirm', 'A SELECT with the same WHERE, to check exactly which rows will change']"
	:answer-index="3"
	explanation="If the SELECT finds the right rows, the UPDATE or DELETE with the same WHERE will change exactly those."
/>

<Quiz
	question="A report of members and their loan counts is missing members who have no loans. What is the likely fix?"
	:options="['Use a LEFT JOIN and COUNT(loans.id)', 'Add DISTINCT', 'Use ORDER BY', 'Add LIMIT']"
	:answer-index="0"
	explanation="An inner join drops rows with no match. LEFT JOIN keeps every member, and COUNT of a loan column gives them 0."
/>

<Quiz
	question="Which foreign key column name follows the naming habit in this lesson?"
	:options="['MemberID', 'members', 'member_id', 'fk1']"
	:answer-index="2"
	explanation="Foreign keys are named after the other table, singular, plus _id, in lowercase snake_case."
/>

## Up next

That's everything. You have the whole SQL toolkit, and the habits to use it well. Time to design and build a complete database of your own: [Final Project: School Library Database](/lessons/sqlite3/final-project).
