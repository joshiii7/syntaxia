<script setup>
import { computed } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps({
	heading: { type: String, default: 'Ready to start?' },
	// Must be a substring of `heading` (case-insensitive) — the matched
	// span is what renders as the accent color.
	accentText: { type: String, default: 'start' },
	subheading: { type: String, default: 'Jump into the first lesson. It takes less than a minute to begin.' },
	buttonText: { type: String, default: 'Start for free' },
	// Bare root-relative path: run through withBase() at the template usage
	// site below, not here, so a caller can still pass an already-external
	// URL through unaffected (withBase no-ops for those).
	buttonLink: { type: String, default: '/lessons/ide/introduction' },
	caption: { type: String, default: 'No signup required' },
	previewBadge: { type: String, default: 'Lesson 1' },
	previewTag: { type: String, default: 'Published' },
	previewCode: { type: String, default: '<h1>Hello, world!</h1>' },
	// Optional AOS animation (e.g. 'zoom-in-up') for the content only, so the
	// full-width background stays put while the content animates in, like
	// portfolio's CTA band. Off by default: a [data-aos] element stays hidden
	// on any page that never initializes AOS (see useAos.ts), so only a page
	// that does (the home page) should pass it.
	contentAos: { type: String, default: null },
});

// Split on `accentText` instead of accepting HTML/v-html for the heading,
// so callers only ever pass plain text here.
const headingParts = computed(() => {
	const start = props.heading.toLowerCase().indexOf(props.accentText.toLowerCase());
	if (start === -1) return { before: props.heading, accent: '', after: '' };
	return {
		before: props.heading.slice(0, start),
		accent: props.heading.slice(start, start + props.accentText.length),
		after: props.heading.slice(start + props.accentText.length),
	};
});

// Reused from HomeSections.vue's "Completely free" icon, so a checkmark
// means the same thing everywhere on the site rather than introducing a
// second checkmark style.
const checkIcon =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="m7 12 3.5 3.5L17 9" /></svg>';
</script>

<template>
	<section class="cta-banner">
		<div class="cta-banner__glow" aria-hidden="true"></div>
		<div class="cta-banner__grid" aria-hidden="true"></div>

		<div class="cta-banner__inner" :data-aos="contentAos || undefined">
			<div class="cta-banner__text">
				<h2 class="cta-banner__heading">{{ headingParts.before }}<span class="cta-banner__accent">{{ headingParts.accent }}</span>{{ headingParts.after }}</h2>
				<p class="cta-banner__subheading">{{ subheading }}</p>
			</div>

			<!--
				Purely decorative mockup: no information here that isn't already
				said in words by the heading/subheading/button, so it's hidden
				from assistive technology rather than announced twice.
			-->
			<div class="cta-banner__preview" aria-hidden="true">
				<span class="cta-banner__badge">{{ previewBadge }}</span>
				<div class="cta-banner__card">
					<div class="cta-banner__card-bar">
						<span class="cta-banner__dot cta-banner__dot--a"></span>
						<span class="cta-banner__dot cta-banner__dot--b"></span>
						<span class="cta-banner__dot cta-banner__dot--c"></span>
					</div>
					<pre class="cta-banner__code"><code>{{ previewCode }}</code></pre>
					<span class="cta-banner__tag">
						<span class="cta-banner__tag-icon" v-html="checkIcon"></span>
						{{ previewTag }}
					</span>
				</div>
			</div>

			<div class="cta-banner__action">
				<a :href="withBase(buttonLink)" class="cta-banner__button" :aria-describedby="caption ? 'cta-banner-caption' : undefined">
					{{ buttonText }} <span aria-hidden="true">&rarr;</span>
				</a>
				<span v-if="caption" id="cta-banner-caption" class="cta-banner__caption">{{ caption }}</span>
			</div>
		</div>
	</section>
</template>

<style scoped>
/*
 * This banner is always dark, on purpose, regardless of the site's
 * light/dark toggle — the same fixed-color treatment HomeSections.vue
 * already uses for .home-how__step and .skill-card's content background.
 * A "SaaS promo banner" reads as an intentional dark panel either way, not
 * a section that forgot to theme itself.
 */
.cta-banner {
	/*
	 * Fixed text tokens, not the theme-swapping --vp-c-text-* vars: those
	 * flip to dark-on-light in the site's light theme, which is illegible
	 * against this banner's permanently dark background.
	 */
	--cta-text-strong: #ffffff;
	--cta-text-muted: rgba(255, 255, 255, 0.7);
	--cta-text-subtle: rgba(255, 255, 255, 0.5);
	--cta-dot-color: rgba(255, 255, 255, 0.16);

	position: relative;
	overflow: hidden;
	display: flex;
	padding: 48px 40px;
	background: var(--color-navy-900);
	color: var(--cta-text-strong);
	isolation: isolate;
}

