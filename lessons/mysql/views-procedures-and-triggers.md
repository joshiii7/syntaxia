---
title: "MySQL Views, Stored Procedures, Functions, and Triggers"
description: "Save queries as views, package logic as stored procedures and functions with DELIMITER, and run code automatically with triggers: audit logs, validation with SIGNAL, and when to avoid them."
---

# Views, Stored Procedures, and Triggers

*A recipe card saves you from remembering every step. A kitchen timer does something for you automatically when the time's up. MySQL has both: saved queries and saved programs.*

So far, every query you've written was typed, run, and forgotten. MySQL can **store** things on the server itself:

- A **view** is a saved `SELECT`, which you use like a table.
- A **stored procedure** is a saved set of statements you run with `CALL`.
- A **stored function** is a saved calculation you use inside queries.
- A **trigger** is code that MySQL runs **automatically** when a row is inserted, updated, or deleted.

The examples use a small store database:

## Views: a saved query

You've written this query, joining orders to customers and products, several times. A **view** saves it under a name:

```sql
CREATE VIEW order_details AS
SELECT
    o.id AS order_id,
    c.name AS customer,
    p.name AS product,
    o.quantity,
    o.quantity * p.price AS line_total,
    o.ordered_on
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN products p ON p.id = o.product_id;

SELECT * FROM order_details WHERE customer = 'Maria';
```

```text
+----------+----------+----------+----------+------------+------------+
| order_id | customer | product  | quantity | line_total | ordered_on |
+----------+----------+----------+----------+------------+------------+
|        1 | Maria    | Backpack |        1 |     899.00 | 2026-09-03 |
|        2 | Maria    | Notebook |        3 |     136.50 | 2026-09-20 |
+----------+----------+----------+----------+------------+------------+
```

A view holds no data of its own. Each time you use it, MySQL runs the saved query on the current tables, so it's always up to date. Views are handy for:

- **Simplifying**: hide a long join behind a simple name.
- **Protecting**: show a user only some columns, without giving access to the whole table (see [Users and Privileges](/lessons/mysql/users-and-privileges)).
- **Consistency**: the calculation `quantity * price` is written once.

To change a view, use `CREATE OR REPLACE VIEW`. To remove one, `DROP VIEW order_details;`.

## Stored procedures: a saved program

A **stored procedure** is a named block of SQL statements, saved in the database. It can take **parameters**, and you run it with `CALL`. Here's one that places an order and reduces the stock:

```sql
DELIMITER $$

CREATE PROCEDURE place_order(IN p_customer INT, IN p_product INT, IN p_qty INT)
BEGIN
    UPDATE products SET stock = stock - p_qty WHERE id = p_product;
    INSERT INTO orders (customer_id, product_id, quantity, ordered_on)
    VALUES (p_customer, p_product, p_qty, '2026-10-15');
END$$

DELIMITER ;

CALL place_order(2, 1, 2);
SELECT id, name, stock FROM products WHERE id = 1;
SELECT id, customer_id, product_id, quantity FROM orders ORDER BY id DESC LIMIT 1;
```

```text
+----+----------+-------+
| id | name     | stock |
+----+----------+-------+
|  1 | Backpack |     8 |
+----+----------+-------+
+----+-------------+------------+----------+
| id | customer_id | product_id | quantity |
+----+-------------+------------+----------+
|  4 |           2 |          1 |        2 |
+----+-------------+------------+----------+
```

The odd part is **`DELIMITER`**. The client normally treats `;` as "end of statement", but a procedure's body contains many statements, each ending in `;`. `DELIMITER $$` tells the client to use `$$` as the end marker for a while, so the whole `CREATE PROCEDURE ... END$$` is sent as one piece. `DELIMITER ;` switches back. It's a feature of the client, not of SQL, so you won't need it when creating procedures from PHP.

Some things to notice:

- Parameters have a direction: `IN` (a value going in, the default), `OUT` (a value coming back), or `INOUT` (both). A common habit is a `p_` prefix so parameter names never clash with column names.
- Inside `BEGIN ... END`, you can use variables (`DECLARE`), `IF`, loops, and more.

