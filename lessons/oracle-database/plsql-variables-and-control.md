---
title: "PL/SQL Control Flow: IF, CASE, LOOP, WHILE, and FOR"
description: "Add decisions and repetition to PL/SQL: IF with ELSIF, CASE statements and expressions, how NULL affects conditions, and the LOOP, WHILE, and FOR loops with EXIT and CONTINUE."
---

# PL/SQL Variables and Control Flow

*A recipe isn't only a list of steps. It says "if the sauce is thin, simmer longer" and "stir every minute until it thickens." Control flow is how a program says those things.*

In [PL/SQL Blocks](/lessons/oracle-database/plsql-blocks), your programs ran straight through, top to bottom. Real programs need to **choose** and to **repeat**. That's what this lesson adds. If you know these ideas from other languages, like [PHP](/lessons/php/if-else) or [Python](/lessons/python/if-elif-else), you'll only need to learn Oracle's spelling.

The examples run in FreeSQL without signing in.

## Choosing: IF

```sql
DECLARE
  v_score NUMBER := 84;
  v_grade VARCHAR2(20);
BEGIN
  IF v_score >= 90 THEN
    v_grade := 'A';
  ELSIF v_score >= 80 THEN
    v_grade := 'B';
  ELSIF v_score >= 70 THEN
    v_grade := 'C';
  ELSE
    v_grade := 'Needs improvement';
  END IF;

  DBMS_OUTPUT.PUT_LINE('Grade: ' || v_grade);
END;
/
```

```text
Grade: B

PL/SQL procedure successfully completed.
```

There are a few things to watch in the spelling:

- There are **no curly braces**. An `IF` is closed with **`END IF;`**, and that includes its semicolon.
- It's **`ELSIF`**: one word, with no second E. Writing `ELSEIF` or `ELSE IF` is a syntax error (the second would need its own `END IF`).
- Each condition is followed by **`THEN`**.
- You compare with a single **`=`** (and use `<>` for "not equal"). The assignment operator is `:=`, so there's no way to confuse the two, unlike in some languages.
- Conditions combine with **`AND`**, **`OR`**, and **`NOT`**.

## NULL in conditions

PL/SQL's `BOOLEAN` values are `TRUE`, `FALSE`, and, because of `NULL`, a third one: **unknown**. A comparison that involves `NULL` is neither true nor false, and an `IF` only runs its `THEN` part when the condition is **`TRUE`**. So:

```sql
DECLARE
  v_x NUMBER;    -- no value, so it starts out NULL
BEGIN
  IF v_x = 1 THEN
    DBMS_OUTPUT.PUT_LINE('one');
  ELSIF v_x <> 1 THEN
    DBMS_OUTPUT.PUT_LINE('not one');
  ELSE
    DBMS_OUTPUT.PUT_LINE('unknown (NULL)');
  END IF;
END;
/
```

```text
unknown (NULL)

PL/SQL procedure successfully completed.
```

Neither `v_x = 1` nor `v_x <> 1` is true when `v_x` is `NULL`, so the `ELSE` runs. Variables you declare without a value start as `NULL`. That's why it's good to give variables a starting value, and to check for `NULL` with `IS NULL` where it could happen. You've seen the same three-valued logic in [Empty Strings Are NULL](/lessons/oracle-database/null-and-empty-strings).

## Choosing among many values: CASE

For picking based on one value, **`CASE`** is tidier than a long `IF` chain. It comes in two shapes. As an **expression**, it produces a value:

```sql
DECLARE
  v_day  NUMBER := 3;
  v_name VARCHAR2(10);
BEGIN
  v_name := CASE v_day
              WHEN 1 THEN 'Mon'
              WHEN 2 THEN 'Tue'
              WHEN 3 THEN 'Wed'
              ELSE 'Other'
            END;
  DBMS_OUTPUT.PUT_LINE(v_name);

  CASE
    WHEN v_day BETWEEN 1 AND 5 THEN DBMS_OUTPUT.PUT_LINE('Weekday');
    ELSE DBMS_OUTPUT.PUT_LINE('Weekend');
  END CASE;
END;
/
```

