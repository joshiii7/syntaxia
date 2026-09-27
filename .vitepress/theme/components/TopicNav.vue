<script setup>
/**
 * Sticky, site-wide topic-switcher sub-header: a horizontal list of every
 * track (IDEs, HTML, CSS, JavaScript, Python, ...) so a learner can jump to
 * a different language/topic from anywhere on the site, not just from
 * inside a lesson. This is deliberately separate from LessonSidebar.vue,
 * which only ever shows the CURRENT track's own chapters/lessons — TopicNav
 * is the thing that lets you switch tracks at all.
 *
 * Data-driven from curriculum.ts (the site's single source of truth for
 * tracks/lessons, already used by LessonSidebar/Breadcrumb/LessonNav) — a
 * future topic only needs adding there, no per-page edits, and no layout
 * change here either: new items simply join the horizontal scroll.
 *
 * Placement (see theme/index.ts): the `home-hero-before` slot on the home
 * page, and the `doc-before` slot (before Breadcrumb, which only renders on
 * an actual lesson page) everywhere else — i.e. every page on the site, the
 * same component and markup throughout so it never reads as a different bar
 * from one page to the next.
 *
 * Two positioning modes, both sticking to `top: var(--vp-nav-height)` (the
 * same variable VPContent/VPSidebar already use for this height):
 * - Default (`fixed` false) — `position: sticky`, used on the home page and
 *   the sidebar-less /lessons//paths/ index pages. Those pages' own content
 *   column already spans the full viewport, so sticky-in-normal-flow is
 *   already full width with zero extra CSS.
 * - `fixed` true — `position: fixed`, used only on an actual lesson page.
 *   There, the `doc-before` slot lives inside the sidebar-narrowed content
 *   column, and `position: sticky` can't escape that column's own width —
 *   only `position: fixed` (which ignores its DOM ancestors' width/position
 *   entirely) can span the true full viewport there. Because that takes it
 *   out of normal flow, the sidebar and doc content need to reserve the
 *   same height back — see the `--topic-nav-height` var and the
 *   `.VPSidebar`/`--vp-doc-top-height` rules in style.css, plus the raised
 *   `.VPNav` z-index there so the real header still stacks above this.
 */
import { useData, withBase } from 'vitepress';
import { computed } from 'vue';
import { curriculum, firstLessonPath } from '../data/curriculum';

defineProps({
	fixed: { type: Boolean, default: false },
});

const { page } = useData();

// e.g. "lessons/html/introduction.md" -> "html"
const currentTrackSlug = computed(() => page.value.relativePath.split('/')[1] ?? null);

// Clicking a topic goes to that track's first lesson, not a separate
// overview page — tracks have no dedicated index page of their own here
// (the shared /lessons/ page lists all of them at once), so the first
// lesson is the only real "start of this track" destination that exists.
const topics = computed(() =>
	curriculum.map((track) => ({
		slug: track.slug,
		title: track.title,
		href: withBase(firstLessonPath(track)),
	})),
);
</script>

<template>
	<nav class="topic-nav" :class="{ 'topic-nav--fixed': fixed }" aria-label="Topics">
		<div class="topic-nav__inner">
			<ul class="topic-nav__list">
				<li v-for="topic in topics" :key="topic.slug" class="topic-nav__item">
					<a
						class="topic-nav__link"
						:class="{ 'topic-nav__link--active': topic.slug === currentTrackSlug }"
						:href="topic.href"
						:aria-current="topic.slug === currentTrackSlug ? 'page' : undefined"
					>
						{{ topic.title }}
					</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<style scoped>
.topic-nav {
	/* Sticks right under the real nav bar once scrolled past — same
	   variable VPContent/VPSidebar already use for this, so it always
	   tracks the header's actual height with no hardcoded number. */
	position: sticky;
	top: var(--vp-nav-height);
	z-index: 11;
	margin: 0 0 24px;
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
}

/* Lesson-page mode: escape the sidebar-narrowed content column entirely
   (position: sticky can't do this — it's still exactly as wide as it would
   be in normal flow at its DOM location, only its own Y position "sticks").
   z-index sits strictly between the sidebar and the real nav bar — see the
   matching --vp-z-index-sidebar-based values in style.css. */
.topic-nav.topic-nav--fixed {
	position: fixed;
	top: var(--vp-nav-height);
	left: 0;
	right: 0;
	width: 100%;
	z-index: calc(var(--vp-z-index-sidebar) + 1);
}

/* Same full-bleed-bar/centered-content split the nav bar and CtaBanner
   already use: the background/border-bottom above spans whatever width
   this component is given (the full viewport on the home page and the
   sidebar-less /lessons//paths/ index pages; the narrower content column
   next to the sidebar on an actual lesson page), while the topic list
   itself never grows past 80rem, matching every other homepage section. */
.topic-nav__inner {
	max-width: 80rem;
	margin: 0 auto;
}

.topic-nav__list {
	display: flex;
	gap: 4px;
	margin: 0;
	padding: 0 2px;
	list-style: none;
	/* Horizontal scroll, never wrap — chosen over a dropdown for this few
	   items (5 tracks today): every topic stays one tap away and visible
	   as you scroll, rather than hidden behind an extra open/close step. */
	overflow-x: auto;
	overflow-y: hidden;
	scrollbar-width: thin;
	-webkit-overflow-scrolling: touch;
}

.topic-nav__item {
	flex: none;
}

.topic-nav__list::-webkit-scrollbar {
	height: 4px;
}

.topic-nav__list::-webkit-scrollbar-thumb {
	background: var(--vp-c-divider);
	border-radius: 2px;
}

.topic-nav__link {
	display: flex;
	align-items: center;
	height: 44px;
	padding: 0 14px;
	white-space: nowrap;
	font-size: var(--font-size-sm);
	font-weight: 500;
	color: var(--vp-c-text-2);
	border-bottom: 2px solid transparent;
	transition: color 0.2s ease, border-color 0.2s ease;
}

.topic-nav__link:hover {
	color: var(--vp-c-text-1);
}

.topic-nav__link--active {
	color: var(--vp-c-brand-1);
	border-bottom-color: var(--vp-c-brand-1);
	font-weight: 700;
}
</style>
