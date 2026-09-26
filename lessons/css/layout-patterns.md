---
title: "Common CSS Layout Patterns: Centering, Cards, Sticky"
description: "A cookbook of go-to CSS layouts: centering anything, a content container, sticky headers, a footer that stays at the bottom, responsive card grids, and a sidebar layout."
---

# Common Layout Patterns

*Every experienced cook has a handful of go-to recipes they know by heart. These are yours.*

Watch an experienced cook and you'll notice they don't invent every dish from scratch. They have a handful of base recipes they know by heart: a basic sauce, a good dough, a reliable dressing. Everything else is a variation on those.

Web layout works the same way. Once you've built a few sites, you realize you keep solving the same handful of problems. This lesson is your recipe card collection: tested, reliable patterns you can reach for without thinking. Every one of them uses tools you already know, just combined.

## Recipe 1: Centering anything

"How do I center a div?" is such a famous question that it's become a running joke among developers. Here's the thing: the answer depends on *what* you're centering and in *which direction*. Keep this card handy.

**Text inside a box:**

```css
.heading {
	text-align: center;
}
```

**A box horizontally in the page** (it needs a width smaller than its container):

```css
.container {
	max-width: 40rem;
	margin-inline: auto;
}
```

`margin-inline` is a modern shorthand for left and right margin. Same auto-margin trick from [The Box Model](/lessons/css/box-model).

**Something in the dead center of a box, both directions:**

```css
.hero {
	display: grid;
	place-items: center;
	min-height: 60vh;
}
```

Or with flexbox, if the parent is already a flex container:

```css
.hero {
	display: flex;
	justify-content: center;
	align-items: center;
}
```

**Something on top of something else, centered** (like a play button over a video thumbnail):

```css
.thumbnail {
	position: relative;
}

.play-button {
	position: absolute;
	inset: 0;
	margin: auto;
	width: 64px;
	height: 64px;
}
```

That's four problems that all look like "center it," with four different answers. The joke comes from people trying one answer on the wrong problem.

## Recipe 2: The content container

Almost every website wraps its content in a centered column with a maximum width, so text doesn't stretch across a giant monitor:

```css
.container {
	width: min(100% - 2rem, 70rem);
	margin-inline: auto;
}
```

That `min()` says "use whichever is smaller: the full width minus 1rem of breathing room on each side, or 70rem." On a phone, you get full width with a little gutter. On a big screen, you get a comfortable 70rem column, centered. One line doing the work of a max-width, a width, and padding.

## Recipe 3: The sticky header

```css
.site-header {
	position: sticky;
	top: 0;
	z-index: 100;
	background: white;
}
```

Straight from [Positioning and z-index](/lessons/css/positioning). Give it a background, or the content will show through as it scrolls underneath. And keep it slim on phones, since a big sticky header eats a lot of a small screen.

## Recipe 4: The footer that stays at the bottom

A page with very little content, and the footer floats up into the middle of the screen. You met the flexbox fix in [Flexbox in Practice](/lessons/css/flexbox-in-practice). Here's the grid version, which many people find even cleaner:

```css
body {
	min-height: 100vh;
	display: grid;
	grid-template-rows: auto 1fr auto;
}
```

Three rows: the header takes what it needs (`auto`), the main area takes all the remaining space (`1fr`), and the footer takes what it needs. The footer can't help but sit at the bottom.

This one assumes `<header>`, `<main>`, and `<footer>` are the body's direct children, which is exactly the structure you built in the HTML track. Semantic HTML makes layout easier. Funny how that keeps happening.

## Recipe 5: The responsive card grid

```css
.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
	gap: 1.5rem;
}

.card {
	display: flex;
	flex-direction: column;
	border-radius: 12px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
}

.card img {
	width: 100%;
	aspect-ratio: 16 / 9;
	object-fit: cover;
}

.card .card-body {
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 1rem;
}

.card .button {
	margin-top: auto;
}
```

Grid for the outside, flexbox for the inside. Two new properties sneak in here:

- `aspect-ratio: 16 / 9` keeps every card image the same shape, regardless of the original photo's size.
- `object-fit: cover` makes the image fill that shape without squashing, cropping the edges instead, like the `background-size: cover` from [Backgrounds, Borders, and Shadows](/lessons/css/backgrounds-and-borders), but for a real `<img>` that keeps its alt text.

`overflow: hidden` on the card clips the image's corners to the card's rounded corners.

## Recipe 6: The sidebar that wraps by itself

Here's a clever one. A sidebar next to the main content on wide screens that drops underneath on narrow screens, with **no media query**:

```css
.with-sidebar {
	display: flex;
	flex-wrap: wrap;
	gap: 2rem;
}

.with-sidebar > aside {
	flex: 1 1 15rem;
}

.with-sidebar > main {
	flex: 999 1 30rem;
}
```

The main content has an enormous grow value, so whenever they fit side by side, it takes nearly all the extra space and the sidebar stays around 15rem. When the container gets too narrow for both minimums to fit, they wrap, and each takes a full row. It's a lovely example of letting the content decide the breakpoint.

## Recipe 7: Even spacing in a stack

Want consistent vertical space between elements, without margins doubling up or leaving extra space at the end?

