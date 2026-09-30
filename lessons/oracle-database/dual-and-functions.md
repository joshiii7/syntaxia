---
title: "Oracle Functions: DUAL, NVL, DECODE, TO_CHAR, and More"
description: "Use Oracle's built-in functions: the DUAL table, text functions like SUBSTR and INSTR, number and date functions, TO_CHAR and TO_DATE formats, DECODE and CASE, and LISTAGG."
---

# DUAL and Oracle Functions: NVL, DECODE, and TO_CHAR

*A workshop has drawers of ready-made tools: rulers, clamps, and cutters. Oracle's functions are those drawers. You don't build a ruler each time, you just pick one up.*

A **function** takes some values, does a job, and hands back a result. You've used a few already: `NVL`, `COALESCE`, `UPPER`. Oracle has hundreds. This lesson covers the ones you'll reach for most, and explains the strange little table called `DUAL`.

## DUAL: the table for trying things out

In Oracle 26ai, `SELECT 7 / 2;` works with no table. But every older Oracle version needs a `FROM` clause, and a huge amount of existing code, and many examples online, use **`DUAL`**: a table that Oracle provides, with one column and **one row**:

```sql
SELECT * FROM dual;
```

```text
DUMMY
-----
X
```

Because it has exactly one row, `SELECT something FROM dual` returns exactly one answer. It's the standard place to try out a function, or to calculate a single value. This lesson does that a lot. You can always write `FROM dual`, and it works in every version.

## Text functions

```sql
SELECT UPPER('noli me tangere') AS up,
       INITCAP('noli me tangere') AS init,
       LENGTH('Noli') AS len,
       SUBSTR('Noli Me Tangere', 6, 2) AS mid,
       SUBSTR('Noli Me Tangere', -7) AS tail,
       INSTR('Noli Me Tangere', 'Me') AS pos
FROM dual;
```

```text
UP              INIT            LEN MID TAIL    POS
--------------- --------------- --- --- ------- ---
NOLI ME TANGERE Noli Me Tangere   4 Me  Tangere   6
```

- `UPPER`, `LOWER`, and `INITCAP` change the case. `INITCAP` capitalizes each word.
- `SUBSTR(text, start, length)` cuts out a piece. Positions start at **1**. A **negative** start counts from the end, so `-7` means "the last seven characters."
- `INSTR(text, find)` gives the position where `find` first appears, or `0` if it doesn't.
- Text comparisons in Oracle are **case-sensitive**: `'Rizal' = 'rizal'` is false. When searching, compare `UPPER(a) = UPPER(b)`.

```sql
SELECT REPLACE('2026-10-15', '-', '/') AS swapped,
       LPAD('42', 6, '0') AS padded,
       RPAD('ab', 5, '*') AS rpadded,
       TRIM('  hi  ') AS trimmed,
       CONCAT('Hello, ', 'Oracle') AS two_args
FROM dual;
```

```text
SWAPPED    PADDED RPADDED TRIMMED TWO_ARGS
---------- ------ ------- ------- -------------
2026/10/15 000042 ab***   hi      Hello, Oracle
```

`LPAD` and `RPAD` pad on the left and right. `CONCAT` joins exactly **two** values, so for more, use `||`, which is why most Oracle code does.

## Number functions

```sql
SELECT ROUND(1250.567, 2) AS r2,
       ROUND(1250.567, -2) AS r_neg,
       TRUNC(1250.567, 1) AS t1,
       MOD(17, 5) AS m,
       CEIL(2.1) AS c,
       FLOOR(2.9) AS f,
       POWER(2, 10) AS p,
       ABS(-7) AS a
FROM dual;
```

```text
     R2 R_NEG     T1 M C F     P A
------- ----- ------ - - - ----- -
1250.57  1300 1250.5 2 3 2  1024 7
```

`ROUND` rounds, and a negative second argument rounds to the left of the point. `TRUNC` **cuts** without rounding. `MOD` is the remainder, `CEIL` rounds up, and `FLOOR` rounds down. Oracle has no `%` operator: use `MOD`.

## Date functions

Dates were covered in [Oracle Data Types](/lessons/oracle-database/data-types). Here are the functions that work on them:

- `SYSDATE` is the current date and time on the database server. `SYSTIMESTAMP` adds fractions of a second and a time zone.
- `ADD_MONTHS(date, n)`, `LAST_DAY(date)`, and `NEXT_DAY(date, 'MONDAY')` handle the awkwardness of calendars.
- `MONTHS_BETWEEN(later, earlier)` counts months.
- `TRUNC(date)` sets the time to midnight, and `TRUNC(date, 'MM')` gives the first of the month.
- `EXTRACT(YEAR FROM date)` pulls out one part.

Because "now" changes every second, here are the functions on fixed dates:

```sql
SELECT TO_CHAR(ADD_MONTHS(DATE '2026-01-31', 1), 'YYYY-MM-DD') AS plus_month,
       TO_CHAR(LAST_DAY(DATE '2026-02-10'), 'YYYY-MM-DD') AS eom,
       TO_CHAR(NEXT_DAY(DATE '2026-10-15', 'MONDAY'), 'YYYY-MM-DD') AS next_mon,
       MONTHS_BETWEEN(DATE '2026-10-15', DATE '2026-04-15') AS months_apart,
       EXTRACT(YEAR FROM DATE '2026-10-15') AS yr,
       TO_CHAR(TRUNC(DATE '2026-10-15', 'MM'), 'YYYY-MM-DD') AS month_start
FROM dual;
```

```text
PLUS_MONTH EOM        NEXT_MON   MONTHS_APART   YR MONTH_START
---------- ---------- ---------- ------------ ---- -----------
2026-02-28 2026-02-28 2026-10-19            6 2026 2026-10-01
```

