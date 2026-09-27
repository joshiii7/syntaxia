/**
 * Animate On Scroll, set up the same way portfolio's AosService does it:
 * init() once the page has rendered its [data-aos] elements, animate as an
 * element enters the screen and again scrolling back (once: false,
 * mirror: true), and refresh trigger points after web fonts load because
 * they change heights. Everything stays static for visitors who prefer
 * reduced motion.
 *
 * AOS is imported inside onMounted, not at the top of the file, because it
 * touches `window` and this file is also loaded during VitePress's SSR build.
 */
import { onMounted } from 'vue';
import 'aos/dist/aos.css';

type Aos = typeof import('aos');

let started = false;
const watched = new WeakSet<Element>();
let tallWatcher: ResizeObserver | null = null;

/**
 * Mirror mode fades an element out as soon as its top scrolls past the top
 * of the screen, which hides the part of a tall element (the live code
 * editor) that is still being read. So an element taller than 40% of the
 * screen animates in once instead and then stays. It watches sizes rather
 * than measuring once, because content can make elements grow after init().
 */
function watchTallElements(aos: Aos): void {
	if (typeof ResizeObserver === 'undefined') return;
	tallWatcher ??= new ResizeObserver((entries) => {
		let changed = false;
		for (const { target } of entries) {
			if (target.hasAttribute('data-aos-once')) continue;
			if (target.getBoundingClientRect().height > window.innerHeight * 0.4) {
				target.setAttribute('data-aos-once', 'true');
				changed = true;
			}
		}
		if (changed) aos.refreshHard();
	});

	document.querySelectorAll('[data-aos]').forEach((element) => {
		if (watched.has(element)) return;
		watched.add(element);
		tallWatcher?.observe(element);
	});
}

export function useAos(): void {
	onMounted(async () => {
		const { default: AOS } = await import('aos');
		watchTallElements(AOS);

		if (started) {
			// AOS.init() adds new scroll/resize listeners each time it is
			// called, so later visits just re-scan the DOM for [data-aos].
			AOS.refreshHard();
			return;
		}

		started = true;
		AOS.init({
			duration: 800,
			easing: 'ease-out-cubic',
			offset: 90,
			once: false,
			mirror: true,
			disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		});
		void document.fonts?.ready.then(() => AOS.refresh());
	});
}
