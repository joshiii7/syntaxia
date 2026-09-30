---
title: "What Is Oracle Database? An Introduction for Beginners"
description: "Find out what Oracle Database is, where it came from, why banks, airlines, and governments run on it, how its editions and versions work, and how to run your first Oracle query."
---

# What Oracle Database Is and Why It's Used

*Behind the counter at a large bank, there's a records room where every account, every transfer, and every signature is kept safe, exactly, and for decades. Oracle Database is one of the world's most trusted records rooms.*

Welcome to the Oracle Database track. If you've worked through the [SQLite3 track](/lessons/sqlite3/introduction), you already know SQL: how to read data with `SELECT`, change it, join tables, and design a database. This track builds on that. It teaches what's special about **Oracle Database**, its habits and its extra language, **PL/SQL**, and how to use it for real work.

If you haven't done the SQLite3 track's **SQL Foundations** chapter yet, start with [SELECT: Reading Data](/lessons/sqlite3/select). This track doesn't repeat those basics.

## What is Oracle Database?

**Oracle Database** is a **relational database management system** (RDBMS): software that stores data in tables of rows and columns, and lets you work with it using SQL. It's made by the Oracle Corporation, and it's one of the oldest and most widely used databases in the world.

Like [MySQL](/lessons/mysql/introduction), Oracle is a **server**. It runs all the time, holds the data, and answers requests from many clients at once, each with its own username and permissions.

What sets Oracle apart is its reputation for **reliability, security, and scale**. It's designed for systems that can't afford to lose or corrupt data, and that must stay up around the clock.

## Where it came from

Oracle was founded in 1977 by Larry Ellison, Bob Miner, and Ed Oates. Its early years were tied to a then-new idea from IBM researchers: storing data in relational tables and querying it in a language called SQL. Oracle released one of the first commercial databases built on that idea, at the end of the 1970s, and has been improving it for more than four decades.

## Where you'll find Oracle

- **Banks and insurance companies**, where every transaction must be exact.
- **Airlines and telecom companies**, where millions of records change every minute.
- **Hospitals, universities, and governments**, holding records that must be kept safe for decades.
- **Big businesses running Oracle's own software**, like its business applications.

Oracle is less common in small websites, where free databases like [MySQL](/lessons/mysql/introduction) and SQLite are the popular choices. Many jobs in large organizations, though, expect Oracle skills, and they're often well paid.

## Why learn Oracle?

- **Real demand.** Large organizations run on it, and they need people who understand it.
- **PL/SQL.** Oracle's built-in programming language lets you write real programs that run inside the database. You'll learn it in this track.
- **It's a free download now.** You can run **Oracle AI Database Free** on your own computer, or try Oracle in your browser with a free service. [Getting an Oracle Database](/lessons/oracle-database/setting-up) shows you how.
- **The skills transfer.** SQL, transactions, users and privileges, and indexes work the same way in other big databases.

## Editions and versions

Oracle Database comes in several editions, from a free one to very large, expensive ones. This track uses the free one. At the time of writing (September 2026):

- The newest release is **Oracle AI Database 26ai**. Its earlier name was Oracle Database 23ai, and older code, books, and blog posts use that name, as well as names like 19c and 21c.
- **Oracle AI Database Free** is the no-cost edition, meant for learning, development, and small projects. It runs on Windows and Linux, and limits itself to **2 CPU threads, 2 GB of memory, and 12 GB of data**. That's plenty for everything in this track.
- Many companies still run older releases, like **19c**, so you'll meet those in the real world. This track teaches the newest release, and points out the older way wherever you're likely to run into it.

## Your first taste

Oracle comes with a sample set of tables called the **HR schema**: employees, departments, jobs, and locations for an imaginary company. You'll use it throughout this track for practice. Here are three queries against it, plus one that needs no table at all. Read them, and predict what they return.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, first_queries.sql"
	min-height="300px"
	:model-value="'SELECT COUNT(*) AS employees,\n       MIN(salary) AS lowest,\n       MAX(salary) AS highest,\n       ROUND(AVG(salary)) AS average\nFROM hr.employees;\n\nSELECT department_name\nFROM hr.departments\nORDER BY department_name\nFETCH FIRST 3 ROWS ONLY;\n\nSELECT UPPER(\'oracle\') || \' has \' || LENGTH(\'Oracle\') || \' letters\' AS shout\nFROM dual;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Oracle offers free ways to run it, including a browser-based playground called FreeSQL, and [Getting an Oracle Database](/lessons/oracle-database/setting-up) walks through your options. The HR tables are already there in FreeSQL, so you can try these queries right away.
:::

::: details Check your prediction
```text
EMPLOYEES LOWEST HIGHEST AVERAGE
--------- ------ ------- -------
      107   2100   24000    6462

DEPARTMENT_NAME
---------------
Accounting
Administration
Benefits

SHOUT
--------------------
ORACLE has 6 letters
```

The first query summarizes all 107 employees. The second sorts the department names and keeps the first three, using `FETCH FIRST`, since Oracle has no `LIMIT`. The third doesn't need a table, but older Oracle versions still need a table in `FROM`, and `DUAL` is a one-row table that exists for exactly this purpose. The `||` joins text, as in SQLite. (The exact spacing of the columns differs a little between Oracle's tools.)
:::

## Try it yourself

1. Change the second query to show the last three department names alphabetically. (Hint: `ORDER BY department_name DESC`.)
2. Add a column to the first query that shows how many employees earn more than 10,000. You'll need `COUNT(CASE WHEN ... END)`, which is standard SQL you already know.
3. Find two organizations near you that might run on a big database like Oracle. What data do they keep that could never be lost?

## Check your understanding

<Quiz
	question="What is Oracle Database best known for?"
	:options="['Being the smallest database', 'Only working on phones', 'Reliability, security, and scale for large organizations', 'Being built into web browsers']"
	:answer-index="2"
	explanation="Oracle is trusted by banks, airlines, hospitals, and governments, where data must be exact and always available."
/>

<Quiz
	question="What is Oracle AI Database Free?"
	:options="['A no-cost edition for learning and small projects, limited in CPU, memory, and data size', 'A trial that stops working after a week', 'A phone app', 'The oldest version of Oracle']"
	:answer-index="0"
	explanation="The Free edition is a real Oracle Database, limited to 2 CPU threads, 2 GB of memory, and 12 GB of data."
/>

<Quiz
	question="What is the DUAL table for?"
	:options="['Storing two copies of your data', 'Joining two tables', 'Backing up the database', 'Giving older Oracle versions a one-row table for SELECTs that do not read any real table']"
	:answer-index="3"
	explanation="Older Oracle versions need a FROM clause in every SELECT, so DUAL provides a single row to select from."
/>

## Up next

You know what Oracle is, and how it's different from a small database. Now let's see, in more detail, what changes when you move from SQLite, in [Coming from SQLite](/lessons/oracle-database/coming-from-sqlite).
