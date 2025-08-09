-- Fix storage policies for bulk uploads bucket
-- Allow service role to access storage objects
CREATE POLICY "Service role can access all objects" 
ON storage.objects 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Allow authenticated users to upload to bulk-uploads bucket
CREATE POLICY "Users can upload to bulk-uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'bulk-uploads');

-- Allow authenticated users to read from bulk-uploads bucket  
CREATE POLICY "Users can read from bulk-uploads" 
ON storage.objects 
FOR SELECT 
TO authenticated 
USING (bucket_id = 'bulk-uploads');