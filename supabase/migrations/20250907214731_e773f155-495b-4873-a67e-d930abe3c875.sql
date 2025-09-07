-- Fix search path for existing functions that don't have it set
-- This addresses the WARN issues from the linter

-- Fix the charge_credits function
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

-- Fix the add_credits function
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