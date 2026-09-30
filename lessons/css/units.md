---
title: "CSS Units: px vs rem vs em vs %, and When to Use Each"
description: "Learn the difference between px, rem, em, percentages, and viewport units, how each one scales, and a simple rule of thumb for choosing the right unit every time."
---

# Units

*A ruler, a recipe, and a room. Every CSS unit is measuring against something, and the trick is knowing what.*

Up to now, I've been handing you numbers like `20px`, `1.6`, and `50%` without really explaining them. You just went along with it. Thanks for that. Now let's talk about what those units actually mean, because picking the right one is the difference between a layout that adapts gracefully and one that breaks the moment someone zooms in.

Every CSS length is measured *against* something. The question is always: against what?

## `px`: a ruler

```css
.avatar {
	width: 120px;
	border: 1px solid #cccccc;
}
```

Pixels are the fixed ruler. `120px` is 120px, no matter where it is or what's around it. Simple and predictable.

(A CSS pixel isn't exactly one physical dot on your screen anymore. High-resolution phones pack two or three physical dots into each CSS pixel. But it behaves like a fixed size, and that's what matters.)

Pixels are great for things that genuinely *shouldn't* scale: thin borders, small shadows, an icon's exact size. The problem comes when you use them for text.

## The problem with pixel text

Many people, often people with low vision, and plenty of older folks, go into their browser settings and set the default text size larger. Maybe 20px instead of 16px.

If your CSS says `font-size: 16px`, you've just overruled them. Your ruler says 16, so it's 16, whatever they asked for. They either squint, or they leave.

We need a unit that respects their choice.

## `rem`: measured against the root

```css
p {
	font-size: 1rem;      /* 1 times the root font size */
}

h1 {
	font-size: 2.5rem;    /* 2.5 times the root font size */
}

.card {
	padding: 1.5rem;
}
```

`rem` stands for "root em," and it means "a multiple of the root font size": the font size on the `<html>` element. In most browsers that's 16px by default, so `1rem` = 16px and `2.5rem` = 40px.

But here's the magic. If someone sets their browser to larger text, the root size grows, and *everything* sized in rem grows with it, proportionally. Your headings, your paragraphs, even your padding. The whole design scales up together like zooming a photo, instead of the text bursting out of its boxes.

Think of it like a recipe written in "cups" instead of grams. Use a bigger cup, and everything scales together, so the proportions stay right.

## `em`: measured against a font size (and it compounds)

```css
.button {
	font-size: 1.25rem;
	padding: 0.5em 1em;   /* relative to THIS button's font size */
}
```

`em` is relative to the **current element's font size**. So on that button, `1em` is 1.25rem, and the padding grows and shrinks along with the button's text. Make a big button and its padding gets roomier automatically. That's a lovely use of `em`: spacing that stays in proportion to the text it surrounds.

There's one twist. When you use `em` for `font-size` itself, it's measured against the **parent's** font size, since an element can't measure its own size with the size it's still deciding. For everything else, like padding, margin, and width, it's the element's own font size.

That's why you need to be careful with `em` on font sizes, because it **compounds**:

```css
li {
	font-size: 1.2em;
}
```

A list item inside a list item inside a list item: 1.2 × 1.2 × 1.2. Each nesting level gets bigger than the one outside it, like Russian nesting dolls in reverse. By the fourth level your text is huge and you have no idea why. That's the most common `em` bug, and it's why most people use `rem` for font sizes.

## `%`: a share of the parent

```css
.sidebar {
	width: 25%;   /* a quarter of the parent's width */
}

img {
	max-width: 100%;   /* never wider than its container */
}
```

Percentages are measured against the parent. "Take up a quarter of the table." They're perfect for fluid widths that grow and shrink with their container. And `max-width: 100%` on images is a classic: it stops big images from spilling out of narrow containers on small screens.

## `vw` and `vh`: the size of the room

```css
.hero {
	min-height: 80vh;   /* 80% of the browser window's height */
}
```

Viewport units measure against the browser window itself. `1vw` is 1% of the window's width; `1vh` is 1% of its height. Great for full-screen sections and big hero banners.

