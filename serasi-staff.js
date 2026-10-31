/* MENDAKI planning model. Aggregates opted-in records; never reads quiz answers. */
(function () {
  'use strict';
  const C = window.SerasiCore;
  const MIN_GROUP = 10, DEMO_SIZE = 240, PLAN_KEY = 'serasi-staff-plans-v1';
  const FILTERS = ['period', 'age', 'path', 'area', 'interest', 'skill', 'tasters'];
  const DEFAULTS = { period: 'all', age: 'all', path: 'all', area: 'all', interest: 'all', skill: 'all', tasters: 'all' };
  const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const PROGRAMMES = {
    R: ['Hands-on careers lab', 'Try practical tasks from engineering, technical trades and aerospace.'],
    I: ['Data & discovery day', 'Explore data, technology and research through a guided challenge.'],
    A: ['Creative careers studio', 'Try a design or media brief and hear how professionals build a portfolio.'],
    S: ['Careers that care', 'Explore healthcare, education and community work with practitioners.'],
    E: ['Business & ideas sprint', 'Try a short business challenge and practise presenting an idea.'],
    C: ['Inside finance & operations', 'Explore how finance, logistics and operations teams organise their work.']
  };
  const SKILL_TITLES = { num: 'Numbers & data essentials', comm: 'Confident communication', people: 'Working well with people', tech: 'Digital confidence lab', hands: 'Practical skills workshop', create: 'Creative problem-solving' };
  const unique = xs => [...new Set(Array.isArray(xs) ? xs : [])];
  const share = (n, total) => total ? Math.round(100 * n / total) : 0;
  function monthKey(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  function months(now = new Date(), count = 6, offset = 0) {
    return Array.from({ length: count }, (_, i) => monthKey(new Date(now.getFullYear(), now.getMonth() - offset - count + i + 1, 1)));
  }
  function monthLabel(key) { return MONTH_NAMES[Number(key.slice(5, 7)) - 1] + ' ' + key.slice(0, 4); }

  function demoRecords(now = new Date()) {
    let seed = 19;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const pick = (xs, weights) => {
      let n = rnd() * weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < xs.length; i++) { n -= weights[i]; if (n <= 0) return xs[i]; }
      return xs[xs.length - 1];
    };
    const dates = months(now);
    return Array.from({ length: DEMO_SIZE }, (_, i) => {
      const first = pick(C.TYPES, [14, 22, 17, 22, 15, 10]);
      const second = pick(C.TYPES.filter(t => t !== first), [18, 20, 24, 21, 17]);
      const third = C.TYPES.filter(t => t !== first && t !== second)[Math.floor(rnd() * 4)];
      const interest = Object.fromEntries(C.TYPES.map(t => [t, t === first ? .9 : t === second ? .72 : t === third ? .55 : .2 + rnd() * .25]));
      const skills = Object.fromEntries(C.SKILLS.map(s => [s.k, pick([1, 2, 3, 4, 5], [6, 18, 36, 28, 12])]));
      const values = [];
      while (values.length < 3) { const v = pick(C.VALUES.map(v => v.k), [24, 22, 20, 18, 15, 14, 10, 8]); if (!values.includes(v)) values.push(v); }
      const path = pick(['ITE', 'Poly', 'Uni', 'Work'], [25, 35, 25, 15]);
      const profile = { interest, traits: Object.fromEntries(['O', 'C', 'E', 'A', 'S', 'H'].map(k => [k, .35 + rnd() * .5])), values, faith: [], skills, pathway: path };
      const ranked = C.rank(profile, false);
      return { id: 'S' + String(i + 1).padStart(3, '0'), month: pick(dates, [11, 13, 15, 17, 20, 24]), age: pick(['18-20', '21-23', '24-25'], [40, 38, 22]), area: pick(['north', 'north-east', 'east', 'west', 'central'], [18, 24, 22, 24, 12]), path, code: first + second + third, top2: [first, second], values, skillsLow: C.SKILLS.filter(s => skills[s.k] <= 2).map(s => s.k), topJobs: ranked.main.map(s => s.role.id), stretchJobs: ranked.stretch.map(s => s.role.id), tasters: rnd() < .43 };
    });
  }
  function filterRows(rows, filters = DEFAULTS, now = new Date(), previous = false) {
    const f = { ...DEFAULTS, ...filters };
    const allowedMonths = f.period === 'all' ? null : months(now, Number(f.period), previous ? Number(f.period) : 0);
    return rows.filter(r => (!r.month || r.month <= monthKey(now)) && (!allowedMonths || allowedMonths.includes(r.month)) &&
      (f.age === 'all' || r.age === f.age) && (f.path === 'all' || r.path === f.path) &&
      (f.area === 'all' || r.area === f.area) && (f.interest === 'all' || r.top2.includes(f.interest)) &&
      (f.skill === 'all' || r.skillsLow.includes(f.skill)) && (f.tasters === 'all' || r.tasters === (f.tasters === 'yes')));
  }
  function aggregate(rows) {
    const count = (get, keys) => {
      const result = Object.fromEntries(keys.map(k => [k, 0]));
      rows.forEach(r => unique(get(r)).forEach(k => { if (Object.hasOwn(result, k)) result[k]++; }));
      return result;
    };
    return { n: rows.length, tasters: rows.filter(r => r.tasters).length, support: rows.filter(r => r.skillsLow.length).length,
      types: count(r => r.top2, C.TYPES), values: count(r => r.values, C.VALUES.map(v => v.k)),
      skills: count(r => r.skillsLow, C.SKILLS.map(s => s.k)), jobs: count(r => r.topJobs, C.ROLES.map(r => r.id)),
      sectors: count(r => r.topJobs.map(id => C.ROLE[id] && C.ROLE[id].sector).filter(Boolean), unique(C.ROLES.map(r => r.sector))) };
  }
  function entries(a) {
    const sorted = list => list.sort((x, y) => y.value - x.value || x.label.localeCompare(y.label));
    return {
      types: sorted(C.TYPES.map(k => ({ k, label: C.TYPE_INFO[k].name, value: a.types[k] }))),
      values: sorted(C.VALUES.map(v => ({ k: v.k, label: C.upperFirst(v.short), value: a.values[v.k] }))),
      skills: sorted(C.SKILLS.map(s => ({ k: s.k, label: s.label, value: a.skills[s.k] }))),
      jobs: sorted(C.ROLES.map(r => ({ k: r.id, label: r.title, value: a.jobs[r.id] }))),
      sectors: sorted(Object.entries(a.sectors).map(([k, value]) => ({ k, label: k, value })))
    };
  }
  function groupRows(rows, by) {
    const defs = { age: C.AGES.concat([['na', 'Not given']]), area: C.AREAS, path: C.PATHWAYS.map(p => [p.k, p.name === 'polytechnic' ? 'Polytechnic' : C.upperFirst(p.name)]) };
    return (defs[by] || defs.area).map(([k, label]) => { const rs = rows.filter(r => r[by] === k); return { k, label, n: rs.length, hidden: rs.length < MIN_GROUP, a: rs.length >= MIN_GROUP ? aggregate(rs) : null }; });
  }
  function audience(rows, plan) {
    return rows.filter(r => plan.kind === 'workshop' ? r.skillsLow.includes(plan.skill) : r.top2.includes(plan.interest) && (plan.kind !== 'taster' || r.tasters)).length;
  }
  function suggestions(rows) {
    if (rows.length < MIN_GROUP) return [];
    const e = entries(aggregate(rows));
    const type = e.types[0], skill = e.skills[0];
    return [
      { kind: 'taster', interest: type.k, skill: '', title: PROGRAMMES[type.k][0], description: PROGRAMMES[type.k][1] },
      { kind: 'workshop', interest: type.k, skill: skill.k, title: SKILL_TITLES[skill.k], description: 'Build confidence through practical exercises in ' + skill.label.toLowerCase() + '.' },
      { kind: 'mentoring', interest: e.types[1].k, skill: '', title: C.TYPE_INFO[e.types[1].k].name + ' careers circle', description: 'A small-group conversation about roles, routes and what working in the field is like.' }
    ].map(p => ({ ...p, demand: audience(rows, p) })).filter(p => p.demand >= MIN_GROUP);
  }
  function filterLabel(f) {
    return FILTERS.filter(k => f[k] && f[k] !== 'all').map(k => {
      if (k === 'period') return 'last ' + f[k] + ' months';
      if (k === 'interest') return C.TYPE_INFO[f[k]]?.name;
      if (k === 'skill') return C.SKILL[f[k]]?.label;
      if (k === 'path') return C.PATH[f[k]]?.label;
      if (k === 'tasters') return f[k] === 'yes' ? 'wants job tasters' : 'no taster interest';
      return Object.fromEntries(k === 'age' ? C.AGES : C.AREAS)[f[k]];
    }).filter(Boolean).join(' · ') || 'All responses';
  }
  function report(rows, filters, source, now = new Date()) {
    if (rows.length < MIN_GROUP) return null;
    const a = aggregate(rows), e = entries(a);
    return ['SERASI · MENDAKI planning brief', 'Prepared ' + now.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
      'Data: ' + source, 'Cohort: ' + filterLabel(filters), '',
      a.n + ' responses; ' + a.tasters + ' (' + share(a.tasters, a.n) + '%) interested in job tasters.',
      a.support + ' (' + share(a.support, a.n) + '%) self-rated at least one skill 1 or 2 out of 5.',
      'Leading interests: ' + e.types.slice(0, 2).map(x => x.label + ' (' + share(x.value, a.n) + '%)').join(', ') + '.',
      'Most matched careers: ' + e.jobs.filter(x => x.value).slice(0, 3).map(x => x.label).join(', ') + '.',
      'Values: ' + e.values.slice(0, 3).map(x => x.label).join(', ') + '.', '', 'Ideas to explore:',
      ...suggestions(rows).map((s, i) => (i + 1) + '. ' + s.title + ' — ' + s.demand + ' potential participants in this cohort.'), '',
      'Audience estimates describe expressed interest or self-ratings, not confirmed attendance. Programme ideas require partner and operational checks.'].join('\n');
  }
  function csvRows(rows, filters, source) {
    if (rows.length < MIN_GROUP) return null;
    const a = aggregate(rows), e = entries(a);
    const out = [['Data source', source], ['Cohort', filterLabel(filters)], ['Responses', a.n], [], ['Measure', 'Item', 'Responses', 'Share (%)']];
    for (const [key, label] of [['types', 'Interest in top two'], ['jobs', 'Career in top ten'], ['values', 'Value chosen'], ['skills', 'Skill rated 1 or 2'], ['sectors', 'Sector in top ten']]) {
      e[key].filter(x => x.value).forEach(x => out.push([label, x.label, x.value, share(x.value, a.n)]));
    }
    out.push(['Job tasters', 'Interested', a.tasters, share(a.tasters, a.n)]);
    return out;
  }
  function toCSV(rows) {
    return '\ufeff' + rows.map(row => row.map(cell => {
      let s = String(cell ?? '');
      if (/^[=+@\-\t\r]/.test(s)) s = "'" + s;
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',')).join('\r\n');
  }
  // Only a cohort snapshot and editable programme fields are stored, never individual records.
  function normalisePlan(input) {
    if (!input || typeof input !== 'object') return null;
    const str = (x, length) => typeof x === 'string' ? x.trim().slice(0, length) : '';
    const title = str(input.title, 100);
    if (!title) return null;
    const filters = { ...DEFAULTS };
    const raw = input.filters || {};
    const allowed = { period: ['all', '3', '1'], age: ['all', ...C.AGES.map(x => x[0]), 'na'], path: ['all', ...C.PATHWAYS.map(x => x.k)], area: ['all', ...C.AREAS.map(x => x[0])], interest: ['all', ...C.TYPES], skill: ['all', ...C.SKILLS.map(x => x.k)], tasters: ['all', 'yes', 'no'] };
    FILTERS.forEach(k => { if (allowed[k].includes(raw[k])) filters[k] = raw[k]; });
    const number = (x, min, max, fallback) => Number.isFinite(Number(x)) ? Math.min(max, Math.max(min, Math.round(Number(x)))) : fallback;
    return { id: str(input.id, 80), title, kind: ['taster', 'workshop', 'mentoring'].includes(input.kind) ? input.kind : 'taster',
      interest: C.TYPES.includes(input.interest) ? input.interest : 'I', skill: C.SKILL[input.skill] ? input.skill : 'comm',
      capacity: number(input.capacity, 1, 200, 25), date: /^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date : '',
      notes: str(input.notes, 600), status: ['draft', 'review', 'archived'].includes(input.status) ? input.status : 'draft',
      source: ['sample', 'shared', 'combined'].includes(input.source) ? input.source : 'sample', filters,
      demand: number(input.demand, 0, 100000, 0), cohortSize: number(input.cohortSize, 0, 100000, 0),
      createdAt: str(input.createdAt, 40), updatedAt: str(input.updatedAt, 40) };
  }
  function readPlans(storage) {
    try { const raw = JSON.parse(storage.getItem(PLAN_KEY) || '[]'); return Array.isArray(raw) ? raw.slice(0, 100).map(normalisePlan).filter(Boolean) : []; } catch (e) { return []; }
  }
  function writePlans(storage, plans) {
    try { storage.setItem(PLAN_KEY, JSON.stringify(plans.slice(0, 100).map(normalisePlan).filter(Boolean))); return true; } catch (e) { return false; }
  }
  window.SerasiStaff = { MIN_GROUP, DEMO_SIZE, PLAN_KEY, FILTERS, DEFAULTS, PROGRAMMES, SKILL_TITLES,
    share, monthKey, months, monthLabel, demoRecords, filterRows, aggregate, entries, groupRows, audience, suggestions, filterLabel, report, csvRows, toCSV, normalisePlan, readPlans, writePlans };
})();
