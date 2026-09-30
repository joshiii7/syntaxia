import { defineConfig } from 'vitepress';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { curriculum, flattenTrackLessons, lessonPath, resolveLesson } from './theme/data/curriculum';

const SITE_TITLE = 'Syntaxia';
const SITE_DESCRIPTION = 'An interactive programming book covering languages, frameworks, and dev tools.';
const AUTHOR_NAME = 'Joshi Angelo Z. Adlawan';

// The site's real deployed URL: GitHub Pages project site, served from
// /syntaxia/ (the repo name), not the domain root. No trailing slash here,
// since every call site below appends its own leading-slash path (or just
// "/" for the home page) directly onto this constant.
const SITE_URL = 'https://joshiii7.github.io/syntaxia';

const OG_IMAGE = `${SITE_URL}/syntaxia-logo.png`;

// Derived from curriculum.ts (the single source of truth for lesson order/
// titles/chapters) rather than hand-duplicated here.
const SECTION_NAMES: Record<string, string> = Object.fromEntries(curriculum.map((t) => [t.slug, t.title]));

const SECTION_FIRST_LESSON: Record<string, string> = Object.fromEntries(
	curriculum.map((t) => {
		const first = flattenTrackLessons(t)[0];
		return [t.slug, lessonPath(t.slug, first.lesson.slug)];
	}),
);

// Build-time guardrail: warns (doesn't throw, so a WIP draft lesson doesn't
// break `vitepress dev`) if curriculum.ts and the actual lessons/ directory
// tree drift apart — exactly the "duplicated source of truth" failure mode
// this refactor is meant to eliminate, now that order/titles live in this
// hand-maintained file instead of being read from the files themselves.
function checkCurriculumMatchesFilesystem() {
	const lessonsDir = fileURLToPath(new URL('../lessons', import.meta.url));
	const curriculumPaths = new Set(curriculum.flatMap((t) => flattenTrackLessons(t).map((e) => `${t.slug}/${e.lesson.slug}`)));

	for (const track of curriculum) {
		let files: string[];
		try {
			files = readdirSync(`${lessonsDir}/${track.slug}`).filter((f) => f.endsWith('.md'));
		} catch {
			console.warn(`curriculum.ts: track "${track.slug}" has no matching lessons/${track.slug}/ directory.`);
			continue;
		}
		for (const file of files) {
			const slug = file.replace(/\.md$/, '');
			if (!curriculumPaths.has(`${track.slug}/${slug}`)) {
				console.warn(`lessons/${track.slug}/${file} exists but has no curriculum.ts entry — it won't appear in the sidebar/breadcrumb/nav.`);
			}
		}
	}
}
checkCurriculumMatchesFilesystem();

// Mirrors VitePress's own cleanUrls: true routing, so this always matches
// the page's real, final address instead of a raw ".md" source path.
function pageToPath(page: string): string {
	if (page === 'index.md') return '/';
	if (page.endsWith('/index.md')) return `/${page.slice(0, -'index.md'.length)}`;
	return `/${page.replace(/\.md$/, '')}`;
}

