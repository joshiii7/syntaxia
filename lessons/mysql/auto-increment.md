---
title: "MySQL AUTO_INCREMENT, PRIMARY KEY, UNIQUE, and FOREIGN KEY"
description: "Let MySQL number your rows with AUTO_INCREMENT, read the new ID with LAST_INSERT_ID(), understand gaps, and connect tables safely with UNIQUE and FOREIGN KEY constraints."
---

# AUTO_INCREMENT and Keys

*At a busy bakery, you take a numbered ticket from a dispenser. You don't pick your own number, and no two customers ever get the same one. AUTO_INCREMENT is that dispenser.*

In the [last lesson](/lessons/mysql/tables-and-types), you typed each row's `id` by hand. That's risky: two people could pick the same number, or you might forget the last one you used. Real tables let the database hand out IDs, and use **keys** to keep the data consistent.

## The ticket dispenser

Add `AUTO_INCREMENT` to an integer primary key, and MySQL numbers new rows automatically: 1, 2, 3, and so on. Leave the `id` out of your `INSERT`:

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    grade TINYINT UNSIGNED NOT NULL
);

INSERT INTO students (name, grade) VALUES ('Maria Santos', 11);
INSERT INTO students (name, grade) VALUES ('Ben Cruz', 10), ('Carlo Reyes', 11);

SELECT * FROM students;
```

```text
+----+--------------+-------+
| id | name         | grade |
+----+--------------+-------+
|  1 | Maria Santos |    11 |
|  2 | Ben Cruz     |    10 |
|  3 | Carlo Reyes  |    11 |
+----+--------------+-------+
```

- A table can have only one `AUTO_INCREMENT` column, and it must be a key (usually the primary key).
- In SQLite, you'd write `INTEGER PRIMARY KEY` and get similar behavior. In MySQL, it's explicit.
- It's fine to still list `id` with the value `NULL` or `0`, but leaving it out is clearer.

## What number did I just get?

After an insert, you often need the new row's ID, for example to add related rows in another table. `LAST_INSERT_ID()` returns the ID generated for **your own connection's** most recent insert:

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL
);
INSERT INTO students (name) VALUES ('Maria Santos');
INSERT INTO students (name) VALUES ('Ben Cruz');
SELECT LAST_INSERT_ID() AS newest_id;
```

```text
+-----------+
| newest_id |
+-----------+
|         2 |
+-----------+
```

It's safe when many people are inserting at once, since each connection sees only its own last ID. In PHP's PDO, this is what `$db->lastInsertId()` gives you, as in [Databases with PDO](/lessons/php/databases-with-pdo).

If a single `INSERT` adds several rows, `LAST_INSERT_ID()` returns the ID of the **first** one.

## Gaps are normal

The dispenser never takes numbers back. If you delete a row, or an insert fails, that number is gone for good:

```sql
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    holder VARCHAR(40)
);
INSERT INTO tickets (holder) VALUES ('Ana'), ('Ben'), ('Carlo');
DELETE FROM tickets WHERE id = 3;
INSERT INTO tickets (holder) VALUES ('Dina');
SELECT * FROM tickets;
```

```text
+----+--------+
| id | holder |
+----+--------+
|  1 | Ana    |
|  2 | Ben    |
|  4 | Dina   |
+----+--------+
```

Dina is number 4, not 3. That's fine. An ID's only job is to be **unique**, and never to be gap-free. Don't use it to count rows (`COUNT(*)` does that) and don't try to reuse numbers.

To empty a table **and** restart the numbering, use `TRUNCATE TABLE tickets;`. It's fast, but it deletes every row with no undo, and you can't use it with a `WHERE`.

You can also choose where numbering starts, which is handy for invoice numbers that shouldn't start at 1:

```sql
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer VARCHAR(40)
) AUTO_INCREMENT = 1000;
INSERT INTO invoices (customer) VALUES ('Maria'), ('Ben');
SELECT * FROM invoices;
```

