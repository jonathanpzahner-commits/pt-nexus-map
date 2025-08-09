UPDATE processing_jobs 
SET status = 'cancelled', 
    error_details = 'Job stalled - restarting with better error handling', 
    completed_at = now() 
WHERE id = 'dcdc15c2-9eb9-44a6-be37-e947da8463db';