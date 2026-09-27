<script setup>
/**
 * HTML/CSS/JS lesson playground: three CodeMirror editors plus a sandboxed
 * iframe preview beside them. The preview iframe is rebuilt from srcdoc, so
 * the user's script never runs in the site's own origin/context.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import CodeEditor from './CodeEditor.vue';

const props = defineProps({
	initialHtml: {
		type: String,
		default: '<h1>Hello, world!</h1>\n<p>Edit the HTML, CSS, and JS panes, then press Run.</p>',
	},
	initialCss: {
		type: String,
		default: 'h1 {\n\tcolor: #3451b2;\n}\n',
	},
	initialJs: {
		type: String,
		default: 'console.log("Hello from the sandboxed preview!");\n',
	},
	previewHeight: {
		type: String,
		default: '260px',
	},
	// Which editor panes to show. A single-language lesson (e.g. HTML-only,
	// or CSS-only against fixed HTML) passes just the one it teaches.
	panes: {
		type: Array,
		default: () => ['html', 'css', 'javascript'],
	},
	// 'stacked' (editor above preview) is the default used by every lesson
	// page. 'side-by-side' is an opt-in for a wide, full-width placement
	// (currently just the homepage's "Try it right now" section) — it still
	// falls back to stacked below 900px, same as every other responsive
	// layout in this project.
	layout: {
		type: String,
		default: 'stacked',
	},
	// 'light' matches a real, unstyled browser default (white background,
	// black text) — the correct thing for lessons to demonstrate, since
	// that's genuinely what a learner's own browser shows with no CSS.
	// 'dark' is for a standalone marketing/demo instance (the homepage)
	// where matching the site's own dark theme matters more than showing
	// browser defaults.
	previewTheme: {
		type: String,
		default: 'light',
	},
	// Opt-in only (see Exercise.vue): when true, a small bootstrap script is
	// injected into the generated preview document that reports the
	// resulting DOM/console output back to us via postMessage, and a
	// `graded` event fires with that snapshot. False (the default) means
	// zero behavior change from today for every other usage of this component.
	graded: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['graded']);

const htmlCode = ref(props.initialHtml);
const cssCode = ref(props.initialCss);
const jsCode = ref(props.initialJs);
const previewDoc = ref('');
const iframeEl = ref(null);

let debounceTimer = null;

// Only ever injected when `graded` is true. The iframe stays
// sandbox="allow-scripts" only (no allow-same-origin, unchanged) — this
// script reports out via postMessage, which works fine from an opaque-origin
// iframe, so grading never requires loosening the existing sandbox.
const GRADING_BOOTSTRAP = `
<script>
(function () {
	var consoleOutput = [];
	var originalLog = console.log;
	var originalError = console.error;
	console.log = function () { consoleOutput.push(Array.from(arguments).join(' ')); originalLog.apply(console, arguments); };
	console.error = function () { consoleOutput.push(Array.from(arguments).join(' ')); originalError.apply(console, arguments); };
	var errors = [];
	window.addEventListener('error', function (e) { errors.push(String(e.message)); });
	window.addEventListener('load', function () {
		setTimeout(function () {
			window.parent.postMessage({
				source: 'syntaxia-exercise',
				html: document.body.innerHTML,
				consoleOutput: consoleOutput,
				errors: errors,
			}, '*');
		}, 50);
	});
})();
<\/script>`;

function buildPreviewDocument() {
	const darkBase = props.previewTheme === 'dark'
		? 'body{background:#111827;color:#e2e8f0;font-family:system-ui,sans-serif;}a{color:#34ebd5;}'
		: '';
	return `<!doctype html>
<html>
<head><meta charset="utf-8"><style>${darkBase}${cssCode.value}</style></head>
<body>${htmlCode.value}
<script>${jsCode.value}<\/script>
${props.graded ? GRADING_BOOTSTRAP : ''}
</body>
</html>`;
}

function runPreview() {
	previewDoc.value = buildPreviewDocument();
}

function onGradingMessage(event) {
	if (event.source !== iframeEl.value?.contentWindow) return;
	if (event.data?.source !== 'syntaxia-exercise') return;
	emit('graded', { html: event.data.html, consoleOutput: event.data.consoleOutput, errors: event.data.errors });
}

onMounted(() => {
	if (props.graded) window.addEventListener('message', onGradingMessage);
});

function scheduleAutoRun() {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(runPreview, 600);
}

onBeforeUnmount(() => {
	clearTimeout(debounceTimer);
	if (props.graded) window.removeEventListener('message', onGradingMessage);
});

runPreview();

// --- Resizable split, side-by-side layout only ---
// A draggable separator between the two panes, so the split doesn't have
// to stay a fixed 50/50. Pointer Events cover mouse and touch in one code
// path. Clamped to 20-80% so neither pane can be dragged down to nothing.
const containerRef = ref(null);
const editorWidthPercent = ref(50);
let resizing = false;

function clampPercent(value) {
	return Math.min(80, Math.max(20, value));
}

function onResizeMove(event) {
	if (!resizing || !containerRef.value) return;
	const rect = containerRef.value.getBoundingClientRect();
	const percent = ((event.clientX - rect.left) / rect.width) * 100;
	editorWidthPercent.value = clampPercent(percent);
}

function stopResize() {
	resizing = false;
	document.removeEventListener('pointermove', onResizeMove);
	document.removeEventListener('pointerup', stopResize);
}

function startResize(event) {
	event.preventDefault();
	resizing = true;
	document.addEventListener('pointermove', onResizeMove);
	document.addEventListener('pointerup', stopResize);
}

// Keyboard equivalent for the same separator, per the WAI-ARIA separator
// pattern: Left/Right (or Up/Down) nudge the split, since dragging alone
// isn't operable from a keyboard.
function onResizerKeydown(event) {
	const step = 4;
	if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
		editorWidthPercent.value = clampPercent(editorWidthPercent.value - step);
		event.preventDefault();
	} else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
		editorWidthPercent.value = clampPercent(editorWidthPercent.value + step);
		event.preventDefault();
	}
}

onBeforeUnmount(() => {
	document.removeEventListener('pointermove', onResizeMove);
	document.removeEventListener('pointerup', stopResize);
});
</script>

<template>
	<div
		ref="containerRef"
		class="web-playground"
		:class="{ 'web-playground--side-by-side': layout === 'side-by-side' }"
	>
		<div
			class="web-playground__editors"
			:style="layout === 'side-by-side' ? { flex: `0 0 ${editorWidthPercent}%` } : {}"
		>
			<section v-if="panes.includes('html')" class="web-playground__pane">
				<h4 class="web-playground__pane-title">HTML</h4>
				<CodeEditor
					v-model="htmlCode"
					language="html"
					label="HTML code editor"
					min-height="120px"
					@update:modelValue="scheduleAutoRun"
				/>
			</section>
			<section v-if="panes.includes('css')" class="web-playground__pane">
				<h4 class="web-playground__pane-title">CSS</h4>
				<CodeEditor
					v-model="cssCode"
					language="css"
					label="CSS code editor"
					min-height="120px"
					@update:modelValue="scheduleAutoRun"
				/>
			</section>
			<section v-if="panes.includes('javascript')" class="web-playground__pane">
				<h4 class="web-playground__pane-title">JavaScript</h4>
				<CodeEditor
					v-model="jsCode"
					language="javascript"
					label="JavaScript code editor"
					min-height="120px"
					@update:modelValue="scheduleAutoRun"
				/>
			</section>
			<!--
				Side-by-side is used with auto-run only: with the two panes
				sitting flush against each other, an explicit Run button would
				break the matched-height split and isn't needed since typing
				already triggers scheduleAutoRun.
			-->
			<button v-if="layout !== 'side-by-side'" type="button" class="web-playground__run" @click="runPreview">
				Run
			</button>
		</div>

		<!--
			Draggable divider. A "complex interactive widget with no native
			HTML equivalent" per this project's own accessibility convention,
			so a real ARIA separator role, with keyboard support, is the
			correct (not excessive) use of ARIA here.
		-->
		<div
			v-if="layout === 'side-by-side'"
			class="web-playground__resizer"
			role="separator"
			aria-orientation="vertical"
			:aria-valuenow="Math.round(editorWidthPercent)"
			aria-valuemin="20"
			aria-valuemax="80"
			aria-label="Resize the editor and preview panes"
			tabindex="0"
			@pointerdown="startResize"
			@keydown="onResizerKeydown"
		></div>

		<div
			class="web-playground__preview"
			:class="{ 'web-playground__preview--dark': previewTheme === 'dark' }"
			:style="layout === 'side-by-side' ? { flex: `1 1 ${100 - editorWidthPercent}%` } : {}"
		>
			<h4 class="web-playground__pane-title">Preview</h4>
			<iframe
				ref="iframeEl"
				class="web-playground__frame"
				:class="{ 'web-playground__frame--dark': previewTheme === 'dark' }"
				:style="{ height: previewHeight }"
				:srcdoc="previewDoc"
				sandbox="allow-scripts"
				title="Live preview of your code"
			></iframe>
		</div>
	</div>
</template>

<style scoped>
.web-playground {
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin: 24px 0;
	text-align: left;
}

/* No outer margin and no gap between panes: this variant is meant to read
   as one flush, edge-to-edge split widget, not a spaced-out block. */
