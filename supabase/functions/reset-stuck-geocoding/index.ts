import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Resetting stuck geocoding job...');

    // Mark the stuck job as failed
    const { error: updateError } = await supabase
      .from('processing_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_details: 'Job was stuck and reset by admin'
      })
      .eq('job_type', 'comprehensive_geocode')
      .eq('status', 'processing');

    if (updateError) {
      console.error('Error updating stuck job:', updateError);
      throw updateError;
    }

    console.log('Successfully marked stuck job as failed');

    // Start a new comprehensive geocoding job
    const { data, error } = await supabase.functions.invoke('comprehensive-geocode-runner', {
      body: { 
        batch_size: 100,
        max_batches: 100
      }
    });

    if (error) {
      console.error('Error starting new geocoding job:', error);
      throw error;
    }

    console.log('Successfully started new comprehensive geocoding job');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Reset stuck geocoding job and started new one',
        data 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in reset-stuck-geocoding function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});