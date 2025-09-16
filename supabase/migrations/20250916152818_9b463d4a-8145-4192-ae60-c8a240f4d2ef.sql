-- Add privacy settings columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{
  "contact_info": true,
  "location": true,
  "professional_info": true,
  "online_presence": true,
  "specializations": true,
  "interests": true,
  "profile_photo": true
}'::jsonb;