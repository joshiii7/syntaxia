---
title: "JSON in JavaScript: JSON.stringify and JSON.parse Explained"
description: "Learn what JSON is, its strict rules, how it differs from a JavaScript object, and how to convert with JSON.stringify and JSON.parse, including handling bad JSON."
---

# JSON

*JSON is a packing list written in a language every computer can read. Objects get packed into text, shipped, and unpacked on arrival.*

Back in [Meta Tags and SEO](/lessons/html/meta-and-head-tags), you wrote a block of structured data full of curly braces and quoted keys, and were told: "That's JSON, a data format you'll get comfortable with in the JavaScript track." Now you're ready.

JSON matters because objects and arrays only exist *inside* a running program. The moment you need to send data somewhere else, to a server, to another app, or into the browser's storage to remember for next time, you need to turn it into plain text. JSON is the format almost everyone agreed to use for that.

## Shipping furniture

Picture shipping a bookcase across the country. You can't mail it assembled. You take it apart, pack the pieces flat in a box, and include a list: "4 shelves, 2 sides, 12 screws." At the other end, someone reads the list and puts it back together.

Converting an object into JSON text is the flat-packing. Converting JSON text back into an object is the reassembly.

## What JSON looks like

**JSON** stands for **JavaScript Object Notation**, and it looks almost exactly like the objects and arrays you already know:

```json
{
	"name": "Sourdough",
	"price": 8,
	"inStock": true,
	"tags": ["vegan", "weekend"],
	"bakedBy": null
}
```

But JSON is a **text format**, not JavaScript code, and it has stricter rules:

- **Keys must be in double quotes.** `"name"`, not `name` or `'name'`.
- **Strings must use double quotes.** Single quotes and backticks aren't allowed.
- **Only data**: strings, numbers, `true`, `false`, `null`, arrays, and objects. No functions, no `undefined`, no dates (dates are stored as strings).
- **No trailing commas** after the last item.
- **No comments.**

That strictness is the point. Any program in any language can read JSON, because there's exactly one way to write it.

## Object to text: `JSON.stringify`

```js
const bread = { name: 'Sourdough', price: 8, tags: ['vegan'] };

const text = JSON.stringify(bread);
console.log(text);          // '{"name":"Sourdough","price":8,"tags":["vegan"]}'
console.log(typeof text);   // 'string'
```

That's the flat-pack: a single string, ready to send or save. For something humans can read, pass two extra arguments. The third one is how many spaces to indent:

```js
console.log(JSON.stringify(bread, null, 2));
```

Anything JSON can't represent quietly disappears or changes:

```js
const order = {
	id: 7,
	note: undefined,
	placedAt: new Date('2026-09-28T09:30:00Z'),
	total() { return 12; },
};

console.log(JSON.stringify(order));
// '{"id":7,"placedAt":"2026-09-28T09:30:00.000Z"}'
```

The `undefined` property and the method vanished, and the date became a string. If data "goes missing" after being saved, this is often why.

## Text to object: `JSON.parse`

```js
const received = '{"name":"Rye","price":7,"inStock":false}';

const bread = JSON.parse(received);
console.log(bread.name);    // 'Rye'
console.log(bread.price);   // 7
```

`JSON.parse` reads the packing list and rebuilds a real object you can use with dots and brackets again.

## When the packing list is wrong

`JSON.parse` is completely unforgiving. One missing quote and it refuses the whole thing, by **throwing an error**:

```js
JSON.parse("{ name: 'Rye' }");
// SyntaxError: Expected property name or '}' in JSON...
// (the exact wording varies from browser to browser)
```

(Unquoted keys and single quotes are fine in JavaScript, but not in JSON.)

An error like that stops your script. When the JSON comes from somewhere you don't control, like a server, a file, or saved storage that a visitor could have edited, wrap the parse in `try` and `catch`:

```js
function safeParse(text, fallback) {
	try {
		return JSON.parse(text);
	} catch (error) {
		console.warn('Could not read the saved data:', error.message);
		return fallback;
	}
}

const settings = safeParse('not json at all', { theme: 'light' });
console.log(settings.theme);   // 'light'
```

`try` says "attempt this." If anything inside throws an error, JavaScript jumps straight to `catch` instead of stopping the whole script. You'll learn this properly in [Errors and Debugging](/lessons/javascript/errors-and-debugging).

## A quick way to deep-copy

In [Destructuring and Spread](/lessons/javascript/destructuring-and-spread) you learned that spread only copies the top layer. You'll sometimes see this older trick for a full copy:

```js
const copy = JSON.parse(JSON.stringify(order));
```

It works for plain data, but it loses dates, `undefined`, and methods, as you just saw. The modern built-in `structuredClone(order)` does it properly. Prefer that.

## Where you'll meet JSON

- **Loading data from servers.** When you use `fetch` in [Loading Data with fetch](/lessons/javascript/fetch), the response is almost always JSON.
- **Saving in the browser.** `localStorage` can only store strings, so objects go in as JSON. That's in [Saving Data with localStorage](/lessons/javascript/local-storage).
- **Config files.** Many tools, including the `package.json` file at the heart of almost every JavaScript project, use JSON.

## Try it

<WebPlayground
	:panes="['javascript']"
	initial-html=""
	:initial-js="'const bread = { name: \'Sourdough\', price: 8, tags: [\'vegan\', \'weekend\'] };\n\nconst packed = JSON.stringify(bread);\nconsole.log(\'Packed:\', packed);\nconsole.log(\'Type:\', typeof packed);\n\nconst unpacked = JSON.parse(packed);\nconsole.log(\'Unpacked name:\', unpacked.name);\n\nconst order = { id: 7, note: undefined, total() { return 12; } };\nconsole.log(\'Lost in packing:\', JSON.stringify(order));\n\nfunction safeParse(text, fallback) {\n\ttry {\n\t\treturn JSON.parse(text);\n\t} catch (error) {\n\t\tconsole.warn(\'Could not read the saved data:\', error.message);\n\t\treturn fallback;\n\t}\n}\n\nconst settings = safeParse(\'{ theme: dark }\', { theme: \'light\' });\nconsole.log(\'Theme:\', settings.theme);\n'"
	show-console
	hide-preview
/>

## Try it yourself

1. Log `JSON.stringify(bread, null, 2)` and compare it with the one-line version.
2. Fix the broken text passed to `safeParse` so it's valid JSON, and check that the theme becomes `dark`. (Remember: double quotes around the key and the value.)
3. Add a `bakedAt: new Date()` property to `bread`, pack and unpack it, and log `typeof unpacked.bakedAt`. Is it still a date?

## Check your understanding

<Quiz
	question="Which of these is valid JSON?"
	:options="['{ name: \'Rye\' }', '{ \'name\': \'Rye\' }', '{ &quot;name&quot;: &quot;Rye&quot; }', '{ &quot;name&quot;: &quot;Rye&quot;, }']"
	:answer-index="2"
	explanation="JSON requires double quotes around keys and strings, and doesn't allow a trailing comma."
/>

<Quiz
	question="What does JSON.stringify return?"
	:options="['An object', 'A string', 'An array', 'A number']"
	:answer-index="1"
	explanation="stringify packs the data into a single string of text, ready to send or save."
/>

<Quiz
	question="Why wrap JSON.parse in try and catch when reading data from a server?"
	:options="['It makes parsing faster', 'Invalid JSON throws an error that would otherwise stop your script', 'JSON.parse only works inside try', 'It converts single quotes automatically']"
	:answer-index="1"
	explanation="JSON.parse throws on any invalid text. Catching the error lets you fall back gracefully instead of crashing."
/>

## Up next

That wraps up Working with Data. You can now store, shape, and pack information. Time to connect all of it to the page itself. The DOM chapter starts with [Finding Elements](/lessons/javascript/selecting-elements).
