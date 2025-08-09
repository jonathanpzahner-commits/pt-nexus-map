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
      console.log("Starting NPI DuckDB processing job...");
      
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
      EdgeRuntime.waitUntil(processNPIWithDuckDB(supabaseAdmin, jobId, file_url, email));

      return new Response(
        JSON.stringify({ 
          message: "NPI DuckDB processing job started",
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
    console.error('Error in NPI DuckDB processor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function processNPIWithDuckDB(supabase: any, jobId: string, fileUrl?: string, email?: string) {
  try {
    console.log(`Starting DuckDB NPI processing for job ${jobId}`);
    
    await updateJobProgress(supabase, jobId, 'running', 10, 'Initializing DuckDB...', {});

    // Import DuckDB
    const { Database } = await import("https://esm.sh/@duckdb/duckdb-wasm@1.28.0");
    
    await updateJobProgress(supabase, jobId, 'running', 20, 'Setting up DuckDB connection...', {});

    // Initialize DuckDB
    const db = new Database();
    const conn = db.connect();

    const npiUrl = fileUrl || "https://download.cms.gov/nppes/NPPES_Data_Dissemination_December_2024.zip";
    
    await updateJobProgress(supabase, jobId, 'running', 30, 'Creating DuckDB query for PT/PTA providers...', {});

    // Create the taxonomy codes as a SQL array for the WHERE clause
    const taxonomyCodes = PT_TAXONOMY_CODES.map(code => `'${code}'`).join(', ');

    // Use DuckDB's built-in CSV reading capabilities with filtering
    const query = `
      SELECT 
        column_01 as npi,
        column_02 as entity_type_code,
        column_05 as provider_organization_name,
        column_06 as provider_last_name,
        column_07 as provider_first_name,
        column_09 as provider_credential,
        column_21 as provider_business_mailing_address_city_name,
        column_22 as provider_business_mailing_address_state_name,
        column_23 as provider_business_mailing_address_postal_code,
        column_25 as provider_business_mailing_address_telephone_number,
        column_29 as provider_business_practice_location_address_city_name,
        column_30 as provider_business_practice_location_address_state_name,
        column_31 as provider_business_practice_location_address_postal_code,
        column_33 as provider_business_practice_location_address_telephone_number,
        column_48 as healthcare_provider_taxonomy_code_1,
        column_52 as healthcare_provider_taxonomy_code_2,
        column_56 as healthcare_provider_taxonomy_code_3,
        column_60 as provider_license_number_1,
        column_61 as provider_license_number_state_code_1
      FROM read_csv('${npiUrl}', 
        header=true,
        compression='gzip'
      )
      WHERE 
        column_48 IN (${taxonomyCodes}) OR
        column_52 IN (${taxonomyCodes}) OR
        column_56 IN (${taxonomyCodes})
    `;

    await updateJobProgress(supabase, jobId, 'running', 40, 'Executing DuckDB query...', {});

    // Execute the query
    const result = conn.query(query);
    
    await updateJobProgress(supabase, jobId, 'running', 60, 'Processing query results...', {});

    const providers = [];
    let processedCount = 0;

    // Process results
    while (true) {
      const row = result.fetchOne();
      if (!row) break;

      const record = {
        npi: row.npi,
        entity_type_code: row.entity_type_code,
        provider_organization_name: row.provider_organization_name,
        provider_last_name: row.provider_last_name,
        provider_first_name: row.provider_first_name,
        provider_credential: row.provider_credential,
        provider_business_mailing_address_city_name: row.provider_business_mailing_address_city_name,
        provider_business_mailing_address_state_name: row.provider_business_mailing_address_state_name,
        provider_business_mailing_address_postal_code: row.provider_business_mailing_address_postal_code,
        provider_business_mailing_address_telephone_number: row.provider_business_mailing_address_telephone_number,
        provider_business_practice_location_address_city_name: row.provider_business_practice_location_address_city_name,
        provider_business_practice_location_address_state_name: row.provider_business_practice_location_address_state_name,
        provider_business_practice_location_address_postal_code: row.provider_business_practice_location_address_postal_code,
        provider_business_practice_location_address_telephone_number: row.provider_business_practice_location_address_telephone_number,
        healthcare_provider_taxonomy_code_1: row.healthcare_provider_taxonomy_code_1,
        healthcare_provider_taxonomy_code_2: row.healthcare_provider_taxonomy_code_2,
        healthcare_provider_taxonomy_code_3: row.healthcare_provider_taxonomy_code_3,
        provider_license_number_1: row.provider_license_number_1,
        provider_license_number_state_code_1: row.provider_license_number_state_code_1,
      };

      const transformedProvider = transformToProvider(record);
      providers.push(transformedProvider);
      processedCount++;

      // Process in batches of 1000
      if (providers.length >= 1000) {
        await processBatch(supabase, providers, jobId);
        providers.length = 0; // Clear array
        
        await updateJobProgress(supabase, jobId, 'running', 60 + (processedCount / 10000 * 30), 
          `Processed ${processedCount} PT/PTA providers`, {
            processedCount
          });
      }
    }

    // Process remaining providers
    if (providers.length > 0) {
      await processBatch(supabase, providers, jobId);
    }

    await updateJobProgress(supabase, jobId, 'running', 95, 'Cleaning up...', {});

    // Close DuckDB connection
    conn.close();
    db.close();

    // Complete the job
    const jobResult = {
      totalProcessed: processedCount,
      message: 'NPI import completed successfully with DuckDB',
      method: 'DuckDB'
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

    console.log(`DuckDB NPI processing completed. Total processed: ${processedCount}`);
    
  } catch (error) {
    console.error('Error in DuckDB NPI processing:', error);
    await failJob(supabase, jobId, error.message);
  }
}

function transformToProvider(record: any) {
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
    source: "NPI Registry (DuckDB)",
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

async function processBatch(supabase: any, providers: any[], jobId: string) {
  if (providers.length === 0) return;

  try {
    const { error } = await supabase
      .from('providers')
      .insert(providers);

    if (error) {
      console.error('Error inserting batch:', error);
    } else {
      console.log(`Successfully inserted batch of ${providers.length} providers`);
    }
  } catch (error) {
    console.error('Error processing batch:', error);
  }
}