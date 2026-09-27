---
title: "What Is CSS? Intro to Styling Web Pages"
description: "Start the CSS track here. Learn what CSS is, why structure and presentation live apart, how a CSS rule is built, and style your first HTML page in a live editor."
---

# What CSS Is and Why It Exists

*You built the house. Now we get to decorate it.*

Let's take a moment before we start, because you've earned it. At the end of the HTML track, you built a complete, well-structured page from scratch. A header with your name, a nav, a main area with sections and an article, a form that checks its own answers, a footer. Every room labeled. Every image described.

And it probably looks... a bit like a document from 1996. Black Times New Roman on a white background, everything stacked in one long column, blue underlined links.

That's not a failure. That's exactly where every web page starts. You built the walls, the rooms, and the doors. Now it's time to paint, pick the furniture, and hang the lights. That's what **CSS** is for, and it's where a lot of people fall in love with web development, because you're about to *see* every change you make.

## What CSS actually is

**CSS** stands for **Cascading Style Sheets**. It's a language for describing how HTML should *look*: colors, fonts, spacing, sizes, and where things sit on the screen.

Remember the three trades from [Where HTML Meets CSS and JS](/lessons/html/html-meets-css-and-js)?

- HTML is the builder: structure and meaning.
- **CSS is the interior designer: appearance.**
- JavaScript is the electrician: behavior.

The builder says "this is a kitchen." The designer says "the kitchen walls are sage green, and the table goes by the window." Neither one needs to do the other's job.

## Why keep them apart?

This might seem like a strange rule at first. Wouldn't it be simpler to just say "big blue heading" right in the HTML?

In the early web, that's exactly what people did. They used tags like `<font color="blue" size="5">` all over their pages. And it was a nightmare. Imagine a site with 200 pages, and your boss says "we're changing the brand color from blue to green." You'd have to open all 200 files and change thousands of tags by hand. Miss one and your site looks broken.

With CSS, you write the rule once:

```css
h1 {
	color: green;
}
```

Every `<h1>` on every page that uses this stylesheet turns green. One line changed. Two hundred pages updated. That's the whole reason CSS exists, and it's also why you spent the HTML track choosing elements for their *meaning* instead of their looks. The look was always going to come from here.

## The anatomy of a CSS rule

Every piece of CSS you'll ever write is built from the same little pattern. Let's take it apart:

```css
h1 {
	color: #2f6f8f;
	font-size: 2.5rem;
}
```

- **`h1`** is the **selector**. It points at which elements this rule applies to. Here: every `<h1>`.
- **`{ }`** the curly braces hold the **declaration block**, the list of instructions.
- **`color: #2f6f8f;`** is a **declaration**. It has two parts:
  - **`color`** is the **property**, the thing you want to change.
  - **`#2f6f8f`** is the **value**, what you want to change it to.
- **`;`** the semicolon ends each declaration. Forget it and the next line often breaks too.

Think of it like writing instructions for a decorator: "**Kitchen**: walls sage green; floor oak." The room is the selector, and each "thing: choice" pair is a declaration.

## The page already has some styles

Here's something that confuses people early on. If CSS controls how things look, why does an unstyled page already have big bold headings and blue links?

Because every browser ships with its own built-in stylesheet, called the **user agent stylesheet**. It's like a rental apartment that comes with plain white walls and basic blinds. Livable, not exactly *you*. When you write CSS, you're not starting from nothing. You're repainting over those defaults. That's why sometimes you'll add a style and something unexpected (like a margin you didn't ask for) is already there. It came with the apartment.

## Try it

The HTML here is fixed. Edit the CSS pane and press **Run** to restyle it.

<WebPlayground
	:panes="['css']"
	:initial-html="'<h1>Maria Santos</h1>\n<p>Home baker, weekend hiker, and <strong>aspiring web developer</strong>.</p>\n<p>I built this page with HTML. Now I am learning to style it.</p>\n<a href=\'#\'>Read my story</a>'"
	:initial-css="'h1 {\n\tcolor: #2f6f8f;\n}\n\np {\n\tcolor: #444444;\n}\n'"
	preview-height="220px"
/>

## Try it yourself

1. Change the `h1` color to any color name you like, such as `tomato`, `rebeccapurple`, or `seagreen`.
2. Add a new rule for `strong` that sets `color: crimson;`.
3. Delete one of the semicolons, run it, and see what breaks. Then put it back. (Getting a feel for how CSS fails quietly now will save you headaches later.)

## Check your understanding

<Quiz
	question="In h1 { color: #2f6f8f; }, what is color called?"
	:options="['A selector', 'A property', 'A value', 'An attribute']"
	:answer-index="1"
	explanation="color is the property being changed. h1 is the selector, and #2f6f8f is the value."
/>

<Quiz
	question="Why does CSS live separately from HTML?"
	:options="['Browsers cannot read them together', 'So one stylesheet can restyle many pages, and structure stays independent from appearance', 'Because CSS is faster to type', 'HTML does not allow colors']"
	:answer-index="1"
	explanation="Separating appearance from structure means one rule can update every page that uses it."
/>

<Quiz
	question="Fill in the blank: each CSS declaration ends with a ___."
	:options="['comma', 'period', 'semicolon', 'colon']"
	:answer-index="2"
	explanation="A semicolon ends each declaration. The colon separates the property from its value."
/>

## Up next

You've written your first rules inside this editor. But where does CSS live on a *real* site? There are three places, and one of them is the professional standard. That's [Three Ways to Add CSS](/lessons/css/applying-css). And if you'd like to keep the page you built in the HTML track handy, [Capstone: Your Profile Page](/lessons/html/putting-it-all-together) is where it lives; we'll style it together at the end of this track.
