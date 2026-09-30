---
title: "JavaScript Errors and Debugging: try, catch, and DevTools"
description: "Read JavaScript error messages like clues, recognize the common error types, handle problems with try, catch, and throw, and debug with the console and breakpoints."
---

# Errors and Debugging

*An error message isn't the computer yelling at you. It's a note left at the scene, telling you where to look.*

By now you've seen plenty of red text in the console. Maybe it felt like failing. Here's the secret every experienced developer knows: **errors are the most helpful thing JavaScript does.** An error tells you something went wrong, what kind of problem it was, and usually exactly which line to look at.

The code that *doesn't* throw errors, but quietly does the wrong thing, is the scary kind. This lesson is about reading errors calmly, handling them on purpose, and hunting down the quiet bugs too.

## Reading an error message

```text
Uncaught TypeError: Cannot read properties of null (reading 'textContent')
    at app.js:14:37
```

Read it like a detective's note, in three parts:

1. **The type:** `TypeError`. What *kind* of problem.
2. **The message:** "Cannot read properties of null (reading 'textContent')". What happened: something was `null`, and the code tried to read `.textContent` from it.
3. **The location:** `app.js:14:37`. File, line 14, character 37. In the browser's developer tools, it's a link: click it and you jump straight to the line.

"Uncaught" just means nothing caught the error, so the script stopped there.

## The usual suspects

A handful of error types cover almost everything you'll meet:

**`ReferenceError`**: you used a name that doesn't exist.

```js
console.log(totl);
// ReferenceError: totl is not defined
```

Usually a typo, a variable used outside its scope ([Scope and Closures](/lessons/javascript/scope-and-closures)), or a `let` used before its line.

**`TypeError`**: a value was the wrong kind for what you did with it.

```js
const cart = null;
cart.push('Rye');
// TypeError: Cannot read properties of null (reading 'push')

const total = 5;
total();
// TypeError: total is not a function
```

The most common one by far. "Cannot read properties of null/undefined" almost always means a `querySelector` found nothing ([Finding Elements](/lessons/javascript/selecting-elements)) or an object property was missing ([Objects](/lessons/javascript/objects)). "is not a function" means you called something that isn't a function, often a typo like `addEventlistener`.

**`SyntaxError`**: the code isn't valid JavaScript, so none of it runs.

```js
const price = 8
console.log('Price:', price;
// SyntaxError: missing ) after argument list
```

A missing bracket, quote, or comma. Because the browser can't even read the file, nothing in it runs, so a single typo can make a whole script look dead.

**`RangeError`**: a number was outside the allowed range, like `new Array(-1)` or, in Chrome and Safari, a function that calls itself forever ("Maximum call stack size exceeded"; Firefox reports that one as an `InternalError` instead).

## Throwing your own errors

You can raise an error yourself when something is genuinely wrong, with `throw`:

```js
function setQuantity(quantity) {
	if (!Number.isInteger(quantity) || quantity < 1) {
		throw new Error(`Quantity must be a whole number of 1 or more, got ${quantity}`);
	}
	return quantity;
}
```

A clear error at the exact moment something goes wrong is far easier to fix than a mysterious `NaN` showing up three functions later. That's why [JSON](/lessons/javascript/json)'s `JSON.parse` throws on bad input instead of quietly returning nonsense.

## Catching errors: `try`, `catch`, `finally`

You met `try` and `catch` in the JSON lesson. Here's the whole picture:

```js
// savedText, applySettings, and defaultSettings stand in for your own code.
try {
	const settings = JSON.parse(savedText);
	applySettings(settings);
} catch (error) {
	console.error('Could not load your settings:', error.message);
	applySettings(defaultSettings);
} finally {
	console.log('Settings step finished.');
}
```

- **`try`**: "attempt this." If anything inside throws, JavaScript jumps immediately to `catch`, skipping the rest of the `try` block.
- **`catch (error)`**: runs only if something threw. `error` is the error object, with a `name` (like `'SyntaxError'`) and a `message`.
- **`finally`**: runs no matter what happened. Optional, and handy for cleanup, like hiding a loading spinner.

### When to catch

Catch errors **at the edges**, where your code meets the outside world and failure is expected sometimes:

- reading data that could be broken (JSON, saved storage),
- talking to a server (the network can fail, see [Loading Data with fetch](/lessons/javascript/fetch)),
- anything a visitor typed.

Don't wrap everything in `try` just to make errors go away. A `catch` block that does nothing, like `catch (error) {}`, hides the bug instead of fixing it, and the page quietly breaks with no clue left behind. If you catch an error, **do** something useful: show a friendly message, use a sensible fallback, or at least log it.

