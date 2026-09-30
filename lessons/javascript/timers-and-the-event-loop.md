---
title: "JavaScript Timers and the Event Loop: setTimeout Explained"
description: "Schedule code with setTimeout and setInterval, cancel timers, understand why async code runs later than you expect, and keep the page responsive with the event loop."
---

# Timers and the Event Loop

*One cook, one stove, and a rail of order tickets. Once you see how the kitchen works, "why did that run so late?" stops being a mystery.*

You've already met code that doesn't run right away. A click listener waits for a click. `setTimeout` waits for its delay. A module waits to load. And you might have noticed something odd: the console doesn't always print things in the order they're written.

This lesson explains why. It's the key to the whole Asynchronous JavaScript chapter, and to one of the most common beginner surprises.

## `setTimeout`: do this later

```js
setTimeout(() => {
	console.log('Your bread is ready!');
}, 2000);
```

`setTimeout` takes a callback and a delay in **milliseconds** (1000 milliseconds is one second), and runs the callback once, after the delay. You saw it in [Arrow Functions and Callbacks](/lessons/javascript/arrow-functions).

It hands you back a number, a ticket for that timer. Keep it if you might want to cancel:

```js
const reminder = setTimeout(() => {
	console.log('Still there?');
}, 30000);

// Changed our minds:
clearTimeout(reminder);
```

## `setInterval`: do this again and again

```js
let secondsLeft = 5;

const countdown = setInterval(() => {
	console.log(secondsLeft);
	secondsLeft -= 1;

	if (secondsLeft === 0) {
		clearInterval(countdown);
		console.log('The oven is open!');
	}
}, 1000);
```

`setInterval` runs its callback repeatedly, once per interval, **until you stop it** with `clearInterval`. Forgetting to clear an interval is a classic leak: it keeps ticking in the background forever, even after the thing it was updating is gone.

## The surprise

Predict the order of these three lines before reading on:

```js
console.log('1. Mixing the dough');

setTimeout(() => {
	console.log('2. The timer went off');
}, 0);

console.log('3. Cleaning the counter');
```

A delay of zero. Surely it runs immediately, in order: 1, 2, 3?

No. The console shows:

```text
1. Mixing the dough
3. Cleaning the counter
2. The timer went off
```

To see why, you need to see the kitchen.

## One cook, one stove

JavaScript in a web page runs on **one thread**. Picture a kitchen with exactly one cook. The cook can only do one thing at a time, and always finishes the current task before starting another.

The cook has:

- **The current recipe**: the code running right now, from top to bottom. The cook works through it without stopping.
- **A rail of order tickets**: callbacks waiting their turn. A finished timer, a click that just happened, data that just arrived from a server. Each adds a ticket to the rail.

And one simple rule:

**The cook only takes the next ticket from the rail after finishing the current recipe completely.**

That's the **event loop**: finish the current work, check the rail, take the next ticket, run it to completion, repeat, forever.

Now the surprise makes sense. `setTimeout(..., 0)` doesn't mean "run now." It means "put a ticket on the rail as soon as possible." The cook is still in the middle of the current recipe, so line 3 runs first. Only when the whole script is done does the cook turn around, see the timer's ticket, and run line 2.

A delay is a **minimum** wait, not a promise. `setTimeout(callback, 1000)` means "no sooner than one second," and if the cook is busy, it can be later.

### The priority rail

There's one more detail you'll meet in the next lesson. **Promises**, the tool behind `fetch` and `await`, put their callbacks on a separate **priority rail**. Whenever the cook finishes a piece of work, they clear *every* ticket on the priority rail before taking the next ordinary ticket, like a timer:

```js
setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('promise'));
console.log('script');
// script
// promise
// timer
```

