---
title: "Connecting to MySQL: The mysql Client and MySQL Workbench"
description: "Connect to your MySQL server with the mysql command-line client and MySQL Workbench: connection options, the prompt, essential commands, running script files, and vertical output."
---

# Connecting with the mysql Client and Workbench

*A library has a front desk where you ask for things. The client is how you walk up to it.*

The server is running. Now you need a way to talk to it. In this lesson, you'll meet the two tools most people use: **`mysql`**, a text-based client that comes with the server, and **MySQL Workbench**, a free visual tool.

## What a connection needs

As you learned in [Coming from SQLite](/lessons/mysql/coming-from-sqlite), every client needs four things to connect:

| Piece | What it is | Usual value on your own computer |
|---|---|---|
| Host | The server's address | `localhost` |
| Port | The door on that address | `3306` |
| Username | Who you are | `root` (for now) |
| Password | Proof of it | the one you chose during setup |

## The mysql command-line client

Open a terminal and connect:

```text
mysql -u root -p
```

`-u root` is the username, and `-p` makes the client ask for the password (it doesn't show it as you type). If your server is on another computer or another port, add `-h` and `-P` (a capital P):

```text
mysql -h db.example.com -P 3307 -u maria -p
```

You can name a database at the end, to start working in it: `mysql -u root -p school_library`.

Once connected, you'll see a welcome message and a new prompt:

```text
mysql>
```

Now you can type SQL, just as in the `sqlite3` shell. There are a few things to know:

- A statement ends with a **semicolon** `;`. If you press Enter without one, the prompt changes to `->`, meaning "I'm waiting for the rest." Type `;` to finish, or `\c` to cancel what you've typed.
- You can spread a statement over several lines, which is easier to read.
- The up-arrow key brings back earlier statements.
- Type `EXIT` (or press Ctrl + D) to leave.

## Looking around

Here are the commands you'll use all the time. Unlike `sqlite3`'s dot-commands, these are SQL-style statements:

```sql
CREATE DATABASE pet_shop;
USE pet_shop;
CREATE TABLE pets (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    species VARCHAR(30)
);
INSERT INTO pets VALUES (1, 'Bantay', 'dog'), (2, 'Mingming', 'cat');

SHOW TABLES;
DESCRIBE pets;
```

```text
+--------------------+
| Tables_in_pet_shop |
+--------------------+
| pets               |
+--------------------+
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| id      | int         | NO   | PRI | NULL    |       |
| name    | varchar(50) | YES  |     | NULL    |       |
| species | varchar(30) | YES  |     | NULL    |       |
+---------+-------------+------+-----+---------+-------+
```

- `SHOW DATABASES;` lists every database on the server. A fresh server has four of its own (`information_schema`, `mysql`, `performance_schema`, and `sys`) that hold MySQL's own bookkeeping. Leave them alone for now.
- `USE pet_shop;` picks the database to work in.
- `SHOW TABLES;` lists its tables.
- `DESCRIBE pets;` (or `DESC pets;`) shows a table's columns: name, type, whether `NULL` is allowed, and more.

## Reading wide results: \G

When a table has many columns, the results wrap and become unreadable. End a statement with `\G` **instead of** a semicolon, and MySQL prints each row vertically, one column per line:

```sql
SELECT * FROM pets WHERE id = 1\G
```

```text

```

The `1. row` line and the row of stars mark where each record starts. `\G` is a favorite of database administrators.

## Running a file of SQL

Typing long scripts by hand is tedious. Save them in a `.sql` file, and run the file in one of two ways:

- From your terminal, redirecting the file into the client: `mysql -u root -p pet_shop < setup.sql`
- From inside the client: `source setup.sql`

You can also run a single statement without opening the client, with `-e`: `mysql -u root -p -e "SHOW DATABASES"`.

If a script has an error, the client stops at that statement. When you're **inside** the client, it just tells you the error and carries on with the next one. You'll get used to reading messages like `ERROR 1064 (42000)`: the number and the text after it tell you what went wrong.

## MySQL Workbench

**MySQL Workbench** is a free visual tool from Oracle. At the time of writing, the current version is **26.7.0**, for Windows, macOS, and Linux. Download it from **dev.mysql.com/downloads/workbench**. On Windows, it needs the .NET Framework and the Visual C++ Redistributable, which the installer will point you to if they're missing.

To use it:

1. Open Workbench. On the home screen, next to **MySQL Connections**, click the **+** to make a new connection.
2. Give it a name, and fill in the host (`localhost`), port (`3306`), and username (`root`). Click **Test Connection**, and enter your password when asked.
3. Click **OK**, then double-click the new connection to open it.

You'll see a **SQL editor** where you write queries, and a panel on the left listing your databases and tables. Write a statement and press **Ctrl + Enter** (or click the lightning-bolt button) to run the statement your cursor is on. Results appear in a grid at the bottom, which is easy to scroll and sort.

Workbench also has tools for designing tables visually and for drawing a diagram of how tables connect, called an **EER diagram**. A good habit: use Workbench to explore and look at results, but write your SQL in a `.sql` file, so you can keep it and re-run it.

Whichever tool you use, they all talk to the same server. The rest of this track shows plain SQL, which works in the `mysql` client, in Workbench, and in any other client.

## Try it

This script builds a small pet shop database and looks around in it, using the commands from this lesson. Predict what each one shows.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, pet_shop.sql"
	min-height="380px"
	:model-value="'CREATE DATABASE pet_shop;\nUSE pet_shop;\n\nCREATE TABLE pets (\n    id INT PRIMARY KEY,\n    name VARCHAR(50),\n    species VARCHAR(30),\n    age INT\n);\n\nINSERT INTO pets VALUES\n    (1, \'Bantay\', \'dog\', 4),\n    (2, \'Mingming\', \'cat\', 2),\n    (3, \'Bugs\', \'rabbit\', 1);\n\nSHOW TABLES;\nDESCRIBE pets;\nSELECT name, age FROM pets WHERE age &lt; 3 ORDER BY age\\G\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), run this script in the `mysql` client, or paste it into a Workbench query tab.
:::

::: details Check your prediction
```text
+--------------------+
| Tables_in_pet_shop |
+--------------------+
| pets               |
+--------------------+
+---------+-------------+------+-----+---------+-------+
| Field   | Type        | Null | Key | Default | Extra |
+---------+-------------+------+-----+---------+-------+
| id      | int         | NO   | PRI | NULL    |       |
| name    | varchar(50) | YES  |     | NULL    |       |
| species | varchar(30) | YES  |     | NULL    |       |
| age     | int         | YES  |     | NULL    |       |
+---------+-------------+------+-----+---------+-------+
*************************** 1. row ***************************
name: Bugs
 age: 1
*************************** 2. row ***************************
name: Mingming
 age: 2
```

`SHOW TABLES` names its column after the database: `Tables_in_pet_shop`. `DESCRIBE` shows `id` as the primary key (`PRI`), and the other columns as allowing `NULL`. The last statement ends in `\G`, so its rows print vertically. (In Workbench, use a semicolon instead, since `\G` is a `mysql` client feature.)
:::

## Try it yourself

1. Connect with `mysql -u root -p`, run `SHOW DATABASES;`, and count how many you see.
2. Type `SELECT 1 + 1` and press Enter without a semicolon. What does the prompt look like? Type `;` to finish.
3. Save the Try it script as `pet_shop.sql`, then run it from the terminal with `mysql -u root -p < pet_shop.sql`. What happens if you run it twice, and why?

## Check your understanding

<Quiz
	question="What does the -p option in mysql -u root -p do?"
	:options="['Sets the port', 'Makes the client ask for your password', 'Prints the results', 'Picks the database']"
	:answer-index="1"
	explanation="-p prompts for the password without showing it as you type. A capital -P sets the port."
/>

<Quiz
	question="You end a statement with \G instead of ;. What changes?"
	:options="['Nothing', 'The statement is cancelled', 'Each row is printed vertically, one column per line', 'The statement runs twice']"
	:answer-index="2"
	explanation="\G is a mysql client feature that prints results vertically, which is easier to read for wide tables."
/>

<Quiz
	question="After typing a statement without a semicolon, the prompt changes to ->. What does that mean?"
	:options="['The client is waiting for the rest of the statement', 'The server crashed', 'You are connected as root', 'The statement succeeded']"
	:answer-index="0"
	explanation="The client keeps reading until you end the statement with a semicolon. Type ; to finish, or \c to cancel."
/>

## Up next

You can connect and look around. Now let's build tables properly, and learn the data types MySQL is picky about, in [Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types).
