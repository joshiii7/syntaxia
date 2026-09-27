<script setup>
/**
 * Four short columns (brand, quick links, lesson categories, resources)
 * above a credit and legal-links bar. Kept plain text and small type on
 * purpose, this is a lightweight footer, not another homepage section.
 *
 * Lesson categories intentionally lists only the five core, ready-today
 * tracks (IDEs, HTML, CSS, JavaScript, Python) — the site's other tracks in
 * curriculum.ts are `comingSoon` placeholders (see LessonsIndex.vue), which
 * belong on the full /lessons/ page, not repeated here as a growing list of
 * mostly-empty links.
 */
import { withBase } from 'vitepress';

const year = new Date().getFullYear();
</script>

<template>
	<footer class="site-footer">
		<div class="site-footer__content">
			<div>
				<a :href="withBase('/')" class="site-footer__logo">Syntaxia</a>
				<p class="site-footer__tagline">Learn to code, one page at a time.</p>
				<div class="site-footer__social">
					<a
						href="https://github.com/joshiii7"
						class="site-footer__social-link"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub (opens in a new tab)"
					>
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
							<path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
						</svg>
					</a>
					<a
						href="https://www.facebook.com/joshi.adlawan"
						class="site-footer__social-link"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Facebook (opens in a new tab)"
					>
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
							<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
						</svg>
					</a>
				</div>
			</div>

			<nav aria-label="Quick links">
				<h3>Quick Links</h3>
				<ul>
					<li><a :href="withBase('/')">Home</a></li>
					<li><a :href="withBase('/lessons/ide/introduction')">Start Learning</a></li>
					<li><a :href="withBase('/#faq')">FAQ</a></li>
					<li><a :href="withBase('/about')">About</a></li>
				</ul>
			</nav>

			<nav aria-label="Lesson categories">
				<h3>Lesson Categories</h3>
				<ul>
					<li><a :href="withBase('/lessons/ide/introduction')">IDEs</a></li>
					<li><a :href="withBase('/lessons/html/introduction')">HTML</a></li>
					<li><a :href="withBase('/lessons/css/intro-to-css')">CSS</a></li>
					<li><a :href="withBase('/lessons/javascript/intro-to-javascript')">JavaScript</a></li>
					<li><a :href="withBase('/lessons/python/intro-to-python')">Python</a></li>
				</ul>
				<p class="site-footer__note">More sections are coming soon.</p>
			</nav>

			<nav aria-label="Resources">
				<h3>Resources</h3>
				<ul>
					<li><a :href="withBase('/lessons/')">All Lessons</a></li>
					<li>
						<a href="https://github.com/joshiii7/syntaxia" target="_blank" rel="noopener noreferrer">
							Source Code
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					</li>
					<li>
						<a href="https://github.com/joshiii7/syntaxia/issues" target="_blank" rel="noopener noreferrer">
							Report an Issue
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>

		<div class="site-footer__bottom">
			<div class="site-footer__bottom-inner">
				<p>&copy; {{ year }} Syntaxia. All rights reserved.</p>
				<div class="site-footer__meta">
					<p>
						Built by
						<a href="https://joshiii7-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
							Joshi Angelo Z. Adlawan<span class="sr-only"> (opens in a new tab)</span></a>.
					</p>
					<nav class="site-footer__legal" aria-label="Legal">
						<a :href="withBase('/accessibility')">Accessibility</a>
						<a :href="withBase('/privacy')">Privacy Policy</a>
					</nav>
				</div>
			</div>
		</div>
	</footer>
</template>

<style scoped>
/*
 * layout-bottom (where this renders) sits outside VPContent, so on lesson
 * pages the fixed sidebar would otherwise overlap the footer's left edge.
 * Rather than padding the footer over to clear it (which left it stuck at
 * the sidebar's own width), this stacks the footer above it instead:
 * position: relative is required for z-index to apply at all, and the
 * z-index itself is pinned one above whichever sidebar z-index is active
 * (it changes at the 960px breakpoint — see vars.css), so the footer's own
 * opaque background simply paints over the sidebar wherever they overlap.
 */
.site-footer {
	position: relative;
	z-index: calc(var(--vp-z-index-sidebar) + 1);
	border-top: 1px solid var(--vp-c-divider);
	background: var(--vp-c-bg-alt);
	padding: 40px 24px 0;
}

.site-footer__content {
	max-width: 80rem;
	margin: 0 auto;
	display: grid;
	gap: 28px;
	grid-template-columns: 1fr;
	font-size: 13px;
}

@media (min-width: 720px) {
	.site-footer__content {
		grid-template-columns: 1.3fr 1fr 1fr 1fr;
	}
}

.site-footer__content h3 {
	margin: 0 0 10px;
	font-size: 13px;
	font-weight: 600;
	color: var(--vp-c-text-1);
}

.site-footer__tagline {
	margin: 4px 0 0;
	color: var(--vp-c-text-2);
}

.site-footer__note {
	margin: 10px 0 0;
	color: var(--vp-c-text-3);
	font-size: 12px;
}

.site-footer__content ul {
	list-style: none;
	margin: 0;
	padding: 0;
}

.site-footer__content li {
	margin-bottom: 6px;
}

.site-footer__content a {
	color: var(--vp-c-text-2);
}

.site-footer__content a:hover {
	color: var(--vp-c-brand-1);
}

.site-footer__content a:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.site-footer__logo {
	display: inline-block;
	font-size: 16px;
	font-weight: 700;
	color: var(--vp-c-text-1);
}

.site-footer__social {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 12px;
}

.site-footer__social-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border-radius: 50%;
	color: var(--vp-c-text-2);
	background: var(--vp-c-bg-soft);
}

.site-footer__social-link:hover {
	color: var(--vp-c-brand-1);
}

.site-footer__social-link:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.site-footer__bottom {
	margin-top: 24px;
	border-top: 1px solid var(--vp-c-divider);
	padding: 16px 0;
	text-align: center;
}

.site-footer__bottom p {
	margin: 0;
	font-size: 12px;
	color: var(--vp-c-text-3);
}

/*
 * Bottom bar laid out like portfolio's footer-bottom: the copyright on the
 * left, and the "Built by" credit beside the legal links (Accessibility,
 * Privacy Policy) on the right, stacked and centered on narrow screens.
 */
.site-footer__bottom-inner {
	max-width: 80rem;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
}

@media (min-width: 720px) {
	.site-footer__bottom-inner {
		flex-direction: row;
		justify-content: space-between;
		gap: 16px;
		text-align: left;
	}
}

.site-footer__meta {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 8px 20px;
}

.site-footer__meta p a {
	color: var(--vp-c-brand-1);
	text-decoration: underline;
}

.site-footer__legal {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 8px 20px;
}

.site-footer__legal a {
	font-size: 12px;
	color: var(--vp-c-text-2);
}

.site-footer__legal a:hover {
	color: var(--vp-c-brand-1);
}

.site-footer__bottom a:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
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
