---
title: "Oracle Schemas, Users, and Privileges: CREATE USER, GRANT, and Roles"
description: "Understand how Oracle organizes data by user and schema, create accounts with CREATE USER, control access with system and object privileges, roles, and synonyms, and explore the data dictionary."
---

# Schemas, Users, and Privileges

*A large office building has floors, and each company rents one. Employees carry a badge that opens their own floor, and maybe a few doors on other floors. In Oracle, a floor is a schema, and the badge is a set of privileges.*

In [Coming from SQLite](/lessons/oracle-database/coming-from-sqlite), you learned that Oracle groups tables differently from SQLite and MySQL. Now let's look at how that works, and how Oracle decides who may do what.

## User and schema: one name, two roles

In Oracle, every **user** (account) automatically has a **schema**: the collection of objects (tables, views, sequences, and more) that the user **owns**. The user and the schema have the same name, so people use the words almost interchangeably.

When you log in as `MARIA` and run `CREATE TABLE pets (...)`, the table goes into the `MARIA` schema, and its full name is `MARIA.PETS`. You can refer to it as just `pets`, since Oracle looks in your own schema first.

To use a table that **another** user owns, put their name in front: `hr.employees` is the `employees` table in the `HR` schema. You've been doing that in every lesson of this track. And you can only use it if the owner, or an administrator, has given you the **privilege**.

To see who you are, and what you own:

```sql
SELECT USER FROM dual;
SELECT COUNT(*) AS my_tables FROM user_tables;
```

The first shows your account name. The second counts the tables in your own schema, which is `0` for a brand-new account.

Compared with MySQL, where one server holds many **databases**, an Oracle database holds many **schemas**. And unlike SQLite, there's no file per database that you can copy around: everything is managed by the server.

## The data dictionary

Oracle keeps a record of everything in the database, in a set of read-only views called the **data dictionary**. They come in three families, named by a prefix:

| Prefix | Shows | Example |
|---|---|---|
| `USER_` | objects **you own** | `USER_TABLES`, `USER_TAB_COLUMNS` |
| `ALL_` | objects **you can use**, including other people's | `ALL_TABLES`, `ALL_USERS` |
| `DBA_` | **everything**, for administrators | `DBA_TABLES`, `DBA_USERS` |

You've used `ALL_TAB_COLUMNS` in [Oracle Data Types](/lessons/oracle-database/data-types). Here, `ALL_TABLES` shows which tables exist in the sample schema that you can read:

```sql
SELECT table_name
FROM all_tables
WHERE owner = 'HR'
ORDER BY table_name;
```

```text
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

Object names are stored in **capitals** in the dictionary, which is why the condition says `'HR'` and not `'hr'`. When you don't know the name of something, or want to check what you have, the dictionary is where to look. The `DBA_` views need special privileges, so an everyday account gets an error such as `ORA-00942: table or view does not exist` when it tries them.

## System privileges and object privileges

A **privilege** is permission to do something. There are two kinds:

- A **system privilege** is permission to perform an action on the database as a whole: `CREATE SESSION` (to log in at all), `CREATE TABLE`, `CREATE VIEW`, `CREATE USER`.
- An **object privilege** is permission to use one particular object: `SELECT` on a table, `INSERT` on a table, `EXECUTE` on a procedure.

You can see your own with `SESSION_PRIVS` (system privileges you hold right now) and `USER_TAB_PRIVS` (object privileges involving you). In the last lessons, you saw that a plain visitor to FreeSQL holds just `CREATE SESSION`: they can connect, and nothing else.

A brand-new account has **no** privileges. Without `CREATE SESSION`, it can't even log in.

## Creating an account

Only an administrator, such as `SYSTEM`, can create users. Connect to your pluggable database (`FREEPDB1` in the Free edition) before doing it. In the container database itself (`CDB$ROOT`), Oracle expects "common" users whose names start with `C##`, and refuses ordinary names with `ORA-65096: invalid common user or role name`.

```sql
CREATE USER maria IDENTIFIED BY "Choose-A-Strong-1"
    DEFAULT TABLESPACE users
    QUOTA UNLIMITED ON users;

GRANT CREATE SESSION TO maria;
GRANT CREATE TABLE, CREATE VIEW, CREATE SEQUENCE, CREATE PROCEDURE TO maria;
```

- `IDENTIFIED BY` sets the password.
- `DEFAULT TABLESPACE users` says where her tables are stored. A **tablespace** is Oracle's name for a storage area.
- `QUOTA UNLIMITED ON users` allows her to store as much as she likes there. Without a **quota**, she can create tables, but can't put any rows in them.
- The `GRANT`s give her permission to log in, and to create the basic kinds of objects.

Since 21c, there's a convenient shortcut: a ready-made role, **`DB_DEVELOPER_ROLE`**, that bundles the privileges an application developer normally needs:

```sql
GRANT DB_DEVELOPER_ROLE TO maria;
```

Now `maria` can log in and build her own tables, in her own schema, and can't touch anyone else's.

## Object privileges: sharing your tables

By default, nobody can see your tables. You share them, one privilege at a time:

```sql
GRANT SELECT ON pets TO ben;
GRANT SELECT, INSERT, UPDATE ON pets TO carlo;
REVOKE INSERT ON pets FROM carlo;
```

Now `ben` can read `maria.pets`, and `carlo` can read and change it. (`REVOKE` takes a privilege away again.) When `ben` writes a query, he has to use the owner's name, `maria.pets`, unless there's a **synonym**.

