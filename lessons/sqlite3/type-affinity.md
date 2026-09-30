---
title: "SQLite Type Affinity and STRICT Tables Explained"
description: "Understand SQLite's flexible typing: why a column's type is only a preference, how typeof() reveals what's really stored, and how STRICT tables enforce types."
---

# Type Affinity and STRICT Tables

*A labeled box in a shared fridge says "Maria's lunch." It's a strong hint, but nothing actually stops someone from putting a soda in it.*

In [Creating Tables](/lessons/sqlite3/create-table), you gave every column a type, like `INTEGER` or `TEXT`. In MySQL, Oracle, and most other databases, that type is a firm rule: try to put the text `'abc'` into a whole-number column, and you get an error.

SQLite is different, and it surprises almost everyone the first time. In an ordinary SQLite table, a column's type is only a **preference**. This lesson shows what that means, why SQLite works this way, and how to switch on strict rules when you want them.

## A label, not a lock

Picture a shared office fridge where each shelf has a label: "drinks," "lunches," "desserts." Most people follow the labels. But the labels are just stickers. If someone puts a cake on the drinks shelf, the fridge doesn't stop them. At best, a helpful coworker might move an obviously misplaced item to the right shelf.

An ordinary SQLite column type works like that label:

- If a value **can** be sensibly converted to the column's type, SQLite converts it, like the helpful coworker.
- If it **can't**, SQLite stores the value as it is, of whatever type it is.

This preference is called the column's **type affinity**.

## Seeing what's really stored: `typeof()`

The `typeof()` function tells you what type a stored value actually has:

```sql
CREATE TABLE things (amount INTEGER);
INSERT INTO things VALUES (42), ('17'), ('abc'), (3.5);
SELECT amount, typeof(amount) FROM things;
```

```text
+--------+----------------+
| amount | typeof(amount) |
+--------+----------------+
|     42 | integer        |
|     17 | integer        |
| abc    | text           |
|    3.5 | real           |
+--------+----------------+
```

Look at each row:

- `42` is a whole number, so it's stored as an `integer`.
- `'17'` is text, but it looks like a whole number, so SQLite converted it to the `integer` 17. That's the affinity at work.
- `'abc'` can't be turned into a number, so SQLite stored it as `text`, right there in an `INTEGER` column, with no error.
- `3.5` isn't a whole number, so it stayed a `real`.

One column, three different types. In MySQL or Oracle, the `'abc'` row would have been refused.

## Why would anyone want that?

SQLite was designed to be small, forgiving, and easy to embed in other programs, and in its early days, flexible typing was a deliberate choice. It still has some real uses: a column can hold "whatever the user typed," and data imported from messy files goes in without errors.

But for most applications, it's a trap. A typo like `'1O'` (with a letter O) in a price column goes in silently, and then math on that column quietly gives wrong answers, or sorting puts the text values in strange places:

```sql
CREATE TABLE prices (item TEXT, price INTEGER);
INSERT INTO prices VALUES ('adobo', 65), ('rice', '1O'), ('juice', 20);
SELECT item, price FROM prices ORDER BY price;
SELECT SUM(price) AS total FROM prices;
```

```text
+-------+-------+
| item  | price |
+-------+-------+
| juice |    20 |
| adobo |    65 |
| rice  | 1O    |
+-------+-------+
+-------+
| total |
+-------+
|  86.0 |
+-------+
```

The text `'1O'` sorts after all the numbers, and `SUM` treats it as 0, so the total is quietly wrong. Nothing warned anyone.

## Type names from other databases

Because affinity is only a preference, SQLite accepts almost any type name, and works out an affinity from it. The rules are based on the words in the name:

| If the type name contains... | Affinity | Examples |
|---|---|---|
| `INT` | INTEGER | `INT`, `BIGINT`, `SMALLINT` |
| `CHAR`, `CLOB`, or `TEXT` | TEXT | `VARCHAR(100)`, `CHAR(2)` |
| `BLOB`, or no type at all | BLOB (store as given) | `BLOB` |
| `REAL`, `FLOA`, or `DOUB` | REAL | `DOUBLE`, `FLOAT` |
| anything else | NUMERIC | `DECIMAL(10,2)`, `BOOLEAN`, `DATE` |

That's why table definitions written for MySQL, with types like `VARCHAR(100)` and `DECIMAL(10,2)`, usually run in SQLite unchanged. But notice: the `100` in `VARCHAR(100)` is **ignored**. SQLite won't stop you from storing a 500-character name in it.

## `STRICT` tables

