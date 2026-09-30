---
title: "MySQL Final Project: Build an Online Store Database"
description: "Put the whole MySQL track to work by building an online store database: tables with keys and constraints, a report view, a safe stored procedure, a price-change trigger, least-privilege accounts, and a tested backup."
---

# Final Project: Online Store Database

*Every lesson gave you one tool. This project hands you the whole toolbox and a real job to do.*

Before the project, one more look back.

At the start of this track, you knew SQL from SQLite, and MySQL was a name on a download page. You weren't sure why it needed a server, or what a `root` account was.

Look at what you know now. You can install and start a server, and connect to it with a client. You choose the right type for every column, and know why `DECIMAL` holds money and `utf8mb4` holds text. You let `AUTO_INCREMENT` number your rows, and use keys and foreign keys to keep tables honest. You can upsert, use `ENUM` and `JSON`, and save your work as views, procedures, and triggers. You hand out permissions with the least privilege that works. You know what a transaction promises and how a deadlock happens, you can read an `EXPLAIN` plan, and you can take a backup and prove that it restores. You even connect to it from PHP, safely.

There were surely moments when nothing worked: a `library` that turned out to be a reserved word, a restore that failed with a GTID error, a lock that timed out. You read the message, found the cause, and fixed it. That's the real skill, and you have it now.

I'm genuinely proud of you. Let's build something.

## The project

You'll build the database for an **online store**: the kind of back room that a shop's website would sit on. It holds:

- **customers**, who place **orders**;
- **products** in three categories, with prices and stock;
- the **order items** in each order, with the price at the time of the sale.

And it comes with the things a real database needs: a **view** for reports, a **stored procedure** that places an order without overselling, a **trigger** that records price changes, **accounts** that can do only what they should, and a **backup** that you've tested.

It's a project for your own computer. Everything is one SQL script, `store.sql`, which you can run again and again to rebuild the whole database, plus a second script, `checks.sql`, which you'll use to test it.

## Getting set up

1. Make a folder called `online-store`, and open it in your code editor.
2. Create a file called `store.sql`, and paste in the starter code below.
3. Run it as root, from a terminal in that folder:

```text
mysql -u root -p < store.sql
```

The starter already runs. It creates the database and the `customers` table, adds five customers, and prints a message. Your job is to replace every `TODO`.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, store.sql"
	min-height="560px"
	:model-value="'-- Online Store Database: starter.\n-- Run as root:  mysql -u root -p &lt; store.sql\n\nDROP DATABASE IF EXISTS online_store;\nCREATE DATABASE online_store CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;\nUSE online_store;\n\n-- 1. Tables ---------------------------------------------------------------\n\nCREATE TABLE customers (\n    id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(60) NOT NULL,\n    email VARCHAR(100) NOT NULL UNIQUE,\n    joined_on DATE NOT NULL\n);\n\n-- TODO (requirement 1): create products, orders, order_items, and price_history.\n\n-- 2. Sample data ----------------------------------------------------------\n\nINSERT INTO customers (name, email, joined_on) VALUES\n    (\'Maria Santos\', \'maria@example.com\', \'2026-01-15\'),\n    (\'Ben Cruz\', \'ben@example.com\', \'2026-02-03\'),\n    (\'Carlo Reyes\', \'carlo@example.com\', \'2026-03-21\'),\n    (\'Dina Lim\', \'dina@example.com\', \'2026-05-09\'),\n    (\'Eli Tan\', \'eli@example.com\', \'2026-06-30\');\n\n-- TODO (requirement 2): insert products, orders, and order items.\n\n-- 3. Views ----------------------------------------------------------------\n\n-- TODO (requirement 3): create the order_totals view.\n\n-- 4. Stored procedure and trigger -------------------------------------------\n\n-- TODO (requirement 4): create the place_order procedure.\n-- TODO (requirement 5): create the price-change trigger.\n\n-- 6. Accounts ---------------------------------------------------------------\n\n-- TODO (requirement 6): create store_app and store_report with least privilege.\n\nSELECT \'Starter loaded. Customers: \' AS message, COUNT(*) AS customers FROM customers;\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. You can read and edit the starter code here, but build and run the project on your own computer. If MySQL isn't installed yet, [Installing MySQL Server](/lessons/mysql/setting-up) walks you through it.
