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
          watch: 'The bachelor’s fee is HK$250,000 a year for 2027/28; the MArch fee is HK$224,000 a year for the 2026–27 intake, the latest HKU has published. Singapore’s Board of Architects recognises the MArch, not the bachelor’s alone. Living costs are HKU’s estimate: a hall place plus daily costs.',
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
    // QS 2026 Pharmacy and Pharmacology: 1 Harvard, 2 Monash, =3 UCL and Oxford, 5 UNC Chapel Hill, 9 NUS, 12 Toronto, 17 King's, 18 Manchester.
    // Best: UCL, the highest-ranked English-taught school whose own page gave a fee, and its MPharm is on the Singapore Pharmacy Council's
    // list. Left out: Harvard, Oxford, Johns Hopkins, Cambridge and Imperial (no entry-to-practice pharmacy degree to list); Monash (2nd, and on
    // the Council's list, but Monash's fee page could not be read, so its fee is not shown); UNC, UCSF and Toronto (a PharmD after earlier study,
    // and the US has no visa money-for-living figure); Nottingham, King's, Manchester (same country as UCL). No alternatives are listed yet.
    pharmacy: {
      best: {
        country: 'United Kingdom', school: 'UCL (UCL School of Pharmacy)', course: 'MPharm Pharmacy', yrs: 4,
        tuition: [36800, 36800], cur: 'GBP', living: 13761,
        standing: 'Ranked joint 3rd in the world for Pharmacy and Pharmacology (QS World University Rankings by Subject 2026)',
        why: 'One of the top-ranked pharmacy schools in the world, and its MPharm is on the Singapore Pharmacy Council’s list of overseas degrees it can register. Monash University in Australia ranks 2nd and is also on the list, but its fee could not be confirmed from Monash’s own page, so it is not priced here.',
        env: 'Taught in English in central London, with placements at six NHS hospital trusts, according to UCL.',
        watch: 'The Singapore Pharmacy Council registers only degrees on its list, and also asks for registration and a practising licence in the country where you studied, a job offer from a training institution it approves, 3 to 12 months of pre-registration training here, and two exams. After the MPharm, UCL says you do a year of foundation training and pass the UK pharmacy registration exam. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/pharmacy-mpharm',
        src: ['qs-pharm26', 'ucl-mpharm', 'uk-living', 'spc-list', 'spc-foreign'], links: ['ukvisa', 'spc']
      },
      alts: []
    },
    // QS 2026 Medicine: 1 Harvard, 2 Oxford, 3 Stanford, 4 Johns Hopkins, 5 Cambridge, 6 UCL, 7 Imperial, 10 Karolinska, 11 King's, 12 Toronto,
    // 17 NUS, 20 Melbourne, 22 Edinburgh. Best: UCL, the highest-ranked school whose own page gave a fee and whose MB BS is on the Singapore Medical
    // Council's list (the version effective 1 September 2022, the latest copy read in full). Left out: Oxford and Cambridge (ranked higher and also
    // on the list, but their fee pages could not be read); the US schools (the US has no visa money-for-living figure, and graduates must also pass
    // the USMLE); Melbourne (fee page not readable). No alternatives are listed yet.
    medicine: {
      best: {
        country: 'United Kingdom', school: 'UCL (UCL Medical School)', course: 'MBBS BSc Medicine', yrs: 6,
        tuition: [49667, 49667], feeLabel: 'Average tuition', cur: 'GBP', living: 13761,
        standing: 'Ranked 6th in the world for Medicine (QS World University Rankings by Subject 2026)',
        why: 'An option if you miss a local place at NUS, NTU or Duke-NUS: UCL’s MB BS is on the list of degrees the Singapore Medical Council can register, but it costs several times as much as a local place.',
        env: 'Taught in English in London. The six years are five of medicine and a one-year iBSc in year 3.',
        watch: 'The Singapore Medical Council registers only listed degrees, counts only the programme as it was when listed, and asks you to pass the licensing exams of the country where you studied. UCL’s page lists five annual instalments for the six years: two of £40,800 and three of £72,134, about £298,000 in all, and the average here spreads that over six years. The fees are for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/medicine-mbbs-bsc',
        src: ['qs-med26', 'ucl-mbbs', 'uk-living', 'smc-notes'], links: ['ukvisa', 'smc']
      },
      alts: []
    },
    // QS 2026 Biological Sciences (the closest QS subject): 1 Harvard, 2 MIT, 3 Oxford, 4 Stanford, 5 Cambridge, =7 Imperial, =9 UCL, 13 NUS,
    // 14 ETH Zurich, 16 Toronto, 19 Edinburgh. Best: UCL, the highest-ranked school whose own page gave a fee. Left out: Oxford (ranked higher,
    // fee page not readable), the US schools and ETH (taught in German at bachelor's level), Toronto (fee not checked). No alternatives are listed yet.
    biomedical: {
      best: {
        country: 'United Kingdom', school: 'UCL', course: 'BSc Biomedical Sciences', yrs: 3,
        tuition: [44400, 44400], cur: 'GBP', living: 13761,
        standing: 'Ranked joint 9th in the world for Biological Sciences, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'A three-year bachelor’s at one of the top ten schools in the world for biological sciences. Oxford ranks 3rd, but its fee could not be confirmed from its own page.',
        env: 'Taught in English in London.',
        watch: 'The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.ucl.ac.uk/study/prospective-students/undergraduate/courses/biomedical-sciences-bsc',
        src: ['qs-bio26', 'ucl-biomed', 'uk-living'], links: ['ukvisa']
      },
      alts: []
    },
    // Agency route: no overseas study needed. MOE's Diploma in Education page ('moe-diped'): a contract teaching stint comes first,
    // and "Your training at NIE is fully funded by MOE".
    teaching: {
      agency: 'Teaching in Singapore’s schools runs through MOE and NIE: MOE takes you on for a contract teaching stint first, then fully funds your training at NIE, so there’s no need to study overseas. Read MOE’s “become a teacher” page for entry requirements and pay.',
      src: ['moe-diped']
    }
  };

  /* Tech and engineering fields. Added with Object.assign so the lines above stay untouched. Sources and the regulator's contact first, then the
     options. QS pages return 403 to scripts, so the ranks below were read from a mirror of the QS 2026 tables (xuanxiao.org) and cross-checked
     against university press releases; the QS links need a check by hand in a browser. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'qs-cs26': ['QS World University Rankings by Subject 2026: Computer Science and Information Systems', 'https://www.topuniversities.com/university-subject-rankings/computer-science-information-systems'],
    'qs-ds26': ['QS World University Rankings by Subject 2026: Data Science and Artificial Intelligence', 'https://www.topuniversities.com/university-subject-rankings/data-science-artificial-intelligence'],
    'qs-civil26': ['QS World University Rankings by Subject 2026: Engineering, Civil and Structural', 'https://www.topuniversities.com/university-subject-rankings/civil-structural-engineering'],
    'qs-mech26': ['QS World University Rankings by Subject 2026: Engineering, Mechanical, Aeronautical and Manufacturing', 'https://www.topuniversities.com/university-subject-rankings/mechanical-aeronautical-manufacturing-engineering'],
    'qs-eee26': ['QS World University Rankings by Subject 2026: Engineering, Electrical and Electronic', 'https://www.topuniversities.com/university-subject-rankings/electrical-electronic-engineering'],
    'mit-budget26': ['MIT Student Financial Services, undergraduate student budget for 2026–27', 'https://sfs.mit.edu/undergraduate-students/the-cost-of-attendance/annual-student-budget/'],
    'mit-afford': ['MIT Admissions, paying for MIT (financial aid)', 'https://mitadmissions.org/afford/'],
    'mit-eecs': ['MIT EECS, undergraduate programmes (Courses 6-1 to 6-14)', 'https://www.eecs.mit.edu/academics/undergraduate-programs/'],
    'mit-meche': ['MIT Mechanical Engineering, undergraduate degrees', 'https://meche.mit.edu/education/undergraduate'],
    'mit-cee': ['MIT Civil and Environmental Engineering, undergraduate degrees', 'https://cee.mit.edu/academics/undergraduate/'],
    'imp-civil27': ['Imperial College London, Civil Engineering MEng: fee for 2027 entry', 'https://www.imperial.ac.uk/study/courses/undergraduate/civil-engineering/'],
    'imp-mech27': ['Imperial College London, Mechanical Engineering MEng: fee for 2027 entry', 'https://www.imperial.ac.uk/study/courses/undergraduate/mechanical-engineering/'],
    'imp-eee27': ['Imperial College London, Electrical and Electronic Engineering MEng: fee for 2027 entry', 'https://www.imperial.ac.uk/study/courses/undergraduate/electrical-electronic-engineering-meng/'],
    'imp-comp27': ['Imperial College London, Computing MEng: fee for 2027 entry', 'https://www.imperial.ac.uk/study/courses/undergraduate/computing-meng/'],
    'imp-sec27': ['Imperial College London, Computing (Security and Reliability) MEng: fee for 2027 entry', 'https://www.imperial.ac.uk/study/courses/undergraduate/computing-security-reliability-meng/'],
    'hku-cds': ['HKU, Computing and Data Science (BEng in Computer Science; BEng in Artificial Intelligence and Data Science)', 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/computing-and-data-science'],
    'hku-civil': ['HKU, Bachelor of Engineering in Civil Engineering', 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-engineering-civil-engineering'],
    'peb-req': ['Professional Engineers Board, requirements to register as a professional engineer (page updated 6 October 2026)', 'https://www1.peb.gov.sg/peregistration/requirements/'],
    'peb-qual26': ['Professional Engineers Board, updates to approved qualifications (5 October 2026)', 'https://www1.peb.gov.sg/news/updates-to-approved-qualifications-for-registration-as-professional-engineers/']
  });
  Object.assign(window.SerasiPathways.CONTACTS, {
    peb: { n: 'Professional Engineers Board', url: 'https://www1.peb.gov.sg', w: 'Registering as a professional engineer, and the degrees it approves' }
  });

  // What the Professional Engineers Board's own pages support, for the civil, mechanical and electrical options.
  const PEB_WATCH = 'Singapore’s Professional Engineers Board registers an engineer only with a degree on its Approved Qualifications Notification, four years’ practical experience, and two exams and an interview (page updated 6 October 2026). Its pages do not say whether this degree is listed, so check before you enrol; a degree that is not listed may still be considered if you add a Master’s in the same branch from NTU, NUS or SIT, or a PhD, but that is the Board’s choice. It does not accept distance-learning or twinning programmes.';
  // MIT's yearly budget for 2026–27: tuition $66,720; everything else (housing $14,090, food $8,104, books $930, personal $2,496, student life fee $420) is $26,040.
  const MIT_COST = { yrs: 4, tuition: [66720, 66720], cur: 'USD', living: 26040 };
  const MIT_WATCH = 'The living figure is MIT’s own published 2026–27 budget for housing, food, books, personal costs and a student life fee, not an official visa figure and not a typical budget. Fees rise most years.';
  const MIT_ENV = 'Taught in English. Four years is the usual length of a US bachelor’s (compiled by Serasi). MIT says its aid “meets 100% of your demonstrated financial need”.';
  // Imperial's 2027-entry overseas fee is £47,800 a year for every course below; the living figure is the UK visa minimum for 9 months in London.
  const IMP_COST = { tuition: [47800, 47800], cur: 'GBP', living: 13761 };
  const IMP_WATCH = 'The fee is for 2027 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.';
  // HKU's 2027/28 non-local fee for the STEM faculties is HK$280,000 a year; living is the top of the hall range plus up to HK$50,000 a day, as in the architecture options.
  const HKU_COST = { tuition: [280000, 280000], cur: 'HKD', living: 87940 };
  const HKU_WATCH = 'The fee is for 2027/28. The living figure is HKU’s estimate: the dearest hall place plus up to HK$50,000 for daily costs. HKU’s page does not state the medium of instruction (compiled by Serasi: HKU’s undergraduate courses are normally taught in English), so check the course page.';

  Object.assign(OPTIONS, {
    // QS 2026 Computer Science and Information Systems: 1 MIT, 2 Stanford, 3 Carnegie Mellon, =4 NUS and Oxford, 6 Berkeley, 7 Harvard, 8 Cambridge,
    // 9 NTU, 10 ETH Zurich, 11 Tsinghua, 12 Imperial, 13 Toronto, 18 Science Tokyo, 20 UCL, 26 TUM, =27 HKU, 31 Melbourne.
    // Best: MIT, first. Alternatives, one per country: Imperial, the highest-ranked UK school whose own page gave a fee (Oxford, =4th, returns an
    // error page, and Cambridge, 8th, adds a college fee that could not be confirmed); HKU, the highest-ranked school in Hong Kong. Left out: Stanford,
    // Carnegie Mellon, Berkeley, Harvard (same country as MIT); ETH, TUM and EPFL (bachelor's not in English); Toronto (13th, fee and proof of funds not checked).
    computing: {
      best: {
        country: 'United States', school: 'MIT', course: 'BS Computer Science and Engineering (Course 6-3)', ...MIT_COST,
        standing: 'Ranked 1st in the world for Computer Science and Information Systems (QS World University Rankings by Subject 2026)',
        why: 'The top-ranked computer science school in the world, and MIT says its aid “meets 100% of your demonstrated financial need”, so the headline fee is not always what you pay.',
        env: MIT_ENV,
        watch: MIT_WATCH,
        url: 'https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-3-computer-science-and-engineering/',
        src: ['qs-cs26', 'mit-budget26', 'mit-afford', 'mit-eecs']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'Imperial College London', course: 'Computing MEng', yrs: 4, ...IMP_COST,
          standing: 'Ranked 12th in the world for Computer Science and Information Systems (QS World University Rankings by Subject 2026)',
          why: 'The highest-ranked UK school whose own page gave a fee. Imperial reports that 88% of its 2023-24 Computing graduates were in highly skilled work or further study.',
          env: 'Taught in English in London. The four years are an integrated master’s, with an industrial placement in year 3.',
          watch: IMP_WATCH,
          url: 'https://www.imperial.ac.uk/study/courses/undergraduate/computing-meng/',
          src: ['qs-cs26', 'imp-comp27', 'uk-living'], links: ['ukvisa']
        },
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'BEng Computer Science', yrs: 4, ...HKU_COST,
          standing: 'Ranked joint 27th in the world for Computer Science and Information Systems (QS World University Rankings by Subject 2026)',
          why: 'Close to home, with a four-year bachelor’s that the Hong Kong Institution of Engineers has accredited, according to HKU.',
          env: 'In Hong Kong, a short flight from Singapore.',
          watch: HKU_WATCH,
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/computing-and-data-science',
          src: ['qs-cs26', 'hku-cds', 'hku-fees'], links: ['hkimmd']
        }
      ]
    },
    // QS 2026 Data Science and Artificial Intelligence: 1 MIT, 2 Stanford, 3 NUS, 4 NTU, 5 Carnegie Mellon, =6 Berkeley and Oxford, 8 Harvard,
    // 9 Cambridge, 10 Tsinghua, 11 ETH Zurich, 13 Toronto, =15 EPFL and Imperial, 18 HKU, 22 UCL, 25 HKUST, 31 Melbourne.
    // Best: MIT. Alternatives: Imperial (Oxford and Cambridge left out as for computing), whose Computing MEng has machine learning in its core
    // modules but no data science degree; HKU's new BEng in AI and Data Science, ranked 18th, with accreditation still to come.
    'data-ai': {
      best: {
        country: 'United States', school: 'MIT', course: 'BS Artificial Intelligence and Decision Making (Course 6-4)', ...MIT_COST,
        standing: 'Ranked 1st in the world for Data Science and Artificial Intelligence (QS World University Rankings by Subject 2026)',
        why: 'The top-ranked school in the world for data science and AI, and MIT says its aid “meets 100% of your demonstrated financial need”. MIT also offers a Computer Science, Economics, and Data Science degree (Course 6-14).',
        env: MIT_ENV,
        watch: MIT_WATCH,
        url: 'https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-4-artificial-intelligence-and-decision-making/',
        src: ['qs-ds26', 'mit-budget26', 'mit-afford', 'mit-eecs']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'Imperial College London', course: 'Computing MEng', yrs: 4, ...IMP_COST,
          standing: 'Ranked joint 15th in the world for Data Science and Artificial Intelligence (QS World University Rankings by Subject 2026)',
          why: 'The highest-ranked UK school whose own page gave a fee. Machine learning is one of the core modules of the degree.',
          env: 'Taught in English in London. The four years are an integrated master’s, with an industrial placement in year 3.',
          watch: 'Imperial’s degree is in computing, not data science. ' + IMP_WATCH,
          url: 'https://www.imperial.ac.uk/study/courses/undergraduate/computing-meng/',
          src: ['qs-ds26', 'imp-comp27', 'uk-living'], links: ['ukvisa']
        },
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'BEng Artificial Intelligence and Data Science', yrs: 4, ...HKU_COST,
          standing: 'Ranked 18th in the world for Data Science and Artificial Intelligence (QS World University Rankings by Subject 2026)',
          why: 'Close to home, and ranked in the top 20 for the subject.',
          env: 'In Hong Kong, a short flight from Singapore.',
          watch: 'This is a new programme: HKU says it will seek accreditation once the first cohort graduates, whereas its BEng in Computer Science is already accredited. ' + HKU_WATCH,
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/computing-and-data-science',
          src: ['qs-ds26', 'hku-cds', 'hku-fees'], links: ['hkimmd']
        }
      ]
    },
    // Cybersecurity has no QS subject, so the closest is Computer Science and Information Systems (ranks as for computing). Best: the highest-ranked
    // school we found with a degree named for security. MIT has none among its nine EECS programmes (Stanford and Carnegie Mellon were not checked),
    // so Imperial's Computing (Security and Reliability) MEng, 12th, is the best match. MIT is kept as the alternative for its standing. No other
    // alternative is listed yet: a search found no cybersecurity bachelor's at HKU, HKUST or CUHK.
    cybersecurity: {
      best: {
        country: 'United Kingdom', school: 'Imperial College London', course: 'Computing (Security and Reliability) MEng', yrs: 4, ...IMP_COST,
        standing: 'Ranked 12th in the world for Computer Science and Information Systems, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'The highest-ranked school we found with a degree built around security. Imperial says you “acquire deep understanding of software security, reliability and privacy issues”, with Network and Web Security in year 3 and Advanced Computer Security, Privacy Engineering and Cryptography as options in year 4.',
        env: 'Taught in English in London. The four years are an integrated master’s.',
        watch: 'QS ranks computer science, not cybersecurity, so the rank is for the wider subject. ' + IMP_WATCH,
        url: 'https://www.imperial.ac.uk/study/courses/undergraduate/computing-security-reliability-meng/',
        src: ['qs-cs26', 'imp-sec27', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'United States', school: 'MIT', course: 'BS Computer Science and Engineering (Course 6-3)', ...MIT_COST,
          standing: 'Ranked 1st in the world for Computer Science and Information Systems, the closest QS subject (QS World University Rankings by Subject 2026)',
          why: 'The top-ranked computer science school in the world, with a very strong standing for any computing career, and MIT says its aid “meets 100% of your demonstrated financial need”.',
          env: MIT_ENV,
          watch: 'MIT has no degree named for cybersecurity among its nine EECS programmes; you would study computer science and choose security subjects. ' + MIT_WATCH,
          url: 'https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-3-computer-science-and-engineering/',
          src: ['qs-cs26', 'mit-budget26', 'mit-afford', 'mit-eecs']
        }
      ]
    },
    // QS 2026 Engineering, Civil and Structural: 1 MIT, 2 NUS, 3 Berkeley, 4 ETH Zurich, 5 Delft, 6 NTU, 7 Imperial, 8 Tsinghua, =9 Stanford and
    // Cambridge, 12 Oxford, 15 Tokyo, 18 PolyU, =20 HKU and UBC, =22 UNSW and Toronto, =25 UCL. Best: MIT. Alternatives: Imperial, the highest-ranked
    // English-taught school outside the US whose fee was readable (ETH and Delft teach the bachelor's in German and Dutch; Cambridge adds a college fee);
    // HKU, the highest-ranked school in Hong Kong (PolyU, 18th, was not checked). Left out: Berkeley and Stanford (same country as MIT).
    'civil-eng': {
      best: {
        country: 'United States', school: 'MIT', course: 'BS in Engineering, civil and environmental (Course 1-ENG)', ...MIT_COST,
        standing: 'Ranked 1st in the world for Engineering, Civil and Structural (QS World University Rankings by Subject 2026)',
        why: 'The top-ranked civil engineering school in the world. MIT describes its curriculum as ABET-accredited, and offers an optional fifth-year Master of Engineering.',
        env: MIT_ENV,
        watch: PEB_WATCH + ' ' + MIT_WATCH,
        url: 'https://cee.mit.edu/academics/undergraduate/',
        src: ['qs-civil26', 'mit-budget26', 'mit-afford', 'mit-cee', 'peb-req', 'peb-qual26'], links: ['peb']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'Imperial College London', course: 'Civil Engineering MEng', yrs: 4, ...IMP_COST,
          standing: 'Ranked 7th in the world for Engineering, Civil and Structural (QS World University Rankings by Subject 2026)',
          why: 'Imperial says the degree is accredited for the Engineering Council by the Joint Board of Moderators and meets the educational requirements for Chartered Engineer registration in the UK.',
          env: 'Taught in English in London. The four years are an integrated master’s.',
          watch: PEB_WATCH + ' ' + IMP_WATCH,
          url: 'https://www.imperial.ac.uk/study/courses/undergraduate/civil-engineering/',
          src: ['qs-civil26', 'imp-civil27', 'uk-living', 'peb-req', 'peb-qual26'], links: ['ukvisa', 'peb']
        },
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'BEng Civil Engineering', yrs: 4, ...HKU_COST,
          standing: 'Ranked joint 20th in the world for Engineering, Civil and Structural (QS World University Rankings by Subject 2026)',
          why: 'Close to home. HKU says the Hong Kong Institution of Engineers accredits the degree through the Washington Accord, and that its graduates join the MTR, developers and consulting and construction firms.',
          env: 'In Hong Kong, a short flight from Singapore.',
          watch: PEB_WATCH + ' ' + HKU_WATCH,
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-engineering-civil-engineering',
          src: ['qs-civil26', 'hku-civil', 'hku-fees', 'peb-req', 'peb-qual26'], links: ['hkimmd', 'peb']
        }
      ]
    },
    // QS 2026 Engineering, Mechanical, Aeronautical and Manufacturing: 1 MIT, 2 Stanford, 3 NUS, 4 Cambridge, 5 NTU, 6 ETH Zurich, =7 Harvard and
    // Oxford, =9 Delft and Imperial, 11 Berkeley, 12 Tsinghua, 19 TUM, =35 Toronto. Best: MIT. Alternative: Imperial, the highest-ranked English-taught
    // school outside the US whose fee was readable. No third option is listed yet: Toronto (=35th) and a school in Hong Kong were not checked.
    'mechanical-eng': {
      best: {
        country: 'United States', school: 'MIT', course: 'BS Mechanical Engineering (Course 2)', ...MIT_COST,
        standing: 'Ranked 1st in the world for Engineering, Mechanical, Aeronautical and Manufacturing (QS World University Rankings by Subject 2026)',
        why: 'The top-ranked mechanical engineering school in the world. MIT calls Course 2 “a traditional program which prepares students for a broad range of career choices” and also offers a Mechanical and Ocean Engineering degree (Course 2-OE).',
        env: MIT_ENV,
        watch: PEB_WATCH + ' ' + MIT_WATCH,
        url: 'https://meche.mit.edu/education/undergraduate',
        src: ['qs-mech26', 'mit-budget26', 'mit-afford', 'mit-meche', 'peb-req', 'peb-qual26'], links: ['peb']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'Imperial College London', course: 'Mechanical Engineering MEng', yrs: 4, ...IMP_COST,
          standing: 'Ranked joint 9th in the world for Engineering, Mechanical, Aeronautical and Manufacturing (QS World University Rankings by Subject 2026)',
          why: 'The highest-ranked UK school whose own page gave a fee. A year in industry is an option, and adds a fifth year.',
          env: 'Taught in English in London. The four years are an integrated master’s.',
          watch: PEB_WATCH + ' ' + IMP_WATCH,
          url: 'https://www.imperial.ac.uk/study/courses/undergraduate/mechanical-engineering/',
          src: ['qs-mech26', 'imp-mech27', 'uk-living', 'peb-req', 'peb-qual26'], links: ['ukvisa', 'peb']
        }
      ]
    },
    // QS 2026 Engineering, Electrical and Electronic: 1 MIT, 2 Stanford, 3 NUS, 4 NTU, 5 Berkeley, 6 Cambridge, 7 Oxford, 8 ETH Zurich, 9 Imperial,
    // 10 EPFL, 11 Tsinghua, 14 Delft, =16 Toronto, 19 TUM, =20 Tokyo, 29 UNSW, 33 HKUST, 39 UCL. Best: MIT. Alternative: Imperial. No third option is
    // listed yet: Toronto (=16th) and HKUST (33rd) were not checked.
    'electrical-eng': {
      best: {
        country: 'United States', school: 'MIT', course: 'BS Electrical Science and Engineering (Course 6-1)', ...MIT_COST,
        standing: 'Ranked 1st in the world for Engineering, Electrical and Electronic (QS World University Rankings by Subject 2026)',
        why: 'The top-ranked electrical engineering school in the world. MIT also offers Electrical Engineering with Computing (Course 6-5) and Electrical Engineering and Computer Science (Course 6-2).',
        env: MIT_ENV,
        watch: PEB_WATCH + ' ' + MIT_WATCH,
        url: 'https://www.eecs.mit.edu/academics/undergraduate-programs/curriculum/6-1-electrical-science-and-engineering/',
        src: ['qs-eee26', 'mit-budget26', 'mit-afford', 'mit-eecs', 'peb-req', 'peb-qual26'], links: ['peb']
      },
      alts: [
        {
          country: 'United Kingdom', school: 'Imperial College London', course: 'Electrical and Electronic Engineering MEng', yrs: 4, ...IMP_COST,
          standing: 'Ranked 9th in the world for Engineering, Electrical and Electronic (QS World University Rankings by Subject 2026)',
          why: 'The highest-ranked UK school whose own page gave a fee. Imperial says the Institution of Engineering and Technology accredits the degree for the Engineering Council.',
          env: 'Taught in English in London. The four years are an integrated master’s.',
          watch: PEB_WATCH + ' ' + IMP_WATCH,
          url: 'https://www.imperial.ac.uk/study/courses/undergraduate/electrical-electronic-engineering-meng/',
          src: ['qs-eee26', 'imp-eee27', 'uk-living', 'peb-req', 'peb-qual26'], links: ['ukvisa', 'peb']
        }
      ]
    }
  });

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
