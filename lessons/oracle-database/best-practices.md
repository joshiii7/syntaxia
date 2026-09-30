---
title: "Oracle Best Practices: SQL, PL/SQL, Bind Variables, and Common Mistakes"
description: "Habits that keep Oracle code healthy: clear naming, exact types, constraints, bind variables, set-based SQL instead of row-by-row loops, proper exception handling, least privilege, and the mistakes almost every beginner makes."
---

# Best Practices and Common Mistakes

*A shared kitchen stays usable when everyone follows a few rules: label the jars, put knives back where they belong, clean as you go. Oracle systems often live for decades and pass through hundreds of hands. Good habits are how they stay usable.*

Oracle will run messy code without complaint, and much of it will even give the right answer, until the data grows, or someone else has to change it. This lesson collects the habits that prevent that, and then the mistakes that trip up almost everyone.

## Name things clearly

- Use **snake_case** with letters, digits, and underscores: `order_items`, `customer_id`. Oracle stores unquoted names in capitals, so the case you type doesn't matter.
- **Never use double quotes around names.** `"Order Items"` creates a name that must forever be typed exactly like that, with quotes. Plain `order_items` works everywhere.
- **Table names** are usually plural nouns (`customers`), and **column names** describe what's inside (`hire_date`, not `d`).
- In PL/SQL, prefix names by kind, so a variable never clashes with a column: **`v_`** for variables, **`p_`** for parameters, **`c_`** for constants, **`e_`** for exceptions, and **`r_`** for records. `WHERE employee_id = employee_id` compares a column with itself. `WHERE employee_id = p_employee_id` does what you meant.
- Names can be at most **128 bytes** in modern Oracle (older versions allowed only 30, so many systems still keep names short).

## Design tables carefully

- Give every table a **primary key**, preferably an identity column ([Sequences and Identity Columns](/lessons/oracle-database/sequences-and-identity)).
- Choose exact types: `NUMBER(p, s)` for money, `DATE` or `TIMESTAMP` for dates, never text. `VARCHAR2` with a sensible size, and `CHAR` semantics for text that might have accents. ([Oracle Data Types](/lessons/oracle-database/data-types))
- Say `NOT NULL` wherever a value is required, and remember that Oracle turns `''` into `NULL`. ([Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings))
- Let the database enforce rules with **constraints**: `CHECK`, `UNIQUE`, `FOREIGN KEY`. A rule in the database can't be forgotten by a program.
- **One fact, one place.** Don't store the same information twice. See [Database Design](/lessons/sqlite3/database-design).

## Write careful SQL

- **List the columns.** `INSERT INTO t (a, b) VALUES (...)`, not `INSERT INTO t VALUES (...)`, which breaks when the table changes. And `SELECT` only the columns you need, rather than `*`.
- **Use `IS NULL`**, never `= NULL` or `= ''`.
- **Use `TO_CHAR`, `TO_DATE`, and `TO_NUMBER` with a format**, instead of relying on the session's defaults. A query that works in your tool can break in another one with different date settings.
- **Sort before you limit.** Use `FETCH FIRST`, or a subquery with `ROWNUM`, never `WHERE ROWNUM <= 5 ORDER BY ...`. ([Top-N Queries](/lessons/oracle-database/top-n-queries))
- **Don't wrap an indexed column in a function** in `WHERE`, because the index can't be used. Compare the column with a range instead. Below, both queries give the same answer, but only the second can use an index on `hire_date`:

```sql
SELECT COUNT(*) FROM hr.employees WHERE TO_CHAR(hire_date, 'YYYY') = '2015';

SELECT COUNT(*) FROM hr.employees
WHERE hire_date >= DATE '2015-01-01' AND hire_date < DATE '2016-01-01';
```

Both count 29 employees in the HR data.

- **Be careful with `NOT IN`** when the list could contain `NULL`. Use `NOT EXISTS` instead.
- **Match types on purpose.** Writing `department_id = '30'` works, because Oracle quietly converts the text to a number. But it's an **implicit conversion**, and it can also stop indexes from being used, or fail on a stray value. Write `department_id = 30`.

## Use bind variables

This is the most important Oracle habit of all. **Never paste values into SQL text.** Use **bind variables**, the `:name` placeholders, and let Oracle fill them in:

```sql
-- Bad: a new statement for every value, and open to SQL injection
'SELECT last_name FROM employees WHERE employee_id = ' || v_id

-- Good: one statement, reused for every value
SELECT last_name FROM hr.employees WHERE employee_id = :id
```

Bind variables matter for two reasons:

- **Security.** The value is sent separately from the SQL text, so it can never change what the statement does. It's how you stop SQL injection, as you learned in [Databases with PDO](/lessons/php/databases-with-pdo).
- **Speed.** Oracle **parses** each new piece of SQL, working out how to run it, and remembers the result. A statement with the value glued in looks new every time, and forces a fresh parse. With a bind variable, the statement is the same, and is reused. On a busy system, that's the difference between working and grinding to a halt.

In PL/SQL, variables in ordinary `SELECT` and `INSERT` statements are **automatically** bound. It's when you build SQL as text and run it with `EXECUTE IMMEDIATE` that you must pass the values with `USING`:

```sql
EXECUTE IMMEDIATE 'SELECT last_name FROM hr.employees WHERE employee_id = :id'
    INTO v_name USING p_employee_id;
```

## Write careful PL/SQL

- **Use `%TYPE` and `%ROWTYPE`** so variables follow the columns. ([PL/SQL Blocks](/lessons/oracle-database/plsql-blocks))
- **Replace magic numbers with constants.** The rate `0.1` in the middle of a formula explains nothing. `c_high_rate` does.
- **Keep subprograms small and focused**, with names that say what they do, and group them in [packages](/lessons/oracle-database/packages).
- **Handle exceptions honestly.** Catch what you expect, by name. Never write `WHEN OTHERS THEN NULL;`. Log and re-raise what you can't fix. ([PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions))
- **Think in sets, not rows.** A loop that runs one `UPDATE` per row is often called **slow-by-slow** processing. One `UPDATE` that changes every row at once is usually far faster, since every round trip between PL/SQL and SQL costs something. Use a loop only for what SQL can't do.
- **Give every `SELECT INTO` a plan** for `NO_DATA_FOUND` and `TOO_MANY_ROWS`.
- **Comment the why**, not the what.

## Transactions and safety

- **End every transaction on purpose** with `COMMIT` or `ROLLBACK`, and keep transactions short. Remember that DDL commits automatically. ([Transactions](/lessons/oracle-database/transactions))
- **Look before you delete.** Run a `SELECT` with the same `WHERE` first, and check the count.
- **Use least privilege.** Applications get their own account, with only what they need, never `SYS` or `SYSTEM`, and be sparing with `ANY` privileges. ([Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users))
- **Take backups**, and test restoring them. Oracle's tool for this, RMAN, is beyond this track, but the rule is the same as everywhere.
- Keep your table and code **scripts in files**, in version control, so the database can be rebuilt.

## The mistakes almost everyone makes

When something's wrong and you can't see why, run down this list. Every one of these came up somewhere in this track.

1. **Comparing with `= ''`.** In Oracle, `''` is `NULL`, and nothing equals `NULL`. Use `IS NULL`. ([Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings))
2. **`WHERE ROWNUM <= 5 ORDER BY ...`**, which picks any five rows and sorts them. ([Top-N Queries](/lessons/oracle-database/top-n-queries))
3. **`NOT IN` with a `NULL` in the list**, which matches nothing. ([Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings))
4. **Trusting a `DATE`'s default display**, which varies between tools, and can hide the time. Use `TO_CHAR`. ([Oracle Data Types](/lessons/oracle-database/data-types))
5. **Forgetting that `DATE` includes a time**, so `WHERE order_date = DATE '2026-10-15'` misses orders placed at 2 PM. ([Oracle Data Types](/lessons/oracle-database/data-types))
6. **Expecting a `ROLLBACK` to undo a `CREATE TABLE`.** DDL commits. ([Transactions](/lessons/oracle-database/transactions))
7. **Forgetting to `COMMIT`**, so nobody else sees the change, and then closing the tool. ([Transactions](/lessons/oracle-database/transactions))
8. **Expecting sequence numbers to be gap-free**, or to be given back by a `ROLLBACK`. ([Sequences and Identity Columns](/lessons/oracle-database/sequences-and-identity))
9. **Updating a column used in a `MERGE`'s `ON` clause**, or merging a source with duplicate keys. ([Upserts with MERGE](/lessons/oracle-database/merge))
10. **Double-quoting names**, which makes them case-sensitive forever. ([Coming from SQLite](/lessons/oracle-database/coming-from-sqlite))
11. **Forgetting `SET SERVEROUTPUT ON`**, so `DBMS_OUTPUT` prints nothing. ([Oracle Tools](/lessons/oracle-database/tools))
12. **Writing `ELSEIF` or `ELSE IF`** instead of `ELSIF`. ([PL/SQL Variables and Control Flow](/lessons/oracle-database/plsql-variables-and-control))
13. **`SELECT INTO` with no handler**, when the query may return zero or many rows. ([PL/SQL Blocks](/lessons/oracle-database/plsql-blocks))
14. **`WHEN OTHERS THEN NULL`**, which hides every bug. ([PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions))
15. **Reading the table a trigger is changing**, and hitting the mutating table error. ([Triggers](/lessons/oracle-database/triggers))
16. **Pasting values into SQL text**, instead of using bind variables. (This lesson)

