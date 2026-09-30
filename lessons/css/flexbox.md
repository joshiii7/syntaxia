---
title: "CSS Flexbox Basics: justify-content, align-items, gap"
description: "Learn flexbox from the ground up: flex containers and items, the main and cross axis, flex-direction, justify-content, align-items, and gap, with a live editor to experiment."
---

# Flexbox: The Basics

*Flexbox is arranging furniture along a wall. You pick the wall, then decide how the pieces share the space.*

If you asked web developers from fifteen years ago about their biggest headache, a lot of them would say: "putting three boxes side by side and vertically centering something." It sounds trivial. It was not. People used tables, floats, and all sorts of fragile hacks to pull it off, and every one of them broke in some edge case.

Then flexbox arrived. And the thing that used to take an afternoon of trial and error now takes three lines. If you've been getting frustrated with boxes that won't sit where you want, this is the lesson where that starts to change.

## Turning it on

```css
.row {
	display: flex;
}
```

That's it. The element with `display: flex` becomes a **flex container**, and its **direct children** become **flex items**. Instantly, instead of stacking like shelves, the children line up in a row.

Notice the word "direct." Flexbox only arranges the container's children, not its grandchildren. Remember the family tree from [Nesting and the DOM](/lessons/html/nesting-and-the-dom)? If something inside an item isn't lining up, it's probably a grandchild, and needs its own flex container.

## Furniture along a wall

Here's the picture to keep in your head. You're arranging furniture in a room. You've got a sofa, a side table, and a bookshelf, and you're placing them **along one wall**.

Two decisions matter:

1. **Along the wall:** how do the pieces share the space from one end of the wall to the other? Bunched up at one end? Spread out evenly? Centered?
2. **Out from the wall:** a tall bookshelf and a short side table. Do they line up by their backs against the wall? By their fronts? Does the short one stretch to match?

Flexbox calls these two directions the **axes**:

- The **main axis** runs *along* the wall. By default, left to right.
- The **cross axis** runs *out from* the wall, at a right angle to it. By default, top to bottom.

Every flexbox property works on one axis or the other. Keep that straight and flexbox makes sense. Mix them up (and everyone does at first) and it feels like the properties are doing random things.

## `justify-content`: spacing along the wall

```css
.row {
	display: flex;
	justify-content: space-between;
}
```

`justify-content` controls the **main axis**, how the pieces share the space along the wall:

- `flex-start` (default): everything pushed to the start, like furniture shoved against the left end.
- `flex-end`: pushed to the end.
- `center`: bunched together in the middle.
- `space-between`: first piece at one end, last piece at the other, equal gaps between.
- `space-around`: equal space around each piece, so the ends get half-size gaps.
- `space-evenly`: perfectly equal gaps everywhere, including the ends.

## `align-items`: lining up out from the wall

```css
.row {
	display: flex;
	align-items: center;
}
```

`align-items` controls the **cross axis**, how items of different heights line up:

- `stretch` (default): every item stretches to match the tallest one. That's why flex items in a row often end up equal height, which is secretly one of flexbox's best features.
- `flex-start`: lined up along the top.
- `flex-end`: lined up along the bottom.
- `center`: centered on the cross axis. This is the famous "vertical centering" that used to be so hard.
- `baseline`: lined up along the baseline of their first line of text, the invisible line the letters sit on. Lovely when items have different font sizes.

## `gap`: walking space

```css
.row {
	display: flex;
	gap: 1rem;
}
```

You don't jam furniture right up against each other. You leave walking space. `gap` puts consistent space *between* items, but not on the outside edges. Much cleaner than adding margins to every item and then removing the margin on the last one.

## `flex-direction`: choosing the wall

```css
.column {
	display: flex;
	flex-direction: column;
}
```

Here's the twist that confuses everyone at first. `flex-direction` picks which wall you're lining furniture up against, and that **swaps the axes**:

- `row` (default): the main axis runs left to right.
- `column`: the main axis runs **top to bottom**.

So in a column, `justify-content` now controls *vertical* spacing, and `align-items` controls *horizontal* alignment. The properties didn't change their jobs. The wall rotated. "Along the wall" is now up and down.

If you ever set `justify-content: center` and something centers the "wrong" way, check the `flex-direction`. That's nearly always it.

## The perfect center

Here it is, the three lines that ended fifteen years of suffering:

```css
.center-me {
	display: flex;
	justify-content: center;
	align-items: center;
}
```

Center along the wall, center out from the wall. Whatever's inside sits dead center, no matter its size.

## A word about visual order

Flexbox has properties like `order` and `flex-direction: row-reverse` that change the *visual* order of items without changing the HTML. Use them carefully. As you learned in [Accessibility Basics](/lessons/html/accessibility-basics), keyboard focus and screen readers follow the HTML order. If the screen shows A, B, C but the Tab key goes C, B, A, you've built a confusing page. When order matters, change the HTML.

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'room\'>\n\t<div class=\'furniture sofa\'>Sofa</div>\n\t<div class=\'furniture table\'>Table</div>\n\t<div class=\'furniture shelf\'>Bookshelf</div>\n</div>'"
	:initial-css="'.room {\n\tdisplay: flex;\n\tjustify-content: flex-start;  /* along the wall */\n\talign-items: stretch;         /* out from the wall */\n\tgap: 0.5rem;\n\theight: 220px;\n\tpadding: 8px;\n\tborder: 2px dashed #999999;\n\tfont-family: system-ui, sans-serif;\n}\n\n.furniture {\n\tpadding: 12px;\n\tcolor: white;\n\tborder-radius: 8px;\n}\n\n.sofa { background: #2f6f8f; }\n.table { background: #f28c28; padding-top: 4px; }\n.shelf { background: #6a4c93; }\n'"
	preview-height="260px"
/>

## Try it yourself

Work through these one at a time, and predict the result *before* you press Run:

1. Set `justify-content` to `center`, then `space-between`, then `space-evenly`.
2. Set `align-items` to `flex-start`, then `center`, then `flex-end`. Notice the items stop stretching.
3. Add `flex-direction: column;`. Now try `justify-content: center` again. Which way does it center now?
4. Center all three pieces in the exact middle of the room.

## Check your understanding

<Quiz
	question="In a default flex row, which property spaces items horizontally along the row?"
	:options="['align-items', 'justify-content', 'flex-direction', 'text-align']"
	:answer-index="1"
	explanation="justify-content works on the main axis, which runs left to right in a row."
/>

<Quiz
	question="After setting flex-direction: column, what does justify-content control?"
	:options="['Horizontal spacing', 'Vertical spacing', 'Font size', 'Nothing, it stops working']"
	:answer-index="1"
	explanation="flex-direction: column rotates the main axis to run top to bottom, so justify-content now spaces items vertically."
/>

<Quiz
	question="Which elements does display: flex arrange?"
	:options="['Every element inside the container, at any depth', 'Only the container itself', 'Only the direct children of the container', 'Only images']"
	:answer-index="2"
	explanation="Only direct children become flex items. Grandchildren need their own flex container."
/>

## Up next

You can line things up. Next, you'll learn how items *share* space (who grows, who shrinks) and build real components with it: a navigation bar, a card row, a footer that stays at the bottom. That's [Flexbox in Practice](/lessons/css/flexbox-in-practice). If you'd like to see flexbox's two-dimensional big sibling, [CSS Grid: The Basics](/lessons/css/grid) is a couple of lessons away.
