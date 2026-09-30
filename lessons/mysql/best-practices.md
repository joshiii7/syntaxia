---
title: "MySQL Best Practices: Schema Design, Safe Queries, and Common Mistakes"
description: "Habits that keep MySQL databases healthy: naming, the right data types, explicit column lists, safe UPDATE and DELETE, indexes, transactions, security, backups, and the mistakes almost every beginner makes."
---

# Best Practices and Common Mistakes

*A shared kitchen stays usable when everyone follows a few rules: label the jars, put knives back where they belong, and clean as you go. A database is a kitchen that many people, and many programs, share for years.*

MySQL will happily accept messy tables and careless queries, and they work, until the day they don't: when the data grows, when a second developer joins, or when someone runs the wrong `DELETE`. This lesson collects the habits that prevent those days.

## Design the tables carefully

Most problems are cheaper to prevent in the design than to fix later. You've learned the pieces already:

- **Name things clearly.** Use `snake_case`, plural table names (`customers`, `orders`), and names that say what's inside: `ordered_on`, not `d`. Avoid reserved words like `order`, `rank`, and `library`, since MySQL 9 reserved that last one. (See [Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types).)
- **Give every table a primary key**, usually an `INT AUTO_INCREMENT` (or `BIGINT` when it could pass two billion).
- **Choose exact types.** `DECIMAL` for money, never `FLOAT`. `DATE` and `DATETIME` for dates, never text. `TINYINT`, `SMALLINT`, or `INT`, sized to the data. `VARCHAR` with a sensible limit.
- **Say `NOT NULL`** whenever a value is required, and give sensible `DEFAULT`s. A column that's allowed to be empty needs an answer to the question "what does empty mean?"
- **Use constraints.** `UNIQUE` for emails and codes, `CHECK` for rules like `price >= 0`, and `FOREIGN KEY` for relationships, as in [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment).
- **Use InnoDB and utf8mb4**, which are the defaults, and never change them without a reason. ([InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions), [Character Sets and utf8mb4](/lessons/mysql/character-sets))
- **One fact, one place.** Don't store the same information in two tables, or a list in one cell. See [Database Design](/lessons/sqlite3/database-design).
- **Leave strict mode on.** MySQL's default settings refuse bad data. Some old tutorials tell you to switch strict mode off to make an error go away. Don't. Fix the data instead.

## Write careful queries

**Name your columns.** `SELECT *` fetches every column, including ones you don't need, and breaks code when someone adds a column. `INSERT INTO products VALUES (...)` breaks the day the table gets a new column. List the columns:

```sql
INSERT INTO products (name, price) VALUES ('Notebook', 45.50);
SELECT id, name, price FROM products WHERE price < 100;
```

**Filter in the database.** Let `WHERE` do the filtering, not your PHP code. Fetching a million rows to keep ten wastes time and memory.

**Always `ORDER BY` when you use `LIMIT`.** Without an order, "the first 10 rows" can be any 10, and can change from run to run.

**Never `ORDER BY RAND()` on a big table.** It sorts every row. To pick a random row from a big table, use a smarter approach, like choosing a random ID in your program.

**Keep functions off indexed columns.** `WHERE YEAR(ordered_on) = 2026` can't use an index on `ordered_on`, and the equivalent range can. See [Query Performance with EXPLAIN](/lessons/mysql/explain).

**Paginate carefully.** `LIMIT 20 OFFSET 100000` reads and throws away 100,000 rows. For long lists, "give me 20 rows with an id greater than the last one I showed" is much faster.

**Use prepared statements** for every value that comes from a person. That's your defense against SQL injection ([Using MySQL from PHP with PDO](/lessons/mysql/mysql-in-php)).

## Change data safely

The most expensive mistakes come from `UPDATE` and `DELETE` without a proper `WHERE`. Habits that prevent them:

1. **Write the `SELECT` first.** Before you `DELETE FROM orders WHERE status = 'cancelled'`, run `SELECT COUNT(*) FROM orders WHERE status = 'cancelled'`. Does the number match what you expected?
2. **Use a transaction** for changes you'd like to check: `START TRANSACTION;`, run the statement, look at the results, then `COMMIT` if they look right, or `ROLLBACK` if not.
3. **Take a backup first** before big changes ([Backups with mysqldump](/lessons/mysql/backups)).
4. **Let the client protect you.** Starting the `mysql` client with `--safe-updates` (or `-U`) refuses an `UPDATE` or `DELETE` that doesn't use a key in its `WHERE` clause, or a `LIMIT`. It's a great habit on a real server.

