---
title: "How HTML Connects to CSS and JavaScript"
description: "See how HTML hands off to CSS and JavaScript: linking stylesheets and scripts, using classes and ids as hooks, and why keeping the three languages separate pays off."
---

# Where HTML Meets CSS and JS

*HTML builds the house. CSS decorates it. JavaScript wires up the electricity. Here's how they meet.*

All through this track I've been saying things like "that's a job for CSS" and "you'll do that with JavaScript later." Maybe it started to feel like I was dodging. This lesson is the payoff: how HTML actually connects to its two partner languages, so you walk into the CSS track already knowing where everything plugs in.

## Three trades, one house

Think about building a house.

- **The builders** put up the walls, the rooms, the doors, the windows. The structure. That's **HTML**.
- **The interior designer** picks the paint, the furniture, the lighting, where the sofa goes. The look. That's **CSS**.
- **The electrician** wires up the switches so that flicking one turns on a light, or pressing the doorbell makes it ring. The behavior. That's **JavaScript**.

Each trade needs the others. A designer can't paint a wall that isn't built, and an electrician can't wire a switch into thin air. But they also shouldn't do each other's jobs. You don't want the builder deciding the sofa color, or the electrician knocking down walls.

That's the key idea of modern web development: **structure, style, and behavior stay separate**, and they connect through a few well-defined points. Let's look at those points.

## Connecting CSS: `<link>`

CSS lives in its own file, usually something like `styles.css`. You connect it from the `<head>`:

```html
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Maria's Bakery</title>
	<link rel="stylesheet" href="styles.css">
</head>
```

`rel="stylesheet"` says what kind of file this is. `href` says where it lives, using the same relative paths you learned in [Links and Navigation](/lessons/html/links).

Why a separate file? Because one stylesheet can dress up every page on your site. Change the brand color in one place, and all fifty pages update. It's the difference between repainting one master color swatch and repainting fifty rooms by hand.

(You can also write CSS inside a `<style>` element in the head. Fine for a quick experiment, but a separate file is the professional default.)

## The hooks: elements, classes, and ids

How does CSS know *which* elements to decorate? It uses the labels you've been putting on everything:

```css
/* Every paragraph */
p {
	line-height: 1.6;
}

/* Everything on the "price" team */
.price {
	color: #2f6f8f;
	font-weight: bold;
}

/* The one element named "special-offer" */
#special-offer {
	border: 2px dashed #f28c28;
}

/* Links anywhere inside a nav */
nav a {
	text-decoration: none;
}
```

Look closely, because you already understand all of this:

- `p` matches an element by its tag name.
- `.price` (with a dot) matches the `class` you learned in [Attributes](/lessons/html/attributes). The team jersey.
- `#special-offer` (with a hash) matches an `id`. The name tag.
- `nav a` means "links inside a nav," which uses the family tree from [Nesting and the DOM](/lessons/html/nesting-and-the-dom).

Those "why bother?" moments, when you added a class that didn't do anything visible, or learned parent and child relationships? This is why. You were labeling the house so the designer could find every room.

## Connecting JavaScript: `<script>`

JavaScript also lives in its own file, connected with a `<script>` element:

```html
<head>
	<link rel="stylesheet" href="styles.css">
	<script src="app.js" defer></script>
</head>
```

That `defer` attribute is important. Browsers read HTML from top to bottom. Without `defer`, the browser would stop building the page the moment it reached the script, fetch it, run it, and only then carry on. It's like the electrician insisting on wiring the switches before the walls are up. With `defer`, the browser downloads the script in the background and runs it only once the whole page is built, so the walls exist when the wiring happens.

Once running, JavaScript uses the very same hooks as CSS to find elements, then changes them in response to what the visitor does:

```js
const button = document.querySelector('#show-offer');
const offer = document.querySelector('#special-offer');

button.addEventListener('click', () => {
	offer.hidden = false;
});
```

Read it out loud: "Find the element named show-offer. Find the element named special-offer. When the button is clicked, stop hiding the offer." That `hidden` is the same global attribute from [Attributes Deep Dive](/lessons/html/attributes-deep-dive). JavaScript is just flipping switches on the HTML you wrote.

## Why the separation matters

It might seem simpler to mix everything together in one file: some styles on the elements, a bit of script in an `onclick`. And for a ten-line experiment, it is. But on a real site:

- **A designer can restyle everything without touching the HTML.** Same structure, new look.
- **Pages load faster**, because the browser saves (caches) your CSS and JS files and reuses them on every page instead of downloading them again.
- **Bugs are easier to find.** Something looks wrong? Check the CSS. Something *does* the wrong thing? Check the JavaScript. The content is wrong? Check the HTML.
- **Your page still works if something fails.** If a script fails to load on a slow connection, well-built HTML still shows the content, and the links and forms still work. That idea, a solid HTML base with style and behavior layered on top, is called **progressive enhancement**. It's how professionals build things that don't fall apart.

## Try it: all three together

This editor has been an HTML-only playground for most of the track. Here are all three panes working together.

<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<h1>Maria\'s Bakery</h1>\n<p>Fresh sourdough, <span class=\'price\'>$8</span> a loaf.</p>\n\n<button type=\'button\' id=\'show-offer\'>Show today\'s offer</button>\n\n<p id=\'special-offer\' hidden>Buy two loaves, get a cinnamon roll free!</p>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n}\n\n.price {\n\tcolor: #2f6f8f;\n\tfont-weight: bold;\n}\n\n#special-offer {\n\tborder: 2px dashed #f28c28;\n\tpadding: 8px;\n}\n'"
	:initial-js="'const button = document.querySelector(\'#show-offer\');\nconst offer = document.querySelector(\'#special-offer\');\n\nbutton.addEventListener(\'click\', () => {\n\toffer.hidden = false;\n});\n'"
	preview-height="260px"
/>

## Try it yourself

1. Press the button. The HTML was there all along; JavaScript just removed `hidden`.
2. In the CSS pane, change the `.price` color to any color you like. Then add `class="price"` to another word in the HTML. It picks up the same style.
3. Delete everything in the CSS and JavaScript panes. The page still has all its content. That's progressive enhancement in action.

## Check your understanding

<Quiz
	question="Which element connects an external CSS file to your page?"
	:options="['<style src=styles.css>', '<link rel=stylesheet href=styles.css>', '<css href=styles.css>', '<script src=styles.css>']"
	:answer-index="1"
	explanation="A link element with rel=stylesheet in the head connects an external CSS file."
/>

<Quiz
	question="In CSS, how do you select every element with class=price?"
	:options="['#price', '.price', 'price', '*price']"
	:answer-index="1"
	explanation="A dot selects by class. A hash selects by id. A plain word selects by tag name."
/>

<Quiz
	question="What does the defer attribute on a script do?"
	:options="['Deletes the script', 'Runs the script only after the page has been fully built', 'Runs the script twice', 'Hides the script from visitors']"
	:answer-index="1"
	explanation="defer downloads the script in the background and runs it after the HTML is parsed, so the elements it needs already exist."
/>

## Up next

That's everything. Every piece of the HTML track is now in your hands. There's just one thing left to do: build something real with all of it. Head to [Final Project: Your Profile Page](/lessons/html/final-project). After that, the [CSS track](/lessons/css/intro-to-css) is waiting.
