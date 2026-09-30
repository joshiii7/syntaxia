---
title: "SQL WHERE: Filter Rows with Conditions"
description: "Filter SQL results with WHERE: compare values, combine conditions with AND, OR, and NOT, and match lists, ranges, and patterns with IN, BETWEEN, and LIKE."
---

# Filtering Rows with WHERE

*A librarian doesn't bring you every book. You say "only the science books from after 1950," and that's exactly what comes back.*

In [SELECT: Reading Data](/lessons/sqlite3/select), every query returned every row of the table. You chose which **columns** to see, but never which **rows**. Usually, you only want some of them: the novels, the books with copies on the shelf, the loans that are overdue.

That's what **`WHERE`** does. It filters the rows, keeping only the ones that match a condition.

## A sieve

Think of a kitchen sieve. You pour everything in, and only what fits through the holes comes out the bottom. `WHERE` is the sieve: every row of the table goes in, the condition decides which ones get through, and only those appear in your result.

## Your first `WHERE`

`WHERE` goes after `FROM`, followed by a condition:

```sql
SELECT title, genre FROM books WHERE genre = 'Science';
```

```text
+-------------------------+---------+
|          title          |  genre  |
+-------------------------+---------+
| A Brief History of Time | Science |
| Cosmos                  | Science |
+-------------------------+---------+
```

For each row, the database checks the condition `genre = 'Science'`. Rows where it's true are kept; the rest are left out. The table itself isn't changed; only the answer is filtered.

A few details to notice:

- SQL uses a **single** `=` to compare. There's no `==` like in Python or JavaScript.
- Text values go in **single quotes**: `'Science'`.
- The column you filter on doesn't have to be one you show. `SELECT title FROM books WHERE genre = 'Science';` works fine.

## Comparison operators

| Operator | Means | Example |
|---|---|---|
| `=` | equal to | `genre = 'Novel'` |
| `<>` or `!=` | not equal to | `genre <> 'Novel'` |
| `<` | less than | `published_year < 1900` |
| `>` | greater than | `copies_owned > 3` |
| `<=` | less than or equal to | `copies_on_loan <= 1` |
| `>=` | greater than or equal to | `published_year >= 1980` |

`<>` is the standard SQL way to write "not equal," and it works in every database. Many databases, including SQLite, also accept `!=`.

```sql
SELECT title, published_year FROM books WHERE published_year >= 1980;
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| A Brief History of Time     |           1988 |
| Cosmos                      |           1980 |
| Smaller and Smaller Circles |           2002 |
+-----------------------------+----------------+
```

The comparison operators work on text too, comparing alphabetically, and on dates written as `'YYYY-MM-DD'`, which sort correctly as text. That's why the members query in [Your First Queries](/lessons/sqlite3/first-queries) could use `joined >= '2026-01-01'`.

Text comparisons with `=` care about capitals in SQLite: `author = 'jose rizal'` finds nothing, because the table says `Jose Rizal`. (MySQL, by default, ignores capitals here. [Coming from SQLite](/lessons/mysql/coming-from-sqlite) in the MySQL track explains.)

## Combining conditions: `AND`, `OR`, `NOT`

`AND` keeps a row only if **both** conditions are true:

```sql
SELECT title FROM books WHERE genre = 'Novel' AND published_year < 1900;
```

```text
+-------------------+
|       title       |
+-------------------+
| Noli Me Tangere   |
| El Filibusterismo |
+-------------------+
```

`OR` keeps a row if **either** condition is true:

```sql
SELECT title FROM books WHERE genre = 'Mystery' OR copies_on_loan = 0;
```

```text
+-----------------------------+
|            title            |
+-----------------------------+
| Cosmos                      |
| Smaller and Smaller Circles |
+-----------------------------+
```

`NOT` flips a condition: `WHERE NOT genre = 'Novel'` means the same as `WHERE genre <> 'Novel'`.

## Watch out: `AND` before `OR`

