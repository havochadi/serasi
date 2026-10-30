'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js']);
const { ROLES, ROLE } = w.SerasiCore;
const { FIELDS, fieldOf } = w.SerasiStudy;

test('every role maps to a defined field', () => { for (const r of ROLES) assert.ok(FIELDS[fieldOf(r)], r.id); });
test('no field is unused', () => assert.deepEqual(Object.keys(FIELDS).sort(), [...new Set(ROLES.map(fieldOf))].sort()));
test('field examples', () => {
  assert.equal(fieldOf(ROLE.arch), 'architecture');
  assert.equal(fieldOf(ROLE['data-sci']), 'data-ai');
  assert.equal(fieldOf(ROLE.electrician), 'trades');
});
test('kind follows the roles in the field', () => {
  const agency = ['pilot', 'atc', 'teaching', 'uniformed', 'public'];
  for (const [k, f] of Object.entries(FIELDS))
    assert.equal(f.kind, agency.includes(k) ? 'agency' : ROLES.some(r => fieldOf(r) === k && r.edu >= 2) ? 'study' : 'ite', k);
});