```text
+------+----------+
| id   | customer |
+------+----------+
| 1000 | Maria    |
| 1001 | Ben      |
+------+----------+
```

## PRIMARY KEY, revisited

A **primary key** identifies each row uniquely, can't be `NULL`, and there's only one per table. You met it in [Keys and Constraints](/lessons/sqlite3/keys-and-constraints). Two extra points for MySQL:

- InnoDB, MySQL's normal storage engine, organizes the whole table **by its primary key**. That makes lookups by ID very fast, and is another reason to keep keys small (an `INT` beats a long text).
- If you don't define one, InnoDB quietly creates a hidden one. Always define your own.

## UNIQUE: no duplicates

A **unique key** stops two rows from having the same value in a column, such as an email address. A table can have many:

```sql
CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(60) NOT NULL
);
INSERT INTO members (email, name) VALUES ('maria@example.com', 'Maria');
INSERT INTO members (email, name) VALUES ('maria@example.com', 'Maria Again');
```

```text
ERROR 1062 (23000) at line 7: Duplicate entry 'maria@example.com' for key 'members.email'
```

The failed insert also uses up an ID number (another source of gaps). And remember from [From SQLite to MySQL](/lessons/mysql/coming-from-sqlite): MySQL compares text without caring about capitals, so `Maria@Example.com` counts as a **duplicate** of `maria@example.com`.

## FOREIGN KEY: tables that keep their promises

A **foreign key** says "this column must match a row in another table." It stops you from creating a loan for a book that doesn't exist:

```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    borrower VARCHAR(60) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books (id)
);

INSERT INTO books (title) VALUES ('Noli Me Tangere');
INSERT INTO loans (book_id, borrower) VALUES (1, 'Maria');
INSERT INTO loans (book_id, borrower) VALUES (99, 'Ben');
```

