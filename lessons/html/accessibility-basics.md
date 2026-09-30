---
title: "HTML Accessibility Basics: alt, labels, ARIA, focus"
description: "Make pages that work for everyone. Learn alt text, form labels, keyboard focus order, skip links, and the basics of ARIA, including when not to use it."
---

# Accessibility Basics

*A ramp at a building entrance was built for wheelchairs. Then parents with strollers, delivery drivers, and travelers with suitcases started using it too.*

You've actually been learning accessibility this whole time. Every time I said "a screen reader will read this," or "keyboard users need that," we were talking about it. This lesson pulls all those threads together and adds the few pieces we haven't covered yet.

## The curb cut effect

Those little ramps cut into the curb at street corners? They were fought for by disability activists so wheelchair users could cross the street. Once they existed, it turned out *everyone* used them: people pushing strollers, rolling luggage, riding bikes, pushing shopping carts.

Web accessibility works the same way. Captions help deaf viewers, *and* people watching on a silent train. Clear labels help screen reader users, *and* everyone filling a form in a hurry. Keyboard support helps people who can't use a mouse, *and* power users who just prefer the keyboard.

So when we talk about accessibility, don't picture a small group of special users. Picture everyone, including you with a broken wrist, or a cracked phone screen, or bright sunlight glaring off your display.

## Who we're building for

A few of the ways people use the web:

- **Screen readers** read the page aloud (or into a braille display) for people who are blind or have low vision.
- **Keyboard-only navigation**, pressing Tab, Enter, and arrow keys, for people with motor disabilities, or with a tremor, or with no mouse handy.
- **Zoom and magnification** for people with low vision.
- **Captions and transcripts** for people who are deaf or hard of hearing.
- **Clear, simple structure** for people with cognitive or learning disabilities, and honestly, for everyone who's tired.

The best news: plain, well-written HTML already supports almost all of this. Most accessibility problems come from people *fighting* HTML, not from HTML falling short.

## The checklist you already know

Quick recap, with where we learned each one:

- **Meaningful alt text** on informative images, empty `alt=""` on decorative ones ([Images](/lessons/html/images)).
- **A real `<label>`** for every form control, connected with `for` and `id` ([Forms: The Basics](/lessons/html/forms-part-1)).
- **A sensible heading outline**, one `<h1>`, no skipped levels ([Headings and Paragraphs](/lessons/html/headings-and-paragraphs)).
- **Landmarks** like `<header>`, `<nav>`, `<main>`, and `<footer>` ([Semantic HTML](/lessons/html/semantic-html)).
- **Link text that makes sense on its own**, no "click here" ([Links and Navigation](/lessons/html/links)).
- **`lang`** on the page and on phrases in other languages.
- **Captions** on videos.

If you're doing all of these, you're already ahead of a huge portion of the web. I mean that.

## Focus order: the keyboard's reading order

When someone presses Tab, a visible outline (the **focus ring**) jumps from one interactive element to the next: link, link, button, input. The order it follows is the order of the elements *in your HTML*.

Think of it as reading a book. If the page numbers jump from 3 to 17 and back to 4, you'd be completely lost. The same happens when your HTML order doesn't match the visual order, for example when CSS moves the menu to the top of the screen while it's actually at the bottom of the code. Keyboard users would hop through the article first, then suddenly land in the menu.

The fix is simple: **write your HTML in the order things should be read and used.** Let CSS handle the looks, not the order.

And never remove the focus ring without replacing it. It's a keyboard user's cursor. Hiding it is like hiding the mouse pointer from everyone else.

## The skip link

Imagine hearing the whole navigation menu read aloud, "Home, About, Blog, Contact, Shop, FAQ...", on every single page before you reach the content. Exhausting, right?

A **skip link** fixes that. It's the very first thing in the `<body>`, and it jumps straight to `<main>`:

```html
<body>
	<a href="#main-content" class="skip-link">Skip to main content</a>
	<header>
		<!-- logo and navigation -->
	</header>
	<main id="main-content">
		<!-- the page's actual content -->
	</main>
</body>
```

CSS usually hides it off-screen until someone presses Tab, then slides it into view. Try it on this very site: press Tab right after a page loads. You'll write that CSS yourself in the CSS track's [Display](/lessons/css/display) lesson.

## ARIA: a label maker for the gaps

**ARIA** (Accessible Rich Internet Applications) is a set of attributes starting with `aria-` that add extra information for assistive technology. You've already met a couple: `aria-current` in [Links and Navigation](/lessons/html/links) and `aria-describedby` in [Form Validation](/lessons/html/form-validation).

