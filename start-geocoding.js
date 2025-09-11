import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bvplrcqhscqcsyxuxbcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cGxyY3Foc2NxY3N5eHV4YmNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTY3MjMsImV4cCI6MjA2OTk5MjcyM30.p014EfRjXwhD7o0yyISu7eBisJ4bz0-7dWau4usD75A'
);

console.log('🚀 Starting background geocoding for remaining providers...');

async function startBackgroundGeocoding() {
  try {
    const { data, error } = await supabase.functions.invoke('background-geocode-runner');
    
    if (error) {
      console.error('❌ Error starting background geocoding:', error);
      return false;
    }
    
    console.log('✅ Background geocoding started:', data);
    return true;
  } catch (err) {
    console.error('💥 Exception:', err);
    return false;
  }
}

// Start the geocoding
startBackgroundGeocoding().then(success => {
  if (success) {
    console.log('🎯 Background geocoding is now running for ~32k remaining providers');
  } else {
    console.log('⚠️ Failed to start background geocoding');
  }
});

// Check status every 30 seconds
setInterval(async () => {
  const { data: stats } = await supabase
    .from('providers')
    .select('latitude, longitude');
  
  if (stats) {
    const geocoded = stats.filter(p => p.latitude && p.longitude).length;
    const total = stats.length;
    const remaining = total - geocoded;
    console.log(`📊 Progress: ${geocoded}/${total} geocoded, ${remaining} remaining`);
  }
}, 30000);