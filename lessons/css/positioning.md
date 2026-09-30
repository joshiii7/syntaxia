---
title: "CSS position: relative, absolute, fixed, sticky, z-index"
description: "Take boxes out of the normal flow with position relative, absolute, fixed, and sticky, anchor them with top and left, and control what sits on top with z-index."
---

# Positioning and z-index

*Most boxes sit in their assigned seats. Positioning lets you pin a note to the corner, stick a sign to the window, or let one box float above the rest.*

So far, every box has taken its turn in line. The first one goes at the top, the next one below it, and words flow left to right. This is called **normal flow**, and it's how most of the page should work. It's predictable, and it adapts to any screen size.

But sometimes you need to break the line. A "SALE" badge in the corner of a product card. A header that stays at the top while you scroll. A dropdown menu that floats *over* the content below. For those, we use `position`.

A warning before we start: positioning is powerful and easy to misuse. People new to CSS often try to build entire layouts by positioning every box to exact coordinates, and it falls apart the moment the screen size changes. Use positioning for small, specific jobs. For whole layouts, flexbox and grid (coming up next) are the right tools.

## Think of a classroom

Imagine a classroom where every student has an assigned seat. That's normal flow. Now let's look at the ways a student can end up somewhere else.

## `static`: sitting in your seat

```css
.box {
	position: static;
}
```

This is the default for every element. You're in your assigned seat. `top`, `left`, and friends do nothing at all. You'll rarely write this out, since it's already the case.

## `relative`: leaning in your chair

```css
.nudge {
	position: relative;
	top: 10px;
	left: 20px;
}
```

A relatively positioned box is shifted from where it *would* have been. It's like leaning over in your chair: you move a bit, but your seat is still yours. Nobody else sits in it, and nobody moves over to fill the gap.

Honestly, nudging things is the *least* common use of `relative`. Its real job is the next one: being an **anchor** for absolute positioning.

## `absolute`: a sticky note on the whiteboard

```css
.card {
	position: relative;         /* the anchor */
}

.badge {
	position: absolute;
	top: 12px;
	right: 12px;
}
```

An absolutely positioned box **leaves its seat entirely**. It's removed from the normal flow, so the other boxes close up the gap as if it weren't there. Then it's placed using `top`, `right`, `bottom`, and `left`, measured from the edges of its **anchor**.

What's the anchor? The nearest ancestor that has any position other than `static`. Think of a teacher sticking a note on a whiteboard: "12px from the top, 12px from the right" only makes sense once you know *which* whiteboard. Setting `position: relative` on the `.card` says "this card is the whiteboard."

Forget to set an anchor, and the browser keeps looking up the family tree until it reaches the page itself. That's the classic bug: your "corner badge" ends up in the corner of the *whole page*, far away from the card it belongs to. If an absolute element flies off somewhere strange, check its ancestors for a `position: relative`.

## `fixed`: a sticker on the car window

```css
.chat-button {
	position: fixed;
	bottom: 24px;
	right: 24px;
}
```

A fixed box is positioned relative to the **browser window** itself, and it stays there when you scroll. Think of a sticker on a car window: the scenery rushes past, but the sticker stays in the same spot on the glass.

It's great for a "chat with us" button or a cookie banner. Use it sparingly, though. Every fixed element permanently covers part of the screen, and on a small phone that space is precious.

## `sticky`: a bookmark that catches

```css
.site-header {
	position: sticky;
	top: 0;
}
```

Sticky is a clever mix. The box sits in normal flow, in its seat, *until* you scroll it to the `top` value you set. Then it sticks there, like a bookmark ribbon catching at the top of the page, and it keeps sticking until its parent container scrolls out of view.

It's the modern way to build headers that stay visible while you scroll, and table headers that stay put in long tables. And unlike `fixed`, it still takes up its own space in the flow, so nothing is hidden underneath it at the start.

Two gotchas: sticky needs a `top` (or `bottom`) value to work, and it stops working if an ancestor has `overflow: hidden`. If your sticky header refuses to stick, check those two first.

## `inset`: a handy shorthand

```css
.overlay {
	position: absolute;
	inset: 0;   /* top, right, bottom, and left all 0: fill the anchor */
}
```

`inset` works like the padding shorthand from [The Box Model](/lessons/css/box-model), but for `top`, `right`, `bottom`, and `left`.

## `z-index`: papers on a desk

When positioned boxes overlap, which one is on top?

```css
.dropdown {
	position: absolute;
	z-index: 10;
}

.site-header {
	position: sticky;
	top: 0;
	z-index: 100;
}
```

Picture papers scattered on a desk. `z-index` is how high up in the pile each paper sits. Higher numbers are closer to you. It only works on positioned elements (and on flex and grid children).

