---
title: "Anatomy of an HTML Document"
description: "Learn what doctype, html, head, and body do, why every page needs them, and how the browser reads your file from top to bottom like a letter."
---

# Anatomy of an HTML Document

*Every page on the internet, from a tiny blog to a giant online store, is built on the same four-part skeleton. Let's meet it.*

So far you've been writing little snippets. An `<h1>` here, a `<p>` there. They worked, and that probably felt good. But if you've peeked at the source of a real website (right-click, "View Page Source"), you may have seen a wall of stuff above the content and thought, "Wait, what is all of that?"

That's what we're going to untangle today. And I promise it's less scary than it looks.

## A page is a letter

Think about a proper, old-fashioned letter. The kind you'd put in an envelope.

- On the outside of the envelope, there's a note about what kind of mail it is. Airmail. Registered. Postcard.
- The envelope itself holds everything together.
- Inside, at the top, there's information *about* the letter: the date, who it's from, a subject line. You don't read that part as the "story."
- Then comes the actual message, the part you sit down and read.

An HTML document is built the exact same way. Here's the whole skeleton:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>My First Real Page</title>
	</head>
	<body>
		<h1>Hello!</h1>
		<p>This is the part people actually see.</p>
	</body>
</html>
```

Let's walk through it, line by line, with that letter in mind.

## `<!DOCTYPE html>`: the stamp on the envelope

This first line isn't really a tag. It's a notice to the browser that says, "This is a modern HTML document. Please read it using today's rules."

Why would a browser need to be told? Because browsers have been around since the early 1990s, and back then pages were written in lots of messy, inconsistent ways. Browsers still support those old pages using something called **quirks mode**, where they bend the rules to keep ancient websites working. Leave the doctype out, and your page might get treated like one of those old relics. Layouts shift. Spacing gets weird. And you'll spend an afternoon debugging something that was never your fault.

So it goes on line one. Every time. It's the stamp that gets your letter routed correctly.

## `<html>`: the envelope

The `<html>` element wraps everything else. Every other tag on the page lives inside it, which is why it's called the **root** element.

Notice the `lang="en"` part? That tells the browser (and screen readers, and search engines, and translation tools) what language the page is written in. A screen reader uses it to pick the right pronunciation. If your page is in Filipino, you'd write `lang="fil"`; in Spanish, `lang="es"`. It's a tiny thing that makes a real difference for people, and we'll come back to it in [Accessibility Basics](/lessons/html/accessibility-basics).

## `<head>`: the information about the letter

Here's the part that confuses almost everyone at first. The `<head>` is *not* the top of your visible page. It's not a header, not a banner, not a title bar you can see on the page itself.

The head holds information **about** the page. Like the date and subject line on a letter, it's there for whoever handles the letter, not for the story inside.

In our example the head holds two things:

- `<meta charset="UTF-8">` tells the browser which set of characters to use. UTF-8 covers practically every writing system on Earth, plus emoji. Without it, a word like "café" or "piñata" can come out as garbled symbols.
- `<title>` sets the text in the browser tab and the name used when someone bookmarks your page. Search engines also show it as the clickable headline in their results.

The head can hold much more than this: descriptions for search engines, links to style sheets, icons. We have a whole lesson on it later, [Meta Tags and SEO](/lessons/html/meta-and-head-tags), once you've got more tools in your belt.

## `<body>`: the letter itself

Everything inside `<body>` is what visitors actually see and interact with. Headings, paragraphs, images, buttons, forms. All of it lives here.

Most of your time as an HTML author will be spent inside the body. The rest of the skeleton you'll type once per page and rarely think about again.

## "Do I really need all this?"

Honest answer: if you delete the `<html>`, `<head>`, and `<body>` tags, most browsers will quietly add them back for you behind the scenes. Browsers are forgiving like that.

But "the browser guessed right" is not the same as "I wrote it right." Guessing can go wrong in subtle ways, other developers reading your code will be confused, and tools that check your code will complain. Professionals write the full skeleton every time. So will you.

## Try it

The preview below is already wrapped in its own page by the editor, so the `<title>` won't show up in a browser tab here. Everything in the body will, though.

<WebPlayground
	:panes="['html']"
	:initial-html="'<!DOCTYPE html>\n<html lang=\'en\'>\n\t<head>\n\t\t<meta charset=\'UTF-8\'>\n\t\t<title>My First Real Page</title>\n\t</head>\n\t<body>\n\t\t<h1>Hello!</h1>\n\t\t<p>This is the part people actually see. Try a word like café or piñata.</p>\n\t</body>\n</html>'"
	preview-height="220px"
/>

## Try it yourself

1. Move the `<h1>` so it sits inside the `<head>` instead of the `<body>`. Press **Run**. What happens? (Browsers will often rescue you by moving it into the body, which is exactly the kind of guessing we want to avoid relying on.)
2. Put it back, then add a second paragraph to the body that says what you had for breakfast.

## Check your understanding

<Quiz
	question="Where does the content that visitors actually see belong?"
	:options="['Inside <head>', 'Inside <body>', 'Right after <!DOCTYPE html>', 'Inside <title>']"
	:answer-index="1"
	explanation="The body is the letter itself. The head holds information about the page, not visible content."
/>

<Quiz
	question="What can happen if you leave out <!DOCTYPE html>?"
	:options="['The page will not load at all', 'The browser may use quirks mode and render things inconsistently', 'All your images disappear', 'Nothing, it is purely decorative']"
	:answer-index="1"
	explanation="Without the doctype, browsers can fall back to quirks mode, an old compatibility mode that bends layout rules."
/>

<Quiz
	question="Fill in the blank: <html ___='en'> tells the browser the page is written in English."
	:options="['language', 'lang', 'locale', 'type']"
	:answer-index="1"
	explanation="The lang attribute on the html element sets the language of the whole page."
/>

## Up next

You now know the skeleton. Next, we'll look at how all these boxes fit inside each other, and why the browser sees your page as a family tree, in [Nesting and the DOM](/lessons/html/nesting-and-the-dom). If you want a quick refresher on what an element is, [Your First HTML File](/lessons/html/your-first-html-file) is always there.
