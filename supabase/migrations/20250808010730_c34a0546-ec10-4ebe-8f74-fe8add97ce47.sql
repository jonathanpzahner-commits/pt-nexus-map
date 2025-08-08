-- CRITICAL SECURITY UPDATE: Restrict all data access to authenticated users only

-- Companies table - restrict to authenticated users
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON public.companies;
DROP POLICY IF EXISTS "Public read access for companies" ON public.companies;
DROP POLICY IF EXISTS "Enable insert for companies" ON public.companies;
DROP POLICY IF EXISTS "Enable update for companies" ON public.companies;
DROP POLICY IF EXISTS "Enable delete for companies" ON public.companies;

CREATE POLICY "Authenticated users can view companies" 
ON public.companies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert companies" 
ON public.companies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update companies" 
ON public.companies 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete companies" 
ON public.companies 
FOR DELETE 
TO authenticated 
USING (true);

-- Providers table - restrict to authenticated users
DROP POLICY IF EXISTS "Providers are viewable by everyone" ON public.providers;
DROP POLICY IF EXISTS "Public read access for providers" ON public.providers;
DROP POLICY IF EXISTS "Enable insert for providers" ON public.providers;
DROP POLICY IF EXISTS "Enable update for providers" ON public.providers;
DROP POLICY IF EXISTS "Enable delete for providers" ON public.providers;

CREATE POLICY "Authenticated users can view providers" 
ON public.providers 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert providers" 
ON public.providers 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update providers" 
ON public.providers 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete providers" 
ON public.providers 
FOR DELETE 
TO authenticated 
USING (true);

-- Schools table - restrict to authenticated users
DROP POLICY IF EXISTS "Schools are viewable by everyone" ON public.schools;
DROP POLICY IF EXISTS "Public read access for schools" ON public.schools;
DROP POLICY IF EXISTS "Enable insert for schools" ON public.schools;
DROP POLICY IF EXISTS "Enable update for schools" ON public.schools;
DROP POLICY IF EXISTS "Enable delete for schools" ON public.schools;

CREATE POLICY "Authenticated users can view schools" 
ON public.schools 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert schools" 
ON public.schools 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update schools" 
ON public.schools 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete schools" 
ON public.schools 
FOR DELETE 
TO authenticated 
USING (true);

-- Job listings table - restrict to authenticated users
DROP POLICY IF EXISTS "Job listings are viewable by everyone" ON public.job_listings;
DROP POLICY IF EXISTS "Public read access for job_listings" ON public.job_listings;
DROP POLICY IF EXISTS "Enable insert for job_listings" ON public.job_listings;
DROP POLICY IF EXISTS "Enable update for job_listings" ON public.job_listings;
DROP POLICY IF EXISTS "Enable delete for job_listings" ON public.job_listings;

CREATE POLICY "Authenticated users can view job listings" 
ON public.job_listings 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert job listings" 
ON public.job_listings 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update job listings" 
ON public.job_listings 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete job listings" 
ON public.job_listings 
FOR DELETE 
TO authenticated 
USING (true);

-- Equipment companies table - restrict to authenticated users
DROP POLICY IF EXISTS "Equipment companies are viewable by everyone" ON public.equipment_companies;
DROP POLICY IF EXISTS "Enable insert for equipment companies" ON public.equipment_companies;
DROP POLICY IF EXISTS "Enable update for equipment companies" ON public.equipment_companies;
DROP POLICY IF EXISTS "Enable delete for equipment companies" ON public.equipment_companies;

CREATE POLICY "Authenticated users can view equipment companies" 
ON public.equipment_companies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert equipment companies" 
ON public.equipment_companies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update equipment companies" 
ON public.equipment_companies 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete equipment companies" 
ON public.equipment_companies 
FOR DELETE 
TO authenticated 
USING (true);

-- Consultant companies table - restrict to authenticated users
DROP POLICY IF EXISTS "Consultant companies are viewable by everyone" ON public.consultant_companies;
DROP POLICY IF EXISTS "Enable insert for consultant companies" ON public.consultant_companies;
DROP POLICY IF EXISTS "Enable update for consultant companies" ON public.consultant_companies;
DROP POLICY IF EXISTS "Enable delete for consultant companies" ON public.consultant_companies;

CREATE POLICY "Authenticated users can view consultant companies" 
ON public.consultant_companies 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert consultant companies" 
ON public.consultant_companies 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update consultant companies" 
ON public.consultant_companies 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete consultant companies" 
ON public.consultant_companies 
FOR DELETE 
TO authenticated 
USING (true);

-- PE firms table - restrict to authenticated users
DROP POLICY IF EXISTS "PE firms are viewable by everyone" ON public.pe_firms;
DROP POLICY IF EXISTS "Enable insert for pe firms" ON public.pe_firms;
DROP POLICY IF EXISTS "Enable update for pe firms" ON public.pe_firms;
DROP POLICY IF EXISTS "Enable delete for pe firms" ON public.pe_firms;

CREATE POLICY "Authenticated users can view PE firms" 
ON public.pe_firms 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert PE firms" 
ON public.pe_firms 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update PE firms" 
ON public.pe_firms 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete PE firms" 
ON public.pe_firms 
FOR DELETE 
TO authenticated 
USING (true);

-- Notes table - restrict to authenticated users
DROP POLICY IF EXISTS "Public read access for notes" ON public.notes;
DROP POLICY IF EXISTS "Enable insert for notes" ON public.notes;
DROP POLICY IF EXISTS "Enable update for notes" ON public.notes;
DROP POLICY IF EXISTS "Enable delete for notes" ON public.notes;

CREATE POLICY "Authenticated users can view notes" 
ON public.notes 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert notes" 
ON public.notes 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update notes" 
ON public.notes 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can delete notes" 
ON public.notes 
FOR DELETE 
TO authenticated 
USING (true);