When you mix `AND` and `OR`, SQL does the `AND` first, the same way multiplication comes before addition. That can give surprising results. Say you want science books **or** mysteries, but only ones published after 1985:

```sql
SELECT title, published_year
FROM books
WHERE genre = 'Science' OR genre = 'Mystery' AND published_year > 1985;
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| A Brief History of Time     |           1988 |
| Cosmos                      |           1980 |
| Smaller and Smaller Circles |           2002 |
+-----------------------------+----------------+
```

*Cosmos*, from 1980, snuck in. SQL read it as "science, **or** (a mystery after 1985)," so every science book got through regardless of its year. Parentheses fix it:

```sql
SELECT title, published_year
FROM books
WHERE (genre = 'Science' OR genre = 'Mystery') AND published_year > 1985;
```

```text
+-----------------------------+----------------+
|            title            | published_year |
+-----------------------------+----------------+
| A Brief History of Time     |           1988 |
| Smaller and Smaller Circles |           2002 |
+-----------------------------+----------------+
```

Whenever you mix `AND` and `OR`, add parentheses. They make your meaning impossible to misread.

## Matching a list: `IN`

Checking one column against several values with a chain of `OR`s gets long. `IN` does it in one step:

```sql
SELECT title, genre FROM books WHERE genre IN ('Science', 'Mystery');
```

```text
+-----------------------------+---------+
|            title            |  genre  |
+-----------------------------+---------+
| A Brief History of Time     | Science |
| Cosmos                      | Science |
| Smaller and Smaller Circles | Mystery |
+-----------------------------+---------+
```

`NOT IN` keeps the rows whose value is *not* in the list.

## Matching a range: `BETWEEN`

`BETWEEN` checks for a value in a range, **including both ends**:

```sql
SELECT title, published_year FROM books WHERE published_year BETWEEN 1900 AND 1990;
```

```text
+-------------------------+----------------+
|          title          | published_year |
+-------------------------+----------------+
| The Little Prince       |           1943 |
| A Brief History of Time |           1988 |
| Cosmos                  |           1980 |
+-------------------------+----------------+
```

`published_year BETWEEN 1900 AND 1990` means exactly `published_year >= 1900 AND published_year <= 1990`.

## Matching patterns: `LIKE`

Sometimes you don't know the whole value. Which titles contain the word "the"? Which authors' names start with "C"? `LIKE` matches **patterns**, using two special characters:

- `%` means "any number of characters, including none."
- `_` means "exactly one character."

```sql
SELECT title FROM books WHERE title LIKE 'The%';
```

```text
+-------------------+
|       title       |
+-------------------+
| The Little Prince |
+-------------------+
```

`'The%'` means "starts with The." `'%Time'` would mean "ends with Time," and `'%and%'` means "contains and" anywhere:

```sql
SELECT title FROM books WHERE title LIKE '%and%';
```

```text
+-----------------------------+
|            title            |
+-----------------------------+
| Smaller and Smaller Circles |
+-----------------------------+
```

In SQLite, `LIKE` ignores capitals for the letters A to Z, so `'the%'` and `'The%'` match the same rows. That's not true in every database: Oracle's `LIKE` is case-sensitive, so check when you switch.

## Try it

