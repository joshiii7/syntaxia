---
title: "HTML Best Practices and Common Mistakes to Avoid"
description: "Write HTML like a professional. Learn the habits that keep code clean and readable, the most common anti-patterns, and how to check your work with a validator."
---

# Best Practices and Common Mistakes

*Working code and good code aren't the same thing. This is the lesson about the difference.*

You now know enough HTML to build almost any page. That's a real milestone, so give yourself a moment. Seriously.

But here's something every developer finds out eventually: browsers are extremely forgiving. You can write messy, broken, confusing HTML, and the browser will squint at it and do its best to show *something*. So "it looks fine" tells you surprisingly little about whether your code is actually good.

This lesson is about what separates code that happens to work from code that a professional would be proud of.

## Write it like a recipe someone else will cook from

Imagine writing down a family recipe. If it's just for you, a scribble works: "flour, some eggs, bake till done." But if your cousin is going to cook it next year, while you're not around to explain? You'd write it clearly. Exact amounts, steps in order, a note about the oven running hot.

Code is that recipe. It gets read far more often than it's written, by teammates, by future employers looking at your portfolio, and most often by *you*, six months from now, wondering "what on earth was I thinking?" Every habit below is really about being kind to that future reader.

## Habits that make HTML easy to read

**Indent nested elements consistently.** Each level of nesting gets one more indent. Remember the family tree from [Nesting and the DOM](/lessons/html/nesting-and-the-dom)? Indentation makes that tree visible at a glance.

```html
<!-- Hard to follow -->
<ul><li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li></ul>

<!-- Easy to follow -->
<ul>
	<li><a href="index.html">Home</a></li>
	<li><a href="about.html">About</a></li>
</ul>
```

**Lowercase tags and attributes, quoted values.** HTML accepts `<P CLASS=intro>`, but everyone expects `<p class="intro">`. Consistency means nobody has to think about it.

**Name files simply.** Lowercase, hyphens instead of spaces, no special characters: `about-me.html`, `team-photo.webp`. A space in a file name turns into `%20` in the web address, and capital letters can cause "file not found" errors on some servers, where `Photo.webp` and `photo.webp` are two different files. Your home page should be called `index.html`, because that's the file web servers look for first.

**Comment the why, not the what.** `<!-- navigation -->` above a `<nav>` tells nobody anything. `<!-- Keep this link first: the partner agreement requires it -->` saves someone from "fixing" it later.

## The mistakes everyone makes (and how to fix them)

Here's a gallery of the most common anti-patterns. You'll recognize a few from earlier lessons, and if you've already made some of them, welcome to the club. Every developer has.

**Choosing tags for how they look.**

```html
<!-- Anti-pattern -->
<h4>Welcome to my site</h4>          <!-- chosen because it's small -->
<b>Contact</b>                       <!-- used as a heading -->

<!-- Better -->
<h1>Welcome to my site</h1>          <!-- then make it smaller with CSS -->
<h2>Contact</h2>
```

**Spacing with `<br>` and empty paragraphs.**

```html
<!-- Anti-pattern -->
<p>Intro text</p>
<br><br><br>
<p></p>

<!-- Better: space is a job for CSS margin, not empty elements -->
<p>Intro text</p>
```

**Clickable divs.**

```html
<!-- Anti-pattern: invisible to keyboards and screen readers -->
<div onclick="save()">Save</div>

<!-- Better -->
<button type="button">Save</button>
```

**Duplicate ids.** An `id` is a name tag, and two people with the same name tag cause chaos. Labels point to the wrong input, links jump to the wrong place, and scripts grab the wrong element. If you need to mark several elements, that's what `class` is for.

**Missing or useless alt text.** `alt="image"`, `alt="photo123.webp"`, or no alt at all. See [Images](/lessons/html/images).

**Placeholders pretending to be labels.** See [Forms: The Basics](/lessons/html/forms-part-1).

**Tables for layout.** See [Tables](/lessons/html/tables).

**Forgetting the basics in the head.** No `lang`, no `viewport`, the same `<title>` on every page. Small omissions, big effects.

