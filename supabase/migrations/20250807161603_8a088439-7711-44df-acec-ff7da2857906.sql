-- Add individual location fields to companies table
ALTER TABLE public.companies 
ADD COLUMN city text,
ADD COLUMN state text,
ADD COLUMN zip_code text,
ADD COLUMN address text,
ADD COLUMN latitude numeric,
ADD COLUMN longitude numeric;