-- Create API keys table for external system authentication
CREATE TABLE public.api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL, -- For display purposes (e.g., "pk_live_abc...")
  is_active BOOLEAN NOT NULL DEFAULT true,
  permissions JSONB NOT NULL DEFAULT '{"read": true, "export": false}'::jsonb,
  rate_limit INTEGER NOT NULL DEFAULT 1000, -- requests per hour
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER NOT NULL DEFAULT 0
);

-- Create credits table to track user credits
CREATE TABLE public.user_credits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0,
  total_purchased INTEGER NOT NULL DEFAULT 0,
  total_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund')),
  amount INTEGER NOT NULL, -- positive for credits added, negative for credits used
  balance_after INTEGER NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create API usage logs table
CREATE TABLE public.api_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  api_key_id UUID NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  credits_charged INTEGER NOT NULL DEFAULT 0,
  request_metadata JSONB DEFAULT '{}'::jsonb,
  response_status INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for api_keys
CREATE POLICY "Users can view their own API keys" ON public.api_keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys" ON public.api_keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys" ON public.api_keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys" ON public.api_keys
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for user_credits
CREATE POLICY "Users can view their own credits" ON public.user_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON public.user_credits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert credits" ON public.user_credits
  FOR INSERT WITH CHECK (true);

-- RLS policies for credit_transactions
CREATE POLICY "Users can view their own credit transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert credit transactions" ON public.credit_transactions
  FOR INSERT WITH CHECK (true);

-- RLS policies for api_usage_logs
CREATE POLICY "Users can view their own API usage logs" ON public.api_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert API usage logs" ON public.api_usage_logs
  FOR INSERT WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON public.api_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to charge credits
CREATE OR REPLACE FUNCTION public.charge_credits(
  p_user_id UUID,
  p_api_key_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance 
  FROM user_credits 
  WHERE user_id = p_user_id;
  
  -- If no credits record exists, create one
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) VALUES (p_user_id, 0);
    current_balance := 0;
  END IF;
  
  -- Check if user has enough credits
  IF current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate new balance
  new_balance := current_balance - p_amount;
  
  -- Update credits
  UPDATE user_credits 
  SET 
    balance = new_balance,
    total_spent = total_spent + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id,
    api_key_id,
    transaction_type,
    amount,
    balance_after,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_api_key_id,
    'usage',
    -p_amount,
    new_balance,
    p_description,
    p_metadata
  );
  
  RETURN TRUE;
END;
$$;

-- Create function to add credits (for purchases)
CREATE OR REPLACE FUNCTION public.add_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
  new_balance INTEGER;
BEGIN
  -- Get current balance or create record
  SELECT balance INTO current_balance 
  FROM user_credits 
  WHERE user_id = p_user_id;
  
  IF current_balance IS NULL THEN
    INSERT INTO user_credits (user_id, balance) VALUES (p_user_id, 0);
    current_balance := 0;
  END IF;
  
  -- Calculate new balance
  new_balance := current_balance + p_amount;
  
  -- Update credits
  UPDATE user_credits 
  SET 
    balance = new_balance,
    total_purchased = total_purchased + p_amount,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Log transaction
  INSERT INTO credit_transactions (
    user_id,
    transaction_type,
    amount,
    balance_after,
    description,
    metadata
  ) VALUES (
    p_user_id,
    'purchase',
    p_amount,
    new_balance,
    p_description,
    p_metadata
  );
  
  RETURN TRUE;
END;
$$;