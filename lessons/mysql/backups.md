---
title: "MySQL Backups with mysqldump: Backing Up and Restoring a Database"
description: "Back up MySQL databases with mysqldump, restore them with the mysql client, understand what a dump file contains, avoid common restore errors, and follow the backup rules that protect real data."
---

# Backups with mysqldump

*A fire drill isn't fun, but nobody wants to find out the exits are blocked during a real fire. Backups are your database's fire drill: you do them so you never need them, and you test them so you can trust them.*

Things go wrong. Someone runs `DELETE FROM orders;` without a `WHERE`. A disk fails. A bad update ruins a month of data. Every real database needs **backups**, copies of the data you can restore from.

MySQL comes with a tool for this called **`mysqldump`**. It reads a database and writes it out as a plain text file of SQL statements, which, when you run them, rebuild everything. Backups of this kind are called **logical backups**.

## Making a backup

`mysqldump` is a command you run in your terminal, not inside the `mysql` client. Its basic shape is:

```text
mysqldump -u root -p school_shop > school_shop.sql
```

- `-u root -p` is your login, just like the `mysql` client.
- `school_shop` is the database to dump.
- `> school_shop.sql` sends the output into a file (the `>` is your terminal's redirect, not part of MySQL).

You can dump just some tables by naming them after the database, or everything on the server:

```text
mysqldump -u root -p school_shop products customers > two_tables.sql
mysqldump -u root -p --all-databases > everything.sql
```

The backup file is plain text. For a small database, here's what's in it (trimmed to the important lines):

```text
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `products` VALUES (1,'Notebook',45.50),(2,'Pen',12.00),(3,'Café mug',150.00);
```

That's all a backup is: statements to recreate each table, and `INSERT`s to fill it. You can open the file in any text editor to see, and even edit, what's in it.

## The options worth knowing

A few options make a backup safer and more complete. Here's a good everyday command:

```text
mysqldump -u root -p --single-transaction --routines --triggers --set-gtid-purged=OFF --databases school_shop > school_shop.sql
```

| Option | What it does |
|---|---|
| `--single-transaction` | Takes a consistent snapshot without locking your InnoDB tables, so the site can keep running during the backup. Uses the transaction ideas from [InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions). |
| `--routines` | Includes stored procedures and functions. (They're left out by default.) |
| `--triggers` | Includes triggers. (This one is on by default.) |
| `--databases name` | Adds `CREATE DATABASE` and `USE` lines to the file, so it restores itself completely. |
| `--no-data` | Structure only, with no rows. Handy for sharing a schema. |
| `--set-gtid-purged=OFF` | Leaves out a line that can make a restore fail on a server that uses GTIDs (see below). |

Views are included automatically. Users and their passwords are **not** part of a single database's dump: they live in the `mysql` database, so a full backup needs `--all-databases`, or a separate way of recreating accounts.

To save space, compress the dump as it's written (on macOS and Linux, and in Git Bash on Windows):

```text
mysqldump -u root -p --single-transaction --databases school_shop | gzip > school_shop.sql.gz
```

A small database of a few thousand rows compresses to almost nothing, and big ones typically shrink a lot, since SQL text compresses well.

## Restoring a backup

To restore, feed the file to the `mysql` client. Two ways:

```text
mysql -u root -p < school_shop.sql
```

Or, from inside the client, `SOURCE school_shop.sql;`. For a compressed file:

```text
gzip -dc school_shop.sql.gz | mysql -u root -p
```

A dump made **without** `--databases` doesn't include `CREATE DATABASE`, so create the database first, and name it in the command:

```text
mysql -u root -p -e "CREATE DATABASE restore_test"
mysqldump -u root -p school_shop products | mysql -u root -p restore_test
```

The last line dumps a table straight into another database with a **pipe** (`|`), a handy way to copy data around without an intermediate file.

The dump's statements start with `DROP TABLE IF EXISTS`, so restoring **overwrites** any table with the same name. Be sure you're restoring into the right place.

## A trap: GTIDs

Some servers, including a fresh one from a modern MySQL, have **GTIDs** ("global transaction identifiers") switched on. They're an ID for every transaction that replication uses. When a dump is made on such a server, it includes a line that records which transactions the data already contains. Restoring that file **on the same server** then fails:

```text
ERROR 3546 (HY000) at line 24: @@GLOBAL.GTID_PURGED cannot be changed: the added gtid set must not overlap with @@GLOBAL.GTID_EXECUTED
```

That line means: "the server already knows about these transactions." The simple fix, for backups you'll restore for testing or into a fresh setup, is to make the dump with `--set-gtid-purged=OFF`, as in the everyday command above. (When restoring to build a new replica, MySQL's replication documentation explains when to leave it on.)

## Backups you don't test aren't backups

The most important rule: **a backup you have never restored is only a hope.** Files get truncated, options get forgotten, and passwords get lost. Get in the habit of:

1. Restoring a backup into a **separate test database**, and checking that the tables and row counts look right.
2. Doing this on a schedule, and after any change to how you take backups.

## The rules of good backups

- **Automate them.** Backups that depend on someone remembering don't happen. Use your operating system's scheduler: Task Scheduler on Windows, or `cron` on macOS and Linux.
- **Keep copies somewhere else.** A backup on the same disk as the database disappears with it. Keep copies on another machine, or in cloud storage.
- **Keep several.** Don't overwrite yesterday's backup with today's: you might notice a problem days later. Keep, say, daily backups for a week, and weekly ones for a few months.
- **Protect them.** A dump has all your data, in readable text. Store it as carefully as the database itself.
- **Know how long a restore takes.** For big databases, replaying a dump can take hours, so plan for that.

## What logical backups can't do

A dump captures your data at one moment. If you back up every night at 2 AM and the disaster strikes at 5 PM, you lose 15 hours of changes. MySQL can also write a **binary log** of every change, and with a dump plus the binary log, you can restore to an exact moment, called **point-in-time recovery**. Very large systems also use **physical backups**, which copy the data files themselves, faster than dumping and reloading. Both are beyond this lesson, but now you know they exist.

## Try it

Here's a small, real-looking backup file. Predict what the database contains after you restore it into an empty server.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, restore.sql"
	min-height="440px"
	:model-value="'DROP TABLE IF EXISTS `products`;\nCREATE TABLE `products` (\n  `id` int NOT NULL AUTO_INCREMENT,\n  `name` varchar(40) NOT NULL,\n  `price` decimal(8,2) NOT NULL,\n  PRIMARY KEY (`id`)\n) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;\n\nINSERT INTO `products` VALUES (1,\'Notebook\',45.50),(2,\'Pen\',12.00),(3,\'Marker\',30.00);\n\nINSERT INTO `products` (`name`, `price`) VALUES (\'Eraser\', 8.00);\nDELETE FROM `products` WHERE `id` = 2;\nINSERT INTO `products` (`name`, `price`) VALUES (\'Ruler\', 15.00);\n\nSELECT * FROM `products` ORDER BY `id`;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
+----+----------+-------+
| id | name     | price |
+----+----------+-------+
|  1 | Notebook | 45.50 |
|  3 | Marker   | 30.00 |
|  4 | Eraser   |  8.00 |
|  5 | Ruler    | 15.00 |
+----+----------+-------+
```

The dump recreates the table and its three rows, with their original IDs. Because the table definition says `AUTO_INCREMENT=4`, the next new row (the eraser) gets ID 4, exactly as it would have in the original database, and the ruler gets 5. The pen was deleted afterward, so there's a gap at 2. A restore brings back the numbering as well as the data.
:::

## Try it yourself

1. Make a database with a table or two, and back it up with `mysqldump`. Open the `.sql` file in your editor and find the `CREATE TABLE` and `INSERT` lines.
2. Restore that backup into a new database called `restore_test`, and compare row counts with `SELECT COUNT(*)`.
3. Take a backup, then delete some rows with a mistaken `DELETE`. Restore the backup into a different database, and copy the missing rows back with `INSERT ... SELECT`. This is what a real recovery often looks like.

## Check your understanding

<Quiz
	question="What is inside a mysqldump backup file?"
	:options="['A copy of the database files in binary form', 'A picture of the tables', 'SQL statements that recreate the tables and insert the rows', 'Only the table names']"
	:answer-index="2"
	explanation="A dump is plain text SQL. Running it rebuilds the structure and data."
/>

<Quiz
	question="Why is --single-transaction useful when backing up InnoDB tables?"
	:options="['It takes a consistent snapshot without locking the tables, so the site keeps running', 'It compresses the file', 'It deletes old backups', 'It makes the dump include users']"
	:answer-index="0"
	explanation="It uses a transaction to read all tables as they were at one moment, without blocking other people's writes."
/>

<Quiz
	question="Which statement about backups is the most important?"
	:options="['A backup you have never restored is only a hope, so test your restores', 'Backups only matter for large databases', 'A backup on the same disk is the safest', 'You only need one backup, kept forever']"
	:answer-index="0"
	explanation="Restoring into a test database on a schedule is the only way to know your backups work."
/>

## Up next

You've learned MySQL from the inside. Now let's put it to work in a real application, connecting to it from PHP, in [Using MySQL from PHP with PDO](/lessons/mysql/mysql-in-php).
