---
title: "CSS Colors: Hex, RGB, HSL, and Transparency"
description: "Understand CSS color formats (named colors, hex, rgb, and hsl), add transparency with alpha, use currentColor, and choose text colors with enough contrast to read."
---

# Colors

*Screens don't mix paint. They mix light. Once that clicks, every color format makes sense.*

You've already been sprinkling colors around: `crimson`, `seagreen`, `#2f6f8f`. Some of those look like words and some look like secret codes. Let's decode them, because once you understand how a screen *makes* color, you'll be able to read and tweak any of them.

## Named colors

```css
h1 {
	color: tomato;
}
```

CSS knows about 140 color names, from `black` and `white` to `rebeccapurple`, `papayawhip`, and `lightgoldenrodyellow`. They're fun and handy for experimenting. But real designs need exact shades, like the specific blue in a company's logo, and "tomato" isn't going to cut it. For that, we need numbers.

## RGB: three flashlights

Picture a dark room with three flashlights: one red, one green, one blue. Point them all at the same spot on the wall.

- All three at full power? **White.**
- All three off? **Black.**
- Red and green at full, blue off? **Yellow.** (Surprising, right? This is light, not paint.)

That's literally how your screen works. Every pixel is a tiny cluster of red, green, and blue lights, and each one can be set from 0 (off) to 255 (full blast).

```css
.brand {
	color: rgb(47 111 143);   /* a bit of red, more green, a lot of blue */
}
```

## Hex: the same thing, written shorter

```css
.brand {
	color: #2f6f8f;
}
```

Hex codes are RGB in disguise. After the `#` come three pairs of characters: `2f` for red, `6f` for green, `8f` for blue. Each pair is a number from `00` to `ff` written in hexadecimal, a counting system that uses 0 to 9 and then a to f. You don't need to do hex math in your head. Just know that `00` means "flashlight off" and `ff` means "full blast":

- `#000000` is black. `#ffffff` is white.
- `#ff0000` is pure red.
- A three-character version like `#fff` is shorthand for `#ffffff`.

Hex is what you'll see most in the wild, because it's what design tools hand you when you pick a color.

## HSL: describing a paint chip

RGB and hex are great for computers, but try this: take `#2f6f8f` and make it "a bit lighter." Which of the three pairs do you change? It's genuinely hard to tell.

That's where **HSL** shines. It describes color the way a person at a paint store would:

```css
.brand {
	color: hsl(200 50% 37%);
}
```

- **Hue** (`200`): *which* color, as a position on a color wheel, from 0 to 360. Red is at 0, green around 120, blue around 240.
- **Saturation** (`50%`): how vivid. 0% is gray; 100% is as intense as it gets.
- **Lightness** (`37%`): how light. 0% is black, 100% is white, 50% is the "pure" color.

Now "a bit lighter" is easy: bump the lightness from 37% to 55%. Want a whole family of matching shades for buttons, backgrounds, and borders? Keep the hue and saturation, and just slide the lightness. That's why designers love HSL for building color systems, which you'll do in [CSS Variables](/lessons/css/css-variables).

(You might also run into `oklch()`, a newer format that does the same kind of job with more even-looking lightness steps. It's worth exploring once you're comfortable with HSL.)

## Transparency: tinted glass

Every format can take a fourth value, **alpha**, for how see-through the color is, from 0 (invisible) to 1 (solid):

```css
.overlay {
	background: rgb(0 0 0 / 0.5);     /* black at 50% */
}

.highlight {
	background: hsl(50 100% 70% / 0.4);
}

.tint {
	background: #2f6f8f80;             /* hex with an alpha pair on the end */
}
```

Think of it as tinted glass. Whatever sits behind shows through.

There's also an `opacity` property, and people mix them up. The difference: `opacity: 0.5` fades the **entire element**, text, border, children and all, like dimming a whole window. An alpha color only affects that one color, like tinting just the glass while the window frame stays solid. For a see-through background behind readable text, you almost always want alpha, not opacity.

## `currentColor`: match the text

```css
.button {
	color: #2f6f8f;
	border: 2px solid currentColor;
}
```

`currentColor` means "whatever this element's text color is." Change the button's `color` and the border follows along. One less thing to keep in sync.

## Can people actually read it?

Here's the part that separates a pretty page from a good one. Light gray text on a white background might look sleek on your bright monitor. On a phone in sunlight, or for someone with low vision, it's invisible.

The measure for this is **contrast ratio**. The widely used accessibility guideline (WCAG) asks for at least **4.5 to 1** for normal body text, and 3 to 1 for large headings. You don't calculate it by hand. Your browser's developer tools show the contrast ratio when you inspect text color, and free online contrast checkers do too.

And remember the rule from [Accessibility Basics](/lessons/html/accessibility-basics): color should never be the *only* way you communicate something. A red border on an invalid field is fine, as long as there's also a text message saying what's wrong.

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'swatch named\'>Named: tomato</div>\n<div class=\'swatch hex\'>Hex: #2f6f8f</div>\n<div class=\'swatch hsl\'>HSL: hsl(200 50% 37%)</div>\n<div class=\'photo\'>\n\t<div class=\'glass\'>Tinted glass with alpha</div>\n</div>\n<p class=\'low-contrast\'>Can you read me comfortably?</p>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n}\n\n.swatch {\n\tpadding: 12px;\n\tmargin-bottom: 8px;\n\tcolor: white;\n}\n\n.named { background: tomato; }\n.hex { background: #2f6f8f; }\n.hsl { background: hsl(200 50% 37%); }\n\n.photo {\n\tpadding: 24px;\n\tbackground: linear-gradient(90deg, orange, purple);\n}\n\n.glass {\n\tpadding: 12px;\n\tbackground: rgb(255 255 255 / 0.6);\n}\n\n.low-contrast {\n\tcolor: #cccccc;\n}\n'"
	preview-height="330px"
/>

## Try it yourself

1. In the `.hsl` rule, change only the lightness: try `25%`, then `60%`. Same color family, different shades.
2. Change the hue (the first number) to `20`, then `140`. The whole color swings around the wheel.
3. Change `.glass` to use `opacity: 0.6` with a solid white background instead of the alpha color. Notice the text fades too?
4. Fix the low-contrast paragraph so it's comfortable to read.

## Check your understanding

<Quiz
	question="In hsl(200 50% 37%), what does the last value control?"
	:options="['Hue', 'Saturation', 'Lightness', 'Transparency']"
	:answer-index="2"
	explanation="The three values are hue, saturation, and lightness, in that order."
/>

<Quiz
	question="You want a see-through background but fully solid text. What should you use?"
	:options="['opacity on the element', 'A background color with an alpha value', 'A lighter font color', 'display: none']"
	:answer-index="1"
	explanation="opacity fades the whole element, text included. An alpha color only affects that one color."
/>

<Quiz
	question="What is the recommended minimum contrast ratio for normal body text?"
	:options="['1.5 to 1', '2 to 1', '4.5 to 1', '10 to 1']"
	:answer-index="2"
	explanation="WCAG asks for at least 4.5 to 1 for normal text, and 3 to 1 for large text."
/>

## Up next

You've been writing `20px` and `50%` without us ever stopping to talk about them. Time to fix that. [Units](/lessons/css/units) explains px, rem, em, percentages, and when to use each.
