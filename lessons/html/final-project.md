---
title: "HTML Final Project: Build Your Profile Page"
description: "Put the whole HTML track to work by building a complete personal profile page, guided by a numbered checklist of requirements and a self-check for your finished build."
layout: page
sidebar: false
aside: false
outline: false
pageClass: final-project-page
finalProject: true
---

<Exercise
	:panes="['html']"
	:initial-html="'<!DOCTYPE html>\n<html lang=\'en\'>\n<head>\n\t<meta charset=\'UTF-8\'>\n\t<!-- Requirement 1: viewport, title, and description go here -->\n</head>\n<body>\n\t<!-- Requirement 2: skip link -->\n\n\t<!-- Requirement 3: header with your h1 and a nav -->\n\n\t<!-- Requirement 4: main, holding requirements 5 to 9 -->\n\n\t<!-- Requirement 10: footer -->\n</body>\n</html>'"
	:checks="[
		{ type: 'html-contains', expected: 'name=&quot;viewport&quot;', hint: 'Requirement 1: add a viewport meta tag to the head.' },
		{ type: 'html-contains', expected: '<title>', hint: 'Requirement 1: add a title to the head.' },
		{ type: 'html-contains', expected: 'name=&quot;description&quot;', hint: 'Requirement 1: add a meta description to the head.' },
		{ type: 'html-contains', expected: 'href=&quot;#main-content&quot;', hint: 'Requirement 2: add a skip link pointing to #main-content.' },
		{ type: 'html-contains', expected: '<header', hint: 'Requirement 3: add a header element.' },
		{ type: 'html-contains', expected: '<h1', hint: 'Requirement 3: put your name in an h1.' },
		{ type: 'html-contains', expected: '<nav', hint: 'Requirement 3: add a nav with links to your sections.' },
		{ type: 'html-contains', expected: 'id=&quot;main-content&quot;', hint: 'Requirement 4: wrap your content in main with id main-content.' },
		{ type: 'html-contains', expected: '<section', hint: 'Requirements 5, 7, and 9: add your sections.' },
		{ type: 'html-contains', expected: '<figcaption', hint: 'Requirement 6: add a figure with an img and a figcaption.' },
		{ type: 'html-contains', expected: 'alt=', hint: 'Requirement 6: give your image alt text.' },
		{ type: 'html-contains', expected: '<li', hint: 'Requirement 7: add a list of your interests or skills.' },
		{ type: 'html-contains', expected: '<article', hint: 'Requirement 8: add at least one article.' },
		{ type: 'html-contains', expected: '<label', hint: 'Requirement 9: give every form control a label.' },
		{ type: 'html-contains', expected: '<textarea', hint: 'Requirement 9: add a textarea for the message.' },
		{ type: 'html-contains', expected: 'required', hint: 'Requirement 9: make the name and email fields required.' },
		{ type: 'html-contains', expected: 'mailto:', hint: 'Requirement 9: add a mailto link.' },
		{ type: 'html-contains', expected: '<footer', hint: 'Requirement 10: finish with a footer.' }
	]"
	layout="workspace"
>
<template #instructions>

*You started this track asking "what is a tag?" Today, you build a whole page from scratch.*

Before we get to the project, I want you to stop for a second and look back.

Not long ago, you didn't know what `<h1>` meant. Angle brackets were just odd symbols on a keyboard. Remember writing "Hello, world!" and watching it show up in the preview? That small thrill?

Look at what you know now. You can build a document with a proper skeleton. You understand the family tree the browser builds from your code. You can structure text so it has a real outline, add images that describe themselves to people who can't see them, build tables that read correctly out loud, and hold a full conversation with a visitor through a form that checks its own answers. You know how to label every room of a page so a screen reader user can jump straight to the part they want. You know what search engines read, how to embed other people's content safely, and how to pop open a dialog without writing a single line of homemade widget code.

And maybe most importantly, you know *why*. Why meaning beats appearance. Why labels matter. Why the browser forgiving you doesn't mean you got it right.

