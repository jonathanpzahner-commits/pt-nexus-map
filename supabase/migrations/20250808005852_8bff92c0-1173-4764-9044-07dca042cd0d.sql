-- Rename sales_consultants table to consultant_companies
ALTER TABLE sales_consultants RENAME TO consultant_companies;

-- Add consulting_categories field to store the dropdown selections
ALTER TABLE consultant_companies 
ADD COLUMN consulting_categories text[] DEFAULT '{}';

-- Update any existing data to reflect the new structure
UPDATE consultant_companies 
SET consulting_categories = CASE 
  WHEN specializations IS NOT NULL AND array_length(specializations, 1) > 0 
  THEN specializations 
  ELSE '{}' 
END;

-- Remove the old specializations column since we're replacing it with consulting_categories
ALTER TABLE consultant_companies DROP COLUMN IF EXISTS specializations;

-- Update RLS policies to reference the new table name
DROP POLICY IF EXISTS "Enable delete for sales consultants" ON consultant_companies;
DROP POLICY IF EXISTS "Enable insert for sales consultants" ON consultant_companies;
DROP POLICY IF EXISTS "Enable update for sales consultants" ON consultant_companies;
DROP POLICY IF EXISTS "Sales consultants are viewable by everyone" ON consultant_companies;

-- Create new policies for consultant_companies
CREATE POLICY "Enable delete for consultant companies" 
ON consultant_companies 
FOR DELETE 
USING (true);

CREATE POLICY "Enable insert for consultant companies" 
ON consultant_companies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for consultant companies" 
ON consultant_companies 
FOR UPDATE 
USING (true);

CREATE POLICY "Consultant companies are viewable by everyone" 
ON consultant_companies 
FOR SELECT 
USING (true);