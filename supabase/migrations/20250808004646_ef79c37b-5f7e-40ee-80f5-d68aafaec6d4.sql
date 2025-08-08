-- Create equipment_companies table
CREATE TABLE public.equipment_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_type TEXT NOT NULL DEFAULT 'Equipment Manufacturer',
  description TEXT,
  website TEXT,
  founded_year INTEGER,
  employee_count INTEGER,
  equipment_categories TEXT[] DEFAULT '{}',
  product_lines TEXT[] DEFAULT '{}',
  target_markets TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  email TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales_consultants table
CREATE TABLE public.sales_consultants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  specializations TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  territories TEXT[] DEFAULT '{}',
  years_experience INTEGER,
  bio TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  website TEXT,
  linkedin_url TEXT,
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pe_firms table
CREATE TABLE public.pe_firms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  firm_type TEXT NOT NULL DEFAULT 'Private Equity',
  description TEXT,
  website TEXT,
  founded_year INTEGER,
  total_aum NUMERIC,
  healthcare_focus BOOLEAN DEFAULT false,
  investment_stage TEXT[] DEFAULT '{}',
  typical_deal_size_min NUMERIC,
  typical_deal_size_max NUMERIC,
  geographic_focus TEXT[] DEFAULT '{}',
  sector_focus TEXT[] DEFAULT '{}',
  portfolio_companies TEXT[] DEFAULT '{}',
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  phone TEXT,
  email TEXT,
  linkedin_url TEXT,
  key_contacts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all new tables
ALTER TABLE public.equipment_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pe_firms ENABLE ROW LEVEL SECURITY;

-- Create policies for equipment_companies
CREATE POLICY "Equipment companies are viewable by everyone" 
ON public.equipment_companies 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for equipment companies" 
ON public.equipment_companies 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for equipment companies" 
ON public.equipment_companies 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for equipment companies" 
ON public.equipment_companies 
FOR DELETE 
USING (true);

-- Create policies for sales_consultants
CREATE POLICY "Sales consultants are viewable by everyone" 
ON public.sales_consultants 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for sales consultants" 
ON public.sales_consultants 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for sales consultants" 
ON public.sales_consultants 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for sales consultants" 
ON public.sales_consultants 
FOR DELETE 
USING (true);

-- Create policies for pe_firms
CREATE POLICY "PE firms are viewable by everyone" 
ON public.pe_firms 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for pe firms" 
ON public.pe_firms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for pe firms" 
ON public.pe_firms 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for pe firms" 
ON public.pe_firms 
FOR DELETE 
USING (true);

-- Create triggers for updating timestamps
CREATE TRIGGER update_equipment_companies_updated_at
  BEFORE UPDATE ON public.equipment_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_consultants_updated_at
  BEFORE UPDATE ON public.sales_consultants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pe_firms_updated_at
  BEFORE UPDATE ON public.pe_firms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();