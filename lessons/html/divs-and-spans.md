---
title: "HTML div and span: The Generic Containers"
description: "Learn what div and span are for, the difference between block and inline containers, and why they should be your last choice after meaningful elements."
---

# Divs and Spans

*Plain cardboard boxes. Endlessly useful, completely silent about what's inside.*

Every element we've met so far says something about its content. `<h2>` says "I'm a section heading." `<ol>` says "order matters here." `<blockquote>` says "someone else said this."

Now meet the two elements that say nothing at all.

## `<div>`: a plain cardboard box

When you're packing to move house, most boxes get labeled: "Kitchen," "Books," "Fragile." But you'll always have a few plain cardboard boxes too. They hold stuff together so it can be carried as one unit. The box itself doesn't tell you anything about what's in it.

`<div>` (short for *division*) is that plain box. It's a block element (remember shelves and books from [Nesting and the DOM](/lessons/html/nesting-and-the-dom)?) that groups other elements together:

```html
<div class="product-card">
	<h3>Ceramic Mug</h3>
	<p>Holds 350 ml. Dishwasher safe.</p>
	<p>$12</p>
</div>
```

Why group them? Almost always, it's for CSS or JavaScript. You want to draw a border around the whole card, or lay three cards side by side, or hide the card when it sells out. The `div` gives you one handle to grab all of it at once. That's why you'll nearly always see a div wearing a `class`.

## `<span>`: a sticky note on a few words

`<span>` is the inline version, a tiny box that fits *inside* a line of text. Think of it as a sticky tab you put on a few words in a book so you can find them later:

```html
<p>Your order ships in <span class="highlight">2 to 3 days</span>.</p>
```

The span doesn't change anything by itself. No bold, no italics, no meaning. It just marks "these words" so CSS can color them or JavaScript can update them (imagine that shipping estimate changing live as someone picks a delivery option).

## So... when should I use them?

Here's the honest answer, and it's the most important sentence in this lesson:

**Use `div` and `span` only when no other element describes your content.**

Before you reach for a div, run through a quick checklist:

- Is it a paragraph? Use `<p>`.
- A list of things? `<ul>` or `<ol>`.
- The main navigation? `<nav>`.
- A blog post or product card that could stand alone? `<article>`.
- An important phrase? `<strong>` or `<em>`.

Only if the answer to everything is "no, I just need a box for styling" does the div or span get the job.

## Div soup

There's a name for pages built almost entirely from divs: **div soup**.

```html
<!-- Div soup -->
<div class="header">
	<div class="title">My Blog</div>
	<div class="menu">
		<div class="menu-item">Home</div>
		<div class="menu-item">About</div>
	</div>
</div>
```

It can look perfectly fine in a browser once it's styled. But imagine a house where every single room is labeled "Room." The kitchen: "Room." The bathroom: "Room." You'd get there eventually, but you'd open a lot of wrong doors first.

That's exactly what this page is like for a screen reader, a search engine, or the developer who has to maintain it next year. There's no heading, no navigation, no list, no links. Just boxes. We'll fix this exact example properly in the very next lesson.

If you've already written some div soup, don't feel bad. Almost every developer has, and plenty of real websites are still full of it. Knowing it's a problem already puts you ahead.

## Try it

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<div class=\'product-card\'>\n\t<h3>Ceramic Mug</h3>\n\t<p>Holds 350 ml. Dishwasher safe.</p>\n\t<p>Ships in <span class=\'highlight\'>2 to 3 days</span>.</p>\n</div>\n\n<div class=\'product-card\'>\n\t<h3>Linen Tea Towel</h3>\n\t<p>Soft, absorbent, and made to last.</p>\n\t<p>Ships in <span class=\'highlight\'>1 day</span>.</p>\n</div>'"
	:initial-css="'/* A sneak peek at CSS: one rule styles every box with this class. */\n.product-card {\n\tborder: 1px solid #ccc;\n\tpadding: 8px 16px;\n\tmargin-bottom: 12px;\n}\n\n.highlight {\n\tbackground: #fff3b0;\n}\n'"
	preview-height="320px"
/>

## Try it yourself

1. Delete the CSS entirely and run it. The divs and spans vanish visually. See how they do nothing on their own?
2. Put the CSS back, then add a third product card. It gets the border automatically, because it wears the same class.
3. Look at the product cards and ask: is a card like this something that could stand on its own? Hold that thought for [Semantic HTML](/lessons/html/semantic-html).

## Check your understanding

<Quiz
	question="What is the main difference between div and span?"
	:options="['div is for text, span is for images', 'div is a block container, span is an inline container', 'span has more meaning than div', 'There is no difference']"
	:answer-index="1"
	explanation="div is a block-level box that groups content; span is an inline box that fits inside a line of text. Neither adds meaning."
/>

<Quiz
	question="You are marking up the site's main menu of links. What should you use?"
	:options="['A div with class menu', 'A span', 'A nav element', 'A table']"
	:answer-index="2"
	explanation="A meaningful element like nav should always win over a generic div when one fits."
/>

<Quiz
	question="What does div soup mean?"
	:options="['A page built almost entirely from generic divs', 'A div nested inside a span', 'A div with too many classes', 'An error message in the browser']"
	:answer-index="0"
	explanation="Div soup is a page made of unlabeled boxes, hard for people, screen readers, and search engines to understand."
/>

## Up next

Time to label the rooms. [Semantic HTML](/lessons/html/semantic-html) turns div soup into a page that anyone can find their way around. If you'd like to see how CSS grabs those classes, [Intro to CSS](/lessons/css/intro-to-css) gives you an early look.
