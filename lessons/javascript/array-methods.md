---
title: "JavaScript Array Methods: map, filter, find, and reduce"
description: "Transform lists with map, keep matching items with filter, look things up with find, check with some and every, total them with reduce, and chain methods together."
---

# Array Methods: map, filter, find, reduce

*A production line: loaves go in one end, each station does one job, and finished bags come out the other.*

In [Arrays](/lessons/javascript/arrays), you worked with lists one item at a time: push this, splice that. And with a `for...of` loop, you can do anything to every item.

But most of the time, you want one of a handful of very common jobs: change every item, keep only some of them, find one, or add them all up. Arrays have a built-in tool for each of those jobs. They take a callback, just like `forEach` in [Arrow Functions and Callbacks](/lessons/javascript/arrow-functions), and they make your code shorter and much easier to read.

For this lesson, here's a small product list. Each product is an **object**, a bundle of named values in curly braces. You'll learn objects properly in the next lesson; for now, just know that `product.price` means "this product's price."

```js
const products = [
	{ name: 'Sourdough', price: 8, inStock: true },
	{ name: 'Rye', price: 7, inStock: false },
	{ name: 'Focaccia', price: 6, inStock: true },
	{ name: 'Brioche', price: 9, inStock: true },
];
```

## `map`: transform every item

`map` runs your callback on every item and collects the results into a **new array** of the same length:

```js
const names = products.map((product) => product.name);
// ['Sourdough', 'Rye', 'Focaccia', 'Brioche']

const labels = products.map((product) => `${product.name}: $${product.price}`);
// ['Sourdough: $8', 'Rye: $7', 'Focaccia: $6', 'Brioche: $9']
```

Think of a station on the production line that puts a label on every loaf. Four loaves in, four labeled loaves out. The originals aren't changed. You get a new array.

## `filter`: keep some items

`filter` runs your callback on every item and keeps only the ones where it returns something truthy:

```js
const available = products.filter((product) => product.inStock);
// Sourdough, Focaccia, Brioche

const cheap = products.filter((product) => product.price < 8);
// Rye, Focaccia
```

Think of a quality-control station that lets good loaves through and sets the rest aside. The result can be shorter than the original, or even empty.

## `find`: get the first match

`find` returns the **first** item where your callback returns something truthy, or `undefined` if nothing matches:

```js
const rye = products.find((product) => product.name === 'Rye');
console.log(rye.price);   // 7

const bagel = products.find((product) => product.name === 'Bagel');
console.log(bagel);       // undefined
```

`filter` always gives you an array. `find` gives you one item. Use `find` when you're looking for a specific thing, like "the product with this id." There's also `findIndex`, which gives you the position instead of the item.

## `some` and `every`: yes-or-no questions

```js
const anySoldOut = products.some((product) => !product.inStock);    // true
const allUnder10 = products.every((product) => product.price < 10); // true
```

- `some`: "Is it true for **at least one** item?"
- `every`: "Is it true for **all** items?"

Both stop checking as soon as they know the answer.

## `reduce`: boil it down to one value

`reduce` is the most powerful and, at first, the most confusing. It walks through the list and builds up a single result, like a running total:

```js
const total = products.reduce((sum, product) => sum + product.price, 0);
console.log(total);   // 30
```

Picture a cashier ringing up items one by one. The callback gets two things each time:

- `sum`: the running total so far (called the **accumulator**).
- `product`: the current item.

Whatever the callback returns becomes the new running total for the next item. The `0` at the end is the starting value, the empty till before the first item is scanned. Step by step: 0 + 8 = 8, 8 + 7 = 15, 15 + 6 = 21, 21 + 9 = 30.

Always give `reduce` a starting value. Without one, it uses the first item as the start, which breaks with an empty list.

If `reduce` feels like a lot, that's normal. For adding up numbers, it quickly becomes second nature. For more complicated jobs, a plain `for...of` loop is often clearer, and there's no shame in using one.

## Chaining: a full production line

Because `map` and `filter` return new arrays, you can call another method right on the result:

```js
const availableLabels = products
	.filter((product) => product.inStock)
	.map((product) => `${product.name}: $${product.price}`);
// ['Sourdough: $8', 'Focaccia: $6', 'Brioche: $9']
```

Read it top to bottom like a recipe: "Take the products, keep the ones in stock, turn each into a label." Putting each step on its own line makes long chains easy to follow.

## `map` or `forEach`?

Both run a callback on every item, so beginners often mix them up:

- `map` **builds and returns a new array** from your callback's return values. Use it when you want a transformed list.
- `forEach` **returns nothing**. Use it when you just want to *do* something for each item, like log it or add it to the page.

If you use `map` and ignore the result, you want `forEach`. If you use `forEach` and push into a new array by hand, you want `map`.

## The missing `return` trap

This bug shows up in every beginner's code at least once:

```js
const names = products.map((product) => {
	product.name;   // no return!
});
console.log(names);   // [undefined, undefined, undefined, undefined]
```

The curly braces turned off the implicit return, just like you learned with arrow functions. Either add `return`, or drop the braces: `(product) => product.name`.

## Sorting without surprises

One more: `sort`, from the arrow functions lesson, **changes the original array**. Most other methods here don't. When you want a sorted copy and want to leave the original alone, use `toSorted` (supported in all current browsers):

```js
const byPrice = products.toSorted((a, b) => a.price - b.price);
```

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<h2>Available today</h2>\n<ul id=\'menu\'></ul>\n<p id=\'total\'></p>'"
	:initial-js="'const products = [\n\t{ name: \'Sourdough\', price: 8, inStock: true },\n\t{ name: \'Rye\', price: 7, inStock: false },\n\t{ name: \'Focaccia\', price: 6, inStock: true },\n\t{ name: \'Brioche\', price: 9, inStock: true },\n];\n\nconst available = products.filter((product) => product.inStock);\nconst labels = available.map((product) => `${product.name}: $${product.price}`);\nconsole.log(\'Labels:\', labels);\n\nconst rye = products.find((product) => product.name === \'Rye\');\nconsole.log(\'Rye in stock?\', rye.inStock);\n\nconsole.log(\'Any sold out?\', products.some((product) => !product.inStock));\n\nconst total = available.reduce((sum, product) => sum + product.price, 0);\nconsole.log(\'One of everything available:\', total);\n\nconst menu = document.querySelector(\'#menu\');\nlabels.forEach((label) => {\n\tmenu.innerHTML += `<li>${label}</li>`;\n});\ndocument.querySelector(\'#total\').textContent = `One of each: $${total}`;\n'"
	show-console
	preview-height="180px"
/>

(That `innerHTML +=` line is a quick way to add list items for this demo, and it's only safe here because you wrote every label yourself. In [Creating and Removing Elements](/lessons/javascript/creating-elements), you'll learn the safer, more professional way.)

## Try it yourself

1. Set Rye's `inStock` to `true` and watch the menu and total update.
2. Add a `filter` step so only products under $9 appear on the menu.
3. Use `find` to look up `'Brioche'` and log its price. Then look up a bread that isn't in the list and log what you get.

## Check your understanding

<Quiz
	question="You want a new array of just the product names. Which method fits?"
	:options="['filter', 'find', 'map', 'reduce']"
	:answer-index="2"
	explanation="map transforms every item into something new, giving you an array of the same length, like one name per product."
/>

<Quiz
	question="What does find return when nothing matches?"
	:options="['An empty array', 'null', 'undefined', '-1']"
	:answer-index="2"
	explanation="find returns the first matching item, or undefined if there is none. findIndex is the one that returns -1."
/>

<Quiz
	question="What does [1, 2, 3].reduce((sum, n) => sum + n, 10) return?"
	:options="['6', '16', '10', '[11, 12, 13]']"
	:answer-index="1"
	explanation="The running total starts at 10, then adds 1, 2, and 3, giving 16."
/>

## Up next

You've been using objects like `{ name: 'Rye', price: 7 }` all lesson without a proper introduction. Time to fix that. [Objects](/lessons/javascript/objects) is next.
