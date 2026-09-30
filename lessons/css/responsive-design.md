---
title: "Responsive Design: Media Queries and Mobile-First CSS"
description: "Make pages that work on every screen. Learn fluid layouts, mobile-first media queries with min-width, choosing breakpoints, clamp() for fluid text, and user preference queries."
---

# Responsive Design and Media Queries

*Your page is about to learn to check the weather and get dressed for it.*

Pull out your phone and visit a few of your favorite websites. Then visit the same sites on a laptop. Same content, but the layout is different, isn't it? The menu collapses into a button, three columns become one, images shrink to fit.

That's **responsive design**: one page, one set of HTML, that adapts to whatever screen it's on. And these days it isn't optional. For most websites, *more than half* of visitors are on a phone. A site that only looks good on a laptop is broken for most of its audience.

## Getting dressed for the weather

Think about how you get dressed in the morning. You check the weather, then decide:

- Hot day? T-shirt.
- Cool morning? Add a light jacket.
- Freezing? Add a coat and scarf on top.

You don't own three completely different bodies for three kinds of weather. You're the same person, putting on different layers. A responsive page works the same way: **same HTML**, different layers of CSS depending on the "weather," which here means the screen size.

The tool that checks the weather is called a **media query**.

## First, the viewport tag

Before any of this works, the page needs one line in its `<head>` that you met back in [Meta Tags and SEO](/lessons/html/meta-and-head-tags):

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Without it, phones pretend to be a desktop screen about 980px wide, shrink your page to fit, and ignore your responsive CSS entirely. With it, the phone reports its real width, and your media queries can respond. If your media queries "don't work on my phone," check this tag first.

## Fluid first

Before you reach for media queries, remember that a lot of responsiveness comes free when you avoid rigid sizes:

```css
img,
video {
	max-width: 100%;
	height: auto;
}

.container {
	max-width: 70rem;
	margin: 0 auto;
	padding: 0 1rem;
}
```

- Images that never grow wider than their container.
- A content column with a *maximum* width, not a fixed one, so it shrinks gracefully on small screens.
- Percentages, `fr` units, and flexbox or grid wrapping, all from earlier lessons, that bend instead of break.

A well-built fluid layout needs surprisingly few media queries. Remember the `auto-fit` card grid from [CSS Grid in Practice](/lessons/css/grid-in-practice)? No media queries at all.

## Media queries: checking the weather

```css
@media (min-width: 48rem) {
	.card-row {
		flex-direction: row;
	}
}
```

Read it as: "**If** the screen is at least 48rem wide, apply these rules." Everything inside the curly braces only kicks in when the condition is true. When the screen is narrower, it's as if those rules don't exist.

## Mobile-first: start with the T-shirt

Here's the approach professionals use, and it's worth getting into the habit right away.

Write your base CSS for the **smallest** screen first: one column, simple, stacked. That's the T-shirt, the outfit that works for everyone. Then use `min-width` media queries to **add layers** as screens get bigger:

```css
/* Base: phones. One column. */
.page {
	display: grid;
	gap: 1rem;
}

/* Tablets and up: add a sidebar. */
@media (min-width: 48rem) {
	.page {
		grid-template-columns: 14rem 1fr;
	}
}

/* Large screens: add more breathing room. */
@media (min-width: 75rem) {
	.page {
		gap: 2rem;
	}
}
```

Why mobile first, instead of designing for desktop and then stripping things away with `max-width` queries?

- **Simpler CSS.** Small screens get the simplest layout, so the base styles stay simple. You only *add* complexity, you rarely have to undo it.
- **Better for phones.** Phones, often on slow connections, get the leanest styles, without first loading the complicated desktop layout and then overriding it.
- **Better thinking.** Starting small forces you to decide what really matters. A phone screen has no room for clutter.

Adding a coat when it's cold is easier than walking around in one all year and taking it off when it's warm.

## Choosing breakpoints

The widths where your layout changes are called **breakpoints**. Beginners often ask, "What are the right breakpoints for iPhone and iPad?"

Here's the honest answer: don't design for specific devices. There are thousands of screen sizes, and new ones every year. Instead, **let your content decide**. Start with a narrow window and slowly drag it wider. The moment the layout starts to look awkward (lines too long, lots of empty space, cards stretched too wide), that's a breakpoint. Add a media query there.

Using `rem` for breakpoints (like `48rem` instead of `768px`) is a nice touch, because if someone has set a larger default text size, the layout switches to the roomier arrangement sooner, exactly when they need it.

## Fluid type with `clamp()`

Headings that look perfect on a laptop are often enormous on a phone. You could fix that with media queries. Or:

```css
h1 {
	font-size: clamp(2rem, 1.5rem + 3vw, 3.5rem);
}
```

`clamp(minimum, preferred, maximum)` sets a value that grows smoothly with the screen but never goes below the minimum or above the maximum. The heading scales with the window width (thanks to that `vw` from [Units](/lessons/css/units)), but it will never be smaller than 2rem or larger than 3.5rem. Like a thermostat with a floor and a ceiling.

