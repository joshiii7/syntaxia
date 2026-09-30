---
title: "The CSS Cascade, Specificity, and Inheritance"
description: "Find out which CSS rule wins when rules disagree. Learn the cascade, how specificity is scored, why source order matters, how inheritance works, and why to avoid !important."
---

# The Cascade and Specificity

*When two rules disagree, CSS doesn't pick at random. It listens to the most specific voice in the room.*

At some point, very soon if it hasn't happened already, you're going to write a CSS rule, press Run, and... nothing happens. You'll check the spelling. You'll check the semicolons. Everything looks right. And your paragraph stubbornly stays gray.

That moment is so common it's practically a rite of passage. And nine times out of ten, the answer is in this lesson. Another rule is winning. Once you understand *why* it's winning, CSS goes from feeling random to feeling like a system. This is the "C" in CSS: **Cascading**.

## A house full of instructions

Imagine you're a kid, and you've got instructions coming at you from all directions:

- A sign by the front door says: **"Everyone, shoes off inside."**
- Your parent says: **"Kids, you can keep your slippers on."**
- Then your grandma looks right at you: **"Sam, put your good shoes on, we're going out."**

Who do you listen to? Grandma, obviously. Not because she's louder, but because she was talking **specifically to you**. The sign was for everyone. Your parent was talking to all the kids. Grandma used your name.

CSS resolves conflicts the same way. When several rules set the same property on the same element, the browser asks a series of questions, in order, until it finds a winner.

## Question 1: Is anything marked important?

We'll come back to this one at the end, because it's the exception. Normally the answer is no, so the browser moves on.

## Question 2: Which rule is more specific?

Here's the heart of it. Every selector gets a **specificity** score, based on what's in it. Think of it as a three-column scoreboard:

| Column | What counts | Example |
|---|---|---|
| **A: ids** | each `#id` | `#special-offer` |
| **B: classes, attributes, pseudo-classes** | each `.class`, `[attr]`, `:hover` | `.price`, `[type="email"]`, `:first-child` |
| **C: elements, pseudo-elements** | each tag name, `::before` | `p`, `li`, `::first-letter` |

You compare scores **column by column, from the left**, like comparing version numbers. A single id beats any number of classes. A single class beats any number of element selectors.

```css
p                      /* 0, 0, 1 */
.intro                 /* 0, 1, 0 */
p.intro                /* 0, 1, 1 */
article p.intro        /* 0, 1, 2 */
#welcome               /* 1, 0, 0 */
#welcome .intro        /* 1, 1, 0 */
```

So in the family:

- `p` is the sign by the door. Talking to everyone.
- `.intro` is the parent talking to "the kids." A group you chose.
- `#welcome` is Grandma saying your name.

Let's see it in action:

```css
#welcome {
	color: purple;       /* 1, 0, 0: wins */
}

.intro {
	color: green;        /* 0, 1, 0 */
}

p {
	color: gray;         /* 0, 0, 1 */
}
```

```html
<p id="welcome" class="intro">Hello!</p>
```

The paragraph is purple. It doesn't matter that `p` or `.intro` came later or earlier. The id is simply more specific.

(And inline `style` attributes? They're like Grandma physically standing next to you, holding your shoes. They beat every selector. That's why [Three Ways to Add CSS](/lessons/css/applying-css) warned you about them.)

## Question 3: Which rule came last?

If two rules have *exactly* the same specificity, the one that appears **later** wins. It's the most recent instruction.

```css
.button {
	background: blue;
}

.button {
	background: green;    /* same specificity, comes later: wins */
}
```

This applies across files too. If you link two stylesheets, rules in the second one win ties against the first.

## Inheritance: family traits

There's one more idea tangled up in all this. Some properties get **inherited**: children automatically take them from their parents, like a family accent.

```css
body {
	font-family: Georgia, serif;
	color: #333333;
}
```

