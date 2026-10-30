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

  // finance
  note(458, 'Malaysia', [102.5, 4.2], {
    finance: ['steady', 'Slow growth: the finance workforce grew almost 3% in the two years to mid-2024 and was about 168,000 people. More than 95% of vacancies were for highly skilled workers.', ['my-bnm-fin24']],
  });
  note(356, 'India', [78, 22], {
    finance: ['grow', 'Banking, financial services and insurance lead India’s 2026 hiring plans: a hiring-intent score of 20%, against 11% for all sectors (CII–Taggd employer survey, November 2025). GIFT City, its new finance hub, rose nine places to 37th in the September 2026 financial centres ranking.', ['in-bfsi-taggd25', 'in-gift-gfci40']],
  });
  note(756, 'Switzerland', [8.2, 46.8], {
    finance: ['decline', 'Banks in Switzerland employed 92,002 full-time staff at the end of 2025, down 2.5% in a year. The fall was all at the big banks; other bank types added staff. UBS still expects around 3,000 more cuts in Switzerland, mostly from late 2026 into early 2027.', ['ch-sba-staff26', 'ch-ubs-cuts26']],
  });

  // islamic finance
  note(586, 'Pakistan', [69.3, 30.4], {
    islamic: ['grow', 'Islamic banking branches rose from 5,854 to 7,562 in 2025, nearly 42% of all bank branches (31.5% a year earlier). Industry officials say there are too few skilled staff for the growth.', ['pk-ibank-br26']],
  });
  note(792, 'Turkey', [35, 39], {
    islamic: ['grow', 'Interest-free “participation” banks employed 21,869 people in 1,490 branches in early 2025. Their assets rose 45% in the first nine months of 2025, lifting their share of Turkish banking to 8.9%, and the number of banks reached 10 by November 2025.', ['tr-tkbb-q125', 'tr-tkbb-sep25']],
  });

  // ---- Task 14: care, hospitality, creative, education ----
})();
