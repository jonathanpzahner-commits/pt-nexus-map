-- Add new fields to profiles table for enhanced profile functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_photo_url text,
ADD COLUMN IF NOT EXISTS site_purposes text[] DEFAULT '{}';

-- Add a comment to describe the site_purposes field
COMMENT ON COLUMN public.profiles.site_purposes IS 'Array of purposes for using the site: networking, research, mentoring, job_seeking, business_development, etc.';

-- Create index for better query performance on purposes
CREATE INDEX IF NOT EXISTS idx_profiles_site_purposes ON public.profiles USING GIN(site_purposes);