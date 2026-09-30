---
title: "Python Final Project: Build a Personal Budget Tracker"
description: "Put the whole Python track to work by building a budget tracker that records expenses, reports spending by category, and saves everything to a JSON file."
---

# Final Project: Personal Budget Tracker

*Every lesson gave you one tool. This project hands you the whole toolbox and a real job to do.*

Before the project, one more look back.

At the start of this track, your first program was one line: `print("Hello, world!")`. You weren't sure what the parentheses were for, or why the quotes mattered.

Look at what you know now. You can store values in variables, and you know why `"5" + "5"` is `"55"`. You can read what a user types and turn it into numbers. You can make decisions, repeat work, and stop a loop exactly when you mean to. You can package code into functions with sensible inputs and outputs, and split a program into modules. You can keep collections in lists, tuples, dictionaries, and sets, nest them inside each other, and build new ones in a single line. You can design your own classes. You can read a traceback from the bottom up, catch the problems you expect, and save your data in files and JSON so it's still there tomorrow.

There were surely moments when nothing worked: an `IndentationError` you couldn't see, a `NameError` for a name you were *sure* you'd created, a loop that wouldn't stop. You read the clues, found the cause, and fixed it. That's the real skill, and you have it now.

I'm genuinely proud of you. Let's build something.

## The project

You'll build a **Personal Budget Tracker**: a program that runs in the terminal and helps you see where your money goes. It shows a menu, and you pick what to do:

1. **Add an expense**: what you bought, how much it cost, and which category it belongs to.
2. **Show the report**: the total for each category, what share of your spending it is, your biggest expense, and how much of your monthly budget is left.
3. **Save** everything to a file.
4. **Save and quit.**

When the program starts again, it **loads** your saved expenses, so nothing is lost.

It's the kind of small, genuinely useful tool that programmers build for themselves all the time. And it uses something from nearly every chapter of this track.

## Getting set up

This is a project for your own computer.

1. Make a new folder called `budget-tracker`, and open it in your code editor.
2. Create a file called `main.py` in it.
3. Copy the starter code below into `main.py`, and run it with `python main.py` (or `python3 main.py` on macOS and Linux).

The starter code already runs. It shows the menu, lets you pick an option, and quits when you choose 4. Every other option just prints a `TODO` message for now. Your job is to replace those with the real thing.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="520px"
	:model-value="'&quot;&quot;&quot;Personal Budget Tracker: record expenses, see where the money goes, and save it all.&quot;&quot;&quot;\n\nimport json\n\nSAVE_FILE = &quot;budget.json&quot;\nMONTHLY_BUDGET = 3000\nCATEGORIES = (&quot;food&quot;, &quot;transport&quot;, &quot;school&quot;, &quot;fun&quot;, &quot;other&quot;)\n\n\ndef load_expenses():\n    # TODO (requirement 5): load saved expenses from SAVE_FILE.\n    return []\n\n\ndef print_menu():\n    print()\n    print(&quot;=== Budget Tracker ===&quot;)\n    print(&quot;1. Add an expense&quot;)\n    print(&quot;2. Show the report&quot;)\n    print(&quot;3. Save&quot;)\n    print(&quot;4. Save and quit&quot;)\n\n\ndef main():\n    expenses = load_expenses()\n    while True:\n        print_menu()\n        choice = input(&quot;Choose: &quot;).strip()\n        if choice == &quot;1&quot;:\n            print(&quot;TODO: add an expense&quot;)\n        elif choice == &quot;2&quot;:\n            print(&quot;TODO: show the report&quot;)\n        elif choice == &quot;3&quot;:\n            print(&quot;TODO: save&quot;)\n        elif choice == &quot;4&quot;:\n            print(&quot;Goodbye!&quot;)\n            break\n        else:\n            print(&quot;Please choose a number from 1 to 4.&quot;)\n\n\nif __name__ == &quot;__main__&quot;:\n    main()\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. You can read and edit the starter code here, but build and run the project on your own computer. If you haven't set Python up yet, [Setting Up](/lessons/python/setting-up) walks you through it.
:::

Work through the requirements in order, and run your program after each one. Small steps, tested often, are how every real program gets built.

## Requirements

Each requirement says what to build, **why** it matters, and which lessons to review.

### 1. Store each expense as a dictionary

Keep all your expenses in one list, where each expense is a dictionary with three keys:

```python
{"description": "Movie ticket", "amount": 350.0, "category": "fun"}
```

