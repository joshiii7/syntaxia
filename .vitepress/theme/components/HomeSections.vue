<script setup>
/**
 * Everything on the home page below VitePress's native hero (index.md's
 * frontmatter): why-syntaxia, what-you'll-learn, how-it-works, try-it-now
 * (a live WebPlayground), who-this-is-for, FAQ, and a closing call to
 * action, in that order.
 *
 * Every pattern below (section bands, motion, accordion) is ported from
 * ../../../../portfolio's home page, not invented fresh, since that
 * project already has a proven, tested version of each:
 *
 * - Section backgrounds: flat tones alternating between the page color
 *   and a raised surface (portfolio's bg-primary/bg-secondary), no
 *   gradients or banner art. See .home-section--surface in the styles.
 *
 * - Motion, split the same way portfolio splits it: AOS (useAos) fades
 *   headings, intros, buttons and the editor in via `data-aos`, while
 *   GSAP (useHomeMotion) handles the cards (`.motion-card`), the
 *   scrambling `.heading-accent` word in each title, and the hero
 *   entrance above this component. Both stay off under reduced motion.
 *
 * - FAQ accordion: portfolio's button+panel accordion, single item open
 *   at a time, with a real height animation (JS measures scrollHeight,
 *   transitions to it, then swaps to `auto` once open) rather than a
 *   plain instant native <details> toggle.
 */
import { ref } from 'vue';
import { withBase } from 'vitepress';
import { useAos } from '../composables/useAos';
import { useHomeMotion } from '../composables/useHomeMotion';
import ScrollProgress from './ScrollProgress.vue';

const rootEl = ref(null);

useAos();
useHomeMotion(rootEl);

