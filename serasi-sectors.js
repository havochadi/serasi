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

  // Logistics and maritime (Singapore and South Korea are already noted in serasi-pathways.js).
  note(840, 'United States of America', [-98, 39], {
    logistics: ['grow', 'Logisticians held 255,100 US jobs in 2025, and the number is projected to grow 18% by 2035, much faster than average, with about 26,600 openings a year.', ['bls-logisticians-2025']],
  });
  note(356, 'India', [78, 22], {
    logistics: ['grow', 'Logistics employment grew 10.8% in the second half of 2025, says the sector skills council, which expects 4.7 million more logistics workers to be needed by 2030.', ['lssc-india-2026']],
  });
  note(704, 'Vietnam', [105.8, 21.0], {
    logistics: ['grow', 'Vietnam’s logistics plan (October 2025) aims for 12–15% growth a year. A logistics firm says Hai Phong alone is short of over 30,000 qualified workers, especially forklift and crane operators.', ['vneconomy-logistics-2026']],
  });
  note(528, 'Netherlands', [5.3, 52.1], {
    logistics: ['steady', 'Rotterdam’s port handled 428.4 million tonnes in 2025, down 1.7%, though containers rose 3.1% to 14.2 million. Chemical plant closures cost hundreds of port-area jobs in the first half of 2025.', ['rotterdam-2025', 'rotterdam-h1-2025']],
  });
  note(784, 'United Arab Emirates', [54, 24], {
    logistics: ['decline', 'Dubai’s Jebel Ali port handled 374,000 containers in the second quarter of 2026, down from 2.7 million in the first, after the Strait of Hormuz closed. DP World’s first-half profit fell 39%.', ['dpworld-h1-2026']],
  });

  // ---- Task 13: finance, Islamic finance, health, biotech ----

  // ---- Task 14: care, hospitality, creative, education ----
})();
