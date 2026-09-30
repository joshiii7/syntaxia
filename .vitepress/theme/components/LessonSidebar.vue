<script setup>
/**
 * Custom lesson sidebar, replacing the default theme's rendered tree via the
 * `sidebar-nav-before` slot (see theme/index.ts). Deliberately reuses the
 * default theme's own CSS classes (VPSidebarItem, level-N, is-link,
 * is-active, item/indicator/link/text/caret — confirmed against
 * node_modules/vitepress/dist/client/theme-default/components/
 * VPSidebarItem.vue) so it inherits all existing sidebar CSS with only the
 * additions in the <style> block below.
 *
 * themeConfig.sidebar['/lessons/'] is set to a minimal stub in config.mts
 * specifically so the default theme's own VPSidebarGroup renders nothing
 * visible alongside this component (see the plan's LessonSidebar section
 * for why: VPSidebar.vue has no "replace the tree" slot, only
 * before/after ones around VPSidebarGroup, so the config-driven tree has to
 * be neutralized rather than removed).
 */
import { useData, withBase } from 'vitepress';
import { computed, reactive, watch } from 'vue';
import { curriculum, flattenTrackLessons, sidebarLabel } from '../data/curriculum';
import { findPath } from '../data/paths';
import { useActivePath } from '../composables/useActivePath';

const { page } = useData();
const { activePathId, activePath } = useActivePath();

// e.g. "lessons/html/introduction.md" -> ["lessons", "html", "introduction"]
const currentSegments = computed(() => page.value.relativePath.replace(/\.md$/, '').split('/'));
const currentTrackSlug = computed(() => currentSegments.value[1] ?? null);
const currentLessonSlug = computed(() => currentSegments.value[2] ?? null);

function isCurrentLesson(trackSlug, lessonSlug) {
	return trackSlug === currentTrackSlug.value && lessonSlug === currentLessonSlug.value;
}

// Only the current lesson's own track is ever shown — not the full
// multi-track curriculum — so switching tracks means navigating to a lesson
// in that track (via the Lessons index or a guided path), not toggling a
// section open here.
const currentTrack = computed(() => curriculum.find((t) => t.slug === currentTrackSlug.value) ?? null);

// Collapse state: local only, not persisted — matches the default theme's
// own sidebar, whose `collapsed` ref also resets on reload.
const collapsedChapters = reactive({});

function chapterKey(trackSlug, chapterId) {
	return `${trackSlug}:${chapterId}`;
}

function isChapterCollapsed(trackSlug, chapterId) {
	return collapsedChapters[chapterKey(trackSlug, chapterId)] ?? true;
}

function toggleChapter(trackSlug, chapterId) {
	const k = chapterKey(trackSlug, chapterId);
	collapsedChapters[k] = !isChapterCollapsed(trackSlug, chapterId);
}

// Force-expand whichever chapter contains the current lesson, every time
// the route changes — same behavior as the default theme's own
// useSidebarControl (`hasActiveLink && (collapsed.value = false)`), without
// collapsing chapters the learner opened manually elsewhere.
watch(
	[currentTrackSlug, currentLessonSlug],
	() => {
		if (!currentTrackSlug.value) return;
		const chapter = currentTrack.value?.chapters?.find((c) => c.lessons.some((l) => l.slug === currentLessonSlug.value));
		if (chapter) collapsedChapters[chapterKey(currentTrackSlug.value, chapter.id)] = false;
	},
	{ immediate: true },
);

const activePathMeta = computed(() => (activePathId.value ? findPath(activePathId.value) : null));
</script>

<template>
	<div class="lesson-sidebar">
		<!-- Guided-path view: flat, cross-track step list, shown instead of the full curriculum tree while a path is active. -->
		<template v-if="activePathMeta">
			<div
				v-for="step in activePath"
				:key="`${step.track.slug}/${step.lesson.slug}`"
				class="VPSidebarItem level-1 is-link"
				:class="{ 'is-active': isCurrentLesson(step.track.slug, step.lesson.slug) }"
			>
				<div class="item">
					<div class="indicator" />
					<a class="link" :href="withBase(step.path)" :title="`${step.track.title}: ${step.lesson.title}`">
						<p class="text">{{ step.track.title }}: {{ sidebarLabel(step.lesson) }}</p>
					</a>
				</div>
			</div>
		</template>

		<!-- Default view: only the current lesson's own track, chapter -> lesson (or flat lesson list if it has no chapters). Other tracks are reachable via the Lessons index / guided paths, not listed here. -->
		<template v-else-if="currentTrack">
			<div class="items">
				<!-- Chaptered track -->
				<template v-if="currentTrack.chapters">
					<div
						v-for="chapter in currentTrack.chapters"
						:key="chapter.id"
						class="VPSidebarItem level-1"
						:class="{ collapsed: isChapterCollapsed(currentTrack.slug, chapter.id) }"
					>
						<div class="item" role="button" tabindex="0" @click="toggleChapter(currentTrack.slug, chapter.id)" @keydown.enter="toggleChapter(currentTrack.slug, chapter.id)">
							<div class="indicator" />
							<p class="text" :title="chapter.title">{{ sidebarLabel(chapter) }}</p>
							<div class="caret" role="button" aria-label="toggle section" @click.stop="toggleChapter(currentTrack.slug, chapter.id)">
								<span class="vpi-chevron-right caret-icon" />
							</div>
						</div>

						<div class="items">
							<div
								v-for="lesson in chapter.lessons"
								:key="lesson.slug"
								class="VPSidebarItem level-2 is-link"
								:class="{ 'is-active': isCurrentLesson(currentTrack.slug, lesson.slug) }"
							>
								<div class="item">
									<div class="indicator" />
									<a class="link" :href="withBase(`/lessons/${currentTrack.slug}/${lesson.slug}`)" :title="lesson.title">
										<p class="text">{{ sidebarLabel(lesson) }}</p>
									</a>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!-- Flat track (no chapters) -->
				<template v-else>
					<div
						v-for="lesson in flattenTrackLessons(currentTrack)"
						:key="lesson.lesson.slug"
						class="VPSidebarItem level-1 is-link"
						:class="{ 'is-active': isCurrentLesson(currentTrack.slug, lesson.lesson.slug) }"
					>
						<div class="item">
							<div class="indicator" />
							<a class="link" :href="withBase(`/lessons/${currentTrack.slug}/${lesson.lesson.slug}`)" :title="lesson.lesson.title">
								<p class="text">{{ sidebarLabel(lesson.lesson) }}</p>
							</a>
						</div>
					</div>
				</template>
			</div>
		</template>
	</div>
