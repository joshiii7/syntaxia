---
title: "PL/SQL Exceptions: EXCEPTION Blocks, RAISE, and RAISE_APPLICATION_ERROR"
description: "Handle errors in PL/SQL: predefined exceptions like NO_DATA_FOUND and ZERO_DIVIDE, WHEN OTHERS with SQLCODE and SQLERRM, your own exceptions, RAISE_APPLICATION_ERROR, how errors travel through nested blocks, and re-raising."
---

# PL/SQL Exceptions

*A smoke alarm doesn't stop a fire. It makes sure that someone who can deal with it finds out right away. Exceptions do that for your code: they interrupt normal work, and pass the problem to whoever knows what to do.*

Things go wrong in every program: a query finds nothing, someone divides by zero, a rule is broken. In PL/SQL, such a problem is an **exception**. When one is raised, normal execution stops on the spot, and PL/SQL looks for a **handler** in the `EXCEPTION` section. If there's none, the error travels outward, to the block that called this one, and so on, until it's handled, or reaches the user as an error message.

You met the idea in [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks). This lesson gives the whole picture. It's the same idea as `try`/`catch` in [PHP](/lessons/php/exceptions) and [Python](/lessons/python/exceptions), with Oracle's spelling.

The examples run in FreeSQL without signing in.

## The shape of a handler

```sql
BEGIN
    -- code that might fail
EXCEPTION
    WHEN some_exception THEN
        -- what to do
    WHEN another_exception THEN
        -- something else
    WHEN OTHERS THEN
        -- anything not listed above
END;
```

PL/SQL runs the first `WHEN` that matches, then leaves the block. Once an error is handled, the block **finishes normally**: the code after the failing statement is skipped, but the block doesn't end with an error.

## Predefined exceptions

Oracle gives names to the most common errors, so you can catch them by name:

| Exception | Raised when | Error |
|---|---|---|
| `NO_DATA_FOUND` | `SELECT INTO` finds no rows | `ORA-01403` |
| `TOO_MANY_ROWS` | `SELECT INTO` finds more than one row | `ORA-01422` |
| `ZERO_DIVIDE` | dividing by zero | `ORA-01476` |
| `INVALID_NUMBER` | text can't be converted to a number in SQL | `ORA-01722` |
| `VALUE_ERROR` | a conversion or size problem in PL/SQL | `ORA-06502` |
| `DUP_VAL_ON_INDEX` | inserting a duplicate into a unique column | `ORA-00001` |
| `CASE_NOT_FOUND` | a `CASE` statement with no match and no `ELSE` | `ORA-06592` |

Here are five of them, caught one after another, each in its own small block:

```sql
DECLARE
    v_name hr.employees.last_name%TYPE;
    v_n    NUMBER;
BEGIN
    BEGIN
        SELECT last_name INTO v_name FROM hr.employees WHERE employee_id = 9999;
    EXCEPTION WHEN NO_DATA_FOUND THEN
        DBMS_OUTPUT.PUT_LINE('1: NO_DATA_FOUND');
    END;

    BEGIN
        SELECT last_name INTO v_name FROM hr.employees WHERE department_id = 60;
    EXCEPTION WHEN TOO_MANY_ROWS THEN
        DBMS_OUTPUT.PUT_LINE('2: TOO_MANY_ROWS');
    END;

    BEGIN
        v_n := 10 / 0;
    EXCEPTION WHEN ZERO_DIVIDE THEN
        DBMS_OUTPUT.PUT_LINE('3: ZERO_DIVIDE');
    END;

    BEGIN
        v_n := TO_NUMBER('abc');
    EXCEPTION WHEN INVALID_NUMBER OR VALUE_ERROR THEN
        DBMS_OUTPUT.PUT_LINE('4: INVALID_NUMBER or VALUE_ERROR');
    END;

    BEGIN
        v_n := 'abc';
    EXCEPTION WHEN VALUE_ERROR THEN
        DBMS_OUTPUT.PUT_LINE('5: VALUE_ERROR');
    END;
END;
/
```

```text
1: NO_DATA_FOUND
2: TOO_MANY_ROWS
3: ZERO_DIVIDE
4: INVALID_NUMBER or VALUE_ERROR
5: VALUE_ERROR

PL/SQL procedure successfully completed.
```

Notice how each little block **handles its own** error, and then the outer block goes on to the next. Also see that `WHEN a OR b THEN` catches either one. (Which of the two you get from `TO_NUMBER('abc')` inside PL/SQL can vary, so the fourth handler catches both.)

## WHEN OTHERS, SQLCODE, and SQLERRM

`WHEN OTHERS` catches **every** exception that wasn't caught by an earlier `WHEN`. It must always be **last**. Two functions tell you what went wrong:

- **`SQLCODE`**: the error's number. For Oracle errors, it's negative: `ORA-01476` gives `-1476`. (`NO_DATA_FOUND` is the odd one, with `+100`.) It's `0` when there's no error.
- **`SQLERRM`**: the error's message.

