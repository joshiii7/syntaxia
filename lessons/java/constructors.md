---
title: "Java Constructors: Setting Up New Objects Properly"
description: "Write Java constructors that set up new objects correctly, pass values in when you create an object, and offer several constructors with overloading."
---

# Constructors

*A new phone walks you through setup before you can use it: language, Wi-Fi, your name. It won't let you skip to the home screen half-configured.*

In [Classes and Objects](/lessons/java/classes-and-objects), creating a student took four lines: one to build the object, and one for each field. Forget a line, and the student's name is `null`, waiting to crash your program later.

A **constructor** fixes that. It's a special block of code that runs automatically every time an object is created, so you can make sure every new object starts out complete and ready to use.

## Setting up a new phone

When you turn on a brand-new phone, it doesn't drop you onto a blank home screen. It runs a setup routine first: pick your language, connect to Wi-Fi, enter your name. Only when the essentials are in place does the phone become usable.

A constructor is that setup routine. `new` builds the object, and the constructor immediately fills it in with the values you provide.

## Writing a constructor

```java
class Student {
	String name;
	int gradeLevel;

	Student(String studentName, int level) {
		name = studentName;
		gradeLevel = level;
	}
}
```

A constructor looks like a method, with two differences:

- Its name is **exactly the same as the class name**, capital letter included: `Student`.
- It has **no return type**, not even `void`.

Now creating a student takes one line, and you pass the values in the parentheses after `new Student`:

```java
Student maria = new Student("Maria", 11);
Student ben = new Student("Ben", 10);

System.out.println(maria.name + ", grade " + maria.gradeLevel);   // Maria, grade 11
```

The arguments go to the constructor's parameters, in order, just like calling a method in [Parameters and Return Values](/lessons/java/parameters). The constructor copies them into the new object's fields.

## `this`: the object being built

Those parameter names, `studentName` and `level`, are a bit awkward. The natural name for the parameter is `name`, the same as the field. But then which `name` is which?

```java
Student(String name, int gradeLevel) {
	name = name;              // does nothing useful!
	gradeLevel = gradeLevel;
}
```

Inside the constructor, the parameter `name` hides the field `name`, so `name = name` just copies the parameter into itself. The field stays `null`.

The fix is the keyword **`this`**, which means "the object being built right now." `this.name` is always the field:

```java
Student(String name, int gradeLevel) {
	this.name = name;
	this.gradeLevel = gradeLevel;
}
```

Read it as "this object's name gets the name that was passed in." You'll see this pattern in nearly every Java class ever written, and [static and this](/lessons/java/static-and-this) looks at `this` more closely.

## The default constructor

In the last lesson, `new Student()` worked even though the class had no constructor at all. That's because when you don't write any constructor, Java quietly gives your class an empty one with no parameters, called the **default constructor**.

The moment you write your own constructor, Java stops providing that free one:

```java
class Student {
	String name;

	Student(String name) {
		this.name = name;
	}
}
```

```java
Student s = new Student();
// error: constructor Student in class Student cannot be applied to given types;
```

This is usually exactly what you want. If a student must have a name, the class shouldn't allow nameless students. The compiler now enforces that for you.

## Several constructors

Sometimes there are several sensible ways to create an object. A student might be enrolled with a name and grade level, or, early in the process, with just a name. You can offer both, using the [overloading](/lessons/java/overloading) you already know: same name, different parameters.

```java
class Student {
	String name;
	int gradeLevel;

	Student(String name, int gradeLevel) {
		this.name = name;
		this.gradeLevel = gradeLevel;
	}

	Student(String name) {
		this(name, 7);
	}
}
```

The second constructor uses `this(...)` with parentheses, which means "call another constructor of this class." It passes the name along with a default grade level of 7. This keeps all the real setup work in one constructor, the same trick you used for default values in Method Overloading.

When you use `this(...)` this way, it must be the very **first** line in the constructor.

```java
Student maria = new Student("Maria", 11);   // grade 11
Student newKid = new Student("Ana");        // grade 7, by default
```

## Checking values in a constructor

Because the constructor runs every time, it's the perfect place to reject bad data before it gets into an object:

```java
Student(String name, int gradeLevel) {
	if (gradeLevel < 1 || gradeLevel > 12) {
		gradeLevel = 1;
	}
	this.name = name;
	this.gradeLevel = gradeLevel;
}
```

Quietly fixing a bad value like this is only a start. In [Exceptions](/lessons/java/exceptions), you'll learn to refuse bad data loudly instead, so the mistake gets noticed. And in the next lesson, [Encapsulation](/lessons/java/encapsulation), you'll make sure nobody can sneak a bad value in *after* the object is built, either.