:::

Work through the requirements in order, and re-run the whole script after each one. Small steps, tested often, are how every real database gets built. (The script starts with `DROP DATABASE IF EXISTS`, so re-running it rebuilds everything from scratch.)

## Requirements

Each requirement says what to build, **why** it matters, and which lessons to review.

### 1. Tables with the right types and keys

Create these tables, in this order (the ones that others point to come first):

- **`products`**: `id` (auto-numbered primary key), `sku` (up to 12 characters, required, unique), `name` (up to 80 characters), `category` (only `'school'`, `'home'`, or `'tech'`), `price` (exact, 2 decimals, never negative), and `stock` (a whole number that can't be negative, starting at 0).
- **`orders`**: `id` (auto-numbered primary key), `customer_id` (must be a real customer), `status` (`'pending'`, `'paid'`, `'shipped'`, or `'cancelled'`, defaulting to `'pending'`), and `ordered_at` (a date and time, defaulting to now). Add an index on `customer_id`.
- **`order_items`**: `order_id`, `product_id`, `quantity` (a whole number, more than 0), and `unit_price`. The primary key is the **pair** `(order_id, product_id)`. Deleting an order should delete its items, but a product that's been ordered must not be deletable.
- **`price_history`**: `id`, `product_id`, `old_price`, `new_price`, and `changed_at` (defaulting to now).

Every column that must have a value says `NOT NULL`.

**Why:** Good tables make bad data impossible. Notice that `unit_price` is copied into each order item: a customer's receipt must not change when you change the product's price later. Review: [Databases, Tables, and MySQL Data Types](/lessons/mysql/tables-and-types) and [AUTO_INCREMENT and Keys](/lessons/mysql/auto-increment).

### 2. Sample data

Insert 8 products (at least two per category, and one with `stock` of 0), and 6 orders with a mix of statuses, together with their items, so that every status appears at least once, and one customer has no orders at all. Give every `INSERT` a **column list**.

**Why:** A database with no data can't show you whether your queries are right. Review: [ENUM, SET, and JSON Columns](/lessons/mysql/enum-set-and-json) for `ENUM`, and [Best Practices and Common Mistakes](/lessons/mysql/best-practices) for explicit column lists.

### 3. A view for reports

Create a view `order_totals` with one row per order: the order's `order_id`, the customer's `customer` name, its `status`, `ordered_at`, the number of `items` in it, and the `total` price.

**Why:** Reports shouldn't repeat a three-table join every time. And a view lets you give someone access to the totals without giving them the customers' emails. Review: [Views, Stored Procedures, and Triggers](/lessons/mysql/views-procedures-and-triggers) and [MySQL Functions](/lessons/mysql/mysql-functions).

### 4. A safe way to place an order

Write a stored procedure `place_order(customer, sku, quantity, OUT order_id)` that, **inside one transaction**:

1. locks the product's row (`FOR UPDATE`);
2. refuses with a clear message if there's no such product, or not enough stock;
3. creates the order and its item, at the product's **current** price;
4. reduces the stock;
5. and, if anything at all goes wrong, **rolls back**, so a half-finished order never exists.

**Why:** This is the classic "don't sell the last item twice" problem, and doing it in one place, in the database, keeps every application honest. Review: [InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions) and [Views, Stored Procedures, and Triggers](/lessons/mysql/views-procedures-and-triggers) (`DECLARE EXIT HANDLER`, `SIGNAL`, `RESIGNAL`).

### 5. A trigger that keeps a history

Create a trigger that, whenever a product's **price** changes (and only then), adds a row to `price_history`. Changing the stock must not add a row.

**Why:** Prices change, and someone will eventually ask "when did this get more expensive?" Review: [Views, Stored Procedures, and Triggers](/lessons/mysql/views-procedures-and-triggers).

### 6. Least-privilege accounts

Create two accounts, both for `localhost`:

- **`store_app`**, for the shop's website. It may read everything, add and change customers, and run `place_order`. It must **not** be able to change products or drop anything.
- **`store_report`**, for the finance team. It may read **only** the `order_totals` view.

**Why:** If the website is ever attacked, the damage should be limited to what its account can do. Review: [Users and Privileges](/lessons/mysql/users-and-privileges).

### 7. Prove it works

Write a `checks.sql` script that tests it all. It should:

- report **revenue by category**, leaving out cancelled orders;
- list each customer and what they've **spent**, including customers with no orders;
- list products that need **restocking**;
- place orders with `place_order`: one that works, and ones that must be refused;
- change a product's price, and show the history;
- try to break each rule (a duplicate email, a bad category, a negative price, deleting a customer who has orders) and see the database refuse.

**Why:** A database you haven't tried to break isn't finished. Review: [MySQL Functions](/lessons/mysql/mysql-functions) for `COALESCE`, and [Query Performance with EXPLAIN](/lessons/mysql/explain) if you want to check your report queries use indexes.

### 8. A backup you have restored

Take a backup with `mysqldump`, including the procedure and trigger. Restore it into a **different** database called `restore_test`, and check that the row counts match, that `place_order` and the trigger are there, and that the view came across. Then drop `restore_test`.

**Why:** A backup you've never restored is only a hope. Review: [Backups with mysqldump](/lessons/mysql/backups).

## Sample run

Your data and wording don't have to match exactly, but your database should give results like these. This is what `checks.sql` from the reference solution prints when run after `store.sql`. (`ERROR` lines are the database refusing something on purpose. The numbers after `at line` are the line in `checks.sql`.)

```text
+----------+---------+
| category | revenue |
+----------+---------+
| tech     | 1299.00 |
| school   | 1261.00 |
| home     |  300.00 |
+----------+---------+
+--------------+--------+---------+
| name         | orders | spent   |
+--------------+--------+---------+
| Ben Cruz     |      2 | 1359.00 |
| Maria Santos |      2 | 1155.50 |
| Dina Lim     |      1 |  345.50 |
| Carlo Reyes  |      0 |    0.00 |
| Eli Tan      |      0 |    0.00 |
+--------------+--------+---------+
+---------+----------------+-------+
| sku     | name           | stock |
+---------+----------------+-------+
| CAB-800 | Charging cable |     0 |
| LMP-500 | Desk lamp      |    15 |
+---------+----------------+-------+
+--------------+
| new_order_id |
+--------------+
|            7 |
+--------------+
+----------+----------+---------+-------+--------+
| order_id | customer | status  | items | total  |
+----------+----------+---------+-------+--------+
|        7 | Eli Tan  | pending |     3 | 450.00 |
+----------+----------+---------+-------+--------+
+---------+-------+
| sku     | stock |
+---------+-------+
| MUG-400 |    57 |
+---------+-------+
ERROR 1644 (45000) at line 28: Not enough stock
ERROR 1644 (45000) at line 29: Not enough stock
ERROR 1644 (45000) at line 30: No such product
+------------+
| orders_now |
+------------+
|          7 |
+------------+
+---------+-----------+-----------+
| sku     | old_price | new_price |
+---------+-----------+-----------+
| PEN-200 |     12.00 |     59.00 |
+---------+-----------+-----------+
ERROR 1062 (23000) at line 39: Duplicate entry 'MARIA@example.com' for key 'customers.email'
ERROR 1265 (01000) at line 40: Data truncated for column 'category' at row 1
ERROR 3819 (HY000) at line 41: Check constraint 'products_chk_1' is violated.
ERROR 1451 (23000) at line 42: Cannot delete or update a parent row: a foreign key constraint fails (`online_store`.`orders`, CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`))
```

Some things to notice in it:

- Carlo's cancelled order isn't counted in what he has spent, and Eli has no orders at all, but both still appear, thanks to a `LEFT JOIN`.
- Eli's new order for three mugs cut the stock from 60 to 57, and the order total (450.00) came from the price at the time of the order.
- Ordering the out-of-stock cable, 99 desk lamps, and a product that doesn't exist all fail with a clear message, and the order count only went up by one.
- The trigger recorded the pen's price change, but not the later stock change.
- Each broken rule was refused by a different mechanism: a `UNIQUE` key, the `ENUM`, a `CHECK` constraint, and a foreign key.

## Testing your database

There's no automatic checker for this project, so you're the tester. Try each of these, and make sure the database does the right thing:

- Run `store.sql` twice in a row. It must work both times.
- Connect as `store_report`, and run `SELECT * FROM online_store.customers`. It must be denied. Then read from `order_totals`, which must work.
- Connect as `store_app` with `mysql -u store_app -p`, and try `UPDATE products SET price = 1`, `DROP TABLE orders`, and `CALL place_order(1, 'PEN-200', 2, @o)`. The first two must be denied, and the call must work. (A procedure runs with its creator's rights by default, which is why the app can use it without being allowed to write to `orders` itself.)
- Try to place an order for `0` items. What refuses it?
- Delete one order, and check that its items disappear with it (`ON DELETE CASCADE`).
- Restore your backup into `restore_test`, and compare `SELECT COUNT(*)` on each table in both databases.

## Stretch goals (optional, for the ambitious)

- Add a `returns` table, and a stored procedure that cancels an order and **puts the stock back**, all in one transaction.
- Let one order hold **several** products with `add_item(order_id, sku, quantity)`, keeping the stock check.
- Add an `EXPLAIN` to each report query, and add any index it needs. What changes?
- Add a `reviews` table with a rating from 1 to 5 (using a `CHECK`), and a view of each product's average rating.
- Store a `JSON` column of extra product details, like colors and sizes, and query it with `->>`.
- Write a small PHP page, following [Using MySQL from PHP with PDO](/lessons/mysql/mysql-in-php), that lists the products and lets a visitor order one, using the `store_app` account.
- Schedule your backup to run every night, and keep the last seven.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own database. Every "no" is just a pointer to your next improvement.

1. Can I rebuild the whole database from scratch by running one script?
2. Is every column the right type, with `NOT NULL` wherever a value is required?
3. Does the database refuse every kind of bad data I could think of, without help from any application?
4. Is a half-finished order impossible, even if something fails in the middle of `place_order`?
5. Could I explain what each account is allowed to do, and why?
6. Have I restored my backup, and checked that it's complete?
7. If I came back to this in six months, could I add a new table without being afraid of breaking the others?
8. Would I be happy to hand this database to a real shop?

If you answered yes to all eight, you've built a real, complete MySQL database. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good developers become great ones.

## Stuck? A reference solution

Try to finish on your own first. Struggling with a problem, and then solving it, is exactly how the skill sticks. But if you're truly stuck on one part, or you've finished and want to compare, here's one complete solution. It's not the only right answer; if yours works and reads clearly, it's just as good.

::: details Show the reference solution
`store.sql`:

```sql
-- Online Store Database: reference solution.
-- Run as root:  mysql -u root -p < store.sql

