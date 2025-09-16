-- Fix the profiles table RLS policy to respect privacy settings
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a secure function to check privacy settings
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_row profiles)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result jsonb := '{}';
  privacy_settings jsonb;
BEGIN
  -- Get privacy settings, default to private if null
  privacy_settings := COALESCE(profile_row.privacy_settings, '{"profile_photo": false, "contact_info": false, "location": false, "professional_info": false, "online_presence": false, "specializations": false, "interests": false}');
  
  -- Always include basic info
  result := jsonb_build_object(
    'id', profile_row.id,
    'user_id', profile_row.user_id,
    'first_name', profile_row.first_name,
    'last_name', profile_row.last_name,
    'created_at', profile_row.created_at,
    'updated_at', profile_row.updated_at,
    'is_public', profile_row.is_public,
    'available_for_mentoring', profile_row.available_for_mentoring,
    'available_for_collaboration', profile_row.available_for_collaboration
  );
  
  -- Add fields based on privacy settings
  IF (privacy_settings->>'profile_photo')::boolean = true THEN
    result := result || jsonb_build_object('profile_photo_url', profile_row.profile_photo_url);
  END IF;
  
  IF (privacy_settings->>'location')::boolean = true THEN
    result := result || jsonb_build_object(
      'location', profile_row.location,
      'city', profile_row.city,
      'state', profile_row.state
    );
  END IF;
  
  IF (privacy_settings->>'professional_info')::boolean = true THEN
    result := result || jsonb_build_object(
      'current_position', profile_row.current_position,
      'current_employer', profile_row.current_employer,
      'years_experience', profile_row.years_experience,
      'education', profile_row.education,
      'certifications', profile_row.certifications
    );
  END IF;
  
  IF (privacy_settings->>'online_presence')::boolean = true THEN
    result := result || jsonb_build_object(
      'linkedin_url', profile_row.linkedin_url,
      'website', profile_row.website
    );
  END IF;
  
  IF (privacy_settings->>'specializations')::boolean = true THEN
    result := result || jsonb_build_object(
      'specializations', profile_row.specializations,
      'sme_areas', profile_row.sme_areas
    );
  END IF;
  
  IF (privacy_settings->>'interests')::boolean = true THEN
    result := result || jsonb_build_object(
      'interests', profile_row.interests,
      'research_interests', profile_row.research_interests,
      'about_me', profile_row.about_me
    );
  END IF;
  
  -- NEVER include contact info in public view - always require credits
  -- email, phone are always private
  
  RETURN result;
END;
$$;

-- Create new RLS policy that respects privacy settings
CREATE POLICY "Public profiles respect privacy settings" 
ON public.profiles 
FOR SELECT 
USING (
  is_public = true AND (
    auth.uid() = user_id OR -- Users can always see their own profile
    auth.uid() IS NOT NULL  -- Authenticated users can see public profiles (with privacy filtering)
  )
);

-- Users can still view their own complete profile
CREATE POLICY "Users can view their own complete profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Hide contact information from other business tables
UPDATE public.consultant_companies SET email = NULL, phone = NULL WHERE email IS NOT NULL OR phone IS NOT NULL;
UPDATE public.equipment_companies SET email = NULL, phone = NULL WHERE email IS NOT NULL OR phone IS NOT NULL;
UPDATE public.pe_firms SET email = NULL, phone = NULL WHERE email IS NOT NULL OR phone IS NOT NULL;

-- Create table to track contact info access
CREATE TABLE IF NOT EXISTS public.contact_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  target_user_id UUID,
  target_entity_id UUID,
  target_entity_type TEXT NOT NULL,
  credits_charged INTEGER NOT NULL DEFAULT 1,
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact access logs
ALTER TABLE public.contact_access_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact access logs
CREATE POLICY "Users can view their own contact access logs" 
ON public.contact_access_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert contact access logs" 
ON public.contact_access_logs 
FOR INSERT 
WITH CHECK (true);

-- Add credits column to user_credits if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_credits' AND column_name = 'balance') THEN
        ALTER TABLE public.user_credits ADD COLUMN balance INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;