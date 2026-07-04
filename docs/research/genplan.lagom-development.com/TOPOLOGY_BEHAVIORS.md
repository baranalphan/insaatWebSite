# Genplan App (genplan.lagom-development.com) — Topology & Behaviors

WordPress theme "3d" — **Smarto s3d** engine (webpack bundle). Libraries: gsap + ScrollTrigger, axios, Hammer (touch drag), IMask/Cleave (phone inputs), lodash. One `<canvas>` (1920×1080) draws aerial frames; SVG overlays on top for polygons.

Config: `/wp-content/themes/3d/assets/s3d/settings.json` (saved to scratchpad: s3d-settings.json). Key values:
- Masterplan flyby: frames 0–119 at `assets/s3d/images/flyby/masterplan/{n}.jpg`; `masterplan_mobile/{n}.jpg`; `masterplan_dark/{n}.jpg`. Default frame (activeSlide): 31. rotateSpeedDefault 20, mouseSpeed 0.5, north at frame 100, compass start 35°, clouds enabled (black-clouds-png-4.png drifting overlay).
- Queue flybys: `flyby.1.outside/inside`, `flyby.2.outside` (each their own frames dir).
- unit_statuses: 0 Продано (warning bg), 1 Свободно (success), 2 Резерв, 3 Бронь, 4 Недоступно (danger), 6 Заблоковано.
- pinsInfo zones/pins: commerce, tennis, fountain, greenzone ×2, dogs, quay, kinder ×4 (each with photo popup).
- markers: 9 items (orange circle pins on masterplan).
- Currency $, show_prices true, lang uk, phone +38 093 60 60 300.
- Google map embed link for "Розташування на карті" popup.

## Views (URL param routing: ?type=...)
1. `?type=genplan` — masterplan rotator. UI chrome:
   - Top-left pill toolbar: home icon | ↩ Назад | Планування | **Генплан** (active, orange) | Навігація ▾ (appears in deeper views) | ‹ collapse
   - Below: Фільтр button (disabled at genplan level)
   - Top-right: phone pill | Зворотній дзвінок pill | fullscreen icon | scales (Порівняння/compare) icon | На сайт + burger
   - "ПОРІВНЯННЯ" ghost heading top-left (compare drawer trigger area); "Показати тільки відмінності" ghost text top-right (compare-mode toggle)
   - Bottom-left: day/night toggle (sun orange active / moon), "Розташування на карті" button (Google-map popup), "Інструкція" button (help modal)
   - Bottom-center: 360° pill with ← → arrows (also drag-to-rotate via Hammer; rotation steps through preloaded jpg frames on canvas)
   - Bottom-right: compass (N arrow rotates with frame), smarto watermark logo
   - Zone labels (orange rounded chips): "7 Черга", "6 Черга", "Продано", "Lagom UNIQUE (Старт продажу)"
   - Zone outline polygons (white stroke) + orange pins; zone hover → tint; zone click → drill into queue flyby or UNIQUE flyby
