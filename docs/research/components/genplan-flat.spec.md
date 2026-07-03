# Genplan Flat page + Filter panel — spec

Second genplan agent. Scope: the house detail view (`?type=flat&id=N`) + the Фільтр side panel. Another agent builds the viewer core in parallel — do NOT touch src/app/genplan/* routes or viewer components; you build standalone components under `src/components/genplan/flat/` and `src/components/genplan/filter/` that the core mounts.

## Data (already in repo)
- `public/genplan/data/flats.json` — 118 units (id, build, floor, rooms, type, area, area_land, price "218 200", price_m2, img/photos local under /genplan/devbase/, images.without.3d/2d (floor plan images), flat_levels_photo per level, properties (room name/size list keyed by property_id, with property_level), bathrooms, bedrooms, mansarda, fund "2 кв. 2027", deferral_period, title/description).
- `public/genplan/data/floor-28.json` — getFloor sample payload for flat 28 (reference for the per-level room table shape).
- Original flat page DOM: `docs/research/genplan.lagom-development.com/data/flat-28.html` — THE markup ground truth. Port structure/classes 1:1 (s3d/s3d2 classes; CSS already ported at src/styles/genplan/s3d.css + s3d2.css — imported by the core's layout, don't import again).
- Filter panel markup: `docs/research/genplan.lagom-development.com/data/ui-fragments/s3d-filter-wrap.html` (+ s3d-filter__*.html, s3d-card__*.html fragments).

## Components
1. `src/components/genplan/flat/GenplanFlat.tsx` (named export; props `{ id: string }`):
   - Loads /genplan/data/flats.json (fetch, client), finds unit.
   - Sections per flat-28.html: hero band (project title/desc, "Гортай ↓" hint), white rounded sheet containing: photo card with status badge ("ДОСТУПНО ⓘ" / "Перепродаж від власника" label logic per data), stat tiles (bathrooms / rooms / area_land with the same line icons — icons are inline SVGs in the DOM snapshot, port them), floor tabs (1-Й ПОВЕРХ / 2-Й ПОВЕРХ / МАНСАРДА per flat's levels from flat_levels_photo + properties by property_level) → plan image + room list with dotted leaders + level totals, "Номер", "Загальна площа".
   - Forms: "ЗАЛИШИЛИСЬ ПИТАННЯ?" (name+phone, demo submit → success state), КОНТАКТИ block, buttons ВІДКРИТИ НА КАРТІ / ОТРИМАТИ КОНСУЛЬТАЦІЮ (port markup; consultation opens the same demo form modal), FAQ accordion (11 questions VERBATIM from flat-28.html, + / – toggle icons), "У МЕНЕ ЗАЛИШИЛИСЬ ПИТАННЯ" pill.
   - Scroll behavior: content is its own scroll container overlaying the viewer (rounded top corners, bg per CSS).
2. `src/components/genplan/filter/FilterPanel.tsx` (named export; props `{ open: boolean; onClose: () => void; onApply?: (ids: string[]) => void }`):
   - Port s3d-filter fragments: sticky top (close ✕, results count), range sliders (price, area, area_land — implement with two native range inputs styled by existing classes or minimal glue CSS), checkboxes (rooms etc. per fragment), view-type toggle (card/table), results as cards (s3d-card fragments: image, status chip, type, area, price) and table view (s3d-filter__table head/rows per fragment).
   - Filtering logic over flats.json client-side; count updates live.
3. `src/components/genplan/flat/types.ts` — shared FlatUnit type (align with the viewer agent's `src/components/genplan/types.ts` naming; duplicate here to avoid cross-dependency, comment `// FLAT-TYPES v1`).

## Rules
- "use client"; ported s3d classes only + optional glue in `src/styles/genplan/flat-glue.css` (create only if needed; will be imported at assembly).
- Verbatim Ukrainian strings from flat-28.html (FAQ questions/answers, labels).
- Images: rewrite any lagom.devbase.pro or /assets/img URLs → `/genplan/devbase/<path with / → _>` (files exist; ls to verify).
- `npx tsc --noEmit` passes. Commit when done.
