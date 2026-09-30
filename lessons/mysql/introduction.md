---
title: "What Is MySQL? An Introduction to the MySQL Database"
description: "Find out what MySQL is, where it came from, why it powers so much of the web, and how its release versions work, before you install it and write your first query."
---

# What MySQL Is and Why It's Used

*Every big website has a back room where its information lives: accounts, orders, posts, prices. MySQL is one of the most popular back rooms in the world.*

Welcome to the MySQL track. If you've worked through the [SQLite3 track](/lessons/sqlite3/introduction), you already know SQL: how to read data with `SELECT`, change it, join tables, and design a database. This track builds on that. It teaches what's special about **MySQL**, a database that runs as a server, and how to use it for real applications.

If you haven't done the SQLite3 track's **SQL Foundations** chapter yet, start with [SELECT: Reading Data](/lessons/sqlite3/select). This track doesn't repeat those basics.

## What is MySQL?

**MySQL** is a **relational database management system**, or RDBMS: software that stores data in tables (rows and columns), and lets you work with it using SQL. It's free and open source (under the GPL, with a paid commercial edition too), and it runs on Windows, macOS, and Linux.

As you learned in [From SQLite to MySQL](/lessons/mysql/coming-from-sqlite), MySQL is a **server**: a program that runs all the time, holds the data, and answers requests from many **clients** at once. That's what makes it suited to websites and apps, where hundreds of people might be reading and writing at the same moment.

## Where it came from

MySQL was created in the mid-1990s by a Swedish company, **MySQL AB**. It was named after **My**, the daughter of co-founder Michael "Monty" Widenius. The company was bought by Sun Microsystems in 2008, and Sun by Oracle in 2010. Oracle owns and develops MySQL today.

You'll also hear about **MariaDB**, a "fork" (a copy that went its own way) started by Monty after the Oracle purchase. It began nearly identical to MySQL, but the two have drifted apart over the years. Most of what you learn here transfers, but don't assume every feature does.

## Where you'll find MySQL

- **WordPress** stores all its posts, pages, and settings in MySQL (or MariaDB). It's the database behind a huge share of the web.
- Countless **PHP** applications use it, including the ones you'll build in the [PHP track](/lessons/php/introduction). Together with Linux, a web server, and PHP, it forms the classic "LAMP" stack.
- Large services, from online stores to social networks, have run on MySQL.
- Every major cloud provider offers it as a managed service.

## Why learn MySQL?

- **It's everywhere.** Many jobs involving websites, e-commerce, or PHP expect MySQL.
- **It's free**, and easy to install on your own computer.
- **The skills transfer.** The server-and-client model, users and permissions, and transactions work like other major databases, including [Oracle Database](/lessons/oracle-database/introduction).

## How MySQL versions work

MySQL releases changed recently, so it helps to know how to read a version number. At the time of writing (September 2026):

- **LTS** ("long-term support") releases are the steady, recommended choice. They get bug and security fixes for years. The current LTS is **MySQL 9.7**, released in April 2026 (9.7.2 came out in July 2026). The older **8.4 LTS** is still supported too.
- **Innovation** releases arrive every few months with new features, and are only supported until the next one. They now use **calendar versions**: **26.7** means "the July 2026 release." (That's why there's no 9.8.)

This track teaches **MySQL 9.7 LTS**. Nearly everything in it also works on 8.4. When something needs 9.x, or works differently, the lesson says so.

## Your first taste

The `SELECT` statement doesn't need a table. It can calculate and call functions, which makes it handy for trying things out. Read this query, and predict what it returns.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, hello.sql"
	min-height="200px"
	:model-value="'SELECT\n    \'Hello, MySQL!\' AS greeting,\n    2 + 3 AS sum,\n    UPPER(\'mysql\') AS shout,\n    CONCAT(\'My\', \'SQL\') AS joined,\n    LENGTH(\'MySQL\') AS letters;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once you've installed it (see [Installing MySQL Server](/lessons/mysql/setting-up)), you can run this query in the `mysql` client and check your answer.
:::

::: details Check your prediction
```text
+---------------+-----+-------+--------+---------+
| greeting      | sum | shout | joined | letters |
+---------------+-----+-------+--------+---------+
| Hello, MySQL! |   5 | MYSQL | MySQL  |       5 |
+---------------+-----+-------+--------+---------+
```

The `AS` names each column. `CONCAT` joins text, and works where SQLite's `||` doesn't, as you saw in the previous lesson.
:::

## Try it yourself

1. Change the greeting to your own name, and add a column that shows the result of `10 / 4`. What do you get?
2. Look at the `sum` column's name in the result. What would it be called if you hadn't written `AS sum`?
3. Find two websites you use. What do you think they store in a database like this one?

## Check your understanding

<Quiz
	question="What does it mean that MySQL is a server?"
	:options="['It only runs on special computers', 'It can only be used through a website', 'It runs all the time, holds the data, and answers requests from many clients at once', 'It stores data in one file that your program opens']"
	:answer-index="2"
	explanation="MySQL runs as a background program. Clients connect to it over the network, so many people and programs can share one database."
/>

<Quiz
	question="What does the version number 26.7 mean?"
	:options="['The July 2026 Innovation release, using calendar versioning', 'The 26th release of MySQL 7', 'A long-term support release from 2007', 'A beta release']"
	:answer-index="0"
	explanation="MySQL's Innovation releases now use YY.M numbers, so 26.7 is July 2026. LTS releases like 9.7 keep the older numbering."
/>

<Quiz
	question="Which release does this track teach, and why?"
	:options="['26.7, because it is the newest', '8.0, because it is the most popular', 'Any of them, because they are identical', 'MySQL 9.7 LTS, the steady, long-term supported choice']"
	:answer-index="3"
	explanation="LTS releases are the recommended choice for most people: they're supported for years, and Innovation releases only until the next one."
/>

## Up next

You know what MySQL is, and how its versions work. Now let's see how it differs from the SQLite you already know, in [Coming from SQLite](/lessons/mysql/coming-from-sqlite).
