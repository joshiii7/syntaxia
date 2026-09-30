---
title: "SQLite Final Project: Build a School Library Database"
description: "Put the whole SQLite3 track to work by designing a school library database with constraints, filling it with data, and writing the reports a librarian needs."
---

# Final Project: School Library Database

*Every lesson gave you one tool. This project hands you the whole toolbox and a real job to do.*

Before the project, one more look back.

At the start of this track, a database was a mystery: somewhere data went, and somehow came back. Your first query was `SELECT * FROM members;`, and it felt like magic that a table appeared.

Look at what you know now. You can ask a database almost any question: filter rows, sort them, and limit them, handle missing values, summarize whole tables, group them, and combine several tables into one answer with joins and subqueries. You can build your own tables, fill them, change them, and remove rows without losing the ones you meant to keep. You can design a database so each fact lives in one place, guard it with constraints the database enforces for you, make it fast with indexes, and keep it correct with transactions. You know SQLite's own quirks, and you can run all of it from a Python program, safely, with placeholders.

There were surely moments when a query returned nothing, or far too much: an `= NULL` that never matched, a join that multiplied your rows, a `GROUP BY` that complained. You read the result, worked out why, and fixed it. That's the real skill, and you have it now.

I'm genuinely proud of you. Let's build something.

## The project

You'll design and build the database behind a **school library system**, from scratch. It keeps track of:

- the **books** the library owns, and how many copies of each;
- the **members** who can borrow them;
- every **loan**: which book, which member, when it was lent, when it's due, and when it came back.

Then you'll write the **reports** a librarian actually needs: what's out right now, what's overdue, what's most popular, and what's on the shelf.

This time, the whole project is SQL. Unlike the tables you've been given so far, every design decision is yours.

## Getting set up

1. Make a folder called `library-project`, and create a file in it called `library_project.sql`. You'll write everything in this one file: the tables, the data, and the reports.
2. Open a terminal in the folder, and start SQLite with a new database: `sqlite3 project.db`
3. Whenever you want to run your file, type `.read library_project.sql` at the `sqlite>` prompt.

Because your file creates the tables, running it twice would fail with "table already exists." The easy fix while you're building: quit, delete `project.db`, and start fresh each time. It's also a good test that your file really does build everything from nothing.

Here's a starting point, with a spot for each requirement:

<CodeEditor
	language="plaintext"
	label="SQL practice editor, library_project.sql"
	min-height="380px"
	:model-value="'-- School Library Database\n\nPRAGMA foreign_keys = ON;\n\n-- Requirement 1: the tables\n-- CREATE TABLE books (...) STRICT;\n-- CREATE TABLE members (...) STRICT;\n-- CREATE TABLE loans (...) STRICT;\n\n-- Requirement 5: indexes\n\n-- Requirement 2: sample data\n\n.mode table\n\n-- Requirement 3: reports\n\n-- Requirement 4: a book changes hands, as one transaction\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. You can read and edit the starter file here, but build and run the project with the `sqlite3` shell on your own computer. If you haven't installed it yet, [Setting Up](/lessons/sqlite3/setting-up) walks you through it.
:::

Work through the requirements in order, and run your file after each one.

## Requirements

Each requirement says what to build, **why** it matters, and which lessons to review.

### 1. Three well-guarded tables

Create `books`, `members`, and `loans`, each as a **`STRICT`** table with an automatic `id` primary key:

- **`books`**: title, author, genre, publication year, and `copies_owned`. Every book needs a title, author, and genre. Copies must be at least 1, and default to 1.
- **`members`**: name, email, grade level, and the date they joined. Every column is required, emails must be **unique**, and grade levels must be from 7 to 12.
- **`loans`**: a `book_id` and `member_id` that are **foreign keys** to the other two tables, a loan date and due date (both required), and a returned date that stays `NULL` until the book comes back. Add a `CHECK` that the due date is after the loan date.

Notice what's missing: there's no `copies_on_loan` column. How many copies are out is a fact the `loans` table already knows, so storing it again would break the "one fact, one place" rule.

**Why:** A database that refuses bad data can be trusted by every program that uses it. Review: [Creating Tables](/lessons/sqlite3/create-table), [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints), [Type Affinity and STRICT Tables](/lessons/sqlite3/type-affinity), and [Designing a Database](/lessons/sqlite3/database-design).

