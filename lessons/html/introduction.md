---
title: Introduction to HTML
description: What HTML is, who made it, why it exists, and what version we use today. No computer experience needed.
---

# Introduction to HTML

*Every page on the web is written in the same language. Let's meet it from the very beginning.*

Welcome. This is the very first lesson in this book, so we will not skip anything. We will not even assume you know what a "browser" is. Let's start from zero. By the end of this lesson, you'll know what HTML is, who made it and why, and which version we use today.

## What is a webpage, really

Right now, you are probably reading this page in a program on your computer or phone called a **browser**. A browser is just a program whose only job is to show you pages from the internet. Common browsers you may have heard of are Chrome, Safari, and Edge.

Every page you see in a browser, like this one, is built from a set of instructions. Those instructions tell the browser things like "put a big heading here" or "put a picture there." That set of instructions is written in a language called **HTML**.

Think of it like a recipe. A recipe does not cook the food itself. It just tells a cook what to do, step by step. HTML works the same way. It does not draw the page itself. It tells the browser what to draw, and the browser does the actual work of showing it on your screen.

## Who created HTML, and why

HTML was created by a man named **Tim Berners-Lee**, in the year **1991**. At the time, he worked at a science lab in Switzerland called **CERN**.

Here is the problem he was trying to solve. Scientists at CERN had thousands of documents saved on many different computers. If someone wanted to read a document that mentioned another document, there was no easy way to jump straight to it. You had to go find that other computer, and search for the right file by hand.

Berners-Lee had an idea. What if a document could contain a special kind of word or phrase that, when you clicked it, took you straight to another document? That clickable word is called a **link** (you will learn how to make one later in this book).

To make this idea work, he needed a simple language for writing documents that could contain these links. That language became HTML, which stands for **HyperText Markup Language**.

- "Hypertext" means text that can link to other text.
- "Markup" means adding little instructions inside a document to describe its parts, like a heading or a paragraph.

So in plain words: HTML is a simple way to write a document so that a browser knows how to display it, and so parts of it can link to other documents.

## How many versions has HTML had

Just like a phone or an app gets updated over time, HTML has changed a lot since 1991. Here is a short timeline.

| Version | Year | What happened |
|---|---|---|
| HTML (first version) | 1991 | Berners-Lee's original idea. Very basic, only about 18 tags. |
| HTML 2.0 | 1995 | The first version with an official written rulebook. |
| HTML 3.2 | 1997 | Added tables, among other things. |
| HTML 4.0 and 4.01 | 1997 and 1999 | Made CSS styling and scripts a proper part of HTML. |
| XHTML 1.0 | 2000 | A stricter version with tighter rules. |
| HTML5 | Started in 2004, finished in 2014 | A big update. Added many new tags and features that let browsers do much more. |
| HTML Living Standard | 2011 onward, the only official version since 2019 | The current version. It has no number. It just keeps slowly improving over time. |

## What version do we use today

Today, HTML does not use version numbers like "HTML6" anymore. Since 2019, there has been one official version, called the **HTML Living Standard**. Think of it like a wiki page that is never truly "finished." It keeps getting small updates and improvements, but it is always just called "HTML," with no number attached.

So when people today say "HTML5," they usually just mean "modern HTML," since that is the last named version, even though the standard has kept improving quietly since then.

## What you learned

- A browser is a program that shows you pages from the internet.
- HTML is a language made of instructions that tell a browser what to show and how to arrange it.
- HTML was created by Tim Berners-Lee in 1991, to let documents link to each other.
- HTML has had many versions. The current one has no number. It is called the HTML Living Standard.

## Check your understanding

<Quiz
	question="What is a browser?"
	:options="['A website that lists other websites', 'A program that shows you pages from the internet', 'The language pages are written in', 'A type of computer']"
	:answer-index="1"
	explanation="A browser, like Chrome, Safari, Firefox, or Edge, is the program that reads HTML and shows you the page."
/>

<Quiz
	question="What does the M in HTML stand for?"
	:options="['Machine', 'Markup', 'Media', 'Module']"
	:answer-index="1"
	explanation="HTML is HyperText Markup Language. Markup means adding little instructions to a document to describe its parts."
/>

<Quiz
	question="Which version of HTML do we use today?"
	:options="['HTML 4.01', 'XHTML 1.0', 'HTML6', 'The HTML Living Standard']"
	:answer-index="3"
	explanation="Since 2019 there has been one official HTML, the Living Standard. It has no version number and keeps improving over time."
/>

## Up next

Enough history. Time to see what HTML actually looks like, and write some yourself, in [Your First HTML File](/lessons/html/your-first-html-file).
