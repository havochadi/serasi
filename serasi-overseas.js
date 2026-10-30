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
    'smc-notes': ['Singapore Medical Council, notes on the Second Schedule of the Medical Registration Act (registrable basic medical qualifications)', 'https://go.gov.sg/important-notes-on-the-mra-second-schedule-list-of-registrable-basic-medical-qualifications'],
    // Design and media fields.
    'qs-art26': ['QS World University Rankings by Subject 2026: Art & Design', 'https://www.topuniversities.com/university-subject-rankings/art-design'],
    'ual-interior': ['UAL, BA (Hons) Interior Design (Chelsea): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/architecture-spatial-and-interior-design/undergraduate/ba-hons-interior-design-chelsea'],
    'rmit-interior': ['RMIT, Bachelor of Interior Design (Honours): 2027 fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/honours-degrees/bachelor-of-interior-design-honours-bh115'],
    'polyu-fees': ['PolyU, undergraduate fees for non-local students, with estimated living costs', 'https://www.polyu.edu.hk/study/ug/fees-and-scholarships/fees'],
    'polyu-design': ['PolyU, BA (Hons) Scheme in Design (4-year): specialisms', 'https://www.polyu.edu.hk/sd/study/ug/scheme-in-design/?sc_lang=en'],
    'ual-graphic': ['UAL, BA (Hons) Graphic Communication Design (Central Saint Martins): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/communication-and-graphic-design/undergraduate/ba-hons-graphic-communication-design-csm'],
    'rmit-graphic': ['RMIT, Bachelor of Graphic Design: 2027 fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-graphic-design-bp115'],
    'ual-fashion': ['UAL, BA (Hons) Fashion Design and Development (London College of Fashion): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/fashion-design/undergraduate/ba-hons-fashion-design-and-development-lcf'],
    'rmit-fashion': ['RMIT, Bachelor of Fashion (Design): 2027 international fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-fashion-design-bp328/apply-now'],
    'polyu-fashion': ['PolyU, BA (Hons) Scheme in Fashion (4-year)', 'https://www.polyu.edu.hk/itc/study/ug/'],
    'ual-animation': ['UAL, BA (Hons) Animation (London College of Communication): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/undergraduate/ba-hons-animation-lcc'],
    'rmit-animation': ['RMIT, Bachelor of Design (Animation and Interactive Media): 2027 international fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-design-animation-and-interactive-media-bp203/apply-now'],
    'qs-comm26': ['QS World University Rankings by Subject 2026: Communication & Media Studies', 'https://www.topuniversities.com/university-subject-rankings/communication-media-studies'],
    'uva-comm': ['University of Amsterdam, BSc Communication Science (taught in English)', 'https://www.uva.nl/en/programmes/bachelors/communication-science/communication-science.html'],
    'uva-fees': ['University of Amsterdam, tuition fees (institutional fees for 2027-2028, by faculty)', 'https://www.uva.nl/en/education/fees-and-funding/tuition-fees/tuition-fees.html'],
    'cuhk-commn': ['CUHK, Journalism and Communication (four-year undergraduate programme)', 'https://admission.cuhk.edu.hk/programme/commn/'],
    'cuhk-fees': ['CUHK, fees and living costs for non-local undergraduates (2027-28 rate; hostel fee 2026-27)', 'https://admission.cuhk.edu.hk/fees-financing-your-studies/fees/'],
    'leiden-ling': ['Leiden University, BA Linguistics (taught in English)', 'https://www.universiteitleiden.nl/en/education/study-programmes/bachelor/linguistics'],
    'leiden-fees': ['Leiden University, bachelor’s tuition fees (institutional fee for 2027-2028, by faculty)', 'https://www.universiteitleiden.nl/en/education/admission-and-application/bachelors/tuition-fee'],
    'cuhk-ling': ['CUHK, major programme in Linguistics', 'https://ling.cuhk.edu.hk/programmes/undergraduate-programme/major-programme-in-linguistics/'],
    'qs-ling26': ['QS World University Rankings by Subject 2026: Linguistics', 'https://www.topuniversities.com/university-subject-rankings/linguistics'],
    'lancs-ling': ['Lancaster University, Linguistics BA Hons (Q100): fees for 2027/28 entrants', 'https://www.lancaster.ac.uk/study/undergraduate/courses/linguistics-ba-hons-q100/2026/'],
    'qut-comm': ['QUT, Bachelor of Communication (Media and Communication Industries): 2027 international fee', 'https://www.qut.edu.au/courses/bachelor-of-communication-media-and-communication-industries']
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
    'sasw-recog': ['SASW, accreditation: social work qualifications from overseas and the bodies it recognises', 'https://accreditation.sasw.org.sg/recognition']
  });

  /* Official guides and regulators named by the options' links. */
  Object.assign(window.SerasiPathways.CONTACTS, {
    boa: { n: 'Board of Architects', url: 'https://www.boa.gov.sg', w: 'Registering as an architect, and the degrees it recognises' },
    studynl: { n: 'Study in NL', url: 'https://www.studyinnl.org', w: 'Official guide to studying in the Netherlands' },
    hkimmd: { n: 'Hong Kong Immigration Department', url: 'https://www.immd.gov.hk/eng/services/visas/study.html', w: 'Student visas for Hong Kong' },
    spc: { n: 'Singapore Pharmacy Council', url: 'https://www.spc.gov.sg', w: 'Registering as a pharmacist, including overseas degrees' }
  });

  /* Sources and contacts for the business, law and services fields (Task 9), checked in October 2026. QS blocks scripts, so its subject pages
     are for a person with a browser; the ranks were read from a mirror of each table and, where the school's own page gives its rank, checked there. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'qs-law26': ['QS World University Rankings by Subject 2026: Law and Legal Studies', 'https://www.topuniversities.com/university-subject-rankings/law-legal-studies'],
    'mlaw-bar': ['Ministry of Law, admission to the Singapore Bar: admission requirements (points to the Institute of Legal Education for degrees)', 'https://www.mlaw.gov.sg/admission-to-the-bar/admission-requirements/'],
    'sile-qp': ['Singapore Institute of Legal Education, Qualified Person: the overseas universities whose law degrees count (page updated 9 October 2025)', 'https://www.sile.edu.sg/for-overseas-graduates/qualified-person/'],
    'cam-law': ['Cambridge, Law BA: a 3-year course', 'https://www.undergraduate.study.cam.ac.uk/courses/law'],
    'cam-fees-pdf': ['Cambridge, undergraduate tuition fees 2027-28: University fee and each College’s fee for international students', 'https://www.undergraduate.study.cam.ac.uk/files/2026-09/undergraduate_tuition_fees_2027-28.pdf'],
    'uk-living-out': ['GOV.UK, Student visa: money for living costs outside London, 2026', 'https://www.gov.uk/student-visa/money'],
    'monash-guide': ['Monash, 2027 international undergraduate course guide (Bachelor of Laws (Honours), Clayton, 4 years)', 'https://www.monash.edu/__data/assets/pdf_file/0005/3941744/undergraduate-international-course-guide.pdf'],
    'auck-llb': ['University of Auckland, Bachelor of Laws (LLB): a four-year, 480-point degree; international fee for 2026', 'https://study.auckland.ac.nz/ords/r/uoa/catalogue/program?p5_code=LLB'],
    'auck-rank': ['University of Auckland, Auckland Law School ranking and reputation (QS 2026)', 'https://auckland.ac.nz/en/law/about-auckland-law-school/ranking-and-repuation.html'],
    'nz-living': ['Immigration New Zealand, student fund requirements: NZ$20,000 a year for tertiary study', 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/student-fund-requirements/']
  });
  Object.assign(window.SerasiPathways.CONTACTS, {
    sile: { n: 'Singapore Institute of Legal Education', url: 'https://www.sile.edu.sg', w: 'The Qualified Person route for law graduates from overseas, and the Bar exams' },
    studynz: { n: 'Study with New Zealand', url: 'https://www.studywithnewzealand.govt.nz/', w: 'Official guide to studying in New Zealand' }
  });
  Object.assign(window.SerasiPathways.SOURCES, {
    'qs-hosp26': ['QS World University Rankings by Subject 2026: Hospitality and Leisure Management', 'https://www.topuniversities.com/university-subject-rankings/hospitality-leisure-management'],
    'ehl-fees': ['EHL, Bachelor of Science in International Hospitality Management: tuition and fees, September 2027 and February 2028 intakes (version of January 2026)', 'https://www.ehl.edu/hubfs/DL_Docs/Tuition_Fees_BOS_EN.pdf'],
    'ch-living': ['Zurich University of the Arts, residence permit for students from outside the EU/EFTA: proof of CHF 21,000 (2026)', 'https://www.zhdk.ch/file/live/92/92513af55ae3169a4ffd31a00b82a0d670b7406c/2026_e_cl_nicht_eu_efta_komplett.pdf'],
    'hth-bsc': ['Hotelschool The Hague, Bachelor in Hospitality Management: fees for non-EEA students, 2027 intakes', 'https://www.hotelschool.nl/bachelor-hospitality-management/'],
    'hth-qs': ['Hotelschool The Hague, ranked 7th in the world in the QS subject rankings 2026', 'https://www.hotelschool.nl/blog/news/qs-ranking-by-subject-2026/'],
    'polyu-qs': ['PolyU, ranked 15th in the world for Hospitality and Leisure Management, QS subject rankings 2026', 'https://www.polyu.edu.hk/en/media/media-releases/2026/0325_polyu-ranked-top-30-globally-for-five-subjects-in-qs-world-university-rankings-by-subject-2026/']
  });
  Object.assign(window.SerasiPathways.SOURCES, {
    'qs-biz26': ['QS World University Rankings by Subject 2026: Business and Management Studies', 'https://www.topuniversities.com/university-subject-rankings/business-management-studies'],
    'qs-accfin26': ['QS World University Rankings by Subject 2026: Accounting and Finance', 'https://www.topuniversities.com/university-subject-rankings/accounting-finance'],
    'lse-mgmt': ['LSE, BSc Management: overseas fee for 2027/28 entrants', 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-management'],
    'lse-af': ['LSE, BSc Accounting and Finance: overseas fee for 2027/28 entrants', 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-accounting-and-finance'],
    'lse-fin': ['LSE, BSc Finance: overseas fee for 2027/28 entrants', 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-finance'],
    'rsm-iba': ['Rotterdam School of Management, BSc International Business Administration: 2027-2028 fee for non-EEA students', 'https://www.rsm.nl/education/bachelor/bsc-international-business-administration-iba/'],
    'hku-bba': ['HKU, Bachelor of Business Administration', 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-business-administration'],
    'hku-baf': ['HKU, Bachelor of Business Administration in Accounting and Finance', 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-business-administration-accounting-and-finance'],
    'hku-befin': ['HKU Business School, undergraduate programmes (Bachelor of Economics and Finance, a 4-year course)', 'https://ug.hkubs.hku.hk/admission/information-day/programmes'],
    'isca-deg': ['ISCA, list of recognised accounting degrees (updated August 2024)', 'https://isca.org.sg/docs/default-source/governance-member-sevices/list-of-recognised-accounting-degrees-for-associate_updated-in-august-2024.pdf?sfvrsn=17394e7d_2']
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
    },

    // QS 2026 Art & Design (the nearest QS subject for interior design, which has no table of its own): 1 Royal College of Art, 2 UAL, 3 The New School,
    // 4 RISD, 5 Pratt, 6 MIT, 7 Politecnico di Milano, 8 Glasgow School of Art, 9 Aalto, 10 Design Academy Eindhoven, 13 TU Delft, =19 RMIT, 24 PolyU.
    // The ranks were read from a site that republishes the QS table (QS's own page turns scripts away), and UAL's and RMIT's places match their news.
    // Best: UAL, the highest-ranked school with undergraduate degrees (the Royal College of Art lists only postgraduate courses), taught in English,
    // with a fee on its course page. Alternatives, one per country: RMIT (=19), whose interior design degree is taught in English, and PolyU (24).
    // Left out: the US schools (the US has no official money-for-living figure for a visa); Glasgow (same country as UAL); Politecnico di Milano, Aalto,
    // Design Academy Eindhoven and TU Delft (higher ranked, but their bachelor's language and non-EU fees were not checked in the time allowed).
    'interior-design': {
      best: {
        country: 'United Kingdom', school: 'University of the Arts London (Chelsea College of Arts)', course: 'BA (Hons) Interior Design', yrs: 3,
        tuition: [31510, 31510], cur: 'GBP', living: 13761,
        standing: 'Ranked 2nd in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for interior design',
        why: 'A three-year degree at the second-ranked art and design university in the world. The Royal College of Art ranks 1st but lists only postgraduate courses.',
        env: 'Taught in English at Chelsea College of Arts in London.',
        watch: 'The fee is for September 2027 entry, a year after one starting in 2026 would pay, and UAL says international fees may rise by up to 5% in each later year of a course. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.arts.ac.uk/subjects/architecture-spatial-and-interior-design/undergraduate/ba-hons-interior-design-chelsea',
        src: ['qs-art26', 'ual-interior', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Australia', school: 'RMIT University', course: 'Bachelor of Interior Design (Honours)', yrs: 4,
          tuition: [49920, 49920], cur: 'AUD', living: 29710,
          standing: 'Ranked joint 19th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for interior design',
          why: 'A four-year honours degree in Melbourne, taught in English, with RMIT’s fee on its course page.',
          env: 'Based at RMIT’s city campus in Melbourne.',
          watch: 'The fee is RMIT’s 2027 figure. Australian fees rise most years. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/honours-degrees/bachelor-of-interior-design-honours-bh115',
          src: ['qs-art26', 'rmit-interior', 'au-visa'], links: ['studyau']
        },
        {
          country: 'Hong Kong', school: 'The Hong Kong Polytechnic University (PolyU)', course: 'BA (Hons) Scheme in Design, with the Interior Design specialism', yrs: 4,
          tuition: [240000, 240000], cur: 'HKD', living: 90272,
          standing: 'Ranked 24th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for interior design',
          why: 'A four-year design degree close to home. Interior Design is one of nine specialisms.',
          env: 'The programme page does not say what language the teaching is in, so check before you apply.',
          watch: 'PolyU’s page does not say which intake year the HK$240,000 tuition applies to. The living figure is PolyU’s own estimate for a non-local student (hall place HK$18,515, meals HK$53,040, personal costs HK$18,717), not a visa minimum.',
          url: 'https://www.polyu.edu.hk/sd/study/ug/scheme-in-design/?sc_lang=en',
          src: ['qs-art26', 'polyu-fees', 'polyu-design'], links: ['hkimmd']
        }
      ]
    },

    // QS 2026 Art & Design (QS has no separate table for graphic or UX design); same ranks and the same choices as interior design above.
    // UAL's Graphic Communication Design is the Central Saint Martins degree; its page covers computation and digital media but does not name UX.
    // RMIT's Bachelor of Graphic Design has an Experience Design major (interaction and service design). PolyU's Design scheme has Advertising,
    // Information and Interaction Design specialisms.
    'graphic-ux': {
      best: {
        country: 'United Kingdom', school: 'University of the Arts London (Central Saint Martins)', course: 'BA (Hons) Graphic Communication Design', yrs: 3,
        tuition: [31510, 31510], cur: 'GBP', living: 13761,
        standing: 'Ranked 2nd in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for graphic or UX design',
        why: 'A three-year degree at the second-ranked art and design university in the world. The Royal College of Art ranks 1st but lists only postgraduate courses.',
        env: 'Taught in English at Central Saint Martins in London. The course covers typography, print production and computation, and UAL’s page does not name UX.',
        watch: 'The fee is for September 2027 entry, a year after one starting in 2026 would pay, and UAL says international fees may rise by up to 5% in each later year of a course. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.arts.ac.uk/subjects/communication-and-graphic-design/undergraduate/ba-hons-graphic-communication-design-csm',
        src: ['qs-art26', 'ual-graphic', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Australia', school: 'RMIT University', course: 'Bachelor of Graphic Design', yrs: 3,
          tuition: [48000, 48000], cur: 'AUD', living: 29710,
          standing: 'Ranked joint 19th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for graphic or UX design',
          why: 'A three-year degree in Melbourne, taught in English, with an Experience Design major that covers interaction design and service design.',
          env: 'Based at RMIT’s city campus in Melbourne.',
          watch: 'The fee is RMIT’s 2027 figure. Australian fees rise most years. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-graphic-design-bp115',
          src: ['qs-art26', 'rmit-graphic', 'au-visa'], links: ['studyau']
        },
        {
          country: 'Hong Kong', school: 'The Hong Kong Polytechnic University (PolyU)', course: 'BA (Hons) Scheme in Design, with the Advertising, Information or Interaction Design specialism', yrs: 4,
          tuition: [240000, 240000], cur: 'HKD', living: 90272,
          standing: 'Ranked 24th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for graphic or UX design',
          why: 'A four-year design degree close to home, with interaction and information design among its nine specialisms.',
          env: 'The programme page does not say what language the teaching is in, so check before you apply.',
          watch: 'PolyU’s page does not say which intake year the HK$240,000 tuition applies to. The living figure is PolyU’s own estimate for a non-local student (hall place HK$18,515, meals HK$53,040, personal costs HK$18,717), not a visa minimum.',
          url: 'https://www.polyu.edu.hk/sd/study/ug/scheme-in-design/?sc_lang=en',
          src: ['qs-art26', 'polyu-fees', 'polyu-design'], links: ['hkimmd']
        }
      ]
    },

    // QS 2026 Art & Design (QS has no separate table for fashion); same ranks and the same choices as interior design above. UAL's fashion degrees
    // are at London College of Fashion and Central Saint Martins, all at one fee; the LCF Fashion Design and Development degree is the one priced here.
    // PolyU teaches fashion in its Institute of Textiles and Clothing, as the 4-year BA (Hons) Scheme in Fashion, at the same non-local fee.
    fashion: {
      best: {
        country: 'United Kingdom', school: 'University of the Arts London (London College of Fashion)', course: 'BA (Hons) Fashion Design and Development', yrs: 3,
        tuition: [31510, 31510], cur: 'GBP', living: 13761,
        standing: 'Ranked 2nd in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for fashion',
        why: 'A three-year degree at the second-ranked art and design university in the world, at its own fashion college. The Royal College of Art ranks 1st but lists only postgraduate courses.',
        env: 'Taught in English at London College of Fashion in London. UAL also runs fashion design degrees at Central Saint Martins.',
        watch: 'The fee is for September 2027 entry, a year after one starting in 2026 would pay, and UAL says international fees may rise by up to 5% in each later year of a course. The course can take 4 years with an optional placement year. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.arts.ac.uk/subjects/fashion-design/undergraduate/ba-hons-fashion-design-and-development-lcf',
        src: ['qs-art26', 'ual-fashion', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Australia', school: 'RMIT University', course: 'Bachelor of Fashion (Design)', yrs: 3,
          tuition: [48960, 48960], cur: 'AUD', living: 29710,
          standing: 'Ranked joint 19th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for fashion',
          why: 'A three-year degree in Melbourne, taught in English, with RMIT’s fee on its course page.',
          env: 'Based at RMIT’s Brunswick campus in Melbourne.',
          watch: 'The fee is RMIT’s 2027 figure. Australian fees rise most years. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-fashion-design-bp328',
          src: ['qs-art26', 'rmit-fashion', 'au-visa'], links: ['studyau']
        },
        {
          country: 'Hong Kong', school: 'The Hong Kong Polytechnic University (PolyU)', course: 'BA (Hons) Scheme in Fashion', yrs: 4,
          tuition: [240000, 240000], cur: 'HKD', living: 90272,
          standing: 'Ranked 24th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for fashion',
          why: 'A four-year fashion degree close to home, covering fashion and knitwear design, fashion business, and fashion innovation and technology.',
          env: 'The programme page does not say what language the teaching is in, so check before you apply.',
          watch: 'PolyU’s page does not say which intake year the HK$240,000 tuition applies to. The living figure is PolyU’s own estimate for a non-local student (hall place HK$18,515, meals HK$53,040, personal costs HK$18,717), not a visa minimum.',
          url: 'https://www.polyu.edu.hk/itc/study/ug/',
          src: ['qs-art26', 'polyu-fees', 'polyu-fashion'], links: ['hkimmd']
        }
      ]
    },

    // QS 2026 Art & Design (QS has no separate table for animation); same ranks as interior design above. Best: UAL's BA Animation at London College of
    // Communication. Alternative 1: RMIT's Bachelor of Design (Animation and Interactive Media). Alternative 2: Japan, kept for the anime and MEXT
    // note this field has always carried: no Japanese school is in QS's top 50 for Art & Design, so it is placed after the ranked schools. PolyU is left
    // out here because its design scheme has no animation specialism (its nearest is Immersive Media and Game Design).
    animation: {
      best: {
        country: 'United Kingdom', school: 'University of the Arts London (London College of Communication)', course: 'BA (Hons) Animation', yrs: 3,
        tuition: [31510, 31510], cur: 'GBP', living: 13761,
        standing: 'Ranked 2nd in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for animation',
        why: 'A three-year animation degree at the second-ranked art and design university in the world. The Royal College of Art ranks 1st but lists only postgraduate courses.',
        env: 'Taught in English at London College of Communication in London.',
        watch: 'The fee is for September 2027 entry, a year after one starting in 2026 would pay, and UAL says international fees may rise by up to 5% in each later year of a course. An optional year-long diploma between years 2 and 3 adds a year. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/undergraduate/ba-hons-animation-lcc',
        src: ['qs-art26', 'ual-animation', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Australia', school: 'RMIT University', course: 'Bachelor of Design (Animation and Interactive Media)', yrs: 3,
          tuition: [48000, 48000], cur: 'AUD', living: 29710,
          standing: 'Ranked joint 19th in the world for Art and Design (QS World University Rankings by Subject 2026); QS has no separate table for animation',
          why: 'A three-year degree in Melbourne, taught in English, with RMIT’s fee on its course page.',
          env: 'Based at RMIT’s city campus in Melbourne.',
          watch: 'The fee is RMIT’s 2027 figure. Australian fees rise most years. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-design-animation-and-interactive-media-bp203',
          src: ['qs-art26', 'rmit-animation', 'au-visa'], links: ['studyau']
        },
        {
          country: 'Japan', school: 'A national university in Japan (the MEXT scholarship route)', course: 'Bachelor’s in animation, design or media at a national university', yrs: 4,
          tuition: [535800, 535800], once: 282000, cur: 'JPY', living: null,
          standing: 'No Japanese university is in the top 50 in the world for Art and Design (QS World University Rankings by Subject 2026)',
          why: 'Japan is the centre of the anime industry, and studios are short of animators. National universities charge everyone the same fee, and the MEXT scholarship pays full fees, a monthly allowance and flights for 5 years, including a year of Japanese.',
          env: 'Most courses are taught in Japanese.',
          watch: 'Studios report a “profitless boom”: record sales, but low pay and rising closures. Apply for MEXT through the Embassy of Japan in Singapore, usually around May–June. The fee is the national-university rate and the one-off figure is the entrance fee. There is no official visa figure for living costs, so the total here is before living costs.',
          url: 'https://www.studyinjapan.go.jp/en/',
          src: ['qs-art26', 'jp-fees', 'jp-anime'], links: ['embjp', 'jasso']
        }
      ]
    },

    // QS 2026 Communication & Media Studies: 1 University of Amsterdam, 2 NTU, 3 Harvard, 6 LSE, =10 NUS, 16 CUHK, =19 QUT, 22 Melbourne, 28 Sydney.
    // The ranks were read from a site that republishes the QS table (QS's own page turns scripts away). NTU (2nd) and NUS (joint 10th) are local
    // schools, listed in the local courses, and outrank every school abroad except Amsterdam. Best: Amsterdam, first in the world and taught in English
    // (the US schools have no official money-for-living figure for a visa; LSE's undergraduate fee could not be confirmed). Alternatives: CUHK and QUT.
    // CUHK's and QUT's pages turn scripts away, so their figures come from search summaries of those pages and are marked for a check by hand. QUT's
    // fee is labelled unconfirmed on the card (other sites give A$37,200 to A$41,600 and its year is uncertain); Melbourne (22nd) was tried as a
    // replacement, but its fees are per subject and no single course fee could be read.
    media: {
      best: {
        country: 'Netherlands', school: 'University of Amsterdam (UvA)', course: 'BSc Communication Science (Global Communication Science)', yrs: 3,
        tuition: [16670, 16670], cur: 'EUR', living: 13569,
        standing: 'Ranked 1st in the world for Communication and Media Studies (QS World University Rankings by Subject 2026)',
        why: 'The world’s top-ranked school for the subject, with a three-year degree taught in English. Two Singapore schools, NTU (2nd) and NUS (joint 10th), also rank in the top ten and cost far less, so try them first.',
        env: 'Taught in English on the Roeterseiland campus in Amsterdam, with an internship built in.',
        watch: 'UvA’s fees page gives €16,670 a year for non-EU bachelor’s students at the Faculty of Social and Behavioural Sciences, for 2027-2028; it does not name Communication Science, and the 2026-2027 figure was not on the page. The living figure is the minimum the Dutch immigration service asks students to have, not a typical budget.',
        url: 'https://www.uva.nl/en/programmes/bachelors/communication-science/communication-science.html',
        src: ['qs-comm26', 'uva-comm', 'uva-fees', 'nl-living'], links: ['studynl']
      },
      alts: [
        {
          country: 'Hong Kong', school: 'The Chinese University of Hong Kong (CUHK)', course: 'Journalism and Communication (BA / BSocSc)', yrs: 4,
          tuition: [230000, 230000], cur: 'HKD', living: null,
          standing: 'Ranked 16th in the world for Communication and Media Studies (QS World University Rankings by Subject 2026)',
          why: 'A four-year degree close to home, with tracks in Journalism, Advertising and Public Relations, and Creative and New Media.',
          env: 'The pages read do not say what language the teaching is in, so check before you apply.',
          watch: 'The HK$230,000 tuition is CUHK’s 2027-28 rate for non-local students, and the exact degree title should be checked. CUHK’s fees page gives only a hostel fee of about HK$17,000 for 2026-27, so no full living figure is shown. Both pages turned scripts away, so check them by hand.',
          url: 'https://admission.cuhk.edu.hk/programme/commn/',
          src: ['qs-comm26', 'cuhk-commn', 'cuhk-fees'], links: ['hkimmd']
        },
        {
          country: 'Australia', school: 'Queensland University of Technology (QUT)', course: 'Bachelor of Communication (Media and Communication Industries, or the Journalism major)', yrs: 3,
          tuition: [41600, 41600], feeLabel: 'Unconfirmed tuition', cur: 'AUD', living: 29710,
          standing: 'Ranked joint 19th in the world for Communication and Media Studies (QS World University Rankings by Subject 2026)',
          why: 'A three-year degree in Brisbane, taught in English, with a Journalism major as well as Media and Communication Industries.',
          env: 'Based at QUT’s Kelvin Grove campus in Brisbane.',
          watch: 'QUT’s course page turns scripts away, so this fee could not be confirmed: the A$41,600 comes from a search summary of QUT’s page and its year is not certain, and other websites give different figures (from about A$37,200 to A$41,600). Australian fees rise most years, so check QUT’s page by hand. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.qut.edu.au/courses/bachelor-of-communication-media-and-communication-industries',
          src: ['qs-comm26', 'qut-comm', 'au-visa'], links: ['studyau']
        }
      ]
    },

    // QS 2026 Linguistics (the nearest QS subject for translation, which has no table of its own): 1 MIT, 2 Lancaster, 3 Cambridge, 4 Oxford, 6 NUS,
    // 11 Edinburgh, =13 NTU and UCL, 22= Leiden, 25 CUHK, 26 Melbourne. The ranks were read from a site that republishes the QS table. Best: Lancaster,
    // the highest-ranked school abroad whose own page gave a fee and a three-year degree taught in English. NUS (6th) and NTU (joint 13th) are local.
    // Left out: MIT and the other US schools (no official money-for-living figure); Cambridge and Oxford (fee pages not checked); Edinburgh and UCL (same
    // country as Lancaster); Melbourne (26th; its fees are per subject and no single course fee could be read). Alternatives, one per country: Leiden
    // (=22) and CUHK (25). No overseas Malay translation degree was found, and the Malaysian universities' Malay-language degrees were not researched.
    translation: {
      best: {
        country: 'United Kingdom', school: 'Lancaster University', course: 'BA Hons Linguistics', yrs: 3,
        tuition: [26300, 26300], cur: 'GBP', living: 10539,
        standing: 'Ranked 2nd in the world for Linguistics, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'A three-year degree at one of the top linguistics schools in the world, for a translator who wants a language-science base. It is not a translation degree and does not teach Malay: Lancaster does not offer a translation course in it.',
        env: 'Lancaster’s page does not say what language the teaching is in, though the university is in England. NUS (6th) and NTU (joint 13th) are in Singapore and cost far less.',
        watch: 'The fee is for 2027/28 entrants, a year after one starting in 2026 would pay, and Lancaster says it is reviewed each year. For a Malay translator, a Malay-language degree such as NUS Malay Studies is a closer fit. The living figure is the UK visa minimum for 9 months outside London, not a typical budget.',
        url: 'https://www.lancaster.ac.uk/study/undergraduate/courses/linguistics-ba-hons-q100/2026/',
        src: ['qs-ling26', 'lancs-ling', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Netherlands', school: 'Leiden University', course: 'BA Linguistics', yrs: 3,
          tuition: [14700, 14700], cur: 'EUR', living: 13569,
          standing: 'Ranked joint 22nd in the world for Linguistics, the closest QS subject (QS World University Rankings by Subject 2026)',
          why: 'A three-year degree taught in English, at about half Lancaster’s fee. It is a linguistics degree, not a translation or Malay one.',
          env: 'Taught in English in Leiden (the page also lists a Dutch-taught specialisation). The page does not mention translation.',
          watch: 'The €14,700 is Leiden’s 2027-2028 fee for non-EEA students in the Faculty of Humanities; the page does not name Linguistics, and the 2026-2027 figure was not on it. The living figure is the minimum the Dutch immigration service asks students to have, not a typical budget.',
          url: 'https://www.universiteitleiden.nl/en/education/study-programmes/bachelor/linguistics',
          src: ['qs-ling26', 'leiden-ling', 'leiden-fees', 'nl-living'], links: ['studynl']
        },
        {
          country: 'Hong Kong', school: 'The Chinese University of Hong Kong (CUHK)', course: 'BA in Linguistics', yrs: 4,
          tuition: [230000, 230000], cur: 'HKD', living: null,
          standing: 'Ranked 25th in the world for Linguistics, the closest QS subject (QS World University Rankings by Subject 2026)',
          why: 'A degree close to home from the university’s Department of Linguistics and Modern Languages.',
          env: 'The pages read do not say what language the teaching is in, so check before you apply.',
          watch: 'The HK$230,000 tuition is CUHK’s 2027-28 rate for non-local students. The four years are implied by the year-4 capstone courses in the study scheme, not stated. CUHK’s fees page gives only a hostel fee of about HK$17,000 for 2026-27, so no full living figure is shown. CUHK’s pages have a certificate problem for scripts, so check them by hand.',
          url: 'https://ling.cuhk.edu.hk/programmes/undergraduate-programme/major-programme-in-linguistics/',
          src: ['qs-ling26', 'cuhk-ling', 'cuhk-fees'], links: ['hkimmd']
        }
      ]
    },
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

  /* Business, law and services fields (Task 9). Added with Object.assign after the object above so that these entries never touch the lines of
     other fields. Same shape and rules as above. */
  Object.assign(OPTIONS, {
    // QS 2026 Law and Legal Studies: 1 Harvard, 2 Oxford, 3 Cambridge, 6 NUS, 9 LSE, 11 Melbourne, =13 UNSW and UCL, 17 Sydney, 20 HKU, 32 Monash, 65 Auckland.
    // Singapore decides who may practise: the Ministry of Law's Legal Profession (Qualified Persons) Rules, whose list of degrees the Institute of Legal
    // Education publishes. Only the UK, Australia, New Zealand and the US are on it, so Hong Kong, Canada and Europe are out however high they rank, and a US
    // JD follows a bachelor's degree (with no visa living figure) so the US is out too. Best: Cambridge, the highest-ranked school on the list whose own page
    // gave a fee. Left out: Oxford (2nd and on the list, but its fee pages are closed to scripts); LSE and UCL (same country as Cambridge); Melbourne (11th,
    // JD only after a first degree, and its page is closed to scripts) and UNSW (13th, but its pages do not show a stand-alone LLB or a fee for it) and Sydney
    // (17th, no stand-alone LLB fee read). The alternatives are the highest-ranked school per country with a four-year LLB and a published fee:
    // Monash (Australia) and Auckland (New Zealand).
    law: {
      best: {
        country: 'United Kingdom', school: 'University of Cambridge (Faculty of Law)', course: 'BA Law', yrs: 3,
        tuition: [43298, 46748], tuitionNote: 'low end is the University fee plus the lowest College fee (Darwin), high end the highest (Murray Edwards)', cur: 'GBP', living: 10539,
        standing: 'Ranked 3rd in the world for Law and Legal Studies (QS World University Rankings by Subject 2026)',
        why: 'Third in the world for law, and its BA Law is on the Ministry of Law’s list of overseas degrees that can make you a Qualified Person. It takes three years, one fewer than the local LLB. Oxford ranks 2nd and is also on the list, but its fee page could not be read when we checked in October 2026, so it is not priced here. The top-ranked schools in this subject are in the US; they are not shown here because no official living-cost figure was found, so check their own pages.',
        env: 'Taught in English in a college town. You belong to a College as well as the University, and each College sets its own fee.',
        watch: 'Singapore’s Ministry of Law decides which overseas law degrees count, and the Singapore Institute of Legal Education lists them; Cambridge’s BA Law is on the list. To practise here you must be a Singapore citizen or permanent resident, get at least a lower second class honours, pass Part A of the Singapore Bar Examinations, complete 6 months of relevant legal training, then pass Part B and a practice training period. Check the Ministry’s rules again before you enrol. The fee is the 2027–28 University fee of £30,798 plus a College fee of £12,500 to £15,950, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months outside London (£1,171 a month), not a typical budget.',
        url: 'https://www.undergraduate.study.cam.ac.uk/courses/law',
        src: ['qs-law26', 'cam-law', 'cam-fees-pdf', 'uk-living-out', 'mlaw-bar', 'sile-qp'], links: ['ukvisa', 'minlaw', 'sile']
      },
      alts: [
        {
          country: 'Australia', school: 'Monash University (Faculty of Law)', course: 'Bachelor of Laws (Honours)', yrs: 4,
          tuition: [55700, 55700], cur: 'AUD', living: 29710,
          standing: 'Ranked 32nd in the world for Law and Legal Studies (QS World University Rankings by Subject 2026)',
          why: 'A four-year LLB straight from school, and Monash is one of the Australian universities on the Ministry of Law’s list. Melbourne and UNSW rank higher, but Melbourne’s law degree is a JD that follows a first degree and UNSW’s pages show no stand-alone LLB.',
          env: 'Taught in English at the Clayton campus in Melbourne.',
          watch: 'Singapore’s Ministry of Law decides which overseas law degrees count, and the Singapore Institute of Legal Education lists them; for Monash you must also rank in the top 70% of your batch, and you must be a Singapore citizen or permanent resident, pass Part A of the Singapore Bar Examinations and complete 6 months of relevant legal training, then Part B and a practice training period. Australian fees rise most years: A$55,700 is the figure Monash confirmed for 2026 and gives as a guide for 2027. The living figure is the Australian student-visa minimum, not a typical budget.',
          url: 'https://www.monash.edu/study/courses/find-a-course/laws-l3001',
          src: ['qs-law26', 'monash-guide', 'au-visa', 'mlaw-bar', 'sile-qp'], links: ['studyau', 'minlaw', 'sile']
        },
        {
          country: 'New Zealand', school: 'University of Auckland (Auckland Law School)', course: 'Bachelor of Laws (LLB)', yrs: 4,
          tuition: [47218, 47218], cur: 'NZD', living: 20000,
          standing: 'Ranked 65th in the world for Law and Legal Studies (QS World University Rankings by Subject 2026)',
          why: 'New Zealand’s top-ranked law school, and the University of Auckland is on the Ministry of Law’s list. A four-year LLB taught in English.',
          env: 'Taught in English in Auckland.',
          watch: 'Singapore’s Ministry of Law decides which overseas law degrees count, and the Singapore Institute of Legal Education lists them; for Auckland you must also rank in the top 70% of your batch, and you must be a Singapore citizen or permanent resident, pass Part A of the Singapore Bar Examinations and complete 6 months of relevant legal training, then Part B and a practice training period. The fee is for 2026 and excludes the Student Services Fee (about NZ$1,133 a year). The living figure is the New Zealand student-visa minimum, not a typical budget.',
          url: 'https://www.auckland.ac.nz/en/study/study-options/find-a-study-option/bachelor-of-laws-llb.html',
          src: ['qs-law26', 'auck-llb', 'auck-rank', 'nz-living', 'mlaw-bar', 'sile-qp'], links: ['studynz', 'minlaw', 'sile']
        }
      ]
    }
  });

  Object.assign(OPTIONS, {
    // QS 2026 Hospitality and Leisure Management: 1 EHL, 2 Les Roches, 3 Glion, 4 SHMS, 5 César Ritz (all Switzerland), 6 UNLV, 7 Hotelschool The Hague,
    // 10 Macao University of Tourism, 11 Vatel, 15 PolyU, 16 Cornell, 18 Surrey, 36 HKU. Nothing regulates hospitality in Singapore, so no recognition
    // warning. One school per country, in QS order: Best: EHL, first, taught in English. Left out: Les Roches, Glion and the other Swiss schools (same country
    // as EHL); UNLV and Cornell (the US has no visa living figure); Macao (10th, no fee or visa page used) and Vatel (taught partly in French).
    // Alternatives: Hotelschool The Hague (7th, English-taught) and PolyU (15th, close to home, the highest-ranked school in Hong Kong).
    hospitality: {
      best: {
        country: 'Switzerland', school: 'EHL Hospitality Business School (Lausanne)', course: 'Bachelor of Science in International Hospitality Management', yrs: 4,
        tuition: [45969, 45969], feeLabel: 'Average fees', cur: 'CHF', living: 21000,
        standing: 'Ranked 1st in the world for Hospitality and Leisure Management (QS World University Rankings by Subject 2026)',
        why: 'The top-ranked hospitality school in the world; the five highest-ranked schools are all Swiss. Taught in English. The sixth-ranked school, UNLV, is in the US and is not shown because no official living-cost figure was found; check its own page.',
        env: 'A private hospitality school in Lausanne, Switzerland. It is the most expensive place on this list.',
        watch: 'Nothing in Singapore regulates hospitality jobs, so no licence applies. EHL’s sheet for the September 2027 intake lists four annual instalments for the four years (a preparatory year, then three): CHF 39,838, 59,660, 35,049 and 49,328, or CHF 183,874 in all, and the figure here averages that over four years. They cover tuition, services and a prepaid food and drink credit, not housing (from CHF 5,850 a year), health insurance or a CHF 5,000 deposit. Students from outside the EU must also pay CHF 18,000 before applying for a visa, which counts towards the total. Switzerland has no single national figure for visa money. CHF 21,000 a year is what the canton of Zurich asks of students who need a visa, and is used here as a cited estimate; the same checklist lists Singapore among the visa-exempt countries, so confirm with EHL and the canton of Vaud what applies to you.',
        url: 'https://www.ehl.edu/en/study/bachelor-degree-in-hospitality',
        src: ['qs-hosp26', 'ehl-fees', 'ch-living']
      },
      alts: [
        {
          country: 'Netherlands', school: 'Hotelschool The Hague', course: 'Bachelor in Hospitality Management', yrs: 4,
          tuition: [18297, 18297], once: 8611, cur: 'EUR', living: 13569,
          standing: 'Ranked 7th in the world for Hospitality and Leisure Management (QS World University Rankings by Subject 2026)',
          why: 'Seventh in the world and the top school in the Netherlands, at less than half EHL’s fees. Taught in English.',
          env: 'A hospitality school in The Hague.',
          watch: 'Nothing in Singapore regulates hospitality jobs. The fee is the 2027 non-EEA rate for the September intake. The one-off €8,611 is the Skotel fee, charged to first-year students, which covers breakfast and one meal a day on campus and internet. The living figure is the minimum the Dutch immigration service asks students to have, not a typical budget.',
          url: 'https://www.hotelschool.nl/bachelor-hospitality-management/',
          src: ['qs-hosp26', 'hth-qs', 'hth-bsc', 'nl-living'], links: ['studynl']
        },
        {
          country: 'Hong Kong', school: 'The Hong Kong Polytechnic University (School of Hotel and Tourism Management)', course: 'BSc (Hons) Scheme in Hotel and Tourism Management', yrs: 4,
          tuition: [240000, 240000], cur: 'HKD', living: 90272,
          standing: 'Ranked 15th in the world for Hospitality and Leisure Management (QS World University Rankings by Subject 2026)',
          why: 'Close to home, and the highest-ranked school in Hong Kong for this subject, according to PolyU.',
          env: 'Taught in English at a public university in Hong Kong.',
          watch: 'Nothing in Singapore regulates hospitality jobs. PolyU’s page gives HK$240,000 a year for non-local undergraduates without naming the intake year, so the fee may change. Living costs are PolyU’s own estimate for a hall place (HK$18,515), campus meals and personal spending, not a visa figure; halls are normally only for the first year.',
          url: 'https://www.polyu.edu.hk/shtm/study/undergraduate-programmes/undergraduate-programme/',
          src: ['qs-hosp26', 'polyu-qs', 'polyu-fees'], links: ['hkimmd']
        }
      ]
    }
  });

  Object.assign(OPTIONS, {
    // QS 2026 Business and Management Studies: 1 Harvard, 2 Stanford, 3 MIT, 4 INSEAD, 5 Oxford, 6 Cambridge, 8 NUS, 9 LBS, 10 Bocconi, 11 LSE, 14 NTU,
    // 19 CBS, =24 Erasmus Rotterdam, 30 HKUST, =32 HKU, 39 SMU, 52 PolyU. Nothing regulates business jobs in Singapore, so no recognition warning.
    // One school per country, in QS order, with an English-taught bachelor's whose own page gave a fee: Best: LSE. Left out: Oxford and Cambridge (5th and 6th,
    // but Oxford's fee pages are closed to scripts and no matching Cambridge bachelor's was found); the US schools (no visa living
    // figure); INSEAD and LBS (graduate schools); Bocconi, CBS and HKUST (no fee or visa page used). Alternatives: Erasmus Rotterdam (Netherlands) and HKU (Hong Kong, =32nd; HKUST ranks 30th but its fee page could not be read).
    business: {
      best: {
        country: 'United Kingdom', school: 'LSE (London School of Economics)', course: 'BSc Management', yrs: 3,
        tuition: [37500, 37500], cur: 'GBP', living: 13761,
        standing: 'Ranked 11th in the world for Business and Management Studies (QS World University Rankings by Subject 2026)',
        why: 'The highest-ranked school here with a stand-alone English-taught bachelor’s and a published fee. A three-year degree, a year shorter than the four-year NUS, NTU and SMU business degrees. Oxford and Cambridge rank higher but are not priced here: Oxford’s fee page could not be read when we checked in October 2026. The top-ranked schools in this subject are in the US; they are not shown here because no official living-cost figure was found, so check their own pages.',
        env: 'Taught in English in central London.',
        watch: 'Nothing in Singapore regulates business jobs, so no licence applies. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-management',
        src: ['qs-biz26', 'lse-mgmt', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Netherlands', school: 'Erasmus University Rotterdam (Rotterdam School of Management)', course: 'BSc International Business Administration', yrs: 3,
          tuition: [15200, 15200], cur: 'EUR', living: 13569,
          standing: 'Ranked joint 24th in the world for Business and Management Studies (QS World University Rankings by Subject 2026)',
          why: 'A three-year English-taught bachelor’s at a top-25 business school, for less than half LSE’s fee.',
          env: 'Taught in English in Rotterdam.',
          watch: 'Nothing in Singapore regulates business jobs. The fee is the 2027–2028 rate for non-EEA students, which RSM calls approximate. The living figure is the minimum the Dutch immigration service asks students to have, not a typical budget.',
          url: 'https://www.rsm.nl/education/bachelor/bsc-international-business-administration-iba/',
          src: ['qs-biz26', 'rsm-iba', 'nl-living'], links: ['studynl']
        },
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'Bachelor of Business Administration', yrs: 4,
          tuition: [250000, 250000], cur: 'HKD', living: 87940,
          standing: 'Ranked joint 32nd in the world for Business and Management Studies (QS World University Rankings by Subject 2026)',
          why: 'Close to home and taught in English.',
          env: 'Taught in English. The degree takes four years, a year longer than the UK or Dutch ones.',
          watch: 'Nothing in Singapore regulates business jobs. The fee is HK$250,000 a year for 2027/28 non-local students in non-STEM faculties. Living costs are HKU’s estimate: a hall place plus up to HK$50,000 of daily costs, not a visa figure.',
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-business-administration',
          src: ['qs-biz26', 'hku-bba', 'hku-fees'], links: ['hkimmd']
        }
      ]
    },
    // QS 2026 Accounting and Finance: 1 Harvard, 2 Stanford, 3 MIT, 4 Oxford, 7 Cambridge, 8 LSE, 10 NUS, 14 NTU, 24 Melbourne, 26 HKU, 27 Sydney, 29 UNSW,
    // 38 Monash. Best: LSE, the highest-ranked English-taught school with a stand-alone accounting and finance bachelor's and a published fee. Left out:
    // Oxford and Cambridge (Oxford's fee pages are closed to scripts; no matching Cambridge bachelor's was found), the US schools (no visa living figure), and
    // the Australian schools (Melbourne's pages are closed to scripts; Sydney's course page gave no fee). The only alternative is HKU, so no third place is
    // listed yet.
    accounting: {
      best: {
        country: 'United Kingdom', school: 'LSE (London School of Economics)', course: 'BSc Accounting and Finance', yrs: 3,
        tuition: [39300, 39300], cur: 'GBP', living: 13761,
        standing: 'Ranked 8th in the world for Accounting and Finance (QS World University Rankings by Subject 2026)',
        why: 'Eighth in the world, and a three-year degree. Oxford ranks 4th, but its fee page could not be read when we checked in October 2026, so it is not priced here. The top-ranked schools in this subject are in the US; they are not shown here because no official living-cost figure was found, so check their own pages.',
        env: 'Taught in English in central London.',
        watch: 'To become a Singapore Chartered Accountant you take ISCA’s Singapore CA Qualification, and ISCA keeps a list of the accounting degrees it recognises; it assesses other overseas degrees case by case, so check the list before you enrol. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-accounting-and-finance',
        src: ['qs-accfin26', 'lse-af', 'uk-living', 'isca-deg'], links: ['ukvisa', 'isca']
      },
      alts: [
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'Bachelor of Business Administration in Accounting and Finance', yrs: 4,
          tuition: [250000, 250000], cur: 'HKD', living: 87940,
          standing: 'Ranked 26th in the world for Accounting and Finance (QS World University Rankings by Subject 2026)',
          why: 'Close to home and taught in English.',
          env: 'Taught in English. The degree takes four years, a year longer than the UK one.',
          watch: 'To become a Singapore Chartered Accountant you take ISCA’s Singapore CA Qualification, and ISCA assesses overseas degrees case by case, so check its list of recognised degrees before you enrol. The fee is HK$250,000 a year for 2027/28 non-local students in non-STEM faculties. Living costs are HKU’s estimate: a hall place plus up to HK$50,000 of daily costs, not a visa figure.',
          url: 'https://www.admissions.hku.hk/programmes/undergraduate-programmes/bachelor-of-business-administration-accounting-and-finance',
          src: ['qs-accfin26', 'hku-baf', 'hku-fees', 'isca-deg'], links: ['hkimmd', 'isca']
        }
      ]
    },
    // The same QS table and rule as accounting: Best: LSE's BSc Finance. The only alternative is HKU, so no third place is listed yet.
    'finance-risk': {
      best: {
        country: 'United Kingdom', school: 'LSE (London School of Economics)', course: 'BSc Finance', yrs: 3,
        tuition: [39300, 39300], cur: 'GBP', living: 13761,
        standing: 'Ranked 8th in the world for Accounting and Finance, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'Eighth in the world in the closest QS subject, and a three-year degree. Oxford ranks 4th, but its fee page could not be read when we checked in October 2026, so it is not priced here. The top-ranked schools in this subject are in the US; they are not shown here because no official living-cost figure was found, so check their own pages.',
        env: 'Taught in English in central London.',
        watch: 'Nothing in Singapore regulates a degree for risk and compliance jobs, though employers often ask for a finance, law or accounting degree. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-finance',
        src: ['qs-accfin26', 'lse-fin', 'uk-living'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'Bachelor of Economics and Finance', yrs: 4,
          tuition: [250000, 250000], cur: 'HKD', living: 87940,
          standing: 'Ranked 26th in the world for Accounting and Finance, the closest QS subject (QS World University Rankings by Subject 2026)',
          why: 'Close to home and taught in English.',
          env: 'Taught in English. The degree takes four years, a year longer than the UK one.',
          watch: 'Nothing in Singapore regulates a degree for risk and compliance jobs. The fee is HK$250,000 a year for 2027/28 non-local students in non-STEM faculties. Living costs are HKU’s estimate: a hall place plus up to HK$50,000 of daily costs, not a visa figure.',
          url: 'https://ug.hkubs.hku.hk/admission/information-day/programmes',
          src: ['qs-accfin26', 'hku-befin', 'hku-fees'], links: ['hkimmd']
        }
      ]
    },
    // Islamic banking and takaful: QS has no Islamic finance subject, so this uses the same Accounting and Finance table. Malaysia leads the world in Islamic
    // finance (the Islamic Finance Development Indicator), but no Malaysian university is in the QS top 39 for the subject (Universiti Utara Malaysia is in the
    // 101-150 band), so the ranking does not support a Malaysian best pick and no Malaysian degree is listed here; the pathway's Malaysia note stays. The
    // options are the same finance degrees as finance-risk. The only alternative is HKU, so no third place is listed yet.
    islamicfin: {
      best: {
        country: 'United Kingdom', school: 'LSE (London School of Economics)', course: 'BSc Finance', yrs: 3,
        tuition: [39300, 39300], cur: 'GBP', living: 13761,
        standing: 'Ranked 8th in the world for Accounting and Finance, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'There is no QS ranking for Islamic finance, so this follows the closest subject, where LSE ranks 8th. Serasi’s pathway for this field is a business or finance degree plus an Islamic finance certificate. The top-ranked schools in this subject are in the US; they are not shown here because no official living-cost figure was found, so check their own pages.',
        env: 'Taught in English in central London.',
        watch: 'Malaysia leads the world’s Islamic Finance Development Indicator and Kuala Lumpur is the industry’s hub, but no Malaysian university is in the top 39 of the QS table for accounting and finance, so it is not the pick here; check the pathway’s Malaysia note if you want to study there. The fee is for 2027/28 entrants, a year after one starting in 2026 would pay. The living figure is the UK visa minimum for 9 months in London, not a typical budget.',
        url: 'https://www.lse.ac.uk/study-at-lse/undergraduate/bsc-finance',
        src: ['qs-accfin26', 'lse-fin', 'uk-living', 'lseg-ifdi'], links: ['ukvisa']
      },
      alts: [
        {
          country: 'Hong Kong', school: 'The University of Hong Kong (HKU)', course: 'Bachelor of Economics and Finance', yrs: 4,
          tuition: [250000, 250000], cur: 'HKD', living: 87940,
          standing: 'Ranked 26th in the world for Accounting and Finance, the closest QS subject (QS World University Rankings by Subject 2026)',
          why: 'Close to home and taught in English. A general finance degree, as with LSE.',
          env: 'Taught in English. The degree takes four years, a year longer than the UK one.',
          watch: 'The fee is HK$250,000 a year for 2027/28 non-local students in non-STEM faculties. Living costs are HKU’s estimate: a hall place plus up to HK$50,000 of daily costs, not a visa figure.',
          url: 'https://ug.hkubs.hku.hk/admission/information-day/programmes',
          src: ['qs-accfin26', 'hku-befin', 'hku-fees'], links: ['hkimmd']
        }
      ]
    },
    // QS has no subject for logistics or supply chain, so this uses Business and Management Studies, where PolyU ranks 52nd. PolyU is the only school found
    // with a supply chain bachelor's open to non-local students and a readable fee; the logistics roles also go by local routes. No alternatives are listed yet.
    logistics: {
      best: {
        country: 'Hong Kong', school: 'The Hong Kong Polytechnic University (Department of Logistics and Maritime Studies)', course: 'BBA (Honours) Scheme in Global Business and Logistics, Aviation, Maritime, and Supply Chain Management', yrs: 4,
        tuition: [240000, 240000], cur: 'HKD', living: 90272,
        standing: 'Ranked 52nd in the world for Business and Management Studies, the closest QS subject (QS World University Rankings by Subject 2026)',
        why: 'PolyU has a whole department for logistics and maritime studies. After a common first year you choose a specialism such as Supply Chain Management and Analytics.',
        env: 'Taught in English at a public university in Hong Kong, close to home.',
        watch: 'Nothing in Singapore regulates logistics jobs. PolyU’s page gives HK$240,000 a year for non-local undergraduates without naming the intake year, so the fee may change. Living costs are PolyU’s own estimate for a hall place (HK$18,515), campus meals and personal spending, not a visa figure; halls are normally only for the first year.',
        url: 'https://www.polyu.edu.hk/lms/study/ug/',
        src: ['qs-biz26', 'polyu-fees'], links: ['hkimmd']
      },
      alts: []
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
