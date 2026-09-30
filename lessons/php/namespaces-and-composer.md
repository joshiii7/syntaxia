---
title: "PHP Namespaces, Autoloading, and Composer for Beginners"
description: "Organize PHP classes with namespaces and use, load them automatically with Composer's PSR-4 autoloader, and install other people's packages with composer require."
---

# Namespaces and Composer

*Two students in a school can both be called Maria. "Maria from 7-Rizal" and "Maria from 10-Mabini" are never confused. Namespaces are the section names for your classes.*

Real PHP projects have many classes, often one per file, and they use code written by other people: libraries for dates, emails, payments, and more. Two problems come with that:

1. **Name clashes.** Your project has a `Product` class, and so does a library you install. Which one does `new Product()` mean?
2. **Loading files.** With 50 class files, writing 50 `require` lines at the top of every page is no fun.

**Namespaces** solve the first problem, and **Composer** solves the second, while also installing those libraries for you.

## The clash

PHP won't allow two classes with the same name:

```php
<?php
class Product {}
class Product {}
// error: Cannot redeclare class Product
```

## Namespaces: section names for classes

A **namespace** gives your classes a family name. Declare it at the top of the file, right after `declare(strict_types=1);`:

```php
<?php
declare(strict_types=1);

namespace App\Shop;

class Product
{
    public function __construct(
        public string $name,
        public float $price,
    ) {
    }
}
```

This class's full name is now `App\Shop\Product`. Namespaces use **backslashes** `\` and are usually built like folder paths: your project's name (often `App`), then the area of the code. Another library's `Product` might be `Acme\Inventory\Product`, and the two never collide.

## use: calling it by its short name

Writing `new \App\Shop\Product(...)` everywhere would be tiring. A `use` statement at the top of a file says "when I write `Product`, I mean this one":

```php
use App\Shop\Product;

$pen = new Product("Pen", 12.5);
```

When two classes share a short name, rename one with `as`:

```php
use App\Shop\Product;
use Acme\Inventory\Product as StockItem;
```

Here's all of that in a single runnable file. (Real projects put each namespace in its own files; one file with several namespaces is just for trying it out.)

```php
<?php
namespace Shop;

class Product
{
    public function label(): string
    {
        return "Product for sale: " . static::class;
    }
}

namespace Warehouse;

class Product
{
    public function label(): string
    {
        return "Product in storage: " . static::class;
    }
}

namespace Main;

use Shop\Product;
use Warehouse\Product as StoredProduct;

echo (new Product())->label(), "\n";
echo (new StoredProduct())->label(), "\n";
echo (new \Shop\Product())->label(), "\n";
```

```text
Product for sale: Shop\Product
Product in storage: Warehouse\Product
Product for sale: Shop\Product
```

A name that starts with `\`, like `\Shop\Product`, is a **fully qualified** name: the complete address, which works anywhere without a `use`. PHP's own built-in functions, like `strlen`, keep working inside any namespace, so you don't need to do anything special for them.

## Composer: PHP's package manager

**Composer** is the standard tool for PHP projects. It does two jobs:

- **Installs packages**: libraries other people have published on **Packagist** (packagist.org), the main PHP package directory, along with whatever those libraries need in turn.
- **Loads your classes automatically**, so you never write a `require` line for a class again.

### Installing Composer

Get it from **getcomposer.org**. At the time of writing, the current version is Composer 2.10.

- **Windows**: download and run **Composer-Setup.exe** from the Download page. It finds your PHP and sets everything up.
- **macOS**: `brew install composer`.
- **Linux**: follow the command-line steps on the Download page.

Check it in a new terminal with `composer --version`. If Composer complains about a missing `zip` extension on Windows, remove the `;` from `extension=zip` in your `php.ini`, as you did for the others in [Setting Up](/lessons/php/setting-up).

### Installing a package

In your project folder, ask Composer for a package by its name. `nesbot/carbon` is a popular library for working with dates:

```text
composer require nesbot/carbon
```

Composer downloads it (and the packages it depends on) into a folder called `vendor`, and records what you installed in two files:

- `composer.json`: the packages your project needs. It's short and made for humans.
- `composer.lock`: the exact versions that were installed, so everyone working on the project gets the same ones.

Never edit the files in `vendor` yourself; Composer manages them. When sharing a project with Git, leave `vendor` out, since anyone can recreate it by running `composer install`.

### Autoloading your own classes

To have Composer load your own classes too, tell it where they live, in `composer.json`:

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    },
    "require": {
        "nesbot/carbon": "^3.14"
    }
}
```

This says: "a class whose name starts with `App\` is in the `src` folder, and the rest of its name is the path." So `App\Shop\Product` must be in `src/Shop/Product.php`. This naming rule is a shared standard called **PSR-4**, and nearly every PHP project follows it. (The `\\` is just how JSON writes a single backslash.)

