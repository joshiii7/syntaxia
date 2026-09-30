---
title: "Oracle Top-N Queries: FETCH FIRST, ROWNUM, and OFFSET"
description: "Get the top rows in Oracle: FETCH FIRST with ties and percentages, paging with OFFSET, why the old ROWNUM trick needs a subquery, and RANK and ROW_NUMBER for the top rows per group."
---

# Top-N Queries: ROWNUM and FETCH FIRST

*A race ends, and the announcer reads out the first three finishers. Someone has to sort the runners by time before they can pick the first three. In SQL, the order comes first, and the picking comes second.*

You'll often want only the first few rows of a result: the five best-paid employees, the ten newest orders, the top three products. Databases each have their own way to say it: `LIMIT 5` in SQLite and MySQL. Oracle has **two** ways: a modern one that's standard SQL, and an older one that you'll find all over existing code, and that has a trap.

## The modern way: FETCH FIRST

Since Oracle 12c, Oracle supports the standard clause, which goes at the **end** of the query, after `ORDER BY`:

```sql
SELECT last_name, salary
FROM hr.employees
ORDER BY salary DESC, last_name
FETCH FIRST 5 ROWS ONLY;
```

```text
LAST_NAME  SALARY
---------- ------
King        24000
Garcia      17000
Yang        17000
Singh       14000
Partners    13500
```

Read it as: sort everyone by salary, highest first (and by name when salaries are equal), then keep only the first 5. `FIRST` and `NEXT` mean the same, and `ROW` and `ROWS` are interchangeable, so `FETCH FIRST 1 ROW ONLY` reads naturally too.

**Always include `ORDER BY`.** Without it, "the first 5 rows" means five arbitrary rows, and the answer can change from one run to the next.

### Ties: WITH TIES

What if two people share second place? `ONLY` cuts off at exactly N rows, and might split a tie arbitrarily. **`WITH TIES`** keeps every row that ties with the last one:

```sql
SELECT last_name, salary
FROM hr.employees
ORDER BY salary DESC
FETCH FIRST 2 ROWS WITH TIES;
```

```text
LAST_NAME SALARY
--------- ------
King       24000
Yang       17000
Garcia     17000
```

That's 3 rows, not 2: Garcia and Yang both earn 17,000, and they're tied for the second spot. `WITH TIES` needs an `ORDER BY`, and the order within a tie isn't guaranteed.

### Percentages

You can ask for a share of the rows instead of a number. The count is rounded **up**:

```sql
SELECT last_name, salary
FROM hr.employees
ORDER BY salary, last_name
FETCH FIRST 5 PERCENT ROWS ONLY;
```

```text
LAST_NAME    SALARY
------------ ------
Olson          2100
Markle         2200
Philtanker     2200
Gee            2400
Landry         2400
Colmenares     2500
```

Five percent of 107 employees is 5.35, which rounds up to 6 rows.

### Paging: OFFSET

To skip rows first, add **`OFFSET`**. This is how websites show "page 2":

```sql
SELECT last_name, salary
FROM hr.employees
ORDER BY salary DESC, last_name
OFFSET 5 ROWS FETCH NEXT 3 ROWS ONLY;
```

```text
LAST_NAME   SALARY
----------- ------
Martinez     13000
Gruenberg    12008
Higgins      12008
```

That skipped the first five, and took the next three. For page number `p` with `n` rows per page, the offset is `(p - 1) * n`. Just like in MySQL, deep pages (a large offset) get slow, since Oracle still has to read and skip all those rows.

## The old way: ROWNUM

Before Oracle 12c, there was no `FETCH FIRST`. Oracle had a special pseudo-column called **`ROWNUM`**: as Oracle produces the result, it numbers the rows 1, 2, 3, and so on. So people wrote `WHERE ROWNUM <= 5`. You'll see this in older code, and, being Oracle-specific, in most Oracle tutorials.

The catch is in **when** the numbers are given out: `ROWNUM` is assigned as rows are **picked**, *before* `ORDER BY` sorts them. Here's the classic mistake:

```sql
SELECT last_name, salary
FROM hr.employees
WHERE ROWNUM <= 5
ORDER BY salary DESC;
```

```text
LAST_NAME SALARY
--------- ------
King       24000
Yang       17000
Garcia     17000
James       9000
Miller      6000
```

That is **not** the top 5. It's the first five rows Oracle happened to find (in no particular order), sorted afterward. James and Miller are in there, and Singh, who earns 14,000, is missing.

The fix is to sort in a **subquery**, and apply `ROWNUM` to its result:

```sql
SELECT last_name, salary
FROM (SELECT last_name, salary
      FROM hr.employees
      ORDER BY salary DESC, last_name)
WHERE ROWNUM <= 5;
```

```text
LAST_NAME  SALARY
---------- ------
King        24000
Garcia      17000
Yang        17000
Singh       14000
Partners    13500
```

Now the rows are numbered **after** sorting, so the first five really are the top five. It's the same answer as `FETCH FIRST 5 ROWS ONLY`, with more typing, and a trap to fall into. Use `FETCH FIRST` in new code, and be able to read `ROWNUM` in old code.

### Other ROWNUM surprises

Since the numbers are handed out as rows are chosen, `ROWNUM` can only ever start with 1. So a test for anything other than "up to N" finds nothing:

```sql
SELECT last_name FROM hr.employees WHERE ROWNUM = 2;
```

