---
title: "JavaScript Final Project: Bring Your Profile Page to Life"
description: "Finish the JavaScript track by making your profile page interactive: a remembered theme toggle, lists built from data, projects loaded with fetch, and a validated form."
layout: page
sidebar: false
aside: false
outline: false
pageClass: final-project-page
finalProject: true
---

<Exercise
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<a class=&quot;skip-link&quot; href=&quot;#main-content&quot;>Skip to main content<\/a>\n<header>\n\t<h1>Maria Santos<\/h1>\n\t<nav aria-label=&quot;Main&quot;>\n\t\t<ul>\n\t\t\t<li><a href=&quot;#about&quot;>About<\/a><\/li>\n\t\t\t<li><a href=&quot;#interests&quot;>Interests<\/a><\/li>\n\t\t\t<li><a href=&quot;#projects&quot;>Projects<\/a><\/li>\n\t\t\t<li><a href=&quot;#contact&quot;>Contact<\/a><\/li>\n\t\t<\/ul>\n\t<\/nav>\n\t<button type=&quot;button&quot; id=&quot;theme-toggle&quot; aria-pressed=&quot;false&quot;>Dark mode<\/button>\n<\/header>\n\n<main id=&quot;main-content&quot;>\n\t<section id=&quot;about&quot;>\n\t\t<h2>About me<\/h2>\n\t\t<figure>\n\t\t\t<img src=&quot;data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMjQwIDI0MCI+PHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNkOGU3ZWYiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSI5NiIgcj0iNDQiIGZpbGw9IiMyZjZmOGYiLz48cGF0aCBkPSJNNDAgMjQwYzAtNDggMzYtODAgODAtODBzODAgMzIgODAgODB6IiBmaWxsPSIjMmY2ZjhmIi8+PC9zdmc+&quot; alt=&quot;A simple illustrated portrait of Maria in blue tones&quot; width=&quot;160&quot; height=&quot;160&quot;>\n\t\t\t<figcaption>Me, drawn by my niece for my birthday.<\/figcaption>\n\t\t<\/figure>\n\t\t<p>I am a home baker, a weekend hiker, and an <strong>aspiring web developer<\/strong>.<\/p>\n\t<\/section>\n\n\t<section id=&quot;interests&quot;>\n\t\t<h2>Things I love<\/h2>\n\t\t<ul id=&quot;interests-list&quot;><\/ul>\n\t<\/section>\n\n\t<section id=&quot;projects&quot;>\n\t\t<h2>Projects<\/h2>\n\t\t<p id=&quot;projects-status&quot; role=&quot;status&quot;><\/p>\n\t\t<div id=&quot;project-list&quot; class=&quot;cards&quot;><\/div>\n\t<\/section>\n\n\t<section id=&quot;contact&quot;>\n\t\t<h2>Get in touch<\/h2>\n\t\t<form id=&quot;contact-form&quot; novalidate>\n\t\t\t<label for=&quot;contact-name&quot;>Your name<\/label>\n\t\t\t<input id=&quot;contact-name&quot; name=&quot;name&quot; required minlength=&quot;2&quot; autocomplete=&quot;name&quot; aria-describedby=&quot;name-error&quot;>\n\t\t\t<span id=&quot;name-error&quot; class=&quot;field-error&quot;><\/span>\n\n\t\t\t<label for=&quot;contact-email&quot;>Your email<\/label>\n\t\t\t<input id=&quot;contact-email&quot; name=&quot;email&quot; type=&quot;email&quot; required autocomplete=&quot;email&quot; aria-describedby=&quot;email-error&quot;>\n\t\t\t<span id=&quot;email-error&quot; class=&quot;field-error&quot;><\/span>\n\n\t\t\t<label for=&quot;contact-message&quot;>Message<\/label>\n\t\t\t<textarea id=&quot;contact-message&quot; name=&quot;message&quot; rows=&quot;4&quot; maxlength=&quot;200&quot; aria-describedby=&quot;message-count&quot;><\/textarea>\n\t\t\t<span id=&quot;message-count&quot;>200 characters left<\/span>\n\n\t\t\t<button type=&quot;submit&quot;>Send message<\/button>\n\t\t<\/form>\n\t\t<p id=&quot;form-status&quot; role=&quot;status&quot;><\/p>\n\t\t<p>Or <a href=&quot;mailto:maria@example.com&quot;>email me directly<\/a>.<\/p>\n\t<\/section>\n<\/main>\n\n<footer>\n\t<p>&amp;copy; 2026 Maria Santos<\/p>\n<\/footer>\n\n<!-- Final project checker: runs after your code and reports what it finds. Leave it here, at the bottom. -->\n<script>\n(() => {\n\tconst errors = [];\n\twindow.addEventListener(\'error\', (event) => errors.push(event.message));\n\n\twindow.addEventListener(\'load\', () => {\n\t\tsetTimeout(() => {\n\t\t\t// Each check runs on its own, so one missing piece never hides the others.\n\t\t\tconst check = (id, test) => {\n\t\t\t\ttry {\n\t\t\t\t\tif (test()) console.log(`final-project:${id}`);\n\t\t\t\t} catch (error) {\n\t\t\t\t\t// A failed check just stays unticked; the hint under the editor explains it.\n\t\t\t\t}\n\t\t\t};\n\t\t\tconst root = document.documentElement;\n\n\t\t\tcheck(\'theme\', () => {\n\t\t\t\tconst toggle = document.querySelector(\'#theme-toggle\');\n\t\t\t\tconst before = root.dataset.theme;\n\t\t\t\ttoggle.click();\n\t\t\t\tconst after = root.dataset.theme;\n\t\t\t\tconst pressedMatches = toggle.getAttribute(\'aria-pressed\') === String(after === \'dark\');\n\t\t\t\ttoggle.click();\n\t\t\t\treturn [\'light\', \'dark\'].includes(before) &amp;&amp; [\'light\', \'dark\'].includes(after)\n\t\t\t\t\t&amp;&amp; before !== after &amp;&amp; pressedMatches &amp;&amp; root.dataset.theme === before;\n\t\t\t});\n\n\t\t\tcheck(\'interests\', () => document.querySelectorAll(\'#interests-list li\').length >= 3);\n\t\t\tcheck(\'projects\', () => document.querySelectorAll(\'#project-list article\').length >= 1);\n\n\t\t\tcheck(\'counter\', () => {\n\t\t\t\tconst message = document.querySelector(\'#contact-message\');\n\t\t\t\tconst counter = document.querySelector(\'#message-count\');\n\t\t\t\tmessage.value = \'Hello\';\n\t\t\t\tmessage.dispatchEvent(new Event(\'input\', { bubbles: true }));\n\t\t\t\tconst counted = counter.textContent.includes(String(message.maxLength - 5));\n\t\t\t\tmessage.value = \'\';\n\t\t\t\tmessage.dispatchEvent(new Event(\'input\', { bubbles: true }));\n\t\t\t\treturn counted;\n\t\t\t});\n\n\t\t\tcheck(\'validation\', () => {\n\t\t\t\tconst form = document.querySelector(\'#contact-form\');\n\t\t\t\tconst nameField = document.querySelector(\'#contact-name\');\n\t\t\t\tform.dispatchEvent(new SubmitEvent(\'submit\', { bubbles: true, cancelable: true }));\n\t\t\t\tconst flagged = nameField.getAttribute(\'aria-invalid\') === \'true\'\n\t\t\t\t\t&amp;&amp; document.querySelector(\'#name-error\').textContent.trim() !== \'\'\n\t\t\t\t\t&amp;&amp; document.activeElement === nameField;\n\t\t\t\t// Tidy up, so the empty-form errors don\'t greet you on every run.\n\t\t\t\tform.querySelectorAll(\'.field-error\').forEach((element) => { element.textContent = \'\'; });\n\t\t\t\tform.querySelectorAll(\'[aria-invalid]\').forEach((field) => field.removeAttribute(\'aria-invalid\'));\n\t\t\t\tdocument.querySelector(\'#form-status\').textContent = \'\';\n\t\t\t\tdocument.activeElement.blur();\n\t\t\t\treturn flagged;\n\t\t\t});\n\n\t\t\tconst code = document.scripts[document.scripts.length - 1].textContent;\n\t\t\tcheck(\'modern\', () => !/\\bvar\\s/.test(code) &amp;&amp; !/[^=!<>]==[^=]/.test(code) &amp;&amp; !/!=[^=]/.test(code));\n\t\t\tcheck(\'safe\', () => !code.includes(\'innerHTML\'));\n\t\t\tcheck(\'clean\', () => errors.length === 0);\n\t\t}, 800);\n\t});\n})();\n<\/script>\n'"
	:initial-css="'/* The styles are done for you this time, built from the CSS track. */\n:root {\n\t--color-bg: #ffffff;\n\t--color-surface: #f3f6f8;\n\t--color-text: #222222;\n\t--color-muted: #555555;\n\t--color-brand: #2f6f8f;\n\t--color-error: #b3261e;\n\t--space: 1rem;\n\t--radius: 10px;\n}\n\n:root[data-theme=&quot;dark&quot;] {\n\t--color-bg: #111827;\n\t--color-surface: #1f2937;\n\t--color-text: #e5e7eb;\n\t--color-muted: #b6bfcc;\n\t--color-brand: #7cc4e4;\n\t--color-error: #f2b8b5;\n\tcolor-scheme: dark;\n}\n\n*,\n*::before,\n*::after {\n\tbox-sizing: border-box;\n}\n\nbody {\n\tmargin: 0;\n\tbackground: var(--color-bg);\n\tcolor: var(--color-text);\n\tfont-family: system-ui, sans-serif;\n\tline-height: 1.6;\n}\n\na {\n\tcolor: var(--color-brand);\n}\n\n/* Hidden until a keyboard user tabs to it. */\n.skip-link {\n\tposition: absolute;\n\tleft: -9999px;\n}\n\n.skip-link:focus {\n\tleft: var(--space);\n\ttop: var(--space);\n\tpadding: 0.5rem 1rem;\n\tbackground: var(--color-bg);\n}\n\nheader {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\talign-items: center;\n\tgap: var(--space);\n\tpadding: var(--space);\n\tbackground: var(--color-surface);\n}\n\nheader h1 {\n\tmargin: 0;\n\tfont-size: 1.5rem;\n}\n\nheader nav {\n\tmargin-left: auto;\n}\n\nheader ul {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tgap: var(--space);\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style: none;\n}\n\nmain {\n\twidth: min(100% - 2rem, 48rem);\n\tmargin-inline: auto;\n}\n\nfigure {\n\tmargin: 0;\n}\n\nimg {\n\tmax-width: 100%;\n\theight: auto;\n\tborder-radius: 50%;\n}\n\n.cards {\n\tdisplay: grid;\n\tgrid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n\tgap: var(--space);\n}\n\n.cards article {\n\tpadding: var(--space);\n\tbackground: var(--color-surface);\n\tborder-radius: var(--radius);\n}\n\n.cards h3 {\n\tmargin-top: 0;\n}\n\nlabel {\n\tdisplay: block;\n\tmargin-top: var(--space);\n\tfont-weight: 600;\n}\n\ninput,\ntextarea {\n\twidth: 100%;\n\tpadding: 0.5rem;\n\tfont: inherit;\n\tcolor: inherit;\n\tbackground: var(--color-bg);\n\tborder: 1px solid var(--color-muted);\n\tborder-radius: 6px;\n}\n\n.field-error {\n\tdisplay: block;\n\tcolor: var(--color-error);\n}\n\n[aria-invalid=&quot;true&quot;] {\n\tborder-color: var(--color-error);\n}\n\nbutton {\n\tmargin-top: var(--space);\n\tpadding: 0.5rem 1rem;\n\tfont: inherit;\n\tcolor: var(--color-bg);\n\tbackground: var(--color-brand);\n\tborder: none;\n\tborder-radius: 6px;\n\tcursor: pointer;\n}\n\nheader button {\n\tmargin-top: 0;\n}\n\na:focus-visible,\nbutton:focus-visible,\ninput:focus-visible,\ntextarea:focus-visible {\n\toutline: 3px solid var(--color-brand);\n\toutline-offset: 2px;\n}\n\nfooter {\n\tpadding: var(--space);\n\ttext-align: center;\n\tcolor: var(--color-muted);\n}\n'"
	:initial-js="'// Preview-only helper: this sandbox blocks real form submissions, so this\n// fires the submit event by hand. On a real page, delete these lines.\ndocument.addEventListener(\'click\', (event) => {\n\tconst button = event.target.closest(\'button\');\n\tif (button &amp;&amp; button.form &amp;&amp; button.type === \'submit\') {\n\t\tevent.preventDefault();\n\t\tbutton.form.dispatchEvent(new SubmitEvent(\'submit\', { cancelable: true, submitter: button }));\n\t}\n});\n\n// Preview-only: a pretend server address for your projects, like the one in\n// Loading Data with fetch. Treat PROJECTS_URL like any real API address.\nconst PROJECTS_URL = \'data:application/json,\' + encodeURIComponent(JSON.stringify([\n\t{ title: \'The family bakery site\', description: \'A one-page site with our hours, menu, and a contact form.\' },\n\t{ title: \'Sourdough starter tracker\', description: \'A tiny page that reminds me when to feed my starter.\' },\n\t{ title: \'Trail log\', description: \'Every hike I have done, with distances and photos.\' },\n]));\n\n// Storage helpers from Saving Data with localStorage. When storage is\n// blocked (like in this preview), they remember in memory instead.\nconst memory = new Map();\n\nfunction loadSetting(key, fallback) {\n\ttry {\n\t\tconst saved = localStorage.getItem(key);\n\t\treturn saved === null ? fallback : JSON.parse(saved);\n\t} catch (error) {\n\t\treturn memory.has(key) ? memory.get(key) : fallback;\n\t}\n}\n\nfunction saveSetting(key, value) {\n\ttry {\n\t\tlocalStorage.setItem(key, JSON.stringify(value));\n\t} catch (error) {\n\t\tmemory.set(key, value);\n\t}\n}\n\n// Requirement 1: the theme toggle\n\n// Requirement 2: the interests list\n\n// Requirement 3: the projects, loaded with fetch\n\n// Requirement 4: the message character counter\n\n// Requirement 5: the contact form\n'"
	show-console
	:grade-delay="1500"
	:checks="[
		{ type: 'console-includes', expected: 'final-project:theme', hint: 'Requirement 1: set data-theme on load, flip it on click, and keep aria-pressed in sync.' },
		{ type: 'console-includes', expected: 'final-project:interests', hint: 'Requirement 2: build at least three li elements inside #interests-list.' },
		{ type: 'console-includes', expected: 'final-project:projects', hint: 'Requirement 3: load PROJECTS_URL with fetch and add an article for each project to #project-list.' },
		{ type: 'console-includes', expected: 'final-project:counter', hint: 'Requirement 4: update #message-count with the characters left on every input event.' },
		{ type: 'console-includes', expected: 'final-project:validation', hint: 'Requirement 5: on submit, show an error for the empty name, set aria-invalid, and focus the first invalid field.' },
		{ type: 'console-includes', expected: 'final-project:modern', hint: 'Requirement 6: use const and let (no var), and === or !== (no == or !=).' },
		{ type: 'console-includes', expected: 'final-project:safe', hint: 'Requirement 6: use textContent instead of innerHTML.' },
		{ type: 'console-includes', expected: 'final-project:clean', hint: 'Requirement 6: fix the uncaught error shown in the console.' }
	]"
	layout="workspace"