// Card structure, glow-on-hover, and colored-per-item styling are ported
// from ../../../../portfolio's "Languages & Frameworks" tech grid
// (services/index.html + css/style.css's .skills/.skill-card rules).
// Icons here are the same real logo files portfolio uses
// (../../../../portfolio/assets/svg/*.svg), inlined so they render through
// the same v-html mechanism as the rest of this card. Each `color` is the
// logo's own brand color, so the glow matches the mark sitting on top of it.
// `link` is a bare root-relative path below, run through withBase() once
// below the array: this site is deployed under a /<repo>/ subpath (see
// config.mts's `base`), and a raw href without it 404s once the site isn't
// served from the domain root, which every link here plus every one in
// SiteFooter.vue and CtaBanner.vue's default was doing until this pass.
const sections = [
	{
		name: 'IDEs',
		description: 'See the tools real developers use to write code.',
		link: '/lessons/ide/introduction',
		color: '#007ACC',
		icon: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path d="M29.01,5.03,23.244,2.254a1.742,1.742,0,0,0-1.989.338L2.38,19.8A1.166,1.166,0,0,0,2.3,21.447c.025.027.05.053.077.077l1.541,1.4a1.165,1.165,0,0,0,1.489.066L28.142,5.75A1.158,1.158,0,0,1,30,6.672V6.605A1.748,1.748,0,0,0,29.01,5.03Z" fill="#0065a9"/><path d="M29.01,26.97l-5.766,2.777a1.745,1.745,0,0,1-1.989-.338L2.38,12.2A1.166,1.166,0,0,1,2.3,10.553c.025-.027.05-.053.077-.077l1.541-1.4A1.165,1.165,0,0,1,5.41,9.01L28.142,26.25A1.158,1.158,0,0,0,30,25.328V25.4A1.749,1.749,0,0,1,29.01,26.97Z" fill="#007acc"/><path d="M23.244,29.747a1.745,1.745,0,0,1-1.989-.338A1.025,1.025,0,0,0,23,28.684V3.316a1.024,1.024,0,0,0-1.749-.724,1.744,1.744,0,0,1,1.989-.339l5.765,2.772A1.748,1.748,0,0,1,30,6.6V25.4a1.748,1.748,0,0,1-.991,1.576Z" fill="#1f9cf0"/></svg>',
	},
	{
		name: 'HTML',
		description: 'Structure every webpage. Learn tag by tag.',
		link: '/lessons/html/introduction',
		color: '#E44F26',
		icon: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><polygon points="5.902 27.201 3.655 2 28.345 2 26.095 27.197 15.985 30 5.902 27.201" fill="#e44f26"/><polygon points="16 27.858 24.17 25.593 26.092 4.061 16 4.061 16 27.858" fill="#f1662a"/><polygon points="16 13.407 11.91 13.407 11.628 10.242 16 10.242 16 7.151 15.989 7.151 8.25 7.151 8.324 7.981 9.083 16.498 16 16.498 16 13.407" fill="#ebebeb"/><polygon points="16 21.434 15.986 21.438 12.544 20.509 12.324 18.044 10.651 18.044 9.221 18.044 9.654 22.896 15.986 24.654 16 24.65 16 21.434" fill="#ebebeb"/><polygon points="15.989 13.407 15.989 16.498 19.795 16.498 19.437 20.507 15.989 21.437 15.989 24.653 22.326 22.896 22.372 22.374 23.098 14.237 23.174 13.407 22.341 13.407 15.989 13.407" fill="#fff"/><polygon points="15.989 7.151 15.989 9.071 15.989 10.235 15.989 10.242 23.445 10.242 23.445 10.242 23.455 10.242 23.517 9.548 23.658 7.981 23.732 7.151 15.989 7.151" fill="#fff"/></svg>',
	},
	{
		name: 'CSS',
		description: 'Style your pages. Add color, spacing, and layout.',
		link: '/lessons/css/intro-to-css',
		color: '#663399',
		icon: '<svg viewBox="0 0 1000 1000" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><path fill="#639" d="M0 0H840A160 160 0 0 1 1000 160V840A160 160 0 0 1 840 1000H160A160 160 0 0 1 0 840V0Z"/><path fill="#fff" d="m358.1,920c-64.23-.06-103.86-36.23-103.1-102.79,0,0,0-168.39,0-168.39,0-33.74,9.88-59.4,29.64-76.96,35.49-34.19,117.83-36.27,152.59.52,21.42,18.89,29.5,57.48,27.58,93.49h-73.72c.56-14.15-.19-35.58-8.51-43.65-10.81-14.63-39.36-12.91-46.91,2.32-4.64,8.26-6.96,20.49-6.96,36.67v146.18c0,30.65,10.65,46.15,31.96,46.49,9.96,0,17.53-3.62,22.68-10.85,7.19-8.58,8.31-27.58,7.73-41.32h73.72c5.04,70.07-36.32,119.16-106.71,118.29Zm234.04,0c-71.17.98-103.01-49.66-101.04-118.29h69.59c-1.93,29.92,8.35,57.17,32.99,55.27,10.99,0,18.73-3.44,23.2-10.33,8.5-12.59,10.09-48.95-2.06-63.02-8.49-13.55-39.03-25.51-55.16-33.57-23.03-11.02-39.61-24.1-49.75-39.26-22.87-33.64-20.75-107.48,11.34-137.4,31.18-36.92,112.61-38.62,143.82-.77,19.25,19.51,27.66,57.9,26.03,93.23h-67.02c.57-14.52-.8-37.95-6.44-46.49-3.95-7.23-11.43-10.85-22.42-10.85-19.59,0-29.38,11.71-29.38,35.12.21,24.86,9.9,35.06,32.48,45.45,29.24,11.36,66.42,30.76,79.9,54.24,40.2,71.54,12.62,180.82-86.09,176.65Zm224.76,0c-71.17.98-103.01-49.66-101.04-118.29h69.59c-1.93,29.92,8.35,57.17,32.99,55.27,10.99,0,18.73-3.44,23.2-10.33,8.5-12.59,10.09-48.95-2.06-63.02-8.49-13.55-39.03-25.51-55.16-33.57-23.03-11.02-39.61-24.1-49.75-39.26-22.87-33.64-20.75-107.48,11.34-137.4,31.18-36.92,112.61-38.62,143.82-.77,19.25,19.51,27.66,57.9,26.03,93.23h-67.02c.57-14.52-.8-37.95-6.44-46.49-3.95-7.23-11.43-10.85-22.42-10.85-19.59,0-29.38,11.71-29.38,35.12.21,24.86,9.9,35.06,32.48,45.45,29.24,11.36,66.42,30.76,79.9,54.24,40.2,71.54,12.62,180.82-86.09,176.65Z"/></svg>',
	},
	{
		name: 'JavaScript',
		description: 'Make your pages respond. Add life to your code.',
		link: '/lessons/javascript/intro-to-javascript',
		color: '#F7DF1E',
		icon: '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="28" height="28" fill="#FFCA28"/><path d="M19 25.2879L21.0615 23.9237C21.2231 24.4313 22.2462 25.6368 23.5385 25.6368C24.8308 25.6368 25.4308 24.931 25.4308 24.463C25.4308 23.1878 24.1112 22.7382 23.4774 22.5223C23.374 22.4871 23.289 22.4581 23.2308 22.4328C23.2009 22.4198 23.1558 22.4025 23.0979 22.3804C22.393 22.1111 19.7923 21.1175 19.7923 18.2373C19.7923 15.065 22.8538 14.7002 23.5462 14.7002C23.9991 14.7002 26.1769 14.7557 27.2615 16.7939L25.2615 18.1898C24.8231 17.3015 24.0946 17.0081 23.6462 17.0081C22.5385 17.0081 22.3077 17.8201 22.3077 18.1898C22.3077 19.227 23.5112 19.6919 24.5273 20.0844C24.7932 20.1871 25.0462 20.2848 25.2615 20.3866C26.3692 20.91 28 21.7666 28 24.463C28 25.8136 26.8672 28.0002 24.0154 28.0002C20.1846 28.0002 19.1692 25.7003 19 25.2879Z" fill="#3E3E3E"/><path d="M9 25.5587L11.1487 24.1953C11.317 24.7026 11.9713 25.638 12.9205 25.638C13.8698 25.638 14.3557 24.663 14.3557 24.1953V15.0002H16.9982V24.1953C17.041 25.4636 16.3376 28.0002 13.2332 28.0002C10.379 28.0002 9.19242 26.3039 9 25.5587Z" fill="#3E3E3E"/></svg>',
	},
	{
		name: 'Python',
		description: 'Learn a language built for logic. Use it outside the browser.',
		link: '/lessons/python/intro-to-python',
		color: '#3776AB',
		icon: '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.0164 2C10.8193 2 9.03825 3.72453 9.03825 5.85185V8.51852H15.9235V9.25926H5.97814C3.78107 9.25926 2 10.9838 2 13.1111L2 18.8889C2 21.0162 3.78107 22.7407 5.97814 22.7407H8.27322V19.4815C8.27322 17.3542 10.0543 15.6296 12.2514 15.6296H19.5956C21.4547 15.6296 22.9617 14.1704 22.9617 12.3704V5.85185C22.9617 3.72453 21.1807 2 18.9836 2H13.0164ZM12.0984 6.74074C12.8589 6.74074 13.4754 6.14378 13.4754 5.40741C13.4754 4.67103 12.8589 4.07407 12.0984 4.07407C11.3378 4.07407 10.7213 4.67103 10.7213 5.40741C10.7213 6.14378 11.3378 6.74074 12.0984 6.74074Z" fill="url(#paint0_linear_87_8204)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M18.9834 30C21.1805 30 22.9616 28.2755 22.9616 26.1482V23.4815L16.0763 23.4815L16.0763 22.7408L26.0217 22.7408C28.2188 22.7408 29.9998 21.0162 29.9998 18.8889V13.1111C29.9998 10.9838 28.2188 9.25928 26.0217 9.25928L23.7266 9.25928V12.5185C23.7266 14.6459 21.9455 16.3704 19.7485 16.3704L12.4042 16.3704C10.5451 16.3704 9.03809 17.8296 9.03809 19.6296L9.03809 26.1482C9.03809 28.2755 10.8192 30 13.0162 30H18.9834ZM19.9015 25.2593C19.1409 25.2593 18.5244 25.8562 18.5244 26.5926C18.5244 27.329 19.1409 27.9259 19.9015 27.9259C20.662 27.9259 21.2785 27.329 21.2785 26.5926C21.2785 25.8562 20.662 25.2593 19.9015 25.2593Z" fill="url(#paint1_linear_87_8204)"/><defs><linearGradient id="paint0_linear_87_8204" x1="12.4809" y1="2" x2="12.4809" y2="22.7407" gradientUnits="userSpaceOnUse"><stop stop-color="#327EBD"/><stop offset="1" stop-color="#1565A7"/></linearGradient><linearGradient id="paint1_linear_87_8204" x1="19.519" y1="9.25928" x2="19.519" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#FFDA4B"/><stop offset="1" stop-color="#F9C600"/></linearGradient></defs></svg>',
	},
	// Two more cards, completing one full row of the new 7-column grid (see
	// .skills below) and previewing that there's more beyond the five ready
	// tracks above. Real brand marks, same sourcing as the five above (see
	// the comment at the top of this block) and the same "comingSoon" badge
	// treatment LessonsIndex.vue's own not-ready-yet tracks use. Link goes
	// straight to /lessons/ (like the button below), since neither is a
	// real page here yet.
	{
		name: 'TypeScript',
		description: 'Coming soon.',
		link: '/lessons/',
		color: '#3178C6',
		comingSoon: true,
		icon: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="28" height="28" rx="1.312" fill="#3178c6"/><path d="M18.245,23.759v3.068a6.492,6.492,0,0,0,1.764.575,11.56,11.56,0,0,0,2.146.192,9.968,9.968,0,0,0,2.088-.211,5.11,5.11,0,0,0,1.735-.7,3.542,3.542,0,0,0,1.181-1.266,4.469,4.469,0,0,0,.186-3.394,3.409,3.409,0,0,0-.717-1.117,5.236,5.236,0,0,0-1.123-.877,12.027,12.027,0,0,0-1.477-.734q-.6-.249-1.08-.484a5.5,5.5,0,0,1-.813-.479,2.089,2.089,0,0,1-.516-.518,1.091,1.091,0,0,1-.181-.618,1.039,1.039,0,0,1,.162-.571,1.4,1.4,0,0,1,.459-.436,2.439,2.439,0,0,1,.726-.283,4.211,4.211,0,0,1,.956-.1,5.942,5.942,0,0,1,.808.058,6.292,6.292,0,0,1,.856.177,5.994,5.994,0,0,1,.836.3,4.657,4.657,0,0,1,.751.422V13.9a7.509,7.509,0,0,0-1.525-.4,12.426,12.426,0,0,0-1.9-.129,8.767,8.767,0,0,0-2.064.235,5.239,5.239,0,0,0-1.716.733,3.655,3.655,0,0,0-1.171,1.271,3.731,3.731,0,0,0-.431,1.845,3.588,3.588,0,0,0,.789,2.34,6,6,0,0,0,2.395,1.639q.63.26,1.175.509a6.458,6.458,0,0,1,.942.517,2.463,2.463,0,0,1,.626.585,1.2,1.2,0,0,1,.23.719,1.1,1.1,0,0,1-.144.552,1.269,1.269,0,0,1-.435.441,2.381,2.381,0,0,1-.726.292,4.377,4.377,0,0,1-1.018.105,5.773,5.773,0,0,1-1.969-.35A5.874,5.874,0,0,1,18.245,23.759Zm-5.154-7.638h4V13.594H5.938v2.527H9.92V27.375h3.171Z" fill="#ffffff" fill-rule="evenodd"/></svg>',
	},
	{
		name: 'React',
		description: 'Coming soon.',
		link: '/lessons/',
		color: '#53C1DE',
		comingSoon: true,
		icon: '<svg viewBox="0 0 32 32" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.6789 15.9759C18.6789 14.5415 17.4796 13.3785 16 13.3785C14.5206 13.3785 13.3211 14.5415 13.3211 15.9759C13.3211 17.4105 14.5206 18.5734 16 18.5734C17.4796 18.5734 18.6789 17.4105 18.6789 15.9759Z" fill="#53C1DE"/><path fill-rule="evenodd" clip-rule="evenodd" d="M24.7004 11.1537C25.2661 8.92478 25.9772 4.79148 23.4704 3.39016C20.9753 1.99495 17.7284 4.66843 16.0139 6.27318C14.3044 4.68442 10.9663 2.02237 8.46163 3.42814C5.96751 4.82803 6.73664 8.8928 7.3149 11.1357C4.98831 11.7764 1 13.1564 1 15.9759C1 18.7874 4.98416 20.2888 7.29698 20.9289C6.71658 23.1842 5.98596 27.1909 8.48327 28.5877C10.9973 29.9932 14.325 27.3945 16.0554 25.7722C17.7809 27.3864 20.9966 30.0021 23.4922 28.6014C25.9956 27.1963 25.3436 23.1184 24.7653 20.8625C27.0073 20.221 31 18.7523 31 15.9759C31 13.1835 26.9903 11.7923 24.7004 11.1537ZM24.4162 19.667C24.0365 18.5016 23.524 17.2623 22.8971 15.9821C23.4955 14.7321 23.9881 13.5088 24.3572 12.3509C26.0359 12.8228 29.7185 13.9013 29.7185 15.9759C29.7185 18.07 26.1846 19.1587 24.4162 19.667ZM22.85 27.526C20.988 28.571 18.2221 26.0696 16.9478 24.8809C17.7932 23.9844 18.638 22.9422 19.4625 21.7849C20.9129 21.6602 22.283 21.4562 23.5256 21.1777C23.9326 22.7734 24.7202 26.4763 22.85 27.526ZM9.12362 27.5111C7.26143 26.47 8.11258 22.8946 8.53957 21.2333C9.76834 21.4969 11.1286 21.6865 12.5824 21.8008C13.4123 22.9332 14.2816 23.9741 15.1576 24.8857C14.0753 25.9008 10.9945 28.557 9.12362 27.5111ZM2.28149 15.9759C2.28149 13.874 5.94207 12.8033 7.65904 12.3326C8.03451 13.5165 8.52695 14.7544 9.12123 16.0062C8.51925 17.2766 8.01977 18.5341 7.64085 19.732C6.00369 19.2776 2.28149 18.0791 2.28149 15.9759ZM9.1037 4.50354C10.9735 3.45416 13.8747 6.00983 15.1159 7.16013C14.2444 8.06754 13.3831 9.1006 12.5603 10.2265C11.1494 10.3533 9.79875 10.5569 8.55709 10.8297C8.09125 9.02071 7.23592 5.55179 9.1037 4.50354ZM20.3793 11.5771C21.3365 11.6942 22.2536 11.85 23.1147 12.0406C22.8562 12.844 22.534 13.6841 22.1545 14.5453C21.6044 13.5333 21.0139 12.5416 20.3793 11.5771ZM16.0143 8.0481C16.6054 8.66897 17.1974 9.3623 17.7798 10.1145C16.5985 10.0603 15.4153 10.0601 14.234 10.1137C14.8169 9.36848 15.414 8.67618 16.0143 8.0481ZM9.8565 14.5444C9.48329 13.6862 9.16398 12.8424 8.90322 12.0275C9.75918 11.8418 10.672 11.69 11.623 11.5748C10.9866 12.5372 10.3971 13.5285 9.8565 14.5444ZM11.6503 20.4657C10.6679 20.3594 9.74126 20.2153 8.88556 20.0347C9.15044 19.2055 9.47678 18.3435 9.85796 17.4668C10.406 18.4933 11.0045 19.4942 11.6503 20.4657ZM16.0498 23.9915C15.4424 23.356 14.8365 22.6531 14.2448 21.8971C15.4328 21.9423 16.6231 21.9424 17.811 21.891C17.2268 22.6608 16.6369 23.3647 16.0498 23.9915ZM22.1667 17.4222C22.5677 18.3084 22.9057 19.1657 23.1742 19.9809C22.3043 20.1734 21.3652 20.3284 20.3757 20.4435C21.015 19.4607 21.6149 18.4536 22.1667 17.4222ZM18.7473 20.5941C16.9301 20.72 15.1016 20.7186 13.2838 20.6044C12.2509 19.1415 11.3314 17.603 10.5377 16.0058C11.3276 14.4119 12.2404 12.8764 13.2684 11.4158C15.0875 11.2825 16.9178 11.2821 18.7369 11.4166C19.7561 12.8771 20.6675 14.4086 21.4757 15.9881C20.6771 17.5812 19.7595 19.1198 18.7473 20.5941ZM22.8303 4.4666C24.7006 5.51254 23.8681 9.22726 23.4595 10.8426C22.2149 10.5641 20.8633 10.3569 19.4483 10.2281C18.6239 9.09004 17.7698 8.05518 16.9124 7.15949C18.1695 5.98441 20.9781 3.43089 22.8303 4.4666Z" fill="#53C1DE"/></svg>',
	},
].map((section) => ({ ...section, link: withBase(section.link) }));

