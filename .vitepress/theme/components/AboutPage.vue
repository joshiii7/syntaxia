<script setup>
/**
 * /about page body: a hero title band, then two sections (What is
 * Syntaxia, Why Syntaxia exists), reusing the same "section
 * + centered inner + card grid" visual language as HomeSections.vue's "Why
 * Syntaxia" section (its own scoped styles aren't reachable from here, so
 * the relevant rules are duplicated rather than imported, same approach as
 * LessonsIndex.vue).
 *
 * The hero reuses CtaBanner.vue's fixed-dark-navy/radial-glow/dot-grid
 * treatment (same reasoning there applies here: an intentional dark panel
 * reads the same regardless of the site's light/dark toggle), as this
 * page's own h1/title band rather than a bare markdown heading. about.md
 * intentionally has no h1 of its own, so this is the page's only one.
 *
 * Motion is the home page's (see HomeSections.vue): AOS fades headings and
 * text blocks in, usePageMotion runs the hero entrance, rises the cards in
 * (`.motion-card`) and scrambles each title's `.heading-accent` word.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useAos } from '../composables/useAos';
import { usePageMotion } from '../composables/usePageMotion';

const rootEl = ref(null);

// --- "Hear it" button beside the name's pronunciation ---
// Browsers read the plain word "Syntaxia" with the stress in the wrong
// place, so the utterance is the phonetic respelling instead, lowercase
// (some voices spell out capitalized syllables letter by letter) and a
// little slower than default so each syllable is clear.
const PRONUNCIATION_TEXT = 'sin-tack-see-uh';

// Starts false, so the prerendered HTML has no button, and only turns on
// in a browser that has the Web Speech API. Browsers without it never see
// the button at all.
const canSpeak = ref(false);
const isSpeaking = ref(false);
let currentUtterance = null;

onMounted(() => {
	canSpeak.value = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
});

function pronounceName() {
	if (!canSpeak.value) return;
	const synth = window.speechSynthesis;
	// Clicking again while it's talking restarts it instead of queueing.
	synth.cancel();

	const utterance = new SpeechSynthesisUtterance(PRONUNCIATION_TEXT);
	utterance.lang = 'en-US';
	utterance.rate = 0.85;
	// cancel() fires the previous utterance's error event asynchronously,
	// possibly after this one has started, so each handler only updates
	// the button for the utterance that is current.
	const settle = () => {
		if (currentUtterance === utterance) isSpeaking.value = false;
	};
	utterance.onstart = () => {
		if (currentUtterance === utterance) isSpeaking.value = true;
	};
	utterance.onend = settle;
	utterance.onerror = settle;
	currentUtterance = utterance;
	synth.speak(utterance);
}

// Don't keep talking after the visitor has navigated to another page.
onBeforeUnmount(() => {
	if (canSpeak.value) window.speechSynthesis.cancel();
});

useAos();
usePageMotion(rootEl, {
	hero: () => rootEl.value?.querySelector('.about-hero') ?? null,
	title: '.about-hero__title',
	intro: '.about-hero__eyebrow, .about-hero__subtitle',
	copy: '.about-hero__inner',
});

// Same icon format as HomeSections.vue's whySyntaxia set (stroke="currentColor",
// 24x24, rounded caps) so a new icon here still reads as part of the same
// icon language, not a mismatched one-off.
const features = [
	{
		title: 'Live code editors',
		detail: "Every lesson has a real editor built right into the page. Write code and see it run immediately, no setup required.",
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>',
	},
	{
		title: 'Multiple languages & tools',
		detail: 'From HTML and CSS to full frameworks and backend languages, every topic follows the same hands-on format.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>',
	},
	{
		title: 'Quizzes built in',
		detail: 'Most lessons close with a short quiz, a quick check that an idea actually stuck before you move on.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="m7 12 3.5 3.5L17 9" /></svg>',
	},
	{
		title: 'Lessons that build on each other',
		detail: 'Nothing is random. Every lesson assumes only what came before it, so the path always makes sense.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>',
	},
];
</script>

<template>
	<div ref="rootEl">
		<section class="about-hero">
			<div class="about-hero__glow" aria-hidden="true"></div>
			<div class="about-hero__grid" aria-hidden="true"></div>

			<div class="about-hero__inner">
				<span class="about-hero__eyebrow">About</span>
				<h1 class="about-hero__title">Learn to code by <span class="about-hero__accent">actually writing it</span></h1>
				<p class="about-hero__subtitle">
					Syntaxia is an interactive programming book with live editors, short lessons, and quizzes that make
					sure things actually stick.
				</p>
			</div>
		</section>

		<section class="about-section" aria-labelledby="about-what-title">
			<div class="about-section__inner">
				<h2 id="about-what-title" data-aos="fade-up">What is <span class="heading-accent">Syntaxia</span></h2>
				<p class="about-section__lead" data-aos="fade-up" data-aos-delay="100">
					Syntaxia is an interactive programming book, a place to learn to code by actually writing code, not just
					reading about it. Every lesson pairs a short, plain-language explanation with a live code editor built right
					into the page, so an idea never stays abstract for long: you try it, you see what happens, and you move on to
					the next one. The curriculum spans multiple languages, frameworks, and tools, all taught in the same
					hands-on format, one page at a time.
				</p>

				<div class="about-features">
					<div v-for="feature in features" :key="feature.title" class="about-features__card motion-card">
						<span class="about-features__icon" v-html="feature.icon" aria-hidden="true"></span>
						<strong>{{ feature.title }}</strong>
						<span>{{ feature.detail }}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="about-section about-section--alt" aria-labelledby="about-why-title">
			<div class="about-section__inner">
				<h2 id="about-why-title" data-aos="fade-up">Why Syntaxia <span class="heading-accent">exists</span></h2>

				<div class="about-why">
					<div class="about-why__text">
						<p data-aos="fade-up">
							Most people learning to code run into the same wall early on. Tutorials show you code instead of letting you
							touch it. Documentation assumes you already know what you're looking for. And by the time you've found a
							decent explanation of one concept, it's scattered across three different sites that don't agree on where to
							go next.
						</p>
						<p data-aos="fade-up">
							Syntaxia exists to be the version of that experience worth wanting: one place, one consistent format, and a
							live editor that's always one scroll away instead of a separate tab you have to context-switch into. Every
							lesson is kept short on purpose, and every quiz exists to catch the moment an idea half-sinks in, before it's
							assumed to have fully landed. The goal was never to explain a language completely on day one. It was to
							get you writing real code as early as possible, and let everything else build from there.
						</p>
					</div>

					<div class="about-callout motion-card">
						<h3>Meaning and Origin of the Name</h3>
						<p class="about-callout__pronunciation">
							<strong>Syntaxia</strong>
							(<span class="about-callout__ipa">/sɪnˈtæksiə/</span>, <span class="about-callout__phonetic">sin-TAK-see-uh</span>)
							<button
								v-if="canSpeak"
								type="button"
								class="about-callout__speak"
								:class="{ 'is-speaking': isSpeaking }"
								aria-label="Pronounce Syntaxia"
								@click="pronounceName"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
									<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
									<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
								</svg>
							</button>
						</p>
						<dl class="about-callout__breakdown">
							<div class="about-callout__term">
								<dt>The "Syntax" part</dt>
								<dd>
									Refers to syntax, the set of rules that define the structure of a programming language (the
									core subject this platform teaches).
								</dd>
							</div>
							<div class="about-callout__term">
								<dt>The "ia" part</dt>
								<dd>A suffix seen in words like encyclopedia and Wikipedia, suggesting a place or repository of knowledge.</dd>
							</div>
						</dl>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
/*
 * Hero title band, same fixed-dark/radial-glow/dot-grid treatment as
 * CtaBanner.vue, reused here as this page's title section instead of a
 * plain markdown h1. Fixed color tokens (not the theme-swapping
 * --vp-c-text-* vars), same reasoning as CtaBanner: this always reads as an
 * intentional dark panel, regardless of the site's light/dark toggle.
 */
