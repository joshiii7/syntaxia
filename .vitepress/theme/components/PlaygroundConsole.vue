<script setup>
/**
 * The console panel under (or, in the workspace layout, beside) a
 * WebPlayground preview: console.log/info/warn/error output and uncaught
 * errors from the sandboxed preview. WebPlayground collects the lines; this
 * only renders them and keeps the newest one in view.
 */
import { nextTick, ref, useId, watch } from 'vue';

const props = defineProps({
	// [{ level: 'log' | 'info' | 'warn' | 'error', text: string }]
	lines: {
		type: Array,
		required: true,
	},
	// The workspace layout already names this panel with its tab, so it
	// hides the heading to avoid saying "Console" twice.
	showTitle: {
		type: Boolean,
		default: true,
	},
});

const outputEl = ref(null);
const titleId = useId();

watch(
	() => props.lines.length,
	() => {
		nextTick(() => {
			if (outputEl.value) outputEl.value.scrollTop = outputEl.value.scrollHeight;
		});
	},
);
</script>

<template>
	<div class="playground-console">
		<h4 v-if="showTitle" :id="titleId" class="playground-console__title">Console</h4>
		<div
			ref="outputEl"
			class="playground-console__output"
			role="log"
			:aria-labelledby="showTitle ? titleId : undefined"
			:aria-label="showTitle ? undefined : 'Console output'"
		>
			<p v-if="!lines.length" class="playground-console__empty">
				Nothing logged yet. Anything you pass to console.log() shows up here.
			</p>
			<ol v-else class="playground-console__lines">
				<li
					v-for="(line, index) in lines"
					:key="index"
					class="playground-console__line"
					:class="`playground-console__line--${line.level}`"
				>
					<span v-if="line.level === 'error' || line.level === 'warn'" class="playground-console__level">
						{{ line.level === 'error' ? 'Error' : 'Warning' }}
					</span>
					{{ line.text }}
				</li>
			</ol>
		</div>
	</div>
</template>

<style scoped>
.playground-console {
	display: flex;
	flex-direction: column;
	min-height: 0;
}

.playground-console__title {
	margin: 0 0 6px;
	font-size: var(--font-size-xs);
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--vp-c-text-2);
}

.playground-console__output {
	max-height: 240px;
	overflow-y: auto;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background: var(--vp-c-bg-soft);
	font-family: var(--vp-font-family-mono);
	font-size: var(--font-size-sm);
	line-height: 1.5;
}

.playground-console__empty {
	margin: 0;
	padding: 10px 12px;
	color: var(--vp-c-text-2);
}

.playground-console__lines {
	margin: 0;
	padding: 0;
	list-style: none;
}

.playground-console__line {
	margin: 0;
	padding: 6px 12px;
	border-bottom: 1px solid var(--vp-c-divider);
	white-space: pre-wrap;
	overflow-wrap: anywhere;
	color: var(--vp-c-text-1);
}

.playground-console__line:last-child {
	border-bottom: none;
}

/* Errors and warnings also carry a text label, so the level never relies
   on color alone. */
.playground-console__line--error {
	color: var(--vp-c-danger-1);
	background: var(--vp-c-danger-soft);
}

.playground-console__line--warn {
	color: var(--vp-c-warning-1);
	background: var(--vp-c-warning-soft);
}

.playground-console__level {
	margin-right: 6px;
	font-weight: 700;
}
</style>
