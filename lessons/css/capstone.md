---
title: "CSS Capstone Project: Style Your Profile Page"
description: "Bring the CSS track together by fully styling your HTML profile page, with typography, a flexbox or grid layout, hover transitions, and a mobile-first responsive breakpoint."
---

# Capstone: Style Your Profile Page

*You started this track making text a different color. Today you build a real design system for a real page.*

Before we build anything, let's look back for a second.

At the start of this track, your first CSS rule was `h1 { color: #2f6f8f; }`, and seeing that heading turn blue felt like a small magic trick. Remember? Selector, curly braces, property, value, semicolon. You'd probably never heard the word "specificity."

Look at what you can do now. You know why one rule beats another, and how to find the winner when a style refuses to apply. You see every element as a framed picture, with matting, a frame, and wall space around it. You pick units that respect readers who need bigger text. You set type that's comfortable to read. You can line things up along a wall with flexbox, lay out a whole floor plan with grid, and write a card grid that rearranges itself for any screen in a single line. Your pages dress for the weather, glide instead of snap, keep a visible cursor for keyboard users, and switch to dark mode by re-mixing a few paint tins.

And there were surely moments along the way where a layout just would not cooperate. A badge flew off to the corner of the page. A `z-index` of 9999 did nothing. A heading refused to change color. You worked through those, and every one taught you something about how CSS actually thinks.

That's the jump from "CSS makes text a different color" to *real layout systems*. I'm proud of you. Let's make something beautiful.

## The project

At the end of the HTML track, you built a personal profile page in [Capstone: Your Profile Page](/lessons/html/putting-it-all-together). Solid structure, meaningful elements, accessible forms, and probably still in plain black Times New Roman.

Now you'll style it, completely.

The editor at the bottom of this page has two panes. The HTML pane starts with a sample profile page built to the HTML capstone's requirements. **Paste your own page into it** if you have it (that's the best option), or use the sample. You're welcome to add `class` attributes to the HTML as you style, but keep the structure and meaning intact.

Below are the requirements, numbered like quiz questions. Each one says what to build and *why* it matters. A checker under the editor reads your CSS every time you press **Run** and ticks off the requirements it can detect.

## Requirements

### 1. Design tokens in `:root`

Start your CSS with a `:root` block defining at least three custom properties: a brand color, a text color, and a spacing value (for example `--color-brand`, `--color-text`, `--space-md`). Use them throughout the rest of your stylesheet with `var()`.

**Why:** When every color and gap comes from a handful of labeled tins, changing your look later means editing one line, not twenty. It's also what makes the dark mode stretch goal below almost free. Review: [CSS Variables](/lessons/css/css-variables).

### 2. A `box-sizing` reset

Add the `border-box` reset for all elements and their `::before` and `::after`.

**Why:** It makes `width` mean the whole framed picture, so padding never breaks your layout math. Review: [The Box Model](/lessons/css/box-model).

### 3. Typography with a proper font stack

On `body`, set a `font-family` stack that ends with a generic family, a base `font-size` in `rem`, and a unitless `line-height` between 1.5 and 1.7. Give your headings a contrasting style: a different font, weight, or size.

**Why:** Most of your page is text. A good stack, a readable size that respects reader settings, and generous line spacing do more for how professional it looks than anything else. Review: [Typography](/lessons/css/typography) and [Units](/lessons/css/units).

### 4. A comfortable content width

Keep your main content from stretching across giant screens: a centered container with a `max-width` (the `min()` container recipe works well), and paragraphs no wider than about `65ch`.

**Why:** Lines that are too long are hard to read, because your eyes lose their place. Review: [Common Layout Patterns](/lessons/css/layout-patterns).

### 5. Readable colors

Choose text and background colors with a contrast ratio of at least 4.5 to 1 for body text. Check them in your browser's developer tools or with a contrast checker.

**Why:** A beautiful page nobody can read isn't beautiful. Review: [Colors](/lessons/css/colors).

### 6. A flexbox header

Lay out your `<header>` with flexbox: your name on one side, your nav on the other, vertically centered, with the nav links in a row with a `gap`.

**Why:** This is the most common flexbox pattern on the web, and your nav list becomes a real menu bar without changing its HTML meaning. Review: [Flexbox in Practice](/lessons/css/flexbox-in-practice).

### 7. A grid (or flexbox) layout for your content

Use grid or flexbox for at least one content area: your interests list as a set of cards, your articles in a responsive card grid (`repeat(auto-fit, minmax(...))`), or your About section with the photo beside the text.