## More than width: user preferences

Media queries can check more than screen size. They can check what the *visitor* prefers:

```css
/* The visitor's device is set to dark mode */
@media (prefers-color-scheme: dark) {
	body {
		background: #111827;
		color: #e5e7eb;
	}
}

/* The visitor has asked for less motion. (Transitions and Animations explains
   why this one needs !important.) */
@media (prefers-reduced-motion: reduce) {
	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}

/* The device has a mouse that can hover */
@media (hover: hover) {
	.card:hover {
		transform: translateY(-4px);
	}
}
```

These are small acts of respect. Someone who gets motion sickness from animations has told their device so; honor it. You'll use `prefers-reduced-motion` properly in [Transitions and Animations](/lessons/css/transitions-and-animations), and dark mode becomes much easier with [CSS Variables](/lessons/css/css-variables).

## Container queries, briefly

Media queries check the size of the whole *screen*. But sometimes a component cares about the size of its own *container*. A card might sit in a wide main column on one page and a narrow sidebar on another. **Container queries** let a component respond to its container instead:

```css
.card-wrapper {
	container-type: inline-size;
}

@container (min-width: 30rem) {
	.card {
		display: flex;
	}
}
```

You don't need these yet, but they're well supported now and increasingly common in professional code, so it's good to recognize them.

## Testing

Two ways to test, and you should use both:

1. **Drag your browser window** narrower and wider, and watch the layout respond. Or use your browser's developer tools' device mode, which simulates phone screens.
2. **Use a real phone.** Simulators are good, but nothing beats holding the page in your hand, tapping buttons with your actual thumb.

## Try it

The preview below is only as wide as this page's content column. To see the media query switch, make your whole browser window narrower or wider and watch the preview respond. Or change the `40rem` value until the layout flips.

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'page\'>\n\t<header class=\'masthead\'>\n\t\t<h1>Maria\'s Bakery</h1>\n\t</header>\n\t<main class=\'content\'>\n\t\t<p>Fresh bread every morning. On a narrow screen, everything stacks in one column. On a wide screen, the sidebar moves up beside me.</p>\n\t</main>\n\t<aside class=\'sidebar\'>\n\t\t<p>Open 7am to 5pm.</p>\n\t</aside>\n</div>'"
	:initial-css="'/* Base: small screens first */\nbody {\n\tmargin: 0;\n\tfont-family: system-ui, sans-serif;\n}\n\n.page {\n\tdisplay: grid;\n\tgap: 1rem;\n\tpadding: 1rem;\n}\n\n.masthead { background: #2f6f8f; color: white; padding: 0 1rem; }\n.content { background: #f3f6f8; padding: 1rem; }\n.sidebar { background: #fff3b0; padding: 1rem; }\n\nh1 {\n\tfont-size: clamp(1.5rem, 1rem + 3vw, 3rem);\n}\n\n/* Wider screens: add a layer */\n@media (min-width: 40rem) {\n\t.page {\n\t\tgrid-template-columns: 2fr 1fr;\n\t}\n\n\t.masthead {\n\t\tgrid-column: 1 / -1;\n\t}\n}\n'"
	preview-height="340px"
/>

## Try it yourself

1. Change `40rem` to `20rem`, then to `80rem`, and run it each time. At which value does the preview switch layouts?
2. Add a `prefers-color-scheme: dark` media query that gives the page a dark background. If your device is set to dark mode, you'll see it right away.
3. Change the `clamp()` minimum and maximum values and resize your window to see the heading scale smoothly.

## Check your understanding

<Quiz
	question="In a mobile-first stylesheet, what kind of media query do you mostly write?"
	:options="['max-width queries that remove desktop styles', 'min-width queries that add styles for larger screens', 'print queries', 'No media queries at all']"
	:answer-index="1"
	explanation="Mobile-first means the base styles are for small screens, and min-width queries add layers as the screen grows."
/>

<Quiz
	question="Your media queries work in a desktop browser but a phone shows a tiny zoomed-out page. What is the most likely cause?"
	:options="['Phones do not support CSS', 'The viewport meta tag is missing', 'You used rem instead of px', 'The page has too many images']"
	:answer-index="1"
	explanation="Without the viewport meta tag, phones render the page at a fake desktop width and shrink it down."
/>

<Quiz
	question="What does clamp(2rem, 1.5rem + 3vw, 3.5rem) do for a font size?"
	:options="['Always sets it to 2rem', 'Scales it with the screen, but never below 2rem or above 3.5rem', 'Picks a random size', 'Only works on phones']"
	:answer-index="1"
	explanation="clamp takes a minimum, a preferred value, and a maximum, so the size scales smoothly within limits."
/>

## Up next

Your pages now dress for any weather. Next, we'll make your styles far easier to manage, and set up an entire color theme in a few lines, with [CSS Variables](/lessons/css/css-variables).
