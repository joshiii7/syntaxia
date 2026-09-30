<script setup>
/**
 * Graded coding exercise: wraps WebPlayground (composition, not a fork) and
 * adds expected-output validation on top of it — comparing what the code
 * actually produced against a small ordered list of checks, each with its
 * own specific hint shown only when that check fails.
 *
 * Existing <WebPlayground> usages are untouched by this component's
 * existence; lessons that just want a free-form sandbox keep using
 * <WebPlayground> directly, and adopt <Exercise> only when they want grading.
 */
import { useData, withBase } from 'vitepress';
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import WebPlayground from './WebPlayground.vue';
import LessonNav from './LessonNav.vue';
import { resolveLesson } from '../data/curriculum';
import { useLessonRequirements } from '../composables/useLessonRequirements';

const props = defineProps({
	initialHtml: { type: String, default: '' },
	initialCss: { type: String, default: '' },
	initialJs: { type: String, default: '' },
	panes: { type: Array, default: () => ['html', 'css', 'javascript'] },
	previewHeight: { type: String, default: '260px' },
	previewTheme: { type: String, default: 'light' },
	// Passed straight through to WebPlayground's console panel.
	showConsole: { type: Boolean, default: false },
	gradeDelay: { type: Number, default: 50 },
	// Passed through to WebPlayground. 'workspace' is the full-viewport
	// final project layout: the checklist moves into a Checks tab, and the toolbar
	// gets the page title, a back link, a check counter, and the Next link.
	layout: { type: String, default: 'stacked' },
	// Optional explicit id for the gating registry — see Quiz.vue's `id` prop for the same pattern.
	id: { type: String, default: null },
	// Ordered checks; each: { type, expected, hint }. `type` is one of
	// 'html-contains' | 'html-equals-normalized' | 'console-includes' | 'console-equals'.
	checks: { type: Array, required: true },
});

const autoId = useId();
const requirementId = props.id ?? autoId;

const registry = useLessonRequirements();
onBeforeUnmount(registry.register(requirementId, 'exercise'));

const graded = ref(false);
const lastResult = ref(null); // { html, consoleOutput, errors }

function normalizeHtml(html) {
	const div = document.createElement('div');
	div.innerHTML = html;
	return div.innerHTML;
}

function checkPasses(check, result) {
	switch (check.type) {
		case 'html-contains':
			return result.html.includes(check.expected);
		case 'html-equals-normalized':
			return normalizeHtml(result.html) === normalizeHtml(check.expected);
		case 'console-includes':
			return result.consoleOutput.some((line) => line.includes(check.expected));
		case 'console-equals':
			return result.consoleOutput.includes(check.expected);
		default:
			return false;
	}
}

const checkResults = computed(() => {
	if (!lastResult.value) return [];
	return props.checks.map((check) => ({ check, passed: checkPasses(check, lastResult.value) }));
});

const allChecksPassed = computed(() => graded.value && checkResults.value.length > 0 && checkResults.value.every((r) => r.passed));

watch(allChecksPassed, (passed) => registry.reportResult(requirementId, passed), { immediate: true });

function onGraded(result) {
	graded.value = true;
	lastResult.value = result;
}

const passedCount = computed(() => checkResults.value.filter((result) => result.passed).length);

// Workspace toolbar title: the lesson's full title from curriculum.ts (the
// same source as the sidebar and breadcrumb), falling back to the page title.
const { page } = useData();
const lessonTitle = computed(() => {
	const [, trackSlug, lessonSlug] = page.value.relativePath.replace(/\.md$/, '').split('/');
	return resolveLesson(trackSlug, lessonSlug)?.lesson.title ?? page.value.title;
});
</script>

<template>
	<div class="exercise" :class="{ 'exercise--workspace': layout === 'workspace' }">
		<WebPlayground
			:initial-html="initialHtml"
			:initial-css="initialCss"
			:initial-js="initialJs"
			:panes="panes"
			:preview-height="previewHeight"
			:preview-theme="previewTheme"
			:show-console="showConsole"
			:grade-delay="gradeDelay"
			:graded="true"
			:layout="layout"
			@graded="onGraded"
		>
			<template v-if="$slots.instructions" #instructions>
				<slot name="instructions" />
			</template>

			<template v-if="layout === 'workspace'" #toolbar-start>
				<a class="exercise__back" :href="withBase('/lessons/')">&larr; Back to lessons</a>
				<h1 class="exercise__title">{{ lessonTitle }}</h1>
			</template>

			<template v-if="layout === 'workspace'" #toolbar-end>
				<span class="exercise__count" aria-live="polite">
					<template v-if="!graded">Checking...</template>
					<template v-else-if="allChecksPassed">All {{ checks.length }} checks passed</template>
					<template v-else>{{ passedCount }}/{{ checks.length }} checks</template>
				</span>
				<LessonNav compact />
			</template>

			<template v-if="layout === 'workspace'" #extra-tab>
				<p v-if="!graded" class="exercise__status">Press Run to check your work.</p>
				<template v-else>
					<p class="exercise__status" :class="allChecksPassed ? 'exercise__status--pass' : 'exercise__status--fail'">
						{{ allChecksPassed ? 'All checks passed!' : 'Not quite yet.' }}
					</p>
					<ul class="exercise__checks">
						<li v-for="(result, index) in checkResults" :key="index" class="exercise__check" :class="result.passed ? 'exercise__check--pass' : 'exercise__check--fail'">
							<span aria-hidden="true">{{ result.passed ? '✓' : '✗' }}</span>
							<span>{{ result.passed ? 'Passed' : result.check.hint }}</span>
						</li>
					</ul>
				</template>
			</template>
		</WebPlayground>

		<div v-if="graded && layout !== 'workspace'" class="exercise__result" role="status">
			<p class="exercise__status" :class="allChecksPassed ? 'exercise__status--pass' : 'exercise__status--fail'">
				{{ allChecksPassed ? 'All checks passed!' : 'Not quite yet.' }}
			</p>
			<ul class="exercise__checks">
				<li v-for="(result, index) in checkResults" :key="index" class="exercise__check" :class="result.passed ? 'exercise__check--pass' : 'exercise__check--fail'">
					<span aria-hidden="true">{{ result.passed ? '✓' : '✗' }}</span>
					<span>{{ result.passed ? 'Passed' : result.check.hint }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.exercise {
	margin: 24px 0;
}

.exercise--workspace {
	height: 100%;
	margin: 0;
}

.exercise__back {
	flex: none;
	color: var(--vp-c-text-2);
	text-decoration: none;
}

.exercise__back:hover {
	color: var(--vp-c-brand-1);
}

/* The page's one h1, sized for a toolbar rather than a document. */
.exercise__title {
	overflow: hidden;
	margin: 0;
	font-size: var(--font-size-sm);
	font-weight: 600;
	line-height: 1.4;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.exercise__count {
	color: var(--vp-c-text-2);
	white-space: nowrap;
}

.exercise__result {
	margin-top: 12px;
	padding: 16px 20px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
}

.exercise__status {
	margin: 0 0 8px;
	font-weight: 600;
}

.exercise__status--pass {
	color: var(--vp-c-green-1);
}

.exercise__status--fail {
	color: var(--vp-c-text-2);
}

.exercise__checks {
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.exercise__check {
	display: flex;
	align-items: baseline;
	gap: 8px;
	font-size: var(--font-size-sm);
}

.exercise__check--pass {
	color: var(--vp-c-green-1);
}

.exercise__check--fail {
	color: var(--vp-c-text-1);
}
</style>
