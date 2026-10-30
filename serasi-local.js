/* Serasi local study options: every publicly funded Singapore school that offers a course, and the section HTML for it.
   Load it after serasi-core.js, serasi-pathways.js and serasi-study.js.
   A course is { school, course, lvl: 1 | 2 | 3, yrs, fee: number | null, mode?: 'part-time' | 'work-study', note?, fields, roles?, url, src? }.
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
    { school: 'SIT', course: 'Degree in Accountancy', lvl: 3, yrs: 3, fee: null, note: 'SIT charges by the credit; its degree pages could not be read when we checked in October 2026', fields: ['accounting'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/business-and-management-degrees' },
    { school: 'SUSS', course: 'Bachelor of Accountancy', lvl: 3, yrs: 4, fee: null, note: 'SUSS’s fee page could not be read when we checked in October 2026', fields: ['accounting'], url: 'https://www.suss.edu.sg/programmes/detail/ft-bachelor-of-accountancy' }
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
    { school: 'SIT', course: 'Degree in Digital Supply Chain', lvl: 3, yrs: 3, fee: null, note: 'SIT charges by the credit; its degree pages could not be read when we checked in October 2026', fields: ['logistics'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/business-and-management-degrees' },
    { school: 'SUSS', course: 'Bachelor of Science in Supply Chain Management', lvl: 3, yrs: 4, fee: null, note: 'SUSS’s fee page could not be read when we checked in October 2026', fields: ['logistics'], url: 'https://www.moe.gov.sg/coursefinder/coursedetail/ftscmmj1-bachelor-of-science-in-supply-chain-management' }
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
    { school: 'SIT', course: 'Degree in Hospitality and Tourism Management', lvl: 3, yrs: 3, fee: null, note: 'SIT charges by the credit; its degree pages could not be read when we checked in October 2026', fields: ['hospitality'], url: 'https://www.singaporetech.edu.sg/undergraduate-programmes/business-and-management-degrees' }
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
      (c.note ? ' <span class="s-m">' + esc(c.note) + '</span>' : '') +
      ' <a href="' + esc(c.url) + '" target="_blank" rel="noopener">course page ↗</a></li>').join('');
    return '<ul class="schools">' + items + '</ul>' +
      '<p class="small muted">Yearly fees are for Singapore Citizens after the MOE Tuition Grant, from each school\'s fee page in October 2026 (sources under the price breakdown). The links go to the course pages.</p>';
  }

  window.SerasiLocal = { SCHOOLS, COURSES, forRole, spread, html };
})();
