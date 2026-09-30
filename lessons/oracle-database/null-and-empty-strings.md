---
title: "Oracle NULL: Why the Empty String Is NULL, and How to Handle It"
description: "Understand Oracle's most famous quirk, that an empty string is NULL, and its consequences for comparisons, concatenation, counting, sorting, and NOT IN, with NVL, NVL2, COALESCE, and NULLIF to handle it."
---

# Empty Strings Are NULL: Oracle's NULL Rules

*A form has a box for "middle name." If it's blank, does that mean the person has no middle name, or that nobody has asked? Most databases let you write down both. Oracle doesn't: to Oracle, blank and unknown are the same thing.*

You met `NULL` in the SQLite track's [NULL](/lessons/sqlite3/null) lesson: a marker for "no value," which isn't equal to anything, not even to itself. Oracle follows all those rules. But it adds one that surprises everyone, and it affects nearly every Oracle program ever written.

## The rule: '' is NULL

In SQLite and MySQL, an **empty string** `''` (text with nothing in it) is a real value, different from `NULL`. **In Oracle, they're the same thing.** When you store `''` in a column, Oracle stores `NULL`:

```sql
SELECT LENGTH('') AS len,
       NVL('', 'was empty') AS nvl_result,
       '' IS NULL AS is_null
FROM dual;
```

```text
LEN NVL_RESULT IS_NULL
--- ---------- -------
    was empty  true
```

- `LENGTH('')` is `NULL`, not `0`. In most databases, it's `0`.
- `NVL('', 'was empty')` replaced the "empty string," because Oracle sees a `NULL`.
- `'' IS NULL` is `true`.

(The `IS NULL` in a column list, like `'' IS NULL AS is_null`, works in Oracle 26ai. Older releases only allow it in `WHERE`, and in `CASE`.)

It's the same for a `VARCHAR2` column in a table: no matter whether you `INSERT` an empty string or leave the value out, what's stored is `NULL`. There's simply **no such thing as an empty string** in an Oracle column.

## Consequences

**1. Comparing to `''` never matches.** `WHERE middle_name = ''` is comparing to `NULL`, and nothing is ever equal to `NULL`. It always finds zero rows. The right test is `IS NULL`.

```sql
WITH guests (name, middle) AS (
  SELECT 'Ana', 'Marie' FROM dual UNION ALL
  SELECT 'Ben', '' FROM dual UNION ALL
  SELECT 'Carlo', NULL FROM dual UNION ALL
  SELECT 'Dina', ' ' FROM dual)
SELECT COUNT(*) AS total,
       COUNT(middle) AS with_middle,
       SUM(CASE WHEN middle IS NULL THEN 1 ELSE 0 END) AS no_middle,
       SUM(CASE WHEN middle = '' THEN 1 ELSE 0 END) AS equals_empty
FROM guests;
```

```text
TOTAL WITH_MIDDLE NO_MIDDLE EQUALS_EMPTY
----- ----------- --------- ------------
    4           2         2            0
```

Ben's `''` and Carlo's `NULL` are treated the same, so **two** guests have no middle name. Comparing with `= ''` finds none. And Dina, whose "middle name" is a single **space**, is a real value: a space isn't empty. That's a classic bug: a program that saves `' '` to avoid the problem ends up with data that looks blank but isn't `NULL`.

**2. Joining with `NULL` doesn't break the text.** In most databases, `'a' || NULL` is `NULL`. In Oracle, `||` treats `NULL` as empty text, and just skips it:

```sql
WITH guests (name, middle) AS (
  SELECT 'Ana', 'Marie' FROM dual UNION ALL
  SELECT 'Ben', '' FROM dual UNION ALL
  SELECT 'Carlo', NULL FROM dual UNION ALL
  SELECT 'Dina', ' ' FROM dual)
SELECT name,
       '[' || name || ' ' || middle || ']' AS joined,
       LENGTH(middle) AS len,
       NVL(middle, '(none)') AS shown
FROM guests
ORDER BY name;
```

```text
NAME  JOINED        LEN SHOWN
----- ------------- --- --------
Ana   [Ana Marie]     5 Marie
Ben   [Ben ]            (none)
Carlo [Carlo ]          (none)
Dina  [Dina  ]        1
```