One gotcha: on phones, the browser's address bar slides in and out, and `100vh` can end up slightly taller than what you actually see. Newer units like `100dvh` ("dynamic viewport height") adjust as the bar moves. If a full-height section gets clipped on mobile, that's usually why.

## `ch`: a comfortable line length

```css
article p {
	max-width: 65ch;
}
```

`1ch` is roughly the width of one character. Long lines of text are tiring to read (your eyes lose their place jumping back to the start of the next line), and about 60 to 75 characters per line is comfortable. `max-width: 65ch` gets you there, in any font. You'll use this in [Typography](/lessons/css/typography).

## Unitless line-height

One special case you've already seen: `line-height: 1.6` has no unit at all. That means "1.6 times this element's own font size," and unlike `em`, it recalculates properly for every child element. For line-height, unitless is the way to go.

## So which one do I use?

Here's a rule of thumb that will serve you well for a long time:

| Use | For |
|---|---|
| `rem` | font sizes, and most spacing (padding, margin, gaps) |
| `em` | spacing that should scale with its own text, like button padding |
| `%` | fluid widths relative to a container |
| `vw` / `vh` | sizing relative to the whole screen |
| `px` | borders, fine details, and things that must not scale |
| `ch` | the maximum width of text |
| unitless | line-height |

You'll meet one more unit, `fr`, in [CSS Grid: The Basics](/lessons/css/grid). And later, in [Responsive Design and Media Queries](/lessons/css/responsive-design), you'll combine these with `clamp()` to make text that smoothly grows with the screen.

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<h1>Units in action</h1>\n<p class=\'rem-text\'>I am 1.125rem. I respect the reader\'s font settings.</p>\n<p class=\'px-text\'>I am a fixed 14px. I ignore them.</p>\n<a class=\'button small\' href=\'#\'>Small button</a>\n<a class=\'button large\' href=\'#\'>Large button</a>\n<ul class=\'nested\'><li>Level 1<ul><li>Level 2<ul><li>Level 3</li></ul></li></ul></li></ul>'"
	:initial-css="'html {\n\tfont-size: 100%; /* try 125% to simulate a reader who prefers bigger text */\n\tfont-family: system-ui, sans-serif;\n}\n\n.rem-text { font-size: 1.125rem; }\n.px-text { font-size: 14px; }\n\n.button {\n\tdisplay: inline-block;\n\tpadding: 0.5em 1em;\n\tbackground: #2f6f8f;\n\tcolor: white;\n\ttext-decoration: none;\n}\n.small { font-size: 0.875rem; }\n.large { font-size: 1.5rem; }\n\n.nested li {\n\tfont-size: 1.2em; /* watch it compound */\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Change `html { font-size: 100%; }` to `125%`. The rem paragraph and buttons grow. The px paragraph doesn't. That's what a reader with larger default text experiences.
2. Look at the two buttons. Their padding is the same `0.5em 1em`, but the large button's padding is bigger. Why?
3. Fix the compounding nested list by changing `1.2em` to `1.2rem`.

## Check your understanding

<Quiz
	question="What is 2rem relative to?"
	:options="['The parent element font size', 'The root (html) font size', 'The browser window width', 'A fixed 32 pixels always']"
	:answer-index="1"
	explanation="rem is always a multiple of the root font size, so it scales when readers change their browser text size."
/>

<Quiz
	question="Nested list items using font-size: 1.2em keep getting bigger. Why?"
	:options="['em is relative to the parent size, so it compounds', 'em is broken in lists', 'Lists ignore rem', 'The browser adds padding']"
	:answer-index="0"
	explanation="Each em is measured against the parent, so every level multiplies the size again. rem avoids this."
/>

<Quiz
	question="Which unit is the best choice for a thin 1-pixel border?"
	:options="['rem', 'px', 'vh', '%']"
	:answer-index="1"
	explanation="Fine details that should not scale, like thin borders, are a good use for px."
/>

## Up next

With units under your belt, we can finally make text look beautiful. On to [Typography](/lessons/css/typography).
