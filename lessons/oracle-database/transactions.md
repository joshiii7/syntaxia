---
title: "Oracle Transactions: COMMIT, ROLLBACK, SAVEPOINT, and Locking"
description: "Learn how Oracle transactions work: nothing is permanent until COMMIT, ROLLBACK and SAVEPOINT, why DDL commits automatically, how readers and writers avoid blocking each other, row locks with FOR UPDATE, and deadlocks."
---

# Transactions: COMMIT, ROLLBACK, and SAVEPOINT

*When you buy something in a shop, the cashier rings it up, but the sale isn't final until you pay and get the receipt. Until then, either side can call it off. Oracle treats your changes the same way.*

You met transactions in the SQLite track's [Transactions](/lessons/sqlite3/transactions) lesson, and in MySQL's [InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions). The idea is the same: a group of changes that succeed or fail **together**. But Oracle's habits about *when* a transaction starts and ends are different, and it matters more here than in any other database in this course.

The examples use a small table of bank accounts. As with the other lessons that create tables, you need an account that can create objects to try them.

```sql
CREATE TABLE accounts (
    id NUMBER PRIMARY KEY,
    owner VARCHAR2(20) NOT NULL,
    balance NUMBER(10, 2) NOT NULL CHECK (balance >= 0)
);

INSERT INTO accounts VALUES (1, 'Maria', 1000);
INSERT INTO accounts VALUES (2, 'Ben', 500);
COMMIT;
```

## Nothing is permanent until you COMMIT

In Oracle's tools, **autocommit is off** by default. That's the opposite of SQLite and MySQL. When you run an `INSERT`, `UPDATE`, or `DELETE`, the change happens in a **transaction** that is still open. **You** can see it. Nobody else can. It becomes permanent, and visible to everyone, only when you run:

```sql
COMMIT;
```

And if you change your mind, this throws away everything since the last `COMMIT`:

```sql
ROLLBACK;
```

A transaction begins automatically with your first change, and ends with `COMMIT` or `ROLLBACK`. Moving 200 from Maria to Ben is two updates that belong together:

```sql
UPDATE accounts SET balance = balance - 200 WHERE id = 1;
UPDATE accounts SET balance = balance + 200 WHERE id = 2;
COMMIT;

SELECT owner, balance FROM accounts ORDER BY id;
```

```text
OWNER   BALANCE
------- -------
Maria       800
Ben         700
```

If something went wrong between the two updates, say the second one failed, a `ROLLBACK` would put both accounts back as they were. Without it, Maria would have lost 200 that Ben never got.

## What ends a transaction

`COMMIT` and `ROLLBACK` are the obvious ends. But a few other things end a transaction, and they're worth knowing:

- **DDL commits automatically.** Any statement that creates or changes an object, like `CREATE TABLE`, `ALTER TABLE`, or `DROP TABLE`, **commits** the transaction before and after it runs, whether you wanted that or not. It's Oracle's most surprising habit. If you have uncommitted changes, and then create a table, those changes are saved:

```sql
UPDATE accounts SET balance = 0 WHERE id = 2;
CREATE TABLE notes (n NUMBER);
ROLLBACK;

SELECT balance FROM accounts WHERE id = 2;
```

```text
BALANCE
-------
      0
```

The `ROLLBACK` came too late: `CREATE TABLE` had already committed the update. Keep structure changes apart from your data changes.

- **Leaving the tool.** SQL\*Plus commits your open work when you exit **normally** with `EXIT`. If the tool crashes or the connection drops, the open transaction is rolled back instead. Since behavior varies between tools and settings, don't count on either: end every transaction on purpose.
- **A program's connection dying** rolls back whatever it hadn't committed.

## Savepoints

A **savepoint** is a bookmark inside a transaction. You can undo **part** of your work, back to the bookmark, and keep the rest:

```sql
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT after_first;
UPDATE accounts SET balance = balance - 300 WHERE id = 1;
ROLLBACK TO SAVEPOINT after_first;
COMMIT;
```

Starting from Maria's 800 (after the earlier transfer), the first update takes her to 700, and the second would take her to 400. `ROLLBACK TO SAVEPOINT after_first` undoes only the second one, so the `COMMIT` saves 700. A full `ROLLBACK` would have thrown away both.

## A failed statement, not a failed transaction

If a single statement fails, Oracle undoes **that statement only**. The rest of your transaction stays open, and it's up to you to decide what to do next:

```sql
UPDATE accounts SET balance = balance + 50 WHERE id = 2;
UPDATE accounts SET balance = balance - 5000 WHERE id = 1;
```

The second statement breaks the `CHECK (balance >= 0)` rule, and stops with an error, `ORA-02290: check constraint ... violated`. But the first update is **still pending**. To keep the database consistent, your program should now `ROLLBACK`, so that Ben doesn't get 50 for a transfer that never happened.

## Readers and writers don't wait for each other

Here Oracle's design is a real strength. When someone reads data, Oracle shows them a **consistent snapshot** as of the moment their query started. Other people can keep changing the data while that happens, and neither side has to wait:

- A query **never** blocks changes made by others.
- A change **never** blocks other people's queries. They simply see the last **committed** version of the row.

So your report won't freeze because somebody is updating an account, and your update won't freeze because somebody is running a huge report. This is called **read consistency**, and it's one of the reasons Oracle handles very busy systems so well. Oracle's default isolation level, `READ COMMITTED`, means each statement sees all changes committed before **it** started, but never anyone's uncommitted work.

## Row locks

Two people **changing the same row** is another matter. The first to change a row puts a **lock** on it, which is held until they commit or roll back. Others who want the same row must wait. But **only that row is locked**, so people working on other rows aren't affected:

```text
Session A> UPDATE accounts SET balance = balance - 10 WHERE id = 1;    -- locks row 1

Session B> UPDATE accounts SET balance = balance - 20 WHERE id = 2;    -- fine: a different row
Session B> UPDATE accounts SET balance = balance - 20 WHERE id = 1;    -- waits...

Session A> COMMIT;                                                     -- releases the lock
                                                                       -- B's update now goes through
```

To lock rows **on purpose**, before you change them, use `SELECT ... FOR UPDATE`:

```sql
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- decide, in your program, whether there is enough money, then:
UPDATE accounts SET balance = balance - 250 WHERE id = 1;
COMMIT;
```

That keeps anyone else from changing Maria's row between your read and your write. By default, other sessions **wait**. You can choose otherwise:

| Clause | What happens when the row is already locked |
|---|---|
| `FOR UPDATE` | waits as long as it takes |
| `FOR UPDATE NOWAIT` | fails right away, with `ORA-00054: resource busy` |
| `FOR UPDATE WAIT 5` | waits up to 5 seconds, then fails |
| `FOR UPDATE SKIP LOCKED` | skips locked rows, and works on the rest (handy for a job queue) |

## Deadlocks

The worst case: two sessions each hold a lock the other needs.

```text
A> UPDATE accounts SET balance = balance - 10 WHERE id = 1;    -- A locks Maria
B> UPDATE accounts SET balance = balance - 20 WHERE id = 2;    -- B locks Ben
A> UPDATE accounts SET balance = balance + 10 WHERE id = 2;    -- A waits for Ben's row
B> UPDATE accounts SET balance = balance + 20 WHERE id = 1;    -- B waits for Maria's row
ORA-00060: deadlock detected while waiting for resource
```

Oracle notices, and cancels **one statement** with `ORA-00060`, so the other can go on. The session that got the error still holds its earlier locks: it should `ROLLBACK`, and try again. As with any database, the way to make deadlocks rare is to touch rows in the **same order** everywhere, and to keep transactions short.

## Looking at the past: flashback query

A quirk unique to Oracle: since it keeps old versions of rows to give everyone a consistent snapshot, you can ask to see the data **as it was a while ago**, without any backup:

```sql
SELECT owner, balance
FROM accounts AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '5' MINUTE);
```

That shows the table as it was five minutes ago, as long as Oracle still has the old versions. It's a lifesaver when someone runs a wrong `UPDATE` and commits it, since you can look up the old values, and put them back.

## Try it

A transfer script. Predict what each `SELECT` shows.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, transfer.sql"
	min-height="420px"
	:model-value="'-- accounts: Maria 1000, Ben 500\n\nUPDATE accounts SET balance = balance - 200 WHERE id = 1;\nSAVEPOINT after_debit;\nUPDATE accounts SET balance = balance + 200 WHERE id = 2;\nROLLBACK TO SAVEPOINT after_debit;\nSELECT owner, balance FROM accounts ORDER BY id;\n\nROLLBACK;\nSELECT owner, balance FROM accounts ORDER BY id;\n\nUPDATE accounts SET balance = balance - 300 WHERE id = 1;\nCOMMIT;\nUPDATE accounts SET balance = balance - 300 WHERE id = 1;\nROLLBACK;\nSELECT owner, balance FROM accounts ORDER BY id;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. To try this yourself, use FreeSQL while signed in, or your own Oracle installation.
:::

::: details Check your prediction
```text
OWNER   BALANCE
------- -------
Maria       800
Ben         500

OWNER   BALANCE
------- -------
Maria      1000
Ben         500

OWNER   BALANCE
------- -------
Maria       700
Ben         500
```

After the savepoint, only Ben's credit was undone, so Maria is still 200 down (800) and Ben is at 500. The next `ROLLBACK` throws away the whole open transaction, so both go back to the start. Then Maria is debited 300 and committed: that one is permanent, so she's at 700. The next debit is rolled back, so it never happened.
:::

## Try it yourself

1. In two different sessions (two SQL\*Plus windows, or FreeSQL and SQL Developer), update the same row in both, without committing in the first. What happens in the second?
2. Run `UPDATE ...`, then `CREATE TABLE test (n NUMBER)`, then `ROLLBACK`. Was the update undone? Why not?
3. Use `SELECT ... FOR UPDATE NOWAIT` on a row that another session has locked. What error do you get?

## Check your understanding

<Quiz
	question="You run an UPDATE in SQL*Plus, and see the change in your own SELECT. Who else can see it?"
	:options="['Nobody else, until you COMMIT', 'Everyone, straight away', 'Only administrators', 'Everyone who reconnects']"
	:answer-index="0"
	explanation="Oracle keeps changes private to your session's open transaction until you COMMIT."
/>

<Quiz
	question="What happens to your uncommitted changes when you run CREATE TABLE?"
	:options="['They are rolled back', 'They stay pending', 'They are copied to the new table', 'They are committed automatically, since DDL commits']"
	:answer-index="3"
	explanation="Oracle commits the current transaction before and after any DDL statement."
/>

<Quiz
	question="A long-running report is reading the accounts table while someone updates a row. What happens?"
	:options="['The update waits for the report', 'Neither waits: the report sees a consistent snapshot of committed data', 'The report waits for the update', 'Both wait for each other']"
	:answer-index="1"
	explanation="Oracle's read consistency means readers don't block writers, and writers don't block readers."
/>

## Up next

You've finished the SQL side of Oracle. Now for what makes Oracle special: **PL/SQL**, a full programming language that lives inside the database. It starts in [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks).
