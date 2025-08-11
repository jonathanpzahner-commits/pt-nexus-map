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
    console.log("Starting background geocoding runner...");
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if geocoding is already running
    const { data: existingJob } = await supabase
      .from('processing_jobs')
      .select('id')
      .eq('job_type', 'background_geocode')
      .eq('status', 'processing')
      .single();

    if (existingJob) {
      console.log("Background geocoding already running");
      return new Response(
        JSON.stringify({ message: "Background geocoding already running" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create background job record
    const { data: job, error: jobError } = await supabase
      .from('processing_jobs')
      .insert({
        job_type: 'background_geocode',
        status: 'processing',
        metadata: { started_at: new Date().toISOString() }
      })
      .select()
      .single();

    if (jobError) {
      console.error("Failed to create job:", jobError);
      throw jobError;
    }

    console.log("Created background job:", job.id);

    // Start background geocoding without awaiting
    EdgeRuntime.waitUntil(runBackgroundGeocoding(supabase, job.id));

    return new Response(
      JSON.stringify({ 
        message: "Background geocoding started", 
        jobId: job.id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error starting background geocoding:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

async function runBackgroundGeocoding(supabase: any, jobId: string) {
  let totalProcessed = 0;
  let totalFailed = 0;
  let batchCount = 0;

  try {
    console.log("Starting continuous geocoding process...");

    while (true) {
      batchCount++;
      console.log(`Running batch ${batchCount}...`);

      // Call the existing batch geocoding function
      const { data, error } = await supabase.functions.invoke('batch-geocode-providers');
      
      if (error) {
        console.error("Batch geocoding error:", error);
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds on error
        continue;
      }

      console.log(`Batch ${batchCount} result:`, data);

      if (data.processed === 0 && data.failed === 0) {
        console.log("No more providers to process - geocoding complete");
        break;
      }

      totalProcessed += data.processed;
      totalFailed += data.failed;

      // Update job progress
      await supabase
        .from('processing_jobs')
        .update({
          result_data: {
            totalProcessed,
            totalFailed,
            batchCount,
            lastBatch: data
          }
        })
        .eq('id', jobId);

      // If we're only getting failures, slow down but don't stop
      if (data.processed === 0 && data.failed > 0) {
        console.log("No successful geocoding in this batch, waiting longer...");
        await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
      } else {
        // Normal delay between successful batches
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    }

    // Mark job as completed
    await supabase
      .from('processing_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: {
          totalProcessed,
          totalFailed,
          batchCount,
          message: 'Background geocoding completed successfully'
        }
      })
      .eq('id', jobId);

    console.log(`Background geocoding completed: ${totalProcessed} processed, ${totalFailed} failed`);

  } catch (error) {
    console.error("Background geocoding failed:", error);
    
    // Mark job as failed
    await supabase
      .from('processing_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        result_data: {
          totalProcessed,
          totalFailed,
          batchCount,
          error: error.message
        }
      })
      .eq('id', jobId);
  }
}