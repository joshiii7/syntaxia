<script setup>
/**
 * Four short columns (brand, quick links, lesson categories, connect)
 * above a credits and license bar. Kept plain text and small type on
 * purpose, this is a lightweight footer, not another homepage section.
 *
 * Lesson categories currently lists all five sections that already exist
 * (IDEs, HTML, CSS, JavaScript, Python), not just HTML, since that's the
 * real current state of the book. New sections just get added to this
 * same list as they're written.
 *
 * Email and X/Twitter links are placeholders (you@example.com, /yourhandle)
 * for the author to replace with real ones. Left as live links with
 * obviously-placeholder values rather than dead hrefs, so they're easy to
 * find and replace with a search for "example.com" or "yourhandle".
 */
const year = new Date().getFullYear();
</script>

<template>
	<footer class="site-footer">
		<div class="site-footer__content">
			<div>
				<a href="/" class="site-footer__logo">Syntaxia</a>
				<p class="site-footer__tagline">Learn to code, one page at a time.</p>
			</div>

			<nav aria-label="Quick links">
				<h3>Quick Links</h3>
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/lessons/ide/introduction">Start Learning</a></li>
					<li><a href="/#faq">FAQ</a></li>
					<li><a href="/#why-syntaxia">About</a></li>
				</ul>
			</nav>

			<nav aria-label="Lesson categories">
				<h3>Lesson Categories</h3>
				<ul>
					<li><a href="/lessons/ide/introduction">IDEs</a></li>
					<li><a href="/lessons/html/introduction">HTML</a></li>
					<li><a href="/lessons/css/intro-to-css">CSS</a></li>
					<li><a href="/lessons/javascript/intro-to-javascript">JavaScript</a></li>
					<li><a href="/lessons/python/intro-to-python">Python</a></li>
				</ul>
				<p class="site-footer__note">More sections are coming soon.</p>
			</nav>

			<nav aria-label="Connect">
				<h3>Connect</h3>
				<ul>
					<li>
						<a href="https://github.com/Joshiii7/syntaxia" target="_blank" rel="noopener noreferrer">
							GitHub
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					</li>
					<!-- Placeholder: replace with your real email address. -->
					<li><a href="mailto:you@example.com">Email</a></li>
					<!-- Placeholder: replace with your real X/Twitter handle. -->
					<li>
						<a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer">
							X (Twitter)
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					</li>
				</ul>
			</nav>
		</div>

		<div class="site-footer__bottom">
			<div class="site-footer__credits">
				<p>© {{ year }} Syntaxia</p>
				<p>
					Built by
					<a href="https://joshiii7-portfolio.vercel.app" target="_blank" rel="noopener noreferrer">
						Joshi Angelo
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</p>
			</div>
			<p class="site-footer__license">
				Lessons are shared under
				<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-NC-SA 4.0</a>.
				Code examples are shared under the
				<a href="https://opensource.org/license/mit/" target="_blank" rel="noopener noreferrer">MIT License</a>.
			</p>
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

.site-footer__credits {
	max-width: 80rem;
	margin: 0 auto;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 4px 16px;
}

.site-footer__bottom a:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.site-footer__license {
	margin-top: 4px !important;
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
