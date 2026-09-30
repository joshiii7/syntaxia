---
title: "Oracle MERGE: Upserts with WHEN MATCHED and WHEN NOT MATCHED"
description: "Insert a row or update it if it already exists with Oracle's MERGE statement: the source, the ON condition, WHEN MATCHED and WHEN NOT MATCHED, merging from DUAL, deleting during a merge, and the errors to expect."
---

# Upserts with MERGE

*A guest sign-in sheet has a line for each visitor. If a name is already there, you update the time. If not, you add a new line. MERGE is that one instruction: "sign them in."*

A very common job is: "save this row. If it's new, add it. If it's already there, update it." This combined insert-or-update is called an **upsert**. Doing it in two steps, "check, then insert or update," is slow, and unsafe when two people do it at the same moment.

MySQL does it with [`ON DUPLICATE KEY UPDATE`](/lessons/mysql/upserts). Oracle has a standard SQL statement for it, **`MERGE`**, which is more powerful, and a little more to write.

The examples use a `stock` table, keyed by `sku`, the product code. Like the other lessons that create tables, you need an account that can create objects to try them.

```sql
CREATE TABLE stock (
    sku VARCHAR2(10) PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    quantity NUMBER(6) DEFAULT 0 NOT NULL
);

INSERT INTO stock (sku, name, quantity) VALUES ('PEN-01', 'Blue pen', 40);
INSERT INTO stock (sku, name, quantity) VALUES ('NB-02', 'Notebook', 15);
COMMIT;
```

## The shape of MERGE

```sql
MERGE INTO stock s
USING (SELECT 'PEN-01' AS sku, 'Blue pen' AS name, 20 AS quantity FROM dual) incoming
ON (s.sku = incoming.sku)
WHEN MATCHED THEN
    UPDATE SET s.quantity = s.quantity + incoming.quantity
WHEN NOT MATCHED THEN
    INSERT (sku, name, quantity)
    VALUES (incoming.sku, incoming.name, incoming.quantity);
```

Read it in four parts:

1. **`MERGE INTO stock s`**: the **target**, the table to change, with a short name `s`.
2. **`USING (...) incoming`**: the **source**, the rows to merge in. It can be a table, or, as here, a query. A one-row source is usually built with `FROM dual`.
3. **`ON (s.sku = incoming.sku)`**: how to decide whether a source row already has a match in the target. It's usually the primary key. It needs parentheses.
4. **`WHEN MATCHED`** and **`WHEN NOT MATCHED`**: what to do for each case. A match gets an `UPDATE`, and a new row gets an `INSERT`.

If `PEN-01` exists, its quantity goes up by 20. If it doesn't, a new row is added, with a quantity of 20. One statement, both outcomes.

```sql
SELECT sku, quantity FROM stock ORDER BY sku;
```

```text
SKU        QUANTITY
---------- --------
NB-02            15
PEN-01           60
```

`PEN-01` went from 40 to 60.

## Merging many rows at once

The source can hold many rows, so a whole delivery can be merged in a single statement:

```sql
MERGE INTO stock s
USING (
    SELECT 'PEN-01' AS sku, 'Blue pen' AS name, 20 AS quantity FROM dual UNION ALL
    SELECT 'NB-02', 'Notebook', 5 FROM dual UNION ALL
    SELECT 'STP-04', 'Stapler', 8 FROM dual
) incoming
ON (s.sku = incoming.sku)
WHEN MATCHED THEN
    UPDATE SET s.quantity = s.quantity + incoming.quantity
WHEN NOT MATCHED THEN
    INSERT (sku, name, quantity)
    VALUES (incoming.sku, incoming.name, incoming.quantity);
```

Starting again from pens at 40 and notebooks at 15, the table now holds:

```text
SKU        NAME        QUANTITY
---------- ---------- --------
NB-02      Notebook         20
PEN-01     Blue pen         60
STP-04     Stapler           8
```

The two existing products got their quantities raised, and the new stapler was added. In a PL/SQL block, `SQL%ROWCOUNT` tells you how many rows were merged (inserted **and** updated, together): 3 here.

The source can also be another table. That's how a nightly job merges the day's changes from a **staging table** into the main table.

## Only one half: MATCHED or NOT MATCHED

Both parts are optional. Leave one out to do only the other:

- Only `WHEN NOT MATCHED THEN INSERT` means "add the ones that are missing, and leave the existing ones alone."
- Only `WHEN MATCHED THEN UPDATE` means "update what's there, and ignore new ones."

You can also add a **condition** to either part, with `WHERE`:

```sql
MERGE INTO stock s
USING (SELECT 'PEN-01' AS sku, 'Blue pen' AS name, 5 AS quantity FROM dual) incoming
ON (s.sku = incoming.sku)
WHEN MATCHED THEN
    UPDATE SET s.quantity = incoming.quantity
    WHERE s.quantity < incoming.quantity;
```

The update only happens when the new quantity is **higher** than the current one. Rows that don't pass the `WHERE` are left as they were.

## Deleting while merging

In the `WHEN MATCHED` part, a `DELETE WHERE` can remove rows that end up meeting a condition **after** the update:

