// Builds FLYBY1_INSIDE_OVERLAYS and FLYBY2_OUTSIDE_OVERLAYS for fragments.ts
// from the raw svg3d polygon files + the captured per-unit state map.
// Mirrors the rendered-DOM format captured from the original app (see
// docs/research/genplan.lagom-development.com/data/flyby-new-poly-state.json).
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const SVG_DIR = join(ROOT, 'docs/research/genplan.lagom-development.com/data/svg3d');
const STATE = JSON.parse(
  readFileSync(join(ROOT, 'docs/research/genplan.lagom-development.com/data/flyby-new-poly-state.json'), 'utf8'),
);
const FRAGMENTS = join(ROOT, 'src/components/genplan/fragments.ts');

const SETS = [
  { key: '1_inside', exportName: 'FLYBY1_INSIDE_OVERLAYS', flyby: '1', side: 'inside' },
  { key: '2_outside', exportName: 'FLYBY2_OUTSIDE_OVERLAYS', flyby: '2', side: 'outside' },
];

function buildOverlay(setCfg, cp) {
  const cfg = STATE[setCfg.key];
  const raw = readFileSync(join(SVG_DIR, cfg.svgFiles[cp]), 'utf8').trim();
  let svg = raw.replace(/preserveAspectRatio="[^"]*"/, `preserveAspectRatio="${cfg.preserveAspectRatio}"`);
  // normalize double spaces inside polygon tags to match rendered-DOM capture format
  svg = svg.replace(/<polygon\b[^>]*>/g, (tag) => {
    const id = tag.match(/data-id="(\d+)"/)?.[1];
    const state = id && cfg.units[id];
    let out = tag.replace(/\s{2,}/g, ' ');
    if (state) {
      const [sale, cls] = state.split(':');
      const filterCls = cls === 'D' ? 'polygon__filter-deselect' : 'polygon__filter-select';
      out = out.replace('class="s3d-svg__build js-s3d-svg__build"', `class="s3d-svg__build js-s3d-svg__build ${filterCls}"`);
      if (sale !== 'X') out = out.replace(/>$/, ` data-sale="${sale}">`);
    } else {
      // unit absent from captured state: render as deselect with no data-sale
      out = out.replace('class="s3d-svg__build js-s3d-svg__build"', 'class="s3d-svg__build js-s3d-svg__build polygon__filter-deselect"');
    }
    return out;
  });
  return `<div class="s3d__svgWrap js-s3d__svgWrap flyby__${cp} flyby__${setCfg.flyby}__${setCfg.side}__${cp}" data-id="${cp}">${svg}</div>`;
}

let src = readFileSync(FRAGMENTS, 'utf8');
for (const setCfg of SETS) {
  const dict = {};
  for (const cp of ['1', '31', '61', '91']) dict[cp] = buildOverlay(setCfg, cp);
  const line = `export const ${setCfg.exportName}: Record<string, string> = ${JSON.stringify(dict)};`;
  if (src.includes(`export const ${setCfg.exportName}`)) {
    src = src.replace(new RegExp(`export const ${setCfg.exportName}[^\\n]*`), line);
  } else {
    src = src.trimEnd() + '\n\n' + line + '\n';
  }
  console.log(setCfg.exportName, 'entries:', Object.keys(dict).join(','), 'total chars:', Object.values(dict).reduce((a, b) => a + b.length, 0));
}
writeFileSync(FRAGMENTS, src);
console.log('fragments.ts updated');
