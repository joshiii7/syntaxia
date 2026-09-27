---
title: "HTML Global Attributes and data-* Explained"
description: "Go beyond the basics with global attributes like hidden, lang, tabindex, and contenteditable, and store your own information on elements with data-* attributes."
---

# Attributes Deep Dive

*Some attributes work on every element. And some you get to invent yourself.*

Back in [Attributes](/lessons/html/attributes), you learned that attributes are the details written on an element's label. Since then you've used a whole bunch of them: `href`, `src`, `alt`, `for`, `required`, `scope`. Most of those only make sense on specific elements. An `href` on a paragraph means nothing.

Now that you've seen a lot of elements, we can look at attributes from the other direction: the ones that work *everywhere*, and the ones you create for your own purposes.

## Global attributes: features every appliance has

Walk around your kitchen. The toaster, the kettle, the microwave, the blender. They all do different jobs, but nearly all of them share a few features: a power switch, a plug, a brand label. Those features aren't about toasting or boiling. They're just things every appliance has.

**Global attributes** are those shared features. They work on any HTML element. You already know three of them:

- `id`: a unique name tag.
- `class`: a team jersey.
- `title`: a tooltip with extra info.

Here are the others worth knowing.

### `lang`: which language is this?

You put `lang="en"` on the `<html>` element back in [Anatomy of an HTML Document](/lessons/html/basic-structure). But you can also use it on any element that switches language partway through:

```html
<p>My grandmother always said <span lang="es">"poco a poco"</span>, little by little.</p>
```

A screen reader will switch to a Spanish voice for those two words instead of mangling them with English pronunciation. Small touch, big difference.

### `dir`: which way does the text flow?

Some languages, like Arabic and Hebrew, read right to left. `dir="rtl"` tells the browser to flip the text direction for that element. `dir="auto"` lets the browser work it out, which is handy for content typed by users, like comments.

### `hidden`: out of sight, for everyone

```html
<p hidden>This paragraph is not shown to anyone.</p>
```

`hidden` removes an element from the page completely: not shown, not read by screen readers. It's useful for content JavaScript will reveal later, like a "Thanks for subscribing!" message.

### `tabindex`: joining the keyboard line

Some people navigate entirely with the keyboard, pressing Tab to hop from link to button to input. Think of it as a queue that only certain elements are allowed into (links, buttons, and form controls are in it automatically).

- `tabindex="0"` lets an element join the queue in its natural place.
- `tabindex="-1"` means "not in the queue, but code can still move focus here." Handy for things like jumping focus to an error message.
- A positive number like `tabindex="5"` lets an element cut to the front of the line. **Avoid this.** It scrambles the order in a way that's very confusing for keyboard users.

We'll dig into why the order of that queue matters so much in [Accessibility Basics](/lessons/html/accessibility-basics).

### `contenteditable` and `spellcheck`

```html
<p contenteditable="true">Click me and start typing. Yes, really.</p>
```

`contenteditable` lets people edit an element's text right on the page. This is the seed that notes apps and online document editors grow from. `spellcheck="false"` turns off the squiggly red lines, useful in a box where people type code or usernames.

### `style`: you'll see it, but hold off

`style` lets you write CSS right on an element, like `<p style="color: red">`. It works, and you'll see it in lots of code online. But it mixes appearance into your structure, which makes pages harder to maintain. When you get to CSS, you'll learn to keep styles in their own file. For now, just know what it is when you see it.

## `data-*`: the back of the name badge

Picture a conference name badge. The front says "Maria, Designer." That's for everyone. But flip it over and the organizers have written notes for staff only: "Vegetarian meal. Workshop B. Checked in."

`data-*` attributes are the back of the badge. They let you attach your own private information to any element, for your own CSS and JavaScript to use later:

```html
<article class="product-card" data-product-id="1042" data-stock="3" data-category="kitchen">
	<h3>Ceramic Mug</h3>
	<p>Holds 350 ml.</p>
</article>
```

The rules are simple:

- The name must start with `data-`.
- After that, use lowercase words joined by hyphens: `data-product-id`, `data-stock`.
- The value is always text.

Visitors never see these. But later, your JavaScript could read `data-stock` and show "Only 3 left!", or your CSS could give every `data-category="kitchen"` card a little icon. You'll see exactly how in the [JavaScript track](/lessons/javascript/intro-to-javascript).

## "Can't I just make up my own attribute names?"

You might be tempted to write something shorter:

```html
<!-- Don't -->
<article productid="1042" stock="3">
```

It'll probably seem to work. But HTML is a living standard that keeps growing, and if a future version adds a real `stock` attribute that does something, your page could suddenly behave in strange ways. Invented attributes also fail HTML validators, the tools that check your code for mistakes.

The `data-` prefix is a promise from the people who write the HTML standard: "We will never create an official attribute starting with `data-`. That space is yours." It's like a reserved parking spot. Always use it.

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<p>My grandmother always said <span lang=\'es\'>poco a poco</span>, little by little.</p>\n\n<p contenteditable=\'true\'>Click this paragraph and start typing. Yes, really.</p>\n\n<p hidden>You cannot see me.</p>\n\n<p dir=\'rtl\'>This line flows right to left.</p>\n\n<article data-product-id=\'1042\' data-stock=\'3\'>\n\t<h3 title=\'Handmade in small batches\'>Ceramic Mug</h3>\n\t<p>Holds 350 ml.</p>\n</article>'"
	preview-height="300px"
/>

## Try it yourself

1. Click the editable paragraph and change its text.
2. Remove `hidden` from the hidden paragraph so it appears.
3. Add a `data-color` attribute to the mug article. Did anything change on the page? (It shouldn't. That's the point.)

## Check your understanding

<Quiz
	question="What makes an attribute global?"
	:options="['It works on any HTML element', 'It works on every website', 'It is only used in the head', 'It must be on the html element']"
	:answer-index="0"
	explanation="Global attributes, like id, class, lang, and hidden, can be used on any element."
/>

<Quiz
	question="Which is the correct way to store a product ID on an element for your own scripts?"
	:options="['productid=1042', 'data-product-id=1042', 'id-product=1042', 'custom-id=1042']"
	:answer-index="1"
	explanation="Custom data belongs in data-* attributes, a space the HTML standard reserves for you."
/>

<Quiz
	question="Why should you avoid tabindex values like 5?"
	:options="['They are too large for the browser', 'They scramble the natural keyboard order', 'They hide the element', 'They only work on links']"
	:answer-index="1"
	explanation="Positive tabindex values let elements jump the queue, which makes keyboard navigation confusing."
/>

## Up next

We've mentioned screen readers, keyboard users, and labels a lot. Now it's time to bring it all together in [Accessibility Basics](/lessons/html/accessibility-basics).
