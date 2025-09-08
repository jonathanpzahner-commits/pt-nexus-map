-- Add detailed sample company data with comprehensive information for CEO demo

-- Insert Twin Boro Physical Therapy example
INSERT INTO companies (
  name, 
  company_type, 
  founded_year, 
  description,
  website,
  city,
  state,
  zip_code,
  address,
  parent_company,
  pe_backed,
  pe_firm_name,
  pe_relationship_start_date,
  number_of_clinics,
  company_size_range,
  services,
  company_locations,
  leadership,
  glassdoor_rating,
  glassdoor_url
) VALUES (
  'Twin Boro Physical Therapy',
  'Outpatient Physical Therapy',
  1980,
  'One of the leading physical therapy providers in the Mid-Atlantic region, specializing in outpatient orthopedic and sports medicine rehabilitation.',
  'https://twinboro.com',
  'Marlboro',
  'NJ',
  '07746',
  '200 Highway 35, Marlboro, NJ 07746',
  'PT Solutions',
  true,
  'General Atlantic (via PT Solutions)',
  '2021-03-15',
  67,
  '500-1000',
  ARRAY['Orthopedic Rehabilitation', 'Sports Medicine', 'Work Injury Treatment', 'Post-Surgical Recovery', 'Dry Needling', 'Manual Therapy'],
  ARRAY['New Jersey (45 clinics)', 'Pennsylvania (15 clinics)', 'Maryland (7 clinics)'],
  jsonb_build_object(
    'owner_ceo', 'Andrew Lotsis (Founder/Former CEO)',
    'current_ceo', 'Mike Weinper (PT Solutions CEO)',
    'acquisition_date', '2023-04-01',
    'acquisition_details', 'Acquired by PT Solutions in April 2023'
  ),
  4.2,
  'https://glassdoor.com/twinboro'
),

-- Insert PT Solutions (parent company)
(
  'PT Solutions',
  'Multi-Location Physical Therapy',
  2009,
  'Leading physical therapy provider with over 300 locations across multiple states, focused on outpatient orthopedic and sports rehabilitation.',
  'https://ptsolutions.com',
  'Knoxville',
  'TN',
  '37919',
  '1715 Aaron Brenner Drive, Memphis, TN 38120',
  null,
  true,
  'General Atlantic',
  '2021-03-15',
  320,
  '5000+',
  ARRAY['Outpatient PT', 'Occupational Therapy', 'Sports Performance', 'Industrial Rehab', 'Dry Needling', 'Aquatic Therapy'],
  ARRAY['Tennessee (85 clinics)', 'North Carolina (75 clinics)', 'South Carolina (45 clinics)', 'Georgia (35 clinics)', 'Virginia (25 clinics)', 'Kentucky (22 clinics)', 'Alabama (20 clinics)', 'New Jersey (45 clinics via Twin Boro)', 'Pennsylvania (15 clinics via Twin Boro)', 'Maryland (7 clinics via Twin Boro)'],
  jsonb_build_object(
    'owner_ceo', 'Mike Weinper',
    'cfo', 'Sarah Johnson',
    'operations', 'David Chen',
    'clinical_excellence', 'Dr. Lisa Martinez, PT, DPT'
  ),
  4.1,
  'https://glassdoor.com/ptsolutions'
),

-- Insert BenchMark Physical Therapy
(
  'BenchMark Physical Therapy',
  'Outpatient Physical Therapy',
  1990,
  'Regional physical therapy provider known for clinical excellence and patient-centered care across the Southeast.',
  'https://benchmarkpt.com',
  'Birmingham',
  'AL',
  '35243',
  '280 Office Park Drive, Birmingham, AL 35243',
  'Upstream Rehabilitation',
  true,
  'Ridgemont Equity Partners (via Upstream)',
  '2019-08-01',
  145,
  '2000-3000',
  ARRAY['Outpatient PT', 'Sports Rehab', 'Work Comp', 'Vestibular Therapy', 'Pelvic Health', 'Hand Therapy'],
  ARRAY['Alabama (65 clinics)', 'Georgia (35 clinics)', 'Tennessee (25 clinics)', 'Mississippi (20 clinics)'],
  jsonb_build_object(
    'owner_ceo', 'Ryan Barefield (Founder)',
    'current_leadership', 'Upstream Rehabilitation Management Team',
    'acquisition_date', '2022-06-01',
    'acquisition_details', 'Acquired by Upstream Rehabilitation in June 2022'
  ),
  4.3,
  'https://glassdoor.com/benchmark'
),

