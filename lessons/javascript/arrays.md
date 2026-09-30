---
title: "JavaScript Arrays: Create, Read, Add, and Remove Items"
description: "Store lists in JavaScript arrays: count from zero, read and update items, add and remove with push, pop, slice, and splice, and understand how array copies work."
---

# Arrays

*An array is an egg carton: a row of numbered cups, each holding one thing, all carried as one.*

So far, every variable has held exactly one value. One name. One price. But the things you'll build are full of lists: the breads on a menu, the items in a cart, the results of a search, every link in a nav.

You could make a separate variable for each one, `bread1`, `bread2`, `bread3`, but then how would you loop over them, or add a fourth? That's what **arrays** are for.

## Making an array

```js
const breads = ['Sourdough', 'Rye', 'Focaccia'];
```

Square brackets, with the items separated by commas. An array can hold any type of value, and even a mix, though in practice a list usually holds one kind of thing:

```js
const prices = [4.5, 6, 3.25];
const empty = [];
```

## Counting from zero

Picture an egg carton with its cups numbered. Here's the part everyone has to get used to: **the first cup is number 0**, not 1.

```js
const breads = ['Sourdough', 'Rye', 'Focaccia'];

console.log(breads[0]);   // 'Sourdough'
console.log(breads[1]);   // 'Rye'
console.log(breads[2]);   // 'Focaccia'
console.log(breads[3]);   // undefined: there's no fourth cup
```

The number in square brackets is called the **index**. Think of it as "how many steps from the start": the first item is zero steps away.

Every array knows how many items it holds:

```js
console.log(breads.length);   // 3
```

Because counting starts at 0, the **last** item is always at `length - 1`. That mismatch, 3 items but the last one at index 2, is where the off-by-one bugs from [Loops](/lessons/javascript/loops) come from. There's also a newer, friendlier way to count from the end:

```js
console.log(breads.at(-1));   // 'Focaccia': the last item
console.log(breads.at(-2));   // 'Rye': second to last
```

## Changing an item

```js
breads[1] = 'Pumpernickel';
console.log(breads);   // ['Sourdough', 'Pumpernickel', 'Focaccia']
```

Wait: `breads` is a `const`. How can it change?

Remember the note in [Variables](/lessons/javascript/variables): `const` glues the lid on the jar, meaning you can't swap in a completely *different* array. But you can still rearrange the eggs inside the carton you've got. So `breads[1] = ...` is fine, while `breads = ['Bagel']` throws an error. That's why you'll see `const` used for arrays that change all the time.

## Adding and removing at the ends

```js
const cart = ['Sourdough'];

cart.push('Coffee');        // add to the end
cart.unshift('Croissant');  // add to the start
console.log(cart);          // ['Croissant', 'Sourdough', 'Coffee']

const lastItem = cart.pop();     // remove from the end, and hand it back
const firstItem = cart.shift();  // remove from the start, and hand it back
console.log(lastItem, firstItem);   // 'Coffee' 'Croissant'
console.log(cart);                  // ['Sourdough']
```

Think of a stack of plates: `push` puts one on top, `pop` takes the top one off. `shift` and `unshift` do the same thing at the other end.

## Finding things

```js
const breads = ['Sourdough', 'Rye', 'Focaccia'];

console.log(breads.includes('Rye'));      // true
console.log(breads.indexOf('Focaccia'));  // 2
console.log(breads.indexOf('Bagel'));     // -1: not found
```

