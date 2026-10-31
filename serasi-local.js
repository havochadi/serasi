/* Serasi local study options: every publicly funded Singapore school that offers a course, and the section HTML for it.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   A course is { school, course, lvl: 1 | 2 | 3, yrs, fee: number | null, note?, mode?: 'part-time' | 'work-study', fields, roles?, url, src? }.
   lvl 1 = ITE, 2 = diploma, 3 = degree. fee is the yearly fee in S$ for Singapore Citizens after the MOE Tuition Grant, or null when the
   school's page does not list one. note, when present, is shown beside the fee: use it whenever the fee is worked out from published
   figures or taken from a band the school's page does not name the course in, so it does not read as a published yearly fee.
   fields are keys of SerasiStudy.FIELDS; roles, when present, limits the course to those role ids. */
(function () {
  'use strict';

  /* Fee pages for the courses below, checked in October 2026. Singapore Polytechnic's is 'fee-poly' in serasi-pathways.js. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'fee-sit-ai26': ['SIT, Applied Artificial Intelligence fees: $125 per credit, 180 credits (AY2026; checked 31 October 2026)', 'https://www.singaporetech.edu.sg/undergraduate-programmes/applied-artificial-intelligence'],
    'fee-np26': ['Ngee Ann Polytechnic, full-time diploma fees for AY2026', 'https://np.edu.sg/admissions-enrolment/academic-matters/course-fees'],
    'fee-nyp26': ['Nanyang Polytechnic, annual course fees for AY2026', 'https://www.nyp.edu.sg/student/study/financial-matters/annual-course-fees'],
    'fee-tp26': ['Temasek Polytechnic, full-time diploma fees for AY2026/2027', 'https://www.tp.edu.sg/admissions-and-finance/fees-financial-matters.html'],
    'fee-nus26': ['NUS, undergraduate tuition fees for AY2026/2027 (March 2026)', 'https://nus.edu.sg/registrar/docs/default-source/administrative-policies-procedures/ugtuitioncurrent.pdf'],
    'fee-sutd26': ['SUTD, undergraduate tuition fees for AY2026', 'https://www.sutd.edu.sg/admissions/undergraduate/education-expenses/fees/tuition-fees/'],
    'fee-rp26': ['Republic Polytechnic, course fees for AY2026', 'https://www.rp.edu.sg/student/financial-matters/course-fees/'],
    'fee-ite26': ['ITE, Higher Nitec training fees for AY2026 (new students)', 'https://isomer-user-content.by.gov.sg/145/2153c21b-6d76-4af2-86b5-39fb04723ef4/Fees-AY2026-for-2026-Intake.pdf'],
    'fee-sit26': ['SIT, undergraduate tuition fees for AY2026 (each degree page gives its fee per credit)', 'https://www.singaporetech.edu.sg/admissions/tuition-fees'],
    // Design and media: LASALLE and NAFA publish fees only for the August 2027 intake (applications are open now).
    'fee-lasalle27': ['LASALLE, diploma tuition fees for the August 2027 intake (correct as of August 2026)', 'https://www.lasalle.edu.sg/study/admissions/diploma-admissions/'],
    'fee-nafa27': ['NAFA, diploma programme fees for AY2027 (studies from August 2027)', 'https://www.nafa.edu.sg/admissions/fees/diploma/programme-fees']
  });

  /* Fee pages for the business and services courses (Task 9), checked in October 2026. NUS (fee-nus26), NTU (fee-ntu) and the
     polytechnics are above; SMU publishes its fees in its admissions leaflet, so that leaflet is the source. */
  Object.assign(window.SerasiPathways.SOURCES, {
    'fee-smu26': ['SMU, annual tuition fees for AY2026/27 entering freshmen (admissions leaflet, accurate as of June 2026)', 'https://admissions.smu.edu.sg/sites/admissions.smu.edu.sg/files/brochures/2026/International%20Leaflet%202026%20Web.pdf']
  });

  // Publicly funded institutions only, in the order they are listed.
  const SCHOOLS = [
    'ITE', 'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic',
    'NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'LASALLE', 'NAFA', 'University of the Arts Singapore', 'Duke-NUS', 'NIE'
  ];

  // The courses, field by field. Fees are for students starting in 2026, except the LASALLE and NAFA entries, which are for the August 2027 intake (their note says so).
  const COURSES = [
    // Architecture. The Board of Architects gives these four diplomas up to two years' advanced standing in an architecture degree.
    // Registering as an architect also needs a Master of Architecture, which the licence step on the page explains.
    { school: 'Singapore Polytechnic', course: 'Diploma in Architecture', lvl: 2, yrs: 3, fee: 3177.52, fields: ['architecture'], url: 'https://www.sp.edu.sg/courses/schools/abe/architecture', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Design (Architecture specialisation)', lvl: 2, yrs: 3, fee: 3167.5, fields: ['architecture'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-design-environment/diploma-in-design', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Architecture', lvl: 2, yrs: 3, fee: 3188.09, fields: ['architecture'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-architecture', src: ['fee-nyp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Interior Architecture & Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['architecture', 'interior-design'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/interior-architecture-design.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Arts in Architecture', lvl: 3, yrs: 4, fee: 8950, fields: ['architecture'], url: 'https://cde.nus.edu.sg/arch/programmes/bachelor-of-arts-in-architecture/', src: ['fee-nus26'] },
    { school: 'SUTD', course: 'Bachelor of Science (Architecture and Sustainable Design)', lvl: 3, yrs: 4, fee: 13500, fields: ['architecture'], url: 'https://www.sutd.edu.sg/asd/education/undergraduate/curriculum/', src: ['fee-sutd26'] },

    // Nursing. ITE's fee table (AY2026 intake) gives Singapore Citizens $283 a term, or $566 a year, for every Higher Nitec. Nursing students also pay
    // the hospital insurance premium of $8.17 a term, so their year is 2 x ($283 + $8.17) = $582.34 (worked out, so it carries a note). The table puts the
    // 2-year and 3-year courses on one rate, but its note 9 says 3-year Higher Nitec fees are "pro-rated for accelerated pathway", so the 3-year rows say
    // that the figure is the yearly rate and may be lower for a student who finishes early.
    // Nursing at the polytechnics: Ngee Ann and Nanyang only (Ngee Ann charges $3,193.70 for nursing, $26.20 more than its other diplomas).
    { school: 'ITE', course: 'Higher Nitec in Nursing', lvl: 1, yrs: 2, fee: 582.34, note: 'worked out as 2 terms at $283 plus $8.17 hospital insurance a term', fields: ['nursing'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-nursing/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Nursing (3 years)', lvl: 1, yrs: 3, fee: 582.34, note: 'worked out as 2 terms at $283 plus $8.17 hospital insurance a term; ITE pro-rates 3-year fees for students who finish early', fields: ['nursing'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-nursing-3-year/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Nursing', lvl: 2, yrs: 3, fee: 3193.7, fields: ['nursing'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-health-sciences/diploma-in-nursing', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Nursing', lvl: 2, yrs: 3, fee: 3188.09, fields: ['nursing'], url: 'https://www.nyp.edu.sg/student/study/schools/health-social-sciences/diploma-nursing', src: ['fee-nyp26'] },

    // Allied health. Nanyang's physiotherapy, occupational therapy and radiography diplomas are on the Allied Health Professions Council's list but are
    // no longer on Nanyang's school page, so only oral health therapy is listed. SIT's four-year degrees are 240 credits at $155 a credit for Singapore
    // Citizens (the intake of 31 August 2026): $37,200 over the course, or $9,300 a year. Each degree is tied to its own role.
    { school: 'Nanyang Polytechnic', course: 'Diploma in Oral Health Therapy', lvl: 2, yrs: 3, fee: 3188.09, fields: ['allied-health'], roles: ['oral-health'], url: 'https://www.nyp.edu.sg/student/study/schools/health-social-sciences/diploma-oral-health-therapy', src: ['fee-nyp26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Physiotherapy', lvl: 3, yrs: 4, fee: 9300, note: 'worked out as $155 a credit for 240 credits over 4 years', fields: ['allied-health'], roles: ['physio'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/physiotherapy', src: ['fee-sit26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Occupational Therapy', lvl: 3, yrs: 4, fee: 9300, note: 'worked out as $155 a credit for 240 credits over 4 years', fields: ['allied-health'], roles: ['ot'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/occupational-therapy', src: ['fee-sit26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Diagnostic Radiography', lvl: 3, yrs: 4, fee: 9300, note: 'worked out as $155 a credit for 240 credits over 4 years', fields: ['allied-health'], roles: ['radiographer'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/diagnostic-radiography', src: ['fee-sit26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Dietetics and Nutrition', lvl: 3, yrs: 4, fee: 9300, note: 'worked out as $155 a credit for 240 credits over 4 years', fields: ['allied-health'], roles: ['dietitian'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/dietetics-and-nutrition', src: ['fee-sit26'] },

    // Pharmacy. The Pharmaceutical Science diplomas also suit the pharmaceutical quality assurance officer (biomedical). Singapore Polytechnic has none.
    // NUS's Bachelor of Pharmacy (Honours) is its "Science (Pharmacy)" fee band.
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3167.5, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa', 'biomed-sci'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-life-sciences-chemical-technology/diploma-in-pharmaceutical-science', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3188.09, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa', 'biomed-sci'], url: 'https://www.nyp.edu.sg/student/study/schools/applied-science/diploma-pharmaceutical-science', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3186.5, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa', 'biomed-sci'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-pharmaceutical-science/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3183.15, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa', 'biomed-sci'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/asc/pharmaceutical-science.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Pharmacy (Honours)', lvl: 3, yrs: 4, fee: 9200, fields: ['pharmacy'], roles: ['pharmacist'], url: 'https://pharmacy.nus.edu.sg/study/undergraduate/bachelor-of-pharmacy', src: ['fee-nus26'] },

    // Medicine. The MBBS places are the main route; Duke-NUS takes graduates of any field. NUS's "Medicine (except Nursing)" band is $33,200 and NTU's
    // medicine fee is $36,100 (AY2026/27). Duke-NUS's tuition page could not be read for the MD fee, so it is null. Both MBBS fees are for 2026/27 entrants.
    { school: 'NUS', course: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', lvl: 3, yrs: 5, fee: 33200, fields: ['medicine'], url: 'https://www.nus.edu.sg/nusbulletin/ay202627/programmes/yong-loo-lin-school-of-medicine-including-nursing/undergraduate-education/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', lvl: 3, yrs: 5, fee: 36100, note: 'NTU lists one fee for Medicine', fields: ['medicine'], url: 'https://www.ntu.edu.sg/medicine/education/bachelor-of-medicine-and-bachelor-of-surgery-(mbbs)', src: ['fee-ntu'] },
    { school: 'Duke-NUS', course: 'Doctor of Medicine (MD), for graduates of any field', lvl: 3, yrs: 4, fee: null, fields: ['medicine'], url: 'https://www.duke-nus.edu.sg/admissions/tuition-scholarships' },

    // Biomedical and laboratory science. Temasek's Medical Biotechnology is left out: it is not a biomedical science or medical laboratory course by name.
    // The biomedical and pharmaceutical science diplomas are also the diploma route into the life sciences degrees (the study track's own route text names
    // them), so the research scientist (biomed-sci) sees them too. The two degrees below are the public life sciences degrees: NUS's BSc (Hons) in Life
    // Sciences (specialisations include Biomedical Science) and NTU's BSc (Hons) in Biological Sciences. SIT, SMU, SUSS and SUTD have no life sciences degree.
    // NUS says every degree in its College of Humanities and Sciences is a four-year Honours programme (NUS Bulletin AY2021/22; no newer page could be read),
    // and NTU's pages call its degree four years. Both fees are the school's own band for the course's faculty, so each carries a note.
    { school: 'NUS', course: 'Bachelor of Science (Honours) in Life Sciences', lvl: 3, yrs: 4, fee: 8300, note: 'NUS\'s fee for Humanities and Sciences, which includes this degree', fields: ['biomedical'], roles: ['biomed-sci'], url: 'https://www.dbs.nus.edu.sg/education/lifesciences/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Science (Honours) in Biological Sciences', lvl: 3, yrs: 4, fee: 8300, note: 'NTU lists one fee for all programmes outside Medicine', fields: ['biomedical'], roles: ['biomed-sci'], url: 'https://www.ntu.edu.sg/admissions/undergraduate/undergraduate-programme/bachelor-of-science-in-biological-sciences', src: ['fee-ntu'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Biomedical Science', lvl: 2, yrs: 3, fee: 3177.52, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa', 'biomed-sci'], url: 'https://www.sp.edu.sg/courses/schools/cls/biomedical-science', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Biomedical Science', lvl: 2, yrs: 3, fee: 3167.5, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa', 'biomed-sci'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-life-sciences-chemical-technology/diploma-in-biomedical-science', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Biomedical Science with Analytics', lvl: 2, yrs: 3, fee: 3188.09, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa', 'biomed-sci'], url: 'https://www.nyp.edu.sg/student/study/schools/applied-science/diploma-biomedical-science-analytics', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Biomedical Science', lvl: 2, yrs: 3, fee: 3186.5, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa', 'biomed-sci'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-biomedical-science/', src: ['fee-rp26'] },

    // Veterinary care. Temasek is the only public school with a veterinary course.
    { school: 'Temasek Polytechnic', course: 'Diploma in Veterinary Technology', lvl: 2, yrs: 3, fee: 3183.15, fields: ['veterinary'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/asc/veterinary-technology.html', src: ['fee-tp26'] },

    // Early childhood. Ngee Ann's Tamil Studies with Early Education is left out: it is a language course first.
    { school: 'ITE', course: 'Higher Nitec in Early Childhood Education', lvl: 1, yrs: 2, fee: 566, fields: ['earlychild'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-early-childhood-education/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Early Childhood Development & Education', lvl: 2, yrs: 3, fee: 3167.5, fields: ['earlychild'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-humanities-interdisciplinary-studies/diploma-in-early-childhood-development-education', src: ['fee-np26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Early Childhood Development & Education', lvl: 2, yrs: 3, fee: 3183.15, fields: ['earlychild'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/hss/early-childhood-development-education.html', src: ['fee-tp26'] },

    // Social work and community care. ITE's course is the 3-year Higher Nitec. The three diplomas are the diploma route into the social work, psychology
    // and social science degrees (the study track names them), so the youth worker, social worker and counsellor all see them.
    // Degrees: the social worker's is a social work degree (NUS, SUSS) and the counsellor's is a psychology or social science degree, usually followed by a
    // Master of Counselling (NUS, NTU and SUSS psychology; the social work degrees count too). NUS and NTU fees are the school's band for the course's
    // faculty (note on each). SUSS's fee page could not be read, so its fees are null. Left out: SMU's psychology degree and SUSS's part-time Bachelor of
    // Counselling (their pages and fees were not read); SIT, NTU and SUTD have no social work degree. NUS's degrees are four-year Honours (see biomedical above).
    // SUSS's psychology page was found only on MOE's course finder, which gives 4 years (direct honours).
    { school: 'ITE', course: 'Higher Nitec in Community Care & Social Services (3 years)', lvl: 1, yrs: 3, fee: 566, note: 'ITE pro-rates 3-year fees for students who finish early', fields: ['socialwork'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-community-care-and-social-services-3-year/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Psychology & Community Development', lvl: 2, yrs: 3, fee: 3167.5, fields: ['socialwork'], roles: ['youth-worker', 'social-worker', 'counsellor'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-humanities-interdisciplinary-studies/diploma-in-psychology-community-development', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Social Work', lvl: 2, yrs: 3, fee: 3188.09, fields: ['socialwork'], roles: ['youth-worker', 'social-worker', 'counsellor'], url: 'https://www.nyp.edu.sg/student/study/schools/health-social-sciences/diploma-social-work', src: ['fee-nyp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Psychology Studies', lvl: 2, yrs: 3, fee: 3183.15, fields: ['socialwork'], roles: ['youth-worker', 'social-worker', 'counsellor'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/hss/psychology-studies.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Social Sciences (Honours) with a Social Work major', lvl: 3, yrs: 4, fee: 8300, note: 'NUS\'s fee for Humanities and Sciences, which includes this degree', fields: ['socialwork'], roles: ['social-worker', 'counsellor'], url: 'https://fass.nus.edu.sg/swk/welcome', src: ['fee-nus26'] },
    { school: 'SUSS', course: 'Bachelor of Social Work', lvl: 3, yrs: 4, fee: null, fields: ['socialwork'], roles: ['social-worker', 'counsellor'], url: 'https://suss.edu.sg/programmes/detail/ft-bachelor-of-social-work' },
    { school: 'NUS', course: 'Bachelor of Social Sciences (Honours) with a Psychology major', lvl: 3, yrs: 4, fee: 8300, note: 'NUS\'s fee for Humanities and Sciences, which includes this degree', fields: ['socialwork'], roles: ['counsellor'], url: 'https://fass.nus.edu.sg/psy/degree-programmes/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Social Sciences (Honours) in Psychology', lvl: 3, yrs: 4, fee: 8300, note: 'NTU lists one fee for all programmes outside Medicine', fields: ['socialwork'], roles: ['counsellor'], url: 'https://www.ntu.edu.sg/admissions/undergraduate/undergraduate-programme/bachelor-of-social-sciences-in-psychology-(honours)', src: ['fee-ntu'] },
    { school: 'SUSS', course: 'Bachelor of Science in Psychology', lvl: 3, yrs: 4, fee: null, fields: ['socialwork'], roles: ['counsellor'], url: 'https://www.moe.gov.sg/coursefinder/coursedetail/ftpsymj1-bachelor-of-science-in-psychology' },

    // Interior design. Temasek's Interior Architecture & Design (listed under architecture above) also counts. ITE's Higher Nitec in Interior &
    // Product Design is at ITE College Central only, with a 2-year route (O-level or Nitec) and a 3-year route (N- or O-level). Nanyang's Experience
    // Design names interior designer among its careers and teaches spatial visualisation. Ngee Ann's Design (Architecture specialisation) and Nanyang's
    // Architecture are architecture courses first and are left on that field. LASALLE and NAFA publish fees for the August 2027 intake only.
    { school: 'ITE', course: 'Higher Nitec in Interior & Product Design', lvl: 1, yrs: 2, fee: 566, fields: ['interior-design'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-interior-and-product-design/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Interior & Product Design (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['interior-design'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-interior-and-product-design-3-year/', src: ['fee-ite26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Experience Design', lvl: 2, yrs: 3, fee: 3188.09, fields: ['interior-design', 'graphic-ux'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-experience-design', src: ['fee-nyp26'] },
    { school: 'LASALLE', course: 'Diploma in Spatial Design', lvl: 2, yrs: 3, fee: 5490, note: 'August 2027 intake', fields: ['interior-design'], url: 'https://www.lasalle.edu.sg/study/programmes/diploma/spatial-design/', src: ['fee-lasalle27'] },
    { school: 'NAFA', course: 'Diploma in Design (Interior and Spatial)', lvl: 2, yrs: 3, fee: 4810, note: 'August 2027 intake', fields: ['interior-design'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-design-interior-and-spatial', src: ['fee-nafa27'] },

    // Graphic and UX design. ITE's Higher Nitec in Communication Design (ITE College Central) has Graphic Design and Animation & Motion Graphics
    // specialisations, so it also serves animation, and its careers page names photographers, so it is the level-1 course for that role too.
    // Singapore Polytechnic's Media, Arts & Design diploma is one course with seven specialisations; each one that fits a field is its own entry.
    // Ngee Ann's Design diploma has two specialisations; its Product Innovation one lists UI/UX and visual communication designer as careers
    // (its Architecture one is on the architecture field above). Republic's Design diploma has three majors, of which Visual Communication and
    // User Experience are listed (the third, Games & Gamification, is a games course). Nanyang's Communication & Motion Design teaches graphic and
    // visual communication; UI/UX is only one of its electives. Temasek's Product Experience & Design teaches UX and product design, with no interior.
    { school: 'ITE', course: 'Higher Nitec in Communication Design', lvl: 1, yrs: 2, fee: 566, fields: ['graphic-ux', 'animation', 'media'], roles: ['multimedia', 'graphic', 'ux', 'animator', 'photographer'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-communication-design/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Communication Design (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['graphic-ux', 'animation', 'media'], roles: ['multimedia', 'graphic', 'ux', 'animator', 'photographer'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-communication-design-3-year/', src: ['fee-ite26'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Media, Arts & Design (Visual Communication & Motion Design)', lvl: 2, yrs: 3, fee: 3177.52, fields: ['graphic-ux'], url: 'https://www.sp.edu.sg/courses/schools/mad/visual-communication-and-motion-design', src: ['fee-poly'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Media, Arts & Design (Experience & Product Design)', lvl: 2, yrs: 3, fee: 3177.52, fields: ['graphic-ux'], url: 'https://www.sp.edu.sg/courses/schools/mad/experience-and-product-design', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Design (Product Innovation specialisation)', lvl: 2, yrs: 3, fee: 3167.5, fields: ['graphic-ux'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-design-environment/diploma-in-design', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Communication & Motion Design', lvl: 2, yrs: 3, fee: 3188.09, fields: ['graphic-ux'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-communication-motion-design', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Design (Visual Communication and User Experience majors)', lvl: 2, yrs: 3, fee: 3186.5, fields: ['graphic-ux'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-design/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Communication Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['graphic-ux'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/communication-design.html', src: ['fee-tp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Product Experience & Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['graphic-ux'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/product-experience-and-design.html', src: ['fee-tp26'] },
    { school: 'LASALLE', course: 'Diploma in Graphic Design and Experiences', lvl: 2, yrs: 3, fee: 5490, note: 'August 2027 intake', fields: ['graphic-ux'], url: 'https://www.lasalle.edu.sg/study/programmes/diploma/graphic-design-and-experiences/', src: ['fee-lasalle27'] },
    { school: 'NAFA', course: 'Diploma in Design Communication and Strategy', lvl: 2, yrs: 3, fee: 4810, note: 'August 2027 intake', fields: ['graphic-ux'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-design-communication-and-strategy', src: ['fee-nafa27'] },

    // Fashion design. Only Temasek (Year 2: choose Fashion Design or Fashion Management) and NAFA (choose Fashion Design, Business or Textiles when applying)
    // teach it at diploma level; NAFA's fee is its "Fashion Studies" band, $450 above its design band because it includes the graduation show.
    // ITE has no fashion design course (its Visual Merchandising is a retail display course). LASALLE's Diploma in Creative Direction for Fashion is left
    // out: its own page says it is not a fashion design programme (garment design is its BA (Hons) Fashion Design and Textiles, a degree).
    { school: 'Temasek Polytechnic', course: 'Diploma in Fashion Management & Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['fashion'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/fashion-management-and-design.html', src: ['fee-tp26'] },
    { school: 'NAFA', course: 'Diploma in Fashion', lvl: 2, yrs: 3, fee: 5260, note: 'AY2027 Fashion Studies band', fields: ['fashion'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-fashion', src: ['fee-nafa27'] },

    // Animation. ITE's Communication Design (listed under graphic and UX design above) has an Animation & Motion Graphics specialisation. Singapore
    // Polytechnic's specialisation is Animation & Games. Nanyang's diploma covers 2D and 3D animation and visual effects. NAFA's Digital Illustration
    // and Narrative teaches frame-by-frame animation, cel animation and stop motion. Republic's Design (Games & Gamification major) is a games course,
    // and Temasek's Communication Design teaches motion graphics only, so both are left out. LASALLE's BA (Hons) Animation Art is a degree and no
    // animation role needs one.
    { school: 'Singapore Polytechnic', course: 'Diploma in Media, Arts & Design (Animation & Games)', lvl: 2, yrs: 3, fee: 3177.52, fields: ['animation'], url: 'https://www.sp.edu.sg/courses/schools/mad/animation-and-games', src: ['fee-poly'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Animation, Games & Visual Effects', lvl: 2, yrs: 3, fee: 3188.09, fields: ['animation'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-animation-games-visual-effects', src: ['fee-nyp26'] },
    { school: 'NAFA', course: 'Diploma in Digital Illustration and Narrative', lvl: 2, yrs: 3, fee: 4810, note: 'August 2027 intake', fields: ['animation'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-digital-illustration-and-narrative', src: ['fee-nafa27'] },

    // Media and content. Level 1: ITE's Film & Video Production is tied to the video editor (its careers are camera, lighting and production crew), and
    // Communication Design (above) is the photographer's course because its careers page names photographers. Level 2: the film, mass communication
    // and content diplomas. Singapore Polytechnic's Story & Content Creation specialisation teaches video, scriptwriting and journalism; its Digital
    // Media & Communications specialisation is a marketing course and is left out. Republic's Mass Communication is listed under its School of
    // Business. Level 3: NTU and NUS, the two universities with a media degree whose page could be read. SMU's communication management is a business
    // major, and SIT's and SUSS's pages turn scripts away, so they are not listed. NUS's Communications and New Media page also blocks scripts, so its
    // 4 years is the usual length of a NUS honours degree rather than a figure read from the page. LASALLE and NAFA teach film and media in
    // degrees that no media role needs, and LASALLE has no media diploma.
    { school: 'ITE', course: 'Higher Nitec in Film & Video Production', lvl: 1, yrs: 2, fee: 566, fields: ['media'], roles: ['video'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-film-and-video-production/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Film & Video Production (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['media'], roles: ['video'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-film-and-video-production-3-year/', src: ['fee-ite26'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Media, Arts & Design (Story & Content Creation)', lvl: 2, yrs: 3, fee: 3177.52, fields: ['media'], url: 'https://www.sp.edu.sg/courses/schools/mad/story-and-content-creation', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Mass Communication', lvl: 2, yrs: 3, fee: 3167.5, fields: ['media'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-film-media-studies/diploma-in-mass-communication', src: ['fee-np26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Film, Sound & Video', lvl: 2, yrs: 3, fee: 3167.5, fields: ['media'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-film-media-studies/diploma-in-film-sound-video', src: ['fee-np26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Mass Communication', lvl: 2, yrs: 3, fee: 3186.5, fields: ['media'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-mass-communication/', src: ['fee-rp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Digital Content Creation', lvl: 2, yrs: 3, fee: 3186.5, fields: ['media'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-digital-content-creation/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Digital Film & Television', lvl: 2, yrs: 3, fee: 3183.15, fields: ['media'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/digital-film-television.html', src: ['fee-tp26'] },
    { school: 'NAFA', course: 'Diploma in Media Experience and Innovation', lvl: 2, yrs: 3, fee: 4810, note: 'August 2027 intake', fields: ['media'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-media-experience-and-innovation', src: ['fee-nafa27'] },
    { school: 'NUS', course: 'Bachelor of Social Sciences (Honours) with a major in Communications and New Media', lvl: 3, yrs: 4, fee: 8300, note: 'length is the usual NUS honours length', fields: ['media'], url: 'https://fass.nus.edu.sg/cnm/undergraduate', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Communication Studies (Honours)', lvl: 3, yrs: 4, fee: 8300, note: 'length inferred from NTU\'s Year 1 to Year 4 plan', fields: ['media'], url: 'https://www.ntu.edu.sg/admissions/undergraduate/undergraduate-programme/bachelor-of-communication-studies', src: ['fee-ntu'] },

    // Translation and languages. The Malay translator needs a degree. NUS's Malay Studies is the one local degree whose page could be matched to the role;
    // NUS's pages block scripts, so the degree's 4 years is the usual length of a NUS honours degree (the department says the pass degree is no longer
    // offered). SUSS's BA in Malay Language and Literature (part-time) exists, but SUSS's pages turn scripts away, so its length and fee are unconfirmed
    // and it is not listed. NTU's Linguistics and Multilingual Studies does not mention translation or teach Malay, and no polytechnic teaches Malay translation.
    { school: 'NUS', course: 'Bachelor of Arts (Honours) with a major in Malay Studies', lvl: 3, yrs: 4, fee: 8300, note: 'length is the usual NUS honours length', fields: ['translation'], roles: ['translator'], url: 'https://fass.nus.edu.sg/mls/honours-programme-and-single-major/', src: ['fee-nus26'] },
  ];

  /* Tech, engineering and aviation fields. Added with push so the lines above stay untouched. ITE entries are the 2-year Higher Nitec at the AY2026
     rate ($283 a term, $566 a year, source 'fee-ite26'); most of them also have a 3-year version, which is not listed. ITE is listed only for fields
     that have a role reachable from ITE. The polytechnics charge one rate for every full-time diploma (checked October 2026): Singapore Polytechnic
     $3,177.52, Ngee Ann $3,167.50, Nanyang $3,188.09, Republic $3,186.50, Temasek $3,183.15. */
  COURSES.push(
    // Computing and software. The ITE Immersive Applications & Game and Temasek's Immersive Media & Game Development are tied to the game developer.
    { school: 'ITE', course: 'Higher Nitec in IT Systems & Networks', lvl: 1, yrs: 2, fee: 566, fields: ['computing'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-it-systems-and-networks/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in IT Applications Development', lvl: 1, yrs: 2, fee: 566, fields: ['computing'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-it-applications-development/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Immersive Applications & Game', lvl: 1, yrs: 2, fee: 566, fields: ['computing'], roles: ['game-dev'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-immersive-applications-and-game/', src: ['fee-ite26'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Computer Science', lvl: 2, yrs: 3, fee: 3177.52, fields: ['computing'], url: 'https://www.sp.edu.sg/courses/schools/soc/computer-science', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Information Technology', lvl: 2, yrs: 3, fee: 3167.5, fields: ['computing'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-infocomm-technology/diploma-in-information-technology', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Computing', lvl: 2, yrs: 3, fee: 3188.09, fields: ['computing'], url: 'https://www.nyp.edu.sg/student/study/schools/information-technology/diploma-computing', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Information Technology', lvl: 2, yrs: 3, fee: 3186.5, fields: ['computing'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-information-technology/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Information Technology', lvl: 2, yrs: 3, fee: 3183.15, fields: ['computing'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/iit/information-technology.html', src: ['fee-tp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Immersive Media & Game Development', lvl: 2, yrs: 3, fee: 3183.15, fields: ['computing'], roles: ['game-dev'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/iit/immersive-media-and-game-development.html', src: ['fee-tp26'] },

    // Data and AI, diplomas. Nanyang's AI & Data Engineering sits in its School of Engineering; the other seven are in the polytechnics' infocomm schools.
    { school: 'Singapore Polytechnic', course: 'Diploma in Applied AI & Analytics', lvl: 2, yrs: 3, fee: 3177.52, fields: ['data-ai'], url: 'https://www.sp.edu.sg/courses/schools/soc/applied-ai-analytics', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Applied AI & Analytics', lvl: 2, yrs: 3, fee: 3167.5, fields: ['data-ai'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-infocomm-technology/diploma-in-applied-ai-analytics', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Applied AI & Analytics', lvl: 2, yrs: 3, fee: 3188.09, fields: ['data-ai'], url: 'https://www.nyp.edu.sg/student/study/schools/information-technology/diploma-applied-AI-analytics', src: ['fee-nyp26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in AI & Data Engineering', lvl: 2, yrs: 3, fee: 3188.09, fields: ['data-ai'], url: 'https://www.nyp.edu.sg/student/study/schools/engineering/diploma-AI-data-engineering', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Applied AI & Analytics', lvl: 2, yrs: 3, fee: 3186.5, fields: ['data-ai'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-applied-ai-and-analytics/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Applied Artificial Intelligence', lvl: 2, yrs: 3, fee: 3183.15, fields: ['data-ai'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/iit/applied-artificial-intelligence.html', src: ['fee-tp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Big Data & Analytics', lvl: 2, yrs: 3, fee: 3183.15, fields: ['data-ai'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/iit/big-data-analytics.html', src: ['fee-tp26'] },

    // Cybersecurity. All five polytechnics run a Cybersecurity & Digital Forensics diploma.
    { school: 'Singapore Polytechnic', course: 'Diploma in Cybersecurity & Digital Forensics', lvl: 2, yrs: 3, fee: 3177.52, fields: ['cybersecurity'], url: 'https://www.sp.edu.sg/courses/schools/soc/cybersecurity-digital-forensics', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Cybersecurity & Digital Forensics', lvl: 2, yrs: 3, fee: 3167.5, fields: ['cybersecurity'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-infocomm-technology/diploma-in-cybersecurity-digital-forensic', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Cybersecurity & Digital Forensics', lvl: 2, yrs: 3, fee: 3188.09, fields: ['cybersecurity'], url: 'https://www.nyp.edu.sg/student/study/schools/information-technology/diploma-cybersecurity-digital-forensics', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Cybersecurity & Digital Forensics', lvl: 2, yrs: 3, fee: 3186.5, fields: ['cybersecurity'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-cybersecurity-and-digital-forensics/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Cybersecurity & Digital Forensics', lvl: 2, yrs: 3, fee: 3183.15, fields: ['cybersecurity'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/iit/cybersecurity-digital-forensics.html', src: ['fee-tp26'] },

    // Civil engineering. Singapore Polytechnic is the only polytechnic with a civil engineering diploma, and none runs a quantity surveying one, so the
    // quantity surveyor has no diploma listed.
    { school: 'Singapore Polytechnic', course: 'Diploma in Civil Engineering', lvl: 2, yrs: 3, fee: 3177.52, fields: ['civil-eng'], roles: ['civil-eng'], url: 'https://www.sp.edu.sg/courses/schools/abe/civil-engineering', src: ['fee-poly'] },

    // Mechanical engineering. Only Singapore Polytechnic and Ngee Ann have a diploma of this name.
    { school: 'Singapore Polytechnic', course: 'Diploma in Mechanical Engineering', lvl: 2, yrs: 3, fee: 3177.52, fields: ['mechanical-eng'], url: 'https://www.sp.edu.sg/courses/schools/mae/mechanical-engineering', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Mechanical Engineering', lvl: 2, yrs: 3, fee: 3167.5, fields: ['mechanical-eng'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-engineering/diploma-in-mechanical-engineering', src: ['fee-np26'] },

    // Electrical engineering, diplomas.
    { school: 'Singapore Polytechnic', course: 'Diploma in Electrical & Electronic Engineering', lvl: 2, yrs: 3, fee: 3177.52, fields: ['electrical-eng'], url: 'https://www.sp.edu.sg/courses/schools/eee/electrical-electronic-engineering', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Electrical Engineering', lvl: 2, yrs: 3, fee: 3167.5, fields: ['electrical-eng'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-engineering/diploma-in-electrical-engineering', src: ['fee-np26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Electronic & Computer Engineering', lvl: 2, yrs: 3, fee: 3167.5, fields: ['electrical-eng'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-engineering/diploma-in-electronic-computer-engineering', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Electronic & Computer Engineering', lvl: 2, yrs: 3, fee: 3188.09, fields: ['electrical-eng'], url: 'https://www.nyp.edu.sg/student/study/schools/engineering/diploma-electronic-computer-engineering', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Electrical & Electronic Engineering', lvl: 2, yrs: 3, fee: 3186.5, fields: ['electrical-eng'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-electrical-and-electronic-engineering/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Electrical & Electronic Engineering', lvl: 2, yrs: 3, fee: 3183.15, fields: ['electrical-eng'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/eng/electronics.html', src: ['fee-tp26'] },

    // Engineering technology (ITE only).
    { school: 'ITE', course: 'Higher Nitec in Mechanical Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['engineering'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-mechanical-engineering/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Mechatronics Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['engineering'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-mechatronics-engineering/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Precision Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['engineering'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-precision-engineering/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Advanced Manufacturing', lvl: 1, yrs: 2, fee: 566, fields: ['engineering'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-advanced-manufacturing/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Electronics Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['engineering'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-electronics-engineering/', src: ['fee-ite26'] },

    // Technical trades (ITE only). Each course is tied to the trades it trains for.
    { school: 'ITE', course: 'Higher Nitec in Electrical Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['trades'], roles: ['electrician', 'solar-tech'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-electrical-engineering/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Automotive Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['trades'], roles: ['ev-tech'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-automotive-engineering/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Facilities Management & Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['trades'], roles: ['facilities-tech'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-facilities-management-and-engineering/', src: ['fee-ite26'] },

    // Aircraft maintenance (ITE only). ITE College Central runs it as a Singapore Airworthiness Requirements Part-147 course approved by CAAS.
    { school: 'ITE', course: 'Higher Nitec in Aerospace Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['aero'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-aerospace-engineering/', src: ['fee-ite26'] },

    // Maritime and port operations. Singapore Polytechnic's Singapore Maritime Academy is the only school with a marine engineering diploma.
    { school: 'ITE', course: 'Higher Nitec in Logistics & Supply Chain Management', lvl: 1, yrs: 2, fee: 566, fields: ['maritime'], roles: ['port-ops'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-logistics-and-supply-chain-management/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Marine & Offshore Engineering', lvl: 1, yrs: 2, fee: 566, fields: ['maritime'], roles: ['marine-eng'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-marine-offshore-engineering/', src: ['fee-ite26'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Marine Engineering', lvl: 2, yrs: 3, fee: 3177.52, fields: ['maritime'], roles: ['marine-eng'], url: 'https://www.sp.edu.sg/courses/schools/sma/marine-engineering', src: ['fee-poly'] },
  );

  /* Tech and engineering degrees. NUS charges $8,300 a year for its Computing and Design and Engineering degrees and NTU $8,300 for all programmes
     except business, medicine and the Renaissance Engineering Programme (AY2026/27 new students); SUTD charges $13,500 (AY2026). SIT's and SMU's pages
     block automated reading and SIT's own pages disagree on its per-credit rate, so their fees are null. SMU is left out of data and AI: it has
     no data science degree of its own, only a second major. Computing and cybersecurity roles need a diploma at most, so no degrees are listed for them. */
  COURSES.push(
    // Data and AI. NUS's Data Science and Analytics degree is being replaced by a Data Science and Applied AI major, so it is not listed.
    { school: 'NUS', course: 'Bachelor of Computing in Computer Science', lvl: 3, yrs: 4, fee: 8300, fields: ['data-ai'], url: 'https://www.comp.nus.edu.sg/programmes/ug/cs/', src: ['fee-nus26'] },
    { school: 'NUS', course: 'Bachelor of Science in Business Analytics', lvl: 3, yrs: 4, fee: 8300, fields: ['data-ai'], url: 'https://www.comp.nus.edu.sg/programmes/ug/ba/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Science in Data Science and Artificial Intelligence', lvl: 3, yrs: 4, fee: 8300, fields: ['data-ai'], url: 'https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-science-in-data-science-artificial-intelligence', src: ['fee-ntu'] },
    { school: 'SUTD', course: 'Bachelor of Science in Design and Artificial Intelligence', lvl: 3, yrs: 3.5, fee: 13500, fields: ['data-ai'], url: 'https://www.sutd.edu.sg/dai/education/undergraduate/curriculum/', src: ['fee-sutd26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Applied Artificial Intelligence', lvl: 3, yrs: 3, fee: 7500, note: 'annual average: $22,500 total over 3 years; billed by credits taken', fields: ['data-ai'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/applied-artificial-intelligence', src: ['fee-sit-ai26'] },

    // Civil engineering. Only the civil engineer needs a degree: the quantity surveyor's diploma is enough.
    { school: 'NUS', course: 'Bachelor of Engineering (Civil Engineering)', lvl: 3, yrs: 4, fee: 8300, fields: ['civil-eng'], roles: ['civil-eng'], url: 'https://cde.nus.edu.sg/cee/undergraduate/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Engineering in Civil Engineering', lvl: 3, yrs: 4, fee: 8300, fields: ['civil-eng'], roles: ['civil-eng'], url: 'https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-engineering-in-civil-engineering', src: ['fee-ntu'] },
    { school: 'SIT', course: 'Bachelor of Engineering with Honours in Civil Engineering', lvl: 3, yrs: 4, fee: null, fields: ['civil-eng'], roles: ['civil-eng'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/sit-civil-engineering' },

    // Mechanical engineering. SIT's Mechanical Design and Manufacturing Engineering takes its last cohort in AY2026/27, so it is not listed.
    { school: 'NUS', course: 'Bachelor of Engineering (Mechanical Engineering)', lvl: 3, yrs: 4, fee: 8300, fields: ['mechanical-eng'], url: 'https://cde.nus.edu.sg/me/undergraduate/beng-me/overview/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Engineering in Mechanical Engineering', lvl: 3, yrs: 4, fee: 8300, fields: ['mechanical-eng'], url: 'https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-engineering-in-mechanical-engineering', src: ['fee-ntu'] },

    // Electrical engineering.
    { school: 'NUS', course: 'Bachelor of Engineering (Electrical Engineering)', lvl: 3, yrs: 4, fee: 8300, fields: ['electrical-eng'], url: 'https://cde.nus.edu.sg/ece/undergraduate/what-is-ece/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Engineering in Electrical and Electronic Engineering', lvl: 3, yrs: 4, fee: 8300, fields: ['electrical-eng'], url: 'https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-engineering-in-electrical-and-electronic-engineering-(eee)', src: ['fee-ntu'] },
    { school: 'SIT', course: 'Bachelor of Engineering with Honours in Electrical and Electronic Engineering', lvl: 3, yrs: 4, fee: null, fields: ['electrical-eng'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/electrical-and-electronic-engineering' }
  );

  /* Business and services courses (Task 9). Added as their own block, after the array above, so that the lines other fields add to the
     array never touch these; the entries are the same shape. Every ITE Higher Nitec has a 2-year course (O-level entry) and a 3-year
     course (N-level entry); both are listed, at the same $566 a year. */
  COURSES.push(
    // Business: the ITE route for the customer-facing roles (customer service, retail, sales).
    { school: 'ITE', course: 'Higher Nitec in Business Administration', lvl: 1, yrs: 2, fee: 566, fields: ['business'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-business-administration/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Business Administration (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['business'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-business-administration-3-year/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Customer Experience', lvl: 1, yrs: 2, fee: 566, fields: ['business'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-customer-experience/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Customer Experience (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['business'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-customer-experience-3-year/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Retail & Online Business', lvl: 1, yrs: 2, fee: 566, fields: ['business'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-retail-and-online-business/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Retail & Online Business (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['business'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-retail-and-online-business-3-year/', src: ['fee-ite26'] },
    // Business diplomas. The Common Business Programme (a shared first year at Ngee Ann, Republic and Temasek) is not a diploma, so it is left out, as are
    // Nanyang's Media & Communication Management and Republic's Consumer Insights & Psychology. Nanyang's Business & Financial Technology (new for 2027
    // entry) has no course page yet. Republic's Business Process & Engineering Management is an engineering-school course. Fees are the same for every
    // diploma at a polytechnic: each fee page gives one figure.
    { school: 'Singapore Polytechnic', course: 'Diploma in Business Administration', lvl: 2, yrs: 3, fee: 3177.52, fields: ['business'], url: 'https://www.sp.edu.sg/courses/schools/sb/business-administration', src: ['fee-poly'] },
    { school: 'Singapore Polytechnic', course: 'Diploma in Human Resource Management with Psychology', lvl: 2, yrs: 3, fee: 3177.52, fields: ['business'], roles: ['hr'], url: 'https://www.sp.edu.sg/courses/schools/sb/human-resource-management-with-psychology', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Business Studies', lvl: 2, yrs: 3, fee: 3167.5, fields: ['business'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-business-accountancy/diploma-in-business-studies', src: ['fee-np26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in International Trade & Business', lvl: 2, yrs: 3, fee: 3167.5, fields: ['business'], roles: ['bizdev', 'ops-exec'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-business-accountancy/diploma-in-international-trade-business', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Business Management', lvl: 2, yrs: 3, fee: 3188.09, fields: ['business'], url: 'https://www.nyp.edu.sg/student/study/schools/business-management/diploma-business-management', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Business', lvl: 2, yrs: 3, fee: 3186.5, fields: ['business'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-business/', src: ['fee-rp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Human Resource Management with Psychology', lvl: 2, yrs: 3, fee: 3186.5, fields: ['business'], roles: ['hr'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-human-resource-management-with-psychology/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Business', lvl: 2, yrs: 3, fee: 3183.15, fields: ['business'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/bus/business.html', src: ['fee-tp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Marketing', lvl: 2, yrs: 3, fee: 3183.15, fields: ['business'], roles: ['marketing', 'ecommerce'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/bus/marketing.html', src: ['fee-tp26'] },
    // Business degrees. Only the sustainability analyst needs one (edu 3), and its track names "a business degree", so the flagship business degree of
    // each university is tied to that role. NUS's BBA is also the degree for the finance, risk and supply chain roles (it has Finance and Operations &
    // Supply Chain Management majors). The fee is the "Business" band at NUS ($9,700), the business-related band at NTU ($9,500) and SMU's own figure.
    { school: 'NUS', course: 'Bachelor of Business Administration (Honours)', lvl: 3, yrs: 4, fee: 9700, fields: ['business', 'finance-risk', 'logistics'], roles: ['sustainability', 'compliance', 'risk-analyst', 'supply-chain'], url: 'https://bba.nus.edu.sg/introduction/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Business (Honours)', lvl: 3, yrs: 4, fee: 9500, fields: ['business'], roles: ['sustainability'], url: 'https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-business', src: ['fee-ntu'] },
    // SMU's BBM has Finance and Quantitative Finance majors, so it is also a degree for the compliance and risk roles.
    { school: 'SMU', course: 'Bachelor of Business Management', lvl: 3, yrs: 4, fee: 11550, fields: ['business', 'finance-risk'], roles: ['sustainability', 'compliance', 'risk-analyst'], url: 'https://business.smu.edu.sg/programmes/bachelor-business-management', src: ['fee-smu26'] }
  );

  /* Accounting and audit. NUS's accountancy degree is its own BBA (Accountancy); NTU's is a 3-year direct honours degree. SIT's page could not be read by
     a script, so its degree has no fee and links to SIT's business and management list; its title is SIT's listing name ("Accountancy", 3 years, 180
     credits). SUSS's Bachelor of Accountancy is a 4-year direct honours degree by the Ministry of Education's course finder; SUSS's fee page is closed to
     scripts, so it has no fee either. Republic Polytechnic has no accountancy diploma. */
  COURSES.push(
    { school: 'Singapore Polytechnic', course: 'Diploma in Accountancy', lvl: 2, yrs: 3, fee: 3177.52, fields: ['accounting'], url: 'https://www.sp.edu.sg/courses/schools/sb/accountancy', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Accountancy', lvl: 2, yrs: 3, fee: 3167.5, fields: ['accounting'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-business-accountancy/diploma-in-accountancy', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Accountancy & Finance', lvl: 2, yrs: 3, fee: 3188.09, fields: ['accounting'], url: 'https://www.nyp.edu.sg/student/study/schools/business-management/diploma-accountancy-finance', src: ['fee-nyp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Accountancy & Finance', lvl: 2, yrs: 3, fee: 3183.15, fields: ['accounting'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/bus/accountancy-finance.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Business Administration (Accountancy) (Honours)', lvl: 3, yrs: 4, fee: 9700, fields: ['accounting'], url: 'https://www.nus.edu.sg/nusbulletin/ay202526/programmes/school-of-business/undergraduate-education/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Accountancy', lvl: 3, yrs: 3, fee: 9500, fields: ['accounting'], url: 'https://www.ntu.edu.sg/education/undergraduate-programme/bachelor-of-accountancy', src: ['fee-ntu'] },
    { school: 'SMU', course: 'Bachelor of Accountancy', lvl: 3, yrs: 4, fee: 11550, fields: ['accounting'], url: 'https://admissions.smu.edu.sg/programmes/school-accountancy', src: ['fee-smu26'] },
    { school: 'SIT', course: 'Degree in Accountancy', lvl: 3, yrs: 3, fee: null, note: 'SIT charges by the credit', fields: ['accounting'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/business-and-management-degrees' },
    { school: 'SUSS', course: 'Bachelor of Accountancy', lvl: 3, yrs: 4, fee: null, fields: ['accounting'], url: 'https://www.suss.edu.sg/programmes/detail/ft-bachelor-of-accountancy' }
  );

  /* Finance, risk and compliance, and Islamic finance. No public school has an Islamic finance course, so the Islamic banking and takaful roles use the
     same banking and finance diplomas as the conventional banking roles (the reason for the extra field). Republic's Financial Technology diploma is
     for the finance roles only. Temasek has no banking diploma (its Accountancy & Finance is listed under accounting). The degrees for the compliance
     and risk roles are the NUS and SMU business degrees above, which have Finance majors. */
  COURSES.push(
    { school: 'Singapore Polytechnic', course: 'Diploma in Banking & Finance', lvl: 2, yrs: 3, fee: 3177.52, fields: ['finance-risk', 'islamicfin'], url: 'https://www.sp.edu.sg/courses/schools/sb/banking-finance', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Banking & Finance', lvl: 2, yrs: 3, fee: 3167.5, fields: ['finance-risk', 'islamicfin'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-business-accountancy/diploma-in-banking-finance', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Banking & Finance', lvl: 2, yrs: 3, fee: 3188.09, fields: ['finance-risk', 'islamicfin'], url: 'https://www.nyp.edu.sg/student/study/schools/business-management/diploma-banking-finance', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Financial Technology', lvl: 2, yrs: 3, fee: 3186.5, fields: ['finance-risk'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-financial-technology/', src: ['fee-rp26'] }
  );

  /* Logistics and supply chain. ITE's course is the route for the logistics coordinator. The supply chain analyst (edu 3) goes by a diploma, then a degree:
     Republic's Supply Chain Management and Temasek's International Trade & Logistics at the polytechnics, and SUSS and SIT, whose degree pages could
     not be read by a script, so neither has a fee (SUSS: a 4-year direct honours degree, by the Ministry of Education's course finder; SIT: its listing
     "Digital Supply Chain", 3 years, 180 credits). NUS's BBA has an Operations & Supply Chain Management major and is listed in the block above. */
  COURSES.push(
    { school: 'ITE', course: 'Higher Nitec in Logistics & Supply Chain Management', lvl: 1, yrs: 2, fee: 566, fields: ['logistics'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-logistics-and-supply-chain-management/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Logistics & Supply Chain Management (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['logistics'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-logistics-and-supply-chain-management-3-year/', src: ['fee-ite26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Supply Chain Management', lvl: 2, yrs: 3, fee: 3186.5, fields: ['logistics'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-supply-chain-management/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in International Trade & Logistics', lvl: 2, yrs: 3, fee: 3183.15, fields: ['logistics'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/bus/international-trade-and-logistics.html', src: ['fee-tp26'] },
    { school: 'SIT', course: 'Degree in Digital Supply Chain', lvl: 3, yrs: 3, fee: null, note: 'SIT charges by the credit', fields: ['logistics'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/business-and-management-degrees' },
    { school: 'SUSS', course: 'Bachelor of Science in Supply Chain Management', lvl: 3, yrs: 4, fee: null, fields: ['logistics'], url: 'https://www.moe.gov.sg/coursefinder/coursedetail/ftscmmj1-bachelor-of-science-in-supply-chain-management' }
  );

  /* Law. Temasek's diploma is the only public one for the legal executive. The LLBs are NUS and SMU (4 years, $12,750 a year for the 2026/27 intake, the same
     at both) and SUSS, whose LLB is a part-time evening course of about 4½ years. SUSS charges by the credit, with no yearly figure: it estimates $46,840 for
     the whole programme for Singapore Citizens with the grant (its fee sheet of 13 March 2026), so its fee here is null. The SMU Juris Doctor and NUS JD,
     which take graduates of other fields, are not listed. */
  COURSES.push(
    { school: 'Temasek Polytechnic', course: 'Diploma in Law & Management', lvl: 2, yrs: 3, fee: 3183.15, fields: ['law'], roles: ['paralegal'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/bus/law-management.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Laws (LLB)', lvl: 3, yrs: 4, fee: 12750, fields: ['law'], url: 'https://law1a.nus.edu.sg/admissions/4_yrs_llb_prog.html', src: ['fee-nus26'] },
    { school: 'SMU', course: 'Bachelor of Laws (LLB)', lvl: 3, yrs: 4, fee: 12750, fields: ['law'], url: 'https://law.smu.edu.sg/llb', src: ['fee-smu26'] },
    { school: 'SUSS', course: 'Bachelor of Laws (LLB)', lvl: 3, yrs: 4.5, fee: null, mode: 'part-time', fields: ['law'], note: 'SUSS charges by the credit, with no yearly fee; it estimates about $46,840 for the whole programme for Singapore Citizens (fee sheet of 13 March 2026)', url: 'https://www.suss.edu.sg/programmes/detail/bachelor-of-laws-lawllb' }
  );

  /* Hospitality and events. ITE's course is for the restaurant supervisor; the diplomas are for the hotel and events roles. Left out: Nanyang's Food &
     Beverage Business and Republic's Restaurant & Culinary Management (food-business courses), Ngee Ann's Hotel & Leisure Facilities Management (a building
     course) and Stage & Live Events (a production course). Singapore Polytechnic has no hospitality diploma. SIT's degree (a 3-year, 180-credit
     programme in its listing) has no fee, as its page could not be read by a script; no role in the field needs a degree, so it is the route up from the diploma. */
  COURSES.push(
    { school: 'ITE', course: 'Higher Nitec in Hospitality Operations', lvl: 1, yrs: 2, fee: 566, fields: ['hospitality'], roles: ['fnb'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-hospitality-operations/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Hospitality Operations (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['hospitality'], roles: ['fnb'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-hospitality-operations-3-year/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Tourism & Resort Management', lvl: 2, yrs: 3, fee: 3167.5, fields: ['hospitality'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-business-accountancy/diploma-in-tourism-resort-management', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Hospitality & Tourism Management', lvl: 2, yrs: 3, fee: 3188.09, fields: ['hospitality'], url: 'https://www.nyp.edu.sg/student/study/schools/business-management/diploma-hospitality-tourism-management', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Hospitality & Tourism Management', lvl: 2, yrs: 3, fee: 3186.5, fields: ['hospitality'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-hospitality-and-tourism-management/', src: ['fee-rp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Hotel & Leisure Management', lvl: 2, yrs: 3, fee: 3186.5, fields: ['hospitality'], roles: ['hotel'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-hotel-leisure-and-management/', src: ['fee-rp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Events & Project Management', lvl: 2, yrs: 3, fee: 3186.5, fields: ['hospitality'], roles: ['events'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-events-and-project-management/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Hospitality & Tourism Management', lvl: 2, yrs: 3, fee: 3183.15, fields: ['hospitality'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/bus/hospitality-tourism-management.html', src: ['fee-tp26'] },
    { school: 'SIT', course: 'Degree in Hospitality and Tourism Management', lvl: 3, yrs: 3, fee: null, note: 'SIT charges by the credit', fields: ['hospitality'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/business-and-management-degrees' }
  );

  /* Culinary and baking (ITE only: both roles are reachable with a Higher Nitec). Culinary Arts is for the chef and Pastry & Baking for the baker. The 1-year
     versions of both are for Nitec graduates and are not listed. The polytechnic diplomas (Temasek's Culinary Arts & Management, Republic's Restaurant &
     Culinary Management) are not listed either, as no role needs one. */
  COURSES.push(
    { school: 'ITE', course: 'Higher Nitec in Culinary Arts', lvl: 1, yrs: 2, fee: 566, fields: ['culinary'], roles: ['chef'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-culinary-arts-2-year/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Culinary Arts (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['culinary'], roles: ['chef'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-culinary-arts-3-year/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Pastry & Baking', lvl: 1, yrs: 2, fee: 566, fields: ['culinary'], roles: ['pastry'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-pastry-and-baking-2-year/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Pastry & Baking (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['culinary'], roles: ['pastry'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-pastry-and-baking-3-year/', src: ['fee-ite26'] }
  );

  /* Cabin crew and aviation service (ITE only). Passenger Services is the only public course whose page names cabin crew as a career (it also names airport
     passenger service agents). Republic's and Temasek's Aviation Management diplomas are for the air transport business side, not crew, and no role needs a
     diploma, so they are not listed. */
  COURSES.push(
    { school: 'ITE', course: 'Higher Nitec in Passenger Services', lvl: 1, yrs: 2, fee: 566, fields: ['aviation'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-passenger-services/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Passenger Services (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['aviation'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-passenger-services-3-year/', src: ['fee-ite26'] }
  );

  /* Hair and beauty (ITE only). The hairstylist role is hair, but the field covers beauty, so the beauty course is listed too. Students buy about $400 of
     training materials on top of the fee (ITE's 2026 intake page); the fee here is the course fee only. */
  COURSES.push(
    { school: 'ITE', course: 'Higher Nitec in Hairdressing & Salon Management', lvl: 1, yrs: 2, fee: 566, fields: ['beauty'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-hairdressing-and-salon-management/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Hairdressing & Salon Management (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['beauty'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-hairdressing-and-salon-management-3-year/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Beauty & Wellness Management', lvl: 1, yrs: 2, fee: 566, fields: ['beauty'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-beauty-and-wellness-management/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Beauty & Wellness Management (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['beauty'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-beauty-and-wellness-management-3-year/', src: ['fee-ite26'] }
  );

  /* Sport and fitness (ITE only). Sport Management is the only ITE sport course. The polytechnic diplomas (Nanyang's Sport & Wellness Management,
     Republic's Sport & Exercise Science and Sport Coaching) are not listed, as the fitness trainer role needs only ITE. */
  COURSES.push(
    { school: 'ITE', course: 'Higher Nitec in Sport Management', lvl: 1, yrs: 2, fee: 566, fields: ['sport'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-sport-management/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Sport Management (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['sport'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-sport-management-3-year/', src: ['fee-ite26'] }
  );

  /* Real estate (property): no public course at level 1. The real estate salesperson role is reached by the Council for Estate Agencies' course and exam
     (the route page says so), not by a school. Ngee Ann's Diploma in Real Estate Business and NUS's BBA (Real Estate) exist but no role in the field needs
     them, so nothing is listed and the coverage test may expect none. */

  /* Islamic religious studies (religious): no public school on the list offers an Islamic studies diploma or degree. NUS's Malay Studies is not Islamic
     studies, and no polytechnic or ITE course page names it. Nothing is listed, and the coverage test names `religious` as an exception.
     (Search snippets mention a planned MUIS-linked college; that was not confirmed from a page, so it is not relied on.) Today the asatizah route is overseas study (see serasi-overseas.js) plus MUIS's Asatizah Recognition Scheme. */

  const fmtYears = y => (y % 1 === .5 ? (Math.floor(y) || '') + '½' : String(y)) + (y === 1 ? ' year' : ' years');

  // Official school marks are served locally; provenance is recorded in assets/schools/sources.json.
  const SCHOOL_LOGOS = {
    'ITE': 'ite.png', 'Singapore Polytechnic': 'sp.png', 'Ngee Ann Polytechnic': 'np.png',
    'Nanyang Polytechnic': 'nyp.svg', 'Republic Polytechnic': 'rp.png', 'Temasek Polytechnic': 'tp.svg',
    'NUS': 'nus.png', 'NTU': 'ntu.png', 'SMU': 'smu.png', 'SUTD': 'sutd.png', 'SIT': 'sit.png',
    'SUSS': 'suss.webp', 'LASALLE': 'lasalle.svg', 'NAFA': 'nafa.svg',
    'University of the Arts Singapore': 'uas.svg', 'Duke-NUS': 'duke-nus.jpg', 'NIE': 'nie.png'
  };

  // The courses for a role at a level (1 = ITE, 2 = diploma, 3 = degree), in the order of SCHOOLS.
  function forRole(role, lvl, courses = COURSES) {
    const field = window.SerasiStudy.fieldOf(role);
    return courses
      .filter(c => c.lvl === lvl && c.fields.includes(field) && (!c.roles || c.roles.includes(role.id)))
      .map((c, i) => ({ c, i, s: SCHOOLS.indexOf(c.school) }))
      .sort((a, b) => a.s - b.s || a.i - b.i)
      .map(x => x.c);
  }

  // Lowest and highest yearly fee, and whether any is more than $300 from the generic fee the cost table uses. Null fees are ignored.
  function spread(courses, generic) {
    const fees = courses.map(c => c.fee).filter(f => f != null);
    if (!fees.length) return null;
    return { lo: Math.min(...fees), hi: Math.max(...fees), differs: fees.some(f => Math.abs(f - generic) > 300) };
  }

  // h = { esc, money }. Nothing at all when no school lists the course, so the page shows no empty heading.
  function html(role, lvl, h, courses = COURSES) {
    const list = forRole(role, lvl, courses);
    if (!list.length) return '';
    const { esc, money } = h;
    const items = list.map(c =>
      '<li><b class="s-n">' + esc(c.school) + '</b> <span class="s-c">' + esc(c.course) + '</span> ' +
      '<span class="s-m">' + esc(fmtYears(c.yrs)) + ' · ' + (c.fee == null ? 'fee on the school\'s page' : esc(money(c.fee)) + ' a year') +
        (c.note ? ' (' + esc(c.note) + ')' : '') + '</span>' +
      (c.mode ? ' <span class="pill">' + esc(c.mode) + '</span>' : '') +
      ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">course page ↗</a></li>').join('');
    return '<ul class="schools">' + items + '</ul>' +
      '<p class="small muted">SG Citizen fees after the Tuition Grant · 2026 references unless noted. Confirm your intake’s fees and entry requirements on the course page.</p>';
  }

  // Group relevant courses by institution so one school has one card and one logo.
  function schoolCards(role, lvl, h, courses = COURSES) {
    const list = forRole(role, lvl, courses);
    if (!list.length) return '';
    const { esc, money } = h;
    const schools = [...new Set(list.map(c => c.school))];
    const card = school => {
      const courses = list.filter(c => c.school === school);
      const logo = SCHOOL_LOGOS[school];
      const mark = logo ? '<span class="school-logo"><img src="assets/schools/' + logo + '" alt="" width="120" height="56" loading="lazy" decoding="async"></span>' : '';
      return '<li class="school-card"><div class="school-card-head">' + mark + '<div><h5>' + esc(school) + '</h5><span>' + courses.length + ' relevant course' + (courses.length === 1 ? '' : 's') + '</span></div></div>' +
        '<ul class="school-courses">' + courses.map(c => '<li><h6>' + esc(c.course) + '</h6>' +
          '<div class="school-course-meta"><span>' + esc(fmtYears(c.yrs)) + '</span><span>' + (c.fee == null ? 'Check fees with school' : esc(money(c.fee)) + ' / year') + '</span>' +
          (c.mode ? '<span class="pill">' + esc(c.mode) + '</span>' : '') + '</div>' +
          (c.note ? '<p class="school-course-note">' + esc(c.note) + '</p>' : '') +
          '<a class="school-course-link" href="' + esc(c.url) + '" target="_blank" rel="noopener" aria-label="' + esc('View ' + c.course + ' at ' + school) + '">View course <span aria-hidden="true">↗</span></a></li>').join('') + '</ul></li>';
    };
    return '<ul class="school-grid">' + schools.map(card).join('') + '</ul>';
  }

  window.SerasiLocal = { SCHOOLS, SCHOOL_LOGOS, COURSES, forRole, spread, html, schoolCards };
})();