There were probably moments along the way where something wouldn't work, where half your page turned bold for no reason, or a radio button refused to let go of its neighbor. You pushed through those. That's the actual skill: not knowing everything, but figuring things out.

I'm genuinely proud of you. Now let's put it all to work.

## The project

You're going to build a **personal profile page**: a single page that introduces you to the world. Think of it as the first page of your future portfolio. It could be about the real you, a character you invent, or a future version of you who's already a working developer. Your choice.

Below is a numbered list of requirements. Treat each one like a quiz question you're answering with code. Each comes with a note on *why* it's there, because the point isn't to tick boxes blindly. It's to show yourself you understand what every piece is for.

Build it in the `index.html` tab of this workspace, and press **Run** whenever you like. The **Checks** tab shows you which requirements the checker can already see in your code. When they're all green, you've built a complete, professional HTML page.

## Requirements

### 1. A complete head

Your page must start with `<!DOCTYPE html>`, have `lang` on the `<html>` element, and include in the `<head>`: a `charset` meta tag, a `viewport` meta tag, a unique `<title>` (for example, "Maria Santos, Aspiring Web Developer"), and a meta `description` of around 150 characters.

**Why:** This is the cover of your book. Without the viewport tag, your page is unreadable on phones. Without a good title and description, nobody picks it out of a search result. Review: [Anatomy of an HTML Document](/lessons/html/basic-structure) and [Meta Tags and SEO](/lessons/html/meta-and-head-tags).

### 2. A skip link

The very first thing inside `<body>` must be a link, `<a href="#main-content">Skip to main content</a>`.

**Why:** Keyboard and screen reader users shouldn't have to wade through your navigation on every visit. Review: [Accessibility Basics](/lessons/html/accessibility-basics).

*For now, it'll be visible at the top of your page. In the CSS track, you'll hide it until someone presses Tab.*

### 3. A header with your name and a nav

Include a `<header>` containing your name in the page's **only** `<h1>`, plus a `<nav>` holding a `<ul>` of at least three links that jump to sections further down your page (for example `#about`, `#interests`, `#contact`).

**Why:** Your `<h1>` tells everyone what the whole page is about, and the nav is the hallway connecting every room. It's a list because it *is* a list of places. Review: [Links and Navigation](/lessons/html/links).

### 4. One `<main>`

Wrap all of your primary content (requirements 5 through 9) in a single `<main id="main-content">`.

**Why:** It's the living room of your page, the landing spot for your skip link, and a landmark screen reader users can jump to. Review: [Semantic HTML](/lessons/html/semantic-html).

### 5. An "About me" section

Add a `<section id="about">` with an `<h2>` and at least two paragraphs about yourself. Inside those paragraphs, use at least **two** of these text elements where they genuinely fit: `<strong>`, `<em>`, `<abbr>`, `<q>`, `<time>`.

**Why:** A section is a named part of the page, so it gets a heading. The text elements give your writing a real tone of voice instead of flat text. Review: [Emphasis, Quotes, and Code](/lessons/html/text-formatting).

### 6. A photo with a caption

Inside your About section, include a `<figure>` holding an `<img>` with `src`, `width`, `height`, and meaningful `alt` text, plus a `<figcaption>`.

**Why:** Alt text describes the photo to people who can't see it; the caption gives everyone context. `width` and `height` stop the page from jumping as it loads. Review: [Images](/lessons/html/images) and [Audio, Video, and Figures](/lessons/html/audio-and-video).

*Tip: in this editor, your image file won't exist, so you'll see your alt text in its place. That's actually a great test. Does your alt text still make sense on its own?*

### 7. A section of interests or skills, with a list

Add a `<section id="interests">` with an `<h2>` and at least one list. Use `<ul>` if order doesn't matter, `<ol>` if it does (your top five favorite books, ranked?). Bonus points for a nested list or a `<dl>`.

**Why:** Choosing between list types is about meaning. Would shuffling the items make them wrong? Review: [Lists](/lessons/html/lists).

### 8. At least one `<article>`

Somewhere in `<main>`, add at least one `<article>` with its own heading: a project you've made, a book review, a favorite recipe, a short story. Include at least one external link with **descriptive** link text (no "click here").

