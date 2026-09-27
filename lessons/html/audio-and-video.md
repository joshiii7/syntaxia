---
title: "HTML Audio, Video, figure, and figcaption"
description: "Embed sound and video with the audio and video elements, add captions with track, offer fallback formats with source, and label media with figure and figcaption."
---

# Audio, Video, and Figures

*Your pages are about to start talking and moving. Let's make sure they do it politely.*

There was a time when putting a video on a web page meant installing a special plugin and praying it worked. Those days are gone. Today, sound and video are built right into HTML, and they work a lot like the images you just learned.

## Video: a TV with a remote

```html
<video src="baking-tutorial.webm" controls width="640" height="360">
	Sorry, your browser can't play this video.
	<a href="baking-tutorial.webm">Download it instead</a>.
</video>
```

Think of `<video>` as a TV you've set up on the page. By itself, it's a screen. The `controls` attribute is the remote: play, pause, volume, full screen. Leave `controls` off and your visitor gets a TV with no remote and no buttons. They're stuck waiting for you to decide when it plays. Not a nice feeling.

The text inside the element is a fallback, shown only by browsers that can't play video at all. These days that's rare, but a download link costs you nothing.

A few more attributes worth knowing:

- `poster="thumbnail.webp"` shows a still image before the video starts, like the cover of a DVD case.
- `muted` starts with the sound off.
- `loop` starts over when it ends.
- `autoplay` starts playing by itself.

## A word about autoplay

Picture walking into a quiet library and a TV blasts on as you pass. That's autoplaying video with sound. Most browsers now block it unless the video is also `muted`, and honestly, they're doing everyone a favor. Autoplay can drain mobile data, startle people, and seriously disrupt someone using a screen reader, who suddenly can't hear their own software over your video.

If you really need a video to autoplay (a silent background animation, say), make it `muted`, and still give people a way to pause it.

## Offering more than one format

Different browsers and devices have historically supported different video and audio formats. Rather than bet on one, you can offer a menu and let the browser order what it can handle:

```html
<video controls width="640" height="360" poster="baking-poster.webp">
	<source src="baking-tutorial.webm" type="video/webm">
	<source src="baking-tutorial.mp4" type="video/mp4">
	<track src="baking-captions-en.vtt" kind="captions" srclang="en" label="English">
	Sorry, your browser can't play this video.
</video>
```

Just like the `<picture>` element from [Images](/lessons/html/images), the browser reads the `<source>` list from top to bottom and uses the first one it can play. The `type` attribute lets it skip the ones it knows it can't handle without downloading them first.

## Captions: `<track>`

See that `<track>` line? It attaches a caption file (a plain text format called WebVTT, ending in `.vtt`) with the words spoken in the video, timed to appear on screen.

Captions aren't a nice extra. For people who are deaf or hard of hearing, they're the difference between understanding your video and not. And plenty of hearing people use them too: on a noisy bus, in a quiet office, or while learning a new language. When in doubt, caption it.

## Audio: the same idea, no screen

```html
<audio controls>
	<source src="podcast-episode-1.ogg" type="audio/ogg">
	<source src="podcast-episode-1.mp3" type="audio/mpeg">
	Your browser can't play audio. <a href="podcast-episode-1.mp3">Download the episode</a>.
</audio>
```

Everything you just learned about video applies here: `controls`, `source`, fallback content. For spoken audio like a podcast, consider linking to a written transcript nearby, for the same reasons captions matter for video.

## `<figure>` and `<figcaption>`: the museum placard

Walk through a museum and every painting has a little placard next to it: the title, the artist, a line of context. The painting and its placard belong together.

That's `<figure>`. It groups a piece of media with its caption:

```html
<figure>
	<img src="grandmas-kitchen.webp" alt="A small, sunny kitchen with a wooden table and copper pots" width="640" height="427">
	<figcaption>My grandmother's kitchen, where I learned to bake, around 1998.</figcaption>
</figure>
```

Notice the alt text and the caption do different jobs. The **alt** describes what the image looks like, for people who can't see it. The **caption** adds context everyone gets to read. They shouldn't just repeat each other.

A figure isn't only for images, either. Wrap a video, a code sample, a chart, or even a quote in one whenever it's a self-contained piece your main text refers to ("as you can see in the chart below...").

## Try it

The video file here doesn't really exist, so it won't play, but you'll see the player, its poster image, and its controls.

<WebPlayground
	:panes="['html']"
	:initial-html="'<figure>\n\t<video controls width=\'320\' height=\'180\' poster=\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiB2aWV3Qm94PSIwIDAgMzIwIDE4MCI+PHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9IiMxZjI5MzciLz48cG9seWdvbiBwb2ludHM9IjE0MCw2MCAxNDAsMTIwIDE5MCw5MCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==\'>\n\t\t<source src=\'baking-tutorial.webm\' type=\'video/webm\'>\n\t\tSorry, your browser can\'t play this video.\n\t</video>\n\t<figcaption>How to knead bread dough, in under two minutes.</figcaption>\n</figure>\n\n<figure>\n\t<audio controls>\n\t\t<source src=\'podcast-episode-1.mp3\' type=\'audio/mpeg\'>\n\t</audio>\n\t<figcaption>Episode 1: Why I started baking.</figcaption>\n</figure>'"
	preview-height="380px"
/>

## Try it yourself

1. Remove `controls` from the video and run it. How would a visitor start it now?
2. Add a `<track>` line to the video for English captions, using the pattern above.
3. Wrap a quote from [Emphasis, Quotes, and Code](/lessons/html/text-formatting) (a `<blockquote>`) inside a `<figure>` with a `<figcaption>` naming who said it.

## Check your understanding

<Quiz
	question="Which attribute gives a video its play, pause, and volume buttons?"
	:options="['autoplay', 'controls', 'buttons', 'player']"
	:answer-index="1"
	explanation="controls is the remote for your TV. Without it, the visitor has no built-in way to play or pause."
/>

<Quiz
	question="Which element adds captions to a video?"
	:options="['<caption>', '<figcaption>', '<track>', '<subtitle>']"
	:answer-index="2"
	explanation="track attaches a timed text file, such as captions, to a video."
/>

<Quiz
	question="What is the difference between alt text and a figcaption?"
	:options="['There is no difference', 'alt describes what the image looks like; figcaption adds context for everyone', 'figcaption is only for screen readers', 'alt is shown under the image']"
	:answer-index="1"
	explanation="alt replaces the image for people who cannot see it. The caption is visible context that everyone reads."
/>

## Up next

Media makes a page rich. Data makes it useful. Next up: [Tables](/lessons/html/tables), and just as important, when *not* to use them. And in [iframes and Embedding](/lessons/html/iframes-and-embedding), you'll learn how to drop in videos hosted on other sites, like YouTube.
