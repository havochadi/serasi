/* Serasi local study options: every publicly funded Singapore school that offers a course, and the section HTML for it.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   A course is { school, course, lvl: 1 | 2 | 3, yrs, fee: number | null, mode?: 'part-time' | 'work-study', fields, roles?, url, src? }.
   lvl 1 = ITE, 2 = diploma, 3 = degree. fee is the yearly fee in S$ for Singapore Citizens after the MOE Tuition Grant, or null when the
   school's page does not list one. fields are keys of SerasiStudy.FIELDS; roles, when present, limits the course to those role ids. */
(function () {
  'use strict';

  // Publicly funded institutions only, in the order they are listed.
  const SCHOOLS = [
    'ITE', 'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic',
    'NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'LASALLE', 'NAFA', 'University of the Arts Singapore', 'Duke-NUS', 'NIE'
  ];

  // The courses; filled in field by field.
  const COURSES = [];

  const fmtYears = y => (y % 1 === .5 ? (Math.floor(y) || '') + '½' : String(y)) + (y === 1 ? ' year' : ' years');

  // The courses for a role at a level (1 = ITE, 2 = diploma, 3 = degree), in the order of SCHOOLS.
  function forRole(role, lvl, courses = COURSES) {
    const field = window.SerasiStudy.fieldOf(role);
    return courses
      .filter(c => c.lvl === lvl && c.fields.includes(field) && (!c.roles || c.roles.includes(role.id)))
      .map((c, i) => ({ c, i, s: SCHOOLS.indexOf(c.school) }))
      .sort((a, b) => a.s - b.s || a.i - b.i)
      .map(x => x.c);
  }

  // Lowest and highest yearly fee, and whether any is more than $300 from the generic fee the cost table uses. Null fees are ignored.
  function spread(courses, generic) {
    const fees = courses.map(c => c.fee).filter(f => f != null);
    if (!fees.length) return null;
    return { lo: Math.min(...fees), hi: Math.max(...fees), differs: fees.some(f => Math.abs(f - generic) > 300) };
  }

  // h = { esc, money }. Nothing at all when no school lists the course, so the page shows no empty heading.
  function html(role, lvl, h, courses = COURSES) {
    const list = forRole(role, lvl, courses);
    if (!list.length) return '';
    const { esc, money } = h;
    const items = list.map(c =>
      '<li><b class="s-n">' + esc(c.school) + '</b> <span class="s-c">' + esc(c.course) + '</span> ' +
      '<span class="s-m">' + esc(fmtYears(c.yrs)) + ' · ' + (c.fee == null ? 'fee on the school\'s page' : esc(money(c.fee)) + ' a year') + '</span>' +
      (c.mode ? ' <span class="pill">' + esc(c.mode) + '</span>' : '') +
      ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">course page ↗</a></li>').join('');
    return '<ul class="schools">' + items + '</ul>' +
      '<p class="small muted">Yearly fees are for Singapore Citizens after the MOE Tuition Grant, as listed on each school\'s page in October 2026.</p>';
  }

  window.SerasiLocal = { SCHOOLS, COURSES, forRole, spread, html };
})();
