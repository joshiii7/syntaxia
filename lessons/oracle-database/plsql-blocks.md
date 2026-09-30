---
title: "PL/SQL Blocks: DECLARE, BEGIN, EXCEPTION, and END"
description: "Write your first PL/SQL programs: the anonymous block with DECLARE, BEGIN, EXCEPTION, and END, printing with DBMS_OUTPUT, reading a query into variables with SELECT INTO, %TYPE, and nested blocks."
---

# PL/SQL Blocks: DECLARE, BEGIN, and END

*SQL asks the database a question and waits for an answer. PL/SQL gives the database a small robot: you write down the steps, and the robot carries them out, right inside, next to the data.*

So far in this track, you've used SQL: statements that read and change data. **PL/SQL** ("Procedural Language extension to SQL") is Oracle's programming language, built into the database. It adds what SQL lacks: variables, `IF` decisions, loops, and error handling, all mixed with SQL.

Why run code inside the database? It's **close to the data**, so it's fast: there's no need to send rows to a program and back. It's **secure and consistent**: rules can live in one place, whichever application connects. And it's **everywhere** in the Oracle world: banks, ERP systems, and government software have millions of lines of it. It's the main reason many organizations choose Oracle.

Every example in this lesson and the next few runs in FreeSQL without signing in, using the HR tables.

## Your first block

A PL/SQL program is made of **blocks**. Here's the smallest useful one:

```sql
BEGIN
  DBMS_OUTPUT.PUT_LINE('Hello from inside Oracle!');
END;
/
```

```text
Hello from inside Oracle!

PL/SQL procedure successfully completed.
```

