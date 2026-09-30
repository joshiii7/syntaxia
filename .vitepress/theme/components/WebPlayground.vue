<script setup>
/**
 * HTML/CSS/JS lesson playground: three CodeMirror editors plus a sandboxed
 * iframe preview beside them. The preview iframe is rebuilt from srcdoc, so
 * the user's script never runs in the site's own origin/context.
 */
import { computed, onBeforeUnmount, onMounted, ref, useId, useSlots, watch } from 'vue';
import CodeEditor from './CodeEditor.vue';
import PlaygroundConsole from './PlaygroundConsole.vue';

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
	// layout in this project. 'workspace' fills its container edge to edge
	// (the full-viewport final project pages): a toolbar, file tabs over the editor
	// on the left, Result/Console tabs on the right, a draggable divider
	// between them, and a Code/Result toggle below 768px.
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
	// Opt-in console panel under the preview (the JavaScript track uses it):
	// console.log/info/warn/error calls and uncaught errors from the preview
	// show up here, so learners don't need the browser's developer tools.
	showConsole: {
		type: Boolean,
		default: false,
	},
	// How long after the page's load event a graded snapshot is taken, in
	// milliseconds. Raise it when the code being graded finishes something
	// asynchronously (a fetch, a timer) after the page loads.
	gradeDelay: {
		type: Number,
		default: 50,
	},
	// For examples that only print to the console: the preview iframe still
	// runs the code, it just isn't shown. Only meaningful with showConsole.
	hidePreview: {
		type: Boolean,
		default: false,
	},
	// Workspace layout only: the label of the optional third tab in the
	// right pane, filled by the `extra-tab` slot (Exercise.vue's checklist).
	extraTabLabel: {
		type: String,
		default: 'Checks',
	},
});

const emit = defineEmits(['graded']);
const slots = useSlots();

const htmlCode = ref(props.initialHtml);
const cssCode = ref(props.initialCss);
const jsCode = ref(props.initialJs);
const previewDoc = ref('');
const iframeEl = ref(null);
const consoleLines = ref([]);

// Cap on stored console lines, so an accidental infinite loop that logs
// can't grow the page without bound.
const MAX_CONSOLE_LINES = 500;

let debounceTimer = null;
// Increments per run and is baked into the preview document, so a message
// the previous document sent just before it was replaced can't leak into
// the new run's console. A counter (not a random id) keeps the server and
// client srcdoc identical for hydration.
let runCount = 0;

