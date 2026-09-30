---
title: "SQL Indexes: Make Queries Faster with CREATE INDEX"
description: "Learn how database indexes speed up searches, create them with CREATE INDEX, check whether a query uses one with EXPLAIN QUERY PLAN, and know their costs."
---

# Indexes and Query Speed

*To find "photosynthesis" in a textbook, you don't read all 400 pages. You flip to the index at the back, which sends you straight to page 212.*

With six books, every query is instant. But real tables grow: a school library might have 50,000 books, and a large website's database might have millions of rows in a single table. To answer `WHERE title = 'Cosmos'` on a table like that, a database with no help has to look at **every single row**, one by one.

An **index** is how you help. It's a separate, sorted lookup structure that lets the database jump straight to the rows it needs.

## The index at the back of the book

Picture a 400-page biology textbook with no index. To find every mention of "photosynthesis," you'd have to read the whole thing, cover to cover. Now picture the same book with an index at the back: an alphabetical list of topics, each with the pages it appears on. You flip to P, find "photosynthesis: 212, 215," and turn straight there.

A database index is exactly that. It's an extra, sorted list of one column's values, each pointing to the rows that contain it. Searching a sorted list is dramatically faster than reading every row, the same way finding a word in an alphabetical list beats reading a whole book.

## Seeing what the database does: `EXPLAIN QUERY PLAN`

You can ask SQLite *how* it plans to run a query, without running it, by putting `EXPLAIN QUERY PLAN` in front:

```sql
EXPLAIN QUERY PLAN
SELECT * FROM books WHERE author = 'Carl Sagan';
```

```text
QUERY PLAN
`--SCAN books
```

`SCAN books` means "read through every row of `books`." That's the whole-book reading. On six rows, it doesn't matter. On six million, it's slow.

## Creating an index

To give `author` an index, use `CREATE INDEX`, with a name for the index, the table, and the column:

```sql
CREATE INDEX idx_books_author ON books (author);

EXPLAIN QUERY PLAN
SELECT * FROM books WHERE author = 'Carl Sagan';
```

```text
QUERY PLAN
`--SEARCH books USING INDEX idx_books_author (author=?)
```

Now the plan says `SEARCH ... USING INDEX`: instead of reading every row, SQLite looks up `'Carl Sagan'` in the sorted index, and jumps straight to the matching rows.

A few things worth noticing:

- **The query didn't change.** You never mention an index in a `SELECT`. The database decides for itself when an index would help, and uses it automatically.
- **The name is up to you.** A common pattern is `idx_` plus the table and column names, so you can tell at a glance what each index is for.
- **An index doesn't change results.** A query gives exactly the same answer with or without one; only the speed differs.

## Indexes you already have

You've actually been using indexes all along. Every **primary key** has one automatically, which is why looking up a row by its `id` is always fast:

```sql
EXPLAIN QUERY PLAN
SELECT * FROM books WHERE id = 5;
```

```text
QUERY PLAN
`--SEARCH books USING INTEGER PRIMARY KEY (rowid=?)
```

**`UNIQUE`** columns, from [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints), get an index automatically too, because the database needs one to check quickly whether a value is already taken.

## Which columns deserve an index?

Indexes help most on columns you **search, join, or sort by often**, in tables that are large:

- **Foreign key columns**, like `loans.member_id` and `loans.book_id`. They're used in every join, and SQLite doesn't index them automatically.
- Columns that appear often in **`WHERE`**, like a member's email when they log in.
- Columns used in **`ORDER BY`** on big tables, since the index is already sorted.

```sql
CREATE INDEX idx_loans_member ON loans (member_id);

EXPLAIN QUERY PLAN
SELECT m.name, l.due_date
FROM members m
JOIN loans l ON l.member_id = m.id
WHERE m.id = 1;
```

```text
QUERY PLAN
|--SEARCH m USING INTEGER PRIMARY KEY (rowid=?)
`--SEARCH l USING INDEX idx_loans_member (member_id=?)
```

Both tables are now searched, not scanned: the member by its primary key, and their loans with the new index.

## Indexes aren't free

If indexes make reading faster, why not index every column? Because each one has a cost:

- **Slower changes.** Every `INSERT`, `UPDATE`, and `DELETE` has to update each index on the table, as well as the table itself. A table with ten indexes does eleven jobs for every new row.
- **More space.** Each index is extra data stored in the database file.
- **Little help on small tables.** Reading a few hundred rows is already fast; the index just adds work.

The rule of thumb: add an index when a real query on a real, large table is slow, and check with `EXPLAIN QUERY PLAN` that it's actually used. Don't add them "just in case."

