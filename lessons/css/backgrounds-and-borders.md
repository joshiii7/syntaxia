---
title: "CSS Backgrounds, Gradients, Borders, and Shadows"
description: "Add depth and polish with background images, linear and radial gradients, border styles, border-radius for rounded corners, and box-shadow for realistic shadows."
---

# Backgrounds, Borders, and Shadows

*Wallpaper, picture frames, and a lamp in the corner. Small touches that make a flat page feel real.*

So far your boxes are flat, sharp-cornered rectangles with solid colors. That's clean, but it can feel a little like a spreadsheet. This lesson is about the finishing touches: wallpaper behind the content, softer corners, and shadows that make things feel like they're sitting on the page instead of painted onto it.

It's also one of the most *fun* lessons in the track. You'll see big visual changes from tiny amounts of code.

## Backgrounds: the wallpaper

```css
.hero {
	background-color: #d8e7ef;
}
```

You've used `background` colors already. But a background can also be an image, and that's where people get into trouble, so let's get the rule straight first.

### Decoration only

```css
.hero {
	background-image: url("images/flour-texture.webp");
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}
```

A background image is **wallpaper**. It's decoration. Screen readers can't see it, there's no `alt` text, and search engines don't treat it as content.

So here's the rule: if an image *means something*, like a photo of your team, a product, or a chart, it belongs in HTML as an `<img>` with proper alt text, exactly as you learned in [Images](/lessons/html/images). Background images are only for things that are purely visual: textures, patterns, decorative shapes. When in doubt, ask: "If this image disappeared, would someone miss information?" If yes, it's content, not wallpaper.

### Fitting the wallpaper

- `background-size: cover` scales the image to fill the whole box, cropping the edges if needed. Like wallpaper that covers the entire wall, even if a bit of the pattern gets trimmed at the corners.
- `background-size: contain` scales it to fit entirely inside, possibly leaving gaps.
- `background-position: center` decides which part stays visible when cropping.
- `background-repeat: no-repeat` stops the image from tiling. (Tiling is great for small repeating patterns, though.)

## Gradients: color that blends

A gradient is a background image made entirely by CSS. No file needed:

```css
/* Top to bottom, light blue to white */
.banner {
	background: linear-gradient(#d8e7ef, #ffffff);
}

/* At an angle, with three colors */
.sunset {
	background: linear-gradient(135deg, #f28c28, #e0457b, #6a4c93);
}

/* A soft glow from the center outward */
.spotlight {
	background: radial-gradient(circle, #fff3b0, #f28c28);
}

/* Around a center point, like a color wheel */
.wheel {
	background: conic-gradient(red, yellow, lime, aqua, blue, magenta, red);
	border-radius: 50%;
}
```

Think of a sunset: the sky fades smoothly from orange near the horizon to deep purple overhead. `linear-gradient` fades along a straight line (you pick the angle), `radial-gradient` spreads out from a center point like a light bulb's glow, and `conic-gradient` sweeps around a center like the hands of a clock.

Keep text on gradients readable. The contrast rules from [Colors](/lessons/css/colors) apply to *every* part of the gradient the text sits on, including the lightest bit.

## Borders: the frame

You met borders in [The Box Model](/lessons/css/box-model). The shorthand takes a width, a style, and a color:

```css
.card {
	border: 2px solid #2f6f8f;
}

.note {
	border-left: 6px solid #f28c28;   /* just one side */
}

.coupon {
	border: 2px dashed #6a4c93;       /* also: dotted, double */
}
```

A single thick border on one side, like that `.note`, is a lovely way to make a callout box stand out without a heavy full frame.

## `border-radius`: sanding the corners

```css
.card {
	border-radius: 12px;       /* gently rounded */
}

.pill-button {
	border-radius: 999px;      /* fully rounded ends */
}

.avatar {
	width: 120px;
	height: 120px;
	border-radius: 50%;        /* a perfect circle */
}
```

Think of sanding the sharp corners off a wooden box. A little sanding (8 to 12px) makes things feel friendlier and more modern. A huge value on a wide button gives you a pill shape. And 50% on a square turns it into a circle, which is how nearly every round profile picture on the web is made.

## `box-shadow`: a lamp in the corner

```css
.card {
	box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
}
```

Shadows are where flat design gets depth. Four numbers and a color:

1. **Horizontal offset** (`0`): positive moves the shadow right.
2. **Vertical offset** (`4px`): positive moves it down.
3. **Blur** (`12px`): how soft the edge is.
4. *(optional)* **Spread**: grows or shrinks the shadow.
5. **Color**: almost always a transparent black, using the alpha you learned in [Colors](/lessons/css/colors).

Think about where the light is. In real life, light usually comes from above, so shadows fall *below* objects. That's why most good UI shadows have a positive vertical offset and zero horizontal offset. And keep the light source consistent! If one card's shadow falls down and another's falls to the left, the page feels subtly wrong, as if there were two suns.

The most common beginner mistake is a shadow that's too dark and too sharp: `box-shadow: 5px 5px 0 black`. Real shadows are soft and faint. Low opacity, generous blur.

You can stack several shadows for extra realism, separated by commas:

```css
.card {
	box-shadow:
		0 1px 2px rgb(0 0 0 / 0.08),
		0 8px 24px rgb(0 0 0 / 0.12);
}
```

And text can have a shadow too: `text-shadow: 0 1px 2px rgb(0 0 0 / 0.4);` helps white text stay readable on a busy background.

## Outline: the chalk line

```css
button:focus-visible {
	outline: 3px solid #f28c28;
	outline-offset: 2px;
}
```

An `outline` looks like a border, but it doesn't take up any space in the box model. It's like drawing a chalk line around the frame on the wall, rather than making the frame thicker. Nothing moves. That makes it perfect for focus indicators, which you'll build in [Hover, Focus, and Interactive States](/lessons/css/interactive-states).

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'banner\'>\n\t<h2>Weekend Specials</h2>\n</div>\n\n<div class=\'card\'>\n\t<div class=\'avatar\'></div>\n\t<h3>Maria Santos</h3>\n\t<p>Head baker</p>\n\t<a class=\'pill-button\' href=\'#\'>Say hello</a>\n</div>\n\n<p class=\'note\'>Tip: order before Friday noon for Saturday pickup.</p>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n\tpadding: 16px;\n}\n\n.banner {\n\tpadding: 24px;\n\tcolor: white;\n\tbackground: linear-gradient(135deg, #f28c28, #e0457b, #6a4c93);\n}\n\n.card {\n\tmax-width: 260px;\n\tmargin: 24px 0;\n\tpadding: 20px;\n\ttext-align: center;\n\tborder: 1px solid #dddddd;\n\t/* Add border-radius and box-shadow here */\n}\n\n.avatar {\n\twidth: 96px;\n\theight: 96px;\n\tmargin: 0 auto;\n\tbackground: radial-gradient(circle, #d8e7ef, #2f6f8f);\n}\n\n.pill-button {\n\tdisplay: inline-block;\n\tpadding: 8px 20px;\n\tcolor: white;\n\tbackground: #2f6f8f;\n\ttext-decoration: none;\n}\n\n.note {\n\tpadding: 12px;\n\tbackground: #fff8e6;\n\tborder-left: 6px solid #f28c28;\n}\n'"
	preview-height="460px"
/>

## Try it yourself

1. Give `.card` a `border-radius: 12px` and a soft `box-shadow`. Try removing its border afterward; a good shadow often makes the border unnecessary.
2. Turn `.avatar` into a circle.
3. Make `.pill-button` a true pill.
4. Change the banner's gradient angle from `135deg` to `90deg`, then try a `radial-gradient` instead.

## Check your understanding

<Quiz
	question="A photo of your bakery team should be added with..."
	:options="['background-image, so it can be resized with CSS', 'An img element with meaningful alt text', 'A linear-gradient', 'box-shadow']"
	:answer-index="1"
	explanation="Images that carry meaning are content, so they belong in HTML with alt text. Background images are for decoration only."
/>

<Quiz
	question="Which border-radius turns a square element into a circle?"
	:options="['4px', '50%', '100px', '1em']"
	:answer-index="1"
	explanation="border-radius: 50% on an element with equal width and height makes a perfect circle."
/>

<Quiz
	question="What is the main difference between outline and border?"
	:options="['outline can only be red', 'outline does not take up space in the box model', 'border cannot be dashed', 'outline only works on images']"
	:answer-index="1"
	explanation="An outline is drawn outside the box without affecting layout, like a chalk line, which is why it is ideal for focus indicators."
/>

## Up next

Your boxes look great individually. Now it's time for the big question: how do boxes sit *next to* each other? That starts with [Display](/lessons/css/display), where we learn why some elements stack like shelves and others flow like words.
