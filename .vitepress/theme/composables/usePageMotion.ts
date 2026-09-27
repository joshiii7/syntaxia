/**
 * The site's GSAP motion, ported from portfolio's MotionService,
 * HomeMotionService and hero component. Written for the home page and
 * shared by every other page with a hero band (About, Lessons, the legal
 * pages); individual lesson pages don't use it.
 *
 * - Hero (the home page's VPHero, or a page's own banner, see HeroTargets):
 *   the headline reveals line by line (SplitText), then the intro and
 *   buttons follow. The home page's background video stays put.
 *   On desktop with a mouse, the buttons drift toward the pointer and the
 *   copy has a slight scroll parallax.
 * - Sections: `.motion-card` elements rise and fade in batches as they
 *   scroll in, reversed on the way back up (the same mirror behaviour AOS
 *   has), and each heading's `.heading-accent` word scrambles into place
 *   once (ScrambleText).
 *
 * Everything runs inside gsap.matchMedia(), so reduced-motion visitors see
 * the page untouched and revert() on unmount kills every tween and trigger.
 * GSAP is imported inside onMounted because this file also loads during
 * VitePress's SSR build.
 */
import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/** Media conditions every animation runs inside, same as portfolio's MOTION. */
const MOTION = {
	/** Anything animated at all: skipped entirely under reduced motion. */
	ok: '(prefers-reduced-motion: no-preference)',
	/** Heavier desktop-only effects (magnetic buttons, parallax). */
	desktop: '(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (hover: hover) and (pointer: fine)',
} as const;

const CARD_OFFSET = 36;

async function loadGsap() {
	const [{ gsap }, { ScrollTrigger }, { SplitText }, { ScrambleTextPlugin }] = await Promise.all([
		import('gsap'),
		import('gsap/ScrollTrigger'),
		import('gsap/SplitText'),
		import('gsap/ScrambleTextPlugin'),
	]);
	gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);
	ScrollTrigger.config({ ignoreMobileResize: true });
	return { gsap, ScrollTrigger, SplitText };
}

type Motion = Awaited<ReturnType<typeof loadGsap>>;
type MatchMedia = ReturnType<Motion['gsap']['matchMedia']>;

/**
 * Staggered rise-and-fade as batches of cards enter, reversed on the way
 * back up. Cards have CSS transitions for hover, which would smooth every
 * GSAP frame, so they're switched off while animating and the inline
 * styles are cleared afterwards to hand hover back to the stylesheet.
 * Opacity, not visibility, so links inside a card stay keyboard-focusable.
 */
function revealCards({ gsap, ScrollTrigger }: Motion, cards: HTMLElement[]): void {
	if (!cards.length) return;
	const hidden = { opacity: 0, y: CARD_OFFSET, transition: 'none' };
	gsap.set(cards, hidden);

	ScrollTrigger.batch(cards, {
		start: 'top 88%',
		onEnter: (batch) =>
			gsap.to(batch, {
				opacity: 1,
				y: 0,
				duration: 0.8,
				ease: 'power3.out',
				stagger: 0.1,
				overwrite: true,
				onComplete: () => void gsap.set(batch, { clearProps: 'transform,opacity,transition' }),
			}),
		onLeaveBack: (batch) => void gsap.to(batch, { ...hidden, duration: 0.4, ease: 'power2.in', overwrite: true }),
	});
}

/**
 * The accent word in a heading scrambles and resolves once as it scrolls
 * in. The heading gets an aria-label with its real text while it runs, and
 * the word's width is locked so the line doesn't reflow on scrambled
 * characters.
 */
function decodeAccents({ gsap }: Motion, accents: HTMLElement[]): void {
	for (const accent of accents) {
		const heading = accent.closest('h2');
		const finalText = accent.textContent ?? '';
		if (!heading || !finalText) continue;

		const label = heading.textContent ?? finalText;
		gsap.to(accent, {
			duration: 0.9,
			ease: 'none',
			scrambleText: { text: finalText, chars: 'upperCase', speed: 0.6, revealDelay: 0.1 },
			scrollTrigger: {
				trigger: accent,
				start: 'top 85%',
				once: true,
				onEnter: () => {
					heading.setAttribute('aria-label', label);
					accent.style.display = 'inline-block';
					accent.style.minWidth = `${accent.offsetWidth}px`;
				},
			},
			onComplete: () => {
				heading.removeAttribute('aria-label');
				accent.style.removeProperty('display');
				accent.style.removeProperty('min-width');
			},
		});
	}
}

function animateSections(motion: Motion, root: HTMLElement): MatchMedia {
	const mm = motion.gsap.matchMedia(root);
	mm.add(MOTION.ok, () => {
		revealCards(motion, motion.gsap.utils.toArray<HTMLElement>('.motion-card', root));
		decodeAccents(motion, motion.gsap.utils.toArray<HTMLElement>('.heading-accent', root));
	});
	return mm;
}

/**
 * Where a page's hero pieces are. Selectors are looked up inside the hero
 * element; `intro` may match several elements (an eyebrow and a subtitle),
 * which then fade in together after the title.
 */
