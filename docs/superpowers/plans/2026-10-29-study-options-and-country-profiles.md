# Study Options and Country Profiles Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show every local school and a researched "best place to study overseas" on each role's Shortest path tab, and turn the world map into a sector → country list → spinning globe → country profile (with flag) flow, backed by newly researched data.

**Architecture:** New plain-script modules hold the data and the pure logic (cost sums, field mapping, list building, and the HTML strings for the new page sections), so `node --test` can check them; `youth.html` only wires them in. Data is static and checked in; the country figures are generated from the World Bank API by a script and merged with hand-written text. No build step, no new runtime dependencies.

**Tech Stack:** Plain browser JavaScript, Node 26 `node:test` + `node:vm` for tests, d3 and topojson from cdnjs (already used), `flag-icons` SVGs from jsDelivr.

**Spec:** `docs/superpowers/specs/2026-10-29-study-options-and-country-profiles-design.md`. Read it first; this plan only records decisions the spec leaves open.

## Global Constraints

- No build step. Plain scripts loaded by the pages, as now. Tests run with `node --test test/` (no packages to install).
- Match the code and style of `youth.html` and `serasi-pathways.js`: escape with `esc`, sources through the `srcLinks` pattern, keyboard-operable buttons, short plain-English copy.
- Works on a phone: no horizontal scroll, controls reachable, globe still draggable. Check at 390 px wide.
- If the globe libraries fail to load, the country list and profiles still work.
- Today's date is 2026-10-29. Write "checked October 2026" only for data checked in this work.
- Ask Serasi's payload must stay under the Worker's 16,000-character limit (the page caps itself at 14,000 in `fits()`).
- Every number has a year and a source link. Anything written from general knowledge and not individually sourced is labelled as compiled by Serasi.
- Never show a fee, ranking, population or GDP figure without a year and a source, or invent one. Say "not available" instead.
- Population, GDP and GDP per person: World Bank API, most recent value with its year. Where the World Bank has none, use the IMF or the territory's statistics office and cite it; else `null` with a `why`.
- Institutions: QS World University Rankings (latest edition at build time, edition recorded). A country with no QS-ranked university shows its "main national university" with no rank claim.
- Flags are images from `flag-icons` pinned on jsDelivr (`https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/<a2>.svg`, a2 lowercase), never emoji. Confirm the version exists; if not, pin the newest 7.x that does.
- "Every local school" = publicly funded institutions only: ITE, the five polytechnics, NUS, NTU, SMU, SUTD, SIT, SUSS, LASALLE, NAFA, the University of the Arts Singapore, Duke-NUS, NIE. No private schools.
- Overseas advice only for roles with `edu >= 2`; roles tied to Singapore agencies get a note instead.
- "Best" overseas = school standing for the field first (latest QS by-subject ranking, edition named), then environment (a short note, not a score); cost shown, used to break ties.
- Sector notes: 2025–2026 sources where possible, older ones say their year; every link returns a page; list about 8–10 countries per industry where evidence exists, fewer (never padded) where it doesn't; "Public service and security" stays Singapore-only.
- Commit steps below are skipped unless the user has said commits are wanted. Work on branch `study-options-country-profiles`, not `main`.

## Review Focus

