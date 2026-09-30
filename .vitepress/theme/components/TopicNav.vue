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
 * style.css). The bar measures itself and publishes the real value as
 * --topic-nav-height (text zoom or a late web font can change it);
 * style.css's 45px (link height + border) is only the fallback before this
 * runs.
 *
 * When the topics don't fit, the list is a manual carousel built on its own
 * scroll container, no carousel library: it never moves on its own, "back"
 * and "next" arrows page through it with scrollBy, a mouse can drag it, and
 * native touch swipe and trackpad/shift+wheel scrolling keep working because
 * it is still an ordinary overflow-x list. Each arrow (and the fade behind
 * it) only shows while there is more content on that side, so neither shows
 * when everything fits.
 */
import { useData, withBase } from 'vitepress';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { curriculum, firstLessonPath } from '../data/curriculum';

const { page } = useData();

// An arrow click scrolls by this share of the visible width, so one item
// from the old view stays in sight as context; scroll-snap then settles the
// list on an item's edge.
const PAGE_FRACTION = 0.8;
// How far a mouse may move while pressed and still count as a click on a
// topic rather than a drag.
const DRAG_THRESHOLD_PX = 5;
// Firefox reports mouse wheel steps in lines rather than pixels; this turns
// its usual 3 lines per notch into roughly Chrome's 100px per notch.
const WHEEL_LINE_PX = 33;
// Snapping comes back this long after the last wheel step.
const WHEEL_IDLE_MS = 150;

const bar = ref(null);
const list = ref(null);
const prevButton = ref(null);
const nextButton = ref(null);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const dragging = ref(false);
const wheeling = ref(false);

let heightObserver = null;
let wheelIdleTimer = null;
let edgeObserver = null;
let edgeUpdateQueued = false;
let drag = null;
let suppressNextClick = false;

function scrollBehavior() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

function updateEdges() {
	edgeUpdateQueued = false;
	const el = list.value;
	if (!el) return;
	const maxScrollLeft = el.scrollWidth - el.clientWidth;
	// 1px of slack: scrollLeft can land on a fraction short of either end.
	const showPrev = el.scrollLeft > 1;
	const showNext = el.scrollLeft < maxScrollLeft - 1;

	// Reaching an end hides that arrow. If it had keyboard focus, hand focus
	// to the other arrow instead of letting it drop to <body>.
	const focused = document.activeElement;
	if (!showNext && showPrev && focused === nextButton.value) {
		prevButton.value.focus({ preventScroll: true });
	} else if (!showPrev && showNext && focused === prevButton.value) {
		nextButton.value.focus({ preventScroll: true });
	}

	canScrollPrev.value = showPrev;
	canScrollNext.value = showNext;
}

// rAF-batched, the same way ScrollToTopButton handles scroll, so a fast
// scroll or drag doesn't re-measure the list on every event.
function queueEdgeUpdate() {
	if (edgeUpdateQueued) return;
	edgeUpdateQueued = true;
	window.requestAnimationFrame(updateEdges);
}

function scrollByPage(direction) {
	const el = list.value;
	el.scrollBy({ left: direction * el.clientWidth * PAGE_FRACTION, behavior: scrollBehavior() });
}

// Mouse-only: touch and pen already scroll the list natively.
function onPointerDown(event) {
	if (event.pointerType !== 'mouse' || event.button !== 0) return;
	if (!canScrollPrev.value && !canScrollNext.value) return;
	drag = { pointerId: event.pointerId, startX: event.clientX, startScrollLeft: list.value.scrollLeft };
}

function onPointerMove(event) {
	if (!drag || event.pointerId !== drag.pointerId) return;
	const deltaX = event.clientX - drag.startX;
	if (!dragging.value) {
		if (Math.abs(deltaX) < DRAG_THRESHOLD_PX) return;
		dragging.value = true;
		// Captured only once it is a real drag. Capturing on pointerdown would
		// retarget a plain click's pointerup to the list, and the topic link
		// would never get its click.
		list.value.setPointerCapture(event.pointerId);
	}
	list.value.scrollLeft = drag.startScrollLeft - deltaX;
}

