---
title: "MySQL Users and Privileges: CREATE USER, GRANT, REVOKE, and Roles"
description: "Create MySQL accounts, give each only the access it needs with GRANT and REVOKE, check permissions with SHOW GRANTS, group them with roles, and follow the principle of least privilege."
---

# Users and Privileges

*A school gives the principal a master key, teachers a key to their own classrooms, and students none at all. Nobody hands out the master key just because it's easier.*

Up to now, you've connected as **root**, the account that can do anything. That's fine on your own laptop, but it's a bad habit for anything real. A website that connects as root can, if it's ever hacked, delete every database on the server.

MySQL lets you create separate **accounts**, and control exactly what each one may do. That's what this lesson is about. It's the part of MySQL that SQLite doesn't have at all, since anyone who can open a SQLite file can do anything with it.

The examples here have two databases on the server: `shop`, with a `products` table, and `hr`, with private `salaries`.

## An account is a name and a place

In MySQL, an account is written **`'name'@'host'`**: a username **and** where that user may connect from.

- `'app'@'localhost'` is the user `app`, connecting from the same computer as the server.
- `'app'@'192.168.1.20'` is the same name, but from one particular computer.
- `'app'@'%'` means from **anywhere**. The `%` is a wildcard.

`'app'@'localhost'` and `'app'@'%'` are two **different** accounts, with different passwords and permissions. Restricting the host is a cheap, useful safety measure: an account that can only connect from the web server can't be used from a stranger's laptop.

## Creating an account

```sql
CREATE USER 'app'@'localhost' IDENTIFIED BY 'S3cure-pass!';
SELECT user, host FROM mysql.user WHERE user = 'app';
```

```text
+------+-----------+
| user | host      |
+------+-----------+
| app  | localhost |
+------+-----------+
```