- **`BEGIN ... END;`** wraps the statements to run. Each statement ends with a semicolon, including `END;`.
- **`DBMS_OUTPUT.PUT_LINE(text)`** prints a line. `DBMS_OUTPUT` is a built-in package (you'll learn what that means in [Packages](/lessons/oracle-database/packages)), and `PUT_LINE` is one of its procedures. To see its output in SQL\*Plus or SQLcl, first run `SET SERVEROUTPUT ON`, as you learned in [Oracle Tools](/lessons/oracle-database/tools). FreeSQL shows it automatically.
- The **`/`** on a line by itself tells the tool to run the block. That's needed because the block contains semicolons, which would otherwise be read as the end of a SQL statement.

The message **PL/SQL procedure successfully completed** means the block ran without an error.

## The four parts of a block

A full block has up to four parts, and **only the middle one is required**:

```sql
DECLARE
  -- 1. Declarations: variables, constants, and more
BEGIN
  -- 2. The steps to run (required)
EXCEPTION
  -- 3. What to do when something goes wrong
END;
/
```

| Part | Purpose |
|---|---|
| `DECLARE` | Names the variables and constants the block will use. It's optional. |
| `BEGIN` | The **executable** part: the steps. It's required. |
| `EXCEPTION` | Handlers for errors. It's optional. |
| `END;` | Closes the block. |

A block like this, with no name, that's written and run on the spot, is called an **anonymous block**. Blocks can also be saved in the database under a name, as procedures, functions, and packages, which come later in this track.

Comments work like in SQL: `-- to the end of the line`, or `/* across several lines */`.

## Variables, and reading data into them

In the `DECLARE` section, you name each variable, and give it a type: the same types you learned in [Oracle Data Types](/lessons/oracle-database/data-types). The assignment operator is **`:=`**, pronounced "gets", and it's different from the `=` used for comparing.

The most common job in PL/SQL is reading data from a table into variables, with **`SELECT ... INTO`**:

```sql
DECLARE
  v_name   VARCHAR2(50);
  v_salary hr.employees.salary%TYPE;
BEGIN
  SELECT first_name || ' ' || last_name, salary
    INTO v_name, v_salary
    FROM hr.employees
   WHERE employee_id = 100;

  DBMS_OUTPUT.PUT_LINE(v_name || ' earns ' || v_salary);
END;
/
```

```text
Steven King earns 24000

PL/SQL procedure successfully completed.
```

- `INTO v_name, v_salary` puts the query's two columns into two variables, in order.
- **`%TYPE`** is a handy trick. `hr.employees.salary%TYPE` means "the same type as the `salary` column." If the column changes later, the variable follows automatically. Prefer it whenever a variable holds a column's value.
- The name prefix `v_` (for variable) is a common habit. It stops variable names from clashing with column names.

`SELECT ... INTO` has a strict rule: the query must return **exactly one row**.

- **Zero rows** raises the error **`NO_DATA_FOUND`**.
- **More than one row** raises **`TOO_MANY_ROWS`**.

If you don't handle them, the block stops with an error:

```sql
DECLARE
  v_name VARCHAR2(50);
BEGIN
  SELECT last_name INTO v_name FROM hr.employees WHERE department_id = 60;
END;
/
```

```text
ORA-01422: exact fetch returned more than the requested number of rows
ORA-06512: at line 4
```

The second line, `ORA-06512`, is a **stack trace** line: it tells you which line of the block was running. Department 60 has five employees, but the variable holds only one.

## Handling errors: EXCEPTION

That's what the `EXCEPTION` section is for. When something goes wrong in the `BEGIN` part, PL/SQL jumps to the matching handler, instead of stopping:

```sql
DECLARE
  v_name VARCHAR2(50);
BEGIN
  SELECT last_name INTO v_name FROM hr.employees WHERE employee_id = 9999;
  DBMS_OUTPUT.PUT_LINE('Found ' || v_name);
EXCEPTION
  WHEN NO_DATA_FOUND THEN
    DBMS_OUTPUT.PUT_LINE('No such employee.');
END;
/
```

```text
No such employee.

PL/SQL procedure successfully completed.
```

The `SELECT` found nothing and raised `NO_DATA_FOUND`, so the line after it was skipped, and the handler ran. And since the error was **handled**, the block ended successfully. There's much more on this in [PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions).

## Types that don't fit

PL/SQL variables have a size, and it's checked:

```sql
DECLARE
  v_short VARCHAR2(3);
BEGIN
  v_short := 'abcdef';
END;
/
```

```text
ORA-06502: PL/SQL: value or conversion error: character string buffer too small
ORA-06512: at line 4
```

Unlike `CAST`, which quietly cuts the text, a variable that's too small **stops the block**. It's another example of Oracle telling you about problems instead of hiding them.

## Constants, and blocks inside blocks

A **constant** is a variable that can't change: add `CONSTANT`, and give it a value right away. And blocks can be **nested**: the `BEGIN` part can contain whole blocks of its own, with their own variables. A variable declared in an inner block exists only there, and can hide, or "shadow", an outer variable with the same name:

```sql
DECLARE
  c_rate  CONSTANT NUMBER := 0.12;
  v_price NUMBER := 500;
BEGIN
  DBMS_OUTPUT.PUT_LINE('With tax: ' || v_price * (1 + c_rate));

  DECLARE
    v_price NUMBER := 1;
  BEGIN
    DBMS_OUTPUT.PUT_LINE('Inner price: ' || v_price);
  END;

  DBMS_OUTPUT.PUT_LINE('Outer price: ' || v_price);
END;
/
```

```text
With tax: 560
Inner price: 1
Outer price: 500

PL/SQL procedure successfully completed.
```

Inside the inner block, `v_price` is the inner one. Outside it, the outer `v_price` is untouched. Shadowing like this makes code confusing, so avoid giving inner and outer variables the same name. (The tax constant is also `12%`: 500 times 1.12 is 560.)

## Text and NULL in PL/SQL

The `||` operator joins text in PL/SQL just like in SQL, and it treats `NULL` as empty text. A **`NULL`** variable joined into a message just disappears, so print carefully:

```sql
BEGIN
  DBMS_OUTPUT.PUT_LINE('a' || NULL || 'b');
  DBMS_OUTPUT.PUT_LINE(NULL);
  DBMS_OUTPUT.PUT_LINE('after null');
END;
/
```

```text
ab

after null

PL/SQL procedure successfully completed.
```

Printing `NULL` gives an empty line.

## Try it

A block reports on department 60 of the HR company. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, dept_report.sql"
	min-height="420px"
	:model-value="'DECLARE\n  v_dept  hr.departments.department_name%TYPE;\n  v_count NUMBER;\n  v_avg   NUMBER;\nBEGIN\n  SELECT department_name INTO v_dept\n    FROM hr.departments WHERE department_id = 60;\n  SELECT COUNT(*), AVG(salary) INTO v_count, v_avg\n    FROM hr.employees WHERE department_id = 60;\n\n  DBMS_OUTPUT.PUT_LINE(v_dept || \' has \' || v_count || \' employees\');\n  DBMS_OUTPUT.PUT_LINE(\'Average salary: \' || ROUND(v_avg, 2));\n  DBMS_OUTPUT.PUT_LINE(\'Total yearly: \' || TO_CHAR(v_count * v_avg * 12, \'FM999,999\'));\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN\n    DBMS_OUTPUT.PUT_LINE(\'No such department\');\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
IT has 5 employees
Average salary: 5760
Total yearly: 345,600

PL/SQL procedure successfully completed.
```

Department 60 is called IT, and it has five employees, who average 5,760. Five people times 5,760 is the monthly payroll of 28,800, and times 12, the yearly 345,600. The `EXCEPTION` part didn't run, since nothing went wrong.
:::

## Try it yourself

1. Change the department to `999`. What does the block print, and why does the block still finish successfully?
2. Remove the `EXCEPTION` section, and run it with department `999`. What error appears?
3. Add a variable that holds the highest salary in the department, using `MAX(salary)`, and print it.

## Check your understanding

<Quiz
	question="Which part of a PL/SQL block is required?"
	:options="['DECLARE', 'BEGIN ... END', 'EXCEPTION', 'All of them']"
	:answer-index="1"
	explanation="Only the BEGIN ... END part is required. DECLARE and EXCEPTION are optional."
/>

<Quiz
	question="What does SELECT ... INTO raise if the query returns no rows?"
	:options="['TOO_MANY_ROWS', 'Nothing, the variable stays empty', 'VALUE_ERROR', 'NO_DATA_FOUND']"
	:answer-index="3"
	explanation="SELECT INTO needs exactly one row. Zero rows raises NO_DATA_FOUND, and more than one raises TOO_MANY_ROWS."
/>

<Quiz
	question="What does hr.employees.salary%TYPE mean?"
	:options="['The same data type as the salary column', 'The value of the salary', 'A comment', 'A new table']"
	:answer-index="0"
	explanation="%TYPE copies a column's data type, so the variable follows the column if its type ever changes."
/>

## Up next

Variables are only the start. Now let's add decisions and loops, in [PL/SQL Variables and Control Flow](/lessons/oracle-database/plsql-variables-and-control).
