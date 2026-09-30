---
title: "JavaScript Functions: Parameters, return, and Defaults"
description: "Write reusable JavaScript functions: declare and call them, pass in parameters, send results back with return, set default values, and name them well."
---

# Functions

*A function is a recipe card. Write the steps once, then cook it whenever you like, with whatever ingredients you have.*

Look back at the code you've written so far. A lot of it runs once, top to bottom, and that's it. But real pages do the same jobs again and again: format a price, check an email address, update a cart count. Copying the same lines into every place you need them would be a nightmare to maintain. Change the logic once and you'd have to find every copy.

**Functions** solve that. You write a set of steps once, give it a name, and run it whenever you want.

## A recipe card

Picture a recipe card in a kitchen drawer: "Toast. 1. Put bread in the toaster. 2. Wait until golden. 3. Butter it." The card doesn't make toast by sitting in the drawer. You have to take it out and follow it.

```js
// Writing the recipe card (declaring the function)
function makeToast() {
	console.log('Put bread in the toaster.');
	console.log('Wait until golden.');
	console.log('Butter it.');
}

// Following the recipe (calling the function)
makeToast();
makeToast();   // and again, whenever you like
```

- `function` says "I'm writing a recipe card."
- `makeToast` is its name.
- The parentheses `()` will hold ingredients, in a moment.
- The curly braces hold the steps.

Writing the function doesn't run it. The steps only happen when you **call** it by writing its name followed by parentheses: `makeToast()`. Forgetting the parentheses is a classic slip: `makeToast` on its own just refers to the recipe card without following it.

## Ingredients: parameters

A toast recipe that only ever makes white bread isn't very useful. Recipes have ingredients you can swap:

```js
function makeToast(bread, topping) {
	console.log(`Toasting ${bread}, topped with ${topping}.`);
}

makeToast('sourdough', 'butter');
makeToast('rye', 'jam');
```

- `bread` and `topping` are **parameters**: blank spaces in the recipe, waiting to be filled.
- `'sourdough'` and `'butter'` are **arguments**: the actual ingredients you hand over when you call it.

Arguments are matched to parameters by **position**: first to first, second to second. Swap them and you'll get jam toasted and topped with rye.

## Getting something back: `return`

So far, our functions only *do* things (print to the console). Often you want a function to *work something out* and hand you the answer, like a calculator:

```js
function totalPrice(price, quantity) {
	return price * quantity;
}

const cost = totalPrice(4.5, 3);
console.log(cost);   // 13.5
```

`return` sends a value back to wherever the function was called. `totalPrice(4.5, 3)` gets replaced by its answer, `13.5`, which then goes into the `cost` jar.

Two things to know about `return`:

- It **ends** the function immediately. Any lines after a `return` in the same block never run.
- A function without a `return` still gives something back: `undefined`. If you ever see `undefined` where you expected an answer, check for a missing `return`.

```js
function totalPriceBroken(price, quantity) {
	price * quantity;   // calculated... and thrown away
}

console.log(totalPriceBroken(4.5, 3));   // undefined
```

`return` also pairs nicely with `if` for handling special cases first:

```js
function shippingCost(total) {
	if (total >= 50) {
		return 0;   // free shipping, and we're done
	}
	return 5;
}
```

This pattern, called an **early return**, keeps functions flat and easy to read.

## Default values

What if someone forgets an ingredient?

```js
function greet(name) {
	return `Hello, ${name}!`;
}

console.log(greet());   // 'Hello, undefined!'
```

A missing argument becomes `undefined`. You can give a parameter a **default** that's used whenever the argument is missing:

```js
function greet(name = 'friend') {
	return `Hello, ${name}!`;
}

console.log(greet());          // 'Hello, friend!'
console.log(greet('Maria'));   // 'Hello, Maria!'
```

## Functions are values too

Here's an idea that will matter more and more. A function is a value, just like a number or a string, so you can store it in a variable:

```js
const makeCoffee = function () {
	console.log('Brewing coffee...');
};

makeCoffee();
```

This is called a **function expression**. It works almost exactly like the `function makeCoffee() {}` version. The main difference is that a declared function can be called from lines *above* where it's written, because JavaScript reads all function declarations first. A function stored in a `const` can't be used until that line has run.

You'll use "functions as values" constantly: handing a function to a button so it runs on click, or to a list so it runs for every item. The next lesson, [Arrow Functions and Callbacks](/lessons/javascript/arrow-functions), is all about that.

## Naming functions well

Functions *do* things, so name them with a verb: `calculateTotal`, `showMenu`, `formatPrice`, `isOpen`. A function name that starts with `is`, `has`, or `can` promises to return `true` or `false`.

And keep each function focused on **one job**. If you find yourself naming one `validateFormAndSendEmailAndUpdatePage`, that's three functions pretending to be one. Small functions are easier to read, test, and reuse.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<p id=\'receipt\'></p>'"
	:initial-js="'function totalPrice(price, quantity = 1) {\n\treturn price * quantity;\n}\n\nfunction shippingCost(total) {\n\tif (total >= 50) {\n\t\treturn 0;\n\t}\n\treturn 5;\n}\n\nfunction formatPrice(amount) {\n\treturn `$${amount.toFixed(2)}`;\n}\n\nconst breads = totalPrice(4.5, 4);\nconst coffee = totalPrice(3.25);\nconst subtotal = breads + coffee;\nconst total = subtotal + shippingCost(subtotal);\n\nconsole.log(\'Breads:\', formatPrice(breads));\nconsole.log(\'Coffee:\', formatPrice(coffee));\nconsole.log(\'Shipping:\', formatPrice(shippingCost(subtotal)));\n\ndocument.querySelector(\'#receipt\').textContent = `Total to pay: ${formatPrice(total)}`;\n'"
	show-console
	preview-height="80px"
/>

(`toFixed(2)` is a built-in number tool that rounds to two decimal places and gives you back a string, handy for prices while you're learning. Real shops use JavaScript's built-in formatter, which also adds the currency symbol, thousands separators, and each country's own conventions: `new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5)` gives `'$1,234.50'`.)

## Try it yourself

1. Change the number of breads so the subtotal goes over $50. Does the shipping become free?
2. Write a function called `applyDiscount(total, percent)` that returns the total with the discount taken off. Use it on the final total.
3. Remove `return` from `totalPrice` (keep the calculation). What happens to every number in the console?

## Check your understanding

<Quiz
	question="In function greet(name) { ... } called as greet('Maria'), which is the parameter and which is the argument?"
	:options="['name is the argument, \'Maria\' is the parameter', 'name is the parameter, \'Maria\' is the argument', 'Both are parameters', 'Both are arguments']"
	:answer-index="1"
	explanation="Parameters are the named blanks in the function definition. Arguments are the actual values you pass in when calling it."
/>

<Quiz
	question="A function calculates a value but never uses return. What does calling it give back?"
	:options="['The calculated value', '0', 'undefined', 'An error']"
	:answer-index="2"
	explanation="Without return, a function hands back undefined, no matter what it calculated inside."
/>

<Quiz
	question="What does this print? function double(n = 2) { return n * 2; } console.log(double());"
	:options="['NaN', '0', '4', 'undefined']"
	:answer-index="2"
	explanation="No argument was passed, so n uses its default of 2, and the function returns 4."
/>

## Up next

You've seen that functions are values you can pass around. Next, you'll learn the short, modern way to write them, and why handing one function to another is such a big deal. That's [Arrow Functions and Callbacks](/lessons/javascript/arrow-functions).
