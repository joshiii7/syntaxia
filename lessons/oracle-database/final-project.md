---
title: "Oracle Final Project: Build a Course Enrollment System with PL/SQL"
description: "Put the whole Oracle track to work by building a course enrollment system: tables with constraints and identity columns, a report view, an audit trigger, a PL/SQL package with enroll and drop rules, and least-privilege accounts."
---

# Final Project: Course Enrollment System

*Every lesson gave you one tool. This project hands you the whole toolbox and a real job to do.*

Before the project, one more look back.

At the start of this track, you knew SQL from SQLite, and Oracle was a name from job postings. You weren't sure why an empty string could vanish, or what the slash after a block was for.

Look at what you know now. You can get an Oracle database running, and talk to it with SQL\*Plus, SQLcl, or a worksheet. You know Oracle's own types, why `''` is `NULL` and what that does to your queries, and how to get the top rows of a result without `LIMIT`. You let identity columns hand out IDs, and use `MERGE` for upserts. You understand schemas, privileges, and why nothing is final until `COMMIT`, and that DDL commits on its own. And you write **PL/SQL**: blocks with variables, decisions, and loops, cursors, procedures and functions, packages, exceptions you raise on purpose, and triggers that fire by themselves.

There were surely moments when nothing worked: a `WHERE = ''` that found nothing, a `ROWNUM` that returned the wrong top five, a block that printed nothing until you remembered `SET SERVEROUTPUT ON`. You read the error, found the cause, and fixed it. That's the real skill, and you have it now.

I'm genuinely proud of you. Let's build something.

## The project

You'll build a **Course Enrollment System** for a small school: the back end that a registration website would use. It keeps track of:

- **students**, and the **courses** they can take, each with a limited number of seats;
- **enrollments**, which say who is in which course, and whether they're still active or have dropped;
- an **audit log** of every change to an enrollment.

And it has the rules built in, so that no program can break them: a course can't be overfilled, a student can't join the same course twice, and a student who dropped can come back, if there's room.

It's one SQL script, `enrollment.sql`, which you can run again and again to rebuild the whole thing, plus a second script, `checks.sql`, to test it.

## Getting set up

This is a project for your own Oracle account, so use FreeSQL **signed in**, or your own installation from [Getting an Oracle Database](/lessons/oracle-database/setting-up).

1. Make a folder called `enrollment`, and create a file called `enrollment.sql` in it.
2. Paste in the starter code below.
3. Run it from SQLcl or SQL\*Plus with `@enrollment.sql`, or paste it into a worksheet, and use **Run Script**.

The starter already runs. It creates one table, adds four students, and prints a message. Your job is to replace every `TODO`.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, enrollment.sql"
	min-height="560px"
	:model-value="'-- Course Enrollment System: starter.\n-- Run in your own account:  @enrollment.sql\n\n-- 0. Start clean (DROP ... IF EXISTS needs Oracle 23ai or newer) ------------\n\nDROP TABLE IF EXISTS students PURGE;\n\n-- 1. Tables -----------------------------------------------------------------\n\nCREATE TABLE students (\n    student_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    full_name  VARCHAR2(60 CHAR)  NOT NULL,\n    email      VARCHAR2(100 CHAR) NOT NULL,\n    CONSTRAINT students_email_uq UNIQUE (email)\n);\n\n-- TODO (requirement 1): drop and create courses, enrollments, and enrollment_log too.\n\n-- 2. Sample data --------------------------------------------------------------\n\nINSERT INTO students (full_name, email) VALUES (\'Ana Reyes\', \'ana@example.com\');\nINSERT INTO students (full_name, email) VALUES (\'Ben Cruz\', \'ben@example.com\');\nINSERT INTO students (full_name, email) VALUES (\'Carlo Lim\', \'carlo@example.com\');\nINSERT INTO students (full_name, email) VALUES (\'Dina Tan\', \'dina@example.com\');\n\n-- TODO (requirement 2): add three courses, including DB101 with a capacity of 2.\nCOMMIT;\n\n-- 3. Report view --------------------------------------------------------------\n\n-- TODO (requirement 3): create the course_summary view.\n\n-- 4. Trigger --------------------------------------------------------------------\n\n-- TODO (requirement 4): create the trigger that logs status changes.\n\n-- 5. Package ----------------------------------------------------------------------\n\n-- TODO (requirement 5): create the enroll_pkg package and its body.\n\nSELECT \'Starter loaded. Students: \' AS message, COUNT(*) AS students FROM students;\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. You can read and edit the starter code here, but build and run the project in your own Oracle account.
