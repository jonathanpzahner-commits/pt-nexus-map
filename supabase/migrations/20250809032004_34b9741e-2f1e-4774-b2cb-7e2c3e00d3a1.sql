-- Update the older duplicate jobs to failed status instead
UPDATE bulk_upload_jobs 
SET status = 'failed', 
    error_details = '{"message": "Duplicate job - cancelled in favor of newer upload"}',
    updated_at = now() 
WHERE id IN ('2d511846-1102-467f-a123-48720fdfdfc8', '2aee3173-833a-4c9e-aaf1-39b1fd0ef863') 
  AND status = 'processing';