---
title: "HTML Tables, and When Not to Use Them"
description: "Build accessible data tables with caption, thead, tbody, th, and scope, merge cells with colspan and rowspan, and learn why tables should never be used for layout."
---

# Tables (and When Not to Use Them)

*A table is a train timetable: rows, columns, and the promise that you can find any answer by running your finger across and down.*

Think about a train timetable at a station. Find your train in the left column, slide your finger across to the column for your stop, and there's your departure time. Two directions, one answer. That's what makes it a table and not just a list: every piece of data means something *because of* its row and its column.

HTML tables are built for exactly that kind of information.

## Building a table, cell by cell

```html
<table>
	<caption>Weekday trains from Central Station</caption>
	<thead>
		<tr>
			<th scope="col">Train</th>
			<th scope="col">Riverside</th>
			<th scope="col">Hilltop</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<th scope="row">Morning Express</th>
			<td>7:15</td>
			<td>7:40</td>
		</tr>
		<tr>
			<th scope="row">Midday Local</th>
			<td>12:05</td>
			<td>12:45</td>
		</tr>
	</tbody>
</table>
```

That's a lot of tags at once, and yes, tables are wordy. Let's take it piece by piece:

- `<table>` wraps the whole timetable.
- `<caption>` is the title printed above it. It tells everyone what the table is about before they start reading cells.
- `<tr>` is a **table row**. Each row is one horizontal line of the timetable.
- `<td>` is a **table data** cell, one box of actual information.
- `<th>` is a **table header** cell, a label for a row or column.
- `<thead>` groups the header rows, `<tbody>` groups the main data. There's also `<tfoot>` for totals or summaries at the bottom.

Notice there's no "column" tag. You build tables row by row, and the columns appear by lining up cells. The first cell in every row is column one, the second is column two, and so on.

## `scope`: which way does the label point?

Here's why that `scope` attribute is there. Imagine someone who can't see the timetable, having it read to them one cell at a time. They hear "7:40." Okay... 7:40 for what? Which train? Which stop?

With `scope="col"` and `scope="row"`, you're telling assistive technology which way each header points. Now a screen reader can say "Morning Express, Hilltop, 7:40." That's the finger-across-and-down trick, done out loud. Without it, tables can turn into a meaningless stream of numbers.

## Merging cells

Sometimes one cell needs to stretch across several columns or rows, like a "Closed for maintenance" note that covers a whole row:

```html
<tr>
	<th scope="row">Evening Local</th>
	<td colspan="2">Cancelled this week</td>
</tr>
```

- `colspan="2"` makes the cell two columns wide.
- `rowspan="2"` makes it two rows tall.

Use these sparingly. Every merge makes the table harder to follow, especially for screen reader users. If you find yourself merging cells all over the place, that's a hint the data might want to be two simpler tables.

## When NOT to use a table

This is the most important section in the lesson, so stay with me.

In the early days of the web, before CSS could do proper layouts, people used tables for *everything*. The logo was in one cell, the menu in another, the article in a third. Entire websites were giant invisible spreadsheets.

It worked visually. But imagine a screen reader announcing your homepage as "table with 3 columns and 12 rows, row 1, column 1, logo..." It's like giving someone directions around your house by describing the floor tiles. Those layouts were also rigid, broke on phones, and were a nightmare to update.

So here's the rule: **use a table only when the data truly has rows and columns that mean something.** Timetables, price comparisons, sports scores, a grade book. If you'd put it in a spreadsheet, a table is probably right.

For page layout, like putting a sidebar next to your content, you'll use [Semantic HTML](/lessons/html/semantic-html) for the structure and CSS for the positioning. The [Intro to CSS](/lessons/css/intro-to-css) lesson is where that journey starts.

## Try it

<WebPlayground
	:panes="['html', 'css']"
	:initial-html="'<table>\n\t<caption>Weekday trains from Central Station</caption>\n\t<thead>\n\t\t<tr>\n\t\t\t<th scope=\'col\'>Train</th>\n\t\t\t<th scope=\'col\'>Riverside</th>\n\t\t\t<th scope=\'col\'>Hilltop</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<th scope=\'row\'>Morning Express</th>\n\t\t\t<td>7:15</td>\n\t\t\t<td>7:40</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<th scope=\'row\'>Midday Local</th>\n\t\t\t<td>12:05</td>\n\t\t\t<td>12:45</td>\n\t\t</tr>\n\t</tbody>\n</table>'"
	:initial-css="'/* Just enough CSS to see the grid. You will learn this in the CSS track. */\ntable, th, td {\n\tborder: 1px solid #999;\n\tborder-collapse: collapse;\n\tpadding: 6px 10px;\n}\n'"
	preview-height="240px"
/>

## Try it yourself

1. Add a third train, "Evening Local," as a new row in the `<tbody>`.
2. Make its two time cells into one merged cell that says "Cancelled this week," using `colspan`.
3. Add a `<tfoot>` with one row that says "Times may change on holidays," stretched across all three columns.

## Check your understanding

<Quiz
	question="Which element gives a table a title that describes its contents?"
	:options="['<title>', '<caption>', '<thead>', '<th>']"
	:answer-index="1"
	explanation="caption sits at the top of a table and tells everyone what it is about."
/>

<Quiz
	question="Which of these should NOT be built with a table?"
	:options="['A class grade book', 'A price comparison of three phone plans', 'A page layout with a sidebar next to the main content', 'A sports league standings chart']"
	:answer-index="2"
	explanation="Tables are for data with meaningful rows and columns. Page layout is a job for semantic elements and CSS."
/>

<Quiz
	question="Fill in the blank: <th ___='col'> tells assistive technology this header labels a column."
	:options="['type', 'scope', 'span', 'for']"
	:answer-index="1"
	explanation="scope says which direction a header cell applies to: col for a column, row for a row."
/>

## Up next

Tables let you *show* data. Next, we'll learn to *collect* it, starting with [Forms: The Basics](/lessons/html/forms-part-1).