:::

Work through the requirements in order, and re-run the whole script after each one. Small steps, tested often, are how every real database gets built. The script begins by dropping everything with `DROP ... IF EXISTS`, so re-running it rebuilds from scratch. (That syntax needs Oracle 23ai or newer. On older versions, wrap each `DROP` in a block that ignores the "does not exist" error.)

## Requirements

Each requirement says what to build, **why** it matters, and which lessons to review.

### 1. Tables with constraints

Create four tables:

- **`students`**: an identity primary key `student_id`, `full_name` (up to 60 characters), and `email` (up to 100 characters, unique). Everything required.
- **`courses`**: an identity primary key `course_id`, a unique `code` (up to 10 characters, like `DB101`), a `title`, and a `capacity` (a whole number, more than 0).
- **`enrollments`**: an identity primary key, `student_id` and `course_id` (both must refer to real rows), `status` (only `'ACTIVE'` or `'DROPPED'`, starting as `'ACTIVE'`), and `enrolled_at` (a date, starting as now). A student can appear **once** per course.
- **`enrollment_log`**: an identity primary key, the `enrollment_id`, the `old_status` (which may be empty), the `new_status`, and when it was `logged_at`.

Give every constraint a **name**, so error messages are readable.

**Why:** The tables are your first line of defense: nothing can get in that breaks these rules, whoever writes the data. Review: [Oracle Data Types](/lessons/oracle-database/data-types) and [Sequences and Identity Columns](/lessons/oracle-database/sequences-and-identity).

### 2. Sample data

Add at least four students and three courses, including one small course, `DB101`, with only **2 seats**, so it's easy to fill up. End with a `COMMIT`.

**Why:** Small, predictable data makes your tests easy to reason about. Review: [Transactions](/lessons/oracle-database/transactions).

### 3. A report view

Create a view `course_summary` with one row per course: its `code`, `title`, `capacity`, how many students are `enrolled` (active ones only), and the `seats_left`. Courses with nobody in them must still appear.

**Why:** Anyone who wants to see how full the courses are shouldn't need to know how the tables are laid out. Review: [Top-N Queries](/lessons/oracle-database/top-n-queries) for reading results, and [Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings) for why an outer join and `COUNT(column)` matter here.

### 4. An audit trigger

Create a trigger that adds a row to `enrollment_log` whenever an enrollment is **inserted**, or its `status` **changes**. For a new enrollment, `old_status` is empty. Changing a row without changing its status must not log anything.

**Why:** When someone asks "when did this student drop the course?", the log answers. Review: [Triggers](/lessons/oracle-database/triggers).

### 5. A package that holds the rules

Create a package `enroll_pkg` with:

- **`enroll(student_id, course_code)`**, which must, in this order: refuse an unknown student, refuse an unknown course, refuse a student who is **already active** in the course, refuse if the course is **full**, and otherwise enrol the student. A student who had **dropped** the course gets their old row set back to `'ACTIVE'`, instead of a second row.
- **`drop_course(student_id, course_code)`**, which sets an active enrollment to `'DROPPED'`, and refuses with a clear message if there's no active enrollment to drop.
- **`seats_left(course_code)`**, a function that returns the number of free seats.

Rules for all of it:

- Each refusal uses `RAISE_APPLICATION_ERROR`, with its own number and a message that says what happened. Keep the numbers in named constants.
- `enroll` **locks** the course row with `SELECT ... FOR UPDATE`, so two students can't take the last seat at the same moment.
- The procedures don't `COMMIT`. The caller decides when the transaction ends.
- Helpers that outsiders shouldn't call, like the one that locks the course, are **private**.

