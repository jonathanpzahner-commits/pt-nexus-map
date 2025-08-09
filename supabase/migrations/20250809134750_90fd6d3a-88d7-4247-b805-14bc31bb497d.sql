-- Create radius search functions for all entity types that have location data

-- Function for companies within radius
CREATE OR REPLACE FUNCTION companies_within_radius(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles INTEGER
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  company_type TEXT,
  description TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  founded_year INTEGER,
  employee_count INTEGER,
  company_locations TEXT[],
  services TEXT[],
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.*,
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
$$ LANGUAGE plpgsql;

-- Function for consultant companies within radius
CREATE OR REPLACE FUNCTION consultant_companies_within_radius(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles INTEGER
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  company TEXT,
  title TEXT,
  bio TEXT,
  years_experience INTEGER,
  consulting_categories TEXT[],
  industries TEXT[],
  territories TEXT[],
  certifications TEXT[],
  linkedin_url TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cc.*,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(cc.latitude::decimal)) * 
        cos(radians(cc.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(cc.latitude::decimal))
      )
    )::decimal AS distance_miles
  FROM consultant_companies cc
  WHERE cc.latitude IS NOT NULL 
    AND cc.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(cc.latitude::decimal)) * 
        cos(radians(cc.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(cc.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Function for equipment companies within radius
CREATE OR REPLACE FUNCTION equipment_companies_within_radius(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles INTEGER
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  company_type TEXT,
  description TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  founded_year INTEGER,
  employee_count INTEGER,
  equipment_categories TEXT[],
  product_lines TEXT[],
  target_markets TEXT[],
  certifications TEXT[],
  linkedin_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ec.*,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(ec.latitude::decimal)) * 
        cos(radians(ec.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(ec.latitude::decimal))
      )
    )::decimal AS distance_miles
  FROM equipment_companies ec
  WHERE ec.latitude IS NOT NULL 
    AND ec.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(ec.latitude::decimal)) * 
        cos(radians(ec.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(ec.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;

-- Function for PE firms within radius
CREATE OR REPLACE FUNCTION pe_firms_within_radius(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_miles INTEGER
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  firm_type TEXT,
  description TEXT,
  website TEXT,
  founded_year INTEGER,
  total_aum NUMERIC,
  healthcare_focus BOOLEAN,
  typical_deal_size_min NUMERIC,
  typical_deal_size_max NUMERIC,
  investment_stage TEXT[],
  geographic_focus TEXT[],
  sector_focus TEXT[],
  portfolio_companies TEXT[],
  key_contacts JSONB,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  phone TEXT,
  email TEXT,
  linkedin_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  distance_miles DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pf.*,
    (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(pf.latitude::decimal)) * 
        cos(radians(pf.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(pf.latitude::decimal))
      )
    )::decimal AS distance_miles
  FROM pe_firms pf
  WHERE pf.latitude IS NOT NULL 
    AND pf.longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(user_lat)) * 
        cos(radians(pf.latitude::decimal)) * 
        cos(radians(pf.longitude::decimal) - radians(user_lng)) + 
        sin(radians(user_lat)) * 
        sin(radians(pf.latitude::decimal))
      )
    ) <= radius_miles
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql;