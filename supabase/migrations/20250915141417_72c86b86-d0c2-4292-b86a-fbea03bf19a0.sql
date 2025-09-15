-- Create PT connections table for networking
CREATE TABLE public.pt_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, receiver_id)
);

-- Enable RLS
ALTER TABLE public.pt_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view connections they're part of" 
ON public.pt_connections 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests" 
ON public.pt_connections 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're part of" 
ON public.pt_connections 
FOR UPDATE 
USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Create user presence table for online status
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activity_status TEXT DEFAULT 'Available',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policies for presence
CREATE POLICY "Users can view all presence data" 
ON public.user_presence 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own presence" 
ON public.user_presence 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own presence" 
ON public.user_presence 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function to get user's colleagues/network
CREATE OR REPLACE FUNCTION public.get_user_colleagues(p_user_id UUID)
RETURNS TABLE(
  colleague_id UUID,
  first_name TEXT,
  last_name TEXT,
  current_position TEXT,
  current_employer TEXT,
  profile_photo_url TEXT,
  is_online BOOLEAN,
  last_seen TIMESTAMP WITH TIME ZONE,
  activity_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN c.requester_id = p_user_id THEN c.receiver_id
      ELSE c.requester_id
    END as colleague_id,
    p.first_name,
    p.last_name,
    p.current_position,
    p.current_employer,
    p.profile_photo_url,
    COALESCE(up.is_online, false) as is_online,
    up.last_seen,
    up.activity_status
  FROM pt_connections c
  JOIN profiles p ON (
    CASE 
      WHEN c.requester_id = p_user_id THEN p.user_id = c.receiver_id
      ELSE p.user_id = c.requester_id
    END
  )
  LEFT JOIN user_presence up ON up.user_id = p.user_id
  WHERE 
    (c.requester_id = p_user_id OR c.receiver_id = p_user_id)
    AND c.status = 'accepted';
END;
$$;

-- Function to update user presence
CREATE OR REPLACE FUNCTION public.update_user_presence(p_user_id UUID, p_is_online BOOLEAN, p_activity_status TEXT DEFAULT 'Available')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_presence (user_id, is_online, activity_status, last_seen, updated_at)
  VALUES (p_user_id, p_is_online, p_activity_status, now(), now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_online = p_is_online,
    activity_status = p_activity_status,
    last_seen = now(),
    updated_at = now();
END;
$$;

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_pt_connections_updated_at
BEFORE UPDATE ON public.pt_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_presence_updated_at
BEFORE UPDATE ON public.user_presence
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();