---
title: "JavaScript Operators: == vs ===, Truthy, Falsy, and ??"
description: "Do math and comparisons in JavaScript, learn why === beats ==, which values are truthy or falsy, and how &&, ||, and ?? combine conditions and set defaults."
---

# Operators and Comparisons

*Operators are the verbs of JavaScript: add, compare, combine. One of them has a famous evil twin.*

You've got values in jars. Now you want to *do* things with them: add up a cart, check whether a shop is open, decide whether someone gets free delivery. The symbols that do that work, like `+`, `>`, and `===`, are called **operators**.

Most of them behave exactly like you'd expect from math class. A couple of them don't, and those are the ones this lesson spends the most time on.

## Arithmetic

```js
console.log(10 + 3);   // 13
console.log(10 - 3);   // 7
console.log(10 * 3);   // 30
console.log(10 / 3);   // 3.3333333333333335
console.log(10 % 3);   // 1   (remainder)
console.log(2 ** 3);   // 8   (2 to the power of 3)
```

The one that looks unfamiliar is `%`, the **remainder** operator. `10 % 3` means "divide 10 by 3 and tell me what's left over": 3 goes into 10 three times, with 1 left over. It's surprisingly handy. `number % 2 === 0` is how you check whether a number is even, like the odd and even rows you striped with `:nth-child` in CSS.

Math follows the usual order: multiplication and division before addition and subtraction. Use parentheses when you want something else, or just to make it clearer: `(price + tax) * quantity`.

## Shortcuts for updating a variable

```js
let cartCount = 0;

cartCount = cartCount + 1;   // the long way
cartCount += 1;              // the same thing, shorter
cartCount++;                 // add exactly 1

let total = 20;
total -= 5;    // 15
total *= 2;    // 30
```

You'll see `+=` and `++` all over real code, especially in counters and loops.

## Comparing values

Comparison operators ask a yes-or-no question, and the answer is always a boolean:

```js
console.log(5 > 3);    // true
console.log(5 < 3);    // false
console.log(5 >= 5);   // true
console.log(4 <= 3);   // false
```

## `===` versus `==`: the evil twin

To check whether two values are the same, use **three** equals signs:

```js
console.log(5 === 5);        // true
console.log('5' === 5);      // false: a string is not a number
console.log('bread' !== 'cake');  // true: !== means "not equal"
```

`===` is **strict equality**. It says yes only if the two values are the same *and* the same type.

JavaScript also has a two-equals version, `==`, called loose equality. It tries to be helpful by converting types before comparing. Watch what that "help" does:

```js
console.log('5' == 5);       // true
console.log(0 == '');        // true
console.log(0 == false);     // true
console.log(null == undefined);  // true
```

Picture a bouncer checking names at the door. The strict bouncer (`===`) checks your name *and* your photo ID. The loose bouncer (`==`) squints and says "close enough." `'5' == 5` gets you in. So does an empty string pretending to be zero. That's how bugs sneak through.

The rule is simple, and nearly every professional team follows it: **always use `===` and `!==`.** You'll see `==` in older code. Now you know why it's risky.

And a reminder from [Variables](/lessons/javascript/variables): a single `=` isn't a comparison at all. It puts a value into a jar. Writing `=` when you meant `===` is one of the most common typos in all of programming.

## Combining conditions: `&&`, `||`, and `!`

```js
const isOpen = true;
const hasBread = false;

console.log(isOpen && hasBread);   // false: AND needs both
console.log(isOpen || hasBread);   // true: OR needs at least one
console.log(!hasBread);            // true: NOT flips it
```

- `&&` (AND): true only if **both** sides are true. "The shop is open *and* has bread."
- `||` (OR): true if **either** side is true. "Pay by card *or* cash."
- `!` (NOT): flips true to false and false to true.

## Truthy and falsy

