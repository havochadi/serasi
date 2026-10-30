#!/usr/bin/env node
/* Serasi country data builder: turns the hand-written profiles in scripts/countries/<region>.json plus three World Bank indicators
   into serasi-countries-data.js (window.SerasiCountryData), the file the world map reads.
   Usage: node scripts/build-countries.mjs
   Region file: an array of { iso, name, a2, langs, known, facts, orgs, unis: [{ n, rank?, url? }], fallback?: { pop?, gdp?, gdppc? } }.
   A fallback figure is { v, yr, src, srcUrl } and wins over the World Bank value (Taiwan, territories the World Bank leaves out).
   src is the source's NAME ("IMF World Economic Outlook, April 2026"); srcUrl is an https link to it.
   _meta.json holds the QS edition the unis ranks come from: { qsEdition, qsUrl }. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGION_DIR = path.join(ROOT, 'scripts', 'countries');
const OUT = path.join(ROOT, 'serasi-countries-data.js');
const WB_PAGE = 'https://data.worldbank.org/';
const INDICATORS = { pop: 'SP.POP.TOTL', gdp: 'NY.GDP.MKTP.CD', gdppc: 'NY.GDP.PCAP.CD' };
const NO_WB_FIGURE = 'No figure in the World Bank data';
const ENTRY_KEYS = ['iso', 'name', 'a2', 'langs', 'known', 'facts', 'orgs', 'unis', 'fallback'];
const REQUIRED_KEYS = ENTRY_KEYS.filter(k => k !== 'fallback');
const UNI_KEYS = ['n', 'rank', 'url'];

// ---- Reading and checking the region files ----

const isText = s => typeof s === 'string' && s.trim().length > 0;
const isHttps = s => typeof s === 'string' && /^https:\/\/\S+$/.test(s);

// Throws on the first thing in `entry` that breaks the schema. `where` names the entry in the message.
function validateEntry(entry, where) {
  const fail = msg => { throw new Error(where + ': ' + msg); };
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) fail('entry must be an object');
  for (const k of Object.keys(entry)) if (!ENTRY_KEYS.includes(k)) fail('unknown key "' + k + '" (extra keys are not allowed)');
  for (const k of REQUIRED_KEYS) if (!(k in entry)) fail('missing "' + k + '"');
  if (!Number.isInteger(entry.iso) || entry.iso <= 0) fail('iso must be a positive integer (the numeric ISO 3166 code)');
  if (!isText(entry.name)) fail('name must be text');
  if (typeof entry.a2 !== 'string' || !/^[A-Z]{2}$/.test(entry.a2)) fail('a2 must be two capital letters');
  for (const k of ['langs', 'known', 'facts', 'orgs']) {
    if (!Array.isArray(entry[k]) || !entry[k].length || !entry[k].every(isText)) fail(k + ' must be a non-empty array of text');
  }
  if (!Array.isArray(entry.unis) || !entry.unis.length) fail('unis must be a non-empty array');
  entry.unis.forEach((u, i) => {
    const at = 'unis[' + i + ']';
    if (!u || typeof u !== 'object' || Array.isArray(u)) fail(at + ' must be an object');
    for (const k of Object.keys(u)) if (!UNI_KEYS.includes(k)) fail(at + ' has an unknown key "' + k + '"');
    if (!isText(u.n)) fail(at + '.n must be text');
    if ('rank' in u && !(Number.isInteger(u.rank) && u.rank > 0)) fail(at + '.rank must be a positive integer (leave it out when the school is not ranked)');
    if ('url' in u && !isHttps(u.url)) fail(at + '.url must be an https link');
  });
  if ('fallback' in entry) {
    const fb = entry.fallback;
    if (!fb || typeof fb !== 'object' || Array.isArray(fb)) fail('fallback must be an object');
    for (const [k, f] of Object.entries(fb)) {
      if (!(k in INDICATORS)) fail('fallback has an unknown figure "' + k + '" (use pop, gdp or gdppc)');
      if (!f || typeof f !== 'object' || !(typeof f.v === 'number' && f.v > 0)) fail('fallback.' + k + '.v must be a positive number');
      if (!Number.isInteger(f.yr) || f.yr < 2018 || f.yr > 2026) fail('fallback.' + k + '.yr must be a year from 2018 to 2026');
      if (!isText(f.src) || isHttps(f.src)) fail('fallback.' + k + '.src must be the NAME of the source (e.g. "IMF World Economic Outlook, April 2026"), not a link');
      if (!isHttps(f.srcUrl)) fail('fallback.' + k + '.srcUrl must be an https link to the IMF or the national statistics office page');
      for (const x of Object.keys(f)) if (!['v', 'yr', 'src', 'srcUrl'].includes(x)) fail('fallback.' + k + ' has an unknown key "' + x + '"');
    }
  }
}

// Reads every <region>.json in `dir` (files starting with "_" are not regions). Returns { regionName: entries[] }.
export function readRegions(dir = REGION_DIR) {
  const regions = {};
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.json') || file.startsWith('_')) continue;
    let parsed;
    try { parsed = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); } catch (err) { throw new Error(file + ' is not valid JSON: ' + err.message); }
    if (!Array.isArray(parsed)) throw new Error(file + ' must hold an array of countries');
    regions[file.slice(0, -'.json'.length)] = parsed;
  }
  return regions;
}

export function readMeta(dir = REGION_DIR) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, '_meta.json'), 'utf8'));
  if (!isText(meta.qsEdition) || !isHttps(meta.qsUrl)) throw new Error('_meta.json needs qsEdition (text) and qsUrl (https link)');
  return meta;
}

// ---- The World Bank ----

// A World Bank response ([paging, rows]) as Map(two-letter code -> { v, yr }). With mrnev=1 each row is a country's most recent value.
export function parseWb(json) {
  const rows = Array.isArray(json) ? json[1] : null;
  if (!Array.isArray(rows)) throw new Error('Unexpected World Bank response: ' + JSON.stringify(json).slice(0, 200));
  const out = new Map();
  for (const r of rows) {
    const code = r && r.country && r.country.id;
    const yr = Number(r && r.date);
    if (typeof code !== 'string' || typeof r.value !== 'number' || !(r.value > 0) || !Number.isInteger(yr)) continue;
    if (!out.has(code) || out.get(code).yr < yr) out.set(code, { v: r.value, yr });
  }
  return out;
}

// The World Bank paging block of a response ([paging, rows]) says how many pages there are; a page past the first is fetched too.
export function pagesOf(json) {
  const paging = Array.isArray(json) ? json[0] : null;
  const pages = paging && Number(paging.pages);
  if (!Number.isInteger(pages) || pages < 1) throw new Error('Unexpected World Bank response: no paging.pages in ' + JSON.stringify(paging));
  return pages;
}

async function fetchWb(indicator) {
  const base = 'https://api.worldbank.org/v2/country/all/indicator/' + indicator + '?format=json&mrnev=1&per_page=20000';
  const get = async page => {
    const res = await fetch(base + '&page=' + page, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error('World Bank ' + indicator + ': HTTP ' + res.status);
    return res.json();
  };
  const first = await get(1);
  const pages = pagesOf(first);
  const merged = parseWb(first);
  for (let page = 2; page <= pages; page++) {
    for (const [code, got] of parseWb(await get(page))) if (!merged.has(code) || merged.get(code).yr < got.yr) merged.set(code, got);
  }
  return merged;
}

// ---- Refusing a bad download ----

// The World Bank reports about 200 countries a figure. Under this many in one indicator means the response was cut short or empty.
export const MIN_WB_COUNTRIES = 100;
// The most figures (of countries x 3) that may be missing after fallbacks before the file is not written.
export const MAX_MISSING_SHARE = 0.25;

// Throws when an indicator in wb ({ pop, gdp, gdppc } Maps from parseWb) holds fewer than MIN_WB_COUNTRIES countries.
export function checkWbSize(wb) {
  for (const [key, code] of Object.entries(INDICATORS)) {
    const n = wb[key] ? wb[key].size : 0;
    if (n < MIN_WB_COUNTRIES) throw new Error('World Bank ' + code + ' (' + key + ') returned ' + n + ' countries, fewer than ' + MIN_WB_COUNTRIES + '. Not writing ' + path.basename(OUT) + '; try again later.');
  }
}

// Throws when more than a quarter of the assembled figures have no value. Returns the missing ones as "Country key" texts.
export function checkMissing(data) {
  const missing = [];
  let total = 0;
  for (const c of Object.values(data.byIso)) for (const key of Object.keys(INDICATORS)) { total++; if (c[key].v === null) missing.push(c.name + ' ' + key); }
  if (total && missing.length / total > MAX_MISSING_SHARE) throw new Error(missing.length + ' of ' + total + ' figures have no value, more than a quarter. Not writing ' + path.basename(OUT) + '; the World Bank data looks incomplete.');
  return missing;
}

// ---- Putting it together ----

// regions: { name: entries[] }; meta: { qsEdition, qsUrl }; wb: { pop, gdp, gdppc } Maps from parseWb; asof: 'YYYY-MM-DD'.
export function assemble({ regions, meta, wb, asof }) {
  const byIso = {};
  const isoOwner = new Map();
  const a2Owner = new Map();
  for (const [region, entries] of Object.entries(regions)) {
    entries.forEach((e, i) => {
      const where = region + '.json #' + (i + 1) + (e && e.name ? ' (' + e.name + ')' : '');
      validateEntry(e, where);
      if (isoOwner.has(e.iso)) throw new Error(where + ': iso ' + e.iso + ' is already used by ' + isoOwner.get(e.iso));
      if (a2Owner.has(e.a2)) throw new Error(where + ': a2 ' + e.a2 + ' is already used by ' + a2Owner.get(e.a2));
      isoOwner.set(e.iso, where);
      a2Owner.set(e.a2, where);
      const figure = key => {
        if (e.fallback && e.fallback[key]) { const f = e.fallback[key]; return { v: f.v, yr: f.yr, src: f.src, srcUrl: f.srcUrl }; }
        const got = wb[key] && wb[key].get(e.a2);
        return got ? { v: got.v, yr: got.yr } : { v: null, why: NO_WB_FIGURE };
      };
      byIso[e.iso] = {
        name: e.name, a2: e.a2, langs: e.langs, pop: figure('pop'), gdp: figure('gdp'), gdppc: figure('gdppc'),
        known: e.known, facts: e.facts, orgs: e.orgs,
        unis: e.unis.map(u => Object.fromEntries(UNI_KEYS.filter(k => k in u).map(k => [k, u[k]])))
      };
    });
  }
  const sorted = Object.fromEntries(Object.keys(byIso).map(Number).sort((a, b) => a - b).map(k => [k, byIso[k]]));
  return { asof, qs: { edition: meta.qsEdition, url: meta.qsUrl }, wb: { url: WB_PAGE }, byIso: sorted };
}

// The text of serasi-countries-data.js. One country per line so a changed profile is a one-line diff.
export function render(data) {
  const rows = Object.entries(data.byIso).map(([iso, c]) => '  ' + JSON.stringify(iso) + ': ' + JSON.stringify(c));
  return '/* Generated by scripts/build-countries.mjs from scripts/countries/*.json and the World Bank API. Generated file, do not edit: change the region files and run the builder again. */\n' +
    'window.SerasiCountryData = {\n' +
    '  asof: ' + JSON.stringify(data.asof) + ',\n' +
    '  qs: ' + JSON.stringify(data.qs) + ',\n' +
    '  wb: ' + JSON.stringify(data.wb) + ',\n' +
    '  byIso: {\n' + rows.map(r => '  ' + r).join(',\n') + '\n  }\n' +
    '};\n';
}

async function main() {
  const regions = readRegions();
  const meta = readMeta();
  const wb = {};
  for (const [key, code] of Object.entries(INDICATORS)) wb[key] = await fetchWb(code);
  checkWbSize(wb);
  const data = assemble({ regions, meta, wb, asof: new Date().toISOString().slice(0, 10) });
  const missing = checkMissing(data);
  fs.writeFileSync(OUT, render(data));
  console.log('Wrote ' + path.relative(ROOT, OUT) + ': ' + Object.keys(data.byIso).length + ' countries from ' + Object.keys(regions).join(', ') + '; QS edition ' + meta.qsEdition + '.');
  if (missing.length) console.log('No World Bank figure and no fallback for: ' + missing.join('; '));
}

const realPath = p => { try { return fs.realpathSync(p); } catch { return p; } };
if (process.argv[1] && realPath(process.argv[1]) === realPath(fileURLToPath(import.meta.url))) {
  main().catch(err => { console.error(err.message); process.exitCode = 1; });
}
