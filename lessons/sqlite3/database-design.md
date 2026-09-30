---
title: "Database Design and Normalization for Beginners"
description: "Design a database that stays correct: spot repeated data, split it into related tables, store each fact once, and model one-to-many and many-to-many relationships."
---

# Designing a Database: Normalization

*If every page of a class notebook repeats the teacher's phone number, then when it changes, you have forty pages to fix, and you'll miss one.*

You can now create tables, fill them, and protect them with constraints. The harder question is which tables to create in the first place. Put everything in one big table, and it's easy to start with but quietly breaks later. Split things up well, and the database stays correct for years.

The process of organizing tables so that each fact is stored exactly once is called **normalization**. It sounds technical, but the idea at its heart is simple.

## The phone number on every page

Imagine a class notebook where, at the top of every page of notes, you copy out the teacher's name, room number, and phone number. It feels helpful at first: the information is right there on every page.

Then the teacher moves to a new room. Now forty pages are wrong. You fix thirty-eight and miss two. Which room is right? Your notebook now disagrees with itself.

The better way: write the teacher's details **once**, on the inside cover, and on each page just write "see cover." One fact, one place. That's normalization.

## A table that repeats itself

Here's the library's loans, stored the tempting way: one big table with everything in it.

```sql
CREATE TABLE loans_flat (
	loan_id INTEGER PRIMARY KEY,
	member_name TEXT,
	member_grade INTEGER,
	book_title TEXT,
	book_author TEXT,
	due_date TEXT
);
INSERT INTO loans_flat VALUES
	(1, 'Maria Santos', 11, 'Noli Me Tangere', 'Jose Rizal', '2026-09-15'),
	(2, 'Ben Cruz', 10, 'Noli Me Tangere', 'Jose Rizal', '2026-09-26'),
	(3, 'Maria Santos', 11, 'The Little Prince', 'Antoine de Saint-Exupery', '2026-09-29');
SELECT * FROM loans_flat;
```

```text
+---------+--------------+--------------+-------------------+--------------------------+------------+
| loan_id | member_name  | member_grade |    book_title     |       book_author        |  due_date  |
+---------+--------------+--------------+-------------------+--------------------------+------------+
|       1 | Maria Santos |           11 | Noli Me Tangere   | Jose Rizal               | 2026-09-15 |
|       2 | Ben Cruz     |           10 | Noli Me Tangere   | Jose Rizal               | 2026-09-26 |
|       3 | Maria Santos |           11 | The Little Prince | Antoine de Saint-Exupery | 2026-09-29 |
+---------+--------------+--------------+-------------------+--------------------------+------------+
```

It's easy to read, and easy to query. But look at what's repeated: Maria's name and grade appear twice, and so do *Noli Me Tangere* and its author. That repetition causes three classic problems.

## Three things that go wrong

**1. Updates miss copies.** Maria moves up to grade 12. Someone fixes one row but not the other:

```sql
CREATE TABLE loans_flat (loan_id INTEGER PRIMARY KEY, member_name TEXT, member_grade INTEGER, book_title TEXT);
INSERT INTO loans_flat VALUES (1, 'Maria Santos', 11, 'Noli Me Tangere'), (3, 'Maria Santos', 11, 'The Little Prince');
UPDATE loans_flat SET member_grade = 12 WHERE loan_id = 1;
SELECT DISTINCT member_name, member_grade FROM loans_flat;
```

```text
+--------------+--------------+
| member_name  | member_grade |
+--------------+--------------+
| Maria Santos |           12 |
| Maria Santos |           11 |
+--------------+--------------+
```

Now the database says Maria is in grade 11 *and* grade 12. It can't be trusted.

**2. You can't record something on its own.** A new member joins but hasn't borrowed anything yet. Where do they go? Every row in `loans_flat` is a loan, so there's nowhere to store a member without inventing a fake loan.

**3. Deleting one thing deletes another.** Ben returns his only book, and his loan row is deleted. His name and grade vanish with it; the library has forgotten he's a member.

All three problems come from the same cause: **facts about different things were mixed into one table.**

## Splitting it up

The fix is to give each *kind of thing* its own table, and connect them with keys:

- a **`members`** table: one row per member, with their name and grade, stored once;
- a **`books`** table: one row per book, with its title and author, stored once;
- a **`loans`** table: one row per loan, holding just the loan's own facts (its due date) and **keys** pointing to the member and the book.

That's exactly how the library database from [Your First Queries](/lessons/sqlite3/first-queries) is built. Maria's grade is stored in one place, in `members`, so updating it once updates it everywhere. A member with no loans simply has no rows in `loans`. And deleting a loan doesn't touch the member or the book.

The flat view is still one query away, with the joins from [Combining Tables with JOIN](/lessons/sqlite3/joins):

```sql
SELECT l.id AS loan_id, m.name AS member_name, m.grade AS member_grade, b.title AS book_title, l.due_date
FROM loans l
JOIN members m ON l.member_id = m.id
JOIN books b ON l.book_id = b.id
WHERE l.id <= 3;
```

```text
+---------+--------------+--------------+-------------------+------------+
| loan_id | member_name  | member_grade |    book_title     |  due_date  |
+---------+--------------+--------------+-------------------+------------+
|       1 | Maria Santos |           11 | Noli Me Tangere   | 2026-09-15 |
|       2 | Ben Cruz     |           10 | Noli Me Tangere   | 2026-09-26 |
|       3 | Maria Santos |           11 | The Little Prince | 2026-09-29 |
+---------+--------------+--------------+-------------------+------------+
```

That's the key idea: **store data normalized, and join it back together when you want to read it.**

