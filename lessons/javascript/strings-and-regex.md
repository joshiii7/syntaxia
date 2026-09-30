---
title: "JavaScript String Methods and Regular Expressions Basics"
description: "Work with text in JavaScript: trim, change case, search, slice, split, and replace strings, then match patterns with beginner-friendly regular expressions."
---

# Strings and Regular Expressions

*Text is the raw material of the web. These are the scissors, the highlighter, and the stencil for shaping it.*

Almost everything a visitor gives you is text: a name, an email address, a search term, a voucher code. And almost none of it arrives in the shape you'd like. There are extra spaces, random capital letters, dashes where you didn't expect them.

In [Numbers, Strings, and Booleans](/lessons/javascript/data-types) you met strings and template literals. This lesson gives you the tools to clean them up, search them, and check whether they match a pattern.

## Strings can't be changed, only replaced

One idea first, because it explains how every string method works. Strings are **immutable**: once made, they never change. String methods never alter the original. They always hand you back a **new** string:

```js
const shout = 'hello';
shout.toUpperCase();
console.log(shout);   // 'hello': unchanged

const louder = shout.toUpperCase();
console.log(louder);  // 'HELLO'
```

If a string method seems to "do nothing," check that you stored the result.

## Cleaning up

```js
const typed = '   Maria Santos  ';

console.log(typed.trim());          // 'Maria Santos'
console.log('RYE'.toLowerCase());   // 'rye'
console.log('rye'.toUpperCase());   // 'RYE'
```

`trim` removes spaces (and tabs and line breaks) from both ends. Trimming form input before you check or save it is a habit worth building now: people accidentally type trailing spaces all the time, especially on phones.

## Searching

```js
const email = 'maria@example.com';

console.log(email.includes('@'));          // true
console.log(email.startsWith('maria'));    // true
console.log(email.endsWith('.com'));       // true
console.log(email.indexOf('@'));           // 5
```

These are all **case-sensitive**: `'Rye'.includes('rye')` is `false`. For a case-insensitive search, lowercase both sides first: `text.toLowerCase().includes(search.toLowerCase())`.

## Cutting and splitting

Strings are numbered from 0, just like arrays, and many array ideas carry over:

```js
const code = 'ABC1234';

console.log(code[0]);            // 'A'
console.log(code.length);        // 7
console.log(code.slice(0, 3));   // 'ABC'
console.log(code.slice(3));      // '1234'
console.log(code.slice(-2));     // '34': negative counts from the end
```

`split` cuts a string into an array wherever a separator appears, and `join` (from [Arrays](/lessons/javascript/arrays)) glues an array back into a string:

```js
const tags = 'sourdough, vegan, weekend';
const list = tags.split(', ');   // ['sourdough', 'vegan', 'weekend']
console.log(list.join(' | '));   // 'sourdough | vegan | weekend'
```

## Replacing

```js
const sentence = 'Rye, rye, and more rye';

console.log(sentence.replace('rye', 'sourdough'));
// 'Rye, sourdough, and more rye': only the first match

console.log(sentence.replaceAll('rye', 'sourdough'));
// 'Rye, sourdough, and more sourdough'
```

`replace` changes only the **first** match. `replaceAll` changes every match. Notice both left the capital `Rye` alone. For smarter matching, like "any capitalization," you need a pattern.

## Padding

```js
console.log('7'.padStart(3, '0'));   // '007'
console.log('Rye'.padEnd(10, '.') + '$7');   // 'Rye.......$7'
```

Handy for order numbers, receipts, and anything that needs to line up.

## Regular expressions: describing a pattern

Back in [Form Validation](/lessons/html/form-validation), you wrote `pattern="[A-Z]{3}[0-9]{4}"` and were promised you'd meet these properly in JavaScript. Here they are.

A **regular expression** (or **regex**) describes the *shape* of some text, not the exact text. Think of a stencil: it doesn't care which paint you use, only that it fits the cut-out shape. "Three capital letters then four digits" is a shape. `ABC1234` fits it. So does `XYZ9876`. `abc1234` doesn't.

In JavaScript, a regex goes between two forward slashes:

```js
const productCode = /^[A-Z]{3}[0-9]{4}$/;

console.log(productCode.test('ABC1234'));   // true
console.log(productCode.test('abc1234'));   // false
console.log(productCode.test('ABC12345'));  // false
```

`.test()` answers the question "does this text fit the stencil?" with `true` or `false`.

### Reading a pattern

Here are the pieces you'll use most. You don't need to memorize them; you need to be able to look one up and read it.

