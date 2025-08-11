import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TableConfig {
  name: string;
  addressFields: string[];
}

const TABLES: TableConfig[] = [
  { name: 'providers', addressFields: ['city', 'state', 'zip_code'] },
  { name: 'companies', addressFields: ['address', 'city', 'state', 'zip_code'] },
  { name: 'schools', addressFields: ['city', 'state', 'zip_code'] },
  { name: 'job_listings', addressFields: ['city', 'state', 'zip_code'] },
  { name: 'consultant_companies', addressFields: ['city', 'state', 'zip_code'] },
  { name: 'equipment_companies', addressFields: ['city', 'state', 'zip_code'] },
  { name: 'pe_firms', addressFields: ['city', 'state', 'zip_code'] }
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { batch_size = 25, max_batches = 20 } = await req.json().catch(() => ({}));
    const mapboxToken = Deno.env.get("MAPBOX_PUBLIC_TOKEN");

    if (!mapboxToken) {
      throw new Error("Mapbox token not configured");
    }

    // Check for existing running jobs
    const { data: existingJobs } = await supabase
      .from('processing_jobs')
      .select('id')
      .eq('job_type', 'comprehensive_geocode')
      .eq('status', 'processing')
      .limit(1);

    if (existingJobs && existingJobs.length > 0) {
      return new Response(
        JSON.stringify({ error: "A comprehensive geocoding job is already running" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 409 
        }
      );
    }

    // Create new job
    const { data: jobData, error: jobError } = await supabase
      .from('processing_jobs')
      .insert({
        job_type: 'comprehensive_geocode',
        status: 'processing',
        started_at: new Date().toISOString(),
        metadata: { batch_size, max_batches },
        progress_data: { tables_processed: 0, total_processed: 0, total_failed: 0 }
      })
      .select()
      .single();

    if (jobError || !jobData) {
      throw new Error(`Failed to create job: ${jobError?.message}`);
    }

    // Start background processing
    EdgeRuntime.waitUntil(runComprehensiveGeocoding(supabase, jobData.id, mapboxToken, batch_size, max_batches));

    return new Response(
      JSON.stringify({ message: "Comprehensive geocoding job started", jobId: jobData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error starting comprehensive geocoding:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});

async function runComprehensiveGeocoding(
  supabase: any, 
  jobId: string, 
  mapboxToken: string, 
  batchSize: number, 
  maxBatches: number
) {
  console.log(`Starting comprehensive geocoding job ${jobId}`);
  
  let totalProcessed = 0;
  let totalFailed = 0;
  let tablesProcessed = 0;
  
  // Execution limits
  const MAX_EXECUTION_TIME = 90 * 60 * 1000; // 90 minutes
  const MAX_INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes
  const startTime = Date.now();
  let lastActivityTime = Date.now();

  try {
    for (const table of TABLES) {
      console.log(`Processing table: ${table.name}`);
      let tableProcessed = 0;
      let tableFailed = 0;
      let hasMore = true;
      let offset = 0;
      let consecutiveErrors = 0;
      const MAX_CONSECUTIVE_ERRORS = 5;

      while (hasMore && offset < maxBatches * batchSize) {
        // Check timeouts
        const currentTime = Date.now();
        if (currentTime - startTime > MAX_EXECUTION_TIME) {
          throw new Error("Job exceeded maximum execution time");
        }
        if (currentTime - lastActivityTime > MAX_INACTIVITY_TIME) {
          throw new Error("Job inactive for too long");
        }

        try {
          // Get records needing geocoding
          const { data: records, error } = await supabase
            .from(table.name)
            .select(`id, ${table.addressFields.join(', ')}`)
            .or('latitude.is.null,longitude.is.null')
            .not('city', 'is', null)
            .range(offset, offset + batchSize - 1);

          if (error) {
            console.error(`Error fetching ${table.name}:`, error);
            consecutiveErrors++;
            if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
              throw new Error(`Too many consecutive errors for ${table.name}`);
            }
            await sleep(2000);
            continue;
          }

          if (!records || records.length === 0) {
            console.log(`No more records to process for ${table.name}`);
            hasMore = false;
            break;
          }

          consecutiveErrors = 0; // Reset on successful fetch
          console.log(`Processing ${records.length} records from ${table.name} (offset: ${offset})`);

          // Process each record
          for (const record of records) {
            try {
              const result = await geocodeRecord(record, table, mapboxToken);
              
              if (result.success) {
                // Update database
                const { error: updateError } = await supabase
                  .from(table.name)
                  .update({
                    latitude: result.latitude,
                    longitude: result.longitude
                  })
                  .eq('id', record.id);

                if (updateError) {
                  console.error(`Failed to update ${table.name} ${record.id}:`, updateError);
                  tableFailed++;
                } else {
                  tableProcessed++;
                  lastActivityTime = Date.now();
                }
              } else {
                tableFailed++;
              }

              // Rate limiting
              await sleep(100);

            } catch (recordError) {
              console.error(`Error processing ${table.name} record ${record.id}:`, recordError);
              tableFailed++;
            }
          }

          offset += batchSize;

          // Update progress
          totalProcessed += tableProcessed;
          totalFailed += tableFailed;

          await supabase
            .from('processing_jobs')
            .update({
              progress_data: {
                tables_processed: tablesProcessed,
                current_table: table.name,
                total_processed: totalProcessed,
                total_failed: totalFailed,
                last_update: new Date().toISOString()
              }
            })
            .eq('id', jobId);

          console.log(`Table ${table.name} progress: ${tableProcessed} processed, ${tableFailed} failed`);

        } catch (batchError) {
          console.error(`Batch error for ${table.name}:`, batchError);
          consecutiveErrors++;
          if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            throw batchError;
          }
          await sleep(5000);
        }
      }

      tablesProcessed++;
      console.log(`Completed table ${table.name}: ${tableProcessed} processed, ${tableFailed} failed`);
    }

    // Job completed successfully
    console.log(`Job ${jobId} completed successfully`);
    await supabase
      .from('processing_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        result_data: {
          total_processed: totalProcessed,
          total_failed: totalFailed,
          tables_completed: tablesProcessed,
          completion_time: new Date().toISOString()
        }
      })
      .eq('id', jobId);

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    await supabase
      .from('processing_jobs')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
        error_details: error.message,
        result_data: {
          total_processed: totalProcessed,
          total_failed: totalFailed,
          tables_completed: tablesProcessed,
          error: error.message
        }
      })
      .eq('id', jobId);
  }
}

