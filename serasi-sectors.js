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

  // construction
  note(826, 'United Kingdom', [-2, 54], {
    construction: ['steady', 'Building output is forecast to dip 0.2% in 2026, then grow 1.8% in 2027 and 2.8% in 2028. About 41,200 workers a year will need to join the sector to 2030, about 1.6% of its 2.6 million workers in 2025.', ['citb-cwo-2026']],
  });
  note(840, 'United States of America', [-98, 39], {
    construction: ['grow', 'Construction added an average of 10,000 jobs a month in the 12 months to September 2026, and about 8.4 million Americans now work in it.', ['bls-empsit-sep26']],
  });

  // energy
  note(356, 'India', [78, 22], {
    energy: ['grow', 'About 1.3 million renewable energy jobs in 2024 (IRENA and ILO). A 2026 study counted over 650,000 clean energy workers added in three years to March 2026, mostly in rooftop solar, and estimates about 4.4 million jobs by 2030.', ['irena-countries-2025', 'ceew-jobs-2026']],
  });
  note(276, 'Germany', [10.4, 51.2], {
    energy: ['grow', 'Renewable energy jobs hit a record 436,000 in 2025, 4% above the 2023 peak; wind alone has 172,000. Solar jobs are falling as panels are made abroad, and the study warns that cutting solar support could cost jobs.', ['cew-jobs-2026']],
  });
  note(36, 'Australia', [134, -25], {
    energy: ['grow', 'Australia expects to be 42,000 qualified energy tradespeople short by 2030, and training is about 22,000 apprentices behind. More than 300,000 people already work in energy trades, up 20% since 2010.', ['pso-plan-2025']],
  });

  // manufacturing
  note(840, 'United States of America', [-98, 39], {
    manufacturing: ['steady', 'Factory jobs hit a recent low in December 2025, then regained 72,000 by September 2026, when about 12.65 million Americans worked in manufacturing.', ['bls-empsit-sep26']],
  });

  // auto
  note(356, 'India', [78, 22], {
    auto: ['grow', 'Wholesale vehicle sales hit a record 28.3 million in the year to March 2026, up 10.4%. Autocar Professional (May 2026) estimates the industry supports nearly 30 million jobs, probably counting indirect ones, and says battery, power electronics and software skills are short.', ['siam-fy26', 'autocar-workers-2026']],
  });
  note(840, 'United States of America', [-98, 39], {
    auto: ['steady', 'BLS’s motor vehicles and parts factory series shows about 968,000 jobs in September 2026, almost the same as a year earlier (965,000, both not seasonally adjusted).', ['bls-empsit-sep26']],
  });

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
    logistics: ['grow', 'Vietnam’s logistics strategy (October 2025) aims to grow the logistics services sector 12–15% a year to 2035. A logistics firm says Hai Phong alone is short of over 30,000 qualified workers, especially forklift and crane operators.', ['vneconomy-strategy-2025', 'vneconomy-logistics-2026']],
  });
  note(528, 'Netherlands', [5.3, 52.1], {
    logistics: ['steady', 'Rotterdam’s port handled 428.4 million tonnes in 2025, down 1.7%, though container units (TEU) rose 3.1% to 14.2 million. Announced chemical plant closures put hundreds of chemical-industry jobs at risk in 2025; these are not logistics jobs.', ['rotterdam-2025', 'rotterdam-h1-2025']],
  });
  note(784, 'United Arab Emirates', [54, 24], {
    logistics: ['steady', 'These are port figures; no job numbers were found. Because of the Iran war and the closure of the Strait of Hormuz, Dubai’s Jebel Ali port handled 374,000 container units (TEUs) in the second quarter of 2026, down from 2.7 million in the first. DP World rerouted cargo overland, and its first-half profit fell 39%.', ['dpworld-h1-2026']],
  });

  // Semiconductors (Singapore, Taiwan, Japan, India, Vietnam, Malaysia, Germany and the US are already noted in serasi-pathways.js).

  // Tech, AI and data (Singapore, China, South Korea, India, Malaysia, the UK and the US already have start-up hub or tech-centre notes).
  note(840, 'United States of America', [-98, 39], {
    tech: ['steady', 'Software developer jobs are projected to grow 10% from 2025 to 2035. But Stanford payroll data show employment of 22–25-year-olds in the most AI-exposed jobs, which include software development, was about 19% below where it would have been by June 2026.', ['bls-software-2025', 'stanford-canaries-2026']],
  });
  note(826, 'United Kingdom', [-2, 54], {
    tech: ['decline', 'A June 2026 UK government snapshot of LinkedIn data found entry-level hiring falling in 30 of 38 jobs tracked, with software engineer among the fastest at 27% down (no period is given for that figure). UK hiring overall was down 14% year on year in April 2026. London is still a top-3 start-up hub.', ['dsit-entry-2026', 'gser25']],
  });
  note(156, 'China', [104, 35], {
    tech: ['grow', 'AI’s share of newly posted graduate jobs rose from 26.41% in 2025 to 37.56% in 2026. AI job postings in January–February 2026 were about twelve times those of a year earlier.', ['chinadaily-grad-ai-2026', 'cntech-ai']],
  });

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
