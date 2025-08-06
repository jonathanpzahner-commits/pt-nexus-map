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

    // Parse Excel file
    const arrayBuffer = await fileData.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Parsed ${jsonData.length} rows from Excel file`);

    // Update total rows
    await supabase
      .from('bulk_upload_jobs')
      .update({ total_rows: jsonData.length })
      .eq('id', jobId);

    const validationErrors: ValidationError[] = [];
    const validRecords: any[] = [];

    // Validate and process data based on entity type
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i] as any;
      const rowNumber = i + 2; // Excel rows start at 1, header is row 1

      try {
        const validatedRecord = validateAndTransformRecord(row, job.entity_type, rowNumber);
        if (validatedRecord.errors.length > 0) {
          validationErrors.push(...validatedRecord.errors);
        } else {
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

    console.log(`Validated ${validRecords.length} records, ${validationErrors.length} errors`);

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
          errors: validationErrors.slice(0, 50) // Limit errors stored
        }
      })
      .eq('id', jobId);

    console.log(`Job completed: ${successfulInserts} successful, ${validationErrors.length} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: jsonData.length,
        successful: successfulInserts,
        failed: validationErrors.length
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

  // Required fields - either use combined name or first/last name
  const firstName = row['First Name']?.toString().trim() || '';
  const lastName = row['Last Name']?.toString().trim() || '';
  
  if (!firstName && !lastName) {
    errors.push({ row: rowNumber, field: 'name', value: '', message: 'First name or last name is required' });
  } else {
    data.first_name = firstName;
    data.last_name = lastName;
    data.name = `${firstName} ${lastName}`.trim(); // Create combined name for compatibility
  }

  // Map user's column headers to database fields
  if (row.Email) data.email = row.Email.toString().trim();
  if (row.Phone) data.phone = row.Phone.toString().trim();
  if (row.City) data.city = row.City.toString().trim();
  if (row['State/Province']) data.state = row['State/Province'].toString().trim();
  if (row.Zip) data.zip_code = row.Zip.toString().trim();
  if (row['Current Employer']) data.current_employer = row['Current Employer'].toString().trim();
  if (row['Current Job Title']) data.current_job_title = row['Current Job Title'].toString().trim();
  if (row['Additional Info']) {
    data.additional_info = row['Additional Info'].toString().trim();
    data.bio = row['Additional Info'].toString().trim(); // Also map to bio for compatibility
  }
  if (row.Source) data.source = row.Source.toString().trim();
  if (row.LinkedIn) data.linkedin_url = row.LinkedIn.toString().trim();

  // Parse skill set as specializations
  if (row['Skill Set']) {
    const skills = row['Skill Set'].toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (skills.length > 0) data.specializations = skills;
  }

  return data;
}

function validateCompany(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Required fields
  if (!row.name || row.name.trim() === '') {
    errors.push({ row: rowNumber, field: 'name', value: row.name, message: 'Name is required' });
  } else {
    data.name = row.name.trim();
  }

  if (!row.company_type || row.company_type.trim() === '') {
    errors.push({ row: rowNumber, field: 'company_type', value: row.company_type, message: 'Company type is required' });
  } else {
    data.company_type = row.company_type.trim();
  }

  // Optional fields
  if (row.description) data.description = row.description.toString().trim();
  if (row.website) data.website = row.website.toString().trim();
  if (row.founded_year) {
    const year = parseInt(row.founded_year);
    if (!isNaN(year)) data.founded_year = year;
  }
  if (row.employee_count) {
    const count = parseInt(row.employee_count);
    if (!isNaN(count)) data.employee_count = count;
  }

  // Parse arrays
  if (row.services) {
    const services = row.services.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (services.length > 0) data.services = services;
  }
  
  if (row.company_locations) {
    const locations = row.company_locations.toString().split(',').map((s: string) => s.trim()).filter(Boolean);
    if (locations.length > 0) data.company_locations = locations;
  }

  return data;
}

function validateSchool(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Required fields
  if (!row.name || row.name.trim() === '') {
    errors.push({ row: rowNumber, field: 'name', value: row.name, message: 'Name is required' });
  } else {
    data.name = row.name.trim();
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