-- Enable pg_cron and pg_net extensions for background processing
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to automatically enrich school data every 5 minutes
SELECT cron.schedule(
  'auto-enrich-school-data',
  '*/5 * * * *', -- every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/enrich-school-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A"}'::jsonb,
        body:='{"auto_mode": true}'::jsonb
    ) as request_id;
  $$
);

-- Create a similar cron job for provider geocoding every 5 minutes
SELECT cron.schedule(
  'auto-geocode-providers',
  '*/5 * * * *', -- every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/batch-geocode-providers',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A"}'::jsonb,
        body:='{"auto_mode": true}'::jsonb
    ) as request_id;
  $$
);