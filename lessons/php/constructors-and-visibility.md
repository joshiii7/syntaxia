---
title: "PHP Constructors, Visibility, and readonly Properties"
description: "Set objects up properly with PHP constructors and constructor promotion, protect their data with private and public, and lock values with readonly properties and class constants."
---

# Constructors and Visibility

*A vending machine has a glass front and a few buttons. You can see the snacks and press the buttons, but you can't reach in and rearrange the coils. That's on purpose.*

In [Classes and Objects](/lessons/php/classes-and-objects), you made objects and filled in their properties one by one. That had two problems: it was easy to forget a property, and anyone could set any property to anything, like a book with -50 borrowed copies. This lesson fixes both.

## The constructor: setup on arrival

A **constructor** is a special method named `__construct` (with **two** underscores). PHP calls it automatically when you use `new`, and passes along the arguments:

```php
<?php
declare(strict_types=1);

class Pet
{
    public string $name;
    public string $sound;

    public function __construct(string $name, string $sound)
    {
        $this->name = $name;
        $this->sound = $sound;
    }
}

$dog = new Pet("Bantay", "Woof");
echo "$dog->name says $dog->sound!\n";
```

```text
Bantay says Woof!
```

Now every `Pet` gets its name and sound the moment it's created, in one line. Forget one, and PHP stops with a "Too few arguments" error straight away, instead of leaving a half-built object around.

## Constructor promotion: the shortcut

Writing each property three times (declare it, take it as a parameter, assign it) gets old. PHP 8 has a shortcut, called **constructor promotion**: put the visibility word before a constructor parameter, and PHP creates and fills the property for you:

```php
<?php
declare(strict_types=1);

class Pet
{
    public function __construct(
        public string $name,
        public string $sound,
    ) {
    }
}

$cat = new Pet("Mingming", "Meow");
echo "$cat->name says $cat->sound!\n";
```

```text
Mingming says Meow!
```

This does exactly the same as the longer version. You'll see this style everywhere in modern PHP.

## Visibility: public and private

Every property and method has a **visibility**:

- `public`: usable from anywhere.
- `private`: usable only by code **inside the class**.

(There's also `protected`, which you'll meet with inheritance in the next lesson.)

Here's why `private` matters. A bank account's balance shouldn't be something anyone can overwrite:

```php
<?php
declare(strict_types=1);

class BankAccount
{
    private int $balance = 0;

    public function deposit(int $amount): void
    {
        if ($amount <= 0) {
            echo "Deposits must be positive.\n";
            return;
        }
        $this->balance += $amount;
    }

    public function getBalance(): int
    {
        return $this->balance;
    }
}

$account = new BankAccount();
$account->deposit(500);
$account->deposit(-9999);
echo "Balance: " . $account->getBalance() . "\n";
```

```text
Deposits must be positive.
Balance: 500
```

And trying to reach in from outside fails:

```php
<?php
class BankAccount
{
    private int $balance = 0;
}

$account = new BankAccount();
$account->balance = 1000000;
// error: Cannot access private property BankAccount::$balance
```

That's the vending machine: the `public` methods are the buttons, and the `private` properties are behind the glass. The only way to change the balance is through `deposit`, which checks every amount. Hiding an object's data behind methods like this is called **encapsulation**.

A method like `getBalance`, which just returns a private property, is called a **getter**. A good default is: make properties `private`, and add public methods only for what the outside world really needs.

## readonly: set once, never change

Some values should be set when the object is created, and then never change, like a student's ID number. Mark them `readonly`:

```php
<?php
declare(strict_types=1);

class Student
{
    public function __construct(
        public readonly string $id,
        public string $name,
    ) {
    }
}

$s = new Student("2026-0042", "Maria");
$s->name = "Maria Santos";
echo "$s->id: $s->name\n";
$s->id = "9999";
// error: Cannot modify readonly property Student::$id
```

The name can change, but the ID is locked after the constructor sets it. `public readonly` is a nice combination: everyone can **read** the ID directly, so you don't need a getter, but nobody can change it.

## Class constants

A value that belongs to the class itself and never changes can be a **class constant**, written with `const` inside the class, and read with `::`:

```php
<?php
declare(strict_types=1);

class Ticket
{
    public const MAX_PER_ORDER = 6;

    public function __construct(private int $quantity)
    {
        if ($quantity > self::MAX_PER_ORDER) {
            $this->quantity = self::MAX_PER_ORDER;
        }
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }
}

echo "Limit: " . Ticket::MAX_PER_ORDER . "\n";
$order = new Ticket(10);
echo "Booked: " . $order->getQuantity() . "\n";
```

```text
Limit: 6
Booked: 6
```

Outside the class, it's `Ticket::MAX_PER_ORDER`. Inside, `self::` means "this class."

## Try it

A game character with protected health. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\ndeclare(strict_types=1);\n\nclass Hero\n{\n    public const MAX_HEALTH = 100;\n    private int $health = self::MAX_HEALTH;\n\n    public function __construct(\n        public readonly string $name,\n        private int $potions = 2,\n    ) {\n    }\n\n    public function takeDamage(int $amount): void\n    {\n        $this-&gt;health = max(0, $this-&gt;health - $amount);\n    }\n\n    public function drinkPotion(): string\n    {\n        if ($this-&gt;potions === 0) {\n            return &quot;$this-&gt;name has no potions left!&quot;;\n        }\n        $this-&gt;potions--;\n        $this-&gt;health = min(self::MAX_HEALTH, $this-&gt;health + 30);\n        return &quot;$this-&gt;name drinks a potion.&quot;;\n    }\n\n    public function status(): string\n    {\n        return &quot;$this-&gt;name: $this-&gt;health HP, $this-&gt;potions potion(s)&quot;;\n    }\n}\n\n$hero = new Hero(&quot;Lakan&quot;);\n$hero-&gt;takeDamage(45);\necho $hero-&gt;status(), &quot;\\n&quot;;\necho $hero-&gt;drinkPotion(), &quot;\\n&quot;;\necho $hero-&gt;drinkPotion(), &quot;\\n&quot;;\necho $hero-&gt;drinkPotion(), &quot;\\n&quot;;\necho $hero-&gt;status(), &quot;\\n&quot;;\n$hero-&gt;takeDamage(500);\necho $hero-&gt;status(), &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Lakan: 55 HP, 2 potion(s)
Lakan drinks a potion.
Lakan drinks a potion.
Lakan has no potions left!
Lakan: 100 HP, 0 potion(s)
Lakan: 0 HP, 0 potion(s)
```

The hero starts with 100 health and the default 2 potions. After 45 damage, it's 55. The first potion brings it to 85, and the second would give 115, but `min` caps it at 100. The third attempt finds no potions. `max(0, ...)` stops health going below zero.
:::

## Try it yourself

1. Create a second hero, `new Hero("Dayang", 5)`. How many potions does she have?
2. Add the line `$hero->health = 9999;` at the end. What does PHP say?
3. Add a public method `isAlive(): bool`, and print whether the hero is alive after the big hit.

## Check your understanding

<Quiz
	question="When does PHP call a class's __construct method?"
	:options="['When the script ends', 'Only when you call it by name', 'When a property changes', 'Automatically, when an object is created with new']"
	:answer-index="3"
	explanation="The constructor runs as part of new, receiving the arguments passed to new."
/>

<Quiz
	question="What can use a private property?"
	:options="['Any code in the same file', 'Only code inside the same class', 'Only code outside the class', 'Any code at all']"
	:answer-index="1"
	explanation="private limits a property to the class's own methods. Outside code has to go through public methods."
/>

<Quiz
	question="What does public readonly string $id allow?"
	:options="['Anyone can read and change it', 'Nobody can read it', 'Anyone can read it, but it cannot be changed after being set', 'It can only be set outside the class']"
	:answer-index="2"
	explanation="readonly properties are set once, usually in the constructor, and can't be changed afterward. public means anyone can read them."
/>

## Up next

What if you need several classes that are almost the same, like a `Dog` and a `Cat` that are both pets? Rather than copying code, they can share it, in [Inheritance and Interfaces](/lessons/php/inheritance-and-interfaces).
