---
title: "MySQL InnoDB, Transactions, Isolation Levels, and Locking"
description: "Understand InnoDB, MySQL's default storage engine: run transactions with START TRANSACTION, COMMIT, ROLLBACK, and SAVEPOINT, see REPEATABLE READ in action, lock rows with FOR UPDATE, and handle deadlocks."
---

# InnoDB, Transactions, and Locking

*When you transfer money at an ATM, two things must happen together: your account goes down, and your friend's goes up. If the machine crashes in between, the money can't just vanish. A transaction makes sure it doesn't.*

You met transactions in the SQLite track's [Transactions](/lessons/sqlite3/transactions) lesson: a group of statements that succeed or fail as one. MySQL has the same idea, with more to think about, since a MySQL server has **many people** using the same tables at the same moment. This lesson covers how MySQL stores data, how transactions work, and what happens when two people touch the same row.

## Storage engines and InnoDB

A MySQL table isn't just a table: it's stored by a **storage engine**, the part of the server that actually saves and reads the data. MySQL can use different engines for different tables, which is unusual among databases. You can see what's available:

```sql
SELECT ENGINE, SUPPORT, TRANSACTIONS
FROM information_schema.ENGINES
ORDER BY ENGINE;
```

```text
+--------------------+---------+--------------+
| ENGINE             | SUPPORT | TRANSACTIONS |
+--------------------+---------+--------------+
| ARCHIVE            | YES     | NO           |
| BLACKHOLE          | YES     | NO           |
| CSV                | YES     | NO           |
| FEDERATED          | NO      | NULL         |
| InnoDB             | DEFAULT | YES          |
| MEMORY             | YES     | NO           |
| MRG_MYISAM         | YES     | NO           |
| MyISAM             | YES     | NO           |
| ndbcluster         | NO      | NULL         |
| ndbinfo            | NO      | NULL         |
| PERFORMANCE_SCHEMA | YES     | NO           |
+--------------------+---------+--------------+
```

(Your list may differ a little, depending on how your MySQL was built.) The default, and the one you should use for almost everything, is **InnoDB**. It's the engine that supports **transactions**, **foreign keys**, and **row-level locking**, and that recovers safely after a crash. Older tutorials mention MyISAM, which can't do transactions or foreign keys, and is essentially only of historical interest. Every table in this track uses InnoDB, which is why foreign keys have been enforced all along.

You can check a table's engine, and see the default, with:

```sql
CREATE TABLE notes (id INT PRIMARY KEY);
SELECT @@default_storage_engine AS default_engine;
SELECT TABLE_NAME, ENGINE FROM information_schema.TABLES WHERE TABLE_NAME = 'notes';
```

```text
+----------------+
| default_engine |
+----------------+
| InnoDB         |
+----------------+
+------------+--------+
| TABLE_NAME | ENGINE |
+------------+--------+
| notes      | InnoDB |
+------------+--------+
```

## ACID: what a transaction promises

A transaction gives four guarantees, remembered by the letters **ACID**:

- **Atomic**: all of its statements happen, or none of them do.
- **Consistent**: it moves the database from one valid state to another, and can't break rules like foreign keys.
- **Isolated**: transactions running at the same time don't see each other's half-finished work.
- **Durable**: once committed, the changes survive even a power cut.

## Autocommit

By default, MySQL runs in **autocommit** mode: every statement is its own tiny transaction, saved the instant it succeeds.

```sql
SELECT @@autocommit AS autocommit;
```

```text
+------------+
| autocommit |
+------------+
|          1 |
+------------+
```

`1` means on. To group statements, you start a transaction yourself, which pauses autocommit until you finish it.

## Transactions: START TRANSACTION, COMMIT, ROLLBACK

The examples use a small `accounts` table:

Moving 200 from Maria to Ben is two updates that belong together:

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 200 WHERE id = 1;
UPDATE accounts SET balance = balance + 200 WHERE id = 2;
COMMIT;
SELECT * FROM accounts;
```

```text
+----+-------+---------+
| id | owner | balance |
+----+-------+---------+
|  1 | Maria |  800.00 |
|  2 | Ben   |  700.00 |
+----+-------+---------+
```

- `START TRANSACTION` (or `BEGIN`) begins the group.
- `COMMIT` makes every change permanent, at once, for everyone.
- `ROLLBACK` throws everything since `START TRANSACTION` away, as if it never happened.

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 200 WHERE id = 1;
SELECT balance AS inside_transaction FROM accounts WHERE id = 1;
ROLLBACK;
SELECT balance AS after_rollback FROM accounts WHERE id = 1;
```

