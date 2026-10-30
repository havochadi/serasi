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
    'polyu-fees': ['PolyU, undergraduate fees and estimated costs for non-local students', 'https://www.polyu.edu.hk/study/ug/fees-and-scholarships/fees'],
    'polyu-design': ['PolyU, BA (Hons) Scheme in Design (4-year): specialisms', 'https://www.polyu.edu.hk/sd/study/ug/scheme-in-design/?sc_lang=en'],
    'ual-graphic': ['UAL, BA (Hons) Graphic Communication Design (Central Saint Martins): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/communication-and-graphic-design/undergraduate/ba-hons-graphic-communication-design-csm'],
    'rmit-graphic': ['RMIT, Bachelor of Graphic Design: 2027 fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-graphic-design-bp115'],
    'ual-fashion': ['UAL, BA (Hons) Fashion Design and Development (London College of Fashion): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/fashion-design/undergraduate/ba-hons-fashion-design-and-development-lcf'],
    'rmit-fashion': ['RMIT, Bachelor of Fashion (Design): 2027 international fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-fashion-design-bp328/apply-now'],
    'polyu-fashion': ['PolyU, BA (Hons) Scheme in Fashion (4-year)', 'https://www.polyu.edu.hk/itc/study/ug/'],
    'ual-animation': ['UAL, BA (Hons) Animation (London College of Communication): fees for September 2027 entry', 'https://www.arts.ac.uk/subjects/animation-interactive-film-and-sound/undergraduate/ba-hons-animation-lcc'],
    'rmit-animation': ['RMIT, Bachelor of Design (Animation and Interactive Media): 2027 international fee', 'https://www.rmit.edu.au/study-with-us/levels-of-study/undergraduate-study/bachelor-degrees/bachelor-of-design-animation-and-interactive-media-bp203/apply-now']
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
