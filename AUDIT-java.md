# Lesson Audit: Java Track

**Status (2026-09-29): all five Top 5 issues are fixed.** The three wrong forward promises are fixed. Widening is now "(almost always) safe", with the `float` precision example. `split` and the ternary operator are taught in Strings and in Operators. The Java curriculum labels now match the other tracks, and the OOP chapter has the sidebar label "Object-Oriented Java". Quiz answers were rebalanced to 25 / 27 / 25 / 25 across the four positions. Still open: the other low findings (the `Integer ==` note in ArrayList), the items marked "suggestion", and the "Missing topics" list.

Audit date: 2026-09-29. Scope: all 34 Java pages (`lessons/java/`: 33 lessons plus the final project), in the order defined by `.vitepress/theme/data/curriculum.ts`, plus the Java entries in the curriculum itself. This uses the same checklist as the earlier HTML/CSS and JavaScript audits, plus Java-specific checks: every example compiles and prints what the lesson claims, and the classic Java beginner pitfalls are covered. Read-only audit: no lesson files were changed.

**Stubs:** there are none left. All 29 former placeholder pages were written on 2026-09-29. No Java file still has `comingSoon: true`, "hasn't been written yet" text, or the stub's "read Variables and Constants in the meantime" link. The stub checks below confirm that nothing stub-shaped remains.

A note on independence: most of this track was written in the same session as this audit. To avoid grading my own work from memory, the audit leans on mechanical checks as well as a reading pass:

- Every "Try it" program was compiled with `javac` (Temurin JDK 25) and run, and the "Check your prediction" block holds that program's real output. The Scanner lesson and the final project were run with scripted keyboard input.
- Every fenced `java` block was compiled. Blocks that claim a compile error (`// error: ...`) must fail with that exact message. Blocks followed by an output block were run and their output compared. About 40 fragments that only make sense in context, such as a line using a variable declared in the previous block or a `...` placeholder, were checked by reading instead.
- Frontmatter, sidebar labels, heading order, fence labels, quiz markup, links, and em dashes were checked with scripts.
- **Not run:** the full VitePress build and its dead-link check. It was stopped partway on 2026-09-29 because the machine ran low on memory. Internal links were checked by script instead (below). Run `npm run build` once to confirm.

Severity key:

- **high**: wrong or broken in a way learners will copy or get stuck on.
- **medium**: inaccurate, contradictory, or an exercise that doesn't work as written.
- **low**: minor accuracy, wording, or polish.
- **suggestion**: a matter of opinion or teaching style, not a defect.

## Summary

**Overall state: solid, with no high or medium issues found.** All 34 editor programs compile and print exactly what their answers say. Every lesson follows the shared template: tagline, Try it, Try it yourself, three quizzes, Up next. The final project follows it too, with a quiz block in place of a graded exercise. The "Up next" links form one unbroken chain in curriculum order, from What Is Java? to the final project.

The code is modern Java throughout:

- the arrow form of `switch`, and switch expressions
- `instanceof` pattern matching
- `Path`/`Files` for file I/O, and try-with-resources
- `List<...> = new ArrayList<>()` with the diamond operator
- `@Override` on every override

`var` is shown once, as an option the track deliberately doesn't use.

The classic Java beginner pitfalls each get a dedicated section with a runnable or compile-checked example:

| Pitfall | Where |
|---|---|
| `==` vs `.equals()` on Strings | Working with Strings (plus switch, Best Practices) |
| Integer division | Operators and Expressions, Type Casting |
| Off-by-one and `ArrayIndexOutOfBoundsException` | Loops, Arrays |
| `nextInt` followed by `nextLine` | Reading User Input with Scanner |
| String immutability (ignoring a method's result) | Working with Strings |
| `NullPointerException` from unset fields | Classes and Objects, Constructors, Debugging |
| `switch` fall-through without `break` | The switch Statement |
| `name = name` in a constructor | Constructors, static and this |
| Comparing `double` values with `==` | Primitive Data Types, Best Practices |
| Static context errors | static and this |

The findings are small:

- three cross-lesson promises that point to the wrong place or aren't kept;
- one overstatement about widening conversions;
- two tools (`split`, the ternary operator) used often but never formally taught;
- some sidebar-label inconsistencies with the other tracks;
- a site-wide quiz pattern where most correct answers are the second option.

### Top 5 issues

1. **(low) Three forward promises don't match the lessons they point to.**
   - Working with Strings says of `StringBuilder`: "You'll meet it again when you start writing loops." The Loops lesson never uses it. It only reappears in static and this, and in the final project's reference solution.
   - Parameters and Return Values says passing an object works differently, "in [ArrayList] and the object-oriented lessons." The explanation (arrays and objects are passed as "directions") is in **Arrays**, not ArrayList.
   - Writing Methods says `String[] args` is "a list of Strings. You'll learn about that kind of list in [Arrays]." Arrays teaches `String[]` but never mentions `args` or ties it back to `main`.
2. **(low) Type Casting says widening "is always safe."** The chain `byte → short → int → long → float → double` is automatic, but `int` or `long` to `float`, and `long` to `double`, can lose precision for large values: `(float) 123456789` is stored as 123456792. This is an edge case for beginners, but "always safe" is a flat statement learners will remember.
3. **(low) `split` and the ternary operator are used repeatedly but never taught in their home lessons.**
   - `split(",")` appears in break and continue, Variable Scope, File I/O, and the final project. It's explained in a caption in break and continue and again in File I/O, but it's missing from the Strings method table.
   - `condition ? a : b` appears in Parameters, Encapsulation, Interfaces, static and this, and the final project. It's explained only in a caption under the Parameters Try it. It isn't in Operators and Expressions.
4. **(low) The Java curriculum entries don't follow the conventions the other tracks use.**
   - Eight lessons set `sidebarTitle` to exactly the same text as `title`: Nested Loops, Arrays, 2D Arrays, ArrayList, Constructors, Inheritance, Polymorphism, Interfaces. The other tracks leave `sidebarTitle` out in that case (for example HTML's `{ slug: 'lists', title: 'Lists' }`).
   - The chapter title "Object-Oriented Programming" is 27 characters. That's over the "ideally under 22" guideline in `curriculum.ts`, and it has no chapter `sidebarTitle`, unlike HTML's "The Head, Embeds & Widgets" (`sidebarTitle: 'Head & Embeds'`).
   - Keyword labels are capitalized: "Static & This", "If / Else", "Switch", "Break & Continue". The JavaScript track keeps keywords lowercase ("this & Classes"). The Java lesson titles also keep them lowercase ("static and this", "break and continue").
5. **(suggestion, all tracks) Quiz answers cluster at the second option.** In Java, 76 of 102 correct answers are option 2 (index 1). The other tracks show the same pattern: HTML 52 of 72, CSS 53 of 69, JavaScript 65 of 87. A learner who notices can pass most quizzes without reading them, and quizzes gate the Next button.

One deliberate difference sits just outside the top 5. The Java final project is a normal lesson page. The HTML, CSS, and JavaScript final projects use the full-screen `<Exercise>` workspace (`layout: page`, `finalProject: true`) with automatic checks. That workspace runs code in the browser, and Java can't run there yet. The Java project instead has starter code in a `CodeEditor`, requirements, a sample run, a manual testing checklist, a self-check, a collapsed reference solution, and three quizzes that gate completion. Revisit this once the Piston runner described in the README exists.

---

## Lessons

Order (file path, lesson title, sidebar label):

| # | File | Title | Sidebar |
|---|---|---|---|
| 1 | `introduction.md` | What Java Is and Why It's Used | What Is Java? |
| 2 | `setting-up.md` | Setting Up Java on Your Computer | Setting Up |
| 3 | `first-program.md` | Your First Java Program | First Program |
| 4 | `how-java-runs.md` | How Java Runs: the Compiler and the JVM | How Java Runs |
| 5 | `variables.md` | Variables and Constants | Variables |
| 6 | `data-types.md` | Primitive Data Types | Data Types |
| 7 | `operators.md` | Operators and Expressions | Operators |
| 8 | `type-casting.md` | Type Casting and Conversion | Type Casting |
| 9 | `user-input.md` | Reading User Input with Scanner | User Input |
| 10 | `strings.md` | Working with Strings | Strings |
| 11 | `if-else.md` | Making Decisions: if and else | If / Else |
| 12 | `switch.md` | The switch Statement | Switch |
| 13 | `loops.md` | Loops: for, while, and do-while | Loops |
| 14 | `break-and-continue.md` | break and continue | Break & Continue |
| 15 | `nested-loops.md` | Nested Loops | Nested Loops |
| 16 | `methods.md` | Writing Methods | Methods |
| 17 | `parameters.md` | Parameters and Return Values | Parameters |
| 18 | `overloading.md` | Method Overloading | Overloading |
| 19 | `scope.md` | Variable Scope | Scope |
| 20 | `arrays.md` | Arrays | Arrays |
| 21 | `2d-arrays.md` | 2D Arrays | 2D Arrays |
| 22 | `arraylist.md` | ArrayList | ArrayList |
| 23 | `classes-and-objects.md` | Classes and Objects | Classes |
| 24 | `constructors.md` | Constructors | Constructors |
| 25 | `encapsulation.md` | Encapsulation: private, Getters, and Setters | Encapsulation |
| 26 | `inheritance.md` | Inheritance | Inheritance |
| 27 | `polymorphism.md` | Polymorphism | Polymorphism |
| 28 | `interfaces.md` | Interfaces | Interfaces |
| 29 | `static-and-this.md` | static and this | Static & This |
| 30 | `debugging.md` | Debugging Java Programs | Debugging |
| 31 | `exceptions.md` | Exceptions: try, catch, and throw | Exceptions |
| 32 | `file-io.md` | Reading and Writing Files | File I/O |
| 33 | `best-practices.md` | Best Practices and Common Mistakes | Best Practices |
| 34 | `final-project.md` | Final Project: Student Grade Manager | Final Project |
### 1. What Java Is and Why It's Used

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 2. Setting Up Java on Your Computer

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| "At the time of writing, that's Java 25." Correct today (25 is the current LTS; the next is expected in 2027), but it will date. The lesson already says to pick a newer LTS if one is listed. | suggestion | "Which JDK to download" | None needed now. Re-check when the next LTS ships. |

### 3. Your First Java Program

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The four "mistakes everyone makes" compile errors match real `javac` wording. | n/a | n/a | n/a |

### 4. How Java Runs: the Compiler and the JVM

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The `/ by zero` stack trace matches a real run. | n/a | n/a | n/a |

### 5. Variables and Constants

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 6. Primitive Data Types

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The overflow (`2147483647 + 1`) and `0.1 + 0.2` outputs match a real run. | n/a | n/a | n/a |

### 7. Operators and Expressions

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| The ternary operator isn't covered, though five later lessons use it. | low | After "Logical operators" | Add a short section: `String result = score >= 75 ? "Pass" : "Fail";`. See Top 5 #3. |
| The logical-operators table writes OR as `` `\|\|` `` inside a table. Checked against the markdown-it version VitePress bundles: the escaped pipes render as `\|\|` without backslashes, so it displays correctly. | n/a | Logical operators table | None needed. |

### 8. Type Casting and Conversion

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| "Widening means moving a value into a bigger type. It's always safe." `int`/`long` to `float` and `long` to `double` can lose precision. | low | "Pouring between containers" | Add: "(One small exception: very large whole numbers can lose their last few digits when widened to `float` or `double`.)" |

### 9. Reading User Input with Scanner

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The `nextInt`/`nextLine` trap and the `InputMismatchException` were both reproduced with scripted input. | n/a | n/a | n/a |

### 10. Working with Strings

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Promises `StringBuilder` will reappear "when you start writing loops"; it doesn't. | low | "Building a string piece by piece" | Either use `StringBuilder` in the Loops "backwards" example, or change the line to "You'll see it again later in the track." |
| `split` is missing from the method table, though four later lessons use it. | low | "Methods you'll use constantly" | Add a row: `split(",")`, "cut into pieces at each comma", `"a,b,c".split(",")`, `["a", "b", "c"]` (an array, covered in Arrays). |

### 11. Making Decisions: if and else

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The `13 <= age <= 19` error message matches real `javac` output. | n/a | n/a | n/a |

### 12. The switch Statement

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Mentions enums as "a special type ... that you'll meet in later Java study", but the track never covers them. The wording is honest (it doesn't claim a lesson), so this isn't a broken promise. | suggestion | "What you can switch on" | See Missing topics. |

### 13. Loops: for, while, and do-while

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 14. break and continue

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| The Try it uses `split` and an array (`parts[i]`) two chapters before Arrays. A caption explains both as a preview, so it's deliberate. | suggestion | Try it | None needed. |

### 15. Nested Loops

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. All four printed patterns in the prose were run and match. | n/a | n/a | n/a |

### 16. Writing Methods

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Says `String[] args` will be explained in Arrays, which never mentions `args`. | low | "`public static void main`, decoded" | Add one sentence to Arrays: "Now `String[] args` in `main` makes sense: it's an array of Strings." |

### 17. Parameters and Return Values

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Points to ArrayList for how passing objects works; the explanation is in Arrays ("Arrays are passed as directions"). | low | End of "Java passes a copy" | Change the link to Arrays. |

### 18. Method Overloading

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. Both "already defined" errors match real `javac` output. | n/a | n/a | n/a |

### 19. Variable Scope

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| The Try it uses `split` and an array again, without the caption break and continue gave it. | suggestion | Try it | A one-line reminder ("`split` and arrays, previewed in break and continue"). |

### 20. Arrays

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The `ArrayIndexOutOfBoundsException` message matches a real run. | n/a | n/a | n/a |

### 21. 2D Arrays

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. One quiz question contains a 2D array literal (two opening curly braces in a row) inside a component attribute. Checked with the project's Vue compiler: attributes aren't interpolated, so it renders literally. | n/a | n/a | n/a |

### 22. ArrayList

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Doesn't warn that `==` on two `Integer` values from a list compares objects: `list.get(0) == list.get(1)` can be `false` for equal numbers above 127. It's the same trap as `==` on Strings, and this lesson is where learners start storing `Integer`s. | low | "Storing numbers: wrapper types" | One short paragraph: compare `Integer`s with `.equals()`, or store the value in an `int` first. |

### 23. Classes and Objects

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 24. Constructors

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 25. Encapsulation: private, Getters, and Setters

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 26. Inheritance

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The missing-`super(...)` error matches real `javac` output. | n/a | n/a | n/a |

### 27. Polymorphism

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. | n/a | n/a | n/a |

### 28. Interfaces

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Mentions `Comparable` and `Collections.sort` without showing them; the final project's stretch goal then asks for sorting with `Comparator`. | suggestion | "Interfaces you'll meet in Java itself" | See Missing topics (sorting objects). |

### 29. static and this

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| The Try it uses brace-less `if (score >= 90) return "A";` with a style note. Best Practices then says "Always use braces ... even for one line." The note explains the exception, but the two lessons read as mildly contradictory. | suggestion | Try it, `letterFor` | Use braces here too, and drop the style note. |

### 30. Debugging Java Programs

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The `cannot find symbol` example matches real `javac` output. The `NullPointerException` example uses a field (`"this.name" is null`) because local variables show as `"<local1>"` when compiled without debug info. | n/a | n/a | n/a |

### 31. Exceptions: try, catch, and throw

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The catch-order explanation (`NumberFormatException` extends `IllegalArgumentException`) is accurate. | n/a | n/a | n/a |

### 32. Reading and Writing Files

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The Try it writes a real `grades.csv`, and the `NoSuchFileException` line matches a real run. | n/a | n/a | n/a |

### 33. Best Practices and Common Mistakes

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| No issues found. The cleaned-up version in the answer block was run and prints exactly what the messy version prints. | n/a | n/a | n/a |

### 34. Final Project: Student Grade Manager

| Issue | Severity | Location | Suggested fix |
|---|---|---|---|
| Uses a normal lesson layout instead of the `<Exercise>` workspace the other final projects use. This is deliberate, because Java can't run in the browser yet. | suggestion | Frontmatter | Revisit when the Java runner lands. |
| Includes a full reference solution; the other final projects don't. Useful for self-learners with no checker, but a departure. | suggestion | "Stuck? A reference solution" | Keep, or replace with per-requirement hints if you want the tracks to match. |
| The reference solution compiles with `-Xlint:all` and no warnings. It reproduces the sample run exactly, and it skips a corrupted `grades.csv` line as documented. | n/a | n/a | n/a |

---

## Cross-track and site checks

| Check | Result |
|---|---|
| Editor programs compile and match their answers | 34 of 34 (Temurin JDK 25; Scanner and final project fed scripted input) |
| Compile-error claims in snippets | All match real `javac` wording |
| Internal links | All 185 `/lessons/...` links resolve to real files; no `#anchor` links; no external links. Checked by script. The VitePress build's own dead-link check was not run (build stopped for low memory). |
| Links into the Java track from other tracks | None. No other track mentions or promises Java content, so there are no broken promises in that direction. |
| Curriculum vs files | 34 curriculum entries, 34 files, no orphans either way |
| Frontmatter | Every page has exactly `title` + `description`, matching the other tracks' lesson pages. Titles 38 to 56 characters (other tracks 20 to 64); descriptions 136 to 156 (other tracks 73 to 176). No `comingSoon` left. |
| H1 vs curriculum title | All 34 match exactly |
| Sidebar label length | Longest is 16 ("Break & Continue"), average 10.1. That's well under the 22-character guideline and shorter than HTML (max 21), CSS (21), JavaScript (22), and IDE (21). No label will hit the ellipsis in `LessonSidebar.vue`. |
| Chapter title length | "Object-Oriented Programming" (27) is the only one over 22, with no `sidebarTitle` (Top 5 #4) |
| "capstone" references | None in the Java track. The only occurrences site-wide are intentional: the redirect pages in `public/lessons/` and the old slugs in `SLUG_MIGRATIONS` (`useProgress.ts`), both for HTML, CSS, and JavaScript. Java's final project never had another slug; only `introduction.md` was ever committed. So no redirect or progress migration is needed. |
| Template consistency | All 34 pages: tagline, Try it, Try it yourself, 3 quizzes, Up next (final project: "Where you go from here") |
| "Up next" chain | Each lesson's last link in "Up next" is the next lesson in curriculum order, for all 33 transitions |
| Heading order / one H1 | No skipped levels; exactly one H1 per page |
| Code fence labels | All labeled: `java` (257), `text` (66) |
| Editor labels | All "Java practice editor, Main.java" |
| Em and en dashes | None |
| Quiz markup | Every `:options` array parses and every `answer-index` is in range |
| Quiz answer positions | Java: index 0: 9, index 1: 76, index 2: 16, index 3: 1 (Top 5 #5; the same skew exists in every track) |
| "Running Java here" notes | On all 34 pages, each saying in-browser running is "coming to Syntaxia soon". That's a site-wide promise, matching the README's Piston plan. Remove or reword them when the runner ships. |
| Git status | 33 of the 34 Java files are untracked (only `introduction.md` has ever been committed) |

**Other tracks' stubs (outside Java, noted for completeness).** The 18 "coming soon" placeholder pages (SCSS, Tailwind, React, and so on) still say "explore one of the sections that's ready today, like HTML or CSS". JavaScript and Java are ready now too. Suggestion: mention them, or link the lessons index instead.

---

## Missing topics

These are additions, not defects. Items marked AP match topics on the AP Computer Science A exam, which the introduction names as a reason to learn Java.

- **Recursion** (AP). A method calling itself, base cases, and the `StackOverflowError` when one is missing. The biggest gap for school learners.
- **`HashMap`**. Looking things up by key (a name to a student) is the next collection most programs need after `ArrayList`. The final project's `findStudent` loop is exactly the job a map does.
- **`Math.random` / `Random`**. Almost every beginner exercise (dice, guessing games) needs random numbers.
- **Enums**. Mentioned in The switch Statement as "later study". A short section would suit letter grades or menu choices.
- **Sorting objects** with `Comparable` or `Comparator`. Mentioned in Interfaces and the final project's stretch goals, never shown.
- **Searching and sorting algorithms** (AP): linear vs binary search, selection and insertion sort.
- **`String.split`, `String.join`, `Character` methods** as formal Strings content (Top 5 #3).
- **The ternary operator** in Operators (Top 5 #3).
- **Several files and packages**: one class per file, `package`, and `javac *.java`. Mentioned in Classes and Objects and in a final-project stretch goal only.
- **Records** (`record Point(int x, int y)`), for simple data classes in modern Java.
- **Unit testing** with JUnit, even a one-lesson introduction.

## Scope notes

- Titles, sidebar labels, and order come from `.vitepress/theme/data/curriculum.ts`.
- Java was compiled and run with Eclipse Temurin 25.0.4 (the LTS the Setting Up lesson recommends), downloaded to a temporary folder outside the repo.
- Snippet checks wrapped each fragment in a `main` method (or a class, for method and field fragments) and compiled it. Fragments that rely on classes from earlier on the same page were compiled with those classes in scope.
- Rendering questions (escaped pipes in tables, braces in quiz attributes) were settled with the markdown-it and Vue compiler versions installed in `node_modules`, not a full site build.
