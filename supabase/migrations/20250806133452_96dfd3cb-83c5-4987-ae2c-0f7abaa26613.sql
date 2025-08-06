-- Create storage bucket for bulk uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('bulk-uploads', 'bulk-uploads', false);

-- Create policies for bulk upload files
CREATE POLICY "Users can upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'bulk-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'bulk-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'bulk-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table to track bulk upload jobs
CREATE TABLE public.bulk_upload_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('providers', 'companies', 'schools', 'job_listings')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_rows INTEGER,
  processed_rows INTEGER DEFAULT 0,
  successful_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  error_details JSONB,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bulk upload jobs
ALTER TABLE public.bulk_upload_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for bulk upload jobs
CREATE POLICY "Users can view their own upload jobs" 
ON public.bulk_upload_jobs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own upload jobs" 
ON public.bulk_upload_jobs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own upload jobs" 
ON public.bulk_upload_jobs 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_bulk_upload_jobs_updated_at
BEFORE UPDATE ON public.bulk_upload_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();