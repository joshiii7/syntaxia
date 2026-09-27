---
title: "CSS Best Practices and Common Mistakes to Avoid"
description: "Keep stylesheets clean as they grow. Learn how to organize CSS, name classes well, keep specificity low, avoid common anti-patterns, and debug layouts that misbehave."
---

# Best Practices and Common Mistakes

*Every stylesheet starts tidy. Without a few good habits, every stylesheet ends up a junk drawer.*

You know the junk drawer. Every house has one. It started as "the drawer for batteries," and now it holds batteries, rubber bands, three dead pens, a single mysterious key, and takeout menus from restaurants that closed years ago. Nobody decided to make it a mess. It just happened, one "I'll put this here for now" at a time.

Stylesheets do exactly the same thing. A quick fix here, an `!important` there, a rule copied from somewhere else "just to get it working." A year later, nobody dares delete anything because nobody knows what it does.

This lesson is about the habits that keep your CSS from becoming a junk drawer, and the mistakes that most often turn it into one.

## Organize the file

A good stylesheet reads from general to specific, like a well-organized closet: the big stuff at the back, the everyday items at the front.

```css
/* 1. Design tokens: colors, spacing, fonts */
:root { ... }

/* 2. Reset and base: box-sizing, body, headings, links */
*, *::before, *::after { box-sizing: border-box; }
body { ... }

/* 3. Layout: containers, page grid, header and footer */
.container { ... }

/* 4. Components: buttons, cards, nav, forms */
.button { ... }
.card { ... }

/* 5. Utilities: small single-purpose helpers */
.visually-hidden { ... }
```

This order also works *with* the cascade you learned in [The Cascade and Specificity](/lessons/css/cascade-and-specificity): broad base styles come first, and more specific component styles come later, so they naturally win ties. On bigger projects, each of these sections often becomes its own file.

## Name classes by purpose

```css
/* Describes appearance: breaks when the design changes */
.blue-text { ... }
.big-box-left { ... }

/* Describes purpose: survives a redesign */
.price { ... }
.product-card { ... }
.site-nav { ... }
```

If the brand color changes from blue to green, `.blue-text` becomes a lie. `.price` is still true. It's the same thinking as choosing HTML elements for their meaning in [Semantic HTML](/lessons/html/semantic-html).

Many teams use a naming pattern to show how classes relate. A popular one is called **BEM** (Block, Element, Modifier):

```css
.card { ... }              /* the block: the component itself */
.card__title { ... }       /* an element: a part of the block */
.card--featured { ... }    /* a modifier: a variation of the block */
```

The double underscores and hyphens look odd at first, but they make it instantly clear that `.card__title` belongs to `.card`. You don't have to use BEM. Just pick *a* consistent convention and stick to it.

## Keep specificity low and flat

This is the habit that prevents the most pain. Compare:

```css
/* Deep and specific: hard to override, breaks if the HTML changes */
#main .content section article div.card h3.title {
	color: #2f6f8f;
}

/* Flat and simple */
.card__title {
	color: #2f6f8f;
}
```

The first selector has a huge specificity score and depends on the exact HTML structure. Move the card out of that `article`, and the style disappears. Try to override it for one special card, and you need an even longer selector. That's how specificity wars start.

The rule of thumb: **style with single classes whenever you can.** Avoid ids for styling. Avoid long chains. And treat `!important` as a fire alarm, not a tool.

## Common mistakes, and their fixes

Here's a gallery of the anti-patterns you'll see most often in real code. If you've written a few of these already, welcome to the club. Everyone has.

**Fixed heights on content.**

```css
/* Breaks as soon as the text is longer, or the reader zooms in */
.card { height: 200px; }

/* Let content decide, with a floor if needed */
.card { min-height: 200px; }
```

**Magic numbers.** `margin-top: 37px` because "it looked right." Six months later, nobody knows why it's 37, and it breaks when a font changes. Use your spacing scale from [CSS Variables](/lessons/css/css-variables), and if a number truly has a reason, leave a comment explaining it.

**Pixels for text.** Covered in [Units](/lessons/css/units): it overrules readers who set a larger text size. Use `rem`.

**Removing focus outlines.** `outline: none` with no replacement. Covered in [Hover, Focus, and Interactive States](/lessons/css/interactive-states). Never.

**Positioning everything absolutely.** It looks perfect at one screen size and falls apart at every other. Use flexbox and grid for layout, and positioning for small overlays only.

**Desktop-only thinking.** Building the whole page on a big monitor and only checking a phone at the end. Start mobile-first, and check small screens as you go.

**Background images for content.** A team photo as a `background-image` has no alt text. Content images belong in HTML.

**Copy-pasting instead of reusing.** Five nearly identical button rules with slightly different paddings. Make one `.button` component, and use modifiers for the variations.

