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

test('graphic and UX design: ITE Communication Design at level 1 for the roles it fits, and ten diplomas at level 2', () => {
  assert.deepEqual(schoolsFor('multimedia', 1), ['ITE', 'ITE']);
  assert.deepEqual(schoolsFor('ux', 1), ['ITE', 'ITE']);
  assert.deepEqual(schoolsFor('graphic', 2), [
    'Singapore Polytechnic', 'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic',
    'Temasek Polytechnic', 'Temasek Polytechnic', 'LASALLE', 'NAFA']);
  assert.ok(L.forRole(ROLE.ux, 2).some(c => /Experience Design/.test(c.course)), 'Nanyang Experience Design is shared with interior design');
});

test('fashion: Temasek and NAFA at level 2, and LASALLE\'s creative direction diploma is not listed as fashion design', () => {
  assert.deepEqual(schoolsFor('fashion', 2), ['Temasek Polytechnic', 'NAFA']);
  assert.equal(L.forRole(ROLE.fashion, 1).length, 0, 'ITE has no fashion design course, so level 1 shows nothing');
  assert.ok(!L.COURSES.some(c => /Creative Direction for Fashion/.test(c.course)));
});
test('animation: ITE Communication Design at level 1 for the animator, and three diplomas at level 2', () => {
  assert.deepEqual(namesFor('animator', 1), ['Higher Nitec in Communication Design', 'Higher Nitec in Communication Design (3 years)']);
  assert.deepEqual(schoolsFor('animator', 2), ['Singapore Polytechnic', 'Nanyang Polytechnic', 'NAFA']);
});
test('media: ITE film and video for the video editor, Communication Design for the photographer, diplomas for the content producer, degrees for the journalist', () => {
  assert.deepEqual(namesFor('video', 1), ['Higher Nitec in Film & Video Production', 'Higher Nitec in Film & Video Production (3 years)']);
  assert.deepEqual(namesFor('photographer', 1), ['Higher Nitec in Communication Design', 'Higher Nitec in Communication Design (3 years)']);
  assert.deepEqual(schoolsFor('content', 2), [
    'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Ngee Ann Polytechnic', 'Republic Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic', 'NAFA']);
  assert.deepEqual(schoolsFor('journalist', 3), ['NUS', 'NTU']);
  assert.equal(L.forRole(ROLE.journalist, 1).length, 0, 'the journalist needs no ITE course');
});
test('translation: NUS Malay Studies for the translator only, and nothing is listed for the levels below', () => {
  assert.deepEqual(namesFor('translator', 3), ['Bachelor of Arts (Honours) with a major in Malay Studies']);
  assert.equal(L.forRole(ROLE.translator, 1).length, 0);
  assert.equal(L.forRole(ROLE.translator, 2).length, 0);
  assert.equal(L.html(ROLE.translator, 2, { esc: String, money: String }), '', 'a level with no school renders nothing');
});
test('the design and media fields are only ever attached to courses with a school page', () => {
  const fields = ['interior-design', 'graphic-ux', 'fashion', 'animation', 'media', 'translation'];
  for (const c of L.COURSES.filter(c => c.fields.some(f => fields.includes(f)))) assert.match(c.url, /^https:\/\//, c.course);
});
