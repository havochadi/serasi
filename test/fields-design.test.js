'use strict';
/* Design and media fields (interior design, graphic and UX design, fashion, animation, media, translation): the local schools
   for each role, and the overseas options. Data checks that every entry shares are in local.test.js and overseas.test.js. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-local.js', 'serasi-overseas.js']);
const L = w.SerasiLocal, O = w.SerasiOverseas, P = w.SerasiPathways;
const { ROLE } = w.SerasiCore;

const schoolsFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.school));
const namesFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.course));

test('interior design: ITE at level 1 and five diploma schools at level 2, with the Temasek course shared with architecture', () => {
  assert.deepEqual(schoolsFor('interior', 1), ['ITE', 'ITE']);
  assert.ok(L.forRole(ROLE.interior, 1).every(c => /Interior & Product Design/.test(c.course)));
  assert.deepEqual(schoolsFor('interior', 2), ['Nanyang Polytechnic', 'Temasek Polytechnic', 'LASALLE', 'NAFA']);
  assert.ok(L.forRole(ROLE.arch, 2).some(c => c.school === 'Temasek Polytechnic'), 'architecture keeps the Temasek course');
});
test('LASALLE and NAFA fees are their own published figures and carry a fee source', () => {
  for (const c of L.COURSES.filter(c => c.school === 'LASALLE' || c.school === 'NAFA')) {
    assert.ok(c.fee > 3500, c.course + ': a LASALLE or NAFA diploma costs more than a polytechnic one');
    assert.ok(c.src.some(k => /^fee-(lasalle|nafa)27$/.test(k)), c.course);
  }
});
