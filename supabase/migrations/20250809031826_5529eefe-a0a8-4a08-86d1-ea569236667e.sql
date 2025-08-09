-- Enable real-time updates for bulk upload jobs
ALTER TABLE bulk_upload_jobs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE bulk_upload_jobs;