```css
.stack {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
```

Remember margin collapsing from [The Box Model](/lessons/css/box-model)? `gap` sidesteps it entirely. The space goes only *between* items, never outside.

## "Which recipe do I use?"

When you face a new layout, try describing it out loud:

- "These things sit in **one row or column**." Flexbox.
- "These things form a **grid of rows and columns**." Grid.
- "This one thing needs to **float on top** or stay pinned." Positioning.
- "This whole page has **regions**." Grid with template areas.

Most real pages use all of them, nested inside each other. That's not over-complicated. That's just cooking.

## Try it

Here's a small page built entirely from these recipes. Resize your browser window to watch the cards and sidebar rearrange.

<WebPlayground
	:panes="['css']"
	:initial-html="'<header class=\'site-header\'><div class=\'container\'><strong>Maria\'s Bakery</strong></div></header>\n<main class=\'container\'>\n\t<section class=\'hero\'><h1>Bread worth waking up for</h1></section>\n\t<div class=\'with-sidebar\'>\n\t\t<aside><h2>Hours</h2><p>7am to 5pm daily.</p></aside>\n\t\t<div class=\'cards\'>\n\t\t\t<article class=\'card\'><div class=\'card-body\'><h3>Sourdough</h3><p>Tangy and crusty.</p><a class=\'button\' href=\'#\'>Order</a></div></article>\n\t\t\t<article class=\'card\'><div class=\'card-body\'><h3>Rye</h3><p>Dense and dark, full of flavor.</p><a class=\'button\' href=\'#\'>Order</a></div></article>\n\t\t\t<article class=\'card\'><div class=\'card-body\'><h3>Focaccia</h3><p>Olive oil, rosemary, and sea salt.</p><a class=\'button\' href=\'#\'>Order</a></div></article>\n\t\t</div>\n\t</div>\n</main>\n<footer><div class=\'container\'>Made with care.</div></footer>'"
	:initial-css="'body {\n\tmargin: 0;\n\tmin-height: 100vh;\n\tdisplay: grid;\n\tgrid-template-rows: auto 1fr auto;\n\tfont-family: system-ui, sans-serif;\n}\n\n.container {\n\twidth: min(100% - 2rem, 70rem);\n\tmargin-inline: auto;\n}\n\n.site-header {\n\tposition: sticky;\n\ttop: 0;\n\tz-index: 100;\n\tpadding: 0.75rem 0;\n\tbackground: #2f6f8f;\n\tcolor: white;\n}\n\n.hero {\n\tdisplay: grid;\n\tplace-items: center;\n\tmin-height: 8rem;\n\ttext-align: center;\n}\n\n.with-sidebar {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: 1.5rem;\n}\n\n.with-sidebar > aside { flex: 1 1 10rem; }\n.with-sidebar > .cards { flex: 999 1 20rem; }\n\n.cards {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));\n\tgap: 1rem;\n}\n\n.card {\n\tdisplay: flex;\n\tflex-direction: column;\n\tborder-radius: 12px;\n\tbox-shadow: 0 2px 8px rgb(0 0 0 / 0.08);\n}\n\n.card-body {\n\tdisplay: flex;\n\tflex-direction: column;\n\tflex: 1;\n\tpadding: 1rem;\n}\n\n.card .button {\n\tmargin-top: auto;\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #f28c28;\n\tcolor: white;\n\ttext-decoration: none;\n\tborder-radius: 6px;\n}\n\nfooter {\n\tpadding: 1rem 0;\n\tbackground: #333333;\n\tcolor: white;\n}\n'"
	preview-height="460px"
/>

## Try it yourself

1. Delete two of the cards. Does the footer still stay at the bottom of the preview?
2. Add an image to the first card using `<img>` with `aspect-ratio` and `object-fit: cover`. (You can use `alt` text and a missing `src` to see the shape it reserves.)
3. Change the hero from grid centering to flexbox centering. Same result, different recipe.

## Check your understanding

<Quiz
	question="Which pattern keeps a footer at the bottom of a short page?"
	:options="['position: absolute on the footer', 'A body grid with grid-template-rows: auto 1fr auto and min-height: 100vh', 'margin-bottom: 0 on the footer', 'float: bottom']"
	:answer-index="1"
	explanation="The middle 1fr row absorbs all the extra space, which pushes the footer to the bottom."
/>

<Quiz
	question="What does object-fit: cover do to an img?"
	:options="['Hides the image', 'Fills the box without distortion by cropping the edges', 'Stretches the image to fit exactly', 'Adds a border around it']"
	:answer-index="1"
	explanation="cover fills the box while keeping the image's proportions, cropping whatever does not fit."
/>

<Quiz
	question="A layout of items that must line up in both rows and columns calls for..."
	:options="['Flexbox', 'Grid', 'position: fixed', 'float']"
	:answer-index="1"
	explanation="Grid is designed for two-dimensional layouts where rows and columns align."
/>

## Up next

You can build real layouts now. The next lesson is about building them *well*: how professionals organize their CSS, the mistakes that turn stylesheets into a mess, and how to debug when a layout just won't cooperate. That's [Best Practices and Common Mistakes](/lessons/css/best-practices).
