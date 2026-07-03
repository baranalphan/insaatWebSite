# Flyby InfoBox (hover tooltip) Specification

## Overview
- **Target:** new fragment + logic in `src/components/genplan/` (rendered inside `.s3d-ctr.js-s3d-ctr` container, as in original)
- **Interaction model:** hover-driven. Appears when cursor moves over `polygon.js-s3d-svg__build[data-type=flat]` in a flyby view; hides on leave. Populated per hovered unit from flats.json.
- Present on ALL flyby views (1-outside, 1-inside, 2-outside). NOT on masterplan (zones there use pin popups instead).

## DOM structure (captured from live site, flyby 1-inside, unit 83)
```
div.js-s3d-infoBox.s3d-infoBox[.s3d-show] [data-s3d-type="infoBox"] [style="opacity:1; pointer-events:painted; top:416px; left:1669px;"]
  div.s3d-infoBox__flat
    div.s3d-infoBox__flat__alert-header
      div                                      ← plain wrapper (no class)
        div.s3d-infoBox__flat__alert.s3d-infoBox__flat__alert--with-icon
          "доступно" + svg.s3d-infoBox__flat__alert__status-icon > use #icon-Info
        div.s3d-infoBox__flat__alert__badge
          svg.s3d-card__badge-icon > use #icon-Construction
          + text "4 кв. 2027"                  ← unit.fund (TR data: "Q4 2027")
    div.s3d-infoBox__flat__alert__middle
      div.s3d-infoBox__flat__alert__middle__text-block
        div → "Вілла №5"                       ← "Villa No: {unit.number}" (TR)
        button.ButtonWithoutIcon.show-on-tablet.ButtonWithoutIcon--secondary → "Дивитися будинок" (TR: "Evi İncele")
    div.s3d-infoBox__flat__image-wrapper
      div.s3d-infoBox__image > img[src=unit.img_big]
    div.s3d-infoBox__flat__alert__middle       ← empty spacer
    div.s3d-infoBox__flat-bottom
      div.s3d-infoBox__info
        div.s3d-infoBox__flat__wrapper-label
          div.s3d-infoBox__flat__label > span → unit.deferral_period
          div.s3d-infoBox__flat__label → "Площа будинку: " + span.super-text{unit.area} + " м²"
          div.s3d-infoBox__flat__label → "Тип планування: " + span.super-text{unit.type}
          div.s3d-infoBox__flat__label → "Площа ділянки: " + span.super-text{unit.area_land} + " сот"
```
TR labels (match site vocabulary): "Konut Alanı:", "Plan Tipi:", "Arsa Alanı:" + "m²", "dönüm"→keep original unit word: use "sot"→"ar"? — existing site translation uses "m²" and plain numbers; use: Konut Alanı / Plan Tipi / Arsa Alanı.

## Computed styles
- Root: position fixed; z-index 999; width 280px; border-radius 8px; display flex; font "Inter Display"; opacity + top/left set inline by JS; pointer-events: painted when shown.
- Alert chip: padding 4px 4px 4px 12px; radius 4px; font 13px/400; uppercase; color #fafbfe.
- Status colors (CSS vars, already in s3d.css): available(sale=1) bg #83af8d (--color-semantic-success); reserve(sale=2) bg computed rgb(109,104,5) via warning var blend — use var(--color-semantic-warning) #f1b161? measured reserve chip = rgb(109,104,5) (olive). Available measured = rgb(131,175,141) = #83af8d exactly.
- Badge: transparent bg, color #6c7a88.

## Status text by unit.sale (original → TR)
- 1 → "доступно" → "müsait" (chip bg #83af8d)
- 2 → "резерв" → "rezerve" (chip bg olive rgb(109,104,5))
- 0 → "продано" → "satıldı" (sold units — verify hoverability: sold polygons still hover-highlight and show box? On original, sold (sale=0,S) DO have polygons; box behavior untested for sale=0. Safe: show chip with warning color.)

## Behavior
- Trigger: mousemove over flat polygon → box populated + `.s3d-show` + opacity 1; positioned near polygon (fixed top/left, follows pointer region; clamped to viewport). On leave: hide (opacity 0, remove .s3d-show).
- Desktop: click on polygon navigates to flat page directly ("Дивитися будинок" button is .show-on-tablet — hidden on desktop).
- Click from flyby at control frame N != view default appends &controlPoint=N to flat URL (observed: from frame 1 in 1-inside → no controlPoint param; URL 6 of task has controlPoint=61).