// Only ever injected when `graded` or `showConsole` is true. The iframe
// stays sandbox="allow-scripts" only (no allow-same-origin, unchanged): the
// script reports out via postMessage, which works fine from an opaque-origin
// iframe, so neither feature requires loosening the sandbox. It goes in the
// <head>, ahead of the learner's script, so console calls made while that
// script first runs are captured too, and so it never shows up in the
// body.innerHTML snapshot that graded checks read.
function captureBootstrap(runId) {
	return `<script>
(function () {
	var RUN = ${runId};
	var LIVE = ${props.showConsole};
	var GRADED = ${props.graded};
	var consoleOutput = [];
	var errors = [];

	function isIdentifier(key) {
		return /^[A-Za-z_$][\\w$]*$/.test(key);
	}

	function format(value, depth, seen) {
		if (typeof value === 'string') return depth ? JSON.stringify(value) : value;
		if (value === null) return 'null';
		if (value === undefined) return 'undefined';
		if (typeof value === 'bigint') return value + 'n';
		if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'symbol') return String(value);
		if (typeof value === 'function') return 'f ' + (value.name || 'anonymous') + '()';
		if (value instanceof Error) return value.name + ': ' + value.message;
		if (value instanceof Date) return value.toString();
		if (value instanceof Promise) return 'Promise {...}';
		// Windows are checked before anything reads their properties: the
		// parent page is cross-origin here, and touching it throws.
		if (value.window === value) return 'Window {...}';
		if (typeof Document !== 'undefined' && value instanceof Document) return '#document';
		if (typeof Text !== 'undefined' && value instanceof Text) return '#text ' + JSON.stringify(value.data);
		if (typeof Element !== 'undefined' && value instanceof Element) {
			var tag = '<' + value.tagName.toLowerCase();
			if (value.id) tag += ' id="' + value.id + '"';
			if (value.className && typeof value.className === 'string') tag += ' class="' + value.className + '"';
			return tag + '>';
		}
		if (seen.indexOf(value) !== -1) return '[Circular]';
		if (depth > 2) return Array.isArray(value) ? '[...]' : '{...}';
		seen = seen.concat([value]);
		if (Array.isArray(value) || (typeof NodeList !== 'undefined' && value instanceof NodeList)) {
			var prefix = Array.isArray(value) ? '' : 'NodeList(' + value.length + ') ';
			return prefix + '[' + Array.prototype.map.call(value, function (item) { return format(item, depth + 1, seen); }).join(', ') + ']';
		}
		if (value instanceof Map) {
			var entries = [];
			value.forEach(function (v, k) { entries.push(format(k, depth + 1, seen) + ' => ' + format(v, depth + 1, seen)); });
			return 'Map(' + value.size + ') {' + (entries.length ? ' ' + entries.join(', ') + ' ' : '') + '}';
		}
		if (value instanceof Set) {
			var items = [];
			value.forEach(function (v) { items.push(format(v, depth + 1, seen)); });
			return 'Set(' + value.size + ') {' + (items.length ? ' ' + items.join(', ') + ' ' : '') + '}';
		}
		var keys = Object.keys(value);
		if (!keys.length) return '{}';
		var shown = keys.slice(0, 20).map(function (key) {
			return (isIdentifier(key) ? key : JSON.stringify(key)) + ': ' + format(value[key], depth + 1, seen);
		});
		if (keys.length > 20) shown.push('...');
		return '{ ' + shown.join(', ') + ' }';
	}

	// Formatting must never break the learner's code: anything unexpected
	// falls back to plain String().
	function safeFormat(value) {
		try {
			return format(value, 0, []);
		} catch (error) {
			try { return String(value); } catch (stringError) { return '[unprintable value]'; }
		}
	}

	function record(level, text) {
		consoleOutput.push(text);
		if (LIVE) window.parent.postMessage({ source: 'syntaxia-console', run: RUN, level: level, text: text }, '*');
	}

	['log', 'info', 'warn', 'error'].forEach(function (level) {
		var original = console[level];
		console[level] = function () {
			var text = Array.prototype.map.call(arguments, safeFormat).join(' ');
			record(level, text);
			original.apply(console, arguments);
		};
	});

	window.addEventListener('error', function (event) {
		var message = String(event.message).replace(/^Uncaught /, '');
		errors.push(String(event.message));
		if (LIVE) window.parent.postMessage({ source: 'syntaxia-console', run: RUN, level: 'error', text: 'Uncaught ' + message }, '*');
	});

	window.addEventListener('unhandledrejection', function (event) {
		var text = 'Uncaught (in promise) ' + safeFormat(event.reason);
		errors.push(text);
		if (LIVE) window.parent.postMessage({ source: 'syntaxia-console', run: RUN, level: 'error', text: text }, '*');
	});

	if (GRADED) {
		window.addEventListener('load', function () {
			setTimeout(function () {
				window.parent.postMessage({
					source: 'syntaxia-exercise',
					html: document.body.innerHTML,
					consoleOutput: consoleOutput,
					errors: errors,
				}, '*');
			}, ${props.gradeDelay});
		});
	}
})();
<\/script>`;
}

function buildPreviewDocument() {
	const darkBase = props.previewTheme === 'dark'
		? 'body{background:#111827;color:#e2e8f0;font-family:system-ui,sans-serif;}a{color:#34ebd5;}'
		: '';
	const bootstrap = props.graded || props.showConsole ? captureBootstrap(runCount) : '';
	return `<!doctype html>
<html>
<head><meta charset="utf-8">${bootstrap}<style>${darkBase}${cssCode.value}</style></head>
<body>${htmlCode.value}
<script>${jsCode.value}<\/script>
</body>
</html>`;
}

function runPreview() {
	runCount += 1;
	consoleLines.value = [];
	previewDoc.value = buildPreviewDocument();
}

function onPreviewMessage(event) {
	if (event.source !== iframeEl.value?.contentWindow) return;
	const data = event.data;
	if (props.graded && data?.source === 'syntaxia-exercise') {
		emit('graded', { html: data.html, consoleOutput: data.consoleOutput, errors: data.errors });
	} else if (props.showConsole && data?.source === 'syntaxia-console' && data.run === runCount) {
		if (consoleLines.value.length >= MAX_CONSOLE_LINES) return;
		consoleLines.value.push({ level: data.level, text: data.text });
	}
}

