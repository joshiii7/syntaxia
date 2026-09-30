---
title: "JavaScript Scope, Hoisting, and Closures for Beginners"
description: "Understand where variables can be used: global, function, and block scope, why let and const beat var, what hoisting means, and how closures let functions remember."
---

# Scope and Closures

*Scope is about who can see what. A room's contents are visible to everyone in that room, and invisible from the hallway.*

Sooner or later, you'll write a variable, try to use it a few lines later, and get `ReferenceError: total is not defined`. You'll stare at the screen. It's *right there*.

The answer is almost always **scope**: the rules about where a variable can be seen and used. Once you understand those rules, a whole category of confusing errors becomes easy to fix. And they lead to one of JavaScript's most useful ideas, closures.

## Rooms in a house

Picture a house with one-way windows. From inside a bedroom, you can see out into the hallway, and from the hallway you can see out into the garden. But from the garden, you can't see into the bedroom.

That's how scope works:

- **Code can see variables in its own room and in every room around it, outward.**
- **Code can't see into rooms nested inside it.**

## Global scope: the garden

A variable declared outside any function or block is **global**. Everything can see it:

```js
const bakeryName = "Maria's Bakery";

function printSign() {
	console.log(bakeryName);   // works: looking outward
}
```

Globals are convenient, but it's easy to have too many. Any code anywhere can change a global `let`, and two scripts that both create a global called `total` will collide. Keep them to a minimum. (You'll see in [Modules](/lessons/javascript/modules) that modules give each file its own private garden.)

## Function scope: a room of its own

Variables created inside a function live only inside that function:

```js
function calculateTotal() {
	const tax = 0.12;
	return 100 + 100 * tax;
}

console.log(calculateTotal());   // 112
console.log(tax);                // ReferenceError: tax is not defined
```

From the outside, you can't see into the room. That's a feature, not a bug. It means every function can use simple names like `total` or `count` without worrying about clashing with some other function's `total`.

## Block scope: even smaller rooms

`let` and `const` go one step further. Any pair of curly braces, like the block of an `if` or a loop, makes its own little room:

```js
if (true) {
	const message = 'Inside the block';
	console.log(message);   // works
}

console.log(message);   // ReferenceError: message is not defined
```

This is exactly what you want. A loop counter should disappear when the loop ends, and a temporary value inside an `if` shouldn't leak out.

## Why `var` causes trouble

Remember `var`, the old keyword from [Variables](/lessons/javascript/variables)? It ignores block scope. It only respects function walls:

```js
if (true) {
	var leaky = 'I escaped!';
}

console.log(leaky);   // 'I escaped!'
```

A variable that escapes its block can clash with other code and cause bugs that are hard to trace. That's the main reason modern JavaScript uses `let` and `const`.

## Shadowing: same name, different room

You're allowed to reuse a name in an inner room. The inner one "shadows" the outer one while you're inside:

```js
const bread = 'Sourdough';

function bake() {
	const bread = 'Rye';
	console.log(bread);   // 'Rye': the nearest room wins
}

bake();
console.log(bread);       // 'Sourdough': the outer one was never touched
```

JavaScript always looks in the nearest room first, then outward. It's legal, but it can be confusing to read, so use different names when you can.

## Hoisting: what the browser reads first

Before running your code, JavaScript skims through each scope and notes every declaration. This is called **hoisting**, and it explains a few odd behaviors:

- **Function declarations** are fully ready before any code runs. That's why you can call `function greet() {}` from a line above it.
- **`var`** is noted in advance but left empty, so using it early gives `undefined` instead of an error. That silence hides bugs.
- **`let` and `const`** are noted too, but they're locked until their line runs. Using them early throws a clear `ReferenceError`. That locked stretch is nicknamed the **temporal dead zone**.

```js
console.log(early);   // ReferenceError: Cannot access 'early' before initialization
const early = 'too soon';
```