### 2. Realistic sample data

Fill the tables with `INSERT` statements, naming the columns each time:

- at least **8 books**, some with several copies;
- at least **5 members**, including one who has never borrowed anything;
- at least **10 loans**, including returned loans, loans still out, and at least two that are **overdue** as of `'2026-09-29'`.

Store every date as `'YYYY-MM-DD'` text.

**Why:** Reports are only as good as the data you test them on. Data that covers the tricky cases (a member with no loans, an overdue book) is how you find out whether your queries really work. Review: [INSERT, UPDATE, and DELETE](/lessons/sqlite3/insert-update-delete) and [Dates and Times in SQLite](/lessons/sqlite3/dates-and-times).

### 3. The librarian's reports

Write one query for each report:

- **a. Out right now:** every loan not yet returned, with the book's title, the member's name, and the due date, soonest first.
- **b. Overdue:** loans still out whose due date is before `'2026-09-29'`, with how many days late each one is, most overdue first.
- **c. Most popular:** the three most-borrowed books, with how many times each was borrowed.
- **d. Never borrowed:** the names of members who have never borrowed a book.
- **e. Monthly activity:** the number of loans made in each month.
- **f. On the shelf:** every book with its copies owned, copies out now, and copies on the shelf, calculated from the loans. Books with nothing out must still appear.

**Why:** These are the questions a real library asks every day, and between them, they use nearly everything in SQL Foundations. Review: [Filtering Rows with WHERE](/lessons/sqlite3/where), [Sorting and Limiting Results](/lessons/sqlite3/order-by-and-limit), [Grouping with GROUP BY and HAVING](/lessons/sqlite3/group-by), [Combining Tables with JOIN](/lessons/sqlite3/joins), and [Dates and Times in SQLite](/lessons/sqlite3/dates-and-times).

### 4. A change that happens all at once

A member returns a book, and another member borrows it straight away. Write that as **one transaction**: mark the old loan returned, and insert the new loan with a due date 14 days later, using `date(...)`. Then show every loan of that book.

**Why:** A book can't be returned-but-not-yet-lent in the records, even for a moment. Review: [Transactions](/lessons/sqlite3/transactions).

### 5. Fast lookups

Add indexes on `loans.book_id` and `loans.member_id`, the columns every join uses. Then use `EXPLAIN QUERY PLAN` to show that a query looking up one member's loans uses your index.

**Why:** On a real library with years of loans, those joins run constantly. Review: [Indexes and Query Speed](/lessons/sqlite3/indexes).

### 6. Clean, readable SQL

- Consistent names: lowercase, plural tables, `_id` foreign keys.
- Keywords in capitals, one clause per line, and a comment above each part.
- Every column listed in every `INSERT` and every report; no `SELECT *` in the reports.

**Why:** A SQL file is code like any other, and the next person to read it deserves the same care. Review: [Best Practices and Common Mistakes](/lessons/sqlite3/best-practices).

## Sample reports

Your data will be different, so your results will be too. But with the reference solution's data, running the file prints exactly this. Use it to check the *shape* of each report:

::: details Show the sample output
```text
+-----------------------------+--------------+------------+
|            title            |     name     |  due_date  |
+-----------------------------+--------------+------------+
| Noli Me Tangere             | Dina Lim     | 2026-09-19 |
| A Brief History of Time     | Carlo Reyes  | 2026-09-24 |
| Smaller and Smaller Circles | Ben Cruz     | 2026-09-26 |
| Noli Me Tangere             | Maria Santos | 2026-10-02 |
| Florante at Laura           | Eli Tan      | 2026-10-04 |
| Cosmos                      | Maria Santos | 2026-10-06 |
+-----------------------------+--------------+------------+
+-------------+-----------------------------+------------+-----------+
|    name     |            title            |  due_date  | days_late |
+-------------+-----------------------------+------------+-----------+
| Dina Lim    | Noli Me Tangere             | 2026-09-19 |        10 |
| Carlo Reyes | A Brief History of Time     | 2026-09-24 |         5 |
| Ben Cruz    | Smaller and Smaller Circles | 2026-09-26 |         3 |
+-------------+-----------------------------+------------+-----------+
+-------------------------+----------------+
|          title          | times_borrowed |
+-------------------------+----------------+
| Noli Me Tangere         |              4 |
| Cosmos                  |              2 |
| A Brief History of Time |              1 |
+-------------------------+----------------+
+-----------+
|   name    |
+-----------+
| Fe Garcia |
+-----------+
+---------+-------+
|  month  | loans |
+---------+-------+
| 2026-08 |     3 |
| 2026-09 |     7 |
+---------+-------+
+-----------------------------+--------------+---------+----------+
|            title            | copies_owned | out_now | on_shelf |
+-----------------------------+--------------+---------+----------+
| A Brief History of Time     |            1 |       1 |        0 |
| Cosmos                      |            1 |       1 |        0 |
| Dekada 70                   |            1 |       0 |        1 |
| Florante at Laura           |            2 |       1 |        1 |
| Noli Me Tangere             |            3 |       2 |        1 |
| Smaller and Smaller Circles |            2 |       1 |        1 |
| El Filibusterismo           |            2 |       0 |        2 |
| The Little Prince           |            2 |       0 |        2 |
+-----------------------------+--------------+---------+----------+
+----+--------------+------------+------------+---------------+
| id |     name     | loan_date  |  due_date  | returned_date |
+----+--------------+------------+------------+---------------+
|  1 | Maria Santos | 2026-08-03 | 2026-08-17 | 2026-08-15    |
|  3 | Ben Cruz     | 2026-08-20 | 2026-09-03 | 2026-09-01    |
|  5 | Dina Lim     | 2026-09-05 | 2026-09-19 | 2026-09-29    |
|  8 | Maria Santos | 2026-09-18 | 2026-10-02 |               |
| 11 | Fe Garcia    | 2026-09-29 | 2026-10-13 |               |
+----+--------------+------------+------------+---------------+
QUERY PLAN
`--SEARCH loans USING INDEX idx_loans_member_id (member_id=?)
```
:::

## Testing your database

There's no automatic checker, so you're the tester. After running your file, try each of these at the `sqlite>` prompt. **Every one should be refused with an error:**

- a member in grade 15;
- a second member with an email that's already used;
- a loan for book number 99, which doesn't exist;
- a loan whose due date is before its loan date;
- a book whose `copies_owned` is the text `'many'`;
- a book with 0 copies.

If any of them goes in without an error, a constraint is missing. (And if the foreign key test goes in, check that `PRAGMA foreign_keys = ON;` is at the top of your file.)

## Stretch goals (optional, for the ambitious)

- Stop a book from being lent when every copy is already out. A `CHECK` can't do it, because a `CHECK` only sees the row being added, not the other loans. It's a job for a **trigger**, a piece of SQL that runs automatically before each insert, so look up SQLite's `CREATE TRIGGER`.
- Create a **view** with `CREATE VIEW overdue_loans AS SELECT ...` for report b, so the librarian can just run `SELECT * FROM overdue_loans;`.
- Add an `authors` table and change `books` to use an `author_id`, then update every report to join it.
- Write a Python program, using [Using SQLite from Python](/lessons/sqlite3/sqlite-in-python), that opens `project.db` and prints the overdue report, with `?` placeholders for the date.
- Replace `'2026-09-29'` with `date('now')` everywhere, so the reports are always about today.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own work. Every "no" is just a pointer to your next improvement.

1. Does my file build the whole database from nothing, every time, with no errors?
2. Did every test in "Testing your database" get refused?
3. Is every fact stored in exactly one place, with nothing I'd ever need to update in two places?
4. Does report f include books with nothing on loan, and report d include only members with no loans at all?
5. If a book were lent 100 more times, would all my reports still be correct, with no numbers typed in by hand?
6. Could someone who's never seen my file understand each report from its comment and its formatting?
7. If I gave this database to a real school library, would I trust it with their records?

If you answered yes to all seven, you've built a real, working database design. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good developers become great ones.

## Stuck? A reference solution

Try to finish on your own first. Struggling with a problem, and then solving it, is exactly how the skill sticks. But if you're truly stuck on one part, or you've finished and want to compare, here's one complete solution. It's not the only right answer; if yours works and reads clearly, it's just as good.

::: details Show the reference solution
```sql
-- School Library Database: one reference solution.
-- Run it in a fresh database: sqlite3 project.db, then .read library_project.sql

