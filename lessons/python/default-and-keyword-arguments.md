---
title: "Python Default and Keyword Arguments Explained"
description: "Make Python function parameters optional with default values, pass arguments by name with keyword arguments, and avoid the classic mutable default trap."
---

# Default and Keyword Arguments

*At a coffee shop, you can say "a coffee" and get the usual. Or you can say "a coffee, large, with oat milk" and get exactly that.*

In [Parameters and Return Values](/lessons/python/parameters), every argument had to be given, in exactly the right order. That works, but it gets awkward. Some settings almost always have the same value, so why type them every time? And with four or five arguments, it's hard to remember which one comes where.

Python solves both problems: **default values** make parameters optional, and **keyword arguments** let you pass values by name.

## The usual, unless you say otherwise

At a coffee shop, "one coffee, please" gets you the usual: medium, regular milk, no sugar. You only mention the things you want to change: "one coffee, large." Nobody makes you list every option just to get a normal coffee.

That's a function with default values. The function has a sensible "usual" for some settings, and the caller only mentions what's different.

## Default values

Give a parameter a default with `=` in the definition:

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Maria")
greet("Ben", "Good morning")
```

```text
Hello, Maria!
Good morning, Ben!
```

`name` is **required**: every call must provide it. `greeting` is **optional**: leave it out, and it gets `"Hello"`. Pass something, and that replaces the default.

Parameters with defaults have to come *after* the ones without. Otherwise, Python couldn't tell which argument belongs to which parameter:

```python
def greet(greeting="Hello", name):  # error: SyntaxError: parameter without a default follows parameter with a default
    print(f"{greeting}, {name}!")
```

## Keyword arguments

When calling any function, you can name the parameter an argument is meant for, with `name=value`. These are **keyword arguments**:

```python
def make_coffee(size, milk, sugar):
    print(f"A {size} coffee with {milk} milk and {sugar} sugar")

make_coffee("large", "oat", 0)
make_coffee(sugar=1, size="small", milk="regular")
```

```text
A large coffee with oat milk and 0 sugar
A small coffee with regular milk and 1 sugar
```

With keyword arguments, the order stops mattering, because each value says where it goes. They also make calls easier to read. Compare `make_coffee("large", "oat", 0)` with `make_coffee(size="large", milk="oat", sugar=0)`: in the second one, you can tell what each value means without looking up the function.

You've used keyword arguments already: `sep` and `end` in `print()`, from [Your First Python Program](/lessons/python/first-program), are keyword arguments with defaults of `" "` and a new line.

## Defaults and keywords together

The two ideas work best together. Give most settings sensible defaults, and let callers change just the ones they care about, by name:

```python
def make_coffee(size="medium", milk="regular", sugar=0):
    print(f"A {size} coffee with {milk} milk and {sugar} sugar")

make_coffee()
make_coffee(sugar=2)
make_coffee("large", milk="oat")
```

```text
A medium coffee with regular milk and 0 sugar
A medium coffee with regular milk and 2 sugar
A large coffee with oat milk and 0 sugar
```

`make_coffee(sugar=2)` skips straight past `size` and `milk`, which keep their defaults. Without keyword arguments, there'd be no way to change only the last setting.

## The ordering rule

You can mix positional and keyword arguments in one call, but positional ones must come first:

```python
make_coffee("large", sugar=1)
```

```text
A large coffee with regular milk and 1 sugar
```

The other way around doesn't work:

```python
make_coffee(sugar=1, "large")  # error: SyntaxError: positional argument follows keyword argument
```

And you can't give the same parameter twice:

```python
make_coffee("large", size="small")  # error: TypeError: make_coffee() got multiple values for argument 'size'
```

## The mutable default trap

Here's one of Python's most famous surprises. Say you want a function that adds an item to a shopping list, starting a new list if you don't pass one:

```python
def add_item(item, shopping=[]):
    shopping.append(item)
    return shopping

print(add_item("eggs"))
print(add_item("bread"))
```

```text
['eggs']
['eggs', 'bread']
```

The second call should have started a fresh list with just bread. Instead, the eggs are still there.

Here's why: a default value is created **once**, when the `def` line runs, not each time the function is called. Every call that uses the default shares that same list, so items pile up from call to call. (`.append()` adds an item to a list. You'll learn it properly in [Lists](/lessons/python/lists).)

The fix is a pattern you'll see in lots of real Python code: use `None` as the default, and create the fresh list inside the function:

```python
def add_item(item, shopping=None):
    if shopping is None:
        shopping = []
    shopping.append(item)
    return shopping