onMounted(() => {
	if (props.graded || props.showConsole) window.addEventListener('message', onPreviewMessage);
});

function scheduleAutoRun() {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(runPreview, 600);
}

onBeforeUnmount(() => {
	clearTimeout(debounceTimer);
	window.removeEventListener('message', onPreviewMessage);
});

runPreview();

// --- Resizable split, side-by-side and workspace layouts ---
// A draggable separator between the two panes, so the split doesn't have
// to stay a fixed 50/50. Pointer Events cover mouse and touch in one code
// path. Clamped to 20-80% so neither pane can be dragged down to nothing.
const containerRef = ref(null);
const editorWidthPercent = ref(50);
// While dragging, the preview iframe stops taking pointer events: otherwise
// it swallows pointermove as soon as the cursor crosses into it, and the
// divider sticks.
const isResizing = ref(false);

function clampPercent(value) {
	return Math.min(80, Math.max(20, value));
}

function onResizeMove(event) {
	if (!isResizing.value || !containerRef.value) return;
	const rect = containerRef.value.getBoundingClientRect();
	const percent = ((event.clientX - rect.left) / rect.width) * 100;
	editorWidthPercent.value = clampPercent(percent);
}

function stopResize() {
	isResizing.value = false;
	document.removeEventListener('pointermove', onResizeMove);
	document.removeEventListener('pointerup', stopResize);
}

function startResize(event) {
	event.preventDefault();
	isResizing.value = true;
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

// --- Workspace layout only ---

const FILE_NAMES = { html: 'index.html', css: 'style.css', javascript: 'script.js' };
const LANGUAGE_LABELS = { html: 'HTML', css: 'CSS', javascript: 'JavaScript' };

// Left pane: an optional Instructions tab (the `instructions` slot), then one
// tab per editor pane. Right pane: Result, then Console and the extra tab
// when they're in use.
const leftTabs = computed(() => [
	...(slots.instructions ? [{ id: 'instructions', label: 'Instructions' }] : []),
	...props.panes.map((pane) => ({ id: pane, label: FILE_NAMES[pane] })),
]);
const rightTabs = computed(() => [
	{ id: 'result', label: 'Result' },
	...(props.showConsole ? [{ id: 'console', label: 'Console' }] : []),
	...(slots['extra-tab'] ? [{ id: 'extra', label: props.extraTabLabel }] : []),
]);
const leftTab = ref(leftTabs.value[0]?.id);
const rightTab = ref('result');
const tabsId = useId();

const codeFor = { html: htmlCode, css: cssCode, javascript: jsCode };

// WAI-ARIA tabs keyboard pattern: arrow keys (and Home/End) move between
// tabs in the same list and select them, since only the selected tab sits
// in the Tab order.
function onTabKeydown(event, tabs, current, select) {
	const index = tabs.findIndex((tab) => tab.id === current);
	let next = null;
	if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
	else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
	else if (event.key === 'Home') next = 0;
	else if (event.key === 'End') next = tabs.length - 1;
	if (next === null) return;
	event.preventDefault();
	select(tabs[next].id);
	event.currentTarget.parentElement.children[next]?.focus();
}

// Below 768px the two panes don't fit side by side, so the toolbar shows a
// Code/Result toggle and only one pane at a time.
const isNarrow = ref(false);
const narrowView = ref('code');
let narrowQuery = null;

function updateNarrow() {
	isNarrow.value = narrowQuery.matches;
}

// The split position is remembered for the rest of the visit, including a
// reload, in sessionStorage. Storage can be blocked (private modes, some
// embeds); the split then just resets to 50/50, which is fine.
const SPLIT_KEY = 'syntaxia-workspace-split';

onMounted(() => {
	if (props.layout !== 'workspace') return;
	narrowQuery = window.matchMedia('(max-width: 767px)');
	updateNarrow();
	narrowQuery.addEventListener('change', updateNarrow);
	try {
		const saved = Number(sessionStorage.getItem(SPLIT_KEY));
		if (saved) editorWidthPercent.value = clampPercent(saved);
	} catch {
		// Storage unavailable: keep the default split.
	}
});

watch(editorWidthPercent, (percent) => {
	if (props.layout !== 'workspace') return;
	try {
		sessionStorage.setItem(SPLIT_KEY, String(Math.round(percent)));
	} catch {
		// Storage unavailable: the split just won't survive a reload.
	}
});

onBeforeUnmount(() => {
	narrowQuery?.removeEventListener('change', updateNarrow);
});

// Reset puts every file back to its starting code. It's a two-step button
// (the first press asks, the second resets) so one stray click can't throw
// away someone's work, without a blocking confirm() pop-up.
const confirmingReset = ref(false);
let resetTimer = null;

function onResetClick() {
	if (!confirmingReset.value) {
		confirmingReset.value = true;
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			confirmingReset.value = false;
		}, 4000);
		return;
	}
	clearTimeout(resetTimer);
	confirmingReset.value = false;
	htmlCode.value = props.initialHtml;
	cssCode.value = props.initialCss;
	jsCode.value = props.initialJs;
	runPreview();
}