```text
+--------------------+
| inside_transaction |
+--------------------+
|             800.00 |
+--------------------+
+----------------+
| after_rollback |
+----------------+
|        1000.00 |
+----------------+
```

Inside the transaction, you see your own change. Nobody else does until you commit. After `ROLLBACK`, it's gone. If a statement inside the transaction **fails**, for example when a `CHECK` rule breaks, you decide what happens: roll the whole thing back, or handle the error and carry on:

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance + 5000 WHERE id = 2;
UPDATE accounts SET balance = balance - 5000 WHERE id = 1;
ROLLBACK;
SELECT * FROM accounts;
```

```text
ERROR 3819 (HY000) at line 3: Check constraint 'accounts_chk_1' is violated.
+----+-------+---------+
| id | owner | balance |
+----+-------+---------+
|  1 | Maria | 1000.00 |
|  2 | Ben   |  500.00 |
+----+-------+---------+
```

The second update was refused (Maria doesn't have 5,000), and because the program then rolled back, Ben didn't get the 5,000 either. Without a transaction, Ben would have kept the money.

A few statements can't be rolled back, because MySQL commits **before** running them. These are changes to the structure: `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, and the like. Keep them out of your transactions.

## SAVEPOINT: a bookmark inside a transaction

A **savepoint** marks a spot you can roll back to, without cancelling the whole transaction:

```sql
START TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
SAVEPOINT after_first;
UPDATE accounts SET balance = balance - 300 WHERE id = 1;
ROLLBACK TO SAVEPOINT after_first;
COMMIT;
SELECT balance FROM accounts WHERE id = 1;
```

```text
+---------+
| balance |
+---------+
|  900.00 |
+---------+
```

Only the second update was undone; the first was kept, and committed.

## Isolation: what others can see

When many transactions run together, MySQL decides how much of each other's work they can see. This is the **isolation level**, and InnoDB's default is **REPEATABLE READ**:

```sql
SELECT @@transaction_isolation AS isolation_level;
```

```text
+-----------------+
| isolation_level |
+-----------------+
| REPEATABLE-READ |
+-----------------+
```