```sql
START TRANSACTION;
DELETE FROM orders WHERE status = 'cancelled';
SELECT COUNT(*) FROM orders;
-- Looks wrong? ROLLBACK;   Looks right? COMMIT;
```

## Design for growth and change

- **Add indexes for the queries you really run**, and check them with `EXPLAIN`. Don't add them on a hunch: each one slows down writes.
- **Keep transactions short**, and retry after a deadlock ([InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions)).
- **Keep your schema in files.** Save your `CREATE TABLE` statements, and every later `ALTER TABLE`, in `.sql` files in your project (and in Git), so anyone can rebuild the database. Such files are often called **migrations**.
- **Look before you change a big table.** `ALTER TABLE` on a table with millions of rows can take a long time, and lock things while it works. Try it on a copy first.

## Keep it secure and recoverable

- **One account per application, with the least privilege it needs**, never root ([Users and Privileges](/lessons/mysql/users-and-privileges)).
- **Keep passwords out of code** in Git. Put them in a private settings file.
- **Don't open the server to the world.** A database on the internet gets attacked within minutes. Let it listen only on the local machine, or a private network, unless you truly need otherwise.
- **Back up automatically, keep copies elsewhere, and test your restores** ([Backups with mysqldump](/lessons/mysql/backups)).
- **Keep MySQL updated.** Each LTS release gets security fixes. If you're on an old version, plan your upgrade before support ends.

## The mistakes almost everyone makes

When something's wrong and you can't see why, run down this list. Every one of these came up somewhere in this track.

1. **Using `||` to join text.** In MySQL it means OR. Use `CONCAT`. ([Coming from SQLite](/lessons/mysql/coming-from-sqlite))
2. **Double quotes around a column name**, which SQLite accepts but MySQL reads as **text**. Use backticks for names, and single quotes for text. ([Coming from SQLite](/lessons/mysql/coming-from-sqlite))
3. **Using `FLOAT` for money**, and watching totals drift. Use `DECIMAL`. ([Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types))
4. **Naming things with reserved words**, such as `order`, `rank`, or, in MySQL 9, `library`. ([Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types))
5. **Expecting `AUTO_INCREMENT` to be gap-free**, or trying to reuse deleted numbers. ([AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment))
6. **Deleting a parent row before its children**, and hitting a foreign key error. ([AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment))
7. **`REPLACE INTO` instead of an upsert**, which deletes the row and breaks its ID and links. ([Upserts](/lessons/mysql/upserts))
8. **`GROUP_CONCAT` results cut off** at 1,024 characters. ([MySQL Functions](/lessons/mysql/mysql-functions))
9. **Putting a SET or JSON column in charge of data you search often**, when a proper table would do. ([ENUM, SET, and JSON Columns](/lessons/mysql/enum-set-and-json))
10. **Giving an application the root account.** ([Users and Privileges](/lessons/mysql/users-and-privileges))
11. **Keeping a transaction open** while a person thinks, so other people's updates wait and time out. ([InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions))
12. **Forgetting `charset=utf8mb4`** in the connection, and getting `JosÃ©` back. ([Character Sets and utf8mb4](/lessons/mysql/character-sets))
13. **Wrapping an indexed column in a function**, so the index can't be used. ([Query Performance with EXPLAIN](/lessons/mysql/explain))
14. **Never testing a restore.** ([Backups with mysqldump](/lessons/mysql/backups))

## Try it

This script works, and it prints an answer. But it breaks many of the habits in this lesson. Read it, predict what it prints, and count how many problems you can spot along the way.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, messy.sql"
	min-height="380px"
	:model-value="'CREATE TABLE stuff (\n    id INT,\n    n VARCHAR(255),\n    p FLOAT,\n    d VARCHAR(20),\n    s INT\n);\n\nINSERT INTO stuff VALUES\n    (1, \'Notebook\', 45.5, \'2026-09-03\', 1),\n    (2, \'Pen\', 12.1, \'2026-09-05\', 0),\n    (3, \'Marker\', 30.1, \'2026-10-01\', 1),\n    (4, \'Ruler\', 15.2, \'2026-10-05\', 1);\n\nSELECT SUM(p) AS total FROM stuff WHERE s = 1;\nSELECT * FROM stuff WHERE d LIKE \'2026-10%\';\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
