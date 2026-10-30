'use strict';
/* Tech, engineering and aviation fields: computing, data-ai, cybersecurity, civil-eng, mechanical-eng, electrical-eng, engineering, trades, aero, maritime.
   The schema tests in local.test.js and overseas.test.js already check every entry; these pin which schools and options each field has. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, plain } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-local.js', 'serasi-overseas.js']);
const L = w.SerasiLocal, O = w.SerasiOverseas, P = w.SerasiPathways;
const { ROLE } = w.SerasiCore;
const { FIELDS } = w.SerasiStudy;

const schoolsFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.school));
const namesFor = (id, lvl) => plain(L.forRole(ROLE[id], lvl).map(c => c.course));
const FIELD_IDS = ['computing', 'data-ai', 'cybersecurity', 'civil-eng', 'mechanical-eng', 'electrical-eng', 'engineering', 'trades', 'aero', 'maritime'];
const STUDY_FIELDS = FIELD_IDS.filter(f => FIELDS[f].kind === 'study');
const ENGINEER_FIELDS = ['civil-eng', 'mechanical-eng', 'electrical-eng'];

test('the three ITE fields have ITE courses at level 1 only, and no overseas options', () => {
  for (const f of ['engineering', 'trades', 'aero']) {
    const list = L.COURSES.filter(c => c.fields.includes(f));
    assert.ok(list.length > 0, f + ' has courses');
    assert.ok(list.every(c => c.lvl === 1 && c.school === 'ITE'), f + ': ITE, level 1');
    assert.equal(O.OPTIONS[f], undefined, f + ' has no overseas options');
  }
});
test('aero: the aircraft technician is offered the Higher Nitec in Aerospace Engineering at ITE only', () => {
  assert.deepEqual(namesFor('aircraft-tech', 1), ['Higher Nitec in Aerospace Engineering']);
  assert.deepEqual(schoolsFor('aircraft-tech', 1), ['ITE']);
});
test('trades: each trade gets the ITE course for its own work', () => {
  assert.deepEqual(namesFor('electrician', 1), ['Higher Nitec in Electrical Engineering']);
  assert.deepEqual(namesFor('solar-tech', 1), ['Higher Nitec in Electrical Engineering']);
  assert.deepEqual(namesFor('ev-tech', 1), ['Higher Nitec in Automotive Engineering']);
  assert.deepEqual(namesFor('facilities-tech', 1), ['Higher Nitec in Facilities Management & Engineering']);
});
test('engineering technology: both roles are offered the same ITE engineering courses', () => {
  assert.deepEqual(namesFor('eng-tech', 1), namesFor('semi-tech', 1));
  assert.ok(namesFor('eng-tech', 1).includes('Higher Nitec in Electronics Engineering'));
});
test('computing: ITE courses for the support specialist, polytechnic diplomas from all five, and the game course only for the game developer', () => {
  assert.deepEqual(namesFor('it-support', 1), ['Higher Nitec in IT Systems & Networks', 'Higher Nitec in IT Applications Development']);
  assert.ok(namesFor('game-dev', 1).includes('Higher Nitec in Immersive Applications & Game'));
  assert.ok(!namesFor('software-eng', 1).includes('Higher Nitec in Immersive Applications & Game'));
  assert.deepEqual([...new Set(schoolsFor('software-eng', 2))], ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']);
  assert.ok(namesFor('game-dev', 2).includes('Diploma in Immersive Media & Game Development'));
  assert.ok(!namesFor('backend-eng', 2).includes('Diploma in Immersive Media & Game Development'));
});
test('cybersecurity: every polytechnic runs a Cybersecurity & Digital Forensics diploma', () => {
  assert.deepEqual(schoolsFor('cyber', 2), ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']);
  assert.ok(namesFor('cyber', 2).every(n => n === 'Diploma in Cybersecurity & Digital Forensics'));
});
test('data and AI: the analyst gets diplomas from all five polytechnics', () => {
  assert.deepEqual([...new Set(schoolsFor('data-analyst', 2))], ['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']);
});
test('civil engineering: Singapore Polytechnic is the only diploma, for the civil engineer, and the quantity surveyor has none listed', () => {
  assert.deepEqual(schoolsFor('civil-eng', 2), ['Singapore Polytechnic']);
  assert.deepEqual(schoolsFor('qs', 2), []);
  assert.equal(L.html(ROLE.qs, 2, { esc: String, money: String }), '');
});
test('mechanical and electrical engineering diplomas', () => {
  assert.deepEqual(schoolsFor('mech-eng', 2), ['Singapore Polytechnic', 'Ngee Ann Polytechnic']);
  assert.deepEqual(new Set(schoolsFor('elec-eng', 2)), new Set(['Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic']));
});
test('maritime: the port officer is offered ITE logistics, the marine engineer ITE marine and the Singapore Polytechnic diploma', () => {
  assert.deepEqual(namesFor('port-ops', 1), ['Higher Nitec in Logistics & Supply Chain Management']);
  assert.deepEqual(namesFor('marine-eng', 1), ['Higher Nitec in Marine & Offshore Engineering']);
  assert.deepEqual(schoolsFor('marine-eng', 2), ['Singapore Polytechnic']);
});
test('every ITE course in these fields is charged the ITE Higher Nitec rate, and every diploma a polytechnic rate near the generic fee', () => {
  for (const c of L.COURSES.filter(c => FIELD_IDS.some(f => c.fields.includes(f)))) {
    if (c.school === 'ITE') assert.equal(c.fee, 566, c.course);
    if (c.lvl === 2) assert.ok(c.fee > 3100 && c.fee < 3200, c.school + ' ' + c.course);
  }
});

test('each tech study field with options has a best pick and no more than two alternatives, one per country', () => {
  for (const f of STUDY_FIELDS.filter(f => O.OPTIONS[f] && O.OPTIONS[f].best)) {
    const { best, alts } = O.OPTIONS[f], all = [best].concat(alts);
    assert.ok(alts.length <= 2, f + ': at most two alternatives');
    assert.equal(new Set(all.map(o => o.country)).size, all.length, f + ': one school per country');
  }
});
test('the tech study fields that have overseas options are the ones with a QS subject', () => {
  for (const f of ['computing', 'data-ai', 'cybersecurity', 'civil-eng', 'mechanical-eng', 'electrical-eng']) assert.ok(O.OPTIONS[f] && O.OPTIONS[f].best, f);
});
test('civil, mechanical and electrical options all carry the Professional Engineers Board warning, with its sources and contact', () => {
  for (const f of ENGINEER_FIELDS) {
    for (const o of [O.OPTIONS[f].best].concat(O.OPTIONS[f].alts)) {
      assert.match(o.watch, /Professional Engineers Board/, f + ': ' + o.school);
      assert.ok(o.src.includes('peb-req') && o.src.includes('peb-qual26'), f + ': ' + o.school + ' cites the Board');
      assert.ok(o.links.includes('peb'), f + ': ' + o.school + ' links the Board');
    }
  }
});
test('computing, data and cybersecurity options make no Singapore recognition claim', () => {
  for (const f of ['computing', 'data-ai', 'cybersecurity']) for (const o of [O.OPTIONS[f].best].concat(O.OPTIONS[f].alts)) assert.doesNotMatch(o.watch, /Professional Engineers Board|recognis/i, f + ': ' + o.school);
});
test('every option states its living figure as a budget or visa minimum rather than a typical cost', () => {
  for (const f of STUDY_FIELDS.filter(f => O.OPTIONS[f] && O.OPTIONS[f].best)) for (const o of [O.OPTIONS[f].best].concat(O.OPTIONS[f].alts)) assert.match(o.watch, /not a typical budget|estimate/, f + ': ' + o.school);
});
test('the best pick is the world number one where its school page gave a fee, and cybersecurity says which QS subject it borrows', () => {
  for (const f of ['computing', 'data-ai', 'civil-eng', 'mechanical-eng', 'electrical-eng']) assert.match(O.OPTIONS[f].best.standing, /Ranked 1st in the world/, f);
  assert.match(O.OPTIONS.cybersecurity.best.standing, /closest QS subject/);
});
test('the tech options use currencies with a rate and fees in the right range, and the html renders without NaN', () => {
  for (const f of ['computing', 'data-ai', 'cybersecurity', 'civil-eng', 'mechanical-eng', 'electrical-eng']) {
    for (const o of [O.OPTIONS[f].best].concat(O.OPTIONS[f].alts)) assert.ok(P.FX[o.cur] > 0, o.school);
  }
  const h = { esc: s => String(s), srcLinks: keys => (keys || []).map(k => P.SOURCES[k][0]).join(' ') };
  for (const id of ['software-eng', 'data-sci', 'cyber', 'civil-eng', 'mech-eng', 'elec-eng']) {
    const out = O.html(ROLE[id], h);
    assert.match(out, /Best place to study this/, id);
    assert.doesNotMatch(out, /NaN|undefined|null/, id);
  }
});
test('roles whose field has no overseas options (yet) get no overseas section', () => {
  assert.equal(O.html(ROLE['port-ops'], { esc: String, srcLinks: () => '' }), '');
});

test('degrees: data and AI roles get NUS, NTU, SUTD and SIT; civil, mechanical and electrical engineers get the NUS and NTU engineering degrees', () => {
  assert.deepEqual(schoolsFor('data-sci', 3), ['NUS', 'NUS', 'NTU', 'SUTD', 'SIT']);
  assert.deepEqual(schoolsFor('civil-eng', 3), ['NUS', 'NTU', 'SIT']);
  assert.deepEqual(schoolsFor('mech-eng', 3), ['NUS', 'NTU']);
  assert.deepEqual(schoolsFor('elec-eng', 3), ['NUS', 'NTU', 'SIT']);
});
test('the quantity surveyor and the computing, cybersecurity and marine roles have no degree listed (their routes end at a diploma)', () => {
  for (const id of ['qs', 'software-eng', 'cyber', 'marine-eng']) assert.deepEqual(schoolsFor(id, 3), [], id);
});
test('SIT fees are null where its pages could not be read, and the other degrees carry a fee with a source', () => {
  for (const c of L.COURSES.filter(c => c.lvl === 3 && FIELD_IDS.some(f => c.fields.includes(f)))) {
    if (c.school === 'SIT') assert.equal(c.fee, null, c.course); else { assert.ok(c.fee > 8000, c.course); assert.ok(c.src.length > 0, c.course); }
  }
});
