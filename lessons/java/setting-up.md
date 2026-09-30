---
title: "How to Install Java: JDK and Editor Setup for Beginners"
description: "Install a Java Development Kit (JDK) and a code editor on Windows, macOS, or Linux, check that everything works, and get ready to write your first program."
---

# Setting Up Java on Your Computer

*A kitchen needs a stove before anyone can cook. This lesson installs yours.*

In [What Is Java?](/lessons/java/introduction), you saw that Java programs need a Java Virtual Machine to run, and that Java checks your code before running it. Both of those tools come in one free download. In this lesson, you'll install it, install a code editor to write in, and check that everything works.

This is the only lesson in the track about installing software. Take it slowly, follow the steps for your own computer, and if something doesn't work, the troubleshooting section near the end covers the usual problems.

## What you need: the JDK

Think of a kitchen. The **stove** cooks the food. But to actually make a meal, you also need knives, pans, and measuring cups.

Java comes in two sizes:

- The **JRE** (Java Runtime Environment) is just the stove. It can *run* Java programs, but it can't help you make them.
- The **JDK** (Java Development Kit) is the whole kitchen. It includes everything in the JRE, plus the tools you need to *build* programs, most importantly **javac**, the Java compiler.

You're going to write Java, so you need the **JDK**. If you only install a JRE, running programs might work, but compiling your own won't.

## Which JDK to download

Many companies publish free builds of the JDK, and they all work the same way. This track uses **Eclipse Temurin**, a free, widely used build from a group called Adoptium.

When you download it, you'll be asked to pick a version. Choose the newest version marked **LTS** (long-term support). At the time of writing, that's **Java 25**. If a newer LTS version is listed when you read this, pick that one. Everything in this track works on it.

## Installing on Windows

1. Go to **adoptium.net** and open the **Temurin** downloads page.
2. Choose **Windows**, the **x64** architecture (for most Windows computers), the package type **JDK**, and the **newest LTS** version. Download the **.msi** installer.
3. Open the downloaded file and follow the installer.
4. On the **Custom Setup** screen, make sure **Add to PATH** is turned on. Also turn on **Set JAVA_HOME variable**, which is off by default. Some tools look for it, and it saves you trouble later.
5. Finish the installer.

`PATH` is the list of folders your computer searches when you type a command. Adding Java to it is what lets you type `java` in a terminal from any folder.

## Installing on macOS

1. Go to **adoptium.net** and open the **Temurin** downloads page.
2. Choose **macOS**, the package type **JDK**, and the **newest LTS** version.
3. Pick the right architecture for your Mac:
	- **aarch64** for Macs with Apple chips (M1 or newer).
	- **x64** for older Macs with Intel chips.

	Not sure which you have? Open the Apple menu, choose **About This Mac**, and look next to **Chip** or **Processor**.
4. Download the **.pkg** installer, open it, and follow the steps.

## Installing on Linux

Most Linux systems can install a JDK through their own package manager, and Adoptium's website has step-by-step instructions for adding Temurin to Ubuntu, Debian, Fedora, and others. Open the **Installation** section of **adoptium.net** and follow the guide for your system.

## Checking that it worked

Now for the moment of truth. Open a terminal:

- **Windows:** search the Start menu for **Terminal** (or **Command Prompt**).
- **macOS:** open **Terminal** from Applications, then Utilities.
- **Linux:** open your usual terminal app.

If you've never used a terminal before, [Using the Integrated Terminal](/lessons/ide/using-the-terminal) in the IDE track is a gentle introduction.

Type these two commands, pressing Enter after each one:

```text
java -version
javac -version
```

The first checks the part that runs programs. The second checks the compiler. Each one should print a version number that matches what you installed, something like this (your numbers may differ):

```text
openjdk version "25.0.1" 2025-10-21 LTS
javac 25.0.1
```

If both commands print a version, you're done with the hardest part. Seriously, well done.

## Choosing a code editor

