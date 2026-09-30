---
title: "JavaScript Objects: Properties, Methods, and Optional Chaining"
description: "Group related data in JavaScript objects: read and update properties with dot and bracket notation, add methods, loop over keys, use ?. safely, and compare objects."
---

# Objects

*An object is a filled-in form: every box has a label, and every label has an answer.*

An array is great for a list of similar things. But how would you describe a single product? It has a name, a price, a stock count, whether it's vegan. You *could* put those in an array, `['Sourdough', 8, 12, true]`, but then what does `[2]` mean? You'd need to memorize that the third slot is the stock count.

There's a better way: give each value a label.

## A labeled form

Picture a paper form: "Name: ______. Price: ______. In stock: ______." Every answer sits next to a label that says what it means. That's an **object**:

```js
const bread = {
	name: 'Sourdough',
	price: 8,
	stock: 12,
	isVegan: true,
};
```

- Curly braces make an object.
- Each line is a **property**: a **key** (the label), a colon, and a **value** (the answer).
- Properties are separated by commas. A comma after the last one is allowed, and makes adding a new line later tidier.

Values can be anything: strings, numbers, booleans, arrays, even other objects.

## Reading properties

**Dot notation**, the everyday way:

```js
console.log(bread.name);    // 'Sourdough'
console.log(bread.price);   // 8
```

**Bracket notation**, with the key as a string:

```js
console.log(bread['name']);   // 'Sourdough'
```

Why have two? Brackets let you use a key that's stored in a variable:

```js
const field = 'stock';
console.log(bread[field]);    // 12
console.log(bread.field);     // undefined: looks for a key literally named "field"
```

Use dots whenever you know the key while writing the code. Use brackets when the key comes from a variable. Asking for a key that doesn't exist gives `undefined`, not an error.

## Changing, adding, and removing

```js
bread.price = 9;           // change an existing property
bread.bakedAt = '6am';     // add a new one
delete bread.isVegan;      // remove one
```

Just like arrays, an object stored in a `const` can have its properties changed. `const` only stops you from replacing the whole object.

## Objects inside objects

Real data is usually nested:

```js
const order = {
	id: 1042,
	customer: {
		name: 'Ana',
		email: 'ana@example.com',
	},
	items: ['Sourdough', 'Coffee'],
};

console.log(order.customer.name);   // 'Ana'
console.log(order.items[1]);        // 'Coffee'
```

Read the dots left to right, one step deeper each time: "the order's customer's name."

## Safe digging with `?.`

What if the customer is missing?

```js
const walkIn = { id: 1043, items: ['Rye'] };

console.log(walkIn.customer.name);
// TypeError: Cannot read properties of undefined (reading 'name')
```

`walkIn.customer` is `undefined`, and you can't read a property of `undefined`. This is one of the most common errors in JavaScript. The **optional chaining** operator `?.` stops early instead of crashing:

```js
console.log(walkIn.customer?.name);   // undefined, no error
```

Read `?.` as "and if that exists, then..." It pairs beautifully with `??` from [Operators and Comparisons](/lessons/javascript/operators):

```js
const displayName = walkIn.customer?.name ?? 'Guest';
```

Use it where something is genuinely optional. Don't scatter it everywhere: if a value *should* always exist, a loud error helps you find the real bug.

## Methods: functions that belong to an object

A property can hold a function. Then it's called a **method**:

```js
const bakery = {
	name: "Maria's Bakery",
	openHour: 7,
	isOpenAt(hour) {
		return hour >= this.openHour && hour < 17;
	},
};

console.log(bakery.isOpenAt(9));   // true
```

You've been using methods all along: `console.log` is the `log` method of the `console` object, and `push` is a method of every array.

That `this` means "the object this method was called on," so `this.openHour` is the bakery's `openHour`. `this` has some surprising behavior, and it gets a full lesson in [this and Classes](/lessons/javascript/this-and-classes).

## Looping over an object

Three built-in helpers turn an object into arrays you can loop over:

```js
const stock = { sourdough: 12, rye: 0, focaccia: 5 };

console.log(Object.keys(stock));     // ['sourdough', 'rye', 'focaccia']
console.log(Object.values(stock));   // [12, 0, 5]

for (const [bread, count] of Object.entries(stock)) {
	console.log(`${bread}: ${count}`);
}
```

`Object.entries` gives you pairs of `[key, value]`. The `[bread, count]` part unpacks each pair into two variables, a trick called destructuring that's coming up in [Destructuring and Spread](/lessons/javascript/destructuring-and-spread).

To check whether a key exists, use `Object.hasOwn(stock, 'rye')` or `'rye' in stock`. Don't just check `if (stock.rye)`: a stock of `0` is falsy, and you'd wrongly conclude rye isn't on the list at all.

## Arrays of objects

Most real data looks like this, a list of labeled forms:

```js
const products = [
	{ name: 'Sourdough', price: 8 },
	{ name: 'Rye', price: 7 },
];
```

That's exactly the shape you worked with in [Array Methods](/lessons/javascript/array-methods), and it's the shape you'll get from almost every server you ever load data from.

## Comparing objects

One more surprise, related to the sharing surprise from [Arrays](/lessons/javascript/arrays):

```js
const a = { name: 'Rye' };
const b = { name: 'Rye' };

console.log(a === b);   // false
console.log(a === a);   // true
```

`===` on objects doesn't compare their contents. It asks "are these the *same* object?" Two forms with identical answers written on them are still two separate pieces of paper. To compare contents, compare the properties you care about: `a.name === b.name`.

## Try it

<WebPlayground
	:panes="['html', 'javascript']"
	:initial-html="'<article id=\'card\'>\n\t<h3 id=\'name\'></h3>\n\t<p id=\'details\'></p>\n</article>'"
	:initial-js="'const bread = {\n\tname: \'Sourdough\',\n\tprice: 8,\n\tstock: 12,\n\tisVegan: true,\n\tlabel() {\n\t\treturn `${this.name}, $${this.price}`;\n\t},\n};\n\nconsole.log(bread.name, bread[\'price\']);\n\nbread.stock -= 2;\nbread.bakedAt = \'6am\';\nconsole.log(bread);\nconsole.log(\'Label:\', bread.label());\n\nconst walkIn = { id: 1043, items: [\'Rye\'] };\nconsole.log(\'Customer:\', walkIn.customer?.name ?? \'Guest\');\n\nfor (const [key, value] of Object.entries(bread)) {\n\tconsole.log(key, \'=\', value);\n}\n\ndocument.querySelector(\'#name\').textContent = bread.label();\ndocument.querySelector(\'#details\').textContent = `${bread.stock} left, baked at ${bread.bakedAt}. ${bread.isVegan ? \'Vegan.\' : \'\'}`;\n'"
	show-console
	preview-height="110px"
/>

## Try it yourself

1. Add a `category` property with the value `'Loaves'`, and show it in the card's details.
2. Delete `isVegan` with `delete`, and see how the details line handles the missing value.
3. Remove the `?.` from the `walkIn` line and read the error. Then put it back.

## Check your understanding

<Quiz
	question="const key = 'price'; Which line reads the price property using the variable?"
	:options="['bread.key', 'bread[key]', 'bread.[key]', 'bread(key)']"
	:answer-index="1"
	explanation="Brackets use the value stored in key. bread.key would look for a property literally named key."
/>

<Quiz
	question="order.customer is undefined. What does order.customer?.name give?"
	:options="['An error', 'null', 'undefined', 'An empty string']"
	:answer-index="2"
	explanation="Optional chaining stops at the missing customer and returns undefined instead of throwing an error."
/>

<Quiz
	question="What does { a: 1 } === { a: 1 } evaluate to?"
	:options="['true', 'false', 'undefined', 'An error']"
	:answer-index="1"
	explanation="They are two separate objects. === on objects checks whether they are the same object, not whether their contents match."
/>

## Up next

You've seen `[bread, count]` pull two values out of a pair, and `[...prices]` copy an array. Those are two of the most popular modern shortcuts in JavaScript. Next up: [Destructuring and Spread](/lessons/javascript/destructuring-and-spread).