```sql
DECLARE
    v_n NUMBER;
BEGIN
    v_n := 10 / 0;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Code: ' || SQLCODE);
        DBMS_OUTPUT.PUT_LINE('Message: ' || SQLERRM);
END;
/
```

```text
Code: -1476
Message: ORA-01476: divisor is equal to zero

PL/SQL procedure successfully completed.
```

Use `WHEN OTHERS` with care. A catch-all that only prints a message, or worse, does **nothing**, makes bugs vanish, and leaves your program running on bad data. The good uses are to log the error and then **re-raise** it (see below), or to clean up. Handle the errors you expect by name, and let the rest go up.

## Your own exceptions

You can declare an exception of your own in the `DECLARE` section, and raise it with `RAISE`:

```sql
DECLARE
    e_too_young EXCEPTION;
    v_age       NUMBER := 15;
BEGIN
    IF v_age < 18 THEN
        RAISE e_too_young;
    END IF;
    DBMS_OUTPUT.PUT_LINE('Welcome');
EXCEPTION
    WHEN e_too_young THEN
        DBMS_OUTPUT.PUT_LINE('Sorry, you must be 18 or older.');
END;
/
```

```text
Sorry, you must be 18 or older.

PL/SQL procedure successfully completed.
```

The exception `e_too_young` is a name, with no message or number. It's good for signalling something **inside your own code**, and having a handler deal with it.

## RAISE_APPLICATION_ERROR: errors for the outside world

To signal an error to whoever called your code, whether that's another program, a web application, or a person in SQL\*Plus, with a **number and a message**, use `RAISE_APPLICATION_ERROR`:

```sql
BEGIN
    RAISE_APPLICATION_ERROR(-20001, 'Balance cannot be negative');
END;
/
```

```text
ORA-20001: Balance cannot be negative
ORA-06512: at line 2
```

- The number must be between **-20000 and -20999**. Oracle keeps that range for applications, and its own errors never use it.
- The message can be up to about 2,000 characters.
- The block stops, and the error goes outward, ending up in the caller as an ordinary Oracle error, `ORA-20001`. A Python or PHP program using Oracle can catch it, and read the number.

It's how a stored procedure says "no, that isn't allowed" with a meaningful reason. You'll use it a lot in [Triggers](/lessons/oracle-database/triggers).

You can also give your own exception a **number**, so a handler can catch an error by name, with `PRAGMA EXCEPTION_INIT`. (A **pragma** is an instruction to the compiler.) It's also how you catch Oracle errors that have no predefined name:

```sql
DECLARE
    e_custom EXCEPTION;
    PRAGMA EXCEPTION_INIT(e_custom, -20100);
BEGIN
    RAISE_APPLICATION_ERROR(-20100, 'mapped custom error');
EXCEPTION
    WHEN e_custom THEN
        DBMS_OUTPUT.PUT_LINE('Handled by name: ' || SQLERRM);
END;
/
```

```text
Handled by name: ORA-20100: mapped custom error

PL/SQL procedure successfully completed.
```

## Where errors go: nested blocks

When an exception is raised, PL/SQL looks for a handler in the **current** block. If there isn't a matching one, the exception goes to the **enclosing** block, and so on outward. A handler in an inner block that handles the error keeps the outer block running:

```sql
DECLARE
    v_msg VARCHAR2(200);
BEGIN
    BEGIN
        DECLARE
            v_n NUMBER;
        BEGIN
            v_n := 1 / 0;
        END;
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            v_msg := 'inner handler ran';
    END;

    DBMS_OUTPUT.PUT_LINE(v_msg);
    DBMS_OUTPUT.PUT_LINE('outer block continues');
END;
/
```

```text
inner handler ran
outer block continues

PL/SQL procedure successfully completed.
```

The division failed in the innermost block, which has no handler. The error moved out one level, where `ZERO_DIVIDE` is handled, and then the outer block carried on.

An error raised **inside a handler** isn't caught by the same block's `EXCEPTION` section. It goes outward.

## Re-raising

A handler can do some work, and then pass the error on with a bare **`RAISE;`**:

```sql
BEGIN
    BEGIN
        RAISE_APPLICATION_ERROR(-20002, 'Inner problem');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Logging: ' || SQLERRM);
            RAISE;
    END;
END;
/
```

```text
ORA-20002: Inner problem
ORA-06512: at line 7
ORA-06512: at line 3
```

