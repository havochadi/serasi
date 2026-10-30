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
    hospitality: ['decline', 'UKHospitality says its analysis of official ONS figures shows the sector lost about 100,000 jobs in the two years to October 2026, 45% of all UK job losses. The sector gives 31% of first jobs to 16 to 24 year olds.', ['uk-hosp-2026']],
  });
})();