**Why:** A list of dictionaries is the most common shape for real data, and it's exactly what JSON saves and loads, which you'll need in requirement 5. Review: [Lists](/lessons/python/lists), [Dictionaries](/lessons/python/dictionaries), and [Nested Data Structures](/lessons/python/nested-data).

### 2. Add expenses, with input you can trust

Write an `add_expense(expenses)` function for menu option 1:

- Ask for a description. If it's empty, say so and go back to the menu.
- Ask for the amount with its own function, `ask_amount()`, that **keeps asking** until the user types a number greater than zero. Catch the `ValueError` from `float()`; the program must never crash on `"thirteen"`.
- Ask for the category with a function `ask_category()` that keeps asking until the answer is one of the `CATEGORIES`. Ignore capital letters and extra spaces, so `" School"` counts as `"school"`.
- Add the new dictionary to the list, and confirm what was added.

**Why:** Users type unexpected things. A program that answers "Please type a number" instead of crashing is one people can trust. Review: [Reading User Input with input()](/lessons/python/user-input), [break and continue](/lessons/python/break-and-continue), [Exceptions](/lessons/python/exceptions), and [Writing Functions](/lessons/python/functions).

### 3. Total the spending by category

Write a function `total_by_category(expenses)` that **returns** a dictionary like `{"food": 120.0, "fun": 350.0}`, with the total spent in each category that has any expenses.

**Why:** Separating the calculation from the printing means you can reuse it, test it on its own in the interactive shell, and change the report without touching the math. Review: [Dictionaries](/lessons/python/dictionaries) (the counting pattern) and [Parameters and Return Values](/lessons/python/parameters).

### 4. A clear, lined-up report

Menu option 2 prints a report like the one in the sample run below:

- One row per category, sorted from the most spent to the least, with its total (2 decimal places) and its share of all spending as a percentage.
- A row with the overall total.
- The single biggest expense.
- How much of `MONTHLY_BUDGET` is left, or how far over budget you are.
- If there are no expenses yet, a friendly message instead of an empty table.

Use f-strings with widths, like `{category:<12}` and `{total:>10.2f}`, so the columns line up.

**Why:** A report is only useful if people can read it at a glance. Review: [Formatting Output with f-strings](/lessons/python/f-strings), and `sorted` and `max` with `key=` from [Lists](/lessons/python/lists) and [Dictionaries](/lessons/python/dictionaries).

### 5. Save and load with JSON

- **Save** (options 3 and 4): write the list of expenses to `budget.json` with `json.dump`, using `indent=2` so it's readable.
- **Load** (when the program starts): read `budget.json` with `json.load`. If the file doesn't exist yet, print a message and start with an empty list. If the file is damaged and isn't valid JSON, don't crash: say so, and start fresh.
- Always open files with `with` and `encoding="utf-8"`.

**Why:** Programs that forget everything aren't much use. JSON lets you save the whole list of dictionaries in one line, and you can open `budget.json` in your editor to see exactly what was saved. Review: [Reading and Writing Files](/lessons/python/file-io) and [Working with JSON](/lessons/python/json).

### 6. Clean, readable code

- Follow PEP 8: snake_case names, 4-space indents, two blank lines between functions.
- No magic numbers or repeated text: the save file name, the monthly budget, and the categories are constants at the top.
- Small functions, each doing one job, with names that are verbs. `main()` reads like a summary of the program.
- No bare `except:`, and no `except` block that silently does nothing.
- The program starts from `main()`, inside `if __name__ == "__main__":`.

**Why:** You'll come back to this code. So might a teammate, a teacher, or a future employer. Review: [Best Practices and Common Mistakes](/lessons/python/best-practices).

## Sample run

Your wording doesn't have to match exactly, but your program should handle every situation shown here. The text after each prompt, like `Choose:` or `Amount in pesos:`, is what the user typed. (In the fourth entry, the user just pressed Enter.) The menu prints before every choice; after the first time, it's left out here to save space.

