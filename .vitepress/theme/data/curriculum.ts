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
}

export interface CurriculumChapter {
	/** Stable id, kebab-case. Never appears in a URL. */
	id: string;
	title: string;
	lessons: CurriculumLesson[];
}

export interface CurriculumTrack {
	/** URL segment under /lessons/, matches the lessons/<slug>/ directory. */
	slug: string;
	title: string;
	/** Exactly one of `chapters`/`lessons` is set — enforced by assertValidCurriculum(). */
	chapters?: CurriculumChapter[];
	lessons?: CurriculumLesson[];
	/** True for a track that exists only as a single placeholder lesson so far — surfaced as a "Coming Soon" badge in LessonsIndex.vue rather than hidden, since the track is already real and navigable. */
	comingSoon?: boolean;
}

export const curriculum: CurriculumTrack[] = [
	{
		slug: 'ide',
		title: 'IDEs',
		lessons: [
			{ slug: 'introduction', title: 'Introduction to IDEs' },
			{ slug: 'why-use-an-ide', title: 'Why Use an IDE?' },
			{ slug: 'popular-ides-overview', title: 'Popular IDEs & Code Editors Overview' },
			{ slug: 'choosing-the-right-ide', title: 'Choosing the Right IDE for Your Path' },
			{ slug: 'setting-up-your-ide', title: 'Setting Up Your IDE' },
			{ slug: 'ide-navigation-and-features', title: 'Basic IDE Navigation & Features' },
			{ slug: 'using-the-terminal', title: 'Using the Integrated Terminal' },
			{ slug: 'debugging-basics', title: 'Debugging Basics in an IDE' },
			{ slug: 'extensions-and-customization', title: 'Extensions & Customization' },
			{ slug: 'shortcuts-cheat-sheet', title: 'IDE Shortcuts Cheat Sheet' },
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
					{ slug: 'introduction', title: 'Introduction to HTML' },
					{ slug: 'your-first-html-file', title: 'Your First HTML File' },
				],
			},
			{
				id: 'document-foundations',
				title: 'Document Foundations',
				lessons: [
					{ slug: 'basic-structure', title: 'Anatomy of an HTML Document' },
					{ slug: 'nesting-and-the-dom', title: 'Nesting and the DOM' },
					{ slug: 'attributes', title: 'Attributes' },
				],
			},
			{
				id: 'text-and-content',
				title: 'Text & Content',
				lessons: [
					{ slug: 'headings-and-paragraphs', title: 'Headings and Paragraphs' },
					{ slug: 'text-formatting', title: 'Emphasis, Quotes, and Code' },
					{ slug: 'lists', title: 'Lists' },
				],
			},
			{
				id: 'links-and-media',
				title: 'Links & Media',
				lessons: [
					{ slug: 'links', title: 'Links and Navigation' },
					{ slug: 'images', title: 'Images' },
					{ slug: 'audio-and-video', title: 'Audio, Video, and Figures' },
				],
			},
			{
				id: 'tables-and-forms',
				title: 'Tables & Forms',
				lessons: [
					{ slug: 'tables', title: 'Tables' },
					{ slug: 'forms-part-1', title: 'Forms: The Basics' },
					{ slug: 'forms-part-2', title: 'More Form Controls' },
					{ slug: 'form-validation', title: 'Form Validation' },
				],
			},
			{
				id: 'structure-and-meaning',
				title: 'Structure & Meaning',
				lessons: [
					{ slug: 'divs-and-spans', title: 'Divs and Spans' },
					{ slug: 'semantic-html', title: 'Semantic HTML' },
					{ slug: 'attributes-deep-dive', title: 'Attributes Deep Dive' },
					{ slug: 'accessibility-basics', title: 'Accessibility Basics' },
				],
			},
			{
				id: 'head-embeds-and-widgets',
				title: 'The Head, Embeds & Widgets',
				lessons: [
					{ slug: 'meta-and-head-tags', title: 'Meta Tags and SEO' },
					{ slug: 'iframes-and-embedding', title: 'iframes and Embedding' },
					{ slug: 'details-dialog-and-template', title: 'details, dialog, and template' },
				],
			},
			{
				id: 'going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes' },
					{ slug: 'html-meets-css-and-js', title: 'Where HTML Meets CSS and JS' },
					{ slug: 'putting-it-all-together', title: 'Capstone: Your Profile Page' },
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
					{ slug: 'intro-to-css', title: 'What CSS Is and Why It Exists' },
					{ slug: 'applying-css', title: 'Three Ways to Add CSS' },
				],
			},
			{
				id: 'selectors-and-cascade',
				title: 'Selectors & the Cascade',
				lessons: [
					{ slug: 'selectors', title: 'Selectors' },
					{ slug: 'pseudo-classes-and-pseudo-elements', title: 'Pseudo-classes and Pseudo-elements' },
					{ slug: 'cascade-and-specificity', title: 'The Cascade and Specificity' },
				],
			},
			{
				id: 'box-and-visuals',
				title: 'The Box & Visual Styling',
				lessons: [
					{ slug: 'box-model', title: 'The Box Model' },
					{ slug: 'colors', title: 'Colors' },
					{ slug: 'units', title: 'Units' },
					{ slug: 'typography', title: 'Typography' },
					{ slug: 'backgrounds-and-borders', title: 'Backgrounds, Borders, and Shadows' },
				],
			},
			{
				id: 'layout',
				title: 'Layout',
				lessons: [
					{ slug: 'display', title: 'Display' },
					{ slug: 'positioning', title: 'Positioning and z-index' },
					{ slug: 'flexbox', title: 'Flexbox: The Basics' },
					{ slug: 'flexbox-in-practice', title: 'Flexbox in Practice' },
					{ slug: 'grid', title: 'CSS Grid: The Basics' },
					{ slug: 'grid-in-practice', title: 'CSS Grid in Practice' },
				],
			},
			{
				id: 'responsive-and-interactive',
				title: 'Responsive & Interactive',
				lessons: [
					{ slug: 'responsive-design', title: 'Responsive Design and Media Queries' },
					{ slug: 'css-variables', title: 'CSS Variables' },
					{ slug: 'interactive-states', title: 'Hover, Focus, and Interactive States' },
					{ slug: 'transitions-and-animations', title: 'Transitions and Animations' },
				],
			},
			{
				id: 'css-going-pro',
				title: 'Going Pro',
				lessons: [
					{ slug: 'layout-patterns', title: 'Common Layout Patterns' },
					{ slug: 'best-practices', title: 'Best Practices and Common Mistakes' },
					{ slug: 'css-meets-javascript', title: 'Where CSS Meets JavaScript' },
					{ slug: 'capstone', title: 'Capstone: Style Your Profile Page' },
				],
			},
		],
	},
	{
		slug: 'javascript',
		title: 'JavaScript',
		lessons: [{ slug: 'intro-to-javascript', title: 'Intro to JavaScript' }],
	},
	{
		slug: 'python',
		title: 'Python',
		lessons: [{ slug: 'intro-to-python', title: 'Intro to Python' }],
	},

	// Everything below is a "Coming Soon" track: one placeholder lesson each,
	// so the topic already exists in the sidebar/topic-nav/lessons grid (real,
	// navigable) ahead of its real content being written. New sections
	// replace `comingSoon: true` with the track's real chapters/lessons —
	// no other file needs to change when that happens.
	{
		slug: 'scss',
		title: 'SCSS',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to SCSS' }],
	},
	{
		slug: 'tailwind-css',
		title: 'Tailwind CSS',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Tailwind CSS' }],
	},
	{
		slug: 'bootstrap',
		title: 'Bootstrap 5',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Bootstrap 5' }],
	},
	{
		slug: 'angular',
		title: 'Angular',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Angular' }],
	},
	{
		slug: 'react',
		title: 'React',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to React' }],
	},
	{
		slug: 'vue',
		title: 'Vue.js',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Vue.js' }],
	},
	{
		slug: 'nextjs',
		title: 'Next.js',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Next.js' }],
	},
	{
		slug: 'nodejs',
		title: 'Node.js',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Node.js' }],
	},
	{
		slug: 'vite',
		title: 'Vite',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Vite' }],
	},
	{
		slug: 'php',
		title: 'PHP',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to PHP' }],
	},
	{
		slug: 'laravel',
		title: 'Laravel',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Laravel' }],
	},
	{
		slug: 'django',
		title: 'Django',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Django' }],
	},
	{
		slug: 'wordpress',
		title: 'WordPress',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to WordPress' }],
	},
	{
		slug: 'typescript',
		title: 'TypeScript',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to TypeScript' }],
	},
	{
		slug: 'java',
		title: 'Java',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Java' }],
	},
	{
		slug: 'mysql',
		title: 'MySQL',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to MySQL' }],
	},
	{
		slug: 'sqlite3',
		title: 'SQLite3',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to SQLite3' }],
	},
	{
		slug: 'supabase',
		title: 'Supabase',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Supabase' }],
	},
	{
		slug: 'firebase',
		title: 'Firebase',
		comingSoon: true,
		lessons: [{ slug: 'introduction', title: 'Introduction to Firebase' }],
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
