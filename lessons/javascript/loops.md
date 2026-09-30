---
title: "JavaScript Loops: for, for...of, while, break, continue"
description: "Repeat code with for, for...of, and while loops, stop early with break, skip items with continue, and avoid infinite loops and off-by-one mistakes."
---

# Loops

*A loop is a baker shaping loaves: same steps, over and over, until the dough runs out.*

Imagine you've been asked to shape fifty bread rolls. You wouldn't write fifty separate sets of instructions. You'd write one: "take some dough, roll it, place it on the tray," and then repeat it until the tray is full.

Computers are wonderful at exactly that kind of repetition, and a **loop** is how you ask for it. Counting down to a sale, going through every item in a cart, printing every day of the week: all loops.

## The `for` loop: counting

```js
for (let i = 1; i <= 5; i++) {
	console.log(`Shaping roll number ${i}`);
}
```

That first line packs three instructions into the parentheses, separated by semicolons:

1. **Start:** `let i = 1` creates a counter. (`i` is a traditional name for a counter, short for "index.")
2. **Keep going while:** `i <= 5` is checked before every lap. When it's false, the loop stops.
3. **After each lap:** `i++` adds one to the counter.

Then the block in curly braces runs once per lap. The result: five lines, numbered 1 to 5.

You can count in any direction:

```js
for (let seconds = 3; seconds > 0; seconds--) {
	console.log(seconds);
}
console.log('The oven is open!');
```

## Off by one

The most common loop bug in the world has its own name: **off by one**. Look at these two:

```js
for (let i = 0; i < 5; i++) { /* runs 5 times: 0, 1, 2, 3, 4 */ }
for (let i = 0; i <= 5; i++) { /* runs 6 times: 0, 1, 2, 3, 4, 5 */ }
```

One character, `<` versus `<=`, changes how many laps you get. When your loop does one too many or one too few, check the start number and the comparison first. (You'll see in [Arrays](/lessons/javascript/arrays) why counting from 0 is so common.)

## `for...of`: going through a list

Most of the time, you don't actually want to count. You want to do something with **every item** in a list. `for...of` does that directly:

```js
const breads = ['Sourdough', 'Rye', 'Focaccia'];

for (const bread of breads) {
	console.log(`Today's bread: ${bread}`);
}
```

Read it as "**for** each `bread` **of** the `breads` list, do this." No counter, no off-by-one risk. On each lap, `bread` holds the next item. (Those square brackets make a list, called an **array**, which gets its own lesson soon. `for...of` also works on strings, one character at a time.)

When you just need every item, prefer `for...of` over a counting `for` loop. It says what you mean.

You'll also see `for...in` in older code. It looks similar, but it loops over an object's **keys**, as strings, rather than its values, and it can pick up extra properties you didn't expect. For lists, use `for...of`. For objects, [Objects](/lessons/javascript/objects) shows a cleaner way.

## `while`: repeat until something changes

Sometimes you don't know in advance how many laps you'll need. You just know when to stop.

```js
let dough = 1000;   // grams
let rolls = 0;

while (dough >= 80) {
	dough -= 80;    // each roll uses 80 grams
	rolls++;
}

console.log(`Made ${rolls} rolls, with ${dough} grams left over.`);
```

"**While** there's enough dough for another roll, make one." The condition is checked before every lap, and the loop stops the moment it's false.

## The infinite loop

Here's the danger with `while`: if the condition never becomes false, the loop never stops.

```js
let dough = 1000;
let rolls = 0;
while (dough >= 80) {
	rolls++;   // oops: we forgot to use up any dough
}
```

The dough never shrinks, so this runs forever. The page freezes, and eventually the browser offers to stop the script. Everyone writes one of these at some point. When a page suddenly hangs, check your loops for a condition that can never change.

## `break` and `continue`

Two keywords let you steer a loop from inside:

```js
const breads = ['Sourdough', 'Rye', 'SOLD OUT', 'Focaccia', 'Brioche'];

for (const bread of breads) {
	if (bread === 'SOLD OUT') {
		continue;   // skip this one, go to the next lap
	}
	if (bread === 'Brioche') {
		break;      // stop the whole loop right now
	}
	console.log(bread);
}
// Sourdough, Rye, Focaccia
```

- `continue` skips the rest of the current lap and moves on to the next one.
- `break` leaves the loop entirely, like the `break` you used in `switch`.

`break` is perfect for searching: once you've found what you're looking for, there's no need to check the rest.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<h2>Today\'s breads</h2>\n<ul id=\'menu\'></ul>'"
	:initial-js="'// Counting down\nfor (let seconds = 3; seconds > 0; seconds--) {\n\tconsole.log(seconds);\n}\nconsole.log(\'The oven is open!\');\n\n// Going through a list and building the page\nconst breads = [\'Sourdough\', \'Rye\', \'SOLD OUT\', \'Focaccia\'];\nconst menu = document.querySelector(\'#menu\');\n\nfor (const bread of breads) {\n\tif (bread === \'SOLD OUT\') {\n\t\tcontinue;\n\t}\n\tmenu.innerHTML += `<li>${bread}</li>`;\n}\n\n// Repeating until something changes\nlet dough = 1000;\nlet rolls = 0;\nwhile (dough >= 80) {\n\tdough -= 80;\n\trolls++;\n}\nconsole.log(`Made ${rolls} rolls, with ${dough} grams left over.`);\n'"
	show-console
	preview-height="160px"
/>

(That `innerHTML +=` line is a quick way to add list items for this demo. In [Creating and Removing Elements](/lessons/javascript/creating-elements) you'll learn the safer, more professional way.)

## Try it yourself

1. Add `'Brioche'` to the list, then add a `break` so the loop stops when it reaches `'Focaccia'`. Which breads show up now?
2. Change the countdown to start at 10 and count down by 2 each time.
3. Change each roll to use 120 grams. How many rolls do you get?

## Check your understanding

<Quiz
	question="How many times does this loop run? for (let i = 0; i < 3; i++) { }"
	:options="['2', '3', '4', 'Forever']"
	:answer-index="1"
	explanation="i takes the values 0, 1, and 2. When i becomes 3, the condition i < 3 is false and the loop stops."
/>

<Quiz
	question="What does continue do inside a loop?"
	:options="['Stops the loop completely', 'Skips the rest of the current lap and moves on to the next', 'Restarts the loop from the beginning', 'Pauses the loop for a second']"
	:answer-index="1"
	explanation="continue skips to the next lap. break is the one that leaves the loop entirely."
/>

<Quiz
	question="Why does this loop never end? let n = 5; while (n > 0) { console.log(n); }"
	:options="['console.log is not allowed in loops', 'n never changes, so n > 0 stays true forever', 'while loops always run forever', 'n should be a string']"
	:answer-index="1"
	explanation="Nothing inside the loop changes n, so the condition never becomes false. Adding n-- would fix it."
/>

## Up next

You can make decisions and repeat things. Next, you'll learn to package a set of steps into a reusable recipe you can call by name, whenever you need it. That's [Functions](/lessons/javascript/functions).
