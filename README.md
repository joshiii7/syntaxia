# Syntaxia

An interactive, author-written programming book covering multiple languages, frameworks, and dev tools. Every lesson is a Markdown page that can embed a live code editor and a quiz. Built with [VitePress](https://vitepress.dev).

## Getting started

```bash
npm install
npm run dev       # local dev server with hot reload
npm run build     # static production build to .vitepress/dist
npm run preview   # preview the production build locally
```

## Project structure

```
syntaxia/
├── .vitepress/
│   ├── config.mts              # site title, nav, sidebar, theme config
│   └── theme/
│       ├── index.ts            # extends the default theme, registers global components
│       ├── style.css           # cross-cutting style overrides only
│       └── components/
│           ├── CodeEditor.vue        # generic CodeMirror editor, language configurable
│           ├── WebPlayground.vue     # HTML/CSS/JS editor trio + sandboxed live preview
│           ├── Quiz.vue              # multiple-choice quiz placeholder
│           └── ScrollToTopButton.vue # fixed floating back-to-top button
├── lessons/
│   ├── ide/                     # standalone section, no editor on any page:
│   │   ├── introduction.md               # what an IDE is
│   │   ├── why-use-an-ide.md             # the case for one over a plain text editor
│   │   ├── popular-ides-overview.md      # 7 real IDEs/editors: creator, why, versions, most used
│   │   ├── choosing-the-right-ide.md     # picking one based on what you're building
│   │   ├── setting-up-your-ide.md        # installing VS Code, opening a folder
│   │   ├── ide-navigation-and-features.md # file explorer, tabs, command palette, search, split view
│   │   ├── using-the-terminal.md         # opening + basic commands in the integrated terminal
│   │   ├── debugging-basics.md           # breakpoints, stepping, reading error messages
│   │   ├── extensions-and-customization.md # what extensions are, a few useful ones, themes/settings
│   │   └── shortcuts-cheat-sheet.md      # reference page, no quiz — all shortcuts in one place
│   ├── html/                   # 25-page curriculum, in sidebar/prev-next order:
│   │   ├── introduction.md                 # theory only, no editor
│   │   ├── your-first-html-file.md         # tags + writing/opening a real .html file
│   │   ├── basic-structure.md              # doctype/html/head/body, the "letter" analogy
│   │   ├── nesting-and-the-dom.md          # nesting, DOM family tree, block/inline, whitespace, comments
│   │   ├── attributes.md                   # attribute basics, id/class, boolean attributes
│   │   ├── headings-and-paragraphs.md      # h1-h6 outline, p vs br
│   │   ├── text-formatting.md              # em/strong, quotes, abbr, code/pre, entities
│   │   ├── lists.md                        # ul/ol/dl, nesting
│   │   ├── links.md                        # absolute/relative URLs, fragments, mailto/tel, nav
│   │   ├── images.md                       # alt text, width/height, lazy, srcset, picture
│   │   ├── audio-and-video.md              # video/audio, source, track, figure/figcaption
│   │   ├── tables.md                       # accessible data tables, when not to use them
│   │   ├── forms-part-1.md                 # form, label, input types, name, submit
│   │   ├── forms-part-2.md                 # radio/checkbox/select/textarea, fieldset/legend
│   │   ├── form-validation.md              # required/pattern/min/max, hints, server caveat
│   │   ├── divs-and-spans.md               # generic containers, div soup
│   │   ├── semantic-html.md                # landmark elements, article vs section vs div
│   │   ├── attributes-deep-dive.md         # global attributes, data-*
│   │   ├── accessibility-basics.md         # focus order, skip link, ARIA basics
│   │   ├── meta-and-head-tags.md           # title/description/viewport/canonical/OG/JSON-LD, SEO
│   │   ├── iframes-and-embedding.md        # iframe, title, sandbox/allow, srcdoc
│   │   ├── details-dialog-and-template.md  # details/summary, dialog, template
│   │   ├── best-practices.md               # habits, anti-patterns, validator, bug hunt
│   │   ├── html-meets-css-and-js.md        # bridge lesson: link, script defer, hooks
│   │   └── final-project.md                # final project: graded <Exercise> profile page + self-check
│   ├── css/                    # 24-page curriculum, in sidebar/prev-next order:
│   │   ├── intro-to-css.md                       # bridge from HTML, what CSS is, rule anatomy
│   │   ├── applying-css.md                       # inline vs internal vs external
│   │   ├── selectors.md                          # type/class/id/attribute, combinators
│   │   ├── pseudo-classes-and-pseudo-elements.md # :nth-child, :not, :has, ::before/::after
│   │   ├── cascade-and-specificity.md            # specificity scoring, order, inheritance, !important
│   │   ├── box-model.md                          # padding/border/margin, border-box, collapsing
│   │   ├── colors.md                             # named/hex/rgb/hsl, alpha, contrast
│   │   ├── units.md                              # px/rem/em/%/vw/ch, when to use which
│   │   ├── typography.md                         # font stacks, web fonts, line-height
│   │   ├── backgrounds-and-borders.md            # gradients, border-radius, box-shadow, outline
│   │   ├── display.md                            # block/inline/inline-block, none vs hidden, overflow
│   │   ├── positioning.md                        # relative/absolute/fixed/sticky, z-index
│   │   ├── flexbox.md                            # axes, justify-content, align-items, gap
│   │   ├── flexbox-in-practice.md                # grow/shrink/basis, wrap, nav bar, media object
│   │   ├── grid.md                               # columns/rows, fr, lines, span
│   │   ├── grid-in-practice.md                   # template areas, auto-fit + minmax
│   │   ├── responsive-design.md                  # mobile-first media queries, clamp, preferences
│   │   ├── css-variables.md                      # custom properties, theming, dark mode
│   │   ├── interactive-states.md                 # :hover/:focus-visible/:active, form states
│   │   ├── transitions-and-animations.md         # transitions, @keyframes, reduced motion
│   │   ├── layout-patterns.md                    # centering, sticky header/footer, card grid
│   │   ├── best-practices.md                     # organization, naming, anti-patterns, bug hunt
│   │   ├── css-meets-javascript.md               # bridge lesson: classList, aria state, variables
│   │   └── final-project.md                      # graded <Exercise> styling the HTML final project page
│   ├── javascript/intro-to-javascript.md
│   ├── java/                   # 34-page curriculum, in sidebar/prev-next order:
│   │   ├── introduction.md ... how-java-runs.md  # Getting Started: what Java is, JDK setup, first program, javac + JVM
│   │   ├── variables.md ... strings.md           # Values & Operators: types, operators, casting, Scanner, Strings
│   │   ├── if-else.md ... nested-loops.md        # Control Flow: if/else, switch, loops, break/continue
│   │   ├── methods.md ... scope.md               # Methods: parameters, return, overloading, scope
│   │   ├── arrays.md ... arraylist.md            # Arrays & Collections: arrays, 2D arrays, ArrayList
│   │   ├── classes-and-objects.md ... static-and-this.md  # OOP: classes through interfaces, static and this
│   │   ├── debugging.md ... file-io.md           # Errors & Files: stack traces, exceptions, text files
│   │   ├── best-practices.md                     # habits and the classic beginner mistakes checklist
│   │   └── final-project.md                      # Student Grade Manager console app + reference solution
│   ├── python/                 # 38-page curriculum (intro-to-python.md through final-project.md: Personal Budget Tracker)
│   ├── sqlite3/                # 25-page curriculum; its SQL Foundations chapter is shared by the MySQL and Oracle tracks
│   ├── php/                    # 34-page curriculum (introduction.md through final-project.md: Event Sign-Up Sheet)
│   ├── mysql/                  # 18-page curriculum (introduction.md through final-project.md: Online Store Database)
│   └── oracle-database/        # 21-page curriculum (introduction.md through final-project.md: Course Enrollment System)
├── public/                     # static assets (favicon, etc.)
└── index.md                    # home page
```

## Components

Both components are registered globally (see `.vitepress/theme/index.ts`), so any lesson Markdown file can use them directly with no import.

### `CodeEditor`

A single CodeMirror 6 instance. Use it for any language that doesn't need a live preview.

```md
<CodeEditor
	language="python"
	label="Python practice editor"
	:model-value="'print(\"hi\")'"
/>
```

`language` accepts `html`, `css`, `javascript`, `python`, `java`, or `plaintext` (the fallback for every other language in the book — you still get an editor with line numbers, selection, and history, just without syntax highlighting until a dedicated `@codemirror/lang-*` package is added for that language).

### `WebPlayground`

For HTML/CSS/JS lessons: one or more `CodeEditor` panes stacked above a sandboxed `<iframe>` preview. The `panes` prop controls which editors show — a single-language lesson (HTML-only, or CSS/JS against fixed HTML) passes just the one it teaches, so CSS and JS lessons don't drag an HTML editor along, and vice versa. The preview rebuilds from `srcdoc` — debounced on every keystroke and on a manual **Run** button — so the learner's script only ever runs inside the sandboxed iframe (`sandbox="allow-scripts"`, no `allow-same-origin`), never in the site's own page context.

```md
<WebPlayground
	:panes="['html', 'css', 'javascript']"
	:initial-html="'<h1>Hi</h1>'"
	:initial-css="'h1 { color: teal; }'"
	:initial-js="'console.log(1 + 1);'"
/>
```

### `Quiz`

A single multiple-choice question with immediate feedback.

```md
<Quiz
	question="Which tag closes an opening <p> tag?"
	:options="['<p>', '</p>', '<end p>', '<close p>']"
	:answer-index="1"
	explanation="A closing tag repeats the element name with a leading slash."
/>
```

## Running/checking code for non-browser languages

`WebPlayground` covers HTML/CSS/JS because the browser can already execute all three natively and safely, sandboxed in an iframe. Every other language the book will eventually cover (Python, and later others) needs an actual interpreter/compiler somewhere, since none of that can run in a plain browser tab. Two realistic approaches, evaluated for this project:

### Option A — Client-side execution via Pyodide (or an equivalent WASM runtime)

Pyodide compiles CPython to WebAssembly and runs it entirely in the learner's browser.

**Pros**
- No server to run, scale, rate-limit, or pay for — fits a static site hosted on GitHub Pages/Netlify/Vercel with zero backend.
- No network round-trip once the runtime is loaded, so repeated runs (which a learner does constantly while experimenting) are instant.
- No user code ever leaves the browser — nothing to sandbox against on a server, no abuse vector to defend.

**Cons**
- Large initial download (Pyodide's core bundle is tens of MB, more once common packages like `numpy` are pulled in) — needs lazy-loading only when a Python lesson is opened, and a visible "loading the Python runtime…" state.
- Python-only (or whatever specific WASM runtime exists for a given language) — there's no single WASM runtime that covers every language the book wants to teach. Each additional non-web language needs its own runtime story evaluated separately, and some languages simply don't have a mature WASM runtime yet.
- Real-world library support is partial — pure-Python packages generally work; anything with C extensions needs Pyodide's own prebuilt package, which doesn't exist for every PyPI package.

### Option B — Server-side execution via a code execution API (Judge0, Piston)

The editor sends the learner's code to a hosted or self-hosted sandboxed execution service and displays the returned stdout/stderr.

**Pros**
- One integration covers dozens of languages immediately (Judge0 and Piston both support C, C++, Java, Go, Rust, Ruby, etc. out of the box) — the natural fit for a book that explicitly covers "multiple programming languages, frameworks, and dev tools," not just Python.
- No large runtime download in the browser; the editor stays lightweight regardless of how many languages are added.
- Execution happens in a real, isolated environment per language, so behavior matches what a learner would see running the same code locally.

**Cons**
- Needs a backend dependency: either a paid hosted API (rate limits, cost per execution, an API key to protect — see [[security-standards]], never expose it client-side) or self-hosting Judge0/Piston (a real server to provision, patch, and keep available — this stops being a "static site" in the deployment sense).
- A network round-trip per run adds latency a learner feels on every single edit-run cycle, unlike the instant local loop of Option A.
- Running arbitrary user-submitted code on a server is a genuine security surface (resource exhaustion, sandbox escapes) — both projects handle this, but it's the operator's responsibility to keep it patched and rate-limited, not something to treat as solved-and-forgettable.

### Recommendation

Use **Pyodide for Python specifically** — it's the language actually scaffolded in this book right now, a mature WASM runtime already exists for it, and running fully client-side keeps the site static with no backend or API cost, which matches the project's current scope (an author-written static book, no server infrastructure yet).

For every other non-web language the book adds later, evaluate case by case:
- If a mature WASM runtime exists for that language (e.g. many focus on Python/Ruby/Lua-style dynamic languages) and it's genuinely used interactively, prefer the client-side approach for the same reasons as Python.
- Once the book covers several languages that have no realistic WASM story (C, Java, Go, etc.), a single Judge0/Piston integration is the more scalable move — one backend covers all of them at once, rather than chasing a WASM runtime per language. At that point, self-host Piston (open source, no per-request cost, no API key to leak) behind the book's own thin API route rather than calling a third-party hosted Judge0 endpoint directly from the browser.

The Python track's lessons currently use `CodeEditor` only (syntax highlighting, no execution), with a "predict the output" answer block, so the Pyodide integration can be added as its own deliberate piece of work. Every editor program is written to run as-is once it lands. Programs that call `input()` will need a way to supply typed answers: GitHub Pages can't send the COOP/COEP headers that blocking `input()` from a worker requires.

### Java

**Planned default: self-hosted Piston**, behind the book's own thin API route, as described above. Java has no small, mature in-browser runtime, and one Piston backend will also cover the other compiled languages the book adds later. It supports standard input (needed for the `Scanner` lessons) and runs a real JDK, so lessons can use current Java syntax. Nothing is wired up yet: Java lessons currently use `CodeEditor` in Java mode (highlighting only, via `@codemirror/lang-java`), with a "predict the output" answer block instead of a Run button.

**Alternative if the site must stay fully static: CheerpJ**, a Java runtime compiled to WebAssembly that can run `javac` and the resulting program in the browser, with no server at all. Before choosing it, check three things: its license terms for this use, the newest Java version its in-browser compiler supports (it has historically lagged behind current releases), and the size of the first download, which needs a visible loading state.

### PHP

**Decided: in-browser, with `php-wasm`** ([seanmorris/php-wasm](https://github.com/seanmorris/php-wasm), npm `php-wasm`), PHP compiled to WebAssembly. Unlike Java, PHP runs well in the browser: output is usually HTML, which can be shown in the same sandboxed preview `WebPlayground` uses, and the package includes SQLite through PDO, so the database lessons can run in the browser too. Lessons that need real HTTP requests, sessions, or cookies fall back to "predict the output" plus PHP's built-in local server (`php -S localhost:8000`). Nothing is wired up yet: PHP lessons currently use `CodeEditor` in plain-text mode with a "predict the output" answer block, like Java. Every snippet's output was produced by a real PHP 8.5 run; multi-file and web-only examples (forms, sessions, include, Composer, the final project) were run through the built-in server.

**Licensing, the reason for this pick.** `php-wasm` is dual-licensed Apache-2.0 / GPL-2.0, and we use it under **Apache-2.0**, a permissive license that doesn't affect how the site's own code (ISC) is licensed or shared. When it's added:

- keep its license and any `NOTICE` file with the bundled files, as Apache-2.0 requires;
- add the attribution the PHP License requires for the bundled PHP runtime ("This product includes PHP software, freely available from http://www.php.net/software/"), for example on the About or Accessibility page, or a credits page;
- pin an exact version, since the package is still pre-1.0.

The alternative, `@php-wasm/web` from WordPress Playground, is more widely used but licensed GPL-2.0-or-later only. Bundling it into the site's served JavaScript would likely bring GPL obligations to what's distributed with it, so it was ruled out.

### MySQL and Oracle Database

Neither can run in the browser: both need a real database server. Their lessons use `CodeEditor` (highlighting only) with a "predict the output" answer block, like Java and PHP. MySQL lesson outputs came from a real MySQL 9.7.2 server, and the PHP examples in them ran against it. Oracle lesson outputs came from Oracle 26ai through the free FreeSQL service (queries, the HR sample tables, and PL/SQL blocks); examples that create tables, sequences, triggers, or packages need a signed-in account there, so their results follow Oracle's documented behavior instead.

## Conventions

- Indentation is tabs, width 4 (`.editorconfig`).
- No inline `<script>`/`style="..."` — Vue SFC `<script setup>` and scoped `<style>` blocks are the only sanctioned way to add behavior/styling to a component.
- Every editor and quiz control is native HTML (`<button>`, `<input type="radio">`, `<fieldset>`/`<legend>`) with visible focus states, so keyboard and screen-reader support come for free rather than being reimplemented with ARIA.