## Fields that start with a value

Some fields should start with the same value for every new object, like an empty list of scores. You can set those right where the field is declared:

```java
class Student {
	String name;
	ArrayList<Integer> scores = new ArrayList<>();

	Student(String name) {
		this.name = name;
	}
}
```

Every new student gets their own fresh, empty `scores` list, ready for `add`. Without the `= new ArrayList<>()`, the field would start as `null`, and the first `scores.add(...)` would crash.

## Try it

This program gives the `Student` class two constructors and a method that adds a score. It creates students both ways and prints each one. Predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="620px"
	:model-value="'import java.util.ArrayList;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tStudent maria = new Student(&quot;Maria&quot;, 11);\n\t\tStudent ana = new Student(&quot;Ana&quot;);\n\t\tStudent oops = new Student(&quot;Carlo&quot;, 15);\n\n\t\tmaria.addScore(91);\n\t\tmaria.addScore(88);\n\t\tana.addScore(79);\n\n\t\tmaria.printSummary();\n\t\tana.printSummary();\n\t\toops.printSummary();\n\t}\n}\n\nclass Student {\n\tString name;\n\tint gradeLevel;\n\tArrayList&lt;Integer&gt; scores = new ArrayList&lt;&gt;();\n\n\tStudent(String name, int gradeLevel) {\n\t\tif (gradeLevel &lt; 7 || gradeLevel &gt; 12) {\n\t\t\tSystem.out.println(&quot;Grade &quot; + gradeLevel + &quot; isn\'t valid for &quot; + name + &quot;. Using 7.&quot;);\n\t\t\tgradeLevel = 7;\n\t\t}\n\t\tthis.name = name;\n\t\tthis.gradeLevel = gradeLevel;\n\t}\n\n\tStudent(String name) {\n\t\tthis(name, 7);\n\t}\n\n\tvoid addScore(int score) {\n\t\tscores.add(score);\n\t}\n\n\tvoid printSummary() {\n\t\tSystem.out.println(name + &quot; (grade &quot; + gradeLevel + &quot;), scores: &quot; + scores);\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Grade 15 isn't valid for Carlo. Using 7.
Maria (grade 11), scores: [91, 88]
Ana (grade 7), scores: [79]
Carlo (grade 7), scores: []
```

The warning prints first, because the constructor runs the moment `new Student("Carlo", 15)` is reached, before any of the summaries. `Ana` was created with the one-parameter constructor, which passed grade 7 to the other one. And Carlo never got any scores, but his list still exists, so it prints as an empty `[]` instead of crashing.
:::

## Try it yourself

1. Add a third constructor that takes no arguments and creates a student named `"New student"` in grade 7. Use `this(...)` so you don't repeat any setup code.
2. Remove the line `ArrayList<Integer> scores = new ArrayList<>();` and replace it with just `ArrayList<Integer> scores;`. Predict what happens when `maria.addScore(91)` runs. Then put it back.
3. In the two-parameter constructor, change `this.name = name;` to `name = name;`. What does `printSummary` show for the names now?

## Check your understanding

<Quiz
	question="What is special about a constructor compared to a regular method?"
	:options="['It must be static', 'It has the same name as the class and no return type', 'It always returns the new object with a return statement', 'It can only have one parameter']"
	:answer-index="1"
	explanation="A constructor is named exactly like its class, has no return type at all, and runs automatically when new creates an object."
/>

<Quiz
	question="Inside a constructor with a parameter called name, what does this.name refer to?"
	:options="['The parameter', 'The class name', 'Nothing, this is not allowed in constructors', 'The field of the object being created']"
	:answer-index="3"
	explanation="this means the current object, so this.name is always the field. Plain name refers to the parameter, which hides the field."
/>

<Quiz
	question="A class has only the constructor Student(String name). What happens with new Student()?"
	:options="['A compile error, because writing a constructor removes the free default one', 'Java creates a student with a null name', 'The program crashes when it runs', 'The name is set to an empty string']"
	:answer-index="0"
	explanation="Java only supplies a no-argument constructor when you write none at all. Once you write your own, only the ones you wrote exist."
/>

## Up next

Your constructor checks the grade level, but anyone can still write `maria.gradeLevel = 99;` afterward and skip the check completely. In [Encapsulation: private, Getters, and Setters](/lessons/java/encapsulation), you'll lock the fields away so every change has to go through your checks.
