-- Manually trigger the edge function for the stuck job
SELECT 
  net.http_post(
    'https://bvplrcqhscqcsyxuxbcr.supabase.co/functions/v1/process-bulk-upload',
    '{"jobId": "ae601047-c2f6-4ea6-b38f-901456492e63"}',
    headers => '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A"}'::jsonb
  ) as response;