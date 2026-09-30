---
title: "CSS Variables (Custom Properties) and Theming"
description: "Store colors, spacing, and fonts in CSS custom properties, reuse them with var(), override them for a section, and build a dark mode theme by changing just a few values."
---

# CSS Variables

*Mix the paint once, label the tin, and use it everywhere. When you want a new color, you repaint one tin.*

By now your stylesheets are getting longer, and you might have noticed something. That brand blue, `#2f6f8f`? You've typed it in the header, the buttons, the links, the borders, the headings. If your boss (or you, in six months) decides the brand should be a slightly warmer blue, you're going to be hunting through the whole file, changing it in eleven places, and missing the twelfth.

We solved this kind of problem once already, back in [What CSS Is and Why It Exists](/lessons/css/intro-to-css): write it in one place, use it everywhere. CSS variables bring that same idea *inside* your stylesheet.

## Labeled paint tins

Picture a painter's workshop. Instead of mixing the exact brand blue from scratch every time they need it, they mix a big tin once and stick a label on it: "BRAND BLUE." Every job just says "use the brand blue tin." If the client changes their mind, the painter re-mixes that one tin, and every future job uses the new color.

```css
:root {
	--color-brand: #2f6f8f;
	--color-accent: #f28c28;
	--color-text: #222222;
	--space-md: 1rem;
	--radius: 12px;
	--font-body: system-ui, sans-serif;
}
```

That's you mixing and labeling the tins. A few things to notice:

- A custom property's name **must start with two hyphens**: `--color-brand`.
- `:root` is a selector for the very top of the page, the `<html>` element. Declaring your variables there makes them available everywhere, because custom properties are **inherited** by every element below, like the text properties you met in [The Cascade and Specificity](/lessons/css/cascade-and-specificity).
- The names are up to you. Name them by *purpose* (`--color-brand`, `--color-danger`) rather than by appearance (`--blue`). If the brand ever turns green, `--blue: green` would be very confusing.

## Using the tins: `var()`

```css
.button {
	background: var(--color-brand);
	color: white;
	padding: var(--space-md);
	border-radius: var(--radius);
}

a {
	color: var(--color-brand);
}

body {
	font-family: var(--font-body);
	color: var(--color-text);
}
```

`var(--color-brand)` means "go get whatever is in the brand tin." Now change `--color-brand` once in `:root`, and every button, link, and heading that uses it updates together.

You can also give `var()` a backup, in case the variable doesn't exist:

```css
color: var(--color-link, #2f6f8f);
```

## Tins can be overridden in one room

Here's where CSS variables get really clever. Because they follow the cascade and inheritance, you can redefine a variable for **just one part of the page**:

```css
:root {
	--color-brand: #2f6f8f;
}

.holiday-banner {
	--color-brand: #b3261e;   /* in this room, "brand" means red */
}
```

Everything inside `.holiday-banner` that uses `var(--color-brand)` is now red. Everything outside is still blue. You didn't write a single new rule for the buttons or links inside the banner. They just picked up the local tin.

Think of it as one room in the house getting its own paint palette. Same instructions ("use the brand color"), different result depending on which room you're in.

## Dark mode in a few lines

This is the moment variables really pay off. Remember `prefers-color-scheme` from [Responsive Design and Media Queries](/lessons/css/responsive-design)?

```css
:root {
	--color-bg: #ffffff;
	--color-text: #222222;
	--color-surface: #f3f6f8;
	--color-brand: #2f6f8f;
}

@media (prefers-color-scheme: dark) {
	:root {
		--color-bg: #111827;
		--color-text: #e5e7eb;
		--color-surface: #1f2937;
		--color-brand: #7cc4e4;
	}
}

body {
	background: var(--color-bg);
	color: var(--color-text);
}

.card {
	background: var(--color-surface);
}
```

Every rule in your stylesheet uses the variables. The dark mode block doesn't restyle a single component. It just re-mixes the tins. Your whole site switches themes, and every future component you build supports dark mode automatically, as long as it uses the variables.

Notice the brand blue got *lighter* in dark mode. A dark blue that's readable on white becomes nearly invisible on a dark background. The contrast rules from [Colors](/lessons/css/colors) still apply in every theme.