DROP DATABASE IF EXISTS online_store;
CREATE DATABASE online_store CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE online_store;

-- 1. Tables ---------------------------------------------------------------

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    joined_on DATE NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(12) NOT NULL UNIQUE,
    name VARCHAR(80) NOT NULL,
    category ENUM('school', 'home', 'tech') NOT NULL,
    price DECIMAL(8, 2) NOT NULL CHECK (price >= 0),
    stock INT UNSIGNED NOT NULL DEFAULT 0
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'pending',
    ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id),
    INDEX idx_orders_customer (customer_id)
);

CREATE TABLE order_items (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT UNSIGNED NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(8, 2) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    old_price DECIMAL(8, 2) NOT NULL,
    new_price DECIMAL(8, 2) NOT NULL,
    changed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sample data ----------------------------------------------------------

INSERT INTO customers (name, email, joined_on) VALUES
    ('Maria Santos', 'maria@example.com', '2026-01-15'),
    ('Ben Cruz', 'ben@example.com', '2026-02-03'),
    ('Carlo Reyes', 'carlo@example.com', '2026-03-21'),
    ('Dina Lim', 'dina@example.com', '2026-05-09'),
    ('Eli Tan', 'eli@example.com', '2026-06-30');

INSERT INTO products (sku, name, category, price, stock) VALUES
    ('NB-100', 'Notebook, 80 leaves', 'school', 45.50, 200),
    ('PEN-200', 'Gel pen, blue', 'school', 12.00, 500),
    ('BAG-300', 'School backpack', 'school', 899.00, 25),
    ('MUG-400', 'Café mug', 'home', 150.00, 60),
    ('LMP-500', 'Desk lamp', 'home', 749.00, 15),
    ('USB-600', 'USB flash drive, 64 GB', 'tech', 350.00, 80),
    ('MOU-700', 'Wireless mouse', 'tech', 599.00, 30),
    ('CAB-800', 'Charging cable', 'tech', 129.00, 0);

INSERT INTO orders (customer_id, status, ordered_at) VALUES
    (1, 'shipped', '2026-07-02 10:15:00'),
    (1, 'paid', '2026-08-14 18:40:00'),
    (2, 'shipped', '2026-08-20 09:05:00'),
    (3, 'cancelled', '2026-09-01 22:10:00'),
    (4, 'paid', '2026-09-12 14:30:00'),
    (2, 'pending', '2026-09-28 11:00:00');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
    (1, 1, 3, 45.50), (1, 2, 10, 12.00),
    (2, 3, 1, 899.00),
    (3, 6, 2, 350.00), (3, 7, 1, 599.00),
    (4, 5, 1, 749.00),
    (5, 4, 2, 150.00), (5, 1, 1, 45.50),
    (6, 2, 5, 12.00);

-- 3. A view for reports ---------------------------------------------------

CREATE VIEW order_totals AS
SELECT
    o.id AS order_id,
    c.name AS customer,
    o.status,
    o.ordered_at,
    SUM(i.quantity) AS items,
    SUM(i.quantity * i.unit_price) AS total
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN order_items i ON i.order_id = o.id
GROUP BY o.id, c.name, o.status, o.ordered_at;

-- 4. A stored procedure that places an order safely ------------------------

DELIMITER $$

CREATE PROCEDURE place_order(
    IN p_customer INT,
    IN p_sku VARCHAR(12),
    IN p_quantity INT UNSIGNED,
    OUT p_order_id INT
)
BEGIN
    DECLARE v_product INT;
    DECLARE v_price DECIMAL(8, 2);
    DECLARE v_stock INT UNSIGNED;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT id, price, stock INTO v_product, v_price, v_stock
    FROM products WHERE sku = p_sku FOR UPDATE;

    IF v_product IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No such product';
    END IF;
    IF v_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Not enough stock';
    END IF;

    INSERT INTO orders (customer_id, status) VALUES (p_customer, 'pending');
    SET p_order_id = LAST_INSERT_ID();
    INSERT INTO order_items (order_id, product_id, quantity, unit_price)
    VALUES (p_order_id, v_product, p_quantity, v_price);
    UPDATE products SET stock = stock - p_quantity WHERE id = v_product;

    COMMIT;
END$$

-- 5. A trigger that records price changes -----------------------------------

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

-- 6. Accounts with least privilege ------------------------------------------

DROP USER IF EXISTS 'store_app'@'localhost';
DROP USER IF EXISTS 'store_report'@'localhost';

CREATE USER 'store_app'@'localhost' IDENTIFIED BY 'St0re-App-pass!';
GRANT SELECT ON online_store.* TO 'store_app'@'localhost';
GRANT INSERT, UPDATE ON online_store.customers TO 'store_app'@'localhost';
GRANT EXECUTE ON PROCEDURE online_store.place_order TO 'store_app'@'localhost';

CREATE USER 'store_report'@'localhost' IDENTIFIED BY 'St0re-Report-pass!';
GRANT SELECT ON online_store.order_totals TO 'store_report'@'localhost';
```

`checks.sql`:

```sql
USE online_store;

-- Revenue by category, leaving out cancelled orders.
SELECT p.category, SUM(i.quantity * i.unit_price) AS revenue
FROM order_items i
JOIN orders o ON o.id = i.order_id
JOIN products p ON p.id = i.product_id
WHERE o.status <> 'cancelled'
GROUP BY p.category
ORDER BY revenue DESC;

-- Customers and what they've spent (not counting cancelled orders).
SELECT c.name, COUNT(t.order_id) AS orders, COALESCE(SUM(t.total), 0) AS spent
FROM customers c
LEFT JOIN order_totals t ON t.customer = c.name AND t.status <> 'cancelled'
GROUP BY c.id, c.name
ORDER BY spent DESC, c.name;

-- Products that need restocking.
SELECT sku, name, stock FROM products WHERE stock < 20 ORDER BY stock, sku;

-- Place orders through the procedure.
CALL place_order(5, 'MUG-400', 3, @first_order);
SELECT @first_order AS new_order_id;
SELECT order_id, customer, status, items, total FROM order_totals WHERE order_id = @first_order;
SELECT sku, stock FROM products WHERE sku = 'MUG-400';

CALL place_order(5, 'CAB-800', 1, @second_order);
CALL place_order(5, 'LMP-500', 99, @third_order);
CALL place_order(5, 'NOPE-1', 1, @fourth_order);
SELECT COUNT(*) AS orders_now FROM orders;

-- The price trigger.
UPDATE products SET price = 59.00 WHERE sku = 'PEN-200';
UPDATE products SET stock = stock + 10 WHERE sku = 'PEN-200';
SELECT p.sku, h.old_price, h.new_price FROM price_history h JOIN products p ON p.id = h.product_id;

-- Rules that must hold.
INSERT INTO customers (name, email, joined_on) VALUES ('Maria Again', 'MARIA@example.com', '2026-10-01');
INSERT INTO products (sku, name, category, price) VALUES ('BAD-1', 'Broken', 'toys', 10);
INSERT INTO products (sku, name, category, price) VALUES ('BAD-2', 'Negative', 'home', -5);
DELETE FROM customers WHERE id = 1;
```

The backup and restore steps run in your terminal:

```text
mysqldump -u root -p --single-transaction --routines --triggers --set-gtid-purged=OFF online_store > online_store.sql
mysql -u root -p -e "CREATE DATABASE restore_test"
mysql -u root -p restore_test < online_store.sql
mysql -u root -p -e "SELECT COUNT(*) FROM restore_test.orders; SELECT ROUTINE_NAME FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'restore_test'"
mysql -u root -p -e "DROP DATABASE restore_test"
```
:::

## Check your understanding

<Quiz
	question="Why is unit_price copied into order_items, instead of reading the price from products?"
	:options="['To save disk space', 'So that a past order keeps the price the customer actually paid, even if the product\'s price changes later', 'Because products has no price column', 'Because DECIMAL cannot be used in joins']"
	:answer-index="1"
	explanation="A receipt must not change when the product's price does. Copying the price at the time of sale keeps the history right."
/>

<Quiz
	question="Inside place_order, why is the product row read with FOR UPDATE?"
	:options="['It makes the query faster', 'It locks the row until the transaction ends, so two customers cannot both buy the last item', 'It hides the row from other tables', 'It is required by SIGNAL']"
	:answer-index="1"
	explanation="Without the lock, two concurrent orders could both read the same stock number and both succeed."
/>

<Quiz
	question="The store_app account has no INSERT permission on orders, yet CALL place_order works. Why?"
	:options="['It is a bug in MySQL', 'store_app has hidden privileges', 'Procedures ignore all permissions', 'The procedure runs with the rights of the account that created it, not the caller']"
	:answer-index="3"
	explanation="By default, a stored procedure runs with its definer's privileges, so the app only needs permission to run the procedure."
/>

## Where you go from here

You've finished the MySQL track. Take a moment with that. You started by wondering why a database needed a server, and you've just built one that a real shop could run on: protected, tested, and backed up.

MySQL opens a lot of doors from here. Every **PHP** application in the wild can use what you know now, and [WordPress](/lessons/wordpress/introduction) stores its whole site in tables just like these. To go further with the database itself, look into **replication** (keeping copies of a server), **partitioning** for enormous tables, **performance tuning** with the `EXPLAIN` skills you have, and **managed MySQL** in the cloud. And if you're curious about how another big database compares, [Oracle Database](/lessons/oracle-database/introduction) uses the same core SQL, with its own ideas about schemas, PL/SQL, and packages.

Whichever way you go, the ideas you've learned here, choosing the right types, letting the database enforce the rules, least privilege, transactions, and the habit of testing your restores, travel with you into every database you'll ever use. Well done.
