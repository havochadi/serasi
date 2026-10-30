/* Serasi country list and country profiles on the world map: which countries have notes for an industry, how a country's outlook is
   worked out, and the HTML for the list and for one country's profile. Logic only; the page decides where the HTML goes.
   Load it after serasi-pathways.js (it reads WORLD, INDUSTRY and OUTLOOK from SerasiPathways when called). The country data,
   SerasiCountryData, is loaded separately and may arrive late: until it does, every country simply has no profile yet.
   SerasiCountryData is { asof, qs: { edition, url }, wb: { url }, byIso: { [numeric ISO 3166 code]: country } }, where a country is
   { name, a2, langs, pop, gdp, gdppc, known, facts, orgs, unis }. pop, gdp and gdppc are figures: { v: number, yr: number, src?: string,
   srcUrl?: string } (src is the NAME of the source when it is not the World Bank, srcUrl an optional https link for it; a srcUrl with
   no src is ignored) or { v: null, why: string }. yr is a four-digit year. unis are { n, rank?, url? }; a university with no rank key
   is shown as the country's main national university, with no rank claim; a rank that is present but not usable (0, 1.5, a blank)
   shows no rank and no claim. Links are made only for http(s) URLs; anything else is shown as plain text.
   Every function that reads the world map or the country data takes it as an optional argument and falls back to the page's own, so
   tests can pass small made-up data. h = { esc, srcLinks }, the page's helpers. */