After changing the `autoload` section, run `composer dump-autoload` once, so Composer notices.

The project now looks like this:

```text
my-shop/
├── composer.json
├── composer.lock
├── index.php
├── src/
│   └── Shop/
│       ├── Cart.php
│       └── Product.php
└── vendor/
    └── autoload.php  (and the installed packages)
```

### Using it all

One `require` line loads Composer's **autoloader**. After that, any class, yours or a package's, is loaded the moment you first use it:

```php
<?php
declare(strict_types=1);

require __DIR__ . "/vendor/autoload.php";

use App\Shop\Cart;
use App\Shop\Product;
use Carbon\Carbon;

$cart = new Cart();
$cart->add(new Product("Notebook", 45));
$cart->add(new Product("Pen", 12.5));

echo "Total: " . $cart->total() . "\n";

$sale = Carbon::create(2026, 10, 1)->addDays(10);
echo "Sale ends: " . $sale->format("F j, Y") . "\n";
```

With a `Cart` class in `src/Shop/Cart.php` that adds up its products' prices, `php index.php` prints:

```text
Total: 57.5
Sale ends: October 11, 2026
```

No `require` for `Cart`, `Product`, or Carbon. Composer found each file from its namespace.

## Try it

Here's a single-file version with two namespaces. Predict each line.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="460px"
	:model-value="'&lt;?php\nnamespace School\\Library;\n\nclass Card\n{\n    public function __construct(public string $owner)\n    {\n    }\n\n    public function describe(): string\n    {\n        return &quot;Library card for $this-&gt;owner&quot;;\n    }\n}\n\nnamespace School\\Canteen;\n\nclass Card\n{\n    public function __construct(public int $balance)\n    {\n    }\n\n    public function describe(): string\n    {\n        return &quot;Canteen card with PHP $this-&gt;balance&quot;;\n    }\n}\n\nnamespace App;\n\nuse School\\Library\\Card;\nuse School\\Canteen\\Card as MealCard;\n\n$cards = [new Card(&quot;Ana&quot;), new MealCard(150), new \\School\\Library\\Card(&quot;Ben&quot;)];\nforeach ($cards as $card) {\n    echo $card-&gt;describe() . &quot; (&quot; . $card::class . &quot;)\\n&quot;;\n}\necho strtoupper(&quot;namespaces done&quot;), &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have PHP installed on your computer (see [Setting Up](/lessons/php/setting-up)), save it as `index.php` and run it with `php index.php`.
:::

::: details Check your prediction
```text
Library card for Ana (School\Library\Card)
Canteen card with PHP 150 (School\Canteen\Card)
Library card for Ben (School\Library\Card)
NAMESPACES DONE
```

`Card` means the library card, because of the first `use`. `MealCard` is the canteen's `Card`, renamed with `as`. The third one uses the fully qualified name. `$card::class` shows each object's full class name, namespace included. And `strtoupper`, a built-in function, works fine inside the `App` namespace.
:::

## Try it yourself

1. Add a third namespace, `School\Clinic`, with its own `Card` class, and use it as `HealthCard`.
2. Make a real Composer project: create a folder, add the `composer.json` above (without the `require` part), put a class in `src/`, run `composer dump-autoload`, and use it from `index.php`.
3. In that project, run `composer require nesbot/carbon`, and print today's date with `Carbon::now()->format("l, F j")`.

## Check your understanding

<Quiz
	question="With PSR-4 mapping App\ to src/, where must the class App\Blog\Post be?"
	:options="['src/Post.php', 'src/Blog/Post.php', 'App/Blog/Post.php', 'vendor/Blog/Post.php']"
	:answer-index="1"
	explanation="The App\ prefix maps to src/, and the rest of the name, Blog\Post, becomes the path Blog/Post.php."
/>

<Quiz
	question="What does require __DIR__ . &quot;/vendor/autoload.php&quot; do?"
	:options="['Loads every class in the project immediately', 'Installs Composer', 'Downloads packages from the internet', 'Sets up Composer\'s autoloader, which loads each class when it is first used']"
	:answer-index="3"
	explanation="The autoloader loads class files on demand, the first time each class is used."
/>

<Quiz
	question="Why leave the vendor folder out of Git?"
	:options="['It contains passwords', 'Git cannot store PHP files', 'Anyone can recreate it with composer install, using composer.json and composer.lock', 'It is always empty']"
	:answer-index="2"
	explanation="composer.json and composer.lock describe exactly what to install, so the vendor folder can be rebuilt any time."
/>

## Up next

What should happen when something goes wrong: a missing file, a bad value, a database that's down? PHP's answer is exceptions. Learn to throw and catch them in [Errors and Exceptions](/lessons/php/exceptions).
