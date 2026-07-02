# Home sections — Agent B scope (projects + locations)

Follow `_shared-porting-rules.spec.md`. Fragments in `docs/research/components/html/`. Components in `src/components/home/`.

## 1. HomeProjects (`home-projects.html` → `HomeProjects.tsx`)
Interaction model: **scroll-driven pinned cards** (desktop ≥1025px only) + Swiper sliders.

- Heading `.mulish-64[data-reveal-text]` "Наші проєкти" → RevealText (import from `src/components/site/effects`).
- Two `.project` cards (`[data-project]`). EXACT original GSAP (from the site's own JS):
  ```js
  gsap.timeline({
    scrollTrigger: { trigger: card, start: "50% 50%", end: () => `+=${card.clientHeight}`, scrub: true, pin: true, pinSpacing: false },
  }).to(card, { scale: 0.5, y: "-=25vh", autoAlpha: 0 }, "scale");
  ```
  Wrap in `gsap.matchMedia("(min-width: 1025px)")`; on mobile no pin (cards stack naturally).
- Each card has a Swiper (photos, per fragment): original config `new Swiper(el, { modules: [Mousewheel, Pagination], slidesPerView: 1, ... })` with pagination (progress bar + bullets per fragment classes). Auto-advance: `gsap.to({}, { duration: 5.5, onComplete: () => swiper.slideNext(), ease: "none" })` — restarts on slideChange, plays only while card's section is active (ScrollTrigger `onToggle` play/pause). Loop enabled.
  Use `swiper/react` (`Swiper`, `SwiperSlide`) + `swiper/modules` { Mousewheel, Pagination }. Import swiper CSS in the component: `import "swiper/css"; import "swiper/css/pagination";`
- Buttons: "Детальніше" → `Btn href="/lagom"` / `"/unique"` per card; "На карті" → `Btn variant="border"` linking to `/contacts`.
- Keep all card inner markup exactly: price rows (від 1370 $/м² etc.), badge "8 будинків доступно", index "01/02", location rows.

## 2. HomeLocations (`home-locations.html` → `HomeLocations.tsx`)
Interaction model: fade-ins + interactive map. 
- Port structure exactly: `.container-map` (data-speed 0.8, data-fade), `.container-locations` (cards list, data-speed 1.1, data-fade), `.swiper.swiper-fade` (data-fade), map overlay card ("КМ LAGOM" photo card with `Btn` "Детальніше" → /lagom).
- The original uses Google Maps JS API (custom cream style, custom pins `/images/theme_icons_map-pin.svg` + `map-pin-active.svg`). WE CANNOT use their API key. Implement `MapCanvas` sub-component: a `div.map-static` filling `[data-google-map]` container with `background-image: url(/images/map-static.webp)` (asset will be added later — reference it now), plus absolutely-positioned pin imgs at approx. positions (55%/35% and 60%/40%) using the pin svgs. Add a `// TODO(map-asset)` comment. Everything else (cards, layout, fades) exact.
- Location cards content verbatim from fragment (Котеджне містечко LAGOM / Вулиця Грушевського, 57... / 093 60 60 300; Комплекс резиденцій UNIQUE / вулиця Івана Франка, 49... / 073 70 60 300). "Дивитись на карті →" links: `<a>` with original classes; clicking sets active pin (React state toggles pin img src active/default) — approximation of original pan behavior.

## Acceptance
- `npx tsc --noEmit` passes; no layout-shift hacks; all classes/attrs match fragments.
