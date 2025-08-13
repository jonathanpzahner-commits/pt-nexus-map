-- Add new fields to companies table
ALTER TABLE public.companies 
ADD COLUMN number_of_clinics integer,
ADD COLUMN parent_company text,
ADD COLUMN pe_backed boolean DEFAULT false,
ADD COLUMN pe_firm_name text,
ADD COLUMN pe_relationship_start_date date,
ADD COLUMN company_size_range text;

-- Update existing data to convert employee_count to size ranges
UPDATE public.companies 
SET company_size_range = CASE 
  WHEN employee_count BETWEEN 1 AND 5 THEN '1-5'
  WHEN employee_count BETWEEN 6 AND 10 THEN '6-10'
  WHEN employee_count BETWEEN 11 AND 20 THEN '11-20'
  WHEN employee_count BETWEEN 21 AND 40 THEN '21-40'
  WHEN employee_count BETWEEN 41 AND 75 THEN '41-75'
  WHEN employee_count BETWEEN 76 AND 100 THEN '76-100'
  WHEN employee_count BETWEEN 101 AND 125 THEN '101-125'
  WHEN employee_count BETWEEN 126 AND 150 THEN '126-150'
  WHEN employee_count BETWEEN 151 AND 200 THEN '151-200'
  WHEN employee_count BETWEEN 201 AND 250 THEN '201-250'
  WHEN employee_count BETWEEN 251 AND 500 THEN '251-500'
  WHEN employee_count BETWEEN 501 AND 600 THEN '501-600'
  WHEN employee_count BETWEEN 601 AND 750 THEN '601-750'
  WHEN employee_count BETWEEN 751 AND 1000 THEN '751-1000'
  WHEN employee_count BETWEEN 1001 AND 1500 THEN '1001-1500'
  WHEN employee_count BETWEEN 1501 AND 2500 THEN '1501-2500'
  WHEN employee_count BETWEEN 2501 AND 3500 THEN '2501-3500'
  WHEN employee_count BETWEEN 3501 AND 5000 THEN '3501-5000'
  WHEN employee_count > 5000 THEN '5000+'
  ELSE NULL
END
WHERE employee_count IS NOT NULL;

-- Drop the old employee_count column
ALTER TABLE public.companies DROP COLUMN employee_count;