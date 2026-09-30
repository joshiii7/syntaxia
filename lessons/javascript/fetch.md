---
title: "JavaScript fetch API: Load and Send JSON Data (Beginner Guide)"
description: "Load data from a server with fetch and async/await, check response.ok, parse JSON, show loading and error states, send data with POST, and understand CORS."
---

# Loading Data with fetch

*Your page sends a waiter to the kitchen with an order. The waiter comes back with a tray, or with an apology. fetch is the waiter.*

At the end of the CSS track, you were promised that your page would learn to "load new content without refreshing the page." Every piece is now in place: you can wait for things with [Promises and async/await](/lessons/javascript/promises-and-async-await), unpack data with [JSON](/lessons/javascript/json), and build elements from it with [Creating and Removing Elements](/lessons/javascript/creating-elements).

The missing piece is how to actually ask a server for data. That's `fetch`.

## The waiter

Picture a restaurant. Your table is the web page. The kitchen is a **server** somewhere on the internet, holding data: today's menu, the latest reviews, a visitor's order history. You can't walk into the kitchen yourself. You send a waiter with a request, and the waiter comes back with a response.

`fetch` sends the waiter. You give it an address, called a **URL** (sometimes called an **endpoint**, the specific door in the kitchen that serves one kind of data), and it returns a promise of the response.

## A first request

```js
async function loadMenu() {
	const response = await fetch('https://api.example.com/menu');
	const menu = await response.json();
	console.log(menu);
}
```

Two `await`s, and it's worth knowing why:

1. `await fetch(...)` waits for the **response to start arriving**: the waiter is back, with a status and some headers. The actual food might still be coming out of the kitchen.
2. `await response.json()` waits for the **whole body** to arrive, then parses it from JSON text into a real object or array.

Forgetting the second `await` is a common slip. You'd get `Promise {...}` instead of your menu, the "buzzer, not the coffee" mistake from the last lesson.

## Checking that it actually worked

Here's the biggest `fetch` surprise of all: **`fetch` does not treat a 404 or a 500 as a failure.**

As far as `fetch` is concerned, if the waiter came back at all, the trip succeeded, even if they came back saying "we don't serve that" (404, not found) or "the kitchen's on fire" (500, server error). Its promise only rejects when the waiter never makes it back: no internet connection, the server can't be reached, or the browser blocks the request.

So you check the response yourself:

```js
async function loadMenu() {
	const response = await fetch('https://api.example.com/menu');

	if (!response.ok) {
		throw new Error(`The server replied with ${response.status}`);
	}

	return response.json();
}
```

- `response.ok` is `true` for successful statuses (200 to 299) and `false` otherwise.
- `response.status` is the number: `200` OK, `404` not found, `500` server error, and so on.

Throwing an error here means **both** kinds of failure, network trouble and bad statuses, end up in the same `catch`.

## Loading, success, and error states

Loading takes time, anywhere from a blink to several seconds on a slow phone connection. And sometimes it fails. A professional page plans for all three moments:

```js
const status = document.querySelector('#status');
const list = document.querySelector('#menu');

async function showMenu() {
	status.textContent = 'Loading the menu...';

	try {
		const response = await fetch(MENU_URL);
		if (!response.ok) {
			throw new Error(`The server replied with ${response.status}`);
		}
		const menu = await response.json();

		list.replaceChildren();
		for (const item of menu) {
			const li = document.createElement('li');
			li.textContent = `${item.name}: $${item.price}`;
			list.append(li);
		}
		status.textContent = menu.length ? '' : 'Nothing on the menu today.';
	} catch (error) {
		status.textContent = 'Sorry, the menu could not be loaded. Please try again.';
		console.error(error);
	}
}
```

1. **Loading:** tell people something is happening, so they don't think the page is broken.
2. **Success:** show the data. And handle the empty case, an empty list shouldn't look like a bug.
3. **Error:** a friendly message, in plain language, with a way forward. Log the technical details for yourself.

Put the status in an element with `aria-live="polite"` or `role="status"`, as in [Accessibility Basics](/lessons/html/accessibility-basics), so screen reader users hear "Loading" and "Sorry" too.

Notice the item names go in with `textContent`. Data from a server is outside data, so the XSS warning from [Changing Text, Attributes, and Classes](/lessons/javascript/changing-elements) applies in full.

## Sending data: `POST`

`fetch` can send data too. Pass a second argument with the details:

```js
async function placeOrder() {
	const response = await fetch('https://api.example.com/orders', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ bread: 'Sourdough', quantity: 2 }),
	});
	return response.ok;
}
```

- `method: 'POST'` means "I'm sending something," like the `method="post"` you wrote in [Forms: The Basics](/lessons/html/forms-part-1). Plain `fetch(url)` is a `GET`: "please give me something."
- `headers` describe the request. `Content-Type: application/json` says "the body is JSON."
- `body` is the data itself, packed into text with `JSON.stringify`.