```text
ERROR 1452 (23000) at line 14: Cannot add or update a child row: a foreign key constraint fails (`lesson`.`loans`, CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`))
```

Two rules apply, which are the reason foreign keys are worth having:

1. You can't add a loan pointing at a book that isn't there.
2. By default, you can't delete a book that a loan still points at:

```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    borrower VARCHAR(60) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books (id)
);
INSERT INTO books (title) VALUES ('Noli Me Tangere');
INSERT INTO loans (book_id, borrower) VALUES (1, 'Maria');
DELETE FROM books WHERE id = 1;
```

```text
ERROR 1451 (23000) at line 13: Cannot delete or update a parent row: a foreign key constraint fails (`lesson`.`loans`, CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`))
```

You can change that default with `ON DELETE`. `ON DELETE CASCADE` deletes the loans along with the book, and `ON DELETE SET NULL` leaves them behind with an empty `book_id` (which needs a column that allows `NULL`). `RESTRICT`, the default, is the safest.

```sql
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL
);
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    borrower VARCHAR(60) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
);
INSERT INTO books (title) VALUES ('Noli Me Tangere');
INSERT INTO loans (book_id, borrower) VALUES (1, 'Maria'), (1, 'Ben');
DELETE FROM books WHERE id = 1;
SELECT COUNT(*) AS loans_left FROM loans;
```

```text
+------------+
| loans_left |
+------------+
|          0 |
+------------+
```

Use `CASCADE` carefully: one delete can quietly remove many rows.

Unlike SQLite, where you had to switch foreign keys on with a `PRAGMA`, MySQL's InnoDB **always enforces** them. The column types must match: an `INT` column refers to an `INT`, and a `BIGINT UNSIGNED` needs another `BIGINT UNSIGNED`. And the referenced column must be a key.

## Try it

A school club sign-up uses everything from this lesson. Predict each result, including which statements fail, and what the last query returns.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, clubs.sql"
	min-height="460px"
	:model-value="'CREATE TABLE clubs (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(40) NOT NULL UNIQUE\n) AUTO_INCREMENT = 10;\n\nCREATE TABLE signups (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    club_id INT NOT NULL,\n    student VARCHAR(40) NOT NULL,\n    FOREIGN KEY (club_id) REFERENCES clubs (id)\n);\n\nINSERT INTO clubs (name) VALUES (\'Chess\'), (\'Robotics\');\nINSERT INTO clubs (name) VALUES (\'chess\');\nINSERT INTO clubs (name) VALUES (\'Choir\');\n\nINSERT INTO signups (club_id, student) VALUES (10, \'Maria\'), (12, \'Ben\');\nINSERT INTO signups (club_id, student) VALUES (11, \'Carlo\');\nINSERT INTO signups (club_id, student) VALUES (99, \'Dina\');\nDELETE FROM clubs WHERE id = 10;\n\nSELECT LAST_INSERT_ID() AS last_id;\nSELECT c.id, c.name, COUNT(s.id) AS members\nFROM clubs c LEFT JOIN signups s ON s.club_id = c.id\nGROUP BY c.id, c.name\nORDER BY c.id;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client.
:::

::: details Check your prediction
```text
ERROR 1062 (23000) at line 14: Duplicate entry 'chess' for key 'clubs.name'
ERROR 1452 (23000) at line 17: Cannot add or update a child row: a foreign key constraint fails (`lesson`.`signups`, CONSTRAINT `signups_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`))
ERROR 1452 (23000) at line 19: Cannot add or update a child row: a foreign key constraint fails (`lesson`.`signups`, CONSTRAINT `signups_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`))
+---------+
| last_id |
+---------+
|       3 |
+---------+
+----+----------+---------+
| id | name     | members |
+----+----------+---------+
| 11 | Robotics |       1 |
| 13 | Choir    |       0 |
+----+----------+---------+
```

Numbering starts at 10, so Chess and Robotics are 10 and 11. Inserting `'chess'` fails as a duplicate, since capitals don't matter, but it still uses up 12, so Choir becomes 13. The first sign-up statement fails as a whole, because club 12 doesn't exist. A failed statement changes nothing, so Maria isn't added either, although her attempt used up an ID number. That's why Carlo, the next successful sign-up, gets ID 3, not 1. Dina's sign-up fails too, since there's no club 99. Deleting Chess now works, because nobody is signed up for it. `LAST_INSERT_ID()` shows 3, and only Robotics (Carlo) has a member.
:::

## Try it yourself

1. Add a successful sign-up for Maria in Chess before the `DELETE`, with `INSERT INTO signups (club_id, student) VALUES (10, 'Maria');`. What happens to the delete now? Then change the foreign key to `ON DELETE CASCADE` and try again.
2. Add a `UNIQUE (club_id, student)` constraint to `signups`, so the same student can't join the same club twice. Try signing up Carlo for Robotics again.
3. Run `TRUNCATE TABLE signups;`, then insert one row. What ID does it get?

## Check your understanding

<Quiz
	question="A row with id 3 is deleted, and then a new row is inserted. What ID does the new row get?"
	:options="['3, because the number is free again', 'A random number', '1', 'The next number after the highest one ever handed out']"
	:answer-index="3"
	explanation="AUTO_INCREMENT never reuses numbers, so gaps are normal. The ID only has to be unique."
/>

<Quiz
	question="What does LAST_INSERT_ID() return?"
	:options="['The highest ID in the table', 'The number of rows in the table', 'The ID generated by this connection\'s most recent insert', 'The ID of the last row anyone inserted']"
	:answer-index="2"
	explanation="It's tracked per connection, so it's safe even when other people are inserting rows at the same moment."
/>

<Quiz
	question="What does a FOREIGN KEY stop you from doing by default?"
	:options="['Adding a row that points at a missing row, or deleting a row that others still point at', 'Reading from either table', 'Using AUTO_INCREMENT', 'Creating more than one table']"
	:answer-index="0"
	explanation="Foreign keys keep related tables consistent: every reference must match a real row."
/>

## Up next

Your tables can now hold clean, connected data. Time to make MySQL do some work for you, with its built-in tools for text, dates, and more, in [MySQL Functions](/lessons/mysql/mysql-functions).
