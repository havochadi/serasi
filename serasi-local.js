/* Serasi local study options: every publicly funded Singapore school that offers a course, and the section HTML for it.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   A course is { school, course, lvl: 1 | 2 | 3, yrs, fee: number | null, mode?: 'part-time' | 'work-study', fields, roles?, url, src? }.
   lvl 1 = ITE, 2 = diploma, 3 = degree. fee is the yearly fee in S$ for Singapore Citizens after the MOE Tuition Grant, or null when the
   school's page does not list one. fields are keys of SerasiStudy.FIELDS; roles, when present, limits the course to those role ids. */
(function () {
  'use strict';

  /* Fee pages for the courses below, checked in October 2026. Singapore Polytechnic's is 'fee-poly' in serasi-pathways.js. */
  Object.assign(window.SerasiPathways.SOURCES, {
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

  // Publicly funded institutions only, in the order they are listed.
  const SCHOOLS = [
    'ITE', 'Singapore Polytechnic', 'Ngee Ann Polytechnic', 'Nanyang Polytechnic', 'Republic Polytechnic', 'Temasek Polytechnic',
    'NUS', 'NTU', 'SMU', 'SUTD', 'SIT', 'SUSS', 'LASALLE', 'NAFA', 'University of the Arts Singapore', 'Duke-NUS', 'NIE'
  ];

  // The courses, field by field. Fees are for students starting in 2026.
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
    // the hospital insurance premium of $8.17 a term, so their year is 2 x ($283 + $8.17) = $582.34. The 2-year and 3-year courses share one rate.
    // Nursing at the polytechnics: Ngee Ann and Nanyang only (Ngee Ann charges $3,193.70 for nursing, $26.20 more than its other diplomas).
    { school: 'ITE', course: 'Higher Nitec in Nursing', lvl: 1, yrs: 2, fee: 582.34, fields: ['nursing'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-nursing/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Nursing (3 years)', lvl: 1, yrs: 3, fee: 582.34, fields: ['nursing'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-nursing-3-year/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Nursing', lvl: 2, yrs: 3, fee: 3193.7, fields: ['nursing'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-health-sciences/diploma-in-nursing', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Nursing', lvl: 2, yrs: 3, fee: 3188.09, fields: ['nursing'], url: 'https://www.nyp.edu.sg/student/study/schools/health-social-sciences/diploma-nursing', src: ['fee-nyp26'] },

    // Allied health. Nanyang's physiotherapy, occupational therapy and radiography diplomas are on the Allied Health Professions Council's list but are
    // no longer on Nanyang's school page, so only oral health therapy is listed. SIT's four-year degrees are 240 credits at $155 a credit for Singapore
    // Citizens (the intake of 31 August 2026): $37,200 over the course, or $9,300 a year. Each degree is tied to its own role.
    { school: 'Nanyang Polytechnic', course: 'Diploma in Oral Health Therapy', lvl: 2, yrs: 3, fee: 3188.09, fields: ['allied-health'], roles: ['oral-health'], url: 'https://www.nyp.edu.sg/student/study/schools/health-social-sciences/diploma-oral-health-therapy', src: ['fee-nyp26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Physiotherapy', lvl: 3, yrs: 4, fee: 9300, fields: ['allied-health'], roles: ['physio'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/physiotherapy', src: ['fee-sit26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Occupational Therapy', lvl: 3, yrs: 4, fee: 9300, fields: ['allied-health'], roles: ['ot'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/occupational-therapy', src: ['fee-sit26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Diagnostic Radiography', lvl: 3, yrs: 4, fee: 9300, fields: ['allied-health'], roles: ['radiographer'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/diagnostic-radiography', src: ['fee-sit26'] },
    { school: 'SIT', course: 'Bachelor of Science with Honours in Dietetics and Nutrition', lvl: 3, yrs: 4, fee: 9300, fields: ['allied-health'], roles: ['dietitian'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/dietetics-and-nutrition', src: ['fee-sit26'] },

    // Pharmacy. The Pharmaceutical Science diplomas also suit the pharmaceutical quality assurance officer (biomedical). Singapore Polytechnic has none.
    // NUS's Bachelor of Pharmacy (Honours) is its "Science (Pharmacy)" fee band.
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3167.5, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-life-sciences-chemical-technology/diploma-in-pharmaceutical-science', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3188.09, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa'], url: 'https://www.nyp.edu.sg/student/study/schools/applied-science/diploma-pharmaceutical-science', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3186.5, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-pharmaceutical-science/', src: ['fee-rp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Pharmaceutical Science', lvl: 2, yrs: 3, fee: 3183.15, fields: ['pharmacy', 'biomedical'], roles: ['pharm-tech', 'pharmacist', 'pharma-qa'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/asc/pharmaceutical-science.html', src: ['fee-tp26'] },
    { school: 'NUS', course: 'Bachelor of Pharmacy (Honours)', lvl: 3, yrs: 4, fee: 9200, fields: ['pharmacy'], roles: ['pharmacist'], url: 'https://pharmacy.nus.edu.sg/study/undergraduate/bachelor-of-pharmacy', src: ['fee-nus26'] },

    // Medicine. The MBBS places are the main route; Duke-NUS takes graduates of any field. NUS's "Medicine (except Nursing)" band is $33,200 and NTU's
    // medicine fee is $36,100 (AY2026/27). Duke-NUS's tuition page could not be read for the MD fee, so it is null. Both MBBS fees are for 2026/27 entrants.
    { school: 'NUS', course: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', lvl: 3, yrs: 5, fee: 33200, fields: ['medicine'], url: 'https://www.nus.edu.sg/nusbulletin/ay202627/programmes/yong-loo-lin-school-of-medicine-including-nursing/undergraduate-education/', src: ['fee-nus26'] },
    { school: 'NTU', course: 'Bachelor of Medicine and Bachelor of Surgery (MBBS)', lvl: 3, yrs: 5, fee: 36100, fields: ['medicine'], url: 'https://www.ntu.edu.sg/medicine/education/bachelor-of-medicine-and-bachelor-of-surgery-(mbbs)', src: ['fee-ntu'] },
    { school: 'Duke-NUS', course: 'Doctor of Medicine (MD), for graduates of any field', lvl: 3, yrs: 4, fee: null, fields: ['medicine'], url: 'https://www.duke-nus.edu.sg/admissions/tuition-scholarships' },

    // Biomedical and laboratory science. Temasek's Medical Biotechnology is left out: it is not a biomedical science or medical laboratory course by name.
    { school: 'Singapore Polytechnic', course: 'Diploma in Biomedical Science', lvl: 2, yrs: 3, fee: 3177.52, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa'], url: 'https://www.sp.edu.sg/courses/schools/cls/biomedical-science', src: ['fee-poly'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Biomedical Science', lvl: 2, yrs: 3, fee: 3167.5, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-life-sciences-chemical-technology/diploma-in-biomedical-science', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Biomedical Science with Analytics', lvl: 2, yrs: 3, fee: 3188.09, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa'], url: 'https://www.nyp.edu.sg/student/study/schools/applied-science/diploma-biomedical-science-analytics', src: ['fee-nyp26'] },
    { school: 'Republic Polytechnic', course: 'Diploma in Biomedical Science', lvl: 2, yrs: 3, fee: 3186.5, fields: ['biomedical'], roles: ['lab-tech', 'pharma-qa'], url: 'https://www.rp.edu.sg/education/diplomas/diploma-in-biomedical-science/', src: ['fee-rp26'] },

    // Veterinary care. Temasek is the only public school with a veterinary course.
    { school: 'Temasek Polytechnic', course: 'Diploma in Veterinary Technology', lvl: 2, yrs: 3, fee: 3183.15, fields: ['veterinary'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/asc/veterinary-technology.html', src: ['fee-tp26'] },

    // Early childhood. Ngee Ann's Tamil Studies with Early Education is left out: it is a language course first.
    { school: 'ITE', course: 'Higher Nitec in Early Childhood Education', lvl: 1, yrs: 2, fee: 566, fields: ['earlychild'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-early-childhood-education/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Early Childhood Development & Education', lvl: 2, yrs: 3, fee: 3167.5, fields: ['earlychild'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-humanities-interdisciplinary-studies/diploma-in-early-childhood-development-education', src: ['fee-np26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Early Childhood Development & Education', lvl: 2, yrs: 3, fee: 3183.15, fields: ['earlychild'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/hss/early-childhood-development-education.html', src: ['fee-tp26'] },

    // Social work and community care. ITE's course is the 3-year Higher Nitec. The degrees (social worker, counsellor) are not listed yet.
    { school: 'ITE', course: 'Higher Nitec in Community Care & Social Services (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['socialwork'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-community-care-and-social-services-3-year/', src: ['fee-ite26'] },
    { school: 'Ngee Ann Polytechnic', course: 'Diploma in Psychology & Community Development', lvl: 2, yrs: 3, fee: 3167.5, fields: ['socialwork'], roles: ['youth-worker'], url: 'https://www.np.edu.sg/schools-courses/academic-schools/school-of-humanities-interdisciplinary-studies/diploma-in-psychology-community-development', src: ['fee-np26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Social Work', lvl: 2, yrs: 3, fee: 3188.09, fields: ['socialwork'], roles: ['youth-worker'], url: 'https://www.nyp.edu.sg/student/study/schools/health-social-sciences/diploma-social-work', src: ['fee-nyp26'] },
    { school: 'Temasek Polytechnic', course: 'Diploma in Psychology Studies', lvl: 2, yrs: 3, fee: 3183.15, fields: ['socialwork'], roles: ['youth-worker'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/hss/psychology-studies.html', src: ['fee-tp26'] },

    // Interior design. Temasek's Interior Architecture & Design (listed under architecture above) also counts. ITE's Higher Nitec in Interior &
    // Product Design is at ITE College Central only, with a 2-year route (O-level or Nitec) and a 3-year route (N- or O-level). Nanyang's Experience
    // Design names interior designer among its careers and teaches spatial visualisation. Ngee Ann's Design (Architecture specialisation) and Nanyang's
    // Architecture are architecture courses first and are left on that field. LASALLE and NAFA publish fees for the August 2027 intake only.
    { school: 'ITE', course: 'Higher Nitec in Interior & Product Design', lvl: 1, yrs: 2, fee: 566, fields: ['interior-design'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-interior-and-product-design/', src: ['fee-ite26'] },
    { school: 'ITE', course: 'Higher Nitec in Interior & Product Design (3 years)', lvl: 1, yrs: 3, fee: 566, fields: ['interior-design'], url: 'https://www.ite.edu.sg/course-finder/higher-nitec-in-interior-and-product-design-3-year/', src: ['fee-ite26'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Experience Design', lvl: 2, yrs: 3, fee: 3188.09, fields: ['interior-design', 'graphic-ux'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-experience-design', src: ['fee-nyp26'] },
    { school: 'LASALLE', course: 'Diploma in Spatial Design', lvl: 2, yrs: 3, fee: 5490, fields: ['interior-design'], url: 'https://www.lasalle.edu.sg/study/programmes/diploma/spatial-design/', src: ['fee-lasalle27'] },
    { school: 'NAFA', course: 'Diploma in Design (Interior and Spatial)', lvl: 2, yrs: 3, fee: 4810, fields: ['interior-design'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-design-interior-and-spatial', src: ['fee-nafa27'] },

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
    { school: 'LASALLE', course: 'Diploma in Graphic Design and Experiences', lvl: 2, yrs: 3, fee: 5490, fields: ['graphic-ux'], url: 'https://www.lasalle.edu.sg/study/programmes/diploma/graphic-design-and-experiences/', src: ['fee-lasalle27'] },
    { school: 'NAFA', course: 'Diploma in Design Communication and Strategy', lvl: 2, yrs: 3, fee: 4810, fields: ['graphic-ux'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-design-communication-and-strategy', src: ['fee-nafa27'] },

    // Fashion design. Only Temasek (Year 2: choose Fashion Design or Fashion Management) and NAFA (choose Fashion Design, Business or Textiles when applying)
    // teach it at diploma level; NAFA's fee is its "Fashion Studies" band, $450 above its design band because it includes the graduation show.
    // ITE has no fashion design course (its Visual Merchandising is a retail display course). LASALLE's Diploma in Creative Direction for Fashion is left
    // out: its own page says it is not a fashion design programme (garment design is its BA (Hons) Fashion Design and Textiles, a degree).
    { school: 'Temasek Polytechnic', course: 'Diploma in Fashion Management & Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['fashion'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/fashion-management-and-design.html', src: ['fee-tp26'] },
    { school: 'NAFA', course: 'Diploma in Fashion', lvl: 2, yrs: 3, fee: 5260, fields: ['fashion'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-fashion', src: ['fee-nafa27'] },

    // Animation. ITE's Communication Design (listed under graphic and UX design above) has an Animation & Motion Graphics specialisation. Singapore
    // Polytechnic's specialisation is Animation & Games. Nanyang's diploma covers 2D and 3D animation and visual effects. NAFA's Digital Illustration
    // and Narrative teaches frame-by-frame animation, cel animation and stop motion. Republic's Design (Games & Gamification major) is a games course,
    // and Temasek's Communication Design teaches motion graphics only, so both are left out. LASALLE's BA (Hons) Animation Art is a degree and no
    // animation role needs one.
    { school: 'Singapore Polytechnic', course: 'Diploma in Media, Arts & Design (Animation & Games)', lvl: 2, yrs: 3, fee: 3177.52, fields: ['animation'], url: 'https://www.sp.edu.sg/courses/schools/mad/animation-and-games', src: ['fee-poly'] },
    { school: 'Nanyang Polytechnic', course: 'Diploma in Animation, Games & Visual Effects', lvl: 2, yrs: 3, fee: 3188.09, fields: ['animation'], url: 'https://www.nyp.edu.sg/student/study/schools/design-media/diploma-animation-games-visual-effects', src: ['fee-nyp26'] },
    { school: 'NAFA', course: 'Diploma in Digital Illustration and Narrative', lvl: 2, yrs: 3, fee: 4810, fields: ['animation'], url: 'https://www.nafa.edu.sg/programmes/diploma-in-digital-illustration-and-narrative', src: ['fee-nafa27'] },
  ];

  const fmtYears = y => (y % 1 === .5 ? (Math.floor(y) || '') + '½' : String(y)) + (y === 1 ? ' year' : ' years');

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
      '<span class="s-m">' + esc(fmtYears(c.yrs)) + ' · ' + (c.fee == null ? 'fee on the school\'s page' : esc(money(c.fee)) + ' a year') + '</span>' +
      (c.mode ? ' <span class="pill">' + esc(c.mode) + '</span>' : '') +
      ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">course page ↗</a></li>').join('');
    return '<ul class="schools">' + items + '</ul>' +
      '<p class="small muted">Yearly fees are for Singapore Citizens after the MOE Tuition Grant, from each school\'s fee page in October 2026 (sources under the price breakdown). The links go to the course pages.</p>';
  }

  window.SerasiLocal = { SCHOOLS, COURSES, forRole, spread, html };
})();