PRAGMA foreign_keys = ON;

-- Requirement 1: the tables

CREATE TABLE books (
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL,
	author TEXT NOT NULL,
	genre TEXT NOT NULL,
	published_year INTEGER CHECK (published_year BETWEEN 1400 AND 2100),
	copies_owned INTEGER NOT NULL DEFAULT 1 CHECK (copies_owned >= 1)
) STRICT;

CREATE TABLE members (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT NOT NULL UNIQUE,
	grade INTEGER NOT NULL CHECK (grade BETWEEN 7 AND 12),
	joined TEXT NOT NULL
) STRICT;

CREATE TABLE loans (
	id INTEGER PRIMARY KEY,
	book_id INTEGER NOT NULL REFERENCES books (id),
	member_id INTEGER NOT NULL REFERENCES members (id),
	loan_date TEXT NOT NULL,
	due_date TEXT NOT NULL,
	returned_date TEXT,
	CHECK (due_date > loan_date),
	CHECK (returned_date IS NULL OR returned_date >= loan_date)
) STRICT;

-- Requirement 5: indexes on the foreign keys

CREATE INDEX idx_loans_book_id ON loans (book_id);
CREATE INDEX idx_loans_member_id ON loans (member_id);

-- Requirement 2: sample data

INSERT INTO books (title, author, genre, published_year, copies_owned) VALUES
	('Noli Me Tangere', 'Jose Rizal', 'Novel', 1887, 3),
	('El Filibusterismo', 'Jose Rizal', 'Novel', 1891, 2),
	('The Little Prince', 'Antoine de Saint-Exupery', 'Novel', 1943, 2),
	('Cosmos', 'Carl Sagan', 'Science', 1980, 1),
	('A Brief History of Time', 'Stephen Hawking', 'Science', 1988, 1),
	('Smaller and Smaller Circles', 'F. H. Batacan', 'Mystery', 2002, 2),
	('Florante at Laura', 'Francisco Balagtas', 'Poetry', 1838, 2),
	('Dekada 70', 'Lualhati Bautista', 'Novel', 1983, 1);

INSERT INTO members (name, email, grade, joined) VALUES
	('Maria Santos', 'maria@example.com', 11, '2025-06-10'),
	('Ben Cruz', 'ben@example.com', 10, '2025-06-12'),
	('Carlo Reyes', 'carlo@example.com', 11, '2025-07-01'),
	('Dina Lim', 'dina@example.com', 9, '2026-01-15'),
	('Eli Tan', 'eli@example.com', 12, '2026-02-20'),
	('Fe Garcia', 'fe@example.com', 8, '2026-08-03');

INSERT INTO loans (book_id, member_id, loan_date, due_date, returned_date) VALUES
	(1, 1, '2026-08-03', '2026-08-17', '2026-08-15'),
	(4, 3, '2026-08-10', '2026-08-24', '2026-08-30'),
	(1, 2, '2026-08-20', '2026-09-03', '2026-09-01'),
	(3, 1, '2026-09-01', '2026-09-15', '2026-09-14'),
	(1, 4, '2026-09-05', '2026-09-19', NULL),
	(5, 3, '2026-09-10', '2026-09-24', NULL),
	(6, 2, '2026-09-12', '2026-09-26', NULL),
	(1, 1, '2026-09-18', '2026-10-02', NULL),
	(7, 5, '2026-09-20', '2026-10-04', NULL),
	(4, 1, '2026-09-22', '2026-10-06', NULL);

.mode table

-- Requirement 3a: every book that's out right now

SELECT
	b.title,
	m.name,
	l.due_date
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN members m ON l.member_id = m.id
WHERE l.returned_date IS NULL
ORDER BY l.due_date, b.title;

-- Requirement 3b: overdue loans, as of 2026-09-29

SELECT
	m.name,
	b.title,
	l.due_date,
	CAST(julianday('2026-09-29') - julianday(l.due_date) AS INTEGER) AS days_late
