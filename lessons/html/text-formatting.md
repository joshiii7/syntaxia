---
title: "HTML Text Elements: Emphasis, Quotes, and Code"
description: "Give your text a tone of voice with strong, em, mark, blockquote, q, abbr, code, and pre, and learn why strong and b are not the same thing."
---

# Emphasis, Quotes, and Code

*Plain text is like reading aloud in a flat monotone. These elements give your words a tone of voice.*

Say this sentence out loud: "I didn't say she took the money."

Now say it again, but stress a different word each time. "*I* didn't say she took the money." "I didn't say *she* took the money." Same words. Completely different meanings.

Spoken language has tone, stress, and pauses. Written HTML needs a way to carry that too, and that's what this lesson is about.

## `<em>`: stress in your voice

`<em>` (emphasis) marks the word you'd lean on when speaking. Browsers show it in italics by default.

```html
<p>I didn't say <em>she</em> took the money.</p>
```

## `<strong>`: this really matters

`<strong>` marks something important, serious, or urgent. It's less "tone of voice" and more "grab someone by the shoulder." Browsers show it in bold.

```html
<p><strong>Warning:</strong> the pan is still hot.</p>
```

## "But why not just use `<b>` and `<i>`?"

Good question, and you'll see `<b>` and `<i>` all over older code. They make text bold and italic too. So what's the difference?

Think of it as the difference between *what you mean* and *what it looks like*. `<strong>` says "this is important." `<b>` just says "make this bold." A screen reader can pass along importance, but "bold" is a visual thing that means nothing to someone listening.

Modern HTML keeps `<b>` and `<i>` for a few specific cases where there's no extra importance or stress:

- `<i>` for words that are set apart from normal text, like a foreign phrase, a ship's name, or a technical term: *carpe diem*.
- `<b>` for text you want to draw the eye to without making it more important, like keywords in a product summary.

When in doubt, ask yourself: "Would I *say* this differently?" If yes, use `<em>` or `<strong>`.

## Highlights and small print

```html
<p>Search results for "pasta": our <mark>pasta</mark> recipes.</p>
<p><small>Prices include tax.</small></p>
```

`<mark>` is a highlighter pen, for text that's relevant right now, like search matches. `<small>` is small print: disclaimers, legal notes, copyright lines.

## Quoting other people

When you quote someone in conversation, you do it two ways. A quick quote mid-sentence: *she said "see you soon" and left.* Or a longer passage you read out in full.

HTML has an element for each:

```html
<p>As my grandmother used to say, <q>measure twice, cut once</q>.</p>

<blockquote cite="https://example.com/speech">
	<p>The best time to plant a tree was twenty years ago. The second best time is now.</p>
</blockquote>
<p>Popular proverb, quoted in <cite>The Gardener's Almanac</cite>.</p>
```

- `<q>` is a short inline quote. Browsers add the quotation marks for you.
- `<blockquote>` is a longer quote that stands on its own, usually indented.
- `<cite>` is the *title* of a work, like a book, film, or article.

## Abbreviations

```html
<p>The <abbr title="World Health Organization">WHO</abbr> released new guidance.</p>
```

The `title` attribute (remember [Attributes](/lessons/html/attributes)?) spells out the full name, and many browsers show it on hover.

## Code, keys, and preformatted text

This one's close to home for us, since we're learning to code.

```html
<p>Use the <code>&lt;p&gt;</code> element for paragraphs.</p>
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>

<pre>
Roses are red,
    Violets are blue,
        This spacing is kept,
            Just for you.
</pre>
```

- `<code>` marks a bit of computer code.
- `<kbd>` marks a key the user should press.
- `<pre>` (preformatted) is the one element that **keeps** your spaces and line breaks exactly as you typed them. Remember how the browser normally squashes whitespace? `<pre>` is the exception.

Wait, what's that `&lt;` thing? If you type `<p>` directly into your text, the browser thinks you're starting a real paragraph. So to *show* a less-than sign, you write `&lt;` (less than) and `&gt;` (greater than). These are called **character entities**. Another one you'll use a lot is `&amp;` for an ampersand.

## Lines and breaks

- `<br>` is a line break inside the same block, for addresses or poems.
- `<hr>` marks a change of topic, like the "* * *" between scenes in a novel. It shows as a horizontal line.

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<p>I didn\'t say <em>she</em> took the money.</p>\n<p><strong>Warning:</strong> the pan is still hot.</p>\n<p>As my grandmother said, <q>measure twice, cut once</q>.</p>\n\n<blockquote>\n\t<p>The best time to plant a tree was twenty years ago. The second best time is now.</p>\n</blockquote>\n\n<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save your <code>index.html</code> file.</p>\n<hr>\n<p><small>Tip: the <abbr title=\'World Health Organization\'>WHO</abbr> abbreviation shows a tooltip on hover.</small></p>'"
	preview-height="340px"
/>

## Try it yourself

1. Move the `<em>` to a different word in the first sentence and read it aloud. Hear how the meaning shifts?
2. Add a `<pre>` block with a short poem, using spaces to shape it however you like.
3. Write a paragraph that *shows* the text `<h1>` on the page using character entities.

## Check your understanding

<Quiz
	question="Which element marks text that is important or urgent?"
	:options="['<b>', '<strong>', '<mark>', '<big>']"
	:answer-index="1"
	explanation="strong carries meaning (importance). b only changes how text looks."
/>

<Quiz
	question="Which element keeps your spaces and line breaks exactly as typed?"
	:options="['<p>', '<code>', '<pre>', '<blockquote>']"
	:answer-index="2"
	explanation="pre is the one element that preserves whitespace instead of collapsing it."
/>

<Quiz
	question="Fill in the blank: to show a < character as text, you write ___."
	:options="['&amp;less;', '&amp;lt;', '<<', 'backslash <']"
	:answer-index="1"
	explanation="&amp;lt; is the character entity for the less-than sign, so the browser does not mistake it for a tag."
/>

## Up next

Next we'll organize information into [Lists](/lessons/html/lists), which show up everywhere, from recipes to navigation menus. And if you're wondering how all this "meaning over looks" thinking pays off for people using screen readers, [Accessibility Basics](/lessons/html/accessibility-basics) is where it all comes together. Want to go back over headings first? [Headings and Paragraphs](/lessons/html/headings-and-paragraphs) is right behind you.
