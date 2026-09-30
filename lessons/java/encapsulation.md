---
title: "Java Encapsulation: private Fields, Getters, and Setters"
description: "Protect an object's data in Java with private fields, control access with getters and setters, and keep your objects from ever holding invalid values."
---

# Encapsulation: private, Getters, and Setters

*You can't reach into an ATM and grab cash. You use the screen and the keypad, and the machine checks your PIN and your balance first.*

At the end of [Constructors](/lessons/java/constructors), there was a hole in the plan. The constructor carefully checked every student's grade level. But nothing stopped any other code from doing this, a moment later:

```java
maria.gradeLevel = 99;
maria.name = null;
```

All that checking, skipped with one line. As programs grow, and more people work on the same code, this kind of accident becomes very likely.

**Encapsulation** closes the hole. You lock an object's fields away so outside code can't touch them directly, and you provide a few well-guarded doors, methods, for reading and changing them.

## An ATM

A bank's cash is inside the machine, behind steel. You can't reach in and take it. Instead, the ATM gives you a small set of controls: check your balance, withdraw, deposit. Every request goes through the machine, which checks your PIN and makes sure you have enough money before anything happens.

That's encapsulation:

- The **data** (the cash, the balance) is hidden inside.
- The **methods** (withdraw, deposit, check balance) are the only way in.
- The methods **enforce the rules**, so the data can never end up in a bad state, like a negative balance.

## `private`: locking the fields

Put the word **`private`** in front of a field, and only code inside the same class can use it:

```java
class BankAccount {
	private String owner;
	private double balance;
}
```

Now try to touch it from `Main`:

```java
BankAccount account = new BankAccount();
account.balance = 1000000;
// error: balance has private access in BankAccount
```

The compiler refuses. The only code that can read or change `balance` now lives inside `BankAccount` itself.

Words like `private` and `public` are called **access modifiers**. They control who can see a field, method, or class:

| Modifier | Who can use it |
|---|---|
| `private` | only code inside the same class |
| *(none)* | code in the same package (for now: your whole program) |
| `public` | any code, anywhere |

There's a fourth, `protected`, which comes up with [Inheritance](/lessons/java/inheritance). The rule of thumb for fields is simple: **make them `private`**. Almost always.

## Getters: letting others read

Once fields are private, outside code can't even read them. If other code needs to know a value, add a **getter**: a small public method that returns it.

```java
class BankAccount {
	private String owner;
	private double balance;

	public BankAccount(String owner) {
		this.owner = owner;
		this.balance = 0;
	}

	public String getOwner() {
		return owner;
	}

	public double getBalance() {
		return balance;
	}
}
```

By convention, a getter is named `get` plus the field name with a capital letter: `getOwner`, `getBalance`. For a `boolean` field, it's usually `is` instead: `isActive()`, `isEnrolled()`.

## Setters: letting others change, with rules

To allow changes, add a **setter**, a public method that takes the new value, checks it, and only then stores it:

```java
public void setOwner(String owner) {
	if (owner == null || owner.isBlank()) {
		System.out.println("Owner name can't be empty.");
		return;
	}
	this.owner = owner;
}
```

`isBlank()` is a String method that answers `true` when the text is empty or only spaces.

The check is the whole point. Code outside the class can still change the owner, but only to a valid name. There's no way around the rule anymore.

## Not every field needs a setter

Here's where encapsulation really shines. Look at the balance. Should outside code be able to call `setBalance(1000000)`? Of course not. Real bank accounts don't work that way. Money comes in through deposits and goes out through withdrawals, each with its own rules.

So instead of a setter, give the class methods that match what actually happens in the real world:

```java
public void deposit(double amount) {
	if (amount <= 0) {
		System.out.println("Deposit must be more than zero.");
		return;
	}
	balance += amount;
}

public boolean withdraw(double amount) {
	if (amount <= 0 || amount > balance) {
		return false;
	}
	balance -= amount;
	return true;
}
```

Now it's impossible for the balance to go negative, no matter what the rest of the program does. `withdraw` returns `true` or `false` so the caller knows whether it worked.

Some fields shouldn't change at all after the object is created, like a student ID number. Give those a getter and no setter. You can even mark the field `final`, like the constants in [Variables and Constants](/lessons/java/variables), and Java will make sure it's set once, in the constructor, and never again:

```java
private final String studentId;
```

## Why go to all this trouble?

It can feel like extra typing: a private field, then a getter, then a setter, for every piece of data. Here's what you get for it:

- **Your objects are always valid.** Every change goes through your checks, so an account can never have a negative balance, and a student can never be in grade 99.
- **Bugs are easier to find.** If a value is wrong, only the few methods inside the class could have changed it. You know exactly where to look.
- **You can change the inside without breaking the outside.** Maybe later you'll store the balance in cents as a `long` instead of a `double`. As long as `getBalance()` still returns the right number, no other code needs to change.

