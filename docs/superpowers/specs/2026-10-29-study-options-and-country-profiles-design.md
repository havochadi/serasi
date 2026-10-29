# Local and overseas study options, and country profiles on the world map: design

Date: 2026-10-29. Status: approved in chat; builder check done; updated with the user's answers on sector research, spinning from the globe, and flags; awaiting final read.

## Why

Two parts of the youth app (`youth.html`) are too thin for the decisions they are meant to help with.

1. **Shortest path.** Each role's tab names one local course per level and offers only a fixed pair of overseas options. For most roles that pair is Malaysia and Germany, whether or not they suit the field. An Architectural designer, for example, is shown UK design and Japan anime. A youth cannot see every local school that teaches the course, and gets no advice on where in the world the course is best taught.
2. **World map.** Tapping an industry changes the colours on the globe and the "places by outlook" lists, and some buttons spin the globe without a country being chosen. The map has job-market notes for only about 20 places, and says nothing about the countries themselves.

The aim is for a Malay youth in Singapore to see, for any role, every local route with its cost, and one clear recommendation of where to study abroad if they go, and to explore the countries behind the job-market notes.

## What the user decided

- **Local options:** list *all* local options for each role.
- **Overseas:** pick a *best place* per field, not a fixed pair. "Best" means the standing of the schools there and the environment the student would be exposed to. Example given: for architecture, somewhere in Europe. It does not mean cheapest. Fees, duration, total cost and links to read more must all be shown.
- **Layout (chosen from mockups):** one prominent "best place to study this" card, with the reasons, environment note, cost and watch-outs, then a short list of runner-up countries beneath it, each with school and total cost.
- **World map:**
  - Tapping a sector (an industry chip) shows a list of countries for that sector. The globe does not move.
  - The globe spins to a country only when a country is chosen: from that list, or (a later change by the user) by tapping it on the globe. Tapping a sector never spins it.
  - The profile shows the country's flag.
  - A chosen country opens a profile: population, language, what it is known for, GDP, GDP per person, some facts, its most notable organisations, brands and companies, and its top-rated institutions.
  - As many countries as possible should have these facts, ideally every country on the globe.
- **Confirmed in chat ("yes"):** the guesses listed under *Decisions made with the user* below.
- **The research is part of the work.** Asked whether each sector's country list should use only the job-market notes already in the app (about 20 places) or whether new sourced notes should be researched so each sector lists many more countries, the user said: "I need you to do the research as well." So the builder researches and adds new sourced sector notes, and also does all the other research below (local courses and fees, overseas schools and costs, country data). The user supplies no data.

## Goals

1. Every role that currently offers the overseas panel (`edu >= 2`) shows a best place to study abroad plus about three alternatives, or a plain explanation when overseas study doesn't apply.
2. Every role lists every public local school offering the relevant course at each level, with years, yearly fee and a link to the course page.
3. Every country on the globe that has a standard numeric ISO code has a profile with all the facts above, or states plainly what is not available.
4. Each number has a year and a source link. Anything written from general knowledge, and not individually sourced, says so on the page.
5. Ask Serasi (the Gemini path and the on-device fallback) keeps working and uses the new data.
6. Each of the 17 industries lists many more countries than it does now, each with a researched, sourced note on whether the industry is growing, steady or shrinking there. The aim is about eight to ten countries per industry wherever the evidence exists. Where it doesn't, the list is shorter; it is never padded. The exception is "Public service and security", which stays Singapore-only because those jobs are Singapore jobs.

## Non-goals