**Why:** Real pages arrange content in rows and columns, not one long stack. This is where your page starts to look *designed*. Review: [CSS Grid in Practice](/lessons/css/grid-in-practice).

### 8. A responsive, polished image

Give your image `max-width: 100%` and `height: auto` so it never overflows its container, plus some polish, like `border-radius` (a circle for a profile photo?) or a soft `box-shadow`.

**Why:** Images that burst out of their containers are the most common mobile layout bug. Review: [Backgrounds, Borders, and Shadows](/lessons/css/backgrounds-and-borders).

### 9. A styled form with visible focus

Style your contact form: labels on their own lines, inputs that fill the available width with comfortable padding, a styled submit button, and a clearly visible `:focus-visible` style on every input and button.

**Why:** A form is a conversation, and keyboard users need to see where they are in it. Never remove focus without replacing it. Review: [Hover, Focus, and Interactive States](/lessons/css/interactive-states).

### 10. At least one hover effect with a transition

Give your links, buttons, or cards a `:hover` state (and the same effect on `:focus-visible`), and make the change glide with a `transition` on `transform`, `opacity`, or a color.

**Why:** Feedback tells visitors the page heard them, and a short transition makes it feel smooth instead of mechanical. Review: [Transitions and Animations](/lessons/css/transitions-and-animations).

### 11. A mobile-first responsive breakpoint

Write your base styles for small screens (a single column), then add at least one `min-width` media query that changes the layout for wider screens: a two-column About section, more cards per row, or a roomier header.

**Why:** Most visitors are on phones. Mobile-first keeps your base styles simple and adds layers only when there's room. Review: [Responsive Design and Media Queries](/lessons/css/responsive-design).

### 12. Respect reduced motion

Add a `prefers-reduced-motion: reduce` media query that turns off or shortens your transitions and animations.

**Why:** For some visitors, motion causes real physical discomfort. Honoring their setting takes a few lines.

### 13. Clean, organized CSS

Organize your stylesheet from general to specific (tokens, base, layout, components), name any new classes by purpose, keep selectors short and flat, use no `!important` outside the reduced-motion block, and run your CSS through the W3C CSS validator.

**Why:** Future-you has to maintain this. Keep it a closet, not a junk drawer. Review: [Best Practices and Common Mistakes](/lessons/css/best-practices).

### Stretch goals (optional, for the ambitious)

- Add a dark theme by re-mixing your variables inside `@media (prefers-color-scheme: dark)`.
- Make your header `position: sticky` with a background and a subtle shadow.
- Use a Google Font for your headings, with `display=swap` and a sensible fallback stack.
- Add a gentle `@keyframes` fade-in for the main content on page load (and make sure requirement 12 covers it).
- Use `clamp()` so your main heading scales smoothly with the screen.

## Build it here

Press **Run** to see your styles and update the checklist. For the responsive requirements, resize your browser window to watch the layout adapt.

