# Genplan Viewer (core) — spec

Clone of genplan.lagom-development.com/3d/ — a Smarto s3d masterplan viewer. Everything runs client-side from static JSON + preloaded jpg frames.

## Available assets (already in repo)
- `public/genplan/flyby/masterplan/{0..119}.jpg` — day frames (1920×1080)
- `public/genplan/flyby/masterplan_dark/{0..119}.jpg` — night frames
- `public/genplan/flyby/1_outside/{0..119}.jpg` — queue-1 flyby frames
- `public/genplan/data/masterplan-polygons.json` — `{ "1"|"31"|"61"|"91": [{polygon attrs incl. points, data-type, data-flyby, data-side, class}] }` — zone polygons per control frame (viewBox 1920×1080)
- `public/genplan/data/flyby1-polygons.json` — same shape; house polygons with `data-id` (flat id), `data-build`, `data-floor` (78 per frame)
- `public/genplan/data/flats.json` — 118 units: id, build, floor, rooms, type, area, area_land, price, price_m2, img (local /genplan/devbase/...), images, flat_levels_photo, properties (room list), bathrooms, bedrooms, fund/deadline etc.
- `public/genplan/data/structure.json` — per flyby/side/controlFrame: list of flat ids
- `public/genplan/ui/` logo.svg, smarto.svg, black-clouds-png-4.png; `public/genplan/markers/*.svg`; `public/genplan/pins/*.jpg|png`
- CSS ported: `src/styles/genplan/s3d.css` + `s3d2.css` (import at the genplan layout level; original class names work)
- Original UI markup fragments: `docs/research/genplan.lagom-development.com/data/ui-fragments/*.html` (s3d-header, header__left/right, FlybyController, compass, filter panel, menu, loader, popups…) — port markup 1:1 from these.
- Settings reference: activeSlide 31 (masterplan), controlPoints [1,31,61,91], rotateSpeedDefault 20, mouseSpeed 0.5, north at frame 100 (masterplan) / 89 (flyby1), compass start 35°/40°.

## Architecture (all under src/app/genplan + src/components/genplan)
- Route: `src/app/genplan/page.tsx` (client shell) with URL state via search params: `?type=genplan` (default), `?type=flyby&flyby=1&side=outside`, `?type=flat&id=N` (flat view mounts a placeholder component `GenplanFlat` that another agent builds at src/components/genplan/flat/GenplanFlat.tsx — import it lazily with a fallback stub if the file is missing at your time of writing: create a minimal stub GenplanFlat that renders `<div className="s3d-flat-stub" />` and mark with comment `// FLAT-STUB (replaced by flat-page agent)`).
- `src/app/genplan/layout.tsx`: imports the two genplan css files + sets its own metadata title "3d – lagom". The genplan pages must NOT render the site Header/Footer or ScrollSmoother (the root layout is bare, so nothing to suppress — verify).
- `FrameViewer` component: renders current frame `<img>` (or canvas) filling viewport (1920×1080 cover, preserveAspectRatio "xMidYMin slice" behavior = object-fit: cover, object-position top center). Preloads all frames of the active set with a progress % (loading overlay per `ЗАВАНТАЖЕННЯ / Зачекайте трохи…` + % counter in the 360 pill — port loader fragment). Rotation:
  - Arrow buttons: animate frame index +N per click (rotateSpeed 20 frames/sec feel: step through ~30 frames with requestAnimationFrame, easing linear, wrap modulo 120), then settle on the NEAREST control frame [1,31,61,91] so polygons can show.
  - Drag (pointer events): dx * mouseSpeed(0.5) maps to frame steps (~1 frame per 10px), wrap around; on release, snap to nearest control frame.
  - During rotation: hide SVG overlays + pins; after settle: show overlays of that control frame with fade-in.
- `PolygonOverlay`: absolute SVG viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMin slice" rendering the active control frame's polygons. Classes from data (s3d-svg__build). Hover: add class for tint (CSS exists). Click:
  - masterplan zone polygon (data-type=flyby) → navigate `?type=flyby&flyby=X&side=Y` (only flyby=1&side=outside has frames; others show an "unavailable in clone" console warn + do nothing visually except hover)
  - flyby house polygon (data-type=flat) → navigate `?type=flat&id=<data-id>`
  - Status coloring for flyby: join flats.json by id → sale/status → add status class (available = greenish tint class, sold = red class — inspect ported CSS for exact class names used on polygons, e.g. polygon__filter-deselect etc.; replicate observed behavior: sold houses tinted red, available green).
- `ZoneLabels` + `Pins`: masterplan orange chip labels ("7 Черга", "6 Черга", "Продано", "Lagom UNIQUE (Старт продажу)") and circular orange pins — port from ui-fragments/pins-sample + genplan-dom markup with their inline positions; positioned within the same 1920×1080 coordinate space (absolute % positions). Only visible at control frames.
- `Toolbar` (top): port `header__left` fragment (home logo btn, Назад, Планування, Генплан active, Навігація dropdown, collapse ‹) + `header__right` (phone pill, Зворотній дзвінок → opens callback popup markup from fragments, fullscreen toggle (document.documentElement.requestFullscreen), compare scales icon (non-functional OK, keep hover), На сайт → link "/", burger menu → port menu fragment overlay).
- `BottomControls`: day/night toggle (sun/moon — switches frame set to masterplan_dark with its own preload progress), "Розташування на карті" (opens popup with google-maps embed iframe — use settings' embed URL from docs/research/genplan.lagom-development.com/data notes or a maps.google.com/maps?q=Сокільники embed), "Інструкція" (opens helper popup — port s3d__helper-gif fragment), 360° pill with ‹ › arrows, compass (rotates: bearing = startDeg + (frame - northFrame)/120*360; port s3d__compass fragment).
- `Breadcrumb chips` in toolbar for flyby view ("6 Черга ▾" dropdown per fragment) — minimal: switch between genplan/flyby views.
- Clouds: `black-clouds-png-4.png` drifting overlay (CSS animation, slow translateX loop, opacity ~0.5) — masterplan day only (visible in original).
- Mobile (≤768px): port MobileFlybyController / MobileFunctionsMenu fragments for controls; frame images same desktop set.

## Rules
- "use client" everywhere needed; no Tailwind for genplan — use ported s3d css classes; small custom glue CSS allowed in `src/styles/genplan/clone-glue.css` (create; import in genplan layout).
- TypeScript strict; define types for the JSON payloads in `src/components/genplan/types.ts` (FlatUnit, PolygonAttrs, etc.). Load JSONs via fetch from /genplan/data/*.json at runtime (client), cache in state/context.
- URL state via next/navigation useSearchParams + router.push (shallow) — the whole page is one client app.
- `npx tsc --noEmit` must pass. Do not modify files outside src/app/genplan, src/components/genplan, src/styles/genplan/clone-glue.css.
