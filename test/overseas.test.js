'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-overseas.js']);
const P = w.SerasiPathways, O = w.SerasiOverseas;

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
test('every option uses a currency with a rate', () => {
  const opts = [];
  for (const f of Object.values(O.OPTIONS)) { if (f.best) opts.push(f.best); opts.push(...(f.alts || [])); }
  for (const o of opts) assert.ok(P.FX[o.cur] > 0, o.school + ' ' + o.cur);
});
test('there is a rate for every currency the plan names', () => {
  for (const cur of ['AUD', 'GBP', 'EUR', 'JPY', 'MYR', 'CHF', 'DKK', 'SEK', 'NOK', 'CAD', 'USD', 'NZD', 'KRW', 'CNY', 'HKD', 'AED', 'EGP', 'TRY', 'SAR'])
    assert.ok(P.FX[cur] > 0, cur);
});
test('exchange rates are dated this year', () => assert.match(P.FX_ASOF, /2026/));
test('the exchange-rate sources are in SOURCES with a label and an https link', () => {
  for (const k of ['fx-ecb', 'fx-egp']) { assert.ok(P.SOURCES[k], k); assert.match(P.SOURCES[k][0], /2026/); assert.match(P.SOURCES[k][1], /^https:\/\//); }
});
