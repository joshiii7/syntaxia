---
title: "Python f-strings: Format Numbers and Text Cleanly"
description: "Build text from values with Python f-strings: put variables and expressions inside braces, round decimals, add thousands separators, and line up columns."
---

# Formatting Output with f-strings

*A fill-in-the-blanks form, where each blank also says how to write the answer: "date, as DD/MM/YYYY" or "amount, to two decimal places."*

So far, you've built messages in two ways: commas inside `print`, and `+` with `str()`. Both work, but both get clumsy fast:

```python
name = "Maria"
average = 88.33333333333333
print("Student: " + name + ", average: " + str(average) + ".")
```

```text
Student: Maria, average: 88.33333333333333.
```

That's a lot of quotes and plus signs, and the average has far more decimal places than anyone wants. Python has a much better tool for this job: the **f-string**.

## A form with blanks

Think of a printed form: "Name: ________. Grade: ________." Anyone can read it and see exactly where each piece of information goes. Good forms even say *how* to fill in each blank: "Amount (two decimal places): ________."

An f-string is that form, written in code. The fixed text is written as-is, and each blank is a pair of curly braces with the value that goes in it.

## Your first f-string

Put the letter `f` right before the opening quote, and write variable names inside `{ }`:

```python
name = "Maria"
grade = 11
print(f"Student: {name}, grade {grade}.")
```

```text
Student: Maria, grade 11.
```

Python replaces each `{...}` with its value, converting numbers to text automatically. No `+`, no `str()`, and the spaces and punctuation are exactly where you typed them.

Forget the `f`, and the braces are printed as ordinary characters:

```python
name = "Maria"
print("Hello, {name}!")
```

```text
Hello, {name}!
```

That's the most common f-string mistake, and there's no error to warn you. If you see braces in your output, check for the `f`.

## Any expression goes in the braces

The braces don't just hold variable names. Any expression works: math, method calls, even function calls:

```python
price = 65
quantity = 3
name = "maria"
print(f"Total: {price * quantity} pesos")
print(f"Hello, {name.title()}!")
print(f"Your name has {len(name)} letters.")
```

```text
Total: 195 pesos
Hello, Maria!
Your name has 5 letters.
```

Keep what's inside the braces short, though. If the expression gets complicated, work it out on the line before, store it in a well-named variable, and put just the name in the braces.

## Formatting numbers

Here's where f-strings really shine. After the value, add a colon and a **format code** that says how to write it.

**Decimal places.** `:.2f` means "a number with 2 digits after the decimal point," rounding as needed:

```python
average = 88.33333333333333
print(f"Average: {average:.2f}")
print(f"Average: {average:.1f}")
print(f"Average: {average:.0f}")
```

```text
Average: 88.33
Average: 88.3
Average: 88
```

**Thousands separators.** `:,` adds commas to big numbers, and you can combine it with decimal places:

```python
population = 8100000000
budget = 1234567.891
print(f"{population:,} people")
print(f"{budget:,.2f} pesos")
```

```text
8,100,000,000 people
1,234,567.89 pesos
```

**Percentages.** `:.1%` multiplies by 100 and adds a percent sign:

```python
passed = 18
students = 24
print(f"Pass rate: {passed / students:.1%}")
```

```text
Pass rate: 75.0%
```

Format codes only change how the value is *shown*. The variable itself keeps every digit.

## Lining things up

A number after the colon sets a **width**: the least number of characters the value should take up. `<` lines it up on the left, `>` on the right, and `^` in the middle:

```python
print(f"[{'left':<10}]")
print(f"[{'right':>10}]")
print(f"[{'mid':^10}]")
```

```text
[left      ]
[     right]
[   mid    ]
```

(Inside the braces, the text uses single quotes, so it doesn't end the f-string's double quotes early.)

Widths are perfect for tables. Put a width on each column, and every row lines up, no matter how long each value is:

```python
print(f"{'Item':<10}{'Price':>8}")
print(f"{'Adobo':<10}{65:>8.2f}")
print(f"{'Juice':<10}{20:>8.2f}")
```

