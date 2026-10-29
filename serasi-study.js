/* Serasi study model: groups the roles into fields of study.
   Load it after serasi-core.js and serasi-pathways.js.
   A field is the unit that local routes and overseas advice are written for. Most roles use their study track
   as the field; the overrides below split the broad tracks (tech, business, design and so on) into finer fields.
   kind: 'study' = at least one role in the field needs a diploma or degree (edu 2 or more),
         'ite' = every role can be reached through ITE or on-the-job training,
         'agency' = the route runs through a Singapore agency, so overseas advice does not apply. */
(function () {
  'use strict';

  const FIELDS = {
    engineering: { label: 'Engineering technology', kind: 'ite' },
    'civil-eng': { label: 'Civil engineering and quantity surveying', kind: 'study' },
    'mechanical-eng': { label: 'Mechanical engineering', kind: 'study' },
    'electrical-eng': { label: 'Electrical engineering', kind: 'study' },
    aero: { label: 'Aircraft maintenance', kind: 'ite' },
    trades: { label: 'Technical trades', kind: 'ite' },
    biomedical: { label: 'Biomedical and laboratory science', kind: 'study' },
    veterinary: { label: 'Veterinary care', kind: 'study' },
    computing: { label: 'Computing and software', kind: 'study' },
    'data-ai': { label: 'Data and AI', kind: 'study' },
    cybersecurity: { label: 'Cybersecurity', kind: 'study' },
    accounting: { label: 'Accounting and audit', kind: 'study' },
    'finance-risk': { label: 'Finance, risk and compliance', kind: 'study' },
    business: { label: 'Business and management', kind: 'study' },
    islamicfin: { label: 'Islamic finance and takaful', kind: 'study' },
    logistics: { label: 'Logistics and supply chain', kind: 'study' },
    maritime: { label: 'Maritime and port operations', kind: 'study' },
    pharmacy: { label: 'Pharmacy', kind: 'study' },
    'allied-health': { label: 'Allied health', kind: 'study' },
    architecture: { label: 'Architecture', kind: 'study' },
    'interior-design': { label: 'Interior design', kind: 'study' },
    'graphic-ux': { label: 'Graphic and UX design', kind: 'study' },
    fashion: { label: 'Fashion design', kind: 'study' },
    animation: { label: 'Animation', kind: 'study' },
    media: { label: 'Media and content', kind: 'study' },
    translation: { label: 'Translation and languages', kind: 'study' },
    hospitality: { label: 'Hospitality and events', kind: 'study' },
    culinary: { label: 'Culinary and baking', kind: 'ite' },
    aviation: { label: 'Cabin crew and aviation service', kind: 'ite' },
    pilot: { label: 'Pilot training', kind: 'agency' },
    atc: { label: 'Air traffic control', kind: 'agency' },
    beauty: { label: 'Hair and beauty', kind: 'ite' },
    nursing: { label: 'Nursing', kind: 'study' },
    medicine: { label: 'Medicine', kind: 'study' },
    sport: { label: 'Sport and fitness', kind: 'ite' },
    teaching: { label: 'Teaching', kind: 'agency' },
    earlychild: { label: 'Early childhood and early intervention', kind: 'study' },
    religious: { label: 'Islamic religious studies', kind: 'study' },
    socialwork: { label: 'Social work, counselling and community care', kind: 'study' },
    property: { label: 'Real estate', kind: 'ite' },
    law: { label: 'Law', kind: 'study' },
    uniformed: { label: 'Uniformed services', kind: 'agency' },
    public: { label: 'Public service and policy', kind: 'agency' }
  };

  /* Role id to field, where the role's own track is too broad. */
  const OVERRIDE = {
    'biomed-sci': 'biomedical', 'lab-tech': 'biomedical', 'pharma-qa': 'biomedical',
    'vet-tech': 'veterinary',
    'software-eng': 'computing', 'backend-eng': 'computing', 'game-dev': 'computing', 'it-support': 'computing',
    'data-analyst': 'data-ai', 'data-sci': 'data-ai', 'ai-eng': 'data-ai', 'data-consultant': 'data-ai', 'product-analyst': 'data-ai',
    cyber: 'cybersecurity',
    'accounts-exec': 'accounting', auditor: 'accounting',
    'risk-analyst': 'finance-risk', 'bank-ops': 'finance-risk', compliance: 'finance-risk',
    ecommerce: 'business', 'ops-exec': 'business', hr: 'business', bizdev: 'business', marketing: 'business',
    sustainability: 'business', retail: 'business', sales: 'business', 'customer-service': 'business',
    'pharm-tech': 'pharmacy', pharmacist: 'pharmacy',
    physio: 'allied-health', ot: 'allied-health', radiographer: 'allied-health', dietitian: 'allied-health', 'oral-health': 'allied-health',
    arch: 'architecture',
    interior: 'interior-design',
    ux: 'graphic-ux', graphic: 'graphic-ux', multimedia: 'graphic-ux',
    fashion: 'fashion',
    animator: 'animation',
    translator: 'translation',
    content: 'media', journalist: 'media', video: 'media', photographer: 'media',
    'civil-eng': 'civil-eng', qs: 'civil-eng',
    'mech-eng': 'mechanical-eng',
    'elec-eng': 'electrical-eng'
  };

  function fieldOf(role) {
    return OVERRIDE[role.id] || role.trk;
  }

  window.SerasiStudy = { FIELDS, fieldOf };
})();
