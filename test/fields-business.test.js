'use strict';
/* Task 9: the business, law and services fields. The schema tests in local.test.js and overseas.test.js already check every entry;
   these tests pin which schools and options each field has. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-local.js', 'serasi-overseas.js']);
const L = w.SerasiLocal, O = w.SerasiOverseas, P = w.SerasiPathways;
const { ROLE } = w.SerasiCore;

const schoolsFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.school));
const namesFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.course));

test('business: ITE has the customer experience, retail and business administration courses, each in a 2-year and a 3-year version', () => {
  for (const id of ['customer-service', 'retail', 'sales']) {
    const names = namesFor(id, 1);
    assert.equal(names.length, 6, id);
    for (const n of ['Business Administration', 'Customer Experience', 'Retail & Online Business'])
      assert.ok(names.includes('Higher Nitec in ' + n) && names.includes('Higher Nitec in ' + n + ' (3 years)'), id + ': ' + n);
    assert.ok(L.forRole(ROLE[id], 1).every(c => c.school === 'ITE' && c.fee === 566));
  }
});
test('business: every polytechnic has a business diploma for the business development executive', () =>
  assert.deepEqual([...new Set(schoolsFor('bizdev', 2))], ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']));
test('business: the HR diplomas are for the HR executive and the marketing diploma for marketing and e-commerce', () => {
  assert.deepEqual(namesFor('hr', 2).filter(n => /Human Resource/.test(n)), ['Diploma in Human Resource Management with Psychology', 'Diploma in Human Resource Management with Psychology']);
  assert.ok(!namesFor('bizdev', 2).some(n => /Human Resource/.test(n)));
  assert.ok(namesFor('marketing', 2).includes('Diploma in Marketing') && namesFor('ecommerce', 2).includes('Diploma in Marketing'));
  assert.ok(!namesFor('hr', 2).includes('Diploma in Marketing'));
});
test('business: the sustainability analyst gets the NUS, NTU and SMU business degrees, with the fees of those universities', () => {
  const list = plain(L.forRole(ROLE.sustainability, 3));
  assert.deepEqual(list.map(c => c.school), ['NUS', 'NTU', 'SMU']);
  assert.deepEqual(list.map(c => c.fee), [9700, 9500, 11550]);
});
test('SMU fees come from SMU\'s own leaflet', () => assert.match(P.SOURCES['fee-smu26'][1], /^https:\/\/admissions\.smu\.edu\.sg\/.*\.pdf$/));

test('accounting: four polytechnic diplomas, and the NUS, NTU, SMU, SIT and SUSS degrees for the auditor', () => {
  assert.deepEqual(schoolsFor('accounts-exec', 2), ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Temasek Polytechnic']);
  assert.deepEqual(schoolsFor('auditor', 3), ['NUS', 'NTU', 'SMU', 'SIT', 'SUSS']);
  assert.deepEqual(plain(L.forRole(ROLE.auditor, 3).map(c => c.fee)), [9700, 9500, 11550, null, null]);
});
test('finance-risk and islamicfin share the banking and finance diplomas, and the compliance and risk roles get the NUS and SMU business degrees', () => {
  assert.deepEqual(schoolsFor('bank-ops', 2), ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic']);
  assert.deepEqual(schoolsFor('islamic-banking', 2), ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic']);
  assert.deepEqual(schoolsFor('takaful', 2), schoolsFor('islamic-banking', 2));
  assert.deepEqual(schoolsFor('compliance', 3), ['NUS', 'SMU']);
  assert.deepEqual(schoolsFor('risk-analyst', 3), ['NUS', 'SMU']);
});
test('logistics: the ITE course at both lengths for the coordinator, two diplomas and three degrees for the supply chain analyst', () => {
  assert.deepEqual(plain(L.forRole(ROLE.logistics, 1).map(c => c.yrs)), [2, 3]);
  assert.deepEqual(schoolsFor('supply-chain', 2), ['Republic Polytechnic', 'Temasek Polytechnic']);
  assert.deepEqual(schoolsFor('supply-chain', 3), ['NUS', 'SIT', 'SUSS']);
});
test('law: Temasek for the legal executive, and the NUS, SMU and SUSS LLBs with the SUSS one part-time and priced by the credit', () => {
  assert.deepEqual(schoolsFor('paralegal', 2), ['Temasek Polytechnic']);
  const llb = L.forRole(ROLE.lawyer, 3);
  assert.deepEqual(plain(llb.map(c => c.school)), ['NUS', 'SMU', 'SUSS']);
  assert.deepEqual(plain(llb.map(c => c.fee)), [12750, 12750, null]);
  assert.equal(llb[2].mode, 'part-time');
});
test('hospitality: ITE for the restaurant supervisor, and the diplomas for the hotel and events roles', () => {
  assert.deepEqual(schoolsFor('fnb', 1), ['ITE', 'ITE']);
  assert.deepEqual(schoolsFor('hotel', 2), ['Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']);
  assert.ok(namesFor('events', 2).includes('Diploma in Events & Project Management') && !namesFor('hotel', 2).includes('Diploma in Events & Project Management'));
});
test('ite-only fields have level 1 courses at ITE and nothing above', () => {
  const ite = { chef: 2, pastry: 2, 'cabin-crew': 2, hair: 4, fitness: 2 };
  for (const [id, n] of Object.entries(ite)) {
    const list = L.forRole(ROLE[id], 1);
    assert.equal(list.length, n, id);
    assert.ok(list.every(c => c.school === 'ITE' && c.fee === 566), id);
    assert.deepEqual(plain(L.forRole(ROLE[id], 2)), [], id);
  }
});
test('property has no public course', () => assert.deepEqual(plain(L.forRole(ROLE['real-estate'], 1)), []));
// Every option for a field, best first.
const optionsOf = field => [O.OPTIONS[field].best].concat(O.OPTIONS[field].alts || []);

test('law: every option carries the Ministry of Law recognition warning and only the countries on the Institute of Legal Education list', () => {
  const all = optionsOf('law');
  assert.ok(all.length >= 3);
  for (const o of all) {
    assert.match(o.watch, /Ministry of Law/, o.school);
    assert.match(o.watch, /Singapore Institute of Legal Education/, o.school);
    assert.match(o.watch, /Part A of the Singapore Bar Examinations/, o.school);
    assert.ok(['United Kingdom', 'Australia', 'New Zealand', 'United States'].includes(o.country), o.school);
    assert.ok(o.src.includes('mlaw-bar') && o.src.includes('sile-qp'), o.school);
  }
  assert.equal(new Set(all.map(o => o.country)).size, all.length);
});
test('law: the best pick is the highest-ranked school with a fee, and the ranks fall down the list', () => {
  const ranks = optionsOf('law').map(o => Number(o.standing.match(/Ranked (\d+)(?:st|nd|rd|th)/)[1]));
  assert.deepEqual(ranks, [3, 32, 65]);
});
test('law: Cambridge\'s fee range is the University fee plus the lowest and highest College fee for 2027-28, and says so', () => {
  const b = O.OPTIONS.law.best;
  assert.deepEqual(plain(b.tuition), [30798 + 12500, 30798 + 15950]);
  assert.match(b.tuitionNote, /lowest College fee/);
});

test('a course in these fields with no fee is a SIT or SUSS degree, whose fee pages are closed to scripts', () => {
  const fields = ['business', 'accounting', 'finance-risk', 'islamicfin', 'logistics', 'law', 'hospitality', 'culinary', 'aviation', 'beauty', 'sport'];
  for (const c of L.COURSES.filter(c => c.fields.some(f => fields.includes(f)))) if (c.fee === null) assert.ok(['SIT', 'SUSS'].includes(c.school), c.school + ' ' + c.course);
});
