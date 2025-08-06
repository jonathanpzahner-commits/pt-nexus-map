-- Update the stuck NPI job to failed status with timeout error
UPDATE processing_jobs 
SET 
  status = 'failed',
  error_details = 'Edge function timeout - NPI file too large for edge function processing (7GB file exceeds execution limits)',
  updated_at = now(),
  completed_at = now()
WHERE id = '6979d36e-70e9-491b-a4c6-be48232d9b69' 
  AND status = 'running';