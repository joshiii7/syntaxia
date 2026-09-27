<script setup>
/**
 * Shell for plain prose pages (Accessibility, Privacy Policy), ported from
 * portfolio's LegalPageComponent + PageBannerComponent: a title banner,
 * then a narrow column of prose with a "last updated" date and a closing
 * contact line. The page's own sections come in through the default slot
 * as plain markdown (see accessibility.md / privacy.md).
 *
 * Portfolio's banner puts a photo behind the heading; this site has no
 * photography, so it uses portfolio's plain variant instead: a flat
 * surface band, the same --color-surface the home page's bands use.
 */
import { useAos } from '../composables/useAos';

defineProps({
	title: { type: String, required: true },
	text: { type: String, required: true },
	updated: { type: String, required: true },
});

// Syntaxia has no contact form or email address, so questions go to the
// same GitHub issues page the footer's "Report an Issue" link uses.
const issuesUrl = 'https://github.com/joshiii7/syntaxia/issues';

useAos();
</script>

<template>
	<section class="legal-banner">
		<div class="legal-banner__inner">
			<h1>{{ title }}</h1>
			<p>{{ text }}</p>
		</div>
	</section>

	<section class="legal-section">
		<div class="legal-content" data-aos="fade-up">
			<p class="legal-updated">Last updated: {{ updated }}</p>
			<slot />
			<ul>
				<li>
					<a :href="issuesUrl" target="_blank" rel="noopener noreferrer">
						Open an issue on GitHub
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</li>
			</ul>
		</div>
	</section>
</template>

<style scoped>
.legal-banner {
	padding: 4rem 24px;
	background: var(--color-surface);
	text-align: center;
}

.legal-banner__inner {
	max-width: 80rem;
	margin: 0 auto;
}

.legal-banner h1 {
	margin: 0;
	font-size: clamp(2.25rem, 5vw, 3.25rem);
	font-weight: 700;
	line-height: 1.2;
	color: var(--vp-c-text-1);
}

.legal-banner p {
	max-width: 640px;
	margin: 1rem auto 0;
	font-size: clamp(1rem, 2vw, 1.15rem);
	line-height: 1.6;
	color: var(--vp-c-text-2);
}

.legal-section {
	padding: 64px 24px;
}

/*
 * The prose comes from markdown, so it also carries VitePress's .vp-doc
 * styles (h2 with a top border and 48px margin, and so on). The rules
 * below are scoped one class deeper, so they win over those without
 * !important.
 */
.legal-content {
	max-width: 760px;
	margin: 0 auto;
}

.legal-content :deep(h2) {
	margin: 2.5rem 0 0;
	padding: 0;
	border: none;
	font-size: 1.4rem;
	line-height: 1.3;
	color: var(--vp-c-text-1);
}

.legal-content :deep(p),
.legal-content :deep(li) {
	color: var(--vp-c-text-2);
	font-size: 1rem;
	line-height: 1.8;
}

.legal-content :deep(p) {
	margin: 1rem 0 0;
}

.legal-content :deep(ul) {
	margin: 1rem 0 0;
	padding-left: 1.25rem;
}

.legal-content :deep(li + li) {
	margin-top: 0.5rem;
}

.legal-content :deep(a:focus-visible) {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.legal-content .legal-updated {
	margin: 0;
	font-size: 0.9rem;
	color: var(--vp-c-text-3);
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}
</style>
