---
title: "JavaScript Events: addEventListener, Bubbling, Delegation"
description: "Respond to clicks, typing, and key presses with addEventListener, use the event object, stop default behavior, understand bubbling and delegation, and open a dialog."
---

# Events

*A doorbell does nothing until someone presses it. Events are how your page hears the press, and decides what rings.*

Everything you've built in the DOM chapter so far runs once, when the page loads. But the whole point of JavaScript, the electrician's job, is to **react**: when someone clicks, types, presses a key, or submits a form.

Each of those moments is an **event**. The browser announces them constantly, whether anyone is listening or not. Your job is to listen for the ones you care about.

## Listening: `addEventListener`

```js
const button = document.querySelector('#order');

button.addEventListener('click', () => {
	console.log('Order button clicked!');
});
```

Read it as: "On this button, **listen** for a `click`, and when it happens, run this function." That function is a callback, exactly like the ones in [Arrow Functions and Callbacks](/lessons/javascript/arrow-functions). You're not calling it yourself; you're handing it to the browser to call every time the event happens.

Picture a doorbell. Installing it doesn't ring anything. It just sits there, wired up, until someone presses it. Then it rings, every time, for as long as it's installed.

## Giving a button a job

Remember the promise from [More Form Controls](/lessons/html/forms-part-2)? "`type="button"` does nothing on its own. It waits for JavaScript to give it a job." This is that job:

```html
<button type="button" id="show-hours">Show opening hours</button>
<p id="hours" hidden>Monday to Friday, 7am to 5pm.</p>
```

```js
const showHours = document.querySelector('#show-hours');
const hours = document.querySelector('#hours');

showHours.addEventListener('click', () => {
	hours.hidden = !hours.hidden;
	showHours.textContent = hours.hidden ? 'Show opening hours' : 'Hide opening hours';
});
```

Always use a real `<button>` for things people click. A `<button>` fires its `click` event for mouse clicks, taps, **and** the Enter and Space keys, so keyboard users get it for free. A clickable `<div>` gets none of that, as you saw in [Accessibility Basics](/lessons/html/accessibility-basics).

## Events you'll use most

| Event | Fires when |
|---|---|
| `click` | an element is clicked, tapped, or activated with the keyboard |
| `input` | the value of an input or textarea changes, on every keystroke |
| `change` | a value is committed: a checkbox ticked, a select changed, a text field left |
| `submit` | a form is submitted (next lesson) |
| `keydown` | a key is pressed |
| `focus` / `blur` | an element gains or loses focus |
| `DOMContentLoaded` | the HTML has been fully read (you rarely need it with `defer`) |

## The event object

When the browser calls your function, it hands over an **event object** full of details about what happened. Just add a parameter to receive it, usually named `event`:

```js
document.querySelector('#search').addEventListener('input', (event) => {
	console.log('Typed so far:', event.target.value);
});

document.addEventListener('keydown', (event) => {
	console.log('Key pressed:', event.key);
});
```

- `event.target` is the element the event happened on.
- `event.key` tells you which key was pressed: `'Enter'`, `'Escape'`, `'a'`, `'ArrowUp'`.
- `event.type` is the event's name, like `'click'`.

## Stopping the default: `preventDefault`

Some elements already do something when an event happens. A link navigates. A form submits and reloads the page. `event.preventDefault()` says "hold on, I'll handle this myself":

```js
document.querySelector('.quick-view-link').addEventListener('click', (event) => {
	event.preventDefault();   // don't follow the link
	console.log('Showing a quick preview instead');
});
```

You'll use this constantly with forms in the next lesson. Just don't use it to break things people expect: a link that doesn't go anywhere is confusing. When something acts like a button, make it a `<button>`.

## Bubbling: events travel upward

Here's something that surprises everyone. When you click a button inside a card inside a list, the click doesn't only happen on the button. It **bubbles** up through every ancestor: the button, then the card, then the list, then the body, all the way to `document`.

Think of dropping a pebble into a pond: the ripples spread outward from where it landed. Any ancestor that's listening for `click` will hear it too.

Most events bubble like this. A few don't, notably `focus` and `blur`. When you need to catch focus changes across a whole group of elements, use their bubbling twins, `focusin` and `focusout`.

```js
document.querySelector('.card').addEventListener('click', () => {
	console.log('Something inside the card was clicked');
});
```

That listener runs whether you click the card's heading, its text, or its button.

## Delegation: one listener for many elements

Bubbling makes a powerful trick possible. Imagine a list of 50 products, each with a "Remove" button. You could add 50 listeners. Or you could add **one** listener to the list, and check which button the click bubbled up from:

```js
const cart = document.querySelector('#cart');

cart.addEventListener('click', (event) => {
	const removeButton = event.target.closest('.remove');
	if (!removeButton) return;   // the click wasn't on a remove button

	removeButton.closest('li').remove();
});
```

This is called **event delegation**, and it has two big advantages:

1. **Fewer listeners.** One instead of fifty.
2. **It works for elements added later.** Items created with the techniques from [Creating and Removing Elements](/lessons/javascript/creating-elements) are handled automatically, because the listener is on the list, not on each item.

That `event.target.closest('.remove')` line is the key. `event.target` might be the button itself, or a `<span>` or icon *inside* the button. `closest` walks up from wherever the click landed and finds the button either way.

## Removing a listener