(function () {
  'use strict';

  const FLAG_BASE = 'https://cdn.jsdelivr.net/npm/flag-icons@7.2.3/flags/4x3/';
  const GROUPS = ['grow', 'steady', 'decline'];
  const NOT_AVAILABLE = 'not available';
  // Scales for people and dollar figures, largest first.
  const SCALES = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million']];

  const worldOf = world => world || window.SerasiPathways.WORLD;
  const dataOf = opts => (opts && opts.data) || window.SerasiCountryData || {};
  const byIsoOf = (byIso, data) => byIso || (data || window.SerasiCountryData || {}).byIso || {};
  const outlookLabel = o => (window.SerasiPathways.OUTLOOK || {})[o] || String(o);
  const industryLabel = k => { const x = window.SerasiPathways.INDUSTRY[k]; return x ? x.label : String(k); };
  const httpUrl = u => typeof u === 'string' && /^https?:\/\//.test(u);
  // A link when the URL is http(s); otherwise the text alone.
  const linkTo = (url, text, esc) => httpUrl(url) ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(text) + '</a>' : esc(text);
  // The name of the source a figure gives when it is not the World Bank's, or ''.
  const srcName = fig => (fig && typeof fig.src === 'string' ? fig.src.trim() : '');
  const strings = x => (Array.isArray(x) ? x : typeof x === 'string' ? [x] : []).filter(s => typeof s === 'string' && s.trim());

  // The numeric ISO code as a number, or NaN for a missing or unusable one (a globe shape with no id).
  function isoNum(iso) {
    if (iso == null || iso === '' || typeof iso === 'boolean') return NaN;
    const n = Number(iso);
    return Number.isInteger(n) ? n : NaN;
  }

  const hubsOf = (iso, world) => { const n = isoNum(iso); return worldOf(world).filter(hub => Number(hub.iso) === n); };

  // Every note the map holds for a country, its nationwide hubs first and then its cities in map order. city is true for a note that
  // belongs to one place rather than the whole country, so the page can name the place.
  function noteList(iso, world) {
    const hubs = hubsOf(iso, world);
    const out = [];
    hubs.filter(hub => hub.scope === 'country').concat(hubs.filter(hub => hub.scope !== 'country')).forEach(hub =>
      Object.entries(hub.ind || {}).forEach(([k, o]) => out.push({ k, place: hub.place, o, city: hub.scope !== 'country' && hub.place !== hub.country })));
    return out;
  }

  function countryNotes(iso, world) {
    return noteList(iso, world).map(n => ({ k: n.k, place: n.place, o: n.o }));
  }

  // A country's colour for one industry: its nationwide note if it has one, else its cities' shared outlook, else "steady" when its
  // cities differ. null when the map has no note for it in this industry.
  function countryOutlook(iso, k, world) {
    const hs = hubsOf(iso, world).filter(hub => hub.ind && hub.ind[k]);
    if (!hs.length) return null;
    const nation = hs.find(hub => hub.scope === 'country');
    if (nation) return nation.ind[k][0];
    const set = hs.map(hub => hub.ind[k][0]).filter((o, i, all) => all.indexOf(o) === i);
    return set.length === 1 ? set[0] : 'steady';
  }

  function profileFor(iso, byIso) {
    const n = isoNum(iso);
    if (Number.isNaN(n)) return null;
    const all = byIsoOf(byIso), key = String(n);
    return Object.prototype.hasOwnProperty.call(all, key) && all[key] && typeof all[key] === 'object' ? all[key] : null;
  }

  const flagUrl = a2 => (typeof a2 === 'string' && /^[A-Za-z]{2}$/.test(a2) ? FLAG_BASE + a2.toLowerCase() + '.svg' : '');

  /* ---------- Figures ---------- */
  const commas = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sig3 = v => { const step = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 2)); return Math.round(v / step) * step; };
  const scaled = x => (x < 10 ? Math.round(x * 10) / 10 : Math.round(x));

  // 51,684,564 -> "52 million"; 1.9e12 -> "1.9 trillion"; 33,121 -> "33,100". A figure that rounds up to 1,000 moves to the next scale.
  function compact(v) {
    const small = sig3(v);
    if (small < 1e6) return commas(small);
    let i = SCALES.length - 1;
    while (i > 0 && v >= SCALES[i - 1][0]) i--;
    let n = scaled(v / SCALES[i][0]);
    if (n >= 1000 && i > 0) { i--; n = scaled(v / SCALES[i][0]); }
    return n + ' ' + SCALES[i][1];
  }

  // A figure that can be shown: a number of at least 1 and a four-digit year. Anything else reads "not available", never NaN, 0 or a bare number.
  const usable = fig => !!fig && typeof fig.v === 'number' && Number.isFinite(fig.v) && fig.v >= 1 && /^\d{4}$/.test(String(fig.yr));

  function figureText(fig, kind) {
    if (kind !== 'people' && kind !== 'usd') throw new Error('figureText: kind must be "people" or "usd", not ' + kind);
    if (!usable(fig)) return NOT_AVAILABLE;
    return 'about ' + (kind === 'usd' ? 'US$' : '') + compact(fig.v) + ' (' + fig.yr + ')';
  }

  const ordinal = n => { const t = n % 100; return n + (t >= 11 && t <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th')); };

  /* ---------- The country list ---------- */
  // The three outlook groups hold every country that has a note for the sector, A to Z, whether or not byIso has a profile for it (one
  // without opens to "No profile yet" and its notes). rest holds the other countries in byIso, A to Z.
  function sectorList(k, world, byIso) {
    const W = worldOf(world), all = byIsoOf(byIso);
    const out = { grow: [], steady: [], decline: [], rest: [] };
    const keys = Object.keys(all);
    W.forEach(hub => { const n = isoNum(hub.iso); if (!Number.isNaN(n) && hub.ind && hub.ind[k] && !keys.includes(String(n))) keys.push(String(n)); });
    keys.forEach(key => {
      const n = isoNum(key), iso = Number.isNaN(n) ? key : n;
      const rec = (Object.prototype.hasOwnProperty.call(all, key) && all[key]) || {};
      const hubs = hubsOf(iso, W);
      const name = String(rec.name || (hubs[0] && hubs[0].country) || key);
      const notes = noteList(iso, W).filter(x => x.k === k).map(x => ({ place: x.place, text: x.o[1], city: x.city }));
      if (!notes.length) { out.rest.push({ iso, name, notes }); return; }
      const outlook = countryOutlook(iso, k, W);
      if (!GROUPS.includes(outlook)) throw new Error('Unknown outlook "' + outlook + '" for ' + name + ' in ' + k);
      out[outlook].push({ iso, name, outlook, notes });
    });
    Object.values(out).forEach(list => list.sort((a, b) => a.name.localeCompare(b.name, 'en') || String(a.iso).localeCompare(String(b.iso))));
    return out;
  }

  const pill = (o, esc) => '<span class="pill ' + esc(o) + '">' + esc(outlookLabel(o)) + '</span>';

  function listHtml(k, h, world, byIso) {
    const { esc } = h;
    const L = sectorList(k, world, byIso);
    const row = (x, more) => '<li><button class="country-btn" type="button" data-action="country" data-iso="' + esc(x.iso) + '"><b>' + esc(x.name) + '</b>' + more + '</button></li>';
    const groups = GROUPS.filter(o => L[o].length).map(o =>
      '<div class="country-group"><h3><i style="background:var(--g-' + o + ')"></i>' + esc(outlookLabel(o)) + '</h3><ul class="country-list">' +
      L[o].map(x => row(x, pill(o, esc) + '<span class="country-note">' + (x.notes[0].city ? esc(x.notes[0].place) + ': ' : '') + esc(x.notes[0].text) + '</span>')).join('') +
      '</ul></div>').join('');
    const rest = L.rest.length
      ? '<details class="country-rest"><summary>All other countries (A to Z)</summary><ul class="country-list">' + L.rest.map(x => row(x, '')).join('') + '</ul></details>'
      : '';
    if (!groups && !rest) return '<p class="muted">No countries to show yet.</p>';
    return (groups || '<p class="muted">No checked country notes for this sector yet.</p>') + rest;
  }

  /* ---------- The country profile ---------- */
  const back = '<div><button class="btn link" type="button" data-action="world-clear">Back to the list</button></div>';

  function listSection(title, items, esc) {
    return items.length ? '<h3>' + title + '</h3><ul class="country-ul">' + items.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '';
  }

  // The chosen industry: the country's overall outlook and each note behind it. Says so when the map has no note for it.
  function sectorHtml(iso, k, notes, world, h) {
    if (!k) return '';
    const { esc } = h;
    const mine = notes.filter(n => n.k === k);
    const head = '<p class="eyebrow">' + esc(industryLabel(k)) + '</p>';
    if (!mine.length) return '<div class="country-sector">' + head + '<p class="muted">No checked note for this industry yet.</p></div>';
    return '<div class="country-sector">' + head +
      (mine.length > 1 ? '<p><b>Overall:</b> ' + pill(countryOutlook(iso, k, world), esc) + '</p>' : '') +
      '<ul>' + mine.map(n => '<li>' + pill(n.o[0], esc) + '<span>' + (n.city ? '<b>' + esc(n.place) + '.</b> ' : '') + esc(n.o[1]) + '</span></li>').join('') + '</ul>' +
      h.srcLinks(mine.flatMap(n => n.o[2] || [])) + '</div>';
  }

  // The map's notes for every other industry, cities included.
  function othersHtml(k, notes, h) {
    const { esc } = h;
    const rest = notes.filter(n => n.k !== k);
    if (!rest.length) return '';
    return '<div class="country-more"><h3>' + (k ? 'Other industries on the map' : 'Industries on the map') + '</h3><ul class="country-notes">' +
      rest.map(n => '<li>' + pill(n.o[0], esc) + '<span><b>' + esc(industryLabel(n.k)) + (n.city ? ' · ' + esc(n.place) : '') + '.</b> ' + esc(n.o[1]) + '</span></li>').join('') + '</ul>' +
      h.srcLinks(rest.flatMap(n => n.o[2] || [])) + '</div>';
  }

  function figCell(fig, kind, esc) {
    const text = figureText(fig, kind);
    if (text === NOT_AVAILABLE) return NOT_AVAILABLE + (fig && typeof fig.why === 'string' && fig.why ? ' <span class="small muted">' + esc(fig.why) + '</span>' : '');
    return esc(text) + (srcName(fig) ? ' <span class="small muted">· ' + linkTo(fig.srcUrl, srcName(fig), esc) + '</span>' : '');
  }

  // The institutions, each with its QS rank and edition, or "main national university" when the data gives no rank. A rank is shown only
  // with the QS edition it comes from. ranked says whether any rank was shown, so the source line knows to cite QS.
  function unisHtml(rec, edition, esc) {
    const unis = (Array.isArray(rec.unis) ? rec.unis : []).filter(u => u && typeof u.n === 'string' && u.n.trim());
    let ranked = false;
    const items = unis.map(u => {
      const rank = typeof u.rank === 'number' ? (Number.isInteger(u.rank) && u.rank >= 1 ? ordinal(u.rank) : '') : typeof u.rank === 'string' ? u.rank.trim() : '';
      // Only a missing rank means "main national university"; a rank that is there but unusable shows nothing, so no false claim.
      let note = '';
      if (u.rank == null) note = 'main national university';
      else if (rank && edition) { note = edition + ': ' + rank; ranked = true; }
      const name = linkTo(u.url, u.n, esc);
      return '<li><b>' + name + '</b>' + (note ? ' <span class="small muted">' + esc(note) + '</span>' : '') + '</li>';
    });
    return { ranked, html: items.length ? '<h3>Top-rated institutions</h3><ul class="country-ul">' + items.join('') + '</ul>' : '' };
  }

  // The World Bank, with the year of each figure it gave; another source named for a figure that has one; QS with its edition when a
  // rank is shown; and the plain statement that the rest is Serasi's own.
  function sourceLine(rec, data, edition, ranked, esc) {
    const link = (url, text) => linkTo(url, text, esc);
    const wb = [], other = [];
    [['pop', 'population'], ['gdp', 'GDP'], ['gdppc', 'GDP per person']].forEach(([f, label]) => {
      const fig = rec[f];
      if (!usable(fig)) return;
      if (srcName(fig)) other.push(esc(label + ' ' + fig.yr) + ': ' + link(fig.srcUrl, srcName(fig)));
      else wb.push(esc(label + ' ' + fig.yr));
    });
    const parts = [];
    if (wb.length) parts.push(link(data.wb && data.wb.url, 'World Bank') + ' (' + wb.join(', ') + ')');
    parts.push(...other);
    if (ranked) parts.push(link(data.qs && data.qs.url, edition));
    return '<p class="src">' + (parts.length ? 'Sources: ' + parts.join('; ') + '. ' : '') +
      'Languages, what the country is known for, facts, notable organisations and main national universities are compiled by Serasi from general knowledge and are not individually sourced.</p>';
  }

  // opts = { data, name }: data stands in for SerasiCountryData; name is the name shown when there is no profile (the globe's own name
  // for the shape, so it works for a shape with no code, such as Kosovo). It wins over the map's country name, which is the fallback,
  // and "This country" is the last resort.
  function profileHtml(iso, k, h, world, byIso, opts) {
    const { esc } = h;
    const W = worldOf(world), data = dataOf(opts);
    const rec = profileFor(iso, byIsoOf(byIso, data));
    const notes = noteList(iso, W);
    const hubs = hubsOf(iso, W);
    if (!rec) {
      const name = (opts && opts.name) || (hubs[0] && hubs[0].country) || 'This country';
      return '<div class="country-profile"><p class="eyebrow">Country</p><h2>' + esc(name) + '</h2>' +
        '<p class="muted">No profile yet. Serasi hasn’t written one for this country.</p>' +
        (notes.length ? sectorHtml(iso, k, notes, W, h) + othersHtml(k, notes, h) : '') + back + '</div>';
    }
    const name = String(rec.name || (hubs[0] && hubs[0].country) || 'This country');
    const flag = flagUrl(rec.a2);
    const edition = data.qs && data.qs.edition != null && String(data.qs.edition).trim() ? String(data.qs.edition).trim() : '';
    const langs = strings(rec.langs);
    const row = (label, cell) => '<tr><th scope="row">' + label + '</th><td>' + cell + '</td></tr>';
    const unis = unisHtml(rec, edition, esc);
    return '<div class="country-profile">' +
      '<div class="country-head">' + (flag ? '<img class="flag" src="' + esc(flag) + '" alt="">' : '') +
        '<div><p class="eyebrow">Country</p><h2>' + esc(name) + '</h2></div></div>' +
      sectorHtml(iso, k, notes, W, h) +
      '<table class="country-figs"><tbody>' +
        row('Population', figCell(rec.pop, 'people', esc)) +
        row('Languages', langs.length ? esc(langs.join(', ')) : NOT_AVAILABLE) +
        row('GDP', figCell(rec.gdp, 'usd', esc)) +
        row('GDP per person', figCell(rec.gdppc, 'usd', esc)) +
      '</tbody></table>' +
      listSection('Known for', strings(rec.known), esc) +
      listSection('Facts', strings(rec.facts), esc) +
      listSection('Notable organisations and brands', strings(rec.orgs), esc) +
      unis.html +
      othersHtml(k, notes, h) +
      sourceLine(rec, data, edition, unis.ranked, esc) +
      back + '</div>';
  }

  window.SerasiCountries = { profileFor, flagUrl, figureText, countryOutlook, countryNotes, sectorList, listHtml, profileHtml };
})();
