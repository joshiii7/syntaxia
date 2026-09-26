---
title: "HTML Forms Basics: form, label, input, button"
description: "Forms are a conversation between your visitor and your site. Learn form, label, input types, the name attribute, and submit buttons, and why labels matter so much."
---

# Forms: The Basics

*Every other element talks at your visitor. A form lets them talk back.*

Think about everything you've built so far. Headings, paragraphs, images, tables. All of it is one-way: the page speaks, the visitor listens.

Forms change that. A form is a **conversation**. Your site asks a question ("What's your name?"), the visitor answers, and then your site responds. Login screens, search bars, checkout pages, "contact us" boxes, even the like button on a post: all conversations, all built on forms.

Let's learn to hold one.

## The whole conversation: `<form>`

```html
<form action="/subscribe" method="post">
	<label for="email">Your email address</label>
	<input type="email" id="email" name="email">

	<button type="submit">Subscribe</button>
</form>
```

The `<form>` element wraps the whole exchange. Its two main attributes say what happens when the visitor finishes answering:

- `action` is **where** the answers get sent, like the address on a reply envelope.
- `method` is **how** they get sent. `get` puts the answers right in the web address (fine for a search box, since you might want to bookmark the results). `post` tucks them inside the request, out of sight (the right choice for anything private, or anything that changes something, like signing up).

Where those answers actually go is a server, a program that receives the data and does something with it. That's a story for later in the book, in the backend tracks. For now, we're building the question side of the conversation.

## Asking a question: `<label>` + `<input>`

Every good question has two parts: the question itself, and a place to answer.

- `<label>` is the question: "Your email address."
- `<input>` is the blank line where the answer goes.

They're connected by matching the label's `for` to the input's `id`. That link is more important than it looks:

1. **Clicking the label focuses the input.** Try it in the preview below. That makes tiny checkboxes and radio buttons far easier to hit, especially on phones.
2. **Screen readers read the label aloud** when someone lands on the input. Without it, a blind visitor hears "edit text, blank." Edit text for *what*? Their name? Their card number? No idea.

## "Can't I just use a placeholder?"

You'll see this everywhere:

```html
<!-- Please don't -->
<input type="email" placeholder="Email address">
```

It looks clean, so the temptation is real. But a placeholder is a hint, not a label. It vanishes the moment someone starts typing, so if they get distracted halfway through, the question is gone. It's usually pale grey text that's hard to read, and some assistive tools don't treat it as a label at all.

It's like a waiter who asks you a question, then forgets it the moment you open your mouth. Use a real `<label>`. Keep placeholders for small example hints, like `placeholder="name@example.com"`.

## `name`: the label on the answer

When the form is sent, the browser packages up each answer with its `name`:

```
email=maria@example.com
```

Without a `name`, an input's answer is simply left out of the package. The visitor typed it, the form looked fine, and the data never arrived. If you ever build a form where one field mysteriously "doesn't send," check for a missing `name` first.

So you've now got three similar-looking attributes. Here's the quick way to keep them straight:

- `id` connects the input to its **label** on the page.
- `name` labels the **answer** when it's sent away.
- `for` (on the label) points to the input's `id`.

## Different questions, different inputs

The `type` attribute changes what kind of answer an input expects, and that changes a lot, especially on phones:

```html
<input type="text">      <!-- anything -->
<input type="email">     <!-- phone keyboards show an @ key -->
<input type="password">  <!-- hides what's typed -->
<input type="tel">       <!-- phones show a number pad -->
<input type="number">    <!-- up/down arrows for quantities -->
<input type="url">       <!-- for web addresses -->
<input type="date">      <!-- a date picker -->
<input type="search">    <!-- a search box -->
```

Picking the right type is like handing someone the right tool before they ask. A phone number field that pops up a number pad instead of the full keyboard? That's a small kindness your visitors will feel even if they never notice why.

## Ending the conversation: `<button>`

```html
<button type="submit">Subscribe</button>
```

A submit button sends the form off. Always write the `type`, because a `<button>` inside a form defaults to submitting, which surprises people when they add a button meant to do something else, like "Show password."

And make the button text say what will happen. "Subscribe," "Send message," "Create account." Not just "Submit." Would you trust a real person who ended every conversation with "Submit"?

## Try it

This preview is a sandbox, so pressing the button won't really send anything anywhere. Everything else works.

<WebPlayground
	:panes="['html']"
	:initial-html="'<form action=\'/subscribe\' method=\'post\'>\n\t<p>\n\t\t<label for=\'full-name\'>Your name</label><br>\n\t\t<input type=\'text\' id=\'full-name\' name=\'full-name\'>\n\t</p>\n\t<p>\n\t\t<label for=\'email\'>Your email address</label><br>\n\t\t<input type=\'email\' id=\'email\' name=\'email\' placeholder=\'name@example.com\'>\n\t</p>\n\t<p>\n\t\t<label for=\'birthday\'>Birthday (optional)</label><br>\n\t\t<input type=\'date\' id=\'birthday\' name=\'birthday\'>\n\t</p>\n\t<button type=\'submit\'>Subscribe to the newsletter</button>\n</form>'"
	preview-height="300px"
/>

## Try it yourself

1. Click the words "Your name" in the preview. The cursor jumps into the box. That's the label doing its job.
2. Change the `for` on the first label to `wrong-id` and click it again. The connection is broken.
3. Add a phone number question with the right `type`, a `label`, an `id`, and a `name`.

## Check your understanding

<Quiz
	question="How do you connect a label to an input?"
	:options="['Put them next to each other', 'Match the label for attribute to the input id', 'Give them the same class', 'Match the label name to the input name']"
	:answer-index="1"
	explanation="The label's for attribute must match the input's id. Then clicking the label focuses the input and screen readers read the label."
/>

<Quiz
	question="An input's value never arrives when the form is sent. What is the most likely cause?"
	:options="['It has no placeholder', 'It has no name attribute', 'It has no class', 'The label is too long']"
	:answer-index="1"
	explanation="Only inputs with a name are included in the submitted data."
/>

<Quiz
	question="Why is a placeholder not a good replacement for a label?"
	:options="['It disappears once the visitor starts typing', 'It makes the form submit twice', 'Browsers do not display it', 'It only works on email inputs']"
	:answer-index="0"
	explanation="The placeholder vanishes as soon as typing starts, and it is often hard to read and not treated as a label."
/>

## Up next

A conversation with only text answers gets dull fast. In [More Form Controls](/lessons/html/forms-part-2) you'll add dropdowns, checkboxes, and multiple-choice questions. Labels come back again in [Accessibility Basics](/lessons/html/accessibility-basics), where you'll see just how much they matter. And if the `id` versus `name` versus `for` difference is still blurry, a quick look back at [Attributes](/lessons/html/attributes) might help.
