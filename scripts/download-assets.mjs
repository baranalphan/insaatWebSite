// Downloads all static assets from lagom-development.com for the clone.
// - Page HTML -> parsed for img/srcset/video/link/script URLs
// - Theme CSS parsed for fonts + background images
// - Assets land in public/ (images/videos/fonts/seo), theme files in docs/research/lagom-development.com/theme/
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname;
const ORIGIN = 'https://lagom-development.com';
const PAGES = ['/', '/lagom/', '/unique/', '/contacts/'];

const publicDir = join(ROOT, 'public');
const themeDir = join(ROOT, 'docs/research/lagom-development.com/theme');

const seen = new Set();
const failures = [];

function localPathFor(url) {
  const u = new URL(url);
  let p = u.pathname;
  if (p.includes('/themes/bamboo/assets/css/') || p.includes('/themes/bamboo/assets/js/')) {
    return join(themeDir, p.split('/assets/')[1]); // css/index.css etc.
  }
  if (/\.(woff2?|ttf|otf|eot)$/.test(p)) return join(publicDir, 'fonts', p.split('/').pop());
  if (/\.(mp4|webm)$/.test(p)) return join(publicDir, 'videos', p.split('/').pop());
  if (p.includes('/uploads/')) return join(publicDir, 'images', p.split('/uploads/')[1].replaceAll('/', '_'));
  if (p.includes('/themes/bamboo/assets/img/')) return join(publicDir, 'images', 'theme_' + p.split('/assets/img/')[1].replaceAll('/', '_'));
  return join(publicDir, 'misc', p.replaceAll('/', '_').replace(/^_/, ''));
}

async function dl(url, dest) {
  if (seen.has(url)) return;
  seen.add(url);
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (clone-builder)' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, buf);
    console.log('OK', url.replace(ORIGIN, ''), '->', dest.replace(ROOT, ''), (buf.length / 1024).toFixed(0) + 'KB');
  } catch (e) {
    failures.push(url + ' :: ' + e.message);
  }
}

function extractUrls(html) {
  const urls = new Set();
  const attrRe = /(?:src|href|poster)=["']([^"']+)["']/g;
  const srcsetRe = /srcset=["']([^"']+)["']/g;
  const styleUrlRe = /url\(["']?([^"')]+)["']?\)/g;
  let m;
  while ((m = attrRe.exec(html))) urls.add(m[1]);
  while ((m = srcsetRe.exec(html))) m[1].split(',').forEach(part => urls.add(part.trim().split(/\s+/)[0]));
  while ((m = styleUrlRe.exec(html))) urls.add(m[1]);
  return [...urls];
}

const wanted = /\.(webp|png|jpe?g|gif|svg|avif|mp4|webm|woff2?|ttf|css|js|ico|webmanifest)(\?|$)/i;

const queue = [];
for (const path of PAGES) {
  const res = await fetch(ORIGIN + path, { headers: { 'user-agent': 'Mozilla/5.0 (clone-builder)' } });
  const html = await res.text();
  writeFileSync(join(themeDir, 'html', path === '/' ? 'home.html' : path.replaceAll('/', '') + '.html'), html, { flag: 'w' });
  for (const raw of extractUrls(html)) {
    if (!wanted.test(raw)) continue;
    let url;
    try { url = new URL(raw, ORIGIN + path).href; } catch { continue; }
    if (!url.startsWith(ORIGIN)) continue; // first-party only
    queue.push(url.split('?')[0]);
  }
}

mkdirSync(join(themeDir, 'html'), { recursive: true });

// download CSS first, parse for fonts/backgrounds
const cssUrls = [...new Set(queue.filter(u => u.endsWith('.css')))];
for (const cssUrl of cssUrls) {
  const res = await fetch(cssUrl);
  const css = await res.text();
  const dest = localPathFor(cssUrl);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, css);
  seen.add(cssUrl);
  console.log('OK(css)', cssUrl.replace(ORIGIN, ''));
  const urlRe = /url\(["']?([^"')]+)["']?\)/g;
  let m;
  while ((m = urlRe.exec(css))) {
    if (!wanted.test(m[1])) continue;
    try {
      const abs = new URL(m[1], cssUrl).href.split('?')[0];
      if (abs.startsWith(ORIGIN)) queue.push(abs);
    } catch {}
  }
}

const rest = [...new Set(queue.filter(u => !u.endsWith('.css')))];
// batched parallel downloads, 4 at a time
for (let i = 0; i < rest.length; i += 4) {
  await Promise.all(rest.slice(i, i + 4).map(u => dl(u, localPathFor(u))));
}

console.log('\nDownloaded:', seen.size, 'Failures:', failures.length);
failures.forEach(f => console.log('FAIL', f));
