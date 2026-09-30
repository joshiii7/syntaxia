---
title: "How to Get Oracle Database Free: FreeSQL, Windows, and Containers"
description: "Get an Oracle database to practice on: try FreeSQL in your browser, install Oracle AI Database Free on Windows or Linux, or run it in a container, then connect and run your first query."
---

# Getting an Oracle Database: FreeSQL and Oracle Free

*Before you can practice, you need a stove to cook on. This lesson shows three ways to get one, from "ready in a minute" to "your own computer's own database."*

Unlike SQLite, Oracle isn't a file you can just open. It's a big server program. The good news is that Oracle now offers several free ways to use it, and all of them run a real Oracle Database. Pick the one that suits you. You can always try another later.

| Option | Setup | Best for |
|---|---|---|
| **FreeSQL** (in your browser) | none | starting right now, on any computer |
| **Oracle AI Database Free** (installed) | a real install | working offline, and the full experience |
| **Oracle Free in a container** | Docker or Podman | people who already use containers |

## Which version?

At the time of writing (September 2026), the newest release is **Oracle AI Database 26ai**. It was called **Oracle Database 23ai** before, so you'll still see that older name on many pages, and in the names of downloads. Its free edition is **Oracle AI Database Free**. Everything in this track works with it, and most of it also works with older releases like 19c, except for a few conveniences that the lessons point out.

## Option 1: FreeSQL, in your browser

**FreeSQL** is a free website from Oracle, at **freesql.com**, that gives you an Oracle database and a **worksheet** where you write SQL and see the results. There's nothing to install.

1. Go to **freesql.com**. The worksheet opens with an editor at the top and result tabs underneath.
2. Type a query, and run it with the play button, or press **Ctrl + Enter**. To run several statements at once, use **Run Script** (the button next to it).
3. The results appear in the **Query result** tab, or in **Script output**, which looks like a traditional Oracle terminal. There's also a tab for **DBMS output**, which you'll use for PL/SQL.

Without signing in, you can read the sample **HR** tables (employees, departments, jobs, and more) and run queries, and PL/SQL blocks, on them. But your own database objects are another matter: **creating tables, inserting rows, and saving your work needs a free Oracle account**. Sign in from the top-right corner of the page. (Without an account, `CREATE TABLE` stops with `ORA-01031: insufficient privileges`, since a visitor's session can only connect and read.)

Once you're signed in, FreeSQL gives you your own private **schema** (you'll learn what that is in [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users)), where you can create and change whatever you like.

Try this query, which asks the database about itself and works for anyone:

```sql
SELECT sys_context('USERENV', 'SESSION_USER') AS who_am_i FROM dual;
```

FreeSQL is great for learning, but it's a shared service. Sessions can time out, and it isn't a place for real data.

## Option 2: Oracle AI Database Free on your computer

The Free edition installs on **Windows** and **Linux**, on a normal PC. It has limits: it uses up to **2 CPU threads and 2 GB of memory**, and stores up to **12 GB of user data**. Those are plenty for learning.

**On Windows:**

1. Go to **oracle.com/database/free** and download **Oracle AI Database Free for Windows** (a zip file). Oracle's site may ask you to accept its license terms first.
2. Extract the zip file, and double-click **setup.exe**. You must be logged in to Windows as an **administrator** for the install to work.
3. Follow the installer's steps. It asks you to choose a **password** for the administrative accounts (`SYS`, `SYSTEM`, and `PDBADMIN`). Choose one you'll remember, and write it down somewhere safe.
4. When it finishes, Oracle runs in the background as a Windows service.

If you had another Oracle Database XE or Free installed before, uninstall it first: the installer only allows one, using the name `FREE`.

**On Linux**, Oracle provides an **RPM package** for Oracle Linux and its relatives, and a set of instructions on the same download page. The exact steps depend on your distribution, so follow Oracle's installation guide for yours.

### What the installer creates

The installation makes a **container database** called `FREE`, containing one **pluggable database** called **`FREEPDB1`**. Think of the container as a building, and the pluggable database as one apartment in it where you do your work. The **listener**, the program that answers connections, uses port **1521**.

You'll usually connect to `FREEPDB1`. Connecting to the container itself (`FREE`) is for administrators.

## Option 3: Oracle Free in a container

If you use Docker or Podman, Oracle publishes ready-made images. This starts a database, with the password of your choice, and keeps its data in a named volume:

```text
docker run -d --name oracle-free -p 1521:1521 -e ORACLE_PWD="ChooseAStrongPassword1" -v oradata:/opt/oracle/oradata container-registry.oracle.com/database/free:latest
```

The first start takes a few minutes. Watch its log with `docker logs -f oracle-free`, and when you see **`DATABASE IS READY TO USE!`**, it's ready. (Oracle also publishes a smaller "lite" version, and other people publish their own images. Oracle's official image lives at container-registry.oracle.com.)

