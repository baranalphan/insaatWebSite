# Villa Page (?type=flat&id=84|109|28[&controlPoint=61]) — Spec

Owner files: `src/components/genplan/flat/GenplanFlat.tsx`, `src/components/genplan/flat/flat-data.json`
(if needed), `src/components/genplan/filter/FilterPanel.tsx` (one label fix), new CSS ONLY in
`src/styles/genplan/clone-glue.css` (append a clearly-marked villa section). Do NOT touch
GenplanApp.tsx / fragments.ts / FrameViewer.tsx (another builder owns them).
All `.s3d-villa*` classes are already styled — s3d2.css is a full mirror of the original theme CSS.
Match original DOM class names exactly so that CSS applies.

## 1. Structure (captured from original)

```
div.s3d-villa                     ← scroll container: position relative, overflow-y auto, 100vh, z-index 2
  div.s3d-villa__navigation       ← fixed bottom-right row, z 101, opacity 0 → 1 after scrolling past hero
    button.ButtonIconLeft.active.ButtonIconLeft--secondary  → svg + span "Geri Arama"  (opens callback form popup: dispatch click on existing [data-open-form] behavior — simplest: render this button with attribute data-open-form="" so the existing GenplanApp delegate opens the form)
    button.ButtonIconLeft.js-s3d__create-pdf                → svg + span "PDF" (call window.print())
    button.ButtonIconLeft.js-s3d-add__favourite             → input + svg + spans "Karşılaştırmaya eklendi"/"Karşılaştırma" (toggle local state class active)
    button.ButtonIconLeft                                   → svg + span "3D Modelde"  → router.push back to flyby (see §4)
  div.s3d-villa-hero              ← position sticky; top 0; height ~100vh; z-index -1 (sits behind sheet)
    div.s3d-villa-hero__img-wrapper > img.s3d-villa-hero__img  src = unit.img_big ?? unit.img
    div.s3d-villa-hero__info
      h1.s3d-villa-hero__title        = unit.title            ("UNIQUE" / "LAGOM")
      span.s3d-villa-hero__line
      p.s3d-villa-hero__description   = unit.description (contains <br> → dangerouslySetInnerHTML)
      + scroll pill "Kaydır" + ↓ arrow button (original: "Гортай" small white pill at hero bottom center;
        clicking scrolls the container to the sheet top, smooth)
  div.s3d-villa__container        ← existing sheet (keep current inner content, with §2–3 fixes);
                                     white sheet with big rounded top corners overlapping hero
  div.s3d-villa__flyby-wrapper    ← static "on the flyby" strip at page bottom (§4)
    div.s3d-villa__flyby
      img  src = /genplan/flyby/{frameSet}/1.jpg   (control-point-1 frame of the unit's flyby — ALWAYS cp 1, even when URL has controlPoint=61; verified on original)
      svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"  ← NOTE: xMidYMid (not YMin/YMax)
        polygons = control-point-1 polygon set of the unit's flyby, each with class
        "s3d-svg__build js-s3d-svg__build polygon__filter-select active"; the CURRENT unit's polygon
        additionally gets "active-flat". Reuse data: import {FLYBY1_OUTSIDE_OVERLAYS, FLYBY1_INSIDE_OVERLAYS,
        FLYBY2_OUTSIDE_OVERLAYS} from "../fragments"; take ["1"], extract the <svg> inner polygons
        (string transform: replace polygon__filter-deselect→polygon__filter-select, append " active",
        add " active-flat" to polygon with data-id == unit.id, swap preserveAspectRatio to "xMidYMid slice");
        render via dangerouslySetInnerHTML of the whole svg string. Polygons here are non-interactive.
  div.s3d-villa__up-arrow         ← in-flow bottom block: orange circle button ↑ + label "YUKARI";
                                     click scrolls container to top (smooth)
```

Unit build → flyby mapping (settings.json `assotiated_flat_builds_with_flybys`):
build "1" → flyby 1/inside → frameSet `1_inside`; build "6" → 1/outside → `1_outside`;
build "8" → 2/outside → `2_outside`. (Targets: id84=build1, id28=build6, id109=build8.)

## 2. Sheet content fixes (existing s3d-villa__floor markup)

- **SALE_LABELS bug (inverted)**: correct mapping is `0→"Satıldı"`, `1→"Satışta"`, `2→"Rezerve"`.
  Badge colors (original computed): sale1 chip #83af8d (green, class status-1), sale2 olive
  rgb(109,104,5), sale0 warning #f1b161. Ensure `.status-N` classes produce those (add glue CSS if
  s3d2.css lacks them). Badge shows text + ⓘ icon (svg + `s3d-villa__floor-details__info-status__svg-tip`).
