/* Serasi pathways and world data: study routes, fees, subsidies, overseas options, contacts and the world map.
   Loaded by youth.html after serasi-core.js. Figures were checked in October 2026; each links to its source in SOURCES.
   Review them each academic year: TTFS tiers, bursaries and overseas fees change often. */
(function () {
  'use strict';

  /* Sources for the world map, fees and subsidies, checked in October 2026. */
  const SOURCES = {
    gser25: ['Startup Genome, Global Startup Ecosystem Report 2025', 'https://startupgenome.com/report/gser2025/global-startup-ecosystem-ranking-2025-top-40'],
    gfci38: ['Z/Yen, Global Financial Centres Index 38 (Sept 2025)', 'https://www.zyen.com/publications/public-reports/the-global-financial-centres-index-38/'],
    'caixin-cn': ['Caixin Global, May 2025', 'https://www.caixinglobal.com/2025-05-15/as-chinas-rural-migrants-leave-construction-those-who-stay-are-earning-more-102319992.html'],
    'scmp-prop': ['South China Morning Post, 2025', 'https://www.scmp.com/opinion/china-opinion/article/3323176/why-beijing-letting-parts-chinas-property-sector-fail'],
    'cntech-ai': ['China Daily, March 2026', 'https://www.chinadaily.com.cn/a/202603/19/WS69bb633fa310d6866eb3eacf.html'],
    'chinadaily-ai': ['China Daily, April 2026', 'https://mobile.chinadaily.com.cn/html5/2026-04/17/content_003_69e12668ed50be540e72ea0b.htm'],
    'byd-shenzhen': ['Asia Business Daily, inside BYD’s Shenzhen headquarters, July 2025', 'https://www.asiae.co.kr/en/article/2025063014164060494'],
    'hk-fin': ['South China Morning Post, 2026', 'https://www.scmp.com/business/article/3344131/hong-kong-finance-hiring-rises-ipo-revival-cost-cuts-persist'],
    'tsmc-jp': ['Tribune India, 2026', 'https://www.tribuneindia.com/news/business/tsmcs-japan-unit-fab-swings-to-profit-in-q1/'],
    'tsmc-az': ['Tribune India, 2026', 'https://www.tribuneindia.com/news/arizona/tsmc-accelerates-us-expansion-eyes-arizona-as-global-semiconductor-hub'],
    'tsmc-eu': ['TrendForce', 'https://www.trendforce.com/news/2024/02/24/news-latest-overview-on-tsmcs-global-expansion-initiatives/'],
    'kbtx-semi': ['KBTX, August 2026', 'https://www.kbtx.com/2026/08/25/jobs-semiconductor-plants-need-most-how-get-one/'],
    'in-gcc': ['Business Today, July 2026', 'https://www.businesstoday.in/jobs/story/at-5-1-lakh-jobs-indias-global-capability-centre-hiring-boom-scales-new-peak-540328-2026-07-01'],
    'in-semi': ['Metaintro, 2026', 'https://www.metaintro.com/blog/india-semicon-2-1-lakh-chip-jobs'],
    'vn-fdi': ['Bac Ninh Newspaper, citing Savills, 2026', 'https://en.baobacninhtv.vn/northern-vietnam-attracts-80-5-of-new-manufacturing-fdi-in-first-half.bbg'],
    'my-johor': ['EdgeProp, citing DBS', 'https://edgeprop.sg/property-news/data-centres-electronics-among-sectors-benefit-johor-singapore-special-economic-zone-dbs'],
    'my-jsez': ['New Straits Times, February 2026', 'https://www.nst.com.my/amp/business/economy/2026/02/1370164/js-sez-embeds-rm911bil-growth-deep-johors-local-economy'],
    'my-penang-osat': ['iConnect007, Chipbond’s new Penang plant, February 2026', 'https://iconnect007.com/article/148910/chipbond-boosts-malaysias-semiconductor-ecosystem-with-new-penang-facility/148907/smt'],
    'id-ikn': ['New Straits Times (AFP), September 2025', 'https://www.nst.com.my/amp/world/region/2025/09/1271575/indonesias-new-capital-nusantara-risks-fading-white-elephant'],
    'lseg-ifdi': ['LSEG and ICD, Islamic Finance Development Indicator', 'https://mondovisione.com/media-and-resources/news/lseg-and-icd-announce-findings-of-the-2025-islamic-finance-development-indicator-20251014/'],
    'lseg-assets': ['Arab News, October 2025', 'https://www.arabnews.pk/node/2618992/business-economy'],
    'wam-dubai': ['WAM, first half of 2026', 'https://www.wam.ae/en/article/c1tv9lh-dubai%E2%80%99s-real-estate-sector-completes-104-projects'],
    'cnbc-uae': ['CNBC, April 2026', 'https://www.cnbc.com/2026/04/22/uae-economy-travel-tourism-dubai-abu-dhabi-war.html'],
    'stimson-war': ['Stimson Center, 2026', 'https://www.stimson.org/2026/iran-conflict-hits-foundations-of-gulf-economies/'],
    'wego-gulf': ['Wego, 2026', 'https://blog.wego.com/global-air-travel-recovery-after-the-us-iran-war-what-the-ceasefire-means-for-travellers/'],
    'semafor-neom': ['Semafor, May 2026', 'https://www.semafor.com/article/05/22/2026/saudis-neom-halts-work-on-the-line-until-after-2030'],
    'newarab-neom': ['The New Arab, 2026', 'https://www.newarab.com/news/neom-downsizes-where-do-mbss-other-saudi-mega-projects-stand'],
    'jsa-osl': ['Jobs and Skills Australia, 2025 Occupation Shortage List', 'https://www.jobsandskills.gov.au/sites/default/files/2025-10/2025%20OSL%20Key%20Findings%20Report.pdf'],
    'rcn-uk': ['Royal College of Nursing, 2026', 'https://www.rcn.org.uk/news-and-events/Press-Releases/nurses-stacking-shelves-as-graduates-blocked-from-third-of-entry-level-nhs-jobs'],
    'wales-nurse': ['Deeside.com, June 2026', 'https://www.deeside.com/nearly-400-nursing-and-midwifery-graduates-left-without-nhs-wales-jobs-after-summer-matching-process/'],
    'de-auto': ['The Local Germany, January 2026', 'https://www.thelocal.de/20260128/which-major-german-companies-are-cutting-jobs-this-year'],
    'de-auto2': ['news.am, 2026', 'https://news.am/en/news/1055808'],
    'airbus-hire': ['ATW, Airbus recruitment', 'https://atwonline.com/air-transport/location/airbus-target-recruit-over-13000-year'],
    'mro-tech': ['GBP Aerospace and Defence, citing Airbus', 'https://gbp.com.sg/stories/shortage-of-skilled-technicians-poses-challenge-for-mro-industry/'],
    'bls-proj': ['US Bureau of Labor Statistics, projections 2024–34', 'https://www.bls.gov/news.release/ecopro.nr0.htm'],
    'bls-wind': ['US Bureau of Labor Statistics, 2026', 'https://www.bls.gov/opub/ted/2026/wind-turbine-service-technicians-employment-projected-to-grow-49-9-percent-from-2024-to-2034.htm'],
    'boston-bio': ['PharmaVoice, 2025', 'https://www.pharmavoice.com/news/massachusetts-biotech-limping-layoffs-investment-boston-massbio/803581/'],
    irena25: ['IRENA and ILO, Renewable Energy and Jobs 2025', 'https://www.ilo.org/publications/renewable-energy-and-jobs-annual-review-2025'],
    'who-nursing': ['WHO, State of the World’s Nursing 2025', 'https://www.who.int/news/item/11-05-2025-nursing-workforce-grows--but-inequities-threaten-global-health-goals'],
    'jp-care': ['Inquirer (Yomiuri Shimbun)', 'https://globalnation.inquirer.net/258483/japan-to-actively-recruit-nursing-care-staff-from-southeast-asia/amp'],
    'jp-hotel': ['Bernama (NNN-Kyodo), July 2026', 'https://web29.bernama.com/nnn/news.php?id=2579176'],
    'jp-anime': ['Automaton, 2026', 'https://automaton-media.com/en/news/anime-studio-bankruptcies-and-closures-continue-to-rise-for-third-consecutive-year-in-japan/'],
    'kr-content': ['Korea JoongAng Daily, 2026', 'https://www.koreajoongangdaily.com/business/koreas-content-industry-exports-hit-record-high-149-billion-in-2025-buoyed-by-govt-support-initiatives/12605188'],
    'kr-tourism': ['Korea Herald, 2026', 'https://www.koreaherald.com/article/10762264'],
    'kr-ship': ['Splash247', 'https://splash247.com/south-korean-shipbuilders-hit-by-welder-crisis-as-over-1000-vietnamese-workers-denied-entry/'],
    'unesco-teach': ['UN News, UNESCO Global Report on Teachers', 'https://news.un.org/en/node/1147067'],
    bca26: ['BCA, January 2026', 'https://www1.bca.gov.sg/resources/newsroom/speech-by-minister-chee-hong-tat-at-bca-redas-built-environment-and-real-estate--prospects-seminar-2026/'],
    ges25: ['Graduate Employment Survey 2025 (Human Resources Online)', 'https://www.humanresourcesonline.net/median-starting-salaries-of-fresh-graduates-from-nus-ntu-smu-sit-suss-sutd-in-2025'],
    ges25p: ['Polytechnic Graduate Employment Survey 2025 (VnExpress)', 'https://e.vnexpress.net/news/news/education/singapore-polytechnic-graduates-earn-more-in-2025-even-as-job-market-tightens-5006517.html'],
    'nhg-spon': ['NHG Health, nursing sponsorship', 'https://careers.nhghealth.com.sg/job/Nursing-Sponsorship-%28Diploma%29/54421944/'],
    'moe-diped': ['MOE, Diploma in Education', 'https://www.moe.gov.sg/careers/become-teachers/pri-sec-jc-ci/diploma-education'],
    'fee-ite': ['ITE fees', 'https://www.ite.edu.sg/current-full-time-students/admissions/fees/'],
    'fee-poly': ['Singapore Polytechnic fees', 'https://www.sp.edu.sg/admissions/course-fees'],
    'fee-ntu': ['NTU tuition fees', 'https://www.ntu.edu.sg/admissions/undergraduate/fees-and-funding/tuition-fees'],
    'fee-law': ['NUS Law tuition fees', 'https://law1a.nus.edu.sg/admissions/tuition_fees.html'],
    ttfs: ['NTU, MENDAKI Tertiary Tuition Fee Subsidy', 'https://www.ntu.edu.sg/admissions/undergraduate/financial-matters/financial-aid/mendaki-tertiary-tuition-fee-subsidy'],
    ttfs26: ['The Star, April 2026', 'https://www.thestar.com.my/aseanplus/aseanplus-news/2026/04/11/singapore-to-enhance-subsidy-scheme-to-help-more-malay-students-pursue-local-tertiary-education'],
    'burs-poly': ['Republic Polytechnic bursaries (AY2026)', 'https://www.rp.edu.sg/student/financial-matters/bursaries/'],
    'burs-uni': ['SMU, Higher Education Community Bursary', 'https://admissions.smu.edu.sg/financial-aid/higher-education-community-bursary'],
    rmit: ['RMIT, cost of studying in Australia', 'https://www.rmit.edu.au/study-with-us/international-students/study/cost-of-studying-in-australia'],
    'au-npl': ['Study Australia, 2026 student places', 'https://www.studyaustralia.gov.au/en/tools-and-resources/news/increased-student-intake-for-australia-in-2026'],
    'au-visa': ['One Planet Migration Law, 2026 visa funds', 'https://oneplanetmigrationlaw.com.au/immigration-blog/student-visa-500-financial-capacity-requirement-2026/'],
    'uk-fees': ['Keele University, international fees 2026–27', 'https://www.keele.ac.uk/study/undergraduate/tuitionfeesandfunding/undergraduatetuitionfees/undergraduatetuitionfeesinternationalstudents'],
    'uk-nfees': ['Leeds Trinity University, international fees', 'https://www.leedstrinity.ac.uk/international/international-fees-and-funding/tuition-fees/'],
    'de-fees': ['GradGermany, 2026 fees by state', 'https://www.gradgermany.com/blog/germany-tuition-fees-by-state-2026'],
    'de-block': ['Expatrio, blocked account 2026', 'https://www.expatrio.com/about-germany/blocked-amount-2025'],
    'jp-fees': ['Shizuoka University fees', 'https://www.shizuoka.ac.jp/english/campuslife/tuition/list/'],
    'my-fees': ['Universiti Teknologi PETRONAS, international fees', 'https://utp.edu.my/Pages/Admission/Undergraduate/International/Tuition-fees.aspx'],
    'my-monash': ['Unienrol, Monash University Malaysia fees', 'https://articles.unienrol.com/monash-university-malaysia-fees-courses/'],
    'fx-ecb': ['European Central Bank, euro foreign exchange reference rates, 28 October 2026', 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html'],
    'fx-egp': ['ExchangeRate-API, Egyptian pound rate, 29 October 2026', 'https://www.exchangerate-api.com'],
    // Task 12: semiconductors, tech, aerospace, logistics
    'boeing-pto-2025': ['Boeing Pilot and Technician Outlook 2025 (Aviation Business News, July 2025)', 'https://www.aviationbusinessnews.com/mro/latest-news-mro/boeing-forecasts-710000-new-aircraft-technicians-needed-by-2044'],
    'bls-aircraft-2025': ['US Bureau of Labor Statistics, aircraft mechanics and technicians, projections 2025–35', 'https://www.bls.gov/ooh/installation-maintenance-and-repair/aircraft-and-avionics-equipment-mechanics-and-technicians.htm'],
    'ads-facts-2026': ['ADS Group, UK aerospace, defence, security and space facts and figures, 2026', 'https://www.adsgroup.org.uk/knowledge/facts-figures/'],
    'ads-value-2026': ['ADS Group, value of the sectors to the UK, July 2026', 'https://www.adsgroup.org.uk/knowledge/value-of-aerospace-defence-security-and-space-to-the-uk-grew-two-thirds-since-2015-ads-finds/'],
    'aw-india-2026': ['Aviation Week, Airbus on India’s fleet boom, January 2026', 'https://aviationweek.com/mro/workforce-training/airbus-indias-fleet-boom-will-triple-demand-mro-engineers-capacity'],
    'emirates-2025-26': ['Dubai Media Office, Emirates Group results 2025–26, May 2026', 'https://mediaoffice.ae/en/news/2026/may/07-05/emirates-group-achieves-record-profit-in-2025-26'],
    'dxb-war-2026': ['BusinessDay, Dubai airports after the war disruption, May 2026', 'https://www.businessday.co.za/world/international-companies/2026-05-04-dubai-airports-ramp-up-as-airspace-reopens-after-war-disruption/'],
    'edb-aero-2024': ['EDB, Singapore aerospace investment commitments and jobs, February 2024', 'https://www.edb.gov.sg/en/news-and-insights/singapore-bags-s750-million-in-aerospace-investment-commitments-2500-jobs-to-be-filled-edb'],
  };

  /* Industries on the world map. Each role's ind points here. */
  const INDUSTRIES = [
    { k: 'tech', label: 'Tech, AI and data', global: 'AI is pulling hiring towards a few hubs. Silicon Valley, New York and London lead the 2025 ranking of start-up hubs; Beijing rose to joint 5th and every Chinese hub in the top 40 moved up, while much of Europe slipped.', src: ['gser25'] },
    { k: 'semis', label: 'Semiconductors and electronics', global: 'New chip plants are opening in the US, Japan, Germany, Vietnam and India. About half the new plant jobs in the US are technician roles, many of which don’t need a degree.', src: ['kbtx-semi'] },
    { k: 'manufacturing', label: 'Engineering, manufacturing and shipbuilding', global: 'Shipyards and electronics plants in Asia are short of skilled workers, while Germany’s industrial suppliers are cutting jobs.', src: ['kr-ship', 'de-auto'] },
    { k: 'auto', label: 'Automotive and EVs', global: 'Car-making is shifting towards China’s electric-vehicle makers. Germany’s car industry is at its lowest employment since 2005, and Volkswagen blames Chinese competition, US tariffs and high costs for more cuts.', src: ['de-auto', 'de-auto2'] },
    { k: 'aero', label: 'Aerospace and aviation', global: 'Airbus estimates the industry needs 635,000 new maintenance technicians by 2037, and 44% of them in Asia.', src: ['mro-tech'] },
    { k: 'construction', label: 'Construction and property', global: 'Building work rises and falls by place. Singapore, Australia and Johor are busy; China’s property slump and cuts to Saudi Arabia’s NEOM and Indonesia’s new capital have shrunk work there.', src: ['bca26', 'caixin-cn', 'semafor-neom'] },
    { k: 'energy', label: 'Clean energy', global: 'Renewable energy employs at least 16.6 million people, but growth slowed to 2.3% in the latest count and five countries hold over 85% of the jobs.', src: ['irena25'] },
    { k: 'health', label: 'Healthcare', global: 'The world was short of 5.8 million nurses in 2023, and rich countries recruit from abroad. Demand differs by country: Australia and the US are hiring, while many new UK nursing graduates can’t find NHS jobs.', src: ['who-nursing', 'rcn-uk'] },
    { k: 'care', label: 'Social and aged care', global: 'Ageing societies need many more carers. Japan expects to be short of about 250,000 care workers in 2026.', src: ['jp-care'] },
    { k: 'biotech', label: 'Biotech and life sciences', global: 'Biotech funding has been weak since 2021. Boston, the biggest hub, had its lowest venture funding since 2017 in early 2025.', src: ['boston-bio'] },
    { k: 'finance', label: 'Finance and business services', global: 'New York, London, Hong Kong and Singapore are within one rating point of each other at the top of the Global Financial Centres Index.', src: ['gfci38'] },
    { k: 'islamic', label: 'Islamic finance', global: 'Islamic finance assets grew 9% to about US$6.5 trillion in 2025. Malaysia, Saudi Arabia, the UAE, Indonesia and Pakistan are the most developed markets.', src: ['lseg-ifdi'] },
    { k: 'creative', label: 'Media, design and games', global: 'Korean content exports hit a record US$14.9 billion in 2025. Japan’s anime market also set a record, but most studios call it a “profitless boom” with low pay.', src: ['kr-content', 'jp-anime'] },
    { k: 'hospitality', label: 'Tourism, hospitality and retail', global: 'Tourism is booming in Japan and South Korea, where hotels are short of staff. The 2026 Iran war has hit Gulf tourism and flights hard.', src: ['jp-hotel', 'kr-tourism', 'cnbc-uae'] },
    { k: 'logistics', label: 'Logistics and maritime', global: 'Asia’s ports and shipyards are busy. Singapore is adding berths at Tuas, and Korean shipyards have record orders but too few welders.', src: ['bca26', 'kr-ship'] },
    { k: 'education', label: 'Education', global: 'UNESCO says the world needs 44 million more teachers by 2030, a third of them in sub-Saharan Africa, while richer countries struggle to keep teachers.', src: ['unesco-teach'] },
    { k: 'public', label: 'Public service and security', global: 'Public service, Home Team and SAF jobs are Singapore jobs, so the map shows only Singapore for this group.', src: [] }
  ];
  const INDUSTRY = Object.fromEntries(INDUSTRIES.map(x => [x.k, x]));

  /* World hubs: a country (scope 'country', shades the whole country) or a city (a dot). One place can list
     several industries, each with an outlook (grow, steady or decline), a short note and its sources.
     iso is the numeric ISO 3166 code used by the map's country shapes. */
  const WORLD = [
    { id: 'sg', place: 'Singapore', country: 'Singapore', iso: 702, ll: [103.82, 1.35], ind: {
      construction: ['grow', 'Construction demand is forecast at S$47–53 billion for 2026, led by Changi Terminal 5, Tuas Port and new hospitals.', ['bca26']],
      finance: ['grow', '4th in the Global Financial Centres Index, within a point of New York.', ['gfci38']],
      tech: ['grow', '9th in the 2025 start-up hub ranking. IT graduates had the highest median starting pay in 2025, at S$5,500.', ['gser25', 'ges25']],
      aero: ['grow', 'By early 2024 aerospace jobs had grown by almost 3,000 to over 21,000, and firms planned to hire over 2,500 more within three to five years. A major aircraft repair hub for Asia.', ['edb-aero-2024', 'mro-tech']],
      health: ['grow', 'Public hospitals and MOH Holdings sponsor nursing and allied health students with allowances and fee support, in return for a bond.', ['nhg-spon']],
      logistics: ['grow', 'Tuas Port is adding berths and container yards in 2026.', ['bca26']],
      islamic: ['steady', 'A small market for Islamic banking and takaful. Kuala Lumpur, close by, leads the world.', ['lseg-ifdi']],
      education: ['steady', 'MOE takes diploma holders into paid teacher training at NIE.', ['moe-diped']],
      public: ['steady', 'Public service, Home Team and SAF careers are listed on Careers@Gov and agency sites.', []]
    } },
    { id: 'cn', place: 'China (nationwide)', country: 'China', iso: 156, ll: [104, 35], scope: 'country', ind: {
      construction: ['decline', 'Property investment fell 10.6% in 2024 and 11.2% in the first half of 2025. Construction’s share of migrant workers fell to its lowest since 2008.', ['caixin-cn', 'scmp-prop']],
      energy: ['grow', 'Holds the largest share of the world’s renewable energy jobs.', ['irena25']],
      auto: ['grow', 'Chinese electric-vehicle makers are winning market share; German car makers name them as a reason for job cuts.', ['de-auto']]
    } },
    { id: 'shenzhen', place: 'Shenzhen', country: 'China', iso: 156, ll: [114.06, 22.54], ind: {
      tech: ['grow', 'One of the four Chinese cities drawing the most tech job applicants, and climbing the start-up hub ranking.', ['chinadaily-ai', 'gser25']],
      auto: ['grow', 'Home of BYD, one of the world’s biggest electric-vehicle makers.', ['byd-shenzhen']],
      finance: ['steady', '9th in the Global Financial Centres Index.', ['gfci38']]
    } },
    { id: 'hangzhou', place: 'Hangzhou', country: 'China', iso: 156, ll: [120.15, 30.27], ind: {
      tech: ['grow', 'Base of Alibaba and Ant Group. In March 2026 Ant said 85% of its openings were technical roles, and over 70% of those were AI-related.', ['cntech-ai']]
    } },
    { id: 'beijing', place: 'Beijing', country: 'China', iso: 156, ll: [116.4, 39.9], ind: {
      tech: ['grow', 'Rose three places to joint 5th in the 2025 start-up hub ranking; China’s main AI research centre.', ['gser25']]
    } },
    { id: 'shanghai', place: 'Shanghai', country: 'China', iso: 156, ll: [121.47, 31.23], ind: {
      tech: ['grow', '10th in the 2025 start-up hub ranking.', ['gser25']],
      finance: ['steady', '8th in the Global Financial Centres Index.', ['gfci38']]
    } },
    { id: 'hk', place: 'Hong Kong', country: 'Hong Kong', iso: 344, ll: [114.17, 22.32], ind: {
      finance: ['grow', 'Finance added about 4,800 jobs in a year as share listings revived; 3rd in the Global Financial Centres Index.', ['hk-fin', 'gfci38']]
    } },
    { id: 'hsinchu', place: 'Hsinchu', country: 'Taiwan', iso: 158, ll: [120.97, 24.8], ind: {
      semis: ['grow', 'Headquarters of TSMC, the world’s largest contract chipmaker, which is expanding at home and abroad.', ['tsmc-az']]
    } },
    { id: 'jp', place: 'Japan (nationwide)', country: 'Japan', iso: 392, ll: [138, 37], scope: 'country', ind: {
      care: ['grow', 'Expects to be short of about 250,000 care workers in 2026 and is recruiting in South-East Asia.', ['jp-care']],
      hospitality: ['grow', '72% of hotels and inns surveyed in 2026 said they were short of staff.', ['jp-hotel']]
    } },
    { id: 'tokyo', place: 'Tokyo', country: 'Japan', iso: 392, ll: [139.69, 35.68], ind: {
      creative: ['steady', 'Anime production revenue hit a record ¥406.6 billion in 2025, but most studios make little profit, pay is low, and the market may shrink in 2026.', ['jp-anime']]
    } },
    { id: 'kumamoto', place: 'Kumamoto', country: 'Japan', iso: 392, ll: [130.71, 32.8], ind: {
      semis: ['grow', 'TSMC’s Japanese chip plant is running and has turned its first profit; a second plant is planned.', ['tsmc-jp']]
    } },
    { id: 'seoul', place: 'Seoul', country: 'South Korea', iso: 410, ll: [126.98, 37.57], ind: {
      creative: ['grow', 'Korean content exports hit a record US$14.9 billion in 2025, and the government raised its 2030 target.', ['kr-content']],
      tech: ['grow', '8th in the 2025 start-up hub ranking.', ['gser25']],
      hospitality: ['grow', 'Visitors rose to 18.9 million in 2025, from 16.3 million in 2024.', ['kr-tourism']]
    } },
    { id: 'ulsan', place: 'Ulsan', country: 'South Korea', iso: 410, ll: [129.31, 35.54], ind: {
      manufacturing: ['grow', 'Korean shipyards have record orders and expect to be short of thousands of skilled workers.', ['kr-ship']],
      logistics: ['grow', 'Shipbuilding is booming, with yards recruiting foreign welders.', ['kr-ship']]
    } },
    { id: 'bengaluru', place: 'Bengaluru', country: 'India', iso: 356, ll: [77.59, 12.97], ind: {
      tech: ['grow', 'Takes about 30% of 2026 hiring by global companies’ Indian tech centres, which total around 510,000 jobs.', ['in-gcc']]
    } },
    { id: 'hyderabad', place: 'Hyderabad', country: 'India', iso: 356, ll: [78.49, 17.39], ind: {
      tech: ['grow', 'About 15% of that hiring, growing about 15% a year.', ['in-gcc']]
    } },
    { id: 'pune', place: 'Pune', country: 'India', iso: 356, ll: [73.86, 18.52], ind: {
      tech: ['grow', 'About 12% of that hiring, growing about 11% a year.', ['in-gcc']]
    } },
    { id: 'dholera', place: 'Dholera, Gujarat', country: 'India', iso: 356, ll: [72.18, 22.25], ind: {
      semis: ['steady', 'Tata is building India’s first big chip plant here. India plans to train 100,000 chip technicians, but most jobs are still plans.', ['in-semi']]
    } },
    { id: 'bacninh', place: 'Bac Ninh', country: 'Vietnam', iso: 704, ll: [106.08, 21.19], ind: {
      semis: ['grow', 'Electronics and chip investment in northern Vietnam rose 614% in the first half of 2026; Amkor runs a US$1.6 billion chip plant here.', ['vn-fdi']],
      manufacturing: ['grow', 'Northern Vietnam drew 80% of new factory investment in the first half of 2026.', ['vn-fdi']]
    } },
    { id: 'kl', place: 'Kuala Lumpur', country: 'Malaysia', iso: 458, ll: [101.69, 3.14], ind: {
      islamic: ['grow', 'Malaysia tops the world’s Islamic Finance Development Indicator.', ['lseg-ifdi']]
    } },
    { id: 'johor', place: 'Johor Bahru', country: 'Malaysia', iso: 458, ll: [103.74, 1.49], ind: {
      tech: ['grow', 'The fastest-growing data-centre market in South-East Asia, inside the Johor–Singapore Special Economic Zone.', ['my-johor']],
      construction: ['grow', 'Record approved investment (RM91.1 billion by late 2025) is driving data-centre and factory building.', ['my-jsez']]
    } },
    { id: 'penang', place: 'Penang', country: 'Malaysia', iso: 458, ll: [100.33, 5.41], ind: {
      semis: ['steady', 'A mature centre for chip assembly and testing.', ['my-penang-osat']]
    } },
    { id: 'jakarta', place: 'Jakarta', country: 'Indonesia', iso: 360, ll: [106.85, -6.21], ind: {
      islamic: ['grow', 'Indonesia is one of the five most developed Islamic finance markets.', ['lseg-ifdi']]
    } },
    { id: 'nusantara', place: 'Nusantara (new capital)', country: 'Indonesia', iso: 360, ll: [116.7, -0.97], ind: {
      construction: ['decline', 'The new capital’s budget was cut from Rp43.4 trillion in 2024 to Rp6.3 trillion for 2026, and building has slowed.', ['id-ikn']]
    } },
    { id: 'dubai', place: 'Dubai', country: 'United Arab Emirates', iso: 784, ll: [55.27, 25.2], ind: {
      construction: ['steady', 'Building permits and finished projects rose in early 2026, but the Iran war has hurt Gulf economies and many expatriate families have left.', ['wam-dubai', 'cnbc-uae']],
      finance: ['steady', '11th in the Global Financial Centres Index, with war risk weighing on the Gulf.', ['gfci38', 'stimson-war']],
      islamic: ['steady', 'The UAE is the third most developed Islamic finance market.', ['lseg-ifdi']],
      hospitality: ['decline', 'Flights and tourism were badly disrupted by the 2026 Iran war and are only partly back.', ['cnbc-uae', 'wego-gulf']]
    } },
    { id: 'riyadh', place: 'Riyadh', country: 'Saudi Arabia', iso: 682, ll: [46.68, 24.71], ind: {
      construction: ['steady', 'Expo 2030 and the 2034 World Cup need building, but money is tighter and the Iran war hit Gulf economies.', ['newarab-neom', 'stimson-war']],
      islamic: ['grow', 'The second most developed Islamic finance market, with about US$1.31 trillion in assets.', ['lseg-ifdi', 'lseg-assets']]
    } },
    { id: 'neom', place: 'NEOM', country: 'Saudi Arabia', iso: 682, ll: [35.3, 28.0], ind: {
      construction: ['decline', 'NEOM has been scaled back, and work on The Line is paused until after 2030.', ['semafor-neom']],
      hospitality: ['decline', 'Red Sea coast tourism plans were postponed until after 2030.', ['semafor-neom']]
    } },
    { id: 'au', place: 'Australia (nationwide)', country: 'Australia', iso: 36, ll: [134, -25], scope: 'country', ind: {
      construction: ['grow', 'Trades make up half of Australia’s long-running skill shortages, especially construction, engineering and automotive trades.', ['jsa-osl']],
      health: ['grow', 'Registered nurses in aged care, children’s and mental health moved into national shortage.', ['jsa-osl']],
      care: ['grow', 'Aged-care nurses and carers are in short supply.', ['jsa-osl']],
      auto: ['grow', 'Automotive trades are in long-running shortage.', ['jsa-osl']],
      manufacturing: ['grow', 'Engineering trades are in long-running shortage.', ['jsa-osl']]
    } },
    { id: 'uk', place: 'United Kingdom (nationwide)', country: 'United Kingdom', iso: 826, ll: [-2, 54], scope: 'country', ind: {
      health: ['decline', 'New nursing graduates are shut out of a third of entry-level NHS jobs in England, and 35% weren’t placed in Wales in summer 2026.', ['rcn-uk', 'wales-nurse']]
    } },
    { id: 'london', place: 'London', country: 'United Kingdom', iso: 826, ll: [-0.13, 51.51], ind: {
      finance: ['grow', '2nd in the Global Financial Centres Index and gaining on New York.', ['gfci38']],
      tech: ['grow', '3rd in the 2025 start-up hub ranking, though Europe as a whole slipped.', ['gser25']]
    } },
    { id: 'de', place: 'Germany (nationwide)', country: 'Germany', iso: 276, ll: [10.4, 51.2], scope: 'country', ind: {
      auto: ['decline', 'Car industry jobs fell by 42,300 in a year, to the lowest level since 2005, and Volkswagen plans 50,000 more cuts by 2030.', ['de-auto2', 'de-auto']],
      manufacturing: ['decline', 'Suppliers such as Bosch and ZF are cutting thousands of jobs.', ['de-auto']]
    } },
    { id: 'stuttgart', place: 'Stuttgart', country: 'Germany', iso: 276, ll: [9.18, 48.78], ind: {
      auto: ['decline', 'Home of Bosch and Porsche, which are both cutting jobs.', ['de-auto']]
    } },
    { id: 'dresden', place: 'Dresden', country: 'Germany', iso: 276, ll: [13.74, 51.05], ind: {
      semis: ['steady', 'TSMC’s European chip plant is still being built, so most hiring is still ahead.', ['tsmc-eu']]
    } },
    { id: 'toulouse', place: 'Toulouse', country: 'France', iso: 250, ll: [1.44, 43.6], ind: {
      aero: ['grow', 'Airbus’s home is raising aircraft production and has been hiring thousands of people a year.', ['airbus-hire']]
    } },
    { id: 'us', place: 'United States (nationwide)', country: 'United States', iso: 840, ll: [-98, 39], scope: 'country', ind: {
      health: ['grow', 'Healthcare is projected to drive most US job growth to 2034; nurse practitioners are among the fastest-growing jobs.', ['bls-proj']],
      energy: ['grow', 'Wind turbine technician is the fastest-growing US job in official projections, at about 50% to 2034.', ['bls-wind']]
    } },
    { id: 'sf', place: 'San Francisco Bay Area', country: 'United States', iso: 840, ll: [-122.42, 37.77], ind: {
      tech: ['grow', '1st in the 2025 start-up hub ranking, led by AI.', ['gser25']],
      finance: ['steady', '5th in the Global Financial Centres Index.', ['gfci38']]
    } },
    { id: 'nyc', place: 'New York', country: 'United States', iso: 840, ll: [-74.01, 40.71], ind: {
      finance: ['steady', '1st in the Global Financial Centres Index, though it lost three points in 2025.', ['gfci38']],
      tech: ['grow', '2nd in the 2025 start-up hub ranking.', ['gser25']]
    } },
    { id: 'boston', place: 'Boston', country: 'United States', iso: 840, ll: [-71.06, 42.36], ind: {
      biotech: ['decline', 'Venture funding fell to its lowest since 2017, and over 4,100 biotech jobs were cut in 2025 by September.', ['boston-bio']],
      tech: ['grow', 'Joint 5th in the 2025 start-up hub ranking.', ['gser25']]
    } },
    { id: 'phoenix', place: 'Phoenix, Arizona', country: 'United States', iso: 840, ll: [-112.07, 33.45], ind: {
      semis: ['grow', 'TSMC Arizona is profitable, with a second plant due in 2027 and a third under construction.', ['tsmc-az']]
    } },
    { id: 'taylor', place: 'Taylor, Texas', country: 'United States', iso: 840, ll: [-97.41, 30.57], ind: {
      semis: ['grow', 'Samsung’s new plants are expected to create about 3,500 jobs; technician applicants need a high-school diploma.', ['kbtx-semi']]
    } }
  ];
  const HUB = Object.fromEntries(WORLD.map(h => [h.id, h]));
  const OUTLOOK = { grow: 'Growing', steady: 'Steady or mixed', decline: 'Shrinking' };

  /* Pathways. Fees are per year for Singapore Citizens after the MOE Tuition Grant (AY2025–26 cohorts). */
  const FEES = {
    ite: { yr: 630, label: 'ITE (Higher Nitec)', src: 'fee-ite' },
    poly: { yr: 3180, label: 'Polytechnic diploma', src: 'fee-poly' },
    uni: { yr: 8300, label: 'University degree', src: 'fee-ntu' },
    biz: { yr: 9500, label: 'Business or accountancy degree', src: 'fee-ntu' },
    law: { yr: 12700, label: 'Law degree', src: 'fee-law' },
    med: { yr: 36100, label: 'Medicine', src: 'fee-ntu' }
  };
  // Household income per person each month, for TTFS (AY2026/27) and government bursaries (AY2026).
  const INCOME = [
    { k: '', label: 'Not sure, or prefer not to say' },
    { k: 'a', label: '$1,000 or less', max: 1000 },
    { k: 'b', label: '$1,001 to $1,375', max: 1375 },
    { k: 'c', label: '$1,376 to $1,700', max: 1700 },
    { k: 'd', label: '$1,701 to $2,000', max: 2000 },
    { k: 'e', label: '$2,001 to $2,200', max: 2200 },
    { k: 'f', label: '$2,201 to $2,250', max: 2250 },
    { k: 'g', label: '$2,251 to $2,400', max: 2400 },
    { k: 'h', label: '$2,401 to $3,000', max: 3000 },
    { k: 'i', label: 'More than $3,000', max: Infinity }
  ];
  const ttfsShare = m => m <= 1700 ? 1 : m <= 2000 ? .75 : m <= 2200 ? .5 : m <= 2400 ? .25 : 0;
  const polyBursary = m => m <= 1000 ? 3050 : m <= 1375 ? 2700 : m <= 2250 ? 2050 : m <= 3000 ? 950 : 0;
  const uniBursary = m => m <= 1000 ? 6300 : m <= 1375 ? 5100 : 0;

  const HELP = {
    ttfs: { t: 'MENDAKI Tertiary Tuition Fee Subsidy (TTFS)', d: 'For Malay students (including double-barrelled races with Malay first) in a first full-time diploma or degree at a local public institution. From AY2026/27 it pays 100% of tuition fees if your household’s monthly income per person is up to $1,700, 75% up to $2,000, 50% up to $2,200 and 25% up to $2,400.', c: 'mendaki', src: ['ttfs26', 'ttfs'] },
    bursary: { t: 'Government bursaries', d: 'Diploma students get $3,050 a year if income per person is up to $1,000, $2,700 up to $1,375, $2,050 up to $2,250 and $950 up to $3,000. Degree students get $6,300 (up to $1,000) or $5,100 (up to $1,375), with smaller bursaries above that. TTFS students can apply too.', c: 'moe', src: ['burs-poly', 'burs-uni'] },
    tg: { t: 'MOE Tuition Grant', d: 'Already taken off the fees shown. Singapore Citizens don’t sign a bond for it.', c: 'moe', src: [] },
    ipa: { t: 'ITE Progression Award', d: 'Singaporean ITE graduates aged 30 or below get $5,000 in their Post-Secondary Education Account when they start an eligible diploma, and $10,000 in their CPF Ordinary Account when they finish it.', c: 'ipa', src: [] },
    wsdip: { t: 'Work-Study Diploma', d: 'Your employer pays the course fees while you earn a salary. Singaporean ITE graduates within three years of graduating or finishing NS get a $5,000 sign-on incentive (instead of the $5,000 PSEA top-up), and still get the $10,000 CPF top-up when they finish.', c: 'wsdip', src: [] },
    'nurse-spon': { t: 'Hospital nursing sponsorships', d: 'Public hospital groups pay diploma students about $1,000 a month plus up to $2,000 a year towards fees, with a bond of 1–3 years. Degree sponsorships pay about $1,100 a month, with bonds of up to 4–5 years.', c: 'hcspon', src: ['nhg-spon'] },
    'ah-spon': { t: 'Allied health sponsorships (MOH Holdings)', d: 'Sponsor local diplomas and degrees such as physiotherapy, occupational therapy, radiography, pharmacy and dietetics, in return for a bond.', c: 'ahspon', src: [] },
    ncss: { t: 'NCSS Social Service Scholarship', d: 'Full tuition plus allowances for social work, occupational therapy, physiotherapy and speech therapy degrees. Bond: 4 years for local study, 6 for overseas.', c: 'ncss', src: [] },
    ecda: { t: 'ECDA Training Award', d: 'Pays full course fees plus a monthly allowance ($800 at polytechnic, $500 at ITE) for early childhood courses. You then work one year in the sector for each year of support.', c: 'ecda', src: [] },
    'moe-teach': { t: 'Paid teacher training', d: 'MOE pays you while you train at NIE. Diploma holders typically start at about $2,970 a month and serve a 3-year bond in a primary school. The MOE Teaching Award pays degree fees and an allowance, with a 4-year bond.', c: 'moeTeach', src: ['moe-diped'] },
    'paid-train': { t: 'Paid from day one', d: 'Home Team and SAF recruits draw a salary during training and pay no course fees. Ask about sponsored study for a diploma or degree later.', c: 'careersgov', src: [] },
    sfc: { t: 'SkillsFuture Credit', d: 'Singaporeans aged 25 and above get $500 of SkillsFuture Credit for approved courses.', c: 'ssg', src: [] },
    pt: { t: 'Part-time study', d: 'Part-time Higher Nitec modules at ITE cost about $71 each for Singapore Citizens after SkillsFuture funding. Polytechnics and SUSS run subsidised part-time diplomas and degrees.', c: 'ssg', src: [] }
  };

  const CONTACTS = {
    mendaki: { n: 'Yayasan MENDAKI', tel: '6245 5555', url: 'https://www.mendaki.org.sg', w: 'TTFS, study help and youth programmes' },
    e2i: { n: 'NTUC e2i career coaching', tel: '6474 0606', url: 'https://www.e2i.com.sg', w: 'Free career coaches and job matching' },
    wsg: { n: 'Workforce Singapore', tel: '6883 5885', url: 'https://www.wsg.gov.sg', w: 'Careers Connect, traineeships, career advice' },
    ssg: { n: 'SkillsFuture Singapore', tel: '6785 5785', url: 'https://www.skillsfuture.gov.sg', w: 'SkillsFuture Credit and subsidised courses' },
    msf: { n: 'MySkillsFuture', url: 'https://www.myskillsfuture.gov.sg', w: 'Search courses and career guides' },
    moe: { n: 'MOE financial assistance', url: 'https://www.moe.gov.sg/financial-matters/financial-assistance', w: 'Bursaries, Tuition Grant and fee loans' },
    moeTeach: { n: 'MOE: become a teacher', url: 'https://www.moe.gov.sg/careers/become-teachers/pri-sec-jc-ci/diploma-education', w: 'Teacher training, pay and bonds' },
    ite: { n: 'ITE', url: 'https://www.ite.edu.sg', w: 'Courses, applications and the AskITE chatbot' },
    ipa: { n: 'ITE Progression Award (MOE)', url: 'https://www.moe.gov.sg/financial-matters/awards-scholarships/ite-progression-award-ipa', w: 'Who qualifies and how it’s paid' },
    wsdip: { n: 'Work-Study Diploma (ITE)', url: 'https://ite.edu.sg/courses/work-study-diploma', w: 'Earn while you study for a diploma' },
    hcspon: { n: 'Public healthcare sponsorships', url: 'https://www.nuhs.edu.sg/careers/healthcare-scholarships-and-sponsorships', w: 'Nursing and healthcare study awards' },
    ahspon: { n: 'MOH Holdings Healthcare Professionals Scholarship', url: 'https://www.healthcarescholarships.sg/scholarships/healthcare-professionals-scholarship.html', w: 'Nursing and allied health degrees; diploma students ask their hospital cluster about sponsorships' },
    snb: { n: 'Singapore Nursing Board', url: 'https://www.healthprofessionals.gov.sg/snb', w: 'Nurse registration, including overseas degrees' },
    ahpc: { n: 'Allied Health Professions Council', url: 'https://www.healthprofessionals.gov.sg/ahpc', w: 'Registration for allied health professionals' },
    smc: { n: 'Singapore Medical Council', url: 'https://www.healthprofessionals.gov.sg/smc', w: 'Doctor registration and recognised medical schools' },
    ecda: { n: 'ECDA Training Awards', url: 'https://www.ecda.gov.sg/early-childhood-educators-(ece)/careers-in-early-childhood-sector/ecda-training-awards/ecda-training-award-(polytechnic)', w: 'Early childhood study awards' },
    ncss: { n: 'NCSS Social Service Scholarship', url: 'https://www.ncss.gov.sg/social-service-careers/scholarships/social-service-scholarship', w: 'Social work and therapy scholarships' },
    careersgov: { n: 'Careers@Gov', url: 'https://www.careers.gov.sg', w: 'Public service jobs' },
    spf: { n: 'Singapore Police Force', url: 'https://www.police.gov.sg', w: 'Police careers and entry requirements' },
    scdf: { n: 'Singapore Civil Defence Force', url: 'https://www.scdf.gov.sg', w: 'Firefighting and rescue careers' },
    saf: { n: 'MINDEF and the SAF', url: 'https://www.mindef.gov.sg', w: 'SAF regular careers' },
    caas: { n: 'Civil Aviation Authority of Singapore', url: 'https://www.caas.gov.sg', w: 'Air traffic control and aircraft engineer licences' },
    muis: { n: 'MUIS', url: 'https://www.muis.gov.sg', w: 'Asatizah Recognition Scheme and halal certification' },
    cea: { n: 'Council for Estate Agencies', url: 'https://www.cea.gov.sg', w: 'Real estate salesperson course and exam' },
    ema: { n: 'Energy Market Authority', url: 'https://www.ema.gov.sg', w: 'Electrical worker licences' },
    minlaw: { n: 'Ministry of Law', url: 'https://www.mlaw.gov.sg', w: 'Becoming a lawyer, including overseas degrees' },
    isca: { n: 'ISCA', url: 'https://isca.org.sg', w: 'Singapore Chartered Accountant Qualification' },
    mindline: { n: 'national mindline 1771', tel: '1771', url: 'https://www.mindline.sg', w: '24/7 call, WhatsApp 6669 1771 or webchat' },
    sos: { n: 'Samaritans of Singapore', tel: '1767', url: 'https://www.sos.org.sg', w: '24/7 hotline, or CareText 9151 1767 on WhatsApp' },
    studyau: { n: 'Study Australia', url: 'https://www.studyaustralia.gov.au', w: 'Official guide to studying in Australia' },
    ukvisa: { n: 'GOV.UK Student visa', url: 'https://www.gov.uk/student-visa', w: 'UK visa rules and money you must show' },
    daad: { n: 'DAAD', url: 'https://www.daad.de/en/', w: 'Official guide to studying in Germany' },
    jasso: { n: 'Study in Japan (JASSO)', url: 'https://www.studyinjapan.go.jp/en/', w: 'Official guide to studying in Japan' },
    embjp: { n: 'Embassy of Japan in Singapore', url: 'https://www.sg.emb-japan.go.jp/', w: 'MEXT scholarship applications' },
    emgs: { n: 'Education Malaysia Global Services', url: 'https://educationmalaysia.gov.my/', w: 'Official guide to studying in Malaysia' },
    mcf: { n: 'MyCareersFuture', url: 'https://www.mycareersfuture.gov.sg', w: 'Job ads with salary ranges' }
  };

  /* Rough exchange rates for showing overseas costs in Singapore dollars: S$ per one unit of each currency, to 4 figures.
     Most are the ECB euro reference rates of 28 October 2026 (1 EUR = 1.4274 SGD) crossed through the euro (source 'fx-ecb').
     AED and SAR are fixed to the US dollar (3.6725 and 3.75), so they come from the same USD rate.
     EGP is not an ECB currency: it comes from ExchangeRate-API on 29 October 2026 (source 'fx-egp'). */
  const FX_ASOF = 'October 2026';
  const FX = {
    AUD: .9017, GBP: 1.704, EUR: 1.427, JPY: .008117, MYR: .3145,
    CHF: 1.544, DKK: .191, SEK: .1291, NOK: .1379, CAD: .9128, USD: 1.282, NZD: .7197,
    KRW: .0009565, CNY: .1923, HKD: .1634, AED: .3491, EGP: .02286, TRY: .02573, SAR: .3419
  };
  const ABROAD = {
    'au-nurse': { c: 'Australia', course: 'Bachelor of Nursing', yrs: 3, fee: [32000, 42000], cur: 'AUD', living: 29710, why: 'Nurses in aged care, children’s and mental health are in national shortage, so graduates are in demand.', watch: 'Fees rise most years. If you plan to work here later, check the Singapore Nursing Board recognises the course first.', src: ['rmit', 'jsa-osl', 'au-visa'], links: ['studyau', 'snb'] },
    'uk-nurse': { c: 'United Kingdom', course: 'BSc Nursing', yrs: 3, fee: [14500, 26000], cur: 'GBP', why: 'Three-year degrees with hospital placements built in.', watch: 'In 2026 many new UK nursing graduates couldn’t find NHS jobs (35% unplaced in Wales). Check Singapore Nursing Board recognition first.', src: ['uk-nfees', 'wales-nurse'], links: ['ukvisa', 'snb'] },
    'au-allied': { c: 'Australia', course: 'Allied health degree (physiotherapy, OT, radiography)', yrs: 4, fee: [32000, 42000], cur: 'AUD', living: 29710, why: 'Many universities offer these degrees, and health professionals are in shortage in Australia.', watch: 'Check that Singapore’s Allied Health Professions Council recognises the degree before you enrol.', src: ['rmit', 'jsa-osl'], links: ['studyau', 'ahpc'] },
    'au-gen': { c: 'Australia', course: 'Bachelor’s degree', yrs: 3, fee: [36000, 50000], cur: 'AUD', living: 29710, why: 'Many degrees take three years, and graduates can apply to stay and work for a while.', watch: 'Australia manages international places (295,000 new places for 2026), and fees rise most years.', src: ['rmit', 'au-npl', 'au-visa'], links: ['studyau'] },
    'de-eng': { c: 'Germany', course: 'Bachelor’s in engineering or computing at a public university', yrs: 3.5, fee: [200, 700], cur: 'EUR', living: 11904, why: 'Most public universities charge no tuition, even for non-EU students: just a semester fee of about €100–350.', watch: 'Most bachelor’s degrees are taught in German. Baden-Württemberg charges non-EU students €1,500 a semester and TUM in Munich charges too. Germany’s car industry is cutting jobs.', src: ['de-fees', 'de-block'], links: ['daad'] },
    'jp-gen': { c: 'Japan', course: 'Bachelor’s at a national university', yrs: 4, fee: [535800, 535800], once: 282000, cur: 'JPY', why: 'National universities charge everyone the same fees. The MEXT scholarship pays full fees, a monthly allowance and flights for 5 years, including a year of Japanese.', watch: 'Apply for MEXT through the Embassy of Japan in Singapore, usually around May–June. Most courses are taught in Japanese.', src: ['jp-fees'], links: ['embjp', 'jasso'] },
    'jp-anime': { c: 'Japan', course: 'Animation, design or media at a national university', yrs: 4, fee: [535800, 535800], once: 282000, cur: 'JPY', why: 'Japan is the centre of the anime industry, and studios are short of animators. MEXT scholarships cover fees and living costs.', watch: 'Studios report a “profitless boom”: record sales, but low pay and rising closures.', src: ['jp-fees', 'jp-anime'], links: ['embjp', 'jasso'] },
    'my-tech': { c: 'Malaysia', course: 'Computing degree at a private university', yrs: 3, total: [77400, 141720], cur: 'MYR', why: 'Close to home and much cheaper. 2026 totals for a 3-year computing degree range from about RM77,400 (UTP) to RM141,720 (Monash Malaysia).', watch: 'International fees include 6% service tax. Check that employers you want recognise the university.', src: ['my-fees', 'my-monash'], links: ['emgs'] },
    'my-biz': { c: 'Malaysia', course: 'Business or accounting degree at a private university', yrs: 3, cur: 'MYR', why: 'Close to home, and some Australian and UK universities run Malaysian campuses at lower fees.', watch: 'Fees vary a lot; check each university’s international fee page.', src: ['my-monash'], links: ['emgs'] },
    'my-islamic': { c: 'Malaysia', course: 'Islamic finance degree in Kuala Lumpur', yrs: 3, cur: 'MYR', why: 'Malaysia leads the world’s Islamic Finance Development Indicator, and Kuala Lumpur is the industry’s hub.', watch: 'Fees vary by university; check before you apply.', src: ['lseg-ifdi'], links: ['emgs'] },
    'my-religious': { c: 'Malaysia', course: 'Islamic studies at the International Islamic University Malaysia (IIUM)', yrs: 4, cur: 'MYR', why: 'Taught in English and Arabic, close to home.', watch: 'Check that MUIS recognises the qualification under the Asatizah Recognition Scheme.', src: [], links: ['muis', 'emgs'] },
    'eg-religious': { c: 'Egypt', course: 'Islamic studies at Al-Azhar University', yrs: 4, cur: 'EGP', why: 'One of the oldest centres of Islamic learning in the world.', watch: 'Teaching is in Arabic. Check MUIS recognition, travel advice and visa rules first.', src: [], links: ['muis'] },
    'uk-design': { c: 'United Kingdom', course: 'Design, media or games degree', yrs: 3, fee: [17100, 29800], cur: 'GBP', why: 'Three-year degrees, and London is a major creative centre.', watch: 'International fees vary widely, and living in London costs much more.', src: ['uk-fees'], links: ['ukvisa'] },
    'uk-law': { c: 'United Kingdom', course: 'Law degree (LLB)', yrs: 3, fee: [17100, 29800], cur: 'GBP', why: 'A three-year degree instead of four.', watch: 'Only degrees from universities approved by Singapore’s Ministry of Law count towards practising here, and extra steps apply.', src: ['uk-fees'], links: ['minlaw', 'ukvisa'] },
    'med-abroad': { c: 'Overseas', course: 'Medicine abroad', yrs: 5, cur: '', why: 'An option if you miss a local place.', watch: 'Singapore registers doctors only from medical schools on the Singapore Medical Council’s recognised list, and fees abroad are high.', src: [], links: ['smc'] }
  };

  /* Study tracks: the courses at each level (ite, dip, deg), any licence, the help and overseas options, and contacts.
     A role's pc can override a course name or the licence. Tracks with a custom route build their own steps. */
  const TRACKS = {
    nursing: { ite: 'Nitec in Nursing at ITE (2 years). You can work as an enrolled nurse.', dip: 'Diploma in Nursing at Nanyang or Ngee Ann Polytechnic (3 years)', deg: 'Nursing degree at NUS or SIT', licence: 'Register with the Singapore Nursing Board before you practise.', later: 'Enrolled nurses can go on to a nursing diploma, and diploma nurses to a degree, often with hospital sponsorship.', help: ['nurse-spon'], abroad: ['au-nurse', 'uk-nurse'], contacts: ['hcspon', 'snb'] },
    allied: { dip: 'Diploma in Health Sciences or a related diploma (3 years)', deg: 'Allied health degree at SIT', licence: 'Register with the Allied Health Professions Council before you practise.', help: ['ah-spon', 'ncss'], abroad: ['au-allied'], contacts: ['ahspon', 'ahpc'] },
    medicine: { dip: 'A related diploma, such as Biomedical or Health Sciences (3 years)', deg: 'Medicine (MBBS) at NUS or NTU (5 years)', degFee: 'med', degYrs: 5, licence: 'Register with the Singapore Medical Council and complete your first postgraduate year in a public hospital.', note: 'Most medical students enter with A-levels or the IB. Polytechnic graduates can apply, but places are very limited.', abroad: ['med-abroad'], contacts: ['smc'] },
    bio: { dip: 'Diploma in Biomedical, Chemical or Pharmaceutical Science (3 years)', deg: 'Life sciences degree (NUS, NTU or SIT)', abroad: ['au-gen', 'jp-gen'], contacts: ['msf'] },
    tech: { ite: 'Higher Nitec in IT or cybersecurity at ITE (2 years)', dip: 'Diploma in IT, Computer Science or a related field (3 years)', deg: 'Computing degree (NUS, NTU, SMU, SIT or SUTD)', degKey: 'it', note: 'Many tech employers also hire from strong portfolios and certifications.', help: ['wsdip'], abroad: ['de-eng', 'my-tech'], contacts: ['msf', 'e2i'] },
    engineering: { ite: 'Nitec in Electrical, Electronics or Mechanical Technology at ITE (2 years)', dip: 'Diploma in Engineering (3 years)', deg: 'Engineering degree (NUS, NTU, SIT or SUTD)', degKey: 'eng', help: ['wsdip'], abroad: ['de-eng', 'jp-gen'], contacts: ['msf'] },
    trades: { ite: 'Nitec in Electrical Technology at ITE (2 years)', dip: 'Diploma in Electrical or Mechanical Engineering (3 years)', licence: 'Electricians need an Energy Market Authority licence for most electrical work.', help: ['wsdip'], contacts: ['ite', 'ema'] },
    aero: { ite: 'Nitec in Aerospace Technology at ITE (2 years)', dip: 'Diploma in Aerospace Engineering (3 years)', licence: 'Licensed aircraft engineers hold a CAAS Aircraft Maintenance Licence, earned through exams and experience.', help: ['wsdip'], contacts: ['caas', 'ite'] },
    aviation: { custom: 'aviation', contacts: ['mcf'] },
    atc: { custom: 'atc', contacts: ['caas'] },
    pilot: { custom: 'pilot', dip: 'A diploma in any field (3 years)', licence: 'Cadet programmes lead to a commercial pilot licence recognised by CAAS.', contacts: ['caas', 'saf'] },
    culinary: { ite: 'Nitec or Higher Nitec in culinary arts at ITE (2 years)', dip: 'Diploma in Culinary and Catering Management at Temasek Polytechnic (3 years)', note: 'For halal kitchens, learn the MUIS halal certification rules.', contacts: ['ite', 'muis'] },
    hospitality: { ite: 'Nitec in hospitality or retail at ITE (2 years)', dip: 'Diploma in Hospitality and Tourism Management (3 years)', deg: 'Hospitality business degree at SIT', abroad: ['au-gen'], contacts: ['msf'] },
    business: { ite: 'Nitec in Business Services at ITE (2 years)', dip: 'Diploma in Business, Accountancy or Banking and Finance (3 years)', deg: 'Business, accountancy or economics degree (NUS, NTU, SMU, SIT or SUSS)', degFee: 'biz', abroad: ['au-gen', 'my-biz'], contacts: ['msf'] },
    islamicfin: { ite: 'Nitec in Business Services at ITE (2 years)', dip: 'Diploma in Banking and Finance (3 years)', deg: 'Business or finance degree, plus an Islamic finance certificate', degFee: 'biz', note: 'Kuala Lumpur, a short trip away, is the world’s leading Islamic finance market.', abroad: ['my-islamic'], contacts: ['msf'] },
    logistics: { ite: 'Nitec in Business Services or a logistics course at ITE (2 years)', dip: 'Diploma in Supply Chain Management or Logistics (3 years)', deg: 'Supply chain, logistics or business degree', abroad: ['au-gen'], contacts: ['msf'] },
    maritime: { ite: 'Nitec in Mechanical or Marine Technology at ITE (2 years)', dip: 'Diploma in Maritime Business or Marine Engineering at Singapore Polytechnic (3 years)', deg: 'Maritime Studies degree at NTU', contacts: ['msf'] },
    design: { ite: 'Nitec in Visual Communication or Interactive Design at ITE (2 years)', dip: 'Diploma in Design (3 years) at a polytechnic, LASALLE or NAFA', deg: 'Design degree (NTU, SUTD or the University of the Arts Singapore)', note: 'For most design jobs, a strong portfolio matters more than grades. LASALLE and NAFA fees differ from polytechnic fees.', abroad: ['uk-design', 'jp-anime'], contacts: ['msf'] },
    media: { ite: 'Nitec in Interactive or Broadcast Media at ITE (2 years)', dip: 'Diploma in Mass Communication or Media (3 years)', deg: 'Communication, journalism or media degree (NTU, NUS or SUSS)', note: 'Build a portfolio of published work; editors often hire from it.', abroad: ['uk-design'], contacts: ['msf'] },
    law: { dip: 'Diploma in Law and Management at Temasek Polytechnic (3 years)', deg: 'Law degree (LLB) at NUS, SMU or SUSS', degFee: 'law', licence: 'After the degree, take the Part B course and practice training before admission to the Bar.', abroad: ['uk-law'], contacts: ['minlaw'] },
    earlychild: { ite: 'Higher Nitec in Early Childhood Education at ITE (2 years)', dip: 'Diploma in Early Childhood Development and Education at Ngee Ann or Temasek Polytechnic (3 years)', deg: 'Early childhood degree at SUSS', help: ['ecda'], contacts: ['ecda'] },
    teaching: { custom: 'teaching', dip: 'A diploma in any field (3 years)', help: ['moe-teach'], contacts: ['moeTeach'] },
    religious: { dip: 'Diploma in Islamic studies, locally or overseas', deg: 'Islamic studies degree, locally or overseas', licence: 'Register under MUIS’s Asatizah Recognition Scheme before you teach.', abroad: ['my-religious', 'eg-religious'], contacts: ['muis'] },
    socialwork: { ite: 'Nitec in Community Care and Social Services at ITE (2 years)', dip: 'Diploma in Social Sciences, Psychology or Community Development (3 years)', deg: 'Social work degree at SUSS or NUS', help: ['ncss'], contacts: ['ncss'] },
    beauty: { ite: 'A hairdressing course at ITE or a private academy. SkillsFuture funds many WSQ hairdressing courses.', contacts: ['msf', 'ssg'] },
    sport: { dip: 'Diploma in Sport and Exercise Sciences (3 years)', deg: 'Sport science degree (NIE or SUSS)', note: 'Most gyms also ask for a recognised personal trainer certificate.', contacts: ['msf'] },
    vet: { dip: 'Diploma in Veterinary Technology at Temasek Polytechnic (3 years)', contacts: ['msf'] },
    property: { custom: 'property', contacts: ['cea'] },
    uniformed: { custom: 'uniformed', help: ['paid-train'], contacts: ['careersgov'] },
    public: { dip: 'Any diploma (3 years)', deg: 'Any degree. Policy roles often look for economics, social science or law.', contacts: ['careersgov'] }
  };

  // Median gross monthly starting pay, Graduate Employment Surveys 2025 (full-time permanent jobs).
  const PAY = {
    uni: { v: 4500, t: 'university graduates overall' }, it: { v: 5500, t: 'IT and computing graduates' }, eng: { v: 4600, t: 'engineering graduates' },
    med: { v: 6500, t: 'medicine graduates (NUS and NTU)' }, poly: { v: 3000, t: 'polytechnic graduates overall' }, polyHealth: { v: 3011, t: 'polytechnic health sciences graduates' },
    polyHum: { v: 3200, t: 'polytechnic humanities and social sciences graduates' }
  };

  window.SerasiPathways = {
    SOURCES,
    INDUSTRIES,
    INDUSTRY,
    WORLD,
    HUB,
    OUTLOOK,
    FEES,
    INCOME,
    ttfsShare,
    polyBursary,
    uniBursary,
    HELP,
    CONTACTS,
    FX,
    FX_ASOF,
    ABROAD,
    TRACKS,
    PAY
  };
})();
