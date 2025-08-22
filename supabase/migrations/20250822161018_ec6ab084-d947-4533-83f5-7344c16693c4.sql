-- Fix critical privacy issue: Make notes private to each user
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can insert notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can update notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can delete notes" ON public.notes;

-- Create user-scoped privacy policies
CREATE POLICY "Users can view their own notes" 
ON public.notes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" 
ON public.notes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" 
ON public.notes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Ensure user_id cannot be null for data integrity
ALTER TABLE public.notes ALTER COLUMN user_id SET NOT NULL;