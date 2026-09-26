---
title: "CSS Transitions and @keyframes Animations"
description: "Add smooth motion with CSS transitions and @keyframes animations, choose easing curves, animate transform and opacity for speed, and respect prefers-reduced-motion."
---

# Transitions and Animations

*A light switch snaps. A dimmer fades. Motion on a page should feel like the dimmer.*

Up to now, every style change has been instant. Hover over a button and the color *snaps* to the new one. It works, but it feels a bit mechanical, like flicking a light switch in a dark room: off, then suddenly blinding.

Now think of a dimmer switch. The light glides from dark to bright. Same start, same finish, but it feels calm and intentional. That's what motion in CSS gives you, and used well, it makes an interface feel smooth and thoughtful. Used badly, it makes people dizzy. We'll cover both.

## Transitions: the dimmer switch

```css
.button {
	background: #2f6f8f;
	transition: background-color 0.2s ease;
}

.button:hover {
	background: #245670;
}
```

A **transition** tells the browser: "When this property changes, don't snap. Glide from the old value to the new one."

Notice where it goes: on the **normal state**, not the hover state. That way it animates both ways, fading in when the mouse arrives *and* fading out when it leaves. Put it only on `:hover` and it'll glide in, then snap back out. It's a very common first mistake.

The shorthand has up to four parts:

```css
transition: transform 0.3s ease-out 0.1s;
/*          property  duration  timing  delay */
```

- **Property**: what to animate. `background-color`, `transform`, `opacity`...
- **Duration**: how long. For interface feedback, keep it short: 150ms to 300ms. Longer than that and your page starts to feel sluggish, like waiting for an old elevator.
- **Timing function**: the *feel* of the motion (more on that in a second).
- **Delay**: how long to wait before starting. Usually zero.

You can transition several properties at once, separated by commas:

```css
.card {
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
}
```

You'll see `transition: all 0.3s` a lot in tutorials. It's tempting, but it animates *every* property that changes, including ones you didn't mean to animate, and it can make pages slower. Name the properties you actually want.

## Timing functions: how a car moves

Think about how a car actually moves. It doesn't instantly go 50 km/h, and it doesn't instantly stop. It speeds up gently and slows down gently. Motion that mimics that feels natural.

- `linear`: the same speed the whole way. Robotic. Good for spinners, and not much else.
- `ease` (the default): starts gently, speeds up, slows down at the end. A good all-rounder.
- `ease-out`: starts fast, slows to a stop, like a car braking smoothly. Great for things *entering* the screen.
- `ease-in`: starts slow, speeds up, like pulling away from a stop. Good for things *leaving*.
- `ease-in-out`: gentle at both ends.
- `cubic-bezier(...)`: a custom curve, for when you want something with personality, like a tiny bounce. Your browser's developer tools have a visual editor for these.

## Animate `transform` and `opacity`

Here's a professional secret that makes a big difference. Some properties are cheap for the browser to animate, and some are expensive.

Picture a stage set. Sliding an already-painted backdrop across the stage is quick and easy. Repainting the backdrop in a new position for every single frame is exhausting.

When you animate `width`, `top`, or `margin`, the browser has to recalculate the layout of the page and repaint it, many times a second. On a slow phone, that stutters. When you animate `transform` and `opacity`, the browser can usually just slide or fade the already-painted layer. Silky smooth.

```css
/* Slower: moves the box by changing layout */
.card:hover {
	margin-top: -4px;
}

/* Smoother: slides the painted box */
.card:hover {
	transform: translateY(-4px);
}
```

`transform` has several handy functions:

- `translate(x, y)` moves something without affecting layout.
- `scale(1.05)` makes it 5% bigger.
- `rotate(10deg)` turns it.

And none of them push neighboring elements around, which is exactly what you want for a hover effect.

## Animations: the flipbook

Transitions go from state A to state B when something changes. But what if you want motion that plays by itself, loops, or has several steps? A loading spinner, a gentle pulse on a "new" badge, content fading in as the page loads?

For that, you write **keyframes**. Think of a flipbook: you draw a few key pages (the start, the middle, the end), and flipping through them creates the motion. The browser fills in all the in-between frames for you.

```css
@keyframes fade-up {
	from {
		opacity: 0;
		transform: translateY(12px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.hero {
	animation: fade-up 0.6s ease-out;
}
```

- `@keyframes fade-up` defines the flipbook and gives it a name.
- `from` and `to` are the first and last pages. You can also use percentages for more steps: `0%`, `50%`, `100%`.
- `animation: fade-up 0.6s ease-out` plays it on an element.

More animation settings you'll use:

```css
.spinner {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}

.badge {
	animation: pulse 2s ease-in-out infinite alternate;
}

@keyframes pulse {
	from { transform: scale(1); }
	to { transform: scale(1.08); }
}
```

- `infinite` loops forever (or give a number, like `3`).
- `alternate` plays forward, then backward, then forward, like breathing.
- `animation-delay` waits before starting.
- `animation-fill-mode: both` keeps the first frame's styles *before* the animation starts and the last frame's styles *after* it ends, so things don't flicker at the edges.

