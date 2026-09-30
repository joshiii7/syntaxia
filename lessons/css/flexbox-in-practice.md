---
title: "Flexbox in Practice: flex-grow, flex-wrap, Real Layouts"
description: "Share space with flex-grow, flex-shrink, and flex-basis, wrap items onto new lines, and build real components: a navigation bar, a card row, and a media object."
---

# Flexbox in Practice

*Knowing the properties is one thing. Building a real navigation bar with them is where it clicks.*

In [Flexbox: The Basics](/lessons/css/flexbox), you learned to line things up along a wall. Now we'll answer the question that comes next: when there's extra space (or not enough), who gets it? Then we'll build the components you'll see on almost every website you visit.

## Sharing space: `flex-grow`

Imagine three friends sharing a pizza, and there's some left over after everyone takes their first slice. How do you split the leftovers?

```css
.sidebar {
	flex-grow: 0;   /* takes no leftovers */
}

.main {
	flex-grow: 1;   /* takes all the leftovers */
}
```

`flex-grow` sets how many *shares* of the leftover space an item gets. It's a ratio, not a size:

- All items at `flex-grow: 1`: the leftovers are split equally.
- One item at `2` and another at `1`: the first gets twice as much of the *extra* as the second.
- An item at `0` (the default): it takes none of the extra and stays its natural size.

That's perfect for "the sidebar stays its size, the main content fills the rest."

## Giving back space: `flex-shrink`

Now the opposite: there isn't enough pizza. The boxes are wider than their container, so somebody has to give some back.

```css
.logo {
	flex-shrink: 0;   /* never squash me */
}
```

`flex-shrink` decides who gives up space when things are too tight. It's `1` by default, meaning everyone shrinks a bit. Setting it to `0` says "I refuse to shrink," which is exactly what you want for logos, avatars, and icons that look terrible squashed.

## A starting size: `flex-basis`

```css
.card {
	flex-basis: 250px;
}
```

`flex-basis` is an item's starting size *before* the growing and shrinking happens, the size of the first slice before anyone shares the leftovers. Think of it as a smarter `width` for flex items.

## The shorthand: `flex`

You'll usually set all three at once with `flex`:

```css
.main {
	flex: 1;          /* grow: 1, shrink: 1, basis: 0 (share the space equally) */
}

.card {
	flex: 1 1 250px;  /* start at 250px, then grow or shrink as needed */
}

.logo {
	flex: none;       /* grow: 0, shrink: 0, basis: auto (stay exactly your size) */
}
```

`flex: 1` is by far the most common value you'll write. It means "take your fair share of whatever space there is."

## Wrapping onto new lines

By default, flex items squeeze into a single line no matter how many there are. Six cards in a narrow container? They'll all get crushed into a thin row.

```css
.card-row {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
}

.card {
	flex: 1 1 250px;
}
```

`flex-wrap: wrap` lets items move onto a new line when they run out of room, like words wrapping in a paragraph. Combine it with `flex: 1 1 250px` and you get a genuinely clever layout: each card wants to be about 250px, they fill each line, they grow to use the leftover space, and when the screen gets narrow they wrap. Three across on a laptop, two on a tablet, one on a phone, with no media queries at all. You'll learn about those in [Responsive Design and Media Queries](/lessons/css/responsive-design), but it's nice to know flexbox handles a lot of it by itself.

## Pattern 1: the navigation bar

Here's the most common flexbox layout on the web. Logo on the left, links on the right, everything vertically centered.

```css
.site-header {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
}

.site-nav {
	margin-left: auto;
}

.site-nav ul {
	display: flex;
	gap: 1.5rem;
	list-style: none;
	margin: 0;
	padding: 0;
}
```

