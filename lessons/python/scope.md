---
title: "Python Variable Scope: Local, Global, and the global Keyword"
description: "Understand scope in Python: why variables made inside a function vanish when it ends, how functions read global variables, and the UnboundLocalError trap."
---

# Variable Scope

*What happens in the classroom stays in the classroom. But everyone in the building can read the notice board in the lobby.*

Sooner or later, every Python learner writes something like this:

```python
def calculate_total():
    total = 88 + 94 + 83

calculate_total()
print(total)  # error: NameError: name 'total' is not defined
```

`total` was created just a moment ago. Why can't Python find it? Because every variable has a **scope**: the part of the program where it exists. `total` was created inside the function, so it only exists inside the function, and only while the function is running.

## Classrooms and the lobby

Picture a school building. A notice pinned in the **lobby** can be read by anyone who walks in, from any room. But notes written on a classroom's whiteboard stay in that classroom, and they're wiped at the end of the lesson.

In Python:

- The **lobby** is the **global scope**: the top level of your file, outside every function. Variables created there are **global**, and every function can read them.
- Each **classroom** is a function's **local scope**. Variables created inside a function (including its parameters) are **local**. They exist only while that function runs, and they're wiped when it returns.

## Local variables stay inside

```python
def make_greeting():
    message = "Good morning!"
    print(message)

make_greeting()
```

```text
Good morning!
```

`message` is local to `make_greeting`. It's created when the function runs, used, and then thrown away when the function ends. Code outside the function can't see it, which is exactly why the `total` example at the top failed.

The fix is the one you learned in [Writing Functions](/lessons/python/functions): if the outside world needs a value, **return** it:

```python
def calculate_total():
    total = 88 + 94 + 83
    return total

result = calculate_total()
print(result)
```

```text
265
```

## Each function has its own classroom

Because each function has its own local scope, two functions can use the same variable names without interfering with each other:

```python
def morning():
    greeting = "Good morning"
    return greeting

def evening():
    greeting = "Good evening"
    return greeting

print(morning())
print(evening())
```

```text
Good morning
Good evening
```

The two `greeting` variables are completely separate, like two students named Maria in two different classrooms. This is a feature: you can write a function without worrying about which names the rest of the program uses.

## Functions can read global variables

A function *can* read a variable from the global scope, as long as it doesn't try to change it:

```python
PASSING_SCORE = 75

def did_pass(score):
    return score >= PASSING_SCORE

print(did_pass(82))
print(did_pass(60))
```

```text
True
False
```

Python looks for `PASSING_SCORE` in the function's own scope first, doesn't find it, and then looks in the global scope, where it is. This is perfect for **constants**, the `ALL_CAPS` values from [Variables and Naming](/lessons/python/variables) that never change.

## The `UnboundLocalError` trap

Now the surprise. What if a function tries to *change* a global variable?

```python
count = 0

def add_visitor():
    count = count + 1  # error: UnboundLocalError: cannot access local variable 'count' where it is not associated with a value

add_visitor()
```

Here's what happened. The moment a function **assigns** to a name anywhere in its body, Python decides that name is *local* to the function, for the whole function. So `count` inside `add_visitor` is a new, local `count`, separate from the global one. And on the right side of `count = count + 1`, that local `count` hasn't been given a value yet, so Python stops.

## The `global` keyword

If a function really does need to change a global variable, it has to say so with the `global` keyword:

```python
count = 0

def add_visitor():
    global count
    count = count + 1

add_visitor()
add_visitor()
print("Visitors:", count)
```

```text
Visitors: 2
```

`global count` tells Python "inside this function, `count` means the global one." Now the assignment changes the lobby notice instead of creating a classroom note.

It works, but use it sparingly. When any function can change a global variable, a bug in any function can break it, and tracking down which one did it gets hard. Passing values in as parameters and returning results is almost always cleaner:

```python
def add_visitor(count):
    return count + 1

visitors = 0
visitors = add_visitor(visitors)
visitors = add_visitor(visitors)
print("Visitors:", visitors)
```

```text
Visitors: 2
```

