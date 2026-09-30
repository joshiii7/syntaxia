---
title: "Oracle Triggers: BEFORE and AFTER, :NEW and :OLD, Row-Level and Statement-Level"
description: "Run PL/SQL automatically when data changes: BEFORE and AFTER triggers, row-level and statement-level, the :NEW and :OLD values, audit logs, validation with RAISE_APPLICATION_ERROR, conditional predicates, and the mutating table error."
---

# Triggers

*A motion-sensor light turns on when someone walks by. Nobody flips a switch. A trigger is a sensor on a table: when a row is added, changed, or deleted, it runs some code by itself.*

A **trigger** is a PL/SQL block attached to a table (or view) that Oracle runs **automatically** when a certain event happens: an `INSERT`, `UPDATE`, or `DELETE`. Nobody calls it. It fires whenever the event occurs, from any program, tool, or user. That makes triggers the place for rules that must **always** hold, whatever path the data took.

The examples create triggers and tables, so they need an Oracle account that can create objects. In FreeSQL, that means signing in (see [Getting an Oracle Database](/lessons/oracle-database/setting-up)). The results shown are what Oracle's documented behavior gives.

If you know [MySQL triggers](/lessons/mysql/views-procedures-and-triggers), the idea is identical. The syntax differs in a few ways you'll see below.

## When does it fire?

A trigger's definition answers three questions:

| Question | Choices |
|---|---|
| **When** relative to the change? | `BEFORE` the change is made, or `AFTER` it |
| **What** event? | `INSERT`, `UPDATE`, `DELETE`, or a mix with `OR` |
| **How often**? | once **for each row** changed (`FOR EACH ROW`), or once **per statement** |

Use **BEFORE** triggers to check or **fix** the new values before they're saved. Use **AFTER** triggers for things that follow from the change, like writing an audit record.

A **row-level** trigger (with `FOR EACH ROW`) runs once for each affected row, so an `UPDATE` that changes 50 rows fires it 50 times. A **statement-level** trigger runs once, however many rows, even none.

## An audit log

The classic use: keep a record of every price change.

```sql
CREATE TABLE products (
    id    NUMBER PRIMARY KEY,
    name  VARCHAR2(40) NOT NULL,
    price NUMBER(8, 2) NOT NULL
);

CREATE TABLE price_history (
    product_id NUMBER,
    old_price  NUMBER(8, 2),
    new_price  NUMBER(8, 2),
    changed_at DATE DEFAULT SYSDATE
);

CREATE OR REPLACE TRIGGER log_price_change
AFTER UPDATE OF price ON products
FOR EACH ROW
WHEN (OLD.price <> NEW.price)
BEGIN
    INSERT INTO price_history (product_id, old_price, new_price)
    VALUES (:OLD.id, :OLD.price, :NEW.price);
END;
/
```

Read the header aloud: "**after** an **update of the price** column on `products`, **for each row**, **when** the price actually changed, run this."

- **`:OLD`** holds the row's values **before** the change, and **`:NEW`** holds the values **after**. In the body, write them with a **colon**: `:OLD.price`. (In MySQL, it's `OLD.price`, with no colon.)
- The **`WHEN`** clause filters when the trigger fires, and there, `OLD` and `NEW` are written **without** the colon.
- `AFTER UPDATE OF price` limits it to updates that touch the `price` column.

Now, a few changes:

```sql
INSERT INTO products VALUES (1, 'Backpack', 899);
INSERT INTO products VALUES (2, 'Notebook', 45.50);

UPDATE products SET price = 950 WHERE id = 1;
UPDATE products SET name = 'Big backpack' WHERE id = 1;
UPDATE products SET price = 950 WHERE id = 1;

SELECT product_id, old_price, new_price FROM price_history;
```

```text
PRODUCT_ID OLD_PRICE NEW_PRICE
---------- --------- ---------
         1       899       950
```

Only the **first** update logged anything. The second changed the name and not the price, and the third set the price to what it already was, which the `WHEN (OLD.price <> NEW.price)` filter ignored.

Note that the trigger's changes belong to the **same transaction** as the change that fired it, so if you `ROLLBACK`, the history row goes too. And a trigger can't `COMMIT` or `ROLLBACK` by itself.