async function geocodeRecord(record: any, table: TableConfig, mapboxToken: string) {
  try {
    // Build search query
    const parts = [];
    for (const field of table.addressFields) {
      if (record[field]) {
        parts.push(record[field]);
      }
    }
    
    if (parts.length === 0) {
      return { success: false, error: 'No address data' };
    }

    const searchQuery = parts.join(', ');
    console.log(`Geocoding ${table.name} ${record.id}: "${searchQuery}"`);

    // Make request with timeout and retry
    const response = await fetchWithRetry(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxToken}&country=US&limit=1`,
      { timeout: 10000, retries: 2 }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return { success: false, error: 'No coordinates found' };
    }

    const [longitude, latitude] = data.features[0].center;
    console.log(`Found coordinates for ${table.name} ${record.id}: ${latitude}, ${longitude}`);

    return {
      success: true,
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6))
    };

  } catch (error) {
    console.error(`Geocoding failed for ${table.name} ${record.id}:`, error);
    return { success: false, error: error.message };
  }
}

async function fetchWithRetry(url: string, options: { timeout: number; retries: number }) {
  let lastError;
  
  for (let i = 0; i <= options.retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) {
        // Rate limited, wait longer
        await sleep(2000 * (i + 1));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
      
    } catch (error) {
      lastError = error;
      if (i < options.retries) {
        await sleep(1000 * (i + 1));
      }
    }
  }
  
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}