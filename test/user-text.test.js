'use strict';
// Text a student reads must state what a student needs, not how the data was gathered ("turned scripts away", "could not be read").
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers/load');

const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-overseas.js', 'serasi-local.js']);
const O = w.SerasiOverseas, L = w.SerasiLocal, P = w.SerasiPathways;
const PROCESS = /\bscripts?\b|scrap|could not be (read|confirmed|checked)|couldn[’']t (confirm|read)|\b403\b|\bbots?\b|turned .{0,12}away|when we checked|certificate problem|closed to/i;

test('no overseas option, local course note or source label uses research-process wording', () => {
  for (const [field, f] of Object.entries(O.OPTIONS)) {
    for (const o of f.best ? [f.best, ...f.alts] : []) {
      const text = [o.school, o.course, o.standing, o.why, o.env, o.watch, o.tuitionNote, o.totalNote, o.feeLabel].filter(Boolean).join(' ');
      assert.doesNotMatch(text, PROCESS, field + ': ' + o.school);
    }
    if (f.agency) assert.doesNotMatch(f.agency, PROCESS, field);
  }
  for (const c of L.COURSES) assert.doesNotMatch(c.note || '', PROCESS, c.school + ' ' + c.course);
  for (const [k, v] of Object.entries(P.SOURCES)) assert.doesNotMatch(v[0], PROCESS, k);
});

test('an option that needs earlier study says its total leaves that study out, in the card, the alternative row, the cost text and the summary', () => {
  const h = { esc: x => String(x), srcLinks: () => '' };
  const nurse = w.SerasiCore.ROLE.nurse, pharm = w.SerasiCore.ROLE.pharmacist;
  const nursing = O.OPTIONS.nursing.best, pharmacy = O.OPTIONS.pharmacy.alts.find(o => /Toronto/.test(o.school));
  assert.match(nursing.totalNote, /2 nursing years only.*2 university years before it are not included/);
  assert.match(pharmacy.totalNote, /3 PharmD years only.*2 university years before it are not included/);
  assert.match(O.costText(nursing).total, /for 2 years, including living costs \(for the 2 nursing years only/);
  assert.match(O.html(nurse, h), /including living costs \(for the 2 nursing years only; the 2 university years before it are not included\)/);
  assert.match(O.html(pharm, h), /in total \(for the 3 PharmD years only/);
  assert.match(O.summaryFor(nurse), /\(for the 2 nursing years only; the 2 university years before it are not included\)/);
  assert.ok(O.summaryFor(nurse).length <= 450);
  // An option with no totalNote prints no empty brackets.
  assert.doesNotMatch(O.costText(O.OPTIONS.architecture.best).total, /\(/);
});