// Icons are the outline set from ../../../../project-icons/outline (same
// source the favicon was picked from), used as-is: `stroke="currentColor"`
// on every one of these files means they just inherit whatever CSS color
// is set on the badge wrapping them, no per-icon color edits needed.
const whySyntaxia = [
	{
		title: 'No installs needed',
		detail: 'Everything runs in your browser. Nothing to download.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="m7 12 3.5 3.5L17 9" /></svg>',
	},
	{
		title: 'Completely free',
		detail: 'Every lesson is free to read and use. No account needed.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12 12 2h8a2 2 0 0 1 2 2v8l-10 10L2 12Z" /><circle cx="16" cy="6" r="1.3" /></svg>',
	},
	{
		title: 'Made for beginners',
		detail: 'We explain every term. Even simple ones like browser or file.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>',
	},
	{
		title: 'Learn by doing',
		detail: 'Type real code. See it work right away.',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4l14 8-14 8V4Z" /></svg>',
	},
];

const howItWorks = [
	{ step: '1', title: 'Read a short lesson', detail: 'Every page explains one idea, in plain language.' },
	{ step: '2', title: 'Try the code yourself', detail: 'Type it into the built-in editor. No setup needed.' },
	{ step: '3', title: 'See it work right away', detail: 'The live preview updates as soon as you press Run.' },
	{ step: '4', title: 'Check what you learned', detail: 'A short quiz closes out most lessons.' },
];

