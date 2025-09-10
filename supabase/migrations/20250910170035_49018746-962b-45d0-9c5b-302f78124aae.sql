-- Fix companies_within_radius function to return correct types
DROP FUNCTION IF EXISTS companies_within_radius(numeric, numeric, integer);

CREATE OR REPLACE FUNCTION companies_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
RETURNS TABLE(
  id uuid, 
  name text, 
  company_type text, 
  description text, 
  website text, 
  address text, 
  city text, 
  state text, 
  zip_code text, 
  founded_year integer, 
  company_locations text[], 
  services text[], 
  latitude numeric, 
  longitude numeric, 
  created_at timestamp with time zone, 
  updated_at timestamp with time zone, 
  distance_miles numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.company_type,
    c.description,
    c.website,
    c.address,
    c.city,
    c.state,
    c.zip_code,
    c.founded_year,
    c.company_locations,
    c.services,
    c.latitude,
    c.longitude,
    c.created_at,
    c.updated_at,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(c.latitude::decimal)) * 
        cos(radians(c.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(c.latitude::decimal))
      )
    )::decimal AS distance_miles
  FROM companies c
  WHERE c.latitude IS NOT NULL 
    AND c.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(c.latitude::decimal)) * 
        cos(radians(c.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(c.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$$;