---
title: "JavaScript localStorage: Save and Remember Data in the Browser"
description: "Remember data between visits with localStorage and sessionStorage, store objects as JSON, handle storage that is unavailable, and save a visitor's theme choice."
---

# Saving Data with localStorage

*A coat check at a theater. Hand over your coat, keep the ticket, and it's waiting for you when you come back, as long as you come back to the same theater.*

Everything your JavaScript has done so far disappears the moment the page reloads. Variables reset. Added reviews vanish. The dark mode someone switched on turns back off.

For many things, that's fine. But some choices should stick: a theme preference, a half-written message, the items in a cart. The CSS final project ended by pointing out that your page couldn't yet "remember a visitor's theme choice." This lesson fixes that.

## The coat check

Every website gets its own little storage area inside the visitor's browser, called **localStorage**. It works like a coat check:

- You hand over something with a **ticket name** (a key) and get it back later with the same name.
- It stays there after the page reloads, after the tab closes, even after the computer restarts, until someone clears it.
- It belongs to one website. Another site's coat check is a different room, and neither can see into the other.
- It's on **this** browser only. The same visitor on their phone has a separate, empty coat check.

## The four methods

```js
localStorage.setItem('theme', 'dark');          // check in a coat

const theme = localStorage.getItem('theme');    // collect it: 'dark'

localStorage.removeItem('theme');               // take it back for good

localStorage.clear();                           // empty this site's whole coat check
```

If nothing is stored under a key, `getItem` returns `null`. That's handy for defaults, using `??` from [Operators and Comparisons](/lessons/javascript/operators):

```js
const theme = localStorage.getItem('theme') ?? 'light';
```

## Strings only

Here's the catch: localStorage stores **only strings**. Hand it anything else and it quietly turns it into text:

```js
localStorage.setItem('visits', 3);
console.log(localStorage.getItem('visits'));        // '3' (a string)

localStorage.setItem('cart', ['Rye', 'Coffee']);
console.log(localStorage.getItem('cart'));          // 'Rye,Coffee' (the list is gone)

localStorage.setItem('settings', { theme: 'dark' });
console.log(localStorage.getItem('settings'));      // '[object Object]' (useless)
```

The fix is [JSON](/lessons/javascript/json): pack objects and arrays into text on the way in, unpack them on the way out.

```js
const cart = ['Rye', 'Coffee'];
localStorage.setItem('cart', JSON.stringify(cart));

const savedCart = JSON.parse(localStorage.getItem('cart') ?? '[]');
console.log(savedCart);   // ['Rye', 'Coffee'], a real array again
```

And numbers need converting back with `Number()`, just like form input.

## When storage isn't available

On a normal website, localStorage almost always works. But not always:

- Some browsers limit or block it in private browsing, or when a visitor blocks site data.
- Storage has a size limit, usually about 5 MB per site, and `setItem` throws when it's full.
- Embedded, sandboxed frames block it entirely. That includes this book's editors, which run in a locked-down sandbox.

And saved data can be broken. A visitor, or an old version of your own code, might have left something that isn't valid JSON.

So a careful site treats storage like any other outside source, from [Errors and Debugging](/lessons/javascript/errors-and-debugging): wrap it in `try` and `catch`, and fall back gracefully.

```js
function loadSetting(key, fallback) {
	try {
		const saved = localStorage.getItem(key);
		return saved === null ? fallback : JSON.parse(saved);
	} catch (error) {
		return fallback;   // storage blocked or data broken: just use the default
	}
}

function saveSetting(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.warn('Could not save', key, error.message);
	}
}
```

Now storage is a nice extra. If it works, great. If it doesn't, the page still works, it just forgets.

## What not to store

localStorage is convenient, not private:

- **Any script running on your page can read it**, including a third-party script, or an attacker's script if the site ever has an XSS hole like the one in [Changing Text, Attributes, and Classes](/lessons/javascript/changing-elements). Never store passwords, payment details, or anything else sensitive.
- **The visitor can see and edit it.** Open the developer tools, go to the **Application** panel (Chrome and Edge) or **Storage** panel (Firefox), and look under Local Storage. So never trust saved values for anything important, like prices or permissions.

Great uses: theme and layout preferences, a draft of a long message, recently viewed items, dismissed notices.

## `sessionStorage`: just for this visit

`sessionStorage` has exactly the same methods, but it's cleared when the tab is closed, and each tab has its own. Use it for things that only matter right now, like which step of a multi-step form someone is on.

## Remembering a theme

Here's the full pattern for a dark mode toggle that remembers, building on [Where CSS Meets JavaScript](/lessons/css/css-meets-javascript):

```js
const root = document.documentElement;
const toggle = document.querySelector('#theme-toggle');

function applyTheme(theme) {
	root.dataset.theme = theme;
	toggle.setAttribute('aria-pressed', String(theme === 'dark'));
}

// On load: the saved choice, or else the device's own preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(loadSetting('theme', prefersDark ? 'dark' : 'light'));

toggle.addEventListener('click', () => {
	const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
	applyTheme(next);
	saveSetting('theme', next);
});
```

- A saved choice wins, but a first-time visitor gets whatever their device prefers, the `prefers-color-scheme` from [Responsive Design and Media Queries](/lessons/css/responsive-design).
- `aria-pressed` tells screen readers whether the toggle button is currently on.