The editor creates the `books` table from [SELECT: Reading Data](/lessons/sqlite3/select), then runs four filtered queries. Predict each result, row by row.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, where.sql"
	min-height="460px"
	:model-value="'CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, genre TEXT, published_year INTEGER, copies_owned INTEGER, copies_on_loan INTEGER);\n\nINSERT INTO books VALUES\n\t(1, \'Noli Me Tangere\', \'Jose Rizal\', \'Novel\', 1887, 4, 3),\n\t(2, \'El Filibusterismo\', \'Jose Rizal\', \'Novel\', 1891, 3, 1),\n\t(3, \'The Little Prince\', \'Antoine de Saint-Exupery\', \'Novel\', 1943, 5, 2),\n\t(4, \'A Brief History of Time\', \'Stephen Hawking\', \'Science\', 1988, 2, 2),\n\t(5, \'Cosmos\', \'Carl Sagan\', \'Science\', 1980, 2, 0),\n\t(6, \'Smaller and Smaller Circles\', \'F. H. Batacan\', \'Mystery\', 2002, 3, 1);\n\n-- Query 1: books with no copies left on the shelf\nSELECT title FROM books WHERE copies_owned - copies_on_loan = 0;\n\n-- Query 2\nSELECT title, author FROM books WHERE author LIKE \'%a%\' AND genre &lt;&gt; \'Novel\';\n\n-- Query 3\nSELECT title FROM books WHERE published_year NOT BETWEEN 1880 AND 1950;\n\n-- Query 4\nSELECT title FROM books WHERE (genre = \'Novel\' OR genre = \'Mystery\') AND copies_owned &gt;= 4;\n'"
/>

::: info Running SQL here
Running SQL right in the browser is coming to Syntaxia soon. For now, you can read and edit the queries here. To run them yourself, open the shell with `sqlite3`, type `.mode table`, and paste them in.
:::

::: details Check your prediction
```text
+-------------------------+
|          title          |
+-------------------------+
| A Brief History of Time |
+-------------------------+
+-----------------------------+-----------------+
|            title            |     author      |
+-----------------------------+-----------------+
| A Brief History of Time     | Stephen Hawking |
| Cosmos                      | Carl Sagan      |
| Smaller and Smaller Circles | F. H. Batacan   |
+-----------------------------+-----------------+
+-----------------------------+
|            title            |
+-----------------------------+
| A Brief History of Time     |
| Cosmos                      |
| Smaller and Smaller Circles |
+-----------------------------+
+-------------------+
|       title       |
+-------------------+
| Noli Me Tangere   |
| The Little Prince |
+-------------------+
```

Query 1 filters on a calculation: only *A Brief History of Time* has every copy out. In Query 2, `LIKE '%a%'` ignores capitals in SQLite, so Stephen Hawking, Carl Sagan, and F. H. Batacan all contain an "a," but only the non-novels are kept. Query 3 keeps the books outside 1880 to 1950. And in Query 4, the parentheses make sure `copies_owned >= 4` applies to both genres.
:::

## Try it yourself

1. Write a query for the books by Jose Rizal published after 1890.
2. Write a query for every book whose title has exactly six characters. (Hint: six `_`.)
3. Using your library database, find the loans that are due on or after `'2026-09-20'`.

## Check your understanding

<Quiz
	question="Which query finds books published before 1900?"
	:options="['SELECT title FROM books IF published_year &lt; 1900;', 'SELECT title WHERE published_year &lt; 1900 FROM books;', 'SELECT title FROM books WHERE published_year == 1900;', 'SELECT title FROM books WHERE published_year &lt; 1900;']"
	:answer-index="3"
	explanation="WHERE comes after FROM, and the condition uses a single comparison operator."
/>

<Quiz
	question="What does WHERE title LIKE &#39;%Time&#39; match?"
	:options="['Titles that start with Time', 'Titles that are exactly Time', 'Titles that end with Time', 'Titles with exactly four characters']"
	:answer-index="2"
	explanation="% stands for any number of characters, so %Time means anything, as long as it ends with Time."
/>

<Quiz
	question="Why add parentheses in WHERE (a OR b) AND c?"
	:options="['SQL does AND before OR, so without them it would mean a OR (b AND c)', 'They make the query faster', 'Parentheses are required around every OR', 'They make the text case-insensitive']"
	:answer-index="0"
	explanation="AND is done before OR. Parentheses make sure c applies to both a and b."
/>

## Up next

Your results so far have come out in whatever order the database chose. Next, you'll put them in the order you want, and ask for just the top few, in [Sorting and Limiting Results](/lessons/sqlite3/order-by-and-limit).