`CREATE USER` makes an account with a password, and **no permissions at all**, not even to see your tables. Use a long, unique password, and never one you use elsewhere. (MySQL doesn't force you to: try `IDENTIFIED BY 'abc'` and it will be accepted. The strength is up to you.)

In MySQL 9, new accounts use an authentication method called `caching_sha2_password`, which stores passwords securely. Very old client programs and libraries only know an older method, `mysql_native_password`, which MySQL 9 no longer loads. If an old program can't connect, updating its MySQL library is the fix.

## Giving permissions: GRANT

`GRANT` says what an account may do, and where:

```sql
CREATE USER 'app'@'localhost' IDENTIFIED BY 'S3cure-pass!';
GRANT SELECT, INSERT, UPDATE ON shop.* TO 'app'@'localhost';
SHOW GRANTS FOR 'app'@'localhost';
```

```text
+---------------------------------------------------------------+
| Grants for app@localhost                                      |
+---------------------------------------------------------------+
| GRANT USAGE ON *.* TO `app`@`localhost`                       |
| GRANT SELECT, INSERT, UPDATE ON `shop`.* TO `app`@`localhost` |
+---------------------------------------------------------------+
```

Read the `GRANT` as: "let `app` **read, add, and change** rows, on **every table in the `shop` database**."

- The **privileges** are things like `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP`, and `ALTER`. `ALL PRIVILEGES` gives everything for that scope.
- The **scope** comes after `ON`: `*.*` is everything on the server, `shop.*` is one database, and `shop.products` is one table. You can even limit it to certain columns.
- `USAGE` in the list of grants means "can connect, and nothing else."

The account changes take effect right away, and you don't need `FLUSH PRIVILEGES` after `GRANT`.

## What the account can, and can't, do

Connect as the new account, and try things:

```text
mysql -u app -p
```

```text
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| performance_schema |
| shop               |
+--------------------+

mysql> SELECT * FROM shop.products;
+----+------+
| id | name |
+----+------+
|  1 | Pen  |
+----+------+

mysql> DELETE FROM shop.products WHERE id = 1;
ERROR 1142 (42000): DELETE command denied to user 'app'@'localhost' for table 'products'

mysql> SELECT * FROM hr.salaries;
ERROR 1142 (42000): SELECT command denied to user 'app'@'localhost' for table 'salaries'

mysql> DROP TABLE shop.products;
ERROR 1142 (42000): DROP command denied to user 'app'@'localhost' for table 'products'
```

The account can see and change the shop's data, but it can't delete, and can't drop tables. The `hr` database is invisible to it: `SHOW DATABASES` doesn't even list it, and reading from it is denied. That's the whole idea. Even if someone steals this password, or finds a way to inject SQL into your website, the damage is limited to what `app` may do.

## Taking permissions away: REVOKE

`REVOKE` is the opposite of `GRANT`, and takes the same shape:

```sql
CREATE USER 'app'@'localhost' IDENTIFIED BY 'S3cure-pass!';
GRANT SELECT, INSERT, UPDATE ON shop.* TO 'app'@'localhost';
REVOKE INSERT ON shop.* FROM 'app'@'localhost';
SHOW GRANTS FOR 'app'@'localhost';
```

```text
+-------------------------------------------------------+
| Grants for app@localhost                              |
+-------------------------------------------------------+
| GRANT USAGE ON *.* TO `app`@`localhost`               |
| GRANT SELECT, UPDATE ON `shop`.* TO `app`@`localhost` |
+-------------------------------------------------------+
```

## The principle of least privilege

The rule that guides all of this is **least privilege**: give every account **only** what it needs to do its job, and nothing more.

- A website that only shows products needs `SELECT` on the tables it reads.
- A website that takes orders also needs `INSERT` on `orders`, and probably `UPDATE` on `products`.
- Almost no application needs `DROP`, `ALTER`, or `CREATE USER`. Keep those for a separate admin account used only when changing the database's structure.

A typical setup has one account for the app, one read-only account for reports, and root used only by you, for maintenance. And your PHP or Python code gets the **app** account's password, never root's.

```sql
CREATE USER 'report'@'localhost' IDENTIFIED BY 'R3ad-only!';
GRANT SELECT ON shop.products TO 'report'@'localhost';
SHOW GRANTS FOR 'report'@'localhost';
```

```text
+-----------------------------------------------------------+
| Grants for report@localhost                               |
+-----------------------------------------------------------+
| GRANT USAGE ON *.* TO `report`@`localhost`                |
| GRANT SELECT ON `shop`.`products` TO `report`@`localhost` |
+-----------------------------------------------------------+
```

## Roles: permissions in a package

When several accounts need the same permissions, granting each one by hand is tedious and error-prone. A **role** is a named bundle of permissions that you can hand out:

```sql
CREATE ROLE 'shop_readonly';
GRANT SELECT ON shop.* TO 'shop_readonly';

CREATE USER 'ana'@'localhost' IDENTIFIED BY 'An4-pass!';
CREATE USER 'ben'@'localhost' IDENTIFIED BY 'B3n-pass!';
GRANT 'shop_readonly' TO 'ana'@'localhost', 'ben'@'localhost';
SET DEFAULT ROLE ALL TO 'ana'@'localhost', 'ben'@'localhost';

SHOW GRANTS FOR 'ana'@'localhost';
SHOW GRANTS FOR 'ana'@'localhost' USING 'shop_readonly';
```

```text
+------------------------------------------------+
| Grants for ana@localhost                       |
+------------------------------------------------+
| GRANT USAGE ON *.* TO `ana`@`localhost`        |
| GRANT `shop_readonly`@`%` TO `ana`@`localhost` |
+------------------------------------------------+
+------------------------------------------------+
| Grants for ana@localhost                       |
+------------------------------------------------+
| GRANT USAGE ON *.* TO `ana`@`localhost`        |
| GRANT SELECT ON `shop`.* TO `ana`@`localhost`  |
| GRANT `shop_readonly`@`%` TO `ana`@`localhost` |
+------------------------------------------------+
```

The second `SHOW GRANTS` (with `USING`) shows what the role actually lets `ana` do. `SET DEFAULT ROLE ALL` makes the roles switch on automatically when she connects, since roles are off by default. To change what every reader can do, you change the role once, and everyone follows.

## Changing and removing accounts

```sql
CREATE USER 'app'@'localhost' IDENTIFIED BY 'S3cure-pass!';
ALTER USER 'app'@'localhost' IDENTIFIED BY 'N3w-pass!';
DROP USER 'app'@'localhost';
SELECT COUNT(*) AS app_accounts FROM mysql.user WHERE user = 'app';
```

```text
+--------------+
| app_accounts |
+--------------+
|            0 |
+--------------+
```

`ALTER USER` changes the password, and `DROP USER` deletes the account along with its permissions. The account list itself lives in a table called `mysql.user` inside MySQL's own `mysql` database. Read it if you like, but make changes only with `CREATE USER`, `GRANT`, and the other statements, never by editing those tables directly.

## Try it

A school is setting up MySQL accounts. Predict what each `SHOW GRANTS` shows once the script has run.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, accounts.sql"
	min-height="440px"
	:model-value="'CREATE USER \'website\'@\'localhost\' IDENTIFIED BY \'W3b-pass!\';\nGRANT SELECT, INSERT ON shop.* TO \'website\'@\'localhost\';\nGRANT UPDATE ON shop.products TO \'website\'@\'localhost\';\n\nCREATE USER \'auditor\'@\'%\' IDENTIFIED BY \'Aud1t-pass!\';\nGRANT SELECT ON hr.* TO \'auditor\'@\'%\';\nGRANT SELECT ON shop.* TO \'auditor\'@\'%\';\nREVOKE SELECT ON shop.* FROM \'auditor\'@\'%\';\n\nSHOW GRANTS FOR \'website\'@\'localhost\';\nSHOW GRANTS FOR \'auditor\'@\'%\';\n'"
/>

::: info Running MySQL here
Running MySQL right in the browser isn't possible yet, because MySQL needs a real server. Once yours is running (see [Installing MySQL Server](/lessons/mysql/setting-up)), create the two databases from the top of this lesson, and run the script as root in the `mysql` client.
:::

::: details Check your prediction
```text
+------------------------------------------------------------+
| Grants for website@localhost                               |
+------------------------------------------------------------+
| GRANT USAGE ON *.* TO `website`@`localhost`                |
| GRANT SELECT, INSERT ON `shop`.* TO `website`@`localhost`  |
| GRANT UPDATE ON `shop`.`products` TO `website`@`localhost` |
+------------------------------------------------------------+
+-----------------------------------------+
| Grants for auditor@%                    |
+-----------------------------------------+
| GRANT USAGE ON *.* TO `auditor`@`%`     |
| GRANT SELECT ON `hr`.* TO `auditor`@`%` |
+-----------------------------------------+
```

Each account starts with `USAGE` (connect only). The website can read and add rows anywhere in `shop`, and update only the `products` table. The auditor was granted `SELECT` on `hr` and `shop`, but the `REVOKE` took the `shop` one away again, so it can only read `hr`. Grants are listed per scope, which is why the website's permissions appear on two lines.
:::

## Try it yourself

1. Create a user `'cashier'@'localhost'` who can read `shop.products` and update only its `name` column. (Hint: a column list goes after the privilege, like `UPDATE (name)`.)
2. Connect as one of your accounts with `mysql -u name -p`, and try to read a table you didn't grant. What error do you get?
3. Change a role's permissions after giving it to two users. Does it change what both can do?

## Check your understanding

<Quiz
	question="What is the difference between 'app'@'localhost' and 'app'@'%'?"
	:options="['Nothing, they are the same account', 'They are two different accounts: one can only connect from the server itself, and the other from anywhere', 'The second is faster', 'The first is read-only']"
	:answer-index="1"
	explanation="An account is a name plus a host. Restricting the host limits where the account can be used from."
/>

<Quiz
	question="A new account is created with CREATE USER and no GRANT. What can it do?"
	:options="['Everything', 'Only read data', 'Nothing, it cannot even connect', 'Connect, and nothing else']"
	:answer-index="3"
	explanation="A fresh account has only USAGE: it can connect, but can't touch any data until it is granted privileges."
/>

<Quiz
	question="Why shouldn't a website connect to MySQL as root?"
	:options="['Root cannot connect from PHP', 'Root passwords are always weak', 'If the site is ever attacked, the attacker gets full control of every database', 'Root is slower']"
	:answer-index="2"
	explanation="Least privilege: give an app only the access it needs, so a break-in can only do limited damage."
/>

## Up next

Some jobs need several changes to succeed or fail together, like moving money between two accounts. That's the job of transactions, and of MySQL's storage engine, in [InnoDB, Transactions, and Locking](/lessons/mysql/innodb-and-transactions).
