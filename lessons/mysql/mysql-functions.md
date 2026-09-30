---
title: "MySQL Functions: CONCAT, DATE_FORMAT, IF, GROUP_CONCAT, and More"
description: "Use MySQL's built-in functions for text (CONCAT, SUBSTRING, LPAD), numbers (ROUND, MOD), dates (DATE_ADD, DATEDIFF, DATE_FORMAT), choices (IF, COALESCE, CASE), and GROUP_CONCAT."
---

# MySQL Functions: Strings, Dates, and More

*A Swiss Army knife folds out a blade, a screwdriver, and a bottle opener. MySQL's functions are the same idea: small, ready-made tools you call by name.*

A **function** takes some values, does a job, and gives back a result. You've already used `COUNT`, `SUM`, and `CONCAT`. MySQL has hundreds more. This lesson covers the ones you'll reach for most, grouped by what they work on.

The examples use a small table of customers and orders:

```sql
SELECT * FROM customers;
SELECT * FROM orders;
```

```text
+----+------------+-----------+----------------------+---------------+
| id | first_name | last_name | email                | phone         |
+----+------------+-----------+----------------------+---------------+
|  1 | Maria      | Santos    | maria@example.com    | 0917-555-0142 |
|  2 | Ben        | Cruz      | BEN.CRUZ@Example.com | NULL          |
|  3 | Carlo      | Reyes     | NULL                 | 0918-555-0177 |
|  4 | Dina       | Lim       | dina@example.com     | NULL          |
+----+------------+-----------+----------------------+---------------+
+----+-------------+---------+---------------------+-----------+
| id | customer_id | total   | ordered_at          | status    |
+----+-------------+---------+---------------------+-----------+
|  1 |           1 | 1250.50 | 2026-09-03 10:15:00 | paid      |
|  2 |           1 |   89.99 | 2026-09-20 18:40:00 | paid      |
|  3 |           2 |  430.00 | 2026-09-12 09:05:00 | shipped   |
|  4 |           3 |   15.75 | 2026-09-25 22:10:00 | cancelled |
|  5 |           2 | 2600.00 | 2026-10-01 14:30:00 | paid      |
+----+-------------+---------+---------------------+-----------+
```

## Text functions

```sql
SELECT
    CONCAT(first_name, ' ', last_name) AS full_name,
    UPPER(last_name) AS shout,
    LOWER(email) AS email_lower,
    CHAR_LENGTH(first_name) AS letters
FROM customers;
```

```text
+--------------+--------+----------------------+---------+
| full_name    | shout  | email_lower          | letters |
+--------------+--------+----------------------+---------+
| Maria Santos | SANTOS | maria@example.com    |       5 |
| Ben Cruz     | CRUZ   | ben.cruz@example.com |       3 |
| Carlo Reyes  | REYES  | NULL                 |       5 |
| Dina Lim     | LIM    | dina@example.com     |       4 |
+--------------+--------+----------------------+---------+
```

- `CONCAT(a, b, ...)` joins values. If **any** of them is `NULL`, the whole result is `NULL`.
- `CONCAT_WS(separator, a, b, ...)` ("with separator") joins values with a separator between them, and **skips** `NULL`s.
- `CHAR_LENGTH` counts characters. `LENGTH` counts **bytes**, which is bigger for letters like `é`, so use `CHAR_LENGTH` for text.

```sql
SELECT
    CONCAT(first_name, ' ', phone) AS with_concat,
    CONCAT_WS(' - ', first_name, phone, email) AS with_concat_ws
FROM customers;
```

```text
+---------------------+-------------------------------------------+
| with_concat         | with_concat_ws                            |
+---------------------+-------------------------------------------+
| Maria 0917-555-0142 | Maria - 0917-555-0142 - maria@example.com |
| NULL                | Ben - BEN.CRUZ@Example.com                |
| Carlo 0918-555-0177 | Carlo - 0918-555-0177                     |
| NULL                | Dina - dina@example.com                   |
+---------------------+-------------------------------------------+
```

More text tools you'll use often:

```sql
SELECT
    TRIM('   padded   ') AS trimmed,
    LEFT('Noli Me Tangere', 4) AS first_four,
    SUBSTRING('Noli Me Tangere', 6, 2) AS middle,
    REPLACE('2026-09-03', '-', '/') AS swapped,
    LPAD('42', 6, '0') AS padded_zeros,
    FORMAT(1234567.891, 2) AS pretty_number;
```

```text
+---------+------------+--------+------------+--------------+---------------+
| trimmed | first_four | middle | swapped    | padded_zeros | pretty_number |
+---------+------------+--------+------------+--------------+---------------+
| padded  | Noli       | Me     | 2026/09/03 | 000042       | 1,234,567.89  |
+---------+------------+--------+------------+--------------+---------------+
```

Positions in `SUBSTRING` start at **1**, not 0. `FORMAT` adds thousands separators, and turns a number into text, so use it for display only, never for calculating.

## Number functions

