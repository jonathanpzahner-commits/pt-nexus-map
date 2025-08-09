import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvplrcqhscqcsyxuxbcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A'
);

console.log('🚀 EMERGENCY FIX - Resetting and processing your stuck upload NOW!');

try {
  // 1. Reset the stuck job
  console.log('Step 1: Resetting stuck job status...');
  const { error: resetError } = await supabase
    .from('bulk_upload_jobs')
    .update({ 
      status: 'pending',
      processed_rows: 0,
      successful_rows: 0,
      failed_rows: 0,
      error_details: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7');

  if (resetError) {
    console.error('❌ Reset failed:', resetError);
    throw resetError;
  }
  console.log('✅ Job reset successfully');

  // 2. Immediately trigger processor
  console.log('Step 2: Triggering processor with fixed parsing...');
  const { data, error } = await supabase.functions.invoke('process-bulk-upload', {
    body: { jobId: 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7' }
  });

  console.log('✅ Processor triggered!');
  console.log('Response:', data);
  if (error) {
    console.log('Processor error details:', error);
  }

  // 3. Monitor for 30 seconds
  console.log('Step 3: Monitoring progress...');
  for (let i = 0; i < 6; i++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const { data: jobStatus } = await supabase
      .from('bulk_upload_jobs')
      .select('*')
      .eq('id', 'bfe2b943-3203-4b26-b4c3-88a0e9b029e7')
      .single();
    
    console.log(`[${i * 5}s] Status: ${jobStatus.status}, Processed: ${jobStatus.processed_rows}, Success: ${jobStatus.successful_rows}`);
    
    if (jobStatus.status === 'completed') {
      console.log('🎉 UPLOAD COMPLETED SUCCESSFULLY!');
      break;
    } else if (jobStatus.status === 'failed') {
      console.log('❌ Upload failed:', jobStatus.error_details);
      break;
    }
  }

} catch (err) {
  console.error('🔥 Emergency fix failed:', err);
}

console.log('Emergency fix process complete.');
process.exit(0);