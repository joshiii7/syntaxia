---
title: "Finding Elements in JavaScript: querySelector and the DOM"
description: "Find elements on the page with querySelector, querySelectorAll, and getElementById, move around the DOM family tree, and handle the null you get when nothing matches."
---

# Finding Elements

*Before the electrician can wire a switch, they have to find the right wall. Everything in the DOM chapter starts with finding the element.*

You've been using `document.querySelector('#greeting')` since the very first lesson, taking it on trust. This chapter is where JavaScript meets the page properly, and it starts right here: how to point at exactly the element you want.

The good news is that you already know most of it. You learned it in CSS.

## The DOM, again

In [Nesting and the DOM](/lessons/html/nesting-and-the-dom), you learned that the browser turns your HTML into a family tree called the **DOM** (Document Object Model). Every element is a node in that tree, with parents, children, and siblings.

JavaScript sees the page through that tree. Each element becomes an **object** you can read and change, with properties and methods, just like the objects from [Objects](/lessons/javascript/objects). And the whole tree is available through one special object: `document`.

## `querySelector`: find the first match

```js
const heading = document.querySelector('h1');
const cart = document.querySelector('#cart');
const firstPrice = document.querySelector('.price');
const emailInput = document.querySelector('input[type="email"]');
```

`querySelector` takes **any CSS selector**, exactly like the ones from [Selectors](/lessons/css/selectors), and returns the **first** element that matches. Type selectors, classes, ids, attributes, combinators, pseudo-classes: all of it works.

```js
const firstNavLink = document.querySelector('nav a');
const checkedSize = document.querySelector('input[name="size"]:checked');
```

It's like asking a librarian, "Can you find me the first book on the top shelf with a red spine?" They search from the top of the library down and hand you the first one that fits.

## `querySelectorAll`: find every match

```js
const prices = document.querySelectorAll('.price');
console.log(prices.length);   // how many were found
```

`querySelectorAll` returns **all** matching elements, in page order, in a list called a **NodeList**. It's not quite an array, but it has a `length`, you can read items by index (`prices[0]`), and you can loop over it:

```js
for (const price of prices) {
	console.log(price.textContent);
}

prices.forEach((price) => {
	price.classList.add('highlight');
});
```

What a NodeList *doesn't* have is `map`, `filter`, and the other methods from [Array Methods](/lessons/javascript/array-methods). When you need those, convert it first:

```js
const priceTexts = Array.from(prices).map((price) => price.textContent);
```

## `getElementById`: the classic

```js
const cart = document.getElementById('cart');   // no # here
```

This older method finds an element by its `id` only, and it's slightly faster. Notice there's **no `#`**, because it only ever looks at ids. Mixing that up (`getElementById('#cart')`) is a common slip that returns `null`. `querySelector('#cart')` does the same job with the same selector syntax as everything else, which is why this book mostly uses it.

## When nothing matches: `null`

```js
const missing = document.querySelector('.does-not-exist');
console.log(missing);   // null
```

`querySelector` returns `null` when nothing matches. (`querySelectorAll` returns an empty NodeList instead, with a length of 0.) The trouble starts when you use that `null` as if it were an element:

```js
document.querySelector('.cart-count').textContent = '3';
// TypeError: Cannot read properties of null (reading 'textContent')
```

This is **the** most common DOM error there is. When you see it, the selector didn't find anything. Check, in order:

1. **A typo?** `.cart-count` in JavaScript, but `cart_count` in the HTML?
2. **Wrong symbol?** A class needs `.`, an id needs `#`.
3. **Too early?** Is the script running before the element exists? Remember `defer` from [Adding JavaScript to a Page](/lessons/javascript/adding-javascript).
4. **Created later?** Maybe the element only appears after something else happens.

When an element is genuinely optional, check for it before using it:

```js
const banner = document.querySelector('.holiday-banner');
if (banner) {
	banner.hidden = false;
}
```

## Searching inside an element

`querySelector` isn't only a `document` method. Every element has it too, and then it only searches **inside** that element:

```js
const card = document.querySelector('.product-card');
const cardTitle = card.querySelector('h3');   // only the h3 inside this card
```

That's how you work with repeated components, like a page full of product cards that all contain an `h3` and a `.price`. Find the card first, then look inside it.

## Walking the family tree

Once you have an element, you can move to its relatives:

```js
const price = document.querySelector('.price');

price.parentElement;          // its parent
price.children;               // its child elements
price.nextElementSibling;     // the next element beside it
price.previousElementSibling; // the one before it
```

And one of the most useful methods of all, `closest`, walks **up** the tree to find the nearest ancestor that matches a selector (checking the element itself first):

```js
const price = document.querySelector('.price');
const card = price.closest('.product-card');
```

"Starting from this price, go up until you find the card it belongs to." You'll use `closest` a lot with events, in [Events](/lessons/javascript/events).

## Store what you find

Finding an element takes a little work. If you'll use it more than once, find it once and keep it in a `const`:

```js
const status = document.querySelector('#status');
status.textContent = 'Loading...';
// ...later
status.textContent = 'Done!';
```

It's faster, and it's easier to read: the variable name says what the element is for.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<nav>\n\t<a href=\'#\'>Breads</a>\n\t<a href=\'#\'>Pastries</a>\n</nav>\n\n<article class=\'product-card\'>\n\t<h3>Sourdough</h3>\n\t<p>Price: <span class=\'price\'>$8</span></p>\n</article>\n<article class=\'product-card\'>\n\t<h3>Rye</h3>\n\t<p>Price: <span class=\'price\'>$7</span></p>\n</article>'"
	:initial-js="'const firstLink = document.querySelector(\'nav a\');\nconsole.log(\'First nav link:\', firstLink.textContent);\n\nconst prices = document.querySelectorAll(\'.price\');\nconsole.log(\'Found\', prices.length, \'prices\');\nprices.forEach((price) => {\n\tconsole.log(price.textContent);\n});\n\nconst secondCard = document.querySelectorAll(\'.product-card\')[1];\nconsole.log(\'Second card title:\', secondCard.querySelector(\'h3\').textContent);\n\nconst card = prices[0].closest(\'.product-card\');\nconsole.log(\'The first price belongs to:\', card.querySelector(\'h3\').textContent);\n\nconsole.log(\'Missing:\', document.querySelector(\'.does-not-exist\'));\n'"
	show-console
	preview-height="200px"
/>

## Try it yourself

1. Find the second nav link with `document.querySelectorAll('nav a')[1]` and log its text.
2. Change `.does-not-exist` to a real selector from the HTML, then try `document.getElementById('#cart')` with the `#`, and see what comes back.
3. Starting from the second `.price`, use `closest` to find its card, then log that card's `h3` text.

## Check your understanding

<Quiz
	question="What does document.querySelector('.price') return when three elements have that class?"
	:options="['All three, in a list', 'The first one only', 'The last one only', 'null']"
	:answer-index="1"
	explanation="querySelector returns only the first match. querySelectorAll returns all of them."
/>

<Quiz
	question="You see: Cannot read properties of null (reading 'textContent'). What most likely happened?"
	:options="['The element has no text', 'The selector found no element, so you are using null', 'textContent is spelled wrong', 'The page has too many elements']"
	:answer-index="1"
	explanation="querySelector returned null because nothing matched. Check the selector for typos, the right symbol, and timing."
/>

<Quiz
	question="Which line finds the nearest .product-card that contains a given price element?"
	:options="['price.parentElement(\'.product-card\')', 'price.closest(\'.product-card\')', 'document.closest(\'.product-card\')', 'price.querySelector(\'.product-card\')']"
	:answer-index="1"
	explanation="closest walks up the family tree from the element and returns the first ancestor matching the selector."
/>

## Up next

You can find anything on the page. Next, you'll change it: its text, its attributes, its classes, and the `data-*` details you stored on it back in the HTML track. That's [Changing Text, Attributes, and Classes](/lessons/javascript/changing-elements).