## Debugging the quiet bugs

Some bugs don't throw anything. The total is wrong. A button does nothing. Here's a calm, step-by-step approach.

### 1. Check your assumptions with `console.log`

Most bugs come from a value not being what you think it is. Print it:

```js
console.log('quantity is', quantity, typeof quantity);
```

`typeof` is especially useful: many "the math is wrong" bugs turn out to be a string pretending to be a number, the `'2' + 3 = '23'` trap from [Numbers, Strings, and Booleans](/lessons/javascript/data-types).

Tip: label your logs. A console full of bare numbers is hard to read. `console.log('subtotal', subtotal)` beats `console.log(subtotal)`.

### 2. Pause the code with breakpoints

`console.log` shows you one value at one moment. A **breakpoint** freezes the whole program on a line, so you can look at every variable at once, then step forward one line at a time.

In a real browser, open the developer tools, go to the **Sources** panel (Chrome and Edge) or **Debugger** panel (Firefox), open your file, and click a line number. The next time that line runs, everything pauses. You can also write `debugger;` in your code to pause there whenever the developer tools are open. The [Debugging Basics](/lessons/ide/debugging-basics) lesson walks through these tools, including debugging right inside your code editor.

### 3. Shrink the problem

Comment out half the code. Does the bug remain? Then it's in the other half. Keep halving until only a few lines are left. This works on bugs of any size.

### 4. Explain it out loud

Describe what each line does, out loud, to a friend, a pet, or a rubber duck. Programmers call this **rubber duck debugging**, and it's surprisingly effective: the moment you say "and then this line adds the two numbers," you notice that it doesn't.

## Try it

This playground has three bugs on purpose. The console shows the first one as soon as it runs.

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<p>Loaves: <span id=\'loaf-count\'>0</span></p>\n<button type=\'button\' id=\'add-loaf\'>Add a loaf</button>\n<p id=\'total\'></p>'"
	:initial-js="'// Bug 1: a typo in a selector\nconst count = document.querySelector(\'#loaf-cuont\');\n\nlet loaves = 0;\nconst pricePerLoaf = \'8\';   // Bug 2: a number stored as text\n\ndocument.querySelector(\'#add-loaf\').addEventListener(\'click\', () => {\n\tloaves += 1;\n\tcount.textContent = loaves;\n\tdocument.querySelector(\'#total\').textContent = `Total: $${pricePerLoaf + loaves}`;   // Bug 3: wrong operator\n});\n\ntry {\n\tJSON.parse(\'{ broken json\');\n} catch (error) {\n\tconsole.warn(\'Caught a\', error.name, \'and carried on:\', error.message);\n}\n'"
	show-console
	preview-height="140px"
/>

## Try it yourself

1. Press "Add a loaf" and read the error in the console. Which line does it point to, and what was `null`? Fix bug 1.
2. Press the button a few times. The total is wrong. Add a `console.log('price', pricePerLoaf, typeof pricePerLoaf)` to investigate, then fix bugs 2 and 3 so three loaves cost $24.
3. Write a function `setQuantity(quantity)` that throws an error for anything less than 1, then call it inside a `try` with `0` and log the message in `catch`.

## Check your understanding

<Quiz
	question="What does TypeError: Cannot read properties of null (reading 'addEventListener') most likely mean?"
	:options="['addEventListener is misspelled', 'The element you selected was not found, so the variable is null', 'The event name is wrong', 'The page has no JavaScript']"
	:answer-index="1"
	explanation="Something was null when you tried to use it. With DOM code, that usually means querySelector found no matching element."
/>

<Quiz
	question="A single missing bracket makes none of your script run. Which error type is that?"
	:options="['ReferenceError', 'TypeError', 'SyntaxError', 'RangeError']"
	:answer-index="2"
	explanation="A SyntaxError means the code isn't valid JavaScript, so the browser can't run any of the file."
/>

<Quiz
	question="What is wrong with catch (error) {} with nothing inside?"
	:options="['It is a syntax error', 'It silently hides the problem, leaving no clue to find the bug', 'It crashes the browser', 'Nothing, it is the recommended style']"
	:answer-index="1"
	explanation="An empty catch swallows the error. Always do something useful: show a message, use a fallback, or log it."
/>

## Up next

Your scripts are growing, and one long file gets hard to manage. Next, you'll split code into separate files that share exactly what they need, and nothing else. That's [Modules: import and export](/lessons/javascript/modules).
