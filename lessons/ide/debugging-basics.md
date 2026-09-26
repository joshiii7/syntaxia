---
title: Debugging Basics in an IDE
description: What debugging actually means, and the built-in tools an IDE gives you for it beyond just reading error messages.
---

# Debugging Basics in an IDE

Every developer, at every skill level, writes code that does not work correctly on the first try. **Debugging** is simply the process of figuring out why, and an IDE gives you real tools for it beyond just staring at the code.

## The simplest form of debugging

The most basic debugging tool is one you likely already know: printing something out while your code runs, to see what is actually happening.

```js
console.log('user input was:', userInput);
```

This works, and plenty of real debugging still happens this way. Its limit shows up once a problem is subtle, buried deep inside a function, or only happens after several steps. Adding and removing `console.log` lines by hand becomes slow and messy. That is the gap an IDE's actual debugger closes.

## Breakpoints: pausing code mid-run

A **breakpoint** tells the IDE "pause exactly here when this line runs." In VS Code, you set one by clicking in the empty space just left of a line number, which marks it with a red dot. When you then run your code through VS Code's debugger (the Run and Debug icon in the left sidebar), execution stops the moment it reaches that line, before continuing further.

While paused, you can:

- **Inspect variables.** See the exact value of every variable at that exact moment, not just the one you remembered to print.
- **Step through code.** Advance one line at a time, watching values change as each line runs.
- **Resume.** Let the code continue running normally until the next breakpoint, or the end.

This turns "guess what the code is doing" into "watch what the code is actually doing," one step at a time.

## Reading an error message properly

Errors themselves are also part of debugging, and they are more useful than they first appear. A typical error points to an exact file and line number, for example a typo in a variable name in the kind of JavaScript covered in [Intro to JavaScript](/lessons/javascript/intro-to-javascript). The habit worth building early is reading the *first* line of an error message carefully, since it usually names the actual problem, even when the rest of the message looks like unfamiliar technical noise.

## Debugging isn't only for JavaScript and Python

HTML and CSS mistakes are debugged differently, since they rarely produce a formal error message, they simply render incorrectly. There, your browser's own built-in developer tools (usually opened with `F12` or a right-click "Inspect") serve a similar role to an IDE's debugger: letting you click an element on the page and see exactly which HTML produced it and which CSS is being applied, which is worth remembering once you reach [Attributes](/lessons/html/attributes) and beyond.

## A realistic debugging habit

1. Read the error message's first line, if there is one.
2. If there is no error but the output is still wrong, add a breakpoint or a `console.log` near where you suspect the problem is.
3. Narrow it down by moving that breakpoint closer to the actual mistake, one step at a time.
4. Fix the smallest thing that explains what you observed, then re-run to confirm.

## Check your understanding

<Quiz
	question="What does setting a breakpoint in an IDE do?"
	:options="['Deletes the line permanently', 'Pauses code execution at that exact line so you can inspect it', 'Automatically fixes any errors', 'Formats the entire file']"
	:answer-index="1"
	explanation="A breakpoint pauses execution at that line, letting you inspect variable values and step through the following lines one at a time."
/>

## What you learned

- Debugging is the process of figuring out why code did not do what you expected, and IDEs offer real tools for it beyond print statements.
- A breakpoint pauses code exactly where you place it, letting you inspect variables and step through execution.
- Reading the first line of an error message carefully usually points directly at the actual problem.
- HTML and CSS mistakes are typically debugged visually instead, using a browser's own developer tools rather than an IDE's line-by-line debugger.

The [next lesson](/lessons/ide/extensions-and-customization) looks at extending your IDE further, with add-ons for exactly the languages and tools you use most.