// Same "user" icon on every line on purpose: each line describes a type of
// person this book is for, so one consistent persona icon reads correctly
// repeated, unlike Why Syntaxia above where each card is a different idea.
const whoThisIsForIcon =
	'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" /></svg>';

const whoThisIsFor = [
	'You have never written a line of code.',
	'You want to learn at your own pace.',
	'You like learning by doing, not just reading.',
	'You are curious how websites and apps actually work.',
];

// Syntaxia has no contact page, so the FAQ's "ask a question" links go to
// the same GitHub issues page SiteFooter.vue's "Report an Issue" uses.
const issuesUrl = 'https://github.com/Joshiii7/syntaxia/issues';

const faqs = [
	{
		question: 'Do I need to know anything about computers before starting?',
		answer: 'No. We start from zero. We explain every term the first time it comes up, even simple ones like browser or file.',
	},
	{
		question: 'Do I need to install anything?',
		answer: 'No. Every lesson has a built-in code editor. It runs right in your browser.',
	},
	{
		question: 'Is this free?',
		answer: 'Yes. Syntaxia is completely free to use. No account is needed.',
	},
	{
		question: 'How long does a lesson take?',
		answer: 'Most lessons take about five to ten minutes. Short enough to finish in one sitting.',
	},
	{
		question: 'What if I get stuck?',
		answer: 'Reread the lesson slowly, or try the example again in the editor. Each idea builds on a small, simple example, so it helps to go back one step.',
	},
	{
		question: 'Do I need a powerful computer or a specific browser?',
		answer: 'No. Any normal computer or laptop works. Use a modern browser, like Chrome, Firefox, Edge, or Safari.',
	},
	{
		question: 'Will this actually teach me enough to build real things?',
		answer: 'Yes. You will build a real project by the end of the HTML section, and every later section builds on real, practical skills.',
	},
];

