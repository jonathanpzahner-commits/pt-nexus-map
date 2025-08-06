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
  npi: string;
  entity_type_code: string;
  replacement_npi?: string;
  employer_identification_number?: string;
  provider_organization_name?: string;
  provider_last_name?: string;
  provider_first_name?: string;
  provider_middle_name?: string;
  provider_name_prefix?: string;
  provider_name_suffix?: string;
  provider_credential?: string;
  provider_other_organization_name?: string;
  provider_other_organization_name_type_code?: string;
  provider_other_last_name?: string;
  provider_other_first_name?: string;
  provider_other_middle_name?: string;
  provider_other_name_prefix?: string;
  provider_other_name_suffix?: string;
  provider_other_credential?: string;
  provider_other_last_name_type_code?: string;
  provider_first_line_business_mailing_address?: string;
  provider_second_line_business_mailing_address?: string;
  provider_business_mailing_address_city_name?: string;
  provider_business_mailing_address_state_name?: string;
  provider_business_mailing_address_postal_code?: string;
  provider_business_mailing_address_country_code?: string;
  provider_business_mailing_address_telephone_number?: string;
  provider_business_mailing_address_fax_number?: string;
  provider_first_line_business_practice_location_address?: string;
  provider_second_line_business_practice_location_address?: string;
  provider_business_practice_location_address_city_name?: string;
  provider_business_practice_location_address_state_name?: string;
  provider_business_practice_location_address_postal_code?: string;
  provider_business_practice_location_address_country_code?: string;
  provider_business_practice_location_address_telephone_number?: string;
  provider_business_practice_location_address_fax_number?: string;
  provider_enumeration_date?: string;
  last_update_date?: string;
  npi_deactivation_reason_code?: string;
  npi_deactivation_date?: string;
  npi_reactivation_date?: string;
  provider_gender_code?: string;
  authorized_official_last_name?: string;
  authorized_official_first_name?: string;
  authorized_official_middle_name?: string;
  authorized_official_title_or_position?: string;
  authorized_official_telephone_number?: string;
  healthcare_provider_taxonomy_code_1?: string;
  provider_license_number_1?: string;
  provider_license_number_state_code_1?: string;
  healthcare_provider_primary_taxonomy_switch_1?: string;
  healthcare_provider_taxonomy_code_2?: string;
  provider_license_number_2?: string;
  provider_license_number_state_code_2?: string;
  healthcare_provider_primary_taxonomy_switch_2?: string;
  healthcare_provider_taxonomy_code_3?: string;
  provider_license_number_3?: string;
  provider_license_number_state_code_3?: string;
  healthcare_provider_primary_taxonomy_switch_3?: string;
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
  // Determine if individual or organization
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

  // Use practice location address first, fall back to mailing address
  const city = record.provider_business_practice_location_address_city_name || 
               record.provider_business_mailing_address_city_name || "";
  const state = record.provider_business_practice_location_address_state_name || 
                record.provider_business_mailing_address_state_name || "";
  const zipCode = record.provider_business_practice_location_address_postal_code || 
                  record.provider_business_mailing_address_postal_code || "";
  const phone = record.provider_business_practice_location_address_telephone_number || 
                record.provider_business_mailing_address_telephone_number || "";

  // Determine specializations based on taxonomy codes
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
    zip_code: zipCode ? zipCode.slice(0, 10) : null, // Limit zip code length
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { action, state, batchSize = 1000 } = await req.json();

    if (action === "download") {
      // Download NPI database file
      console.log("Downloading NPI database...");
      
      const npiUrl = "https://download.cms.gov/nppes/NPPES_Data_Dissemination_December_2024.zip";
      
      const response = await fetch(npiUrl);
      if (!response.ok) {
        throw new Error(`Failed to download NPI data: ${response.statusText}`);
      }

      return new Response(
        JSON.stringify({ 
          message: "NPI download initiated",
          fileSize: response.headers.get("content-length"),
          status: "downloading"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "process") {
      // This would be called with chunks of the CSV data
      const { csvData, offset = 0 } = await req.json();
      
      console.log(`Processing CSV data starting at offset ${offset}`);
      
      const lines = csvData.split('\n');
      const headers = parseCSVLine(lines[0]);
      
      const providers = [];
      let processed = 0;
      let ptCount = 0;
      
      for (let i = 1; i < lines.length && i <= batchSize; i++) {
        if (!lines[i].trim()) continue;
        
        try {
          const values = parseCSVLine(lines[i]);
          const record: NPIRecord = {};
          
          // Map CSV values to record object
          headers.forEach((header, index) => {
            (record as any)[header.toLowerCase().replace(/\s+/g, '_')] = values[index] || null;
          });
          
          if (isPTProvider(record)) {
            const provider = transformToProvider(record);
            providers.push(provider);
            ptCount++;
          }
          
          processed++;
        } catch (error) {
          console.error(`Error processing line ${i}:`, error);
        }
      }
      
      // Insert providers into database
      if (providers.length > 0) {
        const { error: insertError } = await supabaseAdmin
          .from('providers')
          .insert(providers);
          
        if (insertError) {
          console.error('Error inserting providers:', insertError);
          throw insertError;
        }
      }
      
      return new Response(
        JSON.stringify({ 
          message: `Processed ${processed} records, found ${ptCount} PT providers`,
          processed,
          ptCount,
          inserted: providers.length
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'download' or 'process'" }),
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