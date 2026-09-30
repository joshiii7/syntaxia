---
title: "HTML Form Controls: select, radio, checkbox, textarea"
description: "Ask multiple-choice and open-ended questions with select, radio buttons, checkboxes, and textarea, and group related questions with fieldset and legend."
---

# More Form Controls

*Not every question has a typed answer. Sometimes you want "pick one," sometimes "pick any," and sometimes "tell me more."*

In [Forms: The Basics](/lessons/html/forms-part-1) we set up a conversation with text boxes. That's fine for names and emails. But think about the last paper form you filled out at a doctor's office or a bank. It had tick boxes, circle-one questions, a dropdown of countries, and a big empty box at the end that said "Anything else we should know?"

Each of those question styles has an HTML control. Let's meet them.

## Radio buttons: pick exactly one

Remember multiple-choice exams? Fill in *one* bubble per question. Fill in two and it's marked wrong.

That's a radio button group:

```html
<fieldset>
	<legend>What size coffee?</legend>

	<input type="radio" id="size-small" name="size" value="small">
	<label for="size-small">Small</label>

	<input type="radio" id="size-medium" name="size" value="medium" checked>
	<label for="size-medium">Medium</label>

	<input type="radio" id="size-large" name="size" value="large">
	<label for="size-large">Large</label>
</fieldset>
```

The magic is in the `name`. All three buttons share `name="size"`, which ties them into one question. Choose one and the others automatically unselect. (The name "radio" comes from old car radios, where pushing in one station button popped the other one out.)

Give each radio a different `name` by accident and you've made three separate questions. Suddenly someone can order a small, medium, *and* large coffee. If your radio buttons refuse to unselect each other, that's always the reason.

And `value`? That's what gets sent. The visitor sees the label "Medium," the server receives `size=medium`.

## Checkboxes: pick any

"Which toppings would you like? Tick all that apply." Zero, one, or all of them. That's a checkbox:

```html
<fieldset>
	<legend>Extras</legend>

	<input type="checkbox" id="extra-oat" name="extras" value="oat-milk">
	<label for="extra-oat">Oat milk</label>

	<input type="checkbox" id="extra-shot" name="extras" value="extra-shot">
	<label for="extra-shot">Extra shot</label>
</fieldset>
```

A single checkbox on its own is great for yes/no questions too: "I agree to the terms" or "Email me about new flavors."

**Radio or checkbox?** Ask: "Can the answer be more than one thing?" If yes, checkboxes. If it's exactly one, radios.

## `<fieldset>` and `<legend>`: the section heading on a paper form

Paper forms are split into boxed sections: "Personal details," "Payment," "Delivery address." `<fieldset>` draws that box around a group of related controls, and `<legend>` is its heading.

For radio buttons and checkboxes, this isn't just tidy. It's essential. Think about a screen reader user landing on a radio button labeled "Small." Small what? The `<legend>` answers that: the screen reader reads "What size coffee? Small, radio button, 1 of 3."

## Dropdowns: `<select>`

When there are lots of options (countries, months, states), a row of radio buttons gets unwieldy. A dropdown folds them away:

```html
<label for="country">Country</label>
<select id="country" name="country">
	<option value="">Choose a country</option>
	<optgroup label="Asia">
		<option value="ph">Philippines</option>
		<option value="jp">Japan</option>
	</optgroup>
	<optgroup label="Europe">
		<option value="es">Spain</option>
		<option value="de">Germany</option>
	</optgroup>
</select>
```

`<optgroup>` groups options under a heading inside the dropdown, which makes long lists much easier to scan. A quick rule of thumb: with only two to five choices, radio buttons are often friendlier, because people can see every choice at once without clicking.

## Open-ended answers: `<textarea>`

"Anything else we should know?" needs room for more than one line:

```html
<label for="notes">Any special requests?</label>
<textarea id="notes" name="notes" rows="4" cols="40"></textarea>
```

Unlike `<input>`, a `<textarea>` has a closing tag. Anything you put between the tags becomes the starting text, including spaces and line breaks, so keep the tags snug together unless you really want starting text.

## Buttons that don't submit

Not every button ends the conversation:

```html
<button type="submit">Place order</button>
<button type="reset">Clear the form</button>
<button type="button">Show a preview</button>
```

- `submit` sends the form.
- `reset` wipes every answer back to its starting value. Be careful with this one; nobody likes losing a long form to a misclick.
- `button` does nothing on its own. It waits for JavaScript to give it a job, which you'll get to do in the JavaScript track's [Events](/lessons/javascript/events) lesson.

## Try it

<WebPlayground
	:panes="['html']"
	:initial-html="'<form>\n\t<fieldset>\n\t\t<legend>What size coffee?</legend>\n\t\t<input type=\'radio\' id=\'size-small\' name=\'size\' value=\'small\'>\n\t\t<label for=\'size-small\'>Small</label>\n\t\t<input type=\'radio\' id=\'size-medium\' name=\'size\' value=\'medium\' checked>\n\t\t<label for=\'size-medium\'>Medium</label>\n\t\t<input type=\'radio\' id=\'size-large\' name=\'size\' value=\'large\'>\n\t\t<label for=\'size-large\'>Large</label>\n\t</fieldset>\n\n\t<fieldset>\n\t\t<legend>Extras</legend>\n\t\t<input type=\'checkbox\' id=\'extra-oat\' name=\'extras\' value=\'oat-milk\'>\n\t\t<label for=\'extra-oat\'>Oat milk</label>\n\t\t<input type=\'checkbox\' id=\'extra-shot\' name=\'extras\' value=\'extra-shot\'>\n\t\t<label for=\'extra-shot\'>Extra shot</label>\n\t</fieldset>\n\n\t<p>\n\t\t<label for=\'notes\'>Any special requests?</label><br>\n\t\t<textarea id=\'notes\' name=\'notes\' rows=\'3\' cols=\'32\'></textarea>\n\t</p>\n\n\t<button type=\'submit\'>Place order</button>\n\t<button type=\'reset\'>Clear the form</button>\n</form>'"
	preview-height="360px"
/>

## Try it yourself

1. Change the `name` on the "Large" radio to `size2`. Now try selecting Medium and Large together. Then fix it.
2. Add a `<select>` asking which pastry they'd like, with at least three options.
3. Tick some boxes, type a request, then press "Clear the form." Everything resets to how it started, including Medium being selected.

## Check your understanding

<Quiz
	question="What makes several radio buttons act as one pick-exactly-one question?"
	:options="['The same id', 'The same name', 'The same value', 'Being inside a label']"
	:answer-index="1"
	explanation="Radio buttons that share a name form one group, and only one in the group can be selected."
/>

<Quiz
	question="Which control fits the question: Which days are you free? (choose all that apply)"
	:options="['Radio buttons', 'Checkboxes', 'A single text input', 'A reset button']"
	:answer-index="1"
	explanation="More than one answer is allowed, so checkboxes are the right choice."
/>

<Quiz
	question="What is the job of a legend inside a fieldset?"
	:options="['It adds a map key', 'It gives the whole group of controls a heading', 'It submits the fieldset', 'It hides the group']"
	:answer-index="1"
	explanation="The legend is the heading for the group, so screen readers can say what question a set of radio buttons or checkboxes belongs to."
/>

## Up next

Our conversation can now ask any kind of question. But what happens when someone answers "banana" to "What's your email?" That's [Form Validation](/lessons/html/form-validation), and it's up next.
