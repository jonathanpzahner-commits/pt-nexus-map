-- Add example graduation season, boards timing, and DCE info to existing schools
UPDATE schools 
SET 
  graduation_season = 'May 2024',
  boards_timing = 'Within 6 months of graduation',
  dce_info = 'Dr. Patricia Williams, DCE - pwilliams@duke.edu - (919) 684-4002'
WHERE name = 'Duke University';

UPDATE schools 
SET 
  graduation_season = 'June 2024',
  boards_timing = 'After graduation ceremony',
  dce_info = 'Dr. Michael Chen, DCE - mchen@uw.edu - (206) 543-1234'
WHERE name = 'University of Washington';

UPDATE schools 
SET 
  graduation_season = 'May 2024',
  boards_timing = 'Last semester of program',
  dce_info = 'Dr. Jennifer Martinez, DCE - jmartinez@emory.edu - (404) 727-5555'
WHERE name = 'Emory University';

UPDATE schools 
SET 
  graduation_season = 'December 2024',
  boards_timing = 'Within 90 days of graduation',
  dce_info = 'Dr. Robert Thompson, DCE - rthompson@govst.edu - (708) 534-4567'
WHERE name = 'Governors State University';

UPDATE schools 
SET 
  graduation_season = 'May 2024',
  boards_timing = 'After clinical completion',
  dce_info = 'Dr. Lisa Anderson, DCE - landerson@elon.edu - (336) 278-5432'
WHERE name = 'Elon University';