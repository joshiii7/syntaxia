---
title: Intro to JavaScript
description: Make a page respond and change after it loads, using JavaScript to read and update the DOM.
---

# Intro to JavaScript

HTML describes structure and CSS describes appearance, but neither can make a page *do* anything after it loads. **JavaScript** is the language that runs inside the browser and can change the page in response to code (or, eventually, in response to clicks, typing, and other events).

The example below finds an element already on the page (by its `id`) and changes its text:

```js
document.getElementById('output').textContent = 'Hello from JavaScript!';
```

- `document` is the browser's entry point to the page's DOM.
- `getElementById('output')` finds the one element whose `id="output"`.
- `.textContent = '...'` replaces whatever text was inside it.

## Try it

The HTML below is fixed; edit the JavaScript pane and press **Run** to see its effect on the `output` box in the preview.

<WebPlayground
	:panes="['javascript']"
	:initial-html="'<h1>JavaScript Playground</h1>\n<div id=\'output\'>Output will appear here.</div>'"
	:initial-js="'document.getElementById(\'output\').textContent = \'Hello from JavaScript!\';'"
/>

## Try it yourself

Change the message, then try setting `document.body.style.background` to a color of your choice. Press **Run** to check the result.

## Check your understanding

<Quiz
	question="What does document.getElementById('output') do?"
	:options="[
		'Creates a new element with that id',
		'Finds the existing element with that id',
		'Deletes the element with that id',
		'Changes the id of the page'
	]"
	:answer-index="1"
	explanation="getElementById looks up and returns the single existing element with a matching id, so you can then read or change it."
/>
