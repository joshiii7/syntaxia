---
title: "CSS Typography: Fonts, Web Fonts, and Line Height"
description: "Make text beautiful and readable with font-family stacks, web fonts, font-size, font-weight, line-height, line length, and text styling properties like letter-spacing."
---

# Typography

*Most of the web is text. Get the type right and a plain page suddenly feels designed.*

Here's something designers say that sounds like an exaggeration but isn't: the web is about 95% typography. Think about it. Strip away the images on most sites and what's left? Words. Paragraphs, headings, menus, buttons, all text.

Which means that the fastest way to make your page look *professional* isn't a fancy animation or a bold color scheme. It's good type. And the good news is that it only takes a handful of properties.

## Choosing a font: `font-family`

```css
body {
	font-family: "Source Serif 4", Georgia, "Times New Roman", serif;
}
```

That list is called a **font stack**, and here's why it's a list rather than one name.

Imagine ordering at a café: "A flat white, please. If you don't have that, a latte. If not, just any coffee." You're giving backups, from most specific to most general. The browser does the same thing. It tries the first font; if the visitor's device doesn't have it, it moves to the next, and so on.

The last item should always be a **generic family**, the "any coffee" fallback that always exists:

- `serif`: fonts with little feet on the letters, like Georgia. Classic, bookish.
- `sans-serif`: fonts without the feet, like Arial or Helvetica. Clean, modern.
- `monospace`: every character the same width, like code editors use.
- `system-ui`: whatever font the visitor's operating system uses for its own menus. Familiar, fast, and needs no downloading.

Font names with spaces go in quotes: `"Times New Roman"`.

## Bringing your own font: web fonts

A font stack only uses fonts already on the visitor's device. What if you want a specific font your visitor probably doesn't have?

You bring it with you, like a band bringing their own instruments to a gig instead of hoping the venue has a guitar. That's a **web font**: a font file downloaded along with your page.

The easiest way is a service like Google Fonts, which gives you a line to add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
```

Then use it like any other font, with fallbacks:

```css
body {
	font-family: Inter, system-ui, sans-serif;
}
```

Or host the font file yourself with `@font-face`:

```css
@font-face {
	font-family: "Bakery Script";
	src: url("fonts/bakery-script.woff2") format("woff2");
	font-display: swap;
}
```

`woff2` is the modern web font format, small and fast. And `font-display: swap` means "show the text in a fallback font right away, then swap in the real font once it arrives." Without it, some browsers show *invisible* text while the font downloads. On a slow connection, that's a page of blank space.

A word of restraint: every web font is a download. Two families (one for headings, one for body text) is plenty. Five fonts makes a page slower *and* messier.

## Size and weight

```css
h1 {
	font-size: 2.5rem;
	font-weight: 700;
}

p {
	font-size: 1.125rem;
	font-weight: 400;
}

.caption {
	font-style: italic;
}
```

- `font-size` in `rem`, like you learned in [Units](/lessons/css/units), so readers' preferences are respected.
- `font-weight` runs from 100 (hairline thin) to 900 (extra heavy). 400 is normal and 700 is bold. A web font only has the weights you actually loaded, so if you ask for 600 and only loaded 400 and 700, the browser fakes it or rounds.
- `font-style: italic` for, well, italics.

Remember the heading outline you built in [Headings and Paragraphs](/lessons/html/headings-and-paragraphs)? This is where it finally gets its looks. The *level* came from HTML; the *size* comes from here. You can make an h2 any size you like without breaking the outline.

## Line height: spacing on ruled paper

```css
body {
	line-height: 1.6;
}
```

Think of the lined paper you wrote on at school. Wide-ruled paper was easier to write and read on; narrow-ruled felt cramped. `line-height` is how far apart those lines are.

Browsers default to around 1.2, which is fine for headings but cramped for paragraphs. For body text, somewhere between **1.5 and 1.7** gives your words room to breathe. This single property probably does more for readability than anything else in this lesson. And as you learned in [Units](/lessons/css/units), leave it unitless.

## Line length

```css
article p {
	max-width: 65ch;
}
```

Ever read a website on a huge monitor where each line stretches all the way across the screen? By the time your eyes swing back to the left, you've lost your place. Keeping lines around 60 to 75 characters is one of those details nobody notices when it's right, and everyone feels when it's wrong.

## Styling text

```css
h2 {
	text-align: center;
	letter-spacing: 0.02em;
}

.eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-size: 0.875rem;
}

a {
	text-decoration-thickness: 2px;
	text-underline-offset: 3px;
}
```

- `text-align`: `left`, `center`, `right`, or `justify`. Center short things like headings; keep paragraphs left-aligned, because centered paragraphs are hard to read.
- `text-transform: uppercase`: SHOUTING, but done with CSS so the HTML keeps normal capitalization (screen readers sometimes spell out all-caps text letter by letter).
- `letter-spacing`: small uppercase labels look much better with a little extra space between letters.
- `text-decoration`: controls underlines. Modern properties let you set the underline's thickness and offset, which makes links far more elegant.

## A quick type recipe

If you're ever unsure where to start, this recipe works for almost any content page:

```css
body {
	font-family: system-ui, sans-serif;
	font-size: 1.125rem;
	line-height: 1.6;
	color: #222222;
}

h1,
h2,
h3 {
	font-family: Georgia, serif;
	line-height: 1.2;
}
```

A readable body font, a slightly larger base size, generous line-height, near-black text (pure black on pure white is surprisingly harsh), and a contrasting heading font with tighter line spacing. Start there, then make it yours.

## Try it

This editor has no HTML head to put a `<link>` in, so the CSS below loads a Google Font with `@import`, CSS's own way of pulling in another stylesheet. It must come first in a stylesheet, and on real pages `<link>` is faster. It also needs an internet connection. If you're offline, you'll see the fallback fonts instead, which is a nice demo of why font stacks matter.

<WebPlayground
	:panes="['css']"
	:initial-html="'<article>\n\t<p class=\'eyebrow\'>Recipe of the week</p>\n\t<h1>The Only Pancake Recipe You Need</h1>\n\t<p>Fluffy, golden, and ready in twenty minutes. This is the recipe my grandmother made every Sunday, and the one I still make when I need a little comfort. It asks for nothing fancy: flour, eggs, milk, a pinch of salt, and a hot pan.</p>\n\t<p>The secret is patience. Let the batter rest for ten minutes before cooking, and <a href=\'#\'>read why resting matters</a>.</p>\n</article>'"
	:initial-css="'@import url(\'https://fonts.googleapis.com/css2?family=Fraunces:wght@700&amp;display=swap\');\n\nbody {\n\tfont-family: system-ui, sans-serif;\n\tfont-size: 1.125rem;\n\tline-height: 1.2; /* cramped: try 1.6 */\n\tcolor: #222222;\n}\n\nh1 {\n\tfont-family: Fraunces, Georgia, serif;\n\tfont-size: 2.25rem;\n\tline-height: 1.15;\n}\n\n.eyebrow {\n\ttext-transform: uppercase;\n\tletter-spacing: 0.1em;\n\tfont-size: 0.875rem;\n\tcolor: #2f6f8f;\n}\n\narticle p {\n\tmax-width: 65ch;\n}\n'"
	preview-height="360px"
/>

## Try it yourself

1. Change the body `line-height` from `1.2` to `1.6`. Feel the difference.
2. Swap the h1's `Fraunces` for `Georgia` and compare. Then try a Google Font of your own choosing: pick one on fonts.google.com and update the `@import` line.
3. Make the link underline thicker and further from the text with `text-decoration-thickness` and `text-underline-offset`.

## Check your understanding

<Quiz
	question="Why should a font-family list end with a generic family like sans-serif?"
	:options="['It makes the font load faster', 'It is a fallback that always exists if the other fonts are unavailable', 'It is required for bold text', 'It turns on web fonts']"
	:answer-index="1"
	explanation="The browser tries each font in order. The generic family is the guaranteed last resort."
/>

<Quiz
	question="What does font-display: swap do?"
	:options="['Swaps the font every few seconds', 'Shows fallback text immediately, then switches when the web font loads', 'Hides text until the font loads', 'Swaps bold and italic']"
	:answer-index="1"
	explanation="swap avoids invisible text by showing a fallback font right away."
/>

<Quiz
	question="Which line-height is a comfortable choice for paragraphs of body text?"
	:options="['0.8', '1', '1.6', '4']"
	:answer-index="2"
	explanation="Somewhere around 1.5 to 1.7 gives body text room to breathe."
/>

## Up next

Your text looks good. Now let's give the boxes around it some personality: gradients, rounded corners, and shadows, in [Backgrounds, Borders, and Shadows](/lessons/css/backgrounds-and-borders).
