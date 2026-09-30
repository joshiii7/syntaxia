---
title: "CSS Grid Basics: Columns, Rows, fr Units, and Lines"
description: "Learn CSS Grid from scratch: grid-template-columns and rows, the fr unit, repeat(), gap, placing items with grid lines and span, and when to choose grid over flexbox."
---

# CSS Grid: The Basics

*Flexbox lines furniture up along one wall. Grid lets you lay out the whole floor on graph paper.*

In [Flexbox in Practice](/lessons/css/flexbox-in-practice), I left you with a small puzzle: four cards filled a row, and the fifth card wrapped onto its own line and stretched across the entire width. It looked a bit odd, right? You probably wanted it to sit neatly under the first card, the same size as the others.

Flexbox can't really do that, because flexbox thinks in **one direction at a time**. Each row is its own little world, with no idea what the row above it is doing.

Grid thinks in **two directions at once**: rows *and* columns, lined up with each other. That's what this lesson is about.

## Graph paper for your room

Picture planning a room on a sheet of graph paper. Before you place a single piece of furniture, you decide on the grid: "The floor is three columns wide and two rows deep." Then you place each piece into squares on that grid, and a big sofa can take up two squares side by side.

That's CSS Grid. You draw the lines first, then you place things into the spaces between them.

## Drawing the grid

```css
.gallery {
	display: grid;
	grid-template-columns: 200px 200px 200px;
	gap: 1rem;
}
```

`display: grid` turns the element into a **grid container**, and its direct children become **grid items** (the same "direct children only" rule as flexbox). `grid-template-columns` draws the columns: here, three columns, each 200px wide.

You don't need to say how many rows. Grid just fills items in, left to right, and starts new rows as needed, like people filling seats in a theater row by row. Item four goes under item one, lined up perfectly, because the columns are shared by every row. That's the puzzle solved.

## The `fr` unit: fractions of the floor

Fixed pixel columns don't adapt to different screens. That's where grid's special unit comes in:

```css
.layout {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
}
```

`fr` means "a **fraction** of the free space." Three `1fr` columns split the width into three equal parts, whatever the width is. Change it to `2fr 1fr` and the first column gets two shares for every one share the second gets: two thirds and one third.

You can mix units, too:

```css
grid-template-columns: 250px 1fr;
```

"A 250px sidebar, and the main area takes all the rest." It's the pizza-sharing idea from flexbox, but much more direct.

## `repeat()`: less typing

```css
grid-template-columns: repeat(4, 1fr);
```

Instead of writing `1fr 1fr 1fr 1fr`, `repeat(4, 1fr)` says it once. You'll use this constantly.

## Rows and gaps

```css
.dashboard {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: 100px 300px;
	gap: 1rem 2rem;   /* row gap, then column gap */
}
```

`grid-template-rows` sets row heights the same way. Often you'll leave it out and let rows size themselves to their content. And `gap` works just like it does in flexbox: it's the grout between the tiles.

## Grid lines: the chalk lines

Here's the idea that unlocks placing things wherever you want. Look at a 3-column grid. It has **four** vertical lines: one at the left edge, one between each pair of columns, and one at the right edge. Grid numbers them 1, 2, 3, 4.

```text
 1       2       3       4
 |  col  |  col  |  col  |
```

To place an item, you say which lines it stretches between:

```css
.featured {
	grid-column: 1 / 3;   /* from line 1 to line 3: two columns wide */
	grid-row: 1 / 3;      /* from row line 1 to row line 3: two rows tall */
}
```

Picture the chalk lines on the graph paper: "the sofa goes from line 1 to line 3." It spans two squares.

Counting lines is fiddly, so there's a friendlier way:

```css
.featured {
	grid-column: span 2;
	grid-row: span 2;
}
```

`span 2` means "take up two tracks, starting wherever you'd naturally go." Great for making one photo in a gallery bigger than the others. Negative numbers count from the end, too: `grid-column: 1 / -1` means "from the first line to the last," stretching an item across the entire grid, whatever the number of columns. That one's worth remembering.

