'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-countries.js']);
const C = w.SerasiCountries, P = w.SerasiPathways;
const { esc } = w.SerasiCore;

// Stand-in for the page's srcLinks: the same markup shape, built from the keys it is given.
const srcLinks = keys => { const list = [...new Set(keys || [])]; return list.length ? '<p class="src">Sources: ' + list.map(k => '<a href="https://example.org/' + k + '">' + k + '</a>').join(' · ') + '</p>' : ''; };
const h = { esc, srcLinks };

// Synthetic world: Alpha has a nationwide tech note; Beta has two city notes that disagree; Gamma has finance only; Delta has no notes at all.
// iso 99 has a note but no profile in byIso.
const WORLD = [
  { id: 'alpha', place: 'Alpha (nationwide)', country: 'Alpha', iso: 1, scope: 'country', ll: [0, 0], ind: {
    tech: ['grow', 'Alpha tech is booming.', ['src-a1', 'src-a2']],
    energy: ['steady', 'Alpha energy is flat.', ['src-a3']] } },
  { id: 'alpha-city', place: 'Alphaville', country: 'Alpha', iso: 1, ll: [1, 1], ind: { tech: ['decline', 'Alphaville tech is shrinking.', ['src-a4']] } },
  { id: 'beta-one', place: 'Beta City', country: 'Beta', iso: 2, ll: [2, 2], ind: {
    tech: ['grow', 'Beta City tech is growing.', ['src-b1']],
    finance: ['steady', 'Beta City finance is steady.', ['src-b3']] } },
  { id: 'beta-two', place: 'Beta Port', country: 'Beta', iso: 2, ll: [3, 3], ind: { tech: ['decline', 'Beta Port tech is shrinking.', ['src-b2']] } },
  { id: 'gamma', place: 'Gamma (nationwide)', country: 'Gamma', iso: 3, scope: 'country', ll: [4, 4], ind: { finance: ['grow', 'Gamma finance is growing.', []] } },
  { id: 'omega', place: 'Omega (nationwide)', country: 'Omega', iso: 99, scope: 'country', ll: [5, 5], ind: { tech: ['grow', 'Omega tech is growing.', []] } },
  { id: 'twin-a', place: 'Twin A', country: 'Twin', iso: 5, ll: [6, 6], ind: { tech: ['grow', 'Twin A tech is growing.', []] } },
  { id: 'twin-b', place: 'Twin B', country: 'Twin', iso: 5, ll: [7, 7], ind: { tech: ['grow', 'Twin B tech is growing.', []] } }
];
const DATA = {
  asof: 'October 2026',
  qs: { edition: '2026', url: 'https://qs.example/2026' },
  wb: { url: 'https://wb.example/api' },
  byIso: {
    1: {
      name: 'Alpha', a2: 'KR', langs: ['Alphan', 'Betish'],
      pop: { v: 51684564, yr: 2025 }, gdp: { v: 1.9e12, yr: 2024 }, gdppc: { v: 36793.4, yr: 2024 },
      known: ['Making alpha things', 'Alpha tea'], facts: ['Alpha has three rivers.', 'Alpha drives on the left.'],
      orgs: ['Alpha Air', 'Alpha Bank'],
      unis: [{ n: 'Alpha National University', rank: 12, url: 'https://alpha.example/uni' }, { n: 'Alpha Tech' }]
    },
    2: {
      name: 'Beta', a2: 'zz', langs: 'Betish',
      pop: { v: 5.67e6, yr: 2025 }, gdp: { v: null, why: 'The World Bank has no GDP figure for Beta.' }, gdppc: { v: 4100, yr: 2024, src: 'Beta Statistics Office' },
      known: ['Ports'], facts: [], orgs: ['Beta Shipping'], unis: [{ n: 'University of Beta', rank: 1 }]
    },
    3: { name: 'Gamma', a2: 'gb', langs: ['Gammese'], pop: { v: 300000, yr: 2024 }, gdp: { v: 1.2e9, yr: 2023 }, gdppc: { v: 33121, yr: 2023 }, known: ['Banks'], facts: ['One fact.'], orgs: ['Gamma Bank'], unis: [{ n: 'Gamma University', rank: '601-650' }] },
    4: { name: 'Delta', a2: 'de', langs: ['Deltan'], pop: { v: 1000, yr: 2024 }, gdp: { v: null, why: 'none' }, gdppc: { v: null, why: 'none' }, known: ['Mud'], facts: ['Muddy.'], orgs: ['Delta Co'], unis: [{ n: 'Delta College' }] }
  }
};
const W = WORLD, B = DATA.byIso;
// profileHtml reads the QS edition and World Bank link from SerasiCountryData; the tests pass it in the options so they do not depend on the global.
const prof = (iso, k, over = {}) => C.profileHtml(iso, k, h, W, B, { data: DATA, ...over });

