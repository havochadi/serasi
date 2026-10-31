'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { load } = require('./helpers/load');

const html = fs.readFileSync(path.join(__dirname, '..', 'youth.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.trim());
const w = load(['serasi-core.js', 'serasi-pathways.js', 'serasi-study.js', 'serasi-local.js', 'serasi-overseas.js']);
const ctx = vm.createContext({ ...w, window: w, URL, console });
// Exercise the same route/render functions used by the page without booting the DOM.
const source = scripts.find(s => s.includes('function pathPanel'));
const routeCode = source.slice(source.indexOf("  'use strict';"), source.indexOf('  // Places where'));
vm.runInContext(routeCode + '\nconst state = { income: "" }; window.routes = { pathFor, pathPanel, state };', ctx);

test('all inline scripts compile', () => {
  for (const script of scripts) assert.doesNotThrow(() => new vm.Script(script));
});

test('every role renders a valid route at all four qualification stages', () => {
  for (const role of w.SerasiCore.ROLES) for (const stage of w.SerasiCore.PATHWAYS) {
    const out = w.routes.pathPanel({ role }, { pathway: stage.k });
    assert.doesNotMatch(out, /undefined|NaN|you already qualify|No more study needed/);
    assert.match(out, /class="path-panel"/);
    assert.match(out, /Suggested route/);
  }
});

test('a degree holder is prompted to check their field rather than treated as qualified', () => {
  const role = w.SerasiCore.ROLE['data-sci'];
  const route = w.routes.pathFor(role, { pathway: 'Uni' });
  assert.equal(route.steps[0].t, 'Check your existing qualification');
  assert.match(route.steps[0].n, /may meet.*related field/);
  assert.equal(route.steps.filter(s => s.fee).length, 0);
});

test('professional registration remains part of a regulated route', () => {
  const steps = w.routes.pathFor(w.SerasiCore.ROLE.nurse, { pathway: 'Poly' }).steps;
  assert.ok(steps.some(s => /Singapore Nursing Board/.test(s.n)));
});

test('fee estimates remain available for every income band', () => {
  for (const band of w.SerasiPathways.INCOME) {
    w.routes.state.income = band.k;
    const out = w.routes.pathPanel({ role: w.SerasiCore.ROLE['data-sci'] }, { pathway: 'ITE' });
    assert.doesNotMatch(out, /undefined|NaN/);
    assert.match(out, /Planning estimate/);
    assert.match(out, /data-income="1"/);
  }
});
