---
title: "Java ArrayList: Resizable Lists Made Easy"
description: "Use Java's ArrayList for lists that grow and shrink: add, get, set, and remove items, loop through them, and choose between arrays and ArrayList."
---

# ArrayList

*An egg carton has 12 slots, forever. A shopping list just gets longer when you think of something else to buy.*

[Arrays](/lessons/java/arrays) are fast and simple, but they have one stubborn rule: once you create one, its size never changes. That's a problem for a lot of real programs. A class list grows when a student enrolls and shrinks when one transfers. A to-do list grows and shrinks all day long. You don't know the size in advance, and it keeps changing.

For lists like that, Java has **`ArrayList`**: a list that grows and shrinks as you need it.

## A shopping list

Think of a shopping list on your phone. You start with nothing. You add "eggs," then "bread," then "milk." You cross off bread. You squeeze "rice" in at the top. The list is always exactly as long as it needs to be, and you never had to decide its size up front.

An `ArrayList` works the same way, and it keeps the good parts of arrays: items stay in order, and each one still has an index starting from 0.

## Creating an ArrayList

`ArrayList` lives in `java.util`, the same place as `Scanner`, so it needs an import:

```java
import java.util.ArrayList;
```

Then create one like this:

```java
ArrayList<String> names = new ArrayList<>();
```

The type goes in **angle brackets**: `ArrayList<String>` means "an ArrayList of Strings." The empty `<>` on the right side tells Java to use the same type again, so you don't have to repeat it. The list starts empty.

## Adding, reading, changing, and removing

Instead of square brackets, an ArrayList uses **methods** for everything:

```java
ArrayList<String> names = new ArrayList<>();

names.add("Maria");            // [Maria]
names.add("Ben");              // [Maria, Ben]
names.add("Carlo");            // [Maria, Ben, Carlo]
names.add(1, "Ana");           // [Maria, Ana, Ben, Carlo]  inserted at index 1

System.out.println(names.get(0));   // Maria
names.set(2, "Benjamin");           // [Maria, Ana, Benjamin, Carlo]
names.remove("Carlo");              // [Maria, Ana, Benjamin]
names.remove(0);                    // [Ana, Benjamin]

System.out.println(names);          // [Ana, Benjamin]
System.out.println(names.size());   // 2
```

Here's how they line up with what you already know from arrays:

| Job | Array | ArrayList |
|---|---|---|
| read item `i` | `scores[i]` | `list.get(i)` |
| change item `i` | `scores[i] = x;` | `list.set(i, x);` |
| add to the end | not possible | `list.add(x);` |
| insert at `i` | not possible | `list.add(i, x);` |
| remove | not possible | `list.remove(i);` or `list.remove(x);` |
| how many items | `scores.length` | `list.size()` |
| print them all | `Arrays.toString(scores)` | just print the list |

Yes, that's a third way to ask "how long is it?" Strings use `length()`, arrays use `length`, and ArrayLists use `size()`. Everyone mixes these up at first. Your editor's suggestions will help.

When you add or remove an item in the middle, everything after it shifts over to make room or close the gap, and their indexes change. The ArrayList handles this for you.

Asking for an index that doesn't exist still crashes, just like with arrays, with an `IndexOutOfBoundsException`.

## Handy extras

```java
ArrayList<String> names = new ArrayList<>();
names.add("Maria");
names.add("Ben");

System.out.println(names.contains("Ben"));   // true
System.out.println(names.indexOf("Ben"));    // 1
System.out.println(names.indexOf("Zoe"));    // -1, not found
System.out.println(names.isEmpty());         // false

names.clear();                               // remove everything
System.out.println(names.size());            // 0
```

`contains`, `indexOf`, and `remove(item)` all compare using `equals`, so they work correctly with Strings.

## Storing numbers: wrapper types

Here's a rule that surprises everyone. This doesn't compile:

```java
ArrayList<int> scores = new ArrayList<>();
// error: unexpected type
```

An ArrayList can only hold **objects**, not primitive types like `int`, `double`, or `boolean`. For each primitive, Java has a matching class, called a **wrapper**, that wraps the value up as an object:

| Primitive | Wrapper |
|---|---|
| `int` | `Integer` |
| `double` | `Double` |
| `boolean` | `Boolean` |
| `char` | `Character` |

So a list of whole numbers is written like this:

```java
ArrayList<Integer> scores = new ArrayList<>();
scores.add(88);
scores.add(94);
int first = scores.get(0);   // 88
```

You can add a plain `88`, and get back a plain `int`. Java converts between `int` and `Integer` for you automatically. This is called **autoboxing** (wrapping the value in a box) and **unboxing** (taking it out). You'll barely notice it, apart from writing `Integer` inside the angle brackets.

## The `remove` gotcha with numbers

Because `remove` works both by index and by item, a list of `Integer` has a trap:

```java
ArrayList<Integer> scores = new ArrayList<>();
scores.add(10);
scores.add(20);
scores.add(30);

scores.remove(1);                     // removes the item at INDEX 1, which is 20
System.out.println(scores);           // [10, 30]

scores.remove(Integer.valueOf(10));   // removes the VALUE 10
System.out.println(scores);           // [30]
```

With a plain `int` argument, Java assumes you mean an index. To remove a value, wrap it with `Integer.valueOf` first.

## Looping through an ArrayList

Both loops you know work. The regular `for` loop uses `size()` and `get()`:

```java
for (int i = 0; i < names.size(); i++) {
	System.out.println((i + 1) + ". " + names.get(i));
}
```

And for-each works exactly like it does with arrays:

```java
for (String name : names) {
	System.out.println("Hello, " + name);
}
```