| Piece | Means | Example matches |
|---|---|---|
| `abc` | exactly these characters | `abc` |
| `[A-Z]` | any one capital letter | `R` |
| `[0-9]` or `\d` | any one digit | `7` |
| `[a-z0-9]` | any one lowercase letter or digit | `q`, `4` |
| `\s` | a space, tab, or line break | ` ` |
| `.` | any character at all | `x`, `%` |
| `{3}` | exactly 3 of the previous piece | `[0-9]{3}`: `123` |
| `+` | one or more of the previous piece | `\d+`: `7`, `2026` |
| `*` | zero or more | `\d*`: nothing, `42` |
| `?` | optional: zero or one | `colou?r`: `color`, `colour` |
| `^` | the very start of the text | |
| `$` | the very end of the text | |

So `/^[A-Z]{3}[0-9]{4}$/` reads as: "start, three capital letters, four digits, end."

### Why `^` and `$` matter

Without them, a regex only has to match **somewhere** in the text:

```js
console.log(/[0-9]{4}/.test('abc12345xyz'));    // true: '1234' is in there
console.log(/^[0-9]{4}$/.test('abc12345xyz'));  // false: the whole thing must fit
```

When you're checking a whole answer, like a code or a postcode, always anchor it with `^` and `$`. (The HTML `pattern` attribute adds those for you, which is why you didn't need them there.)

### Flags: `i` and `g`

Letters after the closing slash change how the pattern behaves:

- `i`: ignore case. `/rye/i` matches `rye`, `Rye`, and `RYE`.
- `g`: global, meaning every match rather than just the first.

```js
const sentence = 'Rye, rye, and more RYE';
console.log(sentence.replace(/rye/gi, 'sourdough'));
// 'sourdough, sourdough, and more sourdough'
```

`replaceAll` works with patterns too, but only with the `g` flag: `sentence.replaceAll(/rye/gi, 'sourdough')`. Without `g`, it throws an error.

### Don't overdo it

Regular expressions are powerful, and it's tempting to reach for them everywhere. But a long regex is very hard to read, and hard to fix. If a simple `includes`, `startsWith`, or `split` does the job, use that. And for truly complex formats, especially email addresses, a perfect regex doesn't exist. Use `type="email"` and a server check instead of trying to write one.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<label for=\'code\'>Voucher code</label>\n<input id=\'code\' value=\'  abc1234 \'>\n<p id=\'result\'></p>'"
	:initial-js="'const input = document.querySelector(\'#code\');\nconst result = document.querySelector(\'#result\');\nconst voucherPattern = /^[A-Z]{3}[0-9]{4}$/;\n\nfunction checkCode() {\n\tconst cleaned = input.value.trim().toUpperCase();\n\tconst isValid = voucherPattern.test(cleaned);\n\tresult.textContent = isValid\n\t\t? `${cleaned} looks right!`\n\t\t: `${cleaned || \'(empty)\'} should be three letters and four digits, like ABC1234.`;\n}\n\ninput.addEventListener(\'input\', checkCode);\ncheckCode();\n\n// A few more tools\nconst tags = \'sourdough, vegan, weekend\';\nconsole.log(tags.split(\', \'));\nconsole.log(\'7\'.padStart(3, \'0\'));\nconsole.log(\'Rye, rye, and more RYE\'.replace(/rye/gi, \'sourdough\'));\n'"
	show-console
	preview-height="110px"
/>

(`addEventListener('input', ...)` runs `checkCode` every time the text changes. You'll learn events properly in [Events](/lessons/javascript/events).)

## Try it yourself

1. Type a few codes into the box: `xyz9876`, `AB12345`, `abcd123`. Which ones pass, and why does lowercase work here?
2. Change the pattern so codes can have an optional dash in the middle, like `ABC-1234`. (Hint: `-?`.)
3. Log `'   Maria  '.length` and `'   Maria  '.trim().length` to see how many spaces were hiding.

## Check your understanding

<Quiz
	question="const s = 'bread'; s.toUpperCase(); console.log(s); What is logged?"
	:options="['BREAD', 'bread', 'Bread', 'undefined']"
	:answer-index="1"
	explanation="Strings are immutable. toUpperCase returns a new string, but the result was never stored, so s is unchanged."
/>

<Quiz
	question="Which regular expression matches exactly four digits and nothing else?"
	:options="['/[0-9]{4}/', '/^[0-9]{4}$/', '/[0-9]+/', '/^[0-9]*$/']"
	:answer-index="1"
	explanation="^ and $ anchor the pattern to the start and end, so the whole text must be exactly four digits."
/>

<Quiz
	question="What does 'a-b-c'.split('-') return?"
	:options="['\'abc\'', '[\'a\', \'b\', \'c\']', '[\'a-b-c\']', '3']"
	:answer-index="1"
	explanation="split cuts the string at every dash and returns the pieces as an array."
/>

## Up next

Text is also how data travels between browsers and servers, in a special format with curly braces you saw in the Meta Tags lesson. Next up: [JSON](/lessons/javascript/json).