```sql
SELECT
    ROUND(2.567, 2) AS rounded,
    ROUND(1250.5) AS whole,
    CEILING(2.1) AS rounded_up,
    FLOOR(2.9) AS rounded_down,
    ABS(-7) AS absolute,
    MOD(17, 5) AS remainder,
    17 DIV 5 AS whole_division,
    TRUNCATE(2.999, 1) AS cut_off;
```

```text
+---------+-------+------------+--------------+----------+-----------+----------------+---------+
| rounded | whole | rounded_up | rounded_down | absolute | remainder | whole_division | cut_off |
+---------+-------+------------+--------------+----------+-----------+----------------+---------+
|    2.57 |  1251 |          3 |            2 |        7 |         2 |              3 |     2.9 |
+---------+-------+------------+--------------+----------+-----------+----------------+---------+
```

Notice `17 DIV 5`. The plain `/` operator gives a decimal (`17 / 5` is `3.4000`), while `DIV` does whole-number division, dropping the remainder. `ROUND(1250.5)` gives `1251`, since exact `DECIMAL` values round halves away from zero.

## Date and time functions

MySQL is rich in date tools. The functions that return "now" give a different answer each time you run them, so the examples below use fixed dates.

- `NOW()` is the current date and time, `CURDATE()` is today's date, and `CURTIME()` is the current time.
- `YEAR()`, `MONTH()`, `DAY()`, `HOUR()` pick parts out of a date.
- `DATE_ADD(date, INTERVAL n unit)` and `DATE_SUB` add and subtract time. Units include `DAY`, `WEEK`, `MONTH`, and `YEAR`.
- `DATEDIFF(later, earlier)` counts the days between two dates.
- `DATE_FORMAT(date, pattern)` turns a date into text, in any layout you like.

```sql
SELECT
    id,
    ordered_at,
    DATE(ordered_at) AS day_only,
    MONTH(ordered_at) AS month_number,
    DATE_ADD(ordered_at, INTERVAL 14 DAY) AS return_by,
    DATEDIFF('2026-10-15', ordered_at) AS days_ago
FROM orders
WHERE id <= 3;
```

```text
+----+---------------------+------------+--------------+---------------------+----------+
| id | ordered_at          | day_only   | month_number | return_by           | days_ago |
+----+---------------------+------------+--------------+---------------------+----------+
|  1 | 2026-09-03 10:15:00 | 2026-09-03 |            9 | 2026-09-17 10:15:00 |       42 |
|  2 | 2026-09-20 18:40:00 | 2026-09-20 |            9 | 2026-10-04 18:40:00 |       25 |
|  3 | 2026-09-12 09:05:00 | 2026-09-12 |            9 | 2026-09-26 09:05:00 |       33 |
+----+---------------------+------------+--------------+---------------------+----------+
```

`DATE_FORMAT` uses percent codes: `%Y` is the 4-digit year, `%m` the 2-digit month, `%d` the day, `%M` the month's name, `%b` its short name, `%W` the weekday name, `%H` the hour (24-hour clock), and `%i` the minutes.

```sql
SELECT
    DATE_FORMAT(ordered_at, '%Y/%m/%d') AS slashed,
    DATE_FORMAT(ordered_at, '%M %e, %Y') AS long_date,
    DATE_FORMAT(ordered_at, '%W, %H:%i') AS weekday_time
FROM orders
WHERE id = 1;
```

```text
+------------+-------------------+-----------------+
| slashed    | long_date         | weekday_time    |
+------------+-------------------+-----------------+
| 2026/09/03 | September 3, 2026 | Thursday, 10:15 |
+------------+-------------------+-----------------+
```

A common job: total per month. Use `DATE_FORMAT` to make a `YYYY-MM` label to group by:

```sql
SELECT
    DATE_FORMAT(ordered_at, '%Y-%m') AS month,
    COUNT(*) AS orders,
    SUM(total) AS revenue
FROM orders
WHERE status <> 'cancelled'
GROUP BY DATE_FORMAT(ordered_at, '%Y-%m')
ORDER BY month;
```

```text
+---------+--------+---------+
| month   | orders | revenue |
+---------+--------+---------+
| 2026-09 |      3 | 1770.49 |
| 2026-10 |      1 | 2600.00 |
+---------+--------+---------+
```

## Making choices: IF, COALESCE, CASE

`IF(condition, value_if_true, value_if_false)` is a quick either/or. `IFNULL(value, replacement)` and the more general `COALESCE(a, b, c, ...)` replace `NULL` with the first value that isn't. For several branches, use `CASE`, which you met in the SQLite track:

```sql
SELECT
    first_name,
    IF(phone IS NULL, 'no phone', 'has phone') AS phone_status,
    COALESCE(email, phone, 'no contact') AS best_contact
FROM customers;
```