.about-hero {
	--hero-text-strong: #ffffff;
	--hero-text-muted: rgba(255, 255, 255, 0.72);
	--hero-dot-color: rgba(255, 255, 255, 0.16);

	position: relative;
	overflow: hidden;
	padding: 72px 24px;
	background: var(--color-navy-900);
	color: var(--hero-text-strong);
	text-align: center;
	isolation: isolate;
}

.about-hero__glow {
	position: absolute;
	inset: 0;
	z-index: 0;
	background: radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-brand-400) 26%, transparent), transparent 60%);
}

.about-hero__grid {
	position: absolute;
	inset: 0;
	z-index: 0;
	background-image: radial-gradient(var(--hero-dot-color) 1px, transparent 1px);
	background-size: 24px 24px;
	mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
}

/* Content stays capped at 80rem and centered, matching every other
   full-bleed section on the site (home sections, CtaBanner, nav, footer). */
.about-hero__inner {
	position: relative;
	z-index: 1;
	max-width: 80rem;
	margin: 0 auto;
}

.about-hero__eyebrow {
	display: inline-flex;
	align-items: center;
	padding: 6px 16px;
	border-radius: 999px;
	border: 1px solid color-mix(in srgb, #ffffff 18%, transparent);
	background: color-mix(in srgb, #ffffff 6%, transparent);
	color: var(--hero-text-muted);
	font-size: var(--font-size-xs);
	font-weight: 600;
	letter-spacing: 0.02em;
	text-transform: uppercase;
}

.about-hero__title {
	margin: 20px 0 0;
	border: none;
	padding: 0;
	font-size: var(--font-size-hero-title);
	font-weight: 700;
	line-height: var(--line-height-heading);
	color: var(--hero-text-strong);
}

.about-hero__accent {
	color: var(--color-brand-400);
}

.about-hero__subtitle {
	margin: 16px auto 0;
	max-width: 46ch;
	font-size: var(--font-size-hero-lead);
	line-height: var(--line-height-body);
	color: var(--hero-text-muted);
}

@media (max-width: 640px) {
	.about-hero {
		padding: 48px 20px;
	}
}

.about-section {
	padding: 56px 24px;
}

/* Same band/card surface pair as the home page's .home-section--surface,
   so a card inside the band still stands apart from it. */
.about-section--alt {
	background: var(--color-surface);
}

.about-section--alt .about-callout {
	background: var(--color-surface-card);
}

.about-section__inner {
	max-width: 80rem;
	margin: 0 auto;
}

.about-section h2 {
	margin: 0 0 20px;
	font-size: var(--font-size-section-title);
	font-weight: 700;
	line-height: var(--line-height-heading);
	color: var(--vp-c-text-1);
	text-align: center;
	border: none;
	padding: 0;
}

/* Scoped under .about-section so it outranks the plain `.about-section p`
   rule below, which otherwise overrides this lead's size and margin. */
.about-section .about-section__lead {
	margin: 0 0 32px;
	font-size: var(--font-size-section-lead);
	line-height: var(--line-height-body);
	color: var(--vp-c-text-2);
}

.about-section p {
	margin: 0 0 16px;
	font-size: var(--font-size-body);
	line-height: var(--line-height-prose);
	color: var(--vp-c-text-2);
}

.about-section p:last-child {
	margin-bottom: 0;
}

/* Feature grid, same card treatment as HomeSections.vue's .home-why__card
   (duplicated per the note at the top of the script block). Four columns on
   desktop, stepping down as the viewport narrows, each card centered rather
   than left-aligned. */
.about-features {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	justify-items: center;
	gap: 20px;
}

@media (max-width: 900px) {
	.about-features {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 480px) {
	.about-features {
		grid-template-columns: 1fr;
	}
}

.about-features__card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	width: 100%;
	padding: 20px;
	border-radius: 10px;
	border: 1px solid transparent;
	background: var(--vp-c-bg-soft);
	text-align: center;
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
}

.about-features__card:hover,
.about-features__card:focus-within {
	transform: translateY(-4px);
	border-color: color-mix(in srgb, var(--color-brand-400) 40%, transparent);
	background: var(--vp-c-bg-elv);
	box-shadow: 0 12px 28px rgba(10, 15, 31, 0.35);
}

.about-features__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	background: color-mix(in srgb, var(--color-brand-400) 20%, transparent);
	color: var(--color-brand-400);
}

.about-features__icon :deep(svg) {
	width: 22px;
	height: 22px;
}

.about-features__card strong {
	font-size: var(--font-size-card-title);
	color: var(--vp-c-brand-1);
}

.about-features__card span {
	font-size: var(--font-size-body-sm);
	line-height: var(--line-height-body);
	color: var(--vp-c-text-2);
}

/* "Why Syntaxia exists": the story on the left and the name callout on the
   right from 1024px, the same breakpoint and 7:5 split (flipped, since the
   text is the longer side here) as the home page's FAQ. Stacks below. */
.about-why {
	display: grid;
	gap: 2.5rem;
}

@media (min-width: 1024px) {
	.about-why {
		grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
		gap: 4rem;
		align-items: start;
	}

	/* The callout column is too narrow for the two terms side by side. */
	.about-why .about-callout__breakdown {
		grid-template-columns: 1fr;
	}
}

/* Name-origin callout */
.about-callout {
	padding: 24px;
	border-radius: 12px;
	border: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg-soft);
}