<Exercise
	:panes="['html', 'css']"
	:initial-html="'<!DOCTYPE html>\n<html lang=\'en\'>\n<head>\n\t<meta charset=\'UTF-8\'>\n\t<meta name=\'viewport\' content=\'width=device-width, initial-scale=1\'>\n\t<title>Maria Santos, Aspiring Web Developer</title>\n\t<meta name=\'description\' content=\'Maria Santos is a home baker and weekend hiker learning web development. Read about her projects, interests, and how to get in touch.\'>\n</head>\n<body>\n\t<a href=\'#main-content\'>Skip to main content</a>\n\t<header>\n\t\t<h1>Maria Santos</h1>\n\t\t<nav>\n\t\t\t<ul>\n\t\t\t\t<li><a href=\'#about\'>About</a></li>\n\t\t\t\t<li><a href=\'#interests\'>Interests</a></li>\n\t\t\t\t<li><a href=\'#contact\'>Contact</a></li>\n\t\t\t</ul>\n\t\t</nav>\n\t</header>\n\n\t<main id=\'main-content\'>\n\t\t<section id=\'about\'>\n\t\t\t<h2>About me</h2>\n\t\t\t<figure>\n\t\t\t\t<img src=\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMjQwIDI0MCI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNkOGU3ZWYiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSI5NiIgcj0iNDQiIGZpbGw9IiMyZjZmOGYiLz48cGF0aCBkPSJNNDAgMjQwYzAtNDggMzYtODAgODAtODBzODAgMzIgODAgODB6IiBmaWxsPSIjMmY2ZjhmIi8+PC9zdmc+\' alt=\'A simple illustrated portrait of Maria in blue tones\' width=\'240\' height=\'240\'>\n\t\t\t\t<figcaption>Me, drawn by my niece for my birthday.</figcaption>\n\t\t\t</figure>\n\t\t\t<p>I am a home baker, a weekend hiker, and an <strong>aspiring web developer</strong>. I started learning to code in <time datetime=\'2026\'>2026</time> because I wanted to build a website for my family bakery.</p>\n\t\t\t<p>My grandmother always said <q>measure twice, cut once</q>, and it turns out that is good advice for writing code too.</p>\n\t\t</section>\n\n\t\t<section id=\'interests\'>\n\t\t\t<h2>Things I love</h2>\n\t\t\t<ul>\n\t\t\t\t<li>Baking sourdough</li>\n\t\t\t\t<li>Hiking mountain trails</li>\n\t\t\t\t<li>Building small websites</li>\n\t\t\t\t<li>Reading mystery novels</li>\n\t\t\t</ul>\n\t\t</section>\n\n\t\t<article>\n\t\t\t<h2>My first project: the family bakery site</h2>\n\t\t\t<p>A one-page site with our opening hours, a menu, and a contact form. I learned the basics from <a href=\'https://developer.mozilla.org/en-US/docs/Web/HTML\'>the MDN guide to HTML</a>.</p>\n\t\t</article>\n\n\t\t<section id=\'contact\'>\n\t\t\t<h2>Get in touch</h2>\n\t\t\t<form>\n\t\t\t\t<label for=\'contact-name\'>Your name</label>\n\t\t\t\t<input type=\'text\' id=\'contact-name\' name=\'name\' required>\n\t\t\t\t<label for=\'contact-email\'>Your email</label>\n\t\t\t\t<input type=\'email\' id=\'contact-email\' name=\'email\' required>\n\t\t\t\t<label for=\'contact-message\'>Message</label>\n\t\t\t\t<textarea id=\'contact-message\' name=\'message\' rows=\'4\'></textarea>\n\t\t\t\t<button type=\'submit\'>Send message</button>\n\t\t\t</form>\n\t\t\t<p>Or <a href=\'mailto:maria@example.com\'>email me directly</a>.</p>\n\t\t</section>\n\t</main>\n\n\t<footer>\n\t\t<p>&amp;copy; 2026 Maria Santos</p>\n\t</footer>\n</body>\n</html>'"
	:initial-css="'/* 1. Design tokens */\n:root {\n\t\n}\n\n/* 2. Reset and base */\n\n/* 3. Layout */\n\n/* 4. Components */\n\n/* 5. Responsive and motion preferences */\n'"
	:initial-js="'// Capstone checker: reads your CSS once the page loads and reports what it finds.\nwindow.addEventListener(\'load\', () => {\n\tconst rules = [];\n\tconst conditions = [];\n\tconst collect = (list) => {\n\t\tfor (const rule of list) {\n\t\t\tif (rule.conditionText !== undefined) {\n\t\t\t\tconditions.push(rule.conditionText);\n\t\t\t\tcollect(rule.cssRules);\n\t\t\t} else if (rule.style) {\n\t\t\t\trules.push(rule);\n\t\t\t}\n\t\t}\n\t};\n\tfor (const sheet of document.styleSheets) {\n\t\ttry {\n\t\t\tcollect(sheet.cssRules);\n\t\t} catch {\n\t\t\t// Cross-origin stylesheets (like Google Fonts) cannot be read. Skipping them is expected.\n\t\t}\n\t}\n\tconst css = rules.map((rule) => rule.cssText).join(\' \');\n\tconst some = (test) => rules.some(test);\n\tconst selector = (rule) => rule.selectorText || \'\';\n\tconst pass = (id, ok) => {\n\t\tif (ok) console.log(\'capstone:\' + id);\n\t};\n\tpass(\'variables\', css.includes(\'--\'));\n\tpass(\'box-sizing\', some((rule) => rule.style.boxSizing === \'border-box\'));\n\tpass(\'font\', some((rule) => rule.style.fontFamily !== \'\'));\n\tpass(\'line-height\', some((rule) => rule.style.lineHeight !== \'\'));\n\tpass(\'rem\', css.includes(\'rem\'));\n\tpass(\'max-width\', some((rule) => rule.style.maxWidth !== \'\' || rule.style.width.includes(\'min(\')));\n\tpass(\'layout\', [...document.querySelectorAll(\'body *\')].some((el) => /flex|grid/.test(getComputedStyle(el).display)));\n\tpass(\'image\', some((rule) => /img/.test(selector(rule)) && rule.style.maxWidth !== \'\'));\n\tpass(\'focus\', some((rule) => selector(rule).includes(\':focus\')));\n\tpass(\'hover\', some((rule) => selector(rule).includes(\':hover\')));\n\tpass(\'transition\', some((rule) => rule.style.transitionDuration !== \'\' && rule.style.transitionDuration !== \'0s\'));\n\tpass(\'breakpoint\', conditions.some((text) => /min-width|width *>/.test(text)));\n\tpass(\'reduced-motion\', conditions.some((text) => text.includes(\'prefers-reduced-motion\')));\n});\n'"
	preview-height="560px"
	:checks="[
		{ type: 'console-includes', expected: 'capstone:variables', hint: 'Requirement 1: define custom properties in :root and use them with var().' },
		{ type: 'console-includes', expected: 'capstone:box-sizing', hint: 'Requirement 2: add the box-sizing: border-box reset.' },
		{ type: 'console-includes', expected: 'capstone:font', hint: 'Requirement 3: set a font-family stack on body.' },
		{ type: 'console-includes', expected: 'capstone:line-height', hint: 'Requirement 3: set a unitless line-height for body text.' },
		{ type: 'console-includes', expected: 'capstone:rem', hint: 'Requirement 3: use rem for font sizes and spacing.' },
		{ type: 'console-includes', expected: 'capstone:max-width', hint: 'Requirement 4: limit your content width with max-width (or a min() container).' },
		{ type: 'console-includes', expected: 'capstone:layout', hint: 'Requirements 6 and 7: use display: flex or display: grid for your header and content.' },
		{ type: 'console-includes', expected: 'capstone:image', hint: 'Requirement 8: give img a max-width so it never overflows.' },
		{ type: 'console-includes', expected: 'capstone:focus', hint: 'Requirement 9: add a visible :focus-visible style.' },
		{ type: 'console-includes', expected: 'capstone:hover', hint: 'Requirement 10: add a :hover effect.' },
		{ type: 'console-includes', expected: 'capstone:transition', hint: 'Requirement 10: make your hover effect glide with a transition.' },
		{ type: 'console-includes', expected: 'capstone:breakpoint', hint: 'Requirement 11: add a mobile-first min-width media query.' },
		{ type: 'console-includes', expected: 'capstone:reduced-motion', hint: 'Requirement 12: add a prefers-reduced-motion media query.' }
	]"