**Dead code.** Rules for elements that were deleted months ago. Your browser's developer tools have a Coverage panel that highlights unused CSS. Clean it out occasionally.

## Debugging a layout that won't cooperate

Every developer, at every level, has sat staring at a layout that just won't behave. Here's a calm, step-by-step approach that works far better than randomly changing values:

1. **Inspect it.** Right-click, **Inspect**. Is your rule even being applied? Is it crossed out, meaning another rule is winning? ([Debugging Basics](/lessons/ide/debugging-basics) walks through the tools.)
2. **Look at the box.** Check the box model diagram. Is there a margin or padding you didn't expect? Maybe from the browser's default styles?
3. **Outline everything.** Temporarily add this to see every box on the page:

   ```css
   * {
   	outline: 1px solid red;
   }
   ```

   Suddenly you can see exactly which box is too wide or overflowing. (Outline, not border, so it doesn't change any sizes. Remember why?)
4. **Check the parent.** Flex and grid properties go on the *container*, not the items. Is the thing you're styling actually the direct child you think it is?
5. **Isolate it.** Copy the broken piece into an empty playground, like the editors on these pages. If it works there, something else on the page is interfering.
6. **Take a break.** Honestly. A surprising number of CSS bugs solve themselves after a ten-minute walk.

## Validate

Just like HTML, CSS has a validator. The W3C CSS Validation Service (jigsaw.w3.org/css-validator) catches typos like `colour`, missing semicolons, and invalid values. Browsers silently ignore CSS they don't understand, so a typo can hide for weeks. The validator finds it in seconds.

## Try it: bug hunt

This card "works," sort of. But it's full of the mistakes from this lesson. How many can you spot and fix?

<WebPlayground
	:panes="['css']"
	:initial-html="'<div id=\'main\'>\n\t<article class=\'blue-box\'>\n\t\t<h3 class=\'title\'>Weekend Brunch</h3>\n\t\t<p>Join us Saturday and Sunday for pancakes, eggs, and the best coffee in town. Bookings recommended for groups of four or more, especially around the holidays.</p>\n\t\t<button class=\'btn\' type=\'button\'>Book a table</button>\n\t</article>\n</div>'"
	:initial-css="'#main article.blue-box h3.title {\n\tcolor: #2f6f8f !important;\n\tfont-size: 22px;\n}\n\n.blue-box {\n\tposition: absolute;\n\ttop: 37px;\n\tleft: 13px;\n\twidth: 300px;\n\theight: 150px;\n\tpadding: 20px;\n\tbackground: #d8e7ef;\n}\n\np {\n\tfont-size: 13px;\n\tcolor: #aaaaaa;\n}\n\n.btn:focus {\n\toutline: none;\n}\n'"
	preview-height="320px"
/>

## Try it yourself

Fix every problem you can find. Here's a checklist so you know when you're done (try first, then peek):

1. The heading selector is far too specific and uses `!important`. Replace it with a single class, like `.card__title`, and update the HTML.
2. `.blue-box` describes appearance. Rename it to something like `.card`.
3. The card is absolutely positioned with magic numbers. Remove the positioning.
4. The fixed `height` makes the text overflow. Remove it, or use `min-height`.
5. Add `box-sizing: border-box` so the width means what it says.
6. The font sizes are in pixels. Convert them to `rem`.
7. The paragraph text is too low-contrast. Darken it.
8. The button's focus outline was removed. Replace it with a visible `:focus-visible` style.

If you found all eight, you've got the eye of a code reviewer. If you found four, that's still four more than you'd have spotted a month ago.

## Check your understanding

<Quiz
	question="Which class name is the best choice for a product price?"
	:options="['.blue-bold', '.price', '.text-22px', '.right-side-thing']"
	:answer-index="1"
	explanation="Name classes by purpose. .price stays accurate even if the design changes completely."
/>

<Quiz
	question="Your rule is not being applied. What is the best first step?"
	:options="['Add !important', 'Inspect the element and see which rule is winning', 'Delete the whole stylesheet', 'Switch to inline styles']"
	:answer-index="1"
	explanation="Developer tools show which rules apply and which are crossed out, so you can fix the real cause."
/>

<Quiz
	question="Why is height: 200px on a text card a common mistake?"
	:options="['Heights are not allowed on cards', 'Longer text or larger font sizes will overflow the box', 'It makes the page load slower', 'It removes the background color']"
	:answer-index="1"
	explanation="Fixed heights cannot adapt to content. Let content decide, or use min-height."
/>

## Up next

You've heard "JavaScript can do that" several times in this track. In the next lesson, you'll see exactly where CSS hands off to JavaScript, and how they work together, in [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript).
