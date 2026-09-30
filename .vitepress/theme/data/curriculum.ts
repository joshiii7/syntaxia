/**
 * Single source of truth for lesson order, chapter grouping, and titles used
 * in navigation (sidebar, breadcrumb, next/prev). Replaces three previously
 * hand-duplicated orderings: config.mts's static sidebar array, the prose
 * list in lessons/index.md, and hand-written "Next lesson" links at the
 * bottom of each lesson body.
 *
 * Plain data + pure functions only — no Vue/browser/Node APIs — so this file
 * imports identically from .vitepress/config.mts (Node, build-time) and from
 * any .vue component (browser + SSR).
 *
 * Lesson `title` is intentionally duplicated here rather than read from each
 * .md's frontmatter: config.mts needs this synchronously at config-load
 * time, and frontmatter `title` remains solely the <title>/meta-tag source,
 * unrelated to navigation order.
 */

export interface CurriculumLesson {
	/** URL slug, matches the .md filename without extension. */
	slug: string;
	title: string;
	/**
	 * Short label used only in the lesson sidebar: 1 to 3 words, ideally
	 * under 22 characters. Everywhere else (breadcrumb, next/prev, headings)
	 * keeps the full `title`. Falls back to `title` when omitted.
	 */
	sidebarTitle?: string;
}

export interface CurriculumChapter {
	/** Stable id, kebab-case. Never appears in a URL. */
	id: string;
	title: string;
	/** Short sidebar-only section heading, same rules as CurriculumLesson.sidebarTitle. */
	sidebarTitle?: string;
	lessons: CurriculumLesson[];
}

/** The label to show in the sidebar: the short one when set, otherwise the full title. */
export function sidebarLabel(item: { title: string; sidebarTitle?: string }): string {
	return item.sidebarTitle ?? item.title;
}

export interface CurriculumTrack {
	/** URL segment under /lessons/, matches the lessons/<slug>/ directory. */
	slug: string;
	title: string;
	/** Exactly one of `chapters`/`lessons` is set — enforced by assertValidCurriculum(). */
	chapters?: CurriculumChapter[];
	lessons?: CurriculumLesson[];
	/** True for a track that isn't ready yet: either a single placeholder lesson, or full chapters that are still mostly stub lessons (frontmatter `comingSoon: true`). Surfaced as a "Coming Soon" badge in LessonsIndex.vue rather than hidden, since the track is already real and navigable. Remove it once the track's lessons are written. */
	comingSoon?: boolean;
}