/>

The checker can only see whether each technique is *present*. It can't tell whether your colors are readable, whether your layout looks balanced, or whether your stylesheet is organized. That judgment is yours, which is what the self-check below is for.

## Self-check

This is a design project, so there's no score. Read each question and answer it honestly, yes or no, about your own page. Every "no" is just a pointer to your next improvement.

1. Does my layout hold together if I shrink the browser window all the way down to phone width, and stretch it back out?
2. Did I use `rem` (or `em`) instead of hardcoded pixels for text and spacing, where it matters?
3. If I set my browser's default text size larger, does my page still look right, with nothing overlapping or cut off?
4. Can I Tab through every link, input, and button and always see clearly where I am?
5. Is every piece of text comfortable to read, with enough contrast against its background?
6. Does every hover effect also work for keyboard focus, and does nothing important depend on hover alone?
7. If I changed my brand color in `:root`, would the whole page update from that one line?
8. Are my selectors short and flat, with no `!important` outside the reduced-motion block?
9. Would another developer be able to find the styles for my header, my cards, or my form in under a minute?
10. When I look at my page, does it feel like *mine*?

If you answered yes to all ten, you've built something you can proudly show anyone: a future employer, a client, your family. If a few came back "no," that's completely normal. Go back and fix them. The second pass is where good developers become great ones.

## Where you go from here

Your page is structured, meaningful, accessible, and now genuinely good-looking. It adapts to any screen, responds to every hover and keypress, and respects the people using it.

There's just one thing it can't do yet: *think*. It can't remember a visitor's theme choice, validate a form with a friendly custom message, or load new content without refreshing the page. That's the electrician's job. See you in the [JavaScript track](/lessons/javascript/intro-to-javascript), where your page comes alive.