>
<template #instructions>

*You built the house in HTML. You decorated it in CSS. Today, you wire up the electricity.*

Before the project, one more look back.

At the start of this track, JavaScript was the language that did "behavior," and your first line was `console.log('Hello from JavaScript!')`. Remember seeing that message appear, and then watching a heading change its own text?

Look at what you know now. You can store and shape data with variables, arrays, and objects, and pack it into JSON. You can make decisions, repeat work, and package steps into functions that remember things through closures. You can find any element on the page, change it, build new ones from data, and remove them. You can listen for clicks, keys, and form submissions, and replace the browser's generic error messages with friendly, accessible ones. You understand why `setTimeout(..., 0)` runs late, what a promise is, and how `await` waits without freezing the page. You can load data from a server, handle the times it fails, and remember a visitor's choices between visits.

And you know the *why*: why `===` beats `==`, why `textContent` beats `innerHTML`, why a real `<button>` beats a clickable `<div>`, and why the server is always the security guard.

There were surely moments where it didn't work. A `null` where an element should have been. A `Promise {...}` where data should have been. A `this` that went missing. You read the clue, found the cause, and fixed it. That's the actual skill.

I'm genuinely proud of you. Let's finish the house.

## The project

In [Final Project: Your Profile Page](/lessons/html/final-project), you built a personal profile page, and in [Final Project: Style Your Profile Page](/lessons/css/final-project), you styled it. Now you'll make it **interactive**.