export const curriculum: CurriculumTrack[] = [
	{
		slug: 'ide',
		title: 'IDEs',
		lessons: [
			{ slug: 'introduction', title: 'Introduction to IDEs', sidebarTitle: 'Introduction' },
			{ slug: 'why-use-an-ide', title: 'Why Use an IDE?', sidebarTitle: 'Why an IDE?' },
			{ slug: 'popular-ides-overview', title: 'Popular IDEs & Code Editors Overview', sidebarTitle: 'Popular Editors' },
			{ slug: 'choosing-the-right-ide', title: 'Choosing the Right IDE for Your Path', sidebarTitle: 'Choosing an IDE' },
			{ slug: 'setting-up-your-ide', title: 'Setting Up Your IDE', sidebarTitle: 'IDE Setup' },
			{ slug: 'ide-navigation-and-features', title: 'Basic IDE Navigation & Features', sidebarTitle: 'Navigation & Features' },
			{ slug: 'using-the-terminal', title: 'Using the Integrated Terminal', sidebarTitle: 'The Terminal' },
			{ slug: 'debugging-basics', title: 'Debugging Basics in an IDE', sidebarTitle: 'Debugging Basics' },
			{ slug: 'extensions-and-customization', title: 'Extensions & Customization', sidebarTitle: 'Extensions' },
			{ slug: 'shortcuts-cheat-sheet', title: 'IDE Shortcuts Cheat Sheet', sidebarTitle: 'Shortcuts' },
		],
	},
	{
		slug: 'html',
		title: 'HTML',
		chapters: [
			{
				id: 'getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'introduction', title: 'Introduction to HTML', sidebarTitle: 'Introduction' },
					{ slug: 'your-first-html-file', title: 'Your First HTML File', sidebarTitle: 'First HTML File' },
				],
			},
			{
				id: 'document-foundations',
				title: 'Document Foundations',
				lessons: [
					{ slug: 'basic-structure', title: 'Anatomy of an HTML Document', sidebarTitle: 'Document Anatomy' },
					{ slug: 'nesting-and-the-dom', title: 'Nesting and the DOM', sidebarTitle: 'Nesting & the DOM' },
					{ slug: 'attributes', title: 'Attributes' },
				],
			},
			{
				id: 'text-and-content',
				title: 'Text & Content',
				lessons: [
					{ slug: 'headings-and-paragraphs', title: 'Headings and Paragraphs', sidebarTitle: 'Headings & Paragraphs' },
					{ slug: 'text-formatting', title: 'Emphasis, Quotes, and Code', sidebarTitle: 'Text Formatting' },
					{ slug: 'lists', title: 'Lists' },
				],
			},
			{
				id: 'links-and-media',
				title: 'Links & Media',
				lessons: [
					{ slug: 'links', title: 'Links and Navigation', sidebarTitle: 'Links' },
					{ slug: 'images', title: 'Images' },
					{ slug: 'audio-and-video', title: 'Audio, Video, and Figures', sidebarTitle: 'Audio & Video' },
				],
			},
			{
				id: 'tables-and-forms',
				title: 'Tables & Forms',
				lessons: [
					{ slug: 'tables', title: 'Tables' },
					{ slug: 'forms-part-1', title: 'Forms: The Basics', sidebarTitle: 'Form Basics' },
					{ slug: 'forms-part-2', title: 'More Form Controls' },
					{ slug: 'form-validation', title: 'Form Validation' },
				],
			},
			{
				id: 'structure-and-meaning',
				title: 'Structure & Meaning',
				lessons: [
					{ slug: 'divs-and-spans', title: 'Divs and Spans', sidebarTitle: 'Divs & Spans' },
					{ slug: 'semantic-html', title: 'Semantic HTML' },
					{ slug: 'attributes-deep-dive', title: 'Attributes Deep Dive' },
					{ slug: 'accessibility-basics', title: 'Accessibility Basics' },
				],
			},
			{
				id: 'head-embeds-and-widgets',
				title: 'The Head, Embeds & Widgets',
				sidebarTitle: 'Head & Embeds',
				lessons: [
					{ slug: 'meta-and-head-tags', title: 'Meta Tags and SEO', sidebarTitle: 'Meta Tags & SEO' },
					{ slug: 'iframes-and-embedding', title: 'iframes and Embedding', sidebarTitle: 'iframes' },
					{ slug: 'details-dialog-and-template', title: 'details, dialog, and template', sidebarTitle: 'Details & Dialog' },
				],
			},
			{
				id: 'going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'html-meets-css-and-js', title: 'Where HTML Meets CSS and JS', sidebarTitle: 'HTML, CSS & JS' },
					{ slug: 'final-project', title: 'Final Project: Your Profile Page', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'css',
		title: 'CSS',
		chapters: [
			{
				id: 'css-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'intro-to-css', title: 'What CSS Is and Why It Exists', sidebarTitle: 'What Is CSS?' },
					{ slug: 'applying-css', title: 'Three Ways to Add CSS', sidebarTitle: 'Adding CSS' },
				],
			},
			{
				id: 'selectors-and-cascade',
				title: 'Selectors & the Cascade',
				sidebarTitle: 'Selectors & Cascade',
				lessons: [
					{ slug: 'selectors', title: 'Selectors' },
					{ slug: 'pseudo-classes-and-pseudo-elements', title: 'Pseudo-classes and Pseudo-elements', sidebarTitle: 'Pseudo-classes' },
					{ slug: 'cascade-and-specificity', title: 'The Cascade and Specificity', sidebarTitle: 'Cascade & Specificity' },
				],
			},
			{
				id: 'box-and-visuals',
				title: 'The Box & Visual Styling',
				sidebarTitle: 'Box & Visuals',
				lessons: [
					{ slug: 'box-model', title: 'The Box Model', sidebarTitle: 'Box Model' },
					{ slug: 'colors', title: 'Colors' },
					{ slug: 'units', title: 'Units' },
					{ slug: 'typography', title: 'Typography' },
					{ slug: 'backgrounds-and-borders', title: 'Backgrounds, Borders, and Shadows', sidebarTitle: 'Backgrounds & Borders' },
				],
			},
			{
				id: 'layout',
				title: 'Layout',
				lessons: [
					{ slug: 'display', title: 'Display' },
					{ slug: 'positioning', title: 'Positioning and z-index', sidebarTitle: 'Positioning' },
					{ slug: 'flexbox', title: 'Flexbox: The Basics', sidebarTitle: 'Flexbox Basics' },
					{ slug: 'flexbox-in-practice', title: 'Flexbox in Practice' },
					{ slug: 'grid', title: 'CSS Grid: The Basics', sidebarTitle: 'Grid Basics' },
					{ slug: 'grid-in-practice', title: 'CSS Grid in Practice', sidebarTitle: 'Grid in Practice' },
				],
			},
			{
				id: 'responsive-and-interactive',
				title: 'Responsive & Interactive',
				lessons: [
					{ slug: 'responsive-design', title: 'Responsive Design and Media Queries', sidebarTitle: 'Responsive Design' },
					{ slug: 'css-variables', title: 'CSS Variables' },
					{ slug: 'interactive-states', title: 'Hover, Focus, and Interactive States', sidebarTitle: 'Interactive States' },
					{ slug: 'transitions-and-animations', title: 'Transitions and Animations', sidebarTitle: 'Animations' },
				],
			},
			{
				id: 'css-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'layout-patterns', title: 'Common Layout Patterns', sidebarTitle: 'Layout Patterns' },
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'css-meets-javascript', title: 'Where CSS Meets JavaScript', sidebarTitle: 'CSS & JavaScript' },
					{ slug: 'final-project', title: 'Final Project: Style Your Profile Page', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'javascript',
		title: 'JavaScript',
		chapters: [
			{
				id: 'js-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'intro-to-javascript', title: 'What JavaScript Is and Why It Exists', sidebarTitle: 'What Is JavaScript?' },
					{ slug: 'adding-javascript', title: 'Adding JavaScript to a Page', sidebarTitle: 'Adding JavaScript' },
				],
			},
			{
				id: 'values-and-operators',
				title: 'Values & Operators',
				lessons: [
					{ slug: 'variables', title: 'Variables: let and const', sidebarTitle: 'Variables' },
					{ slug: 'data-types', title: 'Numbers, Strings, and Booleans', sidebarTitle: 'Data Types' },
					{ slug: 'operators', title: 'Operators and Comparisons', sidebarTitle: 'Operators' },
				],
			},
			{
				id: 'control-flow',
				title: 'Control Flow',
				lessons: [
					{ slug: 'conditionals', title: 'Making Decisions: if, else, and switch', sidebarTitle: 'Conditionals' },
					{ slug: 'loops', title: 'Loops' },
				],
			},
			{
				id: 'functions',
				title: 'Functions',
				lessons: [
					{ slug: 'functions', title: 'Functions' },
					{ slug: 'arrow-functions', title: 'Arrow Functions and Callbacks', sidebarTitle: 'Arrow Functions' },
					{ slug: 'scope-and-closures', title: 'Scope and Closures', sidebarTitle: 'Scope & Closures' },
				],
			},
			{
				id: 'working-with-data',
				title: 'Working with Data',
				lessons: [
					{ slug: 'arrays', title: 'Arrays' },
					{ slug: 'array-methods', title: 'Array Methods: map, filter, find, reduce', sidebarTitle: 'Array Methods' },
					{ slug: 'objects', title: 'Objects' },
					{ slug: 'destructuring-and-spread', title: 'Destructuring and Spread', sidebarTitle: 'Destructuring & Spread' },
					{ slug: 'strings-and-regex', title: 'Strings and Regular Expressions', sidebarTitle: 'Strings & Regex' },
					{ slug: 'json', title: 'JSON' },
				],
			},
			{
				id: 'the-dom',
				title: 'The DOM',
				lessons: [
					{ slug: 'selecting-elements', title: 'Finding Elements' },
					{ slug: 'changing-elements', title: 'Changing Text, Attributes, and Classes', sidebarTitle: 'Changing Elements' },
					{ slug: 'creating-elements', title: 'Creating and Removing Elements', sidebarTitle: 'Creating Elements' },
					{ slug: 'events', title: 'Events' },
					{ slug: 'forms-with-javascript', title: 'Forms and Custom Validation', sidebarTitle: 'Forms & Validation' },
				],
			},
			{
				id: 'going-deeper',
				title: 'Going Deeper',
				lessons: [
					{ slug: 'this-and-classes', title: 'this and Classes', sidebarTitle: 'this & Classes' },
					{ slug: 'errors-and-debugging', title: 'Errors and Debugging', sidebarTitle: 'Errors & Debugging' },
					{ slug: 'modules', title: 'Modules: import and export', sidebarTitle: 'Modules' },
				],
			},
			{
				id: 'asynchronous-javascript',
				title: 'Asynchronous JavaScript',
				sidebarTitle: 'Async JavaScript',
				lessons: [
					{ slug: 'timers-and-the-event-loop', title: 'Timers and the Event Loop', sidebarTitle: 'Timers & Event Loop' },
					{ slug: 'promises-and-async-await', title: 'Promises and async/await', sidebarTitle: 'Promises & Async' },
					{ slug: 'fetch', title: 'Loading Data with fetch', sidebarTitle: 'Fetch' },
					{ slug: 'local-storage', title: 'Saving Data with localStorage', sidebarTitle: 'localStorage' },
				],
			},
			{
				id: 'js-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: Bring Your Profile Page to Life', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'python',
		title: 'Python',
		chapters: [
			{
				id: 'python-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'intro-to-python', title: "What Python Is and Why It's Used", sidebarTitle: 'What Is Python?' },
					{ slug: 'setting-up', title: 'Setting Up Python on Your Computer', sidebarTitle: 'Setting Up' },
					{ slug: 'first-program', title: 'Your First Python Program', sidebarTitle: 'First Program' },
					{ slug: 'how-python-runs', title: 'How Python Runs: Scripts and the Interactive Shell', sidebarTitle: 'How Python Runs' },
				],
			},
			{
				id: 'python-values-and-operators',
				title: 'Values & Operators',
				lessons: [
					{ slug: 'variables', title: 'Variables and Naming', sidebarTitle: 'Variables' },
					{ slug: 'data-types', title: 'Numbers, Strings, and Booleans', sidebarTitle: 'Data Types' },
					{ slug: 'operators', title: 'Operators and Expressions', sidebarTitle: 'Operators' },
					{ slug: 'type-conversion', title: 'Type Conversion' },
					{ slug: 'user-input', title: 'Reading User Input with input()', sidebarTitle: 'User Input' },
					{ slug: 'strings', title: 'Working with Strings', sidebarTitle: 'Strings' },
					{ slug: 'f-strings', title: 'Formatting Output with f-strings', sidebarTitle: 'f-strings' },
				],
			},
			{
				id: 'python-control-flow',
				title: 'Control Flow',
				lessons: [
					{ slug: 'if-elif-else', title: 'Making Decisions: if, elif, and else', sidebarTitle: 'if / elif / else' },
					{ slug: 'while-loops', title: 'while Loops' },
					{ slug: 'for-loops', title: 'for Loops and range()', sidebarTitle: 'for & range()' },
					{ slug: 'break-and-continue', title: 'break and continue', sidebarTitle: 'break & continue' },
					{ slug: 'nested-loops', title: 'Nested Loops' },
				],
			},
			{
				id: 'python-functions-and-modules',
				title: 'Functions & Modules',
				lessons: [
					{ slug: 'functions', title: 'Writing Functions', sidebarTitle: 'Functions' },
					{ slug: 'parameters', title: 'Parameters and Return Values', sidebarTitle: 'Parameters' },
					{ slug: 'default-and-keyword-arguments', title: 'Default and Keyword Arguments', sidebarTitle: 'Default & Keyword Args' },
					{ slug: 'scope', title: 'Variable Scope', sidebarTitle: 'Scope' },
					{ slug: 'modules', title: 'Modules and import', sidebarTitle: 'Modules' },
				],
			},
			{
				id: 'python-data-structures',
				title: 'Data Structures',
				lessons: [
					{ slug: 'lists', title: 'Lists' },
					{ slug: 'tuples', title: 'Tuples' },
					{ slug: 'dictionaries', title: 'Dictionaries' },
					{ slug: 'sets', title: 'Sets' },
					{ slug: 'comprehensions', title: 'List and Dictionary Comprehensions', sidebarTitle: 'Comprehensions' },
					{ slug: 'nested-data', title: 'Nested Data Structures', sidebarTitle: 'Nested Data' },
				],
			},
			{
				id: 'python-objects-and-classes',
				title: 'Objects & Classes',
				lessons: [
					{ slug: 'classes-and-objects', title: 'Classes and Objects', sidebarTitle: 'Classes' },
					{ slug: 'methods-and-self', title: 'Methods and self', sidebarTitle: 'Methods & self' },
					{ slug: 'inheritance', title: 'Inheritance' },
					{ slug: 'special-methods', title: 'Special Methods: __str__ and Friends', sidebarTitle: 'Special Methods' },
				],
			},
			{
				id: 'python-errors-and-files',
				title: 'Errors & Files',
				lessons: [
					{ slug: 'debugging', title: 'Debugging Python Programs', sidebarTitle: 'Debugging' },
					{ slug: 'exceptions', title: 'Exceptions: try, except, and raise', sidebarTitle: 'Exceptions' },
					{ slug: 'file-io', title: 'Reading and Writing Files', sidebarTitle: 'File I/O' },
					{ slug: 'json', title: 'Working with JSON', sidebarTitle: 'JSON' },
				],
			},
			{
				id: 'python-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'packages-and-venv', title: 'Packages, pip, and Virtual Environments', sidebarTitle: 'pip & venv' },
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: Personal Budget Tracker', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'java',
		title: 'Java',
		// Lesson order is provisional: to reorder, move a lesson's line (or a
		// whole chapter) within this list. Titles, sidebar labels, and slugs
		// travel together, and navigation follows the order automatically.
		chapters: [
			{
				id: 'java-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'introduction', title: "What Java Is and Why It's Used", sidebarTitle: 'What Is Java?' },
					{ slug: 'setting-up', title: 'Setting Up Java on Your Computer', sidebarTitle: 'Setting Up' },
					{ slug: 'first-program', title: 'Your First Java Program', sidebarTitle: 'First Program' },
					{ slug: 'how-java-runs', title: 'How Java Runs: the Compiler and the JVM', sidebarTitle: 'How Java Runs' },
				],
			},
			{
				id: 'java-values-and-operators',
				title: 'Values & Operators',
				lessons: [
					{ slug: 'variables', title: 'Variables and Constants', sidebarTitle: 'Variables' },
					{ slug: 'data-types', title: 'Primitive Data Types', sidebarTitle: 'Data Types' },
					{ slug: 'operators', title: 'Operators and Expressions', sidebarTitle: 'Operators' },
					{ slug: 'type-casting', title: 'Type Casting and Conversion', sidebarTitle: 'Type Casting' },
					{ slug: 'user-input', title: 'Reading User Input with Scanner', sidebarTitle: 'User Input' },
					{ slug: 'strings', title: 'Working with Strings', sidebarTitle: 'Strings' },
				],
			},
			{
				id: 'java-control-flow',
				title: 'Control Flow',
				lessons: [
					{ slug: 'if-else', title: 'Making Decisions: if and else', sidebarTitle: 'if / else' },
					{ slug: 'switch', title: 'The switch Statement', sidebarTitle: 'switch' },
					{ slug: 'loops', title: 'Loops: for, while, and do-while', sidebarTitle: 'Loops' },
					{ slug: 'break-and-continue', title: 'break and continue', sidebarTitle: 'break & continue' },
					{ slug: 'nested-loops', title: 'Nested Loops' },
				],
			},
			{
				id: 'java-methods',
				title: 'Methods',
				lessons: [
					{ slug: 'methods', title: 'Writing Methods', sidebarTitle: 'Methods' },
					{ slug: 'parameters', title: 'Parameters and Return Values', sidebarTitle: 'Parameters' },
					{ slug: 'overloading', title: 'Method Overloading', sidebarTitle: 'Overloading' },
					{ slug: 'scope', title: 'Variable Scope', sidebarTitle: 'Scope' },
				],
			},
			{
				id: 'java-arrays-and-collections',
				title: 'Arrays & Collections',
				lessons: [
					{ slug: 'arrays', title: 'Arrays' },
					{ slug: '2d-arrays', title: '2D Arrays' },
					{ slug: 'arraylist', title: 'ArrayList' },
				],
			},
			{
				id: 'java-oop',
				title: 'Object-Oriented Programming',
				sidebarTitle: 'Object-Oriented Java',
				lessons: [
					{ slug: 'classes-and-objects', title: 'Classes and Objects', sidebarTitle: 'Classes' },
					{ slug: 'constructors', title: 'Constructors' },
					{ slug: 'encapsulation', title: 'Encapsulation: private, Getters, and Setters', sidebarTitle: 'Encapsulation' },
					{ slug: 'inheritance', title: 'Inheritance' },
					{ slug: 'polymorphism', title: 'Polymorphism' },
					{ slug: 'interfaces', title: 'Interfaces' },
					{ slug: 'static-and-this', title: 'static and this', sidebarTitle: 'static & this' },
				],
			},
			{
				id: 'java-errors-and-files',
				title: 'Errors & Files',
				lessons: [
					{ slug: 'debugging', title: 'Debugging Java Programs', sidebarTitle: 'Debugging' },
					{ slug: 'exceptions', title: 'Exceptions: try, catch, and throw', sidebarTitle: 'Exceptions' },
					{ slug: 'file-io', title: 'Reading and Writing Files', sidebarTitle: 'File I/O' },
				],
			},
			{
				id: 'java-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: Student Grade Manager', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'php',
		title: 'PHP',
		chapters: [
			{
				id: 'php-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'introduction', title: "What PHP Is and Why It's Used", sidebarTitle: 'What Is PHP?' },
					{ slug: 'setting-up', title: 'Setting Up PHP on Your Computer', sidebarTitle: 'Setting Up' },
					{ slug: 'first-script', title: 'Your First PHP Script', sidebarTitle: 'First Script' },
					{ slug: 'php-and-html', title: 'Mixing PHP and HTML', sidebarTitle: 'PHP & HTML' },
					{ slug: 'how-php-runs', title: 'How PHP Runs: Requests and Responses', sidebarTitle: 'How PHP Runs' },
				],
			},
			{
				id: 'php-values-and-operators',
				title: 'Values & Operators',
				lessons: [
					{ slug: 'variables', title: 'Variables and Constants', sidebarTitle: 'Variables' },
					{ slug: 'data-types', title: 'Data Types' },
					{ slug: 'operators', title: 'Operators and Expressions', sidebarTitle: 'Operators' },
					{ slug: 'strings', title: 'Working with Strings', sidebarTitle: 'Strings' },
					{ slug: 'type-juggling', title: 'Type Juggling and Strict Comparisons', sidebarTitle: 'Type Juggling' },
				],
			},
			{
				id: 'php-control-flow',
				title: 'Control Flow',
				lessons: [
					{ slug: 'if-else', title: 'Making Decisions: if, elseif, and else', sidebarTitle: 'if / elseif / else' },
					{ slug: 'switch-and-match', title: 'switch and match', sidebarTitle: 'switch & match' },
					{ slug: 'loops', title: 'Loops: for, while, and foreach', sidebarTitle: 'Loops' },
				],
			},
			{
				id: 'php-functions',
				title: 'Functions',
				lessons: [
					{ slug: 'functions', title: 'Writing Functions', sidebarTitle: 'Functions' },
					{ slug: 'parameters', title: 'Parameters, Types, and Return Values', sidebarTitle: 'Parameters' },
					{ slug: 'scope', title: 'Variable Scope', sidebarTitle: 'Scope' },
					{ slug: 'include-and-require', title: 'Splitting Code with include and require', sidebarTitle: 'include & require' },
				],
			},
			{
				id: 'php-arrays',
				title: 'Arrays',
				lessons: [
					{ slug: 'arrays', title: 'Indexed Arrays', sidebarTitle: 'Arrays' },
					{ slug: 'associative-arrays', title: 'Associative Arrays' },
					{ slug: 'array-functions', title: 'Array Functions: sort, filter, and map', sidebarTitle: 'Array Functions' },
				],
			},
			{
				id: 'php-web',
				title: 'PHP on the Web',
				lessons: [
					{ slug: 'forms', title: 'Handling Forms: GET and POST', sidebarTitle: 'Forms: GET & POST' },
					{ slug: 'validating-input', title: 'Validating and Escaping User Input', sidebarTitle: 'Validating Input' },
					{ slug: 'sessions-and-cookies', title: 'Sessions and Cookies', sidebarTitle: 'Sessions & Cookies' },
				],
			},
			{
				id: 'php-objects',
				title: 'Objects',
				lessons: [
					{ slug: 'classes-and-objects', title: 'Classes and Objects', sidebarTitle: 'Classes' },
					{ slug: 'constructors-and-visibility', title: 'Constructors and Visibility', sidebarTitle: 'Constructors' },
					{ slug: 'inheritance-and-interfaces', title: 'Inheritance and Interfaces', sidebarTitle: 'Inheritance' },
					{ slug: 'namespaces-and-composer', title: 'Namespaces and Composer', sidebarTitle: 'Namespaces & Composer' },
				],
			},
			{
				id: 'php-data-and-errors',
				title: 'Data & Errors',
				lessons: [
					{ slug: 'exceptions', title: 'Errors and Exceptions', sidebarTitle: 'Exceptions' },
					{ slug: 'files', title: 'Reading and Writing Files', sidebarTitle: 'Files' },
					{ slug: 'json', title: 'Working with JSON', sidebarTitle: 'JSON' },
					{ slug: 'databases-with-pdo', title: 'Databases with PDO', sidebarTitle: 'PDO' },
				],
			},
			{
				id: 'php-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'security-essentials', title: 'Security Essentials: XSS, SQL Injection, and CSRF', sidebarTitle: 'Security Essentials' },
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: Event Sign-Up Sheet', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'sqlite3',
		title: 'SQLite3',
		chapters: [
			{
				id: 'sqlite-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'introduction', title: "What SQLite Is and Why It's Used", sidebarTitle: 'What Is SQLite?' },
					{ slug: 'databases-and-sql', title: 'Databases, Tables, and SQL', sidebarTitle: 'Databases & SQL' },
					{ slug: 'setting-up', title: 'Installing SQLite and the sqlite3 Shell', sidebarTitle: 'Setting Up' },
					{ slug: 'first-queries', title: 'Your First Queries', sidebarTitle: 'First Queries' },
				],
			},
			{
				id: 'sqlite-sql-foundations',
				title: 'SQL Foundations',
				lessons: [
					{ slug: 'select', title: 'SELECT: Reading Data', sidebarTitle: 'SELECT' },
					{ slug: 'where', title: 'Filtering Rows with WHERE', sidebarTitle: 'WHERE' },
					{ slug: 'order-by-and-limit', title: 'Sorting and Limiting Results', sidebarTitle: 'ORDER BY & LIMIT' },
					{ slug: 'null', title: 'Working with NULL', sidebarTitle: 'NULL' },
					{ slug: 'functions', title: 'Built-in Functions', sidebarTitle: 'Functions' },
					{ slug: 'aggregates', title: 'Counting and Summarizing: Aggregates', sidebarTitle: 'Aggregates' },
					{ slug: 'group-by', title: 'Grouping with GROUP BY and HAVING', sidebarTitle: 'GROUP BY' },
					{ slug: 'joins', title: 'Combining Tables with JOIN', sidebarTitle: 'Joins' },
					{ slug: 'subqueries', title: 'Subqueries' },
				],
			},
			{
				id: 'sqlite-changing-data-and-design',
				title: 'Changing Data & Design',
				lessons: [
					{ slug: 'create-table', title: 'Creating Tables' },
					{ slug: 'insert-update-delete', title: 'INSERT, UPDATE, and DELETE', sidebarTitle: 'Changing Data' },
					{ slug: 'keys-and-constraints', title: 'Primary Keys, Foreign Keys, and Constraints', sidebarTitle: 'Keys & Constraints' },
					{ slug: 'database-design', title: 'Designing a Database: Normalization', sidebarTitle: 'Database Design' },
					{ slug: 'indexes', title: 'Indexes and Query Speed', sidebarTitle: 'Indexes' },
					{ slug: 'transactions', title: 'Transactions' },
				],
			},
			{
				id: 'sqlite-sqlite-specifics',
				title: 'SQLite Specifics',
				lessons: [
					{ slug: 'type-affinity', title: 'Type Affinity and STRICT Tables', sidebarTitle: 'Type Affinity' },
					{ slug: 'pragma', title: 'SQLite Settings with PRAGMA', sidebarTitle: 'PRAGMA' },
					{ slug: 'dates-and-times', title: 'Dates and Times in SQLite', sidebarTitle: 'Dates & Times' },
					{ slug: 'sqlite-in-python', title: 'Using SQLite from Python', sidebarTitle: 'SQLite in Python' },
				],
			},
			{
				id: 'sqlite-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: School Library Database', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'mysql',
		title: 'MySQL',
		chapters: [
			{
				id: 'mysql-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'introduction', title: "What MySQL Is and Why It's Used", sidebarTitle: 'What Is MySQL?' },
					{ slug: 'coming-from-sqlite', title: 'Coming from SQLite: Servers and Clients', sidebarTitle: 'From SQLite to MySQL' },
					{ slug: 'setting-up', title: 'Installing MySQL Server', sidebarTitle: 'Setting Up' },
					{ slug: 'connecting', title: 'Connecting with the mysql Client and Workbench', sidebarTitle: 'Connecting' },
				],
			},
			{
				id: 'mysql-mysql-sql',
				title: "MySQL's SQL",
				lessons: [
					{ slug: 'tables-and-types', title: 'Databases, Tables, and MySQL Data Types', sidebarTitle: 'Tables & Types' },
					{ slug: 'auto-increment', title: 'AUTO_INCREMENT and Keys', sidebarTitle: 'AUTO_INCREMENT' },
					{ slug: 'mysql-functions', title: 'MySQL Functions: Strings, Dates, and More', sidebarTitle: 'MySQL Functions' },
					{ slug: 'upserts', title: 'Upserts with ON DUPLICATE KEY UPDATE', sidebarTitle: 'Upserts' },
					{ slug: 'enum-set-and-json', title: 'ENUM, SET, and JSON Columns', sidebarTitle: 'ENUM & JSON' },
					{ slug: 'views-procedures-and-triggers', title: 'Views, Stored Procedures, and Triggers', sidebarTitle: 'Views & Procedures' },
				],
			},
			{
				id: 'mysql-running-a-server',
				title: 'Running a Server',
				lessons: [
					{ slug: 'users-and-privileges', title: 'Users and Privileges', sidebarTitle: 'Users & Privileges' },
					{ slug: 'innodb-and-transactions', title: 'InnoDB, Transactions, and Locking', sidebarTitle: 'InnoDB & Transactions' },
					{ slug: 'character-sets', title: 'Character Sets and utf8mb4', sidebarTitle: 'Character Sets' },
					{ slug: 'explain', title: 'Query Performance with EXPLAIN', sidebarTitle: 'EXPLAIN' },
					{ slug: 'backups', title: 'Backups with mysqldump', sidebarTitle: 'Backups' },
				],
			},
			{
				id: 'mysql-applications',
				title: 'Applications',
				lessons: [
					{ slug: 'mysql-in-php', title: 'Using MySQL from PHP with PDO', sidebarTitle: 'MySQL in PHP' },
				],
			},
			{
				id: 'mysql-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: Online Store Database', sidebarTitle: 'Final Project' },
				],
			},
		],
	},
	{
		slug: 'oracle-database',
		title: 'Oracle Database',
		chapters: [
			{
				id: 'oracle-getting-started',
				title: 'Getting Started',
				lessons: [
					{ slug: 'introduction', title: "What Oracle Database Is and Why It's Used", sidebarTitle: 'What Is Oracle?' },
					{ slug: 'coming-from-sqlite', title: "Coming from SQLite: What's Different in Oracle", sidebarTitle: 'From SQLite to Oracle' },
					{ slug: 'setting-up', title: 'Getting an Oracle Database: Live SQL and Oracle Free', sidebarTitle: 'Setting Up' },
					{ slug: 'tools', title: 'Oracle Tools: SQL*Plus, SQLcl, and SQL Developer', sidebarTitle: 'Oracle Tools' },
				],
			},
			{
				id: 'oracle-oracle-sql',
				title: "Oracle's SQL",
				lessons: [
					{ slug: 'data-types', title: 'Oracle Data Types: VARCHAR2, NUMBER, and DATE', sidebarTitle: 'Data Types' },
					{ slug: 'null-and-empty-strings', title: "Empty Strings Are NULL: Oracle's NULL Rules", sidebarTitle: 'NULL in Oracle' },
					{ slug: 'dual-and-functions', title: 'DUAL and Oracle Functions: NVL, DECODE, and TO_CHAR', sidebarTitle: 'Oracle Functions' },
					{ slug: 'top-n-queries', title: 'Top-N Queries: ROWNUM and FETCH FIRST', sidebarTitle: 'Top-N Queries' },
					{ slug: 'sequences-and-identity', title: 'Sequences and Identity Columns', sidebarTitle: 'Sequences' },
					{ slug: 'merge', title: 'Upserts with MERGE', sidebarTitle: 'MERGE' },
					{ slug: 'schemas-and-users', title: 'Schemas, Users, and Privileges', sidebarTitle: 'Schemas & Users' },
					{ slug: 'transactions', title: 'Transactions: COMMIT, ROLLBACK, and SAVEPOINT', sidebarTitle: 'Transactions' },
				],
			},
			{
				id: 'oracle-plsql',
				title: 'PL/SQL',
				lessons: [
					{ slug: 'plsql-blocks', title: 'PL/SQL Blocks: DECLARE, BEGIN, and END', sidebarTitle: 'PL/SQL Blocks' },
					{ slug: 'plsql-variables-and-control', title: 'PL/SQL Variables and Control Flow', sidebarTitle: 'Variables & Control' },
					{ slug: 'cursors', title: 'Cursors: Looping over Query Results', sidebarTitle: 'Cursors' },
					{ slug: 'procedures-and-functions', title: 'Stored Procedures and Functions', sidebarTitle: 'Procedures' },
					{ slug: 'packages', title: 'Packages' },
					{ slug: 'plsql-exceptions', title: 'PL/SQL Exceptions', sidebarTitle: 'Exceptions' },
					{ slug: 'triggers', title: 'Triggers' },
				],
			},
			{
				id: 'oracle-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes', sidebarTitle: 'Best Practices' },
					{ slug: 'final-project', title: 'Final Project: Course Enrollment System', sidebarTitle: 'Final Project' },
				],
			},
		],
	},

	// Python, SQLite3, PHP, MySQL, and Oracle Database above were scaffolded as
	// full chapters of stub lessons, and are now complete.
	//
	// Everything below is a "Coming Soon" track: one placeholder lesson each,
	// so the topic already exists in the sidebar/topic-nav/lessons grid (real,
	// navigable) ahead of its real content being written. New sections
	// replace `comingSoon: true` with the track's real chapters/lessons —
	// no other file needs to change when that happens.
	{
		slug: 'scss',
		title: 'SCSS',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to SCSS', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'tailwind-css',
		title: 'Tailwind CSS',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Tailwind CSS', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'bootstrap',
		title: 'Bootstrap 5',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Bootstrap 5', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'angular',
		title: 'Angular',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Angular', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'react',
		title: 'React',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to React', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'vue',
		title: 'Vue.js',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Vue.js', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'nextjs',
		title: 'Next.js',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Next.js', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'nodejs',
		title: 'Node.js',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Node.js', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'vite',
		title: 'Vite',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Vite', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'laravel',
		title: 'Laravel',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Laravel', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'django',
		title: 'Django',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Django', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'wordpress',
		title: 'WordPress',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to WordPress', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'typescript',
		title: 'TypeScript',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to TypeScript', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'supabase',
		title: 'Supabase',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Supabase', sidebarTitle: 'Introduction' }],
	},
	{
		slug: 'firebase',
		title: 'Firebase',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Firebase', sidebarTitle: 'Introduction' }],
	},
];

function assertValidCurriculum() {
	for (const track of curriculum) {
		const hasChapters = !!track.chapters;
		const hasLessons = !!track.lessons;
		if (hasChapters === hasLessons) {
			throw new Error(
				`curriculum.ts: track "${track.slug}" must set exactly one of chapters/lessons (has chapters: ${hasChapters}, lessons: ${hasLessons}).`,
			);
		}
	}
}
assertValidCurriculum();

export function lessonPath(trackSlug: string, lessonSlug: string): string {
	return `/lessons/${trackSlug}/${lessonSlug}`;
}

export function findTrack(trackSlug: string): CurriculumTrack | undefined {
	return curriculum.find((t) => t.slug === trackSlug);
}

/** Path of a track's first lesson — where a "go to this track" link (the
 * topic switcher, config.mts's breadcrumb JSON-LD) should point, since
 * tracks have no dedicated overview/index page of their own. */
export function firstLessonPath(track: CurriculumTrack): string {
	return lessonPath(track.slug, flattenTrackLessons(track)[0].lesson.slug);
}

/** Flattens a track's lessons (chaptered or flat) into one ordered list. */
export function flattenTrackLessons(
	track: CurriculumTrack,
): { chapter: CurriculumChapter | null; lesson: CurriculumLesson }[] {
	if (track.chapters) {
		return track.chapters.flatMap((chapter) => chapter.lessons.map((lesson) => ({ chapter, lesson })));
	}
	return (track.lessons ?? []).map((lesson) => ({ chapter: null, lesson }));
}

export interface ResolvedLesson {
	track: CurriculumTrack;
	chapter: CurriculumChapter | null;
	lesson: CurriculumLesson;
	/** Index within the track's fully flattened lesson list (chapters flattened transparently). */
	flatIndex: number;
	path: string;
}

export function resolveLesson(trackSlug: string, lessonSlug: string): ResolvedLesson | null {
	const track = findTrack(trackSlug);
	if (!track) return null;
	const flat = flattenTrackLessons(track);
	const flatIndex = flat.findIndex((entry) => entry.lesson.slug === lessonSlug);
	if (flatIndex === -1) return null;
	const { chapter, lesson } = flat[flatIndex];
	return { track, chapter, lesson, flatIndex, path: lessonPath(trackSlug, lessonSlug) };
}

function toResolvedLesson(track: CurriculumTrack, flat: ReturnType<typeof flattenTrackLessons>, index: number): ResolvedLesson | null {
	const entry = flat[index];
	if (!entry) return null;
	return { track, chapter: entry.chapter, lesson: entry.lesson, flatIndex: index, path: lessonPath(track.slug, entry.lesson.slug) };
}

/** Previous/next lesson strictly within this track's own default order — independent of any active guided path. */
export function trackPrevNext(
	trackSlug: string,
	lessonSlug: string,
): { prev: ResolvedLesson | null; next: ResolvedLesson | null } {
	const track = findTrack(trackSlug);
	if (!track) return { prev: null, next: null };
	const flat = flattenTrackLessons(track);
	const index = flat.findIndex((entry) => entry.lesson.slug === lessonSlug);
	if (index === -1) return { prev: null, next: null };
	return {
		prev: toResolvedLesson(track, flat, index - 1),
		next: toResolvedLesson(track, flat, index + 1),
	};
}
