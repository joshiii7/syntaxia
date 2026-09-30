---
title: "Oracle PL/SQL Packages: Specification, Body, and Built-in Packages"
description: "Organize PL/SQL code into packages: the specification and the body, public and private items, overloading, package variables that last the whole session, and Oracle's built-in packages like DBMS_OUTPUT."
---

# Packages

*A toolbox has a lid, and the tools inside have names printed on the outside. You can see which tools are there without opening every compartment. A package is a toolbox for code.*

As your collection of procedures and functions grows, it gets messy: dozens of loose subprograms, some of which belong together, and some of which are only helpers that nobody outside should use. A **package** groups related procedures, functions, variables, and constants under one name. It's the main way Oracle developers organize PL/SQL, and much of what Oracle ships with is packages.

Creating packages needs an account that can create objects. The examples show their code, and the parts that can be shown running, run as local subprograms in FreeSQL without signing in.

## Two parts: specification and body

A package has two pieces, created separately:

- The **specification** ("spec") is the **public face**: it lists what the outside world may use. Only names and signatures, no code.
- The **body** holds the **code**, plus any private helpers.

Here's a small package for a shop's pricing rules:

```sql
CREATE OR REPLACE PACKAGE pricing_pkg IS
    c_vat_rate CONSTANT NUMBER := 0.12;

    FUNCTION with_vat (p_price NUMBER) RETURN NUMBER;
    PROCEDURE show_price (p_name VARCHAR2, p_price NUMBER);
END pricing_pkg;
/

CREATE OR REPLACE PACKAGE BODY pricing_pkg IS

    -- Private: only code inside the package can use this.
    FUNCTION money (p_amount NUMBER) RETURN VARCHAR2 IS
    BEGIN
        RETURN 'PHP ' || TO_CHAR(p_amount, 'FM999,999.00');
    END money;

    FUNCTION with_vat (p_price NUMBER) RETURN NUMBER IS
    BEGIN
        RETURN ROUND(p_price * (1 + c_vat_rate), 2);
    END with_vat;

    PROCEDURE show_price (p_name VARCHAR2, p_price NUMBER) IS
    BEGIN
        DBMS_OUTPUT.PUT_LINE(p_name || ': ' || money(with_vat(p_price)));
    END show_price;

END pricing_pkg;
/
```

You call what's in a package by writing the **package name, a dot, and the item name**:

```sql
BEGIN
    pricing_pkg.show_price('Backpack', 899);
    DBMS_OUTPUT.PUT_LINE('VAT rate: ' || pricing_pkg.c_vat_rate);
END;
/
```

```text
Backpack: PHP 1,006.88
VAT rate: .12
```

That's the same `package.item` form you've been using all along with `DBMS_OUTPUT.PUT_LINE`. `DBMS_OUTPUT` is a package, and `PUT_LINE` is one of the procedures in its spec.

## What's public and what's private

The spec decides what's visible:

- **Public**: everything declared in the spec, like `with_vat`, `show_price`, and the constant `c_vat_rate`. Anyone with `EXECUTE` permission can use them.
- **Private**: anything declared only in the body, like `money`. It can be called by other code in the body, and by nobody else. Trying `pricing_pkg.money(5)` from outside is a compile error.

That split is a big advantage. The spec is a **contract**: it says what the package promises, and you can rewrite the body freely, as long as the promises hold. The private helpers can change or disappear without breaking anything outside. It's the same idea as `private` and `public` in [PHP classes](/lessons/php/constructors-and-visibility).

A package can be **compiled** on its own too: change only the **body**, and the code that calls the package doesn't have to be recompiled, since the spec, the thing it depends on, is unchanged.

## Overloading

Inside a package, several subprograms can share a **name**, as long as their parameters differ. That's **overloading**: Oracle picks the right one from the arguments you pass:

```sql
DECLARE
    FUNCTION area (p_side NUMBER) RETURN NUMBER IS
    BEGIN RETURN p_side * p_side; END area;

    FUNCTION area (p_width NUMBER, p_height NUMBER) RETURN NUMBER IS
    BEGIN RETURN p_width * p_height; END area;

    FUNCTION area (p_label VARCHAR2) RETURN VARCHAR2 IS
    BEGIN RETURN 'unknown shape: ' || p_label; END area;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Square 4: ' || area(4));
    DBMS_OUTPUT.PUT_LINE('Rectangle 3x5: ' || area(3, 5));
    DBMS_OUTPUT.PUT_LINE(area('blob'));
END;
/
```

```text
Square 4: 16
Rectangle 3x5: 15
unknown shape: blob

PL/SQL procedure successfully completed.
```

Three different `area` functions: one number, two numbers, or text. (This example uses local subprograms so it can run anywhere. In a package, the same names would just be declared in the spec.) Overloading is how Oracle's own `DBMS_OUTPUT.PUT_LINE` accepts text, numbers, and dates.

## Package variables remember

A variable declared in a package, outside any subprogram, keeps its value for the whole **session**: the whole time one user is connected. It's like a private notebook that survives from one call to the next:

```sql
CREATE OR REPLACE PACKAGE counter_pkg IS
    PROCEDURE hit;
    FUNCTION hits RETURN NUMBER;
END counter_pkg;
/

CREATE OR REPLACE PACKAGE BODY counter_pkg IS
    g_hits NUMBER := 0;

    PROCEDURE hit IS BEGIN g_hits := g_hits + 1; END hit;
    FUNCTION hits RETURN NUMBER IS BEGIN RETURN g_hits; END hits;
END counter_pkg;
/
```

