---
title: "HTML Links and Navigation: The a Tag and href"
description: "Build links with the a tag and href, understand absolute vs relative URLs, jump within a page, open email and phone links, and build a proper nav menu."
---

# Links and Navigation

*Links are the reason it's called the web. Every link is a door, and today you learn to build doors.*

Remember why HTML was invented in the first place? Tim Berners-Lee wanted documents that could point to other documents. Click, and you're there. Every other element we've learned is great, but links are the one that turned a pile of pages into a *web*.

## The anatomy of a door

```html
<a href="https://example.com">Visit Example</a>
```

- `<a>` stands for *anchor*. It's the door itself.
- `href` (hypertext reference) is the address the door opens onto.
- The text between the tags, "Visit Example," is the sign on the door, the part people see and click.

No `href`, no destination. An `<a>` without one is a door painted on a wall.

## Full addresses and "next door"

Imagine giving someone directions.

To a stranger across the country, you'd give your full address: street, city, postcode, country. That's an **absolute URL**:

```html
<a href="https://www.wikipedia.org">Wikipedia</a>
```

It includes everything: the protocol (`https://`), the website, and the page. It works from anywhere.

But to someone already in your building, you'd just say "apartment 4B, second floor." That's a **relative URL**. It describes a place *relative to where you already are*:

```html
<a href="about.html">About me</a>            <!-- same folder -->
<a href="blog/first-post.html">My post</a>   <!-- a folder inside this one -->
<a href="../index.html">Back home</a>       <!-- one folder up -->
```

That `../` means "go up one folder," like stepping out into the hallway. Use absolute URLs for other people's websites and relative URLs for pages on your own site. That way, if you move your whole site to a new domain, your internal links keep working.

## Jumping within a page

Long page? You can link to a specific spot on it. First, give the destination an `id` (you met `id` in [Attributes](/lessons/html/attributes)). Then link to it with a `#`:

```html
<a href="#recipes">Skip to the recipes</a>

<!-- ...lots of content... -->

<h2 id="recipes">Recipes</h2>
```

It works like a bookmark ribbon in a thick book. You can even combine them: `about.html#contact` opens the About page and jumps straight to the contact section.

## Doors that open other apps

```html
<a href="mailto:hello@example.com">Email me</a>
<a href="tel:+15550100">Call us</a>
```

`mailto:` opens the visitor's email app with your address filled in. `tel:` offers to call the number, which is really handy on phones.

## Opening a new tab (and when not to)

```html
<a href="https://example.com" target="_blank" rel="noopener">Example (opens in a new tab)</a>
```

`target="_blank"` opens the link in a new tab. It's tempting to use this everywhere so people "don't leave your site." Resist that. Taking control of someone's tabs away from them is annoying, and it can confuse people using screen readers, who may not notice a new tab opened at all. If you do use it, say so in the link text, as above. The `rel="noopener"` part is a security habit: it stops the new page from reaching back and messing with yours.

## Write link text that makes sense on its own

This is where good links and great links part ways:

```html
<!-- Vague -->
<p>To see our menu, <a href="menu.html">click here</a>.</p>

<!-- Clear -->
<p>Take a look at <a href="menu.html">our full menu</a>.</p>
```

Why does this matter? Screen reader users often pull up a list of every link on the page, out of context. Imagine a list that reads "click here, click here, read more, click here." Useless! Good link text tells you where the door goes before you open it. Search engines read it the same way.

## Putting links together: navigation

Now we combine everything. A site's main menu is a list (see [Lists](/lessons/html/lists)) of links, wrapped in a `<nav>` element that says "this is the main way around the site":

```html
<nav>
	<ul>
		<li><a href="index.html" aria-current="page">Home</a></li>
		<li><a href="about.html">About</a></li>
		<li><a href="blog.html">Blog</a></li>
		<li><a href="contact.html">Contact</a></li>
	</ul>
</nav>
```

That `aria-current="page"` tells assistive technology "you are here," like the red dot on a mall map. We'll unpack `aria-` attributes properly in [Accessibility Basics](/lessons/html/accessibility-basics), and `<nav>` gets its moment in [Semantic HTML](/lessons/html/semantic-html).

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<nav>\n\t<ul>\n\t\t<li><a href=\'#home\'>Home</a></li>\n\t\t<li><a href=\'#menu\'>Menu</a></li>\n\t\t<li><a href=\'#contact\'>Contact</a></li>\n\t</ul>\n</nav>\n\n<h2 id=\'home\'>Welcome</h2>\n<p>Fresh coffee daily.</p>\n\n<h2 id=\'menu\'>Menu</h2>\n<p>Espresso, latte, and our famous cinnamon roll.</p>\n\n<h2 id=\'contact\'>Contact</h2>\n<p><a href=\'mailto:hello@example.com\'>Email us</a> or read about coffee on <a href=\'https://en.wikipedia.org/wiki/Coffee\' target=\'_blank\' rel=\'noopener\'>Wikipedia (opens in a new tab)</a>.</p>'"
	preview-height="340px"
/>

One honest warning: this preview runs in a locked-down sandbox, so clicking links inside it won't behave like a real website. To really click around, save the code as a file on your computer, just like in [Your First HTML File](/lessons/html/your-first-html-file), and open it in your browser.

## Try it yourself

1. Add a fourth section, "Hours," with its own `id`, and a matching link in the nav.
2. Save the result as a real `.html` file, open it, and click your nav links. Watch the page jump to each section. (If the page is too short to scroll, add a few more paragraphs.)
3. Rewrite this vague link so it makes sense on its own: `<a href="hours.html">here</a>`.

## Check your understanding

<Quiz
	question="Which href points to a spot on the same page with id=faq?"
	:options="['faq', '#faq', '.faq', '/faq']"
	:answer-index="1"
	explanation="A hash followed by an id jumps to that element on the page."
/>

<Quiz
	question="Which link text is the most helpful?"
	:options="['Click here', 'Read more', 'Download the 2026 price list', 'Link']"
	:answer-index="2"
	explanation="Good link text describes the destination even when read out of context."
/>

<Quiz
	question="What does ../ mean at the start of a relative URL?"
	:options="['Go to the home page', 'Go up one folder', 'Open in a new tab', 'Go back in history']"
	:answer-index="1"
	explanation="../ steps up one folder from where the current page lives, like stepping out into the hallway."
/>

## Up next

Your pages can now connect to each other. Next, let's make them a little more colorful with [Images](/lessons/html/images).
