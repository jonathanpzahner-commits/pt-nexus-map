-- Add leadership field to companies table
ALTER TABLE public.companies 
ADD COLUMN leadership jsonb DEFAULT '{}'::jsonb;