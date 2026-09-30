---
title: "Change the Page with JavaScript: textContent, classList, dataset"
description: "Update elements with JavaScript: change text safely, read and set attributes and properties, toggle classes with classList, and read data-* attributes with dataset."
---

# Changing Text, Attributes, and Classes

*You've found the room. Now you can repaint the sign on the door, flip the "open" card, and read the note pinned to the back.*

In [Finding Elements](/lessons/javascript/selecting-elements), you learned to point at any element on the page. Now let's actually change them. This is the moment JavaScript starts to feel like magic: a click, and the page updates, with no reload.

## Changing text: `textContent`

```js
const status = document.querySelector('#status');

console.log(status.textContent);        // read the current text
status.textContent = 'Your order is ready!';   // replace it
```

`textContent` reads or replaces all the text inside an element. It treats whatever you give it as **plain text**, so if you set it to `'<strong>Hi</strong>'`, the page literally shows the angle brackets. That's a good thing, as you're about to see.

## `innerHTML`, and why to be careful

```js
status.innerHTML = 'Your order is <strong>ready</strong>!';
```

`innerHTML` reads or replaces the **HTML** inside an element. The browser builds real elements from the string, so the word "ready" becomes bold.

That power is also a danger. Imagine a product review box that shows what visitors type using `innerHTML`, and someone types this as their "review":

```html
<img src="x" onerror="stealEverything()">
```

The browser builds that image, it fails to load, and the `onerror` code runs, on every visitor's computer who sees the review. This attack is called **cross-site scripting (XSS)**, and it's one of the most common security holes on the web.

The rule is simple:

- Showing text, especially anything a visitor typed or a server sent? Use **`textContent`**. It's always safe.
- Only use `innerHTML` with HTML **you wrote yourself**, never with outside data.