**Why:** Putting the rules in one package means every application enforces them the same way. Review: [Packages](/lessons/oracle-database/packages), [PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions), [Stored Procedures and Functions](/lessons/oracle-database/procedures-and-functions), and [Transactions](/lessons/oracle-database/transactions) for locks.

### 6. Accounts with least privilege

An administrator (not your own account) creates two accounts:

- **`enroll_app`**, for the website. It may log in, run `enroll_pkg`, and read `course_summary`. It must **not** be able to read or change the tables directly.
- **`enroll_report`**, for the office. It may log in and read only `course_summary`.

**Why:** If the website is ever attacked, the damage should be limited to what its account can do. And a package runs with its owner's rights, so the website can enroll students without being allowed to write into `enrollments` itself. Review: [Schemas, Users, and Privileges](/lessons/oracle-database/schemas-and-users).

### 7. Prove it works

Write `checks.sql` to test it. It should try each rule and print what happened: a normal enrollment, a full course, a duplicate, an unknown course, an unknown student, a drop, a second drop, a freed seat, and a student returning to a full course. Then show the view, the seat counts, and the audit log. Finally, try to break the table rules (a duplicate email, a course with no seats, a bad status, deleting a course that has enrollments), and see the database refuse.

**Why:** A system you haven't tried to break isn't finished. Review: [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks) and [PL/SQL Exceptions](/lessons/oracle-database/plsql-exceptions).

### 8. Clean, readable code

- Keywords in capitals, names in lowercase snake_case, and consistent indentation.
- Prefixes for PL/SQL names (`p_` for parameters, `v_` for variables, `c_` for constants).
- No magic numbers, no `WHEN OTHERS THEN NULL`, and no `SELECT *`.
- The script starts clean, and can be re-run any time.

**Why:** You'll come back to this code. So might a teammate, a teacher, or a future employer. Review: [Best Practices and Common Mistakes](/lessons/oracle-database/best-practices).

## Sample run

Your wording and layout don't have to match exactly, but your system should give results like these. This is what `checks.sql` from the reference solution shows, after `enrollment.sql`. (The error lines at the end are the tables refusing bad data on purpose, and `YOUR_SCHEMA` is your own account's name. Newer Oracle versions may add extra detail after the message.)

```text
Ana joins DB101                 ok
Ben joins DB101                 ok
Carlo joins DB101 (full)        ORA-20003: DB101 is full
Ana joins DB101 again           ORA-20004: Already enrolled in DB101
Ana joins NOPE101               ORA-20001: No such course: NOPE101
Student 99 joins WEB110         ORA-20002: No such student: 99
Ben drops DB101                 ok
Ben drops DB101 again           ORA-20005: Not enrolled in DB101
Carlo joins DB101 (seat freed)  ok
Ben rejoins DB101 (full again)  ORA-20003: DB101 is full

PL/SQL procedure successfully completed.

CODE     ENROLLED CAPACITY SEATS_LEFT
------ ---------- -------- ----------
ART105          0       25         25
DB101           2        2          0
WEB110          0        3          3

DB101_SEATS ART105_SEATS
----------- ------------
          0           25

    LOG_ID ENROLLMENT_ID OLD_STATUS NEW_STATUS
---------- ------------- ---------- ----------
         1             1            ACTIVE
         2             2            ACTIVE
         3             2 ACTIVE     DROPPED
         4             3            ACTIVE

ORA-00001: unique constraint (YOUR_SCHEMA.STUDENTS_EMAIL_UQ) violated
ORA-02290: check constraint (YOUR_SCHEMA.COURSES_CAPACITY_CK) violated
ORA-02290: check constraint (YOUR_SCHEMA.ENR_STATUS_CK) violated
ORA-02292: integrity constraint (YOUR_SCHEMA.ENR_COURSE_FK) violated - child record found
```

Some things to notice:

- DB101 has 2 seats. Ana and Ben fill it, so Carlo is turned away.
- Ben drops, so Carlo's second try works, and now Ben's attempt to return is refused: the course is full again.
- Ben's row was **reused**, not duplicated: the log shows enrollment 2 going from `ACTIVE` to `DROPPED`.
- The log's first row for each enrollment has an empty `OLD_STATUS`, since it was new.
- Every rule was refused with its own number, which a website can use to show the right message.