Every paragraph, heading, list, and link inside `body` now uses Georgia and dark gray text, without you ever writing a rule for them. That's inheritance, and it's why setting fonts and text colors on `body` is such a common first step.

But not everything is inherited. Mostly, **text-related properties inherit** (color, font, line-height, text-align) and **box-related properties don't** (border, padding, margin, background). Makes sense, right? If you put a border on a `<section>`, you wouldn't want every paragraph inside it to get its own border too.

And one important detail: an inherited value is the weakest voice of all. *Any* rule that targets an element directly, even a plain `p` selector, beats a value it inherited from its parent.

You can also ask for inheritance on purpose, with the keyword `inherit`:

```css
a {
	color: inherit;   /* take the parent's text color instead of the default blue */
}
```

## `!important`: the fire alarm

```css
.warning {
	color: red !important;
}
```

Adding `!important` to a declaration jumps it ahead of every normal declaration, whatever their specificity. (Two `!important` declarations then compete by specificity again, which is exactly how the trouble below starts.) It's the fire alarm: when it goes off, everyone stops following the normal instructions.

And that's exactly why you should almost never use it. If you pull the fire alarm to get your way in a disagreement, the only way anyone can override you is by pulling a *louder* fire alarm. Pretty soon your stylesheet is full of `!important`s fighting each other, and nothing makes sense anymore.

When a rule isn't working, the fix is almost never `!important`. It's understanding which rule is winning, and why. Which brings us to...

## Your best friend: the browser's developer tools

Right-click any element and choose **Inspect**. In the Styles panel, you'll see every rule that targets that element, listed with the winning rules at the top, and the losing declarations **crossed out**. It literally shows you who won the argument and who lost. When "my CSS isn't working," this is the first place to look, every time. The [Debugging Basics](/lessons/ide/debugging-basics) lesson walks through these tools.

## Try it

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<article class=\'story\'>\n\t<p id=\'welcome\' class=\'intro\'>Which color am I?</p>\n\t<p class=\'intro\'>And me?</p>\n\t<p>And me? I inherit my font from the article.</p>\n</article>'"
	:initial-css="'.story {\n\tfont-family: Georgia, serif;\n\tborder: 2px solid #cccccc;\n\tpadding: 8px;\n}\n\n#welcome {\n\tcolor: purple;\n}\n\n.intro {\n\tcolor: green;\n}\n\np {\n\tcolor: gray;\n}\n'"
	preview-height="200px"
/>

## Try it yourself

1. Predict each paragraph's color *before* you change anything. Then check. Were you right?
2. Move the `p` rule to the very top of the CSS. Does anything change? (It shouldn't. Order only matters when specificity ties.)
3. Change `.intro` to `article .intro`. Its score becomes 0, 1, 1. Does it beat `#welcome` now? Why not?
4. Notice the paragraphs inherited Georgia from `.story`, but did they inherit the border?

## Check your understanding

<Quiz
	question="Which selector has the highest specificity?"
	:options="['article p', '.card .title', '#main', 'ul li a']"
	:answer-index="2"
	explanation="A single id (1, 0, 0) beats any number of classes or element selectors."
/>

<Quiz
	question="Two rules have exactly the same specificity and set the same property. Which one wins?"
	:options="['The first one', 'The one that appears later', 'The shorter one', 'Neither, the property is ignored']"
	:answer-index="1"
	explanation="When specificity ties, source order decides: the later rule wins."
/>

<Quiz
	question="Which of these properties is inherited by child elements by default?"
	:options="['border', 'margin', 'color', 'padding']"
	:answer-index="2"
	explanation="Text properties like color and font are inherited. Box properties like border, margin, and padding are not."
/>

## Up next

Take a breath. That was the most conceptual lesson in the track, and if it didn't fully click yet, it will as you use it. Now for something wonderfully concrete: every element on the page is a box, and in [The Box Model](/lessons/css/box-model) you'll learn exactly how those boxes are built. If you'd like to see how JavaScript plays into specificity later, we'll revisit it in [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript).
