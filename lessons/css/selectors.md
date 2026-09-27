---
title: "CSS Selectors: Element, Class, ID, and Attribute"
description: "Point your CSS at exactly the right elements with type, class, id, attribute, grouping, and combinator selectors, using the labels you already put on your HTML."
---

# Selectors

*A selector is how you call out to someone in a crowd. The trick is calling out to exactly the right people.*

Imagine you're standing on a stage in front of a big crowd, holding a microphone. You need to give instructions. How do you get the right people to listen?

- "**Everyone**, please stand up."
- "All **teachers**, raise your hand."
- "Everyone wearing a **red team jersey**, move to the left."
- "**Maria Santos**, please come to the front."
- "Anyone **carrying an umbrella**, leave it at the door."

Each of those is a different way of choosing who the instruction is for. CSS selectors work exactly the same way. And here's the good news: you already did the hard part in the HTML track, when you gave your elements tags, classes, and ids. Now those labels pay off.

## Type selectors: "all teachers"

```css
p {
	line-height: 1.6;
}
```

A plain element name selects every element of that type. Every `<p>`, everywhere on the page. It's broad, which is great for setting base styles, like "all paragraphs are comfortable to read."

## Class selectors: "everyone in a red jersey"

```css
.price {
	color: #2f6f8f;
	font-weight: bold;
}
```

A dot followed by a class name selects every element wearing that class, whatever type of element it is. Remember the team jersey analogy from [Attributes](/lessons/html/attributes)? This is the coach calling out to the whole team.

Classes are the workhorse of CSS. You'll use them far more than anything else, because they let *you* decide which elements belong together, instead of being stuck with "all paragraphs" or "one specific thing."

An element can wear several classes, and you can target an element that wears *both* by chaining them with no space:

```css
.button.danger {
	background: crimson;
}
```

That reads "elements that have the `button` class **and** the `danger` class."

## ID selectors: "Maria Santos, please come to the front"

```css
#special-offer {
	border: 2px dashed orange;
}
```

A hash selects the one element with that `id`. It works, but here's some honest advice you'll thank me for later: **prefer classes for styling.** An id can only be used once per page, so a style tied to it can never be reused. And as you'll learn in [The Cascade and Specificity](/lessons/css/cascade-and-specificity), id selectors are so "loud" that they're painful to override. Save ids for links (`#contact`), form labels, and JavaScript.

## The universal selector: "everyone"

```css
* {
	margin: 0;
}
```

The asterisk matches every single element. It's powerful and blunt, like shouting at the whole crowd. You'll see it used for a few page-wide resets, like the `box-sizing` fix in [The Box Model](/lessons/css/box-model).

## Attribute selectors: "anyone carrying an umbrella"

You can select elements by their attributes, too:

```css
/* Any input whose type is email */
input[type="email"] {
	border-color: #2f6f8f;
}

/* Any link that opens in a new tab */
a[target="_blank"] {
	font-style: italic;
}

/* Any link whose href starts with https */
a[href^="https"] {
	text-decoration-style: dotted;
}

/* Anything with a data-status attribute at all */
[data-status] {
	border-left: 4px solid gray;
}
```

- `[attr]` matches elements that have the attribute at all.
- `[attr="value"]` matches an exact value.
- `[attr^="value"]` matches values that *start with* something.
- `[attr$="value"]` matches values that *end with* something, like `a[href$=".pdf"]` for PDF links.

This is also where those `data-*` attributes from [Attributes Deep Dive](/lessons/html/attributes-deep-dive) start earning their keep. `[data-status="sold-out"]` can gray out every sold-out product without adding a single extra class.

## Grouping: "teachers and parents"

Need the same instruction for two groups? Separate selectors with commas:

```css
h1,
h2,
h3 {
	font-family: Georgia, serif;
}
```

## Combinators: "the kids standing next to their parents"

This is where the family tree from [Nesting and the DOM](/lessons/html/nesting-and-the-dom) comes back in a big way. Combinators select elements based on their relationships:

```css
/* Descendant (a space): any a inside nav, at any depth */
nav a {
	text-decoration: none;
}

/* Child (>): only li elements that are direct children of this ul */
.menu > li {
	display: inline-block;
}

/* Next sibling (+): a p that comes right after an h2 */
h2 + p {
	font-size: 1.2rem;
}

/* Later siblings (~): every p that follows an h2 in the same parent */
h2 ~ p {
	color: #444444;
}
```

In family terms: a space means **descendant** (children, grandchildren, anyone further down the tree), `>` means **child** (direct children only), `+` means **the very next sibling**, and `~` means **any younger sibling**.

Read selectors from right to left to understand them. `nav a` is "an `a`... that's somewhere inside a `nav`." That's actually how the browser reads them, too.

## "There are so many!"

Yes. And if this feels like a lot, that's completely normal. Here's the reassuring part: in day-to-day work, you'll use **type selectors** for base styles and **class selectors** for almost everything else. The rest are tools you reach for when you need them. Nobody memorizes them all on day one.

## Try it

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<nav>\n\t<a href=\'#\'>Home</a>\n\t<a href=\'#\'>Menu</a>\n</nav>\n\n<h2>Today\'s Bakes</h2>\n<p>Everything is baked fresh at 6am.</p>\n<p class=\'item\'>Sourdough loaf <span class=\'price\'>$8</span></p>\n<p class=\'item sold-out\' data-status=\'sold-out\'>Cinnamon roll <span class=\'price\'>$4</span></p>\n\n<p><a href=\'menu.pdf\'>Download the full menu (PDF)</a></p>'"
	:initial-css="'/* Type selector */\np {\n\tfont-family: system-ui, sans-serif;\n}\n\n/* Class selector */\n.price {\n\tcolor: #2f6f8f;\n\tfont-weight: bold;\n}\n\n/* Descendant combinator */\nnav a {\n\tmargin-right: 12px;\n}\n\n/* Next sibling combinator */\nh2 + p {\n\tfont-style: italic;\n}\n'"
	preview-height="260px"
/>

## Try it yourself

1. Add a rule using an attribute selector that gives every `[data-status="sold-out"]` element `opacity: 0.5;`.
2. Add a rule for `a[href$=".pdf"]` that makes PDF links bold.
3. Remove the underline from only the nav links, using `nav a` and `text-decoration: none;`.

## Check your understanding

<Quiz
	question="Which selector matches every element with class=card?"
	:options="['card', '#card', '.card', '[card]']"
	:answer-index="2"
	explanation="A dot selects by class. A hash selects by id, and a plain word selects by element type."
/>

<Quiz
	question="What does the selector nav > a mean?"
	:options="['Any a anywhere after a nav', 'An a that is a direct child of nav', 'A nav inside an a', 'Both nav and a elements']"
	:answer-index="1"
	explanation="The > combinator matches direct children only. A space would match any descendant."
/>

<Quiz
	question="Why is a class usually a better choice than an id for styling?"
	:options="['Classes load faster', 'Classes can be reused and are easier to override', 'Ids do not work in CSS', 'Classes work in older browsers only']"
	:answer-index="1"
	explanation="An id is used once per page and has very high specificity, so class-based styles are more reusable and easier to manage."
/>

## Up next

Some selectors can react to what the visitor is doing, or target parts of an element that don't even exist in your HTML. That's [Pseudo-classes and Pseudo-elements](/lessons/css/pseudo-classes-and-pseudo-elements).
