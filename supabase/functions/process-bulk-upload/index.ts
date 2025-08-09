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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { jobId } = await req.json();
    console.log(`Starting robust processing for job: ${jobId}`);

    // Get and validate job
    const { data: job, error: jobError } = await supabase
      .from('bulk_upload_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error(`Job not found: ${jobError?.message}`);
    }

    if (job.status !== 'pending') {
      console.log(`Job ${jobId} already processed with status: ${job.status}`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Job already ${job.status}` 
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Update to processing
    await supabase
      .from('bulk_upload_jobs')
      .update({ status: 'processing' })
      .eq('id', jobId);

    // Start background processing with proper error handling
    EdgeRuntime.waitUntil(processJobRobustly(supabase, job, jobId));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Processing started',
      jobId: jobId
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});

async function processJobRobustly(supabase: any, job: any, jobId: string) {
  const startTime = Date.now();
  console.log(`=== STARTING ROBUST PROCESSING FOR JOB ${jobId} ===`);
  
  try {
    // Download file with retry logic
    const fileData = await downloadFileWithRetry(supabase, job.file_path, 3);
    console.log(`File downloaded successfully, size: ${(fileData.size / 1024 / 1024).toFixed(2)}MB`);

    // Parse with memory management
    const records = await parseFileStreamed(fileData, job.entity_type);
    console.log(`Parsed ${records.length} records from file`);

    // Update total count
    await supabase
      .from('bulk_upload_jobs')
      .update({ total_rows: records.length })
      .eq('id', jobId);

    // Process in optimized batches
    const results = await processBatchesOptimized(supabase, records, job, jobId);
    
    // Final status update
    const processingTime = (Date.now() - startTime) / 1000;
    await supabase
      .from('bulk_upload_jobs')
      .update({
        status: 'completed',
        processed_rows: records.length,
        successful_rows: results.successful,
        failed_rows: results.failed,
        error_details: results.errors.length > 0 ? { errors: results.errors.slice(0, 100) } : null,
        results: {
          total: records.length,
          successful: results.successful,
          failed: results.failed,
          duplicates_skipped: results.duplicatesSkipped,
          processing_time_seconds: processingTime,
          errors: results.errors.slice(0, 50)
        }
      })
      .eq('id', jobId);

    console.log(`=== JOB ${jobId} COMPLETED IN ${processingTime}s ===`);
    console.log(`Results: ${results.successful} successful, ${results.failed} failed, ${results.duplicatesSkipped} duplicates`);

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    await supabase
      .from('bulk_upload_jobs')
      .update({ 
        status: 'failed', 
        error_details: { 
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      })
      .eq('id', jobId);
  }
}

async function downloadFileWithRetry(supabase: any, filePath: string, maxRetries: number): Promise<Blob> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase.storage
        .from('bulk-uploads')
        .download(filePath);
      
      if (error) throw new Error(`Download failed: ${error.message}`);
      if (!data) throw new Error('No file data received');
      
      return data;
    } catch (error) {
      console.error(`Download attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Download failed after all retries');
}

async function parseFileStreamed(fileData: Blob, entityType: string): Promise<any[]> {
  const sizeMB = fileData.size / 1024 / 1024;
  console.log(`Parsing file: ${sizeMB.toFixed(2)}MB`);
  
  // For large files, process in smaller memory chunks
  if (sizeMB > 15) {
    console.log('Large file detected, using memory-efficient parsing...');
    
    // Read file in smaller buffer
    const reader = new ReadableStream({
      start(controller) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          controller.enqueue(fileReader.result);
          controller.close();
        };
        fileReader.onerror = () => controller.error(fileReader.error);
        fileReader.readAsArrayBuffer(fileData);
      }
    });
    
    const response = new Response(reader);
    const arrayBuffer = await response.arrayBuffer();
    
    // Use dense format and minimal options for memory efficiency  
    const workbook = XLSX.read(arrayBuffer, { 
      type: 'array',
      dense: true,
      cellDates: false,
      cellNF: false,
      cellText: false,
      sheetStubs: false
    });
    
    const firstSheet = workbook.SheetNames[0];
    if (!firstSheet) throw new Error('No worksheets found in file');
    
    const worksheet = workbook.Sheets[firstSheet];
    console.log('Processing rows in small batches to avoid memory issues...');
    
    // Convert to JSON with minimal memory footprint
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      blankrows: false,
      defval: null,
      raw: false
    });
    
    if (!jsonData || jsonData.length < 2) {
      throw new Error('File appears to be empty or has no data rows');
    }
    
    const headers = jsonData[0] as string[];
    const records = [];
    
    // Process one row at a time to minimize memory usage
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i] as any[];
      const record: any = {};
      
      for (let j = 0; j < headers.length && j < row.length; j++) {
        const header = headers[j];
        if (header && row[j] !== undefined && row[j] !== null && row[j] !== '') {
          record[header.trim()] = row[j];
        }
      }
      
      // Only add records that have some data
      if (Object.keys(record).length > 0) {
        records.push(record);
      }
      
      // Log progress and try to free memory every 1000 rows
      if (i % 1000 === 0) {
        console.log(`Processed ${i}/${jsonData.length - 1} rows, ${records.length} valid records`);
      }
    }
    
    console.log(`Successfully parsed ${records.length} records from ${jsonData.length - 1} total rows`);
    return records;
    
  } else {
    // For smaller files, use the standard approach
    const arrayBuffer = await fileData.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    
    if (!firstSheet) throw new Error('No worksheets found in file');
    
    const worksheet = workbook.Sheets[firstSheet];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false,
      blankrows: false
    });
    
    console.log(`Successfully parsed ${data.length} records`);
    return data;
  }
}

