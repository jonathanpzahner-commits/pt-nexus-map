-- First, delete any notes that don't have a user_id (can't be attributed to users)
DELETE FROM public.notes WHERE user_id IS NULL;

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can view notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can insert notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can update notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can delete notes" ON public.notes;

-- Make user_id required (not nullable)
ALTER TABLE public.notes ALTER COLUMN user_id SET NOT NULL;

-- Create user-scoped RLS policies
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