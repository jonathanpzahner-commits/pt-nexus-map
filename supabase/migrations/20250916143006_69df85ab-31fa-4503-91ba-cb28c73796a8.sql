-- Add detailed academic information to schools table
ALTER TABLE public.schools 
ADD COLUMN dce_info TEXT,
ADD COLUMN graduation_season TEXT,
ADD COLUMN boards_timing TEXT,
ADD COLUMN career_fair_dates TEXT[];