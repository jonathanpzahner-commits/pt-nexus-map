-- Check and fix RLS policies for public data access
-- Enable RLS on all tables (if not already enabled)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON public.schools;
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;
DROP POLICY IF EXISTS "Job listings are viewable by everyone" ON public.job_listings;

-- Create public read access policies for all data
CREATE POLICY "Companies are viewable by everyone" 
ON public.companies FOR SELECT 
USING (true);

CREATE POLICY "Schools are viewable by everyone" 
ON public.schools FOR SELECT 
USING (true);

CREATE POLICY "Providers are viewable by everyone" 
ON public.providers FOR SELECT 
USING (true);

CREATE POLICY "Job listings are viewable by everyone" 
ON public.job_listings FOR SELECT 
USING (true);