</template>

<style scoped>
/*
 * Breathing room: the reused VPSidebarItem classes are tuned for the
 * default theme's full multi-section tree. Now that only one track's (or
 * one guided path's) lessons ever render here, with no track/path title
 * header above them, that default spacing isn't enough between sibling
 * chapters/steps — everything reads as one dense block without it.
 */
.lesson-sidebar {
	padding: 14px 14px 32px;
}

/* Labels come from each lesson's short sidebarTitle, so they normally fit
   on one line. This is the safety net for any that don't: one line, cut
   off with an ellipsis, with the full title in the link's title tooltip.
   min-width: 0 lets the flex items shrink below their text width, which
   they otherwise refuse to do, so the ellipsis can actually appear. */
.lesson-sidebar .link {
	min-width: 0;
}

.lesson-sidebar .text {
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* Room between individual lesson rows (links) — flat-track lessons,
   chaptered lessons, and guided-path steps alike, regardless of nesting
   level — so consecutive rows read as separate items, not one dense block.
   Kept separate from chapter-group spacing below, which is a bigger gap
   for a different purpose (grouping, not just row-to-row breathing room). */
.lesson-sidebar .VPSidebarItem.is-link {
	margin-bottom: 6px;
}

.lesson-sidebar .VPSidebarItem.is-link:last-child {
	margin-bottom: 0;
}

.lesson-sidebar .VPSidebarItem.is-link > .item {
	padding: 7px 6px;
}

/* Space between whole chapter groups (or, in guided-path view, before the
   very first step) — separate from the row-to-row spacing above. */
.lesson-sidebar > .items > .VPSidebarItem.level-1:not(.is-link) {
	margin-bottom: 4px;
}

.lesson-sidebar > .items {
	padding-bottom: 8px;
}

/*
 * Two clearly distinct item states, using only existing theme tokens
 * (--vp-c-*, --color-brand-*) — no new colors, just spacing/weight/
 * background/border to separate them at a glance:
 *
 * 1. Section headers (chapter titles — non-interactive group labels):
 *    smaller, uppercase, muted, set off with a top border/extra space so
 *    they read as dividers, not as another clickable row.
 * 2. Current lesson: the whole row is highlighted (background + a left
 *    accent bar + bold brand-colored text) — enough on its own to show
 *    position at a glance, so there's no separate completed-lesson
 *    checkmark competing for attention alongside it.
 */

/* 1. Section headers — chapter titles (level-1 without .is-link). */
.lesson-sidebar .VPSidebarItem.level-1:not(.is-link) > .item > .text {
	font-size: var(--font-size-2xs);
	font-weight: 700;
	letter-spacing: 0.05em;
	text-transform: uppercase;
	color: var(--vp-c-text-3);
}

.lesson-sidebar .VPSidebarItem.level-1:not(.is-link) {
	margin-top: 10px;
	padding-top: 18px;
	border-top: 1px solid var(--vp-c-divider);
}

.lesson-sidebar > .items > .VPSidebarItem.level-1:not(.is-link):first-child {
	margin-top: 0;
	padding-top: 0;
	border-top: none;
}

/* 2. Current lesson — the whole-row highlight this redesign is for. Every
   link row reserves the same 3px left-border space (transparent when not
   current), so a row becoming/un-becoming current never shifts its own or
   any sibling's text — only the border's color and the background appear. */
.lesson-sidebar .VPSidebarItem.is-link > .item {
	border-left: 3px solid transparent;
	border-radius: 4px;
	transition: background-color 0.2s ease, border-color 0.2s ease;
}

.lesson-sidebar .VPSidebarItem.is-link.is-active > .item {
	background: var(--vp-c-bg-soft);
	border-left-color: var(--vp-c-brand-1);
}

.lesson-sidebar .VPSidebarItem.is-link.is-active > .item > .link > .text {
	font-weight: 700;
	color: var(--vp-c-brand-1);
}
</style>
