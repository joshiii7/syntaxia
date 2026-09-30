---
title: "HTML Lists: Unordered, Ordered, and Description"
description: "Learn when to use ul, ol, and dl lists in HTML, how to nest them, and why lists quietly power things like navigation menus and step-by-step guides."
---

# Lists

*Shopping lists, recipes, and dictionaries. You already know the three kinds of HTML list; you just haven't met their tags yet.*

Before you write a single line of code, think about the lists in your own life.

A **shopping list**: milk, eggs, bread. Does the order matter? Not really. You'll grab them in whatever order the aisles go.

A **recipe**: crack the eggs, whisk them, pour into the pan. Order matters a lot here. Pour before you crack and you've got a mess.

A **dictionary**: a word, followed by what it means. Each item is a pair.

HTML has a list for each of these.

## Unordered lists: the shopping list

```html
<ul>
	<li>Milk</li>
	<li>Eggs</li>
	<li>Bread</li>
</ul>
```

`<ul>` means *unordered list*. Each item goes in an `<li>` (list item). The browser shows bullet points.

## Ordered lists: the recipe

```html
<ol>
	<li>Crack the eggs into a bowl.</li>
	<li>Whisk until smooth.</li>
	<li>Pour into a hot pan.</li>
</ol>
```

`<ol>` means *ordered list*, and the browser numbers each step for you. Here's the part people love: add a step in the middle and all the numbers update by themselves. No renumbering by hand.

Ordered lists also have a few handy attributes:

```html
<ol start="5">
	<li>Fifth place</li>
	<li>Sixth place</li>
</ol>
```

- `start="5"` starts counting at 5.
- `reversed` counts down, like a top-10 countdown.
- `type="A"` uses A, B, C instead of 1, 2, 3.

How do you choose between `ul` and `ol`? Just ask: "If I shuffled these items, would it be wrong?" If yes, it's ordered. That's the whole decision.

## Description lists: the dictionary

```html
<dl>
	<dt>HTML</dt>
	<dd>The language that describes the structure of a web page.</dd>

	<dt>CSS</dt>
	<dd>The language that describes how a web page looks.</dd>
</dl>
```

- `<dl>` is the *description list*, the whole dictionary.
- `<dt>` is the *term*, the word being defined.
- `<dd>` is the *description*, what the word means.

These are great for glossaries, FAQs, or product specs ("Weight: 1.2 kg"). They're a little less common, so they often get overlooked. Don't overlook them.

## Lists inside lists

Sometimes a list item has its own sub-list. Remember the family tree from [Nesting and the DOM](/lessons/html/nesting-and-the-dom)? The rule is the same: the inner list goes *inside* an `<li>`, as its child.

```html
<ul>
	<li>Fruit
		<ul>
			<li>Apples</li>
			<li>Bananas</li>
		</ul>
	</li>
	<li>Vegetables</li>
</ul>
```

A common mistake is putting the inner `<ul>` directly inside the outer `<ul>`, between two `<li>` elements. It might even look right! But a `<ul>` is only allowed to have `<li>` children. Everything else goes inside an item.

## The secret life of lists

Here's something that surprises most beginners. Look at the menu at the top of almost any website: Home, About, Blog, Contact. Under the hood, that's very often a `<ul>` with links inside it, styled so the bullets disappear and the items sit side by side.

Why a list? Because it *is* a list. A list of places you can go. And when a screen reader reaches it, it announces "list, 4 items," which tells the listener how big the menu is before they dive in. We'll build exactly this kind of menu in [Links and Navigation](/lessons/html/links).

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<h2>Shopping List</h2>\n<ul>\n\t<li>Milk</li>\n\t<li>Eggs</li>\n</ul>\n\n<h2>Scrambled Eggs</h2>\n<ol>\n\t<li>Crack the eggs into a bowl.</li>\n\t<li>Whisk until smooth.</li>\n\t<li>Pour into a hot pan.</li>\n</ol>\n\n<h2>Kitchen Words</h2>\n<dl>\n\t<dt>Whisk</dt>\n\t<dd>To beat quickly so air gets in.</dd>\n</dl>'"
	preview-height="360px"
/>

## Try it yourself

1. Insert a new step between "Crack" and "Whisk" in the recipe. Watch the numbers fix themselves.
2. Turn "Eggs" in the shopping list into a nested list with two kinds: "Free-range" and "Regular."
3. Add a second term to the Kitchen Words dictionary.

## Check your understanding

<Quiz
	question="Which list would you use for step-by-step directions to your house?"
	:options="['<ul>', '<ol>', '<dl>', '<li>']"
	:answer-index="1"
	explanation="The order of directions matters, so they belong in an ordered list."
/>

<Quiz
	question="Where does a nested list go?"
	:options="['Directly inside the outer ul, between li items', 'Inside one of the li items', 'After the closing ul tag', 'Inside a dt']"
	:answer-index="1"
	explanation="A ul or ol can only contain li children, so the nested list must live inside an li."
/>

<Quiz
	question="In a description list, which tag holds the term being defined?"
	:options="['<dd>', '<dl>', '<dt>', '<li>']"
	:answer-index="2"
	explanation="dt is the term, dd is its description, and dl wraps the whole list."
/>

## Up next

Lists are about to get even more useful, because next we'll fill them with links. On to [Links and Navigation](/lessons/html/links). If you're curious how lists get their bullets removed and turned sideways into a menu, that's CSS territory; you can peek ahead at [Intro to CSS](/lessons/css/intro-to-css).
