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

## Clone scope decisions
- Rotation: use all 120 desktop day frames if size acceptable, else every 2nd (60). Preload with % progress like original.
- Dark set: include (it's a visible feature); mobile set: reuse desktop (responsive canvas) unless size cheap.
- Polygons/pins/labels: mirror real data captured from admin-ajax + DOM extraction; store as local JSON.
- Flat pages: template + real data for available units (from ajax payload); FAQ text verbatim.
- Compare/favourites: UI shell with functional add/remove against local state.
