---
title: "Oracle Data Types: VARCHAR2, NUMBER, DATE, and More"
description: "Learn Oracle's own data types: VARCHAR2 and CHAR for text, NUMBER with precision and scale, DATE with its built-in time, TIMESTAMP, CLOB, BOOLEAN in 26ai, and what happens when data doesn't fit."
---

# Oracle Data Types: VARCHAR2, NUMBER, and DATE

*Moving boxes come in sizes. Oracle has fewer box types than some databases, but each one is precise about what it holds and how it holds it.*

Every column in an Oracle table has a **data type** that decides what it can hold. If you know MySQL's types from [Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types), you'll see that Oracle has fewer, more general ones. It leans on a few flexible types instead of many special-purpose ones.

The examples in this lesson use `CAST` (to try a type out) and Oracle's HR sample tables, so you can run them in FreeSQL without creating anything.

## Text: VARCHAR2 and CHAR

- **`VARCHAR2(n)`** holds text up to `n` **bytes** or characters. It's the everyday text type, and what you'll use for names, emails, and titles. (The "2" is a historical detail: an older `VARCHAR` type was reserved for future use, so Oracle's real one is `VARCHAR2`. Always type it with the 2.)
- **`CHAR(n)`** holds exactly `n` characters, padded with spaces. It's rare, and only useful for fixed-size codes.
- **`CLOB`** holds very large text, up to gigabytes: articles, logs, or documents.

Limits matter. A `VARCHAR2` column has a maximum size that you choose when you create the table. The HR tables show this: `FIRST_NAME` is `VARCHAR2(20)`. Try to store 21 characters, and Oracle refuses with error `ORA-12899: value too large for column`. (Unlike SQLite, which would happily keep it.)

**Bytes or characters?** By default, the size counts **bytes**, unless your database's settings say otherwise. That matters with letters like `é`, which take more than one byte in Oracle's usual character set:

```sql
SELECT LENGTH('Café') AS chars, LENGTHB('Café') AS bytes FROM dual;
```

```text
CHARS BYTES
----- -----
    4     5
```

To be safe, you can say which you mean when you create a column: `VARCHAR2(50 CHAR)` holds 50 **characters** whatever they are, and `VARCHAR2(50 BYTE)` holds 50 bytes. For text that might have accents or other alphabets, use `CHAR`.

`CAST` is a convenient way to try a type out. Watch what it does with text that's too long:

```sql
SELECT CAST('abcdef' AS VARCHAR2(3)) AS cut FROM dual;
```

```text
CUT
---
abc
```

`CAST` quietly **cuts** the text. An `INSERT` into a column that's too short does not: it fails with `ORA-12899`. It's better to be told.

## Numbers: NUMBER

Oracle has one main numeric type, **`NUMBER`**, for whole numbers and decimals alike. You can give it two settings:

- **`NUMBER(p, s)`**: `p` is the **precision** (the total number of significant digits), and `s` is the **scale** (how many digits come after the decimal point).
- **`NUMBER(p)`**: a whole number with up to `p` digits.
- **`NUMBER`** on its own: any number, with up to 38 significant digits.

Oracle also accepts `INTEGER`, `INT`, and `DECIMAL(p, s)`, but they're just other names for `NUMBER`.

The HR `SALARY` column is `NUMBER(8,2)`: up to 8 digits in total, 2 of them after the point, so up to 999999.99. Oracle **rounds** values with too many decimals to fit, and **refuses** values with too many digits:

```sql
SELECT CAST(98765.4321 AS NUMBER(7,2)) AS a,
       CAST(15.5 AS NUMBER(2)) AS b,
       CAST(1250 AS NUMBER(4,-2)) AS c,
       CAST(-2.5 AS NUMBER(2)) AS d
FROM dual;
```

```text
       A  B    C  D
--------  -- ---- --
98765.43  16 1300 -3
```

- `98765.4321` becomes `98765.43`: it's rounded to 2 decimals.
- `15.5` fits `NUMBER(2)` after rounding to a whole number: it becomes `16`. Halves round **away from zero**, so `-2.5` becomes `-3`.
- A **negative** scale rounds to the left of the point: `NUMBER(4,-2)` rounds to the nearest hundred, so `1250` becomes `1300`.

Too many digits is an error. `9999999` has 7 digits, but with 2 of them reserved for decimals, `NUMBER(7,2)` has room for only 5 before the point:

```sql
SELECT CAST(9999999 AS NUMBER(7,2)) AS oops FROM dual;
```

```text
ORA-01438: value 9999999 greater than specified precision (7, 2) for column
```

(Older versions of Oracle print a shorter version of this message, `value larger than specified precision allowed for this column`. The code, `ORA-01438`, is the same.)

`NUMBER` stores decimals **exactly**, in decimal, so it's fine for money:

```sql
SELECT 0.1 + 0.2 AS exact_number, 0.1d + 0.2d AS binary_double FROM dual;
```

```text
EXACT_NUMBER BINARY_DOUBLE
------------ -------------------
         0.3 0.30000000000000004
```

`BINARY_DOUBLE` (and `BINARY_FLOAT`) are Oracle's approximate types, like `DOUBLE` in other languages. The `d` after a number, like `0.1d`, makes it one. They're faster for scientific work, but have the tiny errors you know from PHP and MySQL. Use `NUMBER` for money.

Errors happen when you mix text and numbers. `TO_NUMBER('abc')` fails with `ORA-01722: invalid number`, and Oracle refuses to guess. (Newer versions add extra detail to the message, but the code is the same.)

## Dates: DATE always has a time

Oracle's **`DATE`** type is different from what the name suggests. It stores a date **and a time**, down to the second. When you write a date without a time, the time is midnight:

```sql
SELECT TO_CHAR(DATE '2026-10-15', 'YYYY-MM-DD HH24:MI:SS') AS midnight FROM dual;
```

```text
MIDNIGHT
-------------------
2026-10-15 00:00:00
```

- `DATE '2026-10-15'` is a **date literal**: the word `DATE`, then the date as `YYYY-MM-DD` in quotes.
- `TO_CHAR(date, format)` turns a date into text in the layout you choose. Common pieces are `YYYY` (year), `MM` (month), `DD` (day), `HH24` (hour, 24-hour clock), `MI` (minutes), and `SS` (seconds).

**Dates support arithmetic**, and here Oracle is delightfully simple: adding a **number** adds that many **days**. Subtracting two dates gives the number of days between them:

```sql
SELECT TO_CHAR(DATE '2026-10-15' + 10, 'YYYY-MM-DD') AS plus_ten,
       TO_CHAR(DATE '2026-10-15' + 1/24, 'HH24:MI') AS plus_hour,
       DATE '2026-12-25' - DATE '2026-10-15' AS days_left
FROM dual;
```

```text
PLUS_TEN   PLUS_HOUR DAYS_LEFT
---------- --------- ---------
2026-10-25 01:00            71
```

`1/24` of a day is one hour. For whole months, use `ADD_MONTHS(date, n)`, which handles months of different lengths for you.

**Showing a `DATE` without `TO_CHAR`.** Every session has a default layout for dates, controlled by a setting called `NLS_DATE_FORMAT`. In SQL\*Plus, it's usually `DD-MON-RR`, so `15-OCT-26`. Other tools use their own layouts, and hide the time. Since the display varies, and can even hide the time part, **always use `TO_CHAR`** when you need to see or compare dates as text. And to turn text into a date, use `TO_DATE(text, format)`, as in `TO_DATE('15/10/2026', 'DD/MM/YYYY')`, where you say exactly how to read it.

## TIMESTAMP: more precision

**`TIMESTAMP`** holds a date and time with **fractions of a second** (up to 9 digits), and there are variants that also store a time zone: `TIMESTAMP WITH TIME ZONE` and `TIMESTAMP WITH LOCAL TIME ZONE`. Use `TIMESTAMP` when the exact moment matters, like a log entry, and `DATE` for everything else.

```sql
SELECT TO_CHAR(TIMESTAMP '2026-10-15 14:30:45.123456', 'YYYY-MM-DD HH24:MI:SS.FF3') AS with_fraction FROM dual;
```

```text
WITH_FRACTION
-----------------------
2026-10-15 14:30:45.123
```

`FF3` shows three digits of the fraction.

## BOOLEAN, at last

Older Oracle versions have no true/false column type. People used `NUMBER(1)` with `1` and `0`, or `CHAR(1)` with `'Y'` and `'N'`. Oracle **26ai** finally adds a real **`BOOLEAN`**:

```sql
SELECT TRUE AS flag, CAST(1 AS BOOLEAN) AS one_as_bool FROM dual;
```

```text
FLAG ONE_AS_BOOL
---- -----------
true true
```

Booleans show as `true` and `false`, and `CAST(1 AS BOOLEAN)` turns a number into one. If you need to support older databases, stick with `NUMBER(1)` or `CHAR(1)`.

## Other types worth knowing

| Type | Holds |
|---|---|
| `CLOB` | huge amounts of text |
| `BLOB` | huge amounts of raw data, like an image |
| `RAW(n)` | small amounts of raw bytes |
| `JSON` | a JSON document (since Oracle 21c), like MySQL's `JSON` |
| `INTERVAL` | a length of time, like "3 days" |
| `ROWID` | the physical address of a row (see [Top-N Queries](/lessons/oracle-database/top-n-queries)) |

## Looking up a table's types

The **data dictionary** is a set of views where Oracle describes itself. `ALL_TAB_COLUMNS` lists the columns of tables you can see:

```sql
SELECT column_name, data_type, data_precision, data_scale
FROM all_tab_columns
WHERE owner = 'HR' AND table_name = 'EMPLOYEES'
  AND column_name IN ('SALARY', 'HIRE_DATE', 'FIRST_NAME', 'COMMISSION_PCT')
ORDER BY column_name;
```

```text
COLUMN_NAME      DATA_TYPE  DATA_PRECISION DATA_SCALE
---------------- ---------- -------------- ----------
COMMISSION_PCT   NUMBER                  2          2
FIRST_NAME       VARCHAR2
HIRE_DATE        DATE
SALARY           NUMBER                  8          2
```

You'll use the dictionary again in [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users). (Name and type text is always in capitals in the dictionary.)

## Try it

Predict what each column of this query returns, and then check with the explanation.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, types.sql"
	min-height="300px"
	:model-value="'SELECT CAST(98765.4321 AS NUMBER(7,2)) AS price,\n       CAST(1250 AS NUMBER(4,-2)) AS rounded,\n       TO_CHAR(DATE \'2026-12-31\' + 1, \'YYYY-MM-DD\') AS new_year,\n       DATE \'2026-12-25\' - DATE \'2026-10-15\' AS days_left,\n       LENGTH(\'Café\') AS chars,\n       LENGTHB(\'Café\') AS bytes\nFROM dual;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this query into FreeSQL, or any Oracle tool, to check it.
:::

::: details Check your prediction
```text
   PRICE ROUNDED NEW_YEAR   DAYS_LEFT CHARS BYTES
-------- ------- ---------- --------- ----- -----
98765.43    1300 2027-01-01        71     4     5
```

The price is rounded to 2 decimals. `NUMBER(4,-2)` rounds 1250 to the nearest hundred, so 1300. One day after December 31 is New Year's Day of the next year, and there are 71 days from October 15 to December 25. `Café` has 4 characters but 5 bytes, since the `é` takes two.
:::

## Try it yourself

1. Change `NUMBER(4,-2)` to `NUMBER(4,-1)` and predict the answer. Then check it.
2. Use `TO_CHAR(DATE '2026-10-15', 'Day, DD Month YYYY')` and see what the format pieces `Day` and `Month` give.
3. Try `SELECT CAST(9999999 AS NUMBER(7,2)) FROM dual;` and read the error. How many digits can go before the decimal point in `NUMBER(7,2)`?

## Check your understanding

<Quiz
	question="What does NUMBER(6, 2) allow?"
	:options="['Up to 6 digits in total, 2 of them after the decimal point', 'Up to 6 digits after the decimal point', 'Numbers up to 6 characters long, as text', 'Two numbers, each up to 6']"
	:answer-index="0"
	explanation="Precision is the total number of digits, and scale is how many come after the point. NUMBER(6,2) holds up to 9999.99."
/>

<Quiz
	question="What does adding 10 to an Oracle DATE do?"
	:options="['Adds 10 hours', 'Adds 10 seconds', 'Adds 10 days', 'Causes an error']"
	:answer-index="2"
	explanation="Adding a number to a DATE adds that many days. Fractions add parts of a day, so 1/24 is an hour."
/>

<Quiz
	question="Why use TO_CHAR when showing a DATE?"
	:options="['DATE cannot be shown without it', 'The default display varies between tools and can hide the time, so TO_CHAR lets you choose exactly the layout', 'TO_CHAR makes dates faster', 'TO_CHAR changes the stored date']"
	:answer-index="1"
	explanation="The default date layout depends on the session's settings and the tool. TO_CHAR with a format gives the same text everywhere."
/>

## Up next

Now for Oracle's most famous quirk. The empty string `''` isn't what you think it is, in [Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings).
