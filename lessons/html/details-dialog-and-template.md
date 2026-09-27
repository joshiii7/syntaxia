---
title: "HTML details, summary, dialog, and template"
description: "Build expandable FAQs with details and summary, accessible pop-up dialogs with dialog, and reusable chunks of markup with template, all with very little or no JavaScript."
---

# details, dialog, and template

*Three built-in elements that do jobs people used to write piles of JavaScript for.*

For years, if you wanted a section that expands when clicked, or a pop-up box asking "Are you sure?", you had to write it yourself in JavaScript, or pull in someone else's code. And a lot of those homemade versions were, frankly, broken for keyboard and screen reader users.

Modern HTML has these built in. They work with the keyboard, they're announced properly by screen readers, and they take a fraction of the code. Let's look at all three.

## `<details>` and `<summary>`: a folded note

Picture a folded piece of paper with a question written on the outside. Curious? Unfold it and read the answer. Done? Fold it back up.

```html
<details>
	<summary>How long does sourdough take to make?</summary>
	<p>About 24 hours from start to finish, but most of that is waiting while the dough rises. Your hands-on time is closer to 30 minutes.</p>
</details>
```

- `<details>` is the whole folded note.
- `<summary>` is the question written on the outside. It's always visible, and clicking it (or pressing Enter or Space on it) unfolds the note.
- Everything else inside `<details>` is hidden until it's opened.

No JavaScript. Keyboard support, a little arrow showing whether it's open, and screen reader announcements ("collapsed," "expanded") all come built in.

Want it to start unfolded? Add the boolean `open` attribute: `<details open>`.

### Accordions: only one open at a time

Stack a few of these and you've got an FAQ. Give them all the same `name`, and opening one automatically closes the others, like an accordion:

```html
<details name="faq">
	<summary>Do you deliver?</summary>
	<p>Yes, within 10 km of the bakery.</p>
</details>
<details name="faq">
	<summary>Are your breads vegan?</summary>
	<p>All of our sourdough loaves are.</p>
</details>
```

Does that `name` trick feel familiar? It's the same idea as radio buttons from [More Form Controls](/lessons/html/forms-part-2): one name, one choice at a time.

## `<dialog>`: the waiter at your table

You're at a restaurant, chatting away. A waiter walks up: "Are you ready to order?" For a moment, everything else pauses. You answer the question, the waiter leaves, and you pick your conversation back up.

That's a **modal dialog**. It pops up over the page, and until you deal with it, the rest of the page is off-limits.

```html
<dialog id="confirm-dialog">
	<h2>Remove this item?</h2>
	<p>The ceramic mug will be removed from your cart.</p>
	<form method="dialog">
		<button value="cancel">Keep it</button>
		<button value="remove">Remove</button>
	</form>
</dialog>

<button type="button" id="open-dialog">Remove from cart</button>
```

Opening a dialog as a modal takes one line of JavaScript (you'll understand it fully in the [JavaScript track](/lessons/javascript/intro-to-javascript)):

```js
document.querySelector('#open-dialog').addEventListener('click', () => {
	document.querySelector('#confirm-dialog').showModal();
});
```

Look at everything you get for free with `showModal()`:

- The rest of the page is dimmed and can't be clicked or tabbed into.
- Keyboard focus moves into the dialog automatically.
- Pressing **Escape** closes it, like telling the waiter "just a minute."
- When it closes, focus goes back to the button that opened it, so keyboard users don't get lost.

Getting all of that right by hand is genuinely hard. Many homemade pop-ups get at least one of these wrong.

And that `<form method="dialog">`? It's a neat trick: submitting it closes the dialog instead of sending anything to a server. The button that was pressed becomes the dialog's answer ("cancel" or "remove"), which your JavaScript can check.

## `<template>`: a cookie cutter

Imagine baking cookies. You don't sculpt each one by hand. You have one cookie cutter, and you press out as many identical cookies as you need, then decorate each one differently.

`<template>` is a cookie cutter made of HTML:

```html
<template id="review-template">
	<article class="review">
		<h3 class="review-author"></h3>
		<p class="review-text"></p>
	</article>
</template>
```

Whatever's inside a `<template>` is **not shown** on the page. Images inside it don't load, scripts inside it don't run. It just sits there, waiting. Then JavaScript can stamp out copies, fill each one in (a different reviewer's name and words), and add them to the page. Think of a product page loading 50 customer reviews: one template, 50 cookies.