// --- FAQ accordion, ported from portfolio/js/main.js's initAccordion ---
const openFaqIndex = ref(null);
const faqPanelRefs = ref([]);

function setFaqPanelRef(el, index) {
	if (el) faqPanelRefs.value[index] = el;
}

function clearPendingHeightListener(panel) {
	if (panel._pendingHeightListener) {
		panel.removeEventListener('transitionend', panel._pendingHeightListener);
		panel._pendingHeightListener = null;
	}
}

// Height can't be transitioned to/from `auto` directly: expand to a
// measured pixel value, then swap to `auto` once the transition ends, so
// it stays reflow-safe if the panel's content ever changes size later.
function expandPanel(panel) {
	clearPendingHeightListener(panel);
	panel.style.height = `${panel.scrollHeight}px`;
	const onEnd = (event) => {
		if (event.propertyName !== 'height') return;
		panel.style.height = 'auto';
		panel.removeEventListener('transitionend', onEnd);
		panel._pendingHeightListener = null;
	};
	panel._pendingHeightListener = onEnd;
	panel.addEventListener('transitionend', onEnd);
}

// Pin the current rendered height as a pixel value first, forcing a
// reflow so the browser registers it, then drop to 0, so the collapse
// actually animates instead of snapping shut instantly.
function collapsePanel(panel) {
	clearPendingHeightListener(panel);
	panel.style.height = `${panel.scrollHeight}px`;
	void panel.offsetHeight;
	panel.style.height = '0px';
}

function setFaqOpen(index, isOpen) {
	const panel = faqPanelRefs.value[index];
	if (!panel) return;
	if (isOpen) {
		expandPanel(panel);
	} else {
		collapsePanel(panel);
	}
}

// Accordion behavior: opening one closes whichever other item was open.
function toggleFaq(index) {
	const wasOpen = openFaqIndex.value === index;
	if (openFaqIndex.value !== null && openFaqIndex.value !== index) {
		setFaqOpen(openFaqIndex.value, false);
	}
	openFaqIndex.value = wasOpen ? null : index;
	setFaqOpen(index, !wasOpen);
}
</script>