export default defineConfig({
	title: SITE_TITLE,
	description: SITE_DESCRIPTION,
	cleanUrls: true,

	// GitHub Pages serves a project site (one that isn't <user>.github.io
	// itself) from a /<repo-name>/ subpath, not the domain root. Every
	// internal link VitePress generates gets this prefixed automatically,
	// so it has to match the actual repo name exactly.
	base: '/syntaxia/',

	head: [
		['link', { rel: 'icon', href: '/favicon.svg' }],
		['meta', { name: 'author', content: AUTHOR_NAME }],
	],

	// Runs once per page at build time, adding canonical/OG/Twitter meta tags
	// and JSON-LD structured data. Centralized here instead of repeated in
	// every lesson's frontmatter, so every current and future page gets it
	// automatically and consistently, driven by that page's own title and
	// description.
	transformHead({ page, pageData }) {
		const path = pageToPath(page);
		const url = `${SITE_URL}${path}`;
		const title = pageData.title || SITE_TITLE;
		const description = pageData.description || SITE_DESCRIPTION;

		const head: [string, Record<string, string>, string?][] = [
			['link', { rel: 'canonical', href: url }],
			['meta', { property: 'og:site_name', content: SITE_TITLE }],
			['meta', { property: 'og:title', content: title }],
			['meta', { property: 'og:description', content: description }],
			['meta', { property: 'og:url', content: url }],
			['meta', { property: 'og:image', content: OG_IMAGE }],
			// summary, not summary_large_image: the logo is a near-square mark,
			// not a wide banner, so the compact Twitter/X card fits it correctly
			// instead of stretching or heavily cropping it.
			['meta', { name: 'twitter:card', content: 'summary' }],
			['meta', { name: 'twitter:title', content: title }],
			['meta', { name: 'twitter:description', content: description }],
			['meta', { name: 'twitter:image', content: OG_IMAGE }],
		];

		const segments = page.split('/');
		const isHome = page === 'index.md';
		const isLessonsIndex = page === 'lessons/index.md';
		const isLessonPage = segments.length === 3 && segments[0] === 'lessons' && segments[1] in SECTION_NAMES;

		head.push(['meta', { property: 'og:type', content: isHome ? 'website' : 'article' }]);

		if (isHome) {
			head.push([
				'script',
				{ type: 'application/ld+json' },
				JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: SITE_TITLE,
					url: `${SITE_URL}/`,
					description: SITE_DESCRIPTION,
					author: { '@type': 'Person', name: AUTHOR_NAME },
				}),
			]);
		} else if (isLessonPage) {
			const sectionSlug = segments[1];
			const lessonSlug = segments[2];
			const sectionName = SECTION_NAMES[sectionSlug];
			const sectionUrl = `${SITE_URL}${SECTION_FIRST_LESSON[sectionSlug]}`;
			const resolved = resolveLesson(sectionSlug, lessonSlug);

			const breadcrumbItems: Record<string, unknown>[] = [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
				{ '@type': 'ListItem', position: 2, name: 'Lessons', item: `${SITE_URL}/lessons/` },
				{ '@type': 'ListItem', position: 3, name: sectionName, item: sectionUrl },
			];
			let position = 4;
			// Chapters have no URL of their own — reuse the section URL as the
			// `item` for this intermediate, non-navigable crumb.
			if (resolved?.chapter) {
				breadcrumbItems.push({ '@type': 'ListItem', position: position++, name: resolved.chapter.title, item: sectionUrl });
			}
			// Only add a final crumb if this page isn't already that same
			// section-landing page, so the trail never repeats its last stop.
			if (url !== sectionUrl) {
				breadcrumbItems.push({ '@type': 'ListItem', position, name: title, item: url });
			}

			head.push([
				'script',
				{ type: 'application/ld+json' },
				JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: breadcrumbItems,
				}),
			]);

			head.push([
				'script',
				{ type: 'application/ld+json' },
				JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Article',
					headline: title,
					description,
					url,
					author: { '@type': 'Person', name: AUTHOR_NAME },
					publisher: { '@type': 'Person', name: AUTHOR_NAME },
					isPartOf: { '@type': 'WebSite', name: SITE_TITLE, url: `${SITE_URL}/` },
				}),
			]);
		} else if (page === 'accessibility.md' || page === 'privacy.md') {
			head.push([
				'script',
				{ type: 'application/ld+json' },
				JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
						{ '@type': 'ListItem', position: 2, name: title, item: url },
					],
				}),
			]);
		} else if (isLessonsIndex) {
			head.push([
				'script',
				{ type: 'application/ld+json' },
				JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
						{ '@type': 'ListItem', position: 2, name: 'Lessons', item: `${SITE_URL}/lessons/` },
					],
				}),
			]);
		}

		// Stub lessons (frontmatter `comingSoon: true`) are real, navigable
		// pages with only a "coming soon" note, so they're kept out of search
		// results until they're written. (The site doesn't generate a sitemap
		// yet; if one is added, filter these pages out of it the same way.)
		if (pageData.frontmatter.comingSoon === true) {
			head.push(['meta', { name: 'robots', content: 'noindex' }]);
		}

		return head;
	},

	themeConfig: {
		logo: { src: '/syntaxia-logo.png', alt: 'Syntaxia logo' },

		nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Lessons', link: '/lessons/' },
			{ text: 'About', link: '/about' },
		],

		// Real per-track/chapter/lesson navigation is now owned by curriculum.ts
		// and rendered by the custom LessonSidebar.vue (injected via the
		// `sidebar-nav-before` slot — see theme/index.ts). This stub exists
		// solely to keep VitePress's internal `hasSidebar` computation true
		// (which `.has-sidebar` CSS on VPNavBar/VPContent depends on) without
		// the default theme's own VPSidebarGroup rendering a second, duplicate
		// tree alongside LessonSidebar — an item with no `text`/`items` renders
		// no visible markup (confirmed against VPSidebarItem.vue's `v-if="item.text"` guard).
		sidebar: {
			'/lessons/': [{ items: [] }],
		},

		// The default theme's own prev/next pager would otherwise render next
		// to LessonNav.vue's soft-gated "Next Lesson" control, giving learners
		// an ungated bypass right beside the gated one.
		docFooter: {
			prev: false,
			next: false,
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/joshiii7' },
		],

		search: {
			provider: 'local',
		},
	},
});