That last one matters more as programs grow. The public methods are a promise to the rest of the program. What's behind them is your business.

## Your editor can help

Writing getters and setters by hand gets repetitive. Most Java editors can generate them for you: in IntelliJ IDEA, it's under **Code**, then **Generate**; in VS Code with the Java extensions, right-click in the class and choose **Source Action**. Generated setters don't include any checks, though. Add those yourself, for any field that has rules.

## Try it

This program builds a bank account with private fields, a getter for each, a guarded setter, and deposit and withdraw methods instead of a balance setter. Some of the requests in `main` break the rules. Predict what happens to each one.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="680px"
	:model-value="'public class Main {\n\tpublic static void main(String[] args) {\n\t\tBankAccount account = new BankAccount(&quot;Maria Santos&quot;);\n\n\t\taccount.deposit(500);\n\t\taccount.deposit(-50);\n\t\tSystem.out.println(&quot;Balance: &quot; + account.getBalance());\n\n\t\tboolean ok = account.withdraw(200);\n\t\tSystem.out.println(&quot;Withdraw 200: &quot; + (ok ? &quot;done&quot; : &quot;refused&quot;));\n\n\t\tok = account.withdraw(1000);\n\t\tSystem.out.println(&quot;Withdraw 1000: &quot; + (ok ? &quot;done&quot; : &quot;refused&quot;));\n\n\t\taccount.setOwner(&quot;   &quot;);\n\t\taccount.setOwner(&quot;Maria S. Santos&quot;);\n\n\t\tSystem.out.println(account.getOwner() + &quot; has &quot; + account.getBalance() + &quot; pesos.&quot;);\n\t}\n}\n\nclass BankAccount {\n\tprivate String owner;\n\tprivate double balance;\n\n\tpublic BankAccount(String owner) {\n\t\tthis.owner = owner;\n\t\tthis.balance = 0;\n\t}\n\n\tpublic String getOwner() {\n\t\treturn owner;\n\t}\n\n\tpublic double getBalance() {\n\t\treturn balance;\n\t}\n\n\tpublic void setOwner(String owner) {\n\t\tif (owner == null || owner.isBlank()) {\n\t\t\tSystem.out.println(&quot;Owner name can\'t be empty.&quot;);\n\t\t\treturn;\n\t\t}\n\t\tthis.owner = owner;\n\t}\n\n\tpublic void deposit(double amount) {\n\t\tif (amount &lt;= 0) {\n\t\t\tSystem.out.println(&quot;Deposit must be more than zero.&quot;);\n\t\t\treturn;\n\t\t}\n\t\tbalance += amount;\n\t}\n\n\tpublic boolean withdraw(double amount) {\n\t\tif (amount &lt;= 0 || amount &gt; balance) {\n\t\t\treturn false;\n\t\t}\n\t\tbalance -= amount;\n\t\treturn true;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Deposit must be more than zero.
Balance: 500.0
Withdraw 200: done
Withdraw 1000: refused
Owner name can't be empty.
Maria S. Santos has 300.0 pesos.
```

The negative deposit and the blank name were both rejected by the class's own checks. The 1000 withdrawal was refused because only 300 was left. And there's no way for `main` to skip those checks: try adding `account.balance = 1000000;` and the compiler stops you.
:::

## Try it yourself

1. Add the line `account.balance = 1000000;` to `main`. Read the compiler's error message. Then remove it.
2. Add a `private int withdrawalCount` field that goes up by one on every successful withdrawal, and a getter for it. Should it have a setter? Why or why not?
3. Add a rule to `withdraw`: no single withdrawal can be more than 5,000 pesos, even if the balance is higher. Notice that no code in `main` needs to change.

## Check your understanding

<Quiz
	question="What does private mean on a field?"
	:options="['The field cannot be changed by anyone, ever', 'The field is hidden from the compiler', 'Only code inside the same class can use the field', 'The field is saved to a file']"
	:answer-index="2"
	explanation="private limits access to the class itself. Code in other classes has to go through the public methods the class provides."
/>

<Quiz
	question="What is the main job of a setter, beyond storing the value?"
	:options="['Printing the value', 'Making the field public', 'Returning the old value', 'Checking that the new value is valid before storing it']"
	:answer-index="3"
	explanation="A setter is a guarded door. Its value is in the rules it enforces, so the object can never hold an invalid value."
/>

<Quiz
	question="Why might a BankAccount have deposit and withdraw methods instead of setBalance?"
	:options="['Setters are not allowed for numbers', 'They match how balances really change, and each can enforce its own rules', 'It makes the class shorter', 'Java requires it for double fields']"
	:answer-index="1"
	explanation="A general setter would let any code set any balance. Methods that match real actions can check each one, like refusing to withdraw more than the balance."
/>

## Up next

A school has students, but it also has teachers, and both are people with a name and an ID. Writing those shared parts twice would be a waste. In [Inheritance](/lessons/java/inheritance), you'll build one class on top of another and share the common parts.
