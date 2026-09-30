---
title: "JavaScript Modules: import, export, and type=module"
description: "Split JavaScript into modules with export and import, use named and default exports, load them with script type=module, and avoid the file:// and path pitfalls."
---

# Modules: import and export

*A well-run kitchen has stations: pastry, sauces, grill. Each keeps its own tools, and passes over only what's asked for.*

Up to now, every example has lived in one file. That's fine for a few dozen lines. But a real site's JavaScript grows into thousands of lines: form handling, the theme toggle, the cart, the product list. Put all of it in one file, and it becomes a junk drawer, like the CSS one from [Best Practices and Common Mistakes](/lessons/css/best-practices). Worse, every variable is global, so two unrelated pieces of code can accidentally share a name and trample each other, the problem you saw in [Scope and Closures](/lessons/javascript/scope-and-closures).

**Modules** fix both problems. Each file becomes its own private station, and you decide exactly what it shares.

## Kitchen stations

Picture a restaurant kitchen. The pastry station has its own mixers, its own recipes, its own mess. Nobody else touches them. When the dessert is ready, the pastry chef passes **just the finished dessert** through the window to the servers.

A module works the same way:

- Everything inside a module file is **private** by default.
- The module **exports** only what other files should be allowed to use.
- Other files **import** exactly the pieces they need.

## `export`: passing things through the window

```js
// prices.js
const TAX_RATE = 0.12;   // private: not exported

export function withTax(amount) {
	return amount + amount * TAX_RATE;
}

export function formatPrice(amount) {
	return `$${amount.toFixed(2)}`;
}
```

Putting `export` in front of a function, `const`, or class makes it available to other files. `TAX_RATE` has no `export`, so it stays inside this module. No other file can see it or change it.

## `import`: asking for what you need

```js
// app.js
import { withTax, formatPrice } from './prices.js';

console.log(formatPrice(withTax(10)));   // '$11.20'
```

- The names in curly braces must match the exported names exactly. These are called **named** imports.
- The path starts with `./`, meaning "in the same folder as this file," and includes the `.js` extension. In the browser, both are required. `from 'prices'` or `from './prices'` won't work.

You can rename something as you import it, to avoid a clash or to make it clearer:

```js
import { formatPrice as money } from './prices.js';
```

Or import everything a module exports as one object:

```js
import * as prices from './prices.js';
prices.formatPrice(8);
```

## Default exports

A module can also have **one** default export, usually its main thing:

```js
// cart.js
export default function createCart() {
	return [];
}
```

```js
// app.js
import createCart from './cart.js';   // no curly braces, and you choose the name
```

Named exports are generally easier to work with: the names are consistent everywhere, and editors can auto-complete them. Many teams prefer named exports for everything. Either way, recognize both, because you'll see both.

## Loading modules in the page: `type="module"`

The browser only understands `import` and `export` in a script marked as a module:

```html
<script type="module" src="js/app.js"></script>
```

You only link your **main** file. The browser reads its `import` lines and fetches the other files by itself.

Module scripts come with a few built-in behaviors:

- **They're deferred automatically**, just like `defer` from [Adding JavaScript to a Page](/lessons/javascript/adding-javascript). They run after the page is read, so every element exists.
- **Each file has its own scope.** Top-level variables stay inside the module instead of becoming global.
- **They use strict mode**, JavaScript's stricter set of rules. Some sloppy old habits become errors, and `this` in a plain function call is `undefined`, as you saw in [this and Classes](/lessons/javascript/this-and-classes).
- **Each module runs only once**, even if ten files import it.

## The pitfall that stops everyone: `file://`

Try this at home, and you'll hit it: you build a page with modules, double-click `index.html` to open it, and nothing works. The console says something about being "blocked by CORS policy."

For security, browsers refuse to load modules from files opened straight off your disk (addresses starting with `file://`). Modules need a real web address, even a local one. The fix is a small **local development server**, a program that serves your folder at an address like `http://localhost:5173`:

- In VS Code, the popular **Live Server** extension adds a "Go Live" button (see [Extensions & Customization](/lessons/ide/extensions-and-customization)).
- Or, if you have Node.js installed (it provides the `npx` command, and has its own [track](/lessons/nodejs/introduction)), running `npx vite` in a terminal in your project folder starts one instantly. [Vite](/lessons/vite/introduction) has its own track in this book.

Once your page loads from `http://localhost...`, modules just work.

## What about npm packages?

Professional projects often import code other people have written, installed with a tool called npm:

```js
import confetti from 'canvas-confetti';
```

That bare name (no `./`) doesn't work in the browser on its own. It needs a **build tool**, like Vite, which finds the package and bundles everything together for the browser. You'll get there in the tooling tracks. For now, `./your-own-file.js` imports are all you need.

## Try it

This book's editors don't have separate files, so the first part of this demo turns a string of code into a pretend file (a "Blob URL"). You don't need to understand that part. Focus on the `export` lines inside the string, and on what gets imported. The HTML pane also has a real `<script type="module">`, so you can see when it runs.

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<p id=\'receipt\'>Waiting for the module...</p>\n\n<script type=\'module\'>\n\tconst moduleSecret = \'only visible inside this module\';\n\tconsole.log(\'The module script ran last: modules are deferred.\');\n<\/script>'"
	:initial-js="'// Preview-only setup: turn a string of code into a pretend file called prices.js.\nconst pricesFile = `\nconst TAX_RATE = 0.12;\n\nexport function withTax(amount) {\n\treturn amount + amount * TAX_RATE;\n}\n\nexport function formatPrice(amount) {\n\treturn \'$\' + amount.toFixed(2);\n}\n`;\nconst pricesUrl = URL.createObjectURL(new Blob([pricesFile], { type: \'text/javascript\' }));\n\n// import() is the version of import that works outside a module file.\nimport(pricesUrl).then(({ withTax, formatPrice }) => {\n\tconst total = formatPrice(withTax(10));\n\tconsole.log(\'Imported and used:\', total);\n\tdocument.querySelector(\'#receipt\').textContent = `Total with tax: ${total}`;\n});\n\nconsole.log(\'Can this script see moduleSecret?\', typeof moduleSecret !== \'undefined\');\n'"
	show-console
	preview-height="80px"
/>

(The `.then(...)` part waits for the file to load before using it. You'll learn exactly how that works in [Promises and async/await](/lessons/javascript/promises-and-async-await).)

## Try it yourself

1. Look at the order of the console lines. Which ran first: the JavaScript pane or the module script? Why?
2. Inside the `pricesFile` string, add `export` in front of `const TAX_RATE`, then log it from the imported object by adding `TAX_RATE` to the curly braces.
3. On your own computer, make a folder with `index.html`, `app.js`, and `prices.js`, using real `import` and `export` lines. Open `index.html` by double-clicking it and read the console. Then serve the folder with Live Server or `npx vite` and try again.

## Check your understanding

<Quiz
	question="A module declares const TAX_RATE = 0.12; without export. Can another file import it?"
	:options="['Yes, everything in a module is shared', 'No, only exported things can be imported', 'Only with import *', 'Only if it is a let']"
	:answer-index="1"
	explanation="Everything in a module is private by default. Only what's exported can be imported by other files."
/>

<Quiz
	question="Which import line works in the browser for a file named prices.js in the same folder?"
	:options="['import { formatPrice } from \'prices\';', 'import { formatPrice } from \'./prices\';', 'import { formatPrice } from \'./prices.js\';', 'import formatPrice from prices.js;']"
	:answer-index="2"
	explanation="Browsers need a relative path that starts with ./ and includes the .js extension."
/>

<Quiz
	question="Your module-based page works on a local server but not when you double-click index.html. Why?"
	:options="['Modules only work on phones', 'Browsers block loading modules from file:// addresses for security', 'The file is too large', 'type=module is misspelled']"
	:answer-index="1"
	explanation="Modules must be loaded from a real web address. A local development server like Live Server or Vite solves it."
/>

## Up next

That completes Going Deeper. You've already bumped into code that waits: a timer, a dialog closing, a module loading, `.then(...)`. The next chapter is all about that waiting, starting with [Timers and the Event Loop](/lessons/javascript/timers-and-the-event-loop).