(You used `innerHTML +=` for a quick demo in [Loops](/lessons/javascript/loops). In [Creating and Removing Elements](/lessons/javascript/creating-elements), you'll learn the safe, professional way to build new elements.)

## Attributes

Remember [Attributes](/lessons/html/attributes), the details written on an element's label? JavaScript can read and change them:

```js
const link = document.querySelector('.menu-link');

link.getAttribute('href');                 // read
link.setAttribute('href', '/menu.html');   // change or add
link.removeAttribute('target');            // remove
link.hasAttribute('target');               // true or false
```

## Properties: the shortcut for common attributes

For the most common attributes, elements also have **properties** you can use directly with a dot, which is usually easier:

```js
const image = document.querySelector('img');
image.src = 'rye.webp';
image.alt = 'A dark rye loaf on a board';

const input = document.querySelector('#quantity');
console.log(input.value);   // what's typed in the box right now

const checkbox = document.querySelector('#gift-wrap');
console.log(checkbox.checked);   // true or false

const button = document.querySelector('#order');
button.disabled = true;

const banner = document.querySelector('.sale-banner');
banner.hidden = false;
```

Notice the boolean attributes from the HTML track, like `disabled`, `checked`, and `hidden`, become simple `true`/`false` properties. That solves the old puzzle from the Attributes lesson: in HTML you had to *remove* `disabled` to turn it off, but in JavaScript you just set `button.disabled = false`.

One thing to know about form fields: `input.value` is what's in the box **right now**, including anything the visitor typed. `input.getAttribute('value')` is only the starting value written in the HTML. When you want what someone typed, always use `.value`.

## Classes: `classList`

You met `classList` in [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript), and it's the most professional way to change how something looks: JavaScript switches a class, CSS decides what that class looks like.

```js
const card = document.querySelector('.product-card');

card.classList.add('is-featured');
card.classList.remove('is-featured');
card.classList.toggle('is-open');           // on if off, off if on
card.classList.contains('is-open');         // true or false

const stock = 0;
card.classList.toggle('is-sold-out', stock === 0);   // on only if the condition is true
```

That last form, `toggle` with a second argument, is a handy one: it adds the class when the condition is true and removes it when it's false, in one line.

## `data-*` attributes: `dataset`

In [Attributes Deep Dive](/lessons/html/attributes-deep-dive), you stored extra details on elements with `data-*` attributes and were promised you'd see how JavaScript reads them. Here it is:

```html
<article class="product-card" data-product-id="1042" data-stock="3">
	<h3>Ceramic Mug</h3>
	<p class="stock-note"></p>
</article>
```

```js
const card = document.querySelector('.product-card');

console.log(card.dataset.productId);   // '1042'
console.log(card.dataset.stock);       // '3'

const stock = Number(card.dataset.stock);
if (stock <= 3) {
	card.querySelector('.stock-note').textContent = `Only ${stock} left!`;
}
```

Every `data-*` attribute appears on the element's `dataset` object, with two small translations:

- The `data-` prefix is dropped.
- Hyphenated names become camelCase: `data-product-id` becomes `dataset.productId`.

And like every attribute, the values are always **strings**. Convert them with `Number()` before doing math, just like form input.

You can write to `dataset` too: `card.dataset.stock = 2` updates the `data-stock` attribute on the page.

## Styles: use sparingly

```js
card.style.backgroundColor = 'tomato';
```

You can set styles directly with `element.style`, using camelCase property names. As you learned in the CSS track, this writes an inline style that's hard for your stylesheet to override. Save it for truly dynamic values, like a progress bar at exactly 63%. For everything else, toggle a class.

## Accessible state

When JavaScript changes something visually, remember the people who can't see it. If a button opens and closes something, update `aria-expanded` as well, as you practiced in [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript):

```js
// Inside the click handler that opens or closes the menu:
button.setAttribute('aria-expanded', String(isOpen));
```

And if a message appears after the page has loaded, like "Added to cart!", put it in an element with `aria-live="polite"` (from [Accessibility Basics](/lessons/html/accessibility-basics)) so screen readers announce the change.

## Try it

<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<article class=\'product-card\' data-product-id=\'1042\' data-stock=\'3\'>\n\t<h3>Ceramic Mug</h3>\n\t<p class=\'stock-note\'></p>\n\t<button type=\'button\' class=\'feature-button\'>Feature this product</button>\n</article>\n\n<article class=\'product-card\' data-product-id=\'1043\' data-stock=\'0\'>\n\t<h3>Linen Tea Towel</h3>\n\t<p class=\'stock-note\'></p>\n\t<button type=\'button\' class=\'feature-button\'>Feature this product</button>\n</article>\n\n<p id=\'announcer\' aria-live=\'polite\'></p>'"
	:initial-css="'.product-card {\n\tmargin-bottom: 12px;\n\tpadding: 12px;\n\tborder: 2px solid #dddddd;\n\tborder-radius: 8px;\n\tfont-family: system-ui, sans-serif;\n}\n\n.is-featured {\n\tborder-color: #f28c28;\n\tbackground: #fff8e6;\n}\n\n.is-sold-out {\n\topacity: 0.6;\n}\n'"
	:initial-js="'const cards = document.querySelectorAll(\'.product-card\');\nconst announcer = document.querySelector(\'#announcer\');\n\ncards.forEach((card) => {\n\tconst stock = Number(card.dataset.stock);\n\tconst note = card.querySelector(\'.stock-note\');\n\n\tif (stock === 0) {\n\t\tnote.textContent = \'Sold out\';\n\t} else if (stock <= 3) {\n\t\tnote.textContent = `Only ${stock} left!`;\n\t}\n\tcard.classList.toggle(\'is-sold-out\', stock === 0);\n\n\tconst button = card.querySelector(\'.feature-button\');\n\tbutton.disabled = stock === 0;\n\tbutton.addEventListener(\'click\', () => {\n\t\tconst isFeatured = card.classList.toggle(\'is-featured\');\n\t\tconst name = card.querySelector(\'h3\').textContent;\n\t\tannouncer.textContent = isFeatured ? `${name} is now featured.` : `${name} is no longer featured.`;\n\t\tconsole.log(\'Product\', card.dataset.productId, \'featured:\', isFeatured);\n\t});\n});\n'"
	show-console
	preview-height="260px"
/>

(`classList.toggle` also returns `true` if it just added the class and `false` if it removed it, which is how `isFeatured` knows the new state.)

## Try it yourself

1. Change the mug's `data-stock` to `12` in the HTML. What happens to its note?
2. Click "Feature this product" twice. Watch the border and the announcement. Then change `textContent` to `innerHTML` in the announcer line and put `<strong>` tags around the name. It works, but why is `textContent` the safer habit?
3. Add a `data-category='kitchen'` attribute to both cards and log `card.dataset.category` for each.

## Check your understanding

<Quiz
	question="You want to show a review that a visitor typed. Which property is safe to use?"
	:options="['innerHTML', 'textContent', 'outerHTML', 'Either, they are the same']"
	:answer-index="1"
	explanation="textContent always treats the value as plain text, so typed HTML or scripts can't run. innerHTML would build real elements from it."
/>

<Quiz
	question="An element has data-product-id='1042'. How do you read it in JavaScript?"
	:options="['el.dataset.product-id', 'el.dataset.productId', 'el.data.productId', 'el.productId']"
	:answer-index="1"
	explanation="dataset drops the data- prefix and turns hyphenated names into camelCase, so data-product-id becomes dataset.productId."
/>

<Quiz
	question="What does card.classList.toggle('is-open') do?"
	:options="['Always adds is-open', 'Always removes is-open', 'Adds is-open if missing, removes it if present', 'Checks whether is-open exists']"
	:answer-index="2"
	explanation="toggle flips the class: on if it's off, off if it's on. contains is the method that only checks."
/>

## Up next

You can change anything that already exists. Next, you'll build brand-new elements from data, stamp out copies with the `<template>` cookie cutter, and remove elements when they're no longer needed. That's [Creating and Removing Elements](/lessons/javascript/creating-elements).
