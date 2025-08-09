import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvplrcqhscqcsyxuxbcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A'
);

console.log('Triggering bulk upload processor with memory fix...');

const { data, error } = await supabase.functions.invoke('process-bulk-upload', {
  body: { jobId: 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7' }
});

console.log('Response:', JSON.stringify(data, null, 2));
console.log('Error:', JSON.stringify(error, null, 2));

// Check if there's a timeout issue
setTimeout(async () => {
  const { data: jobData } = await supabase
    .from('bulk_upload_jobs')
    .select('*')
    .eq('id', 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7')
    .single();
  
  console.log('Job status after 10 seconds:', jobData);
}, 10000);

process.exit(0);