onBeforeUnmount(() => {
	clearTimeout(resetTimer);
});
</script>

<template>
	<!-- Workspace layout: the full-viewport final project playground. -->
	<div
		v-if="layout === 'workspace'"
		class="workspace"
		:class="{ 'workspace--narrow': isNarrow, 'workspace--resizing': isResizing }"
	>
		<div class="workspace__toolbar">
			<div class="workspace__toolbar-start">
				<slot name="toolbar-start" />
			</div>

			<div v-if="isNarrow" class="workspace__view-toggle" role="group" aria-label="Show">
				<button type="button" class="workspace__button" :aria-pressed="narrowView === 'code'" @click="narrowView = 'code'">Code</button>
				<button type="button" class="workspace__button" :aria-pressed="narrowView === 'result'" @click="narrowView = 'result'">Result</button>
			</div>

			<div class="workspace__toolbar-end">
				<slot name="toolbar-end" />
				<button type="button" class="workspace__button" @click="onResetClick">
					{{ confirmingReset ? 'Click again to reset' : 'Reset' }}
				</button>
				<button type="button" class="workspace__button workspace__button--primary" @click="runPreview">Run</button>
			</div>
		</div>

		<div ref="containerRef" class="workspace__panes">
			<section
				v-show="!isNarrow || narrowView === 'code'"
				class="workspace__pane"
				aria-label="Code"
				:style="isNarrow ? {} : { flex: `0 0 ${editorWidthPercent}%` }"
			>
				<div class="workspace__tabs" role="tablist" aria-label="Files">
					<button
						v-for="tab in leftTabs"
						:id="`${tabsId}-left-${tab.id}`"
						:key="tab.id"
						type="button"
						role="tab"
						class="workspace__tab"
						:aria-selected="leftTab === tab.id"
						:aria-controls="`${tabsId}-left-panel-${tab.id}`"
						:tabindex="leftTab === tab.id ? 0 : -1"
						@click="leftTab = tab.id"
						@keydown="onTabKeydown($event, leftTabs, leftTab, (id) => (leftTab = id))"
					>
						{{ tab.label }}
					</button>
				</div>

				<div
					v-if="$slots.instructions"
					v-show="leftTab === 'instructions'"
					:id="`${tabsId}-left-panel-instructions`"
					role="tabpanel"
					:aria-labelledby="`${tabsId}-left-instructions`"
					tabindex="0"
					class="workspace__panel workspace__instructions vp-doc"
				>
					<slot name="instructions" />
				</div>

				<!-- Every editor stays mounted (v-show), so switching tabs keeps each file's undo history and cursor. -->
				<div
					v-for="pane in panes"
					v-show="leftTab === pane"
					:id="`${tabsId}-left-panel-${pane}`"
					:key="pane"
					role="tabpanel"
					:aria-labelledby="`${tabsId}-left-${pane}`"
					class="workspace__panel workspace__panel--editor"
				>
					<CodeEditor
						v-model="codeFor[pane].value"
						:language="pane"
						:label="`${LANGUAGE_LABELS[pane]} code editor, ${FILE_NAMES[pane]}`"
						min-height="100%"
						@update:modelValue="scheduleAutoRun"
					/>
				</div>
			</section>

			<!-- Same ARIA separator as the side-by-side layout below. -->
			<div
				v-if="!isNarrow"
				class="workspace__resizer"
				role="separator"
				aria-orientation="vertical"
				:aria-valuenow="Math.round(editorWidthPercent)"
				aria-valuemin="20"
				aria-valuemax="80"
				aria-label="Resize the code and result panes"
				tabindex="0"
				@pointerdown="startResize"
				@keydown="onResizerKeydown"
			></div>

			<section
				v-show="!isNarrow || narrowView === 'result'"
				class="workspace__pane workspace__pane--output"
				aria-label="Output"
			>
				<div class="workspace__tabs" role="tablist" aria-label="Output">
					<button
						v-for="tab in rightTabs"
						:id="`${tabsId}-right-${tab.id}`"
						:key="tab.id"
						type="button"
						role="tab"
						class="workspace__tab"
						:aria-selected="rightTab === tab.id"
						:aria-controls="`${tabsId}-right-panel-${tab.id}`"
						:tabindex="rightTab === tab.id ? 0 : -1"
						@click="rightTab = tab.id"
						@keydown="onTabKeydown($event, rightTabs, rightTab, (id) => (rightTab = id))"
					>
						{{ tab.label }}
						<span v-if="tab.id === 'console' && consoleLines.length" class="workspace__tab-count">{{ consoleLines.length }}</span>
					</button>
				</div>

				<!-- The preview stays mounted while another tab is shown: it's what runs the code. -->
				<div
					v-show="rightTab === 'result'"
					:id="`${tabsId}-right-panel-result`"
					role="tabpanel"
					:aria-labelledby="`${tabsId}-right-result`"
					class="workspace__panel workspace__panel--result"
				>
					<iframe
						ref="iframeEl"
						class="workspace__frame"
						:srcdoc="previewDoc"
						sandbox="allow-scripts"
						title="Live preview of your code"
					></iframe>
				</div>

				<div
					v-if="showConsole"
					v-show="rightTab === 'console'"
					:id="`${tabsId}-right-panel-console`"
					role="tabpanel"
					:aria-labelledby="`${tabsId}-right-console`"
					class="workspace__panel workspace__panel--console"
				>
					<PlaygroundConsole :lines="consoleLines" :show-title="false" />
				</div>

				<div
					v-if="$slots['extra-tab']"
					v-show="rightTab === 'extra'"
					:id="`${tabsId}-right-panel-extra`"
					role="tabpanel"
					:aria-labelledby="`${tabsId}-right-extra`"
					tabindex="0"
					class="workspace__panel workspace__panel--extra"
				>
					<slot name="extra-tab" />
				</div>
			</section>
		</div>
	</div>

	<div
		v-else
		ref="containerRef"
		class="web-playground"
		:class="{ 'web-playground--side-by-side': layout === 'side-by-side', 'web-playground--resizing': isResizing }"
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
			<!--
				hidePreview keeps the iframe in the DOM (it's what runs the
				code) but out of sight and out of the tab order.
			-->
			<h4 v-if="!(hidePreview && showConsole)" class="web-playground__pane-title">Preview</h4>
			<iframe
				ref="iframeEl"
				class="web-playground__frame"
				:class="{
					'web-playground__frame--dark': previewTheme === 'dark',
					'web-playground__frame--hidden': hidePreview && showConsole,
				}"
				:style="{ height: previewHeight }"
				:srcdoc="previewDoc"
				sandbox="allow-scripts"
				title="Live preview of your code"
				:tabindex="hidePreview && showConsole ? -1 : undefined"
			></iframe>

			<PlaygroundConsole v-if="showConsole" class="web-playground__console" :lines="consoleLines" />
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