Ben and Carlo joined into `[Ben ]` and `[Carlo ]`: the `NULL` disappeared, and only the space remained. `LENGTH` shows `NULL` (blank) for them, and `1` for Dina's space. (`||` is the one place where Oracle is forgiving about `NULL`. Arithmetic with `NULL`, like `5 + NULL`, still gives `NULL`.)

**3. Counting.** `COUNT(*)` counts rows. `COUNT(column)` counts only rows where the column is **not** `NULL`. In the HR data, only sales staff earn a commission, so:

```sql
SELECT COUNT(*) AS all_rows,
       COUNT(commission_pct) AS with_commission,
       COUNT(*) - COUNT(commission_pct) AS without_commission
FROM hr.employees;
```

```text
ALL_ROWS WITH_COMMISSION WITHOUT_COMMISSION
-------- --------------- ------------------
     107              35                 72
```

**4. Averages skip `NULL`.** `AVG(commission_pct)` averages only the 35 people who have one. To average over everyone, first turn `NULL` into `0`:

```sql
SELECT ROUND(AVG(commission_pct), 4) AS avg_of_known,
       ROUND(AVG(NVL(commission_pct, 0)), 4) AS avg_all
FROM hr.employees;
```

```text
AVG_OF_KNOWN AVG_ALL
------------ -------
      0.2229  0.0729
```

Which one is right depends on the question, so always know which you're asking.

**5. Sorting.** In Oracle, `NULL` sorts as if it were the **largest** value: last in `ORDER BY ... ASC`, and first in `DESC`. You can override that with `NULLS FIRST` or `NULLS LAST`:

```sql
SELECT n FROM (SELECT 1 AS n FROM dual UNION ALL SELECT NULL FROM dual UNION ALL SELECT 3 FROM dual)
ORDER BY n;
```

```text
 N
--
 1
 3

```

(The last, blank row is the `NULL`.) Adding `NULLS FIRST` puts it at the top, and `DESC` puts it there by default.

**6. Not-equal and `NOT IN` skip `NULL`s.** A row with a `NULL` is never "not equal to" anything, because comparing with `NULL` is never true. In HR, one employee has no department. Watch her disappear from these counts:

```sql
SELECT COUNT(*) AS not_50 FROM hr.employees WHERE department_id <> 50;
SELECT COUNT(*) AS null_dept FROM hr.employees WHERE department_id IS NULL;
```

```text
NOT_50
------
    61

NULL_DEPT
---------
        1
```

There are 107 employees, and 45 work in department 50. That leaves 62 who aren't, but the count is 61: the person with no department is neither in 50 nor "not in 50."

`NOT IN` is worse. If the list itself contains a `NULL`, it matches **nothing at all**:

```sql
SELECT (SELECT COUNT(*) FROM hr.employees WHERE department_id NOT IN (10, 20)) AS plain_list,
       (SELECT COUNT(*) FROM hr.employees WHERE department_id NOT IN (10, 20, NULL)) AS list_with_null
FROM dual;
```

```text
PLAIN_LIST LIST_WITH_NULL
---------- --------------
       103              0
```

This bites hardest with a subquery: `WHERE id NOT IN (SELECT manager_id FROM ...)` returns **no rows** if any `manager_id` is `NULL`. Use `NOT EXISTS`, or add `WHERE manager_id IS NOT NULL` to the subquery.

## Functions for handling NULL

Oracle has several helpers, and you'll see all of them in existing code:

| Function | What it does |
|---|---|
| `NVL(a, b)` | `a` if it isn't `NULL`, else `b`. |
| `NVL2(a, b, c)` | `b` if `a` isn't `NULL`, else `c`. |
| `COALESCE(a, b, c, ...)` | the first value that isn't `NULL`. It's the standard SQL one, and works in every database. |
| `NULLIF(a, b)` | `NULL` if `a` equals `b`, else `a`. Handy to turn a "blank" placeholder into a real `NULL`. |
| `DECODE(x, y, z, ...)` | Oracle's own compact `CASE`. |

