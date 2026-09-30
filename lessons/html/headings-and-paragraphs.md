---
title: "HTML Headings and Paragraphs, h1 to h6"
description: "Use h1 through h6 headings to build a clear outline of your page, and paragraphs to hold your text. Learn why heading order matters for readers and search."
---

# Headings and Paragraphs

*Headings are the table of contents your page carries around with it. Get them right and everyone, from a skimming reader to a screen reader to Google, can find their way.*

Open any textbook. Before you read a single sentence, you can already tell how it's organized: chapter titles, section titles, little sub-sections. You can skim the headings and know exactly where the part about photosynthesis is without reading everything else.

HTML headings do that job for a web page.

## Six levels, like an outline

HTML gives you six heading levels, `<h1>` through `<h6>`:

```html
<h1>Baking Bread at Home</h1>

<h2>What You Need</h2>
<h3>Ingredients</h3>
<h3>Tools</h3>

<h2>Step by Step</h2>
<h3>Mixing the Dough</h3>
<h3>Letting It Rise</h3>
```

Think of it as the outline you might have written for a school essay:

- **h1** is the title of the whole thing. The book cover.
- **h2** is a chapter.
- **h3** is a section inside that chapter.
- ...and so on down to h6, which you'll rarely need.

## The one thing people get wrong

Here's the trap. By default, browsers show `<h1>` huge and `<h4>` small. So it's very tempting to pick a heading by its *size*. "I want this a bit smaller, let me use an h4."

Please don't. I know it looks like it works. But you've just told the browser that your section is four levels deep in the outline, when it's actually a chapter. Imagine a textbook's table of contents where chapter 3 suddenly appears as a tiny sub-sub-section. Confusing, right?

Screen reader users rely on this outline heavily. Many of them jump from heading to heading to scan a page, the same way you skim with your eyes. A wonky outline is like a table of contents with the page numbers scrambled.

A few rules keep your outline honest:

- **One `<h1>` per page**, describing what the whole page is about.
- **Don't skip levels on the way down.** After an h2, the next level is h3, not h5.
- **Pick the level by meaning, not size.** Size is a job for CSS, and you'll learn to change it in the [Typography](/lessons/css/typography) lesson.

Going back *up* is fine, by the way. You can finish an h3 section and start a new h2 chapter. That's just starting a new chapter.

## Paragraphs: the actual reading

The `<p>` element holds a paragraph of text. Simple. But there's one mistake worth heading off:

```html
<!-- Not like this -->
<p>First idea.<br><br>Second idea.</p>

<!-- Like this -->
<p>First idea.</p>
<p>Second idea.</p>
```

Remember from [Nesting and the DOM](/lessons/html/nesting-and-the-dom) how the browser squashes whitespace? People sometimes fight that by stacking up `<br>` line breaks to fake paragraph spacing. It looks similar, but to the browser it's one paragraph with some line breaks in it. Save `<br>` for places where a line break is actually part of the content, like the lines of a poem or an address.

## "This feels too simple"

If you're thinking "okay, headings and paragraphs, I get it, why a whole lesson?" that's a good sign. It means you've got it. But notice what we actually talked about: *meaning*. That idea, choosing a tag because of what content **is** rather than how it **looks**, is the most important habit in all of HTML. It'll come up again and again, especially in [Semantic HTML](/lessons/html/semantic-html).

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<h1>Baking Bread at Home</h1>\n<p>Nothing beats the smell of fresh bread.</p>\n\n<h2>What You Need</h2>\n<h3>Ingredients</h3>\n<p>Flour, water, salt, and yeast.</p>\n<h3>Tools</h3>\n<p>A big bowl and a warm spot.</p>\n\n<h2>Step by Step</h2>\n<p>Coming soon!</p>'"
	preview-height="320px"
/>

## Try it yourself

Under the "Step by Step" chapter, add two sections of your own, "Mixing the Dough" and "Letting It Rise," each with a short paragraph. Which heading level should they use? (If you said h3, you're reading the outline like a pro.)

## Check your understanding

<Quiz
	question="How many h1 headings should a typical page have?"
	:options="['None', 'One', 'One per section', 'As many as you like']"
	:answer-index="1"
	explanation="One h1 describes what the whole page is about, like the title on a book cover."
/>

<Quiz
	question="You want a heading to look smaller. What should you do?"
	:options="['Use a lower-level heading like h5', 'Keep the correct level and change the size with CSS', 'Use a p tag instead', 'Wrap it in a br']"
	:answer-index="1"
	explanation="Choose the heading level by its place in the outline, then use CSS to control how it looks."
/>

<Quiz
	question="Fill in the blank: after an h2, the next level down in the outline is ___."
	:options="['h1', 'h3', 'h4', 'h6']"
	:answer-index="1"
	explanation="Don't skip levels on the way down. An h2 section is divided into h3 sub-sections."
/>

## Up next

Your text now has structure. Next, we'll give some of it personality: emphasis, quotes, and code, in [Emphasis, Quotes, and Code](/lessons/html/text-formatting).
