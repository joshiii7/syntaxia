---
title: "Java Polymorphism Explained with Simple Examples"
description: "Treat different Java objects the same way through a shared parent type, and let each one respond in its own way when you call the very same method."
---

# Polymorphism

*At the start of class, the teacher says "introduce yourselves," once, to everyone. Each person answers in their own way.*

In [Inheritance](/lessons/java/inheritance), `Student` and `Teacher` both extended `Person`, and each one overrode `introduce()` with its own version. So far, you've always called those methods on a variable of the exact type: a `Student` variable for a student, a `Teacher` variable for a teacher.

But a school doesn't keep one list for students, another for teachers, and another for guards when it just wants everyone to introduce themselves. It wants one list of people. This lesson shows you how Java handles that, and why it's one of the most useful ideas in object-oriented programming.

The idea is called **polymorphism**, from Greek words meaning "many shapes." One method call, many possible behaviors, depending on the object.

## "Introduce yourselves"

On the first day of school, the adviser says one sentence to the whole room: "Please introduce yourselves." The adviser doesn't need to know who's a student, who's a visiting teacher, and who's the principal dropping by. Everyone hears the same request, and each person answers in their own way.

That's polymorphism. The caller says the same thing to every object. Each object decides how to respond.

## A parent variable can hold a child object

Here's the rule that makes it work. Since a `Student` **is a** `Person`, a variable of type `Person` can hold a `Student` object:

```java
Person p = new Student("Maria", 11);
```

The variable's type is `Person`. The actual object is a `Student`. That's allowed, because every `Student` has everything a `Person` has.

The reverse is not allowed. Not every `Person` is a `Student`:

```java
Student s = new Person("Mang Tony");
// error: incompatible types: Person cannot be converted to Student
```

## The object decides which method runs

Now for the key question. `p` is a `Person` variable holding a `Student` object. When you call `p.introduce()`, which version runs, `Person`'s or `Student`'s?

```java
Person p = new Student("Maria", 11);
p.introduce();
```

**The student's version.** Java looks at the actual object, not the variable's type, to decide which method to run. And it decides while the program runs, at the moment of the call.

That means one line of code can do different things for different objects:

```java
ArrayList<Person> people = new ArrayList<>();
people.add(new Person("Mang Tony"));
people.add(new Student("Maria", 11));
people.add(new Teacher("Ms. Reyes", "Biology"));

for (Person person : people) {
	person.introduce();
}
```

The loop doesn't check what each person is. It just says "introduce yourself," and each object runs its own version. That one `person.introduce()` line might run three different methods.

## Why this is so useful

Imagine the school hires a librarian next year. You write a `Librarian` class that extends `Person` and overrides `introduce()`. Then you add a librarian to the list.

What changes in the loop? **Nothing.** It already works with any kind of `Person`, including kinds that didn't exist when the loop was written.

Without polymorphism, you'd write something like this, and grow it every time a new kind of person appeared:

```text
if (person is a student) {
	...
} else if (person is a teacher) {
	...
} else if (person is a librarian) {
	...
}
```

With polymorphism, each class carries its own behavior, and the code that uses them stays short and never needs to change. New kinds of objects just plug in.

## The variable's type decides what you can call

There's a limit, and it's important. The **variable's type** decides which methods you're allowed to call, even though the **object** decides which version runs.

Say `Student` has an extra method, `getGradeLevel()`, that `Person` doesn't have:

```java
Person p = new Student("Maria", 11);
p.getGradeLevel();
// error: cannot find symbol
```

The object really is a student, but the compiler only knows that `p` is some kind of `Person`, and not every person has a grade level. So it refuses.

Think of it like a delivery driver with a package labeled "fragile item." The driver knows how to carry fragile items. They don't know it's a vase, so they won't try to put flowers in it, even though a vase could hold flowers.

## Checking the real type with `instanceof`

Occasionally you really do need the child's extra methods. The `instanceof` operator checks what an object actually is, and in modern Java (version 16 and newer), it can hand you a variable of the right type in the same step:

```java
for (Person person : people) {
	if (person instanceof Student student) {
		System.out.println(student.getName() + " is in grade " + student.getGradeLevel());
	}
}
```

Read it as: "if `person` is a `Student`, call it `student` and use it." Inside the `if`, `student` is a `Student` variable, so `getGradeLevel()` is allowed.

Use this sparingly. If you find yourself writing `instanceof` checks for every kind of object, that's the long `if-else` chain from earlier sneaking back in. Usually, the better fix is a method in the parent class that each child overrides.

## Abstract classes: a parent that's only a plan

Sometimes a parent class is too general to exist on its own. Think of shapes. Every shape has an area, but there's no way to work out the area of "a shape." Only circles, rectangles, and triangles have real formulas.

Mark a class **`abstract`**, and Java won't let anyone create an object of it directly. It exists only to be extended. An abstract class can also have **abstract methods**, with no body at all, that every child **must** override:

```java
abstract class Shape {
	abstract double area();

	void describe() {
		System.out.printf("%s with area %.2f%n", getClass().getSimpleName(), area());
	}
}

class Circle extends Shape {
	private double radius;

	Circle(double radius) {
		this.radius = radius;
	}

	@Override
	double area() {
		return Math.PI * radius * radius;
	}
}
```

`abstract double area();` ends with a semicolon instead of a body. It's a promise: "every real shape will know its area." Forget to override it in a child, and the compiler stops you. And `new Shape()` is an error, because there's no such thing as a shape with no particular form.

`describe()` is a normal method that every shape inherits, and it calls `area()` without knowing which kind of shape it's on. Polymorphism again: each shape plugs in its own formula. (`getClass().getSimpleName()` gives the name of the object's real class, like `Circle`.)

## Try it

This program keeps different shapes in one list of `Shape` objects. One loop describes them all and adds up the total area, without ever checking which kind each shape is. Predict each line. (Rounded to 2 decimal places, a circle of radius 1 has an area of 3.14.)

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="720px"
	:model-value="'import java.util.ArrayList;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tArrayList&lt;Shape&gt; shapes = new ArrayList&lt;&gt;();\n\t\tshapes.add(new Rectangle(4, 5));\n\t\tshapes.add(new Circle(1));\n\t\tshapes.add(new Square(3));\n\n\t\tdouble total = 0;\n\t\tfor (Shape shape : shapes) {\n\t\t\tshape.describe();\n\t\t\ttotal += shape.area();\n\t\t}\n\t\tSystem.out.printf(&quot;Total area: %.2f%n&quot;, total);\n\n\t\tfor (Shape shape : shapes) {\n\t\t\tif (shape instanceof Rectangle rectangle) {\n\t\t\t\tSystem.out.println(&quot;Rectangle-shaped, &quot; + rectangle.getWidth() + &quot; wide&quot;);\n\t\t\t}\n\t\t}\n\t}\n}\n\nabstract class Shape {\n\tabstract double area();\n\n\tvoid describe() {\n\t\tSystem.out.printf(&quot;%s with area %.2f%n&quot;, getClass().getSimpleName(), area());\n\t}\n}\n\nclass Rectangle extends Shape {\n\tprivate double width;\n\tprivate double height;\n\n\tRectangle(double width, double height) {\n\t\tthis.width = width;\n\t\tthis.height = height;\n\t}\n\n\tdouble getWidth() {\n\t\treturn width;\n\t}\n\n\t@Override\n\tdouble area() {\n\t\treturn width * height;\n\t}\n}\n\nclass Square extends Rectangle {\n\tSquare(double side) {\n\t\tsuper(side, side);\n\t}\n}\n\nclass Circle extends Shape {\n\tprivate double radius;\n\n\tCircle(double radius) {\n\t\tthis.radius = radius;\n\t}\n\n\t@Override\n\tdouble area() {\n\t\treturn Math.PI * radius * radius;\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Rectangle with area 20.00
Circle with area 3.14
Square with area 9.00
Total area: 32.14
Rectangle-shaped, 4.0 wide
Rectangle-shaped, 3.0 wide
```

The first loop calls `describe()` and `area()` on every shape without knowing what it is, and each shape runs its own `area()`. `Square` doesn't override `area()` at all; it inherits `Rectangle`'s. That's also why a square passes the `instanceof Rectangle` check: a square *is a* rectangle.
:::

## Try it yourself

1. Add a `Triangle` class with a base and a height (area is `base * height / 2`). Add one to the list. How much of `main` did you have to change?
2. Remove the `area()` method from `Circle`. What does the compiler say, and why?
3. Try adding `new Shape()` to the list. Read the error message.

## Check your understanding

<Quiz
	question="Person p = new Student(&quot;Maria&quot;, 11); p.introduce(); Student overrides introduce(). Which version runs?"
	:options="['Person\'s version, because p is a Person variable', 'Both versions', 'Student\'s version, because the object is a Student', 'Neither, it is a compile error']"
	:answer-index="2"
	explanation="Java picks the method from the actual object while the program runs. The object is a Student, so its override runs."
/>

<Quiz
	question="With Person p = new Student(&quot;Maria&quot;, 11);, why is p.getGradeLevel() a compile error?"
	:options="['Students do not have grade levels', 'The variable type Person decides which methods you may call, and Person has no getGradeLevel', 'getGradeLevel is private', 'Methods cannot be called on p']"
	:answer-index="1"
	explanation="The compiler only knows p is some kind of Person. Which methods you can call comes from the variable type, even though which version runs comes from the object."
/>

<Quiz
	question="What does abstract mean on a class?"
	:options="['The class has no fields', 'All of its methods are private', 'It runs faster', 'You cannot create objects of it directly; it exists to be extended']"
	:answer-index="3"
	explanation="An abstract class is a partial plan. Only its concrete children can be created with new, and they must fill in any abstract methods."
/>

## Up next

Inheritance lets a class share code with its parent, but a class can only have one parent. What if a class needs to promise several abilities at once, like a `Student` that can be both printed on a report and saved to a file? For that, Java has [Interfaces](/lessons/java/interfaces).
