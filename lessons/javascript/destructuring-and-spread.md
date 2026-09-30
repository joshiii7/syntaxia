---
title: "JavaScript Destructuring, Spread, and Rest Explained"
description: "Unpack values from arrays and objects with destructuring, copy and merge them with the spread operator, and gather extra arguments with rest parameters."
---

# Destructuring and Spread

*Unpacking a grocery bag onto the counter, and pouring two bags into one. Two small tricks you'll use every day.*

By now you've written plenty of lines like these:

```js
const name = product.name;
const price = product.price;
const stock = product.stock;
```

It works, but it's repetitive. Modern JavaScript has a shortcut for pulling values out of arrays and objects, and a matching one for copying and combining them. You'll see both in almost every piece of modern code, so they're worth getting comfortable with.

## Destructuring objects: unpacking the bag

Picture coming home with a grocery bag and putting each thing where it belongs: milk in the fridge, bread in the bread box. **Destructuring** unpacks an object into separate variables in one line:

```js
const product = { name: 'Sourdough', price: 8, stock: 12 };

const { name, price } = product;

console.log(name);    // 'Sourdough'
console.log(price);   // 8
```

The curly braces on the left side of the `=` aren't making an object. They're saying "reach into this object and pull out these properties, into variables with the same names." Anything you don't ask for, like `stock`, simply stays in the bag.

### Renaming and defaults

Sometimes the property name isn't the variable name you want, or the property might be missing:

```js
const { name: breadName, isVegan = false } = product;

console.log(breadName);   // 'Sourdough'
console.log(isVegan);     // false: the default, since product has no isVegan
```

- `name: breadName` means "take `name`, but call my variable `breadName`." (The colon reads as "into.")
- `isVegan = false` sets a default, used only when the property is missing, just like the default parameters from [Functions](/lessons/javascript/functions).

### Destructuring in function parameters

This is where destructuring really shines. When a function takes an object, it can unpack it right in the parameter list:

```js
function describe({ name, price }) {
	return `${name} costs $${price}`;
}

console.log(describe(product));   // 'Sourdough costs $8'
```

Anyone reading the first line now sees exactly which properties the function needs.

## Destructuring arrays: taking things in order

Arrays unpack by **position** instead of by name, using square brackets:

```js
const topThree = ['Sourdough', 'Rye', 'Focaccia'];

const [first, second] = topThree;
console.log(first);    // 'Sourdough'
console.log(second);   // 'Rye'
```

You name the variables whatever you like, since there are no keys to match. You already used this in [Objects](/lessons/javascript/objects), in `for (const [bread, count] of Object.entries(stock))`: each entry is a two-item array, and `[bread, count]` unpacks it.

A neat trick that falls out of this: swapping two variables without a temporary one.

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b);   // 2 1
```

## Spread: pouring everything out

The **spread** operator is three dots, `...`, in front of an array or object. It means "pour out everything inside, right here."

### Copying and combining arrays

```js
const breads = ['Sourdough', 'Rye'];
const pastries = ['Croissant', 'Danish'];

const everything = [...breads, ...pastries];
// ['Sourdough', 'Rye', 'Croissant', 'Danish']

const copy = [...breads];
copy.push('Focaccia');
console.log(breads);   // ['Sourdough', 'Rye']: untouched
```

Remember the sharing surprise from [Arrays](/lessons/javascript/arrays), where `tuesday = monday` made two labels for one carton? `[...monday]` is the fix: it pours the eggs into a **new** carton.

### Copying and updating objects

Spread works on objects too, and it's the standard way to make an updated copy without changing the original:

```js
const bread = { name: 'Sourdough', price: 8 };

const onSale = { ...bread, price: 6 };

console.log(onSale);   // { name: 'Sourdough', price: 6 }
console.log(bread);    // { name: 'Sourdough', price: 8 }: untouched
```

Properties are poured in from left to right, and a later one with the same name wins. So `...bread` pours in both properties, then `price: 6` overwrites the price. Order matters: `{ price: 6, ...bread }` would end up with the original price of 8.

### A spread copy is shallow

One warning. Spread copies the **top layer** only:

```js
const order = { id: 1, items: ['Rye'] };
const copy = { ...order };

