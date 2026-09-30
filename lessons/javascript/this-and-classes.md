---
title: "JavaScript this Keyword and Classes Explained for Beginners"
description: "Understand what this means in methods, plain functions, arrow functions, and event listeners, fix lost this in callbacks, and build objects with JavaScript classes."
---

# this and Classes

*"Put this in the fridge." Which fridge depends entirely on whose kitchen you're standing in.*

You met `this` briefly in [Objects](/lessons/javascript/objects), inside a method: `this.openHour` meant "this bakery's opening hour." It seemed simple. Then one day you'll pass that method to a button or a timer, and suddenly `this` is something else entirely, and your code breaks in a way that makes no sense.

`this` has a reputation as one of JavaScript's most confusing features. It doesn't have to be. There's one core rule, and a handful of situations to know.

## The core rule: it depends on how you call it

For a regular function, **`this` is decided at the moment the function is called, by how it's called**. Not by where it was written.

Think of the word "here." If you text a friend "I'm here," the meaning depends entirely on where you are when you send it. The word doesn't change. The situation does.

## 1. Called as a method: `this` is the object before the dot

```js
const bakery = {
	title: "Maria's Bakery",
	greet() {
		console.log(`Welcome to ${this.title}!`);
	},
};

bakery.greet();   // "Welcome to Maria's Bakery!"
```

When you call `bakery.greet()`, look at what's **before the dot**: `bakery`. That's `this`. This is the case you'll use most, and it's the easy one.

## 2. Called on its own: `this` goes missing

Now pull the method out and call it by itself:

```js
const greet = bakery.greet;
greet();   // "Welcome to undefined!"
```

There's no dot, so there's no object to be `this`. In modern code (modules and classes, which use JavaScript's stricter "strict mode"), `this` is `undefined` and reading `this.title` throws an error. In an old-style plain script, like this book's editors, `this` falls back to the global `window` object, which has no `title` property. Either way, it's lost.

This happens by accident all the time, most often when handing a method to something else as a callback:

```js
setTimeout(bakery.greet, 1000);   // "Welcome to undefined!"
```

You're passing the function itself, detached from `bakery`. When the timer calls it a second later, it's called on its own, with no dot.

## 3. Arrow functions don't have their own `this`

Arrow functions work differently. They don't get their own `this` at all. They use the `this` of the place where they were **written**, like any other outside variable (you learned about that reaching-outward behavior in [Scope and Closures](/lessons/javascript/scope-and-closures)).

That makes arrows the easiest fix for the lost-`this` problem:

```js
setTimeout(() => bakery.greet(), 1000);   // "Welcome to Maria's Bakery!"
```

The arrow calls `bakery.greet()` **with the dot**, at the right time. Problem solved.

But it also means arrows make poor **methods**:

```js
const shop = {
	title: 'Rye & Co',
	greet: () => {
		console.log(`Welcome to ${this.title}!`);   // this is NOT shop here
	},
};
```

That arrow's `this` comes from outside the object, not from `shop`. So the rule from [Arrow Functions and Callbacks](/lessons/javascript/arrow-functions) stands: use the method shorthand (`greet() {}`) for methods, and arrows for callbacks.

## 4. In an event listener

With a regular function as a listener, `this` is the element the listener is attached to:

```js
const button = document.querySelector('#favorite');

button.addEventListener('click', function () {
	this.classList.toggle('is-active');   // this is the button
});
```

With an arrow, it isn't. Modern code usually skips `this` here entirely and uses `event.currentTarget` instead, which always means "the element this listener is on," whichever kind of function you use:

```js
const button = document.querySelector('#favorite');

button.addEventListener('click', (event) => {
	event.currentTarget.classList.toggle('is-active');
});
```

Clearer, and no guessing.

## One more fix: `bind`

You'll see this in older code:

```js
const boundGreet = bakery.greet.bind(bakery);
setTimeout(boundGreet, 1000);   // works
```

`bind` makes a copy of the function with `this` permanently glued to the object you give it. It works, but an arrow wrapper usually reads more clearly.

## Classes: a blueprint for objects

So far you've written every object by hand. But what if you need fifty products, or a hundred orders, all with the same shape and the same methods? You'd want a **blueprint**.

Think of a cookie cutter again, like `<template>` in [Creating and Removing Elements](/lessons/javascript/creating-elements), but for objects. A **class** describes what every object of that kind has and can do:

```js
class Product {
	constructor(name, price, stock) {
		this.name = name;
		this.price = price;
		this.stock = stock;
	}

	isAvailable() {
		return this.stock > 0;
	}

	sell(quantity) {
		this.stock -= quantity;
	}
}
```

And `new` stamps out an object from the blueprint:

```js
const sourdough = new Product('Sourdough', 8, 12);
const rye = new Product('Rye', 7, 0);

console.log(sourdough.isAvailable());   // true
console.log(rye.isAvailable());         // false

sourdough.sell(3);
console.log(sourdough.stock);           // 9
```

- `class Product` names the blueprint. Class names start with a capital letter, by convention.
- `constructor` runs automatically when you call `new`. Inside it, `this` is the brand-new object being built, so `this.name = name` sets up its properties.
- Methods like `isAvailable` are shared by every object made from the class. Inside them, `this` is whichever object the method was called on, the object before the dot, just like case 1.

Each object made with `new` is called an **instance**. `sourdough` and `rye` are two separate instances, with their own stock counts.

### Private fields and inheritance, briefly

Two more class features you'll meet in real code:

```js
class Order {
	#items = [];   // private: only code inside the class can touch it

	add(item) {
		this.#items.push(item);
	}

	get count() {
		return this.#items.length;
	}
}

class GiftOrder extends Order {
	constructor(message) {
		super();                 // run Order's own setup first
		this.message = message;
	}
}
```

- A `#` in front of a field makes it **private**, like the closure-protected `count` from [Scope and Closures](/lessons/javascript/scope-and-closures), but built into the class.
- `get count()` is a **getter**: you read it like a property, `order.count`, with no parentheses.
- `extends` makes a class that starts with everything another class has, and `super()` runs the parent's constructor.

You don't need classes for everything. Plain objects and functions handle most jobs in this book. Classes shine when you have many objects of the same kind, each carrying its own data and behavior.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'greet-later\'>Greet in 1 second</button>\n<ul id=\'products\'></ul>'"
	:initial-js="'const bakery = {\n\ttitle: \'Maria\\\'s Bakery\',\n\tgreet() {\n\t\tconsole.log(`Welcome to ${this.title}!`);\n\t},\n};\n\nbakery.greet();\n\nconst detached = bakery.greet;\ndetached();   // this is lost: no object before the dot\n\ndocument.querySelector(\'#greet-later\').addEventListener(\'click\', () => {\n\tsetTimeout(bakery.greet, 1000);          // lost this\n\tsetTimeout(() => bakery.greet(), 1000);  // fixed with an arrow\n});\n\nclass Product {\n\tconstructor(name, price, stock) {\n\t\tthis.name = name;\n\t\tthis.price = price;\n\t\tthis.stock = stock;\n\t}\n\n\tisAvailable() {\n\t\treturn this.stock > 0;\n\t}\n\n\tlabel() {\n\t\treturn this.isAvailable() ? `${this.name}: $${this.price}` : `${this.name}: sold out`;\n\t}\n}\n\nconst products = [\n\tnew Product(\'Sourdough\', 8, 12),\n\tnew Product(\'Rye\', 7, 0),\n\tnew Product(\'Focaccia\', 6, 4),\n];\n\nconst list = document.querySelector(\'#products\');\nfor (const product of products) {\n\tconst item = document.createElement(\'li\');\n\titem.textContent = product.label();\n\tlist.append(item);\n}\nconsole.log(products[0]);\n'"
	show-console
	preview-height="160px"
/>

## Try it yourself

1. Press the button and watch the two greetings arrive. Which one lost its `this`, and why?
2. Add a `sell(quantity)` method to `Product` that lowers the stock, sell 4 Focaccia before building the list, and see its label change.
3. Change `greet() {` in the `bakery` object to `greet: () => {` and run it. What happens to the first greeting?

## Check your understanding

<Quiz
	question="What is this inside a method called as shop.open()?"
	:options="['The window', 'The shop object', 'The open function', 'undefined']"
	:answer-index="1"
	explanation="For a regular function called as a method, this is the object before the dot, here shop."
/>

<Quiz
	question="setTimeout(bakery.greet, 1000) logs undefined for this.title. What is the simplest fix?"
	:options="['setTimeout(bakery.greet(), 1000)', 'setTimeout(() => bakery.greet(), 1000)', 'setTimeout(this.greet, 1000)', 'setTimeout(greet, 1000)']"
	:answer-index="1"
	explanation="The arrow calls bakery.greet() with the dot at the right time, so this is bakery. The first option would run greet immediately."
/>

<Quiz
	question="In a class, when does the constructor run?"
	:options="['When the class is written', 'Each time you create an instance with new', 'Only once per page', 'When a method is called']"
	:answer-index="1"
	explanation="Every new Product(...) call runs the constructor, with this set to the brand-new object being built."
/>

## Up next

You've now seen quite a few error messages. Time to stop fearing them and start reading them like clues, with tools to catch errors and track down bugs. That's [Errors and Debugging](/lessons/javascript/errors-and-debugging).
