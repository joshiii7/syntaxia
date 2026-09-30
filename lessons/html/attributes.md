---
title: "HTML Attributes Explained for Beginners"
description: "Attributes are the extra details on an HTML tag, like where a link goes or which image to show. Learn how they work, how to write them, and the common ones."
---

# Attributes

*A tag says what something is. An attribute says which one, where, and how.*

Let's say I hand you a box labeled "Photo." Useful, sure. But which photo? Where is it stored? What's in it, in case you can't see it?

A tag on its own has the same problem. `<img>` tells the browser "an image goes here," and then just... stops. The browser has no idea which image. That's where **attributes** come in. They're the extra details written on the label.

## What an attribute looks like

An attribute always lives inside the **opening** tag, and it's written as a name, an equals sign, and a value in quotes:

```html
<img src="sunset.webp" alt="An orange sunset over the sea">
```

Read it like a shipping label:

- `src` ("source") says *where the photo is*: the file `sunset.webp`.
- `alt` ("alternative text") says *what's in it*, for anyone who can't see the picture.

You can stack as many attributes as you need, separated by spaces, in any order. The browser doesn't care whether `alt` comes before `src`.

## Some attributes are required for the tag to make sense

Think of a link without a destination. A doorway that leads nowhere. That's `<a>` without `href`:

```html
<a href="https://example.com">Visit Example</a>
```

The `href` attribute is the whole point of a link. Same for `src` on an image. These aren't optional flavor. They're the part that makes the element actually work. We'll dig into both in [Links and Navigation](/lessons/html/links) and [Images](/lessons/html/images).

## `id` and `class`: names and team jerseys

Two attributes you'll use constantly work on almost any element:

- **`id`** gives one element a unique name, like a name tag. Only one element on the page should wear a given `id`.
- **`class`** puts an element on a team, like a jersey. Lots of elements can wear the same class, and one element can wear several, separated by spaces.

```html
<h1 id="page-title">My Recipes</h1>

<p class="note">Preheat the oven first.</p>
<p class="note warning">The tray will be hot!</p>
```

Right now these don't *do* anything visible. So why bother? Because later, CSS and JavaScript will use them to find elements. "Paint every `.warning` red." "When someone clicks, jump to `#page-title`." You're labeling the boxes now so future-you can find them in a hurry.

## Boolean attributes: just being there is enough

A few attributes don't need a value at all. Their presence alone switches something on, like a light switch:

```html
<input type="checkbox" checked>
<button disabled>Can't click me</button>
```

`checked` means "start this box ticked." `disabled` means "grey this out." Writing `disabled="false"` does *not* turn it off, by the way. The switch is flipped simply because the word is there. To turn it off, you remove the attribute entirely. That one surprises a lot of people, so if a button stubbornly stays disabled, look for this.

## A few habits worth building now

- **Always quote your values.** HTML sometimes lets you skip quotes, but a value with a space in it (`alt=A cat`) will break. Quotes every time means no surprises.
- **Write attribute names in lowercase.** HTML doesn't care about case here, but everyone reading your code will expect lowercase.
- **Don't repeat an attribute** on the same tag. If you write `class` twice, the browser uses the first one and ignores the second.

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<h1 id=\'page-title\' title=\'Hover me for a tooltip\'>My Recipes</h1>\n<p class=\'note\'>Preheat the oven first.</p>\n<p>Read more at <a href=\'https://example.com\'>Example Kitchen</a>.</p>\n\n<label><input type=\'checkbox\' checked> Ingredients ready</label>\n<br>\n<button disabled>Start cooking</button>'"
	preview-height="220px"
/>

## Try it yourself

1. Hover over the heading. The `title` attribute shows as a small tooltip. (Handy for extras, but never put anything important only in a `title`: keyboard and touch users never see the tooltip.)
2. Remove `checked` from the checkbox and run it again. Then remove `disabled` from the button. Notice how you turn these off by deleting them, not by changing a value.
3. Give the second paragraph a class of `note warning`, so it's on two teams at once.

## Check your understanding

<Quiz
	question="Where do attributes go?"
	:options="['Inside the closing tag', 'Inside the opening tag', 'Between the opening and closing tags', 'In a separate file']"
	:answer-index="1"
	explanation="Attributes always live inside the opening tag, like details written on a label."
/>

<Quiz
	question="Which attribute should be unique, used by only one element on the page?"
	:options="['class', 'id', 'title', 'alt']"
	:answer-index="1"
	explanation="An id is like a name tag. A class is like a team jersey that many elements can share."
/>

<Quiz
	question="How do you turn off a disabled button?"
	:options="['Change it to disabled=false', 'Change it to disabled=no', 'Remove the disabled attribute', 'Add enabled next to it']"
	:answer-index="2"
	explanation="Boolean attributes are on whenever they are present, whatever their value. Remove it to turn it off."
/>

## Up next

You now have the tools to label and describe elements. Next, we fill the body with real content, starting with [Headings and Paragraphs](/lessons/html/headings-and-paragraphs). Later on, once you've seen more elements, we'll come back for the advanced stuff (global attributes and your own custom `data-*` attributes) in [Attributes Deep Dive](/lessons/html/attributes-deep-dive). And if the idea of elements living inside elements still feels shaky, [Nesting and the DOM](/lessons/html/nesting-and-the-dom) is worth a revisit.
