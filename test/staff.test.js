'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');
const w = load(['serasi-core.js', 'serasi-staff.js']), S = w.SerasiStaff;
const now = new Date(2026, 9, 31), demo = S.demoRecords(now);
const row = over => ({ month: '2026-10', age: '18-20', path: 'ITE', area: 'west', top2: ['I', 'A'], values: ['learning'], skillsLow: ['tech'], topJobs: ['data-sci'], tasters: true, ...over });

test('sample cohort is deterministic and uses the recent six months, including year boundaries', () => {
  assert.equal(demo.length, 240);
  assert.deepEqual(plain(S.demoRecords(now)), plain(demo));
  assert.deepEqual(plain(S.months(now)), ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
  assert.deepEqual(plain(S.months(new Date(2027, 0, 15), 3)), ['2026-11', '2026-12', '2027-01']);
  for (const r of demo) {
    assert.ok(S.months(now).includes(r.month));
    assert.equal(new Set(r.topJobs).size, r.topJobs.length);
    assert.equal(r.top2.length, 2);
  }
});
test('cohort filters intersect interests, skills, demographics and taster interest', () => {
  const sample = [row(), row({ age: '21-23' }), row({ skillsLow: [] }), row({ tasters: false })];
  const out = S.filterRows(sample, { age: '18-20', interest: 'A', skill: 'tech', path: 'ITE', area: 'west', tasters: 'yes' }, now);
  assert.equal(out.length, 1);
  assert.equal(S.filterRows(sample, { interest: 'S' }, now).length, 0);
});
test('previous period is the preceding window, with no overlap or future records', () => {
  const sample = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11'].map(month => row({ month }));
  assert.deepEqual(plain(S.filterRows(sample, { period: '3' }, now).map(r => r.month)), ['2026-08', '2026-09', '2026-10']);
  assert.deepEqual(plain(S.filterRows(sample, { period: '3' }, now, true).map(r => r.month)), ['2026-05', '2026-06', '2026-07']);
  assert.equal(S.filterRows(sample, {}, now).length, 7);
});
test('aggregates count each youth once per category, including sectors and duplicated shared values', () => {
  const a = S.aggregate([row({ values: ['learning', 'learning'], skillsLow: ['tech', 'tech'], topJobs: ['data-sci', 'data-sci', 'data-analyst'] })]);
  assert.equal(a.n, 1); assert.equal(a.values.learning, 1); assert.equal(a.skills.tech, 1); assert.equal(a.jobs['data-sci'], 1);
  assert.equal(a.sectors[w.SerasiCore.ROLE['data-sci'].sector], 1);
});
test('small cohorts cannot generate reports, CSV exports or programme suggestions', () => {
  for (const count of [0, 1, 9]) {
    const sample = Array.from({ length: count }, () => row());
    assert.equal(S.report(sample, {}, 'Shared in this browser', now), null);
    assert.equal(S.csvRows(sample, {}, 'Shared in this browser'), null);
    assert.equal(S.suggestions(sample).length, 0);
  }
  assert.ok(S.report(Array.from({ length: 10 }, () => row()), {}, 'Sample cohort', now));
});
test('small subgroup metrics are withheld even within a reportable cohort', () => {
  const groups = S.groupRows([...Array.from({ length: 12 }, () => row()), row({ area: 'east' })], 'area');
  const west = groups.find(g => g.k === 'west'), east = groups.find(g => g.k === 'east');
  assert.equal(west.hidden, false); assert.equal(west.a.n, 12);
  assert.equal(east.hidden, true); assert.equal(east.a, null);
});
test('programme audiences use expressed taster interest or the selected skill', () => {
  const sample = [row(), row({ tasters: false }), row({ top2: ['R', 'C'], skillsLow: [] })];
  assert.equal(S.audience(sample, { kind: 'taster', interest: 'I' }), 1);
  assert.equal(S.audience(sample, { kind: 'mentoring', interest: 'I' }), 2);
  assert.equal(S.audience(sample, { kind: 'workshop', skill: 'tech' }), 2);
});
test('programme suggestions respect the audience reporting threshold', () => {
  for (const p of S.suggestions(demo)) {
    assert.ok(p.demand >= 10);
    assert.equal(p.demand, S.audience(demo, p));
  }
});
test('exports identify the selected source and cohort without individual records', () => {
  const filtered = S.filterRows(demo, { area: 'west' }, now);
  const report = S.report(filtered, { area: 'west' }, 'Sample cohort', now);
  assert.match(report, /Data: Sample cohort/); assert.match(report, /West/);
  const csv = S.toCSV(S.csvRows(filtered, { area: 'west' }, 'Sample cohort'));
  assert.match(csv, /Data source,Sample cohort/);
  assert.doesNotMatch(csv, /S001|\bcode\b|18-20/);
});
test('CSV quoting preserves line breaks and prevents formula execution', () => {
  const csv = S.toCSV([['a,b', 'quote"here', 'line\nbreak', '=2+2', '@SUM(A1)', '-1']]);
  assert.match(csv, /"a,b"/); assert.match(csv, /"quote""here"/); assert.match(csv, /"line\nbreak"/);
  assert.match(csv, /'=2\+2/); assert.match(csv, /'@SUM/); assert.match(csv, /'-1/);
});
test('saved drafts retain only editable fields and a valid aggregate cohort snapshot', () => {
  const p = S.normalisePlan({ title: '  Workshop  ', kind: 'bad', capacity: 9999, status: 'confirmed', source: 'bad', filters: { area: 'west', skill: 'invalid', unknown: 'secret' }, answers: { secret: 'private' }, email: 'private@example.com', cohortSize: 240, demand: 20 });
  assert.equal(p.title, 'Workshop'); assert.equal(p.kind, 'taster'); assert.equal(p.capacity, 200); assert.equal(p.status, 'draft'); assert.equal(p.source, 'sample');
  assert.equal(p.filters.area, 'west'); assert.equal(p.filters.skill, 'all'); assert.equal(p.filters.unknown, undefined);
  assert.equal(p.answers, undefined); assert.equal(p.email, undefined);
  assert.equal(S.normalisePlan({ title: '   ' }), null);
});
test('draft storage handles invalid data and failed writes', () => {
  const memory = new Map(), storage = { getItem: k => memory.get(k), setItem: (k, v) => memory.set(k, v) };
  assert.equal(S.writePlans(storage, [{ title: 'A programme', id: 'p-1' }]), true);
  assert.equal(S.readPlans(storage)[0].title, 'A programme');
  memory.set(S.PLAN_KEY, '{broken'); assert.deepEqual(plain(S.readPlans(storage)), []);
  memory.set(S.PLAN_KEY, '{}'); assert.deepEqual(plain(S.readPlans(storage)), []);
  assert.equal(S.writePlans({ setItem() { throw new Error('Full'); } }, []), false);
  assert.deepEqual(plain(S.readPlans(null)), []);
});
