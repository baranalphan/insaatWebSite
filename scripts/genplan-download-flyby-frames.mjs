// Downloads flyby frame sets for the genplan clone (1_inside, 2_outside_new).
// Usage: node scripts/genplan-download-flyby-frames.mjs
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const BASE = 'https://genplan.lagom-development.com/wp-content/themes/3d/assets/s3d/images/flyby';
const SETS = [
  { remote: '1_inside', local: '1_inside' },
  { remote: '2_outside_new', local: '2_outside' },
];
const FRAMES = 120;
const CONCURRENCY = 6;

let failures = 0;
async function dl(url, dest, attempt = 1) {
  if (existsSync(dest)) return;
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (clone-builder)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  } catch (err) {
    if (attempt < 3) return dl(url, dest, attempt + 1);
    failures++;
    console.error('FAIL', url, String(err));
  }
}

for (const set of SETS) {
  const dir = join(ROOT, 'public/genplan/flyby', set.local);
  mkdirSync(dir, { recursive: true });
  const jobs = Array.from({ length: FRAMES }, (_, i) => () =>
    dl(`${BASE}/${set.remote}/${i}.jpg`, join(dir, `${i}.jpg`)));
  for (let i = 0; i < jobs.length; i += CONCURRENCY) {
    await Promise.all(jobs.slice(i, i + CONCURRENCY).map((j) => j()));
    if (i % 30 === 0) console.log(set.local, i + '/' + FRAMES);
  }
  console.log('DONE', set.local);
}
console.log(failures ? `FAILURES: ${failures}` : 'ALL OK');
