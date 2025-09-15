// Provider filtering system with comprehensive categories

export const PRIMARY_SETTINGS = [
  'Outpatient',
  'Hospital', 
  'Inpatient Rehab Facility (IRF)',
  'Skilled Nursing Facility (SNF)',
  'Long-Term Acute Care Hospital (LTACH)',
  'Comprehensive Outpatient Rehabilitation Facility (CORF)',
  'Home Health',
  'Hospice / Palliative Care',
  'School / Education',
  'Corporate / Industrial / Occupational Health',
  'VA / Government / Military',
  'Academic / Research / University'
];

export const SUB_SETTINGS: Record<string, string[]> = {
  'Hospital': [
    'Acute Care', 'ICU', 'Emergency Department', 'Inpatient Rehab Unit', 
    'Step-Down/Telemetry', 'Labor & Delivery (L&D)', 'Observation Unit', 
    'Oncology Floors', 'Burn Unit', 'Cardiac Units'
  ],
  'Outpatient': [
    'Private Practice', 'Hospital-Based', 'Physician-Owned (POPTS)', 
    'Rehab Agency', 'CORF', 'FQHC/RHC/Community Health', 'VA/University Outpatient', 
    'Industrial/Onsite', 'Pediatrics-focused', 'Neuro-focused'
  ],
  'Skilled Nursing Facility (SNF)': [
    'Short-Term Rehab', 'Long-Term Care', 'Memory Care', 'Subacute'
  ],
  'Home Health': [
    'General Home Health', 'Hospice at Home', 'Mobile Outpatient (cash PT)'
  ],
  'School / Education': [
    'Early Intervention (0–3)', 'Preschool (3–5)', 'K–12', 'University Student Services'
  ],
  'Corporate / Industrial / Occupational Health': [
    'Onsite Employer Clinics', 'Ergonomics', 'Work Conditioning', 
    'Work Hardening', 'Prevention/Wellness Programs'
  ],
  'VA / Government / Military': [
    'Polytrauma Centers', 'Military Bases', 'VA Outpatient', 'VA Inpatient', 'Research'
  ],
  'Academic / Research / University': [
    'Teaching Clinics', 'Research Labs', 'Specialty Centers'
  ]
};

export const SPECIALTIES = [
  'Orthopaedics',
  'Sports',
  'Neurology (Stroke, TBI, SCI, Vestibular, Concussion, MS, PD)',
  'Cardiovascular & Pulmonary',
  'Oncology',
  'Wound Management',
  'Pelvic Health (men\'s, women\'s, OB/L&D, post-partum)',
  'Lymphedema',
  'Hand / Upper Extremity',
  'Pediatrics (NICU, developmental, CP, school-based)',
  'Geriatrics',
  'Amputee / Prosthetics',
  'Burn Rehab',
  'TMJ',
  'Chronic Pain',
  'Aquatic Therapy',
  'Ergonomics / Work Rehab',
  'Industrial / Occupational Health',
  'Community Wellness'
];

export const CERTIFICATIONS = [
  // ABPTS specialties
  'ABPTS CardioPulm',
  'ABPTS Clinical Electrophysiology',
  'ABPTS Geriatrics',
  'ABPTS Neurology',
  'ABPTS Oncology',
  'ABPTS Orthopaedics',
  'ABPTS Pediatrics',
  'ABPTS Sports',
  'ABPTS Women\'s Health',
  'ABPTS Wound',
  
  // Pelvic Health
  'CAPP-Pelvic',
  'CAPP-OB', 
  'PRPC (Herman & Wallace)',
  'BCB-PMD (biofeedback)',
  
  // Lymphedema
  'CLT-LANA',
  
  // Hand Therapy
  'CHT',
  
  // Wound Care
  'CWS®',
  'CWCA®',
  'CWSP®',
  
  // Vestibular / Concussion
  'Vestibular Competency',
  'AIB-V',
  'ITPT',
  'CCMI',
  
  // Manual Therapy
  'FAAOMPT',
  'Cert. MDT (McKenzie)',
  'CMP (Mulligan)',
  'COMT',
  'PRI (PRC)',
  'DNS',
  'Schroth/BSPTS',
  
  // Neuro
  'LSVT BIG®',
  'PWR!Moves®',
  'CBIS',
  'NDT',
  'CNT (Neonatal)',
  
  // Sports / Performance
  'CSCS®',
  'TSAC-F®',
  'FMS',
  'SFMA',
  'TPI',
  
  // Special Techniques
  'BFR',
  'Graston',
  'IASTM',
  'Kinesio Taping (CKTP/CKTI)',
  
  // Work / Corporate
  'CEAS I–III',
  'CFCE',
  'WorkWell/OccuPro FCE',
  
  // Other
  'Aquatic PT Clinical Competency',
  'GLA:D',
  'ACHH (Home Health)',
  'CCIP (Clinical Instructor)',
  'Dry Needling (state-dependent)'
];

