---
title: Lessons
description: Browse Syntaxia's interactive programming lessons by language.
# Without this, VitePress matches this page against the '/lessons/' sidebar
# config key too (same prefix as every actual lesson page), which silently
# gives this index page the has-sidebar nav/content layout (a reserved
# empty gutter on the left instead of the same full-width header every
# other public page (home, /paths/) gets), with no sidebar content to show
# in it (LessonSidebar.vue only renders on individual lesson pages).
sidebar: false
# The default theme's own right-hand "On this page" outline just lists this
# page's two headings, not useful here, and reads as a second, redundant
# sidebar next to the real content. Off for this page only.
outline: false
# Goes one step further than outline: false and drops the now-empty aside
# column itself, so it stops reserving layout width next to this page's
# full-bleed sections (see the .VPDoc:has(.lessons-hero) rules in
# style.css), the same fix about.md uses for the same reason.
aside: false
---

<LessonsIndex />
