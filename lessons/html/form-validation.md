---
title: "HTML Form Validation: required, pattern, min, max"
description: "Let the browser check form answers for you with required, minlength, min, max, and pattern, write helpful hints, and learn why browser checks never replace server checks."
---

# Form Validation

*A good receptionist catches a missing signature before you've walked away from the desk. That's validation.*

Picture handing in a form at a busy office. A good receptionist glances over it right there: "Oh, you missed the date of birth. And the phone number's one digit short." Thirty seconds, fixed, done.

A bad one takes it without looking, and three days later you get a letter saying your application was rejected for a missing field. Now you have to start over.

Form validation is how you make your site the good receptionist. And the wonderful part? For most everyday checks, HTML does it for you with a single attribute. No programming needed.

## `required`: don't leave this blank

```html
<label for="full-name">Full name</label>
<input type="text" id="full-name" name="full-name" required>
```

That's it. If someone tries to submit with this empty, the browser stops them and points at the field with a message. `required` is a boolean attribute, just like `checked` and `disabled` from [Attributes](/lessons/html/attributes): its presence is the switch.

## The input type already checks for you

Remember choosing `type="email"` back in [Forms: The Basics](/lessons/html/forms-part-1)? That did more than change the phone keyboard. The browser now rejects answers that aren't shaped like an email address. "banana" won't get through. Neither will "maria@". Same goes for `type="url"` and `type="number"`.

That's one more reason to always pick the most specific type.

## Length and range

```html
<!-- Between 8 and 64 characters -->
<input type="password" id="password" name="password" minlength="8" maxlength="64" required>

<!-- A whole number from 1 to 10 -->
<input type="number" id="guests" name="guests" min="1" max="10" step="1">

<!-- No dates before January 1, 2026 -->
<input type="date" id="booking-date" name="booking-date" min="2026-01-01">
```

- `maxlength` stops typing past the limit, and `minlength` is checked when the form is submitted.
- `min` and `max` limit numbers and dates.
- `step` sets the allowed increments. `step="0.5"` allows 1, 1.5, 2, and so on.

(To make the earliest date always *today*, you'd set `min` with JavaScript, since plain HTML can't know what day it is.)

## `pattern`: your own rule

Sometimes you need a specific shape, like a product code that's always three letters then four digits: `ABC1234`.

```html
<label for="product-code">Product code</label>
<input
	type="text"
	id="product-code"
	name="product-code"
	pattern="[A-Z]{3}[0-9]{4}"
	aria-describedby="product-code-hint"
	required>
<p id="product-code-hint">Three capital letters then four numbers, like ABC1234.</p>
```

That odd-looking `[A-Z]{3}[0-9]{4}` is a **regular expression**, a tiny language for describing text shapes. Read it as "three of A to Z, then four of 0 to 9." The pattern has to match the *whole* answer, not just part of it. Don't worry about learning regular expressions right now. They're a whole topic of their own, and you'll meet them properly in [Strings and Regular Expressions](/lessons/javascript/strings-and-regex). For now, just know that `pattern` exists and roughly how to read a simple one.

## Tell people the rules *before* they break them

Look at that hint paragraph above. Nothing is more frustrating than being told "Invalid format" with no idea what the right format is. It's like a receptionist who just keeps saying "No" without telling you why.

So write the rule where people can see it before they type. Then connect it to the input with `aria-describedby`, pointing to the hint's `id`. A screen reader will now read the label, then the hint: "Product code, edit text. Three capital letters then four numbers, like ABC1234." Everyone gets the same heads-up. You'll see more of these `aria-` connections in [Accessibility Basics](/lessons/html/accessibility-basics).

And mark required fields visibly, not just in code. The word "(required)" in the label works great for everyone.

## The big warning: the receptionist is not the security guard

Please read this part twice.

Browser validation is a **convenience** for honest visitors. It is not security. Anyone who knows how can switch it off, edit your HTML in their browser's developer tools, or send data to your server without using your form at all.