+-------------------+
| total             |
+-------------------+
| 90.80000019073486 |
+-------------------+
+------+--------+------+------------+------+
| id   | n      | p    | d          | s    |
+------+--------+------+------------+------+
|    3 | Marker | 30.1 | 2026-10-01 |    1 |
|    4 | Ruler  | 15.2 | 2026-10-05 |    1 |
+------+--------+------+------------+------+
```

Some of the problems:

- the names `stuff`, `n`, `p`, `d`, and `s` say nothing (is `s` the stock, or the status?);
- there's no primary key, so nothing stops two rows having `id` 1;
- prices are `FLOAT`, so the total has an error in its last digits;
- dates are `VARCHAR`, so nothing stops `'2026-13-45'` or `'tomorrow'`, and searching by month needs `LIKE` on text;
- nothing is `NOT NULL`, and `VARCHAR(255)` was picked without a thought;
- the `INSERT` doesn't list its columns, and the `SELECT` uses `*`.

Here's one way to clean it up. It answers the same questions:

```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    price DECIMAL(8, 2) NOT NULL CHECK (price >= 0),
    added_on DATE NOT NULL,
    is_in_stock BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO products (name, price, added_on, is_in_stock) VALUES
    ('Notebook', 45.50, '2026-09-03', TRUE),
    ('Pen', 12.10, '2026-09-05', FALSE),
    ('Marker', 30.10, '2026-10-01', TRUE),
    ('Ruler', 15.20, '2026-10-05', TRUE);

SELECT SUM(price) AS total FROM products WHERE is_in_stock;
SELECT id, name, price, added_on
FROM products
WHERE added_on >= '2026-10-01' AND added_on < '2026-11-01';
```

```text
+-------+
| total |
+-------+
| 90.80 |
+-------+
+----+--------+-------+------------+
| id | name   | price | added_on   |
+----+--------+-------+------------+
|  3 | Marker | 30.10 | 2026-10-01 |
|  4 | Ruler  | 15.20 | 2026-10-05 |
+----+--------+-------+------------+
```

It's a little longer, and that's fine. The total is exact, the dates are real dates, bad rows are refused, and the names say what everything is.
:::

## Try it yourself

1. In the messy version, insert a row with the date `'next week'`. Does MySQL complain? Now try the same in the clean version.
2. In the clean version, try inserting a product with a negative price. What happens, and which line makes that happen?
3. Pick a table from earlier in this track. Find one unclear name, one column with a poor type, and one query that uses `SELECT *`, and fix all three.

## Check your understanding

<Quiz
	question="Why should you run a SELECT with the same WHERE before running a DELETE?"
	:options="['DELETE cannot use WHERE', 'SELECT makes the DELETE faster', 'To check that it matches the rows you expected, before anything is removed', 'MySQL requires it']"
	:answer-index="2"
	explanation="A SELECT is harmless, and shows exactly which rows a DELETE would remove, so you can catch a wrong condition before it costs you data."
/>

<Quiz
	question="What is wrong with INSERT INTO products VALUES (...) with no column list?"
	:options="['It breaks the day someone adds or reorders a column', 'It is not valid SQL', 'It cannot insert text', 'It always creates duplicates']"
	:answer-index="0"
	explanation="Without a column list, the values must match every column, in order. Listing the columns keeps the statement working when the table changes."
/>

<Quiz
	question="A colleague suggests turning off strict mode to make an error message go away. What's the best response?"
	:options="['Do it, since errors are annoying', 'Turn it off only in production', 'It makes MySQL faster, so yes', 'No: strict mode is protecting your data, so fix the bad data instead']"
	:answer-index="3"
	explanation="Strict mode refuses invalid values instead of quietly changing them. Turning it off hides mistakes."
/>

## Up next

You've learned everything you need to design, protect, and use a real MySQL database. Time to prove it, in the [Final Project: Online Store Database](/lessons/mysql/final-project).