Put this together with the form handling from [Forms and Custom Validation](/lessons/javascript/forms-with-javascript), and you can send a contact form without the page ever reloading.

## "Why won't this server answer me?": CORS

At some point you'll try to `fetch` from someone else's server and get a red error mentioning **CORS**. It's the same idea as the sites that refuse to be framed in [iframes and Embedding](/lessons/html/iframes-and-embedding): by default, browsers don't let one website read data from another website's server, unless that server explicitly says "other sites are welcome."

That permission is the server's decision, sent in its response headers. You can't fix it from your page's JavaScript. Use an API that allows access from browsers (public APIs usually say so in their documentation), or have your own server fetch the data for you.

## Never put secrets in front-end code

Many APIs need a key. It's tempting to paste it straight into your JavaScript. Don't. Every visitor can read your JavaScript in the developer tools, including your key. Keys that must stay secret belong on a server, which you'll build in the backend tracks.

## Try it

This preview can't reach a real server of ours, so the menu is served from a pretend address built right into the code (a `data:` URL, which holds its contents inside the address itself). The second button asks a server that doesn't exist, so you can see the error state.

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'load\'>Load today\'s menu</button>\n<button type=\'button\' id=\'load-broken\'>Load from a server that does not exist</button>\n<p id=\'status\' role=\'status\'></p>\n<ul id=\'menu\'></ul>'"
	:initial-js="'// A pretend server response. On a real site, this would be an address like https://api.example.com/menu\nconst todaysMenu = [\n\t{ name: \'Sourdough\', price: 8 },\n\t{ name: \'Rye\', price: 7 },\n\t{ name: \'Focaccia\', price: 6 },\n];\nconst MENU_URL = \'data:application/json,\' + encodeURIComponent(JSON.stringify(todaysMenu));\nconst BROKEN_URL = \'https://menu.example.invalid/today\';\n\nconst status = document.querySelector(\'#status\');\nconst list = document.querySelector(\'#menu\');\n\nasync function showMenu(url) {\n\tstatus.textContent = \'Loading the menu...\';\n\tlist.replaceChildren();\n\n\ttry {\n\t\tconst response = await fetch(url);\n\t\tif (!response.ok) {\n\t\t\tthrow new Error(`The server replied with ${response.status}`);\n\t\t}\n\t\tconst menu = await response.json();\n\n\t\tfor (const item of menu) {\n\t\t\tconst li = document.createElement(\'li\');\n\t\t\tli.textContent = `${item.name}: $${item.price}`;\n\t\t\tlist.append(li);\n\t\t}\n\t\tstatus.textContent = menu.length ? `${menu.length} items today.` : \'Nothing on the menu today.\';\n\t\tconsole.log(\'Loaded:\', menu);\n\t} catch (error) {\n\t\tstatus.textContent = \'Sorry, the menu could not be loaded. Please try again.\';\n\t\tconsole.error(\'Load failed:\', error.message);\n\t}\n}\n\ndocument.querySelector(\'#load\').addEventListener(\'click\', () => showMenu(MENU_URL));\ndocument.querySelector(\'#load-broken\').addEventListener(\'click\', () => showMenu(BROKEN_URL));\n'"
	show-console
	preview-height="200px"
/>

## Try it yourself

1. Press both buttons and compare the status messages and the console.
2. Change `todaysMenu` to an empty array `[]` and load it. Does the empty state make sense?
3. Add a `price` filter so only items under $8 are shown, using `filter` from [Array Methods](/lessons/javascript/array-methods) before the loop.

## Check your understanding

<Quiz
	question="The server replies with a 404 status. What does the fetch promise do?"
	:options="['It rejects, so catch runs automatically', 'It fulfills normally, so you must check response.ok yourself', 'It retries three times', 'It returns null']"
	:answer-index="1"
	explanation="fetch only rejects for network failures. A 404 or 500 is still a response, so check response.ok and throw if it's false."
/>

<Quiz
	question="Why does loading JSON with fetch usually need two awaits?"
	:options="['fetch is slow and needs to be called twice', 'One waits for the response to arrive, and one waits for the body to be read and parsed', 'The second await is optional decoration', 'JSON needs to be awaited twice for safety']"
	:answer-index="1"
	explanation="await fetch() gives you the response once it starts arriving. await response.json() waits for the full body and parses it."
/>

<Quiz
	question="Where should a secret API key go?"
	:options="['In a const at the top of your JavaScript', 'In an HTML comment', 'On a server, never in front-end code', 'In a data-* attribute']"
	:answer-index="2"
	explanation="Anyone can read front-end code, including comments and data attributes. Secrets must stay on a server."
/>

## Up next

Your page can now load fresh data. Next, it'll learn to remember things between visits, like a visitor's dark mode choice, in [Saving Data with localStorage](/lessons/javascript/local-storage).