Now, the part that drives people up the wall. You set `z-index: 9999` on a dropdown, and it *still* hides behind the header. What?

It's because of **stacking contexts**. Imagine the papers aren't loose. Some of them are inside folders. A paper inside a folder can be at the very top of *that folder's* pile, but it can never rise above a different folder that's sitting on top of it. The folder decides.

Certain properties turn an element into a new "folder": a positioned element with a z-index, anything with `opacity` less than 1, `transform`, and a few others. So when z-index isn't working, don't just add more nines. Look up the family tree and find which folder your element is trapped in. Your browser's developer tools from [Debugging Basics](/lessons/ide/debugging-basics) are the best way to hunt it down.

A tip to avoid the whole mess: keep z-index values small and deliberate, like 1, 10, and 100 for "a little above," "dropdowns," and "headers and dialogs."

## Try it

Scroll inside the preview to see the sticky header in action.

<WebPlayground
	:panes="['css']"
	:initial-html="'<header class=\'site-header\'>Maria\'s Bakery</header>\n\n<div class=\'card\'>\n\t<span class=\'badge\'>SALE</span>\n\t<h3>Sourdough Loaf</h3>\n\t<p>Crusty outside, soft inside.</p>\n</div>\n\n<p class=\'nudge\'>I am nudged with position: relative. My old seat is still reserved.</p>\n\n<p>Scroll down...</p>\n<p>Keep going...</p>\n<p>The header is still with you.</p>\n<p>Almost there.</p>\n<p>The end.</p>\n\n<a class=\'chat-button\' href=\'#\'>Chat</a>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n\tmargin: 0;\n}\n\n.site-header {\n\tposition: sticky;\n\ttop: 0;\n\tz-index: 100;\n\tpadding: 12px 16px;\n\tbackground: #2f6f8f;\n\tcolor: white;\n}\n\n.card {\n\tposition: relative; /* the anchor for the badge */\n\tmax-width: 260px;\n\tmargin: 16px;\n\tpadding: 16px;\n\tborder: 1px solid #dddddd;\n\tborder-radius: 12px;\n}\n\n.badge {\n\tposition: absolute;\n\ttop: 12px;\n\tright: 12px;\n\tpadding: 2px 8px;\n\tbackground: crimson;\n\tcolor: white;\n\tfont-size: 0.75rem;\n\tborder-radius: 4px;\n}\n\n.nudge {\n\tposition: relative;\n\tleft: 24px;\n\tpadding: 0 16px;\n}\n\np {\n\tpadding: 0 16px;\n\tmargin-bottom: 60px;\n}\n\n.chat-button {\n\tposition: fixed;\n\tbottom: 16px;\n\tright: 16px;\n\tpadding: 10px 16px;\n\tbackground: #f28c28;\n\tcolor: white;\n\tborder-radius: 999px;\n\ttext-decoration: none;\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Remove `position: relative` from `.card` and run it. Where does the SALE badge go? Put it back.
2. Move the badge to the bottom-left corner of the card.
3. Change the header from `sticky` to `fixed` and scroll to the top. Notice how the fixed header now covers the start of the content, because it no longer takes up space? (It also shrinks to the width of its text, since a fixed box no longer stretches across its container. Add `left: 0; right: 0;` to stretch it back.)
4. Change the header's `z-index` to `-1` and scroll. What slides over it?

## Check your understanding

<Quiz
	question="An absolutely positioned badge appears in the corner of the whole page instead of its card. What is the most likely fix?"
	:options="['Add z-index: 9999 to the badge', 'Add position: relative to the card', 'Change the badge to position: static', 'Add display: block to the badge']"
	:answer-index="1"
	explanation="Absolute elements are positioned against the nearest positioned ancestor. Making the card relative turns it into the anchor."
/>

<Quiz
	question="Which position value keeps an element in normal flow until you scroll to a threshold, then keeps it in view?"
	:options="['relative', 'absolute', 'fixed', 'sticky']"
	:answer-index="3"
	explanation="sticky acts normally until its top value is reached while scrolling, then it sticks."
/>

<Quiz
	question="You set z-index: 9999 on a dropdown but it still appears behind the header. Why?"
	:options="['z-index has a maximum of 100', 'The dropdown is trapped inside a stacking context below the header', 'z-index only works on images', 'The browser ignores large numbers']"
	:answer-index="1"
	explanation="A z-index only competes within its stacking context. If the dropdown's folder is below the header, no number will lift it out."
/>

## Up next

You've now got every tool for placing individual boxes. It's time for the tool that changed CSS layout forever: [Flexbox: The Basics](/lessons/css/flexbox). If `display` still feels a bit shaky, [Display](/lessons/css/display) is right behind you.
