import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    console.log("Resetting stuck geocoding jobs...");

    // Reset all stuck jobs
    const { data: resetData, error: resetError } = await supabase
      .from('processing_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_details: 'Job manually reset due to being stuck'
      })
      .in('job_type', ['comprehensive_geocode', 'background_geocode'])
      .eq('status', 'processing');

    if (resetError) {
      throw new Error(`Failed to reset jobs: ${resetError.message}`);
    }

    console.log("Successfully reset stuck jobs");

    // Start new comprehensive geocoding job
    const { data: invokeData, error: invokeError } = await supabase.functions.invoke(
      'comprehensive-geocode-runner',
      {
        body: { 
          batch_size: 25, 
          max_batches: 20 
        }
      }
    );

    if (invokeError) {
      console.error('Error starting new geocoding job:', invokeError);
      return new Response(
        JSON.stringify({ 
          message: "Reset stuck jobs but failed to start new job", 
          error: invokeError.message 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: "Successfully reset stuck jobs and started new geocoding process",
        resetJobs: resetData,
        newJob: invokeData
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in reset-stuck-geocoding:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});