---
title: "SQL Transactions: BEGIN, COMMIT, and ROLLBACK Explained"
description: "Group SQL statements so they succeed or fail together with transactions: BEGIN, COMMIT, and ROLLBACK, why they keep data correct, and how they speed up big changes."
---

# Transactions

*Paying at a shop is two steps: your money leaves your account, and arrives in the shop's. If the power cuts out halfway, you'd want both steps undone, not just one.*

Most changes to a database are a single statement: add a member, mark a loan returned. But some changes need **several** statements, and they only make sense together. Moving a book from one member to another means closing one loan *and* opening another. Transferring money means taking it out of one account *and* putting it into another.

If only half of a change like that happens, because of an error, a crash, or a power cut, the data is left in a state that never should have existed. A **transaction** prevents that. It groups statements so they either **all** happen, or **none** of them do.

## Paying at a shop

When you pay by card, two things happen: money leaves your account, and money arrives in the shop's account. Imagine the system crashed between the two. Your money is gone, but the shop never got it. It vanished.

Banks prevent this by treating the two steps as one unbreakable action. Either both happen, or the whole thing is cancelled and your money stays put. There's never a moment where only half is done.

That all-or-nothing behavior is exactly what a database transaction gives you.

## `BEGIN`, `COMMIT`, and `ROLLBACK`

- **`BEGIN`** starts a transaction. Changes after it are held back, not yet permanent.
- **`COMMIT`** makes all of them permanent, together.
- **`ROLLBACK`** cancels all of them, as if they never happened.

Here's a book moving from one member to another, as one transaction:

```sql
BEGIN;

UPDATE loans SET returned_date = '2026-09-29' WHERE id = 2;
INSERT INTO loans (book_id, member_id, loan_date, due_date)
VALUES (1, 4, '2026-09-29', '2026-10-13');

COMMIT;

SELECT id, book_id, member_id, returned_date FROM loans WHERE book_id = 1;
```

```text
+----+---------+-----------+---------------+
| id | book_id | member_id | returned_date |
+----+---------+-----------+---------------+
|  1 |       1 |         1 | 2026-09-10    |
|  2 |       1 |         2 | 2026-09-29    |
|  8 |       1 |         4 |               |
+----+---------+-----------+---------------+
```

Ben's loan (2) was closed, and Dina's new loan (8) was opened, as one change. No one looking at the database could ever have seen the moment in between, where the book was returned but not yet lent again.

## Changing your mind: `ROLLBACK`

If something goes wrong partway through, `ROLLBACK` throws away everything since `BEGIN`:

```sql
BEGIN;
DELETE FROM members;
SELECT COUNT(*) AS during FROM members;
ROLLBACK;

SELECT COUNT(*) AS after FROM members;
```

```text
+--------+
| during |
+--------+
|      0 |
+--------+
+-------+
| after |
+-------+
|     5 |
+-------+
```

Inside the transaction, every member was gone. After `ROLLBACK`, they're all back, as if the `DELETE` had never run. (It's no substitute for being careful with `DELETE`, but it's a useful safety net: try a risky change inside a transaction, check the result, and only `COMMIT` if it's right.)

## Why this keeps data correct

Transactions are one of the big reasons databases are trusted with important data. Database people describe their guarantees with the word **ACID**:

- **Atomic:** a transaction happens completely, or not at all. (That's the all-or-nothing part.)
- **Consistent:** it can't leave the data breaking any of your constraints.
- **Isolated:** other users don't see its half-finished changes.
- **Durable:** once committed, the changes survive, even if the computer crashes a second later.

SQLite provides all four, even though it's just a file. That's a big part of why it's trusted inside phones and web browsers.

## SQLite commits for you, usually

If you don't write `BEGIN`, SQLite treats **every statement as its own tiny transaction**, and commits it straight away. This is called **autocommit**, and it's why every `INSERT` and `UPDATE` in earlier lessons was saved immediately. You only need `BEGIN` when several statements must succeed or fail together.

Not every database behaves this way. In Oracle's tools, changes aren't permanent until you type `COMMIT` yourself, as the [Oracle track](/lessons/oracle-database/coming-from-sqlite) explains. It's one of the first things to check when you move to a new database.

## When a statement fails

What happens if one statement in a transaction breaks a constraint? The failing statement doesn't happen, but the transaction stays open, and you decide what to do:

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER CHECK (balance >= 0));
INSERT INTO accounts VALUES ('Maria', 100), ('Ben', 20);

BEGIN;
UPDATE accounts SET balance = balance + 50 WHERE name = 'Ben';
UPDATE accounts SET balance = balance - 150 WHERE name = 'Maria';
ROLLBACK;