```js
const button = document.querySelector('#welcome-button');

function onFirstClick() {
	console.log('Thanks for your first click!');
}

button.addEventListener('click', onFirstClick);
button.removeEventListener('click', onFirstClick);
```

To remove a listener, you need the **same function** you added, so it has to have a name. For a listener that should only ever run once, there's a shortcut: `button.addEventListener('click', onFirstClick, { once: true })`.

## Opening a dialog

In [details, dialog, and template](/lessons/html/details-dialog-and-template), you saw that opening a modal `<dialog>` "takes one line of JavaScript," with the promise that you'd understand it later. Here it is, fully:

```js
const dialog = document.querySelector('#confirm-dialog');

document.querySelector('#remove-item').addEventListener('click', () => {
	dialog.showModal();
});

dialog.addEventListener('close', () => {
	console.log('The dialog closed with:', dialog.returnValue);
});
```

- `showModal()` opens the dialog as a modal: the rest of the page is blocked, focus moves inside, and Escape closes it.
- `close(value)` closes it from code, and `value` becomes `dialog.returnValue`.
- The `close` event fires however the dialog was closed, so it's the right place to act on the answer.

On a real page, the `<form method="dialog">` buttons inside the dialog close it and set `returnValue` for you. This book's preview blocks form submissions, so the Try it below closes the dialog by hand.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'show-hours\'>Show opening hours</button>\n<p id=\'hours\' hidden>Monday to Friday, 7am to 5pm.</p>\n\n<label for=\'search\'>Search the menu</label>\n<input id=\'search\' type=\'search\'>\n\n<ul id=\'cart\'>\n\t<li>Sourdough <button type=\'button\' class=\'remove\'>Remove</button></li>\n\t<li>Rye <button type=\'button\' class=\'remove\'>Remove</button></li>\n\t<li>Coffee <button type=\'button\' class=\'remove\'>Remove</button></li>\n</ul>\n\n<button type=\'button\' id=\'empty-cart\'>Empty the cart</button>\n<dialog id=\'confirm-dialog\'>\n\t<p>Empty your whole cart?</p>\n\t<button type=\'button\' value=\'cancel\'>Keep it</button>\n\t<button type=\'button\' value=\'empty\'>Empty it</button>\n</dialog>'"
	:initial-js="'const showHours = document.querySelector(\'#show-hours\');\nconst hours = document.querySelector(\'#hours\');\nshowHours.addEventListener(\'click\', () => {\n\thours.hidden = !hours.hidden;\n\tshowHours.textContent = hours.hidden ? \'Show opening hours\' : \'Hide opening hours\';\n});\n\ndocument.querySelector(\'#search\').addEventListener(\'input\', (event) => {\n\tconsole.log(\'Searching for:\', event.target.value);\n});\n\n// One listener for every Remove button, even ones added later\nconst cart = document.querySelector(\'#cart\');\ncart.addEventListener(\'click\', (event) => {\n\tconst removeButton = event.target.closest(\'.remove\');\n\tif (!removeButton) return;\n\tconst item = removeButton.closest(\'li\');\n\tconsole.log(\'Removing:\', item.firstChild.textContent.trim());\n\titem.remove();\n});\n\nconst dialog = document.querySelector(\'#confirm-dialog\');\ndocument.querySelector(\'#empty-cart\').addEventListener(\'click\', () => {\n\tdialog.showModal();\n});\n\n// The preview blocks form submits, so these buttons close the dialog by hand.\nfor (const button of dialog.querySelectorAll(\'button\')) {\n\tbutton.addEventListener(\'click\', () => dialog.close(button.value));\n}\n\ndialog.addEventListener(\'close\', () => {\n\tconsole.log(\'Dialog answer:\', dialog.returnValue);\n\tif (dialog.returnValue === \'empty\') {\n\t\tcart.replaceChildren();\n\t}\n});\n'"
	show-console
	preview-height="300px"
/>

## Try it yourself

1. Type in the search box and watch every keystroke arrive in the console. Then change `'input'` to `'change'` and compare: when does it fire now?
2. Add a new `<li>` with a Remove button to the HTML. Does it work without any new JavaScript? That's delegation.
3. Add a `keydown` listener to `document` that logs `event.key`, then press a few keys (click inside the preview first).

## Check your understanding

<Quiz
	question="What does event.preventDefault() do on a link's click event?"
	:options="['Removes the link from the page', 'Stops the browser from following the link', 'Stops all other listeners', 'Reloads the page']"
	:answer-index="1"
	explanation="preventDefault cancels the element's built-in behavior, which for a link is navigating to its href."
/>

<Quiz
	question="Why does one click listener on a list work for buttons added to it later?"
	:options="['Listeners copy themselves to new elements', 'Clicks bubble up from the button to the list, where the listener is', 'Buttons always have listeners', 'The browser re-runs the script']"
	:answer-index="1"
	explanation="This is event delegation. The click bubbles up to the list, and the listener checks which button it came from."
/>

<Quiz
	question="Which element should you use for something people click to perform an action?"
	:options="['A div with a click listener', 'A span with a click listener', 'A button', 'A p with tabindex']"
	:answer-index="2"
	explanation="A button works with mouse, touch, and keyboard (Enter and Space) and is announced correctly by screen readers, all for free."
/>

## Up next

The most important event of all belongs to forms. Next, you'll handle `submit`, read what visitors typed, and replace the browser's generic error messages with friendly ones of your own. That's [Forms and Custom Validation](/lessons/javascript/forms-with-javascript).