This is the element you'll understand least deeply right now, and that's fine. It really only comes alive with JavaScript. What matters today is knowing it exists, so when you reach the JavaScript track and need to build lots of repeated pieces, you'll remember: "Wait, HTML has a cookie cutter for this."

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<h2>Bakery FAQ</h2>\n<details name=\'faq\'>\n\t<summary>Do you deliver?</summary>\n\t<p>Yes, within 10 km of the bakery.</p>\n</details>\n<details name=\'faq\'>\n\t<summary>Are your breads vegan?</summary>\n\t<p>All of our sourdough loaves are.</p>\n</details>\n\n<h2>Your Cart</h2>\n<button type=\'button\' id=\'open-dialog\'>Remove the ceramic mug</button>\n\n<dialog id=\'confirm-dialog\'>\n\t<h2>Remove this item?</h2>\n\t<p>The ceramic mug will be removed from your cart.</p>\n\t<form method=\'dialog\'>\n\t\t<button value=\'cancel\'>Keep it</button>\n\t\t<button value=\'remove\'>Remove</button>\n\t</form>\n</dialog>\n\n<template id=\'review-template\'>\n\t<p class=\'review\'></p>\n</template>\n<h2>Reviews</h2>\n<div id=\'reviews\'></div>'"
	:initial-js="'const dialog = document.querySelector(\'#confirm-dialog\');\ndocument.querySelector(\'#open-dialog\').addEventListener(\'click\', () => {\n\tdialog.showModal();\n});\n\n// This preview is a sandbox that blocks form submissions, even dialog ones,\n// so these lines close the dialog by hand. On a real page, method=dialog does it for you.\nfor (const button of dialog.querySelectorAll(\'button\')) {\n\tbutton.addEventListener(\'click\', () => dialog.close(button.value));\n}\n\n// Stamp out one paragraph per review using the template.\nconst reviews = [\'Ana loved the rye.\', \'Ben says the croissants are perfect.\'];\nconst template = document.querySelector(\'#review-template\');\nfor (const text of reviews) {\n\tconst copy = template.content.cloneNode(true);\n\tcopy.querySelector(\'.review\').textContent = text;\n\tdocument.querySelector(\'#reviews\').append(copy);\n}\n'"
	preview-height="420px"
/>

## Try it yourself

1. Open one FAQ question, then another. The first closes by itself. Now remove `name='faq'` from both and try again.
2. Open the dialog, then press **Escape**. Open it again and press Tab a few times. Focus stays trapped inside, just like it should.
3. Add a third FAQ question about opening hours.
4. In the JavaScript pane, add a third review to the list. Your cookie cutter stamps it out for you.

## Check your understanding

<Quiz
	question="Inside a details element, which element holds the always-visible clickable heading?"
	:options="['<legend>', '<summary>', '<caption>', '<header>']"
	:answer-index="1"
	explanation="summary is the question on the outside of the folded note. Everything else stays hidden until it is opened."
/>

<Quiz
	question="What happens to content inside a template element when the page loads?"
	:options="['It is shown at the bottom', 'It is not displayed until JavaScript copies it into the page', 'It is shown in a pop-up', 'It is deleted']"
	:answer-index="1"
	explanation="template is a cookie cutter: its contents are inert and hidden until JavaScript stamps out copies."
/>

<Quiz
	question="Which key closes a modal dialog opened with showModal()?"
	:options="['Enter', 'Tab', 'Escape', 'Space']"
	:answer-index="2"
	explanation="Escape closes a modal dialog automatically, one of the many behaviors you get for free."
/>

## Up next

You now know every major piece of HTML. Seriously. Next, we'll talk about how professionals *use* all these pieces well, and the most common mistakes to avoid, in [Best Practices and Common Mistakes](/lessons/html/best-practices). If you want to look back at why built-in elements beat homemade ones, [Accessibility Basics](/lessons/html/accessibility-basics) makes the full case.