```text
Wed
Weekday

PL/SQL procedure successfully completed.
```

The first is the **expression** form (ending in `END`), and the second is a **statement** (ending in `END CASE;`), which runs statements in the matching branch. Both also come in a "searched" shape, without a value after `CASE`, where every branch has its own condition.

A `CASE` **statement** with no matching branch and no `ELSE` isn't quietly skipped, as it would be in some languages. It's an error:

```sql
DECLARE
  v_n NUMBER := 5;
BEGIN
  CASE v_n
    WHEN 1 THEN DBMS_OUTPUT.PUT_LINE('one');
    WHEN 2 THEN DBMS_OUTPUT.PUT_LINE('two');
  END CASE;
END;
/
```

```text
ORA-06592: CASE not found while executing CASE statement
ORA-06512: at line 7
```

Always add an `ELSE`, even if it's only `ELSE NULL;`. (`NULL;` on its own is a valid statement that does nothing. It's PL/SQL's "pass".)

## Repeating: FOR loops

The `FOR` loop counts, and is the one you'll use most:

```sql
BEGIN
  FOR i IN 1..3 LOOP
    DBMS_OUTPUT.PUT_LINE('Lap ' || i);
  END LOOP;

  FOR i IN REVERSE 1..3 LOOP
    DBMS_OUTPUT.PUT_LINE('Countdown ' || i);
  END LOOP;
END;
/
```

```text
Lap 1
Lap 2
Lap 3
Countdown 3
Countdown 2
Countdown 1

PL/SQL procedure successfully completed.
```

- `1..3` is a **range**: two dots, and both ends **included**, so it runs for 1, 2, and 3.
- The counter `i` is created by the loop itself: you don't `DECLARE` it, and it only exists inside the loop. You can't change it.
- `REVERSE` counts down. (Put the smaller number first, still: `REVERSE 1..3`.)
- The loop is closed with `END LOOP;`.

## WHILE and the basic LOOP

**`WHILE`** repeats as long as a condition is true, checking **before** each round:

```sql
DECLARE
  v_n NUMBER := 1;
BEGIN
  WHILE v_n <= 20 LOOP
    v_n := v_n * 2;
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('First power of 2 above 20: ' || v_n);
END;
/
```

```text
First power of 2 above 20: 32

PL/SQL procedure successfully completed.
```

The plain **`LOOP`** has no condition of its own. It runs forever, until something inside stops it with **`EXIT`**, or the more common **`EXIT WHEN condition`**:

```sql
DECLARE
  v_n NUMBER := 32;
BEGIN
  LOOP
    v_n := v_n - 10;
    EXIT WHEN v_n < 0;
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('After loop: ' || v_n);
END;
/
```

```text
After loop: -8

PL/SQL procedure successfully completed.
```

This one is the right tool when the loop must always run **at least once** (the check comes after the first round), like a "keep asking until the answer is valid" loop. Every loop with no natural end needs an `EXIT`, or it never stops.

## Skipping and stopping: CONTINUE and EXIT

Inside any loop, **`CONTINUE`** skips the rest of this round, and moves on to the next. **`EXIT`** leaves the loop entirely. Both can take a `WHEN`:

```sql
DECLARE
  v_total NUMBER := 0;
BEGIN
  FOR i IN 1..10 LOOP
    CONTINUE WHEN MOD(i, 2) = 0;    -- skip the even numbers
    EXIT WHEN i > 7;                -- stop after 7
    v_total := v_total + i;
  END LOOP;
  DBMS_OUTPUT.PUT_LINE('Sum of odd numbers up to 7: ' || v_total);
END;
/
```

```text
Sum of odd numbers up to 7: 16

PL/SQL procedure successfully completed.
```

The loop added 1, 3, 5, and 7, skipping the even ones, and stopped when it reached 9. 1 + 3 + 5 + 7 is 16.

## Putting it together