## Testing your system

There's no automatic checker for this project, so you're the tester. Try each of these:

- Run `enrollment.sql` twice in a row. It must work both times.
- Fill a course, then try again as a fifth student. Then drop someone, and see that the seat is free again.
- In **two** sessions at the same time, start `enroll_pkg.enroll` for the last seat of a course, without committing in the first. The second should **wait**, and then be refused once the first commits. (This shows the lock at work.)
- Connect as `enroll_report`, and try `SELECT * FROM course_owner.enrollments;` (using your own account name). It must be refused with `ORA-00942`. Then read `course_summary`, which must work.
- Connect as `enroll_app` and run `enroll_pkg.enroll`, then try `INSERT INTO course_owner.enrollments ...` directly. The package call must work, and the direct insert must be refused.
- Check the audit log after each change, and confirm that nothing is logged when a row is updated without changing its status.
- Change a course's capacity to 1 when 2 students are already in. What does the view show for `seats_left`? Is that a problem, and how would you prevent it?

## Stretch goals (optional, for the ambitious)

- Add a **waiting list**: when a course is full, `enroll` puts the student on a list, and `drop_course` moves the first person up.
- Add a `prerequisite_code` column to `courses`, and refuse students who haven't completed it.
- Turn the seat check into a **trigger** or **constraint**, so even a direct `INSERT` can't overfill a course. What makes that hard?
- Add a `grades` table and a package function that computes a student's average.
- Use a `MERGE` in the package to load a list of enrollments from a staging table in one statement.
- Wrap the whole system in a small web page in [PHP](/lessons/php/introduction), using `enroll_app`, and the PDO Oracle driver.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own system. Every "no" is just a pointer to your next improvement.

1. Can I rebuild the whole system from scratch by running one script?
2. Does the database refuse every kind of bad data I could think of, without help from any application?
3. Is it impossible for a course to end up with more active students than seats, even with two people enrolling at once?
4. Does every error message say what went wrong, with a number a program could use?
5. Could I explain what each account is allowed to do, and why?
6. Do my procedures leave `COMMIT` to the caller, and do I know why?
7. If I came back to this in six months, could I add a new rule without being afraid of breaking the others?
8. Would I be happy to hand this system to a real school?

If you answered yes to all eight, you've built a real, complete Oracle application. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good developers become great ones.

## Stuck? A reference solution

Try to finish on your own first. Struggling with a problem, and then solving it, is exactly how the skill sticks. But if you're truly stuck on one part, or you've finished and want to compare, here's one complete solution. It's not the only right answer; if yours works and reads clearly, it's just as good.

::: details Show the reference solution
`enrollment.sql`:

```sql
-- Course Enrollment System: reference solution.
-- Run as your own (non-administrator) account, for example in FreeSQL or SQLcl:
--   @enrollment.sql

-- 0. Start clean (DROP ... IF EXISTS needs Oracle 23ai or newer) ------------

DROP VIEW IF EXISTS course_summary;
DROP PACKAGE IF EXISTS enroll_pkg;
DROP TABLE IF EXISTS enrollment_log PURGE;
DROP TABLE IF EXISTS enrollments PURGE;
DROP TABLE IF EXISTS courses PURGE;
DROP TABLE IF EXISTS students PURGE;

-- 1. Tables -----------------------------------------------------------------

CREATE TABLE students (
    student_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name  VARCHAR2(60 CHAR)  NOT NULL,
    email      VARCHAR2(100 CHAR) NOT NULL,
    CONSTRAINT students_email_uq UNIQUE (email)
);

CREATE TABLE courses (
    course_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code      VARCHAR2(10)      NOT NULL,
    title     VARCHAR2(80 CHAR) NOT NULL,
    capacity  NUMBER(3)         NOT NULL,
    CONSTRAINT courses_code_uq UNIQUE (code),
    CONSTRAINT courses_capacity_ck CHECK (capacity > 0)
);

CREATE TABLE enrollments (
    enrollment_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_id    NUMBER NOT NULL,
    course_id     NUMBER NOT NULL,
    status        VARCHAR2(10) DEFAULT 'ACTIVE' NOT NULL,
    enrolled_at   DATE DEFAULT SYSDATE NOT NULL,
    CONSTRAINT enr_student_fk FOREIGN KEY (student_id) REFERENCES students (student_id),
    CONSTRAINT enr_course_fk  FOREIGN KEY (course_id)  REFERENCES courses (course_id),
    CONSTRAINT enr_status_ck  CHECK (status IN ('ACTIVE', 'DROPPED')),
    CONSTRAINT enr_student_course_uq UNIQUE (student_id, course_id)
);

CREATE TABLE enrollment_log (
    log_id        NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    enrollment_id NUMBER NOT NULL,
    old_status    VARCHAR2(10),
    new_status    VARCHAR2(10) NOT NULL,
    logged_at     DATE DEFAULT SYSDATE NOT NULL
);

-- 2. Sample data --------------------------------------------------------------

INSERT INTO students (full_name, email) VALUES ('Ana Reyes', 'ana@example.com');
INSERT INTO students (full_name, email) VALUES ('Ben Cruz', 'ben@example.com');
INSERT INTO students (full_name, email) VALUES ('Carlo Lim', 'carlo@example.com');
INSERT INTO students (full_name, email) VALUES ('Dina Tan', 'dina@example.com');

INSERT INTO courses (code, title, capacity) VALUES ('DB101', 'Databases for Beginners', 2);
INSERT INTO courses (code, title, capacity) VALUES ('WEB110', 'Building Web Pages', 3);
INSERT INTO courses (code, title, capacity) VALUES ('ART105', 'Digital Art', 25);
COMMIT;

-- 3. A view for reports ---------------------------------------------------------

CREATE OR REPLACE VIEW course_summary AS
SELECT c.code,
       c.title,
       c.capacity,
       COUNT(e.enrollment_id) AS enrolled,
       c.capacity - COUNT(e.enrollment_id) AS seats_left
FROM courses c
LEFT JOIN enrollments e
       ON e.course_id = c.course_id
      AND e.status = 'ACTIVE'
GROUP BY c.course_id, c.code, c.title, c.capacity;

-- 4. A trigger that logs every change of status -----------------------------------

CREATE OR REPLACE TRIGGER enrollments_audit
AFTER INSERT OR UPDATE OF status ON enrollments
FOR EACH ROW
WHEN (OLD.status IS NULL OR OLD.status <> NEW.status)
BEGIN
    INSERT INTO enrollment_log (enrollment_id, old_status, new_status)
    VALUES (:NEW.enrollment_id, :OLD.status, :NEW.status);
END;
/

-- 5. The package: all the rules live here -------------------------------------------

CREATE OR REPLACE PACKAGE enroll_pkg IS
    PROCEDURE enroll (p_student_id IN NUMBER, p_course_code IN VARCHAR2);
    PROCEDURE drop_course (p_student_id IN NUMBER, p_course_code IN VARCHAR2);
    FUNCTION seats_left (p_course_code IN VARCHAR2) RETURN NUMBER;
END enroll_pkg;
/

CREATE OR REPLACE PACKAGE BODY enroll_pkg IS

    c_no_course    CONSTANT NUMBER := -20001;
    c_no_student   CONSTANT NUMBER := -20002;
    c_course_full  CONSTANT NUMBER := -20003;
    c_already_in   CONSTANT NUMBER := -20004;
    c_not_enrolled CONSTANT NUMBER := -20005;

    -- Private: finds a course, and locks its row so two students
    -- cannot take the last seat at the same moment.
    PROCEDURE lock_course (
        p_course_code IN  VARCHAR2,
        p_course_id   OUT NUMBER,
        p_capacity    OUT NUMBER
    ) IS
    BEGIN
        SELECT course_id, capacity
          INTO p_course_id, p_capacity
          FROM courses
         WHERE code = p_course_code
           FOR UPDATE;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(c_no_course, 'No such course: ' || p_course_code);
    END lock_course;

    PROCEDURE enroll (p_student_id IN NUMBER, p_course_code IN VARCHAR2) IS
        v_students        NUMBER;
        v_course_id       courses.course_id%TYPE;
        v_capacity        courses.capacity%TYPE;
        v_existing_status enrollments.status%TYPE;
        v_taken           NUMBER;
    BEGIN
        SELECT COUNT(*) INTO v_students
          FROM students
         WHERE student_id = p_student_id;
        IF v_students = 0 THEN
            RAISE_APPLICATION_ERROR(c_no_student, 'No such student: ' || p_student_id);
        END IF;

        lock_course(p_course_code, v_course_id, v_capacity);

        BEGIN
            SELECT status INTO v_existing_status
              FROM enrollments
             WHERE student_id = p_student_id
               AND course_id = v_course_id;
        EXCEPTION
            WHEN NO_DATA_FOUND THEN
                v_existing_status := NULL;
        END;

        IF v_existing_status = 'ACTIVE' THEN
            RAISE_APPLICATION_ERROR(c_already_in, 'Already enrolled in ' || p_course_code);
        END IF;

        SELECT COUNT(*) INTO v_taken
          FROM enrollments
         WHERE course_id = v_course_id
           AND status = 'ACTIVE';
        IF v_taken >= v_capacity THEN
            RAISE_APPLICATION_ERROR(c_course_full, p_course_code || ' is full');
        END IF;

        IF v_existing_status = 'DROPPED' THEN
            UPDATE enrollments
               SET status = 'ACTIVE',
                   enrolled_at = SYSDATE
             WHERE student_id = p_student_id
               AND course_id = v_course_id;
        ELSE
            INSERT INTO enrollments (student_id, course_id)
            VALUES (p_student_id, v_course_id);
        END IF;
    END enroll;

    PROCEDURE drop_course (p_student_id IN NUMBER, p_course_code IN VARCHAR2) IS
    BEGIN
        UPDATE enrollments
           SET status = 'DROPPED'
         WHERE student_id = p_student_id
           AND status = 'ACTIVE'
           AND course_id = (SELECT course_id FROM courses WHERE code = p_course_code);

        IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(c_not_enrolled, 'Not enrolled in ' || p_course_code);
        END IF;
    END drop_course;

    FUNCTION seats_left (p_course_code IN VARCHAR2) RETURN NUMBER IS
        v_left NUMBER;
    BEGIN
        SELECT c.capacity - COUNT(e.enrollment_id)
          INTO v_left
          FROM courses c
          LEFT JOIN enrollments e
                 ON e.course_id = c.course_id
                AND e.status = 'ACTIVE'
         WHERE c.code = p_course_code
         GROUP BY c.capacity;
        RETURN v_left;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RAISE_APPLICATION_ERROR(c_no_course, 'No such course: ' || p_course_code);
    END seats_left;

END enroll_pkg;
/
```

