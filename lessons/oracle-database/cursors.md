---
title: "PL/SQL Cursors: Looping over Query Results with FOR and FETCH"
description: "Process many rows one at a time in PL/SQL: the cursor FOR loop, explicit cursors with OPEN, FETCH, and CLOSE, cursor attributes like %NOTFOUND and %ROWCOUNT, parameterized cursors, %ROWTYPE, and SQL%ROWCOUNT."
---

# Cursors: Looping over Query Results

*Reading a long list of names aloud, you don't take in the whole page at once. You point at one name, say it, and move your finger to the next. A cursor is the finger.*

In [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks), `SELECT ... INTO` read **one** row into variables. Real jobs need to go through **many** rows: give every employee a raise, print a report, check each order. For that, PL/SQL uses a **cursor**: a pointer that steps through the rows of a query, one at a time, so your code can work on each.

The examples use the HR tables, and run in FreeSQL without signing in.

## The easy way: the cursor FOR loop

The simplest and best way to loop over query results is a `FOR` loop that has a **query** in place of the range of numbers:

```sql
BEGIN
  FOR r IN (SELECT last_name, salary
            FROM hr.employees
            WHERE department_id = 60
            ORDER BY salary DESC, last_name) LOOP
    DBMS_OUTPUT.PUT_LINE(RPAD(r.last_name, 10) || r.salary);
  END LOOP;
END;
/
```

```text
James     9000
Miller    6000
Jackson   4800
Williams  4800
Nguyen    4200

PL/SQL procedure successfully completed.
```

