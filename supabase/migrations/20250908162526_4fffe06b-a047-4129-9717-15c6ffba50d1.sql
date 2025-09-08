-- Correct PT Solutions CEO and Twin Boro acquisition details

-- Update PT Solutions CEO to Dale Yake
UPDATE companies
SET leadership = jsonb_set(
  COALESCE(leadership, '{}'::jsonb),
  '{owner_ceo}',
  to_jsonb('Dale Yake'::text),
  true
)
WHERE name = 'PT Solutions';

-- Update Twin Boro acquisition date/details and current CEO reference
UPDATE companies
SET leadership = jsonb_set(
  jsonb_set(
    jsonb_set(COALESCE(leadership, '{}'::jsonb), '{current_ceo}', to_jsonb('Dale Yake (PT Solutions CEO)'::text), true),
    '{acquisition_date}', to_jsonb('2023-10-01'::text), true
  ),
  '{acquisition_details}', to_jsonb('Acquired by PT Solutions in October 2023'::text), true
)
WHERE name = 'Twin Boro Physical Therapy';