---
title: "HTML Meta Tags and SEO Fundamentals"
description: "Fill in your page's head properly: title, description, viewport, canonical, Open Graph, favicon, and JSON-LD structured data, plus the SEO basics that really matter."
---

# Meta Tags and SEO

*Your page's head is its book cover and back-cover blurb. It decides whether anyone picks the book up at all.*

Way back in [Anatomy of an HTML Document](/lessons/html/basic-structure), I promised we'd come back to the `<head>`. At the time, you only had `charset` and `<title>`. Now that you've built full pages, it's time to give them a proper cover.

## The library analogy

Picture a huge library with millions of books and no librarians. How do you pick one?

You glance at the spine: the title. You flip it over and read the blurb on the back. Maybe there's a sticker saying which shelf it belongs on. You almost never open to page 200 and start reading.

Search engines and social media apps treat your page the same way. Before anyone sees your beautiful body content, they see what's in your `<head>`: the title, the description, a preview image. That's your cover. Let's design it.

## The essentials

```html
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Easy Sourdough Bread for Beginners | Maria's Kitchen</title>
	<meta name="description" content="A no-fuss sourdough recipe for first-timers, with step-by-step photos, a simple feeding schedule, and fixes for the five most common mistakes.">
	<link rel="canonical" href="https://mariaskitchen.example/recipes/easy-sourdough">
	<link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
```

Line by line:

**`charset`** you know: it makes sure "café" doesn't turn into gibberish. Keep it first in the head.

**`viewport`** is the one beginners forget, and it matters enormously. Without it, phones assume your page was built for a desktop screen, shrink the whole thing down to fit, and your visitor has to pinch and zoom to read anything. This single line tells the phone "this page adapts to your screen, show it at normal size." Every page. No exceptions.

**`<title>`** is the spine of the book. It shows in the browser tab, in bookmarks, and as the big blue clickable headline in search results. Good titles:

- are unique for every page on your site,
- lead with what the page is about, not your site name,
- stay around 50 to 60 characters, so search results don't cut them off.

**`description`** is the back-cover blurb. Search engines often show it under your title in results. It won't magically move you up the rankings, but it strongly affects whether people *click*. Write it for a human: about 150 to 160 characters, and a genuine reason to visit.

**`canonical`** answers a strange-sounding problem. The same page can often be reached at several addresses (with or without `www`, with tracking codes on the end). To a search engine, that can look like several copies of the same book. The canonical link says "this is the original, list this one."

**`icon`** is the tiny favicon in the browser tab. SVG works beautifully here because it stays sharp at any size.

## Looking good when shared: Open Graph

Paste a link into a chat app or social media and a little preview card pops up: an image, a title, a line of description. Those come from **Open Graph** tags:

```html
<meta property="og:title" content="Easy Sourdough Bread for Beginners">
<meta property="og:description" content="A no-fuss sourdough recipe for first-timers.">
<meta property="og:image" content="https://mariaskitchen.example/images/sourdough-share.webp">
<meta property="og:url" content="https://mariaskitchen.example/recipes/easy-sourdough">
<meta name="twitter:card" content="summary_large_image">
```

Without these, the app guesses, and it often guesses badly: a random logo, a cut-off sentence from your navigation menu. With them, you choose the cover that shows up when someone shares your page.

## Structured data: filling in the library card

Remember old library index cards? Title, author, year, subject, all in fixed slots. Machines love that kind of predictable format.

**Structured data** gives search engines a filled-in card about your page, written in a format called **JSON-LD**:

```html
<script type="application/ld+json">
{
	"@context": "https://schema.org",
	"@type": "Recipe",
	"name": "Easy Sourdough Bread for Beginners",
	"image": "https://mariaskitchen.example/images/sourdough.webp",
	"author": { "@type": "Person", "name": "Maria Santos" },
	"totalTime": "PT24H",
	"recipeIngredient": ["500g flour", "350g water", "100g starter", "10g salt"]
}
</script>
```