The receptionist catches honest mistakes. But the building still needs a security guard at the back door, checking everything that comes in no matter how it arrived. In web terms, that guard is your server, which must validate every answer again, every time. You'll build that guard when you get to the backend tracks. For now, just never believe "the form checks it" means your data is safe.

## Skipping validation on purpose

```html
<form novalidate>
```

`novalidate` turns off the browser's built-in checks for the whole form. Developers sometimes do this when they write their own validation with JavaScript to show custom messages. You'll learn how that works in [Forms and Custom Validation](/lessons/javascript/forms-with-javascript). Until then, let the browser do its job.

## Try it

The preview is a locked-down sandbox that blocks real form submissions, so a tiny helper script in the JavaScript pane asks the browser to run its checks when you press the button. You don't need to understand the script yet.

<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<form>\n\t<p>\n\t\t<label for=\'full-name\'>Full name (required)</label><br>\n\t\t<input type=\'text\' id=\'full-name\' name=\'full-name\' required>\n\t</p>\n\t<p>\n\t\t<label for=\'email\'>Email (required)</label><br>\n\t\t<input type=\'email\' id=\'email\' name=\'email\' required>\n\t</p>\n\t<p>\n\t\t<label for=\'guests\'>Number of guests (1 to 10)</label><br>\n\t\t<input type=\'number\' id=\'guests\' name=\'guests\' min=\'1\' max=\'10\'>\n\t</p>\n\t<p>\n\t\t<label for=\'voucher-code\'>Voucher code</label><br>\n\t\t<input type=\'text\' id=\'voucher-code\' name=\'voucher-code\' pattern=\'[A-Z]{3}[0-9]{4}\' aria-describedby=\'code-hint\'><br>\n\t\t<small id=\'code-hint\'>Three capital letters then four numbers, like ABC1234.</small>\n\t</p>\n\t<button type=\'submit\'>Book a table</button>\n</form>\n<p id=\'result\'></p>'"
	:initial-css="'/* Red outline once the visitor has touched a field and left it invalid. */\ninput:user-invalid {\n\toutline: 2px solid #c0392b;\n}\n'"
	:initial-js="'// The sandbox blocks real submissions, so this asks the browser to run its checks.\nconst form = document.querySelector(\'form\');\nform.querySelector(\'button\').addEventListener(\'click\', () => {\n\tif (form.reportValidity()) {\n\t\tdocument.querySelector(\'#result\').textContent = \'All answers look good!\';\n\t}\n});\n'"
	preview-height="380px"
/>

## Try it yourself

1. Press "Book a table" with everything empty. The browser points you at the first problem.
2. Type `banana` as the email. Type `12` guests. Type `abc1234` (lowercase) as the voucher. Each one gets caught.
3. Add `minlength="2"` to the name field, then test it with a single letter.

## Check your understanding

<Quiz
	question="Which attribute stops a form from being submitted while a field is empty?"
	:options="['needed', 'required', 'validate', 'mandatory']"
	:answer-index="1"
	explanation="required is a boolean attribute. When present, the browser will not submit the form until the field has a value."
/>

<Quiz
	question="Is browser validation enough to keep bad data out of your system?"
	:options="['Yes, browsers cannot be bypassed', 'Yes, as long as you use pattern', 'No, the server must validate everything again', 'No, so you should skip validation entirely']"
	:answer-index="2"
	explanation="Browser checks help honest visitors but can be bypassed. The server is the security guard and must check again."
/>

<Quiz
	question="Fill in the blank: <input type='number' min='1' ___='10'> limits the value to at most 10."
	:options="['maxlength', 'max', 'limit', 'top']"
	:answer-index="1"
	explanation="min and max limit numbers and dates. maxlength limits the number of characters instead."
/>

## Up next

Forms are done, and that was a big chapter. Seriously, take a breath. You can now build a real, working conversation with your visitors. Next, we zoom out from single elements to the structure of a whole page, starting with the humble generic boxes in [Divs and Spans](/lessons/html/divs-and-spans).
