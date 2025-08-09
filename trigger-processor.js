// Manual trigger script for bulk upload processor
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvplrcqhscqcsyxuxbcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A'
);

async function triggerProcessor() {
  console.log('Manually triggering processor for job: ae601047-c2f6-4ea6-b38f-901456492e63');
  
  try {
    const { data, error } = await supabase.functions.invoke('process-bulk-upload', {
      body: { jobId: 'ae601047-c2f6-4ea6-b38f-901456492e63' }
    });
    
    console.log('Trigger response:', data);
    if (error) console.error('Trigger error:', error);
  } catch (err) {
    console.error('Exception:', err);
  }
}

triggerProcessor().then(() => {
  console.log('Trigger completed');
  process.exit(0);
}).catch(err => {
  console.error('Trigger failed:', err);
  process.exit(1);
});