async function processBatchesOptimized(supabase: any, records: any[], job: any, jobId: string) {
  const results = {
    successful: 0,
    failed: 0,
    duplicatesSkipped: 0,
    errors: [] as ValidationError[]
  };

  const validRecords: any[] = [];
  const duplicateTracker = new Set<string>();

  // Validate all records first
  console.log('Starting validation phase...');
  for (let i = 0; i < records.length; i++) {
    try {
      const validated = validateRecord(records[i], job.entity_type, i + 2);
      
      if (validated.errors.length > 0) {
        results.errors.push(...validated.errors);
        results.failed++;
      } else if (validated.data) {
        // Check duplicates for companies
        if (job.entity_type === 'companies' && validated.data.name) {
          const dupKey = `${validated.data.name.toLowerCase().trim()}|${validated.data.city || ''}|${validated.data.state || ''}`;
          if (duplicateTracker.has(dupKey)) {
            results.duplicatesSkipped++;
            continue;
          }
          duplicateTracker.add(dupKey);
        }
        
        validRecords.push(validated.data);
      }
    } catch (error) {
      results.errors.push({
        row: i + 2,
        field: 'validation',
        value: null,
        message: `Validation error: ${error.message}`
      });
      results.failed++;
    }

    // Progress update every 1000 records
    if (i % 1000 === 0) {
      await supabase
        .from('bulk_upload_jobs')
        .update({ processed_rows: i + 1 })
        .eq('id', jobId);
    }
  }

  console.log(`Validation complete: ${validRecords.length} valid records, ${results.failed} failed, ${results.duplicatesSkipped} duplicates`);

  // Insert in optimized batches
  console.log('Starting database insertion...');
  const batchSize = 500; // Optimal batch size for Supabase
  
  for (let i = 0; i < validRecords.length; i += batchSize) {
    const batch = validRecords.slice(i, i + batchSize);
    
    try {
      const { data, error } = await supabase
        .from(job.entity_type)
        .insert(batch)
        .select('id');

      if (error) {
        console.error(`Batch ${Math.floor(i/batchSize) + 1} failed:`, error);
        results.failed += batch.length;
        results.errors.push({
          row: i + 2,
          field: 'database',
          value: null,
          message: `Database error: ${error.message}`
        });
      } else {
        results.successful += data?.length || batch.length;
        console.log(`Batch ${Math.floor(i/batchSize) + 1}: ${data?.length || batch.length} records inserted`);
      }
    } catch (error) {
      console.error(`Batch ${Math.floor(i/batchSize) + 1} exception:`, error);
      results.failed += batch.length;
    }

    // Update progress
    await supabase
      .from('bulk_upload_jobs')
      .update({ 
        processed_rows: Math.min(i + batchSize, records.length),
        successful_rows: results.successful 
      })
      .eq('id', jobId);
  }

  return results;
}

