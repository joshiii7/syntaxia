---
title: "Create, Add, and Remove Elements with JavaScript"
description: "Build new elements with createElement, add them with append, prepend, before, and after, remove them, render lists from data, and stamp out copies with template."
---

# Creating and Removing Elements

*Some pages arrive fully built. Others get assembled while you watch: a new comment, a new cart item, fifty search results.*

So far, every element you've changed already existed in the HTML. But much of what you see on real websites is built on the fly: a list of products loaded from a server, a comment that appears right after you post it, an item that disappears when you remove it from your cart.

This lesson is about building, adding, and removing elements with JavaScript, safely and cleanly.

## Building an element: `createElement`

Making a new element is a three-step job, a bit like building flat-pack furniture: make the piece, fill in its details, then put it where it belongs.

```js
// 1. Make it
const item = document.createElement('li');

// 2. Fill in its details
item.textContent = 'Sourdough';
item.classList.add('menu-item');
item.dataset.price = '8';

// 3. Put it on the page
const menu = document.querySelector('#menu');
menu.append(item);
```

Until step 3, the new `<li>` exists only in JavaScript's memory, like furniture assembled in the garage. Nobody sees it until you carry it into a room.

Notice step 2 uses `textContent`, just like you learned in [Changing Text, Attributes, and Classes](/lessons/javascript/changing-elements). That's why this approach is the **safe** one: even if the text came from a visitor or a server, it can never turn into running code.

## Where to put it

```js
menu.append(item);     // inside, at the end
menu.prepend(item);    // inside, at the start
menu.before(item);     // outside, just before the menu
menu.after(item);      // outside, just after the menu
```

`append` and `prepend` put the new element **inside** as a child. `before` and `after` put it **beside** as a sibling. `append` can also take several things at once, including plain strings: `paragraph.append('Price: ', priceSpan)`.

One surprise: an element can only be in one place at a time. If you `append` an element that's already on the page, it **moves** there rather than being copied.

## Removing an element

```js
const item = document.querySelector('.menu-item');
item.remove();
```

That's it. The element leaves the page. To clear out everything inside a container, use `replaceChildren()` with nothing in it:

```js
menu.replaceChildren();   // the menu is now empty
```

## Building a list from data

Here's the pattern you'll use constantly: take an array of data, build an element for each item, and add them all to the page.

```js
const breads = [
	{ name: 'Sourdough', price: 8 },
	{ name: 'Rye', price: 7 },
	{ name: 'Focaccia', price: 6 },
];

const menu = document.querySelector('#menu');

for (const bread of breads) {
	const item = document.createElement('li');
	item.textContent = `${bread.name}: $${bread.price}`;
	menu.append(item);
}
```

When your data changes, the usual approach is to clear the list and build it again from the updated data. For a list of a few dozen items, that's fast and much simpler than trying to update each item by hand.

## Bigger pieces: the `<template>` cookie cutter

Building a single `<li>` with `createElement` is easy. Building a whole review card, with a heading, a star rating, a paragraph, and a button, one element at a time, gets long and hard to read.

Remember `<template>` from [details, dialog, and template](/lessons/html/details-dialog-and-template), the "cookie cutter made of HTML"? This is where it comes alive. You write the card's HTML once, inside a `<template>`, where it isn't shown:

```html
<template id="review-template">
	<article class="review">
		<h3 class="review-author"></h3>
		<p class="review-text"></p>
		<button type="button" class="review-remove">Remove</button>
	</article>
</template>
```

Then JavaScript stamps out a copy for each piece of data:

```js
const template = document.querySelector('#review-template');
const list = document.querySelector('#reviews');

function addReview(review) {
	const copy = template.content.cloneNode(true);
	copy.querySelector('.review-author').textContent = review.author;
	copy.querySelector('.review-text').textContent = review.text;
	list.append(copy);
}

addReview({ author: 'Ana', text: 'The rye is wonderful.' });
addReview({ author: 'Ben', text: 'Best croissants in town.' });
```

