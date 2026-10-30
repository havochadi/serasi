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

  // Aerospace (Singapore and France are already noted in serasi-pathways.js).
  note(840, 'United States of America', [-98, 39], {
    aero: ['grow', 'Aircraft mechanics and technicians held 159,800 US jobs in 2025, and the number is projected to grow 6% by 2035, with about 13,100 openings a year. Boeing expects North America to need 123,000 new technicians by 2044.', ['bls-aircraft-2025', 'boeing-pto-2025']],
  });
  note(826, 'United Kingdom', [-2, 54], {
    aero: ['grow', 'The UK’s aerospace, defence, security and space industries directly employed 468,500 people in 2025, nearly 40% more than in 2015. The trade body says UK aerospace is ramping up production to meet record demand.', ['ads-facts-2026', 'ads-value-2026']],
  });
  note(356, 'India', [78, 22], {
    aero: ['grow', 'Airbus expects India’s aircraft fleet to triple to 2,250 within a decade, and says its maintenance workforce must grow from about 11,000 to 34,000 by 2035 (January 2026).', ['aw-india-2026']],
  });
  note(784, 'United Arab Emirates', [54, 24], {
    aero: ['steady', 'Emirates Group staff grew 8% to 130,919 in the year to March 2026 and recruiting continued. But the Iran war disrupted Gulf air traffic from 28 February, and Dubai International had 18.6 million passengers in January–March 2026, down from 23.4 million a year earlier.', ['emirates-2025-26', 'dxb-war-2026']],
  });

  // ---- Task 13: finance, Islamic finance, health, biotech ----

  // ---- Task 14: care, hospitality, creative, education ----
})();
