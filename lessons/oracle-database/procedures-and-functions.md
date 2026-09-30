---
title: "Oracle Stored Procedures and Functions: CREATE PROCEDURE, IN and OUT Parameters"
description: "Save PL/SQL code in the database as named procedures and functions: parameters with IN, OUT, and IN OUT, default values and named notation, RETURN, calling functions from SQL, and reading compile errors."
---

# Stored Procedures and Functions

*A recipe card in a box is better than a recipe you invent from scratch each evening. Procedures and functions are recipe cards you file in the database: give them a name, and anyone can use them.*

So far, your PL/SQL has been **anonymous blocks**: code written, run once, and forgotten. But most code is worth keeping. A **stored subprogram** is a block with a **name** that's saved in the database. You run it again and again by calling its name, from SQL, from other PL/SQL, or from a program in any language.

There are two kinds:

- A **procedure** *does* something: it changes data, prints a report, sends a message. It doesn't hand back a value.
- A **function** *works something out*, and **returns** a value, so you can use it inside an expression, or even inside a query.

If you know MySQL's [stored procedures and functions](/lessons/mysql/views-procedures-and-triggers), this is the same idea, with less ceremony: there's no `DELIMITER` here.

The behavior in this lesson is shown by running the same code as **local subprograms**, defined right inside an anonymous block, which works in FreeSQL without signing in. **Saving** them in the database with `CREATE PROCEDURE` needs an account that can create objects, and is shown as well.

## Creating a procedure

```sql
CREATE OR REPLACE PROCEDURE greet (
    p_name     IN VARCHAR2,
    p_greeting IN VARCHAR2 DEFAULT 'Hello'
) IS
BEGIN
    DBMS_OUTPUT.PUT_LINE(p_greeting || ', ' || p_name || '!');
END greet;
/
```

- **`CREATE OR REPLACE`** creates the procedure, or replaces it if it already exists, so you can re-run your script safely.
- **`greet`** is the name. The parameters go in parentheses.
- **`IS`** (or `AS`) replaces `DECLARE`: any variables would go here, between `IS` and `BEGIN`.
- The body is an ordinary block, `BEGIN ... END;`. Naming the procedure again after `END`, as in `END greet;`, is optional, and it helps you match the ends of long ones.
- The **`/`** on its own line runs the `CREATE` statement, just as it runs an anonymous block.

Then call it, from another block, or with `EXECUTE` in SQL\*Plus and SQLcl:

```sql
BEGIN
    greet('Maria');
    greet('Ben', 'Good morning');
END;
/
```

```text
Hello, Maria!
Good morning, Ben!

PL/SQL procedure successfully completed.
```

## Parameters: IN, OUT, and IN OUT

Every parameter has a **mode**, which says which way the value flows:

| Mode | Meaning |
|---|---|
| `IN` | The caller gives a value **to** the subprogram. It can be read, but not changed. This is the default. |
| `OUT` | The subprogram gives a value **back** to the caller. It starts empty. |
| `IN OUT` | A value goes in, is changed, and comes back out. |

```sql
DECLARE
    v_first VARCHAR2(20);
    v_last  VARCHAR2(20);
    v_n     NUMBER := 10;

    PROCEDURE split_name (
        p_full  IN  VARCHAR2,
        p_first OUT VARCHAR2,
        p_last  OUT VARCHAR2
    ) IS
    BEGIN
        p_first := SUBSTR(p_full, 1, INSTR(p_full, ' ') - 1);
        p_last  := SUBSTR(p_full, INSTR(p_full, ' ') + 1);
    END split_name;

    PROCEDURE bump (p_n IN OUT NUMBER) IS
    BEGIN
        p_n := p_n + 1;
    END bump;
BEGIN
    split_name('Maria Santos', v_first, v_last);
    DBMS_OUTPUT.PUT_LINE('First: ' || v_first || ', last: ' || v_last);

    bump(v_n);
    bump(v_n);
    DBMS_OUTPUT.PUT_LINE('After two bumps: ' || v_n);
END;
/
```

```text
First: Maria, last: Santos
After two bumps: 12

PL/SQL procedure successfully completed.
```

