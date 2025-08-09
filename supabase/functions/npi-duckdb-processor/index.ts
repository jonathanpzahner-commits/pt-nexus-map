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

    const { action, user_id, email, file_url } = await req.json();

    if (action === "start") {
      console.log("Starting NPI CSV processing job...");
      
      // Create job record
      const { data: jobData, error: jobError } = await supabaseAdmin
        .from('processing_jobs')
        .insert({
          job_type: 'npi_duckdb_import',
          status: 'pending',
          user_id,
          metadata: { email, file_url, started_at: new Date().toISOString() }
        })
        .select()
        .single();

      if (jobError) throw jobError;

      const jobId = jobData.id;

      // Start the background processing
      EdgeRuntime.waitUntil(processNPIWithStreaming(supabaseAdmin, jobId, file_url, email));

      return new Response(
        JSON.stringify({ 
          message: "NPI CSV processing job started",
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
    console.error('Error in NPI processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function processNPIWithStreaming(supabase: any, jobId: string, fileUrl?: string, email?: string) {
  try {
    console.log(`Starting CSV NPI processing for job ${jobId}`);
    
    await updateJobProgress(supabase, jobId, 'running', 10, 'Initializing CSV processing...', {});

    const npiUrl = fileUrl || "https://download.cms.gov/nppes/NPPES_Data_Dissemination_January_2025.zip";
    
    await updateJobProgress(supabase, jobId, 'running', 20, 'Downloading NPI file...', {});

    // Download and process the file
    const response = await fetch(npiUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
    }

    await updateJobProgress(supabase, jobId, 'running', 30, 'Processing CSV data...', {});

    // Get the response stream and process it
    const stream = response.body;
    if (!stream) {
      throw new Error('Failed to get response stream');
    }

    let totalProcessed = 0;
    let currentBatch: any[] = [];
    const batchSize = 100;
    let headerProcessed = false;
    let headers: string[] = [];
    let buffer = '';
    
    // Create a text decoder that can handle encoding issues
    const decoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            const row = parseCSVRowSafely(buffer, headers);
            if (row && isPTProvider(row)) {
              const provider = transformToProvider(row);
              if (provider && isValidProvider(provider)) {
                currentBatch.push(provider);
              }
            }
          }
          break;
        }

        // Decode chunk with error handling
        let chunk;
        try {
          chunk = decoder.decode(value, { stream: true });
        } catch (decodingError) {
          console.warn('Encoding issue detected, attempting recovery:', decodingError);
          // Try with replacement characters for corrupted bytes
          const replacementDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: false });
          chunk = replacementDecoder.decode(value, { stream: true });
        }

        buffer += chunk;

        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue; // Skip empty lines

          try {
            if (!headerProcessed) {
              headers = parseCSVRowSafely(trimmedLine);
              headerProcessed = true;
              console.log(`Found ${headers.length} columns in CSV header`);
              continue;
            }

            const row = parseCSVRowSafely(trimmedLine, headers);
            if (!row) continue;

            // Check if this is a PT/PTA provider
            if (isPTProvider(row)) {
              const provider = transformToProvider(row);
              if (provider && isValidProvider(provider)) {
                currentBatch.push(provider);
                totalProcessed++;

                // Process batch when full
                if (currentBatch.length >= batchSize) {
                  await processBatchSafely(supabase, currentBatch, jobId);
                  currentBatch = [];
                  
                  // Update progress more frequently - every batch
                  const progress = Math.min(90, 30 + (totalProcessed / 10000 * 60));
                  await updateJobProgress(supabase, jobId, 'running', progress, 
                    `Added batch of ${batchSize} providers. Total: ${totalProcessed} PT/PTA providers`, {
                      processedCount: totalProcessed,
                      batchesCompleted: Math.floor(totalProcessed / batchSize)
                    });
                }
              }
            }
          } catch (rowError) {
            console.warn('Error processing row, skipping:', rowError.message);
            continue; // Skip problematic rows
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Process final batch
    if (currentBatch.length > 0) {
      await processBatchSafely(supabase, currentBatch, jobId);
    }

    await updateJobProgress(supabase, jobId, 'running', 95, 'Finalizing import...', {});

    // Complete the job
    const jobResult = {
      totalProcessed,
      message: 'NPI import completed successfully with CSV streaming',
      method: 'CSV Streaming'
    };

    await completeJob(supabase, jobId, jobResult);

    // Send completion email if requested
    if (email) {
      try {
        await supabase.functions.invoke('send-completion-email', {
          body: { email, jobId, results: jobResult }
        });
      } catch (emailError) {
        console.error('Failed to send completion email:', emailError);
      }
    }

    console.log(`CSV NPI processing completed. Total processed: ${totalProcessed}`);
    
  } catch (error) {
    console.error('Error in CSV NPI processing:', error);
    await failJob(supabase, jobId, error.message);
  }
}

function parseCSVRowSafely(line: string, headers?: string[]): any {
  try {
    const values = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && char === quoteChar) {
        if (nextChar === quoteChar) {
          // Escaped quote
          current += char;
          i++; // Skip next quote
        } else {
          inQuotes = false;
          quoteChar = '';
        }
      } else if (!inQuotes && char === ',') {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Add the last value
    values.push(current.trim());
    
    // If we have headers, create an object
    if (headers && headers.length > 0) {
      const row: any = {};
      for (let i = 0; i < Math.min(values.length, headers.length); i++) {
        const header = headers[i] || `column_${i + 1}`;
        row[header] = values[i] || '';
      }
      return row;
    }
    
    return values;
  } catch (error) {
    console.warn('CSV parsing error:', error);
    return null;
  }
}

function isPTProvider(row: any): boolean {
  if (!row) return false;
  
  // Check taxonomy codes in multiple columns
  const taxonomyColumns = [
    'Healthcare Provider Taxonomy Code_1',
    'Healthcare Provider Taxonomy Code_2', 
    'Healthcare Provider Taxonomy Code_3',
    // Fallback column names
    'column_48', 'column_52', 'column_56'
  ];
  
  for (const col of taxonomyColumns) {
    const code = row[col];
    if (code && PT_TAXONOMY_CODES.includes(code)) {
      return true;
    }
  }
  
  return false;
}

function isValidProvider(provider: any): boolean {
  if (!provider) return false;
  
  // Must have either name or first/last name
  const hasName = provider.name || (provider.first_name && provider.last_name);
  
  // Must have location data
  const hasLocation = provider.city && provider.state;
  
  return hasName && hasLocation;
}

function transformToProvider(record: any): any {
  try {
    // Determine if individual or organization
    const entityTypeCol = record['Entity Type Code'] || record['column_02'] || '';
    const isIndividual = entityTypeCol === "1";
    
    // Extract names with multiple possible column names
    const orgName = record['Provider Organization Name (Legal Business Name)'] || 
                   record['column_05'] || '';
    const lastName = record['Provider Last Name (Legal Name)'] || 
                    record['column_06'] || '';
    const firstName = record['Provider First Name'] || 
                     record['column_07'] || '';
    
    let name, finalFirstName, finalLastName;
    if (isIndividual) {
      finalFirstName = firstName;
      finalLastName = lastName;
      name = `${firstName} ${lastName}`.trim();
    } else {
      name = orgName;
      finalFirstName = '';
      finalLastName = '';
    }

    // Get location data with fallbacks
    const practiceCity = record['Provider Business Practice Location Address City Name'] || 
                        record['column_29'] || '';
    const mailingCity = record['Provider Business Mailing Address City Name'] || 
                       record['column_21'] || '';
    const city = practiceCity || mailingCity;

    const practiceState = record['Provider Business Practice Location Address State Name'] || 
                         record['column_30'] || '';
    const mailingState = record['Provider Business Mailing Address State Name'] || 
                        record['column_22'] || '';
    const state = practiceState || mailingState;

    const practiceZip = record['Provider Business Practice Location Address Postal Code'] || 
                       record['column_31'] || '';
    const mailingZip = record['Provider Business Mailing Address Postal Code'] || 
                      record['column_23'] || '';
    const zipCode = practiceZip || mailingZip;

    // Get additional data
    const credential = record['Provider Credential Text'] || record['column_09'] || '';
    const licenseNumber = record['Provider License Number_1'] || record['column_60'] || '';
    const licenseState = record['Provider License Number State Code_1'] || record['column_61'] || '';
    const npi = record['NPI'] || record['column_01'] || '';
    const enumerationDate = record['Provider Enumeration Date'] || record['column_11'] || '';

    // Extract specializations from taxonomy codes
    const specializations: string[] = [];
    const taxonomyColumns = [
      { code: record['Healthcare Provider Taxonomy Code_1'] || record['column_48'], desc: record['Healthcare Provider Taxonomy Description_1'] || record['column_49'] },
      { code: record['Healthcare Provider Taxonomy Code_2'] || record['column_52'], desc: record['Healthcare Provider Taxonomy Description_2'] || record['column_53'] },
      { code: record['Healthcare Provider Taxonomy Code_3'] || record['column_56'], desc: record['Healthcare Provider Taxonomy Description_3'] || record['column_57'] }
    ];

    for (const taxonomy of taxonomyColumns) {
      if (taxonomy.code && PT_TAXONOMY_CODES.includes(taxonomy.code)) {
        const specialization = getTaxonomySpecialization(taxonomy.code);
        if (specialization && specialization !== "Physical Therapy" && !specializations.includes(specialization)) {
          specializations.push(specialization);
        }
      }
    }

    return {
      name: name || null,
      first_name: finalFirstName || null,
      last_name: finalLastName || null,
      current_employer: isIndividual ? null : (orgName || null),
      city: city || null,
      state: state || null,
      zip_code: zipCode ? zipCode.substring(0, 10) : null,
      specializations: specializations,
      license_number: licenseNumber || null,
      license_state: licenseState || null,
      source: "NPI Registry",
      additional_info: `NPI: ${npi}${enumerationDate ? `, Enumeration: ${enumerationDate}` : ''}${credential ? `, Credentials: ${credential}` : ''}`
    };
  } catch (error) {
    console.warn('Error transforming provider record:', error);
    return null;
  }
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

async function processBatchSafely(supabase: any, providers: any[], jobId: string) {
  if (providers.length === 0) return;

  try {
    // Filter out any null providers
    const validProviders = providers.filter(p => p && p.name);
    
    if (validProviders.length === 0) return;

    const { error } = await supabase
      .from('providers')
      .insert(validProviders);

    if (error) {
      console.error('Error inserting batch:', error);
      // Try inserting one by one to identify problematic records
      for (const provider of validProviders) {
        try {
          await supabase.from('providers').insert([provider]);
        } catch (individualError) {
          console.warn('Failed to insert individual provider:', provider.name, individualError);
        }
      }
    } else {
      console.log(`Successfully inserted batch of ${validProviders.length} providers`);
    }
  } catch (error) {
    console.error('Error processing batch:', error);
  }
}