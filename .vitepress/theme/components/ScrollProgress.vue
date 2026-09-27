<script setup>
/**
 * A thin brand-color bar at the top of the page that fills as you scroll,
 * ported from portfolio's ScrollProgressComponent. It only sets a transform
 * (scaleX) from a passive scroll listener, batched to one update per frame,
 * so it needs no animation library. Under reduced motion the CSS hides it
 * and the listeners are removed.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

const bar = ref(null);
let cleanup = null;

onMounted(() => {
	const el = bar.value;
	if (!el) return;
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
	let frame = 0;

	const update = () => {
		frame = 0;
		const max = document.documentElement.scrollHeight - window.innerHeight;
		el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const on = () => {
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		update();
	};
	const off = () => {
		window.removeEventListener('scroll', schedule);
		window.removeEventListener('resize', schedule);
		cancelAnimationFrame(frame);
		frame = 0;
	};
	const sync = () => (reduced.matches ? off() : on());

	reduced.addEventListener('change', sync);
	sync();
	cleanup = () => {
		reduced.removeEventListener('change', sync);
		off();
	};
});

onBeforeUnmount(() => {
	cleanup?.();
});
</script>

<template>
	<div ref="bar" class="scroll-progress" aria-hidden="true"></div>
</template>

<style scoped>
/* Fixed 3px bar above the site header, which style.css raises to
   --vp-z-index-sidebar + 3 on every page, so this sits one above. It starts
   collapsed (scaleX(0)) and only the transform changes as you scroll. */
.scroll-progress {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	height: 3px;
	z-index: calc(var(--vp-z-index-sidebar) + 4);
	background: var(--color-brand-400);
	transform: scaleX(0);
	transform-origin: left center;
	pointer-events: none;
	will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
	.scroll-progress {
		display: none;
	}
}
</style>
