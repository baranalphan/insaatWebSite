# Flyby Views (1-inside, 2-outside) + Header Dropdown + InfoBox — Spec

Owner files: `src/components/genplan/GenplanApp.tsx`, `src/components/genplan/FrameViewer.tsx`,
`src/components/genplan/types.ts`, `src/components/genplan/fragments.ts` (HEADER_LEFT string only),
`src/styles/genplan/clone-glue.css`. Do NOT touch `flat/GenplanFlat.tsx` or `src/app/genplan/layout.tsx`.

## 1. View model

URL params: `?type=flyby&flyby={1|2}&side={outside|inside}` (+ optional `controlPoint=N`, `markedFlat=ID`).

| flyby/side  | frameSet    | overlays export           | default frame (activeSlide) | frame vertical align | display name  |
|-------------|-------------|---------------------------|------------------------------|----------------------|---------------|
| 1/outside   | `1_outside` | `FLYBY1_OUTSIDE_OVERLAYS` | **91** (currently wrong: 31) | top                  | 6. Etap       |
| 1/inside    | `1_inside`  | `FLYBY1_INSIDE_OVERLAYS`  | 1                            | **bottom**           | Lagom UNIQUE  |
| 2/outside   | `2_outside` | `FLYBY2_OUTSIDE_OVERLAYS` | 31                           | top                  | 7. Etap       |
| masterplan  | `masterplan`/`masterplan_dark` | `MASTERPLAN_OVERLAYS` | 31              | center (as today)    | Genel Plan    |

- All three flyby views exist now — remove the `flybyUnavailable` popup fallback paths for these
  combos (keep the popup for anything else, e.g. unknown flyby ids).
- `?controlPoint=N` (N ∈ 1,31,61,91) overrides the initial frame for a flyby view (arrives via
  villa page "3D Modelde" button). `markedFlat=ID`: after overlay renders, add class `active-flat`
  to `polygon[data-id="ID"]` in the rendered overlay host.
- Compass config for ALL flybys: north=89, startDeg=40 (already in COMPASS.flyby). Masterplan unchanged.
- Theme (day/night) toggle: flybys have NO dark frame set — keep current behavior of using the same
  set (dark toggle only affects masterplan), matching original (original hides/ignores theme in flyby).

## 2. FrameViewer changes

- Add `initialFrame: number` prop. On `frameSet` change, reset `frame`/`frameRef` to `initialFrame`.
- Vertical alignment: the frame `<img>` covers the viewport (object-fit cover). Add prop
  `verticalAlign: "top" | "bottom" | "center"` → `object-position: 50% 0 / 50% 100% / 50% 50%`.
  Original s3d canvas: 1920×1080 scaled to cover, cropped from top for `verticalAlign: top`
  (outside views), from bottom for `1_inside` (verticalAlign: bottom in settings.json).
  The generated overlay SVGs already use matching `preserveAspectRatio` (`xMidYMin slice` outside /
  `xMidYMax slice` inside) — make sure `.s3d-overlay-host svg` positioning matches img positioning
  (both absolute inset-0 full-size; slice PAR handles the crop identically).

## 3. Header dropdown (Navigasyon)

Markup already exists in `HEADER_LEFT` (fragments.ts) as `.Dropdown[data-s3d2-header-flyby-dropdown]`
with `style="display: none;"` and title text "Navigasyon". CSS for open-on-hover already in s3d2.css
(`.Dropdown:hover .Dropdown__content`, chevron rotate, `.highlighted` orange chip).

Behavior from original (do via DOM sync effect in GenplanApp, like existing nav-active effect):
- genplan (masterplan) view: dropdown hidden (`display:none`), between-icon `[data-hide-elements="genplan"]` hidden.
- flyby view: dropdown visible (`display:block`), class `Dropdown highlighted`; title TEXT = current
  view display name ("6. Etap" / "Lagom UNIQUE" / "7. Etap") + existing chevron svg; between-icon visible.
