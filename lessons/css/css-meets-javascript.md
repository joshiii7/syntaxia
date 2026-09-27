---
title: "How CSS and JavaScript Work Together: classList"
description: "See how JavaScript and CSS team up: toggle classes with classList, style state with aria attributes, change CSS variables from JavaScript, and know when to avoid inline styles."
---

# Where CSS Meets JavaScript

*CSS keeps the wardrobe. JavaScript is the stage manager who calls the costume changes.*

All through this track, whenever something needed to *react*, like opening a menu when someone clicks a button or switching to dark mode when someone flips a toggle, I've said "that's where JavaScript comes in." This lesson shows you exactly how the handoff works, so you walk into the JavaScript track already knowing where the two meet.

## The wardrobe and the stage manager

Picture a theater production. Backstage there's a wardrobe department. Every costume for every scene has already been designed, sewn, and hung on a labeled rack: "Act 1, ballroom." "Act 2, rainy street." "Act 3, royal wedding."

During the show, the stage manager doesn't sew anything. They don't pick colors or fabrics. They just call out: "Costume change, Act 2!" And the actors swap into outfits that were designed long before.

That's the professional way CSS and JavaScript work together:

- **CSS is the wardrobe.** It defines every look in advance: what a menu looks like open, what it looks like closed, what dark mode looks like.
- **JavaScript is the stage manager.** It watches what the visitor does, and when something happens, it calls the change, usually by adding or removing a **class**.

JavaScript decides *when*. CSS decides *what it looks like*. Each does the job it's good at.

## Calling the costume change: `classList`

```css
/* CSS: the costumes, designed in advance */
.menu {
	display: none;
}

.menu.is-open {
	display: block;
}
```

```js
// JavaScript: the stage manager
const button = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');

button.addEventListener('click', () => {
	menu.classList.toggle('is-open');
});
```

`classList` is how JavaScript works with an element's classes:

- `classList.add('is-open')` puts the class on.
- `classList.remove('is-open')` takes it off.
- `classList.toggle('is-open')` flips it: on if it's off, off if it's on.
- `classList.contains('is-open')` checks whether it's there.

Notice how little the JavaScript knows about *appearance*. It doesn't know the menu slides in, or what color it is. If a designer later decides the open menu should fade in with a transition from [Transitions and Animations](/lessons/css/transitions-and-animations), they change the CSS, and the JavaScript doesn't need to change at all.

Many teams name these state classes with an `is-` or `has-` prefix (`is-open`, `is-active`, `has-error`) so it's obvious they're switched on and off by JavaScript.

## Even better: style the state that's already there

Remember `aria-expanded` from [Accessibility Basics](/lessons/html/accessibility-basics)? A menu toggle button *should* tell screen readers whether the menu is open. So JavaScript has to update that attribute anyway. Why not let CSS read it directly, with an attribute selector from [Selectors](/lessons/css/selectors)?

```css
.menu {
	display: none;
}

.menu-button[aria-expanded="true"] + .menu {
	display: block;
}
```

```js
button.addEventListener('click', () => {
	const isOpen = button.getAttribute('aria-expanded') === 'true';
	button.setAttribute('aria-expanded', String(!isOpen));
});
```

Now there's only **one** source of truth. The accessible state and the visual state can never get out of sync, because the visual *is* the accessible state. If the screen reader says "expanded," the menu is open. Always. This is one of those small patterns that separates good front-end work from great front-end work.

## Changing a CSS variable from JavaScript

In [CSS Variables](/lessons/css/css-variables), you built a theme from custom properties. JavaScript can change them while the page is running:

```js
document.documentElement.style.setProperty('--color-brand', '#b3261e');
```

`document.documentElement` is the `<html>` element, the same thing `:root` targets. One line, and every button, link, and heading that uses `var(--color-brand)` updates instantly. That's how "pick your accent color" settings on websites work.

A theme switch often combines both techniques: JavaScript sets an attribute, and CSS re-mixes the variables for it:

```css
:root[data-theme="dark"] {
	--color-bg: #111827;
	--color-text: #e5e7eb;
}
```

```js
document.documentElement.dataset.theme = 'dark';
```

`dataset.theme` is how JavaScript reads and writes that `data-theme` attribute. Remember `data-*` from [Attributes Deep Dive](/lessons/html/attributes-deep-dive)? This is the "back of the name badge" in action.

## `element.style`: use it sparingly

```js
box.style.backgroundColor = 'tomato';
```

