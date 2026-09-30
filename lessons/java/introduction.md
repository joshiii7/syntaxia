---
title: "What Is Java? An Introduction to Java for Beginners"
description: "Find out what Java is, where it came from, and where it runs today, from Android apps to banking systems, and why it makes a great first language to learn."
---

# What Java Is and Why It's Used

*Some languages are built for one job. Java was built to run almost anywhere, and it does.*

Welcome to the Java track. If you've worked through [HTML](/lessons/html/introduction), [CSS](/lessons/css/intro-to-css), or [JavaScript](/lessons/javascript/intro-to-javascript) on this site, you've been building things that live inside a web browser. Java is different. It's a general-purpose programming language, which means you can use it to build almost anything: phone apps, games, school systems, the software that runs a bank.

If this is your very first programming language, that's completely fine too. This track starts from zero. By the end of this lesson, you'll know what Java is, where it came from, where you'll find it today, and why it's a smart language to learn first.

## A universal adapter

Picture traveling to another country with your phone charger. The wall sockets there are a different shape, so your plug doesn't fit. You need an adapter for that country, and a different one for the next country after that.

In the early 1990s, software had the same problem. A program written for one kind of computer usually couldn't run on another kind without being rewritten. Java's big idea was to fix that. Instead of writing a separate version for every computer, you write your program once, and each computer gets its own "adapter" that lets it run your program. That adapter is called the **Java Virtual Machine**, or **JVM**. You'll see exactly how it works in [How Java Runs](/lessons/java/how-java-runs).

Java's creators summed it up in one slogan: **write once, run anywhere**.

## Where Java came from

Java was created at a company called **Sun Microsystems** by a team led by **James Gosling**. The project started in 1991, and the language was first named **Oak**, after a tree outside Gosling's office. It was renamed **Java** (after a type of coffee) and released to the public in **1995**.

In 2010, a company called **Oracle** bought Sun, and Oracle now leads Java's development together with a large open-source community. A new version of Java comes out every six months. Every two years, one of those versions is marked **LTS**, for "long-term support," meaning it gets updates and fixes for years. Most schools and companies use an LTS version, and so will you.

## Java is not JavaScript

This confuses almost everyone, so let's clear it up now. **Java and JavaScript are two completely different languages.** They were released in the same year, 1995, and JavaScript's name was mostly a marketing move to ride on Java's popularity. They're about as related as "car" and "carpet."

A few differences you'll notice right away:

- JavaScript runs mainly inside web browsers. Java runs on its own, on computers, servers, and phones.
- In JavaScript, a variable can hold any kind of value. In Java, you decide each variable's type up front, and it can't change.
- JavaScript finds many mistakes only when the line with the mistake actually runs. Java checks your whole program for mistakes, like a value of the wrong type, before any of it runs.

If you already know some JavaScript, lots of ideas will carry over, like variables, `if` statements, and loops. The details are just stricter.

## Where you'll find Java today

Java has been one of the world's most-used languages for about three decades. Some places it runs:

- **Android phones.** Android apps have been built with Java since the start. Many newer apps use a language called Kotlin, which runs on the same JVM and works side by side with Java.
- **Banks, stores, and big companies.** The systems behind online banking, airline bookings, and huge online shops often run on Java, because it's fast, stable, and good at handling many users at once.
- **Games.** The original version of Minecraft, now called Minecraft: Java Edition, is written in Java.
- **School.** Java is the language used in many high school and university computer science courses, including the AP Computer Science A exam.

## Why learn Java first?

Java has a reputation for being strict, and that's actually a strength when you're learning:

- **It catches mistakes early.** Java checks your whole program before it runs and tells you exactly which line has a problem. You'll fix many bugs before they ever happen.
- **It makes you say what you mean.** Because you have to name the type of every value, you'll build a clear picture of what your program is doing.
- **It teaches ideas that transfer.** Once you understand Java, languages like C#, Kotlin, and C++ will look very familiar.
- **It's used for real work.** The skills you build here are the same ones used by professional developers every day.

The trade-off is that Java programs are a little wordier than some other languages. Even the smallest program needs a few lines of setup. Don't worry: by the end of [Your First Java Program](/lessons/java/first-program), every one of those lines will make sense.

## Try it

Here's a complete Java program. You don't need to understand every word yet. Read it, and predict what it prints before you open the answer.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="220px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(&quot;Hello from Java!&quot;);\n\t\tSystem.out.println(&quot;This program was written once.&quot;);\n\t\tSystem.out.println(&quot;It can run on Windows, macOS, and Linux.&quot;);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. In the next lesson, [Setting Up](/lessons/java/setting-up), you'll install Java on your own computer so you can run programs like this one yourself.
:::

::: details Check your prediction
```text
Hello from Java!
This program was written once.
It can run on Windows, macOS, and Linux.
```
:::

## Try it yourself

1. Change `"Hello from Java!"` to a greeting with your own name in it. What would the program print now?
2. Add a fourth line inside the program that prints the name of your school. Copy the shape of the lines above it exactly, including the semicolon at the end.
3. Look at the words that appear on every line you added, like `System.out.println`. Write down a guess about what each part does. You'll check your guesses in [Your First Java Program](/lessons/java/first-program).

## Check your understanding

<Quiz
	question="What does &quot;write once, run anywhere&quot; mean for Java?"
	:options="['Java programs can only run on one kind of computer', 'Java programs never need to be tested', 'You write a program once, and the Java Virtual Machine lets it run on many kinds of computers', 'Java code is written in a web browser']"
	:answer-index="2"
	explanation="Each computer has its own Java Virtual Machine, which acts like an adapter, so the same program can run on Windows, macOS, Linux, and more."
/>

<Quiz
	question="How are Java and JavaScript related?"
	:options="['They are two different languages that happen to have similar names', 'JavaScript is a smaller version of Java', 'Java runs only in web browsers', 'They are the same language']"
	:answer-index="0"
	explanation="They were released in the same year, but they are separate languages. JavaScript's name was mostly a marketing decision."
/>

<Quiz
	question="What does LTS mean when you see it next to a Java version?"
	:options="['Latest Test Software', 'Light, tiny, and simple', 'The version only works on laptops', 'Long-term support: the version gets updates and fixes for years']"
	:answer-index="3"
	explanation="LTS versions are supported for a long time, so schools and companies usually pick one of them."
/>

## Up next

You know what Java is. Now let's get it onto your computer, along with a good code editor, in [Setting Up](/lessons/java/setting-up).