Think of ARIA as a label maker. Useful when something genuinely has no label. But you wouldn't stick a label saying "door" on a door. It's already obviously a door.

That's why the very first rule of ARIA, straight from the people who wrote it, is basically: **don't use ARIA if a normal HTML element can do the job.**

```html
<!-- A fake button: needs ARIA, tabindex, and JavaScript for keys... and still isn't quite right -->
<div role="button" tabindex="0">Save</div>

<!-- A real button: keyboard, focus, and screen reader support built in -->
<button type="button">Save</button>
```

The real `<button>` works with the keyboard, shows up in the focus order, and is announced as "Save, button," all for free. The fake one makes you rebuild every one of those things by hand, and it's very easy to miss one. Wrong ARIA is actually worse than no ARIA, because it gives people confident, incorrect information.

## Where ARIA really helps

Save it for the gaps HTML can't fill:

```html
<!-- An icon-only button needs a name -->
<button type="button" aria-label="Close menu">✕</button>

<!-- A toggle that opens and closes something -->
<button type="button" aria-expanded="false" aria-controls="filters">Show filters</button>

<!-- A message that updates without reloading the page -->
<p aria-live="polite" id="cart-status">Your cart is empty.</p>

<!-- A decorative icon that should be skipped -->
<span aria-hidden="true">★</span> Top rated
```

- `aria-label` gives a name to something with no visible text.
- `aria-expanded` tells people whether the thing it controls is open or closed. JavaScript updates it.
- `aria-live="polite"` announces updates to that area when the screen reader has a quiet moment ("Added to cart!").
- `aria-hidden="true"` hides purely decorative bits from assistive technology. Never put it on anything you can focus, or you've made an invisible, clickable trap.

## Don't rely on color alone

"Fields marked in red are required." What about someone who's colorblind? Or looking at a black-and-white printout? Always pair color with something else: text like "(required)," an icon, an underline. Color can *support* the message, but it shouldn't be the only thing carrying it.

## How to test, starting today

You don't need special training to start:

1. **Unplug your mouse.** Tab through your page. Can you reach and use everything? Can you always see where you are?
2. **Zoom to 200%.** Does anything overlap or disappear?
3. **Try a screen reader.** Windows has Narrator, Macs and iPhones have VoiceOver, Android has TalkBack. Five minutes will teach you more than any article.

It'll feel clumsy the first time. That's okay. That clumsy feeling is exactly the empathy that makes you better at this.

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<a href=\'#main-content\'>Skip to main content</a>\n\n<nav>\n\t<a href=\'#\'>Home</a>\n\t<a href=\'#\'>Shop</a>\n\t<a href=\'#\'>Contact</a>\n</nav>\n\n<main id=\'main-content\'>\n\t<h1>Our Menu</h1>\n\t<button type=\'button\'>Real button</button>\n\t<div role=\'button\'>Fake div button</div>\n\t<button type=\'button\' aria-label=\'Close menu\'>X</button>\n\t<p><span aria-hidden=\'true\'>*</span> Top rated</p>\n</main>'"
	preview-height="260px"
/>

## Try it yourself

1. Click inside the preview, then press Tab over and over. Watch the focus ring move through the links and buttons.
2. Notice anything missing? The "Fake div button" never gets focus. A keyboard user could never press it.
3. Swap the fake div for a real `<button>` and Tab through again.

## Check your understanding

<Quiz
	question="What is the first rule of ARIA?"
	:options="['Add ARIA to every element', 'Use a native HTML element instead of ARIA whenever one can do the job', 'Only use ARIA on divs', 'ARIA replaces alt text']"
	:answer-index="1"
	explanation="Native elements come with keyboard support, focus, and roles built in. ARIA is for the gaps they cannot fill."
/>

<Quiz
	question="What decides the order the Tab key moves through a page?"
	:options="['The order elements appear in the HTML', 'Alphabetical order', 'The size of each element', 'The order CSS was written']"
	:answer-index="0"
	explanation="Focus follows the source order of your HTML, so write it in the order things should be read and used."
/>

<Quiz
	question="A close button shows only an X icon. How do you give it an accessible name?"
	:options="['aria-hidden=true', 'aria-label=Close menu', 'tabindex=-1', 'role=link']"
	:answer-index="1"
	explanation="aria-label gives a name to a control that has no visible text."
/>

## Up next

You've built pages that work for people. Now let's make sure they get found, and look good when shared, in [Meta Tags and SEO](/lessons/html/meta-and-head-tags).
