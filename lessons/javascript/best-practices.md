---
title: "JavaScript Best Practices and Common Beginner Mistakes"
description: "Write JavaScript that's easy to read, safe, and accessible: habits professionals rely on, the mistakes almost every beginner makes, and tools that catch them for you."
---

# Best Practices and Common Mistakes

*Code that works today and code you can still understand next year are two different achievements. This lesson is about the second one.*

Look at how far you've come. You can store and shape data, make decisions, build and change the page, react to people, load data from servers, and remember things between visits. That's the whole foundation of front-end JavaScript.

As in the HTML and CSS tracks, the last stretch before the final project is about doing it **well**. JavaScript is even more forgiving than HTML: code full of quiet problems can still appear to work, right up until the day it doesn't. These habits are what keep that day from coming.

## Habits for readable code

**`const` by default, `let` when it changes, never `var`.** When someone reads `const`, they know that value stays put. That's one less thing to track in their head. ([Variables](/lessons/javascript/variables), [Scope and Closures](/lessons/javascript/scope-and-closures).)

**Names that explain themselves.** `const loavesLeft = 3` beats `const x = 3`. Functions get verbs (`calculateTotal`, `showMenu`); booleans read like yes-or-no questions (`isOpen`, `hasDiscount`). If you need a comment to explain what a variable holds, rename the variable instead.

**Small functions that do one job.** If a function is longer than your screen, or its name needs an "and" in it, split it. Small functions are easier to read, test, and reuse. ([Functions](/lessons/javascript/functions).)

**Early returns instead of deep nesting.**

```js
// Hard to follow: the real work is buried three levels deep
function addToCart(product) {
	if (product) {
		if (product.stock > 0) {
			if (!cart.includes(product)) {
				cart.push(product);
			}
		}
	}
}

// Flat: handle the "no" cases first, then do the work
function addToCart(product) {
	if (!product) return;
	if (product.stock === 0) return;
	if (cart.includes(product)) return;
	cart.push(product);
}
```

**Comment the why, not the what.** `// add 1 to count` above `count += 1` tells nobody anything. `// The API counts pages from 1, not 0` saves someone an afternoon.

**Keep the three languages apart.** JavaScript switches classes and attributes; CSS decides what they look like; HTML holds the content and structure. Avoid `element.style` for anything a class could do. ([Where CSS Meets JavaScript](/lessons/css/css-meets-javascript).)

## Habits for safe code

**`===`, always.** The loose `==` "helps" in ways that hide bugs. ([Operators and Comparisons](/lessons/javascript/operators).)

**Convert on purpose.** Form fields, `dataset`, and storage all give you strings. Call `Number()` before doing math. ([Numbers, Strings, and Booleans](/lessons/javascript/data-types).)

**Format for people with `Intl`.** `Intl.NumberFormat` turns `1234.5` into `$1,234.50` (or `1.234,50 €`, depending on the country), and `Intl.DateTimeFormat` does the same for dates. It's more reliable than gluing symbols onto `toFixed` results. ([Functions](/lessons/javascript/functions).)

**`textContent` for anything from outside.** Visitor input and server data never go into `innerHTML`. ([Changing Text, Attributes, and Classes](/lessons/javascript/changing-elements).)

**Handle errors at the edges, and never swallow them.** Wrap parsing, network calls, and storage in `try`/`catch`, and always do something useful in the `catch`. ([Errors and Debugging](/lessons/javascript/errors-and-debugging).)

**The browser is the receptionist, not the security guard.** Anything in front-end code can be read and changed by visitors. Real checks and real secrets live on the server. ([Forms and Custom Validation](/lessons/javascript/forms-with-javascript), [Loading Data with fetch](/lessons/javascript/fetch).)

## Habits for pages people can use

**Real buttons for actions, real links for navigation.** A `<button>` works with the keyboard for free; a clickable `<div>` doesn't. A link goes somewhere; a button does something. ([Events](/lessons/javascript/events).)

**Keep accessible state in sync.** When JavaScript opens something, update `aria-expanded`. When it shows a message, use `aria-live` or `role="status"` so screen readers announce it. When a dialog or error appears, move focus to where the person needs to be.

**Respect motion preferences in JavaScript too.** CSS media queries don't cover animations started from JavaScript. Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` before starting one.

**Progressive enhancement.** Build the page so its content and basic links work even if the JavaScript fails to load on a flaky connection, then layer the interactivity on top, the same idea from [Where HTML Meets CSS and JS](/lessons/html/html-meets-css-and-js).

**Don't block the cook.** Long loops freeze the whole page. Slow work, like loading data, should be `await`ed, never waited on in a loop. ([Timers and the Event Loop](/lessons/javascript/timers-and-the-event-loop).)

## The mistakes everyone makes

Here's a gallery of the bugs almost every beginner writes at least once, with the fix. If you recognize a few, welcome to the club.

