---
title: "How to Install PHP on Windows, macOS, and Linux"
description: "Install PHP 8 on Windows, macOS, or Linux, turn on the settings this track needs, check that it works, and run your first page with PHP's built-in web server."
---

# Setting Up PHP on Your Computer

*A kitchen needs a stove before anyone can cook. This lesson installs yours.*

In [What Is PHP?](/lessons/php/introduction), you saw that PHP runs on a server, building pages before they're sent to the browser. To try it yourself, you don't need a real server somewhere on the internet. PHP can run right on your own computer, and it even includes a small web server for testing.

In this lesson, you'll install PHP, switch on a few settings this track uses, check that it works, and set up a code editor. Take it slowly, and follow the steps for your own computer.

## Which version?

Install the newest **PHP 8**. At the time of writing, that's **PHP 8.5** (8.5.11, released in September 2026). If a newer PHP 8 is available when you read this, use that instead. Everything in this track works with any recent version.

## Installing on Windows

PHP for Windows comes as a zip file rather than an installer.

1. Go to **windows.php.net** and open the **Download** page.
2. Under the newest PHP 8.5, find **VS17 x64 Non Thread Safe**, and download its **Zip**.
3. Make a folder called `C:\php`, and unzip everything into it, so that `php.exe` is at `C:\php\php.exe`.
4. Add `C:\php` to your **PATH**, so you can type `php` in any folder: search the Start menu for **Edit the system environment variables**, choose **Environment Variables**, select **Path** under your user variables, choose **Edit**, then **New**, and add `C:\php`.

Then create PHP's settings file, `php.ini`:

5. In `C:\php`, make a copy of `php.ini-development` and name the copy `php.ini`. (The "development" settings show every error message, which is what you want while learning.)
6. Open `php.ini` in a text editor and find these lines. Remove the `;` at the start of each one, which switches it on, and change the `extension_dir` line to the full path:

```text
extension_dir = "C:\php\ext"
extension=mbstring
extension=openssl
extension=pdo_sqlite
extension=sqlite3
```

`mbstring` helps with text in any language, `openssl` is needed for secure downloads, and the two `sqlite` lines let PHP use databases, which you'll need in [Databases with PDO](/lessons/php/databases-with-pdo).

**Another option:** a bundle called **XAMPP** installs PHP together with a web server and a database in one go. It's popular in schools. It works fine for this track, but its PHP version can lag behind, and the step-by-step way above teaches you where everything lives.

## Installing on macOS

macOS doesn't include PHP anymore. The easiest way to install it is **Homebrew**, a free tool for installing developer software (see **brew.sh** if you don't have it yet). In Terminal:

```text
brew install php
```

Homebrew's PHP already has the database and text extensions this track uses switched on.

## Installing on Linux

Install PHP's command-line version and the extensions from your package manager. On Ubuntu and Debian:

```text
sudo apt install php-cli php-sqlite3 php-mbstring
```

## Checking that it worked

Open a **new** terminal window (one that was open during the install may not know about PHP yet) and type:

```text
php -v
```

You should see something like this, though your numbers may differ:

```text
PHP 8.5.11 (cli) (built: Sep 22 2026 13:51:38) (NTS Visual C++ 2022 x64)
```

The `(cli)` means **command-line interface**: this is PHP running in your terminal. To check that the database extensions are on, run:

```text
php -m
```

That lists every loaded extension. Look for `pdo_sqlite` and `sqlite3` in the list.

## Running PHP two ways

**As a script in the terminal.** Save a file called `index.php` containing:

```php
<?php
echo "PHP is working!\n";
```

Then run it:

```text
php index.php
```

The output appears right in the terminal. That's how most examples in this track are run.

**As a web page, with the built-in server.** In the same folder, run:

```text
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser, and you'll see your page. `-S` starts PHP's own small web server, serving the files in the current folder. It's only meant for testing on your own computer, not for a real website. Press **Ctrl + C** in the terminal to stop it.

You'll need the web server for lessons about forms and sessions, starting with [Handling Forms: GET and POST](/lessons/php/forms), since those only make sense with a browser.

## Choosing a code editor

A good code editor colors your PHP, spots mistakes, and suggests function names as you type. Two popular options:

- **Visual Studio Code** with a PHP extension. Open the **Extensions** view and search for **PHP Intelephense**, a widely used one. You might already have VS Code from the [IDE track](/lessons/ide/introduction).
- **PhpStorm**, an editor built specifically for PHP. It's a paid product, but it offers free licenses for students.

Either works. Pick one and stick with it.

## When something goes wrong

**"'php' is not recognized" or "command not found"**

Close every terminal and open a new one. On Windows, check that `C:\php` is in your PATH, and that `php.exe` is directly inside `C:\php`, not in a folder inside it.

**`php -m` doesn't list `pdo_sqlite`**

On Windows, check that your file is named exactly `php.ini` (not `php.ini.txt`; Windows sometimes hides file extensions), that it's in `C:\php`, and that the `;` is removed from each line.

**The browser says it can't connect to localhost:8000**

The built-in server only runs while its terminal is open. Start it again with `php -S localhost:8000`, from the folder containing your files.

## Try it

This small script checks your setup: which PHP version is running, on which system, and whether the SQLite database driver is available. Predict what it prints.

<CodeEditor
	language="plaintext"
	label="PHP practice editor, index.php"
	min-height="200px"
	:model-value="'&lt;?php\necho &quot;PHP is working!\\n&quot;;\necho &quot;Version: &quot; . PHP_VERSION . &quot;\\n&quot;;\necho &quot;Operating system: &quot; . PHP_OS_FAMILY . &quot;\\n&quot;;\necho &quot;SQLite ready: &quot; . (extension_loaded(&quot;pdo_sqlite&quot;) ? &quot;yes&quot; : &quot;no&quot;) . &quot;\\n&quot;;\n'"
/>

::: info Running PHP here
Running PHP right in the browser is coming to Syntaxia soon. Once your setup works, save this as `index.php`, and run it with `php index.php`.
:::

::: details Check your prediction
The first line is always the same. The rest depend on your computer, so yours may look a little different:

```text
PHP is working!
Version: 8.5.11
Operating system: Windows
SQLite ready: yes
```

On a Mac, the operating system line says `Darwin`, and on Linux, `Linux`. If the last line says `no`, go back to the `php.ini` step (on Windows), or the package install step (on Linux).
:::

## Try it yourself

1. Run `php -v` in a new terminal and write down your version.
2. Make a folder called `php-practice`, save the Try it script in it as `index.php`, and run it with `php index.php`.
3. In the same folder, start the built-in server with `php -S localhost:8000`, and open `http://localhost:8000` in your browser. Where do the lines appear, and why are they all on one line in the browser? (Hint: browsers treat plain line breaks as spaces in HTML.)

## Check your understanding

<Quiz
	question="What does php -S localhost:8000 do?"
	:options="['Installs PHP', 'Starts PHP\'s built-in web server, serving the current folder at http://localhost:8000', 'Shows the PHP version', 'Uploads your site to the internet']"
	:answer-index="1"
	explanation="-S starts a small test web server on your own computer. It's for development only, not for real websites."
/>

<Quiz
	question="On Windows, why copy php.ini-development to php.ini?"
	:options="['To make PHP faster', 'PHP reads its settings from php.ini, and the development settings show every error while you learn', 'It is the license file', 'To delete the default settings']"
	:answer-index="1"
	explanation="php.ini holds PHP's settings. Starting from the development version shows all errors, and it's where you switch extensions on."
/>

<Quiz
	question="Which command lists the extensions PHP has loaded?"
	:options="['php -v', 'php -S', 'php --list', 'php -m']"
	:answer-index="3"
	explanation="php -m lists every loaded module, so you can check that pdo_sqlite and sqlite3 are there."
/>

## Up next

Your kitchen is ready. Time to cook something: in [Your First PHP Script](/lessons/php/first-script), you'll write a script from scratch and find out what every piece of it means.
