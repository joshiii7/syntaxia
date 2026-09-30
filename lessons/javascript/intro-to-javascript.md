---
title: "What Is JavaScript? Intro to Making Web Pages Interactive"
description: "Start the JavaScript track here. Learn what JavaScript is, where it came from, what it can do in the browser, and write your first lines in a live editor."
---

# What JavaScript Is and Why It Exists

*HTML built the house. CSS decorated it. Now we wire up the electricity.*

Take a moment and look at what you've built so far. In the HTML track you gave your profile page a solid structure. In the CSS track you gave it color, layout, and a dark mode. It looks great.

But try to make it *do* something. Click a button and have a menu slide open. Type in a form and see a friendly message appear. Remember that a visitor prefers dark mode the next time they come back. You can't. HTML and CSS describe what a page **is** and how it **looks**. Neither one can make it **react**.

That's the job of **JavaScript**, and it's the last of the three languages every web page is built from.

## The electrician

Remember the three trades from [Where HTML Meets CSS and JS](/lessons/html/html-meets-css-and-js)?

- **HTML** is the builder: walls, rooms, doors. The structure.
- **CSS** is the interior designer: paint, furniture, lighting. The look.
- **JavaScript** is the electrician: it wires the switches, so flicking one turns on a light and pressing the doorbell makes it ring. The **behavior**.

A switch on its own is just a piece of plastic on the wall. The wiring behind it is what makes something happen when you press it. JavaScript is that wiring.

## What JavaScript can do

Here's a taste of what you'll be able to build by the end of this track:

- **React to people.** Run code when someone clicks, types, scrolls, or presses a key.
- **Change the page.** Add, remove, and update any element, class, or piece of text, without reloading.
- **Check and remember things.** Validate a form with a helpful custom message, or save a visitor's theme choice for next time.
- **Talk to servers.** Load new content, like the latest products or comments, while the visitor stays on the page.

Almost every interactive thing you've ever used on a website, from a like button to a search box that suggests answers as you type, is JavaScript at work.

## Where it came from

In 1995, the web was mostly static documents. The company behind Netscape Navigator, the most popular browser at the time, wanted pages that could respond to visitors. They asked a programmer named **Brendan Eich** to create a small language for it, and he built the first version in about ten days.

It went through a couple of names (Mocha, then LiveScript) before launching as **JavaScript**. Here's a confusing detail worth clearing up right away: **JavaScript has nothing to do with Java.** Java was a popular language at the time, and the name was mostly a marketing decision. They're as related as "car" and "carpet."

In 1997, JavaScript was handed to a standards organization called Ecma International, which is why its official specification is called **ECMAScript**. You'll sometimes see versions written like "ES2015" or "ES6." The 2015 update was a big one, and it's where many modern features you'll learn come from, like `let`, `const`, and arrow functions. Since then, a new version comes out every year with smaller improvements.

Today, JavaScript runs in every web browser, and it runs outside the browser too, on servers and in tools, thanks to programs like Node.js (which has its own [track](/lessons/nodejs/introduction) in this book).

## Your first lines of JavaScript

Here's a line of JavaScript:

```js
console.log('Hello from JavaScript!');
```

- `console` is the browser's **console**, a message board for developers that visitors never see.
- `.log(...)` means "write this on the message board."
- `'Hello from JavaScript!'` is the message, a piece of text wrapped in quotes.
- The semicolon at the end finishes the instruction, like the period at the end of a sentence.

The console is where you'll check your work constantly. In a normal browser, it lives in the developer tools (right-click, **Inspect**, then the **Console** tab). The editors in this track have a **Console** panel built right in, just under the preview, so you can see your messages without opening anything.

And here's a line that changes the page itself:

```js
document.querySelector('#greeting').textContent = 'Welcome back, Maria!';
```

Read it out loud: "In the document, find the element with the id `greeting`, and set its text to 'Welcome back, Maria!'" You'll learn every piece of that in the DOM chapter. For now, notice that it uses the exact `#greeting` id selector you learned in CSS. JavaScript finds elements the same way CSS does.

## Try it

Edit the JavaScript, then press **Run** (or just pause typing for a moment). Watch the preview and the console.

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<h1 id=\'greeting\'>Hello!</h1>\n<p>This page has not been touched by JavaScript yet.</p>'"
	:initial-js="'console.log(\'Hello from JavaScript!\');\n\ndocument.querySelector(\'#greeting\').textContent = \'Welcome back, Maria!\';\n\nconsole.log(\'I just changed the heading.\');\n'"
	show-console
	preview-height="160px"
/>

## Try it yourself

1. Change the message inside `console.log(...)` to your own name, and run it.
2. Change the heading text to something else. The HTML still says "Hello!", but the page shows your text. JavaScript changed it after the page loaded.
3. Delete one of the quote marks and run it. The console shows an error in red, with the word "Error" in front. Read it, then put the quote back. (Getting comfortable with error messages now will save you hours later.)

## Check your understanding

<Quiz
	question="Which of the three web languages is responsible for behavior, like reacting to clicks?"
	:options="['HTML', 'CSS', 'JavaScript', 'JSON']"
	:answer-index="2"
	explanation="HTML is structure, CSS is appearance, and JavaScript is behavior: the wiring that makes things react."
/>

<Quiz
	question="What is the relationship between JavaScript and Java?"
	:options="['JavaScript is a smaller version of Java', 'They are unrelated languages with similar names', 'Java runs in browsers and JavaScript does not', 'They are the same language']"
	:answer-index="1"
	explanation="The name was mostly a marketing choice in 1995. The two languages are separate and work very differently."
/>

<Quiz
	question="Where does console.log('Hi') show its message?"
	:options="['On the web page, for visitors to read', 'In the browser console, for developers', 'In a pop-up box', 'In the page title']"
	:answer-index="1"
	explanation="console.log writes to the developer console. Visitors never see it unless they open the developer tools."
/>

## Up next

You've written your first JavaScript inside this editor. But how does JavaScript get into a *real* page, and when does it run? That's [Adding JavaScript to a Page](/lessons/javascript/adding-javascript).
