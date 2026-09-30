---
title: "How to Add JavaScript to a Web Page: script, src, and defer"
description: "Connect JavaScript to your HTML with the script element, learn why script placement and defer matter, use the console, and write clean statements and comments."
---

# Adding JavaScript to a Page

*A script is a set of instructions for the electrician. Where you leave the note decides when they read it.*

In the last lesson, you typed JavaScript into an editor and it just ran. On a real website, there's no editor pane. The code has to live somewhere, and the browser has to find it, read it, and run it at the right moment.

That "right moment" part turns out to matter a lot. Let's see why.

## The `<script>` element

JavaScript gets into a page through the `<script>` element. You met it briefly in [Where HTML Meets CSS and JS](/lessons/html/html-meets-css-and-js). There are two ways to use it.

**Inline**, with the code written between the tags:

```html
<script>
	console.log('Hello from inside the page!');
</script>
```

**External**, pointing to a separate `.js` file with `src`:

```html
<script src="js/app.js" defer></script>
```

Just like CSS, the external file is the professional standard, for the same reasons you learned in [Three Ways to Add CSS](/lessons/css/applying-css): one file can serve every page, the browser caches it, and your HTML stays clean. Note that a `<script>` with a `src` must still have a closing `</script>` tag, even though there's nothing between them.

## The browser reads from top to bottom

Here's the key idea. The browser reads your HTML like a person reading a letter: top to bottom, one line at a time. When it reaches a plain `<script>`, it **stops**, runs the script, and only then carries on reading.

Picture a building crew following a plan from top to bottom. Halfway through, there's a note: "Electrician: wire the light switch in the kitchen." But the kitchen hasn't been built yet. It's further down the plan. The electrician looks around, finds no kitchen, and gives up.

That's exactly what happens here:

```html
<head>
	<script>
		// The browser runs this before it has read the body.
		const heading = document.querySelector('h1');
		console.log(heading);   // null: the h1 doesn't exist yet
	</script>
</head>
<body>
	<h1>Maria's Bakery</h1>
</body>
```

`null` is JavaScript's way of saying "I looked, and there's nothing there." Trying to use that `null` as if it were an element is one of the most common errors beginners hit, and now you know one of its causes.

## The fix: `defer`

```html
<head>
	<script src="js/app.js" defer></script>
</head>
```

`defer` tells the browser: "Download this script in the background while you keep building the page, and run it once the whole page has been read." The electrician waits until every room exists. This is the approach you learned in the HTML track, and it's the one to use for almost every script you write.

You'll also see scripts placed at the very **end** of the `<body>`, just before `</body>`. That works too, because by then every element above it exists. It's the older way of solving the same problem. `defer` in the `<head>` is the modern favorite, because the browser can start downloading the script sooner.

(There's also `type="module"`, which behaves like `defer` automatically. You'll meet it in [Modules](/lessons/javascript/modules).)

## The console: your message board

You'll use `console.log()` constantly, to check what your code is doing:

```js
console.log('The page loaded');
console.log(42);
console.log('Price:', 8, 'dollars');
```

You can pass it several things separated by commas, and it prints them with spaces between. There are a few relatives too:

- `console.warn('...')` prints a warning.
- `console.error('...')` prints an error message.

In a real browser, open the console with **F12** (or right-click, **Inspect**, then the **Console** tab). The [Debugging Basics](/lessons/ide/debugging-basics) lesson walks through the developer tools. In this book's editors, it's the **Console** panel under the preview.

A quick warning: many old tutorials use `alert('Hello')` to show messages in a pop-up box. It works on a real page, but it freezes everything until someone clicks OK, it's annoying for visitors, and the editors in this book block it entirely (their preview is a locked-down sandbox, like the one you learned about in [iframes and Embedding](/lessons/html/iframes-and-embedding)). Use the console.

## Statements, semicolons, and comments

A JavaScript program is a list of **statements**, instructions the browser runs in order, top to bottom:

```js
console.log('First');
console.log('Second');
console.log('Third');
```

Each statement usually ends with a semicolon. JavaScript can often guess where a missing semicolon should go, but the guessing has a few surprising edge cases. This book always writes them, and you should too. It's the same idea as closing every HTML tag: the browser forgiving you isn't the same as writing it right.

**Comments** are notes for humans that JavaScript ignores:

```js
// A single-line comment starts with two slashes.

/*
	A multi-line comment goes between these markers,
	just like in CSS.
*/
```

And one more thing that trips up everyone at first: JavaScript is **case-sensitive**. `console.log` works. `Console.log` and `console.Log` don't. `myName` and `myname` are two completely different things.

## Try it

This preview's HTML pane contains a `<script>` placed *above* the heading, so it runs too early. The JavaScript pane runs after all the HTML, like a deferred script. Compare what each one finds in the console.

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<script>\n\t// This script sits above the heading, so it runs too early.\n\tconsole.log(\'Too early:\', document.querySelector(\'#greeting\'));\n<\/script>\n\n<h1 id=\'greeting\'>Maria\'s Bakery</h1>'"
	:initial-js="'// This pane runs after all of the HTML, like a deferred script.\nconsole.log(\'Just right:\', document.querySelector(\'#greeting\'));\n\nconsole.log(\'Price:\', 8, \'dollars\');\nconsole.warn(\'Only 3 loaves left!\');\n'"
	show-console
	preview-height="120px"
/>

## Try it yourself

1. Look at the two console lines about `#greeting`. Why is the first one `null`?
2. In the HTML pane, move the whole `<script>` block below the `<h1>`. Run it again. What does it find now?
3. Change `console.log` to `Console.log` in the JavaScript pane. Read the error, then fix it.

## Check your understanding

<Quiz
	question="A script in the head tries to find an h1 and gets null. What is the most likely reason?"
	:options="['The h1 has no text', 'The script ran before the browser had read the h1', 'JavaScript cannot find headings', 'The page has no CSS']"
	:answer-index="1"
	explanation="The browser reads top to bottom. A plain script in the head runs before the body exists, so the element isn't there yet."
/>

<Quiz
	question="What does the defer attribute do?"
	:options="['Runs the script twice', 'Downloads the script in the background and runs it after the page has been read', 'Delays the script by ten seconds', 'Stops the script from running']"
	:answer-index="1"
	explanation="defer lets the page keep building while the script downloads, then runs it once every element exists."
/>

<Quiz
	question="Which line correctly writes a message to the console?"
	:options="['Console.log(\'Hi\');', 'console.Log(\'Hi\');', 'console.log(\'Hi\');', 'log.console(\'Hi\');']"
	:answer-index="2"
	explanation="JavaScript is case-sensitive, so console.log must be written exactly like that."
/>

## Up next

You can run code and see its results. Now let's give your code a memory. In [Variables: let and const](/lessons/javascript/variables), you'll learn to store values and give them names.
