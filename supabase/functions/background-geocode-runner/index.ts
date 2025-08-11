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

    // Check for existing job
    const { data: existingJob } = await supabase
      .from('processing_jobs')
      .select('id')
      .eq('job_type', 'background_geocode')
      .eq('status', 'processing')
      .limit(1);

    if (existingJob && existingJob.length > 0) {
      return new Response(
        JSON.stringify({ message: "Background geocoding already running" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create job
    const { data: job, error: jobError } = await supabase
      .from('processing_jobs')
      .insert({
        job_type: 'background_geocode',
        status: 'processing',
        started_at: new Date().toISOString(),
        metadata: { batch_size: 25 }
      })
      .select()
      .single();

    if (jobError || !job) {
      throw new Error(`Failed to create job: ${jobError?.message}`);
    }

    // Start background processing
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
  let consecutiveFailures = 0;
  const MAX_CONSECUTIVE_FAILURES = 10;
  const MAX_EXECUTION_TIME = 60 * 60 * 1000; // 1 hour
  const startTime = Date.now();

  try {
    console.log(`Starting background geocoding job ${jobId}`);

    while (true) {
      // Check execution time limit
      if (Date.now() - startTime > MAX_EXECUTION_TIME) {
        console.log("Background geocoding reached time limit");
        break;
      }

      batchCount++;
      console.log(`Running batch ${batchCount}...`);

      try {
        // Call batch geocoding function
        const { data, error } = await supabase.functions.invoke('batch-geocode-providers', {
          body: { batch_size: 25 }
        });
        
        if (error) {
          console.error("Batch geocoding error:", error);
          consecutiveFailures++;
          if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
            throw new Error(`Too many consecutive failures: ${error.message}`);
          }
          await sleep(30000); // Wait 30 seconds on error
          continue;
        }

        console.log(`Batch ${batchCount} result:`, data);

        // Check if we're done
        if (data.completed || (data.processed === 0 && data.failed === 0)) {
          console.log("Background geocoding completed - no more records to process");
          break;
        }

        // Reset consecutive failures on successful batch
        if (data.processed > 0) {
          consecutiveFailures = 0;
        }

        totalProcessed += data.processed || 0;
        totalFailed += data.failed || 0;

        // Update job progress
        await supabase
          .from('processing_jobs')
          .update({
            progress_data: {
              total_processed: totalProcessed,
              total_failed: totalFailed,
              batch_count: batchCount,
              last_batch: data,
              last_update: new Date().toISOString()
            }
          })
          .eq('id', jobId);

        // Adaptive delay based on results
        if (data.processed === 0 && data.failed > 0) {
          console.log("No successful geocoding in this batch, waiting longer...");
          await sleep(60000); // Wait 1 minute
        } else if (data.processed > 0) {
          await sleep(5000); // Normal delay
        } else {
          await sleep(10000); // Medium delay
        }

      } catch (batchError) {
        console.error(`Batch ${batchCount} failed:`, batchError);
        consecutiveFailures++;
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          throw batchError;
        }
        await sleep(60000); // Wait 1 minute on batch error
      }
    }

    // Mark job as completed
    await supabase
      .from('processing_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: {
          total_processed: totalProcessed,
          total_failed: totalFailed,
          batch_count: batchCount,
          message: 'Background geocoding completed successfully',
          execution_time_ms: Date.now() - startTime
        }
      })
      .eq('id', jobId);

    console.log(`Background geocoding completed: ${totalProcessed} processed, ${totalFailed} failed in ${batchCount} batches`);

  } catch (error) {
    console.error(`Background geocoding job ${jobId} failed:`, error);
    
    // Mark job as failed
    await supabase
      .from('processing_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_details: error.message,
        result_data: {
          total_processed: totalProcessed,
          total_failed: totalFailed,
          batch_count: batchCount,
          error: error.message,
          execution_time_ms: Date.now() - startTime
        }
      })
      .eq('id', jobId);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}