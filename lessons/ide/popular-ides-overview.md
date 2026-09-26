---
title: Popular IDEs & Code Editors Overview
description: A tour of real IDEs and code editors developers use today, who made each one, why, and which one is used the most.
---

# Popular IDEs & Code Editors Overview

There is no single IDE that every developer uses. Different ones grew popular for different reasons, often shaped by the language they were originally built for. This lesson introduces several real ones you are likely to hear about, and answers a simple follow-up question: which one do most developers actually reach for?

Each program below links to its own official website, where you can see real, current screenshots of its interface. This book does not reproduce those images directly, since each interface is the copyrighted design of its own company, but the official page is one click away for every one of them.

## Visual Studio Code

- **Official site:** [code.visualstudio.com](https://code.visualstudio.com)
- **Who made it:** Microsoft.
- **When:** first released in 2015.
- **Why it was created:** Microsoft already made a large, powerful IDE called Visual Studio, but it was heavy and mostly built around Windows. Microsoft wanted something free, fast, and lightweight instead, that worked equally well on Windows, Mac, and Linux, and for many different languages, not just one.
- **Versions:** it does not use big numbered versions. Instead, it gets small updates roughly every month, and has done so continuously since 2015.
- **Its environment:** a file explorer on the side, a huge library of add-ons called extensions, a built-in terminal, and built-in support for tracking code changes over time.

## Visual Studio

- **Official site:** [visualstudio.microsoft.com](https://visualstudio.microsoft.com)
- **Who made it:** Microsoft.

Do not confuse this with Visual Studio Code above. They share a name and a maker, but are otherwise different programs.

- **When:** first released in 1997.
- **Why it was created:** Microsoft wanted one large, complete tool for building full Windows applications, handling writing, testing, and debugging code all in one place, mainly for languages like C++ and later C#.
- **Versions:** named by year, such as Visual Studio 2019 and Visual Studio 2022.
- **Its environment:** much bigger and heavier than Visual Studio Code, with deep tools for testing and debugging large, professional applications. Mostly used for Windows software.

## IntelliJ IDEA

- **Official site:** [jetbrains.com/idea](https://www.jetbrains.com/idea/)
- **Who made it:** a company called JetBrains.
- **When:** first released in 2001.
- **Why it was created:** JetBrains wanted to build a smarter IDE for the Java language, with much better help while typing, like catching mistakes early and automatically renaming things safely across an entire project.
- **Versions:** continues to release yearly updates, and comes in a free Community edition and a paid Ultimate edition with extra tools.
- **Its environment:** known for unusually smart suggestions while you type, and for reorganizing code safely for you. JetBrains also builds sibling IDEs for other languages, using similar ideas, including the two below.

## PyCharm

- **Official site:** [jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/)
- **Who made it:** JetBrains, the same company behind IntelliJ IDEA.
- **When:** first released in 2010.
- **Why it was created:** JetBrains wanted to give Python developers the same smart, dedicated experience they had already built for Java, but tailored specifically to Python's own tools and libraries.
- **Versions:** comes in a free Community edition and a paid Professional edition, which adds tools for web frameworks and databases.
- **Its environment:** built entirely around Python projects, including easy ways to manage separate, isolated Python setups for different projects, and built-in testing tools.

## WebStorm

- **Official site:** [jetbrains.com/webstorm](https://www.jetbrains.com/webstorm/)
- **Who made it:** JetBrains, again applying the same IntelliJ-based ideas to a new language.
- **When:** first released in 2010.
- **Why it was created:** to give JavaScript and TypeScript developers the same smart, dedicated experience as IntelliJ IDEA and PyCharm, tailored to front-end and Node.js work specifically.
- **Versions:** a paid product with continuous yearly updates, though many of its core JavaScript tools are also included free inside IntelliJ IDEA Ultimate.
- **Its environment:** deep support for modern JavaScript frameworks, built-in debugging for both browser and Node.js code, and the same safe project-wide renaming IntelliJ IDEA is known for.

## Sublime Text

- **Official site:** [sublimetext.com](https://www.sublimetext.com/)
- **Who made it:** a developer named Jon Skinner.
- **When:** first released in 2008.
- **Why it was created:** Jon Skinner wanted an extremely fast, lightweight editor that stayed smooth even in huge files, with a quick way to jump straight to any file in a project by typing just a few letters.
- **Versions:** Sublime Text 1 in 2008, Sublime Text 2 in 2011, Sublime Text 3 in 2013, and Sublime Text 4 in 2021.
- **Its environment:** minimal and very fast, with fewer built-in features than the others on this list, favored by developers who value speed and simplicity above all else.

## Eclipse

- **Official site:** [eclipseide.org](https://eclipseide.org/)
- **Who made it:** originally IBM, then handed over to a nonprofit group called the Eclipse Foundation in 2004, so many companies could help build it together for free.
- **When:** first released in 2001.
- **Why it was created:** IBM wanted a free, open tool that many different companies and developers could all build on and extend together, instead of everyone building separate closed tools.
- **Versions:** has had yearly named releases for many years.
- **Its environment:** built around add-ons called plugins, letting it be extended for many different languages. It was historically the most popular Java IDE before IntelliJ IDEA became more common.

## So which one do most developers actually use?

In wide surveys of professional developers, like the well known Stack Overflow Developer Survey, one tool from the list above has come out on top for several years in a row: **Visual Studio Code**.

No single reason explains it. It is really a combination of smaller advantages that add up: it is free, it runs identically on Windows, Mac, and Linux, it stays fast even though it can do a lot, and it has a huge library of extensions that let it cover almost any language a developer works in, backed by a large, active community. Put together, this is why so many developers, from complete beginners to experienced professionals, tend to land on the same tool.

That popularity is exactly why the [rest of this section](/lessons/ide/setting-up-your-ide) uses VS Code for its hands-on steps. The [next lesson](/lessons/ide/choosing-the-right-ide) looks more closely at how to actually decide between it and the others above, based on what you are trying to build.

## Check your understanding

<Quiz
	question="Which two IDEs on this page were both made by the same company, JetBrains?"
	:options="['Visual Studio and Visual Studio Code', 'IntelliJ IDEA and PyCharm', 'Sublime Text and Eclipse', 'Eclipse and Visual Studio']"
	:answer-index="1"
	explanation="JetBrains made both IntelliJ IDEA, originally for Java, and PyCharm and WebStorm, built later using similar ideas for Python and JavaScript."
/>

<Quiz
	question="According to widely used developer surveys, which IDE is currently used by the most developers?"
	:options="['Eclipse', 'Visual Studio Code', 'Sublime Text', 'IntelliJ IDEA']"
	:answer-index="1"
	explanation="Visual Studio Code has topped wide developer surveys, like the Stack Overflow Developer Survey, for several years running."
/>

## What you learned

- Visual Studio Code was made by Microsoft in 2015, as a free, fast, cross-platform alternative to the older, heavier Visual Studio.
- Visual Studio, also by Microsoft, dates back to 1997, and is a large, complete tool mainly for Windows applications.
- IntelliJ IDEA, PyCharm, and WebStorm are all made by JetBrains, applying the same smart-suggestion ideas to Java, Python, and JavaScript respectively.
- Sublime Text, made by Jon Skinner in 2008, values speed and simplicity above extra built-in features.
- Eclipse, started by IBM in 2001 and later handed to a nonprofit, is built around add-ons called plugins.
- Visual Studio Code is currently the most used IDE among developers, according to wide surveys, thanks to being free, fast, cross-platform, and backed by a huge extension library and community.
