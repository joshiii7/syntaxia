<script setup>
/**
 * FAQ accordion, ported from portfolio/js/main.js's initAccordion and
 * shared by the home page and the Lessons page: one question open at a
 * time, with a real height animation (JS measures scrollHeight, transitions
 * to it, then swaps to `auto` once open) rather than a plain instant native
 * <details> toggle.
 *
 * An item can carry an optional `link` ({ href, text }) shown after its
 * answer; a root-relative href goes through withBase().
 *
 * The item background comes from --faq-item-bg, so a parent section on a
 * raised surface band can set it to --color-surface-card and keep the
 * items standing apart from the band.
 */
import { ref } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps({
	items: { type: Array, required: true },
	// Keeps trigger/panel ids unique if two accordions share a page.
	idPrefix: { type: String, default: 'faq' },
});

// The first question starts open. Its panel gets `height: auto` from the
// .is-open class (no inline height yet), so it renders open in the
// prerendered HTML too, and collapsePanel still measures it correctly.
const openIndex = ref(0);
const panelRefs = ref([]);

function setPanelRef(el, index) {
	if (el) panelRefs.value[index] = el;
}

function linkHref(href) {
	return href.startsWith('/') ? withBase(href) : href;
}

function clearPendingHeightListener(panel) {
	if (panel._pendingHeightListener) {
		panel.removeEventListener('transitionend', panel._pendingHeightListener);
		panel._pendingHeightListener = null;
	}
}

// Height can't be transitioned to/from `auto` directly: expand to a
// measured pixel value, then swap to `auto` once the transition ends, so
// it stays reflow-safe if the panel's content ever changes size later.
function expandPanel(panel) {
	clearPendingHeightListener(panel);
	panel.style.height = `${panel.scrollHeight}px`;
	const onEnd = (event) => {
		if (event.propertyName !== 'height') return;
		panel.style.height = 'auto';
		panel.removeEventListener('transitionend', onEnd);
		panel._pendingHeightListener = null;
	};
	panel._pendingHeightListener = onEnd;
	panel.addEventListener('transitionend', onEnd);
}

// Pin the current rendered height as a pixel value first, forcing a
// reflow so the browser registers it, then drop to 0, so the collapse
// actually animates instead of snapping shut instantly.
function collapsePanel(panel) {
	clearPendingHeightListener(panel);
	panel.style.height = `${panel.scrollHeight}px`;
	void panel.offsetHeight;
	panel.style.height = '0px';
}

function setOpen(index, isOpen) {
	const panel = panelRefs.value[index];
	if (!panel) return;
	if (isOpen) {
		expandPanel(panel);
	} else {
		collapsePanel(panel);
	}
}

// Accordion behavior: opening one closes whichever other item was open.
function toggle(index) {
	const wasOpen = openIndex.value === index;
	if (openIndex.value !== null && openIndex.value !== index) {
		setOpen(openIndex.value, false);
	}
	openIndex.value = wasOpen ? null : index;
	setOpen(index, !wasOpen);
}
</script>

<template>
	<div class="accordion">
		<div v-for="(item, index) in props.items" :key="item.question" class="accordion-item">
			<h3>
				<button
					:id="`${idPrefix}-trigger-${index}`"
					type="button"
					class="accordion-trigger"
					:aria-expanded="openIndex === index"
					:aria-controls="`${idPrefix}-panel-${index}`"
					@click="toggle(index)"
				>
					<span>{{ item.question }}</span>
					<span class="accordion-icon" aria-hidden="true"></span>
				</button>
			</h3>
			<div
				:id="`${idPrefix}-panel-${index}`"
				class="accordion-panel"
				:class="{ 'is-open': openIndex === index }"
				role="region"
				:aria-labelledby="`${idPrefix}-trigger-${index}`"
				:aria-hidden="openIndex !== index"
				:ref="(el) => setPanelRef(el, index)"
			>
				<p>
					{{ item.answer }}
					<a v-if="item.link" :href="linkHref(item.link.href)" class="accordion-link">{{ item.link.text }}</a>
				</p>
			</div>
		</div>
	</div>
</template>

<style scoped>
.accordion {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.accordion-item {
	background: var(--faq-item-bg, var(--vp-c-bg-soft));
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	overflow: hidden;
}

/* margin/line-height reset too: on the Lessons page this renders inside
   VitePress's .vp-doc, whose h3 rule adds a 32px top margin. */
.accordion-item h3 {
	margin: 0;
	padding: 0;
	border: none;
	font-size: inherit;
	line-height: inherit;
}

.accordion-trigger {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	background: none;
	border: none;
	color: var(--vp-c-text-1);
	font-weight: 600;
	font-size: var(--font-size-body);
	text-align: left;
	padding: 16px 20px;
	cursor: pointer;
}

.accordion-trigger:hover {
	color: var(--vp-c-brand-1);
}

.accordion-trigger:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: -2px;
}

/* Plus-to-minus icon, built from two CSS pseudo-elements rather than an
   icon font or SVG: a horizontal and vertical bar form a plus sign, and
   the vertical bar fades out and rotates when the panel is expanded,
   leaving just the horizontal bar behind as a minus sign. */
.accordion-icon {
	position: relative;
	flex-shrink: 0;
	width: 16px;
	height: 16px;
}

.accordion-icon::before,
.accordion-icon::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	background: var(--vp-c-brand-1);
	transform: translate(-50%, -50%);
	transition: transform 0.2s ease, opacity 0.2s ease;
}

.accordion-icon::before {
	width: 100%;
	height: 2px;
}

.accordion-icon::after {
	width: 2px;
	height: 100%;
}

.accordion-trigger[aria-expanded='true'] .accordion-icon::after {
	opacity: 0;
	transform: translate(-50%, -50%) rotate(90deg);
}

.accordion-panel {
	height: 0;
	overflow: hidden;
	transition: height 0.35s ease;
}

.accordion-panel.is-open {
	height: auto;
}

.accordion-panel p {
	margin: 0;
	padding: 0 20px 18px;
	font-size: var(--font-size-body);
	line-height: var(--line-height-body);
	color: var(--vp-c-text-2);
}

.accordion-link {
	color: var(--vp-c-brand-1);
	font-weight: 600;
	text-decoration: underline;
}

.accordion-link:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
	.accordion-panel {
		/* Not 0/none: a transitionend event still has to fire so the JS step
		   that swaps height to auto after expanding still runs. */
		transition-duration: 0.001s;
	}

	.accordion-icon::before,
	.accordion-icon::after {
		transition: none;
	}
}
</style>
