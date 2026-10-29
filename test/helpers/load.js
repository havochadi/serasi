'use strict';
/* Runs repo-root scripts in order inside one node:vm context, the way the pages load them,
   and returns the shared window so tests can read window.SerasiCore, window.SerasiStudy and so on. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..', '..');

function load(files) {
  const window = {};
  const context = vm.createContext({ window, URL, console });
  for (const file of files) vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
  return window;
}

module.exports = load;