One warning: **don't add or remove items inside a for-each loop over the same list.** Java notices the list changing underneath it and stops with a `ConcurrentModificationException`. If you need to remove items while looping, `removeIf` does it safely in one line:

```java
scores.removeIf(score -> score < 0);
```

That `score -> score < 0` is a tiny function called a **lambda**: "given a score, is it below zero?" Every item that answers `true` gets removed. You don't need to write lambdas yourself yet. Just know that this pattern exists.

## Arrays or ArrayList?

Both are useful. Pick based on the situation:

- **Use an array** when the size is fixed and known: the 7 days of a week, the 12 months, a 3 by 3 game board. Arrays are simple, and they can hold primitives directly.
- **Use an ArrayList** when the size changes or isn't known in advance: students in a class, items in a cart, lines read from a file. This is most lists in real programs.

When you're not sure, an ArrayList is the more flexible choice.

## Try it

This program manages a class list. Students enroll, one transfers out, a name gets corrected, and the program prints the final roster with numbers. Track the list after each line and predict the output.

<CodeEditor
	language="java"
	label="Java practice editor, Main.java"
	min-height="560px"
	:model-value="'import java.util.ArrayList;\n\npublic class Main {\n\tpublic static void main(String[] args) {\n\t\tArrayList&lt;String&gt; roster = new ArrayList&lt;&gt;();\n\t\troster.add(&quot;Maria&quot;);\n\t\troster.add(&quot;Ben&quot;);\n\t\troster.add(&quot;Carlo&quot;);\n\t\troster.add(&quot;Dina&quot;);\n\t\tSystem.out.println(&quot;Start: &quot; + roster + &quot; (&quot; + roster.size() + &quot; students)&quot;);\n\n\t\troster.remove(&quot;Ben&quot;);\n\t\troster.add(0, &quot;Ana&quot;);\n\t\troster.set(roster.indexOf(&quot;Dina&quot;), &quot;Diana&quot;);\n\t\tSystem.out.println(&quot;Now: &quot; + roster);\n\n\t\tif (!roster.contains(&quot;Ben&quot;)) {\n\t\t\tSystem.out.println(&quot;Ben has transferred out.&quot;);\n\t\t}\n\n\t\tArrayList&lt;Integer&gt; scores = new ArrayList&lt;&gt;();\n\t\tscores.add(91);\n\t\tscores.add(85);\n\t\tscores.add(-1);\n\t\tscores.add(78);\n\t\tscores.removeIf(score -&gt; score &lt; 0);\n\n\t\tint total = 0;\n\t\tfor (int score : scores) {\n\t\t\ttotal += score;\n\t\t}\n\t\tSystem.out.println(&quot;Valid scores: &quot; + scores + &quot;, average &quot; + (double) total / scores.size());\n\n\t\tfor (int i = 0; i &lt; roster.size(); i++) {\n\t\t\tSystem.out.println((i + 1) + &quot;. &quot; + roster.get(i));\n\t\t}\n\t}\n}\n'"
/>

::: info Running Java here
Running Java right in the browser is coming to Syntaxia soon. On your own computer, save this program as `Main.java` and run it with `java Main.java`, or use your editor's Run button.
:::

::: details Check your prediction
```text
Start: [Maria, Ben, Carlo, Dina] (4 students)
Now: [Ana, Maria, Carlo, Diana]
Ben has transferred out.
Valid scores: [91, 85, 78], average 84.66666666666667
1. Ana
2. Maria
3. Carlo
4. Diana
```

Removing Ben shifts Carlo and Dina one place to the left. Adding Ana at index 0 shifts everyone one place to the right. `indexOf("Dina")` finds her new position, so `set` replaces the right slot.
:::

## Try it yourself

1. Add two more students to the end of the roster, then print how many students there are.
2. Remove the student at index 1. Who is it? Predict before you run.
3. Write a loop that prints only the names that start with a letter from `A` to `C`. (Hint: `name.charAt(0) <= 'C'`.)

## Check your understanding

<Quiz
	question="How do you create an ArrayList of whole numbers?"
	:options="['ArrayList&lt;int&gt; nums = new ArrayList&lt;&gt;();', 'ArrayList&lt;Integer&gt; nums = new ArrayList&lt;&gt;();', 'int[] nums = new ArrayList();', 'ArrayList nums = new int[];']"
	:answer-index="1"
	explanation="An ArrayList can only hold objects, so whole numbers use the wrapper class Integer instead of the primitive int."
/>

<Quiz
	question="How do you find out how many items an ArrayList called list has?"
	:options="['list.length', 'list.length()', 'list.count', 'list.size()']"
	:answer-index="3"
	explanation="ArrayList uses size(). Arrays use length with no parentheses, and Strings use length() with parentheses."
/>

<Quiz
	question="names is [Maria, Ben, Carlo]. After names.add(1, &quot;Ana&quot;), what is names.get(2)?"
	:options="['Ana', 'Carlo', 'Ben', 'Maria']"
	:answer-index="2"
	explanation="Inserting Ana at index 1 shifts Ben and Carlo one place to the right, making the list [Maria, Ana, Ben, Carlo]. Index 2 is now Ben."
/>

## Up next

That's the Arrays and Collections chapter done. Think back to [Arrays](/lessons/java/arrays) and [2D Arrays](/lessons/java/2d-arrays): names in one array, scores in another, kept in step only because their indexes happened to line up. Remove a name from one and forget the other, and every student gets the wrong grades. What if each student could carry their own name and scores around together? That's the idea behind the next chapter, starting with [Classes and Objects](/lessons/java/classes-and-objects).
