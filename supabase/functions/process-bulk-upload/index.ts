import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import * as XLSX from 'https://esm.sh/xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { jobId } = await req.json();

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: 'Job ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing bulk upload job: ${jobId}`);

    // Get job details
    const { data: job, error: jobError } = await supabase
      .from('bulk_upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      console.error('Job not found:', jobError);
      return new Response(
        JSON.stringify({ error: 'Job not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update job status to processing
    await supabase
      .from('bulk_upload_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('bulk-uploads')
      .download(job.file_path);

    if (downloadError || !fileData) {
      console.error('Failed to download file:', downloadError);
      await supabase
        .from('bulk_upload_jobs')
        .update({ 
          status: 'failed', 
          error_details: { message: 'Failed to download file' }
        })
        .eq('id', jobId);
      
      return new Response(
        JSON.stringify({ error: 'Failed to download file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse Excel file - handle all sheets for multi-tab files
    const arrayBuffer = await fileData.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    // Process all sheets and combine data
    let allJsonData: any[] = [];
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet);
      allJsonData = allJsonData.concat(sheetData);
    }
    
    const jsonData = allJsonData;

    console.log(`Parsed ${jsonData.length} rows from Excel file`);

    // Update total rows
    await supabase
      .from('bulk_upload_jobs')
      .update({ total_rows: jsonData.length })
      .eq('id', jobId);

    const validationErrors: ValidationError[] = [];
    const validRecords: any[] = [];
    const duplicateTracker = new Map<string, number>();
    let duplicatesSkipped = 0;

    // Validate and process data based on entity type
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any;
      const rowNumber = i + 2; // Excel rows start at 1, header is row 1

      try {
        // Log first few rows to understand CSV structure
        if (i < 3) {
          console.log(`Row ${rowNumber} data:`, JSON.stringify(row, null, 2));
          console.log(`Available columns:`, Object.keys(row));
        }
        
        const validatedRecord = validateAndTransformRecord(row, job.entity_type, rowNumber);
        
        if (validatedRecord.errors.length > 0) {
          validationErrors.push(...validatedRecord.errors);
        } else if (validatedRecord.data && Object.keys(validatedRecord.data).length > 0) {
          // Check for duplicates if this is a company
          if (job.entity_type === 'companies' && validatedRecord.data.name && validatedRecord.data._location_key) {
            const duplicateKey = `${validatedRecord.data.name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()}|${validatedRecord.data._location_key}`;
            
            if (duplicateTracker.has(duplicateKey)) {
              console.log(`Skipping duplicate company: ${validatedRecord.data.name} at ${validatedRecord.data._location_key}`);
              duplicatesSkipped++;
              continue;
            }
            duplicateTracker.set(duplicateKey, rowNumber);
            
            // Remove the location key before saving
            delete validatedRecord.data._location_key;
          }
          
          validRecords.push(validatedRecord.data);
        }
      } catch (error) {
        validationErrors.push({
          row: rowNumber,
          field: 'general',
          value: null,
          message: error.message
        });
      }
    }

    console.log(`Validated ${validRecords.length} records, ${validationErrors.length} errors, ${duplicatesSkipped} duplicates skipped`);

    // Insert valid records in batches
    let successfulInserts = 0;
    const batchSize = 100;

    for (let i = 0; i < validRecords.length; i += batchSize) {
      const batch = validRecords.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from(job.entity_type)
        .insert(batch)
        .select();

      if (error) {
        console.error(`Batch insert error:`, error);
        validationErrors.push({
          row: i + 2,
          field: 'database',
          value: null,
          message: `Database error: ${error.message}`
        });
      } else {
        successfulInserts += data?.length || 0;
      }

      // Update progress
      await supabase
        .from('bulk_upload_jobs')
        .update({ 
          processed_rows: i + batch.length,
          successful_rows: successfulInserts 
        })
        .eq('id', jobId);
    }

    // Final update
    const finalStatus = validationErrors.length === 0 ? 'completed' : 'completed';
    await supabase
      .from('bulk_upload_jobs')
      .update({
        status: finalStatus,
        processed_rows: jsonData.length,
        successful_rows: successfulInserts,
        failed_rows: validationErrors.length,
        error_details: validationErrors.length > 0 ? { errors: validationErrors } : null,
        results: {
          total: jsonData.length,
          successful: successfulInserts,
          failed: validationErrors.length,
          duplicates_skipped: duplicatesSkipped,
          errors: validationErrors.slice(0, 50) // Limit errors stored
        }
      })
      .eq('id', jobId);

    console.log(`Job completed: ${successfulInserts} successful, ${validationErrors.length} failed, ${duplicatesSkipped} duplicates skipped`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: jsonData.length,
        successful: successfulInserts,
        failed: validationErrors.length,
        duplicates_skipped: duplicatesSkipped
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function validateAndTransformRecord(row: any, entityType: string, rowNumber: number) {
  const errors: ValidationError[] = [];
  let data: any = {};

  switch (entityType) {
    case 'providers':
      data = validateProvider(row, rowNumber, errors);
      break;
    case 'companies':
      data = validateCompany(row, rowNumber, errors);
      break;
    case 'schools':
      data = validateSchool(row, rowNumber, errors);
      break;
    case 'job_listings':
      data = validateJobListing(row, rowNumber, errors);
      break;
    case 'equipment_companies':
      data = validateEquipmentCompany(row, rowNumber, errors);
      break;
    case 'consultant_companies':
      data = validateConsultantCompany(row, rowNumber, errors);
      break;
    case 'pe_firms':
      data = validatePeFirm(row, rowNumber, errors);
      break;
    default:
      errors.push({
        row: rowNumber,
        field: 'entity_type',
        value: entityType,
        message: 'Invalid entity type'
      });
  }

  return { data, errors };
}

function validateProvider(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Handle NPI Registry format columns
  const npi = row['NPI']?.toString().trim() || '';
  const firstName = row['Provider First Name']?.toString().trim() || row['First Name']?.toString().trim() || '';
  const lastName = row['Provider Last Name (Legal Name)']?.toString().trim() || row['Last Name']?.toString().trim() || '';
  const credentials = row['Provider Credential Text']?.toString().trim() || '';
  const address = row['Provider First Line Business Practice Location Address']?.toString().trim() || '';
  const city = row['Provider Business Practice Location Address City Name']?.toString().trim() || row['City']?.toString().trim() || '';
  const state = row['Provider Business Practice Location Address State Name']?.toString().trim() || row['State/Province']?.toString().trim() || '';
  const zipCode = row['Provider Business Practice Location Address Postal Code']?.toString().trim() || row['Zip']?.toString().trim() || '';
  const taxonomyCode = row['Healthcare Provider Taxonomy Code_1']?.toString().trim() || '';
  const licenseState = row['Provider License Number State Code_1']?.toString().trim() || '';
  
  // Required fields - either use combined name or first/last name
  if (!firstName && !lastName) {
    errors.push({ row: rowNumber, field: 'name', value: '', message: 'First name or last name is required' });
  } else {
    data.first_name = firstName;
    data.last_name = lastName;
    data.name = `${firstName} ${lastName}`.trim(); // Create combined name for compatibility
  }

  // Map NPI Registry columns to database fields
  if (city) data.city = city;
  if (state) data.state = state;
  if (zipCode) data.zip_code = zipCode.substring(0, 10); // Limit zip code length
  if (credentials) data.additional_info = `Credentials: ${credentials}`;
  if (npi) {
    data.additional_info = data.additional_info ? `${data.additional_info}, NPI: ${npi}` : `NPI: ${npi}`;
  }
  if (licenseState) data.license_state = licenseState;
  data.source = 'NPI Registry Bulk Upload';

  // Handle specializations from taxonomy code
  if (taxonomyCode) {
    const specializations = getTaxonomySpecialization(taxonomyCode);
    if (specializations) {
      data.specializations = [specializations];
    }
  }

  // Fallback to original column mappings for other formats
  if (row.Email) data.email = row.Email.toString().trim();
  if (row.Phone) data.phone = row.Phone.toString().trim();
  if (row['Current Employer']) data.current_employer = row['Current Employer'].toString().trim();
  if (row['Current Job Title']) data.current_job_title = row['Current Job Title'].toString().trim();
  if (row['Additional Info'] && !data.additional_info) {
    data.additional_info = row['Additional Info'].toString().trim();
    data.bio = row['Additional Info'].toString().trim(); // Also map to bio for compatibility
  }
  if (row.Source && !data.source) data.source = row.Source.toString().trim();
  if (row.LinkedIn) data.linkedin_url = row.LinkedIn.toString().trim();

  // Parse skill set as specializations (if not already set from taxonomy)
  if (row['Skill Set'] && !data.specializations) {
    const skills = row['Skill Set'].toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (skills.length > 0) data.specializations = skills;
  }

  return data;
}

function getTaxonomySpecialization(taxonomyCode: string): string | null {
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
  return specializations[taxonomyCode] || null;
}

function validateCompany(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};
  
  // Debug logging for first few rows
  if (rowNumber <= 5) {
    console.log(`Row ${rowNumber} company data:`, JSON.stringify(row, null, 2));
    console.log(`Available columns in row ${rowNumber}:`, Object.keys(row));
  }

  // Smart company name detection with more variations
  let companyName = row.name || row['Company Name'] || row['Company name'] || 
                   row.company || row['business-name'] || row.company_name ||
                   row.business_name || row.organization_name || row['Organization Name'] ||
                   row['Organization'] || row['Client'] || row['Business Name'] ||
                   row['Firm Name'] || row['Practice Name'] || row['Clinic Name'] ||
                   row['Business'] || row['Employer'] || row['Practice'] || row['Facility'] ||
                   row['Clinic'] || row['Hospital'] || row['Center'] || row['Institute'];
  
  // If no company name found in expected columns, try to find any non-empty string value
  if (!companyName) {
    const values = Object.values(row);
    companyName = values.find(val => 
      val && 
      typeof val === 'string' && 
      val.toString().trim().length > 2 &&
      !val.toString().match(/^\d+$/) && // Not just numbers
      !val.toString().match(/^[A-Z]{2}$/) && // Not just state codes
      !val.toString().match(/^\d{5}(-\d{4})?$/) // Not zip codes
    );
  }
  
  if (!companyName || companyName.toString().trim() === '') {
    console.log(`Available columns in row ${rowNumber}:`, Object.keys(row));
    errors.push({ row: rowNumber, field: 'name', value: companyName, message: 'Company name is required' });
  } else {
    data.name = companyName.toString().trim();
  }

  // Smart company type detection with defaults
  let companyType = row.company_type || row['Company Type'] || row.type || 
                   row.industry || row.Industry || row.categories ||
                   row['SIC Code Description'] || row.business_type;
  
  // Clean up company type
  if (companyType) {
    companyType = companyType.toString().trim();
    // Handle multiple categories separated by commas - take the first one
    if (companyType.includes(',')) {
      companyType = companyType.split(',')[0].trim();
    }
    // Handle URLs in categories (from scraped data)
    if (companyType.includes('http')) {
      companyType = companyType.replace(/https?:\/\/[^\s]+/g, '').trim();
    }
  }
  
  if (!companyType || companyType === '') {
    // Default based on context clues
    if (data.name && (data.name.toLowerCase().includes('physical therapy') || 
                     data.name.toLowerCase().includes('pt ') ||
                     data.name.toLowerCase().includes('rehab'))) {
      companyType = 'Physical Therapy';
    } else if (data.name && data.name.toLowerCase().includes('hospital')) {
      companyType = 'Healthcare';
    } else {
      companyType = 'Healthcare Services'; // Default
    }
  }
  data.company_type = companyType;

  // Smart location parsing
  const address = row.address || row['Mailing Address'] || row['street-address'] || 
                 row.location || row['Location (s)'] || row.Location;
  const city = row.city || row.City || row['Mailing City'] || row.locality;
  const state = row.state || row.State || row['Mailing State'] || row.region;
  const zip = row.zip || row.Zip || row['Mailing Zip Code'] || row.zipcode || row.postal_code;

  // Build location string for duplicate detection
  let locationString = '';
  if (city && state) {
    locationString = `${city.toString().trim()}, ${state.toString().trim()}`;
    if (zip) locationString += ` ${zip.toString().trim()}`;
  } else if (address) {
    locationString = address.toString().trim();
  }
  
  // Store individual location fields
  if (city) data.city = city.toString().trim();
  if (state) data.state = state.toString().trim();
  if (zip) data.zip_code = zip.toString().trim();
  if (address) data.address = address.toString().trim();
  
  // Build company_locations array for geocoding
  if (city && state) {
    data.company_locations = [`${city.toString().trim()}, ${state.toString().trim()}`];
  } else if (state) {
    data.company_locations = [state.toString().trim()];
  } else {
    data.company_locations = [];
  }
  
  // Store location data for duplicate checking
  if (locationString) {
    data._location_key = locationString.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
  }

  // Employee count parsing with range handling
  let employeeCount = row.employee_count || row['# of EEs'] || row.employees || 
                     row['Location Employee Size Range'] || row.size;
  if (employeeCount) {
    const empStr = employeeCount.toString().toLowerCase();
    // Handle ranges like "10 to 19", "1001 to 5000 employees"
    if (empStr.includes(' to ')) {
      const range = empStr.match(/(\d+)\s*to\s*(\d+)/);
      if (range) {
        const min = parseInt(range[1]);
        const max = parseInt(range[2]);
        employeeCount = Math.floor((min + max) / 2); // Use midpoint
      }
    } else {
      const numMatch = empStr.match(/(\d+)/);
      if (numMatch) {
        employeeCount = parseInt(numMatch[1]);
      }
    }
    
    if (!isNaN(employeeCount) && employeeCount > 0) {
      data.employee_count = employeeCount;
    }
  }

  // Website detection
  const website = row.website || row.Website || row['track-visit-website href'] || 
                 row.url || row.homepage || row.web_address;
  if (website && website.toString().trim() !== '' && website.toString().trim() !== 'Not Available') {
    let websiteUrl = website.toString().trim();
    // Ensure proper URL format
    if (!websiteUrl.startsWith('http')) {
      websiteUrl = 'https://' + websiteUrl;
    }
    data.website = websiteUrl;
  }

  // Description/bio detection
  const description = row.description || row.Description || row.bio || row.body || 
                     row.about || row.summary || row.notes;
  if (description && description.toString().trim() !== '') {
    data.description = description.toString().trim();
  }

  // Services/specializations detection
  let services = row.services || row.Services || row.specializations || 
                row.categories || row['categories 2'] || row.offerings;
  if (services) {
    let serviceList = [];
    if (typeof services === 'string') {
      serviceList = services.split(',').map((s: string) => s.trim()).filter(Boolean);
    } else if (Array.isArray(services)) {
      serviceList = services.map((s: any) => s.toString().trim()).filter(Boolean);
    }
    if (serviceList.length > 0) {
      data.services = serviceList;
    }
  }

  // Phone number detection
  const phone = row.phone || row.Phone || row['phone-column'] || row.phones || 
               row['Phone Number Combined'] || row.telephone || row.contact_phone;
  if (phone && phone.toString().trim() !== '' && phone.toString().trim() !== 'Not Available') {
    // Store phone in services array if no dedicated phone field in companies table
    if (!data.services) data.services = [];
    data.services.push(`Phone: ${phone.toString().trim()}`);
  }

  // Founded year detection
  const founded = row.founded_year || row.founded || row.established || row['years-in-business'];
  if (founded) {
    const yearMatch = founded.toString().match(/(\d{4})/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      if (year > 1800 && year <= new Date().getFullYear()) {
        data.founded_year = year;
      }
    }
  }

  // Store locations in company_locations array
  if (locationString && !data.company_locations) {
    data.company_locations = [locationString];
  }

  return data;
}

function validateSchool(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};
  
  console.log(`Row ${rowNumber} data:`, JSON.stringify(row, null, 2));

  // Try different column name variations for school name
  const schoolName = row.name || row.school_name || row.institution || row.school || 
                    row['School Name'] || row['Institution'] || row['Program Name'] || 
                    row['University'] || row['College'];
  
  if (!schoolName || schoolName.toString().trim() === '') {
    console.log(`Available columns in row ${rowNumber}:`, Object.keys(row));
    errors.push({ row: rowNumber, field: 'name', value: schoolName, message: 'School name is required' });
  } else {
    data.name = schoolName.toString().trim();
  }

  // Try to get address components
  const address = row.address || row.location || row['Address'] || row['Location'] || 
                 row['Street Address'] || row['Full Address'];
  const city = row.city || row['City'];
  const state = row.state || row['State'];
  
  // If we have separate city and state, use those
  if (city && state) {
    data.city = city.toString().trim();
    data.state = state.toString().trim();
  } 
  // If we have an address, try to extract city and state from the end
  else if (address) {
    const addressStr = address.toString().trim();
    console.log(`Parsing address: "${addressStr}"`);
    
    // Look for state abbreviation pattern at the end (e.g., "NY 11549", "CA 90210")
    const stateZipMatch = addressStr.match(/\b([A-Z]{2})\s+\d{5}(-\d{4})?\s*$/);
    if (stateZipMatch) {
      const stateAbbr = stateZipMatch[1];
      // Extract city from the part before state
      const beforeState = addressStr.substring(0, stateZipMatch.index).trim();
      // Get the last word/phrase as city
      const cityMatch = beforeState.match(/([^0-9]+)\s*$/);
      if (cityMatch) {
        data.city = cityMatch[1].trim();
        data.state = stateAbbr;
        console.log(`Extracted: City="${data.city}", State="${data.state}"`);
      } else {
        errors.push({ row: rowNumber, field: 'address', value: address, message: 'Cannot extract city from address' });
      }
    } else {
      errors.push({ row: rowNumber, field: 'address', value: address, message: 'Cannot parse city and state from address format' });
    }
  } else {
    errors.push({ row: rowNumber, field: 'location', value: '', message: 'Address, city, or state information is required' });
  }

  // Optional fields
  if (row.description) data.description = row.description.toString().trim();
  if (row.accreditation) data.accreditation = row.accreditation.toString().trim();
  if (row.tuition_per_year) {
    const tuition = parseFloat(row.tuition_per_year);
    if (!isNaN(tuition)) data.tuition_per_year = tuition;
  }
  if (row.program_length_months) {
    const length = parseInt(row.program_length_months);
    if (!isNaN(length)) data.program_length_months = length;
  }
  if (row.faculty_count) {
    const count = parseInt(row.faculty_count);
    if (!isNaN(count)) data.faculty_count = count;
  }
  if (row.average_class_size) {
    const size = parseInt(row.average_class_size);
    if (!isNaN(size)) data.average_class_size = size;
  }

  // Parse arrays
  if (row.programs_offered) {
    const programs = row.programs_offered.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (programs.length > 0) data.programs_offered = programs;
  }
  
  if (row.specializations) {
    const specs = row.specializations.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (specs.length > 0) data.specializations = specs;
  }

  return data;
}

function validateJobListing(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Required fields
  if (!row.title || row.title.trim() === '') {
    errors.push({ row: rowNumber, field: 'title', value: row.title, message: 'Title is required' });
  } else {
    data.title = row.title.trim();
  }

  if (!row.city || row.city.trim() === '') {
    errors.push({ row: rowNumber, field: 'city', value: row.city, message: 'City is required' });
  } else {
    data.city = row.city.trim();
  }

  if (!row.state || row.state.trim() === '') {
    errors.push({ row: rowNumber, field: 'state', value: row.state, message: 'State is required' });
  } else {
    data.state = row.state.trim();
  }

  // Optional fields
  if (row.description) data.description = row.description.toString().trim();
  if (row.requirements) data.requirements = row.requirements.toString().trim();
  if (row.employment_type) data.employment_type = row.employment_type.toString().trim();
  if (row.experience_level) data.experience_level = row.experience_level.toString().trim();
  
  if (row.salary_min) {
    const min = parseInt(row.salary_min);
    if (!isNaN(min)) data.salary_min = min;
  }
  if (row.salary_max) {
    const max = parseInt(row.salary_max);
    if (!isNaN(max)) data.salary_max = max;
  }

  if (row.is_remote !== undefined) {
    data.is_remote = row.is_remote === true || row.is_remote === 'true' || row.is_remote === 'TRUE' || row.is_remote === 1;
  }

  if (row.company_id) {
    data.company_id = row.company_id.toString().trim();
  }

  return data;
}

function validateEquipmentCompany(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Required: name
  if (!row.name || row.name.toString().trim() === '') {
    errors.push({ row: rowNumber, field: 'name', value: row.name, message: 'Company name is required' });
  } else {
    data.name = row.name.toString().trim();
  }

  // Map fields with flexible column matching
  if (row.company_type) data.company_type = row.company_type.toString().trim();
  if (row.description) data.description = row.description.toString().trim();
  if (row.website) data.website = row.website.toString().trim();
  if (row.founded_year) {
    const year = parseInt(row.founded_year);
    if (!isNaN(year) && year > 1800 && year <= new Date().getFullYear()) {
      data.founded_year = year;
    }
  }
  if (row.employee_count) {
    const count = parseInt(row.employee_count);
    if (!isNaN(count) && count > 0) data.employee_count = count;
  }

  // Parse arrays
  if (row.equipment_categories) {
    const categories = row.equipment_categories.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (categories.length > 0) data.equipment_categories = categories;
  }
  if (row.product_lines) {
    const lines = row.product_lines.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (lines.length > 0) data.product_lines = lines;
  }
  if (row.target_markets) {
    const markets = row.target_markets.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (markets.length > 0) data.target_markets = markets;
  }
  if (row.certifications) {
    const certs = row.certifications.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (certs.length > 0) data.certifications = certs;
  }

  // Location fields
  if (row.address) data.address = row.address.toString().trim();
  if (row.city) data.city = row.city.toString().trim();
  if (row.state) data.state = row.state.toString().trim();
  if (row.zip_code) data.zip_code = row.zip_code.toString().trim();
  if (row.phone) data.phone = row.phone.toString().trim();
  if (row.email) data.email = row.email.toString().trim();
  if (row.linkedin_url) data.linkedin_url = row.linkedin_url.toString().trim();

  return data;
}

function validateConsultantCompany(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Name handling - flexible for different formats
  if (row.first_name || row.last_name) {
    if (row.first_name) data.first_name = row.first_name.toString().trim();
    if (row.last_name) data.last_name = row.last_name.toString().trim();
    data.name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
  } else if (row.name) {
    data.name = row.name.toString().trim();
    const nameParts = data.name.split(' ');
    if (nameParts.length >= 2) {
      data.first_name = nameParts[0];
      data.last_name = nameParts.slice(1).join(' ');
    }
  } else {
    errors.push({ row: rowNumber, field: 'name', value: '', message: 'Name is required' });
  }

  // Contact info
  if (row.email) data.email = row.email.toString().trim();
  if (row.phone) data.phone = row.phone.toString().trim();
  if (row.company) data.company = row.company.toString().trim();
  if (row.title) data.title = row.title.toString().trim();

  // Experience
  if (row.years_experience) {
    const exp = parseInt(row.years_experience);
    if (!isNaN(exp) && exp >= 0) data.years_experience = exp;
  }
  if (row.bio) data.bio = row.bio.toString().trim();

  // Arrays - consulting_categories instead of specializations
  if (row.consulting_categories) {
    const categories = row.consulting_categories.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (categories.length > 0) data.consulting_categories = categories;
  }
  if (row.industries) {
    const industries = row.industries.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (industries.length > 0) data.industries = industries;
  }
  if (row.territories) {
    const territories = row.territories.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (territories.length > 0) data.territories = territories;
  }
  if (row.certifications) {
    const certs = row.certifications.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (certs.length > 0) data.certifications = certs;
  }

  // Location
  if (row.city) data.city = row.city.toString().trim();
  if (row.state) data.state = row.state.toString().trim();
  if (row.zip_code) data.zip_code = row.zip_code.toString().trim();
  if (row.website) data.website = row.website.toString().trim();
  if (row.linkedin_url) data.linkedin_url = row.linkedin_url.toString().trim();

  return data;
}

function validatePeFirm(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Required: name
  if (!row.name || row.name.toString().trim() === '') {
    errors.push({ row: rowNumber, field: 'name', value: row.name, message: 'Firm name is required' });
  } else {
    data.name = row.name.toString().trim();
  }

  // Basic info
  if (row.firm_type) data.firm_type = row.firm_type.toString().trim();
  if (row.description) data.description = row.description.toString().trim();
  if (row.website) data.website = row.website.toString().trim();
  
  if (row.founded_year) {
    const year = parseInt(row.founded_year);
    if (!isNaN(year) && year > 1800 && year <= new Date().getFullYear()) {
      data.founded_year = year;
    }
  }

  // Financial info
  if (row.total_aum) {
    const aum = parseFloat(row.total_aum);
    if (!isNaN(aum) && aum > 0) data.total_aum = aum;
  }
  if (row.typical_deal_size_min) {
    const min = parseFloat(row.typical_deal_size_min);
    if (!isNaN(min) && min > 0) data.typical_deal_size_min = min;
  }
  if (row.typical_deal_size_max) {
    const max = parseFloat(row.typical_deal_size_max);
    if (!isNaN(max) && max > 0) data.typical_deal_size_max = max;
  }

  // Boolean fields
  if (row.healthcare_focus !== undefined) {
    data.healthcare_focus = row.healthcare_focus === true || row.healthcare_focus === 'true' || row.healthcare_focus === 'TRUE' || row.healthcare_focus === 1;
  }

  // Arrays
  if (row.investment_stage) {
    const stages = row.investment_stage.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (stages.length > 0) data.investment_stage = stages;
  }
  if (row.geographic_focus) {
    const geo = row.geographic_focus.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (geo.length > 0) data.geographic_focus = geo;
  }
  if (row.sector_focus) {
    const sectors = row.sector_focus.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (sectors.length > 0) data.sector_focus = sectors;
  }
  if (row.portfolio_companies) {
    const companies = row.portfolio_companies.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (companies.length > 0) data.portfolio_companies = companies;
  }

  // Location
  if (row.address) data.address = row.address.toString().trim();
  if (row.city) data.city = row.city.toString().trim();
  if (row.state) data.state = row.state.toString().trim();
  if (row.zip_code) data.zip_code = row.zip_code.toString().trim();
  if (row.phone) data.phone = row.phone.toString().trim();
  if (row.email) data.email = row.email.toString().trim();
  if (row.linkedin_url) data.linkedin_url = row.linkedin_url.toString().trim();

  return data;
}