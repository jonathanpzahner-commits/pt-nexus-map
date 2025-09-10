-- Test the credit management system by adding initial credit data for testing
-- This will help verify the credit system is working

-- Insert a test credit transaction (you'll need to replace the user_id with an actual auth user id when testing)
INSERT INTO credit_transactions (user_id, api_key_id, transaction_type, amount, balance_after, description, metadata) 
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, NULL, 'purchase', 1000, 1000, 'Initial test credits', '{"test": true}')
ON CONFLICT DO NOTHING;

-- Create a sample API key entry for testing (you'll need to replace user_id with actual auth user id when testing)
INSERT INTO api_keys (user_id, name, key_hash, key_prefix, is_active, permissions, rate_limit, usage_count)
VALUES 
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Test API Key', 'sample_hash', 'pk_live_test...', true, '{"read": true, "export": false}', 1000, 0)
ON CONFLICT DO NOTHING;