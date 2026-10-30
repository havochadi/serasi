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
    'fee-sit26': ['SIT, undergraduate tuition fees for AY2026 (each degree page gives its fee per credit)', 'https://www.singaporetech.edu.sg/admissions/tuition-fees']
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
    { school: 'Temasek Polytechnic', course: 'Diploma in Interior Architecture & Design', lvl: 2, yrs: 3, fee: 3183.15, fields: ['architecture'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/des/interior-architecture-design.html', src: ['fee-tp26'] },
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
    { school: 'Temasek Polytechnic', course: 'Diploma in Psychology Studies', lvl: 2, yrs: 3, fee: 3183.15, fields: ['socialwork'], roles: ['youth-worker'], url: 'https://www.tp.edu.sg/schools-and-courses/students/schools/hss/psychology-studies.html', src: ['fee-tp26'] }
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
    { school: 'SIT', course: 'Bachelor of Science with Honours in Applied Artificial Intelligence', lvl: 3, yrs: 3, fee: null, fields: ['data-ai'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/applied-artificial-intelligence' },

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