Don't panic about the curly braces. That's JSON, a data format you'll get comfortable with in the JavaScript track's [JSON](/lessons/javascript/json) lesson. The idea is what matters: you're telling search engines "this is a recipe, here's the cooking time, here are the ingredients." That's how some search results show star ratings, cooking times, or event dates right in the listing. There are card types for articles, products, events, FAQs, organizations, and many more.

## What about `<meta name="keywords">`?

You'll find tutorials telling you to list your keywords in a meta tag. Skip it. People abused it so much years ago that major search engines stopped paying any attention to it. It does nothing today.

## SEO is mostly... everything you've already learned

Here's the part that might surprise you. **SEO** (search engine optimization) isn't mostly about secret head tags. The head helps. But the biggest factors are things you already know how to do:

- **Useful, original content** that answers what people are actually searching for.
- **A clear heading outline**, which helps search engines understand your structure ([Headings and Paragraphs](/lessons/html/headings-and-paragraphs)).
- **Semantic structure**, so the main content is obviously the main content ([Semantic HTML](/lessons/html/semantic-html)).
- **Descriptive link text and alt text**, which search engines read the same way screen readers do.
- **Fast pages that work well on phones**, which is where properly sized images and that viewport tag come in.

Notice how much of that overlaps with accessibility? That's no accident. A page that's easy for a screen reader to understand is usually easy for a search engine to understand too.

## Try it

This editor places your code inside its own preview page, so head tags won't visibly change anything here, and that's actually the lesson: the head is invisible on the page. Its job happens in browser tabs, search results, and share cards.

<WebPlayground
	:panes="['html']"
	:initial-html="'<!DOCTYPE html>\n<html lang=\'en\'>\n<head>\n\t<meta charset=\'UTF-8\'>\n\t<meta name=\'viewport\' content=\'width=device-width, initial-scale=1\'>\n\t<title>Easy Sourdough Bread for Beginners | Maria\'s Kitchen</title>\n\t<meta name=\'description\' content=\'A no-fuss sourdough recipe for first-timers, with step-by-step photos and fixes for common mistakes.\'>\n\t<meta property=\'og:title\' content=\'Easy Sourdough Bread for Beginners\'>\n</head>\n<body>\n\t<h1>Easy Sourdough Bread</h1>\n\t<p>Only the body shows up here. The head is working behind the scenes.</p>\n</body>\n</html>'"
	preview-height="200px"
/>

## Try it yourself

1. Write a title and description for a page about *you*: say, a personal profile page. Keep the title under 60 characters and the description around 150.
2. Add the three Open Graph tags you'd want when a friend shares your page: title, description, and image.
3. Go to any website you like, right-click, choose "View Page Source," and find its `<title>` and `description`. Would you have written them differently?

## Check your understanding

<Quiz
	question="Which tag stops phones from shrinking your page down like a tiny desktop site?"
	:options="['<meta charset>', '<meta name=viewport>', '<link rel=canonical>', '<title>']"
	:answer-index="1"
	explanation="The viewport meta tag tells mobile browsers to display the page at the device's real width."
/>

<Quiz
	question="Where does the title element's text appear?"
	:options="['As the biggest heading on the page', 'In the browser tab and as the headline in search results', 'Only in the source code', 'Under every image']"
	:answer-index="1"
	explanation="The title is the spine of the book: browser tabs, bookmarks, and search result headlines."
/>

<Quiz
	question="Which tags control the preview card when your link is shared in a chat app?"
	:options="['Open Graph tags like og:title and og:image', 'The keywords meta tag', 'The charset tag', 'The h1 element only']"
	:answer-index="0"
	explanation="Open Graph tags let you choose the image, title, and description shown in share previews."
/>

## Up next

Your pages now have a proper cover. Next, we'll put other people's content *inside* your page, maps, videos, and more, in [iframes and Embedding](/lessons/html/iframes-and-embedding).
