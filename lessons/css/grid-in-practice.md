---
title: "CSS Grid in Practice: Template Areas and auto-fit"
description: "Build real layouts with CSS Grid: name regions with grid-template-areas, create responsive card grids with repeat, auto-fit, and minmax, and combine grid with flexbox."
---

# CSS Grid in Practice

*You can draw a whole page layout as a little map in your CSS. It's one of the most satisfying things in web development.*

The last lesson gave you the graph paper and the chalk lines. This one is about building real things with them: an entire page layout, and a card grid that rearranges itself for any screen size, with no media queries at all.

Fair warning: some of this syntax looks unusual at first. Especially `grid-template-areas`. But stick with it for a few minutes, because once it clicks, you may find it's your favorite thing in all of CSS.

## A floor plan with names: `grid-template-areas`

When architects sketch a floor plan, they don't write "the room from line 1 to line 3." They draw the shape and write "KITCHEN" in it.

Grid lets you do exactly that:

```css
.page {
	display: grid;
	grid-template-columns: 220px 1fr;
	grid-template-rows: auto 1fr auto;
	grid-template-areas:
		"header  header"
		"sidebar main"
		"footer  footer";
	min-height: 100vh;
	gap: 1rem;
}

.page > header { grid-area: header; }
.page > aside  { grid-area: sidebar; }
.page > main   { grid-area: main; }
.page > footer { grid-area: footer; }
```

Read the `grid-template-areas` value like a map. Each quoted string is one row, and each word is one column:

- Row 1: "header, header." The header spans both columns.
- Row 2: "sidebar, main." Sidebar on the left, main content on the right.
- Row 3: "footer, footer." The footer spans the whole width.

Then each element is assigned to its named area with `grid-area`. That's it. You've drawn the page as a picture, right in your CSS.

Notice the elements: `header`, `aside`, `main`, `footer`. These are the semantic rooms you labeled in [Semantic HTML](/lessons/html/semantic-html). The HTML says what each room *is*; the grid says where each room *goes*.

A few rules for the map:

- Every row must have the same number of columns.
- An area must be a rectangle. No L-shapes.
- Use a `.` for an empty cell: `"header ."`.

## Rearranging the rooms for small screens

Here's where named areas really shine. On a phone, you want everything stacked in one column. With a media query (you'll learn those properly in [Responsive Design and Media Queries](/lessons/css/responsive-design)), you can just redraw the map:

```css
@media (max-width: 700px) {
	.page {
		grid-template-columns: 1fr;
		grid-template-areas:
			"header"
			"main"
			"sidebar"
			"footer";
	}
}
```

Same HTML. A completely different layout. And notice we moved the sidebar *below* the main content on phones, so people see the important stuff first.

(Careful with that power, though. Just like the flexbox `order` warning, the keyboard and screen readers still follow the HTML order. Moving small things around is fine; if the order truly matters, put it right in the HTML.)

## The magic card grid: `auto-fit` and `minmax()`

This next one is a genuine "wait, that's all?" moment:

```css
.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.5rem;
}
```

Let's decode it, from the inside out:

- `minmax(220px, 1fr)`: each column is **at least** 220px, and **at most** one equal share of the space.
- `auto-fit`: instead of a fixed number like `3`, "fit as many columns as you can."
- `repeat(...)`: repeat that column recipe.

So the browser asks: "How many 220px-minimum columns fit across this container?" On a wide screen, maybe four. It makes four columns and stretches them to fill the row evenly. On a tablet, two. On a phone, one. All from a single line of CSS, with no breakpoints.

It's like setting up a room for a party where you tell the chairs "each of you needs at least this much space, and spread out evenly," and they arrange themselves no matter how big the room is.

And unlike the flexbox wrapping version from [Flexbox in Practice](/lessons/css/flexbox-in-practice), a leftover card on the last row stays the same size as the others, lined up neatly in its column. That's the two-dimensional difference.

