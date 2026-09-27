---
title: Extensions & Customization
description: What extensions are, a few genuinely useful ones for this book's languages, and how to customize an IDE without overdoing it.
---

# Extensions & Customization

[Setting Up Your IDE](/lessons/ide/setting-up-your-ide) mentioned that VS Code might suggest an extension or two and told you it was fine to skip them for now. This lesson explains what extensions actually are, so you can choose a few deliberately.

## What an extension is

An **extension** is a small add-on that adds a specific feature to your IDE: support for a new language, a helper tool, or a visual theme. VS Code's own core does not know everything about every language by default; extensions are how that knowledge gets added, one focused piece at a time, so the base program stays fast for everyone rather than shipping every possible feature to every user.

## Installing one

1. Click the square-icon "Extensions" panel in VS Code's left sidebar, or press `Ctrl+Shift+X` / `Cmd+Shift+X`.
2. Type the name of what you want in the search box.
3. Click **Install** on the result from the actual publisher you intend, not just the first result. Many extensions share similar names.

## A few genuinely useful ones for this book

- **Live Server.** Adds a "Go Live" button that opens your HTML file in a browser and automatically refreshes it every time you save, removing the manual "find the file, double-click it again" step from earlier lessons like [Your First HTML File](/lessons/html/your-first-html-file).
- **Prettier.** Automatically reformats your code's spacing and indentation to a consistent style whenever you save, useful once you are writing enough CSS or JavaScript that formatting by hand becomes tedious.
- **Python** (by Microsoft). Adds the smart suggestions, error checking, and debugging support covered in the [previous lesson](/lessons/ide/debugging-basics), specifically for Python files.

None of these are required to follow this book. They are conveniences worth adding once you are comfortable with the basics, not before.

## Customization beyond extensions

A few settings are worth knowing about even without installing anything:

- **Color theme.** `Ctrl+K Ctrl+T` (Windows/Linux) or `Cmd+K Cmd+T` (Mac) opens a live preview picker for VS Code's built-in themes, changing the editor's colors without touching your actual code.
- **Font size.** Found in `File > Preferences > Settings` (or `Code > Settings` on Mac), searchable by typing "font size."
- **Auto save.** `File > Auto Save` toggles saving automatically as you type, instead of remembering to press `Ctrl+S`/`Cmd+S` every time.

## A word of caution

Extensions run code on your computer, written by whoever published them, not by Microsoft. Before installing one, it is worth glancing at how many people have installed it and its rating, both shown right on its listing, and preferring extensions published by a name you recognize (like "Microsoft" for the Python extension above) when one is available. Installing dozens of extensions "just in case" also tends to slow an IDE down over time. A small, deliberate set beats installing everything you come across.

## Check your understanding

<Quiz
	question="What is an extension, in the context of an IDE like VS Code?"
	:options="['A required part of the IDE that cannot be removed', 'A small add-on that adds a specific feature, like support for a language or tool', 'A type of file you can open', 'A separate, completely different program']"
	:answer-index="1"
	explanation="An extension is an optional add-on that adds one specific feature to your IDE, such as language support or a helper tool, without bloating the base program for users who don't need it."
/>

## What you learned

- Extensions are optional add-ons that add specific features, like language support or helper tools, rather than being built into the IDE's core.
- Useful early choices for this book include Live Server for HTML, Prettier for consistent formatting, and the Python extension for Python-specific support.
- Themes, font size, and auto save are worth customizing even without installing any extensions.
- Extensions run code from their publisher, so checking install counts and ratings, and keeping your list small and deliberate, is worth doing.

The [final lesson](/lessons/ide/shortcuts-cheat-sheet) in this section is a quick-reference list of the shortcuts covered across this whole section, in one place.
