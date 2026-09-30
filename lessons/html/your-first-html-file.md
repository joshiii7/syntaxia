---
title: What is a Tag, and Your First HTML File
description: What an HTML tag is, and how to write and view your very first HTML file.
---

# Your First HTML File

*A few angle brackets in a plain text file, and you've made a web page.*

In the last lesson, you learned that HTML is a set of instructions for a browser. In this lesson, you will learn what those instructions actually look like, and you will write your first one.

## What is a "file"

Before we go further, let's clear up one word. A **file** is just a saved piece of information on a computer, given a name, like `photo.jpg` or `notes.txt`. Think of your computer's storage like a filing cabinet. Each drawer is a folder, and each piece of paper inside a drawer is a file.

An HTML file is simply a text file whose name ends in `.html`. When a browser opens a file with that ending, it knows to read it as HTML instructions instead of showing it as plain text.

## What is a "tag"

A **tag** is a small instruction written inside angle brackets, like this: `<h1>`.

Think of a tag like a label you tie onto something to say what it is. If you put a tag on a piece of luggage that says "fragile," you are telling everyone who touches it "be careful with this one." An HTML tag works the same way. It tells the browser what kind of thing is inside it.

Most tags come in pairs: an opening tag and a closing tag.

```html
<h1>Hello, world!</h1>
```

- `<h1>` is the **opening tag**. It means "a big heading starts here."
- `Hello, world!` is the actual content, the words you want shown.
- `</h1>` is the **closing tag**. It is the same word as the opening tag, but with a forward slash before it. It means "the big heading ends here."

Together, the opening tag, the content, and the closing tag are called an **element**.

## Try it

Here is a real HTML editor, built right into this page. Nothing to install. Type some HTML in the editor, and the page it makes appears in the preview below it.

<WebPlayground
	:panes="['html']"
	:initial-html="'<h1>Hello, world!</h1>\n<p>This is my first HTML file.</p>'"
/>

Try changing the words inside the `<h1>` tag. The preview updates a moment after you stop typing, or press **Run** to update it right away.

## How to make a real HTML file on your own computer

You do not need to do this to continue the book. The editor above already lets you practice. But here is how you would do it for real, on your own computer, whenever you are ready.

1. Open a plain text editor. This is a program for writing text with no special formatting, like Notepad on Windows, or TextEdit on a Mac (set to "plain text" mode). If you already installed an IDE from the earlier lesson on them, that works too, and is what most developers actually use.
2. Type some HTML, like the example above.
3. Save the file, and name it something like `index.html`. The important part is the `.html` at the end.
4. Find that saved file, and double click it. It should open in your browser, showing your page.

That is it. No internet connection needed, no special software. A browser can open an HTML file straight from your own computer.

## Try it yourself

In the editor above, add a second paragraph introducing yourself. Something like `<p>My name is Alex.</p>`. Press **Run** to see it appear.

## Check your understanding

<Quiz
	question="What is the closing tag for <h1>?"
	:options="['<h1>', '</h1>', '<end h1>', '<h1 end>']"
	:answer-index="1"
	explanation="A closing tag repeats the same word as the opening tag, but with a forward slash right after the angle bracket."
/>

<Quiz
	question="What do you call an opening tag, its content, and its closing tag together?"
	:options="['A file', 'An element', 'A browser', 'A folder']"
	:answer-index="1"
	explanation="The whole unit, from the opening tag to the closing tag, is an element."
/>

<Quiz
	question="Which part of a file name tells the browser to read it as HTML?"
	:options="['The first letter', 'The .html ending', 'The folder it is in', 'Its size']"
	:answer-index="1"
	explanation="A file whose name ends in .html is read as HTML instructions instead of plain text."
/>

## What you learned

- A file is a saved piece of information with a name, stored on your computer.
- An HTML file is a text file that ends in .html.
- A tag is a labeled instruction written in angle brackets, like `<h1>`.
- Most tags come in pairs: an opening tag and a closing tag.
- An opening tag, its content, and its closing tag together are called an element.

## Up next

You can write a heading and a paragraph. Next, you'll see the full skeleton every real page is built on, in [Anatomy of an HTML Document](/lessons/html/basic-structure).
