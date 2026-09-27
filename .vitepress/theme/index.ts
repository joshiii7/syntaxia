import { computed, defineAsyncComponent, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useRoute } from 'vitepress';
import type { Theme } from 'vitepress';
import Quiz from './components/Quiz.vue';
import HomeSections from './components/HomeSections.vue';
import CtaBanner from './components/CtaBanner.vue';
import HeroVideo from './components/HeroVideo.vue';
import ScrollProgress from './components/ScrollProgress.vue';
import ScrollToTopButton from './components/ScrollToTopButton.vue';
import SiteFooter from './components/SiteFooter.vue';
import LessonSidebar from './components/LessonSidebar.vue';
import Breadcrumb from './components/Breadcrumb.vue';
import TopicNav from './components/TopicNav.vue';
import LessonNav from './components/LessonNav.vue';
import LessonsIndex from './components/LessonsIndex.vue';
import PathsIndex from './components/PathsIndex.vue';
import AboutPage from './components/AboutPage.vue';
import LegalPage from './components/LegalPage.vue';
import './style.css';

export default {
	extends: DefaultTheme,
	Layout() {
		const route = useRoute();
		// Individual lesson pages only, excludes /lessons/ itself, which uses
		// LessonsIndex.vue in its body instead of the sidebar/breadcrumb/nav
		// trio. endsWith, not a plain !==: route.path carries the site's base
		// prefix (e.g. "/syntaxia/lessons/" in dev/prod), which never equals
		// the bare "/lessons/" a straight inequality check compared against,
		// so that older check was actually true for the index page too in
		// any base-prefixed deploy.
		const isLessonRoute = computed(() => route.path.includes('/lessons/') && !route.path.endsWith('/lessons/'));

		// layout-bottom is the default theme's supported slot for content
		// outside the scrolling doc area: a fixed scroll-to-top button and a
		// real, always-present page footer both belong here. So does the
		// scroll progress bar, on every page except an individual lesson
		// (lessons keep their own reading chrome: sidebar, breadcrumb, nav).
		// It's keyed by path so it remounts, and re-measures, on navigation.
		//
		// home-hero-image is the default theme's supported slot for replacing
		// the hero's image side with arbitrary content (it normally renders
		// frontmatter's hero.image). HeroVideo fills it, and style.css pulls
		// that slot out of the layout and stretches it behind the whole hero,
		// so the video becomes the hero's background (hero.image only takes a
		// static source and can't do that).
		//
		// home-hero-before is VPHome's own slot, rendered as the very first
		// thing inside .VPHome, before the hero (full width, since the home
		// layout has no sidebar to share space with, unlike doc-before below).
		//
		// doc-before renders TopicNav on every non-home page, the same bar the
		// home page renders from home-hero-before: it is part of the site
		// header, fixed right under the nav (see TopicNav.vue). An actual lesson
		// page adds Breadcrumb after it, where a track/chapter/lesson trail
		// makes sense (/paths/ and the other standalone pages aren't "in" any
		// one track/lesson).
		//
		// sidebar-nav-before/doc-before/doc-after are the default theme's
		// supported extension points around, respectively, its own
		// (neutralized, see config.mts) sidebar tree and the rendered doc
		// body, this is how LessonSidebar/TopicNav/Breadcrumb/LessonNav slot
		// in without replacing DefaultTheme.Layout wholesale.
		return h(DefaultTheme.Layout, null, {
			'layout-bottom': () => [
				h(SiteFooter),
				h(ScrollToTopButton),
				isLessonRoute.value ? null : h(ScrollProgress, { key: route.path }),
			],
			'home-hero-image': () => h(HeroVideo),
			'home-hero-before': () => h(TopicNav),
			'sidebar-nav-before': () => (isLessonRoute.value ? h(LessonSidebar) : null),
			'doc-before': () => (isLessonRoute.value ? [h(TopicNav), h(Breadcrumb)] : h(TopicNav)),
			'doc-after': () => (isLessonRoute.value ? h(LessonNav) : null),
		});
	},
	enhanceApp({ app }) {
		// CodeMirror is heavy; code-split it into its own chunk so pages
		// without an editor don't pay for it.
		app.component('CodeEditor', defineAsyncComponent(() => import('./components/CodeEditor.vue')));
		app.component('WebPlayground', defineAsyncComponent(() => import('./components/WebPlayground.vue')));
		app.component('Exercise', defineAsyncComponent(() => import('./components/Exercise.vue')));
		app.component('Quiz', Quiz);
		app.component('HomeSections', HomeSections);
		app.component('CtaBanner', CtaBanner);
		app.component('LessonsIndex', LessonsIndex);
		app.component('PathsIndex', PathsIndex);
		app.component('AboutPage', AboutPage);
		app.component('LegalPage', LegalPage);
	},
} satisfies Theme;