## A design system in miniature

Many professional teams keep a set of variables like this at the very top of their stylesheet, often called **design tokens**:

```css
:root {
	/* Colors */
	--color-brand: hsl(200 50% 37%);
	--color-brand-light: hsl(200 50% 90%);

	/* Spacing scale */
	--space-xs: 0.25rem;
	--space-sm: 0.5rem;
	--space-md: 1rem;
	--space-lg: 2rem;

	/* Type */
	--font-heading: Georgia, serif;
	--font-body: system-ui, sans-serif;
}
```

A small, consistent **spacing scale** is one of the quiet secrets of good-looking pages. When every gap on the page comes from the same handful of sizes, things feel aligned and intentional, even if visitors can't say why. Random values like 13px here and 17px there feel slightly "off."

## "Aren't these like Sass variables?"

If you've heard of Sass (it has its own track in this book), you may know it also has variables, written like `$brand`. The big difference: Sass variables disappear when your code is compiled, so the browser never sees them. CSS variables are *live* in the browser. They follow the cascade, change inside media queries, can be overridden per section, and can even be changed by JavaScript while the page is running. You'll do exactly that in [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript).

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'card\'>\n\t<h2>Weekday Specials</h2>\n\t<p>Our regular colors, straight from the tins in :root.</p>\n\t<a class=\'button\' href=\'#\'>See the menu</a>\n</div>\n\n<div class=\'card holiday-banner\'>\n\t<h2>Holiday Specials</h2>\n\t<p>Same rules, but this room has its own brand color.</p>\n\t<a class=\'button\' href=\'#\'>See the menu</a>\n</div>'"
	:initial-css="':root {\n\t--color-brand: #2f6f8f;\n\t--color-surface: #f3f6f8;\n\t--color-text: #222222;\n\t--space-md: 1rem;\n\t--radius: 12px;\n}\n\n.holiday-banner {\n\t--color-brand: #b3261e;\n}\n\nbody {\n\tfont-family: system-ui, sans-serif;\n\tcolor: var(--color-text);\n}\n\n.card {\n\tmargin-bottom: var(--space-md);\n\tpadding: var(--space-md);\n\tbackground: var(--color-surface);\n\tborder-left: 6px solid var(--color-brand);\n\tborder-radius: var(--radius);\n}\n\n.card h2 {\n\tcolor: var(--color-brand);\n}\n\n.button {\n\tdisplay: inline-block;\n\tpadding: 0.5rem var(--space-md);\n\tbackground: var(--color-brand);\n\tcolor: white;\n\ttext-decoration: none;\n\tborder-radius: var(--radius);\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Change `--color-brand` in `:root` to any color you like. Watch the heading, border, and button of the first card all change together.
2. Change `--radius` to `0`, then `24px`. One edit, every rounded corner.
3. Add a `@media (prefers-color-scheme: dark)` block that re-mixes `--color-surface` and `--color-text` for a dark theme.

## Check your understanding

<Quiz
	question="Which is a valid CSS custom property name?"
	:options="['$brand', '--color-brand', '@brand', 'var-brand']"
	:answer-index="1"
	explanation="Custom property names must start with two hyphens. $brand is Sass syntax."
/>

<Quiz
	question="How do you use a custom property's value in a declaration?"
	:options="['color: --color-brand;', 'color: var(--color-brand);', 'color: $color-brand;', 'color: get(--color-brand);']"
	:answer-index="1"
	explanation="The var() function reads a custom property's value."
/>

<Quiz
	question="Why is redefining variables inside a prefers-color-scheme media query a good way to build dark mode?"
	:options="['It is the only way CSS allows dark colors', 'Every rule already uses the variables, so changing the values restyles the whole site at once', 'It makes the page load faster', 'Media queries cannot contain regular rules']"
	:answer-index="1"
	explanation="Components read from the variables, so re-mixing the values switches the whole theme without touching each component."
/>

## Up next

Your styles are organized. Now let's make them respond to people: hovering, clicking, tabbing, and typing. That's [Hover, Focus, and Interactive States](/lessons/css/interactive-states).
