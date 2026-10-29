/* Serasi local study options: every publicly funded Singapore school that offers a course, and the section HTML for it.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   A course is { school, course, lvl: 1 | 2 | 3, yrs, fee: number | null, mode?: 'part-time' | 'work-study', fields, roles?, url, src? }.
   lvl 1 = ITE, 2 = diploma, 3 = degree. fee is the yearly fee in S$ for Singapore Citizens after the MOE Tuition Grant, or null when the
   school's page does not list one. fields are keys of SerasiStudy.FIELDS; roles, when present, limits the course to those role ids. */
(function () {
  'use strict';

  /* Fee pages for the courses below, checked in October 2026. Singapore Polytechnic's is 'fee-poly' in serasi-pathways.js. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'fee-np26': ['Ngee Ann Polytechnic, full-time diploma fees for AY2026', 'https://np.edu.sg/admissions-enrolment/academic-matters/course-fees'],
    'fee-nyp26': ['Nanyang Polytechnic, annual course fees for AY2026', 'https://www.nyp.edu.sg/student/study/financial-matters/annual-course-fees'],
    'fee-tp26': ['Temasek Polytechnic, full-time diploma fees for AY2026/2027', 'https://www.tp.edu.sg/admissions-and-finance/fees-financial-matters.html'],
    'fee-nus26': ['NUS, undergraduate tuition fees for AY2026/2027 (March 2026)', 'https://nus.edu.sg/registrar/docs/default-source/administrative-policies-procedures/ugtuitioncurrent.pdf'],
    'fee-sutd26': ['SUTD, undergraduate tuition fees for AY2026', 'https://www.sutd.edu.sg/admissions/undergraduate/education-expenses/fees/tuition-fees/']
  });

  // Publicly funded institutions only, in the order they are listed.
  const SCHOOLS = [
    'ITE', 'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic',
    'NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'LASALLE', 'NAFA', 'University of the Arts Singapore', 'Duke-NUS', 'NIE'
  ];

  // The courses, field by field. Fees are for students starting in 2026.
  const COURSES = [
    // Architecture. The Board of Architects gives these four diplomas up to two years' advanced standing in an architecture degree.
    // Registering as an architect also needs a Master of Architecture, which the licence step on the page explains.
    { school: 'Singapore Polytechnic', course: 'Diploma in Architecture', lvl: 2, yrs: 3, fee: 3177.52, fields: ['architecture'], url: 'https://www.sp.edu.sg/courses/schools/abe/architecture', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Design (Architecture specialisation)', lvl: 2, yrs: 3, fee: 3167.5, fields: ['architecture'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-design-environment/diploma-in-design', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Architecture', lvl: 2, yrs: 3, fee: 3188.09, fields: ['architecture'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-architecture', src: ['fee-nyp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Interior Architecture & Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['architecture'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/interior-architecture-design.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Arts in Architecture', lvl: 3, yrs: 4, fee: 8950, fields: ['architecture'], url: 'https://cde.nus.edu.sg/arch/programmes/bachelor-of-arts-in-architecture/', src: ['fee-nus26'] },
    { school: 'SUTD', course: 'Bachelor of Science (Architecture and Sustainable Design)', lvl: 3, yrs: 4, fee: 13500, fields: ['architecture'], url: 'https://www.sutd.edu.sg/asd/education/undergraduate/curriculum/', src: ['fee-sutd26'] }
  ];

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