```text
+------------+--------------+----------------------+
| first_name | phone_status | best_contact         |
+------------+--------------+----------------------+
| Maria      | has phone    | maria@example.com    |
| Ben        | no phone     | BEN.CRUZ@Example.com |
| Carlo      | has phone    | 0918-555-0177        |
| Dina       | no phone     | dina@example.com     |
+------------+--------------+----------------------+
```

```sql
SELECT
    id,
    total,
    CASE
        WHEN total >= 1000 THEN 'big'
        WHEN total >= 100 THEN 'medium'
        ELSE 'small'
    END AS size
FROM orders
ORDER BY id;
```

```text
+----+---------+--------+
| id | total   | size   |
+----+---------+--------+
|  1 | 1250.50 | big    |
|  2 |   89.99 | small  |
|  3 |  430.00 | medium |
|  4 |   15.75 | small  |
|  5 | 2600.00 | big    |
+----+---------+--------+
```

## GROUP_CONCAT: many rows, one text

`GROUP_CONCAT` is a MySQL favorite. It joins the values from a group into one text, which is handy for lists:

```sql
SELECT
    c.first_name,
    COUNT(o.id) AS orders,
    GROUP_CONCAT(o.status ORDER BY o.ordered_at SEPARATOR ', ') AS statuses
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.first_name
ORDER BY c.id;
```

```text
+------------+--------+---------------+
| first_name | orders | statuses      |
+------------+--------+---------------+
| Maria      |      2 | paid, paid    |
| Ben        |      2 | shipped, paid |
| Carlo      |      1 | cancelled     |
| Dina       |      0 | NULL          |
+------------+--------+---------------+
```

By default, the result is cut off after 1,024 characters, which surprises people with long lists. It's controlled by a setting called `group_concat_max_len`.

## Try it

A shop prints a label for each paid order. Predict each column of the result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, labels.sql"
	min-height="380px"
	:model-value="'SELECT\n    CONCAT(\'#\', LPAD(o.id, 4, \'0\')) AS order_no,\n    CONCAT_WS(\' \', c.first_name, UPPER(c.last_name)) AS customer,\n    COALESCE(LOWER(c.email), \'no email\') AS email,\n    DATE_FORMAT(o.ordered_at, \'%b %e\') AS placed,\n    DATEDIFF(\'2026-10-15\', o.ordered_at) AS days_ago,\n    FORMAT(o.total, 2) AS total,\n    IF(o.total &gt;= 1000, \'priority\', \'standard\') AS shipping\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = \'paid\'\nORDER BY o.ordered_at;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), create the two tables from the top of this lesson, and run the query in the `mysql` client.
:::

::: details Check your prediction
```text
+----------+--------------+----------------------+--------+----------+----------+----------+
| order_no | customer     | email                | placed | days_ago | total    | shipping |
+----------+--------------+----------------------+--------+----------+----------+----------+
| #0001    | Maria SANTOS | maria@example.com    | Sep 3  |       42 | 1,250.50 | priority |
| #0002    | Maria SANTOS | maria@example.com    | Sep 20 |       25 | 89.99    | standard |
| #0005    | Ben CRUZ     | ben.cruz@example.com | Oct 1  |       14 | 2,600.00 | priority |
+----------+--------------+----------------------+--------+----------+----------+----------+
```

Only the three `paid` orders appear. `LPAD` pads the ID with zeros to 4 characters. `CONCAT_WS` builds the customer's name, and `UPPER` shouts the last name. Ben's email is lowercased, and `COALESCE` would give `no email` for anyone without one. `FORMAT` adds the comma to 2,600.00 and turns the total into text. Only totals of 1000 or more are `priority`.
:::

## Try it yourself

1. Add a column that shows the order's weekday name, using `DATE_FORMAT` with `%W`.
2. Change the query to show every order, including cancelled ones, with a column that says `refund needed` when the status is `cancelled`, and `ok` otherwise.
3. Write a query that lists each customer's email domain (the part after `@`), using `SUBSTRING_INDEX(email, '@', -1)`. What does Carlo's row show, and why?

## Check your understanding

<Quiz
	question="What does CONCAT(&#39;Hi &#39;, NULL) return?"
	:options="['Hi', 'An error', 'Hi NULL', 'NULL']"
	:answer-index="3"
	explanation="If any argument to CONCAT is NULL, the result is NULL. CONCAT_WS skips NULLs instead."
/>

<Quiz
	question="Which function counts the days between two dates?"
	:options="['DATE_ADD', 'DATEDIFF', 'DATE_FORMAT', 'DAY']"
	:answer-index="1"
	explanation="DATEDIFF(later, earlier) returns the number of days between them."
/>

<Quiz
	question="What does 17 DIV 5 return?"
	:options="['3.4', '3', '2', '3.4000']"
	:answer-index="1"
	explanation="DIV is whole-number division, so it drops the remainder: 17 divided by 5 is 3, remainder 2."
/>

## Up next

Sometimes you want to insert a row, or update it if it's already there. MySQL has a neat trick for that, in [Upserts with ON DUPLICATE KEY UPDATE](/lessons/mysql/upserts).