- Private education institutions in Singapore (their fees and recognition vary, and the MOE Tuition Grant, TTFS and bursaries don't apply).
- Overseas options for ITE-level roles (the panel stays limited to `edu >= 2`).
- Scoring or ranking countries on halal food, prayer spaces or Muslim community. A note may mention it where it matters; it doesn't affect the best pick.
- Changes to the quiz, scoring, the MENDAKI staff page, or how TTFS, bursaries and the ITE Progression Award are calculated.
- Visa and immigration guides beyond the existing "check visa rules" notes and the visa financial-proof figure already used.
- A build step or backend. The site stays plain HTML and scripts on GitHub Pages.

## Anti-goals (a failure even if it technically works)

- Showing a fee, ranking, population or GDP figure with no year or source, or inventing one to fill a gap.
- Picking the best place by cost alone, or picking the same two countries for everything.
- The globe moving when a sector is tapped.
- Claiming a job-market outlook ("growing", "shrinking") for a country with no checked note. Countries without a note for a sector say so.
- A new sector note that has no source, rests on a source older than about two years without saying so, or is written to make a list longer.
- Dropping the warnings that Singapore must recognise an overseas degree (architects, nurses, allied health, doctors, lawyers, teachers, Islamic scholars).
- Breaking the on-device Ask Serasi fallback or exceeding the Worker's 16,000-character limit.

## Decisions made with the user

(These are the user's, as confirmed in chat.)

| Topic | Decision |
|---|---|
| Overseas layout | A: one "best pick" card, then a short list of runner-ups. |
| How "best" is chosen | School standing for the field first. Cost is shown and used to break ties, not to decide. Environment is a short written note per option, not a score. |
| Coverage of overseas advice | All 29 study tracks, finer where a track mixes fields (see below), each with one best pick and about three alternatives. |
| Recognition warnings | Kept. |
| Sector notes | Research and add new sourced notes so each sector lists many more countries (see goal 6). Not limited to the existing notes. |
| Country list for a sector | Countries with a checked note for that sector first, grouped Growing, Steady or mixed, Shrinking. Below them, a collapsed "All other countries (A to Z)". |
| Countries with no note for the sector | Still open a full profile, and say there is no checked note for this sector. |
| Region buttons (Asia, Europe, Americas, Australia) | Removed, so the globe turns only from a country choice. |
| Tapping a country on the globe | Spins the globe to show the country and opens its profile (the user's change; earlier draft did not spin). |
| Flags | Each profile shows the country's flag, as an image (not emoji, which don't render on Windows). |
| Coverage of profiles | Every country on the globe, about 175. |
| Numbers | Population, GDP and GDP per person from the World Bank, showing the year and linking to the source. |
| Institutions | From the QS World University Rankings. |
| Hand-written parts | "Known for", facts and notable organisations are written by Serasi and are not individually sourced. |

## Design

### 1. Shortest path: study in Singapore

For each level the role's route involves (ITE, polytechnic, university), replace the single course line with a list. Each entry shows the school, the course name, years, the yearly fee for a Singapore Citizen after the MOE Tuition Grant, and a link to the course page.

"Every local school" means every publicly funded institution that offers a matching course: ITE, the five polytechnics, the autonomous universities (NUS, NTU, SMU, SUTD, SIT, SUSS) and the arts institutions (LASALLE, NAFA, the University of the Arts Singapore). It includes part-time and work-study routes where the school publishes them. Courses are matched to the role, so a role gets only the courses that lead to it.

The price breakdown table, income-band selector and help-with-costs sections stay as they are. Where a listed school's fee differs from the generic fee the table uses, the table shows the range and a note says so.

### 2. Shortest path: study overseas

Overseas advice is keyed by *field*, not track, because one track mixes fields (the `design` track covers architecture, graphic design, games and animation). Each role maps to a field, falling back to its track's default. The builder decides the exact field list; it must cover every role with `edu >= 2`.

Each field has:

- `best`: one country and school (or schools), with why it ranks first, an environment note, the cost, what to watch for, and links.
- `alts`: about three more countries, each with school, cost and links.
- A recognition warning where Singapore regulates the profession.

Layout is the approved A: a highlighted "best place to study this" card, then the runners-up as compact rows with school and total cost.

**Cost per option:** tuition a year × years, plus living costs a year × years, plus any one-off fees, converted to Singapore dollars at the app's rough exchange rates and shown as "about". Show duration and the whole-course total. Living costs use the official visa financial-proof figure where there is one, otherwise a stated estimate from a cited source. When a profession needs a longer path than the first degree (for example a bachelor's plus a master's for architects), the duration and total cover what is needed to qualify, and say so.

**School standing** comes from the latest QS World University Rankings by Subject at build time, named with its edition. "Best" is a judgement from that evidence plus the environment note, written down with its reasoning, not computed at run time.

**Roles tied to Singapore agencies** (SAF, police, civil defence, MOE teacher training, public service) show a short note that the route runs through those agencies, instead of an overseas panel.

Existing scholarship notes (for example MEXT) stay, shown on the option they belong to.

### 3. World map

**Flow.** Tapping an industry chip updates the list of countries for it. The globe does not move. Choosing a country in the list selects it, spins the globe to face it (respecting reduced-motion, as `turnTo` already does), and opens its profile in the side panel, with a link back to the list. Tapping a country on the globe does the same: it selects the country, spins the globe so the country is centred, and opens the profile. Tapping a city dot selects its country and spins to that city. A drag on the globe still only turns it. For a country made of far-apart parts (the US, France, Russia, Norway and similar), the globe faces its main landmass. If the country is already centred, the spin is skipped. The existing "places by outlook" columns are replaced by the country list: cities fold into their country, and city notes appear in that country's profile.

**Country list.** Rows are buttons showing the country name, an outlook pill and the one-line note for the chosen sector. Countries with notes come first, grouped by outlook. Below, the rest in alphabetical order, collapsed by default. On a phone the list sits below the globe and choosing a country brings the profile into view.

**Country profile.** In order:

1. Flag and name, and the outlook for the chosen sector with its note, if any.
2. A table: population, main languages, GDP, GDP per person, each with its year.
3. Known for.
4. A few facts.
5. Notable organisations, brands and companies.
6. Top-rated institutions, with rank and edition where ranked.
7. Other sector notes already on the map for this country, including its cities.
8. Source line: the World Bank (with the year) and QS (with the edition). A short line says the other details were compiled by Serasi from general knowledge, not individually sourced.

**Data.** Static data checked into the repo; nothing fetched at run time.

- Key: the numeric ISO 3166 code, which is the globe's `d.id`.
- The globe has 177 shapes. Three (N. Cyprus, Somaliland, Kosovo) have no code and cannot be matched; they keep their name and a plain "no profile yet" message.
- Population, GDP and GDP per person come from the World Bank API (reachable; the most recent value with its year). Where the World Bank has no figure (Taiwan, and any territory it omits), use the IMF or the territory's statistics office, cite it, and show that source for that country. If no figure can be found, say "not available" and do not estimate.
- Languages: official or main languages.
- Flags: an image per country, loaded from the open-source flag-icons set on jsDelivr (a pinned version, the same host the world-atlas shapes already use), keyed by the country's two-letter ISO code. The data stores that code for each country. The image has the country's name as its alt text and sits at a fixed size so the panel doesn't jump. If it fails to load, the profile still shows the name. Check that every code resolves to a flag, including Taiwan, Kosovo and Hong Kong.
- Institutions: from QS. For a country with no QS-ranked institution, name its main national university, labelled "main national university", with no rank claim.
- Notable organisations: three to six per country. For small countries they may be a main export, national airline, bank, or a well-known institution, whichever is true.
- The country data may be loaded when the world view first opens, since it is large.

**New sector notes.** Same shape as the existing `WORLD` entries: an outlook (grow, steady or decline), one or two plain sentences with a figure and its year, and one or more source keys added to `SOURCES`. Most new notes are country-wide (`scope: 'country'`); a city entry is added only where a city is the story. Sources are government statistics offices, international bodies (ILO, UNESCO, IRENA, UNCTAD, World Bank, IEA and similar), industry associations, and established news outlets, from 2025 or 2026 wherever possible. Where the best evidence is older, the note says its year. Every source link must return a page. Mixed evidence is "steady or mixed", with the reason. The existing notes stay unless the research finds them wrong, in which case they are corrected and the correction is mentioned in the hand-over.

### 4. Ask Serasi

- The on-device overseas answers (`askAbroad`, `COUNTRY_ABROAD`, `abroadLines`) use the new best-pick data. "Should I study X overseas?" names the best pick for the role's field and the alternatives, with costs.
- The Gemini payload's `study_overseas` for each of the top three jobs carries the best pick (country, school, total cost, watch-out) and stays well inside the 16,000-character limit.
- The on-device fallback answers a question about a country (for example "what is Japan known for?") from the profile data if it can; this is optional and is not required for the work to count as done.

### 5. Housekeeping

- Any new script is added to `.github/workflows/pages.yml`, which lists published files explicitly.
- `README.md` is updated: the file list, the shortest-path and world-map descriptions (which still say "Australia, the UK, Germany, Japan, Malaysia, Egypt"), and the "Keeping the data current" section, which gains the new data and the review cycle.
- `.superpowers/` is added to `.gitignore`.

## Constraints

- No build step. Plain scripts loaded by the pages, as now.
- Matches the existing code and style of `youth.html` and `serasi-pathways.js`, including escaping with `esc`, the `srcLinks` pattern for sources, and keyboard-operable buttons.
- Works on a phone: no horizontal scroll, controls reachable, the globe still draggable.
- If the globe libraries fail to load, the country list and profiles still work (the current lists already do).
- Today's date is 2026-10-29. Data is described as "checked October 2026" only if it has been checked in this work.
- The Worker's 16,000-character limit on Ask Serasi's payload.

## Decisions left to the builder

- The list of fields for overseas advice, and which field each of the 93 roles uses.
- Which local courses match which roles, and how fees are reconciled with the table (within the rule above).
- File layout: whether the data lives in `serasi-pathways.js` or in new files.
- Wording of every note, matched to the existing plain, short style.
- Styling of the best-pick card, country list and profile, following the existing look.
- Whether the country data loads at start or on first use.

## My calls (for the user to check)

- "All local options" means publicly funded institutions only. Private schools are out of scope.
- Roles tied to Singapore agencies get a note in place of an overseas panel.
- Countries with no QS-ranked university show "main national university" with no rank claim.
- The "best" pick is a written judgement from subject rankings plus the environment, with its reasoning shown.
- Where the World Bank has no figure, a named alternative source is used, or the field says "not available".
- Exchange rates stay rough, and are dated on the page.
- Flags are images from flag-icons, not emoji.
- Tapping a city dot spins to the city rather than to the middle of its country.

## How we will know it works

1. Open the Architectural designer role. The Singapore section lists the polytechnic and university courses that lead to it. The overseas section opens with a best-place card in a country with a leading architecture school, and about three alternatives, each with tuition, years, total in S$ and links.
2. Every role with `edu >= 2` shows a best pick with alternatives, or an agency-route note. No role still shows only Malaysia and Germany by default.
3. In the world map, tapping a sector never moves the globe. Choosing a country from the list, or tapping it on the globe, spins the globe to it and opens its profile with its flag. Choosing from the A-to-Z list works the same way. Dragging the globe only turns it.
4. A script finds no country with a numeric code lacking population, language, GDP, GDP per person, known-for, facts, organisations and institutions (or an explicit "not available" for the numbers), and every link in the new data returns a page.
5. Ask Serasi answers "should I study architecture overseas?" with the best pick, on the AI path and the on-device path, and the payload is under 16,000 characters.
6. The pages work on a narrow phone screen, and with the globe libraries blocked.
7. Open each of the 17 industries on the world map. Every one except public service lists the target number of countries, or fewer with a stated reason, and every note has a source link that returns a page.
