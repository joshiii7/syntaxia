---
title: "Oracle Tools: SQL*Plus, SQLcl, SQL Developer, and FreeSQL"
description: "Meet the tools for working with Oracle: SQL*Plus, SQLcl, SQL Developer, SQL Developer for VS Code, and FreeSQL. Learn to connect, run scripts, describe tables, format output, and see PL/SQL messages."
---

# Oracle Tools: SQL*Plus, SQLcl, and SQL Developer

*A carpenter has a hammer, a power drill, and a workbench. They all build the same furniture, and each one is best for a different job. Oracle's tools work the same way.*

All of Oracle's tools do the same essential job: send your SQL to the database, and show you what comes back. They differ in how friendly they are. You'll see all of them in the real world, so it helps to know them by name.

## The main tools

| Tool | What it is | Good for |
|---|---|---|
| **SQL\*Plus** | Oracle's classic command-line tool, in use since the 1980s. It's installed with the database. | Servers, scripts, and any place with no fancy tools. |
| **SQLcl** | "SQL command line": a modern replacement for SQL\*Plus, with history, tab completion, and nicer output. It runs SQL\*Plus scripts, too. | Everyday work in a terminal. |
| **SQL Developer** | A free desktop app with a graphical interface: a table browser, an editor, and tools to export data. | People who prefer clicking to typing. |
| **SQL Developer for VS Code** | An extension that brings the same abilities into Visual Studio Code. | Anyone who already lives in VS Code. |
| **FreeSQL** | Oracle's free website with a worksheet, from [Getting an Oracle Database](/lessons/oracle-database/setting-up). | Learning, without installing anything. |

At the time of writing (September 2026), the current versions are **SQLcl 26.2** and **SQL Developer 26.2**. Oracle has said that SQL Developer for VS Code is where its desktop tool development is now going, so expect that extension to become the main graphical choice over time. All of these are free to download from Oracle's site.

The rest of this lesson uses commands that work in SQL\*Plus, and, unless noted, in SQLcl as well.

## Connecting

From a terminal, start the tool and give it a connection string, in the form you saw in the last lesson:

```text
sqlplus system@localhost:1521/FREEPDB1
sql system@localhost:1521/FREEPDB1
```

The first line starts SQL\*Plus, and the second starts SQLcl (its command is `sql`). Each asks for the password. You can also start the tool first and connect from inside with `CONNECT username@host:port/service`. Once connected, the prompt says `SQL>`.

Try a couple of commands that ask the tool about the session:

```text
SQL> SHOW USER
USER is "MARIA"
```

`SHOW USER` prints the account you're logged in as. The name here is the account of whoever is connected.

## Statements, and how to end them

SQL\*Plus and SQLcl have two kinds of input, and it helps to keep them apart:

- **SQL statements**, like `SELECT` and `INSERT`, end with a **semicolon** `;`. That's the signal to send them to the database.
- **Tool commands**, like `DESCRIBE` and `SET`, belong to the tool itself. They don't need a semicolon, and the database never sees them.
- **PL/SQL blocks**, which you'll meet soon, contain semicolons inside them. So they end with a **slash** `/` on a line by itself.

If you press Enter without a semicolon, the tool waits for more, and shows the next line number. Type `;` and Enter to finish the statement.

The command `/` on its own line runs the **previous** statement again, which is handy after fixing a typo.

## DESCRIBE: what's in this table?

`DESCRIBE` (or `DESC`) lists a table's columns:

```sql
DESCRIBE hr.departments
```

```text
Name            Null?    Type
--------------- -------- ------------
DEPARTMENT_ID   NOT NULL NUMBER(4)
DEPARTMENT_NAME NOT NULL VARCHAR2(30)
MANAGER_ID               NUMBER(6)
LOCATION_ID              NUMBER(4)
```

For each column, you see its name, whether it must have a value (`NOT NULL`), and its type. You'll learn about `NUMBER(4)` and `VARCHAR2(30)` in [Oracle Data Types](/lessons/oracle-database/data-types). It's Oracle's version of SQLite's `.schema` and MySQL's `DESCRIBE`.

## Making output readable

The classic SQL\*Plus output can be ugly when a table has many columns: lines wrap, and headings repeat. A few `SET` commands tame it:

| Command | What it does |
|---|---|
| `SET LINESIZE 200` | Makes each line up to 200 characters wide before wrapping. |
| `SET PAGESIZE 100` | Repeats the column headings every 100 lines, instead of every 14. |
| `COLUMN last_name FORMAT A15` | Makes the `last_name` column 15 characters wide. |
| `COLUMN salary FORMAT 999,999` | Shows numbers with a thousands separator. |
| `SET SERVEROUTPUT ON` | Shows text that PL/SQL prints with `DBMS_OUTPUT`. |
| `SET TIMING ON` | Shows how long each statement took. |

