---
title: "SQLite Dates and Times: date(), strftime(), and julianday()"
description: "Work with dates in SQLite: store them as ISO text, add and subtract days with date modifiers, count days between dates with julianday, and format them with strftime."
---

# Dates and Times in SQLite

*A library due-date stamp does math for you: today plus 14 days. And every morning, someone checks which stamps are already in the past.*

Dates are everywhere in the library database: when a member joined, when a book was lent, when it's due, when it came back. So far, you've compared them with `<` and `>`, which works because they're written as `'YYYY-MM-DD'` text. But a real library needs to do **math** with dates: when is a book due if it's lent today? How many days late is it? Which loans are from this month?

SQLite has a small set of date functions for exactly that.

## A due-date stamp

At a library desk, the librarian has a stamp that's set to "today plus 14 days." Every book that goes out gets stamped with its due date. And every morning, someone looks through the loans and asks: which of these due dates is before today?

Those are the two jobs you'll do most with dates: **calculate** a new date from an old one, and **compare** or **measure** the gap between two dates.

## How SQLite stores dates

As you learned in [Creating Tables](/lessons/sqlite3/create-table), SQLite has no special date type. Dates are stored as **text** in the international standard format, called **ISO 8601**:

- a date: `'2026-09-29'`
- a date and time: `'2026-09-29 14:30:00'`

Always use this format, with the year first and two-digit months and days. It's what SQLite's date functions understand, and because the biggest part comes first, dates written this way sort and compare correctly as plain text. `'2026-10-04' > '2026-09-29'` is true, just as it should be. Write dates as `'29/09/2026'`, and none of that works.

## Today's date

`date('now')` gives today's date, and `datetime('now')` gives the current date and time. (They use UTC, the world's standard time, not your local time; add `'localtime'`, like `date('now', 'localtime')`, for yours.)

Because "now" changes every second, the examples in this lesson use a fixed day, `'2026-09-29'`, so the answers are always the same. In a real app, you'd write `date('now')` in its place.

## Adding and subtracting: modifiers

`date()` can take a starting date and one or more **modifiers**, which move it:

```sql
SELECT
	date('2026-09-29', '+14 days') AS due,
	date('2026-09-29', '-1 month') AS month_ago,
	date('2026-09-29', '+1 year') AS next_year;
```

```text
+------------+------------+------------+
|    due     | month_ago  | next_year  |
+------------+------------+------------+
| 2026-10-13 | 2026-08-29 | 2027-09-29 |
+------------+------------+------------+
```

There are special modifiers too:

```sql
SELECT
	date('2026-09-29', 'start of month') AS first_of_month,
	date('2026-09-29', 'start of month', '+1 month', '-1 day') AS last_of_month;
```

```text
+----------------+---------------+
| first_of_month | last_of_month |
+----------------+---------------+
| 2026-09-01     | 2026-09-30    |
+----------------+---------------+
```

The second one chains three modifiers, applied in order: go to the first of this month, move forward a month, then back one day. That's a common trick for "the last day of this month."

The library's due-date stamp, as an `INSERT`:

```sql
INSERT INTO loans (book_id, member_id, loan_date, due_date)
VALUES (5, 5, '2026-09-29', date('2026-09-29', '+14 days'));

SELECT id, loan_date, due_date FROM loans WHERE member_id = 5;
```

```text
+----+------------+------------+
| id | loan_date  |  due_date  |
+----+------------+------------+
|  8 | 2026-09-29 | 2026-10-13 |
+----+------------+------------+
```

## Days between two dates: `julianday()`

To count the days between two dates, turn each into a **day number** with `julianday()` and subtract. (The Julian day is a count of days since a date thousands of years ago, which makes subtraction easy.)

```sql
SELECT julianday('2026-10-04') - julianday('2026-09-29') AS days;
```

```text
+------+
| days |
+------+
|  5.0 |
+------+
```

It gives a decimal, since dates can include times. Wrap it in `CAST(... AS INTEGER)` for a whole number of days. Here's the library's "overdue" report, as of our fixed day:

```sql
SELECT
	m.name,
	b.title,
	l.due_date,
	CAST(julianday('2026-09-29') - julianday(l.due_date) AS INTEGER) AS days_late
FROM loans l
JOIN members m ON l.member_id = m.id
JOIN books b ON l.book_id = b.id
WHERE l.returned_date IS NULL AND l.due_date < '2026-09-29'
ORDER BY days_late DESC;
```

```text
+-------------+-------------------------+------------+-----------+
|    name     |          title          |  due_date  | days_late |
+-------------+-------------------------+------------+-----------+
| Carlo Reyes | A Brief History of Time | 2026-09-24 |         5 |
| Ben Cruz    | Noli Me Tangere         | 2026-09-26 |         3 |
+-------------+-------------------------+------------+-----------+
```

Carlo's book was due on the 24th and Ben's on the 26th. The other two open loans aren't due yet, so the `WHERE` left them out.

## Pulling dates apart: `strftime()`

`strftime(format, date)` formats a date however you like, using codes that start with `%`:

