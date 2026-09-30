---
title: "Java Interfaces: Contracts Your Classes Promise to Keep"
description: "Define what a Java class must be able to do with an interface, implement it in several classes, and see how interfaces make programs more flexible."
---

# Interfaces

*Every wall socket in the country has the same shape. A phone charger, a lamp, and a rice cooker all plug in, because they all agreed to the same plug.*

In [Polymorphism](/lessons/java/polymorphism), one loop worked with rectangles, circles, and squares, because they all shared a parent class, `Shape`. But inheritance has limits. A class can only have one parent. And sometimes, classes that have nothing in common as families still need to share one ability.

Think about "things that can be paid for" in a school. A tuition bill, a cafeteria order, and a field trip fee. They aren't the same kind of thing at all. None of them "is a" version of another. But every one of them has an amount to pay. Java's tool for describing a shared ability like that is the **interface**.

## Plugs and sockets

A wall socket doesn't care what you plug into it. A lamp, a phone charger, and a rice cooker have nothing else in common: different makers, different jobs, different insides. But they all have a plug of the agreed shape, so they all work with any socket.

An **interface** is that agreed plug shape. It lists what a class must be able to do, without saying how. Any class that **implements** the interface promises to provide those abilities. And any code that needs those abilities can work with every one of those classes.

## Declaring an interface

```java
interface Payable {
	double getAmountDue();
	String getDescription();
}
```

It looks like a class, but with the word `interface`, and the methods have no bodies, just a signature and a semicolon. Each one is a promise: "anything `Payable` will have these methods." Interface methods are automatically `public`, so you don't need to write it here.

Interface names are often adjectives ending in **-able** or **-ible**, describing an ability: `Payable`, `Printable`, `Comparable`. That's a convention, not a rule. Nouns like `Shape` or `List` are common too.

## Implementing an interface

A class signs the contract with the word **`implements`**, then provides every method the interface lists:

```java
class TuitionBill implements Payable {
	private String studentName;
	private double amount;

	TuitionBill(String studentName, double amount) {
		this.studentName = studentName;
		this.amount = amount;
	}

	@Override
	public double getAmountDue() {
		return amount;
	}

	@Override
	public String getDescription() {
		return "Tuition for " + studentName;
	}
}
```

The methods must be `public`, to match the interface. And `@Override` works here too, with the same benefit you saw in [Inheritance](/lessons/java/inheritance): the compiler checks that the method really matches the contract.

If the class forgets one of the methods, it doesn't compile:

```java
class CafeteriaOrder implements Payable {
	@Override
	public double getAmountDue() {
		return 85.0;
	}
}
// error: CafeteriaOrder is not abstract and does not override abstract method getDescription() in Payable
```

A promise is a promise. The compiler holds every class to the whole contract.

## Using the interface as a type

Here's the payoff. An interface is a type, just like a class, so you can have variables, parameters, and lists of that type:

```java
ArrayList<Payable> bills = new ArrayList<>();
bills.add(new TuitionBill("Maria", 15000));
bills.add(new CafeteriaOrder("Adobo meal", 2));
bills.add(new TripFee("Museum trip", 350, false));

double total = 0;
for (Payable bill : bills) {
	System.out.println(bill.getDescription() + ": " + bill.getAmountDue());
	total += bill.getAmountDue();
}
```

This is polymorphism again, but without a shared parent class. `TuitionBill`, `CafeteriaOrder`, and `TripFee` are completely unrelated classes. The only thing they share is the promise, and that's all the loop needs.

You can't create an object of an interface itself, though. `new Payable()` is an error, the same way you can't buy "a plug shape" at a store. You buy a lamp that has one.

## Several interfaces at once

A class can extend only one parent class, but it can implement **as many interfaces as it wants**, separated by commas:

```java
interface Printable {
	void print();
}

class TripFee implements Payable, Printable {
	...
}
```

A lamp can have a standard plug *and* a standard bulb socket *and* a standard switch. Each interface is one more ability the class promises.

And a class can do both, extending a parent and implementing interfaces:

```java
class Student extends Person implements Printable {
	...
}
```

## Default methods

Sometimes every class that implements an interface would write the exact same method. Since Java 8, an interface can provide a ready-made version with the word **`default`**:

```java
interface Payable {
	double getAmountDue();
	String getDescription();

	default String getReceiptLine() {
		return String.format("%-25s %10.2f", getDescription(), getAmountDue());
	}
}
```

Every `Payable` class gets `getReceiptLine()` for free, built from the two methods it was required to write. A class can still override it if it needs something different.

## Interfaces you'll meet in Java itself

Java's own library uses interfaces everywhere. A few you'll run into:

- **`List`** is an interface, and `ArrayList` implements it. You'll often see `List<String> names = new ArrayList<>();`, which says "I need a list, and I happen to be using an ArrayList." The rest of the code only relies on the `List` promises.
- **`Comparable`** lets objects say how they should be sorted, which is what `Collections.sort` uses to put them in order.
- **`Runnable`** describes "a task that can be run," which shows up when programs do several things at once.

## Interface or abstract class?

Both define something other classes must fill in, so how do you choose?

- Use an **abstract class** when the classes are truly one family ("is a") and share real code and fields. A `Circle` *is a* `Shape`.
- Use an **interface** when you're describing an **ability** that unrelated classes can have. A tuition bill and a cafeteria order both *can be paid*, but neither is a kind of the other.

When you're unsure, lean toward an interface. A class can have many of them, so you're never locked in.

