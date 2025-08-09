-- Emergency fix: Update stuck job status
UPDATE bulk_upload_jobs 
SET status = 'pending', 
    updated_at = now()
WHERE id = 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7' AND status = 'processing';