## Aligning inside the cells

Grid has alignment properties that mirror flexbox:

```css
.grid {
	justify-items: center;   /* horizontal, inside each cell */
	align-items: center;     /* vertical, inside each cell */
}

.center-everything {
	display: grid;
	place-items: center;     /* both at once */
}
```

That last one is the shortest centering trick in all of CSS: `display: grid; place-items: center;`. Two lines.

## Grid or flexbox?

This is the question everyone asks, so here's the simplest answer I know:

- **Flexbox is for one dimension**: a row *or* a column. A nav bar, a row of buttons, a media object. The content decides the sizes, and items flow.
- **Grid is for two dimensions**: rows *and* columns that need to line up. A gallery, a card grid, a whole page layout. You decide the structure, and items fit into it.

And they work beautifully together. A grid for the overall page, flexbox inside the header. A grid of cards, flexbox inside each card. You'll do exactly that in [CSS Grid in Practice](/lessons/css/grid-in-practice) and [Common Layout Patterns](/lessons/css/layout-patterns).

## See the grid

Your browser's developer tools can draw the grid lines right on the page, with line numbers. Inspect a grid container and look for a small "grid" badge next to it in the Elements panel. Click it. When you're counting lines, this is a lifesaver. ([Debugging Basics](/lessons/ide/debugging-basics) covers how to open these tools.)

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'gallery\'>\n\t<div class=\'tile featured\'>Featured</div>\n\t<div class=\'tile\'>2</div>\n\t<div class=\'tile\'>3</div>\n\t<div class=\'tile\'>4</div>\n\t<div class=\'tile\'>5</div>\n\t<div class=\'tile\'>6</div>\n\t<div class=\'tile wide\'>Full width</div>\n</div>'"
	:initial-css="'.gallery {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(3, 1fr);\n\tgap: 0.75rem;\n\tfont-family: system-ui, sans-serif;\n}\n\n.tile {\n\tpadding: 1.5rem;\n\tbackground: #d8e7ef;\n\tborder-radius: 8px;\n\ttext-align: center;\n}\n\n.featured {\n\tbackground: #f28c28;\n\tcolor: white;\n\t/* Try: grid-column: span 2; grid-row: span 2; */\n}\n\n.wide {\n\tbackground: #6a4c93;\n\tcolor: white;\n\tgrid-column: 1 / -1;\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Uncomment the `grid-column` and `grid-row` lines on `.featured` (remove the `/*` and `*/`). The featured tile becomes a big 2 by 2 square, and the others flow around it.
2. Change the columns to `2fr 1fr 1fr`. Then try `repeat(4, 1fr)`.
3. Change the `.wide` tile to `grid-column: 2 / 4;`. Can you predict where it'll go before you run it?

## Check your understanding

<Quiz
	question="What does grid-template-columns: 2fr 1fr create?"
	:options="['Two columns of 2px and 1px', 'Two columns, the first twice as wide as the second', 'Three equal columns', 'Two rows']"
	:answer-index="1"
	explanation="fr divides the free space into shares. 2fr 1fr gives the first column two thirds and the second one third."
/>

<Quiz
	question="A 4-column grid has how many vertical grid lines?"
	:options="['3', '4', '5', '8']"
	:answer-index="2"
	explanation="There is a line at each edge plus one between each pair of columns, so 4 columns have 5 lines."
/>

<Quiz
	question="Which layout is the best fit for grid rather than flexbox?"
	:options="['A single row of buttons', 'A photo gallery where rows and columns must line up', 'Centering one icon next to text', 'A nav bar with a logo and links']"
	:answer-index="1"
	explanation="Grid is for two-dimensional layouts where rows and columns line up. Flexbox handles one-dimensional rows or columns."
/>

## Up next

Now that you can draw the grid, let's use it for real layouts: a whole page drawn as a floor plan with names, and a card grid that adapts to any screen without a single media query. On to [CSS Grid in Practice](/lessons/css/grid-in-practice).
