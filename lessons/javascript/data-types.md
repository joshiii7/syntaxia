---
title: "JavaScript Data Types: Numbers, Strings, Booleans, null"
description: "Learn JavaScript's basic types: numbers, strings, template literals, booleans, undefined, and null, check them with typeof, and convert safely between them."
---

# Numbers, Strings, and Booleans

*A jar of flour and a jar of eggs are both jars. What you can do with what's inside is completely different.*

In [Variables: let and const](/lessons/javascript/variables), you put names and numbers into jars. JavaScript treats those very differently. You can do math with a number. You can't do math with a name. And when you mix them up, JavaScript does some surprising things.

Every value in JavaScript has a **type**, a kind. Knowing the type tells you what you can do with it. This lesson covers the everyday ones.

## Numbers

```js
const loaves = 12;
const price = 4.5;
const temperature = -3;
```

JavaScript has one number type for everything: whole numbers, decimals, negatives. No quotes. You can do the math you'd expect:

```js
console.log(price * 2);   // 9
console.log(loaves / 4);  // 3
```

There's one famous surprise worth knowing about early:

```js
console.log(0.1 + 0.2);   // 0.30000000000000004
```

Computers store decimals in binary, and some decimals (like 0.1) can't be stored exactly, the same way 1/3 can't be written exactly as 0.333... This isn't a JavaScript bug; almost every programming language does it. For money, the usual fix is to work in whole cents (`450` instead of `4.5`) and only divide by 100 when you display the price.

Two special number values show up when math goes wrong:

- `NaN` means "Not a Number," the result of math that makes no sense, like `'bread' * 2`.
- `Infinity` comes from dividing by zero: `1 / 0`.

