-- Fix function search path security warnings
-- Update functions to have proper search_path settings

-- Fix the consultant_companies_within_radius function
DROP FUNCTION IF EXISTS public.consultant_companies_within_radius(numeric, numeric, integer);

CREATE FUNCTION public.consultant_companies_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
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
SET search_path = 'public'
AS $$
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
$$;