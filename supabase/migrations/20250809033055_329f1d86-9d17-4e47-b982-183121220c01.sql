-- Reset the job and trigger a fresh restart
UPDATE bulk_upload_jobs 
SET status = 'pending', updated_at = now()
WHERE id = 'ae601047-c2f6-4ea6-b38f-901456492e63';