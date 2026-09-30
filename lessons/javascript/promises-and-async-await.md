---
title: "JavaScript Promises and async/await for Beginners"
description: "Understand promises, handle results with then and catch, write clean asynchronous code with async and await, catch errors, and run tasks in parallel with Promise.all."
---

# Promises and async/await

*Order at a busy café and they hand you a buzzer. You don't stand at the counter waiting. You sit down, and the buzzer tells you when it's ready, or that they've run out.*

In [Timers and the Event Loop](/lessons/javascript/timers-and-the-event-loop), you learned that JavaScript never stands around waiting for slow things. It hands over a callback and gets on with other work. That works fine for one step. But real tasks come in chains: load the menu, *then* load the prices, *then* show them, and if anything fails, show an error.

With callbacks alone, each step nests inside the previous one, and the code drifts further and further right until it's unreadable. Developers nicknamed that shape the "pyramid of doom." **Promises** were created to fix it, and **async/await** made them read almost like normal code.

## The café buzzer

Picture ordering at a café that hands you a buzzer. That buzzer is a **promise**: an object that represents a result you'll get **later**. It's always in one of three states:

- **Pending**: still waiting. Your coffee is being made.
- **Fulfilled**: it worked, and here's the value. The buzzer lights up: coffee's ready.
- **Rejected**: it failed, and here's the reason. The buzzer flashes red: they're out of oat milk.

Once a promise is fulfilled or rejected, it's **settled**, and it never changes again.

## Using a promise: `then`, `catch`, `finally`

Many built-in tools give you a promise. You'll meet the most important one, `fetch`, in the [next lesson](/lessons/javascript/fetch). For now, here's a small helper that makes a promise which fulfills after a delay:

```js
function wait(milliseconds) {
	return new Promise((resolve) => {
		setTimeout(resolve, milliseconds);
	});
}
```

(`new Promise` gives you a `resolve` function to call when the work succeeds, and a `reject` function, not used here, for when it fails. You'll mostly *use* promises rather than create them, so don't worry if this part feels unfamiliar.)

You react to a promise with methods:

```js
wait(1000)
	.then(() => {
		console.log('One second later!');
	})
	.catch((error) => {
		console.error('Something went wrong:', error);
	})
	.finally(() => {
		console.log('Done either way.');
	});
```

- `.then(callback)` runs when the promise **fulfills**, and receives its value.
- `.catch(callback)` runs when it **rejects**, and receives the reason (usually an error).
- `.finally(callback)` runs either way, like the `finally` from [Errors and Debugging](/lessons/javascript/errors-and-debugging).

And `.then` returns a new promise, so steps can be chained flat, one after another, instead of nested.

## `async` and `await`: the readable way

Chains of `.then` are much better than nested callbacks, but there's an even cleaner way to write the same thing:

```js
async function bakeBread() {
	console.log('Mixing...');
	await wait(1000);
	console.log('Rising...');
	await wait(1000);
	console.log('Baked!');
}

bakeBread();
```

It reads top to bottom, like the plain code you've written all along. Two new keywords make it work:

- **`async`** in front of a function marks it as asynchronous. That lets you use `await` inside it.
- **`await`** in front of a promise means "pause **this function** here until the promise settles, then carry on with its value."

The key phrase is "pause this function." `await` doesn't freeze the page. Back in the kitchen from the last lesson, the cook sets this recipe aside, handles other tickets (clicks, timers, redrawing the screen), and comes back to it when the promise settles. You get code that *looks* like it waits, without anything actually blocking.

`await` also unwraps the value for you:

```js
async function showMenu() {
	const menu = await loadMenu();   // loadMenu returns a promise of an array
	console.log(menu.length);        // menu is the array itself, not a promise
}
```