## Try it

This block works, and prints the right answer. But it breaks many of the habits in this lesson. Read it, predict what it prints, and count how many problems you can spot.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, messy.sql"
	min-height="380px"
	:model-value="'DECLARE\n  a NUMBER; b VARCHAR2(100); c NUMBER := 0;\nBEGIN\n  FOR i IN (SELECT * FROM hr.employees WHERE department_id = 30) LOOP\n    a := i.salary;\n    if a &gt; 3000 then c := c + a * 0.1; else c := c + a * 0.15; end if;\n  END LOOP;\n  DBMS_OUTPUT.PUT_LINE(\'Total \' || c);\nEXCEPTION WHEN OTHERS THEN NULL;\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
Total 3030

PL/SQL procedure successfully completed.
```

Some of the problems:

- the names `a`, `b`, and `c` say nothing, and `b` isn't even used;
- the magic numbers `3000`, `0.1`, and `0.15` are buried in the formula;
- `SELECT *` fetches every column, when only `salary` is needed;
- the keywords are in a random mix of cases, and everything is crammed onto one line;
- `WHEN OTHERS THEN NULL` would silently hide any error, and print nothing at all;
- the rate rule can't be reused or tested on its own.

Here's one way to clean it up. It prints the same total:

```sql
DECLARE
  c_high_rate    CONSTANT NUMBER := 0.10;
  c_low_rate     CONSTANT NUMBER := 0.15;
  c_salary_limit CONSTANT NUMBER := 3000;
  v_total_bonus  NUMBER := 0;

  FUNCTION bonus_for (p_salary IN NUMBER) RETURN NUMBER IS
  BEGIN
    IF p_salary > c_salary_limit THEN
      RETURN p_salary * c_high_rate;
    END IF;
    RETURN p_salary * c_low_rate;
  END bonus_for;
BEGIN
  FOR r IN (SELECT salary FROM hr.employees WHERE department_id = 30) LOOP
    v_total_bonus := v_total_bonus + bonus_for(r.salary);
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('Total bonus: ' || v_total_bonus);
END;
/
```

```text
Total bonus: 3030

PL/SQL procedure successfully completed.
```

It's longer, and that's fine. Every value has a name that says what it is, the rule lives in one small function, changing a rate is a one-line edit, and an error would now be reported, instead of swallowed.
:::

## Try it yourself

1. In the messy version, change the department to one that doesn't exist, like `999`. What does it print? Now try the clean version. Which behavior is better, and why?
2. Add a new tier to the clean version: salaries of 10,000 and over get 5%. How many places did you have to change?
3. Pick a query you wrote earlier in this track. Find one place where a better habit from this lesson applies (a function on a column, a missing `TO_CHAR`, a `SELECT *`), and fix it.

## Check your understanding

<Quiz
	question="Why use bind variables instead of pasting values into SQL text?"
	:options="['They are prettier', 'They prevent SQL injection and let Oracle reuse one parsed statement for every value', 'They only work in PL/SQL', 'They make the database smaller']"
	:answer-index="1"
	explanation="Binding keeps values separate from the SQL, which is both safer and much faster on a busy system."
/>

<Quiz
	question="Which is the better way to count employees hired in 2015 if hire_date is indexed?"
	:options="['WHERE TO_CHAR(hire_date, \'YYYY\') = \'2015\'', 'WHERE hire_date LIKE \'%2015\'', 'WHERE hire_date >= DATE \'2015-01-01\' AND hire_date < DATE \'2016-01-01\'', 'They are all the same']"
	:answer-index="2"
	explanation="A range on the bare column can use the index. Wrapping the column in a function stops it."
/>

<Quiz
	question="What does WHEN OTHERS THEN NULL; do?"
	:options="['Silently swallows every error, hiding bugs', 'Logs the error', 'Re-raises the error', 'Ends the program']"
	:answer-index="0"
	explanation="It catches everything and does nothing, so problems vanish, and the program carries on with bad data."
/>

## Up next

You've learned everything you need to work confidently in Oracle. Time to prove it, in the [Final Project: Course Enrollment System](/lessons/oracle-database/final-project).
