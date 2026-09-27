<script setup>
/**
 * Site-wide topic-switcher sub-header: a horizontal list of every track
 * (IDEs, HTML, CSS, JavaScript, Python, ...) so a learner can jump to a
 * different language/topic from anywhere on the site, not just from inside
 * a lesson. This is deliberately separate from LessonSidebar.vue, which
 * only ever shows the CURRENT track's own chapters/lessons — TopicNav is
 * the thing that lets you switch tracks at all.
 *
 * Data-driven from curriculum.ts (the site's single source of truth for
 * tracks/lessons, already used by LessonSidebar/Breadcrumb/LessonNav) — a
 * future topic only needs adding there, no per-page edits, and no layout
 * change here either: new items simply join the horizontal scroll.
 *
 * Part of the site header: on every page it is fixed, full width, right
 * under the real nav bar (which style.css also fixes at every width), the
 * same way the home page shows it. Rendered from the `home-hero-before`
 * slot on the home page and `doc-before` everywhere else (see
 * theme/index.ts), so it still comes right after the nav in tab order.
 * `position: fixed` (not sticky) is what lets it span the full viewport
 * even inside a lesson page's sidebar-narrowed content column.
 *
 * Being fixed, it takes no room in the page flow, so the page reserves its
 * height at the top instead (the .VPContent/.VPSidebar/.VPLocalNav rules in
 * style.css). That height isn't constant: the topic list scrolls sideways,
 * and a desktop browser with classic scrollbars adds the scrollbar to it.
 * So the bar measures itself and publishes the real value as
 * --topic-nav-height; style.css's 45px (link height + border) is only the
 * fallback before this runs, which is also the right value on phones.
 */
import { useData, withBase } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { curriculum, firstLessonPath } from '../data/curriculum';

const { page } = useData();

const bar = ref(null);
let resizeObserver = null;

onMounted(() => {
	if (!bar.value || typeof ResizeObserver === 'undefined') return;
	resizeObserver = new ResizeObserver(([entry]) => {
		const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--topic-nav-height', `${Math.ceil(height)}px`);
	});
	resizeObserver.observe(bar.value);
});

onBeforeUnmount(() => {
	resizeObserver?.disconnect();
});

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
	<nav ref="bar" class="topic-nav" aria-label="Topics">
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
/* z-index sits above SiteFooter.vue (+1, which covers the sidebar) and
   below the real nav bar (+3), see the matching --vp-z-index-sidebar-based
   values in style.css. */
.topic-nav {
	position: fixed;
	top: var(--vp-nav-height);
	left: 0;
	right: 0;
	z-index: calc(var(--vp-z-index-sidebar) + 2);
	background: var(--vp-c-bg);
	border-bottom: 1px solid var(--vp-c-divider);
}

/* Same full-bleed-bar/centered-content split the nav bar and CtaBanner
   already use: the background and border span the viewport, while the
   topic list itself never grows past 80rem, matching the header. */
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
	/* Horizontal scroll, never wrap — chosen over a dropdown: every topic
	   stays one tap away and visible as you scroll, rather than hidden
	   behind an extra open/close step. */
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
}

/* A thin scrollbar: the 4px ::-webkit-scrollbar rules below for Chrome,
   Edge and Safari, and scrollbar-width only where those aren't supported
   (Firefox). Setting scrollbar-width everywhere made Chrome ignore the 4px
   rules and draw a full-size scrollbar. */
@supports not selector(::-webkit-scrollbar) {
	.topic-nav__list {
		scrollbar-width: thin;
	}
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
