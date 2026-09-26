---
title: Intro to Python
description: Write your first Python variables and a print statement in a dedicated code editor.
---

# Intro to Python

Python doesn't need `<html>` scaffolding. You can print a value with a single line: `print("Hello, world!")`.

Use the editor below to practice. It's the same editor component the HTML lesson uses, just switched into Python mode (via CodeMirror's language support), syntax highlighting only for now.

<CodeEditor
	language="python"
	label="Python practice editor"
	min-height="180px"
	:model-value="'name = \'Ada\'\nprint(f\'Hello, {name}!\')\n'"
/>

::: info Running this code
This scaffold doesn't execute Python yet. See the project README for the client-side (Pyodide) vs. server-side (Judge0/Piston) trade-off and which one this book will adopt.
:::

## Check your understanding

<Quiz
	question="Which line correctly prints a greeting using an f-string?"
	:options="[
		'print(\'Hello, {name}!\')',
		'print(f\'Hello, {name}!\')',
		'echo f\'Hello, {name}!\'',
		'print(\'Hello, \' . name . \'!\')'
	]"
	:answer-index="1"
	explanation="An f-string is prefixed with f and evaluates {expressions} inside the string."
/>
