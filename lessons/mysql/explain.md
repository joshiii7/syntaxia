---
title: "MySQL EXPLAIN: Understand and Speed Up Slow Queries with Indexes"
description: "Read MySQL's EXPLAIN output in both tree and table formats to see whether a query scans the whole table or uses an index, add indexes to speed it up, and avoid common traps like functions on indexed columns."
---

# Query Performance with EXPLAIN

*A librarian looking for one book can walk down every shelf, or check the catalog and go straight to the right one. EXPLAIN tells you which the librarian is doing.*

With a few dozen rows, every query is instant. With a few million, some queries take seconds, and some take hours. The difference is usually not the computer. It's whether MySQL can **find** the rows it needs quickly, or has to look at all of them.

You learned what an **index** is in the SQLite track's [Indexes](/lessons/sqlite3/indexes) lesson: a sorted lookup structure, like the index at the back of a book. This lesson shows how to **see** whether MySQL is using one, with the **`EXPLAIN`** statement.

The examples use a table with 5,000 orders. This setup builds it, so that you can follow along:

```sql
SELECT COUNT(*) AS orders, MIN(ordered_on) AS first_day, MAX(ordered_on) AS last_day FROM orders;
```

```text
+--------+------------+------------+
| orders | first_day  | last_day   |
+--------+------------+------------+
|   5000 | 2025-01-01 | 2026-08-23 |
+--------+------------+------------+
```

## EXPLAIN: MySQL's plan

Put `EXPLAIN` in front of any `SELECT`, and MySQL shows its **plan** for running it, without actually running it. Let's look for all of one customer's orders:

```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
```

```text
+--------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                      |
+--------------------------------------------------------------------------------------------------------------+
| -> Filter: (orders.customer_id = 42)  (cost=504 rows=500)
    -> Table scan on orders  (cost=504 rows=5000)
 |
+--------------------------------------------------------------------------------------------------------------+
```

In MySQL 9, the plan is printed as a **tree**, which you read from the **innermost** (most indented) line outward. Here there are two steps:

1. `Table scan on orders`: MySQL reads **every row** of the table, about 5,000 of them.
2. `Filter: (orders.customer_id = 42)`: for each row, it checks the condition, and keeps about 500 (its estimate).

The `cost` and `rows` figures are the optimizer's **estimates**, not exact numbers. `cost` is a made-up unit for comparing plans, and `rows` is how many rows it expects to handle. A **table scan** is fine for 5,000 rows, but for 50 million, it would be very slow.

## The classic table: FORMAT=TRADITIONAL

You'll also see MySQL's older, tabular format in books, blog posts, and older versions of MySQL. You can ask for it any time:

```sql
EXPLAIN FORMAT=TRADITIONAL SELECT * FROM orders WHERE customer_id = 42;
```

```text
+----+-------------+--------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table  | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+--------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | orders | NULL       | ALL  | NULL          | NULL | NULL    | NULL | 5000 |    10.00 | Using where |
+----+-------------+--------+------------+------+---------------+------+---------+------+------+----------+-------------+
```

The columns that matter most:

| Column | What it tells you |
|---|---|
| `table` | which table this step reads |
| `type` | **how** MySQL finds the rows. This is the most important column. |
| `possible_keys` | indexes that could help |
| `key` | the index MySQL actually chose (`NULL` means none) |
| `rows` | how many rows MySQL **estimates** it must look at |
| `filtered` | the percentage of those rows it expects to keep |
| `Extra` | notes, like `Using where` or `Using filesort` |

Here, `type` is **`ALL`** and `key` is `NULL`: a full table scan, the same story as the tree told. The values of `type` run from best to worst:

| `type` | Meaning |
|---|---|
| `const` | at most one row, found through a primary or unique key. Fastest. |
| `eq_ref` | one row per row of another table, found through a unique key (in joins) |
| `ref` | rows found through a non-unique index |
| `range` | a range of an index, like `BETWEEN` or `>` |
| `index` | reads the whole index (better than the table, but still all of it) |
| `ALL` | reads the whole table. Usually the one to fix. |

Both formats show the same plan. The tree is easier to read for complicated queries, and the table is handy for a quick look at `type` and `key`.

## Adding an index

Let's give MySQL a shortcut:

```sql
CREATE INDEX idx_orders_customer ON orders (customer_id);
ANALYZE TABLE orders;
EXPLAIN SELECT * FROM orders WHERE customer_id = 42;
EXPLAIN FORMAT=TRADITIONAL SELECT * FROM orders WHERE customer_id = 42;
```

```text
+---------------+---------+----------+----------+
| Table         | Op      | Msg_type | Msg_text |
+---------------+---------+----------+----------+
| lesson.orders | analyze | status   | OK       |
+---------------+---------+----------+----------+
+---------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                     |
+---------------------------------------------------------------------------------------------+
| -> Index lookup on orders using idx_orders_customer (customer_id = 42)  (cost=3.5 rows=10)
 |
+---------------------------------------------------------------------------------------------+
+----+-------------+--------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
| id | select_type | table  | partitions | type | possible_keys       | key                 | key_len | ref   | rows | filtered | Extra |
+----+-------------+--------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | orders | NULL       | ref  | idx_orders_customer | idx_orders_customer | 4       | const |   10 |   100.00 | NULL  |
+----+-------------+--------+------------+------+---------------------+---------------------+---------+-------+------+----------+-------+
```

Now the tree says `Index lookup on orders using idx_orders_customer`, and the table says `type: ref` with `key: idx_orders_customer`. The `rows` estimate drops from about 5,000 to about 10: MySQL jumps straight to the customer's rows. (`ANALYZE TABLE` refreshes MySQL's statistics, so its estimates stay accurate.)

Look-ups by the **primary key** are already indexed automatically:

```sql
EXPLAIN FORMAT=TRADITIONAL SELECT * FROM orders WHERE id = 1234;
```

```text
+----+-------------+--------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
| id | select_type | table  | partitions | type  | possible_keys | key     | key_len | ref   | rows | filtered | Extra |
+----+-------------+--------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
|  1 | SIMPLE      | orders | NULL       | const | PRIMARY       | PRIMARY | 4       | const |    1 |   100.00 | NULL  |
+----+-------------+--------+------------+-------+---------------+---------+---------+-------+------+----------+-------+
```

That's `type: const`: one row, found at once. (The tree format for this query just says `Rows fetched before execution`, meaning MySQL already fetched the one row while planning the query.)

## Indexes have a cost

If indexes make queries faster, why not index everything? Because every index:

- takes up **disk space**;
- must be **updated** whenever you insert, change, or delete a row, which slows down writes.

Index the columns you often use in `WHERE`, `JOIN ... ON`, and `ORDER BY`, and no more. Index columns with **many different values**, like an email, and not ones with few, like a yes/no flag, since an index doesn't help much when half the table matches anyway.

## Composite indexes

