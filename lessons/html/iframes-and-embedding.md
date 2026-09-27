---
title: "HTML iframes: Embedding Videos, Maps, and More"
description: "Embed YouTube videos, maps, and other pages with iframe, give every frame a title, load it lazily, and lock it down safely with the sandbox and allow attributes."
---

# iframes and Embedding

*An iframe is a window in your wall that looks into somebody else's house.*

Here's a secret: you've been using an iframe this entire book. Every live preview under every code editor in Syntaxia is an iframe, a whole separate little web page sitting inside this one. Now you get to learn how they work.

## A window into another house

Picture a window cut into the wall of your living room. Through it you can see right into your neighbor's house. You chose where the window goes and how big it is. But what happens *inside* that house? That's up to your neighbor. You can't rearrange their furniture, and they (hopefully) can't climb through into yours.

That's an `<iframe>` (inline frame). It displays a completely separate web page inside your page:

```html
<iframe
	src="https://www.youtube.com/embed/VIDEO_ID"
	title="How to shape a sourdough loaf, video tutorial"
	width="560"
	height="315"
	loading="lazy"
	allow="fullscreen; picture-in-picture"
	referrerpolicy="strict-origin-when-cross-origin">
</iframe>
```

When YouTube, Google Maps, Spotify, or a payment form offers you a "share" or "embed" code, it's almost always an iframe like this one. The page inside the frame is theirs, running on their website. You're just making the window.

## The attributes that matter

- **`src`**: the address of the page to show through the window.
- **`title`**: easy to forget, and important. A screen reader user landing on an iframe hears its title. Without one, they get "frame" and have to go in blind. Describe what's inside: "Map of our café on Rizal Street," not "iframe" or "map."
- **`width` and `height`**: the size of the window. Same seat-reserving idea as images, so the page doesn't jump when it loads.
- **`loading="lazy"`**: embedded pages can be heavy. A single video embed may pull in a lot of extra code. Lazy loading waits until the visitor scrolls near it, exactly like you learned in [Images](/lessons/html/images).

## Locking the window: `sandbox` and `allow`

Now the security part. When you embed a page, you're letting someone else's code run inside yours. Most of the time that's fine. But what if the neighbor turns out to be sketchy?

The **`sandbox`** attribute puts bars on the window. Add it with no value and the framed page loses almost every power: no scripts, no forms, no popups, no navigating your page away. Then you hand back only the permissions it actually needs:

```html
<iframe
	src="https://widgets.example.com/weather"
	title="Five-day weather forecast"
	sandbox="allow-scripts"
	width="400"
	height="200">
</iframe>
```

That's exactly how Syntaxia's live previews work: `sandbox="allow-scripts"`. The code you type can run, but it can't reach out and mess with the lesson page around it. It's also why, back in [Forms: The Basics](/lessons/html/forms-part-1), our preview wouldn't actually submit forms. The permission to submit simply wasn't granted.

The **`allow`** attribute is a similar idea for device features: things like fullscreen, the camera, the microphone, or location. Only allow what the embed genuinely needs. A video player needs fullscreen. It doesn't need your visitor's microphone.

## "Why won't this website show up in my iframe?"

At some point you'll try to embed a big site, maybe your bank or a news homepage, and get an empty box or an error. That's not your bug. That site has told browsers "don't let anyone put me in a frame."

Why would they? Because of a trick called **clickjacking**, where a shady page shows a real site in an invisible frame and fools you into clicking its buttons. Think of a fake window painted over a real one. So many sites simply refuse to be framed, and that's their right. Use their official embed code if they offer one.

## `srcdoc`: a tiny page written inline

Instead of a web address, you can write the framed page's HTML directly in the `srcdoc` attribute:

```html
<iframe srcdoc="<p>Hello from inside the frame!</p>" title="A small demo frame"></iframe>
```

You won't need this often. But it's handy for demos and previews, and it's the same trick this book's editors use to show your code.

## Should you embed at all?

Embeds are convenient, but each one is a window into a house you don't control. It can be slow, it can track your visitors, and it can disappear if the other site changes things. Ask yourself: "Could a plain link do the job?" Sometimes "Watch the video on YouTube" beats a heavy embed that slows down the whole page. And for your own video files, the built-in `<video>` element from [Audio, Video, and Figures](/lessons/html/audio-and-video) is often the better choice.

## Try it

A real YouTube or map embed needs an internet connection and the other site's permission, so this preview uses `srcdoc` frames. Yes, that's an iframe inside an iframe. Windows inside windows.

<WebPlayground
	:panes="['html']"
	:initial-html="'<h2>Our Café</h2>\n<p>Here is a little frame with its own separate page inside:</p>\n\n<iframe\n\ttitle=\'Opening hours for the café\'\n\twidth=\'300\'\n\theight=\'120\'\n\tsandbox\n\tsrcdoc=\'<h3>Opening hours</h3><p>Monday to Friday, 7am to 5pm</p>\'>\n</iframe>\n\n<p>Try adding a second frame below.</p>'"
	preview-height="320px"
/>

## Try it yourself

1. Change the `width` and `height` of the frame and see the window resize.
2. Add a second iframe with its own `srcdoc` and a descriptive `title`.
3. Go to YouTube, open any video, choose **Share**, then **Embed**, and read the code it gives you. Can you spot `src`, `title`, `width`, `height`, and `allow`?

## Check your understanding

<Quiz
	question="Why does every iframe need a title attribute?"
	:options="['It changes the browser tab text', 'Screen readers announce it so people know what the frame contains', 'It is required for the frame to load', 'It sets the frame border']"
	:answer-index="1"
	explanation="The title tells screen reader users what is inside the frame before they enter it."
/>

<Quiz
	question="What does adding sandbox with no value do?"
	:options="['Removes almost all permissions from the framed page', 'Makes the frame bigger', 'Allows everything', 'Hides the frame']"
	:answer-index="0"
	explanation="An empty sandbox locks the frame down. You then add back only the permissions it needs, like allow-scripts."
/>

<Quiz
	question="A big website refuses to appear in your iframe. What is the most likely reason?"
	:options="['You forgot the width', 'The site has chosen not to allow framing, to prevent clickjacking', 'iframes only work with videos', 'Your title is too long']"
	:answer-index="1"
	explanation="Many sites tell browsers not to display them inside frames, which protects their users from clickjacking."
/>

## Up next

Next up are three built-in elements that do things you'd normally expect to need JavaScript for: expanding sections, pop-up dialogs, and reusable templates. That's [details, dialog, and template](/lessons/html/details-dialog-and-template).