export interface HeroTargets {
	/** The hero band itself, or null if the page has none. */
	hero: () => HTMLElement | null;
	title: string;
	intro: string;
	/** The block that gets the desktop scroll parallax. */
	copy: string;
	buttons?: string;
	/** Wrappers that drift toward the pointer (usually around `buttons`). */
	magnets?: string;
}

/** The home page's hero is VitePress's own VPHero, above HomeSections. */
export const HOME_HERO: HeroTargets = {
	hero: () => document.querySelector<HTMLElement>('.VPHero'),
	title: '.heading',
	intro: '.tagline',
	copy: '.main',
	buttons: '.actions .VPButton',
	magnets: '.actions .action',
};

function animateHero(motion: Motion, hero: HTMLElement, targets: HeroTargets): MatchMedia | undefined {
	const { gsap, SplitText } = motion;
	const title = hero.querySelector<HTMLElement>(targets.title);
	const intro = gsap.utils.toArray<HTMLElement>(targets.intro, hero);
	const copy = hero.querySelector<HTMLElement>(targets.copy);
	const buttons = targets.buttons ? gsap.utils.toArray<HTMLElement>(targets.buttons, hero) : [];
	const magnets = targets.magnets ? gsap.utils.toArray<HTMLElement>(targets.magnets, hero) : [];
	if (!title || !intro.length || !copy) return undefined;

	const mm = gsap.matchMedia(hero);

	mm.add(MOTION.ok, (context) => {
		const later = [...intro, ...buttons];

		// Start hidden right away, before the first paint. Opacity (not
		// visibility) keeps the links focusable while the entrance runs.
		gsap.set(title, { opacity: 0 });
		gsap.set(later, { opacity: 0, y: 18, transition: 'none' });

		let split: InstanceType<typeof SplitText> | undefined;
		let cancelled = false;

		// Split only once web fonts are in (or after 0.8s), so the lines
		// match the final layout.
		const fontsReady = Promise.race([document.fonts?.ready, new Promise<void>((resolve) => setTimeout(resolve, 800))]);
		void fontsReady.then(() => {
			if (cancelled) return;
			context.add(() => {
				split = SplitText.create(title, {
					type: 'lines',
					mask: 'lines',
					autoSplit: true,
					onSplit: (self) => {
						gsap.set(title, { opacity: 1 });
						return gsap.from(self.lines, {
							yPercent: 110,
							duration: 0.9,
							ease: 'power4.out',
							stagger: 0.08,
							willChange: 'transform',
							onComplete: () => void gsap.set(self.lines, { clearProps: 'willChange' }),
						});
					},
				});

				const timeline = gsap.timeline({
					defaults: { ease: 'power3.out' },
					// Hand hover (and the buttons' transitions) back to the stylesheet.
					onComplete: () => void gsap.set(later, { clearProps: 'transform,opacity,transition' }),
				});
				timeline.to(intro, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.35);
				if (buttons.length) timeline.to(buttons, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0.5);
			});
		});

		return () => {
			cancelled = true;
			split?.revert();
		};
	});

	mm.add(MOTION.desktop, () => {
		const cleanups: Array<() => void> = [];
		const pull = gsap.utils.clamp(-10, 10);

		// Each button's wrapper drifts a few px toward the pointer and settles back.
		for (const el of magnets) {
			const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
			const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
			let centerX = 0;
			let centerY = 0;

			const enter = () => {
				const rect = el.getBoundingClientRect();
				centerX = rect.left + rect.width / 2 - Number(gsap.getProperty(el, 'x'));
				centerY = rect.top + rect.height / 2 - Number(gsap.getProperty(el, 'y'));
			};
			const move = (event: PointerEvent) => {
				xTo(pull((event.clientX - centerX) * 0.2));
				yTo(pull((event.clientY - centerY) * 0.2));
			};
			const leave = () => {
				xTo(0);
				yTo(0);
			};

			el.addEventListener('pointerenter', enter);
			el.addEventListener('pointermove', move);
			el.addEventListener('pointerleave', leave);
			cleanups.push(() => {
				el.removeEventListener('pointerenter', enter);
				el.removeEventListener('pointermove', move);
				el.removeEventListener('pointerleave', leave);
			});
		}

		// The copy drifts up a little faster than the page as the hero
		// scrolls away. The background video stays put.
		gsap.to(copy, {
			yPercent: -10,
			ease: 'none',
			scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
		});

		return () => cleanups.forEach((cleanup) => cleanup());
	});

	return mm;
}

/**
 * Wires up the page's hero (if `heroTargets` is given) and every section
 * inside `root` (`.motion-card` and `.heading-accent`) for the page's
 * lifetime.
 */
export function usePageMotion(root: Ref<HTMLElement | null>, heroTargets?: HeroTargets): void {
	const contexts: MatchMedia[] = [];
	let unmounted = false;

	onMounted(async () => {
		const motion = await loadGsap();
		if (unmounted || !root.value) return;

		const hero = heroTargets?.hero() ?? null;
		const heroContext = hero && heroTargets ? animateHero(motion, hero, heroTargets) : undefined;
		if (heroContext) contexts.push(heroContext);
		contexts.push(animateSections(motion, root.value));
	});

	onBeforeUnmount(() => {
		unmounted = true;
		contexts.forEach((mm) => mm.revert());
	});
}
