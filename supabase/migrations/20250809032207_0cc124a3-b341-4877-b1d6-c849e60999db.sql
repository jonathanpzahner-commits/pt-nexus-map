-- Reset the stuck job to restart processing with the memory-optimized code
UPDATE bulk_upload_jobs 
SET status = 'pending',
    processed_rows = 0,
    total_rows = NULL,
    error_details = NULL
WHERE id = 'ae601047-c2f6-4ea6-b38f-901456492e63' 
  AND status = 'processing';