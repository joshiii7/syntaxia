---
title: "PHP Inheritance, Abstract Classes, and Interfaces"
description: "Share code between PHP classes with extends, override methods, call parent::, use protected, and define contracts with abstract classes and interfaces."
---

# Inheritance and Interfaces

*Every phone charger has a different shape and brand, but they all fit the same kind of socket. The socket doesn't care who made the charger, only that it fits.*

As your programs grow, you'll notice classes that are almost the same. A `Dog` and a `Cat` both have a name and can make a sound. A `CashPayment` and a `CardPayment` both have an amount and can be paid. Copying the shared parts into every class means fixing every copy whenever something changes.

PHP gives you two tools for this: **inheritance**, to share code, and **interfaces**, to share a promise.

## Inheritance: extends

A class can **extend** another class. It then gets all of that class's properties and methods, and can add its own:

```php
<?php
declare(strict_types=1);

class Animal
{
    public function __construct(public string $name)
    {
    }

    public function describe(): string
    {
        return "$this->name is an animal.";
    }
}

class Dog extends Animal
{
    public function fetch(): string
    {
        return "$this->name fetches the ball!";
    }
}

$dog = new Dog("Bantay");
echo $dog->describe(), "\n";
echo $dog->fetch(), "\n";
```

```text
Bantay is an animal.
Bantay fetches the ball!
```

- `Animal` is the **parent** class (also called the base class).
- `Dog` is the **child** class. It **inherits** the constructor, the `name` property, and `describe`, without writing them again, and adds `fetch`.

A good test for inheritance is the phrase "is a": a dog **is an** animal. If that sentence sounds wrong, like "a cart is a product", inheritance is the wrong tool.

## Overriding a method

A child class can replace a parent's method with its own version, by defining a method with the same name. That's called **overriding**:

```php
<?php
declare(strict_types=1);

class Animal
{
    public function __construct(public string $name)
    {
    }

    public function speak(): string
    {
        return "$this->name makes a sound.";
    }
}

class Cat extends Animal
{
    public function speak(): string
    {
        return "$this->name says meow.";
    }
}

class Parrot extends Animal
{
    public function __construct(string $name, public string $phrase)
    {
        parent::__construct($name);
    }

    public function speak(): string
    {
        return parent::speak() . " It says \"$this->phrase\"!";
    }
}

echo (new Cat("Mingming"))->speak(), "\n";
echo (new Parrot("Rio", "Hello"))->speak(), "\n";
```

```text
Mingming says meow.
Rio makes a sound. It says "Hello"!
```

`parent::` calls the parent's version of a method. The `Parrot` uses it twice: its constructor passes the name up to `Animal`'s constructor, and its `speak` builds on the parent's sentence instead of replacing it completely.

## protected: for the family

In [Constructors and Visibility](/lessons/php/constructors-and-visibility), you met `public` and `private`. The third option, `protected`, sits in between: usable inside the class **and its child classes**, but not from outside. A child class can't touch its parent's `private` properties, so use `protected` for things children need.

## Abstract classes: incomplete on purpose

Sometimes a parent class is only a starting point. There's no such thing as a plain "shape"; there are circles and rectangles. Mark such a class `abstract`: it can't be created with `new`, only extended. It can also declare **abstract methods**, with no body, which every child **must** write:

```php
<?php
declare(strict_types=1);

abstract class Shape
{
    abstract public function area(): float;

    public function describe(): string
    {
        return static::class . " with area " . round($this->area(), 2);
    }
}

class Circle extends Shape
{
    public function __construct(private float $radius)
    {
    }

    public function area(): float
    {
        return M_PI * $this->radius ** 2;
    }
}

class Rectangle extends Shape
{
    public function __construct(private float $width, private float $height)
    {
    }

    public function area(): float
    {
        return $this->width * $this->height;
    }
}

echo (new Circle(2))->describe(), "\n";
echo (new Rectangle(3, 4.5))->describe(), "\n";
```

```text
Circle with area 12.57
Rectangle with area 13.5
```

`describe` is written once, in `Shape`, and calls `area`, trusting that every child has one. `static::class` gives the name of the actual class, and `M_PI` is PHP's built-in value of π.

## Interfaces: a promise

An **interface** is a list of methods a class promises to have, with no code at all. It's the socket shape from the start of the lesson:

```php
<?php
declare(strict_types=1);

interface Payable
{
    public function pay(float $amount): string;
}

class Cash implements Payable
{
    public function pay(float $amount): string
    {
        return "Paid PHP $amount in cash.";
    }
}

class GCash implements Payable
{
    public function __construct(private string $number)
    {
    }

    public function pay(float $amount): string
    {
        return "Sent PHP $amount from $this->number.";
    }
}

function checkout(Payable $method, float $total): void
{
    echo $method->pay($total), "\n";
}

checkout(new Cash(), 250);
checkout(new GCash("0917-555-0142"), 99.5);
```

```text
Paid PHP 250 in cash.
Sent PHP 99.5 from 0917-555-0142.
```

The `checkout` function accepts **any** `Payable`. It doesn't know or care whether it's cash or an e-wallet; it only knows it can call `pay`. Tomorrow, you could add a `Card` class that implements `Payable`, and `checkout` would work with it without any change. This idea, one piece of code working with many kinds of objects, is called **polymorphism**.

If a class says `implements Payable` but forgets the `pay` method, PHP refuses to run the file at all.

## Inheritance or interface?

- A class can **extend only one** parent, but can **implement many** interfaces: `class Dog extends Animal implements Trainable, Printable`.
- Use **inheritance** when classes share real code, and truly have an "is a" relationship.
- Use an **interface** when unrelated classes need to be used the same way: cash and GCash share nothing but the ability to pay.

Many experienced programmers reach for interfaces first, and inheritance only when there's a lot of genuinely shared code. Deep chains of inheritance (a class extending a class extending a class...) get hard to follow quickly.

## Try it

A school has different kinds of people, and prints a directory. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="480px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\ninterface HasBadge\n{\n    public function badge(): string;\n}\n\nabstract class Person implements HasBadge\n{\n    public function __construct(protected string $name)\n    {\n    }\n\n    abstract protected function role(): string;\n\n    public function badge(): string\n    {\n        return &quot;[&quot; . strtoupper($this-&gt;role()) . &quot;] $this-&gt;name&quot;;\n    }\n}\n\nclass Student extends Person\n{\n    public function __construct(string $name, private int $grade)\n    {\n        parent::__construct($name);\n    }\n\n    protected function role(): string\n    {\n        return &quot;grade $this-&gt;grade&quot;;\n    }\n}\n\nclass Teacher extends Person\n{\n    protected function role(): string\n    {\n        return &quot;teacher&quot;;\n    }\n\n    public function badge(): string\n    {\n        return parent::badge() . &quot; *&quot;;\n    }\n}\n\nclass Visitor implements HasBadge\n{\n    public function badge(): string\n    {\n        return &quot;[VISITOR]&quot;;\n    }\n}\n\n$people = [new Student(&quot;Ana&quot;, 9), new Teacher(&quot;Mr. Cruz&quot;), new Visitor()];\nforeach ($people as $person) {\n    echo $person-&gt;badge(), &quot;\\n&quot;;\n}\nvar_dump($people[1] instanceof Person);\nvar_dump($people[2] instanceof Person);\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
[GRADE 9] Ana
[TEACHER] Mr. Cruz *
[VISITOR]
bool(true)
bool(false)
```

The loop calls `badge()` on three different kinds of objects; each answers in its own way. The student and teacher use `Person`'s `badge`, which calls their own `role`. The teacher also overrides `badge` to add a star, building on `parent::badge()`. The visitor isn't a `Person` at all, just something with a badge, and `instanceof` checks exactly that: whether an object is of a class, or one of its children.
:::

## Try it yourself

1. Add a `Guard` class that extends `Person`, with the role `"security"`, and add one to `$people`.
2. Try `new Person("Nobody")`. What does PHP say?
3. Remove the `role` method from `Teacher`. What happens, and why?

## Check your understanding

<Quiz
	question="What does class Dog extends Animal do?"
	:options="['Gives Dog all of Animal\'s properties and methods', 'Copies the Animal file into Dog', 'Makes Animal a child of Dog', 'Creates a Dog object']"
	:answer-index="0"
	explanation="The child class inherits everything from the parent, and can add or override methods."
/>

<Quiz
	question="What is an interface?"
	:options="['A list of methods a class promises to have', 'A class that can only have one object', 'A private property', 'A kind of loop']"
	:answer-index="0"
	explanation="An interface lists method signatures without code. A class that implements it must provide every one."
/>

<Quiz
	question="How many classes can a PHP class extend?"
	:options="['As many as it likes', 'Two', 'One', 'None']"
	:answer-index="2"
	explanation="A class extends at most one parent, but it can implement any number of interfaces."
/>

## Up next

Real projects have dozens of classes, and use code written by other people. How do you avoid two classes with the same name, and how do you install someone else's library? That's [Namespaces and Composer](/lessons/php/namespaces-and-composer).