A loud error is a good thing here. It tells you exactly where the problem is.

## Closures: functions that remember

Here's where scope becomes a superpower. A function can see the variables in the room where it was **created**, and it keeps that access even after the outer function has finished running.

```js
function makeCounter() {
	let count = 0;

	return () => {
		count += 1;
		return count;
	};
}

const nextTicket = makeCounter();
console.log(nextTicket());   // 1
console.log(nextTicket());   // 2
console.log(nextTicket());   // 3
```

`makeCounter` ran once and finished. But the little arrow function it returned still remembers `count`, and updates it every time it's called. That combination, a function plus the variables it remembers, is called a **closure**.

Think of the ticket dispenser at a deli counter. The dispenser remembers the last number it gave out, and nobody can reach inside and change it. They can only take the next ticket. That's closures giving you **private state**: `count` can't be touched from outside, only through `nextTicket()`.

And each call to `makeCounter()` builds a brand-new dispenser with its own separate count:

```js
const bakeryTickets = makeCounter();
const coffeeTickets = makeCounter();

bakeryTickets();   // 1
bakeryTickets();   // 2
coffeeTickets();   // 1: a separate count
```

You've actually been using closures already. Every event listener callback that uses a variable from outside it is a closure.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'bakery\'>Take a bakery ticket</button>\n<button type=\'button\' id=\'coffee\'>Take a coffee ticket</button>\n<p id=\'ticket\'>No tickets yet.</p>'"
	:initial-js="'function makeCounter() {\n\tlet count = 0;\n\treturn () => {\n\t\tcount += 1;\n\t\treturn count;\n\t};\n}\n\nconst nextBakeryTicket = makeCounter();\nconst nextCoffeeTicket = makeCounter();\nconst ticket = document.querySelector(\'#ticket\');\n\ndocument.querySelector(\'#bakery\').addEventListener(\'click\', () => {\n\tticket.textContent = `Bakery ticket number ${nextBakeryTicket()}`;\n});\n\ndocument.querySelector(\'#coffee\').addEventListener(\'click\', () => {\n\tticket.textContent = `Coffee ticket number ${nextCoffeeTicket()}`;\n});\n\n// Block scope in action\nif (true) {\n\tconst message = \'Inside the block\';\n\tconsole.log(message);\n}\nconsole.log(\'Outside, is message defined?\', typeof message !== \'undefined\');\n'"
	show-console
	preview-height="110px"
/>

(`typeof` is the one safe way to check for a variable that might not exist: it gives `'undefined'` instead of throwing an error.)

## Try it yourself

1. Click each button a few times. Do the two ticket numbers affect each other? Why not?
2. After the `if` block, add `console.log(message);` and read the error.
3. Try to read `count` from outside `makeCounter` with `console.log(count);`. Can you reach inside the dispenser?

## Check your understanding

<Quiz
	question="A const is declared inside an if block. Can code after the closing brace use it?"
	:options="['Yes, always', 'No, let and const only exist inside their block', 'Only if the condition was true', 'Only inside a function']"
	:answer-index="1"
	explanation="let and const are block-scoped, so they disappear when the block's closing brace is reached."
/>

<Quiz
	question="What happens here? console.log(total); let total = 5;"
	:options="['It logs 5', 'It logs undefined', 'It throws a ReferenceError', 'It logs null']"
	:answer-index="2"
	explanation="let and const can't be used before their line runs. That locked stretch is the temporal dead zone."
/>

<Quiz
	question="What is a closure?"
	:options="['A function that closes the browser tab', 'A function together with the variables it remembers from where it was created', 'The last line of a function', 'A block that ends with a return']"
	:answer-index="1"
	explanation="A closure lets a function keep using variables from its outer scope, even after that outer function has finished."
/>

## Up next

You've finished the Functions chapter. Now it's time to store more than one thing at a time: shopping lists, menus, search results. That starts with [Arrays](/lessons/javascript/arrays).
