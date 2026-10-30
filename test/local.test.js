'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-local.js']);
const L = w.SerasiLocal, P = w.SerasiPathways;
const { ROLE, esc } = w.SerasiCore;
const { FIELDS } = w.SerasiStudy;
const h = { esc, money: n => '$' + Math.round(n).toLocaleString('en-SG') };

const course = (over = {}) => ({ school: 'Ngee Ann Polytechnic', course: 'Diploma in Data Science', lvl: 2, yrs: 3, fee: 3180, fields: ['data-ai'], url: 'https://example.sg/c', ...over });

test('SCHOOLS lists the publicly funded institutions in order', () => assert.deepEqual(plain(L.SCHOOLS), [
  'ITE', 'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic',
  'NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'LASALLE', 'NAFA', 'University of the Arts Singapore', 'Duke-NUS', 'NIE']));

test('spread gives the lowest and highest fee and whether any is far from the generic fee', () =>
  assert.deepEqual(plain(L.spread([{ fee: 3180 }, { fee: 3600 }], 3180)), { lo: 3180, hi: 3600, differs: true }));
test('spread ignores null fees', () =>
  assert.deepEqual(plain(L.spread([{ fee: 3180 }, { fee: null }], 3180)), { lo: 3180, hi: 3180, differs: false }));
test('spread of an empty list is null', () => assert.equal(L.spread([], 3180), null));
test('spread is null when no course has a fee', () => assert.equal(L.spread([{ fee: null }], 3180), null));
test('differs only when a fee is more than $300 from the generic fee, in either direction', () => {
  assert.equal(L.spread([{ fee: 3480 }], 3180).differs, false);
  assert.equal(L.spread([{ fee: 3481 }], 3180).differs, true);
  assert.equal(L.spread([{ fee: 2880 }], 3180).differs, false);
  assert.equal(L.spread([{ fee: 2879 }], 3180).differs, true);
});

test('forRole keeps only courses for the role\'s field, at the level, and for the role when roles is given', () => {
  const list = [
    course({ course: 'keep' }),
    course({ course: 'wrong level', lvl: 3 }),
    course({ course: 'wrong field', fields: ['computing'] }),
    course({ course: 'several fields', fields: ['computing', 'data-ai'] }),
    course({ course: 'this role only', roles: ['data-sci', 'ai-eng'] }),
    course({ course: 'other roles only', roles: ['data-analyst'] })
  ];
  assert.deepEqual(L.forRole(ROLE['data-sci'], 2, list).map(c => c.course), ['keep', 'several fields', 'this role only']);
  assert.deepEqual(L.forRole(ROLE['data-analyst'], 2, list).map(c => c.course), ['keep', 'several fields', 'other roles only']);
});
test('forRole orders by SCHOOLS and keeps the given order within a school', () => {
  const list = [
    course({ school: 'NUS', course: 'b' }), course({ school: 'ITE', course: 'a' }),
    course({ school: 'NUS', course: 'c' }), course({ school: 'Nanyang Polytechnic', course: 'd' })
  ];
  assert.deepEqual(L.forRole(ROLE['data-sci'], 2, list).map(c => c.course), ['a', 'd', 'b', 'c']);
});
test('forRole returns nothing for an empty list', () => assert.deepEqual(plain(L.forRole(ROLE['data-sci'], 2, [])), []));

test('html is an empty string when no course matches (Review Focus 1)', () => {
  assert.equal(L.html(ROLE['data-sci'], 2, h, []), '');
  assert.equal(L.html(ROLE['data-sci'], 3, h, [course()]), '');
  assert.equal(L.html(ROLE.arch, 2, h, [course()]), '');
});
test('html uses COURSES by default', () => assert.equal(L.html(ROLE['data-sci'], 2, h), L.html(ROLE['data-sci'], 2, h, L.COURSES)));
test('html lists each course with school, course, years, fee, link and the fee note', () => {
  const out = L.html(ROLE['data-sci'], 2, h, [course(), course({ school: 'NUS', course: 'BSc Data Science', lvl: 2, yrs: 3.5, fee: 8250, url: 'https://example.sg/d' })]);
  assert.match(out, /^<ul class="schools">/);
  assert.equal(out.match(/<li>/g).length, 2);
  assert.match(out, /Ngee Ann Polytechnic/); assert.match(out, /Diploma in Data Science/);
  assert.match(out, /3 years/); assert.match(out, /\$3,180 a year/);
  assert.match(out, /3½ years/); assert.match(out, /\$8,250 a year/);
  assert.match(out, /<a href="https:\/\/example\.sg\/c" target="_blank" rel="noopener">course page ↗<\/a>/);
  assert.match(out, /Yearly fees are for Singapore Citizens after the MOE Tuition Grant, from each school's fee page in October 2026 \(sources under the price breakdown\)\. The links go to the course pages\./);
});
test('html says 1 year for a one-year course', () => assert.match(L.html(ROLE['data-sci'], 2, h, [course({ yrs: 1 })]), /1 year[^s]/));
test('a course with no fee points to the school page, with no null or undefined', () => {
  const out = L.html(ROLE['data-sci'], 2, h, [course({ fee: null })]);
  assert.match(out, /fee on the school's page/);
  assert.doesNotMatch(out, /null|undefined|NaN|a year/);
});
test('html tags part-time and work-study courses and no others', () => {
  const tag = mode => L.html(ROLE['data-sci'], 2, h, [course({ mode })]);
  assert.match(tag('part-time'), /part-time/); assert.match(tag('work-study'), /work-study/);
  assert.doesNotMatch(tag(undefined), /part-time|work-study/);
});
test('html escapes every string, including the link', () => {
  const out = L.html(ROLE['data-sci'], 2, h, [course({ school: 'NUS', course: '<img src=x onerror=alert(1)>', url: 'https://example.sg/?a="b"&c=<d>' })]);
  assert.doesNotMatch(out, /<img/); assert.match(out, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(out, /href="https:\/\/example\.sg\/\?a=&quot;b&quot;&amp;c=&lt;d&gt;"/);
});

test('every course has a listed school, an https link, positive years, a fee or null, and known fields', () => {
  assert.ok(L.COURSES.length > 0, 'COURSES has data');
  for (const c of L.COURSES) {
    const id = c.school + ' ' + c.course;
    assert.ok(L.SCHOOLS.includes(c.school), id + ': school');
    assert.match(c.url, /^https:\/\//, id + ': url');
    assert.ok(c.yrs > 0, id + ': yrs');
    assert.ok([1, 2, 3].includes(c.lvl), id + ': lvl');
    assert.ok(c.fee === null || c.fee > 0, id + ': fee');
    assert.ok(c.fields.length > 0, id + ': fields');
    for (const f of c.fields) assert.ok(FIELDS[f], id + ': field ' + f);
  }
});
test('every course with a fee names its fee source, and each source is in SOURCES with an https link', () => {
  for (const c of L.COURSES) {
    const id = c.school + ' ' + c.course;
    if (c.fee != null) assert.ok((c.src || []).length > 0, id + ': fee source');
    for (const k of c.src || []) { assert.ok(P.SOURCES[k], id + ': ' + k); assert.match(P.SOURCES[k][1], /^https:\/\//, k); }
  }
});

test('architecture: local schools', () => {
  assert.ok(L.forRole(ROLE.arch, 3).map(c => c.school).includes('NUS'));
  assert.ok(L.forRole(ROLE.arch, 3).map(c => c.school).includes('SUTD'));
  assert.ok(L.forRole(ROLE.arch, 2).length >= 1);
});

const schoolsFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.school));
const names = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.course));

test('nursing: ITE courses are at level 1 and the diplomas at level 2', () => {
  assert.deepEqual(schoolsFor('enrolled-nurse', 1), ['ITE', 'ITE']);
  assert.ok(L.forRole(ROLE['enrolled-nurse'], 1).every(c => /Higher Nitec in Nursing/.test(c.course)));
  assert.deepEqual(schoolsFor('nurse', 2), ['Ngee Ann Polytechnic', 'Nanyang Polytechnic']);
});
test('early childhood: the ITE course is at level 1 and the diplomas at level 2', () => {
  assert.deepEqual(schoolsFor('preschool', 1), ['ITE']);
  assert.deepEqual(schoolsFor('early-int', 2), ['Ngee Ann Polytechnic', 'Temasek Polytechnic']);
});
test('medicine: NUS, NTU and Duke-NUS are listed at level 3, and Duke-NUS says its fee is not on a page we could read', () => {
  assert.deepEqual(schoolsFor('doctor', 3), ['NUS', 'NTU', 'Duke-NUS']);
  assert.equal(L.forRole(ROLE.doctor, 3).find(c => c.school === 'Duke-NUS').fee, null);
});
test('allied health: each degree is listed only for its own role, and oral health therapy for its diploma', () => {
  assert.deepEqual(names('physio', 3), ['Bachelor of Science with Honours in Physiotherapy']);
  assert.deepEqual(names('ot', 3), ['Bachelor of Science with Honours in Occupational Therapy']);
  assert.deepEqual(names('radiographer', 3), ['Bachelor of Science with Honours in Diagnostic Radiography']);
  assert.deepEqual(names('dietitian', 3), ['Bachelor of Science with Honours in Dietetics and Nutrition']);
  assert.deepEqual(schoolsFor('oral-health', 2), ['Nanyang Polytechnic']);
});
test('pharmacy: four polytechnic diplomas for the technician, and NUS for the pharmacist', () => {
  assert.deepEqual(schoolsFor('pharm-tech', 2), ['Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']);
  assert.deepEqual(schoolsFor('pharmacist', 3), ['NUS']);
});
test('biomedical and veterinary diplomas', () => {
  assert.deepEqual(schoolsFor('lab-tech', 2), ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic']);
  assert.deepEqual(schoolsFor('vet-tech', 2), ['Temasek Polytechnic']);
});
test('social work: the ITE course at level 1 and three diplomas for the youth worker at level 2', () => {
  assert.deepEqual(schoolsFor('community-care', 1), ['ITE']);
  assert.deepEqual(schoolsFor('youth-worker', 2), ['Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Temasek Polytechnic']);
});
test('a polytechnic fee that comes from the school is within reach of the generic fee table', () => {
  // LASALLE and NAFA also teach diplomas, at fees of their own (the design track note says so), so only the polytechnics are held to the table.
  for (const c of L.COURSES.filter(c => c.lvl === 2 && c.fee != null && /Polytechnic/.test(c.school))) assert.ok(Math.abs(c.fee - 3180) < 100, c.school + ' ' + c.course);
});

test('the allied health sponsorship contact no longer uses the old MOH Holdings host that failed its TLS handshake', () => {
  assert.doesNotMatch(P.CONTACTS.ahspon.url, /ahp\.mohh\.com\.sg/);
  assert.match(P.CONTACTS.ahspon.url, /^https:\/\/www\.healthcarescholarships\.sg\//);
});
