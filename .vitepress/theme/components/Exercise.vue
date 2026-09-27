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
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import WebPlayground from './WebPlayground.vue';
import { useLessonRequirements } from '../composables/useLessonRequirements';

const props = defineProps({
	initialHtml: { type: String, default: '' },
	initialCss: { type: String, default: '' },
	initialJs: { type: String, default: '' },
	panes: { type: Array, default: () => ['html', 'css', 'javascript'] },
	previewHeight: { type: String, default: '260px' },
	previewTheme: { type: String, default: 'light' },
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
</script>

<template>
	<div class="exercise">
		<WebPlayground
			:initial-html="initialHtml"
			:initial-css="initialCss"
			:initial-js="initialJs"
			:panes="panes"
			:preview-height="previewHeight"
			:preview-theme="previewTheme"
			:graded="true"
			@graded="onGraded"
		/>

		<div v-if="graded" class="exercise__result" role="status">
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
