/* Serasi sector notes: where each industry is growing, steady or shrinking, country by country.
   Load it after serasi-core.js and serasi-pathways.js. note(iso, country, ll, { industry: [outlook, text, [source keys]] }) adds
   the notes to the country's nationwide entry in SerasiPathways.WORLD, and creates that entry when the country has none.
   An industry can be noted only once per country. Singapore's notes stay in its own entry in serasi-pathways.js. */
(function () {
  'use strict';

  const WORLD = window.SerasiPathways.WORLD;

  function note(iso, country, ll, ind) {
    let h = WORLD.find(x => x.iso === iso && x.scope === 'country');
    if (!h) {
      h = { id: 'c' + iso, place: country + ' (nationwide)', country, iso, ll, scope: 'country', ind: {} };
      WORLD.push(h);
    }
    Object.keys(ind).forEach(k => {
      if (h.ind[k]) throw new Error(country + ' already has a note for ' + k);
      h.ind[k] = ind[k];
    });
  }

  // Each sector task adds its note(...) calls under its own heading. Keep a blank line between headings.

  // ---- Task 11: construction, energy, manufacturing, auto ----

  // ---- Task 12: semiconductors, tech, aerospace, logistics ----

  // ---- Task 13: finance, Islamic finance, health, biotech ----

  // ---- Task 14: care, hospitality, creative, education ----

  // care
  note(410, 'South Korea', [127.8, 36.5], {
    care: ['grow', 'A government-funded institute forecasts a shortage of about 110,000 elderly care workers by 2028. About 66% of the 657,104 people working in care in 2024 were aged 60 or over, and only 6,644 were foreign carers.', ['kr-care-2028']],
  });
  note(826, 'United Kingdom', [-1.5, 52.5], {
    care: ['steady', 'Care job vacancies fell to about 96,000 (6.2%) in 2025/26, the lowest rate since 2015/16, and filled posts grew only 1.4%. The overseas care-worker visa route closed to new applicants in July 2025, so this is not an easy place to move to for care work.', ['sfc-vacancy-2026', 'uk-care-visa-2025']],
  });
  note(840, 'United States of America', [-98, 39], {
    care: ['grow', 'Home health and personal care aides are projected to grow 18% from 2025 to 2035, adding 847,300 jobs to 4.68 million. Median pay was $35,800 in May 2025.', ['bls-aides-2035']],
  });

  // hospitality
  note(458, 'Malaysia', [102, 4.2], {
    hospitality: ['grow', 'Visitors rose 11.2% to 42.2 million in 2025, which is 20.4% above 2019. 2026 is the Visit Malaysia year, with a national campaign to bring in even more.', ['my-visitors-2025']],
  });
  note(826, 'United Kingdom', [-1.5, 52.5], {
    hospitality: ['decline', 'UKHospitality says its analysis of official ONS figures shows the sector lost about 100,000 jobs over “the past two years” (reported October 2026), 45% of all UK job losses. The sector gives 31% of first jobs to 16 to 24 year olds.', ['uk-hosp-2026']],
  });

  // creative
  note(826, 'United Kingdom', [-1.5, 52.5], {
    creative: ['steady', 'Creative industries’ output grew 4.6% in 2024, against 1.0% for the whole UK economy. But games jobs are falling: the games trade body TIGA found game development employment dropped 4.5% from May 2024 to September 2025, and a UKIE survey found 22% of games workers were out of work at least once in 2023 to 2025.', ['dcms-gva-2024', 'ukie-census-2026']],
  });
  note(840, 'United States of America', [-98, 39], {
    creative: ['decline', 'Film and TV shoot days in the Los Angeles area fell 16.1% in 2025, to 19,694. California’s expanded tax credit backed about 13% of shoot days in late 2025.', ['filmla-2025']],
  });
  note(156, 'China', [104, 35], {
    creative: ['grow', 'China’s game industry sales (not job numbers) hit a record 350.79 billion yuan in 2025, up 7.68%, with 683 million players. Chinese games sold US$20.46 billion overseas, up 10.23%.', ['cn-games-2025']],
  });

  // education
  note(392, 'Japan', [138, 36], {
    education: ['grow', 'Public schools hired 37,375 teachers for April 2025, with only 2.9 applicants per job (2.0 for primary schools). Primary schools hired 17,078, the most since 1983, as many older teachers retire.', ['mext-teach-2025']],
  });
  note(410, 'South Korea', [127.8, 36.5], {
    education: ['steady', 'Primary pupils are forecast to fall from about 2.30 million in 2025 to 1.60 million in 2030, and the plan is for only 2,700 to 2,900 new primary teachers a year. Secondary hiring is planned to rise to 4,700 to 5,100 a year.', ['kr-teach-2030']],
  });
  note(156, 'China', [104, 35], {
    education: ['decline', 'Full-time kindergarten teachers fell from 2.83 million in 2024 to 2.61 million in 2025, down about 219,000, as fewer children enrol. Some universities have stopped recruiting for preschool education majors.', ['cn-preschool-2025']],
  });
  note(826, 'United Kingdom', [-1.5, 52.5], {
    education: ['steady', 'In England in 2025/26, postgraduate teacher training recruited 89% of its secondary target and 128% of its primary target (7,650).', ['dfe-itt-2025']],
  });
})();