(`Promise.resolve().then(...)` makes a promise that's already finished and attaches a callback to it. The next lesson explains promises properly.)

The current script always finishes first. Then the promise's callback, from the priority rail. Only then the timer. The official names are **microtasks** for the priority rail and **tasks** for the ordinary one. You rarely need to think about them, but they answer a classic puzzle: "why did my `.then` run before my `setTimeout(..., 0)`?"

## Why a long task freezes the page

Here's the other half of the rule. While the cook is busy with one recipe, **nothing else happens**. Not clicks, not timers, not even the page redrawing itself, because redrawing the screen is another job on the same cook's list.

```js
// Please don't: a loop that keeps the cook busy for 3 seconds
const end = Date.now() + 3000;
while (Date.now() < end) {
	// just spinning
}
console.log('Done!');
```

For those three seconds, the page is frozen. Buttons don't respond, animations stop, text doesn't update. That's why heavy work belongs somewhere else, like on a server, and why real JavaScript never sits and waits for something slow like a network request. Instead, it hands over a callback, finishes its current recipe, and lets the cook handle other tickets in the meantime. That's the whole idea behind the rest of this chapter.

## A practical pattern: debouncing

Here's timers solving a real problem. A search box that looks things up on every keystroke would send a request for "s," "so," "sou," "sour," and so on, one per letter. Wasteful.

A **debounce** waits until the typing pauses:

```js
const searchInput = document.querySelector('#search');
let searchTimer;

searchInput.addEventListener('input', () => {
	clearTimeout(searchTimer);
	searchTimer = setTimeout(() => {
		console.log('Searching for:', searchInput.value);
	}, 400);
});
```

Every keystroke cancels the previous timer and starts a new one. Only when the visitor stops typing for 400 milliseconds does the search actually run. It's like an elevator door that waits a moment after the last person steps in, instead of closing on each one. (This book's own editors use exactly this trick to update the preview a moment after you stop typing.)

## Animating: `requestAnimationFrame`

For smooth animations, driven by JavaScript rather than the CSS transitions from [Transitions and Animations](/lessons/css/transitions-and-animations), use `requestAnimationFrame(callback)` instead of a timer. It runs your callback right before the browser draws the next frame, usually 60 times a second, and pauses automatically in background tabs. Most of the time, though, CSS animations are simpler and smoother. Reach for this only when CSS can't do the job.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'start\'>Start the oven timer</button>\n<p id=\'display\' aria-live=\'polite\'>Ready.</p>\n\n<label for=\'search\'>Search (waits until you pause)</label>\n<input id=\'search\' type=\'search\'>'"
	:initial-js="'console.log(\'1. Mixing the dough\');\nsetTimeout(() => {\n\tconsole.log(\'2. The timer went off\');\n}, 0);\nconsole.log(\'3. Cleaning the counter\');\n\nconst display = document.querySelector(\'#display\');\nlet countdown = null;\n\ndocument.querySelector(\'#start\').addEventListener(\'click\', () => {\n\tclearInterval(countdown);   // restart cleanly if clicked twice\n\tlet secondsLeft = 3;\n\tdisplay.textContent = `${secondsLeft}...`;\n\n\tcountdown = setInterval(() => {\n\t\tsecondsLeft -= 1;\n\t\tif (secondsLeft === 0) {\n\t\t\tclearInterval(countdown);\n\t\t\tdisplay.textContent = \'The oven is open!\';\n\t\t} else {\n\t\t\tdisplay.textContent = `${secondsLeft}...`;\n\t\t}\n\t}, 1000);\n});\n\nconst search = document.querySelector(\'#search\');\nlet searchTimer;\nsearch.addEventListener(\'input\', () => {\n\tclearTimeout(searchTimer);\n\tsearchTimer = setTimeout(() => {\n\t\tconsole.log(\'Searching for:\', search.value);\n\t}, 400);\n});\n'"
	show-console
	preview-height="150px"
/>

## Try it yourself

1. Look at the order of the first three console lines. Now change the `0` delay to `1000`. Does anything change about the order?
2. Type a word into the search box, quickly. How many times does "Searching for" appear? Now change `400` to `0` and type again.
3. Press "Start the oven timer" twice quickly. Why doesn't the countdown speed up? (Hint: look at the first line inside the click listener.)

## Check your understanding

<Quiz
	question="In what order do these log? console.log('A'); setTimeout(() => console.log('B'), 0); console.log('C');"
	:options="['A, B, C', 'A, C, B', 'B, A, C', 'C, B, A']"
	:answer-index="1"
	explanation="The timer's callback waits on the rail until the current script finishes, so C logs before B even with a delay of 0."
/>

<Quiz
	question="How do you stop a setInterval from running forever?"
	:options="['Set its delay to 0', 'Call clearInterval with the id it returned', 'Call setTimeout', 'It stops by itself after a minute']"
	:answer-index="1"
	explanation="setInterval keeps running until you pass the id it returned to clearInterval."
/>

<Quiz
	question="Why does a long-running loop make buttons stop responding?"
	:options="['Loops disable buttons', 'JavaScript runs one task at a time, so clicks wait until the loop finishes', 'The browser deletes event listeners', 'Buttons have a time limit']"
	:answer-index="1"
	explanation="The single thread is busy with the loop, so click handlers, timers, and even screen updates all wait their turn."
/>

## Up next

Callbacks work, but chaining many "wait for this, then that" steps with them gets messy fast. JavaScript has a much cleaner tool for waiting: [Promises and async/await](/lessons/javascript/promises-and-async-await).
