UPDATE processing_jobs 
SET status = 'cancelled', 
    error_details = 'Job cancelled by user', 
    completed_at = now(), 
    updated_at = now() 
WHERE id = '99e69e07-5ad0-49e9-917e-e179df914122';