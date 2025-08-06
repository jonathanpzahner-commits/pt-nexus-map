UPDATE processing_jobs 
SET 
  status = 'failed',
  error_details = 'Memory limit exceeded during NPI file download. The 7GB NPI database file is too large for edge function processing.',
  updated_at = now(),
  completed_at = now()
WHERE id = '6ac57a79-261f-4a86-bda5-8df63d495cc3' AND status = 'running';