| Code | Means | For `'2026-09-29'` |
|---|---|---|
| `%Y` | four-digit year | `2026` |
| `%m` | month, `01` to `12` | `09` |
| `%d` | day of the month | `29` |
| `%w` | day of the week, `0` is Sunday | `2` |
| `%j` | day of the year | `272` |

```sql
SELECT
	strftime('%d/%m/%Y', '2026-09-29') AS local_style,
	strftime('%Y', '2026-09-29') AS year,
	strftime('%w', '2026-09-29') AS weekday;
```

```text
+-------------+------+---------+
| local_style | year | weekday |
+-------------+------+---------+
| 29/09/2026  | 2026 | 2       |
+-------------+------+---------+
```

`strftime` gives back **text**, so `%Y` is the text `'2026'`, not a number. It's most useful for **grouping**: how many loans were made in each month?

```sql
SELECT strftime('%Y-%m', loan_date) AS month, COUNT(*) AS loans
FROM loans
GROUP BY month
ORDER BY month;
```

```text
+---------+-------+
|  month  | loans |
+---------+-------+
| 2026-08 |     1 |
| 2026-09 |     6 |
+---------+-------+
```

## Date functions in other databases

Dates are one of the places where every database does things differently. The *ideas* are the same everywhere, but the function names aren't:

- **MySQL** has real `DATE` and `DATETIME` types, and functions like `DATE_ADD(d, INTERVAL 14 DAY)` and `DATEDIFF(a, b)`.
- **Oracle** has a `DATE` type that always includes a time, and you can add days with plain `+`: `due_date + 14`.

The MySQL and Oracle tracks each cover their own versions.

## Try it

A class is tracking library books for a reading challenge. As of the fixed day `'2026-09-29'`, predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, dates.sql"
	min-height="460px"
	:model-value="'CREATE TABLE borrowed (student TEXT, book TEXT, loan_date TEXT);\n\nINSERT INTO borrowed VALUES\n\t(\'Maria\', \'Cosmos\', \'2026-09-08\'),\n\t(\'Ben\', \'Noli Me Tangere\', \'2026-09-20\'),\n\t(\'Carlo\', \'The Little Prince\', \'2026-08-30\');\n\n-- Query 1: due dates, two weeks after each loan\nSELECT student, loan_date, date(loan_date, \'+14 days\') AS due FROM borrowed;\n\n-- Query 2: overdue as of 2026-09-29, and by how many days\nSELECT student,\n\tCAST(julianday(\'2026-09-29\') - julianday(date(loan_date, \'+14 days\')) AS INTEGER) AS days_late\nFROM borrowed\nWHERE date(loan_date, \'+14 days\') &lt; \'2026-09-29\';\n\n-- Query 3: loans per month\nSELECT strftime(\'%m\', loan_date) AS month, COUNT(*) AS loans FROM borrowed GROUP BY month;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+---------+------------+------------+
| student | loan_date  |    due     |
+---------+------------+------------+
| Maria   | 2026-09-08 | 2026-09-22 |
| Ben     | 2026-09-20 | 2026-10-04 |
| Carlo   | 2026-08-30 | 2026-09-13 |
+---------+------------+------------+
+---------+-----------+
| student | days_late |
+---------+-----------+
| Maria   |         7 |
| Carlo   |        16 |
+---------+-----------+
+-------+-------+
| month | loans |
+-------+-------+
| 08    |     1 |
| 09    |     2 |
+-------+-------+
```

Carlo's due date crosses into September, which `date()` handles for you. Ben's book is due on October 4, so it isn't overdue yet and Query 2 leaves him out. Query 3 groups by the two-digit month text, `'08'` and `'09'`.
:::

## Try it yourself

1. In your library database, show each member's name and how many days they've been a member, as of `'2026-09-29'`.
2. Find every loan that was due in September 2026, using `strftime`.
3. Add a new loan for today using `date('now')` for the loan date and `date('now', '+14 days')` for the due date, then look at it. Is the date what you expected? (Remember that `'now'` uses UTC.)

## Check your understanding

<Quiz
	question="Why store dates as text like &#39;2026-09-29&#39; in SQLite?"
	:options="['It is the only way SQLite can store text', 'It uses less space than numbers', 'It stops invalid dates', 'SQLite\'s date functions understand it, and it sorts and compares correctly as text']"
	:answer-index="3"
	explanation="With the year first and two-digit months and days, text order is date order, and date(), julianday(), and strftime() all read it."
/>

<Quiz
	question="What does date(&#39;2026-09-29&#39;, &#39;+14 days&#39;) give?"
	:options="['2026-09-43', '2026-10-14', '2026-10-13', 'An error']"
	:answer-index="2"
	explanation="Modifiers do real calendar math, so 14 days after September 29 is October 13."
/>

<Quiz
	question="How do you count the days between two dates in SQLite?"
	:options="['julianday(date2) - julianday(date1)', 'date2 - date1', 'strftime(\'%d\', date2)', 'COUNT(date1, date2)']"
	:answer-index="0"
	explanation="julianday turns each date into a day number, so subtracting gives the days between them."
/>

## Up next

So far, you've typed every query into the shell yourself. Real apps run SQL from inside a program. Next, you'll do that from Python, which has SQLite built in, in [Using SQLite from Python](/lessons/sqlite3/sqlite-in-python).