`checks.sql`:

```sql
SET SERVEROUTPUT ON

-- Try enrolling and dropping, and print what happened.
DECLARE
    PROCEDURE attempt (
        p_label   IN VARCHAR2,
        p_student IN NUMBER,
        p_code    IN VARCHAR2,
        p_drop    IN BOOLEAN DEFAULT FALSE
    ) IS
    BEGIN
        IF p_drop THEN
            enroll_pkg.drop_course(p_student, p_code);
        ELSE
            enroll_pkg.enroll(p_student, p_code);
        END IF;
        DBMS_OUTPUT.PUT_LINE(RPAD(p_label, 32) || 'ok');
    EXCEPTION
        WHEN OTHERS THEN
            DBMS_OUTPUT.PUT_LINE(RPAD(p_label, 32) || SQLERRM);
    END attempt;
BEGIN
    attempt('Ana joins DB101', 1, 'DB101');
    attempt('Ben joins DB101', 2, 'DB101');
    attempt('Carlo joins DB101 (full)', 3, 'DB101');
    attempt('Ana joins DB101 again', 1, 'DB101');
    attempt('Ana joins NOPE101', 1, 'NOPE101');
    attempt('Student 99 joins WEB110', 99, 'WEB110');
    attempt('Ben drops DB101', 2, 'DB101', TRUE);
    attempt('Ben drops DB101 again', 2, 'DB101', TRUE);
    attempt('Carlo joins DB101 (seat freed)', 3, 'DB101');
    attempt('Ben rejoins DB101 (full again)', 2, 'DB101');
    COMMIT;
END;
/

-- What the report view says now.
SELECT code, enrolled, capacity, seats_left FROM course_summary ORDER BY code;

-- The seat counter.
SELECT enroll_pkg.seats_left('DB101') AS db101_seats, enroll_pkg.seats_left('ART105') AS art105_seats FROM dual;

-- Everything the trigger recorded.
SELECT log_id, enrollment_id, old_status, new_status FROM enrollment_log ORDER BY log_id;

-- Rules the tables enforce by themselves.
INSERT INTO students (full_name, email) VALUES ('Ana Again', 'ana@example.com');
INSERT INTO courses (code, title, capacity) VALUES ('BAD101', 'No seats', 0);
UPDATE enrollments SET status = 'MAYBE' WHERE enrollment_id = 1;
DELETE FROM courses WHERE code = 'DB101';
ROLLBACK;
```

