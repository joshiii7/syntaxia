---
title: "JavaScript Arrow Functions and Callbacks Explained"
description: "Write short functions with arrow syntax, learn implicit returns, and understand callbacks: functions you hand to other functions, like forEach, sort, and setTimeout."
---

# Arrow Functions and Callbacks

*Sometimes you don't cook the recipe yourself. You hand the card to someone else and say, "Make this when it's time."*

In [Functions](/lessons/javascript/functions), you learned that functions are values, like numbers and strings. You can put one in a variable. This lesson is about the two things that idea unlocks: a shorter way to write functions, and the ability to hand a function to *another* function. That second idea runs through almost everything you'll do with JavaScript on the web.

## Arrow functions: the short form

Here's a regular function expression:

```js
const double = function (number) {
	return number * 2;
};
```

And the same thing as an **arrow function**:

```js
const double = (number) => {
	return number * 2;
};
```

The word `function` is gone, and an arrow `=>` sits between the parameters and the body. Read it as "number *goes to* number times two."

It gets shorter still. When the body is a single expression that you want to return, you can drop the braces **and** the `return`:

```js
const double = (number) => number * 2;
```

That's called an **implicit return**: the value after the arrow is returned automatically. A few more shapes you'll see:

```js
const sayHi = () => console.log('Hi!');        // no parameters: empty ()
const square = n => n * n;                     // one parameter: () are optional
const add = (a, b) => a + b;                   // two or more: () required
```

This book always writes the parentheses, even for one parameter, because it's consistent and it makes adding a second parameter later painless.

### The two classic arrow traps

**Trap 1: braces turn off the implicit return.**

```js
const double = (number) => { number * 2 };
console.log(double(4));   // undefined
```

As soon as you add curly braces, it's a normal block again, and you need `return`. This one catches everyone.

**Trap 2: returning an object.** Curly braces after the arrow are read as a block, not an object. Wrap the object in parentheses:

```js
const makeOrder = (bread) => ({ bread: bread, quantity: 1 });
```

You'll meet objects properly in [Objects](/lessons/javascript/objects). Just remember the parentheses when you get there.

## Callbacks: handing over the recipe

Now the big idea. Imagine you're leaving a note for a babysitter: "When the timer goes off, take the cookies out of the oven." You're not taking the cookies out yourself. You're handing over instructions to be followed *later*, by someone else, at the right moment.

A **callback** is a function you pass to another function, so that function can call it when the time is right.

You've already seen one in the HTML and CSS tracks, without the name:

```js
const button = document.querySelector('button');

button.addEventListener('click', () => {
	console.log('Clicked!');
});
```

You don't call that arrow function yourself. You hand it to `addEventListener`, which calls it every time the button is clicked. That's a callback.

### Callbacks you'll use constantly

**Waiting:** `setTimeout` runs a callback after a delay, in milliseconds.

```js
setTimeout(() => {
	console.log('Your bread is ready!');
}, 2000);   // after 2 seconds
```

**Going through a list:** `forEach` runs a callback once for every item.

```js
const breads = ['Sourdough', 'Rye', 'Focaccia'];

breads.forEach((bread) => {
	console.log(`Fresh today: ${bread}`);
});
```

**Sorting:** `sort` uses a callback to decide which of two items comes first.

```js
const prices = [12, 4, 30, 9];

prices.sort((a, b) => a - b);
console.log(prices);   // [4, 9, 12, 30]
```

The callback gets two items, `a` and `b`. Return a negative number to put `a` first, a positive number to put `b` first, or zero to keep them as they are. `a - b` does exactly that for numbers, smallest first. (`b - a` sorts largest first.)

And here's a real gotcha: without a callback, `sort` compares everything **as text**, like dictionary order:

```js
console.log([10, 9, 1].sort());   // [1, 10, 9]
```

"10" comes before "9" in the dictionary, because "1" comes before "9". Always pass a compare function when sorting numbers.

## Passing a function, not calling it

When you hand over a callback, pass the function itself. Don't call it:

```js
function announce() {
	console.log('Fresh batch out of the oven!');
}

setTimeout(announce, 1000);     // right: hands over the recipe
setTimeout(announce(), 1000);   // wrong: cooks it right now, hands over the result
```

With the parentheses, `announce()` runs immediately and its result (`undefined`) is what gets handed to `setTimeout`. No parentheses means "here's the recipe card, call it when it's time."

## When not to use an arrow

Arrow functions are the right choice for almost every callback. There's one important difference from regular functions, involving a special word called `this`, that you'll learn about in [this and Classes](/lessons/javascript/this-and-classes). Until then, a simple rule: use arrow functions for callbacks and small helpers, and regular `function` declarations for your main, named functions.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'bake\'>Start the oven</button>\n<p id=\'status\'>The oven is cold.</p>'"
	:initial-js="'const double = (number) => number * 2;\nconsole.log(\'Double 21:\', double(21));\n\nconst breads = [\'Sourdough\', \'Rye\', \'Focaccia\'];\nbreads.forEach((bread) => {\n\tconsole.log(`Fresh today: ${bread}`);\n});\n\nconst prices = [12, 4, 30, 9];\nconsole.log(\'Sorted as text:\', [...prices].sort());\nconsole.log(\'Sorted as numbers:\', [...prices].sort((a, b) => a - b));\n\nconst status = document.querySelector(\'#status\');\ndocument.querySelector(\'#bake\').addEventListener(\'click\', () => {\n\tstatus.textContent = \'Baking... (2 seconds)\';\n\tsetTimeout(() => {\n\t\tstatus.textContent = \'Your bread is ready!\';\n\t\tconsole.log(\'Ding!\');\n\t}, 2000);\n});\n'"
	show-console
	preview-height="100px"
/>

(The `[...prices]` makes a copy of the list first, so both sort lines start from the original order. You'll learn that `...` trick in [Destructuring and Spread](/lessons/javascript/destructuring-and-spread).)

## Try it yourself

1. Press the button and watch the status change after two seconds. Then change the delay to 500.
2. Change the numeric sort so it puts the largest price first.
3. Write an arrow function `const triple = (number) => number * 3;` and log `triple(7)`. Then add curly braces around the body without adding `return`, and see what it logs.

## Check your understanding

<Quiz
	question="What does this log? const half = (n) => { n / 2 }; console.log(half(10));"
	:options="['5', '10', 'undefined', 'An error']"
	:answer-index="2"
	explanation="The curly braces make it a normal block, so the implicit return is gone. Without return, the function gives back undefined."
/>

<Quiz
	question="What is a callback?"
	:options="['A function that calls itself', 'A function you pass to another function, which calls it later', 'A phone call from the server', 'A function with no parameters']"
	:answer-index="1"
	explanation="A callback is handed to another function, like addEventListener or setTimeout, which decides when to run it."
/>

<Quiz
	question="What does [10, 9, 1].sort() return?"
	:options="['[1, 9, 10]', '[10, 9, 1]', '[1, 10, 9]', '[9, 10, 1]']"
	:answer-index="2"
	explanation="Without a compare function, sort compares values as text, and the text 10 comes before 9. Use sort((a, b) => a - b) for numbers."
/>

## Up next

Your functions are getting powerful. But where can each variable actually be *seen* from, and how can a function remember something after it's finished running? That's [Scope and Closures](/lessons/javascript/scope-and-closures).
