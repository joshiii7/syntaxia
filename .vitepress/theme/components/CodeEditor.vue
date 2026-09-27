<script setup>
/**
 * Reusable CodeMirror 6 code editor, embeddable in lesson Markdown via
 * VitePress's Vue-in-Markdown support. Language mode is configurable so the
 * same component serves HTML/CSS/JS lessons, Python lessons, and a plain
 * text fallback for every other language the book covers.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

const props = defineProps({
	// 'html' | 'css' | 'javascript' | 'python' | 'plaintext'
	language: {
		type: String,
		default: 'plaintext',
	},
	modelValue: {
		type: String,
		default: '',
	},
	readOnly: {
		type: Boolean,
		default: false,
	},
	minHeight: {
		type: String,
		default: '160px',
	},
	// Accessible name for the editor region; announced by screen readers.
	label: {
		type: String,
		default: '',
	},
});

const emit = defineEmits(['update:modelValue']);

const hostEl = ref(null);
let view = null;

const languageCompartment = new Compartment();
const readOnlyCompartment = new Compartment();

function languageExtension(lang) {
	switch (lang) {
		case 'html':
			return html();
		case 'css':
			return css();
		case 'javascript':
			return javascript();
		case 'python':
			return python();
		default:
			return [];
	}
}

function accessibleLabel() {
	if (props.label) return props.label;
	const names = {
		html: 'HTML',
		css: 'CSS',
		javascript: 'JavaScript',
		python: 'Python',
		plaintext: 'Plain text',
	};
	return `${names[props.language] || 'Code'} code editor`;
}

onMounted(() => {
	const state = EditorState.create({
		doc: props.modelValue,
		extensions: [
			basicSetup,
			keymap.of([indentWithTab, ...defaultKeymap]),
			languageCompartment.of(languageExtension(props.language)),
			readOnlyCompartment.of(EditorState.readOnly.of(props.readOnly)),
			oneDark,
			EditorView.contentAttributes.of({ 'aria-label': accessibleLabel() }),
			EditorView.lineWrapping,
			EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					emit('update:modelValue', update.state.doc.toString());
				}
			}),
		],
	});

	view = new EditorView({
		state,
		parent: hostEl.value,
	});
});

onBeforeUnmount(() => {
	view?.destroy();
});

watch(
	() => props.language,
	(lang) => {
		view?.dispatch({
			effects: languageCompartment.reconfigure(languageExtension(lang)),
		});
	},
);

watch(
	() => props.readOnly,
	(readOnly) => {
		view?.dispatch({
			effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly)),
		});
	},
);

watch(
	() => props.modelValue,
	(value) => {
		if (view && value !== view.state.doc.toString()) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: value },
			});
		}
	},
);
</script>

<template>
	<div class="code-editor" :style="{ '--code-editor-min-height': minHeight }">
		<div ref="hostEl" class="code-editor__host"></div>
	</div>
</template>

<style scoped>
.code-editor {
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	overflow: hidden;
}

.code-editor__host :deep(.cm-editor) {
	min-height: var(--code-editor-min-height);
	font-size: var(--font-size-sm);
}

.code-editor__host :deep(.cm-editor.cm-focused) {
	outline: 2px solid var(--color-brand-500);
	outline-offset: -2px;
}

.code-editor__host :deep(.cm-scroller) {
	font-family: var(--vp-font-family-mono);
}
</style>