test('sectorList puts a country with a nationwide note in its outlook group, and cities that disagree in steady', () => {
  const L = C.sectorList('tech', W, B);
  assert.deepEqual(plain(L.grow.map(x => x.name)), ['Alpha']);
  assert.deepEqual(plain(L.steady.map(x => x.name)), ['Beta']);
  assert.deepEqual(plain(L.decline), []);
});
test('sectorList items carry iso, name, outlook and notes', () => {
  const L = C.sectorList('tech', W, B);
  const beta = L.steady[0];
  assert.equal(beta.iso, 2); assert.equal(beta.name, 'Beta'); assert.equal(beta.outlook, 'steady');
  assert.equal(beta.notes.length, 2);
  assert.deepEqual(plain(beta.notes.map(n => [n.place, n.text])), [['Beta City', 'Beta City tech is growing.'], ['Beta Port', 'Beta Port tech is shrinking.']]);
  assert.equal(L.grow[0].iso, 1); assert.equal(L.grow[0].outlook, 'grow');
  assert.equal(L.grow[0].notes.length, 2, 'Alpha has its nationwide note and its city note');
  assert.equal(L.grow[0].notes[0].text, 'Alpha tech is booming.', 'the nationwide note comes first');
});
test('sectorList rest is every other country in byIso, alphabetically, with no outlook', () => {
  const L = C.sectorList('tech', W, B);
  assert.deepEqual(plain(L.rest.map(x => x.name)), ['Delta', 'Gamma']);
  assert.equal(L.rest[0].outlook, undefined);
  assert.deepEqual(plain(L.rest[0].notes), []);
});
test('sectorList lists only countries that are in byIso (a note without a profile is not listed)', () => {
  const all = (L => [].concat(L.grow, L.steady, L.decline, L.rest).map(x => x.iso))(C.sectorList('tech', W, B));
  assert.ok(!all.includes(99));
  assert.deepEqual(all.slice().sort(), [1, 2, 3, 4]);
});
test('sectorList for another sector regroups the countries', () => {
  const L = C.sectorList('finance', W, B);
  assert.deepEqual(plain(L.grow.map(x => x.name)), ['Gamma']);
  assert.deepEqual(plain(L.steady.map(x => x.name)), ['Beta']);
  assert.deepEqual(plain(L.rest.map(x => x.name)), ['Alpha', 'Delta']);
});
test('sectorList for a sector with no notes anywhere puts everyone in rest, A to Z', () => {
  const L = C.sectorList('public', W, B);
  assert.deepEqual(plain([L.grow, L.steady, L.decline].map(g => g.length)), [0, 0, 0]);
  assert.deepEqual(plain(L.rest.map(x => x.name)), ['Alpha', 'Beta', 'Delta', 'Gamma']);
});

test('countryOutlook: Beta\'s cities disagree, so tech is steady', () => assert.equal(C.countryOutlook(2, 'tech', W), 'steady'));
test('countryOutlook: a nationwide note wins over a city that disagrees', () => assert.equal(C.countryOutlook(1, 'tech', W), 'grow'));
test('countryOutlook: cities that agree share their outlook', () => assert.equal(C.countryOutlook(5, 'tech', W), 'grow'));
test('countryOutlook: a single city\'s outlook stands for the country', () => assert.equal(C.countryOutlook(2, 'finance', W), 'steady'));
test('countryOutlook is null with no note for the sector, no such country, or no code', () => {
  assert.equal(C.countryOutlook(3, 'tech', W), null);
  assert.equal(C.countryOutlook(4, 'tech', W), null);
  assert.equal(C.countryOutlook(9999, 'tech', W), null);
  assert.equal(C.countryOutlook(undefined, 'tech', W), null);
  assert.equal(C.countryOutlook(null, 'tech', W), null);
  assert.equal(C.countryOutlook('', 'tech', W), null);
});
test('countryOutlook accepts a code written as a string, as in a data attribute', () => assert.equal(C.countryOutlook('2', 'tech', W), 'steady'));
test('countryOutlook uses the real world map when none is passed', () => {
  assert.equal(C.countryOutlook(156, 'construction'), 'decline');
  assert.equal(C.countryOutlook(156, 'tech'), 'grow');
  assert.equal(C.countryOutlook(702, 'finance'), 'grow');
  assert.equal(C.countryOutlook(702, 'public'), 'steady');
});

