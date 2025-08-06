-- Create a stored procedure for radius search
CREATE OR REPLACE FUNCTION providers_within_radius(
  user_lat DECIMAL,
  user_lng DECIMAL, 
  radius_miles DECIMAL
) RETURNS TABLE (
  id UUID,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  city TEXT,
  state TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  specializations TEXT[],
  bio TEXT,
  distance_miles DECIMAL
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE sql AS $$
  SELECT 
    p.id,
    p.name,
    p.first_name,
    p.last_name,
    p.city,
    p.state,
    p.latitude,
    p.longitude,
    p.specializations,
    p.bio,
    calculate_distance(user_lat, user_lng, p.latitude, p.longitude) * 0.621371 as distance_miles
  FROM providers p
  WHERE p.latitude IS NOT NULL 
    AND p.longitude IS NOT NULL
    AND calculate_distance(user_lat, user_lng, p.latitude, p.longitude) * 0.621371 <= radius_miles
  ORDER BY distance_miles;
$$;