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

  // energy
  note(356, 'India', [78, 22], {
    energy: ['grow', 'Renewable energy jobs rose from about 1 million to 1.3 million in 2024. A 2026 study counted over 650,000 clean energy workers added in three years to March 2026, mostly in rooftop solar, and estimates about 4.4 million jobs by 2030.', ['irena-countries-2025', 'ceew-jobs-2026']],
  });
  note(276, 'Germany', [10.4, 51.2], {
    energy: ['grow', 'Renewable energy jobs hit a record 436,000 in 2025, 4% above the 2023 peak; wind alone has 172,000. Solar jobs are falling as panels are made abroad, and the study warns that cutting solar support could cost jobs.', ['cew-jobs-2026']],
  });
  note(36, 'Australia', [134, -25], {
    energy: ['grow', 'Australia expects to be 42,000 qualified energy tradespeople short by 2030, and training is about 22,000 apprentices behind. More than 300,000 people already work in energy trades, up 20% since 2010.', ['pso-plan-2025']],
  });

  // ---- Task 12: semiconductors, tech, aerospace, logistics ----

  // ---- Task 13: finance, Islamic finance, health, biotech ----

  // ---- Task 14: care, hospitality, creative, education ----
})();