This workspace starts with a finished version of that page. The HTML and CSS are done, so you can focus entirely on JavaScript. The `script.js` tab contains a few preview-only helpers (explained in its comments) and a labeled spot for each requirement. You're welcome to adjust the HTML and CSS too, but keep the ids the requirements mention, because the checker uses them.

Each requirement says what to build, **why** it matters, and which lesson to review.

## Requirements

### 1. A theme toggle that remembers

Make the `#theme-toggle` button switch the page between light and dark:

- On load, set `data-theme` on the `<html>` element to the saved choice, or, for a first-time visitor, to `'dark'` or `'light'` based on `prefers-color-scheme`.
- On click, flip `data-theme` between `'light'` and `'dark'`, and save the new choice with `saveSetting`.
- Keep the button's `aria-pressed` in sync: `'true'` when dark mode is on.

**Why:** A preference that resets on every visit isn't much of a preference. The CSS already has a dark theme waiting for `data-theme="dark"`, so JavaScript only decides *when*. Review: [Saving Data with localStorage](/lessons/javascript/local-storage) and [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript).

### 2. Interests built from data

Create an array of at least three interests, and build an `<li>` for each one inside `#interests-list`, using `createElement` and `textContent`.

**Why:** Content that lives in data can be sorted, filtered, or loaded from a server later without touching the HTML. Review: [Creating and Removing Elements](/lessons/javascript/creating-elements) and [Arrays](/lessons/javascript/arrays).