## Try it

This program has three unrelated classes that all implement `Payable`, one of which also implements `Printable`. One loop prints receipt lines using the interface's default method and adds up the total. Predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="760px"
	:model-value="'import java.util.ArrayList;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tArrayList&lt;Payable&gt; bills = new ArrayList&lt;&gt;();\n\t\tbills.add(new TuitionBill(&quot;Maria&quot;, 15000));\n\t\tbills.add(new CafeteriaOrder(&quot;Adobo meal&quot;, 2));\n\t\tTripFee trip = new TripFee(&quot;Museum trip&quot;, 350, true);\n\t\tbills.add(trip);\n\n\t\tdouble total = 0;\n\t\tfor (Payable bill : bills) {\n\t\t\tSystem.out.println(bill.getReceiptLine());\n\t\t\ttotal += bill.getAmountDue();\n\t\t}\n\t\tSystem.out.printf(&quot;%-25s %10.2f%n&quot;, &quot;TOTAL&quot;, total);\n\n\t\tSystem.out.println();\n\t\ttrip.print();\n\t}\n}\n\ninterface Payable {\n\tdouble getAmountDue();\n\tString getDescription();\n\n\tdefault String getReceiptLine() {\n\t\treturn String.format(&quot;%-25s %10.2f&quot;, getDescription(), getAmountDue());\n\t}\n}\n\ninterface Printable {\n\tvoid print();\n}\n\nclass TuitionBill implements Payable {\n\tprivate String studentName;\n\tprivate double amount;\n\n\tTuitionBill(String studentName, double amount) {\n\t\tthis.studentName = studentName;\n\t\tthis.amount = amount;\n\t}\n\n\t@Override\n\tpublic double getAmountDue() {\n\t\treturn amount;\n\t}\n\n\t@Override\n\tpublic String getDescription() {\n\t\treturn &quot;Tuition for &quot; + studentName;\n\t}\n}\n\nclass CafeteriaOrder implements Payable {\n\tprivate static final double MEAL_PRICE = 85.0;\n\tprivate String meal;\n\tprivate int quantity;\n\n\tCafeteriaOrder(String meal, int quantity) {\n\t\tthis.meal = meal;\n\t\tthis.quantity = quantity;\n\t}\n\n\t@Override\n\tpublic double getAmountDue() {\n\t\treturn MEAL_PRICE * quantity;\n\t}\n\n\t@Override\n\tpublic String getDescription() {\n\t\treturn meal + &quot; x&quot; + quantity;\n\t}\n}\n\nclass TripFee implements Payable, Printable {\n\tprivate String trip;\n\tprivate double fee;\n\tprivate boolean hasScholarship;\n\n\tTripFee(String trip, double fee, boolean hasScholarship) {\n\t\tthis.trip = trip;\n\t\tthis.fee = fee;\n\t\tthis.hasScholarship = hasScholarship;\n\t}\n\n\t@Override\n\tpublic double getAmountDue() {\n\t\treturn hasScholarship ? fee / 2 : fee;\n\t}\n\n\t@Override\n\tpublic String getDescription() {\n\t\treturn trip + (hasScholarship ? &quot; (half price)&quot; : &quot;&quot;);\n\t}\n\n\t@Override\n\tpublic void print() {\n\t\tSystem.out.println(&quot;Permission slip: &quot; + trip + &quot;, please pay &quot; + getAmountDue());\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Tuition for Maria           15000.00
Adobo meal x2                 170.00
Museum trip (half price)      175.00
TOTAL                       15345.00

Permission slip: Museum trip, please pay 175.0
```

None of the three classes wrote `getReceiptLine()`; they all got it from the interface's `default` method, which calls each class's own `getDescription()` and `getAmountDue()`. Only `trip` can call `print()`, because only `TripFee` implements `Printable`.
:::

## Try it yourself

1. Add a `LibraryFine` class that implements `Payable`, charging 5 pesos per day late. Add one to the list. Did the loop need to change?
2. Remove the `getDescription()` method from `CafeteriaOrder`. Read the compiler's message carefully. What is it telling you?
3. Make `TuitionBill` implement `Printable` too, and give it a `print()` method. Then, after the loop, call `print()` on every bill that is `Printable`, using `instanceof`.

## Check your understanding

<Quiz
	question="What does an interface define?"
	:options="['The fields every object must store', 'A class that cannot have methods', 'A set of methods that implementing classes promise to provide', 'A way to create objects without new']"
	:answer-index="2"
	explanation="An interface is a contract: a list of abilities. Any class that implements it must provide every method it lists."
/>

<Quiz
	question="How many interfaces can one class implement?"
	:options="['As many as it needs', 'Only one', 'Exactly two', 'None, only abstract classes can']"
	:answer-index="0"
	explanation="A class can extend only one parent class, but it can implement any number of interfaces, separated by commas."
/>

<Quiz
	question="A tuition bill and a cafeteria order both need getAmountDue(). Why is an interface a better fit than a shared parent class?"
	:options="['Interfaces are faster', 'Parent classes cannot have methods', 'Interfaces can store more data', 'They are unrelated things that share an ability, not one family where one is a kind of the other']"
	:answer-index="3"
	explanation="Inheritance fits an is-a family. A shared ability across unrelated classes is exactly what interfaces are for."
/>

## Up next

You've used `static` on methods and constants since the very first chapter, and `this` in your constructors. It's time to understand both properly, in [static and this](/lessons/java/static-and-this).