.web-playground__frame--hidden {
	display: none;
}

.web-playground__console {
	margin-top: 12px;
}

.web-playground--resizing .web-playground__frame {
	pointer-events: none;
}

/*
 * Workspace layout. Fills whatever box its parent gives it (the final project
 * page makes that box the whole viewport below the header). Styled like a
 * code editor's chrome rather than a lesson card: 1px dividers, small
 * toolbar text, no shadows or rounded panels, only existing theme tokens.
 */
.workspace {
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 0;
	background: var(--vp-c-bg);
	color: var(--vp-c-text-1);
	text-align: left;
}

.workspace__toolbar {
	display: flex;
	flex: none;
	align-items: center;
	gap: 12px;
	min-height: 40px;
	padding: 4px 12px;
	border-bottom: 1px solid var(--vp-c-divider);
	font-size: var(--font-size-xs);
}

.workspace__toolbar-start {
	display: flex;
	flex: 1 1 auto;
	align-items: center;
	gap: 12px;
	min-width: 0;
}

.workspace__toolbar-end {
	display: flex;
	flex: none;
	align-items: center;
	gap: 8px;
	margin-left: auto;
}

.workspace__view-toggle {
	display: flex;
	gap: 4px;
}

/* On a phone the toolbar can't fit everything on one line, so it wraps:
   title and back link on the first row, the toggle and actions below. */