### 3. Projects loaded with fetch

Write an `async` function that loads your projects from `PROJECTS_URL` and shows each one as an `<article>` (with an `<h3>` title and a `<p>` description) inside `#project-list`.

- Show a loading message in `#projects-status` while it works.
- Check `response.ok`, and throw an error if it's false.
- If anything fails, show a friendly message in `#projects-status` instead.

**Why:** This is the pattern behind almost every dynamic page on the web: ask, wait, check, show, and plan for failure. Review: [Loading Data with fetch](/lessons/javascript/fetch) and [Promises and async/await](/lessons/javascript/promises-and-async-await).

### 4. A live character counter

As someone types in `#contact-message`, update `#message-count` to say how many characters are left (the textarea's `maxLength` is 200).

**Why:** Helpful feedback while typing, not after, is the difference between a form that guides people and one that scolds them. Review: [Forms and Custom Validation](/lessons/javascript/forms-with-javascript).

### 5. A contact form with friendly validation

Listen for the form's `submit` event and prevent the default. Then check the name and email fields yourself:

- For each field with a problem, put a clear message in its error element (`#name-error`, `#email-error`), and set `aria-invalid="true"` on the field.
- Clear the message and `aria-invalid` for fields that are fine.
- If anything is wrong, move focus to the first field with a problem.
- If everything is right, thank the visitor by name in `#form-status` and reset the form.

**Why:** Specific, visible, accessible messages help everyone finish the form, including people using screen readers and keyboards. Review: [Forms and Custom Validation](/lessons/javascript/forms-with-javascript).

### 6. Clean, safe, modern code

- `const` and `let` only, never `var`.
- `===` and `!==` only, never `==` or `!=`.
- Put text on the page with `textContent`, never `innerHTML`.
- No uncaught errors in the console.
- Keep all of your code in `script.js`. The checker reads that file, so code in a `<script>` added to `index.html` won't count.

**Why:** These are the habits that keep code readable, safe from XSS, and free of the quiet type-juggling bugs. Review: [Best Practices and Common Mistakes](/lessons/javascript/best-practices).

### Stretch goals (optional, for the ambitious)

- Show the number of projects in `#projects-status` once they load ("3 projects").
- Give the form a live email check that clears its error as soon as the address becomes valid.
- Add a "Back to top" button that appears after scrolling, using a `scroll` listener and the `hidden` property.
- Add a small filter: a text box that hides interests that don't match what's typed, using `filter` and `includes`.
- Move your code into modules on your own computer, with a separate file for storage helpers, and serve it with a local server.

## Using this workspace

The tabs on the left switch between these instructions, `index.html`, `style.css`, and `script.js`. The page runs a moment after you stop typing (or when you press **Run**). About a second after it loads, a small checker at the bottom of `index.html` tests each requirement and prints a `final-project:` line in the **Console** tab for every one that passes, and the **Checks** tab turns green as they do. Leave the checker at the bottom of `index.html` where it is. Drag the line between the two sides to give either one more room; on a phone, the **Code** and **Result** buttons in the toolbar switch between them. **Reset** puts the starter code back; press it twice, so a stray click can't wipe your work.

The checker can only see whether each piece *works*. It can't tell whether your error messages are kind, whether your names are clear, or whether your functions are small. That judgment is yours, which is what the self-check is for.

## Self-check

This is a building project, not a test, so there's no score. Answer each question honestly, yes or no, about your own code. Every "no" is just a pointer to your next improvement.

1. If I read my code top to bottom, could I explain what every function does from its name alone?
2. Does every requirement still work when I use only the keyboard: Tab to the toggle, Space to press it, Enter to submit the form?
3. When a field has an error, does the message say what's wrong **and** how to fix it?
4. If the projects fail to load, does the page still make sense, with a friendly message instead of a blank space?
5. Did I put every piece of text on the page with `textContent`, including text that came from data?
6. Did I use `const` everywhere a value never changes, and `let` only where it does?
7. Are there any empty `catch` blocks, or errors I'm quietly ignoring?
8. If I came back to this code in six months, could I change one feature without being afraid of breaking another?
9. When I use my page, does it feel alive, and like *mine*?

If you answered yes to all nine, you've built something you can proudly show a future employer, a client, or your family. If a few came back "no," that's completely normal. Go back and improve them. The second pass is where good developers become great ones.

## Where you go from here

Your page is structured, styled, and now alive. It remembers people, loads fresh content, and guides visitors through a conversation. That's the complete foundation of front-end web development: HTML, CSS, and JavaScript, working together, each doing its own job.

From here, the book branches out. [TypeScript](/lessons/typescript/introduction) adds types that catch mistakes before your code even runs. Frameworks like [React](/lessons/react/introduction) and [Vue](/lessons/vue/introduction) help you build much bigger interfaces without drowning in `querySelector` calls. And [Node.js](/lessons/nodejs/introduction) takes the JavaScript you already know to the server, where you'll finally build the security guard. Whichever way you go, you're going with a solid foundation. Well done.

</template>
</Exercise>