Calling `counter_pkg.hit` three times in one session, and then `counter_pkg.hits`, gives `3`. A different session has its **own** copy, starting from 0. When the session ends, the values vanish. So package variables are good for caching a setting or remembering something for the length of a connection, but they're **not** a substitute for a table, which everyone shares and which survives.

A package body can also end with a block of code, between `BEGIN` and `END`, that runs **once**, the first time the package is used in a session. It's for setting up initial values.

## Oracle's own packages

Oracle ships hundreds of packages, mostly named with `DBMS_` or `UTL_`, and all owned by `SYS`. They give PL/SQL abilities that SQL alone has nothing like. A few:

| Package | Does |
|---|---|
| `DBMS_OUTPUT` | prints text from PL/SQL (`PUT_LINE`) |
| `DBMS_RANDOM` | random numbers and text |
| `DBMS_LOB` | working with very large text and binary values |
| `UTL_FILE` | reading and writing files on the database server |
| `DBMS_ASSERT` | checking that text is a safe name or literal |
| `UTL_MATCH` | comparing how similar two texts are |
| `DBMS_SCHEDULER` | running jobs on a schedule |

Most can be used from SQL, too:

```sql
SELECT UTL_MATCH.EDIT_DISTANCE('kitten', 'sitting') AS distance,
       DBMS_LOB.GETLENGTH(TO_CLOB('Hello, Oracle')) AS clob_len,
       DBMS_ASSERT.ENQUOTE_LITERAL('Maria') AS quoted
FROM dual;
```

```text
DISTANCE CLOB_LEN QUOTED
-------- -------- -------
       3       13 'Maria'
```

`EDIT_DISTANCE` counts how many single-character edits turn one word into another: three for kitten to sitting. Whenever you need something a bit unusual, look in Oracle's package documentation before you write it yourself.

## Looking inside packages

The dictionary keeps track of your packages: `USER_OBJECTS` lists them (with types `PACKAGE` and `PACKAGE BODY`), and `USER_SOURCE` holds their code. Since anyone who can see a package's **spec** can see what it offers, the spec doubles as documentation, so write clear comments in it.

## When to use a package

- Put **related** subprograms together, such as everything about orders, or about pricing.
- Keep **helpers private**, and the public surface small.
- Use one for **constants** and types shared across your code, so magic numbers live in one place.
- Even if a package has only one subprogram in it, a package gives you the private-helper option, and lets you change the body without recompiling the callers.

Standalone procedures and functions are fine for tiny jobs, but in most real Oracle code, nearly everything lives in packages.

## Try it

Predict which call goes to which overloaded function, and what the block prints.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, overload.sql"
	min-height="420px"
	:model-value="'DECLARE\n    FUNCTION area (p_side NUMBER) RETURN NUMBER IS\n    BEGIN RETURN p_side * p_side; END area;\n\n    FUNCTION area (p_width NUMBER, p_height NUMBER) RETURN NUMBER IS\n    BEGIN RETURN p_width * p_height; END area;\n\n    FUNCTION area (p_label VARCHAR2) RETURN VARCHAR2 IS\n    BEGIN RETURN \'unknown shape: \' || p_label; END area;\nBEGIN\n    DBMS_OUTPUT.PUT_LINE(\'A: \' || area(4));\n    DBMS_OUTPUT.PUT_LINE(\'B: \' || area(3, 5));\n    DBMS_OUTPUT.PUT_LINE(\'C: \' || area(\'blob\'));\n    DBMS_OUTPUT.PUT_LINE(\'D: \' || area(area(2)));\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
A: 16
B: 15
C: unknown shape: blob
D: 16

PL/SQL procedure successfully completed.
```

The one-number version squares 4 to give 16. Two numbers give the rectangle, 15. Text goes to the third version. For D, the inner `area(2)` is 4, and the outer `area(4)` is 16.
:::

## Try it yourself

1. Add a fourth overload that takes a **radius** and a text `'circle'`, and returns roughly `3.14159` times the radius squared.
2. Look at a package spec you didn't write: run `SELECT text FROM all_source WHERE owner = 'SYS' AND name = 'DBMS_OUTPUT' AND type = 'PACKAGE' ORDER BY line;` in a tool where that's allowed. What does the spec show you, and what does it not?
3. Explain in your own words why a package variable is a poor place to keep an account balance.

## Check your understanding

<Quiz
	question="What does a package specification contain?"
	:options="['All the code', 'Only comments', 'The public declarations: names and signatures, without the code', 'Only private helpers']"
	:answer-index="2"
	explanation="The spec is the public contract. The code itself lives in the body."
/>

<Quiz
	question="Something is declared only in a package body, not in the spec. Who can use it?"
	:options="['Only code inside the same package', 'Everyone', 'Only the owner, from anywhere', 'Nobody, not even the package']"
	:answer-index="0"
	explanation="Items declared only in the body are private to the package."
/>

<Quiz
	question="How long does a package variable keep its value?"
	:options="['For the length of one call', 'Forever, shared by everyone', 'Until the next COMMIT', 'For the whole session, separately for each connected user']"
	:answer-index="3"
	explanation="Package variables live as long as the session, and each session has its own copy. They don't survive a disconnect."
/>

## Up next

What happens when your code hits an error? You've seen `EXCEPTION` blocks in passing. Now for the whole story, in [PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions).