| Mistake | What you see | The fix |
|---|---|---|
| `if (total = 0)` | The condition is always false, and `total` gets set to 0 | `===` for comparing, `=` only for assigning |
| `'2' + 3` from a form field | `'23'` instead of `5` | `Number(field.value)` |
| `(x) => { x * 2 }` | `undefined` | Add `return`, or drop the braces |
| A missing `await` | `Promise {...}` instead of data | `await` the promise inside an `async` function |
| A selector typo, or a script running too early | `Cannot read properties of null` | Check the selector; use `defer` |
| `quantity \|\| 1` when 0 is a valid answer | 0 becomes 1 | `quantity ?? 1` |
| Adding a listener inside another listener | The action runs twice, then three times... | Add each listener once, outside |
| `const copy = original` for an array | Changing the copy changes the original | `[...original]` or `structuredClone` |
| `innerHTML` with visitor input | A security hole (XSS) | `textContent`, or `createElement` |
| `setInterval` with no `clearInterval` | Timers that pile up and never stop | Keep the id and clear it |
| Passing `object.method` as a callback | `this` is lost | `() => object.method()` |
| `fetch` without checking `response.ok` | A 404 page treated as real data | `if (!response.ok) throw ...` |

## Tools that catch mistakes for you

You don't have to spot every problem by eye. Professional teams let tools do the boring checking:

- **A formatter**, most often **Prettier**, rewrites your code with consistent spacing and line breaks every time you save. No more debates about style.
- **A linter**, most often **ESLint**, reads your code and warns you about likely bugs: `==` instead of `===`, variables you never use, a `let` that should be `const`, a missing `await`. Many of the mistakes in the table above can be caught this way before you even run the code.
- **Your editor**, set up with both, underlines problems as you type. [Extensions & Customization](/lessons/ide/extensions-and-customization) covers adding them.

## Try it: bug hunt

This little order form "works." Nothing turns red in the console. But it's full of the mistakes from this lesson. How many can you find and fix?

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<p><label for=\'item\'>Item</label> <input id=\'item\' value=\'Sourdough\'></p>\n<p><label for=\'price\'>Price</label> <input id=\'price\' value=\'8\'></p>\n<p><label for=\'qty\'>Quantity</label> <input id=\'qty\' value=\'2\'></p>\n<p><label for=\'discount\'>Discount %</label> <input id=\'discount\' value=\'0\'></p>\n<button type=\'button\' id=\'add\'>Add to order</button>\n<p id=\'output\'></p>\n<p id=\'total\'></p>'"
	:initial-js="'var total = 0;\nvar x = document.querySelector(\'#output\');\n\ndocument.querySelector(\'#add\').addEventListener(\'click\', function () {\n\tvar item = document.querySelector(\'#item\').value;\n\tvar price = document.querySelector(\'#price\').value;\n\tvar qty = document.querySelector(\'#qty\').value;\n\tvar discount = Number(document.querySelector(\'#discount\').value) || 10;\n\n\tif (qty == 0) {\n\t\tx.innerHTML = \'Please choose a quantity.\';\n\t} else {\n\t\tif (price != \'\') {\n\t\t\tvar line = price * qty;\n\t\t\tline = line - line * discount / 100;\n\t\t\ttotal = total + line;\n\t\t\tx.innerHTML = \'Added \' + qty + \' x \' + item;\n\t\t\tdocument.querySelector(\'#total\').innerHTML = \'Total: $\' + total;\n\t\t}\n\t}\n});\n'"
	show-console
	preview-height="260px"
/>

## Try it yourself

Fix every problem you can find. Here's the checklist, so you know when you're done (try first, then peek):

1. Every `var` should be `const` or `let`. Which ones need to be `let`?
2. `x` is a meaningless name. Rename it to say what it holds.
3. Both comparisons use `==` or `!=`. Make them strict, and compare against real numbers instead of strings.
4. `price` and `qty` are strings. Convert them with `Number()`.
5. A 0% discount becomes 10%, because `||` treats `0` as falsy. Use `??`, or check the value properly.
6. Both `innerHTML` lines display text the visitor typed. Switch to `textContent`. (Try typing `<b>bold</b>` as the item name before and after.)
7. The nested `if` inside `else` can be flattened with an early `return`.
8. Money should always show two decimal places, like `$14.40`, not `$14.4`. Format the total with `toFixed(2)`, or better, with `Intl.NumberFormat`.

If you found all eight, you're reviewing code like a professional. If you found four, that's four more than you'd have spotted when this track began.

## Check your understanding

<Quiz
	question="A friend's click handler runs twice on the second click, three times on the third, and so on. What is the most likely cause?"
	:options="['The button is broken', 'A listener is being added inside another listener, so a new one piles up each time', 'Clicks are too fast', 'The page is loading twice']"
	:answer-index="1"
	explanation="Each outer event adds another copy of the inner listener. Add listeners once, when the page sets up."
/>

<Quiz
	question="Which tool warns you about likely bugs, like using == or leaving a variable unused?"
	:options="['A formatter such as Prettier', 'A linter such as ESLint', 'The HTML validator', 'The CSS validator']"
	:answer-index="1"
	explanation="A linter reads your code and flags likely mistakes. A formatter only fixes layout and spacing."
/>

<Quiz
	question="What is the main benefit of early returns?"
	:options="['They make functions run faster', 'They keep code flat by handling the no cases first, instead of nesting ifs', 'They are required by modern JavaScript', 'They prevent all errors']"
	:answer-index="1"
	explanation="Handling the exit cases first keeps the main work unindented and easy to follow."
/>

## Up next

There's one thing left to do: take the profile page you built in HTML and styled in CSS, and bring it to life. Head to [Final Project: Bring Your Profile Page to Life](/lessons/javascript/final-project).