print(add_item("eggs"))
print(add_item("bread"))
```

```text
['eggs']
['bread']
```

The rule: **never use a list, a dictionary, or any other changeable value as a default.** Numbers, strings, `True`, `False`, and `None` are all safe, because they can't be changed in place.

## Try it

This program prints name badges for a school event. The function has one required parameter and three with defaults. Predict each badge before you check.

<CodeEditor
	language="python"
	label="Python practice editor, main.py"
	min-height="380px"
	:model-value="'def badge(name, role=&quot;Student&quot;, grade=None, border=&quot;*&quot;):\n    width = 24\n    print(border * width)\n    print(f&quot;{name:^{width}}&quot;)\n    if grade is None:\n        print(f&quot;{role:^{width}}&quot;)\n    else:\n        print(f&quot;{role + \', grade \' + str(grade):^{width}}&quot;)\n    print(border * width)\n\n\nbadge(&quot;Maria Santos&quot;, grade=11)\nbadge(&quot;Ms. Reyes&quot;, &quot;Teacher&quot;, border=&quot;=&quot;)\nbadge(&quot;Ben Cruz&quot;, border=&quot;-&quot;, grade=10)\nbadge(border=&quot;~&quot;, name=&quot;Guest&quot;)\n'"
/>

`{name:^{width}}` centers the name in a space as wide as `width`: a width code can itself come from a variable, written inside its own braces.

::: info Running Python here
Running Python right in the browser is coming to Syntaxia soon. For now, you can read and edit the code here. If you have Python installed on your computer (see [Setting Up](/lessons/python/setting-up)), save it as `main.py` and run it with `python main.py` (or `python3 main.py` on macOS and Linux).
:::

::: details Check your prediction
```text
************************
      Maria Santos      
   Student, grade 11    
************************
========================
       Ms. Reyes        
        Teacher         
========================
------------------------
        Ben Cruz        
   Student, grade 10    
------------------------
~~~~~~~~~~~~~~~~~~~~~~~~
         Guest          
        Student         
~~~~~~~~~~~~~~~~~~~~~~~~
```

Every badge uses a different mix of defaults and keywords. Ms. Reyes passes `role` by position and `border` by name, and has no grade, so only her role is shown. The Guest badge passes everything by name, in a different order from the definition, which works fine.
:::

## Try it yourself

1. Add a fifth parameter, `width=24`, and use it instead of the fixed width. Print one badge 30 characters wide.
2. What would `badge()` with no arguments do? Predict the error, then check.
3. Write a function `repeat(text, times=2, separator=" ")` that returns the text repeated with the separator between each copy, so `repeat("ha", 3, "-")` returns `"ha-ha-ha"`. (Hint: `separator.join(...)` from [Working with Strings](/lessons/python/strings).)

## Check your understanding

<Quiz
	question="def greet(name, greeting=&quot;Hi&quot;):. Which call gives an error?"
	:options="['greet(&quot;Ana&quot;)', 'greet()', 'greet(&quot;Ana&quot;, &quot;Hey&quot;)', 'greet(greeting=&quot;Yo&quot;, name=&quot;Ana&quot;)']"
	:answer-index="1"
	explanation="name has no default, so every call must provide it. The keyword call works in any order."
/>

<Quiz
	question="What is the main advantage of keyword arguments like make_coffee(size=&quot;large&quot;, sugar=1)?"
	:options="['They make the function run faster', 'They are required for every function', 'You can pass arguments in any order, and the call says what each value means', 'They make parameters private']"
	:answer-index="2"
	explanation="Each value is matched by name, not position, which also makes the call readable at a glance."
/>

<Quiz
	question="Why is def add_item(item, shopping=[]): a bug?"
	:options="['The default list is created once and shared by every call that uses it', 'Lists cannot be parameters', 'The default must come first', 'It is not a bug']"
	:answer-index="0"
	explanation="Default values are created when the def runs, not on each call. Use shopping=None and create a new list inside the function."
/>

## Up next

You've seen that a parameter inside a function is a different name from a variable outside it, even with the same value. Where exactly can each variable be seen, and where does it disappear? That's [Variable Scope](/lessons/python/scope).
