---
title: About Syntaxia
description: What Syntaxia is, who built it, and why it exists (an interactive programming book taught through live code editors and quizzes).
# Turns off the default theme's right-hand "On this page" outline (and the
# narrow-viewport dropdown version of it). AboutPage.vue renders its own
# hero/heading, so that outline just duplicated it as a second, redundant
# sidebar next to the real content. Same fix /lessons/index.md already uses
# for the same reason. aside: false goes one step further and drops the now-
# empty aside column itself, so it stops reserving layout width next to the
# page's full-bleed sections (see the .VPDoc:has(.about-hero) rules in
# style.css). /lessons/index.md doesn't need this extra step since it isn't
# full-bleed.
outline: false
aside: false
---

<AboutPage />