## Connecting

To use a database from your computer, you connect with a **client**. Oracle's classic one is **SQL*Plus**, and the newer, friendlier one is **SQLcl**. Both come with the database, and you'll meet them in [Oracle Tools](/lessons/oracle-database/tools). A connection needs a username, a password, and the address of the database, written like this:

```text
username@host:port/service
```

For your own computer's database, that's `localhost`, port `1521`, and the service `FREEPDB1`. To try it as the administrator `SYSTEM`:

```text
sqlplus system@localhost:1521/FREEPDB1
```

It asks for the password you chose during setup. If you see the prompt `SQL>`, everything is working. Try:

```sql
SELECT sys_context('USERENV', 'CON_NAME') AS pdb FROM dual;
```

On your own installation, that shows `FREEPDB1`. Type `EXIT` to leave.

The `SYS` and `SYSTEM` accounts are the all-powerful administrators, like `root` in MySQL. **Don't** use them for practice. In [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users), you'll create your own everyday account.

## The sample HR tables

The HR tables used in this track are a sample that Oracle publishes. FreeSQL already has them, ready to use. On your own installation, they're not there at first: Oracle offers the sample schemas as a free download on its GitHub page, and you can install them once you have a user to put them in. When a lesson uses the HR tables, you can follow it in FreeSQL without doing any of that.

## When something goes wrong

**The installer says another Oracle Database is already installed**

The Free edition can't sit beside a previous XE or Free install, or any database called `XE` or `FREE`. Uninstall the old one first.

**"ORA-12541: TNS:no listener" or "ORA-12514"**

The client couldn't find a database at that address. Check that the Oracle service is running (on Windows, look in **Services** for the ones with `Oracle` in their names), and that you typed the port and service name correctly.

**"ORA-01017: invalid username/password"**

The password is wrong. Passwords are case-sensitive in Oracle.

**FreeSQL says you don't have privileges**

You're probably not signed in. Sign in, and try again.

## Try it

Whichever option you chose, run this query to check that you're connected, and see who you are, and what you're allowed to do. Predict what it shows.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, whoami.sql"
	min-height="260px"
	:model-value="'SELECT COUNT(*) AS privileges FROM session_privs;\n\nSELECT privilege\nFROM session_privs\nORDER BY privilege\nFETCH FIRST 2 ROWS ONLY;\n\nSELECT table_name\nFROM all_tables\nWHERE owner = \'HR\'\nORDER BY table_name;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Use FreeSQL, or your own installation. This example shows what someone who **isn't signed in** to FreeSQL would see. If you're signed in, you'll see more privileges.
:::

::: details Check your prediction
```text
PRIVILEGES
----------
         2

PRIVILEGE
--------------
CREATE SESSION
SET CONTAINER

TABLE_NAME
-----------
COUNTRIES
DEPARTMENTS
EMPLOYEES
JOBS
JOB_HISTORY
LOCATIONS
REGIONS
```

A visitor to FreeSQL can only connect (`CREATE SESSION`) and switch container, so they can't create anything. The last query lists the seven HR sample tables that anyone can read. `SESSION_PRIVS` and `ALL_TABLES` are **data dictionary views**: tables Oracle keeps about itself, which you'll use again in [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users).
:::

## Try it yourself

1. Run `SELECT * FROM hr.regions;` and look at the five rows. What columns does it have?
2. Run `SELECT SYSDATE FROM dual;` and note the date and time. Is it your local time?
3. Try `CREATE TABLE test (n NUMBER);` in FreeSQL while not signed in, and read the error. Then sign in and try again.

## Check your understanding

<Quiz
	question="Which Oracle option needs nothing installed on your computer?"
	:options="['FreeSQL, in your browser', 'A container', 'A Linux RPM', 'setup.exe']"
	:answer-index="0"
	explanation="FreeSQL runs in your browser, so you can start immediately. The other options install or run software on your computer."
/>

<Quiz
	question="What is FREEPDB1?"
	:options="['The name of the installer', 'A password', 'A pluggable database created by the Oracle Free installation, where you do your work', 'A backup file']"
	:answer-index="2"
	explanation="The installation creates a container database called FREE with one pluggable database, FREEPDB1, which you connect to for everyday use."
/>

<Quiz
	question="Why shouldn't you practice as SYS or SYSTEM?"
	:options="['They cannot run SELECT', 'They are slower', 'They only work in FreeSQL', 'They can do anything, so a mistake can damage the whole database']"
	:answer-index="3"
	explanation="SYS and SYSTEM are the administrative accounts. Use your own less-privileged account for everyday work."
/>

## Up next

You have a database, and you can run a query. Now let's meet the tools people use to work with it every day, in [Oracle Tools](/lessons/oracle-database/tools).
