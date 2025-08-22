-- Add columns to job_listings table for external job source integration
ALTER TABLE public.job_listings 
ADD COLUMN source text DEFAULT 'internal',
ADD COLUMN external_id text,
ADD COLUMN external_url text,
ADD COLUMN company_name text;

-- Create index on external_id for deduplication
CREATE INDEX idx_job_listings_external_id ON public.job_listings(source, external_id);

-- Create index on company_name for map integration
CREATE INDEX idx_job_listings_company_name ON public.job_listings(company_name);

-- Add constraint to ensure external jobs have required fields
ALTER TABLE public.job_listings 
ADD CONSTRAINT check_external_job_fields 
CHECK (
  (source = 'internal') OR 
  (source != 'internal' AND external_id IS NOT NULL AND external_url IS NOT NULL)
);