(There's a close cousin, `auto-fill`. The difference only shows when there are fewer items than would fill a row: `auto-fit` stretches the items to fill the row, `auto-fill` keeps empty invisible columns and leaves the items at their minimum size. `auto-fit` is usually what you want.)

## Rows that size themselves

```css
.cards {
	grid-auto-rows: minmax(150px, auto);
}
```

When grid creates rows automatically, `grid-auto-rows` sets their size. Here: every row at least 150px, but taller if the content needs it. Handy for keeping a card grid tidy even when some cards have very little text.

## Grid outside, flexbox inside

Real components usually mix both. Here's a card grid (grid) where each card lays out its own content (flexbox), with the button always sitting at the bottom of the card, even when the text lengths differ:

```css
.cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.5rem;
}

.card {
	display: flex;
	flex-direction: column;
}

.card .button {
	margin-top: auto;   /* push the button to the bottom */
}
```

Remember the `margin: auto` trick from the nav bar? Same idea, pointed down. The grid makes every card in a row the same height; flexbox pushes each button to the bottom. Every button lines up across the row. Designers love that.

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'page\'>\n\t<header>Header</header>\n\t<aside>Sidebar</aside>\n\t<main>\n\t\t<div class=\'cards\'>\n\t\t\t<article class=\'card\'><h3>Sourdough</h3><p>Tangy and crusty.</p><a class=\'button\' href=\'#\'>Order</a></article>\n\t\t\t<article class=\'card\'><h3>Rye</h3><p>Dense, dark, and full of flavor. Perfect with smoked fish or a sharp cheese.</p><a class=\'button\' href=\'#\'>Order</a></article>\n\t\t\t<article class=\'card\'><h3>Focaccia</h3><p>Olive oil and rosemary.</p><a class=\'button\' href=\'#\'>Order</a></article>\n\t\t\t<article class=\'card\'><h3>Brioche</h3><p>Soft and buttery.</p><a class=\'button\' href=\'#\'>Order</a></article>\n\t\t</div>\n\t</main>\n\t<footer>Footer</footer>\n</div>'"
	:initial-css="'body {\n\tmargin: 0;\n\tfont-family: system-ui, sans-serif;\n}\n\n.page {\n\tdisplay: grid;\n\tgrid-template-columns: 160px 1fr;\n\tgrid-template-areas:\n\t\t\'header  header\'\n\t\t\'sidebar main\'\n\t\t\'footer  footer\';\n\tgap: 0.75rem;\n\tpadding: 0.75rem;\n}\n\n.page > header { grid-area: header; background: #2f6f8f; color: white; padding: 1rem; }\n.page > aside  { grid-area: sidebar; background: #f3f6f8; padding: 1rem; }\n.page > main   { grid-area: main; }\n.page > footer { grid-area: footer; background: #333333; color: white; padding: 1rem; }\n\n.cards {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n\tgap: 0.75rem;\n}\n\n.card {\n\tdisplay: flex;\n\tflex-direction: column;\n\tpadding: 1rem;\n\tborder: 1px solid #dddddd;\n\tborder-radius: 8px;\n}\n\n.card h3 { margin-top: 0; }\n\n.card .button {\n\tmargin-top: auto;\n\tpadding: 0.5rem;\n\ttext-align: center;\n\tbackground: #f28c28;\n\tcolor: white;\n\ttext-decoration: none;\n\tborder-radius: 6px;\n}\n'"
	preview-height="440px"
/>

## Try it yourself

1. Swap the sidebar to the *right* side just by editing the `grid-template-areas` map (and the column sizes).
2. Change `minmax(160px, 1fr)` to `minmax(260px, 1fr)` and watch how many cards fit per row.
3. Remove `margin-top: auto` from the buttons. See how they stop lining up?
4. Add a media query so that below 600px wide, the page becomes one column: header, main, sidebar, footer.

## Check your understanding

<Quiz
	question="In grid-template-areas, what does each quoted string represent?"
	:options="['One column', 'One row', 'One grid item', 'One media query']"
	:answer-index="1"
	explanation="Each string is a row, and each word inside it names the area for one column of that row."
/>

<Quiz
	question="What does repeat(auto-fit, minmax(220px, 1fr)) do?"
	:options="['Always creates exactly 220 columns', 'Fits as many columns of at least 220px as possible, sharing the extra space', 'Creates one column that is 220px wide', 'Only works inside a media query']"
	:answer-index="1"
	explanation="auto-fit creates as many columns as fit, and minmax keeps each one at least 220px while letting them share leftover space."
/>

<Quiz
	question="How can you push a button to the bottom of a flex column card?"
	:options="['position: bottom', 'margin-top: auto on the button', 'vertical-align: bottom', 'grid-row: last']"
	:answer-index="1"
	explanation="In a flex column, an auto top margin absorbs the free space above the button, pushing it to the bottom."
/>

## Up next

You've just built layouts that would have taken professionals days of hacking a decade ago. Seriously. Next, we make sure everything you build looks great on every screen, from a phone to a giant monitor, in [Responsive Design and Media Queries](/lessons/css/responsive-design).
