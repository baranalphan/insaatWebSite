# LAGOM Development — Site Behaviors (Behavior Bible)

Source: https://lagom-development.com — WordPress theme "bamboo" (custom), GSAP + ScrollTrigger + ScrollSmoother, Swiper, Google Maps, Ringostat callback widget.

## Global

### Smooth scrolling — GSAP ScrollSmoother
- Structure: `body > .smooth-wrapper (position: fixed) > .smooth-content (transform: translateY)`.
- Native scroll drives a lerped translateY on `.smooth-content`. Smoothing factor is HIGH (content takes ~1–2s to catch up; estimate `smooth: 2`).
- **Desktop only** — mobile page height (7917px at 390px) has no pin spacers and scrolls natively (`smooth: 0`/disabled on touch).
- Parallax via `data-speed` / `data-lag` attributes (ScrollSmoother effects). Complete inventory:
  - **intro**: `picture` speed=clamp(0.85); `.container-content` speed=clamp(1.2); `.container-arrow` data-fade
  - **benefits**: `.container-index` fade; `.container-kivi` speed=0.9; benefit `img`s speed=clamp(0.9); `.container-text` speed=1.1; video `button` speed=1; `.container.bottom` (stats cards) speed=0.6
  - **locations**: `.container-map` speed=0.8+fade; `.container-index` fade; `.container-locations` speed=1.1+fade; `.swiper.swiper-fade` fade
  - **overview**: `.container-text` speed=1.1
  - **accordion**: `.container-text` speed=1.1; video button fade; feature `img` speed=0.9
  - **cta-form**: `.custom-form` fade
  - **footer**: `.container.md-space` speed=1
- `data-fade` = fade-in on viewport entry. `data-unclip='{"max-width":"1024px"}'` = disable clip effect below 1024px.