**Object privileges and errors.** Watch how Oracle answers, because it's careful not to reveal that a table exists to someone who may not see it:

- If you have **no** privilege on a table at all, it acts as though the table isn't there: `ORA-00942: table or view does not exist`.
- If you can see a table (you have `SELECT`), but try something you're **not** allowed to do, like `DELETE`, you get `ORA-01031: insufficient privileges`.

You can see the second in FreeSQL: anyone can read `hr.employees`, but trying to change it stops with an `ORA-01031` error.

## Roles: privileges in a package

When many accounts need the same privileges, give them to a **role**, and give the role to the accounts:

```sql
CREATE ROLE report_reader;
GRANT SELECT ON maria.pets TO report_reader;
GRANT SELECT ON maria.tickets TO report_reader;

GRANT report_reader TO ben;
GRANT report_reader TO dina;
```

Change what `report_reader` can do, and everyone who holds it changes at once. A role can hold system privileges and object privileges, and even other roles. This is the same idea as roles in MySQL, and Oracle has had them for a long time.

## Synonyms: shorter names

A **synonym** is an alias for an object, usually one belonging to someone else, so that people don't have to type the owner's name:

```sql
CREATE SYNONYM pets FOR maria.pets;
```

After that, when `ben` runs `SELECT * FROM pets`, Oracle looks up the synonym, and reads `maria.pets`. A **public synonym** works for everyone. Synonyms also make applications easier to move, since only the synonym needs to change, when a table moves.

## Changing and removing accounts

```sql
ALTER USER maria IDENTIFIED BY "A-New-Password-2";
ALTER USER maria ACCOUNT LOCK;
ALTER USER maria PASSWORD EXPIRE;
DROP USER maria CASCADE;
```

`ACCOUNT LOCK` stops someone logging in, without deleting anything. `PASSWORD EXPIRE` forces a new password at the next login. `DROP USER` deletes an account, and `CASCADE` also deletes **everything the account owns**: every table, with its data. It's permanent, and an account that owns objects can't be dropped without `CASCADE`.

## The principle of least privilege

Give every account only the access it needs for its job. A website's account needs to read and change its own tables, and nothing more. It shouldn't be `SYSTEM`, and it needs no `DROP ANY TABLE` or `CREATE USER`. If it's ever attacked, the damage is then limited to what that account may do.

Never use `SYS` or `SYSTEM` for anything except administration. Note the `ANY` privileges, like `SELECT ANY TABLE` or `DROP ANY TABLE`: they reach into **every** schema, so give them out very rarely.

## Try it

A company has three accounts. Predict what happens with each statement, and say why. Assume that `maria` owns `pets`, and has done exactly the grants shown.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, access.sql"
	min-height="480px"
	:model-value="'-- Maria has run:\n--   GRANT SELECT ON pets TO ben;\n--   GRANT SELECT, UPDATE ON pets TO carlo;\n\n-- 1. Ben runs:\nSELECT * FROM maria.pets;\n\n-- 2. Ben runs:\nDELETE FROM maria.pets;\n\n-- 3. Carlo runs:\nUPDATE maria.pets SET name = \'Rex\' WHERE id = 1;\n\n-- 4. Dina, who has been granted nothing, runs:\nSELECT * FROM maria.pets;\n\n-- 5. Maria runs:\nGRANT SELECT ON pets TO dina;\n-- and then Dina runs again:\nSELECT * FROM maria.pets;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. This exercise is a thinking one: work out each answer, and then read on.
:::

::: details Check your prediction
1. Works. Ben has `SELECT` on the table.
2. Fails with `ORA-01031: insufficient privileges`. Ben can see the table, but has no `DELETE` privilege.
3. Works. Carlo was granted `UPDATE`. (An `UPDATE` with a `WHERE` on a column also needs `SELECT`, which he has.)
4. Fails with `ORA-00942: table or view does not exist`. Dina has no privilege at all on the table, so Oracle doesn't even admit it exists.
5. Works, after Maria grants it. Privileges take effect straight away.
:::

## Try it yourself

1. In FreeSQL or your own database, query `SELECT * FROM user_tables;`. Which columns does the view have? Use `DESCRIBE user_tables`.
2. Sign in, create a table `test_table`, and check that it appears in `user_tables`, with its name in capitals.
3. On your own database, create an account, give it only `CREATE SESSION`, and try to create a table with it. What error do you get?

## Check your understanding

<Quiz
	question="What is a schema in Oracle?"
	:options="['A type of backup', 'The collection of objects owned by a user, named after that user', 'A kind of table', 'A file on disk']"
	:answer-index="1"
	explanation="Each user owns a schema with the same name. Tables the user creates go into it."
/>

<Quiz
	question="A user has no privilege at all on maria.pets and tries SELECT * FROM maria.pets. What error is most likely?"
	:options="['ORA-01031: insufficient privileges', 'No error, it returns no rows', 'ORA-12899', 'ORA-00942: table or view does not exist']"
	:answer-index="3"
	explanation="Oracle hides the existence of objects you have no privilege on, and answers as if the table isn't there."
/>

<Quiz
	question="What does DROP USER maria CASCADE do?"
	:options="['Locks the account', 'Only deletes the password', 'Deletes the account and everything it owns', 'Copies the account']"
	:answer-index="2"
	explanation="CASCADE deletes the user's whole schema, including every table and its data. It is permanent."
/>

## Up next

You've made and changed data. Oracle has a strict idea of when a change becomes permanent, in [Transactions: COMMIT, ROLLBACK, and SAVEPOINT](/lessons/oracle-database/transactions).
