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

  /* Sources and contacts for the business, law and services fields (Task 9), checked in October 2026. QS blocks scripts, so its subject pages
     are for a person with a browser; the ranks were read from a mirror of each table and, where the school's own page gives its rank, checked there. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'qs-law26': ['QS World University Rankings by Subject 2026: Law and Legal Studies', 'https://www.topuniversities.com/university-subject-rankings/law-legal-studies'],
    'mlaw-bar': ['Ministry of Law, admission to the Singapore Bar: admission requirements (points to the Institute of Legal Education for degrees)', 'https://www.mlaw.gov.sg/admission-to-the-bar/admission-requirements/'],
    'sile-qp': ['Singapore Institute of Legal Education, Qualified Person: the overseas universities whose law degrees count (page updated 9 October 2025)', 'https://www.sile.edu.sg/for-overseas-graduates/qualified-person/'],
    'cam-law': ['Cambridge, Law BA: a 3-year course', 'https://www.undergraduate.study.cam.ac.uk/courses/law'],
    'cam-fees': ['Cambridge, undergraduate tuition fees 2027-28: University fee and each College’s fee for international students', 'https://www.undergraduate.study.cam.ac.uk/files/2026-09/undergraduate_tuition_fees_2027-28.pdf'],
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
    'polyu-fees': ['PolyU, undergraduate fees for non-local students, with estimated living costs', 'https://www.polyu.edu.hk/study/ug/fees-and-scholarships/fees'],
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
        src: ['qs-law26', 'cam-law', 'cam-fees', 'uk-living-out', 'mlaw-bar', 'sile-qp'], links: ['ukvisa', 'minlaw', 'sile']
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