`SET SERVEROUTPUT ON` is the one to remember. Without it, PL/SQL's `DBMS_OUTPUT.PUT_LINE` runs, but nothing appears. You'll need it from [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks) on. In SQLcl and SQL Developer, it's often on already, and FreeSQL shows the text in its **DBMS output** tab.

Some services, like FreeSQL, restrict a few of these: running `SET PAGESIZE` there answers with `SP2-0738: Restricted command`. On your own database, they all work.

## SQLcl's extras

SQLcl does everything SQL\*Plus does, plus a few conveniences:

- **History and editing.** Press the up arrow to bring back earlier statements and edit them, and `HISTORY` lists them.
- **Tab completion** for table and column names.
- **Output formats.** `SET SQLFORMAT CSV` prints results as CSV, `SET SQLFORMAT JSON` as JSON, and `SET SQLFORMAT ANSICONSOLE` as a neat formatted table.
- **`DDL tablename`** prints the `CREATE TABLE` statement that would rebuild a table.

## Running scripts

A script is a text file of SQL. Run one from inside the tool with `@`:

```text
SQL> @setup.sql
```

Or start the tool with the script: `sqlplus system@localhost:1521/FREEPDB1 @setup.sql`. Every statement in the file runs in order, just like typing them. Scripts are how you build the same tables again and again, and how the final project of this track works.

To save what appears on the screen into a file, use `SPOOL`:

```text
SQL> SPOOL results.txt
SQL> SELECT * FROM hr.regions;
SQL> SPOOL OFF
```

## SQL Developer and the VS Code extension

**SQL Developer** opens with a **Connections** panel. You add a connection by entering a name, a username and password, and the host, port, and service (`FREEPDB1`). You can then expand a connection to browse its tables, and double-click one to see its columns and its data.

In the **worksheet**, you write SQL, and run it in two ways:

- **Run Statement** (Ctrl + Enter) runs the statement your cursor is in, and shows the results in a grid.
- **Run Script** (F5) runs everything in the worksheet, and shows the output as text, like SQL\*Plus.

Query results in the grid can be sorted, filtered, and exported to CSV, Excel, or JSON with a right-click. FreeSQL's worksheet works in a very similar way. SQL Developer for VS Code offers the same in a VS Code panel.

## Which should you use?

Use whichever you enjoy, and try all of them once. A good plan:

- **Learning:** FreeSQL, or SQL Developer, so results are easy to see.
- **Scripts and servers:** SQLcl or SQL\*Plus. Many systems you'll meet in real jobs have only SQL\*Plus.

## Try it

You've connected to a database and want to look around. Predict what this session prints.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, look_around.sql"
	min-height="300px"
	:model-value="'DESCRIBE hr.regions\n\nSELECT region_id, region_name\nFROM hr.regions\nORDER BY region_id;\n\nSELECT COUNT(*) AS departments FROM hr.departments;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this into FreeSQL's worksheet, and run it as a script.
:::

::: details Check your prediction
```text
Name        Null?    Type
----------- -------- ------------
REGION_ID   NOT NULL NUMBER
REGION_NAME          VARCHAR2(25)

REGION_ID REGION_NAME
--------- -----------
       10 Europe
       20 Americas
       30 Asia
       40 Oceania
       50 Africa

DEPARTMENTS
-----------
         27
```

`DESCRIBE` is a tool command, so it needs no semicolon. It shows two columns, the first with a required value. The `SELECT` lists the five regions, and the last query counts the departments in the sample company.
:::

## Try it yourself

1. Use `DESCRIBE` on `hr.employees`. It has 11 columns. Which ones can be empty, and which ones must have a value?
2. In SQL\*Plus or SQLcl, run `SET LINESIZE 200`, then `SELECT * FROM hr.employees FETCH FIRST 3 ROWS ONLY;`. Is the output easier to read now?
3. Save two statements in a file called `regions.sql`, and run it with `@regions.sql`.

## Check your understanding

<Quiz
	question="A PL/SQL block ends with which character on a line by itself?"
	:options="['A semicolon', 'A slash /', 'A period', 'A colon']"
	:answer-index="1"
	explanation="A PL/SQL block contains semicolons inside it, so SQL*Plus and SQLcl need a separate signal, a slash on its own line, to run it."
/>

<Quiz
	question="What does SET SERVEROUTPUT ON do?"
	:options="['Turns on the server', 'Makes queries faster', 'Shows the text that PL/SQL prints with DBMS_OUTPUT', 'Saves your work']"
	:answer-index="2"
	explanation="Without it, DBMS_OUTPUT.PUT_LINE runs, but its text is not displayed."
/>

<Quiz
	question="Which command shows a table's columns and their types?"
	:options="['DESCRIBE', 'SHOW TABLE', 'LIST COLUMNS', 'GET SCHEMA']"
	:answer-index="0"
	explanation="DESCRIBE (or DESC) lists each column's name, whether it may be empty, and its type."
/>

## Up next

You know the tools. Now let's look at what Oracle keeps in its columns, starting with its own names for the data types, in [Oracle Data Types](/lessons/oracle-database/data-types).