**Obsolete elements.** You may find tutorials using `<center>`, `<font>`, `<marquee>`, or `<big>`. These are from the 1990s and have been removed from the HTML standard. Their jobs belong to CSS now. If a tutorial uses them, it's a sign the tutorial is very old.

**Inline styles everywhere.** `style="color: red"` on dozens of elements means changing your brand color involves editing dozens of places. Keeping styles in a separate stylesheet means changing one line. You'll see how in the next lesson.

## Check your work: validators and developer tools

Since browsers hide your mistakes, you need tools that *don't*.

**The HTML validator.** The W3C Markup Validation Service (validator.w3.org) reads your HTML and lists every error: unclosed tags, duplicate ids, missing alt text, elements in places they aren't allowed. Paste your code in and see what it says. The first time can be humbling. Twenty errors! Don't panic. Often one unclosed tag causes a whole cascade, and fixing it makes ten errors vanish at once. Fix from the top down.

**Browser developer tools.** Right-click anything on a page and choose **Inspect**. You'll see the live DOM, the family tree the browser actually built from your code. If the browser had to fix your nesting, you'll see its version, not yours, which is a great way to catch bugs. The [Debugging Basics](/lessons/ide/debugging-basics) lesson walks through these tools.

**Your editor.** A good code editor highlights mismatched tags and can auto-format your indentation. [Extensions & Customization](/lessons/ide/extensions-and-customization) covers some helpful add-ons.

## Try it: bug hunt

The page below "works." It shows up fine in the preview. But it's full of the mistakes from this lesson. How many can you find and fix?

<WebPlayground
	:panes="['html']"
	:initial-html="'<div class=\'header\'>\n<H1>My Bakery</H1>\n<div onclick=\'goHome()\'>Home</div>\n</div>\n\n<h4>Our Breads</h4>\n<img src=\'bread.webp\'>\n<p>Fresh every morning. To see prices, <a href=\'prices.html\'>click here</a>.</p>\n<br><br><br>\n\n<p id=\'note\'>Closed on Mondays.</p>\n<p id=\'note\'>Open on holidays.</p>\n\n<center>Thanks for visiting!</center>\n\n<input type=\'email\' placeholder=\'Your email\'>'"
	preview-height="340px"
/>

## Try it yourself

Fix every problem you can find. Here's a checklist so you know when you're done (no peeking until you've tried):

1. The header should be a `<header>` with a lowercase `<h1>`.
2. The clickable "Home" div should be a real link inside a `<nav>`.
3. "Our Breads" is a main section, so it should be an `<h2>`, not an `<h4>`.
4. The image needs meaningful alt text.
5. "click here" should become descriptive link text.
6. The stack of `<br>` tags should go.
7. The two paragraphs can't share `id="note"`. Use a class, or remove the ids.
8. `<center>` is obsolete. Use a `<footer>` with a `<p>` instead.
9. The email input needs a real `<label>`, an `id`, and a `name`.

If you found all nine, you've got a sharp eye. If you found five, you've still got a sharper eye than you had a week ago.

## Check your understanding

<Quiz
	question="The browser displays your page correctly. Does that mean your HTML is correct?"
	:options="['Yes, always', 'No, browsers quietly fix many mistakes, so use a validator', 'Only if you use Chrome', 'Only if there are no images']"
	:answer-index="1"
	explanation="Browsers are forgiving and guess at broken code. A validator shows the mistakes the browser is hiding."
/>

<Quiz
	question="Which file name is the best choice?"
	:options="['About Me Page.html', 'AboutMe!.HTML', 'about-me.html', 'about me (final).html']"
	:answer-index="2"
	explanation="Lowercase letters and hyphens avoid encoded spaces and case-sensitivity problems on servers."
/>

<Quiz
	question="Which of these is an obsolete element you should not use?"
	:options="['<section>', '<center>', '<figure>', '<time>']"
	:answer-index="1"
	explanation="center was removed from HTML long ago. Centering is a job for CSS."
/>

## Up next

You've heard "that's a job for CSS" a lot in this track. It's finally time to find out how HTML hands that job off. On to [Where HTML Meets CSS and JS](/lessons/html/html-meets-css-and-js).
