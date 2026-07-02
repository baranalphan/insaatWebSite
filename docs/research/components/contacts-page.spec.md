# Contacts page — Agent D scope

Follow `_shared-porting-rules.spec.md`. Fragment: `docs/research/components/html/contacts-locations.html`. Components in `src/components/contacts/`.

## ContactsLocations (`ContactsLocations.tsx`)
- Interaction model: static + fade-ins + map.
- Port `section.locations` exactly: "001" index, heading "Контакти" (`data-reveal-text` → RevealText from `src/components/site/effects`), two location cards (Котеджне містечко LAGOM — вулиця Січових Стрільців, 34…, 093 60 60 300; Комплекс резиденцій UNIQUE — вулиця Січових Стрільців, 251…, 073 70 60 300 — VERBATIM from fragment, addresses differ from home page!), "Дивитись на карті →" links.
- Map: same approach as HomeLocations — `div.map-static` with `background-image: url(/images/map-static-contacts.webp)` (asset added later, add `// TODO(map-asset)`), pins via `/images/theme_icons_map-pin.svg`. Keep `[data-google-map]` container + classes exactly.
- Note: contacts page CSS is `src/styles/site-contacts.css` (imported at page level later; just use classes).

## Acceptance
- `npx tsc --noEmit` passes. All fragment markup ported 1:1 with URL rewrites.
