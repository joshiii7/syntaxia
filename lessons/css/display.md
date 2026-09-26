---
title: "CSS display: block, inline, inline-block, and none"
description: "Understand how boxes flow with display: block, inline, inline-block, and none, the difference between display: none and visibility: hidden, and how overflow works."
---

# Display

*Some boxes stack like shelves. Others flow like words in a sentence. The display property decides which.*

Have you tried giving a link a `width` yet, and watched absolutely nothing happen? Or added `margin-top` to a `<span>` and seen no gap appear? It's baffling the first time. You're writing perfectly good CSS and the browser is just... ignoring you.

It isn't ignoring you. It's following the rules of **display**, and once you know them, all of that behavior makes sense.

## Shelves and books, again

Back in [Nesting and the DOM](/lessons/html/nesting-and-the-dom), we talked about block elements as shelves and inline elements as books sitting on those shelves. That wasn't just a metaphor for HTML. It's exactly what the CSS `display` property controls.

### `display: block`: the shelf

```css
.shelf {
	display: block;
}
```

Block boxes, like `<p>`, `<h1>`, `<div>`, `<section>`, and `<li>`:

- start on a **new line**,
- stretch to fill the **full width** of their container by default,
- respect `width`, `height`, `margin`, and `padding` on every side.

A shelf takes up the whole wall, and the next shelf goes underneath it.

### `display: inline`: the words

```css
.word {
	display: inline;
}
```

Inline boxes, like `<a>`, `<span>`, `<strong>`, and `<em>`:

- sit **in the line of text**, flowing along like words in a sentence,
- are only as wide as their content,
- **ignore `width` and `height`**,
- have padding and margin on the left and right that push neighbors away, but top and bottom margins that do **nothing** to the lines around them.

That last point is the one that catches everyone. Why would the browser ignore a vertical margin? Think about a word in the middle of a paragraph. If one word could push itself 40px downward, it would tear the line apart. Inline boxes follow the line, and the line decides the height. Their vertical padding *is* painted (the background grows), but it just overlaps the lines above and below instead of moving them.

### `display: inline-block`: the Scrabble tile

```css
.tag {
	display: inline-block;
	padding: 4px 12px;
	margin: 4px;
	border-radius: 999px;
	background: #d8e7ef;
}
```

What if you want something that sits in a line, like a word, but has a proper solid size, like a box? Think of Scrabble tiles on a rack: they sit side by side in a row, but each one is a sturdy little square with its own dimensions.

That's `inline-block`. It flows in the line like inline, and it respects width, height, padding, and margin like block. It's perfect for things like tags, badges, and buttons that sit in a row.

## Changing an element's display

Here's the important part: **display is a style, not a meaning.** You can change it on any element:

```css
nav a {
	display: block;      /* each link fills its row, making a bigger click area */
}

.menu li {
	display: inline-block;  /* list items side by side instead of stacked */
}
```

The `<a>` is still a link, and the list is still a list, as far as HTML and screen readers are concerned. You've only changed how it's arranged on screen. That's the separation of structure and presentation from [What CSS Is and Why It Exists](/lessons/css/intro-to-css) in action: choose the element for its meaning, then choose its display for the layout.

## Hiding things: `none` vs `hidden`

```css
.sold-out-banner {
	display: none;
}

.placeholder {
	visibility: hidden;
}
```

Both make an element disappear, but very differently. Picture a chair in a room:

- `display: none` **carries the chair out of the room.** It's gone. Everything else shifts to fill the empty space. Screen readers don't see it either.
- `visibility: hidden` **throws a magic invisibility sheet over the chair.** You can't see it, but it's still taking up floor space, so nothing moves.

Use `display: none` when something truly shouldn't be there right now, like a closed menu. Use `visibility: hidden` when you need to keep the space reserved so the layout doesn't jump.

(Remember the HTML `hidden` attribute from [Attributes Deep Dive](/lessons/html/attributes-deep-dive)? Under the hood, the browser applies `display: none` to it.)

## Overflow: an overstuffed suitcase

Sometimes content is bigger than its box. A long word in a narrow column. A tall list in a short container. What happens then?

```css
.box {
	height: 120px;
	overflow: auto;
}
```

Think of a suitcase that's too full:

- `overflow: visible` (the default): the clothes spill out over the sides. Content pokes out of the box and overlaps whatever's below.
- `overflow: hidden`: you sit on the lid and force it shut. Anything that doesn't fit gets cut off and hidden.
- `overflow: auto`: you add an expandable zip. A scrollbar appears only if it's needed.
- `overflow: scroll`: the scrollbar is always there, needed or not.

Be careful with `hidden`. It's tempting as a quick fix, but it can chop off content people need, like the end of a sentence or a focus outline. `auto` is usually the safer choice.

## One more thing: flex and grid are display values too

Here's a teaser. The two most powerful layout systems in CSS are switched on with... `display`:

```css
.row {
	display: flex;
}

.gallery {
	display: grid;
}
```

Everything you've learned here is the old, basic flow of the page. `flex` and `grid` change the rules for the *children* of a box, and they make laying out rows, columns, and whole pages dramatically easier. You'll meet them properly in [Flexbox: The Basics](/lessons/css/flexbox) and [CSS Grid: The Basics](/lessons/css/grid). First, though, one more tool: moving boxes around with [Positioning and z-index](/lessons/css/positioning).

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<p>These are inline links: <a class=\'demo\' href=\'#\'>Home</a> <a class=\'demo\' href=\'#\'>About</a> <a class=\'demo\' href=\'#\'>Contact</a></p>\n\n<p>Tags: <span class=\'tag\'>sourdough</span><span class=\'tag\'>vegan</span><span class=\'tag\'>weekend</span></p>\n\n<div class=\'chairs\'>\n\t<span class=\'chair\'>Chair 1</span>\n\t<span class=\'chair gone\'>Chair 2</span>\n\t<span class=\'chair\'>Chair 3</span>\n</div>\n\n<div class=\'suitcase\'>Socks. Shirts. Sweaters. A raincoat. Two books. A travel pillow. Snacks. More socks. Sunscreen. A spare charger. Sandals. A hat.</div>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n}\n\n.demo {\n\twidth: 200px;              /* ignored: inline */\n\tmargin-top: 30px;          /* ignored: inline */\n\tpadding: 8px;\n\tbackground: #d8e7ef;\n}\n\n.tag {\n\tpadding: 4px 12px;\n\tmargin: 4px;\n\tborder-radius: 999px;\n\tbackground: #fff3b0;\n}\n\n.chair {\n\tdisplay: inline-block;\n\tpadding: 12px;\n\tbackground: #f3f6f8;\n\tborder: 1px solid #cccccc;\n}\n\n.gone {\n\tdisplay: none;\n}\n\n.suitcase {\n\twidth: 200px;\n\theight: 60px;\n\tborder: 2px solid #2f6f8f;\n\tmargin-top: 16px;\n\toverflow: visible;\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Add `display: inline-block;` to `.demo`. Now the width and margin work.
2. Change `.gone` from `display: none` to `visibility: hidden`. Chair 3 stays put, and there's an empty gap where Chair 2 was.
3. Try `overflow: hidden`, then `overflow: auto` on the suitcase. Which one would you trust with real content?
4. Notice the tags ignore their vertical margin. Make them `inline-block` and see the difference.

## Check your understanding

<Quiz
	question="Why does width have no effect on a plain a element?"
	:options="['Links cannot be styled', 'a is inline by default, and inline boxes ignore width and height', 'width only works in px', 'The browser needs a height first']"
	:answer-index="1"
	explanation="Inline boxes size themselves to their content. Change display to inline-block or block to set a width."
/>

<Quiz
	question="What is the difference between display: none and visibility: hidden?"
	:options="['There is no difference', 'none removes the element and its space; hidden keeps its space', 'hidden removes the space; none keeps it', 'none only works on divs']"
	:answer-index="1"
	explanation="display: none carries the chair out of the room. visibility: hidden throws a sheet over it, so it still takes up space."
/>

<Quiz
	question="Which overflow value adds a scrollbar only when content does not fit?"
	:options="['visible', 'hidden', 'auto', 'scroll']"
	:answer-index="2"
	explanation="auto shows a scrollbar only when needed. scroll shows one all the time."
/>

## Up next

Normal flow puts boxes in order, one after another. But what if you need to pin a badge to a corner, or keep a header on screen while you scroll? That's [Positioning and z-index](/lessons/css/positioning).