`admin.sql`, run by an administrator, after `enrollment.sql` (replace `course_owner` with the account that owns the tables):

```sql
-- Run as an administrator (for example SYSTEM, connected to FREEPDB1).
-- Replace COURSE_OWNER with the account that owns the enrollment tables.

CREATE USER enroll_app IDENTIFIED BY "Enr0ll-App-Pass1";
GRANT CREATE SESSION TO enroll_app;
GRANT EXECUTE ON course_owner.enroll_pkg TO enroll_app;
GRANT SELECT ON course_owner.course_summary TO enroll_app;

CREATE USER enroll_report IDENTIFIED BY "Enr0ll-Report-Pass1";
GRANT CREATE SESSION TO enroll_report;
GRANT SELECT ON course_owner.course_summary TO enroll_report;
```
:::

## Check your understanding

<Quiz
	question="Why does enroll lock the course row with SELECT ... FOR UPDATE?"
	:options="['So two students cannot both take the last seat at the same moment', 'To make the query faster', 'Because Oracle requires it', 'To hide the row from other users']"
	:answer-index="0"
	explanation="The lock makes the second enrollment wait until the first is committed, and then it sees the seat is gone."
/>

<Quiz
	question="Why do the package's procedures leave COMMIT to the caller?"
	:options="['COMMIT is not allowed in packages', 'COMMIT is slow', 'The caller may want several changes to succeed or fail together, so it should decide when the transaction ends', 'Procedures cannot see committed data']"
	:answer-index="2"
	explanation="A procedure that commits by itself takes that choice away from its caller, and can't be part of a bigger transaction."
/>

<Quiz
	question="The enroll_app account has no INSERT privilege on enrollments, yet enroll_pkg.enroll works for it. Why?"
	:options="['It is a bug', 'The package runs with its owner\'s rights, so the caller only needs EXECUTE on the package', 'Packages ignore privileges', 'enroll_app has hidden privileges']"
	:answer-index="1"
	explanation="By default, a stored subprogram runs with the definer's rights, so the caller can be restricted to calling the package."
/>

## Where you go from here

You've finished the Oracle Database track. Take a moment with that. You started with a database you'd only heard about in job postings, and you've just built a system with rules that no program can break, an audit trail, and accounts that can do only their own jobs.

Oracle opens a lot of doors from here. Most large organizations run parts of their systems on it, and PL/SQL developers are always in demand. There's much more to explore: **collections and bulk processing** in PL/SQL (`BULK COLLECT` and `FORALL`) for speed, **JSON in Oracle**, **partitioning** for enormous tables, **execution plans** and performance tuning, **Oracle APEX**, a low-code platform for building web applications on top of the database, and administration topics like **backup and recovery**. If you want to compare with another server database, the [MySQL track](/lessons/mysql/introduction) covers many of the same ideas, with different habits.

Whichever way you go, the ideas you've learned here, letting the database enforce the rules, transactions, least privilege, putting logic close to the data, and reading an error message calmly, travel with you into every database you'll ever use. Well done.
