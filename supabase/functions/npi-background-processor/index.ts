import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// PT/PTA Taxonomy codes from NUCC
const PT_TAXONOMY_CODES = [
  "225100000X", // Physical Therapist
  "2251C2600X", // Physical Therapist - Cardiopulmonary
  "2251E1300X", // Physical Therapist - Electrophysiology, Clinical
  "2251G0304X", // Physical Therapist - Geriatrics
  "2251H1200X", // Physical Therapist - Hand
  "2251N0400X", // Physical Therapist - Neurology
  "2251P0200X", // Physical Therapist - Pediatrics
  "2251S0007X", // Physical Therapist - Sports
  "2251X0800X", // Physical Therapist - Orthopedic
  "225200000X", // Physical Therapist Assistant
];

interface NPIRecord {
  [key: string]: string | null;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

function isPTProvider(record: NPIRecord): boolean {
  return PT_TAXONOMY_CODES.some(code => 
    record.healthcare_provider_taxonomy_code_1 === code ||
    record.healthcare_provider_taxonomy_code_2 === code ||
    record.healthcare_provider_taxonomy_code_3 === code
  );
}

function transformToProvider(record: NPIRecord) {
  const isIndividual = record.entity_type_code === "1";
  
  let name, firstName, lastName;
  if (isIndividual) {
    firstName = record.provider_first_name || "";
    lastName = record.provider_last_name || "";
    name = `${firstName} ${lastName}`.trim();
  } else {
    name = record.provider_organization_name || "";
    firstName = "";
    lastName = "";
  }

  const city = record.provider_business_practice_location_address_city_name || 
               record.provider_business_mailing_address_city_name || "";
  const state = record.provider_business_practice_location_address_state_name || 
                record.provider_business_mailing_address_state_name || "";
  const zipCode = record.provider_business_practice_location_address_postal_code || 
                  record.provider_business_mailing_address_postal_code || "";
  const phone = record.provider_business_practice_location_address_telephone_number || 
                record.provider_business_mailing_address_telephone_number || "";

  const specializations: string[] = [];
  if (record.healthcare_provider_taxonomy_code_1) {
    specializations.push(getTaxonomySpecialization(record.healthcare_provider_taxonomy_code_1));
  }
  if (record.healthcare_provider_taxonomy_code_2 && record.healthcare_provider_taxonomy_code_2 !== record.healthcare_provider_taxonomy_code_1) {
    specializations.push(getTaxonomySpecialization(record.healthcare_provider_taxonomy_code_2));
  }
  if (record.healthcare_provider_taxonomy_code_3 && 
      record.healthcare_provider_taxonomy_code_3 !== record.healthcare_provider_taxonomy_code_1 &&
      record.healthcare_provider_taxonomy_code_3 !== record.healthcare_provider_taxonomy_code_2) {
    specializations.push(getTaxonomySpecialization(record.healthcare_provider_taxonomy_code_3));
  }

  return {
    name: name || null,
    first_name: firstName || null,
    last_name: lastName || null,
    city: city || null,
    state: state || null,
    zip_code: zipCode ? zipCode.slice(0, 10) : null,
    phone: phone || null,
    specializations: specializations.filter(s => s && s !== "Physical Therapy"),
    license_number: record.provider_license_number_1 || null,
    license_state: record.provider_license_number_state_code_1 || null,
    source: "NPI Registry",
    additional_info: `NPI: ${record.npi}${record.provider_credential ? `, Credentials: ${record.provider_credential}` : ""}`
  };
}

function getTaxonomySpecialization(taxonomyCode: string): string {
  const specializations: { [key: string]: string } = {
    "225100000X": "Physical Therapy",
    "2251C2600X": "Cardiopulmonary",
    "2251E1300X": "Electrophysiology",
    "2251G0304X": "Geriatrics",
    "2251H1200X": "Hand Therapy",
    "2251N0400X": "Neurology",
    "2251P0200X": "Pediatrics",
    "2251S0007X": "Sports Physical Therapy",
    "2251X0800X": "Orthopedic",
    "225200000X": "Physical Therapist Assistant",
  };
  return specializations[taxonomyCode] || "Physical Therapy";
}

async function updateJobProgress(supabase: any, jobId: string, status: string, progress: number, message: string, data: any = {}) {
  await supabase
    .from('processing_jobs')
    .update({
      status,
      progress_data: { progress, message, ...data },
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId);
}

async function completeJob(supabase: any, jobId: string, result: any, status = 'completed') {
  await supabase
    .from('processing_jobs')
    .update({
      status,
      result_data: result,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId);
}

async function failJob(supabase: any, jobId: string, error: string) {
  await supabase
    .from('processing_jobs')
    .update({
      status: 'failed',
      error_details: error,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, user_id, email } = await req.json();

    if (action === "start") {
      console.log("Starting NPI background processing job...");
      
      // Create job record
      const { data: jobData, error: jobError } = await supabaseAdmin
        .from('processing_jobs')
        .insert({
          job_type: 'npi_import',
          status: 'pending',
          user_id,
          metadata: { email, started_at: new Date().toISOString() }
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const jobId = jobData.id;

      // Start the background processing (don't await - let it run independently)
      EdgeRuntime.waitUntil(processNPIData(supabaseAdmin, jobId, email));

      return new Response(
        JSON.stringify({ 
          message: "NPI processing job started",
          jobId,
          status: "processing"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "status") {
      const { jobId } = await req.json();
      
      const { data: job, error } = await supabaseAdmin
        .from('processing_jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify(job),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'start' or 'status'" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );

  } catch (error) {
    console.error('Error in NPI background processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// Background NPI Data Processing with Chunked Streaming
async function processNPIData(supabase: any, jobId: string, email?: string) {
  try {
    console.log(`Starting background NPI processing for job ${jobId}`);
    
    // Update job status to running
    await updateJobProgress(supabase, jobId, 'running', 5, 'Initializing chunked download...', {});

    const npiUrl = "https://download.cms.gov/nppes/NPPES_Data_Dissemination_December_2024.zip";
    console.log(`Starting chunked download from: ${npiUrl}`);
    
    // Initialize counters
    let totalProcessed = 0;
    let ptFound = 0;
    let currentBatch: any[] = [];
    const batchSize = 100; // Much smaller batches to prevent timeout
    let downloadedBytes = 0;
    const estimatedTotalSize = 7 * 1024 * 1024 * 1024; // 7GB estimate
    let lastProgressUpdate = Date.now();

    await updateJobProgress(supabase, jobId, 'running', 10, 'Starting chunked file download...', {});

    // Start streaming download
    const response = await fetch(npiUrl);
    if (!response.ok) {
      throw new Error(`Failed to download NPI data: ${response.status} ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to create stream reader');
    }

    await updateJobProgress(supabase, jobId, 'running', 15, 'Processing data stream...', {
      totalProcessed,
      ptFound
    });

    // Process the stream in chunks
    let textDecoder = new TextDecoder();
    let textBuffer = '';
    let lineCount = 0;
    let isFirstLine = true;
    let batchCount = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          console.log('Stream completed');
          break;
        }

        downloadedBytes += value.length;
        
        // Update progress based on download
        const downloadProgress = Math.min(90, 15 + (downloadedBytes / estimatedTotalSize) * 75);
        
        // Convert chunk to text
        const textChunk = textDecoder.decode(value, { stream: true });
        textBuffer += textChunk;

        // Process complete lines
        const lines = textBuffer.split('\n');
        textBuffer = lines.pop() || ''; // Keep incomplete line for next iteration

        for (const line of lines) {
          if (!line.trim()) continue;
          
          lineCount++;
          
          // Skip header line
          if (isFirstLine) {
            isFirstLine = false;
            console.log('Header line:', line.substring(0, 100) + '...');
            continue;
          }

          totalProcessed++;

          try {
            // Parse CSV line
            const fields = parseCSVLine(line);
            
            // Create record object using NPI field positions
            // Based on NPI dissemination file format
            const record: NPIRecord = {
              npi: fields[0] || '',
              entity_type_code: fields[1] || '',
              provider_organization_name: fields[4] || '',
              provider_last_name: fields[5] || '',
              provider_first_name: fields[6] || '',
              provider_credential: fields[8] || '',
              provider_business_mailing_address_city_name: fields[20] || '',
              provider_business_mailing_address_state_name: fields[21] || '',
              provider_business_mailing_address_postal_code: fields[22] || '',
              provider_business_mailing_address_telephone_number: fields[24] || '',
              provider_business_practice_location_address_city_name: fields[28] || '',
              provider_business_practice_location_address_state_name: fields[29] || '',
              provider_business_practice_location_address_postal_code: fields[30] || '',
              provider_business_practice_location_address_telephone_number: fields[32] || '',
              healthcare_provider_taxonomy_code_1: fields[47] || '',
              healthcare_provider_taxonomy_code_2: fields[51] || '',
              healthcare_provider_taxonomy_code_3: fields[55] || '',
              provider_license_number_1: fields[59] || '',
              provider_license_number_state_code_1: fields[60] || ''
            };
            
            // Check if this is a PT/PTA provider
            if (isPTProvider(record)) {
              const transformedProvider = transformToProvider(record);
              currentBatch.push(transformedProvider);
              ptFound++;
            }

            // Process batch when it reaches the size limit
            if (currentBatch.length >= batchSize) {
              await processBatch(supabase, currentBatch, jobId);
              batchCount++;
              currentBatch = [];
              
              // Update progress more frequently for smaller batches
              const now = Date.now();
              if (now - lastProgressUpdate > 2000) { // Update every 2 seconds
                await updateJobProgress(supabase, jobId, 'running', Math.floor(downloadProgress), 
                  `Processed batch ${batchCount}, found ${ptFound} PT/PTA providers`, {
                    totalProcessed,
                    ptFound,
                    batchesProcessed: batchCount,
                    downloadedMB: Math.round(downloadedBytes / 1024 / 1024)
                  });
                lastProgressUpdate = now;
              }
              
              console.log(`Batch ${batchCount}: Processed ${totalProcessed} total, found ${ptFound} PT/PTA providers`);
              
              // Longer pause after each batch to prevent CPU overload
              await new Promise(resolve => setTimeout(resolve, 250));
            }

            // Memory management and CPU breaks - more frequent pauses
            if (totalProcessed % 5000 === 0) {
              // Longer pause to prevent overwhelming and allow garbage collection
              await new Promise(resolve => setTimeout(resolve, 500));
              console.log(`Processed ${totalProcessed} records, found ${ptFound} PT/PTA providers so far`);
              
              // Force garbage collection hint
              if (globalThis.gc) {
                globalThis.gc();
              }
            }

          } catch (lineError) {
            console.error(`Error processing line ${totalProcessed}:`, lineError.message);
            // Continue processing other lines
          }
        }

        // More aggressive memory management - limit text buffer size
        if (textBuffer.length > 5000) {
          console.log('Text buffer getting large, trimming to prevent memory issues');
          textBuffer = textBuffer.slice(-500); // Keep only last 500 chars
        }
        
        // Periodic stream pause to prevent overwhelming
        if (lineCount % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

    } finally {
      reader.releaseLock();
    }

    // Process any remaining records in the final batch
    if (currentBatch.length > 0) {
      await processBatch(supabase, currentBatch, jobId);
      batchCount++;
      console.log(`Processed final batch ${batchCount}`);
    }

    // Complete the job
    const result = {
      totalProcessed,
      ptFound,
      batchesProcessed: batchCount,
      message: 'NPI import completed successfully with chunked streaming',
      downloadedMB: Math.round(downloadedBytes / 1024 / 1024)
    };

    await completeJob(supabase, jobId, result);

    // Send completion email if requested
    if (email) {
      try {
        await supabase.functions.invoke('send-completion-email', {
          body: { email, jobId, results: result }
        });
      } catch (emailError) {
        console.error('Failed to send completion email:', emailError);
      }
    }

    console.log(`NPI processing completed. Total processed: ${totalProcessed}, PT found: ${ptFound}`);
    
  } catch (error) {
    console.error('Error in NPI processing:', error);
    await failJob(supabase, jobId, error.message);
  }
}

// Helper function to process a batch of providers
async function processBatch(supabase: any, providers: any[], jobId: string) {
  if (providers.length === 0) return;

  try {
    const { error } = await supabase
      .from('providers')
      .insert(providers);

    if (error) {
      console.error('Error inserting batch:', error);
      // Don't fail the entire job for batch errors, just log them
    } else {
      console.log(`Successfully inserted batch of ${providers.length} providers`);
    }
  } catch (error) {
    console.error('Error processing batch:', error);
  }
}