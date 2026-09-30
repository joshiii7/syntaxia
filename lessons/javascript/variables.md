---
title: "JavaScript Variables: let vs const, and Why Not var"
description: "Store values in JavaScript variables with let and const, learn when each one fits, how to name variables well, and why old code uses var and you shouldn't."
---

# Variables: let and const

*A variable is a labeled jar. You put something in, and the label lets you find it again later.*

So far, every value in your code has been used once and forgotten. `console.log('Maria')` prints the name, and then it's gone. If you wanted it again, you'd have to type it again.

Real programs need to *remember* things: a visitor's name, the number of items in a cart, whether dark mode is on. That's what variables are for.

## Labeled jars

Picture a kitchen shelf full of jars. Each jar has a label: "Flour," "Sugar," "Coffee." When a recipe says "add two spoons of sugar," you don't need to know what the sugar looks like or where it came from. You find the jar labeled "Sugar."

A **variable** is a labeled jar for a value:

```js
let visitorName = 'Maria';
```

- `let` says "I'm making a new jar."
- `visitorName` is the label.
- `=` means "put this in the jar." (It doesn't mean "equals" like in math. Read it as "gets.")
- `'Maria'` is what goes inside.

Now you can use the label anywhere, and JavaScript fetches what's inside:

```js
console.log(visitorName);          // Maria
console.log('Hello, ' + visitorName);  // Hello, Maria
```

## `let`: a jar you can refill

Values stored with `let` can be replaced later:

```js
let cartCount = 0;
console.log(cartCount);   // 0

cartCount = 3;            // no "let" this time: the jar already exists
console.log(cartCount);   // 3
```

Notice you only write `let` once, when you first create the jar. After that, you just use the label. Writing `let cartCount` a second time is an error, like trying to put up a second shelf label that says the same thing.

## `const`: a jar with the lid glued on

```js
const bakeryName = "Maria's Bakery";
```

`const` (short for "constant") creates a jar whose contents can't be swapped out. Try it and JavaScript refuses:

```js
bakeryName = 'Some Other Bakery';
// TypeError: Assignment to constant variable.
```

That sounds limiting, but it's actually a gift. When you see `const`, you know that value stays the same everywhere below. One less thing to keep track of while reading code.

So which should you use? Here's the rule most professional developers follow:

**Use `const` by default. Switch to `let` only when you know the value needs to change.**

A counter that goes up? `let`. A score, a running total, the current step in a slideshow? `let`. Almost everything else, like a name, a found element, a price list, a settings object? `const`.

(One detail you'll meet later: a `const` jar can hold a list or an object whose *contents* change. The glue stops you swapping the whole jar's contents, not rearranging what's inside. You'll see this in [Arrays](/lessons/javascript/arrays).)

## Creating now, filling later

You can make a `let` jar without putting anything in it yet:

```js
let favoriteBread;
console.log(favoriteBread);   // undefined
```

`undefined` is JavaScript's way of saying "this jar exists, but it's empty." A `const` can't be left empty, since you'd never be allowed to fill it.

## Naming your jars

Good names make code read almost like English. A few rules and habits:

- Names can contain letters, digits, `_`, and `$`, but **can't start with a digit**. `total2` is fine; `2total` isn't.
- No spaces or hyphens. `visitor-name` would be read as "visitor minus name."
- JavaScript uses **camelCase**: the first word lowercase, every following word capitalized. `visitorName`, `cartCount`, `isDarkMode`.
- Some words are reserved, because JavaScript already uses them: `let`, `const`, `if`, `function`, `class`, and a few dozen more.
- Names are case-sensitive: `price` and `Price` are two different jars.

And the most important habit: **say what's inside.** Compare:

```js
let x = 3;           // three what?
let loavesLeft = 3;  // ah, three loaves left
```

Code is read far more often than it's written. A few extra letters now save a lot of head-scratching later.

## What about `var`?

You'll see a third keyword in older tutorials and codebases:

```js
var total = 0;
```

`var` was the only option before 2015. It still works, but it has some confusing behaviors: it ignores the curly-brace blocks you'll meet in the next few lessons, you can accidentally declare the same name twice without any warning, and it can be used before the line that creates it (you just get `undefined`). `let` and `const` fixed all of that.

You'll learn exactly why in [Scope and Closures](/lessons/javascript/scope-and-closures). For now, the rule is simple: recognize `var` when you see it, but write `let` and `const`.

## Try it

This one only prints to the console, so there's no preview to look at.

<WebPlayground
	:panes="['javascript']"
	initial-html=""
	:initial-js="'const bakeryName = \'Maria\\\'s Bakery\';\nlet loavesLeft = 12;\n\nconsole.log(bakeryName, \'has\', loavesLeft, \'loaves left.\');\n\n// A customer buys 3 loaves.\nloavesLeft = loavesLeft - 3;\nconsole.log(\'Now there are\', loavesLeft, \'left.\');\n\nlet favoriteBread;\nconsole.log(\'Favorite bread:\', favoriteBread);\n'"
	show-console
	hide-preview
/>

## Try it yourself

1. Another customer buys 4 loaves. Add a line that updates `loavesLeft`, then log the new number.
2. Try changing `bakeryName` to a new name on a later line. Read the error in the console. Then change `const` to `let` on the first line and try again. Which one should a bakery's name really be?
3. Give `favoriteBread` a value, like `'Sourdough'`, on its own line after it's created. Run it again.

## Check your understanding

<Quiz
	question="You need a variable that counts how many times a button was clicked. Which keyword fits?"
	:options="['const', 'let', 'var', 'count']"
	:answer-index="1"
	explanation="The count changes every click, so it needs let. const is for values that never get reassigned."
/>

<Quiz
	question="What does this print? let bread; console.log(bread);"
	:options="['bread', 'null', 'undefined', 'An error']"
	:answer-index="2"
	explanation="The variable exists but nothing has been put in it yet, so its value is undefined."
/>

<Quiz
	question="Which is a valid JavaScript variable name?"
	:options="['2ndPlace', 'second-place', 'secondPlace', 'second place']"
	:answer-index="2"
	explanation="Names can't start with a digit or contain hyphens or spaces. camelCase like secondPlace is the convention."
/>

## Up next

Your jars can hold a name, a number, or nothing at all. But what kinds of things *can* go in them, and how does JavaScript tell them apart? That's [Numbers, Strings, and Booleans](/lessons/javascript/data-types).
