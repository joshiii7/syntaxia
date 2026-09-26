---
title: "CSS Pseudo-classes and Pseudo-elements Explained"
description: "Select elements by their position or state with pseudo-classes like :nth-child, :not, and :has, and style parts of elements with ::before, ::after, and ::first-letter."
---

# Pseudo-classes and Pseudo-elements

*Some selectors describe where an element is standing. Others point at pieces that aren't in your HTML at all.*

In the last lesson, every selector worked by reading labels you'd written into the HTML: tag names, classes, ids, attributes. But think about how you describe people in real life. Sometimes it's not about their name or their jersey at all:

- "Whoever's **first in line**, you can go in."
- "**Every other** person, step to the left."
- "Anyone who **isn't** wearing a badge, see the front desk."

That's a description based on someone's *situation*, not a label they're wearing. In CSS, that's a **pseudo-class**. ("Pseudo" means "sort of." It's sort of a class, one the browser figures out for you.)

## Pseudo-classes: a single colon

A pseudo-class starts with one colon and gets attached to a normal selector.

### Position in the family

```css
/* The first li among its siblings */
li:first-child {
	font-weight: bold;
}

/* The last one */
li:last-child {
	border-bottom: none;
}

/* Every odd row: 1st, 3rd, 5th... */
tr:nth-child(odd) {
	background: #f3f6f8;
}

/* Every third item: 3rd, 6th, 9th... */
.gallery img:nth-child(3n) {
	margin-right: 0;
}
```

`:nth-child()` is like a teacher counting off students: "one, two, one, two." It accepts `odd`, `even`, a plain number like `3`, or a pattern like `3n` (every third). Striped tables, like the timetable from [Tables](/lessons/html/tables), are a classic use. Every other row gets a light background, and the eye can follow a row across without slipping.

### Not, and one of these

```css
/* Every nav link except the current page */
nav a:not([aria-current="page"]) {
	opacity: 0.8;
}

/* Any of these headings inside an article */
article :is(h2, h3, h4) {
	color: #2f6f8f;
}
```

`:not()` means "except these." `:is()` is a shortcut for a group, so you don't have to write `article h2, article h3, article h4` out longhand.

### The "parent" selector: `:has()`

For years, developers wished CSS could style a parent based on what's inside it. Now it can:

```css
/* Any card that contains an image gets extra padding */
.card:has(img) {
	padding-top: 0;
}

/* A form field wrapper that contains an invalid input */
.field:has(input:user-invalid) {
	border-left: 4px solid crimson;
}
```

Read `.card:has(img)` as "a card that **has** an image inside it." It's surprisingly powerful. Don't worry about mastering it now; just know it exists.

### States, briefly

Pseudo-classes can also describe what's happening *right now*: `:hover` (the mouse is over it), `:focus` (it's selected by keyboard or click), `:checked` (a checkbox is ticked). These are so important for interactivity that they get their own lesson later, [Hover, Focus, and Interactive States](/lessons/css/interactive-states).

## Pseudo-elements: a double colon

Now for the second idea. Think about a letter. You can talk about "the letter," but you can also talk about *parts* of it that aren't separate things: "the first line," "the first letter of the first word." They're not separate pieces of paper, but you can still point at them.

A **pseudo-element** targets a part of an element, or adds a new piece to it. It uses **two** colons:

```css
/* The first letter of every article's first paragraph: a drop cap */
article p:first-of-type::first-letter {
	font-size: 3rem;
	float: left;
	line-height: 1;
	margin-right: 6px;
}

/* The bullet or number of a list item */
li::marker {
	color: #2f6f8f;
}

/* Text the user highlights with their mouse */
::selection {
	background: #fff3b0;
}

/* The placeholder text inside an input */
input::placeholder {
	color: #777777;
}
```

### `::before` and `::after`: bookends

These two are the stars. They insert a brand new, invisible-in-HTML box at the very start or end of an element's content. Think of them as bookends on either side of a row of books: part of the shelf display, but not books themselves.

```css
.required-label::after {
	content: " *";
	color: crimson;
}

blockquote::before {
	content: "“";
	font-size: 3rem;
	color: #2f6f8f;
}
```

The `content` property is required. Without it, the pseudo-element doesn't appear at all, even if it's an empty string (`content: "";`, which is common for purely decorative shapes).

One important caution: content added with `::before` and `::after` is **decoration**. Screen readers handle it inconsistently, and people can't select or copy it. So never put meaningful information there. That red asterisk above is fine *only* if the label also says "(required)" in real text, following the don't-rely-on-color rule from [Accessibility Basics](/lessons/html/accessibility-basics).

## One colon or two?

Quick rule: **one colon for a state or position** (`:hover`, `:first-child`), **two colons for a part or an addition** (`::before`, `::first-letter`). You'll see old code using a single colon for `:before` too. Browsers still accept it, but two is the modern way.

## Try it

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<ul class=\'menu\'>\n\t<li>Sourdough</li>\n\t<li>Rye</li>\n\t<li>Focaccia</li>\n\t<li>Brioche</li>\n\t<li>Baguette</li>\n</ul>\n\n<blockquote>Bread is the warmest, kindest of all words.</blockquote>\n\n<p><label class=\'required-label\' for=\'email\'>Email (required)</label></p>'"
	:initial-css="'.menu li:nth-child(odd) {\n\tbackground: #f3f6f8;\n}\n\n.menu li:first-child {\n\tfont-weight: bold;\n}\n\nli::marker {\n\tcolor: #2f6f8f;\n}\n\nblockquote::before {\n\tcontent: \'“\';\n\tfont-size: 2.5rem;\n\tcolor: #2f6f8f;\n}\n\n.required-label::after {\n\tcontent: \' *\';\n\tcolor: crimson;\n}\n'"
	preview-height="280px"
/>

## Try it yourself

1. Change `odd` to `even`, then to `3n`. Watch which rows get the background.
2. Add a rule with `li:last-child` that makes the last item italic.
3. Highlight some text in the preview, then add a `::selection` rule with a background color you like and try again.

## Check your understanding

<Quiz
	question="Which selector targets every second row of a table, starting with the second?"
	:options="['tr:nth-child(odd)', 'tr:nth-child(even)', 'tr::nth-child(2)', 'tr:first-child']"
	:answer-index="1"
	explanation="even matches the 2nd, 4th, 6th rows and so on. odd would start with the 1st."
/>

<Quiz
	question="What is required for a ::before pseudo-element to appear?"
	:options="['A class on the element', 'A content property', 'An id', 'JavaScript']"
	:answer-index="1"
	explanation="Without content, the pseudo-element is not created, even if it only holds an empty string."
/>

<Quiz
	question="Should important information be placed only in ::after content?"
	:options="['Yes, it is the recommended place', 'No, it is decoration and may not be read or copied reliably', 'Only on mobile', 'Only for headings']"
	:answer-index="1"
	explanation="Generated content is decorative. Anything meaningful belongs in the HTML itself."
/>

## Up next

You can now aim CSS at almost anything. Which raises a question that trips up *everyone*: what happens when two rules aim at the same element and disagree? That's the heart of CSS, and it's next in [The Cascade and Specificity](/lessons/css/cascade-and-specificity).
