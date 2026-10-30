'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { load, plain } = require('./helpers/load');

const ROOT = path.join(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'serasi-countries-data.js');
const REGION_DIR = path.join(ROOT, 'scripts', 'countries');

const DONE_REGIONS = [];               // region tasks finished so far; each appends its own DONE_REGIONS.push('europe') etc. at the END of this file

const hasData = fs.existsSync(DATA_FILE);
const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-sectors.js', 'serasi-overseas.js'].concat(hasData ? ['serasi-countries-data.js'] : []));
const { WORLD } = w.SerasiPathways;
const O = w.SerasiOverseas;
const D = w.SerasiCountryData || { byIso: {} };
const fixture = require('./fixtures/atlas-ids.json');

const CORE_ALSO = ['Brunei','Cambodia','Indonesia','Laos','Malaysia','Myanmar','Philippines','Thailand','Vietnam','Timor-Leste','India','Pakistan','Bangladesh','Sri Lanka','China','Japan','South Korea','Taiwan','Saudi Arabia','United Arab Emirates','Qatar','Kuwait','Turkey','Jordan','United Kingdom','Ireland','Germany','France','Netherlands','Switzerland','Sweden','Norway','Denmark','Finland','Italy','Spain','Russia','Poland','Belgium','Austria','Egypt','Morocco','South Africa','Nigeria','Kenya','Ethiopia','Ghana','United States of America','Canada','Brazil','Mexico','Argentina','Chile','Australia','New Zealand'];   // names as spelled in the atlas fixture
const coreNames = () => new Set([...CORE_ALSO, 'Singapore', 'Hong Kong', ...WORLD.map(h => h.country), ...Object.values(O.OPTIONS).flatMap(o => o.best ? [o.best, ...o.alts].map(x => x.country) : [])]);
// The atlas fixture spells the United States out in full; the WORLD hubs shorten it. Treat both as the same country.
const ALIAS = { 'United States': 'United States of America' };
const atlasName = n => ALIAS[n] || n;

// ---- The builder (scripts/build-countries.mjs), tested without the network ----

let B;
test.before(async () => { B = await import(pathToFileURL(path.join(ROOT, 'scripts', 'build-countries.mjs')).href); });

const entry = (over = {}) => Object.assign({
  iso: 702, name: 'Singapore', a2: 'SG', langs: ['English'], known: ['a', 'b'], facts: ['c', 'd'], orgs: ['e', 'f'],
  unis: [{ n: 'National University of Singapore', rank: 8, url: 'https://www.nus.edu.sg/' }]
}, over);
const wbOf = (pop, gdp, gdppc) => ({ pop: new Map(pop), gdp: new Map(gdp), gdppc: new Map(gdppc) });
const META = { qsEdition: 'QS World University Rankings 2027', qsUrl: 'https://www.topuniversities.com/world-university-rankings' };

test('parseWb keeps the most recent value of each country by its two-letter code and skips empty values', () => {
  const m = B.parseWb([{ page: 1 }, [
    { country: { id: 'SG' }, date: '2024', value: 5917600 },
    { country: { id: 'KP' }, date: '2020', value: null },
    { country: { id: 'JP' }, date: '2023', value: 0 }
  ]]);
  assert.deepEqual(plain([...m]), [['SG', { v: 5917600, yr: 2024 }]]);
  assert.throws(() => B.parseWb({ message: [{ id: '120', key: 'Invalid format' }] }), /World Bank/);
});

test('assemble fills the three figures from the World Bank and lets a fallback win', () => {
  const fb = { v: 100, yr: 2024, src: 'Example statistics office, 2024', srcUrl: 'https://example.org/stats' };
  const data = B.assemble({
    regions: { asia: [entry(), entry({ iso: 158, name: 'Taiwan', a2: 'TW', fallback: { gdp: fb } })] },
    meta: META,
    wb: wbOf([['SG', { v: 6, yr: 2024 }], ['TW', { v: 1, yr: 2020 }]], [['SG', { v: 500, yr: 2024 }], ['TW', { v: 7, yr: 2020 }]], [['SG', { v: 80, yr: 2024 }]]),
    asof: '2026-10-30'
  });
  assert.equal(data.asof, '2026-10-30');
  assert.deepEqual(plain(data.qs), { edition: META.qsEdition, url: META.qsUrl });
  assert.deepEqual(plain(data.wb), { url: 'https://data.worldbank.org/' });
  assert.deepEqual(plain(data.byIso[702].pop), { v: 6, yr: 2024 });
  assert.deepEqual(plain(data.byIso[158].gdp), fb);                                   // fallback wins over the World Bank value
  assert.deepEqual(plain(data.byIso[158].pop), { v: 1, yr: 2020 });                   // no fallback for pop, so the World Bank value stays
  assert.deepEqual(plain(data.byIso[158].gdppc), { v: null, why: 'No figure in the World Bank data' });
  assert.deepEqual(Object.keys(data.byIso[702]).sort(), ['a2', 'facts', 'gdp', 'gdppc', 'known', 'langs', 'name', 'orgs', 'pop', 'unis']);
});

