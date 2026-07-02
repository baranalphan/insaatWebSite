# LAGOM Development — Page Topology

## Site map (5 targets)
1. `/` — Home (Головна)
2. `/lagom/` — Project page: Котеджне містечко LAGOM
3. `/unique/` — Project page: Резиденції UNIQUE
4. `/contacts/` — Contacts
5. `genplan.lagom-development.com/3d/?&favourites=&type=genplan` — interactive masterplan house-picker (separate app, separate topology doc)

## Global layout skeleton (all WP pages)
```
body (bg #F2EFE9 cream)
├── header.header (fixed, z-99, hide-on-scroll-down)
│   └── inner bar: logo | nav (Головна/LAGOM/UNIQUE/Контакти) | tel | socials | CTA "Обрати будинок" → genplan
├── .smooth-wrapper (fixed inset-0)  [GSAP ScrollSmoother]
│   └── .smooth-content (translateY driven by scroll)
│       ├── main > section × N        (flow content)
│       └── footer.footer            (taupe, viewport-height)
├── .popup × 5 (video/callback/success/map/plan, z-999999)
├── cookie banner (fixed bottom)
└── Ringostat call button (fixed bottom-right, z high)
```

## Home page (/) — section order (desktop heights at 1512px viewport)
| # | Section (class) | Height | Interaction model |
|---|----------------|--------|-------------------|
| 1 | `section.intro` | 1547px | scroll-driven (parallax layers, fade arrow) |
| 2 | `section.benefits` | 1880px | scroll-driven (parallax collage, scrub text-fill, stats cards) |
| 3 | `section.projects` | 2710px + 2 pins (~1204px each) | **scroll-driven: pinned cards, scrub slide-over; swiper progress scroll-linked** |
| 4 | `section.locations` | 727px (100vh) | static + fade-ins; interactive Google Map |
| 5 | `section.overview` | 727px (100vh) | scroll-driven scrub text-fill |
| 6 | `section.accordion` | 880px | click-driven accordion + video lightbox |
| 7 | `section.cta-form` | 860px | static + fade-in; form validation |
| 8 | `footer.footer` | 727px (100vh) | static, hover states on links |

Total scrollHeight desktop: 13168px (incl. 3 pin spacers). Mobile (390px): 7917px, no pins.

## Z-index layers
- content: auto (smooth-content)
- header: 99
- popups: 999999
- Ringostat: high (fixed bottom-right)

## Dependencies
- All pages share: header, footer, popups (video/callback/success), cookie bar, Ringostat button, ScrollSmoother wrapper.
- Home projects section links → /lagom/, /unique/ (Детальніше) and locations map.
- CTA "Обрати будинок" (header, everywhere) → genplan subdomain.

## Clone architecture mapping (Next.js)
- `src/app/layout.tsx` — fonts (Inter local ×2, Mulish), Header, Footer, popups providers
- `src/app/page.tsx` — home: Intro, Benefits, Projects, Locations, Overview, Accordion, CtaForm
- `src/app/lagom/page.tsx`, `src/app/unique/page.tsx`, `src/app/contacts/page.tsx`
- `src/app/genplan/...` (or /3d route) for the masterplan viewer
- Smooth scroll: GSAP ScrollSmoother (npm `gsap` ≥3.13, free incl. ScrollSmoother/ScrollTrigger) via a `SmoothScrollProvider` client component with `.smooth-wrapper/.smooth-content` and `effects: true` (data-speed/data-lag attributes work out of the box)
- Swiper via `swiper` npm package
- Google Map → clone with static custom-styled map embed or `@vis.gl/react-google-maps`… (needs API key) → **decision: use an interactive map lib with free tiles (MapLibre + custom light style) OR static screenshot + pins overlay; default = static map image + absolutely-positioned pin/card overlays for pixel fidelity without API keys**
