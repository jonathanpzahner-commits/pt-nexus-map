-- Update providers table to match user's Excel format
ALTER TABLE public.providers 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN zip_code TEXT,
ADD COLUMN current_employer TEXT,
ADD COLUMN current_job_title TEXT,
ADD COLUMN additional_info TEXT,
ADD COLUMN source TEXT,
ADD COLUMN linkedin_url TEXT;

-- Make license_number and license_state nullable since user data doesn't have them
ALTER TABLE public.providers 
ALTER COLUMN license_number DROP NOT NULL,
ALTER COLUMN license_state DROP NOT NULL;

-- Update name to be nullable since we'll use first_name/last_name
ALTER TABLE public.providers 
ALTER COLUMN name DROP NOT NULL;