## Procedures with logic and OUT parameters

```sql
DELIMITER $$

CREATE PROCEDURE restock(IN p_product INT, IN p_amount INT, OUT p_new_stock INT)
BEGIN
    DECLARE current_stock INT;

    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Restock amount must be positive';
    END IF;

    SELECT stock INTO current_stock FROM products WHERE id = p_product;
    SET p_new_stock = current_stock + p_amount;
    UPDATE products SET stock = p_new_stock WHERE id = p_product;
END$$

DELIMITER ;

CALL restock(3, 25, @result);
SELECT @result AS new_stock;
CALL restock(3, -5, @result);
```

```text
+-----------+
| new_stock |
+-----------+
|        25 |
+-----------+
ERROR 1644 (45000) at line 20: Restock amount must be positive
```

- `DECLARE` makes a local variable, and `SET` or `SELECT ... INTO` fills it.
- `SIGNAL SQLSTATE '45000'` raises **your own error**, with a message. `45000` is the code MySQL reserves for "an error defined by you." The procedure stops right there.
- `@result` is a **user variable**: a name that starts with `@`, and lasts as long as your connection. It's how you catch an `OUT` value.

## Stored functions: a saved calculation

A **function** returns one value, and can be used inside any query, like the built-in ones from [MySQL Functions](/lessons/mysql/mysql-functions):

```sql
DELIMITER $$

CREATE FUNCTION price_with_vat(p_price DECIMAL(8, 2)) RETURNS DECIMAL(8, 2)
DETERMINISTIC
BEGIN
    RETURN ROUND(p_price * 1.12, 2);
END$$

DELIMITER ;

SELECT name, price, price_with_vat(price) AS with_vat FROM products ORDER BY id;
```

```text
+----------+--------+----------+
| name     | price  | with_vat |
+----------+--------+----------+
| Backpack | 899.00 |  1006.88 |
| Notebook |  45.50 |    50.96 |
| Pen      |  12.00 |    13.44 |
+----------+--------+----------+
```

`DETERMINISTIC` promises that the same input always gives the same output (unlike `NOW()`), which helps MySQL run it faster and safely. Procedures are called with `CALL`. Functions are used inside expressions.

## Triggers: code that runs by itself

A **trigger** is attached to a table, and runs automatically **before** or **after** a row is inserted, updated, or deleted. Inside it, `NEW` is the row's new values, and `OLD` is the values before the change.

The classic use is an **audit log**: a record of who changed what.

```sql
CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    old_price DECIMAL(8, 2) NOT NULL,
    new_price DECIMAL(8, 2) NOT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$

CREATE TRIGGER log_price_change
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF OLD.price <> NEW.price THEN
        INSERT INTO price_history (product_id, old_price, new_price)
        VALUES (OLD.id, OLD.price, NEW.price);
    END IF;
END$$

DELIMITER ;

UPDATE products SET price = 950.00 WHERE name = 'Backpack';
UPDATE products SET stock = stock + 5 WHERE name = 'Backpack';
SELECT product_id, old_price, new_price FROM price_history;
```

```text
+------------+-----------+-----------+
| product_id | old_price | new_price |
+------------+-----------+-----------+
|          1 |    899.00 |    950.00 |
+------------+-----------+-----------+
```

Only the price change was logged. The stock change didn't trigger a record, because the `IF` checks that the price actually changed. `FOR EACH ROW` means the trigger runs once per affected row.

A **BEFORE** trigger can also check or fix a value before it's saved, and refuse it with `SIGNAL`:

```sql
DELIMITER $$

CREATE TRIGGER check_order_quantity
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.quantity < 1 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An order must be for at least 1 item';
    END IF;
END$$

DELIMITER ;

INSERT INTO orders (customer_id, product_id, quantity, ordered_on) VALUES (1, 2, 0, '2026-10-15');
```

```text
ERROR 1644 (45000) at line 14: An order must be for at least 1 item
```

## Use them wisely

These features are powerful, and easy to overuse:

- **Views** are almost always a good idea.
- **Stored procedures** keep logic close to the data, and can be faster for heavy jobs. But the logic lives in the database, away from your application code, where it's harder to test, version, and debug. Many teams keep most logic in the application (like PHP) and use procedures sparingly.
- **Triggers** are the riskiest. They run **invisibly**: someone reading your application code has no idea an `UPDATE` also inserts a row somewhere else. Use them for simple, universal jobs like audit logs, and document them.
- Show what's stored with `SHOW CREATE PROCEDURE name;`, `SHOW TRIGGERS;`, and `SHOW FULL TABLES WHERE Table_type = 'VIEW';`.

## Try it

A view, a function, and a trigger, all together. Predict each result.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, store.sql"
	min-height="480px"
	:model-value="'CREATE VIEW low_stock AS\nSELECT id, name, stock FROM products WHERE stock &lt; 20;\n\nDELIMITER $$\n\nCREATE FUNCTION stock_label(p_stock INT) RETURNS VARCHAR(10)\nDETERMINISTIC\nBEGIN\n    RETURN IF(p_stock = 0, \'sold out\', IF(p_stock &lt; 20, \'low\', \'ok\'));\nEND$$\n\nCREATE TRIGGER take_stock\nAFTER INSERT ON orders\nFOR EACH ROW\nBEGIN\n    UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;\nEND$$\n\nDELIMITER ;\n\nSELECT name, stock, stock_label(stock) AS label FROM products ORDER BY id;\n\nINSERT INTO orders (customer_id, product_id, quantity, ordered_on) VALUES (1, 1, 4, \'2026-10-15\');\nINSERT INTO orders (customer_id, product_id, quantity, ordered_on) VALUES (2, 2, 85, \'2026-10-15\');\n\nSELECT * FROM low_stock ORDER BY id;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), create the tables from the top of this lesson, and run this script in the `mysql` client.
:::

::: details Check your prediction
```text
+----------+-------+----------+
| name     | stock | label    |
+----------+-------+----------+
| Backpack |    10 | low      |
| Notebook |   100 | ok       |
| Pen      |     0 | sold out |
+----------+-------+----------+
+----+----------+-------+
| id | name     | stock |
+----+----------+-------+
|  1 | Backpack |     6 |
|  2 | Notebook |    15 |
|  3 | Pen      |     0 |
+----+----------+-------+
```

The first query labels each product: the Backpack (10) is low, the Notebook (100) is fine, and the Pen (0) is sold out. The trigger then takes stock automatically after each order: the Backpack drops from 10 to 6, and the Notebook from 100 to 15. Now all three products are below 20, so the view lists all of them, and it always reflects the current stock.
:::

## Try it yourself

1. Write a view `customer_totals` that shows each customer's name and the total they've spent.
2. Add an `AFTER DELETE` trigger on `orders` that puts the stock back. Test it by deleting an order.
3. Look up what happens if you try to `INSERT` into a view that joins several tables. Why might it be refused?

## Check your understanding

<Quiz
	question="What is a view?"
	:options="['A saved SELECT that you use like a table, and always shows current data', 'A copy of a table', 'A backup file', 'A kind of index']"
	:answer-index="0"
	explanation="A view stores a query, not data. Each time you use it, MySQL runs the query on the current tables."
/>

<Quiz
	question="Why do stored procedures need DELIMITER in the mysql client?"
	:options="['The procedure body contains semicolons, which the client would otherwise treat as the end of the statement', 'Procedures can only contain one statement', 'Delimiters make procedures faster', 'It is required by the server for all statements']"
	:answer-index="0"
	explanation="DELIMITER changes the client's end-of-statement marker, so the whole procedure is sent as one piece. It's a client feature, not SQL."
/>

<Quiz
	question="In a trigger, what do OLD and NEW refer to?"
	:options="['The old and new versions of the table', 'The first and last rows', 'The values of the row before and after the change', 'The old and new database versions']"
	:answer-index="2"
	explanation="OLD holds the row's values before an update or delete. NEW holds the values about to be saved by an insert or update."
/>

## Up next

Everything so far used the all-powerful root account. Real servers give each person and program only the access they need, in [Users and Privileges](/lessons/mysql/users-and-privileges).