.cta-banner__glow {
	position: absolute;
	inset: 0;
	z-index: 0;
	background: radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--color-brand-400) 30%, transparent), transparent 55%),
		radial-gradient(circle at 85% 75%, color-mix(in srgb, var(--color-brand-400) 16%, transparent), transparent 60%);
}

.cta-banner__grid {
	position: absolute;
	inset: 0;
	z-index: 0;
	background-image: radial-gradient(var(--cta-dot-color) 1px, transparent 1px);
	background-size: 24px 24px;
	mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
}

/* Content stays capped at 80rem and centered, matching every other home
   section, even though .cta-banner itself is allowed to run full width. */
.cta-banner__inner {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 40px;
	width: 100%;
	max-width: 80rem;
	margin: 0 auto;
}

.cta-banner__text {
	flex: 1 1 260px;
	min-width: 0;
}

.cta-banner__heading {
	margin: 0 0 12px;
	border: none;
	padding: 0;
	font-size: var(--font-size-banner-title);
	font-weight: 700;
	line-height: var(--line-height-heading);
	color: var(--cta-text-strong);
}

.cta-banner__accent {
	color: var(--color-brand-400);
}

.cta-banner__subheading {
	margin: 0;
	max-width: 32ch;
	font-size: var(--font-size-banner-lead);
	line-height: var(--line-height-body);
	color: var(--cta-text-muted);
}

/* Mockup / preview card */

.cta-banner__preview {
	position: relative;
	flex: 0 0 auto;
	padding-top: 18px;
}

.cta-banner__badge {
	position: absolute;
	top: -6px;
	left: 16px;
	z-index: 2;
	padding: 4px 10px;
	border-radius: 999px;
	background: var(--color-brand-400);
	color: var(--color-navy-900);
	font-size: var(--font-size-2xs);
	font-weight: 700;
}

.cta-banner__card {
	position: relative;
	width: 220px;
	border-radius: 12px;
	border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
	background: color-mix(in srgb, #ffffff 6%, transparent);
	backdrop-filter: blur(6px);
	overflow: hidden;
}

.cta-banner__card-bar {
	display: flex;
	gap: 6px;
	padding: 10px 12px;
	border-bottom: 1px solid color-mix(in srgb, #ffffff 12%, transparent);
}

.cta-banner__dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: color-mix(in srgb, #ffffff 25%, transparent);
}

.cta-banner__code {
	margin: 0;
	padding: 16px 14px 20px;
	font-family: var(--vp-font-family-mono, monospace);
	font-size: var(--font-size-2xs);
	line-height: var(--line-height-body);
	color: var(--color-brand-400);
	white-space: pre-wrap;
	word-break: break-word;
}

.cta-banner__tag {
	position: absolute;
	right: -10px;
	bottom: -10px;
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 4px 10px;
	border-radius: 999px;
	background: var(--vp-c-bg-alt);
	border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
	color: var(--vp-c-text-1);
	font-size: var(--font-size-3xs);
	font-weight: 600;
}

.cta-banner__tag-icon {
	display: inline-flex;
	width: 14px;
	height: 14px;
	color: var(--color-brand-400);
}

.cta-banner__tag-icon :deep(svg) {
	width: 100%;
	height: 100%;
}

/* Button + caption */

.cta-banner__action {
	flex: 0 0 auto;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 8px;
	text-align: right;
}

.cta-banner__button {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 14px 28px;
	border-radius: 999px;
	background: var(--color-brand-400);
	color: var(--color-navy-900);
	font-weight: 700;
	font-size: var(--font-size-body);
	white-space: nowrap;
	transition: background-color 0.2s ease, transform 0.2s ease;
}

.cta-banner__button:hover {
	background: var(--color-brand-500);
	transform: translateY(-1px);
}

.cta-banner__button:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.cta-banner__caption {
	font-size: var(--font-size-xs);
	color: var(--cta-text-subtle);
}

/* Stack vertically on mobile; the mockup card is decorative, so it's the
   first thing dropped when space is tight. */
@media (max-width: 860px) {
	.cta-banner__preview {
		display: none;
	}
}

@media (max-width: 640px) {
	.cta-banner {
		padding: 36px 24px;
	}

	.cta-banner__inner {
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
	}

	.cta-banner__subheading {
		max-width: none;
	}

	.cta-banner__action {
		align-items: flex-start;
		width: 100%;
		text-align: left;
	}

	.cta-banner__button {
		width: 100%;
		justify-content: center;
	}
}
</style>