**Why:** An article is self-contained. It could be lifted out and still make sense. And descriptive link text works for everyone, including people scanning a list of links out of context.

### 9. A contact form

Add a `<section id="contact">` with an `<h2>` and a `<form>` that asks for:

- a name (`type="text"`),
- an email address (`type="email"`),
- a message (`<textarea>`).

Every control needs a `<label>` connected with `for` and `id`, plus a `name`. Name and email must be `required`. End with a `<button type="submit">` whose text says what happens ("Send message," not "Submit"). Also include a `mailto:` link for people who'd rather email you directly.

**Why:** A form is a conversation, and every question needs to be clearly asked (labels), clearly answered (the right input types), and checked before it's sent (validation). Review: [Forms: The Basics](/lessons/html/forms-part-1) and [Form Validation](/lessons/html/form-validation).

### 10. A footer

Finish with a `<footer>` outside `<main>` containing a copyright line, for example `&copy; 2026 Your Name`.

**Why:** It's the back door of your page, and it completes your landmarks: header, nav, main, footer.

### 11. Clean, valid code

Indent every nested element consistently, use every `id` only once, and once you're finished, paste your code into the W3C validator (validator.w3.org) and fix what it finds.

**Why:** Browsers forgive mistakes; validators don't. A clean validator report is the professional's version of "it works." Review: [Best Practices and Common Mistakes](/lessons/html/best-practices).

### Stretch goals (optional, for the ambitious)

- Add a `<table>` with a `<caption>` and `scope` on its headers, maybe a weekly study schedule or a reading log. ([Tables](/lessons/html/tables))
- Add a small FAQ about yourself using `<details>` and `<summary>`. ([details, dialog, and template](/lessons/html/details-dialog-and-template))
- Add an `<aside>` with a fun fact.
- Store something on an element with a `data-*` attribute. ([Attributes Deep Dive](/lessons/html/attributes-deep-dive))

## Using this workspace

Everything happens right here. The tabs on the left switch between these instructions and your code in `index.html`, which starts with the skeleton and comments marking where each requirement goes. Delete the comments as you fill things in. The **Result** tab on the right shows your page a moment after you stop typing (or when you press **Run**), and the **Checks** tab lists what the checker can already see. Drag the line between the two sides to give either one more room. On a phone, the **Code** and **Result** buttons in the toolbar switch between them. **Reset** puts the starter code back; press it twice, so a stray click can't wipe your work.

The checker can only see whether each piece *exists*. It can't tell whether your alt text is thoughtful, whether your headings make a sensible outline, or whether your link text is descriptive. Only you can judge that, which is exactly what the next section is for.

## Self-check

This is a creative build, not a fact check, so there's no score here. Instead, read each question and answer it honestly, yes or no, about your own page. Every "no" is just a pointer to something worth another pass.

1. If I read only my headings, top to bottom, do they make a sensible outline of my page?
2. Would a screen reader user be able to jump straight to my main content, and find my nav, header, and footer?
3. If my photo didn't load, would my alt text still tell someone what it showed?
4. Does every one of my links make sense if read on its own, out of context?
5. Can I reach and use every link, input, and button using only the Tab and Enter keys?
6. Does every form control have a visible label, even after someone starts typing?
7. Did I choose each element for what the content *is*, not for how it looks?
8. If I came back to this code in six months, could I understand it quickly?
9. Does the W3C validator come back clean (or close to it, with only issues I understand)?

If you answered yes to all nine, you've built something a professional would be happy to put their name on. If you answered no to a few, that's completely normal. Go fix them. That second pass is where good developers are made.

## Where you go from here

Right now your page is solid, meaningful, accessible, and... probably plain. Black text, white background, default fonts. That's fine. You've built the house.

Next, we decorate it. In the [CSS track](/lessons/css/intro-to-css), you'll take this exact page and give it color, layout, and personality. Everything you labeled here, every class, every id, every semantic room, is about to become a handle you can style. See you there.

</template>
</Exercise>