The handler logs the error, and then `RAISE;` sends the very same error on, so the caller still finds out. The `ORA-06512` lines are the **call stack**, showing where the error came from: line 7 (the `RAISE` in the handler), and line 3 (the original). (In some tools, the text printed by `DBMS_OUTPUT` before a failing block ends isn't shown, since the block never finished normally. FreeSQL is one of them.) This "log and re-raise" pattern is how real systems record problems without hiding them.

## A worked example

A function that does a safe division, treats division by zero as "no answer", and refuses a missing divisor with a clear message. A helper prints each try, catching whatever comes out:

```sql
DECLARE
    FUNCTION safe_ratio (p_a NUMBER, p_b NUMBER) RETURN NUMBER IS
    BEGIN
        IF p_b IS NULL THEN
            RAISE_APPLICATION_ERROR(-20010, 'Divisor is missing');
        END IF;
        RETURN p_a / p_b;
    EXCEPTION
        WHEN ZERO_DIVIDE THEN
            RETURN NULL;
    END safe_ratio;

    PROCEDURE try_it (p_a NUMBER, p_b NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE(p_a || ' / ' || NVL(TO_CHAR(p_b), 'NULL') || ' = '
                             || NVL(TO_CHAR(ROUND(safe_ratio(p_a, p_b), 3)), 'n/a'));
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE('Failed: ' || SQLERRM);
    END try_it;
BEGIN
    try_it(10, 4);
    try_it(10, 0);
    try_it(10, NULL);
    try_it(1, 3);
END;
/
```

```text
10 / 4 = 2.5
10 / 0 = n/a
Failed: ORA-20010: Divisor is missing
1 / 3 = .333

PL/SQL procedure successfully completed.
```

Dividing by zero is handled **inside** the function, and gives `NULL` (shown as `n/a`). The missing divisor is **raised** as a numbered error, and caught by the helper's `WHEN OTHERS`.

## Best practices

- **Handle what you expect, by name.** `NO_DATA_FOUND` from a lookup is a normal case, not a disaster.
- **Never hide errors.** `WHEN OTHERS THEN NULL;` is one of the worst lines you can write.
- **Log, then re-raise** anything you can't fix.
- **Give errors clear messages** with `RAISE_APPLICATION_ERROR`, saying what happened and what to do.
- Keep the `BEGIN` part of a block small enough that you know **which** statement could raise each error.

## Try it

Predict what happens with each of these three inputs, one after the other, in a helper that can fail in different ways.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, safe_ratio.sql"
	min-height="560px"
	:model-value="'DECLARE\n  FUNCTION safe_ratio (p_a NUMBER, p_b NUMBER) RETURN NUMBER IS\n  BEGIN\n    IF p_b IS NULL THEN\n      RAISE_APPLICATION_ERROR(-20010, \'Divisor is missing\');\n    END IF;\n    RETURN p_a / p_b;\n  EXCEPTION\n    WHEN ZERO_DIVIDE THEN\n      RETURN NULL;\n  END safe_ratio;\n\n  PROCEDURE try_it (p_a NUMBER, p_b NUMBER) IS\n  BEGIN\n    DBMS_OUTPUT.PUT_LINE(p_a || \' / \' || NVL(TO_CHAR(p_b), \'NULL\') || \' = \'\n                         || NVL(TO_CHAR(ROUND(safe_ratio(p_a, p_b), 3)), \'n/a\'));\n  EXCEPTION\n    WHEN OTHERS THEN\n      DBMS_OUTPUT.PUT_LINE(\'Failed: \' || SQLERRM);\n  END try_it;\nBEGIN\n  try_it(10, 4);\n  try_it(10, 0);\n  try_it(10, NULL);\n  try_it(1, 3);\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
10 / 4 = 2.5
10 / 0 = n/a
Failed: ORA-20010: Divisor is missing
1 / 3 = .333

PL/SQL procedure successfully completed.
```

`10 / 4` works normally. `10 / 0` raises `ZERO_DIVIDE` inside `safe_ratio`, where its handler returns `NULL`, printed as `n/a`. A missing divisor is refused with error 20010, which isn't handled in the function, and flows out to `try_it`'s `WHEN OTHERS`, which prints `SQLERRM`. And 1 divided by 3, rounded to three places, is `.333`: Oracle prints numbers below 1 without the leading zero.
:::

## Try it yourself

1. Add an `ELSIF` to `safe_ratio` that refuses a negative divisor with its own `RAISE_APPLICATION_ERROR` (in the -20000 range), and try a divisor of `-2`.
2. Change `WHEN OTHERS` in `try_it` to also show `SQLCODE`. What code does the missing divisor show?
3. Write a block with a `SELECT INTO` that returns too many rows, and handle it in a way that prints the first employee's name using a cursor instead.

## Check your understanding

<Quiz
	question="What range of error numbers can RAISE_APPLICATION_ERROR use?"
	:options="['-1 to -999', '-20000 to -20999', '0 to 100', 'Any number']"
	:answer-index="1"
	explanation="Oracle reserves -20000 to -20999 for application-defined errors."
/>

<Quiz
	question="Where must WHEN OTHERS go in an EXCEPTION section?"
	:options="['First', 'Last, since it catches everything not caught earlier', 'Anywhere', 'In the DECLARE section']"
	:answer-index="1"
	explanation="Handlers are tried in order, and OTHERS matches everything, so it has to be last."
/>

<Quiz
	question="What does a bare RAISE; do inside an exception handler?"
	:options="['Starts a new unrelated error', 'Ends the program silently', 'Clears the error', 'Passes the same error on to the enclosing block']"
	:answer-index="3"
	explanation="RAISE; re-raises the current exception, so you can log it and still let the caller find out."
/>

## Up next

Exceptions are what protect your data when a rule is broken. There's one more place that runs code automatically when data changes: [Triggers](/lessons/oracle-database/triggers).