.web-playground--side-by-side {
	flex-direction: column;
	margin: 0;
	gap: 0;
}

.web-playground--side-by-side .web-playground__pane {
	margin-bottom: 0;
}

.web-playground__resizer {
	display: none;
}

@media (min-width: 900px) {
	.web-playground--side-by-side {
		flex-direction: row;
		align-items: stretch;
		gap: 0;
	}

	.web-playground--side-by-side .web-playground__editors,
	.web-playground--side-by-side .web-playground__preview {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	/* Editor pane stretches to fill the same height as the preview column
	   (set by the iframe's own height below), instead of sizing to its
	   own min-height and leaving the rest of the column empty. */
	.web-playground--side-by-side .web-playground__pane {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.web-playground--side-by-side .web-playground__pane :deep(.code-editor),
	.web-playground--side-by-side .web-playground__pane :deep(.code-editor__host) {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.web-playground--side-by-side .web-playground__pane :deep(.cm-editor) {
		flex: 1;
		height: 100%;
	}

	/* Square corners, no border: touching the resizer/section edges flush
	   on every side, rather than sitting in its own bordered, rounded card. */
	.web-playground--side-by-side .web-playground__pane :deep(.code-editor) {
		border: none;
		border-radius: 0;
	}

	.web-playground--side-by-side .web-playground__frame {
		height: 100% !important;
		min-height: 320px;
		border: none;
		border-radius: 0;
	}

	/*
	 * The grip (the pill in ::after) is the point: a plain color-changing
	 * bar reads as a divider, not a control. A visible handle, styled after
	 * a scrollbar thumb / bottom-sheet drag handle, makes "this is an
	 * adjustable input, drag it" obvious without needing a label.
	 */
	.web-playground--side-by-side .web-playground__resizer {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 14px;
		width: 14px;
		cursor: col-resize;
		background: var(--vp-c-bg-soft);
		touch-action: none;
	}

	.web-playground--side-by-side .web-playground__resizer::after {
		content: '';
		width: 4px;
		height: 36px;
		border-radius: 2px;
		background: var(--vp-c-text-3);
		transition: background-color 0.15s ease;
	}

	.web-playground--side-by-side .web-playground__resizer:hover,
	.web-playground--side-by-side .web-playground__resizer:focus-visible {
		background: var(--vp-c-bg-elv);
		outline: none;
	}

	.web-playground--side-by-side .web-playground__resizer:hover::after,
	.web-playground--side-by-side .web-playground__resizer:focus-visible::after {
		background: var(--color-brand-500);
	}
}

.web-playground__pane {
	margin-bottom: 12px;
}

.web-playground__pane-title {
	margin: 0 0 6px;
	font-size: var(--font-size-xs);
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.04em;
	color: var(--vp-c-text-2);
}

.web-playground__run {
	display: inline-flex;
	align-items: center;
	padding: 8px 16px;
	border: none;
	border-radius: 6px;
	background: var(--color-brand-400);
	color: var(--color-navy-900);
	font-weight: 600;
	cursor: pointer;
}

.web-playground__run:hover {
	background: var(--color-brand-500);
}

.web-playground__run:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.web-playground__preview {
	display: flex;
	flex-direction: column;
}

.web-playground__frame {
	width: 100%;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background: #fff;
}

.web-playground__frame--dark {
	background: #111827;
}
</style>