You *could* write Java in a plain text editor, but a good code editor makes life much easier. It colors your code, points out mistakes as you type, and runs your program with one click. The [IDE track](/lessons/ide/introduction) explains what these tools do and [how to choose one](/lessons/ide/choosing-the-right-ide). For Java, two free options are popular:

- **Visual Studio Code** with Microsoft's **Extension Pack for Java**. It's light, it works for other languages too, and you might already have it from the IDE track. Install VS Code, open the **Extensions** view, search for **Extension Pack for Java**, and install it.
- **IntelliJ IDEA**, an editor built specifically for Java. It's heavier, but it does a lot for you. Its free version is all you need for this track.

Either one is a great choice. Pick one and stick with it for now. [Setting Up Your IDE](/lessons/ide/setting-up-your-ide) walks through first-time setup in more detail.

## When something goes wrong

**"'java' is not recognized" or "command not found"**

The terminal can't find Java. The most common reason is that the terminal was already open when you installed Java, so it doesn't know about it yet. Close every terminal window, open a new one, and try again. If it still fails on Windows, run the installer again and make sure **Add to PATH** is turned on.

**`java -version` works, but `javac -version` doesn't**

You have a JRE, not a JDK. Go back to adoptium.net and make sure the package type is **JDK**.

**The version number isn't the one you installed**

You have more than one Java installed, and an older one is being found first. That's common on school computers. Uninstall the older version if you can, or ask whoever manages the computer.

**Your school computer won't let you install anything**

That's normal on shared computers. You can still read every lesson here, and you can finish the setup on a home computer later.

## Try it

This small program checks your setup by printing the Java version your computer is using. Predict what it prints, then check your guess against the answer.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="220px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(&quot;Java is working!&quot;);\n\t\tSystem.out.println(&quot;Java version: &quot; + System.getProperty(&quot;java.version&quot;));\n\t\tSystem.out.println(&quot;Operating system: &quot; + System.getProperty(&quot;os.name&quot;));\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. Once your setup works, save this program as `Main.java`, open a terminal in the same folder, and type `java Main.java` to run it. You'll learn exactly what that command does in [How Java Runs](/lessons/java/how-java-runs).
:::

::: details Check your prediction
The first line is always the same. The other two depend on your computer, so yours will look a little different:

```text
Java is working!
Java version: 25.0.1
Operating system: Windows 11
```
:::

## Try it yourself

1. Run `java -version` and `javac -version` in a new terminal. Write down both version numbers and check that they match.
2. Make a new folder called `java-practice` somewhere easy to find. Open it in your code editor, and create a file inside it named `Main.java`.
3. Copy the program above into `Main.java`, save it, and run it from a terminal in that folder with `java Main.java`. Does the version it prints match the one from step 1?

## Check your understanding

<Quiz
	question="Why do you need the JDK and not just the JRE?"
	:options="['The JRE is only for phones', 'The JDK includes the compiler and other tools for building programs, not just for running them', 'The JDK is faster at running games', 'There is no difference']"
	:answer-index="1"
	explanation="The JRE can run Java programs. The JDK adds the tools for making them, including the javac compiler."
/>

<Quiz
	question="Which command checks that the Java compiler is installed?"
	:options="['java -compile', 'javac -version', 'jdk --check', 'compile java']"
	:answer-index="1"
	explanation="javac is the Java compiler. Asking for its version is a quick way to check that it's installed and on your PATH."
/>

<Quiz
	question="You just installed Java, but the terminal says 'java' is not recognized. What should you try first?"
	:options="['Reinstall your operating system', 'Buy a new computer', 'Rename the Java folder', 'Close the terminal, open a new one, and try again']"
	:answer-index="3"
	explanation="A terminal that was open before the install doesn't know Java was added. A fresh terminal usually fixes it. If not, check that Add to PATH was turned on."
/>

## Up next

Your kitchen is ready. Time to cook something: in [Your First Java Program](/lessons/java/first-program), you'll write a program from scratch and find out what every line of it means.
