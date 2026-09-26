---
title: "Inline, Internal, and External CSS Explained"
description: "Learn the three ways to add CSS to a page (inline styles, a style element, and an external stylesheet) and why the external file is the professional standard."
---

# Three Ways to Add CSS

*A sticky note, a notice on the door, or the company style guide. Only one of them scales.*

Picture an office where someone wants the documents to look consistent. There are three ways they could hand out instructions:

1. Stick a note on **one specific document**: "make this title red."
2. Pin a notice on **one room's door**: "in this room, all titles are red."
3. Publish a **company-wide style guide** that every room follows: "all titles are red."

CSS can be added to a page in the same three ways. All three work. But when you think about what happens on the day the company decides titles should be blue instead, it gets pretty obvious which one professionals use.

## 1. Inline styles: the sticky note

```html
<p style="color: crimson; font-weight: bold;">Sale ends Friday!</p>
```

The `style` attribute puts CSS right on one element. You met it briefly in [Attributes Deep Dive](/lessons/html/attributes-deep-dive).

It's quick. It's also a trap. That sticky note only affects this one paragraph. Want every "sale" paragraph to look this way? You'd have to stick a note on each one. Changing the color later means hunting down every sticky note on every page. And as you'll see in [The Cascade and Specificity](/lessons/css/cascade-and-specificity), inline styles are extremely hard to override, which causes headaches later.

**Use it:** almost never by hand. You'll mostly see it when JavaScript sets a style on the fly, which we'll get to in [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript).

## 2. Internal styles: the notice on the door

```html
<head>
	<style>
		p {
			color: #444444;
		}
	</style>
</head>
```

A `<style>` element in the `<head>` holds CSS rules for this one page. Better! One rule now styles every paragraph on the page.

But it's still a notice on just *one* room's door. Your About page and your Contact page each need their own copy. Change a color and you're editing every page again.

**Use it:** for quick experiments, single-page demos, or a one-off page that truly has nothing in common with the rest of your site.

## 3. External stylesheets: the company style guide

```html
<head>
	<link rel="stylesheet" href="css/styles.css">
</head>
```

And in a separate file called `styles.css`:

```css
/* styles.css: the whole site's look lives here */
p {
	color: #444444;
}
```

This is the one. Your CSS lives in its own `.css` file, and every page connects to it with one `<link>` line. You saw this exact line in the HTML track.

Why is this the professional standard?

- **One change, every page.** Update the style guide once and the whole site follows.
- **Faster sites.** The browser downloads `styles.css` once, then keeps a copy (it **caches** it). Every other page on your site loads instantly, style-wise, because the guide is already on the shelf.
- **Clean separation.** Your HTML files hold content and structure. Your CSS file holds appearance. Each is easier to read because it's not tangled with the other.
- **Teamwork.** A designer can work on `styles.css` while someone else edits the content, without stepping on each other.

You can link more than one stylesheet, too. They're read in order, top to bottom, and when two rules disagree, the later one usually wins. Hold onto that idea, because the next few lessons are all about who wins when rules disagree.

## Comments in CSS

See the `/* ... */` line above? That's a CSS comment. It works just like the HTML comments from [Nesting and the DOM](/lessons/html/nesting-and-the-dom), just with different symbols:

```css
/* Brand colors: update these if the logo changes */
h1 {
	color: #2f6f8f;
}
```

## "Wait, which one is this editor using?"

Good eye. The live editor on these pages takes your CSS pane and quietly puts it in a `<style>` element in the preview's head, the internal method. It's the easiest way to give you a live preview. On your own projects, use an external file.

## Try it

This time the HTML pane is open too, so you can see all three methods at once.

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<style>\n\t/* Internal: a notice on this page only */\n\th2 {\n\t\tcolor: seagreen;\n\t}\n</style>\n\n<h2>Weekly Specials</h2>\n<p style=\'color: crimson;\'>Inline: sticky note on this paragraph only.</p>\n<p>This paragraph follows the style guide in the CSS pane.</p>\n<p>So does this one.</p>'"
	:initial-css="'/* Think of this pane as your external styles.css file */\np {\n\tcolor: #2f6f8f;\n\tfont-family: system-ui, sans-serif;\n}\n'"
	preview-height="220px"
/>

## Try it yourself

1. Change the `p` color in the CSS pane. Notice that the inline-styled paragraph refuses to change. The sticky note wins.
2. Remove the `style` attribute from that paragraph. Now it joins the others.
3. Move the `h2` rule out of the `<style>` element and into the CSS pane. The result is the same, but your HTML is cleaner.

## Check your understanding

<Quiz
	question="Which way of adding CSS is the professional standard for real websites?"
	:options="['Inline style attributes', 'A style element on every page', 'An external stylesheet linked with a link element', 'Writing CSS inside the body text']"
	:answer-index="2"
	explanation="An external stylesheet styles every page from one file, is cached by the browser, and keeps structure and appearance separate."
/>

<Quiz
	question="Where does the link element for a stylesheet go?"
	:options="['At the end of the body', 'Inside the head', 'Inside the footer', 'Inside every paragraph']"
	:answer-index="1"
	explanation="Stylesheets are linked from the head so the browser knows how to style the page before it displays it."
/>

<Quiz
	question="Fill in the blank: a CSS comment is written as ___."
	:options="['<!-- comment -->', '// comment', '/* comment */', '# comment']"
	:answer-index="2"
	explanation="CSS comments sit between /* and */. The <!-- --> style is for HTML."
/>

## Up next

You know where CSS lives. Now we learn to aim it. In [Selectors](/lessons/css/selectors), you'll learn to point at exactly the elements you want, using the tags, classes, and ids you already put on your HTML.