January 31 plus one month is February 28, the last day that fits. October 15, 2026 is a Thursday, so the next Monday is the 19th.

## Converting: TO_CHAR, TO_NUMBER, TO_DATE

Oracle converts between types with three workhorse functions, and each takes a **format model**: a pattern that says how to read or write the value.

```sql
SELECT TO_CHAR(1234567.891, 'FM9,999,999.00') AS money,
       TO_CHAR(0.5, 'FM0.00') AS lead0,
       TO_CHAR(42, 'FM0000') AS padded,
       TO_NUMBER('1,250.75', '9,999.99') AS parsed,
       TO_CHAR(DATE '2026-10-15', 'FMDay, DD Month YYYY') AS long_date
FROM dual;
```

```text
MONEY        LEAD0 PADDED    PARSED LONG_DATE
------------ ----- ------ --------- -------------------------
1,234,567.89 0.50  0042     1250.75 Thursday, 15 October 2026
```

- In number formats, `9` is a digit that's shown only if needed, `0` is a digit that's always shown, `,` is a thousands separator, and `.` the decimal point.
- **`FM`** at the start means "fill mode": remove the padding spaces Oracle otherwise adds. Almost every format in real code starts with `FM`.
- In date formats, `Day` and `Month` are spelled out, `DD` is the day, and `YYYY` is the year. Dates in the output follow your session's language.

Oracle also converts **implicitly**, quietly, when it can, like comparing a number column to `'5'`. That's convenient, but it can hide bugs and stop indexes from being used. Prefer explicit conversions.

## DECODE and CASE

`DECODE` is Oracle's original, compact way to choose a value. Read it as: "compare the first argument to each pair, and give the matching answer, or the last, single value if none match":

```sql
SELECT DECODE(3, 1, 'one', 2, 'two', 'many') AS decoded,
       CASE WHEN 3 > 2 THEN 'bigger' ELSE 'smaller' END AS cased
FROM dual;
```

```text
DECODED CASED
------- ------
many    bigger
```

`DECODE` can only test for **equality**. `CASE`, from the SQLite track, is the standard, more flexible tool, works in every database, and reads better. Use `CASE` in new code, but be able to read `DECODE`, since it's everywhere in older Oracle systems.

## LISTAGG: many rows into one

`LISTAGG` joins the values of a group into a single piece of text. It's Oracle's version of MySQL's `GROUP_CONCAT`:

```sql
SELECT job_id,
       LISTAGG(last_name, ', ') WITHIN GROUP (ORDER BY last_name) AS staff
FROM hr.employees
WHERE job_id IN ('AD_PRES', 'AD_VP')
GROUP BY job_id
ORDER BY job_id;
```

```text
JOB_ID  STAFF
------- ------------
AD_PRES King
AD_VP   Garcia, Yang
```

The `WITHIN GROUP (ORDER BY ...)` part says how to order the names inside the text.

## Try it

A payroll report for the first four employees in HR. Predict every column and every row, before checking.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, payroll.sql"
	min-height="340px"
	:model-value="'SELECT last_name,\n       salary,\n       TO_CHAR(salary * 12, \'FM999,999\') AS yearly,\n       DECODE(job_id, \'AD_PRES\', \'Boss\', \'AD_VP\', \'Deputy\', \'Staff\') AS role\nFROM hr.employees\nWHERE employee_id IN (100, 101, 102, 103)\nORDER BY employee_id;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this query into FreeSQL, or any Oracle tool, to check your answer.
:::

::: details Check your prediction
```text
LAST_NAME SALARY YEARLY  ROLE
--------- ------ ------- ------
King       24000 288,000 Boss
Yang       17000 204,000 Deputy
Garcia     17000 204,000 Deputy
James       9000 108,000 Staff
```

Each yearly figure is the salary times 12, formatted with a thousands separator, and `FM` removes the padding. `DECODE` turns the job code into a friendly role: the president is the boss, the vice presidents are deputies, and any other code gets `Staff`, since it matches none of the pairs.
:::

## Try it yourself

1. Rewrite the `DECODE` in the query as a `CASE` expression, with the same results.
2. Add a column with the employee's initial and last name, like `S. King`, using `SUBSTR` and `||` on `first_name`.
3. Use `LPAD` to print each salary padded to 8 characters with zeros on the left.

## Check your understanding

<Quiz
	question="What is the DUAL table?"
	:options="['A copy of every table', 'A table of two users', 'A backup table', 'A table with one column and one row, for SELECTs that do not need a real table']"
	:answer-index="3"
	explanation="DUAL has one row, so SELECT ... FROM dual returns exactly one result. Older Oracle versions need it, and it still works everywhere."
/>

<Quiz
	question="What does SUBSTR('Noli Me Tangere', -7) return?"
	:options="['Noli', 'Tangere', 'Me', 'An error']"
	:answer-index="1"
	explanation="A negative start counts from the end of the text, so -7 gives the last seven characters."
/>

<Quiz
	question="What does the FM at the start of a TO_CHAR format do?"
	:options="['Makes the value a fraction', 'Removes the padding spaces Oracle would otherwise add', 'Formats the value as money', 'Forces uppercase']"
	:answer-index="1"
	explanation="FM is fill mode: it trims the blank padding, so you get clean output like 1,250 instead of a padded string."
/>

## Up next

Oracle has no `LIMIT`, and there are two ways to get the top few rows, an old one and a new one. Learn both in [Top-N Queries: ROWNUM and FETCH FIRST](/lessons/oracle-database/top-n-queries).
