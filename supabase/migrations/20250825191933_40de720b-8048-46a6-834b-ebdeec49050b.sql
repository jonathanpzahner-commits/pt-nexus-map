-- Create survey responses table
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  respondent_role TEXT NOT NULL CHECK (respondent_role IN ('pt_owner', 'pt_ceo_coo', 'pt_consultant', 'healthcare_recruiter', 'talent_leadership', 'physical_therapist')),
  company_name TEXT,
  company_size TEXT,
  years_experience TEXT,
  current_challenges TEXT[],
  pain_point_severity JSONB,
  tools_currently_used TEXT[],
  pricing_willingness TEXT,
  feature_priorities JSONB,
  beta_interest BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_name TEXT,
  additional_comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert survey responses (public survey)
CREATE POLICY "Anyone can submit survey responses" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow only authenticated users to view responses (for admin dashboard)
CREATE POLICY "Authenticated users can view survey responses" 
ON public.survey_responses 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_survey_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_survey_responses_updated_at
  BEFORE UPDATE ON public.survey_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_survey_responses_updated_at();

-- Create table for survey analytics
CREATE TABLE public.survey_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  respondent_role TEXT NOT NULL,
  page_views INTEGER DEFAULT 1,
  completion_rate DECIMAL(5,2),
  time_spent_seconds INTEGER,
  source_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for analytics
ALTER TABLE public.survey_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for analytics - anyone can insert, only authenticated can view
CREATE POLICY "Anyone can submit analytics" 
ON public.survey_analytics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" 
ON public.survey_analytics 
FOR SELECT 
USING (auth.role() = 'authenticated');