'use strict';
// The country data builder refuses a bad World Bank download, and the committed serasi-countries-data.js matches the region files.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { load, plain } = require('./helpers/load');

const ROOT = path.join(__dirname, '..');
let B;
test.before(async () => { B = await import(pathToFileURL(path.join(ROOT, 'scripts', 'build-countries.mjs')).href); });

const mapOf = n => new Map(Array.from({ length: n }, (_, i) => ['C' + i, { v: 1, yr: 2024 }]));
const wbOf = n => ({ pop: mapOf(n), gdp: mapOf(n), gdppc: mapOf(n) });

test('checkWbSize accepts about 200 countries and refuses an indicator with fewer than 100', () => {
  assert.doesNotThrow(() => B.checkWbSize(wbOf(200)));
  assert.doesNotThrow(() => B.checkWbSize(wbOf(100)));
  assert.throws(() => B.checkWbSize(wbOf(99)), /fewer than 100/);
  assert.throws(() => B.checkWbSize({ pop: mapOf(200), gdp: mapOf(5), gdppc: mapOf(200) }), /NY\.GDP\.MKTP\.CD.*5 countries/);
  assert.throws(() => B.checkWbSize({ pop: mapOf(200), gdp: mapOf(200) }), /SP|NY\.GDP\.PCAP\.CD/);
});

test('pagesOf reads paging.pages and refuses a response without it', () => {
  assert.equal(B.pagesOf([{ page: 1, pages: 3 }, []]), 3);
  assert.throws(() => B.pagesOf([{ page: 1 }, []]), /paging\.pages/);
  assert.throws(() => B.pagesOf({ message: [] }), /paging\.pages/);
});

const dataWith = (missing, total) => {
  const byIso = {};
  for (let i = 0; i < total / 3; i++) {
    const fig = n => (n < missing ? { v: null, why: 'x' } : { v: 1, yr: 2024 });
    byIso[i] = { name: 'C' + i, pop: fig(i * 3), gdp: fig(i * 3 + 1), gdppc: fig(i * 3 + 2) };
  }
  return { byIso };
};

test('checkMissing refuses a file where more than a quarter of the figures are missing, and lists the few that are', () => {
  assert.deepEqual(plain(B.checkMissing(dataWith(2, 60))), ['C0 pop', 'C0 gdp']);
  assert.doesNotThrow(() => B.checkMissing(dataWith(15, 60)));
  assert.throws(() => B.checkMissing(dataWith(16, 60)), /16 of 60 figures.*more than a quarter/);
});

test('the committed serasi-countries-data.js matches scripts/countries/*.json except for the World Bank figures', () => {
  const rebuilt = B.assemble({
    regions: B.readRegions(), meta: B.readMeta(), asof: 'x',
    wb: { pop: new Map(), gdp: new Map(), gdppc: new Map() }
  });
  const committed = load(['serasi-countries-data.js']).SerasiCountryData;
  const strip = c => { const o = { ...c }; for (const k of ['pop', 'gdp', 'gdppc']) delete o[k]; return o; };
  assert.deepEqual(Object.keys(committed.byIso), Object.keys(rebuilt.byIso), 'the same countries, in the same order');
  for (const [iso, c] of Object.entries(rebuilt.byIso)) assert.deepEqual(plain(strip(committed.byIso[iso])), plain(strip(c)), c.name + ' differs from its region file; run node scripts/build-countries.mjs');
  assert.deepEqual(plain(committed.qs), plain(rebuilt.qs));
  assert.deepEqual(plain(committed.wb), plain(rebuilt.wb));
  // A figure that comes from a fallback in a region file is the same in the committed file.
  const regions = B.readRegions();
  for (const e of Object.values(regions).flat()) for (const [k, f] of Object.entries(e.fallback || {})) {
    assert.deepEqual(plain(committed.byIso[e.iso][k]), { v: f.v, yr: f.yr, src: f.src, srcUrl: f.srcUrl }, e.name + ' ' + k);
  }
});
