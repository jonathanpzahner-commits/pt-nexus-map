-- Create a processing job specifically for company geocoding
INSERT INTO processing_jobs (
  job_type,
  status,
  metadata
) VALUES (
  'company_geocode',
  'pending',
  jsonb_build_object(
    'table_name', 'companies',
    'batch_size', 100,
    'total_records', 23888,
    'description', 'Geocoding all company addresses'
  )
);