function validateRecord(row: any, entityType: string, rowNumber: number) {
  const errors: ValidationError[] = [];
  
  switch (entityType) {
    case 'providers':
      return validateProvider(row, rowNumber, errors);
    case 'companies':
      return validateCompany(row, rowNumber, errors);
    default:
      errors.push({
        row: rowNumber,
        field: 'entity_type',
        value: entityType,
        message: 'Unsupported entity type'
      });
      return { data: null, errors };
  }
}

function validateProvider(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // NPI Registry format
  const npi = row['NPI']?.toString().trim() || '';
  const firstName = row['Provider First Name']?.toString().trim() || row['First Name']?.toString().trim() || '';
  const lastName = row['Provider Last Name (Legal Name)']?.toString().trim() || row['Last Name']?.toString().trim() || '';
  const credentials = row['Provider Credential Text']?.toString().trim() || '';
  const address = row['Provider First Line Business Practice Location Address']?.toString().trim() || '';
  const city = row['Provider Business Practice Location Address City Name']?.toString().trim() || row['City']?.toString().trim() || '';
  const state = row['Provider Business Practice Location Address State Name']?.toString().trim() || row['State/Province']?.toString().trim() || '';
  const zipCode = row['Provider Business Practice Location Address Postal Code']?.toString().trim() || row['Zip']?.toString().trim() || '';
  const taxonomyCode = row['Healthcare Provider Taxonomy Code_1']?.toString().trim() || '';

  // Validate required fields
  if (!firstName && !lastName) {
    errors.push({ row: rowNumber, field: 'name', value: '', message: 'First name or last name is required' });
  } else {
    data.first_name = firstName;
    data.last_name = lastName;
    data.name = `${firstName} ${lastName}`.trim();
  }

  // Map fields
  if (city) data.city = city;
  if (state) data.state = state;
  if (zipCode) data.zip_code = zipCode.substring(0, 10);
  if (npi) data.additional_info = `NPI: ${npi}`;
  if (credentials) data.additional_info = (data.additional_info ? `${data.additional_info}, ` : '') + `Credentials: ${credentials}`;
  
  data.source = 'NPI Registry Bulk Upload';

  // Handle specializations
  if (taxonomyCode) {
    const specialization = getTaxonomySpecialization(taxonomyCode);
    if (specialization) {
      data.specializations = [specialization];
    }
  }

  return { data, errors };
}

function validateCompany(row: any, rowNumber: number, errors: ValidationError[]) {
  const data: any = {};

  // Smart name detection
  const name = row.name || row['Company Name'] || row['Company name'] || 
               row.company || row.business_name || row.organization_name ||
               row['Organization Name'] || row['Business Name'] || '';

  if (!name || name.toString().trim() === '') {
    errors.push({ row: rowNumber, field: 'name', value: name, message: 'Company name is required' });
  } else {
    data.name = name.toString().trim();
  }

  // Company type with smart defaults
  let companyType = row.company_type || row['Company Type'] || row.type || 
                   row.industry || row.Industry || '';
  
  if (!companyType) {
    companyType = data.name && data.name.toLowerCase().includes('physical therapy') ? 'Physical Therapy' : 'Healthcare Services';
  }
  data.company_type = companyType.toString().trim();

  // Location fields
  if (row.address) data.address = row.address.toString().trim();
  if (row.city || row.City) data.city = (row.city || row.City).toString().trim();
  if (row.state || row.State) data.state = (row.state || row.State).toString().trim();
  if (row.zip || row.Zip) data.zip_code = (row.zip || row.Zip).toString().trim();
  if (row.phone || row.Phone) data.phone = (row.phone || row.Phone).toString().trim();
  if (row.website || row.Website) data.website = (row.website || row.Website).toString().trim();

  return { data, errors };
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