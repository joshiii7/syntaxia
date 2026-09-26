<script setup>
/**
 * Full-width background video behind the home page hero, filling the
 * default theme's home-hero-image slot (see theme/index.ts). The hero
 * rules in style.css pull that slot out of the layout and stretch it
 * across the whole hero, so the headline sits on top of the video's empty
 * left side.
 *
 * public/videos/hero.mp4 is the original 4s clip followed by the same clip
 * reversed (built once with ffmpeg, audio stripped), so a plain `loop`
 * plays forward, backward, forward with no jump and no JavaScript.
 *
 * It's decorative (aria-hidden). Under reduced motion it never starts and
 * the poster frame shows instead.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { withBase } from 'vitepress';

const video = ref(null);
let reduced = null;

// Stop (or start again) if the visitor changes their motion setting while
// the page is open.
function syncMotion() {
	if (!video.value) return;
	if (reduced.matches) {
		video.value.pause();
		return;
	}
	video.value.play().catch(() => {
		// Autoplay was blocked by the browser: the poster frame just stays.
	});
}

onMounted(() => {
	reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
	reduced.addEventListener('change', syncMotion);
	syncMotion();
});

onBeforeUnmount(() => {
	reduced?.removeEventListener('change', syncMotion);
});
</script>

<template>
	<div class="hero-video">
		<video
			ref="video"
			class="hero-video__media"
			:poster="withBase('/videos/hero-poster.webp')"
			muted
			loop
			playsinline
			preload="auto"
			disablepictureinpicture
			aria-hidden="true"
			tabindex="-1"
		>
			<source :src="withBase('/videos/hero.mp4')" type="video/mp4">
		</video>
	</div>
</template>

<style scoped>
/*
 * A size container, so the rules below can react to the hero's own shape
 * (not the viewport's). The background is the video's own edge color
 * (sampled from the clip), so wherever the frame doesn't reach, it reads
 * as more of the same dark surface.
 */
.hero-video {
	position: absolute;
	inset: 0;
	overflow: hidden;
	container-type: size;
	background: #101417;
}

/* Narrow or tall heroes (phones, tablets): fill the hero and crop the
   sides, keeping the book, which sits right of center, in view. */
.hero-video__media {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
	object-position: 70% center;
}

/*
 * Wide heroes (anything wider than the video's own 16:9, so most desktops
 * and every ultra-wide or 4K screen): stretching the video to the full
 * width would crop away most of its height, book included. Instead the
 * whole frame shows at the hero's height, lined up with the right edge of
 * the 80rem content area (so the book sits beside the headline, not off at
 * the far edge of a 4K screen), and its left and right edges fade into the
 * matching background color so there's no visible box.
 */
@container (min-aspect-ratio: 16 / 9) {
	.hero-video__media {
		left: auto;
		right: max(0px, calc((100cqw - 80rem) / 2));
		width: calc(100cqh * 16 / 9);
		mask-image: linear-gradient(90deg, transparent 0%, #000 22%, #000 88%, transparent 100%);
	}
}

/*
 * Contrast for the hero text sitting on top of the video: darkest on the
 * left where the headline is, fading out toward the book on the right.
 * The stops are measured from the 80rem content area's left edge, not the
 * screen's, so on a 4K screen the fade still ends before the book instead
 * of dimming it. On narrow screens the text is centered over the whole
 * frame, so the scrim covers everything evenly instead.
 */
.hero-video::after {
	--content-left: max(0px, calc((100% - 80rem) / 2));
	--content-width: min(100%, 80rem);

	content: '';
	position: absolute;
	inset: 0;
	background: linear-gradient(
		90deg,
		rgba(10, 15, 31, 0.88) var(--content-left),
		rgba(10, 15, 31, 0.6) calc(var(--content-left) + var(--content-width) * 0.4),
		rgba(10, 15, 31, 0.1) calc(var(--content-left) + var(--content-width) * 0.75)
	);
	pointer-events: none;
}

@media (max-width: 959px) {
	.hero-video::after {
		background: rgba(10, 15, 31, 0.7);
	}
}
</style>
