---
title: "How to Install MySQL Server on Windows, macOS, and Linux"
description: "Install MySQL 9.7 LTS on Windows, macOS, or Linux, set a safe root password, check that the server is running, and fix the most common install problems."
---

# Installing MySQL Server

*Before a library can lend books, someone has to build it and hire a librarian. This lesson builds yours.*

In [Coming from SQLite](/lessons/mysql/coming-from-sqlite), you learned that MySQL is a server. Unlike SQLite, which is just a file, you have to **install** it, and it keeps running in the background. This lesson gets it onto your computer.

Follow the steps for your own system, and take it slowly. If something goes wrong, the troubleshooting section at the end covers the usual suspects.

## Which version?

Install **MySQL Community Server 9.7 LTS**. At the time of writing (September 2026), that's **9.7.2**. If a newer 9.7.x is available when you read this, use that. Everything in this track works with any 9.7.x, and nearly all of it with 8.4 LTS.

Be careful with the download page: it also offers an Innovation release, currently **26.7**. That one is fine for trying new features, but it's supported only until the next release, so choose the **9.7 LTS** unless you have a reason not to.

The **Community Server** is the free edition. You don't need an Oracle account to download it, even though the site may offer a login.

## Installing on Windows

1. Go to **dev.mysql.com/downloads/mysql** and choose **MySQL 9.7 LTS** as the version, and **Microsoft Windows** as the operating system.
2. Download the **MSI Installer** and run it. (There's also a ZIP archive for people who want to set everything up by hand. The installer is easier, and it's the recommended route in MySQL's own documentation.)
3. Follow the installer, and then the **MySQL Configurator**, which sets up the server for you. When it asks, choose these settings:
   - A **development** computer, since this is for learning.
   - The default port, **3306**.
   - A **root password**. Choose one you'll remember, and write it down somewhere safe. The `root` account is the all-powerful administrator.
   - Run MySQL as a **Windows service** that starts automatically, so the server is there whenever you need it.

Once it's finished, MySQL is running in the background.

## Installing on macOS

There are two easy ways.

- **The installer from dev.mysql.com.** Download the macOS **DMG** for MySQL 9.7 LTS, open it, and follow the steps. It will ask you to choose a root password.
- **Homebrew**, if you already use it. Be careful here: plain `brew install mysql` gives you the newest **Innovation** release (currently 26.7). To get the LTS, name it:

```text
brew install mysql@9.7
brew services start mysql@9.7
```

`brew services start` runs the server in the background. Homebrew's MySQL starts with **no root password**, so run `mysql_secure_installation` afterward to set one. (`mysql@9.7` is "keg-only", which means Homebrew doesn't add it to your PATH automatically. The command prints a line for you to add to your shell settings.)

## Installing on Linux

MySQL recommends installing from its own repositories, since the packages built into most distributions are often several versions behind, and never include Innovation releases. On Ubuntu and Debian, that means the **MySQL APT repository**. Go to **dev.mysql.com/downloads/repo/apt**, download the small setup package, install it, and choose **mysql-8.4-lts** or the 9.7 LTS series in the menu it shows. Then:

```text
sudo apt update
sudo apt install mysql-server
```

On Fedora, Red Hat, and their relatives, use the **Yum repository** the same way. The exact steps change with each distribution version, so follow the guide for yours on the MySQL downloads page.

You can also install your distribution's own `mysql-server` package. It works fine for learning, but it may not be 9.7, so some things in this track could differ.

## Checking that it worked

Open a **new** terminal window (one that was open during the install may not know about MySQL yet), and type:

```text
mysql --version
```

You should see something like this, though your numbers may differ:

```text
mysql  Ver 9.7.2 for Win64 on x86_64 (MySQL Community Server - GPL)
```

That's the **client** program, `mysql`. To check that the **server** is running and answering, connect to it:

```text
mysql -u root -p
```

Type your root password when asked. If you see a welcome message and the prompt changes to `mysql>`, everything is working. Type `EXIT` to leave. The [next lesson](/lessons/mysql/connecting) shows you around the client.

Once you're connected, this query shows which server you're talking to:

```sql
SELECT VERSION();
```