- `template.content` is the cookie cutter itself, the HTML inside the template.
- `cloneNode(true)` presses out a copy, including everything nested inside. (With `false`, you'd only copy the outer shell.)
- You fill in the copy with `querySelector` and `textContent`, then `append` it.

The HTML stays in your HTML file, where it's easy to read and change, and JavaScript only fills in the blanks. That's the same separation of jobs you've been learning since [Where HTML Meets CSS and JS](/lessons/html/html-meets-css-and-js).

## Why not just use `innerHTML`?

You could build the same review with a template literal and `innerHTML`:

```js
list.innerHTML += `<article class="review"><h3>${review.author}</h3>...</article>`;
```

It's shorter, but it has two problems:

1. **Security.** If `review.text` contains HTML, like the `onerror` attack from the last lesson, it runs. `textContent` never has that problem.
2. **It rebuilds everything.** `+=` throws away every existing element inside the list and rebuilds them all from text. Any event listeners attached to them are lost, and anything a visitor typed into an input in there is wiped.

Use `createElement` or a `<template>`, and fill in text with `textContent`.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<h2>Reviews</h2>\n<div id=\'reviews\'></div>\n<button type=\'button\' id=\'add-review\'>Add a random review</button>\n\n<template id=\'review-template\'>\n\t<article class=\'review\'>\n\t\t<h3 class=\'review-author\'></h3>\n\t\t<p class=\'review-text\'></p>\n\t\t<button type=\'button\' class=\'review-remove\'>Remove</button>\n\t</article>\n</template>'"
	:initial-js="'const template = document.querySelector(\'#review-template\');\nconst list = document.querySelector(\'#reviews\');\n\nfunction addReview(review) {\n\tconst copy = template.content.cloneNode(true);\n\tcopy.querySelector(\'.review-author\').textContent = review.author;\n\tcopy.querySelector(\'.review-text\').textContent = review.text;\n\n\tconst article = copy.querySelector(\'.review\');\n\tcopy.querySelector(\'.review-remove\').addEventListener(\'click\', () => {\n\t\tarticle.remove();\n\t\tconsole.log(\'Removed the review by\', review.author);\n\t});\n\n\tlist.append(copy);\n}\n\nconst reviews = [\n\t{ author: \'Ana\', text: \'The rye is wonderful.\' },\n\t{ author: \'Ben\', text: \'Best croissants in town.\' },\n\t{ author: \'Cy\', text: \'<b>Not bold</b>, because textContent keeps this as plain text.\' },\n];\nreviews.forEach(addReview);\n\nconst extras = [\'Lovely staff.\', \'Get there early!\', \'The focaccia is a must.\'];\ndocument.querySelector(\'#add-review\').addEventListener(\'click\', () => {\n\tconst text = extras[Math.floor(Math.random() * extras.length)];\n\taddReview({ author: \'A new visitor\', text });\n});\n'"
	show-console
	preview-height="320px"
/>

(`Math.floor(Math.random() * extras.length)` picks a random index from 0 to 2. And `{ author: 'A new visitor', text }` is a shortcut for `text: text`, handy when the variable and the property share a name.)

Notice the third review: its `<b>` tags show up as plain text instead of making anything bold. That's `textContent` protecting the page.

## Try it yourself

1. Click "Add a random review" a few times, then remove some reviews.
2. Add a `<p class='review-date'>` to the template, and fill it in with `new Date().toLocaleDateString()` in `addReview`.
3. Add a "Clear all" button that empties the list with `list.replaceChildren()`.

## Check your understanding

<Quiz
	question="You made an element with document.createElement('li'). Why isn't it on the page yet?"
	:options="['createElement is broken', 'It only exists in memory until you add it with append, prepend, before, or after', 'It needs a class first', 'The browser hides new elements']"
	:answer-index="1"
	explanation="createElement builds the element in memory. It appears only when you place it somewhere in the page."
/>

<Quiz
	question="What does template.content.cloneNode(true) do?"
	:options="['Shows the template on the page', 'Makes a full copy of the template contents, including nested elements', 'Deletes the template', 'Copies only the outer element']"
	:answer-index="1"
	explanation="cloneNode(true) makes a deep copy of everything inside the template. With false, only the outer node would be copied."
/>

<Quiz
	question="Which method removes an element from the page?"
	:options="['element.delete()', 'element.remove()', 'element.hide()', 'document.remove(element)']"
	:answer-index="1"
	explanation="remove() takes the element out of the page. hidden or a CSS class would only hide it."
/>

## Up next

You've been using `addEventListener('click', ...)` for a while now, as a sort of magic spell. Time to learn how it really works, including the event object, bubbling, and how to open a `<dialog>`. That's [Events](/lessons/javascript/events).