test('render writes a generated-file comment first and a script the pages can load', () => {
  const data = B.assemble({ regions: { asia: [entry()] }, meta: META, wb: wbOf([['SG', { v: 6, yr: 2024 }]], [], []), asof: '2026-10-30' });
  const text = B.render(data);
  assert.match(text.split('\n')[0], /^\/\*.*generated.*do not edit/i);
  const win = {};
  require('node:vm').runInNewContext(text, { window: win });
  assert.equal(win.SerasiCountryData.asof, '2026-10-30');
  assert.equal(win.SerasiCountryData.byIso[702].name, 'Singapore');
  assert.equal(win.SerasiCountryData.byIso[702].gdp.v, null);
});

test('assemble refuses a region file that breaks the schema', () => {
  const bad = (over, re) => assert.throws(() => B.assemble({ regions: { asia: [entry(over)] }, meta: META, wb: wbOf([], [], []), asof: '2026-10-30' }), re);
  bad({ iso: '702' }, /iso/);
  bad({ a2: 'sg' }, /a2/);
  bad({ langs: [] }, /langs/);
  bad({ known: 'x' }, /known/);
  bad({ unis: [] }, /unis/);
  bad({ unis: [{ n: 'X', rank: 0 }] }, /rank/);
  bad({ unis: [{ n: 'X', rank: 1.5 }] }, /rank/);
  bad({ unis: [{ n: 'X', url: 'http://x.org' }] }, /url/);
  bad({ fallback: { gdp: { v: 1, yr: 2024, srcUrl: 'https://x.org' } } }, /\.src\b/);                       // the source needs a name
  bad({ fallback: { gdp: { v: 1, yr: 2024, src: 'https://x.org', srcUrl: 'https://x.org' } } }, /\.src\b/);  // src is a name, not a link
  bad({ fallback: { gdp: { v: 1, yr: 2024, src: 'IMF' } } }, /srcUrl/);                                     // and it needs a link
  bad({ fallback: { gdp: { v: 1, yr: 2024, src: 'IMF', srcUrl: 'http://x.org' } } }, /srcUrl/);
  bad({ fallback: { area: { v: 1, yr: 2024, src: 'IMF', srcUrl: 'https://x.org' } } }, /fallback/);
  bad({ extra: 1 }, /extra/);
});

test('assemble refuses a repeated iso or flag code', () => {
  const two = over => () => B.assemble({ regions: { asia: [entry()], europe: [entry(over)] }, meta: META, wb: wbOf([], [], []), asof: '2026-10-30' });
  assert.throws(two({ a2: 'XX' }), /iso/);
  assert.throws(two({ iso: 999 }), /a2/);
});

