---
title: "JavaScript Form Validation: submit Events and Custom Messages"
description: "Handle form submit events, read values with FormData, give live feedback as people type, and write friendly, accessible custom validation messages."
---

# Forms and Custom Validation

*The browser's built-in receptionist says "Please fill out this field." Yours can say exactly what's wrong, and how to fix it.*

In [Form Validation](/lessons/html/form-validation), you let the browser check answers with attributes like `required`, `minlength`, and `pattern`. That's a great start, and it's still the foundation. But the built-in messages are generic, they look different in every browser, and you can't control where they appear.

That lesson ended with a promise: developers sometimes turn off the browser's checks with `novalidate` "when they write their own validation with JavaScript to show custom messages." This is that lesson.

## The `submit` event

When a visitor submits a form, by clicking a submit button or pressing Enter in a field, the form fires a `submit` event. That's the one event to listen for:

```js
const form = document.querySelector('#contact-form');

form.addEventListener('submit', (event) => {
	event.preventDefault();   // stop the page from reloading
	console.log('The form was submitted');
});
```

Listen on the **form**, not on the button's `click`. The `submit` event catches every way of submitting, including the Enter key, which a button's click listener would miss.

And `event.preventDefault()`, from [Events](/lessons/javascript/events), stops the browser's default behavior: sending the data and loading a new page. You'll handle the data yourself instead. (In a later lesson, [Loading Data with fetch](/lessons/javascript/fetch), you'll send it to a server without leaving the page.)

## Reading the answers

You can read each field directly with `.value`, as you learned in [Changing Text, Attributes, and Classes](/lessons/javascript/changing-elements):

```js
const name = form.querySelector('#contact-name').value.trim();
```

Or collect every answer at once with **`FormData`**, which reads each field's `name` attribute, exactly like the browser does when it sends a form:

```js
const data = new FormData(form);
console.log(data.get('email'));

const answers = Object.fromEntries(data);
// { name: 'Maria', email: 'maria@example.com', message: '...' }
```

That's the payoff for the rule from [Forms: The Basics](/lessons/html/forms-part-1): a field without a `name` is simply left out. Remember, too, that every value arrives as a **string**, so use `Number()` before doing any math.

## Live feedback while typing

The `input` event fires on every keystroke, which makes it perfect for helpful live feedback, like a character counter:

```js
const message = form.querySelector('#contact-message');
const counter = form.querySelector('#message-count');
const limit = 200;

message.addEventListener('input', () => {
	const remaining = limit - message.value.length;
	counter.textContent = `${remaining} characters left`;
});
```

Live feedback is great for things that help, like counters and password-strength hints. For error messages, it's usually kinder to wait until the visitor has finished with a field (or submits) before telling them it's wrong. Nobody likes being told off after typing one letter of their email address.

## Two ways to customize validation

### 1. Keep the browser's checks, change the message

The browser's built-in validation has a JavaScript side, called the **Constraint Validation API**. Every field has a `validity` object describing what's wrong, and `setCustomValidity` lets you replace the message:

```js
const email = form.querySelector('#contact-email');

email.addEventListener('input', () => {
	if (email.validity.typeMismatch) {
		email.setCustomValidity('That email looks incomplete. Did you forget the @ or the ending, like .com?');
	} else {
		email.setCustomValidity('');   // an empty message means "valid again"
	}
});
```

The catch is the last line: once you set a custom message, the field stays invalid until you clear it with an empty string. Forgetting to clear it is a classic bug, where a form refuses to submit even after the answer is fixed.

Useful `validity` checks include `valueMissing` (a required field is empty), `typeMismatch` (not a valid email or URL), `tooShort`, `rangeOverflow`, and `patternMismatch`. And `field.checkValidity()` returns `true` or `false` for a single field, or for the whole form.

One quirk worth knowing: `tooShort` only reports a problem after a person has actually edited the field, and it doesn't ignore spaces, so `'  '` counts as two characters. For length rules, it's often simpler to check `field.value.trim().length` yourself, which is what the Try it below does.

### 2. Turn off the bubbles, show your own messages

For full control, add `novalidate` to the form. The browser stops showing its own bubbles, but all the validation attributes still work behind the scenes, so you can use them from JavaScript and show your messages right on the page:

```html
<form id="contact-form" novalidate>
	<label for="contact-email">Email</label>
	<input type="email" id="contact-email" name="email" required aria-describedby="email-error">
	<p id="email-error" class="field-error"></p>
</form>
```

```js
function showError(field, errorElement, message) {
	errorElement.textContent = message;
	field.setAttribute('aria-invalid', 'true');
}

function clearError(field, errorElement) {
	errorElement.textContent = '';
	field.removeAttribute('aria-invalid');
}
```

That HTML does two important accessibility jobs:

- `aria-describedby` connects the field to its error message, so screen readers read the message when the field is focused. You met it in [Form Validation](/lessons/html/form-validation).
- `aria-invalid="true"` tells assistive technology the field currently has a problem.

And when the form is submitted with errors, **move focus to the first field with a problem**, so keyboard and screen reader users land right where they need to be:

```js
// In your submit handler, after checking every field:
firstInvalidField.focus();
```

Good error messages follow the receptionist rule from the HTML track: say what's wrong **and** how to fix it. "Invalid input" helps nobody. "Your name needs at least 2 letters" does.

## The security guard still matters

Everything in this lesson makes forms friendlier, but none of it makes them safe. Anyone can turn off JavaScript, edit your code in the developer tools, or send data straight to your server. As [Form Validation](/lessons/html/form-validation) put it: the browser is the receptionist, and the server is the security guard. Your server must check everything again, every time.

## Try it

The preview blocks real form submissions, so the first few lines of the JavaScript are a small helper that sends the `submit` event by hand. You'd delete them on a real page.

<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<form id=\'contact-form\' novalidate>\n\t<p>\n\t\t<label for=\'contact-name\'>Your name</label>\n\t\t<input id=\'contact-name\' name=\'name\' required minlength=\'2\' aria-describedby=\'name-error\'>\n\t\t<span id=\'name-error\' class=\'field-error\'></span>\n\t</p>\n\t<p>\n\t\t<label for=\'contact-email\'>Your email</label>\n\t\t<input id=\'contact-email\' name=\'email\' type=\'email\' required aria-describedby=\'email-error\'>\n\t\t<span id=\'email-error\' class=\'field-error\'></span>\n\t</p>\n\t<p>\n\t\t<label for=\'contact-message\'>Message</label>\n\t\t<textarea id=\'contact-message\' name=\'message\' rows=\'3\' maxlength=\'200\' aria-describedby=\'message-count\'></textarea>\n\t\t<span id=\'message-count\'>200 characters left</span>\n\t</p>\n\t<button type=\'submit\'>Send message</button>\n</form>\n<p id=\'form-status\' role=\'status\'></p>'"
	:initial-css="'body {\n\tfont-family: system-ui, sans-serif;\n}\n\nlabel {\n\tdisplay: block;\n}\n\n.field-error {\n\tdisplay: block;\n\tcolor: #b3261e;\n}\n\n[aria-invalid=\'true\'] {\n\toutline: 2px solid #b3261e;\n}\n'"
	:initial-js="'// Preview-only helper: this sandbox blocks real form submissions, so this\n// fires the submit event by hand. On a real page, delete these lines.\ndocument.addEventListener(\'click\', (event) => {\n\tconst button = event.target.closest(\'button\');\n\tif (button && button.form && button.type === \'submit\') {\n\t\tevent.preventDefault();\n\t\tbutton.form.dispatchEvent(new SubmitEvent(\'submit\', { cancelable: true, submitter: button }));\n\t}\n});\n\nconst form = document.querySelector(\'#contact-form\');\nconst status = document.querySelector(\'#form-status\');\nconst nameField = form.querySelector(\'#contact-name\');\nconst emailField = form.querySelector(\'#contact-email\');\nconst message = form.querySelector(\'#contact-message\');\nconst counter = form.querySelector(\'#message-count\');\n\nmessage.addEventListener(\'input\', () => {\n\tcounter.textContent = `${200 - message.value.length} characters left`;\n});\n\nfunction errorFor(field) {\n\tconst value = field.value.trim();\n\tif (field.required && value === \'\') return \'This one is required.\';\n\tif (value.length < field.minLength) return `Please use at least ${field.minLength} characters.`;\n\tif (field.validity.typeMismatch) return \'That email looks incomplete, like it is missing the @ or the .com part.\';\n\treturn \'\';\n}\n\nform.addEventListener(\'submit\', (event) => {\n\tevent.preventDefault();\n\tlet firstInvalid = null;\n\n\tfor (const field of [nameField, emailField]) {\n\t\tconst errorElement = document.getElementById(field.getAttribute(\'aria-describedby\'));\n\t\tconst error = errorFor(field);\n\t\terrorElement.textContent = error;\n\t\tif (error) {\n\t\t\tfield.setAttribute(\'aria-invalid\', \'true\');\n\t\t\tfirstInvalid = firstInvalid ?? field;\n\t\t} else {\n\t\t\tfield.removeAttribute(\'aria-invalid\');\n\t\t}\n\t}\n\n\tif (firstInvalid) {\n\t\tstatus.textContent = \'Please fix the highlighted fields.\';\n\t\tfirstInvalid.focus();\n\t\treturn;\n\t}\n\n\tconsole.log(\'Would send:\', Object.fromEntries(new FormData(form)));\n\tstatus.textContent = `Thanks, ${nameField.value}! Your message is on its way.`;\n\tform.reset();\n\tcounter.textContent = \'200 characters left\';\n});\n'"
	show-console
	preview-height="340px"
/>

## Try it yourself

1. Press "Send message" with everything empty. Where does focus go? Then fill in a one-letter name and an email without an `@`, and try again.
2. Fill everything in correctly and submit. Look at the object in the console: every key comes from a field's `name`.
3. Add a "Phone" field with `type='tel'`, `name='phone'`, and a `pattern` of your choice, plus a message for `validity.patternMismatch` in `errorFor`.

## Check your understanding

<Quiz
	question="Which event should you listen for to handle a form being sent?"
	:options="['click on the submit button', 'submit on the form', 'change on the form', 'input on the button']"
	:answer-index="1"
	explanation="submit on the form catches every way of submitting, including pressing Enter in a field, which a button click listener would miss."
/>

<Quiz
	question="You called field.setCustomValidity('Too short') and the visitor fixed their answer, but the form still won't submit. Why?"
	:options="['setCustomValidity only works once', 'The custom message was never cleared with setCustomValidity(\'\')', 'The field needs a new name', 'novalidate is missing']"
	:answer-index="1"
	explanation="A field stays invalid until its custom message is cleared by setting it to an empty string."
/>

<Quiz
	question="With JavaScript validation on the page, does the server still need to check the data?"
	:options="['No, JavaScript already checked it', 'Only for passwords', 'Yes, browser checks can always be bypassed', 'Only if novalidate is used']"
	:answer-index="2"
	explanation="Anyone can turn off JavaScript or send data directly to the server. Browser validation is for convenience, server validation is for safety."
/>

## Up next

That completes the DOM chapter. You can find, change, build, and listen to anything on the page. Next, we go deeper into how JavaScript works, starting with a word that confuses everyone at first. That's [this and Classes](/lessons/javascript/this-and-classes).
