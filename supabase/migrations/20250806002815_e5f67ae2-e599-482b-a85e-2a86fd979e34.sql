-- Create notes table for CRM functionality
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('company', 'school', 'job_listing', 'provider')),
  entity_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID -- For future auth implementation
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (will be updated when auth is implemented)
CREATE POLICY "Public read access for notes" 
ON public.notes 
FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable update for notes" 
ON public.notes 
FOR UPDATE 
USING (true);

CREATE POLICY "Enable delete for notes" 
ON public.notes 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_notes_entity ON public.notes(entity_type, entity_id);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);