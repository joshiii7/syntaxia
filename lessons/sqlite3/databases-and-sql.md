---
title: "What Is a Database? Tables, Rows, Columns, and SQL"
description: "Learn how a relational database is organized into tables, rows, and columns, how tables connect through keys, and what kinds of instructions SQL gives."
---

# Databases, Tables, and SQL

*A school office has a filing cabinet for students, one for books, and one for who borrowed what. Every drawer is organized the same way, so anything can be found in seconds.*

In [What Is SQLite?](/lessons/sqlite3/introduction), you saw that a database is a program built for storing information and finding it again fast. Before you write any real SQL, it's worth understanding how a database organizes its information, because every query you'll ever write follows from it.

## A very organized filing cabinet

Picture a school library's records. The librarian keeps three filing cabinets:

- one with a card for every **book**: title, author, year;
- one with a card for every **member**: name, grade level;
- one with a card for every **loan**: which book, which member, and when it's due.

Every card in the books cabinet has exactly the same boxes to fill in, in the same order. That's what makes the cabinet fast to search: to find every book from before 1950, you only ever look at one box on each card.

A **relational database**, the kind SQLite, MySQL, and Oracle all are, organizes information exactly like those cabinets.

## Tables, rows, and columns

- A **table** is one filing cabinet: all the information about one kind of thing. A library database might have a `books` table, a `members` table, and a `loans` table.
- A **column** is one of the boxes on the card. Every row has the same columns, and each column holds one kind of information, like `title` or `published_year`.
- A **row** is one card: all the information about one book, one member, or one loan.

Here's part of a `books` table:

```text
+----+-------------------+------------+----------------+
| id |       title       |   author   | published_year |
+----+-------------------+------------+----------------+
|  1 | Noli Me Tangere   | Jose Rizal |           1887 |
|  2 | El Filibusterismo | Jose Rizal |           1891 |
|  5 | Cosmos            | Carl Sagan |           1980 |
+----+-------------------+------------+----------------+
```

Three rows, four columns. It looks like a spreadsheet, and in some ways it is one. But a database table has rules a spreadsheet doesn't:

- Each column has a **name** and holds one **type** of data. You'd never put a title in the `published_year` column.
- There are no merged cells, no notes in the margins, no blank rows used for spacing. Every row follows the same shape.
- Rows have no fixed order. You ask for them in whatever order you want, every time.

Those rules make databases a little stricter than spreadsheets, and a lot more powerful: a database can search millions of rows in a moment, let many programs use the same data safely, and keep that data correct.

## Keys: giving every row a name

Notice the `id` column. Two books could have the same title, or even the same title *and* author (think of two different editions). So how do you point to exactly one book?

You give every row its own unique number, called a **primary key**. No two rows in the table ever share one. Book 5 is Cosmos, always, and only Cosmos.

## Relationships: tables that point to each other

Here's where "relational" comes from. The `loans` table doesn't copy out the whole title and the member's full name for every loan. It just stores the **keys**:

```text
+----+---------+-----------+------------+
| id | book_id | member_id |  due_date  |
+----+---------+-----------+------------+
|  2 |       1 |         2 | 2026-09-26 |
|  3 |       3 |         1 | 2026-09-29 |
+----+---------+-----------+------------+
```

Loan 2 says "book 1 was lent to member 2." To find out that means *Noli Me Tangere* lent to *Ben Cruz*, you look up book 1 in the `books` table and member 2 in the `members` table. A column that points to another table's primary key like this is called a **foreign key**.

Why not just write the title into every loan? Because if a title had a typo, you'd have to fix it on every loan card, and if you missed one, the records would disagree. Storing each fact in exactly one place, and pointing to it everywhere else, keeps a database correct. You'll learn how to combine the tables back together with [joins](/lessons/sqlite3/joins), and how to design tables like this in [Designing a Database](/lessons/sqlite3/database-design).

## What SQL does

You talk to a database with SQL. Each instruction is called a **statement**, ends with a semicolon, and does one of a few kinds of jobs:

| Job | Main statements | Example |
|---|---|---|
| **Ask questions** | `SELECT` | "Which books were published before 1950?" |
| **Change data** | `INSERT`, `UPDATE`, `DELETE` | "Add a new member." "Mark this loan returned." |
| **Change the structure** | `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE` | "Make a new table for authors." |

A question is called a **query**, which is where SQL's name comes from: Structured **Query** Language. You'll spend most of your time writing queries, which is why the SQL Foundations chapter starts with them.

## Saying what, not how

SQL is different from the programming languages on Syntaxia, like [Python](/lessons/python/intro-to-python) or [Java](/lessons/java/introduction), in one important way. In those languages, you write the **steps**: loop through the list, check each item, add the matches to a new list.

In SQL, you describe **what you want**, and the database works out how to get it:

```sql
SELECT title FROM books WHERE published_year < 1950;
```

There's no loop, and no instructions about where to look first. You say "the titles of books published before 1950," and the database figures out the fastest way to find them. This style is called **declarative**, and it's why short SQL queries can do so much work.

## Try it

This builds a tiny `members` table and asks it one question. Read the statements, and predict what the query returns before you check.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, members.sql"
	min-height="260px"
	:model-value="'CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER);\n\nINSERT INTO members VALUES\n\t(1, \'Maria Santos\', 11),\n\t(2, \'Ben Cruz\', 10),\n\t(3, \'Carlo Reyes\', 11),\n\t(4, \'Dina Lim\', 9);\n\nSELECT name FROM members WHERE grade = 11;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. Once SQLite is installed (see [Setting Up](/lessons/sqlite3/setting-up)), you'll be able to run them yourself.
:::

::: details Check your prediction
```text
+--------------+
|     name     |
+--------------+
| Maria Santos |
| Carlo Reyes  |
+--------------+
```

The table has four rows, but the query only asked for the `name` column of rows where `grade` is 11. Two members match. Their `id` and `grade` aren't shown, because the query didn't ask for them.
:::

## Try it yourself

1. How would you change the query to show the names of every member, whatever their grade?
2. Sketch a `teachers` table on paper. What columns would it need, and which one would be its primary key?
3. A school wants to record which teacher teaches which class. Would you store the teacher's full name in the classes table, or something else? Why?

## Check your understanding

<Quiz
	question="In a database table, what is a row?"
	:options="['One kind of information, like title', 'All the information about one thing, like one book', 'The name of the table', 'A SQL statement']"
	:answer-index="1"
	explanation="A row is one record, like one card in a filing cabinet. A column is one kind of information that every row has."
/>

<Quiz
	question="What is a primary key?"
	:options="['The first column in any table', 'A column whose value is unique for every row, so each row can be pointed to', 'A password for the database', 'The longest column']"
	:answer-index="1"
	explanation="A primary key, like id, identifies exactly one row. No two rows in the table share one."
/>

<Quiz
	question="Why does a loans table store book_id instead of the book's title?"
	:options="['Titles are too long for databases', 'IDs are more secure', 'SQL cannot store text', 'So each fact lives in one place: fix a title once, and every loan stays correct']"
	:answer-index="3"
	explanation="Pointing to the book's key avoids copying the title everywhere, so the data can never disagree with itself."
/>

## Up next

Enough theory. Time to install SQLite on your own computer and open your first database, in [Setting Up](/lessons/sqlite3/setting-up).
