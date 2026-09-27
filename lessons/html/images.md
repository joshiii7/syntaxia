---
title: "HTML Images: img, alt Text, and Responsive srcset"
description: "Add images with the img tag, write alt text that actually helps people, reserve space with width and height, and serve the right size with srcset and picture."
---

# Images

*A picture is worth a thousand words, unless someone can't see it. Then it's worth exactly the words you give it.*

Up to now our pages have been all text. Adding an image is the moment a page starts to feel alive, and honestly, it's one of the most satisfying things you'll do in this track. It's also a place where a tiny bit of care makes a huge difference for real people. Let's do both.

## The basic image

```html
<img src="sunset.webp" alt="An orange sun setting over a calm blue sea">
```

You've seen this one before, back in [Attributes](/lessons/html/attributes). `<img>` is a void element, so it has no closing tag (remember those from [Nesting and the DOM](/lessons/html/nesting-and-the-dom)?). Two attributes do the heavy lifting:

- `src` is where the image file lives. It follows the same rules as link addresses, so it can be relative (`images/sunset.webp`) or absolute (`https://...`).
- `alt` is the image described in words.

## Alt text: describing a photo over the phone

Imagine you're on the phone with a friend and you're scrolling through vacation photos. They can't see your screen. What do you say?

You wouldn't say "image." You wouldn't say "IMG_4032.webp." You'd say something like: *"Oh, this one's the sunset from the last night. The sky's all orange and the sea is dead calm."*

That's alt text. It's what a screen reader says out loud to someone who's blind or has low vision. It's also what appears if the image fails to load on a slow connection, and it's what search engines read to understand your picture.

A few guidelines:

- **Describe what matters in this context.** A photo of a dog on a pet adoption site: "Max, a scruffy grey terrier, sitting and tilting his head." The same photo on a page about dog grooming might focus on the coat.
- **Skip "image of" or "picture of."** Screen readers already announce that it's an image.
- **If the image contains text, include that text.** A poster that says "Sale ends Friday" needs that phrase in the alt.
- **Purely decorative image? Use an empty alt:** `alt=""`. A decorative swirl adds nothing to the meaning, and an empty alt tells screen readers to skip it silently. Leaving `alt` off entirely is different and worse: many screen readers will read out the file name instead.

## Reserving a seat: width and height

```html
<img src="sunset.webp" alt="An orange sun setting over a calm blue sea" width="640" height="360">
```

Ever been reading an article when suddenly the text jumps down because an image finished loading above it? Annoying, right? You were about to click something and now you've clicked an ad.

Giving images a `width` and `height` is like reserving a seat at a restaurant. The browser saves exactly the right amount of space before the image even arrives, so nothing jumps. (You can still resize the image with CSS later; these numbers mainly tell the browser the shape.)

## Loading lazily

```html
<img src="gallery-12.webp" alt="..." width="640" height="360" loading="lazy">
```

`loading="lazy"` tells the browser: "Don't bother fetching this until the reader scrolls near it." Perfect for images far down a long page. Don't use it on the big image at the very top, though. You want that one right away.

## One photo, many sizes: `srcset`

Think about buying a T-shirt. The shop doesn't hand everyone an XL. They keep a range of sizes and you pick yours.

A huge photo looks great on a big monitor, but forcing a phone on a mobile data plan to download it is wasteful. With `srcset`, you offer several sizes and let the browser pick:

```html
<img
	src="sunset-960.webp"
	srcset="sunset-480.webp 480w, sunset-960.webp 960w, sunset-1600.webp 1600w"
	sizes="(max-width: 600px) 100vw, 60vw"
	alt="An orange sun setting over a calm blue sea"
	width="960" height="540">
```

- `srcset` lists the files and how wide each one really is (`480w` means 480 pixels wide).
- `sizes` tells the browser how wide the image will be *displayed*: full screen width (`100vw`) on small screens, 60% of the screen otherwise.
- The browser combines those with the device's screen to choose the best file.

If that feels like a lot, that's completely normal. Most people copy this pattern the first dozen times they use it. The important idea is the T-shirt rack: offer sizes, let the browser choose.

## A different crop: `<picture>`

Sometimes a different *size* isn't enough. A wide landscape photo might need a tighter, taller crop on a phone so the subject doesn't turn into a speck. That's what `<picture>` is for:

```html
<picture>
	<source media="(max-width: 600px)" srcset="team-portrait.webp">
	<img src="team-wide.webp" alt="Our five-person team laughing in the office kitchen" width="1200" height="500">
</picture>
```

The browser checks each `<source>` in order and uses the first one that matches. The `<img>` inside is the fallback, and it's still where the `alt` lives.

## Which file format?

- **WebP** for photos. It's much smaller than JPG at the same quality and every modern browser supports it.
- **SVG** for logos, icons, and simple drawings. SVGs are made of shapes rather than pixels, so they stay crisp at any size.

## Try it

This preview uses a small drawing built right into the code, so there's no file to download.

<WebPlayground
	:panes="['html']"
	:initial-html="'<h2>Last Night of the Trip</h2>\n<img\n\tsrc=\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMzIwIDE4MCI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNmY2Q5YTgiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSIxMjAiIHI9IjQ4IiBmaWxsPSIjZjI4YzI4Ii8+PHJlY3QgeT0iMTIwIiB3aWR0aD0iMzIwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMmY2ZjhmIi8+PC9zdmc+\'\n\talt=\'An orange sun setting over a calm blue sea\'\n\twidth=\'320\'\n\theight=\'180\'>\n\n<p>Now break the image on purpose and see what happens:</p>\n<img src=\'missing-photo.webp\' alt=\'A missing photo of the beach at sunrise\' width=\'320\' height=\'180\'>'"
	preview-height="460px"
/>

## Try it yourself

1. Look at the second, broken image. The alt text shows up where the picture should be. That's exactly what someone on a bad connection would see.
2. Delete the `alt` from the broken image and run it again. Notice how much less helpful the page becomes.
3. Change the first image's `width` to `160` and `height` to `90`. Then try `width` `320` and `height` `90`. See how getting the shape wrong squashes the picture?

## Check your understanding

<Quiz
	question="What is the best alt text for a decorative border image that adds no meaning?"
	:options="['alt=border', 'alt=image', 'An empty alt attribute, with nothing between the quotes', 'Leave the alt attribute out entirely']"
	:answer-index="2"
	explanation="An empty alt tells screen readers to skip the image. Leaving alt out can make them read the file name aloud."
/>

<Quiz
	question="Why should you give an img a width and height?"
	:options="['To make the file smaller', 'So the browser can reserve space and the page does not jump while loading', 'Because src does not work without them', 'To improve the alt text']"
	:answer-index="1"
	explanation="Like reserving a seat, width and height let the browser save space before the image arrives."
/>

<Quiz
	question="Which image format is usually best for a company logo?"
	:options="['WebP', 'SVG', 'BMP', 'GIF']"
	:answer-index="1"
	explanation="Logos are simple shapes, and SVG keeps them crisp at any size."
/>

## Up next

Images are just the start. In [Audio, Video, and Figures](/lessons/html/audio-and-video) we'll add sound, moving pictures, and captions. And alt text is only one piece of making pages that work for everyone, which we'll go much deeper on in [Accessibility Basics](/lessons/html/accessibility-basics).
