/* Serasi overseas study options: the best place to study each field abroad, a few alternatives, and what each costs
   in the local currency and in Singapore dollars.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   An option is { country, school, course, yrs, tuition: [lo, hi], feeLabel?, cur, living: number | null, once?, standing, why, env, watch, url, src, links? }.
   tuition and living are yearly, in the currency cur; once is a one-off fee in cur. feeLabel replaces the word "Tuition" when the
   yearly figure is something else, such as "Semester fees". yrs covers everything needed to qualify (for architects, the bachelor's
   and the master's), and when the two degrees charge different fees, tuition spans both. links are CONTACTS keys.
   Exchange rates come from SerasiPathways.FX (S$ per unit), read when called. */
(function () {
  'use strict';

  /* Sources for the options below, checked in October 2026. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'qs-arch26': ['QS World University Rankings by Subject 2026: Architecture and Built Environment', 'https://www.topuniversities.com/university-subject-rankings/architecture-built-environment'],
    'boa-schools': ['Board of Architects, recognised schools (updated 1 July 2026)', 'https://www.boa.gov.sg/register/recognised-schools/'],
    'boa-req': ['Board of Architects, requirements to register as an architect', 'https://www.boa.gov.sg/register/requirements/'],
    'boa-exam': ['Board of Architects, Confirmatory Examination for degrees not on its list', 'https://www.boa.gov.sg/register/application-forms/'],
    'ucl-bsc': ['UCL, Architecture BSc: fees for 2027/28 entrants', 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/architecture-bsc'],
    'ucl-march': ['UCL, Architecture MArch: fees for 2027/28 entrants', 'https://www.ucl.ac.uk/study/prospective-students/graduate/courses/architecture-march'],
    'uk-living': ['GOV.UK, Student visa: money for living costs in London, 2026', 'https://www.gov.uk/student-visa/money'],
    'tud-bsc': ['TU Delft, Architecture bachelor’s (taught in Dutch)', 'https://www.tudelft.nl/en/architecture-and-the-built-environment/study/bachelors-degree-programme'],
    'tud-fees': ['TU Delft, institutional tuition fees for 2027/2028', 'https://www.tudelft.nl/en/education/study-programme-orientation/practical-matters/tuition-fee-finances'],
    'nl-living': ['IND, money students must have for living costs, 2026', 'https://ind.nl/en/required-amounts-income-requirements'],
    'hku-fees': ['HKU, fees and living costs for non-local students, 2027/28', 'https://www.admissions.hku.hk/fees-and-scholarships/fees'],
    'hku-march': ['HKU, postgraduate fees for the 2026–27 intake (MArch)', 'https://handbook.hku.hk/tpg/pdf/2026/2026_PG_FEES_COMPOSITION%20FEES_final.pdf'],
    'rmit-bad': ['RMIT, Bachelor of Architectural Design: 2027 international fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bp250/apply-now'],
    'rmit-march': ['RMIT, Master of Architecture: 2027 international fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/postgraduate-study/masters-by-coursework/mc163/apply-now'],
    'sp-arch': ['Singapore Polytechnic, Diploma in Architecture: further study', 'https://www.sp.edu.sg/courses/schools/abe/architecture']
  });

  /* Official guides and regulators named by the options' links. */
  Object.assign(window.SerasiPathways.CONTACTS, {
    boa: { n: 'Board of Architects', url: 'https://www.boa.gov.sg', w: 'Registering as an architect, and the degrees it recognises' },
    studynl: { n: 'Study in NL', url: 'https://www.studyinnl.org', w: 'Official guide to studying in the Netherlands' },
    hkimmd: { n: 'Hong Kong Immigration Department', url: 'https://www.immd.gov.hk/eng/services/visas/study.html', w: 'Student visas for Hong Kong' }
  });

  /* The options for each field of study, field by field. A study field is { best, alts }, an agency field { agency }.
     The best pick is the school ranked highest for the subject in the latest QS ranking by subject, weighed with the place:
     the language of teaching, the industry around it, and whether Singapore recognises the qualification. */
  const OPTIONS = {
    // QS 2026 Architecture and Built Environment: 1 UCL, 2 MIT, 3 TU Delft, 4 ETH Zurich, 5 Manchester, 6 Politecnico di Milano.
    // UCL is first, teaches in English and its MArch is on the Board of Architects' list. MIT (2nd) is passed over: the Board lists
    // only NAAB-accredited BArch degrees from the US and MIT is not among them. Delft is the strongest school in another European
    // country; ETH and Milan are passed over because ETH's bachelor's is in German and neither is on the Board's list either.
    // Manchester (5th) is in the same country as UCL. Tsinghua (9th) has a recognised BArch but teaches in Chinese. HKU (14th) and
    // RMIT (15th) are the highest-ranked schools outside the UK whose master's the Board recognises and that teach in English.
    architecture: {
      best: {
        country: 'United Kingdom', school: 'UCL (The Bartlett School of Architecture)', course: 'BSc Architecture, then the MArch Architecture', yrs: 5,
        tuition: [40800, 40800], cur: 'GBP', living: 13761,
        standing: 'Ranked 1st in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
        why: 'The world’s top-ranked architecture school, and its MArch is on the list of degrees Singapore’s Board of Architects recognises. Design is taught in small studio units led by practising architects.',
        env: 'Taught in English in central London. UCL says its graduates join practices such as Foster + Partners, Zaha Hadid Architects and Heatherwick Studio.',
        watch: 'Singapore’s Board of Architects recognises the Bartlett MArch, not the BSc alone; to register here you then need two years’ work (12 months of it in Singapore) and its Professional Practice Examination. UCL expects a year of work between the two degrees, and sets the MArch fee when you start it. The living figure is the UK visa minimum for 9 months in London.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/architecture-bsc',
        src: ['qs-arch26', 'ucl-bsc', 'ucl-march', 'uk-living', 'boa-schools', 'boa-req'], links: ['ukvisa', 'boa']
      },
      alts: [
        {
          country: 'Netherlands', school: 'TU Delft', course: 'BSc Architecture, Urbanism and Building Sciences, then the MSc', yrs: 5,
          tuition: [20563, 26479], cur: 'EUR', living: 13569,
          standing: 'Ranked 3rd in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
          why: 'One of the top three architecture schools in the world, at about half the UK’s fees.',
          env: 'The bachelor’s is taught in Dutch; the two-year master’s is taught in English.',
          watch: 'You need Dutch for the bachelor’s. Delft is not on Singapore’s Board of Architects list, so to register here you would first have to pass the Board’s Confirmatory Examination.',
          url: 'https://www.tudelft.nl/en/architecture-and-the-built-environment/study/bachelors-degree-programme',
          src: ['qs-arch26', 'tud-bsc', 'tud-fees', 'nl-living', 'boa-schools', 'boa-exam'], links: ['studynl', 'boa']
        },
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'Bachelor of Arts in Architectural Studies, then the MArch', yrs: 6,
          tuition: [224000, 250000], cur: 'HKD', living: 87940,
          standing: 'Ranked 14th in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
          why: 'Close to home, and Singapore’s Board of Architects recognises its Master of Architecture.',
          env: 'Taught in English. The four-year bachelor’s makes this a six-year route, a year longer than in the UK or Australia.',
          watch: 'Fees for non-local students rose from HK$224,000 to HK$250,000 a year for 2027/28, and the MArch fee shown is the 2026–27 one. Singapore’s Board of Architects recognises the MArch, not the bachelor’s alone. Living costs are HKU’s estimate: a hall place plus daily costs.',
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-arts-architectural-studies',
          src: ['qs-arch26', 'hku-fees', 'hku-march', 'boa-schools'], links: ['hkimmd', 'boa']
        },
        {
          country: 'Australia', school: 'RMIT University', course: 'Bachelor of Architectural Design, then the Master of Architecture', yrs: 5,
          tuition: [52800, 54720], cur: 'AUD', living: 29710,
          standing: 'Ranked 15th in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
          why: 'Singapore’s Board of Architects recognises RMIT’s Master of Architecture, and Singapore Polytechnic lists RMIT among the universities that give its architecture graduates advanced standing.',
          env: 'Taught in English in Melbourne.',
          watch: 'Australian fees rise most years. Singapore’s Board of Architects recognises the Master of Architecture, not the bachelor’s alone.',
          url: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-architectural-design-bp250',
          src: ['qs-arch26', 'rmit-bad', 'rmit-march', 'au-visa', 'boa-schools', 'sp-arch'], links: ['studyau', 'boa']
        }
      ]
    },
    // Agency route: no overseas study needed. From HELP['moe-teach'] and its source 'moe-diped' in serasi-pathways.js.
    teaching: {
      agency: 'Teaching in Singapore’s schools runs through MOE and NIE: MOE takes you on first and pays you while you train at NIE, so there’s no need to study overseas. Read MOE’s “become a teacher” page for entry requirements and pay.'
    }
  };

  const SYMBOL = { AUD: 'A$', GBP: '£', EUR: '€', JPY: '¥', MYR: 'RM' };
  const round100 = n => Math.round(n / 100) * 100;
  const num = n => Math.round(n).toLocaleString('en-SG');
  // 'CHF 1,000–2,000': the second figure drops the symbol. Equal bounds print once.
  const range = (a, b, prefix) => prefix + num(a) + (a === b ? '' : '–' + num(b));
  const local = (cur, a, b) => range(a, b === undefined ? a : b, SYMBOL[cur] || cur + ' ');
  const sgd = (a, b) => range(a, b === undefined ? a : b, '$');
  const fmtYears = y => (y % 1 === .5 ? (Math.floor(y) || '') + '½' : String(y)) + (y === 1 ? ' year' : ' years');

  function rateFor(opt, fx) {
    const rate = (fx || window.SerasiPathways.FX)[opt.cur];
    if (!(rate > 0)) throw new Error('No exchange rate for ' + opt.cur);
    return rate;
  }

  // Cost in Singapore dollars, rounded to the nearest $100: tuition a year, living costs a year, and the whole course.
  function costOf(opt, fx) {
    const rate = rateFor(opt, fx);
    const living = opt.living || 0, once = opt.once || 0;
    const whole = t => round100((t * opt.yrs + once + living * opt.yrs) * rate);
    return {
      tuitionSgd: [round100(opt.tuition[0] * rate), round100(opt.tuition[1] * rate)],
      livingSgd: opt.living == null ? null : round100(opt.living * rate),
      totalSgd: [whole(opt.tuition[0]), whole(opt.tuition[1])]
    };
  }

  // The same costs as plain sentences: { fees, living, total }. living is '' when living costs aren't known.
  function costText(opt, fx) {
    const c = costOf(opt, fx), [lo, hi] = opt.tuition;
    const label = opt.feeLabel || 'Tuition';
    const free = lo === 0 && hi === 0;
    const fees = (free ? 'No ' + (opt.feeLabel ? label.charAt(0).toLowerCase() + label.slice(1) : 'tuition fees') : label + ' ' + local(opt.cur, lo, hi) + ' a year') +
      (opt.once ? ' plus ' + local(opt.cur, opt.once) + ' once' : '') +
      (free ? '' : ' (about ' + sgd(c.tuitionSgd[0], c.tuitionSgd[1]) + ')');
    return {
      fees,
      living: opt.living == null ? '' : 'Living costs ' + local(opt.cur, opt.living) + ' a year (about ' + sgd(c.livingSgd) + ')',
      total: 'Roughly ' + sgd(c.totalSgd[0], c.totalSgd[1]) + ' for ' + fmtYears(opt.yrs) + (opt.living == null ? ', before living costs' : ', including living costs')
    };
  }

  /* The overseas advice for a role: { field, best, alts } for a field of study, { field, agency } for an agency route, or null when the
     role needs less than a diploma, its field is reached through ITE, or the field has no options yet. */
  function forRole(role, options = OPTIONS) {
    if (!role || !(role.edu >= 2)) return null;
    const S = window.SerasiStudy, field = S.fieldOf(role), kind = (S.FIELDS[field] || {}).kind;
    const o = Object.prototype.hasOwnProperty.call(options, field) ? options[field] : null;
    if (!o || kind === 'ite' || !kind) return null;
    if (kind === 'agency') return typeof o.agency === 'string' ? { field, agency: o.agency } : null;
    return o.best ? { field, best: o.best, alts: o.alts || [] } : null;
  }

  /* The "Or study overseas" section: the best place as a highlighted card, then the alternatives as short rows.
     h = { esc, srcLinks, contactList }, the page's helpers (the contacts themselves are listed in the page's "Find out more").
     Nothing at all when forRole is null, so the page shows no empty heading. */
  function html(role, h, options = OPTIONS) {
    const r = forRole(role, options);
    if (!r) return '';
    const { esc, srcLinks } = h;
    if (r.agency) return '<div><h4>Studying overseas</h4><p class="small" style="color:var(--ink-2)">' + esc(r.agency) + '</p></div>';

    const link = (o, text) => '<a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + text + ' ↗</a>';
    const total = o => { const t = costOf(o).totalSgd; return 'about ' + sgd(t[0], t[1]) + (o.living == null ? ' before living costs' : ' in total'); };
    const b = r.best, t = costText(b);
    const card = '<div class="best-card"><span class="best-badge">Best place to study this</span>' +
      '<h5>' + esc(b.country) + ' · ' + esc(b.school) + '</h5>' +
      '<p class="best-course">' + esc(b.course) + ' · ' + esc(fmtYears(b.yrs)) + '</p>' +
      '<p class="best-standing">' + esc(b.standing) + '</p>' +
      '<p>' + esc(b.why) + '</p>' +
      '<p><b>Environment:</b> ' + esc(b.env) + '</p>' +
      '<ul class="best-cost"><li>' + esc(t.fees) + '</li>' + (t.living ? '<li>' + esc(t.living) + '</li>' : '') + '<li class="cost">' + esc(t.total) + '</li></ul>' +
      '<p class="watch">Watch out: ' + esc(b.watch) + '</p>' +
      '<p>' + link(b, 'School page') + '</p>' + srcLinks(b.src) + '</div>';
    const alts = r.alts.length ? '<h5 class="alt-h">Also worth a look</h5><ul class="alt-list">' + r.alts.map(o =>
      '<li class="alt-row"><span class="alt-n"><b>' + esc(o.country) + '</b> · ' + esc(o.school) + '</span>' +
      '<span class="alt-c">' + esc(o.course) + '</span>' +
      '<span class="alt-m">' + esc(fmtYears(o.yrs) + ' · ' + total(o)) + ' · ' + link(o, 'school page') + '</span>' +
      '<span class="alt-w">' + esc(o.standing) + '. Watch out: ' + esc(o.watch) + '</span></li>').join('') + '</ul>' +
      srcLinks(r.alts.flatMap(o => o.src)) : '';
    return '<div class="overseas"><h4>Or study overseas</h4>' +
      '<p class="small muted">If the course is stronger abroad or a place is hard to get here.</p>' + card + alts +
      '<p class="small muted">' + esc('Costs use rough exchange rates as of ' + window.SerasiPathways.FX_ASOF + '. Singapore\'s Tuition Grant, TTFS and bursaries don\'t apply overseas.') + '</p></div>';
  }

  window.SerasiOverseas = { OPTIONS, costOf, costText, forRole, html };
})();
