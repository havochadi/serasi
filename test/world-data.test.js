'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-sectors.js']);
const { WORLD, SOURCES, INDUSTRY, OUTLOOK } = w.SerasiPathways;
// The world-atlas countries (plus the two places that appear only as city dots), for the numeric iso check.
const ATLAS = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'atlas-ids.json'), 'utf8'));
const ATLAS_IDS = new Set(ATLAS.map(c => c.id));

const DONE = [];                       // industries finished so far; each sector task appends its own `DONE.push('key', ...)` line at the END of this file
const SHORT = {};                      // industry → reason it lists fewer than 5 countries; each sector task appends `SHORT.key = '...'` at the END of this file

test('every WORLD entry is well formed', () => {
  const seen = new Set();
  for (const h of WORLD) {
    assert.ok(h.id && !seen.has(h.id), 'unique id: ' + h.id);
    seen.add(h.id);
    assert.ok(h.place && h.country, h.id + ' needs a place and a country');
    assert.ok(Number.isInteger(h.iso) && ATLAS_IDS.has(h.iso), h.id + ' iso ' + h.iso + ' is not in the atlas fixture');
    assert.ok(Array.isArray(h.ll) && h.ll.length === 2, h.id + ' needs ll [lon, lat]');
    const [lon, lat] = h.ll;
    assert.ok(lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90, h.id + ' ll out of range: ' + h.ll);
    const keys = Object.keys(h.ind);
    assert.ok(keys.length > 0, h.id + ' lists no industry');
    for (const k of keys) {
      const where = h.id + '.' + k;
      assert.ok(INDUSTRY[k], where + ' is not an INDUSTRY key');
      const [outlook, text, src] = h.ind[k];
      assert.ok(OUTLOOK[outlook], where + ' outlook ' + outlook);
      assert.equal(typeof text, 'string', where + ' note');
      assert.ok(text.length >= 20 && text.length <= 400, where + ' note is ' + text.length + ' characters');
      assert.ok(Array.isArray(src), where + ' sources');
      if (k !== 'public') assert.ok(src.length >= 1, where + ' needs at least one source');
      for (const s of src) assert.ok(SOURCES[s], where + ' source ' + s + ' is not in SOURCES');
    }
  }
});

test('every source is an https link', () => {
  for (const [k, v] of Object.entries(SOURCES)) {
    assert.ok(Array.isArray(v) && v.length === 2, k + ' should be [label, url]');
    assert.ok(typeof v[0] === 'string' && v[0].length > 0, k + ' needs a label');
    assert.ok(typeof v[1] === 'string' && /^https:\/\/\S+$/.test(v[1]), k + ' needs an https url');
  }
});

test('finished industries list enough countries', () => {
  for (const k of DONE) {
    const n = new Set(WORLD.filter(h => h.ind[k]).map(h => h.iso)).size;
    assert.ok(n >= 5 || SHORT[k], k + ' lists ' + n);
  }
});

test('public service stays Singapore-only', () => {
  for (const h of WORLD) if (h.ind.public) assert.equal(h.iso, 702, h.id + ' lists public service but is not Singapore');
});

test('each country has at most one nationwide entry', () => {
  const seen = new Set();
  for (const h of WORLD.filter(h => h.scope === 'country')) {
    assert.ok(!seen.has(h.iso), h.country + ' has two nationwide entries');
    seen.add(h.iso);
  }
});

// Sector tasks append their DONE.push(...) and SHORT.<key> lines below this line.
DONE.push('care');
