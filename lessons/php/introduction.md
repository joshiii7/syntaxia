---
title: "What Is PHP? An Introduction to PHP for Beginners"
description: "Find out what PHP is, how it builds web pages on a server, where it came from, and why it still powers a huge share of the web, from WordPress to Wikipedia."
---

# What PHP Is and Why It's Used

*A restaurant menu shows the dishes. The kitchen, out of sight, is where they're actually made. PHP is the kitchen of the web.*

Welcome to the PHP track. If you've worked through [HTML](/lessons/html/introduction), [CSS](/lessons/css/intro-to-css), and [JavaScript](/lessons/javascript/intro-to-javascript) on this site, you've built pages that live in the browser. Every visitor gets the same HTML file, and JavaScript makes it interactive once it arrives.

PHP works somewhere else: on the **server**, the computer that sends pages to the browser. It builds each page *before* it's sent, so a page can be different for every visitor: your name, your shopping cart, today's news, the results of your search.

## The kitchen behind the menu

In a restaurant, you see the dining room and the menu. You don't see the kitchen. When you order, the kitchen makes your dish, fresh, just for you, then brings out the finished plate. You never see the recipe or the chopping; you just get the meal.

The web works the same way:

- The **browser** is the dining room. It shows whatever arrives.
- The **server** is the kitchen. That's where PHP runs.
- A **page** is the finished plate: plain HTML, CSS, and JavaScript, made fresh for each request.

A visitor never sees your PHP code. They only see the HTML it produced.

## What PHP adds

A plain HTML file is the same for everyone who opens it. With PHP, one file can produce a different page every time:

```php
<p>Today is <?php echo date("l"); ?>.</p>
```

On a Monday, that sends `<p>Today is Monday.</p>` to the browser. On Tuesday, it sends Tuesday. You'll see exactly how that works in [Mixing PHP and HTML](/lessons/php/php-and-html).

And because PHP runs on the server, it can do things that browser JavaScript can't safely do:

- **Read and save to a database**, like the ones in the [SQLite3 track](/lessons/sqlite3/introduction), to remember users, posts, and orders.
- **Handle forms**: receive what someone typed, check it, and save it.
- **Keep secrets**: passwords and keys stay on the server, never sent to the browser.
- **Remember visitors** between pages, so they stay logged in.

## Where PHP came from

PHP was created in 1994 by **Rasmus Lerdorf**, a programmer who wrote a few small tools to track visits to his online résumé. He called them "Personal Home Page Tools." Other people found them useful, and they grew into a full programming language.

Today, the name officially stands for **PHP: Hypertext Preprocessor**. (Yes, the "P" in PHP stands for PHP. Programmers call that a recursive acronym, and they find it very funny.) It's free, open source, and developed by a large community. A new version comes out every year; this track uses **PHP 8**.

## Where you'll find PHP today

PHP is one of the most widely used languages on the web:

- **WordPress**, which runs a huge share of all websites, from personal blogs to news sites, is written in PHP. The [WordPress track](/lessons/wordpress/introduction) builds on this one.
- **Wikipedia** runs on PHP.
- **Facebook** was originally built with PHP.
- **Laravel**, a popular framework for building web apps, is PHP. The [Laravel track](/lessons/laravel/introduction) builds on this one too.

If you've ever filled in a contact form, logged in to a forum, or browsed an online store, there's a good chance PHP was working behind it.

## Why learn PHP?

- **It's made for the web.** PHP and HTML mix naturally, so you can make a real, dynamic page in your very first lesson.
- **It's everywhere.** Almost every web host supports it, and a huge number of existing sites use it, so PHP skills are in steady demand.
- **It's forgiving to start.** You can begin with a few lines and grow from there.
- **Modern PHP is good.** PHP had a reputation for messy code in its early years. Modern PHP, from version 7 onward, is fast, has real types, and supports clean, well-organized code. This track teaches the modern way.

The trade-off: PHP is mostly used for the server side of websites. For other kinds of programs, like phone apps or data analysis, other languages, such as [Python](/lessons/python/intro-to-python), are a more common choice.

## Try it

Here's a small PHP page. You don't need to understand every part yet. Read it, and predict the HTML that PHP sends to the browser.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="240px"
	:model-value="'&lt;?php\n$name = &quot;Maria&quot;;\n$lessons = 34;\n?&gt;\n&lt;h1&gt;Welcome, &lt;?= $name ?&gt;!&lt;/h1&gt;\n&lt;p&gt;The PHP track has &lt;?= $lessons ?&gt; lessons.&lt;/p&gt;\n&lt;p&gt;That\'s &lt;?= $lessons * 2 ?&gt; if you do each one twice.&lt;/p&gt;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. In [Setting Up](/lessons/php/setting-up), you'll install PHP on your own computer, so you can run pages like this one yourself.
:::

::: details Check your prediction
```text
<h1>Welcome, Maria!</h1>
<p>The PHP track has 34 lessons.</p>
<p>That's 68 if you do each one twice.</p>
```

The code between `<?php` and `?>` sets two variables and sends nothing. Each `<?= ... ?>` is replaced by a value: the name, the number, and a calculation. The browser only ever receives this finished HTML.
:::

## Try it yourself

1. Change `$name` to your own name. What would the first line of the HTML say now?
2. Add a line to the page that says how many lessons are left if you've finished 5 of them, using `<?= ... ?>`.
3. Think of a website you use every day. What parts of it are probably different for each visitor, and so probably built on a server?

## Check your understanding

<Quiz
	question="Where does PHP code run?"
	:options="['In the visitor\'s browser', 'Only on phones', 'On the server, before the page is sent', 'Inside the CSS file']"
	:answer-index="2"
	explanation="PHP runs on the server. It builds the page, and the browser only receives the finished HTML."
/>

<Quiz
	question="What does a visitor see if they view the source of a PHP page?"
	:options="['Only the finished HTML', 'The PHP code', 'The server\'s password', 'Nothing']"
	:answer-index="0"
	explanation="The PHP runs first and is replaced by its output, so the browser never receives the PHP itself."
/>

<Quiz
	question="Which of these is written in PHP?"
	:options="['Microsoft Word', 'The Chrome browser', 'Android', 'WordPress']"
	:answer-index="3"
	explanation="WordPress, which runs a huge share of the web, is written in PHP. So are Wikipedia and many other big sites."
/>

## Up next

You know what PHP is. Now let's get it onto your computer, in [Setting Up](/lessons/php/setting-up).
