---
title: "Using SQLite from Python: the sqlite3 Module"
description: "Run SQL from a Python program with the built-in sqlite3 module: connect, query, pass values safely with ? placeholders, commit changes, and read rows by column name."
---

# Using SQLite from Python

*A shop assistant doesn't hand customers the stockroom key. The customer asks, the assistant fetches, and the stockroom stays tidy.*

Everything so far has happened in the `sqlite3` shell: you type SQL, and you see a table. That's perfect for learning and exploring. But real apps don't have a person typing queries. A program runs the SQL itself: a website looks up a member when they log in, and a phone app saves your settings when you change them.

Python makes this especially easy, because SQLite comes built in, through the **`sqlite3`** module. There's nothing to install. This lesson assumes you know some Python, from the [Python track](/lessons/python/intro-to-python): variables, lists, loops, and functions.

## The shop assistant

In a shop, customers don't wander into the stockroom. They ask the assistant, who fetches what they need and brings it back. The assistant knows where everything is and keeps it in order.

In a Python program:

- the **database file** is the stockroom;
- a **connection** is the assistant, the link between your program and the database;
- your program **asks** by sending SQL through the connection, and gets rows back as ordinary Python values: lists and tuples.

## Connecting and asking a question

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE books (title TEXT, year INTEGER)")
connection.execute("INSERT INTO books VALUES ('Cosmos', 1980)")
connection.execute("INSERT INTO books VALUES ('Noli Me Tangere', 1887)")

rows = connection.execute("SELECT title, year FROM books ORDER BY year").fetchall()
print(rows)

for title, year in rows:
    print(f"{title} ({year})")

connection.close()
```

```text
[('Noli Me Tangere', 1887), ('Cosmos', 1980)]
Noli Me Tangere (1887)
Cosmos (1980)
```

- `sqlite3.connect(...)` opens a database and gives back a connection. `":memory:"` is a special name for a temporary database that lives only in memory, handy for examples. For a real file, give a file name: `sqlite3.connect("library.db")`.
- `connection.execute(...)` runs one SQL statement, written as a Python string.
- `.fetchall()` collects every row of the result into a **list of tuples**, one tuple per row, with one item per column.
- Because each row is a tuple, you can unpack it in a `for` loop, like in [Tuples](/lessons/python/tuples).
- `connection.close()` hands the stockroom key back when you're done.

Notice the SQL inside the Python strings has no semicolons. `execute` runs one statement at a time, so they aren't needed.

For a single row, `.fetchone()` gives back one tuple, or `None` if there are no results:

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE books (title TEXT, year INTEGER)")
connection.execute("INSERT INTO books VALUES ('Cosmos', 1980)")

count = connection.execute("SELECT COUNT(*) FROM books").fetchone()[0]
print("Books:", count)
```

```text
Books: 1
```

## Passing values safely: `?` placeholders

Programs usually need to put values into their SQL: a title someone typed, a member's ID. The tempting way is to build the string with an f-string. **Don't.**

```python
title = input("Search for a title: ")
rows = connection.execute(f"SELECT * FROM books WHERE title = '{title}'")  # never do this
```

If someone types a title containing a quote mark, the SQL breaks. Worse, someone can type text that *changes what the query does*, like `' OR '1'='1`, which turns the query into "give me every book." That's called **SQL injection**, and it's one of the most common and damaging security holes on the web.

The safe way is a **placeholder**. Write `?` where each value goes, and pass the values separately, as a tuple:

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE books (title TEXT, year INTEGER)")
connection.execute("INSERT INTO books VALUES (?, ?)", ("Cosmos", 1980))
connection.execute("INSERT INTO books VALUES (?, ?)", ("It's a Test", 2026))

search = "It's a Test"
row = connection.execute("SELECT year FROM books WHERE title = ?", (search,)).fetchone()
print(row)

