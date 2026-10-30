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
    finance: ['grow', 'Employers in banking, financial services and insurance report the strongest hiring plans for 2026 of any sector, at 20% against 11% across all sectors (CII–Taggd employer survey, November 2025). GIFT City, its new finance hub, rose nine places to 37th in the September 2026 financial centres ranking.', ['in-bfsi-taggd25', 'in-gift-gfci40']],
  });
  note(756, 'Switzerland', [8.2, 46.8], {
    finance: ['decline', 'Banks in Switzerland employed 92,002 full-time-equivalent staff at the end of 2025, down 2.5% in a year. The fall was all at the big banks; other bank types added staff. UBS still expects around 3,000 more cuts in Switzerland, mostly from late 2026 into early 2027.', ['ch-sba-staff26', 'ch-ubs-cuts26']],
  });

  // islamic finance
  note(586, 'Pakistan', [69.3, 30.4], {
    islamic: ['grow', 'Islamic banking branches rose from 5,854 to 7,562 in 2025, nearly 42% of all bank branches (31.5% a year earlier). Industry officials say there are too few skilled staff for the growth.', ['pk-ibank-br26']],
  });
  note(792, 'Turkey', [35, 39], {
    islamic: ['grow', 'Interest-free “participation” banks’ share of Turkish banking rose from 8.4% in April 2025 to 8.9% in September 2025, with assets up 45% in lira terms (before inflation) in nine months. They employed 21,869 people in 1,490 branches in early 2025, and there were 10 such banks by November 2025.', ['tr-tkbb-q125', 'tr-tkbb-sep25']],
  });

  // health
  note(458, 'Malaysia', [102.5, 4.2], {
    health: ['grow', 'The Health Ministry had 15,587 nurse vacancies on 31 March 2026, up from 14,792 in September 2025. It has raised its yearly nursing diploma intake to 3,000 and put 479 June 2026 graduates of its nursing colleges forward for permanent posts.', ['my-nurse-vac26']],
  });
  note(276, 'Germany', [10.4, 51.2], {
    health: ['grow', 'Nursing and health jobs had Germany’s biggest shortage of skilled workers in 2025. Since June 2024, nursing gained 46,000 staff with foreign passports and lost 5,000 with German ones, as hospitals and care homes recruit abroad.', ['de-ba-pflege26']],
  });

  // biotech (Singapore's note is in its own entry in serasi-pathways.js; Boston's is there too)
  note(156, 'China', [104, 35], {
    biotech: ['grow', 'Biopharma hiring is recovering after a funding slump: in the first half of 2026, job postings for AI drug discovery rose 84% and for smart medical devices 113% on a year earlier (Zhaopin data), and drug licensing deals with overseas firms hit about US$110 billion.', ['cn-zhaopin-bio26', 'cn-cctv-lic26']],
  });
  note(410, 'South Korea', [127.8, 36.5], {
    biotech: ['grow', 'Based on one firm, Samsung Biologics: it hired 484 young people in 2025, up from 205 in 2023, and had about 5,300 full-time staff in early 2026, while Korea’s 113 biggest groups hired 15.3% fewer new people over the same two years.', ['kr-sambio26']],
  });
  note(208, 'Denmark', [10, 56], {
    biotech: ['decline', 'Based on one firm’s cuts: Novo Nordisk, maker of Ozempic and Wegovy, said in September 2025 it would cut about 9,000 jobs (11% of its 78,400 staff), around 5,000 of them in Denmark, as competition in weight-loss drugs grows.', ['dk-novo-pe25', 'dk-novo-cbs25']],
  });

  // ---- Task 14: care, hospitality, creative, education ----
})();