copy.items.push('Coffee');
console.log(order.items);   // ['Rye', 'Coffee']: shared!
```

`copy` is a new object, but its `items` property still points to the **same** array as the original's. Think of photocopying a folder's cover page: you have a new cover, but the papers clipped inside are still the originals. For a completely independent copy of nested data, use `structuredClone(order)`.

### Spreading into a function call

Spread can also pour an array out as separate arguments:

```js
const prices = [8, 6, 9, 7];
console.log(Math.max(...prices));   // 9
```

`Math.max` wants separate numbers, `Math.max(8, 6, 9, 7)`, not an array. Spread does the unpacking for you.

## Rest: gathering the leftovers

The same three dots do the **opposite** job in a different spot. When they appear where you're *receiving* values, like in a parameter list or on the left side of destructuring, they **gather** everything that's left into one array or object. That's called **rest**:

```js
function orderSummary(customer, ...items) {
	return `${customer} ordered ${items.length} items: ${items.join(', ')}`;
}

console.log(orderSummary('Ana', 'Rye', 'Coffee', 'Croissant'));
// 'Ana ordered 3 items: Rye, Coffee, Croissant'
```

`customer` takes the first argument, and `...items` scoops up all the rest into an array. It works in destructuring too:

```js
const [winner, ...others] = ['Sourdough', 'Rye', 'Focaccia'];
// winner: 'Sourdough', others: ['Rye', 'Focaccia']

const { password, ...safeUser } = { name: 'Ana', password: 'secret123' };
// safeUser: { name: 'Ana' }
```

That last one is a handy pattern for leaving a property out of a copy.

How to tell them apart: **spread pours out** (you're giving values), **rest gathers up** (you're receiving values). Same dots, opposite directions.

## Try it

<WebPlayground
	:panes="['javascript']"
	initial-html=""
	:initial-js="'const product = { name: \'Sourdough\', price: 8, stock: 12 };\n\nconst { name, price, isVegan = false } = product;\nconsole.log(name, price, isVegan);\n\nconst [first, ...others] = [\'Sourdough\', \'Rye\', \'Focaccia\'];\nconsole.log(\'First:\', first, \'Others:\', others);\n\nconst onSale = { ...product, price: 6 };\nconsole.log(\'On sale:\', onSale);\nconsole.log(\'Original:\', product);\n\nconst breads = [\'Sourdough\', \'Rye\'];\nconst pastries = [\'Croissant\', \'Danish\'];\nconsole.log(\'Everything:\', [...breads, ...pastries]);\n\nfunction orderSummary(customer, ...items) {\n\treturn `${customer} ordered ${items.length} items: ${items.join(\', \')}`;\n}\nconsole.log(orderSummary(\'Ana\', \'Rye\', \'Coffee\', \'Croissant\'));\n\nconsole.log(\'Highest price:\', Math.max(...[8, 6, 9, 7]));\n'"
	show-console
	hide-preview
/>

## Try it yourself

1. Add `stock` to the destructuring line and log it. Then rename it with `stock: loavesLeft`.
2. Move `price: 6` to the *front* of the `onSale` object, before `...product`. What price do you get now, and why?
3. Write a function `describe({ name, price })` that returns a sentence, and call it with `product`.

## Check your understanding

<Quiz
	question="What does this give? const { name } = { name: 'Rye', price: 7 }; console.log(name);"
	:options="['{ name: \'Rye\' }', '\'Rye\'', 'undefined', '7']"
	:answer-index="1"
	explanation="Object destructuring pulls the name property out into a variable called name, so it holds the string Rye."
/>

<Quiz
	question="What is the result of { ...{ price: 8 }, price: 6 }?"
	:options="['{ price: 8 }', '{ price: 6 }', '{ price: 8, price: 6 }', 'An error']"
	:answer-index="1"
	explanation="Properties are applied left to right, so the later price: 6 overwrites the spread price of 8."
/>

<Quiz
	question="In function f(first, ...rest) {}, what is rest when calling f(1, 2, 3)?"
	:options="['3', '[2, 3]', '[1, 2, 3]', '2']"
	:answer-index="1"
	explanation="The rest parameter gathers every argument after first into an array, so rest is [2, 3]."
/>

## Up next

You've been working with text since the first lesson. Now let's get serious about it: searching, trimming, splitting, and checking whether text matches a pattern. That's [Strings and Regular Expressions](/lessons/javascript/strings-and-regex).