### Header (fixed, hide-on-scroll)
- `header.header` fixed top, zIndex 99, height ~92.5px, `transition: 0.45s ease-in-out`, transparent bg (inner bar has cream bg #F2EFE9 with the nav content).
- Scroll DOWN past ~100px → class `hidden` added → `transform: translateY(-101.8px)`.
- Scroll UP (any amount) → class removed → `transform: none`.
- Active nav link: orange `rgb(251,115,57)`; inactive: `rgba(56,51,47,0.6)`; hover transition `color 0.3s`.
- Header CTA "Обрати будинок" → https://genplan.lagom-development.com/ ; orange bg `rgb(251,115,57)`, white text, notched corner (decor triangle, top-right), `transition: 0.8s cubic-bezier(0.625, 0.05, 0, 1)`.

### Popups (5 shared modals, `.popup` with `zIndex: 999999`)
- `.popup-video` — YouTube embed lightbox. Triggered by `[data-video-button]` with `data-hash=<youtubeID>` and `data-type=video|shorts` (shorts = 9:16 aspect). iframe src set on open, cleared on close. Close: `[data-popup-close]` ✕ button top-right.
- `.popup-callback` — callback/consultation form modal.
- `.popup-success` — form success message.
- `.popup-map` — map popup.
- `.popup-plan` — floor plan popup.
- Closed state: `pointer-events: none` (+ opacity transition).

### Font-size utility classes (theme-wide convention)
`inter-20`, `mulish-24`, `mulish-64`, `mulish-80` etc. — font families: "Inter Regular" (400), "Inter SemiBold" (600), Mulish variable (100–900). Body: 14px/21px "Inter Regular".

### Cookie banner
- Fixed bottom-center grey bar "Наш вебсайт використовує файли cookie." + Ok button + ✕ close.

### Ringostat floating call button
- Fixed bottom-right orange circle with phone icon + pulsing halo rings. Third-party widget — replicate visually (button + pulse animation).

## Home page behaviors by section

### 1. intro (hero, ~1547px tall)
- Full-bleed `picture` hero image (parallax speed clamp(0.85)), giant white "LAGOM" display text (part of KV image!** VERIFY**: text scrolls with image — appears to be *the image itself* containing text? No — text scrolled up over the house: separate layer with speed clamp(1.2)).
- `.container-content` (H1 "Життя у гармонії - життя у LAGOM" + CTA "Отримати консультацію") — speed clamp(1.2).
- Scroll-down arrow icon (`.container-arrow`, data-fade) top-right area.
- GSAP trigger on `.intro` start -42 → end 1505.

### 2. benefits (~1880px tall)
- Section index "002" small label (fade).
- Collage: video thumbnail button (left, opens YouTube B66npSCbgQ4), two photos (right + bottom-center), all with parallax speeds (0.9–1.1).
- **Scroll-scrubbed text fill**: big Mulish-80 heading "Продумані простори для життя поруч з природою" — letters fill from light grey `#D6D2CB`-ish to dark `#38332F` as you scroll (scrub: true, trigger `.mulish-80` / `.container.bottom` start 1292 end 1837).
- Stats cards row (3 white cards): Проєкти 33 тис. м² / Будинки 140 здано / Благоустрій 2,2 га (+ 1 image card with brick houses photo). Cards slide/fade in, container speed 0.6.

### 3. projects (~2710px tall + pins)
- Section index "003", heading "Наші проєкти" (Mulish-64, scrubbed text-fill like benefits).
- **TWO PINNED PROJECT CARDS** (`.project`, pin: true, scrub: true, each pinned for ~1204px of scroll):
  - Card 1: "01/02 Котеджне містечко LAGOM — Простір, де панує гармонія", від 1370 $/м², Площа будинку від 132 м², Розтермінування до 2 років (orange), location; badge "8 будинків доступно"; photo slider (Swiper, 5 slides, progress-bar + dots pagination); buttons "Детальніше" (orange) + "На карті" (border).
  - Card 2: "02/02 Резиденції UNIQUE — Простір, де говорить тиша", від 2400 $/м², від 301 м², same layout.
  - **Interaction model: scroll-driven.** While card 1 is pinned, continued scrolling brings card 2 up sliding OVER card 1 (card 2 translateY from below, scrub-linked). Swiper inside auto-advances? (autoplay observed: slider images cycle — VERIFY during extraction; a swiper-initialized horizontal slider with transitions was in ScrollTrigger list tied to scroll 3494→4618 — the slider progress is SCROLL-SCRUBBED, slides advance as section scrolls!)
- Mobile: no pinning; cards stack vertically, slider becomes standard swipe with dots.

### 4. locations (viewport-height section)
- "004 Наші локації" + two location cards (name, address, phone, "Дивитись на карті →" orange link):
  - Котеджне містечко LAGOM — Вулиця Грушевського, 57, Сокільники… 093 60 60 300
  - Комплекс резиденцій UNIQUE — вулиця Івана Франка, 49, Сокільники… 073 70 60 300
- **Google Map** (custom light style) fills right/background, custom SVG pins (map-pin.svg / map-pin-active.svg), overlay card "КМ LAGOM" with photo + "Детальніше" button (an InfoWindow-style card, top-right of map).
- Elements fade in (data-fade), map speed 0.8.

### 5. overview (viewport-height)
- "005" + giant scrub-filled text "Ваш LAGOM — наша турбота" (Mulish-80, same letter-fill effect).

### 6. accordion (~880px)
- Left: "006"? + heading "Управляюча компанія" (Mulish-64 with scrub fill), text "УК \"Дім Лаґом\"".
- Accordion `ul.container-list > li.item`:
  - 01 Благоустрій території (expanded by default) — bullet list content
  - 02 Безпека
  - 03 Підтримка ландшафтного дизайну
- **Single-expand**: clicking one collapses others. Animation: `.item-collapsed { display: grid; grid-template-rows: 0fr↔1fr; transition: grid-template-rows 0.45s ease-in-out }`. Expanded item marked `.expanded`; orange square bullet indicator on expanded item's divider.
- Right: video thumbnail button (YouTube shorts Uhbdmc-MkNU, 9:16, data-fade) — flowers/brick photo.

### 7. cta-form (~860px)
- "007" + heading "Хочете дізнатись більше?" (grey, Mulish-80-ish).
- Decorative grey shapes: zen stones stack (center), 3 wavy lines (left), leaf/lagom-icon shapes (bottom) — SVGs/images, very light grey #E5E1DA-ish.
- Form (right): text input "Ім'я*" (underline style), intl phone input (flag dropdown +380, flags sprite flags.avif), submit "Отримати консультацію" (orange, disabled/50% opacity until valid), note "Залиште контакти і ми зв'яжемось з вами для консультації."
- Form fades in (data-fade).

### 8. footer (viewport-height, taupe `~rgb(159,153,138)` bg)
- Giant cream "LAGOM" wordmark; tagline "Девелопер, що створює продумані простори від ідеї до реалізації."
- Menu column: Головна / LAGOM / UNIQUE / Контакти + Політика конфіденційності
- Контакти column: +38 093 60 60 300, lagomdev.office@gmail.com; Соціальні мережі: YouTube, Telegram, TikTok, Instagram icons
- Bottom row: ©2026 Lagom development All Rights Reserved | Designed & Developed by Bambuk
- Below divider: charity commitment text (larger Mulish, cream).
- Footer container has data-speed=1 (slight parallax reveal feel).

## Responsive notes (390px)
- Header → logo icon only + "Обрати будинок" + burger (`.header-burger`). Menu = full-screen overlay (`.header-menu`) with nav links, phone, email, socials (fade/slide in).
- Hero: same KV, text smaller, CTA full-width-ish.
- Benefits: images/collage reflow to single column; stats cards → horizontal swiper (edge-peek).
- Projects: no pinning; card stacks image-first; slider = touch swiper with progress bar + dots.
- Locations: cards stack above map card.
- CTA form: single column, form below shapes.
- Footer: single column stack.
- All scrub/pin/parallax effects disabled on mobile; simple fade-ins remain.

## YouTube videos
- Benefits video: B66npSCbgQ4 (16:9)
- Accordion video: Uhbdmc-MkNU (shorts 9:16)