2. `?type=flyby&flyby=1&side=outside` — queue rotator (same chrome + Фільтр enabled + Навігація dropdown + queue selector chip "6 Черга ▾" in toolbar). House polygons color-coded: green tint = available, red = sold/unavailable; hover shows tooltip; click available → flat page. Loading screen between views: dark overlay, white house-shape spinner, "ЗАВАНТАЖЕННЯ / Зачекайте трохи..." + % counter in 360 pill.
3. `?type=flat&id=N` — house page (scrollable white sheet with big rounded top corners over the flyby):
   - Hero: house photo bg, "LAGOM / МІСТЕЧКО БІЛЯ ОЗЕРА..." + "Гортай ↓"
   - Card: photo w/ "ДОСТУПНО ⓘ" green badge + "Перепродаж від власника" label
   - Stat tiles: 3 ванних кімнат / 4 кімнат / 3 площа ділянки (line icons)
   - Floor plan tabs: 1-Й ПОВЕРХ / 2-Й ПОВЕРХ / МАНСАРДА → plan image + room list w/ dotted leaders (Номер 137, Загальна площа 154 м², Тамбур 3.82 м² …), Площа першого поверху 77.47 м²
   - "ЗАЛИШИЛИСЬ ПИТАННЯ?" form (Ваше ім'я, phone) + КОНТАКТИ + ВІДКРИТИ НА КАРТІ + ОТРИМАТИ КОНСУЛЬТАЦІЮ buttons
   - FAQ accordion (11 questions, + icons)
   - "У МЕНЕ ЗАЛИШИЛИСЬ ПИТАННЯ" orange pill button
4. `?type=plannings` — Планування module (card grid of house types) — extract during build.
5. Favourites & Compare (Порівняння) modules — heart/scales; drawer UI.

## Data sources
- settings.json (public, saved)
- 2× POST /wp-admin/admin-ajax.php at boot → returns units + polygons (per-frame coords). **Intercept response bodies via Playwright during build phase** to mirror as static JSON.
- House photos/renders under uploads dirs 1/, 6/, 7/, 8/.

## Day/night
- Toggle swaps to `masterplan_dark/{n}.jpg` set with loading screen. Dark mode also restyles pins/labels (unchanged chrome).

## Embedding
- /lagom/ and /unique/ pages embed this app in an `interactive` section iframe (~1091px tall). Clone: `/genplan` route in same Next app, embedded via iframe on project pages.

## Session 2 findings (flyby 1-inside, 2-outside, flat pages — 2026-07-03)
- Header "Навігація" dropdown (`.Dropdown[data-s3d2-header-flyby-dropdown]` in header__left): hidden on genplan; visible+`highlighted` (orange) in flyby/flat views. Opens on CSS :hover; chevron rotates 180°. Title = current flyby name in flyby view ("6 Черга"/"Lagom UNIQUE"/"7 Черга"), "Навігація" in flat view. Current view's item gets `.active` (grayed, unclickable). In flat view the "Котедж" header button also becomes visible+active.
- Flyby configs (settings.json): 1_outside activeSlide 91, top-aligned; 1_inside activeSlide 1, BOTTOM-aligned (canvas + svg preserveAspectRatio xMidYMax slice); 2_outside frames dir `2_outside_new`, activeSlide 31, top. All flybys: compass north=89 start=40; controlPoints [1,31,61,91].
- Overlay svgWraps: all 4 control points in DOM at once; rendered from raw svg3d files + per-unit `data-sale` + `polygon__filter-select|deselect`. Units missing from flats.json (2_outside ids 117–143) get deselect + no data-sale → pointer-events none.
- InfoBox hover tooltip (flyby views only): `.js-s3d-infoBox.s3d-infoBox` fixed 280px card; shows ONLY for sale 1 (доступно, bg #83af8d) and 2 (резерв, bg rgb(109,104,5)); sold units hover-highlight nothing and show no box. Content: status chip + fund badge (#icon-Construction) + "Вілла №N" + img_big + deferral/area/type/area_land labels. Semantic vars: success #83af8d, warning #f1b161, danger #e7473a.
- sale semantics: 0=продано/sold, 1=доступно/available, 2=резерв — the clone's earlier SALE_LABELS were inverted.
- Flat page (?type=flat&id=N): `.s3d-villa` is its own scroll container; children: navigation (fixed bottom-right, opacity 0→1 after hero), s3d-villa-hero (sticky top-0 z--1: img_big + title + description + Гортай↓), container (sheet: ПЛАНУВАННЯ heading, card with status badge + deferral caption — NO prices anywhere; stat tiles incl. НАВІС/ДРУГЕ СВІТЛО when set; floor tabs; 3D/2D планування toggle only when flat_levels_photo[level].with exists — without=3D, with=2D; explication table with Номер/Загальна площа on top and Площа поверху at bottom; form with comment textarea; contacts with socials+address; FAQ), flyby-wrapper (static img of the unit's flyby at CONTROL POINT 1 always + cp1 polygons all `.active`, current unit `.active-flat`, PAR xMidYMid slice), up-arrow ВГОРУ.
- ?controlPoint=N on flat URLs does NOT change the flat page; it is carried state. "На 3D моделі" navigates to ?type=flyby&flyby=F&side=S&controlPoint=N&markedFlat=id (F/S from assotiated_flat_builds_with_flybys: build 1→1/inside, 6→1/outside, 8→2/outside). Clicking a unit in a flyby at settled control frame≠1 appends &controlPoint={frame} to the flat URL.

## Clone scope decisions
- Rotation: use all 120 desktop day frames if size acceptable, else every 2nd (60). Preload with % progress like original.
- Dark set: include (it's a visible feature); mobile set: reuse desktop (responsive canvas) unless size cheap.
- Polygons/pins/labels: mirror real data captured from admin-ajax + DOM extraction; store as local JSON.
- Flat pages: template + real data for available units (from ajax payload); FAQ text verbatim.
- Compare/favourites: UI shell with functional add/remove against local state.
