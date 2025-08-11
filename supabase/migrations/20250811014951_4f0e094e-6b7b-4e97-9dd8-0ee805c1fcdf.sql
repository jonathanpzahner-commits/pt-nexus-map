-- Fix security warnings by setting search_path for all functions

-- Update existing functions to set search_path
ALTER FUNCTION public.calculate_distance(lat1 numeric, lon1 numeric, lat2 numeric, lon2 numeric) 
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.providers_within_radius(user_lat numeric, user_lng numeric, radius_miles numeric)
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.companies_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.consultant_companies_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.equipment_companies_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.pe_firms_within_radius(user_lat numeric, user_lng numeric, radius_miles integer)
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.auto_geocode_record()
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.process_geocoding_jobs()
SECURITY DEFINER SET search_path TO 'public';

ALTER FUNCTION public.update_updated_at_column()
SECURITY DEFINER SET search_path TO 'public';

-- Update the newly created functions to be secure
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
SECURITY DEFINER
SET search_path TO 'public'
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
SECURITY DEFINER
SET search_path TO 'public'
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