test('countryNotes lists every note for a country, nationwide first, as {k, place, o}', () => {
  const n = C.countryNotes(1, W);
  assert.deepEqual(plain(n.map(x => [x.k, x.place])), [['tech', 'Alpha (nationwide)'], ['energy', 'Alpha (nationwide)'], ['tech', 'Alphaville']]);
  assert.deepEqual(plain(n[0].o), ['grow', 'Alpha tech is booming.', ['src-a1', 'src-a2']]);
  assert.deepEqual(Object.keys(n[0]).sort(), ['k', 'o', 'place']);
});
test('countryNotes for Beta gives its cities in map order', () =>
  assert.deepEqual(plain(C.countryNotes(2, W).map(x => [x.k, x.place])), [['tech', 'Beta City'], ['finance', 'Beta City'], ['tech', 'Beta Port']]));
test('countryNotes is empty for an unknown country or no code', () => {
  assert.deepEqual(plain(C.countryNotes(9999, W)), []);
  assert.deepEqual(plain(C.countryNotes(undefined, W)), []);
  assert.deepEqual(plain(C.countryNotes(4, W)), []);
});

test('figureText: people', () => assert.equal(C.figureText({ v: 51684564, yr: 2025 }, 'people'), 'about 52 million (2025)'));
test('figureText: usd', () => assert.equal(C.figureText({ v: 1.9e12, yr: 2024 }, 'usd'), 'about US$1.9 trillion (2024)'));
test('figureText: a null figure is "not available" (Review Focus 5)', () => {
  assert.equal(C.figureText({ v: null, why: 'x' }, 'usd'), 'not available');
  assert.equal(C.figureText({ v: null, why: 'x' }, 'people'), 'not available');
  assert.equal(C.figureText(undefined, 'people'), 'not available');
  assert.equal(C.figureText(null, 'usd'), 'not available');
});
test('figureText never prints NaN, zero or a figure without a year', () => {
  for (const f of [{ v: NaN, yr: 2024 }, { v: 0, yr: 2024 }, { v: -5, yr: 2024 }, { v: Infinity, yr: 2024 }, { v: '5', yr: 2024 }, { v: 5e6 }, { v: 5e6, yr: null }, {}])
    assert.equal(C.figureText(f, 'people'), 'not available', JSON.stringify(f));
});
test('figureText: one decimal under 10 in a scale, none from 10 up, and a trailing .0 is dropped', () => {
  assert.equal(C.figureText({ v: 5.67e6, yr: 2025 }, 'people'), 'about 5.7 million (2025)');
  assert.equal(C.figureText({ v: 2.01e6, yr: 2025 }, 'people'), 'about 2 million (2025)');
  assert.equal(C.figureText({ v: 12.4e6, yr: 2025 }, 'people'), 'about 12 million (2025)');
  assert.equal(C.figureText({ v: 1.41e9, yr: 2025 }, 'people'), 'about 1.4 billion (2025)');
  assert.equal(C.figureText({ v: 3.0e11, yr: 2024 }, 'usd'), 'about US$300 billion (2024)');
});
test('figureText: a figure that rounds up to 1,000 moves to the next scale', () => {
  assert.equal(C.figureText({ v: 999.6e6, yr: 2025 }, 'people'), 'about 1 billion (2025)');
  assert.equal(C.figureText({ v: 999700, yr: 2025 }, 'people'), 'about 1 million (2025)');
});
test('figureText: figures under a million show three significant figures with commas', () => {
  assert.equal(C.figureText({ v: 33121, yr: 2023 }, 'usd'), 'about US$33,100 (2023)');
  assert.equal(C.figureText({ v: 11204, yr: 2023 }, 'people'), 'about 11,200 (2023)');
  assert.equal(C.figureText({ v: 800, yr: 2023 }, 'people'), 'about 800 (2023)');
  assert.equal(C.figureText({ v: 57, yr: 2023 }, 'people'), 'about 57 (2023)');
});
test('figureText fails loudly on a kind it does not know', () => assert.throws(() => C.figureText({ v: 5, yr: 2024 }, 'eur'), /kind/));