## Checking and fixing values: BEFORE triggers

A **BEFORE** trigger can look at the values about to be saved, **change** them through `:NEW`, or refuse them with `RAISE_APPLICATION_ERROR`, which you met in [PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions):

```sql
CREATE OR REPLACE TRIGGER check_product
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
BEGIN
    IF :NEW.price < 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'A price cannot be negative');
    END IF;
    :NEW.name := INITCAP(TRIM(:NEW.name));
END;
/
```

```sql
INSERT INTO products VALUES (3, '  desk lamp ', 749);
INSERT INTO products VALUES (4, 'Broken', -5);

SELECT id, '[' || name || ']' AS name FROM products WHERE id = 3;
```

```text
ORA-20001: A price cannot be negative
ORA-06512: at "MARIA.CHECK_PRODUCT", line 3
ORA-04088: error during execution of trigger 'MARIA.CHECK_PRODUCT'

        ID NAME
---------- -----------
         3 [Desk Lamp]
```

The lamp's messy name was tidied **before** it was saved: trimmed, and capitalized. The negative price was refused, with your error message, and the row wasn't stored. (A `CHECK` constraint is often a better way to say "price must not be negative", since it's simpler and can't be disabled by accident. Triggers are for the rules a constraint can't express.)

## Which event fired it?

One trigger can handle several events. Inside it, the **conditional predicates** `INSERTING`, `UPDATING`, and `DELETING` tell you which one it was:

```sql
CREATE OR REPLACE TRIGGER audit_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
DECLARE
    v_action VARCHAR2(10);
BEGIN
    IF INSERTING THEN
        v_action := 'INSERT';
    ELSIF UPDATING THEN
        v_action := 'UPDATE';
    ELSE
        v_action := 'DELETE';
    END IF;

    INSERT INTO product_audit (product_id, action, done_by, done_at)
    VALUES (NVL(:NEW.id, :OLD.id), v_action, USER, SYSDATE);
END;
/
```

On an `INSERT`, `:OLD` has no values (all `NULL`). On a `DELETE`, `:NEW` has none. That's why the example takes `NVL(:NEW.id, :OLD.id)`. Here, `USER` is the account that made the change, which is exactly what an audit log wants.

## Statement-level triggers

Leave out `FOR EACH ROW`, and the trigger fires **once per statement**. It can't see individual rows (no `:OLD` or `:NEW`), but it's perfect for rules about the statement itself:

```sql
CREATE OR REPLACE TRIGGER no_weekend_changes
BEFORE INSERT OR UPDATE OR DELETE ON products
BEGIN
    IF TO_CHAR(SYSDATE, 'DY', 'NLS_DATE_LANGUAGE=ENGLISH') IN ('SAT', 'SUN') THEN
        RAISE_APPLICATION_ERROR(-20002, 'The product list is closed at weekends');
    END IF;
END;
/
```

## Filling in IDs (the older way)

Before identity columns (see [Sequences and Identity Columns](/lessons/oracle-database/sequences-and-identity)), it was common to fill in the primary key with a trigger. You'll see this pattern in a great deal of existing code:

```sql
CREATE OR REPLACE TRIGGER products_set_id
BEFORE INSERT ON products
FOR EACH ROW
WHEN (NEW.id IS NULL)
BEGIN
    :NEW.id := product_seq.NEXTVAL;
END;
/
```

For new tables, use an identity column instead: there's less to go wrong.

## The mutating table error

A row-level trigger can't read or change the **same table** that's being changed, because the table is in the middle of the change. Try, and Oracle stops with:

```text
ORA-04091: table MARIA.PRODUCTS is mutating, trigger/function may not see it
```

For example, a trigger on `products` that runs `SELECT COUNT(*) FROM products` for each row fails this way. The fixes: read the values you need from `:NEW` and `:OLD` instead; do the check with a constraint; or use a **compound trigger**, an advanced kind that gathers the rows first and acts after the statement. It's a well-known Oracle stumbling block, and now you'll recognize it.

## Managing triggers

```sql
ALTER TRIGGER log_price_change DISABLE;
ALTER TRIGGER log_price_change ENABLE;
DROP TRIGGER log_price_change;
```

Disabling a trigger is handy during a big data load. `SELECT trigger_name, trigger_type, triggering_event, status FROM user_triggers;` lists yours, and `USER_SOURCE` holds their code.

## When to use triggers, and when not to

Triggers are powerful, and easy to overuse:

- Use them for **audit trails**, and for rules that a constraint can't express, and that must hold **no matter how** the data is changed.
- They run **invisibly**. Someone reading the application code has no idea that an `UPDATE` also writes to another table, so document them well.
- A trigger that changes other tables can fire other triggers. Long chains get hard to follow, and slow down every write.
- Prefer **constraints** (`CHECK`, `UNIQUE`, `FOREIGN KEY`), **identity columns**, and **procedures** where they fit. Keep triggers small.

## Try it

A trigger keeps a running count of how many times each page has been changed. Predict the table after the changes. Assume the trigger, table, and rows below already exist.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, change_counter.sql"
	min-height="520px"
	:model-value="'CREATE TABLE pages (\n    id      NUMBER PRIMARY KEY,\n    title   VARCHAR2(30) NOT NULL,\n    edits   NUMBER DEFAULT 0 NOT NULL\n);\n\nCREATE OR REPLACE TRIGGER count_edits\nBEFORE UPDATE OF title ON pages\nFOR EACH ROW\nWHEN (NEW.title &lt;&gt; OLD.title)\nBEGIN\n    :NEW.edits := :OLD.edits + 1;\nEND;\n/\n\nINSERT INTO pages (id, title) VALUES (1, \'Home\');\nINSERT INTO pages (id, title) VALUES (2, \'About\');\n\nUPDATE pages SET title = \'Welcome\' WHERE id = 1;\nUPDATE pages SET title = \'Welcome\' WHERE id = 1;\nUPDATE pages SET title = \'Welcome!\' WHERE id = 1;\nUPDATE pages SET title = \'About us\' WHERE id = 2;\n\nSELECT id, title, edits FROM pages ORDER BY id;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. To try this yourself, use FreeSQL while signed in, or your own Oracle installation.
:::

::: details Check your prediction
```text
        ID TITLE    EDITS
---------- -------- -----
         1 Welcome!     2
         2 About us     1
```

Page 1 changed from Home to Welcome (edit 1), and the second `Welcome` didn't change anything, so the `WHEN` filter skipped it. Then it became `Welcome!` (edit 2). Page 2 changed once. The trigger is a **BEFORE** trigger, which sets `:NEW.edits` on the very row being saved, so no extra `UPDATE` is needed.
:::

## Try it yourself

1. Change the trigger to `AFTER UPDATE`, and try to assign `:NEW.edits`. What error do you get? (Hint: `AFTER` triggers can't change `:NEW`.)
2. Add `INSERTING` handling so a new page starts with `edits` set to `0`, even if the inserting program gives another number.
3. Write a trigger that stops anyone deleting the page with `id = 1`, using `RAISE_APPLICATION_ERROR`.

## Check your understanding

<Quiz
	question="Inside a row-level trigger, what do :OLD and :NEW hold?"
	:options="['The row values before and after the change', 'The old and new versions of the trigger', 'The previous and next tables', 'The user names']"
	:answer-index="0"
	explanation=":OLD is the row as it was before the change, and :NEW is the row as it will be after it."
/>

<Quiz
	question="Which kind of trigger can change the values that are about to be saved?"
	:options="['AFTER', 'Statement-level only', 'BEFORE', 'None']"
	:answer-index="2"
	explanation="A BEFORE row trigger can assign to :NEW, which changes what is stored. An AFTER trigger runs once the row is already saved."
/>

<Quiz
	question="What causes ORA-04091, the mutating table error?"
	:options="['A missing semicolon', 'A full disk', 'A bad password', 'A row-level trigger reading or changing the same table that is being changed']"
	:answer-index="3"
	explanation="The table is mid-change, so Oracle won't let the trigger query it. Use :NEW and :OLD, constraints, or a compound trigger."
/>

## Up next

You now have all the pieces of Oracle SQL and PL/SQL. The last lesson before the project collects the habits that keep Oracle code healthy, and the mistakes that trip up almost everyone: [Best Practices and Common Mistakes](/lessons/oracle-database/best-practices).