-- Insert Athletico Physical Therapy
(
  'Athletico Physical Therapy',
  'Sports Medicine & Rehabilitation',
  1991,
  'Leading sports medicine and rehabilitation provider specializing in injury prevention, rehabilitation, and performance enhancement.',
  'https://athletico.com',
  'Oak Brook',
  'IL',
  '60523',
  '1500 West 22nd Street, Oak Brook, IL 60523',
  null,
  true,
  'GTCR',
  '2017-11-01',
  900,
  '8000+',
  ARRAY['Sports Medicine', 'Outpatient PT', 'Occupational Therapy', 'Athletic Training', 'Work Comp', 'Industrial Rehab', 'Fitness & Performance'],
  ARRAY['Illinois (350 clinics)', 'Wisconsin (180 clinics)', 'Indiana (150 clinics)', 'Iowa (85 clinics)', 'Nebraska (75 clinics)', 'Michigan (60 clinics)'],
  jsonb_build_object(
    'owner_ceo', 'Mark Kaufman',
    'president', 'Jim Munsell',
    'cfo', 'Kevin Walsh',
    'clinical_excellence', 'Dr. Jennifer Solomon, PT, DPT'
  ),
  4.0,
  'https://glassdoor.com/athletico'
),

-- Insert Select Physical Therapy
(
  'Select Physical Therapy',
  'Outpatient Physical Therapy Network',
  2004,
  'One of the largest physical therapy providers in the US, offering comprehensive rehabilitation services across multiple states.',
  'https://selectpt.com',
  'Mechanicsburg',
  'PA',
  '17050',
  '1245 Liberty Street, Mechanicsburg, PA 17055',
  null,
  true,
  'U.S. Physical Therapy Inc. (publicly traded)',
  '2020-01-15',
  1850,
  '12000+',
  ARRAY['Outpatient PT', 'Occupational Therapy', 'Speech Therapy', 'Industrial Rehab', 'Sports Performance', 'Dry Needling'],
  ARRAY['Pennsylvania (285 clinics)', 'New York (245 clinics)', 'New Jersey (180 clinics)', 'Delaware (65 clinics)', 'Maryland (75 clinics)', 'Connecticut (90 clinics)', 'Massachusetts (110 clinics)', 'Rhode Island (25 clinics)', 'Vermont (15 clinics)', 'New Hampshire (35 clinics)', 'Maine (45 clinics)', 'Texas (220 clinics)', 'Florida (165 clinics)', 'Arizona (135 clinics)', 'California (200 clinics)'],
  jsonb_build_object(
    'owner_ceo', 'Christopher J. Reading',
    'president', 'Glenn McDowell',
    'cfo', 'Lawrance W. McAfee',
    'operations', 'Richard Binstein'
  ),
  3.9,
  'https://glassdoor.com/selectpt'
),

-- Insert smaller independent clinic
(
  'Elite Sports & Spine Physical Therapy',
  'Sports Medicine Clinic',
  2015,
  'Boutique physical therapy practice specializing in sports injuries and spine conditions with personalized one-on-one treatment.',
  'https://elitesportspt.com',
  'Austin',
  'TX',
  '78746',
  '4301 West William Cannon Drive, Austin, TX 78749',
  null,
  false,
  null,
  null,
  3,
  '10-25',
  ARRAY['Sports Rehab', 'Spine Care', 'Manual Therapy', 'Dry Needling', 'Movement Analysis', 'Performance Training'],
  ARRAY['Austin, TX (3 clinics)'],
  jsonb_build_object(
    'owner_ceo', 'Dr. Marcus Thompson, PT, DPT (Owner/Founder)',
    'clinical_director', 'Dr. Sarah Williams, PT, DPT'
  ),
  4.8,
  'https://glassdoor.com/elitesports'
)