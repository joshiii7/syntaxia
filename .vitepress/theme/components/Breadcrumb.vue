<script setup>
/**
 * Track > Chapter > Lesson breadcrumb (2 levels when the track has no
 * chapters), or {Path title} > Step N: Lesson when a guided path is active.
 * No existing breadcrumb component/CSS exists anywhere in this codebase, so
 * this is genuinely new UI — styled using only existing theme CSS custom
 * properties (--vp-c-text-2/--vp-c-divider/--vp-c-brand-1), no new colors.
 */
import { useData, withBase } from 'vitepress';
import { computed } from 'vue';
import { resolveLesson } from '../data/curriculum';
import { findPath } from '../data/paths';
import { useActivePath } from '../composables/useActivePath';

const { page } = useData();
const { activePathId, activePath, deactivatePath } = useActivePath();

const segments = computed(() => page.value.relativePath.replace(/\.md$/, '').split('/'));
const trackSlug = computed(() => segments.value[1] ?? null);
const lessonSlug = computed(() => segments.value[2] ?? null);

const resolved = computed(() => (trackSlug.value && lessonSlug.value ? resolveLesson(trackSlug.value, lessonSlug.value) : null));

// A path is only "active for this page" if the current lesson is actually
// one of its steps — visiting an unrelated lesson by URL falls back to the
// normal track/chapter breadcrumb for that one page, per the soft-gate
// design (direct navigation always works, path view resumes automatically
// on the next path-member lesson).
const activeStep = computed(() => {
	if (!activePathId.value || !resolved.value) return null;
	const step = activePath.value?.find((s) => s.track.slug === trackSlug.value && s.lesson.slug === lessonSlug.value);
	return step ?? null;
});

const activePathMeta = computed(() => (activePathId.value ? findPath(activePathId.value) : null));
</script>

<template>
	<nav v-if="resolved" class="lesson-breadcrumb" aria-label="Breadcrumb">
		<ol class="lesson-breadcrumb__list">
			<template v-if="activeStep && activePathMeta">
				<li>
					<a :href="withBase('/paths/')">{{ activePathMeta.title }}</a>
				</li>
				<li aria-current="page">Step {{ activeStep.stepIndex + 1 }}: {{ activeStep.lesson.title }}</li>
				<li>
					<button type="button" class="lesson-breadcrumb__exit" @click="deactivatePath">Exit path</button>
				</li>
			</template>
			<template v-else>
				<li>
					<a :href="withBase(`/lessons/${resolved.track.slug}/${resolved.track.chapters ? resolved.track.chapters[0].lessons[0].slug : resolved.track.lessons[0].slug}`)">{{ resolved.track.title }}</a>
				</li>
				<li v-if="resolved.chapter">{{ resolved.chapter.title }}</li>
				<li aria-current="page">{{ resolved.lesson.title }}</li>
			</template>
		</ol>
	</nav>
</template>

<style scoped>
.lesson-breadcrumb {
	margin-bottom: 16px;
}

.lesson-breadcrumb__list {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	margin: 0;
	padding: 0;
	list-style: none;
	font-size: var(--font-size-xs);
	color: var(--vp-c-text-2);
}

.lesson-breadcrumb__list li:not(:last-child)::after {
	content: '/';
	margin-left: 6px;
	color: var(--vp-c-divider);
}

.lesson-breadcrumb__list a {
	color: var(--vp-c-text-2);
	text-decoration: none;
}

.lesson-breadcrumb__list a:hover {
	color: var(--vp-c-brand-1);
}

.lesson-breadcrumb__list li[aria-current='page'] {
	color: var(--vp-c-text-1);
	font-weight: 600;
}

.lesson-breadcrumb__exit {
	padding: 0;
	border: none;
	background: none;
	color: var(--vp-c-text-3);
	text-decoration: underline;
	cursor: pointer;
	font-size: inherit;
}

.lesson-breadcrumb__exit:hover {
	color: var(--vp-c-brand-1);
}
</style>
