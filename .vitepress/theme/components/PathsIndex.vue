<script setup>
/**
 * Lists every guided path from paths.ts. Activating one sets it as the
 * active path (useActivePath) and navigates to its first step — from there,
 * LessonSidebar/Breadcrumb/LessonNav all switch into path-view mode.
 *
 * Motion is the home page's (see HomeSections.vue): each path rises in
 * as a `.motion-card` (usePageMotion), and AOS fades the page title in
 * (its data-aos attribute is set in paths/index.md).
 */
import { ref } from 'vue';
import { useRouter, withBase } from 'vitepress';
import { useAos } from '../composables/useAos';
import { usePageMotion } from '../composables/usePageMotion';
import { guidedPaths, resolvePath } from '../data/paths';
import { useActivePath } from '../composables/useActivePath';

const router = useRouter();
const { activatePath } = useActivePath();
const rootEl = ref(null);

useAos();
usePageMotion(rootEl);

function start(pathId) {
	const steps = resolvePath(pathId);
	if (steps.length === 0) return;
	activatePath(pathId);
	router.go(withBase(steps[0].path));
}
</script>

<template>
	<div ref="rootEl">
		<div v-for="path in guidedPaths" :key="path.id" class="paths-index__item motion-card">
			<h2>{{ path.title }}</h2>
			<p>{{ path.description }}</p>
			<button type="button" class="paths-index__start" @click="start(path.id)">Activate this path</button>
		</div>
	</div>
</template>

<style scoped>
.paths-index__item {
	margin-bottom: 32px;
}

.paths-index__start {
	display: inline-flex;
	align-items: center;
	padding: 8px 16px;
	border: none;
	border-radius: 6px;
	background: var(--color-brand-400);
	color: var(--color-navy-900);
	font-weight: 600;
	cursor: pointer;
	transition: background-color 0.2s ease, transform 0.2s ease;
}

/* Same lift as the home page's CTA button (CtaBanner.vue). */
.paths-index__start:hover {
	background: var(--color-brand-500);
	transform: translateY(-1px);
}

.paths-index__start:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}
</style>