```text
+-----------+
| VERSION() |
+-----------+
| 9.7.2     |
+-----------+
```

## Starting and stopping the server

Because the server is a background service, you can start and stop it without uninstalling.

- **Windows:** open **Services** (search for it in the Start menu), find the service named **MySQL** followed by a version, and use **Start** or **Stop**. Or, in a terminal running as administrator, `net stop` and `net start` with the service's name.
- **macOS with Homebrew:** `brew services stop mysql@9.7` and `brew services start mysql@9.7`.
- **Linux:** `sudo systemctl stop mysql` and `sudo systemctl start mysql`. On some systems, the service is called `mysqld`.

If the server isn't running, the client can't connect. That's the first thing to check when it complains.

## When something goes wrong

**"'mysql' is not recognized" or "command not found"**

The installer may not have added MySQL's `bin` folder to your PATH. On Windows, look for the folder, typically inside `C:\Program Files\MySQL\`, and add its `bin` folder to your PATH. Then open a new terminal. You can also run the client by its full path.

**ERROR 2003: Can't connect to MySQL server on 'localhost'**

The server isn't running. Start it (see the section above). If it still doesn't start, check that something else isn't using port 3306, and read the server's **error log**, which is in its data folder.

**ERROR 1045: Access denied for user 'root'**

The password is wrong. Passwords are case-sensitive. If you've forgotten it, MySQL's documentation has a procedure for resetting the root password.

**"Access denied" only when connecting from a program**

The program is using the wrong username or password. Programs connect exactly like the client does.

## Try it

This query asks the server about itself: its version, and the character set and collation it uses for text by default. (You'll learn what those are in [Character Sets and utf8mb4](/lessons/mysql/character-sets).) Predict what it prints.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, check.sql"
	min-height="220px"
	:model-value="'SELECT\n    VERSION() AS version,\n    @@character_set_server AS charset,\n    @@collation_server AS collation,\n    @@port AS port;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is installed, run this in the `mysql` client.
:::

::: details Check your prediction
Your version may be a different 9.7.x, and if you used a different port, that will show too:

```text
+---------+---------+--------------------+------+
| version | charset | collation          | port |
+---------+---------+--------------------+------+
| 9.7.2   | utf8mb4 | utf8mb4_0900_ai_ci | 3306 |
+---------+---------+--------------------+------+
```

`utf8mb4` is MySQL's full Unicode character set, and `utf8mb4_0900_ai_ci` is its default way of comparing text: "ai" means accent-insensitive, and "ci" means case-insensitive, which is why `'jose rizal'` matched `'Jose Rizal'` in the last lesson.
:::

## Try it yourself

1. Run `mysql --version` in a new terminal, and write down your version.
2. Connect with `mysql -u root -p`, run `SELECT VERSION();`, then type `EXIT`.
3. Find out how to stop and start the MySQL server on your computer, and try it. What error does the client show while the server is stopped?

## Check your understanding

<Quiz
	question="Which MySQL release does this track recommend installing, and why?"
	:options="['MySQL 9.7 LTS, since it is supported for years', 'The newest Innovation release, since it has the most features', 'MySQL 5.7, since it is the most familiar', 'Whichever one your computer suggests']"
	:answer-index="0"
	explanation="LTS releases get long-term fixes. Innovation releases like 26.7 are only supported until the next one arrives."
/>

<Quiz
	question="The client says ERROR 2003: Can't connect to MySQL server. What should you check first?"
	:options="['Whether the table exists', 'Whether your SQL has a typo', 'Whether the server is running', 'Whether the password contains numbers']"
	:answer-index="2"
	explanation="Error 2003 means the client couldn't reach a server at all, and the usual cause is that the server isn't running."
/>

<Quiz
	question="What is the root account?"
	:options="['A table', 'A folder on your computer', 'A Linux-only feature', 'The all-powerful administrator account, which needs a strong password']"
	:answer-index="3"
	explanation="root can do anything on the server, so protect it with a password you won't lose."
/>

## Up next

The server is running. Now let's meet it properly, with the `mysql` command-line client and MySQL Workbench, in [Connecting with the mysql Client and Workbench](/lessons/mysql/connecting).