One refinement for real sites: a deferred script runs *after* the page first appears, so a dark-mode visitor might see a brief flash of the light theme. The usual fix is a tiny inline `<script>` in the `<head>` that reads the saved theme and sets `data-theme` before anything is drawn.

## Try it

This preview blocks storage, so the code detects that and falls back to remembering only until you press **Run** again. Copy it into a real `.html` file on your computer to see it remember across reloads.

<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<button type=\'button\' id=\'theme-toggle\' aria-pressed=\'false\'>Dark mode</button>\n<p>Visits on this browser: <strong id=\'visits\'>0</strong></p>\n<p id=\'storage-note\'></p>'"
	:initial-css="':root {\n\t--bg: #ffffff;\n\t--text: #222222;\n}\n\n:root[data-theme=\'dark\'] {\n\t--bg: #111827;\n\t--text: #e5e7eb;\n}\n\nbody {\n\tbackground: var(--bg);\n\tcolor: var(--text);\n\tfont-family: system-ui, sans-serif;\n}\n'"
	:initial-js="'// Use real storage if the browser allows it; otherwise remember in memory only.\nconst memory = new Map();\nlet storageWorks = true;\ntry {\n\tlocalStorage.setItem(\'storage-test\', \'1\');\n\tlocalStorage.removeItem(\'storage-test\');\n} catch (error) {\n\tstorageWorks = false;\n\tconsole.warn(\'Storage is not available here:\', error.name);\n}\n\nfunction loadSetting(key, fallback) {\n\ttry {\n\t\tconst saved = storageWorks ? localStorage.getItem(key) : memory.get(key) ?? null;\n\t\treturn saved === null ? fallback : JSON.parse(saved);\n\t} catch (error) {\n\t\treturn fallback;\n\t}\n}\n\nfunction saveSetting(key, value) {\n\tconst text = JSON.stringify(value);\n\ttry {\n\t\tif (storageWorks) {\n\t\t\tlocalStorage.setItem(key, text);\n\t\t} else {\n\t\t\tmemory.set(key, text);\n\t\t}\n\t} catch (error) {\n\t\tconsole.warn(\'Could not save\', key, error.message);\n\t}\n}\n\ndocument.querySelector(\'#storage-note\').textContent = storageWorks\n\t? \'Your choices are saved in this browser.\'\n\t: \'This preview blocks storage, so it remembers only until you press Run.\';\n\n// Count visits\nconst visits = loadSetting(\'visits\', 0) + 1;\nsaveSetting(\'visits\', visits);\ndocument.querySelector(\'#visits\').textContent = visits;\n\n// Remember the theme\nconst root = document.documentElement;\nconst toggle = document.querySelector(\'#theme-toggle\');\n\nfunction applyTheme(theme) {\n\troot.dataset.theme = theme;\n\ttoggle.setAttribute(\'aria-pressed\', String(theme === \'dark\'));\n}\n\nconst prefersDark = window.matchMedia(\'(prefers-color-scheme: dark)\').matches;\napplyTheme(loadSetting(\'theme\', prefersDark ? \'dark\' : \'light\'));\n\ntoggle.addEventListener(\'click\', () => {\n\tconst next = root.dataset.theme === \'dark\' ? \'light\' : \'dark\';\n\tapplyTheme(next);\n\tsaveSetting(\'theme\', next);\n\tconsole.log(\'Saved theme:\', next);\n});\n'"
	show-console
	preview-height="160px"
/>

## Try it yourself

1. Toggle dark mode, then read the console. What did the storage check report, and why?
2. Copy the three panes into a real page on your computer (HTML in the body, CSS in a `<style>`, JavaScript in a `<script>` at the end). Open it, toggle the theme, and reload. Does it remember? Does the visit counter go up?
3. On that real page, open the developer tools' Application (or Storage) panel, find Local Storage, and change the saved theme by hand. Reload and see what happens.

## Check your understanding

<Quiz
	question="What does localStorage.setItem('cart', ['Rye', 'Coffee']) actually store?"
	:options="['The array, exactly as it was', 'The string Rye,Coffee', 'Nothing, it throws an error', 'The number 2']"
	:answer-index="1"
	explanation="localStorage stores only strings, so the array is turned into text and its structure is lost. Use JSON.stringify first."
/>

<Quiz
	question="Which of these is safe to keep in localStorage?"
	:options="['A password', 'A credit card number', 'A preferred color theme', 'A secret API key']"
	:answer-index="2"
	explanation="Any script on the page and the visitor themselves can read localStorage. Only store harmless preferences and convenience data."
/>

<Quiz
	question="How is sessionStorage different from localStorage?"
	:options="['It stores numbers instead of strings', 'It is cleared when the tab is closed', 'It is shared between all websites', 'It has no size limit']"
	:answer-index="1"
	explanation="sessionStorage has the same methods, but its data only lasts for the current tab's session."
/>

## Up next

That completes the Asynchronous JavaScript chapter, and nearly the whole track. Next, you'll pull everything together into the habits that separate working code from good code, with a bug hunt to test your eye. That's [Best Practices and Common Mistakes](/lessons/javascript/best-practices).
