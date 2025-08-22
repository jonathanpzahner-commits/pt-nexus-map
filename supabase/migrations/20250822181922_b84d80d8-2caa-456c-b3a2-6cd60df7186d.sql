-- Create function to manually trigger company geocoding jobs
CREATE OR REPLACE FUNCTION trigger_company_geocoding()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a job to specifically geocode companies that have location data but no coordinates
  INSERT INTO processing_jobs (
    job_type,
    status,
    metadata
  ) VALUES (
    'company_geocode',
    'pending',
    jsonb_build_object(
      'table_name', 'companies',
      'batch_size', 50,
      'priority', true
    )
  );
END;
$$;