Here's something that surprises everyone. JavaScript will happily treat *any* value as if it were a boolean when it needs a yes or no. Most values count as "yes." These eight count as "no," and they're called **falsy**:

- `false`
- `0` (and `-0`)
- `0n` (a BigInt zero, rare)
- `''` (an empty string)
- `null`
- `undefined`
- `NaN`

Everything else is **truthy**, including some that catch people out: `'0'` (a string with a zero in it), `'false'` (the word, in quotes), and empty lists and objects, which you'll meet soon.

This is why you'll often see checks like `if (name)` meaning "if a name was actually entered." An empty string is falsy, so an empty name counts as "no."

## Defaults with `||` and `??`

`&&` and `||` do something sneaky: they don't just return `true` or `false`. They return one of the two values themselves. That makes `||` a handy way to fall back to a default:

```js
const typedName = '';
const displayName = typedName || 'Guest';
console.log(displayName);   // 'Guest'
```

"Use the typed name, or if it's falsy, use 'Guest'." But there's a trap:

```js
const typedQuantity = 0;
const quantity = typedQuantity || 1;
console.log(quantity);   // 1  (but they asked for 0!)
```

`0` is falsy, so `||` threw it away. For cases like this, use `??`, the **nullish coalescing** operator. It only falls back when the value is `null` or `undefined`, not for `0` or an empty string:

```js
const quantity = typedQuantity ?? 1;
console.log(quantity);   // 0
```

A rule of thumb: use `??` for defaults when `0`, `''`, or `false` are valid answers. Use `||` when any falsy value should be replaced.

## Try it

<WebPlayground
	:panes="['javascript']"
	initial-html=""
	:initial-js="'const loaves = 7;\nconsole.log(\'Even number of loaves?\', loaves % 2 === 0);\n\n// Strict versus loose equality\nconsole.log(\'5 === 5:\', 5 === 5);\nconsole.log(\'\\\'5\\\' === 5:\', \'5\' === 5);\nconsole.log(\'\\\'5\\\' == 5:\', \'5\' == 5);\nconsole.log(\'0 == \\\'\\\':\', 0 == \'\');\n\n// Combining conditions\nconst isOpen = true;\nconst hasBread = loaves > 0;\nconsole.log(\'Can I buy bread?\', isOpen && hasBread);\n\n// Defaults\nconst typedQuantity = 0;\nconsole.log(\'With ||:\', typedQuantity || 1);\nconsole.log(\'With ??:\', typedQuantity ?? 1);\n'"
	show-console
	hide-preview
/>

## Try it yourself

1. Change `loaves` to `8` and check the even-number line again.
2. Add a line that logs whether `null == undefined` and whether `null === undefined`. Why are they different?
3. Set `typedQuantity` to `null` and compare the `||` and `??` lines. Then try `''`.

## Check your understanding

<Quiz
	question="What does '5' === 5 evaluate to?"
	:options="['true', 'false', '\'55\'', 'An error']"
	:answer-index="1"
	explanation="=== checks the value and the type. One is a string and one is a number, so they are not strictly equal."
/>

<Quiz
	question="Which of these values is truthy?"
	:options="['0', '\'\' (an empty string)', '\'0\' (a string containing zero)', 'null']"
	:answer-index="2"
	explanation="Any non-empty string is truthy, even '0'. The number 0, empty strings, and null are all falsy."
/>

<Quiz
	question="A visitor enters 0 as a tip. Which line keeps their 0 instead of replacing it with 5?"
	:options="['const tip = typedTip || 5;', 'const tip = typedTip ?? 5;', 'const tip = typedTip && 5;', 'const tip = !typedTip;']"
	:answer-index="1"
	explanation="?? only falls back for null or undefined. || treats 0 as falsy and would replace it."
/>

## Up next

Comparisons give you `true` or `false`. Now let's use those answers to make your code choose what to do. That's [Making Decisions: if, else, and switch](/lessons/javascript/conditionals).