Since version 3.37 (from 2021), SQLite has a way to make column types into real rules: add the word **`STRICT`** after the closing parenthesis of `CREATE TABLE`:

```sql
CREATE TABLE prices (item TEXT, price INTEGER) STRICT;
INSERT INTO prices VALUES ('adobo', 65);
INSERT INTO prices VALUES ('rice', '1O');  -- error: cannot store TEXT value in INTEGER column prices.price
```

Now a value of the wrong type is refused, just like in MySQL or Oracle. (Text that looks exactly like a number, such as `'17'`, is still converted, since nothing is lost.)

A `STRICT` table only allows these types: `INTEGER` (or `INT`), `REAL`, `TEXT`, `BLOB`, and `ANY`, for a column that should deliberately accept anything. Names like `VARCHAR(100)` aren't allowed in a strict table, which makes it obvious that the length limit was never going to be enforced.

## Which should you use?

For new tables you design yourself, **use `STRICT`**. It catches mistakes the moment they happen, the same way constraints from [Primary Keys, Foreign Keys, and Constraints](/lessons/sqlite3/keys-and-constraints) do, and it makes SQLite behave like other databases, so your SQL habits carry over.

The rest of this track mostly uses ordinary tables, because that's what you'll meet in existing SQLite databases and tutorials, and they're what every SQLite version understands. When you build your own projects, like this track's final project, reach for `STRICT`.

## Try it

This creates the same small table twice, once ordinary and once `STRICT`, and inserts the same four values into each. Predict what's stored in each table, and which inserts fail.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, affinity.sql"
	min-height="400px"
	:model-value="'CREATE TABLE loose (score INTEGER);\nCREATE TABLE strict_scores (score INTEGER) STRICT;\n\nINSERT INTO loose VALUES (90), (\'85\'), (\'eighty\'), (77.5);\n\nINSERT INTO strict_scores VALUES (90);\nINSERT INTO strict_scores VALUES (\'85\');\nINSERT INTO strict_scores VALUES (\'eighty\');\nINSERT INTO strict_scores VALUES (77.5);\n\nSELECT score, typeof(score) FROM loose;\nSELECT score, typeof(score) FROM strict_scores;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the statements here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
Error near line 8: cannot store TEXT value in INTEGER column strict_scores.score
Error near line 9: cannot store REAL value in INTEGER column strict_scores.score
+--------+---------------+
| score  | typeof(score) |
+--------+---------------+
|     90 | integer       |
|     85 | integer       |
| eighty | text          |
|   77.5 | real          |
+--------+---------------+
+-------+---------------+
| score | typeof(score) |
+-------+---------------+
|    90 | integer       |
|    85 | integer       |
+-------+---------------+
```

The ordinary table accepts all four values: `'85'` becomes a number, but `'eighty'` stays text and `77.5` stays a decimal. The strict table refuses `'eighty'` and `77.5`, since neither can be stored as a whole number without changing it, but it still converts `'85'`, because nothing is lost.
:::

## Try it yourself

1. Insert `'  42  '` (with spaces) into the ordinary table. What does `typeof()` say? Is that what you expected?
2. Recreate your library's `members` table as a `STRICT` table, and try inserting a member whose grade is `'eleven'`.
3. Why might a `STRICT` table be a better choice for a school's grades table than an ordinary one? Write down two reasons.

## Check your understanding

<Quiz
	question="In an ordinary SQLite table, what happens when you insert &#39;abc&#39; into an INTEGER column?"
	:options="['An error', 'It is stored as the text abc', 'It is stored as 0', 'It becomes NULL']"
	:answer-index="1"
	explanation="An ordinary column's type is only a preference. Text that can't be converted to a number is stored as text."
/>

<Quiz
	question="What does typeof(value) do?"
	:options="['Changes the type of a value', 'Creates a new type', 'Tells you the type the value is actually stored as', 'Checks whether a column exists']"
	:answer-index="2"
	explanation="typeof shows what's really stored, such as integer, real, text, blob, or null."
/>

<Quiz
	question="How do you make SQLite enforce column types?"
	:options="['Add STRICT after the closing parenthesis of CREATE TABLE', 'Use VARCHAR instead of TEXT', 'Run PRAGMA types = ON;', 'You can\'t']"
	:answer-index="0"
	explanation="A STRICT table refuses values that don't match the column's type, like other databases do."
/>

## Up next

You've met one `PRAGMA` already: the one that switches on foreign keys. SQLite has many more settings like it, which control how a database behaves and let you peek inside it. That's [SQLite Settings with PRAGMA](/lessons/sqlite3/pragma).