```text
No saved expenses yet. Starting fresh.

=== Budget Tracker ===
1. Add an expense
2. Show the report
3. Save
4. Save and quit
Choose: 2
No expenses yet. Add one with option 1.

Choose: 1
What did you buy? Chicken adobo lunch
Amount in pesos: 120
Category (food, transport, school, fun, other): food
Added: Chicken adobo lunch, 120.00 pesos (food).

Choose: 1
What did you buy? Jeepney fare
Amount in pesos: thirteen
Please type a number, like 85 or 12.50.
Amount in pesos: 13
Category (food, transport, school, fun, other): commute
Please choose one of: food, transport, school, fun, other.
Category (food, transport, school, fun, other): transport
Added: Jeepney fare, 13.00 pesos (transport).

Choose: 1
What did you buy?
The description can't be empty.

Choose: 1
What did you buy? Notebooks
Amount in pesos: -5
The amount must be more than zero.
Amount in pesos: 185.50
Category (food, transport, school, fun, other): School
Added: Notebooks, 185.50 pesos (school).

Choose: 1
What did you buy? Movie ticket
Amount in pesos: 350
Category (food, transport, school, fun, other): fun
Added: Movie ticket, 350.00 pesos (fun).

Choose: 2
Category         Total   Share
fun             350.00     52%
school          185.50     28%
food            120.00     18%
transport        13.00      2%
All             668.50
Biggest expense: Movie ticket (350.00)
Budget left this month: 2331.50 of 3000

Choose: 7
Please choose a number from 1 to 4.

Choose: 4
Saved 4 expenses to budget.json.
Goodbye!
```

The next time the program starts, its first line is `Loaded 4 expenses from budget.json.`

## Testing your program

There's no automatic checker for this project, so you're the tester. Try each of these, and make sure nothing crashes:

- Show the report before adding anything.
- Type `abc`, `-5`, `0`, and `12.345` as amounts.
- Type `Food`, `  fun  `, and `snacks` as categories.
- Press Enter without typing a description.
- Type `9` and `hello` at the menu.
- Quit, run the program again, and check that your expenses came back.
- Open `budget.json`, delete a curly brace so the file is broken, and start the program again.
- Delete `budget.json` entirely, and start the program again.

## Stretch goals (optional, for the ambitious)

- Add a menu option that lists every expense with a number, and another that deletes an expense by its number.
- Add a date to each expense with the `datetime` module, and show the report for one month at a time.
- Turn each expense into an `Expense` class with `__str__`, using [Classes and Objects](/lessons/python/classes-and-objects) and [Special Methods](/lessons/python/special-methods), converting to and from dictionaries when saving and loading.
- Move the saving and loading functions into their own module, `storage.py`, and import it.
- When the budget is more than 80% spent, print a warning after each new expense.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own code. Every "no" is just a pointer to your next improvement.

1. Can I explain what every function does from its name alone?
2. Did I try every case in "Testing your program," and did the program survive all of them?
3. Does every error message tell the user what went wrong **and** what to do instead?
4. If I change `MONTHLY_BUDGET` or add a category, is it a one-line change?
5. Do my calculation functions return values, leaving the printing to other functions?
6. Are there any magic numbers, bare `except:` blocks, or files opened without `with` left in my code?
7. If I came back to this in six months, could I add a new menu option without being afraid of breaking the others?
8. When I use my program, does it feel like a real tool I'd actually keep using?

If you answered yes to all eight, you've built a real, complete Python application. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good programmers become great ones.

## Stuck? A reference solution

Try to finish on your own first. Struggling with a problem, and then solving it, is exactly how the skill sticks. But if you're truly stuck on one part, or you've finished and want to compare, here's one complete solution. It's not the only right answer; if yours works and reads clearly, it's just as good.

::: details Show the reference solution
```python
"""Personal Budget Tracker: record expenses, see where the money goes, and save it all."""

import json

SAVE_FILE = "budget.json"
MONTHLY_BUDGET = 3000
CATEGORIES = ("food", "transport", "school", "fun", "other")


def load_expenses():
    """Load saved expenses, or start with an empty list if there's no usable save file."""
    try:
        with open(SAVE_FILE, encoding="utf-8") as file:
            expenses = json.load(file)
    except FileNotFoundError:
        print("No saved expenses yet. Starting fresh.")
        return []
    except json.JSONDecodeError:
        print(f"{SAVE_FILE} is damaged, so it was ignored. Starting fresh.")
        return []
    print(f"Loaded {len(expenses)} expenses from {SAVE_FILE}.")
    return expenses


def save_expenses(expenses):
    with open(SAVE_FILE, "w", encoding="utf-8") as file:
        json.dump(expenses, file, indent=2)
    print(f"Saved {len(expenses)} expenses to {SAVE_FILE}.")


def ask_amount():
    """Keep asking until the user types a positive number."""
    while True:
        text = input("Amount in pesos: ").strip()
        try:
            amount = float(text)
        except ValueError:
            print("Please type a number, like 85 or 12.50.")
            continue
        if amount <= 0:
            print("The amount must be more than zero.")
            continue
        return round(amount, 2)


def ask_category():
    """Keep asking until the user types one of the known categories."""
    options = ", ".join(CATEGORIES)
    while True:
        category = input(f"Category ({options}): ").strip().lower()
        if category in CATEGORIES:
            return category
        print(f"Please choose one of: {options}.")


def add_expense(expenses):
    description = input("What did you buy? ").strip()
    if not description:
        print("The description can't be empty.")
        return
    amount = ask_amount()
    category = ask_category()
    expenses.append({"description": description, "amount": amount, "category": category})
    print(f"Added: {description}, {amount:.2f} pesos ({category}).")


def total_by_category(expenses):
    totals = {}
    for expense in expenses:
        totals[expense["category"]] = totals.get(expense["category"], 0) + expense["amount"]
    return totals


def print_report(expenses):
    if not expenses:
        print("No expenses yet. Add one with option 1.")
        return

    totals = total_by_category(expenses)
    grand_total = sum(totals.values())

    print(f"{'Category':<12}{'Total':>10}{'Share':>8}")
    for category, total in sorted(totals.items(), key=lambda pair: pair[1], reverse=True):
        print(f"{category:<12}{total:>10.2f}{total / grand_total:>8.0%}")
    print(f"{'All':<12}{grand_total:>10.2f}")

    biggest = max(expenses, key=lambda expense: expense["amount"])
    print(f"Biggest expense: {biggest['description']} ({biggest['amount']:.2f})")

    left = MONTHLY_BUDGET - grand_total
    if left >= 0:
        print(f"Budget left this month: {left:.2f} of {MONTHLY_BUDGET}")
    else:
        print(f"Over budget by {-left:.2f}!")


def print_menu():
    print()
    print("=== Budget Tracker ===")
    print("1. Add an expense")
    print("2. Show the report")
    print("3. Save")
    print("4. Save and quit")


def main():
    expenses = load_expenses()
    while True:
        print_menu()
        choice = input("Choose: ").strip()
        if choice == "1":
            add_expense(expenses)
        elif choice == "2":
            print_report(expenses)
        elif choice == "3":
            save_expenses(expenses)
        elif choice == "4":
            save_expenses(expenses)
            print("Goodbye!")
            break
        else:
            print("Please choose a number from 1 to 4.")


if __name__ == "__main__":
    main()
```
:::

## Check your understanding

<Quiz
	question="Why does ask_amount() keep asking in a loop instead of converting the answer once?"
	:options="['Loops make the program faster', 'float() only works inside a loop', 'Users type unexpected things, so the program asks again until it gets a positive number, instead of crashing', 'It is required by the json module']"
	:answer-index="2"
	explanation="A while True loop with try and except turns a ValueError into a friendly message and a second chance, and break or return only happens with a good answer."
/>

<Quiz
	question="Why is each expense stored as a dictionary inside one list?"
	:options="['It is the only kind of data Python can print', 'A list of dictionaries keeps each expense\'s details together, and saves and loads straight to and from JSON', 'Dictionaries use less memory than lists', 'Lists cannot hold numbers']"
	:answer-index="1"
	explanation="Each dictionary holds one expense's description, amount, and category together, and json.dump and json.load handle the whole list in one line."
/>

<Quiz
	question="When the program starts and budget.json is damaged, what should a well-built loader do?"
	:options="['Crash with a JSONDecodeError', 'Delete the computer\'s files', 'Quit without a message', 'Catch json.JSONDecodeError, tell the user, and start with an empty list']"
	:answer-index="3"
	explanation="A damaged file is an expected problem, so the program catches that specific exception, explains what happened, and carries on."
/>

## Where you go from here

You've finished the Python track. Take a moment with that. You started with a program that printed one line, and you've just built an application with its own menu, input checking, calculations, reports, and saved data.

Python opens a lot of doors from here. With **Django** or **Flask**, you can build the server side of websites. With **pandas** and **Matplotlib**, you can analyze data and draw charts, which is the everyday work of data scientists. **Machine learning** and AI are mostly done in Python, with libraries like scikit-learn and PyTorch. And automation, using Python to take boring, repetitive jobs off your hands, is something you can start doing tomorrow.

When you want a database behind your programs, the [SQLite3 track](/lessons/sqlite3/select) teaches SQL, and its lesson on using SQLite from Python connects straight back to what you know now.

Whichever way you go, the ideas you've learned here, variables, functions, data structures, objects, exceptions, and the patience to read an error message calmly, travel with you into every language you learn next. Well done.
