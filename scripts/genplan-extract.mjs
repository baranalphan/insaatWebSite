// Extracts genplan clone data (polygons, flats) from captured artifacts and
// downloads flyby frames + UI assets into public/genplan/.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const DATA = join(ROOT, 'docs/research/genplan.lagom-development.com/data');
const OUT = join(ROOT, 'public/genplan');
const ORIGIN = 'https://genplan.lagom-development.com';
mkdirSync(join(OUT, 'data'), { recursive: true });

// ---------- 1. polygons from DOM snapshots ----------
function extractPolygonSets(html, controlPoints) {
  const sets = [];
  const svgRe = /<svg[^>]*id="floor--svg"[^>]*>([\s\S]*?)<\/svg>/g;
  let m;
  while ((m = svgRe.exec(html))) {
    const polys = [];
    const polyRe = /<polygon([^>]*)>/g;
    let p;
    while ((p = polyRe.exec(m[1]))) {
      const attrs = {};
      const attrRe = /([\w-]+)="([^"]*)"/g;
      let a;
      while ((a = attrRe.exec(p[1]))) attrs[a[1]] = a[2];
      polys.push(attrs);
    }
    if (polys.length) sets.push(polys);
  }
  return Object.fromEntries(sets.map((s, i) => [controlPoints[i] ?? i, s]));
}

const genplanHtml = readFileSync(join(DATA, 'genplan-dom.html'), 'utf8');
const flybyHtml = readFileSync(join(DATA, 'flyby-1-outside-dom.html'), 'utf8');

// masterplan control points [1,31,61,91] per settings.json
writeFileSync(join(OUT, 'data/masterplan-polygons.json'), JSON.stringify(extractPolygonSets(genplanHtml, [1, 31, 61, 91]), null, 1));
writeFileSync(join(OUT, 'data/flyby1-polygons.json'), JSON.stringify(extractPolygonSets(flybyHtml, [1, 31, 61, 91]), null, 1));

// also extract pins/labels markup blocks for reference
const pins = genplanHtml.match(/<div class="s3d[^"]*pin[^"]*"[\s\S]{0,400}?<\/div>/g) || [];
writeFileSync(join(DATA, 'pins-sample.html'), pins.slice(0, 20).join('\n\n'));

// ---------- 2. flats.json with rewritten image urls ----------
const flats = JSON.parse(readFileSync(join(DATA, 'ajax-0-getFlats.json'), 'utf8'));
const remoteImgs = new Set();
const rewrite = (u) => {
  if (!u || typeof u !== 'string') return u;
  if (u.startsWith('/assets/')) u = 'https://lagom.devbase.pro' + u.replace('/assets', '');
  if (u.startsWith('https://lagom.devbase.pro/')) {
    const p = u.replace('https://lagom.devbase.pro/', '').split('?')[0];
    remoteImgs.add(u.split('?')[0]);
    return '/genplan/devbase/' + p.replaceAll('/', '_');
  }
  return u;
};
const deepRewrite = (o) => {
  if (typeof o === 'string') return rewrite(o);
  if (Array.isArray(o)) return o.map(deepRewrite);
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, deepRewrite(v)]));
  return o;
};
const flatsLocal = flats.map((f) => {
  const c = deepRewrite(f);
  if (f.img) { remoteImgs.add(`https://lagom.devbase.pro/img/projects/1/${f.build}/${f.img}`); c.img = `/genplan/devbase/img_projects_1_${f.build}_${f.img}`; }
  return c;
});
writeFileSync(join(OUT, 'data/flats.json'), JSON.stringify(flatsLocal));
writeFileSync(join(OUT, 'data/structure.json'), readFileSync(join(DATA, 'ajax-1-getStructureSvg.json')));
const floor = JSON.parse(readFileSync(join(DATA, 'ajax-6-getFloor.json'), 'utf8'));
writeFileSync(join(OUT, 'data/floor-28.json'), JSON.stringify(deepRewrite(floor)));

// ---------- 3. downloads ----------
const queue = [];
const S3D = `${ORIGIN}/wp-content/themes/3d/assets/s3d`;
for (let i = 0; i <= 119; i++) {
  queue.push([`${S3D}/images/flyby/masterplan/${i}.jpg`, join(OUT, `flyby/masterplan/${i}.jpg`)]);
  queue.push([`${S3D}/images/flyby/masterplan_dark/${i}.jpg`, join(OUT, `flyby/masterplan_dark/${i}.jpg`)]);
  queue.push([`${S3D}/images/flyby/1_outside/${i}.jpg`, join(OUT, `flyby/1_outside/${i}.jpg`)]);
}
// UI assets
const uiAssets = ['images/svg/logo.svg', 'images/icon/smarto.svg'];
for (const a of uiAssets) queue.push([`${S3D}/${a}`, join(OUT, 'ui', a.split('/').pop())]);
queue.push([`${ORIGIN}/wp-content/themes/3d/assets/images/black-clouds-png-4.png`, join(OUT, 'ui/black-clouds-png-4.png')]);
// markers
for (const mk of ['commercial.svg','marker.svg','marker2.svg','parking.svg','playground.svg','shop.svg','street.svg','underground.svg','walking.svg'])
  queue.push([`${S3D}/images/markers/${mk}`, join(OUT, 'markers/' + mk)]);
// pinsInfo images
const settings = JSON.parse(readFileSync('/private/tmp/claude-501/-Users-baran-insaatWebSite/4f2522cd-b50d-47da-9796-b5891099571b/scratchpad/s3d-settings.json', 'utf8'));
for (const [k, v] of Object.entries(settings.pinsInfo || {})) {
  if (v.img) queue.push([`${ORIGIN}${v.img}`, join(OUT, 'pins', v.img.split('/').pop())]);
}
// devbase flat images
for (const u of remoteImgs) {
  const p = u.replace('https://lagom.devbase.pro/', '').replaceAll('/', '_');
  queue.push([u, join(OUT, 'devbase', p)]);
}

let ok = 0, fail = 0, skipped = 0;
async function dl([url, dest]) {
  if (existsSync(dest)) { skipped++; return; }
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (clone-builder)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
    if (ok % 25 === 0) console.log('progress:', ok, '/', queue.length);
  } catch (e) { fail++; console.log('FAIL', url, e.message); }
}
for (let i = 0; i < queue.length; i += 5) await Promise.all(queue.slice(i, i + 5).map(dl));
console.log('done. ok:', ok, 'fail:', fail, 'skipped:', skipped, 'total queued:', queue.length);
