---
title: "SQLite PRAGMA: Settings, table_info, and foreign_keys"
description: "Control and inspect a SQLite database with PRAGMA statements: turn on foreign keys, list a table's columns with table_info, check integrity, and track schema versions."
---

# SQLite Settings with PRAGMA

*A car has a dashboard: gauges to check what's going on, and switches to change how it behaves. You don't drive with them, but you'd be lost without them.*

Every statement so far has worked with your **data**: reading it, changing it, organizing it. But sometimes you need to work with the **database itself**: switch a feature on, look at how a table is built, or check that the file is healthy.

In SQLite, those jobs are done with a special statement called **`PRAGMA`**. You've already used one: `PRAGMA foreign_keys = ON;`, in [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints).

## A dashboard

A car's dashboard has two kinds of controls. **Gauges** tell you something: your speed, how much fuel is left. **Switches** change something: headlights on, wipers faster.

`PRAGMA` statements come in the same two kinds:

- **Reading** a setting or some information: `PRAGMA name;`
- **Changing** a setting: `PRAGMA name = value;`

`PRAGMA` is specific to SQLite. MySQL and Oracle have their own, very different ways of doing these jobs.

## Reading and changing a setting

Asking for a setting's current value is just its name:

```sql
PRAGMA foreign_keys;
```

```text
+--------------+
| foreign_keys |
+--------------+
|            0 |
+--------------+
```

`0` means off. That's SQLite's default. Change it by giving it a value, then read it again:

```sql
PRAGMA foreign_keys = ON;
PRAGMA foreign_keys;
```

```text
+--------------+
| foreign_keys |
+--------------+
|            1 |
+--------------+
```

`ON`, `true`, and `1` all mean on; `OFF`, `false`, and `0` all mean off.

## The one to always remember: `foreign_keys`

As you saw in [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints), SQLite ignores foreign key rules unless `foreign_keys` is on. And this setting has an important twist: **it isn't saved in the database file**. It only lasts for the current connection, and it resets to off every time the database is opened.

So it has to be switched on at the start of every session in the shell, and at the start of every program that opens the database. Forgetting it is one of the most common SQLite mistakes, because nothing warns you: foreign keys just quietly aren't checked.

## Looking inside a table: `table_info`

`PRAGMA table_info(tablename)` describes every column of a table: its position, name, type, whether it's `NOT NULL`, its default, and whether it's part of the primary key.

```sql
PRAGMA table_info(members);
```

```text
+-----+--------+---------+---------+------------+----+
| cid |  name  |  type   | notnull | dflt_value | pk |
+-----+--------+---------+---------+------------+----+
|   0 | id     | INTEGER |       0 |            |  1 |
|   1 | name   | TEXT    |       0 |            |  0 |
|   2 | grade  | INTEGER |       0 |            |  0 |
|   3 | joined | TEXT    |       0 |            |  0 |
+-----+--------+---------+---------+------------+----+
```

- `cid` is the column's position, counting from 0.
- `notnull` is `1` if the column is `NOT NULL`.
- `dflt_value` is its default, if it has one.
- `pk` is `1` for the primary key column.

It's more detailed than the `.schema` dot-command from [Your First Queries](/lessons/sqlite3/first-queries), and, unlike dot-commands, it's real SQL, so it also works from inside a program, like the Python code in [Using SQLite from Python](/lessons/sqlite3/sqlite-in-python).

A related pragma lists every foreign key a table has:

```sql
CREATE TABLE reviews (id INTEGER PRIMARY KEY, book_id INTEGER REFERENCES books(id), stars INTEGER);
PRAGMA foreign_key_list(reviews);
```

```text
+----+-----+-------+---------+----+-----------+-----------+-------+
| id | seq | table |  from   | to | on_update | on_delete | match |
+----+-----+-------+---------+----+-----------+-----------+-------+
|  0 |   0 | books | book_id | id | NO ACTION | NO ACTION | NONE  |
+----+-----+-------+---------+----+-----------+-----------+-------+
```

## Checking the file is healthy: `integrity_check`

A database file can be damaged, for example if a computer loses power at exactly the wrong moment, or a file is copied while it's being written. `integrity_check` looks through the whole file for problems:

```sql
PRAGMA integrity_check;
```

```text
+-----------------+
| integrity_check |
+-----------------+
| ok              |
+-----------------+
```

`ok` means everything is fine. On a big database, it can take a while, so it's something you run occasionally, or when something seems wrong, not on every connection.

