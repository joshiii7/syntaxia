---
title: "Nesting, Whitespace, and the DOM Family Tree"
description: "See how HTML elements nest inside each other, why the browser turns your page into a family tree called the DOM, and how whitespace and comments behave."
---

# Nesting and the DOM

*Your HTML isn't a flat list of tags. It's a family, and once you see the family tree, a lot of confusing behavior suddenly makes sense.*

In the last lesson we built the skeleton of a page: `<html>` holding `<head>` and `<body>`. You may have noticed that we kept putting tags *inside* other tags, and indenting them. That wasn't just for looks. Putting elements inside each other is called **nesting**, and it's how HTML describes relationships.

## Boxes inside boxes

Picture moving house. You've got a big box labeled "Kitchen." Inside it, a smaller box labeled "Mugs." Inside that, the mugs themselves.

HTML nesting works exactly like that:

```html
<article>
	<h2>My Morning Routine</h2>
	<p>I start every day with <strong>very strong</strong> coffee.</p>
</article>
```

The `<article>` box (an element for a self-contained piece of content, which you'll meet properly in [Semantic HTML](/lessons/html/semantic-html)) holds a heading and a paragraph. The paragraph box holds some text, plus a smaller `<strong>` box around two words.

And just like real boxes, there's one rule you can't break: **a box has to close before the box around it closes.** You can't seal the "Kitchen" box while the "Mugs" box is still sticking out through the top.

```html
<!-- Wrong: the tags overlap -->
<p>I love <strong>coffee</p></strong>

<!-- Right: the inner box closes first -->
<p>I love <strong>coffee</strong></p>
```

That first version is a classic beginner bug. The browser will try to fix it, but its fix might not be what you meant, and that's where mysterious "why is half my page bold?!" moments come from. If you ever hit one of those, check your closing tags first. It's almost always the culprit.

## The DOM: your page as a family tree

When the browser reads your HTML, it doesn't keep it as text. It builds a tree out of it, called the **DOM** (Document Object Model). And the easiest way to understand that tree is as a family tree.

```html
<body>
	<header>
		<h1>Syntaxia Café</h1>
	</header>
	<main>
		<p>Fresh coffee daily.</p>
		<p>Open 7am to 5pm.</p>
	</main>
</body>
```

(`<header>` and `<main>` are more of those named boxes from Semantic HTML: the top of the page, and its main content.)

In family terms:

- `<body>` is the **parent** of `<header>` and `<main>`.
- `<header>` and `<main>` are **siblings**. Same parent, side by side.
- The two `<p>` elements are **children** of `<main>`, and siblings of each other.
- `<h1>` is a **descendant** of `<body>` (a grandchild, really), and `<body>` is its **ancestor**.

Why should you care about genealogy right now? Because everything that comes after HTML leans on it. When you get to CSS, you'll write rules like "style every paragraph that's a child of `main`." When you get to JavaScript, you'll say "find this element's parent and hide it." Both of those only work because the browser sees your page as this tree. The [Intro to CSS](/lessons/css/intro-to-css) lesson will feel a lot friendlier once this clicks.

## Some boxes stack, some sit in a line

Try this in your head. Two paragraphs, one after the other. They stack on top of each other, right? Now two `<strong>` elements in a sentence. They sit side by side, flowing with the text.

That's the difference between **block** and **inline** elements:

- **Block** elements (like `<p>`, `<h1>`, `<article>`, `<ul>`) start on a new line and stretch across the full width available. Think of them as shelves.
- **Inline** elements (like `<strong>`, `<a>`, `<em>`) sit inside a line of text and only take up as much space as they need. Think of them as books on a shelf.

A good rule of thumb: put books on shelves, not shelves inside books. A `<p>` can hold a `<strong>`. A `<strong>` shouldn't hold a `<p>`.

## Empty boxes that don't close

A few elements have no content at all, so there's nothing to wrap and nothing to close. These are called **void elements**:

```html
<img src="cat.webp" alt="A sleepy orange cat">
<br>
<hr>
<meta charset="UTF-8">
<input type="text">
```

You'll sometimes see them written with a slash at the end, like `<br />`. That's an older habit from a stricter version of HTML. Both work. Just pick one style and stick to it.

## Whitespace: the browser squashes it

Here's something that trips people up. Type this:

```html
<p>Hello.


		Is    anybody    there?</p>
```

The browser shows: *Hello. Is anybody there?* All those spaces and blank lines got squashed into single spaces.

That's on purpose. It means you can indent and space out your code however you like to keep it readable, without it affecting the page. The flip side is that you can't use the spacebar or Enter key to lay out your page. For that, you'll use proper elements (and later, CSS).

## Comments: notes to your future self

Sometimes you want to leave a note in your code that the browser ignores. That's a **comment**:

```html
<!-- Contact section: update the phone number every January -->
<section>
	<p>Call us at 555-0100.</p>
</section>
```

Anything between `<!--` and `-->` stays hidden from the page. Just remember it's still visible to anyone who views your source code, so never put passwords or private notes there.

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<!-- The article is the parent of everything below -->\n<article>\n\t<h2>My Morning Routine</h2>\n\t<p>I start every day with <strong>very strong</strong> coffee.</p>\n\t<p>Then I      stare    out the      window.</p>\n</article>'"
	preview-height="220px"
/>

## Try it yourself

1. Break the nesting on purpose: in the first paragraph, move `</strong>` so it comes *after* `</p>`, making the tags overlap. Run it. Did the bold spill over?
2. Fix it, then add a third paragraph as a sibling of the other two, with one `<em>` word inside it.
3. Notice the extra spaces in "stare out the window." Did any of them survive?

## Check your understanding

<Quiz
	question="In <main><p>Hi</p><p>Bye</p></main>, what is the relationship between the two paragraphs?"
	:options="['Parent and child', 'Siblings', 'Ancestor and descendant', 'They are not related']"
	:answer-index="1"
	explanation="Both paragraphs have the same parent, main, so they are siblings."
/>

<Quiz
	question="Which line nests the tags correctly?"
	:options="['<p><em>Hi</p></em>', '<em><p>Hi</em></p>', '<p><em>Hi</em></p>', '<p>Hi<em></p>']"
	:answer-index="2"
	explanation="The inner em box must close before the outer p box does."
/>

<Quiz
	question="What does the browser do with five spaces in a row inside a paragraph?"
	:options="['Shows all five', 'Collapses them into one space', 'Shows an error', 'Starts a new line']"
	:answer-index="1"
	explanation="Browsers collapse runs of whitespace into a single space, so you can format your code freely."
/>

## Up next

Now that you can see the family tree, it's time to give each family member some details: names, sources, and destinations. That's [Attributes](/lessons/html/attributes). If the skeleton from [Anatomy of an HTML Document](/lessons/html/basic-structure) still feels fuzzy, give it one more read first. And when you want to peek at the real DOM of any website, the browser developer tools from [Debugging Basics](/lessons/ide/debugging-basics) show you the whole family tree live.