Same result, and now the function's whole slot and tray are visible in its definition.

## Blocks don't make their own scope

If you've taken the [Java track](/lessons/java/scope), here's a difference to watch for. In Java, a variable created inside an `if` or a loop disappears when that block ends. In Python, **only functions** create a new scope. Variables created inside `if` blocks and loops are still around afterward:

```python
for i in range(3):
    last_square = i * i

print(i)
print(last_square)
```

```text
2
4
```

`i` and `last_square` were created inside the loop, but they still exist after it, holding their last values. This is occasionally handy, but don't rely on it for anything important: if the loop had run zero times, neither variable would exist at all, and using them would be a `NameError`.

## Keep scope small

A good habit: **keep each variable in the smallest scope that works.**

- If a value is only needed inside a function, create it inside that function.
- If a function needs a value from outside, pass it in as a parameter.
- If the outside world needs a result, return it.
- Keep global variables for constants, and a small amount of top-level setup.

Code written this way is easier to read, because each function's inputs and outputs are right there in its definition, and it's easier to fix, because only a few lines can change each variable.

## Try it

This program counts how many students passed. It has a global constant, a local variable in each of two functions, a parameter with the same name as a global variable, and a variable left over from a loop. Predict the output, paying attention to which variable each line is really using.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="440px"
	:model-value="'PASSING = 75\ncount = 0\n\n\ndef is_passing(score):\n    return score &gt;= PASSING\n\n\ndef summary(count):\n    count = count * 100\n    return f&quot;Inside summary, count is {count}&quot;\n\n\nfor text in &quot;82,64,91,75&quot;.split(&quot;,&quot;):\n    score = int(text)\n    if is_passing(score):\n        count += 1\n\nprint(&quot;Passed:&quot;, count)\nprint(summary(count))\nprint(&quot;Back outside, count is still&quot;, count)\nprint(&quot;Last score checked:&quot;, score)\n'"
/>

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
Passed: 3
Inside summary, count is 300
Back outside, count is still 3
Last score checked: 75
```

The `count` parameter in `summary` is a local name that happens to match the global one. Multiplying it by 100 only changes the local one. The `for` loop is at the top level, not in a function, so `count += 1` there changes the global `count` with no `global` keyword needed. And `score` still exists after the loop, holding the last value, 75.
:::

## Try it yourself

1. Add `print(PASSING)` inside `summary`. Does it work? Why?
2. Write a function `reset()` that sets the global `count` back to 0. Call it, then print `count`. What do you need for it to work?
3. Rewrite `reset()` so it doesn't use `global`, by returning a value instead. How does the calling code change?

## Check your understanding

<Quiz
	question="A variable is created inside a function. Where can it be used?"
	:options="['Only inside that function, while it runs', 'Anywhere in the file', 'Anywhere after the function is defined', 'Only on the line where it was created']"
	:answer-index="0"
	explanation="Variables created inside a function are local. They exist while the function runs and vanish when it returns."
/>

<Quiz
	question="count = 0 is global. A function contains only count = count + 1, without global count. What happens when it runs?"
	:options="['The global count becomes 1', 'A new local count becomes 1', 'UnboundLocalError, because assigning makes count local, and it has no value yet', 'Nothing happens']"
	:answer-index="2"
	explanation="Assigning to a name anywhere in a function makes it local for the whole function. Use global count, or better, pass the value in and return the new one."
/>

<Quiz
	question="A variable is created inside a for loop at the top level of a file. Can it be used after the loop?"
	:options="['No, it disappears when the loop ends', 'Only inside a function', 'Only with the global keyword', 'Yes, because in Python only functions create a new scope']"
	:answer-index="3"
	explanation="Unlike Java, Python's if blocks and loops don't have their own scope. The variable keeps its last value, as long as the loop ran at least once."
/>

## Up next

Your functions live in the same file as the rest of your program. But Python comes with hundreds of ready-made functions, organized into **modules**, for everything from random numbers to dates. You'll learn to use them, and to split your own code into files, in [Modules and import](/lessons/python/modules).
