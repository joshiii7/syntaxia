<script setup>
/**
 * Replaces the hand-written "Next lesson" Markdown link at the bottom of
 * every lesson. Soft-gated: "Next Lesson" is always a real <a> (never a
 * disabled-button fake), so direct navigation/right-click/middle-click
 * always work — the click-guard below is a UX nicety, not a security
 * boundary, matching the confirmed soft-gate decision. This is a strict
 * superset of today's behavior, since today's hand-written link has zero
 * gating at all.
 */
import { useData, withBase } from 'vitepress';
import { computed, useId, watch } from 'vue';
import { sidebarLabel, trackPrevNext } from '../data/curriculum';
import { pathPrevNext } from '../data/paths';
import { useActivePath } from '../composables/useActivePath';
import { useProgress } from '../composables/useProgress';
import { useLessonRequirements } from '../composables/useLessonRequirements';

const props = defineProps({
	// A single, small "Next" link for a toolbar (the final project workspace),
	// instead of the full prev/next row under a lesson. It still marks the
	// lesson complete and keeps the same soft gate.
	compact: {
		type: Boolean,
		default: false,
	},
});

const { page, frontmatter } = useData();
const hintId = useId();
const { activePathId } = useActivePath();
const { markLessonComplete } = useProgress();
const { allPassed, requirements } = useLessonRequirements();

const segments = computed(() => page.value.relativePath.replace(/\.md$/, '').split('/'));
const trackSlug = computed(() => segments.value[1] ?? null);
const lessonSlug = computed(() => segments.value[2] ?? null);

const prevNext = computed(() => {
	if (!trackSlug.value || !lessonSlug.value) return { prev: null, next: null };
	if (activePathId.value) {
		const inPath = pathPrevNext(activePathId.value, trackSlug.value, lessonSlug.value);
		if (inPath.prev || inPath.next) return inPath;
	}
	return trackPrevNext(trackSlug.value, lessonSlug.value);
});

// A stub lesson (frontmatter `comingSoon: true`) has no quizzes, so
// allPassed is trivially true there: Next stays unlocked, which is what we
// want, but the page must never be recorded as completed just by visiting it.
const isStub = computed(() => frontmatter.value.comingSoon === true);

watch(
	allPassed,
	(passed) => {
		if (isStub.value) return;
		if (passed && trackSlug.value && lessonSlug.value) markLessonComplete(trackSlug.value, lessonSlug.value);
	},
	{ immediate: true },
);

const hint = computed(() => {
	const failing = requirements.filter((r) => !r.passed);
	if (failing.length === 0) return '';
	const hasQuiz = failing.some((r) => r.kind === 'quiz');
	const hasExercise = failing.some((r) => r.kind === 'exercise');
	if (hasQuiz && hasExercise) return 'Answer the quiz and finish the exercise above to continue.';
	if (hasExercise) return props.compact ? 'Pass every check to continue.' : 'Finish the exercise above to continue.';
	return 'Answer the quiz above correctly to continue.';
});

function onNextClick(event) {
	if (!allPassed.value) event.preventDefault();
}
</script>

<template>
	<div v-if="compact && prevNext.next" class="lesson-nav-compact">
		<a
			class="lesson-nav__link"
			:class="{ 'lesson-nav__link--disabled': !allPassed }"
			:href="withBase(prevNext.next.path)"
			:aria-disabled="!allPassed"
			:aria-describedby="allPassed ? undefined : hintId"
			:title="allPassed ? prevNext.next.lesson.title : hint"
			@click="onNextClick"
		>
			Next: {{ sidebarLabel(prevNext.next.lesson) }} &rarr;
		</a>
		<span v-if="!allPassed" :id="hintId" hidden>{{ hint }}</span>
	</div>
	<div v-else-if="!compact && trackSlug && lessonSlug" class="lesson-nav">
		<a v-if="prevNext.prev" class="lesson-nav__link lesson-nav__link--prev" :href="withBase(prevNext.prev.path)">
			&larr; {{ prevNext.prev.lesson.title }}
		</a>
		<div v-else />

		<div v-if="prevNext.next" class="lesson-nav__next">
			<a
				class="lesson-nav__link lesson-nav__link--next"
				:class="{ 'lesson-nav__link--disabled': !allPassed }"
				:href="withBase(prevNext.next.path)"
				:aria-disabled="!allPassed"
				@click="onNextClick"
			>
				{{ prevNext.next.lesson.title }} &rarr;
			</a>
			<p v-if="!allPassed" class="lesson-nav__hint">{{ hint }}</p>
		</div>
	</div>
</template>

<style scoped>
.lesson-nav-compact {
	white-space: nowrap;
}

.lesson-nav {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 16px;
	margin-top: 32px;
	padding-top: 16px;
	border-top: 1px solid var(--vp-c-divider);
}

.lesson-nav__link {
	font-weight: 600;
	color: var(--vp-c-brand-1);
	text-decoration: none;
}

.lesson-nav__link:hover {
	text-decoration: underline;
}

.lesson-nav__next {
	text-align: right;
	margin-left: auto;
}

.lesson-nav__link--disabled {
	color: var(--vp-c-text-3);
	cursor: not-allowed;
}

.lesson-nav__hint {
	margin: 4px 0 0;
	font-size: var(--font-size-xs);
	color: var(--vp-c-text-2);
}
</style>