- **No prices**: original shows NO price / price_m2 anywhere. The `info-prices-wrap` contains ONLY
  the deferral text, e.g. "Sahibinden Satılık" (id28), "Taksit: Kasım 2027'ye kadar" (id109),
  "Kişiye Özel Taksit Seçenekleri" (id84) — i.e. `unit.deferral_period`. Remove price rendering.
- **Stat tiles**: currently 3 (bathrooms/rooms/area_land). Original shows up to 5 — add when field
  is non-zero/non-empty: `navis` → tile value unit.navis, label "Sundurma"; `second_light` →
  value unit.second_light, label "Galeri Boşluğu". (id84 has navis=1, second_light=1 → 5 tiles like
  original "НАВІС"/"ДРУГЕ СВІТЛО"; id109/id28 → 3 tiles.) Keep line-icon style of existing tiles.
- **Section heading**: original sheet starts with big centered heading "ПЛАНУВАННЯ" with thin rule
  lines left+right → Turkish "PLANLAR" (keep existing title-wrap markup with __line spans; currently
  it says "Villa No: {number}" — original heading is the static word; move "Номер/No" into the table).
- **Explication table** (right panel): original rows top-to-bottom: "No: {number}" and
  "Toplam Alan: {area} m²" FIRST (bold-ish header rows), then room rows (property_name … property_flat m²),
  then bottom bold row "Kat Alanı" = sum of room areas for the level ({level total} m²).
  Remove the current extra "Toplam Alan" bottom row (it belongs at top).
- **Floor tabs**: unchanged (1. Kat / 2. Kat / Çatı Katı from flat_levels_photo keys).
- **3D/2D plan toggle**: below the plan slider, two pills (orange active):
  "3D Plan" (default, active) / "2D Plan". 3D image = flat_levels_photo[level].without;
  2D image = flat_levels_photo[level].with. Render the toggle ONLY if the current level has a
  `with` variant (id84 has both; id109/id28 have only `without` → no toggle, like original).
  Original classes: ButtonWithoutIcon pills inside a centered wrapper (see screenshot
  s3d-villa flat84 — "3D ПЛАНУВАННЯ | 2D ПЛАНУВАННЯ").
- **Contact block**: keep existing 2-column block but match original: left column title
  "Sorularınız mı var?" + sub-note + form fields WITH labels above ("Adınız:*", "Telefonunuz:*",
  "Yorumunuz" textarea) + submit "Bilgi Alın" (orange). Right column: "İletişim" title, phone
  button `+38 093 60 60 300` (tel:), social icon row (Telegram/YouTube/Facebook/Instagram circles —
  simple inline SVG or existing icons), "Satış Ofisi" caption + address "Sokilnyky köyü,
  Hrushevskoho Cad., Lviv, Lviv Oblastı, 81130", and orange "Haritada Aç" button (existing
  js-s3d-flat__3d-tour class → opens map popup via GenplanApp delegate — keep that class).
- **FAQ**: unchanged (exists). After FAQ: orange pill button "Sorularım var" (existing).

## 3. controlPoint & scroll behaviors

- Read `useSearchParams()` inside GenplanFlat for `controlPoint` (do NOT change the component's
  props signature — GenplanApp is owned by another builder).
- controlPoint does NOT change the static flyby image (always cp 1) — it is only carried through
  to the "3D Modelde" navigation.
- Navigation fade-in: listen to the container scroll; when scrollTop > ~60% of hero height →
  navigation opacity 1 (CSS transition ~0.25s), else 0 (original: fixed bar, opacity 0 at top).
- "Kaydır ↓" → container.scrollTo({top: hero height, behavior: "smooth"}); "YUKARI" → scrollTo top.

## 4. "3D Modelde" navigation

`router.push('/genplan?type=flyby&flyby=F&side=S' + (controlPoint ? '&controlPoint='+cp : '') +
'&markedFlat=' + unit.id)` where F/S from unit.build per mapping above (original also appends id;
markedFlat is what highlights the unit's polygon back on the flyby).

## 5. FilterPanel one-liner

Line ~170: status text for table rows — `f.sale === "2" ? "Sahibinden Satılık" : "Satışta"` is wrong;
use SALE mapping 0→"Satıldı", 1→"Satışta", 2→"Rezerve".

## 6. QA gates

- `npx tsc --noEmit` + `npm run build` pass.
- /genplan?type=flat&id=84: hero UNIQUE + tagline; badge "Satışta" green; no price; 5 stat tiles;
  2 floor tabs; 3D/2D toggle present; bottom strip shows 1_inside frame 1 with unit 84 highlighted.
- /genplan?type=flat&id=109: hero LAGOM; 3 tabs (1/2/Çatı); no 3D/2D toggle; strip = 2_outside frame 1.
- /genplan?type=flat&controlPoint=61&id=28: same as 109 but strip = 1_outside frame 1; "3D Modelde"
  URL contains flyby=1&side=outside&controlPoint=61&markedFlat=28.
