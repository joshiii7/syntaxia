<script setup>
/**
 * Placeholder multiple-choice quiz, embeddable in lesson Markdown.
 * One question, one correct answer, immediate feedback on submit.
 */
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue';
import { useLessonRequirements } from '../composables/useLessonRequirements';

const props = defineProps({
	question: {
		type: String,
		required: true,
	},
	options: {
		type: Array,
		required: true,
	},
	// Index into `options` that is correct.
	answerIndex: {
		type: Number,
		required: true,
	},
	explanation: {
		type: String,
		default: '',
	},
	// Optional explicit id for the page-level gating registry. Almost never
	// needs to be set by hand — omitted, it falls back to this instance's
	// own auto-generated groupName below, so existing lessons need no changes.
	id: {
		type: String,
		default: null,
	},
});

const groupName = useId();
const selected = ref(null);
const submitted = ref(false);

const isCorrect = computed(() => submitted.value && selected.value === props.answerIndex);

// Register this quiz as a gating requirement for the current lesson page
// (see useLessonRequirements.ts) so LessonNav can soft-gate "Next Lesson"
// until it's answered correctly.
const registry = useLessonRequirements();
const requirementId = props.id ?? groupName;
onBeforeUnmount(registry.register(requirementId, 'quiz'));
watch(isCorrect, (passed) => registry.reportResult(requirementId, passed), { immediate: true });

function checkAnswer() {
	submitted.value = true;
}

function tryAgain() {
	submitted.value = false;
	selected.value = null;
}
</script>

<template>
	<fieldset class="quiz">
		<legend class="quiz__question">{{ question }}</legend>

		<div class="quiz__options">
			<div v-for="(option, index) in options" :key="index" class="quiz__option">
				<input
					:id="`${groupName}-${index}`"
					v-model.number="selected"
					type="radio"
					:name="groupName"
					:value="index"
					:disabled="submitted"
				/>
				<label :for="`${groupName}-${index}`">{{ option }}</label>
			</div>
		</div>

		<div class="quiz__actions">
			<button
				v-if="!submitted"
				type="button"
				class="quiz__button"
				:disabled="selected === null"
				@click="checkAnswer"
			>
				Check answer
			</button>
			<button v-else type="button" class="quiz__button quiz__button--secondary" @click="tryAgain">
				Try again
			</button>
		</div>

		<p v-if="submitted" role="status" class="quiz__feedback" :class="isCorrect ? 'quiz__feedback--correct' : 'quiz__feedback--incorrect'">
			<template v-if="isCorrect">Correct! <span v-if="explanation">{{ explanation }}</span></template>
			<template v-else>Not quite. Review the lesson above and try again.</template>
		</p>
	</fieldset>
</template>

<style scoped>
.quiz {
	margin: 24px 0;
	padding: 16px 20px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
}

.quiz__question {
	padding: 0 4px;
	font-weight: 600;
}

.quiz__options {
	display: flex;
	flex-direction: column;
	gap: 8px;
	margin: 12px 0;
}

.quiz__option {
	display: flex;
	align-items: center;
	gap: 8px;
}

.quiz__option input,
.quiz__option label {
	cursor: pointer;
}

.quiz__option input:disabled,
.quiz__option input:disabled + label {
	cursor: not-allowed;
}

.quiz__button {
	padding: 8px 16px;
	border: 1px solid transparent;
	border-radius: 6px;
	background: var(--color-brand-400);
	color: var(--color-navy-900);
	font-weight: 600;
	cursor: pointer;
}

.quiz__button:hover {
	background: var(--color-brand-500);
}

.quiz__button--secondary {
	background: transparent;
	border-color: var(--vp-c-brand-1);
	color: var(--vp-c-brand-1);
}

.quiz__button--secondary:hover {
	background: var(--vp-c-brand-soft);
}

.quiz__button:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.quiz__feedback {
	margin: 12px 0 0;
	font-weight: 600;
}

.quiz__feedback--correct {
	color: var(--vp-c-green-1);
}

.quiz__feedback--incorrect {
	color: var(--vp-c-red-1);
}
</style>
