# Project pages (/lagom + /unique) — Agent C scope

Follow `_shared-porting-rules.spec.md`. Both pages share ONE template — build parameterized components in `src/components/project/`, then two thin pages are assembled later (you export the components; do NOT create app routes).

Fragments: `docs/research/components/html/lagom-*.html` and `unique-*.html`. Use the lagom fragments as the canonical markup; where unique differs (content only), extract content into a typed data object (`src/components/project/data.ts` — `lagomData`, `uniqueData` with a `ProjectPageData` interface).

Import shared effects from `src/components/site/effects` (RevealText, FadeIn/useFadeIn, useUnclip) and `Btn`, `usePopups`, `ContactForm` from `src/components/site/`.
Import page CSS ONCE in each component file is NOT needed — page css (`src/styles/site-lagom.css`) is imported at page level during assembly. Just use the classes.

Components (one per section, mirroring fragment names):
1. `ProjectIntro` (lagom-intro/unique-intro): giant grey display heading (LAGOM/UNIQUE), subtitle block, CTA (openCallback), address row, index 001, arrow (data-fade). RevealText where `data-reveal-text` present.
2. `ProjectPreview` (lagom-preview): full-bleed photo band with white overlay text; keep data-speed attrs; the image likely has scroll parallax via data-speed only.
3. `ProjectDescription` (lagom-description): heading with RevealText + **animated counters**: numbers count up from 0 to target over ~1.5s (ease power1.out) when scrolled into view (ScrollTrigger once, start "top 80%"). Build `CounterNumber` sub-component (client) that animates textContent via gsap fromTo with snap. Targets/labels verbatim from fragments (lagom: від 132 до 7?? м² «Площа будинків», до N сот «Площа ділянок», до N м² «У подарунок» (orange), від 1370 $ «За квадратний метр»; unique per its fragment).
4. `ProjectVideo` (lagom-video/unique-video): `<video>` band — src `/videos/lagom-hd.mp4` / `/videos/unique-hd.mp4`, `muted loop playsInline preload="metadata"`, play/pause via ScrollTrigger onEnter/onLeave (in-view autoplay). Port fragment markup (`section.video`) exactly.
5. `ProjectOverview`: RevealText heading section.
6. `ProjectGallery` (lagom-gallery): **desktop: pinned horizontal scroll gallery** — panels ("Локація", "Безпека", "Дозвілля") slide horizontally while section pinned. Implement: `gsap.matchMedia("(min-width:1025px)")` → `gsap.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: "none", scrollTrigger: { trigger: section, pin: true, scrub: true, end: () => "+=" + (track.scrollWidth - window.innerWidth) } })`. Panels + captions (grey overlay text card) exactly per fragment. Mobile: horizontal swipe (native overflow-x scroll, keep classes).
7. `ProjectInteractive` (lagom-interactive): `section.interactive` > `div.interactive-map.fit-cover` — render an `<iframe src="/genplan" title="Генплан" />` filling the container (className per fragment; add width/height 100% via existing classes only — check `src/styles/site-lagom.css` for `.interactive-map iframe` rules; if none, add an `iframe` element with `style={{width:"100%",height:"100%",border:0}}`).
8. `ProjectInfrastructure` (lagom-infrastructure): "Міська інфраструктура" heading (RevealText) + horizontal cards strip (6 хв пішки Скейтпарк, 5 хв машиною ТРЦ King Cross Leopolis, ...). Fragment is large (43KB) — it's a Swiper (check classes: likely `.swiper` with slides). Use swiper/react with slidesPerView "auto" + free mode feel per classes; pagination if present in fragment.
9. `ProjectMedia` (lagom-media): heading + **click tabs** (Фото / Відео / Проєкти) with underline indicator + content slider per tab. Tab switch = React state; each tab's slides come from the fragment (extract per-tab content into data.ts). Video-type items open popup video (`data-hash` attrs in fragment). Swiper for the slider (slidesPerView auto/1 per classes).
10. `ProjectCharacteristics` (lagom-characteristics): numbered accordion rows (01 Інженерні мережі … 06 Подарунок від LAGOM) with image per row; expand/collapse like HomeAccordion (grid-template-rows CSS transition, `.expanded` class, single-expand); rows/images/content verbatim (unique has its own set).
11. `ProjectCtaForm` (lagom-cta-form): same pattern as home CTA — reuse `ContactForm`, decor images, RevealText heading.

## Acceptance
- `npx tsc --noEmit` passes.
- `data.ts` fully typed, contains all content differences between lagom and unique (extract from both fragment sets — every string verbatim).
- All swiper CSS imported where used.