<template>
	<div ref="rootEl">
		<ScrollProgress />

		<section id="why-syntaxia" class="home-section home-section--surface home-why">
			<div class="home-section__inner">
				<h2 class="home-section__title" data-aos="fade-up">Why <span class="heading-accent">Syntaxia</span></h2>
				<div class="home-why__grid">
					<div v-for="item in whySyntaxia" :key="item.title" class="home-why__card motion-card">
						<span class="home-why__icon" v-html="item.icon" aria-hidden="true"></span>
						<strong>{{ item.title }}</strong>
						<span>{{ item.detail }}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="home-section home-showcase">
			<div class="home-section__inner">
				<h2 class="home-section__title" data-aos="fade-up">What you'll <span class="heading-accent">learn</span></h2>
				<p class="home-section__subtitle" data-aos="fade-up" data-aos-delay="100">Five sections are ready today. More are on the way.</p>

				<ul class="skills" aria-label="Languages, frameworks, and tools Syntaxia teaches or plans to teach">
					<li v-for="section in sections" :key="section.name" class="skills__item motion-card">
						<a
							:href="section.link"
							class="skill-card"
							:class="{ 'skill-card--soon': section.comingSoon }"
							:aria-label="section.comingSoon ? `${section.name} (coming soon)` : `${section.name}: ${section.description}`"
						>
							<div class="glow" :style="{ background: section.color }"></div>
							<div class="content">
								<span v-if="section.comingSoon" class="skill-card__badge">Soon</span>
								<span v-if="section.icon" class="skill-card__icon" v-html="section.icon"></span>
								<span v-else class="skill-card__icon skill-card__icon--text" aria-hidden="true">{{ section.monogram }}</span>
								<p>{{ section.name }}</p>
							</div>
						</a>
					</li>
				</ul>

				<div class="home-showcase__cta" data-aos="fade-up">
					<a :href="withBase('/lessons/')" class="home-showcase__button">
						See all sections <span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			</div>
		</section>

		<section class="home-section home-section--surface home-how">
			<div class="home-section__inner">
				<h2 class="home-section__title" data-aos="fade-up">How it <span class="heading-accent">works</span></h2>
				<div class="home-how__grid">
					<div v-for="item in howItWorks" :key="item.step" class="home-how__card motion-card">
						<span class="home-how__step">{{ item.step }}</span>
						<strong>{{ item.title }}</strong>
						<span>{{ item.detail }}</span>
					</div>
				</div>
			</div>
		</section>

		<section class="home-section home-try-it">
			<div class="home-section__inner home-try-it__inner">
				<h2 class="home-section__title" data-aos="fade-up">Try it <span class="heading-accent">right now</span></h2>
				<p class="home-section__subtitle" data-aos="fade-up" data-aos-delay="100">No sign up, no download. Edit the code below and watch it update.</p>
				<div class="home-try-it__editor" data-aos="fade-up">
					<WebPlayground
						layout="side-by-side"
						preview-theme="dark"
						:panes="['html']"
						:initial-html="'<h1>Hello, world!</h1>\n<p>Change this text and watch the preview update.</p>'"
						preview-height="360px"
					/>
				</div>
			</div>
		</section>

		<section class="home-section home-section--surface home-who">
			<div class="home-section__inner">
				<h2 class="home-section__title" data-aos="fade-up">Who this <span class="heading-accent">is for</span></h2>
				<ul class="home-who__list">
					<li v-for="line in whoThisIsFor" :key="line" class="motion-card">
						<span class="home-who__icon" v-html="whoThisIsForIcon" aria-hidden="true"></span>
						<span>{{ line }}</span>
					</li>
				</ul>
			</div>
		</section>

		<section id="faq" class="home-section home-faq">
			<div class="home-section__inner home-faq__layout">
				<div class="home-faq__intro" data-aos="fade-up">
					<h2 class="home-section__title">Frequently asked <span class="heading-accent">questions</span></h2>
					<p>The things people usually want to know before they open their first lesson.</p>
					<p>
						Don't see your question here?
						<a :href="issuesUrl" target="_blank" rel="noopener noreferrer">
							Ask it on GitHub
							<span class="sr-only">(opens in a new tab)</span>
						</a>
						and it'll get a direct answer.
					</p>
					<a :href="issuesUrl" class="home-showcase__button home-faq__button" target="_blank" rel="noopener noreferrer">
						Ask a question
						<span class="sr-only">(opens in a new tab)</span>
					</a>
				</div>

				<div class="accordion" data-aos="fade-up" data-aos-delay="100">
					<div v-for="(faq, index) in faqs" :key="faq.question" class="accordion-item">
						<h3>
							<button
								:id="`faq-trigger-${index}`"
								type="button"
								class="accordion-trigger"
								:aria-expanded="openFaqIndex === index"
								:aria-controls="`faq-panel-${index}`"
								@click="toggleFaq(index)"
							>
								<span>{{ faq.question }}</span>
								<span class="accordion-icon" aria-hidden="true"></span>
							</button>
						</h3>
						<div
							:id="`faq-panel-${index}`"
							class="accordion-panel"
							:class="{ 'is-open': openFaqIndex === index }"
							role="region"
							:aria-labelledby="`faq-trigger-${index}`"
							:aria-hidden="openFaqIndex !== index"
							:ref="(el) => setFaqPanelRef(el, index)"
						>
							<p>{{ faq.answer }}</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!--
			Closing call to action: CtaBanner is itself the section here, its
			dark glow + dot-grid background running edge to edge as a banner,
			with its content capped at 80rem inside it. Only the content zooms
			in, like portfolio's CTA band.
		-->
		<CtaBanner content-aos="zoom-in-up" />
	</div>
</template>

<style scoped>
.home-section {
	position: relative;
	padding: 64px 24px;
}

/*
 * Section bands, handled the way portfolio's home page does it: flat tones
 * that alternate between the page color (the default, no class) and a
 * raised surface (--color-surface, see style.css), so each section reads
 * as its own band. The hero above HomeSections sits on the page color, so
 * the first section (Why Syntaxia) starts on the surface and the rest
 * alternate from there. Cards and accordion items inside a surface band
 * switch to --color-surface-card so they still stand apart from it.
 */
.home-section--surface {
	background: var(--color-surface);
}

.home-section--surface .home-why__card,
.home-section--surface .home-how__card,
.home-section--surface .home-who__list li,
.home-section--surface .accordion-item {
	background: var(--color-surface-card);
}

/* One word per title in the brand color, e.g. "How it <works>", like
   portfolio's .heading-accent. useHomeMotion scrambles it into place. */
.heading-accent {
	color: var(--vp-c-brand-1);
}

/*
 * 80rem (1280px at the default 16px root size) applies to every section's
 * content by default. "Try it right now" is the one deliberate exception:
 * it overrides this back to full width further down (.home-try-it__inner),
 * since that's the page's interactive centerpiece and reads better
 * spanning the whole viewport than boxed in at the same width as every
 * text section.
 */
.home-section__inner {
	position: relative;
	z-index: 1;
	max-width: 80rem;
	margin: 0 auto;
	text-align: center;
}

.home-section__title {
	margin: 0 0 32px;
	font-size: clamp(2rem, 5vw, 3rem);
	line-height: 1.2;
	font-weight: 700;
	color: var(--vp-c-text-1);
	border: none;
	padding: 0;
}

.home-section__subtitle {
	margin: 0 0 40px;
	font-size: clamp(0.95rem, 1.5vw, 1.1rem);
	line-height: 1.6;
	color: var(--vp-c-text-2);
}

/* Why Syntaxia */

/*
 * Why, How and Who all use the same fixed column counts (4 on desktop,
 * 2 on tablets, 1 on phones) instead of auto-fit, so a row never ends with
 * one orphaned card and the cards always fill the 80rem content width.
 */
.home-why__grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;
}

@media (min-width: 640px) {
	.home-why__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.home-why__grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.home-why__card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 24px 20px;
	border-radius: 10px;
	border: 1px solid transparent;
	background: var(--vp-c-bg-soft);
	text-align: center;
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
}

.home-why__card:hover,
.home-why__card:focus-within {
	transform: translateY(-4px);
	border-color: color-mix(in srgb, var(--color-brand-400) 40%, transparent);
	background: var(--vp-c-bg-elv);
	box-shadow: 0 12px 28px rgba(10, 15, 31, 0.35);
}

/* Fixed brand-400 accent, not theme-swapped, matching .home-how__step's
   badge below: a decorative icon accent stays the same color in light and
   dark mode rather than following --vp-c-brand-1. */