FROM loans l
JOIN books b ON l.book_id = b.id
JOIN members m ON l.member_id = m.id
WHERE l.returned_date IS NULL
	AND l.due_date < '2026-09-29'
ORDER BY days_late DESC;

-- Requirement 3c: the three most-borrowed books

SELECT
	b.title,
	COUNT(l.id) AS times_borrowed
FROM books b
LEFT JOIN loans l ON l.book_id = b.id
GROUP BY b.id, b.title
ORDER BY times_borrowed DESC, b.title
LIMIT 3;

-- Requirement 3d: members who have never borrowed a book

SELECT m.name
FROM members m
LEFT JOIN loans l ON l.member_id = m.id
WHERE l.id IS NULL
ORDER BY m.name;

-- Requirement 3e: loans per month

SELECT
	strftime('%Y-%m', loan_date) AS month,
	COUNT(*) AS loans
FROM loans
GROUP BY month
ORDER BY month;

-- Requirement 3f: copies on the shelf right now

SELECT
	b.title,
	b.copies_owned,
	COUNT(l.id) AS out_now,
	b.copies_owned - COUNT(l.id) AS on_shelf
FROM books b
LEFT JOIN loans l
	ON l.book_id = b.id
	AND l.returned_date IS NULL
GROUP BY b.id, b.title, b.copies_owned
ORDER BY on_shelf, b.title;

-- Requirement 4: Dina returns Noli Me Tangere, and Fe borrows it, as one change

BEGIN;
UPDATE loans SET returned_date = '2026-09-29' WHERE id = 5;
INSERT INTO loans (book_id, member_id, loan_date, due_date)
VALUES (1, 6, '2026-09-29', date('2026-09-29', '+14 days'));
COMMIT;

SELECT l.id, m.name, l.loan_date, l.due_date, l.returned_date
FROM loans l
JOIN members m ON l.member_id = m.id
WHERE l.book_id = 1
ORDER BY l.loan_date;

-- Requirement 5: check that the indexes are used

EXPLAIN QUERY PLAN
SELECT * FROM loans WHERE member_id = 1;
```
:::

## Check your understanding

<Quiz
	question="Why does the project&#39;s books table have no copies_on_loan column?"
	:options="['SQLite cannot store it', 'It would make the table too wide', 'Columns cannot be calculated', 'The loans table already records which copies are out, so storing it again would mean one fact in two places']"
	:answer-index="3"
	explanation="Report f calculates copies out from the open loans. A stored copy could drift out of step with them."
/>

<Quiz
	question="Report f must include books with nothing on loan. Which join makes that work?"
	:options="['An inner JOIN on loans', 'A LEFT JOIN from books to loans, with the returned_date condition inside ON', 'A CROSS JOIN', 'No join is needed']"
	:answer-index="1"
	explanation="LEFT JOIN keeps every book. Putting returned_date IS NULL in the ON, not the WHERE, keeps books whose loans are all returned, too."
/>

<Quiz
	question="You try to add a loan for book 99, and it goes in without an error. What is the most likely cause?"
	:options="['Book 99 exists', 'The loans table is STRICT', 'PRAGMA foreign_keys = ON; is missing, so SQLite isn\'t checking foreign keys', 'Foreign keys only work in MySQL']"
	:answer-index="2"
	explanation="SQLite ignores foreign keys unless the pragma is on for the connection. Put it at the top of every file and program."
/>

## Where you go from here

You've finished the SQLite3 track. Take a moment with that. You started with a single `SELECT`, and you've just designed a complete, well-guarded database and written the reports that make it useful.

Everything in SQL Foundations works in every major database, so the doors are wide open. The [MySQL track](/lessons/mysql/coming-from-sqlite) and the [Oracle Database track](/lessons/oracle-database/coming-from-sqlite) both start from exactly where you are now, and only teach what's different: running a database server, users and permissions, and, in Oracle's case, a whole programming language inside the database. And if you've taken the [Python track](/lessons/python/intro-to-python), you can already build programs that keep their data in SQLite.

Whichever way you go, the ideas you've learned here, tables and keys, one fact in one place, joins, and the habit of checking a `SELECT` before you change anything, will travel with you into every database you ever use. Well done.
