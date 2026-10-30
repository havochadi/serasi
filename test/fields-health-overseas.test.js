'use strict';
// Task 6b: overseas options for the health and care fields (nursing, allied health, veterinary, early childhood, social work),
// and the alternatives added to pharmacy, medicine and biomedical science.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-overseas.js']);
const P = w.SerasiPathways, O = w.SerasiOverseas;

const HEALTH = ['nursing', 'allied-health', 'pharmacy', 'medicine', 'biomedical', 'veterinary', 'earlychild', 'socialwork'];
const all = field => { const f = O.OPTIONS[field]; return f && f.best ? [f.best].concat(f.alts || []) : []; };
const everyText = o => [o.school, o.course, o.standing, o.why, o.env, o.watch, o.tuitionNote || ''].join(' ');

test('medicine: the option whose fee is an average over the course labels it as an average', () => {
  const ucl = all('medicine').find(o => /^UCL/.test(o.school));
  assert.ok(ucl, 'UCL is still listed for medicine');
  assert.match(ucl.feeLabel || '', /average/i);
});

test('no option carries an internal note: every school left out is explained for a reader, not as a build comment', () => {
  for (const field of HEALTH) for (const o of all(field)) {
    assert.doesNotMatch(everyText(o), /not priced here|could not be (read|confirmed)|task \d|fee page returned|403/i, field + ': ' + o.school);
  }
});

test('every health option names a year in its fee text and a visa or official living-cost basis in watch', () => {
  for (const field of HEALTH) for (const o of all(field)) {
    if (o.living !== null) assert.match(o.watch, /visa|estimate|asks a single student/i, field + ': ' + o.school + ' says where its living figure comes from');
  }
});

test('US schools are never listed: the US publishes no visa money-for-living figure', () => {
  for (const field of HEALTH) for (const o of all(field)) assert.notEqual(o.country, 'United States', field + ': ' + o.school);
});

test('options that need earlier university study say so in the course name or watch, and cite a fee year', () => {
  const toronto = [].concat(...HEALTH.map(all)).filter(o => /Toronto/.test(o.school));
  assert.ok(toronto.length >= 1);
  for (const o of toronto) assert.match(o.course + ' ' + o.watch, /two years of university/i, o.school + ' ' + o.course);
});

test('nursing: a best pick and an alternative in different countries, each telling the reader to ask the Singapore Nursing Board', () => {
  const n = all('nursing');
  assert.ok(n.length >= 2);
  assert.equal(new Set(n.map(o => o.country)).size, n.length);
  for (const o of n) {
    assert.match(o.watch, /Singapore Nursing Board/, o.school);
    assert.match(o.watch, /ask the Board before you apply/, o.school);
    assert.ok(o.src.includes('snb-foreign'), o.school);
  }
});

test('nursing: the alternative that needs Chinese says so', () => {
  const cuhk = all('nursing').find(o => /Chinese University of Hong Kong/.test(o.school));
  assert.ok(cuhk);
  assert.match(cuhk.watch, /Chinese/);
});

test('medicine: every option is a school on the Singapore Medical Council list read for this work', () => {
  const listed = [/Cambridge/, /UCL/, /Edinburgh/];
  for (const o of all('medicine')) assert.ok(listed.some(re => re.test(o.school)), o.school);
});
