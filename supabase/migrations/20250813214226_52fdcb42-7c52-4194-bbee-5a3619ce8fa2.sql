-- Add Glassdoor fields to companies table
ALTER TABLE public.companies 
ADD COLUMN glassdoor_rating numeric(2,1) CHECK (glassdoor_rating >= 1.0 AND glassdoor_rating <= 5.0),
ADD COLUMN glassdoor_url text;