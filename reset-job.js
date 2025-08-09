import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvplrcqhscqcsyxuxbcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A'
);

console.log('Resetting stuck job and retriggering processor...');

// Reset the job status
const { error: updateError } = await supabase
  .from('bulk_upload_jobs')
  .update({ status: 'pending' })
  .eq('id', 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7');

if (updateError) {
  console.error('Failed to reset job:', updateError);
  process.exit(1);
}

console.log('Job status reset to pending');

// Trigger the processor
const { data, error } = await supabase.functions.invoke('process-bulk-upload', {
  body: { jobId: 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7' }
});

console.log('Processor response:', JSON.stringify(data, null, 2));
if (error) console.error('Processor error:', JSON.stringify(error, null, 2));

process.exit(0);