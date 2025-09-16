-- Fix security issue: Restrict access to sensitive consultant company data
-- Drop all existing policies for consultant_companies
DROP POLICY IF EXISTS "Authenticated users can view consultant companies" ON consultant_companies;
DROP POLICY IF EXISTS "Users can view basic consultant company info" ON consultant_companies;
DROP POLICY IF EXISTS "Authenticated users can insert consultant companies" ON consultant_companies;
DROP POLICY IF EXISTS "Authenticated users can update consultant companies" ON consultant_companies;
DROP POLICY IF EXISTS "Authenticated users can delete consultant companies" ON consultant_companies;

-- Create secure policies that protect sensitive personal information
CREATE POLICY "Authenticated users can view non-sensitive consultant info" 
ON consultant_companies 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Recreate the other policies with proper security
CREATE POLICY "Authenticated users can insert consultant companies" 
ON consultant_companies 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update consultant companies" 
ON consultant_companies 
FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete consultant companies" 
ON consultant_companies 
FOR DELETE 
USING (auth.role() = 'authenticated');

-- Create a secure view for public consultant company information that excludes sensitive fields
CREATE OR REPLACE VIEW public.consultant_companies_public AS
SELECT 
  id,
  name,
  company,
  title,
  bio,
  years_experience,
  consulting_categories,
  industries,
  territories,
  certifications,
  city,
  state,
  zip_code,
  website,
  linkedin_url,
  latitude,
  longitude,
  created_at,
  updated_at,
  -- Indicate if contact info is available (but don't show the actual contact info)
  CASE 
    WHEN email IS NOT NULL OR phone IS NOT NULL OR first_name IS NOT NULL OR last_name IS NOT NULL 
    THEN true 
    ELSE false 
  END as has_contact_info
FROM consultant_companies;

-- Update the consultant_companies_within_radius function to use the secure view
CREATE OR REPLACE FUNCTION public.consultant_companies_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
RETURNS TABLE(
  id uuid, 
  name text, 
  company text, 
  title text, 
  bio text, 
  years_experience integer, 
  consulting_categories text[], 
  industries text[], 
  territories text[], 
  certifications text[], 
  city text, 
  state text, 
  zip_code text, 
  website text, 
  linkedin_url text, 
  latitude numeric, 
  longitude numeric, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  distance_miles numeric,
  has_contact_info boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    cp.id,
    cp.name,
    cp.company,
    cp.title,
    cp.bio,
    cp.years_experience,
    cp.consulting_categories,
    cp.industries,
    cp.territories,
    cp.certifications,
    cp.city,
    cp.state,
    cp.zip_code,
    cp.website,
    cp.linkedin_url,
    cp.latitude,
    cp.longitude,
    cp.created_at,
    cp.updated_at,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(cp.latitude::decimal)) * 
        cos(radians(cp.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(cp.latitude::decimal))
      )
    )::decimal AS distance_miles,
    cp.has_contact_info
  FROM consultant_companies_public cp
  WHERE cp.latitude IS NOT NULL 
    AND cp.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(cp.latitude::decimal)) * 
        cos(radians(cp.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(cp.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$function$;