test('the region files and _meta.json follow the schema', () => {
  const meta = JSON.parse(fs.readFileSync(path.join(REGION_DIR, '_meta.json'), 'utf8'));
  assert.ok(typeof meta.qsEdition === 'string' && /QS World University Rankings 20\d\d/.test(meta.qsEdition), meta.qsEdition);
  assert.match(meta.qsUrl, /^https:\/\//);
  const regions = B.readRegions(REGION_DIR);
  for (const name of DONE_REGIONS) assert.ok(regions[name], name + '.json exists');
  assert.doesNotThrow(() => B.assemble({ regions, meta, wb: wbOf([], [], []), asof: '2026-10-30' }));
});

test('the link checker visits the link of a fallback figure', async () => {
  const { collectUrls } = await import(pathToFileURL(path.join(ROOT, 'scripts', 'check-links.mjs')).href);
  const win = { SerasiCountryData: { byIso: { 158: { a2: 'TW', unis: [], pop: { v: 1, yr: 2025, src: 'Example office, 2025', srcUrl: 'https://stat.example/tw' }, gdp: { v: null, why: 'x' } } } } };
  assert.ok(collectUrls(win).some(l => l.url === 'https://stat.example/tw'));
});

// ---- The data ----

test('every core country name is in the atlas fixture', () => {
  for (const n of coreNames()) assert.ok(fixture.some(c => c.name === atlasName(n)), n);
});

test('the generated file exists once a region is done and records the QS edition', () => {
  if (!DONE_REGIONS.length) return;
  assert.ok(hasData, 'run node scripts/build-countries.mjs');
  const meta = JSON.parse(fs.readFileSync(path.join(REGION_DIR, '_meta.json'), 'utf8'));
  assert.equal(D.qs.edition, meta.qsEdition);
  assert.equal(D.qs.url, meta.qsUrl);
  assert.equal(D.wb.url, 'https://data.worldbank.org/');
  assert.match(D.asof, /^20\d\d-\d\d-\d\d$/);
});

test('every core atlas country in a finished region has a complete profile', () => {
  const names = new Set([...coreNames()].map(atlasName));
  for (const c of fixture.filter(c => DONE_REGIONS.includes(c.region) && names.has(c.name))) {
    const p = D.byIso[c.id]; assert.ok(p, c.name);
    assert.match(p.a2, /^[A-Z]{2}$/); assert.ok(p.langs.length >= 1 && p.known.length >= 2 && p.facts.length >= 2 && p.orgs.length >= 2 && p.unis.length >= 1, c.name);   // 3–6 organisations where they exist; small countries may have two
    for (const f of [p.pop, p.gdp, p.gdppc]) assert.ok((f.v > 0 && f.yr >= 2018 && f.yr <= 2026) || (f.v === null && f.why), c.name);
  }
});

test('Singapore and Hong Kong have profiles when Asia is done (they are city dots in the atlas, not shapes)', () => {
  if (!DONE_REGIONS.includes('asia')) return;
  assert.equal(D.byIso[702].name, 'Singapore');
  assert.equal(D.byIso[344].name, 'Hong Kong');
});

test('profile counts stay within the schema limits', () => {
  for (const [iso, p] of Object.entries(D.byIso)) {
    assert.ok(p.known.length >= 2 && p.known.length <= 4, p.name + ' known');
    assert.ok(p.facts.length >= 2 && p.facts.length <= 4, p.name + ' facts');
    assert.ok(p.orgs.length >= 2 && p.orgs.length <= 6, p.name + ' orgs');
    assert.ok(p.unis.length >= 1 && p.unis.length <= 5, p.name + ' unis');
    for (const s of [...p.langs, ...p.known, ...p.facts, ...p.orgs]) assert.ok(typeof s === 'string' && s.trim() === s && s.length > 1, p.name + ': ' + s);
  }
});

test('flag codes are unique', () => {
  const seen = new Map();
  for (const [iso, p] of Object.entries(D.byIso)) {
    assert.ok(!seen.has(p.a2), p.name + ' repeats the flag code ' + p.a2 + ' of ' + seen.get(p.a2));
    seen.set(p.a2, p.name);
  }
});

test('every WORLD country and iso match a profile name', () => {
  for (const h of WORLD) {
    const c = fixture.find(x => x.id === h.iso);
    if (!c || !DONE_REGIONS.includes(c.region)) continue;
    assert.ok(D.byIso[h.iso], h.country + ' (' + h.iso + ') has a WORLD hub but no profile');
    assert.equal(D.byIso[h.iso].name, h.country);
  }
});

test('ranked institutions carry integer ranks', () => {
  for (const p of Object.values(D.byIso)) for (const u of p.unis) {
    assert.ok(typeof u.n === 'string' && u.n.length > 2, p.name);
    if (u.rank !== undefined) assert.ok(Number.isInteger(u.rank) && u.rank > 0, p.name + ' ' + u.n);
    if (u.url !== undefined) assert.match(u.url, /^https:\/\/\S+$/, p.name + ' ' + u.n);
  }
});

test('a figure that came from a fallback names its source and links to it', () => {
  for (const p of Object.values(D.byIso)) for (const f of [p.pop, p.gdp, p.gdppc]) {
    if (f.src !== undefined) {
      assert.ok(typeof f.src === 'string' && f.src.length > 3 && !/^https?:/.test(f.src), p.name + ' src is a name, not a link');
      assert.match(f.srcUrl, /^https:\/\/\S+$/, p.name + ' srcUrl');
    }
    if (f.srcUrl !== undefined) assert.ok(f.src, p.name + ' srcUrl without src');
    if (f.v === null) assert.ok(typeof f.why === 'string' && f.why.length > 5, p.name);
  }
});

// Region tasks append their DONE_REGIONS.push(...) line below this line.
DONE_REGIONS.push('asia');
DONE_REGIONS.push('europe');