```text
no rows selected
```

Oracle picks the first row, gives it number 1, sees `ROWNUM = 2` is false, and throws it away. The next row then becomes number 1, too, and so on. That's also why `WHERE ROWNUM > 1` never returns anything. For "skip some rows," you needed a nested query with a named `ROWNUM` column, which is what `OFFSET` replaced.

## The top rows in each group

`FETCH FIRST` gives the top rows of the **whole** result. What about "the two best-paid people in **each department**"? For that, use an **analytic function**: `ROW_NUMBER()`, `RANK()`, or `DENSE_RANK()`. They number rows within groups, without collapsing them like `GROUP BY` does:

```sql
SELECT last_name, salary,
       RANK() OVER (ORDER BY salary DESC) AS rnk,
       ROW_NUMBER() OVER (ORDER BY salary DESC, last_name) AS rn
FROM hr.employees
ORDER BY salary DESC, last_name
FETCH FIRST 4 ROWS ONLY;
```

```text
LAST_NAME SALARY RNK RN
--------- ------ --- --
King       24000   1  1
Garcia     17000   2  2
Yang       17000   2  3
Singh      14000   4  4
```

- `ROW_NUMBER()` gives every row a different number, breaking ties in the order you specify.
- `RANK()` gives tied rows the **same** number, then skips ahead: two people tied for 2nd, so the next is 4th. `DENSE_RANK()` wouldn't skip: it would give 3.

`PARTITION BY` restarts the numbering for each group. Wrap the query, and keep the rows numbered 1 and 2:

```sql
SELECT department_id, last_name, salary
FROM (SELECT department_id, last_name, salary,
             ROW_NUMBER() OVER (PARTITION BY department_id
                                ORDER BY salary DESC, last_name) AS rn
      FROM hr.employees
      WHERE department_id IN (30, 60))
WHERE rn <= 2
ORDER BY department_id, rn;
```

```text
DEPARTMENT_ID LAST_NAME SALARY
------------- --------- ------
           30 Li         11000
           30 Khoo        3100
           60 James       9000
           60 Miller      6000
```

The two best-paid people in each of departments 30 and 60. (Each department has more than two people, but only the top two are kept.)

## Try it

Here are three different ways to ask for "the top". Predict how many rows each returns, and which names.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, top_n.sql"
	min-height="380px"
	:model-value="'-- Query 1\nSELECT last_name, salary\nFROM hr.employees\nORDER BY salary DESC, last_name\nFETCH FIRST 2 ROWS ONLY;\n\n-- Query 2\nSELECT last_name, salary\nFROM hr.employees\nORDER BY salary DESC\nFETCH FIRST 2 ROWS WITH TIES;\n\n-- Query 3\nSELECT last_name FROM hr.employees WHERE ROWNUM = 2;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste these queries into FreeSQL, or any Oracle tool, to check your answers.
:::

::: details Check your prediction
```text
LAST_NAME SALARY
--------- ------
King       24000
Garcia     17000

LAST_NAME SALARY
--------- ------
King       24000
Yang       17000
Garcia     17000

no rows selected
```

Query 1 gives exactly two rows: King, then whichever of the two 17,000 earners sorts first by name, Garcia. Query 2 keeps the tie, so there are three rows. Query 3 finds nothing, since `ROWNUM = 2` can never be true when the numbering starts at 1 and only moves on after a row is accepted.
:::

## Try it yourself

1. Write a query for the three **lowest** paid employees, using `FETCH FIRST`.
2. Write "page 3" of the employee list, at 10 employees per page, sorted by `employee_id`.
3. Rewrite the query for the two best-paid people in each department, so it returns the top **three**. What changes?

## Check your understanding

<Quiz
	question="Which query returns the 5 highest-paid employees in Oracle?"
	:options="['SELECT * FROM emp ORDER BY salary DESC LIMIT 5', 'SELECT * FROM emp WHERE ROWNUM <= 5 ORDER BY salary DESC', 'SELECT TOP 5 * FROM emp', 'SELECT * FROM emp ORDER BY salary DESC FETCH FIRST 5 ROWS ONLY']"
	:answer-index="3"
	explanation="Oracle has no LIMIT or TOP. The ROWNUM version picks five rows before sorting, so it's wrong. FETCH FIRST works after ORDER BY."
/>

<Quiz
	question="What does FETCH FIRST 2 ROWS WITH TIES do when three people share the highest salary?"
	:options="['Returns all 3, since they tie for the last spot', 'Returns 2 rows', 'Returns an error', 'Returns 1 row']"
	:answer-index="0"
	explanation="WITH TIES keeps every row that ties with the last row inside the limit, so it may return more than N rows."
/>

<Quiz
	question="Why does WHERE ROWNUM = 2 return no rows?"
	:options="['ROWNUM cannot be compared', 'It always returns the last row', 'Oracle numbers a row 1 first, and only moves on when a row is accepted, so 2 is never reached', 'The table has no second row']"
	:answer-index="2"
	explanation="ROWNUM is assigned as rows are selected. A row that fails the test doesn't use up its number, so 2 is never reached."
/>

## Up next

Your tables so far have been the HR samples. To build your own, you'll need a way to hand out IDs automatically. Oracle has two: the classic sequence, and the newer identity column, in [Sequences and Identity Columns](/lessons/oracle-database/sequences-and-identity).