An index can cover **several columns**, and the order matters. A composite index on `(status, ordered_on)` helps queries that filter on `status`, or on `status` **and** `ordered_on`, but not on `ordered_on` alone (the same way a phone book sorted by last name, then first name, can't find people by first name):

```sql
CREATE INDEX idx_orders_status_date ON orders (status, ordered_on);
ANALYZE TABLE orders;
EXPLAIN FORMAT=TRADITIONAL SELECT id, total FROM orders
WHERE status = 'paid' AND ordered_on >= '2026-01-01';
```

```text
+---------------+---------+----------+----------+
| Table         | Op      | Msg_type | Msg_text |
+---------------+---------+----------+----------+
| lesson.orders | analyze | status   | OK       |
+---------------+---------+----------+----------+
+----+-------------+--------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
| id | select_type | table  | partitions | type  | possible_keys          | key                    | key_len | ref  | rows | filtered | Extra                 |
+----+-------------+--------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
|  1 | SIMPLE      | orders | NULL       | range | idx_orders_status_date | idx_orders_status_date | 45      | NULL |  472 |   100.00 | Using index condition |
+----+-------------+--------+------------+-------+------------------------+------------------------+---------+------+------+----------+-----------------------+
```

`type` is `range`: MySQL found the `paid` orders in the index, and then a range of dates within them. Put the column you compare with `=` first, and the one you compare with a range last.

## Traps that stop an index from being used

Even with an index, some ways of writing a query make MySQL ignore it.

**A function around the indexed column.** MySQL can look up `ordered_on` in the index, but can't look up `YEAR(ordered_on)`, since the index stores the original dates:

```sql
CREATE INDEX idx_orders_date ON orders (ordered_on);
ANALYZE TABLE orders;

EXPLAIN SELECT COUNT(*) FROM orders WHERE YEAR(ordered_on) = 2026;
EXPLAIN SELECT COUNT(*) FROM orders WHERE ordered_on >= '2026-01-01' AND ordered_on < '2027-01-01';
```

```text
+---------------+---------+----------+----------+
| Table         | Op      | Msg_type | Msg_text |
+---------------+---------+----------+----------+
| lesson.orders | analyze | status   | OK       |
+---------------+---------+----------+----------+
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                                                                                                                |
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| -> Aggregate: count(0)  (cost=1656 rows=1)
    -> Filter: (year(orders.ordered_on) = 2026)  (cost=504 rows=5000)
        -> Covering index scan on orders using idx_orders_date  (cost=504 rows=5000)
 |
+--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                                                                                                                                                                                                                          |
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| -> Aggregate: count(0)  (cost=811 rows=1)
    -> Filter: ((orders.ordered_on >= DATE'2026-01-01') and (orders.ordered_on < DATE'2027-01-01'))  (cost=378 rows=1880)
        -> Covering index range scan on orders using idx_orders_date over ('2026-01-01' <= ordered_on < '2027-01-01')  (cost=378 rows=1880)
 |
+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

Both answer the same question, but read the plans. The first has to read **every entry** of the index (`Covering index scan`, about 5,000 rows), then compute `YEAR()` for each one. The second is a `Covering index range scan`: MySQL jumps to the start of 2026 in the index, and reads only that range (about 1,900 rows). Rewrite conditions so that the bare column stands alone on one side.

**A leading wildcard.** `LIKE 'Mar%'` can use an index on a name column, since it knows where to start. `LIKE '%ria'` can't, because the beginning is unknown.

**Comparing different types.** Comparing a text column to a number (`WHERE phone = 5551234`) forces MySQL to convert every row, and skips the index.

## Sorting

`ORDER BY` on a column without a matching index makes MySQL sort the results itself. The tree shows a `Sort` step, and the table shows **`Using filesort`** in `Extra`. (The name is misleading: it doesn't always use a file. It just means "an extra sorting step.") An index in the right order removes that step:

```sql
CREATE INDEX idx_orders_total ON orders (total);
ANALYZE TABLE orders;
EXPLAIN SELECT id, total FROM orders ORDER BY total DESC LIMIT 5;
EXPLAIN SELECT id, total FROM orders ORDER BY ordered_on, id LIMIT 5;
```

```text
+---------------+---------+----------+----------+
| Table         | Op      | Msg_type | Msg_text |
+---------------+---------+----------+----------+
| lesson.orders | analyze | status   | OK       |
+---------------+---------+----------+----------+
+---------------------------------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                                               |
+---------------------------------------------------------------------------------------------------------------------------------------+
| -> Limit: 5 row(s)  (cost=0.0045 rows=5)
    -> Covering index scan on orders using idx_orders_total (reverse)  (cost=0.0045 rows=5)
 |
+---------------------------------------------------------------------------------------------------------------------------------------+
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                                                                                                         |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| -> Limit: 5 row(s)  (cost=504 rows=5)
    -> Sort: orders.ordered_on, orders.id, limit input to 5 row(s) per chunk  (cost=504 rows=5000)
        -> Table scan on orders  (cost=504 rows=5000)
 |
+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
```

The first query reads the `total` index from the top (`reverse`), and stops after 5 rows. The second has no matching index, so MySQL must scan the table and sort everything before it can give you the first 5.

## EXPLAIN ANALYZE

`EXPLAIN` only **predicts**. `EXPLAIN ANALYZE` actually **runs** the query, and shows the real time and row counts next to the estimates, for every step. When the estimate and the reality are far apart, MySQL's statistics are out of date, and `ANALYZE TABLE` is the fix. The timings differ on every computer, so try it yourself: `EXPLAIN ANALYZE SELECT ...`.

To hunt for slow queries in a real system, MySQL can also record them in its **slow query log** (turned on with the `slow_query_log` setting), which collects every query slower than a limit you choose.

## A workflow for slow queries

1. Find the slow query.
2. Run `EXPLAIN` on it. Look for a `Table scan` (`type: ALL`), a `NULL` key, a huge `rows` estimate, or a `Sort` step.
3. Add the index that fits, or rewrite the query so it can use one.
4. Run `EXPLAIN` again to confirm, and time the query.
5. Check that your writes didn't get noticeably slower.

Measure before and after, and never add indexes on a hunch.

## Try it

A shop's report is slow. Look at the plan for it, before and after adding a suitable index, and predict how the plan changes.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, report.sql"
	min-height="340px"
	:model-value="'EXPLAIN SELECT id, total\nFROM orders\nWHERE customer_id = 7 AND status = \'paid\';\n\nCREATE INDEX idx_customer_status ON orders (customer_id, status);\nANALYZE TABLE orders;\n\nEXPLAIN SELECT id, total\nFROM orders\nWHERE customer_id = 7 AND status = \'paid\';\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), build the `orders` table from the top of this lesson, and run this script in the `mysql` client.
:::

::: details Check your prediction
```text
+---------------------------------------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                                                     |
+---------------------------------------------------------------------------------------------------------------------------------------------+
| -> Filter: ((orders.`status` = 'paid') and (orders.customer_id = 7))  (cost=504 rows=50)
    -> Table scan on orders  (cost=504 rows=5000)
 |
+---------------------------------------------------------------------------------------------------------------------------------------------+
+---------------+---------+----------+----------+
| Table         | Op      | Msg_type | Msg_text |
+---------------+---------+----------+----------+
| lesson.orders | analyze | status   | OK       |
+---------------+---------+----------+----------+
+-------------------------------------------------------------------------------------------------------------+
| EXPLAIN                                                                                                     |
+-------------------------------------------------------------------------------------------------------------+
| -> Index lookup on orders using idx_customer_status (customer_id = 7, status = 'paid')  (cost=0.35 rows=1)
 |
+-------------------------------------------------------------------------------------------------------------+
```

Before the index, MySQL scans the whole table and filters every row for both conditions. After it, MySQL does an `Index lookup` on the composite index, using **both** columns (`customer_id = 7, status = 'paid'`), and its estimate collapses from thousands of rows to about one. Both columns are compared with `=`, so the order of the two in the index isn't critical here.
:::

## Try it yourself

1. Run `EXPLAIN SELECT * FROM orders WHERE total > 900;` before and after adding an index on `total`. Does the plan change? Does it help when most rows match?
2. Run `SHOW INDEX FROM orders;` and read the list of indexes. Which column comes first in each?
3. Try `EXPLAIN FORMAT=TRADITIONAL SELECT * FROM orders WHERE ordered_on = '2026-03-01';` with and without an index on `ordered_on`. What happens to `type` and `rows`?

## Check your understanding

<Quiz
	question="In EXPLAIN output, what does a Table scan (or type ALL with key NULL) mean?"
	:options="['MySQL is using every index', 'The query is perfectly optimized', 'MySQL reads every row of the table, using no index', 'The query has an error']"
	:answer-index="2"
	explanation="A full table scan reads every row. It's the main thing to look for, and to fix, in slow queries."
/>

<Quiz
	question="Why can't MySQL do a quick lookup in an index on ordered_on for WHERE YEAR(ordered_on) = 2026?"
	:options="['Dates cannot be indexed', 'YEAR is a reserved word', 'The index only works with text', 'The function hides the column, so MySQL must compute it for every row']"
	:answer-index="3"
	explanation="Indexes store the original values. Rewrite it as a range: ordered_on >= '2026-01-01' AND ordered_on < '2027-01-01'."
/>

<Quiz
	question="What is the main cost of adding many indexes?"
	:options="['Queries get slower to read', 'They use disk space and slow down inserts, updates, and deletes', 'Tables cannot be dropped', 'They change the results']"
	:answer-index="1"
	explanation="Every index must be kept up to date on each write, so index only the columns you actually search and sort on."
/>

## Up next

Your data is safe, stored correctly, and fast to read. One thing remains for a real server: making sure you can get it back if something goes wrong. That's [Backups with mysqldump](/lessons/mysql/backups).
