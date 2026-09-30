---
title: "How to Install SQLite and Use the sqlite3 Shell"
description: "Install the sqlite3 command-line shell on Windows, macOS, or Linux, check that it works, and create your first SQLite database file."
---

# Installing SQLite and the sqlite3 Shell

*Some tools need a whole workshop. This one fits in a single small file.*

In [What Is SQLite?](/lessons/sqlite3/introduction), you saw that SQLite has no server: a database is just a file. That makes setup refreshingly small. In this lesson, you'll install **`sqlite3`**, a little program called a **shell** that lets you type SQL and see the results, and use it to create your first database file.

## What you're installing

The `sqlite3` shell is one small program. You type SQL into it, press Enter, and it shows you the answer. It can also open, create, and save database files. There's nothing to configure and no account to create.

Some systems already have it. Check first, then install only if you need to.

## Checking whether you already have it

Open a terminal (search the Start menu for **Terminal** on Windows, or open **Terminal** from Applications, then Utilities, on a Mac) and type:

```text
sqlite3 --version
```

If you see a version number starting with **3**, you're ready: skip ahead to [Opening your first database](#opening-your-first-database). If the terminal says the command isn't found, follow the steps for your system below.

If you've never used a terminal before, [Using the Integrated Terminal](/lessons/ide/using-the-terminal) in the IDE track is a gentle introduction.

## Installing on Windows

1. Go to **sqlite.org** and open the **Download** page.
2. Under **Precompiled Binaries for Windows**, download the **sqlite-tools** package for **x64** (a `.zip` file). Most Windows computers are x64.
3. Unzip it. Inside, you'll find `sqlite3.exe`.
4. Make a folder for it, like `C:\sqlite`, and move `sqlite3.exe` there.
5. To be able to type `sqlite3` from any folder, add that folder to your **PATH**: search the Start menu for **Edit the system environment variables**, choose **Environment Variables**, select **Path** under your user variables, choose **Edit**, then **New**, and add `C:\sqlite`.

`PATH` is the list of folders your computer searches when you type a command. If adding it feels like too much for now, you can instead copy `sqlite3.exe` into the folder where you'll keep your practice files, and run it from there as `.\sqlite3`.

## Installing on macOS

macOS already includes `sqlite3`. Run `sqlite3 --version` to confirm. If you'd like a newer version later, you can install one with Homebrew (`brew install sqlite`), but the built-in one works for this whole track.

## Installing on Linux

Many Linux systems include `sqlite3`. If yours doesn't, install it with your package manager. On Ubuntu and Debian:

```text
sudo apt install sqlite3
```

## Checking that it worked

Open a **new** terminal window (one that was open during the install may not know about the change) and type:

```text
sqlite3 --version
```

You should see a version number and a date, something like this (your numbers may differ):

```text
3.53.4 2026-07-24 19:02:57 ...
```

Any version starting with **3** works for this track.

## Opening your first database

Make a folder called `sql-practice`, open a terminal in it, and type:

```text
sqlite3 library.db
```

That opens a database file called `library.db`. The prompt changes to `sqlite>`, which means SQLite is waiting for your SQL. Try a first statement, ending it with a semicolon, and press Enter:

```text
sqlite> SELECT 2 + 3;
5
```

Nothing is saved to disk until you create something, so the file `library.db` appears in your folder once you make your first table, in the next lesson. To leave the shell, type `.quit` and press Enter.

Lines that start with a dot, like `.quit`, aren't SQL. They're **dot-commands**: instructions for the shell itself. You'll meet the most useful ones in [Your First Queries](/lessons/sqlite3/first-queries).

## A friendlier view (optional)

The shell is all you need for this track. But if you'd like to see your tables in a window, like a spreadsheet, a free program called **DB Browser for SQLite** (at sqlitebrowser.org) opens `.db` files, shows every table, and lets you run SQL too. Many code editors also have extensions for viewing SQLite files.

## When something goes wrong

**"'sqlite3' is not recognized" or "command not found"**

The terminal can't find the program. Close every terminal window and open a new one. On Windows, check that the folder containing `sqlite3.exe` was added to your PATH, or run it from its own folder with `.\sqlite3`.

**The prompt shows `...>` instead of `sqlite>`**

The shell is waiting for the end of your statement. You probably forgot the semicolon. Type `;` and press Enter.

**Your school computer won't let you install anything**

That's normal on shared computers. You can still read every lesson here, and finish the setup at home later.

## Try it

This one-line query asks SQLite for its own version number, and does a little math. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, check.sql"
	min-height="160px"
	:model-value="'SELECT sqlite_version() AS version, 7 * 6 AS answer;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. Once your setup works, open the shell with `sqlite3`, type `.mode table`, press Enter, and then paste the query.
:::

::: details Check your prediction
The answer column is always the same. The version depends on your computer, so yours may be different:

```text
+---------+--------+
| version | answer |
+---------+--------+
| 3.53.4  |     42 |
+---------+--------+
```

`sqlite_version()` is a built-in function that gives back the version of SQLite that's running. `AS` names each column in the result, as you'll see in [SELECT: Reading Data](/lessons/sqlite3/select).
:::

## Try it yourself

1. Run `sqlite3 --version` in a new terminal and write down your version number.
2. Make a `sql-practice` folder, open a terminal in it, and run `sqlite3 library.db`. Type `SELECT 10 / 4;` and press Enter. What does SQLite answer? (You'll find out why in [Built-in Functions](/lessons/sqlite3/functions).)
3. Type `.help` in the shell to see every dot-command, then `.quit` to leave.

## Check your understanding

<Quiz
	question="What does sqlite3 library.db do?"
	:options="['Opens the database file library.db in the sqlite3 shell, creating it if needed', 'Deletes the library.db file', 'Installs SQLite', 'Prints the contents of library.db']"
	:answer-index="0"
	explanation="Giving sqlite3 a file name opens that database. If the file doesn't exist yet, SQLite creates it as soon as you store something."
/>

<Quiz
	question="The shell shows ...&gt; instead of sqlite&gt; after you press Enter. What happened?"
	:options="['The database is broken', 'SQLite crashed', 'The statement isn\'t finished yet, usually because the semicolon is missing', 'You need to reinstall']"
	:answer-index="2"
	explanation="SQL statements end with a semicolon. Until SQLite sees one, it waits for more. Type ; and press Enter."
/>

<Quiz
	question="What are commands that start with a dot, like .quit?"
	:options="['A kind of SQL comment', 'Errors', 'Table names', 'Instructions for the sqlite3 shell itself, not SQL']"
	:answer-index="3"
	explanation="Dot-commands control the shell: quitting, listing tables, changing how results look. They only work in the sqlite3 shell."
/>

## Up next

Your shell is ready. Time to build the library database you'll use throughout this track, and ask it your first questions, in [Your First Queries](/lessons/sqlite3/first-queries).
