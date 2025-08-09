import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvplrcqhscqcsyxuxbcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A'
);

console.log('Triggering bulk upload processor with memory fix...');

const { data, error } = await supabase.functions.invoke('process-bulk-upload', {
  body: { jobId: 'ae601047-c2f6-4ea6-b38f-901456492e63' }
});

console.log('Response:', data);
if (error) console.error('Error:', error);

process.exit(0);