```text
Item         Price
Adobo        65.00
Juice        20.00
```

`>8.2f` means "right-aligned, 8 characters wide, 2 decimal places," which lines the decimal points up neatly.

## A debugging shortcut: `=`

When you're checking what a variable holds, add `=` after it inside the braces. The f-string prints the name, an equals sign, and the value:

```python
score = 88
lives = 2
print(f"{score=}, {lives=}")
```

```text
score=88, lives=2
```

It's a quick way to see several values at once while you're hunting a bug. You'll use it in [Debugging Python Programs](/lessons/python/debugging).

## Printing a real brace

Since braces mark the blanks, how do you print an actual `{` or `}`? Double it:

```python
count = 3
print(f"{{count}} is {count}")
```

```text
{count} is 3
```

## Try it

This program prints a cafeteria receipt with lined-up columns, a total, and a discount. Predict the output, paying attention to widths and decimal places.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'student = &quot;maria santos&quot;\nadobo_price = 65\njuice_price = 20.5\nadobo_qty = 2\njuice_qty = 3\n\nadobo_total = adobo_price * adobo_qty\njuice_total = juice_price * juice_qty\ntotal = adobo_total + juice_total\ndiscount = 0.1\n\nprint(f&quot;Receipt for {student.title()}&quot;)\nprint(f&quot;{\'Item\':&lt;12}{\'Qty\':&gt;4}{\'Total\':&gt;10}&quot;)\nprint(f&quot;{\'Adobo\':&lt;12}{adobo_qty:&gt;4}{adobo_total:&gt;10.2f}&quot;)\nprint(f&quot;{\'Juice\':&lt;12}{juice_qty:&gt;4}{juice_total:&gt;10.2f}&quot;)\nprint(&quot;-&quot; * 26)\nprint(f&quot;{\'Subtotal\':&lt;16}{total:&gt;10.2f}&quot;)\nprint(f&quot;Student discount: {discount:.0%}&quot;)\nprint(f&quot;{\'You pay\':&lt;16}{total * (1 - discount):&gt;10.2f}&quot;)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Receipt for Maria Santos
Item         Qty     Total
Adobo          2    130.00
Juice          3     61.50
--------------------------
Subtotal            191.50
Student discount: 10%
You pay             172.35
```

The item names are padded to 12 characters on the left, the quantities to 4 on the right, and the totals to 10 on the right with 2 decimal places, so every column lines up. `{discount:.0%}` turns `0.1` into `10%`.
:::

## Try it yourself

1. Add a third item, rice at 15 pesos, quantity 2, and include it in the total. Does everything still line up?
2. Print the total number of items bought, using an f-string with an expression inside the braces.
3. Print `The total is 191.5, which is 191.50 with two decimals.` using a single f-string and the `total` variable twice, with a different format each time.

## Check your understanding

<Quiz
	question="What does print(f&quot;{3.14159:.2f}&quot;) print?"
	:options="['3.14159', '3.1', '3.14', '3.15']"
	:answer-index="2"
	explanation=":.2f shows the number with 2 digits after the decimal point, rounding as needed."
/>

<Quiz
	question="name = &quot;Ben&quot;, then print(&quot;Hi, {name}!&quot;). What is printed?"
	:options="['Hi, {name}!', 'Hi, Ben!', 'An error', 'Hi, !']"
	:answer-index="0"
	explanation="Without the f before the opening quote, it's an ordinary string, so the braces are printed as-is. There is no error to warn you."
/>

<Quiz
	question="Which f-string prints 1234567 as 1,234,567?"
	:options="['f&quot;{n:.2f}&quot;', 'f&quot;{n:&gt;10}&quot;', 'f&quot;{n:%}&quot;', 'f&quot;{n:,}&quot;']"
	:answer-index="3"
	explanation="The comma format code adds a separator every three digits."
/>

## Up next

That completes the Values and Operators chapter. Your programs can store values, calculate, read input, and print it all neatly. Next, they'll start making choices, in [Making Decisions: if, elif, and else](/lessons/python/if-elif-else).
