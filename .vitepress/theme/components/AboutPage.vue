<script setup>
/**
 * /about page body: a hero title band, then three sections (What is
 * Syntaxia, Who created it, Why Syntaxia exists), reusing the same "section
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
 */

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

// Same GitHub mark used in SiteFooter.vue's social icon, reused here so the
// GitHub link reads consistently wherever it appears on the site.
const githubIcon =
	'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" /></svg>';
</script>

<template>
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
			<h2 id="about-what-title">What is Syntaxia</h2>
			<p class="about-section__lead">
				Syntaxia is an interactive programming book, a place to learn to code by actually writing code, not just
				reading about it. Every lesson pairs a short, plain-language explanation with a live code editor built right
				into the page, so an idea never stays abstract for long: you try it, you see what happens, and you move on to
				the next one. The curriculum spans multiple languages, frameworks, and tools, all taught in the same
				hands-on format, one page at a time.
			</p>

			<div class="about-features">
				<div v-for="feature in features" :key="feature.title" class="about-features__card">
					<span class="about-features__icon" v-html="feature.icon" aria-hidden="true"></span>
					<strong>{{ feature.title }}</strong>
					<span>{{ feature.detail }}</span>
				</div>
			</div>
		</div>
	</section>

	<section class="about-section about-section--alt" aria-labelledby="about-who-title">
		<div class="about-section__inner">
			<h2 id="about-who-title">Who created it</h2>

			<div class="about-creator">
				<span class="about-creator__avatar" aria-hidden="true">JA</span>
				<div class="about-creator__text">
					<p class="about-creator__name">Joshi Angelo Z. Adlawan</p>
					<p>
						Hi, I'm Joshi. I built Syntaxia by myself, mostly at night, after the hours I already spend doing
						frontend and backend work for other people. I kept running into the same problem every time I tried
						to pick up something new: tutorials that show you code and expect that to be enough. For me it
						usually wasn't. So I built the thing I actually wanted to use instead, a live editor sitting right
						next to every explanation, lessons kept short on purpose, and a quiz at the end of each one to catch
						the parts that only felt like they'd sunk in. Every lesson, every quiz, and the editor you're using
						right now, I wrote and built by hand, one page at a time.
					</p>
					<a
						href="https://github.com/joshiii7"
						class="about-creator__link"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span class="about-creator__link-icon" v-html="githubIcon"></span>
						View on GitHub
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class="about-section" aria-labelledby="about-why-title">
		<div class="about-section__inner">
			<h2 id="about-why-title">Why Syntaxia exists</h2>

			<p>
				Most people learning to code run into the same wall early on. Tutorials show you code instead of letting you
				touch it. Documentation assumes you already know what you're looking for. And by the time you've found a
				decent explanation of one concept, it's scattered across three different sites that don't agree on where to
				go next.
			</p>
			<p>
				Syntaxia exists to be the version of that experience worth wanting: one place, one consistent format, and a
				live editor that's always one scroll away instead of a separate tab you have to context-switch into. Every
				lesson is kept short on purpose, and every quiz exists to catch the moment an idea half-sinks in, before it's
				assumed to have fully landed. The goal was never to explain a language completely on day one. It was to
				get you writing real code as early as possible, and let everything else build from there.
			</p>

			<div class="about-callout">
				<h3>Meaning and Origin of the Name</h3>
				<p class="about-callout__pronunciation">
					<strong>Syntaxia</strong>
					(<span class="about-callout__ipa">/sɪnˈtæksiə/</span>, <span class="about-callout__phonetic">sin-TAK-see-uh</span>)
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
	</section>
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
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.02em;
	text-transform: uppercase;
}

.about-hero__title {
	margin: 20px 0 0;
	border: none;
	padding: 0;
	font-size: 40px;
	font-weight: 800;
	line-height: 1.2;
	color: var(--hero-text-strong);
}

.about-hero__accent {
	color: var(--color-brand-400);
}

.about-hero__subtitle {
	margin: 16px auto 0;
	max-width: 46ch;
	font-size: 16px;
	line-height: 1.6;
	color: var(--hero-text-muted);
}

@media (max-width: 640px) {
	.about-hero {
		padding: 48px 20px;
	}

	.about-hero__title {
		font-size: 30px;
	}
}

.about-section {
	padding: 56px 24px;
}

.about-section--alt {
	background: var(--vp-c-bg-soft);
}

.about-section__inner {
	max-width: 80rem;
	margin: 0 auto;
}

.about-section h2 {
	margin: 0 0 20px;
	font-size: 26px;
	font-weight: 700;
	color: var(--vp-c-text-1);
	text-align: center;
	border: none;
	padding: 0;
}

.about-section__lead {
	margin: 0 0 32px;
	font-size: 16px;
	line-height: 1.7;
	color: var(--vp-c-text-2);
}

.about-section p {
	margin: 0 0 16px;
	font-size: 15px;
	line-height: 1.75;
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
	font-size: 15px;
	color: var(--vp-c-brand-1);
}

.about-features__card span {
	font-size: 14px;
	line-height: 1.5;
	color: var(--vp-c-text-2);
}

/* Creator bio */
.about-creator {
	display: flex;
	gap: 20px;
	align-items: flex-start;
}

.about-creator__avatar {
	flex-shrink: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: color-mix(in srgb, var(--color-brand-400) 20%, transparent);
	color: var(--color-brand-400);
	font-weight: 700;
	font-size: 18px;
}

.about-creator__text p {
	margin: 0 0 12px;
	font-size: 15px;
	line-height: 1.7;
	color: var(--vp-c-text-2);
}

.about-creator__name {
	font-size: 17px;
	font-weight: 700;
	color: var(--vp-c-text-1);
}

.about-creator__link {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 10px 18px;
	border-radius: 999px;
	border: 1px solid var(--vp-c-divider);
	color: var(--vp-c-text-1);
	font-size: 14px;
	font-weight: 600;
	transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.about-creator__link:hover {
	border-color: var(--color-brand-400);
	color: var(--color-brand-400);
	background: color-mix(in srgb, var(--color-brand-400) 8%, transparent);
}

.about-creator__link:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.about-creator__link-icon {
	display: inline-flex;
	width: 16px;
	height: 16px;
}

/* Name-origin callout */
.about-callout {
	margin-top: 32px;
	padding: 24px;
	border-radius: 12px;
	border: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg-soft);
}

.about-callout h3 {
	margin: 0 0 12px;
	font-size: 16px;
	font-weight: 700;
	color: var(--vp-c-brand-1);
	border: none;
	padding: 0;
}

.about-callout p {
	margin: 0;
	font-size: 15px;
	line-height: 1.75;
	color: var(--vp-c-text-2);
}

/* Pronunciation line, same "wiki (/ˈwɪki/ WIK-ee)" format Wikipedia uses for
   its own name: IPA in monospace so the symbols stay legible, the plain
   phonetic respelling next to it in italics. */
.about-callout__pronunciation {
	margin: 0 0 16px;
	font-size: 15px;
	color: var(--vp-c-text-2);
}

.about-callout__ipa {
	font-family: var(--vp-font-family-mono, monospace);
	color: var(--vp-c-text-1);
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
	font-size: 14px;
	font-weight: 700;
	color: var(--vp-c-brand-1);
}

.about-callout__breakdown dd {
	margin: 0;
	font-size: 14px;
	line-height: 1.6;
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

	.about-section h2 {
		font-size: 22px;
	}

	.about-creator {
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
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
