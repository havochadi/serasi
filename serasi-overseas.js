/* Serasi overseas study options: the best place to study each field abroad, a few alternatives, and what each costs
   in the local currency and in Singapore dollars.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   An option is { country, school, course, yrs, tuition: [lo, hi], tuitionNote?, feeLabel?, cur, living: number | null, once?, standing, why,
   env, watch, url, src, links? }.
   tuition and living are yearly, in the currency cur; once is a one-off fee in cur. feeLabel replaces the word "Tuition" when the
   yearly figure is something else, such as "Semester fees". yrs covers everything needed to qualify (for architects, the bachelor's
   and the master's), and when the two degrees charge different fees, tuition spans both. tuitionNote says what the two ends of a
   tuition range are (needed whenever lo and hi differ). links are CONTACTS keys.
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
    'sp-arch': ['Singapore Polytechnic, Diploma in Architecture: further study', 'https://www.sp.edu.sg/courses/schools/abe/architecture'],
    'qs-pharm26': ['QS World University Rankings by Subject 2026: Pharmacy and Pharmacology', 'https://www.topuniversities.com/university-subject-rankings/pharmacy-pharmacology'],
    'qs-med26': ['QS World University Rankings by Subject 2026: Medicine', 'https://www.topuniversities.com/university-subject-rankings/medicine'],
    'qs-bio26': ['QS World University Rankings by Subject 2026: Biological Sciences', 'https://www.topuniversities.com/university-subject-rankings/biological-sciences'],
    'ucl-mpharm': ['UCL, Pharmacy MPharm: fees for 2027/28 entrants', 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/pharmacy-mpharm'],
    'ucl-mbbs': ['UCL, Medicine MBBS BSc: fees for 2027/28 entrants', 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/medicine-mbbs-bsc'],
    'ucl-biomed': ['UCL, Biomedical Sciences BSc: fees for 2027/28 entrants', 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/biomedical-sciences-bsc'],
    'spc-list': ['Singapore Pharmacy Council, list of recognised overseas qualifications (page updated 20 October 2026)', 'https://www.spc.gov.sg/for-professionals/apply-for-registration/list-of-recognised-overseas-qualifications/'],
    'spc-foreign': ['Singapore Pharmacy Council, foreign-trained pharmacy graduates (page updated 9 October 2026)', 'https://www.spc.gov.sg/for-professionals/apply-for-registration/foreign-trained-pharmacy-graduates-pharmacists/'],
    'smc-notes': ['Singapore Medical Council, notes on the Second Schedule of the Medical Registration Act (registrable basic medical qualifications)', 'https://go.gov.sg/important-notes-on-the-mra-second-schedule-list-of-registrable-basic-medical-qualifications']
  });

  /* Sources for the overseas options of the health and care fields (second batch), checked in October 2026. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'ca-funds': ['IRCC, study permit: proof of financial support (page updated 28 August 2026)', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents/financial-support.html'],
    'uk-living-outside': ['GOV.UK, Student visa: money for living costs outside London, 2026', 'https://www.gov.uk/student-visa/money'],
    'smc-list22': ['Singapore Medical Council, list of registrable basic medical qualifications (the version effective 1 September 2022, a copy hosted by KKH)', 'https://www.kkh.com.sg/EDO%20Forms/List-of-registrable-basic-med-qualifications---effective-from-1-sep-2022.pdf'],
    'ut-pharmd': ['University of Toronto, three-year Doctor of Pharmacy: fees and entry, 2026-27', 'https://pharmacy.utoronto.ca/node/168'],
    'cam-fees': ['University of Cambridge, international tuition fees for 2027 entry', 'https://www.undergraduate.study.cam.ac.uk/international-students/international-fees-and-costs'],
    'cam-med': ['University of Cambridge, Medicine course page', 'https://www.undergraduate.study.cam.ac.uk/courses/medicine'],
    'cam-ns': ['University of Cambridge, Natural Sciences course page', 'https://www.undergraduate.study.cam.ac.uk/courses/natural-sciences'],
    'ahpc-list': ['Allied Health Professions Council, list of recognised qualifications (page updated 23 September 2026)', 'https://www.ahpc.gov.sg/for-professionals/apply-for-registration/list-of-recognised-qualifications/'],
    'ed-med': ['University of Edinburgh, undergraduate medicine fees for 2027-2028', 'https://registryservices.ed.ac.uk/tuition-fees/find/undergraduate/2027-2028/medicine'],
    'qs-nurs26': ['QS World University Rankings by Subject 2026: Nursing', 'https://www.topuniversities.com/university-subject-rankings/nursing'],
    'snb-foreign': ['Singapore Nursing Board, foreign-trained nurses and midwives (page updated 9 June 2026)', 'https://www.snb.gov.sg/for-professionals/becoming-a-nurse-or-midwife/apply-for-registration-enrolment/foreign-trained-nurses-midwives/'],
    'ut-bscn-apply': ['University of Toronto Nursing, BScN admission requirements', 'https://bloomberg.nursing.utoronto.ca/how-to-apply-bachelor-of-science-in-nursing-bscn'],
    'cuhk-bnurs': ['CUHK Nethersole School of Nursing, Bachelor of Nursing', 'https://www.nur.cuhk.edu.hk/education/undergraduate-programmes/bachelor-of-nursing/'],
    'ut-bscn': ['University of Toronto Nursing, international tuition fees 2026-2027', 'https://bloomberg.nursing.utoronto.ca/learn-with-us/tuition-fees/'],
    'cuhk-fees': ['CUHK, fees and living costs for non-local undergraduates, 2027-28', 'https://admission.cuhk.edu.hk/fees-financing-your-studies/fees/'],
    'sasw-recog': ['SASW, accreditation: social work qualifications from overseas and the bodies it recognises', 'https://accreditation.sasw.org.sg/recognition']
  });

  /* Official guides and regulators named by the options' links. */
  Object.assign(window.SerasiPathways.CONTACTS, {
    boa: { n: 'Board of Architects', url: 'https://www.boa.gov.sg', w: 'Registering as an architect, and the degrees it recognises' },
    studynl: { n: 'Study in NL', url: 'https://www.studyinnl.org', w: 'Official guide to studying in the Netherlands' },
    hkimmd: { n: 'Hong Kong Immigration Department', url: 'https://www.immd.gov.hk/eng/services/visas/study.html', w: 'Student visas for Hong Kong' },
    spc: { n: 'Singapore Pharmacy Council', url: 'https://www.spc.gov.sg', w: 'Registering as a pharmacist, including overseas degrees' }
  });

  /* The options for each field of study, field by field. A study field is { best, alts }; an agency field is { agency, src },
     a note with its source keys. The rule for a study field: one school per country, taken in order of the latest QS ranking by
     subject, preferring schools whose qualification Singapore recognises (where a Singapore body regulates the profession) and
     that teach in English; a school that misses one of these is kept only when its standing earns it, with the gap in watch. */
  const OPTIONS = {
    // QS 2026 Architecture and Built Environment: 1 UCL, 2 MIT, 3 TU Delft, 4 ETH Zurich, 5 Manchester, 6 Politecnico di Milano,
    // 9 Tsinghua, 14 HKU, 15 RMIT. Best: UCL, first, English-taught, MArch on the Board of Architects' list.
    // Alternatives, one per country: TU Delft, the highest-ranked school outside the UK and US, kept for its standing although it
    // is not on the Board's list and its bachelor's is in Dutch (both in watch); HKU and RMIT, the highest-ranked English-taught
    // schools whose master's the Board recognises.
    // Left out: MIT (US: the Board lists only NAAB-accredited BArch degrees, and MIT has none); ETH and Politecnico di Milano (not on
    // the Board's list and ranked below Delft, which already fills the place for a top unlisted European school); Manchester (same
    // country as UCL); Tsinghua (recognised BArch, but teaching is in Chinese).
    architecture: {
      best: {
        country: 'United Kingdom', school: 'UCL (The Bartlett School of Architecture)', course: 'BSc Architecture, then the MArch Architecture', yrs: 5,
        tuition: [40800, 40800], cur: 'GBP', living: 13761,
        standing: 'Ranked 1st in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
        why: 'The world’s top-ranked architecture school, and its MArch is on the list of degrees Singapore’s Board of Architects recognises. Design is taught in small studio units led by practising architects.',
        env: 'Taught in English in central London. UCL says its graduates join practices such as Foster + Partners, Zaha Hadid Architects and Heatherwick Studio.',
        watch: 'Singapore’s Board of Architects recognises the Bartlett MArch, not the BSc alone; to register here you then need two years’ work (12 months of it in Singapore) and its Professional Practice Examination. UCL expects a year of work between the two degrees, and sets the MArch fee when you start it. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/architecture-bsc',
        src: ['qs-arch26', 'ucl-bsc', 'ucl-march', 'uk-living', 'boa-schools', 'boa-req'], links: ['ukvisa', 'boa']
      },
      alts: [
        {
          country: 'Netherlands', school: 'TU Delft', course: 'BSc Architecture, Urbanism and Building Sciences, then the MSc', yrs: 5,
          tuition: [20563, 26479], tuitionNote: 'low end uses the bachelor’s fee, high end the master’s', cur: 'EUR', living: 13569,
          standing: 'Ranked 3rd in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
          why: 'One of the top three architecture schools in the world, at about half the UK’s fees.',
          env: 'The bachelor’s is taught in Dutch; the two-year master’s is taught in English.',
          watch: 'You need Dutch for the bachelor’s. Delft is not on Singapore’s Board of Architects list, so to register here you would first have to pass the Board’s Confirmatory Examination. The living figure is the minimum the Dutch immigration service asks students to have, not a typical budget.',
          url: 'https://www.tudelft.nl/en/architecture-and-the-built-environment/study/bachelors-degree-programme',
          src: ['qs-arch26', 'tud-bsc', 'tud-fees', 'nl-living', 'boa-schools', 'boa-exam'], links: ['studynl', 'boa']
        },
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'Bachelor of Arts in Architectural Studies, then the MArch', yrs: 6,
          tuition: [224000, 250000], tuitionNote: 'low end uses the MArch fee, high end the bachelor’s', cur: 'HKD', living: 87940,
          standing: 'Ranked 14th in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
          why: 'Close to home, and Singapore’s Board of Architects recognises its Master of Architecture.',
          env: 'Taught in English. The four-year bachelor’s makes this a six-year route, a year longer than in the UK or Australia.',
          watch: 'The bachelor’s fee is HK$250,000 a year for 2027/28; the MArch fee is HK$224,000 a year for the 2026–27 intake, the latest HKU has published. Singapore’s Board of Architects recognises the MArch, not the bachelor’s alone. Living costs are HKU’s own estimate, not a visa minimum: HK$37,940 for the dearest hall place plus up to HK$50,000 for daily costs, HK$87,940 in all.',
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-arts-architectural-studies',
          src: ['qs-arch26', 'hku-fees', 'hku-march', 'boa-schools'], links: ['hkimmd', 'boa']
        },
        {
          country: 'Australia', school: 'RMIT University', course: 'Bachelor of Architectural Design, then the Master of Architecture', yrs: 5,
          tuition: [52800, 54720], tuitionNote: 'low end uses the bachelor’s fee, high end the master’s', cur: 'AUD', living: 29710,
          standing: 'Ranked 15th in the world for Architecture and Built Environment (QS World University Rankings by Subject 2026)',
          why: 'Singapore’s Board of Architects recognises RMIT’s Master of Architecture, and Singapore Polytechnic lists RMIT among the universities that give its architecture graduates advanced standing.',
          env: 'Taught in English in Melbourne.',
          watch: 'Australian fees rise most years. Singapore’s Board of Architects recognises the Master of Architecture, not the bachelor’s alone. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-architectural-design-bp250',
          src: ['qs-arch26', 'rmit-bad', 'rmit-march', 'au-visa', 'boa-schools', 'sp-arch'], links: ['studyau', 'boa']
        }
      ]
    },
    // QS 2026 Pharmacy and Pharmacology: 1 Harvard, 2 Monash, =3 UCL and Oxford, 5 UNC Chapel Hill, 9 NUS, 12 Toronto, 17 King's, 18 Manchester,
    // 20 Sydney, 22 Queensland (Sydney and Queensland from Pharmacy Daily's report of the 2026 edition). Best: UCL, the highest-ranked English-taught
    // school whose own page gave a fee, and its MPharm is on the Singapore Pharmacy Council's list. Alternatives, one per country: Toronto (Canada),
    // on the list, kept for its standing although its PharmD needs two years of university first (in watch).
    // Left out: Harvard, Oxford, Johns Hopkins, Cambridge and Imperial (no entry-to-practice pharmacy degree to list); Monash (2nd, and on
    // the Council's list, but Monash's fee page returned 403, so its fee is not shown); UNC, UCSF (a PharmD after earlier study, and the US has no
    // visa money-for-living figure); Nottingham, King's, Manchester (same country as UCL).
    pharmacy: {
      best: {
        country: 'United Kingdom', school: 'UCL (UCL School of Pharmacy)', course: 'MPharm Pharmacy', yrs: 4,
        tuition: [36800, 36800], cur: 'GBP', living: 13761,
        standing: 'Ranked joint 3rd in the world for Pharmacy and Pharmacology (QS World University Rankings by Subject 2026)',
        why: 'One of the top-ranked pharmacy schools in the world, and its MPharm is on the Singapore Pharmacy Council’s list of overseas degrees it can register. Monash University in Australia ranks 2nd and is on the same list, but we couldn’t confirm its fees from its own website, so it isn’t shown here.',
        env: 'Taught in English in central London, with placements at six NHS hospital trusts, according to UCL.',
        watch: 'The Singapore Pharmacy Council registers only degrees on its list, and also asks for registration and a practising licence in the country where you studied, a job offer from a training institution it approves, 3 to 12 months of pre-registration training here, and two exams. After the MPharm, UCL says you do a year of foundation training and pass the UK pharmacy registration exam. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/pharmacy-mpharm',
        src: ['qs-pharm26', 'ucl-mpharm', 'uk-living', 'spc-list', 'spc-foreign'], links: ['ukvisa', 'spc']
      },
      alts: [
        {
          country: 'Canada', school: 'University of Toronto (Leslie Dan Faculty of Pharmacy)', course: 'PharmD Doctor of Pharmacy, after two years of university study', yrs: 3,
          tuition: [57280, 57280], cur: 'CAD', living: 23448,
          standing: 'Ranked 12th in the world for Pharmacy and Pharmacology (QS World University Rankings by Subject 2026)',
          why: 'A top-12 pharmacy school, and its Doctor of Pharmacy is on the Singapore Pharmacy Council’s list of overseas degrees. The PharmD is now three years long, down from four, and Toronto says it puts no limit on how many of its roughly 260 places go to qualified international students.',
          env: 'Taught in English in Toronto, with practice rotations from the first year. International students need a study permit and a co-op work permit for the rotations.',
          watch: 'You must finish two years of university study first (Toronto asks for the right science subjects), and those years are not in the cost shown. The Singapore Pharmacy Council registers only degrees on its list, and also asks for registration and a practising licence in the country where you studied, a job offer from a training institution it approves, pre-registration training here, and two exams. The fee is the 2026-27 international fee for new students, before about CAD 2,100 a year in student fees. The living figure is the amount Canada asks a single student to show for a study permit (from 1 September 2026), not a typical budget.',
          url: 'https://pharmacy.utoronto.ca/node/168',
          src: ['qs-pharm26', 'ut-pharmd', 'ca-funds', 'spc-list', 'spc-foreign'], links: ['spc']
        }
      ]
    },
    // QS 2026 Medicine: 1 Harvard, 2 Oxford, 3 Stanford, 4 Johns Hopkins, 5 Cambridge, 6 UCL, 7 Imperial, 10 Karolinska, 11 King's, 12 Toronto,
    // 17 NUS, 20 Melbourne, 22 Edinburgh. Best: Cambridge, the highest-ranked school whose own page gave a fee and whose MB BChir is on the
    // Singapore Medical Council's list. Alternatives: UCL (6th) and Edinburgh (22nd), also on the list, with fees from their own pages. All
    // three are in the United Kingdom: no school outside it that is both ranked in the top 25 and on the list had a readable fee page in
    // English (checked October 2026). Left out: Oxford (2nd, on the list; its fee pages returned 403, so its fee is not shown) and the US
    // schools (the US has no visa money-for-living figure, and graduates must also pass the USMLE); Karolinska (taught in Swedish); Toronto
    // and Melbourne (on the list, but their fee pages returned 403); Imperial (7th) and King's (11th) (no fee found on the school's own page).
    // The list was read in full from the version effective 1 September 2022 (the latest copy found in full); UCL, Cambridge, Oxford and
    // Edinburgh are all on it.
    medicine: {
      best: {
        country: 'United Kingdom', school: 'University of Cambridge (School of Clinical Medicine)', course: 'MB BChir Medicine (BA after three years, then the clinical degree)', yrs: 6,
        tuition: [70554, 70554], cur: 'GBP', living: 10539,
        standing: 'Ranked 5th in the world for Medicine (QS World University Rankings by Subject 2026)',
        why: 'An option if you miss a local place at NUS, NTU or Duke-NUS: Cambridge’s MB BChir is on the list of degrees the Singapore Medical Council can register, but it costs many times as much as a local place. Oxford ranks 2nd and is on the same list, but we couldn’t confirm its fees from its own website, so it isn’t shown here.',
        env: 'Taught in English in Cambridge. The first three years are medical science alongside a clinical strand, and the last three are clinical, on the wards and in GP surgeries.',
        watch: 'The Singapore Medical Council registers only graduates of the schools on its list, and asks you to pass the licensing exams of the country where you studied. Its list also warns that big changes to a listed school’s curriculum may not be recognised. The fee is for 2027 entry and is fixed for the course, but Cambridge sets the year-3 fee by the subject you pick that year, which can be lower, so the six-year total is a ceiling. You also pay a yearly College fee on top, which is not in the cost shown. The living figure is the UK visa minimum for 9 months outside London, not a typical budget.',
        url: 'https://www.undergraduate.study.cam.ac.uk/courses/medicine',
        src: ['qs-med26', 'cam-fees', 'cam-med', 'uk-living-outside', 'smc-list22', 'smc-notes'], links: ['ukvisa', 'smc']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'UCL (UCL Medical School)', course: 'MBBS BSc Medicine', yrs: 6,
          tuition: [49667, 49667], feeLabel: 'Average tuition', cur: 'GBP', living: 13761,
          standing: 'Ranked 6th in the world for Medicine (QS World University Rankings by Subject 2026)',
          why: 'Six years in London, and UCL’s MB BS is on the list of degrees the Singapore Medical Council can register. It costs less than Cambridge, though still several times a local place.',
          env: 'Taught in English in London. The six years are five of medicine and a one-year iBSc in year 3.',
          watch: 'The Singapore Medical Council registers only graduates of the schools on its list, and asks you to pass the licensing exams of the country where you studied. Its list also warns that big changes to a listed school’s curriculum may not be recognised. UCL’s page lists five annual instalments for the six years: two of £40,800 and three of £72,134, about £298,000 in all, and the average here spreads that over six years. The fees are for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
          url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/medicine-mbbs-bsc',
          src: ['qs-med26', 'ucl-mbbs', 'uk-living', 'smc-list22', 'smc-notes'], links: ['ukvisa', 'smc']
        },
        {
          country: 'United Kingdom', school: 'University of Edinburgh (Edinburgh Medical School)', course: 'MBChB Medicine, a six-year degree that includes a BMedSci (Honours)', yrs: 6,
          tuition: [59700, 59700], cur: 'GBP', living: 10539,
          standing: 'Ranked 22nd in the world for Medicine (QS World University Rankings by Subject 2026)',
          why: 'A six-year degree in Scotland, and Edinburgh’s MB ChB is on the list of degrees the Singapore Medical Council can register. It costs less each year than Cambridge.',
          env: 'Taught in English in Edinburgh.',
          watch: 'The Singapore Medical Council registers only graduates of the schools on its list, and asks you to pass the licensing exams of the country where you studied. Its list also warns that big changes to a listed school’s curriculum may not be recognised. Edinburgh’s fee is for students entering in 2027-2028 and includes the NHS teaching levy that international students at Scottish medical schools must pay; it may rise in later years. The living figure is the UK visa minimum for 9 months outside London, not a typical budget.',
          url: 'https://registryservices.ed.ac.uk/tuition-fees/find/undergraduate/2027-2028/medicine',
          src: ['qs-med26', 'ed-med', 'uk-living-outside', 'smc-list22'], links: ['ukvisa', 'smc']
        }
      ]
    },
    // QS 2026 Biological Sciences (the closest QS subject): 1 Harvard, 2 MIT, 3 Oxford, 4 Stanford, 5 Cambridge, =7 Imperial, =9 UCL, 13 NUS,
    // 14 ETH Zurich, 16 Toronto, 19 Edinburgh. Best: UCL, whose BSc is Biomedical Sciences by name. Alternative: Cambridge (5th), whose own page gave
    // a fee; it is kept as an alternative, not best, because Natural Sciences is a broad science degree and not biomedical sciences by name.
    // Left out: Oxford (3rd; its fee pages returned 403, so its fee is not shown), the US schools and ETH (taught in German at bachelor's
    // level), Toronto (no fee on a page from the university itself), Imperial and Edinburgh (same country as UCL, no fee page read). Every
    // option is in the United Kingdom: no ranked school in another English-taught country had a readable fee page (checked October 2026).
    biomedical: {
      best: {
        country: 'United Kingdom', school: 'UCL', course: 'BSc Biomedical Sciences', yrs: 3,
        tuition: [44400, 44400], cur: 'GBP', living: 13761,
        standing: 'Ranked joint 9th in the world for Biological Sciences, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'A three-year bachelor’s at one of the top ten schools in the world for biological sciences. Oxford ranks 3rd, but we couldn’t confirm its fees from its own website, so it isn’t shown here.',
        env: 'Taught in English in London.',
        watch: 'Singapore’s Allied Health Professions Council lists recognised qualifications for five professions (diagnostic radiography, occupational therapy, physiotherapy, radiation therapy and speech-language therapy) and medical laboratory technologists are not among them, so ask the Council or a lab employer here what you would need. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/biomedical-sciences-bsc',
        src: ['qs-bio26', 'ucl-biomed', 'uk-living', 'ahpc-list'], links: ['ukvisa', 'ahpc']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'University of Cambridge', course: 'BA Natural Sciences, biological route (Biomedical Sciences is one of its subjects)', yrs: 3,
          tuition: [46872, 46872], cur: 'GBP', living: 10539,
          standing: 'Ranked 5th in the world for Biological Sciences, the closest QS subject (QS World University Rankings by Subject 2026)',
          why: 'A top-five school in the world for biological sciences. You choose your subjects after you arrive, so it suits someone who is not sure which branch of biology to specialise in.',
          env: 'Taught in English in Cambridge. A fourth year leads to an MSci.',
          watch: 'It is a broad Natural Sciences degree, not a degree called biomedical sciences. Singapore’s Allied Health Professions Council lists recognised qualifications for five professions (diagnostic radiography, occupational therapy, physiotherapy, radiation therapy and speech-language therapy) and medical laboratory technologists are not among them, so ask the Council or a lab employer here what you would need. The fee is for 2027 entry and is fixed for the course. You also pay a yearly College fee on top, which is not in the cost shown. The living figure is the UK visa minimum for 9 months outside London, not a typical budget.',
          url: 'https://www.undergraduate.study.cam.ac.uk/courses/natural-sciences',
          src: ['qs-bio26', 'cam-fees', 'cam-ns', 'uk-living-outside', 'ahpc-list'], links: ['ukvisa', 'ahpc']
        }
      ]
    },
    // QS 2026 Nursing: 1 Penn, 2 King's, 4 Toronto, =6 CUHK, =10 Trinity College Dublin, =16 UTS. Best: Toronto, the highest-ranked school that
    // teaches in English and whose own page gave a fee. Alternative: CUHK, in a different country, with the Chinese-language requirement in watch.
    // Left out: Penn (US: no visa money-for-living figure); King's (2nd; its fees load dynamically and could not be read, so none is shown);
    // Trinity (=10; third-party sites disagree on whether non-EU students can take the undergraduate nursing degree, and its own fee page was not
    // read); UTS (=16; its international fee loads dynamically). Singapore recognition: the Nursing Board's page (updated 9 June 2026) names no
    // approved overseas programmes and says it assesses each one, so every option sends the reader to ask the Board first.
    nursing: {
      best: {
        country: 'Canada', school: 'University of Toronto (Lawrence S. Bloomberg Faculty of Nursing)', course: 'BScN Nursing, a 2-year degree after two years of university study', yrs: 2,
        tuition: [53610, 53610], cur: 'CAD', living: 23448,
        standing: 'Ranked 4th in the world for Nursing (QS World University Rankings by Subject 2026)',
        why: 'One of the top four nursing schools in the world, with a fast two-year degree for students who already have two years of university study. Penn (1st) is in the US, which Serasi leaves out because the US sets no visa living-cost figure to quote, and we couldn’t confirm King’s College London’s (2nd) fees from its own website.',
        env: 'Taught in English in Toronto. The degree is full-time and in person, with lectures, labs and clinical placements.',
        watch: 'You need two years of university study first (10 Toronto credits, with at least a B average), and those years are not in the cost shown. Places are highly competitive. The Singapore Nursing Board publishes no list of approved overseas programmes: it assesses each one itself, so ask the Board before you apply. It also asks for a job offer from an eligible hospital here, registration and a practising licence from the country where you trained, and recent nursing practice, and then a licensure exam, a competency assessment or provisional registration. The fee is the 2026-27 international program fee, before about CAD 3,400 a year in student and course fees. The living figure is the amount Canada asks a single student to show for a study permit (from 1 September 2026), not a typical budget.',
        url: 'https://bloomberg.nursing.utoronto.ca/programs/bachelor',
        src: ['qs-nurs26', 'ut-bscn', 'ut-bscn-apply', 'ca-funds', 'snb-foreign'], links: ['snb']
      },
      alts: [
        {
          country: 'Hong Kong', school: 'The Chinese University of Hong Kong (Nethersole School of Nursing)', course: 'Bachelor of Nursing (BNurs)', yrs: 5,
          tuition: [230000, 230000], cur: 'HKD', living: 62000,
          standing: 'Ranked joint 6th in the world for Nursing (QS World University Rankings by Subject 2026)',
          why: 'Joint 6th in the world for nursing, close to home, and open to applicants with A levels, the IB or another recognised school-leaving qualification, so no university study is needed first.',
          env: 'A five-year degree with hospital and community placements. It prepares students for registration with the Nursing Council of Hong Kong.',
          watch: 'CUHK asks for an acceptable level of both English and Chinese, so read its language requirements before you apply. The Singapore Nursing Board publishes no list of approved overseas programmes: it assesses each one itself, so ask the Board before you apply. It also asks for a job offer from an eligible hospital here, registration and a practising licence from the country where you trained, and recent nursing practice. The fee is the non-local fee for 2027-28, and CUHK says it can rise by up to 3% a year. Living costs are CUHK’s own estimate, not a visa minimum: about HK$17,000 for on-campus housing and HK$45,000 for living expenses.',
          url: 'https://www.nur.cuhk.edu.hk/education/undergraduate-programmes/bachelor-of-nursing/',
          src: ['qs-nurs26', 'cuhk-fees', 'cuhk-bnurs', 'snb-foreign'], links: ['snb', 'hkimmd']
        }
      ]
    },
    // Agency route: no overseas study needed. MOE's Diploma in Education page ('moe-diped'): a contract teaching stint comes first,
    // and "Your training at NIE is fully funded by MOE".
    teaching: {
      agency: 'Teaching in Singapore’s schools runs through MOE and NIE: MOE takes you on for a contract teaching stint first, then fully funds your training at NIE, so there’s no need to study overseas. Read MOE’s “become a teacher” page for entry requirements and pay.',
      src: ['moe-diped']
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

  /* The overseas advice for a role: { field, best, alts } for a field of study, { field, agency, src } for an agency route, or null
     when the role needs less than a diploma, its field is reached through ITE, or the field has no options yet. */
  function forRole(role, options = OPTIONS) {
    if (!role || !(role.edu >= 2)) return null;
    const S = window.SerasiStudy, field = S.fieldOf(role), kind = (S.FIELDS[field] || {}).kind;
    const o = Object.prototype.hasOwnProperty.call(options, field) ? options[field] : null;
    if (!o || kind === 'ite' || !kind) return null;
    if (kind === 'agency') return typeof o.agency === 'string' ? { field, agency: o.agency, src: o.src || [] } : null;
    return o.best ? { field, best: o.best, alts: o.alts || [] } : null;
  }

  /* The "Or study overseas" section: the best place as a highlighted card, then the alternatives as short rows, or the agency note.
     h = { esc, srcLinks }, the page's helpers. Nothing at all when forRole is null, so the page shows no empty heading.
     Throws, like costOf, when an option's currency has no exchange rate. */
  function html(role, h, options = OPTIONS) {
    const r = forRole(role, options);
    if (!r) return '';
    const { esc, srcLinks } = h;
    if (r.agency) return '<div><h4>Or study overseas</h4><p class="small" style="color:var(--ink-2)">' + esc(r.agency) + '</p>' + srcLinks(r.src) + '</div>';

    const link = (o, text) => '<a href="' + esc(o.url) + '" target="_blank" rel="noopener">' + text + ' ↗</a>';
    const note = o => o.tuitionNote ? ' (' + o.tuitionNote + ')' : '';
    // A runner-up's cost in one line: "No tuition fees · " when there are none, then the whole-course total in S$.
    const total = o => {
      const t = costOf(o).totalSgd, free = o.tuition[0] === 0 && o.tuition[1] === 0;
      return (free ? costText(o).fees + ' · ' : '') + 'about ' + sgd(t[0], t[1]) + (o.living == null ? ' before living costs' : ' in total') + note(o);
    };
    const b = r.best, t = costText(b);
    const card = '<div class="best-card"><span class="best-badge">Best place to study this</span>' +
      '<h5>' + esc(b.country) + ' · ' + esc(b.school) + '</h5>' +
      '<p class="best-course">' + esc(b.course) + ' · ' + esc(fmtYears(b.yrs)) + '</p>' +
      '<p class="best-standing">' + esc(b.standing) + '</p>' +
      '<p>' + esc(b.why) + '</p>' +
      '<p><b>Environment:</b> ' + esc(b.env) + '</p>' +
      '<ul class="best-cost"><li>' + esc(t.fees + (b.tuitionNote ? '; ' + b.tuitionNote : '')) + '</li>' + (t.living ? '<li>' + esc(t.living) + '</li>' : '') + '<li class="cost">' + esc(t.total) + '</li></ul>' +
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