sneaky = "' OR '1'='1"
rows = connection.execute("SELECT * FROM books WHERE title = ?", (sneaky,)).fetchall()
print("Sneaky search found:", rows)
```

```text
(2026,)
Sneaky search found: []
```

With placeholders, `sqlite3` passes each value to the database as **data**, never as part of the SQL itself. A quote mark in a title is just a quote mark, and the "sneaky" text is simply a title that doesn't exist.

Two details: the values always go in a **tuple**, even for just one, which is why you see `(search,)` with a trailing comma. And placeholders are for **values** only, not for table or column names.

**The rule: never build SQL with f-strings or `+`. Always use `?` placeholders for values.**

## Saving changes: `commit()`

When your program changes data, with `INSERT`, `UPDATE`, or `DELETE`, the `sqlite3` module automatically opens a transaction, like `BEGIN` in [Transactions](/lessons/sqlite3/transactions). The changes aren't saved to the file until you call **`commit()`**:

```python
connection.execute("UPDATE loans SET returned_date = ? WHERE id = ?", ("2026-09-29", 2))
connection.commit()
```

Forget to commit, and when the program ends, the changes are thrown away. It's the most common beginner surprise with `sqlite3`: "my program ran, but nothing was saved."

The connection also works as a context manager with `with`, from [Reading and Writing Files](/lessons/python/file-io). It commits automatically if the block finishes normally, and rolls back if an exception happens, which is exactly the all-or-nothing pattern from Transactions:

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE savings (name TEXT PRIMARY KEY, balance INTEGER CHECK (balance >= 0))")
connection.execute("INSERT INTO savings VALUES ('Ana', 100), ('Ben', 20)")
connection.commit()

try:
    with connection:
        connection.execute("UPDATE savings SET balance = balance + 50 WHERE name = 'Ben'")
        connection.execute("UPDATE savings SET balance = balance - 150 WHERE name = 'Ana'")
except sqlite3.IntegrityError as error:
    print("Transfer cancelled:", error)

print(connection.execute("SELECT * FROM savings").fetchall())
```

```text
Transfer cancelled: CHECK constraint failed: balance >= 0
[('Ana', 100), ('Ben', 20)]
```

The second update broke the `CHECK` constraint, so `sqlite3` raised an `IntegrityError`, the `with` block rolled back Ben's +50 too, and the `except` from [Exceptions](/lessons/python/exceptions) caught the error. (Note that `with connection:` doesn't close the connection; it only commits or rolls back.)

## Rows by name: `sqlite3.Row`

Tuples are fine for two columns, but `row[4]` isn't very readable. Set the connection's `row_factory` to `sqlite3.Row`, and you can read columns by **name**, like a dictionary:

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.row_factory = sqlite3.Row
connection.execute("CREATE TABLE members (id INTEGER PRIMARY KEY, name TEXT, grade INTEGER)")
connection.execute("INSERT INTO members (name, grade) VALUES ('Maria Santos', 11)")

member = connection.execute("SELECT * FROM members WHERE id = ?", (1,)).fetchone()
print(member["name"], "is in grade", member["grade"])
```

```text
Maria Santos is in grade 11
```

## Adding many rows: `executemany`

To insert a whole list of rows, `executemany` runs one statement once for each item:

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE scores (student TEXT, score INTEGER)")

results = [("Maria", 91), ("Ben", 78), ("Carlo", 95)]
connection.executemany("INSERT INTO scores VALUES (?, ?)", results)
connection.commit()

print(connection.execute("SELECT AVG(score) FROM scores").fetchone()[0])
```

```text
88.0
```

It's faster than a loop of separate `execute` calls, and it all happens in one transaction.

## Don't forget: foreign keys

The `foreign_keys` setting from [SQLite Settings with PRAGMA](/lessons/sqlite3/pragma) resets on every new connection, and that includes connections from Python. Turn it on right after connecting:

```python
connection = sqlite3.connect("library.db")
connection.execute("PRAGMA foreign_keys = ON")
```

A good habit is to put the connecting and the `PRAGMA` in one small function, and use it everywhere.

## Try it

This program builds a small library in memory, adds books from a list, borrows one with a parameterized query, and prints a report. Predict every line.