```sql
MERGE INTO stock s
USING (SELECT 'NB-02' AS sku, -15 AS change FROM dual) incoming
ON (s.sku = incoming.sku)
WHEN MATCHED THEN
    UPDATE SET s.quantity = s.quantity + incoming.change
    DELETE WHERE s.quantity = 0;
```

If the change brings the quantity to 0, the row is deleted. Note that the `DELETE` sees the values **after** the update, and only rows that were updated can be deleted.

## The rules and the errors

**You can't update a column used in the `ON` clause.** Trying to change `sku` in the `UPDATE SET` above would fail with `ORA-38104: Columns referenced in the ON Clause cannot be updated`. The key that finds the row can't be the value you change.

**The source must have one row per key.** If two source rows match the same target row, Oracle can't tell which to apply, and stops with `ORA-30926: unable to get a stable set of rows in the source tables`. Make sure the `ON` columns are unique in the source, maybe by adding a `GROUP BY`.

**It's part of a transaction.** As with `INSERT` and `UPDATE`, nothing is permanent until you `COMMIT`, as you'll see in [Transactions](/lessons/oracle-database/transactions).

**MERGE isn't the only way.** In PL/SQL, you'll often see the same idea done with `UPDATE`, then `INSERT` if `SQL%ROWCOUNT = 0`. `MERGE` is usually cleaner and safer, since it's one statement.

## Try it

A page-view counter keeps one row per page. Every visit runs the same statement. Predict the table after these three merges.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, page_views.sql"
	min-height="460px"
	:model-value="'CREATE TABLE page_views (\n    page VARCHAR2(30) PRIMARY KEY,\n    views NUMBER NOT NULL,\n    last_visit DATE NOT NULL\n);\n\nMERGE INTO page_views p\nUSING (SELECT \'/home\' AS page, DATE \'2026-10-01\' AS visit FROM dual) v\nON (p.page = v.page)\nWHEN MATCHED THEN UPDATE SET p.views = p.views + 1, p.last_visit = v.visit\nWHEN NOT MATCHED THEN INSERT (page, views, last_visit) VALUES (v.page, 1, v.visit);\n\nMERGE INTO page_views p\nUSING (SELECT \'/home\' AS page, DATE \'2026-10-02\' AS visit FROM dual) v\nON (p.page = v.page)\nWHEN MATCHED THEN UPDATE SET p.views = p.views + 1, p.last_visit = v.visit\nWHEN NOT MATCHED THEN INSERT (page, views, last_visit) VALUES (v.page, 1, v.visit);\n\nMERGE INTO page_views p\nUSING (\n    SELECT \'/about\' AS page, DATE \'2026-10-02\' AS visit FROM dual UNION ALL\n    SELECT \'/home\', DATE \'2026-10-03\' FROM dual\n) v\nON (p.page = v.page)\nWHEN MATCHED THEN UPDATE SET p.views = p.views + 1, p.last_visit = v.visit\nWHEN NOT MATCHED THEN INSERT (page, views, last_visit) VALUES (v.page, 1, v.visit);\n\nSELECT page, views, TO_CHAR(last_visit, \'YYYY-MM-DD\') AS last_visit\nFROM page_views\nORDER BY page;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. To try this yourself, use FreeSQL while signed in, or your own Oracle installation.
:::

::: details Check your prediction
```text
PAGE   VIEWS LAST_VISIT
------ ----- ----------
/about     1 2026-10-02
/home      3 2026-10-03
```

The first merge adds `/home` with 1 view. The second finds it, and raises it to 2. The third statement merges two rows at once: `/about` is new, so it's inserted with 1 view, and `/home` is found again, bringing it to 3, with the most recent visit date.
:::

## Try it yourself

1. Change the third merge so that it only updates existing pages, and never adds new ones. Which page is missing from the result?
2. Add a `DELETE WHERE p.views > 2` to the `WHEN MATCHED` part of the third merge. What's in the table afterward?
3. Make the source of a merge contain the same page twice, and run it. What error do you get?

## Check your understanding

<Quiz
	question="What does MERGE do when a source row matches an existing target row?"
	:options="['Runs the WHEN MATCHED part, usually an UPDATE', 'Always inserts a second copy', 'Stops with an error', 'Deletes the target row']"
	:answer-index="0"
	explanation="The ON condition decides whether a source row matches. Matched rows go to WHEN MATCHED, and the rest go to WHEN NOT MATCHED."
/>

<Quiz
	question="Why do you often see FROM dual inside a MERGE source?"
	:options="['It builds a one-row source out of a few values', 'DUAL makes MERGE faster', 'MERGE only works with DUAL', 'It stores the result']"
	:answer-index="0"
	explanation="To merge a single set of values, you select them from DUAL, which has one row, and give that query to USING."
/>

<Quiz
	question="What is wrong with UPDATE SET s.sku = ... when sku is used in the ON clause?"
	:options="['Nothing', 'It updates every row', 'Oracle refuses with ORA-38104, since a column in the ON clause cannot be updated', 'It deletes the row']"
	:answer-index="2"
	explanation="The columns that find the row cannot be changed by the same MERGE."
/>

## Up next

You've been creating tables as an account that can. Who owns a table, who may read it, and what does an account need to do its job? That's [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users).