1. A route level with no listed school (custom routes such as teaching, or a field whose course isn't listed) must render nothing for that level: no "undefined", no empty heading. Pinned in Task 3 (`html` returns `''`) and Task 5.
2. Globe shapes with no numeric id or no profile (N. Cyprus, Somaliland, Kosovo): choosing one shows its name and "No profile yet", no exception. Pinned in Task 15 (`profileHtml(undefined)`); checked in the browser in Task 21.
3. Globe libraries blocked: lists and profiles work, nothing tries to spin. Checked in the browser in Task 21 and Task 23.
4. Zero tuition, equal low and high figures, or a currency with no exchange rate: "No tuition fees", no "$X–X" range, and a loud failure (not "NaN") for a missing rate. Pinned in Task 2.
5. A country figure that is `null` (Taiwan's World Bank data, small territories): "not available", never "NaN" or "0". Pinned in Task 15.

## File Structure

Create:
- `package.json` (root, test script only); `test/helpers/load.js`; `test/{study,overseas,local,world-data,countries}.test.js`; `test/fixtures/atlas-ids.json`
- `serasi-study.js`: fields (`FIELDS`, `fieldOf`). `serasi-local.js`: Singapore courses, fee spread, section HTML. `serasi-overseas.js`: overseas options, costs, section HTML, Ask Serasi summaries.
- `serasi-countries-data.js` (generated, never hand-edited) and `serasi-countries.js` (sector lists, profile HTML, formatting).
- `scripts/check-links.mjs`, `scripts/build-countries.mjs`, `scripts/countries/{_meta,asia,europe,africa,americas,oceania}.json`

Modify: `serasi-pathways.js` (FX, new SOURCES/CONTACTS/WORLD notes, then remove `ABROAD` and `abroad` keys), `youth.html`, `.github/workflows/pages.yml`, `README.md`, `.gitignore`.

Script order in `youth.html`: core, pathways, study, local, overseas, countries-data, countries. New modules add sources with `Object.assign(window.SerasiPathways.SOURCES, {...})` at their top.

## Data task procedure (Tasks 5–10)

For each field in the task:
1. **Local:** find every public school (list in Global Constraints) offering a matching course at each level the roles in the field need (ITE for edu 1, diploma for edu 2, degree for edu 3, and the diploma route into a degree where one exists). Use the school's own course page. `fee` is the school's published yearly fee for a Singapore Citizen after the Tuition Grant, else `null`. Add one `COURSES` entry per school and course.
2. **Overseas** (`kind: 'study'` fields): rank countries by the latest QS by-subject ranking for the field's subject, then weigh environment; record the best pick and about three alternatives (2–4). Tuition and living costs are yearly, in local currency; living is the official visa financial-proof figure where one exists, else a cited estimate; `yrs` covers what is needed to qualify (e.g. bachelor's plus master's for architects). `watch` carries the Singapore recognition warning for regulated professions (architects, nurses, allied health, doctors, lawyers, Islamic scholars). Keep the existing scholarship notes (e.g. MEXT) on the option they belong to.
3. Add every new source to `SOURCES` (and official country guides to `CONTACTS`). Add any new currency to `FX`.
4. Run `node --test test/` (must pass) and `node scripts/check-links.mjs` (no hard failures).
5. Commit: `git add serasi-*.js && git commit -m "Add study options for <fields>"`.

## Tasks

### Task 1: Test runner and field model

**Files:** Create `package.json`, `test/helpers/load.js`, `test/study.test.js`, `serasi-study.js`.

**Interfaces:**
- Produces: `load(files: string[]): window` (test helper: runs each repo-root file in one `node:vm` context with `window`, `URL`, `console`, in order). `window.SerasiStudy = { FIELDS: {[key]: {label: string, kind: 'study'|'agency'|'ite'}}, fieldOf(role): string }`.

- [ ] **Step 1:** `git switch -c study-options-country-profiles`.
- [ ] **Step 2: Write the failing tests** in `test/study.test.js` (load `serasi-core.js`, `serasi-pathways.js`, `serasi-study.js`):

```js
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
```

- [ ] **Step 3:** Run `node --test test/` → FAIL (module missing).
- [ ] **Step 4: Implement `serasi-study.js`.** `fieldOf` returns the override for the role id, else `role.trk`. Overrides: `biomed-sci, lab-tech, pharma-qa → biomedical`; `vet-tech → veterinary`; `software-eng, backend-eng, game-dev, it-support → computing`; `data-analyst, data-sci, ai-eng, data-consultant, product-analyst → data-ai`; `cyber → cybersecurity`; `accounts-exec, auditor → accounting`; `risk-analyst, bank-ops, compliance → finance-risk`; `ecommerce, ops-exec, hr, bizdev, marketing, sustainability, retail, sales, customer-service → business`; `pharm-tech, pharmacist → pharmacy`; `physio, ot, radiographer, dietitian, oral-health → allied-health`; `arch → architecture`; `interior → interior-design`; `ux, graphic, multimedia → graphic-ux`; `fashion → fashion`; `animator → animation`; `translator → translation`; `content, journalist, video, photographer → media`; `civil-eng, qs → civil-eng`; `mech-eng → mechanical-eng`; `elec-eng → electrical-eng`. Everything else keeps its track key (43 fields in all). `kind` per the test rule; give every field a plain `label`.
- [ ] **Step 5:** Run `node --test test/` → PASS. **Step 6:** Commit `Add the field model and a Node test runner`.

### Task 2: Overseas cost helpers and exchange rates

**Files:** Modify `serasi-pathways.js` (FX); create `serasi-overseas.js`, `test/overseas.test.js`.

**Interfaces:**
- Consumes: `SerasiPathways.FX`, `SerasiStudy.fieldOf`.
- Produces: `FX_ASOF` (string, exported by pathways). `window.SerasiOverseas = { OPTIONS: {}, costOf(opt, fx?), costText(opt, fx?) }` where an `Option` is `{country, school, course, yrs, tuition: [lo, hi], feeLabel?: string, cur, living: number|null, once?: number, standing, why, env, watch, url, src: string[], links?: string[]}` (`feeLabel` replaces the word "Tuition" when the yearly figure is something else, such as "Semester fees" for German public universities); `costOf` → `{tuitionSgd: [lo, hi], livingSgd: number|null, totalSgd: [lo, hi]}` (rounded to $100, `fx` defaults to `SerasiPathways.FX`); `costText` → `{fees, living, total}` strings; both throw `Error('No exchange rate for ' + cur)` for an unknown currency.

- [ ] **Step 1: Write failing tests:**

```js
test('costOf sums tuition, living and one-off fees in S$', () =>
  assert.deepEqual(O.costOf({ yrs: 4, tuition: [1000, 2000], cur: 'CHF', living: 20000, once: 500 }, { CHF: 1.5 }).totalSgd, [126800, 132800]));
test('costText wording', () => assert.deepEqual(O.costText({ yrs: 4, tuition: [1000, 2000], cur: 'CHF', living: 20000 }, { CHF: 1.5 }),
  { fees: 'Tuition CHF 1,000–2,000 a year (about $1,500–3,000)', living: 'Living costs CHF 20,000 a year (about $30,000)', total: 'Roughly $126,000–132,000 for 4 years, including living costs' }));
test('zero tuition and equal bounds', () => {
  const t = O.costText({ yrs: 3, tuition: [0, 0], cur: 'EUR', living: 12000 }, { EUR: 1.5 });
  assert.match(t.fees, /^No tuition fees/); assert.doesNotMatch(t.total, /–/);
});
test('a missing exchange rate fails loudly', () => assert.throws(() => O.costOf({ yrs: 1, tuition: [1, 1], cur: 'XXX', living: null }, {}), /No exchange rate for XXX/));
test('every option uses a currency with a rate', () => { /* walk OPTIONS best+alts; assert FX[o.cur] > 0 */ });
test('exchange rates are dated this year', () => assert.match(P.FX_ASOF, /2026/));
```
(The `total` line above: tuition 1000–2000 ×4 = 4,000–8,000, living 80,000, ×1.5 → 126,000–132,000.)

- [ ] **Step 2:** Run → FAIL. **Step 3:** Refresh `FX` in `serasi-pathways.js` from a cited current source (the exchange-rate page of a central bank or MAS), add the currencies named later as needed (CHF, DKK, SEK, NOK, CAD, USD, NZD, KRW, CNY, HKD, AED, EGP, TRY, SAR and the existing five), export `FX_ASOF = 'October 2026'`, and add the rate source to `SOURCES`. **Step 4:** Implement `serasi-overseas.js` (`OPTIONS = {}` for now; wording as in the test; ranges collapse when equal; both tuition bounds zero with no `feeLabel` reads "No tuition fees"). **Step 5:** PASS. **Step 6:** Commit `Add overseas cost helpers and refresh exchange rates`.

### Task 3: Local course helpers

**Files:** Create `serasi-local.js`, `test/local.test.js`.

**Interfaces:**
- Consumes: `SerasiStudy.fieldOf`, `SerasiCore.esc`.
- Produces: `window.SerasiLocal = { SCHOOLS: string[], COURSES: Course[], forRole(role, lvl, courses = COURSES): Course[], spread(courses, generic): {lo, hi, differs}|null, html(role, lvl, h, courses = COURSES): string }`. `Course = {school, course, lvl: 1|2|3, yrs, fee: number|null, mode?: 'part-time'|'work-study', fields: string[], roles?: string[], url, src?: string[]}`. `h = {esc, money}`. `forRole` matches `fields` to `fieldOf(role)`, `lvl` equal, and `roles` (when present) to `role.id`; order follows `SCHOOLS`. `differs` is true when any fee is more than $300 from `generic`; `null` for an empty list; `null` fees are ignored.

- [ ] **Step 1: Failing tests** (pass a small hand-made course list as the `courses` argument): `spread([{fee:3180},{fee:3600}], 3180)` → `{lo:3180,hi:3600,differs:true}`; `spread([{fee:3180},{fee:null}], 3180)` → `{lo:3180,hi:3180,differs:false}`; `spread([], 3180)` → `null`; `forRole` keeps only matching field/level/role and orders by `SCHOOLS`; `html(role, lvl, h)` returns `''` when the list is empty (Review Focus 1) and, for a list with a `null` fee, contains "fee on the school's page" and no "null"/"undefined"; schema test over all `COURSES`: `school ∈ SCHOOLS`, `url` starts `https://`, `yrs > 0`, every `fields[i] ∈ FIELDS`.
- [ ] **Step 2:** FAIL. **Step 3:** Implement. `html` renders `<ul class="schools">` with one `<li>` per course: school, course, years, "$fee a year" or "fee on the school's page", "part-time"/"work-study" tag, and an external "course page ↗" link, then one line: "Yearly fees are for Singapore Citizens after the MOE Tuition Grant, as listed on each school's page in October 2026." **Step 4:** PASS. **Step 5:** Commit `Add local course helpers`.

### Task 4: Link checker

**Files:** Create `scripts/check-links.mjs`.

**Interfaces:** `node scripts/check-links.mjs [--only <substring>]` loads the scripts the way `test/helpers/load.js` does, collects every `https://` URL from `SOURCES`, `CONTACTS`, `SerasiLocal.COURSES[].url`, `SerasiOverseas.OPTIONS` (every option `url`), `SerasiCountryData` (university and source URLs, flag URLs) when those exist, requests each (GET, browser-like user agent, 15 s timeout, one retry), and prints `FAIL <status|error> <url>` for 404, 410, DNS and timeout failures (exit code 1), and `CHECK-BY-HAND <status> <url>` for 401, 403, 429 and 999 (exit code 0).

- [ ] **Step 1:** Implement. **Step 2:** Run `node scripts/check-links.mjs`. Expected: it ends with a summary line `Checked N links: F failed, H to check by hand` and exits 0 when F is 0. If it finds dead links already in `SOURCES`, do not fix them here; list them for the user. Run `node scripts/check-links.mjs --only worldbank` and expect `Checked` followed by a count of 0 or more links matching, not an error. **Step 3:** Commit `Add a link checker`.

### Task 5: Shortest path UI, with architecture as the first field

**Files:** Modify `youth.html` (script tags near line 749; `pathPanel` ~962 and `abroadCalc`/`abroadCard` ~921–941; CSS near line 648), `.github/workflows/pages.yml` (copy the new scripts); extend `serasi-local.js`, `serasi-overseas.js`, `test/local.test.js`, `test/overseas.test.js`.

**Interfaces:**
- Produces: `SerasiOverseas.forRole(role): {field, best, alts} | {field, agency: string} | null` (null when `edu < 2` or the field's `kind` is `'ite'`); `SerasiOverseas.html(role, h): string` with `h = {esc, srcLinks, contactList}`, `''` when `forRole` is null. In `OPTIONS`, a study field is `{best, alts}`, an agency field is `{agency: string}`.

- [ ] **Step 1: Research and add `architecture`** (follow the Data task procedure for Singapore: the polytechnic diploma, NUS and SUTD degrees, plus any other public course that leads to the role; overseas: best pick plus about three alternatives chosen from the latest QS Architecture ranking and the environment).
- [ ] **Step 2: Failing tests:**

```js
test('architecture: local schools', () => {
  assert.ok(L.forRole(ROLE.arch, 3).map(c => c.school).includes('NUS'));
  assert.ok(L.forRole(ROLE.arch, 3).map(c => c.school).includes('SUTD'));
  assert.ok(L.forRole(ROLE.arch, 2).length >= 1);
});
test('architecture: best overseas place is in Europe, with alternatives', () => {
  const r = O.forRole(ROLE.arch);
  assert.ok(EUROPE.includes(r.best.country)); assert.ok(r.alts.length >= 2 && r.alts.length <= 4);
});
test('html: best card first, then runners-up, costs in S$', () => {
  const html = O.html(ROLE.arch, h);
  assert.match(html, /Best place to study this/); assert.ok(html.indexOf('Best place') < html.indexOf('Also worth a look'));
  assert.match(html, /about \$[\d,]+/); assert.doesNotMatch(html, /undefined|NaN|null/);
});
test('html is empty for a role with no overseas study', () => assert.equal(O.html(ROLE.electrician, h), ''));
test('agency roles get a note instead of options', () => assert.match(O.html(ROLE.teacher, h), /MOE|NIE/));
```
`EUROPE` is a list of European country names defined in the test file. The agency text for teaching is added to `OPTIONS.teaching` in this task (the other agency fields come in Task 10).

- [ ] **Step 3:** FAIL. **Step 4: Implement the two `html` functions** to the approved layout A: a highlighted card (badge "Best place to study this", `country · school`, course and years, `standing`, `why`, an "Environment" line, the three cost lines from `costText`, "Watch out", school link and `srcLinks`), then "Also worth a look" compact rows (country · school · years · total in S$ · link). The cost footnote says "Costs use rough exchange rates as of " + `FX_ASOF` + ". Singapore's Tuition Grant, TTFS and bursaries don't apply overseas."
- [ ] **Step 5: Wire `youth.html`.** Add the three script tags after `serasi-pathways.js`. In `pathPanel`: under each study step with a `lvl`, append `SerasiLocal.html(r, st.lvl, {esc, money})`; after the price-breakdown note add "Fees differ by school: $lo to $hi a year; the table uses $generic." when `spread(...).differs` for any listed level; replace the "Or study overseas" block with `SerasiOverseas.html(r, {esc, srcLinks, contactList})`; build the contacts list from the best pick and alternatives' `links`. Remove `abroadCalc` and `abroadCard` only if nothing else uses them (Ask Serasi still does, so leave them until Task 22). Add the CSS (`.schools`, `.best-card`, `.best-badge`, `.alt-row`) beside `.abroad` styles, using existing variables.
- [ ] **Step 6: Verify in the browser.** `python3 -m http.server 8000` in the repo; temporarily change `SAMPLE.p.interest` in `youth.html` to `{ R: .7, I: .8, A: .95, S: .2, E: .2, C: .3 }` so design roles rank high (revert before committing); open `http://localhost:8000/youth.html`, **Example**, search "architect", open **Shortest path**. Expected: the local list under the diploma and degree steps, the price table unchanged, the best-place card then runners-up, no console errors; resize to 390 px with no horizontal scroll. Open the **Teacher** role (search "teacher"): agency note, no empty headings.
- [ ] **Step 7:** `node --test test/`, `node scripts/check-links.mjs` pass. **Step 8:** Revert the temporary `SAMPLE` edit. Commit `Show local schools and a best overseas pick on the shortest path`.

### Task 6: Fields — health and care

Fields: `nursing, allied-health, pharmacy, medicine, biomedical, veterinary, earlychild, socialwork`. Follow the **Data task procedure**. Notes: `nursing` and `allied-health`, `pharmacy`, `medicine` carry recognition warnings (Singapore Nursing Board, Allied Health Professions Council, Singapore Medical Council); `medicine` keeps its "place missed locally" framing and lists Duke-NUS locally; ITE nursing and early-childhood courses are listed at level 1.

### Task 7: Fields — design and media

Fields: `interior-design, graphic-ux, fashion, animation, media, translation`. Follow the procedure. Keep the Japan anime/MEXT note on the `animation` option it belongs to. LASALLE, NAFA and the University of the Arts Singapore are local schools here; ITE multimedia, video and photography courses go at level 1.

### Task 8: Fields — tech, engineering and aviation

Fields: `computing, data-ai, cybersecurity, civil-eng, mechanical-eng, electrical-eng, engineering, trades, aero, maritime`. Follow the procedure. `engineering`, `trades` and `aero` are `ite` fields (local courses at level 1 only, no overseas).

### Task 9: Fields — business, law and services

Fields: `business, accounting, finance-risk, islamicfin, logistics, law, hospitality, culinary, aviation, beauty, sport, property`. Follow the procedure. `law` keeps the Ministry of Law recognition warning; `islamicfin` options should reflect Malaysia's lead only if the ranking and environment support it; `culinary`, `aviation`, `beauty`, `sport` and `property` are `ite` fields (level 1 courses only; `property` and `aviation` may have none, which the coverage test allows).

### Task 10: Fields — Islamic studies and agency routes, then coverage

**Files:** extend `serasi-local.js`, `serasi-overseas.js`, `test/overseas.test.js`, `test/local.test.js`.

- [ ] **Step 1:** Add `religious` as a study field (Malaysia, Egypt and others as the research supports; keep the MUIS Asatizah Recognition Scheme warning), and `agency` notes for `teaching, pilot, atc, uniformed, public`. Each note is one or two plain sentences saying the route runs through that agency (MOE and NIE, airline cadet programmes, CAAS, the Home Team and SAF, Careers@Gov) and names the page to read, with its source. Add local courses for these fields where public schools offer them (e.g. NIE diplomas, public-service-relevant diplomas).
- [ ] **Step 2: Add the coverage tests** (they pass only when every field is done):

```js
test('every study field has a best pick and 2-4 alternatives', () => { for (const [k, f] of Object.entries(FIELDS)) if (f.kind === 'study') { const o = O.OPTIONS[k]; assert.ok(o && o.best && o.alts.length >= 2 && o.alts.length <= 4, k); } });
test('every agency field has a note', () => { /* kind agency → typeof OPTIONS[k].agency === 'string' && length > 40 */ });
test('every non-agency field has local courses at the top level its roles need', () => { /* max edu of the field's roles → L.COURSES some course with that lvl and the field */ });
test('every role with edu>=2 resolves to options or an agency note', () => { /* O.forRole(r) !== null */ });
```
Allowed exceptions for the last-but-one test: `aviation, property` (custom routes with no school), and `religious` if the research confirms no public Singapore school offers an Islamic studies diploma or degree. List each in the test with the reason.
- [ ] **Step 3:** `node --test test/`, `node scripts/check-links.mjs` pass. **Step 4:** Commit `Add Islamic studies and agency routes and check full coverage`.

### Task 11: Sector-note schema tests, atlas fixture, and the first four industries

**Files:** Create `test/fixtures/atlas-ids.json`, `test/world-data.test.js`; modify `serasi-pathways.js`.

**Interfaces:** `atlas-ids.json` is `[{id: number, name: string, region: 'africa'|'americas'|'asia'|'europe'|'oceania', inAtlas: boolean}]` for the 174 world-atlas shapes that have an id (`inAtlas: true`; assign region by hand; Middle East, Central Asia and Turkey are `asia`; Russia and Cyprus are `europe`; the Caribbean is `americas`), plus two entries with `inAtlas: false` for places that appear on the map only as city dots: Singapore (702) and Hong Kong (344), both `asia`. Generate the names and ids from `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json`. The `iso` check in the schema test accepts any id in this fixture.

- [ ] **Step 1:** Create the fixture. **Step 2: Failing tests** in `world-data.test.js`:

```js
const DONE = [];                       // industries finished so far; each sector task appends its keys
const SHORT = {};                      // industry → reason it lists fewer than 8 countries
test('every WORLD entry is well formed', () => { /* unique id; numeric iso found in the fixture; ll lon/lat in range; every ind key in INDUSTRY; outlook in grow|steady|decline; text 20–400 chars; ≥1 src key (none needed for public); every src key exists in SOURCES */ });
test('every source is an https link', () => { /* SOURCES values [label, https url] */ });
test('finished industries list enough countries', () => { for (const k of DONE) { const n = new Set(WORLD.filter(h => h.ind[k]).map(h => h.iso)).size; assert.ok(n >= 8 || SHORT[k], k + ' lists ' + n); } });
test('public service stays Singapore-only', () => { /* every hub with ind.public has iso 702 */ });
```
- [ ] **Step 3:** Run it and note which of the existing 39 entries fail (for example notes with an empty source list, such as Shenzhen's BYD note). Fix each by adding a real source or correcting the note, and list the fixes in the hand-over, until the first two tests pass. **Step 4: Research and add notes for `construction, energy, manufacturing, auto`** (see **Sector research procedure** below). **Step 5:** Append the four keys to `DONE` (explain any shortfall in `SHORT`). **Step 6:** Tests and link checker pass; commit `Add sourced job-market notes for construction, energy, manufacturing and auto`.

**Sector research procedure (Tasks 11–14).** For each industry, find countries where 2025–2026 evidence shows hiring growth, steadiness or decline: official statistics and international bodies first (ILO, UNESCO, IRENA, IEA, UNCTAD, World Bank, national statistics offices), industry associations, then established news outlets. Add a note to the country's existing `scope: 'country'` hub, or create `{id, place: '<Country> (nationwide)', country, iso, ll, scope: 'country', ind: {...}}` (`country` must match the name used in `serasi-countries-data.js`; use the English short name as the existing entries do). A note is an outlook, one or two plain sentences with a figure and its year, and source keys. Add each source to `SOURCES`. Mixed evidence is `steady` with the reason. Correct any existing note the research shows to be wrong and list the correction in the hand-over. Aim for about eight to ten countries, spread across regions where the evidence allows.

### Task 12: Sector notes — semiconductors, tech, aerospace, logistics

As Task 11 steps 4–6 for `semis, tech, aero, logistics`. Commit `Add sourced job-market notes for semiconductors, tech, aerospace and logistics`.

### Task 13: Sector notes — finance, Islamic finance, health, biotech

As Task 11 steps 4–6 for `finance, islamic, health, biotech`. Commit `Add sourced job-market notes for finance, Islamic finance, health and biotech`.

### Task 14: Sector notes — care, hospitality, creative, education

As Task 11 steps 4–6 for `care, hospitality, creative, education`. `public` is deliberately excluded (Singapore only). Commit `Add sourced job-market notes for care, hospitality, creative and education`.

### Task 15: Country list and profile logic

**Files:** Create `serasi-countries.js`, `test/countries.test.js` (logic tests with synthetic data).

**Interfaces:**
- Consumes: `SerasiPathways.{WORLD, INDUSTRY, OUTLOOK, SOURCES}`, `SerasiCountryData.byIso` (Task 16), `SerasiCore.esc`.
- Produces: `window.SerasiCountries = { profileFor(iso): Profile|null, flagUrl(a2): string, figureText(fig, kind: 'people'|'usd'): string, countryOutlook(iso, k, world?): 'grow'|'steady'|'decline'|null, countryNotes(iso, world?): {k, place, o}[], sectorList(k, world?, byIso?): {grow, steady, decline, rest}, listHtml(k, h, world?, byIso?): string, profileHtml(iso, k, h, world?, byIso?): string }`. `sectorList` items are `{iso, name, outlook?, notes: {place, text}[]}`; the three outlook groups hold countries with a note for `k`, `rest` the other countries in `byIso` alphabetically. `countryOutlook` is the logic now inside `youth.html` (nationwide note wins; else the cities' shared outlook; else `steady`). `h = {esc, srcLinks}`.

- [ ] **Step 1: Failing tests** with a synthetic `world`/`byIso` (Alpha nationwide tech `grow`; Beta two cities, tech `grow` and `decline`; Gamma finance only; Delta no notes): `sectorList('tech')` puts Alpha in `grow`, Beta in `steady` with two notes, `rest` is Delta then Gamma; `countryOutlook(2, 'tech')` → `'steady'`; `figureText({v: 51684564, yr: 2025}, 'people')` → `'about 52 million (2025)'`; `figureText({v: 1.9e12, yr: 2024}, 'usd')` → `'about US$1.9 trillion (2024)'`; `figureText({v: null, why: 'x'}, 'usd')` → `'not available'` (Review Focus 5); `flagUrl('KR')` → `'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/kr.svg'`; `profileHtml(undefined, 'tech', h)` and `profileHtml(9999, ...)` contain "No profile yet" and no "undefined" (Review Focus 2); a full profile contains the flag as `<img class="flag" src="<flagUrl>" alt="<country name>">`, the name, the sector note, the four figures, known-for, facts, organisations, institutions ("main national university" when no `rank`), and the source line including "compiled by Serasi".
- [ ] **Step 2:** FAIL. **Step 3:** Implement. `listHtml`: three outlook groups of `<button class="country-btn" data-action="country" data-iso>` rows (name, outlook pill, first note's text), then `<details class="country-rest">` "All other countries (A to Z)". `profileHtml` order per the spec (flag and name; sector outlook and note; figures table; Known for; Facts; Notable organisations and brands; Top-rated institutions with "QS <edition>: <rank>th" or "main national university"; other sector notes including cities; source line with World Bank year and QS edition; "Back to the list" button `data-action="world-clear"`).
- [ ] **Step 4:** PASS. **Step 5:** Commit `Add country list and profile logic`.

### Task 16: Country data builder and Asia

**Files:** Create `scripts/build-countries.mjs`, `scripts/countries/_meta.json`, `scripts/countries/asia.json`, `serasi-countries-data.js` (generated); extend `test/countries.test.js`.

**Interfaces:**
- `scripts/countries/<region>.json` is an array of `{iso: number, name: string, a2: string, langs: string[], known: string[], facts: string[], orgs: string[], unis: {n: string, rank?: number, url?: string}[], fallback?: {pop?: Figure, gdp?: Figure, gdppc?: Figure}}`. `_meta.json` is `{qsEdition: string, qsUrl: string}`.
- `node scripts/build-countries.mjs` reads every region file, fetches population (`SP.POP.TOTL`), GDP (`NY.GDP.MKTP.CD`) and GDP per person (`NY.GDP.PCAP.CD`) from the World Bank API with `mrnev=1` in three bulk calls, and writes `serasi-countries-data.js`: `window.SerasiCountryData = {asof, qs: {edition, url}, wb: {url: 'https://data.worldbank.org/'}, byIso: {[iso]: {name, a2, langs, pop, gdp, gdppc, known, facts, orgs, unis}}}` with `Figure = {v: number, yr: number, src?: string} | {v: null, why: string}`. `fallback` wins over the World Bank value; a missing figure with no fallback becomes `{v: null, why: 'No figure in the World Bank data'}`. The file begins with a "generated, do not edit" comment.

- [ ] **Step 1: Failing tests** in `countries.test.js` (load all scripts):

```js
const DONE_REGIONS = [];   // each region task appends its region
const fixture = require('./fixtures/atlas-ids.json');
test('every atlas country in a finished region has a complete profile', () => {
  for (const c of fixture.filter(c => DONE_REGIONS.includes(c.region))) {
    const p = D.byIso[c.id]; assert.ok(p, c.name);
    assert.match(p.a2, /^[A-Z]{2}$/); assert.ok(p.langs.length >= 1 && p.known.length >= 2 && p.facts.length >= 2 && p.orgs.length >= 2 && p.unis.length >= 1, c.name);   // 3–6 organisations where they exist; small countries may have two
    for (const f of [p.pop, p.gdp, p.gdppc]) assert.ok((f.v > 0 && f.yr >= 2018 && f.yr <= 2026) || (f.v === null && f.why), c.name);
  }
});
test('flag codes are unique', () => { /* no a2 repeated */ });
test('every WORLD country and iso match a profile name', () => { /* for DONE regions only: WORLD hubs whose iso is in a done region have byIso[iso].name === hub.country */ });
test('ranked institutions carry integer ranks', () => { /* rank, when present, is a positive integer */ });
```
- [ ] **Step 2:** FAIL. **Step 3:** Implement the builder; fill `_meta.json` after confirming the latest QS edition on topuniversities.com. **Step 4: Research and write `asia.json`** for every `asia` fixture country: official/main languages; 2–4 "known for"; 2–4 plain facts; 3–6 notable organisations, brands or companies (a main export, national airline, bank or institution for small countries, whichever is true); institutions from the QS table (rank if listed; else the main national university, no rank). Use `fallback` for Taiwan and any territory the World Bank omits, citing the IMF or national statistics office in `src`. **Step 5:** Run the builder, then `node --test test/` (append `'asia'` to `DONE_REGIONS`) and `node scripts/check-links.mjs --only jsdelivr`. **Step 6:** Commit `Add the country data builder and Asian country profiles`.

### Task 17: Country profiles — Europe

As Task 16 steps 4–6 for the `europe` region (`scripts/countries/europe.json`); append `'europe'` to `DONE_REGIONS`. Commit `Add European country profiles`.

### Task 18: Country profiles — Africa

As Task 16 steps 4–6 for `africa`. Commit `Add African country profiles`.

### Task 19: Country profiles — Americas

As Task 16 steps 4–6 for `americas`. Commit `Add country profiles for the Americas`.

### Task 20: Country profiles — Oceania, and full coverage

As Task 16 steps 4–6 for `oceania`; append `'oceania'`. With all five regions done the coverage test now covers every fixture country. Also add a test that every `WORLD` hub's `iso` has a profile and its `country` equals the profile's `name` (fix whichever side is wrong). Commit `Add Oceania country profiles and check full coverage`.

### Task 21: World map UI

**Files:** Modify `youth.html` (world code from `/* ---------- World map ---------- */` to `selectPlace`, click handlers ~2759–2772, CSS ~662–705, and two new script tags for `serasi-countries-data.js` then `serasi-countries.js` after `serasi-overseas.js`); modify `.github/workflows/pages.yml` to copy both files.

**Behaviour to build:**
- Remove the region buttons (`.globe-ctrl`, `TURN`, the `globe-turn` action), the `#hub-cols` section and `renderHubCols`. Keep the colour legend and the drag hint; update the hint to "Drag to turn the globe. Tap a country to see its profile."
- `state.world = {ind, sel: number|null, selHub: string|null, selName: string}`. The side panel (`#hub-detail`, rename to `#world-panel`, `aria-live="polite"`) shows `SerasiCountries.listHtml(ind, h)` when `sel` is null, else `profileHtml(sel, ind, h)`. Tapping a sector chip sets `sel: null`, repaints the globe colours and renders the list; it never calls `turnTo`.
- `selectCountry(iso, {hub, name})`: sets state, repaints (`paintGlobe`), renders the panel, then spins with `turnTo(faceFor(iso, hub))` and brings the panel into view on narrow screens. `data-action="country"` buttons and globe country shapes call it; a city dot calls it with `hub` and spins to that city's `ll`. A shape with no id calls it with `iso: undefined` and `name`, showing "No profile yet". Replace the `'c:'`/`'h:'` selection strings; `countryOutlook` now comes from `SerasiCountries`.
- `faceFor(iso, hub): [lon, lat]|null` returns the rotation to centre the target: the hub's `ll` if given, else the centroid of the country's largest polygon (for a `MultiPolygon`, the polygon with the largest `d3.geoArea`), latitude clamped to ±60; for a country with no shape on the globe (Singapore, Hong Kong) the `ll` of its first `WORLD` hub. It returns `null` if the globe isn't built, and `selectCountry` then skips the spin. Skip the spin when the target is already within 0.05 rad of the centre. Reduced-motion still jumps (existing `turnTo`).
- Add a capture-phase `error` listener on `document` that removes any failed `img.flag`.
- CSS: `.flag` (fixed 32×24 px, `object-fit: cover`, rounded, 1px border), `.country-btn`, `.country-rest`, `.profile-table`; the list buttons are at least 44 px high; nothing overflows at 390 px.

- [ ] **Step 1:** Implement the above. **Step 2: Verify in the browser** (`python3 -m http.server 8000`, `http://localhost:8000/youth.html#world`): tap each of several sector chips: the globe does not move and the list shows grouped countries then the collapsed A–Z; choose a country from the list: the globe spins and the profile opens with flag, figures, known-for, facts, organisations and institutions; tap the same country on the globe: it spins (or stays if centred) and opens its profile; tap a country that is far from the centre (for example choose Brazil, then tap Norway): the globe turns the short way; tap a city dot: spins to the city and opens its country; tap the grey shapes with no profile (Kosovo): name and "No profile yet", no console errors; "Back to the list" returns to the list; drag only turns the globe; keyboard: Tab to a country button, Enter selects. **Step 3:** At 390 px wide there is no horizontal scroll and the profile appears under the globe. **Step 4:** Block `cdnjs.cloudflare.com` (DevTools, Network, Block request URL) and reload: the globe shows its failure message, the list still works, choosing a country opens its profile with no spin and no console error. **Step 5:** Commit `Rebuild the world map around a country list and country profiles`.

### Task 22: Ask Serasi and removal of the old overseas data

**Files:** Modify `serasi-overseas.js`, `test/overseas.test.js`, `youth.html` (`COUNTRY_ABROAD` ~1399, `abroadLines`/`askAbroad` ~1736–1756, `askProfile` `study_overseas` ~2056–2061, the comparison line ~1704, the shortest-path chat line ~1685, the `abroad` intent patterns ~1459), `serasi-pathways.js` (delete `ABROAD`, every `abroad:` key in `TRACKS`, and their exports; keep `FX`).

**Interfaces:**
- Produces: `SerasiOverseas.forCountry(country, role?): Option[]` (every option, best and alternatives, in that country across fields; options from the role's field first); `SerasiOverseas.summaryFor(role): string` (`''` when `forRole` is null; otherwise `"<country>, <school>: <total as 'about $lo–hi for N years'>. Watch out: <watch>"`; agency roles return their note).

- [ ] **Step 1: Failing tests:**

```js
test('summaryFor names the best pick and stays short', () => { const s = O.summaryFor(ROLE.arch); assert.ok(s.startsWith(O.OPTIONS.architecture.best.country)); assert.ok(s.length <= 450); });
test('every role summary is at most 450 characters', () => { for (const r of ROLES) assert.ok(O.summaryFor(r).length <= 450, r.id); });
test('summaryFor is empty for ITE-level roles', () => assert.equal(O.summaryFor(ROLE.electrician), ''));
test('forCountry lists a country\'s options, the role\'s field first', () => { const r = O.forRole(ROLE.arch); const list = O.forCountry(r.best.country, ROLE.arch); assert.equal(list[0], r.best); assert.ok(list.every(o => o.country === r.best.country)); });
test('forCountry returns [] for a country with no options', () => assert.deepEqual(O.forCountry('Nowhere'), []));
```
- [ ] **Step 2:** FAIL. **Step 3:** Implement. **Step 4: Update `youth.html`.** `askAbroad(country, s, p)` uses `forCountry`/`forRole`/`costText` in the same plain chat style as `abroadLines`; with a role and no country it states the best pick and the alternatives; with neither, it gives a short generic answer that names the best pick for the youth's top job if there is one, else asks them to name a job (e.g. "Where is the best place to study architecture?"). Add "best (place|country) to study" to the `abroad` intent patterns. `askProfile`'s `study_overseas` becomes `summaryFor(s.role)` as a one-element array (empty array when `''`). The chat line at ~1704 compares with the best pick's total. Delete `COUNTRY_ABROAD`, `abroadCalc`, `abroadCard`, `curFmt` and `range` if nothing else uses them, `ABROAD` from the destructuring, and the old data.
- [ ] **Step 5:** `node --test test/`; `cd worker && node --test` (Worker tests still pass). **Step 6: Verify in the browser:** ask "Should I study architecture overseas?", "Is Japan good for tech?" and "What does it cost to study in Germany?" with the AI path unreachable (the default when opened from `localhost` without a Worker): each answers from the new data, with S$ totals and a watch-out, no "undefined". Temporarily add `console.log(JSON.stringify(askProfile()).length)` at the top of `askAI`, ask any question, and confirm the logged length is under 14,000 for the example profile; remove the log. **Step 7:** Commit `Use the new overseas data in Ask Serasi and remove the old fixed list`.

### Task 23: Documentation, publishing and final verification

**Files:** Modify `README.md`, `.github/workflows/pages.yml`, `.gitignore`.

- [ ] **Step 1:** `.gitignore` gains `.superpowers/`. Confirm `pages.yml` copies all five new scripts (`serasi-study.js`, `serasi-local.js`, `serasi-overseas.js`, `serasi-countries-data.js`, `serasi-countries.js`) alongside the existing files, and that a page served from `_site/` alone loads (check the `cp` line against the `<script src>` tags in `youth.html`).
- [ ] **Step 2: Update `README.md`:** the file list (new scripts, `scripts/`, `test/`); the **Shortest path** bullet (every local school; a best overseas pick with alternatives, costs in S$, no longer "Australia, the UK, Germany, Japan, Malaysia, Egypt"); the **World map** bullet (sector list, country profiles with flag, spinning from the list or the globe, all the countries); **Keeping the data current** (new data, the World Bank rebuild command `node scripts/build-countries.mjs`, the link checker, the QS and exchange-rate review each year); a **Run the tests** line (`node --test test/`, and the Worker's `cd worker && node --test`).
- [ ] **Step 3: Full verification.** `node --test test/` and `cd worker && node --test` pass; `node scripts/check-links.mjs` has no `FAIL` lines (review the `CHECK-BY-HAND` list); in the browser walk the spec's "How we will know it works" items 1–7, at desktop width, at 390 px, and with `cdnjs.cloudflare.com` blocked. Count countries per industry and confirm each (except public service) meets the target or is documented in `SHORT`.
- [ ] **Step 4:** Commit `Document the new study options and country profiles`.