.about-callout h3 {
	margin: 0 0 12px;
	font-size: var(--font-size-card-title);
	font-weight: 700;
	color: var(--vp-c-brand-1);
	border: none;
	padding: 0;
}

.about-callout p {
	margin: 0;
	font-size: var(--font-size-body);
	line-height: var(--line-height-prose);
	color: var(--vp-c-text-2);
}

/* Pronunciation line, same "wiki (/ˈwɪki/ WIK-ee)" format Wikipedia uses for
   its own name: IPA in monospace so the symbols stay legible, the plain
   phonetic respelling next to it in italics. */
/* Scoped under .about-callout so it outranks the `.about-callout p` rule,
   which otherwise zeroes this line's bottom margin. */
.about-callout .about-callout__pronunciation {
	margin: 0 0 16px;
	font-size: var(--font-size-body);
	color: var(--vp-c-text-2);
}

.about-callout__ipa {
	font-family: var(--vp-font-family-mono, monospace);
	color: var(--vp-c-text-1);
}

/* Small inline "hear it" button: just the icon at rest, a soft brand tint on
   hover/focus and while speaking. The 28px box keeps it an easy tap target
   while the 16px icon keeps it visually quiet next to the text. */
.about-callout__speak {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	margin-left: 4px;
	padding: 0;
	border: none;
	border-radius: 50%;
	background: transparent;
	color: var(--vp-c-text-3);
	vertical-align: middle;
	cursor: pointer;
	transition: color 0.2s ease, background-color 0.2s ease;
}

.about-callout__speak svg {
	width: 16px;
	height: 16px;
}

.about-callout__speak:hover,
.about-callout__speak.is-speaking {
	color: var(--vp-c-brand-1);
	background: color-mix(in srgb, var(--color-brand-400) 14%, transparent);
}

.about-callout__speak:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.about-callout__phonetic {
	font-style: italic;
}

/* Name-breakdown term list ("The 'Syntax' part" / "The 'ia' part"), same
   Wikipedia-style etymology format, side by side on desktop. */
.about-callout__breakdown {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	margin: 0;
}

.about-callout__breakdown dt {
	margin: 0 0 4px;
	font-size: var(--font-size-body-sm);
	font-weight: 700;
	color: var(--vp-c-brand-1);
}

.about-callout__breakdown dd {
	margin: 0;
	font-size: var(--font-size-body-sm);
	line-height: var(--line-height-body);
	color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
	.about-callout__breakdown {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 640px) {
	.about-section {
		padding: 40px 20px;
	}
}
</style>
