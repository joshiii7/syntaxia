<script setup>
/**
 * Mirrors student-exam-portal's ScrollToTopButton: rAF-batched scroll
 * listener (read scrollY in the listener, apply the state change on the
 * next frame, so a long page doesn't force a reflow every scroll tick),
 * shown only past a scroll threshold, and a reduced-motion-aware smooth
 * scroll back to top.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

const SHOW_AFTER_PX = 300;

const visible = ref(false);
let ticking = false;

function applyScrollState() {
	ticking = false;
	visible.value = window.scrollY > SHOW_AFTER_PX;
}

function onScroll() {
	if (!ticking) {
		ticking = true;
		window.requestAnimationFrame(applyScrollState);
	}
}

function scrollToTop() {
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
}

onMounted(() => {
	applyScrollState();
	window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
	window.removeEventListener('scroll', onScroll);
});
</script>

<template>
	<button
		v-if="visible"
		type="button"
		class="scroll-to-top"
		aria-label="Scroll to top"
		@click="scrollToTop"
	>
		<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
			<path d="M12 19V5" />
			<path d="M5 12l7-7 7 7" />
		</svg>
		<span class="scroll-to-top__label">Top</span>
	</button>
</template>

<style scoped>
.scroll-to-top {
	position: fixed;
	right: 24px;
	bottom: 24px;
	z-index: 40;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 2px;
	width: 48px;
	height: 48px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background: var(--vp-c-bg-elv);
	color: var(--vp-c-text-1);
	box-shadow: var(--vp-shadow-3);
	cursor: pointer;
	transition: transform 0.15s ease, background-color 0.15s ease;
}

.scroll-to-top:hover {
	background: var(--vp-c-bg-soft);
	transform: translateY(-2px);
}

.scroll-to-top:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.scroll-to-top__label {
	font-size: var(--font-size-3xs);
	font-weight: 500;
	line-height: 1;
}
</style>