test('flagUrl is the pinned flag-icons image, lowercase', () => {
  assert.equal(C.flagUrl('KR'), 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/kr.svg');
  assert.equal(C.flagUrl('hk'), 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/hk.svg');
});
test('flagUrl is an empty string for anything that is not a two-letter code', () => {
  for (const x of [undefined, null, '', 'K', 'KOR', '../x', 'k1', 42]) assert.equal(C.flagUrl(x), '', String(x));
});

test('profileFor gives the record for a code (number or string), else null', () => {
  assert.equal(C.profileFor(1, B).name, 'Alpha');
  assert.equal(C.profileFor('1', B).name, 'Alpha');
  for (const x of [9999, undefined, null, '', 'constructor', '__proto__', NaN]) assert.equal(C.profileFor(x, B), null, String(x));
});
test('profileFor reads SerasiCountryData when no byIso is passed', () => {
  w.SerasiCountryData = DATA;
  try { assert.equal(C.profileFor(2).name, 'Beta'); } finally { delete w.SerasiCountryData; }
  assert.equal(C.profileFor(2), null, 'with no data loaded there is no profile');
});

test('profileHtml with no code or no profile says "No profile yet" and nothing undefined (Review Focus 2)', () => {
  for (const iso of [undefined, null, 9999, '', 'x']) {
    const out = C.profileHtml(iso, 'tech', h, W, B);
    assert.match(out, /No profile yet/, String(iso));
    assert.doesNotMatch(out, /undefined|NaN|null/, String(iso));
    assert.match(out, /data-action="world-clear"/);
  }
});
test('profileHtml with no profile uses the name it is given, escaped', () => {
  const out = C.profileHtml(undefined, 'tech', h, W, B, { name: 'Kosovo <b>' });
  assert.match(out, /Kosovo &lt;b&gt;/); assert.doesNotMatch(out, /<b>/);
  assert.match(out, /No profile yet/);
});
test('profileHtml with no profile still shows the map\'s notes for that country', () => {
  const out = C.profileHtml(99, 'tech', h, W, B);
  assert.match(out, /No profile yet/); assert.match(out, /Omega/); assert.match(out, /Omega tech is growing\./);
});
test('profileHtml with no profile and no notes is just the name, the message and the back button', () => {
  const out = C.profileHtml(9999, 'tech', h, W, B);
  assert.doesNotMatch(out, /No checked note|country-sector|country-more/);
  assert.match(out, /<h2>This country<\/h2>/);
});
test('profileHtml works with no data loaded at all (the page has not fetched it)', () => {
  const out = C.profileHtml(1, 'tech', h, W);
  assert.match(out, /No profile yet/); assert.doesNotMatch(out, /undefined/);
});

test('a full profile starts with the flag image and the name', () => {
  const out = prof(1, 'tech');
  assert.ok(out.includes('<img class="flag" src="' + C.flagUrl('KR') + '" alt="Alpha">'), out);
  assert.match(out, /<h2>Alpha<\/h2>/);
  assert.ok(out.indexOf('class="flag"') < out.indexOf('<h2>Alpha'));
});
test('a full profile shows the sector outlook with its notes and their sources', () => {
  const out = prof(1, 'tech');
  assert.match(out, /Tech, AI and data/);
  assert.match(out, /<span class="pill grow">Growing<\/span>/);
  assert.match(out, /Alpha tech is booming\./);
  assert.match(out, /Alphaville/); assert.match(out, /Alphaville tech is shrinking\./);
  const sector = out.slice(0, out.indexOf('Population'));
  for (const k of ['src-a1', 'src-a2', 'src-a4']) assert.ok(sector.includes('https://example.org/' + k), k);
  assert.ok(!sector.includes('src-a3'), 'the energy note\'s source belongs to the other-sector section');
});
test('the sector outlook comes before the figures table, which comes before known-for, facts, organisations and institutions', () => {
  const out = prof(1, 'tech');
  const at = s => { const i = out.indexOf(s); assert.ok(i >= 0, s); return i; };
  const order = [at('Alpha tech is booming.'), at('Population'), at('Known for'), at('Facts'), at('Notable organisations'), at('Top-rated institutions'), at('Alpha energy is flat.'), at('compiled by Serasi'), at('data-action="world-clear"')];
  assert.deepEqual(order.slice().sort((a, b) => a - b), order);
});
test('a full profile shows the four figures with years, and the languages', () => {
  const out = prof(1, 'tech');
  assert.match(out, /Population/); assert.match(out, /about 52 million \(2025\)/);
  assert.match(out, /GDP\b/); assert.match(out, /about US\$1\.9 trillion \(2024\)/);
  assert.match(out, /GDP per person/); assert.match(out, /about US\$36,800 \(2024\)/);
  assert.match(out, /Languages/); assert.match(out, /Alphan, Betish/);
});
test('a full profile lists what it is known for, facts and organisations', () => {
  const out = prof(1, 'tech');
  for (const s of ['Making alpha things', 'Alpha tea', 'Alpha has three rivers.', 'Alpha drives on the left.', 'Alpha Air', 'Alpha Bank']) assert.ok(out.includes('<li>' + s + '</li>'), s);
});
test('institutions: a ranked one shows the QS edition and rank, an unranked one says "main national university"', () => {
  const out = prof(1, 'tech');
  assert.match(out, /Alpha National University/); assert.match(out, /QS 2026: 12th/);
  assert.match(out, /<a href="https:\/\/alpha\.example\/uni" target="_blank" rel="noopener">Alpha National University<\/a>/);
  const tech = out.slice(out.indexOf('Alpha Tech'));
  assert.match(tech, /^Alpha Tech[^<]*<\/b>[^]*?main national university/);
  assert.equal(out.match(/main national university/g).length, 1, 'only the unranked one says it');
  assert.doesNotMatch(tech.slice(0, tech.indexOf('</li>')), /QS/, 'no rank claim for the unranked one');
});
test('institutions: a rank written as text (a QS band) is shown as written', () => assert.match(prof(3, 'tech'), /QS 2026: 601-650/));
test('institutions: ordinals are correct (1st, 2nd, 3rd, 11th, 21st, 112th)', () => {
  const rankText = r => { const d = { ...DATA, byIso: { 1: { ...B[1], unis: [{ n: 'U', rank: r }] } } }; return C.profileHtml(1, 'tech', h, W, d.byIso, { data: d }).match(/QS 2026: (\S+?)</)[1]; };
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111, 112].map(rankText), ['1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '23rd', '101st', '111th', '112th']);
});
test('institutions: a rank is not shown when the QS edition is not known', () => {
  const out = C.profileHtml(1, 'tech', h, W, B, { data: { ...DATA, qs: undefined } });
  assert.doesNotMatch(out, /12th/); assert.match(out, /Alpha National University/); assert.doesNotMatch(out, /undefined/);
});
test('other sector notes, including cities, come after the institutions', () => {
  const out = prof(1, 'tech');
  const rest = out.slice(out.indexOf('Top-rated institutions'));
  assert.match(rest, /Alpha energy is flat\./); assert.match(rest, /Clean energy/);
  assert.match(rest, /<span class="pill steady">Steady or mixed<\/span>/);
  assert.ok(rest.includes('https://example.org/src-a3'));
  assert.ok(!out.slice(0, out.indexOf('Top-rated institutions')).includes('Alpha energy is flat.'));
});
test('a city\'s other-sector note names the city; a nationwide one does not', () => {
  const beta = prof(2, 'tech');
  assert.match(beta, /Finance and business services · Beta City/);
  const alpha = prof(1, 'tech');
  assert.match(alpha, /<b>Clean energy\.<\/b>/);
});
test('the source line gives each World Bank figure\'s year, the QS edition, and says the rest is compiled by Serasi', () => {
  const out = prof(1, 'tech');
  const src = out.slice(out.lastIndexOf('<p class="src">Sources:'));
  assert.match(src, /<a href="https:\/\/wb\.example\/api"[^>]*>World Bank<\/a>/);
  assert.match(src, /population 2025/); assert.match(src, /GDP 2024/); assert.match(src, /GDP per person 2024/);
  assert.match(src, /<a href="https:\/\/qs\.example\/2026"[^>]*>QS World University Rankings 2026<\/a>/);
  assert.match(src, /compiled by Serasi/);
  assert.match(src, /not individually sourced/);
});
test('the source line names another source for a figure that has one, and leaves a missing figure out of the World Bank years', () => {
  const out = prof(2, 'tech');
  const src = out.slice(out.lastIndexOf('<p class="src">Sources:'));
  assert.match(src, /World Bank<\/a> \(population 2025\)/);
  assert.doesNotMatch(src, /GDP 20/, 'Beta has no GDP figure');
  assert.match(src, /GDP per person 2024: Beta Statistics Office/);
});
test('a null figure shows "not available" with its reason, and never NaN or 0 (Review Focus 5)', () => {
  const out = prof(2, 'tech');
  assert.match(out, /not available/); assert.match(out, /The World Bank has no GDP figure for Beta\./);
  assert.doesNotMatch(out, /NaN|undefined|null|\b0\b/);
  const delta = prof(4, 'tech');
  assert.equal(delta.match(/not available/g).length, 2);
  assert.doesNotMatch(delta, /NaN|undefined|null/);
});
test('a figure with its own source shows that source in the table', () => assert.match(prof(2, 'tech'), /about US\$4,100 \(2024\)[^]*?Beta Statistics Office/));
test('languages written as one string are shown as given', () => assert.match(prof(2, 'tech'), /Betish/));
test('a country with no note for the sector still opens, and says there is no checked note', () => {
  const out = prof(3, 'tech');
  assert.match(out, /No checked note/i); assert.match(out, /Gamma/);
  assert.match(out, /Gamma finance is growing\./, 'its other sector notes still show');
  assert.doesNotMatch(out, /undefined|NaN/);
});
test('a section with nothing in it is left out, not shown empty', () => {
  const out = prof(2, 'tech');
  assert.doesNotMatch(out, /<h3>Facts<\/h3>/); assert.match(out, /Known for/); assert.match(out, /Notable organisations/);
  const bare = C.profileHtml(4, 'tech', h, W, { 4: { name: 'Delta', a2: 'de' } }, { data: DATA });
  assert.doesNotMatch(bare, /Known for|Facts|Notable organisations|Top-rated|<ul><\/ul>|undefined|NaN/);
  assert.equal(bare.match(/not available/g).length, 4, 'all four figures say not available');
});
test('a profile with no sector chosen skips the sector part', () => {
  const out = C.profileHtml(1, undefined, h, W, B, { data: DATA });
  assert.doesNotMatch(out, /undefined|No checked note/);
  assert.match(out, /Alpha tech is booming\./, 'every sector note is then listed with the others');
});
test('the profile has a back button for the list', () => assert.match(prof(1, 'tech'), /<button class="btn link" type="button" data-action="world-clear">Back to the list<\/button>/));
test('profileHtml escapes names and data', () => {
  const bad = { 7: { name: 'A<script>x</script>', a2: 'zz', langs: ['<i>'], pop: { v: 5e6, yr: 2025 }, gdp: { v: null, why: '<u>' }, gdppc: { v: null, why: '<u>' }, known: ['<b>k</b>'], facts: ['"q"'], orgs: ['O&O'], unis: [{ n: '<em>U</em>', url: 'https://x.example/?a=1&b="2"' }] } };
  const out = C.profileHtml(7, 'tech', h, W, bad, { data: DATA });
  assert.doesNotMatch(out, /<script|<i>|<u>|<b>k|<em>/);
  assert.match(out, /A&lt;script&gt;/); assert.match(out, /O&amp;O/); assert.match(out, /&quot;q&quot;/);
  assert.match(out, /alt="A&lt;script&gt;x&lt;\/script&gt;"/);
});
test('profileHtml and listHtml use the real world map and SerasiCountryData by default', () => {
  w.SerasiCountryData = DATA;
  try {
    const out = C.profileHtml(1, 'tech', h);
    assert.match(out, /Alpha/); assert.match(out, /QS World University Rankings 2026/);
    assert.doesNotMatch(out, /Alpha tech is booming\./, 'the real world map has no Alpha');
    assert.match(C.listHtml('tech', h), /data-iso="1"/);
  } finally { delete w.SerasiCountryData; }
});
test('profileHtml hands the sector notes\' source keys to srcLinks', () => {
  const seen = [];
  C.profileHtml(1, 'tech', { esc, srcLinks: keys => { seen.push(plain(keys)); return srcLinks(keys); } }, W, B, { data: DATA });
  assert.ok(seen.some(k => ['src-a1', 'src-a2', 'src-a4'].every(x => k.includes(x))), 'the tech notes\' keys go together');
  assert.ok(seen.some(k => k.includes('src-a3')), 'the energy note\'s key is passed too');
});

test('listHtml shows the outlook groups as country buttons with the first note', () => {
  const out = C.listHtml('tech', h, W, B);
  const alpha = out.match(/<button class="country-btn" type="button" data-action="country" data-iso="1">[^]*?<\/button>/)[0];
  assert.match(alpha, /<b>Alpha<\/b>/); assert.match(alpha, /<span class="pill grow">Growing<\/span>/); assert.match(alpha, /Alpha tech is booming\./);
  const beta = out.match(/data-iso="2">[^]*?<\/button>/)[0];
  assert.match(beta, /<span class="pill steady">Steady or mixed<\/span>/); assert.match(beta, /Beta City: Beta City tech is growing\./);
});
test('listHtml puts the groups in order and only the countries with notes in them', () => {
  const out = C.listHtml('tech', h, W, B);
  const rest = out.indexOf('<details class="country-rest">');
  assert.ok(out.indexOf('Growing') < out.indexOf('Steady or mixed'));
  assert.ok(out.indexOf('Steady or mixed') < rest);
  assert.ok(out.indexOf('data-iso="1"') < out.indexOf('data-iso="2"') && out.indexOf('data-iso="2"') < rest);
  assert.ok(out.indexOf('data-iso="4"') > rest && out.indexOf('data-iso="3"') > out.indexOf('data-iso="4"'), 'Delta then Gamma in the rest');
  assert.doesNotMatch(out, /Shrinking/, 'an empty group is left out');
});
test('listHtml\'s rest is a collapsed details with the A to Z title and plain name buttons', () => {
  const out = C.listHtml('tech', h, W, B);
  assert.match(out, /<details class="country-rest"><summary>All other countries \(A to Z\)<\/summary>/);
  assert.doesNotMatch(out, /<details[^>]* open/);
  const rest = out.slice(out.indexOf('<details'));
  assert.match(rest, /<button class="country-btn" type="button" data-action="country" data-iso="4"><b>Delta<\/b><\/button>/);
  assert.doesNotMatch(rest, /pill/);
});
test('listHtml says so when a sector has no country notes, and still lists the countries', () => {
  const out = C.listHtml('public', h, W, B);
  assert.match(out, /No checked country notes for this sector yet/);
  assert.match(out, /All other countries \(A to Z\)/); assert.equal(out.match(/data-action="country"/g).length, 4);
});
test('listHtml has no undefined or NaN, escapes names and notes, and omits the rest list when there are no other countries', () => {
  const world = [{ id: 'x', place: 'X', country: 'X<y>', iso: 8, scope: 'country', ind: { tech: ['grow', 'Note <b>bold</b>', []] } }];
  const out = C.listHtml('tech', h, world, { 8: { name: 'X<y>' } });
  assert.match(out, /X&lt;y&gt;/); assert.match(out, /Note &lt;b&gt;bold&lt;\/b&gt;/);
  assert.doesNotMatch(out, /<y>|<b>bold|undefined|NaN|<details/);
});
test('listHtml of an empty byIso is a plain message, not empty markup', () => {
  const out = C.listHtml('tech', h, W, {});
  assert.doesNotMatch(out, /undefined|<details|<button/);
});
