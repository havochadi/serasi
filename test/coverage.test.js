'use strict';
// Coverage across every field of study (Task 10): every field has overseas options or a note, local courses at the level its roles need,
// and every role that needs a diploma or degree resolves to advice. Each gap is named here with its reason, so it stays visible, and
// the tests fail both when an unlisted field falls short and when a listed field no longer needs its exception.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-overseas.js', 'serasi-local.js']);
const O = w.SerasiOverseas, L = w.SerasiLocal, P = w.SerasiPathways;
const { FIELDS, fieldOf } = w.SerasiStudy;
const ROLES = Object.values(w.SerasiCore.ROLE);
const rolesOf = field => ROLES.filter(r => fieldOf(r) === field);
const maxEdu = field => Math.max(...rolesOf(field).map(r => r.edu));

// Study fields with a best pick but fewer than two alternatives, and why. Adding a second alternative means deleting its line here.
const SHORT_ALTS = {
  'mechanical-eng': 'MIT and Imperial only: Toronto (=35th) and a Hong Kong school were not checked for a fee',
  'electrical-eng': 'MIT and Imperial only: Toronto (=16th) and HKUST (33rd) were not checked for a fee',
  biomedical: 'UCL and Cambridge only: Oxford’s fee pages returned 403, and the US schools and ETH are out (US living costs, German-taught bachelor’s)',
  cybersecurity: 'Imperial and MIT only: a search found no cybersecurity bachelor’s at HKU, HKUST or CUHK',
  accounting: 'LSE and HKU only: Melbourne’s pages are closed to scripts and Sydney’s course page gave no fee',
  'finance-risk': 'LSE and HKU only, the same QS table and rule as accounting',
  islamicfin: 'LSE and HKU only, the same finance degrees as finance-risk',
  pharmacy: 'UCL and Toronto only: Monash’s fee page returned 403, and the other ranked schools have no entry-to-practice degree on the Singapore Pharmacy Council’s list or a visa living figure',
  nursing: 'Toronto and CUHK only: King’s fees load dynamically, Trinity’s own fee page was not read, and Penn is in the US',
  logistics: 'PolyU is the only school found with a supply chain bachelor’s open to non-local students and a readable fee; QS has no logistics subject',
  religious: 'IIUM and the Islamic University of Madinah only: Al-Azhar and the University of Jordan have no official fee page for a foreign undergraduate that could be read, and QS has no Islamic studies table'
};
// Fields with no local course at the top level their roles need, and why. Aviation is not here: its roles stop at ITE, where Passenger Services covers them.
const NO_LOCAL = {
  property: 'the real estate salesperson role is reached through the Council for Estate Agencies’ course and exam, not a school (see serasi-local.js)',
  religious: 'no publicly funded school offers an Islamic studies diploma or degree; NUS’s Malay Studies is not Islamic studies (see serasi-local.js)'
};
// Roles that need a diploma or degree and still resolve to nothing, and why. None today.
const NO_ADVICE = {};

const kindOf = f => FIELDS[f].kind;
const studyFields = Object.keys(FIELDS).filter(f => kindOf(f) === 'study');
const agencyFields = Object.keys(FIELDS).filter(f => kindOf(f) === 'agency');
const noteOf = f => O.OPTIONS[f] && typeof O.OPTIONS[f].agency === 'string' ? O.OPTIONS[f] : null;

test('every study field has a best pick and at most four alternatives, or a note that its overseas options are not checked yet', () => {
  for (const f of studyFields) {
    const o = O.OPTIONS[f];
    assert.ok(o, f + ': has an entry in OPTIONS');
    if (noteOf(f)) { assert.equal(o.best, undefined, f + ': a note field has no best pick'); continue; }
    assert.ok(o.best, f + ': best pick');
    assert.ok(Array.isArray(o.alts) && o.alts.length <= 4, f + ': at most four alternatives');
  }
});
test('a study field has two or more alternatives unless SHORT_ALTS names it and says why', () => {
  for (const f of studyFields) {
    if (noteOf(f)) continue;
    const n = O.OPTIONS[f].alts.length;
    if (n >= 2) assert.equal(SHORT_ALTS[f], undefined, f + ': has ' + n + ' alternatives, so remove it from SHORT_ALTS');
    else assert.ok(typeof SHORT_ALTS[f] === 'string' && SHORT_ALTS[f].length > 20, f + ': only ' + n + ' alternative(s) and no reason in SHORT_ALTS');
  }
  for (const f of Object.keys(SHORT_ALTS)) assert.ok(studyFields.includes(f) && !noteOf(f), f + ': SHORT_ALTS names a field with a best pick');
});
test('the study fields with a note instead of options are the ones with no sourced overseas option yet', () => {
  assert.deepEqual(studyFields.filter(noteOf).sort(), ['allied-health', 'earlychild', 'maritime', 'socialwork', 'veterinary']);
  for (const f of studyFields.filter(noteOf)) assert.match(O.OPTIONS[f].agency, /We haven’t checked overseas/, f);
});
test('every agency field has a note of more than 40 characters with its sources', () => {
  for (const f of agencyFields) {
    const o = noteOf(f);
    assert.ok(o && o.agency.length > 40, f + ': agency note');
    assert.ok(o.src.length > 0 && o.src.every(s => P.SOURCES[s]), f + ': sources exist');
  }
});
test('every field that is not an agency field has local courses at the top level its roles need, unless NO_LOCAL names it and says why', () => {
  for (const f of Object.keys(FIELDS)) {
    if (kindOf(f) === 'agency') continue;
    const need = maxEdu(f), has = L.COURSES.some(c => c.lvl === need && c.fields.includes(f));
    if (has) assert.equal(NO_LOCAL[f], undefined, f + ': has a level ' + need + ' course, so remove it from NO_LOCAL');
    else assert.ok(NO_LOCAL[f], f + ': no local course at level ' + need + ' and no reason in NO_LOCAL');
  }
  for (const f of Object.keys(NO_LOCAL)) assert.ok(FIELDS[f], f + ': NO_LOCAL names a real field');
});
test('every role that needs a diploma or degree resolves to options or an agency note', () => {
  for (const r of ROLES.filter(r => r.edu >= 2)) {
    const got = O.forRole(r);
    if (NO_ADVICE[r.id]) assert.equal(got, null, r.id + ': listed in NO_ADVICE but resolves');
    else assert.notEqual(got, null, r.id + ' (' + fieldOf(r) + '): forRole is null and the role is not in NO_ADVICE');
  }
  for (const id of Object.keys(NO_ADVICE)) assert.ok(w.SerasiCore.ROLE[id], id);
});
test('a note on a study field renders as the agency section, with its source links and no price', () => {
  const h = { esc: w.SerasiCore.esc, srcLinks: keys => keys.map(k => '<a href="' + P.SOURCES[k][1] + '">' + P.SOURCES[k][0] + '</a>').join('') };
  const out = O.html(w.SerasiCore.ROLE['vet-tech'], h);
  assert.match(out, /Or study overseas/); assert.match(out, /We haven’t checked overseas veterinary courses/); assert.match(out, /nparks\.gov\.sg/);
  assert.doesNotMatch(out, /best-card|\$\d/);
});
test('Islamic studies names its Singapore gatekeeper in every option and says it is not ranked by QS', () => {
  const r = O.OPTIONS.religious, all = [r.best].concat(r.alts);
  for (const o of all) {
    assert.match(o.watch, /Asatizah Recognition Scheme/, o.school); assert.match(o.watch, /may or may not be/, o.school);
    assert.match(o.standing, /Not ranked by a QS subject table/, o.school);
  }
});
