-- Update boards timing to reflect realistic NPTE scheduling options
UPDATE schools 
SET boards_timing = 'NPTE available year-round; April and July common testing months'
WHERE name = 'Duke University';

UPDATE schools 
SET boards_timing = 'NPTE after graduation; July cohort recommended for spring graduates'
WHERE name = 'University of Washington';

UPDATE schools 
SET boards_timing = 'NPTE available post-graduation; April testing for December grads'
WHERE name = 'Emory University';

UPDATE schools 
SET boards_timing = 'NPTE after graduation; April/July testing windows popular'
WHERE name = 'Governors State University';

UPDATE schools 
SET boards_timing = 'NPTE post-graduation; school recommends July for May graduates'
WHERE name = 'Elon University';