`split_name` gives back **two** values through its `OUT` parameters, which a function can't do so neatly. `bump` receives 10, adds one, and hands 11 back, and again, to 12. Trying to assign to an `IN` parameter is caught before the code runs at all, with `PLS-00363: expression 'X' cannot be used as an assignment target`.

Notice the order in the `DECLARE` section: **variables first, then local procedures and functions**. Put a variable after a subprogram, and you get `PLS-00103: Encountered the symbol ...`.

### Default values and named arguments

A parameter with a `DEFAULT` is optional: the caller can leave it out. And instead of giving arguments by **position**, the caller can name them with `=>`, in any order:

```sql
BEGIN
    greet('Maria');
    greet('Ben', 'Good morning');
    greet(p_greeting => 'Hi', p_name => 'Carlo');
END;
/
```

```text
Hello, Maria!
Good morning, Ben!
Hi, Carlo!

PL/SQL procedure successfully completed.
```

Named notation makes calls with several arguments much easier to read, and it lets you skip optional ones in the middle. (It's the same idea as named arguments in [PHP](/lessons/php/parameters).)

## Functions

A function is declared with **`RETURN datatype`**, and hands its answer back with a **`RETURN value;`** statement:

```sql
CREATE OR REPLACE FUNCTION price_with_vat (
    p_price IN NUMBER,
    p_rate  IN NUMBER DEFAULT 0.12
) RETURN NUMBER IS
BEGIN
    RETURN ROUND(p_price * (1 + p_rate), 2);
END price_with_vat;
/
```

Since it returns a value, you use it anywhere a value fits:

```sql
BEGIN
    DBMS_OUTPUT.PUT_LINE('VAT price: ' || price_with_vat(100));
    DBMS_OUTPUT.PUT_LINE('Custom rate: ' || price_with_vat(100, 0.2));
END;
/
```

```text
VAT price: 112
Custom rate: 120

PL/SQL procedure successfully completed.
```

**Every path must return.** If a function can end without reaching a `RETURN`, it fails at run time:

```sql
DECLARE
    FUNCTION no_return (n NUMBER) RETURN NUMBER IS
    BEGIN
        IF n > 0 THEN
            RETURN n;
        END IF;
    END;
BEGIN
    DBMS_OUTPUT.PUT_LINE(no_return(-1));
END;
/
```

```text
ORA-06503: PL/SQL: function returned without value
ORA-06512: at line 5
ORA-06512: at line 7
```

The number of arguments matters too. Calling a function with the wrong number gives a compile-time error, before anything runs:

```text
PLS-00306: wrong number or types of arguments in call to 'DOUBLE_IT'
```

## Functions inside SQL

A stored function can be called right in a `SELECT`, which is one of PL/SQL's best tricks. You can even define one **inside** the query itself, with `WITH FUNCTION` (Oracle 12c and later), so nothing needs saving:

```sql
WITH
    FUNCTION vat (p NUMBER) RETURN NUMBER IS
    BEGIN
        RETURN ROUND(p * 1.12, 2);
    END;
SELECT last_name, salary, vat(salary) AS with_vat
FROM hr.employees
WHERE employee_id IN (100, 101)
ORDER BY employee_id;
/
```

```text
LAST_NAME SALARY WITH_VAT
--------- ------ --------
King       24000    26880
Yang       17000    19040
```

A word of caution: calling a function for **every row** of a big table is slow, since each call switches between SQL and PL/SQL. Fine for a few thousand rows, but think twice for millions.

## Compile errors

When you `CREATE` a procedure with a mistake in it, Oracle usually creates it anyway, but marks it **invalid**, and prints: `Warning: Procedure created with compilation errors.` To see what's wrong:

```text
SQL> SHOW ERRORS
```

or query the dictionary: `SELECT line, position, text FROM user_errors WHERE name = 'GREET';`. Each error gives a line and column in **your source code**. Fix it, and run the `CREATE OR REPLACE` again. You can look at stored code any time with `SELECT text FROM user_source WHERE name = 'GREET' ORDER BY line;`, and list your subprograms with `SELECT object_name, object_type, status FROM user_objects WHERE object_type IN ('PROCEDURE', 'FUNCTION');`.

## Permissions

Other users can only call your procedure if you grant them **`EXECUTE`** on it: `GRANT EXECUTE ON greet TO ben;`. By default, a stored subprogram runs with the **owner's** rights, not the caller's ("definer's rights"). That's a powerful security tool: a user can be allowed to run a procedure that changes a table, **without** being allowed to touch the table directly. It's the same idea you saw with the MySQL store's `place_order`.

## Try it

A bonus calculator has a function that picks a rate, and a procedure that prints a line. It runs over department 30. Predict every line, including the total.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, bonus.sql"
	min-height="520px"
	:model-value="'DECLARE\n  v_total NUMBER := 0;\n\n  FUNCTION bonus_rate (p_salary IN NUMBER) RETURN NUMBER IS\n  BEGIN\n    IF p_salary &gt;= 10000 THEN\n      RETURN 0.05;\n    ELSIF p_salary &gt;= 3000 THEN\n      RETURN 0.10;\n    ELSE\n      RETURN 0.15;\n    END IF;\n  END bonus_rate;\n\n  PROCEDURE show_line (p_name IN VARCHAR2, p_salary IN NUMBER, p_bonus IN NUMBER) IS\n  BEGIN\n    DBMS_OUTPUT.PUT_LINE(RPAD(p_name, 11) || LPAD(p_salary, 6) || LPAD(p_bonus, 6));\n  END show_line;\nBEGIN\n  FOR r IN (SELECT last_name, salary\n            FROM hr.employees\n            WHERE department_id = 30\n            ORDER BY salary DESC, last_name) LOOP\n    show_line(r.last_name, r.salary, r.salary * bonus_rate(r.salary));\n    v_total := v_total + r.salary * bonus_rate(r.salary);\n  END LOOP;\n  DBMS_OUTPUT.PUT_LINE(\'Total bonus: \' || v_total);\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
Li          11000   550
Khoo         3100   310
Baida        2900   435
Tobias       2800   420
Himuro       2600   390
Colmenares   2500   375
Total bonus: 2480

PL/SQL procedure successfully completed.
```

Li earns over 10,000, so the rate is 5%: 550. Khoo earns 3,100, which is at least 3,000, so 10%: 310. The other four are below 3,000, so they get 15%: 435, 420, 390, and 375. The function decides the rate, the procedure formats a line, and the loop ties them together and adds up the bonuses: 2,480.
:::

## Try it yourself

1. Change the rule so that salaries of 3,000 and over get 12%. Which lines change?
2. Add a second parameter `p_min` to `show_line`, with a default of `0`, and only print people whose bonus is at least `p_min`. Call it with a named argument.
3. Turn `bonus_rate` into a `WITH FUNCTION` in a plain `SELECT` that lists the employees of department 30 and their rates.

## Check your understanding

<Quiz
	question="What is the difference between a procedure and a function?"
	:options="['Procedures are faster', 'Functions cannot have parameters', 'A function returns a value and can be used in expressions; a procedure does something without returning one', 'There is no difference']"
	:answer-index="2"
	explanation="Functions RETURN a value, so they can be used inside expressions and queries. Procedures are called as statements."
/>

<Quiz
	question="A procedure has the parameter p_total OUT NUMBER. What does OUT mean?"
	:options="['The caller must supply a value', 'The procedure gives a value back to the caller through it', 'It cannot be used', 'It prints the value']"
	:answer-index="1"
	explanation="OUT parameters carry results from the procedure back to the caller. IN OUT parameters do both."
/>

<Quiz
	question="What does CREATE OR REPLACE do?"
	:options="['Creates a copy', 'Deletes the object', 'Renames the object', 'Creates the object, or replaces it if it exists, so the script can be re-run']"
	:answer-index="3"
	explanation="It saves you from dropping the procedure first, so you can safely re-run your script while you develop."
/>

## Up next

As your collection of procedures and functions grows, you'll want to organize them. Oracle's answer is [Packages](/lessons/oracle-database/packages).
