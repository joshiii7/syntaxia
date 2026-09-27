---
title: "The CSS Box Model: Padding, Border, Margin"
description: "Every element is a box. Learn content, padding, border, and margin, the shorthand order, margin collapsing, and why box-sizing: border-box makes sizes predictable."
---

# The Box Model

*Every element on a web page is a framed picture. Once you see the frames, layout stops being a mystery.*

Here's a secret that changes how you see every website: **every single element is a rectangle.** Headings, paragraphs, images, links, buttons. Even text that looks round or curvy sits inside an invisible rectangular box.

And every one of those boxes is built the same way. Let's walk over to a gallery wall.

## A framed picture

Picture a framed photo hanging on a wall. From the inside out, it has four layers:

1. **The photo itself.** That's the **content**: your text, your image.
2. **The matting**, that cardboard border between the photo and the frame, giving it room to breathe. That's **padding**.
3. **The frame** itself, wood or metal. That's the **border**.
4. **The empty wall space** between this frame and the next one. That's **margin**.

```css
.card {
	width: 300px;
	padding: 20px;             /* the matting */
	border: 4px solid #2f6f8f; /* the frame */
	margin: 24px;              /* the wall space around it */
}
```

Notice where each layer gets its color from. The matting (padding) shows the element's **background**, just like matting sits behind the photo, inside the frame. The margin is always transparent. It's the wall, not part of the picture.

That one detail explains a question beginners ask constantly: "Should I use padding or margin here?"

- Want space **inside** the box, between the text and the edge, where the background color shows? **Padding.**
- Want space **outside** the box, pushing other boxes away? **Margin.**

## Writing the sides

Each of these can be set per side:

```css
.card {
	padding-top: 10px;
	padding-right: 20px;
	padding-bottom: 10px;
	padding-left: 20px;
}
```

Or with the shorthand, which follows the hands of a clock starting at 12: **top, right, bottom, left**.

```css
padding: 10px 20px 10px 20px;  /* top, right, bottom, left */
padding: 10px 20px;            /* top and bottom, then left and right */
padding: 10px;                 /* all four sides */
```

If you ever forget the order, think "TRouBLe": Top, Right, Bottom, Left. Margin works exactly the same way.

## The sizing surprise

Now for the thing that has confused almost every CSS beginner in history. Look at this:

```css
.card {
	width: 300px;
	padding: 20px;
	border: 4px solid;
}
```

How wide is the card on screen? You'd think 300px. You told it 300px!

It's actually **348px**. By default, `width` only sets the size of the *photo*: the content box. The matting and the frame get added *on top*: 300 + 20 + 20 + 4 + 4. So you order a 300px frame from the shop, and it arrives 348px wide and doesn't fit on your wall.

This default is called `box-sizing: content-box`, and it makes layouts miserable. Two 50%-wide columns with a bit of padding suddenly add up to more than 100%, and one falls onto the next line. You stare at it wondering why the math is broken.

## The fix everyone uses: `border-box`

```css
*,
*::before,
*::after {
	box-sizing: border-box;
}
```

With `box-sizing: border-box`, `width` means the whole framed picture, frame included. You say 300px, you get 300px, and the padding and border squeeze *inward*, shrinking the photo a little to make room. That's how most people naturally think about size.

This little reset is at the top of nearly every professional stylesheet on the web. Put it at the top of yours too, and you'll dodge an entire category of layout bugs. (That `*` is the universal selector from [Selectors](/lessons/css/selectors).)

## Margins that collapse

One more quirk, and then you're through the hard part. Stack two paragraphs, each with `margin: 20px`. How much space is between them? 40px?

Nope. **20px.**

When two vertical margins meet, they don't add up. They **collapse** into one, and the larger margin wins. Think of two people who each need "one meter of personal space." They stand one meter apart, not two. Their bubbles overlap.

This only happens with **top and bottom** margins, and only in normal block layout. It doesn't happen with padding, and it doesn't happen inside flexbox or grid layouts, which you'll meet soon. If spacing between elements ever seems "smaller than it should be," this is probably why.

## Centering with auto margins

Here's a lovely trick that falls out of all this:

```css
.page {
	max-width: 960px;
	margin: 0 auto;
}
```

`auto` on the left and right margins tells the browser: "split whatever wall space is left equally on both sides." The box ends up centered horizontally. You'll use this constantly for centering a page's content column.

## See the boxes for real

Open your browser's developer tools (right-click, **Inspect**) and select any element. Look for the **box model diagram** in the Styles or Computed panel. It's a set of nested rectangles showing the exact content, padding, border, and margin sizes, color-coded. Hover over an element and the page highlights each layer. Once you've seen this, you'll never un-see it. More on these tools in [Debugging Basics](/lessons/ide/debugging-basics).

## Try it

<WebPlayground
	:panes="['css']"
	:initial-html="'<div class=\'card\'>I am the content. The pale blue is my padding, the dark line is my border, and the space outside is my margin.</div>\n<div class=\'card\'>A second card. Notice the gap between us.</div>'"
	:initial-css="'.card {\n\twidth: 300px;\n\tpadding: 20px;\n\tborder: 4px solid #2f6f8f;\n\tmargin: 24px;\n\tbackground: #d8e7ef;\n\tfont-family: system-ui, sans-serif;\n\t/* Try uncommenting this line: */\n\t/* box-sizing: border-box; */\n}\n'"
	preview-height="320px"
/>

## Try it yourself

1. Uncomment the `box-sizing` line (remove the `/*` and `*/`) and run it. The cards get narrower. Why? (Because now 300px includes the padding and border.)
2. Change `margin: 24px` to `margin: 24px auto`. The cards center themselves.
3. Increase the padding to `40px` and watch the pale blue matting grow, while the gap between cards stays the same.

## Check your understanding

<Quiz
	question="Which layer of the box shows the element's background color?"
	:options="['Margin', 'Padding', 'Neither', 'Only the border']"
	:answer-index="1"
	explanation="Padding sits inside the border, so the background shows through it. Margin is always transparent."
/>

<Quiz
	question="With box-sizing: border-box, what does width: 300px include?"
	:options="['Only the content', 'Content, padding, and border', 'Content, padding, border, and margin', 'Only the padding']"
	:answer-index="1"
	explanation="border-box makes width describe the whole framed picture, border included. Margin is always outside."
/>

<Quiz
	question="Fill in the blank: padding: 10px 20px 30px 40px; sets the ___ padding to 40px."
	:options="['top', 'right', 'bottom', 'left']"
	:answer-index="3"
	explanation="The shorthand goes clockwise from the top: top, right, bottom, left."
/>

## Up next

Your boxes are built. Time to fill them with color. [Colors](/lessons/css/colors) covers hex, rgb, hsl, and how to pick colors people can actually read. We'll put these boxes to serious work later in [Flexbox: The Basics](/lessons/css/flexbox).
