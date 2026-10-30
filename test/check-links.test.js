'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// The link checker is an ES module; importing it must not start any request.
const checker = import('../scripts/check-links.mjs');

const FLAG = 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/';

test('collectUrls gathers https links from every data set, once each, and says where each is used', async () => {
  const { collectUrls } = await checker;
  const opt = (url, extra = {}) => ({ country: 'Australia', school: 'Uni', url, ...extra });
  const window = {
    SerasiPathways: {
      SOURCES: { 'fx-ecb': ['ECB', 'https://ecb.example/fx'], old: ['Plain http', 'http://old.example/x'], shared: ['Shared', 'https://shared.example/p'] },
      CONTACTS: { moe: { n: 'MOE', url: 'https://moe.example' }, tel: { n: 'No link' } }
    },
    SerasiLocal: { COURSES: [{ school: 'NUS', course: 'BA', url: 'https://shared.example/p' }, { school: 'ITE', course: 'Nitec', url: 'https://ite.example/c' }] },
    SerasiOverseas: {
      OPTIONS: {
        architecture: { best: opt('https://best.example'), alts: [opt('https://alt.example', { links: ['https://extra.example'] })] },
        teaching: { agency: 'See https://agency.example for the Singapore route.' }
      }
    },
    SerasiCountryData: {
      byIso: { 410: { a2: 'KR', unis: [{ url: 'https://snu.example' }, {}], pop: { v: 1, yr: 2025, src: 'https://stat.example' }, gdp: { v: null, why: 'x' } } }
    }
  };
  const got = Object.fromEntries(collectUrls(window).map(l => [l.url, l.where]));
  assert.deepEqual(got, {
    'https://ecb.example/fx': ['SOURCES.fx-ecb'],
    'https://shared.example/p': ['SOURCES.shared', 'COURSES: NUS, BA'],
    'https://moe.example': ['CONTACTS.moe'],
    'https://ite.example/c': ['COURSES: ITE, Nitec'],
    'https://best.example': ['OPTIONS.architecture.best'],
    'https://alt.example': ['OPTIONS.architecture.alts[0]'],
    'https://extra.example': ['OPTIONS.architecture.alts[0].links[0]'],
    'https://snu.example': ['COUNTRY 410 unis[0]'],
    'https://stat.example': ['COUNTRY 410 figure source'],
    [FLAG + 'kr.svg']: ['COUNTRY 410 flag'],
    'https://data.worldbank.org/country/KR': ['COUNTRY 410 World Bank page']
  });
});

test('collectUrls copes with data sets that are missing or empty', async () => {
  const { collectUrls } = await checker;
  assert.deepEqual(collectUrls({}), []);
  assert.deepEqual(collectUrls({ SerasiLocal: { COURSES: [] }, SerasiOverseas: { OPTIONS: {} } }), []);
});

test('classify passes 200-399, sends 401 403 406 429 999 to a person, and fails the rest', async () => {
  const { classify } = await checker;
  for (const s of [200, 204, 301, 399]) assert.equal(classify(s), 'pass', String(s));
  for (const s of [401, 403, 406, 429, 999]) assert.equal(classify(s), 'by-hand', String(s));
  for (const s of [400, 404, 410, 500, 503]) assert.equal(classify(s), 'fail', String(s));
});

test('the script still runs when it is started through a symlink', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-links-'));
  try {
    fs.symlinkSync(path.join(__dirname, '..', 'scripts'), path.join(dir, 'linked'));
    const run = spawnSync(process.execPath, [path.join(dir, 'linked', 'check-links.mjs'), '--bogus'], { encoding: 'utf8' });
    assert.equal(run.status, 2);
    assert.match(run.stderr, /^Usage: node scripts\/check-links\.mjs/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('collectUrls skips the World Bank country page when all three figures carry their own source', async () => {
  const { collectUrls } = await checker;
  const own = n => ({ v: n, yr: 2024, src: 'National statistics office', srcUrl: 'https://stat.example/' + n });
  const wb = { v: 1, yr: 2024 };
  const pages = byIso => collectUrls({ SerasiCountryData: { byIso } }).map(l => l.url).filter(u => u.includes('worldbank'));
  assert.deepEqual(pages({ 158: { a2: 'TW', pop: own(1), gdp: own(2), gdppc: own(3) } }), []);
  assert.deepEqual(pages({ 158: { a2: 'TW', pop: own(1), gdp: own(2), gdppc: wb } }), ['https://data.worldbank.org/country/TW']);
  assert.deepEqual(pages({ 158: { a2: 'TW', pop: own(1), gdp: own(2), gdppc: { v: null, why: 'x' } } }), ['https://data.worldbank.org/country/TW']);
});
