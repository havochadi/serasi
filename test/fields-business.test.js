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