## The rules, in plain words

Database textbooks describe normalization as a series of **normal forms**, with names like "first normal form." Here's what the first three ask for, in plain language:

1. **One value per cell.** Never put a list in a column, like `clubs = 'Chess, Robotics'`. You can't search it or count it properly. Make a separate table with one row per item instead.
2. **Every column is about the whole key.** In a table whose key is (student, club), a column like `student_grade` describes only the student, not the membership. It belongs in the `students` table.
3. **No column is about another non-key column.** If a `books` table has `author_name` and `author_birth_year`, the birth year is about the *author*, not the book. If authors matter, give them their own table.

You don't need to memorize the numbers. Ask one question of every column: **"Is this a fact about the thing this table is about?"** If not, it belongs somewhere else.

## Kinds of relationships

When you split tables, you're really describing how things relate. There are three kinds:

- **One-to-many.** One member has many loans, but each loan belongs to one member. Put the key on the "many" side: `loans.member_id`. This is by far the most common kind.
- **Many-to-many.** A student can join many clubs, and a club has many students. Neither table can hold the other's key, so add a third **link table**, like `memberships (student_id, club_id)`, from [Combining Tables with JOIN](/lessons/sqlite3/joins).
- **One-to-one.** One student has one locker assignment. Often these just go in the same table; a separate table makes sense when the extra details are optional or private.

## A design checklist

When you design a new database:

1. **List the things** your app keeps track of: members, books, loans. Each usually becomes a table.
2. **List each thing's facts.** Each fact becomes a column in that thing's table.
3. **Give every table a primary key**, usually an automatic `id`.
4. **Connect related tables** with foreign keys: one-to-many with a key column, many-to-many with a link table.
5. **Add constraints:** `NOT NULL` where a value is required, `UNIQUE`, `CHECK`, and foreign keys, from [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints).
6. **Check for repetition.** If you'd ever have to update the same fact in two places, split it out.

## Is repetition ever OK?

Yes, sometimes, on purpose. Very busy systems occasionally store a calculated or copied value, like a running total, to avoid expensive joins, and accept the extra work of keeping it correct. That's called **denormalization**. The library's `copies_on_loan` column is actually an example: it could be worked out by counting open loans, and it could drift out of step with them. For learning, and for most apps, start normalized, and only break the rules when you've measured a real need.

## Try it

A school stores its class schedule in one flat table. The editor builds it, then runs two queries that show a problem hiding in it. Predict each result, and spot the problem.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, design.sql"
	min-height="420px"
	:model-value="'CREATE TABLE schedule (\n\tclass TEXT,\n\tteacher TEXT,\n\tteacher_room TEXT,\n\tperiod INTEGER\n);\n\nINSERT INTO schedule VALUES\n\t(\'Biology 11-A\', \'Ms. Reyes\', \'Room 204\', 1),\n\t(\'Biology 11-B\', \'Ms. Reyes\', \'Room 204\', 3),\n\t(\'Chemistry 12\', \'Mr. Tan\', \'Room 110\', 2),\n\t(\'Biology 12\', \'Ms. Reyes\', \'Room 205\', 4);\n\n-- Query 1: where is Ms. Reyes\'s room?\nSELECT DISTINCT teacher_room FROM schedule WHERE teacher = \'Ms. Reyes\';\n\n-- Query 2: how many classes does each teacher have?\nSELECT teacher, COUNT(*) AS classes FROM schedule GROUP BY teacher;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+--------------+
| teacher_room |
+--------------+
| Room 204     |
| Room 205     |
+--------------+
+-----------+---------+
|  teacher  | classes |
+-----------+---------+
| Mr. Tan   |       1 |
| Ms. Reyes |       3 |
+-----------+---------+
```

Query 1 finds **two** rooms for Ms. Reyes, because her room is stored on every class row and one copy was typed differently. Which one is right? The table can't say. The fix is a `teachers` table (id, name, room), with `schedule` storing just a `teacher_id`. Then her room lives in exactly one place.
:::

## Try it yourself

1. Sketch the normalized version of the schedule: which tables, which columns, and which keys?
2. Create your tables, fill them with the same four classes, and write a join that shows each class with its teacher's room.
3. A table stores `order_id, customer_name, customer_address, product_name, product_price, quantity`. Which columns are facts about something other than the order? How would you split it?

## Check your understanding

<Quiz
	question="What is the main goal of normalization?"
	:options="['To make tables as wide as possible', 'To use fewer tables', 'To store each fact in exactly one place, so the data can\'t disagree with itself', 'To make queries shorter']"
	:answer-index="2"
	explanation="When each fact lives in one place, updates happen once, and there are no copies to fall out of step."
/>

<Quiz
	question="Students can join many clubs, and clubs have many students. How do you store that?"
	:options="['A link table with a student_id and a club_id in each row', 'A clubs column in students, listing the clubs', 'A students column in clubs', 'One big table with every student and club combined']"
	:answer-index="0"
	explanation="Many-to-many relationships need a third table, where each row links one student to one club."
/>

<Quiz
	question="A member's grade is stored on every one of their loan rows. What goes wrong?"
	:options="['Nothing, it is a good design', 'Loans cannot be counted', 'The table cannot have a primary key', 'Updating the grade can miss some rows, so the database disagrees with itself']"
	:answer-index="3"
	explanation="Repeated facts lead to update problems. The grade belongs in the members table, stored once."
/>

## Up next

Your tables are well designed. As they grow to thousands or millions of rows, though, some queries start to slow down. Next, you'll see how databases find rows fast, and how to help them, in [Indexes and Query Speed](/lessons/sqlite3/indexes).