.home-why__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: color-mix(in srgb, var(--color-brand-400) 20%, transparent);
	color: var(--color-brand-400);
	transition: transform 0.25s ease, background-color 0.25s ease;
}

/* :deep() is required here: v-html-injected markup isn't part of this
   component's compiled template, so it never gets the scoped data-v
   attribute a plain descendant selector like `.home-why__icon svg` would
   need to match it. */
.home-why__icon :deep(svg) {
	width: 28px;
	height: 28px;
}

.home-why__card:hover .home-why__icon,
.home-why__card:focus-within .home-why__icon {
	transform: scale(1.1);
	background: color-mix(in srgb, var(--color-brand-400) 32%, transparent);
}

.home-why__card strong {
	font-size: 1.2rem;
	color: var(--vp-c-brand-1);
}

.home-why__card span {
	font-size: 0.95rem;
	line-height: 1.6;
	color: var(--vp-c-text-2);
}

/*
 * What you'll learn: ported from portfolio's Services page "Skills &
 * Tools" grid (skills-grid.component.scss), including the glow-on-hover
 * treatment. Each card's own color (set inline from the section's `color`
 * field) drives both the glow and, on hover, how far it spreads and how
 * strong it gets.
 *
 * Same layout as portfolio's: the grid's columns stretch across the full
 * 80rem content width (auto-fit, at least 150px each, which works out to
 * exactly seven columns at 80rem), while each card stays a square capped
 * at 8rem, centered in its column.
 */
.skills {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 1rem;
}

.skill-card {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	aspect-ratio: 1 / 1;
	max-width: 8rem;
	margin: 0 auto;
	cursor: pointer;
	border-radius: 16px;
	transition: transform 0.3s ease;
}

.skill-card:hover,
.skill-card:focus-visible {
	transform: scale(1.05);
}

.skill-card:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.skill-card .glow {
	position: absolute;
	inset: 0;
	border-radius: 16px;
	filter: blur(15px);
	opacity: 0.15;
	transition: filter 0.3s ease, opacity 0.3s ease;
}

.skill-card:hover .glow,
.skill-card:focus-visible .glow {
	filter: blur(30px);
	opacity: 0.7;
}

/* Slightly dimmed at rest, full strength on hover/focus: a second signal
   (on top of the muted glow color) that a track isn't ready yet, without
   disabling the (still real, navigable) link. Same treatment
   LessonsIndex.vue's own "comingSoon" cards use. */
.skill-card--soon {
	opacity: 0.82;
}

.skill-card--soon:hover,
.skill-card--soon:focus-visible {
	opacity: 1;
}

.skill-card .content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding: 1rem;
	border-radius: 16px;
	backdrop-filter: blur(10px);
	background-color: rgba(10, 15, 31, 0.45);
}

/* "Coming soon" status pill, same treatment LessonsIndex.vue uses.
   Light-on-dark, unlike this page's theme-swapping --vp-c-text-* vars,
   since this sits on .skill-card's own always-dark .content backdrop
   regardless of site theme, not on the page canvas. */
/* Pinned to the top of the card, so the icon and label sit in the same
   centered spot as on every other card. */
.skill-card__badge {
	position: absolute;
	top: 8px;
	left: 50%;
	transform: translateX(-50%);
	display: inline-flex;
	align-items: center;
	padding: 1px 7px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.14);
	color: rgba(255, 255, 255, 0.85);
	font-weight: 700;
	font-size: 9px;
	letter-spacing: 0.03em;
	text-transform: uppercase;
}

.skill-card__icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 50px;
	height: 50px;
	margin-bottom: 0.5rem;
}

.skill-card__icon :deep(svg) {
	width: 100%;
	height: 100%;
}

/* Plain-initials fallback for a card with no curated logo (none currently
   need it, see the comment on `sections`, kept for the same reason
   LessonsIndex.vue keeps its own copy: a future card added without one
   shouldn't render blank). Fixed white, not a theme-swapping --vp-c-text-*
   var, for the same reason as .skill-card__badge above: it sits on
   .skill-card's always-dark backdrop. */
.skill-card__icon--text {
	color: #ffffff;
	font-weight: 800;
	font-size: 11px;
	letter-spacing: 0.02em;
}

.skill-card .content p {
	margin: 0.5rem 0 0;
	color: var(--vp-c-text-1);
	font-size: 0.875rem;
	font-weight: 600;
	text-align: center;
	line-height: 1.3;
}

/* "See all sections" button below the grid, linking to /lessons/, the same
   bordered-pill treatment as About page's "View on GitHub" link
   (.about-creator__link there): a secondary action, not the page's main
   CTA (the hero's own button and the closing CtaBanner already own that),
   so it stays understated rather than brand-filled. */
.home-showcase__cta {
	margin-top: 32px;
	text-align: center;
}

.home-showcase__button {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 12px 24px;
	border-radius: 999px;
	border: 1px solid var(--vp-c-divider);
	color: var(--vp-c-text-1);
	font-size: 1rem;
	font-weight: 600;
	transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.home-showcase__button:hover {
	border-color: var(--color-brand-400);
	color: var(--color-brand-400);
	background: color-mix(in srgb, var(--color-brand-400) 8%, transparent);
	transform: translateY(-1px);
}

.home-showcase__button:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

/* How it works */

.home-how__grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;
}