`includes` answers "is it in there?" with `true` or `false`. `indexOf` tells you which cup it's in, or `-1` if it isn't there at all. (For searching lists of more complex things, like products, you'll use `find` and `filter` in the next lesson.)

## `slice` and `splice`: the confusing twins

These two names are almost identical and do quite different things. Worth learning carefully:

```js
const breads = ['Sourdough', 'Rye', 'Focaccia', 'Brioche'];

// slice: COPIES a section. The original is untouched.
const middle = breads.slice(1, 3);
console.log(middle);   // ['Rye', 'Focaccia']
console.log(breads);   // still all four

// splice: CHANGES the original. Removes (and optionally inserts) in place.
breads.splice(1, 1);   // at index 1, remove 1 item
console.log(breads);   // ['Sourdough', 'Focaccia', 'Brioche']
```

- `slice(start, end)` takes a copy from `start` up to, but **not including**, `end`. Like slicing a piece off a loaf to share, while the loaf stays on the board.
- `splice(start, howMany)` cuts items out of the original array itself.

A handy way to remember: spl**i**ce **i**s the one that **i**nterferes with the original.

## Arrays and loops

Arrays and `for...of` loops were made for each other:

```js
for (const bread of breads) {
	console.log(bread);
}
```

And you'll often want to turn an array into a single string:

```js
console.log(breads.join(', '));   // 'Sourdough, Focaccia, Brioche'
```

## The sharing surprise

Here's one that trips up almost everyone. Look carefully:

```js
const monday = ['Sourdough', 'Rye'];
const tuesday = monday;

tuesday.push('Brioche');
console.log(monday);   // ['Sourdough', 'Rye', 'Brioche']  (wait, what?)
```

`tuesday = monday` didn't copy the carton. It made a second label pointing to the **same** carton. Changes through either label affect the one carton they share.

Numbers and strings don't behave this way; they're copied when you assign them. But arrays (and the objects you'll meet soon) are shared by **reference**. To make a real, separate copy, use one of these:

```js
const tuesdayCopy = [...monday];    // spread, covered in Destructuring and Spread
const alsoACopy = monday.slice();   // slice with no arguments copies everything
```

When a list changes "by itself" somewhere else in your program, a shared reference is the first thing to suspect.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<h2>Your cart</h2>\n<p id=\'cart\'></p>'"
	:initial-js="'const cart = [\'Sourdough\'];\n\ncart.push(\'Coffee\');\ncart.unshift(\'Croissant\');\nconsole.log(\'Cart:\', cart);\nconsole.log(\'Items:\', cart.length);\nconsole.log(\'First:\', cart[0], \'Last:\', cart.at(-1));\n\nconsole.log(\'Has coffee?\', cart.includes(\'Coffee\'));\n\nconst removed = cart.pop();\nconsole.log(\'Removed:\', removed, \'Cart now:\', cart);\n\n// The sharing surprise\nconst monday = [\'Sourdough\', \'Rye\'];\nconst tuesday = monday;\ntuesday.push(\'Brioche\');\nconsole.log(\'Monday:\', monday);\n\ndocument.querySelector(\'#cart\').textContent = cart.join(\', \');\n'"
	show-console
	preview-height="100px"
/>

## Try it yourself

1. Add two more items to the cart with `push`, then remove the first item with `shift`.
2. Use `splice` to remove `'Sourdough'` from the cart by its index.
3. Fix the sharing surprise: change `const tuesday = monday;` so Tuesday gets its own copy, and check that Monday stays the same.

## Check your understanding

<Quiz
	question="What is the index of the first item in an array?"
	:options="['0', '1', '-1', 'It depends on the array']"
	:answer-index="0"
	explanation="Arrays count from zero, so the first item is at index 0 and the last is at length - 1."
/>

<Quiz
	question="Which method adds an item to the end of an array?"
	:options="['pop', 'push', 'shift', 'slice']"
	:answer-index="1"
	explanation="push adds to the end. pop removes from the end, shift removes from the start, and unshift adds to the start."
/>

<Quiz
	question="const a = [1, 2]; const b = a; b.push(3); What is a now?"
	:options="['[1, 2]', '[1, 2, 3]', '[3]', 'An error, a is const']"
	:answer-index="1"
	explanation="b = a copies the reference, not the array. Both names point to the same array, so pushing through b changes a too."
/>

## Up next

You can build and change lists by hand. Next, you'll meet the tools professionals use to transform whole lists in one line: turning prices into labels, keeping only what's in stock, adding up a total. That's [Array Methods: map, filter, find, reduce](/lessons/javascript/array-methods).
