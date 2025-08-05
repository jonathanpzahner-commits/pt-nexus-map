-- Enable INSERT, UPDATE, DELETE policies for all tables

-- Companies policies
CREATE POLICY "Enable insert for companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for companies" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Enable delete for companies" ON public.companies FOR DELETE USING (true);

-- Providers policies  
CREATE POLICY "Enable insert for providers" ON public.providers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for providers" ON public.providers FOR UPDATE USING (true);
CREATE POLICY "Enable delete for providers" ON public.providers FOR DELETE USING (true);

-- Schools policies
CREATE POLICY "Enable insert for schools" ON public.schools FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for schools" ON public.schools FOR UPDATE USING (true);
CREATE POLICY "Enable delete for schools" ON public.schools FOR DELETE USING (true);

-- Job listings policies
CREATE POLICY "Enable insert for job_listings" ON public.job_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for job_listings" ON public.job_listings FOR UPDATE USING (true);
CREATE POLICY "Enable delete for job_listings" ON public.job_listings FOR DELETE USING (true);