/* Serasi shared core: reference data, scoring and the shared-results store.
   Loaded by youth.html (the youth app) and mendaki.html (the MENDAKI staff page).
   A classic script with no build step, so both pages still work when opened from disk. */
(function () {
  'use strict';

  /* ---------- Reference data ---------- */
  const TYPES = ['R', 'I', 'A', 'S', 'E', 'C'];
  const TYPE_INFO = {
    R: { name: 'Realistic', profile: 'Builder', blurb: 'Hands-on and practical; likes visible results.' },
    I: { name: 'Investigative', profile: 'Analyst', blurb: 'Curious and logical; enjoys hard problems.' },
    A: { name: 'Artistic', profile: 'Creator', blurb: 'Expressive and original; needs room to make things.' },
    S: { name: 'Social', profile: 'Carer', blurb: 'Warm and supportive; energised by helping others grow.' },
    E: { name: 'Enterprising', profile: 'Persuader', blurb: 'Driven and outgoing; likes to lead and win people over.' },
    C: { name: 'Conventional', profile: 'Organiser', blurb: 'Precise and dependable; likes clear systems.' }
  };
  const TRAITS = [
    { k: 'O', name: 'Curiosity', low: 'Proven methods', high: 'New problems', need: 'new, unsolved problems' },
    { k: 'C', name: 'Structure', low: 'Open-ended work', high: 'Set processes', need: 'process-heavy work' },
    { k: 'E', name: 'People energy', low: 'Deep focus', high: 'People-facing', need: 'people-facing work' },
    { k: 'A', name: 'Collaboration', low: 'Independent', high: 'Team-first', need: 'close teamwork' },
    { k: 'S', name: 'Steadiness', low: 'Calmer settings', high: 'Handles pressure', need: 'pressure and pace' },
    { k: 'H', name: 'Integrity', low: 'Pragmatic', high: 'Principled', need: 'trust and sensitive information' }
  ];
  const TRAIT = Object.fromEntries(TRAITS.map(t => [t.k, t]));
  const VALUES = [
    { k: 'stability', label: 'Financial stability to support my family', short: 'financial stability', pct: 68 },
    { k: 'balance', label: 'Good work–life balance', short: 'work–life balance', pct: 67 },
    { k: 'learning', label: 'Continuous learning and growth', short: 'room to learn', pct: 56 },
    { k: 'security', label: 'Job security', short: 'job security', pct: 53 },
    { k: 'aligned', label: 'Work that fits my values and beliefs', short: 'values-aligned work', pct: 45 },
    { k: 'helping', label: 'Helping people directly', short: 'helping people directly' },
    { k: 'freedom', label: 'Freedom in how I work', short: 'freedom in how you work' },
    { k: 'creating', label: 'Making or building things', short: 'making things' }
  ];
  const VALUE = Object.fromEntries(VALUES.map(v => [v.k, v]));
  const FAITH = [
    { k: 'pray', label: 'Time and space to pray during work', kind: 'ask', ask: 'Is there a quiet space and time to pray during the workday?' },
    { k: 'friday', label: 'Able to attend Friday prayers', kind: 'ask', ask: 'Can I take a longer lunch break for Friday prayers?' },
    { k: 'halal', label: 'Halal food options at work', kind: 'ask', ask: 'Are halal food options available at work and at team events?' },
    { k: 'tudung', label: 'Able to wear the tudung at work', kind: 'ask', ask: 'Does the dress code or uniform allow the tudung?' },
    { k: 'riba', label: 'Avoid roles built on interest (riba)', kind: 'filter' },
    { k: 'alcohol', label: 'Avoid roles serving alcohol or in gambling', kind: 'filter' }
  ];
  const FAITH_ITEM = Object.fromEntries(FAITH.map(f => [f.k, f]));
  const SKILLS = [
    { k: 'num', label: 'Numbers and data' },
    { k: 'comm', label: 'Writing and speaking' },
    { k: 'people', label: 'Working with people' },
    { k: 'tech', label: 'Digital and tech' },
    { k: 'hands', label: 'Hands-on and technical' },
    { k: 'create', label: 'Creative and design' }
  ];
  const SKILL = Object.fromEntries(SKILLS.map(s => [s.k, s]));
  const PATHWAYS = [
    { k: 'ITE', label: 'ITE (Nitec or Higher Nitec)', rank: 1, name: 'ITE' },
    { k: 'Poly', label: 'Polytechnic diploma', rank: 2, name: 'polytechnic' },
    { k: 'Uni', label: 'University degree', rank: 3, name: 'university' },
    { k: 'Work', label: 'Already working', rank: 3, name: 'working' }
  ];
  const PATH = Object.fromEntries(PATHWAYS.map(p => [p.k, p]));
  const EDU_LABEL = { 1: 'Nitec or Higher Nitec', 2: 'a diploma', 3: 'a degree' };

  /* Interest activities: 30 items, 5 per Holland type, written for Serasi (not the official O*NET Mini-IP text). */
  const INTEREST_ITEMS = [
    { id: 'i1', t: 'I', text: 'Finding the pattern in a messy dataset' },
    { id: 'i2', t: 'E', text: 'Pitching an idea to win a new client' },
    { id: 'i3', t: 'R', text: 'Fixing a machine that has stopped working' },
    { id: 'i4', t: 'S', text: 'Coaching a junior through a hard topic' },
    { id: 'i5', t: 'C', text: 'Keeping a budget accurate to the cent' },
    { id: 'i6', t: 'A', text: 'Designing how an app screen looks' },
    { id: 'i7', t: 'R', text: 'Building or assembling something with tools' },
    { id: 'i8', t: 'A', text: 'Writing, filming or editing a short video' },
    { id: 'i9', t: 'I', text: 'Working out why an experiment gave a strange result' },
    { id: 'i10', t: 'C', text: 'Setting up a clear system for files and records' },
    { id: 'i11', t: 'S', text: 'Helping someone through a difficult day' },
    { id: 'i12', t: 'E', text: 'Leading a team to hit a target' },
    { id: 'i13', t: 'R', text: 'Repairing wiring or electrical appliances' },
    { id: 'i14', t: 'I', text: 'Studying how the human body or diseases work' },
    { id: 'i15', t: 'A', text: 'Drawing, painting or making digital art' },
    { id: 'i16', t: 'S', text: 'Caring for patients or older people' },
    { id: 'i17', t: 'E', text: 'Starting your own small business' },
    { id: 'i18', t: 'C', text: 'Checking documents carefully for errors' },
    { id: 'i19', t: 'I', text: 'Writing code to solve a tricky problem' },
    { id: 'i20', t: 'R', text: 'Working outdoors on a building or landscaping project' },
    { id: 'i21', t: 'S', text: 'Volunteering at a community programme' },
    { id: 'i22', t: 'C', text: 'Tracking stock, orders or schedules in a spreadsheet' },
    { id: 'i23', t: 'A', text: 'Writing stories, scripts or song lyrics' },
    { id: 'i24', t: 'E', text: 'Negotiating a deal or a better price' },
    { id: 'i25', t: 'I', text: 'Researching a question until you fully understand it' },
    { id: 'i26', t: 'R', text: 'Operating machinery or vehicles' },
    { id: 'i27', t: 'A', text: 'Planning the look and feel of an event or space' },
    { id: 'i28', t: 'S', text: 'Teaching a group of children or teens' },
    { id: 'i29', t: 'C', text: 'Following a set procedure to process applications' },
    { id: 'i30', t: 'E', text: 'Persuading people to sign up for something' }
  ];
  /* Work style: the 20 public-domain Mini-IPIP items (Donnellan et al., 2006), lightly reworded to start with "I",
     plus 4 honesty items written for Serasi. Steadiness (S) is the reverse of the Mini-IPIP neuroticism scale. */
  const PERS_ITEMS = [
    { id: 'p1', t: 'E', rev: false, text: 'I am the life of the party.' },
    { id: 'p2', t: 'A', rev: false, text: 'I sympathise with others’ feelings.' },
    { id: 'p3', t: 'C', rev: false, text: 'I get chores done right away.' },
    { id: 'p4', t: 'S', rev: true, text: 'I have frequent mood swings.' },
    { id: 'p5', t: 'O', rev: false, text: 'I have a vivid imagination.' },
    { id: 'p6', t: 'H', rev: false, text: 'I wouldn’t bend the rules to get ahead, even if no one would know.' },
    { id: 'p7', t: 'E', rev: true, text: 'I don’t talk a lot.' },
    { id: 'p8', t: 'A', rev: true, text: 'I am not interested in other people’s problems.' },
    { id: 'p9', t: 'C', rev: true, text: 'I often forget to put things back in their proper place.' },
    { id: 'p10', t: 'S', rev: false, text: 'I am relaxed most of the time.' },
    { id: 'p11', t: 'O', rev: true, text: 'I am not interested in abstract ideas.' },
    { id: 'p12', t: 'H', rev: true, text: 'I’d flatter someone if it helped me get what I want.' },
    { id: 'p13', t: 'E', rev: false, text: 'I talk to a lot of different people at parties.' },
    { id: 'p14', t: 'A', rev: false, text: 'I feel others’ emotions.' },
    { id: 'p15', t: 'C', rev: false, text: 'I like order.' },
    { id: 'p16', t: 'S', rev: true, text: 'I get upset easily.' },
    { id: 'p17', t: 'O', rev: true, text: 'I have difficulty understanding abstract ideas.' },
    { id: 'p18', t: 'H', rev: false, text: 'I’d return extra change a cashier gave me by mistake.' },
    { id: 'p19', t: 'E', rev: true, text: 'I keep in the background.' },
    { id: 'p20', t: 'A', rev: true, text: 'I am not really interested in others.' },
    { id: 'p21', t: 'C', rev: true, text: 'I make a mess of things.' },
    { id: 'p22', t: 'S', rev: false, text: 'I seldom feel blue.' },
    { id: 'p23', t: 'O', rev: true, text: 'I do not have a good imagination.' },
    { id: 'p24', t: 'H', rev: true, text: 'Having expensive things matters a lot to me.' }
  ];
  const SCENARIOS = [
    { id: 's1', text: 'A colleague is ill, and your boss asks you to present to a client tomorrow.', options: [
      { k: 'A', text: 'Accept and prepare late into the night', adj: { C: .06, S: .04 } },
      { k: 'B', text: 'Ask to co-present with someone who knows the client', adj: { A: .06 } },
      { k: 'C', text: 'Suggest postponing the meeting', adj: { S: -.05 } },
      { k: 'D', text: 'Accept and reuse the existing slides', adj: { E: .04, C: -.04 } }
    ] },
    { id: 's2', text: 'Your team lead asks for ideas to speed up a slow weekly report.', options: [
      { k: 'A', text: 'Build a small automation and test it', adj: { O: .06, C: .02 } },
      { k: 'B', text: 'Ask teammates what slows them down first', adj: { A: .05, E: .03 } },
      { k: 'C', text: 'Write down the current steps, then trim them', adj: { C: .06 } },
      { k: 'D', text: 'Pitch a new tool to the manager', adj: { E: .06 } }
    ] },
    { id: 's3', text: 'Just before a report goes out, you notice a teammate’s figures don’t add up.', options: [
      { k: 'A', text: 'Tell them privately and help fix it', adj: { H: .05, A: .04 } },
      { k: 'B', text: 'Fix it quietly yourself', adj: { C: .04 } },
      { k: 'C', text: 'Flag it to the team lead', adj: { H: .06 } },
      { k: 'D', text: 'Let it go; it isn’t your section', adj: { H: -.06 } }
    ] }
  ];

  /* Portals. Link formats checked for MyCareersFuture, Jobstreet and Careers@Gov; FastJobs search needs a form post, so it opens the browse page. */
  const PORTALS = {
    mcf: { name: 'MyCareersFuture', why: 'National jobs portal; ads show a salary range', url: q => 'https://www.mycareersfuture.gov.sg/search?search=' + encodeURIComponent(q) + '&sortBy=relevancy&page=0' },
    jobstreet: { name: 'Jobstreet', why: 'Can attach verified Careers & Skills Passport records', url: q => 'https://sg.jobstreet.com/' + slug(q) + '-jobs' },
    linkedin: { name: 'LinkedIn', why: 'Entry-level and intern roles, plus alumni to reach out to', url: q => 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(q) + '&location=Singapore&f_E=1%2C2' },
    fastjobs: { name: 'FastJobs', why: 'Non-executive roles with quick mobile applications', url: () => 'https://www.fastjobs.sg/singapore-jobs/all-categories-jobs/', manual: true },
    glints: { name: 'Glints', why: 'Start-up and internship listings', url: q => 'https://glints.com/sg/opportunities/jobs/explore?keyword=' + encodeURIComponent(q) + '&country=SG' },
    careersgov: { name: 'Careers@Gov', why: 'Public service jobs', url: q => 'https://jobs.careers.gov.sg/?s=' + encodeURIComponent(q) }
  };
  const SF_URL = s => 'https://www.skillsfuture.gov.sg/skills-framework/' + s;
  const LINKS = {
    e2i: 'https://www.e2i.com.sg/',
    m3: 'https://www.m3plus.gov.sg/focus-areas/employment-and-employability/',
    grit: 'https://www.wsg.gov.sg/home/individuals/attachment-placement-programmes/graduate-industry-traineeships',
    gritGov: 'https://jobs.careers.gov.sg/?s=grit%40gov'
  };

  /* Roles: hand-coded for illustration. The full build would take interest and work-style profiles from O*NET, linked to SSOC and the Skills Framework. */
  const ROLES = [
    { id: 'eng-tech', title: 'Engineering technician', sector: 'Manufacturing', code: 'RIC', ws: { C: .7, S: .6 }, values: ['security', 'stability', 'creating'], skills: { hands: 4, tech: 3 }, edu: 1, q: 'engineering technician', portals: ['mcf', 'jobstreet', 'fastjobs'] },
    { id: 'aircraft-tech', title: 'Aircraft maintenance technician', sector: 'Aerospace', code: 'RCI', ws: { C: .85, S: .7, H: .7 }, values: ['security', 'learning', 'creating'], skills: { hands: 4, tech: 3 }, edu: 1, q: 'aircraft technician', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'facilities-tech', title: 'Building facilities technician', sector: 'Built environment', code: 'RCE', ws: { C: .6, S: .6, A: .5 }, values: ['security', 'stability', 'balance'], skills: { hands: 4 }, edu: 1, q: 'facilities technician', portals: ['mcf', 'fastjobs', 'jobstreet'], sf: 'built-environment' },
    { id: 'lab-tech', title: 'Medical laboratory technologist', sector: 'Healthcare', code: 'IRC', ws: { C: .8, O: .6 }, values: ['helping', 'security', 'learning'], skills: { num: 3, hands: 3, tech: 3 }, edu: 2, q: 'medical laboratory technologist', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'data-analyst', title: 'Data analyst', sector: 'Infocomm and finance', code: 'ICE', ws: { O: .7, C: .7 }, values: ['learning', 'stability', 'freedom'], skills: { num: 4, tech: 3 }, edu: 2, q: 'data analyst', portals: ['mcf', 'linkedin', 'jobstreet', 'glints'], sf: 'ict' },
    { id: 'software-eng', title: 'Software engineer', sector: 'Infocomm', code: 'IRC', ws: { O: .7, C: .6, S: .5 }, values: ['learning', 'creating', 'freedom'], skills: { tech: 4, num: 3 }, edu: 2, q: 'software engineer', portals: ['mcf', 'linkedin', 'glints', 'jobstreet'], sf: 'ict' },
    { id: 'backend-eng', title: 'Back-end engineer', sector: 'Infocomm', code: 'ICR', ws: { C: .75, E: .3, O: .6 }, values: ['learning', 'security', 'creating'], skills: { tech: 4, num: 3 }, edu: 2, q: 'backend engineer', portals: ['mcf', 'linkedin', 'glints'], sf: 'ict' },
    { id: 'cyber', title: 'Cybersecurity analyst', sector: 'Infocomm', code: 'ICR', ws: { C: .75, H: .85, S: .7 }, values: ['security', 'learning', 'aligned'], skills: { tech: 4 }, edu: 2, q: 'cybersecurity analyst', portals: ['mcf', 'linkedin', 'careersgov', 'jobstreet'], sf: 'ict' },
    { id: 'product-analyst', title: 'Product analyst', sector: 'Tech start-ups', code: 'IEC', ws: { E: .65, O: .75, A: .6 }, values: ['learning', 'freedom', 'creating'], skills: { num: 3, comm: 3, tech: 3 }, edu: 3, q: 'product analyst', portals: ['mcf', 'linkedin', 'glints'] },
    { id: 'data-consultant', title: 'Data consultant', sector: 'Professional services', code: 'IEC', ws: { E: .75, O: .7, S: .6 }, values: ['learning', 'stability'], skills: { num: 4, comm: 4, people: 3 }, edu: 3, q: 'data consultant', portals: ['mcf', 'linkedin', 'jobstreet'] },
    { id: 'risk-analyst', title: 'Risk analyst (conventional bank)', sector: 'Finance', code: 'CIE', ws: { C: .8, S: .6, H: .75 }, values: ['stability', 'security', 'learning'], skills: { num: 4, comm: 3 }, edu: 3, q: 'risk analyst', portals: ['mcf', 'linkedin', 'jobstreet'], flags: ['riba'], alt: ['islamic-banking', 'takaful'] },
    { id: 'bank-ops', title: 'Bank operations executive', sector: 'Finance', code: 'CEI', ws: { C: .8, H: .8, S: .6 }, values: ['stability', 'security'], skills: { num: 3, comm: 3 }, edu: 2, q: 'bank operations executive', portals: ['mcf', 'jobstreet', 'linkedin'], flags: ['riba'], alt: ['islamic-banking', 'takaful'] },
    { id: 'islamic-banking', title: 'Islamic banking officer', sector: 'Finance', code: 'CEI', ws: { C: .75, H: .8, A: .55 }, values: ['stability', 'aligned', 'security'], skills: { num: 3, comm: 3 }, edu: 2, q: 'islamic banking', portals: ['mcf', 'linkedin', 'jobstreet'] },
    { id: 'takaful', title: 'Takaful executive', sector: 'Insurance', code: 'ECS', ws: { E: .6, A: .6, H: .8 }, values: ['aligned', 'stability', 'helping'], skills: { people: 3, num: 3, comm: 3 }, edu: 2, q: 'takaful', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'accounts-exec', title: 'Accounts executive', sector: 'Finance', code: 'CEI', ws: { C: .85, H: .8, S: .6 }, values: ['stability', 'security'], skills: { num: 4 }, edu: 2, q: 'accounts executive', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'ops-exec', title: 'Operations executive', sector: 'Logistics and services', code: 'CER', ws: { C: .75, A: .6, S: .65 }, values: ['stability', 'security', 'balance'], skills: { num: 3, people: 3, comm: 3 }, edu: 2, q: 'operations executive', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'compliance', title: 'Compliance officer', sector: 'Finance and regulation', code: 'CEI', ws: { C: .8, H: .9 }, values: ['security', 'aligned', 'stability'], skills: { comm: 3, num: 3 }, edu: 3, q: 'compliance officer', portals: ['mcf', 'linkedin', 'jobstreet'] },
    { id: 'logistics', title: 'Logistics coordinator', sector: 'Logistics', code: 'CRE', ws: { C: .7, S: .65, A: .55 }, values: ['stability', 'security'], skills: { num: 3, people: 3 }, edu: 1, q: 'logistics coordinator', portals: ['mcf', 'jobstreet', 'fastjobs'] },
    { id: 'pharm-tech', title: 'Pharmacy technician', sector: 'Healthcare', code: 'CRS', ws: { C: .8, H: .8, A: .6 }, values: ['helping', 'security', 'stability'], skills: { num: 3, people: 3 }, edu: 2, q: 'pharmacy technician', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'ux', title: 'UX/UI designer', sector: 'Design and infocomm', code: 'AIE', ws: { O: .85, A: .6, E: .5 }, values: ['creating', 'freedom', 'learning'], skills: { create: 4, tech: 3, comm: 3 }, edu: 2, q: 'ux designer', portals: ['mcf', 'glints', 'linkedin'], sf: 'design' },
    { id: 'content', title: 'Content producer', sector: 'Media', code: 'AES', ws: { O: .8, E: .65 }, values: ['creating', 'freedom'], skills: { create: 4, comm: 4 }, edu: 2, q: 'content producer', portals: ['mcf', 'glints', 'linkedin'] },
    { id: 'graphic', title: 'Graphic designer', sector: 'Design', code: 'AER', ws: { O: .8, C: .5 }, values: ['creating', 'freedom'], skills: { create: 4, tech: 3 }, edu: 2, q: 'graphic designer', portals: ['mcf', 'glints', 'jobstreet'], sf: 'design' },
    { id: 'arch', title: 'Architectural designer', sector: 'Built environment', code: 'AIR', ws: { O: .75, C: .65 }, values: ['creating', 'learning'], skills: { create: 4, num: 3, tech: 3 }, edu: 3, q: 'architectural designer', portals: ['mcf', 'jobstreet', 'linkedin'], sf: 'built-environment' },
    { id: 'video', title: 'Video editor', sector: 'Media', code: 'ARE', ws: { O: .75, C: .6, E: .35 }, values: ['creating', 'freedom'], skills: { create: 4, tech: 3 }, edu: 1, q: 'video editor', portals: ['mcf', 'glints', 'jobstreet'] },
    { id: 'events', title: 'Events executive', sector: 'Hospitality and events', code: 'EAS', ws: { E: .8, C: .6, S: .65 }, values: ['creating', 'learning', 'freedom'], skills: { people: 4, comm: 3, create: 3 }, edu: 2, q: 'events executive', portals: ['mcf', 'jobstreet', 'glints'] },
    { id: 'nurse', title: 'Registered nurse', sector: 'Healthcare', code: 'SIR', ws: { A: .8, S: .75, C: .7, H: .75 }, values: ['helping', 'security', 'stability'], skills: { people: 4, hands: 3 }, edu: 2, q: 'staff nurse', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'physio', title: 'Physiotherapist', sector: 'Healthcare', code: 'SIR', ws: { A: .75, E: .6, S: .65 }, values: ['helping', 'learning', 'security'], skills: { people: 4, hands: 3 }, edu: 3, q: 'physiotherapist', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'teacher', title: 'Teacher (MOE)', sector: 'Education', code: 'SAE', ws: { E: .7, A: .75, S: .7, C: .6 }, values: ['helping', 'aligned', 'security'], skills: { people: 4, comm: 4 }, edu: 3, q: 'teacher', portals: ['mcf', 'careersgov'] },
    { id: 'preschool', title: 'Preschool educator', sector: 'Early childhood', code: 'SAE', ws: { A: .85, E: .6, S: .7 }, values: ['helping', 'aligned', 'balance'], skills: { people: 4, create: 3 }, edu: 1, q: 'preschool teacher', portals: ['mcf', 'jobstreet', 'fastjobs'], sf: 'earlychildhood' },
    { id: 'social-worker', title: 'Social worker', sector: 'Social service', code: 'SEA', ws: { A: .85, S: .75, H: .8 }, values: ['helping', 'aligned'], skills: { people: 4, comm: 4 }, edu: 3, q: 'social worker', portals: ['mcf', 'careersgov', 'linkedin'], sf: 'social-service' },
    { id: 'youth-worker', title: 'Youth worker', sector: 'Social service', code: 'SEA', ws: { E: .75, A: .8, O: .6 }, values: ['helping', 'aligned', 'freedom'], skills: { people: 4, comm: 3 }, edu: 2, q: 'youth worker', portals: ['mcf', 'linkedin', 'jobstreet'], sf: 'social-service' },
    { id: 'hr', title: 'HR executive', sector: 'Professional services', code: 'ESC', ws: { A: .7, C: .65, H: .8 }, values: ['helping', 'stability', 'balance'], skills: { people: 4, comm: 3 }, edu: 2, q: 'hr executive', portals: ['mcf', 'jobstreet', 'linkedin'] },
    { id: 'bizdev', title: 'Business development executive', sector: 'Cross-industry', code: 'ECS', ws: { E: .85, S: .65, O: .6 }, values: ['stability', 'freedom', 'learning'], skills: { people: 4, comm: 4 }, edu: 2, q: 'business development executive', portals: ['mcf', 'linkedin', 'jobstreet'] },
    { id: 'marketing', title: 'Marketing executive', sector: 'Cross-industry', code: 'EAC', ws: { E: .7, O: .75 }, values: ['creating', 'learning', 'freedom'], skills: { comm: 4, create: 3 }, edu: 2, q: 'marketing executive', portals: ['mcf', 'linkedin', 'glints'] },
    { id: 'sales', title: 'Sales executive', sector: 'Retail and trade', code: 'ECS', ws: { E: .85, S: .7 }, values: ['stability', 'freedom'], skills: { people: 4, comm: 3 }, edu: 1, q: 'sales executive', portals: ['mcf', 'jobstreet', 'fastjobs'] },
    { id: 'fnb', title: 'Restaurant supervisor', sector: 'Food services', code: 'ECR', ws: { E: .7, S: .75, C: .6 }, values: ['stability', 'security'], skills: { people: 4, hands: 3 }, edu: 1, q: 'restaurant supervisor', portals: ['mcf', 'fastjobs', 'jobstreet'], flags: ['alcohol'] },
    { id: 'enrolled-nurse', title: 'Enrolled nurse', sector: 'Healthcare', code: 'SRC', ws: { A: .8, S: .7, C: .7 }, values: ['helping', 'security', 'stability'], skills: { people: 4, hands: 3 }, edu: 1, q: 'enrolled nurse', portals: ['mcf', 'jobstreet', 'fastjobs'] },
    { id: 'customer-service', title: 'Customer service officer', sector: 'Cross-industry', code: 'SEC', ws: { E: .7, A: .7, S: .7 }, values: ['stability', 'balance', 'helping'], skills: { people: 4, comm: 3 }, edu: 1, q: 'customer service officer', portals: ['mcf', 'jobstreet', 'fastjobs'] },
    { id: 'community-care', title: 'Community care associate', sector: 'Social service', code: 'SAR', ws: { A: .85, E: .6, S: .65 }, values: ['helping', 'aligned', 'balance'], skills: { people: 4 }, edu: 1, q: 'community care associate', portals: ['mcf', 'jobstreet', 'fastjobs'], sf: 'social-service' },
    { id: 'multimedia', title: 'Multimedia designer (junior)', sector: 'Media and design', code: 'AER', ws: { O: .75, C: .55 }, values: ['creating', 'freedom', 'learning'], skills: { create: 4, tech: 3 }, edu: 1, q: 'multimedia designer', portals: ['mcf', 'glints', 'jobstreet'] },
    { id: 'retail', title: 'Retail store supervisor', sector: 'Retail', code: 'ECS', ws: { E: .75, C: .6, S: .7 }, values: ['stability', 'security'], skills: { people: 4, num: 2 }, edu: 1, q: 'retail supervisor', portals: ['mcf', 'fastjobs', 'jobstreet'], sf: 'retail' },
    { id: 'public-officer', title: 'Public service officer (management support)', sector: 'Public sector', code: 'CES', ws: { C: .75, H: .85, A: .6 }, values: ['security', 'balance', 'aligned'], skills: { comm: 3, num: 3 }, edu: 2, q: 'management support officer', portals: ['mcf', 'careersgov'] },
    { id: 'policy', title: 'Policy executive (public service)', sector: 'Public sector', code: 'EIS', ws: { O: .7, C: .65, H: .85 }, values: ['aligned', 'learning', 'security'], skills: { comm: 4, num: 3 }, edu: 3, q: 'policy executive', portals: ['mcf', 'careersgov', 'linkedin'] }
  ];
  const ROLE = Object.fromEntries(ROLES.map(r => [r.id, r]));


  const ICONS = {"compass": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m16 8-2.5 5.5L8 16l2.5-5.5Z\"/>", "spark": "<path d=\"m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z\"/>", "grid": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"3\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/><rect x=\"14\" y=\"14\" width=\"7\" height=\"7\" rx=\"1.5\"/>", "quiz": "<rect x=\"5\" y=\"4\" width=\"14\" height=\"17\" rx=\"2\"/><path d=\"M9 3h6v4H9zM9 12h6m-6 4h4\"/>", "chat": "<path d=\"M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2 2-6A8.5 8.5 0 1 1 21 11.5Z\"/><path d=\"M8 11h.01M12 11h.01M16 11h.01\"/>", "chart": "<path d=\"M4 3v17h17M8 16v-5m5 5V6m5 10V9\"/>", "shield": "<path d=\"m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z\"/><path d=\"m8 12 3 3 5-6\"/>", "arrow": "<path d=\"M4 12h15m-6-6 6 6-6 6\"/>", "clock": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>", "bookmark": "<path d=\"M6 4h12v17l-6-4-6 4Z\"/>", "search": "<circle cx=\"10.5\" cy=\"10.5\" r=\"6.5\"/><path d=\"m16 16 5 5\"/>", "heart": "<path d=\"M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z\"/>", "leaf": "<path d=\"M20 3C8 2 2 7 4 15c8 8 17 0 16-12ZM4 21l11-12\"/>", "briefcase": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M8 7V3h8v4M3 12a20 20 0 0 0 18 0M10 14h4\"/>", "check": "<path d=\"m5 12 4 4L19 6\"/>", "bulb": "<path d=\"M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 3H9Z\"/>", "people": "<circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 21v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5\"/>", "pen": "<path d=\"m4 16 12-12 4 4L8 20H4Zm9-9 4 4\"/>", "wrench": "<path d=\"M14 7a5 5 0 0 0-6 6L3 18a2 2 0 0 0 3 3l6-6a5 5 0 0 0 6-6l-4 3-3-3Z\"/>"};
  function icon(name) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || ICONS.spark) + '</svg>'; }

  /* ---------- Helpers ---------- */
  const avg = a => a.reduce((s, x) => s + x, 0) / a.length;
  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
  const pct = x => Math.round(clamp(x, 0, 1) * 100);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function slug(q) { return q.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function joinList(arr) {
    if (arr.length <= 1) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
  }
  function blankAnswers() {
    return { interests: {}, code: '', personality: {}, values: [], faith: [], scenarios: {}, skills: { num: 3, comm: 3, people: 3, tech: 3, hands: 3, create: 3 }, pathway: 'Poly', grit: false };
  }


  /* ---------- Scoring ---------- */
  function profileFromAnswers(a) {
    const interest = {};
    if (/^[RIASEC]{3}$/.test(a.code || '')) {
      TYPES.forEach(t => { interest[t] = .15; });
      [...a.code].forEach((t, i) => { interest[t] = [1, .75, .5][i]; });
    } else {
      TYPES.forEach(t => {
        const vals = INTEREST_ITEMS.filter(x => x.t === t).map(x => a.interests[x.id]).filter(Boolean);
        interest[t] = vals.length ? (avg(vals) - 1) / 4 : .5;
      });
    }
    const traits = {}, nudges = {};
    TRAITS.forEach(({ k }) => {
      const vals = PERS_ITEMS.filter(x => x.t === k).map(x => { const v = a.personality[x.id]; return v ? (x.rev ? 6 - v : v) : null; }).filter(v => v != null);
      traits[k] = vals.length ? (avg(vals) - 1) / 4 : .5;
    });
    SCENARIOS.forEach(s => {
      const o = s.options.find(o => o.k === a.scenarios[s.id]);
      if (o) Object.entries(o.adj).forEach(([k, d]) => { traits[k] += d; nudges[k] = (nudges[k] || 0) + d; });
    });
    TRAITS.forEach(({ k }) => { traits[k] = clamp(traits[k], 0, 1); });
    return { interest, traits, nudges, values: a.values.slice(), faith: a.faith.slice(), skills: Object.assign({}, a.skills), pathway: a.pathway, grit: a.grit, codeImported: /^[RIASEC]{3}$/.test(a.code || '') };
  }

  function codeOf(interest) {
    return TYPES.map((t, i) => ({ t, v: interest[t], i })).sort((a, b) => (b.v - a.v) || (a.i - b.i)).slice(0, 3).map(x => x.t).join('');
  }

  function scoreRole(role, p, w) {
    const maxI = Math.max(...TYPES.map(t => p.interest[t]), .01);
    const rv = {}; TYPES.forEach(t => { rv[t] = .1; });
    [...role.code].forEach((t, i) => { rv[t] = [1, .7, .45][i]; });
    const mad = avg(TYPES.map(t => Math.abs(p.interest[t] / maxI - rv[t])));
    const interest = clamp(1 - 1.3 * mad, 0, 1);

    const pens = Object.entries(role.ws).map(([k, need]) => { const d = need - p.traits[k]; return d > 0 ? d : -d * .4; });
    const work = clamp(1 - 1.6 * avg(pens), 0, 1);

    const matched = role.values.filter(v => p.values.includes(v));
    const values = p.values.length ? .25 + .75 * (matched.length / p.values.length) : .6;

    const W = w.i + w.w + w.v || 1;
    const total = Math.round(100 * (w.i * interest + w.w * work + w.v * values) / W);

    const reasons = [];
    const top3 = codeOf(p.interest);
    const overlap = [...role.code].filter(t => top3.includes(t));
    if (overlap.length) reasons.push({ tone: 'good', text: 'Matches your top interests: ' + joinList(overlap.map(t => TYPE_INFO[t].name)) + '.' });
    else reasons.push({ tone: 'gap', text: 'Sits outside your top three interests (' + top3 + ').' });

    const [tk, need] = Object.entries(role.ws).sort((a, b) => b[1] - a[1])[0];
    const you = p.traits[tk];
    if (you >= need - .12) reasons.push({ tone: 'good', text: 'Your ' + TRAIT[tk].name.toLowerCase() + ' score (' + pct(you) + ') suits ' + TRAIT[tk].need + '.' });
    else reasons.push({ tone: 'gap', text: 'Asks for more ' + TRAIT[tk].name.toLowerCase() + ' than you showed (' + pct(you) + ' against about ' + pct(need) + ').' });

    if (matched.length) reasons.push({ tone: 'good', text: 'Offers ' + joinList(matched.map(v => VALUE[v].short)) + ', which you chose.' });
    else if (p.values.length) reasons.push({ tone: 'info', text: 'Doesn’t stand out on the values you chose.' });

    const gaps = [];
    Object.entries(role.skills).forEach(([k, needLvl]) => {
      const g = needLvl - (p.skills[k] || 0);
      if (g >= 2) { gaps.push(k); reasons.push({ tone: 'gap', text: 'Build first: ' + SKILL[k].label.toLowerCase() + ' (you rated ' + p.skills[k] + '; this role usually needs ' + needLvl + ').' }); }
      else if (g === 1) reasons.push({ tone: 'info', text: 'Worth building: ' + SKILL[k].label.toLowerCase() + '.' });
    });
    const eduGap = role.edu > PATH[p.pathway].rank;
    if (eduGap) reasons.push({ tone: 'gap', text: 'Usually needs ' + EDU_LABEL[role.edu] + '. Your pathway: ' + PATH[p.pathway].name + '.' });

    let flag = null, query = role.q;
    const fl = role.flags || [];
    if (fl.includes('riba') && p.faith.includes('riba')) flag = { level: 'strong', text: 'Built on interest-based (riba) products. Flagged because of your preference and moved down the list.' };
    if (fl.includes('alcohol') && (p.faith.includes('alcohol') || p.faith.includes('halal'))) {
      flag = { level: 'soft', text: 'Some outlets serve alcohol. Your job searches look for halal outlets.' };
      query = 'halal ' + role.q;
    }
    return { role, interest, work, values, total, reasons, gaps, eduGap, stretch: eduGap || gaps.length > 0, flag, query };
  }

  function rank(p, w, hide) {
    const scored = ROLES.map(r => scoreRole(r, p, w || DEFAULT_W)).filter(s => s.total >= 50).sort((a, b) => b.total - a.total);
    const strong = s => !!(s.flag && s.flag.level === 'strong');
    const pick = list => {
      const nonStretch = list.filter(s => !s.stretch).slice(0, 10);
      return { main: nonStretch.filter(s => !strong(s)).concat(nonStretch.filter(strong)), stretch: list.filter(s => s.stretch).slice(0, 2) };
    };
    const all = pick(scored);
    const flaggedTotal = all.main.concat(all.stretch).filter(strong).length;
    const shown = hide ? pick(scored.filter(s => !strong(s))) : all;
    return { main: shown.main, stretch: shown.stretch, flaggedTotal };
  }


  /* ---------- Shared labels and ideas ---------- */
  const AGES = [['18-20', '18 to 20'], ['21-23', '21 to 23'], ['24-25', '24 to 25'], ['other', 'Under 18 or over 25']];
  const AREAS = [['north', 'North'], ['north-east', 'North-East'], ['east', 'East'], ['west', 'West'], ['central', 'Central'], ['na', 'Prefer not to say']];
  const DEFAULT_W = { i: 50, w: 30, v: 20 };
  const EVENT_IDEAS = {
    R: 'Hands-on job taster at an engineering, aerospace or facilities workshop',
    I: 'Data and research job taster with a tech or healthcare lab team',
    A: 'Design and media day with a studio, agency or newsroom',
    S: 'Healthcare and social-service attachment day',
    E: 'Sales, marketing and business development taster with local firms',
    C: 'Finance and operations office visit, from accounts to logistics'
  };
  function lowerTitle(t) { return /^[A-Z][A-Z]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1); }
  function lowerFirst(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function upperFirst(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function options(list, v) { return list.map(([k, l]) => '<option value="' + k + '"' + (v === k ? ' selected' : '') + '>' + l + '</option>').join(''); }

  /* ---------- Shared results (the mock MENDAKI database) ---------- */
  // The youth app writes one anonymised record here, only after the youth opts in to share.
  // The MENDAKI staff page reads only this key, never the youth's quiz answers. Both pages
  // run in the same browser, so nothing is sent anywhere. In the pilot, a server would hold these.
  const SHARED_KEY = 'serasi-shared-v1';

  function writeShared(doc) {
    try { localStorage.setItem(SHARED_KEY, JSON.stringify(doc)); } catch (e) { /* storage unavailable */ }
  }
  function clearShared() {
    try { localStorage.removeItem(SHARED_KEY); } catch (e) { /* ignore */ }
  }
  function hasShared() {
    try { return localStorage.getItem(SHARED_KEY) !== null; } catch (e) { return false; }
  }
  // Returns the shared record with unknown values dropped, or null if there is none.
  function readShared() {
    try {
      const d = JSON.parse(localStorage.getItem(SHARED_KEY) || 'null');
      if (!d || d.v !== 1 || !/^[RIASEC]{3}$/.test(d.code || '')) return null;
      const known = (list, ok) => (Array.isArray(list) ? list.filter(ok) : []);
      return {
        v: 1,
        month: /^\d{4}-(0[1-9]|1[0-2])$/.test(d.month || '') ? d.month : '',
        age: AGES.some(x => x[0] === d.age) ? d.age : 'na',
        area: AREAS.some(x => x[0] === d.area) ? d.area : 'na',
        path: PATH[d.path] ? d.path : 'Poly',
        code: d.code, top2: [d.code[0], d.code[1]],
        values: known(d.values, v => VALUE[v]),
        skillsLow: known(d.skillsLow, k => SKILL[k]),
        topJobs: known(d.topJobs, id => ROLE[id]),
        stretchJobs: known(d.stretchJobs, id => ROLE[id]),
        tasters: !!d.tasters
      };
    } catch (e) { return null; }
  }

  window.SerasiCore = {
    TYPES,
    TYPE_INFO,
    TRAITS,
    TRAIT,
    VALUES,
    VALUE,
    FAITH,
    FAITH_ITEM,
    SKILLS,
    SKILL,
    PATHWAYS,
    PATH,
    EDU_LABEL,
    INTEREST_ITEMS,
    PERS_ITEMS,
    SCENARIOS,
    PORTALS,
    SF_URL,
    LINKS,
    ROLES,
    ROLE,
    ICONS,
    icon,
    avg,
    clamp,
    pct,
    esc,
    slug,
    joinList,
    blankAnswers,
    profileFromAnswers,
    codeOf,
    scoreRole,
    rank,
    AGES,
    AREAS,
    DEFAULT_W,
    EVENT_IDEAS,
    lowerTitle,
    lowerFirst,
    upperFirst,
    options,
    SHARED_KEY,
    writeShared,
    clearShared,
    hasShared,
    readShared
  };
})();