.workspace--narrow .workspace__toolbar {
	flex-wrap: wrap;
	row-gap: 6px;
}

.workspace--narrow .workspace__toolbar-start {
	flex-basis: 100%;
}

.workspace__button {
	padding: 2px 10px;
	font: inherit;
	font-size: var(--font-size-xs);
	font-weight: 500;
	line-height: 22px;
	color: var(--vp-c-text-1);
	background: transparent;
	border: 1px solid var(--vp-c-divider);
	border-radius: 4px;
	cursor: pointer;
	white-space: nowrap;
}

.workspace__button:hover {
	border-color: var(--vp-c-text-3);
}

.workspace__button[aria-pressed='true'] {
	color: var(--vp-c-brand-1);
	border-color: var(--vp-c-brand-1);
	background: var(--vp-c-bg-soft);
}

.workspace__button--primary {
	color: var(--color-navy-900);
	background: var(--color-brand-400);
	border-color: var(--color-brand-400);
}

.workspace__button--primary:hover {
	background: var(--color-brand-500);
	border-color: var(--color-brand-500);
}

.workspace__button:focus-visible,
.workspace__tab:focus-visible,
.workspace__panel:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: -2px;
}

.workspace__panes {
	display: flex;
	flex: 1 1 auto;
	min-height: 0;
}

.workspace__pane {
	display: flex;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
}

.workspace__pane--output,
.workspace--narrow .workspace__pane {
	flex: 1 1 0;
}

.workspace__tabs {
	display: flex;
	flex: none;
	overflow-x: auto;
	border-bottom: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg-soft);
}

.workspace__tab {
	margin-bottom: -1px;
	padding: 6px 14px;
	font: inherit;
	font-size: var(--font-size-xs);
	color: var(--vp-c-text-2);
	background: none;
	border: 0;
	border-bottom: 2px solid transparent;
	cursor: pointer;
	white-space: nowrap;
}

.workspace__tab:hover {
	color: var(--vp-c-text-1);
}

.workspace__tab[aria-selected='true'] {
	color: var(--vp-c-text-1);
	background: var(--vp-c-bg);
	border-bottom-color: var(--vp-c-brand-1);
}

.workspace__tab-count {
	margin-left: 4px;
	padding: 0 6px;
	border-radius: 8px;
	background: var(--vp-c-default-soft);
	font-size: var(--font-size-3xs);
}

/* Each panel scrolls on its own; the page itself never does. */
.workspace__panel {
	flex: 1 1 auto;
	min-height: 0;
	overflow: auto;
}

.workspace__instructions {
	padding: 16px 24px 40px;
}

.workspace__panel--editor {
	overflow: hidden;
}

.workspace__panel--editor :deep(.code-editor) {
	height: 100%;
	border: 0;
	border-radius: 0;
}

.workspace__panel--editor :deep(.code-editor__host),
.workspace__panel--editor :deep(.cm-editor) {
	height: 100%;
}

.workspace__panel--result {
	overflow: hidden;
}

/* White like a real, unstyled browser page, same as the stacked preview. */
.workspace__frame {
	display: block;
	width: 100%;
	height: 100%;
	border: 0;
	background: #fff;
}

.workspace--resizing .workspace__frame {
	pointer-events: none;
}

.workspace__panel--console {
	display: flex;
}

.workspace__panel--console :deep(.playground-console) {
	flex: 1;
}

.workspace__panel--console :deep(.playground-console__output) {
	max-height: none;
	height: 100%;
	border: 0;
	border-radius: 0;
}

.workspace__panel--extra {
	padding: 12px 16px;
}

/* A 1px line to look at, with a wider invisible strip (::before) to grab. */
.workspace__resizer {
	position: relative;
	flex: 0 0 1px;
	background: var(--vp-c-divider);
	cursor: col-resize;
	touch-action: none;
}

.workspace__resizer::before {
	content: '';
	position: absolute;
	inset: 0 -4px;
	z-index: 1;
}

.workspace__resizer:hover,
.workspace--resizing .workspace__resizer {
	background: var(--color-brand-500);
}

.workspace__resizer:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 1px;
}
</style>
