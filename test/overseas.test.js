'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-overseas.js']);
const P = w.SerasiPathways, O = w.SerasiOverseas;
const { ROLE, esc } = w.SerasiCore;

// Countries in Europe, for the architecture best pick.
const EUROPE = ['Austria', 'Belgium', 'Denmark', 'Finland', 'France', 'Germany', 'Ireland', 'Italy', 'Netherlands', 'Norway', 'Portugal', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom'];
// Stand-ins for the page's helpers: the same markup shape, built from the shared SOURCES.
const srcLinks = keys => {
  const list = [...new Set(keys || [])].filter(k => P.SOURCES[k]);
  return list.length ? '<p class="src">Sources: ' + list.map(k => '<a href="' + esc(P.SOURCES[k][1]) + '">' + esc(P.SOURCES[k][0]) + '</a>').join(' · ') + '</p>' : '';
};
const h = { esc, srcLinks };
// A made-up option and field for the html tests that should not depend on the real data.
const opt = (over = {}) => ({ country: 'Switzerland', school: 'Test School', course: 'BSc Test', yrs: 4, tuition: [1000, 2000], cur: 'CHF', living: 20000,
  standing: 'Ranked 1st (QS World University Rankings by Subject 2026)', why: 'Why it is good.', env: 'German-taught.', watch: 'Check recognition.',
  url: 'https://example.org/school', src: ['fx-ecb'], links: ['daad'], ...over });

test('costOf sums tuition, living and one-off fees in S$', () =>
  assert.deepEqual(plain(O.costOf({ yrs: 4, tuition: [1000, 2000], cur: 'CHF', living: 20000, once: 500 }, { CHF: 1.5 }).totalSgd), [126800, 132800]));
test('costOf rounds each figure to the nearest $100', () =>
  assert.deepEqual(plain(O.costOf({ yrs: 4, tuition: [1000, 2000], cur: 'CHF', living: 20000, once: 500 }, { CHF: 1.5 })),
    { tuitionSgd: [1500, 3000], livingSgd: 30000, totalSgd: [126800, 132800] }));
test('costOf leaves living costs null when they are not known', () => {
  const c = O.costOf({ yrs: 3, tuition: [10000, 12000], cur: 'EUR', living: null }, { EUR: 1.5 });
  assert.equal(c.livingSgd, null);
  assert.deepEqual(plain(c.totalSgd), [45000, 54000]);
});
test('costOf uses the shared exchange rates when none are passed', () => {
  const r100 = n => Math.round(n / 100) * 100;
  assert.deepEqual(plain(O.costOf({ yrs: 1, tuition: [1000, 1000], cur: 'USD', living: null }).tuitionSgd), [r100(1000 * P.FX.USD), r100(1000 * P.FX.USD)]);
});
test('costText wording', () => assert.deepEqual(plain(O.costText({ yrs: 4, tuition: [1000, 2000], cur: 'CHF', living: 20000 }, { CHF: 1.5 })),
  { fees: 'Tuition CHF 1,000–2,000 a year (about $1,500–3,000)', living: 'Living costs CHF 20,000 a year (about $30,000)', total: 'Roughly $126,000–132,000 for 4 years, including living costs' }));
test('zero tuition and equal bounds', () => {
  const t = O.costText({ yrs: 3, tuition: [0, 0], cur: 'EUR', living: 12000 }, { EUR: 1.5 });
  assert.match(t.fees, /^No tuition fees/); assert.doesNotMatch(t.total, /–/);
});
test('equal tuition bounds print one figure', () => {
  const t = O.costText({ yrs: 1, tuition: [5000, 5000], cur: 'CHF', living: null }, { CHF: 1.5 });
  assert.equal(t.fees, 'Tuition CHF 5,000 a year (about $7,500)');
});
test('a feeLabel replaces the word Tuition, and zero fees then read as no such fees', () => {
  assert.match(O.costText({ yrs: 3.5, tuition: [200, 700], feeLabel: 'Semester fees', cur: 'EUR', living: 11904 }, { EUR: 1.5 }).fees, /^Semester fees €200–700 a year /);
  assert.equal(O.costText({ yrs: 3, tuition: [0, 0], feeLabel: 'Semester fees', cur: 'EUR', living: null }, { EUR: 1.5 }).fees, 'No semester fees');
});
test('one-off fees are added to the total and named in the fees line', () => {
  const t = O.costText({ yrs: 4, tuition: [535800, 535800], once: 282000, cur: 'JPY', living: null }, { JPY: .01 });
  assert.equal(t.fees, 'Tuition ¥535,800 a year plus ¥282,000 once (about $5,400)');
  assert.equal(t.total, 'Roughly $24,300 for 4 years, before living costs');
});
test('no living figure gives an empty living line and a total before living costs', () => {
  const t = O.costText({ yrs: 1, tuition: [1000, 2000], cur: 'CHF', living: null }, { CHF: 1.5 });
  assert.equal(t.living, ''); assert.match(t.total, /^Roughly \$1,500–3,000 for 1 year, before living costs$/);
});
test('years read as 1 year, 4 years and 3½ years', () => {
  const total = yrs => O.costText({ yrs, tuition: [0, 0], cur: 'EUR', living: 1000 }, { EUR: 1 }).total;
  assert.match(total(1), / for 1 year,/); assert.match(total(4), / for 4 years,/); assert.match(total(3.5), / for 3½ years,/);
});
test('currency symbols for the common currencies, the code for the rest', () => {
  const fees = (cur, n) => O.costText({ yrs: 1, tuition: [n, n], cur, living: null }, { [cur]: 1 }).fees;
  assert.match(fees('AUD', 1000), /^Tuition A\$1,000 /); assert.match(fees('GBP', 1000), /^Tuition £1,000 /);
  assert.match(fees('EUR', 1000), /^Tuition €1,000 /); assert.match(fees('MYR', 1000), /^Tuition RM1,000 /);
  assert.match(fees('USD', 1000), /^Tuition USD 1,000 /); assert.match(fees('KRW', 1000), /^Tuition KRW 1,000 /);
});
test('a missing exchange rate fails loudly', () => assert.throws(() => O.costOf({ yrs: 1, tuition: [1, 1], cur: 'XXX', living: null }, {}), /No exchange rate for XXX/));
test('a missing exchange rate fails loudly in costText too, never as NaN', () => assert.throws(() => O.costText({ yrs: 1, tuition: [1, 1], cur: 'XXX', living: null }, {}), /No exchange rate for XXX/));
// Every best pick and alternative in OPTIONS, as [field, option].
const allOptions = () => Object.entries(O.OPTIONS).flatMap(([k, f]) => (f.best ? [f.best] : []).concat(f.alts || []).map(o => [k, o]));
test('every option uses a currency with a rate', () => {
  const opts = allOptions();
  assert.ok(opts.length > 0, 'OPTIONS has study options');
  for (const [, o] of opts) assert.ok(P.FX[o.cur] > 0, o.school + ' ' + o.cur);
});
test('every option has what the card needs, names its QS edition, and its sources and contacts exist', () => {
  for (const [k, o] of allOptions()) {
    const id = k + ': ' + o.school;
    for (const f of ['country', 'school', 'course', 'standing', 'why', 'env', 'watch']) assert.ok(typeof o[f] === 'string' && o[f].length > 0, id + ': ' + f);
    assert.ok(o.yrs > 0, id + ': yrs');
    assert.ok(Array.isArray(o.tuition) && o.tuition.length === 2 && o.tuition[0] >= 0 && o.tuition[0] <= o.tuition[1], id + ': tuition');
    assert.ok(o.living === null || o.living > 0, id + ': living');
    if (o.tuition[0] !== o.tuition[1]) assert.ok(typeof o.tuitionNote === 'string' && o.tuitionNote.length > 0, id + ': a tuition range says what its ends are');
    assert.match(o.standing, /QS World University Rankings by Subject 20\d\d/, id + ': standing names the edition');
    assert.match(o.url, /^https:\/\//, id + ': url');
    assert.ok(o.src.length > 0, id + ': src');
    for (const s of o.src) assert.ok(P.SOURCES[s] && /^https:\/\//.test(P.SOURCES[s][1]), id + ': source ' + s);
    for (const c of o.links || []) assert.ok(P.CONTACTS[c], id + ': contact ' + c);
  }
});
test('every agency note is plain text of a sentence or two, with its sources in SOURCES', () => {
  for (const [k, f] of Object.entries(O.OPTIONS)) if (f.agency !== undefined) {
    assert.equal(typeof f.agency, 'string', k); assert.ok(f.agency.length > 40, k); assert.equal(f.best, undefined, k);
    assert.ok(Array.isArray(f.src) && f.src.length > 0, k + ': src');
    for (const s of f.src) assert.ok(P.SOURCES[s] && /^https:\/\//.test(P.SOURCES[s][1]), k + ': source ' + s);
  }
});

test('architecture: best overseas place is in Europe, with alternatives', () => {
  const r = O.forRole(ROLE.arch);
  assert.ok(EUROPE.includes(r.best.country)); assert.ok(r.alts.length >= 2 && r.alts.length <= 4);
});
test('architecture: every option is in a different country and carries the Board of Architects warning', () => {
  const r = O.forRole(ROLE.arch), all = [r.best].concat(r.alts);
  assert.equal(new Set(all.map(o => o.country)).size, all.length);
  for (const o of all) assert.match(o.watch, /Board of Architects/, o.school);
});
test('html: best card first, then runners-up, costs in S$', () => {
  const html = O.html(ROLE.arch, h);
  assert.match(html, /Best place to study this/); assert.ok(html.indexOf('Best place') < html.indexOf('Also worth a look'));
  assert.match(html, /about \$[\d,]+/); assert.doesNotMatch(html, /undefined|NaN|null/);
});
test('html is empty for a role with no overseas study', () => assert.equal(O.html(ROLE.electrician, h), ''));
test('agency roles get a note instead of options', () => assert.match(O.html(ROLE.teacher, h), /MOE|NIE/));

test('forRole is null below edu 2, for an ite field, and for a study field with no options yet', () => {
  assert.equal(O.forRole(ROLE.electrician), null);
  assert.equal(O.forRole({ id: 'made-up', trk: 'trades', edu: 2 }), null);
  assert.equal(O.forRole(ROLE.arch, {}), null);
  assert.equal(O.html(ROLE.arch, h, {}), '');
});
test('forRole gives the field with its best pick and alternatives, or the agency note', () => {
  const r = O.forRole(ROLE.arch, { architecture: { best: opt(), alts: [opt({ country: 'Italy' })] } });
  assert.equal(r.field, 'architecture'); assert.equal(r.best.school, 'Test School'); assert.equal(r.alts.length, 1);
  assert.deepEqual(plain(O.forRole(ROLE.teacher, { teaching: { agency: 'Train with MOE.', src: ['moe-diped'] } })), { field: 'teaching', agency: 'Train with MOE.', src: ['moe-diped'] });
  assert.deepEqual(plain(O.forRole(ROLE.teacher, { teaching: { agency: 'Train with MOE.' } })).src, []);
});
test('html: the card has the course and years, standing, why, environment, the three cost lines, the watch-out, the school link and sources', () => {
  const out = O.html(ROLE.arch, h, { architecture: { best: opt(), alts: [] } });
  assert.match(out, /Switzerland · Test School/); assert.match(out, /BSc Test · 4 years/);
  assert.match(out, /Ranked 1st/); assert.match(out, /Why it is good\./); assert.match(out, /Environment:<\/b> German-taught\./);
  assert.match(out, /Tuition CHF 1,000–2,000 a year/); assert.match(out, /Living costs CHF 20,000 a year/); assert.match(out, /for 4 years, including living costs/);
  assert.match(out, /Watch out: Check recognition\./);
  assert.match(out, /<a href="https:\/\/example\.org\/school" target="_blank" rel="noopener">/);
  assert.match(out, /Sources: /);
});
test('html: no alternatives means no "Also worth a look" heading', () =>
  assert.doesNotMatch(O.html(ROLE.arch, h, { architecture: { best: opt(), alts: [] } }), /Also worth a look/));
test('html: each runner-up shows country, school, years, total in S$ and a link', () => {
  const out = O.html(ROLE.arch, h, { architecture: { best: opt(), alts: [opt({ country: 'Italy', school: 'Other School', yrs: 5, url: 'https://example.org/other' })] } });
  const alt = out.slice(out.indexOf('Also worth a look'));
  assert.match(alt, /Italy<\/b> · Other School/); assert.match(alt, /5 years · about \$[\d,]+–[\d,]+ in total/);
  assert.match(alt, /href="https:\/\/example\.org\/other"/); assert.match(alt, /Watch out: Check recognition\./);
});
test('html: an option with no living figure says the total is before living costs and prints no empty line', () => {
  const out = O.html(ROLE.arch, h, { architecture: { best: opt({ living: null }), alts: [opt({ country: 'Italy', living: null })] } });
  assert.match(out, /before living costs/); assert.doesNotMatch(out, /Living costs|<li><\/li>|null/);
});
test('html: the footnote dates the exchange rates and says Singapore subsidies do not apply', () => {
  const out = O.html(ROLE.arch, h, { architecture: { best: opt(), alts: [] } });
  assert.ok(out.includes('Costs use rough exchange rates as of ' + P.FX_ASOF + '.'));
  assert.ok(out.includes(esc("Singapore's Tuition Grant, TTFS and bursaries don't apply overseas.")));
});
test('html escapes every string, including links', () => {
  const bad = '<img src=x onerror=alert(1)>';
  const out = O.html(ROLE.arch, h, { architecture: { best: opt({ school: bad, why: bad, url: 'https://example.org/?a="b"&c=<d>' }), alts: [opt({ country: 'Italy', school: bad })] } });
  assert.doesNotMatch(out, /<img/); assert.match(out, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(out, /href="https:\/\/example\.org\/\?a=&quot;b&quot;&amp;c=&lt;d&gt;"/);
});
test('html: an agency note has the overseas heading, its sources and no study card', () => {
  const out = O.html(ROLE.teacher, h, { teaching: { agency: 'Train with <MOE>.', src: ['moe-diped'] } });
  assert.match(out, /<h4>Or study overseas<\/h4>/); assert.match(out, /Train with &lt;MOE&gt;\./); assert.doesNotMatch(out, /Best place/);
  assert.ok(out.includes(esc(P.SOURCES['moe-diped'][0])));
});

// The runner-up rows: the alternative's cost line, from the made-up option. alt() is the "Also worth a look" part of the html.
const alt = o => { const out = O.html(ROLE.arch, h, { architecture: { best: opt(), alts: [o] } }); return out.slice(out.indexOf('Also worth a look')); };
test('html: a runner-up with no tuition says so beside a single total', () => {
  const a = alt(opt({ country: 'Germany', tuition: [0, 0], cur: 'EUR', living: 12000, yrs: 3 }));
  assert.match(a, /3 years · No tuition fees · about \$[\d,]+ in total/); assert.doesNotMatch(a, /about \$[\d,]+–/);
  assert.doesNotMatch(a, /NaN|undefined|null/);
});
test('html: a runner-up with equal tuition bounds prints one total, not a range', () => {
  const a = alt(opt({ country: 'Italy', tuition: [5000, 5000] }));
  assert.match(a, /4 years · about \$[\d,]+ in total/); assert.doesNotMatch(a, /about \$[\d,]+–/); assert.doesNotMatch(a, /No tuition fees/);
});
test('html: a runner-up whose currency has no exchange rate fails loudly, never as NaN', () =>
  assert.throws(() => alt(opt({ country: 'Italy', cur: 'XXX' })), /No exchange rate for XXX/));
test('html: a tuition note explains a range on the runner-up row and on the card', () => {
  const note = 'low end uses the bachelor’s fee, high end the master’s';
  const out = O.html(ROLE.arch, h, { architecture: { best: opt({ tuitionNote: note }), alts: [opt({ country: 'Italy', tuitionNote: note })] } });
  const a = out.slice(out.indexOf('Also worth a look'));
  assert.ok(a.includes('in total (' + esc(note) + ')'));
  assert.ok(out.slice(0, out.indexOf('Also worth a look')).includes(esc(O.costText(opt()).fees + '; ' + note)));
});
test('there is a rate for every currency the plan names', () => {
  for (const cur of ['AUD', 'GBP', 'EUR', 'JPY', 'MYR', 'CHF', 'DKK', 'SEK', 'NOK', 'CAD', 'USD', 'NZD', 'KRW', 'CNY', 'HKD', 'AED', 'EGP', 'TRY', 'SAR'])
    assert.ok(P.FX[cur] > 0, cur);
});
test('exchange rates are dated this year', () => assert.match(P.FX_ASOF, /2026/));
test('the exchange-rate sources are in SOURCES with a label and an https link', () => {
  for (const k of ['fx-ecb', 'fx-egp']) { assert.ok(P.SOURCES[k], k); assert.match(P.SOURCES[k][0], /2026/); assert.match(P.SOURCES[k][1], /^https:\/\//); }
});