(`loadMenu`, and `makeCoffee`, `loadBreads`, and `loadPastries` further down, stand for any function that returns a promise. In the next lesson, that'll be `fetch`.)

## Errors with `try` and `catch`

When an awaited promise **rejects**, `await` turns that into a thrown error. So you handle it with the same `try` and `catch` you already know:

```js
async function orderCoffee() {
	try {
		const coffee = await makeCoffee('oat milk');
		console.log('Enjoy your', coffee);
	} catch (error) {
		console.log('Sorry:', error.message);
	}
}
```

One tool, `try` and `catch`, now handles both ordinary errors and failed waiting. That's a big part of why async/await is so popular.

## The two classic mistakes

**Mistake 1: forgetting `await`.**

```js
async function showMenu() {
	const menu = loadMenu();   // no await!
	console.log(menu);         // Promise {...}, not the menu
}
```

Without `await`, you get the buzzer, not the coffee. When you see `Promise {...}` or `[object Promise]` where you expected real data, a missing `await` is almost always the reason.

**Mistake 2: using `await` outside an `async` function.**

```js
function showMenu() {
	const menu = await loadMenu();
	// SyntaxError: await is only valid in async functions...
}
```

Add `async` to the function. (Inside a module from [Modules](/lessons/javascript/modules), `await` also works at the very top level of the file, outside any function.)

And remember: an `async` function **always returns a promise**, even if you `return` a plain value. Whoever calls it needs to `await` it (or use `.then`) to get the value out.

## Waiting for several things at once: `Promise.all`

Each `await` waits for the previous one to finish. That's right when step two needs step one's result. But when tasks don't depend on each other, waiting one at a time wastes time:

```js
async function loadEverything() {
	// One after another: about 2 seconds in total
	const breads = await loadBreads();     // 1 second
	const pastries = await loadPastries(); // 1 more second
}
```

`Promise.all` starts them all together and waits for every one to finish:

```js
async function loadEverything() {
	// Side by side: about 1 second in total
	const [breads, pastries] = await Promise.all([loadBreads(), loadPastries()]);
}
```

It takes an array of promises and gives back one promise of an array of results, in the same order. (That `[breads, pastries]` is array destructuring from [Destructuring and Spread](/lessons/javascript/destructuring-and-spread).) If any one of them rejects, the whole thing rejects, so wrap it in `try` and `catch` like any other `await`.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'bake\'>Bake bread</button>\n<button type=\'button\' id=\'order\'>Order an oat milk latte</button>\n<p id=\'status\' aria-live=\'polite\'>Ready.</p>'"
	:initial-js="'function wait(milliseconds) {\n\treturn new Promise((resolve) => {\n\t\tsetTimeout(resolve, milliseconds);\n\t});\n}\n\nfunction makeCoffee(milk) {\n\treturn new Promise((resolve, reject) => {\n\t\tsetTimeout(() => {\n\t\t\tif (milk === \'oat milk\') {\n\t\t\t\treject(new Error(\'We are out of oat milk today.\'));\n\t\t\t} else {\n\t\t\t\tresolve(`a latte with ${milk}`);\n\t\t\t}\n\t\t}, 800);\n\t});\n}\n\nconst status = document.querySelector(\'#status\');\n\nasync function bakeBread() {\n\tstatus.textContent = \'Mixing...\';\n\tawait wait(1000);\n\tstatus.textContent = \'Rising...\';\n\tawait wait(1000);\n\tstatus.textContent = \'Baked! Fresh bread is ready.\';\n}\n\nasync function orderCoffee() {\n\tstatus.textContent = \'Making your coffee...\';\n\ttry {\n\t\tconst coffee = await makeCoffee(\'oat milk\');\n\t\tstatus.textContent = `Here is ${coffee}.`;\n\t} catch (error) {\n\t\tstatus.textContent = `Sorry: ${error.message}`;\n\t}\n}\n\ndocument.querySelector(\'#bake\').addEventListener(\'click\', bakeBread);\ndocument.querySelector(\'#order\').addEventListener(\'click\', orderCoffee);\n\n// Forgetting await gives you the buzzer, not the coffee:\nconsole.log(\'Without await:\', makeCoffee(\'whole milk\'));\n\n// Two waits side by side with Promise.all\nPromise.all([wait(500), wait(500)]).then(() => {\n\tconsole.log(\'Both finished together, after about half a second.\');\n});\n'"
	show-console
	preview-height="120px"
/>

## Try it yourself

1. Press "Bake bread" and watch the status change. Then press "Order an oat milk latte" and read the friendly error.
2. Change `'oat milk'` in `orderCoffee` to `'whole milk'` so the order succeeds.
3. Add `await` in front of the `makeCoffee('whole milk')` in the console line. What error do you get, and why? (Hint: the line isn't inside an `async` function.)

## Check your understanding

<Quiz
	question="A promise can be in which three states?"
	:options="['Start, middle, end', 'Pending, fulfilled, rejected', 'Waiting, loading, done', 'True, false, null']"
	:answer-index="1"
	explanation="A promise starts pending, then settles as either fulfilled with a value or rejected with a reason."
/>

<Quiz
	question="You log a value and see Promise {...} instead of your data. What is the most likely cause?"
	:options="['The server is down', 'You forgot to await the promise', 'console.log is broken', 'The data is empty']"
	:answer-index="1"
	explanation="Without await (or then), you have the promise itself, not the value it will eventually hold."
/>

<Quiz
	question="Does await freeze the whole page while it waits?"
	:options="['Yes, nothing else can happen', 'No, it pauses only that async function while the page keeps working', 'Only for clicks', 'Only in modules']"
	:answer-index="1"
	explanation="await sets the function aside until the promise settles. Clicks, timers, and screen updates carry on in the meantime."
/>

## Up next

You've been practicing with pretend coffee. Now for the real thing: asking a server for data and showing it on your page, with proper loading and error states. That's [Loading Data with fetch](/lessons/javascript/fetch).
