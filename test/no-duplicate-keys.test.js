'use strict';
// Several tasks add sources and contacts to the same blocks, and an object literal silently keeps the last of two equal keys.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('no SOURCES or CONTACTS key is defined twice across the scripts', () => {
  const seen = new Map();
  for (const f of ['serasi-pathways.js', 'serasi-local.js', 'serasi-overseas.js', 'serasi-sectors.js']) {
    const lines = fs.readFileSync(path.join(__dirname, '..', f), 'utf8').split('\n');
    lines.forEach((l, i) => {
      const m = l.match(/^ {4}'([a-z0-9-]+)': \[['"]/);   // a SOURCES entry: 'key': ['label', 'url']
      if (m) (seen.get(m[1]) || seen.set(m[1], []).get(m[1])).push(f + ':' + (i + 1));
    });
  }
  const dup = [...seen].filter(([, at]) => at.length > 1).map(([k, at]) => k + ' at ' + at.join(', '));
  assert.deepEqual(dup, []);
});
