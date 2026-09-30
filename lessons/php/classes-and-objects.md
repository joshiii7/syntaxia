---
title: "PHP Classes and Objects: An Introduction to OOP"
description: "Start object-oriented PHP: define a class, create objects with new, give them properties and methods, use $this and ->, and see how each object keeps its own data."
---

# Classes and Objects

*A cookie cutter isn't a cookie. It's the shape that every cookie is made from. Each cookie you cut is its own cookie: you can frost one pink and one blue.*

In [Associative Arrays](/lessons/php/associative-arrays), you stored a student as `["name" => "Maria", "grade" => 88]`, and wrote separate functions to work with records like that. That works, but nothing connects the data to the functions, and nothing stops a typo like `$student["grdae"]`.

**Object-oriented programming** (OOP) bundles data and the functions that use it into one thing: an **object**. It's how most modern PHP is written, including frameworks like [Laravel](/lessons/laravel/introduction).

## Cookie cutter and cookies

- A **class** is the cookie cutter: a blueprint that describes what something has and what it can do.
- An **object** is a cookie: one actual thing made from the class. You can make as many as you like, and each one is separate.

```php
<?php
declare(strict_types=1);

class Pet
{
    public string $name = "";
    public string $sound = "";

    public function speak(): string
    {
        return "$this->name says $this->sound!";
    }
}

$dog = new Pet();
$dog->name = "Bantay";
$dog->sound = "Woof";

$cat = new Pet();
$cat->name = "Mingming";
$cat->sound = "Meow";

echo $dog->speak(), "\n";
echo $cat->speak(), "\n";
```

```text
Bantay says Woof!
Mingming says Meow!
```

Let's take it apart.

## Defining a class

- `class Pet` starts the blueprint. Class names use **PascalCase**: each word starts with a capital, like `Pet`, `ShoppingCart`, `BankAccount`.
- By convention, the opening `{` of a class and of its methods goes on its own line. (That's the common PHP style, called PSR-12.)
- `public string $name = "";` declares a **property**: a variable that every object of this class has. It has a type, like a function parameter, and a starting value.
- `public function speak()` declares a **method**: a function that belongs to the class.
- `public` means the property or method can be used from outside the class. The next lesson shows why you'd sometimes choose `private` instead.

## Making objects: new

`new Pet()` makes a new object from the class, and gives it back. `$dog` and `$cat` are two separate objects, each with its own `name` and `sound`.

## The arrow: ->

The **arrow** `->` reaches inside an object:

- `$dog->name` is the `name` property of `$dog`. Notice there's no `$` before `name`.
- `$dog->speak()` calls the `speak` method on `$dog`.

## $this: "the object I belong to"

Inside a method, `$this` means "the object this method was called on." When you call `$dog->speak()`, `$this` is `$dog`, so `$this->name` is `"Bantay"`. Call `$cat->speak()`, and the very same code reads `"Mingming"`.

That's the key idea: one method, written once in the class, works with whichever object it's called on.

## Methods that change the object

Methods can change their object's properties, too:

```php
<?php
declare(strict_types=1);

class Counter
{
    public int $count = 0;

    public function increment(): void
    {
        $this->count++;
    }
}

$clicks = new Counter();
$likes = new Counter();

$clicks->increment();
$clicks->increment();
$likes->increment();

echo "Clicks: $clicks->count, likes: $likes->count\n";
```

```text
Clicks: 2, likes: 1
```

Each object keeps its own count, just like each cookie keeps its own frosting.

## Typed properties catch mistakes

Because the properties have types, PHP catches wrong values:

```php
<?php
declare(strict_types=1);

class Counter
{
    public int $count = 0;
}

$c = new Counter();
$c->count = "many";
// error: Cannot assign string to property Counter::$count of type int
```

`Counter::$count` is how PHP names "the `$count` property of the `Counter` class."

And since the class lists its properties, your code editor can suggest them as you type, and warn you about a typo like `$c->cuont`. That's a big step up from array keys, which could be anything.

## Looking inside an object

`var_dump` and `print_r` work on objects, too:

```php
<?php
class Book
{
    public string $title = "Noli Me Tangere";
    public int $pages = 438;
}

print_r(new Book());
```

```text
Book Object
(
    [title] => Noli Me Tangere
    [pages] => 438
)
```

## Try it

A school library tracks its books as objects. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nclass Book\n{\n    public string $title = &quot;&quot;;\n    public int $copies = 0;\n    public int $borrowed = 0;\n\n    public function available(): int\n    {\n        return $this-&gt;copies - $this-&gt;borrowed;\n    }\n\n    public function borrow(): string\n    {\n        if ($this-&gt;available() === 0) {\n            return &quot;No copies of $this-&gt;title left.&quot;;\n        }\n        $this-&gt;borrowed++;\n        return &quot;Borrowed $this-&gt;title. &quot; . $this-&gt;available() . &quot; left.&quot;;\n    }\n}\n\n$noli = new Book();\n$noli-&gt;title = &quot;Noli Me Tangere&quot;;\n$noli-&gt;copies = 2;\n\n$elFili = new Book();\n$elFili-&gt;title = &quot;El Filibusterismo&quot;;\n$elFili-&gt;copies = 1;\n\necho $noli-&gt;borrow(), &quot;\\n&quot;;\necho $elFili-&gt;borrow(), &quot;\\n&quot;;\necho $noli-&gt;borrow(), &quot;\\n&quot;;\necho $noli-&gt;borrow(), &quot;\\n&quot;;\necho &quot;El Fili available: &quot; . $elFili-&gt;available() . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Borrowed Noli Me Tangere. 1 left.
Borrowed El Filibusterismo. 0 left.
Borrowed Noli Me Tangere. 0 left.
No copies of Noli Me Tangere left.
El Fili available: 0
```

Each book tracks its own `borrowed` count. The Noli has 2 copies, so the third attempt finds none left. `borrow` calls `available` on the same object, using `$this`.
:::

## Try it yourself

1. Add a method `giveBack(): void` that lowers `borrowed` by 1, and use it on the Noli before the last `borrow`.
2. Add an `author` property, and change `borrow`'s message to include it.
3. Try `$noli->copies = "two";`. What does PHP say, and why?

## Check your understanding

<Quiz
	question="What's the difference between a class and an object?"
	:options="['They are the same thing', 'An object is the blueprint; a class is made from it', 'A class can only have one object', 'A class is the blueprint; an object is one thing made from it']"
	:answer-index="3"
	explanation="A class describes what objects have and do. new creates objects from it, as many as you like."
/>

<Quiz
	question="Inside a method, what does $this refer to?"
	:options="['The object the method was called on', 'The class itself', 'The first object ever created', 'The current file']"
	:answer-index="0"
	explanation="When you call $dog->speak(), $this inside speak() is $dog."
/>

<Quiz
	question="How do you read the title property of the object in $book?"
	:options="['$book[&quot;title&quot;]', '$book.title', '$book->title', '$book->$title']"
	:answer-index="2"
	explanation="The arrow reaches into an object, and the property name has no $ after the arrow."
/>

## Up next

Setting every property by hand after `new` is tedious, and nothing stops someone setting `borrowed` to -50. Next, you'll give your classes a proper setup step and protect their data, in [Constructors and Visibility](/lessons/php/constructors-and-visibility).
