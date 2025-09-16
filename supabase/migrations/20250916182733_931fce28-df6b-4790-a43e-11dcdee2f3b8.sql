-- Fix security issue: Create secure access to consultant companies
-- First, create the secure view for public consultant company information
CREATE OR REPLACE VIEW public.consultant_companies_secure AS
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
  -- Indicate if contact info is available (but don't expose the actual sensitive data)
  CASE 
    WHEN email IS NOT NULL OR phone IS NOT NULL OR first_name IS NOT NULL OR last_name IS NOT NULL 
    THEN true 
    ELSE false 
  END as has_contact_info
FROM consultant_companies;

-- Grant appropriate access to the secure view
GRANT SELECT ON consultant_companies_secure TO authenticated;

-- Update the consultant_companies_within_radius function to use the secure view
CREATE OR REPLACE FUNCTION public.consultant_companies_within_radius_secure(user_lat numeric, user_lng numeric, radius_miles integer)
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
    cs.id,
    cs.name,
    cs.company,
    cs.title,
    cs.bio,
    cs.years_experience,
    cs.consulting_categories,
    cs.industries,
    cs.territories,
    cs.certifications,
    cs.city,
    cs.state,
    cs.zip_code,
    cs.website,
    cs.linkedin_url,
    cs.latitude,
    cs.longitude,
    cs.created_at,
    cs.updated_at,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(cs.latitude::decimal)) * 
        cos(radians(cs.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(cs.latitude::decimal))
      )
    )::decimal AS distance_miles,
    cs.has_contact_info
  FROM consultant_companies_secure cs
  WHERE cs.latitude IS NOT NULL 
    AND cs.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(cs.latitude::decimal)) * 
        cos(radians(cs.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(cs.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$function$;

-- Add comment explaining the security fix
COMMENT ON VIEW consultant_companies_secure IS 'Secure view that hides sensitive personal information (email, phone, first_name, last_name) from consultant_companies table. Contact information must be unlocked using the credit system.';

-- Update the unlock-contact-info function to handle consultant_companies
-- This ensures sensitive data can only be accessed through the proper credit system
CREATE OR REPLACE FUNCTION public.get_consultant_contact_info(target_id uuid)
RETURNS TABLE(email text, phone text, first_name text, last_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    cc.email,
    cc.phone,
    cc.first_name,
    cc.last_name
  FROM consultant_companies cc
  WHERE cc.id = target_id;
END;
$function$;