Look at `margin-left: auto`. In a flex container, an auto margin soaks up *all* the free space on that side, shoving the nav as far right as it can go. It's like pushing one piece of furniture into the far corner. And notice the nav itself is a flex container too, turning the `<ul>` you built in [Links and Navigation](/lessons/html/links) into a horizontal row. Flex containers inside flex items is completely normal. It's flexbox all the way down. (`list-style: none` removes the bullets, and `margin: 0; padding: 0` removes the browser's default list indent.)

## Pattern 2: the media object

An image on one side, text on the other. Comments, reviews, notifications, chat messages. It's everywhere.

```css
.media {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
}

.media img {
	flex-shrink: 0;
}
```

The image refuses to shrink, and the text takes whatever width is left. Simple, sturdy, and it works at any width.

## Pattern 3: a footer that stays at the bottom

You've probably seen a page with very little content where the footer floats awkwardly in the middle of the screen. Here's the fix:

```css
body {
	display: flex;
	flex-direction: column;
	min-height: 100dvh;   /* the phone-friendly viewport unit from Units */
	margin: 0;
}

main {
	flex: 1;
}
```

The body becomes a column at least as tall as the window. `main` gets `flex: 1`, so it grows to eat all the spare space, which pushes the footer down to the bottom. Short page, long page, it just works. You'll see this again in [Common Layout Patterns](/lessons/css/layout-patterns).

## When things won't cooperate

Flexbox is forgiving, but a few problems come up again and again:

- **"My text won't wrap and it's overflowing."** Flex items won't shrink smaller than their content by default. Add `min-width: 0` to the item that holds the long text.
- **"justify-content does nothing."** Is there actually any free space? If the items already fill the whole row, there's nothing to distribute.
- **"It's centering the wrong way."** Check `flex-direction`. The axes may have swapped.

Each of these has cost every developer at least one frustrating afternoon. Now you know them in advance.

## Try it

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<header class=\'site-header\'>\n\t<strong class=\'logo\'>Maria\'s Bakery</strong>\n\t<nav class=\'site-nav\'>\n\t\t<ul>\n\t\t\t<li><a href=\'#\'>Menu</a></li>\n\t\t\t<li><a href=\'#\'>About</a></li>\n\t\t\t<li><a href=\'#\'>Contact</a></li>\n\t\t</ul>\n\t</nav>\n</header>\n\n<div class=\'card-row\'>\n\t<div class=\'card\'>Sourdough</div>\n\t<div class=\'card\'>Rye</div>\n\t<div class=\'card\'>Focaccia</div>\n\t<div class=\'card\'>Brioche</div>\n</div>\n\n<div class=\'media\'>\n\t<div class=\'avatar\'></div>\n\t<p>Ana wrote: The rye bread was wonderful. Dense, tangy, and perfect with butter. I will be back next week!</p>\n</div>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n\tmargin: 0;\n}\n\n.site-header {\n\tdisplay: flex;\n\talign-items: center;\n\tgap: 1rem;\n\tpadding: 1rem;\n\tbackground: #2f6f8f;\n\tcolor: white;\n}\n\n.site-nav {\n\tmargin-left: auto;\n}\n\n.site-nav ul {\n\tdisplay: flex;\n\tgap: 1.5rem;\n\tlist-style: none;\n\tmargin: 0;\n\tpadding: 0;\n}\n\n.site-nav a {\n\tcolor: white;\n}\n\n.card-row {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 1rem;\n\tpadding: 1rem;\n}\n\n.card {\n\tflex: 1 1 150px;\n\tpadding: 1.5rem;\n\tbackground: #f3f6f8;\n\tborder-radius: 8px;\n}\n\n.media {\n\tdisplay: flex;\n\talign-items: flex-start;\n\tgap: 1rem;\n\tpadding: 1rem;\n}\n\n.avatar {\n\tflex-shrink: 0;\n\twidth: 48px;\n\theight: 48px;\n\tborder-radius: 50%;\n\tbackground: #f28c28;\n}\n\n.media p {\n\tmargin: 0;\n}\n'"
	preview-height="400px"
/>

## Try it yourself

1. Remove `margin-left: auto` from `.site-nav`. Where do the links go? Put it back.
2. Drag your browser window narrower (or read the preview on your phone) and watch the cards wrap. Then change `150px` to `250px`.
3. Remove `flex-shrink: 0` from `.avatar` and make the preview narrow. Does the circle get squashed into an oval?
4. Add a fifth card. It wraps onto its own line and stretches to fill it. Is that what you'd want? (If not, grid might be the better tool. Hold that thought.)

## Check your understanding

<Quiz
	question="What does flex: 1 on every item in a row do?"
	:options="['Makes every item 1px wide', 'Shares the available space equally between the items', 'Stops items from shrinking', 'Puts each item on its own line']"
	:answer-index="1"
	explanation="flex: 1 gives every item one equal share of the space."
/>

<Quiz
	question="How do you push the nav to the right side of a flex header?"
	:options="['float: right', 'margin-left: auto on the nav', 'justify-content: left', 'position: right']"
	:answer-index="1"
	explanation="In a flex container, an auto margin absorbs all the free space on that side, pushing the item away."
/>

<Quiz
	question="Which property lets flex items move onto a new line when they run out of room?"
	:options="['flex-grow', 'flex-wrap: wrap', 'align-items: wrap', 'white-space: wrap']"
	:answer-index="1"
	explanation="flex-wrap: wrap allows items to flow onto additional lines."
/>

## Up next

Flexbox thinks in **one direction** at a time: a row, or a column. But what about layouts that need rows *and* columns at once, like a photo gallery or a whole page with a header, sidebar, and footer? That's what [CSS Grid: The Basics](/lessons/css/grid) is for.