- flat view: dropdown visible + highlighted, title text = **"Navigasyon"**; between-icon visible;
  also `[data-header-flat-plan-group]` "Villa" button becomes visible + `active` (orange) — original
  shows home | Geri | Planlar | Genplan | [Navigasyon ▾] | › | [Villa].
- Dropdown items: `.Dropdown__item.js-s3d-nav__btn[data-flyby][data-side]` — the item matching the
  CURRENT flyby view gets class `active` (CSS renders it grayed, pointer-events none). Others clickable
  → navigate `/genplan?type=flyby&flyby=F&side=S` (existing js-s3d-nav__btn click delegation — extend
  it to allow all three combos instead of only 1/outside).
- Title text container: keep the chevron `<svg>` inside; set only the text node (e.g. wrap text in a
  span when editing HEADER_LEFT, or set firstChild nodeValue).
- The old chip text sync (`.s3d__title.js-s3d-ctr__option__text` → "6. Etap") stays but must use the
  per-view display name.

## 4. InfoBox hover tooltip (all flyby views; NOT masterplan)

Full DOM structure and computed styles: see `docs/research/components/flyby-infobox.spec.md`
(all CSS classes already styled by s3d.css — s3d-infoBox family).

Implementation:
- Render a persistent `<div class="js-s3d-infoBox s3d-infoBox" data-s3d-type="infoBox">` inside the
  app root (sibling of the overlay host). React-rendered (not dangerouslySetInnerHTML) is fine.
- On pointermove over `polygon.js-s3d-svg__build[data-type="flat"]` in the overlay host (delegate on
  the root, e.target closest polygon):
  - Look up unit by `data-id` from `loadFlats()` (import { loadFlats } from "./flat/GenplanFlat").
  - Show ONLY when unit.sale === "1" or "2" (original shows nothing for sold "0" or missing units).
  - Populate: status chip text: sale 1→"Satışta", 2→"Rezerve"; chip inline background:
    1→#83af8d, 2→rgb(109,104,5); badge: `#icon-Construction` svg + unit.fund (e.g. "Q4 2027");
    title "Villa No: {unit.number}"; button "Evi İncele" (class ButtonWithoutIcon show-on-tablet
    ButtonWithoutIcon--secondary — hidden on desktop by CSS); img src = unit.img_big ?? unit.img;
    labels: [unit.deferral_period], "Konut Alanı: <span class=super-text>{area}</span> m²",
    "Plan Tipi: <span class=super-text>{type}</span>", "Arsa Alanı: <span class=super-text>{area_land}</span> ar".
  - Position: fixed; top/left set from cursor: left = clientX + 24, top = clientY − 100; clamp into
    viewport (box is 280px wide, ~470px tall). Add class `s3d-show` + style opacity 1,
    pointer-events painted. Original sets inline `top/left/opacity/pointer-events`.
  - Hide when pointer leaves polygons (pointerover on non-polygon): remove s3d-show, opacity 0.
- Click available/reserve polygon (sale 1|2) → navigate
  `/genplan?type=flat&id={id}` + (current control frame ≠ 1 ? `&controlPoint={cf}` : ``).
  Click sold (sale 0) → nothing. Polygons with no flats.json entry have no data-sale attr →
  CSS pointer-events none already handled by data — ensure click handler ignores them.
  (This replaces the current blanket `data-type=flat → navigate` handler.)

## 5. QA gates for this builder

- `npx tsc --noEmit` passes; `npm run build` passes.
- `/genplan?type=flyby&flyby=1&side=inside` shows bottom-cropped frames starting at frame 1 with
  UNIQUE polygons; hover over unit 83 shows infoBox "Satışta / Villa No: 5 / 301 m² / A / 8.2".
- `/genplan?type=flyby&flyby=2&side=outside` starts at frame 31, chip "7. Etap".
- `/genplan?type=flyby&flyby=1&side=outside` starts at frame 91 (changed from 31).
- Dropdown hover opens list; current item grayed; clicking others switches view with loader.