function onPointerEnd(event) {
	if (!drag || event.pointerId !== drag.pointerId) return;
	if (dragging.value && event.type === 'pointerup') {
		// The browser still fires a click after the drag's pointerup; swallow
		// it (see onClickCapture). Reset on the next task in case no click
		// follows, so a later real click isn't eaten.
		suppressNextClick = true;
		window.setTimeout(() => {
			suppressNextClick = false;
		});
	}
	dragging.value = false;
	drag = null;
}

// Capture phase on the list runs before VitePress's router, which listens
// for link clicks on window in the bubble phase, so stopping it here keeps
// a drag from also navigating.
function onClickCapture(event) {
	if (!suppressNextClick) return;
	suppressNextClick = false;
	event.preventDefault();
	event.stopPropagation();
}

// Keyboard focus only (:focus-visible): a mouse press also focuses the
// link, and scrolling then would fight a drag that starts on it. The list's
// scroll-padding keeps the item clear of the arrows.
// A plain vertical mouse wheel moves the list sideways while the pointer is
// over it. Everything else is left to the browser: Ctrl+wheel zoom,
// shift+wheel and sideways trackpad swipes (which already scroll the list
// natively), and any wheel step once the list is at that end, so the page
// scrolls again instead of the wheel seeming to do nothing.
function onWheel(event) {
	if (event.ctrlKey || event.shiftKey) return;
	if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
	const el = list.value;
	const maxScrollLeft = el.scrollWidth - el.clientWidth;
	if (maxScrollLeft <= 0) return;
	if (event.deltaY < 0 && el.scrollLeft <= 0) return;
	if (event.deltaY > 0 && el.scrollLeft >= maxScrollLeft - 1) return;

	event.preventDefault();
	const step = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * WHEEL_LINE_PX
		: event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? event.deltaY * el.clientWidth
		: event.deltaY;
	// Snapping is off while the wheel turns, or each small step would be
	// pulled back to the item it started from; it settles once the wheel stops.
	wheeling.value = true;
	window.clearTimeout(wheelIdleTimer);
	wheelIdleTimer = window.setTimeout(() => {
		wheeling.value = false;
	}, WHEEL_IDLE_MS);
	el.scrollLeft += step;
}

function onFocusIn(event) {
	const link = event.target.closest('.topic-nav__link');
	if (!link?.matches(':focus-visible')) return;
	link.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: scrollBehavior() });
}

onMounted(() => {
	updateEdges();
	if (typeof ResizeObserver === 'undefined') return;

	heightObserver = new ResizeObserver(([entry]) => {
		const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.getBoundingClientRect().height;
		document.documentElement.style.setProperty('--topic-nav-height', `${Math.ceil(height)}px`);
	});
	heightObserver.observe(bar.value);

	// The list resizes with the window; the items resize when the web font
	// loads. Either can change whether (and where) the list overflows.
	edgeObserver = new ResizeObserver(queueEdgeUpdate);
	edgeObserver.observe(list.value);
	for (const item of list.value.children) edgeObserver.observe(item);
});

onBeforeUnmount(() => {
	heightObserver?.disconnect();
	edgeObserver?.disconnect();
	window.clearTimeout(wheelIdleTimer);
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
			<div class="topic-nav__edge topic-nav__edge--prev" :class="{ 'topic-nav__edge--hidden': !canScrollPrev }">
				<button
					ref="prevButton"
					type="button"
					class="topic-nav__arrow"
					aria-label="Previous topics"
					@click="scrollByPage(-1)"
				>
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="m15 18-6-6 6-6" />
					</svg>
				</button>
			</div>
			<ul
				ref="list"
				class="topic-nav__list"
				:class="{
					'topic-nav__list--scrollable': canScrollPrev || canScrollNext,
					'topic-nav__list--dragging': dragging,
					'topic-nav__list--wheeling': wheeling,
				}"
				@scroll.passive="queueEdgeUpdate"
				@pointerdown="onPointerDown"
				@pointermove="onPointerMove"
				@pointerup="onPointerEnd"
				@pointercancel="onPointerEnd"
				@wheel="onWheel"
				@click.capture="onClickCapture"
				@dragstart.prevent
				@focusin="onFocusIn"
			>
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
			<div class="topic-nav__edge topic-nav__edge--next" :class="{ 'topic-nav__edge--hidden': !canScrollNext }">
				<button
					ref="nextButton"
					type="button"
					class="topic-nav__arrow"
					aria-label="Next topics"
					@click="scrollByPage(1)"
				>
					<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="m9 18 6-6-6-6" />
					</svg>
				</button>
			</div>
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
	--topic-nav-arrow-width: 40px;
}

