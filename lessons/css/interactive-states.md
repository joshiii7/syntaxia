---
title: "CSS Interactive States: :hover, :focus, :active"
description: "Give visitors feedback with :hover, :focus, :focus-visible, :active, :checked, and :disabled, build accessible focus styles, and add polish with ::before and ::after."
---

# Hover, Focus, and Interactive States

*A good button lights up when you press it, like an elevator button. Feedback is how people know the page heard them.*

Think about pressing an elevator button. It lights up. Such a tiny thing, but imagine if it didn't. You'd press it again. And again. You'd wonder if it was broken. That little glow is the elevator saying "got it, I heard you."

Web pages need that same feedback. When someone hovers over a link, tabs to a button, or clicks a checkbox, the page should respond visibly. It makes your page feel alive and trustworthy, and for some people, it's the only way they can use it at all.

You met pseudo-classes in [Pseudo-classes and Pseudo-elements](/lessons/css/pseudo-classes-and-pseudo-elements). Now we'll use the ones that react to people.

## `:hover`: the mouse is over it

```css
.button {
	background: #2f6f8f;
}

.button:hover {
	background: #245670;
}
```

`:hover` applies while the mouse pointer rests on an element. It's the "you're looking at me" signal: slightly darker buttons, underlines appearing on links, cards lifting a little.

One important catch: **phones and tablets don't have hover.** There's no mouse hovering over anything, just a finger that taps. So never hide essential information or controls behind hover alone. A menu that only appears on hover is a menu that half your visitors can't open. Hover should be a nice extra, never the only way in.

## `:focus` and `:focus-visible`: the keyboard's cursor

```css
.button:focus-visible {
	outline: 3px solid #f28c28;
	outline-offset: 2px;
}
```

In [Accessibility Basics](/lessons/html/accessibility-basics), you learned that keyboard users press Tab to move from link to button to input, and the **focus ring** shows where they are. It's their mouse pointer.

Here's the most important rule in this lesson, and one of the most commonly broken rules on the web:

**Never remove the focus outline without replacing it with something just as visible.**

You'll find this in countless stylesheets:

```css
/* Please, never do this */
*:focus {
	outline: none;
}
```

Someone thought the focus ring looked ugly, so they deleted it. And every keyboard user on that site just lost their cursor. Imagine trying to use a computer where the mouse pointer is invisible.

The good news: `:focus-visible` solves the "it looks ugly" complaint properly. It applies focus styles only when the browser thinks the visitor *needs* to see them, like when they're using a keyboard, and not after a mouse click. So you can design a beautiful, obvious focus style for keyboard users without it flashing every time someone clicks a button with their mouse.

`outline` is the ideal property for this, since (as you learned in [Backgrounds, Borders, and Shadows](/lessons/css/backgrounds-and-borders)) it doesn't take up space, so nothing on the page shifts when focus arrives.

## `:active`: being pressed

```css
.button:active {
	transform: translateY(1px);
}
```

`:active` applies during the moment the button is being pressed, mouse button down or finger on the screen. A tiny downward nudge makes a button feel physically pushed. It's the elevator button clicking in.

## `:focus-within`: something inside is focused

```css
.search-box:focus-within {
	box-shadow: 0 0 0 3px #d8e7ef;
}
```

This one styles a *parent* when anything inside it has focus. Tab into the search input and the whole search box glows, not just the input. Lovely for forms.

## Form states

Remember the forms from the HTML track? They come with their own states:

```css
input:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

input:checked + label {
	font-weight: bold;
}

input:user-invalid {
	border-color: #b3261e;
}
```

- `:disabled` for controls that can't be used right now.
- `:checked` for ticked checkboxes and selected radio buttons. Combined with the `+` sibling combinator from [Selectors](/lessons/css/selectors), you can style the label right after a checked box.
- `:user-invalid` for fields that break their validation rules, but only after the person has actually interacted with them. (The older `:invalid` fires immediately, so a brand new empty form shows angry red borders everywhere before anyone has typed a thing. Not a warm welcome.) This builds right on [Form Validation](/lessons/html/form-validation).

## Link states and their order

Links have a few states of their own:

```css
a:link { color: #2f6f8f; }         /* not yet visited */
a:visited { color: #6a4c93; }      /* already visited */
a:hover { text-decoration-thickness: 3px; }
a:active { color: #f28c28; }
```

Because these can all apply at once and have equal specificity, **order matters** (remember: the later rule wins a tie). The traditional memory aid is "**L**o**V**e **HA**te": link, visited, hover, active. Put them in the wrong order and your hover style might never show on visited links.

## `::before` and `::after` for polish

Pseudo-elements and states combine beautifully. Here's the classic "underline that grows" link effect:

```css
.fancy-link {
	position: relative;
	text-decoration: none;
}

.fancy-link::after {
	content: "";
	position: absolute;
	left: 0;
	bottom: -2px;
	width: 100%;
	height: 2px;
	background: currentColor;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.25s ease;
}

.fancy-link:hover::after,
.fancy-link:focus-visible::after {
	transform: scaleX(1);
}
```

The `::after` is an empty bar pinned under the link (positioned with the absolute-inside-relative trick from [Positioning and z-index](/lessons/css/positioning)), squashed to zero width. On hover or focus, it stretches to full width. That smooth slide comes from `transition`, which is exactly what the next lesson is about. Notice we added the effect to `:focus-visible` as well as `:hover`, so keyboard users get the same delight.

## Cursors

```css
.button {
	cursor: pointer;
}
```

The `cursor` property changes the mouse pointer: `pointer` (the little hand), `not-allowed`, `grab`, `text`, and more. Links get the hand automatically. Buttons don't, in most browsers, and adding it is a common, friendly touch.

## Try it

Try hovering with your mouse, and also clicking inside the preview and pressing **Tab** to move between controls.

<WebPlayground
	:panes="['css']"
	:initial-html="'<p><a class=\'fancy-link\' href=\'#\'>Hover or tab to me</a></p>\n\n<button class=\'button\' type=\'button\'>Add to cart</button>\n<button class=\'button\' type=\'button\' disabled>Sold out</button>\n\n<div class=\'search-box\'>\n\t<label for=\'search\'>Search the menu</label>\n\t<input id=\'search\' type=\'search\'>\n</div>\n\n<p>\n\t<input type=\'checkbox\' id=\'extra-shot\'>\n\t<label for=\'extra-shot\'>Extra shot</label>\n</p>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n}\n\n.fancy-link {\n\tposition: relative;\n\tcolor: #2f6f8f;\n\ttext-decoration: none;\n}\n\n.fancy-link::after {\n\tcontent: \'\';\n\tposition: absolute;\n\tleft: 0;\n\tbottom: -2px;\n\twidth: 100%;\n\theight: 2px;\n\tbackground: currentColor;\n\ttransform: scaleX(0);\n\ttransform-origin: left;\n\ttransition: transform 0.25s ease;\n}\n\n.fancy-link:hover::after,\n.fancy-link:focus-visible::after {\n\ttransform: scaleX(1);\n}\n\n.button {\n\tpadding: 0.6rem 1.2rem;\n\tborder: none;\n\tborder-radius: 8px;\n\tbackground: #2f6f8f;\n\tcolor: white;\n\tcursor: pointer;\n}\n\n.button:hover { background: #245670; }\n.button:active { transform: translateY(1px); }\n\n.button:focus-visible {\n\toutline: 3px solid #f28c28;\n\toutline-offset: 2px;\n}\n\n.button:disabled {\n\topacity: 0.5;\n\tcursor: not-allowed;\n}\n\n.search-box {\n\tmargin: 1rem 0;\n\tpadding: 0.75rem;\n\tborder: 1px solid #cccccc;\n\tborder-radius: 8px;\n}\n\n.search-box:focus-within {\n\tborder-color: #2f6f8f;\n\tbox-shadow: 0 0 0 3px #d8e7ef;\n}\n\ninput:checked + label {\n\tfont-weight: bold;\n\tcolor: #2f6f8f;\n}\n'"
	preview-height="300px"
/>

## Try it yourself

1. Press Tab through the preview. Can you always see where you are? Now add `outline: none;` to `.button:focus-visible` and tab again. Feel how lost you get? Then put the outline back.
2. Give the first button a hover effect that lifts it with `transform: translateY(-2px);` and adds a soft `box-shadow`.
3. Tick the checkbox and watch its label react. Then make the checked label show a checkmark using `input:checked + label::before { content: "✓ "; }`.

## Check your understanding

<Quiz
	question="What should you do if you do not like the default focus outline?"
	:options="['Remove it with outline: none', 'Replace it with a clearly visible custom focus style, for example using :focus-visible', 'Hide focus with display: none', 'Only style :hover instead']"
	:answer-index="1"
	explanation="Keyboard users rely on the focus indicator. You may restyle it, but never remove it without an equally visible replacement."
/>

<Quiz
	question="Why should important content never be available only on :hover?"
	:options="['Hover is slow', 'Touch screens have no hover, so those visitors could never reach it', 'Hover only works on links', 'Search engines block hover']"
	:answer-index="1"
	explanation="Phones and tablets have no mouse pointer to hover with, so hover should only ever add extra polish."
/>

<Quiz
	question="Which pseudo-class styles a parent when any element inside it has focus?"
	:options="[':focus', ':focus-within', ':active', ':has-focus']"
	:answer-index="1"
	explanation=":focus-within matches an element when it or anything inside it is focused."
/>

## Up next

That growing underline slid in smoothly instead of snapping. That was a transition, and next you'll learn how to make them, plus full animations with keyframes, in [Transitions and Animations](/lessons/css/transitions-and-animations).