```sql
SELECT NVL2(NULL, 'has value', 'is null') AS nvl2_result,
       COALESCE(NULL, NULL, 'third') AS coalesced,
       NULLIF('a', 'a') AS nullif_same,
       NULLIF('a', 'b') AS nullif_diff,
       DECODE(NULL, NULL, 'DECODE matches NULL', 'no match') AS decode_null
FROM dual;
```

```text
NVL2_RESULT COALESCED NULLIF_SAME NULLIF_DIFF DECODE_NULL
----------- --------- ----------- ----------- -------------------
is null     third                 a           DECODE matches NULL
```

The last column is a quirk: `DECODE` is the one place where two `NULL`s **do** compare as equal. It's covered in [DUAL and Oracle Functions](/lessons/oracle-database/dual-and-functions).

## What this means for your designs

- **Use `IS NULL`** to test for "no value," and never `= ''`.
- Decide what "empty" means for each column. If a middle name could be "none" or "unknown," use a separate column, or a specific word like `'N/A'`, since `''` can't hold the difference.
- Avoid the workaround of storing a single space. It makes data that looks blank, but isn't.
- Be careful when moving data **between** databases: rows that had `''` in SQLite or MySQL become `NULL` in Oracle.

## Try it

A signup list has four guests, and one column of optional nicknames. Predict all four results, then check.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, nicknames.sql"
	min-height="420px"
	:model-value="'WITH guests (name, nickname) AS (\n  SELECT \'Ana\', \'Anaconda\' FROM dual UNION ALL\n  SELECT \'Ben\', \'\' FROM dual UNION ALL\n  SELECT \'Carlo\', NULL FROM dual UNION ALL\n  SELECT \'Dina\', \'D\' FROM dual)\nSELECT COUNT(*) AS guests,\n       COUNT(nickname) AS with_nickname,\n       SUM(CASE WHEN nickname = \'\' THEN 1 ELSE 0 END) AS blank_matches,\n       LISTAGG(COALESCE(nickname, name), \', \') WITHIN GROUP (ORDER BY name) AS call_them\nFROM guests;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this query into FreeSQL, or any Oracle tool, to check your answer.
:::

::: details Check your prediction
Ben's empty nickname and Carlo's `NULL` are both `NULL`, so the query gives:

```text
GUESTS WITH_NICKNAME BLANK_MATCHES CALL_THEM
------ ------------- ------------- --------------------------
     4             2             0 Anaconda, Ben, Carlo, D
```

Only Ana and Dina have nicknames, so `COUNT(nickname)` is 2. Comparing with `''` matches nobody, so the sum is 0. `COALESCE(nickname, name)` falls back to the name for the two `NULL` nicknames, and `LISTAGG` joins the results, in name order, with commas.
:::

## Try it yourself

1. Change the test in `blank_matches` to `nickname IS NULL`. What does it return now?
2. Add a guest whose nickname is a single space, `' '`. Does the `IS NULL` test count them?
3. Write a query using `NULLIF` that treats a nickname of `'N/A'` as `NULL`.

## Check your understanding

<Quiz
	question="In Oracle, what does WHERE middle_name = '' return?"
	:options="['Rows with a blank middle name', 'All rows', 'An error', 'No rows at all, because an empty string is NULL and nothing equals NULL']"
	:answer-index="3"
	explanation="'' is NULL in Oracle, and a comparison with NULL is never true. Use IS NULL."
/>

<Quiz
	question="What does 'a' || NULL give in Oracle?"
	:options="['NULL', 'An error', 'a', 'aNULL']"
	:answer-index="2"
	explanation="Oracle's || treats NULL as empty text and skips it, so the result is a."
/>

<Quiz
	question="What is the danger of NOT IN (10, 20, NULL)?"
	:options="['It matches nothing, because comparing with NULL is never true', 'It is slower', 'It matches every row', 'It only works with numbers']"
	:answer-index="0"
	explanation="x NOT IN (..., NULL) can never be true, so no rows come back. Remove the NULL, or use NOT EXISTS."
/>

## Up next

You've seen `NVL`, `COALESCE`, `DECODE`, and `dual` in passing. Now let's look at Oracle's toolbox of functions, in [DUAL and Oracle Functions](/lessons/oracle-database/dual-and-functions).