<CodeEditor
	language="python"
	label="Python practice editor, library.py"
	min-height="560px"
	:model-value="'import sqlite3\n\n\ndef connect():\n    connection = sqlite3.connect(&quot;:memory:&quot;)\n    connection.row_factory = sqlite3.Row\n    connection.execute(&quot;PRAGMA foreign_keys = ON&quot;)\n    return connection\n\n\nconnection = connect()\nconnection.execute(&quot;CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL, copies INTEGER)&quot;)\nconnection.execute(\n    &quot;CREATE TABLE loans (id INTEGER PRIMARY KEY, book_id INTEGER REFERENCES books(id), member TEXT)&quot;\n)\n\nbooks = [(&quot;Noli Me Tangere&quot;, 4), (&quot;Cosmos&quot;, 2), (&quot;The Little Prince&quot;, 5)]\nconnection.executemany(&quot;INSERT INTO books (title, copies) VALUES (?, ?)&quot;, books)\nconnection.commit()\n\nmember = &quot;Maria&quot;\nconnection.execute(&quot;INSERT INTO loans (book_id, member) VALUES (?, ?)&quot;, (2, member))\nconnection.commit()\n\ntry:\n    connection.execute(&quot;INSERT INTO loans (book_id, member) VALUES (?, ?)&quot;, (99, &quot;Ben&quot;))\nexcept sqlite3.IntegrityError as error:\n    print(&quot;Couldn\'t lend book 99:&quot;, error)\n\nquery = &quot;&quot;&quot;\n    SELECT b.title, COUNT(l.id) AS on_loan\n    FROM books b\n    LEFT JOIN loans l ON l.book_id = b.id\n    GROUP BY b.id\n    ORDER BY b.title\n&quot;&quot;&quot;\nfor row in connection.execute(query):\n    print(f&quot;{row[\'title\']:&lt;18} on loan: {row[\'on_loan\']}&quot;)\n\nconnection.close()\n'"
/>

Two new details: a triple-quoted string from [Working with Strings](/lessons/python/strings) keeps a longer query readable, and looping over `connection.execute(...)` directly goes through the rows one at a time, without `fetchall()`.

::: info Running this program
Running Python right in the browser is coming to Syntaxia soon. If you have Python installed (see [Setting Up](/lessons/python/setting-up) in the Python track), save this as `library.py` and run it with `python library.py` (or `python3 library.py` on macOS and Linux). SQLite is already included with Python.
:::

::: details Check your prediction
```text
Couldn't lend book 99: FOREIGN KEY constraint failed
Cosmos             on loan: 1
Noli Me Tangere    on loan: 0
The Little Prince  on loan: 0
```

Because foreign keys were turned on in `connect()`, lending book 99, which doesn't exist, raised an `IntegrityError`. The report uses the `LEFT JOIN` and `COUNT(l.id)` pattern from [Combining Tables with JOIN](/lessons/sqlite3/joins), so books with no loans show 0.
:::

## Try it yourself

1. Change the program to use a real file, `library.db`. Run it twice. What error do you get the second time, and how would `CREATE TABLE IF NOT EXISTS` fix it?
2. Write a function `lend_book(connection, book_id, member)` that inserts a loan with placeholders and commits.
3. Ask the user for a title with `input()`, and print whether the library has it, using a `?` placeholder.

## Check your understanding

<Quiz
	question="What is the safe way to put a user&#39;s search text into a query?"
	:options="['An f-string: f&quot;... WHERE title = \'{text}\'&quot;', 'String concatenation with +', 'Remove the quotes from the text first', 'A ? placeholder, with the value passed separately as a tuple']"
	:answer-index="3"
	explanation="Placeholders send values as data, never as SQL, which prevents SQL injection and handles quotes safely."
/>

<Quiz
	question="Your program runs an INSERT, then ends. The next time, the row isn&#39;t there. What was missing?"
	:options="['A SELECT afterwards', 'connection.commit()', 'A semicolon', 'The PRAGMA']"
	:answer-index="1"
	explanation="The sqlite3 module keeps changes in an open transaction until you commit, or until a with block finishes normally."
/>

<Quiz
	question="What does fetchall() give back?"
	:options="['Only the first row', 'A list with one item per row', 'The number of rows', 'A single string']"
	:answer-index="1"
	explanation="fetchall returns a list of rows, each a tuple (or a sqlite3.Row, if you set the row_factory)."
/>

## Up next

That completes the SQLite Specifics chapter. You know SQL, and you know SQLite's own quirks. The last lesson before the final project collects the habits that keep databases fast, correct, and safe: [Best Practices and Common Mistakes](/lessons/sqlite3/best-practices).
