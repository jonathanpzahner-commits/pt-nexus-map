-- Create enum types for standardization
CREATE TYPE public.provider_type AS ENUM ('PT', 'PTA');
CREATE TYPE public.license_status AS ENUM ('active', 'inactive', 'expired', 'suspended');
CREATE TYPE public.work_setting AS ENUM ('home_health', 'outpatient', 'inpatient', 'skilled_nursing', 'acute_care', 'pediatric', 'school_based', 'other');
CREATE TYPE public.employment_status AS ENUM ('employed', 'self_employed', 'contract', 'unemployed', 'retired');

-- Physical Therapists and PTAs table
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  provider_type provider_type NOT NULL,
  license_number TEXT,
  license_state TEXT,
  license_status license_status DEFAULT 'active',
  license_expiration_date DATE,
  work_settings work_setting[] DEFAULT '{}',
  employment_status employment_status,
  years_experience INTEGER,
  
  -- Contact Information
  email TEXT,
  phone TEXT,
  personal_email TEXT,
  
  -- Location
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Employment
  current_employer_id UUID,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      COALESCE(first_name, '') || ' ' || 
      COALESCE(last_name, '') || ' ' || 
      COALESCE(license_number, '') || ' ' ||
      COALESCE(city, '') || ' ' ||
      COALESCE(state, '')
    )
  ) STORED
);

-- Physical Therapy Companies/Clinics
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dba_name TEXT, -- Doing Business As
  
  -- Company Details
  company_type TEXT, -- LLC, Corporation, Partnership, etc.
  employee_count INTEGER,
  estimated_revenue BIGINT,
  founded_year INTEGER,
  specialties TEXT[],
  work_settings work_setting[] DEFAULT '{}',
  
  -- Contact Information
  website TEXT,
  phone TEXT,
  email TEXT,
  
  -- Leadership
  owner_founder TEXT,
  ceo TEXT,
  clinical_director TEXT,
  
  -- Address (HQ)
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Business Status
  is_actively_hiring BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      COALESCE(name, '') || ' ' || 
      COALESCE(dba_name, '') || ' ' ||
      COALESCE(city, '') || ' ' ||
      COALESCE(state, '') || ' ' ||
      COALESCE(owner_founder, '') || ' ' ||
      COALESCE(ceo, '')
    )
  ) STORED
);

-- Company Locations (for multi-location companies)
CREATE TABLE public.company_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  name TEXT, -- Location name/identifier
  is_headquarters BOOLEAN DEFAULT false,
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Contact
  phone TEXT,
  email TEXT,
  manager_name TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_hiring BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- PT/PTA Schools
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  
  -- School Details
  accreditation_body TEXT,
  programs_offered provider_type[] DEFAULT '{}',
  is_accredited BOOLEAN DEFAULT true,
  
  -- Contact Information
  website TEXT,
  phone TEXT,
  email TEXT,
  
  -- Leadership
  program_chair TEXT,
  program_chair_email TEXT,
  dce_name TEXT, -- Director of Clinical Education
  dce_email TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      COALESCE(name, '') || ' ' || 
      COALESCE(city, '') || ' ' ||
      COALESCE(state, '') || ' ' ||
      COALESCE(program_chair, '') || ' ' ||
      COALESCE(dce_name, '')
    )
  ) STORED
);

-- Faculty at schools
CREATE TABLE public.faculty (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  specialties TEXT[],
  is_dce BOOLEAN DEFAULT false, -- Director of Clinical Education
  is_program_chair BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Job Listings
CREATE TABLE public.job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  company_location_id UUID REFERENCES public.company_locations(id) ON DELETE CASCADE,
  
  -- Job Details
  title TEXT NOT NULL,
  description TEXT,
  position_type provider_type NOT NULL,
  work_settings work_setting[] DEFAULT '{}',
  employment_type TEXT, -- full-time, part-time, contract, per-diem
  salary_min INTEGER,
  salary_max INTEGER,
  
  -- Requirements
  experience_required TEXT,
  license_required TEXT[],
  certifications_required TEXT[],
  
  -- Location
  city TEXT,
  state TEXT,
  is_remote BOOLEAN DEFAULT false,
  
  -- Source Information
  source_platform TEXT, -- Indeed, LinkedIn, company website, etc.
  external_job_id TEXT, -- ID from the source platform
  external_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  posted_date DATE,
  expires_date DATE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_scraped_at TIMESTAMPTZ DEFAULT now(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', 
      COALESCE(title, '') || ' ' || 
      COALESCE(description, '') || ' ' ||
      COALESCE(city, '') || ' ' ||
      COALESCE(state, '')
    )
  ) STORED
);