Under it, a transaction sees a **consistent snapshot** of the data, as it was when the transaction first read it. Here are two connections, A and B, working on Maria's account, with B running between A's two reads (B's rows show its own connection):

```text
A> START TRANSACTION;
A> SELECT balance FROM accounts WHERE id = 1;
+---------+
| balance |
+---------+
| 1000.00 |
+---------+

B> UPDATE accounts SET balance = 900 WHERE id = 1;    -- autocommits at once

A> SELECT balance FROM accounts WHERE id = 1;
+---------+
| balance |
+---------+
| 1000.00 |
+---------+

A> COMMIT;
A> SELECT balance FROM accounts WHERE id = 1;
+---------+
| balance |
+---------+
|  900.00 |
+---------+
```

Even though B had already committed its change, A keeps seeing 1000.00 until it finishes its own transaction. That means A's reads are **repeatable**: the same query gives the same answer all the way through. Other levels trade this for other behavior (`READ COMMITTED` sees each new commit right away, for example), but you'll rarely need to change the default.

## Locking: waiting your turn

Snapshots make **reading** smooth. But when two transactions want to **change** the same row, one has to wait. InnoDB puts a **row lock** on any row you change, and holds it until the transaction ends.

Sometimes you want to lock a row **before** you change it, so nobody can sneak a change in between your read and your write. That's what `SELECT ... FOR UPDATE` does:

```sql
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- decide in your program whether there is enough money, then:
UPDATE accounts SET balance = balance - 250 WHERE id = 1;
COMMIT;
SELECT balance FROM accounts WHERE id = 1;
```

```text
+---------+
| balance |
+---------+
| 1000.00 |
+---------+
+---------+
| balance |
+---------+
|  750.00 |
+---------+
```

Without `FOR UPDATE`, two customers could both read "balance 1000", both decide 800 is safe to withdraw, and both proceed. With it, the second one waits until the first commits, and then reads the up-to-date balance.

Here's a second connection trying to change a locked row (with its wait time set to 2 seconds for the demo):

```text
A> START TRANSACTION;
A> SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;      -- A locks the row

B> UPDATE accounts SET balance = balance - 100 WHERE id = 1;
ERROR 1205 (HY000): Lock wait timeout exceeded; try restarting transaction
```

B waited, and gave up. By default, InnoDB waits **50 seconds** (the `innodb_lock_wait_timeout` setting) before giving up with error 1205. Lesson: keep transactions **short**. Start one, do the work, and commit right away. Never leave one open while waiting for a person to type something.

## Deadlocks

The worst case: two transactions each hold a lock the other one needs, so both wait forever.

```text
A> START TRANSACTION;
A> UPDATE accounts SET balance = balance - 10 WHERE id = 1;     -- A locks Maria

B> START TRANSACTION;
B> UPDATE accounts SET balance = balance - 20 WHERE id = 2;     -- B locks Ben

A> UPDATE accounts SET balance = balance + 10 WHERE id = 2;     -- A waits for Ben's row
B> UPDATE accounts SET balance = balance + 20 WHERE id = 1;     -- B waits for Maria's row
ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction
```

Each is waiting for the other, so neither can go on. InnoDB **notices** this, picks one transaction as the "victim", rolls it back, and lets the other finish. In this run, B was the victim: its whole transaction was undone, and A's went through.

Deadlocks are a normal part of busy databases, not a sign of a bug. Two habits keep them rare:

- **Touch rows in the same order** in every transaction (always the lower ID first, for example).
- **Keep transactions short.**

And your program must be ready: when it gets error 1213 (or 1205), it should **retry** the whole transaction.

## Try it

A shop sells the last few tickets to a show. This script runs two purchases in one connection, one after the other. Predict what each `SELECT` shows.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, tickets.sql"
	min-height="460px"
	:model-value="'CREATE TABLE tickets (\n    show_id INT PRIMARY KEY,\n    left_over INT NOT NULL CHECK (left_over &gt;= 0)\n);\nCREATE TABLE purchases (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    buyer VARCHAR(20) NOT NULL,\n    quantity INT NOT NULL\n);\nINSERT INTO tickets VALUES (1, 3);\n\nSTART TRANSACTION;\nSELECT left_over FROM tickets WHERE show_id = 1 FOR UPDATE;\nINSERT INTO purchases (buyer, quantity) VALUES (\'Maria\', 2);\nUPDATE tickets SET left_over = left_over - 2 WHERE show_id = 1;\nCOMMIT;\n\nSTART TRANSACTION;\nINSERT INTO purchases (buyer, quantity) VALUES (\'Ben\', 2);\nUPDATE tickets SET left_over = left_over - 2 WHERE show_id = 1;\nROLLBACK;\n\nSELECT left_over FROM tickets;\nSELECT buyer, quantity FROM purchases;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
+-----------+
| left_over |
+-----------+
|         3 |
+-----------+
ERROR 3819 (HY000) at line 20: Check constraint 'tickets_chk_1' is violated.
+-----------+
| left_over |
+-----------+
|         1 |
+-----------+
+-------+----------+
| buyer | quantity |
+-------+----------+
| Maria |        2 |
+-------+----------+
```

The first `SELECT ... FOR UPDATE` shows the 3 tickets before Maria buys. Her purchase then commits, leaving 1 ticket. Ben's `INSERT` succeeds, but his `UPDATE` would take the count to -1, which the `CHECK` rule refuses. His transaction is then rolled back (the script does that on purpose), which also undoes his `INSERT`. So only Maria's purchase remains, and no purchase exists without its stock change.
:::

## Try it yourself

1. Change the script so that Ben buys only 1 ticket, and commit it. What does each table say?
2. Change the script's `ROLLBACK` to `COMMIT`. Ben's failed `UPDATE` changed nothing, but his `INSERT` succeeded. What do the tables show now, and why would that be a serious bug in a real shop?
3. Open two `mysql` windows. In one, start a transaction and update a row without committing. In the other, try to update the same row. What do you see, and what happens when the first window commits?

## Check your understanding

<Quiz
	question="What does ROLLBACK do?"
	:options="['Undoes every change since START TRANSACTION', 'Saves all the changes', 'Deletes the table', 'Restarts the server']"
	:answer-index="0"
	explanation="ROLLBACK cancels the transaction, so the database is exactly as it was before START TRANSACTION."
/>

<Quiz
	question="Under REPEATABLE READ, transaction A reads a row, then B changes it and commits. What does A see if it reads the row again before finishing?"
	:options="['B\'s new value', 'An error', 'The row is gone', 'The original value, from its snapshot']"
	:answer-index="3"
	explanation="REPEATABLE READ gives each transaction a consistent snapshot, so repeating a read gives the same answer."
/>

<Quiz
	question="Your program gets error 1213 (deadlock). What should it do?"
	:options="['Ignore it', 'Retry the whole transaction, since MySQL already rolled it back', 'Restart the server', 'Change the isolation level']"
	:answer-index="1"
	explanation="MySQL picks one transaction as the victim and rolls it back. The program should simply try again."
/>

## Up next

Now that you know how MySQL stores and protects data, let's look at how it stores **text**, and why one setting decides whether `é` and emoji survive, in [Character Sets and utf8mb4](/lessons/mysql/character-sets).
