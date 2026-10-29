#!/usr/bin/env node
/* Serasi link checker: requests every https link in the data files and reports the ones that no longer return a page.
   Usage: node scripts/check-links.mjs [--only <substring>]
   FAIL lines (404, 410, other 4xx/5xx, DNS failure, timeout) make the exit code 1. CHECK-BY-HAND lines (401, 403, 406, 429, 999: the site
   turns scripts away) need a person with a browser and do not change the exit code. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const { load } = createRequire(import.meta.url)(path.join(ROOT, 'test', 'helpers', 'load.js'));

// Scripts that hold links, in load order. Later tasks add the last two; any that do not exist yet are skipped.
const SCRIPTS = ['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-local.js', 'serasi-overseas.js', 'serasi-countries-data.js', 'serasi-countries.js'];
const FLAGS = 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const TIMEOUT_MS = 15000;
const CONCURRENCY = 8;
const BY_HAND = new Set([401, 403, 406, 429, 999]);

// Every https URL in the data on `window`, as [{ url, where: string[] }] in first-seen order. `where` names each place the URL is used.
export function collectUrls(window) {
  const found = new Map();
  const add = (url, where) => {
    if (typeof url !== 'string' || !url.startsWith('https://')) return;
    if (!found.has(url)) found.set(url, []);
    found.get(url).push(where);
  };

  const P = window.SerasiPathways;
  if (P) {
    for (const [key, src] of Object.entries(P.SOURCES || {})) add(Array.isArray(src) ? src[1] : undefined, 'SOURCES.' + key);
    for (const [key, c] of Object.entries(P.CONTACTS || {})) add(c && c.url, 'CONTACTS.' + key);
  }

  for (const c of (window.SerasiLocal && window.SerasiLocal.COURSES) || []) add(c.url, 'COURSES: ' + c.school + ', ' + c.course);

  // A study field is { best, alts }; an agency field is { agency } and has no links of its own.
  const options = (window.SerasiOverseas && window.SerasiOverseas.OPTIONS) || {};
  for (const [field, f] of Object.entries(options)) {
    if (!f || f.agency !== undefined) continue;
    const list = [['best', f.best], ...(f.alts || []).map((o, i) => ['alts[' + i + ']', o])];
    for (const [slot, o] of list) {
      if (!o) continue;
      add(o.url, 'OPTIONS.' + field + '.' + slot);
      (o.links || []).forEach((u, i) => add(u, 'OPTIONS.' + field + '.' + slot + '.links[' + i + ']'));
    }
  }

  const byIso = (window.SerasiCountryData && window.SerasiCountryData.byIso) || {};
  for (const [iso, c] of Object.entries(byIso)) {
    (c.unis || []).forEach((u, i) => add(u.url, 'COUNTRY ' + iso + ' unis[' + i + ']'));
    for (const fig of [c.pop, c.gdp, c.gdppc]) if (fig) add(fig.src, 'COUNTRY ' + iso + ' figure source');
    if (typeof c.a2 === 'string' && c.a2) {
      add(FLAGS + c.a2.toLowerCase() + '.svg', 'COUNTRY ' + iso + ' flag');
      add('https://data.worldbank.org/country/' + c.a2.toUpperCase(), 'COUNTRY ' + iso + ' World Bank page');
    }
  }

  return [...found].map(([url, where]) => ({ url, where }));
}

// 'pass', 'by-hand' or 'fail' for an HTTP status.
export function classify(status) {
  if (status >= 200 && status < 400) return 'pass';
  return BY_HAND.has(status) ? 'by-hand' : 'fail';
}

const errorName = err => (err && err.name === 'TimeoutError') ? 'timeout' : (err && err.cause && (err.cause.code || err.cause.name)) || (err && err.name) || 'error';

// One GET with a 15 s limit, tried twice when the network fails or the request times out. A status, however bad, is never retried.
async function request(url) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/svg+xml,*/*;q=0.8', 'Accept-Language': 'en-SG,en;q=0.9' }
      });
      if (res.body) res.body.cancel().catch(() => {});
      return { status: res.status };
    } catch (err) {
      last = errorName(err);
    }
  }
  return { error: last };
}

// Runs fn over items with at most `limit` in flight; results keep the order of items.
async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  const worker = async () => { while (next < items.length) { const i = next++; out[i] = await fn(items[i]); } };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

async function main(argv) {
  let only = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--only' && argv[i + 1] !== undefined) only = argv[++i];
    else { console.error('Usage: node scripts/check-links.mjs [--only <substring>]'); return 2; }
  }

  const window = load(SCRIPTS.filter(f => fs.existsSync(path.join(ROOT, f))));
  const links = collectUrls(window).filter(l => only === null || l.url.includes(only));
  const results = await pool(links, CONCURRENCY, l => request(l.url));

  let failed = 0;
  let byHand = 0;
  links.forEach((l, i) => {
    const r = results[i];
    const where = ' (' + l.where.join(', ') + ')';
    if (r.error) { failed++; console.log('FAIL ' + r.error + ' ' + l.url + where); return; }
    const kind = classify(r.status);
    if (kind === 'fail') { failed++; console.log('FAIL ' + r.status + ' ' + l.url + where); }
    else if (kind === 'by-hand') { byHand++; console.log('CHECK-BY-HAND ' + r.status + ' ' + l.url + where); }
  });
  console.log('Checked ' + links.length + ' links: ' + failed + ' failed, ' + byHand + ' to check by hand');
  return failed ? 1 : 0;
}

// Run only when started from the command line, so tests can import collectUrls without touching the network.
// Real paths are compared because import.meta.url is the real path, while argv[1] keeps any symlink it was reached through.
const realPath = p => { try { return fs.realpathSync(p); } catch { return p; } };
if (process.argv[1] && realPath(process.argv[1]) === realPath(fileURLToPath(import.meta.url))) process.exitCode = await main(process.argv.slice(2));
