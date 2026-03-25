# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page personal portfolio for Rayane Watteeuw (BTS SIO student / Full Stack developer). No build system, no package manager, no framework — plain HTML, CSS, and vanilla JavaScript.

## File Structure

- `index.html` — single HTML file containing all sections (profil, formations, stages, compétences, projets, veille, contact)
- `style/modern.css` — active stylesheet (linked in `<head>`)
- `style/style.css`, `style/style2.css`, `style/style2026.css` — older/unused stylesheets (not linked)
- `js/main.js` — all JavaScript (loaded at bottom of `<body>`)
- `images/` — all static assets (photos, icons, CV PDF)

## Development

Open `index.html` directly in a browser — no build step or server required. Changes to `modern.css` or `main.js` are reflected on page reload.

## Architecture

The page is a single scrolling document. Navigation links use `href="#section-id"` anchors. `main.js` initializes five modules on `DOMContentLoaded`:

- **initNavigation** — scroll spy that adds `.active` to the current nav link and `.scrolled` to the navbar
- **initNavIndicator** — animated sliding underline on `.nav-links` that tracks the active/hovered link
- **initHamburger** — mobile menu toggle (`#main-nav.open`)
- **initCarousel** — `#projets` section card slider with prev/next buttons and touch/swipe support
- **initScrollAnimations** — IntersectionObserver-based `fadeInUp` animations on cards + skill bar fill animations

CSS design tokens are defined as custom properties on `:root` in `modern.css`. Primary color is `#6366f1` (indigo), with pink and amber accents.

## Language

The site content is in French. Keep all user-facing text in French when making changes.
