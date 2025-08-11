-- Fix all missing database columns for search and geocoding functionality

-- Add missing coordinate and zip_code columns to schools table
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS zip_code text;

-- Add missing coordinate and zip_code columns to job_listings table  
ALTER TABLE public.job_listings
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS zip_code text;

-- Create radius search function for schools
CREATE OR REPLACE FUNCTION public.schools_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
RETURNS TABLE(
  id uuid, 
  name text, 
  city text, 
  state text, 
  zip_code text,
  description text,
  programs_offered text[],
  specializations text[],
  latitude numeric, 
  longitude numeric, 
  distance_miles numeric
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.city,
    s.state,
    s.zip_code,
    s.description,
    s.programs_offered,
    s.specializations,
    s.latitude,
    s.longitude,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(s.latitude::decimal)) * 
        cos(radians(s.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(s.latitude::decimal))
      )
    )::decimal AS distance_miles
  FROM schools s
  WHERE s.latitude IS NOT NULL 
    AND s.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(s.latitude::decimal)) * 
        cos(radians(s.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(s.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$function$;

-- Create radius search function for job_listings
CREATE OR REPLACE FUNCTION public.job_listings_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  city text,
  state text,
  zip_code text,
  employment_type text,
  experience_level text,
  salary_min integer,
  salary_max integer,
  is_remote boolean,
  latitude numeric,
  longitude numeric,
  distance_miles numeric
)
LANGUAGE plpgsql
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    jl.id,
    jl.title,
    jl.description,
    jl.city,
    jl.state,
    jl.zip_code,
    jl.employment_type,
    jl.experience_level,
    jl.salary_min,
    jl.salary_max,
    jl.is_remote,
    jl.latitude,
    jl.longitude,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(jl.latitude::decimal)) * 
        cos(radians(jl.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(jl.latitude::decimal))
      )
    )::decimal AS distance_miles
  FROM job_listings jl
  WHERE jl.latitude IS NOT NULL 
    AND jl.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(jl.latitude::decimal)) * 
        cos(radians(jl.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(jl.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$function$;

-- Add auto-geocoding triggers for schools
CREATE TRIGGER auto_geocode_schools_trigger
  AFTER INSERT OR UPDATE ON public.schools
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_geocode_record();

-- Add auto-geocoding triggers for job_listings  
CREATE TRIGGER auto_geocode_job_listings_trigger
  AFTER INSERT OR UPDATE ON public.job_listings
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_geocode_record();