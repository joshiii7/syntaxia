---
title: "JavaScript if, else, switch, and the Ternary Operator"
description: "Make your code choose what to do with if, else if, and else, match exact cases with switch, write short choices with the ternary operator, and avoid common traps."
---

# Making Decisions: if, else, and switch

*Code that always does the same thing is a vending machine with one button. Decisions give it a menu.*

Every morning you make small decisions without thinking. Is it raining? Take an umbrella. Is it cold? Grab a jacket. Is it a weekday? Set an alarm. Otherwise, sleep in.

Your code needs to make decisions like that too. Is the shop open? Show the "Order now" button. Is the cart empty? Show a friendly message instead of a total. That's what this lesson is about.

## `if`: do this only when...

```js
const hour = 9;

if (hour >= 7) {
	console.log('The bakery is open!');
}
```

Read it as English: "**If** the hour is 7 or later, log that the bakery is open."

- The **condition** goes in parentheses. It's anything that gives a yes or no, like the comparisons from [Operators and Comparisons](/lessons/javascript/operators).
- The code to run goes inside the **curly braces**, called a **block**. It only runs when the condition is truthy.

## `else`: otherwise...

```js
if (hour >= 7) {
	console.log('The bakery is open!');
} else {
	console.log('Sorry, we open at 7.');
}
```

Exactly one of the two blocks runs. Never both, never neither. It's a fork in the road.

## `else if`: more than two roads

```js
const hour = 18;

if (hour < 7) {
	console.log('Not open yet.');
} else if (hour < 17) {
	console.log('Open!');
} else {
	console.log('Closed for the day.');
}
```

JavaScript checks each condition **in order, from the top**, and runs the first block whose condition is true. Then it skips the rest. Picture going through a checklist and stopping at the first "yes."

That "first match wins" rule means order matters. If you checked `hour < 17` before `hour < 7`, a 5am visitor would be told the shop is open, because 5 is also less than 17.

## Checking several things at once

Combine conditions with the `&&` and `||` from the last lesson:

```js
const hour = 10;
const isHoliday = false;

if (hour >= 7 && hour < 17 && !isHoliday) {
	console.log('Come on in!');
}
```

And remember truthy and falsy? You can check whether a value "exists" directly:

```js
const typedName = '';

if (typedName) {
	console.log(`Welcome, ${typedName}!`);
} else {
	console.log('Please enter your name.');
}
```

An empty string is falsy, so the `else` runs.

## `switch`: matching exact values

When you're comparing one value against a list of specific options, a long chain of `else if` gets repetitive. `switch` reads more like a menu:

```js
const day = 'Saturday';

switch (day) {
	case 'Saturday':
	case 'Sunday':
		console.log('Weekend hours: 8am to 2pm.');
		break;
	case 'Monday':
		console.log('Closed on Mondays.');
		break;
	default:
		console.log('Weekday hours: 7am to 5pm.');
}
```

- `switch (day)` names the value to check.
- Each `case` is one possible value. It compares with `===`, so types must match.
- `default` runs when no case matches, like the final `else`.
- `break` means "I'm done, leave the switch."

That `break` is the famous trap. Leave it out, and JavaScript doesn't stop at the end of the matching case. It **falls through** and runs the next case's code too, and the next, until it hits a `break` or the end. Sometimes you want that on purpose, like `'Saturday'` and `'Sunday'` sharing one answer above. Most of the time, a missing `break` is a bug.

## The ternary: a one-line choice

For small either-or choices, especially when you're picking between two values, there's a shortcut:

```js
const loavesLeft = 0;
const label = loavesLeft > 0 ? 'In stock' : 'Sold out';
console.log(label);   // 'Sold out'
```

Read it as a question: "Are there loaves left? If yes, `'In stock'`. If no, `'Sold out'`." The pattern is `condition ? valueIfTrue : valueIfFalse`. It's called the **ternary** operator because it has three parts.

Use it for simple choices between two values. If you find yourself nesting one ternary inside another, switch back to `if` and `else`. Clear beats clever.

## Always use the braces

JavaScript lets you leave off the curly braces when a block has just one line:

```js
if (hour >= 7) console.log('Open!');
```

It works, but it's a trap waiting for the day someone adds a second line and expects it to be part of the `if`. It won't be. Always write the braces. Your future self will thank you.

## Try it

This bakery sign uses the current hour on your computer, so the answer depends on when you run it.

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<p id=\'sign\'>Checking the hours...</p>'"
	:initial-js="'const hour = new Date().getHours();   // 0 to 23, from your clock\nconst day = \'Tuesday\';\n\nlet message;\n\nif (day === \'Monday\') {\n\tmessage = \'Closed on Mondays.\';\n} else if (hour < 7) {\n\tmessage = \'Not open yet. We open at 7am.\';\n} else if (hour < 17) {\n\tmessage = \'Open now! Come on in.\';\n} else {\n\tmessage = \'Closed for the day. See you tomorrow.\';\n}\n\ndocument.querySelector(\'#sign\').textContent = message;\nconsole.log(\'Hour:\', hour, \'Message:\', message);\n\nconst loavesLeft = 3;\nconsole.log(loavesLeft > 0 ? \'In stock\' : \'Sold out\');\n'"
	show-console
	preview-height="80px"
/>

## Try it yourself

1. Replace `new Date().getHours()` with a fixed number, like `6`, then `12`, then `20`, and check each message.
2. Change `day` to `'Monday'`. Which block runs, and why doesn't the hour matter anymore?
3. Rewrite the day check as a `switch` with a special message for `'Saturday'`. Then remove one `break` on purpose and see what falls through.

## Check your understanding

<Quiz
	question="In an if / else if / else chain, how many blocks run?"
	:options="['All the ones whose condition is true', 'Exactly one: the first whose condition is true, or else', 'Only the else', 'None, unless every condition is true']"
	:answer-index="1"
	explanation="JavaScript checks from the top and runs only the first matching block, then skips the rest."
/>

<Quiz
	question="What happens if you forget break at the end of a case in a switch?"
	:options="['Nothing, break is optional decoration', 'The code falls through and also runs the next case', 'The switch starts over', 'JavaScript shows a syntax error']"
	:answer-index="1"
	explanation="Without break, execution continues into the following case until it reaches a break or the end of the switch."
/>

<Quiz
	question="What does this give? const label = 0 > 1 ? 'yes' : 'no';"
	:options="['\'yes\'', '\'no\'', 'true', 'false']"
	:answer-index="1"
	explanation="0 > 1 is false, so the ternary returns the value after the colon."
/>

## Up next

Decisions let your code choose. Next, you'll make it repeat: counting down, going through every item in a list, doing something until a condition changes. That's [Loops](/lessons/javascript/loops).