Here, everything is done for you: PL/SQL opens the cursor, fetches each row into `r`, runs the loop body once per row, and closes the cursor at the end (even if there's an error). Inside the loop, you reach each column as **`r.column_name`**. The variable `r` is created by the loop, just like the counter of a `FOR i IN 1..3` loop, and it only exists inside it.

If the query returns **no rows**, the loop body simply never runs. There's no error, unlike `SELECT INTO`. That makes the cursor `FOR` loop the natural choice whenever there might be zero, one, or many rows.

## Explicit cursors: OPEN, FETCH, CLOSE

Sometimes you need finer control. You can do each step yourself, with an **explicit cursor**:

```sql
DECLARE
  CURSOR c_dept IS
    SELECT department_id, department_name
    FROM hr.departments
    WHERE department_id <= 30
    ORDER BY department_id;

  v_id   hr.departments.department_id%TYPE;
  v_name hr.departments.department_name%TYPE;
BEGIN
  OPEN c_dept;
  LOOP
    FETCH c_dept INTO v_id, v_name;
    EXIT WHEN c_dept%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(v_id || ' - ' || v_name || ' (row ' || c_dept%ROWCOUNT || ')');
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('Total rows: ' || c_dept%ROWCOUNT);
  CLOSE c_dept;
END;
/
```

```text
10 - Administration (row 1)
20 - Marketing (row 2)
30 - Purchasing (row 3)
Total rows: 3

PL/SQL procedure successfully completed.
```

The steps:

1. **Declare** the cursor in the `DECLARE` section, with `CURSOR name IS query;`. It doesn't run yet.
2. **`OPEN`** it: Oracle runs the query.
3. **`FETCH`** brings the next row into your variables (`INTO`, just like `SELECT INTO`).
4. **`EXIT WHEN c_dept%NOTFOUND`** stops the loop after the last row. The check must come **right after** the `FETCH`.
5. **`CLOSE`** releases the cursor. Forgetting this leaks resources.

Compared with the `FOR` loop, that's a lot of steps to get wrong. Use explicit cursors only when you need the control.

## Cursor attributes

A cursor has **attributes**, written after its name with a `%`, that tell you about its state:

| Attribute | Meaning |
|---|---|
| `%FOUND` | `TRUE` if the most recent `FETCH` found a row |
| `%NOTFOUND` | `TRUE` if the most recent `FETCH` did **not** find a row |
| `%ROWCOUNT` | how many rows have been fetched **so far** |
| `%ISOPEN` | `TRUE` if the cursor is currently open |

```sql
DECLARE
  CURSOR c IS SELECT last_name FROM hr.employees WHERE department_id = 10;
  v hr.employees.last_name%TYPE;
BEGIN
  OPEN c;
  DBMS_OUTPUT.PUT_LINE('Open? ' || CASE WHEN c%ISOPEN THEN 'yes' ELSE 'no' END);
  FETCH c INTO v;
  DBMS_OUTPUT.PUT_LINE('Found: ' || v);
  FETCH c INTO v;
  DBMS_OUTPUT.PUT_LINE('Second fetch found a row? ' || CASE WHEN c%FOUND THEN 'yes' ELSE 'no' END);
  CLOSE c;
  DBMS_OUTPUT.PUT_LINE('Open after close? ' || CASE WHEN c%ISOPEN THEN 'yes' ELSE 'no' END);
END;
/
```

```text
Open? yes
Found: Whalen
Second fetch found a row? no
Open after close? no

PL/SQL procedure successfully completed.
```

Department 10 has a single employee, so the second `FETCH` finds nothing. A note: `%ROWCOUNT` counts rows fetched, and it's the way to find out how many rows a query returned, after you've looped.

## Cursors with parameters

A cursor can take **parameters**, so one definition can serve many different questions:

```sql
DECLARE
  CURSOR c_emp (p_dept NUMBER) IS
    SELECT last_name, salary
    FROM hr.employees
    WHERE department_id = p_dept
    ORDER BY salary DESC, last_name;

  v_total NUMBER := 0;
BEGIN
  FOR r IN c_emp(30) LOOP
    v_total := v_total + r.salary;
    DBMS_OUTPUT.PUT_LINE(r.last_name || ': ' || r.salary);
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('Department 30 payroll: ' || v_total);
END;
/
```

```text
Li: 11000
Khoo: 3100
Baida: 2900
Tobias: 2800
Himuro: 2600
Colmenares: 2500
Department 30 payroll: 24900

PL/SQL procedure successfully completed.
```

You pass the argument, `30`, where the cursor is used: `FOR r IN c_emp(30)`. Call it again with another number, and you get another department. Notice the running total: a common job for a loop is to add things up as you go.

## %ROWTYPE: a whole row in one variable

Instead of one variable per column, `%ROWTYPE` declares a **record**: one variable that has a field for every column of a table (or a cursor). It's what a cursor `FOR` loop's `r` is, behind the scenes. You can also use it with `SELECT INTO`:

```sql
DECLARE
  v_rec hr.employees%ROWTYPE;
BEGIN
  SELECT * INTO v_rec FROM hr.employees WHERE employee_id = 101;
  DBMS_OUTPUT.PUT_LINE(v_rec.first_name || ' ' || v_rec.last_name
                       || ', job ' || v_rec.job_id
                       || ', hired ' || TO_CHAR(v_rec.hire_date, 'YYYY-MM-DD'));
END;
/
```

```text
Neena Yang, job AD_VP, hired 2015-09-21

PL/SQL procedure successfully completed.
```

Fields are read with a dot, `v_rec.first_name`, and if the table gains a column later, the record grows to match.

## The hidden cursor: SQL%ROWCOUNT

Every SQL statement you run in PL/SQL uses a cursor. For `INSERT`, `UPDATE`, `DELETE`, and `MERGE`, Oracle makes an **implicit cursor** with the fixed name **`SQL`**, and it tells you how many rows the last statement affected:

```sql
BEGIN
  UPDATE accounts SET balance = balance * 1.01 WHERE balance > 500;
  DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT || ' accounts updated');
  IF SQL%NOTFOUND THEN
    DBMS_OUTPUT.PUT_LINE('Nobody had more than 500.');
  END IF;
END;
/
```

If, for example, two accounts had more than 500, it prints `2 accounts updated`. (This example changes data in a table you'd have created, like the `accounts` table from [Transactions](/lessons/oracle-database/transactions).) `SQL%ROWCOUNT` is the standard way to check whether an `UPDATE` or `DELETE` actually changed something.

## Don't loop when one statement will do

A cursor loop that runs one `UPDATE` per row works, but it's usually **much slower** than a single `UPDATE` that does all the rows at once. Every trip between PL/SQL and SQL has a cost. Before writing a loop to change data, ask: can one SQL statement do this? If yes, use it. Loops are for the things SQL can't easily do: complicated logic per row, calling other code, or printing a report.

## Try it

A payroll report for department 30, using a parameterized cursor. Predict everything it prints.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, payroll.sql"
	min-height="420px"
	:model-value="'DECLARE\n  CURSOR c_emp (p_dept NUMBER) IS\n    SELECT last_name, salary\n    FROM hr.employees\n    WHERE department_id = p_dept\n    ORDER BY salary DESC, last_name;\n\n  v_total NUMBER := 0;\n  v_count NUMBER := 0;\nBEGIN\n  FOR r IN c_emp(30) LOOP\n    v_total := v_total + r.salary;\n    v_count := v_count + 1;\n    IF r.salary &gt;= 3000 THEN\n      DBMS_OUTPUT.PUT_LINE(r.last_name || \': \' || r.salary);\n    END IF;\n  END LOOP;\n\n  DBMS_OUTPUT.PUT_LINE(v_count || \' people, average \' || ROUND(v_total / v_count));\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
Li: 11000
Khoo: 3100
6 people, average 4150

PL/SQL procedure successfully completed.
```

The loop visits all six employees of department 30, from the highest salary down, and adds each into the total (24,900). But it only prints the names of those who earn 3,000 or more: Li and Khoo. At the end, the average is 24,900 divided by 6, which is 4,150.
:::

## Try it yourself

1. Change the department to `60`. Who is printed, and what's the average?
2. Rewrite the block using an explicit cursor, with `OPEN`, `FETCH`, `EXIT WHEN`, and `CLOSE`, and check that it gives the same output.
3. Write a cursor `FOR` loop over `hr.departments` that prints each department's name and how many employees it has, using a second query inside the loop. Then think about how to do it with a single `SELECT` and `GROUP BY` instead.

## Check your understanding

<Quiz
	question="What happens in a cursor FOR loop when the query returns no rows?"
	:options="['It raises NO_DATA_FOUND', 'It raises TOO_MANY_ROWS', 'The loop body never runs, and there is no error', 'The block stops']"
	:answer-index="2"
	explanation="Unlike SELECT INTO, a cursor loop is happy with zero rows: its body just runs zero times."
/>

<Quiz
	question="In an explicit cursor loop, where should EXIT WHEN cursor%NOTFOUND go?"
	:options="['Right after the FETCH', 'Before the OPEN', 'After the CLOSE', 'It is not needed']"
	:answer-index="0"
	explanation="%NOTFOUND reports on the most recent FETCH, so the check goes immediately after it."
/>

<Quiz
	question="What does SQL%ROWCOUNT tell you?"
	:options="['How many rows the most recent INSERT, UPDATE, DELETE, or MERGE affected', 'How many rows are in the table', 'How many cursors are open', 'The number of columns']"
	:answer-index="0"
	explanation="After a data-changing statement, SQL%ROWCOUNT gives the number of rows it changed."
/>

## Up next

Anonymous blocks disappear as soon as they run. To keep your code in the database, and call it by name, you create stored procedures and functions, in [Stored Procedures and Functions](/lessons/oracle-database/procedures-and-functions).
