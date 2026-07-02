# Shared Porting Rules (all builders)

## Source of truth
- Original HTML fragments: `docs/research/components/html/<name>.html` — port EXACTLY: same tags, class names, attribute order/values (incl. `data-speed`, `data-lag`, `data-fade`, `data-unclip`, `aria-*`). These classes are styled by the already-ported CSS (`src/styles/site-index.css` + per-page css files) — do NOT restyle with Tailwind, do not invent classes.
- Behaviors: `docs/research/lagom-development.com/BEHAVIORS.md`.

## URL rewrites when porting
- `https://lagom-development.com/wp-content/uploads/{Y}/{M}/{file}` → `/images/{Y}_{M}_{file}`
- `.../wp-content/themes/bamboo/assets/img/{path}` → `/images/theme_{path with / → _}`
- `.../uploads/.../*.mp4` → `/videos/{file}`
- Internal links: `https://lagom-development.com/` → `/`, `/lagom/` → `/lagom`, `/unique/` → `/unique`, `/contacts/` → `/contacts`; genplan links → `/genplan`
- Keep full `srcset`/`sizes` attributes with all rewritten URLs (use plain `<img>`, NOT next/image — fidelity over optimization).

## JSX conversion
- `class` → `className`; `style="--i: 0"` → `style={{ "--i": 0 } as CSSProperties}`; svg attrs camelCase; self-close void tags.
- WP menu `<li id="menu-item-N" class="menu-item ...">` → just `<li className="menu-item">`.

## Shared components (already built — import, don't recreate)
- `Btn` (`src/components/site/Btn.tsx`) — renders `.btn` with per-letter `.btn-text` spans + `.btn-icon.mask.def|line`. Use for ALL `.btn` elements found in fragments.
- `SocialIcons`, `SiteHeader`, `SiteFooter`, `SmoothScroll`, `PopupProvider`/`usePopups`, `ContactForm` (`src/components/site/Popups.tsx`).
- Video play buttons: `onClick={() => openVideo("<hash>", "video"|"shorts")}` via `usePopups()`. Keep original button markup/classes.

## Shared behavior components to CREATE in `src/components/site/effects.tsx` (Agent A creates; others import)
1. `RevealText` — for `[data-reveal-text]` headings: splits text into `<div class="word">` > `<div class="char">` per letter (preserve spaces between words as normal spaces in layout: words are inline-block divs separated by spaces), sets `aria-label` with full text on the heading. GSAP: chars `opacity: 0.2 → 1`, `stagger: 0.05`, `duration ~0.9`, ease `power2.out`, ScrollTrigger `{ trigger: el, start: "top 75%" }`, plays once per direction (`toggleActions: "play none none reverse"`).
2. `useFadeIn` / `FadeIn` for `[data-fade]` elements: `gsap.from(el, { autoAlpha: 0, y: 40, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%" } })`.
3. `useUnclip` for benefit images with `data-unclip`: `gsap.from(el, { clipPath: "inset(50% 0% 50% 0%)", ease: "none", scrollTrigger: { trigger: el, scrub: true, start: "clamp(0% 60%)", end: "clamp(0% 15%)" } })` — desktop only (`gsap.matchMedia("(min-width: 1025px)")`); below 1025px no clip (data-unclip max-width 1024px).
All GSAP work: `useLayoutEffect` + `gsap.context(...)` cleanup; `gsap.registerPlugin(ScrollTrigger)`.

## Rules
- `"use client"` on any component using hooks/GSAP/Swiper.
- TypeScript strict, no `any`. Named exports. 2-space indent.
- Do NOT run `npm run dev`. Verify with `npx tsc --noEmit` before finishing.
- Do not modify: `src/app/layout.tsx`, `src/styles/*`, shared components, `package.json` (gsap + swiper already installed).
- Components live in `src/components/home/`, `src/components/project/` (lagom/unique shared), `src/components/contacts/` as specified per task.