-- Add foreign key constraint for current_employer_id
ALTER TABLE public.providers 
ADD CONSTRAINT fk_providers_current_employer 
FOREIGN KEY (current_employer_id) REFERENCES public.companies(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_providers_location ON public.providers USING GIST (
  CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
  THEN point(longitude, latitude) 
  ELSE NULL END
);

CREATE INDEX idx_companies_location ON public.companies USING GIST (
  CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
  THEN point(longitude, latitude) 
  ELSE NULL END
);

CREATE INDEX idx_company_locations_location ON public.company_locations USING GIST (
  CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
  THEN point(longitude, latitude) 
  ELSE NULL END
);

CREATE INDEX idx_schools_location ON public.schools USING GIST (
  CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL 
  THEN point(longitude, latitude) 
  ELSE NULL END
);

CREATE INDEX idx_providers_search ON public.providers USING GIN(search_vector);
CREATE INDEX idx_companies_search ON public.companies USING GIN(search_vector);
CREATE INDEX idx_schools_search ON public.schools USING GIN(search_vector);
CREATE INDEX idx_job_listings_search ON public.job_listings USING GIN(search_vector);

CREATE INDEX idx_providers_state ON public.providers(state);
CREATE INDEX idx_providers_work_settings ON public.providers USING GIN(work_settings);
CREATE INDEX idx_companies_state ON public.companies(state);
CREATE INDEX idx_job_listings_active ON public.job_listings(is_active, posted_date);
CREATE INDEX idx_job_listings_location ON public.job_listings(state, city);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users to read all data
CREATE POLICY "Authenticated users can view all providers" 
ON public.providers FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view all companies" 
ON public.companies FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view all company locations" 
ON public.company_locations FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view all schools" 
ON public.schools FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view all faculty" 
ON public.faculty FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can view all job listings" 
ON public.job_listings FOR SELECT 
TO authenticated 
USING (true);

-- RLS Policies for data modification (only allow users to modify data they created)
CREATE POLICY "Users can insert their own provider data" 
ON public.providers FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can update their own provider data" 
ON public.providers FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can insert their own company data" 
ON public.companies FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can update their own company data" 
ON public.companies FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can insert company locations for their companies" 
ON public.company_locations FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id 
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
);

CREATE POLICY "Users can update company locations for their companies" 
ON public.company_locations FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id 
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
);

CREATE POLICY "Users can insert their own school data" 
ON public.schools FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can update their own school data" 
ON public.schools FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can insert faculty for their schools" 
ON public.faculty FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.schools 
    WHERE id = school_id 
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
);

CREATE POLICY "Users can update faculty for their schools" 
ON public.faculty FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.schools 
    WHERE id = school_id 
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
);

-- Job listings can be inserted/updated by users who own the company
CREATE POLICY "Users can insert job listings for their companies" 
ON public.job_listings FOR INSERT 
TO authenticated 
WITH CHECK (
  company_id IS NULL OR EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id 
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
);

CREATE POLICY "Users can update job listings for their companies" 
ON public.job_listings FOR UPDATE 
TO authenticated 
USING (
  company_id IS NULL OR EXISTS (
    SELECT 1 FROM public.companies 
    WHERE id = company_id 
    AND (user_id = auth.uid() OR created_by = auth.uid())
  )
);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_locations_updated_at
  BEFORE UPDATE ON public.company_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at
  BEFORE UPDATE ON public.faculty
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at
  BEFORE UPDATE ON public.job_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();