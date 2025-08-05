-- Re-create all database tables to ensure proper type generation

-- Physical therapists table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_state TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  phone TEXT,
  email TEXT,
  website TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schools table  
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  accreditation TEXT,
  program_length_months INTEGER,
  tuition_per_year DECIMAL(10,2),
  average_class_size INTEGER,
  programs_offered TEXT[] DEFAULT '{}',
  faculty_count INTEGER,
  specializations TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_type TEXT NOT NULL,
  description TEXT,
  employee_count INTEGER,
  founded_year INTEGER,
  website TEXT,
  company_locations TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job listings table
CREATE TABLE IF NOT EXISTS public.job_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company_id UUID REFERENCES public.companies(id),
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  employment_type TEXT DEFAULT 'Full-time',
  experience_level TEXT,
  is_remote BOOLEAN DEFAULT false,
  posted_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (since this is a mapping platform)
CREATE POLICY "Public read access for providers" ON public.providers FOR SELECT USING (true);
CREATE POLICY "Public read access for schools" ON public.schools FOR SELECT USING (true);  
CREATE POLICY "Public read access for companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read access for job_listings" ON public.job_listings FOR SELECT USING (true);