## An index over several columns

An index can cover more than one column. It's sorted by the first column, then by the second within that, like a phone book sorted by last name, then first name:

```sql
CREATE INDEX idx_loans_member_due ON loans (member_id, due_date);

EXPLAIN QUERY PLAN
SELECT * FROM loans WHERE member_id = 2 ORDER BY due_date;
```

```text
QUERY PLAN
`--SEARCH loans USING INDEX idx_loans_member_due (member_id=?)
```

Because the index is already sorted by `due_date` within each member, SQLite can use it for the search *and* the sorting. The column order matters, though: this index helps a search on `member_id` alone, but not one on `due_date` alone, just as a phone book sorted by last name doesn't help you find everyone named "Maria."

## Removing an index

If an index turns out not to help, remove it with `DROP INDEX`. The table and its data aren't affected:

```sql
DROP INDEX IF EXISTS idx_books_author;
```

## Try it

This builds a small table of students, then shows how SQLite plans the same query before and after an index is added, plus a query the index can't help with. Predict each plan: will it say `SCAN` or `SEARCH`?

<CodeEditor
	language="plaintext"
	label="SQL practice editor, indexes.sql"
	min-height="400px"
	:model-value="'CREATE TABLE students (id INTEGER PRIMARY KEY, email TEXT, last_name TEXT, first_name TEXT);\n\nINSERT INTO students (email, last_name, first_name) VALUES\n\t(\'maria@example.com\', \'Santos\', \'Maria\'),\n\t(\'ben@example.com\', \'Cruz\', \'Ben\'),\n\t(\'carlo@example.com\', \'Reyes\', \'Carlo\');\n\n-- Plan 1: before any index\nEXPLAIN QUERY PLAN SELECT * FROM students WHERE email = \'ben@example.com\';\n\nCREATE UNIQUE INDEX idx_students_email ON students (email);\nCREATE INDEX idx_students_name ON students (last_name, first_name);\n\n-- Plan 2: the same query, after\nEXPLAIN QUERY PLAN SELECT * FROM students WHERE email = \'ben@example.com\';\n\n-- Plan 3: searching by first name only\nEXPLAIN QUERY PLAN SELECT * FROM students WHERE first_name = \'Maria\';\n'"
/>

`CREATE UNIQUE INDEX` makes an index that also refuses duplicate values, like a `UNIQUE` constraint.

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3` and paste them in.
:::

::: details Check your prediction
```text
QUERY PLAN
`--SCAN students
QUERY PLAN
`--SEARCH students USING INDEX idx_students_email (email=?)
QUERY PLAN
`--SCAN students
```

Plan 1 scans every row. Plan 2 searches using the new email index. Plan 3 is back to a scan: the name index is sorted by `last_name` first, so it can't help find a first name on its own, just like the phone book.
:::

## Try it yourself

1. In your library database, create an index on `loans.book_id`, then check a join between `books` and `loans` with `EXPLAIN QUERY PLAN`.
2. Run `EXPLAIN QUERY PLAN SELECT * FROM books WHERE title LIKE '%the%';`. Would an index on `title` help a search that starts with `%`? (Try it and see.)
3. Name two columns in a school's `students` table that deserve an index, and one that probably doesn't.

## Check your understanding

<Quiz
	question="What does an index do?"
	:options="['Changes the results of queries', 'Stores a sorted lookup of a column, so the database can find matching rows without reading every row', 'Deletes duplicate rows', 'Backs up the table']"
	:answer-index="1"
	explanation="An index is like the index at the back of a book: a sorted list that points straight to where each value appears."
/>

<Quiz
	question="EXPLAIN QUERY PLAN shows SCAN books. What does that mean?"
	:options="['The query uses an index', 'SQLite will read through every row of books', 'The query failed', 'The table is empty']"
	:answer-index="1"
	explanation="SCAN means a full read of the table. SEARCH ... USING INDEX means an index is used to jump to matching rows."
/>

<Quiz
	question="Why not put an index on every column?"
	:options="['SQLite only allows one index per table', 'Indexes make SELECT slower', 'Indexes change query results', 'Each index slows down inserts, updates, and deletes, and takes extra space']"
	:answer-index="3"
	explanation="Every change has to update every index too. Add indexes where queries need them, not everywhere."
/>

## Up next

Some changes need several steps to happen together, or not at all, like moving a book from one member to another. Next, you'll learn how to group statements so they succeed or fail as one, in [Transactions](/lessons/sqlite3/transactions).
