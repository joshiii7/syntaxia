---
title: "Semantic HTML5: header, nav, main, article, aside"
description: "Label every part of your page with header, nav, main, section, article, aside, and footer, and see how it helps screen readers, search engines, and fellow developers."
---

# Semantic HTML

*Label the rooms in your house, and anyone who walks in can find the kitchen without opening every door.*

At the end of the last lesson I left you with a house where every room was labeled "Room." Let's fix that house.

Imagine giving a friend a tour. "This is the entrance. Here's the hallway, it connects everything. That's the living room, where the main stuff happens. The little reading nook over there is a side thing. And the back door's at the end." Your friend could now find their way around blindfolded, just from the labels.

**Semantic HTML** means using elements that label what each part of the page *is*. "Semantic" just means "about meaning." Here's the floor plan.

## The rooms of a page

```html
<body>
	<header>
		<h1>Maria's Kitchen</h1>
		<nav>
			<ul>
				<li><a href="index.html">Home</a></li>
				<li><a href="recipes.html">Recipes</a></li>
				<li><a href="about.html">About</a></li>
			</ul>
		</nav>
	</header>

	<main>
		<article>
			<h2>The Only Pancake Recipe You Need</h2>
			<p>Published <time datetime="2026-03-14">March 14, 2026</time></p>
			<section>
				<h3>Ingredients</h3>
				<ul>
					<li>Flour</li>
					<li>Eggs</li>
					<li>Milk</li>
				</ul>
			</section>
			<section>
				<h3>Method</h3>
				<ol>
					<li>Whisk everything together.</li>
					<li>Cook on a hot pan until golden.</li>
				</ol>
			</section>
		</article>

		<aside>
			<h2>You might also like</h2>
			<p><a href="waffles.html">Crispy waffles</a></p>
		</aside>
	</main>

	<footer>
		<p>&copy; 2026 Maria's Kitchen</p>
	</footer>
</body>
```

Room by room:

- **`<header>`: the entrance.** The first thing you see: a logo, the site name, often the main menu.
- **`<nav>`: the hallway.** The major routes around the site. Not every group of links needs a `nav`, just the main ways of getting around.
- **`<main>`: the living room.** The content this specific page exists for. There's exactly **one** `<main>` per page, and it doesn't include things that repeat on every page, like the header and footer.
- **`<article>`: a framed piece you could hand to someone.** A blog post, a news story, a product card, a comment. The test: could you lift it out, drop it on a completely different site, and it would still make sense? Then it's an article.
- **`<section>`: a part of something bigger.** A chapter of the article, a themed chunk of the page. A section should almost always have a heading, since it's a named part of the whole.
- **`<aside>`: the reading nook.** Related, but not essential. "You might also like," a glossary box, a pull quote. If you removed it, the main content would still make complete sense.
- **`<footer>`: the back door.** Copyright, contact info, small links.

Bonus: `<time datetime="2026-03-14">` wraps a date so machines can read it reliably, even when humans see "March 14" or "last Tuesday."

## "They look exactly the same as divs. Why bother?"

That's a really fair question. Delete all the CSS from a semantic page and a div-soup page, and they look identical. So who's the labeling for?

**People using screen readers.** Semantic elements create **landmarks**. A screen reader user can pull up a list, "banner, navigation, main, complementary, contentinfo," and jump straight to the main content, skipping the menu they've already heard fifty times. With div soup, there's nothing to jump to. They listen to the whole page from the top, every single time. We'll build on this in [Accessibility Basics](/lessons/html/accessibility-basics).

**Search engines.** Google reads your page more like a screen reader than like a human with eyes. When the recipe is inside `<main>` and `<article>`, and the "you might also like" is in an `<aside>`, it's much clearer what your page is actually about. That's part of the story in [Meta Tags and SEO](/lessons/html/meta-and-head-tags).

**Other developers (including future you).** Opening a file and seeing `<nav>` instead of `<div class="menu-wrapper-2">` saves real time and real confusion.

## Article, section, or div?

This is the question everyone gets stuck on, so here's a quick decision path:

1. Could this chunk stand on its own, somewhere else entirely? **`<article>`**.
2. Is it a themed part of something larger, with its own heading? **`<section>`**.
3. Is it just a box for styling, with no meaning of its own? **`<div>`**.

And don't overthink it. Two experienced developers might mark up the same page slightly differently, and both be fine. The big win is going from zero labels to good labels, not agonizing over perfect ones.

## Headers and footers inside articles

One more thing that surprises people: `<header>` and `<footer>` aren't only for the top and bottom of the whole page. An article can have its own header (title, author, date) and footer (tags, share links). Think of it as a room with its own doorway and its own light switch by the exit. (One detail: a header or footer inside an article belongs to that article, so screen readers don't list it as the whole page's banner or contentinfo landmark.)

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<div class=\'header\'>\n\t<div class=\'title\'>My Blog</div>\n\t<div class=\'menu\'>\n\t\t<div class=\'menu-item\'>Home</div>\n\t\t<div class=\'menu-item\'>About</div>\n\t</div>\n</div>\n\n<div class=\'content\'>\n\t<div class=\'post\'>\n\t\t<div class=\'post-title\'>My First Post</div>\n\t\t<div>Today I learned about semantic HTML.</div>\n\t</div>\n</div>\n\n<div class=\'bottom\'>Made with care.</div>'"
	preview-height="260px"
/>

## Try it yourself

That's the div soup from [Divs and Spans](/lessons/html/divs-and-spans). Rebuild it using real rooms:

1. Turn the header div into a `<header>`, and the title into an `<h1>`.
2. Make the menu a `<nav>` holding a `<ul>` of `<a>` links.
3. Wrap the content in `<main>`, the post in `<article>` with an `<h2>` title and a `<p>`.
4. Finish with a `<footer>`.

The preview will barely change. The *meaning* changes completely.

## Check your understanding

<Quiz
	question="How many main elements should a page have?"
	:options="['None', 'Exactly one', 'One per section', 'One per article']"
	:answer-index="1"
	explanation="main holds the unique content of the page, and there is only one of it."
/>

<Quiz
	question="A sidebar box titled Related Recipes, which is nice but not essential. Which element fits best?"
	:options="['<main>', '<article>', '<aside>', '<header>']"
	:answer-index="2"
	explanation="aside is for related content that the main content would still make sense without."
/>

<Quiz
	question="A news story could be lifted out and still make sense on another site. Which element should wrap it?"
	:options="['<section>', '<article>', '<div>', '<nav>']"
	:answer-index="1"
	explanation="Self-contained content that could stand on its own belongs in an article."
/>

## Up next

Your page's rooms are labeled. Next, we'll go back to attributes, this time the advanced kind: the ones every element shares, and the ones you invent yourself. That's [Attributes Deep Dive](/lessons/html/attributes-deep-dive).
