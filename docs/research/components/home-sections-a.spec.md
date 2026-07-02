# Home sections — Agent A scope

Follow `_shared-porting-rules.spec.md`. Fragments in `docs/research/components/html/`. All components in `src/components/home/`, named exports.

## 1. HomeIntro (`home-intro.html` → `HomeIntro.tsx`)
- Interaction model: scroll-driven parallax (ScrollSmoother data-speed attrs already in markup — keep them; ScrollSmoother handles the parallax automatically).
- Structure: `section.intro` with `picture` (hero KV, data-speed clamp(0.85)), giant LAGOM heading part of the KV image? NO — check fragment: heading text/images per fragment exactly.
- `.container-arrow` has `data-fade` → wrap/apply FadeIn.
- CTA button "Отримати консультацію" → `Btn` + `usePopups().openCallback()`.
- Section index "001" label: keep markup.

## 2. HomeBenefits (`home-benefits.html` → `HomeBenefits.tsx`)
- Video thumb button (`button.container-video`, data-hash B66npSCbgQ4, type video) → real `<img>` from fragment + `openVideo("B66npSCbgQ4", "video")`. Keep data-speed/data-unclip attrs; apply `useUnclip` to elements with data-unclip.
- Two collage `img.attachment-benefit` (data-speed clamp(0.9)) — apply unclip if attr present.
- Big heading `.mulish-80[data-reveal-text]` → `RevealText`.
- Stats cards block `.container.bottom` (data-speed 0.6): 3 text cards + 1 image card as per fragment.
- `.container-index` ("002") has data-fade.

## 3. HomeOverview (`home-overview.html` → `HomeOverview.tsx`)
- Single `.mulish-80[data-reveal-text]` heading "Ваш LAGOM — наша турбота" → RevealText. Keep section index markup.

## 4. HomeAccordion (`home-accordion.html` → `HomeAccordion.tsx`)
- Heading `.mulish-64[data-reveal-text]` "Управляюча компанія" → RevealText.
- Accordion `ul.container-list > li.item`: single-expand, default item 0 expanded (`.expanded` class). Animation via CSS (`grid-template-rows` transition already in ported CSS) — React state toggles `.expanded` only.
- Video button (shorts, data-hash Uhbdmc-MkNU) → `openVideo("Uhbdmc-MkNU", "shorts")`; keep thumbnail img + data-fade.
- `img.attachment-feature` data-speed 0.9 — keep attr.

## 5. HomeCtaForm (`home-cta-form.html` → `HomeCtaForm.tsx`)
- Decor images/SVGs (zen stones, waves, leaf) — port exactly with rewritten URLs; keep positioning classes.
- Heading `[data-reveal-text]` → RevealText.
- Form: use shared `ContactForm` from `src/components/site/Popups.tsx` inside `.custom-form` wrapper (keep `data-fade`); note under form verbatim: "Залиште контакти і ми зв'яжемось з вами для консультації."
- NOTE: original phone field uses intl-tel-input with flag dropdown (+380, flags sprite at /images/theme_flags.webp). Reproduce visually: static Ukrainian flag + chevron + "+380" prefix inside `.custom-form` phone field if the fragment markup has it; else ContactForm as-is.

## 6. Create `src/components/site/effects.tsx` (RevealText, FadeIn/useFadeIn, useUnclip) exactly per shared rules — export all.

## Acceptance
- `npx tsc --noEmit` passes.
- Every fragment element ported 1:1 (classes/attrs), images resolve to /images/* files that exist in public/images (check with ls when unsure — naming: uploads/Y/M/file → Y_M_file).
