-- Create CRM tables for comprehensive customer relationship management

-- Contacts table for all CRM contacts
CREATE TABLE public.crm_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  title TEXT,
  contact_type TEXT NOT NULL DEFAULT 'lead', -- lead, prospect, customer, partner
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, archived
  lead_source TEXT,
  industry TEXT,
  website TEXT,
  linkedin_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  last_contact_date TIMESTAMP WITH TIME ZONE,
  next_follow_up_date TIMESTAMP WITH TIME ZONE,
  lifetime_value NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Deals/Opportunities table
CREATE TABLE public.crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC NOT NULL DEFAULT 0,
  stage TEXT NOT NULL DEFAULT 'prospecting', -- prospecting, qualification, proposal, negotiation, closed_won, closed_lost
  probability INTEGER DEFAULT 50, -- 0-100
  expected_close_date DATE,
  actual_close_date DATE,
  lead_source TEXT,
  next_action TEXT,
  next_action_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activities table for tracking interactions
CREATE TABLE public.crm_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- call, email, meeting, note, task
  subject TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'completed', -- completed, scheduled, cancelled
  activity_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  duration_minutes INTEGER,
  outcome TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Companies table for CRM (separate from main companies)
CREATE TABLE public.crm_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  description TEXT,
  linkedin_url TEXT,
  annual_revenue NUMERIC,
  employee_count INTEGER,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, archived
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all CRM tables
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;

-- RLS policies for crm_contacts
CREATE POLICY "Users can view their own contacts"
ON public.crm_contacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contacts"
ON public.crm_contacts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contacts"
ON public.crm_contacts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts"
ON public.crm_contacts FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for crm_deals
CREATE POLICY "Users can view their own deals"
ON public.crm_deals FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deals"
ON public.crm_deals FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals"
ON public.crm_deals FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals"
ON public.crm_deals FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for crm_activities
CREATE POLICY "Users can view their own activities"
ON public.crm_activities FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
ON public.crm_activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
ON public.crm_activities FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
ON public.crm_activities FOR DELETE
USING (auth.uid() = user_id);

-- RLS policies for crm_companies
CREATE POLICY "Users can view their own CRM companies"
ON public.crm_companies FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CRM companies"
ON public.crm_companies FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CRM companies"
ON public.crm_companies FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CRM companies"
ON public.crm_companies FOR DELETE
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_crm_contacts_updated_at
BEFORE UPDATE ON public.crm_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_deals_updated_at
BEFORE UPDATE ON public.crm_deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_activities_updated_at
BEFORE UPDATE ON public.crm_activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crm_companies_updated_at
BEFORE UPDATE ON public.crm_companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();