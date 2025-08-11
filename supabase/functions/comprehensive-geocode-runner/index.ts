import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("Comprehensive geocoding runner started");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json().catch(() => ({}));
    const batchSize = body.batch_size || 100;
    const maxBatches = body.max_batches || 50;

    console.log("Starting comprehensive geocoding", { batchSize, maxBatches });

    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    console.log("Mapbox token available:", !!mapboxToken);
    
    if (!mapboxToken) {
      console.error("Mapbox token not configured");
      throw new Error("Mapbox token not configured");
    }

    // Check for existing running job
    const { data: existingJobs } = await supabaseAdmin
      .from('processing_jobs')
      .select('id')
      .eq('job_type', 'comprehensive_geocode')
      .eq('status', 'processing')
      .limit(1);

    if (existingJobs && existingJobs.length > 0) {
      console.log("Geocoding job already running");
      return new Response(
        JSON.stringify({ 
          message: "Geocoding job already running", 
          job_id: existingJobs[0].id 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new job record
    const { data: job, error: jobError } = await supabaseAdmin
      .from('processing_jobs')
      .insert({
        job_type: 'comprehensive_geocode',
        status: 'processing',
        metadata: { batch_size: batchSize, max_batches: maxBatches },
        started_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (jobError) {
      console.error("Failed to create job:", jobError);
      throw jobError;
    }

    const jobId = job.id;
    console.log("Created job:", jobId);

    // Start background geocoding using waitUntil
    EdgeRuntime.waitUntil(runComprehensiveGeocoding(supabaseAdmin, jobId, batchSize, maxBatches, mapboxToken));

    return new Response(
      JSON.stringify({ 
        message: "Comprehensive geocoding started", 
        job_id: jobId,
        batch_size: batchSize,
        max_batches: maxBatches
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error starting comprehensive geocoding:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function runComprehensiveGeocoding(supabase: any, jobId: string, batchSize: number, maxBatches: number, mapboxToken: string) {
  console.log("Background comprehensive geocoding started for job:", jobId);
  
  let totalProcessed = 0;
  let totalFailed = 0;
  let batchCount = 0;
  
  // Set maximum execution time (2 hours)
  const maxExecutionTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const startTime = Date.now();
  
  // Track last activity for deadlock detection
  let lastActivityTime = Date.now();
  const maxInactivityTime = 10 * 60 * 1000; // 10 minutes without progress

  try {
    // Tables to geocode in order
    const tables = [
      { name: 'providers', addressFields: ['city', 'state', 'zip_code'] },
      { name: 'companies', addressFields: ['city', 'state', 'zip_code', 'address'] },
      { name: 'schools', addressFields: ['city', 'state', 'zip_code'] },
      { name: 'job_listings', addressFields: ['city', 'state', 'zip_code'] },
      { name: 'consultant_companies', addressFields: ['city', 'state', 'zip_code'] },
      { name: 'equipment_companies', addressFields: ['city', 'state', 'zip_code', 'address'] },
      { name: 'pe_firms', addressFields: ['city', 'state', 'zip_code', 'address'] }
    ];

    for (const table of tables) {
      console.log(`Starting geocoding for table: ${table.name}`);
      
      let tableProcessed = 0;
      let tableFailed = 0;
      let hasMore = true;
      let tableBatches = 0;

      while (hasMore && tableBatches < maxBatches) {
        // Check for timeout conditions
        const currentTime = Date.now();
        if (currentTime - startTime > maxExecutionTime) {
          console.log(`Job ${jobId} exceeded maximum execution time (2 hours), stopping gracefully`);
          throw new Error("Job exceeded maximum execution time of 2 hours");
        }
        
        if (currentTime - lastActivityTime > maxInactivityTime) {
          console.log(`Job ${jobId} has been inactive for ${maxInactivityTime/1000/60} minutes, stopping`);
          throw new Error("Job has been inactive for too long, possible deadlock detected");
        }
        
        console.log(`Processing batch ${tableBatches + 1} for ${table.name}`);

        // Get records without coordinates
        const selectFields = ['id', ...table.addressFields].join(', ');
        const { data: records, error: selectError } = await supabase
          .from(table.name)
          .select(selectFields)
          .is('latitude', null)
          .not('city', 'is', null)
          .not('city', 'eq', '')
          .limit(batchSize);

        if (selectError) {
          console.error(`Error selecting from ${table.name}:`, selectError);
          break;
        }

        if (!records || records.length === 0) {
          console.log(`No more records to geocode in ${table.name}`);
          hasMore = false;
          break;
        }

        console.log(`Found ${records.length} records to geocode in ${table.name}`);

        let batchProcessed = 0;
        let batchFailed = 0;

        for (const record of records) {
          try {
            // Build address string
            const addressParts = [];
            if (record.address && record.address.trim()) {
              addressParts.push(record.address.trim());
            }
            if (record.city && record.city.trim()) {
              addressParts.push(record.city.trim());
            }
            if (record.state && record.state.trim()) {
              addressParts.push(record.state.trim());
            }
            if (record.zip_code && record.zip_code.trim()) {
              // Clean up zip code - remove extra numbers after dash if too long
              let zipCode = record.zip_code.trim();
              if (zipCode.includes('-') && zipCode.length > 10) {
                zipCode = zipCode.split('-')[0];
              }
              addressParts.push(zipCode);
            }

            const searchQuery = addressParts.join(", ");
            
            if (!searchQuery.trim()) {
              console.log(`${table.name} record ${record.id} has no address data`);
              batchFailed++;
              continue;
            }

            console.log(`Geocoding ${table.name} ${record.id}: "${searchQuery}"`);

            // Geocode the address with timeout
            const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=US&limit=1`;
            
            // Add timeout to fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(geocodeUrl, {
              signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
            
            if (!response.ok) {
              const errorText = await response.text();
              console.error(`Mapbox API error for ${table.name} ${record.id}:`, response.status, errorText);
              batchFailed++;
              continue;
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
              const [longitude, latitude] = data.features[0].center;
              console.log(`Found coordinates for ${table.name} ${record.id}:`, { latitude, longitude });

              // Update record with coordinates
              const { error: updateError } = await supabase
                .from(table.name)
                .update({ latitude, longitude })
                .eq('id', record.id);

              if (updateError) {
                console.error(`Failed to update ${table.name} ${record.id}:`, updateError);
                batchFailed++;
              } else {
                batchProcessed++;
                lastActivityTime = Date.now(); // Update activity time on successful processing
              }
            } else {
              console.log(`No coordinates found for ${table.name} ${record.id}`);
              batchFailed++;
            }

            // Rate limiting with timeout protection
            const timeoutId = setTimeout(() => {
              console.log("Rate limiting timeout, continuing...");
            }, 5000); // 5 second timeout for rate limiting
            
            await Promise.race([
              new Promise(resolve => setTimeout(resolve, 100)),
              new Promise(resolve => setTimeout(resolve, 5000)) // Maximum 5 second wait
            ]);
            
            clearTimeout(timeoutId);
            
          } catch (error) {
            console.error(`Error processing ${table.name} record ${record.id}:`, error);
            batchFailed++;
          }
        }

        tableProcessed += batchProcessed;
        tableFailed += batchFailed;
        totalProcessed += batchProcessed;
        totalFailed += batchFailed;
        tableBatches++;
        batchCount++;

        console.log(`Batch ${tableBatches} complete for ${table.name}: ${batchProcessed} processed, ${batchFailed} failed`);

        // Update job progress
        await supabase
          .from('processing_jobs')
          .update({
            progress_data: {
              total_processed: totalProcessed,
              total_failed: totalFailed,
              current_table: table.name,
              table_processed: tableProcessed,
              table_failed: tableFailed,
              batch_count: batchCount
            },
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);

        // If we got less than batch size, we're done with this table
        if (records.length < batchSize) {
          hasMore = false;
        }

        // Brief pause between batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log(`Completed ${table.name}: ${tableProcessed} processed, ${tableFailed} failed`);
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
          completion_message: `Comprehensive geocoding complete: ${totalProcessed} records geocoded successfully, ${totalFailed} failed`
        }
      })
      .eq('id', jobId);

    console.log(`Comprehensive geocoding job ${jobId} completed: ${totalProcessed} processed, ${totalFailed} failed`);

  } catch (error) {
    console.error(`Comprehensive geocoding job ${jobId} failed:`, error);
    
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
          error: error.message
        }
      })
      .eq('id', jobId);
  }
}