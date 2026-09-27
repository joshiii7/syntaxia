---
title: Accessibility
description: How Syntaxia is built to work with a keyboard, screen readers, reduced motion, and any screen size, plus how to report an accessibility problem you find.
# LegalPage.vue renders its own title banner and headings, so the default
# theme's "On this page" outline and its aside column are turned off, same
# as about.md.
outline: false
aside: false
---

<LegalPage
	title="Accessibility"
	text="How Syntaxia is built to work well for as many learners as possible."
	updated="September 26, 2026"
>

## Keyboard navigation

Every part of the site can be used with a keyboard alone: the navigation, the lesson sidebar, buttons, the FAQ questions, and quizzes. Tab moves between elements, and Enter or Space activates them. A "Skip to content" link at the very start of every page lets keyboard and screen reader users jump past the header straight to the lesson.

## Code editors

Inside a code editor, Tab indents your code, the same as in a real editor. To move focus out of the editor with the keyboard, press Esc and then Tab.

## Readable content

Lessons are written in plain language, and every term is explained the first time it comes up. Text is set at a comfortable size and line height, and headings describe the real structure of each page, so it's easy to scan and to follow with a screen reader.

## Light and dark themes

The site has a light theme and a dark theme. You can switch between them with the toggle in the navigation bar, and your choice is remembered.

## Reduced motion

If your device is set to reduce motion, the scroll animations, the scroll progress bar, and other movement on the site are turned off, and everything simply shows in place.

## Responsive design

The layout adapts to phones, tablets, and desktops. Text, spacing, and tap targets are sized to stay usable on a small screen, rather than shrinking a desktop layout down.

## Clear focus states

Every interactive element shows a visible outline when you reach it with the keyboard, so you can always tell where you are on the page. Focus outlines are never hidden for visual reasons.

## Semantic structure

Pages use native HTML elements like header, nav, main, and footer for what they're meant for. ARIA attributes are only used where they add real information, such as aria-expanded and aria-controls on the FAQ questions.

## An ongoing effort

Accessibility here is something I keep working on, not a checklist I finished once. If anything doesn't work the way you'd expect with a keyboard, a screen reader, or any other assistive technology, I want to hear about it.

## Report an accessibility issue

If you run into an accessibility barrier anywhere on Syntaxia, please let me know so I can fix it:

</LegalPage>