(There's also a second, rarely needed number type called **BigInt**, written with an `n` on the end, like `10n`, for whole numbers too huge for normal numbers. You'll only see it mentioned once more, in the next lesson's list of falsy values.)

## Strings

A **string** is text, a string of characters, wrapped in quotes:

```js
const bread = 'Sourdough';
const greeting = "Good morning";
```

Single quotes and double quotes work exactly the same. Pick one and stay consistent; this book uses single quotes. Switch to the other kind when your text contains a quote mark, or put a backslash in front of it:

```js
const bakery = "Maria's Bakery";
const sameBakery = 'Maria\'s Bakery';
```

### Template literals: strings with slots

The third kind of quote, the **backtick** (`` ` ``, usually under the Esc key), creates a **template literal**. It lets you drop values straight into the text with `${...}`:

```js
const name = 'Maria';
const loaves = 12;

console.log(`${name} baked ${loaves} loaves today.`);
// Maria baked 12 loaves today.
```

Think of a fill-in-the-blank form letter: "Dear ___, your order of ___ is ready." Template literals are that form letter, and `${}` marks each blank. Anything inside the `${}` is run as JavaScript, so `${loaves * 2}` works too. Template literals can also span several lines.

Before template literals existed, people glued strings together with `+`:

```js
console.log(name + ' baked ' + loaves + ' loaves today.');
```

It works, but it's easy to forget a space. Prefer template literals.

### Length

Every string knows how long it is:

```js
console.log('Sourdough'.length);   // 9
```

You'll learn many more string tools in [Strings and Regular Expressions](/lessons/javascript/strings-and-regex).

## Booleans

A **boolean** is the simplest type there is. It has exactly two possible values: `true` and `false`. No quotes.

```js
const isOpen = true;
const isSoldOut = false;
```

Think of a light switch: on or off, nothing in between. Booleans are how programs make decisions, which you'll do a lot of in [Making Decisions: if, else, and switch](/lessons/javascript/conditionals). Naming them like a yes-or-no question (`isOpen`, `hasDiscount`, `canOrder`) makes that code read beautifully.

## `undefined` and `null`: two kinds of nothing

- `undefined` means "nothing has been put here yet." You saw it with an empty `let` jar.
- `null` means "I'm deliberately saying there's nothing here." You set it on purpose, like writing "none" on a form instead of leaving the box blank.

You also saw `null` from `document.querySelector()` when it couldn't find anything. That's the browser telling you, on purpose, "there's no such element."

## Checking a type: `typeof`

```js
console.log(typeof 42);          // 'number'
console.log(typeof 'Maria');     // 'string'
console.log(typeof true);        // 'boolean'
console.log(typeof undefined);   // 'undefined'
console.log(typeof null);        // 'object'  (wait, what?)
```

That last one is a real mistake from JavaScript's first version in 1995. Fixing it would have broken existing websites, so it stayed. `null` is not an object; `typeof` just says it is. Every JavaScript developer learns this one eventually. Now you have.

## When types collide

Here's where types start to matter. Try to guess before you read the answers:

```js
console.log('5' + 3);   // '53'
console.log('5' - 3);   // 2
console.log('5' * '2'); // 10
```

The `+` sign does double duty: it adds numbers, but it **joins** strings. When one side is a string, JavaScript turns the other side into a string too and glues them: `'5' + 3` becomes `'53'`. The `-`, `*`, and `/` signs only do math, so JavaScript turns the strings into numbers instead.

This bites people constantly with form inputs, because **everything typed into a form field arrives as a string**, even if the visitor typed digits. Add `'2'` loaves to `3` loaves and you get `'23'` loaves.

The fix is to convert on purpose:

```js
const typed = '2';
const loaves = Number(typed);    // 2, a real number now
console.log(loaves + 3);         // 5

console.log(Number('bread'));    // NaN: it couldn't convert
console.log(String(42));         // '42'
```

Converting deliberately, instead of letting JavaScript guess, is one of the habits that separates buggy code from reliable code.

## Try it

<WebPlayground
	:panes="['javascript']"
	initial-html=""
	:initial-js="'const name = \'Maria\';\nconst loaves = 12;\nconst price = 4.5;\nconst isOpen = true;\n\nconsole.log(`${name} baked ${loaves} loaves at $${price} each.`);\nconsole.log(\'Open today?\', isOpen);\n\nconsole.log(typeof loaves, typeof name, typeof isOpen);\n\n// A value typed into a form field is always a string:\nconst typedAmount = \'2\';\nconsole.log(\'Glued:\', typedAmount + loaves);\nconsole.log(\'Added:\', Number(typedAmount) + loaves);\n\nconsole.log(0.1 + 0.2);\n'"
	show-console
	hide-preview
/>

## Try it yourself

1. Add a template literal that prints the total cost of all the loaves: `` `Total: $${loaves * price}` ``.
2. Change `typedAmount` to `'two'`. What does `Number('two')` give you?
3. Log `typeof null` and `typeof undefined` and compare them.

## Check your understanding

<Quiz
	question="What does '5' + 3 produce in JavaScript?"
	:options="['8', '\'53\'', 'NaN', 'An error']"
	:answer-index="1"
	explanation="When either side of + is a string, JavaScript joins them as text, so the result is the string 53."
/>

<Quiz
	question="Which line uses a template literal correctly?"
	:options="['\'Hello, ${name}\'', '`Hello, ${name}`', '\'Hello, \' + {name}', '`Hello, $name`']"
	:answer-index="1"
	explanation="Template literals use backticks, and each value goes inside ${ }. Regular quotes print ${name} as plain text."
/>

<Quiz
	question="A visitor types 4 into a quantity field. What type is the value your code receives?"
	:options="['A number', 'A string', 'A boolean', 'undefined']"
	:answer-index="1"
	explanation="Form fields always give you strings. Convert with Number() before doing math."
/>

## Up next

You can store values and know what kind they are. Next, you'll combine and compare them, and meet the difference between `==` and `===` that trips up almost every beginner, in [Operators and Comparisons](/lessons/javascript/operators).