@media (min-width: 640px) {
	.home-how__grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.home-how__grid {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.home-how__card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	padding: 24px 20px;
	border-radius: 10px;
	border: 1px solid transparent;
	background: var(--vp-c-bg-soft);
	text-align: center;
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
}

.home-how__card:hover,
.home-how__card:focus-within {
	transform: translateY(-4px);
	border-color: color-mix(in srgb, var(--color-brand-400) 40%, transparent);
	background: var(--vp-c-bg-elv);
	box-shadow: 0 12px 28px rgba(10, 15, 31, 0.35);
}

.home-how__step {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	margin-bottom: 6px;
	border-radius: 50%;
	background: var(--color-brand-400);
	color: var(--color-navy-900);
	font-weight: 700;
	font-size: 14px;
	transition: transform 0.25s ease;
}

.home-how__card:hover .home-how__step,
.home-how__card:focus-within .home-how__step {
	transform: scale(1.1);
}

.home-how__card strong {
	font-size: 1.2rem;
	color: var(--vp-c-text-1);
}

.home-how__card span {
	font-size: 0.95rem;
	line-height: 1.6;
	color: var(--vp-c-text-2);
}

/*
 * Try it right now: the editor stays inside the same 80rem content width
 * as every other section. WebPlayground's side-by-side layout has square,
 * borderless edges (it was built to run flush to the viewport), so this
 * wrapper gives it a frame and rounded corners now that it sits boxed in.
 */
.home-try-it__editor {
	overflow: hidden;
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	text-align: left;
}

/* Who this is for */

.home-who__list {
	list-style: none;
	margin: 0;
	padding: 0;
	text-align: center;
}

.home-who__list {
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;
}

@media (min-width: 640px) {
	.home-who__list {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (min-width: 1024px) {
	.home-who__list {
		grid-template-columns: repeat(4, minmax(0, 1fr));
	}
}

.home-who__list li {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	padding: 20px 18px;
	border-radius: 8px;
	border: 1px solid transparent;
	background: var(--vp-c-bg-soft);
	font-size: 0.95rem;
	color: var(--vp-c-text-2);
	transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
}

.home-who__list li:hover,
.home-who__list li:focus-within {
	transform: translateY(-4px);
	border-color: color-mix(in srgb, var(--color-brand-400) 40%, transparent);
	background: var(--vp-c-bg-elv);
	box-shadow: 0 12px 28px rgba(10, 15, 31, 0.35);
}

.home-who__icon {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: color-mix(in srgb, var(--color-brand-400) 16%, transparent);
	color: var(--color-brand-400);
	transition: transform 0.25s ease;
}

.home-who__list li:hover .home-who__icon,
.home-who__list li:focus-within .home-who__icon {
	transform: scale(1.1);
}

.home-who__icon :deep(svg) {
	width: 16px;
	height: 16px;
}

/* FAQ accordion, ported from portfolio's .accordion / .accordion-item */

/*
 * Side by side from 1024px, like portfolio's FAQ section: the heading, a
 * short intro and an "ask a question" button on the left (sticky, so it
 * stays in view beside a long list), the questions on the right. Stacks on
 * smaller screens.
 */
.home-faq__layout {
	display: grid;
	gap: 2.5rem;
	text-align: left;
}

@media (min-width: 1024px) {
	.home-faq__layout {
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		gap: 4rem;
		align-items: start;
	}

	.home-faq__intro {
		position: sticky;
		top: calc(var(--vp-nav-height) + var(--topic-nav-height) + 1.5rem);
	}
}

.home-faq .home-section__title {
	margin-bottom: 1.25rem;
	text-align: left;
}

.home-faq__intro p {
	margin: 0;
	color: var(--vp-c-text-2);
	font-size: 1rem;
	line-height: 1.7;
}

.home-faq__intro p + p {
	margin-top: 1rem;
}

.home-faq__intro p a {
	color: var(--vp-c-brand-1);
	text-decoration: underline;
}

.home-faq__intro p a:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: 2px;
}

.home-faq__button {
	margin-top: 1.5rem;
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

.accordion {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.accordion-item {
	background: var(--vp-c-bg-soft);
	border: 1px solid var(--vp-c-divider);
	border-radius: 12px;
	overflow: hidden;
}

.accordion-item h3 {
	margin: 0;
	padding: 0;
	border: none;
	font-size: inherit;
}

.accordion-trigger {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	background: none;
	border: none;
	color: var(--vp-c-text-1);
	font-weight: 600;
	font-size: 1rem;
	text-align: left;
	padding: 16px 20px;
	cursor: pointer;
}

.accordion-trigger:hover {
	color: var(--vp-c-brand-1);
}

.accordion-trigger:focus-visible {
	outline: 2px solid var(--color-brand-500);
	outline-offset: -2px;
}

/* Plus-to-minus icon, built from two CSS pseudo-elements rather than an
   icon font or SVG: a horizontal and vertical bar form a plus sign, and
   the vertical bar fades out and rotates when the panel is expanded,
   leaving just the horizontal bar behind as a minus sign. */
.accordion-icon {
	position: relative;
	flex-shrink: 0;
	width: 16px;
	height: 16px;
}

.accordion-icon::before,
.accordion-icon::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	background: var(--vp-c-brand-1);
	transform: translate(-50%, -50%);
	transition: transform 0.2s ease, opacity 0.2s ease;
}

.accordion-icon::before {
	width: 100%;
	height: 2px;
}

.accordion-icon::after {
	width: 2px;
	height: 100%;
}

.accordion-trigger[aria-expanded='true'] .accordion-icon::after {
	opacity: 0;
	transform: translate(-50%, -50%) rotate(90deg);
}

.accordion-panel {
	height: 0;
	overflow: hidden;
	transition: height 0.35s ease;
}

.accordion-panel.is-open {
	height: auto;
}

.accordion-panel p {
	margin: 0;
	padding: 0 20px 18px;
	font-size: 1rem;
	line-height: 1.6;
	color: var(--vp-c-text-2);
}

@media (prefers-reduced-motion: reduce) {
	.accordion-panel {
		/* Not 0/none: a transitionend event still has to fire so the JS step
		   that swaps height to auto after expanding still runs. */
		transition-duration: 0.001s;
	}

	.accordion-icon::before,
	.accordion-icon::after {
		transition: none;
	}
}
</style>