// Consultant categories based on ConsultantsTab
export const CONSULTANT_CATEGORIES = [
  'Talent',
  'M&A',
  'Education', 
  'Front Office-Billing',
  'Human Resources',
  'Technology',
  'Growth'
];

export const CONSULTANT_SPECIALTIES: Record<string, string[]> = {
  'Talent': [
    'Executive Recruitment',
    'Permanent Placement', 
    'Travel PT Staffing',
    'Contract Staffing',
    'Interim Leadership',
    'Talent Acquisition'
  ],
  'M&A': [
    'Practice Acquisitions',
    'Business Valuation',
    'Strategic Partnerships',
    'Due Diligence',
    'Transaction Advisory',
    'Exit Planning'
  ],
  'Education': [
    'CEU Programs',
    'Specialty Certifications',
    'Leadership Development',
    'Clinical Training',
    'Compliance Training',
    'Professional Development'
  ],
  'Front Office-Billing': [
    'Revenue Cycle Mgmt',
    'Insurance Optimization', 
    'Billing Compliance',
    'Prior Authorization',
    'Claims Management',
    'Financial Analytics'
  ],
  'Human Resources': [
    'HR Compliance',
    'Employee Relations',
    'Performance Management',
    'Benefits Administration',
    'Recruitment Strategy',
    'Organizational Development'
  ],
  'Technology': [
    'EMR Implementation',
    'Practice Management',
    'Telehealth Integration',
    'Digital Marketing',
    'Data Analytics',
    'IT Infrastructure'
  ],
  'Growth': [
    'Market Expansion',
    'Digital Marketing',
    'Strategic Planning',
    'Business Development',
    'Brand Strategy',
    'Operational Excellence'
  ]
};

// Example data for search suggestions
export const SEARCH_EXAMPLES = {
  consultants: [
    { name: 'Healthcare Solutions Group', specialty: 'Operational Excellence', location: 'Atlanta, GA' },
    { name: 'PT Practice Advisors', specialty: 'Business Development', location: 'Phoenix, AZ' },
    { name: 'Rehab Consulting Partners', specialty: 'Revenue Optimization', location: 'Chicago, IL' }
  ],
  equipment_vendors: [
    { name: 'HUR (Pneumatic Equipment)', specialty: 'Pneumatic Rehabilitation', location: 'Tampa, FL' },
    { name: 'NuStep Cross-Trainers', specialty: 'Cardio Equipment', location: 'Ann Arbor, MI' }, 
    { name: 'Biodex Medical Systems', specialty: 'Testing & Rehab Equipment', location: 'Shirley, NY' }
  ],
  pe_firms: [
    { name: 'Varsity Healthcare Partners', specialty: 'Healthcare Services', location: 'Nashville, TN' },
    { name: 'H.I.G. Capital', specialty: 'Healthcare Growth', location: 'Miami, FL' },
    { name: 'Blue Sea Capital', specialty: 'Healthcare Technology', location: 'Boston, MA' }
  ],
  profiles: [
    { name: 'Dr. Sarah Johnson, DPT', specialty: 'Orthopedic Physical Therapy', location: 'Seattle, WA' },
    { name: 'Michael Chen, PT, PhD', specialty: 'Sports Medicine Research', location: 'Los Angeles, CA' },
    { name: 'Lisa Rodriguez, DPT, OCS', specialty: 'Manual Therapy', location: 'Austin, TX' }
  ]
};