SELECT * FROM accounts;
```

```text
Error near line 7: CHECK constraint failed: balance >= 0
+-------+---------+
| name  | balance |
+-------+---------+
| Maria |     100 |
| Ben   |      20 |
+-------+---------+
```

The second `UPDATE` would have left Maria at -50, so the `CHECK` constraint refused it. Ben's 50 had already been added inside the transaction, so `ROLLBACK` undid that too, and both balances are back where they started. In a real program, this is the pattern: `BEGIN`, try every step, `COMMIT` if all of them worked, and `ROLLBACK` if any failed. You'll see it in Python in [Using SQLite from Python](/lessons/sqlite3/sqlite-in-python).

## A bonus: speed

There's one more reason to use transactions, even when you don't strictly need all-or-nothing. Because SQLite commits each statement on its own, it has to save to disk after **every** one, which is slow. Adding 10,000 rows with 10,000 separate `INSERT`s can take a long time.

Wrap them in a single transaction, and SQLite saves to disk once, at the `COMMIT`. For big imports, the difference can be enormous: seconds instead of minutes.

## Try it

This sets up two savings accounts and runs three transfers inside transactions: one that works, one that's rolled back on purpose, and one that fails a constraint. Predict the final balances.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, transactions.sql"
	min-height="460px"
	:model-value="'CREATE TABLE savings (name TEXT PRIMARY KEY, balance INTEGER NOT NULL CHECK (balance &gt;= 0));\nINSERT INTO savings VALUES (\'Ana\', 200), (\'Ben\', 50);\n\n-- Transfer 1: Ana gives Ben 80\nBEGIN;\nUPDATE savings SET balance = balance - 80 WHERE name = \'Ana\';\nUPDATE savings SET balance = balance + 80 WHERE name = \'Ben\';\nCOMMIT;\n\n-- Transfer 2: started, then cancelled\nBEGIN;\nUPDATE savings SET balance = balance - 100 WHERE name = \'Ben\';\nUPDATE savings SET balance = balance + 100 WHERE name = \'Ana\';\nROLLBACK;\n\n-- Transfer 3: Ben tries to give Ana 500\nBEGIN;\nUPDATE savings SET balance = balance + 500 WHERE name = \'Ana\';\nUPDATE savings SET balance = balance - 500 WHERE name = \'Ben\';\nROLLBACK;\n\nSELECT * FROM savings;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
Error near line 19: CHECK constraint failed: balance >= 0
+------+---------+
| name | balance |
+------+---------+
| Ana  |     120 |
| Ben  |     130 |
+------+---------+
```

Transfer 1 committed, so Ana has 120 and Ben has 130. Transfer 2 was rolled back, so it left no trace. In Transfer 3, taking 500 from Ben would make his balance negative, so the `CHECK` constraint refused it (that's the error). Ana's +500 had already happened inside the transaction, but `ROLLBACK` undid it, so the total money is still 250, exactly what it started as.
:::

## Try it yourself

1. In Transfer 3 of the Try it, change `ROLLBACK` to `COMMIT`. Predict the balances before running it. Why is this a bad outcome?
2. In your library database, start a transaction, delete every loan, check the count, then roll it back and check again.
3. Write a transaction that adds a new member and a first loan for them, using `last_insert_rowid()` to get the new member's `id`.

## Check your understanding

<Quiz
	question="What does a transaction guarantee?"
	:options="['That its statements all happen, or none of them do', 'That queries run faster', 'That no errors can occur', 'That the data is backed up']"
	:answer-index="0"
	explanation="A transaction is all or nothing: COMMIT makes every change permanent together, and ROLLBACK cancels them all."
/>

<Quiz
	question="You ran BEGIN, two UPDATEs, and then ROLLBACK. What happened to the updates?"
	:options="['Both were saved', 'Only the first was saved', 'Both were cancelled', 'Only the second was saved']"
	:answer-index="2"
	explanation="ROLLBACK undoes every change since BEGIN."
/>

<Quiz
	question="In SQLite, what happens to an UPDATE you run without writing BEGIN?"
	:options="['It waits until you type COMMIT', 'It is ignored', 'It is rolled back when you quit', 'It is committed immediately, as its own transaction']"
	:answer-index="3"
	explanation="SQLite's autocommit treats each statement as its own transaction. Use BEGIN when several statements must succeed or fail together."
/>

## Up next

That completes the Changing Data and Design chapter. Everything so far works in almost any database. The next chapter is about what makes SQLite itself different, starting with the surprise in how it handles types: [Type Affinity and STRICT Tables](/lessons/sqlite3/type-affinity).