## Respect people who don't want motion

This part is not optional. For some people, especially those with vestibular disorders, big motion on screen causes real dizziness, nausea, or headaches. Many of them have turned on a "reduce motion" setting on their device. Honor it:

```css
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
```

You met this media query in [Responsive Design and Media Queries](/lessons/css/responsive-design). This snippet is one of the very rare cases where `!important` is the right tool (remember the fire alarm from [The Cascade and Specificity](/lessons/css/cascade-and-specificity)?), because it genuinely needs to override every animation on the page for this person's health.

## When motion helps, and when it doesn't

Good motion has a job:

- **Feedback**: a button responds to being pressed.
- **Orientation**: a menu slides in from the side where its button is, so you understand where it came from.
- **Attention**: a gentle pulse on something new. *Gentle*, and usually not forever.

Bad motion is decoration that gets in the way: everything bouncing in as you scroll, animations that make you wait before you can read, loops that never stop in the corner of your eye. When in doubt, go smaller and faster. The best interface motion is often barely noticed.

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'hero\'>\n\t<h2>Fresh from the oven</h2>\n\t<span class=\'badge\'>New</span>\n</div>\n\n<div class=\'card\'>Hover over me</div>\n\n<button class=\'button\' type=\'button\'>Add to cart</button>\n\n<div class=\'spinner\' aria-hidden=\'true\'></div>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n\tpadding: 1rem;\n}\n\n@keyframes fade-up {\n\tfrom { opacity: 0; transform: translateY(12px); }\n\tto { opacity: 1; transform: translateY(0); }\n}\n\n.hero {\n\tanimation: fade-up 0.6s ease-out both;\n}\n\n@keyframes pulse {\n\tfrom { transform: scale(1); }\n\tto { transform: scale(1.08); }\n}\n\n.badge {\n\tdisplay: inline-block;\n\tpadding: 2px 10px;\n\tbackground: crimson;\n\tcolor: white;\n\tborder-radius: 999px;\n\tanimation: pulse 1s ease-in-out infinite alternate;\n}\n\n.card {\n\tmax-width: 220px;\n\tmargin: 1rem 0;\n\tpadding: 1.5rem;\n\tbackground: #f3f6f8;\n\tborder-radius: 12px;\n\ttransition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n\n.card:hover {\n\ttransform: translateY(-4px);\n\tbox-shadow: 0 8px 20px rgb(0 0 0 / 0.12);\n}\n\n.button {\n\tpadding: 0.6rem 1.2rem;\n\tborder: none;\n\tborder-radius: 8px;\n\tbackground: #2f6f8f;\n\tcolor: white;\n\t/* Add a transition here, then a :hover color */\n}\n\n@keyframes spin {\n\tto { transform: rotate(360deg); }\n}\n\n.spinner {\n\twidth: 32px;\n\theight: 32px;\n\tmargin-top: 1rem;\n\tborder: 4px solid #d8e7ef;\n\tborder-top-color: #2f6f8f;\n\tborder-radius: 50%;\n\tanimation: spin 1s linear infinite;\n}\n\n@media (prefers-reduced-motion: reduce) {\n\t*, *::before, *::after {\n\t\tanimation-duration: 0.01ms !important;\n\t\tanimation-iteration-count: 1 !important;\n\t\ttransition-duration: 0.01ms !important;\n\t}\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Give `.button` a `transition` on `background-color` and a darker `:hover` background. Then move the transition onto `:hover` only and notice how it snaps back out.
2. Change the card's timing from `ease` to `linear`, then to `cubic-bezier(0.34, 1.56, 0.64, 1)` for a playful little overshoot.
3. Change the badge's pulse so it only plays 3 times instead of forever. Which feels less distracting?

## Check your understanding

<Quiz
	question="Where should you usually put the transition property so the effect animates both in and out?"
	:options="['Only on the :hover rule', 'On the element normal state', 'Inside @keyframes', 'On the body only']"
	:answer-index="1"
	explanation="A transition on the normal state applies whenever the property changes, in both directions."
/>

<Quiz
	question="Which two properties are usually cheapest and smoothest to animate?"
	:options="['width and height', 'margin and padding', 'transform and opacity', 'top and left']"
	:answer-index="2"
	explanation="transform and opacity can usually be animated without recalculating the page layout."
/>

<Quiz
	question="Fill in the blank: @media (prefers-reduced-motion: ___) lets you tone down motion for people who asked for less."
	:options="['none', 'reduce', 'off', 'minimal']"
	:answer-index="1"
	explanation="prefers-reduced-motion: reduce matches when the visitor has turned on a reduce motion setting."
/>

## Up next

You now know every major piece of CSS. Seriously, look back at that list. Next, we'll put the pieces together into the layout patterns you'll use again and again: centering, sticky headers and footers, and card layouts, in [Common Layout Patterns](/lessons/css/layout-patterns).