JavaScript can also set styles directly with `element.style`. Notice the property name changes from `background-color` to `backgroundColor` in JavaScript (hyphens aren't allowed in those names, so the words get joined with a capital letter).

But here's the catch. `element.style` writes an **inline style**, and you know from [Three Ways to Add CSS](/lessons/css/applying-css) what that means: the highest specificity there is, almost impossible for your stylesheet to override. It's the stage manager grabbing a paintbrush and painting on the costume during the show.

So when *is* it the right tool? When the value is truly dynamic and can't be designed in advance: a progress bar at exactly 63%, an element following the mouse pointer, a position calculated from the window size. For everything that can be a predefined "look," toggle a class instead.

## Reading styles and preferences

JavaScript can also *ask* about styles:

```js
// What is this element's actual, final color after the whole cascade?
const color = getComputedStyle(heading).color;

// Does the visitor prefer reduced motion?
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

`getComputedStyle` gives you the final result after every rule, inheritance, and override is resolved: the answer to the cascade question. `matchMedia` lets JavaScript check the same media queries you wrote in [Responsive Design and Media Queries](/lessons/css/responsive-design), so a script can skip a fancy animation for someone who asked for less motion.

## Try it

Click the buttons in the preview. The JavaScript only flips attributes; the CSS decides everything you see.

<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<button class=\'theme-button\' type=\'button\'>Toggle dark mode</button>\n\n<nav>\n\t<button class=\'menu-button\' type=\'button\' aria-expanded=\'false\'>Menu</button>\n\t<ul class=\'menu\'>\n\t\t<li><a href=\'#\'>Breads</a></li>\n\t\t<li><a href=\'#\'>Pastries</a></li>\n\t\t<li><a href=\'#\'>Coffee</a></li>\n\t</ul>\n</nav>\n\n<p>Fresh bread every morning at <strong>Maria\'s Bakery</strong>.</p>'"
	:initial-css="':root {\n\t--color-bg: #ffffff;\n\t--color-text: #222222;\n\t--color-brand: #2f6f8f;\n}\n\n:root[data-theme=\'dark\'] {\n\t--color-bg: #111827;\n\t--color-text: #e5e7eb;\n\t--color-brand: #7cc4e4;\n}\n\nbody {\n\tbackground: var(--color-bg);\n\tcolor: var(--color-text);\n\tfont-family: system-ui, sans-serif;\n\ttransition: background-color 0.3s ease, color 0.3s ease;\n}\n\nbutton {\n\tpadding: 0.5rem 1rem;\n\tborder: 2px solid var(--color-brand);\n\tborder-radius: 8px;\n\tbackground: transparent;\n\tcolor: var(--color-brand);\n\tcursor: pointer;\n}\n\na, strong {\n\tcolor: var(--color-brand);\n}\n\n.menu {\n\tdisplay: none;\n}\n\n.menu-button[aria-expanded=\'true\'] + .menu {\n\tdisplay: block;\n}\n'"
	:initial-js="'const themeButton = document.querySelector(\'.theme-button\');\nthemeButton.addEventListener(\'click\', () => {\n\tconst root = document.documentElement;\n\troot.dataset.theme = root.dataset.theme === \'dark\' ? \'light\' : \'dark\';\n});\n\nconst menuButton = document.querySelector(\'.menu-button\');\nmenuButton.addEventListener(\'click\', () => {\n\tconst isOpen = menuButton.getAttribute(\'aria-expanded\') === \'true\';\n\tmenuButton.setAttribute(\'aria-expanded\', String(!isOpen));\n});\n'"
	preview-height="300px"
/>

## Try it yourself

1. Change the dark theme's `--color-brand` in the CSS pane. The JavaScript doesn't change at all, but the dark mode looks different. That's the separation at work.
2. Make the open menu display its links in a row using `display: flex` and a `gap`, instead of `display: block`.
3. In the JavaScript pane, add one line inside the theme click handler that sets `--color-brand` to `tomato` using `document.documentElement.style.setProperty`. Notice it now overrides *both* themes? That's inline-style specificity at work.

## Check your understanding

<Quiz
	question="What is the usual professional way for JavaScript to change how an element looks?"
	:options="['Write every style with element.style', 'Add, remove, or toggle a class (or attribute) that CSS already styles', 'Rewrite the stylesheet file', 'Use !important in JavaScript']"
	:answer-index="1"
	explanation="JavaScript decides when state changes by toggling a class or attribute. CSS decides what that state looks like."
/>

<Quiz
	question="Which line toggles the class is-open on an element named menu?"
	:options="['menu.class = is-open', 'menu.classList.toggle(is-open)', 'menu.style.is-open = true', 'toggle(menu, is-open)']"
	:answer-index="1"
	explanation="classList.toggle adds the class if it is missing and removes it if it is present."
/>

<Quiz
	question="Why should element.style be used sparingly?"
	:options="['It only works in some browsers', 'It writes inline styles, which have very high specificity and are hard for your stylesheet to override', 'It deletes the class attribute', 'It cannot set colors']"
	:answer-index="1"
	explanation="Inline styles beat almost every stylesheet rule, so they are best saved for truly dynamic values."
/>

## Up next

That's everything. You now have the full CSS toolkit, plus a clear picture of how it plugs into JavaScript. There's one thing left: take the page you built in the HTML track and make it *yours*. Head to [Capstone: Style Your Profile Page](/lessons/css/capstone). After that, the [JavaScript track](/lessons/javascript/intro-to-javascript) is waiting.
