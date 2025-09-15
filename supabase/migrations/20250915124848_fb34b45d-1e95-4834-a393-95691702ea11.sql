-- Enable pg_cron and pg_net extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job that runs every 3 minutes to geocode companies
SELECT cron.schedule(
  'auto-geocode-companies',
  '*/3 * * * *', -- Every 3 minutes
  $$
  SELECT
    net.http_post(
        url:='https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/geocode-companies',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A"}'::jsonb,
        body:='{"batch_size": 20, "background_mode": true}'::jsonb
    ) as request_id;
  $$
);

-- Create a function to check geocoding progress
CREATE OR REPLACE FUNCTION get_geocoding_progress()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_companies INTEGER;
  geocoded_companies INTEGER;
  remaining_companies INTEGER;
  progress_percentage NUMERIC;
BEGIN
  -- Get total companies
  SELECT COUNT(*) INTO total_companies FROM companies;
  
  -- Get geocoded companies
  SELECT COUNT(*) INTO geocoded_companies 
  FROM companies 
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
  
  -- Calculate remaining and percentage
  remaining_companies := total_companies - geocoded_companies;
  progress_percentage := CASE 
    WHEN total_companies > 0 THEN ROUND((geocoded_companies::numeric / total_companies::numeric) * 100, 2)
    ELSE 0 
  END;
  
  RETURN jsonb_build_object(
    'total', total_companies,
    'geocoded', geocoded_companies,
    'remaining', remaining_companies,
    'percentage', progress_percentage,
    'last_updated', now()
  );
END;
$$;