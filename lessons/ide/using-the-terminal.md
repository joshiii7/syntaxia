---
title: Using the Integrated Terminal
description: What a terminal is, how to open VS Code's built-in one, and the handful of commands worth knowing early.
---

# Using the Integrated Terminal

[Introduction to IDEs](/lessons/ide/introduction) briefly mentioned that most IDEs include a terminal. This lesson explains what that actually means, and how to use the one built into VS Code.

## What a terminal actually is

A terminal is a text-based way to give your computer instructions, by typing commands instead of clicking icons. It looks intimidating at first, mostly because it is just a blank space waiting for text, with none of the visual hints a normal application gives you. In practice, you only need a handful of commands to get real use out of it.

## Opening it in VS Code

Press `` Ctrl+` `` (Windows/Linux) or `` Cmd+` `` (Mac), the backtick key, usually just above Tab. A panel opens at the bottom of the window, already pointed at your current project folder. This is the entire benefit of an *integrated* terminal: it opens already in the right place, with no separate window to manage, and sits right next to the files you are editing.

## A handful of commands worth knowing

| Command | What it does |
|---|---|
| `dir` (Windows) / `ls` (Mac/Linux) | Lists the files and folders in your current location |
| `cd folder-name` | Moves into a folder named `folder-name` |
| `cd ..` | Moves back up one folder |
| `cls` (Windows) / `clear` (Mac/Linux) | Clears the terminal's text, purely for tidiness |

These four alone cover most of what a beginner needs: looking at where you are, and moving around.

## Running your own code from it

Once you reach the [JavaScript](/lessons/javascript/intro-to-javascript) and [Python](/lessons/python/intro-to-python) sections of this book, the terminal becomes genuinely necessary rather than optional, since both languages are commonly run by typing a command directly, for example:

```
node app.js
python app.py
```

HTML has no equivalent command, since a browser opens `.html` files directly, which is why the terminal was only mentioned briefly, not required, in the earlier HTML-focused lessons.

## Why integrated beats separate

Before IDEs commonly bundled a terminal, developers ran a completely separate terminal application alongside their editor, manually keeping both windows arranged and both pointed at the same folder. An integrated terminal removes that bookkeeping entirely: it already knows which folder you have open, and closing or reopening your editor does not lose your place.

## Check your understanding

<Quiz
	question="What keyboard shortcut opens VS Code's built-in terminal (Windows/Linux)?"
	:options="['Ctrl+T', 'Ctrl+`', 'Ctrl+Shift+N', 'Ctrl+Enter']"
	:answer-index="1"
	explanation="Ctrl+` (the backtick key) opens the integrated terminal panel, already pointed at your open project folder."
/>

## What you learned

- A terminal lets you control your computer by typing commands instead of clicking, and VS Code's version opens already pointed at your project folder.
- `dir`/`ls` lists files, `cd folder-name` moves into a folder, and `cd ..` moves back up.
- Running JavaScript or Python files typically requires typing a command like `node app.js` or `python app.py`, unlike HTML, which a browser opens directly.
- An integrated terminal avoids manually keeping a separate terminal window arranged and pointed at the right folder.

The [next lesson](/lessons/ide/debugging-basics) looks at another built-in tool: catching and inspecting mistakes while your code actually runs.