A small program with a decision inside a loop. It's the classic "FizzBuzz": for the numbers 1 to 15, say `Fizz` for multiples of 3, `Buzz` for multiples of 5, and `FizzBuzz` for both:

```sql
DECLARE
  v_line VARCHAR2(40);
BEGIN
  FOR i IN 1..15 LOOP
    IF MOD(i, 15) = 0 THEN
      v_line := 'FizzBuzz';
    ELSIF MOD(i, 3) = 0 THEN
      v_line := 'Fizz';
    ELSIF MOD(i, 5) = 0 THEN
      v_line := 'Buzz';
    ELSE
      v_line := TO_CHAR(i);
    END IF;
    DBMS_OUTPUT.PUT_LINE(v_line);
  END LOOP;
END;
/
```

```text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz

PL/SQL procedure successfully completed.
```

The multiples of 15 must be checked **first**. Otherwise 15 would be caught by the "multiple of 3" branch, and never reach `FizzBuzz`.

## Try it

A savings account starts with 100 and grows by 10% each month. This block finds how long it takes to double. Predict the output.

<CodeEditor
	language="plaintext"
	label="SQL practice editor, savings.sql"
	min-height="380px"
	:model-value="'DECLARE\n  v_balance NUMBER := 100;\n  v_months  NUMBER := 0;\nBEGIN\n  WHILE v_balance &lt; 200 LOOP\n    v_balance := v_balance * 1.1;\n    v_months := v_months + 1;\n  END LOOP;\n\n  DBMS_OUTPUT.PUT_LINE(\'Months to double: \' || v_months\n                       || \', balance \' || ROUND(v_balance, 2));\nEND;\n/\n'"
/>

::: info Running Oracle SQL
Syntaxia can't run Oracle Database in the browser, because it needs a real Oracle server. Paste this block into FreeSQL, or any Oracle tool, and don't forget `SET SERVEROUTPUT ON` in SQL\*Plus and SQLcl.
:::

::: details Check your prediction
```text
Months to double: 8, balance 214.36

PL/SQL procedure successfully completed.
```

The balance grows by a tenth each round: 110, 121, 133.1, 146.41, 161.05, 177.16, 194.87, and finally 214.36 after eight months, which is the first to reach 200. (Multiplying by 1.1 seven times gives 194.87, still below 200, so the loop runs an eighth time.)
:::

## Try it yourself

1. Change the growth to 5% (`* 1.05`). How many months does it take now?
2. Rewrite the loop as a `LOOP` with `EXIT WHEN v_balance >= 200`. Does it give the same answer?
3. Write a `FOR` loop that prints the multiplication table of 7, from `7 x 1 = 7` to `7 x 10 = 70`.

## Check your understanding

<Quiz
	question="Which is the correct spelling of the extra-condition keyword in a PL/SQL IF?"
	:options="['ELSEIF', 'ELIF', 'ELSIF', 'ELSE IF']"
	:answer-index="2"
	explanation="PL/SQL spells it ELSIF, one word. ELSE IF would need its own END IF."
/>

<Quiz
	question="A variable v_x is NULL. What does IF v_x = 1 THEN ... ELSIF v_x <> 1 THEN ... ELSE ... END IF run?"
	:options="['The THEN part', 'The ELSIF part', 'It raises an error', 'The ELSE part, because both conditions are unknown']"
	:answer-index="3"
	explanation="Comparisons with NULL are neither true nor false, so neither condition is TRUE, and the ELSE runs."
/>

<Quiz
	question="Which loop is best when the body must run at least once, and stops on a condition checked at the end?"
	:options="['FOR i IN 1..10', 'LOOP with EXIT WHEN', 'WHILE condition LOOP', 'CASE']"
	:answer-index="1"
	explanation="A plain LOOP runs its body first, and EXIT WHEN can be placed after the work, so it always runs at least once."
/>

## Up next

So far, your blocks read a single row with `SELECT INTO`. To go through **many** rows, one by one, PL/SQL uses cursors. That's [Cursors: Looping over Query Results](/lessons/oracle-database/cursors).