/* Same full-bleed-bar/centered-content split the nav bar and CtaBanner
   already use: the background and border span the viewport, while the
   topic list itself never grows past 80rem, matching the header. */
.topic-nav__inner {
	position: relative;
	max-width: 80rem;
	margin: 0 auto;
}

.topic-nav__list {
	display: flex;
	gap: 4px;
	margin: 0;
	padding: 0 2px;
	list-style: none;
	/* Horizontal scroll, never wrap. Chosen over a dropdown: every topic
	   stays one tap away and visible as you scroll, rather than hidden
	   behind an extra open/close step. */
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
	scroll-snap-type: x proximity;
	/* Snapped and keyboard-focused items stop clear of the arrows. */
	scroll-padding-inline: var(--topic-nav-arrow-width);
	/* The arrows replace the scrollbar: scrollbar-width for Firefox and
	   current Chrome, ::-webkit-scrollbar for Safari. */
	scrollbar-width: none;
	user-select: none;
}

.topic-nav__list::-webkit-scrollbar {
	display: none;
}

@media (hover: hover) and (pointer: fine) {
	.topic-nav__list--scrollable {
		cursor: grab;
	}
}

/* Snapping off while dragging or wheeling, or it would yank the list back
   under the pointer; it settles on an item once either ends. */
.topic-nav__list--dragging,
.topic-nav__list--wheeling {
	scroll-snap-type: none;
}

.topic-nav__list--dragging,
.topic-nav__list--dragging .topic-nav__link {
	cursor: grabbing;
}

.topic-nav__item {
	flex: none;
	scroll-snap-align: start;
}

/* Each arrow sits on a strip of page background that fades into the list,
   hinting there is more on that side. The strip ignores the pointer so the
   faded part never blocks clicks or drags on the items under it. */
.topic-nav__edge {
	position: absolute;
	top: 0;
	bottom: 0;
	z-index: 1;
	display: flex;
	width: calc(var(--topic-nav-arrow-width) + 24px);
	pointer-events: none;
	transition: opacity 0.2s ease, visibility 0.2s ease;
}

.topic-nav__edge--prev {
	left: 0;
	justify-content: flex-start;
	background: linear-gradient(to right, var(--vp-c-bg) var(--topic-nav-arrow-width), transparent);
}

.topic-nav__edge--next {
	right: 0;
	justify-content: flex-end;
	background: linear-gradient(to left, var(--vp-c-bg) var(--topic-nav-arrow-width), transparent);
}

/* visibility, not display: it also drops the button from the tab order
   and accessibility tree, while still letting the opacity fade run. */
.topic-nav__edge--hidden {
	opacity: 0;
	visibility: hidden;
}

.topic-nav__arrow {
	display: flex;
	align-items: center;
	justify-content: center;
	width: var(--topic-nav-arrow-width);
	height: 100%;
	padding: 0;
	border: 0;
	background: none;
	color: var(--vp-c-text-2);
	cursor: pointer;
	pointer-events: auto;
	transition: color 0.2s ease;
}

.topic-nav__arrow:hover {
	color: var(--vp-c-text-1);
}

.topic-nav__arrow:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: -2px;
}

@media (prefers-reduced-motion: reduce) {
	.topic-nav__edge {
		transition: none;
	}
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