## Keeping track of versions: `user_version`

As an app grows, its tables change: a new column here, a new table there. When a new version of the app opens an old database, it needs to know which changes have already been made. `user_version` is a number stored in the database file that SQLite never touches itself; it's there for your program to use:

```sql
PRAGMA user_version;
PRAGMA user_version = 2;
PRAGMA user_version;
```

```text
+--------------+
| user_version |
+--------------+
|            0 |
+--------------+
+--------------+
| user_version |
+--------------+
|            2 |
+--------------+
```

A common pattern: when the app starts, it reads `user_version`. If it's 1, it runs the changes needed to reach version 2, then sets `user_version = 2`. Unlike `foreign_keys`, this value **is** saved in the file.

## Better performance with many users: `journal_mode`

One more you'll see in real projects. By default, SQLite locks the whole database while anyone is writing to it, so readers have to wait. Switching the **journal mode** to **WAL** (write-ahead logging) lets people keep reading while someone else writes:

```text
PRAGMA journal_mode = WAL;
```

That's worth doing for a database that a website or several programs use at once. It's saved in the database file, so you only need to set it once. (It doesn't apply to a temporary in-memory database, which is why there's no result to show here.)

## Try it

This creates a small table, then uses pragmas to look inside it, check a setting, and store a version number. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, pragma.sql"
	min-height="380px"
	:model-value="'CREATE TABLE events (\n\tid INTEGER PRIMARY KEY,\n\tname TEXT NOT NULL,\n\tcapacity INTEGER DEFAULT 30,\n\troom TEXT\n);\n\nPRAGMA table_info(events);\n\nPRAGMA foreign_keys;\nPRAGMA foreign_keys = ON;\nPRAGMA foreign_keys;\n\nPRAGMA user_version = 3;\nPRAGMA user_version;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+-----+----------+---------+---------+------------+----+
| cid |   name   |  type   | notnull | dflt_value | pk |
+-----+----------+---------+---------+------------+----+
|   0 | id       | INTEGER |       0 |            |  1 |
|   1 | name     | TEXT    |       1 |            |  0 |
|   2 | capacity | INTEGER |       0 | 30         |  0 |
|   3 | room     | TEXT    |       0 |            |  0 |
+-----+----------+---------+---------+------------+----+
+--------------+
| foreign_keys |
+--------------+
|            0 |
+--------------+
+--------------+
| foreign_keys |
+--------------+
|            1 |
+--------------+
+--------------+
| user_version |
+--------------+
|            3 |
+--------------+
```

`table_info` lists the four columns: only `name` is `NOT NULL`, only `capacity` has a default, and `id` is the primary key. Foreign keys start off (`0`) and are on (`1`) after the change. The pragmas that change a setting, like `PRAGMA user_version = 3;`, don't show anything themselves.
:::

## Try it yourself

1. In your library database, run `PRAGMA table_info(loans);`. Which columns are allowed to be `NULL`?
2. Quit the shell, reopen `library.db`, and run `PRAGMA foreign_keys;`. What does it say, and why?
3. Run `PRAGMA integrity_check;` on your library database.

## Check your understanding

<Quiz
	question="What does PRAGMA table_info(books); do?"
	:options="['Shows every column of books, with its type, default, and whether it\'s NOT NULL or the primary key', 'Deletes the books table', 'Counts the rows in books', 'Turns on foreign keys for books']"
	:answer-index="0"
	explanation="table_info describes a table's columns. It's like .schema, but real SQL that also works from programs."
/>

<Quiz
	question="You set PRAGMA foreign_keys = ON; yesterday. Today you reopen the database. Are foreign keys checked?"
	:options="['Yes, the setting was saved', 'Only for new tables', 'No, it resets to off on every new connection, so you must turn it on again', 'Only if you use STRICT tables']"
	:answer-index="2"
	explanation="foreign_keys isn't stored in the file. Every session and every program must turn it on."
/>

<Quiz
	question="What is user_version for?"
	:options="['The version of SQLite', 'A number stored in the file that your app can use to track which version of its tables the database has', 'The number of users connected', 'A password']"
	:answer-index="1"
	explanation="SQLite never changes user_version itself. Apps use it to know which table changes have already been applied."
/>

## Up next

You've stored dates as text since the very first lesson. Next, you'll learn to do real work with them: adding days, finding differences, and pulling out the month, with SQLite's date functions, in [Dates and Times in SQLite](/lessons/sqlite3/dates-and-times).
